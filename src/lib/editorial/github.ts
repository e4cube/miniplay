import { randomBytes } from 'node:crypto';
import { addToManifest, articlePath } from './manifest';
import type { EditorialInput } from './validation';

type Fetcher = typeof fetch;
type GithubConfig = { repo: string; branch: string; token: string };
export type PublishResult = { mode: 'published' | 'review'; url: string; pullRequestUrl?: string };
export class PublishError extends Error {
  constructor(public readonly code: string, message: string) { super(message); }
}

function config(): GithubConfig {
  const repo = process.env.EDITORIAL_GITHUB_REPO || '';
  const branch = process.env.EDITORIAL_GITHUB_BRANCH || 'main';
  const token = process.env.EDITORIAL_GITHUB_TOKEN || '';
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo) || !/^[A-Za-z0-9_.\/-]+$/.test(branch) || !token)
    throw new PublishError('NOT_CONFIGURED', 'GitHub publishing is not configured.');
  return { repo, branch, token };
}

async function github(path: string, cfg: GithubConfig, fetcher: Fetcher, init: RequestInit = {}) {
  try {
    return await fetcher(`https://api.github.com/repos/${cfg.repo}${path}`, {
      ...init, cache: 'no-store', signal: AbortSignal.timeout(10000),
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${cfg.token}`,
        'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json', ...init.headers },
    });
  } catch {
    throw new PublishError('GITHUB_UNAVAILABLE', 'GitHub did not respond. No article was published.');
  }
}

async function jsonOrError<T>(response: Response, code: string, message: string): Promise<T> {
  if (!response.ok) throw new PublishError(code, message);
  try { return await response.json() as T; }
  catch { throw new PublishError(code, message); }
}

export async function publishArticle(article: EditorialInput, fetcher: Fetcher = fetch): Promise<PublishResult> {
  const cfg = config();
  const encodedBranch = cfg.branch.split('/').map(encodeURIComponent).join('/');
  const branchInfo = await jsonOrError<{ protected: boolean }>(
    await github(`/branches/${encodedBranch}`, cfg, fetcher), 'GITHUB_UNAVAILABLE',
    'Could not verify branch protection; publishing was not attempted.');
  if (typeof branchInfo.protected !== 'boolean')
    throw new PublishError('GITHUB_UNAVAILABLE', 'Branch protection status is unknown; publishing was not attempted.');
  const ref = await jsonOrError<{ object: { sha: string } }>(
    await github(`/git/ref/heads/${encodedBranch}`, cfg, fetcher), 'GITHUB_UNAVAILABLE', 'Could not read the publishing branch.');
  const parent = ref.object.sha;
  if (!/^[a-f0-9]{40}$/.test(parent)) throw new PublishError('GITHUB_UNAVAILABLE', 'GitHub returned an invalid branch.');
  const commit = await jsonOrError<{ tree: { sha: string } }>(
    await github(`/git/commits/${parent}`, cfg, fetcher), 'GITHUB_UNAVAILABLE', 'Could not read the latest commit.');
  const path = articlePath(article);
  const existing = await github(`/contents/${path}?ref=${encodeURIComponent(cfg.branch)}`, cfg, fetcher);
  if (existing.ok) throw new PublishError('ALREADY_EXISTS', 'This language and slug already have a published article.');
  if (existing.status !== 404) throw new PublishError('GITHUB_UNAVAILABLE', 'Could not check for duplicate articles.');
  const manifestResponse = await github(`/contents/content/posts/index.ts?ref=${encodeURIComponent(cfg.branch)}`, cfg, fetcher);
  const manifestFile = await jsonOrError<{ content: string; encoding: string }>(manifestResponse,
    'GITHUB_UNAVAILABLE', 'Could not read the article manifest.');
  if (manifestFile.encoding !== 'base64' || typeof manifestFile.content !== 'string')
    throw new PublishError('GITHUB_UNAVAILABLE', 'GitHub returned an invalid article manifest.');
  let manifest: string;
  try { manifest = Buffer.from(manifestFile.content.replace(/\s/g, ''), 'base64').toString('utf8'); }
  catch { throw new PublishError('GITHUB_UNAVAILABLE', 'GitHub returned an invalid article manifest.'); }
  let updatedManifest: string;
  try { updatedManifest = addToManifest(manifest, article); }
  catch (error) {
    if (error instanceof Error && error.message === 'ALREADY_EXISTS')
      throw new PublishError('ALREADY_EXISTS', 'This language and slug already have a published article.');
    throw new PublishError('MANIFEST_FORMAT', 'Article manifest format has changed; contact a developer.');
  }
  const tree = await jsonOrError<{ sha: string }>(await github('/git/trees', cfg, fetcher, {
    method: 'POST', body: JSON.stringify({ base_tree: commit.tree.sha, tree: [
      { path, mode: '100644', type: 'blob', content: `${JSON.stringify(article, null, 2)}\n` },
      { path: 'content/posts/index.ts', mode: '100644', type: 'blob', content: updatedManifest },
    ] }),
  }), 'GITHUB_UNAVAILABLE', 'Could not prepare the atomic article commit.');
  const created = await jsonOrError<{ sha: string }>(await github('/git/commits', cfg, fetcher, {
    method: 'POST', body: JSON.stringify({ message: `Publish ${article.locale} article: ${article.slug}`,
      tree: tree.sha, parents: [parent] }),
  }), 'GITHUB_UNAVAILABLE', 'Could not create the article commit.');
  const articleUrl = `${article.locale === 'zh-CN' ? '/zh' : ''}/blog/${article.slug}`;
  if (!branchInfo.protected) {
    const update = await github(`/git/refs/heads/${encodedBranch}`, cfg, fetcher, {
      method: 'PATCH', body: JSON.stringify({ sha: created.sha, force: false }),
    });
    if (update.ok) return { mode: 'published', url: articleUrl };
    if (update.status === 409) throw new PublishError('CONFLICT', 'The publishing branch changed. Retry to avoid overwriting another article.');
    if (update.status !== 403 && update.status !== 422)
      throw new PublishError('GITHUB_UNAVAILABLE', 'GitHub rejected the branch update. No article was published.');
  }

  // Protected branches are never force-updated. A complete commit can be reviewed as one PR.
  const reviewBranch = `editorial/${Date.now()}-${randomBytes(4).toString('hex')}`;
  const createdRef = await github('/git/refs', cfg, fetcher, {
    method: 'POST', body: JSON.stringify({ ref: `refs/heads/${reviewBranch}`, sha: created.sha }),
  });
  if (!createdRef.ok) throw new PublishError('BRANCH_PROTECTED',
    'Direct publishing was rejected and a review branch could not be created. Check GitHub token permissions.');
  const pull = await github('/pulls', cfg, fetcher, { method: 'POST', body: JSON.stringify({
    title: `Publish ${article.locale} article: ${article.title}`, head: reviewBranch, base: cfg.branch,
    body: `Editorial article ${path}. The JSON file and manifest are in one commit.`, draft: true,
  }) });
  if (!pull.ok) throw new PublishError('REVIEW_REQUIRED',
    `Direct publishing is protected. Review branch ${reviewBranch} was created, but the token cannot open a pull request.`);
  const pr = await pull.json() as { html_url?: string };
  return { mode: 'review', url: articleUrl, pullRequestUrl: pr.html_url };
}
