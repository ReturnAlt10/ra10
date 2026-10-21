/* BTEC Business Unit 3 — Personal and Business Finance (31463H): configuration for the shared paper viewer,
   question-bank builder and AI Examiner. Exam: 2 hours; 100 marks (2017–2020) then 80 marks (2021 onwards). */
(function () {
  'use strict';
  const RULES = [
    ['F', /ratio|gross profit|net profit|profit margin|mark-?up|roce|return on capital|current ratio|liquid|trade receivable|trade payable|inventory turnover|limitations of ratio|statement of (comprehensive income|financial position)|net current assets|net assets|capital employed|depreciation|accrual|prepayment|cost of sales|retained profit.*(statement|equity)|drawings/i],
    ['E', /break-?even|margin of safety|contribution|cash flow|cash-flow|forecast|closing balance|net cash|opening balance|inflow|outflow|receipts|payments/i],
    ['D', /source of finance|sources of finance|venture capital|debt factoring|invoice discounting|crowd-?fund|leasing|hire purchase|trade credit|grant|peer to peer|retained profit|sale of assets|mortgage for the business|loan for the business|owner.?s capital|business loan/i],
    ['C', /purpose of accounting|accounting|capital (income|expenditure)|revenue (income|expenditure)|non-current asset|income|expenditure|fraud|ledger|record(ing)? (financial )?transactions/i],
    ['B', /financial conduct|fca|ombudsman|fos\b|fscs|compensation scheme|bank of england|building society|credit union|pawnbroker|payday lender|citizens advice|financial advis|ifa|iva|debt counsel|bankruptcy|price comparison|communicat|branch|telephone banking|national savings/i]
  ];
  window.BIZ_UNIT = {
    n: 3, key: 'bus_u3', code: '31463H', name: 'Personal and Business Finance', kind: 'exam', total: 80, minutes: 120,
    timeLabel: '2 hours', aims: ['A', 'B', 'C', 'D', 'E', 'F'],
    partsLabel: 'Sections A and B',
    instructions: [
      ['Instructions', ['Use black ink or ball-point pen.', 'Answer all questions.', 'Answer the questions in the spaces provided – there may be more space than you need.', 'Show your working when requested.']],
      ['Information', ['The total mark for this paper is {total}.', 'The marks for each question are shown in brackets – use this as a guide as to how much time to spend on each question.', 'There are two sections: Section A, Personal Finance and Section B, Business Finance.', 'You may use a calculator.']],
      ['Advice', ['Read each question carefully before you start to answer it.', 'Try to answer every question.', 'Check your calculations and the steps you have used.']]
    ],
    howto: ['Open a paper and read it as you would in the exam hall – Section A (personal finance, ~⅓ of the marks) then Section B (business finance).',
      'Switch to “Answer online”: write working and answers for calculations, full answers for 6–12 mark questions. Reveal the mark scheme, self-mark or use the AI Examiner.',
      'Papers before 2021 were 100 marks; from January 2021 they are 80 marks (Section A 28 + Section B 52). Formulae are never given.'],
    paperNote: 'Question text and published mark schemes are matched by question number. Where a mark scheme could not be matched reliably, the AI Examiner marks using Pearson principles.',
    minutesFor: {},
    classify: function (text, section) {
      for (const [aim, re] of RULES) { if (re.test(text)) return section === 'A' && aim !== 'B' && aim !== 'F' && !/ratio|break-?even|cash flow/i.test(text) ? 'A' : aim; }
      return section === 'A' ? 'A' : 'C';
    },
    topicFor: function (text) {
      const t = String(text);
      const map = [[/break-?even|margin of safety/i, 'Break-even analysis'], [/cash flow|cash-flow/i, 'Cash flow forecasts'], [/ratio|margin|roce|receivable|payable|inventory turnover/i, 'Ratio analysis'], [/statement of|net assets|net current|capital employed|depreciation|accrual|prepayment/i, 'Financial statements'],
        [/source of finance|factoring|venture|crowd|leasing|hire purchase|trade credit|grant|retained profit/i, 'Sources of finance'], [/account/i, 'Purpose of accounting'], [/insurance/i, 'Insurance'], [/loan|overdraft|borrow|credit card|mortgage|payday/i, 'Borrowing'], [/saving|isa|premium bond|pension|invest|share/i, 'Saving and investing'],
        [/fca|ombudsman|fscs|protect/i, 'Consumer protection'], [/advice|advis|iva|bankruptcy|citizens/i, 'Advice and debt solutions'], [/pay|direct debit|standing order|contactless|card/i, 'Ways to pay'], [/current account/i, 'Current accounts']];
      for (const [re, name] of map) if (re.test(t)) return name;
      return 'Personal and business finance';
    }
  };
})();
