/* BTEC IT Unit 3 — Revise modes: MCQ browser, quick quiz, flashcards */
(function () {
  'use strict';

  let mode = 'mcq';
  let flashIdx = 0;
  let flashKnown = {};
  let quizState = null;

  const FLASH_KEY = 'ra10_u3_flash_known';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function aimChip(aim) {
    return '<span class="chip aim-' + esc(aim) + '">Aim ' + esc(aim) + '</span>';
  }

  /* ── Mode switcher ─────────────────────────────────────── */
  function bindPicker() {
    document.querySelectorAll('.revise-pick-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        mode = btn.dataset.mode;
        document.querySelectorAll('.revise-pick-card').forEach(function (b) { b.classList.toggle('active', b === btn); });
        renderControls();
        renderStage();
      });
    });
  }

  function renderControls() {
    const host = document.getElementById('revise-controls');
    if (!host) return;
    if (mode === 'mcq') {
      host.innerHTML =
        '<label for="mcq-aim" class="muted small">Filter by aim:</label>' +
        '<select id="mcq-aim"><option value="">All aims</option><option value="A">Aim A</option><option value="B">Aim B</option><option value="C">Aim C</option></select>' +
        '<span class="muted" id="mcq-count"></span>';
      const sel = document.getElementById('mcq-aim');
      if (sel) sel.addEventListener('change', renderStage);
    } else if (mode === 'quiz') {
      host.innerHTML =
        '<button class="btn primary" id="quiz-start">Start 12-question quiz<span class="ra10-cost-label">1 credit per session</span></button>' +
        '<span class="muted">Score shown at the end with explanations.</span>';
      document.getElementById('quiz-start').addEventListener('click', startQuiz);
    } else {
      host.innerHTML =
        '<span class="muted">' + flashKnownCount() + ' / ' + FLASHCARDS.length + ' known</span>' +
        '<button class="btn" id="flash-shuffle">Shuffle</button>' +
        '<button class="btn ghost" id="flash-reset">Reset progress</button>';
      document.getElementById('flash-shuffle').addEventListener('click', function () { shuffleFlash(); renderStage(); });
      document.getElementById('flash-reset').addEventListener('click', function () { flashKnown = {}; saveKnown(); flashIdx = 0; renderControls(); renderStage(); });
    }
  }

  function renderStage() {
    const host = document.getElementById('revise-stage');
    if (!host) return;
    if (mode === 'mcq') renderMcq(host);
    else if (mode === 'quiz') renderQuizIntro(host);
    else renderFlash(host);
  }

  /* ── MCQ ───────────────────────────────────────────────── */
  function renderMcq(host) {
    const aimSel = document.getElementById('mcq-aim');
    const aim = aimSel ? aimSel.value : '';
    const list = aim ? MCQS.filter(function (q) { return q.aim === aim; }) : MCQS.slice();
    const countEl = document.getElementById('mcq-count');
    if (countEl) countEl.textContent = list.length + ' question' + (list.length === 1 ? '' : 's');
    if (!list.length) { host.innerHTML = '<p class="muted">No questions for this aim yet.</p>'; return; }
    host.innerHTML = list.map(function (q, i) {
      return `
<div class="mc-card" data-i="${i}">
  <div class="mc-meta">${aimChip(q.aim)}<span class="chip">${esc(q.topic)}</span></div>
  <div class="mc-q">${esc(q.q)}</div>
  <div class="mc-opts">
    ${q.options.map(function (opt, oi) {
        return `<button class="mc-opt" data-oi="${oi}"><span class="opt-letter">${String.fromCharCode(65 + oi)}</span><span>${esc(opt)}</span></button>`;
      }).join('')}
  </div>
  <div class="mc-expl hidden"></div>
</div>`;
    }).join('');

    host.querySelectorAll('.mc-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const card = btn.closest('.mc-card');
        if (card.dataset.answered) return;
        card.dataset.answered = '1';
        const q = list[Number(card.dataset.i)];
        const chosen = Number(btn.dataset.oi);
        card.querySelectorAll('.mc-opt').forEach(function (b) {
          const oi = Number(b.dataset.oi);
          b.disabled = true;
          if (oi === q.answer) b.classList.add('correct');
          else if (oi === chosen) b.classList.add('wrong');
        });
        const expl = card.querySelector('.mc-expl');
        expl.classList.remove('hidden');
        expl.classList.add(chosen === q.answer ? 'ok' : 'no');
        expl.innerHTML = (chosen === q.answer ? '<strong>Correct!</strong> ' : '<strong>Not quite.</strong> ') + esc(q.why);
      });
    });
  }

  /* ── Quiz ──────────────────────────────────────────────── */
  function renderQuizIntro(host) {
    host.innerHTML = '<div class="quiz-stage"><p class="muted" style="margin:0">12 mixed knowledge-check questions across Aims A, B and C. Choose an answer — you get instant feedback and a score at the end.</p></div>';
  }

  async function startQuiz() {
    const ok = await window.ra10GateCheck('quiz_question');
    if (!ok) return;
    const pool = QUIZ.slice();
    // shuffle
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    quizState = { pool: pool.slice(0, 12), idx: 0, correct: 0, done: false };
    renderQuizCard();
  }

  function renderQuizCard() {
    const host = document.getElementById('revise-stage');
    if (!host || !quizState) return;
    if (quizState.done) { renderQuizResults(host); return; }
    const q = quizState.pool[quizState.idx];
    const pct = (quizState.idx / quizState.pool.length) * 100;
    host.innerHTML = `
<div class="quiz-stage">
  <div class="quiz-progress-bar"><span style="width:${pct}%"></span></div>
  <div class="mc-meta">${aimChip(q.aim)}<span class="chip">${esc(q.topic)}</span><span class="muted small" style="margin-left:auto">Question ${quizState.idx + 1} of ${quizState.pool.length} · Score ${quizState.correct}</span></div>
  <div class="mc-q">${esc(q.q)}</div>
  <div class="mc-opts">
    ${q.options.map(function (opt, oi) { return `<button class="mc-opt" data-oi="${oi}"><span class="opt-letter">${String.fromCharCode(65 + oi)}</span><span>${esc(opt)}</span></button>`; }).join('')}
  </div>
  <div class="mc-expl hidden"></div>
</div>`;
    host.querySelectorAll('.mc-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (quizState.revealed) return;
        quizState.revealed = true;
        const chosen = Number(btn.dataset.oi);
        const correct = chosen === q.answer;
        if (correct) quizState.correct++;
        host.querySelectorAll('.mc-opt').forEach(function (b) {
          const oi = Number(b.dataset.oi);
          b.disabled = true;
          if (oi === q.answer) b.classList.add('correct');
          else if (oi === chosen) b.classList.add('wrong');
        });
        const expl = host.querySelector('.mc-expl');
        expl.classList.remove('hidden');
        expl.classList.add(correct ? 'ok' : 'no');
        expl.innerHTML = (correct ? '<strong>Correct!</strong> ' : '<strong>Not quite.</strong> ') + esc(q.why) +
          '<div style="margin-top:10px"><button class="btn primary" id="quiz-next">' + (quizState.idx + 1 >= quizState.pool.length ? 'See results' : 'Next question') + '</button></div>';
        document.getElementById('quiz-next').addEventListener('click', function () {
          quizState.idx++;
          quizState.revealed = false;
          if (quizState.idx >= quizState.pool.length) quizState.done = true;
          renderQuizCard();
        });
      });
    });
  }

  function renderQuizResults(host) {
    const total = quizState.pool.length;
    const correct = quizState.correct;
    const pct = Math.round(correct / total * 100);
    const msg = pct === 100 ? 'Perfect — every question right! 🎉' : pct >= 75 ? 'Great work — you know your stuff!' : pct >= 50 ? 'Good start — review the guide for the ones you missed.' : 'Keep going — re-read the study guide, then retry.';
    host.innerHTML = `
<div class="quiz-stage quiz-results">
  <div class="quiz-score-big">${correct} / ${total}</div>
  <p style="margin:8px 0 16px"><strong>${pct}%</strong> — ${esc(msg)}</p>
  <div class="card-action-row" style="justify-content:center">
    <button class="btn primary" id="quiz-retry">Try again</button>
    <button class="btn" id="quiz-review">Review answers</button>
    <button class="btn ghost" data-goto="guide">Open study guide</button>
  </div>
</div>`;
    document.getElementById('quiz-retry').addEventListener('click', function () { quizState = null; startQuiz(); });
    document.getElementById('quiz-review').addEventListener('click', function () {
      quizState.done = false;
      quizState.idx = 0;
      quizState.review = true;
      renderQuizCard();
    });
  }

  /* ── Flashcards ────────────────────────────────────────── */
  function loadKnown() {
    try { flashKnown = JSON.parse(localStorage.getItem(FLASH_KEY) || '{}'); } catch (e) { flashKnown = {}; }
  }
  function saveKnown() { try { localStorage.setItem(FLASH_KEY, JSON.stringify(flashKnown)); } catch (e) {} }
  function flashKnownCount() { return Object.keys(flashKnown).filter(function (k) { return flashKnown[k]; }).length; }

  function shuffleFlash() {
    for (let i = FLASHCARDS.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [FLASHCARDS[i], FLASHCARDS[j]] = [FLASHCARDS[j], FLASHCARDS[i]]; }
    flashIdx = 0;
  }

  function renderFlash(host) {
    if (!FLASHCARDS.length) { host.innerHTML = '<p class="muted">No flashcards yet.</p>'; return; }
    if (flashIdx >= FLASHCARDS.length) flashIdx = 0;
    const card = FLASHCARDS[flashIdx];
    const known = !!flashKnown[card.id];
    host.innerHTML = `
<div class="flash-stage">
  <div class="flash-count">Card ${flashIdx + 1} of ${FLASHCARDS.length} · ${flashKnownCount()} known</div>
  <div class="flash-card" id="flash-card">
    <div class="flash-inner">
      <div class="flash-face flash-front"><span>${esc(card.front)}</span></div>
      <div class="flash-face flash-back"><span>${esc(card.back)}</span></div>
    </div>
  </div>
  <div class="flash-actions">
    <button class="btn" id="flash-prev">‹ Previous</button>
    <button class="btn" id="flash-flip">Flip card</button>
    <button class="btn next" id="flash-next">Next ›</button>
    <button class="btn ${known ? 'ghost' : 'primary'}" id="flash-known">${known ? '✓ Known (tap to undo)' : 'Mark as known'}</button>
  </div>
</div>`;
    const cardEl = document.getElementById('flash-card');
    document.getElementById('flash-flip').addEventListener('click', function () { cardEl.classList.toggle('flipped'); });
    cardEl.addEventListener('click', function () { cardEl.classList.toggle('flipped'); });
    document.getElementById('flash-prev').addEventListener('click', function () { flashIdx = (flashIdx - 1 + FLASHCARDS.length) % FLASHCARDS.length; cardEl.classList.remove('flipped'); renderFlash(host); });
    document.getElementById('flash-next').addEventListener('click', function () { flashIdx = (flashIdx + 1) % FLASHCARDS.length; cardEl.classList.remove('flipped'); renderFlash(host); });
    document.getElementById('flash-known').addEventListener('click', function () {
      flashKnown[card.id] = !known;
      saveKnown();
      renderFlash(host);
    });
  }

  window.initRevise = function () {
    loadKnown();
    bindPicker();
    renderControls();
    renderStage();
  };

  window.u3ReviseReinit = function () {
    loadKnown();
    renderControls();
    renderStage();
  };
})();