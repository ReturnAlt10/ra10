/* AQA A-level Business (7132) — paper-engine configuration. Section/AO structure from the AQA specification (v2.0) and the 2020–2025 papers. */
(function () {
  'use strict';
  const instr = (n) => [
    ['Instructions', ['Use black ink or black ball-point pen.', n === 1 ? 'Answer all questions in Section A and Section B. Answer one question from Section C and one question from Section D.' : n === 2 ? 'Answer all questions.' : 'Answer all questions.', 'You must answer the questions in the spaces provided.', 'Do all rough work in the answer book. Cross through any work you do not want to be marked.']],
    ['Information', ['The marks for questions are shown in brackets.', 'The maximum mark for this paper is {total}.', n === 3 ? 'You must have the Insert (case study) and a calculator.' : 'You must have a calculator.']],
    ['Advice', n === 1 ? ['Multiple choice: about 1 minute per question. Analyse (9 marks): about 11 minutes. Essays (25 marks): about 30 minutes each.', 'Analyse questions need no conclusion; essays need a judgement.'] : n === 2 ? ['About 36 minutes per question. Calculate: show your working. Analyse (9): developed chains in context. Evaluate (16): balance and a supported judgement.'] : ['About 20 minutes per 12-mark question, 25 per 16, 30 per 20 and 35 for the 24-mark question. Use the case study and appendices in every answer.']]
  ];
  window.AQA_UNIT = {
    key: 'aqa_biz_2023', code: '7132', subjectName: 'A-Level Business', qualLine: 'A-level', subjectLine: 'Business', fileStem: 'AQA-A-level-Business-7132', dataSrc: 'js/papers-data.js',
    pastLabel: 'Past Papers',
    howto: ['Choose a paper. Past papers 2020–2025 are the real AQA questions; RA10 papers are fresh practice sets in the same format.',
      'Switch to “Answer online”: tap an option for instant multiple-choice marking, type short answers and essays, and use the case-study button beside your answer.',
      'Press “AI Examiner” on any part for a level, a mark and what to do to move up a level — or download the paper as a PDF.'],
    paperNote: 'Paper 1 has no case study (you supply the context). Paper 2 has three data-response cases. Paper 3 has one case study with six questions.',
    papers: {
      1: {
        name: 'Paper 1', sub: 'Business 1', ref: '7132/1', time: '2 hours', minutes: 120, instructions: instr(1),
        sections: {
          A: { title: 'Section A', sub: 'Multiple choice · 15 marks', note: 'Answer all questions. Only one answer per question is allowed.' },
          B: { title: 'Section B', sub: 'Short answer · 35 marks', note: 'Answer all questions.' },
          C: { title: 'Section C', sub: 'Essay · 25 marks', note: 'Answer either of the two questions.' },
          D: { title: 'Section D', sub: 'Essay · 25 marks', note: 'Answer either of the two questions.' }
        }
      },
      2: { name: 'Paper 2', sub: 'Business 2', ref: '7132/2', time: '2 hours', minutes: 120, instructions: instr(2) },
      3: { name: 'Paper 3', sub: 'Business 3', ref: '7132/3', time: '2 hours', minutes: 120, instructions: instr(3) }
    },
    topicNames: { 1: 'What is business?', 2: 'Managers, leadership and decision making', 3: 'Marketing management', 4: 'Operational management', 5: 'Financial management', 6: 'Human resource management', 7: 'Analysing the strategic position', 8: 'Choosing strategic direction', 9: 'Strategic methods', 10: 'Managing strategic change' },
    classify: function (text) {
      const t = String(text || '').toLowerCase();
      const R = [
        [10, /lewin|kotter|force field|resistance to change|handy|organisational culture|network|critical path|float|strategic drift|emergent|planned strategy|contingency|crisis|flexible organi|delayer|restructur|change management|knowledge management/],
        [9, /organic|external growth|merger|takeover|franchis|retrench|economies of scale|diseconomies|synergy|overtrading|vertical|horizontal|conglomerate|innovat|kaizen|intellectual property|patent|copyright|globalis|multinational|off-?shor|re-?shor|international|export|licens|alliance|emerging econom|digital technolog|automation|big data|data mining|e-commerce/],
        [8, /ansoff|market penetration|market development|diversification|generic strateg|cost leadership|differentiation strategy|focus strategy|competitive advantage|strategic positioning|strategic direction/],
        [7, /swot|mission|corporate objective|roce|return on capital|gearing|current ratio|liquidity|receivable days|payable days|inventory turnover|triple bottom|elkington|core competence|political|legal|fiscal|monetary|exchange rate|inflation|gdp|csr|carroll|five forces|investment appraisal|payback|net present|npv|average rate of return|protectionis|trade barrier|tax/],
        [6, /motivat|herzberg|maslow|taylor|labour turnover|labour productivity|labour cost|employee|recruit|training|redundan|redeploy|organisational structure|span of control|hierarch|delegat|centralis|trade union|works council|human resource|hrm|engagement|talent/],
        [5, /budget|variance|cash flow|cash-flow|break-?even|margin of safety|contribution|profit|finance|loan|overdraft|debt factoring|crowd|venture capital|retained|share capital|receivables|payables|income statement|statement of financial/],
        [4, /capacity|lean|just in time|just in case|jit|quality assurance|quality control|inventory|supply chain|supplier|outsourc|unit cost|efficien|operations|operational|productivity|lead time|re-?order/],
        [3, /marketing|market research|segment|target market|positioning|boston|product life|extension strateg|pricing|price elasticity|income elasticity|promotion|branding|social media|market share|sampling|distribution|7ps|digital marketing|primary research|secondary research|correlation|confidence interval|extrapolat/],
        [2, /leadership|manager|management style|decision tree|expected value|net gain|stakeholder|intuition|scientific decision|tannenbaum|autocratic|paternalistic|democratic|laissez|opportunity cost/],
        [1, /business form|sole trader|private limited|public limited|plc|share price|shareholder|dividend|market capitalisation|objective|external environment|incomes|demographic|fair trade|social enterprise|limited liability/]
      ];
      for (const [n, re] of R) if (re.test(t)) return n;
      return 1;
    }
  };
})();
