/* AQA A-level Psychology (7182) — knowledge bank, quiz and flashcards, written for the updated specification
   (teaching from September 2025, first A-level exams June 2027). One part per specification topic area (A–Q).
   K  = points-marked question (AQA "1 mark per point / per developed point" style)
   KL = levels-marked question (AQA generic levels for 4/6/8/12/16 marks; indicative content split AO1/AO2/AO3)
   M / TF = quiz, F = flashcard. */
(function () {
  'use strict';
  const B = BizBank('PSY', '7182');
  window.__BIZ_B = B;
  const { K, M, TF, F } = B;
  const AO_NOTE = {
    4: 'Levels of response: 2 levels (3–4, 1–2).',
    6: 'Levels of response: 3 levels (5–6, 3–4, 1–2).',
    8: 'Levels of response: 4 levels (7–8, 5–6, 3–4, 1–2).',
    12: 'Levels of response: 4 levels (10–12, 7–9, 4–6, 1–3).',
    16: 'Levels of response: 4 levels (13–16, 9–12, 5–8, 1–4).'
  };
  // ao: e.g. 'AO1 = 6, AO3 = 10'
  const KL = (aim, topic, verb, marks, question, indicative, ao) => B.KL(aim, topic, verb, marks, question, indicative, {
    ao: ao || '',
    mark_scheme: {
      instruction: 'AQA levels-based mark scheme' + (ao ? ' (' + ao + ')' : '') + '. ' + (AO_NOTE[marks] || '') + ' Decide the level first from the quality of knowledge (AO1), application (AO2) and evaluation (AO3), then the mark within it. Credit other relevant material.',
      indicative_content: indicative,
      level_descriptors: window.BIZ_LEVELS[marks] || window.BIZ_LEVELS[16]
    }
  });
