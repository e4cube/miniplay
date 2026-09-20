# GameVado combat art

These original PNG atlases were supplied for GameVado and are loaded only by the
Pixel Fighters and Tank Duel routes.

## Fighters

- `fighting-stage-background.png` — full arena backdrop.
- `fighter-blue-spritesheet.png`, `fighter-pink-spritesheet.png` — five visual
  columns by two rows. Frames are selected with percentage background positions;
  transparent padding is intentionally retained because the drawings do not use
  uniform painted bounds.
- `fighting-hud-kit.png` — texture for health and super meters.
- `fighting-vfx-kit.png` — hit and super-move overlays.

## Tanks

- `tank-arena-map.png` — arena backdrop. Collision remains driven by the game's
  deterministic wall rectangles, not by pixels in this image.
- `tank-blue-spritesheet.png`, `tank-pink-spritesheet.png` — six state columns.
- `tank-hud-kit.png` — health panel texture.
- `tank-obstacle-kit.png` — visual treatment for collision walls.
- `tank-vfx-kit.png` — projectile, hit, and explosion overlays.

Do not trim or repack these files without updating the CSS atlas coordinates.
