/* Business Unit 3 Data Loader
   Loads aim_A–aim_F, quiz.json, and flashcards.json
   Exposes QUESTIONS, QUIZ, FLASHCARDS globals, plus onDataReady().
*/

let QUESTIONS = [];
let QUIZ      = [];
let FLASHCARDS = [];
let DATA_READY = false;
const DATA_LISTENERS = [];

function onDataReady(cb) {
  if (DATA_READY) { cb(); } else { DATA_LISTENERS.push(cb); }
}

function chooseGenericOrgLabel(text) {
  const t = String(text || '').toLowerCase();
  if (t.includes('bank')) return 'National Finance Bank';
  if (t.includes('insur')) return 'AssuraCo Insurance';
  if (t.includes('invest')) return 'Apex Investment Group';
  if (t.includes('pension')) return 'RetireSafe Pensions';
  if (t.includes('building societ')) return 'Cornerstone Building Society';
  if (t.includes('credit union')) return 'CommunityFirst Credit Union';
  if (t.includes('government') || t.includes('hmrc')) return 'the Government';
  return 'a financial services company';
}

function genericiseScenario(scenario) {
  if (!scenario) return scenario;
  // Replace quoted company names "XYZ Ltd" style with generic labels
  return scenario
    .replace(/"([A-Z][A-Za-z0-9\s&'.-]{1,40}(?:Ltd|plc|Inc|PLC|LLP|Group|Co\.)?)"(?=\s*,|\s+is|\s+has|\s+provides|\s+offers|\s+operates)/g,
      (m, name) => '"' + chooseGenericOrgLabel(name) + '"')
    .replace(/\b([A-Z][a-z]+\s+(?:Bank|Insurance|Investments?|Finance|Savings?|Pensions?|Trust|Capital|Money|Credit))\b(?!\s*"|Ltd|plc)/g,
      (m) => chooseGenericOrgLabel(m));
}

function postProcessQuestions() {
  QUESTIONS.forEach(q => {
    if (q.scenario) q.scenario = genericiseScenario(q.scenario);
  });
}

async function loadData() {
  const BASE = 'data/';
  const aims = ['A','B','C','D','E','F'];
  try {
    const aimResults = await Promise.all(aims.map(a => fetch(BASE + 'aim_' + a + '.json').then(r => r.json())));
    const [quizRes, flashRes] = await Promise.all([
      fetch(BASE + 'quiz.json').then(r => r.json()).catch(() => []),
      fetch(BASE + 'flashcards.json').then(r => r.json()).catch(() => [])
    ]);

    aimResults.forEach(arr => {
      if (Array.isArray(arr)) QUESTIONS.push(...arr);
    });

    if (Array.isArray(quizRes)) QUIZ.push(...quizRes);
    if (Array.isArray(flashRes)) FLASHCARDS.push(...flashRes);

    postProcessQuestions();
  } catch (e) {
    console.error('Data load error', e);
  } finally {
    DATA_READY = true;
    DATA_LISTENERS.forEach(cb => cb());
    DATA_LISTENERS.length = 0;
  }
}

loadData();
