/* BTEC IT Unit 3 — Website Development — App controller */
'use strict';

const VIEW_IDS = ['dashboard', 'revise', 'guide', 'quiz', 'flash', 'spec', 'tools', 'wireframe', 'sitemap', 'snippets', 'editor', 'assignment', 'ai', 'progress'];
// Sub-views keep their parent topbar tab highlighted.
const PARENT_TAB = {
  guide: 'revise', spec: 'revise', quiz: 'revise', flash: 'revise',
  wireframe: 'tools', sitemap: 'tools', snippets: 'tools', editor: 'tools'
};

/* ── Streak tracking (shared key used across all units) ──── */
const STREAK_DATES_KEY = 'ra10_streak_dates';
function todayKey() { return new Date().toISOString().slice(0, 10); }
function getStreakDates() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STREAK_DATES_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)) : [];
  } catch (e) { return []; }
}
function saveStreakDates(dates) {
  const unique = Array.from(new Set((dates || []).filter(Boolean))).sort();
  localStorage.setItem(STREAK_DATES_KEY, JSON.stringify(unique.slice(-90)));
}
function markTodayVisitForStreak() {
  if (!window.RA10 || !RA10.isLoggedIn()) return;
  const today = todayKey();
  const dates = getStreakDates();
  if (!dates.includes(today)) { dates.push(today); saveStreakDates(dates); }
}
function calcLocalStreak() {
  const dates = new Set(getStreakDates());
  let streak = 0;
  const cursor = new Date(todayKey() + 'T00:00:00');
  while (dates.has(cursor.toISOString().slice(0, 10))) { streak++; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}

function switchTab(name) {
  // Block desktop-only tools on phones (also guards direct navigation).
  if (DESKTOP_TOOLS[name] && isMobileDevice()) {
    showMobileToolNotice(DESKTOP_TOOLS[name]);
    name = 'tools';
  }
  const parent = PARENT_TAB[name] || name;
  document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === parent); });
  VIEW_IDS.forEach(function (id) {
    const el = document.getElementById('view-' + id);
    if (el) el.classList.toggle('active', id === name);
  });
  // Full-bleed tools (wireframe, code editor, AI Assigner) fill the screen below the topbar.
  document.body.classList.remove('ed-fullscreen');
  var FULL_VIEWS = ['wireframe', 'editor', 'ai'];
  document.body.classList.toggle('tool-full', FULL_VIEWS.indexOf(name) !== -1);
  if (name === 'revise' && window.initRevise) window.initRevise();
  if (name === 'guide' && window.initComprehensiveGuide) window.initComprehensiveGuide();
  if (name === 'quiz' && window.initQuiz) window.initQuiz();
  if (name === 'flash' && window.initFlash) window.initFlash();
  if (name === 'spec' && window.renderUnit3Spec) window.renderUnit3Spec();
  if (name === 'wireframe' && window.initWireframeTool) window.initWireframeTool();
  if (name === 'sitemap' && window.initSitemapTool) window.initSitemapTool();
  if (name === 'snippets' && window.initSnippets) window.initSnippets();
  if (name === 'editor' && window.initCodeEditor) window.initCodeEditor();
  if (name === 'assignment' && window.initAssignmentHub) window.initAssignmentHub();
  if (name === 'ai' && window.initAiAssigner) window.initAiAssigner();
  if (name === 'progress') renderProgress();
  if (name === 'dashboard') renderAimGrid();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/* ── Desktop-only tools: wireframe, sitemap & code editor ──
   These need a large screen (drag-and-drop canvas, split panes).
   On phones we block them and show a friendly notice instead. */
var DESKTOP_TOOLS = { wireframe: 'Wireframe Designer', sitemap: 'Sitemap Builder', editor: 'Code Editor' };
function isMobileDevice() {
  return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
}
function showMobileToolNotice(toolName) {
  var existing = document.getElementById('mobile-tool-notice');
  if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.id = 'mobile-tool-notice';
  overlay.className = 'mobile-tool-notice-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', toolName + ' not available on mobile');
  overlay.innerHTML =
    '<div class="mobile-tool-notice">' +
      '<div class="mobile-tool-notice-ico">&#x1F4F1;</div>' +
      '<div class="mobile-tool-notice-body">' +
        '<b>' + toolName + ' is available on desktop and tablet</b>' +
        '<p>This tool needs a larger screen to work properly. Open RA10 on a computer or tablet to use it.</p>' +
      '</div>' +
      '<div class="mobile-tool-notice-actions">' +
        '<button class="btn" type="button" data-goto="tools">Back to tools</button>' +
        '<button class="btn ghost" type="button" data-close="1">Close</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
  overlay.querySelector('[data-goto="tools"]').addEventListener('click', function () { close(); switchTab('tools'); });
  overlay.querySelector('[data-close="1"]').addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { document.removeEventListener('keydown', esc); close(); }
  });
}
// Intercept the desktop-only tools before they open.
document.addEventListener('click', function (e) {
  var btn = e.target.closest('[data-goto="wireframe"], [data-goto="sitemap"], [data-goto="editor"]');
  if (!btn) return;
  if (isMobileDevice()) {
    e.preventDefault();
    e.stopPropagation();
    showMobileToolNotice(DESKTOP_TOOLS[btn.dataset.goto]);
  }
}, true);

/* ── Raise an action cost label for gates */
function ra10GateCheck(action) {
  if (typeof ra10Gate === 'function') return ra10Gate(action);
  return true;
}

/* ── Dashboard aim grid ───────────────────────────────────── */
function renderAimGrid() {
  const host = document.getElementById('aim-grid');
  if (!host) return;
  const aims = [
    { code: 'A', title: 'Principles & planning', sub: 'Purpose, layout, navigation, UX, legal/ethical, site maps', tasks: 'Task 1' },
    { code: 'B', title: 'Design & assets', sub: 'Wireframes, visual style, fitness-for-purpose review, asset management', tasks: 'Task 2' },
    { code: 'C', title: 'Build & test', sub: 'HTML/CSS/JS, accessibility, SEO, functionality + usability testing', tasks: 'Task 3' }
  ];
  host.innerHTML = aims.map(function (a) {
    return '<button class="aim-card" type="button" data-goto="guide" data-aim="' + a.code + '">' +
      '<span class="ac-badge">' + a.code + '</span>' +
      '<span class="ac-title">' + a.title + '</span>' +
      '<span class="ac-sub">' + a.sub + '</span>' +
      '<span class="ac-steps">Assignment: ' + a.tasks + ' →</span>' +
      '</button>';
  }).join('');
  host.querySelectorAll('.aim-card').forEach(function (card) {
    card.addEventListener('click', function () {
      switchTab('guide');
      setTimeout(function () {
        if (typeof window.guideScrollTo === 'function') window.guideScrollTo('guide-aim-' + card.dataset.aim);
      }, 120);
    });
  });
}

/* ── Wire up data-goto buttons ────────────────────────────── */
function bindGoto() {
  document.querySelectorAll('[data-goto]').forEach(function (b) {
    b.addEventListener('click', function () {
      const aim = b.getAttribute('data-aim');
      if (aim) {
        switchTab('guide');
        setTimeout(function () {
          if (typeof window.guideScrollTo === 'function') window.guideScrollTo('guide-aim-' + aim);
        }, 120);
        return;
      }
      switchTab(b.dataset.goto);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { switchTab(t.dataset.tab); });
  });
  bindGoto();
  renderAimGrid();
  markTodayVisitForStreak();
});

/* ── Progress tab: local revision progress ───────────────── */
function renderProgress() {
  const host = document.getElementById('progress-content');
  if (!host) return;
  const gate = document.getElementById('progress-gate');
  if (!window.RA10 || !RA10.isLoggedIn()) {
    if (gate) gate.style.display = 'block';
    host.style.display = 'none';
    const btn = document.getElementById('btn-progress-signin');
    if (btn) btn.onclick = function () { window.top && window.top.postMessage({ type: 'RA10_OPEN_AUTH' }, '*'); };
    return;
  }
  if (gate) gate.style.display = 'none';
  host.style.display = 'block';

  const streak = calcLocalStreak();
  // Guide aims revised (from guide.js store)
  let aimsRevised = 0;
  try { aimsRevised = (JSON.parse(localStorage.getItem('ra10-guide-revised-IT-u3') || '[]') || []).length; } catch (e) {}
  // Flashcards known (from revise.js store)
  let flashKnown = 0;
  try { flashKnown = Object.keys(JSON.parse(localStorage.getItem('ra10_u3_flash_known') || '{}') || {}).filter(function (k) { return JSON.parse(localStorage.getItem('ra10_u3_flash_known'))[k]; }).length; } catch (e) {}
  const totalFlash = (window.FLASHCARDS && window.FLASHCARDS.length) || 0;
  // Best quiz score (from revise.js)
  const bestQuiz = Number(localStorage.getItem('ra10_u3_best_quiz') || 0);
  // Assignment tasks completed (from assignment.js)
  let tasksDone = 0;
  try { tasksDone = (JSON.parse(localStorage.getItem('ra10_u3_assignment_tasks') || '[]') || []).length; } catch (e) {}

  const stats = [
    ['🔥 Streak', streak + ' day' + (streak === 1 ? '' : 's')],
    ['Aims revised', aimsRevised + ' / 3'],
    ['Flashcards known', flashKnown + (totalFlash ? ' / ' + totalFlash : '')],
    ['Best quiz', bestQuiz ? bestQuiz + '%' : '—'],
    ['Assignment tasks', tasksDone + ' / 3']
  ];

  host.innerHTML =
    '<div class="prog-mini-grid">' +
      stats.map(function (s) {
        return '<div class="prog-mini-card"><div class="v">' + s[1] + '</div><div class="k">' + s[0] + '</div></div>';
      }).join('') +
    '</div>' +
    '<div class="prog-aim-accuracy">' +
      '<h3>Study guide progress</h3>' +
      '<div class="prog-aim-row"><div class="meta"><span>Aims A, B &amp; C revised</span><span>' + aimsRevised + ' / 3</span></div>' +
      '<div class="bar ' + (aimsRevised >= 3 ? 'good' : aimsRevised >= 1 ? 'mid' : 'bad') + '"><span style="width:' + Math.round(aimsRevised / 3 * 100) + '%"></span></div></div>' +
      '<p class="muted small" style="margin-top:10px">Mark each aim as revised in the study guide to track it here.</p>' +
    '</div>' +
    '<div class="prog-empty">' +
      '<p style="margin:0">Complete quizzes, review flashcards and mark guide aims to build your progress. Your streak grows each day you revise.</p>' +
    '</div>';
}

window.renderUnit3Spec = function () {
  const host = document.getElementById('spec-content');
  if (!host) return;
  host.innerHTML = Object.keys(SPEC).map(function (aim) {
    const s = SPEC[aim];
    return '<div class="spec-aim">' +
      '<h3><span class="sp-code">Aim ' + aim + '</span> ' + esc(s.title) + '</h3>' +
      '<p class="muted small">' + esc(s.short) + '</p>' +
      '<p class="small" style="font-weight:700;color:var(--part2)">' + esc(s.tasks) + '</p>' +
      s.topics.map(function (t) {
        return '<div class="spec-topic"><h4>' + esc(t.code) + ' — ' + esc(t.name) + '</h4>' +
          '<ul>' + topicBullets(t.code) + '</ul>' +
          '<p><button class="spec-goto" data-guide="' + esc(t.guide) + '">Open this topic in the study guide →</button></p></div>';
      }).join('') +
      '</div>';
  }).join('');
  host.querySelectorAll('.spec-goto').forEach(function (btn) {
    btn.addEventListener('click', function () {
      switchTab('guide');
      setTimeout(function () {
        if (typeof window.guideScrollTo === 'function') window.guideScrollTo(btn.dataset.guide);
      }, 120);
    });
  });
};

function topicBullets(code) {
  const bullets = {
    'A1': ['Purpose of websites: eCommerce, information, promotion, entertainment', 'Target audience: demographics and user personas', 'Page layout: F-shaped and Z-shaped patterns, grid, visual hierarchy, grouping and separating content', 'Navigation: fixed/sticky, vertical, hamburger, logical navigation', 'Content: written, visual, calls-to-action', 'Design: typography and colour scheme', 'User experience: accessibility, consistency, user-friendly, use of motion', 'Dynamic websites and cross-browser compatibility', 'Search engine optimisation'],
    'A2': ['Establishing client requirements: purpose, audience, technical requirements', 'Research: existing websites, content ideas, resources, legal and ethical constraints', 'Structuring the website: site map (pages, content and features, navigation)'],
    'B1': ['Creating wireframes: tools and techniques (hierarchy, balance, grouping, alignment, dimensions)', 'Design ideas: visual style (colour palette, branding, typography)', 'Reviewing fitness for purpose: clarity, detail, user experience, client requirements'],
    'B2': ['Creating assets: headlines and copy, image editing/manipulation, vector graphics', 'Sourcing assets: copy, stock images, icons, video', 'Preparing assets: trim video, compression, file formats', 'Managing assets: folder structure, naming conventions'],
    'C1': ['HTML: navigation, content (text, images, video, tables), forms', 'CSS: styling, box model, responsive layouts (media queries, layout tools)', 'JavaScript: sliders, galleries, accordions, tabs, modals, filters, animation, search, shopping cart, maps, video control'],
    'C2': ['Accessibility: alt text, zoom, text-to-speech; WCAG, W3C and HTML5 standards; semantic HTML', 'Search engine optimisation', 'Self-review and publishing'],
    'C3': ['Functionality testing: test plan, links, interactivity, responsiveness', 'Usability testing: user audit, accessibility, navigation, clarity, user experience']
  };
  return (bullets[code] || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; });
}