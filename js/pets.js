/* Aquanauts crew pets: little 3D buddies built from simple shapes, flat toon colours + ink outlines.
   Needs THREE (r147 build/three.min.js). Every pet faces +z and sits on y = 0. */
(function () {
  const INK = 0x05070a;
  const gm = (() => { const d = new Uint8Array([105, 175, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
  const mats = {};
  const mat = c => mats[c] || (mats[c] = new THREE.MeshToonMaterial({ color: c, gradientMap: gm }));
  const inkMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
  const G = new THREE.Group();

  function M(geo, c, o) {
    o = o || {};
    const m = new THREE.Mesh(geo, mat(c));
    if (o.out !== false) { const h = new THREE.Mesh(geo, inkMat); h.name = 'outline'; h.scale.setScalar(o.k || 1.07); m.add(h); }
    if (o.s) m.scale.set(o.s[0], o.s[1], o.s[2]);
    if (o.p) m.position.set(o.p[0], o.p[1], o.p[2]);
    if (o.r) m.rotation.set(o.r[0], o.r[1], o.r[2]);
    return m;
  }
  const sph = (r, c, o) => M(new THREE.SphereGeometry(r, 28, 20), c, o);
  const cyl = (r1, r2, h, c, o) => M(new THREE.CylinderGeometry(r1, r2, h, 14), c, Object.assign({ k: 1.25 }, o));
  const cone = (r, h, c, o) => M(new THREE.ConeGeometry(r, h, 14), c, Object.assign({ k: 1.2 }, o));
  const add = (g, ...ms) => { ms.forEach(m => g.add(m)); return g; };

  function eye(x, y, z, r, lookZ) {
    const g = new THREE.Group(); g.position.set(x, y, z);
    g.add(sph(r, 0xffffff, { k: 1.1 }));
    const p = sph(r * 0.6, INK, { out: false, p: [0, -r * 0.02, r * 0.55] }); g.add(p);
    g.add(sph(r * 0.2, 0xffffff, { out: false, p: [r * 0.18, r * 0.2, r * 0.9] }));
    return g;
  }
  function chain(pts, r0, r1, c) {
    const g = new THREE.Group(); const n = pts.length;
    pts.forEach((p, i) => { const r = r0 + (r1 - r0) * (i / (n - 1)); g.add(sph(r, c, { p, k: 1.1 })); });
    return g;
  }
  function smile(x, y, z, w) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(w, w * 0.18, 8, 16, Math.PI), new THREE.MeshBasicMaterial({ color: INK }));
    m.position.set(x, y, z); m.rotation.z = Math.PI; return m;
  }

  /* ---------- crab: Pinch ---------- */
  function crab() {
    const R = 0xc9625f, RD = 0x9d4a4d, CR = 0xf0e6e4, g = new THREE.Group();
    add(g, sph(.8, R, { s: [1.3, .9, 1.05], p: [0, .78, 0] }), sph(.55, CR, { s: [1.2, .4, .9], p: [0, .5, .2], out: false }));
    [[-.4, .12], [.05, -.2], [.5, .08]].forEach(a => g.add(sph(.13, CR, { out: false, p: [a[0], 1.4, a[1] - .1], s: [1, .5, 1] })));
    [-1, 1].forEach(s => {
      add(g, cyl(.07, .07, .42, RD, { p: [s * .34, 1.38, .5] }), eye(s * .34, 1.74, .5, .23));
      /* arm + big claw held up */
      add(g, cyl(.09, .11, .6, RD, { p: [s * 1.1, .85, .42], r: [0, 0, -s * .9] }), sph(.24, RD, { p: [s * 1.38, 1.05, .6] }),
        sph(.42, R, { s: [.95, .85, .8], p: [s * 1.55, 1.38, .72] }),
        sph(.2, R, { s: [.62, 1.45, .7], p: [s * 1.38, 1.86, .78], r: [0, 0, s * .28] }), sph(.19, RD, { s: [.6, 1.4, .7], p: [s * 1.74, 1.82, .8], r: [0, 0, -s * .28] }));
      [-.42, 0, .4].forEach((z, i) => {
        add(g, cyl(.075, .05, .7, RD, { p: [s * (1.0 + i * .02), .4, z - .1], r: [0, 0, -s * 1.0] }), sph(.1, 0x44435f, { out: false, p: [s * 1.3, .08, z - .1], s: [1.2, .6, 1.2] }));
      });
      g.add(sph(.14, 0xf0a0a0, { out: false, p: [s * .58, .68, .96], s: [1, .6, .4] }));
    });
    g.add(smile(0, .6, 1.02, .17));
    return g;
  }

  /* ---------- axolotl: Wiggles ---------- */
  function axolotl() {
    const T = 0x86b9bb, TD = 0x6a9a9c, BE = 0xd4e8ea, FR = 0xa58fc9, PK = 0xee9db8, g = new THREE.Group();
    add(g, sph(.78, T, { s: [1, .85, 1.25], p: [0, .66, -.12] }), sph(.7, T, { s: [1.25, 1, 1.02], p: [0, 1.0, .62] }),
      sph(.52, BE, { s: [.9, .45, 1.05], p: [0, .42, .05], out: false }));
    /* tail with a soft fin */
    [[0, .55, -1.0, .45], [0, .5, -1.5, .34], [0, .46, -1.9, .24]].forEach(a => g.add(sph(a[3], TD, { s: [.55, 1.0, 1], p: [a[0], a[1], a[2]] })));
    g.add(sph(.34, FR, { s: [.12, 1.2, 2.2], p: [0, .78, -1.45], out: false }));
    [-1, 1].forEach(s => {
      /* three feathery gills fanning out from one base on each side */
      const bx = s * .82, by = 1.12, bz = .5;
      g.add(sph(.2, FR, { p: [bx, by, bz], k: 1.1 }));
      [.55, 1.05, 1.55].forEach(an => {
        const dx = s * Math.sin(an), dy = Math.cos(an);
        add(g, cyl(.075, .05, .6, FR, { p: [bx + dx * .34, by + dy * .34, bz], r: [0, 0, -s * an] }),
          sph(.15, PK, { p: [bx + dx * .68, by + dy * .68, bz], k: 1.12 }));
      });
      add(g, eye(s * .46, 1.2, 1.26, .18));
      g.add(sph(.11, PK, { out: false, p: [s * .68, .86, 1.32], s: [1, .6, .4] }));
      [.55, -.65].forEach(z => add(g, sph(.22, TD, { p: [s * .7, .2, z], s: [1, .75, 1.2] }), sph(.08, BE, { out: false, p: [s * .72, .08, z + .2] })));
    });
    g.add(smile(0, .84, 1.36, .17));
    return g;
  }

  /* ---------- manta ray: Glide ---------- */
  function ray() {
    const B = 0x6b7aa3, BD = 0x4f5a7d, LT = 0xcdf1f5, g = new THREE.Group();
    add(g, sph(.9, B, { s: [1.05, .85, 1.1], p: [0, 1.0, .2] }), sph(.62, LT, { s: [1.1, .4, 1.05], p: [0, .72, .32], out: false }));
    [-1, 1].forEach(s => {
      /* thick wings that sweep up and back, ending in a soft tip */
      add(g, sph(1, B, { s: [1.25, .3, .95], p: [s * 1.25, 1.02, -.15], r: [0, s * .18, s * .3], k: 1.08 }),
        sph(.5, B, { s: [.8, .22, .55], p: [s * 2.25, 1.38, -.55], r: [0, s * .5, s * .5], k: 1.1 }),
        sph(.3, BD, { s: [1.3, .18, .8], p: [s * 1.1, .86, -.35], out: false }));
      add(g, eye(s * .36, 1.42, .98, .24), sph(.13, 0xf0a0b0, { out: false, p: [s * .62, 1.08, 1.12], s: [1, .6, .4] }));
      g.add(sph(.09, LT, { out: false, p: [s * 1.3, 1.34, -.1], s: [1, .3, 1] }), sph(.09, LT, { out: false, p: [s * 1.9, 1.5, -.35], s: [1, .3, 1] }));
      g.add(cone(.12, .42, LT, { p: [s * .42, .9, 1.22], r: [Math.PI / 2 + .2, 0, 0] }));
    });
    add(g, cyl(.09, .03, 1.7, BD, { p: [0, .95, -1.45], r: [Math.PI / 2 - .12, 0, 0] }), smile(0, .88, 1.28, .15));
    return g;
  }

  /* ---------- octopus: Inky ---------- */
  function octopus() {
    const O = 0xd5654d, OD = 0xb44f3b, CR = 0xeab5a6, g = new THREE.Group();
    add(g, sph(.88, O, { s: [1, 1.1, 1], p: [0, 1.25, 0] }));
    [[-.35, 1.98, .1], [.2, 2.05, -.2], [.45, 1.9, .3], [-.1, 1.8, -.5]].forEach(p => g.add(sph(.13, CR, { out: false, p, s: [1, .55, 1] })));
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4 + .2, pts = [];
      for (let i = 0; i < 6; i++) {
        const t = i / 5, r = .45 + t * 1.0;
        pts.push([Math.cos(a) * r, .55 - t * .42 + Math.sin(t * Math.PI) * .22 + t * t * .3, Math.sin(a) * r]);
      }
      g.add(chain(pts, .3, .09, k % 2 ? O : OD));
    }
    [-1, 1].forEach(s => { g.add(eye(s * .33, 1.2, .76, .22)); g.add(sph(.1, 0xe99a9a, { out: false, p: [s * .6, 1.0, .72], s: [1, .6, .4] })); });
    g.add(smile(0, .98, .85, .15));
    return g;
  }

  /* ---------- anglerfish: Glow ---------- */
  function angler() {
    const P = 0x5f5694, PD = 0x4a4378, FN = 0xb8cefb, CR = 0xf1e6df, g = new THREE.Group();
    add(g, sph(.9, P, { s: [1, .95, 1.1], p: [0, 1, 0] }), sph(.55, 0x7d72b8, { s: [.8, .5, .9], p: [0, .5, .5], out: false }));
    // mouth
    add(g, sph(.5, INK, { s: [1.05, .42, .6], p: [0, .78, .8], out: false }));
    for (let i = -2; i <= 2; i++) g.add(cone(.055, .17, CR, { out: false, p: [i * .17, .93, 1.0 - Math.abs(i) * .04], r: [Math.PI, 0, 0] }));
    // lure
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.85, .1), new THREE.Vector3(0, 2.35, .35), new THREE.Vector3(0, 2.4, .95), new THREE.Vector3(0, 2.1, 1.25)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 16, .045, 8), mat(PD)));
    g.add(sph(.2, 0x99dce1, { p: [0, 2.05, 1.28], k: 1.12 }));
    [-1, 1].forEach(s => {
      g.add(eye(s * .4, 1.3, .68, .22));
      add(g, sph(.3, FN, { s: [.2, .7, 1], p: [s * .95, .9, .1], r: [0, 0, s * .3] }));
    });
    add(g, cone(.35, .9, FN, { s: [.35, 1, 1], p: [0, 1.0, -1.15], r: [-Math.PI / 2 - .3, 0, 0] }), sph(.28, FN, { s: [.2, .8, .8], p: [0, 1.85, -.5] }));
    return g;
  }

  /* ---------- nautilus: Spiral ---------- */
  function nautilus() {
    const CR = 0xe9dccf, ST = 0x82728d, OR = 0xe39a70, OD = 0xc87a55, g = new THREE.Group();
    add(g, sph(1, CR, { s: [.55, 1, 1.05], p: [0, 1.15, -.25] }));
    [-1, 1].forEach(sd => {
      const pts = []; for (let i = 0; i <= 60; i++) { const t = i / 60, th = t * Math.PI * 4.4 + .5, r = .06 + t * .78; pts.push(new THREE.Vector3(sd * .56, 1.15 + Math.sin(th) * r, -.25 + Math.cos(th) * r * 1.03)); }
      const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 140, .045, 8), mat(ST)); g.add(tube);
      // stripes on rim
    });
    // ridge on top of shell
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1, .05, 8, 40), mat(ST)); rim.scale.set(1, 1.05, .55); rim.rotation.y = Math.PI / 2; rim.position.set(0, 1.15, -.25); g.add(rim);
    // body
    add(g, sph(.52, OR, { s: [.95, .9, 1], p: [0, .55, .8] }), sph(.38, OD, { s: [1.05, .55, .8], p: [0, .98, .75] }));
    [-1, 1].forEach(s => {
      g.add(eye(s * .3, .62, 1.18, .14));
      for (let i = 0; i < 3; i++) g.add(cyl(.06, .035, .4, 0xf2d3bc, { p: [s * (.15 + i * .13), .22, 1.08], r: [.5, 0, 0] }));
    });
    g.add(cyl(.06, .035, .4, 0xf2d3bc, { p: [0, .22, 1.1], r: [.5, 0, 0] }));
    g.add(smile(0, .38, 1.28, .11));
    return g;
  }

  /* ---------- tardigrade: Bumble ---------- */
  function tardigrade() {
    const P = 0x7c6085, P2 = 0x8c6f96, PD = 0x4b4361, PK = 0xb38297, CR = 0xdacdd8, g = new THREE.Group();
    [[.95, .5, .5, P2], [.4, .6, .6, P], [-.2, .62, .65, P2], [-.8, .55, .58, P], [-1.25, .4, .5, P2]].forEach(a => g.add(sph(a[2], a[3], { s: [1, .92, 1], p: [0, .85, a[0]] })));
    g.add(sph(.45, CR, { s: [.8, .35, 1.9], p: [0, .5, -.1], out: false }));
    [.75, .25, -.35, -.95].forEach((z, i) => [-1, 1].forEach(s => {
      add(g, cyl(.17, .14, .55, PD, { p: [s * .5, .32, z] }), sph(.17, PD, { p: [s * .5, .08, z], s: [1, .6, 1.1], out: false }));
      for (let c = -1; c <= 1; c++) g.add(cone(.03, .12, CR, { out: false, p: [s * .5 + c * .07, .03, z + .17], r: [Math.PI / 2, 0, 0] }));
    }));
    [-1, 1].forEach(s => { g.add(eye(s * .24, 1.1, 1.3, .14)); g.add(sph(.08, 0xe99a9a, { out: false, p: [s * .42, .86, 1.33], s: [1, .6, .4] })); });
    g.add(sph(.12, PK, { p: [0, .95, 1.47] }), smile(0, .76, 1.4, .12));
    return g;
  }

  /* ---------- pufferfish: Puff ---------- */
  function puffer() {
    const Y = 0xcdd098, CR = 0xeceac0, SP = 0xc99e6a, FN = 0xc5daaf, g = new THREE.Group();
    add(g, sph(1, Y, { p: [0, 1.05, 0] }));
    g.add(new THREE.Mesh(new THREE.SphereGeometry(1.012, 28, 14, 0, Math.PI * 2, Math.PI * .58, Math.PI * .42), mat(CR)));
    g.children[g.children.length - 1].position.set(0, 1.05, 0);
    const n = 46;
    for (let i = 0; i < n; i++) {
      const y = 1 - (i + .5) * 2 / n, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      const d = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r);
      if (d.z > .55 && Math.abs(d.x) < .55 && d.y < .5 && d.y > -.5) continue;
      const c = cone(.075, .22, SP, { out: false });
      c.position.copy(d.clone().multiplyScalar(1.05)).add(new THREE.Vector3(0, 1.05, 0));
      c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
      g.add(c);
    }
    [-1, 1].forEach(s => {
      g.add(eye(s * .4, 1.3, .86, .24));
      add(g, sph(.3, FN, { s: [.2, .75, 1], p: [s * 1.02, .95, .1], r: [0, 0, s * .2] }));
    });
    add(g, sph(.15, 0xe29a8a, { p: [0, .92, 1.02], s: [1.2, .8, .8] }), sph(.38, FN, { s: [.25, 1, 1], p: [0, 1.05, -1.1], r: [-.3, 0, 0] }));
    return g;
  }

  const LIST = [
    { id: 'pinch', name: 'Pinch', species: 'Crab', price: 40, rarity: 'Common', desc: 'Scuttles sideways and waves its claws at everyone.', make: crab },
    { id: 'wiggles', name: 'Wiggles', species: 'Axolotl', price: 60, rarity: 'Common', desc: 'Always smiling and always curious about new gadgets.', make: axolotl },
    { id: 'bumble', name: 'Bumble', species: 'Water bear', price: 60, rarity: 'Common', desc: 'Tiny, tough and happy to follow you anywhere.', make: tardigrade },
    { id: 'inky', name: 'Inky', species: 'Octopus', price: 90, rarity: 'Uncommon', desc: 'Loves to juggle tools with all eight arms.', make: octopus },
    { id: 'puff', name: 'Puff', species: 'Pufferfish', price: 90, rarity: 'Uncommon', desc: 'Puffs up with pride whenever you solve something.', make: puffer },
    { id: 'spiral', name: 'Spiral', species: 'Nautilus', price: 120, rarity: 'Rare', desc: 'Carries its home on its back and never gets lost.', make: nautilus },
    { id: 'glide', name: 'Glide', species: 'Manta ray', price: 150, rarity: 'Rare', desc: 'Floats along beside you like it has no weight at all.', make: ray },
    { id: 'glow', name: 'Glow', species: 'Anglerfish', price: 200, rarity: 'Legendary', desc: 'Lights up the dark with its lantern for the whole crew.', make: angler }
  ];

  function fit(g, size) {
    const b = new THREE.Box3().setFromObject(g), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
    const k = (size || 2) / Math.max(s.x, s.y, s.z);
    const w = new THREE.Group(); g.position.set(-c.x, -b.min.y, -c.z); const inner = new THREE.Group(); inner.add(g); inner.scale.setScalar(k); w.add(inner); return w;
  }
  function build(id) {
    const p = LIST.find(x => x.id === id); const w = fit(p.make(), 2); w.name = p.name; w.userData = { id: p.id, name: p.name }; return w;
  }

  /* simple viewer: own renderer, drag to turn, gentle bob */
  function viewer(canvas, opts) {
    opts = opts || {};
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: !!opts.keep });
    r.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); r.setClearColor(0x000000, 0);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, .1, 50);
    cam.position.set(0, 1.9, 3.9); cam.lookAt(0, .78, 0);
    scene.add(new THREE.AmbientLight(0xffffff, .62));
    const dl = new THREE.DirectionalLight(0xffffff, .5); dl.position.set(3, 5, 4); scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0x99dce1, .2); dl2.position.set(-4, 2, -3); scene.add(dl2);
    const pivot = new THREE.Group(); scene.add(pivot);
    let cur = null, rot = opts.angle != null ? opts.angle : .6, drag = false, lx = 0, t0 = performance.now(), raf = 0, auto = opts.auto !== false, alive = true;
    function size() { const w = canvas.clientWidth || 300, h = canvas.clientHeight || 300; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    function set(id) { if (cur) pivot.remove(cur); cur = build(id); cur.traverse(o => { if (o.isMesh && !o.userData._) o.userData._ = 1; }); pivot.add(cur); }
    function frame(now) {
      if (!alive) return;
      const t = (now - t0) / 1000;
      if (auto && !drag) rot += .006;
      pivot.rotation.y = rot; if (cur && !opts.still) cur.position.y = Math.sin(t * 2) * .035;
      r.render(scene, cam); raf = requestAnimationFrame(frame);
    }
    canvas.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', e => { if (drag) { rot += (e.clientX - lx) * .012; lx = e.clientX; } });
    ['pointerup', 'pointercancel'].forEach(ev => canvas.addEventListener(ev, () => { drag = false; }));
    addEventListener('resize', size); size();
    if (opts.id) set(opts.id);
    if (!opts.manual) raf = requestAnimationFrame(frame);
    return { set, size, render() { pivot.rotation.y = rot; r.render(scene, cam); }, scene, pivot, dispose() { alive = false; cancelAnimationFrame(raf); r.dispose(); }, setAngle(a) { rot = a; }, get renderer() { return r; } };
  }

  function exportable(id) {
    const w = build(id); const std = {};
    const rm = [];
    w.traverse(o => { if (o.name === 'outline') rm.push(o); });
    rm.forEach(o => o.parent.remove(o));
    w.traverse(o => {
      if (o.isMesh) {
        const c = o.material.color ? o.material.color.getHex() : 0xffffff;
        o.material = std[c] || (std[c] = new THREE.MeshStandardMaterial({ color: c, roughness: .85, metalness: 0 }));
      }
    });
    return w;
  }

  window.AQPets = { list: LIST, build, viewer, exportable };
})();
