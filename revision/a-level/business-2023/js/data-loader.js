// Loads the AQA 7132 question bank. Exposes QUESTIONS, QUIZ, FLASHCARDS, P2_SETS and P3_CASES globals.
// Source of truth: data/src/*.py -> run `python data/src/build.py` to regenerate the JSON.
let QUESTIONS = [];
let QUIZ = [];
let FLASHCARDS = [];
let P2_SETS = [];
let P3_CASES = [];
let DATA_READY = false;
const DATA_LISTENERS = [];

function onDataReady(cb) {
  if (DATA_READY) cb();
  else DATA_LISTENERS.push(cb);
}

function getJson(path) {
  return fetch(path).then(r => {
    if (!r.ok) throw new Error(`${path} HTTP ${r.status}`);
    return r.json();
  }).catch(err => {
    console.warn(`Could not load ${path}:`, err.message);
    return [];
  });
}

function dedupeQuizItems(items) {
  const seen = new Set();
  const out = [];
  (items || []).forEach((item) => {
    if (!item || !item.question || !Array.isArray(item.choices) || item.choices.length < 2) return;
    const key = String(item.question).trim().toLowerCase() + '|' + String(item.correct_index);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(item);
  });
  return out;
}

async function loadData() {
  const topics = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  try {
    const topicResults = await Promise.all(topics.map(t => getJson(`data/topic_${t}.json`)));
    const [mcRes, quizRes, flashRes, p2Res, p3Res] = await Promise.all([
      getJson('data/mc.json'),
      getJson('data/quiz.json'),
      getJson('data/flashcards.json'),
      getJson('data/p2_sets.json'),
      getJson('data/p3_cases.json')
    ]);
    QUESTIONS = topicResults.flat().concat(Array.isArray(mcRes) ? mcRes : []);
    QUIZ = dedupeQuizItems(Array.isArray(quizRes) ? quizRes : []);
    FLASHCARDS = Array.isArray(flashRes) ? flashRes : [];
    P2_SETS = Array.isArray(p2Res) ? p2Res : [];
    P3_CASES = Array.isArray(p3Res) ? p3Res : [];
    DATA_READY = true;
    console.log(`Loaded ${QUESTIONS.length} questions, ${QUIZ.length} quiz items, ${FLASHCARDS.length} flashcards, ${P2_SETS.length} Paper 2 sets, ${P3_CASES.length} Paper 3 cases`);
    DATA_LISTENERS.forEach(cb => cb());
  } catch (err) {
    console.error("Data load failed:", err);
    QUESTIONS = []; QUIZ = []; FLASHCARDS = []; P2_SETS = []; P3_CASES = [];
    DATA_READY = true;
    DATA_LISTENERS.forEach(cb => cb());
  }
}

loadData();
