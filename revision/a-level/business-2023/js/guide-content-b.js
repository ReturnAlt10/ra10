/* AQA A-level Business (7132) revision guide - content part 2: 3.6 to 3.10 */
(function () {
  'use strict';
  const { def, tip, mistake, formula, chain, evalBox, worked, table, seen, topic, section } = window.BG;

  /* ===================================================== 3.6 */
  section(6, '3.6 Human resource management', 'HR objectives, hard/soft HRM, HR data, organisational design, HR flow, motivation theories, employee relations', [
    topic('3.6.1', 'Setting human resource objectives', `
<p>Spec list: <strong>employee engagement, talent development, training, diversity, alignment of employee and employer values, number, skills and location of employees</strong>.</p>
${table(['', 'Hard HRM', 'Soft HRM'], [
  ['View of staff', 'A resource / cost to be controlled', 'An asset to be developed'],
  ['Typical practice', 'Short-term contracts, close supervision, pay linked to output', 'Training, consultation, empowerment, long-term careers'],
  ['Suits', 'Low-skill, standardised work; cost leadership', 'Knowledge work, service quality, innovation'],
  ['Risk', 'Low engagement, high labour turnover', 'Higher cost; slower decisions'],
])}
${chain('how a more diverse workforce can raise profit', [
  'A diverse workforce brings different perspectives and experiences.',
  'This improves understanding of a wider range of customer segments.',
  'Products and promotion are better tailored, so the customer base widens.',
  'Higher sales (and a wider talent pool lowering recruitment costs) increase profit.'])}
${evalBox(['the nature of the work and skills needed', 'the culture and leadership style', 'the cost of soft HRM relative to its benefits', 'whether a change is implemented consistently'], 'whether moving from hard to soft HRM motivates ALL employees depends on')}
${seen('2024 P1 Q22 (hard to soft HRM); 2020 P1 Q18 (diversity and profit); 2025 P2 Q3.1 (airline HR objectives).')}
`),
    topic('3.6.2', 'Analysing human resource performance', `
${formula(['Labour turnover (%) = number leaving / average number employed x 100', 'Labour productivity = output per period / number of employees', 'Employee costs as % of turnover = employee costs / revenue x 100', 'Labour cost per unit = labour costs / units of output', 'Retention rate (%) = employees staying the full period / employees at start x 100'])}
${worked('labour turnover with an average', ['Start 220, end 260 &rarr; average 240', '36 leavers / 240 x 100 = 15%'])}
${chain('why high labour turnover hurts a hotel chain', [
  'Each leaver must be replaced, so recruitment and training costs rise.',
  'New staff are inexperienced, so service quality falls.',
  'In a service business staff ARE the product (the "people" P), so guest satisfaction and repeat bookings fall.',
  'Remaining staff are overworked, lowering morale and increasing turnover further - a vicious circle.'])}
${evalBox(['the industry norm (hospitality and events naturally have higher turnover)', 'the skill level - losing trained specialists matters more', 'whether new staff bring fresh ideas', 'the cost of recruiting and training'], 'how worrying high turnover is depends on')}
${seen('2021 P2 Q3.4 (labour turnover for all businesses); 2021 P2 Q3.1 (retention rate); 2020 P1 Q17 (employee costs % turnover); 2023 P1 Q12-13 MCQs.')}
`),
    topic('3.6.3', 'Organisational design and the human resource flow', `
${table(['Structure', 'Grouped by', '+', '-'], [
  ['Functional', 'Department (marketing, finance...)', 'Specialisation, clear roles', 'Silos; slow cross-department coordination'],
  ['Product-based', 'Product / division', 'Focus on each product\'s market; accountability', 'Duplication of functions'],
  ['Regional', 'Geography', 'Responsive to local markets', 'Duplication; brand inconsistency'],
  ['Matrix', 'Project teams across functions', 'Flexible, uses expertise, good for innovation', 'Two bosses - conflict and confusion'],
])}
${def('Span of control', 'number of subordinates directly responsible to a manager. Wider span &rarr; fewer layers (flatter) for the same number of staff.')}
${def('Centralisation / decentralisation', 'decisions kept at the top v passed to lower levels or local units.')}
${def('Delegation', 'passing authority to complete a task; the manager remains accountable.')}
${chain('wider span of control and labour productivity', [
  'Each manager now supervises more staff, so supervision of each worker is less close.',
  'Skilled, motivated workers gain autonomy - Herzberg\'s responsibility motivator - and output rises.',
  'But unskilled or new workers lose guidance, so errors and idle time increase.',
  'The overall effect on productivity depends on the skills of the workforce and the manager\'s capacity.'])}
${mistake('2022 P1 Q20: arguments about levels of hierarchy were only rewarded if the link between a wider span and fewer levels was established. One answer treated "span of control" as how controlling the manager was and scored 0.')}
<h4>Human resource flow</h4>
<p>HR plan (workforce planning: number, skills, location) &rarr; recruitment &rarr; training &rarr; redeployment &rarr; redundancy.</p>
${seen('2022 P1 Q20; 2024 P2 Q3.2 (organisational design with a product portfolio); 2025 P1 Q18 (structure and speed of response); 2020 P1 Q22 (HR flow and the PLC).')}
`),
    topic('3.6.4', 'Motivation and engagement', `
<h4>Theories (Taylor, Maslow, Herzberg) - know the mechanism</h4>
${table(['Theory', 'Key idea', 'Implication'], [
  ['Taylor (scientific management)', 'Workers are motivated by money; work should be broken into simple, measured tasks', 'Piece rate, close supervision, time-and-motion; suits repetitive work'],
  ['Maslow', 'Needs in order: physiological &rarr; safety &rarr; social &rarr; esteem &rarr; self-actualisation; a need must be met before the next motivates', 'Identify the unmet level: e.g. after redundancies, safety (job security) must be restored first'],
  ['Herzberg', 'Hygiene factors (pay, conditions, policy, supervision) prevent dissatisfaction; motivators (achievement, recognition, responsibility, advancement, the work itself) motivate', 'Fix hygiene first, then enrich jobs. TRAINING and development are motivators, not hygiene'],
])}
<h4>Methods</h4>
<p><strong>Financial</strong>: piece rate, commission, salary schemes, performance-related pay. <strong>Non-financial</strong>: empowerment, team working, flexible working, job enrichment (more responsibility - vertical), job rotation (variety - horizontal).</p>
${chain('using Maslow after redundancies', [
  'Redundancies make remaining staff fear for their jobs - their safety needs are threatened.',
  'Maslow says a lower need must be satisfied before higher needs motivate.',
  'So offering recognition or promotion now will have little effect.',
  'Managers should first rebuild security - honest communication about the future, secure contracts - then use esteem motivators.'])}
${evalBox(['the workforce (skills, pay level, what they value)', 'the nature of the job (scope for enrichment)', 'cost and ease of measuring output', 'the culture and the way the method is implemented'], 'whether financial or non-financial methods work better depends on')}
${mistake('Herzberg is often misapplied: training is a MOTIVATOR (growth/advancement), not a hygiene factor (2025 P2 report). In 2023 P1 Q20 many answers drifted to "more money" or other theories instead of Maslow.')}
${seen('2023 P1 Q20 (Maslow); 2021 P1 Q21 (financial v non-financial); 2020 P2 Q2.4 (Taylor for all businesses); 2022 P2 Q2.3 (Maslow and a venture); 2025 P2 Q2.3 (Herzberg).')}
`),
    topic('3.6.5', 'Employer-employee relations', `
<p>Employee representation: <strong>trade unions</strong> (collective bargaining over pay and conditions) and <strong>works councils</strong> (employee and manager representatives discussing workplace issues). Influences on involvement: leadership style, culture, size, the law, the type of decision.</p>
<p><strong>Value of good relations</strong>: fewer disputes and strikes, easier acceptance of change, better engagement and productivity, lower labour turnover, useful ideas from staff.</p>
${chain('consultation and resistance to change', [
  'Consulting unions early lets employees understand why change is needed.',
  'This reduces misunderstanding and lack of trust (Kotter and Schlesinger).',
  'Staff ideas may improve the plan and give them ownership.',
  'So resistance falls - but if the change means job losses, self-interest may still cause resistance.'])}
${mistake('2024 P2 Q2.3: a few students confused trade unions with trading blocs. Strong answers used real examples where consultation had not worked (rail workers, junior doctors) or industries with low union density (retail).')}
${seen('2024 P2 Q2.3 (trade unions and resistance to change).')}
`),
  ]);

  /* ===================================================== 3.7 */
  section(7, '3.7 Analysing the strategic position', 'Mission and strategy, SWOT, financial ratios, overall performance, PESTLE changes, CSR, five forces, investment appraisal', [
    topic('3.7.1', 'Mission, objectives, strategy and SWOT', `
<p>Mission &rarr; corporate objectives &rarr; strategy &rarr; functional objectives &rarr; tactics. Influences on corporate objectives include <strong>short-termism</strong> (shareholder pressure), <strong>ownership</strong>, and the internal and external environment.</p>
${def('Strategy v tactics', 'strategy = long-term plan to achieve corporate objectives (high cost, hard to reverse); tactics = short-term actions to implement it.')}
<h4>SWOT</h4>
<p>Strengths/weaknesses are <strong>internal</strong>; opportunities/threats are <strong>external</strong>. A recession is a threat, not a weakness; rising productivity is a strength, not an opportunity.</p>
${chain('how SWOT helps strategic planning', [
  'SWOT forces the owner to look at the external environment as well as his own business.',
  'It identifies threats such as healthy-eating concerns and highly income-elastic demand.',
  'A long-term response can then be built into the strategy - e.g. a lower-sugar range or budget options to protect sales in a downturn.',
  'This reduces the risk of strategic drift as the business expands.'])}
${evalBox(['the objectivity of whoever writes it (owners overrate strengths)', 'the quality and recency of the data used', 'whether it is acted on - SWOT describes; it does not decide', 'how fast the environment changes'], 'the usefulness of SWOT depends on')}
${mistake('2024 P3 Q4: answers that never linked SWOT to STRATEGIC planning stayed in Level 2. Make your chain end where the question ends.')}
${seen('2024 P3 Q4 (SWOT and strategic planning); 2024 P1 Q5 MCQ.')}
`),
    topic('3.7.2', 'Financial ratio analysis', `
${table(['Type', 'Ratio', 'Formula', 'What it tells you'], [
  ['Profitability', 'ROCE', 'Operating profit / capital employed x 100', 'Return generated on long-term capital; compare with interest rates and rivals'],
  ['Liquidity', 'Current ratio', 'Current assets : current liabilities', 'Ability to pay short-term debts; around 1.5-2:1 often seen as comfortable'],
  ['Gearing', 'Gearing', 'Non-current liabilities / capital employed x 100', 'Reliance on long-term debt; above 50% = high'],
  ['Efficiency', 'Payables days', 'Payables / cost of sales x 365', 'How long the business takes to pay suppliers'],
  ['Efficiency', 'Receivables days', 'Receivables / revenue x 365', 'How long customers take to pay'],
  ['Efficiency', 'Inventory turnover', 'Cost of sales / average inventories', 'Times inventory is sold and replaced per year'],
])}
${formula(['Capital employed = total equity + non-current liabilities'])}
${worked('current ratio after transactions', ['CA £24m, CL £16m. £10m loan received: CA +10', '£6m machinery: CA -6 (now a non-current asset)', '£2m overdraft repaid: CA -2 and CL -2', '£2m extra inventory: cash &rarr; inventory, CA unchanged', 'New ratio = 26 : 14 = 1.86:1'])}
${worked('gearing', ['NCL = loan £18m + debentures £12m = £30m (trade payables are current - exclude)', 'Capital employed = £45m + £30m = £75m', 'Gearing = 30 / 75 x 100 = 40%'])}
<p><strong>Value</strong>: compare over time and with competitors; spot problems early. <strong>Limits</strong>: historic; one-year snapshot; window dressing; ignores non-financial factors; need a benchmark to interpret.</p>
${mistake('2025 P1 Q16: many used net current assets instead of adding the current assets. 2023 P1 Q17: many ignored the transactions and used the original figures - showing uncertainty about what counts as a current asset or liability. 2023 P3 Q5: gearing of 28% described as "high".')}
${seen('2022 P1 Q16-18; 2023 P1 Q17; 2025 P1 Q16-17; 2024 P2 Q1.1; 2023 P2 Q1.2 and Q1.4; 2023 P3 Q5.')}
`),
    topic('3.7.3', 'Overall performance and core competences', `
<p>Use operations, HR and marketing data as well as financial statements, over time and against rivals. Distinguish <strong>short-term</strong> performance (this year's profit) from <strong>long-term</strong> (market position, brand, skills).</p>
${def('Core competence', 'a distinctive capability that gives customer benefit, is hard to imitate and can be applied across markets (e.g. a patented cooking method, battery technology).')}
${def("Elkington's Triple Bottom Line", 'judge performance on <strong>Profit</strong>, <strong>People</strong> (employees, community) and <strong>Planet</strong> (environment).')}
${chain('why ratios alone may not judge a charity\'s performance', [
  'A charity\'s mission is social, so profitability ratios say little about whether it achieves its purpose.',
  'People and Planet measures (beneficiaries helped, volunteer engagement, environmental impact) capture its real objectives.',
  'Liquidity and gearing still matter because the charity must survive to keep helping people.',
  'So a balanced scorecard of financial and non-financial measures is likely to be more useful.'])}
${seen('2024 P1 Q21 (ratios for non-profits); 2023 P2 Q2.4 (TBL and homeworking); 2020 P3 Q4 (most successful division).')}
`),
    topic('3.7.4', 'Political and legal change', `
<p>Laws on <strong>competition</strong> (preventing abuse of market power, mergers reviewed), the <strong>labour market</strong> (minimum wage, employment rights, discrimination) and the <strong>environment</strong> (emissions, packaging, low-emission zones). Government policy on <strong>enterprise</strong>, <strong>regulators</strong>, <strong>infrastructure</strong>, the <strong>environment</strong> and <strong>international trade</strong>.</p>
${chain('environmental legislation as an opportunity', [
  'A new law bans diesel cars from city centres, cutting demand for diesel models.',
  'Demand shifts to electric vehicles because all drivers face the same rules.',
  'A firm already investing in EVs gains share from rivals who are slower to adapt.',
  'So the same law that threatens laggards creates an opportunity for early movers.'])}
${mistake('2024 P2 Q3.3: answers confused legislation with voluntary ethics/CSR, and argued a firm gains a USP from following a law that applies equally to all competitors.')}
${seen('2024 P2 Q3.3 (environmental legislation); 2025 P3 Q5 (is legislation the biggest threat?).')}
`),
    topic('3.7.5', 'Economic change', `
${table(['Factor', 'Change', 'Typical effects'], [
  ['GDP', 'Growth / recession', 'Demand for income-elastic goods rises / falls'],
  ['Interest rates (monetary policy)', 'Rise', 'Borrowing costs up; consumer credit spending down; pound tends to rise'],
  ['Taxation (fiscal policy)', 'Cut income tax', 'Disposable income and demand up (also inflationary)'],
  ['Inflation', 'Rise', 'Costs up; real incomes squeezed; uncertainty for planning'],
  ['Exchange rate', 'Pound rises (SPICED)', 'Strong Pound: Imports Cheaper, Exports Dearer'],
  ['Trade', 'Protectionism (tariffs, quotas)', 'Exporters lose access; protected domestic firms gain'],
])}
${worked('exchange rate and export price', ['£8.00 product; £1 = $1.20 &rarr; $9.60', '£1 = $1.35 &rarr; $10.80', 'Price in the US rises 12.5%; with US PED of -1.8, sales could fall about 22%'])}
${mistake('Recurring errors: higher interest rates cause the pound to RISE (not fall); slower GDP growth is still growth, not a fall (2025 P2); rising unemployment means MORE people available for work, not fewer; fiscal policy is tax and spending - not interest rates (2025 P1 Q19).')}
${seen('2024 P1 Q20; 2021 P1 Q19; 2025 P1 Q19 (fiscal policy); 2022 P2 Q3.4 (falling pound); 2020 P2 Q2.2 (protectionism); 2025 P2 Q1.4.')}
`),
    topic('3.7.6', 'Social and technological change; CSR', `
<p>Social: demographic change, migration, changing lifestyles and buying behaviour, growth of online business. Technology changes every function and strategy.</p>
${def('CSR', 'the voluntary responsibilities a business accepts towards society beyond its legal obligations.')}
<h4>Carroll's CSR pyramid (base to top)</h4>
<p><strong>Economic</strong> (be profitable) &rarr; <strong>Legal</strong> (obey the law) &rarr; <strong>Ethical</strong> (do what is right) &rarr; <strong>Philanthropic</strong> (be a good corporate citizen).</p>
${def('Stakeholder v shareholder concept', 'consider all stakeholders\' interests v maximise returns to shareholders (Friedman).')}
<p><strong>For CSR</strong>: brand reputation, premium prices, recruitment/retention, investor ESG screening, avoids future regulation. <strong>Against</strong>: cost, competitive disadvantage in price-sensitive markets, "greenwashing" backlash if not genuine.</p>
${evalBox(['how publicly facing the business is and its target market', 'ownership and the mission (e.g. family firm v plc)', 'whether customers will pay for it', 'the time frame - short-run cost v long-run benefit'], 'whether CSR reduces profit depends on')}
${seen('2023 P2 Q3.4 (CSR only if forced?); 2020 P3 Q6 (CSR and profit); 2020 P2 Q2.1 (Carroll).')}
`),
    topic('3.7.7', 'The competitive environment: Porter\'s five forces', `
${table(['Force', 'Strong (bad for profit) when...'], [
  ['Threat of entry', 'Low barriers: little capital needed, no economies of scale, weak brands, no patents'],
  ['Buyer power', 'Few large buyers, standardised products, low switching costs (e.g. supermarkets v food producers)'],
  ['Supplier power', 'Few suppliers, unique inputs, high switching costs'],
  ['Rivalry', 'Many similar rivals, slow market growth, high fixed costs, high exit barriers'],
  ['Threat of substitutes', 'Close alternatives at similar prices (e.g. coffee v tea)'],
])}
<p>Use the forces to explain profitability and to shape strategy: build brands (reduce buyer power), integrate vertically (reduce supplier power), use patents/scale (raise barriers).</p>
${seen('2021 P1 Q23 (supplier power and rivalry); 2021 P2 Q1.5 (new entrants); 2025 P1 Q21 (five forces used in strong answers).')}
`),
    topic('3.7.8', 'Investment appraisal', `
${formula(['Payback = full years + (amount still to recover / net cash flow in the next year)', 'ARR (%) = average annual profit / initial investment x 100', '   where average annual profit = (total net returns - initial cost) / number of years', 'NPV = sum of (net cash flow x discount factor) - initial investment'])}
${worked('payback with uneven flows', ['Cost £150 000; flows £40k, £55k, £70k', 'After 2 years £95 000 recovered; £55 000 left', '55 / 70 = 0.79 of year 3 &rarr; 2.79 years (about 2 years 9 months)'])}
${worked('NPV', ['Cost £8m; flows £3m, £4m, £3m; DFs 0.93, 0.86, 0.79', 'PVs = 2.79 + 3.44 + 2.37 = 8.60', 'NPV = 8.60 - 8 = +£0.6m &rarr; financially worthwhile'])}
${table(['Method', '+', '-'], [
  ['Payback', 'Simple; focuses on liquidity and risk', 'Ignores cash after payback and profitability; no time value'],
  ['ARR', 'Uses all cash flows; % comparable with interest rates/targets', 'Ignores timing (time value of money)'],
  ['NPV', 'Time value of money; clear decision rule', 'Depends on the chosen discount rate; harder to understand'],
])}
<p>Factors influencing decisions: <strong>investment criteria</strong> (e.g. payback within 3 years, ARR above 10%), <strong>non-financial factors</strong> (staff, ethics, brand, strategic fit), <strong>risk and uncertainty</strong> (forecast accuracy, sensitivity analysis).</p>
${mistake('NPV: common errors are ignoring negative flows, ADDING the initial cost, and not stating £ or £m (2023 P2 Q1.1, 2024 P1 Q17). Forgetting to subtract the cost in ARR is the most common ARR error.')}
${seen('2024 P1 Q17 (NPV); 2023 P2 Q1.1 (NPV); 2021 P3 Q5 (Site A or B); 2020 P2 Q1.4 (Drake Hotels); 2024 P3 Q3 (payback/ARR on slushies).')}
`),
  ]);

  /* ===================================================== 3.8 */
  section(8, '3.8 Choosing strategic direction', "Ansoff's matrix, Porter's generic strategies, competitive advantage", [
    topic('3.8.1', "Which markets and products: Ansoff's matrix", `
${table(['', 'Existing products', 'New products'], [
  ['<strong>Existing markets</strong>', 'Market penetration (lowest risk)', 'Product development'],
  ['<strong>New markets</strong>', 'Market development', 'Diversification (highest risk)'],
])}
<p>Risk rises with distance from what the business knows. <strong>Related</strong> diversification (using core competences) is less risky than unrelated.</p>
${chain('why penetration may NOT be the best direction', [
  'Penetration relies on selling more of the same to the same customers.',
  'In a saturated or declining market, extra share must be won from rivals - often by price cuts.',
  'Price competition squeezes margins, so growth in profit is limited.',
  'Diversification, though riskier, spreads risk across markets and may offer higher long-run returns.'])}
${seen('2021 P1 Q24 (penetration v diversification); 2024 P1 Q6 MCQ.')}
`),
    topic('3.8.2', "How to compete: Porter's generic strategies and competitive advantage", `
${table(['', 'Broad target', 'Narrow target'], [
  ['<strong>Lowest cost</strong>', 'Cost leadership', 'Cost focus'],
  ['<strong>Differentiation</strong>', 'Differentiation', 'Differentiation focus'],
])}
${def('Cost leadership', 'having the lowest COSTS in the industry - the business may still charge average prices and earn higher margins.')}
${def('Differentiation', 'products perceived as different/better (quality, design, brand, service, innovation), supporting a premium price.')}
<p>Porter warned of being <strong>"stuck in the middle"</strong> - neither cheapest nor distinctive (e.g. a mid-market high-street retailer squeezed by discounters and online specialists).</p>
<h4>Competitive advantage</h4>
<p><strong>Benefits</strong>: higher margins or market share, resilience in downturns. <strong>Difficulties maintaining it</strong>: imitation, patents expiring, technological change, changing tastes, new entrants.</p>
${chain('why a small premium e-bike maker differentiates', [
  'It cannot match the economies of scale of mass-market producers, so it cannot be the cost leader.',
  'Its bikes are lighter, with longer battery life and a seven-year warranty - features customers value.',
  'These justify a £2 800 price versus £1 200 for mass-market rivals.',
  'Higher margins on lower volumes produce profit, sustained by continued innovation.'])}
${mistake('Strategic positioning now = Porter only in spec v2.0. Bowman\'s strategic clock appeared in 2023 and 2024 Paper 2 but is no longer named; you will be credited if you use it validly. Do not confuse differentiation with DIVERSIFICATION (2024 P3 report).')}
${evalBox(['the source of advantage and how easy it is to copy', 'the size of the business and access to economies of scale', 'customer price sensitivity', 'the rate of change in the market'])}
${seen('2024 P3 Q6 (innovation and differentiation); 2020 P1 Q24 (low cost to differentiation); 2021 P3 Q1 (focused differentiation); 2025 P1 Q23 (investment and competitive advantage).')}
`),
  ]);

  /* ===================================================== 3.9 */
  section(9, '3.9 Strategic methods: how to pursue strategies', 'Growth and retrenchment, economies of scale, integration, franchising, innovation, globalisation, digital technology', [
    topic('3.9.1', 'Assessing a change in scale', `
<p><strong>Why grow</strong>: economies of scale, market power, survival, managers' ambitions. <strong>Why retrench</strong>: falling demand, overcapacity, refocusing on core activities.</p>
${table(['Organic growth', 'External growth'], [
  ['New stores, products or markets from within', 'Mergers, takeovers, ventures (joint ventures), franchising'],
  ['Slower, lower risk, keeps culture and control; financed from retained profit', 'Fast; gains capacity, brands or know-how; risk of overpaying, culture clash, loss of control'],
])}
${table(['Integration', 'Meaning', 'Example'], [
  ['Horizontal', 'Same stage of production', 'One brewer buys another'],
  ['Backward vertical', 'Towards suppliers', 'Car maker buys a battery supplier'],
  ['Forward vertical', 'Towards customers', 'Brewer buys a pub chain'],
  ['Conglomerate', 'Unrelated market', 'Food firm buys an insurer'],
])}
<p><strong>Economies of scale</strong>: technical, purchasing, managerial. <strong>Economies of scope</strong>: shared costs across a range of products. <strong>Diseconomies</strong>: communication, coordination, motivation problems. <strong>Synergy</strong>: combined worth more than the parts. <strong>Overtrading</strong>: growing too fast without working capital.</p>
<h4>Franchising</h4>
<p>Franchisee pays an initial fee plus royalties (e.g. 10% of revenue) to use the brand and model, with training and support. <strong>For the franchisor</strong>: rapid growth using franchisees' capital and motivated owner-managers. <strong>Against</strong>: less control over standards; reputation risk; share of profit given up.</p>
${chain("why organic growth reduces an owner's risk of losing control", [
  'A takeover adds a whole new business with its own managers and culture.',
  'The larger organisation needs more layers of hierarchy or wider spans of control.',
  'Communication from the owner becomes slower and supervision weaker.',
  'So the mission can be diluted - organic growth avoids this by growing at a manageable pace.'])}
${mistake('2023 P3 Q2: students could say organic growth is "less risky" but few explained WHY - that missing link kept answers in Level 2. 2024 P3 report: some believed franchisees operate with no control at all from the franchisor. 2023 P1 Q22: weaker essays discussed rising TOTAL costs instead of UNIT costs.')}
${seen('2023 P3 Q2 (organic growth); 2024 P3 Q5 (organic v franchising); 2023 P1 Q22 (unit costs with growth); 2022 P2 Q2.4 (ventures); 2020 P2 Q3.4 (franchising); 2025 P3 Q2 (retrenchment).')}
`),
    topic('3.9.2', 'Assessing innovation', `
<p><strong>Product</strong> innovation (what is sold) v <strong>process</strong> innovation (how it is made/delivered). Ways to become innovative: <strong>kaizen, research and development, intrapreneurship, benchmarking</strong>. Protection: <strong>patents</strong> (applied for, up to 20 years) and <strong>copyright</strong> (automatic for creative work and software).</p>
${chain('how copyright supported a software firm\'s growth', [
  'The firm\'s security code is protected automatically by copyright.',
  'Rivals cannot copy it, so the firm keeps a unique product.',
  'Customers must buy from the firm, supporting premium prices and rapid sales growth.',
  'The protected code is also the main asset a competitor would pay £50m to acquire.'])}
${evalBox(['the culture (task culture encourages ideas; role culture may stifle them)', 'the level and focus of R&D spending', 'how quickly rivals can imitate', 'whether the innovation meets a real customer need'])}
${seen('2022 P3 Q2 (copyright and growth); 2020 P1 Q23 (R&D v culture); 2024 P3 Q6 (innovation and differentiation); 2025 P1 Q20 (HR and innovation).')}
`),
    topic('3.9.3', 'Globalisation and internationalisation', `
<p>Reasons: new markets, spreading risk, cheaper resources, economies of scale. <strong>Emerging economies</strong> (e.g. India, Vietnam) are attractive as markets (growing middle class) AND as sources of cheap labour and materials.</p>
${table(['Entry method', '+', '-'], [
  ['Export', 'Low risk and cost', 'Tariffs, transport costs, exchange-rate risk'],
  ['Licensing', 'Royalties with little investment', 'Less control; partner may become a rival'],
  ['Alliances / joint ventures', 'Local knowledge and shared risk', 'Shared profit; possible conflict'],
  ['Direct investment', 'Full control; avoids tariffs', 'High cost and risk'],
])}
<p><strong>Off-shoring</strong> moves production abroad (lower costs); <strong>re-shoring</strong> brings it back (quality, lead times, supply-chain security, rising overseas wages). Managing international business: <strong>pressures for local responsiveness</strong> v <strong>pressures for cost reduction</strong> (multi-domestic v global strategy).</p>
${seen('2023 P1 Q23 (emerging economies); 2021 P3 Q6 (re-shoring); 2020 P3 Q2 (multi-domestic); 2025 P1 Q21 (multinationals in stagnant markets); 2025 P3 (factory in Vietnam).')}
`),
    topic('3.9.4', 'Assessing greater use of digital technology', `
<p>Spec list: <strong>automation, e-commerce, big data, data mining</strong>. Pressures: competitors adopting it, customer expectations, cost reduction.</p>
<p><strong>Value</strong>: lower unit costs, consistency, 24/7 sales, personalised marketing from data, better forecasting. <strong>Drawbacks</strong>: capital cost, security risks, redundancies and resistance, rapid obsolescence.</p>
${evalBox(['the product (bespoke services may need people)', 'the scale and access to finance', 'the target market\'s digital habits', 'how well staff are trained and change is managed'], 'whether digital technology always improves performance depends on')}
${seen('2022 P1 Q23 (e-commerce); 2020 P1 Q20 (digital tech and small businesses); 2025 P1 Q1 MCQ (data mining).')}
`),
  ]);

  /* ===================================================== 3.10 */
  section(10, '3.10 Managing strategic change', 'Types of change, Lewin, flexible organisations, Kotter and Schlesinger, Handy\'s cultures, network analysis, strategic drift, planning', [
    topic('3.10.1', 'Managing change', `
<p>Types: <strong>internal</strong> v <strong>external</strong>; <strong>incremental</strong> (gradual) v <strong>disruptive</strong> (sudden, radical).</p>
<h4>Lewin's force field analysis - the mechanism</h4>
<p>List <strong>driving forces</strong> (pushing for change) and <strong>restraining forces</strong> (resisting it), and weight them. Change happens when drivers <strong>outweigh</strong> restrainers - so ask what has changed to shift the balance <em>now</em>. Managers can strengthen drivers or weaken restrainers.</p>
${chain('Lewin: why change is happening now', [
  'Energy costs have risen 60% and profit has fallen by almost two-thirds - strong new driving forces.',
  'Complaints about inconsistent quality have doubled, adding another driver.',
  'Restraining forces - staff loyalty, family directors, the loan cost - have not disappeared.',
  'But the drivers have grown until they outweigh the restrainers, so the change goes ahead now.'])}
${mistake('2025 P3 Q1 (Lewin): many knew the terms but not the mechanics; some labelled negative driving forces (e.g. a shrinking market) as restraining forces. Top answers focused on the word "now".')}
<h4>Flexible organisations</h4>
<p>Restructuring, delayering, flexible employment contracts (part-time, temporary, zero-hours), organic v mechanistic structures, knowledge and information management.</p>
<h4>Kotter and Schlesinger</h4>
${table(['Reasons for resistance', 'Ways of overcoming it'], [
  ['Parochial self-interest', 'Education and communication'],
  ['Misunderstanding and lack of trust', 'Participation and involvement'],
  ['Different assessments of the situation', 'Facilitation and support'],
  ['Low tolerance of change', 'Negotiation and agreement'],
  ['', 'Manipulation and co-optation'],
  ['', 'Explicit and implicit coercion'],
])}
${tip('Match the method to the cause: misunderstanding &rarr; education; self-interest from job losses &rarr; negotiation (redundancy terms); low tolerance &rarr; facilitation and support (training).')}
${seen('2023 P2 Q3.3 (Lewin); 2025 P3 Q1 (Lewin); 2024 P2 Q2.3 (consultation); 2022 P1 Q25 (flexible contracts and ethics).')}
`),
    topic('3.10.2', "Managing organisational culture: Handy's cultures", `
${table(['Culture', 'Description', 'Suits', 'Weakness'], [
  ['Power', 'Decisions centred on one person or small group', 'Small/founder-led firms; fast decisions needed', 'Depends on one person; staff may not use initiative'],
  ['Role', 'Rules, procedures, job descriptions (bureaucracy)', 'Large, stable environments; consistency', 'Slow to adapt'],
  ['Task', 'Project teams; power from expertise', 'Innovation, consultancy, creative work', 'Hard to control; costly'],
  ['Person', 'Individuals more important than the organisation', 'Barristers, partnerships of professionals', 'Hard to coordinate'],
])}
<p>Changing culture is hard: deep-rooted values, resistance, takes years. Reasons to change: new strategy, poor performance, merger, new leader.</p>
${chain('why an underperforming role culture might move towards a power culture', [
  'A role culture relies on procedures, so change requires consultation and approval at many levels.',
  'In a fast-changing market this makes the business slow to respond to the causes of underperformance.',
  'A power culture concentrates decisions in a few hands, so a turnaround can be decided quickly and applied consistently.',
  'Faster, coordinated responses help restore performance.'])}
${seen('2024 P1 Q19 (role to power); 2022 P3 Q4 (power to role); 2020 P2 Q3.2 (power culture).')}
`),
    topic('3.10.3', 'Managing strategic implementation and network analysis', `
<p>Effective implementation needs <strong>leadership</strong> (vision, drive), <strong>communication</strong> (everyone understands their role), the right <strong>organisational structure</strong> and planning tools such as <strong>network analysis</strong>.</p>
${formula(['Earliest start time (EST) - forward pass: the largest EST + duration of the activities leading in', 'Latest finish time (LFT) - backward pass: the smallest LFT - duration of the activities leading out', 'Total float = LFT - duration - EST', 'Critical path = activities with zero float; its length = minimum project duration'])}
${worked('critical path and float', ['A(3) &rarr; B(6), C(8), D(4); E(3) after B and D; F(2) after C and E', 'Paths: A-B-E-F = 14, A-D-E-F = 12, A-C-F = 13 &rarr; critical path A-B-E-F, 14 weeks', 'Float D = 9 - 3 - 4 = 2 weeks; float C = 12 - 3 - 8 = 1 week', 'If B takes 8 weeks the project takes 16 weeks'], 'A delay to a critical activity delays the whole project by the same amount.')}
<p><strong>Value</strong>: realistic completion date, identifies activities to monitor, shows where resources can be moved (float), supports JIT ordering. <strong>Limits</strong>: estimates may be wrong; doesn't guarantee completion; needs updating.</p>
${seen('2021 P1 Q16 (critical path and float); 2024 P1 Q14-15 MCQs; 2021 P3 Q4; 2025 P3 Q3 (factory in a year?); 2023 P3 Q6 (growth and leadership).')}
`),
    topic('3.10.4', 'Problems with strategy and why strategies fail', `
${def('Planned v emergent strategy', 'planned = deliberately designed in advance; emergent = forms over time as the business responds to events (Mintzberg).')}
${def('Strategic drift', 'the business\'s strategy gradually fails to keep pace with a faster-changing environment - incremental change inside, rapid change outside (e.g. HMV and streaming).')}
<p>Causes of strategic failure: poor implementation, weak leadership or communication, wrong structure, unforeseen external change, inaccurate forecasts. <strong>Contingency planning</strong> prepares for possible events in advance; <strong>crisis management</strong> deals with them as they happen.</p>
${chain('why strategic drift happens', [
  'A long-established business has been successful with its existing formula.',
  'Managers become complacent and the culture resists radical change.',
  'Meanwhile customers move online quickly, so the gap between strategy and market widens.',
  'By the time the business notices (flux), it must transform rapidly or decline.'])}
${evalBox(['the speed of change in the market', 'the flexibility of the structure and culture', 'the quality of leadership and environmental scanning', 'whether the business uses both planned and emergent strategy'], 'whether drift is inevitable depends on')}
${mistake('2024 P1 Q23: many students thought strategic drift was a deliberate, planned change of strategy - it is the opposite. 2023 P1 Q21: weaker answers discussed planning in general rather than CONTINGENCY planning.')}
${seen('2024 P1 Q23 (strategic drift); 2023 P1 Q21 (contingency plans); 2022 P3 Q6 (strategic planning); 2022 P2 Q3.5 (contingency planning).')}
`),
  ]);
})();
