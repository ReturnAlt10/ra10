/* AQA A-level Business (7138) — configuration for the paper viewer, question bank and AI Examiner.
   First A-level exam June 2028 (AS June 2027). Three papers × 90 marks × 2 hours; each has TWO case studies and five compulsory
   questions per case (Analyse 6, Analyse 6, Assess 9, Assess 9, Evaluate 15). Level grids and AO splits are from the AQA sample mark scheme and criteria documents. */
(function () {
  'use strict';
  const L = (level, marks, descriptor) => ({ level, marks, descriptor });
  window.BIZ_LEVELS = {
    6: [L(1, '1-3', 'A limited response overall with little focus on the demands of the question. Knowledge and relevant understanding of the factor which is the basis of the question (AO1); an attempt to apply knowledge to the context (AO2); a lack of relevant analysis (AO3).'),
      L(2, '4-6', 'A good response overall which focuses on the demands of the question. Knowledge and relevant understanding of the factor (AO1); the effective application of knowledge and understanding to the context throughout the answer (AO2); analysis which shows an accurate and relevant chain of reasoning, effectively linking the two key elements of the question (AO3).')],
    9: [L(1, '1-3', 'A limited response overall with little focus on the demands of the question. Knowledge of relevant factors explained to show understanding (AO1); some attempt to apply knowledge and understanding to the context (AO2); a lack of relevant analysis (AO3); evaluation based on assertion and without support (AO4).'),
      L(2, '4-6', 'A reasonable response overall that focuses on some of the demands of the question. Knowledge explained to show understanding (AO1); good application to the context (AO2); basic, relevant chains of reasoning (AO3); evaluation which has some support (AO4). Better application, some analysis and some supported evaluation than Level 1, but may not weigh up the different arguments.'),
      L(3, '7-9', 'A good response overall that focuses on all the demands of the question. Knowledge explained to show understanding (AO1); good application to the context (AO2); logical, relevant chains of reasoning (AO3); evaluation which effectively weighs up the arguments made and reaches a convincing and coherent judgement, and fully addresses the question (AO4).')],
    15: [L(1, '1-3', 'A weak response overall lacking focus on the demands of the question. Knowledge of relevant factors with understanding (AO1); basic application of knowledge and understanding to the context (AO2); little or no analysis or evaluation.'),
      L(2, '4-6', 'A limited response overall with little focus on the demands of the question. Knowledge of relevant factors with understanding (AO1); application to the context (AO2); some basic, relevant chains of reasoning (AO3); evaluation with limited support (AO4).'),
      L(3, '7-9', 'A reasonable response overall that focuses on some demands of the question. Precise, well-selected knowledge explained to show understanding (AO1); application to the context (AO2); some logical, developed, relevant chains of reasoning (AO3); evaluation which has some support but may lack balance and is not fully focused on the question (AO4).'),
      L(4, '10-12', 'A good response overall that focuses on many of the demands of the question. Precise, well-selected knowledge (AO1); application throughout the answer (AO2); logical, developed, relevant chains of reasoning for BOTH options (AO3); evaluation which is supported, has some balance of the arguments and has a focus on the question (AO4).'),
      L(5, '13-15', 'An excellent response overall that is fully focused on the demands of the question. Precise, well-selected knowledge (AO1); application throughout (AO2); well-developed, logical chains of reasoning of both options which, where appropriate, make use of sophisticated concepts (AO3); evaluation which is well supported, weighs up both options, provides a coherent overarching judgement and fully addresses the question set (AO4).')]
  };

  window.AQA_LEVELS = window.BIZ_LEVELS;

  const instr = (n) => [
    ['Instructions', ['Use black ink or black ball-point pen.', 'Answer all questions. Read the Source A case study (Section A) and the Source B case study (Section B) in the Insert.', 'You must answer the questions in the spaces provided.', 'Do all rough work in the answer book. Cross through any work you do not want to be marked.']],
    ['Information', ['The marks for questions are shown in brackets.', 'The maximum mark for this paper is {total}.', 'You must have a calculator and the Insert.']],
    ['Advice', ['About 54 minutes per case study: Analyse (6) ≈ 8 minutes, Assess (9) ≈ 12 minutes, Evaluate (15) ≈ 20 minutes.', n === 3 ? 'Paper 3 is synoptic: draw on Units 3.1 and 3.2 as well as 3.3.' : n === 2 ? 'Paper 2 focuses on Unit 3.2 but end points may need Unit 3.1 calculations.' : 'Paper 1 covers Unit 3.1 only.']]
  ];
  const sections = {
    A: { title: 'Section A', sub: 'Source A case study · 45 marks', note: 'Read the Source A case study, then answer all questions in this section.' },
    B: { title: 'Section B', sub: 'Source B case study · 45 marks', note: 'Read the Source B case study, then answer all questions in this section.' }
  };
  window.AQA_UNIT = {
    key: 'aqa_biz_2026', code: '7138', subjectName: 'A-Level Business (2026 spec)', qualLine: 'A-level', subjectLine: 'Business', fileStem: 'AQA-A-level-Business-7138', dataSrc: 'js/papers-data.js', minutesPerMark: 1.3,
    pastLabel: 'Past Papers',
    howto: ['Choose a paper. The three AQA sample papers are the official 7138 questions; RA10 papers are fresh sets written in the same two-case-study format.',
      'Switch to “Answer online”: read each case study in the case-study panel beside your answer, then answer the six-, nine- and fifteen-mark questions.',
      'Press “AI Examiner” on any question for a level, a mark, the AO split and exactly what to do to move up a level — or download the paper as a PDF.'],
    paperNote: 'Each paper has two case studies (Source A and Source B), each followed by five compulsory questions: Analyse (6), Analyse (6), Assess (9), Assess (9), Evaluate (15) = 90 marks. Papers 1, 2 and 3 cover Units 3.1, 3.2 and 3.3.',
    papers: {
      1: { name: 'Paper 1', sub: 'Business 1', ref: '7138/1', time: '2 hours', minutes: 120, instructions: instr(1), sections },
      2: { name: 'Paper 2', sub: 'Business 2', ref: '7138/2', time: '2 hours', minutes: 120, instructions: instr(2), sections },
      3: { name: 'Paper 3', sub: 'Business 3', ref: '7138/3', time: '2 hours', minutes: 120, instructions: instr(3), sections }
    },
    topicNames: { A: 'Unit 3.1 What is business? Managing marketing and finance', B: 'Unit 3.2 Managing people and operations', C: 'Unit 3.3 Business and society, the external environment and strategy' },
    classify: function (text, it) {
      const t = String(text || '').toLowerCase();
      const R = [
        ['C', /sustainab|csr|esg|greenwash|bluewash|triple bottom|carroll|five forces|porter|political|legal environment|trade agreement|tariff|quota|protectionis|economic environment|gdp|inflation|exchange rate|unemployment|activism|disruptive|swot|stakeholder map|ansoff|positioning|strategic drift|strategy|mission|vision|payback|average rate of return|net present|npv|investment appraisal|merger|acquisition|franchis|integration|retrench|global|international|joint venture|glocal|digital strategy|lewin|kotter|force field|resistance to change|risk|uncertainty|contingency|crisis|agile|scenario planning/],
        ['B', /human resource|hr |labour turnover|employee turnover|workforce|recruit|training|redundan|redeploy|zero-hours|flexible employment|span of control|hierarch|delayering|centralis|leadership|autocratic|democratic|transformational|appraisal|talent|hackman|team|motivat|maslow|herzberg|taylor|piece rate|commission|performance-related|wellbeing|trade union|employee forum|code of conduct|pay gap|operations|capacity|lean|kaizen|just in time|just in case|inventory|supply chain|supplier|outsourc|quality|tqm|quality circle|benchmark|network|critical path|float|economies of scale|diseconomies|productivity|unit cost|location|innovation|research and development|intrapreneur|patent|copyright|culture|values/],
        ['A', /entrepreneur|business plan|objective|smart|sole trader|private limited|public limited|co-operative|social enterprise|share price|market capitalisation|dividend|stakeholder|market research|confidence interval|market map|market share|market size|market growth|elasticity|segment|target market|niche|marketing|product life|boston|extension strateg|pricing|skimming|penetration|dynamic pricing|distribution|channel|promotion|advertis|influencer|sponsorship|personal selling|brand|seo|ppc|cookie|crm|analytics|break-?even|margin of safety|contribution|profit|budget|variance|cash flow|current ratio|acid test|payables|receivables|income statement|statement of financial|roce|return on|gearing|sources? of finance|retained|overdraft|loan|crowd|business angel|private equity|sale and leaseback|trade credit/]
      ];
      for (const [n, re] of R) if (re.test(t)) return n;
      return 'A';
    }
  };
  window.BIZ_UNIT = { n: 0, key: 'aqa_biz_2026', code: '7138', name: 'AQA A-level Business (2026)', kind: 'exam', total: 90, minutes: 120, timeLabel: '2 hours', aims: ['A', 'B', 'C'], classify: window.AQA_UNIT.classify };
})();
