/* RA10 Study Hub — Flashcards (free for every signed-in learner).
   Make decks by typing cards (or pasting a list), add a picture to either side (search Wikimedia Commons or paste
   an https link — nothing is uploaded), and revise with spaced repetition (Leitner boxes 1–5, same as the scanner).
   Cards live in public.user_flashcards (own rows only, RLS) so they sync to the learner's account on every device;
   decks made from photos in /tools/scan/ appear here too.
     SHCards.section(el)   — the Study Hub home card (decks, cards due today)
     SHCards.open(view)    — the full-screen manager: 'decks' (default) | 'new' | { deck } | { study } */
(function () {
  'use strict';
  if (window.SHCards) return;
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sb = () => RA10.getClient();
  const signedIn = () => { try { return RA10.isLoggedIn(); } catch (e) { return false; } };
  const GAP_DAYS = [0, 1, 3, 7, 14];
  const COLS = 'id, deck, front, back, front_image, back_image, box, due_at, created_at';
  const httpsOk = (u) => /^https:\/\/[^\s<>"'`]+$/.test(String(u || '')) && String(u).length <= 600;
  let ov = null, cache = null;

  function css() {
    if (document.getElementById('shf-css')) return;
    const st = document.createElement('style'); st.id = 'shf-css';
    st.textContent = `
.shf{--g1:#1f6feb;--g2:#7c3aed;--g3:#db2777;--g4:#22d3ee;position:fixed!important;inset:0;z-index:2147483000;background:var(--bg,#f6f5fb);color:var(--ink,#15131f);overflow:auto;font-family:var(--font,system-ui)}
.shf::before{content:"";position:fixed;inset:-20% -10% auto -10%;height:60vh;pointer-events:none;background:radial-gradient(40% 50% at 15% 30%,color-mix(in srgb,var(--g4) 18%,transparent),transparent 70%),radial-gradient(40% 50% at 75% 15%,color-mix(in srgb,var(--g2) 20%,transparent),transparent 70%);filter:blur(10px)}
.shf-in{position:relative;max-width:860px;margin:0 auto;padding:18px 16px 80px}
.shf-top{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.shf-top h2{margin:0;font-size:1rem;flex:1;display:flex;align-items:center;gap:8px}
.shf-x,.shf-back{min-width:40px;height:40px;border-radius:999px;border:1px solid var(--line,#e4e2ee);background:color-mix(in srgb,var(--card,#fff) 70%,transparent);color:var(--ink-2,#565269);font:700 .9rem inherit;cursor:pointer;padding:0 12px}
.shf-h1{margin:4px 0 4px;font-size:clamp(1.5rem,1.1rem+1.8vw,2.1rem);letter-spacing:-.02em}
.shf-sub{margin:0 0 16px;color:var(--ink-2,#565269)}
.shf-card{position:relative;background:color-mix(in srgb,var(--card,#fff) 85%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--line,#e4e2ee);border-radius:22px;padding:16px}
.shf-card+.shf-card{margin-top:12px}
.shf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.shf-deck{display:flex;flex-direction:column;gap:6px;padding:16px;border-radius:20px;border:1px solid var(--line,#e4e2ee);background:var(--card,#fff);text-align:left;color:inherit;font:inherit;position:relative;overflow:hidden}
.shf-deck::before{content:"";position:absolute;inset:0 0 auto 0;height:4px;background:linear-gradient(90deg,var(--g4),var(--g2),var(--g3))}
.shf-deck b{font-size:1.02rem}.shf-deck small{color:var(--ink-3,#8d89a1)}
.shf-deck .due{color:var(--g2);font-weight:800}
.shf-new{display:grid;place-items:center;gap:6px;min-height:130px;border:2px dashed color-mix(in srgb,var(--g2) 45%,var(--line,#e4e2ee));border-radius:20px;background:transparent;color:var(--g2);font:800 .95rem inherit;cursor:pointer}
.shf-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:9px 18px;border-radius:999px;border:1.5px solid var(--line,#e4e2ee);background:var(--card,#fff);color:inherit;font:800 .9rem inherit;cursor:pointer;text-decoration:none}
.shf-btn.sm{min-height:36px;padding:6px 13px;font-size:.82rem}
.shf-btn.pri{border:0;color:#fff;background:linear-gradient(135deg,var(--g1),var(--g2) 60%,var(--g3));box-shadow:0 10px 22px -10px var(--g2)}
.shf-btn.ghost{border-color:transparent;background:transparent}
.shf-btn[disabled]{opacity:.5;cursor:default}
.shf-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.shf-in input[type=text],.shf-in input[type=url],.shf-in input[type=search],.shf-in textarea{width:100%;padding:11px 13px;border-radius:14px;border:1.5px solid var(--line,#e4e2ee);background:var(--card,#fff);color:inherit;font:500 .95rem/1.45 inherit}
.shf-in textarea{resize:vertical;min-height:70px}
.shf-in input:focus,.shf-in textarea:focus{outline:none;border-color:var(--g2);box-shadow:0 0 0 4px color-mix(in srgb,var(--g2) 14%,transparent)}
.shf-lab{display:block;font-weight:800;font-size:.8rem;margin:0 0 6px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-3,#8d89a1)}
.shf-compose{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media (max-width:640px){.shf-compose{grid-template-columns:1fr}}
.shf-side{display:grid;gap:8px}
.shf-pic{display:flex;align-items:center;gap:8px}
.shf-pic img{width:56px;height:56px;object-fit:cover;border-radius:10px;border:1px solid var(--line,#e4e2ee)}
.shf-list{display:grid;gap:8px;margin-top:12px}
.shf-item{display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:start;padding:10px 12px;border-radius:14px;border:1px solid var(--line,#e4e2ee);background:var(--card,#fff)}
@media (max-width:640px){.shf-item{grid-template-columns:1fr auto}.shf-item .bk{grid-column:1}}
.shf-item .tx{font-size:.92rem;line-height:1.4;overflow-wrap:anywhere}
.shf-item img{display:block;max-width:90px;max-height:64px;border-radius:8px;margin-top:6px;object-fit:cover}
.shf-item .acts{display:flex;gap:4px}
.shf-ic{width:34px;height:34px;border-radius:50%;border:1px solid var(--line,#e4e2ee);background:transparent;color:inherit;cursor:pointer}
.shf-study{display:flex;flex-direction:column;align-items:center;gap:16px}
.shf-prog{width:100%;max-width:560px;height:6px;border-radius:99px;background:color-mix(in srgb,currentColor 10%,transparent);overflow:hidden}
.shf-prog i{display:block;height:100%;background:linear-gradient(90deg,var(--g4),var(--g2),var(--g3));transition:width .3s}
.shf-flip{width:100%;max-width:560px;height:340px;perspective:1400px;cursor:pointer;border:0;background:none;padding:0;color:inherit;font:inherit}
.shf-flip .inn{display:block;position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .55s cubic-bezier(.4,0,.2,1)}
.shf-flip.on .inn{transform:rotateY(180deg)}
.shf-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;overflow:auto}
.shf-face.f{background:var(--card,#fff);border:1px solid var(--line,#e4e2ee);box-shadow:0 22px 50px -30px rgba(40,20,120,.5)}
.shf-face.b{transform:rotateY(180deg);color:#fff;background:radial-gradient(120% 90% at 20% 0%,rgba(255,255,255,.25),transparent 50%),linear-gradient(135deg,var(--g1),var(--g2) 65%,var(--g3))}
.shf-face .t{font-size:1.3rem;font-weight:700;line-height:1.4;white-space:pre-wrap}
.shf-face.b .t{font-size:1.08rem;font-weight:600}
.shf-face img{max-width:100%;max-height:150px;border-radius:14px;object-fit:contain;background:#fff}
.shf-face small{opacity:.6;font-size:.78rem}
.shf-rate{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.shf-rate .shf-btn{min-width:108px}
.shf-modal{position:fixed!important;inset:0;z-index:2147483100;background:rgba(10,8,25,.55);display:grid;place-items:center;padding:16px}
.shf-modal .box{width:min(640px,100%);max-height:88vh;overflow:auto;background:var(--card,#fff);color:var(--ink,#15131f);border-radius:22px;padding:18px}
.shf-tabs{display:flex;gap:6px;margin:0 0 12px}
.shf-tabs button{min-height:36px;padding:6px 14px;border-radius:999px;border:1px solid var(--line,#e4e2ee);background:transparent;color:inherit;font:700 .85rem inherit;cursor:pointer}
.shf-tabs button[aria-pressed="true"]{background:linear-gradient(135deg,var(--g1),var(--g2));border-color:transparent;color:#fff}
.shf-res{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:12px}
.shf-res button{padding:0;border:2px solid transparent;border-radius:12px;overflow:hidden;background:#fff;cursor:pointer;aspect-ratio:1}
.shf-res button:hover,.shf-res button:focus-visible{border-color:var(--g2);outline:none}
.shf-res img{width:100%;height:100%;object-fit:cover;display:block}
.shf-note{font-size:.78rem;color:var(--ink-3,#8d89a1);margin:8px 0 0}
.shf-empty{text-align:center;padding:28px 10px}
.shf-spin{width:26px;height:26px;border-radius:50%;border:3px solid var(--line,#e4e2ee);border-top-color:var(--g2);animation:shfS .9s linear infinite;margin:20px auto}
@keyframes shfS{to{transform:rotate(360deg)}}
.shf-sec h2{display:flex;align-items:center;gap:8px}
.shf-sec .stat{display:flex;gap:10px;margin:8px 0 10px}
.shf-sec .stat span{flex:1;padding:10px;border-radius:14px;background:color-mix(in srgb,var(--g2) 8%,transparent);text-align:center;font-size:.78rem;color:var(--ink-2,#565269)}
.shf-sec .stat b{display:block;font-size:1.3rem;color:var(--ink,#15131f)}
@media (prefers-reduced-motion:reduce){.shf-flip .inn{transition:none}}`;
    document.head.appendChild(st);
  }

  async function load(force) {
    if (cache && !force) return cache;
    const { data, error } = await sb().from('user_flashcards').select(COLS).order('created_at');
    if (error) throw new Error(/does not exist|schema cache|column/i.test(error.message) ? 'Flashcards are being switched on. Please try again soon.' : error.message);
    cache = data || [];
    return cache;
  }
  const decksOf = (cards) => { const d = {}; cards.forEach((c) => { (d[c.deck] = d[c.deck] || []).push(c); }); return d; };
  const dueCount = (cards) => { const now = Date.now(); return cards.filter((c) => Date.parse(c.due_at) <= now).length; };

  /* ── home card ── */
  async function section(el) {
    css();
    if (!el) return;
    el.classList.add('shf-sec');
    const head = '<h2><span aria-hidden="true">🗂️</span> Flashcards <span class="rtl-pill free">Free</span></h2>';
    if (!signedIn()) { el.innerHTML = head + '<p class="sh-muted">Sign in to make flashcard decks that sync to your account.</p>'; return; }
    el.innerHTML = head + '<div class="shf-spin"></div>';
    try {
      const cards = await load(true), decks = decksOf(cards), names = Object.keys(decks), due = dueCount(cards);
      el.innerHTML = head + `<div class="stat"><span><b>${names.length}</b>deck${names.length === 1 ? '' : 's'}</span><span><b>${cards.length}</b>cards</span><span><b>${due}</b>due today</span></div>
        <div class="shf-row"><button class="shf-btn sm pri" data-f="study"${due ? '' : ' disabled'}>${due ? 'Revise ' + due + ' due' : 'All caught up'}</button><button class="shf-btn sm" data-f="new">+ New deck</button><button class="shf-btn sm ghost" data-f="decks">My decks</button></div>`;
      $('[data-f="study"]', el).onclick = () => open({ studyAll: true });
      $('[data-f="new"]', el).onclick = () => open('new');
      $('[data-f="decks"]', el).onclick = () => open('decks');
    } catch (e) { el.innerHTML = head + `<p class="sh-muted">${esc(e.message)}</p>`; }
  }

  /* ── overlay ── */
  function open(view) {
    css();
    close();
    ov = document.createElement('div'); ov.className = 'shf'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Flashcards');
    ov.innerHTML = '<div class="shf-in"><div class="shf-top"><h2>🗂️ Flashcards</h2><button class="shf-x" type="button" aria-label="Close">✕</button></div><div id="shf-body"></div></div>';
    document.documentElement.appendChild(ov);
    document.body.style.overflow = 'hidden';
    $('.shf-x', ov).onclick = close;
    ov.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('.shf-modal')) close(); });
    if (!signedIn()) { body().innerHTML = `<div class="shf-empty"><h1 class="shf-h1">Sign in to make flashcards</h1><p class="shf-sub">Your decks save to your account, so they're on every device.</p><button class="shf-btn pri" id="shf-in">Sign in</button></div>`; $('#shf-in', ov).onclick = () => { location.href = '/auth'; }; return; }
    if (view === 'new') return newDeck();
    if (view && view.deck) return deckView(view.deck);
    if (view && view.studyAll) return load(true).then((c) => study(c, 'All decks', true)).catch(err);
    decksView();
  }
  function close() { if (ov) { ov.remove(); ov = null; document.body.style.overflow = ''; const s = document.getElementById('sh-cards'); if (s) section(s); } }
  const body = () => $('#shf-body', ov);
  const err = (e) => { body().innerHTML = `<div class="shf-empty"><p>${esc(e.message || e)}</p><button class="shf-btn" id="shf-r">Back</button></div>`; $('#shf-r', ov).onclick = decksView; };

  async function decksView() {
    body().innerHTML = '<div class="shf-spin"></div>';
    try {
      const cards = await load(true), decks = decksOf(cards), names = Object.keys(decks);
      body().innerHTML = `<h1 class="shf-h1">Your decks</h1><p class="shf-sub">Type your own cards, add pictures, and revise with spaced repetition. Free, and synced to your account.</p>
        <div class="shf-grid"><button class="shf-new" id="shf-new"><span style="font-size:1.8rem">＋</span>New deck</button>${names.map((n) => { const d = dueCount(decks[n]); return `<div class="shf-deck"><b>${esc(n)}</b><small>${decks[n].length} card${decks[n].length === 1 ? '' : 's'} · ${d ? `<span class="due">${d} due today</span>` : 'all caught up'}</small><div class="shf-row" style="margin-top:6px"><button class="shf-btn sm pri" data-study="${esc(n)}">${d ? 'Revise' : 'Practise'}</button><button class="shf-btn sm" data-edit="${esc(n)}">Edit</button></div></div>`; }).join('')}</div>`;
      $('#shf-new', ov).onclick = newDeck;
      $$('[data-study]', ov).forEach((b) => b.onclick = () => study(decks[b.dataset.study], b.dataset.study));
      $$('[data-edit]', ov).forEach((b) => b.onclick = () => deckView(b.dataset.edit));
    } catch (e) { err(e); }
  }

  function newDeck() {
    body().innerHTML = `<button class="shf-back" id="shf-bk">← Decks</button><h1 class="shf-h1" style="margin-top:12px">New deck</h1>
      <div class="shf-card"><label class="shf-lab" for="shf-name">Deck name</label><input type="text" id="shf-name" maxlength="60" placeholder="e.g. Cyber security key terms">
      <div class="shf-row" style="margin-top:12px"><button class="shf-btn pri" id="shf-mk">Create and add cards</button></div></div>`;
    $('#shf-bk', ov).onclick = decksView;
    const inp = $('#shf-name', ov); inp.focus();
    const go = () => { const n = inp.value.trim().slice(0, 60); if (!n) { inp.focus(); return; } deckView(n, true); };
    $('#shf-mk', ov).onclick = go;
    inp.onkeydown = (e) => { if (e.key === 'Enter') go(); };
  }

  async function deckView(name, fresh) {
    body().innerHTML = '<div class="shf-spin"></div>';
    let cards = [];
    try { cards = (await load(!fresh)).filter((c) => c.deck === name); } catch (e) { return err(e); }
    const pics = { front: '', back: '' };
    body().innerHTML = `<div class="shf-row" style="justify-content:space-between"><button class="shf-back" id="shf-bk">← Decks</button><div class="shf-row"><button class="shf-btn sm" id="shf-ren">Rename</button><button class="shf-btn sm" id="shf-del">Delete deck</button></div></div>
      <h1 class="shf-h1" style="margin-top:12px">${esc(name)}</h1><p class="shf-sub" id="shf-count"></p>
      <div class="shf-card"><div class="shf-compose">
        <div class="shf-side"><label class="shf-lab" for="shf-f">Front</label><textarea id="shf-f" maxlength="300" placeholder="Question, term or prompt"></textarea><div class="shf-pic" data-pic="front"></div></div>
        <div class="shf-side"><label class="shf-lab" for="shf-b">Back</label><textarea id="shf-b" maxlength="600" placeholder="Answer or definition"></textarea><div class="shf-pic" data-pic="back"></div></div></div>
        <div class="shf-row" style="margin-top:12px;justify-content:space-between"><span class="shf-note">Tip: press Ctrl + Enter to add the card and start the next one.</span><div class="shf-row"><button class="shf-btn sm" id="shf-paste">Paste a list</button><button class="shf-btn pri" id="shf-add">Add card</button></div></div></div>
      <div class="shf-row" style="margin-top:14px"><button class="shf-btn pri" id="shf-go">Study this deck</button></div>
      <div class="shf-list" id="shf-list"></div>`;
    const f = $('#shf-f', ov), b = $('#shf-b', ov);
    const paintPic = (side) => {
      const box = $(`[data-pic="${side}"]`, ov);
      box.innerHTML = pics[side] ? `<img src="${esc(pics[side])}" alt="" referrerpolicy="no-referrer"><button class="shf-btn sm" data-rm>Remove picture</button>` : '<button class="shf-btn sm" data-add>🖼 Add a picture</button>';
      const a = $('[data-add]', box); if (a) a.onclick = () => picker((u) => { pics[side] = u; paintPic(side); });
      const r = $('[data-rm]', box); if (r) r.onclick = () => { pics[side] = ''; paintPic(side); };
    };
    paintPic('front'); paintPic('back');
    const paintList = () => {
      $('#shf-count', ov).textContent = cards.length ? `${cards.length} card${cards.length === 1 ? '' : 's'}` : 'No cards yet — add your first one below.';
      $('#shf-go', ov).disabled = !cards.length;
      $('#shf-list', ov).innerHTML = cards.slice().reverse().map((c) => `<div class="shf-item" data-id="${esc(c.id)}"><div class="tx"><b>${esc(c.front)}</b>${c.front_image ? `<img src="${esc(c.front_image)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}</div><div class="tx bk">${esc(c.back)}${c.back_image ? `<img src="${esc(c.back_image)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}</div><div class="acts"><button class="shf-ic" data-ed title="Edit" aria-label="Edit card">✎</button><button class="shf-ic" data-rmc title="Delete" aria-label="Delete card">🗑</button></div></div>`).join('');
      $$('[data-rmc]', ov).forEach((btn) => btn.onclick = async () => {
        const id = btn.closest('[data-id]').dataset.id;
        const { error } = await sb().from('user_flashcards').delete().eq('id', id);
        if (error) return alert(error.message);
        cards = cards.filter((c) => c.id !== id); cache = null; paintList();
      });
      $$('[data-ed]', ov).forEach((btn) => btn.onclick = () => editCard(cards.find((c) => c.id === btn.closest('[data-id]').dataset.id), () => { cache = null; paintList(); }));
    };
    paintList();
    const add = async () => {
      const front = f.value.trim(), back = b.value.trim();
      if (!front) { f.focus(); return; }
      if (!back) { b.focus(); return; }
      const btn = $('#shf-add', ov); btn.disabled = true;
      const { data, error } = await sb().from('user_flashcards').insert({ deck: name, front, back, front_image: pics.front || null, back_image: pics.back || null }).select(COLS).single();
      btn.disabled = false;
      if (error) return alert(error.message);
      cards.push(data); cache = null;
      f.value = ''; b.value = ''; pics.front = ''; pics.back = ''; paintPic('front'); paintPic('back'); paintList(); f.focus();
    };
    $('#shf-add', ov).onclick = add;
    [f, b].forEach((t) => t.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); add(); } }));
    $('#shf-paste', ov).onclick = () => pasteList(name, (added) => { cards = cards.concat(added); cache = null; paintList(); });
    $('#shf-go', ov).onclick = () => study(cards, name);
    $('#shf-bk', ov).onclick = decksView;
    $('#shf-ren', ov).onclick = async () => {
      const n = (prompt('New deck name', name) || '').trim().slice(0, 60);
      if (!n || n === name) return;
      const { error } = await sb().from('user_flashcards').update({ deck: n }).eq('deck', name);
      if (error) return alert(error.message);
      cache = null; deckView(n);
    };
    $('#shf-del', ov).onclick = async () => {
      if (!confirm(`Delete the deck “${name}” and all ${cards.length} cards? This can't be undone.`)) return;
      const { error } = await sb().from('user_flashcards').delete().eq('deck', name);
      if (error) return alert(error.message);
      cache = null; decksView();
    };
    if (fresh) f.focus();
  }

  function modal(html) {
    const m = document.createElement('div'); m.className = 'shf-modal'; m.innerHTML = `<div class="box" role="dialog" aria-modal="true">${html}</div>`;
    document.documentElement.appendChild(m);
    m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
    m.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); m.remove(); } });
    return m;
  }

  function editCard(c, done) {
    if (!c) return;
    const pics = { front: c.front_image || '', back: c.back_image || '' };
    const m = modal(`<h2 style="margin:0 0 12px">Edit card</h2><div class="shf-in" style="padding:0"><label class="shf-lab">Front</label><textarea id="ef" maxlength="300">${esc(c.front)}</textarea><div class="shf-pic" data-pic="front" style="margin:6px 0 12px"></div><label class="shf-lab">Back</label><textarea id="eb" maxlength="600">${esc(c.back)}</textarea><div class="shf-pic" data-pic="back" style="margin-top:6px"></div>
      <div class="shf-row" style="justify-content:flex-end;margin-top:14px"><button class="shf-btn" id="ex">Cancel</button><button class="shf-btn pri" id="es">Save</button></div></div>`);
    const paintPic = (side) => {
      const box = $(`[data-pic="${side}"]`, m);
      box.innerHTML = pics[side] ? `<img src="${esc(pics[side])}" alt="" referrerpolicy="no-referrer"><button class="shf-btn sm" data-rm>Remove picture</button>` : '<button class="shf-btn sm" data-add>🖼 Add a picture</button>';
      const a = $('[data-add]', box); if (a) a.onclick = () => picker((u) => { pics[side] = u; paintPic(side); });
      const r = $('[data-rm]', box); if (r) r.onclick = () => { pics[side] = ''; paintPic(side); };
    };
    paintPic('front'); paintPic('back');
    $('#ex', m).onclick = () => m.remove();
    $('#es', m).onclick = async () => {
      const front = $('#ef', m).value.trim(), back = $('#eb', m).value.trim();
      if (!front || !back) return;
      const { error } = await sb().from('user_flashcards').update({ front, back, front_image: pics.front || null, back_image: pics.back || null }).eq('id', c.id);
      if (error) return alert(error.message);
      Object.assign(c, { front, back, front_image: pics.front || null, back_image: pics.back || null });
      m.remove(); done();
    };
  }

  // "front - back" (or front<TAB>back, front: back) per line → many cards at once
  function pasteList(name, done) {
    const m = modal(`<h2 style="margin:0 0 6px">Paste a list</h2><p class="shf-note" style="margin:0 0 10px">One card per line: <b>front – back</b> (a dash, colon or tab between them). Up to 100 lines.</p>
      <div class="shf-in" style="padding:0"><textarea id="pl" style="min-height:220px" placeholder="Firewall – filters traffic between networks using rules&#10;Phishing: fake messages that trick people into giving details"></textarea>
      <p class="shf-note" id="pc"></p><div class="shf-row" style="justify-content:flex-end;margin-top:10px"><button class="shf-btn" id="px">Cancel</button><button class="shf-btn pri" id="pa" disabled>Add cards</button></div></div>`);
    const parse = () => $('#pl', m).value.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 100).map((l) => {
      const mm = l.match(/^(.+?)\s*(?:\t|\s[–—-]\s|:\s)\s*(.+)$/);
      return mm ? { front: mm[1].slice(0, 300), back: mm[2].slice(0, 600) } : null;
    });
    $('#pl', m).oninput = () => { const rows = parse(), ok = rows.filter(Boolean).length; $('#pc', m).textContent = rows.length ? `${ok} card${ok === 1 ? '' : 's'} ready${rows.length - ok ? ` · ${rows.length - ok} line${rows.length - ok === 1 ? '' : 's'} without a separator will be skipped` : ''}` : ''; $('#pa', m).disabled = !ok; };
    $('#px', m).onclick = () => m.remove();
    $('#pa', m).onclick = async function () {
      const rows = parse().filter(Boolean).map((r) => Object.assign({ deck: name }, r));
      this.disabled = true; this.textContent = 'Adding…';
      const { data, error } = await sb().from('user_flashcards').insert(rows).select(COLS);
      if (error) { this.disabled = false; this.textContent = 'Add cards'; return alert(error.message); }
      m.remove(); done(data || []);
    };
    $('#pl', m).focus();
  }

  // Pictures: search Wikimedia Commons (free, openly licensed) or paste an https link. Only the link is saved.
  function picker(onPick) {
    const m = modal(`<div class="shf-row" style="justify-content:space-between;margin-bottom:10px"><h2 style="margin:0">Add a picture</h2><button class="shf-ic" id="pkx" aria-label="Close">✕</button></div>
      <div class="shf-tabs"><button data-tab="s" aria-pressed="true">Search pictures</button><button data-tab="l" aria-pressed="false">Paste a link</button></div>
      <div class="shf-in" style="padding:0">
        <div data-pane="s"><div class="shf-row" style="flex-wrap:nowrap"><input type="search" id="pkq" placeholder="e.g. router, mitochondria, Maslow" aria-label="Search pictures"><button class="shf-btn pri" id="pks">Search</button></div><div class="shf-res" id="pkr"></div><p class="shf-note">Pictures from Wikimedia Commons (free to reuse). Only the picture's link is saved to your card.</p></div>
        <div data-pane="l" hidden><input type="url" id="pkl" placeholder="https://…/picture.jpg" aria-label="Picture link"><div id="pkp" style="margin-top:10px"></div><div class="shf-row" style="justify-content:flex-end;margin-top:10px"><button class="shf-btn pri" id="pku" disabled>Use this picture</button></div><p class="shf-note">Use a link that starts with https:// and points straight at an image.</p></div></div>`);
    $('#pkx', m).onclick = () => m.remove();
    $$('[data-tab]', m).forEach((b) => b.onclick = () => { $$('[data-tab]', m).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); $$('[data-pane]', m).forEach((p) => { p.hidden = p.dataset.pane !== b.dataset.tab; }); });
    const search = async () => {
      const q = $('#pkq', m).value.trim(); if (!q) return;
      const out = $('#pkr', m); out.innerHTML = '<div class="shf-spin" style="grid-column:1/-1"></div>';
      try {
        const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url|mime&iiurlwidth=480&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap|drawing');
        const r = await fetch(url).then((x) => x.json());
        const pages = Object.values((r.query && r.query.pages) || {}).sort((a, b) => a.index - b.index);
        const imgs = pages.map((p) => (p.imageinfo || [])[0]).filter((i) => i && /^image\/(jpeg|png|gif|webp|svg\+xml)$/.test(i.mime) && httpsOk(i.thumburl));
        out.innerHTML = imgs.length ? imgs.map((i) => `<button type="button" data-u="${esc(i.thumburl)}"><img src="${esc(i.thumburl)}" alt="" loading="lazy" referrerpolicy="no-referrer"></button>`).join('') : '<p class="shf-note" style="grid-column:1/-1">No pictures found. Try a simpler word.</p>';
        $$('[data-u]', out).forEach((b) => b.onclick = () => { onPick(b.dataset.u); m.remove(); });
      } catch (e) { out.innerHTML = '<p class="shf-note" style="grid-column:1/-1">Picture search is unavailable right now. Paste a link instead.</p>'; }
    };
    $('#pks', m).onclick = search;
    $('#pkq', m).onkeydown = (e) => { if (e.key === 'Enter') search(); };
    $('#pkl', m).oninput = () => {
      const u = $('#pkl', m).value.trim(), ok = httpsOk(u);
      $('#pkp', m).innerHTML = ok ? `<img src="${esc(u)}" alt="Preview" style="max-width:100%;max-height:200px;border-radius:12px" referrerpolicy="no-referrer">` : '';
      $('#pku', m).disabled = true;
      const img = $('#pkp img', m);
      if (img) { img.onload = () => { $('#pku', m).disabled = false; }; img.onerror = () => { $('#pkp', m).innerHTML = '<p class="shf-note">That link isn’t a picture we can show.</p>'; }; }
    };
    $('#pku', m).onclick = () => { onPick($('#pkl', m).value.trim()); m.remove(); };
    $('#pkq', m).focus();
  }

  function study(cards, name, dueOnly) {
    const now = Date.now();
    let queue = cards.filter((c) => Date.parse(c.due_at) <= now);
    if (!queue.length && !dueOnly) queue = cards.slice();
    queue = queue.sort(() => Math.random() - 0.5);
    if (!queue.length) { body().innerHTML = `<div class="shf-empty"><h1 class="shf-h1">All caught up</h1><p class="shf-sub">No cards are due. Come back tomorrow, or practise a deck anyway.</p><button class="shf-btn pri" id="shf-r">My decks</button></div>`; $('#shf-r', ov).onclick = decksView; return; }
    let i = 0, right = 0;
    const face = (t, img, side) => `${img ? `<img src="${esc(img)}" alt="" referrerpolicy="no-referrer">` : ''}<div class="t">${esc(t)}</div><small>${side}</small>`;
    function show() {
      if (i >= queue.length) {
        body().innerHTML = `<div class="shf-empty">${window.RA10Tools ? RA10Tools.mascot('cheer', 90) : ''}<h1 class="shf-h1">Deck done!</h1><p class="shf-sub">You knew ${right} of ${queue.length}. Cards you found hard come back sooner.</p><div class="shf-row" style="justify-content:center"><button class="shf-btn" id="shf-a">Go again</button><button class="shf-btn pri" id="shf-r">My decks</button></div></div>`;
        $('#shf-r', ov).onclick = decksView; $('#shf-a', ov).onclick = () => study(cards, name);
        try { if (window.RA10Track) RA10Track.log('flashcard', { ref: 'deck:' + name, title: name, score: right, max_score: queue.length }); } catch (e) {}
        return;
      }
      const c = queue[i];
      body().innerHTML = `<div class="shf-study"><div class="shf-row" style="width:100%;max-width:560px;justify-content:space-between"><button class="shf-back" id="shf-bk">← ${esc(name)}</button><small>${i + 1} / ${queue.length}</small></div>
        <div class="shf-prog"><i style="width:${(i / queue.length) * 100}%"></i></div>
        <button class="shf-flip" id="shf-card" aria-label="Flashcard — press to flip"><span class="inn"><span class="shf-face f">${face(c.front, c.front_image, 'Tap or press Space to flip')}</span><span class="shf-face b">${face(c.back, c.back_image, 'How did you do?')}</span></span></button>
        <div class="shf-rate" id="shf-rate" hidden><button class="shf-btn" data-r="1">Again <small>1</small></button><button class="shf-btn" data-r="2">Hard <small>2</small></button><button class="shf-btn pri" data-r="3">Got it <small>3</small></button></div></div>`;
      const card = $('#shf-card', ov), rate = $('#shf-rate', ov);
      const flip = () => { card.classList.toggle('on'); rate.hidden = !card.classList.contains('on'); };
      card.onclick = flip; card.focus();
      $('#shf-bk', ov).onclick = () => (name === 'All decks' ? decksView() : deckView(name));
      const grade = (r) => {
        const box = r === 1 ? 1 : r === 2 ? Math.max(1, c.box) : Math.min(5, c.box + 1);
        if (r === 3) right++;
        const due = new Date(Date.now() + GAP_DAYS[box - 1] * 864e5).toISOString();
        sb().from('user_flashcards').update({ box, due_at: due }).eq('id', c.id).then(() => {}, () => {});
        c.box = box; c.due_at = due; cache = null;
        i++; show();
      };
      $$('[data-r]', rate).forEach((b) => b.onclick = () => grade(Number(b.dataset.r)));
      ov.onkeydown = (e) => {
        if (e.key === 'Escape') return close();
        if (e.key === ' ' || e.key === 'Enter') { if (document.activeElement === card || e.key === ' ') { e.preventDefault(); flip(); } }
        if (!rate.hidden && /^[123]$/.test(e.key)) grade(Number(e.key));
      };
    }
    show();
  }

  window.SHCards = { section, open };
})();
