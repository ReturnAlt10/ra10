// BTEC Business Unit 6 data loader — assembles the question bank, quiz and flashcards
// from bank.js (knowledge checks, calculations, quiz, flashcards) and papers-data.js (Pearson / RA10 papers).
const LEARNING_AIMS = window.LEARNING_AIMS;
const SPEC = window.SPEC;
let QUESTIONS = [];
let QUIZ = [];
let FLASHCARDS = [];
let DATA_READY = false;
const DATA_LISTENERS = [];

function onDataReady(cb) {
  if (DATA_READY) cb();
  else DATA_LISTENERS.push(cb);
}

(function loadData() {
  try {
    const B = window.BIZ || {};
    const fromPapers = window.BizPapers ? BizPapers.buildQuestions(window.BIZ_PAPERS || [], window.BIZ_UNIT) : [];
    QUESTIONS = (B.KNOWLEDGE || []).concat(B.CALCS || [], fromPapers);
    QUIZ = (B.QUIZ || []).slice();
    FLASHCARDS = (B.FLASHCARDS || []).slice();
  } catch (err) {
    console.error('Business Unit 6 data load failed:', err);
    QUESTIONS = []; QUIZ = []; FLASHCARDS = [];
  }
  DATA_READY = true;
  window.QUESTIONS = QUESTIONS;
  window.QUIZ = QUIZ;
  window.FLASHCARDS = FLASHCARDS;
  window.DATA_READY = DATA_READY;
  window.onDataReady = onDataReady;
  // live counts on the dashboard cards
  try {
    const set = (k, txt) => document.querySelectorAll('[data-fill="' + k + '"]').forEach(e => { e.textContent = txt; });
    set('flash', FLASHCARDS.length + ' cards: ' + document.querySelector('[data-fill="flash"]').textContent);
    set('quiz', QUIZ.length + ' questions. ' + document.querySelector('[data-fill="quiz"]').textContent);
  } catch (e) {}
  DATA_LISTENERS.forEach(function (cb) { cb(); });
})();
