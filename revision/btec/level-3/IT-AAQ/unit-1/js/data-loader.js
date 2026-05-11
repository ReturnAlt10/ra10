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

function dedupeQuizItems(items) {
  const seen = new Set();
  const out = [];
  (items || []).forEach((item) => {
    if (!item || !item.question || !Array.isArray(item.choices) || item.choices.length < 2) return;
    const key = String(item.question).trim().toLowerCase() + '|' + item.choices.map(c => String(c).trim().toLowerCase()).join('|') + '|' + String(item.correct_index);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(item);
  });
  return out;
}

function normaliseMcItemToQuiz(item, idx) {
  if (!item || !Array.isArray(item.options) || !item.options.length || !item.mark_scheme?.answer) return null;
  const choices = item.options.map(o => String(o?.text || '').trim()).filter(Boolean);
  if (choices.length < 2) return null;
  const answerLabel = String(item.mark_scheme.answer || '').trim().toUpperCase();
  const labelIndex = item.options.findIndex(o => String(o?.label || '').trim().toUpperCase() === answerLabel);
  if (labelIndex < 0 || labelIndex >= choices.length) return null;
  return {
    id: 'QMC' + String(idx + 1).padStart(3, '0'),
    learning_aim: item.learning_aim || '',
    topic: item.topic || 'Multiple choice',
    type: 'mcq',
    question: item.question,
    choices,
    correct_index: labelIndex,
    explanation: item.mark_scheme.explanation || ''
  };
}

function makeQuizVariants(baseItems, variantCount, idPrefix) {
  const out = [];
  (baseItems || []).forEach((q, idx) => {
    if (!q || !Array.isArray(q.choices) || q.choices.length < 2) return;
    const baseChoices = q.choices.slice();
    const maxVar = Math.max(0, Number(variantCount || 0));
    for (let v = 1; v <= maxVar; v++) {
      const rot = (idx + v) % baseChoices.length;
      const rotated = baseChoices.slice(rot).concat(baseChoices.slice(0, rot));
      const correctText = baseChoices[q.correct_index];
      const nextCorrect = rotated.findIndex(c => c === correctText);
      if (nextCorrect < 0) continue;
      let prompt = String(q.question || '').trim();
      if (v === 1) prompt = 'Quick check: ' + prompt;
      else if (v === 2) prompt = 'Exam-style MCQ: ' + prompt;
      out.push({
        id: idPrefix + String(idx + 1).padStart(3, '0') + 'V' + v,
        learning_aim: q.learning_aim,
        topic: q.topic,
        type: 'mcq',
        question: prompt,
        choices: rotated,
        correct_index: nextCorrect,
        explanation: q.explanation || ''
      });
    }
  });
  return out;
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
    const baseQuiz = Array.isArray(quizRes) ? quizRes : [];
    const mcQuiz = Array.isArray(mcRes)
      ? mcRes.map((m, idx) => normaliseMcItemToQuiz(m, idx)).filter(Boolean)
      : [];
    const mergedQuiz = dedupeQuizItems(baseQuiz.concat(mcQuiz));
    const quizVariants = makeQuizVariants(mergedQuiz.filter(q => q.type === 'mcq' || q.type === 'multiple_choice'), 2, 'QVARIT');
    QUIZ = dedupeQuizItems(mergedQuiz.concat(quizVariants));
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
