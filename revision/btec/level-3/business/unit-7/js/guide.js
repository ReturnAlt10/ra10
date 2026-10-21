/* Business Unit 7 — Business Decision Making: comprehensive revision guide (shared guide engine).
   Worked examples use the June 2024 Sharifa travel-consultant task. */
(function () {
  'use strict';
  const { svg: S, h: H, P } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, formula, example, steps, cards, stats, check, two, photo, unsplash } = H;

  function setTask() {
    const bars = S.bars([['AF1 Data', 8, P.orange], ['AF2 Resources', 8, P.orange], ['AF3 Finance', 8, P.orange], ['AF4 Factors & risks', 16, P.red], ['AF5 Decision', 8, P.orange], ['AF6 Structure', 4, P.orange], ['AF7 Overview', 6, P.blue], ['AF8 Pitch', 6, P.blue], ['AF9 Design', 6, P.blue]], { w: 700, h: 270, max: 18, unit: 'Marks (orange/red = report 52 · blue = presentation 18)', label: 'Marks for each assessment focus' });
    return `
<div class="guide-aim-hd"><div class="guide-aim-badge">★</div><div><div class="guide-aim-title">The assessment: Part S – two options, one decision</div><div class="guide-aim-subtitle">70 marks · 3 hours on a computer · report (52) + presentation with speaker notes (18)</div></div></div>
<div class="g-set-hero">${S.hero('Compare two options. Decide. Persuade.', 'You advise a client: analyse resources and finance, use decision tools, assess risk, recommend one option and present it.', ['chart', 'bulb', 'coin'], P.orange)}</div>
${stats([['70', 'marks'], ['52 / 18', 'report / presentation'], ['3 h', 'one session'], ['2+', 'decision tools needed']])}
${fig(bars, 'AF4 (factors, risks and alternatives using tools) is worth 16 – more than any other AF. AF1–AF3 and AF5 are 8 each.')}
${fig(S.flow([['Read', 'scenario + two options · 15 min'], ['Calculate', 'finance for both · 30 min'], ['Analyse', 'resources, tools, risks · 50 min'], ['Decide', 'recommend + justify · 20 min'], ['Present', 'slides + notes · 40 min']], { w: 700, h: 84, label: 'A 3-hour plan' }), 'Roughly: 15 + 30 + 50 + 20 for the report (≈ 115–130 min) and 35–40 for the presentation.')}
${table(['AF', 'Marks', 'What earns the top band', 'What loses marks'], [['AF1 data selection', '8', 'Selects and interprets evidence for each point (market data + option data)', 'Copies the case; no interpretation'], ['AF2 resources', '8', 'Human, physical (location), financial, time for BOTH options, applied', 'One option only; generic statements'], ['AF3 financial forecasting', '8', 'Accurate GP/NP, margins, break-even, MOS, ROCE for both; coherent approach', 'Arithmetic errors; no working; one option'], ['AF4 factors, risks, alternatives', '16', 'At least two tools applied to both options; risks rationalised and linked to client aims', 'One tool; headings only; not linked to aims'], ['AF5 decision', '8', 'One convincing decision that draws all the evidence together', 'Simplistic/generic; no reasons for rejecting the other option'], ['AF6 structure', '4', 'Logical report, terminology, no errors', 'Notes-style; informal']])}
${key('Examiner expectations', '<strong>Allow error carried forward</strong> in finance (show working). Concepts examined: GP/GP%, NP/NP%, break-even and margin of safety (ROCE and cash flow often too). Decisions must be linked to the <strong>client’s aims</strong>. Work for AF4 and AF5 is usually assessed together. Use <strong>at least two tools</strong> such as SWOT, PESTLE, Porter’s five forces or the 5C model.')}
${warn('Do not attempt payback or ARR if the data does not allow them (examiners note a few learners tried without suitable figures). Use the measures the data supports: margins, break-even, MOS, ROCE, cash flow.')}
${photo(unsplash('photo-1551288049-bebda4e38f71'), 'Numbers, tools and a clear recommendation.')}`;
  }
  function a1() {
    return `
${fig(S.tiles([['Human', 'skills, experience, staff, training, working hours'], ['Physical', 'premises, location, equipment, technology'], ['Financial', 'start-up capital, savings, loans, running costs'], ['Time', 'start date, training time, availability']], { cols: 4, th: 100, w: 700, pal: [P.violet, P.teal, P.amber, P.sky], label: 'Four resources' }), 'Analyse all four for EACH option and say what the implications are.')}
${table(['Resource', 'Option 1: full-time travel consultant', 'Option 2: part-time cruise consultant'], [['Human', 'No staff; 1 week training on booking sites; flexible full-time hours', 'No staff; same training; limited availability (also employed)'], ['Physical', 'Works from home; £3k equipment included in start-up', 'Works from home; same equipment'], ['Financial', 'Start-up £18,000; loan needed if no savings; fixed costs £4,000', 'Start-up £11,000; smaller loan; fixed costs £4,550'], ['Time', 'Can start immediately; no other income', 'Can start immediately; keeps salary but less time']])}`;
  }
  function b1() {
    const col = [P.orange, P.blue];
    return `
${fig(S.formulaMap([['Gross profit', 'revenue − cost of sales', 'Option 1: £90,000 − £36,000 = £54,000 (60%)'], ['Net profit', 'gross profit − expenses', '£54,000 − £4,000 = £50,000 (55.6%)'], ['After drawings', 'net profit − drawings', '£50,000 − £20,000 = £30,000 (33.3%)'], ['ROCE', 'net profit ÷ capital employed × 100', '£50,000 ÷ £18,000 = 277.8%'], ['Break-even', 'fixed costs ÷ contribution per customer', '£4,000 ÷ £225 = 17.8 customers'], ['Margin of safety', 'forecast − break-even', '240 − 17.8 = 222.2 customers']], { cols: 3, label: 'Option 1 (Sharifa) – worked figures' }), 'Calculate the same measures for BOTH options and compare them.')}
${table(['Measure', 'Option 1', 'Option 2', 'Interpretation'], [['Revenue', '£90,000', '£35,000', 'Option 1 earns 2.6× more'], ['Gross profit margin', '60%', '50%', 'Option 1 keeps more of each £ of commission'], ['Net profit (before drawings)', '£50,000', '£12,950', 'Option 1 much higher'], ['Net profit margin', '55.6%', '37.0%', 'Lower running costs relative to revenue'], ['After drawings', '£30,000 (33.3%)', '£2,950 (8.4%)', 'Option 2 retains little to reinvest'], ['ROCE', '277.8%', '117.7%', 'Both are high, Option 1 higher; small capital employed'], ['Break-even customers', '17.8', '26', 'Both well below forecast'], ['Margin of safety', '222.2', '74', 'Option 1 has far more headroom']])}
${fig(S.bars([['Option 1', 50000, P.orange], ['Option 2', 12950, P.blue]], { w: 460, h: 230, fmt: v => '£' + Math.round(v).toLocaleString('en-GB'), unit: 'Net profit before drawings', label: 'Net profit comparison' }), 'But numbers are not the whole story – Option 2 keeps a salary (lower personal risk).')}
${tip('State each formula, show the substitution and the answer. Even with a wrong figure you can earn marks through the own-figure rule. Compare the options in words after every table: “Option 1 is ahead because…”.')}`;
  }
  function c1() {
    return `
${fig(S.matrix([{ h: 'Strengths', tag: 'Option 1', items: ['GP 60%, NP £50,000', 'ROCE 278%', 'Full-time flexibility', '2 years’ experience'] }, { h: 'Weaknesses', tag: 'Option 1', items: ['£18,000 start-up, no savings', 'No salary if no sales', 'No independent reputation'] }, { h: 'Opportunities', tag: 'market', items: ['Holiday market +22% to £52.1bn by 2027', 'Stored-up demand', '80% book online'] }, { h: 'Threats', tag: 'market', items: ['Cost of living', 'Large competitors (TUI, easyJet, Jet2)', 'Small business failure rate'] }], { h: 330, label: 'SWOT for Option 1' }), 'Do a SWOT for each option (or a side-by-side table), then draw conclusions.')}
${fig(S.fiveForces({ label: 'Porter’s five forces' }), 'Porter: rivalry is high (large operators, online sites); buyer power is high (customers book online); entry is easy (low start-up) – so profit potential depends on niche and reputation.')}
${table(['Tool', 'Use it to', 'Example finding'], [['SWOT', 'Compare internal strengths/weaknesses and external opportunities/threats', 'Option 1 strength: higher profit; threat: no income if no sales'], ['PESTLE', 'Look at the wider environment', 'Economic: cost of living; Social: preference for online booking; Technological: booking sites'], ['Porter’s five forces', 'Assess industry attractiveness', 'High rivalry and buyer power'], ['5C', 'Company, customers, competitors, collaborators, climate', 'Collaborators: the franchise provider (commission 40–50%)']])}
${warn('Tools only earn marks if you <strong>use</strong> them: each finding must feed the decision (“so Option 2’s part-time salary reduces the risk from the cost-of-living threat”).')}`;
  }
  function d1() {
    return `
${fig(S.tiles([['Lack of savings', 'loan needed whichever option'], ['Forecast not met', 'commission lower than £90,000/£35,000'], ['Competition', 'large firms, online booking'], ['Reputation', 'no track record as independent'], ['Economy', 'cost of living reduces holiday spending'], ['Costs rise', 'franchise fees and running costs']], { cols: 3, th: 82, w: 700, pal: [P.red, P.orange, P.amber, P.pink, P.slate, P.violet], label: 'Risks' }), 'Identify the risk, say which option it affects more, and how it can be reduced.')}
${table(['Risk', 'Option more affected', 'How to reduce it'], [['No income without sales', 'Option 1', 'Build a pipeline of family/friends/referrals before resigning; save a buffer'], ['Low commission', 'Both', 'Plan for lower revenue and check break-even (still few customers)'], ['Competitors', 'Both', 'Specialise (cruise niche, personal service)'], ['Reliance on one job', 'Option 2 (growth limited)', 'Move to full-time when customers justify it']])}`;
  }
  function e1() {
    return `
${fig(S.ladder([['Introduce the client and aims', 'break even in year 1 then grow'], ['Option 1: resources, finance, factors, risks', 'with figures'], ['Option 2: the same', 'same measures so they can be compared'], ['Tools and comparison', 'SWOT/PESTLE/Porter results side by side'], ['Recommendation', 'one option, reasons, why not the other, risk plan']], { w: 700, label: 'Report structure' }), 'Structure for the 52-mark report.')}
${example('Top-band recommendation (extract)', '<p>“I recommend <strong>Option 1</strong>. It gives a net profit of £50,000 (ROCE 278%) and a margin of safety of 222 customers, so Sharifa’s aim of breaking even in year 1 is very likely. SWOT shows the main weakness is the £18,000 start-up with no savings; I recommend a loan and building a pipeline of referrals before leaving her job to reduce risk. Option 2 keeps her salary but retained profit after drawings is only £2,950, limiting growth; it is therefore less suitable for her aim to grow in year 2 and beyond.”</p>')}
<h4>The presentation (18 marks)</h4>
${steps(['Slide 1 – title and client aims', 'Slide 2 – the two options in one table', 'Slide 3 – key figures (profit, ROCE, break-even)', 'Slide 4 – key factors and risks (tool findings)', 'Slide 5 – recommendation and why not the other', 'Slide 6 – next steps and risk plan'])}
${tip('Speaker notes carry the persuasion: speak to the client (“Sharifa, the figures show…”), quote the evidence and show you understand her goals. AF9 rewards slide design and notes that would <em>engage and convince</em>.')}`;
  }

  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-BUS-u7', unitLabel: 'Unit 7 Guide', aimWord: 'Content area', aims: ['A', 'B', 'C', 'D', 'E'], setTaskTitle: 'The assessment',
    titles: { A: 'Resources for a business decision', B: 'Financial information and forecasting', C: 'Decision-making tools', D: 'Key factors, risks and alternatives', E: 'Making and communicating a decision' },
    subtitles: { A: 'Human, physical, financial and time resources for each option', B: 'Margins, break-even, margin of safety, ROCE and cash flow – with worked comparisons', C: 'SWOT, PESTLE, Porter’s five forces and the 5C model', D: 'Risks, how to manage them and alternatives', E: 'Supported decisions, report and presentation' },
    setTask: setTask,
    topics: {
      A: [{ code: 'A1', name: 'The four resources', html: a1 }],
      B: [{ code: 'B1', name: 'Financial forecasting and comparing options', html: b1 }],
      C: [{ code: 'C1', name: 'SWOT, PESTLE, Porter and 5C', html: c1 }],
      D: [{ code: 'D1', name: 'Risks and how to manage them', html: d1 }],
      E: [{ code: 'E1', name: 'The report, decision and presentation', html: e1 }]
    },
    gallery: [
      { aim: '★', kicker: 'The task', title: 'Two options, one decision', copy: '52-mark report + 18-mark presentation.', image: unsplash('photo-1551288049-bebda4e38f71') },
      { aim: 'B', kicker: 'Finance', title: 'Compare the numbers', copy: 'Margins, break-even, ROCE.', image: unsplash('photo-1454165804606-c3d57bc86b40') },
      { aim: 'E', kicker: 'Decide', title: 'Recommend and present', copy: 'Convince the client.', image: unsplash('photo-1556761175-5973dc0f32e7') }
    ]
  };
})();
