/* BTEC IT Unit 3 — Website Development — App logic */
'use strict';

const RA10_UNIT_SUBJECT = 'IT';
const RA10_SUBJECT_BONUS = 300;
const RA10_ACTION_COSTS = {
  practice_question: 1,
  quiz_question: 1,
  revision_guide_full: 10,
  flashcard_flip: 0,
  wireframe_export: 1,
  sitemap_export: 1,
  ai_assigner_hint: 3,
  ai_assigner_mark: 8,
};

/* ═══════════════════════════════════════════════
   TAB SWITCHING
═══════════════════════════════════════════════ */
const VIEW_IDS = ['dashboard', 'guide', 'mcq', 'quiz', 'flash', 'wireframe', 'sitemap', 'editor', 'assignment', 'spec'];

function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
  VIEW_IDS.forEach((id) => {
    const el = document.getElementById('view-' + id);
    if (el) el.classList.toggle('active', id === name);
  });
  if (name === 'guide') renderGuideAccessGate();
  if (name === 'mcq') renderMcqBrowse();
  if (name === 'quiz' && !window._quizSession) renderQuizIntro();
  if (name === 'flash') startFlashcards();
  if (name === 'wireframe') initWireframeTool();
  if (name === 'sitemap') initSitemapTool();
  if (name === 'editor') initCodeEditor();
  if (name === 'assignment') renderAssignmentHub();
  if (name === 'spec') renderSpec();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.goto));
  });
});

/* ═══════════════════════════════════════════════
   CREDIT GATING (subject-tier aware, mirrors other units)
═══════════════════════════════════════════════ */
function _ra10SubjectStateKey(userId) {
  return 'ra10_subject_credit_state:' + (userId || 'anon');
}
function _ra10ReadSubjectState(userId) {
  try { return JSON.parse(localStorage.getItem(_ra10SubjectStateKey(userId)) || 'null'); } catch (e) { return null; }
}
function _ra10WriteSubjectState(userId, state) {
  try { localStorage.setItem(_ra10SubjectStateKey(userId), JSON.stringify(state)); } catch (e) {}
}

function _ra10GetActionCost(action) {
  return RA10_ACTION_COSTS[action] || 0;
}

function _ra10GetUnitCreditsContext() {
  const profile = (window.RA10 && typeof RA10.getProfile === 'function') ? RA10.getProfile() : null;
  const tier = (window.RA10 && typeof RA10.getTier === 'function') ? RA10.getTier() : 'free';
  const breakdown = (window.RA10 && typeof RA10.getCreditBreakdown === 'function') ? RA10.getCreditBreakdown() : null;
  const totalCredits = breakdown ? Number(breakdown.totalCredits || 0) : (window.RA10 ? Number(RA10.getCredits()) || 0 : 0);
  const storedCredits = breakdown ? Number(breakdown.storedCredits || 0) : totalCredits;
  const examBonusRemaining = breakdown ? Number(breakdown.examBonusRemaining || 0) : 0;
  const ownedSubjects = (profile && Array.isArray(profile.unlocked_subjects)) ? profile.unlocked_subjects : [];
  if (tier !== 'subject') {
    return { isSubjectTier: false, ownsCurrentSubject: true, usableCredits: totalCredits, totalCredits, storedCredits, examBonusRemaining, ownedSubjects, baselineRemaining: totalCredits };
  }
  const ownsCurrentSubject = ownedSubjects.includes(RA10_UNIT_SUBJECT);
  return { isSubjectTier: true, ownsCurrentSubject, usableCredits: storedCredits, totalCredits, storedCredits, examBonusRemaining, ownedSubjects, baselineRemaining: storedCredits, subjectCreditsRemaining: ownsCurrentSubject ? RA10_SUBJECT_BONUS : 0 };
}

async function ra10Gate(action) {
  if (!window.RA10) { alert('Loading, please try again in a moment.'); return false; }
  if (RA10.isOwner()) return true;
  if (!RA10.isLoggedIn()) {
    const result = await RA10.guestGate(action, 3, RA10.showPaywall);
    return result === true;
  }
  const ctx = _ra10GetUnitCreditsContext();
  const cost = _ra10GetActionCost(action);
  if (ctx.usableCredits < cost) {
    RA10.showPaywall('credits', action);
    return false;
  }
  return await RA10.gate(action, RA10.showPaywall);
}

function updateCostLabels() {
  const hide = window.RA10 && (RA10.isOwner() || (RA10.getTier && ['ultra', 'owner'].includes(RA10.getTier())));
  document.querySelectorAll('.ra10-cost-label').forEach((el) => { el.style.display = hide ? 'none' : ''; });
}

/* ═══════════════════════════════════════════════
   CREDIT CHIP + SUBJECT BANNER
═══════════════════════════════════════════════ */
const RA10_CREDIT_CHIP_ID = 'unit3-credit-chip';

async function _ra10RenderUnitCreditChip() {
  if (!window.RA10) return;
  await RA10.renderCreditChip(RA10_CREDIT_CHIP_ID);
}

window._updateSubjectBanner = function () {
  const banner = document.getElementById('ra10-subject-banner');
  if (!banner || !window.RA10) return;
  const ctx = _ra10GetUnitCreditsContext();
  if (!ctx.isSubjectTier) { banner.innerHTML = ''; return; }
  if (ctx.ownsCurrentSubject) {
    banner.innerHTML = '<div class="line-main">Usable now on Website Development: ' + ctx.usableCredits + ' credits</div><div class="line-sub">Includes your IT subject credits and universal credits.</div>';
  } else {
    const ownedText = ctx.ownedSubjects.length ? ctx.ownedSubjects.join(', ') : 'a different subject';
    banner.innerHTML = '<div class="line-main">Usable now on Website Development: ' + ctx.usableCredits + ' credits</div><div class="line-sub">You purchased ' + ownedText + '. Only universal credits can be spent here.</div>';
  }
};

function _ra10RenderUnitAvatar() {
  const btn = document.getElementById('unit-account-avatar');
  if (!btn || !window.RA10) return;
  btn.innerHTML = '';
  if (!RA10.isLoggedIn()) { btn.textContent = '?'; btn.setAttribute('title', 'Sign in'); return; }
  const profile = RA10.getProfile() || {};
  const rawName = String(profile.display_name || profile.full_name || profile.email || 'User').trim();
  const initials = rawName.split(/\s+/).filter(Boolean).map((part) => part.charAt(0)).join('').slice(0, 2).toUpperCase() || 'U';
  const imageUrl = String(profile.profile_pic_url || profile.avatar_url || '').trim();
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl; img.alt = ''; img.loading = 'lazy';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
    img.onerror = function () { btn.innerHTML = ''; btn.textContent = initials; };
    btn.appendChild(img);
  } else {
    btn.textContent = initials;
  }
  btn.setAttribute('title', rawName);
}

/* ═══════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════ */
function renderDashboard() {
  const revised = (() => { try { return JSON.parse(localStorage.getItem('ra10-guide-revised-IT-u3') || '{}'); } catch (e) { return {}; } })();
  const aimsRevised = ['A', 'B'].filter((l) => revised[l]).length;
  const statsHost = document.getElementById('dash-stats');
  if (statsHost) {
    statsHost.innerHTML = [
      ['Aims revised', aimsRevised + ' / 2'],
      ['MCQs available', (MCQS || []).length],
      ['Flashcards', (FLASHCARDS || []).length],
      ['Assignment tasks', '3'],
    ].map(([k, v]) => '<div class="stat-card"><b>' + v + '</b><span>' + k + '</span></div>').join('');
  }
}

/* ═══════════════════════════════════════════════
   GUIDE (THEORY)
═══════════════════════════════════════════════ */
function isGuideFullUnlocked() {
  try {
    const exp = Number(localStorage.getItem('ra10_u3_guide_unlock_expiry') || 0);
    return exp > Date.now();
  } catch (e) { return false; }
}
function setGuideFullUnlocked() {
  const until = Date.now() + 1000 * 60 * 60 * 24 * 365; // effectively permanent (1yr rolling)
  localStorage.setItem('ra10_u3_guide_unlock_expiry', String(until));
}

window.onGuideUnlockClick = async function () {
  const ok = await ra10Gate('revision_guide_full');
  if (!ok) return;
  setGuideFullUnlocked();
  window.__u3GuideUnlocked = true;
  if (window.initComprehensiveGuide) window.initComprehensiveGuide();
  await _ra10RenderUnitCreditChip();
};

function renderGuideAccessGate() {
  window.__u3GuideUnlocked = isGuideFullUnlocked() || (window.RA10 && RA10.isOwner && RA10.isOwner());
  if (window.initComprehensiveGuide) window.initComprehensiveGuide();
}

/* ═══════════════════════════════════════════════
   MCQ PRACTICE
═══════════════════════════════════════════════ */
let mcqQueue = [];
let mcqIndex = 0;
let mcqScore = 0;

function renderMcqBrowse() {
  const host = document.getElementById('mcq-browse-list');
  if (!host) return;
  const aimFilter = document.getElementById('mcq-filter-aim');
  const aim = aimFilter ? aimFilter.value : '';
  const rows = (MCQS || []).filter((q) => !aim || q.learning_aim === aim);
  host.innerHTML = rows.map((q) =>
    '<div class="qrow"><span class="tag">' + q.learning_aim + '</span><span class="tag">' + esc(q.topic || '') + '</span><span class="qtxt">' + esc(q.question) + '</span></div>'
  ).join('') || '<p style="color:var(--muted)">No questions match this filter.</p>';
}

async function startMcqPractice() {
  const ok = await ra10Gate('practice_question');
  if (!ok) return;
  const aimFilter = document.getElementById('mcq-filter-aim');
  const aim = aimFilter ? aimFilter.value : '';
  mcqQueue = shuffle((MCQS || []).filter((q) => !aim || q.learning_aim === aim));
  mcqIndex = 0;
  mcqScore = 0;
  if (!mcqQueue.length) { alert('No questions available for this filter.'); return; }
  switchTab('mcq');
  document.getElementById('mcq-browse-panel').classList.add('hidden');
  document.getElementById('mcq-play-panel').classList.remove('hidden');
  renderMcqCard();
}

function renderMcqCard() {
  const host = document.getElementById('mcq-play-panel');
  if (mcqIndex >= mcqQueue.length) {
    host.innerHTML = '<div class="mcq-card"><div id="quiz-results"><div class="score-big">' + mcqScore + ' / ' + mcqQueue.length + '</div><p>Practice complete!</p><button class="btn primary" id="mcq-restart">Practise again</button> <button class="btn ghost" data-goto="dashboard">Back to dashboard</button></div></div>';
    document.getElementById('mcq-restart')?.addEventListener('click', startMcqPractice);
    document.querySelectorAll('#mcq-play-panel [data-goto]').forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.goto)));
    return;
  }
  const q = mcqQueue[mcqIndex];
  host.innerHTML = '' +
    '<div class="mcq-card">' +
    '  <div class="mcq-progress">Question ' + (mcqIndex + 1) + ' of ' + mcqQueue.length + ' · ' + esc(q.topic || '') + '</div>' +
    '  <div class="mcq-question">' + esc(q.question) + '</div>' +
    '  <div class="mcq-options">' + q.options.map((o) =>
      '<div class="mcq-opt" data-letter="' + o.label + '"><span class="letter">' + o.label + '</span><span>' + esc(o.text) + '</span></div>'
    ).join('') + '</div>' +
    '  <div class="mcq-explain" id="mcq-explain"></div>' +
    '  <div class="mcq-actions"><button class="btn ghost" id="mcq-prev">← Prev</button><button class="btn primary" id="mcq-next" disabled>Next →</button></div>' +
    '</div>';

  let answered = false;
  host.querySelectorAll('.mcq-opt').forEach((opt) => {
    opt.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const chosen = opt.dataset.letter;
      const correct = q.mark_scheme && q.mark_scheme.answer;
      host.querySelectorAll('.mcq-opt').forEach((o) => {
        if (o.dataset.letter === correct) o.classList.add('correct');
        else if (o.dataset.letter === chosen && chosen !== correct) o.classList.add('incorrect');
      });
      if (chosen === correct) mcqScore++;
      const explainEl = document.getElementById('mcq-explain');
      explainEl.textContent = (q.mark_scheme && q.mark_scheme.explanation) || '';
      explainEl.classList.add('show');
      document.getElementById('mcq-next').disabled = false;
    });
  });
  document.getElementById('mcq-next').addEventListener('click', () => { mcqIndex++; renderMcqCard(); });
  document.getElementById('mcq-prev').addEventListener('click', () => { if (mcqIndex > 0) { mcqIndex--; renderMcqCard(); } });
}

/* ═══════════════════════════════════════════════
   QUICK QUIZ
═══════════════════════════════════════════════ */
let quizQueue = [];
let quizIndex = 0;
let quizScore = 0;

function renderQuizIntro() {
  const host = document.getElementById('view-quiz');
  if (!host) return;
}

async function startQuiz() {
  const ok = await ra10Gate('quiz_question');
  if (!ok) return;
  quizQueue = shuffle((QUIZ || []).slice());
  quizIndex = 0;
  quizScore = 0;
  window._quizSession = true;
  renderQuizCard();
}

function renderQuizCard() {
  const host = document.getElementById('quiz-card-host');
  if (!host) return;
  if (quizIndex >= quizQueue.length) {
    host.innerHTML = '<div class="mcq-card"><div id="quiz-results"><div class="score-big">' + quizScore + ' / ' + quizQueue.length + '</div><p>Quiz complete!</p><button class="btn primary" id="quiz-restart">Play again</button></div></div>';
    document.getElementById('quiz-restart')?.addEventListener('click', () => { window._quizSession = false; startQuiz(); });
    return;
  }
  const q = quizQueue[quizIndex];
  host.innerHTML = '' +
    '<div class="mcq-card">' +
    '  <div class="mcq-progress">Question ' + (quizIndex + 1) + ' of ' + quizQueue.length + '</div>' +
    '  <div class="mcq-question">' + esc(q.question) + '</div>' +
    '  <div class="mcq-options">' + q.choices.map((c, i) =>
      '<div class="mcq-opt" data-idx="' + i + '"><span class="letter">' + String.fromCharCode(65 + i) + '</span><span>' + esc(c) + '</span></div>'
    ).join('') + '</div>' +
    '  <div class="mcq-explain" id="quiz-explain"></div>' +
    '  <div class="mcq-actions"><span></span><button class="btn primary" id="quiz-next" disabled>Next →</button></div>' +
    '</div>';
  let answered = false;
  host.querySelectorAll('.mcq-opt').forEach((opt) => {
    opt.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const chosen = Number(opt.dataset.idx);
      host.querySelectorAll('.mcq-opt').forEach((o) => {
        const idx = Number(o.dataset.idx);
        if (idx === q.correct_index) o.classList.add('correct');
        else if (idx === chosen) o.classList.add('incorrect');
      });
      if (chosen === q.correct_index) quizScore++;
      const explainEl = document.getElementById('quiz-explain');
      explainEl.textContent = q.explanation || '';
      explainEl.classList.add('show');
      document.getElementById('quiz-next').disabled = false;
    });
  });
  document.getElementById('quiz-next').addEventListener('click', () => { quizIndex++; renderQuizCard(); });
}

/* ═══════════════════════════════════════════════
   FLASHCARDS
═══════════════════════════════════════════════ */
let flashQueue = [];
let flashIndex = 0;
let flashFlipped = false;

function startFlashcards() {
  flashQueue = shuffle((FLASHCARDS || []).slice());
  flashIndex = 0;
  flashFlipped = false;
  renderFlashCard();
}
function renderFlashCard() {
  const stage = document.getElementById('flash-stage');
  const progress = document.getElementById('flash-progress');
  if (!stage || !flashQueue.length) return;
  const card = flashQueue[flashIndex];
  stage.innerHTML = '<div class="flash-wrap"><div class="flash-card" id="flash-card-el"><span class="side-label">' + (flashFlipped ? 'Answer' : 'Question') + '</span><div>' + esc(flashFlipped ? card.back : card.front) + '</div></div></div>';
  if (progress) progress.textContent = 'Card ' + (flashIndex + 1) + ' of ' + flashQueue.length + ' · click card to flip';
  document.getElementById('flash-card-el').addEventListener('click', () => { flashFlipped = !flashFlipped; renderFlashCard(); });
}
function flashNav(dir) {
  flashIndex = Math.max(0, Math.min(flashQueue.length - 1, flashIndex + dir));
  flashFlipped = false;
  renderFlashCard();
}

/* ═══════════════════════════════════════════════
   SPEC TAB
═══════════════════════════════════════════════ */
function renderSpec() {
  const host = document.getElementById('spec-content');
  if (!host || !window.SPEC) return;
  host.innerHTML = ['A', 'B'].map((letter) => {
    const aim = window.SPEC[letter];
    const rows = aim.topics.map((t) => {
      const count = (MCQS || []).filter((q) => q.topic && q.topic.startsWith(t.code)).length;
      return '<div class="qrow"><span class="tag">' + t.code + '</span><span class="qtxt">' + esc(t.name) + '</span><span class="tag">' + count + ' Qs</span></div>';
    }).join('');
    return '<div class="section-block"><div class="section-block-head"><h2>Aim ' + letter + ' — ' + esc(aim.short) + '</h2></div><p style="color:var(--ink-2);font-size:13px;margin-top:-6px">' + esc(aim.title) + '</p><div class="qlist">' + rows + '</div></div>';
  }).join('');
}

/* ═══════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════ */
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
onDataReady(() => {
  renderDashboard();
  renderMcqBrowse();
  renderSpec();
});

function waitForRA10Sdk(cb, tries) {
  tries = tries || 0;
  if (window.RA10 && typeof RA10.init === 'function') { cb(); }
  else if (tries < 50) { setTimeout(() => waitForRA10Sdk(cb, tries + 1), 100); }
}

waitForRA10Sdk(async () => {
  try { await RA10.init(); } catch (e) { console.warn(e); }
  await _ra10RenderUnitCreditChip();
  _ra10RenderUnitAvatar();
  window._updateSubjectBanner();
  updateCostLabels();
  renderDashboard();
  RA10.on('authchange', async () => { await _ra10RenderUnitCreditChip(); _ra10RenderUnitAvatar(); window._updateSubjectBanner(); updateCostLabels(); });
  RA10.on('creditschange', async () => { await _ra10RenderUnitCreditChip(); window._updateSubjectBanner(); updateCostLabels(); });
});
