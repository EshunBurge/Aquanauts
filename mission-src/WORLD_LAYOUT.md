# Aquanauts lunar settlement — master layout v1

## Fixed topology

Central Hub sits inside a continuous eight-facility perimeter route. This reconciles “hub in the middle” with “one continuous exploration route,” without eight competing spokes.

Hub → Bloop → Moss → Nori → Luma → Pip → Skim → Pebble → Tank → Hub.

There are two hub connections: the north departure connector joins the Bloop approach; the west return connector reaches Tank. Both are real, enclosed, walkable corridors. Tank's doors stay locked until all seven studies are complete. The Bloop departure path shares a junction with the perimeter tunnel above Tank; this is one physically connected settlement, not a sequence of teleports.

## Ground plan

Coordinates are metres. X increases east; Z increases south. Facilities are on a square perimeter, with the Hub at the origin. The map and geometry are generated from `src/world/layout.js`, the authoritative layout file.

| Order | Specialist | Dedicated facility | Position (X,Z) | Current state |
| --- | --- | --- | --- | --- |
| Start | — | Central Hub | 0, 0 | Furnished, interactive |
| 01 | Bloop | Life Support Laboratory | -34, -34 | Complete first study |
| 02 | Moss | Energy Station | 0, -34 | Hands-on energy study; entry unlocks after Bloop |
| 03 | Nori | Greenhouse | 34, -34 | Furnished; study pending, locked |
| 04 | Luma | Lunar Environment Observatory | 34, 0 | Furnished; study pending, locked |
| 05 | Pip | Engineering Workshop | 34, 34 | Furnished; study pending, locked |
| 06 | Skim | Resource Recovery Center | 0, 34 | Furnished; study pending, locked |
| 07 | Pebble | Mission Planning Center | -34, 34 | Furnished; study pending, locked |
| 08 | Tank | Integrated Mission Center | -34, 0 | Furnished; study pending; seven-study gate |

Hub footprint: 18 × 18 m. Specialist footprint: 16 × 16 m. Tunnels: 4.6 m wide, approximately 3.6 m internal height. Adjacent perimeter rooms are 34 m apart, leaving 18 m of enclosed connector between their walls. The hub's north departure turns west at Z=-17, runs to X=-34, then joins Bloop's south approach. This creates a substantial exploration journey.

## Navigation and progression

- Mint dashed floor strips mark the next facility. Completed routes dim.
- Character and room signs identify every entrance; later specialists are not introduced together.
- Full map (M), minimap, and physical architecture share world coordinates.
- Full map shows live player position, study order, completion and locks.
- Accessibility guide walks the same tunnel graph as manual movement, without teleporting. WASD cancels guided walking.
- Completing Bloop requires all three practical checks, including a timed integrated plant test. A conversation alone cannot complete the study.
- Bloop's completion marker appears, Moss's entry gate opens, and the dashed route advances to Moss.
- No unimplemented study can award completion. Tank's unlock requires all seven earlier completion IDs.
- Progress saves locally; study checks and repairs survive page reload. Plant consumables refresh between visits.

## Bloop's first study

1. Restore air cleaning: replace the clogged filter using one maintenance kit; select a fan setting.
2. Close the water loop: repair a leaking pipe using one kit; select a recycler setting.
3. Balance air cleaning, water recovery and heating within a shared 9 kW supply. Run the 24-second chamber test and finish with at least ten continuous seconds in the safe training range.

Off, Standard and Boost each change the simulation. A fresh filter improves cleaning. Repairing the pipe reduces water loss. Overloading the shared supply reduces machine effectiveness. Boost settings can prioritize one system, but all Boost settings cannot fit the power budget. Several operating plans pass the test.

These are simplified educational operating assumptions, not NASA life-support engineering specifications or human safety thresholds.

## Expand without rebuilding

- `src/world/layout.js`: rooms, doors, tunnel topology and route selection.
- `src/world/settlement.js`: modular environment assembly and equipment integration.
- `src/world/character.js`: original-art crew projection.
- `src/world/interactions.js`: proximity/raycast interaction targets.
- `src/player/controller.js`: manual movement, collision, tunnel graph and guided walking.
- `src/missions/progression.js`: ordered unlocks, validation and local persistence.
- `src/systems/life-support.js`: Bloop's live simulation and test rules.
- `src/ui/base-map.js`: shared map renderer and world-to-map projection.
- `src/assets/catalog.js`: licensed asset provenance.
- `src/settlement-app.js`: UI composition and application lifecycle.

The original First Night prototype remains at `/legacy.html`; its simulation and tests are preserved.

## Asset strategy

Use Kenney's CC0 Space Station Kit for authored computers, chairs, storage and other interior props. Retain its license and external texture dependency. Custom structural geometry controls exact facility footprints, door openings and corridor continuity; it complements imported props rather than attempting to replace an asset library. Character art remains the supplied Aquanauts artwork. Bloop is an illustrated crew projection, not a redesigned generic model.

The Kerbal States Aurora Base concept informed modular habitats, structural connectors, utility equipment and solar panels. It is a design reference; its image and game assets are not redistributed. The supplied reference is not an eight-study floor plan, so the explicit Aquanauts progression and central/perimeter topology above define this implementation.

## Next build

Keep this topology fixed while finishing Moss's dedicated energy study. Then add the greenhouse, observatory and remaining studies in order. New studies can use their furnished interiors without changing the coordinate system, map, connecting corridors or progression contract. Tank's final game remains a later integration of the seven systems, not a shortcut replacing their studies.


## Environment completion pass — v0.3

Room and tunnel envelopes now derive from a union grid, closing wall-to-roof gaps and continuous junction floors. Ceiling transitions have lintels. Authored models are dressed per discipline in `src/world/dressing.js`; `src/assets/library.js` batches repeated models and checks placement. `src/world/envelope-plan.js` defines structural coverage independently of appearance. The approved coordinates and dashed route remain unchanged.

Nine rooms contain 198 authored props from 40 model types, plus structural fixtures and original interactive equipment. Kenney Space Station, Space and Nature packs supply the organized 77-model library. Credits record sources, licenses and checksums. `/environment-review.html` provides a non-persistent full-base inspection tour and screenshot contact sheet.


## Hands-on study — v0.4

Bloop now uses physical cartridges, release handles, typed sockets, a moving valve, pump/fan buttons and physical power selectors. The water repair is the first practical task, followed by air and a shared-power chamber test. The eight-specialist order is unchanged. The supply rack sits at (-34, -38); machine footprints retain the old air/water bench coordinates. The approved floor dashes, graph and first-person controller remain unchanged.

All eight studios now have original-art personal corners. Character identities come from `CHARACTER_REFERENCE.md`; Bloop is the pufferfish. These interior details do not unlock later studies or introduce them simultaneously. Future physical studies can reuse `hands-on.js` without changing the world graph.


## Guided adventure and Moss — v0.5

The eight facility positions, footprints, doors, tunnels and dashed route geometry are unchanged. Moss is now implemented. Its completion requires the practical backup trial and opens Nori; later studies remain pending. The new local furniture detour preserves the approved route points whenever clear and inserts room waypoints only for obstructed legs. The first-person controller remains unchanged.

Moss equipment: charging shelf (-3.6, -32), battery docks (-2.4, -37.6), cable board (2.8, -37.5), backup switch (3.6, -35), research control (5.5, -33), night-test button (3.5, -30.7). Moss’s original-art projection sits at (0, -28), separate from equipment. A live feed links the room to Bloop’s actual life-support state. All values are simplified training assumptions.

The environment pass adds saturated botanical accents, ceiling-supported hanging pots, greenhouse trellis, warm lighting and repeated-decoration instancing. The design system is based on the supplied screenshots, with all active-game interfaces using shared tokens. Original per-room music paths are configurable but empty pending user files.
