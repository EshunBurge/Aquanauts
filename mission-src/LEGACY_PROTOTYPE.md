# Aquanauts · First Night on the Moon

Playable first-person lunar outpost prototype for ages 7–12. Built from an empty workspace using Three.js and Vite; no pre-existing application was replaced.

## Run locally

Use Node.js 22.12+ (tested with Node 24).

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite in Google Chrome. For a release build, run `npm run build`, then `npm run preview`. Run simulation tests with `npm test`.

## Play

Start the mission. WASD moves; click the habitat to capture the mouse, move the mouse to look, aim at a station and press E or click. Esc releases the mouse. P pauses. Arrow up/down move and left/right turn. Settings provide sensitivity and reduced animation controls.

Point & click mode offers large navigation buttons and clickable station objects, without requiring mouse capture. Stations and instructions pause the simulation. Losing window focus pauses the game. Captions provide every character's dialogue without requiring audio.

Mission walkthrough: talk to Bloop, then Moss; inspect Power; connect the battery; choose lab priorities; save the plan; check Life support; leave fan/heater/recycler on; begin the 90-second training night. Pausing both labs is a safe initial plan. With the standard battery you can also keep one lab running if sufficient energy remains. Check your remaining battery, then compare another plan in replay. The challenge replay starts with less stored energy and greater fictional exposure.

## Working systems

- Modular habitat, window view of Earth, illustrated lunar terrain, solar panels, system bays, greenhouse alcove and shelter.
- First-person movement with collision checks, mouse-look, keyboard interaction, accessible station navigation.
- Bloop and Moss primitive 3D silhouettes based on the supplied illustration sheet; original cropped portraits in dialogue.
- Shared power generation, demand, connected battery storage and finite energy. Power shortages affect air cleaning, water recycling and warmth.
- Grow lights trade energy for food growth; research trades energy for research progress. Water recycling trades energy for stored water.
- Three primary HUD categories; detailed numbers at stations.
- Six-stage introductory mission, accelerated night, contextual emergency help, completion feedback, normal and challenge replay.
- Optional material-cost shielding and delayed Earth power-tip reply.
- Settings, captions, focus containment for dialogs and WebGL error message.

## Science provenance and limits

The mission is fictional. All equipment ratings, reserves, exposure units and time compression are simplified game assumptions. The 90-second night models two hours of battery use (80 simulation seconds per real second). A real lunar night often lasts about two Earth weeks. This slice does not model surviving that full duration.

`src/nasa-data.js` embeds one curated, archived NASA solar observation: the May 14, 2024 X8.7-class flare reported by Solar Dynamics Observatory. The in-game NASA field notes link its original NASA report and Moon facts. No live feed is connected. DONKI retrieval returned an error/timed out; RadLab and OSDR integration remain future work. Game exposure is not measured dose and flare class does not predict local astronaut dose. Terrain is procedural art, not NASA elevation data.

The approximately 3-second Earth reply demonstrates signal travel for a lunar round trip. Actual response time also depends on ground-team operations; this is not the long delay experienced at Mars.

## Assets and brand

Brand mark downloaded from https://aquanauts.app/wp-content/uploads/2026/11/Logo-Design-for-Your-Brand-1.png. Original website currently returns a blank body with WordPress styles and a logo. Manrope follows its supplied stylesheet; offline system fallbacks work without Google Fonts.

Bloop/Moss portraits cropped and rotated from the user-provided illustration sheet. Orange octopus = Bloop and green pufferfish = Moss are provisional assignments: the sheet has no labels. No synthetic character illustrations are used. Geometry-based characters are intentionally early prototypes, not final production models.

## Incomplete / next milestone

Confirm the eight original name-to-art assignments and refine Bloop/Moss models. Playtest with children. Add mission save/resume, audio, equipment animation, richer protection decisions and one traceable DONKI/RadLab archive. Then introduce the next specialist and a second mission. Six other characters, the full mission progression and final integrated mission are not implemented.

## Validation

Seven Node tests exercise battery endurance, excess demand, life-support failures, food/research trade-offs, shielding, readiness and frozen completion. Release build passes. Browser-tested the point-and-click route from launch through life-support verification and night start; no console errors in local preview. Desktop Google Chrome rendering was inspected. Full Chrome mouse-look and completion/replay UI still require a manual playthrough after native automation lost the window. Simulation completion and two-hour reserve calculations are tested independently. This is an initial vertical slice, not a complete challenge submission.
