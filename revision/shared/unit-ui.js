/* RA10 — unified unit UI (all subjects). Adds, without touching each app's own code:
     • a "Jump to" quick-navigation menu (grouped, keyboard accessible; bottom sheet on phones)
     • a mobile bottom navigation bar (Home · Papers/Practise · Revise · Progress · Menu)
     • a launchpad dashboard: big, consistent tiles with live counts and a "continue where you left off" card
     • breadcrumbs with a back button on every sub-view
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
    spec: ICON('<path d="M4 6h16M4 12h16M4 18h10"/>'),
    calculator: ICON('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/>'),
    progress: ICON('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    menu: ICON('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    chevron: ICON('<path d="m6 9 6 6 6-6"/>'),
    back: ICON('<path d="M15 6l-6 6 6 6"/>'),
    spark: ICON('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
    tools: ICON('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>')
  };

  // Destinations: meta for every view name we know about. Views not listed here are derived from their heading.
  const META = {
    dashboard: { t: 'Dashboard', d: 'Your study hub', i: 'home', g: 'Start', p: 'dashboard' },
    home: { t: 'Home', d: 'Your study hub', i: 'home', g: 'Start', p: 'dashboard' },
    papers: { t: 'Past Papers', d: 'Past papers and RA10 Papers: answer online, AI marking, PDF', i: 'papers', g: 'Practise', p: 'papers', feat: 1 },
    pastpapers: { t: 'Past Papers', d: 'Past papers and RA10 Papers: answer online, AI marking, PDF', i: 'papers', g: 'Practise', p: 'questions', feat: 1 },
    practice: { t: 'Practise by topic', d: 'Filter by topic, marks and type', i: 'practice', g: 'Practise', p: 'questions' },
    questions: { t: 'Questions', d: 'Practice, browse and mock papers', i: 'practice', g: 'Practise', p: 'questions', parent: 1 },
    browse: { t: 'Question bank', d: 'Every question with its mark scheme', i: 'browse', g: 'Practise', p: 'questions' },
    mock: { t: 'Mock paper', d: 'A timed random paper', i: 'mock', g: 'Practise', p: 'questions' },
    quiz: { t: 'Quick quiz', d: 'Multiple choice with explanations', i: 'quiz', g: 'Revise', p: 'revise' },
    flash: { t: 'Flashcards', d: 'Terms, formulae and key facts', i: 'flash', g: 'Revise', p: 'revise' },
    guide: { t: 'Revision guide', d: 'Diagrams, examples and exam tips', i: 'guide', g: 'Revise', p: 'revise', feat: 1 },
    spec: { t: 'Specification', d: 'Content mapped to questions', i: 'spec', g: 'Revise', p: 'revise' },
    revise: { t: 'Revise', d: 'Guide, flashcards, quiz', i: 'guide', g: 'Revise', p: 'revise', parent: 1 },
    calculator: { t: 'Calculator', d: 'Finance tools and formulae', i: 'calculator', g: 'Revise', p: 'calculator' },
    progress: { t: 'Progress', d: 'Scores, streaks and weak topics', i: 'progress', g: 'Track', p: 'progress' }
  };
  const GROUP_ORDER = ['Start', 'Practise', 'Revise', 'Tools', 'Track'];

  const store = {
    get(k) { try { return localStorage.getItem('ra10_ux_' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('ra10_ux_' + k, v); } catch (e) {} }
  };
  const unitKey = (location.pathname || '').replace(/[^a-z0-9]+/gi, '_').slice(-40);

  let dests = [];          // [{name, t, d, i, g, p, el}]
  let current = 'dashboard';
  let menu = null, bottom = null, crumbHost = null;

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
      dests.forEach(d => { if (d.name === 'papers') { d.t = 'Predicted Papers'; d.d = 'June 2027 predictions and exam trends'; d.feat = 0; } });
    }
    // a unit that has both 'dashboard' and 'home' keeps one
    if (dests.some(d => d.name === 'dashboard')) dests = dests.filter(d => d.name !== 'home');
    // parents (questions/revise) are shown only if they have no children
    const hasChild = (p) => dests.some(d => !d.parent && d.p === p && d.name !== p);
    dests = dests.filter(d => !(d.parent && hasChild(d.p)));
    const PREF = ['dashboard', 'home', 'pastpapers', 'papers', 'practice', 'browse', 'mock', 'guide', 'flash', 'quiz', 'spec', 'calculator', 'progress'];
    const rank = (d) => { const i = PREF.indexOf(d.name); return i < 0 ? 50 : i; };
    dests.sort((a, b) => (GROUP_ORDER.indexOf(a.g) - GROUP_ORDER.indexOf(b.g)) || (rank(a) - rank(b)));
  }
  const destOf = (n) => dests.find(d => d.name === n);

  /* ───── navigation ───── */
  function go(name) {
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
  const SITE = [['Home', '/index.html#/', 'M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10'], ['Subjects', '/index.html#/revision', 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
    ['Community', '/index.html#/community', 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8'], ['Tasks', '/index.html#/tasks', 'M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
    ['Exams', '/index.html#/exams', 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'], ['Leaderboard', '/index.html#/leaderboard', 'M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0zM7 6H4a2 2 0 0 0 2 3M17 6h3a2 2 0 0 1-2 3']];
  function siteLinksHtml() {
    return `<div class="ux-mgroup ux-site" role="group" aria-label="Around RA10"><p class="ux-mlabel">Around RA10</p><div class="ux-sitegrid">${SITE.map(x => `<a class="ux-sitelink" href="${x[1]}" target="_top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${x[2]}"/></svg><span>${x[0]}</span></a>`).join('')}</div></div>`;
  }
  function openMenu(anchor) {
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
    menu.addEventListener('click', (e) => { const b = e.target.closest('[data-ux-go]'); if (b) go(b.dataset.uxGo); });
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
    b.addEventListener('click', () => openMenu(b));
    tabs.insertAdjacentElement('afterend', b);
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

  /* ───── launchpad dashboard ───── */
  function counts() {
    const c = {};
    try { if (window.FLASHCARDS) c.flash = FLASHCARDS.length + ' cards'; } catch (e) {}
    try { if (window.QUIZ) c.quiz = QUIZ.length + ' questions'; } catch (e) {}
    try { if (window.QUESTIONS) { c.browse = QUESTIONS.length + ' questions'; c.practice = QUESTIONS.length + ' questions'; } } catch (e) {}
    try { const pp = window.AQA_PAPERS || window.BIZ_PAPERS || window.PAPERS; if (pp && pp.length) c.papers = pp.length + ' papers'; } catch (e) {}
    return c;
  }
  function launchpad() {
    const dash = $('#view-dashboard') || $('#view-home');
    if (!dash || $('.ux-launch', dash)) return;
    const wanted = ['pastpapers', 'papers', 'guide', 'practice', 'quiz', 'flash', 'browse', 'mock', 'spec', 'calculator'];
    const tiles = wanted.map(destOf).filter(Boolean);
    dests.filter(d => d.g === 'Tools' && $(`.tabs .tab[data-tab="${d.name}"]`) && !tiles.includes(d)).slice(0, 4).forEach(d => tiles.push(Object.assign({}, d, { d: d.d || 'Open ' + d.t.toLowerCase() })));
    if (!tiles.length) return;
    const c = counts();
    const last = store.get('last_' + unitKey);
    const lastD = last && destOf(last) && last !== 'dashboard' && last !== 'home' ? destOf(last) : null;
    const wrap = document.createElement('section');
    wrap.className = 'ux-launch';
    wrap.setAttribute('aria-label', 'Study launchpad');
    wrap.innerHTML = `
      ${lastD ? `<button type="button" class="ux-resume" data-ux-go="${esc(lastD.name)}"><span class="ux-ricon">${I[lastD.i] || I.tools}</span><span><small>Continue where you left off</small><b>${esc(lastD.t)}</b></span><em>Resume →</em></button>` : ''}
      <div class="ux-grid">${tiles.map((d, idx) => `
        <button type="button" class="ux-tile${d.feat || idx === 0 ? ' feat' : ''}${idx === tiles.length - 1 && (tiles.filter(x => !x.feat).length % 2) ? ' wide' : ''}" data-ux-go="${esc(d.name)}" data-tile="${esc(d.name)}">
          <span class="ux-ticon">${I[d.i] || I.tools}</span>
          <span class="ux-ttxt"><b>${esc(d.t)}</b><small>${esc(d.d)}</small><em class="ux-tcount" data-count="${esc(d.name)}">${esc(c[d.name] || '')}</em></span>
        </button>`).join('')}</div>`;
    // collapse the legacy dashboard sections into an accordion (they stay in the DOM so their buttons keep working)
    const legacy = $$(':scope > .dashboard-grid, :scope > .section-block', dash);
    const hero = $(':scope > .hero', dash) || Array.from(dash.children).find(el => !el.classList.contains('ux-launch') && !el.classList.contains('ux-crumb'));
    if (hero) hero.insertAdjacentElement('afterend', wrap); else dash.prepend(wrap);
    if (legacy.length) {
      const det = document.createElement('details');
      det.className = 'ux-more';
      det.innerHTML = '<summary><span>More study tools and topic coverage</span>' + I.chevron + '</summary><div class="ux-morebody"></div>';
      wrap.insertAdjacentElement('afterend', det);
      const body = $('.ux-morebody', det);
      legacy.forEach(el => body.appendChild(el));
      if (window.matchMedia && matchMedia('(min-width: 1100px)').matches && store.get('more_open') === '1') det.open = true;
      det.addEventListener('toggle', () => store.set('more_open', det.open ? '1' : '0'));
    }
    wrap.addEventListener('click', (e) => { const b = e.target.closest('[data-ux-go]'); if (b) go(b.dataset.uxGo); });
  }
  function refreshCounts() {
    const c = counts();
    $$('.ux-tcount').forEach(el => { const k = el.dataset.count; if (c[k]) el.textContent = c[k]; });
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

  /* ───── state sync ───── */
  // Keep the highlighted unit tab visible in the swipeable mobile tab strip.
  function centerActiveTab() {
    const t = $('.topbar .tabs .tab.active'); const strip = $('.topbar .tabs');
    if (!t || !strip || strip.scrollWidth <= strip.clientWidth) return;
    const dx = t.getBoundingClientRect().left - strip.getBoundingClientRect().left;
    strip.scrollTo({ left: Math.max(0, strip.scrollLeft + dx - (strip.clientWidth - t.offsetWidth) / 2), behavior: 'smooth' });
  }
  function sync() {
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
    if (current !== 'dashboard' && current !== 'home') store.set('last_' + unitKey, current);
    refreshCounts();
  }

  function init() {
    if (!viewNames().length && !$$('.tabs .tab').length) return;
    document.documentElement.classList.add('ux-unit');
    try { if (window.self !== window.top) document.documentElement.classList.add('ux-embedded'); } catch (e) { document.documentElement.classList.add('ux-embedded'); }
    buildDests();
    addJumpButton();
    addBottomNav();
    launchpad();
    crumbs();
    sync();
    const mo = new MutationObserver(() => sync());
    $$('section.view').forEach(v => mo.observe(v, { attributes: true, attributeFilter: ['class'] }));
    $$('.tabs .tab').forEach(t => mo.observe(t, { attributes: true, attributeFilter: ['class'] }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    // data finishes loading after first paint in some apps
    [600, 1800, 4000].forEach(ms => setTimeout(refreshCounts, ms));
    if (typeof window.onDataReady === 'function') { try { window.onDataReady(refreshCounts); } catch (e) {} }
  }

  window.RA10UnitUI = { go, open: openMenu, close: closeMenu, destinations: () => dests.slice() };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  else setTimeout(init, 0);
})();
