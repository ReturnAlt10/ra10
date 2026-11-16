/* OCR GCSE (9–1) Computer Science (J277) — knowledge bank, quiz and flashcards. One part per chapter (1.1 … 2.5).
   K = points-marked question in the OCR style (1 mark per creditworthy point, "…" = linked expansion);
   KL = levels-marked 8-mark extended response (Paper 1 QER); M / TF = quiz; F = flashcard.
   Topic strings start with the J277 sub-topic code so Practise-by-topic and Study Hub can group them. */
(function () {
  'use strict';
  const B = BizBank('CS', 'J277');
  window.__BIZ_B = B;
  const { K, M, TF, F } = B;
  const KL = (aim, topic, verb, marks, question, indicative) => B.KL(aim, topic, verb, marks, question, indicative, {
    mark_scheme: {
      instruction: 'OCR levels-based mark scheme for the extended response (*). Decide the band first, then the mark within it. Answers must be applied to the context and cover the areas in the question. Credit any other relevant, accurate points.',
      indicative_content: indicative,
      level_descriptors: (window.BIZ_LEVELS || {})[8]
    }
  });
