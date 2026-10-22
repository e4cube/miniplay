# HexGL: GameVado Edition — local review port

## Status

Original classic HexGL is imported and playable on the local review server. It is
not approved for public or commercial publication. No merge to main or production
deployment was performed. Only the HexGL review branch is used.

- GameVado: `jin123yi123-sudo/miniplay`
- Branch: `feature/hexgl-original-review`
- Starting GameVado commit: `aec38e1f7a6aeab1732085ad37dd491d24b7aed5`
- Official source: https://github.com/BKcore/HexGL
- Actual upstream commit: `6addc95a2fce3bf05f4d751823cc054c61a16d68`
- Imported with `git archive` from that commit: 198 files, 20,437,315 original bytes.
- Source SHA-256 inventory: `docs/hexgl/upstream-manifest.json`.
- All 198 original files remain present; 197 are byte-identical. Only upstream
  `index.html` has integration changes. Added files are separately listed below.

The local checkout was clean before switching from the previous INKWAVE branch.
The requested HexGL remote branch was fetched and checked out. No user changes
were overwritten, and no INKWAVE files or other game's implementation changed.

## Local preview and tests

Requirements: Node.js, pnpm and installed Chrome. This was tested on Windows with
Node v24.19.0, pnpm 11.25.0, Next.js 16.3.3 and Playwright 1.62.1.
No new npm dependencies were added. HexGL has no npm build or upstream test suite;
its original release is static HTML/JS/assets and loads without a bundler.

```powershell
pnpm install --frozen-lockfile --ignore-scripts
$env:NEXT_TELEMETRY_DISABLED='1'
$env:NEXT_PUBLIC_SITE_URL='https://gamevado.com'
# Local review only: keep inherited ads/analytics out of the browser test.
# These variables do not modify the site's advertising configuration.
$env:NEXT_PUBLIC_ADSENSE_CLIENT='disabled-for-local-review'
$env:NEXT_PUBLIC_GA_ID=''
pnpm build
```

Start the enabled review server in one terminal:

```powershell
$env:HEXGL_REVIEW_ENABLED='1'
pnpm exec next start --hostname 127.0.0.1 --port 3000
```

Start a second, default-disabled server for the negative publication checks:

```powershell
$env:HEXGL_REVIEW_ENABLED='0'
pnpm exec next start --hostname 127.0.0.1 --port 3001
```

Then run:

```powershell
node scripts/verify-hexgl-upstream.mjs
pnpm exec eslint src/proxy.ts src/data/review-games.ts src/app/games/hexgl/page.tsx playwright.hexgl.config.ts scripts/verify-hexgl-upstream.mjs
pnpm exec playwright test --config playwright.hexgl.config.ts
```

Open http://127.0.0.1:3000/games/hexgl for the review description, or
http://127.0.0.1:3000/play/hexgl/ for the original game. Next normalizes the latter
URL to `/play/hexgl`; a base tag keeps every original relative asset URL correct.
No iframe, React game rewrite, new ship, new track or new game mode is used.

The review flag is not authentication. Enable it only on a local or independently
access-controlled server; do not enable it on a public deployment.

## Actual validation on 2026-10-22

| Check | Actual result |
| --- | --- |
| Frozen dependency installation, lifecycle scripts disabled | PASS |
| `pnpm build` | PASS: optimized production compile, TypeScript, 95 pages |
| Targeted ESLint command above | PASS |
| Upstream integrity command | PASS: 198 present, 197 unchanged, index.html patched |
| Dedicated Playwright suite against `next start` | PASS: 3 tests, 34.3 seconds |
| Default-disabled detail, entry and direct asset paths | 404 with noindex, as expected |
| Public home/list/sitemap isolation | No HexGL entry/URL present |
| Review detail, credits, menu, help and start | PASS |
| WebGL / ship / track / high-resolution textures | PASS: real rendered screenshot; 11 geometries, 24 textures, 832 ship vertices |
| Real keyboard acceleration, steering, air brakes | PASS: positive speed/displacement, turn response and reduced brake speed |
| Timer | Advances while the race is active |
| Collision with real keyboard driving | Shield decreases below maximum |
| Audio | All 5 files decoded; running AudioContext and nonzero background-signal RMS |
| Race end, return to menu and exit | PASS, with deterministic checkpoint-assisted finish described below |
| Console errors, failed requests, outside-network requests | Zero in final production review run |

**Finish-test scope:** the test moves the original ship through real checkpoint
coordinates found in the original collision/analyser map, invokes the original
time-attack handler over three lap sequences, and observes the real result screen.
It does not replace the finish implementation, but it is not a claim of completing
three laps with keyboard steering alone. A full human-driven three-lap acceptance
run is still outstanding. No claim of mobile, gamepad or Leap hardware support is
made from this desktop test.

The original Three.js 50dev emits non-blocking `program not linked` WebGL warnings
during setup; a `Matrix3.getInverse(): determinant == 0` warning was also observed
in a trial run. They are recorded rather than suppressed. Actual geometry, textured
track, HUD and physics render and operate. Review these warnings before release;
there was no justification for an engine rewrite during this port.

Earlier development attempts did not pass: an embedded hidden browser paused RAF;
one test clicked before the classic script finished loading; another asserted on
an empty-height absolute-position container instead of its visible Start button.
Those harness issues were corrected, not hidden behind game changes. The existing
site's default AdSense request was denied by the local network policy during a
development run, so the final local production build explicitly disables ads using
the environment setting above. A reload-navigation cancellation was resolved by
waiting for page load before testing Exit. These failures are not reported as passes.

## License review and publication blockers

The exact upstream MIT license is retained at `public/play/hexgl/LICENSE`:
Copyright (c) 2015 Thibaut Despoulain. README says MIT **unless specified in the file**.
Nine core game files still contain CC BY-NC 3.0 notices: CameraChase, Gameplay,
HexGL, HUD, Ladder, RaceData, ShipControls, ShipEffects and tracks/Cityscape.
Do not silently treat their explicit noncommercial notices as unrestricted MIT.
See https://creativecommons.org/licenses/by-nc/3.0/.

Original audio/LICENSE remains intact. Credits: boost by IFartInUrGeneralDirection,
wind by kangaroovindaloo, destroyed by beman87, all CC BY 3.0; Licson adjusted wind
and destroyed. Crash by qubodup and background by mu6k are described upstream as
public domain; background adjusted by Licson. baleboy converted files to OGG.
Attribution link: https://creativecommons.org/licenses/by/3.0/.

Bebas Neue TTF is version 1.101, copyright 2010 Ryoichi Tsunekawa. Its TTF name
records contain no license text/URL, and the SVG repeats an all-rights-reserved
notice. No permission for this exact binary was separately supplied. Do not infer
its commercial license from a newer release's terms or replace it without review.

The original credits name Charnel for the HexMKI base model and Nobiax for the
track texture. Separate permission documents are absent. Their repository-license
coverage/commercial rights need confirmation before publishing.

Third-party code includes Three.js 50dev/r53 and postprocessing, Stats.js, dat.gui
(Apache-2.0 header), LeapJS 0.4.1 with bundled components and the unused Editor
bundle. ShaderExtras includes a Film shader with explicit CC BY 3.0 attribution.
Every upstream header is retained; historical-version license completeness is a
release gate. No dependency was swapped or fetched from a CDN.

Detailed notices: `public/play/hexgl/GAMEVADO-NOTICES.md` and
`THIRD_PARTY_LICENSES.md`. **Public/commercial release remains paused** until the
noncommercial code and exact resource/library permissions are resolved.

## Complete changes relative to upstream

Only `index.html` changes inside the 198-file upstream set:
1. Review title and noindex metadata.
2. Fixed `/play/hexgl/` base path; original relative resource strings retained.
3. Two favicon links use the bundled file instead of the author's remote domain.
4. Removed original Google Analytics loader/account tracking.
5. Loaded the separate local `gamevado-compat.js` before launch.js.
6. Added Exit link to `/games/hexgl`.

New game-subtree files: `gamevado-compat.js` resumes suspended Web Audio on a real
pointer/keyboard gesture, and `GAMEVADO-NOTICES.md` records attribution/restrictions.
Original engine, audio decoding/playback, collision, timer and race logic are unchanged.
Original .htaccess, appcache, packaged archive, source CoffeeScript, unused libraries
and replay are retained for completeness; Next does not use Apache/appcache config.

GameVado additions:
- `src/proxy.ts`: narrowly matched HexGL-only default 404 gate, noindex/no-store,
  native static index rewrite; other routes are outside this matcher.
- `src/data/review-games.ts` and one re-export in `src/data/games.ts`: separate
  review registry, never inserted into public games/search/home/sitemap arrays.
- `src/app/games/hexgl/page.tsx`: gated detail/attribution page and native launch link.
- `playwright.hexgl.config.ts`, `tests/hexgl.spec.ts`: isolated real-browser checks.
- `scripts/verify-hexgl-upstream.mjs`, manifest, this roadmap and review documentation.
- Third-party license index updated to account for this unpublished exception.
- `.gitattributes` disables newline conversion only for the HexGL subtree, so the
  pinned original hashes survive Windows checkout/staging.

No modifications to existing game loaders, public game entries, global SEO,
sitemap implementation, ad configuration or existing games are part of this change.
The unfiltered `git diff --check` reports whitespace already present in the
preserved upstream files. Those files are deliberately not reformatted; the
authored integration files are checked separately.

## Maintenance roadmap

1. Obtain explicit commercial clarification for file-level CC BY-NC notices and
   exact font/model/texture/library versions. Keep publication gate closed.
2. Complete human three-lap verification and test destroyed-ship results; test
   lower graphics tiers on integrated GPUs, resize/orientation, mobile touch and
   gamepad hardware separately. Preserve classic physics and race mode.
3. Diagnose legacy WebGL warnings with a minimal, separately reviewed patch;
   evaluate old optional Leap/browser API support without replacing the engine.
4. Maintain an upstream manifest and a small, explicit patch set on every update.
   Verify model/texture/audio hashes and rerun production-browser checks.
5. Only after clearance and explicit publication approval, design public directory
   exposure, localized copy and any GameVado features as separate changes. No new
   course, car, multiplayer service or gameplay extension is included in phase one.
