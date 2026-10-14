# Battle Tanks art bible

## Production status and licensing

The Codex session exposes the built-in `image_gen` generator but does not return or attest its underlying model identifier. Six tank sources were actually generated with that tool on 2026-10-10. They are recorded honestly as **built-in image generation / Image 2 identity unverified**—not as verified Image 2 or Image 2.5 output. Current `/public/assets/art/tanks/` files remain legacy prototype placeholders.

Generated Asset Manifest (2026-10-14): **6 tank sprites, 13 tile sources, and 4 UI backgrounds generated; model identity remains unverified**. Eight terrain/base images and all four UI images are preloaded and integrated. The five decorative tile variants and atlas are retained for future use; effects and power-ups remain prompt-ready and are not generated or integrated.

| Runtime file | Purpose | Generator | Prompt | Source | Runtime | Alpha | Integrated |
|---|---|---|---|---:|---:|---|---|
| `tanks/runtime/player-1.webp` | Player 1 | built-in image_gen; model ID unavailable | Player 1 specification below | 1536×1536 PNG | 256×256 WebP | yes | yes |
| `tanks/runtime/player-2.webp` | Player 2 | built-in image_gen; model ID unavailable | Player 2 specification below | 1536×1536 PNG | 256×256 WebP | yes | yes |
| `tanks/runtime/scout.webp` | Scout enemy | built-in image_gen; model ID unavailable | Scout specification below | 1536×1536 PNG | 256×256 WebP | yes | yes |
| `tanks/runtime/assault.webp` | Assault enemy | built-in image_gen; model ID unavailable | Assault specification below | 1536×1536 PNG | 256×256 WebP | yes | yes |
| `tanks/runtime/heavy.webp` | Heavy enemy | built-in image_gen; model ID unavailable | Heavy specification below | 1536×1536 PNG | 256×256 WebP | yes | yes |
| `tanks/runtime/elite.webp` | Elite enemy | built-in image_gen; model ID unavailable | Elite specification below | 1536×1536 PNG | 256×256 WebP | yes | yes |

Original PNG sources are retained under `public/games/battle-tanks/assets/tanks/source/`. Runtime files were independently resized with Lanczos filtering and WebP quality 88; they are loaded and decoded by `PreloadManager` before the battle UI becomes ready.

All future generated outputs require a human provenance record and commercial-use review. Do not use Nintendo, Namco, Battle City, Tank 1990, military insignia, real-world trademarks, copied levels, or recognizable commercial-game assets.

## Art direction

Premium 2D arcade tank combat with hand-painted material detail, readable silhouettes and cinematic but restrained lighting. Strict orthographic top-down camera; no isometric perspective. Physically plausible tracks and turret placement. Mature arcade presentation, not photorealistic simulation, pixel art, vector geometry or children's toy styling.

Palette: Player 1 military green `#56734A`; Player 2 cobalt blue `#2E6FAF`; Scout sand yellow `#D8B95B`; Assault dark red `#8C3E3B`; Heavy gunmetal `#424B52`; Elite black/gold `#181A1D/#C49B38`. Environment neutrals remain low saturation so units and effects read at 32–64 px.

Camera and light: exact 90° overhead orthographic camera, cannon points north, soft key light from upper-left, short ambient occlusion directly below, no long cast shadows. Transparent sprites use straight alpha and at least 8 px clear padding in the source.

## Master prompt

> Premium 2D game art for an original browser arcade tank game. Strict 90-degree orthographic top-down view, hand-painted stylized military materials, detailed but readable at small size, cohesive upper-left lighting, crisp silhouette, mature arcade tone. Original designs only. No text, logo, watermark, national insignia, real-world military branding, copyrighted game imagery, isometric perspective, low-resolution pixel art, vector-flat geometry, toy-like proportions, cropped subject or perspective tilt.

## Image 2.5 production tasks and prompts

### Tanks — six separate transparent source images

Common suffix: `One tank centered, cannon pointing exactly upward/north, complete tracks visible, square canvas, genuinely transparent background, consistent scale and padding, no effects. High-resolution source intended for programmatic normalization to 256×256 and runtime WebP.`

1. `Player 1: compact balanced military-green defender, rounded cast turret, twin broad tracks, medium cannon, reinforced frontal glacis; reliable hero silhouette.`
2. `Player 2: cobalt-blue cooperative defender, angular welded turret, segmented side skirts, medium cannon; same gameplay footprint but visibly different armor language.`
3. `Scout: light sand-yellow reconnaissance tank, narrow hull, slim long cannon, exposed road-wheel rhythm and minimal armor; fastest silhouette.`
4. `Assault: dark-red aggressive medium tank, wedge turret, thick medium cannon, layered frontal armor; strong forward-weighted silhouette.`
5. `Heavy: deep gunmetal super-heavy tank, very broad tracks, squat block turret, short large-caliber cannon, thick bolted armor; slow massive silhouette.`
6. `Elite: black-and-antique-gold command tank, sharp low turret, precision long cannon, premium layered armor and subtle gold trim; dangerous high-tier silhouette.`

### Tile sources — one image per tile, not an AI-composed sprite sheet

Common suffix: `Single perfectly square seamless tile, exact orthographic top-down view, edges tile seamlessly, neutral upper-left lighting, no objects crossing the crop unexpectedly, 512×512 source for deterministic downsampling to 64×64 WebP.`

- Grass Ground: short desaturated field grass, restrained variation.
- Dirt Ground: compacted battlefield earth with subtle track wear.
- Concrete Ground: worn poured concrete slabs with fine seams.
- Brick Wall / Damaged Brick: overhead red-brown masonry block occupying the full collision cell; damaged version retains a readable broken mass.
- Steel Wall: overhead modular gunmetal barricade with bright edge highlights.
- Water: deep blue-green animated-water base texture without shoreline.
- Ice: pale blue solid ice with fine cracks and cold reflective streaks, clearly distinct from water.
- Tall Grass: dense overhead blades on transparent background for a foreground occlusion layer.
- Rubble / Crater: low battlefield detail that does not imply collision.
- Base Ground: reinforced marked concrete without text or symbols.
- Base Structure: original compact command bunker, transparent background, strong gold identification lighting, not an eagle or existing-game emblem.

### Effects — separate transparent images or consistent 4×4 frame studies

Prompt each separately with the Master Prompt plus: `Centered overhead arcade VFX, transparent background, no tank or scenery, consistent warm explosive palette and crisp alpha.` Tasks: muzzle flash, bullet trail, bullet hit, small explosion, large explosion, tank destruction, brick damage, spawn energy, shield ring, repair energy and power-up pickup burst.

### Power-up icons

Prompt as six separate images: `Premium arcade pickup icon, top-down/orthographic object, centered, transparent background, bold readable silhouette at 40 px, unified metallic circular housing, no text.` Subjects: rapid-fire chamber, paired projectiles, armor plate, speed turbine, shield emitter, repair wrench over a small base plate.

### UI and backgrounds

- Main menu background: `16:9 original armored battlefield scene viewed mostly top-down with one hero tank in the lower-right, smoke and warm distant fire, dark clear negative space on the left for live HTML menu buttons, no text or logo.`
- Victory background: `16:9 calm dawn battlefield, surviving original green and blue tanks near an intact command base, hopeful light, clear center space for live UI.`
- Defeat background: `16:9 smoky battlefield after base loss, damaged ground and retreating silhouette, somber red-gray light, clear center space for live UI.`
- Panel skin source: `Square seamless brushed gunmetal panel with restrained rivets and inner bevel, no text or buttons.`
- Button skin source: `Wide empty armored arcade button plate, dark gunmetal with gold active rim, no text.`

## Processing specification

Never crop an atlas directly from an AI montage. Generate each source independently, verify the full subject and alpha, then run a deterministic Pillow pipeline: trim transparent bounds; preserve 8% safety padding; center by opaque bounding box; normalize tanks to a common 80% silhouette height; Lanczos downsample; emit lossless master PNG and runtime WebP; reject edge-touching alpha, opaque corners, inconsistent camera angle and perceptual-size outliers. Tiles receive opposite-edge difference checks and a 3×3 visual seam contact sheet. Record SHA-256, source/final dimensions, alpha status, prompt, model identifier, generation timestamp and integration state in a machine-readable manifest.

## UI specification

Generated backgrounds, panel skins and button skins are decorative layers only. React owns all text, focus states, controls, progress, errors and responsive layout. Minimum touch target is 44×44 CSS px. The HUD must remain outside the square battlefield where space permits; compact landscape layouts may use a narrow side rail. Generated text is forbidden.

## Tile and UI integration, 2026-10-14

Tile source PNGs are retained in `public/games/battle-tanks/assets/tiles/source/`; thirteen 64x64 WebP images and a deterministic atlas are in `tiles/runtime/`. Grass ground, brick, steel, water, ice, tall grass, base ground and base structure are integrated. Dirt, concrete, damaged brick, rubble and crater are generated reserve assets, not active game terrain. Tall grass is rendered above tanks with reduced opacity.

The four UI source images (menu battlefield, panel, victory and defeat) and their compressed WebP versions are retained under `assets/ui/`. React supplies all readable text and interactive controls. Loading failure blocks normal game entry until retry succeeds or the player explicitly accepts reduced visuals.

Local Chrome desktop and mobile emulation screenshots inspected on 2026-10-14 show the menu, level grid, battle, pause and editor. Both viewports have no page horizontal overflow or uncaught JS errors. A three-second requestAnimationFrame sample during battle measured approximately 60 FPS with a 16.9 ms p95 frame interval. These are local development measurements on the same computer, not real-device mobile or production benchmarks.

Release update: six power-ups, original procedural explosion/supply visuals, synthesized sound effects, ice inertia, authored wave types and intervals, lightweight breadth-first enemy navigation, independent player lives/scores and respawn are implemented. Real-device performance remains unverified; desktop Chrome with mobile emulation is the available test surface.

## Production packaging

Only compressed runtime WebP files are published to the website repository. Source PNGs remain in the local development workspace and the user-facing `battle-tanks-source-art.zip` archive (23 images, approximately 65 MB uncompressed). They are excluded from the production tree to avoid serving editable originals as public runtime assets. The local source paths above describe the development workspace. Effects and pickups are lightweight original Canvas visuals; all required media recipes and image decoding finish before normal play is enabled.
