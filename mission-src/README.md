# Aquanauts — hands-on lunar research settlement

Phase 1 checkpoint: all eight specialist activities now pass a fresh ordered student browser walkthrough through Tank’s final mission. The existing Central Hub, Bloop design, first-person controls, enclosed tunnels and dashed navigation are preserved. Teacher demonstrations are separate from student progress. Website integration has not begun.

## Run in Chrome

Use Node.js 22.12+ (tested with Node 24).

```sh
npm ci
npm run dev
```

Open Vite’s printed Local URL in Google Chrome. `npm test` runs 53 checks. `npm run build` produces `dist/`; `npm run preview` serves it. You can also serve the packaged build with `python3 -m http.server 4173 --directory dist`.

The current development preview is http://127.0.0.1:5174/.

## Play Bloop’s study

Read the Central Hub briefing and follow the mint floor dashes through the pressurized tunnels. Meet Bloop, now correctly represented by the original hand-drawn pufferfish.

1. Walk to the clean-filter shelf and pick up the blue water cartridge.
2. Carry it to the water machine. Pull the orange release handle to remove the clogged cartridge into the recovery tray.
3. Fit the replacement into its matching socket. Its fresh seal closes the leaking housing; this costs one maintenance kit.
4. Turn the blue valve and press the pump button. Watch water recovery begin and power demand increase.
5. Repeat the cartridge repair at the mint air machine, using the mint air cartridge. Press its fan button. The air reserve responds to the original live simulation.
6. At the habitat console, turn the physical Air / Water / Heat selectors and press TEST. Keep the systems within 9 kW through a 24-second chamber test. Standard settings pass; stronger settings consume more energy and compete with other systems.
7. Passing completes Bloop’s study, marks the room complete, unlocks Moss and updates the existing dashed route. Tank remains gated by all seven preceding studies.

The blue water filter fits the water machine; the mint air filter fits the air machine. Hints explain wrong objects, unopened valves and unsafe operation. Dropped cartridges can be recovered. No equipment dialog is required to finish the study. The map, settings, science references and optional resource details remain available.

## Play Moss’s energy study

Completing Bloop opens Moss’s station through the existing tunnel route. Meet Moss, then follow one instruction at a time:

1. Carry the two battery modules from the charging shelf to the two docks.
2. Pick up the triangle battery plug and fit it into the matching power-box socket.
3. Pick up the round Bloop plug and fit it into the separate BLOOP AIR + WATER inlet.
4. Activate backup power. Bloop’s live habitat feed changes from slowed life support to powered life support; the actual air, water and heat model receives the new supply. Bloop’s fan speed and room illumination also respond.
5. Optional: turn on research lights. They advance experiments but add 4 kW of demand and consume battery charge faster. Pause them when life support needs more power.
6. Press the physical night-test button. Complete a 20-second trial with at least ten continuous seconds of adequate power. Two batteries provide 7 kW against the standard habitat’s 6 kW need.
7. Success marks Moss complete and opens Nori’s greenhouse. Continue with Nori’s planting study. Tank remains gated by all seven earlier studies.

Cable changes are interlocked while backup runs. Switch backup off to unplug or reconnect. Training batteries can recharge with backup off. This is a simplified, compressed educational exercise, not a NASA electrical specification.

## Aquanauts design and guidance

`DESIGN_SYSTEM.md` records the tokens established from the two supplied aquanauts.app screenshots: near-black, aqua, orange, condensed system headings, rounded controls and aqua offset shadows. `src/ui/design-tokens.css` is the reusable source. All active-game interfaces use the same system: welcome, objective ribbon, inventory, prompts, map, settings, dialogue and completion.

The HUD shows one current instruction with an original character portrait and small progress dots. Three compact resource badges replace the previous dashboard. Optional detailed readings remain available. The orange world cue points at the current part; the approved dashed floor route is unchanged. Guided walking now detours around local furniture without moving rooms, doors or tunnels.

Hub decorations, Bloop’s water-themed studio, colorful greenhouse beds, flowers, hanging vines, trellis, warm lighting and the other personal studio corners add actual 3D detail. Repeated static decorations use instancing.

## Original room music

`public/audio/config.json` maps nine room IDs to audio file paths. Eight specialist entries point to the supplied original compositions, transcoded to compatible AAC M4A. Central Hub remains null because no matching original track was supplied. Each room has its own folder, including `central-hub`, `bloop`, `moss` and the remaining specialists. Supported formats depend on the browser; common MP3, WAV, OGG and M4A files can be configured. `voices` maps optional narration IDs such as `bloop-welcome` and `moss-welcome` to original voice files.

`src/audio/manager.js` centralizes gesture-based startup, per-room track caching, gain crossfades, volume, mute, optional narration and synthesized interaction sounds. Tracks do not restart on every frame or on revisiting a room. No replacement music is shipped. Crossfade logic is unit-tested with mock tracks. Tank playback was confirmed by browser status during Phase 1; a full audible room-transition demonstration remains scheduled for Phase 8. Original and playback hashes are recorded in public/audio/SOUNDTRACK_CREDITS.json.

## Controls and accessibility

WASD / up-down arrows move; mouse-look after clicking the world. Left-right arrows turn. Aim and press E, click a highlighted part, or use a nearby-part button. Nearby-part buttons operate the same 3D objects and appear only within reach. Q or “Set down” drops a held object onto safe floor space. M opens the map; P pauses; Esc releases the mouse. “Show me the way” walks physically through the habitat; WASD takes over.

Settings include simple controls, sensitivity and reduced animation. Centralized synthesized pickup, interaction, doorway and completion sounds provide feedback; volume and mute are in Pause & Comfort. Reduced animation removes carry bob and highlight pulsing. Renderer and carry placement adapt to viewport changes.

Completed study checks save locally. Partial physical repairs restart with fresh supplies after reload unless their study check was completed; finished Moss studies restore an assembled backup system. No saved user progress is overwritten by the developer `?practice=1` mode. Its explicit Practice Moss button prepares a Bloop-complete fixture for isolated QA; normal gameplay still requires completing Bloop. No accounts are required.

## Reusable architecture

- `src/world/hands-on.js`: selectable objects, typed action hooks, camera carrying, safe drop, placement, highlight and audio feedback.
- `src/systems/energy-study.js`: battery docks, carried cable plugs, electrical interlocks, finite charge, research trade-off and night-test rules.
- `src/world/moss-workshop.js`: physical energy equipment and Bloop’s live habitat feed.
- `src/ui/mission-guide.js`: one current action for each study stage.
- `src/player/local-detour.js`: furniture avoidance around the unchanged base route.
- `src/systems/physical-study.js`: pure task rules, cartridge states, interlocks and practical objectives.
- `src/world/bloop-workshop.js`: physical machines, cartridges, release handles, valve, controls and live world display.
- `src/world/character-reference.js`: original-sheet portrait crops and confirmed identities.
- `src/world/personal-studios.js`: original portraits, individual colors, keepsake shelves, plants and decorative lighting.
- `src/world/layout.js`, `src/player/controller.js`, `src/missions/progression.js`: preserved layout, movement/navigation and ordered unlocks.
- `src/systems/life-support.js`: existing resource model with a supply override for Moss’s connected power system.

`WORLD_LAYOUT.md` records the expandable fixed topology. `CHARACTER_REFERENCE.md` records exact identities and disciplines. The labeled octopus says “Tink”; the game retains the explicitly requested name Tank. Original hand-drawn appearances take precedence over the labeled rendering.

## Environment and provenance

All nine rooms retain their authored equipment from the environment milestone, with colorful personal studio corners. The organized library includes 77 Kenney CC0 models; repeated meshes use instancing. `ASSET_CREDITS.json` records creator, source, license, hashes and attribution requirements. Each asset pack includes its license/source notes. The original full character sheet is bundled unchanged and cropped/oriented at runtime; no replacement characters are generated. The original First Night prototype remains at `/legacy.html`.

NASA attribution remains accessible in game. The dated observation in `src/nasa-data.js` is archived; there is no live NASA feed. All resource rates, air reserve percentages, CO₂ indices, power ratings and compressed chamber thresholds are simplified educational models, not NASA measurements or human exposure limits. Terrain is procedural art.

## Validation and remaining work

53 automated tests pass, covering simulation/progression, structural coverage, real model placement, carry/drop/recovery, typed sockets, interlocks, guide endpoints and keyboard task focus, all later study guards and final-mission failure conditions. Production build passes with a nonblocking Three.js chunk-size advisory.

The Phase 1 browser walkthrough completed all eight studies in order, without Teacher or Practice Moss shortcuts. Every completion unlocked the next room; the final map marked all eight complete. Reload restored a carried reserve battery and its exact task stage, and another reload retained all eight completions. Teacher jump, E/Q tool recovery, preview reset, student return and reload were checked separately; the fresh student retained zero completions and the correct locks. No warnings/errors were captured in the checked final browser sessions.

This is not broad child usability or hardware certification. Object placement remains controlled and kinematic. Remaining phases cover website/account integration, rewards, existing pet companions, posters, certificates, complete music demonstration, voice recording and final product testing. Cloud synchronization is not implemented in this standalone game.

## Other hands-on studies

- Nori: carry seeds, water and nutrients to the tray, then power the grow light. Water, materials and electricity are consumed.
- Luma: equip protective gear, seal a Moon sample, fit shielding and run the storm drill. Exposure is a simplified educational model.
- Pip: carry a wrench to the loose bolt, replace the fuse and test the pump.
- Skim: sort metal, plastic and plant scraps into their matching bins, then recover useful water and materials.
- Pebble: pack water, repairs and the sealed sample, then send the plan and wait for the explicitly fictional three-second training delay.
- Tank: connect reserve power, fit air cleaning and shielding, share water, pause research lights, run recovery, then pass the integrated final-night test. Unsafe resources or inadequate power prevent success.

## Teacher and saves

Use Teacher in the header, welcome screen or pause menu to jump directly to any room. An orange banner identifies demonstrations. Return to student adventure restores the student’s original state and position. Reset inside Teacher mode restarts only the preview. Demonstrations do not grant student completions or write student saves. Teacher is a local classroom convenience, not an administrator authentication system.

Normal play saves progress in localStorage under aquanauts.settlement.v1 and full runtime under aquanauts.runtime.v2; page exit also flushes runtime. Saves are device/browser-local, with no cloud identity yet. The optional ?practice=<name> inspection mode isolates QA state in sessionStorage. Do not use Practice Moss as evidence of a complete student walkthrough. Phase 1 used real tasks in order and verified reload with a carried object and all eight final completions.
