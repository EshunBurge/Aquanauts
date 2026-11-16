/* Shop pages: listing (shop.html) and product detail (product.html). Reads window.AQ_PRODUCTS. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const P = window.AQ_PRODUCTS || [];
  const money = n => '$' + n.toFixed(2).replace(/\.00$/, '');
  const price = n => { const [d, c] = n.toFixed(2).split('.'); return `<small>$</small>${d}${c === '00' ? '' : '.' + c}`; };
  const card = (p, cls = '') => `<article class="p-card ${cls}" data-id="${p.id}">
    <a class="p-link" href="product.html?p=${p.id}" aria-label="${p.name}">
      <div class="p-img"><span class="p-badge">${p.badge}</span><img src="${p.img}" alt="${p.name}" loading="lazy" width="640" height="640">${p.kind==='plush'?'<span class="si-tag">Image made with SI</span>':''}</div>
      <div class="p-body"><h3>${p.name}</h3><p class="p-sub">${p.short}</p></div>
    </a>
    <div class="p-row"><span class="p-price">${price(p.price)}</span><button class="btn p-add" type="button" data-add="${p.id}">Add to cart</button></div>
  </article>`;
  const bindAdd = root => $$('[data-add]', root).forEach(b => b.addEventListener('click', () => { window.addToCart(1, b.dataset.add); window.toast && window.toast('Added to cart'); }));

  /* ---------- listing ---------- */
  const grid = $('#pGrid');
  if (grid) {
    let filter = 'all', sort = 'featured';
    const tabs = $$('.s-tab'), sel = $('#sSort'), count = $('#sCount');
    const render = () => {
      let list = P.filter(p => filter === 'all' || p.kind === filter);
      if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
      if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
      if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      const feature = filter === 'all' && sort === 'featured';
      grid.innerHTML = list.map(p => card(p, feature && p.kind === 'board' ? 'p-feature' : '')).join('');
      grid.classList.toggle('has-feature', feature);
      count.textContent = list.length + (list.length === 1 ? ' product' : ' products');
      bindAdd(grid);
    };
    tabs.forEach(t => t.addEventListener('click', () => { filter = t.dataset.f; tabs.forEach(x => { const on = x === t; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); }); render(); }));
    sel.addEventListener('change', () => { sort = sel.value; render(); });
    $$('.s-tab').forEach(t => { const n = t.dataset.f === 'all' ? P.length : P.filter(p => p.kind === t.dataset.f).length; t.querySelector('b').textContent = n; });
    render();
  }

  /* ---------- product page ---------- */
  const left = $('#pLeft');
  if (left) {
    const id = new URLSearchParams(location.search).get('p') || 'board';
    const p = P.find(x => x.id === id) || P[0];
    document.title = p.name + ' — Aquanauts Shop';
    $('#crumbName').textContent = p.name;
    if (p.kind === 'board') {
      left.innerHTML = `<div class="gallery" id="gallery">
        <div class="g-main"><img id="gImg" src="media/board-topdown.webp" alt="Top-down: hands turning the dials" width="480" height="600"><video id="gVid" muted loop playsinline preload="metadata" hidden></video>
          <button type="button" class="g-nav prev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><button type="button" class="g-nav next" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div>
        <div class="g-thumbs">
          <button type="button" class="g-th on" data-type="img" data-src="media/board-topdown.webp" data-poster="media/board-topdown.jpg" data-alt="Top-down: hands turning the dials" aria-label="Top-down: hands turning the dials"><img src="media/board-topdown.jpg" alt="" loading="lazy"></button>
          <button type="button" class="g-th" data-type="img" data-src="img/board.jpg" data-poster="img/board.jpg" data-alt="Board with hands on the dials" aria-label="Board with hands on the dials"><img src="img/board.jpg" alt="" loading="lazy"></button>
          <button type="button" class="g-th" data-type="img" data-src="img/board-2.jpg" data-poster="img/board-2.jpg" data-alt="Board with the octopus lit up" aria-label="Board with the octopus lit up"><img src="img/board-2.jpg" alt="" loading="lazy"></button>
          <button type="button" class="g-th" data-type="vid" data-src="media/board-turn.mp4" data-poster="media/board-turn.jpg" data-alt="Video: the board on a stand" aria-label="Video: the board on a stand"><img src="media/board-turn.jpg" alt="" loading="lazy"><i class="pl"></i></button>
        </div></div>`;
    } else {
      left.innerHTML = `<div class="g-main plush-main"><img src="${p.img}" alt="${p.name} plush" width="640" height="640"><span class="si-tag">Image made with SI</span></div>`;
    }
    const title = p.kind === 'board' ? 'Aquanauts<br><span>Game Board</span>' : `${p.crew}<br><span>the ${p.animal.replace(/\b\w/g, c => c.toUpperCase())}</span>`;
    $('#pBuy').innerHTML = `<span class="eyebrow rise" style="animation-delay:.1s">${p.badge}</span>
      <h1 class="rise" style="animation-delay:.18s">${title}</h1>
      <p class="price rise" style="animation-delay:.26s">${price(p.price)}</p>
      <p class="desc rise" style="animation-delay:.34s">${p.desc}</p>
      <div class="buy rise" style="animation-delay:.42s">
        <div class="qty"><button id="qtyDec" aria-label="Decrease quantity">&minus;</button><output id="qtyVal">1</output><button id="qtyInc" aria-label="Increase quantity">+</button></div>
        <button class="btn" id="addBtn" data-pid="${p.id}">Add to cart</button>
      </div>
      <p class="fine rise" style="animation-delay:.56s"><button class="linkish" type="button" data-open-cart>View cart (<span id="cartCount">0</span>)</button></p>`;
    const info = p.kind === 'board'
      ? [['On the board', '<ul><li>Life support, greenhouse and radiation dials</li><li>Sun and storm lights, and an octopus with glowing eyes</li></ul>'], ['Details', '<dl><div><dt>Ages</dt><dd>7 to 12</dd></div><div><dt>Made for</dt><dd>The Aquanauts game</dd></div></dl>']]
      : [['The crew member', `<ul><li>${p.blurb}</li><li>Job: ${p.role}</li></ul>`], ['Details', `<dl><div><dt>Room</dt><dd>${p.room}</dd></div><div><dt>Collect</dt><dd>All 8 crew members</dd></div></dl>`]];
    $('#pInfo').innerHTML = info.map(([h, b], i) => `<div class="info"><h3>${h}</h3>${b}</div>`).join('');
    const rel = P.filter(x => x.id !== p.id).sort((a, b) => (a.kind === p.kind ? -1 : 0) - (b.kind === p.kind ? -1 : 0)).slice(0, 4);
    $('#related').innerHTML = rel.map(x => card(x)).join('');
    bindAdd($('#related'));
  }
})();

(function(){var f=document.getElementById('collectFaces');if(!f||!window.AQ_PRODUCTS)return;
f.innerHTML=window.AQ_PRODUCTS.filter(function(p){return p.kind==='plush'}).map(function(p){return '<a href="product.html?p='+p.id+'" tabindex="-1"><img src="'+p.img+'" alt="" loading="lazy" width="120" height="120"></a>'}).join('')})();
