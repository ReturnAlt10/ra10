/* RA10 — BTEC Part A / Part B simulator (/tools/prerelease/).
   1. Pick a unit → the AI writes a mock Part A research pack (fictional organisation, tables, charts).
   2. Part A: read the pack and write 1 page of preparation notes against a 45-minute timer.
   3. Feedback: the key facts / SWOT points / risks you noted, half-noted and missed (and why they matter).
   4. Part B: timed tasks, with your notes beside you, marked by the AI against indicative content.
   Server: supabase/functions/ai-tools (pack, pack-notes, pack-mark, pack-list, pack-open). Premium · 2 free tries. */
(function () {
  'use strict';
  const main = document.getElementById('at-main');
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const T = () => window.RA10Tools;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const UNITS = [
    { path: '/revision/btec/level-3/business/unit-2', short: 'Business Unit 2', name: 'Developing a Marketing Campaign', ic: '📣', c: '#ea580c' },
    { path: '/revision/btec/level-3/business/unit-6', short: 'Business Unit 6', name: 'Principles of Management', ic: '🧭', c: '#c2410c' },
    { path: '/revision/btec/level-3/business/unit-7', short: 'Business Unit 7', name: 'Business Decision Making', ic: '📊', c: '#b45309' },
    { path: '/revision/btec/level-3/sport/unit-2', short: 'Sport Unit 2', name: 'Fitness Training and Programming', ic: '🏋️', c: '#15803d' },
    { path: '/revision/btec/level-3/IT-2016/unit-14', short: 'IT Unit 14 (2016)', name: 'IT Service Delivery', ic: '🖧', c: '#4338ca' },
  ];
  const S = { st: null, pack: null, timer: null, notesMins: 45, partbEnd: 0, notesEnd: 0 };
  const store = { get: (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  function toast(m) { const t = document.createElement('div'); t.className = 'at-toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 3000); }
  function fmt(ms) { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function signedIn() { try { return RA10.isLoggedIn(); } catch (e) { return false; } }

  async function boot() {
    let n = 0; while (!window.RA10 && n++ < 60) await new Promise((r) => setTimeout(r, 100));
    try { await RA10.init(); } catch (e) {}
    home();
  }

  /* ── home ── */
  async function home() {
    clearInterval(S.timer);
    if (!signedIn()) {
      main.innerHTML = `<div class="at-empty">${T().mascot('wave', 96)}<h2>Sign in to practise Part A and Part B</h2><p>It's free to try.</p><a class="at-btn pri" href="/auth">Sign in</a></div>`;
      return;
    }
    S.st = await T().status(true);
    main.innerHTML = `<section class="at-hero">${T().mascot('wave', 92)}<div><h1>Part A / Part B simulator ${T().badge('prerelease', S.st)}</h1><p>Get a fresh mock research pack, write your prep notes against the clock, see what you missed — then sit Part B.</p></div></section>
      <div class="at-card"><h2>Pick your unit</h2><p class="at-mut at-small" style="margin:0 0 12px">A fictional organisation with realistic data. Takes about a minute to write.</p>
        <div class="at-tiles">${UNITS.map((u) => `<button class="at-tile" data-unit="${esc(u.path)}" style="--c:${u.c}"><span class="ic" aria-hidden="true">${u.ic}</span><b>${esc(u.short)}</b><small>${esc(u.name)}</small></button>`).join('')}</div></div>
      <div class="at-card" id="mine"><h2>Your packs</h2><div class="at-mut at-small">Loading…</div></div>`;
    $$('[data-unit]').forEach((b) => b.onclick = () => make(b.dataset.unit));
    try {
      const r = await T().api('pack-list');
      const box = $('#mine');
      if (!r.packs.length) { box.innerHTML = '<h2>Your packs</h2><p class="at-mut at-small" style="margin:0">Your mock packs will appear here so you can come back to them.</p>'; return; }
      box.innerHTML = '<h2>Your packs</h2><ul class="at-list">' + r.packs.map((p) => { const u = UNITS.find((x) => x.path === p.unit); return `<li><span class="dot" style="background:${u ? u.c : 'var(--at-acc)'}">${u ? u.ic : '•'}</span><span style="flex:1"><b>${esc(p.title || 'Mock pack')}</b><small>${esc(u ? u.short : '')} · ${new Date(p.created_at).toLocaleDateString('en-GB')}${p.notes ? ` · notes ${p.notes.score}/${p.notes.total}` : ''}${p.partb ? ` · Part B ${p.partb.mark}/${p.partb.max}` : ''}</small></span><button class="at-btn" data-open="${esc(p.id)}">Open</button></li>`; }).join('') + '</ul>';
      $$('[data-open]', box).forEach((b) => b.onclick = () => openPack(b.dataset.open));
    } catch (e) { const box = $('#mine'); if (box) box.innerHTML = '<h2>Your packs</h2><p class="at-mut at-small" style="margin:0">' + esc(e.message) + '</p>'; }
  }

  async function make(unit) {
    const u = UNITS.find((x) => x.path === unit);
    main.innerHTML = `<div class="at-loading">${T().mascot('think', 96)}<h2 style="margin:0">Writing your Part A pack…</h2><p class="at-mut" id="msg">Inventing a realistic organisation for ${esc(u ? u.short : 'your unit')}</p><span class="at-spin"></span></div>`;
    const msgs = ['Building the data tables', 'Drawing up the survey results', 'Hiding a few things worth spotting', 'Setting the Part B tasks'];
    let i = 0; const tick = setInterval(() => { const m = $('#msg'); if (m && i < msgs.length) m.textContent = msgs[i++]; }, 12000);
    try {
      const r = await T().api('pack', { unit });
      clearInterval(tick);
      S.pack = { id: r.id, unit: r.unit, unitName: r.unitName, pack: r.pack, tasks: r.tasks, notes: '', notes_result: null, partb_answers: null, partb_result: null };
      partA();
    } catch (e) {
      clearInterval(tick);
      if (e.handled) return home();
      main.innerHTML = `<div class="at-empty">${T().mascot('think', 88)}<h2>That didn't work</h2><p>${esc(e.message)}</p><button class="at-btn pri" id="back">Back</button></div>`;
      $('#back').onclick = home;
    }
  }
  async function openPack(id) {
    main.innerHTML = '<div class="at-loading"><span class="at-spin"></span></div>';
    try {
      const r = await T().api('pack-open', { id });
      S.pack = r;
      if (r.partb_result) return partBResult(r.partb_result, null);
      if (r.notes_result) return notesResult(r.notes_result);
      partA();
    } catch (e) { toast(e.message); home(); }
  }

  /* ── the pack document ── */
  function packHtml(P) {
    const p = P.pack;
    const max = (c) => Math.max(1, ...c.data.map((d) => d.value));
    return `<article class="at-doc"><p class="at-mut at-small" style="margin:0">${esc(P.unitName || '')} · Part A (mock — fictional organisation)</p><h2>${esc(p.title || p.organisation)}</h2>${p.intro ? `<p>${esc(p.intro)}</p>` : ''}
      ${p.sections.map((s) => `<h3>${esc(s.heading)}</h3>${s.paras.map((x) => `<p>${esc(x)}</p>`).join('')}`).join('')}
      ${p.tables.map((t) => `<div class="at-tablewrap"><table class="at-table"><caption>${esc(t.title)}</caption><thead><tr>${t.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>${t.note ? `<p class="at-mut at-small">${esc(t.note)}</p>` : ''}</div>`).join('')}
      ${p.charts.map((c) => `<figure class="at-chart" aria-label="${esc(c.title)}"><b>${esc(c.title)}</b>${c.data.map((d) => `<div class="at-bar"><span>${esc(d.label)}</span><i style="width:${Math.round(d.value / max(c) * 100)}%"></i><span>${esc(d.value.toLocaleString('en-GB'))}${esc(c.unit && c.unit.length <= 2 ? c.unit : '')}</span></div>`).join('')}${c.unit && c.unit.length > 2 ? `<p class="at-mut at-small" style="margin:6px 0 0">Values in ${esc(c.unit)}</p>` : ''}</figure>`).join('')}
    </article>`;
  }
  function steps(on) {
    const L = ['Read the pack', 'Prep notes', 'Feedback', 'Part B', 'Results'];
    return `<div class="at-steps">${L.map((t, i) => `<span class="${i < on ? 'done' : i === on ? 'on' : ''}">${i < on ? '✓' : i + 1} ${t}</span>`).join('')}</div>`;
  }

  /* ── Part A: notes against the clock ── */
  function partA() {
    clearInterval(S.timer);
    const P = S.pack;
    const saved = store.get('ra10_pre_notes_' + P.id);
    main.innerHTML = `${steps(1)}<div class="at-split"><div class="at-card">${packHtml(P)}</div>
      <div class="at-card at-sticky"><div class="at-row" style="justify-content:space-between"><h2 style="margin:0">Your Part A notes</h2><span class="at-timer" id="tm">${S.notesMins}:00</span></div>
        <p class="at-mut at-small">One page: key figures, trends, SWOT points, risks — anything you'd want in Part B.</p>
        <div class="at-seg" role="group" aria-label="Time"><button class="at-chip${S.notesMins === 45 ? ' on' : ''}" data-mins="45">45 min (real)</button><button class="at-chip${S.notesMins === 20 ? ' on' : ''}" data-mins="20">20 min (quick)</button></div>
        <textarea id="notes" data-voice="Say your notes" rows="16" style="margin-top:10px" placeholder="e.g. Sales down 12% since 2024 — main competitor cheaper by £4…">${esc(P.notes || (saved && saved.text) || '')}</textarea>
        <div class="at-row end" style="margin-top:10px"><span class="at-mut at-small" id="wc"></span><button class="at-btn pri" id="sub">Check my notes</button></div></div></div>`;
    const ta = $('#notes'), wc = $('#wc');
    const words = () => ta.value.trim().split(/\s+/).filter(Boolean).length;
    const upd = () => { wc.textContent = words() + ' words'; store.set('ra10_pre_notes_' + P.id, { text: ta.value }); };
    ta.addEventListener('input', upd); upd();
    $$('[data-mins]').forEach((b) => b.onclick = () => { S.notesMins = Number(b.dataset.mins); S.notesEnd = Date.now() + S.notesMins * 60000; $$('[data-mins]').forEach((x) => x.classList.toggle('on', x === b)); });
    S.notesEnd = Date.now() + S.notesMins * 60000;
    S.timer = setInterval(() => { const left = S.notesEnd - Date.now(); const tm = $('#tm'); if (!tm) return clearInterval(S.timer); tm.textContent = fmt(left); tm.classList.toggle('low', left < 5 * 60000); if (left <= 0) { clearInterval(S.timer); toast('Time\'s up — check your notes'); } }, 500);
    $('#sub').onclick = async function () {
      if (words() < 20) return toast('Write a few lines of notes first.');
      this.disabled = true; this.textContent = 'Checking…';
      try { const r = await T().api('pack-notes', { id: P.id, notes: ta.value }); clearInterval(S.timer); P.notes = ta.value; P.notes_result = r; notesResult(r); }
      catch (e) { this.disabled = false; this.textContent = 'Check my notes'; if (!e.handled) toast(e.message); }
    };
  }

  function notesResult(r) {
    clearInterval(S.timer);
    const P = S.pack;
    const icon = { found: '✓', partial: '½', missed: '!' }, cls = { found: 'ok', partial: 'part', missed: 'miss' };
    const pct = r.total ? r.score / r.total : 0;
    main.innerHTML = `${steps(2)}<div class="at-card"><div class="at-score">${T().mascot(pct >= .7 ? 'cheer' : pct >= .4 ? 'idle' : 'think', 84)}<div><div class="big">${r.score}/${r.total}</div><div class="at-mut">key points in your notes</div></div></div>
        ${(r.tips || []).length ? `<ul class="at-list">${r.tips.map((t) => `<li><span class="dot" style="background:var(--at-acc)">i</span><span>${esc(t)}</span></li>`).join('')}</ul>` : ''}</div>
      <div class="at-card"><h2>What a top-grade student noted</h2><ul class="at-list">${r.items.map((x) => `<li class="${cls[x.status]}"><span class="dot">${icon[x.status]}</span><span><b>${esc(x.point)}</b><small>${esc(x.note || x.why)}</small></span></li>`).join('')}</ul>
        <div class="at-row end" style="margin-top:14px"><button class="at-btn" id="home">Back</button><button class="at-btn pri" id="go">Start Part B (timed)</button></div></div>`;
    $('#home').onclick = home;
    $('#go').onclick = partB;
  }

  /* ── Part B ── */
  function partB() {
    clearInterval(S.timer);
    const P = S.pack;
    const mins = Math.max(15, P.tasks.reduce((s, t) => s + t.marks, 0) * 2);
    const saved = store.get('ra10_pre_b_' + P.id) || [];
    main.innerHTML = `${steps(3)}<div class="at-split"><div class="at-card"><div class="at-row" style="justify-content:space-between"><h2 style="margin:0">Part B</h2><span class="at-timer" id="tm">${mins}:00</span></div>
        ${P.tasks.map((t, i) => `<div style="margin-top:16px"><p style="margin:0 0 6px"><b>Task ${i + 1}</b> <span class="at-mut">(${t.marks} marks)</span></p><p style="margin:0 0 8px">${esc(t.q)}</p><textarea rows="${Math.min(14, 4 + t.marks)}" data-a="${i}" data-voice="Say your answer">${esc((P.partb_answers || saved)[i] || '')}</textarea></div>`).join('')}
        <div class="at-row end" style="margin-top:14px"><button class="at-btn pri" id="mark">Hand in for marking</button></div></div>
      <div class="at-card at-sticky"><h3>Your Part A notes</h3><pre class="at-out" style="max-height:60vh">${esc(P.notes || 'No notes.')}</pre><details style="margin-top:10px"><summary class="at-small" style="cursor:pointer">Look back at the pack</summary>${packHtml(P)}</details></div></div>`;
    const end = Date.now() + mins * 60000;
    S.timer = setInterval(() => { const left = end - Date.now(); const tm = $('#tm'); if (!tm) return clearInterval(S.timer); tm.textContent = fmt(left); tm.classList.toggle('low', left < 5 * 60000); if (left <= 0) { clearInterval(S.timer); toast('Time\'s up — hand in when you\'re ready'); } }, 500);
    const save = () => store.set('ra10_pre_b_' + P.id, $$('[data-a]').map((t) => t.value));
    $$('[data-a]').forEach((t) => t.addEventListener('input', save));
    $('#mark').onclick = async function () {
      const answers = $$('[data-a]').map((t) => t.value);
      this.disabled = true; this.textContent = 'Marking…';
      try { const r = await T().api('pack-mark', { id: P.id, answers }); clearInterval(S.timer); P.partb_answers = answers; P.partb_result = r.marks; partBResult(r.marks, r.points); }
      catch (e) { this.disabled = false; this.textContent = 'Hand in for marking'; if (!e.handled) toast(e.message); }
    };
  }
  function partBResult(marks, points) {
    clearInterval(S.timer);
    const P = S.pack;
    const got = marks.reduce((s, m) => s + m.mark, 0), max = marks.reduce((s, m) => s + m.max, 0);
    main.innerHTML = `${steps(4)}<div class="at-card"><div class="at-score">${T().mascot(got / max >= .6 ? 'cheer' : 'idle', 84)}<div><div class="big">${got}/${max}</div><div class="at-mut">Part B marks</div></div></div></div>
      ${marks.map((m, i) => `<div class="at-card"><div class="at-row" style="justify-content:space-between"><h3 style="margin:0">Task ${i + 1}</h3><b>${m.mark}/${m.max}${m.level ? ' · ' + esc(m.level) : ''}</b></div><p class="at-mut at-small" style="margin:6px 0 10px">${esc((P.tasks[i] || {}).q || '')}</p>
        <ul class="at-list">${m.www ? `<li class="ok"><span class="dot">✓</span><span><b>What went well</b><small>${esc(m.www)}</small></span></li>` : ''}${m.ebi ? `<li class="part"><span class="dot">↑</span><span><b>Even better if</b><small>${esc(m.ebi)}</small></span></li>` : ''}</ul>
        ${points && points[i] ? `<details style="margin-top:10px"><summary class="at-small" style="cursor:pointer">Indicative content</summary><ul>${points[i].map((p) => `<li class="at-small">${esc(p)}</li>`).join('')}</ul></details>` : ''}</div>`).join('')}
      <div class="at-row end" style="margin-top:14px"><button class="at-btn" id="again">Try Part B again</button><button class="at-btn pri" id="home">New pack</button></div>`;
    $('#home').onclick = home;
    $('#again').onclick = partB;
  }

  boot();
})();
