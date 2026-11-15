/* ==========================================================
   AQUANAUTS student dashboard
   State lives in localStorage for now. Every spot marked BACKEND
   is where the real account/game data should be loaded and saved.
   ========================================================== */
function AQ_DASH() {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const user = JSON.parse(localStorage.getItem('aq_user') || 'null');
  if (!user) { location.replace('login.html'); return; }
  const GAME_URL = '#'; // BACKEND: link to the real game (the progressive web app)
  const KEY = 'aq_state_' + user.email;
  const full = (JSON.parse(localStorage.getItem('aq_users') || '[]').find(u => u.email === user.email) || {});

  /* ---------- data ---------- */
  const COURSES = [
    { id: 1, who: 'Bloop', img: 'pufferfish', room: 'Life Support Laboratory', title: 'Human Survival and Life Support', line: 'Carry filters. Fix air and water.', col: 0, row: 0, short: 'Life support' },
    { id: 2, who: 'Moss', img: 'axolotl', room: 'Energy Systems Station', title: 'Energy Systems', line: 'Keep the power running.', col: 1, row: 0, short: 'Energy systems' },
    { id: 3, who: 'Nori', img: 'nautilus', room: 'Food and Agriculture Dome', title: 'Agriculture and Food Systems', line: 'Grow food for the crew.', col: 2, row: 0, short: 'Food and farming' },
    { id: 4, who: 'Luma', img: 'angler', room: 'Space Hazards Watch', title: 'Space Environments and Hazards', line: 'Spot danger before it arrives.', col: 2, row: 1, short: 'Space hazards' },
    { id: 5, who: 'Pip', img: 'crab', room: 'Engineering Bay', title: 'Engineering and Infrastructure', line: 'Fix what breaks.', col: 2, row: 2, short: 'Engineering' },
    { id: 6, who: 'Skim', img: 'ray', room: 'Sustainability Center', title: 'Resource Management and Sustainability', line: 'Make supplies last.', col: 1, row: 2, short: 'Sustainability' },
    { id: 7, who: 'Pebble', img: 'tardigrade', room: 'Mission Planning Room', title: 'Mission Planning and Decision Making', line: 'Plan the route ahead.', col: 0, row: 2, short: 'Mission planning' },
    { id: 8, who: 'Tank', img: 'octopus', room: 'Final Mission', title: 'Running the Whole Outpost', line: 'Use everything you learned.', col: 0, row: 1, short: 'Final mission' }
  ];
  const PRIZES = window.AQ_PRIZES, COIN = window.AQ_COIN, PETS = AQPets.list;
  const prize = id => PRIZES.find(p => p.id === id);
  const coinSvg = (cls) => `<svg class="${cls || ''}" viewBox="0 0 216 216" aria-hidden="true">${COIN}</svg>`;
  const artSvg = p => `<svg class="art" viewBox="0 0 216 216" role="img" aria-label="${p.title}">${p.svg}</svg>`;
  const iso = d => d.toLocaleDateString('sv');
  const ico = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM19 19v2H6"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.800 6.600 19.700l1.100-6.100L3.200 9.400l6.100-.8L12 3z"/></svg>',
    paw: '<svg viewBox="0 0 24 24"><circle cx="6" cy="11" r="2"/><circle cx="10" cy="6.500" r="2"/><circle cx="15" cy="6.500" r="2"/><circle cx="19" cy="11" r="2"/><path d="M12 12c-3 0-6 3-6 5.500 0 1.700 1.500 2.500 3 2.500 1.200 0 2-.5 3-.5s1.800.5 3 .5c1.500 0 3-.8 3-2.500C18 15 15 12 12 12z"/></svg>',
    shop: '<svg viewBox="0 0 24 24"><path d="M4 8h16l-1.200 12H5.200L4 8zM8 8V6a4 4 0 0 1 8 0v2"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.400 3.600-7 8-7s8 2.600 8 7"/></svg>'
  };
  const NAV = [['home', 'Control center', ico.home], ['map', 'Moon Base', ico.map], ['courses', 'Adventures', ico.book], ['shop', 'Cantina', ico.shop], ['profile', 'Profile', ico.user]];

  /* ---------- state ---------- */
  const blank = () => ({ joined: Date.now(), goal: 10, large: false, quiz: {}, coins: 0, pct: {}, plays: [iso(new Date())], earned: {}, pets: [], active: null, avatar: 'pufferfish', name: user.first || '', certName: [user.first, full.last].filter(Boolean).join(' '), visited: [], log: [{ t: Date.now(), text: 'Joined Aquanauts' }] });
  let S; // BACKEND: load this student's data from the server instead of localStorage
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = blank(); }
  const applySize = () => { document.documentElement.style.fontSize = S.large ? '112.5%' : ''; };
  const save = () => { localStorage.setItem(KEY, JSON.stringify(S)); if (window.AQ && AQ.push) AQ.push(S); }; // saved to Firebase when it is connected

  const status = c => { const p = S.pct[c.id] || 0; if (p >= 100) return 'done'; const cur = COURSES.find(x => (S.pct[x.id] || 0) < 100); return cur && cur.id === c.id ? 'cur' : 'lock'; };
  const current = () => COURSES.find(c => (S.pct[c.id] || 0) < 100) || null;
  function streak() {
    const set = new Set(S.plays); const d = new Date(); let n = 0;
    if (!set.has(iso(d))) { d.setDate(d.getDate() - 1); if (!set.has(iso(d))) return 0; }
    while (set.has(iso(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const ago = t => { const m = Math.round((Date.now() - t) / 60000); if (m < 1) return 'Just now'; if (m < 60) return m + ' min ago'; const h = Math.round(m / 60); if (h < 24) return h + ' hr ago'; return Math.round(h / 24) + ' days ago'; };

  /* ---------- toast ---------- */
  let tt; function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2800); }

  /* ---------- awards ---------- */
  function award(id) {
    if (S.earned[id]) return false; const p = prize(id); if (!p) return false;
    S.earned[id] = Date.now(); S.coins += p.reward || 0; S.log.unshift({ t: Date.now(), text: `Earned ${p.title} (+${p.reward} coins)` });
    toast(`New prize: ${p.title}  +${p.reward} coins`); bump(); return true;
  }
  function evaluate() {
    const any = COURSES.some(c => (S.pct[c.id] || 0) > 0);
    if (any) award('badge-first-steps');
    if (COURSES.some(c => (S.pct[c.id] || 0) >= 50)) award('badge-problem-solver');
    if (COURSES.some(c => (S.pct[c.id] || 0) >= 100)) award('badge-course-complete');
    COURSES.forEach(c => { if ((S.pct[c.id] || 0) >= 100) award('token-' + c.who.toLowerCase()); });
    if (S.visited.length >= COURSES.length + 1) award('badge-explorer');
    const st = streak(); [[3, 'streak-3'], [7, 'streak-7'], [30, 'streak-30']].forEach(([n, id]) => { if (st >= n) award(id); });
    save();
  }
  function advance(by) {
    const c = current(); if (!c) return toast('Every course is finished');
    const before = S.pct[c.id] || 0; S.pct[c.id] = Math.min(100, before + by);
    if (S.pct[c.id] >= 100) S.log.unshift({ t: Date.now(), text: `Finished ${c.title}` });
    else if (!before) S.log.unshift({ t: Date.now(), text: `Started ${c.title}` });
    const today = iso(new Date()); if (!S.plays.includes(today)) S.plays.push(today);
    evaluate(); draw();
  }

  /* ---------- header ---------- */
  let shownCoins = null;
  function bump() { const p = $('#coinPill'); p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); }
  function countTo(to) {
    const el = $('#coinNum'); const from = shownCoins == null ? to : shownCoins; shownCoins = to;
    if (from === to) { el.textContent = to; return; }
    const t0 = performance.now(); (function f(n) { const k = Math.min(1, (n - t0) / 700); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
  }
  function header() {
    $('#coinIco').innerHTML = coinSvg(); countTo(S.coins); $('#streakNum').textContent = streak();
    $('#meBtn').innerHTML = '<span class="ini">' + esc((S.name || user.first || '?').trim().charAt(0).toUpperCase()) + '</span>';
  }

  /* ---------- views ---------- */
  let view = 'home', buddy = null, modalViewer = null, petTab = 'pets', mapSel = null;
  const TITLES = { home: 'Control center', map: 'Moon Base', courses: 'Adventures', shop: 'Cantina', profile: 'Profile' };

  function stopViewers() { if (buddy) { buddy.dispose(); buddy = null; } }

  function vHome() {
    const c = current(), st = streak(), earned = Object.keys(S.earned).length, ap = S.active && PETS.find(p => p.id === S.active);
    const hello = st > 1 ? `You are on a ${st} day streak. Keep it going.` : 'Ready for your next mission?';
    const days = []; const d0 = new Date(); for (let i = 6; i >= 0; i--) { const d = new Date(d0); d.setDate(d.getDate() - i); days.push(d); }
    const week = days.map((d, i) => `<div class="day"><div class="dot ${S.plays.includes(iso(d)) ? 'on' : ''} ${i === 6 ? 'today' : ''}" style="transition-delay:${i * .06}s"><svg viewBox="0 0 24 24"><path d="M12 2c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4.500 3-7 1 1.500 2 2 3 2 0-2-.5-4 0-6z"/></svg></div>${d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 3)}</div>`).join('');
    // next prizes
    const nxt = []; const sn = [[3, 'streak-3'], [7, 'streak-7'], [30, 'streak-30']].find(([n, id]) => !S.earned[id]);
    if (sn) nxt.push({ p: prize(sn[1]), note: `${st} of ${sn[0]} days so far` });
    if (c) nxt.push({ p: prize('token-' + c.who.toLowerCase()), note: `Finish ${c.who}'s course` });
    ['badge-first-steps', 'badge-problem-solver', 'badge-explorer', 'badge-quick-thinker', 'badge-team-player', 'badge-helper', 'badge-course-complete'].filter(id => !S.earned[id]).slice(0, 4 - nxt.length).forEach(id => nxt.push({ p: prize(id), note: prize(id).line }));
    const nextHtml = nxt.slice(0, 3).map(n => `<div class="next">${artSvg(n.p)}<div><h4>${n.p.title}</h4><p>${n.note}</p></div><span class="rew">${coinSvg()}+${n.p.reward}</span></div>`).join('') || '<p class="sub">You have every prize. Amazing work.</p>';
    const feed = S.log.slice(0, 6).map(l => `<li><i></i><div>${l.text}</div><span>${ago(l.t)}</span></li>`).join('');
    return `
    <section class="hello">
      <div class="card welcome"><span class="eyebrow">Your mission</span><h2>Welcome back, ${esc(S.name || user.first)}.</h2><p>${hello}</p>
        <a class="btn sm" href="${GAME_URL}" data-play>${c ? ((S.pct[c.id] || 0) > 0 ? 'Continue course' : 'Start your first course') : 'Play again'}</a></div>
      <div class="card buddy">${ap ? `<canvas id="buddyCv" aria-label="${ap.name} the ${ap.species}"></canvas><div class="bar"><div><b>${ap.name}</b><br><span>${ap.species}. Drag to turn.</span></div><a class="link" href="#pets">Change</a></div>`
        : `<div class="empty"><h3>No pet yet</h3><p>Pets keep you company on your dashboard. Adopt one with your coins.</p><a class="btn sm" href="#pets">Visit the cantina</a></div>`}</div>
    </section>
    <section class="stats">
      <div class="stat"><small>Coins</small><b>${coinSvg()}${S.coins}</b><span>To spend in the cantina</span></div>
      <div class="stat"><small>Streak</small><b>${st}</b><span>${st === 1 ? 'day' : 'days'} in a row</span></div>
      <div class="stat"><small>Prizes</small><b>${earned}</b><span>Earned so far</span></div>
      <div class="stat"><small>Pets</small><b>${S.pets.length}</b><span>In your collection</span></div>
    </section>
    <section class="cols">
      <div class="card">${c ? `<div class="row-head"><h2>Your next mission</h2><a class="link" href="#courses">All adventures</a></div>
        <div class="cont"><div class="pic"><img src="img/${c.img}.png" alt="${c.who}"></div><div><h3>${c.title}</h3><p class="room">${c.who} · ${c.room}</p>
        <div class="bar-track"><div class="bar-fill" data-w="${S.pct[c.id] || 0}"></div></div><div class="bar-meta"><span>${S.pct[c.id] || 0}% done</span><span>${c.line}</span></div>
        <a class="btn sm" href="${GAME_URL}" data-play>${(S.pct[c.id] || 0) > 0 ? 'Continue' : 'Start'}</a></div></div>`
        : `<h2>Every course finished</h2><p class="sub">You ran the whole outpost. Open your certificates any time.</p><a class="btn sm" href="#courses">See certificates</a>`}</div>
      <div class="card"><div class="row-head"><h2>This week</h2></div><p class="sub">Your goal is ${S.goal || 10} minutes a day. Play a little every day to grow your streak.</p><div class="week">${week}</div><p class="wk">${st > 0 ? `${st} ${st === 1 ? 'day' : 'days'} in a row. Play today to keep it going.` : 'Play today to start your streak.'}</p></div>
    </section>
    <section class="cols">
      <div class="card"><div class="row-head"><h2>Prizes to win next</h2><a class="link" href="#prizes">All prizes</a></div><div class="next-list">${nextHtml}</div></div>
      <div class="card"><div class="row-head"><h2>Recent activity</h2></div><ul class="feed">${feed}</ul></div>
    </section>`;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ----- map ----- */
  const COLS = [170, 500, 830], ROWS = [100, 360, 620], NW = 250, NH = 104;
  function mapSvg() {
    const star = (cx, cy, r, ri, n) => { const p = []; for (let i = 0; i < n * 2; i++) { const rr = i % 2 ? ri : r, a = (-90 + i * 180 / n) * Math.PI / 180; p.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1)); } return p.join(' '); };
    let nodes = '', k = 0;
    const mk = (id, num, name, role, st, img, c, r, w) => {
      w = w || NW; const x = COLS[c] - w / 2, y = ROWS[r] - NH / 2;
      const pic = img ? `<image href="img/${img}.png" x="${x + 10}" y="${y + 10}" width="88" height="84" preserveAspectRatio="xMidYMid meet"/>`
        : `<g class="flagicon"><ellipse class="mound" cx="${x + 54}" cy="${y + 86}" rx="42" ry="9"/><path class="pole" d="M${x + 50} ${y + 84}V${y + 16}"/><path class="pennant" d="M${x + 50} ${y + 18}H${x + 92}L${x + 80} ${y + 34}L${x + 92} ${y + 50}H${x + 50}Z"/></g>`;
      const lock = st === 'lock' ? `<g class="lock" transform="translate(${x + w - 30},${y + 12})"><rect x="0" y="7" width="14" height="10" rx="2"/><path d="M3 7V4a4 4 0 0 1 8 0v3"/></g>` : '';
      const tick = st === 'done' ? `<g class="tick" transform="translate(${x + w - 28},${y + 4})"><circle cx="12" cy="12" r="13"/><path d="M6 12.500l4 4 8-9"/></g>` : '';
      const mark = st === 'cur' ? `<g class="marker" style="transform-origin:${x + w / 2}px ${y}px"><polygon points="${x + w / 2 - 14},${y - 30} ${x + w / 2 + 14},${y - 30} ${x + w / 2},${y - 10}"/></g>` : '';
      nodes += `<g class="node ${st}${id === 'hub' ? ' hub' : ''}${mapSel === id ? ' sel' : ''}" data-id="${id}" tabindex="0" role="button" aria-label="${name}" style="--d:${(0.2 + (k++) * 0.08).toFixed(2)}s"><rect class="sh" x="${x + 7}" y="${y + 7}" width="${w}" height="${NH}" rx="20"/><g class="lift"><rect class="bd" x="${x}" y="${y}" width="${w}" height="${NH}" rx="20"/>${pic}<text class="m-num" x="${x + 110}" y="${y + 30}">${num}</text><text class="m-name" x="${x + 110}" y="${y + 64}">${name}</text><text class="m-role" x="${x + 110}" y="${y + 88}">${role}</text>${lock}${tick}</g>${mark}</g>`;
    };
    COURSES.forEach(c => mk('c' + c.id, '0' + c.id, c.who, c.short, status(c), c.img, c.col, c.row));
    mk('hub', 'START', 'Central Hub', 'Briefing and map', 'open', null, 1, 1);
    const doneIds = COURSES.filter(c => status(c) === 'done').map(c => c.id);
    const tun = [['M170 100H830', [1, 2]], ['M830 100V620', [3, 4]], ['M830 620H170', [5, 6]], ['M170 620V100', [7, 8]], ['M170 360H500', []]]
      .map(([d, ids]) => `<path class="tun${ids.some(i => doneIds.includes(i)) ? ' on' : ''}" pathLength="1" d="${d}"/>`).join('');
    return `<svg class="map-svg" viewBox="0 0 1000 740" role="group" aria-label="Moon Base map">${tun}${nodes}
      <g class="legend"><rect x="40" y="702" width="18" height="18" rx="5" fill="#99dce1"/><text x="68" y="716">Finished</text><rect x="190" y="702" width="18" height="18" rx="5" fill="#f58a53"/><text x="218" y="716">Next</text><rect x="310" y="702" width="18" height="18" rx="5" fill="#0f232b"/><text x="338" y="716">Locked</text></g></svg>`;
  }
  function mapPanel() {
    const id = mapSel;
    if (!id || id === 'hub') return `<div class="card panel"><div class="pimg"><svg viewBox="0 0 108 100"><g class="flagicon" style="--x:0"><ellipse cx="54" cy="86" rx="42" ry="9" fill="#99dce1"/><path d="M50 84V16" stroke="#99dce1" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M50 18H92L80 34L92 50H50Z" fill="#f58a53" stroke="#99dce1" stroke-width="3" stroke-linejoin="round"/></g></svg></div><span class="eyebrow">Start here</span><h3>Central Hub</h3><p class="role">Command and social</p><p class="line">Briefing, map and crew meeting. Pick a room on the map to see who works there.</p></div>`;
    const c = COURSES.find(x => 'c' + x.id === id), st = status(c), p = S.pct[c.id] || 0, prev = COURSES[c.id - 2];
    const btns = st === 'cur' ? `<a class="btn sm" href="${GAME_URL}" data-play>${p ? 'Continue course' : 'Start course'}</a>`
      : st === 'done' ? `<a class="btn sm" href="certificate.html?name=${encodeURIComponent(S.certName)}&course=${c.id}">View certificate</a><a class="btn sm ghost" href="${GAME_URL}" data-play>Review</a>`
        : `<span class="btn sm ghost off">Finish ${prev.who}'s course first</span>`;
    return `<div class="card panel"><div class="pimg"><img src="img/${c.img}.png" alt="${c.who}"></div><span class="eyebrow">Room 0${c.id}</span><h3>${c.who}</h3><p class="role">${c.room}</p>
      <span class="tag ${st}">${st === 'done' ? 'Finished' : st === 'cur' ? (p ? p + '% done' : 'Next mission') : 'Locked'}</span><p class="line">${c.title}. ${c.line}</p><div class="btns">${btns}</div></div>`;
  }
  function mapList() {
    const row = (id, num, name, role, st, img) => `<button class="mnode ${st}${mapSel === id ? ' sel' : ''}" data-id="${id}" type="button"><span class="mn-pic">${img ? `<img src="img/${img}.png" alt="">` : '<svg viewBox="0 0 108 100"><ellipse cx="54" cy="86" rx="42" ry="9" fill="#031012"/><path d="M50 84V16" stroke="#031012" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M50 18H92L80 34L92 50H50Z" fill="#F58A53" stroke="#031012" stroke-width="3" stroke-linejoin="round"/></svg>'}</span><span class="mn-t"><small>${num}</small><b>${name}</b><em>${role}</em></span><span class="mn-s">${st === 'done' ? 'Finished' : st === 'cur' ? 'Next' : st === 'lock' ? 'Locked' : 'Start'}</span></button>`;
    return `<div class="map-list">${row('hub', 'Start', 'Central Hub', 'Briefing and map', 'open', null)}${COURSES.map(c => row('c' + c.id, 'Level 0' + c.id, c.who, c.short, status(c), c.img)).join('')}</div>`;
  }
  function vMap() { return `<section class="map-grid"><div class="map-wrap"><div class="map-scroll" id="mapScroll">${mapSvg()}</div>${mapList()}</div></section>`; }

  /* ----- study: words + quizzes (BACKEND: load real lessons and quizzes per course) ----- */
  const STUDY = {
    1: { words: [['Oxygen', 'The gas we need to breathe.'], ['Filter', 'Catches dirt to clean air or water.'], ['Carbon dioxide', 'The gas we breathe out.'], ['Pressure', 'The push of air on everything around it.'], ['Hydration', 'Having enough water in your body.']],
      quiz: [['Which gas do astronauts need to breathe?', 'Oxygen', ['Helium', 'Steam']], ['What does a filter do?', 'Catches dirt to clean air or water', ['Makes things hotter', 'Makes things louder']], ['Which gas do we breathe out?', 'Carbon dioxide', ['Oxygen', 'Sunlight']], ['What does a sealed base keep inside?', 'Air', ['Rocks', 'Rain']]] },
    2: { words: [['Solar panel', 'Turns sunlight into electricity.'], ['Battery', 'Stores energy to use later.'], ['Generator', 'A machine that makes electricity.'], ['Circuit', 'The loop that electricity travels around.'], ['Renewable', 'Energy that never runs out.']],
      quiz: [['What does a solar panel turn into electricity?', 'Sunlight', ['Water', 'Sound']], ['What does a battery do?', 'Stores energy for later', ['Makes plants grow', 'Cleans the air']], ['What is a circuit?', 'A loop electricity travels around', ['A kind of rock', 'A space suit']], ['Which choice saves power?', 'Switching off lights you do not need', ['Leaving every light on', 'Opening the door']]] },
    3: { words: [['Hydroponics', 'Growing plants in water, not soil.'], ['Nutrient', 'Food that helps a plant grow.'], ['Photosynthesis', 'How plants turn light into food.'], ['Harvest', 'Picking the food you grew.'], ['Seed', 'A tiny start for a new plant.']],
      quiz: [['What is hydroponics?', 'Growing plants in water', ['Digging tunnels', 'Cooking food']], ['What do plants use to make food?', 'Light', ['Rocks', 'Plastic']], ['What does a nutrient do?', 'Helps a plant grow', ['Makes it glow', 'Makes it sleepy']], ['What does harvest mean?', 'Picking the food you grew', ['Planting a seed', 'Watering a plant']]] },
    4: { words: [['Radiation', 'Invisible energy from the Sun and space.'], ['Meteoroid', 'A small rock flying through space.'], ['Vacuum', 'A place with no air at all.'], ['Solar flare', 'A burst of energy from the Sun.'], ['Shield', 'Something that blocks harm.']],
      quiz: [['What is a vacuum?', 'A place with no air', ['A kind of storm', 'A type of fuel']], ['What is a meteoroid?', 'A small rock flying through space', ['A bright star', 'A moon base']], ['What does a shield protect you from?', 'Harmful radiation', ['Being hungry', 'Being late']], ['Where does a solar flare come from?', 'The Sun', ['The ocean', 'A battery']]] },
    5: { words: [['Structure', 'Something built to hold weight.'], ['Prototype', 'A first test version of an idea.'], ['Material', 'What something is made from.'], ['Load', 'The weight a structure carries.'], ['Repair', 'Fixing something that broke.']],
      quiz: [['What is a prototype?', 'A first test version', ['A finished city', 'A kind of fuel']], ['What is a structure?', 'Something built to hold weight', ['A type of food', 'A bright light']], ['Why test before you build for real?', 'To find problems early', ['To waste time', 'To make noise']], ['Which of these is a material?', 'Steel', ['Friday', 'Giggling']]] },
    6: { words: [['Resource', 'Something useful you can use up.'], ['Recycle', 'Turn used things into new things.'], ['Waste', 'Stuff that gets thrown away.'], ['Renewable', 'Can be replaced again and again.'], ['Conserve', 'Use less so it lasts longer.']],
      quiz: [['What does recycle mean?', 'Turn used things into new things', ['Throw things away', 'Hide things']], ['What does conserve mean?', 'Use less so it lasts longer', ['Use it all today', 'Buy more']], ['Which of these is renewable?', 'Sunlight', ['Coal', 'A broken bolt']], ['What is waste?', 'Stuff that gets thrown away', ['A new tool', 'A bright idea']]] },
    7: { words: [['Goal', 'What you want to reach.'], ['Risk', 'Something that could go wrong.'], ['Backup plan', 'What you do if plan one fails.'], ['Priority', 'The thing that matters most.'], ['Trade-off', 'Giving up one thing to get another.']],
      quiz: [['What is a risk?', 'Something that could go wrong', ['A kind of snack', 'A nice surprise']], ['What is a backup plan?', 'What you do if plan one fails', ['A plan to do nothing', 'A very old map']], ['What is a priority?', 'The thing that matters most', ['The thing you forgot', 'The smallest job']], ['What is a goal?', 'What you want to reach', ['A broken tool', 'A loud noise']]] },
    8: { words: [['System', 'Parts that work together.'], ['Teamwork', 'Working together to finish a job.'], ['Emergency', 'A sudden problem that needs quick help.'], ['Mission control', 'The team that guides the mission.'], ['Crew', 'The people who work on a mission.']],
      quiz: [['What is a system?', 'Parts that work together', ['One lonely bolt', 'A type of rock']], ['What should you do first in an emergency?', 'Stay calm and tell the crew', ['Hide in a cupboard', 'Keep it a secret']], ['What does teamwork mean?', 'Working together to finish a job', ['Doing it all alone', 'Waiting for someone else']], ['Who is mission control?', 'The team that guides the mission', ['A kind of robot arm', 'A moon crater']]] }
  };
  S.quiz = S.quiz || {};
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function vCourses() {
    return `<div class="card"><h2>Your adventures</h2><p class="sub">Finish each course in order to unlock the next room on the Moon Base. Practice the words and take a quick quiz for bonus coins.</p></div><div class="clist">${COURSES.map(c => {
      const st = status(c), p = S.pct[c.id] || 0, q = S.quiz[c.id], open = st !== 'lock';
      const study = open ? `<button class="chip" data-words="${c.id}" type="button">Vocab words</button><button class="chip ${q && q.passed ? 'ok' : ''}" data-quiz="${c.id}" type="button">${q ? 'Quiz · best ' + q.best + ' of 4' : 'Quick quiz'}</button>` : `<span class="chip off">Vocab words</span><span class="chip off">Quick quiz</span>`;
      return `<div class="crow ${st === 'lock' ? 'locked' : ''}"><div class="pic"><img src="img/${c.img}.png" alt="${c.who}"></div>
        <div class="info"><h3>${c.title}</h3><p>${c.who} · ${c.room}</p><div class="study">${study}</div></div>
        <div class="meta"><div class="bar-track"><div class="bar-fill" data-w="${p}"></div></div><div class="bar-meta"><span>${st === 'done' ? 'Finished' : st === 'lock' ? 'Locked' : p + '% done'}</span></div></div>
        <div class="acts">${st === 'done' ? `<a class="btn sm" href="certificate.html?name=${encodeURIComponent(S.certName)}&course=${c.id}">Certificate</a><a class="btn sm ghost" href="${GAME_URL}" data-play>Review</a>` : st === 'cur' ? `<a class="btn sm" href="${GAME_URL}" data-play>${p ? 'Continue' : 'Start'}</a>` : `<span class="btn sm ghost off">Locked</span>`}</div></div>`;
    }).join('')}</div>`;
  }

  function wordsModal(id) {
    const c = COURSES.find(x => x.id === +id), w = STUDY[id].words;
    openModal(`<div class="m-study"><span class="eyebrow">${c.who} · Vocab words</span><h3>${c.short}</h3><p class="sub">Read each word, then try the quiz.</p>
      <div class="words">${w.map(([a, b]) => `<div class="word"><b>${a}</b><p>${b}</p></div>`).join('')}</div>
      <div class="acts"><button class="btn sm" data-quiz="${id}" type="button">Take the quiz</button><button class="btn sm ghost" id="wclose" type="button">Close</button></div></div>`,
      () => { $('#wclose').onclick = closeModal; });
  }

  const DESC = {1: "Bloop keeps the air clean and the water safe. Without clean air and water, nobody on the Moon Base could stay for long. In this level you help Bloop look after both.", 2: "Moss runs the power station. Lights, heaters and computers all need electricity, and the Moon Base has to make its own. In this level you keep the power on.", 3: "Nori grows food under the dome lights. Plants give the crew food and fresh air, but they need the right light, water and care. In this level you help them grow.", 4: "Luma watches the dark for danger. The Sun sometimes throws out bursts of energy that are not safe to stand in. In this level you spot the warning signs and keep the crew safe.", 5: "Pip fixes whatever breaks. Space is rough on buildings, with dust, heat and cold. In this level you find the problem, pick strong materials and test your repair.", 6: "Skim makes supplies last. There is no shop on the Moon, so the crew has to use things again and again. In this level you plan how to waste less.", 7: "Pebble plans every trip. A good plan checks the risks and has a backup. In this level you compare your choices and pick the best way to go.", 8: "Tank runs the control room. Every room needs something different, and sometimes everything goes wrong at once. In this level you use all you have learned."};
  const BIG = {1: 'How do astronauts keep breathing and drinking clean water far from Earth?', 2: 'Where does a base on the Moon get its power?', 3: 'How do you grow food where there is no garden?', 4: 'How do we know when space is not safe?', 5: 'What do you do when something breaks and the nearest shop is a whole planet away?', 6: 'How do you make supplies last when you cannot order more?', 7: 'How do you plan a trip when space weather keeps changing?', 8: 'Can you keep the whole base running at the same time?'};
  const DO = {1: ['Fix a broken air filter', 'Check how much oxygen is left', 'Make dirty water safe to drink'], 2: ['Point the solar panels at the Sun', 'Fix a power cut', 'Choose what to switch off when power runs low'], 3: ['Plant seeds under the dome lights', 'Give the plants water and nutrients', 'Pick a harvest the whole crew can share'], 4: ['Read a space weather warning', 'Spot a solar flare before it arrives', 'Move the crew to a safe room'], 5: ['Find the crack in the wall', 'Pick the strongest material', 'Test your fix before it counts'], 6: ['Sort what can be used again', 'Cut down on waste', 'Plan what the base needs next month'], 7: ['Compare two routes', 'Check the space weather forecast', 'Make a backup plan'], 8: ['Watch every room at once', 'Solve a surprise emergency', 'Work with the whole crew']};
  const SCI = {1: ['OSDR', "OSDR is NASA's library of space experiments. It shows how astronaut bodies change in space, so Bloop knows what the crew needs to stay healthy."], 2: ['Artemis and Mars missions', 'Moon and Mars missions measure sunlight, dust and cold on the ground. That tells us what a power station on another world has to handle.'], 3: ['OSDR', 'OSDR holds experiments on how plants and other living things grow in space. Nori uses what scientists have learned.'], 4: ['DONKI and OSDR', "DONKI is NASA's space weather database. It records storms on the Sun and says when radiation could be a danger. OSDR adds how much radiation astronauts have really received."], 5: ['Artemis and Mars missions', 'Surface missions show the dust, rocky ground and big swings between hot and cold that buildings have to survive.'], 6: ['Artemis and Mars missions', 'Surface missions tell us what the Moon and Mars have, and what they do not. That helps the crew waste nothing.'], 7: ['DONKI', 'Planners use space weather information like DONKI to choose a safe time to go outside or to launch.'], 8: ['DONKI, OSDR and Artemis and Mars missions', 'Tank brings it all together: solar activity from DONKI, astronaut health research from OSDR and ground measurements from the Moon and Mars.']};
  function levelModal(id) {
    if (id === 'hub') {
      return openModal(`<div class="m-level"><div class="lv-pic hubpic"><svg viewBox="0 0 108 100"><ellipse cx="54" cy="86" rx="42" ry="9" fill="#99dce1"/><path d="M50 84V16" stroke="#99dce1" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M50 18H92L80 34L92 50H50Z" fill="#f58a53" stroke="#99dce1" stroke-width="3" stroke-linejoin="round"/></svg></div>
        <div class="lv-body"><span class="eyebrow">Start here</span><h3>Central Hub</h3><p class="lv-line">Command and social</p><p class="lv-desc">This is where every mission begins. Get your briefing, check the map and meet the crew before you head to a room.</p>
        <ul class="lv-list"><li>Open the map and pick a room</li><li>Meet the crew member who works there</li><li>Finish the level to unlock the next room</li></ul><div class="acts"><button class="btn sm" id="lvgo" type="button">Got it</button></div></div></div>`, () => { $('#lvgo').onclick = closeModal; });
    }
    const c = COURSES.find(x => 'c' + x.id === id), st = status(c), p = S.pct[c.id] || 0, prev = COURSES[c.id - 2], q = S.quiz[c.id];
    const tag = st === 'done' ? 'Finished' : st === 'cur' ? (p ? p + '% done' : 'Next mission') : 'Locked';
    const words = STUDY[c.id].words.slice(0, 4).map(w => `<span class="chip off w">${w[0]}</span>`).join('');
    const acts = st === 'cur' ? `<a class="btn sm" href="${GAME_URL}" data-play>${p ? 'Continue level' : 'Start level'}</a>`
      : st === 'done' ? `<a class="btn sm" href="certificate.html?name=${encodeURIComponent(S.certName)}&course=${c.id}">View certificate</a><a class="btn sm ghost" href="${GAME_URL}" data-play>Replay</a>`
        : `<span class="btn sm ghost off">Finish ${prev.who}'s level first</span>`;
    const study = st !== 'lock' ? `<button class="chip" data-words="${c.id}" type="button">Vocab words</button><button class="chip ${q && q.passed ? 'ok' : ''}" data-quiz="${c.id}" type="button">${q ? 'Quiz · best ' + q.best + ' of 4' : 'Quick quiz'}</button>` : '';
    openModal(`<div class="m-level ${st === 'lock' ? 'locked' : ''}"><div class="lv-pic"><img src="img/${c.img}.png" alt="${c.who}"></div>
      <div class="lv-body"><span class="eyebrow">Level 0${c.id} · ${c.room}</span><h3>${c.title}</h3><span class="tag ${st}">${tag}</span>
      <p class="lv-big">${BIG[c.id]}</p><p class="lv-desc">${DESC[c.id]}</p></div>
      <div class="lv-more"><div class="lv-cols"><div><small>What you will do</small><ul class="lv-list">${DO[c.id].map(d => `<li>${d}</li>`).join('')}</ul></div>
      <div class="lv-sci"><small>Real science behind it</small><b>${SCI[c.id][0]}</b><p>${SCI[c.id][1]}</p></div></div>
      <div class="lv-words"><small>Words you will meet</small><div>${words}</div></div>
      <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div>
      <div class="acts">${acts}</div>${study ? `<div class="study">${study}</div>` : ''}</div></div>`, () => { $$('#mCard [data-play]').forEach(a => a.addEventListener('click', e => { if (GAME_URL === '#') { e.preventDefault(); toast('The game opens here once it is connected.'); } })); });
  }

  function quizModal(id) {
    const c = COURSES.find(x => x.id === +id);
    const qs = shuffle(STUDY[id].quiz).map(([q, ok, bad]) => ({ q, ok, opts: shuffle([ok, ...bad]) }));
    let i = 0, score = 0;
    const ask = () => {
      const k = qs[i];
      openModal(`<div class="m-quiz"><span class="eyebrow">${c.who} · Question ${i + 1} of ${qs.length}</span><div class="qbar"><i style="width:${i / qs.length * 100}%"></i></div><h3>${k.q}</h3>
        <div class="opts">${k.opts.map((o, n) => `<button class="opt" data-n="${n}" type="button">${o}</button>`).join('')}</div><p class="fb" id="fb" aria-live="polite">&nbsp;</p>
        <div class="acts"><button class="btn sm" id="qnext" type="button" disabled>${i === qs.length - 1 ? 'See my score' : 'Next question'}</button></div></div>`, () => {
        let done = false;
        $$('.opt').forEach(b => b.addEventListener('click', () => {
          if (done) return; done = true; const right = k.opts[+b.dataset.n] === k.ok; if (right) score++;
          $$('.opt').forEach(x => { x.disabled = true; if (k.opts[+x.dataset.n] === k.ok) x.classList.add('right'); });
          if (!right) b.classList.add('wrong');
          $('#fb').textContent = right ? 'Correct!' : 'Not quite. The answer is ' + k.ok + '.';
          $('#qnext').disabled = false; $('#qnext').focus();
        }));
        $('#qnext').addEventListener('click', () => { i++; i < qs.length ? ask() : finish(); });
      });
    };
    const finish = () => {
      const q = S.quiz[id] || { best: 0, passed: false }, first = !q.passed && score >= 3; q.best = Math.max(q.best, score);
      let msg = score === qs.length ? 'Perfect score!' : score >= 3 ? 'Nice work!' : 'Good try. Check the words and have another go.';
      if (first) { q.passed = true; S.coins += 10; S.log.unshift({ t: Date.now(), text: `Passed the ${c.short} quiz (+10 coins)` }); bump(); }
      S.quiz[id] = q; save();
      if (score === qs.length) award('badge-quick-thinker');
      save(); header();
      openModal(`<div class="m-quiz"><span class="eyebrow">${c.who} · Quiz done</span><h3>${score} of ${qs.length} right</h3><p class="sub">${msg}${first ? ' You earned 10 coins.' : ''}</p>
        <div class="acts"><button class="btn sm" id="again" type="button">Try again</button><button class="btn sm ghost" data-words="${id}" type="button">Vocab words</button><button class="btn sm ghost" id="qdone" type="button">Done</button></div></div>`,
        () => { $('#again').onclick = () => quizModal(id); $('#qdone').onclick = () => { closeModal(); draw(); }; });
    };
    ask();
  }

  /* ----- shop: pets, my pets, prizes ----- */
  function prizesHtml() {
    const groups = [['Streaks', 'Come back and play day after day.'], ['Badges', 'Earned for doing things well at the Moon Base.'], ['Crew tokens', 'One for each course you finish.']];
    return groups.map(([g, sub]) => {
      const items = PRIZES.filter(p => p.group === g);
      return `<div class="card pgrp"><h2>${g}</h2><p class="sub">${sub}</p><div class="pgrid">${items.map(p => { const own = !!S.earned[p.id]; return `<div class="prize ${own ? '' : 'locked'}">${artSvg(p)}<h4>${p.title}</h4><p>${p.line}</p><span class="st">${own ? 'Earned' : 'Not yet'} · +${p.reward} coins</span></div>`; }).join('')}</div></div>`;
    }).join('');
  }
  function petsHtml() {
    const owned = PETS.filter(p => S.pets.includes(p.id));
    const list = petTab === 'pets' ? PETS : owned;
    const card = p => {
      const own = S.pets.includes(p.id), act = S.active === p.id;
      const buy = own ? `<span class="badge-own">${act ? 'On your Home' : 'Owned'}</span>${act ? '' : `<button class="btn sm" data-adopt="${p.id}" type="button">Show on Home</button>`}`
        : `<span class="price">${coinSvg()}${p.price}</span><button class="btn sm ${S.coins < p.price ? 'ghost' : ''}" data-buy="${p.id}" type="button">${S.coins < p.price ? 'Need ' + (p.price - S.coins) + ' more' : 'Adopt'}</button>`;
      return `<article class="pet ${own ? 'own' : ''}"><button class="view3d" data-view="${p.id}" type="button" aria-label="See ${p.name} in 3D"><img src="img/pets/${p.id}.png" alt="${p.name} the ${p.species}"><span>View in 3D</span></button>
        <h3>${p.name}</h3><div class="kind"><span class="rar ${p.rarity}">${p.rarity}</span>${p.species}</div><p>${p.desc}</p><div class="buy">${buy}</div></article>`;
    };
    return list.length ? `<div class="petgrid">${list.map(card).join('')}</div>` : `<div class="card"><div class="empty"><h3>No pets yet</h3><p>Earn coins by winning prizes, then adopt your first pet.</p><button class="btn sm" data-tab="pets" type="button">Go to the pets</button></div></div>`;
  }
  function vShop() {
    const owned = S.pets.length, earnedN = Object.keys(S.earned).length, total = PRIZES.filter(p => p.reward).length;
    return `<div class="card shophead"><div><h2>Cantina</h2><p class="sub">${petTab === 'prizes' ? `${earnedN} of ${total} prizes earned. Every prize pays out coins.` : 'Win prizes to collect coins, then spend them on a pet.'}</p></div></div>
      <div class="tabs" role="tablist"><button class="${petTab === 'pets' ? 'on' : ''}" data-tab="pets" type="button">Pets</button><button class="${petTab === 'mine' ? 'on' : ''}" data-tab="mine" type="button">My pets (${owned})</button><button class="${petTab === 'prizes' ? 'on' : ''}" data-tab="prizes" type="button">Prizes (${earnedN})</button></div>
      ${petTab === 'prizes' ? prizesHtml() : petsHtml()}`;
  }

  /* ----- profile ----- */
  const RANKS = [[0, 'Cadet', 'Everyone starts here. Finish your first adventure to move up.'], [1, 'Junior Astronaut', 'You have finished your first adventure.'], [3, 'Astronaut', 'Three adventures down. The crew trusts you.'], [6, 'Senior Astronaut', 'Almost the whole base is yours.'], [8, 'Commander', 'You can run the whole outpost.']];
  const SOURCES = [
    ['Space Weather Database', 'DONKI', 'NASA keeps a diary of what the Sun is doing. It writes down solar flares and storms and says when they could be risky for astronauts.', ['Luma', 'Pebble', 'Tank'], 'Sun'],
    ['Open Science Data Repository', 'OSDR', 'A giant library of space experiments. It shows how plants, animals and people change in space, and how much radiation astronauts really get.', ['Bloop', 'Nori', 'Luma', 'Tank'], 'Lab'],
    ['Artemis and Mars surface missions', 'Moon and Mars', 'Robots and astronauts measure the ground, dust, air and temperature on the Moon and Mars, so we know what a real base has to survive.', ['Moss', 'Pip', 'Skim', 'Tank'], 'Planet']
  ];
  const srcIcon = {
    Sun: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="12"/><path d="M32 6v10M32 48v10M6 32h10M48 32h10M13.600 13.600l7 7M43.400 43.400l7 7M13.600 50.400l7-7M43.400 20.600l7-7"/></svg>',
    Lab: '<svg viewBox="0 0 64 64"><path d="M24 6h16M28 6v18L12 52a4 4 0 0 0 4 6h32a4 4 0 0 0 4-6L36 24V6"/><path d="M20 40h24"/></svg>',
    Planet: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="16"/><path d="M6 40c8 6 28 2 44-8s8-16 8-16"/></svg>'
  };
  function rankOf() { const n = COURSES.filter(c => (S.pct[c.id] || 0) >= 100).length; let i = 0; RANKS.forEach((r, k) => { if (n >= r[0]) i = k; }); return { n, i, cur: RANKS[i], next: RANKS[i + 1] }; }
  function vProfile() {
    const r = rankOf(), since = new Date(S.joined || Date.now()).toLocaleDateString('en', { month: 'long', year: 'numeric' });
    const toNext = r.next ? r.next[0] - r.n : 0, rp = r.next ? Math.round((r.n - r.cur[0]) / (r.next[0] - r.cur[0]) * 100) : 100;
    const earnedList = PRIZES.filter(p => S.earned[p.id]), petList = PETS.filter(p => S.pets.includes(p.id));
    const log = COURSES.map(c => { const p = S.pct[c.id] || 0, st = status(c); return `<div class="mlog ${st === 'lock' ? 'locked' : ''}"><img src="img/${c.img}.png" alt=""><div><div class="ml-top"><b>${c.short}</b><span>${st === 'done' ? 'Done' : st === 'lock' ? 'Locked' : p + '%'}</span></div><div class="bar-track"><div class="bar-fill" data-w="${p}"></div></div></div></div>`; }).join('');
    const sci = SOURCES.map(([n, k, d, who, ic]) => `<article class="src"><div class="src-ic">${srcIcon[ic]}</div><span class="eyebrow">${k}</span><h3>${n}</h3><p>${d}</p><div class="src-who"><small>Used by</small><div>${who.map(w => `<span class="chip off w">${w}</span>`).join('')}</div></div></article>`).join('');
    return `
    <section class="prof-top">
      <div class="card idcard"><div class="id-head"><span class="ini">${esc((S.name || user.first || '?').trim().charAt(0).toUpperCase())}</span><div><span class="eyebrow">Astronaut ID</span><h2>${esc(S.name || user.first)}</h2><p>${r.cur[1]} · Astronaut since ${since}</p></div></div>
        <p class="id-note">${r.cur[2]}</p>
        <div class="rank"><div class="rank-row"><b>${r.cur[1]}</b><span>${r.next ? `${toNext} more ${toNext === 1 ? 'adventure' : 'adventures'} to become ${r.next[1]}` : 'Top rank reached'}</span></div><div class="bar-track"><div class="bar-fill" data-w="${rp}"></div></div></div>
        <div class="me-stats"><div><b>${S.coins}</b><span>Coins in the cantina</span></div><div><b>${streak()}</b><span>Days in a row</span></div><div><b>${r.n}</b><span>Adventures finished</span></div><div><b>${earnedList.length}</b><span>Prizes won</span></div></div></div>
      <div class="card"><h2>About you</h2><p class="sub">This is how you show up in the game and on your certificates.</p>
        <div class="fld"><label for="pName">Astronaut name</label><input id="pName" value="${esc(S.name)}" maxlength="24"><small>The crew will call you this.</small></div>
        <div class="fld"><label for="pCert">Name on certificates</label><input id="pCert" value="${esc(S.certName)}" maxlength="40"><small>Printed on every certificate you earn.</small></div>
        <div class="fld"><label>Email</label><input value="${esc(user.email)}" readonly><small>This is how you log in.</small></div>
        <button class="btn sm" id="saveProfile" type="button">Save changes</button></div>
    </section>
    <section class="prof-two">
      <div class="card"><div class="row-head"><h2>My adventure log</h2><a class="link" href="#courses">Adventures</a></div><p class="sub">How far you have come in each part of the Moon Base.</p><div class="mlogs">${log}</div></div>
      <div class="card"><div class="row-head"><h2>My collection</h2><a class="link" href="#shop">Cantina</a></div>
        <p class="sub">Prizes you have won (${earnedList.length}) and pets you have adopted (${petList.length}).</p>
        <div class="coll"><small>Prizes</small>${earnedList.length ? `<div class="coll-row">${earnedList.map(p => `<span title="${p.title}">${artSvg(p)}</span>`).join('')}</div>` : '<p class="muted-p">No prizes yet. Finish a level to win your first one.</p>'}</div>
        <div class="coll"><small>Pets</small>${petList.length ? `<div class="coll-row pets">${petList.map(p => `<span title="${p.name} the ${p.species}"><img src="img/pets/${p.id}.png" alt="${p.name}"></span>`).join('')}</div>` : '<p class="muted-p">No pets yet. Win coins and adopt one in the cantina.</p>'}</div></div>
    </section>
    <section class="card sci"><span class="eyebrow">Real science</span><h2>Where our science comes from</h2><p class="sub">Everything you learn in Aquanauts is based on real information from NASA. The crew turn it into missions you can play.</p><div class="srcgrid">${sci}</div></section>
    <section class="card"><h2>Settings</h2><p class="sub">Make the game fit you.</p>
      <div class="set-row"><div><b>Daily goal</b><p>How many minutes would you like to play each day?</p></div><div class="seg" id="goalSeg">${[5, 10, 15, 20].map(m => `<button class="${(S.goal || 10) === m ? 'on' : ''}" data-goal="${m}" type="button">${m} min</button>`).join('')}</div></div>
      <div class="set-row"><div><b>Text size</b><p>Make the words bigger if they are hard to read.</p></div><div class="seg" id="sizeSeg"><button class="${S.large ? '' : 'on'}" data-size="0" type="button">Normal</button><button class="${S.large ? 'on' : ''}" data-size="1" type="button">Large</button></div></div></section>
    <div class="card demo"><h2>Testing tools</h2><p class="sub">These buttons pretend the game happened so you can try everything out. Remove this card before launch.</p>
      <div class="btns"><button class="btn sm ghost" data-demo="coins" type="button">Add 50 coins</button><button class="btn sm ghost" data-demo="adv" type="button">Add 25% to the current adventure</button><button class="btn sm ghost" data-demo="done" type="button">Finish the current adventure</button><button class="btn sm ghost" data-demo="day" type="button">Add a play day</button><button class="btn sm ghost" data-demo="badge" type="button">Game awards a badge</button><button class="btn sm ghost" data-demo="reset" type="button">Reset everything</button></div></div>`;
  }

  const VIEWS = { home: vHome, map: vMap, courses: vCourses, shop: vShop, profile: vProfile };

  /* ---------- modal ---------- */
  function openModal(html, after) { $('#mCard').innerHTML = `<button class="m-x" id="mx" aria-label="Close" type="button"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><div class="m-scroll">${html}</div>`; $('#modal').classList.add('show'); $('#modal').setAttribute('aria-hidden', 'false'); $('#mx').onclick = closeModal; after && after(); }
  function closeModal() { $('#modal').classList.remove('show'); $('#modal').setAttribute('aria-hidden', 'true'); if (modalViewer) { modalViewer.dispose(); modalViewer = null; } }
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function petModal(id) {
    const p = PETS.find(x => x.id === id), own = S.pets.includes(id);
    openModal(`<div class="m-pet"><canvas id="mCv" aria-label="${p.name} in 3D"></canvas><div><span class="rar ${p.rarity}">${p.rarity}</span><h3>${p.name}</h3><p><b>${p.species}.</b> ${p.desc}</p><p style="font-size:.85rem">Drag the pet to turn it around.</p>
      <div class="acts">${own ? `<span class="badge-own">Owned</span>${S.active === id ? '' : `<button class="btn sm" data-adopt="${id}" type="button">Show on Home</button>`}` : `<span class="price">${coinSvg()}${p.price}</span><button class="btn sm ${S.coins < p.price ? 'ghost' : ''}" data-buy="${id}" type="button">${S.coins < p.price ? 'Need ' + (p.price - S.coins) + ' more' : 'Adopt'}</button>`}</div></div></div>`,
      () => { modalViewer = AQPets.viewer($('#mCv'), { id, auto: true }); });
  }
  function confirmBuy(id) {
    const p = PETS.find(x => x.id === id); if (S.coins < p.price) return toast('You need ' + (p.price - S.coins) + ' more coins');
    if (modalViewer) { modalViewer.dispose(); modalViewer = null; }
    openModal(`<div class="m-sm"><h3>Adopt ${p.name}?</h3><p>${p.name} the ${p.species} costs ${p.price} coins. You will have ${S.coins - p.price} coins left.</p><div class="acts"><button class="btn sm" id="yes" type="button">Yes, adopt ${p.name}</button><button class="btn sm ghost" id="no" type="button">Not now</button></div></div>`,
      () => { $('#no').onclick = closeModal; $('#yes').onclick = () => { S.coins -= p.price; S.pets.push(id); if (!S.active) S.active = id; S.log.unshift({ t: Date.now(), text: `Adopted ${p.name} the ${p.species}` }); save(); closeModal(); toast(`${p.name} joined your crew!`); bump(); draw(); }; });
  }

  /* ---------- draw ---------- */
  function draw() {
    stopViewers(); header();
    $('#pageTitle').textContent = TITLES[view];
    $$('#snav a').forEach(a => a.classList.toggle('on', a.dataset.v === view));
    const v = $('#view'); v.innerHTML = VIEWS[view](); bind(v);
    requestAnimationFrame(() => setTimeout(() => $$('.bar-fill', v).forEach(b => b.style.width = b.dataset.w + '%'), 60));
    if (view === 'home' && S.active && $('#buddyCv')) buddy = AQPets.viewer($('#buddyCv'), { id: S.active, auto: true });
  }
  function bind(v) {
    $$('[data-play]', v).forEach(a => a.addEventListener('click', e => { if (GAME_URL === '#') { e.preventDefault(); toast('The game opens here once it is connected.'); } }));
    $$('[data-tab]', v).forEach(b => b.addEventListener('click', () => { petTab = b.dataset.tab; draw(); }));
    $$('[data-view]', v).forEach(b => b.addEventListener('click', () => petModal(b.dataset.view)));
    if (view === 'map') {
      const sel = n => { mapSel = n.dataset.id; if (!S.visited.includes(mapSel)) { S.visited.push(mapSel); evaluate(); header(); } $$('.map-svg .node').forEach(x => x.classList.toggle('sel', x.dataset.id === n.dataset.id)); levelModal(mapSel); };
      $$('.mnode', v).forEach(n => n.addEventListener('click', () => { $$('.mnode').forEach(x => x.classList.toggle('sel', x === n)); sel(n); }));
      $$('.map-svg .node', v).forEach(n => { n.addEventListener('click', () => sel(n)); n.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel(n); } }); });
    }
    if (view === 'profile') {
      $$('[data-goal]', v).forEach(b => b.addEventListener('click', () => { S.goal = +b.dataset.goal; save(); toast('Daily goal set to ' + S.goal + ' minutes'); draw(); }));
      $$('[data-size]', v).forEach(b => b.addEventListener('click', () => { S.large = b.dataset.size === '1'; applySize(); save(); draw(); }));
      $('#saveProfile', v).addEventListener('click', () => { S.name = $('#pName').value.trim() || user.first; S.certName = $('#pCert').value.trim() || S.certName; save(); toast('Saved'); });
      $$('[data-demo]', v).forEach(b => b.addEventListener('click', () => {
        const k = b.dataset.demo;
        if (k === 'coins') { S.coins += 50; S.log.unshift({ t: Date.now(), text: 'Added 50 test coins' }); save(); bump(); draw(); }
        if (k === 'adv') advance(25);
        if (k === 'done') advance(100);
        if (k === 'day') { const set = new Set(S.plays); const d = new Date(); while (set.has(iso(d))) d.setDate(d.getDate() - 1); S.plays.push(iso(d)); evaluate(); draw(); }
        if (k === 'badge') { const id = ['badge-quick-thinker', 'badge-team-player', 'badge-helper'].find(i => !S.earned[i]); if (!id) return toast('Those badges are already earned'); award(id); save(); draw(); }
        if (k === 'reset') { if (confirm('Reset all progress for this account?')) { S = blank(); shownCoins = null; save(); draw(); } }
      }));
    }
    $$('[data-buy]', v).forEach(b => b.addEventListener('click', () => confirmBuy(b.dataset.buy)));
    $$('[data-adopt]', v).forEach(b => b.addEventListener('click', () => { S.active = b.dataset.adopt; save(); closeModal(); toast('Home pet changed'); draw(); }));
  }
  document.addEventListener('click', e => { const w = e.target.closest('[data-words]'); if (w) return wordsModal(w.dataset.words); const qz = e.target.closest('[data-quiz]'); if (qz) return quizModal(qz.dataset.quiz); const b = e.target.closest('#mCard [data-buy]'); if (b) confirmBuy(b.dataset.buy); const a = e.target.closest('#mCard [data-adopt]'); if (a) { S.active = a.dataset.adopt; save(); closeModal(); toast('Home pet changed'); draw(); } });

  /* ---------- routing + init ---------- */
  function route() { let h = (location.hash || '#home').slice(1); if (h === 'prizes') { h = 'shop'; petTab = 'prizes'; } else if (h === 'pets') { h = 'shop'; petTab = 'pets'; } view = VIEWS[h] ? h : 'home'; scrollTo(0, 0); draw(); }
  $('#snav').innerHTML = NAV.map(([k, t, i]) => `<a href="#${k}" data-v="${k}">${i}<span>${t}</span></a>`).join('');
  $('#meBtn').addEventListener('click', () => { location.hash = '#profile'; });
  $('#logout').addEventListener('click', async () => { if (window.AQ && AQ.live) await AQ.logOut(); localStorage.removeItem('aq_user'); location.href = 'login.html'; });
  addEventListener('hashchange', route);
  // streak counts today's visit as a play day only when the game is played; the dashboard itself does not log plays
  applySize(); evaluate(); route();
}
window.AQ ? AQ.whenReady(AQ_DASH) : AQ_DASH();
