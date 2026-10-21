/* Business Unit 3 — Personal and Business Finance: comprehensive revision guide (shared guide engine). */
(function () {
  'use strict';
  const { svg: S, h: H, P } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, formula, example, steps, cards, stats, check, two, photo, unsplash } = H;
  const stmt = S.statement;

  /* ───────────── THE EXAM ───────────── */
  function setTask() {
    const split = S.bars([['Section A\nPersonal finance', 28, P.teal], ['Section B\nBusiness finance', 52, P.blue]], { w: 520, h: 230, max: 60, unit: 'Marks (80-mark papers, January 2021 onwards)', label: 'Section A and B marks' });
    const cmd = S.ladder([['Identify / Give / State – 1–2 marks', 'One mark per correct item: be specific (“debit card”, not “card”)'], ['Explain – 2–4 marks', 'Identify (1) + linked development (1) – “therefore…”'], ['Calculate – 2–4 marks', 'Formula (1) + working (1) + answer (1+) – show the figures'], ['Discuss – 6 marks', 'Both sides, in the scenario, no conclusion needed'], ['Analyse – 8 marks', 'Break into parts, link the parts, apply to the context'], ['Evaluate / Assess – 10–12 marks', 'Weigh options with figures; supported judgement']], { w: 700, rowH: 44, label: 'Command words and marks' });
    return `
<div class="guide-aim-hd"><div class="guide-aim-badge">★</div><div><div class="guide-aim-title">The exam: 2 hours, Section A and Section B</div><div class="guide-aim-subtitle">80 marks since January 2021 (100 marks June 2017 – January 2020) · calculator allowed · formulae are not given</div></div></div>
<div class="g-set-hero">${S.hero('Know the formulae. Show the working.', 'Calculations, short answers and levels-based 6–12 mark questions on personal and business finance.', ['coin', 'chart', 'shield'], P.teal)}</div>
${stats([['80', 'marks'], ['2 h', 'exam'], ['28 / 52', 'Section A / B'], ['0', 'formulae given']])}
${fig(split, 'Section A (personal finance) is about one-third of the marks; Section B (business finance) about two-thirds.')}
${fig(cmd, 'Match the depth of your answer to the command word and the marks.')}
<h4>What the Lead Examiner reports say</h4>
${check(['<strong>Ratios and break-even are always tested</strong> and “traditionally perform poorly” – learn every formula: nothing is given.', 'Present a <strong>calculated</strong> ratio (1.2) – not the two figures as a ratio (12,000 : 10,000) – this earns no marks.', '<strong>Own-figure rule (ECF):</strong> a wrong earlier answer used correctly later still earns marks – always show working.', 'Marking is positive: ignore a £ sign and credit the correct answer anywhere in the working box.', 'Read the command word: “analyse the <em>limitations</em> of ratios” is not “should she expand?” – many detailed answers failed to answer the question set.', '6–12 mark answers must be <strong>in context</strong>: copying the table of products or figures without comparing them stays in Level 1–2.', 'Evaluate <strong>every</strong> option in a table (e.g. all four insurance policies) and make a clear recommendation.', 'Don’t confuse <strong>IFA</strong> (advisor) with <strong>IVA</strong> (debt arrangement); know debt factoring, margin of safety and non-current assets.'])}
${warn('Break-even and margin of safety: write the formula first, then substitute. Using total revenue instead of units (or adding revenue to fixed costs) is a common route to zero marks.')}
<h4>Levels of response</h4>
${table(['Question', 'Levels', 'Top-level descriptor (summary)'], [['Discuss (6)', 'L1 1–2 · L2 3–4 · L3 5–6', 'Accurate, thorough knowledge; well-developed balanced discussion in context; specialist language throughout'], ['Analyse (8)', 'L1 1–3 · L2 4–6 · L3 7–8', 'Thorough application; balanced analysis with linkages between factors'], ['Assess (10)', 'L1 1–3 · L2 4–7 · L3 8–10', 'Rationalised judgements on significance supported by evidence'], ['Evaluate (12)', 'L1 1–3 · L2 4–6 · L3 7–9 · L4 10–12', 'Well-developed, coherent evaluation with supported conclusion']])}
${photo(unsplash('photo-1579621970563-ebec7560ff3e'), 'Money grows when it is planned – the first third of the paper is about managing it.')}`;
  }

  /* ───────────── AIM A ───────────── */
  function a1() {
    const life = S.flow([['Childhood', 'pocket money, no debt'], ['Adolescence', 'part-time work, first account'], ['Young adult', 'student loan, first home'], ['Middle age', 'mortgage, family, pension'], ['Old age', 'pension, fewer debts']], { w: 700, h: 80, label: 'Life stages and financial needs' });
    return `
${fig(S.tiles([['Unit of account', 'common measure of value (£)'], ['Means of exchange', 'accepted for goods/services'], ['Store of value', 'can be saved (but inflation erodes it)'], ['Legal tender', 'must be accepted to settle debts']], { cols: 4, th: 82, w: 700, label: 'Functions of money' }), 'Four functions of money.')}
<h4>What affects the role of money?</h4>
${ul(['Attitudes to <strong>risk and reward</strong>, borrowing, spending, saving', '<strong>Life stages</strong> and life events (marriage, redundancy, children)', '<strong>Culture</strong>, religious and ethical beliefs (e.g. interest-free Islamic finance)', 'External trends (inflation, recession) and <strong>interest rates</strong>'])}
${fig(life, 'Financial needs change through the life cycle; attitudes to borrowing and saving change with them.')}
${table(['Interest rates up', 'Interest rates down'], [['Borrowing costs rise (mortgage, loans, cards)', 'Borrowing is cheaper'], ['Savings earn more – more incentive to save', 'Savings earn less – less incentive'], ['Less disposable income', 'More disposable income / spending']])}
<h4>Why plan expenditure?</h4>
${check(['Avoid debt, legal action, repossession and bankruptcy', 'Remain solvent and keep a good credit rating', 'Save for targets, set goals and buy insurance', 'Counter inflation'])}
${tip('For credit rating, give specifics: electoral roll, paying on time, avoiding CCJs, not applying for lots of credit.')}`;
  }
  function a2() {
    return `
${table(['Method', 'Advantage', 'Disadvantage'], [['Cash', 'Immediate, no fees, easy to budget', 'Can be lost/stolen; not for online'], ['Debit card', 'Spends your own money; widely accepted', 'Fraud risk; can overdraw'], ['Credit card', 'Interest-free period, consumer protection (s.75)', 'High APR if not cleared; debt risk'], ['Charge card', 'No interest on balance', 'Must pay in full; fees'], ['Store card', 'Discounts in one retailer', 'High interest, limited use'], ['Pre-paid card', 'Controls spending, no credit check', 'Fees; must top up'], ['Cheque', 'Safe for large sums', 'Slow; declining use'], ['Direct debit', 'Automatic, on time', 'Amount can vary; overdraft risk'], ['Standing order', 'Fixed, predictable', 'Can’t vary; may bounce'], ['Contactless / mobile', 'Fast, secure, convenient', 'Limit; phone loss/theft'], ['Electronic transfer', 'Instant/cheap', 'Mistakes hard to reverse']])}
${fig(S.flow([['FPS', 'near-instant, up to £1m'], ['BACS', '≈ 3 working days, bulk'], ['CHAPS', 'same day, high value']], { w: 700, h: 74, label: 'Payment systems' }), 'Know the three systems used for transfers.')}
${tip('Be specific in 2-mark “identify” questions: “debit card”, “direct debit” – not “card”.')}`;
  }
  function a3() {
    return `
${table(['Account', 'Key features', 'Best for'], [['Standard', 'Debit card, overdraft, no/low fee', 'Most people'], ['Packaged / premium', 'Monthly fee + insurances (travel, mobile, breakdown), higher interest-free overdraft', 'Frequent travellers/phone owners – only if benefits are used'], ['Basic', 'No overdraft; deposits/payments only', 'Poor credit history'], ['Student', 'Interest-free overdraft, no fee, perks', 'Full-time students']])}
${example('Choosing a packaged account (12-mark style)', '<p>Compare each account’s <strong>annual cost</strong> with the <strong>value of the benefits the person will actually use</strong> (e.g. Liam: family travel, two iPhones, regularly £300 overdrawn). Check the cover (Europe vs worldwide; account holder only vs partner), the overdraft limit and any interest. Recommend ONE and say why each other account is less suitable.</p>')}`;
  }
  function a4() {
    const risk = S.spectrum([['Current account', 'low risk · low return'], ['Savings / ISA', 'low risk'], ['Premium Bonds', 'no guaranteed return'], ['Bonds & gilts', 'medium risk'], ['Shares', 'high risk · high return']], { left: 'Lower risk, lower reward', right: 'Higher risk, higher reward', label: 'Risk and reward' });
    return `
<h4>Borrowing</h4>
${table(['Type', 'Features', 'Advantage', 'Disadvantage'], [['Overdraft', 'Borrow through the current account', 'Flexible; arranged may be cheap', 'Unarranged fees; high rates'], ['Personal loan', 'Fixed amount, fixed repayments', 'Predictable, cheaper than cards', 'Early settlement fees; credit check'], ['Hire purchase', 'Deposit + instalments, own at end', 'Spreads the cost', 'Total cost higher'], ['Mortgage', 'Secured on property, 25 years+', 'Lowest rates', 'Repossession risk'], ['Credit card', 'Revolving limit; interest-free if cleared', 'Convenient; protection', 'High APR'], ['Payday loan', 'Short-term, very high APR', 'Fast cash', 'Debt spiral, fees']])}
<h4>Saving and investment</h4>
${fig(risk, 'Higher potential return means higher risk – match the product to the person’s needs and attitude to risk.')}
${table(['Product', 'Features'], [['ISA', 'Tax-free; annual allowance (£20,000)'], ['Deposit / savings account', 'Interest; instant or notice access; FSCS protected'], ['Premium Bonds', 'Prizes not interest; no guaranteed return'], ['Bonds and gilts', 'Loans to companies/government; fixed interest'], ['Shares', 'Dividends and growth; can fall in value'], ['Pensions', 'Long-term; tax relief; locked until retirement age']])}
<h4>Insurance</h4>
${ul(['Car, home & contents, life, travel, pet, health', 'Know <strong>premium</strong>, <strong>excess</strong>, level of cover (accidents only vs illnesses vs pre-existing), maximum claim and extras', 'Compare policies against the person’s needs, risk and budget'])}
${example('Evaluating four pet insurance policies (June 2024, 12 marks)', '<p>Philip’s puppy has an unknown medical history and average claims are £750 (operations £3,000+). For each policy discuss: monthly cost (affordability for a student), cover (accidents only vs illnesses/pre-existing), maximum claim (does it cover £750 and £3,000?), excess, and extras (vet-nurse chat). Examiners: “Where learners did not score well it was because they just copied out the table.” Compare, then recommend and say why the other three were not chosen.</p>')}`;
  }

  /* ───────────── AIM B ───────────── */
  function b1() {
    return `${table(['Institution', 'Features'], [['Bank of England', 'Central bank: base rate, inflation target, notes, stability'], ['Banks', 'Profit-making (shareholders); accounts, loans, cards'], ['Building societies', 'Mutual, owned by members; savings and mortgages'], ['Credit unions', 'Member-owned, common bond, low-cost loans'], ['NS&I', 'Government-backed savings (Premium Bonds)'], ['Insurance / pension companies', 'Risk cover; retirement savings'], ['Pawnbrokers', 'Loans against goods; high cost'], ['Payday lenders', 'Short-term, very high cost']])}`;
  }
  function b2() { return `${table(['Channel', 'Advantage', 'Disadvantage'], [['Branch', 'Face-to-face help; cash deposits', 'Limited hours; closures'], ['Online banking', '24/7; fast', 'Security risks; needs internet'], ['Telephone', 'Talk to a person; no internet', 'Waiting times; ID checks'], ['Mobile app', 'Convenient; alerts and instant freeze', 'Phone loss; digital exclusion'], ['Postal', 'Written record', 'Slow']])}`; }
  function b3() {
    return `${fig(S.tiles([['FCA', 'Regulates conduct; authorises firms; fines/bans'], ['FOS', 'Free independent complaints service (after the firm)'], ['FSCS', 'Pays compensation if a firm fails (£85,000 deposits)'], ['Consumer credit law', 'Clear APR information, right to withdraw, fair lending']], { cols: 2, th: 78, w: 700, label: 'Consumer protection' }), 'Be specific about what each body does – “protects consumers” alone earns nothing.')}`;
  }
  function b4() {
    return `${table(['Source', 'Role', 'Advantage', 'Disadvantage'], [['Citizens Advice', 'Free impartial advice', 'Free; local', 'Limited time; not regulated advisor'], ['IFA', 'Regulated advice from whole market', 'Unbiased, tailored', 'Fees'], ['Price comparison sites', 'Compare products quickly', 'Quick, free', 'Commission bias; not all providers'], ['Debt counsellors', 'Plan to manage debts', 'Free (charities); negotiate with creditors', 'May affect credit file'], ['IVA', 'Formal debt agreement with insolvency practitioner', 'Avoids bankruptcy; frozen interest; write-off', 'Fees (~£5,000), credit rating, only for debts > ~£10,000'], ['Bankruptcy', 'Court process', 'Debts written off after a year', 'Assets can be sold; restrictions; reputation']])}
${warn('IFA = independent financial <em>advisor</em>. IVA = individual voluntary <em>arrangement</em>. Examiners report learners confusing them and scoring zero.')}`;
  }

  /* ───────────── AIM C ───────────── */
  function c1() {
    return `${S.tiles ? fig(S.tiles([['Recording', 'every transaction'], ['Management', 'plan, monitor, control'], ['Compliance', 'law, tax, fraud prevention'], ['Measuring performance', 'profit, liquidity, efficiency'], ['Control', 'receivables and payables']], { cols: 5, th: 90, w: 700, label: 'Purposes of accounting' }), 'Give two purposes in a “give” question; link them to the business in “explain” ones.') : ''}`;
  }
  function c2() {
    return `${two(`<strong>Capital income</strong>${ul(['Loans, mortgages', 'Shares, debentures', 'Owner’s capital'])}`, `<strong>Revenue income</strong>${ul(['Cash and credit sales', 'Rent, commission, interest received', 'Discount received'])}`)}
${key('Why the split matters', 'Revenue income goes into the statement of comprehensive income; capital income goes on the statement of financial position (it funds the business).')}`;
  }
  function c3() {
    return `${two(`<strong>Capital expenditure</strong>${ul(['Tangible: land, buildings, machinery, vehicles, fixtures', 'Intangible: goodwill, patents, trademarks, brand names'])}`, `<strong>Revenue expenditure</strong>${ul(['Inventory, rent, rates, utilities, insurance', 'Wages, marketing, bank charges, interest paid', 'Depreciation and discount allowed'])}`)}
${warn('“Tangible” and “intangible” are types, not examples – examiners do not accept them as examples of non-current assets.')}`;
  }

  /* ───────────── AIM D ───────────── */
  function d1() {
    return `${fig(S.matrix([{ h: 'Internal – short term', tag: 'no outside party', items: ['Retained profit', 'Net current assets', 'Sale of assets (one-off)'] }, { h: 'External – short term', tag: '< 1 year', items: ['Trade credit', 'Overdraft', 'Debt factoring / invoice discounting'] }, { h: 'External – long term', tag: 'years', items: ['Bank loan, mortgage', 'Owner’s capital / shares', 'Venture capital, debentures', 'Crowd-funding, P2P'] }, { h: 'Asset finance & grants', tag: 'mixed', items: ['Hire purchase', 'Leasing', 'Grants and donations (no repayment)'] }], { h: 330, cols: [P.teal, P.blue, P.violet, P.amber], label: 'Sources of finance' }), 'Know advantages and disadvantages and whether each is short or long term.')}
${table(['Source', 'Advantage', 'Disadvantage'], [['Retained profit', 'No interest; keeps control', 'Limited amount; reduces dividends'], ['Sale of assets', 'Quick cash', 'Fewer assets; one-off'], ['Bank loan', 'Large sums; fixed repayments', 'Interest; security required'], ['Venture capital', 'Large funds + expertise', 'Shares/control given up'], ['Crowd-funding', 'No loan; tests demand', 'May not reach target; rewards'], ['Debt factoring', 'Immediate cash flow', 'Fee; less than invoice value'], ['Leasing', 'No upfront cost; maintenance', 'Never own; higher total cost'], ['Trade credit', 'Interest-free', 'Supplier relations; lost discounts'], ['Grants', 'No repayment', 'Conditions; competitive']])}
${tip('For 12-mark evaluate questions, link the source to the business’s situation: size, existing debt, speed needed, risk and control.')}`;
  }

  /* ───────────── AIM E ───────────── */
  function e1() {
    return `
${formula('Closing balance', 'opening balance + net cash flow', 'Net cash flow = total inflows − total outflows; closing balance = next month’s opening balance')}
${H.table(['', 'April', 'May', 'June'], [['Opening balance', '1,500', '1,600', '(400)'], ['Total inflows', '3,200', '3,600', '4,000'], ['Total outflows', '3,100', '5,600', '4,300'], ['Net cash flow', '100', '(2,000)', '(300)'], ['Closing balance', '1,600', '(400)', '(700)']])}
<p>Each month’s closing balance becomes the next month’s opening balance. Brackets show a negative balance – an overdraft or shortage the business must plan for.</p>
${fig(S.lines([{ name: 'Closing balance', col: P.blue, pts: [[1, 1600], [2, -400], [3, -700], [4, 0], [5, 1300]] }, { name: 'Overdraft limit', col: P.red, dash: true, pts: [[1, -1000], [5, -1000]] }], { h: 260, ymin: -1200, ymax: 2000, xlabels: [[1, 'Apr'], [2, 'May'], [3, 'Jun'], [4, 'Jul'], [5, 'Aug']], fmt: v => '£' + Math.round(v), label: 'Closing cash balance by month' }), 'A forecast shows when the business dips below zero – and whether the overdraft can cover it.')}
${H.two(`<strong>Benefits</strong>${ul(['Spot shortages early', 'Support loan applications', 'Plan, monitor and control', 'Set targets'])}`, `<strong>Limitations</strong>${ul(['Estimates may be wrong', 'Late payers, unexpected costs', 'Does not show profit', 'External changes'])}`)}
<h4>Improving a negative cash flow</h4>
${check(['Shorter credit for customers / early payment discounts', 'Longer credit from suppliers', 'Overdraft or loan', 'Delay buying assets; sale and leaseback', 'Factoring / invoice discounting'])}`;
  }
  function e2() {
    return `
${formula('Break-even point (units)', 'fixed costs ÷ (selling price − variable cost per unit)', 'Contribution per unit = selling price − variable cost per unit')}
${formula('Margin of safety', 'expected sales − break-even point', 'Total contribution = contribution per unit × units sold; profit = total contribution − fixed costs')}
${fig(S.breakEven({ fc: 5500, vc: 2, price: 6, max: 2000, ms: 1500 }, { label: 'Break-even chart for Lalisa’s takeaway' }), 'Lalisa: fixed costs £5,500, variable cost £2, price £6 → break-even 1,375 boxes a month; at 1,500 boxes the margin of safety is 125 boxes.')}
${example('Worked example – June 2024, Q10', '<p><strong>(b)</strong> Break-even = 5,500 ÷ (6 − 2) = 5,500 ÷ 4 = <strong>1,375 boxes</strong>. (4 marks: contribution £4 (1), formula (1), correct answer (2).)</p><p><strong>(c)</strong> Margin of safety (November, sales 1,500) = 1,500 − 1,375 = <strong>125 boxes</strong>. (Own-figure rule applies using your (b) answer.)</p><p><strong>(d)</strong> To improve the break-even point: raise price (higher contribution; fewer customers?), cut variable costs (cheaper packaging; quality risk), cut fixed costs (cheaper site; fewer customers). In context: forecast sales June–October are below 1,375 – a new business may accept an initial loss.</p>')}
${table(['Cost type', 'Meaning', 'Example'], [['Fixed', 'Do not change with output', 'Rent, insurance, salaries'], ['Variable', 'Rise with output', 'Ingredients, packaging'], ['Semi-variable', 'Fixed part + variable part', 'Phone bill, electricity'], ['Total', 'Fixed + variable', 'FC + VC × units']])}
${warn('Break-even with <em>variable costs of £2 and a price of £6</em> uses contribution £4 – not £6 ÷ £2. Examiners report the margin of safety “is a concept which many learners struggled with”.')}
<h4>Limitations of break-even</h4>${ul(['One selling price assumed; ignores discounts', 'Assumes costs are linear and everything produced is sold', 'Based on forecasts; ignores competitors and demand changes'])}`;
  }

  /* ───────────── AIM F ───────────── */
  function f1() {
    return `
${fig(stmt('Statement of comprehensive income (sole trader)', [['Revenue', '£150,000'], ['Opening inventory', '£12,000', 1], ['Purchases', '£88,000', 1], ['Closing inventory', '(£10,000)', 1], ['Cost of sales', '£90,000', 0, 1], ['Gross profit', '£60,000', 0, 1], ['Expenses (incl. depreciation, accruals)', '(£34,000)', 1], ['Profit for the year', '£26,000', 0, 1]]), 'Cost of sales = opening inventory + purchases − closing inventory.')}
${table(['Adjustment', 'Effect on expenses'], [['Straight-line depreciation', 'Cost × x% each year'], ['Reducing balance', '(Cost − depreciation to date) × x%'], ['Prepayment', 'Subtract the amount paid in advance'], ['Accrual', 'Add the amount owed but unpaid']])}
${example('Depreciation of a £20,000 machine at 20%', '<p>Straight-line: £4,000 every year (NBV £16,000, £12,000, £8,000…).</p><p>Reducing balance: year 1 £4,000 (NBV £16,000); year 2 £3,200 (NBV £12,800); year 3 £2,560 (NBV £10,240).</p>')}`;
  }
  function f2() {
    return `
${fig(stmt('Statement of financial position (vertical)', [['Non-current assets (net book value)', '£48,000'], ['Inventory', '£6,500', 1], ['Trade receivables', '£4,200', 1], ['Bank', '£2,300', 1], ['Current assets', '£13,000', 0, 1], ['Current liabilities (trade payables)', '(£5,000)', 1], ['Net current assets', '£8,000', 0, 1], ['Non-current liabilities (bank loan)', '(£20,000)', 1], ['NET ASSETS', '£36,000', 0, 1], ['Total equity (capital + profit − drawings)', '£36,000', 0, 1]]), 'Net assets always equal total equity – use it to check your work.')}
${formula('Capital employed', 'non-current liabilities + total equity', 'or total assets − current liabilities (£20,000 + £36,000 = £56,000)')}`;
  }
  function f3() {
    return `
${fig(S.formulaMap([['Gross profit margin', '(gross profit ÷ revenue) × 100', '£112,000 ÷ £175,000 = 64%'], ['Mark-up', '(gross profit ÷ cost of sales) × 100', '£112,000 ÷ £63,000 = 177.8%'], ['Profit margin', '(profit for the year ÷ revenue) × 100', '£67,000 ÷ £175,000 = 38.3%'], ['ROCE', '(profit ÷ capital employed) × 100', 'compare with the interest rate']], { cols: 2, label: 'Profitability ratios' }), 'Candy’s Creative (2023): revenue £175,000, cost of sales £63,000, expenses £45,000.')}
${tip('Gross profit margin worked from Candy’s figures: gross profit = £175,000 − £63,000 = £112,000 → 64% (3 marks: GP (1) + formula (1) + answer (1)).')}`;
  }
  function f4() {
    return `
${fig(S.formulaMap([['Current ratio', 'current assets ÷ current liabilities', '£12,000 ÷ £10,000 = 1.2 : 1'], ['Liquid capital ratio', '(current assets − inventory) ÷ current liabilities', 'excludes inventory – stricter test']], { cols: 2, label: 'Liquidity ratios' }), 'Above 1 (liquid ratio) / around 1.5–2 (current) suggests the business can pay short-term debts – but compare with similar firms.')}
${warn('<strong>Present the ratio as a calculated figure</strong> (1.2 or 1.2 : 1). Writing “12,000 : 10,000” or “6 : 5” earned no marks in June 2024.')}`;
  }
  function f5() {
    return `
${fig(S.formulaMap([['Trade receivable days', '(trade receivables ÷ credit sales) × 365', '£19,200 ÷ £32,000 × 365 = 219 days'], ['Trade payable days', '(trade payables ÷ credit purchases) × 365', 'how long you take to pay suppliers'], ['Inventory turnover', '(average inventory ÷ cost of sales) × 365', 'days of stock held']], { cols: 3, label: 'Efficiency ratios' }), 'Efficiency ratios show how well working capital is managed – lower receivable days is better; higher payable days helps cash but can harm supplier relationships.')}`;
  }
  function f6() {
    return `
${fig(S.tiles([['Historic', 'Based on past figures – not a forecast'], ['Snapshot', 'Year-end position hides seasonal swings'], ['Non-financial factors', 'Reputation, quality, staff not shown'], ['Comparability', 'Different accounting policies; need industry averages'], ['Limited data', 'A young business has few years to compare'], ['Context changes', 'New rent, bigger contracts, longer credit terms']], { cols: 3, th: 86, w: 700, label: 'Limitations of ratios' }), 'Answer “limitations” questions with limitations – not with an argument for or against the decision.')}
${example('8-mark question: limitations to Candy', '<p>Candy has three years’ trading, so trends are limited; ratios use last year’s figures but rent will rise 40% and new customers will have 60+ day credit, so the ratios will not predict the future; ratios exclude non-financial factors (contract quality, reputation); she should compare with competitors and prepare cash-flow forecasts. Link each limitation to Candy’s expansion decision.</p>')}`;
  }

  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-BUS-u3', unitLabel: 'Unit 3 Guide', aimWord: 'Aim', aims: ['A', 'B', 'C', 'D', 'E', 'F'], setTaskTitle: 'The exam',
    titles: { A: 'Understand the importance of managing personal finance', B: 'Explore the personal finance sector', C: 'Understand the purpose of accounting', D: 'Select and evaluate sources of business finance', E: 'Break-even and cash flow forecasts', F: 'Statements, ratios and business performance' },
    subtitles: { A: 'Money, ways to pay, current accounts, borrowing, saving, investing and insurance', B: 'Financial institutions, communication, consumer protection and advice', C: 'Why accounts are kept; capital and revenue income and expenditure', D: 'Internal and external, short- and long-term sources with advantages and disadvantages', E: 'Prepare and evaluate cash flow forecasts; break-even, margin of safety and contribution', F: 'Sole trader statements, depreciation, ratios and their limitations' },
    setTask: setTask,
    topics: {
      A: [{ code: 'A1', name: 'Functions and role of money', html: a1 }, { code: 'A2', name: 'Different ways to pay', html: a2 }, { code: 'A3', name: 'Current accounts', html: a3 }, { code: 'A4', name: 'Managing personal finance', html: a4 }],
      B: [{ code: 'B1', name: 'Features of financial institutions', html: b1 }, { code: 'B2', name: 'Communicating with customers', html: b2 }, { code: 'B3', name: 'Consumer protection', html: b3 }, { code: 'B4', name: 'Information, guidance and advice', html: b4 }],
      C: [{ code: 'C1', name: 'Purpose of accounting', html: c1 }, { code: 'C2', name: 'Types of income', html: c2 }, { code: 'C3', name: 'Types of expenditure', html: c3 }],
      D: [{ code: 'D1', name: 'Sources of finance', html: d1 }],
      E: [{ code: 'E1', name: 'Cash flow forecasts', html: e1 }, { code: 'E2', name: 'Break-even analysis', html: e2 }],
      F: [{ code: 'F1', name: 'Statement of comprehensive income', html: f1 }, { code: 'F2', name: 'Statement of financial position', html: f2 }, { code: 'F3', name: 'Measuring profitability', html: f3 }, { code: 'F4', name: 'Measuring liquidity', html: f4 }, { code: 'F5', name: 'Measuring efficiency', html: f5 }, { code: 'F6', name: 'Limitations of ratios', html: f6 }]
    },
    gallery: [
      { aim: '★', kicker: 'The exam', title: '80 marks in 2 hours', copy: 'Know the formulae – none are given.', image: unsplash('photo-1590283603385-17ffb3a7f29f') },
      { aim: 'E', kicker: 'Break-even', title: 'Costs, revenue, safety', copy: 'Charts, formulae and worked questions.', image: unsplash('photo-1460925895917-afdab827c52f') },
      { aim: 'F', kicker: 'Statements', title: 'Ratios that tell a story', copy: 'Profit, liquidity and efficiency.', image: unsplash('photo-1559526324-4b87b5e36e44') }
    ]
  };
})();
