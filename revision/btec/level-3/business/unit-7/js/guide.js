/* Business Unit 7 — Business Decision Making: comprehensive revision guide (shared guide engine).
   Content areas A–H follow the Pearson specification; worked examples use the June 2024 Sharifa travel-consultant task. */
(function () {
  'use strict';
  const { svg: S, h: H, P } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, formula, example, steps, cards, stats, check, two, photo, unsplash } = H;

  function setTask() {
    const bars = S.bars([['AF1 Data', 8, P.orange], ['AF2 Resources', 8, P.orange], ['AF3 Finance', 8, P.orange], ['AF4 Factors & risks', 16, P.red], ['AF5 Decision', 8, P.orange], ['AF6 Structure', 4, P.orange], ['AF7 Overview', 6, P.blue], ['AF8 Pitch', 6, P.blue], ['AF9 Design', 6, P.blue]], { w: 700, h: 270, max: 18, unit: 'Marks (orange/red = report 52 · blue = presentation 18)', label: 'Marks for each assessment focus' });
    return `
<div class="guide-aim-hd"><div class="guide-aim-badge">★</div><div><div class="guide-aim-title">The assessment: Part S – two options, one decision</div><div class="guide-aim-subtitle">70 marks · 3 hours on a computer · report (52) + presentation with speaker notes (18) · drawing on the whole programme</div></div></div>
<div class="g-set-hero">${S.hero('Compare two options. Decide. Persuade.', 'You advise a client: analyse resources and finance, use decision tools, assess risk, recommend one option and present it.', ['chart', 'bulb', 'coin'], P.orange)}</div>
${stats([['70', 'marks'], ['52 / 18', 'report / presentation'], ['3 h', 'one session'], ['8', 'content areas A–H']])}
${fig(bars, 'AF4 (factors, risks and alternatives using tools) is worth 16 – more than any other AF. AF1–AF3 and AF5 are 8 each.')}
${fig(S.flow([['Read', 'scenario + two options · 15 min'], ['Calculate', 'finance for both · 30 min'], ['Analyse', 'resources, tools, risks · 50 min'], ['Decide', 'recommend + justify · 20 min'], ['Present', 'slides + notes · 40 min']], { w: 700, h: 84, label: 'A 3-hour plan' }), 'Roughly: 15 + 30 + 50 + 20 for the report (≈ 115–130 min) and 35–40 for the presentation.')}
<h4>How the specification maps to the marks</h4>
${table(['AF', 'Content areas used', 'What earns the top band'], [['AF1 data (8)', 'B1 data, C research and trends', 'Selects and interprets evidence for every point'], ['AF2 resources (8)', 'E1–E3 human, physical, financial (+ time)', 'All four resources for BOTH options, applied'], ['AF3 finance (8)', 'F forecasts, G1 ratios, B3 statistics', 'Accurate GP/NP, margins, break-even, MOS, ROCE; error carried forward allowed'], ['AF4 factors & risks (16)', 'B2 models, G2 SWOT/PESTLE/what-if, D legislation & quality, C4 marketing', 'At least two tools; risks and alternatives linked to the client’s aims'], ['AF5 decision (8)', 'G3 contingency, H1 business skills', 'One justified decision; why not the other; risks managed'], ['AF6/AF9 structure & design (4+6)', 'H2 IT skills, B4 formats', 'Formal report, executive summary, professional slides']])}
${key('Examiner expectations', '<strong>Allow error carried forward</strong> in finance (show working). Concepts examined: GP/GP%, NP/NP%, break-even and margin of safety (ROCE and cash flow often too). Decisions must be linked to the <strong>client’s aims</strong>. Work for AF4 and AF5 is usually assessed together. Use <strong>at least two tools</strong> such as SWOT, PESTLE, Porter’s five forces or the 5Cs analysis.')}
${warn('Do not attempt payback, ARR or NPV if the data does not allow them (examiners note a few learners tried without suitable figures). Use the measures the data supports: margins, break-even, MOS, ROCE, cash flow.')}
${photo(unsplash('photo-1551288049-bebda4e38f71'), 'Numbers, tools and a clear recommendation.')}`;
  }

  /* A */
  function a1() {
    return `
${fig(S.tiles([['Gap in the market', 'unmet need or poor competitor offer'], ['Competitors', 'weaknesses you can exploit'], ['Current trends', 'growth markets, lifestyle changes'], ['Likely demand', 'evidence from research']], { cols: 4, th: 92, w: 700, label: 'Justifying a start-up idea' }), 'Start-up ideas are justified by evidence, not enthusiasm.')}
${two(`<strong>Developing business</strong>${ul(['Economic climate changes (cost of living, interest rates)', 'Market trends', 'Competition may force diversification for survival'])}`, `<strong>Ownership</strong>${ul(['Sole trader · partnership · Ltd · plc · franchise', 'Change ownership to raise finance or limit liability'])}`)}`;
  }
  function a2() {
    const org = S.org({ t: 'Owner', kids: [{ t: 'Manager A', kids: [{ t: 'Staff' }, { t: 'Staff' }] }, { t: 'Manager B', kids: [{ t: 'Staff' }, { t: 'Staff' }] }] }, { label: 'Hierarchical structure' });
    return `
${fig(org, 'Hierarchical: clear chain of command but slower communication. Flat structures have few layers; a matrix has dual reporting lines (function and project).')}
${table(['Location', 'Considerations'], [['Local', 'Rent, footfall, local competition, travel for customers'], ['National', 'Delivery costs, wider market, brand'], ['International', 'Exchange rates, regulation, culture, logistics']])}
${ul(['Aims and objectives of the business shape which option is “best”', 'Evaluate, justify and synthesise: bring ideas, evidence and aims together'])}`;
  }

  /* B */
  function b1() {
    return `
${table(['Source', 'Examples', 'Advantages / limits'], [['Primary', 'Survey, interview, observation, focus group', 'Specific and up to date; cost and sample bias'], ['Secondary', 'Published reports, back data, industry and government data, reviews', 'Cheap and wide; may be dated or not designed for the decision']])}
${warn('Storage of data brings security, legislative, regulatory and ethical issues (GDPR). Analyse, compare and evaluate the data to predict consequences, offer alternatives and justify solutions.')}`;
  }
  function b2() {
    const ans = S.matrix([{ h: 'Market penetration', tag: 'existing / existing', items: ['Sell more of the same to current customers', 'Lowest risk'] }, { h: 'Product development', tag: 'new product / existing market', items: ['New range for current customers'] }, { h: 'Market development', tag: 'existing product / new market', items: ['Same product, new area or segment'] }, { h: 'Diversification', tag: 'new / new', items: ['New products in new markets', 'Highest risk'] }], { h: 300, cols: [P.green, P.blue, P.amber, P.red], label: 'Ansoff matrix' });
    const bos = S.matrix([{ h: 'Stars', tag: 'high growth · high share', items: ['Invest to keep leadership'] }, { h: 'Question marks', tag: 'high growth · low share', items: ['Invest or drop – uncertain'] }, { h: 'Cash cows', tag: 'low growth · high share', items: ['Milk for cash to fund others'] }, { h: 'Dogs', tag: 'low growth · low share', items: ['Consider dropping'] }], { h: 300, cols: [P.green, P.amber, P.blue, P.slate], label: 'Boston matrix' });
    return `
${fig(S.fiveForces({ label: 'Porter’s five forces' }), 'Porter: rivalry, entrants, substitutes, buyer power, supplier power. Rate each force for each option.')}
${fig(S.tiles([['Company', 'strengths, resources, aims'], ['Customers', 'needs, segments, size'], ['Competitors', 'number, strength, strategies'], ['Collaborators', 'suppliers, partners, distributors'], ['Climate (context)', 'political, economic, social, technological']], { cols: 5, th: 96, w: 700, pal: [P.violet, P.green, P.red, P.amber, P.sky], label: '5Cs analysis' }), '5Cs analysis (the specification names it without defining it; this is the standard marketing form).')}
${fig(ans, 'Ansoff: growth strategies for a developing business.')}
${fig(bos, 'Boston matrix: classify products by market growth and share.')}`;
  }
  function b3() {
    return `
${formula('Mean', 'Σx ÷ n', 'e.g. 12, 15, 15, 18, 20, 22, 25 → 127 ÷ 7 = 18.14')}
${formula('Median / mode', 'middle value / most frequent value', 'median 18, mode 15 in the example')}
${formula('Standard deviation (sample)', '√[ Σ(x − mean)² ÷ (n − 1) ]', 'Low = consistent, high = variable (used in quality control and buffer stock levels)')}
${formula('Quartiles', 'Q1, median, Q3 · IQR = Q3 − Q1', 'Percentiles divide data into 100 parts')}
${formula('Correlation coefficient r', 'from −1 to +1', '+0.86 = strong positive relationship – not proof of cause')}
${tip('Use statistics only where the data supports it; always finish with a conclusion for the decision (“demand is consistent, so a fixed-staff model is suitable”).')}`;
  }
  function b4() {
    return `
${fig(S.lines([{ name: 'Actual sales', col: P.blue, pts: [[1, 1200], [2, 1260], [3, 1330], [4, 1420], [5, 1500], [6, 1580]] }, { name: 'Trend line forecast', col: P.orange, dash: true, pts: [[1, 1188], [2, 1266], [3, 1343], [4, 1420], [5, 1498], [6, 1575], [7, 1653]] }], { h: 270, ymin: 1000, ymax: 1700, xlabels: [[1, 'M1'], [2, 'M2'], [3, 'M3'], [4, 'M4'], [5, 'M5'], [6, 'M6'], [7, 'M7']], label: 'Scatter/line with a linear trend' }), 'Extrapolating the trend line forecasts month 7 (≈ 1,653 units). Reliability falls the further ahead you forecast and if seasonality changes.')}
${table(['Chart', 'Use'], [['Line', 'Trends over time'], ['Bar', 'Compare categories or options'], ['Pie', 'Share of a total (e.g. market share)'], ['Histogram', 'Frequency distributions'], ['Scatter (XY)', 'Relationships and trend lines']])}`;
  }
  function b5() {
    const net = `<svg viewBox="0 0 640 170" role="img" aria-label="Critical path network" style="width:100%;max-width:640px;font-family:inherit" fill="currentColor"><g font-size="12" text-anchor="middle"><rect x="20" y="62" width="90" height="46" rx="10" fill="#2563eb" fill-opacity=".15" stroke="#2563eb"/><text x="65" y="82" font-weight="700">A</text><text x="65" y="98" font-size="11">3 days</text><rect x="200" y="14" width="90" height="46" rx="10" fill="#dc2626" fill-opacity=".15" stroke="#dc2626"/><text x="245" y="34" font-weight="700">B</text><text x="245" y="50" font-size="11">4 days</text><rect x="200" y="110" width="90" height="46" rx="10" fill="#0d9488" fill-opacity=".15" stroke="#0d9488"/><text x="245" y="130" font-weight="700">C</text><text x="245" y="146" font-size="11">2 days (float 2)</text><rect x="380" y="62" width="90" height="46" rx="10" fill="#dc2626" fill-opacity=".15" stroke="#dc2626"/><text x="425" y="82" font-weight="700">D</text><text x="425" y="98" font-size="11">3 days</text></g><g stroke="#64748b" stroke-width="2" fill="none"><path d="M110 78 L200 40"/><path d="M110 92 L200 130"/><path d="M290 38 L380 76" stroke="#dc2626"/><path d="M290 132 L380 94"/></g><text x="510" y="82" font-size="13" font-weight="700" fill="#dc2626">Critical path A–B–D = 10 days</text></svg>`;
    return `
${fig(net, 'Critical path analysis: the longest route (A–B–D = 10 days) sets the minimum project time; activity C has 2 days of float.')}
${formula('NPV', 'Σ [cash flow ÷ (1 + r)ⁿ] − initial investment', '£8,000, £9,000, £10,000 at 8% → £23,062 − £20,000 = £3,062: positive, so worthwhile')}
${formula('IRR', 'discount rate at which NPV = 0', 'Accept if IRR is above the required return/cost of borrowing')}
${ul(['<strong>MIS</strong> support operational (daily), tactical (departmental) and strategic (long-term) decisions', '<strong>Gantt charts</strong> schedule tasks against time', 'Spreadsheets produce forecasts, graphs and “what if” scenarios'])}`;
  }

  /* C */
  function c1() {
    return `
${fig(S.tiles([['Product', 'range, quality, USP'], ['Price', 'competitor and cost based'], ['Promotion', 'social media, local ads'], ['Place', 'location, online, delivery'], ['People', 'skills and service'], ['Process', 'booking, payment, delivery'], ['Physical environment', 'premises or website']], { cols: 4, th: 80, w: 700, label: 'The 7Ps' }), 'Marketing plan elements: 7Ps, target market, USP and segmentation.')}
${table(['Research', 'Competitors', 'Trends'], [['Primary: surveys, interviews, observation, focus groups; secondary: reports, back data, industry and government data, reviews', 'Effect on the product, pricing strategy and location', 'Economic, market and social trends that affect demand']])}`;
  }

  /* D */
  function d1() {
    return `
${table(['Legislation', 'Why it matters (outline)'], [['Industry-specific', 'e.g. food hygiene for a café or travel regulations for an agent'], ['Health and safety at work', 'Safe premises, equipment, training'], ['GDPR', 'Lawful, secure use of customer data'], ['Employment rights', 'Contracts, minimum wage, working time'], ['Consumer rights', 'Goods/services as described; refunds']])}
${tip('Outline understanding only is expected: say which law applies, what it means for the option, and how it adds cost or risk.')}`;
  }
  function d2() {
    return `
${fig(S.tiles([['Quality control', 'inspect and test'], ['Quality assurance', 'prevent defects'], ['Benchmarking', 'compare with the best'], ['Quality circles', 'staff problem-solving'], ['Self-checking / inspection', 'check own work'], ['ISO 9000', 'recognised standard'], ['TQM', 'everyone owns quality']], { cols: 4, th: 80, w: 700, label: 'Quality issues' }), 'Quality keeps customers and attracts new ones – relevant to every option.')}`;
  }

  /* E */
  function e1() {
    return `
${fig(S.tiles([['Human', 'skills, experience, staff, wages, full/part time, recruitment, training cost'], ['Physical', 'rent or buy premises, equipment, vehicles, IT, suppliers'], ['Financial', 'sources of finance, start-up and running costs'], ['Time', 'start date, training time, availability']], { cols: 4, th: 110, w: 700, pal: [P.violet, P.teal, P.amber, P.sky], label: 'Resources' }), 'Analyse all four for EACH option and say what the implications are.')}
${table(['Resource', 'Option 1: full-time travel consultant', 'Option 2: part-time cruise consultant'], [['Human', 'No staff; 1 week training; flexible full-time hours', 'No staff; same training; limited availability (also employed)'], ['Physical', 'Home office; £3k equipment included in start-up', 'Home office; same equipment'], ['Financial', 'Start-up £18,000; loan needed if no savings; fixed costs £4,000', 'Start-up £11,000; smaller loan; fixed costs £4,550'], ['Time', 'Can start immediately; no other income', 'Can start immediately; keeps salary but less time']])}`;
  }

  /* F */
  function f1() {
    return `
${fig(S.formulaMap([['Gross profit', 'revenue − cost of sales', 'Option 1: £90,000 − £36,000 = £54,000 (60%)'], ['Net profit', 'gross profit − expenses', '£54,000 − £4,000 = £50,000 (55.6%)'], ['After drawings', 'net profit − drawings', '£50,000 − £20,000 = £30,000 (33.3%)'], ['ROCE', 'net profit ÷ capital employed × 100', '£50,000 ÷ £18,000 = 277.8%'], ['Break-even', 'fixed costs ÷ contribution per customer', '£4,000 ÷ £225 = 17.8 customers'], ['Margin of safety', 'forecast − break-even', '240 − 17.8 = 222.2 customers']], { cols: 3, label: 'Option 1 (Sharifa) – worked figures' }), 'Calculate the same measures for BOTH options and compare them.')}
${table(['Measure', 'Option 1', 'Option 2', 'Interpretation'], [['Revenue', '£90,000', '£35,000', 'Option 1 earns 2.6× more'], ['Gross profit margin', '60%', '50%', 'Option 1 keeps more of each £ of commission'], ['Net profit (before drawings)', '£50,000', '£12,950', 'Option 1 much higher'], ['Net profit margin', '55.6%', '37.0%', 'Lower running costs relative to revenue'], ['After drawings', '£30,000 (33.3%)', '£2,950 (8.4%)', 'Option 2 retains little to reinvest'], ['ROCE', '277.8%', '117.7%', 'Both high, Option 1 higher; small capital employed'], ['Break-even customers', '17.8', '26', 'Both well below forecast'], ['Margin of safety', '222.2', '74', 'Option 1 has far more headroom']])}
${fig(S.bars([['Option 1', 50000, P.orange], ['Option 2', 12950, P.blue]], { w: 460, h: 230, fmt: v => '£' + Math.round(v).toLocaleString('en-GB'), unit: 'Net profit before drawings', label: 'Net profit comparison' }), 'But numbers are not the whole story – Option 2 keeps a salary (lower personal risk).')}
${tip('State each formula, show the substitution and the answer. Even with a wrong figure you can earn marks through the own-figure rule. Compare the options in words after every table.')}`;
  }
  function f2() {
    return `
${formula('Closing balance', 'opening balance + net cash flow', 'Net cash flow = inflows − outflows; closing becomes next month’s opening')}
${table(['', 'Jan', 'Feb', 'Mar'], [['Opening', '5,000', '3,600', '5,000'], ['Inflows', '8,200', '10,500', '9,000'], ['Outflows', '9,600', '9,100', '8,800'], ['Net', '(1,400)', '1,400', '200'], ['Closing', '3,600', '5,000', '5,200']])}
${ul(['Use the forecast to <strong>predict consequences</strong> (shortages) and <strong>justify solutions</strong> (overdraft, delay spending, shorter customer credit)'])}`;
  }
  function f3() {
    return `
${fig(S.breakEven({ fc: 4000, vc: 0, price: 225, max: 30, ms: 24, xtitle: 'Customers per year' }, { label: 'Break-even (illustrative)' }), 'Illustrative chart: fixed costs £4,000, contribution £225 per customer → break-even 17.8 customers. Create and interpret charts from the data given.')}
${fig(S.statement('Income statement (extract)', [['Revenue', '£90,000'], ['Cost of sales', '(£36,000)', 1], ['Gross profit', '£54,000', 0, 1], ['Expenses', '(£4,000)', 1], ['Net profit', '£50,000', 0, 1]]), 'Create and interpret an income statement and a statement of financial position from the data.')}`;
  }

  /* G */
  function g1() {
    return `
${fig(S.formulaMap([['Liquidity', 'current ratio · liquid (acid test) ratio', 'can the business pay short-term debts?'], ['Profitability', 'gross/net profit margin · ROCE', 'how well does it turn sales into profit?'], ['Performance', 'receivable days · payable days · inventory turnover', 'how efficiently are resources used?']], { cols: 3, label: 'Ratio families' }), 'Calculate and INTERPRET – say what the ratio means for the decision.')}`;
  }
  function g2() {
    return `
${fig(S.matrix([{ h: 'Strengths', tag: 'Option 1', items: ['GP 60%, NP £50,000', 'ROCE 278%', 'Full-time flexibility', '2 years’ experience'] }, { h: 'Weaknesses', tag: 'Option 1', items: ['£18,000 start-up, no savings', 'No salary if no sales', 'No independent reputation'] }, { h: 'Opportunities', tag: 'market', items: ['Holiday market +22% to £52.1bn by 2027', 'Stored-up demand', '80% book online'] }, { h: 'Threats', tag: 'market', items: ['Cost of living', 'Large competitors (TUI, easyJet, Jet2)', 'Small business failure rate'] }], { h: 330, label: 'SWOT for Option 1' }), 'Do a SWOT for each option (or a side-by-side table), then draw conclusions.')}
${table(['Tool', 'Use it to', 'Example finding'], [['SWOT', 'Compare strengths/weaknesses and opportunities/threats', 'Option 1 strength: higher profit; threat: no income if no sales'], ['PESTLE', 'Look at the wider environment', 'Economic: cost of living; Social: online booking; Technological: booking sites'], ['“What if”', 'Test assumptions', 'If customers are 20% fewer, profit falls from £22,000 to £7,600'], ['Porter / 5Cs', 'Assess the industry and situation', 'High rivalry and buyer power']])}
${warn('Tools only earn marks if you <strong>use</strong> them: each finding must feed the decision.')}`;
  }
  function g3() {
    return `
${fig(S.tiles([['Lack of savings', 'loan needed whichever option'], ['Forecast not met', 'commission lower than forecast'], ['Competition', 'large firms, online booking'], ['Reputation', 'no track record'], ['Economy', 'cost of living'], ['Costs rise', 'fees and running costs']], { cols: 3, th: 82, w: 700, pal: [P.red, P.orange, P.amber, P.pink, P.slate, P.violet], label: 'Risks' }), 'Identify the risk, say which option it affects more, and how it can be reduced.')}
${check(['Risks covered (e.g. low sales, supplier failure)', 'Trigger points that start the plan', 'Actions and who does them', 'Extra finance or savings held in reserve'])}`;
  }

  /* H */
  function h1() {
    return `
${fig(S.ladder([['Executive summary', 'the decision in one page'], ['Introduce the client and aims', 'break even in year 1 then grow'], ['Option 1 and Option 2', 'resources, finance, factors, risks – same measures'], ['Tools, what-if and contingency', 'results side by side'], ['Recommendation', 'one option, reasons, why not the other, risk plan']], { w: 700, label: 'Report structure' }), 'Structure for the 52-mark report.')}
${example('Top-band recommendation (extract)', '<p>“I recommend <strong>Option 1</strong>. It gives a net profit of £50,000 (ROCE 278%) and a margin of safety of 222 customers, so Sharifa’s aim of breaking even in year 1 is very likely. SWOT shows the main weakness is the £18,000 start-up with no savings; I recommend a loan and building a pipeline of referrals before leaving her job to reduce risk. Option 2 keeps her salary but retained profit after drawings is only £2,950, limiting growth; it is therefore less suitable for her aim to grow in year 2 and beyond.”</p>')}
<h4>The presentation (18 marks)</h4>
${steps(['Slide 1 – title and client aims', 'Slide 2 – the two options in one table', 'Slide 3 – key figures (profit, ROCE, break-even)', 'Slide 4 – key factors and risks (tool findings)', 'Slide 5 – recommendation and why not the other', 'Slide 6 – next steps and risk plan'])}
${tip('Speaker notes carry the persuasion: speak to the client (“Sharifa, the figures show…”), quote the evidence and show you understand her goals. AF9 rewards slide design and notes that would <em>engage and convince</em>.')}`;
  }
  function h2() {
    return `${check(['Word-process the report in at least 12 pt font; use headings and an executive summary', 'Use a spreadsheet for calculations, graphs and “what if” scenarios and paste results into the report', 'Use presentation software with consistent layout, few words per slide and speaker notes'])}`;
  }

  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-BUS-u7', unitLabel: 'Unit 7 Guide', aimWord: 'Content area', aims: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], setTaskTitle: 'The assessment',
    titles: { A: 'Business plans', B: 'Decision making in business', C: 'Use of research to justify marketing', D: 'Efficient operational management', E: 'Managing resources', F: 'Financial forecasts', G: 'Viability of a business', H: 'Business skills and IT skills' },
    subtitles: { A: 'Business ideas, ownership, structure and location', B: 'Data sources, Porter/5Cs/Ansoff/Boston, statistics, charts, critical path and NPV', C: 'Research, competitors, trends and the 7Ps marketing plan', D: 'Legislation and quality issues', E: 'Human, physical and financial resources', F: 'Sales, cash flow, break-even, income statement and financial position', G: 'Ratios, SWOT, PESTLE, “what if” scenarios and contingency plans', H: 'Key factors, alternatives, risk, report and presentation skills' },
    setTask: setTask,
    topics: {
      A: [{ code: 'A1', name: 'Business ideas', html: a1 }, { code: 'A2', name: 'Purpose and structure of a business', html: a2 }],
      B: [{ code: 'B1', name: 'Sources for data collection', html: b1 }, { code: 'B2', name: 'Business models', html: b2 }, { code: 'B3', name: 'Techniques to analyse data', html: b3 }, { code: 'B4', name: 'Formats for decision making', html: b4 }, { code: 'B5', name: 'Software-generated information', html: b5 }],
      C: [{ code: 'C1', name: 'Research, competitors, trends and marketing plan', html: c1 }],
      D: [{ code: 'D1', name: 'Legislation', html: d1 }, { code: 'D2', name: 'Quality issues', html: d2 }],
      E: [{ code: 'E1', name: 'Human, physical and financial resources', html: e1 }],
      F: [{ code: 'F1', name: 'Comparing two options financially', html: f1 }, { code: 'F2', name: 'Cash flow forecast', html: f2 }, { code: 'F3', name: 'Break-even and statements', html: f3 }],
      G: [{ code: 'G1', name: 'Ratio analysis', html: g1 }, { code: 'G2', name: 'SWOT, PESTLE and “what if”', html: g2 }, { code: 'G3', name: 'Contingency plan and risks', html: g3 }],
      H: [{ code: 'H1', name: 'Business skills: the report and presentation', html: h1 }, { code: 'H2', name: 'IT skills', html: h2 }]
    },
    gallery: [
      { aim: '★', kicker: 'The task', title: 'Two options, one decision', copy: '52-mark report + 18-mark presentation.', image: unsplash('photo-1551288049-bebda4e38f71') },
      { aim: 'F', kicker: 'Finance', title: 'Compare the numbers', copy: 'Margins, break-even, ROCE, cash flow.', image: unsplash('photo-1454165804606-c3d57bc86b40') },
      { aim: 'H', kicker: 'Decide', title: 'Recommend and present', copy: 'Convince the client.', image: unsplash('photo-1556761175-5973dc0f32e7') }
    ]
  };
})();
