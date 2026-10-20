// BTEC Sport Unit 2 data loader — assembles the question bank, quiz and flashcards
// from u2-spec.js (specification + norms), u2-cases.js (set-task case studies) and u2-bank.js.
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
    const U2 = window.U2;
    const setTask = U2.CASES.flatMap(U2.buildActivityQuestions);
    QUESTIONS = U2.KNOWLEDGE.concat(U2.CALCS, setTask);
    QUIZ = U2.QUIZ.slice();
    FLASHCARDS = U2.FLASHCARDS.slice();
  } catch (err) {
    console.error('Sport Unit 2 data load failed:', err);
    QUESTIONS = []; QUIZ = []; FLASHCARDS = [];
  }
  DATA_READY = true;
  window.QUESTIONS = QUESTIONS;
  window.QUIZ = QUIZ;
  window.FLASHCARDS = FLASHCARDS;
  window.DATA_READY = DATA_READY;
  window.onDataReady = onDataReady;
  DATA_LISTENERS.forEach(function (cb) { cb(); });
})();
