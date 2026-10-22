# HexGL: GameVado Edition — unpublished review

Original game: HexGL by Thibaut Despoulain (BKcore), https://github.com/BKcore/HexGL
Imported upstream commit: 6addc95a2fce3bf05f4d751823cc054c61a16d68.
This compatibility port is not endorsed by the original authors.

## License restrictions — no commercial release clearance

The original MIT text is retained in LICENSE (Copyright 2015 Thibaut Despoulain).
The upstream README explicitly excludes files with a different license notice.
The files in bkcore/hexgl (CameraChase, Gameplay, HexGL, HUD, Ladder, RaceData,
ShipControls, ShipEffects and tracks/Cityscape) retain CC BY-NC 3.0 headers.
Their noncommercial condition must not be silently replaced by the root MIT license:
https://creativecommons.org/licenses/by-nc/3.0/
Public/commercial GameVado publication remains paused pending written clarification.

## Audio — original audio/LICENSE retained verbatim

- boost.ogg: IFartInUrGeneralDirection, CC BY 3.0.
- wind.ogg: kangaroovindaloo, CC BY 3.0; adjusted by Licson.
- destroyed.ogg: beman87, CC BY 3.0; adjusted by Licson.
- crash.ogg: qubodup, public domain according to upstream.
- bg.ogg: mu6k, public domain according to upstream; adjusted by Licson.
- OGG conversion: baleboy using VLC Media Player.
- Attribution license: https://creativecommons.org/licenses/by/3.0/

No audio files were replaced or modified by GameVado. Original source URLs for the
individual recordings were not supplied upstream; retain this limitation for review.

## Font, models, textures and libraries

- Bebas Neue v1.101 webfont: Copyright 2010 Ryoichi Tsunekawa. TTF name records and
  SVG retain that notice; no license text accompanies this exact old font build.
  Do not assume a modern font release's license covers this binary. Clearance pending.
- HexMKI base model: Charnel; track texture: Nobiax (original credits retained).
  No standalone permission documents for these contributions were found upstream;
  verify the scope of the repository license with the rightsholders before publishing.
- Three.js 50dev / r53 and associated postprocessing/shaders: original bundled code
  retained, without upgrading the engine. Third-party historical license text needs
  confirmation against the exact bundled versions before a public distribution.
- ShaderExtras Film shader explicitly carries CC BY 3.0, credited to alteredq with
  the original shader references; that header is retained.
- dat.gui: copyright 2011 Data Arts Team, Google Creative Lab, Apache-2.0 header
  retained. https://www.apache.org/licenses/LICENSE-2.0
- Stats.js, LeapJS 0.4.1 and the unused Editor bundle retain all upstream headers.
  Historical bundled component notices are not claimed fully cleared for release.

## Integration changes

index.html: local favicon, fixed /play/hexgl/ base, review title/noindex, removal of
the original author's Google Analytics, local audio compatibility script and Exit link.
gamevado-compat.js: resume suspended Web Audio on a real pointer/keyboard gesture.
Original classic gameplay, physics, track, models, textures and recordings retained.

Review only: the GameVado server returns 404 for the entire HexGL subtree and detail
page unless HEXGL_REVIEW_ENABLED=1 is explicitly set. This flag is not authentication;
use only on a local or otherwise access-controlled review server. Do not enable publicly.
