/* RA10 Quality dashboard — owner only.

   Rates every unit in the registry (refresh/ra10-units.js) out of 100 from five categories:
     Guide        how useful learners find the revision guide (votes) + how deep it is (audit)
     Questions    is the practice exam-style: command words, mark schemes, tariffs, extended answers,
                  real + RA10 papers, specification coverage, bank sizes (audit)
     Accuracy     open mistake reports learners have sent about this unit (feedback)
     AI Examiner  agreement with official examiners on marked answers (benchmark) + learners' "was this
                  mark fair?" votes (feedback)
     Engagement   how many learners use it, for how long, whether they come back, how many tools they use
   Each category is null when there is not enough data; the overall score is the weighted mean of the
   categories that have data, with a confidence label. Data sources:
     • quality_usage / quality_feedback / quality_reports RPCs (supabase/sql/quality.sql)
     • the latest content audit snapshot (run from this page: loads every unit in a hidden frame with
       ?ra10catalog=1&audit=1 and saves the result)
     • AI Examiner benchmark snapshots (run from this page against admin/quality/bench/*.json)
   The owner's own activity and feedback never count. */
(function () {
  'use strict';
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const pct = (a, b) => (b ? a / b : null);
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const fmt = (n, d) => (n == null || !Number.isFinite(Number(n)) ? '–' : Number(n).toLocaleString('en-GB', { maximumFractionDigits: d == null ? 0 : d }));
  const main = $('#main');

  let sb = null;
  const S = { days: 30, units: [], usage: {}, prev: {}, fb: [], reports: [], audit: null, auditAt: null, bench: [], tab: 'units', sort: { k: 'overall', dir: 1 }, filter: { q: '', fam: 'all' }, rows: [] };

  /* ════════════════════════ boot ════════════════════════ */
  async function boot() {
    let n = 0; while (!window.RA10 && n++ < 80) await sleep(100);
    try { await RA10.init(); } catch (e) {}
    if (!RA10.isLoggedIn()) { main.innerHTML = '<div class="sc-card"><h2>Sign in</h2><p class="sc-muted">The Quality dashboard is for the RA10 owner account.</p><a class="sc-btn pri" href="/auth">Sign in</a></div>'; return; }
    sb = RA10.getClient();
    const me = RA10.getSession().user;
    const em = (me.email || '').toLowerCase();
    const owner = em === 'mistry.hashim@icloud.com' || em === 'faiz.mistry@gmail.com' || RA10.getTier() === 'owner';
    if (!owner) { main.innerHTML = '<div class="sc-card"><h2>Owner only</h2><p class="sc-muted">This page is only available to the RA10 owner.</p></div>'; return; }
    n = 0; while (!(window.RA10Units && RA10Units.all().length) && n++ < 50) await sleep(100);
    S.units = (window.RA10Units ? RA10Units.all() : []).filter(u => !/booklets/.test(u.path));
    try { S.days = Number(localStorage.getItem('ra10_qa_days')) || 30; } catch (e) {}
    await loadAll();
  }

  async function rpc(name, args) {
    const { data, error } = await sb.rpc(name, args || {});
    if (error) throw new Error(error.message);
    return data;
  }
  async function loadAll() {
    main.innerHTML = '<div class="sc-loading"><span class="sc-spin"></span> Loading ratings…</div>';
    S.error = null;
    try {
      const [u, p, fb, rep, au, be] = await Promise.all([
        rpc('quality_usage', { p_days: S.days, p_offset_days: 0 }),
        rpc('quality_usage', { p_days: S.days, p_offset_days: S.days }),
        rpc('quality_feedback', { p_days: Math.max(S.days, 90) }),
        rpc('quality_reports', { p_status: 'open', p_limit: 500 }),
        rpc('quality_snapshots_list', { p_kind: 'audit', p_limit: 1 }),
        rpc('quality_snapshots_list', { p_kind: 'benchmark', p_limit: 30 })
      ]);
      S.usage = (u && u.units) || {}; S.prev = (p && p.units) || {};
      S.fb = fb || []; S.reports = rep || [];
      S.audit = au && au[0] ? au[0].data : null; S.auditAt = au && au[0] ? au[0].created_at : null;
      // latest benchmark run per set
      const seen = new Set(); S.bench = (be || []).filter(r => { const k = r.data && r.data.set; if (!k || seen.has(k)) return false; seen.add(k); return true; });
    } catch (e) {
      S.error = e.message;
    }
    compute();
    paint();
  }

  /* ════════════════════════ scoring ════════════════════════ */
  const famOf = (u) => /A-?Level/i.test(u.qual) ? 'alevel' : /Level 2/i.test(u.qual) ? 'btec2' : 'btec3';
  const kindOf = (u) => /exam/i.test(u.kind) ? 'exam' : /set task/i.test(u.kind) ? 'task' : 'coursework';
  // what "complete" looks like for each kind of unit (from the quality bars in PLAYBOOK.md)
  function targets(u) {
    if (famOf(u) === 'alevel') return { q: 150, quiz: 150, flash: 150, words: 8000, diagrams: 12, real: 6, ra10: 6 };
    const k = kindOf(u);
    if (k === 'exam') return { q: 60, quiz: 80, flash: 80, words: 4000, diagrams: 8, real: 1, ra10: 6 };
    if (k === 'task') return { q: 40, quiz: 50, flash: 50, words: 2500, diagrams: 4, real: 1, ra10: 0 };
    return { q: 40, quiz: 50, flash: 50, words: 2500, diagrams: 5, real: 0, ra10: 0 };
  }
  const mean = (arr) => { const v = arr.filter(x => x != null && Number.isFinite(x)); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
  const WEIGHTS = { guide: 20, questions: 25, accuracy: 20, ai: 15, engagement: 20 };
  const CAT_NAMES = { guide: 'Revision guide', questions: 'Questions & exam style', accuracy: 'Accuracy', ai: 'AI Examiner', engagement: 'Engagement' };

  function benchFor(path) {
    const items = [];
    S.bench.forEach(r => { const d = r.data || {}; if (d.unit === path) (d.results || []).forEach(x => items.push(x)); });
    if (!items.length) return null;
    const done = items.filter(x => Number.isFinite(x.ai));
    if (!done.length) return null;
    const tol = (m) => (m <= 4 ? 0 : m <= 12 ? 1 : 2);
    const within = done.filter(x => Math.abs(x.ai - x.examiner) <= tol(x.marks)).length;
    const mae = mean(done.map(x => Math.abs(x.ai - x.examiner)));
    const maePct = mean(done.map(x => Math.abs(x.ai - x.examiner) / x.marks));
    const bias = mean(done.map(x => x.ai - x.examiner));
    return { n: done.length, within, withinPct: within / done.length, mae, maePct, bias, items: done };
  }

  function computeUnit(u, maxLearners) {
    const T = targets(u), k = kindOf(u);
    const A = S.audit && S.audit.units ? S.audit.units[u.path] : null;
    const us = S.usage[u.path] || null, pv = S.prev[u.path] || null;
    const fb = S.fb.filter(r => r.unit === u.path);
    const sumBy = (target, key) => fb.filter(r => !target || r.target === target).reduce((s, r) => s + Number(r[key] || 0), 0);
    const guideVotes = { up: sumBy('guide', 'helpful'), down: sumBy('guide', 'not_helpful') };
    const ai = { fair: sumBy('ai_mark', 'fair'), low: sumBy('ai_mark', 'too_low'), high: sumBy('ai_mark', 'too_high') };
    const openReports = S.reports.filter(r => r.unit === u.path);
    const bench = benchFor(u.path);
    const fix = [];
    const add = (sev, text) => fix.push({ sev, text });
    const cats = {}, why = {};

    // ── Revision guide ──
    if (A && A.guide && A.guide.available) {
      const depth = mean([clamp01(A.guide.words / T.words), clamp01((A.guide.diagrams + A.guide.images) / T.diagrams)]);
      const votes = guideVotes.up + guideVotes.down;
      const helpful = votes >= 5 ? guideVotes.up / votes : null;
      cats.guide = helpful == null ? depth : 0.6 * helpful + 0.4 * depth;
      why.guide = `${fmt(A.guide.words)} words, ${A.guide.diagrams} diagrams, ${A.guide.tables} tables` + (votes ? ` · ${guideVotes.up}/${votes} helpful votes` : ' · no votes yet');
      if (helpful != null && helpful < 0.7) add('high', `Only ${Math.round(helpful * 100)}% of guide votes say “helpful”. See the least helpful sections below.`);
      if (A.guide.words < T.words) add('med', `Guide is ${fmt(A.guide.words)} words; aim for ${fmt(T.words)}+ (every spec topic explained, with examples).`);
      if (A.guide.diagrams + A.guide.images < T.diagrams) add('med', `Guide has ${A.guide.diagrams + A.guide.images} diagrams/figures; aim for ${T.diagrams}+.`);
    } else if (A) { cats.guide = null; why.guide = 'No revision guide found'; add('high', 'This unit has no revision guide view.'); }
    else { cats.guide = null; why.guide = 'Run the content audit'; }
    fb.filter(r => r.target === 'guide' && Number(r.not_helpful) >= 2 && Number(r.not_helpful) > Number(r.helpful))
      .sort((a, b) => b.not_helpful - a.not_helpful).slice(0, 3)
      .forEach(r => add('med', `Guide section “${r.title || r.ref}” — ${r.not_helpful} not helpful vs ${r.helpful} helpful.`));

    // ── Questions & exam style ──
    if (A) {
      const q = A.questions, pp = A.papers;
      const parts = [clamp01(q.n / T.q), clamp01(A.quiz.n / T.quiz), clamp01(A.flash.n / T.flash), A.quiz.n ? A.quiz.with_why / A.quiz.n : null, A.spec.topics ? A.spec.covered / A.spec.topics : null];
      if (k !== 'coursework') {
        parts.push(q.n ? q.with_verb / q.n : 0, q.n ? q.with_ms / q.n : 0, clamp01(Object.keys(q.tariffs || {}).length / 4), q.n ? clamp01((q.extended / q.n) / 0.1) : 0);
        if (T.real) parts.push(clamp01(pp.real / T.real));
        if (T.ra10) parts.push(clamp01(pp.ra10 / T.ra10));
        if (pp.items) parts.push(pp.items_ms / pp.items);
      }
      cats.questions = mean(parts);
      why.questions = `${q.n} questions (${q.n ? Math.round(q.with_ms / q.n * 100) : 0}% with mark schemes), ${A.quiz.n} quiz, ${A.flash.n} cards` + (pp.n ? ` · ${pp.real} real + ${pp.ra10} RA10 papers` : '') + (A.spec.topics ? ` · ${A.spec.covered}/${A.spec.topics} spec topics covered` : '');
      if (q.n < T.q) add('med', `Question bank has ${q.n}; target ${T.q}+.`);
      if (A.quiz.n < T.quiz) add('med', `Quiz has ${A.quiz.n}; target ${T.quiz}+.`);
      if (A.flash.n < T.flash) add('low', `Flashcards: ${A.flash.n}; target ${T.flash}+.`);
      if (A.quiz.n && A.quiz.with_why / A.quiz.n < 0.9) add('low', `${A.quiz.n - A.quiz.with_why} quiz questions have no explanation.`);
      if (A.spec.topics && A.spec.covered < A.spec.topics) add(A.spec.covered / A.spec.topics < 0.8 ? 'high' : 'med', `${A.spec.topics - A.spec.covered} spec topics have no practice question: ${A.spec.missing.slice(0, 8).join(', ')}${A.spec.missing.length > 8 ? '…' : ''}`);
      if (k !== 'coursework') {
        if (q.n && q.with_ms / q.n < 0.95) add('high', `${q.n - q.with_ms} questions have no mark scheme.`);
        if (q.n && q.with_verb / q.n < 0.9) add('low', `${q.n - q.with_verb} questions have no command word (State, Explain, Evaluate…).`);
        if (q.n && q.extended / q.n < 0.05) add('med', 'Very few extended-response questions (6+ marks) — real papers rely on them.');
        if (T.ra10 && pp.ra10 < T.ra10) add('high', `${pp.ra10} RA10 practice papers; target ${T.ra10}.`);
        if (T.real && pp.real < T.real) add('high', 'No real/sample exam-board paper in the papers library.');
        if (pp.items && pp.items_ms / pp.items < 0.95) add('med', `${pp.items - pp.items_ms} paper questions have no mark scheme.`);
      }
    } else { cats.questions = null; why.questions = 'Run the content audit'; }

    // ── Accuracy (mistake reports) ──
    const learners = us ? us.learners : 0;
    if (openReports.length) {
      cats.accuracy = clamp01(1 - 0.12 * openReports.length);
      why.accuracy = `${openReports.length} open mistake report${openReports.length === 1 ? '' : 's'}`;
      add('high', `${openReports.length} open mistake report${openReports.length === 1 ? '' : 's'} from learners — fix or dismiss them in Reports.`);
    } else if (learners >= 5) { cats.accuracy = 1; why.accuracy = `No open reports from ${learners} learners`; }
    else { cats.accuracy = null; why.accuracy = learners ? `Only ${learners} learner${learners === 1 ? '' : 's'} – not enough to judge` : 'No learners yet'; }

    // ── AI Examiner ──
    const aiVotes = ai.fair + ai.low + ai.high;
    const aiParts = [];
    if (bench && bench.n >= 5) aiParts.push(bench.withinPct);
    if (aiVotes >= 5) aiParts.push(ai.fair / aiVotes);
    cats.ai = aiParts.length ? mean(aiParts) : null;
    why.ai = [bench ? `Benchmark: ${bench.within}/${bench.n} within tolerance, avg ${fmt(bench.mae, 1)} marks off (${bench.bias > 0 ? '+' : ''}${fmt(bench.bias, 1)} bias)` : null, aiVotes ? `${ai.fair}/${aiVotes} learners say fair` : null].filter(Boolean).join(' · ') || (k === 'coursework' ? 'Not used on assignment units' : 'No benchmark or votes yet');
    if (bench && bench.withinPct < 0.75) add('high', `AI Examiner matches the official examiner (within tolerance) on only ${Math.round(bench.withinPct * 100)}% of benchmark answers; average error ${fmt(bench.mae, 1)} marks.`);
    if (bench && Math.abs(bench.bias) >= 1) add('med', `AI Examiner is on average ${fmt(Math.abs(bench.bias), 1)} marks too ${bench.bias > 0 ? 'generous' : 'harsh'} compared with examiners.`);
    if (aiVotes >= 5 && ai.high / aiVotes > 0.25) add('med', `${Math.round(ai.high / aiVotes * 100)}% of learners think AI marks are too high.`);
    if (aiVotes >= 5 && ai.low / aiVotes > 0.25) add('med', `${Math.round(ai.low / aiVotes * 100)}% of learners think AI marks are too low.`);

    // ── Engagement ──
    if (us && us.learners >= 3) {
      const reach = Math.sqrt(us.learners / Math.max(1, maxLearners));
      const depth = clamp01((us.median_minutes || 0) / 20);
      const ret = us.learners ? us.returning / us.learners : 0;
      const breadth = clamp01((us.views_used || 0) / 4);
      cats.engagement = 0.3 * reach + 0.3 * depth + 0.25 * ret + 0.15 * breadth;
      why.engagement = `${us.learners} learners, median ${fmt(us.median_minutes, 1)} min, ${Math.round(ret * 100)}% came back, ${us.views_used} tools used`;
      if ((us.median_minutes || 0) < 5) add('med', `Learners spend a median of only ${fmt(us.median_minutes, 1)} minutes — check the first screen and the guide's opening.`);
      if (ret < 0.2) add('med', `Only ${Math.round(ret * 100)}% of learners come back on another day.`);
      if (k === 'exam' && us.learners >= 5 && !us.papers) add('low', 'No one opened a paper this period — make the papers easier to find.');
      if (k === 'exam' && us.learners >= 5 && !us.ai) add('low', 'No one used the AI Examiner this period.');
      if (us.mcq >= 50) {
        const acc = us.mcq_correct / us.mcq;
        if (acc < 0.45) add('med', `Quiz accuracy is ${Math.round(acc * 100)}% — questions may be too hard, unclear or have wrong answers.`);
        if (acc > 0.95) add('low', `Quiz accuracy is ${Math.round(acc * 100)}% — questions may be too easy.`);
      }
    } else { cats.engagement = null; why.engagement = us && us.learners ? `Only ${us.learners} learner${us.learners === 1 ? '' : 's'} this period` : 'No learners this period'; }

    if (!A) add('low', 'Run the content audit to score the guide and questions.');

    // ── overall ──
    let w = 0, s = 0, have = 0;
    Object.keys(WEIGHTS).forEach(c => { if (cats[c] != null) { w += WEIGHTS[c]; s += WEIGHTS[c] * cats[c]; have++; } });
    const overall = w ? Math.round(s / w * 100) : null;
    const conf = have >= 4 && learners >= 10 ? 'High' : have >= 3 ? 'Medium' : 'Low';
    const order = { high: 0, med: 1, low: 2 };
    fix.sort((a, b) => order[a.sev] - order[b.sev]);
    const trend = us && pv ? (us.learners - pv.learners) : us ? us.learners : pv ? -pv.learners : 0;
    return { u, path: u.path, fam: famOf(u), kind: k, overall, conf, cats: Object.fromEntries(Object.entries(cats).map(([a, v]) => [a, v == null ? null : Math.round(v * 100)])), why, fix, audit: A, usage: us, prev: pv, fb, reports: openReports, bench, guideVotes, ai, trend };
  }

  function compute() {
    const maxL = Math.max(1, ...Object.values(S.usage).map(x => x.learners || 0));
    S.rows = S.units.map(u => computeUnit(u, maxL));
  }

  /* ════════════════════════ rendering ════════════════════════ */
  const cls = (v) => (v == null ? 'n' : v >= 75 ? 'g' : v >= 55 ? 'a' : 'r');
  const sc = (v) => `<span class="qa-sc ${cls(v)}">${v == null ? '–' : v}</span>`;
  const big = (v) => `<span class="qa-big" style="--p:${v || 0};--c:${v == null ? 'var(--line-2)' : v >= 75 ? 'var(--ok)' : v >= 55 ? 'var(--warn)' : 'var(--bad)'}"><span>${v == null ? '–' : v}</span></span>`;
  const subjectOf = (u) => u.subject || '';

  function paint() {
    const rows = S.rows;
    const rated = rows.filter(r => r.overall != null);
    const avg = rated.length ? Math.round(mean(rated.map(r => r.overall))) : null;
    const learners = Object.values(S.usage).reduce((s, x) => s + (x.learners || 0), 0);
    const mins = Object.values(S.usage).reduce((s, x) => s + Number(x.minutes || 0), 0);
    const allBench = S.bench.reduce((acc, r) => acc.concat((r.data && r.data.results || []).filter(x => Number.isFinite(x.ai))), []);
    const tol = (m) => (m <= 4 ? 0 : m <= 12 ? 1 : 2);
    const benchPct = allBench.length ? Math.round(allBench.filter(x => Math.abs(x.ai - x.examiner) <= tol(x.marks)).length / allBench.length * 100) : null;
    const auditAge = S.auditAt ? Math.round((Date.now() - new Date(S.auditAt)) / 86400000) : null;
    main.innerHTML = `
      <div class="qa-head"><div><h1>Quality ratings</h1><p>Every unit scored out of 100 from its content, learners’ feedback, AI Examiner accuracy and real usage. Lowest scores first, with what to fix.</p></div>
        <div class="qa-ctrl"><select id="qa-days" aria-label="Period">${[7, 30, 90, 365].map(d => `<option value="${d}"${d === S.days ? ' selected' : ''}>Last ${d === 365 ? '12 months' : d + ' days'}</option>`).join('')}</select>
          <button class="sc-btn" id="qa-audit">Run content audit</button><button class="sc-btn" id="qa-csv">Export CSV</button><button class="sc-btn ghost" id="qa-reload">Refresh</button></div></div>
      ${S.error ? `<div class="qa-note">Could not load ratings: ${esc(S.error)}. Run <code>supabase/sql/quality.sql</code> in the Supabase SQL editor (after edu-platform.sql), then refresh.</div>` : ''}
      ${!S.audit ? '<div class="qa-note info">No content audit yet. Click <b>Run content audit</b> (about 5–8 minutes) so the Guide and Questions scores can be calculated.</div>' : auditAge > 14 ? `<div class="qa-note info">The content audit is ${auditAge} days old. Run it again after content changes.</div>` : ''}
      <div id="qa-run" hidden></div>
      <div class="qa-tiles">
        <div class="qa-tile"><b>${avg == null ? '–' : avg}</b><span>Average unit score</span><small>${rated.length} of ${rows.length} units rated</small></div>
        <div class="qa-tile"><b>${rows.filter(r => r.overall != null && r.overall < 55).length}</b><span>Units below 55</span><small>need attention first</small></div>
        <div class="qa-tile"><b>${fmt(learners)}</b><span>Learner-units this period</span><small>a learner counts once per unit</small></div>
        <div class="qa-tile"><b>${fmt(mins / 60, 1)} h</b><span>Time in units</span><small>last ${S.days} days</small></div>
        <div class="qa-tile"><b>${S.reports.length}</b><span>Open mistake reports</span><small>from learners</small></div>
        <div class="qa-tile"><b>${benchPct == null ? '–' : benchPct + '%'}</b><span>AI agrees with examiners</span><small>${allBench.length ? allBench.length + ' benchmark answers' : 'run a benchmark'}</small></div>
      </div>
      <div class="qa-tabs" role="tablist">${[['units', 'Units'], ['reports', 'Reports'], ['ai', 'AI Examiner'], ['how', 'How scores work']].map(([k, t]) => `<button role="tab" data-tab="${k}" class="${S.tab === k ? 'on' : ''}">${t}${k === 'reports' && S.reports.length ? `<i>${S.reports.length}</i>` : ''}</button>`).join('')}</div>
      <section id="qa-body"></section>`;
    $('#qa-days').onchange = (e) => { S.days = Number(e.target.value); try { localStorage.setItem('ra10_qa_days', S.days); } catch (x) {} loadAll(); };
    $('#qa-reload').onclick = loadAll;
    $('#qa-csv').onclick = exportCsv;
    $('#qa-audit').onclick = runAudit;
    $$('[data-tab]').forEach(b => b.onclick = () => { S.tab = b.dataset.tab; $$('[data-tab]').forEach(x => x.classList.toggle('on', x === b)); paintTab(); });
    paintTab();
  }

  function paintTab() {
    const body = $('#qa-body');
    if (S.tab === 'units') return paintUnits(body);
    if (S.tab === 'reports') return paintReports(body, S.reports, true);
    if (S.tab === 'ai') return paintAI(body);
    return paintHow(body);
  }

  function filteredRows() {
    const q = S.filter.q.trim().toLowerCase();
    let rows = S.rows.filter(r => (S.filter.fam === 'all' || r.fam === S.filter.fam) && (!q || (r.u.name + ' ' + r.u.subject + ' ' + r.u.qual).toLowerCase().indexOf(q) >= 0));
    const k = S.sort.k, d = S.sort.dir;
    const val = (r) => k === 'overall' ? r.overall : k === 'name' ? (r.u.subject + r.u.name) : k === 'learners' ? (r.usage ? r.usage.learners : 0) : k === 'minutes' ? (r.usage ? Number(r.usage.median_minutes) : 0) : r.cats[k];
    rows = rows.slice().sort((a, b) => {
      const x = val(a), y = val(b);
      if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
      return (typeof x === 'string' ? x.localeCompare(y) : x - y) * d;
    });
    return rows;
  }
  function paintUnits(body) {
    body.innerHTML = `<div class="sc-card"><div class="qa-filters"><input type="search" id="qa-q" placeholder="Filter by subject or unit" value="${esc(S.filter.q)}">
        <select id="qa-fam"><option value="all">All qualifications</option><option value="alevel">A-Level</option><option value="btec3">BTEC Level 3</option><option value="btec2">BTEC Level 2</option></select></div>
      <div class="sc-tbl-wrap"><table class="sc-tbl qa-tbl"><thead><tr>
        ${[['name', 'Unit'], ['overall', 'Score'], ['guide', 'Guide'], ['questions', 'Questions'], ['accuracy', 'Accuracy'], ['ai', 'AI'], ['engagement', 'Engagement'], ['learners', 'Learners'], ['minutes', 'Median min']].map(([k, t]) => `<th><button data-sort="${k}" class="${S.sort.k === k ? 'on' : ''}">${t}${S.sort.k === k ? (S.sort.dir > 0 ? ' ↑' : ' ↓') : ''}</button></th>`).join('')}<th>Top issue</th></tr></thead>
        <tbody></tbody></table></div></div>`;
    $('#qa-fam').value = S.filter.fam;
    const fill = () => {
      $('tbody', body).innerHTML = filteredRows().map(r => {
        const us = r.usage;
        const tr = r.trend > 0 ? `<span class="qa-trend up">▲${r.trend}</span>` : r.trend < 0 ? `<span class="qa-trend down">▼${-r.trend}</span>` : '<span class="qa-trend flat">–</span>';
        return `<tr class="click" data-path="${esc(r.path)}"><td class="u"><b><i style="background:${esc(r.u.color)}"></i>${esc(r.u.name)}</b><small>${esc(r.u.qual)} · ${esc(r.u.kind)}</small></td>
          <td>${sc(r.overall)}<span class="qa-conf">${r.overall == null ? '' : r.conf}</span></td>
          <td>${sc(r.cats.guide)}</td><td>${sc(r.cats.questions)}</td><td>${sc(r.cats.accuracy)}</td><td>${sc(r.cats.ai)}</td><td>${sc(r.cats.engagement)}</td>
          <td>${us ? fmt(us.learners) : 0} ${tr}</td><td>${us ? fmt(us.median_minutes, 1) : '–'}</td>
          <td class="issue">${r.fix[0] ? esc(r.fix[0].text) : '<span class="sc-badge ok">Nothing flagged</span>'}</td></tr>`;
      }).join('') || '<tr><td colspan="10" class="sc-muted">No units match.</td></tr>';
    };
    fill();
    $('#qa-q').oninput = (e) => { S.filter.q = e.target.value; fill(); };
    $('#qa-fam').onchange = (e) => { S.filter.fam = e.target.value; fill(); };
    $$('[data-sort]', body).forEach(b => b.onclick = () => { const k = b.dataset.sort; S.sort = { k, dir: S.sort.k === k ? -S.sort.dir : (k === 'name' ? 1 : k === 'learners' || k === 'minutes' ? -1 : 1) }; paintUnits(body); });
    $('tbody', body).onclick = (e) => { const tr = e.target.closest('tr[data-path]'); if (tr) openUnit(tr.dataset.path); };
  }

  function openUnit(path) {
    const r = S.rows.find(x => x.path === path); if (!r) return;
    const d = document.createElement('div');
    d.className = 'qa-drawer';
    const us = r.usage || {}, A = r.audit;
    const byView = Object.entries(us.by_view || {}).sort((a, b) => b[1] - a[1]);
    const maxV = Math.max(1, ...byView.map(x => x[1]));
    const guideRows = r.fb.filter(x => x.target === 'guide').sort((a, b) => (b.not_helpful - b.helpful) - (a.not_helpful - a.helpful)).slice(0, 12);
    d.innerHTML = `<div class="qa-panel" role="dialog" aria-modal="true" aria-label="${esc(r.u.name)}">
      <div class="qa-ph">${big(r.overall)}<h2>${esc(r.u.name)}<small>${esc(r.u.qual)} · ${esc(r.u.kind)} · confidence ${r.overall == null ? '–' : r.conf}</small></h2><a class="sc-btn sm" href="${esc(r.u.publicPath || r.path)}" target="_blank" rel="noopener">Open unit</a><button class="sc-btn sm" data-x>Close</button></div>
      <div class="qa-pb">
        <div class="qa-cats">${Object.keys(WEIGHTS).map(c => `<div class="qa-cat"><span>${CAT_NAMES[c]} · ${WEIGHTS[c]}%</span>${sc(r.cats[c])}<small>${esc(r.why[c] || '')}</small></div>`).join('')}</div>
        <div class="sc-card"><h2>What to improve</h2>${r.fix.length ? `<ul class="qa-fix">${r.fix.map(f => `<li><b class="sev ${f.sev}">${f.sev === 'med' ? 'medium' : f.sev}</b><span>${esc(f.text)}</span></li>`).join('')}</ul>` : '<p class="sc-muted">Nothing flagged. Keep an eye on new feedback.</p>'}</div>
        ${r.reports.length ? `<div class="sc-card"><h2>Open mistake reports (${r.reports.length})</h2><div class="qa-rep" id="qa-unit-rep"></div></div>` : ''}
        <div class="sc-card"><h2>Usage · last ${S.days} days</h2>${us.learners ? `<div class="qa-kv">
            <div><span>Learners</span><b>${fmt(us.learners)}${r.prev ? ` <small class="sc-muted">(prev ${fmt(r.prev.learners)})</small>` : ''}</b></div><div><span>Sessions</span><b>${fmt(us.sessions)}</b></div>
            <div><span>Came back another day</span><b>${fmt(us.returning)} (${Math.round(us.returning / us.learners * 100)}%)</b></div><div><span>Median minutes / learner</span><b>${fmt(us.median_minutes, 1)}</b></div>
            <div><span>Total time</span><b>${fmt(us.minutes / 60, 1)} h</b></div><div><span>Guide sections read</span><b>${fmt(us.guide_sections)}</b></div>
            <div><span>Quiz answers</span><b>${fmt(us.mcq)} (${us.mcq ? Math.round(us.mcq_correct / us.mcq * 100) : 0}% right)</b></div><div><span>Written answers</span><b>${fmt(us.answers)}</b></div>
            <div><span>AI Examiner marks</span><b>${fmt(us.ai)}${us.ai_pct != null ? ` · avg ${fmt(us.ai_pct)}%` : ''}</b></div><div><span>Papers opened</span><b>${fmt(us.papers)}</b></div>
            <div><span>Downloads</span><b>${fmt(us.downloads)}</b></div><div><span>Last activity</span><b>${us.last_at ? new Date(us.last_at).toLocaleDateString('en-GB') : '–'}</b></div></div>
          ${byView.length ? `<h3 style="margin:16px 0 8px;font-size:.92rem">Time by tool</h3><div class="qa-bars">${byView.map(([v, m]) => `<div class="qa-bar"><span>${esc(v)}</span><span class="t"><i style="width:${Math.round(m / maxV * 100)}%"></i></span><em>${fmt(m, 0)} min</em></div>`).join('')}</div>` : ''}` : '<p class="sc-muted">No learner activity in this period.</p>'}</div>
        <div class="sc-card"><h2>Guide feedback</h2>${guideRows.length ? `<div class="sc-tbl-wrap"><table class="sc-tbl"><thead><tr><th>Section</th><th>Helpful</th><th>Not helpful</th><th>Reports</th></tr></thead><tbody>${guideRows.map(g => `<tr><td style="white-space:normal">${esc(g.title || g.ref)}</td><td>${g.helpful}</td><td>${g.not_helpful}</td><td>${g.reports_open}</td></tr>`).join('')}</tbody></table></div>` : '<p class="sc-muted">No guide votes yet.</p>'}</div>
        <div class="sc-card"><h2>AI Examiner</h2><div class="qa-kv"><div><span>Learner votes: fair</span><b>${r.ai.fair}</b></div><div><span>Too low</span><b>${r.ai.low}</b></div><div><span>Too high</span><b>${r.ai.high}</b></div>
          ${r.bench ? `<div><span>Benchmark answers</span><b>${r.bench.n}</b></div><div><span>Within tolerance</span><b>${Math.round(r.bench.withinPct * 100)}%</b></div><div><span>Average error</span><b>${fmt(r.bench.mae, 1)} marks</b></div><div><span>Bias</span><b>${r.bench.bias > 0 ? '+' : ''}${fmt(r.bench.bias, 1)}</b></div>` : ''}</div>
          ${r.bench ? benchTable(r.bench.items) : '<p class="sc-muted" style="margin-top:10px">No benchmark run for this unit.</p>'}</div>
        ${A ? `<div class="sc-card"><h2>Content audit <span class="sc-badge">${S.auditAt ? new Date(S.auditAt).toLocaleDateString('en-GB') : ''}</span></h2><div class="qa-kv">
            <div><span>Bank questions</span><b>${A.questions.n}</b></div><div><span>With mark scheme</span><b>${A.questions.with_ms}</b></div><div><span>With command word</span><b>${A.questions.with_verb}</b></div>
            <div><span>Extended (6+ marks)</span><b>${A.questions.extended}</b></div><div><span>Tariffs used</span><b>${Object.keys(A.questions.tariffs || {}).sort((a, b) => a - b).join(', ') || '–'}</b></div><div><span>With scenario/context</span><b>${A.questions.with_context}</b></div>
            <div><span>Quiz (with why)</span><b>${A.quiz.n} (${A.quiz.with_why})</b></div><div><span>Flashcards</span><b>${A.flash.n}</b></div><div><span>Papers (real / RA10)</span><b>${A.papers.real} / ${A.papers.ra10}</b></div>
            <div><span>Paper questions with MS</span><b>${A.papers.items_ms}/${A.papers.items}</b></div><div><span>Spec topics covered</span><b>${A.spec.topics ? A.spec.covered + '/' + A.spec.topics : 'n/a'}</b></div>
            <div><span>Guide words</span><b>${fmt(A.guide.words)}</b></div><div><span>Guide diagrams</span><b>${A.guide.diagrams}</b></div><div><span>Guide tables</span><b>${A.guide.tables}</b></div></div></div>` : ''}
      </div></div>`;
    document.body.appendChild(d);
    const close = () => d.remove();
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-x]')) close(); });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    $('[data-x]', d).focus();
    if (r.reports.length) paintReports($('#qa-unit-rep', d), r.reports, false);
  }
  function benchTable(items) {
    return `<div class="sc-tbl-wrap" style="margin-top:12px"><table class="sc-tbl"><thead><tr><th>Answer</th><th>Marks</th><th>Examiner</th><th>AI</th><th>Diff</th></tr></thead><tbody>${items.map(x => { const df = x.ai - x.examiner; return `<tr><td>${esc(x.id)}</td><td>${x.marks}</td><td>${x.examiner}</td><td>${x.ai}</td><td><span class="qa-sc ${Math.abs(df) <= (x.marks <= 4 ? 0 : x.marks <= 12 ? 1 : 2) ? 'g' : Math.abs(df) / x.marks <= 0.25 ? 'a' : 'r'}">${df > 0 ? '+' : ''}${df}</span></td></tr>`; }).join('')}</tbody></table></div>`;
  }

  /* ════════════════════════ reports inbox ════════════════════════ */
  const CAT = { wrong_answer: 'Wrong answer', mark_scheme: 'Mark scheme', unclear: 'Unclear', typo: 'Typo', off_spec: 'Not on spec', broken: 'Broken', ai_mark: 'AI mark', other: 'Other' };
  function unitName(path) { const u = S.units.find(x => x.path === path); return u ? u.name + ' · ' + u.qual : path; }
  function paintReports(host, list, full) {
    if (!list.length) { host.innerHTML = '<div class="sc-card"><p class="sc-muted">No open reports.</p></div>'; return; }
    host.innerHTML = `${full ? '<div class="sc-card"><h2>Open mistake reports <span class="sc-badge bad">' + list.length + '</span></h2><div class="qa-rep">' : ''}${list.map(r => `
      <div class="qa-r" data-id="${r.id}"><div class="top"><span class="sc-badge bad">${esc(CAT[r.category] || r.category)}</span><b>${esc(full ? unitName(r.unit) : (r.target || ''))}</b><span>${esc(r.target)}${r.ref ? ' · ' + esc(String(r.ref).slice(0, 60)) : ''}</span><span>${new Date(r.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span><span>${esc(r.reporter || r.reporter_email || '')}</span>${r.score != null ? `<span>AI mark ${fmt(r.score)}/${fmt(r.max_score)}</span>` : ''}</div>
        ${r.title ? `<div class="q">${esc(r.title)}</div>` : ''}<div class="c">${esc(r.comment || '')}</div>
        <div class="acts"><input type="text" placeholder="Note (what you changed)"><button class="sc-btn sm pri" data-st="fixed">Mark fixed</button><button class="sc-btn sm" data-st="dismissed">Dismiss</button><a class="sc-btn sm ghost" href="${esc(((S.units.find(x => x.path === r.unit) || {}).publicPath) || r.unit)}" target="_blank" rel="noopener">Open unit</a></div></div>`).join('')}${full ? '</div></div>' : ''}`;
    host.onclick = async (e) => {
      const b = e.target.closest('[data-st]'); if (!b) return;
      const card = b.closest('[data-id]');
      b.disabled = true;
      try {
        await rpc('quality_resolve', { p_id: Number(card.dataset.id), p_status: b.dataset.st, p_note: $('input', card).value || null });
        S.reports = S.reports.filter(x => String(x.id) !== card.dataset.id);
        card.remove();
        compute();
        const tab = $('[data-tab="reports"] i'); if (tab) { if (S.reports.length) tab.textContent = S.reports.length; else tab.remove(); }
      } catch (ex) { alert(ex.message); b.disabled = false; }
    };
  }

  /* ════════════════════════ content audit ════════════════════════ */
  function frame(url, timeoutMs, want) {
    return new Promise((resolve) => {
      const f = document.createElement('iframe');
      f.src = url;
      const host = $('#qa-frames');
      let done = false;
      const finish = (v) => { if (done) return; done = true; window.removeEventListener('message', on); clearTimeout(t); setTimeout(() => f.remove(), 50); resolve(v); };
      const on = (e) => { if (e.origin === location.origin && e.source === f.contentWindow && e.data && e.data.type === want) finish(e.data); };
      window.addEventListener('message', on);
      const t = setTimeout(() => finish({ error: 'timed out' }), timeoutMs);
      host.appendChild(f);
    });
  }
  async function runAudit() {
    const btn = $('#qa-audit'); btn.disabled = true;
    const run = $('#qa-run'); run.hidden = false;
    const units = S.units.slice();
    const out = {}, errors = [];
    let i = 0, finished = 0;
    const show = (label) => { run.innerHTML = `<div class="sc-card"><h2>Content audit <span class="sc-badge">${finished}/${units.length}</span></h2><div class="qa-prog"><i style="width:${Math.round(finished / units.length * 100)}%"></i></div><p class="sc-muted" style="margin:10px 0 0">${esc(label || '')}</p></div>`; };
    show('Starting…');
    const worker = async () => {
      while (i < units.length) {
        const u = units[i++];
        const url = u.path.replace(/\/$/, '') + '/index.html?ra10catalog=1&audit=1';
        const res = await frame(url, 75000, 'ra10:audit');
        if (res && res.audit) out[u.path] = res.audit; else errors.push(u.name + ': ' + ((res && res.error) || 'no result'));
        finished++; show('Checked ' + u.name);
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    const data = { at: new Date().toISOString(), units: out, errors };
    try { await rpc('quality_save_snapshot', { p_kind: 'audit', p_data: data, p_label: `${Object.keys(out).length} units` }); }
    catch (e) { alert('Audit finished but could not be saved: ' + e.message); }
    S.audit = data; S.auditAt = data.at;
    run.innerHTML = `<div class="sc-card"><h2>Content audit finished</h2><p class="sc-muted" style="margin:0">${Object.keys(out).length} units checked.${errors.length ? ' Problems: ' + esc(errors.join('; ')) : ''}</p></div>`;
    btn.disabled = false;
    compute(); paintTab();
    setTimeout(() => paint(), 2500);
  }

  /* ════════════════════════ AI Examiner benchmark ════════════════════════ */
  let benchSets = null;
  async function loadBenchSets() {
    if (benchSets) return benchSets;
    try { const r = await fetch('bench/index.json', { cache: 'no-store' }); benchSets = r.ok ? (await r.json()).sets || [] : []; } catch (e) { benchSets = []; }
    return benchSets;
  }
  async function paintAI(body) {
    body.innerHTML = '<div class="sc-loading"><span class="sc-spin"></span> Loading benchmark sets…</div>';
    const sets = await loadBenchSets();
    const last = (name) => S.bench.find(r => r.data && r.data.set === name);
    body.innerHTML = `<div class="sc-card"><h2>AI Examiner benchmark</h2>
      <p class="sc-muted" style="margin-top:0">Real student answers that exam-board examiners have already marked are sent to the live AI Examiner (as your owner account, so it costs no credits and isn't recorded as learner activity). The AI's mark is compared with the examiner's. <b>Within tolerance</b> means exact for 1–4 mark questions, ±1 for 5–12 marks and ±2 above that.</p>
      ${sets.length ? `<div class="sc-tbl-wrap"><table class="sc-tbl"><thead><tr><th>Set</th><th>Answers</th><th>Last run</th><th>Within tolerance</th><th>Avg error</th><th>Bias</th><th></th></tr></thead><tbody>${sets.map(s => {
        const l = last(s.set), sm = l && l.data.summary;
        return `<tr><td style="white-space:normal"><b>${esc(s.title)}</b><br><small class="sc-muted">${esc(s.source)}</small></td><td>${s.items}</td><td>${l ? new Date(l.created_at).toLocaleDateString('en-GB') : 'never'}</td><td>${sm ? sc(Math.round(sm.withinPct * 100)) : '–'}</td><td>${sm ? fmt(sm.mae, 1) + ' marks' : '–'}</td><td>${sm ? (sm.bias > 0 ? '+' : '') + fmt(sm.bias, 1) : '–'}</td><td><button class="sc-btn sm pri" data-run="${esc(s.set)}">Run</button></td></tr>`;
      }).join('')}</tbody></table></div>` : '<p class="sc-muted">No benchmark sets found in /admin/quality/bench/. Build them with <code>python tools/quality/build_bench.py</code>.</p>'}
      <div id="qa-bench-run" style="margin-top:14px"></div></div>
      ${S.bench.map(r => r.data && r.data.results ? `<div class="sc-card"><h2>${esc(r.data.title)} <span class="sc-badge">${new Date(r.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span></h2>${benchTable(r.data.results.filter(x => Number.isFinite(x.ai)))}</div>` : '').join('')}`;
    $$('[data-run]', body).forEach(b => b.onclick = () => runBench(b.dataset.run, b));
  }

  // Load the unit app in a hidden frame and rebuild the exact question object the app sends to the AI Examiner.
  async function questionBuilder(unitPath) {
    return new Promise((resolve) => {
      const f = document.createElement('iframe');
      f.src = unitPath.replace(/\/$/, '') + '/index.html?ra10catalog=1&bench=1';
      $('#qa-frames').appendChild(f);
      const t0 = Date.now();
      const poll = async () => {
        const w = f.contentWindow;
        try {
          if (w && w.RA10UnitUI && !w.__qaPapersOpened) {
            // AQA 7132 keeps its exam-board papers in "pastpapers"; everything else uses "papers"
            const names = w.RA10UnitUI.destinations().map(x => x.name);
            w.__qaPapersOpened = true;
            try { w.RA10UnitUI.go(names.indexOf('pastpapers') >= 0 ? 'pastpapers' : 'papers'); } catch (e) {}
          }
          const papers = w && (w.AQA_PAPERS || w.BIZ_PAPERS);
          if (papers && papers.length && (w.AqaPapers || w.BIZ_PAPERS)) {
            resolve({
              frame: f,
              build: (paperId, q) => {
                const p = papers.find(x => x.id === paperId); if (!p) return null;
                if (w.AqaPapers && w.AQA_PAPERS) return (w.AqaPapers.buildQuestions([p]) || []).find(x => x.item_q === q) || null;
                // A-level / AAQ apps (shared biz-papers engine): q may be 5, "5", "05.1" or "5.1"
                if (w.BizPapers && w.BizPapers.buildQuestions) {
                  const m = String(q).match(/^0*(\d+)(?:[.(]\s*(\w+)\)?)?$/);
                  const qn = m ? Number(m[1]) : Number(q), sub = m && m[2] ? String(m[2]) : null;
                  const all = w.BizPapers.buildQuestions([p]) || [];
                  return all.find(x => Number(x.item_q) === qn && String(x.item_sub || '') === String(sub || '')) || all.find(x => Number(x.item_q) === qn) || null;
                }
                const it = (p.items || []).find(x => String(x.q) + (x.sub || '') === q || x.q === q); if (!it) return null;
                return { id: p.id + '-' + q, question: it.text, marks: it.marks, mark_scheme: it.ms, scenario: (it.ctx || []).join('\n'), paper_id: p.id };
              }
            });
            return;
          }
        } catch (e) {}
        if (Date.now() - t0 > 60000) { resolve(null); return; }
        setTimeout(poll, 600);
      };
      setTimeout(poll, 1500);
    });
  }

  let benchStop = false;
  async function runBench(name, btn) {
    const box = $('#qa-bench-run');
    let set;
    try { set = await (await fetch('bench/' + name + '.json', { cache: 'no-store' })).json(); } catch (e) { box.innerHTML = '<p class="sc-muted">Could not load the benchmark file.</p>'; return; }
    if (!confirm(`Send ${set.items.length} examiner-marked answers to the AI Examiner? This takes a few minutes.`)) return;
    $$('[data-run]').forEach(b => b.disabled = true);
    benchStop = false;
    box.innerHTML = '<p class="sc-muted"><span class="sc-spin"></span> Loading the unit to build the questions…</p>';
    const qb = await questionBuilder(set.unit);
    if (!qb) { box.innerHTML = '<p class="sc-muted">Could not load the unit’s papers.</p>'; $$('[data-run]').forEach(b => b.disabled = false); return; }
    const results = [];
    let k = 0, done = 0;
    const paintRun = (msg) => { box.innerHTML = `<div class="qa-prog"><i style="width:${Math.round(done / set.items.length * 100)}%"></i></div><p class="sc-muted">${done}/${set.items.length} marked ${esc(msg || '')} <button class="sc-btn sm" id="qa-bench-stop">Stop</button></p>`; const s = $('#qa-bench-stop'); if (s) s.onclick = () => { benchStop = true; }; };
    paintRun('');
    const worker = async () => {
      while (k < set.items.length && !benchStop) {
        const it = set.items[k++];
        const q = qb.build(it.paper_id, it.q);
        const row = { id: it.id, marks: it.marks, examiner: it.examiner_mark, ai: null };
        if (!q) { row.error = 'question not found'; }
        else {
          for (let attempt = 0; attempt < 2 && row.ai == null; attempt++) {
            try {
              const res = await RA10.examineAnswer({ question: q, answer: it.answer });
              const r = (res && res.result) || {};
              if (Number.isFinite(Number(r.earned))) { row.ai = Number(r.earned); row.level = r.level || null; }
              else row.error = 'no mark returned';
            } catch (e) { row.error = String(e.message || e).slice(0, 160); await sleep(2500); }
          }
        }
        results.push(row); done++; paintRun('· last: ' + it.id + (row.ai != null ? ` AI ${row.ai} vs examiner ${row.examiner}` : ' – ' + row.error));
      }
    };
    await Promise.all([worker(), worker()]);
    qb.frame.remove();
    const ok = results.filter(x => Number.isFinite(x.ai));
    const tol = (m) => (m <= 4 ? 0 : m <= 12 ? 1 : 2);
    const summary = ok.length ? { n: ok.length, withinPct: ok.filter(x => Math.abs(x.ai - x.examiner) <= tol(x.marks)).length / ok.length, mae: mean(ok.map(x => Math.abs(x.ai - x.examiner))), bias: mean(ok.map(x => x.ai - x.examiner)), errors: results.length - ok.length } : null;
    const data = { set: set.set, unit: set.unit, title: set.title, source: set.source, at: new Date().toISOString(), summary, results };
    try { await rpc('quality_save_snapshot', { p_kind: 'benchmark', p_data: data, p_label: set.title }); }
    catch (e) { alert('Benchmark finished but could not be saved: ' + e.message); }
    S.bench = [{ created_at: data.at, data }].concat(S.bench.filter(r => !(r.data && r.data.set === set.set)));
    compute();
    $$('[data-run]').forEach(b => b.disabled = false);
    paintAI($('#qa-body'));
  }

  /* ════════════════════════ explanation ════════════════════════ */
  function paintHow(body) {
    body.innerHTML = `<div class="sc-card qa-how"><h2>How the scores work</h2>
      <p>Every unit gets five category scores out of 100. The overall score is their weighted average, using only the categories that have enough data. <b>Confidence</b> is High when at least four categories have data and 10+ learners used the unit; Medium with three categories; otherwise Low. Your own account never counts.</p>
      <table class="sc-tbl"><thead><tr><th>Category</th><th>Weight</th><th>What it measures</th><th>Needs</th></tr></thead><tbody>
        <tr><td>Revision guide</td><td>20%</td><td>60% learners’ “Is this section helpful?” votes + 40% depth (words and diagrams against the target for that kind of unit)</td><td>Content audit; 5+ votes for the vote part</td></tr>
        <tr><td>Questions &amp; exam style</td><td>25%</td><td>Bank, quiz and flashcard sizes against targets; quiz explanations; spec topics covered. For exam units also: command words, mark schemes, tariff variety, extended (6+ mark) questions, real and RA10 papers, paper mark schemes</td><td>Content audit</td></tr>
        <tr><td>Accuracy</td><td>20%</td><td>Open mistake reports from learners: 100 with none, minus 12 per open report. Fixed or dismissed reports stop counting.</td><td>5+ learners, or any report</td></tr>
        <tr><td>AI Examiner</td><td>15%</td><td>Share of benchmark answers where the AI is within tolerance of the official examiner, and share of learners who rate AI marks “fair”</td><td>A benchmark run (5+ answers) or 5+ votes</td></tr>
        <tr><td>Engagement</td><td>20%</td><td>30% reach (learners compared with your busiest unit) + 30% median minutes per learner (20 min = full) + 25% share who come back on another day + 15% number of tools used (4 = full)</td><td>3+ learners in the period</td></tr>
      </tbody></table>
      <h3>Targets used for content</h3>
      <table class="sc-tbl"><thead><tr><th>Unit type</th><th>Bank</th><th>Quiz</th><th>Cards</th><th>Guide words</th><th>Diagrams</th><th>Real papers</th><th>RA10 papers</th></tr></thead><tbody>
        <tr><td>BTEC exam unit</td><td>60</td><td>80</td><td>80</td><td>4,000</td><td>8</td><td>1</td><td>6</td></tr>
        <tr><td>BTEC set task</td><td>40</td><td>50</td><td>50</td><td>2,500</td><td>4</td><td>1</td><td>–</td></tr>
        <tr><td>BTEC assignment unit</td><td>40</td><td>50</td><td>50</td><td>2,500</td><td>5</td><td>–</td><td>–</td></tr>
        <tr><td>A-Level course</td><td>150</td><td>150</td><td>150</td><td>8,000</td><td>12</td><td>6</td><td>6</td></tr></tbody></table>
      <h3>Where the data comes from</h3>
      <ul><li><b>Usage</b>: the activity tracker (pages, unit sections with time spent, quiz answers, written answers, AI Examiner marks, guide sections read, papers opened).</li>
        <li><b>Feedback</b>: learners’ votes and reports from inside every unit (signed-in learners only, rate-limited).</li>
        <li><b>Content audit</b>: this page opens every unit in a hidden frame and counts what is there. Run it after content changes.</li>
        <li><b>Benchmark</b>: <code>admin/quality/bench/*.json</code>, built from exam-board marked answers by <code>tools/quality/build_bench.py</code>.</li></ul>
      <h3>Colours</h3><p>${sc(80)} 75 and above · ${sc(60)} 55–74 · ${sc(40)} below 55 · ${sc(null)} not enough data.</p></div>`;
  }

  /* ════════════════════════ export ════════════════════════ */
  function exportCsv() {
    const head = ['Unit', 'Qualification', 'Kind', 'Score', 'Confidence', 'Guide', 'Questions', 'Accuracy', 'AI Examiner', 'Engagement', 'Learners', 'Median minutes', 'Open reports', 'Top issue'];
    const q = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const lines = [head.map(q).join(',')].concat(S.rows.map(r => [r.u.name, r.u.qual, r.u.kind, r.overall, r.overall == null ? '' : r.conf, r.cats.guide, r.cats.questions, r.cats.accuracy, r.cats.ai, r.cats.engagement, r.usage ? r.usage.learners : 0, r.usage ? r.usage.median_minutes : '', r.reports.length, r.fix[0] ? r.fix[0].text : ''].map(q).join(',')));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    a.download = 'ra10-quality-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  boot();
})();
