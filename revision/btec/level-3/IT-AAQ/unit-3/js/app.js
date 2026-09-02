/* BTEC IT Unit 3 — Website Development — App controller */
'use strict';

const VIEW_IDS = ['dashboard', 'guide', 'revise', 'wireframe', 'sitemap', 'editor', 'assignment', 'ai', 'spec'];

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === name); });
  VIEW_IDS.forEach(function (id) {
    const el = document.getElementById('view-' + id);
    if (el) el.classList.toggle('active', id === name);
  });
  // Fullscreen the code editor when it is open
  if (name === 'editor') document.body.classList.add('ed-fullscreen');
  else document.body.classList.remove('ed-fullscreen');
  if (name === 'guide' && window.initComprehensiveGuide) window.initComprehensiveGuide();
  if (name === 'revise' && window.initRevise) window.initRevise();
  if (name === 'wireframe' && window.initWireframeTool) window.initWireframeTool();
  if (name === 'sitemap' && window.initSitemapTool) window.initSitemapTool();
  if (name === 'editor' && window.initCodeEditor) window.initCodeEditor();
  if (name === 'assignment' && window.initAssignmentHub) window.initAssignmentHub();
  if (name === 'ai' && window.initAiAssigner) window.initAiAssigner();
  if (name === 'spec' && window.renderUnit3Spec) window.renderUnit3Spec();
  if (name === 'dashboard') renderAimGrid();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

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
    b.addEventListener('click', function () { switchTab(b.dataset.goto); });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { switchTab(t.dataset.tab); });
  });
  bindGoto();
  renderAimGrid();
});

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