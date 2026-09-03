// BTEC IT Level 2 Unit 2 — Main Application
// Replicates architecture from IT Unit 1 (it_aaq_u1)

(function() {
'use strict';

// ====== UTILITY FUNCTIONS ======
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

// ====== STATE MANAGEMENT ======
let questionData = { A: [], B: [], C: [] };
let quizState = null;
let practiceState = null;
let flashState = { aim: '', current: 0, known: new Set(), learning: new Set(), flipped: false };
let flashcardData = [];
let userProgress = {};
let practiceXpAwarded = false;
let flashXpAwarded = false;

const SB_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';
const DAILY_TASKS_KEY = 'ra10-daily-tasks-v2';
const STREAK_DATES_KEY = 'ra10_streak_dates';
const SESSION_TYPES = [
  'quiz_it_l2_u2', 'practice_it_l2_u2', 'mock_it_l2_u2', 'flashcard_it_l2_u2'
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

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
  if (!window.RA10 || !RA10.isLoggedIn || !RA10.isLoggedIn()) return;
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

// ====== DATA LOADING ======
async function loadQuestionData() {
  try {
    const [dataA, dataB, dataC] = await Promise.all([
      fetch('data/aim_A.json').then(r => r.json()),
      fetch('data/aim_B.json').then(r => r.json()),
      fetch('data/aim_C.json').then(r => r.json())
    ]);
    // Inject learning_aim so every question has it regardless of schema
    questionData.A = dataA.map(q => ({ learning_aim: 'A', ...q }));
    questionData.B = dataB.map(q => ({ learning_aim: q.learning_aim || 'B', ...q }));
    questionData.C = dataC.map(q => ({ learning_aim: q.learning_aim || 'C', ...q }));
    return true;
  } catch (e) {
    console.error('Failed to load question data:', e);
    return false;
  }
}

// ====== AUTOM ARKING FUNCTIONS ======
function tokenizeAnswer(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w && !SPEC.stopWords.includes(w));
}

function autoMarkShort(userAnswer, correctPoints) {
  const userTokens = new Set(tokenizeAnswer(userAnswer));
  if (userTokens.size === 0) return 0;
  
  let bestMatch = 0;
  for (const point of correctPoints) {
    const pointTokens = new Set(tokenizeAnswer(point));
    const overlap = [...userTokens].filter(t => pointTokens.has(t)).length;
    const matchRatio = overlap / Math.max(userTokens.size, pointTokens.size);
    if (matchRatio > 0.35) bestMatch = Math.max(bestMatch, 1);
  }
  return bestMatch;
}

function autoMarkExtended(userAnswer, marks) {
  const wordCount = tokenizeAnswer(userAnswer).length;
  const contentCues = ['explain', 'reason', 'because', 'result', 'effect', 'therefore'].filter(c => userAnswer.toLowerCase().includes(c)).length;
  const structureCues = userAnswer.split('\n').length > 2 ? 1 : 0;
  
  if (wordCount < 20) return Math.ceil(marks * 0.25);
  if (wordCount < 50) return Math.ceil(marks * 0.5);
  if (contentCues >= 2) return Math.ceil(marks * 0.75);
  return Math.ceil(marks * 0.9);
}

// ====== UI RENDERING ======
function renderHome() {
  const host = $('#main-content');
  if (!host) return;

  const profile = (window.RA10 && window.RA10.getProfile ? window.RA10.getProfile() : null) || {};
  const name = profile.full_name || profile.email || 'Learner';

  const totalQ = questionData.A.length + questionData.B.length + questionData.C.length;
  const allQuestions = [...questionData.A, ...questionData.B, ...questionData.C];
  const mcCount = allQuestions.filter(q => q.type === 'multiple-choice' || q.type === 'multipleChoice').length;
  const totalMarks = allQuestions.reduce((sum, q) => {
    const parsed = parseMarks(q.marks);
    return sum + (Number.isFinite(parsed.max) ? parsed.max : 1);
  }, 0);
  const practisedToday = getCounter('ra10_practice_today');
  const bestQuiz = Number(localStorage.getItem('ra10_best_quiz_it_l2_u2') || 0);
  const knownCards = Number(localStorage.getItem('ra10_flash_known_it_l2_u2') || 0);
  const quizCount = Number(localStorage.getItem('ra10_quiz_sessions_it_l2_u2') || 0);

  host.innerHTML = `
    <div class="dashboard">
      <div class="dashboard-hero">
        <div class="hero-text">
          <span class="hero-chip">BTEC IT Level 2 · Unit 2</span>
          <h1>Technology Systems</h1>
          <p>Welcome back, <strong>${escapeHTML(name)}</strong>! Ready to revise?</p>
        </div>
        <div class="hero-actions">
          <button class="btn hero-btn" data-goto="quiz">⚡ Start Quiz</button>
          <button class="btn hero-btn secondary" data-goto="flash">🎴 Flashcards</button>
        </div>
        <div class="hero-stats">
          <div class="stat-block"><strong>${totalQ}</strong><br><span class="stat-label">Questions</span></div>
          <div class="stat-block"><strong>${totalMarks}</strong><br><span class="stat-label">Total Marks</span></div>
          <div class="stat-block"><strong>${quizCount}</strong><br><span class="stat-label">Quizzes</span></div>
        </div>
      </div>
      <aside id="progress-sidebar" class="progress-sidebar hidden">
        <!-- Progress sidebar will be rendered here -->
      </aside>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-body">
            <div class="stat-value">${practisedToday}</div>
            <div class="stat-label">Questions Today</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-body">
            <div class="stat-value">${bestQuiz}%</div>
            <div class="stat-label">Best Quiz Score</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎴</div>
          <div class="stat-body">
            <div class="stat-value">${knownCards}</div>
            <div class="stat-label">Cards Known</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-body">
            <div class="stat-value">${calcLocalStreak()}</div>
            <div class="stat-label">Day Streak</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🗂️</div>
          <div class="stat-body">
            <div class="stat-value">${totalQ}</div>
            <div class="stat-label">Total Questions</div>
          </div>
        </div>
      </div>

      <div class="section-heading">Learning Aims</div>
      <div class="aims-row">
        <div class="aim-card aim-a">
          <div class="aim-badge">A</div>
          <div class="aim-body">
            <div class="aim-name">Applications &amp; Issues</div>
            <div class="aim-desc">Cloud services, security, GDPR, backup &amp; networking</div>
            <div class="aim-count">${questionData.A.length} questions</div>
          </div>
          <div class="aim-btns">
            <button class="btn sm" data-action="practice-aim" data-aim="A">Practice</button>
            <button class="btn sm" data-action="flash-aim" data-aim="A">Flashcards</button>
          </div>
        </div>
        <div class="aim-card aim-b">
          <div class="aim-badge">B</div>
          <div class="aim-body">
            <div class="aim-name">Hardware &amp; Software</div>
            <div class="aim-desc">CPU, memory, storage, devices &amp; software licensing</div>
            <div class="aim-count">${questionData.B.length} questions</div>
          </div>
          <div class="aim-btns">
            <button class="btn sm" data-action="practice-aim" data-aim="B">Practice</button>
            <button class="btn sm" data-action="flash-aim" data-aim="B">Flashcards</button>
          </div>
        </div>
        <div class="aim-card aim-c">
          <div class="aim-badge">C</div>
          <div class="aim-body">
            <div class="aim-name">Programming Basics</div>
            <div class="aim-desc">Variables, data types, control flow &amp; functions</div>
            <div class="aim-count">${questionData.C.length} questions</div>
          </div>
          <div class="aim-btns">
            <button class="btn sm" data-action="practice-aim" data-aim="C">Practice</button>
            <button class="btn sm" data-action="flash-aim" data-aim="C">Flashcards</button>
          </div>
        </div>
      </div>

      <div class="section-heading">Study Tools</div>
      <div class="tools-grid">
        <button class="tool-card" data-goto="quiz">
          <div class="tool-icon">⚡</div>
          <div class="tool-name">Quick Quiz</div>
          <div class="tool-desc">Auto-marked multiple-choice · ${mcCount} MC questions</div>
        </button>
        <button class="tool-card" data-goto="practice">
          <div class="tool-icon">📝</div>
          <div class="tool-name">Practice Mode</div>
          <div class="tool-desc">All question types · mark scheme feedback</div>
        </button>
        <button class="tool-card ai-tool-card" data-goto="practice">
          <div class="tool-icon">✦</div>
          <div class="tool-name">AI Examiner</div>
          <div class="tool-desc">Instant feedback, strengths, improvements, and marks</div>
        </button>
        <button class="tool-card" data-goto="flash">
          <div class="tool-icon">🎴</div>
          <div class="tool-name">Flashcards</div>
          <div class="tool-desc">45 key terms · flip &amp; track progress</div>
        </button>
        <button class="tool-card" data-goto="guide">
          <div class="tool-icon">📖</div>
          <div class="tool-name">Revision Guide</div>
          <div class="tool-desc">Full notes for all 3 aims · accordion sections</div>
        </button>
      </div>
    </div>
  `;

  $$('[data-goto]', host).forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.goto));
  });
  $$('[data-action="practice-aim"]', host).forEach(btn => {
    btn.addEventListener('click', () => selectAim(btn.dataset.aim));
  });
  $$('[data-action="flash-aim"]', host).forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab('flash');
      filterFlashcards(btn.dataset.aim || '');
    });
  });
}

// ====== PRACTICE — data helpers ======

let practiceQueue = [];
let practiceIdx = 0;

// Practice-only curation: remove outlier questions that are too advanced or low-value for L2 exam prep.
const PRACTICE_EXCLUDED_IDS = new Set([
  'A046', 'A047', 'A048', 'A049', 'A050', 'B070', 'C065'
]);
const PRACTICE_EXCLUDED_EXACT_TEXT = new Set([
  'what does assignment do?',
  'what does gui stand for?'
]);

function isPracticeEligible(q) {
  if (!q) return false;
  if (q.id && PRACTICE_EXCLUDED_IDS.has(String(q.id))) return false;

  const text = String(q.question || '').trim().toLowerCase();
  if (PRACTICE_EXCLUDED_EXACT_TEXT.has(text)) return false;

  const marks = parseMarks(q.marks);
  if ((marks.max || 0) >= 8) return false;

  return true;
}

function isMcType(type) {
  return type === 'multiple-choice' || type === 'multipleChoice' || type === 'mc';
}

function isExtendedType(type) {
  return type === 'extended';
}

// Returns [{letter, text, isCorrect}] for any MC question schema
function normaliseMcOptions(q) {
  // Schema A: answers: [{text, correct}]
  if (Array.isArray(q.answers) && q.answers.length && typeof q.answers[0] === 'object' && 'correct' in q.answers[0]) {
    return q.answers.map((a, i) => ({
      letter: String.fromCharCode(65 + i),
      text: String(a.text || ''),
      isCorrect: !!a.correct
    }));
  }
  // Schema B: options: ["A) ...", "B) ...", ...] + correct_answer: "B"
  if (Array.isArray(q.options)) {
    const correctLetter = String(q.correct_answer || '').trim().toUpperCase().charAt(0);
    return q.options.map((o, i) => {
      const letter = String.fromCharCode(65 + i);
      // Strip "A) " prefix if already present
      const raw = typeof o === 'string' ? o : (o.text || String(o));
      const text = raw.replace(/^[A-D]\)\s*/i, '').trim();
      return { letter, text, isCorrect: letter === correctLetter };
    });
  }
  return [];
}

// Returns {min, max} numeric marks for any marks value
function parseMarks(raw) {
  if (typeof raw === 'number') return { min: raw, max: raw };
  const s = String(raw || '1');
  const m = s.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (m) return { min: Number(m[1]), max: Number(m[2]) };
  return { min: Number(s) || 1, max: Number(s) || 1 };
}

// Returns array of mark-scheme points as plain strings
function getMsPoints(q) {
  if (q.mark_scheme && Array.isArray(q.mark_scheme.points) && q.mark_scheme.points.length) {
    return q.mark_scheme.points;
  }
  // Fall back to markingGuidance
  if (q.markingGuidance) {
    // Split on semicolons or commas after "Award X mark"
    const str = String(q.markingGuidance);
    const parts = str.split(/[;,]/).map(s => s.trim()).filter(Boolean);
    return parts.length > 1 ? parts : [str];
  }
  return [];
}

function getMsGuidance(q) {
  if (q.mark_scheme && q.mark_scheme.additional_guidance) return q.mark_scheme.additional_guidance;
  if (q.guidance) return q.guidance;
  return '';
}

// ====== PRACTICE — NLP automark (ported from Level 3) ======

const STOP_WORDS = new Set(['the','a','an','and','or','but','of','to','in','on','at','for','with','by','from','as','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','that','this','these','those','it','its','their','they','them','he','she','his','her','i','you','your','we','us','our','if','than','then','so','not','no','also','about','into','more','most','some','any','one','two','use','used','using','make','makes','made','allow','allows','allowed','provide','provides','provided','example']);
const SYNONYM_GROUPS = [
  ['increase','improve','improvement','rise','higher','boost','enhance'],
  ['decrease','reduce','reduction','lower','drop','decline'],
  ['secure','security','protect','protection','safe','safety'],
  ['data','information'],['network','connectivity'],
  ['performance','speed','outcome','result'],['store','storage','stores','stored'],
  ['temporary','volatile'],['permanent','non-volatile','read-only'],
  ['process','processes','processing','execute','executes','execution']
];
const SYNONYMS = SYNONYM_GROUPS.reduce((acc, g) => { g.forEach(t => { acc[t] = g; }); return acc; }, {});

function tokenise(text) {
  return String(text||'').toLowerCase().replace(/\(\d+\)/g,' ').replace(/[^a-z0-9'\-\s]/g,' ').split(/\s+/).filter(Boolean);
}
function normToken(t) {
  t = String(t||'').toLowerCase();
  if (t.length>5 && t.endsWith('ing')) t=t.slice(0,-3);
  else if (t.length>4 && t.endsWith('ed')) t=t.slice(0,-2);
  else if (t.length>4 && t.endsWith('es')) t=t.slice(0,-2);
  else if (t.length>3 && t.endsWith('s')) t=t.slice(0,-1);
  return t;
}
function contentTokens(text) {
  return tokenise(text).map(normToken).filter(t => !STOP_WORDS.has(t) && t.length>2);
}
function buildLexicon(answer) {
  const base = contentTokens(answer);
  const set = new Set(base);
  base.forEach(t => { const s=SYNONYMS[t]; if(s) s.forEach(x=>set.add(normToken(x))); });
  return { tokens: base, set };
}
function tokenMatches(target, lex) {
  if (lex.set.has(target)) return true;
  const syn = SYNONYMS[target]||[];
  if (syn.some(s=>lex.set.has(normToken(s)))) return true;
  if (target.length<5) return false;
  for (const c of lex.set) {
    if (c.length>=5 && (c.startsWith(target.slice(0,5))||target.startsWith(c.slice(0,5)))) return true;
  }
  return false;
}
function matchClause(clause, lex) {
  const kw = Array.from(new Set(contentTokens(clause)));
  if (!kw.length) return { hit:false, matched:[], need:0, total:0 };
  const matched = kw.filter(k=>tokenMatches(k,lex));
  let need = kw.length<=2 ? 1 : kw.length<=4 ? 2 : Math.max(2,Math.ceil(kw.length*0.45));
  const hit = matched.length>=need;
  return { hit, matched, need, total:kw.length };
}

function autoMarkShort(q, answer) {
  const points = getMsPoints(q);
  const { max } = parseMarks(q.marks);
  if (!points.length) return { earned: 0, max, lines: [] };
  const lex = buildLexicon(answer);
  let earned = 0;
  const lines = points.map(pt => {
    const r = matchClause(pt, lex);
    if (r.hit) earned++;
    return { label: pt, hit: r.hit, details: `${r.matched.length}/${r.total}` };
  });
  earned = Math.min(earned, max);
  return { earned, max, lines };
}

function autoMarkExtended(q, answer) {
  const points = getMsPoints(q);
  const { max } = parseMarks(q.marks);
  const lex = buildLexicon(answer);
  const wordCount = tokenise(answer).length;
  const lines = [];
  let hits = 0;
  points.forEach(pt => {
    const r = matchClause(pt, lex);
    lines.push({ label: pt, hit: r.hit, details: `${r.matched.length}/${r.total}` });
    if (r.hit) hits++;
  });
  const coverage = points.length ? hits/points.length : 0;
  const lenFactor = wordCount>=150?1:wordCount>=80?0.65:wordCount>=40?0.4:0.15;
  const score = coverage*0.7 + lenFactor*0.3;
  const earned = Math.min(Math.round(score * max), max);
  return { earned, max, lines, coverage, wordCount };
}

// ====== PRACTICE — UI builders ======

function buildMcOptionsUI(q, choiceRef) {
  const opts = normaliseMcOptions(q);
  const wrap = document.createElement('div');
  wrap.className = 'mc-practice';
  opts.forEach(o => {
    const row = document.createElement('label');
    row.className = 'mc-practice-row';
    const radio = document.createElement('input');
    radio.type = 'radio'; radio.name = 'mc-p-'+q.id; radio.value = o.letter;
    radio.addEventListener('change', () => { choiceRef.value = o.letter; });
    const letterSpan = document.createElement('span');
    letterSpan.className = 'mc-practice-letter'; letterSpan.textContent = o.letter;
    const textSpan = document.createElement('span');
    textSpan.className = 'mc-practice-text'; textSpan.textContent = o.text;
    row.appendChild(radio); row.appendChild(letterSpan); row.appendChild(textSpan);
    wrap.appendChild(row);
  });
  return wrap;
}

function buildMcResultUI(q, picked) {
  const opts = normaliseMcOptions(q);
  const correctOpt = opts.find(o => o.isCorrect);
  const isRight = picked && correctOpt && picked.toUpperCase() === correctOpt.letter;
  const box = document.createElement('div');
  box.className = 'automark-box';

  const head = document.createElement('div'); head.className = 'automark-head';
  const eyebrow = document.createElement('span'); eyebrow.className = 'am-eyebrow';
  eyebrow.textContent = isRight ? 'Correct ✓' : 'Incorrect ✗';
  const scoreSpan = document.createElement('span');
  scoreSpan.className = 'automark-score ' + (isRight ? 'am-good' : 'am-bad');
  scoreSpan.innerHTML = `<span class="value">${isRight?1:0}</span><span class="total">/ 1</span>`;
  head.appendChild(eyebrow); head.appendChild(scoreSpan); box.appendChild(head);

  const detail = document.createElement('p'); detail.className = 'automark-detail';
  detail.innerHTML = `<strong>You chose:</strong> ${escapeHTML(picked||'—')}<br><strong>Correct answer:</strong> ${escapeHTML(correctOpt?correctOpt.letter+' — '+correctOpt.text:'—')}`;
  box.appendChild(detail);

  const ms = q.mark_scheme || {};
  if (ms.additional_guidance) {
    const p = document.createElement('p'); p.className = 'automark-detail';
    p.style.fontStyle = 'italic'; p.textContent = ms.additional_guidance; box.appendChild(p);
  }

  // Show all options with ticks/crosses
  const optList = document.createElement('div'); optList.className = 'mc-result-list';
  opts.forEach(o => {
    const row = document.createElement('div');
    row.className = 'mc-result-row ' + (o.isCorrect ? 'mc-result-correct' : (o.letter === picked && !isRight ? 'mc-result-wrong' : ''));
    row.textContent = `${o.letter}. ${o.text}`;
    if (o.isCorrect) row.insertAdjacentHTML('beforeend', ' <span class="mc-tick">✓</span>');
    else if (o.letter === picked && !isRight) row.insertAdjacentHTML('beforeend', ' <span class="mc-cross">✗</span>');
    optList.appendChild(row);
  });
  box.appendChild(optList);
  return box;
}

function buildAutoMarkUI(q, answer, forcedResult) {
  const isExt = isExtendedType(q.type);
  const result = forcedResult || (isExt ? autoMarkExtended(q, answer) : autoMarkShort(q, answer));
  const box = document.createElement('div'); box.className = 'automark-box';

  const head = document.createElement('div'); head.className = 'automark-head';
  const eyebrow = document.createElement('span'); eyebrow.className = 'am-eyebrow';
  eyebrow.textContent = 'Auto-mark estimate';
  const scoreSpan = document.createElement('span'); scoreSpan.className = 'automark-score';
  scoreSpan.innerHTML = `<span class="value">${result.earned}</span><span class="total">/ ${result.max}</span>`;
  const adj = document.createElement('div'); adj.className = 'automark-adjust';
  const minus = document.createElement('button'); minus.className = 'btn'; minus.textContent = '−';
  const plus = document.createElement('button'); plus.className = 'btn'; plus.textContent = '+';
  const valEl = scoreSpan.querySelector('.value');
  minus.onclick = () => { const v=parseInt(valEl.textContent,10); if(v>0) valEl.textContent=String(v-1); };
  plus.onclick = () => { const v=parseInt(valEl.textContent,10); if(v<result.max) valEl.textContent=String(v+1); };
  adj.appendChild(minus); adj.appendChild(plus);
  head.appendChild(eyebrow); head.appendChild(scoreSpan); head.appendChild(adj);
  box.appendChild(head);

  const blurb = document.createElement('p'); blurb.className = 'automark-detail';
  blurb.textContent = isExt
    ? `Estimated from content coverage (${Math.round((result.coverage||0)*100)}% matched, ${result.wordCount||0} words). Adjust with + / − if needed.`
    : `Estimated by matching mark-scheme concepts. Adjust with + / − if needed.`;
  box.appendChild(blurb);

  if (result.lines && result.lines.length) {
    const detail = document.createElement('div'); detail.className = 'automark-detail automark-hits';
    detail.innerHTML = `<strong>${isExt ? 'Content coverage:' : 'Mark-scheme point check:'}</strong>`;
    const ul = document.createElement('ul');
    result.lines.forEach(l => {
      const li = document.createElement('li'); li.className = l.hit?'hit':'miss'; li.title = l.details||'';
      li.textContent = l.label; ul.appendChild(li);
    });
    detail.appendChild(ul); box.appendChild(detail);
  }

  // Full mark scheme toggle
  const msBtn = document.createElement('button'); msBtn.className = 'btn ghost'; msBtn.style.marginTop='12px';
  msBtn.textContent = 'Show full mark scheme';
  const msHolder = document.createElement('div'); msHolder.style.display='none';
  msHolder.appendChild(buildMarkSchemeBlock(q));
  msBtn.onclick = () => {
    const open = msHolder.style.display==='block';
    msHolder.style.display = open?'none':'block';
    msBtn.textContent = open?'Show full mark scheme':'Hide full mark scheme';
  };
  box.appendChild(msBtn); box.appendChild(msHolder);
  return box;
}

function buildAiAutoMarkUI(q, answer, aiResult) {
  const box = document.createElement('div'); box.className = 'automark-box ai-examiner-box';
  const head = document.createElement('div'); head.className = 'automark-head';
  const eyebrow = document.createElement('span'); eyebrow.className = 'am-eyebrow';
  eyebrow.innerHTML = '✦ AI Examiner feedback';
  const scoreSpan = document.createElement('span'); scoreSpan.className = 'automark-score';
  scoreSpan.innerHTML = `<span class="value">${aiResult.earned}</span><span class="total">/ ${aiResult.max}</span>`;
  const adj = document.createElement('div'); adj.className = 'automark-adjust';
  const minus = document.createElement('button'); minus.className = 'btn'; minus.textContent = '−';
  const plus = document.createElement('button'); plus.className = 'btn'; plus.textContent = '+';
  const valEl = scoreSpan.querySelector('.value');
  minus.onclick = () => { const v=parseInt(valEl.textContent,10); if(v>0) valEl.textContent=String(v-1); };
  plus.onclick = () => { const v=parseInt(valEl.textContent,10); if(v<aiResult.max) valEl.textContent=String(v+1); };
  adj.appendChild(minus); adj.appendChild(plus);
  head.appendChild(eyebrow); head.appendChild(scoreSpan); head.appendChild(adj);
  box.appendChild(head);

  const hits = (aiResult.lines||[]).filter(l=>l.hit).slice(0,5);
  const misses = (aiResult.lines||[]).filter(l=>!l.hit).slice(0,5);
  const grid = document.createElement('div'); grid.className = 'ai-feedback-grid';
  const goodCard = document.createElement('section'); goodCard.className = 'ai-feedback-card good';
  goodCard.innerHTML = '<h4>What you did well</h4>';
  const goodUl = document.createElement('ul');
  (hits.length ? hits : [{label:'You attempted the question — keep building on this.'}]).forEach(l => {
    const li = document.createElement('li'); li.textContent = l.label; goodUl.appendChild(li);
  });
  goodCard.appendChild(goodUl);
  const improveCard = document.createElement('section'); improveCard.className = 'ai-feedback-card improve';
  improveCard.innerHTML = '<h4>How to improve</h4>';
  const impUl = document.createElement('ul');
  (misses.length ? misses : [{label:'Add one more explained point to push for full marks.'}]).forEach(l => {
    const li = document.createElement('li'); li.textContent = l.label; impUl.appendChild(li);
  });
  improveCard.appendChild(impUl);
  grid.appendChild(goodCard); grid.appendChild(improveCard); box.appendChild(grid);

  const msBtn = document.createElement('button'); msBtn.className = 'btn ghost'; msBtn.style.marginTop='12px';
  msBtn.textContent = 'Show full mark scheme';
  const msHolder = document.createElement('div'); msHolder.style.display='none';
  msHolder.appendChild(buildMarkSchemeBlock(q));
  msBtn.onclick = () => {
    const open = msHolder.style.display==='block';
    msHolder.style.display = open?'none':'block';
    msBtn.textContent = open?'Show full mark scheme':'Hide full mark scheme';
  };
  box.appendChild(msBtn); box.appendChild(msHolder);
  return box;
}

function normaliseAiResult(raw, q, answer) {
  if (!raw || typeof raw!=='object') return null;
  const { max } = parseMarks(q.marks);
  const earned = Math.max(0, Math.min(max, Math.round(Number(raw.earned)||0)));
  let lines = [];
  if (Array.isArray(raw.strengths)||Array.isArray(raw.improvements)) {
    (raw.strengths||[]).forEach(s => { if(s) lines.push({label:String(s),hit:true}); });
    (raw.improvements||[]).forEach(s => { if(s) lines.push({label:String(s),hit:false}); });
  } else if (Array.isArray(raw.lines)) {
    lines = raw.lines.map(l=>({label:String(l.label||''),hit:!!l.hit})).filter(l=>l.label);
  }
  return { earned, max, lines, coverage: Number(raw.coverage)||0, wordCount: Number(raw.wordCount)||tokenise(String(answer||'')).length };
}

function buildMarkSchemeBlock(q) {
  const wrap = document.createElement('div'); wrap.className = 'ms-block';
  const h = document.createElement('h5'); h.textContent = 'Mark Scheme'; wrap.appendChild(h);
  const ms = q.mark_scheme || {};

  if (isMcType(q.type)) {
    const opts = normaliseMcOptions(q);
    const correct = opts.find(o=>o.isCorrect);
    if (correct) {
      const p = document.createElement('p'); p.className = 'ms-instruction';
      p.innerHTML = `<strong>Correct answer:</strong> ${escapeHTML(correct.letter+' — '+correct.text)}`;
      wrap.appendChild(p);
    }
    if (ms.explanation) { const p = document.createElement('p'); p.className='ms-instruction'; p.style.fontStyle='italic'; p.textContent=ms.explanation; wrap.appendChild(p); }
    if (ms.additional_guidance||q.guidance) { const p=document.createElement('p'); p.className='ms-instruction'; p.textContent=ms.additional_guidance||q.guidance; wrap.appendChild(p); }
    return wrap;
  }

  const points = getMsPoints(q);
  if (ms.instruction) { const p=document.createElement('p'); p.className='ms-instruction'; p.textContent=ms.instruction; wrap.appendChild(p); }
  if (points.length) {
    const ul = document.createElement('ul');
    points.forEach(pt => {
      const li = document.createElement('li');
      li.innerHTML = escapeHTML(pt).replace(/\((\d+)\)/g,'<strong>($1)</strong>');
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
  } else if (q.markingGuidance) {
    const p = document.createElement('p'); p.textContent = q.markingGuidance; wrap.appendChild(p);
  }
  if (ms.additional_guidance) { const p=document.createElement('p'); p.className='ms-note'; p.textContent=ms.additional_guidance; wrap.appendChild(p); }
  if (ms.do_not_accept) { const p=document.createElement('p'); p.className='ms-dna'; p.textContent='Do not accept: '+ms.do_not_accept; wrap.appendChild(p); }
  return wrap;
}

// ====== PRACTICE — main render ======

function renderPractice(preAim) {
  const host = $('#main-content');
  if (!host) return;
  host.innerHTML = `
    <div class="practice-page">
      <div class="practice-setup-card">
        <h2>Practice Questions</h2>
        <p class="practice-setup-desc">Work through questions one at a time with instant feedback, mark schemes, and AI Examiner for written answers.</p>
        <div class="practice-setup-row">
          <label class="setup-label">Learning Aim
            <select id="practice-aim">
              <option value="">All Aims</option>
              <option value="A">A — Applications &amp; Issues</option>
              <option value="B">B — Hardware &amp; Software</option>
              <option value="C">C — Programming Basics</option>
            </select>
          </label>
          <label class="setup-label">Question Type
            <select id="practice-type">
              <option value="">All Types</option>
              <option value="mc">Multiple Choice</option>
              <option value="short">Short Answer</option>
              <option value="extended">Extended</option>
            </select>
          </label>
          <button class="btn primary" id="btn-start-practice">Start Session →</button>
        </div>
      </div>
      <div id="practice-card-area"></div>
    </div>
  `;
  if (preAim) $('#practice-aim').value = preAim;
  $('#btn-start-practice').addEventListener('click', startPractice);
}

function startPractice() {
  const aim = $('#practice-aim').value;
  const typeFilter = $('#practice-type').value;
  let pool = aim ? (questionData[aim]||[]) : [...(questionData.A||[]),...(questionData.B||[]),...(questionData.C||[])];

  // attach aim to each question so it survives pool mix
  ['A','B','C'].forEach(a => (questionData[a]||[]).forEach(q => { if(!q._aim) q._aim = a; }));

  if (typeFilter) {
    pool = pool.filter(q => {
      if (typeFilter==='mc') return isMcType(q.type);
      if (typeFilter==='short') return !isMcType(q.type) && !isExtendedType(q.type);
      if (typeFilter==='extended') return isExtendedType(q.type);
      return true;
    });
  }
  pool = pool.filter(isPracticeEligible);
  if (!pool.length) { $('#practice-card-area').innerHTML = '<p class="muted">No questions match those filters.</p>'; return; }

  // Shuffle
  practiceQueue = pool.slice().sort(()=>Math.random()-0.5);
  practiceIdx = 0;
  practiceXpAwarded = false;
  renderPracticeCard();
}

function loadPracticeQuestions() { startPractice(); }

function renderPracticeCard() {
  const area = $('#practice-card-area');
  if (!area) return;
  if (!practiceQueue.length) { area.innerHTML = '<p class="muted">No questions loaded. Click "Start Session".</p>'; return; }
  if (practiceIdx >= practiceQueue.length) { renderPracticeComplete(); return; }
  area.innerHTML = '';

  const q = practiceQueue[practiceIdx];
  const { max } = parseMarks(q.marks);
  const isMC = isMcType(q.type);
  const isExt = isExtendedType(q.type);
  const mcChoice = { value: null };
  let ta = null;

  // Card
  const card = document.createElement('div'); card.className = 'practice-card-one';

  // Progress bar
  const progWrap = document.createElement('div'); progWrap.className = 'practice-prog';
  progWrap.innerHTML = `<div class="practice-prog-track"><div class="practice-prog-fill" style="width:${practiceIdx/practiceQueue.length*100}%"></div></div><span class="practice-prog-label">Question ${practiceIdx+1} of ${practiceQueue.length}</span>`;
  card.appendChild(progWrap);

  // Header
  const hdr = document.createElement('div'); hdr.className = 'practice-q-header';
  const tagRow = document.createElement('div'); tagRow.className = 'practice-q-tags';
  const idTag = document.createElement('span'); idTag.className = 'tag id-tag'; idTag.textContent = q.id;
  const marksTag = document.createElement('span'); marksTag.className = 'tag marks-tag'; marksTag.textContent = `${max} mark${max!==1?'s':''}`;
  const typeTag = document.createElement('span'); typeTag.className = 'tag type-tag'; typeTag.textContent = isMC?'Multiple Choice':isExt?'Extended':'Short Answer';
  tagRow.appendChild(idTag); tagRow.appendChild(marksTag); tagRow.appendChild(typeTag);
  if (q._aim) { const aimTag=document.createElement('span'); aimTag.className='tag aim-tag'; aimTag.textContent='Aim '+q._aim; tagRow.appendChild(aimTag); }
  hdr.appendChild(tagRow); card.appendChild(hdr);

  // Scenario
  if (q.scenario) {
    const sc = document.createElement('div'); sc.className = 'practice-scenario';
    sc.innerHTML = `<strong>Scenario: </strong>${escapeHTML(q.scenario)}`;
    card.appendChild(sc);
  }

  // Question
  const qp = document.createElement('p'); qp.className = 'practice-question-text';
  qp.textContent = q.question;
  const marksNote = document.createElement('span'); marksNote.className = 'marks-bracket';
  marksNote.textContent = ` (${max})`;
  qp.appendChild(marksNote); card.appendChild(qp);

  // Input
  if (isMC) {
    card.appendChild(buildMcOptionsUI(q, mcChoice));
  } else {
    ta = document.createElement('textarea');
    ta.className = 'practice-textarea';
    ta.placeholder = isExt ? 'Write your extended response here…' : 'Type your answer here…';
    ta.rows = isExt ? 8 : 4;
    card.appendChild(ta);
  }

  // Action buttons
  const actions = document.createElement('div'); actions.className = 'practice-actions';

  const btnCheck = document.createElement('button'); btnCheck.className = 'btn primary';
  btnCheck.textContent = isMC ? 'Check answer' : 'Auto-mark';

  const btnExamine = document.createElement('button');
  btnExamine.className = 'btn btn-ai-examine';
  btnExamine.innerHTML = '<span class="ai-star">✦</span> AI Examiner';
  btnExamine.style.display = isMC ? 'none' : '';

  const btnReveal = document.createElement('button'); btnReveal.className = 'btn'; btnReveal.textContent = 'Reveal mark scheme';
  const btnPrev = document.createElement('button'); btnPrev.className = 'btn ghost'; btnPrev.textContent = '← Prev';
  const btnNext = document.createElement('button'); btnNext.className = 'btn'; btnNext.textContent = 'Next →';
  btnPrev.disabled = practiceIdx === 0;
  btnNext.disabled = practiceIdx >= practiceQueue.length - 1;

  actions.appendChild(btnCheck);
  if (!isMC) actions.appendChild(btnExamine);
  actions.appendChild(btnReveal);
  actions.appendChild(btnPrev);
  actions.appendChild(btnNext);
  card.appendChild(actions);

  // Feedback area
  const feedbackArea = document.createElement('div'); feedbackArea.className = 'practice-feedback-area';
  card.appendChild(feedbackArea);

  // Inline mark scheme (hidden)
  const msArea = document.createElement('div'); msArea.className = 'practice-ms-area'; msArea.style.display='none';
  msArea.appendChild(buildMarkSchemeBlock(q));
  card.appendChild(msArea);

  // Events
  btnReveal.addEventListener('click', () => {
    const open = msArea.style.display==='block';
    msArea.style.display = open?'none':'block';
    btnReveal.textContent = open?'Reveal mark scheme':'Hide mark scheme';
  });

  btnCheck.addEventListener('click', () => {
    if (isMC) {
      if (!mcChoice.value) { btnCheck.textContent='Pick an option first!'; setTimeout(()=>{btnCheck.textContent='Check answer';},1500); return; }
      feedbackArea.innerHTML = ''; feedbackArea.appendChild(buildMcResultUI(q, mcChoice.value));
    } else {
      const ans = ta.value.trim();
      if (!ans) { btnCheck.textContent='Write an answer first!'; setTimeout(()=>{btnCheck.textContent='Auto-mark';},1500); return; }
      feedbackArea.innerHTML = ''; feedbackArea.appendChild(buildAutoMarkUI(q, ans));
    }
    feedbackArea.scrollIntoView({behavior:'smooth',block:'nearest'});
    incrementCounter('ra10_practice_today', 1);
  });

  btnExamine.addEventListener('click', async () => {
    const ans = ta ? ta.value.trim() : '';
    if (!ans) {
      btnExamine.innerHTML = '<span class="ai-star">✦</span> Write an answer first!';
      setTimeout(() => { btnExamine.innerHTML = '<span class="ai-star">✦</span> AI Examiner'; }, 2000);
      return;
    }
    if (!window.RA10 || typeof RA10.examineAnswer !== 'function') {
      alert('AI Examiner is not available — please check you are logged in to RA10.');
      return;
    }
    // Use credit gate (mirrors Level 3 Unit 1)
    const allowed = await (window.ra10Gate ? ra10Gate('ai_mark') : Promise.resolve(true));
    if (!allowed) return;

    btnExamine.disabled = true;
    const origHtml = btnExamine.innerHTML;
    btnExamine.dataset.aiExamining = 'true';
    btnExamine.innerHTML = '<span class="ai-examiner-loading"><span class="ai-examiner-orb"></span><span>Examining your answer<span class="ai-examiner-dots">...</span></span></span>';
    try {
      const resp = await RA10.examineAnswer({ question: q, answer: ans });
      const aiResult = normaliseAiResult(resp && resp.result ? resp.result : null, q, ans);
      feedbackArea.innerHTML = '';
      if (aiResult) {
        feedbackArea.appendChild(buildAiAutoMarkUI(q, ans, aiResult));
      } else {
        feedbackArea.appendChild(buildAutoMarkUI(q, ans));
        feedbackArea.appendChild(el('p', { class: 'muted', style: 'margin-top:8px' }, 'AI response was invalid — local estimate shown.'));
      }
      feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      incrementCounter('ra10_practice_today', 1);
    } catch (err) {
      const msg = err && err.message ? String(err.message) : '';
      if (msg.includes('credit') || msg.includes('Credit')) {
        if (window.RA10 && typeof RA10.showPaywall === 'function') RA10.showPaywall('credits', 'ai_mark');
        else alert('Not enough credits for AI Examiner.');
      } else {
        alert('Could not connect to AI Examiner. Try again or check your connection.');
      }
    } finally {
      if (window._ra10RenderUnitCreditChip) { try { await _ra10RenderUnitCreditChip(); } catch(e) {} }
      if (window._updateSubjectBanner) { try { _updateSubjectBanner(); } catch(e) {} }
      btnExamine.disabled = false;
      delete btnExamine.dataset.aiExamining;
      btnExamine.innerHTML = origHtml;
    }
  });

  btnNext.addEventListener('click', () => { practiceIdx++; renderPracticeCard(); window.scrollTo(0,0); });
  btnPrev.addEventListener('click', () => { practiceIdx--; renderPracticeCard(); window.scrollTo(0,0); });

  area.appendChild(card);
}

function renderPracticeComplete() {
  const area = $('#practice-card-area');
  if (!area) return;
  if (!practiceXpAwarded && practiceQueue.length) {
    const xp = Math.min(practiceQueue.length * 10, 50);
    awardXP(xp, `+${xp} XP - Practice done!`);
    practiceXpAwarded = true;
  }
  area.innerHTML = `
    <div class="practice-complete">
      <div class="pc-icon">🎉</div>
      <h3>Session complete!</h3>
      <p>You worked through all ${practiceQueue.length} questions.</p>
      <button class="btn primary" onclick="startPractice()">Practice again</button>
      <button class="btn" onclick="switchTab('home')">Back to Dashboard</button>
    </div>
  `;
}

function awardXP(amount, message) {
  if (!window.RA10 || !RA10.isLoggedIn || !RA10.isLoggedIn()) return;
  const session = RA10.getSession ? RA10.getSession() : null;
  if (!session || !session.user || !session.user.id) return;

  fetch(SB_URL + '/rest/v1/rpc/increment_xp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SB_KEY,
      'Authorization': 'Bearer ' + session.access_token
    },
    body: JSON.stringify({ amount })
  }).then(res => {
    if (!res.ok) return;
    incrementCounter('ra10_xp_today', Number(amount || 0));
    showXPToast(message || ('+' + amount + ' XP'));
  }).catch(() => {});
}

function showXPToast(msg) {
  let t = document.getElementById('xp-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'xp-toast';
    t.style.cssText = 'position:fixed;bottom:80px;right:24px;z-index:99999;' +
      'background:#1c1430;color:#fff;padding:10px 18px;border-radius:999px;' +
      'font-weight:700;font-size:0.9rem;opacity:0;transition:opacity 0.3s;' +
      'pointer-events:none;box-shadow:0 8px 24px rgba(88,28,135,.28);';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(window._xpToastTimer);
  window._xpToastTimer = setTimeout(() => { t.style.opacity = '0'; }, 1400);
}

function addPracticeProgress(count) {
  incrementCounter('ra10_practice_today', count);
}

function renderQuiz() {
  const host = $('#main-content');
  host.innerHTML = `
    <div class="quiz-header">
      <h2>Quiz</h2>
      <div class="quiz-controls">
        <label>Learning Aim: 
          <select id="quiz-aim">
            <option value="">Random Questions</option>
            <option value="A">A: Applications & Issues</option>
            <option value="B">B: Hardware & Software</option>
            <option value="C">C: Programming Basics</option>
          </select>
        </label>
        <label>Number of Questions:
          <select id="quiz-length">
            <option value="5">5 questions</option>
            <option value="10">10 questions</option>
            <option value="20">20 questions</option>
          </select>
        </label>
        <button class="btn primary" onclick="startQuiz()">Start Quiz</button>
      </div>
    </div>
    <div id="quiz-container"></div>
  `;
}

function startQuiz() {
  const aim = $('#quiz-aim').value;
  const length = parseInt($('#quiz-length').value);
  
  let allQuestions = aim ? questionData[aim] : [...questionData.A, ...questionData.B, ...questionData.C];
  allQuestions = allQuestions.filter(q => q.type === 'multipleChoice' || q.type === 'multiple-choice').slice(0, length);
  
  if (allQuestions.length === 0) {
    $('#quiz-container').innerHTML = '<p class="muted">No MC questions available.</p>';
    return;
  }
  
  quizState = {
    questions: allQuestions,
    current: 0,
    answers: {},
    startTime: Date.now()
  };
  
  renderQuizQuestion();
}

function renderQuizQuestion() {
  if (!quizState) return;
  if (quizState.current >= quizState.questions.length) {
    renderQuizResults();
    return;
  }

  const q = quizState.questions[quizState.current];
  const opts = normaliseMcOptions(q);
  const prev = quizState.answers[quizState.current];
  const pct = Math.round((quizState.current / quizState.questions.length) * 100);

  const container = el('div', { class: 'quiz-card' });
  const progWrap = el('div', { class: 'quiz-progress' });
  const track = el('div', { class: 'quiz-prog-track' });
  const fill = el('div', { class: 'quiz-prog-fill' });
  fill.style.width = pct + '%';
  track.appendChild(fill);
  progWrap.appendChild(track);
  progWrap.appendChild(el('span', { class: 'quiz-prog-label' }, `Question ${quizState.current + 1} of ${quizState.questions.length}`));
  container.appendChild(progWrap);

  const tags = el('div', { class: 'quiz-q-tags' });
  tags.appendChild(el('span', { class: 'tag id-tag' }, q.id || ''));
  tags.appendChild(el('span', { class: 'tag marks-tag' }, `${q.marks} mark${q.marks==1?'':'s'}`));
  tags.appendChild(el('span', { class: 'tag aim-tag' }, `Aim ${q.learning_aim || ''}`));
  container.appendChild(tags);

  if (q.scenario) container.appendChild(el('div', { class: 'quiz-scenario' }, el('strong', null, 'Context: '), q.scenario));
  container.appendChild(el('p', { class: 'quiz-question-text' }, el('strong', null, q.question)));

  const optWrap = el('div', { class: 'quiz-options' });
  opts.forEach(opt => {
    const lbl = el('label', { class: 'quiz-option' + (prev === opt.letter ? ' selected' : '') });
    const inp = el('input', { type: 'radio', name: 'quiz-ans', value: opt.letter });
    if (prev === opt.letter) inp.checked = true;
    inp.addEventListener('change', () => {
      quizState.answers[quizState.current] = opt.letter;
      $$('.quiz-option').forEach(l => l.classList.remove('selected'));
      lbl.classList.add('selected');
    });
    lbl.appendChild(inp);
    lbl.appendChild(el('span', { class: 'quiz-opt-letter' }, opt.letter));
    lbl.appendChild(el('span', { class: 'quiz-opt-text' }, opt.text));
    optWrap.appendChild(lbl);
  });
  container.appendChild(optWrap);

  const nav = el('div', { class: 'quiz-nav' });
  const btnPrev = el('button', { class: 'btn ghost' }, '← Prev');
  if (quizState.current === 0) btnPrev.disabled = true;
  btnPrev.addEventListener('click', () => { quizState.current--; renderQuizQuestion(); });
  const isLast = quizState.current === quizState.questions.length - 1;
  const btnNext = el('button', { class: 'btn primary' }, isLast ? 'Finish →' : 'Next →');
  btnNext.addEventListener('click', () => { quizState.current++; renderQuizQuestion(); });
  nav.appendChild(btnPrev);
  nav.appendChild(btnNext);
  container.appendChild(nav);

  const host = $('#quiz-container');
  host.innerHTML = '';
  host.appendChild(container);
}

function nextQuizQuestion() {
  if (quizState.current < quizState.questions.length - 1) {
    quizState.current++;
    renderQuizQuestion();
  }
}

function prevQuizQuestion() {
  if (quizState.current > 0) {
    quizState.current--;
    renderQuizQuestion();
  }
}

function renderQuizResults() {
  let correct = 0;
  const rows = [];
  quizState.questions.forEach((q, idx) => {
    const userAns = quizState.answers[idx];
    const options = normaliseMcOptions(q);
    const optIndex = userAns ? userAns.charCodeAt(0) - 65 : -1;
    const chosen = options[optIndex];
    const isCorrect = chosen ? chosen.isCorrect : false;
    if (isCorrect) correct++;
    const correctOpt = options.find(o => o.isCorrect);
    rows.push({ q, userAns, isCorrect, correctOpt });
  });

  const percentage = Math.round((correct / quizState.questions.length) * 100);
  const emoji = percentage >= 80 ? '🌟' : percentage >= 60 ? '✅' : '📚';
  const msg = percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good effort!' : 'Keep practising!';
  const bestKey = 'ra10_best_quiz_it_l2_u2';
  const prevBest = Number(localStorage.getItem(bestKey) || 0);
  if (percentage > prevBest) localStorage.setItem(bestKey, String(percentage));

  const host = $('#quiz-container');
  host.innerHTML = '';
  const res = el('div', { class: 'quiz-results' });
  res.innerHTML = `
    <div class="qr-icon">${emoji}</div>
    <h3>Quiz Complete!</h3>
    <div class="qr-score"><span class="qr-val">${correct}</span><span class="qr-total"> / ${quizState.questions.length}</span></div>
    <div class="qr-pct">${percentage}%</div>
    <p class="qr-msg">${msg}</p>`;

  const reviewWrap = el('div', { class: 'qr-review' });
  reviewWrap.appendChild(el('h4', null, 'Answer Review'));
  rows.forEach(({ q, userAns, isCorrect, correctOpt }) => {
    const row = el('div', { class: 'qr-row ' + (isCorrect ? 'qr-correct' : 'qr-wrong') });
    const chosenOpt = normaliseMcOptions(q).find(o => o.letter === userAns);
    row.appendChild(el('span', { class: 'qr-tick' }, isCorrect ? '✓' : '✗'));
    row.appendChild(el('span', { class: 'qr-q-text' }, q.question));
    const ansLine = el('span', { class: 'qr-answer' });
    ansLine.innerHTML = userAns
      ? `You: <strong>${chosenOpt ? chosenOpt.letter+' — '+chosenOpt.text : userAns}</strong>`
      : 'Skipped';
    if (!isCorrect && correctOpt) {
      ansLine.innerHTML += ` · Correct: <strong>${correctOpt.letter} — ${correctOpt.text}</strong>`;
    }
    row.appendChild(ansLine);
    reviewWrap.appendChild(row);
  });
  res.appendChild(reviewWrap);

  const btnRow = el('div', { class: 'qr-btns' });
  const btnAgain = el('button', { class: 'btn primary' }, 'Take Another Quiz');
  btnAgain.addEventListener('click', renderQuiz);
  const btnHome = el('button', { class: 'btn ghost' }, 'Dashboard');
  btnHome.addEventListener('click', renderHome);
  btnRow.appendChild(btnAgain);
  btnRow.appendChild(btnHome);
  res.appendChild(btnRow);
  host.appendChild(res);
  awardXP(20, '+20 XP - Quiz complete!');
}

// ====== FLASHCARD ENGINE ======
async function loadFlashcardData() {
  if (flashcardData.length > 0) return true;
  try {
    flashcardData = await fetch('data/flashcards.json').then(r => r.json());
    return true;
  } catch(e) {
    console.error('Failed to load flashcards:', e);
    return false;
  }
}

function renderFlashcards() {
  const host = $('#main-content');
  if (!host) return;

  host.innerHTML = `
    <div class="flash-page">
      <div class="flash-topbar">
        <h2>Flashcards</h2>
        <div class="flash-filter">
          <button class="aim-filter-btn active" data-aim="" onclick="filterFlashcards('')">All (45)</button>
          <button class="aim-filter-btn" data-aim="A" onclick="filterFlashcards('A')">Aim A (15)</button>
          <button class="aim-filter-btn" data-aim="B" onclick="filterFlashcards('B')">Aim B (15)</button>
          <button class="aim-filter-btn" data-aim="C" onclick="filterFlashcards('C')">Aim C (15)</button>
        </div>
      </div>
      <div id="flash-progress-bar" class="flash-progress-bar"></div>
      <div id="flash-area" class="flash-area"><div class="flash-loading">Loading cards…</div></div>
    </div>
  `;

  loadFlashcardData().then(ok => {
    if (!ok) { $('#flash-area').innerHTML = '<p class="error">Failed to load flashcards.</p>'; return; }
    flashState.current = 0;
    flashState.flipped = false;
    flashXpAwarded = false;
    renderFlashcard();
    updateFlashProgress();
  });
}

function filterFlashcards(aim) {
  $$('.aim-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.aim === aim));
  flashState.aim = aim;
  flashState.current = 0;
  flashState.flipped = false;
  flashXpAwarded = false;
  renderFlashcard();
  updateFlashProgress();
}

function getFilteredCards() {
  return flashState.aim ? flashcardData.filter(c => c.aim === flashState.aim) : flashcardData;
}

function renderFlashcard() {
  const cards = getFilteredCards();
  const area = $('#flash-area');
  if (!area) return;

  if (!cards.length) { area.innerHTML = '<p class="muted">No cards for this aim.</p>'; return; }

  const idx = Math.min(flashState.current, cards.length - 1);
  const card = cards[idx];
  const isKnown = flashState.known.has(card.id);
  const isLearning = flashState.learning.has(card.id);
  const aimColours = { A: '#1a56db', B: '#7c3aed', C: '#0891b2' };
  const colour = aimColours[card.aim] || '#1a56db';

  area.innerHTML = `
    <div class="flash-counter">${idx + 1} <span>/ ${cards.length}</span></div>
    <div class="flashcard ${flashState.flipped ? 'flipped' : ''}" id="active-flashcard" onclick="flipCard()">
      <div class="flashcard-face flashcard-front">
        <div class="fc-aim-badge" style="background:${colour}">${escapeHTML(card.aim)}</div>
        <div class="fc-topic">${escapeHTML(card.topic || '')}</div>
        <div class="fc-term">${escapeHTML(card.term)}</div>
        <div class="fc-hint">Tap to reveal definition ↓</div>
      </div>
      <div class="flashcard-face flashcard-back">
        <div class="fc-aim-badge" style="background:${colour}">${escapeHTML(card.aim)}</div>
        <div class="fc-topic">${escapeHTML(card.topic || '')}</div>
        <div class="fc-definition">${escapeHTML(card.definition)}</div>
        <div class="fc-hint">↑ Tap to see term</div>
      </div>
    </div>
    <div class="flash-nav-row">
      <button class="btn flash-nav-btn" onclick="prevCard()" ${idx === 0 ? 'disabled' : ''}>← Prev</button>
      <div class="flash-mark-btns">
        <button class="btn ${isLearning ? 'mark-learning' : 'mark-neutral'}" onclick="markCard('learning')">📚 Still Learning</button>
        <button class="btn ${isKnown ? 'mark-known' : 'mark-neutral'}" onclick="markCard('known')">✓ Got It</button>
      </div>
      <button class="btn flash-nav-btn" onclick="nextCard()" ${idx >= cards.length - 1 ? 'disabled' : ''}>Next →</button>
    </div>
  `;
}

function flipCard() {
  flashState.flipped = !flashState.flipped;
  const card = $('#active-flashcard');
  if (card) card.classList.toggle('flipped', flashState.flipped);
}

function nextCard() {
  const cards = getFilteredCards();
  if (!flashXpAwarded && cards.length && flashState.current >= cards.length - 1) {
    awardXP(5, '+5 XP - Flashcards done!');
    flashXpAwarded = true;
    return;
  }
  if (flashState.current < cards.length - 1) {
    flashState.current++;
    flashState.flipped = false;
    renderFlashcard();
    updateFlashProgress();
  }
}

function prevCard() {
  if (flashState.current > 0) {
    flashState.current--;
    flashState.flipped = false;
    renderFlashcard();
    updateFlashProgress();
  }
}

function markCard(status) {
  const cards = getFilteredCards();
  const card = cards[flashState.current];
  if (!card) return;
  if (status === 'known') {
    flashState.known.add(card.id);
    flashState.learning.delete(card.id);
  } else {
    flashState.learning.add(card.id);
    flashState.known.delete(card.id);
  }
  localStorage.setItem('ra10_flash_known_it_l2_u2', String(flashState.known.size));
  if (flashState.current < cards.length - 1) {
    flashState.current++;
    flashState.flipped = false;
  }
  renderFlashcard();
  updateFlashProgress();
}

function updateFlashProgress() {
  const bar = $('#flash-progress-bar');
  if (!bar) return;
  const cards = getFilteredCards();
  const known = cards.filter(c => flashState.known.has(c.id)).length;
  const learning = cards.filter(c => flashState.learning.has(c.id)).length;
  const unseen = cards.length - known - learning;
  bar.innerHTML = `
    <div class="fp-labels">
      <span class="fp-known">✓ ${known} Known</span>
      <span class="fp-learning">📚 ${learning} Learning</span>
      <span class="fp-unseen">○ ${unseen} Unseen</span>
    </div>
    <div class="fp-track">
      <div class="fp-fill fp-fill-known" style="width:${cards.length ? (known/cards.length*100) : 0}%"></div>
      <div class="fp-fill fp-fill-learning" style="width:${cards.length ? (learning/cards.length*100) : 0}%; margin-left:${cards.length ? (known/cards.length*100) : 0}%"></div>
    </div>
  `;
}

// ====== BROWSE ALL QUESTIONS ======
let browseOpenRow = null;

function renderBrowse() {
  const host = $('#main-content');
  if (!host) return;
  const total = questionData.A.length + questionData.B.length + questionData.C.length;
  host.innerHTML = `
    <div class="browse-page">
      <div class="browse-header">
        <h2>All Questions</h2>
        <p class="browse-sub">Browse all ${total} questions with mark schemes. Click any row to expand.</p>
      </div>
      <div class="browse-filters">
        <input type="search" id="browse-search" class="browse-search" placeholder="Search questions, IDs, topics…">
        <select id="browse-aim" class="browse-select">
          <option value="">All Aims</option>
          <option value="A">Aim A — Applications &amp; Issues</option>
          <option value="B">Aim B — Hardware &amp; Software</option>
          <option value="C">Aim C — Programming Basics</option>
        </select>
        <select id="browse-type" class="browse-select">
          <option value="">All Types</option>
          <option value="mc">Multiple Choice</option>
          <option value="short">Short Answer</option>
          <option value="extended">Extended</option>
        </select>
        <button class="btn ghost" id="browse-clear">Clear</button>
      </div>
      <div class="browse-count-row"><span id="browse-count">Loading…</span></div>
      <div id="browse-list" class="browse-list"></div>
    </div>
  `;
  $('#browse-search').addEventListener('input', applyBrowseFilters);
  $('#browse-aim').addEventListener('change', applyBrowseFilters);
  $('#browse-type').addEventListener('change', applyBrowseFilters);
  $('#browse-clear').addEventListener('click', () => {
    $('#browse-search').value = '';
    $('#browse-aim').value = '';
    $('#browse-type').value = '';
    applyBrowseFilters();
  });
  applyBrowseFilters();
}

function applyBrowseFilters() {
  const search = ($('#browse-search') ? $('#browse-search').value.trim().toLowerCase() : '');
  const aim = $('#browse-aim') ? $('#browse-aim').value : '';
  const typeFilter = $('#browse-type') ? $('#browse-type').value : '';
  let list = [...questionData.A, ...questionData.B, ...questionData.C];
  if (aim) list = list.filter(q => q.learning_aim === aim);
  if (typeFilter === 'mc') list = list.filter(q => isMcType(q.type));
  else if (typeFilter === 'short') list = list.filter(q => q.type === 'short-answer' || q.type === 'short');
  else if (typeFilter === 'extended') list = list.filter(q => isExtendedType(q.type));
  if (search) {
    list = list.filter(q => {
      const blob = [q.question||'', q.scenario||'', q.id||'', q.topic||''].join(' ').toLowerCase();
      return search.split(/\s+/).filter(Boolean).every(t => blob.includes(t));
    });
  }
  const countEl = $('#browse-count');
  if (countEl) countEl.textContent = `${list.length} question${list.length === 1 ? '' : 's'}`;
  const wrap = $('#browse-list');
  if (!wrap) return;
  wrap.innerHTML = '';
  browseOpenRow = null;
  list.slice(0, 300).forEach(q => wrap.appendChild(buildBrowseRow(q)));
  if (list.length > 300) {
    wrap.appendChild(el('p', { class: 'muted', style: 'text-align:center;padding:16px;' },
      `Showing first 300 of ${list.length} — refine filters to see more.`));
  }
}

function buildBrowseRow(q) {
  const typeLabel = isMcType(q.type) ? 'Multiple Choice' : isExtendedType(q.type) ? 'Extended' : 'Short Answer';
  const marks = parseMarks(q.marks);
  const marksLabel = marks.min === marks.max ? `${marks.max} mark${marks.max===1?'':'s'}` : `${marks.min}–${marks.max} marks`;

  const row = el('div', { class: 'qrow' });
  const head = el('div', { class: 'qrow-head' });
  head.appendChild(el('div', { class: 'qrow-meta' },
    el('span', { class: 'tag id-tag' }, q.id || '—'),
    el('span', { class: 'tag aim-tag' }, `Aim ${q.learning_aim || ''}`),
    el('span', { class: 'tag type-tag' }, typeLabel),
    el('span', { class: 'tag marks-tag' }, marksLabel)
  ));
  const chevron = el('span', { class: 'qrow-chevron' }, '▼');
  head.appendChild(chevron);
  row.appendChild(head);

  // Question text preview in head
  const preview = el('div', { class: 'qrow-preview' }, q.question ? (q.question.length > 120 ? q.question.slice(0,120)+'…' : q.question) : '');
  row.appendChild(preview);

  // Body (hidden until open)
  const body = el('div', { class: 'qrow-body' });
  if (q.scenario) body.appendChild(el('p', { class: 'qrow-scenario' }, el('strong', null, 'Context: '), q.scenario));
  body.appendChild(el('p', { class: 'qrow-question' }, q.question, el('span', { class: 'marks-bracket' }, ` (${q.marks})`)));

  const ms = el('div', { class: 'qrow-ms' });
  ms.appendChild(el('h5', { class: 'qrow-ms-heading' }, 'Mark Scheme'));
  if (isMcType(q.type)) {
    const opts = normaliseMcOptions(q);
    const correct = opts.find(o => o.isCorrect);
    const ul = el('ul', { class: 'qrow-ms-opts' });
    opts.forEach(o => {
      const li = el('li', { class: o.isCorrect ? 'qrow-ms-opt-correct' : '' }, `${o.letter}. ${o.text}`);
      if (o.isCorrect) li.innerHTML += ' <strong>✓</strong>';
      ul.appendChild(li);
    });
    ms.appendChild(ul);
    if (q.markingGuidance) ms.appendChild(el('p', { class: 'qrow-ms-note' }, q.markingGuidance));
  } else {
    const points = getMsPoints(q);
    if (points.length) {
      const ul = el('ul', { class: 'qrow-ms-points' });
      points.forEach(p => ul.appendChild(el('li', null, p)));
      ms.appendChild(ul);
    } else if (q.markingGuidance) {
      ms.appendChild(el('p', { class: 'qrow-ms-note' }, q.markingGuidance));
    } else if (q.mark_scheme && q.mark_scheme.instruction) {
      ms.appendChild(el('p', { class: 'qrow-ms-note' }, q.mark_scheme.instruction));
    }
    const guidance = getMsGuidance(q);
    if (guidance) ms.appendChild(el('p', { class: 'qrow-ms-guidance' }, '💡 ' + guidance));
    if (q.mark_scheme && q.mark_scheme.do_not_accept) {
      ms.appendChild(el('p', { class: 'qrow-ms-dna' }, '✗ Do not accept: ' + q.mark_scheme.do_not_accept));
    }
  }
  body.appendChild(ms);

  const practiceBtn = el('button', { class: 'btn sm', style: 'margin-top:10px;' }, '→ Practise this question');
  practiceBtn.addEventListener('click', e => { e.stopPropagation(); selectAim(q.learning_aim || 'A'); });
  body.appendChild(practiceBtn);
  row.appendChild(body);

  head.addEventListener('click', () => {
    const isOpen = row.classList.contains('open');
    if (browseOpenRow && browseOpenRow !== row) {
      browseOpenRow.classList.remove('open');
      const prevChev = browseOpenRow.querySelector('.qrow-chevron');
      if (prevChev) prevChev.textContent = '▼';
    }
    row.classList.toggle('open', !isOpen);
    chevron.textContent = row.classList.contains('open') ? '▲' : '▼';
    browseOpenRow = row.classList.contains('open') ? row : null;
  });
  return row;
}

// ====== REVISION GUIDE ======
function renderGuide() {
  const host = $('#main-content');
  if (!host) return;

  host.innerHTML = `
    <div class="guide-shell">
      <aside class="guide-sidebar" id="guide-sidebar">
        <div class="guide-sidebar-hd">
          <div class="guide-toc-label">Revision Guide</div>
          <button class="guide-sb-toggle" type="button" onclick="toggleGuideSidebar()">Menu</button>
        </div>
        <div class="guide-toc-scroll" id="guide-toc-list">
          <button class="guide-toc-aim-link active" data-aim="A" onclick="switchGuideAim('A')">
            <span class="guide-toc-badge">A</span>
            <span class="guide-toc-name">Applications &amp; Issues</span>
          </button>
          <button class="guide-toc-aim-link" data-aim="B" onclick="switchGuideAim('B')">
            <span class="guide-toc-badge">B</span>
            <span class="guide-toc-name">Hardware &amp; Software</span>
          </button>
          <button class="guide-toc-aim-link" data-aim="C" onclick="switchGuideAim('C')">
            <span class="guide-toc-badge">C</span>
            <span class="guide-toc-name">Programming Basics</span>
          </button>
        </div>
      </aside>

      <div class="guide-main">
        <div class="guide-topbar">
          <div>
            <h2 id="guide-aim-title">Learning Aim A: Applications &amp; Issues</h2>
            <p id="guide-aim-subtitle">Exam-focused notes, key terms, and common pitfalls.</p>
          </div>
        </div>
        <div id="guide-body"></div>
      </div>
    </div>
  `;

  renderGuideAim('A');
}

function switchGuideAim(aim) {
  const subtitles = {
    A: 'Systems in context, cloud trade-offs, security and GDPR.',
    B: 'Hardware, memory, storage and software decisions for scenarios.',
    C: 'Programming fundamentals, logic, and algorithm interpretation.'
  };
  $$('.guide-toc-aim-link').forEach(t => t.classList.toggle('active', t.dataset.aim === aim));
  const titleEl = $('#guide-aim-title');
  const subEl = $('#guide-aim-subtitle');
  if (window.GuideContent && window.GuideContent.aims[aim] && titleEl) {
    titleEl.textContent = window.GuideContent.aims[aim].title;
  }
  if (subEl) subEl.textContent = subtitles[aim] || subtitles.A;
  renderGuideAim(aim);
}

function renderGuideAim(aim) {
  const body = $('#guide-body');
  if (!body) return;

  if (!window.GuideContent || !window.GuideContent.aims[aim]) {
    body.innerHTML = '<p class="muted">Guide content not available.</p>';
    return;
  }

  const aimData = window.GuideContent.aims[aim];
  const sectionsHtml = aimData.sections.map((section, i) => {
    const heading = String(section.heading || 'Topic').trim();
    const codeMatch = heading.match(/^([A-Z](?:\d+(?:\.\d+)?(?:-[A-Z]?\d+(?:\.\d+)?)?)?)\.?\s*(.*)$/);
    const code = codeMatch ? codeMatch[1] : 'Topic';
    const name = codeMatch ? (codeMatch[2] || heading) : heading;
    const isFirst = i === 0;
    return `
      <article class="guide-topic ${isFirst ? 'open' : ''}">
        <button class="guide-topic-hd" onclick="toggleGuideTopic(this)">
          <span class="guide-topic-code">${escapeHTML(code)}</span>
          <span class="guide-topic-name">${escapeHTML(name)}</span>
          <span class="guide-topic-chevron">▼</span>
        </button>
        <div class="guide-topic-body">
          ${formatGuideContent(section.content)}
        </div>
      </article>
    `;
  }).join('');

  body.innerHTML = `
    <section class="guide-aim-section" id="guide-aim-${escapeHTML(aim)}">
      ${sectionsHtml}
    </section>
  `;
}

function toggleGuideTopic(btn) {
  const topic = btn.closest('.guide-topic');
  if (!topic) return;
  topic.classList.toggle('open');
}

function toggleGuideSidebar() {
  const sidebar = $('#guide-sidebar');
  if (!sidebar) return;
  sidebar.classList.toggle('sb-open');
}

function formatGuideContent(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let html = '';
  let inList = false;
  let inOrdered = false;

  function closeLists() {
    if (inList) { html += '</ul>'; inList = false; }
    if (inOrdered) { html += '</ol>'; inOrdered = false; }
  }

  for (const line of lines) {
    if (line.startsWith('- ')) {
      if (inOrdered) { html += '</ol>'; inOrdered = false; }
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${escapeHTML(line.slice(2))}</li>`;
    } else if (/^\d+\.\s+/.test(line)) {
      if (inList) { html += '</ul>'; inList = false; }
      if (!inOrdered) { html += '<ol>'; inOrdered = true; }
      html += `<li>${escapeHTML(line.replace(/^\d+\.\s+/, ''))}</li>`;
    } else {
      closeLists();
      if (line.endsWith(':') && line.length < 70) {
        html += `<p class="guide-subheading">${escapeHTML(line)}</p>`;
      } else {
        html += `<p>${escapeHTML(line)}</p>`;
      }
    }
  }
  closeLists();
  return html;
}

// ====== NAVIGATION ======
function switchTab(tab) {
  // Update nav links
  $$('.tab').forEach(l => l.classList.remove('active'));
  const activeLink = $$(`.tab`).find(l => l.dataset.tab === tab);
  if (activeLink) activeLink.classList.add('active');
  
  switch(tab) {
    case 'home':     renderHome(); break;
    case 'practice': renderPractice(); break;
    case 'quiz':     renderQuiz(); break;
    case 'flash':    renderFlashcards(); break;
    case 'guide':    renderGuide(); break;
    case 'browse':   renderBrowse(); break;
  }
}

function selectAim(aim) {
  switchTab('practice');
  setTimeout(() => {
    const sel = $('#practice-aim');
    if (sel) { sel.value = aim; startPractice(); }
  }, 50);
}

// ====== INITIALIZATION ======
async function init() {
  const loaded = await loadQuestionData();
  if (!loaded) {
    $('#main-content').innerHTML = '<p class="error">Failed to load question data</p>';
    return;
  }
  
  loadFlashcardData().catch(() => {});
  renderHome();
  setupNavigation();
  markTodayVisitForStreak();
}

function setupNavigation() {
  $$('.tab').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const tab = this.dataset.tab;
      switchTab(tab);
    });
  });
}

window.addEventListener('DOMContentLoaded', init);
window.switchTab = switchTab;
window.selectAim = selectAim;
window.loadPracticeQuestions = loadPracticeQuestions;
window.startPractice = startPractice;
window.renderPracticeCard = renderPracticeCard;
window.renderBrowse = renderBrowse;
window.applyBrowseFilters = applyBrowseFilters;
window.filterFlashcards = filterFlashcards;
window.flipCard = flipCard;
window.nextCard = nextCard;
window.prevCard = prevCard;
window.markCard = markCard;
window.switchGuideAim = switchGuideAim;
window.toggleSection = toggleGuideTopic;
window.toggleGuideTopic = toggleGuideTopic;
window.toggleGuideSidebar = toggleGuideSidebar;
window.startQuiz = startQuiz;
window.nextQuizQuestion = nextQuizQuestion;
window.prevQuizQuestion = prevQuizQuestion;

})();
