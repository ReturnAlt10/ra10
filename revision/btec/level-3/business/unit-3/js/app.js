/* ============================================================
   BTEC Business Unit 3 — Personal and Business Finance
   Revision tool app  |  Vanilla JS IIFE
   ============================================================ */
(function () {
  'use strict';

  // ---------- Tiny DOM helpers ----------
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.from(document.querySelectorAll(sel)); }
  function el(tag, attrs, ...children) {
    const e = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'html') { e.innerHTML = v; }
        else if (k.startsWith('on') && typeof v === 'function') { e.addEventListener(k.slice(2), v); }
        else { e.setAttribute(k, v); }
      });
    }
    children.flat().forEach(c => {
      if (c == null || c === false) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }
  function escapeHTML(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function makeRng(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) { h = Math.imul(31, h) + seed.charCodeAt(i) | 0; }
    return function() {
      h = Math.imul(Math.imul(h ^ (h >>> 16), 0x45d9f3b), 0xc2b2ae35) ^ (h >>> 16);
      return ((h >>> 0) / 0xffffffff);
    };
  }
  function hashStr(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
    return (h >>> 0).toString(36);
  }
  function shuffle(arr, rng) {
    const a = arr.slice();
    const rand = rng || Math.random.bind(Math);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Config ----------
  const SB_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';
  const DAILY_TASKS_KEY = 'ra10-daily-tasks-v2';
  const STREAK_DATES_KEY = 'ra10_streak_dates';
  const FLASH_STORE_KEY  = 'btec-bus-u3-flash-progress-v1';
  const SESSION_TYPES = [
    'quiz_business_u3', 'practice_business_u3', 'mock_business_u3', 'flashcard_business_u3',
    'quiz', 'practice', 'mock', 'flashcard'
  ];

  // ---------- Spec (Business Unit 3) ----------
  const SPEC = {
    A: {
      title: 'Personal Finance',
      short: 'Managing money, life stages, financial products, budgeting',
      topics: [
        { code: 'A1', name: 'The importance of managing personal finance' },
        { code: 'A1.1', name: 'Life stages and financial needs: childhood, young adult, family, later life' },
        { code: 'A1.2', name: 'Factors affecting personal finance decisions: income, employment status, age, dependants, attitude to risk' },
        { code: 'A2', name: 'Financial products and services' },
        { code: 'A2.1', name: 'Current accounts, savings accounts, ISAs, premium bonds' },
        { code: 'A2.2', name: 'Mortgages, personal loans, credit cards, overdrafts, hire purchase, payday loans' },
        { code: 'A2.3', name: 'Insurance products: life, health, home, travel, car' },
        { code: 'A3', name: 'Personal budgeting' },
        { code: 'A3.1', name: 'Income and expenditure, needs vs wants, discretionary vs non-discretionary spending' },
        { code: 'A3.2', name: 'Creating and interpreting a personal budget, budget surplus and deficit' }
      ]
    },
    B: {
      title: 'Personal Finance Sector',
      short: 'Financial institutions, communication methods',
      topics: [
        { code: 'B1', name: 'Financial institutions' },
        { code: 'B1.1', name: 'Retail banks, building societies, credit unions, insurance companies, investment banks' },
        { code: 'B1.2', name: 'Functions, similarities and differences between institutions' },
        { code: 'B2', name: 'Communication methods used by financial services' },
        { code: 'B2.1', name: 'Branches, telephone, internet banking, mobile apps, postal' },
        { code: 'B2.2', name: 'Benefits and drawbacks of each communication method' }
      ]
    },
    C: {
      title: 'Government and Personal Finance',
      short: 'FCA, FOS, FSCS, regulation, consumer protection',
      topics: [
        { code: 'C1', name: 'Role of the government in personal finance' },
        { code: 'C1.1', name: 'Taxation: income tax, National Insurance, council tax, VAT' },
        { code: 'C1.2', name: 'State benefits and welfare: Universal Credit, Child Benefit, State Pension' },
        { code: 'C2', name: 'Consumer protection' },
        { code: 'C2.1', name: 'Financial Conduct Authority (FCA): purpose and powers' },
        { code: 'C2.2', name: 'Financial Ombudsman Service (FOS): purpose and process' },
        { code: 'C2.3', name: 'Financial Services Compensation Scheme (FSCS): purpose and limits' }
      ]
    },
    D: {
      title: 'Business Finance Sources',
      short: 'Internal and external sources of finance',
      topics: [
        { code: 'D1', name: 'Internal sources of finance' },
        { code: 'D1.1', name: 'Retained profit, sale of assets, working capital management' },
        { code: 'D2', name: 'External sources of finance' },
        { code: 'D2.1', name: 'Short-term: bank overdraft, trade credit, factoring' },
        { code: 'D2.2', name: 'Long-term: share issue, debentures/bonds, bank loans, venture capital, leasing, crowdfunding, grants' },
        { code: 'D3', name: 'Suitability of sources of finance' },
        { code: 'D3.1', name: 'Matching source to purpose, cost, ownership implications, risk' }
      ]
    },
    E: {
      title: 'Financial Planning',
      short: 'Break-even, cash flow forecasts, budgets',
      topics: [
        { code: 'E1', name: 'Break-even analysis' },
        { code: 'E1.1', name: 'Fixed and variable costs, contribution per unit, break-even output' },
        { code: 'E1.2', name: 'Calculating and interpreting break-even: total revenue, total cost, margin of safety' },
        { code: 'E2', name: 'Cash flow forecasting' },
        { code: 'E2.1', name: 'Cash inflows and outflows, net cash flow, opening and closing balances' },
        { code: 'E2.2', name: 'Purpose and limitations of cash flow forecasts' },
        { code: 'E3', name: 'Business budgets' },
        { code: 'E3.1', name: 'Income, expenditure and profit budgets; budget variance analysis (favourable/adverse)' }
      ]
    },
    F: {
      title: 'Financial Statements',
      short: 'Income statements, SFP, depreciation, ratio analysis',
      topics: [
        { code: 'F1', name: 'Income statements (Profit and Loss)' },
        { code: 'F1.1', name: 'Revenue, cost of sales, gross profit, operating expenses, net profit' },
        { code: 'F2', name: 'Statement of financial position (Balance Sheet)' },
        { code: 'F2.1', name: 'Non-current assets, current assets, current liabilities, non-current liabilities, equity' },
        { code: 'F2.2', name: 'Depreciation: straight-line and reducing balance methods' },
        { code: 'F3', name: 'Financial ratio analysis' },
        { code: 'F3.1', name: 'Profitability: gross profit margin, net profit margin, ROCE' },
        { code: 'F3.2', name: 'Liquidity: current ratio, acid test ratio' }
      ]
    }
  };

  const MARKS_OPTIONS = [1, 2, 3, 4, 6, 8, 9, 12];
  const COMMAND_VERBS = ['Identify','State','Give','Define','Describe','Explain','Analyse','Discuss','Evaluate','Calculate','Justify','Compare','Assess'];

  // ---------- Simple counters (localStorage) ----------
  function incrementCounter(key, delta) {
    const todayKey = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(localStorage.getItem(key) || 'null');
    if (stored && stored.date === todayKey) {
      stored.count = (stored.count || 0) + delta;
      localStorage.setItem(key, JSON.stringify(stored));
    } else {
      localStorage.setItem(key, JSON.stringify({ date: todayKey, count: delta }));
    }
  }
  function getCounter(key) {
    const todayKey = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(localStorage.getItem(key) || 'null');
    return stored && stored.date === todayKey ? (stored.count || 0) : 0;
  }
  function todayKey() { return new Date().toISOString().slice(0, 10); }

  // ---------- Streak (local) ----------
  function getStreakDates() {
    try { return JSON.parse(localStorage.getItem(STREAK_DATES_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveStreakDates(arr) {
    localStorage.setItem(STREAK_DATES_KEY, JSON.stringify(arr));
  }
  function markTodayVisitForStreak() {
    const dates = getStreakDates();
    const today = todayKey();
    if (!dates.includes(today)) { dates.push(today); saveStreakDates(dates); }
  }
  function calcLocalStreak() {
    const dates = new Set(getStreakDates());
    let streak = 0;
    const d = new Date();
    while (dates.has(d.toISOString().slice(0, 10))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }
  function dayOfYear() {
    const now = new Date();
    return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  }

  // ---------- Daily tasks ----------
  function getDailyTasksState() {
    const today = todayKey();
    try {
      const s = JSON.parse(localStorage.getItem(DAILY_TASKS_KEY) || '{}');
      if (s.date !== today) return { date: today, tasks: { dailyQuiz: false, practice5: false, practice10: false, practice15: false, flashReview: false, share: false, login: false }, practiceCount: 0 };
      return {
        date: today,
        tasks: {
          dailyQuiz: !!s?.tasks?.dailyQuiz,
          practice5: !!s?.tasks?.practice5,
          practice10: !!s?.tasks?.practice10,
          practice15: !!s?.tasks?.practice15,
          flashReview: !!s?.tasks?.flashReview,
          share: !!s?.tasks?.share,
          login: !!s?.tasks?.login
        },
        practiceCount: Number(s.practiceCount || 0)
      };
    } catch (e) {
      return { date: today, tasks: { dailyQuiz: false, practice5: false, practice10: false, practice15: false, flashReview: false, share: false, login: false }, practiceCount: 0 };
    }
  }
  function saveDailyTasksState(s) { localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(s)); }
  function completeDailyTask(taskName) {
    const s = getDailyTasksState();
    if (s.tasks[taskName]) return false;
    s.tasks[taskName] = true;
    saveDailyTasksState(s);
    return true;
  }
  function addPracticeProgress(n) {
    const s = getDailyTasksState();
    s.practiceCount = (Number(s.practiceCount) || 0) + n;
    if (s.practiceCount >= 5 && !s.tasks.practice5) {
      s.tasks.practice5 = true;
      awardXP(50, '+50 XP — 5 practice answers done!');
    }
    if (s.practiceCount >= 10 && !s.tasks.practice10) {
      s.tasks.practice10 = true;
      awardXP(30, '+30 XP — 10 practice answers done!');
    }
    if (s.practiceCount >= 15 && !s.tasks.practice15) {
      s.tasks.practice15 = true;
      awardXP(45, '+45 XP — 15 practice answers done!');
    }
    saveDailyTasksState(s);
  }
  function markFlashReviewStarted() {
    if (completeDailyTask('flashReview')) awardXP(15, '+15 XP — Flashcard session started!');
  }
  function ensureDailyLoginBonus() {
    markTodayVisitForStreak();
    if (completeDailyTask('login')) awardXP(5, '+5 XP — Daily login bonus!');
  }
  function greetingByTime() {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }

  // ---------- Weakest aim ----------
  async function getWeakestAim() {
    if (!window.RA10 || !RA10.isLoggedIn() || !window.supabase) return 'A';
    try {
      const sb = window.supabase.createClient(SB_URL, SB_KEY);
      const session = RA10.getSession();
      const { data: rows } = await sb.from('revision_sessions').select('aim_breakdown').eq('user_id', session.user.id).in('session_type', SESSION_TYPES).limit(20).order('created_at', { ascending: false });
      const aimTotals = {};
      const aimCorrect = {};
      (rows || []).forEach(r => {
        const bd = r.aim_breakdown || {};
        Object.entries(bd).forEach(([aim, s]) => {
          aimTotals[aim] = (aimTotals[aim] || 0) + (s.total || 0);
          aimCorrect[aim] = (aimCorrect[aim] || 0) + (s.correct || 0);
        });
      });
      const weakest = Object.entries(aimTotals)
        .filter(([, t]) => t >= 3)
        .map(([aim, t]) => ({ aim, pct: (aimCorrect[aim] || 0) / t }))
        .sort((a, b) => a.pct - b.pct)[0];
      return weakest ? weakest.aim : 'A';
    } catch (e) { return 'A'; }
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
    const text = 'Check out RA10 for BTEC Business revision: https://ra10.co.uk';
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
      'You are closer than you think — keep going.',
      'Mastery comes from retrieval, not rereading.',
      'Train under pressure now, perform calmly later.',
      'Accuracy first, then speed.',
      'Show up daily and the results will follow.',
      'Progress loves persistence.',
      'Discipline is your revision superpower.'
    ];
    const quote = quotes[dayOfYear() % 14];

    function taskStatus(done) {
      return done
        ? '<span style="color:#177245;font-weight:700;">✓ Completed</span>'
        : '<span class="muted">Available</span>';
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
        'background:#1a56db;color:#fff;padding:10px 18px;border-radius:999px;' +
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
      if (!payload.total && sessionType !== 'flashcard_business_u3') return;
      const sb = window.supabase
        ? window.supabase.createClient(SB_URL, SB_KEY)
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

  // ---------- Progress sidebar ----------
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
      let profile = null, sessions = null, leaders = null;
      const cache = window._sidebarCache;
      const fresh = cache && (Date.now() - cache.ts) < 60000;
      if (fresh) {
        profile = cache.profile; sessions = cache.sessions; leaders = cache.leaders;
      } else {
        const sb = window.supabase.createClient(SB_URL, SB_KEY);
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
        profile = result[0].data; sessions = result[1].data; leaders = result[2].data;
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
    const parentTab = ({ mock: 'questions', practice: 'questions', browse: 'questions', quiz: 'revise', flash: 'revise', guide: 'revise' })[name] || name;
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === parentTab));
    $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
    if (name === 'guide') renderRevisionGuide();
    if (name === 'progress') renderProgress();
    if (name === 'you') renderYou();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const GUIDE_STATE = { entries: null, bound: false };
  const GUIDE_FULL_UNLOCK_EXPIRY_KEY = 'ra10_guide_full_unlock_business_u3_expires_at';
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
          aimTitle: block.title || `Learning Aim ${aim}`,
          code,
          title,
          summary: `Understand ${title.toLowerCase()} and apply it in finance/business exam contexts for Aim ${aim}.`,
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
    if (aimLetter && aimLetter !== 'A' && !canViewFullRevisionGuide()) {
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
        <p style="margin-bottom:8px">Your 10-credit unlock is active for all aims.</p>
        <p style="margin-top:0;margin-bottom:12px;"><strong>Unlock ends in <span id="guide-unlock-remaining">--:--:--</span></strong></p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn" id="guide-upgrade-btn">View plans</button>
        </div>
      `
      : `
        <h4 style="margin-top:0">Aims B-F are locked</h4>
        <p style="margin-bottom:10px">You can preview Aim A for free. The other aims below have padlocks and need an unlock.</p>
        <ul style="margin-top:0;margin-bottom:12px;">
          <li>Click <strong>Unlock for 2 hours (10 credits)</strong> to open all aims temporarily</li>
          <li>You can refresh and keep access until the timer ends</li>
          <li>Business one-time subject plan gives full guide access for Business</li>
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
      const isAimA = section.id === 'guide-aim-A';
      setGuideSectionLocked(section, !fullAccess && !isAimA);
    });

    container.querySelectorAll('.guide-toc-aim-group').forEach((group) => {
      const link = group.querySelector('.guide-toc-aim-link');
      const isAimA = !!(link && (link.getAttribute('onclick') || '').includes('guide-aim-A'));
      setGuideTocLocked(group, !fullAccess && !isAimA);
    });
    
    updateGuidePrintButtons();

    const gateCard = document.getElementById('guide-access-gate-card');
    const timedUnlockOnly = hasGuideSessionUnlock() && !hasPlanGuideAccess();
    if (fullAccess && !timedUnlockOnly) {
      clearGuideUnlockCountdownTimer();
      if (gateCard) gateCard.remove();
    } else {
      const aimA = document.getElementById('guide-aim-A');
      renderGuideAccessGate(container, aimA);
    }
  }

  function renderRevisionGuide() {
    if (window.initComprehensiveGuide) {
      window.initComprehensiveGuide();
      applyGuideAccessRules();
      return;
    }
  }

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
    ensureDailyLoginBonus();
    setupGuideAuthListener();
  });

  // ---------- Dashboard ----------
  function renderDashboard() {
    const stats = {
      total: QUESTIONS.length,
      aims: new Set(QUESTIONS.map(q => q.learning_aim)).size,
      marks: QUESTIONS.reduce((s, q) => s + (Number(q.marks) || 0), 0),
      extended: QUESTIONS.filter(q => q.marks >= 6).length
    };
    const sBox = $('#dashboard-stats');
    sBox.innerHTML = '';
    [
      ['num', stats.total, 'Total questions'],
      ['num', stats.aims, 'Learning aims'],
      ['num', stats.marks.toLocaleString(), 'Total marks'],
      ['num', stats.extended, 'Extended-response (6m+)']
    ].forEach(([_, n, l]) => sBox.appendChild(el('div', {class:'stat'}, el('span', {class:'num'}, String(n)), el('span', {class:'lbl'}, l))));

    const aimGrid = $('#aim-grid');
    aimGrid.innerHTML = '';
    ['A','B','C','D','E','F'].forEach(letter => {
      const count = QUESTIONS.filter(q => q.learning_aim === letter).length;
      const data = SPEC[letter];
      const card = el('div', { class: 'aim-card', onclick: () => { $('#filter-aim').value = letter; switchTab('browse'); applyBrowseFilters(); } },
        el('div', { class: 'aim-letter' }, letter),
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
    const aimSel = $('#filter-aim');
    ['A','B','C','D','E','F'].forEach(a => {
      const opt = el('option', {value: a}, `Aim ${a}: ${SPEC[a].short.split(',')[0]}`);
      aimSel.appendChild(opt);
    });
    const marksSel = $('#filter-marks');
    MARKS_OPTIONS.forEach(m => marksSel.appendChild(el('option', { value: String(m) }, `${m} mark${m===1?'':'s'}`)));
    const verbSel = $('#filter-verb');
    COMMAND_VERBS.forEach(v => verbSel.appendChild(el('option', { value: v }, v)));

    $('#search').addEventListener('input', applyBrowseFilters);
    aimSel.addEventListener('change', applyBrowseFilters);
    marksSel.addEventListener('change', applyBrowseFilters);
    verbSel.addEventListener('change', applyBrowseFilters);
    $('#btn-clear').addEventListener('click', () => {
      $('#search').value = ''; aimSel.value = ''; marksSel.value = ''; verbSel.value = '';
      applyBrowseFilters();
    });
    applyBrowseFilters();
  }

  function applyBrowseFilters() {
    const q = $('#search').value.trim().toLowerCase();
    const aim = $('#filter-aim').value;
    const marks = $('#filter-marks').value;
    const verb = $('#filter-verb').value;

    let list = QUESTIONS.slice();
    if (aim) list = list.filter(x => x.learning_aim === aim);
    if (marks) list = list.filter(x => String(x.marks) === marks);
    if (verb) list = list.filter(x => (x.command_verb || '').toLowerCase() === verb.toLowerCase());
    if (q) {
      list = list.filter(x => {
        const blob = (x.scenario || '') + ' ' + (x.question || '') + ' ' + (x.topic || '') + ' ' + (x.id || '');
        return blob.toLowerCase().includes(q);
      });
    }

    $('#result-count').textContent = `${list.length} question${list.length===1?'':'s'}`;

    const wrap = $('#question-list');
    wrap.innerHTML = '';
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
      el('span', { class: 'tag' }, `Aim ${q.learning_aim}`),
      el('span', { class: 'tag verb' }, q.command_verb || ''),
      el('span', { class: 'tag marks' }, `${q.marks} mark${q.marks===1?'':'s'}`)
    ));
    if (q.topic) head.appendChild(el('span', { class: 'muted' }, q.topic));
    row.appendChild(head);

    const body = el('div', { class: 'qrow-body' });
    if (q.scenario) body.appendChild(el('p', { class: 'scenario' }, q.scenario));
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

  function renderMarkScheme(q) {
    const m = q.mark_scheme || {};
    const wrap = el('div', { class: 'markscheme' });
    wrap.appendChild(el('h5', null, 'Mark Scheme'));
    if (m.instruction) wrap.appendChild(el('p', { class: 'instruction' }, m.instruction));

    if (q.type === 'multiple_choice' && m.answer) {
      const correct = (q.options || []).find(o => o.label === m.answer);
      wrap.appendChild(el('p', { class: 'mc-answer' },
        el('strong', null, 'Correct answer: '),
        el('span', { class: 'mc-correct' }, m.answer + (correct ? ' — ' + correct.text : '')),
        ' (1)'
      ));
      if (m.explanation) wrap.appendChild(el('p', { class: 'instruction' }, m.explanation));
      if (m.additional_guidance) wrap.appendChild(el('p', { class: 'additional' }, m.additional_guidance));
      if (m.do_not_accept) wrap.appendChild(el('p', { class: 'donotaccept' }, 'Do not accept: ' + m.do_not_accept));
      return wrap;
    }

    if (q.type === 'extended_levels' || m.indicative_content) {
      if (m.indicative_content && m.indicative_content.length) {
        wrap.appendChild(el('p', { class: 'instruction' }, el('strong', null, 'Indicative content:')));
        const ul = el('ul');
        m.indicative_content.forEach(p => ul.appendChild(el('li', null, p)));
        wrap.appendChild(ul);
      }
      if (m.level_descriptors && m.level_descriptors.length) {
        const tbl = el('table', { class: 'levels' });
        const trh = el('tr', null, el('th', null, 'Level'), el('th', null, 'Marks'), el('th', null, 'Descriptor'));
        tbl.appendChild(trh);
        m.level_descriptors.forEach(d => tbl.appendChild(el('tr', null, el('td', null, 'Level ' + d.level), el('td', null, String(d.marks)), el('td', null, d.descriptor))));
        wrap.appendChild(tbl);
      }
    } else {
      if (m.points && m.points.length) {
        const ul = el('ul');
        m.points.forEach(p => ul.appendChild(el('li', { html: escapeHTML(p).replace(/\(1\)/g, '<strong>(1)</strong>') })));
        wrap.appendChild(ul);
      }
    }
    if (m.additional_guidance) wrap.appendChild(el('p', { class: 'additional' }, m.additional_guidance));
    if (m.do_not_accept) wrap.appendChild(el('p', { class: 'donotaccept' }, 'Do not accept: ' + m.do_not_accept));
    return wrap;
  }

  // ---------- Mock paper builder ----------
  let lastMock = null;
  let mockShowMs = false;

  function renderMockControls() {
    const aimsRow = $('#mock-aims');
    aimsRow.innerHTML = '';
    const selected = new Set(['A','B','C','D','E','F']);
    ['A','B','C','D','E','F'].forEach(a => {
      const chip = el('div', { class: 'chip on' }, a);
      chip.addEventListener('click', () => {
        if (selected.has(a) && selected.size > 1) { selected.delete(a); chip.classList.remove('on'); }
        else { selected.add(a); chip.classList.add('on'); }
      });
      chip.dataset.aim = a;
      aimsRow.appendChild(chip);
    });

    const stylesRow = $('#mock-styles');
    if (stylesRow) {
      stylesRow.innerHTML = '';
      const styleDefs = [
        { key: 'pearson', label: 'Pearson-style (mixed)',  hint: 'A balanced paper mirroring real Pearson distribution' },
        { key: 'short',   label: 'Short questions',        hint: '1–4 mark items (Identify, State, Give, Describe)' },
        { key: 'long',    label: 'Long questions',         hint: '6–12 mark extended-response items (Explain, Discuss, Evaluate)' }
      ];
      const selStyles = new Set(['pearson']);
      styleDefs.forEach(def => {
        const chip = el('div', { class: 'chip' + (selStyles.has(def.key) ? ' on' : ''), title: def.hint }, def.label);
        chip.dataset.style = def.key;
        chip.addEventListener('click', () => {
          if (selStyles.has(def.key) && selStyles.size > 1) { selStyles.delete(def.key); chip.classList.remove('on'); }
          else if (!selStyles.has(def.key)) { selStyles.add(def.key); chip.classList.add('on'); }
        });
        stylesRow.appendChild(chip);
      });
    }

    $('#btn-generate').addEventListener('click', () => {
      const total = parseInt($('#mock-total').value, 10);
      const seed = $('#mock-seed').value || String(Date.now());
      const sel = $$('#mock-aims .chip.on').map(c => c.dataset.aim);
      const styles = $$('#mock-styles .chip.on').map(c => c.dataset.style);
      generateMock(total, seed, sel, styles.length ? styles : ['pearson']);
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
    $('#mock-paper').innerHTML = '<p>Click <strong>Generate mock paper</strong> to build a randomised paper.</p>';
  }

  function styleOfQuestion(q) {
    if (q.type === 'extended_levels' || q.marks >= 6) return 'long';
    return 'short';
  }

  function isDiagramQuestion(q) {
    return q.type === 'diagram' || q.type === 'draw' || q.command_verb === 'Draw';
  }

  async function generateMock(total, seed, aims, styles) {
    if (!await ra10Gate('mock_paper_gen')) return;
    const rng = makeRng(seed);
    styles = styles && styles.length ? styles : ['pearson'];
    const pool = QUESTIONS.filter(q => aims.includes(q.learning_aim) && !isDiagramQuestion(q));
    if (!pool.length) { alert('No questions available for selected aims.'); return; }

    if (!(styles.length === 1 && styles[0] === 'pearson')) {
      const wanted = new Set(styles.filter(s => s !== 'pearson'));
      const allowAny = styles.includes('pearson');
      const stylePool = {};
      pool.forEach(q => {
        const s = styleOfQuestion(q);
        if (wanted.has(s) || allowAny) (stylePool[s] = stylePool[s] || []).push(q);
      });
      Object.keys(stylePool).forEach(k => stylePool[k] = shuffle(stylePool[k], rng));

      if (!Object.keys(stylePool).length) { alert('No questions match the selected styles.'); return; }

      const items = [];
      const used = new Set();
      let acc = 0;
      const order = (wanted.size ? Array.from(wanted) : Object.keys(stylePool)).slice();
      let safety = 200;
      while (acc < total && safety-- > 0) {
        let placedThisRound = false;
        for (const s of order) {
          if (acc >= total) break;
          const remaining = total - acc;
          const bucket = (stylePool[s] || []).filter(q => !used.has(q.id) && q.marks <= remaining);
          if (!bucket.length) continue;
          bucket.sort((a, b) => b.marks - a.marks);
          const top = bucket.slice(0, Math.max(1, Math.ceil(bucket.length / 2)));
          const pick = top[Math.floor(rng() * top.length)];
          items.push(pick); used.add(pick.id); acc += pick.marks;
          placedThisRound = true;
        }
        if (!placedThisRound) break;
      }
      if (acc < total) {
        const fillers = pool.filter(q => !used.has(q.id) && q.marks <= (total - acc) && (allowAny || wanted.has(styleOfQuestion(q))))
                            .sort((a, b) => b.marks - a.marks);
        for (const q of fillers) {
          if (acc >= total) break;
          if (q.marks <= total - acc) { items.push(q); used.add(q.id); acc += q.marks; }
        }
      }
      items.sort((a, b) => a.marks - b.marks);
      lastMock = { items, total, seed, generatedAt: new Date().toISOString() };
      renderMock(lastMock);
      return;
    }

    // Pearson-style
    let templates;
    if (total >= 90) {
      templates = [
        [1,1,2,2,3,4,4,6,8,9,12,12,12,8,6],
        [1,2,2,3,4,4,6,6,8,9,12,12,8,4,9],
        [1,1,2,3,4,4,4,6,6,8,9,12,12,8,12]
      ];
    } else if (total >= 45) {
      templates = [
        [1,2,3,4,4,6,8,9,12],
        [1,2,2,4,4,6,8,9,12],
        [1,1,2,3,4,6,8,9,12]
      ];
    } else {
      templates = [
        [1,2,3,4,6,8,9],
        [1,2,4,4,6,8,9],
        [2,3,4,6,9,8],
        [1,2,4,6,8,12]
      ];
    }
    const tpl = templates[Math.floor(rng() * templates.length)].slice();
    while (tpl.reduce((a,b)=>a+b,0) > total) {
      let idx = -1, max = -1;
      for (let i = 0; i < tpl.length; i++) {
        if (tpl[i] > max && tpl[i] <= 4) { max = tpl[i]; idx = i; }
      }
      if (idx === -1) tpl.pop(); else tpl.splice(idx, 1);
    }

    const byMark = {};
    pool.forEach(q => { (byMark[q.marks] = byMark[q.marks] || []).push(q); });
    Object.keys(byMark).forEach(k => byMark[k] = shuffle(byMark[k], rng));
    const cursors = {};
    const items = [];
    const used = new Set();
    for (const m of tpl) {
      const bucket = byMark[m] || [];
      let picked = null;
      cursors[m] = cursors[m] || 0;
      for (let tries = 0; tries < bucket.length; tries++) {
        const q = bucket[(cursors[m] + tries) % bucket.length];
        if (!used.has(q.id)) { picked = q; cursors[m] += tries + 1; used.add(q.id); break; }
      }
      if (!picked) {
        const candidates = pool.filter(q => !used.has(q.id)).sort((a,b)=>Math.abs(a.marks-m)-Math.abs(b.marks-m));
        picked = candidates[0];
        if (picked) used.add(picked.id);
      }
      if (picked) items.push(picked);
    }

    lastMock = { items, total, seed, generatedAt: new Date().toISOString() };
    renderMock(lastMock);
  }

  function renderMock(mock) {
    const wrap = $('#mock-paper');
    wrap.className = 'paper' + (mockShowMs ? ' mock-with-ms' : '');
    wrap.innerHTML = '';
    const totalMarks = mock.items.reduce((s, q) => s + q.marks, 0);

    const headerOpts = {
      name: $('#opt-header-name') ? $('#opt-header-name').checked : false,
      cls:  $('#opt-header-class') ? $('#opt-header-class').checked : false,
      date: $('#opt-header-date') ? $('#opt-header-date').checked : false,
      centre: $('#opt-header-centre') ? $('#opt-header-centre').checked : false,
      teacher: $('#opt-header-teacher') ? $('#opt-header-teacher').checked : false,
      custom: $('#opt-header-custom') ? $('#opt-header-custom').value.trim() : ''
    };
    const lineDensity = $('#opt-line-density') ? $('#opt-line-density').value : 'normal';

    wrap.appendChild(el('div', { class: 'paper-header' },
      el('h3', null, 'BTEC Level 3 Business — Unit 3: Personal and Business Finance'),
      el('p', null, `Mock paper · ${totalMarks} marks · Time allowed: ${Math.round(totalMarks * 4 / 3)} minutes · Seed: ${mock.seed}`),
      el('p', { class: 'paper-instructions' }, 'Answer ALL questions. Write your answers in the space provided. The marks for each question are shown in brackets.')
    ));

    const candidateRows = [];
    if (headerOpts.name)    candidateRows.push(['Name', 'name']);
    if (headerOpts.cls)     candidateRows.push(['Class', 'cls']);
    if (headerOpts.date)    candidateRows.push(['Date', 'date']);
    if (headerOpts.centre)  candidateRows.push(['Centre / Candidate №', 'centre']);
    if (headerOpts.teacher) candidateRows.push(['Teacher', 'teacher']);
    if (candidateRows.length || headerOpts.custom) {
      const ch = el('div', { class: 'candidate-header' });
      candidateRows.forEach(([label]) => {
        ch.appendChild(el('div', { class: 'ch-line' },
          el('span', { class: 'ch-label' }, label + ':'),
          el('span', { class: 'ch-fill' })
        ));
      });
      if (headerOpts.custom) ch.appendChild(el('div', { class: 'ch-custom' }, headerOpts.custom));
      wrap.appendChild(ch);
    }

    mock.items.forEach((q, i) => {
      const sx = el('div', { class: 'paper-section' });
      sx.appendChild(el('div', { class: 'section-tag' },
        `Question ${i + 1}`,
        el('span', { class: 'aim-pill' }, `Aim ${q.learning_aim}`)
      ));
      if (q.scenario) sx.appendChild(el('div', { class: 'scenario' }, q.scenario));
      const subQ = el('div', { class: 'paper-question' });
      subQ.appendChild(el('span', { class: 'qtext' },
        q.question,
        el('span', { class: 'marks-bracket' }, ` (${q.marks})`)
      ));
      sx.appendChild(subQ);

      const linesByMark = { 1: 2, 2: 4, 3: 6, 4: 8, 6: 14, 8: 18, 9: 22, 12: 28 };
      const baseLines = linesByMark[q.marks] || Math.max(2, q.marks * 2);
      const densityMult = { extra: 1.4, normal: 1, compact: 0.6, none: 0 }[lineDensity] || 1;
      const numLines = Math.round(baseLines * densityMult);
      if (numLines > 0) {
        const linesBox = el('div', { class: 'answer-lines', 'aria-hidden': 'true' });
        for (let l = 0; l < numLines; l++) linesBox.appendChild(el('div', { class: 'answer-line' }));
        sx.appendChild(linesBox);
      }

      if (mockShowMs) {
        const msb = el('div', { class: 'ms-block' });
        msb.appendChild(renderMarkScheme(q));
        sx.appendChild(msb);
      }
      sx.appendChild(el('div', { class: 'paper-totals' }, `(Total for Question ${i + 1} = ${q.marks} mark${q.marks===1?'':'s'})`));
      wrap.appendChild(sx);
    });
    wrap.appendChild(el('div', { class: 'paper-totals', style: 'text-align:right;font-size:16px;margin-top:24px;border-top:2px solid #14201E;padding-top:12px;' }, `TOTAL FOR PAPER = ${totalMarks} MARKS`));
  }

  // ---------- Practice mode ----------
  let practiceQueue = [];
  let practiceIdx = 0;
  let activePracticeCleanup = null;

  function renderPracticeControls() {
    const aimSel = $('#practice-aim');
    if (!aimSel.dataset.ready) {
      ['A','B','C','D','E','F'].forEach(a => aimSel.appendChild(el('option', { value: a }, `Aim ${a}`)));
      aimSel.dataset.ready = '1';
    }
    const marksSel = $('#practice-marks');
    if (!marksSel.dataset.ready) {
      MARKS_OPTIONS.forEach(m => marksSel.appendChild(el('option', { value: String(m) }, `${m} mark${m===1?'':'s'}`)));
      marksSel.dataset.ready = '1';
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
    if (!await ra10Gate('practice_question')) return;
    const aim = $('#practice-aim').value;
    const marks = $('#practice-marks').value;
    let pool = QUESTIONS.slice();
    if (aim) pool = pool.filter(q => q.learning_aim === aim);
    if (marks) pool = pool.filter(q => String(q.marks) === marks);
    if (!pool.length) { alert('No questions match those filters.'); return; }
    window._practiceSession = {
      aims: aim ? [aim] : ['A','B','C','D','E','F'],
      total: 0, correct: 0,
      aimBreakdown: {}, attemptedIds: new Set(), scoreByQuestion: {}
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
        ps.correct++; ps.aimBreakdown[aim].correct++;
      } else if (wasCorrect && !nowCorrect) {
        ps.correct = Math.max(0, ps.correct - 1);
        ps.aimBreakdown[aim].correct = Math.max(0, ps.aimBreakdown[aim].correct - 1);
      }
      ps.scoreByQuestion[qid] = nowCorrect;
    }
  }

  async function endPracticeSession() {
    const ps = window._practiceSession;
    if (!ps || !ps.total) { alert('No practice attempts to save yet.'); return; }
    const practiceQ = ps.total || 0;
    await saveSession('practice_business_u3', {
      aims: Object.keys(ps.aimBreakdown),
      total: ps.total, correct: ps.correct,
      aimBreakdown: ps.aimBreakdown, attemptedIds: ps.attemptedIds
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
      el('span', { class: 'tag' }, `Aim ${q.learning_aim}`),
      el('span', { class: 'tag verb' }, q.command_verb),
      el('span', { class: 'tag marks' }, `${q.marks} mark${q.marks===1?'':'s'}`)
    ));
    if (q.scenario) card.appendChild(el('div', { class: 'scenario' }, q.scenario));
    card.appendChild(el('p', { class: 'question' }, q.question, el('span', { class: 'marks-bracket' }, ` (${q.marks})`)));

    let ta = null;
    let mcChoice = { value: null };
    if (q.type === 'multiple_choice') {
      card.appendChild(buildMcOptions(q, mcChoice));
    } else {
      // Calculation questions get a workings box above the main answer textarea
      if (q.type === 'calculation') {
        card.appendChild(el('p', { style: 'margin-top:14px;margin-bottom:4px;font-weight:700;font-size:14px;' }, 'Show your working:'));
        card.appendChild(el('textarea', { class: 'workings-box', placeholder: 'Show your working here…' }));
      }
      ta = el('textarea', { placeholder: 'Type your answer here…' });
      card.appendChild(ta);
    }

    const actions = el('div', { class: 'practice-actions' });
    const btnLabel = q.type === 'multiple_choice' ? 'Check my answer' : 'Auto-mark my answer';
    const btnAutoMark = el('button', { class: 'btn primary' }, btnLabel);
    const btnExamine = el('button', { class: 'btn btn-examine', style: 'background:linear-gradient(120deg,#2563eb 0%,#7c3aed 24%,#ec4899 52%,#f97316 76%,#22c55e 100%);background-size:300% 300%;color:#fff;border:none;animation:examine-glow 3.6s ease-in-out infinite;box-shadow:0 0 18px rgba(59,130,246,0.28),0 0 32px rgba(236,72,153,0.26),inset 0 0 18px rgba(255,255,255,0.10);border-radius:6px;font-weight:600;' }, '✦ AI Examiner');
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
      if (q.type === 'multiple_choice') {
        alert('AI Examiner is for extended-answer questions only.');
        return;
      }
      const answer = ta.value.trim();
      if (!answer) { alert('Write an answer first, then I can examine it.'); return; }
      if (!window.RA10 || typeof RA10.examineAnswer !== 'function') {
        alert('AI Examiner is not available right now.');
        return;
      }

      // Show cost warning for free/pro users
      const tier = window.RA10 && typeof window.RA10.getTier === 'function' ? window.RA10.getTier() : '';
      const isFree = tier === '' || tier === 'free';
      const isPro = tier === 'all_subjects';
      if (isFree || isPro) {
        const cost = isFree ? 5 : 1;
        const proceed = confirm(`AI Examiner will cost ${cost} credit(s). Do you want to continue?`);
        if (!proceed) return;
      }

      btnExamine.disabled = true;
      const _origLabel = btnExamine.textContent;
      btnExamine.textContent = 'Examining…';
      try {
        const response = await RA10.examineAnswer({ question: q, answer });
        automarkHost.innerHTML = '';
        if (response && response.result) {
          const aiResult = normaliseAiMarkResult(response.result, q, true, answer);
          if (aiResult) {
            automarkHost.appendChild(buildAutoMarkUI(q, answer, aiResult, 'ai'));
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
          alert('Error: ' + message);
        }
      } finally {
        btnExamine.disabled = false;
        btnExamine.textContent = _origLabel;
      }
    });
    btnAutoMark.addEventListener('click', async () => {
      btnAutoMark.disabled = true;
      const _origLabel = btnAutoMark.textContent;
      btnAutoMark.textContent = 'Marking…';
      try {
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
      .map(c => c.trim()).filter(Boolean);
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

  function autoMarkShort(q, answer) {
    const points = (q.mark_scheme && q.mark_scheme.points) || [];
    const lexicon = buildAnswerLexicon(answer);
    const lines = [];
    let earned = 0;
    points.forEach(pt => {
      const clauses = extractSchemeKeywords(pt);
      const clauseResults = clauses.map(c => matchClause(c, lexicon));
      const anyHit = clauseResults.some(r => r.hit);
      lines.push({ label: pt, hit: anyHit, details: clauseResults.map(r => `${r.matched.length}/${r.total} tokens`).join(' · ') });
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
    const lds = (q.mark_scheme && q.mark_scheme.level_descriptors) || [];
    const bands = lds.filter(d => Number(d.level) > 0).sort((a,b)=>Number(a.level)-Number(b.level));
    let level = 0, lengthFactor = 0;
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
    let earned = 0, bandStr = '';
    if (level > 0) {
      const band = bands.find(b => Number(b.level) === level);
      if (band) {
        bandStr = String(band.marks || '');
        const m = bandStr.match(/(\d+)\s*[\-\u2013]\s*(\d+)/);
        if (m) {
          const lo = parseInt(m[1], 10), hi = parseInt(m[2], 10);
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
      levelMarks: String(raw.levelMarks || '').trim(),
    };
    return result;
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
      return { ui: buildAutoMarkUI(q, answer), source: 'local', aiError: message };
    }
  }

  function buildAutoMarkUI(q, answer, forcedResult, sourceLabel) {
    const isExt = q.type === 'extended_levels' || (q.mark_scheme && q.mark_scheme.indicative_content);
    const result = forcedResult || (isExt ? autoMarkExtended(q, answer) : autoMarkShort(q, answer));

    const box = el('div', { class: 'automark-box' });
    const head = el('div', { class: 'automark-head' });
    head.appendChild(el('span', { class: 'am-eyebrow' }, 'Auto-mark estimate'));
    const scoreSpan = el('span', { class: 'automark-score' });
    const scoreNum = el('span', { class: 'value' }, String(result.earned));
    scoreSpan.appendChild(scoreNum);
    scoreSpan.appendChild(el('span', { class: 'total' }, `/ ${result.max}`));
    head.appendChild(scoreSpan);

    const adjust = el('div', { class: 'automark-adjust' });
    const minus = el('button', { class: 'btn' }, '−');
    const plus  = el('button', { class: 'btn' }, '+');
    minus.addEventListener('click', () => { const v = parseInt(scoreNum.textContent, 10); if (v > 0) scoreNum.textContent = String(v - 1); });
    plus.addEventListener('click',  () => { const v = parseInt(scoreNum.textContent, 10); if (v < result.max) scoreNum.textContent = String(v + 1); });
    adjust.appendChild(minus); adjust.appendChild(plus);
    head.appendChild(adjust);

    if (isExt && result.level) {
      head.appendChild(el('span', { class: 'automark-level' }, `Level ${result.level} (${result.levelMarks || ''})`));
    }
    box.appendChild(head);

    const safeCoverage = Number.isFinite(Number(result.coverage)) ? Math.round(Number(result.coverage) * 100) : 0;
    const safeWordCount = Number.isFinite(Number(result.wordCount)) ? Number(result.wordCount) : String(answer || '').trim().split(/\s+/).filter(Boolean).length;
    const blurb = sourceLabel === 'ai'
      ? (isExt
        ? `AI-assisted estimate from your mark scheme and indicative-content coverage (${safeCoverage}% covered, ${safeWordCount} words). Adjust with + / − if needed.`
        : `AI-assisted estimate from your mark scheme points and answer accuracy. Adjust with + / − if needed.`)
      : (isExt
        ? `Estimated from content coverage, answer depth and analysis cues (${safeCoverage}% covered, ${safeWordCount} words). Adjust with + / − if needed.`
        : `Estimated by matching scheme concepts using token, stem and near-match checks. Adjust with + / − if needed.`);
    box.appendChild(el('p', { class: 'automark-detail' }, blurb));

    const detail = el('div', { class: 'automark-detail automark-hits' });
    detail.appendChild(el('strong', null, isExt ? 'Indicative-content coverage:' : 'Scheme-point check:'));
    const ul = el('ul');
    result.lines.forEach(l => {
      ul.appendChild(el('li', { class: l.hit ? 'hit' : 'miss', title: l.details || '' }, l.label));
    });
    detail.appendChild(ul);
    box.appendChild(detail);

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

  // ============================================================
  // QUIZ
  // ============================================================
  let quizState = null;

  function renderQuizControls() {
    const aimSel = $('#quiz-aim');
    if (!aimSel.dataset.ready) {
      ['A','B','C','D','E','F'].forEach(a => aimSel.appendChild(el('option', { value: a }, `Aim ${a}`)));
      aimSel.dataset.ready = '1';
    }
    if (!renderQuizControls._bound) {
      $('#btn-quiz-start').addEventListener('click', startQuiz);
      renderQuizControls._bound = true;
    }
    if (typeof QUIZ !== 'undefined' && QUIZ.length) {
      $('#quiz-card').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">${QUIZ.length} quiz questions ready. Pick filters and click <strong>Start quiz</strong>.</p>`;
    } else {
      $('#quiz-card').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">Quiz data is loading…</p>`;
    }
  }

  async function startQuiz() {
    if (!await ra10Gate('quiz_question')) return;
    if (!QUIZ || !QUIZ.length) { alert('Quiz data not available.'); return; }
    const aim = $('#quiz-aim').value;
    const lenVal = $('#quiz-length').value;
    let pool = QUIZ.slice();
    if (aim) pool = pool.filter(q => q.learning_aim === aim);
    if (!pool.length) { alert('No quiz questions for this filter.'); return; }
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
      el('span', { class: 'tag' }, `Aim ${q.learning_aim}`),
      q.topic ? el('span', { class: 'tag verb' }, q.topic) : null,
      el('span', { class: 'tag marks' }, q.type === 'true_false' ? 'True / False' : 'Multiple choice')
    ));
    card.appendChild(el('p', { class: 'quiz-q' }, q.question));

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
    if (!quizState.revealed[quizState.idx] && quizState.idx < quizState.items.length - 1) {
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

    let correct = 0, answered = 0;
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
    Object.entries(aimStats).forEach(([aim, s]) => { aimBreakdown[aim] = { correct: s.right, total: s.total }; });

    if (total > 0) {
      saveSession('quiz_business_u3', {
        aims: Object.keys(aimStats), total, correct, aimBreakdown
      });
      incrementCounter('ra10_questions_today', total);
      awardXP(20, '+20 XP — Quiz complete!');
      if (window._isDailyQuiz) {
        window._isDailyQuiz = false;
        if (completeDailyTask('dailyQuiz')) awardXP(25, '+25 XP — Daily quiz done!');
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
    ['A','B','C','D','E','F'].forEach(a => {
      if (!aimStats[a]) return;
      const s = aimStats[a];
      const ap = Math.round(s.right / s.total * 100);
      breakdown.appendChild(el('div', { class: 'quiz-aim-row' },
        el('span', { class: 'label' }, `Aim ${a}`),
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

  // ============================================================
  // Progress tab
  // ============================================================
  async function renderProgress() {
    if (document.getElementById('view-progress')?.classList.contains('active') === false) return;
    const gate = document.getElementById('progress-gate');
    const content = document.getElementById('progress-content');
    if (!gate || !content) return;

    if (!window.RA10 || !RA10.isLoggedIn()) {
      gate.style.display = 'block';
      content.style.display = 'none';
      const btn = document.getElementById('btn-progress-signin');
      if (btn) btn.onclick = () => { window.top?.postMessage({ type: 'RA10_OPEN_AUTH' }, '*'); };
      return;
    }

    gate.style.display = 'none';
    content.style.display = 'block';

    const session = RA10.getSession();
    const sb = window.supabase.createClient(SB_URL, SB_KEY);
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [{ data: sessions }, { data: profile }] = await Promise.all([
      sb.from('revision_sessions').select('*').eq('user_id', session.user.id).in('session_type', SESSION_TYPES).gte('created_at', since).order('created_at', { ascending: false }),
      sb.from('profiles').select('xp_this_week, xp_total').eq('id', session.user.id).single()
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
        <div class="prog-xp-number">${xpWeek}</div>
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
    const aimTotals = {}, aimCorrect = {};
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

    const aimBars = Object.keys(aimTotals).sort().map(aim => {
      const total = aimTotals[aim] || 0;
      const pct = total ? Math.round((aimCorrect[aim] || 0) / total * 100) : 0;
      const cls = pct >= 70 ? 'good' : pct >= 40 ? 'mid' : 'bad';
      return `<div class="prog-aim-row"><div class="meta"><span>Aim ${aim}</span><strong>${pct}%</strong></div><div class="bar ${cls}"><span style="width:${pct}%"></span></div></div>`;
    }).join('');

    if (weakAims.length) {
      weakEl.innerHTML = `
        <div class="prog-aim-accuracy"><h3>Aim accuracy overview</h3>${aimBars || '<p class="muted">No aim data yet.</p>'}</div>
        <div class="prog-weak-wrap">
          <h3>🚨 Weak aims</h3>
          <p>These need work based on your latest sessions.</p>
          <div class="prog-weak-cards">
            ${weakAims.map(w => `<div class="prog-weak-card"><span class="aim">Aim ${w.aim}</span><span class="pct">${w.pct}%</span></div>`).join('')}
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
        <div class="prog-aim-accuracy"><h3>Aim accuracy overview</h3>${aimBars || '<p class="muted">Complete sessions to build your aim accuracy graph.</p>'}</div>
        <div class="prog-empty">Complete at least 3 questions in any aim to unlock weak-aim challenges.</div>
      `;
    }

    const listEl = document.getElementById('sessions-list');
    if (!rows.length) {
      listEl.innerHTML = '<p class="prog-empty">No sessions in the last 30 days. Start a quiz or practice session to track your progress.</p>';
      return;
    }

    const typeLabel = {
      'quiz_business_u3': '🧠 Quiz',
      'practice_business_u3': '✍️ Practice',
      'mock_business_u3': '📄 Mock Paper',
      'flashcard_business_u3': '🃏 Flashcards',
      quiz: '🧠 Quiz', practice: '✍️ Practice', mock: '📄 Mock Paper', flashcard: '🃏 Flashcards'
    };
    listEl.innerHTML = '<h3 class="prog-history-title">Recent sessions</h3>' +
      rows.map(r => {
        const pct = r.questions_total ? Math.round(r.questions_correct / r.questions_total * 100) : null;
        const date = new Date(r.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
        const cls = pct === null ? 'mid' : pct >= 70 ? 'good' : pct >= 40 ? 'mid' : 'bad';
        return `
          <div class="prog-session-card ${cls}">
            <div>
              <span class="t">${typeLabel[r.session_type] || r.session_type}</span>
              <span class="d">${date}</span>
              ${r.learning_aims?.length ? `<span class="a">Aims: ${r.learning_aims.join(', ')}</span>` : ''}
            </div>
            <div class="s">${pct !== null ? pct + '% (' + r.questions_correct + '/' + r.questions_total + ')' : r.questions_total + ' questions'}</div>
          </div>
        `;
      }).join('');
  }

  function calcStreak(rows) {
    const days = new Set(getStreakDates());
    (rows || []).forEach((row) => {
      const createdAt = row?.created_at;
      if (!createdAt) return;
      const parsed = new Date(createdAt);
      if (!Number.isNaN(parsed.getTime())) {
        days.add(parsed.toISOString().slice(0, 10));
      }
    });
    let streak = 0;
    const d = new Date(todayKey() + 'T00:00:00');
    while (days.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
    return streak;
  }

  function startWeakQuiz(aims) {
    if (!QUIZ || !QUIZ.length) return;
    let pool = QUIZ.filter(q => aims.includes(q.learning_aim || q.learningaim));
    if (!pool.length) pool = QUIZ.slice();
    pool = shuffle(pool);
    const length = Math.min(20, pool.length);
    quizState = { items: pool.slice(0, length), idx: 0, answers: new Array(length).fill(-1), revealed: new Array(length).fill(false), aimFilter: aims[0] || '' };
    document.getElementById('quiz-results').style.display = 'none';
    renderQuizCard();
  }

  function startWeakPractice(aims) {
    let pool = QUESTIONS.filter(q => aims.includes(q.learning_aim || q.learningaim));
    if (!pool.length) pool = QUESTIONS.slice();
    window._practiceSession = { aims: aims && aims.length ? aims : ['A','B','C','D','E','F'], total: 0, correct: 0, aimBreakdown: {}, attemptedIds: new Set(), scoreByQuestion: {} };
    practiceQueue = shuffle(pool);
    practiceIdx = 0;
    renderPracticeCard();
  }

  // ============================================================
  // FLASHCARDS
  // ============================================================
  let flashState = null;

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
      ['A','B','C','D','E','F'].forEach(a => aimSel.appendChild(el('option', { value: a }, `Aim ${a}`)));
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
      $('#flash-stage').innerHTML = `<p class="muted" style="padding:30px;text-align:center;">${FLASHCARDS.length} cards ready across all aims. Click <strong>Start session</strong> to begin.</p>`;
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
    flashState = { deck, idx: 0, knownIds: new Set(stored.known), learningIds: new Set(stored.learning), aimFilter: aim };
    window._flashSession = { aims: aim ? [aim] : ['A','B','C','D','E','F'], total: 0, correct: 0, aimBreakdown: {}, attemptedIds: new Set(), knownIds: new Set() };
    markFlashReviewStarted();
    renderFlashCard();
  }

  function renderFlashCard() {
    const stage = $('#flash-stage');
    stage.innerHTML = '';
    if (!flashState || !flashState.deck.length) return;
    const c = flashState.deck[flashState.idx];
    $('#flash-progress').textContent = `Card ${flashState.idx + 1} of ${flashState.deck.length}`;

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
      el('div', { class: 'face-eyebrow' }, `Aim ${c.learning_aim} · ${c.topic || ''}`),
      el('div', { class: 'face-content' }, c.front),
      el('div', { class: 'face-hint' }, 'Click to flip')
    );
    const back = el('div', { class: 'flash-face back' },
      el('div', { class: 'face-eyebrow' }, c.id),
      el('div', { class: 'face-content' }, c.back),
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
        if (!fs.attemptedIds.has(c.id)) { fs.attemptedIds.add(c.id); fs.total++; }
        const aim = c.learning_aim || c.learningaim;
        fs.aimBreakdown[aim] = fs.aimBreakdown[aim] || { correct: 0, total: 0 };
        fs.aimBreakdown[aim].total = Math.max(fs.aimBreakdown[aim].total, flashState.deck.filter(x => (x.learning_aim || x.learningaim) === aim && fs.attemptedIds.has(x.id)).length);
        if (fs.knownIds.has(c.id)) { fs.knownIds.delete(c.id); fs.correct = Math.max(0, fs.correct - 1); fs.aimBreakdown[aim].correct = Math.max(0, fs.aimBreakdown[aim].correct - 1); }
      }
      saveFlashProgress({ known: [...flashState.knownIds], learning: [...flashState.learningIds] });
      renderFlashCard();
    });
    knownBtn.addEventListener('click', () => {
      if (isKnown) flashState.knownIds.delete(c.id);
      else { flashState.knownIds.add(c.id); flashState.learningIds.delete(c.id); }
      if (window._flashSession) {
        const fs = window._flashSession;
        if (!fs.attemptedIds.has(c.id)) { fs.attemptedIds.add(c.id); fs.total++; }
        const aim = c.learning_aim || c.learningaim;
        fs.aimBreakdown[aim] = fs.aimBreakdown[aim] || { correct: 0, total: 0 };
        fs.aimBreakdown[aim].total = Math.max(fs.aimBreakdown[aim].total, flashState.deck.filter(x => (x.learning_aim || x.learningaim) === aim && fs.attemptedIds.has(x.id)).length);
        if (isKnown) { fs.knownIds.delete(c.id); fs.correct = Math.max(0, fs.correct - 1); fs.aimBreakdown[aim].correct = Math.max(0, fs.aimBreakdown[aim].correct - 1); }
        else { fs.knownIds.add(c.id); fs.correct++; fs.aimBreakdown[aim].correct++; }
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
    if (!fs || !fs.total) { alert('No flashcard activity to save yet.'); return; }
    await saveSession('flashcard_business_u3', {
      aims: Object.keys(fs.aimBreakdown), total: fs.total, correct: fs.correct,
      aimBreakdown: fs.aimBreakdown, attemptedIds: fs.attemptedIds
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

})();
