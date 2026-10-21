# GameVado editorial publishing

The private dashboard is `/admin/editorial`. It uses GitHub OAuth for the one configured administrator; visitors and players can still browse without accounts. Articles remain Git-managed JSON in `content/posts/` and approved imports in `content/posts/index.ts`. No Supabase data is used.

## One-time production setup

1. Create a GitHub OAuth App under the administrator's GitHub account. Set homepage to `https://gamevado.com` and callback to `https://gamevado.com/api/editorial/auth/callback`. Copy its client ID and secret to Vercel server environment variables. Find the administrator's **numeric GitHub user ID** from the GitHub API, not their changeable username.
2. Create a fine-grained GitHub personal access token for **only** `jin123yi123-sudo/miniplay`. Repository permissions: **Contents: read and write**. If protected-branch fallback should open draft PRs, add **Pull requests: read and write**. No organization-wide or classic `repo` token is needed. Give the token to the deployment environment only; rotate it if exposed.
3. Configure all `EDITORIAL_*` entries from `.env.example` in Vercel for the production environment. Set `EDITORIAL_ORIGIN=https://gamevado.com`, repo to `jin123yi123-sudo/miniplay`, branch to the actual deployment branch (normally `main`), and `EDITORIAL_SESSION_SECRET` to at least 32 random bytes (for example, a 64-character hexadecimal string). Never prefix these with `NEXT_PUBLIC_` or paste them into the browser.
4. Ensure the Vercel project is connected to that repository and builds on commits to the configured branch. A successful Git ref update should then trigger a normal deployment. The dashboard reports a repository commit, not deployment completion; verify the live page after Vercel finishes. If branch protection rejects direct writes, the dashboard creates a complete draft pull request instead. Review and merge it through normal branch rules; it **does not** bypass protection or deploy automatically.
5. Add a distributed Vercel Firewall rule for the OAuth login and callback paths, for example a per-IP limit of 10 requests in 15 minutes, plus a bot challenge if abuse appears. The app also has a per-instance backstop (5 per IP and 30 total attempts per 15 minutes), but serverless instances do not share that counter. GitHub handles password attempts; this application never receives a GitHub password.

For local development, use a separate GitHub OAuth App callback at `http://localhost:3000/api/editorial/auth/callback`, `EDITORIAL_ORIGIN=http://localhost:3000`, and a token scoped to a disposable test repository. Do not test publishing against production `main`.

## Editing and publishing

Sign in at `/admin/editorial`, fill the English or Chinese form, and preview before publishing. Required fields: title (12–140 characters), URL slug (lowercase words separated by hyphens), excerpt (40–320), plain-text body (400–50,000), locale (`en` or `zh-CN`), kind (`news`, `review`, `guide`), and publication date (`YYYY-MM-DD`). Separate paragraphs with blank lines. A video link is optional; only allowed YouTube and Bilibili URLs are embedded, while X and TikTok are linked. Each language gets its own JSON file and may share a slug with the other language.

Click Publish once. The service validates again, checks for a duplicate file, and commits the JSON plus manifest update in **one Git tree and one commit**. A branch race returns a retryable conflict. On a directly writable branch, the dashboard shows the future `/blog/{slug}` or `/zh/blog/{slug}` URL; wait for Vercel before opening it. On a protected branch, it shows a draft PR for manual review. Unlisted JSON files are not published or added to the sitemap.

Check factual claims, dates, copyright, and original authorship before publishing. Do not call an unreleased game's preview a first-hand review. The editor does not upload images or videos and does not expose a player posting route.
