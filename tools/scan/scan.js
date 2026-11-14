/* RA10 — Scan your work (/tools/scan/). Free for every signed-in learner (AI usage limits apply).
   • Mark my answer: photo of a handwritten answer → editable text (ai-transcribe) → the AI Examiner marks it.
   • Make flashcards: photo of handwritten flashcards / notes → cards (ai-tools scan-cards) → saved to a deck.
   • My decks: revise saved cards with spaced repetition (Leitner boxes; public.user_flashcards). */
(function () {
  'use strict';
  const main = document.getElementById('at-main');
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const T = () => window.RA10Tools;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const S = { tab: new URLSearchParams(location.search).get('tab') || 'answer', cards: [], decks: null };
  const GAP_DAYS = [0, 1, 3, 7, 14];   // box 1 … 5
  function toast(m) { const t = document.createElement('div'); t.className = 'at-toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 3000); }
  function signedIn() { try { return RA10.isLoggedIn(); } catch (e) { return false; } }
  const sb = () => RA10.getClient();

  async function boot() {
    let n = 0; while (!window.RA10 && n++ < 60) await new Promise((r) => setTimeout(r, 100));
    try { await RA10.init(); } catch (e) {}
    render();
  }

  // phone photos are big: shrink to ≤1600px JPEG before sending
  function readPhoto(file) {
    return new Promise((resolve, reject) => {
      if (!file || !/^image\//.test(file.type)) return reject(new Error('Please choose a photo.'));
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, 1600 / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        let q = 0.85, data = c.toDataURL('image/jpeg', q);
        while (data.length > 2600000 && q > 0.4) { q -= 0.15; data = c.toDataURL('image/jpeg', q); }
        resolve(data);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That photo could not be opened.')); };
      img.src = url;
    });
  }
  const photoBtn = (id, label) => `<label class="at-btn pri" style="cursor:pointer">📷 ${label}<input type="file" accept="image/*" capture="environment" id="${id}" hidden></label><label class="at-btn" style="cursor:pointer">Upload a photo<input type="file" accept="image/*" id="${id}-up" hidden></label>`;
  function onPhoto(id, fn) { [id, id + '-up'].forEach((x) => { const el = $('#' + x); if (el) el.onchange = () => { const f = el.files && el.files[0]; el.value = ''; if (f) fn(f); }; }); }

  function render() {
    if (!signedIn()) { main.innerHTML = `<div class="at-empty">${T().mascot('wave', 96)}<h2>Sign in to scan your work</h2><p>It's free.</p><a class="at-btn pri" href="/auth">Sign in</a></div>`; return; }
    const tabs = [['answer', '✍️ Mark my answer'], ['cards', '🗂️ Make flashcards'], ['decks', '📚 My decks']];
    main.innerHTML = `<section class="at-hero">${T().mascot('wave', 92)}<div><h1>Scan your work <span class="rtl-pill free">Free</span></h1><p>Revise on paper, then let RA10 read it: get a handwritten answer marked, or turn your flashcards into a deck.</p></div></section>
      <div class="at-seg" role="tablist" style="margin-bottom:14px">${tabs.map(([k, t]) => `<button class="at-chip${S.tab === k ? ' on' : ''}" role="tab" aria-selected="${S.tab === k}" data-tab="${k}">${t}</button>`).join('')}</div><div id="pane"></div>`;
    $$('[data-tab]').forEach((b) => b.onclick = () => { S.tab = b.dataset.tab; render(); });
    if (S.tab === 'answer') answerPane(); else if (S.tab === 'cards') cardsPane(); else decksPane();
  }

  /* ── 1. mark a handwritten answer ── */
  function answerPane() {
    const pane = $('#pane');
    pane.innerHTML = `<div class="at-card"><h2>1. The question</h2><p class="at-mut at-small" style="margin:0 0 10px">Type the question exactly as it is on the paper.</p>
        <textarea id="q" data-voice="Say the question" rows="3" placeholder="e.g. Assess the impact on Tesco of a rise in interest rates."></textarea>
        <div class="at-row" style="margin-top:10px"><label class="at-label" for="marks" style="margin:0">Marks</label><input class="at-in" id="marks" type="number" min="1" max="40" value="9" style="width:90px"><input class="at-in" id="ctx" placeholder="Case study or scenario (optional)" style="flex:1;min-width:200px"></div></div>
      <div class="at-card"><h2>2. Your handwritten answer</h2><p class="at-mut at-small" style="margin:0 0 10px">Good light, flat page, whole answer in the photo.</p><div class="at-row">${photoBtn('ph', 'Take a photo')}</div><div id="read"></div></div>
      <div id="res"></div>`;
    onPhoto('ph', async (f) => {
      const box = $('#read');
      box.innerHTML = '<div class="at-loading"><span class="at-spin"></span><span class="at-mut">Reading your handwriting…</span></div>';
      try {
        const img = await readPhoto(f);
        const r = await RA10.transcribeWork({ image: img, question: $('#q').value });
        box.innerHTML = `<p class="at-mut at-small" style="margin:12px 0 6px">Check it matches what you wrote (${esc(r.confidence || 'medium')} confidence). Fix anything we misread — but don't improve it!</p><textarea id="ans" rows="10">${esc(r.text || '')}</textarea>${r.notes ? `<p class="at-mut at-small">${esc(r.notes)}</p>` : ''}<div class="at-row end" style="margin-top:10px"><button class="at-btn pri" id="mark">Mark it</button></div>`;
        $('#mark').onclick = markIt;
      } catch (e) { box.innerHTML = `<p>${esc(e.message)}</p>`; }
    });
  }
  async function markIt() {
    const q = $('#q').value.trim(), a = ($('#ans') || {}).value || '';
    if (q.length < 8) return toast('Type the question first.');
    if (a.trim().length < 10) return toast('There is no answer to mark yet.');
    const b = $('#mark'); b.disabled = true; b.textContent = 'Marking…';
    const res = $('#res');
    try {
      const marks = Math.max(1, Math.min(40, Number($('#marks').value) || 9));
      const question = { id: 'scan-' + Date.now(), question: q, marks, scenario: $('#ctx').value.trim() || undefined };
      const r = await RA10.examineAnswer({ question, answer: a });
      const x = r.result || {};
      try { if (window.RA10Track) RA10Track.log('ai_examine', { ref: question.id, title: q, answer: a, score: x.earned, max_score: x.max, meta: { source: 'scan' } }); } catch (e) {}
      const ok = x.max ? x.earned / x.max : 0;
      res.innerHTML = `<div class="at-card"><div class="at-score">${T().mascot(ok >= .7 ? 'cheer' : ok >= .4 ? 'idle' : 'think', 84)}<div><div class="big">${x.earned}/${x.max}</div><div class="at-mut">${x.level ? 'Level ' + esc(x.level) : 'AI Examiner mark'}</div></div></div>
        ${x.feedback ? `<p>${esc(x.feedback)}</p>` : ''}
        <ul class="at-list">${(x.strengths || []).map((s) => `<li class="ok"><span class="dot">✓</span><span>${esc(s)}</span></li>`).join('')}${(x.improvements || []).map((s) => `<li class="part"><span class="dot">↑</span><span>${esc(s)}</span></li>`).join('')}</ul></div>`;
      res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) { toast(e.message); }
    b.disabled = false; b.textContent = 'Mark it again';
  }

  /* ── 2. flashcards from a photo ── */
  function cardsPane() {
    const pane = $('#pane');
    pane.innerHTML = `<div class="at-card"><h2>Photograph your flashcards</h2><p class="at-mut at-small" style="margin:0 0 10px">Lay several cards out, or snap a page of notes with terms and definitions. We only copy what's written.</p><div class="at-row">${photoBtn('cp', 'Take a photo')}</div></div><div id="cl"></div>`;
    onPhoto('cp', async (f) => {
      const box = $('#cl');
      box.innerHTML = `<div class="at-card"><div class="at-loading">${T().mascot('think', 72)}<span class="at-mut">Reading your cards…</span></div></div>`;
      try {
        const img = await readPhoto(f);
        const r = await T().api('scan-cards', { image: img });
        S.cards = S.cards.concat(r.cards);
        if (!r.cards.length) toast('No cards found in that photo — try a clearer one.');
        cardList(r.notes);
      } catch (e) { box.innerHTML = e.handled ? '' : `<div class="at-card"><p>${esc(e.message)}</p></div>`; }
    });
    if (S.cards.length) cardList();
  }
  function cardList(notes) {
    const box = $('#cl');
    if (!S.cards.length) { box.innerHTML = ''; return; }
    box.innerHTML = `<div class="at-card"><div class="at-row" style="justify-content:space-between"><h2 style="margin:0">${S.cards.length} card${S.cards.length === 1 ? '' : 's'}</h2><span class="at-mut at-small">Edit anything we misread</span></div>${notes ? `<p class="at-mut at-small">${esc(notes)}</p>` : ''}
      <div style="display:grid;gap:10px;margin-top:10px">${S.cards.map((c, i) => `<div class="at-row" style="align-items:flex-start"><input class="at-in" data-f="${i}" value="${esc(c.front)}" aria-label="Front of card ${i + 1}" style="flex:1;min-width:140px"><textarea data-b="${i}" rows="2" aria-label="Back of card ${i + 1}" style="flex:2;min-width:200px">${esc(c.back)}</textarea><button class="at-btn" data-del="${i}" aria-label="Remove card ${i + 1}">✕</button></div>`).join('')}</div>
      <div class="at-row" style="margin-top:14px"><input class="at-in" id="deck" maxlength="60" placeholder="Deck name, e.g. Business Unit 3 — finance" style="flex:1;min-width:200px"><button class="at-btn pri" id="saveDeck">Save deck</button></div></div>`;
    $$('[data-f]', box).forEach((el) => el.oninput = () => { S.cards[el.dataset.f].front = el.value; });
    $$('[data-b]', box).forEach((el) => el.oninput = () => { S.cards[el.dataset.b].back = el.value; });
    $$('[data-del]', box).forEach((b) => b.onclick = () => { S.cards.splice(Number(b.dataset.del), 1); cardList(); });
    $('#saveDeck').onclick = async function () {
      const deck = $('#deck').value.trim() || 'My cards';
      const rows = S.cards.filter((c) => c.front.trim() && c.back.trim()).map((c) => ({ deck, front: c.front.trim(), back: c.back.trim() }));
      if (!rows.length) return toast('No complete cards to save.');
      this.disabled = true;
      const { error } = await sb().from('user_flashcards').insert(rows);
      if (error) { this.disabled = false; return toast(/does not exist|schema cache/i.test(error.message) ? 'Saving decks is being switched on. Please try again soon.' : error.message); }
      S.cards = []; S.decks = null; toast('Saved ' + rows.length + ' cards to “' + deck + '”'); S.tab = 'decks'; render();
    };
  }

  /* ── 3. decks + spaced repetition ── */
  async function decksPane() {
    const pane = $('#pane');
    pane.innerHTML = '<div class="at-loading"><span class="at-spin"></span></div>';
    const { data, error } = await sb().from('user_flashcards').select('id, deck, front, back, box, due_at').order('created_at');
    if (error) { pane.innerHTML = `<div class="at-empty">${esc(/does not exist|schema cache/i.test(error.message) ? 'Decks are being switched on. Please try again soon.' : error.message)}</div>`; return; }
    const decks = {}; (data || []).forEach((c) => { (decks[c.deck] = decks[c.deck] || []).push(c); });
    const names = Object.keys(decks);
    if (!names.length) { pane.innerHTML = `<div class="at-empty">${T().mascot('idle', 80)}<p>No decks yet. Photograph some flashcards to make your first one.</p><button class="at-btn pri" data-go="cards">Make flashcards</button></div>`; $('[data-go]').onclick = () => { S.tab = 'cards'; render(); }; return; }
    const now = Date.now();
    pane.innerHTML = `<div class="at-tiles">${names.map((n) => { const due = decks[n].filter((c) => Date.parse(c.due_at) <= now).length; return `<div class="at-tile" style="cursor:default"><span class="ic" aria-hidden="true">🗂️</span><b>${esc(n)}</b><small>${decks[n].length} cards · ${due ? `<b style="color:var(--at-acc)">${due} due today</b>` : 'all caught up'}</small><div class="at-row" style="margin-top:6px"><button class="at-btn pri" data-study="${esc(n)}">${due ? 'Revise' : 'Practise all'}</button><button class="at-btn" data-rm="${esc(n)}" aria-label="Delete deck ${esc(n)}">Delete</button></div></div>`; }).join('')}</div>`;
    $$('[data-study]', pane).forEach((b) => b.onclick = () => study(decks[b.dataset.study], b.dataset.study));
    $$('[data-rm]', pane).forEach((b) => b.onclick = async () => { if (!confirm('Delete the deck “' + b.dataset.rm + '”?')) return; await sb().from('user_flashcards').delete().eq('deck', b.dataset.rm); decksPane(); });
  }
  function study(cards, name) {
    const now = Date.now();
    let queue = cards.filter((c) => Date.parse(c.due_at) <= now);
    if (!queue.length) queue = cards.slice();
    queue = queue.sort(() => Math.random() - .5);
    let i = 0, flipped = false, right = 0;
    const pane = $('#pane');
    function show() {
      if (i >= queue.length) {
        pane.innerHTML = `<div class="at-card" style="text-align:center">${T().mascot('cheer', 88)}<h2>Deck done!</h2><p class="at-mut">${right} of ${queue.length} you knew. Cards you found hard come back sooner.</p><button class="at-btn pri" id="bk">Back to decks</button></div>`;
        $('#bk').onclick = decksPane;
        try { if (window.RA10Track) RA10Track.log('flashcard', { ref: 'deck:' + name, title: name, score: right, max_score: queue.length }); } catch (e) {}
        return;
      }
      const c = queue[i];
      pane.innerHTML = `<div class="at-card" style="text-align:center"><p class="at-mut at-small" style="margin:0 0 8px">${esc(name)} · ${i + 1} of ${queue.length}</p>
        <button class="at-tile" id="card" style="width:100%;min-height:200px;align-items:center;justify-content:center;text-align:center;font-size:1.2rem" aria-live="polite"><b style="font-size:1.25rem">${esc(flipped ? c.back : c.front)}</b><small>${flipped ? 'Answer' : 'Tap to flip'}</small></button>
        <div class="at-row" style="justify-content:center;margin-top:14px">${flipped ? '<button class="at-btn" data-r="1">Again</button><button class="at-btn" data-r="2">Hard</button><button class="at-btn pri" data-r="3">Got it</button>' : '<button class="at-btn pri" id="flip">Show answer</button>'}</div></div>`;
      $('#card').onclick = () => { flipped = !flipped; show(); };
      const fl = $('#flip'); if (fl) fl.onclick = () => { flipped = true; show(); };
      $$('[data-r]', pane).forEach((b) => b.onclick = async () => {
        const r = Number(b.dataset.r);
        const box = r === 1 ? 1 : r === 2 ? Math.max(1, c.box) : Math.min(5, c.box + 1);
        if (r === 3) right++;
        const due = new Date(Date.now() + GAP_DAYS[box - 1] * 864e5).toISOString();
        sb().from('user_flashcards').update({ box, due_at: due }).eq('id', c.id).then(() => {}, () => {});
        c.box = box; c.due_at = due;
        i++; flipped = false; show();
      });
    }
    show();
  }

  boot();
})();
