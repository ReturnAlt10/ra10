/* Pearson Edexcel A-level Business (9BS0) — knowledge bank, quiz and flashcards. One part per theme.
   K  = points-marked question (Edexcel 4-mark style: Knowledge 1, Application 2, Analysis 1 — or calculation marks)
   KL = levels-marked question (Edexcel levels for 8 / 10 / 12 / 20 marks; indicative content with a counterbalance and judgement)
   M / TF = quiz, F = flashcard. Topic labels start with the specification code (eg '1.3.3 Pricing strategies'). */
(function () {
  'use strict';
  const B = BizBank('EDX', '9BS0');
  window.__BIZ_B = B;
  const { K, M, TF, F } = B;
  const AO = {
    8: 'Knowledge 2, Application 2, Analysis 2, Evaluation 2',
    10: 'Knowledge 2, Application 2, Analysis 3, Evaluation 3',
    12: 'Knowledge 2, Application 2, Analysis 4, Evaluation 4',
    20: 'Knowledge 4, Application 4, Analysis 6, Evaluation 6'
  };
  const KL = (aim, topic, verb, marks, question, indicative, ao) => B.KL(aim, topic, verb, marks, question, indicative, {
    ao: ao || AO[marks] || '',
    mark_scheme: {
      instruction: 'Pearson Edexcel levels-based mark scheme (' + (ao || AO[marks] || '') + '). Best fit: knowledge, application to the business, chains of reasoning (analysis) and a balanced assessment leading to a supported judgement (evaluation). Credit other valid responses.',
      indicative_content: indicative,
      level_descriptors: window.BIZ_LEVELS[marks] || window.BIZ_LEVELS[String(marks)] || window.BIZ_LEVELS[12]
    }
  });
