# Battle Tanks source and license audit

Audited 2026-10-10. This is an engineering review, not legal advice. Repository licenses were checked at their linked source; artwork, music, level layouts and trademarks require a separate provenance review even when code is permissively licensed.

| Candidate | License | Stack / browser | Maps and editor | Co-op / mobile | Next.js fit | Decision and risk |
|---|---|---|---|---|---|---|
| [dogballs/cattle-bity](https://github.com/dogballs/cattle-bity) | MIT | TypeScript, browser | JSON maps and built-in editor | Local 2P; no mobile | High concept fit; old build needs adaptation | **PRIMARY BASE (architecture and selective MIT utility reuse).** Best feature match. Do not copy its 35 commercial-game-derived maps or sprites. Reimplement interfaces and use original content. |
| [hec9527/BattleCity](https://github.com/hec9527/BattleCity) | MIT | TypeScript, Vite, Canvas | Tile maps; no clearly documented editor | Gamepad and mobile virtual controls; 2P ancestry | High | Useful mobile, ice and terrain reference. Asset provenance is unclear, so no assets or stages are imported. |
| [BattleCity/battle-city-html5](https://github.com/BattleCity/battle-city-html5) | MIT | JavaScript, Canvas 2D, static | Level resources; no editor documented | Keyboard; mobile unclear | Medium | Small static implementation, but limited documentation, few maintainers and likely tribute assets. Code patterns only. |
| [rzinurov/battle-city-royale](https://github.com/rzinurov/battle-city-royale) | MIT | Phaser + TypeScript, static browser demo | Procedural/tile world; no editor documented | Mobile not documented; no local co-op claim | Medium | Modern typed stack, but Phaser is unnecessary weight for GameVado and README credits third-party sprite sources. Do not import assets. |
| [dderevjanik/battle-city-reforged](https://github.com/dderevjanik/battle-city-reforged) | MIT with per-file exceptions | TypeScript browser project | Maps and editor/custom-map workflow | Local multiplayer; mobile not primary | High | Strong secondary reference, but its license file explicitly lists third-party audio exceptions. Only MIT-covered code could be considered after file-level review. |
| [quarkdev/battletanks](https://github.com/quarkdev/battletanks) | MIT | JavaScript, HTML5 Canvas; PHP entry | JSON data; not a Battle City tile editor | Keyboard/mouse; no local 2P | Low | Mature history but steering-style arena gameplay, PHP packaging and old dependencies do not fit the target. |
| [yajiangandchenchen/tank-battle](https://github.com/yajiangandchenchen/tank-battle) | MIT | TypeScript, Vite, Canvas | Modular Map class; no editor advertised | Responsive; single player | Medium-high | Modern code and fixed-step/object-pool ideas are useful, but it is a different shooter design and has little reuse advantage over original GameVado code. |
| [ehe555/tank-battle](https://github.com/ehe555/tank-battle) | No license visible in repository listing | Vanilla JavaScript, Canvas, static | Three hard-coded layouts | Keyboard; no 2P | Medium technically | **Rejected for source reuse:** no explicit license means all rights reserved by default. It may only inform high-level gameplay observations. |

## Primary base decision

`cattle-bity` is the primary architectural reference because it demonstrates the closest combination of typed browser engine, local two-player play, JSON round-tripping and a playable editor. GameVado does not merge the entire engine. The final release vendors the MIT-covered `src/core/Vector.ts` utility at commit `803f80207be9ed62149e2334636e6d0ff30ad777` and uses it for movement velocity calculations; its full license is retained next to the copied file. The implemented GameVado engine is a clean TypeScript implementation shaped around the host repository's existing Canvas conventions, with original JSON maps, generated GameVado visuals, original procedural effects and synthesized audio. This avoids importing commercial sprites, sound, logos, names and original stage layouts.

## Migration guardrails

- Keep the authoritative map schema independent of React and use it for official and custom maps.
- Keep the simulation in pure TypeScript and render with `requestAnimationFrame`; React owns menus and overlays only.
- Attribute any future copied MIT source at file level and record it in `THIRD_PARTY_LICENSES.md`.
- Reject GPL source for direct integration into GameVado's proprietary repository; it may be studied for concepts only.
- Require provenance records for every future texture, sound and map pack.
