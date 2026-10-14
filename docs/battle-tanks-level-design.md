# Battle Tanks level design

All maps are original 13×13 authored JSON maps, deliberately smaller than the classic 26×26 micro-tile convention so the prototype stays readable on mobile. The schema is dimension-independent and can accept 26×26 maps later.

1. **First Defense** — Sparse brick lanes teach cardinal movement, shooting and the difference between destructible brick and the steel base cap.
2. **Brick Maze** — Alternating pockets reward controlled demolition; reckless firing opens short routes to the base.
3. **Twin Rivers** — Two water bands split the field into predictable bridges and force players to hold crossings.
4. **Steel Fortress** — Nested steel rings create safe firing positions but also funnel enemies toward a few high-pressure gates.
5. **Grass Ambush** — Broad grass pockets reduce visual certainty around otherwise open lanes and reward cautious scouting.
6. **Crossfire** — A steel cross divides approach vectors so enemies appear from four readable but competing directions.
7. **Ice Field** — Long ice runs create commitment and teach players to plan braking distance while moving with implemented ice inertia.
8. **Narrow Passage** — One-tile corridors emphasize alignment, traffic control and friendly spacing in co-op.
9. **Broken City** — Irregular brick and steel ruins create asymmetrical cover, short flanks and no single dominant lane.
10. **Fortress Siege** — Concentric defenses invert the usual rhythm: players must selectively open their own fortress to gain firing angles.
11. **Twin Base** — Symmetrical halves and two separated player starts are tuned for co-op role division around one shared base.
12. **Final Stand** — Every terrain type appears in alternating pressure bands; the base has little depth and demands active rotation rather than camping.

Enemy counts rise steadily from four to fifteen. Later maps introduce heavy/elite wave composition and shorter spawn intervals through data rather than engine branches.

## Data and release architecture

Each map now lives in `src/games/battle-tanks/maps/official/map-XXX.json`. `node scripts/generate-battle-maps.mjs` discovers all `map-*.json` files and generates the typed registry; the standard dev/build scripts run it automatically. Add a valid JSON file to introduce another map without modifying a React component. The schema rejects unknown enemies, invalid waves, overlapping spawn/base cells, blocked spawns and maps above 40x40.

Wave count, type sequence and spawn interval come from each JSON. Campaign ends after its complete authored enemy budget is destroyed. Survival cycles the map wave plan forever, adding enemies and shortening spawn intervals each cycle while capping live enemies at six. Co-op shares the base but has three lives and separate scores for each player. Base durability is three enemy-shell hits; friendly fire is disabled.

The classic mod is resolved through the mod registry, with `createMod` supporting tank, weapon, enemy, terrain and live-enemy cap overrides without changing simulation code.
