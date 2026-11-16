/* Home page: try the vocab words and a quiz */
(function () {
  const S = window.AQ_STUDY, pick = document.getElementById('lpick'); if (!S || !pick) return;
  const CREW = [[1, 'Bloop', 'pufferfish', 'Life support'], [2, 'Moss', 'axolotl', 'Energy'], [3, 'Nori', 'nautilus', 'Food and farming'], [4, 'Luma', 'angler', 'Space hazards'], [5, 'Pip', 'crab', 'Engineering'], [6, 'Skim', 'ray', 'Sustainability'], [7, 'Pebble', 'tardigrade', 'Mission planning'], [8, 'Tank', 'octopus', 'Final mission']];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let cur = 1;
  pick.innerHTML = CREW.map(([id, n, img, role]) => `<button type="button" role="tab" data-id="${id}" aria-selected="${id === cur}"><img src="img/${img}.png" alt=""><span><b>${n}</b><small>${role}</small></span></button>`).join('');
  function words() {
    const w = S[cur].words, c = CREW[cur - 1];
    document.getElementById('lwSub').textContent = `${w.length} words from ${c[1]}'s level (${c[3].toLowerCase()}).`;
    document.getElementById('lwords').innerHTML = w.map(([a, b]) => `<div class="lw"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
  }
  function quiz() {
    const box = document.getElementById('lquiz'), qs = shuffle(S[cur].quiz).slice(0, 3).map(([q, ok, bad]) => ({ q, ok, o: shuffle([ok, ...bad]) }));
    let i = 0, score = 0;
    const ask = () => {
      const k = qs[i];
      box.innerHTML = `<div class="lq-top"><span>Question ${i + 1} of ${qs.length}</span><i><u style="width:${i / qs.length * 100}%"></u></i></div><p class="lq-q">${esc(k.q)}</p>
        <div class="lq-opts">${k.o.map((o, n) => `<button type="button" data-n="${n}">${esc(o)}</button>`).join('')}</div><p class="lq-fb" aria-live="polite">&nbsp;</p><button class="btn sm" type="button" id="lqNext" disabled>${i === qs.length - 1 ? 'See my score' : 'Next question'}</button>`;
      let done = false;
      box.querySelectorAll('.lq-opts button').forEach(b => b.onclick = () => {
        if (done) return; done = true; const right = k.o[+b.dataset.n] === k.ok; if (right) score++;
        box.querySelectorAll('.lq-opts button').forEach(x => { x.disabled = true; if (k.o[+x.dataset.n] === k.ok) x.classList.add('right'); }); if (!right) b.classList.add('wrong');
        box.querySelector('.lq-fb').textContent = right ? 'Correct!' : 'Not quite. The answer is ' + k.ok + '.';
        const nx = document.getElementById('lqNext'); nx.disabled = false; nx.onclick = () => { i++; i < qs.length ? ask() : end(); };
      });
    };
    const end = () => {
      box.innerHTML = `<div class="lq-end"><b>${score} of ${qs.length}</b><p>${score === qs.length ? 'Perfect score!' : score >= 2 ? 'Nice work!' : 'Good try. Read the words and have another go.'}</p>
        <p class="lq-note">In the game, passing a quiz wins 10 coins.</p><div class="lq-btns"><button class="btn sm" type="button" id="lqAgain">Try again</button><a class="btn sm btn-ghost" href="login.html#signup">Create an account</a></div></div>`;
      document.getElementById('lqAgain').onclick = quiz;
    };
    ask();
  }
  pick.addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (!b) return; cur = +b.dataset.id; pick.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', x === b)); words(); quiz(); });
  words(); quiz();
})();
