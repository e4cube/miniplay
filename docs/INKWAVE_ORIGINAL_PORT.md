# INKWAVE original-game integration (not yet imported)

## Goal
Import the unmodified MIT-licensed upstream browser game into GameVado, preserving the original gameplay. This is **not** an iframe or a rewritten clone.

Upstream: https://github.com/jaydendavisnc/inkwave
Official: https://inkwavegame.com/play/

## Blocker
The GitHub connector returned 404 for the upstream repository and tree in this session; direct `git clone` could not resolve github.com in the execution environment. Therefore **no upstream game code or assets have been copied**. Do not claim the original game is installed or tested.

## Proposed file layout
- `public/play/inkwave/index.html`
- `public/play/inkwave/src/**`
- `public/play/inkwave/styles/**`
- `public/play/inkwave/assets/**`
- `public/play/inkwave/vendor/three/**`
- `public/play/inkwave/LICENSE`
- Keep upstream relative imports and import maps unchanged.
- Record upstream commit SHA, license, bundled font notices and third-party licenses in `THIRD_PARTY_LICENSES.md`.

## Import steps (when upstream access works)
1. Pin an upstream commit; clone into a temporary working directory.
2. Run `npm install && npm run check && npm run smoke && npm run build` in upstream; capture results.
3. Copy the built static distribution (or the complete required static source tree) into `public/play/inkwave/` and preserve relative paths.
4. Verify direct loading at `/play/inkwave/`, no missing modules/fonts, WebGL startup, controls, bot matches, weapons, maps, audio, pause, and score screen.
5. Add a **separate** GameVado registry entry and route only after verification; avoid changing existing games' loading logic.
6. Online multiplayer needs a separate relay and infrastructure review; don't point to or rely on the author's relay without explicit approval.
7. Keep the game in an unlisted review build until platform approval. Do not merge or deploy to production without approval.

## Acceptance checklist
- [ ] Original upstream files copied, source commit recorded
- [ ] License and fonts/third-party notices verified
- [ ] Local upstream checks pass
- [ ] GameVado build and browser smoke tests pass
- [ ] All original single-player features retained
- [ ] Mobile is not required for first release
- [ ] PR reviewed and platform approval granted
