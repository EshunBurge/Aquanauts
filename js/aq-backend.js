/* ==========================================================
   AQUANAUTS — account + progress backend (Firebase)
   Auth: email + password and Google. Data: Firestore doc students/{uid}.
   The page scripts read from a localStorage cache; this file keeps that
   cache and Firestore in step. With no Firebase config it does nothing
   and the site runs in demo mode.
   ========================================================== */
(function () {
  const cfg = window.AQ_FIREBASE || {};
  const live = !!(cfg.apiKey && !/^YOUR_/.test(cfg.apiKey) && cfg.projectId && !/^YOUR_/.test(cfg.projectId));
  const AQ = window.AQ = { live, mode: live ? 'firebase' : 'demo' };
  if (!live) { AQ.whenReady = fn => fn(); return; }

  const V = '10.12.2', BASE = 'https://www.gstatic.com/firebasejs/' + V + '/';
  const load = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('Could not load ' + src)); document.head.appendChild(s); });
  const ls = { get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set: (k, v) => localStorage.setItem(k, JSON.stringify(v)), del: k => localStorage.removeItem(k) };

  let auth, db, uid = null, email = null;
  const ready = (async () => {
    await load(BASE + 'firebase-app-compat.js');
    await Promise.all([load(BASE + 'firebase-auth-compat.js'), load(BASE + 'firebase-firestore-compat.js')]);
    firebase.initializeApp(cfg);
    auth = firebase.auth(); db = firebase.firestore();
    const u = await new Promise(res => { const off = auth.onAuthStateChanged(x => { off(); res(x); }); });
    if (u) { uid = u.uid; email = (u.email || '').toLowerCase(); await pull(u); } else if (!((ls.get('aq_user') || {}).guest)) { ls.del('aq_user'); }
    return u;
  })();
  ready.catch(e => console.error('[Aquanauts] Firebase failed to start:', e));

  const within = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(Object.assign(new Error('Database timed out'), { code: 'unavailable' })), ms))]);
  const docRef = () => db.collection('students').doc(uid);

  function cacheProfile(p) {
    ls.set('aq_user', { first: p.first, email: p.email });
    const all = (ls.get('aq_users') || []).filter(x => x.email !== p.email);
    all.push({ first: p.first, last: p.last || '', email: p.email, role: p.role || '' });
    ls.set('aq_users', all);
  }

  // load profile + progress from Firestore into the local cache
  async function pull(u) {
    const parts = (u.displayName || '').split(' ');
    let d = null, dbOk = true;
    try { const snap = await within(db.collection('students').doc(u.uid).get(), 4000); d = snap.exists ? snap.data() : null; }
    catch (e) { dbOk = false; AQ.dbProblem = e; console.warn('[Aquanauts] Firestore is not ready, using this device only for now:', e && e.code, e && e.message); }
    const p = { first: (d && d.first) || parts[0] || 'Astronaut', last: (d && d.last) || parts.slice(1).join(' '), email: (u.email || '').toLowerCase(), role: (d && d.role) || '' };
    cacheProfile(p);
    const key = 'aq_state_' + p.email;
    if (!ls.get(key) && ls.get('aq_state_guest')) { ls.set(key, ls.get('aq_state_guest')); ls.del('aq_state_guest'); }
    if (d && d.state) ls.set(key, d.state);                 // cloud copy wins
    else if (dbOk && ls.get(key)) AQ.push(ls.get(key), true); // first login: upload what is on this device
    if (dbOk && !d) { try { await within(db.collection('students').doc(u.uid).set({ ...p, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }), 4000); } catch (e) { console.warn('[Aquanauts] could not create profile', e); } }
    return p;
  }

  // save progress (debounced)
  let timer = null, pending = null;
  const flush = () => { if (!pending || !uid) return Promise.resolve(); const s = pending; pending = null; clearTimeout(timer); return docRef().set({ state: s, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }).catch(e => { console.error('[Aquanauts] save failed', e); pending = pending || s; }); };
  AQ.push = (state, now) => { pending = JSON.parse(JSON.stringify(state)); clearTimeout(timer); if (now) return flush(); timer = setTimeout(flush, 800); };
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  addEventListener('pagehide', flush);

  AQ.whenReady = fn => ready.then(u => {
    if (!u && !((ls.get('aq_user') || {}).guest) && /dashboard\.html$/.test(location.pathname)) { location.replace('login.html'); return; }
    fn();
  }, () => fn());

  AQ.signUp = async ({ first, last, email: em, pw, role }) => {
    await ready;
    const cred = await auth.createUserWithEmailAndPassword(em, pw);
    await cred.user.updateProfile({ displayName: (first + ' ' + last).trim() });
    uid = cred.user.uid; email = em.toLowerCase();
    const p = { first, last, email, role };
    try { await within(docRef().set({ ...p, createdAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }), 4000); } catch (e) { AQ.dbProblem = e; console.warn('[Aquanauts] Firestore is not ready, account created without a cloud profile:', e && e.code); }
    cacheProfile(p); return p;
  };
  AQ.logIn = async (em, pw) => { await ready; const cred = await auth.signInWithEmailAndPassword(em, pw); uid = cred.user.uid; return pull(cred.user); };
  AQ.google = async () => { await ready; const cred = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); uid = cred.user.uid; return pull(cred.user); };
  AQ.reset = async em => { await ready; return auth.sendPasswordResetEmail(em); };
  AQ.logOut = async () => { try { await flush(); await ready; await auth.signOut(); } catch (e) {} ls.del('aq_user'); };

  AQ.errorText = err => {
    const code = (err && err.code) || '';
    console.error('[Aquanauts] sign-in problem:', code, err && err.message);
    const known = {
      'auth/email-already-in-use': 'An account with that email already exists. Try logging in.',
      'auth/invalid-credential': 'Email or password is incorrect.',
      'auth/wrong-password': 'Email or password is incorrect.',
      'auth/user-not-found': 'Email or password is incorrect.',
      'auth/invalid-email': 'Enter a valid email address.',
      'auth/weak-password': 'Use at least 8 characters.',
      'auth/too-many-requests': 'Too many tries. Wait a minute and try again.',
      'auth/network-request-failed': 'No connection. Check the internet and try again.',
      'auth/popup-closed-by-user': 'Sign-in was closed before it finished.',
      'auth/operation-not-allowed': 'Email sign-in is not turned on in Firebase yet (Authentication > Sign-in method).',
      'auth/configuration-not-found': 'Firebase Authentication is not set up yet. In the Firebase console open Authentication and click Get started.',
      'auth/unauthorized-domain': 'This website address is not approved yet. Add it under Authentication > Settings > Authorized domains.',
      'auth/api-key-not-valid': 'The Firebase key in js/firebase-config.js is not valid.',
      'auth/invalid-api-key': 'The Firebase key in js/firebase-config.js is not valid.',
      'permission-denied': 'Signed in, but the database is not ready. Create Firestore and publish the rules from firestore.rules.',
      'failed-precondition': 'Signed in, but the database is not ready. Create Firestore in the Firebase console.',
      'unavailable': 'Could not reach the database. Check the internet and try again.'
    };
    return known[code] || ('Something went wrong' + (code ? ' (' + code + ')' : '') + '. Please try again.');
  };
})();
