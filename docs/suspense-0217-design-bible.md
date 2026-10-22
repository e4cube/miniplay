# 凌晨 2:17 / 02:17 — Demo v0.1 Design Bible

## Scope
Standalone suspense photo-interactive demo. Do not change GameVado migration, publishing, sitemap, or main branch. Target 10–15 minutes, 3 endings, 8–12 photographic scenes. All narrative and visuals are fictional.

## Premise
02:17. An adult living alone receives a photo of themselves asleep, allegedly taken at 02:16 from under the bed. The apartment looks almost identical to reality, except for one impossible detail: the bedroom door in the photo opens inward, while the real door opens outward.

## Scene beats and image IDs
- S01 02:17 phone close-up on bedside table, anonymous message and timestamp.
- S02 wide master bedroom shot, locked geography: bed against north wall, bedside table east, outward-opening door west, window south.
- S03 first-person view holding phone; photo shows sleeper from floor-level under bed.
- S04 crop under-bed darkness, small reflection from a second phone.
- S05 corridor viewed through half-open bedroom door, weak motion-sensor light.
- S06 bathroom mirror, condensation and reversed handwritten digits.
- S07 building hallway security monitor, time jumps from 02:16 to 02:18.
- S08 alternate photograph of same room with inward-opening door.
- S09 close-up of a key and a paper receipt, both evidence props.
- S10 final reveal photograph: empty bed, player silhouette visible in glass.

## Interactions / state
Flags: photoInspected, doorMismatch, secondPhone, calledPolice, enteredCorridor, mirrorCode, receiptFound. Suspicion 0–3, danger 0–3. Image hotspots must have keyboard-focusable equivalents and readable text labels. Save progress locally with versioned schema.

## Branching
A. Check bed: uncover second phone; unlock evidence ending if doorMismatch + secondPhone + receiptFound.
B. Call emergency services: safe but incomplete ending (no actual call or external service; in-game fiction only).
C. Open door immediately: bad ending unless player previously notices the mismatch.
Ending E1: Escaped, truth unknown. E2: The watcher catches up. E3: The impossible photograph was from a staged reconstruction; evidence exposes a manipulator, but final message hints at another layer.

## Photo art direction
Realistic contemporary East Asian apartment, practical low light, 35mm documentary photography, natural lens noise, imperfect framing, plausible skin/fabric/material textures, consistent room layout and adult character. Avoid CGI, illustration, hyper-smooth faces, unreadable in-image UI text, inconsistent door/window positions. Generate text/UI as HTML overlays rather than baked into images.

## Rights and provenance
Prioritize previously generated user-owned/appropriately licensed materials only after inspecting provenance, consent, identity rights and consistency. Track each asset with source, generation date, permission/license, prompt, crop and usage. Do not assume old images are cleared merely because they exist.

## Acceptance
Playable beginning-to-end, 3 distinct endings, image inspection and at least 2 meaningful evidence combinations, keyboard/touch controls, local save/restart, no external API key required for gameplay, no broken image state, 375px mobile viewport.
