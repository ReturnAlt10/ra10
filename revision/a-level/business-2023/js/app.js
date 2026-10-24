// A-Level AQA Business 2023 — Question Bank App
(function() {
'use strict';

// ---------- Utilities ----------
function $(s, p) { return (p || document).querySelector(s); }
function $$(s, p) { return Array.from((p || document).querySelectorAll(s)); }
function el(tag, attrs, ...children) {
  const e = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
  }
  children.flat().forEach(c => {
    if (c == null || c === false) return;
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
}
function escapeHTML(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

// Mulberry32 — seeded RNG
function makeRng(seed) {
  let s = (typeof seed === 'string') ? hashStr(seed) : (seed | 0) || ((Math.random() * 2 ** 32) | 0);
  return function() { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hashStr(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h | 0; }
function shuffle(arr, rng) { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor((rng ? rng() : Math.random()) * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

const modeParam = new URLSearchParams(window.location.search || '').get('mode');
const pathLower = String(window.location.pathname || '').toLowerCase();
const IS_PAPER1_MODE = modeParam === 'paper1' || pathLower.includes('/paper-1/');
window.RA10_BUSINESS_MODE = IS_PAPER1_MODE ? 'paper1' : 'full';
const PAPER_OPTIONS = ['Paper 1', 'Paper 2', 'Paper 3'];
const TOPIC_CODES = Object.keys(SPEC || {}).sort((a, b) => Number(a) - Number(b));
function topicLabel(code) {
  return code ? `3.${code}` : '';
}

// Appendix tables for Paper 2 / Paper 3 contexts.
function renderAppendices(apps) {
  const wrap = el('div', { class: 'appendices' });
  (apps || []).forEach((a) => {
    const box = el('div', { class: 'appendix' });
    box.appendChild(el('p', { class: 'appendix-title' }, a.title || 'Appendix'));
    const tbl = el('table', { class: 'appendix-table' });
    if (Array.isArray(a.headers) && a.headers.some(Boolean)) {
      tbl.appendChild(el('tr', null, ...a.headers.map(h => el('th', null, String(h)))));
    }
    (a.rows || []).forEach(r => tbl.appendChild(el('tr', null, ...r.map(c => el('td', null, String(c))))));
    box.appendChild(tbl);
    if (a.note) box.appendChild(el('p', { class: 'appendix-note' }, a.note));
    wrap.appendChild(box);
  });
  return wrap;
}

// Context block: short contexts shown inline; long case-study inserts collapsible.
function renderQuestionContext(q, opts) {
  opts = opts || {};
  const frag = el('div', { class: 'q-context' });
  const text = String(q.scenario || '');
  const isCase = !!q.context_id;
  if (isCase) {
    const label = (q.paper === 'Paper 3' ? 'Case study: ' : 'Context: ') + (q.context_title || '');
    const det = el('details', { class: 'context-details' });
    if (opts.open || q.paper === 'Paper 2') det.setAttribute('open', '');
    det.appendChild(el('summary', null, label + (q.paper === 'Paper 3' ? ' (Insert)' : '')));
    text.split(/\n\n+/).forEach(p => {
      const lines = p.split('\n');
      if (lines.length > 1 && lines[0].length < 40) {
        det.appendChild(el('h5', { class: 'context-heading' }, lines[0]));
        det.appendChild(el('p', { class: 'scenario' }, lines.slice(1).join(' ')));
      } else {
        det.appendChild(el('p', { class: 'scenario' }, p));
      }
    });
    if (Array.isArray(q.appendices) && q.appendices.length) det.appendChild(renderAppendices(q.appendices));
    frag.appendChild(det);
  } else if (text) {
    frag.appendChild(el('pre', { class: 'scenario scenario-data' }, text));
  }
  return frag;
}
function getQuestionPapers(q) {
  if (!q || !Array.isArray(q.papers)) return [];
  return q.papers.filter(Boolean).map((p) => String(p));
}
function questionHasPaper(q, paper) {
  if (!paper) return true;
  return getQuestionPapers(q).includes(paper);
}

function questionAllowedInMode(q) {
  return true;
}

function applyPaper1ModeUi() {
  if (!IS_PAPER1_MODE) return;

  document.title = 'A-Level AQA Business - RA10 Revision';
  const heroTitle = document.querySelector('#view-dashboard .hero h2');
  const heroLede = document.querySelector('#view-dashboard .hero .lede');
  if (heroTitle) heroTitle.textContent = 'Business revision mode (All topics)';
  if (heroLede) heroLede.textContent = 'Using the full RA10 interface with all 10 topics available in questions, quizzes, guide and mock generation.';

  const paperHint = document.querySelector('#view-mock .section-head p');
  if (paperHint) {
    paperHint.textContent = 'Generate mock papers with full topic coverage and answer-line print options.';
  }
}

const SB_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';
const DAILY_TASKS_KEY = 'ra10-daily-tasks-v2';
const STREAK_DATES_KEY = 'ra10_streak_dates';
const SESSION_TYPES = [
  'quiz_alevel_bus', 'practice_alevel_bus', 'mock_alevel_bus', 'flashcard_alevel_bus'
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function counterKey(prefix, date) {
  return prefix + '_' + (date || todayKey());
}

function getCounter(prefix, date) {
  return Number(localStorage.getItem(counterKey(prefix, date)) || '0');
}

function setCounter(prefix, value, date) {
  localStorage.setItem(counterKey(prefix, date), String(Math.max(0, Number(value || 0))));
}

function incrementCounter(prefix, delta, date) {
  const next = getCounter(prefix, date) + Number(delta || 0);
  setCounter(prefix, next, date);
  return next;
}

function getStreakDates() {
  return window.RA10 && typeof RA10.getStudyDays === 'function' ? RA10.getStudyDays() : [];
}

function saveStreakDates(dates) {
  /* The streak lives on the account (RA10.markStudyDay) - nothing to store here. */
}

function markTodayVisitForStreak() {
  if (window.RA10 && typeof RA10.markStudyDay === 'function') RA10.markStudyDay();
}

function calcLocalStreak() {
  return window.RA10 && typeof RA10.getStreak === 'function' ? RA10.getStreak() : 0;
}

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

function getDailyTasksState() {
  const today = todayKey();
  try {
    const parsed = JSON.parse(localStorage.getItem(DAILY_TASKS_KEY) || '{}');
    if (parsed.date === today && parsed.tasks) {
      return {
        date: today,
        tasks: {
          dailyQuiz: !!parsed.tasks.dailyQuiz,
          practice5: !!parsed.tasks.practice5,
          practice10: !!parsed.tasks.practice10,
          practice15: !!parsed.tasks.practice15,
          flashReview: !!parsed.tasks.flashReview,
          share: !!parsed.tasks.share,
          login: !!parsed.tasks.login
        },
        practiceCount: Number(parsed.practiceCount || 0)
      };
    }
  } catch (e) {}
  return {
    date: today,
    tasks: { dailyQuiz: false, practice5: false, practice10: false, practice15: false, flashReview: false, share: false, login: false },
    practiceCount: 0
  };
}

function saveDailyTasksState(state) {
  localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(state));
}

function completeDailyTask(taskKey) {
  const state = getDailyTasksState();
  if (state.tasks[taskKey]) return false;
  state.tasks[taskKey] = true;
  saveDailyTasksState(state);
  return true;
}

function addPracticeProgress(count) {
  const state = getDailyTasksState();
  const today = todayKey();
  const nextCount = incrementCounter('ra10_practice_today', Number(count || 0), today);
  state.practiceCount = Math.max(0, Number(nextCount || 0));
  if (state.practiceCount >= 5 && !state.tasks.practice5) {
    state.tasks.practice5 = true;
    awardXP(50, '+50 XP — Practice 5 complete!');
  }
  if (state.practiceCount >= 10 && !state.tasks.practice10) {
    state.tasks.practice10 = true;
    awardXP(30, '+30 XP — Practice 10 complete!');
  }
  if (state.practiceCount >= 15 && !state.tasks.practice15) {
    state.tasks.practice15 = true;
    awardXP(45, '+45 XP — Practice 15 complete!');
  }
  saveDailyTasksState(state);
  if (document.getElementById('view-you')?.classList.contains('active')) renderYou();
}

function markFlashReviewStarted() {
  const changed = completeDailyTask('flashReview');
  if (changed && document.getElementById('view-you')?.classList.contains('active')) renderYou();
}

function ensureDailyLoginBonus() {
  if (!window.RA10 || !RA10.isLoggedIn()) return;
  markTodayVisitForStreak();
  const changed = completeDailyTask('login');
  if (changed) awardXP(5, '+5 XP — Daily login bonus!');
}

function greetingByTime() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

async function getWeakestAim() {
  if (!window.RA10 || !RA10.isLoggedIn() || !window.supabase) return '';
  const sb = RA10.getClient();
  const session = RA10.getSession();
  const userId = session?.user?.id;
  if (!userId) return '';
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: rows } = await sb
    .from('revision_sessions')
    .select('aim_breakdown')
    .eq('user_id', userId)
    .in('session_type', SESSION_TYPES)
    .gte('created_at', since);
  const aimTotals = {};
  const aimCorrect = {};
  (rows || []).forEach((r) => {
    const bd = r.aim_breakdown || {};
    Object.entries(bd).forEach(([aim, s]) => {
      aimTotals[aim] = (aimTotals[aim] || 0) + Number(s.total || 0);
      aimCorrect[aim] = (aimCorrect[aim] || 0) + Number(s.correct || 0);
    });
  });
  const weakest = Object.keys(aimTotals)
    .filter((aim) => aimTotals[aim] > 0)
    .map((aim) => ({ aim, pct: Math.round((aimCorrect[aim] || 0) / aimTotals[aim] * 100) }))
    .sort((a, b) => a.pct - b.pct)[0];
  return weakest?.aim || '';
}

async function startDailyQuiz() {
  const state = getDailyTasksState();
  if (state.tasks.dailyQuiz) return;
  const weakestAim = await getWeakestAim();
  switchTab('quiz');
  const aimSel = document.getElementById('quiz-aim');
  const lenSel = document.getElementById('quiz-length');
  if (aimSel) aimSel.value = weakestAim || '';
  if (lenSel) lenSel.value = '10';
  window._isDailyQuiz = true;
  await startQuiz();
  if (!quizState) window._isDailyQuiz = false;
}

async function copyDailyShareLink() {
  const text = 'Check out RA10 for BTEC IT revision: https://ra10.co.uk';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'RA10', text, url: 'https://ra10.co.uk' });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error('Clipboard unavailable');
    }
  } catch (e) {
    try {
      const t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      const copied = document.execCommand('copy');
      t.remove();
      if (!copied) throw new Error('Copy fallback failed');
    } catch (fallbackError) {
      window.prompt('Copy this share link', text);
    }
  }
  if (completeDailyTask('share')) awardXP(30, '+30 XP — Thanks for sharing!');
  if (document.getElementById('view-you')?.classList.contains('active')) renderYou();
}

async function renderYou() {
  if (document.getElementById('view-you')?.classList.contains('active') === false) return;
  const host = document.getElementById('daily-tasks-container');
  if (!host) return;
  if (!window.RA10 || !RA10.isLoggedIn()) {
    host.innerHTML = '<div class="card"><p class="muted">Sign in to unlock your daily tasks.</p></div>';
    return;
  }

  // Ensure sidebar cache is populated so today stats have real data
  if (!window._sidebarCache || (Date.now() - window._sidebarCache.ts) > 60000) {
    await refreshProgressSidebar(true);
  }

  const state = getDailyTasksState();
  state.practiceCount = getCounter('ra10_practice_today');
  saveDailyTasksState(state);
  const profile = RA10.getProfile() || {};
  const rawName = profile.full_name || profile.display_name || profile.email || 'there';
  const firstName = String(rawName).split('@')[0].split(' ')[0];
  const cachedSessions = window._sidebarCache?.sessions || [];
  const streak = calcStreak(cachedSessions);
  const xpWeek = Number(window._sidebarCache?.profile?.xp_this_week || profile.xp_this_week || 0);
  const xpMilestone = Math.max(100, Math.ceil((xpWeek + 1) / 100) * 100);
  const xpPct = Math.min(100, Math.round((xpWeek / xpMilestone) * 100));
  const todayStr = todayKey();
  const todaySessions = cachedSessions.filter(s => (s.created_at || '').startsWith(todayStr));
  const xpToday = Number(window._sidebarCache?.profile?.xp_this_week || 0);
  const qToday = todaySessions.reduce((a, s) => a + (Number(s.questions_total) || 0), 0);
  const sessionsToday = todaySessions.length;
  const practiceCount = Math.min(5, Number(state.practiceCount || 0));
  const practicePct = Math.min(100, Math.round(practiceCount / 5 * 100));
  const quotes = [
    'Small steps beat perfect plans.',
    'Every question you finish sharpens exam instincts.',
    'Consistency today creates confidence on test day.',
    'Revision is rent paid to future success.',
    'Momentum is built one focused session at a time.',
    'Hard topics become easy after enough reps.',
    'Effort compounds faster than motivation.',
    'You are closer than you think - keep going.',
    'Mastery comes from retrieval, not rereading.',
    'Train under pressure now, perform calmly later.',
    'Accuracy first, then speed.',
    'Show up daily and the results will follow.',
    'Progress loves persistence.',
    'Discipline is your revision superpower.'
  ];
  const quote = quotes[dayOfYear() % 14];

  function taskStatus(done) {
    return done ? '<span style="color:#177245;font-weight:700;">✓ Completed</span>' : '<span class="muted">Available</span>';
  }

  host.innerHTML = `
    <section class="you-hero">
      <div>
        <h3 class="you-hero-title">${greetingByTime()}, ${escapeHTML(firstName)}!</h3>
        <p class="you-hero-streak">🔥 <strong>${streak}</strong> day${streak === 1 ? '' : 's'} streak</p>
      </div>
      <div>
        <div class="you-hero-xp-label">XP this week</div>
        <div class="you-hero-xp-val">${xpWeek} / ${xpMilestone}</div>
        <div class="you-hero-xp-bar"><span style="width:${xpPct}%;"></span></div>
      </div>
    </section>

    <section class="you-tasks-grid">
      <article class="you-task-card ${state.tasks.dailyQuiz ? 'done' : ''}">
        <div class="you-task-head">
          <div><strong>Daily Quiz</strong><div class="muted">Complete a 10-question quiz on your weakest aim.</div></div>
          <span class="you-xp-pill">⚡ 25 XP</span>
        </div>
        <div class="you-task-foot">
          ${taskStatus(state.tasks.dailyQuiz)}
          ${state.tasks.dailyQuiz
            ? '<button class="btn" id="daily-task-quiz-btn" disabled>Completed today ✓</button>'
            : '<button class="btn primary" id="daily-task-quiz-btn">Start daily quiz</button>'}
        </div>
      </article>

      <article class="you-task-card ${state.tasks.practice5 ? 'done' : ''}">
        <div class="you-task-head">
          <div><strong>Answer 5 practice questions</strong><div class="muted">Tracked from auto-marked practice answers.</div></div>
          <span class="you-xp-pill">⚡ 50 XP</span>
        </div>
        <div class="you-task-progress"><span style="width:${practicePct}%;"></span></div>
        <div class="you-task-foot">
          ${taskStatus(state.tasks.practice5)}
          <span class="muted">${practiceCount} / 5 answered today</span>
        </div>
      </article>

      <article class="you-task-card ${state.tasks.flashReview ? 'done' : ''}">
        <div class="you-task-head">
          <div><strong>Review flashcards</strong><div class="muted">Open any flashcard session.</div></div>
          <span class="you-xp-pill">⚡ 15 XP</span>
        </div>
        <div class="you-task-foot">
          ${taskStatus(state.tasks.flashReview)}
          ${state.tasks.flashReview ? '' : '<button class="btn primary" id="daily-task-flash-btn">Open flashcards</button>'}
        </div>
      </article>

      <article class="you-task-card ${state.tasks.share ? 'done' : ''}">
        <div class="you-task-head">
          <div><strong>Share RA10</strong><div class="muted">Copy your referral-ready share text.</div></div>
          <span class="you-xp-pill">⚡ 30 XP</span>
        </div>
        <div class="you-task-foot">
          ${taskStatus(state.tasks.share)}
          ${state.tasks.share ? '' : '<button class="btn primary" id="daily-task-share-btn">Copy share link</button>'}
        </div>
      </article>

      <article class="you-task-card ${state.tasks.login ? 'done' : ''}">
        <div class="you-task-head">
          <div><strong>Log in today</strong><div class="muted">Automatic daily bonus.</div></div>
          <span class="you-xp-pill">⚡ 5 XP</span>
        </div>
        <div class="you-task-foot">${taskStatus(state.tasks.login)}</div>
      </article>
    </section>

    <section class="you-stats-mini">
      <h4>Your stats today</h4>
      <div class="you-stats-grid">
        <div><span>⚡ XP this week</span><strong>${xpToday}</strong></div>
        <div><span>🧠 Questions answered</span><strong>${qToday}</strong></div>
        <div><span>✅ Sessions completed</span><strong>${sessionsToday}</strong></div>
      </div>
    </section>

    <section class="you-quote">${escapeHTML(quote)}</section>
  `;

  document.getElementById('daily-task-quiz-btn')?.addEventListener('click', startDailyQuiz);
  document.getElementById('daily-task-flash-btn')?.addEventListener('click', () => {
    switchTab('flash');
    startFlash();
  });
  document.getElementById('daily-task-share-btn')?.addEventListener('click', copyDailyShareLink);
}

async function awardXP(amount, label) {
  if (!window.RA10 || !RA10.isLoggedIn()) return;
  const session = RA10.getSession();
  if (!session?.user?.id) return;
  try {
    const res = await fetch(SB_URL + '/rest/v1/rpc/increment_xp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + session.access_token
      },
      body: JSON.stringify({ amount })
    });
    if (res.ok) {
      incrementCounter('ra10_xp_today', Number(amount || 0));
      showXPToast(label || ('+' + amount + ' XP'));
      await refreshProgressSidebar(true);
    }
  } catch(e) { console.warn('XP award failed', e); }
}

function showXPToast(msg) {
  let t = document.getElementById('xp-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'xp-toast';
    t.style.cssText = 'position:fixed;bottom:80px;right:24px;z-index:99999;' +
      'background:#14201E;color:#fff;padding:10px 18px;border-radius:999px;' +
      'font-weight:700;font-size:0.9rem;opacity:0;transition:opacity 0.3s;' +
      'pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = '⚡ ' + msg;
  t.style.opacity = '1';
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => { t.style.opacity = '0'; }, 2500);
}

function normaliseSessionPayload(data) {
  const safe = data || {};
  const total = Number(safe.total || 0);
  const correct = Number(safe.correct || 0);
  const marksEarned = Number(safe.marksEarned || 0);
  const marksTotal = Number(safe.marksTotal || 0);
  const attempts = safe.attemptedIds instanceof Set
    ? safe.attemptedIds.size
    : Array.isArray(safe.attemptedIds) ? safe.attemptedIds.length : 0;
  return {
    aims: Array.isArray(safe.aims) ? safe.aims : [],
    total: attempts || total,
    correct,
    marksEarned,
    marksTotal,
    aimBreakdown: safe.aimBreakdown || {}
  };
}

async function saveSession(sessionType, data) {
  if (!window.RA10 || !RA10.isLoggedIn()) return;
  const session = RA10.getSession();
  if (!session?.user?.id) return;
  try {
    const payload = normaliseSessionPayload(data);
    if (!payload.total && !String(sessionType).startsWith('flashcard')) return;
    const sb = window.supabase
      ? RA10.getClient()
      : null;
    if (!sb) return;
    const { error } = await sb.from('revision_sessions').insert({
      user_id: session.user.id,
      session_type: sessionType,
      learning_aims: payload.aims,
      questions_total: payload.total,
      questions_correct: payload.correct,
      marks_earned: payload.marksEarned,
      marks_total: payload.marksTotal,
      aim_breakdown: payload.aimBreakdown
    });
    if (error) throw error;
    incrementCounter('ra10_sessions_today', 1);
  } catch(e) {
    console.warn('Could not save session', e);
  }
}

function ensureProgressSidebar() {
  if (document.getElementById('u1-progress-sidebar')) return;
  let toggle = null;
  const sidebar = el('aside', { id: 'u1-progress-sidebar', class: 'u1-progress-sidebar hidden' },

    el('div', { class: 'u1-sb-head' },
      el('span', { class: 'u1-sb-chip' }, '⚡ Progress Boost'),
      el('button', { class: 'u1-sb-close', onclick: () => {
        window._u1SidebarDismissed = true;
        sidebar.classList.remove('open');
        sidebar.classList.add('hidden');
        document.body.classList.remove('has-u1-sidebar');
        if (toggle) toggle.style.display = '';
      } }, '✕')
    ),
    el('div', { id: 'u1-sb-body', class: 'u1-sb-body' },
      el('p', { class: 'muted' }, 'Loading progress...')
    )
  );
  toggle = el('button', {
    id: 'u1-sidebar-toggle',
    class: 'u1-sidebar-toggle',
    onclick: () => {
      window._u1SidebarDismissed = false;
      sidebar.classList.remove('hidden');
      document.body.classList.add('has-u1-sidebar');
      if (window.matchMedia('(max-width: 1100px)').matches) {
        sidebar.classList.toggle('open');
      } else {
        sidebar.classList.remove('open');
      }
    }
  }, '⚡ Progress');
  document.body.appendChild(sidebar);
  document.body.appendChild(toggle);
}

async function refreshProgressSidebar(force) {
  ensureProgressSidebar();
  const sidebar = document.getElementById('u1-progress-sidebar');
  const toggle = document.getElementById('u1-sidebar-toggle');
  const body = document.getElementById('u1-sb-body');
  if (!sidebar || !toggle || !body) return;

  if (!window.RA10 || !RA10.isLoggedIn() || !window.supabase) {
    sidebar.classList.add('hidden');
    toggle.style.display = 'none';
    document.body.classList.remove('has-u1-sidebar');
    return;
  }

  if (window._u1SidebarDismissed) {
    sidebar.classList.add('hidden');
    toggle.style.display = '';
    document.body.classList.remove('has-u1-sidebar');
    return;
  }

  sidebar.classList.remove('hidden');
  toggle.style.display = '';
  document.body.classList.add('has-u1-sidebar');

  const desktopVisible = window.matchMedia('(min-width: 1101px)').matches;
  const mobileVisible = sidebar.classList.contains('open');
  if (!force && !desktopVisible && !mobileVisible) return;

  try {
    let profile = null;
    let sessions = null;
    let leaders = null;
    const cache = window._sidebarCache;
    const fresh = cache && (Date.now() - cache.ts) < 60000;
    if (fresh) {
      profile = cache.profile;
      sessions = cache.sessions;
      leaders = cache.leaders;
    } else {
      const sb = RA10.getClient();
      const session = RA10.getSession();
      const userId = session?.user?.id;
      if (!userId) return;
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const result = await Promise.all([
        sb.from('profiles').select('xp_this_week, xp_total').eq('id', userId).single(),
        sb.from('revision_sessions').select('created_at, questions_total, session_type').eq('user_id', userId).in('session_type', SESSION_TYPES).gte('created_at', since),
        (async () => {
          const rpcRes = await sb.rpc('get_leaderboard_preview');
          if (!rpcRes.error && Array.isArray(rpcRes.data)) return rpcRes;
          return { data: [] };
        })()
      ]);
      profile = result[0].data;
      sessions = result[1].data;
      leaders = result[2].data;
      window._sidebarCache = { ts: Date.now(), profile, sessions, leaders };
    }

    const xpWeek = Number(profile?.xp_this_week || 0);
    const milestone = Math.max(50, Math.ceil((xpWeek + 1) / 50) * 50);
    const pct = Math.min(100, Math.round((xpWeek / milestone) * 100));
    const streak = calcStreak(sessions || []);
    const medals = ['🥇', '🥈', '🥉'];

    body.innerHTML = `
      <div class="u1-sb-kpi xp">
        <div class="kpi-emoji">⚡</div>
        <div>
          <div class="kpi-label">XP this week</div>
          <div class="kpi-value">${xpWeek}</div>
        </div>
      </div>
      <div class="u1-sb-progress"><span style="width:${pct}%;"></span></div>
      <div class="u1-sb-note">${milestone - xpWeek} XP to next milestone (${milestone})</div>

      <div class="u1-sb-kpi streak">
        <div class="kpi-emoji">🔥</div>
        <div>
          <div class="kpi-label">Current streak</div>
          <div class="kpi-value">${streak} day${streak === 1 ? '' : 's'}</div>
        </div>
      </div>

      <div class="u1-sb-mini-title">This week's top 3</div>
      <div class="u1-sb-mini-list">
        ${(leaders || []).length ? (leaders || []).map((u, i) => `
          <div class="u1-sb-mini-row">
            <span>${medals[i]} ${u.username ? '@' + u.username : (u.full_name || 'Anonymous')}</span>
            <strong>${u.xp_this_week} XP</strong>
          </div>
        `).join('') : '<div class="u1-sb-empty">No XP yet this week.</div>'}
      </div>

      <button class="btn primary u1-sb-btn" id="u1-sb-view-progress">View full progress</button>
    `;
    document.getElementById('u1-sb-view-progress')?.addEventListener('click', () => switchTab('progress'));
  } catch (e) {
    body.innerHTML = '<p class="muted">Could not load progress sidebar.</p>';
  }
}

// ---------- Tabs ----------
$$('.tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
$$('[data-goto]').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.goto)));
function switchTab(name) {
  const parentTab = ({ pastpapers: 'questions', mock: 'questions', practice: 'questions', browse: 'questions', quiz: 'revise', flash: 'revise', guide: 'revise', spec: 'revise' })[name] || name;
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === parentTab));
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
  if (name === 'guide') renderRevisionGuide();
  if (name === 'pastpapers') renderPapersTab();
  if (name === 'progress') renderProgress();
  if (name === 'you') renderYou();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.openPredictedPaperFocus = function(mode, aim, guideTopicCode, searchText) {
  const safeAim = TOPIC_CODES.includes(String(aim || '')) ? String(aim) : '';
  const safeGuideCode = String(guideTopicCode || '').trim();
  const safeSearch = String(searchText || '').trim();

  if (mode === 'guide') {
    switchTab('guide');
    setTimeout(() => {
      const targetId = safeGuideCode ? ('gt-' + safeGuideCode) : (safeAim ? ('guide-aim-' + safeAim) : '');
      if (!targetId) return;
      if (typeof window.guideScrollTo === 'function') {
        window.guideScrollTo(targetId);
      } else {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 220);
    return;
  }

  if (mode === 'quiz') {
    switchTab('quiz');
    renderQuizControls();
    const aimSel = $('#quiz-aim');
    if (aimSel) aimSel.value = safeAim;
    const lenSel = $('#quiz-length');
    if (lenSel && !lenSel.value) lenSel.value = '10';
    const quizCard = $('#quiz-card');
    if (quizCard) {
      quizCard.innerHTML = `<p class="muted" style="padding:30px;text-align:center;">${safeAim ? `${topicLabel(safeAim)}` : 'Topic'} selected. Click <strong>Start quiz</strong> to begin.</p>`;
    }
    return;
  }

  if (mode === 'questions') {
    switchTab('browse');
    const aimSel = $('#filter-aim');
    const searchInput = $('#search');
    const marksSel = $('#filter-marks');
    const verbSel = $('#filter-verb');
    if (aimSel) aimSel.value = safeAim;
    if (searchInput) searchInput.value = safeSearch;
    if (marksSel) marksSel.value = '';
    if (verbSel) verbSel.value = '';
    applyBrowseFilters();
  }
};

const GUIDE_STATE = { entries: null, bound: false };
const GUIDE_FULL_UNLOCK_EXPIRY_KEY = 'ra10_guide_full_unlock_aqa_business_2023_expires_at';
const GUIDE_FULL_UNLOCK_DURATION_MS = 2 * 60 * 60 * 1000;
let guideUnlockCountdownTimer = null;

function normalizeGuideText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function getRevisionGuideEntries() {
  if (GUIDE_STATE.entries) return GUIDE_STATE.entries;
  const aims = Object.keys(SPEC || {});
  const entries = [];
  aims.forEach((aim) => {
    const block = SPEC[aim] || {};
    const topics = Array.isArray(block.topics) ? block.topics : [];
    topics.forEach((topic, idx) => {
      const code = topic.code || `${aim}.${idx + 1}`;
      const title = topic.name || 'Topic';
      const searchBlob = `${aim} ${block.title || ''} ${block.short || ''} ${code} ${title}`;
      entries.push({
        key: `${aim}-${code}`,
        aim,
        aimTitle: block.title || `Topic ${aim}`,
        code,
        title,
        summary: `Understand ${title.toLowerCase()} and apply it to exam scenarios for ${topicLabel(aim)}.`,
        searchText: normalizeGuideText(searchBlob)
      });
    });
  });
  GUIDE_STATE.entries = entries;
  return entries;
}

function findGuideEntryForQuestion(q) {
  const entries = getRevisionGuideEntries();
  const aim = q?.learning_aim || '';
  const topic = normalizeGuideText(q?.topic || q?.question || '');
  const scoped = aim ? entries.filter(e => e.aim === aim) : entries;
  if (!scoped.length) return null;
  if (topic) {
    const exact = scoped.find(e => topic.includes(normalizeGuideText(e.title)) || normalizeGuideText(e.title).includes(topic));
    if (exact) return exact;
    const partial = scoped.find(e => {
      const t = normalizeGuideText(e.title);
      return t.split(' ').some(word => word.length > 4 && topic.includes(word));
    });
    if (partial) return partial;
  }
  return scoped[0];
}

function openRevisionGuideForQuestion(q) {
  const entry = findGuideEntryForQuestion(q);
  switchTab('guide');
  const aimLetter = entry?.aim || (q?.learning_aim || '');
  if (aimLetter && String(aimLetter) !== '1' && !canViewFullRevisionGuide()) {
    setTimeout(() => {
      const gateCard = document.getElementById('guide-access-gate-card');
      if (gateCard) gateCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
    return;
  }
  if (aimLetter) {
    setTimeout(() => {
      const section = document.getElementById('guide-aim-' + aimLetter);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        section.style.outline = '2px solid var(--accent)';
        setTimeout(() => { section.style.outline = ''; }, 1500);
      }
    }, 200);
  }
}

function hasGuideSessionUnlock() {
  try {
    const raw = localStorage.getItem(GUIDE_FULL_UNLOCK_EXPIRY_KEY);
    const expiry = Number(raw || 0);
    if (!Number.isFinite(expiry) || expiry <= 0) return false;
    if (Date.now() >= expiry) {
      localStorage.removeItem(GUIDE_FULL_UNLOCK_EXPIRY_KEY);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

function setGuideSessionUnlock(enabled) {
  try {
    if (enabled) {
      localStorage.setItem(GUIDE_FULL_UNLOCK_EXPIRY_KEY, String(Date.now() + GUIDE_FULL_UNLOCK_DURATION_MS));
    } else {
      localStorage.removeItem(GUIDE_FULL_UNLOCK_EXPIRY_KEY);
    }
  } catch (e) {}
}

function getGuideUnlockRemainingMs() {
  try {
    const expiry = Number(localStorage.getItem(GUIDE_FULL_UNLOCK_EXPIRY_KEY) || 0);
    if (!Number.isFinite(expiry) || expiry <= 0) return 0;
    return Math.max(0, expiry - Date.now());
  } catch (e) {
    return 0;
  }
}

function formatGuideUnlockRemaining(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

function clearGuideUnlockCountdownTimer() {
  if (guideUnlockCountdownTimer) {
    clearInterval(guideUnlockCountdownTimer);
    guideUnlockCountdownTimer = null;
  }
}

function startGuideUnlockCountdown(card) {
  clearGuideUnlockCountdownTimer();
  const target = card ? card.querySelector('#guide-unlock-remaining') : null;
  if (!target) return;

  const tick = () => {
    const remaining = getGuideUnlockRemainingMs();
    if (remaining <= 0) {
      clearGuideUnlockCountdownTimer();
      setGuideSessionUnlock(false);
      renderRevisionGuide();
      return;
    }
    target.textContent = formatGuideUnlockRemaining(remaining);
  };

  tick();
  guideUnlockCountdownTimer = setInterval(tick, 1000);
}

function hasPlanGuideAccess() {
  if (!window.RA10 || !RA10.isLoggedIn()) return false;
  if (RA10.isOwner()) return true;
  if (RA10._raw && RA10._raw.TRANSITION_MODE) return true;
  const tier = RA10.getTier ? RA10.getTier() : 'free';
  if (tier === 'subject') {
    const ctx = (typeof window._ra10GetUnitCreditsContext === 'function') ? window._ra10GetUnitCreditsContext() : null;
    return !!(ctx && ctx.ownsCurrentSubject);
  }
  return tier !== 'free';
}

function canViewFullRevisionGuide() {
  return hasGuideSessionUnlock() || hasPlanGuideAccess();
}

function goToUpgradeFromGuideGate() {
  try {
    if (window.top && window.top !== window) {
      window.top.location.hash = '/upgrade';
      return;
    }
  } catch (e) {}
  location.hash = '/upgrade';
}

function renderGuideAccessGate(container, aimASection) {
  if (!container || !aimASection) return;

  const existing = document.getElementById('guide-access-gate-card');
  if (existing) existing.remove();

  const timedUnlockActive = hasGuideSessionUnlock() && !hasPlanGuideAccess();

  const card = document.createElement('div');
  card.id = 'guide-access-gate-card';
  card.className = 'card';
  card.style.marginTop = 'var(--space-4, 16px)';
  card.style.border = '1px solid var(--line)';
  card.style.background = 'linear-gradient(135deg, rgba(29,78,216,.10), rgba(16,185,129,.10))';
  card.innerHTML = timedUnlockActive
    ? `
      <h4 style="margin-top:0">Full guide unlocked</h4>
      <p style="margin-bottom:8px">Your 10-credit unlock is active for all topics.</p>
      <p style="margin-top:0;margin-bottom:12px;"><strong>Unlock ends in <span id="guide-unlock-remaining">--:--:--</span></strong></p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn" id="guide-upgrade-btn">View plans</button>
      </div>
    `
    : `
      <h4 style="margin-top:0">Topics 2-10 are locked</h4>
      <p style="margin-bottom:10px">You can preview Topic 1 for free. The other topics below have padlocks and need an unlock.</p>
      <ul style="margin-top:0;margin-bottom:12px;">
        <li>Click <strong>Unlock for 2 hours (10 credits)</strong> to open all topics temporarily</li>
        <li>You can refresh and keep access until the timer ends</li>
        <li>IT one-time subject plan gives full guide access for IT</li>
        <li>Pro / Ultra (and school plans) include full guide access</li>
      </ul>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn primary" id="guide-unlock-once-btn">Unlock for 2 hours (10 credits)</button>
        <button class="btn" id="guide-upgrade-btn">View plans</button>
      </div>
    `;

  aimASection.insertAdjacentElement('afterend', card);

  const unlockBtn = card.querySelector('#guide-unlock-once-btn');
  const upgradeBtn = card.querySelector('#guide-upgrade-btn');

  if (timedUnlockActive) {
    startGuideUnlockCountdown(card);
  } else {
    clearGuideUnlockCountdownTimer();
  }

  if (unlockBtn && (!window.RA10 || !RA10.isLoggedIn())) {
    unlockBtn.textContent = 'Sign in to unlock';
    unlockBtn.addEventListener('click', () => {
      if (window.RA10 && typeof RA10.showPaywall === 'function') RA10.showPaywall('login', 'revision_guide_full');
    });
  } else if (unlockBtn) {
    unlockBtn.addEventListener('click', async () => {
      unlockBtn.disabled = true;
      const ok = await ra10Gate('revision_guide_full');
      if (ok) {
        setGuideSessionUnlock(true);
        renderRevisionGuide();
        return;
      }
      unlockBtn.disabled = false;
    });
  }

  upgradeBtn.addEventListener('click', goToUpgradeFromGuideGate);
}

function setGuideSectionLocked(section, locked) {
  if (!section) return;
  const existingBadge = section.querySelector('.guide-lock-badge');
  const existingOverlay = section.querySelector('.guide-lock-overlay');
  if (locked) {
    section.style.display = '';
    section.style.position = 'relative';
    section.style.pointerEvents = 'none';
    section.style.userSelect = 'none';
    section.style.WebkitUserSelect = 'none';
    section.style.filter = 'blur(18px) brightness(0.35)';
    
    if (!existingBadge) {
      const badge = document.createElement('div');
      badge.className = 'guide-lock-badge';
      badge.textContent = 'LOCKED';
      badge.style.position = 'absolute';
      badge.style.top = '50%';
      badge.style.left = '50%';
      badge.style.transform = 'translate(-50%, -50%)';
      badge.style.padding = '10px 16px';
      badge.style.borderRadius = '8px';
      badge.style.fontSize = '0.85rem';
      badge.style.fontWeight = '700';
      badge.style.letterSpacing = '0.08em';
      badge.style.background = '#1f2937';
      badge.style.color = '#ffffff';
      badge.style.zIndex = '10';
      badge.style.pointerEvents = 'all';
      badge.style.filter = 'blur(0px)';
      section.appendChild(badge);
    }
  } else {
    section.style.position = '';
    section.style.pointerEvents = '';
    section.style.userSelect = '';
    section.style.WebkitUserSelect = '';
    section.style.filter = '';
    if (existingBadge) existingBadge.remove();
    if (existingOverlay) existingOverlay.remove();
  }
}

function updateGuidePrintButtons() {
  const fullAccess = canViewFullRevisionGuide();
  const printBtns = $$('[id^="btn-print"]');
  printBtns.forEach(btn => {
    if (btn.textContent.toLowerCase().includes('guide') || btn.textContent.toLowerCase().includes('revision')) {
      btn.style.display = fullAccess ? '' : 'none';
      btn.disabled = !fullAccess;
    }
  });
}

function setGuideTocLocked(group, locked) {
  if (!group) return;
  const link = group.querySelector('.guide-toc-aim-link');
  if (!link) return;

  let lockMarker = group.querySelector('.guide-toc-lock-marker');
  if (locked) {
    group.style.display = '';
    link.style.pointerEvents = 'none';
    link.style.opacity = '0.7';
    link.style.cursor = 'not-allowed';
    if (!lockMarker) {
      lockMarker = document.createElement('span');
      lockMarker.className = 'guide-toc-lock-marker';
      lockMarker.textContent = ' \ud83d\udd12';
      lockMarker.style.marginLeft = '6px';
      lockMarker.style.fontSize = '0.95em';
      link.appendChild(lockMarker);
    }
  } else {
    link.style.pointerEvents = '';
    link.style.opacity = '';
    link.style.cursor = '';
    if (lockMarker) lockMarker.remove();
  }
}

function applyGuideAccessRules() {
  const container = document.getElementById('guide-comprehensive');
  if (!container) return;

  const sections = Array.from(container.querySelectorAll('.guide-aim-section[id]'));
  if (!sections.length) return;

  const fullAccess = canViewFullRevisionGuide();
  sections.forEach((section) => {
    const isAimA = section.id === 'guide-aim-1';
    setGuideSectionLocked(section, !fullAccess && !isAimA);
  });

  container.querySelectorAll('.guide-toc-aim-group').forEach((group) => {
    const link = group.querySelector('.guide-toc-aim-link');
    const isAimA = !!(link && (link.getAttribute('onclick') || '').includes('guide-aim-1'));
    setGuideTocLocked(group, !fullAccess && !isAimA);
  });
  
  updateGuidePrintButtons();

  const gateCard = document.getElementById('guide-access-gate-card');
  const timedUnlockOnly = hasGuideSessionUnlock() && !hasPlanGuideAccess();
  if (fullAccess && !timedUnlockOnly) {
    clearGuideUnlockCountdownTimer();
    if (gateCard) gateCard.remove();
  } else {
    const aimA = document.getElementById('guide-aim-1');
    renderGuideAccessGate(container, aimA);
  }
}

function renderRevisionGuide() {
  if (window.initComprehensiveGuide) {
    // applyGuideAccessRules is called from inside guide.js after the async fetch
    // completes and the DOM is populated — do NOT call it here prematurely.
    window.initComprehensiveGuide();
    return;
  }
}

// Expose so guide.js can call it after render without importing app.js symbols.
window.applyGuideAccessRules = applyGuideAccessRules;

function setupGuideAuthListener() {
  if (!window.RA10 || typeof RA10.on !== 'function') return;
  RA10.on('authchange', () => {
    if (!RA10.isLoggedIn()) {
      setGuideSessionUnlock(false);
      const container = document.getElementById('guide-comprehensive');
      if (container) applyGuideAccessRules();
    }
  });
}

// ---------- Boot when data loaded ----------
onDataReady(() => {
  if (IS_PAPER1_MODE) {
    for (let i = QUESTIONS.length - 1; i >= 0; i--) {
      if (!questionAllowedInMode(QUESTIONS[i])) QUESTIONS.splice(i, 1);
    }
  }

  if (!QUESTIONS.length) {
    document.getElementById('app').innerHTML = `<div class="loading">
      <p>No questions loaded. The JSON files may not be present yet, or you are opening this file directly without a server.</p>
      <p class="muted">Run <code>python3 -m http.server</code> in this folder, or deploy via the included instructions.</p>
    </div>`;
    return;
  }
  renderDashboard();
  renderBrowse();
  renderMockControls();
  renderPracticeControls();
  renderQuizControls();
  renderFlashControls();
  renderRevisionGuide();
  renderSpec();
  applyPaper1ModeUi();
  ensureDailyLoginBonus();
  setupGuideAuthListener();
});

// ---------- Dashboard ----------
function renderDashboard() {
  // Personalized greeting
  const profile = (window.RA10 && window.RA10.getProfile ? window.RA10.getProfile() : null) || {};
  const name = profile.full_name || profile.display_name || profile.email || 'Learner';
  const hero = document.querySelector('.hero > div');
  if (hero) {
    let greet = hero.querySelector('.dashboard-greeting');
    if (!greet) {
      greet = document.createElement('p');
      greet.className = 'dashboard-greeting';
      hero.appendChild(greet);
    }
    greet.innerHTML = `Welcome back, <strong>${escapeHTML(name)}</strong>! Ready to revise?`;
  }

  const stats = {
    total: QUESTIONS.length,
    aims: new Set(QUESTIONS.map(q => String(q.learning_aim))).size,
    marks: QUESTIONS.reduce((s, q) => s + (Number(q.marks) || 0), 0),
    extended: QUESTIONS.filter(q => q.marks >= 6).length
  };
  const sBox = $('#dashboard-stats');
  sBox.innerHTML = '';
  [
    ['num', stats.total, 'Total questions'],
    ['num', stats.aims, 'Topics covered'],
    ['num', stats.marks.toLocaleString(), 'Total marks'],
    ['num', stats.extended, 'Extended-response (6m+)']
  ].forEach(([_, n, l]) => sBox.appendChild(el('div', {class:'stat'}, el('span', {class:'num'}, String(n)), el('span', {class:'lbl'}, l))));

  const aimGrid = $('#aim-grid');
  aimGrid.innerHTML = '';
  TOPIC_CODES.forEach(letter => {
    const count = QUESTIONS.filter(q => String(q.learning_aim) === String(letter)).length;
    const data = SPEC[letter] || { title: topicLabel(letter), short: '' };
    const card = el('div', { class: 'aim-card', onclick: () => { $('#filter-aim').value = letter; switchTab('browse'); applyBrowseFilters(); } },
      el('div', { class: 'aim-letter' }, topicLabel(letter)),
      el('h4', null, data.title),
      el('p', { class: 'desc' }, data.short),
      el('span', { class: 'count' }, `${count} questions`)
    );
    aimGrid.appendChild(card);
  });
}

// ---------- Browse ----------
let openedRow = null;

function renderBrowse() {
  // Populate filter dropdowns
  const aimSel = $('#filter-aim');
  TOPIC_CODES.forEach(a => {
    const opt = el('option', {value: a}, `${topicLabel(a)}: ${SPEC[a].short.split(',')[0]}`);
    aimSel.appendChild(opt);
  });
  const marksSel = $('#filter-marks');
  MARKS_OPTIONS.forEach(m => marksSel.appendChild(el('option', { value: String(m) }, `${m} mark${m===1?'':'s'}`)));
  const paperSel = $('#filter-paper');
  if (paperSel && !paperSel.dataset.ready) {
    PAPER_OPTIONS.forEach((p) => paperSel.appendChild(el('option', { value: p }, p)));
    paperSel.dataset.ready = '1';
  }
  const verbSel = $('#filter-verb');
  COMMAND_VERBS.forEach(v => verbSel.appendChild(el('option', { value: v }, v)));

  $('#search').addEventListener('input', applyBrowseFilters);
  aimSel.addEventListener('change', applyBrowseFilters);
  marksSel.addEventListener('change', applyBrowseFilters);
  if (paperSel) paperSel.addEventListener('change', applyBrowseFilters);
  verbSel.addEventListener('change', applyBrowseFilters);
  $('#btn-clear').addEventListener('click', () => {
    $('#search').value = ''; aimSel.value = ''; marksSel.value = ''; if (paperSel) paperSel.value = ''; verbSel.value = '';
    applyBrowseFilters();
  });

  applyBrowseFilters();
}

function applyBrowseFilters() {
  const q = $('#search').value.trim().toLowerCase();
  const qTokens = q ? q.split(/\s+/).filter(Boolean) : [];
  const aim = $('#filter-aim').value;
  const marks = $('#filter-marks').value;
  const paper = $('#filter-paper') ? $('#filter-paper').value : '';
  const verb = $('#filter-verb').value;

  let list = QUESTIONS.slice();
  if (aim) list = list.filter(x => x.learning_aim === aim);
  if (marks) list = list.filter(x => String(x.marks) === marks);
  if (paper) list = list.filter(x => questionHasPaper(x, paper));
  if (verb) list = list.filter(x => (x.command_verb || '').toLowerCase() === verb.toLowerCase());
  if (qTokens.length) {
    list = list.filter(x => {
      const blob = (x.scenario || '') + ' ' + (x.question || '') + ' ' + (x.topic || '') + ' ' + (x.id || '');
      const searchBlob = blob.toLowerCase();
      return qTokens.every(token => searchBlob.includes(token));
    });
  }

  $('#result-count').textContent = `${list.length} question${list.length===1?'':'s'}`;

  const wrap = $('#question-list');
  wrap.innerHTML = '';
  // Cap rendering to first 250 for perf
  const display = list.slice(0, 250);
  display.forEach(qq => wrap.appendChild(renderQuestionRow(qq)));
  if (list.length > 250) {
    wrap.appendChild(el('p', { class: 'muted', style: 'text-align:center;padding:14px;' }, `Showing first 250 of ${list.length}. Refine filters to narrow further.`));
  }
}

function renderQuestionRow(q) {
  const row = el('div', { class: 'qrow' });
  const head = el('div', { class: 'qrow-head' });
  head.appendChild(el('div', { class: 'qrow-meta' },
    el('span', { class: 'tag id' }, q.id || ''),
    el('span', { class: 'tag' }, topicLabel(q.learning_aim)),
    getQuestionPapers(q).length ? el('span', { class: 'tag' }, getQuestionPapers(q).join(' · ') + (q.paper_section ? ' · ' + q.paper_section : '')) : null,
    el('span', { class: 'tag verb' }, q.command_verb || ''),
    el('span', { class: 'tag marks' }, `${q.marks} mark${q.marks===1?'':'s'}`)
  ));
  if (q.topic) head.appendChild(el('span', { class: 'muted' }, q.topic));
  row.appendChild(head);

  const body = el('div', { class: 'qrow-body' });
  if (q.scenario) body.appendChild(renderQuestionContext(q));
  body.appendChild(el('p', { class: 'question-text' },
    q.question,
    el('span', { class: 'marks-bracket' }, ` (${q.marks})`)
  ));
  row.appendChild(body);

  row.appendChild(renderMarkScheme(q));

  row.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
    if (openedRow && openedRow !== row) openedRow.classList.remove('open');
    row.classList.toggle('open');
    openedRow = row.classList.contains('open') ? row : null;
  });
  return row;
}

let _mermaidRenderCount = 0;

function renderMarkScheme(q, opts) {
  opts = opts || {};
  const m = q.mark_scheme || {};
  const wrap = el('div', { class: 'markscheme' });
  wrap.appendChild(el('h5', null, 'Mark Scheme'));
  if (q.ao) wrap.appendChild(el('p', { class: 'ms-ao' }, `Marks for this question: ${q.ao}`));
  if (m.instruction) wrap.appendChild(el('p', { class: 'instruction' }, m.instruction));

  const list = (title, items, cls) => {
    if (!Array.isArray(items) || !items.length) return;
    wrap.appendChild(el('p', { class: 'instruction ' + (cls || '') }, el('strong', null, title)));
    const ul = el('ul', { class: cls || '' });
    items.forEach(p => ul.appendChild(el('li', null, String(p))));
    wrap.appendChild(ul);
  };

  if (q.type === 'multiple_choice' && m.answer) {
    const correct = (q.options || []).find(o => o.label === m.answer);
    wrap.appendChild(el('p', { class: 'mc-answer' },
      el('strong', null, 'Correct answer: '),
      el('span', { class: 'mc-correct' }, m.answer + (correct ? ' - ' + correct.text : '')),
      ' (1)'
    ));
    if (m.explanation) wrap.appendChild(el('p', { class: 'instruction' }, m.explanation));
    return wrap;
  }

  if (q.type === 'calculation') {
    wrap.appendChild(el('p', { class: 'mc-answer' }, el('strong', null, 'Answer: '), el('span', { class: 'mc-correct' }, String(m.answer || '')), ` (${q.marks} marks)`));
    list('Marks awarded for working:', m.points);
  } else if (q.type === 'extended_levels' || m.level_descriptors) {
    list('The demands of the question are:', m.demands);
    if (m.arguments_for && m.arguments_for.length) {
      list('Indicative content - arguments that support / benefits:', m.arguments_for);
      list('Indicative content - arguments against / limitations:', m.arguments_against);
    } else {
      list('Indicative content:', m.indicative_content);
    }
    list('Relevant calculations:', m.calculations, 'ms-calcs');
    list('Evaluation - the judgement may consider:', m.evaluation);
    if (m.level_descriptors && m.level_descriptors.length) {
      const tbl = el('table', { class: 'levels' });
      tbl.appendChild(el('tr', null, el('th', null, 'Level'), el('th', null, 'Marks'), el('th', null, 'The student will typically demonstrate')));
      m.level_descriptors.forEach(d => tbl.appendChild(el('tr', null, el('td', null, 'Level ' + d.level), el('td', null, String(d.marks)), el('td', null, d.descriptor))));
      wrap.appendChild(tbl);
    }
    list('Marker notes:', m.marker_notes, 'ms-notes');
  } else if (m.points && m.points.length) {
    const ul = el('ul');
    m.points.forEach(p => ul.appendChild(el('li', { html: escapeHTML(p).replace(/\(1\)/g, '<strong>(1)</strong>') })));
    wrap.appendChild(ul);
  }
  if (q.type === 'calculation' && m.additional_guidance) wrap.appendChild(el('p', { class: 'additional' }, m.additional_guidance));
  if (Array.isArray(m.formulae) && m.formulae.length) {
    const formulaBox = el('div', { class: 'ms-formulae' });
    formulaBox.appendChild(el('p', { class: 'instruction' }, el('strong', null, 'Formula:')));
    const ul = el('ul');
    m.formulae.forEach((f) => {
      const li = el('li');
      li.appendChild(el('span', { class: 'formula-math' }, String(f.math || '')));
      if (f.notes) li.appendChild(el('span', { class: 'formula-note' }, String(f.notes)));
      ul.appendChild(li);
    });
    formulaBox.appendChild(ul);
    wrap.appendChild(formulaBox);
  }
  return wrap;
}

// ---------- Mock paper builder ----------
// Builds papers in the exact AQA 7132 format (see PAPER_FORMATS in spec.js):
//   Paper 1: Section A 15 MCQs, Section B 4+4+9+9+9, Sections C and D a choice of two 25-mark essays each.
//   Paper 2: three complete data-response question sets (each with context + appendices) totalling 100.
//   Paper 3: one complete case study (Insert) with questions worth 12, 12, 16, 16, 20, 24.
let lastMock = null;
let mockShowMs = false;

function renderMockFormatInfo() {
  const box = $('#mock-format');
  const sel = $('#mock-paper-type');
  if (!box || !sel) return;
  const fmt = PAPER_FORMATS[sel.value];
  box.innerHTML = '';
  if (!fmt) return;
  box.appendChild(el('p', { class: 'mock-format-summary' }, el('strong', null, `${sel.value}: ${fmt.name} · ${fmt.time} · ${fmt.marks} marks. `), fmt.summary));
  const ul = el('ul', { class: 'mock-format-list' });
  fmt.sections.forEach(s => ul.appendChild(el('li', null, el('strong', null, `${s.name} (${s.marks})`), ' - ' + s.note)));
  box.appendChild(ul);

  const ctxRow = $('#mock-context-row');
  const ctxSel = $('#mock-context');
  const aimsCtl = $('#mock-aims-control');
  if (aimsCtl) aimsCtl.style.display = sel.value === 'Paper 1' ? '' : 'none';
  if (ctxRow && ctxSel) {
    if (sel.value === 'Paper 3') {
      ctxRow.style.display = '';
      ctxSel.innerHTML = '';
      ctxSel.appendChild(el('option', { value: '' }, 'Random case study'));
      P3_CASES.forEach(c => ctxSel.appendChild(el('option', { value: c.id }, c.title)));
    } else {
      ctxRow.style.display = 'none';
      ctxSel.innerHTML = '';
    }
  }
}

function renderMockControls() {
  const aimsRow = $('#mock-aims');
  aimsRow.innerHTML = '';
  TOPIC_CODES.forEach(a => {
    const chip = el('div', { class: 'chip on', title: (SPEC[a] && SPEC[a].title) || '' }, topicLabel(a));
    chip.dataset.aim = a;
    chip.addEventListener('click', () => {
      const on = $$('#mock-aims .chip.on');
      if (chip.classList.contains('on') && on.length > 1) chip.classList.remove('on');
      else chip.classList.add('on');
    });
    aimsRow.appendChild(chip);
  });

  const paperTypeSel = $('#mock-paper-type');
  if (paperTypeSel && !paperTypeSel.dataset.bound) {
    paperTypeSel.addEventListener('change', renderMockFormatInfo);
    paperTypeSel.dataset.bound = '1';
  }
  renderMockFormatInfo();

  $('#btn-generate').addEventListener('click', () => {
    const seed = $('#mock-seed').value || String(Date.now());
    const paperType = paperTypeSel ? paperTypeSel.value : 'Paper 1';
    const aims = $$('#mock-aims .chip.on').map(c => c.dataset.aim);
    const ctx = $('#mock-context') ? $('#mock-context').value : '';
    generateMock(seed, aims, paperType, ctx);
  });
  $('#btn-print').addEventListener('click', () => {
    document.body.classList.remove('print-ms-only');
    $('#mock-paper').classList.remove('force-ms');
    window.print();
  });
  $('#btn-print-ms').addEventListener('click', () => {
    if (!lastMock) { alert('Generate a paper first.'); return; }
    const paper = $('#mock-paper');
    const wasShowing = mockShowMs;
    mockShowMs = true;
    renderMock(lastMock);
    paper.classList.add('force-ms');
    document.body.classList.add('print-ms-only');
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-ms-only');
        paper.classList.remove('force-ms');
        mockShowMs = wasShowing;
        renderMock(lastMock);
      }, 300);
    }, 50);
  });
  $('#btn-toggle-ms').addEventListener('click', () => {
    mockShowMs = !mockShowMs;
    $('#btn-toggle-ms').textContent = mockShowMs ? 'Hide mark scheme' : 'Show mark scheme';
    if (lastMock) renderMock(lastMock);
  });
  $('#mock-paper').className = 'paper empty';
  $('#mock-paper').innerHTML = '<p>Choose a paper and click <strong>Generate mock paper</strong> to build a full 100-mark paper in the real AQA format.</p>';
}

function styleOfQuestion(q) {
  if (q.type === 'multiple_choice') return 'mc';
  if (q.marks >= 16) return 'essay';
  if (q.marks >= 6) return 'data';
  return 'short';
}

// Pick n items spreading across topics (round robin) so a paper covers the spec.
function pickSpread(pool, n, rng, usedTopics) {
  const byTopic = {};
  shuffle(pool, rng).forEach(q => { (byTopic[q.learning_aim] = byTopic[q.learning_aim] || []).push(q); });
  const topics = shuffle(Object.keys(byTopic), rng);
  if (usedTopics) topics.sort((a, b) => (usedTopics.has(a) ? 1 : 0) - (usedTopics.has(b) ? 1 : 0));
  const out = [];
  while (out.length < n && topics.some(t => byTopic[t].length)) {
    for (const t of topics) {
      if (out.length >= n) break;
      const q = byTopic[t].shift();
      if (q) { out.push(q); if (usedTopics) usedTopics.add(t); }
    }
  }
  return out;
}

function buildPaper1(aims, rng) {
  const pool = QUESTIONS.filter(q => q.paper === 'Paper 1' && aims.includes(String(q.learning_aim)));
  const fallback = QUESTIONS.filter(q => q.paper === 'Paper 1');
  const take = (filter, n, used) => {
    let got = pickSpread(pool.filter(filter), n, rng, used);
    if (got.length < n) {
      const ids = new Set(got.map(q => q.id));
      got = got.concat(pickSpread(fallback.filter(q => filter(q) && !ids.has(q.id)), n - got.length, rng, used));
    }
    return got;
  };
  const items = [];
  take(q => q.type === 'multiple_choice', 15).forEach((q, i) =>
    items.push({ ...q, _section: 'Section A', _label: String(i + 1).padStart(2, '0') }));
  const usedB = new Set();
  const calcs = take(q => q.type === 'calculation' && q.marks === 4, 2, usedB);
  const ana = take(q => q.paper_section === 'Section B' && q.marks === 9, 3, usedB);
  calcs.concat(ana).forEach((q, i) => items.push({ ...q, _section: 'Section B', _label: String(16 + i) }));
  const essays = q => q.marks === 25;
  const usedE = new Set();
  let secC = take(q => essays(q) && Number(q.learning_aim) <= 6, 2, usedE);
  let secD = take(q => essays(q) && Number(q.learning_aim) >= 7, 2, usedE);
  if (secC.length < 2 || secD.length < 2) {
    const all = take(essays, 4, new Set());
    secC = all.slice(0, 2); secD = all.slice(2, 4);
  }
  secC.forEach((q, i) => items.push({ ...q, _section: 'Section C', _label: String(21 + i), _choice: 'C' }));
  secD.forEach((q, i) => items.push({ ...q, _section: 'Section D', _label: String(23 + i), _choice: 'D' }));
  const counted = items.filter(q => !q._choice).reduce((t, q) => t + q.marks, 0) + (secC.length ? 25 : 0) + (secD.length ? 25 : 0);
  return { items, counted };
}

function buildPaper2(rng) {
  const sets = shuffle(P2_SETS.slice(), rng);
  let chosen = null;
  for (let i = 0; i < sets.length && !chosen; i++)
    for (let j = i + 1; j < sets.length && !chosen; j++)
      for (let k = j + 1; k < sets.length && !chosen; k++)
        if (sets[i].total + sets[j].total + sets[k].total === 100) chosen = [sets[i], sets[j], sets[k]];
  if (!chosen) chosen = sets.slice(0, 3);
  const byId = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
  const items = [];
  chosen.forEach((s, n) => {
    s.question_ids.forEach((id, pIdx) => {
      const q = byId[id];
      if (q) items.push({ ...q, _section: `Question ${n + 1}`, _label: `0${n + 1}.${pIdx + 1}`, _setIndex: n });
    });
  });
  return { items, contexts: chosen, counted: items.reduce((t, q) => t + q.marks, 0) };
}

function buildPaper3(rng, caseId) {
  const c = (caseId && P3_CASES.find(x => x.id === caseId)) || shuffle(P3_CASES.slice(), rng)[0];
  if (!c) return { items: [], counted: 0 };
  const byId = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
  const items = c.question_ids
    .map((id, i) => byId[id] ? { ...byId[id], _section: 'Answer all questions', _label: String(i + 1).padStart(2, '0') } : null)
    .filter(Boolean);
  return { items, caseStudy: c, counted: items.reduce((t, q) => t + q.marks, 0) };
}

async function generateMock(seed, aims, paperType, contextId) {
  const rng = makeRng(seed);
  if (!await ra10Gate('mock_paper_gen')) return;
  let built;
  if (paperType === 'Paper 2') built = buildPaper2(rng);
  else if (paperType === 'Paper 3') built = buildPaper3(rng, contextId);
  else built = buildPaper1(aims && aims.length ? aims : TOPIC_CODES, rng);
  if (!built.items.length) { alert('No questions available for this paper.'); return; }
  if (built.counted !== 100) console.warn(`${paperType} mock totals ${built.counted} marks`);
  lastMock = { ...built, total: built.counted, seed, paperType, generatedAt: new Date().toISOString() };
  renderMock(lastMock);
}

function answerSpace(q, lineDensity) {
  if (q.type === 'multiple_choice') {
    const opts = el('ol', { class: 'mc-options' });
    (q.options || []).forEach(o => opts.appendChild(el('li', null, el('span', { class: 'mc-tick' }), el('span', { class: 'mc-letter' }, o.label), el('span', { class: 'mc-text' }, o.text))));
    return el('div', null, opts, el('p', { class: 'mc-instr' }, 'Completely fill in the circle alongside the appropriate answer.'));
  }
  const linesByMark = { 2: 4, 3: 6, 4: 10, 6: 14, 9: 24, 12: 32, 16: 42, 20: 50, 24: 60, 25: 62 };
  const baseLines = linesByMark[q.marks] || Math.max(4, q.marks * 2);
  const densityMult = { extra: 1.4, normal: 1, compact: 0.6, none: 0 }[lineDensity] || 1;
  const numLines = Math.round(baseLines * densityMult);
  const box = el('div');
  if (q.type === 'calculation' && numLines > 0) {
    box.appendChild(el('div', { class: 'calc-answer-box' }, el('span', null, 'Answer'), el('span', { class: 'calc-answer-line' })));
    box.appendChild(el('p', { class: 'calc-working-label' }, 'Working'));
  }
  if (numLines > 0) {
    const linesBox = el('div', { class: 'answer-lines', 'aria-hidden': 'true' });
    for (let l = 0; l < numLines; l++) linesBox.appendChild(el('div', { class: 'answer-line' }));
    box.appendChild(linesBox);
  }
  return box;
}

function renderMock(mock) {
  const wrap = $('#mock-paper');
  wrap.className = 'paper' + (mockShowMs ? ' mock-with-ms' : '');
  wrap.innerHTML = '';
  const fmt = PAPER_FORMATS[mock.paperType] || {};
  const headerOpts = {
    name: $('#opt-header-name') ? $('#opt-header-name').checked : false,
    cls: $('#opt-header-class') ? $('#opt-header-class').checked : false,
    date: $('#opt-header-date') ? $('#opt-header-date').checked : false,
    centre: $('#opt-header-centre') ? $('#opt-header-centre').checked : false,
    teacher: $('#opt-header-teacher') ? $('#opt-header-teacher').checked : false,
    custom: $('#opt-header-custom') ? $('#opt-header-custom').value.trim() : ''
  };
  const lineDensity = $('#opt-line-density') ? $('#opt-line-density').value : 'normal';

  const instructions = {
    'Paper 1': ['Answer all questions in Section A and Section B.', 'Answer one question from Section C and one question from Section D.', 'You will need a calculator. The maximum mark for this paper is 100.'],
    'Paper 2': ['Answer all questions.', 'Each question is based on its own information and appendices.', 'You will need a calculator. The maximum mark for this paper is 100.'],
    'Paper 3': ['Read the case study (Insert) before answering.', 'Answer all questions.', 'You will need a calculator. The maximum mark for this paper is 100.']
  }[mock.paperType] || [];
  wrap.appendChild(el('div', { class: 'paper-header' },
    el('h3', null, `A-level Business (7132) · ${mock.paperType}: ${fmt.name || ''}`),
    el('p', null, `RA10 mock · Time allowed: 2 hours · ${mock.total} marks · Seed: ${mock.seed}`),
    el('ul', { class: 'paper-instructions' }, ...instructions.map(t => el('li', null, t)))
  ));

  const candidateRows = [];
  if (headerOpts.name) candidateRows.push('Name');
  if (headerOpts.cls) candidateRows.push('Class');
  if (headerOpts.date) candidateRows.push('Date');
  if (headerOpts.centre) candidateRows.push('Centre / Candidate No.');
  if (headerOpts.teacher) candidateRows.push('Teacher');
  if (candidateRows.length || headerOpts.custom) {
    const ch = el('div', { class: 'candidate-header' });
    candidateRows.forEach(label => ch.appendChild(el('div', { class: 'ch-line' }, el('span', { class: 'ch-label' }, label + ':'), el('span', { class: 'ch-fill' }))));
    if (headerOpts.custom) ch.appendChild(el('div', { class: 'ch-custom' }, headerOpts.custom));
    wrap.appendChild(ch);
  }

  if (mock.paperType === 'Paper 3' && mock.caseStudy) {
    const c = mock.caseStudy;
    const ins = el('div', { class: 'paper-insert' });
    ins.appendChild(el('h3', null, `Insert - Source: ${c.title}`));
    (c.insert || []).forEach(sec => {
      if (sec.heading) ins.appendChild(el('h4', null, sec.heading));
      (sec.paragraphs || []).forEach(p => ins.appendChild(el('p', null, p)));
    });
    ins.appendChild(renderAppendices(c.appendices));
    ins.appendChild(el('p', { class: 'insert-end' }, 'END OF SOURCES'));
    wrap.appendChild(ins);
  }

  const sectionNotes = {
    'Section A': 'Answer all questions in this section. Only one answer per question is allowed.',
    'Section B': 'Answer all questions in this section.',
    'Section C': 'Answer EITHER Question 21 OR Question 22.',
    'Section D': 'Answer EITHER Question 23 OR Question 24.'
  };
  let currentSection = '';
  mock.items.forEach((q) => {
    if (q._section !== currentSection) {
      currentSection = q._section;
      wrap.appendChild(el('div', { class: 'paper-section-title' }, currentSection));
      if (mock.paperType === 'Paper 1' && sectionNotes[currentSection]) wrap.appendChild(el('p', { class: 'section-note' }, sectionNotes[currentSection]));
      if (mock.paperType === 'Paper 2' && mock.contexts && q._setIndex != null) {
        const s = mock.contexts[q._setIndex];
        const ctx = el('div', { class: 'paper-context' });
        ctx.appendChild(el('p', { class: 'section-note' }, 'Read the information below and then answer the questions that follow.'));
        ctx.appendChild(el('h4', null, s.title));
        (s.context || []).forEach(p => ctx.appendChild(el('p', null, p)));
        ctx.appendChild(renderAppendices(s.appendices));
        wrap.appendChild(ctx);
      }
    }
    const sx = el('div', { class: 'paper-section' + (q._choice ? ' paper-choice' : '') });
    sx.appendChild(el('div', { class: 'section-tag' }, `Question ${q._label}`, el('span', { class: 'aim-pill' }, q.spec_ref || topicLabel(q.learning_aim))));
    if (mock.paperType === 'Paper 1' && q.scenario) sx.appendChild(el('pre', { class: 'scenario scenario-data' }, q.scenario));
    sx.appendChild(el('div', { class: 'paper-question' }, el('span', { class: 'qtext' }, q.question, el('span', { class: 'marks-bracket' }, ` [${q.marks} mark${q.marks === 1 ? '' : 's'}]`))));
    sx.appendChild(answerSpace(q, lineDensity));
    if (mockShowMs) {
      const msb = el('div', { class: 'ms-block' });
      msb.appendChild(renderMarkScheme(q, { enableDrawing: false }));
      sx.appendChild(msb);
    }
    wrap.appendChild(sx);
  });
  wrap.appendChild(el('div', { class: 'paper-totals', style: 'text-align:right;font-size:16px;margin-top:24px;border-top:2px solid #14201E;padding-top:12px;' },
    mock.paperType === 'Paper 1' ? 'END OF QUESTIONS · Maximum mark for this paper = 100 (one essay from Section C and one from Section D)' : `END OF QUESTIONS · TOTAL FOR PAPER = ${mock.total} MARKS`));
}

// ---------- Practice mode ----------
let practiceQueue = [];
let practiceIdx = 0;
let activePracticeCleanup = null;

function renderPracticeControls() {
  const aimSel = $('#practice-aim');
  if (!aimSel.dataset.ready) {
    TOPIC_CODES.forEach(a => aimSel.appendChild(el('option', { value: a }, topicLabel(a))));
    aimSel.dataset.ready = '1';
  }
  const marksSel = $('#practice-marks');
  if (!marksSel.dataset.ready) {
    MARKS_OPTIONS.forEach(m => marksSel.appendChild(el('option', { value: String(m) }, `${m} mark${m===1?'':'s'}`)));
    marksSel.dataset.ready = '1';
  }
  const paperSel = $('#practice-paper');
  if (paperSel && !paperSel.dataset.ready) {
    PAPER_OPTIONS.forEach((p) => paperSel.appendChild(el('option', { value: p }, p)));
    paperSel.dataset.ready = '1';
  }
  if (!renderPracticeControls._bound) {
    $('#btn-practice-start').addEventListener('click', () => startPractice());
    renderPracticeControls._bound = true;
  }
  let endBtn = document.getElementById('btn-practice-end');
  if (!endBtn) {
    endBtn = el('button', { id: 'btn-practice-end', class: 'btn', type: 'button' }, 'End session');
    $('#btn-practice-start').insertAdjacentElement('afterend', endBtn);
    endBtn.addEventListener('click', endPracticeSession);
  }
  $('#practice-card').innerHTML = '<p class="muted" style="padding:40px;text-align:center;">Pick filters and click <strong>Start session</strong>.</p>';
}

async function startPractice() {
  const aim = $('#practice-aim').value;
  const marks = $('#practice-marks').value;
  const paper = $('#practice-paper') ? $('#practice-paper').value : '';
  let pool = QUESTIONS.slice();
  if (aim) pool = pool.filter(q => q.learning_aim === aim);
  if (marks) pool = pool.filter(q => String(q.marks) === marks);
  if (paper) pool = pool.filter(q => questionHasPaper(q, paper));
  if (!pool.length) { alert('No questions match those filters.'); return; }
  if (!await ra10Gate('practice_question')) return;
  window._practiceSession = {
    aims: aim ? [aim] : TOPIC_CODES,
    total: 0,
    correct: 0,
    aimBreakdown: {},
    attemptedIds: new Set(),
    scoreByQuestion: {}
  };
  practiceQueue = shuffle(pool);
  practiceIdx = 0;
  renderPracticeCard();
}

function updatePracticeSessionFromUi(q, automarkHost) {
  if (window._practiceSession) {
    const ps = window._practiceSession;
    const qid = q.id || `${q.learning_aim}-${practiceIdx}`;
    const aim = q.learning_aim || q.learningaim;
    ps.aimBreakdown[aim] = ps.aimBreakdown[aim] || { correct: 0, total: 0 };
    const alreadyAttempted = ps.attemptedIds.has(qid);
    if (!alreadyAttempted) {
      ps.attemptedIds.add(qid);
      ps.total++;
      ps.aimBreakdown[aim].total++;
      incrementCounter('ra10_questions_today', 1);
      addPracticeProgress(1);
    }
    const scoreNum = parseInt(automarkHost.querySelector('.value')?.textContent || '0', 10);
    const wasCorrect = !!ps.scoreByQuestion[qid];
    const nowCorrect = scoreNum >= Math.ceil(q.marks / 2);
    if (!wasCorrect && nowCorrect) {
      ps.correct++;
      ps.aimBreakdown[aim].correct++;
    } else if (wasCorrect && !nowCorrect) {
      ps.correct = Math.max(0, ps.correct - 1);
      ps.aimBreakdown[aim].correct = Math.max(0, ps.aimBreakdown[aim].correct - 1);
    }
    ps.scoreByQuestion[qid] = nowCorrect;
  }
}

async function endPracticeSession() {
  const ps = window._practiceSession;
  if (!ps || !ps.total) {
    alert('No practice attempts to save yet.');
    return;
  }
  const practiceQ = window._practiceSession?.total || 0;
  await saveSession('practice_alevel_bus', {
    aims: Object.keys(ps.aimBreakdown),
    total: ps.total,
    correct: ps.correct,
    aimBreakdown: ps.aimBreakdown,
    attemptedIds: ps.attemptedIds
  });
  awardXP(Math.min(practiceQ * 10, 50), '+' + Math.min(practiceQ * 10, 50) + ' XP — Practice done!');
  window._practiceSession = null;
}

function renderPracticeCard() {
  const wrap = $('#practice-card');
  if (typeof activePracticeCleanup === 'function') {
    activePracticeCleanup();
    activePracticeCleanup = null;
  }
  wrap.innerHTML = '';
  if (!practiceQueue.length) return;
  const q = practiceQueue[practiceIdx];
  $('#practice-progress').textContent = `Question ${practiceIdx + 1} of ${practiceQueue.length}`;

  const card = el('div', { class: 'practice-card' });
  card.appendChild(el('div', { class: 'qrow-meta' },
    el('span', { class: 'tag id' }, q.id),
    el('span', { class: 'tag' }, topicLabel(q.learning_aim)),
    getQuestionPapers(q).length ? el('span', { class: 'tag' }, getQuestionPapers(q).join(' · ') + (q.paper_section ? ' · ' + q.paper_section : '')) : null,
    el('span', { class: 'tag verb' }, q.command_verb),
    el('span', { class: 'tag marks' }, `${q.marks} mark${q.marks===1?'':'s'}`)
  ));
  if (q.scenario) card.appendChild(renderQuestionContext(q, { open: !(q.paper === 'Paper 3' && q.part === '6') }));
  card.appendChild(el('p', { class: 'question' }, q.question, el('span', { class: 'marks-bracket' }, ` [${q.marks} mark${q.marks === 1 ? '' : 's'}]`)));
  if (q.marks >= 9) {
    const tips = {
      9: 'Analyse: build one or two developed chains of reasoning applied to the context. No conclusion needed.',
      12: 'Analyse (12): one well-developed argument using the case can reach Level 3. No judgement needed.',
      16: 'Evaluate (16): arguments on both sides, using the data/case, then a judgement that weighs them and says what it depends on.',
      20: 'Evaluate (20): analyse BOTH options or both sides in context, then a justified recommendation.',
      24: "Evaluate (24): use contrasting business contexts for 'all businesses', balance, and a judgement that flows from your arguments.",
      25: 'Essay (25): pick your own examples for context, develop arguments on both sides, then weigh them up - do not just summarise.'
    };
    if (tips[q.marks]) card.appendChild(el('p', { class: 'exam-technique-hint' }, 'ℹ️ ' + tips[q.marks]));
  }

  // Diagram questions get a sketch canvas; MC gets clickable A–D options;
  // everything else gets a textarea.
  let ta = null;
  let mcChoice = { value: null };
  if (q.type === 'diagram') {
    const diagramTool = buildDiagramTool(q);
    card.appendChild(diagramTool.wrap);
    activePracticeCleanup = diagramTool.destroy;
  } else if (q.type === 'multiple_choice') {
    card.appendChild(buildMcOptions(q, mcChoice));
  } else {
    ta = el('textarea', { placeholder: 'Type your answer here…' });
    card.appendChild(ta);
  }

  const actions = el('div', { class: 'practice-actions' });
  const btnLabel = q.type === 'diagram' ? 'Self-mark with mark scheme'
                 : q.type === 'multiple_choice' ? 'Check my answer'
                 : 'Auto-mark my answer';
  const btnAutoMark = el('button', { class: 'btn primary' }, btnLabel);
  const btnExamine = el('button', { class: 'btn btn-examine' });
  const aiBtnIcon = el('span', { style: 'display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;' });
  aiBtnIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="filter:drop-shadow(0 0 4px #fff9);"><path d="M12 3l2.1 4.9L19 10l-4.9 2.1L12 17l-2.1-4.9L5 10l4.9-2.1L12 3z"/><path d="M18.5 4.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z"/></svg>';
  btnExamine.appendChild(aiBtnIcon);
  btnExamine.appendChild(el('span', { style: 'color:#fff;' }, 'AI Examiner'));
  const btnReveal = el('button', { class: 'btn' }, 'Reveal mark scheme');
  const btnNext = el('button', { class: 'btn' }, 'Next question →');
  const btnPrev = el('button', { class: 'btn ghost' }, '← Previous');
  btnPrev.disabled = practiceIdx === 0;
  btnNext.disabled = practiceIdx >= practiceQueue.length - 1;
  actions.appendChild(btnAutoMark);
  actions.appendChild(btnExamine);
  actions.appendChild(btnReveal);
  actions.appendChild(btnPrev);
  actions.appendChild(btnNext);
  card.appendChild(actions);

  const automarkHost = el('div', { class: 'automark-host' });
  card.appendChild(automarkHost);

  const msBox = el('div', { class: 'practice-msbox', style: 'display:none;' });
  msBox.appendChild(renderMarkScheme(q));
  card.appendChild(msBox);

  btnReveal.addEventListener('click', () => {
    msBox.style.display = msBox.style.display === 'none' ? 'block' : 'none';
    btnReveal.textContent = msBox.style.display === 'none' ? 'Reveal mark scheme' : 'Hide mark scheme';
  });
  btnExamine.addEventListener('click', async () => {
    if (q.type === 'diagram' || q.type === 'multiple_choice') {
      alert('AI Examiner is for extended-answer questions only.');
      return;
    }
    const answer = ta.value.trim();
    if (!answer) { alert('Write an answer first, then I can examine it.'); return; }
    if (!window.RA10 || typeof RA10.examineAnswer !== 'function') {
      alert('AI Examiner is not available right now.');
      return;
    }

    // Confirm the credit cost (skipped when it's free on the user's plan).
    if (window.RA10AI) {
      if (!(await RA10AI.confirmCredits(RA10AI.examinerCost(), 'AI Examiner'))) return;
    }

    btnExamine.disabled = true;
    const _origLabel = btnExamine.textContent;
    btnExamine.dataset.aiExamining = 'true';
    btnExamine.innerHTML = '<span class="ai-examiner-loading"><span class="ai-examiner-orb"></span><span>Examining your answer<span class="ai-examiner-dots">...</span></span></span>';
    try {
      const response = await RA10.examineAnswer({ question: q, answer });
      automarkHost.innerHTML = '';
      if (response && response.result) {
        const aiResult = normaliseAiMarkResult(response.result, q, true, answer);
        if (aiResult) {
          automarkHost.appendChild(window.RA10AI ? RA10AI.renderExamResult({ question: q, answer, result: response.result, markScheme: () => renderMarkScheme(q) }) : buildAutoMarkUI(q, answer, aiResult, 'ai'));
        } else {
          automarkHost.appendChild(el('p', { style: 'color:var(--color-error);' }, 'AI Examiner response was invalid. Please try again.'));
        }
      } else {
        automarkHost.appendChild(el('p', { style: 'color:var(--color-error);' }, 'AI Examiner response was empty. Please try again.'));
      }
      updatePracticeSessionFromUi(q, automarkHost);
      automarkHost.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      const message = err && err.message ? String(err.message) : 'AI Examiner request failed.';
      if (message.includes('Not enough credits')) {
        RA10.showPaywall('credits', 'ai_examiner');
      } else {
        alert(friendlyAiConnectError(message));
      }
    } finally {
      if (window._ra10RenderUnitCreditChip) {
        try { await window._ra10RenderUnitCreditChip(); } catch (e) {}
      }
      if (window._updateSubjectBanner) {
        try { window._updateSubjectBanner(); } catch (e) {}
      }
      btnExamine.disabled = false;
      delete btnExamine.dataset.aiExamining;
      btnExamine.textContent = _origLabel;
    }
  });
  btnAutoMark.addEventListener('click', async () => {
    btnAutoMark.disabled = true;
    const _origLabel = btnAutoMark.textContent;
    btnAutoMark.textContent = 'Marking…';
    try {
    if (q.type === 'diagram') {
      automarkHost.innerHTML = '';
      automarkHost.appendChild(buildSelfMarkUI(q));
      automarkHost.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    if (q.type === 'multiple_choice') {
      if (!mcChoice.value) { alert('Pick an answer (A–D) first.'); return; }
      automarkHost.innerHTML = '';
      automarkHost.appendChild(buildMcResultUI(q, mcChoice.value));
      updatePracticeSessionFromUi(q, automarkHost);
      automarkHost.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    const answer = ta.value.trim();
    if (!answer) { alert('Write an answer first, then I can mark it.'); return; }
    automarkHost.innerHTML = '';
    const markBundle = await buildBestAutoMarkUI(q, answer);
    automarkHost.appendChild(markBundle.ui);
    if (markBundle.aiError) {
      automarkHost.appendChild(el('p', { class: 'muted', style: 'margin-top:8px;' }, `AI marking is unavailable right now, so local automark was used (${markBundle.aiError}).`));
    }
    const earned = parseInt(automarkHost.querySelector('.automark-score .value')?.textContent || '0', 10);
    const struggleThreshold = Math.ceil((Number(q.marks) || 1) / 2);
    if (earned < struggleThreshold) {
      const jump = el('button', { class: 'btn ghost', type: 'button' }, 'Open Revision Guide topic');
      jump.addEventListener('click', () => openRevisionGuideForQuestion(q));
      automarkHost.appendChild(el('div', { style: 'margin-top:10px;' }, jump));
    }
    updatePracticeSessionFromUi(q, automarkHost);
    automarkHost.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
      btnAutoMark.disabled = false;
      btnAutoMark.textContent = _origLabel;
    }
  });
  btnNext.addEventListener('click', () => { practiceIdx++; renderPracticeCard(); });
  btnPrev.addEventListener('click', () => { practiceIdx--; renderPracticeCard(); });

  wrap.appendChild(card);
}

// ---------- Diagram tool (draw + builder modes) ----------
function buildDiagramTool(q) {
  const ac = new AbortController();
  const signal = ac.signal;
  const wrap = el('div', { class: 'diagram-tool-wrap' });
  const tabs = el('div', { class: 'diagram-mode-tabs' });
  const drawTab = el('button', { class: 'btn primary', type: 'button' }, 'Draw');
  const buildTab = el('button', { class: 'btn', type: 'button' }, 'Build');
  tabs.appendChild(drawTab);
  tabs.appendChild(buildTab);

  const drawPane = el('div', { class: 'diagram-pane diagram-pane-active' });
  const drawToolbar = el('div', { class: 'sketch-toolbar' });
  const drawCanvas = el('canvas', { class: 'sketch-canvas', width: '900', height: '500' });
  const drawHint = el('span', { class: 'sketch-hint muted' }, 'Draw freehand, or switch to Build mode to place shapes and connectors.');
  const drawCtx = drawCanvas.getContext('2d');

  function fitDrawCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const cssW = drawCanvas.clientWidth || 900;
    const cssH = 500;
    drawCanvas.width = cssW * ratio;
    drawCanvas.height = cssH * ratio;
    drawCanvas.style.height = cssH + 'px';
    drawCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawCtx.fillStyle = '#ffffff';
    drawCtx.fillRect(0, 0, cssW, cssH);
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
  }
  const fitTimer = setTimeout(fitDrawCanvas, 0);

  let drawing = false;
  let last = null;
  let strokeColor = '#14201E';
  let strokeWidth = 2;

  function drawPos(e) {
    const r = drawCanvas.getBoundingClientRect();
    const t = e.touches && e.touches[0];
    const x = (t ? t.clientX : e.clientX) - r.left;
    const y = (t ? t.clientY : e.clientY) - r.top;
    return { x, y };
  }

  function drawDown(e) { e.preventDefault(); drawing = true; last = drawPos(e); }
  function drawMove(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = drawPos(e);
    drawCtx.strokeStyle = strokeColor;
    drawCtx.lineWidth = strokeWidth;
    drawCtx.beginPath();
    drawCtx.moveTo(last.x, last.y);
    drawCtx.lineTo(p.x, p.y);
    drawCtx.stroke();
    last = p;
  }
  function drawUp() { drawing = false; last = null; }

  drawCanvas.addEventListener('mousedown', drawDown, { signal });
  drawCanvas.addEventListener('mousemove', drawMove, { signal });
  window.addEventListener('mouseup', drawUp, { signal });
  drawCanvas.addEventListener('touchstart', drawDown, { passive: false, signal });
  drawCanvas.addEventListener('touchmove', drawMove, { passive: false, signal });
  drawCanvas.addEventListener('touchend', drawUp, { signal });

  function drawBtn(label, onClick, cls) {
    const b = el('button', { class: 'btn ' + (cls || ''), type: 'button' }, label);
    b.addEventListener('click', onClick);
    return b;
  }

  const penBtn = drawBtn('Pen', () => { strokeColor = '#14201E'; strokeWidth = 2; setDrawActive(penBtn); }, 'primary');
  const eraseBtn = drawBtn('Eraser', () => { strokeColor = '#ffffff'; strokeWidth = 16; setDrawActive(eraseBtn); });
  const clearDrawBtn = drawBtn('Clear', () => fitDrawCanvas(), 'ghost');
  const saveDrawBtn = drawBtn('Download as PNG', () => {
    const link = document.createElement('a');
    link.download = 'diagram-draw-' + (q.id || 'sketch') + '.png';
    link.href = drawCanvas.toDataURL('image/png');
    link.click();
  }, 'ghost');

  function setDrawActive(active) {
    [penBtn, eraseBtn].forEach(b => b.classList.remove('primary'));
    active.classList.add('primary');
  }

  drawToolbar.appendChild(penBtn);
  drawToolbar.appendChild(eraseBtn);
  drawToolbar.appendChild(clearDrawBtn);
  drawToolbar.appendChild(saveDrawBtn);
  drawPane.appendChild(drawToolbar);
  drawPane.appendChild(drawCanvas);
  drawPane.appendChild(drawHint);

  const buildPane = el('div', { class: 'diagram-pane' });
  const buildLayout = el('div', { class: 'diagram-builder-layout' });
  const panel = el('div', { class: 'diagram-builder-panel' });
  const canvasWrap = el('div', { class: 'diagram-builder-canvas-wrap' });
  const buildCanvas = el('canvas', { class: 'diagram-builder-canvas', width: '1000', height: '560' });
  const buildCtx = buildCanvas.getContext('2d');

  const toolGroup = el('div', { class: 'diagram-tool-buttons' });
  const textInput = el('input', { type: 'text', class: 'field-input', placeholder: 'Shape text (optional)' });
  const colorInput = el('input', { type: 'color', value: '#ffffff', class: 'diagram-color-input' });
  const deleteBtn = el('button', { class: 'btn', type: 'button' }, 'Delete selected');
  const clearAllBtn = el('button', { class: 'btn ghost', type: 'button' }, 'Clear all');
  const saveBuildBtn = el('button', { class: 'btn', type: 'button' }, 'Download as PNG');

  const tools = [
    { key: 'rect', label: '[ ] Rectangle' },
    { key: 'diamond', label: '<> Diamond' },
    { key: 'oval', label: '( ) Start/End' },
    { key: 'parallelogram', label: '/_/ Input/Output' },
    { key: 'connector', label: '--> Connector' },
  ];

  let activeTool = 'rect';
  const shapes = [];
  const connectors = [];
  const grid = 20;
  let selectedShape = -1;
  let resizeHandle = null;
  let dragging = false;
  let dragDX = 0;
  let dragDY = 0;
  let connectFrom = -1;
  let textEditor = null;
  let builderRaf = 0;

  function scheduleBuilderRender() {
    if (builderRaf) cancelAnimationFrame(builderRaf);
    builderRaf = requestAnimationFrame(() => {
      builderRaf = 0;
      renderBuilder();
    });
  }

  function snap(n) {
    return Math.round(n / grid) * grid;
  }

  function setTool(key) {
    activeTool = key;
    connectFrom = -1;
    Array.from(toolGroup.querySelectorAll('button')).forEach((b) => {
      b.classList.toggle('primary', b.dataset.tool === key);
    });
  }

  function makeToolButton(t) {
    const b = el('button', { class: 'btn', type: 'button', 'data-tool': t.key }, t.label);
    b.addEventListener('click', () => setTool(t.key), { signal });
    return b;
  }

  tools.forEach((t) => toolGroup.appendChild(makeToolButton(t)));
  setTool('rect');

  function drawGrid() {
    buildCtx.strokeStyle = '#edf0ea';
    buildCtx.lineWidth = 1;
    for (let x = 0; x <= buildCanvas.width; x += grid) {
      buildCtx.beginPath();
      buildCtx.moveTo(x + 0.5, 0);
      buildCtx.lineTo(x + 0.5, buildCanvas.height);
      buildCtx.stroke();
    }
    for (let y = 0; y <= buildCanvas.height; y += grid) {
      buildCtx.beginPath();
      buildCtx.moveTo(0, y + 0.5);
      buildCtx.lineTo(buildCanvas.width, y + 0.5);
      buildCtx.stroke();
    }
  }

  function centerOf(shape) {
    return { x: shape.x + shape.w / 2, y: shape.y + shape.h / 2 };
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  function drawShape(s, idx) {
    buildCtx.save();
    buildCtx.fillStyle = s.fill || '#ffffff';
    buildCtx.strokeStyle = '#14201E';
    buildCtx.lineWidth = 2;

    if (s.type === 'rect') {
      buildCtx.beginPath();
      buildCtx.rect(s.x, s.y, s.w, s.h);
      buildCtx.fill();
      buildCtx.stroke();
    } else if (s.type === 'diamond') {
      buildCtx.beginPath();
      buildCtx.moveTo(s.x + s.w / 2, s.y);
      buildCtx.lineTo(s.x + s.w, s.y + s.h / 2);
      buildCtx.lineTo(s.x + s.w / 2, s.y + s.h);
      buildCtx.lineTo(s.x, s.y + s.h / 2);
      buildCtx.closePath();
      buildCtx.fill();
      buildCtx.stroke();
    } else if (s.type === 'oval') {
      roundedRectPath(buildCtx, s.x, s.y, s.w, s.h, Math.min(30, s.h / 2));
      buildCtx.fill();
      buildCtx.stroke();
    } else if (s.type === 'parallelogram') {
      const skew = Math.max(18, Math.round(s.w * 0.15));
      buildCtx.beginPath();
      buildCtx.moveTo(s.x + skew, s.y);
      buildCtx.lineTo(s.x + s.w, s.y);
      buildCtx.lineTo(s.x + s.w - skew, s.y + s.h);
      buildCtx.lineTo(s.x, s.y + s.h);
      buildCtx.closePath();
      buildCtx.fill();
      buildCtx.stroke();
    }

    buildCtx.fillStyle = '#14201E';
    buildCtx.textAlign = 'center';
    buildCtx.textBaseline = 'middle';
    buildCtx.font = '14px Satoshi, sans-serif';
    const txt = String(s.text || '').slice(0, 70);
    buildCtx.fillText(txt, s.x + s.w / 2, s.y + s.h / 2, s.w - 16);

    if (idx === selectedShape) {
      buildCtx.strokeStyle = '#00594E';
      buildCtx.setLineDash([5, 4]);
      buildCtx.strokeRect(s.x - 4, s.y - 4, s.w + 8, s.h + 8);
      buildCtx.setLineDash([]);
      const handles = getHandles(s);
      buildCtx.fillStyle = '#00594E';
      handles.forEach((h) => buildCtx.fillRect(h.x - 4, h.y - 4, 8, 8));
    }

    buildCtx.restore();
  }

  function drawConnectors() {
    buildCtx.save();
    buildCtx.strokeStyle = '#14201E';
    buildCtx.fillStyle = '#14201E';
    buildCtx.lineWidth = 2;
    connectors.forEach((c) => {
      const from = shapes[c.from];
      const to = shapes[c.to];
      if (!from || !to) return;
      const a = centerOf(from);
      const b = centerOf(to);
      buildCtx.beginPath();
      buildCtx.moveTo(a.x, a.y);
      buildCtx.lineTo(b.x, b.y);
      buildCtx.stroke();

      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      const arrowLen = 10;
      buildCtx.beginPath();
      buildCtx.moveTo(b.x, b.y);
      buildCtx.lineTo(b.x - arrowLen * Math.cos(angle - Math.PI / 6), b.y - arrowLen * Math.sin(angle - Math.PI / 6));
      buildCtx.lineTo(b.x - arrowLen * Math.cos(angle + Math.PI / 6), b.y - arrowLen * Math.sin(angle + Math.PI / 6));
      buildCtx.closePath();
      buildCtx.fill();
    });
    buildCtx.restore();
  }

  function renderBuilder() {
    buildCtx.clearRect(0, 0, buildCanvas.width, buildCanvas.height);
    drawGrid();
    drawConnectors();
    shapes.forEach((s, idx) => drawShape(s, idx));
  }

  function addShape(type, x, y) {
    const defaults = { x: snap(x), y: snap(y), w: 180, h: 90, text: textInput.value.trim(), fill: colorInput.value };
    if (type === 'diamond') {
      defaults.w = 180;
      defaults.h = 110;
    }
    if (type === 'oval') {
      defaults.w = 190;
      defaults.h = 80;
    }
    if (type === 'parallelogram') {
      defaults.w = 200;
      defaults.h = 90;
    }
    shapes.push({ type, x: defaults.x, y: defaults.y, w: defaults.w, h: defaults.h, text: defaults.text, fill: defaults.fill });
    selectedShape = shapes.length - 1;
    scheduleBuilderRender();
  }

  function canvasPos(e) {
    const r = buildCanvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function hitShape(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      if (x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h) return i;
    }
    return -1;
  }

  function getHandles(s) {
    return [
      { key: 'nw', x: s.x, y: s.y },
      { key: 'ne', x: s.x + s.w, y: s.y },
      { key: 'sw', x: s.x, y: s.y + s.h },
      { key: 'se', x: s.x + s.w, y: s.y + s.h },
    ];
  }

  function hitHandle(s, x, y) {
    const hs = getHandles(s);
    for (let i = 0; i < hs.length; i++) {
      const h = hs[i];
      if (Math.abs(x - h.x) <= 7 && Math.abs(y - h.y) <= 7) return h.key;
    }
    return null;
  }

  function startTextEdit(idx) {
    if (idx < 0 || !shapes[idx]) return;
    if (textEditor) textEditor.remove();
    const s = shapes[idx];
    const input = el('input', { type: 'text', class: 'diagram-inline-editor' });
    input.value = s.text || '';
    input.style.left = (s.x + 8) + 'px';
    input.style.top = (s.y + s.h / 2 - 14) + 'px';
    input.style.width = Math.max(80, s.w - 16) + 'px';
    canvasWrap.appendChild(input);
    textEditor = input;
    input.focus();
    input.select();
    function commit() {
      s.text = input.value.trim();
      input.remove();
      textEditor = null;
      scheduleBuilderRender();
    }
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') commit();
      if (ev.key === 'Escape') { input.remove(); textEditor = null; scheduleBuilderRender(); }
    });
    input.addEventListener('blur', commit);
  }

  buildCanvas.addEventListener('mousedown', (e) => {
    const p = canvasPos(e);
    const idx = hitShape(p.x, p.y);
    if (idx >= 0) {
      selectedShape = idx;
      const s = shapes[idx];
      const h = hitHandle(s, p.x, p.y);
      if (h) {
        resizeHandle = h;
      } else if (activeTool === 'connector') {
        if (connectFrom < 0) connectFrom = idx;
        else if (connectFrom !== idx) {
          connectors.push({ from: connectFrom, to: idx });
          connectFrom = -1;
        }
      } else {
        dragging = true;
        dragDX = p.x - s.x;
        dragDY = p.y - s.y;
      }
      scheduleBuilderRender();
      return;
    }

    selectedShape = -1;
    connectFrom = -1;
    if (activeTool !== 'connector') {
      addShape(activeTool, p.x, p.y);
    } else {
      scheduleBuilderRender();
    }
  }, { signal });

  buildCanvas.addEventListener('mousemove', (e) => {
    if (selectedShape < 0) return;
    const p = canvasPos(e);
    const s = shapes[selectedShape];
    if (!s) return;

    if (dragging) {
      s.x = snap(Math.max(0, Math.min(buildCanvas.width - s.w, p.x - dragDX)));
      s.y = snap(Math.max(0, Math.min(buildCanvas.height - s.h, p.y - dragDY)));
      scheduleBuilderRender();
      return;
    }

    if (resizeHandle) {
      const minW = 80;
      const minH = 50;
      if (resizeHandle.indexOf('e') >= 0) s.w = Math.max(minW, snap(p.x - s.x));
      if (resizeHandle.indexOf('s') >= 0) s.h = Math.max(minH, snap(p.y - s.y));
      if (resizeHandle.indexOf('w') >= 0) {
        const right = s.x + s.w;
        s.x = snap(Math.max(0, p.x));
        s.w = Math.max(minW, right - s.x);
      }
      if (resizeHandle.indexOf('n') >= 0) {
        const bottom = s.y + s.h;
        s.y = snap(Math.max(0, p.y));
        s.h = Math.max(minH, bottom - s.y);
      }
      scheduleBuilderRender();
    }
  }, { signal });

  window.addEventListener('mouseup', () => {
    dragging = false;
    resizeHandle = null;
  }, { signal });

  buildCanvas.addEventListener('dblclick', (e) => {
    const p = canvasPos(e);
    const idx = hitShape(p.x, p.y);
    if (idx >= 0) {
      selectedShape = idx;
      startTextEdit(idx);
    }
  }, { signal });

  deleteBtn.addEventListener('click', () => {
    if (selectedShape < 0) return;
    shapes.splice(selectedShape, 1);
    for (let i = connectors.length - 1; i >= 0; i--) {
      if (connectors[i].from === selectedShape || connectors[i].to === selectedShape) {
        connectors.splice(i, 1);
      } else {
        if (connectors[i].from > selectedShape) connectors[i].from -= 1;
        if (connectors[i].to > selectedShape) connectors[i].to -= 1;
      }
    }
    selectedShape = -1;
    connectFrom = -1;
    scheduleBuilderRender();
  }, { signal });

  clearAllBtn.addEventListener('click', () => {
    shapes.length = 0;
    connectors.length = 0;
    selectedShape = -1;
    connectFrom = -1;
    if (textEditor) {
      textEditor.remove();
      textEditor = null;
    }
    scheduleBuilderRender();
  }, { signal });

  saveBuildBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'diagram-build-' + (q.id || 'diagram') + '.png';
    link.href = buildCanvas.toDataURL('image/png');
    link.click();
  }, { signal });

  panel.appendChild(el('div', { class: 'diagram-panel-title' }, 'Shapes'));
  panel.appendChild(toolGroup);
  panel.appendChild(el('label', { class: 'field-label' }, 'Text preset'));
  panel.appendChild(textInput);
  panel.appendChild(el('label', { class: 'field-label' }, 'Fill color'));
  panel.appendChild(colorInput);
  panel.appendChild(deleteBtn);
  panel.appendChild(clearAllBtn);
  panel.appendChild(saveBuildBtn);
  panel.appendChild(el('p', { class: 'muted', style: 'margin-top:10px;' }, 'Connector tool: click source shape, then target shape.'));

  canvasWrap.appendChild(buildCanvas);
  buildLayout.appendChild(panel);
  buildLayout.appendChild(canvasWrap);
  buildPane.appendChild(buildLayout);

  function setMode(mode) {
    const drawOn = mode === 'draw';
    drawPane.classList.toggle('diagram-pane-active', drawOn);
    buildPane.classList.toggle('diagram-pane-active', !drawOn);
    drawTab.classList.toggle('primary', drawOn);
    buildTab.classList.toggle('primary', !drawOn);
  }

  drawTab.addEventListener('click', () => setMode('draw'), { signal });
  buildTab.addEventListener('click', () => setMode('build'), { signal });

  wrap.appendChild(tabs);
  wrap.appendChild(drawPane);
  wrap.appendChild(buildPane);

  scheduleBuilderRender();
  return {
    wrap,
    destroy: () => {
      clearTimeout(fitTimer);
      if (builderRaf) cancelAnimationFrame(builderRaf);
      if (textEditor) textEditor.remove();
      ac.abort();
    }
  };
}

// ---------- Self-mark UI (used for diagram questions) ----------
function buildSelfMarkUI(q) {
  const points = (q.mark_scheme && q.mark_scheme.points) || [];
  const box = el('div', { class: 'automark-box' });
  const head = el('div', { class: 'automark-head' });
  head.appendChild(el('span', { class: 'am-eyebrow' }, 'Self-mark your diagram'));
  const scoreSpan = el('span', { class: 'automark-score' });
  const scoreNum = el('span', { class: 'value' }, '0');
  scoreSpan.appendChild(scoreNum);
  scoreSpan.appendChild(el('span', { class: 'total' }, `/ ${q.marks}`));
  head.appendChild(scoreSpan);
  box.appendChild(head);

  box.appendChild(el('p', { class: 'automark-detail' },
    'Tick each criterion your diagram meets. Each tick is worth one mark.'));

  const list = el('div', { class: 'selfmark-list' });
  const checked = new Set();
  points.forEach((pt, i) => {
    const id = 'sm-' + q.id + '-' + i;
    const row = el('label', { class: 'selfmark-row', for: id });
    const cb = el('input', { type: 'checkbox', id });
    cb.addEventListener('change', () => {
      if (cb.checked) checked.add(i); else checked.delete(i);
      // Cap at q.marks
      const n = Math.min(checked.size, q.marks);
      scoreNum.textContent = String(n);
    });
    row.appendChild(cb);
    row.appendChild(el('span', { html: escapeHTML(pt).replace(/\(1\)/g, '<strong>(1)</strong>') }));
    list.appendChild(row);
  });
  box.appendChild(list);

  if (q.mark_scheme && q.mark_scheme.additional_guidance) {
    box.appendChild(el('p', { class: 'automark-detail', style: 'font-style:italic;' }, q.mark_scheme.additional_guidance));
  }
  if (q.mark_scheme && q.mark_scheme.do_not_accept) {
    box.appendChild(el('p', { class: 'automark-detail', style: 'color:var(--warn);' }, 'Do not accept: ' + q.mark_scheme.do_not_accept));
  }
  return box;
}

// ---------- Multiple choice (practice mode) ----------
function buildMcOptions(q, choiceRef) {
  const wrap = el('div', { class: 'mc-practice' });
  (q.options || []).forEach(o => {
    const id = 'mc-' + q.id + '-' + o.label;
    const row = el('label', { class: 'mc-practice-row', for: id });
    const radio = el('input', { type: 'radio', name: 'mc-' + q.id, id, value: o.label });
    radio.addEventListener('change', () => { choiceRef.value = o.label; });
    row.appendChild(radio);
    row.appendChild(el('span', { class: 'mc-practice-letter' }, o.label));
    row.appendChild(el('span', { class: 'mc-practice-text' }, o.text));
    wrap.appendChild(row);
  });
  return wrap;
}

function buildMcResultUI(q, picked) {
  const m = q.mark_scheme || {};
  const correct = m.answer;
  const isRight = picked === correct;
  const correctOpt = (q.options || []).find(o => o.label === correct);
  const box = el('div', { class: 'automark-box' });
  const head = el('div', { class: 'automark-head' });
  head.appendChild(el('span', { class: 'am-eyebrow' }, isRight ? 'Correct' : 'Incorrect'));
  const scoreSpan = el('span', { class: 'automark-score' + (isRight ? ' am-good' : ' am-bad') });
  scoreSpan.appendChild(el('span', { class: 'value' }, isRight ? '1' : '0'));
  scoreSpan.appendChild(el('span', { class: 'total' }, '/ 1'));
  head.appendChild(scoreSpan);
  box.appendChild(head);
  box.appendChild(el('p', { class: 'automark-detail' },
    el('strong', null, 'You picked: '), picked,
    el('br'),
    el('strong', null, 'Correct answer: '), correct + (correctOpt ? ' — ' + correctOpt.text : '')
  ));
  if (m.explanation) box.appendChild(el('p', { class: 'automark-detail', style: 'font-style:italic;' }, m.explanation));
    if (!isRight) {
      const jump = el('button', { class: 'btn ghost', type: 'button' }, 'Open Revision Guide topic');
      jump.addEventListener('click', () => openRevisionGuideForQuestion(q));
      box.appendChild(el('div', { style: 'margin-top:10px;' }, jump));
    }
  return box;
}

// ---------- Auto-marking ----------
const STOP_WORDS = new Set(['the','a','an','and','or','but','of','to','in','on','at','for','with','by','from','as','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','that','this','these','those','it','its','their','they','them','he','she','his','her','i','you','your','we','us','our','if','than','then','so','not','no','also','about','into','more','most','some','any','one','two','use','used','using','make','makes','made','allow','allows','allowed','provide','provides','provided','example','e.g.','i.e.','such','very','accept','reject','mark','marks','award','points','point','idea']);
const ANALYSIS_CUES = new Set(['because','therefore','however','whereas','thus','hence','results','resulting','impact','improves','improve','reduces','reduce','causes','means','leads']);
const SYNONYM_GROUPS = [
  ['increase','improve','improvement','rise','higher','boost','enhance'],
  ['decrease','reduce','reduction','lower','drop','decline'],
  ['secure','security','protect','protection','safe','safety'],
  ['data','information'],
  ['network','connectivity'],
  ['performance','outcome','result']
];
const SYNONYMS = SYNONYM_GROUPS.reduce((acc, group) => {
  group.forEach((term) => { acc[term] = group; });
  return acc;
}, {});

function tokenise(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\(\d+\)/g, ' ')
    .replace(/[\u2013\u2014]/g, ' ')
    .replace(/[^a-z0-9'\-\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function normaliseToken(token) {
  let t = String(token || '').toLowerCase();
  if (t.length > 5 && t.endsWith('ing')) t = t.slice(0, -3);
  else if (t.length > 4 && t.endsWith('ed')) t = t.slice(0, -2);
  else if (t.length > 4 && t.endsWith('es')) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith('s')) t = t.slice(0, -1);
  return t;
}

function contentTokens(text) {
  return tokenise(text)
    .map(normaliseToken)
    .filter(t => !STOP_WORDS.has(t) && t.length > 2);
}

function unique(arr) {
  return Array.from(new Set(arr));
}

function extractSchemeKeywords(point) {
  const p = String(point || '').replace(/\(\d+\)/g, '').trim();
  const clauses = p.split(/[;\u2013\u2014]|\s\/\s|\sor\s|,\s+(?=[A-Z])/i)
    .map(c => c.trim())
    .filter(Boolean);
  return clauses.length ? clauses : [p];
}

function editDistanceAtMostOne(a, b) {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    edits++;
    if (edits > 1) return false;
    if (la > lb) i++;
    else if (lb > la) j++;
    else {
      i++;
      j++;
    }
  }
  if (i < la || j < lb) edits++;
  return edits <= 1;
}

function buildAnswerLexicon(answer) {
  const base = contentTokens(answer);
  const lex = new Set(base);
  base.forEach((t) => {
    const syn = SYNONYMS[t];
    if (syn) syn.forEach(s => lex.add(normaliseToken(s)));
  });
  return { tokens: base, set: lex };
}

function tokenMatches(target, lexicon) {
  if (lexicon.set.has(target)) return true;
  const syn = SYNONYMS[target] || [];
  if (syn.some(s => lexicon.set.has(normaliseToken(s)))) return true;
  if (target.length < 5) return false;
  for (const candidate of lexicon.set) {
    if (candidate.length >= 5 && (candidate.startsWith(target.slice(0, 5)) || target.startsWith(candidate.slice(0, 5)))) return true;
    if (candidate.length >= 6 && editDistanceAtMostOne(candidate, target)) return true;
  }
  return false;
}

function matchClause(clause, lexicon) {
  const kw = unique(contentTokens(clause));
  if (!kw.length) return { hit: false, matched: [], need: 0, total: 0 };
  const matched = kw.filter(k => tokenMatches(k, lexicon));
  let need = 1;
  if (kw.length <= 2) need = 1;
  else if (kw.length <= 4) need = 2;
  else need = Math.max(2, Math.ceil(kw.length * 0.45));

  const hasStrongPair = kw.length >= 2 && kw.some((k, idx) => {
    if (idx === kw.length - 1) return false;
    const nxt = kw[idx + 1];
    return tokenMatches(k, lexicon) && tokenMatches(nxt, lexicon);
  });

  const hit = matched.length >= need || (hasStrongPair && matched.length >= Math.max(1, need - 1));
  return { hit, matched, need, total: kw.length };
}

// Numeric marking for calculation questions: full marks for the correct final answer,
// otherwise one mark per correct intermediate value in the working (method marks).
function extractNumbers(text) {
  let t = String(text || '').replace(/[−–]/g, '-');
  for (let i = 0; i < 3; i++) t = t.replace(/(\d)[ ,](\d{3})(?!\d)/g, '$1$2');
  return (t.match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
}
function numbersNear(a, b) {
  return Math.abs(Math.abs(a) - Math.abs(b)) <= Math.max(0.06, Math.abs(b) * 0.012);
}
function autoMarkCalc(q, answer) {
  const m = q.mark_scheme || {};
  const nums = extractNumbers(answer);
  const has = v => nums.some(n => numbersNear(n, v));
  const lines = [];
  let hits = 0;
  (m.points || []).forEach(step => {
    const after = String(step).split('=').slice(1).join('=');
    const stepNums = extractNumbers(after.replace(/\(\d+ marks?[^)]*\)/gi, ''));
    const target = stepNums.length ? stepNums[stepNums.length - 1] : null;
    const hit = target != null && has(target);
    if (hit) hits++;
    lines.push({ label: step, hit, details: target != null ? `looking for ${target}` : '' });
  });
  const finalVal = Number(m.final_answer);
  const finalHit = Number.isFinite(finalVal) && has(finalVal);
  let earned = finalHit ? q.marks : Math.min(q.marks - 1, hits);
  const unit = String(m.unit || '');
  if (finalHit && /^units|days|times|years/.test(unit) && /£\s*\d/.test(answer)) earned = q.marks - 1;
  lines.unshift({ label: `Final answer: ${m.answer || ''}`, hit: finalHit, details: finalHit ? 'correct final answer' : 'final answer not found' });
  return { type: 'calc', earned: Math.max(0, earned), max: q.marks, lines };
}

function autoMarkShort(q, answer) {
  const points = (q.mark_scheme && q.mark_scheme.points) || [];
  const lexicon = buildAnswerLexicon(answer);
  const lines = [];
  let earned = 0;
  points.forEach(pt => {
    const clauses = extractSchemeKeywords(pt);
    const clauseResults = clauses.map(c => matchClause(c, lexicon));
    const anyHit = clauseResults.some(r => r.hit);
    lines.push({
      label: pt,
      hit: anyHit,
      details: clauseResults.map(r => `${r.matched.length}/${r.total} tokens`).join(' · ')
    });
    if (anyHit) earned++;
  });
  earned = Math.min(earned, q.marks);
  return { type: 'short', earned, max: q.marks, lines };
}

function autoMarkExtended(q, answer) {
  const ic = (q.mark_scheme && q.mark_scheme.indicative_content) || [];
  const lexicon = buildAnswerLexicon(answer);
  const wordCount = tokenise(answer).length;
  const cueCount = Array.from(ANALYSIS_CUES).filter(c => lexicon.set.has(c)).length;
  const lines = [];
  let hits = 0;
  ic.forEach(pt => {
    const r = matchClause(pt, lexicon);
    lines.push({ label: pt, hit: r.hit, details: `${r.matched.length}/${r.total} tokens` });
    if (r.hit) hits++;
  });
  const coverage = ic.length ? (hits / ic.length) : 0;
  // Determine level from level descriptors: pick band based on coverage AND length signal.
  const lds = (q.mark_scheme && q.mark_scheme.level_descriptors) || [];
  // Sort by level number ascending (skip level 0)
  const bands = lds.filter(d => Number(d.level) > 0).sort((a,b)=>Number(a.level)-Number(b.level));
  let level = 0;
  let lengthFactor = 0;
  if (q.marks >= 12) lengthFactor = wordCount >= 220 ? 1 : wordCount >= 130 ? 0.7 : wordCount >= 60 ? 0.45 : 0.2;
  else if (q.marks >= 9) lengthFactor = wordCount >= 170 ? 1 : wordCount >= 100 ? 0.7 : wordCount >= 50 ? 0.45 : 0.2;
  else if (q.marks >= 8) lengthFactor = wordCount >= 150 ? 1 : wordCount >= 90  ? 0.7 : wordCount >= 45 ? 0.45 : 0.2;
  else                   lengthFactor = wordCount >= 110 ? 1 : wordCount >= 60  ? 0.7 : wordCount >= 30 ? 0.45 : 0.2;
  const structureFactor = Math.min(1, cueCount / 4);
  const score = coverage * 0.65 + lengthFactor * 0.25 + structureFactor * 0.10;
  if (bands.length === 3) {
    if (score >= 0.66) level = 3; else if (score >= 0.36) level = 2; else if (score > 0.05) level = 1; else level = 0;
  } else if (bands.length === 2) {
    level = score >= 0.55 ? 2 : score > 0.05 ? 1 : 0;
  } else if (bands.length === 1) {
    level = score > 0.1 ? 1 : 0;
  }
  // Pick a mark inside the chosen band.
  let earned = 0;
  let bandStr = '';
  if (level > 0) {
    const band = bands.find(b => Number(b.level) === level);
    if (band) {
      bandStr = String(band.marks || '');
      const m = bandStr.match(/(\d+)\s*[\-\u2013]\s*(\d+)/);
      if (m) {
        const lo = parseInt(m[1], 10), hi = parseInt(m[2], 10);
        // position within band by score percentile inside the level
        const inLevel = level === 3 ? (score - 0.66) / 0.34 : level === 2 ? (score - 0.36) / 0.30 : (score - 0.05) / 0.31;
        const t = Math.max(0, Math.min(1, inLevel));
        earned = Math.round(lo + (hi - lo) * t);
      } else {
        earned = parseInt(bandStr, 10) || 0;
      }
    }
  }
  return { type: 'extended', earned, max: q.marks, level, levelMarks: bandStr, lines, coverage, lengthFactor, structureFactor, wordCount };
}

function isUltraTierForAiMarking() {
  if (!window.RA10 || !RA10.isLoggedIn || !RA10.isLoggedIn()) return false;
  if (typeof RA10.canUseAiMarking === 'function') {
    try {
      return !!RA10.canUseAiMarking();
    } catch (e) {
      return false;
    }
  }
  const tier = String(RA10.getTier ? RA10.getTier() : '').toLowerCase();
  return tier === 'ultra' || tier === 'owner';
}

function normaliseAiMarkResult(raw, q, isExt, answer) {
  if (!raw || typeof raw !== 'object') return null;
  const max = Math.max(1, Number(q.marks) || 1);
  const numericMax = Number(raw.max);
  const resultMax = Number.isFinite(numericMax) ? Math.max(1, Math.min(max, Math.round(numericMax))) : max;
  const numericEarned = Number(raw.earned);
  const earned = Number.isFinite(numericEarned) ? Math.max(0, Math.min(resultMax, Math.round(numericEarned))) : 0;
  
  // Handle new simple format (strengths/improvements/feedback)
  let lines = [];
  if (Array.isArray(raw.strengths) || Array.isArray(raw.improvements)) {
    // New format: convert strengths and improvements to lines
    if (Array.isArray(raw.strengths)) {
      raw.strengths.forEach(s => {
        const label = String(s || '').trim();
        if (label) lines.push({ label, hit: true, details: 'Well done' });
      });
    }
    if (Array.isArray(raw.improvements)) {
      raw.improvements.forEach(i => {
        const label = String(i || '').trim();
        if (label) lines.push({ label, hit: false, details: 'Room for improvement' });
      });
    }
  } else if (Array.isArray(raw.lines)) {
    // Old format: use existing lines
    lines = raw.lines
      .map((line) => ({
        label: String(line && line.label ? line.label : '').trim(),
        hit: !!(line && line.hit),
        details: String(line && line.details ? line.details : '').trim(),
      }))
      .filter((line) => !!line.label)
      .slice(0, 20);
  }
  
  const words = String(answer || '').trim().split(/\s+/).filter(Boolean).length;
  const result = {
    type: isExt ? 'extended' : 'short',
    earned,
    max: resultMax,
    lines,
    coverage: Number.isFinite(Number(raw.coverage)) ? Math.max(0, Math.min(1, Number(raw.coverage))) : 0,
    wordCount: Number.isFinite(Number(raw.wordCount)) ? Math.max(0, Math.round(Number(raw.wordCount))) : words,
    level: Number.isFinite(Number(raw.level)) ? Math.max(0, Math.round(Number(raw.level))) : 0,
    levelMarks: String(raw.levelMarks || raw.level_marks || '').trim(),
    feedback: String(raw.feedback || '').trim(),
    examinerComment: String(raw.examiner_comment || '').trim(),
    nextLevel: Array.isArray(raw.next_level) ? raw.next_level.map(String).filter(Boolean) : [],
    aoFeedback: raw.ao_feedback && typeof raw.ao_feedback === 'object' ? raw.ao_feedback : null,
    annotations: Array.isArray(raw.annotations) ? raw.annotations.filter(a => a && a.tag).slice(0, 12) : [],
    calcCheck: String(raw.calculation_check || '').trim(),
  };
  return result;
}

function friendlyAiConnectError(message) {
  const msg = String(message || '').toLowerCase();
  if (
    !msg ||
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('network request failed') ||
    msg.includes('load failed') ||
    msg.includes('timeout') ||
    msg.includes('unavailable right now') ||
    msg.includes('request failed') ||
    msg.includes('gateway')
  ) {
    return 'Could not connect to AI. Try again or refresh the page.';
  }
  return String(message || 'Could not connect to AI. Try again or refresh the page.');
}

async function buildBestAutoMarkUI(q, answer) {
  const isExt = q.type === 'extended_levels' || (q.mark_scheme && q.mark_scheme.indicative_content);
  if (!isUltraTierForAiMarking() || !window.RA10 || typeof RA10.aiMarkAnswer !== 'function') {
    return { ui: buildAutoMarkUI(q, answer), source: 'local', aiError: '' };
  }

  try {
    const response = await RA10.aiMarkAnswer({ question: q, answer });
    const aiResult = normaliseAiMarkResult(response && response.result ? response.result : null, q, isExt, answer);
    if (!aiResult) {
      return { ui: buildAutoMarkUI(q, answer), source: 'local', aiError: 'invalid AI response' };
    }
    return { ui: buildAutoMarkUI(q, answer, aiResult, 'ai'), source: 'ai', aiError: '' };
  } catch (err) {
    const message = err && err.message ? String(err.message) : 'request failed';
    return { ui: buildAutoMarkUI(q, answer), source: 'local', aiError: friendlyAiConnectError(message) };
  }
}

function buildAutoMarkUI(q, answer, forcedResult, sourceLabel) {
  const isExt = q.type === 'extended_levels' || !!(q.mark_scheme && q.mark_scheme.indicative_content);
  const result = forcedResult || (q.type === 'calculation' ? autoMarkCalc(q, answer) : isExt ? autoMarkExtended(q, answer) : autoMarkShort(q, answer));
  const isAiFeedback = sourceLabel === 'ai';

  const box = el('div', { class: 'automark-box' + (isAiFeedback ? ' ai-examiner-box' : '') });
  const head = el('div', { class: 'automark-head' });
  head.appendChild(el('span', { class: 'am-eyebrow' }, isAiFeedback ? 'AI Examiner feedback' : 'Auto-mark estimate'));
  const scoreSpan = el('span', { class: 'automark-score' });
  const scoreNum = el('span', { class: 'value' }, String(result.earned));
  scoreSpan.appendChild(scoreNum);
  scoreSpan.appendChild(el('span', { class: 'total' }, `/ ${result.max}`));
  head.appendChild(scoreSpan);

  const adjust = el('div', { class: 'automark-adjust' });
  const minus = el('button', { class: 'btn' }, '−');
  const plus  = el('button', { class: 'btn' }, '+');
  minus.addEventListener('click', () => {
    const v = parseInt(scoreNum.textContent, 10);
    if (v > 0) scoreNum.textContent = String(v - 1);
  });
  plus.addEventListener('click', () => {
    const v = parseInt(scoreNum.textContent, 10);
    if (v < result.max) scoreNum.textContent = String(v + 1);
  });
  adjust.appendChild(minus); adjust.appendChild(plus);
  head.appendChild(adjust);

  if (result.level) {
    head.appendChild(el('span', { class: 'automark-level' }, `Level ${result.level}${result.levelMarks ? ' (' + result.levelMarks + ')' : ''}`));
  }
  box.appendChild(head);

  const safeCoverage = Number.isFinite(Number(result.coverage)) ? Math.round(Number(result.coverage) * 100) : 0;
  const safeWordCount = Number.isFinite(Number(result.wordCount)) ? Number(result.wordCount) : String(answer || '').trim().split(/\s+/).filter(Boolean).length;
  let blurb;
  if (isAiFeedback) blurb = result.feedback || 'Marked by the RA10 AI Examiner against the AQA level descriptors for this tariff.';
  else if (q.type === 'calculation') blurb = 'Checked numerically: full marks for the correct final answer in the right unit; otherwise method marks for each correct step (Own Figure Rule). Adjust with + / - if needed.';
  else if (isExt) blurb = `Rough estimate from content coverage and answer depth (${safeCoverage}% covered, ${safeWordCount} words). Level-marked answers are best checked with the AI Examiner. Adjust with + / - if needed.`;
  else blurb = 'Estimated by matching mark-scheme points. Adjust with + / - if needed.';
  box.appendChild(el('p', { class: 'automark-detail' }, blurb));

  if (isAiFeedback) {
    if (result.examinerComment) {
      box.appendChild(el('div', { class: 'ai-examiner-comment' }, el('strong', null, 'Examiner commentary: '), result.examinerComment));
    }
    if (result.calcCheck) {
      box.appendChild(el('p', { class: 'ai-calc-check' }, el('strong', null, 'Calculation check: '), result.calcCheck));
    }
    if (result.aoFeedback) {
      const ao = el('table', { class: 'ai-ao-table' });
      ao.appendChild(el('tr', null, el('th', null, 'Skill'), el('th', null, 'Judgement')));
      const names = { AO1: 'AO1 Knowledge', AO2: 'AO2 Application', AO3: 'AO3 Analysis', AO4: 'AO4 Evaluation' };
      Object.keys(names).forEach(k => {
        if (result.aoFeedback[k]) ao.appendChild(el('tr', null, el('td', null, names[k]), el('td', null, String(result.aoFeedback[k]))));
      });
      box.appendChild(ao);
    }
    if (result.annotations && result.annotations.length) {
      const ann = el('div', { class: 'ai-annotations' });
      ann.appendChild(el('strong', null, 'Examiner annotations: '));
      result.annotations.forEach(a => ann.appendChild(el('span', { class: 'ai-ann-tag ai-ann-' + String(a.tag).toLowerCase(), title: String(a.text || '') }, String(a.tag) + (a.text ? ': ' + String(a.text) : ''))));
      box.appendChild(ann);
    }
    const hits = (result.lines || []).filter((line) => !!line.hit).slice(0, 4);
    const misses = (result.lines || []).filter((line) => !line.hit).slice(0, 4);
    const summary = el('div', { class: 'ai-feedback-grid' });
    const goodCard = el('section', { class: 'ai-feedback-card good' });
    goodCard.appendChild(el('h4', null, 'What you did well'));
    const goodList = el('ul');
    (hits.length ? hits : [{ label: 'You attempted the question.' }]).forEach(line => goodList.appendChild(el('li', null, line.label)));
    goodCard.appendChild(goodList);
    const improveCard = el('section', { class: 'ai-feedback-card improve' });
    improveCard.appendChild(el('h4', null, result.nextLevel.length ? 'To reach the next level' : 'How to improve'));
    const improveList = el('ul');
    const nextItems = result.nextLevel.length ? result.nextLevel.map(t => ({ label: t })) : misses;
    (nextItems.length ? nextItems : [{ label: 'Develop each point further: explain WHY each link in your chain follows, using the context.' }]).forEach(line => improveList.appendChild(el('li', null, line.label)));
    improveCard.appendChild(improveList);
    summary.appendChild(goodCard);
    summary.appendChild(improveCard);
    box.appendChild(summary);
  } else {
    const detail = el('div', { class: 'automark-detail automark-hits' });
    detail.appendChild(el('strong', null, q.type === 'calculation' ? 'Working check:' : isExt ? 'Indicative-content coverage:' : 'Scheme-point check:'));
    const ul = el('ul');
    result.lines.forEach(l => ul.appendChild(el('li', { class: l.hit ? 'hit' : 'miss', title: l.details || '' }, l.label)));
    detail.appendChild(ul);
    box.appendChild(detail);
  }

  // Toggle full mark scheme ("I'll mark it myself")
  const showMsBtn = el('button', { class: 'btn ghost', style: 'margin-top:14px;' }, 'Show full mark scheme');
  const msHolder = el('div', { style: 'display:none; margin-top:12px;' });
  msHolder.appendChild(renderMarkScheme(q));
  showMsBtn.addEventListener('click', () => {
    const open = msHolder.style.display === 'block';
    msHolder.style.display = open ? 'none' : 'block';
    showMsBtn.textContent = open ? 'Show full mark scheme' : 'Hide full mark scheme';
  });
  box.appendChild(showMsBtn);
  box.appendChild(msHolder);

  return box;
}

// ---------- Spec page ----------
function renderSpec() {
  const jump = $('#spec-jump');
  jump.innerHTML = '';
  jump.appendChild(el('span', { class: 'sj-label' }, 'Jump to topic'));
  TOPIC_CODES.forEach(letter => {
    const data = SPEC[letter];
    const a = el('a', { href: '#spec-aim-' + letter },
      el('span', { class: 'sj-letter' }, topicLabel(letter)),
      data.title.replace(/^3\.\d+\s*/, '').split(' ').slice(0, 3).join(' ')
    );
    jump.appendChild(a);
  });

  const wrap = $('#spec-content');
  wrap.innerHTML = '';
  TOPIC_CODES.forEach(letter => {
    const data = SPEC[letter];
    const count = QUESTIONS.filter(q => String(q.learning_aim) === String(letter)).length;
    const sec = el('section', { class: 'spec-aim card', id: 'spec-aim-' + letter });

    const head = el('div', { class: 'spec-aim-head' });
    head.appendChild(el('div', { class: 'spec-aim-letter' }, topicLabel(letter)));
    head.appendChild(el('div', { class: 'spec-aim-title' },
      el('h3', null, data.title),
      el('p', { class: 'spec-aim-sub' }, data.short)
    ));
    head.appendChild(el('span', { class: 'spec-aim-count' },
      el('span', { class: 'num' }, String(count)),
      ' questions'
    ));
    sec.appendChild(head);

    // Group sub-topics under their parent (e.g. A1.1, A1.2 under A1)
    const tree = data.topics.map(t => ({ code: t.code, name: t.name, children: [] }));
    const groups = el('div', { class: 'spec-groups' });
    tree.forEach(node => {
      const group = el('div', { class: 'spec-group' });
      group.appendChild(el('div', { class: 'spec-group-head' },
        el('span', { class: 'sg-code' }, node.code),
        el('span', { class: 'sg-name' }, node.name)
      ));
      if (node.children.length) {
        const subs = el('div', { class: 'spec-subtopics' });
        node.children.forEach(c => {
          subs.appendChild(el('div', { class: 'spec-subtopic' },
            el('span', { class: 'code' }, c.code),
            el('span', null, c.name)
          ));
        });
        group.appendChild(subs);
      }
      groups.appendChild(group);
    });
    sec.appendChild(groups);
    wrap.appendChild(sec);
  });
}

// Group sub-topics (e.g. A1.1) under their parent (A1).
// If a parent code is missing for a code like 'X9.1', synthesise a parent header.
function buildTopicTree(topics) {
  const result = [];
  const byCode = new Map();
  topics.forEach(t => {
    if (/^\d+\.\d+$/.test(t.code)) {
      // top-level (e.g. 3.1, 8.2)
      const node = { code: t.code, name: t.name, children: [] };
      byCode.set(t.code, node);
      result.push(node);
    } else {
      // sub-topic (e.g. 3.1.2)
      const m = t.code.match(/^(\d+\.\d+)\./);
      const parentCode = m ? m[1] : null;
      let parent = parentCode ? byCode.get(parentCode) : null;
      if (!parent) {
        parent = { code: parentCode || t.code, name: '', children: [] };
        byCode.set(parent.code, parent);
        result.push(parent);
      }
      parent.children.push({ code: t.code, name: t.name });
    }
  });
  return result;
}

// ============================================================
// QUIZ
// ============================================================
let quizState = null; // { items, idx, answers: number[] (selected index per q, -1 unanswered), aimFilter }

function buildSourceEvidenceNode(item) {
  if (!item) return null;
  const quote = item.source_quote || item.sourceQuote || '';
  const file = item.source_file || item.sourceFile || '';
  if (!quote && !file) return null;
  const wrap = el('div', { class: 'source-proof-box' });
  wrap.appendChild(el('p', { class: 'source-proof-title' }, 'Source proof'));
  if (file) wrap.appendChild(el('p', { class: 'source-proof-file' }, file));
  if (quote) wrap.appendChild(el('blockquote', { class: 'source-proof-quote' }, `"${quote}"`));
  return wrap;
}

function renderQuizControls() {
  const aimSel = $('#quiz-aim');
  if (!aimSel.dataset.ready) {
    TOPIC_CODES.forEach(a => aimSel.appendChild(el('option', { value: a }, topicLabel(a))));
    aimSel.dataset.ready = '1';
  }
  const paperSel = $('#quiz-paper');
  if (paperSel && !paperSel.dataset.ready) {
    PAPER_OPTIONS.forEach((p) => paperSel.appendChild(el('option', { value: p }, p)));
    paperSel.dataset.ready = '1';
  }

  if (!renderQuizControls._bound) {
    $('#btn-quiz-start').addEventListener('click', startQuiz);
    renderQuizControls._bound = true;
  }

  if (typeof QUIZ !== 'undefined' && QUIZ.length) {
    $('#quiz-card').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">${QUIZ.length} quiz questions ready (AQA-style MCQs, key-term and formula checks). Pick filters and click <strong>Start quiz</strong>.</p>`;
  } else {
    $('#quiz-card').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">Quiz data is loading…</p>`;
  }
}

async function startQuiz() {
  if (!QUIZ || !QUIZ.length) { alert('Quiz data not available.'); return; }
  const aim = $('#quiz-aim').value;
  const paper = $('#quiz-paper') ? $('#quiz-paper').value : '';
  const lenVal = $('#quiz-length').value;
  let pool = QUIZ.slice();
  if (aim) pool = pool.filter(q => q.learning_aim === aim);
  if (paper) pool = pool.filter(q => questionHasPaper(q, paper));
  if (!pool.length) { alert('No quiz questions for this filter.'); return; }
  if (!await ra10Gate('quiz_question')) return;
  pool = shuffle(pool);
  const length = lenVal === 'all' ? pool.length : Math.min(parseInt(lenVal, 10), pool.length);
  quizState = {
    items: pool.slice(0, length),
    idx: 0,
    answers: new Array(length).fill(-1),
    revealed: new Array(length).fill(false),
    aimFilter: aim
  };
  $('#quiz-results').style.display = 'none';
  renderQuizCard();
}

function renderQuizCard() {
  const wrap = $('#quiz-card');
  wrap.innerHTML = '';
  if (!quizState) return;
  const q = quizState.items[quizState.idx];
  $('#quiz-progress').textContent = `Question ${quizState.idx + 1} of ${quizState.items.length}`;

  const card = el('div', { class: 'quiz-card' });
  card.appendChild(el('div', { class: 'quiz-meta' },
    el('span', { class: 'tag id' }, q.id),
    el('span', { class: 'tag' }, topicLabel(q.learning_aim)),
    getQuestionPapers(q).length ? el('span', { class: 'tag' }, getQuestionPapers(q).join(' · ') + (q.paper_section ? ' · ' + q.paper_section : '')) : null,
    q.topic ? el('span', { class: 'tag verb' }, q.topic) : null,
    el('span', { class: 'tag marks' }, q.type === 'true_false' ? 'True / False' : 'Multiple choice')
  ));
  card.appendChild(el('p', { class: 'quiz-q' }, q.question));
  const sourceNode = buildSourceEvidenceNode(q);
  if (sourceNode) card.appendChild(sourceNode);

  const opts = el('div', { class: 'quiz-options' });
  const letters = ['A','B','C','D','E'];
  q.choices.forEach((choice, i) => {
    const opt = el('div', { class: 'quiz-option', 'data-i': String(i) },
      el('span', { class: 'opt-letter' }, letters[i]),
      el('span', { class: 'opt-text' }, choice)
    );
    if (quizState.revealed[quizState.idx]) {
      opt.classList.add('locked');
      if (i === q.correct_index) opt.classList.add('correct');
      else if (i === quizState.answers[quizState.idx]) opt.classList.add('wrong');
    } else if (quizState.answers[quizState.idx] === i) {
      opt.classList.add('selected');
    }
    opt.addEventListener('click', () => {
      if (quizState.revealed[quizState.idx]) return;
      quizState.answers[quizState.idx] = i;
      renderQuizCard();
    });
    opts.appendChild(opt);
  });
  card.appendChild(opts);

  if (quizState.revealed[quizState.idx]) {
    const isRight = quizState.answers[quizState.idx] === q.correct_index;
    const exp = el('div', { class: 'quiz-explain' },
      el('strong', null, isRight ? 'Correct ✓  ' : 'Not quite. '),
      q.explanation || 'See the highlighted answer above.'
    );
    if (!isRight) {
      const jump = el('button', { class: 'btn ghost', type: 'button', style: 'margin-top:10px;' }, 'Open Revision Guide topic');
      jump.addEventListener('click', () => openRevisionGuideForQuestion(q));
      exp.appendChild(el('div', null, jump));
    }
    card.appendChild(exp);
  }

  const actions = el('div', { class: 'quiz-actions' });
  if (!quizState.revealed[quizState.idx]) {
    const checkBtn = el('button', { class: 'btn primary' }, 'Check answer');
    checkBtn.addEventListener('click', () => {
      if (quizState.answers[quizState.idx] === -1) { alert('Pick an answer first.'); return; }
      quizState.revealed[quizState.idx] = true;
      renderQuizCard();
    });
    actions.appendChild(checkBtn);
  } else if (quizState.idx < quizState.items.length - 1) {
    const nextBtn = el('button', { class: 'btn primary' }, 'Next →');
    nextBtn.addEventListener('click', () => { quizState.idx++; renderQuizCard(); });
    actions.appendChild(nextBtn);
  } else {
    const finishBtn = el('button', { class: 'btn primary' }, 'See results');
    finishBtn.addEventListener('click', showQuizResults);
    actions.appendChild(finishBtn);
  }
  if (quizState.idx > 0) {
    const prevBtn = el('button', { class: 'btn ghost' }, '← Previous');
    prevBtn.addEventListener('click', () => { quizState.idx--; renderQuizCard(); });
    actions.appendChild(prevBtn);
  }
  if (quizState.idx < quizState.items.length - 1 && quizState.revealed[quizState.idx]) {
    // already added Next above
  } else if (!quizState.revealed[quizState.idx] && quizState.idx < quizState.items.length - 1) {
    const skipBtn = el('button', { class: 'btn ghost' }, 'Skip →');
    skipBtn.addEventListener('click', () => { quizState.idx++; renderQuizCard(); });
    actions.appendChild(skipBtn);
  }
  card.appendChild(actions);
  wrap.appendChild(card);
}

function showQuizResults() {
  const wrap = $('#quiz-card');
  wrap.innerHTML = '';
  $('#quiz-progress').textContent = '';
  const results = $('#quiz-results');
  results.style.display = 'block';
  results.innerHTML = '';

  let correct = 0;
  let answered = 0;
  const aimStats = {};
  quizState.items.forEach((q, i) => {
    if (quizState.answers[i] === -1) return;
    answered++;
    const right = quizState.answers[i] === q.correct_index;
    if (right) correct++;
    aimStats[q.learning_aim] = aimStats[q.learning_aim] || { right: 0, total: 0 };
    aimStats[q.learning_aim].total++;
    if (right) aimStats[q.learning_aim].right++;
  });
  const total = answered;
  const pct = total ? Math.round(correct / total * 100) : 0;

  const aimBreakdown = {};
  Object.entries(aimStats).forEach(([aim, s]) => {
    aimBreakdown[aim] = { correct: s.right, total: s.total };
  });
  if (total > 0) {
    saveSession('quiz_alevel_bus', {
      aims: Object.keys(aimStats),
      total,
      correct,
      aimBreakdown
    });
    incrementCounter('ra10_questions_today', total);
    awardXP(20, '+20 XP — Quiz complete!');
    if (window._isDailyQuiz) {
      window._isDailyQuiz = false;
      if (completeDailyTask('dailyQuiz')) {
        awardXP(25, '+25 XP — Daily quiz done!');
      }
      if (document.getElementById('view-you')?.classList.contains('active')) renderYou();
    }
  } else if (window._isDailyQuiz) {
    window._isDailyQuiz = false;
  }

  const card = el('div', { class: 'quiz-results-card' });
  card.appendChild(el('p', { class: 'eyebrow', style: 'letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-2);font-weight:700;font-size:12px;' }, 'Quiz complete'));
  card.appendChild(el('div', { class: 'score-big' }, `${correct} / ${total || quizState.items.length}`));
  card.appendChild(el('div', { class: 'score-pct' }, `${pct}%`));
  const bar = el('div', { class: 'quiz-results-bar' }, el('span', { style: `width: ${pct}%;` }));
  card.appendChild(bar);

  const breakdown = el('div', { class: 'quiz-aim-breakdown' });
  TOPIC_CODES.forEach(a => {
    if (!aimStats[a]) return;
    const s = aimStats[a];
    const ap = Math.round(s.right / s.total * 100);
    breakdown.appendChild(el('div', { class: 'quiz-aim-row' },
      el('span', { class: 'label' }, topicLabel(a)),
      el('span', { class: 'ratio' }, `${s.right}/${s.total} · ${ap}%`)
    ));
  });
  card.appendChild(breakdown);

  const actions = el('div', { style: 'margin-top: 28px; display:flex;gap:10px;justify-content:center;flex-wrap:wrap;' });
  const retryBtn = el('button', { class: 'btn primary' }, 'Try another quiz');
  retryBtn.addEventListener('click', () => { results.style.display = 'none'; startQuiz(); });
  const reviewBtn = el('button', { class: 'btn' }, 'Review answers');
  reviewBtn.addEventListener('click', () => {
    quizState.idx = 0;
    quizState.revealed = quizState.revealed.map(() => true);
    results.style.display = 'none';
    renderQuizCard();
  });
  actions.appendChild(retryBtn);
  actions.appendChild(reviewBtn);
  card.appendChild(actions);

  results.appendChild(card);
}

async function renderProgress() {
  if (document.getElementById('view-progress')?.classList.contains('active') === false) return;
  const gate = document.getElementById('progress-gate');
  const content = document.getElementById('progress-content');

  if (!gate || !content) return;

  if (!window.RA10 || !RA10.isLoggedIn()) {
    gate.style.display = 'block';
    content.style.display = 'none';
    const btn = document.getElementById('btn-progress-signin');
    if (btn) {
      btn.onclick = () => {
        window.top?.postMessage({ type: 'RA10_OPEN_AUTH' }, '*');
      };
    }
    return;
  }

  gate.style.display = 'none';
  content.style.display = 'block';

  const session = RA10.getSession();
  const sb = RA10.getClient();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: sessions }, { data: profile }] = await Promise.all([
    sb
      .from('revision_sessions')
      .select('*')
      .eq('user_id', session.user.id)
      .in('session_type', SESSION_TYPES)
      .gte('created_at', since)
      .order('created_at', { ascending: false }),
    sb
      .from('profiles')
      .select('xp_this_week, xp_total')
      .eq('id', session.user.id)
      .single()
  ]);

  const rows = sessions || [];
  const xpWeek = Number(profile?.xp_this_week || 0);
  const xpTotal = Number(profile?.xp_total || 0);
  const xpMilestone = Math.max(50, Math.ceil((xpWeek + 1) / 50) * 50);
  const xpPct = Math.min(100, Math.round((xpWeek / xpMilestone) * 100));

  const statsEl = document.getElementById('progress-stats');
  const totalSessions = rows.length;
  const totalQ = rows.reduce((a, r) => a + (r.questions_total || 0), 0);
  const totalCorrect = rows.reduce((a, r) => a + (r.questions_correct || 0), 0);
  const accuracy = totalQ ? Math.round(totalCorrect / totalQ * 100) : 0;
  const streakDays = calcStreak(rows);

  statsEl.innerHTML = `
    <div class="prog-xp-hero">
      <div class="prog-xp-eyebrow">⚡ Weekly XP</div>
      <div class="prog-xp-number" id="prog-xp-number">${xpWeek}</div>
      <div class="prog-xp-sub">${xpMilestone - xpWeek} XP to next milestone (${xpMilestone})</div>
      <div class="prog-xp-bar"><span style="width:${xpPct}%"></span></div>
      <div class="prog-xp-foot">Total lifetime XP: <strong>${xpTotal}</strong></div>
    </div>
    <div class="prog-mini-grid">
      ${[
        ['Sessions', totalSessions],
        ['Questions answered', totalQ],
        ['Accuracy', accuracy + '%'],
        ['🔥 Streak', streakDays + ' days'],
      ].map(([label, val]) => `
        <div class="prog-mini-card">
          <div class="v">${val}</div>
          <div class="k">${label}</div>
        </div>
      `).join('')}
    </div>
  `;

  const weakEl = document.getElementById('weak-aims-section');
  const aimTotals = {};
  const aimCorrect = {};
  rows.forEach(r => {
    const bd = r.aim_breakdown || {};
    Object.entries(bd).forEach(([aim, s]) => {
      aimTotals[aim] = (aimTotals[aim] || 0) + (s.total || 0);
      aimCorrect[aim] = (aimCorrect[aim] || 0) + (s.correct || 0);
    });
  });

  const weakAims = Object.entries(aimTotals)
    .filter(([, t]) => t >= 3)
    .map(([aim, t]) => ({ aim, pct: Math.round((aimCorrect[aim] || 0) / t * 100) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  const aimBars = Object.keys(aimTotals).sort().map((aim) => {
    const total = aimTotals[aim] || 0;
    const pct = total ? Math.round((aimCorrect[aim] || 0) / total * 100) : 0;
    const cls = pct >= 70 ? 'good' : pct >= 40 ? 'mid' : 'bad';
    return `
      <div class="prog-aim-row">
        <div class="meta"><span>${topicLabel(aim)}</span><strong>${pct}%</strong></div>
        <div class="bar ${cls}"><span style="width:${pct}%"></span></div>
      </div>
    `;
  }).join('');

  if (weakAims.length) {
    weakEl.innerHTML = `
      <div class="prog-aim-accuracy">
        <h3>Topic accuracy overview</h3>
        ${aimBars || '<p class="muted">No topic data yet.</p>'}
      </div>
      <div class="prog-weak-wrap">
        <h3>Weak topics</h3>
        <p>These need work based on your latest sessions.</p>
        <div class="prog-weak-cards">
          ${weakAims.map(w => `
            <div class="prog-weak-card">
              <span class="aim">${topicLabel(w.aim)}</span>
              <span class="pct">${w.pct}%</span>
            </div>
          `).join('')}
        </div>
        <button class="btn primary" id="btn-weak-quiz">Challenge me</button>
      </div>
    `;

    document.getElementById('btn-weak-quiz')?.addEventListener('click', () => {
      const aimFilter = weakAims.map(w => w.aim);
      switchTab('quiz');
      const aimSel = document.getElementById('quiz-aim');
      if (aimSel && aimFilter.length === 1) aimSel.value = aimFilter[0];
      setTimeout(() => startWeakQuiz(aimFilter), 100);
    });
  } else {
    weakEl.innerHTML = `
      <div class="prog-aim-accuracy">
        <h3>Topic accuracy overview</h3>
        ${aimBars || '<p class="muted">Complete sessions to build your topic accuracy graph.</p>'}
      </div>
      <div class="prog-empty">
        Complete at least 3 questions in any topic to unlock weak-topic challenges.
      </div>
    `;
  }

  const listEl = document.getElementById('sessions-list');
  if (!rows.length) {
    listEl.innerHTML = '<p class="prog-empty">No sessions in the last 30 days. Start a quiz or practice session to track your progress.</p>';
    return;
  }

  const typeLabel = { quiz: '🧠 Quiz', practice: '✍️ Practice', mock: '📄 Mock Paper', flashcard: '🃏 Flashcards' };
  listEl.innerHTML = '<h3 class="prog-history-title">Recent sessions</h3>' +
    rows.map(r => {
      const pct = r.questions_total ? Math.round(r.questions_correct / r.questions_total * 100) : null;
      const date = new Date(r.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
      const cls = pct === null ? 'mid' : pct >= 70 ? 'good' : pct >= 40 ? 'mid' : 'bad';
      return `
        <div class="prog-session-card ${cls}">
          <div>
            <span class="t">
              ${typeLabel[r.session_type] || typeLabel[String(r.session_type).split('_')[0]] || r.session_type}
            </span>
            <span class="d">${date}</span>
            ${r.learning_aims?.length ? `<span class="a">Topics: ${r.learning_aims.map(topicLabel).join(', ')}</span>` : ''}
          </div>
          <div class="s">
            ${pct !== null ? pct + '% (' + r.questions_correct + '/' + r.questions_total + ')' : r.questions_total + ' questions'}
          </div>
        </div>
      `;
    }).join('');
}

function calcStreak(rows) {
  const extra = (rows || []).map(row => row && row.created_at).filter(Boolean);
  return window.RA10 && typeof RA10.getStreak === 'function' ? RA10.getStreak(extra) : 0;
}

function startWeakQuiz(aims) {
  if (!QUIZ || !QUIZ.length) return;
  let pool = QUIZ.filter(q => aims.includes(q.learning_aim || q.learningaim));
  if (!pool.length) pool = QUIZ.slice();
  pool = shuffle(pool);
  const length = Math.min(20, pool.length);
  quizState = {
    items: pool.slice(0, length),
    idx: 0,
    answers: new Array(length).fill(-1),
    revealed: new Array(length).fill(false),
    aimFilter: aims[0] || ''
  };
  document.getElementById('quiz-results').style.display = 'none';
  renderQuizCard();
}

function startWeakPractice(aims) {
  let pool = QUESTIONS.filter(q => aims.includes(q.learning_aim || q.learningaim));
  if (!pool.length) pool = QUESTIONS.slice();
  window._practiceSession = {
    aims: aims && aims.length ? aims : TOPIC_CODES,
    total: 0,
    correct: 0,
    aimBreakdown: {},
    attemptedIds: new Set(),
    scoreByQuestion: {}
  };
  practiceQueue = shuffle(pool);
  practiceIdx = 0;
  renderPracticeCard();
}

// ============================================================
// FLASHCARDS
// ============================================================
let flashState = null; // { deck, idx, knownIds: Set, learningIds: Set, aimFilter }
const FLASH_STORE_KEY = 'aqa-business-2023-flash-progress-v1';

// Persist flashcard progress in-memory (and via cookies as a best-effort fallback)
let __flashProgress = { known: [], learning: [] };
function loadFlashProgress() {
  try {
    const m = document.cookie.match(new RegExp('(?:^|; )' + FLASH_STORE_KEY + '=([^;]*)'));
    if (m && m[1]) {
      const parsed = JSON.parse(decodeURIComponent(m[1]));
      if (parsed && Array.isArray(parsed.known)) __flashProgress = parsed;
    }
  } catch (e) {}
  return __flashProgress;
}
function saveFlashProgress(p) {
  __flashProgress = p;
  try {
    const v = encodeURIComponent(JSON.stringify(p));
    document.cookie = FLASH_STORE_KEY + '=' + v + '; path=/; max-age=31536000; SameSite=Lax';
  } catch (e) {}
}

function renderFlashControls() {
  const aimSel = $('#flash-aim');
  if (!aimSel.dataset.ready) {
    TOPIC_CODES.forEach(a => aimSel.appendChild(el('option', { value: a }, topicLabel(a))));
    aimSel.dataset.ready = '1';
  }

  if (!renderFlashControls._bound) {
    $('#btn-flash-start').addEventListener('click', startFlash);
    $('#btn-flash-shuffle').addEventListener('click', () => {
      if (!flashState) return;
      flashState.deck = shuffle(flashState.deck);
      flashState.idx = 0;
      renderFlashCard();
    });
    $('#btn-flash-reset').addEventListener('click', () => {
      if (!confirm('Reset all flashcard progress (known / still-learning marks)?')) return;
      saveFlashProgress({ known: [], learning: [] });
      if (flashState) { flashState.knownIds = new Set(); flashState.learningIds = new Set(); renderFlashCard(); }
    });
    renderFlashControls._bound = true;
  }
  let endBtn = document.getElementById('btn-flash-end');
  if (!endBtn) {
    endBtn = el('button', { id: 'btn-flash-end', class: 'btn', type: 'button' }, 'End session');
    $('#btn-flash-start').insertAdjacentElement('afterend', endBtn);
    endBtn.addEventListener('click', endFlashSession);
  }

  if (typeof FLASHCARDS !== 'undefined' && FLASHCARDS.length) {
    $('#flash-stage').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">${FLASHCARDS.length} source-backed cards ready across all topics. Click <strong>Start session</strong> to begin.</p>`;
  } else {
    $('#flash-stage').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">Flashcards are loading…</p>`;
  }
}

function startFlash() {
  if (!FLASHCARDS || !FLASHCARDS.length) { alert('Flashcards not available.'); return; }
  const aim = $('#flash-aim').value;
  let deck = FLASHCARDS.slice();
  if (aim) deck = deck.filter(c => c.learning_aim === aim);
  if (!deck.length) { alert('No cards for this filter.'); return; }
  deck = shuffle(deck);
  const stored = loadFlashProgress();
  flashState = {
    deck,
    idx: 0,
    knownIds: new Set(stored.known),
    learningIds: new Set(stored.learning),
    aimFilter: aim
  };
  window._flashSession = {
    aims: aim ? [aim] : TOPIC_CODES,
    total: 0,
    correct: 0,
    aimBreakdown: {},
    attemptedIds: new Set(),
    knownIds: new Set()
  };
  markFlashReviewStarted();
  renderFlashCard();
}

function renderFlashCard() {
  const stage = $('#flash-stage');
  stage.innerHTML = '';
  if (!flashState || !flashState.deck.length) return;
  const c = flashState.deck[flashState.idx];
  $('#flash-progress').textContent = `Card ${flashState.idx + 1} of ${flashState.deck.length}`;

  // Counts strip
  const knownInDeck = flashState.deck.filter(x => flashState.knownIds.has(x.id)).length;
  const learningInDeck = flashState.deck.filter(x => flashState.learningIds.has(x.id)).length;
  const counts = el('div', { class: 'flash-counts' },
    el('span', null, 'Known ', el('strong', null, String(knownInDeck))),
    el('span', null, 'Still learning ', el('strong', null, String(learningInDeck))),
    el('span', null, 'Untouched ', el('strong', null, String(flashState.deck.length - knownInDeck - learningInDeck)))
  );
  stage.appendChild(counts);

  const bar = el('div', { class: 'flash-progress-bar' }, el('span', { style: `width: ${(flashState.idx + 1) / flashState.deck.length * 100}%;` }));
  stage.appendChild(bar);

  const card = el('div', { class: 'flash-card', tabindex: '0' });
  const inner = el('div', { class: 'flash-card-inner' });
  const front = el('div', { class: 'flash-face front' },
    el('div', { class: 'face-eyebrow' }, `${topicLabel(c.learning_aim)} · ${c.topic || ''}`),
    el('div', { class: 'face-content' }, c.front),
    el('div', { class: 'face-hint' }, 'Click to flip')
  );
  const back = el('div', { class: 'flash-face back' },
    el('div', { class: 'face-eyebrow' }, c.id),
    el('div', { class: 'face-content' }, c.back),
    (c.source_file || c.source_quote)
      ? el('div', { class: 'flash-source-proof' },
          c.source_file ? el('div', { class: 'flash-source-file' }, c.source_file) : null,
          c.source_quote ? el('blockquote', { class: 'flash-source-quote' }, `"${c.source_quote}"`) : null
        )
      : null,
    el('div', { class: 'face-hint' }, 'Click to flip back')
  );
  inner.appendChild(front); inner.appendChild(back);
  card.appendChild(inner);
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); card.classList.toggle('flipped'); } });
  stage.appendChild(card);

  const actions = el('div', { class: 'flash-actions' });
  const isKnown = flashState.knownIds.has(c.id);
  const isLearning = flashState.learningIds.has(c.id);
  const learnBtn = el('button', { class: 'btn ' + (isLearning ? 'primary' : '') }, isLearning ? 'Marked: still learning' : 'Still learning');
  const knownBtn = el('button', { class: 'btn ' + (isKnown ? 'primary' : '') }, isKnown ? 'Marked: known ✓' : 'I know this');
  const prevBtn = el('button', { class: 'btn ghost' }, '← Previous');
  const nextBtn = el('button', { class: 'btn ghost' }, 'Next →');
  prevBtn.disabled = flashState.idx === 0;
  nextBtn.disabled = flashState.idx === flashState.deck.length - 1;
  learnBtn.addEventListener('click', () => {
    if (isLearning) flashState.learningIds.delete(c.id);
    else { flashState.learningIds.add(c.id); flashState.knownIds.delete(c.id); }
    if (window._flashSession) {
      const fs = window._flashSession;
      if (!fs.attemptedIds.has(c.id)) {
        fs.attemptedIds.add(c.id);
        fs.total++;
      }
      const aim = c.learning_aim || c.learningaim;
      fs.aimBreakdown[aim] = fs.aimBreakdown[aim] || { correct: 0, total: 0 };
      fs.aimBreakdown[aim].total = Math.max(fs.aimBreakdown[aim].total, flashState.deck.filter(x => (x.learning_aim || x.learningaim) === aim && fs.attemptedIds.has(x.id)).length);
      if (fs.knownIds.has(c.id)) {
        fs.knownIds.delete(c.id);
        fs.correct = Math.max(0, fs.correct - 1);
        fs.aimBreakdown[aim].correct = Math.max(0, fs.aimBreakdown[aim].correct - 1);
      }
    }
    saveFlashProgress({ known: [...flashState.knownIds], learning: [...flashState.learningIds] });
    renderFlashCard();
  });
  knownBtn.addEventListener('click', () => {
    if (isKnown) flashState.knownIds.delete(c.id);
    else { flashState.knownIds.add(c.id); flashState.learningIds.delete(c.id); }
    if (window._flashSession) {
      const fs = window._flashSession;
      if (!fs.attemptedIds.has(c.id)) {
        fs.attemptedIds.add(c.id);
        fs.total++;
      }
      const aim = c.learning_aim || c.learningaim;
      fs.aimBreakdown[aim] = fs.aimBreakdown[aim] || { correct: 0, total: 0 };
      fs.aimBreakdown[aim].total = Math.max(fs.aimBreakdown[aim].total, flashState.deck.filter(x => (x.learning_aim || x.learningaim) === aim && fs.attemptedIds.has(x.id)).length);
      if (isKnown) {
        fs.knownIds.delete(c.id);
        fs.correct = Math.max(0, fs.correct - 1);
        fs.aimBreakdown[aim].correct = Math.max(0, fs.aimBreakdown[aim].correct - 1);
      } else {
        fs.knownIds.add(c.id);
        fs.correct++;
        fs.aimBreakdown[aim].correct++;
      }
    }
    saveFlashProgress({ known: [...flashState.knownIds], learning: [...flashState.learningIds] });
    advanceFlash();
  });
  prevBtn.addEventListener('click', () => { flashState.idx = Math.max(0, flashState.idx - 1); renderFlashCard(); });
  nextBtn.addEventListener('click', advanceFlash);
  actions.appendChild(prevBtn); actions.appendChild(learnBtn); actions.appendChild(knownBtn); actions.appendChild(nextBtn);
  stage.appendChild(actions);
}

async function endFlashSession() {
  const fs = window._flashSession;
  if (!fs || !fs.total) {
    alert('No flashcard activity to save yet.');
    return;
  }
  await saveSession('flashcard_alevel_bus', {
    aims: Object.keys(fs.aimBreakdown),
    total: fs.total,
    correct: fs.correct,
    aimBreakdown: fs.aimBreakdown,
    attemptedIds: fs.attemptedIds
  });
  awardXP(5, '+5 XP — Flashcards done!');
  window._flashSession = null;
}

function advanceFlash() {
  if (!flashState) return;
  if (flashState.idx < flashState.deck.length - 1) flashState.idx++;
  else flashState.idx = 0;
  renderFlashCard();
}

// ---------- Papers: AQA past papers 2020-2025 + RA10 practice papers (shared engine: ../shared/aqa-papers.js) ----------
let aqaPapersApi = null;
function renderPapersTab() {
  if (!window.AqaPapers) return;
  if (!aqaPapersApi) aqaPapersApi = AqaPapers.init({ $, el, renderMarkScheme, awardXP, getQuestions: () => [] });
  const host = $('#papers-host');
  if (host && !host.dataset.built) { host.dataset.built = '1'; aqaPapersApi.renderPapers(); }
}

})();
