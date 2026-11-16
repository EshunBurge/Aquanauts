/* ==========================================================
   AQUANAUTS — shared scripts
   Injects nav / menu / footer / cart so every page stays in sync.
   NOTE: auth + cart are front-end demos that use localStorage.
   Swap the marked "BACKEND" spots for real API calls before launch.
   ========================================================== */
(() => {
  // always open pages at the top (unless the link has a #section)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) { const d = document.documentElement; d.style.scrollBehavior = 'auto'; scrollTo(0, 0); requestAnimationFrame(() => { scrollTo(0, 0); d.style.scrollBehavior = ''; }); }
  addEventListener('pageshow', () => { if (!location.hash) scrollTo(0, 0); });
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;

  const ICON = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.6 9H8z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>',
    arrow: '',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>'
  };

  /* ---------- inject chrome ---------- */
  const user = JSON.parse(localStorage.getItem('aq_user') || 'null');
  const nav = `
  <header class="nav" id="nav">
    <div class="nav-inner">
      <a href="index.html" class="brand" aria-label="Aquanauts home">Aquanauts<i></i></a>
      <div class="nav-right">
        <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false"><span></span></button>
      </div>
    </div>
  </header>
  <div class="menu" id="menu" aria-hidden="true">
    <div class="menu-inner">
      <nav>
        <a href="index.html"><small>01</small>Home</a>
        <a href="shop.html"><small>02</small>Shop</a>
        <a href="${user ? 'dashboard.html' : 'login.html'}"><small>03</small>${user ? 'My dashboard' : 'Log in'}</a>
      </nav>
    </div>
  </div>
  <div class="scrim" id="scrim"></div>
  <aside class="drawer" id="drawer" aria-label="Shopping cart" aria-hidden="true">
    <div class="drawer-head"><h3>Your cart</h3><button class="icon-btn" id="drawerClose" aria-label="Close cart">${ICON.close}</button></div>
    <div class="drawer-body" id="drawerBody"></div>
    <div class="drawer-foot" id="drawerFoot"></div>
  </aside>
  <div class="toast" id="toast">${ICON.check}<span id="toastMsg"></span></div>`;
  document.body.insertAdjacentHTML('afterbegin', nav);

  document.body.insertAdjacentHTML('beforeend', `
  <footer class="footer">
    <div class="wrap">
      <div class="foot-grid">
        <div><a href="index.html" class="brand">Aquanauts<i></i></a><p>An astronaut simulation game that teaches kids real-world problem solving.</p></div>
        <div><h5>Explore</h5><ul><li><a href="index.html">Home</a></li><li><a href="index.html#crew">The crew</a></li><li><a href="index.html#how">How it works</a></li><li><a href="shop.html">Shop</a></li></ul></div>
        <div><h5>Account</h5><ul><li><a href="${user ? 'dashboard.html' : 'login.html'}">${user ? 'My dashboard' : 'Log in'}</a></li>${user ? '' : '<li><a href="login.html#signup">Sign up</a></li>'}<li><a href="#">Privacy</a></li></ul></div>
      </div>
      <div class="foot-bottom"><span>© <span id="yr"></span> Aquanauts. All rights reserved.</span><span>Demo app. The shop is not real.</span></div>
    </div>
  </footer>`);
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- nav + scroll behaviour ---------- */
  const navEl = $('#nav');
  document.body.insertAdjacentHTML('afterbegin', '<div class="progress-top" id="progressTop"></div>');
  const progTop = $('#progressTop');
  const octoPar = $('.octo-par');
  const onScroll = () => {
    navEl.classList.toggle('scrolled', scrollY > 20);
    const max = document.documentElement.scrollHeight - innerHeight;
    progTop.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (octoPar && scrollY < innerHeight) octoPar.style.transform = `translateY(${scrollY * .18}px) rotate(${scrollY * .015}deg)`;
  };
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = open => {
    burger.classList.toggle('open', open); menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); closeCart(); } });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- toast ---------- */
  let tt;
  window.toast = msg => {
    $('#toastMsg').textContent = msg; $('#toast').classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => $('#toast').classList.remove('show'), 2600);
  };

  /* ==========================================================
     CART  (BACKEND: replace with your checkout/cart API)
     ========================================================== */
  const PRODUCT = { id: 'board', name: 'Aquanauts Game Board', variant: 'Standard edition', price: 49.99 };
  const getCart = () => JSON.parse(localStorage.getItem('aq_cart') || '[]');
  const saveCart = c => { localStorage.setItem('aq_cart', JSON.stringify(c)); renderCart(); };
  const money = n => '$' + n.toFixed(2);
  const drawer = $('#drawer'), scrim = $('#scrim');
  function openCart() { drawer.classList.add('open'); scrim.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
  function closeCart() { drawer.classList.remove('open'); scrim.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
  document.addEventListener('click', e => { if (e.target.closest('[data-open-cart]')) openCart(); });
  $('#drawerClose').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);

  function renderCart() {
    const cart = getCart();
    const count = cart.reduce((a, i) => a + i.qty, 0);
    const badge = $('#cartCount'); burger.classList.toggle('has-cart', count > 0);
    if (badge) badge.textContent = count;
    const body = $('#drawerBody'), foot = $('#drawerFoot');
    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty"><img src="img/octopus.png" alt=""><h4 style="font-size:1.6rem;color:var(--aqua)">Cart's empty</h4><p>Dive in and grab the game board or a plush crew mate.</p><a class="btn btn-primary" href="shop.html">Visit the shop</a></div>`;
      foot.innerHTML = ''; return;
    }
    body.innerHTML = `<div style="display:grid;gap:14px">${cart.map(i => `
      <div class="cart-item">
        <div class="thumb-mini"><img src="${i.img || 'img/octopus.png'}" alt="" style="${i.img ? 'width:100%;border-radius:12px' : ''}"></div>
        <div><h4>${i.name}</h4><small>${i.variant}</small>
          <div class="mini-qty"><button data-act="dec" data-id="${i.id}" aria-label="Decrease">−</button><span>${i.qty}</span><button data-act="inc" data-id="${i.id}" aria-label="Increase">+</button></div></div>
        <div><div class="line-total">${money(i.price * i.qty)}</div><button class="rm" data-act="rm" data-id="${i.id}">Remove</button></div>
      </div>`).join('')}</div>`;
    const sub = cart.reduce((a, i) => a + i.price * i.qty, 0), ship = sub >= 75 ? 0 : 6.99;
    foot.innerHTML = `
      <div class="sum"><span>Subtotal</span><span>${money(sub)}</span></div>
      <div class="sum"><span>Shipping</span><span>${ship ? money(ship) : 'Free'}</span></div>
      <div class="sum total"><span>Total</span><span>${money(sub + ship)}</span></div>
      <button class="btn btn-primary btn-block" id="checkout">Checkout ${ICON.arrow}</button>
      <p style="text-align:center;font-size:.76rem;color:var(--muted)">Demo store: no real payment is taken.</p>`;
    $('#checkout').addEventListener('click', openDemoCheckout);
  }

  /* ---------- demo checkout screen ---------- */
  function openDemoCheckout() {
    const cart = getCart(), n = cart.reduce((a, i) => a + i.qty, 0), sub = cart.reduce((a, i) => a + i.price * i.qty, 0);
    let el = document.getElementById('demoCo'); if (el) el.remove();
    el = document.createElement('div'); el.id = 'demoCo'; el.className = 'democo'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'dcT');
    el.innerHTML = `<div class="dc-card"><img src="img/octopus.png" alt=""><span class="dc-tag">Demo app</span><h2 id="dcT">This is a demo, so the store is not real</h2>
      <p>Aquanauts is a demo app built for the NASA Space Apps Challenge. The shop, the cart and this checkout are only here to show how it would work.</p>
      <ul><li>No payment is taken, and please do not enter any card details.</li><li>Nothing will be ordered or shipped.</li><li>The prices and products are examples.</li></ul>
      <div class="dc-sum"><span>${n} ${n === 1 ? 'item' : 'items'} in your demo cart</span><b>${money(sub)}</b></div>
      <div class="dc-btns"><button class="btn btn-primary" id="dcBack" type="button">Got it, keep browsing</button><button class="btn btn-ghost" id="dcClear" type="button">Empty my demo cart</button></div></div>`;
    document.body.appendChild(el);
    const close = () => { el.remove(); document.removeEventListener('keydown', esc); };
    const esc = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc);
    el.addEventListener('click', e => { if (e.target === el) close(); });
    $('#dcBack').onclick = () => { close(); closeCart(); }; $('#dcClear').onclick = () => { saveCart([]); close(); toast('Demo cart emptied'); };
    $('#dcBack').focus();
  }
  $('#drawerBody').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    let cart = getCart(); const it = cart.find(i => i.id === b.dataset.id); if (!it) return;
    if (b.dataset.act === 'inc') it.qty++;
    if (b.dataset.act === 'dec') it.qty = Math.max(1, it.qty - 1);
    if (b.dataset.act === 'rm') cart = cart.filter(i => i !== it);
    saveCart(cart);
  });
  window.addToCart = (qty, id) => {
    const d = (window.AQ_PRODUCTS || []).find(x => x.id === id);
    const prod = d && d.kind === 'plush' ? { id: 'plush-' + d.id, name: d.crew + ' Plush', variant: 'Plush ' + d.animal, price: d.price, img: d.img } : { ...PRODUCT, img: 'media/board-topdown.jpg' };
    const cart = getCart(); const it = cart.find(i => i.id === prod.id);
    if (it) it.qty += qty; else cart.push({ ...prod, qty });
    saveCart(cart); openCart();
  };
  renderCart();

  /* ==========================================================
     HOME — hero parallax, bubbles, carousel
     ========================================================== */
  // hero: octopus leans toward the cursor on top of its idle swim
  const art = $('.hero-art');
  if (art) {
    const lean = $('.octo-lean', art);
    addEventListener('mousemove', e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      lean.style.transform = `translate(${x * 12}px,${y * 8}px) rotate(${x * 2}deg)`;
    });
  }

  const track = $('#carouselTrack');
  if (track) {
    const prev = $('#prev'), next = $('#next'), bar = $('#progressBar'), cur = $('#curIdx');
    const cards = $$('.char-card', track);
    const step = () => cards[0].getBoundingClientRect().width + 28;
    const upd = () => {
      const max = track.scrollWidth - track.clientWidth, p = max > 0 ? track.scrollLeft / max : 0;
      bar.style.width = (Math.max(.08, p) * 100) + '%';
      prev.disabled = track.scrollLeft < 8; next.disabled = track.scrollLeft > max - 8;
      const idx = Math.min(cards.length, Math.round(track.scrollLeft / step()) + 1);
      if (cur) cur.textContent = String(idx).padStart(2, '0');
      const vw = innerWidth; let k = 0;
      cards.forEach(c => { if (c.classList.contains('in')) return; const r = c.getBoundingClientRect(); if (r.left < vw - 40 && r.right > 0 && r.top < innerHeight - 60) { c.style.setProperty('--d', (k++ * .12) + 's'); c.classList.add('in'); } });
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step() * (innerWidth > 1080 ? 2 : 1) }));
    next.addEventListener('click', () => track.scrollBy({ left: step() * (innerWidth > 1080 ? 2 : 1) }));
    track.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); addEventListener('scroll', upd, { passive: true }); upd();
    // drag to scroll (mouse only; always lets go, so the page never gets stuck)
    let down = false, sx = 0, sl = 0, moved = false;
    const endDrag = () => { if (!down) return; down = false; track.classList.remove('dragging'); if (moved) { const s = step(); track.scrollTo({ left: Math.round(track.scrollLeft / s) * s }); } };
    track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
    addEventListener('pointermove', e => {
      if (!down) return;
      if (e.buttons === 0) { endDrag(); return; }
      const dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('dragging'); }
      if (moved) track.scrollLeft = sl - dx;
    });
    ['pointerup', 'pointercancel', 'blur', 'dragend'].forEach(ev => addEventListener(ev, endDrag));
    document.addEventListener('mouseleave', endDrag);
    // horizontal wheel intent
  }

  /* ---------- menu: character changes with the link you point at ---------- */

  /* ---------- characters: hop and talk when clicked or hovered ---------- */
  const hop = p => { p.classList.remove('hop'); void p.offsetWidth; p.classList.add('hop'); };
  const talk = p => { p.classList.add('talk'); clearTimeout(p._t); p._t = setTimeout(() => p.classList.remove('talk'), 2300); };
  $$('.pal').forEach(p => {
    const b = document.createElement('span'); b.className = 'say'; b.textContent = p.dataset.say || ''; p.appendChild(b);
    const still = p.classList.contains('octo-lean');
    p.addEventListener('click', () => { if (!still) hop(p); talk(p); });
    if (!still) p.addEventListener('mouseenter', () => { if (!p.classList.contains('hop')) hop(p); });
    p.addEventListener('animationend', e => { if (e.animationName === 'hop') p.classList.remove('hop'); });
  });
  $$('.feat').forEach(f => f.addEventListener('mouseenter', () => { const p = $('.pal', f); if (p) hop(p); }));
  const crew = $$('.pals .pal');

  /* ==========================================================
     SHOP — qty, accordion, add-to-cart, board image fallback
     ========================================================== */
  const qtyOut = $('#qtyVal');
  if (qtyOut) {
    let q = 1;
    $('#qtyDec').addEventListener('click', () => { q = Math.max(1, q - 1); qtyOut.textContent = q; });
    $('#qtyInc').addEventListener('click', () => { q = Math.min(10, q + 1); qtyOut.textContent = q; });
    $('#addBtn').addEventListener('click', () => { addToCart(q, $('#addBtn').dataset.pid); toast('Added to cart'); });
  }
  $$('.acc-item').forEach(it => {
    const btn = $('button', it), body = $('.acc-body', it);
    btn.addEventListener('click', () => {
      const open = it.classList.toggle('open');
      body.style.maxHeight = open ? body.scrollHeight + 'px' : 0;
      btn.setAttribute('aria-expanded', open);
    });
  });
  /* gallery: click through photos and videos */
  const gal = $('#gallery');
  if (gal) {
    const gi = $('#gImg'), gv = $('#gVid'), ths = [...gal.querySelectorAll('.g-th')]; let cur = 0;
    const show = n => { cur = (n + ths.length) % ths.length; const t = ths[cur]; ths.forEach(x => x.classList.toggle('on', x === t));
      if (t.dataset.type === 'vid') { gi.hidden = true; gv.hidden = false; gv.poster = t.dataset.poster; gv.src = t.dataset.src; gv.setAttribute('aria-label', t.dataset.alt); gv.controls = false; const pr = gv.play(); if (pr && pr.catch) pr.catch(() => { gv.controls = true; }); }
      else { gv.pause(); gv.hidden = true; gi.hidden = false; gi.src = t.dataset.src; gi.alt = t.dataset.alt; } };
    ths.forEach((t, i) => t.addEventListener('click', () => show(i)));
    gal.querySelector('.prev').addEventListener('click', () => show(cur - 1));
    gal.querySelector('.next').addEventListener('click', () => show(cur + 1));
    gal.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  }

  /* ==========================================================
     AUTH  (BACKEND: replace the fake delay + localStorage with your API)
     ========================================================== */
  const tabs = $('#tabs');
  if (tabs) {
    const forms = { login: $('#loginForm'), signup: $('#signupForm') };
    const titles = {
      login: ['Welcome <span>back.</span>', 'Log in to your account.'],
      signup: ['Create your <span>account.</span>', 'It only takes a minute.']
    };
    const show = which => {
      tabs.dataset.active = which;
      $$('button', tabs).forEach(b => { const on = b.dataset.tab === which; b.classList.toggle('active', on); b.setAttribute('aria-selected', on); });
      Object.entries(forms).forEach(([k, f]) => f.classList.toggle('active', k === which));
      $('#authTitle').innerHTML = titles[which][0]; $('#authSub').textContent = titles[which][1];
      $('#forgot').classList.remove('show'); $('#welcome').classList.remove('show');
      $('#authHead').style.display = ''; tabs.style.display = '';
      history.replaceState(null, '', which === 'signup' ? '#signup' : '#login');
    };
    $$('button[data-tab],button[data-switch]', document).forEach(b => b.addEventListener('click', () => show(b.dataset.tab || b.dataset.switch)));
    if (user && !user.guest) location.replace('dashboard.html'); // already logged in
    show(location.hash === '#signup' ? 'signup' : 'login');

    // show/hide password
    $$('.toggle-pw').forEach(b => b.addEventListener('click', () => {
      const i = $('input', b.parentElement), on = i.type === 'password';
      i.type = on ? 'text' : 'password'; b.setAttribute('aria-label', on ? 'Hide password' : 'Show password'); b.style.color = on ? 'var(--orange)' : '';
    }));

    // validation helpers
    const setErr = (input, msg) => {
      const wrap = input.closest('.input'), err = wrap.nextElementSibling;
      wrap.classList.toggle('invalid', !!msg); wrap.classList.toggle('valid', !msg && !!input.value);
      if (err && err.classList.contains('err') && msg) err.textContent = msg;
      input.setAttribute('aria-invalid', !!msg);
    };
    const rules = {
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address.',
      pw: v => v.length >= 8 ? '' : 'Use at least 8 characters.',
      req: v => v.trim() ? '' : 'This field is required.'
    };
    $$('[data-rule]').forEach(i => {
      i.addEventListener('blur', () => setErr(i, rules[i.dataset.rule](i.value)));
      i.addEventListener('input', () => { if (i.closest('.input').classList.contains('invalid')) setErr(i, rules[i.dataset.rule](i.value)); });
    });

    // password strength
    const spw = $('#suPw'), meter = $('#meter'), mtxt = $('#meterTxt');
    spw.addEventListener('input', () => {
      const v = spw.value; let s = 0;
      if (v.length >= 8) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/\d/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v) && v.length >= 10) s++;
      if (!v) s = 0; meter.dataset.s = s;
      mtxt.textContent = ['Use 8+ characters with a mix of types', 'Weak', 'Fair', 'Good', 'Strong'][s];
    });

    const msg = (el, type, text) => { el.className = 'form-msg show ' + type; el.innerHTML = text; };
    const busy = (btn, on) => { btn.classList.toggle('loading', on); btn.disabled = on; };
    const users = () => JSON.parse(localStorage.getItem('aq_users') || '[]');
    const finish = (u, isNew) => {
      // a guest who signs up or logs in keeps what they earned
      try { const g = localStorage.getItem('aq_state_guest'); if (g && !localStorage.getItem('aq_state_' + u.email)) localStorage.setItem('aq_state_' + u.email, g); localStorage.removeItem('aq_state_guest'); } catch (e) {}
      localStorage.setItem('aq_user', JSON.stringify({ first: u.first, email: u.email }));
      forms.login.classList.remove('active'); forms.signup.classList.remove('active');
      $('#authHead').style.display = 'none'; tabs.style.display = 'none';
      $('#welcomeName').textContent = u.first; $('#welcomeCopy').textContent = isNew ? 'Your account is ready.' : "You're logged in.";
      $('#welcome').classList.add('show');
      setTimeout(() => { location.href = 'dashboard.html'; }, 1100); // students land on their dashboard
    };

    forms.login.addEventListener('submit', async e => {
      e.preventDefault();
      const em = $('#liEmail'), pw = $('#liPw'), out = $('#loginMsg'), btn = $('#loginBtn');
      const bad = [setErr(em, rules.email(em.value)), setErr(pw, rules.req(pw.value))];
      if (rules.email(em.value) || rules.req(pw.value)) return msg(out, 'error', 'Please fix the highlighted fields.');
      busy(btn, true); out.className = 'form-msg';
      let u;
      if (window.AQ && AQ.live) {
        try { u = await AQ.logIn(em.value.trim(), pw.value); } catch (err) { busy(btn, false); return msg(out, 'error', AQ.errorText(err)); }
      } else {
        await new Promise(r => setTimeout(r, 900));
        u = users().find(x => x.email === em.value.toLowerCase() && x.pw === btoa(pw.value));
      }
      busy(btn, false);
      if (!u) return msg(out, 'error', 'Email or password is incorrect.');
      finish(u, false);
    });

    forms.signup.addEventListener('submit', async e => {
      e.preventDefault();
      const f = $('#suFirst'), l = $('#suLast'), em = $('#suEmail'), pw = spw, role = $('#suRole'), terms = $('#suTerms'), out = $('#signupMsg'), btn = $('#signupBtn');
      const errs = [setErr(f, rules.req(f.value)), setErr(l, rules.req(l.value)), setErr(em, rules.email(em.value)), setErr(pw, rules.pw(pw.value)), setErr(role, role.value ? '' : 'Choose an option.')];
      const anyBad = [rules.req(f.value), rules.req(l.value), rules.email(em.value), rules.pw(pw.value), role.value ? '' : 'x'].some(Boolean);
      if (anyBad) return msg(out, 'error', 'Please fix the highlighted fields.');
      if (!terms.checked) return msg(out, 'error', 'Please accept the terms to continue.');
      const live = window.AQ && AQ.live;
      if (!live && users().some(x => x.email === em.value.toLowerCase())) return msg(out, 'error', 'An account with that email already exists. Try logging in.');
      busy(btn, true); out.className = 'form-msg';
      let u;
      if (live) {
        try { u = await AQ.signUp({ first: f.value.trim(), last: l.value.trim(), email: em.value.trim(), pw: pw.value, role: role.value }); } catch (err) { busy(btn, false); return msg(out, 'error', AQ.errorText(err)); }
      } else {
        await new Promise(r => setTimeout(r, 1100));
        u = { first: f.value.trim(), last: l.value.trim(), email: em.value.toLowerCase(), pw: btoa(pw.value), role: role.value };
        localStorage.setItem('aq_users', JSON.stringify([...users(), u]));
      }
      busy(btn, false); finish(u, true);
    });

    // forgot password
    $('#forgotLink').addEventListener('click', e => { e.preventDefault(); forms.login.classList.remove('active'); $('#forgot').classList.add('show'); $('#authTitle').innerHTML = 'Reset <span>password.</span>'; $('#authSub').textContent = "We'll email you a reset link."; tabs.style.display = 'none'; });
    $('#backLogin').addEventListener('click', () => { tabs.style.display = ''; show('login'); });
    $('#forgotForm').addEventListener('submit', async e => {
      e.preventDefault(); const em = $('#fgEmail'), out = $('#forgotMsg'), btn = $('#forgotBtn');
      const er = rules.email(em.value); setErr(em, er); if (er) return;
      busy(btn, true);
      if (window.AQ && AQ.live) { try { await AQ.reset(em.value.trim()); } catch (err) { if (err.code !== 'auth/user-not-found') { busy(btn, false); return msg(out, 'error', AQ.errorText(err)); } } }
      else await new Promise(r => setTimeout(r, 900));
      busy(btn, false);
      msg(out, 'success', 'If that email has an account, a reset link is on its way.');
    });

    // continue as guest (no account; progress stays on this device)
    $$('[data-guest]').forEach(b => b.addEventListener('click', () => {
      localStorage.setItem('aq_user', JSON.stringify({ first: 'Guest', email: 'guest', guest: true }));
      location.href = 'dashboard.html';
    }));

    // social placeholders
    $$('[data-social]').forEach(b => b.addEventListener('click', async () => {
      if (window.AQ && AQ.live && b.dataset.social === 'Google') {
        try { finish(await AQ.google(), false); } catch (err) { toast(AQ.errorText(err)); }
      } else toast(b.dataset.social + ' sign-in needs to be connected');
    }));
    $('#logout').addEventListener('click', async () => { if (window.AQ && AQ.live) await AQ.logOut(); localStorage.removeItem('aq_user'); location.href = 'login.html'; });
  }
})();
/* board hotspots: tap to show the tip on touch screens */
document.addEventListener('click', e => { const h = e.target.closest('.hot'); document.querySelectorAll('.hot.open').forEach(x => { if (x !== h) x.classList.remove('open'); }); if (h) h.classList.toggle('open'); });
