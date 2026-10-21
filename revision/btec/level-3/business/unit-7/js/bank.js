/* BTEC Business Unit 7 — Business Decision Making (31589H): knowledge checks, generated financial calculations and applied levels questions. */
(function () {
  'use strict';
  const B = BizBank('U7', '31589H');
  window.__BIZ_B = B;
  const { K, KL, C, table } = B;
  const GBP = (n) => '£' + Number(n).toLocaleString('en-GB', { maximumFractionDigits: 2 });
  const r1 = (n) => Math.round(n * 10) / 10, r2 = (n) => Math.round(n * 100) / 100;

  /* A Resources */
  K('A', 'A Resources', 'State', 4, 'State the four types of resource that must be considered when choosing between two business options.', ['Human resources', 'Physical resources (including location)', 'Financial resources', 'Time']);
  K('A', 'A Resources', 'Explain', 2, 'Explain one human resource implication of opening a business as a sole trader working from home.', ['The owner must do all tasks (selling, admin, marketing) with no staff (1)', 'so working hours and skills/training needs may limit growth (1)']);
  K('A', 'A Resources', 'Explain', 2, 'Explain why location is an important physical resource consideration for a new shop.', ['Footfall and visibility affect sales (1)', 'but city-centre premises have higher rent, affecting break-even (1)']);
  K('A', 'A Resources', 'Explain', 2, 'Explain one financial resource implication of needing £18,000 start-up capital when the owner has no savings.', ['A loan or investor is required (1)', 'creating repayments/interest or loss of control that must be covered by profit (1)']);
  K('A', 'A Resources', 'Explain', 2, 'Explain why the time resource matters when choosing between a full-time and a part-time option.', ['Full-time gives more hours to win customers but means giving up other income (1)', 'part-time keeps a salary but limits availability and growth (1)']);
  /* B Finance */
  K('B', 'B Finance', 'Identify', 3, 'Identify three financial measures that can be calculated to compare two business options.', ['Gross profit and gross profit margin', 'Net profit and net profit margin', 'Break-even point and margin of safety', 'Return on capital employed (ROCE)', 'Payback period / cash flow']);
  K('B', 'B Finance', 'Explain', 2, 'Explain why drawings should be considered when comparing the profit of two options.', ['Drawings are what the owner takes out of the business to live on (1)', 'so profit after drawings shows what is retained to grow the business (1)']);
  K('B', 'B Finance', 'Explain', 2, 'Explain why a high ROCE does not necessarily mean the best option.', ['ROCE depends on the small amount of capital employed (1)', 'the absolute profit and risk may be lower, so other measures and risks must be considered (1)']);
  K('B', 'B Finance', 'Explain', 2, 'Explain the own-figure rule in financial calculations.', ['If an earlier answer is wrong but used correctly in a later calculation, marks are still awarded for the later method', 'so always show your working and carry figures forward']);
  K('B', 'B Finance', 'Explain', 2, 'Explain one limitation of using financial forecasts to choose between options.', ['They are based on estimates of customers, price and costs (1)', 'which may not be achieved, especially for a new business (1)']);
  /* C Tools */
  K('C', 'C1 SWOT', 'Explain', 3, 'Explain how a SWOT analysis helps a decision-maker choose between two options.', ['Shows strengths/weaknesses of each option internally and opportunities/threats externally (1)', 'allows direct comparison in a table (1)', 'highlights risks to be managed and the option that best fits the client’s aims (1)']);
  K('C', 'C2 PESTLE', 'State', 6, 'State what each letter in PESTLE stands for.', ['Political', 'Economic', 'Social', 'Technological', 'Legal', 'Environmental']);
  K('C', 'C2 PESTLE', 'Explain', 2, 'Explain how an economic factor such as the cost of living could affect a decision to start a travel consultancy.', ['Customers may cut back on holidays or book cheaper (1)', 'so forecast commission might not be achieved and the risk of the full-time option is higher (1)']);
  K('C', 'C3 Porter', 'State', 5, 'State the five forces in Porter’s model.', ['Threat of new entrants', 'Bargaining power of suppliers', 'Bargaining power of buyers', 'Threat of substitutes', 'Competitive rivalry']);
  K('C', 'C3 Porter', 'Explain', 2, 'Explain how Porter’s five forces could be used to assess a new coffee shop.', ['Rivalry from other cafés and chains, substitutes such as home coffee, low barriers for new entrants (1)', 'buyer power is high because customers switch easily; supplier power depends on specialist beans – high force = lower profit potential (1)']);
  K('C', 'C4 5C model', 'Describe', 3, 'Describe the 5C model used to analyse a business situation.', ['Company – strengths, resources and objectives', 'Customers – needs, segments, size', 'Competitors – number, strength and strategies', 'Collaborators – suppliers, partners, distributors', 'Climate (context) – political, economic, social, technological factors']);
  K('C', 'C tools', 'Explain', 2, 'Explain why the top mark band requires at least two decision-making tools.', ['Different tools give different perspectives on the same decision (1)', 'comparing their findings gives a more reliable, rationalised recommendation (1)']);
  /* D Risks */
  K('D', 'D Risks', 'Identify', 3, 'Identify three risks faced by a new self-employed business.', ['Lack of savings', 'Revenue forecast not achieved', 'Strong competitors', 'No reputation/customer base', 'Higher costs than expected', 'Economic slowdown']);
  K('D', 'D Risks', 'Explain', 2, 'Explain one way a risk could be reduced.', ['Keep a part-time income or build savings (1)', 'use contingency/cash-flow planning, insurance, marketing to build reputation, or diversify (1)']);
  K('D', 'D Risks', 'Explain', 2, 'Explain what is meant by an alternative approach in a business decision report.', ['A different way of achieving the same aims (e.g. a franchise instead of independent start-up, phasing the expansion)', 'considered so that risks are managed and the best route chosen']);
  /* E Decision */
  K('E', 'E Decision', 'Explain', 2, 'Explain what makes a recommendation “supported”.', ['It is based on evidence from the data, resources, tools and risks (1)', 'and explains why the other option was rejected and how risks will be managed (1)']);
  K('E', 'E Report', 'Describe', 4, 'Describe a suitable structure for the Part S report.', ['Introduction: client, aims, options', 'Resources and finance analysis for each option', 'Factors and risks using decision tools', 'Recommendation/decision and conclusion with next steps']);
  K('E', 'E Presentation', 'Explain', 2, 'Explain the role of speaker notes in the presentation.', ['They contain the explanation and persuasion that slides only summarise (1)', 'so markers can see the reasoning, evidence and how the decision would convince the client (1)']);

  /* Generated financial calculations */
  const opts = [
    { name: 'Sharifa – Option 1 (full-time travel consultant)', rev: 90000, cosPct: 40, exp: 4000, draw: 20000, cap: 18000, cust: 240 },
    { name: 'Sharifa – Option 2 (part-time cruise consultant)', rev: 35000, cosPct: 50, exp: 4550, draw: 10000, cap: 11000, cust: 100 },
    { name: 'Marina’s driving school – Option A (franchise)', rev: 60000, cosPct: 25, exp: 9000, draw: 15000, cap: 25000, cust: 150 },
    { name: 'Marina’s driving school – Option B (independent)', rev: 48000, cosPct: 10, exp: 11500, draw: 15000, cap: 14000, cust: 120 },
    { name: 'Hasan’s electrical business – Option 1', rev: 72000, cosPct: 30, exp: 12000, draw: 24000, cap: 20000, cust: 180 },
    { name: 'Salazars’ tapas bar – Option 2 (new menu)', rev: 210000, cosPct: 38, exp: 82000, draw: 30000, cap: 60000, cust: 7000 }
  ];
  opts.forEach((o) => {
    const cos = o.rev * o.cosPct / 100, gp = o.rev - cos, np = gp - o.exp, after = np - o.draw;
    C('B', 'Gross profit and margin', 3, `${o.name}: forecast revenue ${GBP(o.rev)}; cost of sales is ${o.cosPct}% of revenue. Calculate the gross profit and the gross profit margin.`, [`Cost of sales = ${GBP(o.rev)} × ${o.cosPct}% = ${GBP(cos)} (1)`, `Gross profit = ${GBP(o.rev)} − ${GBP(cos)} = ${GBP(gp)} (1)`, `Gross profit margin = ${GBP(gp)} ÷ ${GBP(o.rev)} × 100 = ${r1(gp / o.rev * 100)}% (1)`]);
    C('B', 'Net profit and ROCE', 4, `${o.name}: gross profit ${GBP(gp)}, expenses ${GBP(o.exp)}, capital employed ${GBP(o.cap)}. Calculate net profit (before drawings), the net profit margin and ROCE.`, [`Net profit = ${GBP(gp)} − ${GBP(o.exp)} = ${GBP(np)} (1)`, `Net profit margin = ${GBP(np)} ÷ ${GBP(o.rev)} × 100 = ${r1(np / o.rev * 100)}% (1)`, `ROCE = ${GBP(np)} ÷ ${GBP(o.cap)} × 100 (1)`, `= ${r1(np / o.cap * 100)}% (1)`], { mark_scheme: { additional_guidance: 'Own-figure rule applies. Mark schemes also allow ROCE calculated on net profit after drawings or with capital employed adjusted – show your method clearly.' } });
    C('B', 'Drawings', 2, `${o.name}: net profit before drawings ${GBP(np)}; owner’s drawings ${GBP(o.draw)}. Calculate the profit after drawings and the percentage of revenue (${GBP(o.rev)}) it represents.`, [`Profit after drawings = ${GBP(np)} − ${GBP(o.draw)} = ${GBP(after)} (1)`, `${GBP(after)} ÷ ${GBP(o.rev)} × 100 = ${r1(after / o.rev * 100)}% (1)`]);
  });
  [[4000, 225, 240], [4550, 175, 100], [9000, 300, 150], [11500, 380, 120]].forEach(([fc, contr, cust], i) => {
    const bep = fc / contr;
    C('B', 'Break-even and margin of safety', 4, `A business option has fixed costs of ${GBP(fc)} a year and each customer contributes ${GBP(contr)} after variable costs. It forecasts ${cust} customers. Calculate the break-even number of customers and the margin of safety.`, [`Break-even = fixed costs ÷ contribution per customer (1)`, `= ${GBP(fc)} ÷ ${GBP(contr)} = ${r2(bep)} customers (1)`, `Margin of safety = ${cust} − ${r2(bep)} (1)`, `= ${r2(cust - bep)} customers (1)`]);
  });
  C('B', 'Cash flow and payback', 4, 'An option needs £18,000 start-up capital and is forecast to generate net cash flows of £6,000, £9,000 and £12,000 in years 1, 2 and 3. Calculate the payback period.', ['Cumulative cash: year 1 £6,000; year 2 £15,000 (1)', 'Still £3,000 to recover after year 2 (1)', 'Year 3: £3,000 ÷ £12,000 = 0.25 year (1)', 'Payback = 2.25 years (2 years 3 months) (1)']);
  C('B', 'Average rate of return', 4, 'An investment costs £20,000 and returns £8,000, £10,000 and £12,000 over 3 years (total £30,000). Calculate the average rate of return (ARR).', ['Total profit = £30,000 − £20,000 = £10,000 (1)', 'Average annual profit = £10,000 ÷ 3 = £3,333 (1)', 'ARR = £3,333 ÷ £20,000 × 100 (1)', '= 16.7% (1)']);

  /* Applied levels questions */
  KL('C', 'Decision-making tools', 'Analyse', 8, 'Sharifa could become a full-time travel consultant (Option 1) or a part-time cruise consultant (Option 2). Using a SWOT analysis, analyse the key factors for Option 1.', ['Strengths: highest GP (60%) and net profit (£50,000 before drawings); ROCE 277%; flexible hours; no staff; online model; 2 years’ experience', 'Weaknesses: £18,000 start-up, no savings so a loan needed; no salary if no sales; no reputation as an independent', 'Opportunities: holiday market forecast to grow 22% to £52.1bn by 2027; pent-up demand; 80% book online', 'Threats: cost of living may reduce holiday spend; large competitors (TUI, easyJet, Jet2); many small businesses fail within two years', 'Link to aims: break even in year 1 (BEP ≈ 18 customers vs 240 forecast)']);
  KL('D', 'Risks', 'Evaluate', 12, 'Evaluate the risks of Option 1 and Option 2 for Sharifa and recommend which option she should choose.', ['Option 1 risks: no income if no sales, loan repayment, reliance on commission revenue (£90,000) forecast, no reputation, competitors', 'Option 2 risks: lower revenue (£35,000) and profit after drawings only £2,950; limited availability; but keeps a £20,000 salary so lower personal risk', 'Finance: Option 1 NP £50,000 / ROCE 277%; Option 2 NP £12,950 / ROCE 118%; both break even with few customers; MOS 222 vs 74', 'Resources: Option 1 needs bigger start-up (£18,000 vs £11,000) but starts immediately and is flexible', 'Aims: break even in year 1 then grow – Option 1 gives greater growth potential', 'Recommendation with managed risks (e.g. build savings, phase in, secure first customers before resigning) and reasons Option 2 is not chosen']);
  KL('E', 'Decision', 'Justify', 8, 'Justify a recommendation for a client choosing between buying an existing coffee shop and starting a new one.', ['Existing: established customers and cash flow from day one, but purchase cost, possible goodwill, inherited lease and reputation', 'New: lower purchase cost but fitting out, no customers, longer time to break even, higher risk', 'Use finance (break-even, ROCE), resources (location, staff, time) and a tool (SWOT/Porter) as evidence', 'Clear decision and why the other option is rejected; risks managed']);
})();
