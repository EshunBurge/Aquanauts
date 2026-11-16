# Aquanauts — connected website and lunar mission

Phase 2 review checkpoint. Based on the existing [Aquanauts website](https://github.com/eshunburge/Aquanauts), revision `94f57d330dcba3822acb3badf8311f82312373fe`. The website stays static HTML/CSS/JavaScript; its Firebase account adapter, original artwork, shop, pets, prizes and certificate generator are preserved.

The homepage, shared navigation and dashboard Play Mission links open `mission/`. The game opens as a full page with its own rendering context, so the website's older global Three.js pet viewer does not conflict with the game's module version. The game wordmark returns home; Control center returns to the existing dashboard/account flow. No second account system is introduced.

## Run and build

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

## Source and publication layout

- Root HTML, `css/`, `js/`, `img/`, `media/`, `models/`: existing website, with focused mission links and navigation styles.
- `mission-src/`: current game source of truth for subsequent integrated work. The earlier standalone workspace is retained as a checkpoint, not another profile or product to maintain.
- `mission/`: generated production game for the existing GitHub Pages root publication. Rebuild it from `mission-src`; do not hand-edit compiled files.
- `dist/`: complete static website plus mission, ready for a static host. Either deploy these contents or retain the existing repository-root Pages setup with generated `mission/` committed alongside the website.
- `source-provenance.json`: original website revision and file hashes.
- `tests/integration.test.mjs`: path, preservation, launcher, syntax and build-asset checks. The 53 existing game checks are also run by `npm test`.

No live repository push, publishing setting change or deployment is performed at this review checkpoint. No Firebase project, account, rule, credential or storage permission was changed. Existing public Firebase client configuration is retained; no administrator/storage secret was added.

## Phase boundaries and known issues

The user reports Bloop and other gameplay regressions. They remain OPEN and were explicitly deferred while Phase 2 proceeds. Navigation testing and passing automated checks do not close these reports. See `OPEN_GAMEPLAY_ISSUES.txt`.

This phase connects navigation and packages one website/game. Phase 3 must connect the existing authenticated profile and Firestore state to the game runtime. Until then, the mission's existing save remains browser-local and does not update dashboard course percentages, coins, pets or certificates. Do not describe it as cross-device account synchronization. No player name/profile form or new login service was added to the game.

Original specialist music is included. Central Hub music is still missing. Full audible audio verification, pet following, reward/certificate integration and the voice studio remain their assigned later phases. The site's legacy Tink name and asset filenames are preserved; the game uses the requested Tank name.

Desktop and phone-sized viewport navigation were checked; this is not physical mobile-device or full touch-gameplay certification. Existing external Google Fonts/Firebase availability and Firebase authorized domains remain hosting dependencies. Live signed-in cross-device behavior was not tested in this phase.
