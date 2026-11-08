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
