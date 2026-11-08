/* RA10 EDU inside a unit app (loaded on demand by unit-ui.js):
     • catalogue  — ?ra10catalog=1 posts this unit's question bank, quiz and guide sections to the parent
                    window, so teachers can pick exact questions / MCQs / guide sections for assignments
     • dashboard  — "Work set by your teacher" for this unit
     • runner     — opens an assignment (localStorage ra10_edu_pending or ?assignment=ID) and lets the student
                    answer each item here, with the AI Examiner, saving to edu_submissions */
(function () {
  'use strict';
  if (window.RA10UnitEdu) return;
  const UI = window.RA10UnitUI || {};
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const esc = UI.esc || ((s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
  const params = new URLSearchParams(location.search);
  const unit = (window.RA10Units && RA10Units.fromLocation(location.pathname)) || null;
  const UNIT_PATH = unit ? unit.path : (location.pathname.replace(/\/index\.html.*$/, '').replace(/\/$/, ''));
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function R() { return window.RA10 || null; }
  function client() { try { return R() && R().getClient ? R().getClient() : null; } catch (e) { return null; } }
  function signedIn() { try { return !!(R() && R().isLoggedIn()); } catch (e) { return false; } }
  async function ready(maxMs) {
    const t0 = Date.now();
    while (Date.now() - t0 < (maxMs || 12000)) { if (signedIn() && client()) return true; await sleep(300); }
    return false;
  }
  // the assignment runner only needs the question bank / quiz to exist
  async function questionsReady(maxMs) {
    const t0 = Date.now();
    while (Date.now() - t0 < (maxMs || 10000)) {
      const d = UI.appData ? UI.appData() : {};
      if ((d.questions || []).length && ((d.quiz || []).length || Date.now() - t0 > 2500)) return d;
      await sleep(250);
    }
    return UI.appData ? UI.appData() : { questions: [], quiz: [], flash: [], papers: [] };
  }
  // wait until the app's data has loaded and stopped growing (questions, quiz and papers load separately)
  async function dataReady(maxMs) {
    const t0 = Date.now();
    let last = -1, stable = 0;
    while (Date.now() - t0 < (maxMs || 10000)) {
      const d = UI.appData ? UI.appData() : {};
      const n = (d.questions || []).length + (d.quiz || []).length + (d.papers || []).length;
      if (n > 0 && n === last) { if (++stable >= 4) return d; } else stable = 0;
      last = n;
      await sleep(400);
    }
    return UI.appData ? UI.appData() : { questions: [], quiz: [], flash: [], papers: [] };
  }

  /* ───────────────────── styles ───────────────────── */
  (function css() {
    if ($('#ux-edu-css')) return;
    const st = document.createElement('style');
    st.id = 'ux-edu-css';
    st.textContent = `
.ux-edu-slot:not([hidden]){display:block}
.ux-edu-card{display:grid;gap:10px;padding:16px;border-radius:22px;border:1.5px solid color-mix(in srgb,#f59e0b 45%,var(--line,#ddd));background:linear-gradient(135deg,color-mix(in srgb,#f59e0b 10%,var(--surface,#fff)),var(--surface,#fff))}
.ux-edu-card h3{margin:0;display:flex;align-items:center;gap:8px;font-size:1.02rem;color:var(--ink,#111)}
.ux-edu-card h3 img{width:26px;height:26px;border-radius:7px;object-fit:contain;background:#fff}
.ux-edu-list{display:grid;gap:8px}
.ux-edu-row{display:flex;align-items:center;gap:12px;width:100%;padding:11px 12px;border-radius:14px;border:1px solid var(--line,#ddd);background:var(--surface,#fff);color:var(--ink,#111);text-align:left;font:inherit;cursor:pointer}
.ux-edu-row:hover{border-color:#f59e0b}
.ux-edu-row b{display:block;font-size:.95rem}
.ux-edu-row small{color:var(--ink-2,#555);font-size:.78rem}
.ux-edu-row .bar{margin-left:auto;flex:none;width:90px;height:8px;border-radius:9px;background:var(--surface-soft,rgba(0,0,0,.06));overflow:hidden}
.ux-edu-row .bar i{display:block;height:100%;background:#f59e0b;border-radius:9px}
.ux-edu-row .due{flex:none;font-size:.72rem;font-weight:800;padding:3px 8px;border-radius:99px;background:#fef3c7;color:#92400e}
.ux-edu-row .due.late{background:#fee2e2;color:#991b1b}
.ux-edu{position:fixed!important;inset:0!important;top:0!important;left:0!important;right:0!important;bottom:0!important;width:auto!important;height:auto!important;margin:0!important;z-index:2147483000!important;display:flex!important;justify-content:flex-end;background:rgba(8,12,20,.45);backdrop-filter:blur(3px);animation:uxeIn .18s ease both}
@keyframes uxeIn{from{opacity:0}}
.ux-edu-panel{width:min(760px,100%);height:100%;max-height:100%;overflow:auto;background:var(--bg,#f6f7f9);color:var(--ink,#111);box-shadow:-30px 0 60px -30px rgba(0,0,0,.5);display:flex;flex-direction:column}
.ux-edu-head{position:sticky;top:0;z-index:2;display:grid;gap:8px;padding:16px 18px;background:var(--surface,#fff);border-bottom:1px solid var(--line,#ddd)}
.ux-edu-head .top{display:flex;align-items:center;gap:10px}
.ux-edu-head h2{margin:0;font-size:1.2rem;flex:1;min-width:0}
.ux-edu-head .meta{font-size:.82rem;color:var(--ink-2,#555)}
.ux-edu-head .prog{height:8px;border-radius:9px;background:var(--surface-soft,rgba(0,0,0,.06));overflow:hidden}
.ux-edu-head .prog i{display:block;height:100%;background:linear-gradient(90deg,#f59e0b,#22c55e);transition:width .5s}
.ux-edu-x{width:38px;height:38px;border-radius:50%;border:1px solid var(--line,#ddd);background:var(--surface-soft,rgba(0,0,0,.04));color:inherit;font-size:1rem;cursor:pointer;flex:none}
.ux-edu-body{display:grid;gap:14px;padding:16px 18px 40px}
.ux-edu-note{padding:12px 14px;border-radius:14px;background:color-mix(in srgb,var(--accent) 8%,var(--surface,#fff));border:1px solid color-mix(in srgb,var(--accent) 30%,var(--line,#ddd));font-size:.9rem;line-height:1.5;white-space:pre-wrap}
.ux-edu-note.fb{background:color-mix(in srgb,#8b5cf6 8%,var(--surface,#fff));border-color:color-mix(in srgb,#8b5cf6 35%,var(--line,#ddd))}
.ux-edu-item{display:grid;gap:10px;padding:16px;border-radius:18px;background:var(--surface,#fff);border:1.5px solid var(--line,#ddd)}
.ux-edu-item.done{border-color:color-mix(in srgb,#22c55e 55%,var(--line,#ddd))}
.ux-edu-item .ih{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ux-edu-item .kind{font-size:.68rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:99px;background:var(--surface-soft,rgba(0,0,0,.06));color:var(--ink-2,#555)}
.ux-edu-item .tick{margin-left:auto;font-size:.78rem;font-weight:800;color:#16a34a}
.ux-edu-item .qtext{margin:0;font-weight:700;line-height:1.5}
.ux-edu-item .scen{font-size:.86rem;line-height:1.55;color:var(--ink-2,#444);white-space:pre-wrap;max-height:220px;overflow:auto;padding:10px 12px;border-radius:12px;background:var(--surface-soft,rgba(0,0,0,.04))}
.ux-edu-item textarea{width:100%;min-height:120px;box-sizing:border-box;padding:12px;border-radius:12px;border:1.5px solid var(--line-2,#ccc);background:var(--bg,#fff);color:var(--ink,#111);font:inherit;line-height:1.5;resize:vertical}
.ux-edu-item .acts{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.ux-edu-btn{padding:10px 16px;border-radius:12px;border:1px solid var(--line-2,#ccc);background:var(--surface,#fff);color:var(--ink,#111);font:700 .86rem/1 inherit;cursor:pointer}
.ux-edu-btn.pri{border:0;background:var(--accent);color:#fff}
.ux-edu-btn:disabled{opacity:.6;cursor:default}
.ux-edu-score{font-weight:800;font-size:.9rem;padding:6px 10px;border-radius:10px;background:#dcfce7;color:#166534}
.ux-edu-opts{display:grid;gap:8px}
.ux-edu-opt{display:flex;gap:10px;align-items:center;padding:11px 12px;border-radius:12px;border:1.5px solid var(--line,#ddd);background:var(--surface,#fff);color:inherit;text-align:left;font:inherit;cursor:pointer}
.ux-edu-opt b{flex:none;display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:var(--surface-soft,rgba(0,0,0,.06))}
.ux-edu-opt.ok{border-color:#22c55e;background:color-mix(in srgb,#22c55e 10%,var(--surface,#fff))}
.ux-edu-opt.bad{border-color:#ef4444;background:color-mix(in srgb,#ef4444 8%,var(--surface,#fff))}
.ux-edu-res{font-size:.88rem}
.ux-edu-pill{position:fixed!important;z-index:2147482900!important;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:8400;display:flex;align-items:center;gap:10px;padding:10px 16px;border:0;border-radius:999px;background:#111827;color:#fff;font:800 .86rem/1 inherit;box-shadow:0 14px 34px -12px rgba(0,0,0,.6);cursor:pointer}
.ux-edu-pill i{font-style:normal;padding:4px 8px;border-radius:99px;background:#f59e0b;color:#111}
@media(max-width:820px){.ux-edu-pill{bottom:calc(84px + env(safe-area-inset-bottom,0px))}}
`;
    document.head.appendChild(st);
  })();

  /* ───────────────────── catalogue (for teachers) ───────────────────── */
  async function catalog() {
    const d = await dataReady(12000);
    const spec = {};
    try { Object.keys(d.spec || {}).forEach(a => { spec[a] = { title: (d.spec[a] && (d.spec[a].title || d.spec[a].short)) || ((window.AIM_WORD || 'Aim') + ' ' + ((window.AIM_LABEL || {})[a] || a)), topics: ((d.spec[a] && d.spec[a].topics) || []).map(t => ({ code: t.code, name: t.name })) }; }); } catch (e) {}
    // render the guide once so its section headings exist, then list them
    let guide = [];
    try {
      if (UI.destinations && UI.destinations().some(x => x.name === 'guide')) {
        UI.go('guide');
        await sleep(1600);
        const root = $('#view-guide');
        if (root && UI.guideHeadings) {
          const seen = new Set();
          guide = UI.guideHeadings(root, true).map(h => ({ id: UI.headingId(h), title: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 140), level: h.tagName })).filter(g => g.title && g.title.length < 140 && !/locked|unlock/i.test(g.title) && !seen.has(g.id) && seen.add(g.id)).slice(0, 400);
        }
      }
    } catch (e) {}
    const short = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);
    // the specification's topics are always offered as guide sections too (deep links match them by title)
    Object.keys(spec).forEach(a => (spec[a].topics || []).forEach(t => {
      const title = (t.code ? t.code + ' ' : '') + (t.name || '');
      if (title.trim() && !guide.some(g => g.title.toLowerCase().indexOf(String(t.name || '').toLowerCase()) >= 0)) guide.push({ id: 'topic:' + (t.code || t.name), title, level: 'TOPIC', aim: a });
    }));
    return {
      unit: UNIT_PATH,
      title: unit ? unit.name : document.title,
      questions: (d.questions || []).slice(0, 2500).map(q => ({ id: q.id, aim: q.learning_aim || q.aim || '', topic: short(q.topic, 80), marks: q.marks || null, verb: q.command_verb || '', type: q.type || '', paper: q.paper_id || null, q: short(q.question, 320) })),
      quiz: (d.quiz || []).slice(0, 2000).map(q => ({ id: q.id, aim: q.learning_aim || '', topic: short(q.topic, 80), q: short(q.question, 260), choices: (q.choices || q.options || []).map(c => short(c, 140)), correct: q.correct_index != null ? q.correct_index : q.answer })),
      papers: (d.papers || []).map(p => ({ id: p.id, title: p.title, series: p.series, source: p.source, total: p.total })),
      guide, spec,
      aimWord: window.AIM_WORD || null, aimLabels: window.AIM_LABEL || null
    };
  }
  /* ───────────────────── content audit (owner's Quality dashboard) ─────────────────────
     ?ra10catalog=1&audit=1 → posts { type:'ra10:audit', unit, audit } with measurable facts about this
     unit's content. The dashboard turns them into the Content and Exam-style scores. */
  const hasText = (v) => {
    if (v == null) return false;
    if (typeof v === 'string') return v.trim().length > 2;
    if (Array.isArray(v)) return v.some(hasText);
    if (typeof v === 'object') return Object.keys(v).some(k => k !== 'instruction' && hasText(v[k]));
    return false;
  };
  async function audit() {
    const t0 = Date.now();
    let d = await dataReady(15000);
    const dests = UI.destinations ? UI.destinations().map(x => x.name) : [];
    // papers are lazy-loaded in some apps (AQA 7132 keeps them in "pastpapers"): open the library so the data arrives
    for (const v of ['pastpapers', 'papers']) {
      if ((d.papers || []).length || dests.indexOf(v) < 0) continue;
      try { UI.go(v); } catch (e) {}
      for (let i = 0; i < 16 && !(UI.appData().papers || []).length; i++) await sleep(500);
      d = UI.appData();
    }
    // older apps keep their bank inside app.js and load JSON files (BTEC Level 2 IT): read the same files
    if (!(d.questions || []).length) {
      const getJson = async (f) => { try { const r = await fetch(f, { cache: 'no-store' }); return r.ok ? JSON.parse((await r.text()).replace(/^﻿/, '')) : null; } catch (e) { return null; } };
      const qs = [];
      for (const a of ['A', 'B', 'C', 'D', 'E']) { const r = await getJson('data/aim_' + a + '.json'); if (Array.isArray(r)) qs.push(...r.map(q => Object.assign({ learning_aim: a }, q))); }
      if (qs.length) {
        const quiz = await getJson('data/quiz.json'), flash = await getJson('data/flashcards.json');
        d = Object.assign({}, d, { questions: qs, quiz: d.quiz.length ? d.quiz : (Array.isArray(quiz) ? quiz : []), flash: d.flash.length ? d.flash : (Array.isArray(flash) ? flash : []) });
      }
    }
    const Q = d.questions || [], QZ = d.quiz || [], FL = d.flash || [], PP = d.papers || [];
    const marksOf = (q) => Number(q.marks) || 0;
    const msOf = (q) => q.mark_scheme || q.markScheme || q.ms || q.guidance || (Array.isArray(q.answers) && q.answers.some(a => a && a.correct) ? 'mcq' : null);
    const tariffs = {};
    Q.forEach(q => { const m = marksOf(q); if (m) tariffs[m] = (tariffs[m] || 0) + 1; });
    const verbs = {};
    Q.forEach(q => { const v = String(q.command_verb || '').trim().toLowerCase(); if (v) verbs[v] = (verbs[v] || 0) + 1; });
    // specification coverage: share of top-level spec topics with at least one practice item (bank or quiz),
    // matched by topic code ("A1 …", "3.1.2 …") or by the topic's name
    const topics = [];
    // numeric codes: the shallowest depth used by this spec counts as top level (AQA Business "3.1" vs A-level Psychology "4.1.1.1")
    let minDots = 1;
    try { const ds = []; Object.keys(d.spec || {}).forEach(a => ((d.spec[a] && d.spec[a].topics) || []).forEach(t => { const c = String((t && t.code) || '').trim(); if (c && !/^[A-Z]/i.test(c)) ds.push((c.match(/\./g) || []).length); })); if (ds.length) minDots = Math.max(1, Math.min.apply(null, ds)); } catch (e) {}
    const topLevel = (code) => { const c = String(code || '').trim(), dots = (c.match(/\./g) || []).length; return c && (/^[A-Z]/i.test(c) ? dots === 0 : dots <= minDots); };
    try { Object.keys(d.spec || {}).forEach(a => ((d.spec[a] && d.spec[a].topics) || []).forEach(t => { if (t && topLevel(t.code)) topics.push({ code: String(t.code).toUpperCase(), name: String(t.name || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim() }); })); } catch (e) {}
    const tags = Q.concat(QZ).map(q => String(q.topic || q.spec_ref || '').toUpperCase());
    const tagsLow = tags.map(t => t.toLowerCase().replace(/[^a-z0-9 ]+/g, ' '));
    const isCovered = (t) => tags.some(x => x === t.code || x.indexOf(t.code + ' ') === 0 || x.indexOf(t.code + '.') === 0 || x.indexOf(t.code + ':') === 0)
      || (t.name.length > 5 && tagsLow.some(x => x.indexOf(t.name) >= 0 || (x.length > 5 && t.name.indexOf(x.trim()) >= 0)));
    const covered = topics.filter(isCovered).map(t => t.code);
    // papers
    const real = PP.filter(p => p.source && p.source !== 'ra10');
    const ra10 = PP.filter(p => p.source === 'ra10');
    const items = [].concat(...PP.map(p => p.items || []));
    const itemHasMs = (it) => hasText(it.ms && (it.ms.body || it.ms.points || it.ms.levels || it.ms.answer || it.ms.for || it.ms.raw)) || hasText(it.ms);
    // revision guide
    let guide = { available: dests.indexOf('guide') >= 0 || dests.indexOf('revise') >= 0, words: 0, headings: 0, diagrams: 0, tables: 0, images: 0 };
    if (guide.available) {
      try {
        UI.go(dests.indexOf('guide') >= 0 ? 'guide' : 'revise');
        await sleep(2200);
        // Shared guide engine: measure the guide data itself (every aim, even ones locked for this viewer).
        // Other apps: measure the rendered guide; textContent includes collapsed/hidden sections.
        let root = null;
        if (window.BIZ_GUIDE_DATA && BIZ_GUIDE_DATA.topics) {
          const G = BIZ_GUIDE_DATA, call = (f) => { try { return typeof f === 'function' ? f() : (f || ''); } catch (e) { return ''; } };
          let html = call(G.setTask);
          Object.keys(G.topics).forEach(a => (G.topics[a] || []).forEach(t => { html += '<h3>' + (t.name || '') + '</h3>' + call(t.html); }));
          root = document.createElement('div');
          root.innerHTML = html;
        } else {
          root = $('#view-guide') || $('section.view.active[id*="guide"]') || $('section.view.active');
          if (root) $$('details', root).forEach(x => { x.open = true; });
        }
        if (root) {
          const skip = (el) => el.closest && el.closest('nav, .guide-sidebar, .guide-toc, .ux-crumb, .ux-hub, button');
          const words = []; const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          for (let n = walk.nextNode(); n; n = walk.nextNode()) if (!(n.parentElement && skip(n.parentElement))) words.push(n.nodeValue);
          guide.words = words.join(' ').split(/\s+/).filter(w => /[a-z]/i.test(w)).length;
          guide.headings = $$('h2, h3', root).filter(h => !skip(h) && h.textContent.trim().length > 2).length;
          guide.diagrams = $$('svg', root).filter(s => { const vb = (s.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number); const w = vb.length === 4 ? vb[2] : Number(s.getAttribute('width')) || 0; return w >= 120 || (s.isConnected && s.getBoundingClientRect().width >= 120); }).length;
          guide.tables = $$('table', root).length;
          guide.images = $$('img', root).filter(i => !skip(i) && ((i.naturalWidth || Number(i.getAttribute('width')) || i.width) >= 120)).length;
          guide.source = window.BIZ_GUIDE_DATA ? 'data' : 'page';
        }
      } catch (e) {}
    }
    return {
      v: 1, unit: UNIT_PATH, title: unit ? unit.name : document.title, at: new Date().toISOString(), ms: Date.now() - t0,
      questions: {
        n: Q.length,
        with_verb: Q.filter(q => String(q.command_verb || '').trim()).length,
        with_marks: Q.filter(q => marksOf(q) > 0).length,
        with_ms: Q.filter(q => hasText(msOf(q))).length,
        extended: Q.filter(q => marksOf(q) >= 6).length,
        levels: Q.filter(q => /levels|extended/i.test(String(q.type || '')) || hasText(q.mark_scheme && (q.mark_scheme.level_descriptors || q.mark_scheme.levels))).length,
        with_context: Q.filter(q => hasText(q.scenario) || hasText(q.source_material) || hasText(q.context)).length,
        tariffs, verbs
      },
      quiz: { n: QZ.length, with_why: QZ.filter(q => hasText(q.explanation || q.why)).length, four_plus: QZ.filter(q => ((q.choices || q.options || q.answers || []).length) >= 4).length },
      flash: { n: FL.length },
      papers: { n: PP.length, real: real.length, ra10: ra10.length, items: items.length, items_ms: items.filter(itemHasMs).length, marks: PP.reduce((s, p) => s + (Number(p.total) || 0), 0) },
      spec: { topics: topics.length, covered: covered.length, missing: topics.filter(t => covered.indexOf(t.code) < 0).map(t => t.code).slice(0, 40) },
      guide, views: dests
    };
  }

  if (params.has('ra10catalog') && params.has('audit')) {
    audit().then(a => { try { window.parent.postMessage({ type: 'ra10:audit', unit: UNIT_PATH, audit: a }, location.origin); } catch (e) {} },
      e => { try { window.parent.postMessage({ type: 'ra10:audit', unit: UNIT_PATH, error: String(e && e.message || e) }, location.origin); } catch (x) {} });
  } else if (params.has('ra10catalog')) {
    const full = String(params.get('full') || '').split(',').map(x => x.trim()).filter(Boolean).slice(0, 6);
    if (full.length) {
      // Study Hub: the complete question objects (mark scheme, spec code, scenario…) for these ids,
      // so the real AI Examiner can mark them exactly as the unit app does.
      dataReady(12000).then(d => {
        const want = new Set(full);
        const qs = (d.questions || []).filter(q => want.has(String(q.id))).map(q => { try { return JSON.parse(JSON.stringify(q)); } catch (e) { return null; } }).filter(Boolean);
        try { window.parent.postMessage({ type: 'ra10:questions', unit: UNIT_PATH, questions: qs }, location.origin); } catch (e) {}
      });
    } else {
      catalog().then(c => { try { window.parent.postMessage({ type: 'ra10:catalog', catalog: c }, location.origin); } catch (e) {} });
    }
  }

  /* ───────────────────── assignments ───────────────────── */
  let ctxCache = null;
  async function context() {
    if (ctxCache) return ctxCache;
    if (!(await ready(15000))) return null;
    const { data, error } = await client().rpc('edu_my_context');
    if (error) return null;
    ctxCache = data;
    return data;
  }
  function itemsForUnit(a) { return (a.item_list || []).filter(it => !it.unit || it.unit === UNIT_PATH); }
  function dueText(d) {
    if (!d) return { t: 'No due date', late: false };
    const dt = new Date(d), days = Math.ceil((dt - Date.now()) / 86400000);
    return { t: days < 0 ? 'Overdue' : days === 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : 'Due ' + dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), late: days < 0 };
  }

  async function paintDashboard() {
    const slot = $('.ux-edu-slot');
    if (!slot) return;
    const c = await context();
    if (!c || !c.assignments) return;
    const list = c.assignments.filter(a => !a.mine && itemsForUnit(a).length);
    if (!list.length) return;
    const logo = c.school && c.school.logo_url;
    slot.innerHTML = `<div class="ux-edu-card"><h3>${logo ? `<img src="${esc(logo)}" alt="">` : '📋'} Work set by your teacher for this unit</h3><div class="ux-edu-list">${list.slice(0, 6).map(a => {
      const n = a.items || 1, done = Math.min(n, a.done || 0), due = dueText(a.due_at);
      return `<button type="button" class="ux-edu-row" data-asg="${esc(a.id)}"><span><b>${esc(a.title)}</b><small>${esc(a.class_name)} · ${done}/${n} done</small></span><span class="due${due.late && done < n ? ' late' : ''}">${esc(done >= n ? 'Complete ✓' : due.t)}</span><span class="bar"><i style="width:${Math.round(done / n * 100)}%"></i></span></button>`;
    }).join('')}</div></div>`;
    slot.hidden = false;
    slot.addEventListener('click', (e) => { const b = e.target.closest('[data-asg]'); if (b) openAssignment(b.dataset.asg); });
  }

  /* ───────────────────── assignment workspace ───────────────────── */
  let panel = null, pill = null, current = null;
  const TYPE = { question: 'Exam question', mcq: 'Multiple choice', guide: 'Revision guide', paper: 'Exam paper', other: 'Another unit', studyhub: 'Study Hub lesson' };
  const IC = {
    question: '<path d="M4 20h4L18.5 9.5a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    mcq: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    guide: '<path d="M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
    paper: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/>',
    other: '<path d="M14 3h7v7M21 3l-9 9M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>',
    min: '<path d="M5 12h14"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', prev: '<path d="M15 6l-6 6 6 6"/>', next: '<path d="M9 6l6 6-6 6"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>', check: '<path d="M20 6 9 17l-5-5"/>', list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'
  };
  const ic = (k, s) => `<svg viewBox="0 0 24 24" width="${s || 18}" height="${s || 18}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k] || ''}</svg>`;

  (function wsCss() {
    if ($('#ux-ws-css')) return;
    const st = document.createElement('style');
    st.id = 'ux-ws-css';
    st.textContent = `
.ux-ws{--ws-acc:var(--accent,#2563eb);position:fixed!important;inset:0!important;top:0!important;left:0!important;right:0!important;bottom:0!important;margin:0!important;z-index:2147483000!important;display:flex!important;flex-direction:column;background:var(--bg,#f5f6f9);color:var(--ink,#12151c);animation:uxwsIn .22s cubic-bezier(.2,.8,.2,1) both}
.ux-ws.min{display:none!important}
html[data-theme="dark"] .ux-ws{--ws-acc:color-mix(in srgb,var(--accent,#2563eb) 45%,#ffffff)}
html[data-theme="dark"] .ws-meta .ws-type,html[data-theme="dark"] .ws-note{background:color-mix(in srgb,var(--ws-acc) 12%,var(--surface,#151922))}
html[data-theme="dark"] .ws-chip.due{background:#3a2a10;color:#fcd34d}html[data-theme="dark"] .ws-chip.late{background:#3b1515;color:#fca5a5}html[data-theme="dark"] .ws-chip.ok,html[data-theme="dark"] .ws-score{background:#12321f;color:#86efac}
@keyframes uxwsIn{from{opacity:0;transform:translateY(10px)}}
.ux-ws *{box-sizing:border-box}
.ws-top{flex:none;display:flex;align-items:center;gap:16px;padding:12px 20px;background:var(--surface,#fff);border-bottom:1px solid var(--line,#e3e6ee);box-shadow:0 6px 20px -18px rgba(0,0,0,.5)}
.ws-badge{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:color-mix(in srgb,var(--cc,var(--accent,#2563eb)) 14%,var(--surface,#fff));color:var(--cc,var(--accent,#2563eb))}
.ws-title{min-width:0;flex:1}
.ws-title h2{margin:0;font-size:1.05rem;font-weight:800;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink,#12151c)}
.ws-title p{margin:2px 0 0;font-size:.8rem;color:var(--ink-2,#5b6270);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.ws-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:99px;font-size:.72rem;font-weight:800;background:color-mix(in srgb,var(--ink,#12151c) 7%,transparent);color:var(--ink-2,#5b6270)}
.ws-chip.due{background:#fef3c7;color:#92400e}.ws-chip.late{background:#fee2e2;color:#991b1b}.ws-chip.ok{background:#dcfce7;color:#166534}
.ws-prog{flex:none;width:220px;display:grid;gap:5px}
.ws-prog span{display:flex;justify-content:space-between;font-size:.76rem;font-weight:700;color:var(--ink-2,#5b6270)}
.ws-prog i{display:block;height:8px;border-radius:9px;background:color-mix(in srgb,var(--ink,#12151c) 7%,transparent);overflow:hidden}
.ws-prog i em{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,var(--accent,#2563eb),#22c55e);transition:width .5s ease}
.ws-tb{flex:none;display:grid;place-items:center;width:38px;height:38px;border-radius:11px;border:1px solid var(--line,#e3e6ee);background:var(--surface,#fff);color:var(--ink-2,#5b6270);cursor:pointer}
.ws-tb:hover{border-color:var(--ws-acc);color:var(--ink,#12151c)}
.ws-tb.navt{display:none}
.ws-body{flex:1;min-height:0;display:grid;grid-template-columns:290px minmax(0,1fr)}
.ws-nav{min-height:0;overflow:auto;padding:16px 12px;border-right:1px solid var(--line,#e3e6ee);background:color-mix(in srgb,var(--surface,#fff) 60%,var(--bg,#f5f6f9))}
.ws-nav h4{margin:14px 8px 6px;font-size:.68rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3,#8b92a3)}
.ws-nav h4:first-child{margin-top:2px}
.ws-task{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:10px;align-items:center;width:100%;padding:9px 10px;border:0;border-radius:12px;background:transparent;color:inherit;text-align:left;font:inherit;cursor:pointer}
.ws-task:hover{background:color-mix(in srgb,var(--ink,#12151c) 7%,transparent)}
.ws-task.on{background:var(--surface,#fff);box-shadow:0 0 0 1.5px var(--ws-acc),0 8px 18px -14px rgba(0,0,0,.4)}
.ws-num{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:1.5px solid var(--line-2,#cfd4df);font-size:.74rem;font-weight:800;color:var(--ink-2,#5b6270);background:var(--surface,#fff)}
.ws-task.done .ws-num{border-color:#22c55e;background:#22c55e;color:#fff}
.ws-task.draft .ws-num{border-color:#f59e0b;color:#b45309}
.ws-task.on .ws-num{border-color:var(--ws-acc);color:var(--ws-acc)}
.ws-task.on.done .ws-num{background:#22c55e;color:#fff;border-color:#22c55e}
.ws-task b{display:block;font-size:.84rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ws-task small{display:block;font-size:.72rem;color:var(--ink-2,#5b6270)}
.ws-task em{font-style:normal;font-size:.72rem;font-weight:800;color:var(--ink-3,#8b92a3)}
.ws-task.done em{color:#16a34a}
.ws-main{min-height:0;overflow:auto;padding:28px 24px 80px}
.ws-inner{max-width:820px;margin:0 auto;display:grid;gap:16px}
.ws-note{display:grid;gap:6px;padding:14px 16px;border-radius:16px;background:color-mix(in srgb,var(--accent,#2563eb) 7%,var(--surface,#fff));border:1px solid color-mix(in srgb,var(--accent,#2563eb) 25%,var(--line,#e3e6ee));font-size:.9rem;line-height:1.55}
.ws-note b{font-size:.74rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ws-acc)}
.ws-note.fb{background:color-mix(in srgb,#8b5cf6 7%,var(--surface,#fff));border-color:color-mix(in srgb,#8b5cf6 30%,var(--line,#e3e6ee))}
.ws-note.fb b{color:#7c3aed}
.ws-note p{margin:0;white-space:pre-wrap}
.ws-card{display:grid;gap:16px;padding:26px;border-radius:22px;background:var(--surface,#fff);border:1px solid var(--line,#e3e6ee);box-shadow:0 24px 50px -40px rgba(0,0,0,.45)}
.ws-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:.78rem;font-weight:700;color:var(--ink-2,#5b6270)}
.ws-meta .ws-type{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:99px;background:color-mix(in srgb,var(--accent,#2563eb) 10%,var(--surface,#fff));color:var(--ws-acc);font-weight:800}
.ws-meta .ws-marks{margin-left:auto;padding:4px 10px;border-radius:99px;background:color-mix(in srgb,var(--ink,#12151c) 7%,transparent);font-weight:800;color:var(--ink,#12151c)}
.ws-group{margin:-4px 0 0;font-size:.8rem;color:var(--ink-3,#8b92a3);font-weight:700}
.ws-scen{border-left:3px solid var(--line-2,#cfd4df);padding:2px 0 2px 14px;color:var(--ink-2,#4b5263);font-size:.92rem;line-height:1.6;white-space:pre-wrap;max-height:260px;overflow:auto}
.ws-q{margin:0;font-size:1.18rem;line-height:1.5;font-weight:700;letter-spacing:-.005em;color:var(--ink,#12151c)}
.ws-ans{display:grid;gap:6px}
.ws-ans textarea{width:100%;min-height:190px;padding:14px 16px;border-radius:14px;border:1.5px solid var(--line-2,#cfd4df);background:var(--bg,#fafbfc);color:var(--ink,#12151c);font:inherit;font-size:.98rem;line-height:1.6;resize:vertical;outline:none;transition:border-color .15s,box-shadow .15s}
.ws-ans textarea:focus{border-color:var(--ws-acc);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent,#2563eb) 14%,transparent);background:var(--surface,#fff)}
.ws-ans .row{display:flex;justify-content:space-between;font-size:.76rem;color:var(--ink-3,#8b92a3)}
.ws-acts{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.ws-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 18px;border-radius:13px;border:1px solid var(--line-2,#cfd4df);background:var(--surface,#fff);color:var(--ink,#12151c);font:700 .9rem/1 inherit;cursor:pointer;white-space:nowrap;transition:transform .12s,filter .12s,border-color .12s}
.ws-btn:hover{border-color:var(--ws-acc)}
.ws-btn:active{transform:scale(.98)}
.ws-btn.pri{border:0;background:var(--accent,#2563eb);color:#fff;box-shadow:0 10px 22px -14px var(--accent,#2563eb)}
.ws-btn.pri:hover{filter:brightness(1.07)}
.ws-btn.ai{border:0;color:#fff;background:linear-gradient(135deg,#7c3aed,var(--accent,#2563eb))}
.ws-btn:disabled{opacity:.55;cursor:default}
.ws-btn.ghost{border-color:transparent;background:transparent}
.ws-score{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:12px;font-weight:800;font-size:.88rem;background:#dcfce7;color:#166534}
.ws-score.mid{background:#fef3c7;color:#92400e}.ws-score.low{background:#fee2e2;color:#991b1b}
.ws-res:empty{display:none}
.ws-res{padding:4px;border-radius:16px;background:var(--bg,#f6f7f9)}
.ws-opts{display:grid;gap:10px}
.ws-opt{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:12px;align-items:center;padding:14px 16px;border-radius:14px;border:1.5px solid var(--line,#e3e6ee);background:var(--surface,#fff);color:inherit;text-align:left;font:inherit;font-size:.96rem;cursor:pointer;transition:border-color .12s,background .12s}
.ws-opt:hover:not(:disabled){border-color:var(--ws-acc)}
.ws-opt b{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:color-mix(in srgb,var(--ink,#12151c) 7%,transparent);font-weight:800}
.ws-opt.ok{border-color:#22c55e;background:color-mix(in srgb,#22c55e 9%,var(--surface,#fff))}.ws-opt.ok b{background:#22c55e;color:#fff}
.ws-opt.bad{border-color:#ef4444;background:color-mix(in srgb,#ef4444 7%,var(--surface,#fff))}.ws-opt.bad b{background:#ef4444;color:#fff}
.ws-opt:disabled{cursor:default}
.ws-guide{padding:20px 22px;border-radius:16px;border:1px solid var(--line,#e3e6ee);background:var(--bg,#fafbfc);max-height:62vh;overflow:auto;font-size:.95rem;line-height:1.65;color:var(--ink,#12151c)}
.ws-guide.empty{max-height:none}
.ws-guide .ws-hl{background:color-mix(in srgb,#facc15 26%,transparent)!important;box-shadow:inset 3px 0 0 #eab308;border-radius:4px}
.ws-guide-note{margin:0 0 12px!important;padding:10px 12px;border-radius:12px;background:color-mix(in srgb,#facc15 16%,var(--surface,#fff));font-size:.85rem;font-weight:700}
.ws-guide .guide-topic{border:0!important;box-shadow:none!important;background:transparent!important;margin:0!important;padding:0!important}
.ws-guide .guide-topic-hd{cursor:default!important;pointer-events:none;padding:0 0 10px!important;margin:0 0 10px!important;border-bottom:1px solid var(--line,#e3e6ee);font-size:1.05rem;font-weight:800}
.ws-guide .guide-topic-body{display:block!important;max-height:none!important;padding:0!important}
.ws-guide .guide-aim-hd{pointer-events:none}
.ws-guide img,.ws-guide svg,.ws-guide figure,.ws-guide table{max-width:100%}
.ws-guide table{border-collapse:collapse;display:block;overflow-x:auto}
.ws-guide th,.ws-guide td{border:1px solid var(--line,#e3e6ee);padding:6px 9px;text-align:left;vertical-align:top}
.ws-guide h2,.ws-guide h3,.ws-guide h4{margin:14px 0 6px;line-height:1.3}
.ws-guide ul,.ws-guide ol{padding-left:22px}
.ws-explain{padding:14px 16px;border-radius:14px;background:color-mix(in srgb,var(--ink,#12151c) 7%,transparent);font-size:.92rem;line-height:1.55}
.ws-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;padding-top:6px;border-top:1px solid var(--line,#e3e6ee)}
.ws-saved{font-size:.78rem;color:var(--ink-3,#8b92a3)}
.ws-done{display:grid;justify-items:center;gap:12px;text-align:center;padding:40px 26px}
.ws-done .big{display:grid;place-items:center;width:76px;height:76px;border-radius:50%;background:#22c55e;color:#fff;box-shadow:0 18px 36px -16px #22c55e}
.ws-done h2{margin:0;font-size:1.6rem}
.ws-done table{width:100%;max-width:560px;border-collapse:collapse;font-size:.9rem;text-align:left}
.ws-done td{padding:9px 10px;border-bottom:1px solid var(--line,#e3e6ee)}
.ws-done td:last-child{text-align:right;font-weight:800}
.ux-edu-pill{position:fixed!important;left:50%!important;bottom:calc(18px + env(safe-area-inset-bottom,0px))!important;transform:translateX(-50%);z-index:2147482900!important;display:flex;align-items:center;gap:12px;padding:8px 8px 8px 16px;border:0;border-radius:999px;background:#111827;color:#fff;font:700 .86rem/1 inherit;box-shadow:0 16px 36px -12px rgba(0,0,0,.6);cursor:pointer}
.ux-edu-pill .bar{width:70px;height:6px;border-radius:9px;background:rgba(255,255,255,.2);overflow:hidden}
.ux-edu-pill .bar i{display:block;height:100%;padding:0;border-radius:9px;background:#22c55e}
.ux-edu-pill b{padding:7px 12px;border-radius:99px;background:#fff;color:#111827;font-size:.8rem}
@media(max-width:860px){
  .ws-top{padding:10px 12px;gap:10px}
  .ws-prog{display:none}
  .ws-badge{display:none}
  .ws-tb.navt{display:grid}
  .ws-body{grid-template-columns:1fr}
  .ws-nav{position:absolute;inset:60px 0 0 0;z-index:3;display:none;background:var(--surface,#fff)}
  .ux-ws.navopen .ws-nav{display:block}
  .ws-main{padding:16px 12px 90px}
  .ws-card{padding:18px;border-radius:18px}
  .ws-q{font-size:1.06rem}
  .ws-foot .ws-btn{flex:1}
  .ux-edu-pill{bottom:calc(84px + env(safe-area-inset-bottom,0px))!important}
}
@media (prefers-reduced-motion:reduce){.ux-ws{animation:none}}
`;
    document.head.appendChild(st);
  })();

  function mount(el) {
    document.documentElement.appendChild(el);
    try { el.style.fontFamily = getComputedStyle(document.body).fontFamily; } catch (e) {}
  }
  // A simple full-screen "loading / problem" state before the assignment is ready.
  function shell(html) {
    closePill();
    if (panel) panel.remove();
    panel = document.createElement('div');
    panel.className = 'ux-ws';
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Assignment');
    panel.innerHTML = `<header class="ws-top"><span class="ws-badge">${ic('list', 20)}</span><div class="ws-title"><h2>Your assignment</h2></div><button type="button" class="ws-tb" data-close title="Close" aria-label="Close">${ic('x')}</button></header>
      <div class="ws-main"><div class="ws-inner">${html}</div></div>`;
    panel.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    mount(panel);
    document.documentElement.classList.add('ux-lock');
  }
  function problem(msg) { shell(`<div class="ws-card"><p class="ws-q" style="font-size:1rem">${esc(msg)}</p><div class="ws-acts"><button type="button" class="ws-btn" data-close>Close</button></div></div>`); }

  async function openAssignment(id) {
    shell('<div class="ws-card"><p class="ws-q" style="font-size:1rem">Opening your assignment…</p></div>');
    if (!(await ready(20000))) { problem('Please sign in to RA10 to open this assignment, then press Start again.'); if (UI.requireSignIn) UI.requireSignIn('open your assignment'); return; }
    const sb = client();
    const [{ data: a, error }, { data: subs }, { data: comments }] = await Promise.all([
      sb.from('edu_assignments').select('*, edu_classes(name, color)').eq('id', id).maybeSingle(),
      sb.from('edu_submissions').select('*').eq('assignment_id', id).eq('user_id', R().getSession().user.id),
      sb.from('edu_comments').select('*').eq('assignment_id', id).eq('student_id', R().getSession().user.id).order('created_at')
    ]);
    if (error || !a) { problem(error ? 'That assignment could not be opened (' + error.message + '). Ask your teacher to check you have joined the class.' : 'That assignment could not be found. Your teacher may have deleted it, or you have not joined the class yet.'); return; }
    if (!(a.items || []).length) { problem('This assignment has no tasks yet. Ask your teacher to add some.'); return; }
    const d = await questionsReady(10000);
    current = { a, subs: {}, d, comments: comments || [], drafts: {}, idx: 0, saveT: {}, savedAt: {} };
    (subs || []).forEach(s => { current.subs[s.item_id] = s; });
    current.tasks = expandItems();
    // start at the first task that isn't finished
    const first = current.tasks.findIndex(t => !(current.subs[t.id] || {}).done);
    current.idx = first < 0 ? current.tasks.length : first;
    if (UI.track) UI.track('assignment', { ref: a.id, title: a.title, meta: { action: 'open' } });
    render();
  }

  // Assignment items → a flat list of tasks (topic practice expands into its questions).
  function expandItems() {
    const { a, d } = current;
    const out = [];
    (a.item_list || a.items || []).forEach(it => {
      if (it.type === 'studyhub') { out.push(Object.assign({ group: 'Study Hub' }, it)); return; }
      if (it.unit && it.unit !== UNIT_PATH) { out.push(Object.assign({ other: true, group: 'Other units' }, it, { type: 'other' })); return; }
      if (it.type === 'topic') {
        const want = String(it.topic || '').toLowerCase();
        let pool = (d.questions || []).filter(q => (it.aim ? String(q.learning_aim || '').toUpperCase().indexOf(String(it.aim).toUpperCase()) === 0 : true) && (!want || String(q.topic || '').toLowerCase().indexOf(want) >= 0 || String(q.question || '').toLowerCase().indexOf(want) >= 0));
        if (!pool.length && it.aim) pool = (d.questions || []).filter(q => String(q.learning_aim || '').toUpperCase().indexOf(String(it.aim).toUpperCase()) === 0);
        let seed = 0; String(a.id + it.id).split('').forEach(ch => { seed = (seed * 31 + ch.charCodeAt(0)) >>> 0; });   // same questions every time for this assignment
        const picked = pool.slice().sort((x, y) => ((seed ^ hash(x.id)) % 997) - ((seed ^ hash(y.id)) % 997)).slice(0, Math.max(1, Math.min(20, it.count || 5)));
        const group = (it.title || ('Practise: ' + (it.topic || ((window.AIM_WORD || 'Aim') + ' ' + ((window.AIM_LABEL || {})[it.aim] || it.aim))))).replace(/^\d+\s+questions:\s*/i, '');
        picked.forEach(q => out.push({ type: 'question', id: it.id + ':' + q.id, ref: q.id, q, group }));
        return;
      }
      if (it.type === 'question') { out.push(Object.assign({ group: 'Exam questions' }, it, { q: (d.questions || []).find(q => String(q.id) === String(it.ref)) })); return; }
      if (it.type === 'mcq') { out.push(Object.assign({ group: 'Multiple choice' }, it, { m: (d.quiz || []).find(q => String(q.id) === String(it.ref)) })); return; }
      out.push(Object.assign({ group: it.type === 'guide' ? 'Reading' : 'Exam papers' }, it));
    });
    return out;
  }
  function hash(s) { let h = 0; String(s).split('').forEach(c => { h = (h * 33 + c.charCodeAt(0)) >>> 0; }); return h; }
  function progress() {
    const ts = current.tasks || [];
    const done = ts.filter(x => current.subs[x.id] && current.subs[x.id].done).length;
    return { done, total: ts.length };
  }
  function marksOf(t) { return Number((t.q && t.q.marks) || t.marks || (t.type === 'mcq' ? 1 : 0)) || 0; }
  function short(t) {
    const s = (t.q && t.q.question) || (t.m && t.m.question) || t.title || '';
    return String(s).replace(/\s+/g, ' ').trim();
  }
  function scoreClass(s, m) { const p = m ? s / m : 0; return p >= .7 ? '' : p >= .4 ? ' mid' : ' low'; }

  /* ── the workspace ── */
  function render() {
    closePill();
    if (panel) panel.remove();
    const { a } = current;
    const due = dueText(a.due_at);
    const cc = (a.edu_classes && a.edu_classes.color) || '';
    panel = document.createElement('div');
    panel.className = 'ux-ws';
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Assignment: ' + a.title);
    if (cc) panel.style.setProperty('--cc', cc);
    panel.innerHTML = `
      <header class="ws-top">
        <button type="button" class="ws-tb navt" data-navt title="All tasks" aria-label="All tasks">${ic('list')}</button>
        <span class="ws-badge">${ic('list', 20)}</span>
        <div class="ws-title"><h2>${esc(a.title)}</h2><p><span>${esc((a.edu_classes && a.edu_classes.name) || 'Your class')}</span><span class="ws-chip ${due.late ? 'late' : 'due'}" data-duechip>${esc(due.t)}</span></p></div>
        <div class="ws-prog" aria-live="polite"><span><b data-prog-t></b><b data-prog-p></b></span><i><em data-prog></em></i></div>
        <button type="button" class="ws-tb" data-min title="Minimise — keep working on the unit" aria-label="Minimise">${ic('min')}</button>
        <button type="button" class="ws-tb" data-close title="Close (your answers are saved)" aria-label="Close">${ic('x')}</button>
      </header>
      <div class="ws-body"><nav class="ws-nav" aria-label="Tasks" data-nav></nav><main class="ws-main" data-main><div class="ws-inner" data-inner></div></main></div>`;
    mount(panel);
    document.documentElement.classList.add('ux-lock');
    panel.addEventListener('click', onClick);
    panel.addEventListener('input', onInput);
    panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') minimise(); });
    paintNav(); paintTask(); paintProgress();
  }

  function paintNav() {
    const nav = $('[data-nav]', panel);
    let last = null, html = '';
    current.tasks.forEach((t, i) => {
      if (t.group !== last) { html += `<h4>${esc(t.group)}</h4>`; last = t.group; }
      const s = current.subs[t.id] || {};
      const state = s.done ? ' done' : (current.drafts[t.id] || s.answer) ? ' draft' : '';
      const sc = s.done && s.max_score ? `${s.score}/${s.max_score}` : s.done ? '✓' : (marksOf(t) ? marksOf(t) + 'm' : '');
      html += `<button type="button" class="ws-task${state}${i === current.idx ? ' on' : ''}" data-go="${i}"><span class="ws-num">${s.done ? ic('check', 14) : i + 1}</span><span><b>${esc(short(t))}</b><small>${esc(TYPE[t.type] || 'Task')}</small></span><em>${esc(sc)}</em></button>`;
    });
    html += `<h4>Finish</h4><button type="button" class="ws-task${current.idx >= current.tasks.length ? ' on' : ''}" data-go="${current.tasks.length}"><span class="ws-num">${ic('check', 14)}</span><span><b>Review &amp; finish</b><small>Your results</small></span><em></em></button>`;
    nav.innerHTML = html;
    const on = $('.ws-task.on', nav); if (on) on.scrollIntoView({ block: 'nearest' });
  }

  function paintProgress() {
    if (!panel) return;
    const pr = progress();
    const pct = pr.total ? Math.round(pr.done / pr.total * 100) : 0;
    const bar = $('[data-prog]', panel), t = $('[data-prog-t]', panel), p = $('[data-prog-p]', panel);
    if (bar) bar.style.width = pct + '%';
    if (t) t.textContent = pr.done + ' of ' + pr.total + ' complete';
    if (p) p.textContent = pct + '%';
    if (pr.total && pr.done === pr.total) { const c = $('[data-duechip]', panel); if (c) { c.className = 'ws-chip ok'; c.textContent = 'Complete ✓'; } }
    paintPill();
  }

  function notes() {
    const { a } = current;
    if (current.idx !== 0 && current.idx < current.tasks.length) return '';
    return (a.instructions ? `<div class="ws-note"><b>From your teacher</b><p>${esc(a.instructions)}</p></div>` : '') +
      current.comments.map(c => `<div class="ws-note fb"><b>${esc(c.author_name || 'Your teacher')}</b><p>${esc(c.body)}</p></div>`).join('');
  }

  function paintTask() {
    const inner = $('[data-inner]', panel);
    const n = current.tasks.length;
    if (current.idx >= n) { inner.innerHTML = notes() + finishHtml(); $('[data-main]', panel).scrollTop = 0; return; }
    const t = current.tasks[current.idx];
    const s = current.subs[t.id] || {};
    const m = marksOf(t);
    const head = `<div class="ws-meta"><span class="ws-type">${ic(t.type === 'question' ? 'question' : t.type === 'mcq' ? 'mcq' : t.type === 'guide' ? 'guide' : t.type === 'paper' ? 'paper' : 'other', 15)}${esc(t.type === 'question' && t.q && t.q.command_verb ? t.q.command_verb + ' question' : TYPE[t.type] || 'Task')}</span><span>Task ${current.idx + 1} of ${n}</span>${m ? `<span class="ws-marks">${m} mark${m === 1 ? '' : 's'}</span>` : ''}</div>`;
    const foot = `<div class="ws-foot"><button type="button" class="ws-btn ghost" data-prev ${current.idx === 0 ? 'disabled' : ''}>${ic('prev')} Previous</button><span class="ws-saved" data-saved>${s.updated_at ? 'Saved ' + ago(s.updated_at) : ''}</span><button type="button" class="ws-btn" data-next>${current.idx === n - 1 ? 'Review & finish' : 'Next'} ${ic('next')}</button></div>`;
    let body = '';
    if (t.type === 'question') {
      const q = t.q;
      if (!q) body = `<p class="ws-q">${esc(t.title || 'This question is no longer in the unit.')}</p>`;
      else {
        const val = current.drafts[t.id] != null ? current.drafts[t.id] : (s.answer || '');
        body = `${q.scenario ? `<div class="ws-scen">${esc(q.scenario)}</div>` : ''}<p class="ws-q">${esc(q.question)}</p>
          <div class="ws-ans"><textarea data-ans data-no-track placeholder="Write your answer here. Aim for about ${Math.max(1, m) * 25} words for ${m || 'this'} mark${m === 1 ? '' : 's'}.">${esc(val)}</textarea><div class="row"><span data-wc>${wc(val)} words</span><span>Saves automatically</span></div></div>
          <div class="ws-acts"><button type="button" class="ws-btn ai" data-mark>${ic('spark')} Mark with AI Examiner</button>${s.max_score ? `<span class="ws-score${scoreClass(s.score, s.max_score)}">${ic('check', 16)} ${esc(s.score)}/${esc(s.max_score)} marks</span>` : s.done ? `<span class="ws-score">${ic('check', 16)} Submitted</span>` : `<button type="button" class="ws-btn" data-save>Submit without marking</button>`}</div>
          <div class="ws-res" data-res>${s.feedback && s.feedback.summary ? `<div class="ws-explain"><b>AI Examiner:</b> ${esc(s.feedback.summary)}</div>` : ''}</div>`;
      }
    } else if (t.type === 'mcq') {
      const q = t.m;
      if (!q) body = `<p class="ws-q">${esc(t.title || 'This quiz question is no longer in the unit.')}</p>`;
      else {
        const chosen = s.answer != null && s.answer !== '' ? Number(s.answer) : null;
        body = `<p class="ws-q">${esc(q.question)}</p><div class="ws-opts">${(q.choices || []).map((c, k) => `<button type="button" class="ws-opt${chosen != null ? (k === q.correct_index ? ' ok' : k === chosen ? ' bad' : '') : ''}" data-opt="${k}"${chosen != null ? ' disabled' : ''}><b>${'ABCDEF'[k]}</b><span>${esc(c)}</span><span>${chosen != null && k === q.correct_index ? ic('check') : ''}</span></button>`).join('')}</div>
          ${chosen != null ? `<div class="ws-explain"><b>${chosen === q.correct_index ? 'Correct!' : 'Not quite.'}</b> ${esc(q.explanation || '')}</div>` : ''}`;
      }
    } else if (t.type === 'guide') {
      body = `<p class="ws-q">Read: ${esc(t.title || t.ref)}</p>
        <div class="ws-guide" data-guidebody><p class="ws-group" style="margin:0">Loading the section from the revision guide…</p></div>
        <div class="ws-acts">${s.done ? `<span class="ws-score">${ic('check', 16)} Read</span>` : `<button type="button" class="ws-btn pri" data-markread>${ic('check')} I've read this</button>`}<button type="button" class="ws-btn ghost" data-guide>${ic('guide')} Open in the full guide</button></div>`;
    } else if (t.type === 'paper') {
      body = `<p class="ws-q">${esc(t.title || 'Exam paper')}</p><p class="ws-group">Answer the paper in the Past Papers section, then come back and mark it as done.</p>
        <div class="ws-acts"><button type="button" class="ws-btn pri" data-paper>${ic('paper')} Open past papers</button>${s.done ? `<span class="ws-score">${ic('check', 16)} Done</span>` : '<button type="button" class="ws-btn" data-markread>Mark as done</button>'}</div>`;
    } else if (t.type === 'studyhub') {
      const u = window.RA10Units && RA10Units.byPath(t.unit);
      body = `<p class="ws-q">${esc(t.title || 'Study Hub lesson')}</p><p class="ws-group">${t.mode === 'class' ? 'A short, game-like lesson your teacher wrote for the class' : 'A short, game-like lesson built just for you from your own progress'}${u ? ' in ' + esc(u.short) : ''}. It opens in Study Hub and your score comes back here.</p>
        <div class="ws-acts"><button type="button" class="ws-btn pri" data-studyhub="${esc(t.id)}">${ic('spark')} ${s.done ? 'Open again' : 'Start the lesson'}</button>${s.max_score ? `<span class="ws-score${scoreClass(s.score, s.max_score)}">${ic('check', 16)} ${esc(s.score)}/${esc(s.max_score)}</span>` : ''}</div>`;
    } else if (t.type === 'other') {
      const u = window.RA10Units && RA10Units.byPath(t.unit);
      body = `<p class="ws-q">${esc(t.title || 'Task')}</p><p class="ws-group">This task is in ${esc(u ? u.name : 'another unit')}.</p><div class="ws-acts"><button type="button" class="ws-btn pri" data-goto-unit="${esc(t.unit)}">${ic('other')} Open ${esc(u ? u.short : 'unit')}</button></div>`;
    }
    inner.innerHTML = notes() + `<p class="ws-group">${esc(t.group || '')}</p><section class="ws-card">${head}${body}${foot}</section>`;
    $('[data-main]', panel).scrollTop = 0;
    clearTimeout(current.readT);
    if (t.type === 'guide') fillGuide(t);
    const ta = $('[data-ans]', inner); if (ta && !ta.value) setTimeout(() => ta.focus({ preventScroll: true }), 60);
  }

  function finishHtml() {
    const pr = progress();
    const marked = current.tasks.map(t => ({ t, s: current.subs[t.id] || {} }));
    const got = marked.reduce((n, x) => n + (x.s.max_score ? Number(x.s.score || 0) : 0), 0);
    const max = marked.reduce((n, x) => n + (x.s.max_score ? Number(x.s.max_score) : 0), 0);
    const left = marked.filter(x => !x.s.done);
    return `<section class="ws-card ws-done">
      <span class="big">${ic('check', 38)}</span>
      <h2>${left.length ? `${pr.done} of ${pr.total} tasks done` : 'Assignment complete!'}</h2>
      <p class="ws-group" style="margin:0">${left.length ? `${left.length} task${left.length === 1 ? '' : 's'} still to do. Your teacher can see everything you've submitted so far.` : 'Nice work. Your teacher can now see your answers and marks.'}${max ? ` You scored <b>${got}/${max}</b> on the marked questions (${Math.round(got / max * 100)}%).` : ''}</p>
      <table>${marked.map((x, i) => `<tr><td>${i + 1}. ${esc(short(x.t).slice(0, 90))}</td><td>${x.s.max_score ? `${esc(x.s.score)}/${esc(x.s.max_score)}` : x.s.done ? '✓' : '—'}</td></tr>`).join('')}</table>
      <div class="ws-acts">${left.length ? `<button type="button" class="ws-btn pri" data-go="${current.tasks.indexOf(left[0].t)}">Go to the next unfinished task</button>` : ''}<button type="button" class="ws-btn" data-close>Close</button></div></section>`;
  }

  /* ── revision-guide sections shown right inside the assignment ── */
  const norm = (x) => String(x || '').toLowerCase().replace(/[▼▲►▸›]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  async function ensureGuide() {
    let root = $('#view-guide');
    if (root && root.querySelector('.guide-topic, .guide-aim-section, h2, h3')) return root;
    // render it once behind the workspace, then go back to where the student was
    const prev = document.documentElement.getAttribute('data-ux-view') || 'dashboard';
    if (UI.go) UI.go('guide');
    for (let i = 0; i < 12; i++) { await sleep(150); root = $('#view-guide'); if (root && root.querySelector('.guide-topic, .guide-aim-section, h2, h3')) break; }
    if (prev !== 'guide' && UI.go) UI.go(prev);
    return $('#view-guide');
  }
  function topicHead(t) { const h = t.querySelector('.guide-topic-hd, summary, h2, h3, h4'); return h ? h.textContent : ''; }
  function findGuideNode(root, ref, title) {
    const parts = String(ref || '').split(':');
    const topics = $$('.guide-topic', root);
    const want = norm(title);
    let code = null, idPart = null, slugPart = null;
    if (parts[0] === 'topic') code = parts.slice(1).join(':'); else { idPart = parts[0] || null; slugPart = parts[1] || null; }
    // a) exact element id (topic block, aim section or heading)
    if (idPart) {
      const node = root.querySelector('#' + (window.CSS && CSS.escape ? CSS.escape(idPart) : idPart));
      if (node) {
        if (slugPart) {
          const h = $$('h2, h3, h4, h5', node).find(x => UI.slug && UI.slug(x.textContent) === slugPart);
          if (h) return { heading: h };
        }
        if (node.matches('.guide-topic')) return { block: node };
        if (/^guide-aim-/.test(node.id)) return { block: node.closest('.guide-aim-section') || node.parentElement };
        if (/^H[1-6]$/.test(node.tagName)) return { heading: node };
        return { block: node.closest('.guide-topic') || node };
      }
    }
    // b) spec code (A1, B1.2 …): its own topic block, else the nearest parent (A2.2 → A2) with the sub-topic in focus
    if (!code) { const m = String(title || '').match(/^\s*([A-Z]\d+(?:\.\d+)*)\b/); if (m) code = m[1]; }
    if (code) {
      const esc2 = (x) => (window.CSS && CSS.escape ? CSS.escape(x) : x);
      for (let c = code, depth = 0; c; depth++) {
        const byId = root.querySelector('#gt-' + esc2(c));
        const nc = norm(c);
        const t = byId || topics.find(x => norm(topicHead(x)).indexOf(nc + ' ') === 0 || norm(topicHead(x)) === nc);
        if (t) return depth ? { block: t, focus: { code, title } } : { block: t };
        c = c.indexOf('.') > 0 ? c.slice(0, c.lastIndexOf('.')) : (/^[A-Z]\d+$/.test(c) ? null : null);
      }
    }
    // c) best title match among topic blocks, then headings
    if (want) {
      const short = want.split(' ').slice(0, 6).join(' ');
      const t = topics.find(x => norm(topicHead(x)) === want) || topics.find(x => { const h = norm(topicHead(x)); return h && (h.indexOf(short) >= 0 || want.indexOf(h) >= 0); });
      if (t) return { block: t };
      const hs = $$('h2, h3, h4', root).filter(x => !x.closest('.ux-crumb, .ux-hub, nav'));
      const h = hs.find(x => norm(x.textContent) === want) || hs.find(x => { const n = norm(x.textContent); return n.length > 3 && (n.indexOf(short) >= 0 || want.indexOf(n) >= 0); });
      if (h) return { heading: h };
    }
    return null;
  }
  function focusWords(f) {
    const name = String(f.title || '').replace(/^\s*[A-Z]\d+(?:\.\d+)*\s*/, '');
    const phrase = norm(name.split(':')[0]);
    const words = norm(name.split(':').slice(1).join(' ')).split(' ').filter(w => w.length > 4 && !/^(which|their|about|other|using|there)$/.test(w));
    return { phrase, words, code: norm(f.code) };
  }
  function subHeading(block, f) {
    const fw = focusWords(f);
    return $$('h3, h4, h5, strong, b, .guide-sub, dt', block).find(h => {
      const n = norm(h.textContent);
      return n && n.length < 160 && (n.indexOf(fw.code + ' ') === 0 || (fw.phrase.length > 6 && (n.indexOf(fw.phrase) >= 0 || fw.phrase.indexOf(n) === 0 && n.length > 10)));
    }) || null;
  }
  function cloneSection(found) {
    const box = document.createElement('div');
    if (found.block && found.focus) {
      const sub = subHeading(found.block, found.focus);
      if (sub && /^H[3-6]$/.test(sub.tagName)) { found = { heading: sub, focus: found.focus, parent: found.block }; }
    }
    if (found.block) box.appendChild(found.block.cloneNode(true));
    else if (found.heading) {
      const h = found.heading, lvl = Number(h.tagName[1]) || 4;
      box.appendChild(h.cloneNode(true));
      for (let n = h.nextElementSibling, k = 0; n && k < 80; n = n.nextElementSibling, k++) {
        if (/^H[1-6]$/.test(n.tagName) && Number(n.tagName[1]) <= lvl) break;
        box.appendChild(n.cloneNode(true));
      }
    }
    // tidy the copy: open everything, drop ids / buttons / toggles / locks
    box.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
    box.querySelectorAll('button, input, select, textarea, script, .guide-mark-btn, .guide-lock, [data-lock], #guide-access-gate-card').forEach(x => x.remove());
    box.querySelectorAll('[hidden]').forEach(x => x.removeAttribute('hidden'));
    box.querySelectorAll('details').forEach(x => x.setAttribute('open', ''));
    box.querySelectorAll('.guide-topic').forEach(x => x.classList.add('open'));
    box.querySelectorAll('.guide-topic-body').forEach(x => { x.style.display = 'block'; x.style.maxHeight = 'none'; x.style.overflow = 'visible'; });
    box.querySelectorAll('*').forEach(x => { if (x.children.length === 0 && /^[▼▲►▸]$/.test((x.textContent || '').trim())) x.remove(); });
    box.querySelectorAll('[onclick]').forEach(x => x.removeAttribute('onclick'));
    // a sub-topic shown inside its parent block: mark the lines that are about it
    if (found.focus) {
      const fw = focusWords(found.focus);
      let hits = 0;
      $$('li, tr, p, dd, h3, h4, h5, strong', box).forEach(el => {
        if (el.closest('.ws-hl')) return;
        const n = norm(el.textContent);
        if (!n || n.length > 600) return;
        const score = (fw.phrase.length > 6 && n.indexOf(fw.phrase) >= 0 ? 3 : 0) + (n.indexOf(fw.code + ' ') === 0 ? 3 : 0) + fw.words.filter(w => n.indexOf(w) >= 0).length;
        if (score >= 3) { el.classList.add('ws-hl'); hits++; }   // only clear matches, not a stray shared word
      });
      const parentTitle = found.parent ? topicHead(found.parent) : (found.block ? topicHead(found.block) : '');
      const note = document.createElement('p');
      note.className = 'ws-guide-note';
      note.textContent = (hits ? 'The highlighted parts are about ' : 'This is covered in ') + String(found.focus.title || found.focus.code).replace(/:.*$/, '') + (parentTitle ? ' — part of “' + parentTitle.replace(/[▼▲]/g, '').trim() + '”.' : '.');
      box.prepend(note);
    }
    return box;
  }
  async function fillGuide(t) {
    const host = panel && $('[data-guidebody]', panel);
    if (!host) return;
    current.guideCache = current.guideCache || {};
    let html = current.guideCache[t.id];
    if (html == null) {
      const root = await ensureGuide();
      const found = root ? findGuideNode(root, t.ref, t.title) : null;
      const box = found ? cloneSection(found) : null;
      html = box && box.textContent.trim().length > 20 ? box.innerHTML : '';
      current.guideCache[t.id] = html;
    }
    const host2 = panel && $('[data-guidebody]', panel);
    if (!host2 || current.tasks[current.idx] !== t) return;
    host2.innerHTML = html || '<p class="ws-group" style="margin:0">This section could not be shown here. Use “Open in the full guide” below.</p>';
    host2.classList.toggle('empty', !html);
    const hl = $('.ws-hl', host2);
    if (hl) setTimeout(() => { const a = hl.getBoundingClientRect().top, b = host2.getBoundingClientRect().top; host2.scrollTop = Math.max(0, host2.scrollTop + a - b - 70); }, 80);
    // 25 seconds on the section counts as read
    clearTimeout(current.readT);
    if (html && !(current.subs[t.id] || {}).done) current.readT = setTimeout(async () => {
      if (!panel || panel.classList.contains('min') || current.tasks[current.idx] !== t || (current.subs[t.id] || {}).done) return;
      await saveSub(t, { done: true, answer: 'read' });
      if (UI.track) UI.track('guide_section', { ref: t.ref, title: t.title, view: 'assignment' });
      paintNav(); paintTask();
    }, 25000);
  }

  function wc(v) { return String(v || '').trim().split(/\s+/).filter(Boolean).length; }
  function ago(d) { const s = (Date.now() - new Date(d)) / 1000; return s < 60 ? 'just now' : s < 3600 ? Math.round(s / 60) + ' min ago' : new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }

  // drafts save quietly while typing (never un-submits a finished task)
  function onInput(e) {
    const ta = e.target.closest('[data-ans]'); if (!ta) return;
    const t = current.tasks[current.idx];
    current.drafts[t.id] = ta.value;
    const w = $('[data-wc]', panel); if (w) w.textContent = wc(ta.value) + ' words';
    clearTimeout(current.saveT[t.id]);
    const sv = $('[data-saved]', panel); if (sv) sv.textContent = 'Saving…';
    current.saveT[t.id] = setTimeout(async () => {
      if (!ta.value.trim()) return;
      await saveSub(t, { answer: ta.value, done: !!(current.subs[t.id] || {}).done }, true);
      const sv2 = $('[data-saved]', panel); if (sv2) sv2.textContent = 'Saved just now';
      paintNav();
    }, 1200);
  }

  async function saveSub(it, fields, quiet) {
    const sb = client();
    const row = Object.assign({ assignment_id: current.a.id, user_id: R().getSession().user.id, item_id: it.id, item_type: it.type, question_ref: it.ref || (it.q && it.q.id) || null, question_text: (it.q && it.q.question) || (it.m && it.m.question) || it.title || null, updated_at: new Date().toISOString() }, fields);
    const { data, error } = await sb.from('edu_submissions').upsert(row, { onConflict: 'assignment_id,user_id,item_id' }).select().maybeSingle();
    if (error) { const sv = panel && $('[data-saved]', panel); if (sv) sv.textContent = 'Could not save — check your connection'; if (!quiet) alert('Could not save: ' + error.message); return null; }
    current.subs[it.id] = data || row;
    if (!quiet && UI.track) UI.track('assignment', { ref: current.a.id, title: row.question_text, answer: fields.answer != null ? String(fields.answer) : null, score: fields.score, max_score: fields.max_score, meta: { item: it.id, type: it.type } });
    paintProgress();
    return data;
  }

  function go(i) {
    current.idx = Math.max(0, Math.min(current.tasks.length, i));
    panel.classList.remove('navopen');
    paintNav(); paintTask();
  }

  async function onClick(e) {
    const t = e.target;
    if (t.closest('[data-close]')) { close(); return; }
    if (t.closest('[data-min]')) { minimise(); return; }
    if (t.closest('[data-navt]')) { panel.classList.toggle('navopen'); return; }
    const g = t.closest('[data-go]'); if (g) { go(Number(g.dataset.go)); return; }
    if (t.closest('[data-prev]')) { go(current.idx - 1); return; }
    if (t.closest('[data-next]')) { go(current.idx + 1); return; }
    const it = current.tasks[current.idx];
    if (!it) return;
    if (t.closest('[data-studyhub]')) {
      const url = '/study-hub/?assignment=' + encodeURIComponent(current.a.id) + '&item=' + encodeURIComponent(t.closest('[data-studyhub]').dataset.studyhub);
      try { window.top.location.href = url; } catch (e) { location.href = url; }
      return;
    }
    if (t.closest('[data-goto-unit]')) {
      const path = t.closest('[data-goto-unit]').dataset.gotoUnit;
      try { localStorage.setItem('ra10_edu_pending', JSON.stringify({ assignmentId: current.a.id, unit: path, ts: Date.now() })); } catch (err) {}
      const u = window.RA10Units && RA10Units.byPath(path);
      try { if (window.top.go) { window.top.go(u ? u.path : path); close(); return; } } catch (err) {}
      window.top.location.href = u ? u.publicPath : path;
      return;
    }
    if (t.closest('[data-save]')) {
      const v = ($('[data-ans]', panel) || {}).value || '';
      if (!v.trim()) { $('[data-ans]', panel).focus(); return; }
      await saveSub(it, { answer: v.trim(), done: true });
      delete current.drafts[it.id];
      paintNav(); paintTask();
      return;
    }
    if (t.closest('[data-mark]')) {
      const btn = t.closest('[data-mark]');
      const v = (($('[data-ans]', panel) || {}).value || '').trim();
      if (v.length < 8) { $('[data-ans]', panel).focus(); const r0 = $('[data-res]', panel); r0.innerHTML = '<div class="ws-explain">Write your answer first, then ask the AI Examiner to mark it.</div>'; return; }
      btn.disabled = true; btn.innerHTML = ic('spark') + ' Marking…';
      const res = $('[data-res]', panel);
      res.innerHTML = '<div class="ws-explain">The AI Examiner is reading your answer…</div>';
      try {
        const r = await R().examineAnswer({ question: it.q, answer: v });
        const out = (r && r.result) || {};
        const earned = Number(out.earned), max = Number(out.total || it.q.marks || 0) || null;
        await saveSub(it, { answer: v, score: Number.isFinite(earned) ? earned : null, max_score: max, feedback: { summary: out.summary || out.feedback || null, strengths: out.strengths || null, improvements: out.improvements || out.next_steps || null }, done: true });
        delete current.drafts[it.id];
        paintNav(); paintTask();
        const res2 = $('[data-res]', panel);
        res2.innerHTML = '';
        if (window.RA10AI && RA10AI.renderExamResult) res2.appendChild(RA10AI.renderExamResult({ question: it.q, answer: v, result: out }));
        else res2.innerHTML = `<div class="ws-explain">${esc(out.feedback || out.summary || '')}</div>`;
        res2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (err) {
        await saveSub(it, { answer: v, done: true });
        res.innerHTML = `<div class="ws-explain">${esc((err && err.message) || 'The AI Examiner could not mark this right now.')} Your answer has been submitted.</div>`;
        btn.disabled = false; btn.innerHTML = ic('spark') + ' Mark with AI Examiner';
        paintNav();
      }
      return;
    }
    const opt = t.closest('[data-opt]');
    if (opt && it.m) {
      const k = Number(opt.dataset.opt), ok = k === it.m.correct_index;
      await saveSub(it, { answer: String(k), score: ok ? 1 : 0, max_score: 1, done: true });
      paintNav(); paintTask();
      return;
    }
    if (t.closest('[data-guide]')) {
      minimise();
      if (UI.openGuideSection) UI.openGuideSection(it.ref, it.title);
      const started = Date.now();
      const iv = setInterval(async () => {
        if (document.documentElement.getAttribute('data-ux-view') !== 'guide') { if (Date.now() - started > 180000) clearInterval(iv); return; }
        if (Date.now() - started > 20000) { clearInterval(iv); if (!(current.subs[it.id] || {}).done) { await saveSub(it, { done: true, answer: 'read' }); paintNav(); if (current.tasks[current.idx] === it) paintTask(); } }
      }, 2000);
      return;
    }
    if (t.closest('[data-paper]')) { minimise(); UI.go && UI.go(UI.destinations().some(x => x.name === 'pastpapers') ? 'pastpapers' : 'papers'); return; }
    if (t.closest('[data-markread]')) { await saveSub(it, { done: true, answer: 'done' }); paintNav(); paintTask(); }
  }

  // Close keeps every saved answer; flush any draft still waiting to save.
  function flushDrafts() {
    if (!current) return;
    Object.keys(current.saveT || {}).forEach(id => {
      clearTimeout(current.saveT[id]);
      const t = (current.tasks || []).find(x => x.id === id);
      if (t && current.drafts[id] && current.drafts[id].trim()) saveSub(t, { answer: current.drafts[id], done: !!(current.subs[id] || {}).done }, true);
    });
  }
  function close() { flushDrafts(); if (panel) { panel.remove(); panel = null; } closePill(); document.documentElement.classList.remove('ux-lock'); }
  function minimise() {
    if (!panel) return;
    panel.classList.add('min');
    document.documentElement.classList.remove('ux-lock');
    paintPill(true);
  }
  function restore() {
    if (!panel) return;
    panel.classList.remove('min');
    document.documentElement.classList.add('ux-lock');
    closePill();
    paintNav();
    if (current && current.tasks[current.idx] && !$('[data-ans]', panel)) paintTask();
  }
  function paintPill(force) {
    if (!current || !panel || !current.tasks) return;
    if (!pill && !force && !panel.classList.contains('min')) return;
    if (!panel.classList.contains('min')) return;
    const pr = progress();
    if (!pill) {
      pill = document.createElement('button');
      pill.type = 'button'; pill.className = 'ux-edu-pill';
      pill.addEventListener('click', restore);
      mount(pill);
    }
    pill.innerHTML = `<span>${esc(current.a.title.slice(0, 34))}</span><span class="bar"><i style="width:${pr.total ? Math.round(pr.done / pr.total * 100) : 0}%"></i></span><span>${pr.done}/${pr.total}</span><b>Back to assignment</b>`;
  }
  function closePill() { if (pill) { pill.remove(); pill = null; } }

  /* ───────────────────── start-up ───────────────────── */
  const handled = new Set();
  // Single entry point for work handed over by the homepage (postMessage, localStorage or ?assignment=).
  function handle(p) {
    if (!p) return false;
    const key = p.key || ((p.assignmentId || (p.open && p.open.ref) || 'open') + ':' + p.ts);
    try { if (window.parent !== window) window.parent.postMessage({ type: 'ra10:edu-ack', key }, location.origin); } catch (e) {}
    if (handled.has(key)) return true;
    if (p.unit && p.unit.toLowerCase() !== UNIT_PATH.toLowerCase()) return false;
    handled.add(key);
    try { const s = JSON.parse(localStorage.getItem('ra10_edu_pending') || 'null'); if (s && (s.key === key || s.ts === p.ts)) localStorage.removeItem('ra10_edu_pending'); } catch (e) {}
    if (p.open) {
      setTimeout(() => {
        if (p.open.view === 'guide' && UI.openGuideSection) UI.openGuideSection(p.open.ref, p.open.title);
        else if (p.open.view && UI.go) UI.go(p.open.view);
      }, 400);
      return true;
    }
    if (p.assignmentId) openAssignment(p.assignmentId);
    return true;
  }
  function checkPending() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem('ra10_edu_pending') || 'null'); } catch (e) {}
    if (p && Date.now() - p.ts < 10 * 60 * 1000 && (!p.unit || p.unit.toLowerCase() === UNIT_PATH.toLowerCase())) {
      return handle(p);
    }
    return false;
  }
  window.addEventListener('storage', (e) => { if (e.key === 'ra10_edu_pending' && e.newValue) checkPending(); });
  if (!params.has('ra10catalog')) {
    if (params.get('assignment')) openAssignment(params.get('assignment'));
    else if (window.__ra10EduPending) handle(window.__ra10EduPending);
    else checkPending();
    paintDashboard();
  }

  window.RA10UnitEdu = { catalog, openAssignment, handle, refresh: () => { ctxCache = null; paintDashboard(); } };
})();
