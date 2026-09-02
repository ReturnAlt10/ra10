// BTEC IT Unit 3 — Website Development — data loader
let MCQS = [];
let QUIZ = [];
let FLASHCARDS = [];
let DATA_READY = false;
const DATA_LISTENERS = [];

function onDataReady(cb) {
  if (DATA_READY) cb();
  else DATA_LISTENERS.push(cb);
}

async function loadJson(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.warn('Failed to load', path, e);
    return [];
  }
}

async function loadAllData() {
  const [mc, quiz, flash] = await Promise.all([
    loadJson('data/mc.json'),
    loadJson('data/quiz.json'),
    loadJson('data/flashcards.json'),
  ]);
  MCQS = Array.isArray(mc) ? mc : [];
  QUIZ = Array.isArray(quiz) ? quiz : [];
  FLASHCARDS = Array.isArray(flash) ? flash : [];
  DATA_READY = true;
  DATA_LISTENERS.forEach((cb) => { try { cb(); } catch (e) { console.error(e); } });
  DATA_LISTENERS.length = 0;
}

loadAllData();
