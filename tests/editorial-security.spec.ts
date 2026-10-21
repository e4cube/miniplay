import { expect, test } from '@playwright/test';
import { allowLoginAttempt, signSession, verifySession } from '../src/lib/editorial/auth-core';
import { validateEditorialInput } from '../src/lib/editorial/validation';
import { addToManifest, articlePath } from '../src/lib/editorial/manifest';
import { publishArticle, PublishError } from '../src/lib/editorial/github';

const secret = 'editorial-test-secret-12345678901234567890';
const sha = (letter: string) => letter.repeat(40);
const article = validateEditorialInput({ slug: 'original-game-report', locale: 'en', kind: 'news',
  title: 'An Original Game Report', excerpt: 'An original summary of the game and the details that players should know.',
  body: 'A carefully written original paragraph with useful context for players. '.repeat(9),
  videoUrl: null, publishedAt: '2026-10-20', updatedAt: '2026-10-20' });
const manifest = '// BEGIN EDITORIAL IMPORTS\n// END EDITORIAL IMPORTS\nexport const editorialSources: unknown[] = [\n  // BEGIN EDITORIAL SOURCES\n  // END EDITORIAL SOURCES\n];\n';

test('signed admin sessions expire, reject tampering, and reject other users', () => {
  const signed = signSession(123, secret, 1000);
  expect(verifySession(signed, secret, 123, 1001)).toBe(true);
  expect(verifySession(signed, secret, 456, 1001)).toBe(false);
  expect(verifySession(signed, secret, 123, 1000 + 12 * 60 * 60 * 1000)).toBe(false);
  expect(verifySession(`${signed}x`, secret, 123, 1001)).toBe(false);
});

test('login attempt backstop limits repeated requests', () => {
  const ip = `editorial-test-${Date.now()}`;
  for (let i = 0; i < 5; i++) expect(allowLoginAttempt(ip)).toBe(true);
  expect(allowLoginAttempt(ip)).toBe(false);
});

test('validation rejects invalid and low-quality article inputs', () => {
  for (const [field, value] of [['slug', '../unsafe'], ['title', 'Short'], ['body', 'Too short'],
    ['videoUrl', 'https://evil.example/video'], ['publishedAt', '2026-02-30']] as const) {
    expect(() => validateEditorialInput({ ...article, [field]: value })).toThrow();
  }
  expect(articlePath({ ...article, locale: 'zh-CN' })).toBe('content/posts/original-game-report.zh-CN.json');
  expect(() => addToManifest(addToManifest(manifest, article), article)).toThrow('ALREADY_EXISTS');
});

function githubMock(protectedBranch = false, failAt?: string) {
  const calls: { url: string; method: string; body?: Record<string, unknown> }[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method || 'GET';
    const body = init?.body ? JSON.parse(String(init.body)) as Record<string, unknown> : undefined;
    calls.push({ url, method, body });
    const result = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status });
    if (failAt && url.endsWith(failAt)) return result({ message: 'token SECRET-DO-NOT-RETURN' }, 500);
    if (url.endsWith('/branches/main')) return result({ protected: protectedBranch });
    if (url.endsWith('/git/ref/heads/main')) return result({ object: { sha: sha('a') } });
    if (url.endsWith(`/git/commits/${sha('a')}`)) return result({ tree: { sha: sha('b') } });
    if (url.includes('/contents/content/posts/') && !url.includes('index.ts')) return result({}, 404);
    if (url.includes('/contents/content/posts/index.ts')) return result({ content: Buffer.from(manifest).toString('base64'), encoding: 'base64' });
    if (url.endsWith('/git/trees')) return result({ sha: sha('c') });
    if (url.endsWith('/git/commits')) return result({ sha: sha('d') });
    if (url.endsWith('/git/refs/heads/main')) return result({}, 200);
    if (url.endsWith('/git/refs')) return result({}, 201);
    if (url.endsWith('/pulls')) return result({ html_url: 'https://github.com/example/repo/pull/1' }, 201);
    return result({}, 500);
  }) as typeof fetch;
  return { fetcher, calls };
}

test('GitHub publishing commits JSON and manifest atomically for both locales', async () => {
  process.env.EDITORIAL_GITHUB_REPO = 'example/repo';
  process.env.EDITORIAL_GITHUB_BRANCH = 'main';
  process.env.EDITORIAL_GITHUB_TOKEN = 'SECRET-DO-NOT-RETURN';
  for (const locale of ['en', 'zh-CN'] as const) {
    const mock = githubMock();
    const result = await publishArticle({ ...article, locale }, mock.fetcher);
    expect(result).toEqual({ mode: 'published', url: `${locale === 'zh-CN' ? '/zh' : ''}/blog/${article.slug}` });
    const tree = mock.calls.find(call => call.url.endsWith('/git/trees'))?.body as { tree: { path: string; content: string }[] };
    expect(tree.tree.map(entry => entry.path)).toEqual([`content/posts/${article.slug}.${locale}.json`, 'content/posts/index.ts']);
    expect(tree.tree[1].content).toContain(`${article.slug}.${locale}.json`);
    expect(mock.calls.find(call => call.url.endsWith('/git/commits'))?.body?.parents).toEqual([sha('a')]);
    expect(mock.calls.find(call => call.url.endsWith('/git/refs/heads/main'))?.body?.force).toBe(false);
  }
});

test('protected branch creates draft review PR without updating main', async () => {
  const mock = githubMock(true);
  const result = await publishArticle(article, mock.fetcher);
  expect(result.mode).toBe('review');
  expect(result.pullRequestUrl).toContain('/pull/1');
  expect(mock.calls.some(call => call.method === 'PATCH')).toBe(false);
  expect(mock.calls.find(call => call.url.endsWith('/pulls'))?.body?.draft).toBe(true);
});

test('existing article slug is rejected before creating a Git tree', async () => {
  const mock = githubMock();
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input).includes('/contents/content/posts/original-game-report.en.json'))
      return new Response(JSON.stringify({ path: articlePath(article) }), { status: 200 });
    return mock.fetcher(input, init);
  }) as typeof fetch;
  await expect(publishArticle(article, fetcher)).rejects.toMatchObject({ code: 'ALREADY_EXISTS' });
  expect(mock.calls.some(call => call.url.endsWith('/git/trees'))).toBe(false);
});

test('GitHub API errors do not leak credentials or update the branch', async () => {
  const mock = githubMock(false, '/git/trees');
  await expect(publishArticle(article, mock.fetcher)).rejects.toMatchObject({ code: 'GITHUB_UNAVAILABLE' } satisfies Partial<PublishError>);
  expect(mock.calls.some(call => call.method === 'PATCH')).toBe(false);
  try { await publishArticle(article, mock.fetcher); }
  catch (error) { expect(String(error)).not.toContain('SECRET-DO-NOT-RETURN'); }
});

