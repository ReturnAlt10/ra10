// Loads questions, quiz, flashcards. Exposes QUESTIONS, QUIZ, FLASHCARDS globals.
let QUESTIONS = [];
let QUIZ = [];
let FLASHCARDS = [];
let DATA_READY = false;
const DATA_LISTENERS = [];

function onDataReady(cb) {
  if (DATA_READY) cb();
  else DATA_LISTENERS.push(cb);
}

async function loadData() {
  const aims = ["A", "B", "C", "D", "E", "F"];
  try {
    const aimResults = await Promise.all(aims.map(a =>
      fetch(`data/aim_${a}.json`).then(r => {
        if (!r.ok) throw new Error(`aim_${a}.json HTTP ${r.status}`);
        return r.json();
      }).catch(err => {
        console.warn(`Could not load aim_${a}.json:`, err.message);
        return [];
      })
    ));
    QUESTIONS = aimResults.flat();

    // Optional auxiliary datasets
    const [quizRes, flashRes, diagRes, mcRes] = await Promise.all([
      fetch('data/quiz.json').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('data/flashcards.json').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('data/diagrams.json').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('data/mc.json').then(r => r.ok ? r.json() : []).catch(() => [])
    ]);
    if (Array.isArray(diagRes) && diagRes.length) QUESTIONS = QUESTIONS.concat(diagRes);
    if (Array.isArray(mcRes) && mcRes.length) QUESTIONS = QUESTIONS.concat(mcRes);
    QUIZ = Array.isArray(quizRes) ? quizRes : [];
    FLASHCARDS = Array.isArray(flashRes) ? flashRes : [];

    DATA_READY = true;
    console.log(`Loaded ${QUESTIONS.length} questions, ${QUIZ.length} quiz items, ${FLASHCARDS.length} flashcards`);
    DATA_LISTENERS.forEach(cb => cb());
  } catch (err) {
    console.error("Data load failed:", err);
    QUESTIONS = []; QUIZ = []; FLASHCARDS = [];
    DATA_READY = true;
    DATA_LISTENERS.forEach(cb => cb());
  }
}

loadData();
