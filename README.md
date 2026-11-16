<p align="center">
  <img src="img/octopus.png" alt="Aquanauts octopus crew member" height="140">
</p>

<h1 align="center">🌊 AQUANAUTS 🚀</h1>

<p align="center"><b>Small crew. Giant discoveries.</b><br>
An astronaut training mission for kids ages 7 to 12, run by a crew of sea creatures.</p>

<p align="center">
  <a href="https://eshunburge.github.io/Aquanauts/">Play and explore</a> ·
  <a href="https://aquanauts.app">aquanauts.app</a>
</p>

---

Aquanauts is an interactive astronaut training experience designed to help children understand what it takes to operate a lunar base. Rather than presenting space science through traditional lessons, our game places players inside a simulated environment where they can experience the responsibilities of an astronaut firsthand.

## 🐙 How Aquanauts Works

Players explore a three-dimensional lunar base using keyboard or touchscreen controls. Throughout eight missions, they work alongside a crew of sea-creature astronauts, each specializing in an essential part of the base's operations. Every mission introduces a scientific concept through a short lesson before challenging players to apply what they have learned.

| Mission | Crew member | Specialty |
|---|---|---|
| 01 | Bloop | Life support |
| 02 | Moss | Energy systems |
| 03 | Nori | Food and agriculture |
| 04 | Luma | Space hazards |
| 05 | Pip | Engineering |
| 06 | Skim | Sustainability |
| 07 | Pebble | Mission planning |
| 08 | Tank | Final mission |

For example, players might discover that the base's air filtration system has malfunctioned. They must locate the appropriate tools, navigate to the affected equipment, and complete repairs to restore the system. Other missions explore how astronauts generate electricity, produce food, protect themselves from radiation, and manage limited resources. These activities demonstrate how individual systems contribute to the success of an entire mission.

To make the experience approachable for younger audiences, crew members guide players through captioned instructions, while a glowing navigation trail helps them locate their next objective. Each mission concludes with a knowledge check that reinforces the scientific principles introduced during gameplay.

Beyond the simulation, Aquanauts includes a connected website that serves as the player's mission control center. Children can monitor their progress, explore a map of the lunar base, and earn coins to unlock rewards. They can also adopt interactive 3D crew pets, encouraging continued engagement as they advance through the game. A dedicated teacher mode allows educators to access individual missions directly, making Aquanauts adaptable for classroom instruction.

We also designed and built a physical Aquanauts game board that connects to the game to introduce an additional hands-on element. The board features five illuminated LEDs and three rotating dials, with a spinning octopus head as its centerpiece. This extension allows children to interact with the Aquanauts theme beyond the digital environment.

## 🎓 Educational Benefits and Intended Impact

Our primary goal is to help children understand the reasoning behind the systems that make space exploration possible. Instead of memorizing facts about spacecraft, players discover why those systems matter by experiencing situations in which they are needed.

Aquanauts also encourages independent learning. Players can repeat missions without penalties, allowing them to experiment with different approaches and learn from their mistakes. We intentionally avoided traditional time limits and failure-based mechanics so that children can focus on understanding concepts rather than simply completing tasks.

We hope Aquanauts inspires children to recognize the variety of careers involved in space exploration. A successful mission depends on far more than astronauts alone, and our lessons demonstrate how different scientific disciplines contribute to a shared objective. By introducing these responsibilities at an early age, we want children to begin imagining themselves as future contributors to space exploration.

## 🛠️ Development Tools and Technology

We developed the Aquanauts website using HTML, CSS, and JavaScript. The three-dimensional simulation was built with Three.js and Vite, allowing players to explore an interactive lunar environment directly in their browsers. Firebase Authentication and Firestore support optional user accounts and progress tracking, while GitHub Pages hosts the application, which is also embedded within our WordPress website.

During development, we used Claude, an AI assistant developed by Anthropic, to support coding and testing. Canva was used to design our presentation materials, and we used Procreate to make all of our characters. AI-generated images helped us visualize potential merchandise. These images are clearly labeled.

## 🎨 Creativity and Design Considerations

One of Aquanauts' most distinctive features is its unusual approach to astronaut training. Rather than using conventional human astronauts, we created a crew of sea creatures, each with a recognizable personality and responsibility aboard the lunar base. This creative direction makes an unfamiliar scientific environment feel welcoming to younger children without removing the complexity of the concepts being taught.

We also wanted the gameplay to reflect authentic challenges rather than unrelated educational activities. NASA resources, including DONKI space weather observations and OSDR astronaut health research, helped inform our mission design. Measurements from lunar and Martian exploration provided additional scientific context, allowing us to connect fictional scenarios with real discoveries.

Accessibility was another major consideration. Aquanauts runs in a web browser without requiring a download, and children can begin playing as guests without creating an account. Caption-based guidance supports use in classrooms and quiet environments, while adjustable text sizes, reduced-motion options, and simplified gameplay help accommodate different needs.

Throughout development, we focused on creating an experience that children would genuinely enjoy while ensuring that the science remained meaningful. Every design decision was guided by the same goal: helping young learners move beyond simply knowing facts about space to understanding how those facts apply to real missions.

Ultimately, Aquanauts demonstrates that meaningful STEM education does not have to feel like a traditional classroom lesson. By allowing children to take responsibility for their own lunar mission, we hope to inspire the confidence and curiosity that will encourage them to continue exploring STEM long after the game ends.

---

## ⚙️ For developers

Phase 2 review checkpoint. Based on the existing [Aquanauts website](https://github.com/eshunburge/Aquanauts), revision `94f57d330dcba3822acb3badf8311f82312373fe`. The website stays static HTML/CSS/JavaScript; its Firebase account adapter, original artwork, shop, pets, prizes and certificate generator are preserved.

The homepage, shared navigation and dashboard Play Mission links open `mission/`. The game opens as a full page with its own rendering context, so the website's older global Three.js pet viewer does not conflict with the game's module version. The game wordmark returns home; Control center returns to the existing dashboard/account flow. No second account system is introduced.

### Run and build

Use Node 22.12+ (tested with Node 24).

```sh
npm run setup
npm run build
npm test
npm run preview
```

The preview normally opens at `http://127.0.0.1:5176/`. To reproduce GitHub Pages subdirectory hosting:

```sh
SITE_MOUNT=Aquanauts npm run preview
```

Open `http://127.0.0.1:5176/Aquanauts/`. `PORT` can select another local port. `npm run dev` builds and starts the same preview. The static server reads only generated `dist/`, with explicit 404s for missing files.

### Source and publication layout

- Root HTML, `css/`, `js/`, `img/`, `media/`, `models/`: existing website, with focused mission links and navigation styles.
- `mission-src/`: current game source of truth for subsequent integrated work. The earlier standalone workspace is retained as a checkpoint, not another profile or product to maintain.
- `mission/`: generated production game for the existing GitHub Pages root publication. Rebuild it from `mission-src`; do not hand-edit compiled files.
- `dist/`: complete static website plus mission, ready for a static host. Either deploy these contents or retain the existing repository-root Pages setup with generated `mission/` committed alongside the website.
- `source-provenance.json`: original website revision and file hashes.
- `tests/integration.test.mjs`: path, preservation, launcher, syntax and build-asset checks. The 53 existing game checks are also run by `npm test`.

No live repository push, publishing setting change or deployment is performed at this review checkpoint. No Firebase project, account, rule, credential or storage permission was changed. Existing public Firebase client configuration is retained; no administrator/storage secret was added.

### Phase boundaries and known issues

The user reports Bloop and other gameplay regressions. They remain OPEN and were explicitly deferred while Phase 2 proceeds. Navigation testing and passing automated checks do not close these reports. See `OPEN_GAMEPLAY_ISSUES.txt`.

This phase connects navigation and packages one website/game. Phase 3 must connect the existing authenticated profile and Firestore state to the game runtime. Until then, the mission's existing save remains browser-local and does not update dashboard course percentages, coins, pets or certificates. Do not describe it as cross-device account synchronization. No player name/profile form or new login service was added to the game.

Original specialist music is included. Central Hub music is still missing. Full audible audio verification, pet following, reward/certificate integration and the voice studio remain their assigned later phases. The site's legacy Tink name and asset filenames are preserved; the game uses the requested Tank name.

Desktop and phone-sized viewport navigation were checked; this is not physical mobile-device or full touch-gameplay certification. Existing external Google Fonts/Firebase availability and Firebase authorized domains remain hosting dependencies. Live signed-in cross-device behavior was not tested in this phase.

### Game to dashboard sync (added)

`js/dashboard.js` (`syncGame`) reads the game's save (`localStorage` key `aquanauts.settlement.v1`, same origin) and turns it into course progress: a finished room is 100%, partly finished rooms count their steps (capped below 100 until the game marks the room complete). That fills the dashboard progress bars, unlocks the next adventure, adds a play day to the streak, and pays out the existing prizes and coins. It runs when the dashboard opens, when the tab regains focus (for example after "Control center" in the game), and on browser `storage` events. Progress is per browser, not per account, until the game is connected to Firestore. If the game's save format changes, update `gamePct` and `GAME_STEPS`.
