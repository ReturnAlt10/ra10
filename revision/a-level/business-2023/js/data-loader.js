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

function postProcessQuestions() {
  if (!Array.isArray(QUESTIONS) || !QUESTIONS.length) return;
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
  const topics = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  try {
    const topicResults = await Promise.all(topics.map(t =>
      fetch(`data/topic_${t}.json`).then(r => {
        if (!r.ok) throw new Error(`topic_${t}.json HTTP ${r.status}`);
        return r.json();
      }).catch(err => {
        console.warn(`Could not load topic_${t}.json:`, err.message);
        return [];
      })
    ));
    QUESTIONS = topicResults.flat();

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
    QUIZ = dedupeQuizItems(mergedQuiz);
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
