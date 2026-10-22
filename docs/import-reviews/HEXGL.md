# HexGL import review — candidate, not published
Upstream: https://github.com/BKcore/HexGL (master)
Last observed upstream push: 2024-06-29 UTC. Maintenance paused per README.
License: MIT; README says code and resources MIT unless specified otherwise. Review every exceptional asset, bundled libraries, fonts and audio before release.
Feasibility: direct static HTML5/WebGL port is plausible; preserve original files under public/play/hexgl. Legacy JS, WebGL, audio and browser APIs need testing.
Estimated effort: 1–3 working days for source import + basic smoke; 3–7 days including browser fixes and integration, excluding major engine rewrites.
Gate: record upstream SHA, inspect per-file licenses, run desktop/mobile smoke, no public registry entry before approval.
Status (2026-10-22): complete upstream tree imported at commit
`6addc95a2fce3bf05f4d751823cc054c61a16d68`; production build and three dedicated
Playwright checks passed locally. Not published. Multiple explicit CC BY-NC core
headers and exact asset permissions remain release blockers. See
`../HEXGL_GAMEVADO_ROADMAP.md` for commands, measured scope, patches and limitations.
