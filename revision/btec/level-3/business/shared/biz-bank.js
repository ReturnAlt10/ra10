/* RA10 — BTEC Level 3 Business: helpers for writing a unit's knowledge bank, calculations, quiz and flashcards.
   Usage (in a unit's bank.js):
     const B = BizBank('U2', '31489H');
     B.K('A', 'Topic', 'State', 2, 'Question?', ['point 1', 'point 2']);
     B.M('A', 'Topic', 'Question?', 'correct', ['wrong', 'wrong', 'wrong'], 'Explanation');
     B.F('A', 'front', 'back');
     B.publish();   // → window.BIZ = { KNOWLEDGE, CALCS, QUIZ, FLASHCARDS }
   Level descriptors reproduce the generic Pearson levels-based mark-scheme wording used in the Unit 3 exam papers. */
(function () {
  'use strict';

  const L = (level, marks, descriptor) => ({ level, marks, descriptor });
  const DEFAULT_LEVELS = {
    6: [L(1, '1–2', 'Demonstrates isolated knowledge and understanding of relevant information; there may be major gaps or omissions. Provides little evidence of weighing up competing arguments/pros and cons in context; discussion likely to consist of basic description. Meaning may be conveyed but in a non-specialist way.'),
      L(2, '3–4', 'Demonstrates accurate knowledge and understanding of relevant information with a few gaps or omissions. Discussion is partially developed but imbalanced; evidences the weighing up of competing arguments/pros and cons in context. Logical reasoning, clarity and appropriate specialist technical language.'),
      L(3, '5–6', 'Demonstrates accurate and thorough knowledge and understanding; any gaps or omissions are minor. Displays a well-developed and balanced discussion showing a thorough grasp of competing arguments/pros and cons in context. Logical reasoning evidenced throughout; specialist technical language used consistently.')],
    8: [L(1, '1–3', 'Demonstrates isolated knowledge and understanding; major gaps or omissions. Little evidence of application and links between relevant information; analysis likely to consist of basic description. Meaning may be conveyed but in a non-specialist way.'),
      L(2, '4–6', 'Demonstrates accurate knowledge and understanding with a few omissions. Evidence of application demonstrating some linkages and interrelationships between factors leading to an analysis being presented. Logical reasoning, clarity and appropriate specialist technical language.'),
      L(3, '7–8', 'Demonstrates accurate and thorough knowledge and understanding; any gaps are minor. Evidences thorough application leading to a balanced analysis containing linkages and interrelationships between factors. Logical reasoning throughout; specialist technical language used consistently.')],
    10: [L(1, '1–3', 'Isolated knowledge and understanding with major gaps. Little application; assessment likely to be basic description. Judgements on significance, if any, are generic assertions rather than supported by evidence.'),
      L(2, '4–7', 'Accurate knowledge and understanding with a few omissions. Application showing some linkages and interrelationships between factors leading to judgements on significance, some lacking support. Logical reasoning, clarity and appropriate specialist technical language.'),
      L(3, '8–10', 'Accurate and thorough knowledge and understanding. Thorough application containing linkages and interrelationships between factors. A well-developed, balanced assessment leading to rationalised judgements on significance. Logical reasoning and specialist language throughout.')],
    12: [L(1, '1–3', 'Demonstrates isolated knowledge and understanding; major gaps or omissions. Little evidence of application and links between relevant information; evaluation likely to be basic description. Conclusions, if any, are generic assertions rather than supported by evidence.'),
      L(2, '4–6', 'Accurate knowledge and understanding with a few omissions. Application demonstrating some linkages and interrelationships between factors leading to judgement(s). Evaluation presented leading to conclusions, but some may lack support. Logical reasoning, clarity and appropriate specialist technical language.'),
      L(3, '7–9', 'Accurate knowledge and understanding with a few minor omissions. Application demonstrating linkages and interrelationships between factors leading to supported judgement(s). A balanced evaluation showing awareness of competing arguments, leading to conclusions. Logical reasoning and specialist language.'),
      L(4, '10–12', 'Accurate and thorough knowledge and understanding; any gaps are minor. Thorough application leading to balanced evaluation drawing on linkages and interrelationships between factors. A well-developed, balanced and coherent evaluation showing a thorough grasp of competing arguments, leading to supported conclusions. Logical reasoning, clear and fluent use of specialist language.')]
  };
  window.BIZ_LEVELS = Object.assign({}, DEFAULT_LEVELS, window.BIZ_LEVELS || {});

  function rngFor(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  window.BizBank = function (prefix, code) {
    const KNOWLEDGE = [], CALCS = [], QUIZ = [], FLASHCARDS = [];
    let kn = 0, cn = 0, qn = 0, fn = 0;
    const pad = (n, w) => String(n).padStart(w || 3, '0');

    // Short-answer knowledge check. points: array of strings; "(1)" is added to each point automatically.
    function K(aim, topic, verb, marks, question, points, extra) {
      kn++;
      KNOWLEDGE.push(Object.assign({
        id: 'KC-' + prefix + '-' + pad(kn), learning_aim: aim, topic, command_verb: verb, marks, question, origin: 'knowledge', spec_code: code, type: 'short',
        mark_scheme: { instruction: marks === 1 ? 'Award one mark for a correct answer.' : 'Award one mark for each correct point, up to ' + marks + ' marks.', points: points.map(p => /\(\d\)$/.test(p) ? p : p + ' (1)') }
      }, extra || {}));
    }
    // Extended (levels-based) knowledge check: indicative content + generic levels for the mark total.
    function KL(aim, topic, verb, marks, question, indicative, extra) {
      kn++;
      KNOWLEDGE.push(Object.assign({
        id: 'KC-' + prefix + '-' + pad(kn), learning_aim: aim, topic, command_verb: verb, marks, question, origin: 'knowledge', spec_code: code, type: 'extended_levels',
        mark_scheme: { instruction: 'Levels-based mark scheme: best fit on knowledge, application to the scenario, balance and logical reasoning.', indicative_content: indicative, level_descriptors: window.BIZ_LEVELS[marks] || window.BIZ_LEVELS[12] }
      }, extra || {}));
    }
    // Calculation: points = method/answer lines ("(1)" added when missing).
    function C(aim, topic, marks, question, points, extra) {
      cn++;
      CALCS.push(Object.assign({
        id: 'CALC-' + prefix + '-' + pad(cn), learning_aim: aim, topic, command_verb: 'Calculate', marks, question, origin: 'knowledge', spec_code: code, type: 'calculation',
        mark_scheme: { instruction: 'Award marks for the method and the correct answer. Apply own-figure rule (error carried forward) where an earlier figure is used correctly.', points: points.map(p => /\(\d\)$/.test(p) ? p : p + ' (1)'), additional_guidance: 'Accept the correct answer anywhere in the working. Ignore a missing £ sign.' }
      }, extra || {}));
    }
    const table = (title, headers, rows) => ({ type: 'data_table', title, headers, rows });

    function M(aim, topic, question, correct, wrong, explanation) {
      qn++;
      const id = 'QZ-' + prefix + '-' + pad(qn);
      const opts = [{ t: correct, c: true }].concat(wrong.map(w => ({ t: w, c: false })));
      const r = rngFor(id);
      for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
      QUIZ.push({ id, learning_aim: aim, topic, type: 'mcq', question, choices: opts.map(o => o.t), correct_index: opts.findIndex(o => o.c), explanation });
    }
    function TF(aim, topic, statement, isTrue, explanation) {
      qn++;
      QUIZ.push({ id: 'QZ-' + prefix + '-' + pad(qn), learning_aim: aim, topic, type: 'true_false', question: statement, choices: ['True', 'False'], correct_index: isTrue ? 0 : 1, explanation });
    }
    function F(aim, front, back, topic) {
      fn++;
      FLASHCARDS.push({ id: 'FC-' + prefix + '-' + pad(fn), learning_aim: aim, topic: topic || '', front, back });
    }
    function publish() {
      window.BIZ = { KNOWLEDGE, CALCS, QUIZ, FLASHCARDS };
      return window.BIZ;
    }
    return { K, KL, C, M, TF, F, table, publish, KNOWLEDGE, CALCS, QUIZ, FLASHCARDS };
  };
})();
