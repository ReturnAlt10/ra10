/* BTEC IT Unit 4 — Relational Database Development — App controller */
'use strict';

const VIEW_IDS = ['dashboard', 'revise', 'guide', 'quiz', 'flash', 'spec', 'tools', 'sql-lab', 'norm-lab', 'access', 'access-lab', 'assignment', 'ai', 'progress'];
// Sub-views keep their parent topbar tab highlighted.
const PARENT_TAB = {
  guide: 'revise', spec: 'revise', quiz: 'revise', flash: 'revise',
  'sql-lab': 'tools', 'norm-lab': 'tools', 'access': 'tools', 'access-lab': 'tools'
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
  const parent = PARENT_TAB[name] || name;
  document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === parent); });
  VIEW_IDS.forEach(function (id) {
    const el = document.getElementById('view-' + id);
    if (el) el.classList.toggle('active', id === name);
  });
  if (name === 'revise' && window.initRevise) window.initRevise();
  if (name === 'guide' && window.initComprehensiveGuide) window.initComprehensiveGuide();
  if (name === 'quiz' && window.initQuiz) window.initQuiz();
  if (name === 'flash' && window.initFlash) window.initFlash();
  if (name === 'spec' && window.renderUnit4Spec) window.renderUnit4Spec();
  if (name === 'sql-lab' && window.initSqlLab) window.initSqlLab();
  if (name === 'norm-lab' && window.initNormLab) window.initNormLab();
  if (name === 'access' && window.initAccessGuide) window.initAccessGuide();
  if (name === 'access-lab' && window.initAccessSim) window.initAccessSim();
  if (name === 'assignment' && window.initAssignmentHub) window.initAssignmentHub();
  if (name === 'ai' && window.initAiAssigner) window.initAiAssigner();
  if (name === 'progress') renderProgress();
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
    { code: 'A', title: 'Principles & normalisation', sub: 'RDBMS, data structures, keys, integrity, relationships, SQL, UNF→3NF', tasks: 'Task 1' },
    { code: 'B', title: 'Design the database', sub: 'ERDs, data dictionary, forms, queries, reports, macros, test plan', tasks: 'Task 2' },
    { code: 'C', title: 'Build, test & optimise', sub: 'Access tools (Design View, Query Design, wizards), relationships, testing, reviewing, optimisation', tasks: 'Task 3' }
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
  try { aimsRevised = (JSON.parse(localStorage.getItem('ra10-guide-revised-IT-u4') || '[]') || []).length; } catch (e) {}
  // Flashcards known (from revise.js store)
  let flashKnown = 0;
  try { flashKnown = Object.keys(JSON.parse(localStorage.getItem('ra10_u4_flash_known') || '{}') || {}).filter(function (k) { return JSON.parse(localStorage.getItem('ra10_u4_flash_known'))[k]; }).length; } catch (e) {}
  const totalFlash = (window.FLASHCARDS && window.FLASHCARDS.length) || 0;
  // Best quiz score (from revise.js)
  const bestQuiz = Number(localStorage.getItem('ra10_u4_best_quiz') || 0);
  // Assignment tasks completed (from assignment.js)
  let tasksDone = 0;
  try { tasksDone = (JSON.parse(localStorage.getItem('ra10_u4_assignment_tasks') || '[]') || []).length; } catch (e) {}

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

window.renderUnit4Spec = function () {
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
    'A1': ['Types of RDBMS: desktop (Access) and server (MySQL, Oracle)', 'Data structure concepts: relation, attribute, domain, tuple, degree, cardinality', 'Relational algebra: union, intersect, join, select', 'Keys: super, candidate, primary, foreign', 'Integrity: entity and referential', 'Relationships: one-to-one, one-to-many, many-to-many'],
    'A2': ['Defining, modifying and removing structures (CREATE/ALTER/DROP)', 'Inserting, updating and deleting data (INSERT/UPDATE/DELETE)', 'Retrieving data for queries and reports (SELECT)'],
    'A3': ['Anomalies: update, insertion, deletion', 'Keys: primary, foreign, composite', 'Referential integrity and the data dictionary', 'Stages: UNF → 1NF → 2NF → 3NF'],
    'A4': ['Purpose: problem to be solved and technical requirements', 'Research: existing databases, structuring data (tables, keys), resources', 'Technical vocabulary and logical structure'],
    'B1': ['ER modelling: conceptual and logical', 'Relational algebra operators: AND, OR, NOT, >, <, >=, <=', 'DBMS selection: desktop vs cloud/server', 'Implementation: prototyping and testing', 'Quality: correctness, relationships, integrity, normalisation'],
    'B2': ['Design specification: requirements, audience, purpose, legal/ethical', 'Data dictionaries, ERDs, normalisation', 'Forms, menus, queries, reports, automation', 'Test plans and implementation timescales'],
    'B3': ['Self-review: suitability, requirements, legal/ethical, consistency', 'Refining ideas and updating the specification'],
    'C1': ['Creating and maintaining tables with SQL', 'Links/relationships and validation rules', 'Outputs: queries, automated queries, reports', 'UI: navigation, forms, subforms; task automation; populating data'],
    'C2': ['Referential integrity and functionality testing', 'Test data: erroneous, extreme, normal', 'Object testing: tables, queries, reports, forms, menus', 'Usability testing and feedback'],
    'C3': ['Review: quality, fitness for purpose, suitability, legal/ethical, strengths and improvements'],
    'C4': ['Data types and data sizes', 'Overheads of many tables and query complexity', 'Query optimisation: select columns, efficient joins/sub-queries']
  };
  return (bullets[code] || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; });
}