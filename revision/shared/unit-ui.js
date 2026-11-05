/* RA10 — unified unit UI (all subjects). Adds, without touching each app's own code:
     • a "Jump to" quick-navigation menu (grouped, keyboard accessible; bottom sheet on phones)
     • a mobile bottom navigation bar (Home · Papers/Practise · Revise · Progress · Menu)
     • the Study Hub dashboard: a hero with your progress in this unit, a "pick up where you left off"
       strip and three clear lanes (Learn · Practise · Test yourself) with plain-English buttons
     • breadcrumbs with a back button on every sub-view
     • activity tracking (sections, guide reading, answers, quiz choices, AI Examiner marks) → RA10Track
     • sign-in required for downloads / printing
     • RA10 EDU: the assignment runner + question-bank catalogue (lazy-loaded unit-edu.js)
   It navigates by clicking the app's existing [data-goto] / .tab controls, so every app's own render hooks still run. */
(function () {
  'use strict';
  if (window.RA10UnitUI) return;

  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ICON = (p) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const I = {
    home: ICON('<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
    papers: ICON('<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 16h6"/>'),
    practice: ICON('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>'),
    browse: ICON('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
    mock: ICON('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>'),
    quiz: ICON('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
    flash: ICON('<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 6V4h14v14h-2"/>'),
    guide: ICON('<path d="M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 8h6"/>'),
    spec: ICON('<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/>'),
    calculator: ICON('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/>'),
    progress: ICON('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    menu: ICON('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    chevron: ICON('<path d="m6 9 6 6 6-6"/>'),
    back: ICON('<path d="M15 6l-6 6 6 6"/>'),
    arrow: ICON('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    spark: ICON('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
    flame: ICON('<path d="M12 22c4 0 7-2.7 7-7 0-3.5-2.4-6-4-8-.4 2-1.5 3.2-3 3.5C12.5 7 11 4.5 8.5 2 8.8 5.5 5 8.6 5 15c0 4.3 3 7 7 7z"/>'),
    check: ICON('<path d="M20 6 9 17l-5-5"/>'),
    target: ICON('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    booklet: ICON('<path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6z"/><path d="M6 3v18"/><path d="M10 8h5M10 12h5"/><path d="M8 17h9"/>'),
    tools: ICON('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'),
    lock: ICON('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>')
  };

  // Destinations: meta for every view name we know about. Views not listed here are derived from their heading.
  // t = title, d = short description (menu), long = plain-English dashboard description, cta = button wording
  const META = {
    dashboard: { t: 'Dashboard', d: 'Your study hub', i: 'home', g: 'Start', p: 'dashboard' },
    home: { t: 'Home', d: 'Your study hub', i: 'home', g: 'Start', p: 'dashboard' },
    papers: { t: 'Past Papers', d: 'Past papers and RA10 Papers: answer online, AI marking, PDF', long: 'Real exam papers in the exam layout. Answer online and the AI Examiner marks you like Pearson would.', cta: 'Open past papers', i: 'papers', g: 'Practise', p: 'papers', lane: 'practise', feat: 1 },
    pastpapers: { t: 'Past Papers', d: 'Past papers and RA10 Papers: answer online, AI marking, PDF', long: 'Real exam papers in the exam layout. Answer online and the AI Examiner marks you like Pearson would.', cta: 'Open past papers', i: 'papers', g: 'Practise', p: 'questions', lane: 'practise', feat: 1 },
    practice: { t: 'Practise by topic', d: 'Filter by topic, marks and type', long: 'Pick a topic and answer exam-style questions one at a time, with instant feedback.', cta: 'Start practising', i: 'practice', g: 'Practise', p: 'questions', lane: 'practise' },
    questions: { t: 'Questions', d: 'Practice, browse and mock papers', long: 'Every exam-style question for this unit.', cta: 'Open questions', i: 'practice', g: 'Practise', p: 'questions', parent: 1, lane: 'practise' },
    browse: { t: 'Question bank', d: 'Every question with its mark scheme', long: 'Search every question and read the full mark scheme.', cta: 'Browse questions', i: 'browse', g: 'Practise', p: 'questions', lane: 'practise' },
    mock: { t: 'Mock exam', d: 'A timed random paper', long: 'A fresh timed paper built from random questions — the closest thing to the real exam.', cta: 'Build a mock', i: 'mock', g: 'Practise', p: 'questions', lane: 'test' },
    quiz: { t: 'Quick quiz', d: 'Multiple choice with explanations', long: 'Ten quick multiple-choice questions. See the right answer and why straight away.', cta: 'Take a quiz', i: 'quiz', g: 'Revise', p: 'revise', lane: 'test' },
    flash: { t: 'Flashcards', d: 'Terms, formulae and key facts', long: 'Flip cards to lock in key terms, definitions and facts.', cta: 'Flip flashcards', i: 'flash', g: 'Revise', p: 'revise', lane: 'learn' },
    guide: { t: 'Revision guide', d: 'Diagrams, examples and exam tips', long: 'Read the notes: every topic explained with diagrams, worked examples and exam tips.', cta: 'Start reading', i: 'guide', g: 'Revise', p: 'revise', lane: 'learn', feat: 1 },
    spec: { t: 'Specification', d: 'Content mapped to questions', long: 'The checklist of everything you need to know, topic by topic.', cta: 'See the topics', i: 'spec', g: 'Revise', p: 'revise', lane: 'learn' },
    revise: { t: 'Revise', d: 'Guide, flashcards, quiz', long: 'Guide, flashcards and quizzes.', cta: 'Revise', i: 'guide', g: 'Revise', p: 'revise', parent: 1, lane: 'learn' },
    calculator: { t: 'Calculator', d: 'Finance tools and formulae', long: 'Finance calculators and every formula you need.', cta: 'Open calculator', i: 'calculator', g: 'Revise', p: 'calculator', lane: 'learn' },
    progress: { t: 'Progress', d: 'Scores, streaks and weak topics', long: 'Your scores, streak and weakest topics.', cta: 'See progress', i: 'progress', g: 'Track', p: 'progress' }
  };
  const GROUP_ORDER = ['Start', 'Practise', 'Revise', 'Tools', 'Track'];
  const LANES = [
    { k: 'learn', t: 'Learn it', s: 'Read and memorise', n: '1' },
    { k: 'practise', t: 'Practise it', s: 'Answer exam questions', n: '2' },
    { k: 'test', t: 'Test yourself', s: 'Check you are exam-ready', n: '3' }
  ];

  const store = {
    get(k) { try { return localStorage.getItem('ra10_ux_' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('ra10_ux_' + k, v); } catch (e) {} }
  };
  const unitKey = (location.pathname || '').replace(/[^a-z0-9]+/gi, '_').slice(-40);
  const embedded = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  const params = new URLSearchParams(location.search);

  let dests = [];          // [{name, t, d, i, g, p, el}]
  let current = 'dashboard';
  let menu = null, bottom = null;

  /* ───── the app's own data (top-level let/const globals are visible to classic scripts) ───── */
  function appData() {
    const d = {};
    try { d.questions = typeof QUESTIONS !== 'undefined' ? QUESTIONS : window.QUESTIONS; } catch (e) { d.questions = window.QUESTIONS; }
    try { d.quiz = typeof QUIZ !== 'undefined' ? QUIZ : window.QUIZ; } catch (e) { d.quiz = window.QUIZ; }
    try { d.flash = typeof FLASHCARDS !== 'undefined' ? FLASHCARDS : window.FLASHCARDS; } catch (e) { d.flash = window.FLASHCARDS; }
    try { d.spec = typeof SPEC !== 'undefined' ? SPEC : window.SPEC; } catch (e) { d.spec = window.SPEC; }
    d.papers = window.AQA_PAPERS || window.BIZ_PAPERS || window.PAPERS || null;
    ['questions', 'quiz', 'flash', 'papers'].forEach(k => { if (!Array.isArray(d[k])) d[k] = []; });
    return d;
  }

  /* ───── local progress stats for this unit (powers the dashboard) ───── */
  const STATS_KEY = 'stats_' + unitKey;
  const today = () => new Date().toISOString().slice(0, 10);
  function stats() { try { return JSON.parse(store.get(STATS_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function bump(fn) {
    if (params.has('ra10catalog')) return;
    const s = stats();
    fn(s);
    s.days = s.days || {};
    s.days[today()] = (s.days[today()] || 0) + 1;
    const keys = Object.keys(s.days).sort();
    if (keys.length > 90) keys.slice(0, keys.length - 90).forEach(k => delete s.days[k]);
    store.set(STATS_KEY, JSON.stringify(s));
    scheduleHeroPaint();
  }
  function streak(s) {
    const days = s.days || {};
    let n = 0; const d = new Date();
    if (!days[d.toISOString().slice(0, 10)]) d.setDate(d.getDate() - 1);
    while (days[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function viewNames() {
    return $$('section.view[id^="view-"]').map(v => v.id.replace(/^view-/, ''));
  }
  function headingOf(name) {
    const v = $('#view-' + name);
    const h = v && $('h2', v);
    return h ? h.textContent.trim() : name.replace(/[-_]/g, ' ').replace(/^./, c => c.toUpperCase());
  }
  function buildDests() {
    const names = viewNames();
    const tabNames = $$('.tabs .tab[data-tab]').map(b => b.dataset.tab);
    const all = Array.from(new Set(names.concat(tabNames)));
    dests = [];
    all.forEach(name => {
      const m = META[name];
      if (m) { dests.push(Object.assign({ name }, m)); return; }
      if (!$('#view-' + name)) return;
      dests.push({ name, t: headingOf(name), d: '', i: 'tools', g: 'Tools', p: name });
    });
    if (dests.some(d => d.name === 'pastpapers')) {
      dests.forEach(d => { if (d.name === 'papers') { d.t = 'Predicted Papers'; d.d = 'June 2027 predictions and exam trends'; d.long = 'Our predictions for the next exam, written in the exam layout.'; d.cta = 'See predictions'; d.lane = 'test'; d.feat = 0; } });
    }
    // Printable revision booklets live outside the app (../booklets/?unit=N): surface them as a real destination.
    const booklet = $('a[href*="booklets/index.html"]');
    if (booklet && !dests.some(d => d.name === 'booklets')) {
      dests.push({ name: 'booklets', t: 'Revision booklets', d: 'Printable booklet + solutions for every aim', long: 'Printable booklets with worked solutions for every learning aim.', cta: 'Open booklets', i: 'booklet', g: 'Revise', p: 'revise', lane: 'learn', href: booklet.href });
    }
    // a unit that has both 'dashboard' and 'home' keeps one
    if (dests.some(d => d.name === 'dashboard')) dests = dests.filter(d => d.name !== 'home');
    // parents (questions/revise) are shown only if they have no children
    const hasChild = (p) => dests.some(d => !d.parent && d.p === p && d.name !== p);
    dests = dests.filter(d => !(d.parent && hasChild(d.p)));
    const PREF = ['dashboard', 'home', 'pastpapers', 'papers', 'practice', 'browse', 'mock', 'guide', 'booklets', 'flash', 'quiz', 'spec', 'calculator', 'progress'];
    const rank = (d) => { const i = PREF.indexOf(d.name); return i < 0 ? 50 : i; };
    dests.sort((a, b) => (GROUP_ORDER.indexOf(a.g) - GROUP_ORDER.indexOf(b.g)) || (rank(a) - rank(b)));
  }
  const destOf = (n) => dests.find(d => d.name === n);

  /* ───── navigation ───── */
  function go(name) {
    const ext = dests.find(d => d.name === name && d.href);
    if (ext) { closeMenu(); window.open(ext.href, '_blank', 'noopener'); return; }
    closeMenu();
    const d = destOf(name) || { name, p: name };
    const direct = $(`[data-goto="${name}"]`);
    if (direct) { direct.click(); return; }
    const tab = $(`.tabs .tab[data-tab="${name}"]`);
    if (tab) { tab.click(); return; }
    const par = $(`.tabs .tab[data-tab="${d.p}"]`);
    if (par) par.click();
    if ($('#view-' + name)) {
      // manual fallback: show the view
      $$('section.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      sync();
    }
  }
  function activeName() {
    const v = $('section.view.active[id^="view-"]');
    if (v) return v.id.replace(/^view-/, '');
    const t = $('.tabs .tab.active');
    return t ? t.dataset.tab : 'dashboard';
  }

  /* ───── Jump-to menu ───── */
  function menuHtml() {
    const groups = {};
    dests.forEach(d => { (groups[d.g] = groups[d.g] || []).push(d); });
    return GROUP_ORDER.filter(g => groups[g]).map(g => `
      <div class="ux-mgroup" role="group" aria-label="${esc(g)}">
        <p class="ux-mlabel">${esc(g)}</p>
        ${groups[g].map(d => `<button type="button" class="ux-mitem${d.name === current ? ' on' : ''}" data-ux-go="${esc(d.name)}">
            <span class="ux-mico">${I[d.i] || I.tools}</span><span class="ux-mtxt"><b>${esc(d.t)}</b>${d.d ? `<small>${esc(d.d)}</small>` : ''}</span></button>`).join('')}
      </div>`).join('') + siteLinksHtml();
  }
  const SITE = [['Home', '/', 'M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10'], ['Subjects', '/subjects', 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
    ['Community', '/community', 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8'], ['Tasks', '/tasks', 'M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
    ['Exams', '/exams', 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'], ['Leaderboard', '/leaderboard', 'M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0zM7 6H4a2 2 0 0 0 2 3M17 6h3a2 2 0 0 1-2 3']];
  function siteLinksHtml() {
    return `<div class="ux-mgroup ux-site" role="group" aria-label="Around RA10"><p class="ux-mlabel">Around RA10</p><div class="ux-sitegrid">${SITE.map(x => `<a class="ux-sitelink" href="${x[1]}" target="_top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${x[2]}"/></svg><span>${x[0]}</span></a>`).join('')}</div></div>`;
  }
  function openMenu() {
    if (menu) { closeMenu(); return; }
    menu = document.createElement('div');
    menu.className = 'ux-menu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Jump to');
    menu.innerHTML = `<div class="ux-mhead"><strong>Jump to</strong><button type="button" class="ux-mclose" aria-label="Close menu">✕</button></div><div class="ux-mbody">${menuHtml()}</div>`;
    const scrim = document.createElement('div');
    scrim.className = 'ux-scrim';
    document.body.appendChild(scrim);
    document.body.appendChild(menu);
    scrim.addEventListener('click', closeMenu);
    $('.ux-mclose', menu).addEventListener('click', closeMenu);
    menu.addEventListener('click', (e) => {
      const site = e.target.closest('.ux-sitelink');
      if (site) {
        // Inside the site shell: navigate the shell without reloading it.
        try { if (window.top !== window && typeof window.top.go === 'function') { e.preventDefault(); closeMenu(); window.top.go(site.getAttribute('href')); return; } } catch (err) { /* fall through to the link */ }
        return;
      }
      const b = e.target.closest('[data-ux-go]'); if (b) go(b.dataset.uxGo);
    });
    menu.addEventListener('keydown', (e) => {
      const items = $$('.ux-mitem', menu);
      const i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') { closeMenu(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    });
    if (window.innerWidth > 820) {
      const tb = $('.topbar'); const bot = tb ? Math.round(tb.getBoundingClientRect().bottom) : 76;
      menu.style.setProperty('top', (bot + 10) + 'px', 'important');
      menu.style.maxHeight = 'calc(100vh - ' + (bot + 24) + 'px)';
    }
    requestAnimationFrame(() => { menu.classList.add('open'); scrim.classList.add('open'); const on = $('.ux-mitem.on', menu) || $('.ux-mitem', menu); on && on.focus({ preventScroll: true }); });
    $$('[data-ux-open]').forEach(b => b.setAttribute('aria-expanded', 'true'));
    document.documentElement.classList.add('ux-lock');
  }
  function closeMenu() {
    if (!menu) return;
    const m = menu, s = $('.ux-scrim');
    menu = null;
    m.classList.remove('open'); s && s.classList.remove('open');
    setTimeout(() => { m.remove(); s && s.remove(); }, 180);
    $$('[data-ux-open]').forEach(b => { b.setAttribute('aria-expanded', 'false'); });
    document.documentElement.classList.remove('ux-lock');
    const t = $('.ux-jump'); t && t.focus({ preventScroll: true });
  }

  /* ───── header jump button ───── */
  function addJumpButton() {
    const tabs = $('.topbar .tabs');
    if (!tabs || $('.ux-jump')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ux-jump';
    b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-expanded', 'false'); b.setAttribute('data-ux-open', '');
    b.innerHTML = `${I.menu}<span>Jump to</span>${I.chevron}`;
    b.addEventListener('click', () => openMenu());
    tabs.insertAdjacentElement('afterend', b);
  }

  // Phones inside the site: a Menu button in the header opens the Jump-to sheet (the unit's own bottom bar is hidden there).
  function addHeaderMenuButton() {
    const actions = $('.topbar > div:last-child');
    if (!actions || $('.ux-menubtn')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ux-menubtn'; b.setAttribute('aria-label', 'Open menu'); b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('data-ux-open', ''); b.setAttribute('aria-expanded', 'false');
    b.innerHTML = I.menu; b.addEventListener('click', () => openMenu());
    actions.insertAdjacentElement('afterbegin', b);
  }

  /* ───── mobile bottom navigation ───── */
  function addBottomNav() {
    if ($('.ux-bottom')) return;
    const has = (n) => !!destOf(n);
    const items = [];
    items.push({ n: 'dashboard', l: 'Home', i: 'home', p: 'dashboard' });
    if (has('pastpapers')) items.push({ n: 'pastpapers', l: 'Papers', i: 'papers', p: 'questions' });
    else if (has('papers')) items.push({ n: 'papers', l: 'Papers', i: 'papers', p: 'papers' });
    else if (has('practice')) items.push({ n: 'practice', l: 'Practise', i: 'practice', p: 'questions' });
    if (has('guide') || has('flash') || has('quiz')) items.push({ n: has('guide') ? 'guide' : (has('flash') ? 'flash' : 'quiz'), l: 'Revise', i: 'guide', p: 'revise' });
    if (has('progress')) items.push({ n: 'progress', l: 'Progress', i: 'progress', p: 'progress' });
    bottom = document.createElement('nav');
    bottom.className = 'ux-bottom';
    bottom.setAttribute('aria-label', 'Unit navigation');
    bottom.innerHTML = items.map(x => `<button type="button" data-ux-go="${esc(x.n)}" data-ux-p="${esc(x.p)}"><span>${I[x.i]}</span><b>${esc(x.l)}</b></button>`).join('') +
      `<button type="button" data-ux-open aria-haspopup="dialog" aria-expanded="false"><span>${I.menu}</span><b>Menu</b></button>`;
    document.body.appendChild(bottom);
    bottom.addEventListener('click', (e) => {
      const g = e.target.closest('[data-ux-go]'); if (g) { go(g.dataset.uxGo); return; }
      if (e.target.closest('[data-ux-open]')) openMenu();
    });
  }

  /* ───── Study Hub dashboard ───── */
  function counts() {
    const d = appData(), c = {};
    if (d.flash.length) c.flash = d.flash.length + ' cards';
    if (d.quiz.length) c.quiz = d.quiz.length + ' questions';
    if (d.questions.length) { c.browse = d.questions.length + ' questions'; c.practice = d.questions.length + ' questions'; c.mock = 'Timed'; }
    if (d.papers.length) { c.papers = d.papers.length + ' papers'; c.pastpapers = d.papers.length + ' papers'; }
    if (d.spec && typeof d.spec === 'object') {
      const aims = Object.keys(d.spec);
      const topics = aims.reduce((n, a) => n + ((d.spec[a] && d.spec[a].topics) || []).length, 0);
      if (topics) { c.guide = topics + ' topics'; c.spec = aims.length + ' learning aims'; }
    }
    return c;
  }
  function firstName() {
    try { const p = window.RA10 && RA10.getProfile && RA10.getProfile(); const n = p && (p.display_name || p.full_name || p.username); return n ? String(n).trim().split(/\s+/)[0].slice(0, 20) : ''; } catch (e) { return ''; }
  }
  function recommended() {
    const s = stats();
    const guideSeen = Object.keys(s.guide || {}).length, guideTotal = s.guideTotal || 0;
    const mcq = s.mcq || 0, acc = mcq ? (s.mcqOk || 0) / mcq : 1;
    if (destOf('guide') && (guideTotal ? guideSeen / guideTotal < 0.25 : guideSeen < 3)) return { n: 'guide', why: 'Start with the notes — you have read ' + (guideTotal ? Math.round(guideSeen / guideTotal * 100) + '%' : 'only a little') + ' of the guide.' };
    if (destOf('quiz') && mcq < 10) return { n: 'quiz', why: 'A quick quiz shows what you already know.' };
    if (destOf('flash') && acc < 0.6) return { n: 'flash', why: 'Your quiz accuracy is ' + Math.round(acc * 100) + '% — flashcards will help key terms stick.' };
    const p = destOf('pastpapers') ? 'pastpapers' : destOf('papers') ? 'papers' : destOf('practice') ? 'practice' : null;
    return p ? { n: p, why: 'You know the content — time for real exam questions.' } : null;
  }
  // The unit's paper library (Pearson/AQA papers + RA10 papers), if it has one.
  function paperInfo() {
    const list = appData().papers;
    if (!list.length) return null;
    const dest = destOf('pastpapers') ? 'pastpapers' : (destOf('papers') && $('#papers-host') ? 'papers' : null);
    if (!dest) return null;
    const ra10 = list.filter(p => p.source === 'ra10').length;
    const official = list.length - ra10;
    const board = /a-level/i.test(location.pathname) ? 'AQA' : 'Pearson';
    return { dest, ra10, official, board };
  }
  function openPapers(pp, which) {
    go(pp.dest);
    let tries = 0;
    const pick = () => {
      const seg = $$('#papers-host .pp-libbar .pp-seg button');
      if (!seg.length) { if (++tries < 20) setTimeout(pick, 150); return; }
      if (which === 'mock') { const m = $('#papers-host .pp-libbar .btn.primary'); if (m) m.click(); return; }
      const b = seg.find(x => (which === 'ra10') === /RA10/i.test(x.textContent));
      if (b && !b.classList.contains('on')) b.click();
      const host = $('#papers-host'); host && host.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    setTimeout(pick, 120);
  }
  function unitInfo() {
    const legacy = $('#view-dashboard .hero') || $('#view-home .hero');
    const meta = (window.RA10Units && RA10Units.fromLocation(location.pathname)) || null;
    const title = (legacy && $('h2', legacy) && $('h2', legacy).textContent.trim()) || (meta && meta.name) || document.title.replace(/\s*[|–-].*$/, '');
    const eyebrow = (legacy && $('.eyebrow', legacy) && $('.eyebrow', legacy).textContent.trim()) || (meta && meta.qual) || '';
    const lede = (legacy && $('.lede', legacy) && $('.lede', legacy).textContent.trim()) || '';
    return { title, eyebrow, lede, kind: meta ? meta.kind : '' };
  }

  function heroStatsHtml() {
    const s = stats();
    const guideSeen = Object.keys(s.guide || {}).length, guideTotal = Math.max(s.guideTotal || 0, guideSeen);
    const pct = guideTotal ? Math.round(guideSeen / guideTotal * 100) : 0;
    const answered = Math.max(s.q || 0, s.ai || 0);   // a marked answer is usually also a written one
    const acc = s.mcq ? Math.round((s.mcqOk || 0) / s.mcq * 100) : null;
    const st = streak(s);
    const todayN = (s.days || {})[today()] || 0;
    const goal = 10, goalPct = Math.min(100, Math.round(todayN / goal * 100));
    const R = 46, C = 2 * Math.PI * R;
    return `
      <div class="ux-ring" role="img" aria-label="Revision guide ${pct}% read">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="trk" cx="60" cy="60" r="${R}"/><circle class="bar" cx="60" cy="60" r="${R}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - pct / 100)).toFixed(1)}"/></svg>
        <div class="ux-ring-in"><b>${pct}<small>%</small></b><span>guide read</span></div>
      </div>
      <div class="ux-mini">
        <div><b>${answered}</b><span>questions answered</span></div>
        <div><b>${acc == null ? '—' : acc + '%'}</b><span>quiz accuracy</span></div>
        <div class="${st ? 'hot' : ''}"><b>${I.flame}${st}</b><span>day streak</span></div>
      </div>
      <div class="ux-goal" title="Today's goal: ${goal} study actions in this unit">
        <span>${todayN >= goal ? I.check + ' Daily goal smashed!' : `Today: ${todayN} / ${goal} study actions`}</span>
        <i><em style="width:${goalPct}%"></em></i>
      </div>`;
  }
  let heroT = null;
  function scheduleHeroPaint() { clearTimeout(heroT); heroT = setTimeout(() => { const h = $('.ux-hero-stats'); if (h) h.innerHTML = heroStatsHtml(); }, 250); }

  function tileHtml(d, c, rec) {
    const isRec = rec && rec.n === d.name;
    return `<button type="button" class="ux-act${isRec ? ' rec' : ''}" data-ux-go="${esc(d.name)}" data-tile="${esc(d.name)}">
        ${isRec ? '<span class="ux-rec">Recommended next</span>' : ''}
        <span class="ux-aicon">${I[d.i] || I.tools}</span>
        <span class="ux-atxt"><b>${esc(d.t)}</b><small>${esc(d.long || d.d || '')}</small>
          <span class="ux-ameta"><em class="ux-tcount" data-count="${esc(d.name)}">${esc(c[d.name] || '')}</em><strong>${esc(d.cta || 'Open')} ${I.arrow}</strong></span></span>
      </button>`;
  }

  function launchpad() {
    const dash = $('#view-dashboard') || $('#view-home');
    if (!dash || $('.ux-hub', dash)) return;
    const lanes = { learn: [], practise: [], test: [] };
    const pp = paperInfo();
    dests.forEach(d => { if (d.lane && lanes[d.lane] && d.name !== 'dashboard' && !(pp && d.name === pp.dest)) lanes[d.lane].push(d); });
    // tools that only exist as tabs (e.g. SQL lab, calculators) join the practise lane
    dests.filter(d => d.g === 'Tools' && !d.lane && $(`.tabs .tab[data-tab="${d.name}"]`)).slice(0, 3)
      .forEach(d => lanes.practise.push(Object.assign({}, d, { long: d.d || 'Open ' + d.t.toLowerCase(), cta: 'Open' })));
    if (!lanes.learn.length && !lanes.practise.length && !lanes.test.length) return;
    // keep lanes balanced: if "test" is empty, move the mock there
    if (!lanes.test.length && lanes.practise.length > 2) lanes.test.push(lanes.practise.pop());

    const c = counts();
    const info = unitInfo();
    const rec = recommended();
    const last = store.get('last_' + unitKey);
    const lastD = last && destOf(last) && last !== 'dashboard' && last !== 'home' ? destOf(last) : null;
    const lastGuide = (() => { try { return JSON.parse(store.get('lastguide_' + unitKey) || 'null'); } catch (e) { return null; } })();
    const name = firstName();
    const hour = new Date().getHours();
    const hi = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const wrap = document.createElement('section');
    wrap.className = 'ux-hub';
    wrap.setAttribute('aria-label', 'Study hub');
    wrap.innerHTML = `
      <header class="ux-hero">
        <div class="ux-hero-bg" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="ux-hero-main">
          <p class="ux-hello">${esc(hi)}${name ? ', ' + esc(name) : ''} 👋</p>
          ${info.eyebrow ? `<p class="ux-eyebrow">${esc(info.eyebrow)}</p>` : ''}
          <h1 class="ux-title">${esc(info.title)}</h1>
          ${info.lede ? `<p class="ux-lede">${esc(info.lede)}</p>` : ''}
          <div class="ux-hero-ctas">
            ${rec ? `<button type="button" class="ux-cta" data-ux-go="${esc(rec.n)}">${I[destOf(rec.n).i] || I.spark}<span><b>${esc(destOf(rec.n).cta || 'Start')}</b><small>${esc(rec.why)}</small></span>${I.arrow}</button>` : ''}
          </div>
          <div class="ux-chips">${[c.guide, c.browse, c.papers, c.quiz && c.quiz.replace('questions', 'quiz questions'), c.flash].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join('')}</div>
        </div>
        <div class="ux-hero-stats">${heroStatsHtml()}</div>
      </header>
      ${(lastD || lastGuide) ? `<div class="ux-resume-row">
        ${lastD ? `<button type="button" class="ux-resume" data-ux-go="${esc(lastD.name)}"><span class="ux-ricon">${I[lastD.i] || I.tools}</span><span><small>Pick up where you left off</small><b>${esc(lastD.t)}</b></span><em>Resume ${I.arrow}</em></button>` : ''}
        ${lastGuide && lastGuide.t ? `<button type="button" class="ux-resume alt" data-ux-guide="${esc(lastGuide.id || '')}"><span class="ux-ricon">${I.guide}</span><span><small>Last thing you read</small><b>${esc(lastGuide.t)}</b></span><em>Keep reading ${I.arrow}</em></button>` : ''}
      </div>` : ''}
      ${pp ? `<section class="ux-papers" aria-label="Past papers and RA10 papers">
        <span class="ux-papers-ico">${I.papers}</span>
        <div class="ux-papers-txt"><p class="ux-papers-k">Exam papers</p><h2>${pp.ra10 ? 'Past Papers &amp; RA10 Papers' : 'Past Papers'}</h2>
          <p>${pp.official ? `${pp.official} official ${pp.board} paper${pp.official === 1 ? '' : 's'}` : ''}${pp.official && pp.ra10 ? ' and ' : ''}${pp.ra10 ? `${pp.ra10} RA10 practice paper${pp.ra10 === 1 ? '' : 's'}` : ''} in the real exam layout. Answer online and the AI Examiner marks you, or download a PDF.</p></div>
        <div class="ux-papers-btns">
          ${pp.official ? `<button type="button" class="ux-pbtn pri" data-ux-papers="official">${esc(pp.board)} past papers <em>${pp.official}</em></button>` : ''}
          ${pp.ra10 ? `<button type="button" class="ux-pbtn${pp.official ? '' : ' pri'}" data-ux-papers="ra10">RA10 papers <em>${pp.ra10}</em></button>` : ''}
          ${pp.ra10 ? `<button type="button" class="ux-pbtn ghost" data-ux-papers="mock">⏱ Timed mock</button>` : ''}
        </div></section>` : ''}
      <div class="ux-edu-slot" hidden></div>
      <div class="ux-lanes">${LANES.filter(l => lanes[l.k].length).map(l => `
        <section class="ux-lane ux-lane-${l.k}" aria-label="${esc(l.t)}">
          <header><span class="ux-step">${l.n}</span><div><h2>${esc(l.t)}</h2><p>${esc(l.s)}</p></div></header>
          <div class="ux-acts">${lanes[l.k].map(d => tileHtml(d, c, rec)).join('')}</div>
        </section>`).join('')}
      </div>`;

    // everything the app put on its dashboard moves into the "More" drawer (it stays in the DOM so its buttons keep working)
    const legacy = Array.from(dash.children).filter(el => !el.classList.contains('ux-hub') && !el.classList.contains('ux-crumb'));
    dash.prepend(wrap);
    legacy.forEach(el => {
      const txt = (el.textContent || '').trim();
      if (/Why some features cost credits/i.test(txt)) { el.remove(); return; }       // everyone has unlimited credits now
      if (el.classList.contains('pp-free-banner')) { el.hidden = true; }                // the Past Papers lane button replaces it
    });
    const keep = legacy.filter(el => el.isConnected && !el.hidden);
    if (keep.length) {
      const det = document.createElement('details');
      det.className = 'ux-more';
      det.innerHTML = '<summary><span>' + I.tools + ' Unit overview, topic coverage and every tool</span>' + I.chevron + '</summary><div class="ux-morebody"></div>';
      wrap.insertAdjacentElement('afterend', det);
      const body = $('.ux-morebody', det);
      keep.forEach(el => body.appendChild(el));
      if (store.get('more_open') === '1') det.open = true;
      det.addEventListener('toggle', () => store.set('more_open', det.open ? '1' : '0'));
    }
    wrap.addEventListener('click', (e) => {
      const pb = e.target.closest('[data-ux-papers]');
      if (pb && pp) { openPapers(pp, pb.dataset.uxPapers); return; }
      const g = e.target.closest('[data-ux-guide]');
      if (g) { openGuideSection(g.dataset.uxGuide); return; }
      const b = e.target.closest('[data-ux-go]'); if (b) go(b.dataset.uxGo);
    });
    // a soft tilt on pointer devices
    if (window.matchMedia && matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
      wrap.addEventListener('pointermove', (e) => {
        const t = e.target.closest('.ux-act'); if (!t) return;
        const r = t.getBoundingClientRect();
        t.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        t.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    }
  }
  function refreshCounts() {
    const c = counts();
    $$('.ux-tcount').forEach(el => { const k = el.dataset.count; if (c[k]) el.textContent = c[k]; });
    const chips = $('.ux-chips');
    if (chips) chips.innerHTML = [c.guide, c.browse, c.papers, c.quiz && c.quiz.replace('questions', 'quiz questions'), c.flash].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join('');
  }

  /* ───── breadcrumbs on sub-views ───── */
  function crumbs() {
    $$('section.view[id^="view-"]').forEach(v => {
      const name = v.id.replace(/^view-/, '');
      if (name === 'dashboard' || name === 'home' || $('.ux-crumb', v)) return;
      const d = destOf(name);
      const par = d && d.p && d.p !== name ? destOf(d.p) || META[d.p] : null;
      const c = document.createElement('nav');
      c.className = 'ux-crumb';
      c.setAttribute('aria-label', 'Breadcrumb');
      c.innerHTML = `<button type="button" class="ux-back" data-ux-go="${esc(par && destOf(d.p) ? d.p : 'dashboard')}" aria-label="Back">${I.back}<span>Back</span></button>
        <ol><li><button type="button" data-ux-go="dashboard">Dashboard</button></li>${par ? `<li><button type="button" data-ux-go="${esc(d.p)}">${esc(par.t)}</button></li>` : ''}<li aria-current="page">${esc(d ? d.t : headingOf(name))}</li></ol>`;
      v.prepend(c);
      c.addEventListener('click', (e) => { const b = e.target.closest('[data-ux-go]'); if (b) go(b.dataset.uxGo); });
    });
  }

  /* ───── revision guide: section reading tracker + deep links ───── */
  function guideRoot() { return $('#view-guide.active') || $('section.view.active[id*="guide"]'); }
  function guideHeadings(root, includeHidden) {
    return $$('h2, h3, h4, [id^="guide-aim-"]', root)
      .filter(h => (includeHidden || h.offsetParent !== null) && (h.textContent || '').trim().length > 2 && !h.closest('.ux-crumb, .ux-hub, nav, .ux-gate'));
  }
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80); }
  function headingId(h) { return h.id || (h.closest('[id]') && h.closest('[id]').id !== 'view-guide' ? h.closest('[id]').id + ':' : '') + slug(h.textContent); }
  const dwell = {};
  const guideLogged = new Set();
  function sampleGuide() {
    if (document.visibilityState !== 'visible') return;
    const root = guideRoot(); if (!root) return;
    const hs = guideHeadings(root);
    if (!hs.length) return;
    const s = stats();
    if (hs.length > (s.guideTotal || 0)) { bump(x => { x.guideTotal = hs.length; }); }
    // the section being read = the last heading above 45% of the viewport
    const line = window.innerHeight * 0.45;
    let cur = null;
    for (const h of hs) { if (h.getBoundingClientRect().top <= line) cur = h; else break; }
    if (!cur) cur = hs[0].getBoundingClientRect().top < window.innerHeight ? hs[0] : null;
    if (!cur) return;
    const id = headingId(cur), title = cur.textContent.trim().replace(/\s+/g, ' ').slice(0, 160);
    dwell[id] = (dwell[id] || 0) + 3;
    if (dwell[id] >= 9 && !guideLogged.has(id)) {
      guideLogged.add(id);
      bump(x => { x.guide = x.guide || {}; x.guide[id] = Date.now(); });
      store.set('lastguide_' + unitKey, JSON.stringify({ id, t: title }));
      track('guide_section', { ref: id, title, view: 'guide' });
    }
  }
  function openGuideSection(id, title) {
    go(destOf('guide') ? 'guide' : 'revise');
    let tries = 0;
    const seek = () => {
      const root = guideRoot();
      let el = id ? document.getElementById(id.split(':').pop()) || document.getElementById(id) : null;
      if (!el && root && (id || title)) {
        const want = slug(title || id.split(':').pop());
        el = guideHeadings(root).find(h => slug(h.textContent) === want || slug(h.textContent).indexOf(want) === 0) || null;
        if (!el && id && id.indexOf(':') > 0) el = document.getElementById(id.split(':')[0]);
      }
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ux-flash'); setTimeout(() => el.classList.remove('ux-flash'), 2200);
        return;
      }
      if (++tries < 12) setTimeout(seek, 250);
    };
    setTimeout(seek, 250);
  }

  /* ───── activity tracking hooks ───── */
  const quiet = params.has('ra10catalog');   // hidden catalogue frame for teachers: never record activity
  function track(kind, f) { if (quiet) return; try { if (window.RA10Track) RA10Track.log(kind, f || {}); } catch (e) {} }
  const QSEL = '.pp-qtext, .quiz-q, .question-text, .q-text, .qtext, .practice-question, .question-body, .q-body, .pq-text, .question h3, .question h4, h3, h4';
  function questionTextFor(el) {
    // walk up a few levels, and in each look backwards for the question text that sits above the box
    let node = el;
    for (let depth = 0; node && depth < 7; depth++, node = node.parentElement) {
      let sib = node.previousElementSibling;
      for (let k = 0; sib && k < 8; k++, sib = sib.previousElementSibling) {
        const hit = sib.matches && sib.matches(QSEL) ? sib : (sib.querySelector ? Array.from(sib.querySelectorAll(QSEL)).pop() : null);
        if (hit && hit.textContent.trim().length > 12) return hit.textContent.trim().replace(/\s+/g, ' ');
      }
    }
    return '';
  }
  function hookAnswers() {
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (!t || !t.matches || !t.matches('textarea, input[type="text"], input:not([type])')) return;
      if (t.closest('.ux-menu, .ux-hub, .ux-edu, [data-no-track]') || /search|filter/i.test((t.id || '') + ' ' + (t.name || '') + ' ' + (t.placeholder || ''))) return;
      const v = String(t.value || '').trim();
      if (v.length < 3) return;
      const page = t.closest('.pp-page');
      const q = questionTextFor(t);
      track('answer', { title: q || (t.getAttribute('aria-label') || t.placeholder || 'Written answer'), answer: v, ref: (page && page.id) || t.id || null, meta: { words: v.split(/\s+/).length } });
      bump(s => { s.q = (s.q || 0) + 1; });
    }, true);
    // multiple-choice: when an option is revealed (locked), log the choice once per question
    const seenMcq = new Set();
    const scanMcq = () => {
      $$('.quiz-card').forEach(card => {
        if (!$('.quiz-option.locked', card)) return;
        const qText = ($('.quiz-q', card) || {}).textContent || '';
        const id = (($('.tag.id', card) || {}).textContent || '').trim() || slug(qText).slice(0, 40);
        if (!qText || seenMcq.has(id + qText.length)) return;
        seenMcq.add(id + qText.length);
        const wrong = $('.quiz-option.wrong', card), right = $('.quiz-option.correct', card);
        const chosen = wrong || right;
        const ok = !wrong;
        const tags = $$('.quiz-meta .tag', card).map(x => x.textContent.trim());
        track('mcq', { ref: id, title: qText.trim(), answer: chosen ? (($('.opt-text', chosen) || chosen).textContent || '').trim() : '', score: ok ? 1 : 0, max_score: 1, meta: { aim: tags[1] || null, topic: tags[2] || null } });
        bump(s => { s.mcq = (s.mcq || 0) + 1; if (ok) s.mcqOk = (s.mcqOk || 0) + 1; });
      });
    };
    let mcqT = null;
    new MutationObserver(() => { clearTimeout(mcqT); mcqT = setTimeout(scanMcq, 150); }).observe(document.body, { childList: true, subtree: true });
    // papers opened from the library
    document.addEventListener('click', (e) => {
      const b = e.target.closest('.pp-card .btn.primary, .pp-card-actions .btn');
      if (!b) return;
      const card = b.closest('.pp-card');
      const title = card && $('h3', card) ? $('h3', card).textContent.trim() : '';
      if (/pdf/i.test(b.textContent)) return;
      track('paper_open', { ref: slug(title), title, meta: { series: card && $('.pp-series', card) ? $('.pp-series', card).textContent.trim() : null } });
      bump(s => { s.papers = s.papers || {}; s.papers[slug(title)] = 1; });
    }, true);
  }
  // Every AI Examiner mark: the exact question, what was written and the score.
  function hookExaminer() {
    const R = window.RA10;
    if (!R || typeof R.examineAnswer !== 'function' || R.examineAnswer.__uxWrapped) return !!(R && R.examineAnswer && R.examineAnswer.__uxWrapped);
    const orig = R.examineAnswer;
    const wrapped = async function (input) {
      const res = await orig.apply(this, arguments);
      try {
        const q = (input && input.question) || {};
        const r = (res && res.result) || {};
        const max = Number(r.total || r.max || q.marks || 0) || null;
        track('ai_examine', {
          ref: q.id || null, title: q.question || q.text || '', answer: (input && input.answer) || '',
          score: Number.isFinite(Number(r.earned)) ? Number(r.earned) : null, max_score: max,
          meta: { topic: q.topic || null, aim: q.learning_aim || null, paper: q.paper_id || null, verb: q.command_verb || null, image: !!(input && input.image) }
        });
        bump(s => { s.ai = (s.ai || 0) + 1; });
      } catch (e) {}
      return res;
    };
    wrapped.__uxWrapped = true;
    R.examineAnswer = wrapped;
    return true;
  }

  /* ───── sign-in needed to download or print ───── */
  function signedIn() { try { return !!(window.RA10 && RA10.isLoggedIn && RA10.isLoggedIn()); } catch (e) { return false; } }
  function askSignIn(what) {
    if (document.querySelector('.ux-gate')) return;
    const ov = document.createElement('div');
    ov.className = 'ux-gate';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.innerHTML = `<div class="ux-gate-card"><span class="ux-gate-ico">${I.lock}</span><h3>Sign in to ${esc(what || 'download')}</h3>
      <p>Downloading and printing papers, guides and booklets is free for everyone with an RA10 account.</p>
      <div class="ux-gate-act"><button type="button" class="ux-gate-no">Not now</button><button type="button" class="ux-gate-yes">Sign in free</button></div></div>`;
    document.documentElement.appendChild(ov);
    try { ov.style.fontFamily = getComputedStyle(document.body).fontFamily; } catch (e) {}
    const close = () => ov.remove();
    ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('.ux-gate-no')) close(); });
    $('.ux-gate-yes', ov).addEventListener('click', () => {
      close();
      try { if (window.top && typeof window.top.openSignInOverlayFallback === 'function') { window.top.openSignInOverlayFallback(); return; } } catch (e) {}
      try { if (window.RA10 && RA10.showPaywall) { RA10.showPaywall('login', 'download'); return; } } catch (e) {}
      try { window.top.location.href = '/auth'; } catch (e) { location.href = '/auth'; }
    });
    $('.ux-gate-yes', ov).focus();
  }
  // RA10UnitUI.requireSignIn('download') → true when allowed, otherwise shows the prompt.
  function requireSignIn(what) {
    if (signedIn()) { track('download', { title: what || 'download' }); return true; }
    askSignIn(what);
    return false;
  }
  function gateDownloads() {
    const origPrint = window.print ? window.print.bind(window) : null;
    if (origPrint && !window.print.__uxGate) {
      const p = function () { if (requireSignIn('print')) origPrint(); };
      p.__uxGate = true;
      window.print = p;
    }
    // jsPDF is loaded on demand by the paper viewers: gate its save()
    const patchPdf = () => {
      const J = window.jspdf && window.jspdf.jsPDF;
      if (!J || !J.API || J.API.__uxGate) return;
      const save = J.API.save;
      J.API.save = function () { if (!requireSignIn('download this PDF')) return this; return save.apply(this, arguments); };
      J.API.__uxGate = true;
    };
    let tries = 0;
    const iv = setInterval(() => { patchPdf(); if (++tries > 600) clearInterval(iv); }, 1000);
    document.addEventListener('click', patchPdf, true);
    // image / file download links (diagram exports, booklet PDFs)
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[download], a[href$=".pdf"], a[href*=".pdf?"]');
      if (a && !signedIn()) { e.preventDefault(); e.stopPropagation(); askSignIn('download'); }
    }, true);
    const origClick = HTMLAnchorElement.prototype.click;
    if (!origClick.__uxGate) {
      const c = function () { if (this.hasAttribute('download') && !signedIn()) { askSignIn('download'); return; } return origClick.apply(this, arguments); };
      c.__uxGate = true;
      HTMLAnchorElement.prototype.click = c;
    }
    // Ctrl+P / browser print when signed out prints a sign-in notice instead of the content
    const syncPrintFlag = () => document.documentElement.classList.toggle('ux-signed-out', !signedIn());
    syncPrintFlag();
    window.addEventListener('beforeprint', syncPrintFlag);
    try { window.RA10 && RA10.on && RA10.on('authchange', syncPrintFlag); } catch (e) {}
    setTimeout(syncPrintFlag, 2500);
  }

  /* ───── RA10 EDU (assignments, catalogue) — loaded only when needed ───── */
  function eduNeeded() {
    if (params.has('ra10catalog') || params.has('assignment')) return true;
    try { const p = JSON.parse(localStorage.getItem('ra10_edu_pending') || 'null'); if (p && Date.now() - p.ts < 10 * 60 * 1000) return true; } catch (e) {}
    try { const prof = window.RA10 && RA10.getProfile && RA10.getProfile(); if (prof && /^school_/.test(String(prof.tier || '')) || (prof && prof.school_id)) return true; } catch (e) {}
    return false;
  }
  let eduLoading = false;
  function loadEdu() {
    if (eduLoading || window.RA10UnitEdu) return;
    eduLoading = true;
    const s = document.createElement('script');
    const me = Array.from(document.scripts).map(x => x.src).find(src => /\/shared\/unit-ui\.js/.test(src)) || '';
    s.src = me ? me.replace(/unit-ui\.js(\?.*)?$/, 'unit-edu.js?v=20261126') : '/revision/shared/unit-edu.js?v=20261126';
    document.head.appendChild(s);
  }

  /* ───── state sync ───── */
  // Keep the highlighted unit tab visible in the swipeable mobile tab strip.
  function centerActiveTab() {
    const t = $('.topbar .tabs .tab.active'); const strip = $('.topbar .tabs');
    if (!t || !strip || strip.scrollWidth <= strip.clientWidth) return;
    const dx = t.getBoundingClientRect().left - strip.getBoundingClientRect().left;
    strip.scrollTo({ left: Math.max(0, strip.scrollLeft + dx - (strip.clientWidth - t.offsetWidth) / 2), behavior: 'smooth' });
  }
  // Inside the site the unit header is a slim sticky tab bar. Anything else the unit pins to the
  // top (guide sidebar, guide header, paper toolbars…) must sit below it, not slide underneath.
  let stickyT = null;
  function offsetStickies() {
    if (!document.documentElement.classList.contains('ux-embedded')) return;
    const tb = $('.topbar');
    const h = tb ? Math.round(tb.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--ux-header-h', h + 'px');
    const list = [];
    $$('body *').forEach(el => {
      if (el === tb || (tb && tb.contains(el)) || el.closest('.ux-menu, .ux-bottom')) return;
      const cs = getComputedStyle(el);
      if (cs.position !== 'sticky') return;
      if (el.dataset.uxTop === undefined) el.dataset.uxTop = cs.top === 'auto' ? '' : String(parseFloat(cs.top) || 0);
      if (el.dataset.uxTop !== '') list.push(el);
    });
    const pin = (el, px) => { const want = px + 'px'; if (el.style.top !== want) el.style.setProperty('top', want, 'important'); };
    if (h) { list.forEach(el => pin(el, h + Number(el.dataset.uxTop))); return; }
    // No unit header (the site navbar sits above the frame): tops that were sized to clear the old
    // header would leave panels pinned mid-screen, so lift each view's stickies to the top of the frame.
    const groups = new Map();
    list.forEach(el => {
      if (Number(el.dataset.uxTop) < 60) return;
      const g = el.closest('section.view') || document.body;
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(el);
    });
    groups.forEach(els => {
      const shift = Math.min(...els.map(el => Number(el.dataset.uxTop))) - 10;
      els.forEach(el => pin(el, Number(el.dataset.uxTop) - shift));
    });
  }
  function scheduleStickies() { clearTimeout(stickyT); stickyT = setTimeout(offsetStickies, 120); }

  // Tell the site navbar which section is showing, so its button can read e.g. "Past Papers ▾".
  function tellShellView() {
    if (!embedded) return;
    const d = destOf(current);
    const title = d && d.t ? d.t : (current === 'dashboard' ? 'Dashboard' : String(current || '').replace(/^\w/, c => c.toUpperCase()));
    try { window.parent.postMessage({ type: 'ra10:unit-view', name: current, title }, location.origin); } catch (e) {}
  }

  let viewStart = { name: null, t: Date.now() };
  function sync() {
    const prev = current;
    current = activeName();
    const d = destOf(current);
    const p = d ? d.p : current;
    $$('.ux-bottom [data-ux-go]').forEach(b => {
      const on = b.dataset.uxP === p || b.dataset.uxGo === current;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    document.documentElement.setAttribute('data-ux-view', current);
    centerActiveTab();
    tellShellView();
    scheduleStickies(); setTimeout(offsetStickies, 900);
    if (current !== 'dashboard' && current !== 'home') store.set('last_' + unitKey, current);
    refreshCounts();
    if (prev !== current || viewStart.name === null) {
      if (viewStart.name && viewStart.name !== current) {
        const secs = (Date.now() - viewStart.t) / 1000;
        if (secs >= 3) track('view', { view: viewStart.name, title: (destOf(viewStart.name) || {}).t || viewStart.name, duration_s: secs });
      }
      viewStart = { name: current, t: Date.now() };
      if (current === 'dashboard' || current === 'home') scheduleHeroPaint();
    }
  }

  function init() {
    if (!viewNames().length && !$$('.tabs .tab').length) return;
    document.documentElement.classList.add('ux-unit');
    if (embedded) document.documentElement.classList.add('ux-embedded');
    // The credits widget is retired (everyone has unlimited credits): hide the unit's own copy
    // (it is shown with an inline !important style, which CSS can't override).
    const hideChip = () => $$('.topbar > div[id$="credit-chip"]').forEach(el => el.style.setProperty('display', 'none', 'important'));
    hideChip(); setTimeout(hideChip, 1500); setTimeout(hideChip, 4000);
    buildDests();
    addJumpButton(); addHeaderMenuButton();
    addBottomNav();
    launchpad();
    crumbs();
    sync();
    hookAnswers();
    gateDownloads();
    if (!hookExaminer()) { let n = 0; const iv = setInterval(() => { if (hookExaminer() || ++n > 40) clearInterval(iv); }, 500); }
    setInterval(sampleGuide, 3000);
    const mo = new MutationObserver(() => sync());
    $$('section.view').forEach(v => mo.observe(v, { attributes: true, attributeFilter: ['class'] }));
    $$('.tabs .tab').forEach(t => mo.observe(t, { attributes: true, attributeFilter: ['class'] }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    // data finishes loading after first paint in some apps
    [600, 1800, 4000].forEach(ms => setTimeout(refreshCounts, ms));
    if (typeof window.onDataReady === 'function') { try { window.onDataReady(refreshCounts); } catch (e) {} }
    // EDU features (assignments, catalogue for teachers)
    if (eduNeeded()) loadEdu();
    else setTimeout(() => { if (eduNeeded()) loadEdu(); }, 3500);
    window.addEventListener('storage', (e) => { if (e.key === 'ra10_edu_pending' && e.newValue) loadEdu(); });
    try { window.RA10 && RA10.on && RA10.on('authchange', () => { scheduleHeroPaint(); if (eduNeeded()) loadEdu(); }); } catch (e) {}
    // Tell the site shell we're painted, so it can drop its loading skeleton.
    if (embedded) { try { window.parent.postMessage({ type: 'ra10:unit-ready' }, location.origin); } catch (e) {} }
  }

  window.RA10UnitUI = { go, open: openMenu, close: closeMenu, destinations: () => dests.slice(), requireSignIn, openGuideSection, appData, track, bump, guideHeadings, slug, headingId, esc, icons: I };
  // The site navbar's "Jump to" button (in the parent page) asks us to open the menu.
  if (document.documentElement.classList.contains('ux-embedded') || embedded) {
    window.addEventListener('resize', scheduleStickies);
    let moQueued = false;
    new MutationObserver(() => { if (moQueued) return; moQueued = true; setTimeout(() => { moQueued = false; offsetStickies(); }, 1200); })
      .observe(document.documentElement, { childList: true, subtree: true });
  }
  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data) return;
    if (e.data.type === 'ra10:unit-open-menu') { openMenu(); return; }
    if (e.data.type === 'ra10:edu-open' && e.data.pending) {
      window.__ra10EduPending = e.data.pending;
      if (window.RA10UnitEdu && RA10UnitEdu.handle) RA10UnitEdu.handle(e.data.pending);
      else loadEdu();
    }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  else setTimeout(init, 0);
})();
