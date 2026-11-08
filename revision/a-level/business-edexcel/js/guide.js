/* guide — hand-written RA10 content. Generated from training-data/a-level/alevel-build/content/business-edexcel/guide/ (edit the parts there, then run build_alevel.py). */

/* ---- 00_head.js ---- */
/* Pearson Edexcel A-level Business (9BS0) — RA10 revision guide. One part per theme; parts register into T / TITLE / SUB. */
(function () {
  'use strict';
  const { svg: S, h: H } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, ol, example, stats, check, two, steps, cards, formula } = H;
  const P = { blue: '#2563eb', sky: '#0284c7', teal: '#0d9488', green: '#16a34a', amber: '#d97706', orange: '#ea580c', red: '#dc2626', pink: '#db2777', violet: '#7c3aed', slate: '#64748b', navy: '#1e3a8a' };
  const T = {}, TITLE = {}, SUB = {};
  const p = (...xs) => xs.map(x => `<p>${x}</p>`).join('');
  const h3 = (t) => `<h3>${t}</h3>`;
  const eval2 = (pro, con, judge) => `<div class="g-callout g-key"><strong>Assessing it (analysis → evaluation)</strong><div>${two(`<h4>Arguments for</h4>${ul(pro)}`, `<h4>Counterbalance</h4>${ul(con)}`)}${judge ? `<p><b>Judgement depends on:</b> ${judge}</p>` : ''}</div></div>`;
  const calc = (title, lines) => example(title, lines.map(l => `<div>${l}</div>`).join(''));

  const setTask = () => `
${stats([['3', 'papers, all compulsory'], ['2 hours', 'each paper'], ['100', 'marks per paper'], ['33⅓%', 'of the A-level each'], ['10%+', 'quantitative skills']])}
${p('Every paper is built on <b>extracts</b> about real businesses: read them, then answer questions that must be <b>applied</b> to that business. Each paper has two sections of 50 marks (one question with parts (a)–(e) in each). Paper 3 is based on a <b>pre-released context</b> (an industry announced the November before the exam) and uses all four themes.')}
${fig(S.ladder([['Paper 1 · Marketing, people and global businesses', 'Themes 1 and 4 · 100 marks · data response'], ['Paper 2 · Business activities, decisions and strategy', 'Themes 2 and 3 · 100 marks · data response'], ['Paper 3 · Investigating business in a competitive environment', 'All themes · 100 marks · pre-released context + unseen extracts']], { w: 700, rowH: 58, label: 'The three papers' }), 'All three papers: 2 hours, 100 marks, two sections of 50 marks.')}
${h3('Question types and the four skills')}
${table(['Marks', 'Command word', 'Skills (typical split)', 'What gets top marks'], [['4', 'Explain / Calculate', 'Knowledge 1, Application 2, Analysis 1 – or formula + working + answer', 'A definition, two points of context and one consequence (“so…”); calculations: formula, correct numbers, units and precision'], ['8', 'Analyse / Assess two', 'K2, A2, An2, Ev2 (Paper 3 “Assess two…”)', 'Two developed factors, each applied, with a brief weighing'], ['10', 'Assess', 'K2, A2, An3, Ev3', 'Developed chains of reasoning for and against, used with the extract data, and a supported judgement'], ['12', 'Assess', 'K2, A2, An4, Ev4', 'As 10 marks, with a wider-ranging balanced assessment'], ['20', 'Evaluate (two options / to what extent)', 'K4, A4, An6, Ev6', 'Both options analysed in context, weighed against each other, and a justified recommendation that says what it depends on']])}
${fig(S.flow([['Knowledge', 'define the term accurately'], ['Application', 'use the extract: names, numbers, quotes'], ['Analysis', 'chains of reasoning: because… this means… so…'], ['Evaluation', 'weigh up, counterbalance, judge – “it depends on…”']], { w: 700, h: 88, label: 'The four assessment objectives' }), 'Each level of the mark scheme rewards all four – application must run through the whole answer.')}
${h3('How the levels work')}
${table(['Level', '10-mark band', 'Descriptor (summary)'], [['1', '1–2', 'Isolated knowledge; weak or no application; generic assertions'], ['2', '3–4', 'Knowledge applied to the business; chains of reasoning presented but incomplete; superficial assessment'], ['3', '5–6', 'Accurate knowledge; developed chains of reasoning; an attempt at an assessment using the data, but competing arguments not weighed'], ['4', '7–10', 'Coherent, logical chains; balanced, well-contextualised assessment showing competing arguments, leading to a supported judgement']])}
${h3('The 20-mark recommendation')}
${steps(['<b>Define</b> both options briefly (K).', '<b>Option 1:</b> two developed benefits using the extract data, then a drawback (A, An).', '<b>Option 2:</b> the same (A, An).', '<b>Weigh</b> them against the objective in the question – which one achieves it better, and why? (Ev)', '<b>Recommend</b> one option, justify it with the data, and say what the decision <b>depends on</b> (eg costs, competitors, time scale). (Ev)'])}
${tip('Examiners report that the most common reason for missing Level 4 is a judgement that does not follow from the analysis. Your conclusion should add something new – a “depends on” factor or the most important reason – not repeat the paragraphs above.', 'Examiner advice')}
${h3('Quantitative skills')}
${check(['Percentages and percentage changes; market share; averages', 'Price and income elasticity', 'Break-even, contribution, margin of safety', 'Profit, profit margins and ratios (current, acid test, gearing, ROCE)', 'Labour productivity, turnover, capacity utilisation', 'Investment appraisal (payback, ARR, NPV), decision trees, critical path, moving averages', 'Interpreting index numbers, tables, charts and exchange rates'])}
${warn('Always show your working and the formula: most 4-mark calculations give 1 mark for the formula/knowledge and 2 for the method, so a wrong final answer can still score 3. Give the units (%, £, units) and the precision asked for (eg 2 decimal places).', 'Calculations')}`;

/* ---- 01_theme1.js ---- */
  /* ===== Theme 1: Marketing and people ===== */
  TITLE.A = 'Meeting customer needs'; SUB.A = 'Theme 1 · 1.1 — the market, market research and market positioning (Papers 1 and 3)';
  T.A = [
    { code: '1.1.1', name: 'The market', html: () => `
${two(`<h4>Mass market</h4>${ul(['Large number of customers, standardised products', 'Economies of scale, low unit costs', 'Strong competition, often on price', 'eg Coca-Cola, Tesco'])}`, `<h4>Niche market</h4>${ul(['Small, specialised segment of a larger market', 'Higher prices, loyal customers, less competition', 'Lower volumes, vulnerable to change', 'eg Fentimans, Brompton bikes'])}`)}
${formula('Market share', 'business sales ÷ total market sales × 100', 'Market size = total sales (value £ or volume units) of all businesses')}
${calc('Worked example', ['Market worth £40m; business sales £6m.', 'Market share = 6 ÷ 40 × 100 = <b>15%</b>.', 'If the market grows to £50m and sales rise to £7m, share = 14% – sales grew, but share fell.'])}
${p('<b>Dynamic markets</b> change quickly – online retailing, innovation and changing tastes mean businesses must adapt. <b>Competition</b> drives prices down and innovation up. <b>Risk</b> can be measured (eg from past data); <b>uncertainty</b> cannot.')}
${tip('Market share and market size are different: a business can lose share in a growing market even while its sales rise. Examiners reward students who spot this in the extract data.')}` },
    { code: '1.1.2', name: 'Market research', html: () => `
${p('Market research identifies and anticipates customer needs and wants, quantifies likely demand and gives insight into consumer behaviour.')}
${fig(S.matrix([{ h: 'Primary', tag: 'first-hand', items: ['Surveys, interviews, focus groups', 'Specific and up to date', 'Expensive and slow'] }, { h: 'Secondary', tag: 'existing data', items: ['Reports, government data, websites', 'Cheap and quick', 'May be out of date / not specific'] }, { h: 'Quantitative', tag: 'numbers', items: ['Sales data, closed questions', 'Easy to analyse statistically', 'Does not explain why'] }, { h: 'Qualitative', tag: 'opinions', items: ['Focus groups, open questions', 'Reasons and feelings', 'Hard to analyse; small samples'] }], { label: 'Types of market research' }), 'Most businesses combine types.')}
${p('<b>Limitations:</b> sample size and bias (a small or unrepresentative sample may mislead). <b>ICT</b> helps – websites, social networking and databases give fast, cheap insight. <b>Product vs market orientation:</b> start from the product vs start from customer needs.')}
${p('<b>Market segmentation</b> splits a market by demographic (age, income), geographic, psychographic (lifestyle) or behavioural (usage) factors, so the marketing mix can be targeted.')}
${warn('“Market research is expensive” is a generic assertion. Say <i>why</i> it matters for <i>this</i> business – eg a start-up with limited cash may rely on secondary data, which may not reflect its local market.')}` },
    { code: '1.1.3', name: 'Market positioning', html: () => `
${fig(`<svg viewBox="0 0 640 330" role="img" aria-label="Market map" style="width:100%;max-width:640px;height:auto;font-family:inherit" fill="currentColor"><line x1="320" y1="20" x2="320" y2="310" stroke="currentColor" opacity=".4" stroke-width="2"/><line x1="40" y1="165" x2="600" y2="165" stroke="currentColor" opacity=".4" stroke-width="2"/><text x="320" y="14" font-size="12" text-anchor="middle" font-weight="700">High price</text><text x="320" y="326" font-size="12" text-anchor="middle" font-weight="700">Low price</text><text x="44" y="158" font-size="12" font-weight="700">Low quality</text><text x="596" y="158" font-size="12" text-anchor="end" font-weight="700">High quality</text>${[['Rolex', 540, 50, P.violet], ['Apple Watch', 450, 90, P.blue], ['Casio', 250, 230, P.teal], ['Supermarket own-brand', 140, 280, P.slate], ['Gap?', 470, 230, P.green]].map(([t, x, y, c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/><text x="${x + 14}" y="${y + 4}" font-size="12">${t}</text>`).join('')}</svg>`, 'A market map (price vs quality) – the empty high-quality, lower-price space may be a gap in the market (or there may be no demand).')}
${p('<b>Competitive advantage</b> comes from differentiation or lower costs. <b>Product differentiation</b> makes a product distinct (design, brand, features, service) so demand becomes less price elastic. <b>Adding value</b> increases the difference between price and the cost of inputs – through branding, quality, convenience or USPs.')}
${tip('A gap on a market map is only an opportunity if research shows customers want it and the business can serve it profitably.')}` }
  ];

  TITLE.B = 'Market'; SUB.B = 'Theme 1 · 1.2 — demand, supply, markets and elasticities';
  T.B = [
    { code: '1.2.1', name: 'Demand', html: () => `
${p('Demand is the quantity customers are willing and able to buy at each price. A change in <b>price</b> moves along the curve; other factors <b>shift</b> it.')}
${fig(S.lines([{ name: 'D1', col: P.blue, pts: [[1, 90], [9, 10]] }, { name: 'D2 (after a rise in demand)', col: P.green, pts: [[3, 90], [11, 10]] }], { h: 240, ymin: 0, ymax: 100, xmin: 0, xmax: 12, xlabels: [[0, '0'], [6, 'Quantity'], [12, '']], label: 'A shift in demand' }), 'Demand shifts right (D1 → D2) when, eg, incomes rise for a normal good, a successful advert runs or a substitute becomes dearer.')}
${table(['Factor', 'Example of a rightward shift'], [['Prices of substitutes', 'Rival’s coffee price rises'], ['Prices of complements', 'Price of games consoles falls → more games demanded'], ['Consumer incomes', 'Rising incomes (normal goods)'], ['Fashions, tastes, preferences', 'Plant-based diets'], ['Advertising and branding', 'Successful campaign'], ['Demographics', 'Ageing population → more demand for care homes'], ['External shocks', 'Pandemic → home-gym equipment'], ['Seasonality', 'Ice cream in summer']])}` },
    { code: '1.2.2', name: 'Supply', html: () => `
${p('Supply is the quantity producers are willing and able to sell at each price. Shifts are caused by:')}
${ul(['<b>Costs of production</b> – higher wages or raw material costs shift supply left', '<b>New technology</b> – lower costs shift supply right', '<b>Indirect taxes</b> (eg VAT, duty) shift supply left', '<b>Subsidies</b> shift supply right', '<b>External shocks</b> – eg a poor harvest, war, pandemic'])}` },
    { code: '1.2.3', name: 'Markets', html: () => `
${fig(`<svg viewBox="0 0 560 320" role="img" aria-label="Supply and demand diagram" style="width:100%;max-width:560px;height:auto;font-family:inherit" fill="currentColor"><line x1="60" y1="20" x2="60" y2="280" stroke="currentColor" stroke-width="2"/><line x1="60" y1="280" x2="520" y2="280" stroke="currentColor" stroke-width="2"/><text x="20" y="40" font-size="12">Price</text><text x="470" y="302" font-size="12">Quantity</text><line x1="90" y1="50" x2="460" y2="260" stroke="${P.blue}" stroke-width="3"/><text x="462" y="262" font-size="12" fill="${P.blue}">D</text><line x1="90" y1="260" x2="430" y2="40" stroke="${P.red}" stroke-width="3"/><text x="432" y="38" font-size="12" fill="${P.red}">S1</text><line x1="160" y1="260" x2="500" y2="40" stroke="${P.green}" stroke-width="3" stroke-dasharray="6 4"/><text x="502" y="38" font-size="12" fill="${P.green}">S2</text><circle cx="272" cy="170" r="5" fill="currentColor"/><circle cx="315" cy="195" r="5" fill="currentColor"/><line x1="60" y1="170" x2="272" y2="170" stroke="currentColor" stroke-dasharray="3 3" opacity=".6"/><line x1="60" y1="195" x2="315" y2="195" stroke="currentColor" stroke-dasharray="3 3" opacity=".6"/><text x="32" y="174" font-size="12">P1</text><text x="32" y="199" font-size="12">P2</text><line x1="272" y1="170" x2="272" y2="280" stroke="currentColor" stroke-dasharray="3 3" opacity=".6"/><line x1="315" y1="195" x2="315" y2="280" stroke="currentColor" stroke-dasharray="3 3" opacity=".6"/><text x="262" y="298" font-size="12">Q1</text><text x="308" y="298" font-size="12">Q2</text></svg>`, 'A fall in costs shifts supply right (S1 → S2): excess supply at P1, so price falls to P2 and quantity rises to Q2.')}
${steps(['Draw and label axes (Price, Quantity) and the original curves and equilibrium (P1, Q1).', 'Shift the correct curve in the correct direction and label it (S2 or D2).', 'Mark the new equilibrium (P2, Q2).', 'Explain: excess demand/supply at the old price pushes price to the new equilibrium.'])}` },
    { code: '1.2.4', name: 'Price elasticity of demand', html: () => `
${formula('PED', '% change in quantity demanded ÷ % change in price', 'Ignore the minus sign when judging elasticity: >1 elastic, <1 inelastic')}
${calc('Worked example', ['Price rises from £2.50 to £3.00 (+20%); sales fall from 1 000 to 900 (−10%).', 'PED = −10 ÷ 20 = <b>−0.5</b> → price inelastic.', 'Revenue: before £2 500; after £2 700 → a price rise <b>increases</b> revenue when demand is inelastic.'])}
${table(['', 'Elastic (PED > 1)', 'Inelastic (PED < 1)'], [['Price rise', 'Revenue falls', 'Revenue rises'], ['Price cut', 'Revenue rises', 'Revenue falls'], ['Typical products', 'Many substitutes, luxuries, large share of income', 'Necessities, strong brands, addictive goods']])}
${p('<b>Factors:</b> number and closeness of substitutes, brand loyalty, necessity vs luxury, proportion of income spent, time.')}` },
    { code: '1.2.5', name: 'Income elasticity of demand', html: () => `
${formula('YED', '% change in quantity demanded ÷ % change in income', 'Negative = inferior; 0 to 1 = normal necessity; above 1 = luxury (income elastic)')}
${calc('Worked example', ['Incomes rise 5%; demand for a value range falls 2%.', 'YED = −2 ÷ 5 = <b>−0.4</b> → an inferior good.'])}
${tip('Use YED to explain the effect of a recession or boom: luxury products (YED > 1) suffer most in a recession, while discount retailers selling inferior goods may gain.')}` }
  ];

  TITLE.C = 'Marketing mix and strategy'; SUB.C = 'Theme 1 · 1.3 — design, branding and promotion, pricing, distribution and marketing strategy';
  T.C = [
    { code: '1.3.1', name: 'Product/service design', html: () => `
${fig(S.venn(['Function', 'Aesthetics', 'Economic manufacture'], 'Design mix', { label: 'The design mix' }), 'The right balance depends on the target market: function for safety equipment, aesthetics for fashion, cost for budget ranges.')}
${p('Design increasingly reflects <b>social trends</b>: concern for the environment and resource depletion – sustainable materials, waste minimisation, design for re-use, repair and recycling.')}` },
    { code: '1.3.2', name: 'Branding and promotion', html: () => `
${table(['Promotion', 'Examples'], [['Advertising', 'TV, cinema, online, outdoor'], ['Sponsorship', 'Sports teams, events'], ['Public relations', 'Press releases, events'], ['Social media / viral marketing', 'Influencers, user-generated content'], ['Emotional marketing', 'Appeals to feelings – nostalgia, belonging']])}
${p('<b>Types of brand:</b> manufacturer brands and own-label brands. Strong brands create loyalty, allow premium prices (less price elastic demand) and make new launches easier. <b>Methods of branding:</b> logos, slogans, packaging, celebrity endorsement.')}` },
    { code: '1.3.3', name: 'Pricing strategies', html: () => `
${fig(S.tiles([['Cost-plus', 'cost + mark-up: simple, covers costs, ignores demand', P.slate], ['Price skimming', 'high launch price for innovative products, then reduced', P.violet], ['Penetration', 'low launch price to gain share, then raised', P.blue], ['Predatory', 'very low price to drive rivals out (may be illegal)', P.red], ['Competitive', 'price set close to rivals', P.teal], ['Psychological', '£9.99 not £10', P.amber], ['Dynamic', 'changes with demand, eg online/airlines', P.pink]], { cols: 3, th: 84, w: 700, label: 'Pricing strategies' }), 'Factors: number of USPs/differentiation, PED, competition, strength of brand, stage in the product life cycle, costs and the need to make a profit.')}` },
    { code: '1.3.4', name: 'Distribution', html: () => `
${fig(S.flow([['Producer', 'manufacturer'], ['Wholesaler', 'bulk breaking'], ['Retailer', 'stores, online'], ['Consumer', '']], { w: 680, h: 76, label: 'A traditional distribution channel' }), 'Shorter channels (direct to consumer, online) keep more margin and customer data; longer channels give wider reach.')}
${p('Changes from product to service and from physical to <b>multi-channel</b> distribution: online, apps, click-and-collect, marketplaces.')}` },
    { code: '1.3.5', name: 'Marketing strategy', html: () => `
${fig(S.plc(null, { label: 'Product life cycle' }), 'Development, introduction, growth, maturity, decline. Extension strategies (new features, new markets, repackaging, promotion) lengthen maturity.')}
${fig(S.matrix([{ h: 'Star', tag: 'high share · high growth', items: ['Needs investment', 'Future cash cow'] }, { h: 'Question mark', tag: 'low share · high growth', items: ['Invest or drop?', 'Uses cash'] }, { h: 'Cash cow', tag: 'high share · low growth', items: ['Generates cash', 'Funds other products'] }, { h: 'Dog', tag: 'low share · low growth', items: ['Consider withdrawing', 'Or reposition'] }], { cols: [P.amber, P.blue, P.green, P.red], label: 'Boston matrix' }), 'Used to manage a balanced product portfolio.')}
${p('Strategies differ for <b>mass vs niche</b> markets and for <b>B2B vs B2C</b>; <b>customer loyalty</b> is built through service, loyalty schemes and brand.')}` }
  ];

  TITLE.D = 'Managing people'; SUB.D = 'Theme 1 · 1.4 — staffing, recruitment, organisational design, motivation and leadership';
  T.D = [
    { code: '1.4.1', name: 'Approaches to staffing', html: () => `
${two(`<h4>Staff as an asset</h4>${ul(['Invest in training and development', 'Skills create competitive advantage', 'Higher motivation and retention'])}`, `<h4>Staff as a cost</h4>${ul(['Minimise wages and numbers', 'Use flexible contracts', 'Risk of low morale and high turnover'])}`)}
${p('<b>Flexible workforce:</b> multi-skilling, part-time and temporary staff, flexible hours and home working, outsourcing, zero-hours contracts. <b>Dismissal and redundancy</b>; <b>employer–employee relations</b> – individual and collective bargaining, trade unions.')}` },
    { code: '1.4.2', name: 'Recruitment, selection and training', html: () => `
${fig(S.flow([['Job analysis', 'description + person spec'], ['Advertise', 'internal or external'], ['Shortlist', 'CVs, applications'], ['Select', 'interviews, tests, assessment centres'], ['Appoint & induct', '']], { w: 700, h: 84, label: 'Recruitment and selection' }), 'Costs of recruitment, selection and training are significant – poor choices raise labour turnover.')}
${table(['Training', 'Pros', 'Cons'], [['Induction', 'Settles new staff quickly', 'Time and cost'], ['On-the-job', 'Cheap, relevant', 'May pass on bad habits; disrupts output'], ['Off-the-job', 'Specialist, wider skills', 'Expensive; staff may leave after training']])}` },
    { code: '1.4.3', name: 'Organisational design', html: () => `
${fig(S.org({ t: 'Managing director', kids: [{ t: 'Marketing', kids: [{ t: 'Team' }, { t: 'Team' }] }, { t: 'Operations', kids: [{ t: 'Team' }, { t: 'Team' }, { t: 'Team' }] }, { t: 'Finance', kids: [{ t: 'Team' }] }] }, { label: 'A hierarchical structure' }), 'Hierarchy, chain of command, span of control; tall, flat and matrix structures; centralisation vs decentralisation.')}
${table(['Structure', 'Advantages', 'Disadvantages'], [['Tall', 'Close supervision, clear promotion routes', 'Slow communication, costly management'], ['Flat', 'Fast decisions, empowerment, cheaper', 'Wide spans, managers overstretched'], ['Matrix', 'Project teams draw on expertise', 'Two bosses, confusion']])}` },
    { code: '1.4.4', name: 'Motivation in theory and practice', html: () => `
${fig(S.pyramid([['Physiological', 'pay'], ['Safety', 'job security'], ['Social', 'teams'], ['Esteem', 'recognition'], ['Self-actualisation', 'challenge']], { label: 'Maslow’s hierarchy at work' }), 'Taylor (scientific management – money), Mayo (human relations – social needs), Maslow, Herzberg (hygiene factors and motivators).')}
${two(`<h4>Financial incentives</h4>${ul(['Piece rate', 'Commission', 'Bonus', 'Profit share', 'Performance-related pay'])}`, `<h4>Non-financial techniques</h4>${ul(['Delegation, consultation, empowerment', 'Team working, flexible working', 'Job enrichment, rotation, enlargement'])}`)}` },
    { code: '1.4.5', name: 'Leadership', html: () => `
${fig(S.spectrum([['Autocratic', 'leader decides'], ['Paternalistic', 'decides in staff interests'], ['Democratic', 'consults, shares'], ['Laissez-faire', 'staff decide']], { left: 'Leader-centred', right: 'Staff-centred', label: 'Leadership styles' }), 'Managers plan, organise and control; leaders inspire and set direction. The best style depends on the task, staff skills and urgency.')}` }
  ];

  TITLE.E = 'Entrepreneurs and leaders'; SUB.E = 'Theme 1 · 1.5 — entrepreneurs, objectives, forms of business and choices';
  T.E = [
    { code: '1.5.1', name: 'Role of an entrepreneur', html: () => `${p('Entrepreneurs create and set up a business, run and expand it, innovate and take risks. <b>Intrapreneurs</b> act entrepreneurially within an existing organisation. Barriers: lack of finance, skills, regulation, fear of failure.')}` },
    { code: '1.5.2', name: 'Entrepreneurial motives and characteristics', html: () => `
${two(`<h4>Financial motives</h4>${ul(['Profit maximisation', 'Profit satisficing'])}`, `<h4>Non-financial motives</h4>${ul(['Ethical stance', 'Social entrepreneurship', 'Independence', 'Home-working / flexibility'])}`)}
${p('Characteristics and skills: hard work, resilience, initiative, risk-taking, creativity, self-confidence.')}` },
    { code: '1.5.3', name: 'Business objectives', html: () => `
${fig(S.tiles([['Survival', 'start-ups, recessions', P.red], ['Profit maximisation', 'shareholders', P.green], ['Sales maximisation', 'revenue growth', P.blue], ['Market share', 'dominance', P.violet], ['Cost efficiency', 'competitiveness', P.teal], ['Employee welfare / customer satisfaction / social objectives', 'stakeholders', P.amber]], { cols: 3, th: 78, w: 700, label: 'Business objectives' }), 'Objectives change as a business grows and as the economy changes.')}` },
    { code: '1.5.4', name: 'Forms of business', html: () => `
${table(['Form', 'Liability', 'Key features'], [['Sole trader', 'Unlimited', 'One owner; keeps all profit; limited finance'], ['Partnership', 'Unlimited (unless LLP)', 'Shared skills and capital; disagreements'], ['Private limited company (Ltd)', 'Limited', 'Shares sold privately; separate legal identity'], ['Public limited company (plc)', 'Limited', 'Shares on a stock exchange; large finance; divorce of ownership and control'], ['Social enterprise / not-for-profit', 'Varies', 'Social objectives; profits reinvested']])}
${p('Also: franchising, lifestyle businesses, online businesses; the role of the stock market and moving from private to public.')}` },
    { code: '1.5.5', name: 'Business choices', html: () => `${key('Opportunity cost', 'The next best alternative forgone. Every choice – eg investing in a new machine rather than training – has an opportunity cost.')}${p('<b>Trade-offs</b> are choices between competing aims, eg growth vs control, profit vs ethics.')}` },
    { code: '1.5.6', name: 'Moving from entrepreneur to leader', html: () => `${p('As the business grows, the founder must delegate, build structures and develop management skills. Difficulties: letting go of control, recruiting the right managers, keeping the start-up culture.')}${tip('In 20-mark answers about founders, show how the entrepreneur’s characteristics that helped start the business (risk-taking, control) can become weaknesses as it grows.')}` }
  ];

/* ---- 02_theme2.js ---- */
  /* ===== Theme 2: Managing business activities ===== */
  TITLE.F = 'Raising finance'; SUB.F = 'Theme 2 · 2.1 — internal and external finance, liability and business plans (Papers 2 and 3)';
  T.F = [
    { code: '2.1.1', name: 'Internal finance', html: () => `${table(['Source', 'Advantages', 'Disadvantages'], [['Owner’s capital (personal savings)', 'No interest; keeps control', 'Limited amount; personal risk'], ['Retained profit', 'No interest or dilution', 'Only if profitable; opportunity cost of dividends'], ['Sale of assets', 'Releases cash from unused assets', 'One-off; asset may be needed later']])}` },
    { code: '2.1.2', name: 'External finance', html: () => `
${fig(S.spectrum([['Overdraft', 'short term'], ['Trade credit', 'short term'], ['Leasing', 'medium'], ['Loan', 'medium–long'], ['Share capital / venture capital', 'long term, permanent']], { left: 'Short term', right: 'Long term', label: 'Matching finance to need' }), 'Match the source to the purpose: short-term needs (cash-flow gaps) → overdraft/trade credit; long-term assets → loans or share capital.')}
${table(['Source', 'Key point'], [['Family and friends', 'Flexible but may strain relationships'], ['Banks (loans, overdrafts, mortgages)', 'Interest and security required'], ['Peer-to-peer lending', 'Online platforms; competitive rates'], ['Business angels', 'Finance + expertise, for a share of ownership'], ['Crowdfunding', 'Many small investors; tests demand; can fail to reach target'], ['Venture capital', 'High-growth businesses; investors want control and an exit'], ['Share capital', 'Permanent; dilutes ownership'], ['Leasing / trade credit / grants', 'Spread costs / delay payment / no repayment']])}
${eval2(['Matches the timescale and amount needed', 'Avoids interest (equity) or keeps control (debt)'], ['Cost (interest, fees, dividends)', 'Loss of control, security required, risk of not raising enough'], 'the amount needed, the purpose, the risk of the business, current gearing and the owners’ attitude to control.')}` },
    { code: '2.1.3', name: 'Liability', html: () => `${two(`<h4>Unlimited liability</h4>${p('Sole traders and ordinary partnerships: owners are personally liable for all debts – personal assets at risk.')}`, `<h4>Limited liability</h4>${p('Ltd and plc: owners can only lose what they invested; separate legal identity; easier to raise finance.')}`)}` },
    { code: '2.1.4', name: 'Planning', html: () => `${check(['Business idea and objectives', 'Market research and target market', 'Marketing mix', 'Operations and staffing', 'Financial forecasts: sales, cash flow, break-even, profit'])}${p('A business plan helps obtain finance and guides decisions, but it is based on assumptions and forecasts that may prove wrong.')}` }
  ];

  TITLE.G = 'Financial planning'; SUB.G = 'Theme 2 · 2.2 — sales forecasting, revenue and costs, break-even and budgets';
  T.G = [
    { code: '2.2.1', name: 'Sales forecasting', html: () => `${p('Sales forecasts predict future sales to plan production, staffing, cash flow and budgets. They are affected by <b>consumer trends</b>, <b>economic variables</b> (income, interest rates) and <b>actions of competitors</b>. Difficulties: past data may not reflect the future; external shocks.')}` },
    { code: '2.2.2', name: 'Sales, revenue and costs', html: () => `
${formula('Sales revenue', 'selling price × sales volume', '')}
${formula('Total costs', 'fixed costs + variable costs (variable cost per unit × output)', '')}
${formula('Profit', 'total revenue − total costs', '')}
${calc('Worked example', ['3 000 units at £12 → revenue £36 000.', 'Fixed £10 000 + variable 3 000 × £5 = £15 000 → total costs £25 000.', 'Profit = <b>£11 000</b>.'])}` },
    { code: '2.2.3', name: 'Break-even', html: () => `
${fig(S.breakEven({ fc: 24000, price: 20, vc: 14, max: 7000, ms: 5500 }, { label: 'Break-even chart' }), 'Fixed costs £24 000, price £20, variable cost £14: break-even at 4 000 units; at 5 500 units the margin of safety is 1 500 units.')}
${formula('Contribution per unit', 'selling price − variable cost per unit', '')}
${formula('Break-even output', 'fixed costs ÷ contribution per unit', '')}
${formula('Margin of safety', 'actual output − break-even output', '')}
${eval2(['Simple “what if” tool; shows the sales target', 'Supports loan applications'], ['Assumes all output is sold at one price', 'Costs may not be linear; estimates for start-ups unreliable'], 'how accurate the cost and price estimates are and whether demand supports the sales needed.')}` },
    { code: '2.2.4', name: 'Budgets', html: () => `${table(['Type', 'Description'], [['Historical', 'Based on last year’s figures adjusted for inflation'], ['Zero-based', 'Starts from zero; every item must be justified']])}${p('<b>Variance analysis</b> compares actual with budgeted figures: favourable (better than budget) or adverse (worse). Budgets help control costs and set targets but can be inflexible and demotivating if imposed.')}` }
  ];

  TITLE.H = 'Managing finance'; SUB.H = 'Theme 2 · 2.3 — profit, liquidity and business failure';
  T.H = [
    { code: '2.3.1', name: 'Profit', html: () => `
${formula('Gross profit margin', 'gross profit ÷ revenue × 100', 'Gross profit = revenue − cost of sales')}
${formula('Operating profit margin', 'operating profit ÷ revenue × 100', 'Operating profit = gross profit − other operating expenses')}
${formula('Profit for the year margin', 'profit for the year ÷ revenue × 100', '')}
${calc('Worked example', ['Revenue £500 000; cost of sales £300 000; other operating expenses £120 000.', 'Gross profit £200 000 (40%); operating profit £80 000 → margin <b>16%</b>.'])}
${p('Ways to improve profit: raise prices, cut costs, increase sales volume, improve efficiency – each with risks (eg lower quality, falling demand). <b>Profit ≠ cash:</b> credit sales and timing mean profitable businesses can run out of cash.')}` },
    { code: '2.3.2', name: 'Liquidity', html: () => `
${formula('Current ratio', 'current assets ÷ current liabilities', 'about 1.5–2 often seen as comfortable')}
${formula('Acid test ratio', '(current assets − inventories) ÷ current liabilities', 'below 1 can signal liquidity problems')}
${p('Improve working capital: chase debtors, offer shorter credit, reduce stock, sell and lease back assets, negotiate longer supplier credit, use an overdraft.')}` },
    { code: '2.3.3', name: 'Business failure', html: () => `${two(`<h4>Internal causes</h4>${ul(['Poor cash-flow management', 'Poor management/leadership', 'Poor marketing, overtrading'])}`, `<h4>External causes</h4>${ul(['Competition', 'Recession, interest rates, exchange rates', 'Changes in tastes, legislation'])}`)}` }
  ];

  TITLE.I = 'Resource management'; SUB.I = 'Theme 2 · 2.4 — production and efficiency, capacity, stock control and quality';
  T.I = [
    { code: '2.4.1', name: 'Production, productivity and efficiency', html: () => `
${fig(S.tiles([['Job', 'one-off, bespoke', P.violet], ['Batch', 'groups of identical items', P.blue], ['Flow', 'continuous mass production', P.teal], ['Cell', 'teams make complete units', P.green]], { cols: 4, th: 78, w: 700, label: 'Methods of production' }), 'Labour-intensive vs capital-intensive production; efficiency and productivity.')}
${formula('Labour productivity', 'output per period ÷ number of employees', '')}
${calc('Worked example', ['Before: 12 000 units ÷ 40 workers = 300; after: 15 750 ÷ 45 = 350.', 'Change = (350 − 300) ÷ 300 × 100 = <b>16.67%</b>.'])}` },
    { code: '2.4.2', name: 'Capacity utilisation', html: () => `${formula('Capacity utilisation', 'current output ÷ maximum possible output × 100', '')}${p('Under-utilisation spreads fixed costs over fewer units (higher unit costs); over-utilisation strains staff and machines. Ways to improve: increase sales, rationalise, rent out spare capacity, subcontract.')}` },
    { code: '2.4.3', name: 'Stock control', html: () => `
${fig(`<svg viewBox="0 0 640 300" role="img" aria-label="Stock control diagram" style="width:100%;max-width:640px;height:auto;font-family:inherit" fill="currentColor"><line x1="60" y1="20" x2="60" y2="260" stroke="currentColor" stroke-width="2"/><line x1="60" y1="260" x2="610" y2="260" stroke="currentColor" stroke-width="2"/><text x="10" y="30" font-size="11">Stock</text><text x="560" y="285" font-size="11">Time</text><polyline points="60,50 220,210 220,50 380,210 380,50 540,210 540,50" fill="none" stroke="${P.blue}" stroke-width="3"/><line x1="60" y1="210" x2="610" y2="210" stroke="${P.red}" stroke-dasharray="6 4"/><text x="560" y="204" font-size="11" fill="${P.red}">Buffer stock</text><line x1="60" y1="150" x2="610" y2="150" stroke="${P.amber}" stroke-dasharray="6 4"/><text x="540" y="144" font-size="11" fill="${P.amber}">Re-order level</text><line x1="60" y1="50" x2="610" y2="50" stroke="${P.green}" stroke-dasharray="6 4"/><text x="530" y="44" font-size="11" fill="${P.green}">Maximum stock</text><line x1="160" y1="150" x2="160" y2="268" stroke="currentColor" opacity=".5"/><line x1="220" y1="150" x2="220" y2="268" stroke="currentColor" opacity=".5"/><text x="166" y="280" font-size="11">lead time</text></svg>`, 'Re-order level, buffer stock, lead time and re-order quantity (maximum − buffer).')}
${p('<b>Just-in-time</b> reduces stock costs and waste but relies on reliable suppliers. <b>Waste minimisation</b> (lean production), supplier selection and managing the supply chain efficiently all affect competitiveness.')}` },
    { code: '2.4.4', name: 'Quality management', html: () => `${two(`<h4>Quality control</h4>${p('Inspection to find faults – often at the end of production.')}`, `<h4>Quality assurance</h4>${p('Building quality into every stage; TQM; kaizen (continuous improvement).')}`)}${p('Benefits: fewer returns, reputation, premium prices. Costs: training, time, equipment.')}` }
  ];

  TITLE.J = 'External influences'; SUB.J = 'Theme 2 · 2.5 — the economy, legislation and the competitive environment';
  T.J = [
    { code: '2.5.1', name: 'Economic influences', html: () => `
${table(['Change', 'Likely effects on businesses'], [['Inflation rises', 'Costs rise; customers’ real incomes fall; uncertainty in pricing'], ['Interest rates rise', 'Borrowing dearer; demand for credit-bought goods falls; savings rise'], ['Pound appreciates (strong pound)', 'Imports cheaper; exports dearer (SPICED: Strong Pound Imports Cheap, Exports Dear)'], ['Taxation rises', 'Lower disposable income; lower profit after tax'], ['Recession (business cycle)', 'Falling demand, especially for luxuries; rising unemployment']])}
${calc('Exchange rate example', ['A US$100 component when £1 = $1.25 costs £80.', 'If the pound falls to £1 = $1.10, it costs 100 ÷ 1.10 = <b>£90.91</b>.'])}` },
    { code: '2.5.2', name: 'Legislation', html: () => `${ul(['<b>Consumer protection</b> – products fit for purpose', '<b>Employee protection</b> – National Living Wage, discrimination, health and safety', '<b>Environmental protection</b>', '<b>Competition policy</b> – the CMA prevents abuse of market power', '<b>Health and safety</b>'])}${p('Legislation raises costs but can also create opportunities (eg green products) and a level playing field.')}` },
    { code: '2.5.3', name: 'The competitive environment', html: () => `${p('Competition and market size affect prices, profits and strategy. In a small market with many rivals, businesses compete on price or differentiate; in growing markets there is room for more firms.')}` }
  ];

/* ---- 03_theme34.js ---- */
  /* ===== Theme 3: Business decisions and strategy ===== */
  TITLE.K = 'Business objectives and strategy'; SUB.K = 'Theme 3 · 3.1 — corporate objectives, corporate strategy, SWOT and external influences (Papers 2 and 3)';
  T.K = [
    { code: '3.1.1', name: 'Corporate objectives', html: () => `${fig(S.ladder([['Mission', 'purpose and values'], ['Corporate objectives', 'whole-business goals (SMART)'], ['Functional objectives', 'marketing, operations, finance, HR'], ['Strategy and tactics', 'how the objectives will be met']], { w: 640, rowH: 50, label: 'From mission to tactics' }), 'Critical appraisal of mission statements: they can be vague public-relations statements unless backed by objectives.')}` },
    { code: '3.1.2', name: 'Theories of corporate strategy', html: () => `
${fig(S.matrix([{ h: 'Market penetration', tag: 'existing · existing', items: ['Lowest risk', 'More sales to current customers'] }, { h: 'Product development', tag: 'new product · existing market', items: ['R&D costs', 'Builds on brand'] }, { h: 'Market development', tag: 'existing product · new market', items: ['Exporting, new segments', 'Market knowledge needed'] }, { h: 'Diversification', tag: 'new · new', items: ['Highest risk', 'Spreads risk if successful'] }], { cols: [P.green, P.blue, P.amber, P.red], label: 'Ansoff’s matrix' }), 'Ansoff: strategic direction. Porter: cost leadership, differentiation, focus. Bowman’s strategic clock: price vs perceived added value.')}
${p('<b>Strategic positioning</b> – Porter’s generic strategies and Bowman’s strategic clock; achieving competitive advantage by distinctive capabilities; the effect of strategic and tactical decisions on human, physical and financial resources.')}` },
    { code: '3.1.3', name: 'SWOT analysis', html: () => `${fig(S.matrix([{ h: 'Strengths', tag: 'internal', items: ['Brand, skills, efficiency'] }, { h: 'Weaknesses', tag: 'internal', items: ['High costs, poor cash flow'] }, { h: 'Opportunities', tag: 'external', items: ['New markets, trends'] }, { h: 'Threats', tag: 'external', items: ['Competitors, recession, law'] }], { label: 'SWOT analysis' }), 'Useful when it leads to a strategy (match strengths to opportunities); a snapshot that quickly dates.')}` },
    { code: '3.1.4', name: 'Impact of external influences', html: () => `${fig(S.fiveForces({ label: 'Porter’s five forces' }), 'Rivalry is affected by the threat of new entrants, buyer and supplier power and substitutes.')}${p('<b>PESTLE</b>: political, economic, social, technological, legal, environmental factors. <b>The changing competitive environment</b> – Porter’s five forces.')}` }
  ];

  TITLE.L = 'Business growth'; SUB.L = 'Theme 3 · 3.2 — growth, mergers and takeovers, organic growth and staying small';
  T.L = [
    { code: '3.2.1', name: 'Growth', html: () => `${p('<b>Objectives of growth:</b> economies of scale (internal and external), increased market power, increased market share and brand recognition, increased profitability. <b>Problems:</b> diseconomies of scale, internal communication, overtrading.')}${fig(S.lines([{ name: 'Average cost', col: P.blue, pts: [[1, 90], [2, 70], [3, 58], [4, 52], [5, 50], [6, 53], [7, 60], [8, 72]] }], { h: 220, ymin: 30, ymax: 100, xlabels: [[1, 'small'], [5, 'optimum scale'], [8, 'large']], label: 'Economies and diseconomies of scale' }), 'Average costs fall with economies of scale, then rise with diseconomies.')}` },
    { code: '3.2.2', name: 'Mergers and takeovers', html: () => `${fig(S.tiles([['Horizontal', 'same industry, same stage – eg two supermarkets', P.blue], ['Vertical backward', 'towards suppliers – eg chocolate maker buys a cocoa farm', P.teal], ['Vertical forward', 'towards customers – eg brewer buys pubs', P.green], ['Conglomerate', 'unrelated industries – spreads risk', P.violet]], { cols: 2, th: 82, w: 680, label: 'Types of integration' }), 'Risks: culture clash, overpaying, regulatory intervention, diseconomies.')}` },
    { code: '3.2.3', name: 'Organic growth', html: () => `${two(`<h4>Organic (internal)</h4>${ul(['New stores, products, markets', 'Lower risk; keeps culture and control', 'Slow'])}`, `<h4>Inorganic (external)</h4>${ul(['Mergers and takeovers', 'Fast; buys market share and expertise', 'Expensive; integration problems'])}`)}` },
    { code: '3.2.4', name: 'Reasons for staying small', html: () => `${p('<b>Small business survival</b> in competitive markets: niche markets, personal service, flexibility, online presence (e-commerce), lower overheads, owners who value control or a lifestyle.')}` }
  ];

  TITLE.M = 'Decision-making techniques'; SUB.M = 'Theme 3 · 3.3 — sales forecasting, investment appraisal, decision trees and critical path analysis';
  T.M = [
    { code: '3.3.1', name: 'Quantitative sales forecasting', html: () => `${p('<b>Time-series analysis:</b> calculation of three-period and four-quarter moving averages; extrapolation of trends; interpretation of scatter graphs and line of best fit. <b>Limitations:</b> assumes the past continues; ignores external change.')}${calc('Three-period moving average', ['Sales: 120, 135, 150, 141.', 'First average = (120 + 135 + 150) ÷ 3 = 135; next = (135 + 150 + 141) ÷ 3 = 142.'])}` },
    { code: '3.3.2', name: 'Investment appraisal', html: () => `
${formula('Payback', 'time taken to recover the initial cost from net cash inflows', 'months = remaining amount ÷ next year’s inflow × 12')}
${formula('Average rate of return (ARR)', '(total net return − cost) ÷ years ÷ cost × 100', '')}
${formula('Net present value (NPV)', 'sum of discounted cash flows − initial cost', 'positive NPV = financially worthwhile')}
${calc('Payback example', ['Cost £80 000; inflows £25 000 a year.', 'After 3 years £75 000 recovered; £5 000 left: 5 000 ÷ 25 000 × 12 = 2.4 months → <b>3 years 3 months</b>.'])}
${eval2(['Objective comparison of projects', 'NPV accounts for the time value of money'], ['Forecasts of cash flows are estimates', 'Ignores qualitative factors (staff morale, strategy, ethics)'], 'how reliable the cash-flow forecasts are, the business’s cost of capital and non-financial factors.')}` },
    { code: '3.3.3', name: 'Decision trees', html: () => `${fig(S.tree({ t: 'Decide', kids: [{ t: 'Option A (−£50k)', kind: 'chance', kids: [{ t: '0.6: £120k' }, { t: '0.4: £40k' }] }, { t: 'Option B (−£20k)', kind: 'chance', kids: [{ t: '0.5: £70k' }, { t: '0.5: £30k' }] }] }, { label: 'Decision tree' }), 'A: EV = 0.6 × 120k + 0.4 × 40k = £88k → net gain £38k. B: EV = £50k → net gain £30k. Choose A on financial grounds – but probabilities are estimates.')}` },
    { code: '3.3.4', name: 'Critical Path Analysis', html: () => `${p('A network of activities with earliest start times (EST), latest finish times (LFT) and <b>total float</b> (LFT − duration − EST). The <b>critical path</b> links activities with zero float – any delay delays the project. Helps plan resources and identify the minimum project time, but depends on accurate durations.')}` }
  ];

  TITLE.N = 'Influences on business decisions'; SUB.N = 'Theme 3 · 3.4 — corporate influences, culture, stakeholders and ethics';
  T.N = [
    { code: '3.4.1', name: 'Corporate influences', html: () => `${p('<b>Corporate timescales:</b> short-termism versus long-termism. <b>Evidence-based decision-making</b> vs intuition. Pressure from shareholders for quarterly results can lead to under-investment.')}` },
    { code: '3.4.2', name: 'Corporate culture', html: () => `${fig(S.tiles([['Power', 'one central figure', P.red], ['Role', 'rules and procedures', P.blue], ['Task', 'project teams', P.teal], ['Person', 'individuals with shared expertise', P.violet]], { cols: 4, th: 72, w: 700, label: 'Handy’s cultures' }), 'Strong and weak cultures; how culture is formed; the problems of changing culture.')}` },
    { code: '3.4.3', name: 'Shareholders versus stakeholders', html: () => `${fig(S.matrix([{ h: 'Keep satisfied', tag: 'high power · low interest', items: ['eg regulators'] }, { h: 'Manage closely', tag: 'high power · high interest', items: ['eg shareholders, key suppliers'] }, { h: 'Monitor', tag: 'low power · low interest', items: ['eg general public'] }, { h: 'Keep informed', tag: 'low power · high interest', items: ['eg local community, employees'] }], { cols: [P.amber, P.red, P.slate, P.blue], label: 'Stakeholder mapping (power vs interest)' }), 'Internal and external stakeholders; shareholder vs stakeholder approach; conflicts and their resolution.')}` },
    { code: '3.4.4', name: 'Business ethics', html: () => `${p('Ethics of strategic decisions: <b>trade-offs between ethics and profit</b>, pay and rewards, environmental considerations, supply-chain conduct. Carroll’s CSR pyramid: economic → legal → ethical → philanthropic responsibilities.')}` }
  ];

  TITLE.O = 'Assessing competitiveness'; SUB.O = 'Theme 3 · 3.5 — financial statements, ratio analysis and human resources';
  T.O = [
    { code: '3.5.1', name: 'Interpretation of financial statements', html: () => `${two(`<h4>Statement of comprehensive income</h4>${ul(['Revenue, cost of sales, gross profit', 'Operating expenses, operating profit', 'Profit for the year'])}`, `<h4>Statement of financial position</h4>${ul(['Non-current and current assets', 'Current and non-current liabilities', 'Total equity'])}`)}${p('Limitations: historic, may be window-dressed, ignore qualitative factors.')}` },
    { code: '3.5.2', name: 'Ratio analysis', html: () => `
${formula('ROCE', 'operating profit ÷ capital employed × 100', 'capital employed = total equity + non-current liabilities')}
${formula('Gearing', 'non-current liabilities ÷ capital employed × 100', 'above 50% = highly geared')}
${formula('Current ratio / acid test', 'see 2.3.2', '')}
${calc('Worked example', ['Operating profit £360 000; equity £1.5m; non-current liabilities £0.9m.', 'Capital employed £2.4m → ROCE = <b>15%</b>; gearing = 0.9 ÷ 2.4 = <b>37.5%</b>.'])}` },
    { code: '3.5.3', name: 'Human resources', html: () => `${formula('Labour turnover', 'number of staff leaving ÷ average number employed × 100', '')}${formula('Labour retention', 'staff with service of a set period ÷ staff employed at the start × 100', '')}${formula('Absenteeism', 'days absent ÷ total days that could be worked × 100', '')}${p('Human resource flow: recruitment, redeployment, redundancy; using HR data to improve competitiveness.')}` }
  ];

  TITLE.P = 'Managing change'; SUB.P = 'Theme 3 · 3.6 — causes of change, key factors in change and scenario planning';
  T.P = [
    { code: '3.6.1', name: 'Causes and effects of change', html: () => `${two(`<h4>Internal causes</h4>${ul(['New owners/leaders', 'Poor business performance', 'New strategy'])}`, `<h4>External causes</h4>${ul(['Market conditions', 'Technology', 'Legislation', 'Economic environment'])}`)}` },
    { code: '3.6.2', name: 'Key factors in change', html: () => `${p('Organisational culture, size of organisation, time and leadership affect how successfully change is managed. Resistance is reduced by communication, consultation, training and phasing change in.')}` },
    { code: '3.6.3', name: 'Scenario planning', html: () => `${fig(S.flow([['Identify key risks', 'risk assessment'], ['Assess likelihood & impact', ''], ['Mitigate', 'contingency plans'], ['Business continuity', 'and succession planning']], { w: 700, h: 80, label: 'Scenario planning' }), 'Planning for natural disasters, IT failure, loss of key staff and other risks.')}` }
  ];

  /* ===== Theme 4: Global business ===== */
  TITLE.Q = 'Globalisation'; SUB.Q = 'Theme 4 · 4.1 — growing economies, trade, globalisation, protectionism and trading blocs (Papers 1 and 3)';
  T.Q = [
    { code: '4.1.1', name: 'Growing economies', html: () => `${p('Growth rates of emerging economies (eg India, Indonesia, Vietnam) exceed those of the UK. Indicators of growth: GDP per capita, literacy, health, the Human Development Index (HDI). Implications: new markets, new competitors and new production locations.')}` },
    { code: '4.1.2', name: 'International trade and business growth', html: () => `${p('Exports and imports; specialisation; foreign direct investment (FDI) and its link to business expansion. Trade lets businesses reach larger markets and spread risk.')}` },
    { code: '4.1.3', name: 'Factors contributing to increased globalisation', html: () => `${fig(S.tiles([['Trade liberalisation', 'fewer barriers (WTO)', P.blue], ['Political change', 'opening economies', P.violet], ['Reduced transport & communication costs', 'containerisation, internet', P.teal], ['Increased significance of global (transnational) companies', '', P.amber], ['Increased investment flows', 'FDI', P.green], ['Migration', 'within and between economies', P.pink], ['Growth of the global labour force', '', P.slate], ['Structural change', '', P.navy]], { cols: 4, th: 84, w: 720, label: 'Drivers of globalisation' }), '')}` },
    { code: '4.1.4', name: 'Protectionism', html: () => `${table(['Measure', 'Effect on a business'], [['Tariffs', 'Tax on imports – raises costs of imported inputs/products'], ['Import quotas', 'Limit on quantity – restricts supply'], ['Government legislation', 'Standards and rules that make importing harder'], ['Domestic subsidies', 'Help domestic producers compete']])}` },
    { code: '4.1.5', name: 'Trading blocs', html: () => `${p('Expansion of trading blocs and free trade areas (eg the EU, ASEAN, USMCA): free movement of goods within; common external tariff (customs union). Opportunities: tariff-free access to large markets. Threats: competition and rules of origin for non-members.')}` }
  ];

  TITLE.R = 'Global markets and business expansion'; SUB.R = 'Theme 4 · 4.2 — conditions that prompt trade, assessing countries, global mergers and competitiveness';
  T.R = [
    { code: '4.2.1', name: 'Conditions that prompt trade', html: () => `${two(`<h4>Push factors</h4>${ul(['Saturated domestic market', 'Competition at home'])}`, `<h4>Pull factors</h4>${ul(['Economies of scale', 'Risk spreading', 'New markets'])}`)}${p('<b>Offshoring</b> (moving production abroad) and <b>outsourcing</b>; <b>reshoring</b> brings it back.')}` },
    { code: '4.2.2', name: 'Assessment of a country as a market', html: () => `${check(['Levels and growth of disposable income', 'Ease of doing business', 'Infrastructure', 'Political stability', 'Exchange rate'])}` },
    { code: '4.2.3', name: 'Assessment of a country as a production location', html: () => `${check(['Costs of production', 'Skills and availability of labour force', 'Infrastructure', 'Location in a trade bloc', 'Government incentives', 'Ease of doing business', 'Political stability', 'Natural resources', 'Likely return on investment'])}` },
    { code: '4.2.4', name: 'Reasons for global mergers or joint ventures', html: () => `${p('Spreading risk over different countries; entering new markets/trade blocs; acquiring national/international brands and patents; securing resources and supplies; maintaining/increasing global competitiveness.')}` },
    { code: '4.2.5', name: 'Global competitiveness', html: () => `${p('Impact of movements in exchange rates; competitive advantage through cost competitiveness or differentiation; skills shortages and their impact.')}${calc('Exchange rate and export price', ['A £20 product sells for $25 when £1 = $1.25.', 'If £1 = $1.40, the same product costs $28 – less price competitive (unless the exporter cuts its £ price).'])}` }
  ];

  TITLE.S = 'Global marketing'; SUB.S = 'Theme 4 · 4.3 — global marketing strategy, niche markets and cultural/social factors';
  T.S = [
    { code: '4.3.1', name: 'Marketing', html: () => `${fig(S.matrix([{ h: 'Global', tag: 'high cost pressure · low local', items: ['Standardised products', 'eg Apple iPhone'] }, { h: 'Transnational', tag: 'high · high', items: ['Global efficiency + local adaptation'] }, { h: 'International', tag: 'low · low', items: ['Export home products'] }, { h: 'Multi-domestic', tag: 'low cost · high local', items: ['Products adapted per country'] }], { cols: [P.blue, P.violet, P.slate, P.teal], label: 'Bartlett and Ghoshal' }), 'Global marketing strategy and global localisation (glocalisation); application of the marketing mix to global markets.')}` },
    { code: '4.3.2', name: 'Niche markets', html: () => `${p('Global niche markets: specialised segments across many countries; cultural diversity of global niches; global marketing mix for niches (premium, differentiated).')}` },
    { code: '4.3.3', name: 'Cultural/social factors', html: () => `${ul(['Cultural differences in norms, language, symbols, taste', 'Inappropriate or inaccurate translations', 'Unintended meanings of brand names or promotions', 'Different tastes and preferences'])}` }
  ];

  TITLE.T = 'Global industries and companies (MNCs)'; SUB.T = 'Theme 4 · 4.4 — the impact of MNCs, ethics and controlling MNCs';
  T.T = [
    { code: '4.4.1', name: 'The impact of MNCs', html: () => `${two(`<h4>Local economy</h4>${ul(['Jobs, wages and working conditions', 'Local businesses (suppliers or competitors)', 'Local community and environment'])}`, `<h4>National economy</h4>${ul(['FDI flows and balance of payments', 'Technology and skills transfer', 'Consumers – choice and prices', 'Business culture', 'Tax revenues and transfer pricing'])}`)}` },
    { code: '4.4.2', name: 'Ethics', html: () => `${p('Stakeholder conflicts; pay and working conditions; environmental considerations (pollution, sustainability); supply-chain considerations; marketing considerations.')}` },
    { code: '4.4.3', name: 'Controlling MNCs', html: () => `${fig(S.tiles([['Political influence', 'governments, trade agreements', P.blue], ['Legal control', 'tax rules, regulation', P.violet], ['Pressure groups', 'campaigns and boycotts', P.amber], ['Social media', 'reputation risk', P.pink]], { cols: 4, th: 74, w: 700, label: 'Controlling MNCs' }), 'Each method’s effectiveness depends on the MNC’s power and global reach.')}` }
  ];

/* ---- 04_depth.js ---- */
  /* ===== Depth: applied examples, assess/evaluate frameworks and extra diagrams for every topic area ===== */
  const ADD = (code, extra) => { Object.keys(T).forEach(a => T[a].forEach(t => { if (t.code === code) { const f = t.html; t.html = () => f() + extra(); } })); };
  const model = (q, paras) => `<div class="g-example"><div class="g-example-h"><span>✍</span>Model paragraph: ${q}</div><div class="g-example-b">${paras.map(x => `<p>${x}</p>`).join('')}</div></div>`;

  /* A */
  ADD('1.1.1', () => `${fig(S.bars([['2022', 1.50, P.slate], ['2023', 1.64, P.blue], ['2024', 1.67, P.green]], { w: 560, h: 220, max: 2, ticks: 4, fmt: v => v.toFixed(2) + '%', label: 'Market share over time (fictional coffee roaster)' }), 'Revenue rose 34% over two years, but market share rose only 0.17 percentage points because the market itself grew 21%.')}
${model('Explain one way competition affects a market (4 marks)', ['Competition is rivalry between businesses selling similar products <i>(K)</i>. In the UK coffee market, supermarket brands sell at £6.00 a bag while speciality roasters charge over £11 <i>(A ×2)</i>. This means speciality roasters must constantly differentiate – through ethical sourcing or freshness – otherwise customers will switch to cheaper rivals, reducing their sales <i>(An)</i>.'])}`);
  ADD('1.1.2', () => `${fig(S.tiles([['Demographic', 'age, gender, income, ethnicity', P.blue], ['Geographic', 'region, urban/rural, country', P.teal], ['Psychographic', 'lifestyle, values, personality', P.violet], ['Behavioural', 'usage, loyalty, benefits sought', P.amber]], { cols: 4, th: 80, w: 700, label: 'Bases for market segmentation' }), 'Segmentation lets a business target its marketing mix more precisely.')}
${eval2(['Reduces risk before launch', 'Identifies needs, quantifies demand, informs pricing'], ['Costly and slow; samples may be biased', 'In dynamic markets, findings date quickly'], 'the size of the decision, the reliability of the data and how fast the market changes.')}`);
  ADD('1.1.3', () => `${model('Assess the importance of adding value (10 marks) – opening analysis', ['Adding value is increasing the difference between the price customers pay and the cost of the inputs. For an ethical coffee brand, roasting beans in small batches and telling the story of each farm allows a price of £11.50 against £6.00 for supermarket coffee. This means each bag earns a much higher contribution, so the business can be profitable at lower volumes – vital for a niche brand without economies of scale.'])}`);

  /* B */
  ADD('1.2.2', () => `${fig(S.lines([{ name: 'S1', col: P.red, pts: [[2, 10], [10, 90]] }, { name: 'S2 (after a cost rise)', col: P.amber, pts: [[0, 25], [8, 105]] }], { h: 230, ymin: 0, ymax: 110, xmin: 0, xmax: 12, xlabels: [[0, '0'], [6, 'Quantity'], [12, '']], label: 'A leftward shift in supply' }), 'Higher costs, an indirect tax or a poor harvest shift supply left (S1 → S2): at every price, less is supplied.')}
${example('Applying it', 'Flour prices up 40% for a bakery chain → supply of bread shifts left, raising the equilibrium price. Whether the bakery keeps its sales depends on the price elasticity of demand for its products.')}`);
  ADD('1.2.4', () => `${fig(S.bars([['Before: £2.50 × 1 000', 2500, P.slate], ['After: £3.00 × 900', 2700, P.green]], { w: 560, h: 220, max: 3000, ticks: 3, fmt: v => '£' + v.toLocaleString('en-GB'), label: 'Revenue before and after a price rise (PED −0.5)' }), 'Inelastic demand: the price rise increases total revenue.')}
${warn('Do not just state “demand is inelastic”. Use the extract: name the reasons (brand loyalty, few substitutes) and the consequence for revenue or profit.')}`);
  ADD('1.2.5', () => `${table(['YED', 'Type', 'Example', 'In a recession'], [['Below 0', 'Inferior', 'Value ranges, bus travel', 'Demand may rise'], ['0 to 1', 'Normal necessity', 'Bread, utilities', 'Demand falls slightly'], ['Above 1', 'Luxury', 'Foreign holidays, jewellery', 'Demand falls sharply']])}`);

  /* C */
  ADD('1.3.2', () => `${fig(S.layers([['Brand name & logo', 'recognition', P.sky], ['Brand values', 'ethical, fun, premium…', P.blue], ['Brand loyalty', 'repeat purchase, less price sensitive', P.navy]], { label: 'How branding builds value' }), 'Strong brands reduce price elasticity and make new products easier to launch.')}
${model('Explain one benefit of social media marketing (4 marks)', ['Social media marketing uses platforms such as Instagram and TikTok to promote products <i>(K)</i>. A small subscription coffee brand with 40 000 customers can share brewing videos and farm stories at almost no cost <i>(A ×2)</i>, so it can build brand awareness among 25–40 year-olds far more cheaply than TV advertising, increasing sales without a large promotional budget <i>(An)</i>.'])}`);
  ADD('1.3.3', () => `${eval2(['Price skimming recovers R&D costs; creates a premium image', 'Penetration builds share and economies of scale'], ['Skimming attracts competitors and limits volume', 'Penetration lowers margins; raising prices later can lose customers'], 'the product’s USPs, PED, the strength of the brand, competitors’ responses and the stage of the product life cycle.')}`);
  ADD('1.3.4', () => `${fig(S.tiles([['Direct (D2C)', 'website/app; keeps margin and data', P.green], ['Retailers', 'wide reach; retailer margin', P.blue], ['Marketplaces', 'eg Amazon; huge reach, fees and less control', P.amber], ['Multi-channel', 'combines all – convenience, but complex', P.violet]], { cols: 4, th: 82, w: 700, label: 'Distribution choices' }), '')}`);

  /* D */
  ADD('1.4.1', () => `${fig(S.tiles([['Multi-skilling', 'staff can do several jobs', P.blue], ['Part-time / temporary', 'match staff to demand', P.teal], ['Zero-hours', 'flexible but insecure', P.red], ['Home working', 'lower costs, wider talent pool', P.green], ['Outsourcing', 'specialists, lower cost', P.amber]], { cols: 5, th: 80, w: 720, label: 'Flexible workforce' }), 'Flexibility lowers costs but can reduce loyalty and motivation.')}`);
  ADD('1.4.2', () => `${calc('Cost of labour turnover (illustration)', ['A business loses 27 of its 85 staff in a year (32%).', 'If replacing each costs £2 500 in recruitment and training, the annual cost is 27 × £2 500 = <b>£67 500</b> – a strong argument for investing in motivation.'])}`);
  ADD('1.4.4', () => `${fig(S.matrix([{ h: 'Taylor', tag: 'scientific management', items: ['Money motivates', 'Piece rate, close control'] }, { h: 'Mayo', tag: 'human relations', items: ['Social needs, attention', 'Team working'] }, { h: 'Maslow', tag: 'hierarchy of needs', items: ['Meet lower needs first', 'Self-actualisation at the top'] }, { h: 'Herzberg', tag: 'two-factor theory', items: ['Hygiene factors prevent dissatisfaction', 'Motivators motivate'] }], { label: 'Motivation theories' }), 'Apply the theory to the problem in the extract – eg repetitive work → job rotation/enrichment (Herzberg motivators).')}`);
  ADD('1.4.5', () => `${table(['Style', 'Best when', 'Risk'], [['Autocratic', 'Crisis, unskilled staff, quick decisions', 'Low morale, little creativity'], ['Paternalistic', 'Staff need support', 'Dependency; slow decisions'], ['Democratic', 'Skilled staff, complex problems', 'Slow decisions'], ['Laissez-faire', 'Highly skilled, motivated teams', 'Lack of direction']])}`);

  /* E */
  ADD('1.5.1', () => `${fig(S.flow([['Spot opportunity', 'gap, idea'], ['Gather resources', 'finance, people'], ['Take risk', 'launch'], ['Run & grow', 'innovate, expand']], { w: 680, h: 80, label: 'The entrepreneur’s role' }), '')}`);
  ADD('1.5.4', () => `${eval2(['Limited liability protects personal assets', 'Easier to raise finance (sell shares)'], ['Accounts published; more regulation', 'Loss of control as shareholders join'], 'the owner’s need for finance and control and the risk of the business.')}`);
  ADD('1.5.6', () => `${model('Assess the difficulties of moving from entrepreneur to leader (12 marks) – opening', ['An entrepreneur succeeds by taking risks and making every decision personally. As the business grows to 85 staff, the founder cannot supervise everything; if she continues to make all decisions while focusing on new contracts, managers will lack authority and staff will feel ignored – as shown by exit interviews in which packers say they are never asked for ideas. This means labour turnover rises, increasing recruitment costs and reducing productivity.'])}`);

  /* F */
  ADD('2.1.1', () => `${fig(S.bars([['Savings', 25, P.blue], ['Retained profit', 20, P.teal], ['Still needed', 45, P.red]], { w: 560, h: 220, max: 50, ticks: 5, fmt: v => '£' + v + 'k', label: 'Financing a £90 000 expansion (fictional bakery)' }), 'Internal finance covers half; the other half must come from external sources.')}`);
  ADD('2.1.4', () => `${warn('A business plan does not guarantee success: it is only as good as its market research and assumptions. In assess questions, weigh its value for obtaining finance against the risk of over-optimistic forecasts.')}`);

  /* G */
  ADD('2.2.1', () => `${fig(S.lines([{ name: 'Actual sales', col: P.blue, pts: [[1, 120], [2, 135], [3, 150], [4, 141], [5, 160]] }, { name: 'Forecast (trend)', col: P.amber, dash: true, pts: [[3, 150], [6, 172]] }], { h: 220, ymin: 100, ymax: 180, xlabels: [[1, 'Q1'], [2, 'Q2'], [3, 'Q3'], [4, 'Q4'], [5, 'Q5'], [6, 'Q6']], label: 'Extrapolating a sales trend' }), 'Forecasts are less reliable the further ahead they go and in dynamic markets.')}`);
  ADD('2.2.4', () => `${table(['Budget item', 'Budget (£)', 'Actual (£)', 'Variance'], [['Revenue', '50 000', '54 000', '£4 000 favourable'], ['Wages', '18 000', '19 500', '£1 500 adverse'], ['Materials', '12 000', '11 200', '£800 favourable']])}`);

  /* H */
  ADD('2.3.1', () => `${fig(S.bars([['Revenue', 500, P.blue], ['Cost of sales', 300, P.slate], ['Gross profit', 200, P.teal], ['Operating expenses', 120, P.slate], ['Operating profit', 80, P.green]], { w: 640, h: 240, max: 600, ticks: 3, fmt: v => '£' + v + 'k', label: 'From revenue to operating profit' }), '')}
${eval2(['Raising prices increases margin if demand is inelastic', 'Cutting costs (eg cheaper suppliers) lifts profit'], ['Price rises may cut volume', 'Cost cuts may reduce quality or morale'], 'PED, competition and the source of the cost savings.')}`);
  ADD('2.3.2', () => `${calc('Liquidity example', ['Current assets £90 000 (inventory £40 000); current liabilities £60 000.', 'Current ratio = 90 ÷ 60 = <b>1.5</b>; acid test = 50 ÷ 60 = <b>0.83</b> – heavily reliant on selling stock to pay debts.'])}`);
  ADD('2.3.3', () => `${fig(S.cycle([['Overtrading', 'rapid growth'], ['Cash tied up', 'stock, debtors'], ['Can’t pay creditors', ''], ['Insolvency', 'even if profitable']], { center: 'Cash crisis', label: 'How profitable businesses fail', h: 280 }), '')}`);

  /* I */
  ADD('2.4.2', () => `${fig(S.bars([['Morning', 100, P.red], ['Midday', 70, P.amber], ['Afternoon', 35, P.blue]], { w: 520, h: 220, max: 120, ticks: 4, fmt: v => v + '%', label: 'Capacity utilisation through the day (bakery example)' }), 'Under-used afternoon capacity raises unit costs – JIT batches or afternoon promotions can help.')}`);
  ADD('2.4.4', () => `${fig(S.cycle([['Plan', 'identify a small improvement'], ['Do', 'try it'], ['Check', 'measure the result'], ['Act', 'standardise']], { center: 'Kaizen', label: 'Continuous improvement', h: 280 }), '')}`);

  /* J */
  ADD('2.5.1', () => `${fig(S.cycle([['Boom', 'high demand, rising prices'], ['Downturn', 'slowing growth'], ['Recession', 'falling output, unemployment'], ['Recovery', 'growth returns']], { center: 'Business cycle', label: 'The business cycle', h: 290 }), 'Income-elastic products (luxuries) are hit hardest in a recession.')}`);
  ADD('2.5.2', () => `${fig(S.tiles([['Consumer protection', 'fit for purpose, fair terms', P.blue], ['Employee protection', 'NLW, discrimination, H&S', P.teal], ['Environmental protection', 'emissions, waste', P.green], ['Competition policy', 'CMA blocks abuse of power', P.violet]], { cols: 4, th: 78, w: 700, label: 'Legislation affecting business' }), '')}`);

  /* K */
  ADD('3.1.1', () => `${model('Assess the value of a mission statement (10 marks) – evaluation', ['A mission statement is only valuable if it shapes decisions. A supermarket whose mission promises “fresh, fair and local” gains if staff and suppliers act on it; however, if objectives and rewards focus only on cost-cutting, the mission becomes a public-relations exercise. Its value therefore depends on whether it is translated into SMART objectives and reflected in the culture.'])}`);
  ADD('3.1.4', () => `${fig(S.tiles([['Political', 'policy, trade deals', P.red], ['Economic', 'interest rates, inflation', P.amber], ['Social', 'demographics, tastes', P.green], ['Technological', 'AI, automation', P.blue], ['Legal', 'employment, consumer law', P.violet], ['Environmental', 'climate, sustainability', P.teal]], { cols: 6, th: 76, w: 720, label: 'PESTLE' }), '')}`);

  /* L */
  ADD('3.2.2', () => `${eval2(['Rapid growth in market share', 'Economies of scale; access to brands and skills'], ['Expensive; culture clash; diseconomies', 'Regulator (CMA) may intervene'], 'the price paid, how well the businesses integrate and whether synergies are realistic.')}`);
  ADD('3.2.4', () => `${fig(S.tiles([['Niche focus', 'serve a specialist need', P.violet], ['Personal service', 'relationships, flexibility', P.teal], ['E-commerce', 'reach without big premises', P.blue], ['Low overheads', 'owner-managed', P.green]], { cols: 4, th: 74, w: 700, label: 'How small businesses survive' }), '')}`);

  /* M */
  ADD('3.3.4', () => `${fig(S.gantt([['A Design', 0, 2], ['B Build', 2, 6], ['C Fit out', 6, 9], ['D Marketing', 2, 5], ['E Open', 9, 10]], 10, { label: 'Activities over time (critical path A → B → C → E)' }), 'D has float: it can start late without delaying opening. A, B, C and E are critical – any delay delays the whole project.')}`);
  ADD('3.3.2', () => `${table(['Method', 'Strength', 'Weakness'], [['Payback', 'Simple; focuses on cash and risk', 'Ignores cash after payback and profitability'], ['ARR', 'Measures profitability as %', 'Ignores timing of cash flows'], ['NPV', 'Considers the time value of money', 'Depends on the discount rate chosen; more complex']])}`);

  /* N */
  ADD('3.4.4', () => `${fig(S.pyramid([['Economic', 'be profitable'], ['Legal', 'obey the law'], ['Ethical', 'do what is right'], ['Philanthropic', 'be a good citizen']], { label: 'Carroll’s CSR pyramid' }), 'In the exam, link ethics to stakeholders and long-term profit: ethical behaviour can build reputation, but costs reduce short-term margins.')}`);
  ADD('3.4.1', () => `${two(`<h4>Short-termism</h4>${ul(['Quarterly results', 'Cuts to R&D and training', 'Dividends today'])}`, `<h4>Long-termism</h4>${ul(['Investment and innovation', 'Brand and staff development', 'Sustainable growth'])}`)}`);

  /* O */
  ADD('3.5.2', () => `${fig(S.bars([['ROCE', 15, P.green], ['Gearing', 37.5, P.amber], ['Current ratio ×10', 15, P.blue]], { w: 520, h: 220, max: 50, ticks: 5, fmt: v => v + (v === 15 ? '' : '%'), label: 'Ratio snapshot (example data)' }), 'Always compare ratios: over time, with competitors, or against a benchmark (eg gearing above 50% = high).')}
${eval2(['Ratios reveal trends and allow comparison with rivals', 'Help investors and lenders judge performance'], ['Based on historic data; window dressing', 'Ignore non-financial factors (brand, staff, CSR)'], 'the quality of the data and what is being compared.')}`);
  ADD('3.5.3', () => `${calc('HR example', ['Average 250 staff; 40 leave → labour turnover = 40 ÷ 250 × 100 = <b>16%</b>.', '1 200 days absent out of 60 000 possible → absenteeism = <b>2%</b>.'])}`);

  /* P */
  ADD('3.6.2', () => `${fig(S.flow([['Unfreeze', 'explain why change is needed'], ['Change', 'train, support, involve staff'], ['Refreeze', 'embed new ways of working']], { w: 680, h: 80, label: 'Managing change (Lewin-style model)' }), 'Culture, size of organisation, time and leadership decide how smoothly change happens.')}
${table(['Cause of resistance', 'How to reduce it'], [['Fear of job loss', 'Clear communication, retraining guarantees'], ['Loss of status/skills', 'Training, involvement in planning'], ['Strong existing culture', 'Leadership, quick wins, phased change']])}`);
  ADD('3.6.3', () => `${table(['Risk', 'Likelihood', 'Impact', 'Mitigation'], [['Loss of key supplier', 'Medium', 'High', 'Dual sourcing, buffer stock'], ['IT failure / cyber attack', 'Medium', 'High', 'Back-ups, security, continuity plan'], ['Founder retires', 'High', 'Medium', 'Succession planning'], ['Extreme weather', 'Low', 'High', 'Insurance, remote working']])}`);

  /* Q */
  ADD('4.1.1', () => `${table(['Indicator', 'What it shows', 'Why it matters to a business'], [['GDP growth rate', 'How fast the economy is growing', 'Faster growth → rising demand and incomes'], ['GDP per capita', 'Average output/income per person', 'Indicates spending power of consumers'], ['Literacy rate', 'Education levels', 'Skills of the potential workforce'], ['Health (life expectancy)', 'Wellbeing and productivity', 'Healthier workforce and longer-term market'], ['Human Development Index (HDI)', 'Combines income, education and health', 'A broad measure of development']])}${tip('Use the figures given in the extract – never invent growth rates. Compare the emerging economy’s growth with the UK’s and explain what it means for demand and costs.')}`);
  ADD('4.1.4', () => `${calc('Tariff example', ['A UK exporter sells an e-bike to India for £1 100; a 20% tariff is applied.', 'Landed price = 1 100 × 1.2 = <b>£1 320</b> – unless the exporter absorbs the tariff, price competitiveness falls.'])}`);
  ADD('4.1.5', () => `${eval2(['Tariff-free access to large markets', 'Common standards simplify trade'], ['Competition from other members', 'External tariff for non-members; rules of origin'], 'whether the business is inside or outside the bloc and how dependent it is on bloc markets.')}`);

  /* R */
  ADD('4.2.1', () => `${fig(S.matrix([{ h: 'Offshoring', tag: 'move abroad', items: ['Lower costs', 'Quality, ethics, distance'] }, { h: 'Outsourcing', tag: 'another business does it', items: ['Specialists', 'Less control'] }, { h: 'Reshoring', tag: 'bring it back', items: ['Quality, speed, “made in UK”', 'Higher labour costs'] }, { h: 'Expansion abroad', tag: 'new markets', items: ['Growth, risk spreading', 'Cultural and political risk'] }], { label: 'Global location decisions' }), '')}`);
  ADD('4.2.5', () => `${model('Explain how an appreciation affects competitiveness (4 marks)', ['An appreciation means the pound buys more foreign currency <i>(K)</i>. A Manchester e-bike maker selling at £1 800 in the USA sees its dollar price rise from $2 250 to $2 520 when the pound rises from $1.25 to $1.40 <i>(A ×2)</i>, so American customers may switch to cheaper rivals and sales fall unless it cuts its sterling price <i>(An)</i>.'])}`);

  /* S */
  ADD('4.3.1', () => `${model('Assess glocalisation (12 marks) – counterbalance', ['However, adapting the product for each country raises design and production costs and reduces economies of scale. A premium brand that launches a cheaper model abroad also risks confusing its global image. If customers in the new market are wealthy early adopters, a standardised premium product may sell well without adaptation.'])}`);
  ADD('4.3.3', () => `${fig(S.tiles([['Language', 'translation errors', P.red], ['Symbols & colours', 'different meanings', P.amber], ['Tastes', 'food, design', P.green], ['Norms & customs', 'shopping habits, religion', P.blue]], { cols: 4, th: 74, w: 700, label: 'Cultural and social factors' }), 'Research and local partners reduce the risk of costly mistakes.')}`);

  /* T */
  ADD('4.4.1', () => `${eval2(['FDI creates jobs and raises incomes', 'Technology and skills transfer; tax revenue'], ['Profits repatriated; transfer pricing', 'Local firms crowded out; environmental damage'], 'regulation, the quality of jobs created and how much value stays in the country.')}`);
  ADD('4.4.2', () => `${fig(S.matrix([{ h: 'Workers', tag: 'pay & conditions', items: ['Living wages, safety'] }, { h: 'Environment', tag: 'sustainability', items: ['Emissions, waste, resources'] }, { h: 'Supply chain', tag: 'suppliers', items: ['Child labour, audits'] }, { h: 'Marketing', tag: 'customers', items: ['Honest claims, vulnerable groups'] }], { label: 'Ethical issues for MNCs' }), '')}`);
  ADD('4.4.3', () => `${model('Evaluate (20 marks) – judgement', ['Pressure groups and social media are fast and can damage a consumer brand within days, but they lack legal power and may be ignored by businesses whose customers care mainly about price. Legal control is slower and needs international cooperation, yet it is enforceable. The most effective control is therefore a combination: campaigns that raise public pressure, followed by legislation that changes the rules – the balance depends on how visible the MNC’s brand is to consumers.'])}`);
  ADD('3.5.1', () => `${fig(S.layers([['Revenue', 'sales income for the year', P.sky], ['− Cost of sales = Gross profit', '', P.blue], ['− Operating expenses = Operating profit', '', P.navy], ['− Interest and tax = Profit for the year', '', P.violet]], { label: 'Statement of comprehensive income (structure)' }), 'Read down the statement to see where profit is lost: a falling gross margin means rising input costs or price cuts; a falling operating margin with a stable gross margin means overheads are rising.')}`);
  ADD('4.1.2', () => `${fig(S.flow([['Specialisation', 'produce what you do best'], ['Exports', 'sell to other countries'], ['Imports', 'buy inputs and products'], ['FDI', 'invest in operations abroad'], ['Business growth', 'larger markets, scale']], { w: 700, h: 84, label: 'Trade and business growth' }), '')}`);
  ADD('4.2.2', () => `${fig(S.tiles([['Disposable income', 'can customers afford it?', P.green], ['Ease of doing business', 'permits, tax, regulation', P.blue], ['Infrastructure', 'transport, internet, power', P.teal], ['Political stability', 'risk to investment', P.red], ['Exchange rate', 'prices and profits', P.amber]], { cols: 5, th: 80, w: 720, label: 'Assessing a country as a market' }), 'Weigh the factors: a large, fast-growing market can still be a poor choice if political or currency risk is high.')}`);

/* ---- 99_tail.js ---- */
  const AIMS = Object.keys(T);
  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-edx-9bs0-business',
    unitLabel: 'A-level Business Guide',
    aimWord: 'Chapter',
    aimLabels: window.AIM_LABEL || null,
    aims: AIMS,
    setTaskTitle: 'The exams',
    titles: TITLE,
    subtitles: SUB,
    setTask,
    topics: T,
    gallery: []
  };
})();

