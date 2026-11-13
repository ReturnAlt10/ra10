/* RA10 — Bug Hunt (/tools/bug-hunt/): "spot the bug / fix the logic" for Python, SQL and OCR pseudocode.
   The AI writes a short program with 1–2 subtle logic bugs. Python and SQL are checked by RUNNING the learner's fix
   (study-hub/code-runner.js: Pyodide / sql.js); before a challenge is shown we prove the model fix passes and the
   buggy code fails. Pseudocode (OCR Exam Reference Language) is marked by the AI against mark points.
   Server: supabase/functions/ai-tools (bug, bug-mark). Premium · 3 free tries. Solving one earns Python-task XP. */
(function () {
  'use strict';
  const main = document.getElementById('at-main');
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const T = () => window.RA10Tools;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const S = { lang: 'python', level: 'btec', topic: '', ch: null, solved: false };
  try { const p = JSON.parse(localStorage.getItem('ra10_bughunt_pref') || '{}'); if (p.lang) S.lang = p.lang; if (p.level) S.level = p.level; } catch (e) {}
  const LANGS = [['python', 'Python', '🐍'], ['sql', 'SQL', '🗃️'], ['pseudocode', 'OCR pseudocode', '📝']];
  const LEVELS = [['btec', 'BTEC'], ['gcse', 'GCSE'], ['alevel', 'A-Level']];
  function toast(m) { const t = document.createElement('div'); t.className = 'at-toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 3000); }
  function signedIn() { try { return RA10.isLoggedIn(); } catch (e) { return false; } }
  const step = (ch) => ({ lang: ch.lang, solution: ch.solution, tests: ch.tests, setup: ch.setup });

  async function boot() {
    let n = 0; while (!window.RA10 && n++ < 60) await new Promise((r) => setTimeout(r, 100));
    try { await RA10.init(); } catch (e) {}
    home();
  }

  async function home() {
    if (!signedIn()) { main.innerHTML = `<div class="at-empty">${T().mascot('wave', 96)}<h2>Sign in to hunt bugs</h2><p>It's free to try.</p><a class="at-btn pri" href="/auth">Sign in</a></div>`; return; }
    const st = await T().status(true);
    main.innerHTML = `<section class="at-hero">${T().mascot('think', 92)}<div><h1>Bug Hunt ${T().badge('bughunt', st)}</h1><p>Find the logic bug, fix it, prove it works. The bugs are the sneaky kind exams love: off-by-one, wrong comparison, wrong join.</p></div></section>
      <div class="at-card"><span class="at-label">Language</span><div class="at-seg" role="group" aria-label="Language">${LANGS.map(([k, t, ic]) => `<button class="at-chip${S.lang === k ? ' on' : ''}" data-lang="${k}" aria-pressed="${S.lang === k}">${ic} ${t}</button>`).join('')}</div>
        <span class="at-label" style="margin-top:14px">Level</span><div class="at-seg" role="group" aria-label="Level">${LEVELS.map(([k, t]) => `<button class="at-chip${S.level === k ? ' on' : ''}" data-level="${k}" aria-pressed="${S.level === k}">${t}</button>`).join('')}</div>
        <label class="at-label" for="topic" style="margin-top:14px">Topic <span class="at-mut" style="font-weight:500">(optional)</span></label><input class="at-in" id="topic" maxlength="80" placeholder="e.g. loops and totals, string handling, JOINs" value="${esc(S.topic)}">
        <div class="at-row end" style="margin-top:14px"><button class="at-btn pri" id="go">Get a challenge</button></div></div>`;
    $$('[data-lang]').forEach((b) => b.onclick = () => { S.lang = b.dataset.lang; save(); home(); });
    $$('[data-level]').forEach((b) => b.onclick = () => { S.level = b.dataset.level; save(); home(); });
    $('#go').onclick = () => { S.topic = $('#topic').value.trim(); generate(); };
    if (window.SHCode && S.lang !== 'pseudocode') SHCode.warm(S.lang);
  }
  function save() { try { localStorage.setItem('ra10_bughunt_pref', JSON.stringify({ lang: S.lang, level: S.level })); } catch (e) {} }

  async function generate(ticket) {
    main.innerHTML = `<div class="at-loading">${T().mascot('think', 96)}<h2 style="margin:0">Hiding a bug…</h2><p class="at-mut" id="msg">Writing the program</p><span class="at-spin"></span></div>`;
    try {
      const r = await T().api('bug', { lang: S.lang, level: S.level, topic: S.topic, ticket: ticket || null });
      const ch = r.challenge;
      if (ch.lang !== 'pseudocode') {
        $('#msg').textContent = 'Running it to make sure the bug is real';
        const v = await SHCode.verify(step(ch));
        let buggyFails = false;
        if (v.ok) { const res = await SHCode.check(step(ch), ch.buggy); buggyFails = res.passed < res.total; }
        if (!v.ok || !buggyFails) {
          if (r.ticket) return generate(r.ticket);      // one free retry
          throw new Error('Sorry — that challenge didn\'t pass our checks (we only show bugs we have proved by running the code). Please try again.');
        }
      }
      S.ch = ch; S.solved = false;
      play();
    } catch (e) {
      if (e.handled) return home();
      main.innerHTML = `<div class="at-empty">${T().mascot('think', 88)}<h2>That didn't work</h2><p>${esc(e.message)}</p><button class="at-btn pri" id="back">Back</button></div>`;
      $('#back').onclick = home;
    }
  }

  function play() {
    const ch = S.ch;
    const isCode = ch.lang !== 'pseudocode';
    main.innerHTML = `<div class="at-row" style="justify-content:space-between;margin-bottom:12px"><button class="at-btn" id="back">← New challenge</button><span class="rtl-pill try">${esc(LANGS.find((l) => l[0] === ch.lang)[1])} · ${esc(LEVELS.find((l) => l[0] === ch.level)[1])}</span></div>
      <div class="at-split"><div class="at-card"><h2>${esc(ch.title)}</h2><p class="at-mut" style="margin:6px 0 12px">${esc(ch.brief)}</p>
        ${ch.lang === 'sql' ? `<details style="margin:0 0 10px"><summary class="at-small" style="cursor:pointer">The tables</summary><pre class="at-out">${esc(ch.setup)}</pre></details>` : ''}
        <label class="at-label" for="code">${ch.bugs.length > 1 ? 'Find and fix the 2 bugs' : 'Find and fix the bug'}</label>
        <textarea class="at-code" id="code" spellcheck="false" autocapitalize="off" autocomplete="off">${esc(ch.buggy)}</textarea>
        ${isCode ? '' : '<label class="at-label" for="why" style="margin-top:12px">Explain what was wrong</label><textarea id="why" rows="3" placeholder="The loop stopped one item early because…"></textarea>'}
        <div class="at-row" style="margin-top:12px">${isCode ? '<button class="at-btn" id="run">▶ Run</button>' : ''}<button class="at-btn pri" id="check">${isCode ? '✓ Check my fix' : '✓ Mark my fix'}</button><button class="at-btn" id="hint">💡 Hint</button><button class="at-btn" id="reset">Reset</button></div></div>
      <div class="at-card at-sticky"><h3>${isCode ? 'Output and tests' : 'Feedback'}</h3><div id="out"><p class="at-mut at-small">${isCode ? 'Run the program or check your fix. Every test runs your code for real.' : 'Fix the pseudocode and explain the bug, then mark it.'}</p></div></div></div>`;
    const code = $('#code');
    code.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = code.selectionStart; code.setRangeText('    ', s, code.selectionEnd, 'end'); } });
    $('#back').onclick = home;
    $('#reset').onclick = () => { code.value = ch.buggy; };
    $('#hint').onclick = () => { $('#out').insertAdjacentHTML('afterbegin', `<ul class="at-list"><li class="part"><span class="dot">💡</span><span>${esc(ch.hint || 'Trace it with the example input, line by line.')}</span></li></ul>`); };
    const out = $('#out');
    if (isCode) {
      $('#run').onclick = async () => {
        out.innerHTML = '<div class="at-loading" style="padding:12px"><span class="at-spin"></span></div>';
        const r = await SHCode.run(step(ch), code.value, ch.lang === 'python' ? ((ch.tests[0] || {}).stdin || []) : []);
        if (ch.lang === 'sql') out.innerHTML = r.err ? `<pre class="at-out">${esc(r.err)}</pre>` : `<div class="at-tablewrap"><table class="at-table"><thead><tr>${r.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${r.rows.slice(0, 30).map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
        else out.innerHTML = `<p class="at-small at-mut" style="margin:0 0 6px">Input: ${esc(((ch.tests[0] || {}).stdin || []).join(', ') || '(none)')}</p><pre class="at-out">${esc(r.err ? (r.out || '') + '\n' + r.err : r.out || '(no output)')}</pre>`;
      };
    }
    $('#check').onclick = async function () {
      this.disabled = true;
      out.innerHTML = '<div class="at-loading" style="padding:12px"><span class="at-spin"></span></div>';
      try {
        if (isCode) {
          const r = await SHCode.check(step(ch), code.value);
          const ok = r.passed === r.total;
          out.innerHTML = `<ul class="at-list">${r.details.map((d) => `<li class="${d.ok ? 'ok' : 'miss'}"><span class="dot">${d.ok ? '✓' : '✕'}</span><span><b>${esc(d.label)}</b>${d.detail ? `<small style="white-space:pre-wrap">${esc(d.detail)}</small>` : ''}</span></li>`).join('')}</ul>` + (ok ? solvedHtml() : '');
          if (ok) solved();
        } else {
          const r = await T().api('bug-mark', { challenge: ch, fix: code.value, explain: ($('#why') || {}).value || '' });
          const ok = r.fixed && r.score >= 2;
          out.innerHTML = `<div class="at-score">${T().mascot(ok ? 'cheer' : 'think', 64)}<div><div class="big" style="font-size:2.2rem">${r.score}/${r.max}</div></div></div><p>${esc(r.feedback)}</p>` + (ok ? solvedHtml() : '');
          if (ok) solved();
        }
      } catch (e) { if (!e.handled) out.innerHTML = `<p>${esc(e.message)}</p>`; }
      this.disabled = false;
      const rev = $('#reveal'); if (rev) rev.onclick = reveal;
      const nx = $('#next'); if (nx) nx.onclick = () => generate();
    };
    if (isCode && window.SHCode) SHCode.warm(ch.lang);
  }
  function solvedHtml() {
    return `<div style="margin-top:14px;text-align:center">${T().mascot('cheer', 72)}<p style="margin:6px 0 10px"><b>Bug squashed!</b></p><div class="at-row" style="justify-content:center"><button class="at-btn" id="reveal">What the bugs were</button><button class="at-btn pri" id="next">Next challenge</button></div></div>`;
  }
  function solved() {
    if (S.solved) return;
    S.solved = true;
    try { if (window.RA10Track) RA10Track.log('code_task', { ref: 'bughunt:' + S.ch.lang + ':' + S.ch.title, title: 'Bug Hunt: ' + S.ch.title, score: 1, max_score: 1, meta: { lang: S.ch.lang, level: S.ch.level } }); } catch (e) {}
  }
  function reveal() {
    const ch = S.ch;
    $('#out').insertAdjacentHTML('beforeend', `<ul class="at-list">${ch.bugs.map((b) => `<li><span class="dot" style="background:var(--at-acc)">${b.line}</span><span><b>Line ${b.line}: ${esc(b.kind)}</b><small>${esc(b.explain)}</small></span></li>`).join('')}</ul><details style="margin-top:8px"><summary class="at-small" style="cursor:pointer">Model fix</summary><pre class="at-out">${esc(ch.solution)}</pre></details>`);
  }

  boot();
})();
