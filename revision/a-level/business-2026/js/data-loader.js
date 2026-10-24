// AQA A-level Business (7138, 2026 spec) data loader — assembles the question bank, quiz and flashcards
// from bank.js (knowledge checks and calculations), quiz.js / cards.js and papers-data.js (AQA sample + RA10 papers).
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
    const fromPapers = window.AqaPapers && window.AQA_PAPERS ? AqaPapers.buildQuestions(window.AQA_PAPERS, window.AQA_UNIT) : [];
    QUESTIONS = (B.KNOWLEDGE || []).concat(B.CALCS || [], fromPapers);
    QUIZ = (B.QUIZ || []).slice();
    FLASHCARDS = (B.FLASHCARDS || []).slice();
  } catch (err) {
    console.error('AQA Business 7138 data load failed:', err);
    QUESTIONS = []; QUIZ = []; FLASHCARDS = [];
  }
  DATA_READY = true;
  window.QUESTIONS = QUESTIONS;
  window.QUIZ = QUIZ;
  window.FLASHCARDS = FLASHCARDS;
  window.DATA_READY = DATA_READY;
  window.onDataReady = onDataReady;
  try {
    const set = (k, txt) => document.querySelectorAll('[data-fill="' + k + '"]').forEach(e => { e.textContent = txt; });
    set('flash', FLASHCARDS.length + ' cards: ' + document.querySelector('[data-fill="flash"]').textContent);
    set('quiz', QUIZ.length + ' questions. ' + document.querySelector('[data-fill="quiz"]').textContent);
  } catch (e) {}
  DATA_LISTENERS.forEach(function (cb) { cb(); });
})();
