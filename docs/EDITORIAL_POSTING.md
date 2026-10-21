# Publishing GameVado articles through Git

Editorial articles are files in this repository, not Supabase rows. There is no web posting form. Player UGC remains disabled; its Supabase infrastructure is separate.

## Write and review

1. Ask ChatGPT/Codex to draft an original English article (and optionally a Chinese translation). Supply your own notes and sources. Verify dates, claims, rights, and whether first-person experience is genuine. For an unreleased game such as GTA 6, use `news`, never claim hands-on experience.
2. Keep unpublished drafts outside the repository or under `content/drafts/` (gitignored). **Do not commit confidential drafts**: anything committed to a public Git repository can be read even when not linked from the site.
3. Create one UTF-8 JSON file per language in `content/posts/`, for example `gta6-preview.en.json`. Use the schema below. Text is plain text, not HTML or Markdown. Separate paragraphs in `body` with two newline characters (`\n\n` in JSON). An optional `videoUrl` may point to a YouTube, Bilibili, X, or TikTok video; the site embeds only the first two and links the latter two. Verify you have the right to use linked media.
4. After editorial approval, import the JSON file in `content/posts/index.ts` and add it to `editorialSources`. Merely creating a file does not publish it. Each language is independently approved. The build rejects invalid or duplicate articles.
5. Run `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, and `pnpm exec playwright test tests/editorial.spec.ts`. Review the resulting `/blog/{slug}` or `/zh/blog/{slug}` page and sitemap. Commit and open a pull request for human review. Merge and deploy only after approval.

Example (illustrative only; do not publish this placeholder):

```json
{
  "slug": "example-game-preview",
  "locale": "en",
  "kind": "news",
  "title": "Example Game: What We Know Before Release",
  "excerpt": "A concise, original summary of confirmed information and what remains unverified for players following this release.",
  "body": "Write at least 400 characters of sourced, useful original text here. Separate substantial paragraphs with two newline characters. Do not include HTML or claim gameplay experience before playing the game.",
  "videoUrl": null,
  "publishedAt": "2026-10-20",
  "updatedAt": "2026-10-20"
}
```

`slug` must be lowercase ASCII words separated by hyphens; `locale` is `en` or `zh-CN`; `kind` is `news`, `review`, or `guide`. Title: 12–140 characters; excerpt: 40–320; body: 400–50,000. Dates use `YYYY-MM-DD` and `updatedAt` cannot precede `publishedAt`. Update the latter when materially revising an article. The site generates canonical metadata and sitemap entries only for manifest-approved articles.

Reusable ChatGPT request: “Using my notes and cited sources, draft an original GameVado article as a JSON file under `content/posts/`. Do not invent firsthand experience or publish unsupported claims. Keep it unlisted until I approve it. After approval, add it to `content/posts/index.ts`, run tests and build, and open a pull request. Do not modify Supabase or game logic.”
