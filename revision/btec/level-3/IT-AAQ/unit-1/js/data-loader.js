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

function chooseGenericOrgLabel(text) {
  const t = String(text || '').toLowerCase();
  if (/(school|college|academy|student|teacher|classroom)/.test(t)) return 'A secondary school';
  if (/(network|server|isp|hosting|telecom|infrastructure)/.test(t)) return 'A network services company';
  if (/(hospital|clinic|patient|nhs|health|care home|gp practice)/.test(t)) return 'A healthcare organisation';
  if (/(retail|shop|store|e-commerce|customer orders|point of sale)/.test(t)) return 'A retail business';
  if (/(factory|manufactur|assembly line|warehouse production)/.test(t)) return 'A manufacturing company';
  return 'A network services company';
}

function genericiseScenario(scenario) {
  const source = String(scenario || '');
  if (!source.trim()) return source;

  const generic = chooseGenericOrgLabel(source);
  let next = source;

  // Company-like proper names with legal suffixes.
  next = next.replace(/\b([A-Z][A-Za-z0-9&'\-]*(?:\s+[A-Z][A-Za-z0-9&'\-]*){0,4})\s+(Ltd|Limited|PLC|Inc|Corp|Corporation|Company|Co\.)\b/g, generic);
  // Quoted named organisations.
  next = next.replace(/["']([A-Z][A-Za-z0-9&'\-]*(?:\s+[A-Z][A-Za-z0-9&'\-]*){1,5})["']/g, generic);

  return next;
}

function postProcessQuestions() {
  if (!Array.isArray(QUESTIONS) || !QUESTIONS.length) return;

  const aims = ['A', 'B', 'C', 'D', 'E', 'F'];
  aims.forEach((aim) => {
    const shortQs = QUESTIONS
      .filter((q) => q && q.learning_aim === aim && Number(q.marks) <= 4)
      .sort((a, b) => String(a.id || '').localeCompare(String(b.id || ''), undefined, { numeric: true }));

    shortQs.forEach((q, idx) => {
      if (idx % 2 === 1) q.scenario = '';
    });
  });

  QUESTIONS.forEach((q) => {
    if (!q || !q.scenario) return;
    q.scenario = genericiseScenario(q.scenario);
  });
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
    postProcessQuestions();
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
