# Third-Party Licenses

| Project | Steward | URL | License | Modified |
|---|---|---|---|---|
| Next.js | Vercel | https://github.com/vercel/next.js | MIT | No |
| React / React DOM | Meta and contributors | https://github.com/facebook/react | MIT | No |
| Tailwind CSS | Tailwind Labs | https://github.com/tailwindlabs/tailwindcss | MIT | No |
| TypeScript | Microsoft | https://github.com/microsoft/TypeScript | Apache-2.0 | No |
| ESLint | OpenJS Foundation | https://github.com/eslint/eslint | MIT | No |
| Playwright | Microsoft Corporation | https://github.com/microsoft/playwright | Apache-2.0 | No |

Published game implementations use original maps and media. Battle Tanks selectively reuses the MIT-licensed Vector utility from cattle-bity, as documented below. The separately gated HexGL review import contains upstream game assets and has not been cleared for commercial publication. Cards use Unicode and CSS; memory cards use operating-system emoji.

## Battle Tanks — cattle-bity

`src/games/battle-tanks/vendor/cattle-bity/Vector.ts` is copied unmodified except for its attribution header from [dogballs/cattle-bity](https://github.com/dogballs/cattle-bity/blob/803f80207be9ed62149e2334636e6d0ff30ad777/src/core/Vector.ts), commit `803f80207be9ed62149e2334636e6d0ff30ad777`. Copyright (c) 2020 Michael Radionov, MIT. Full notice retained in the adjacent `LICENSE`. Used for cardinal movement velocity math. No original stages, graphics or audio are imported.


## Starlight Keeper
Original game and illustrations © 2026 jin123yi123-sudo. All rights reserved. Public files are the minified browser distribution; authoring sources are maintained separately. Three.js 0.170.0 is MIT licensed; its full license is included at /play/starlight-keeper/THREE-LICENSE.txt. Historical melodies are newly synthesized arrangements, without third-party recordings.

## HexGL — unpublished review only

Official upstream BKcore/HexGL, commit `6addc95a2fce3bf05f4d751823cc054c61a16d68`.
MIT is retained at `public/play/hexgl/LICENSE`; the README's exceptions and multiple
CC BY-NC 3.0 game headers are also retained. Do not classify the whole import as
unconditionally MIT. Original audio attributions remain in `audio/LICENSE`.
See `public/play/hexgl/GAMEVADO-NOTICES.md` and `docs/HEXGL_GAMEVADO_ROADMAP.md`
for font, model, texture and historical library clearance still required before release.
