# INKWAVE original-game integration — blocked on source provenance

Goal: import the complete original game into GameVado at `/play/inkwave/`, with native ES modules and preserved assets, not an iframe or a rewritten clone.

Official repository: https://github.com/jaydendavisnc/inkwave
Official game: https://inkwavegame.com/play/

Status: **not imported; not playable in GameVado; not approved for publication**.

## Recheck on 2026-10-22 (Asia/Shanghai)

### Verified GameVado state
- Cloned the requested branch `feature/inkwave-original-port`.
- Starting commit: `dc0edd4155c50185fc9695b66fabf6132271e080`.
- Next.js 16.3.3 / React 19.2.8; pnpm project.
- `src/data/games.ts` supplies the public catalog and has no review/publication field.
- `src/app/games/[slug]/page.tsx` generates detail routes from that catalog.
- `src/games/GameLoader.tsx` dynamically loads React games.
- Existing standalone assets also use `public/play/`. A native static ES-module distribution at `/play/inkwave/` remains the intended integration; no iframe is required.
- No INKWAVE game, assets, detail page, or catalog entry exists on this branch.

### Source access evidence
- Network permission was granted; GameVado clone succeeded using Git OpenSSL.
- GitHub connector `get_repo(jaydendavisnc/inkwave)`: HTTP 404.
- Web open of https://github.com/jaydendavisnc/inkwave: HTTP 404.
- Unauthenticated Git `ls-remote` cannot read the upstream and requests credentials.
- The official website still links to that exact repository.
- These results establish that the source is unavailable to this session; they do not establish whether it was deleted, renamed, or made private.
- Official upstream commit SHA: **unavailable; no value invented**.

### Third-party candidate (NOT imported)
- Found https://github.com/ENTROVIA/inkwave-main and cloned it for inspection only.
- Candidate commit: `dee4273a49f8839d757a3593a14bf33508f02c15`.
- It has one initial commit by ENTROVIA, rather than upstream history. This is **not** an authenticated Jayden Davis upstream commit.
- Its LICENSE contains MIT copyright (c) 2026 Jayden Davis.
- Bundled fonts: Rubik-latin.woff2 and TitanOne-latin.woff2; no corresponding font license files were found in the candidate. Font notices still need to be obtained and verified.
- Three.js bundles and addon files are present; third-party notice audit remains incomplete.
- Candidate stage assets cover halyard, kelpline and tidewater. The current official website describes four stages, online rooms and Boss Battle. Candidate completeness relative to the live release is not established.
- No candidate game code or assets were copied into GameVado. User was asked for accessible official source or explicit acceptance of the third-party provenance limitation.

### Checks and environment
| Check | Result |
| --- | --- |
| Requested GameVado branch clone | PASS |
| Official INKWAVE clone and commit pin | BLOCKED: upstream inaccessible |
| Official npm run check | NOT RUN: official checkout unavailable |
| Official npm run smoke | NOT RUN: official checkout unavailable |
| Official npm run build | NOT RUN: official checkout unavailable |
| GameVado runtime build after import | NOT RUN: no import exists |
| Playwright startup/assets/menu/match/movement/shooting/results/exit | NOT RUN: no imported game exists |
| Console/network acceptance | NOT RUN: no imported game exists |

Windows Chrome is installed at `C:/Program Files/Google/Chrome/Application/chrome.exe`; Edge is also installed. Missing Chrome is **not** the current blocker.
Node v24.19.0 and pnpm 11.25.0 are available; npm is not on PATH.
The candidate's check/smoke commands use POSIX shell syntax, build uses python3, and tools/play.mjs hardcodes a macOS Chrome executable plus Metal ANGLE. These require a documented Windows test adapter or compatible shell if the candidate is accepted. No claim is made that those scripts passed.

### Remaining work / preview
No playable GameVado preview is available. Once authoritative source is supplied (or the candidate is explicitly accepted), pin the actual source, complete license notices, run the three upstream scripts with recorded platform adaptations, disable author-hosted multiplayer connections, import all original runtime files, add an isolated review-only catalog/detail route, and execute the full Playwright acceptance matrix.
Do not publish a catalog entry claiming the original game is installed before those gates pass.
Only this integration document changes in this recheck; other games, main and production remain untouched.
