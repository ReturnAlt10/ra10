/* AQA A-level Business (7132) revision guide - content part 1: helpers + 3.1 to 3.5
   Written against spec v2.0 and the 2020-2025 papers, mark schemes and examiner reports. */
(function () {
  'use strict';

  const BG = window.BG = window.BG || {};
  BG.sections = BG.sections || [];

  BG.def = (term, text) => `<div class="def-box"><div class="def-label">Key definition</div><span class="def-term">${term}</span> - ${text}</div>`;
  BG.tip = (text) => `<div class="exam-tip"><div class="tip-label">&#128161; Exam tip</div>${text}</div>`;
  BG.mistake = (text) => `<div class="mistake-box"><div class="mistake-label">&#9888; Examiners report</div>${text}</div>`;
  BG.formula = (lines) => `<div class="formula-box">${lines.join('<br>')}</div>`;
  BG.chain = (title, steps) => `<div class="chain-box"><div class="chain-label">&#128279; Model chain of analysis - ${title}</div><ol class="chain-steps">${steps.map(s => `<li>${s}</li>`).join('')}</ol></div>`;
  BG.evalBox = (points, lead) => `<div class="eval-box"><div class="eval-label">&#9878; Evaluation - ${lead || 'it depends on'}</div><ul>${points.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
  BG.worked = (title, steps, note) => `<div class="worked-box"><div class="worked-label">&#9998; Worked example - ${title}</div>${steps.map(s => `<div class="w-step">${s}</div>`).join('')}${note ? `<p style="margin:6px 0 0">${note}</p>` : ''}</div>`;
  BG.table = (headers, rows) => `<table class="g-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  BG.seen = (text) => `<p class="seen-box"><span class="seen-label">Seen in exams:</span>${text}</p>`;
  BG.topic = (code, name, body) => ({ code, name, body });
  BG.section = (num, title, subtitle, topics) => BG.sections.push({ num: String(num), title, subtitle, topics });

  const { def, tip, mistake, formula, chain, evalBox, worked, table, seen, topic, section } = BG;

  /* ===================================================== 3.1 */
  section(1, '3.1 What is business?', 'Why businesses exist, mission and objectives, profit, business forms, shares, the external environment', [
    topic('3.1.1', 'The nature and purpose of business', `
<p>Businesses exist to provide goods and services that satisfy needs and wants - and in doing so they pursue <strong>objectives</strong>. The spec lists: profit, growth, survival, cash flow, social and ethical objectives.</p>
${def('Mission statement', 'a qualitative statement of the overall purpose and values of the business (e.g. GreenRoot: "Good food, fairly grown").')}
${def('Objective', 'a specific, measurable target that turns the mission into something that can be planned for and assessed, ideally SMART.')}
<h4>Why set objectives?</h4>
<ul>
<li><strong>Direction and focus</strong> for decision making - managers can test options against them.</li>
<li><strong>Coordination</strong> - functional objectives (marketing, operations, finance, HR) are derived from corporate objectives.</li>
<li><strong>Motivation</strong> - a clear target gives employees a sense of purpose (link to Herzberg's 'achievement').</li>
<li><strong>A yardstick</strong> against which actual performance can be measured and judged.</li>
</ul>
<h4>Objectives change over time</h4>
${table(['Situation', 'Likely priority objective', 'Why'], [
  ['Start-up / recession', 'Survival, cash flow', 'No reserves; demand uncertain'],
  ['Established, growing market', 'Growth / market share', 'Economies of scale, brand position'],
  ['Plc with institutional shareholders', 'Profit, dividends, share price', 'Pressure for returns; takeover threat'],
  ['Social enterprise, charity, mutual', 'Social / ethical objectives, break-even', 'Purpose is the mission, not owners\' returns'],
])}
<h4>Measuring profit</h4>
${formula(['Revenue (turnover, sales) = price x quantity sold', 'Total costs = fixed costs + variable costs', 'Profit = total revenue - total costs'])}
${worked('profit', ['Revenue = 4 000 x £12 = £48 000', 'Total costs = £15 000 + (4 000 x £7) = £43 000', 'Profit = £48 000 - £43 000 = £5 000'], 'Do not confuse profit with total contribution (4 000 x £5 = £20 000).')}
${chain('why a non-profit organisation still sets financial objectives', [
  'A charity must cover its costs to keep delivering its services.',
  'A break-even or surplus objective gives managers a target to control spending against.',
  'Without it, cash could run out and the charity would have to close.',
  'So a financial objective protects its ability to pursue its social mission.'])}
${mistake('In 2022 (Paper 1 Q19) answers that discussed "objectives" in general rather than <em>financial</em> objectives were capped; answers with no reference to non-profit organisations got no application marks.')}
${seen('2022 P1 Q19 (non-profits\' financial objectives); 2024 P3 Q2 (setting a 15% market share objective); 2024 P1 Q21 (performance of non-profits).')}
`),
    topic('3.1.2', 'Different business forms and shares', `
${table(['Form', 'Liability', 'Ownership / shares', 'Key points'], [
  ['Sole trader', '<strong>Unlimited</strong>', 'One owner', 'Full control, keeps all profit; personal assets at risk; hard to raise finance'],
  ['Private limited company (Ltd)', 'Limited', 'Shares not offered to the public', 'Separate legal entity; owners can keep control; limited ability to raise share capital'],
  ['Public limited company (plc)', 'Limited', 'Shares sold to the public, usually on a stock exchange', 'Huge capital raising; risk of takeover; pressure for short-term results; must publish accounts'],
  ['Public sector', '-', 'Owned by government', 'Objectives = service, not profit'],
  ['Non-profit (charity, mutual)', 'Usually limited', 'No owners taking profit', 'Surpluses reinvested'],
  ['Social enterprise', 'Usually limited', 'Varies (Ltd, CIC)', 'Trades to achieve social/environmental aims; most surplus reinvested'],
])}
${def('Limited liability', 'owners can only lose the money they invested - personal assets are protected.')}
${def('Market capitalisation', 'number of shares x current share price: the market value of the company.')}
${def('Dividend', 'the share of profit paid to shareholders, usually so many pence per share.')}
${formula(['Market capitalisation = number of shares x share price', 'Number of shares = market capitalisation / share price  (watch pence v pounds!)', 'Retained profit = profit for the year - dividends'])}
<h4>Why do people buy shares?</h4>
<ul><li><strong>Dividends</strong> (income) and <strong>capital gain</strong> (share price rises).</li><li>Institutional investors (pension funds) want steady returns; private investors may want growth.</li></ul>
<h4>What moves a share price?</h4>
<p>Shares are priced on <em>expected future</em> performance. Price rises when more investors want to buy than sell. Influences: profit announcements <em>relative to expectations</em>, interest rates (savings become more attractive), takeover rumours, the economy, news about the business (e.g. a social-media campaign, a new contract).</p>
${chain('why a plc\'s share price could fall after a campaign group criticises it', [
  'The criticism spreads on social media, damaging the brand\'s ethical reputation.',
  'Investors expect ethically aware customers to switch, reducing future sales and profit.',
  'Future dividends and growth look less certain, so more investors sell than buy.',
  'The share price falls - e.g. 412p to 371p, a 10% fall.'])}
<h4>Ownership affects mission and objectives</h4>
<p>A family Ltd can pursue long-term or social goals; a plc faces <strong>short-termism</strong> pressure from shareholders; a venture capitalist will push for rapid growth and an exit.</p>
${evalBox(['the size and stage of the business (small firms rarely need plc status)', 'how much finance is needed and how quickly', 'how much control the owners are willing to give up', 'the cost and regulatory burden of being a plc'], 'whether to change business form depends on')}
${tip('In 2021 P2 students lost marks by mixing pounds and pence: market capitalisation of £360m with a share price of 240p means 360m / 2.40 = 150 million shares.')}
${seen('2020 P1 Q21 (limited liability and all stakeholders); 2021 P2 Q1 (Metro Bank shares and share price); 2022 P2 Q2 (Ocado dividend and share price); 2024 P1 Q1 MCQ (unlimited liability).')}
`),
    topic('3.1.3', 'The external environment: costs and demand', `
<p>The spec asks how the external environment affects <strong>costs</strong> and <strong>demand</strong>. Always say which, and for whom.</p>
${table(['Factor', 'Effect on demand', 'Effect on costs'], [
  ['Competition', 'More rivals = lower demand / price pressure', 'Need to cut costs to compete'],
  ['Market conditions (growth, saturation)', 'Growing market lifts demand', 'Input shortages in booming markets'],
  ['Incomes', 'Rise = more demand for normal and luxury goods (YED +)', 'Wage pressure'],
  ['Interest rates', 'Rise = less spending on credit-financed goods; more saving', 'Higher loan/overdraft interest, esp. if highly geared'],
  ['Demographic factors', 'Ageing population, migration change what is demanded', 'Labour supply'],
  ['Environmental issues', 'Green consumers switch brands', 'Regulation, carbon costs, investment'],
  ['Fair trade', 'Ethical consumers may pay a premium', 'Higher unit cost of inputs'],
])}
${chain('higher interest rates and a luxury holiday firm', [
  'The Bank of England raises interest rates, so mortgage and loan repayments rise.',
  'Households\' disposable income falls and saving becomes more attractive.',
  'Luxury holidays are income elastic, so demand falls by more than the fall in disposable income.',
  'Revenue falls - and if the firm has borrowed heavily, its interest costs rise at the same time, squeezing profit from both sides.'])}
${tip('Always link the factor to the specific business in the question. "Interest rates rise so costs rise" is generic (AN). "A highly geared manufacturer pays more interest on its large loans, cutting profit" is applied analysis (ARG).')}
${seen('2024 P1 Q20 (interest rates, highly geared exporter); 2021 P1 Q19 (inflation and exchange rates).')}
`),
  ]);

  /* ===================================================== 3.2 */
  section(2, '3.2 Managers, leadership and decision making', 'Management v leadership, leadership styles, decision trees, influences on decisions, stakeholder mapping', [
    topic('3.2.1', 'Management, leadership and styles', `
${def('Management', 'planning, organising, coordinating and controlling resources to achieve objectives.')}
${def('Leadership', 'setting direction and inspiring and influencing people towards a vision.')}
${table(['Style', 'What it looks like', 'Works well when', 'Risks'], [
  ['Autocratic', 'Leader decides and instructs', 'Crisis, unskilled staff, need for speed/consistency, confidential decisions', 'Demotivation, loss of ideas, high labour turnover'],
  ['Paternalistic', 'Leader decides in what they think are staff\'s best interests', 'Staff value security and welfare (Maslow\'s safety/social)', 'Can feel patronising; still little involvement'],
  ['Democratic', 'Staff consulted / involved', 'Skilled staff, time available, need commitment to change', 'Slow; may be inappropriate in a crisis'],
  ['Laissez-faire', 'Staff given freedom to decide', 'Highly skilled, self-motivated professionals (e.g. engineers, designers)', 'Lack of direction and coordination'],
])}
<h4>Tannenbaum Schmidt continuum</h4>
<p>A line from <strong>manager-centred</strong> to <strong>team-centred</strong> leadership: <em>tells &rarr; sells &rarr; consults &rarr; participates/joins &rarr; delegates</em>. As you move right, the manager's use of authority falls and subordinates' freedom rises. The key idea: the best position depends on the <strong>manager</strong>, the <strong>team</strong> (skills, experience) and the <strong>situation</strong> (time, risk).</p>
${chain('how an autocratic founder can drive rapid early growth', [
  'The founder makes decisions alone and immediately.',
  'In a fast-moving market (e.g. esports, tech), opportunities appear and disappear quickly.',
  'Speed lets the business be first to market - e.g. first to offer VR viewing.',
  'First-mover advantage builds brand recognition and sponsorship deals, so revenue grows rapidly.'])}
${evalBox(['the skill and experience of the workforce', 'the time pressure and level of risk', 'the size of the business - one person cannot make every decision as it grows', 'the culture (power v task) and staff expectations'])}
${mistake('Questions often ask how a style <em>contributed</em> to something (growth, performance). Answers that only list drawbacks of the style are not answering the question.')}
${seen('2021 P1 Q20 (HR manager\'s reviewing role); 2023 P2 Q2.3 (managers\' role with homeworking); 2020 P3 Q5 (change of leadership style).')}
`),
    topic('3.2.2', 'Decision making: scientific v intuitive, decision trees', `
${def('Scientific decision making', 'using data and a logical process (set objectives &rarr; gather data &rarr; analyse &rarr; select &rarr; implement &rarr; review).')}
${def('Intuitive decision making', 'decisions based on experience, gut feeling and judgement - fast, but open to bias.')}
${def('Risk v uncertainty', 'risk = probabilities of outcomes can be estimated; uncertainty = they cannot.')}
${def('Opportunity cost', 'the next best alternative forgone.')}
<h4>Decision trees</h4>
<p>Squares = decision points; circles = chance nodes; probabilities on each branch from a chance node must sum to 1.</p>
${formula(['Expected value (EV) = sum of (probability x financial outcome)', 'Net gain = expected value - cost of the option', 'Choose the option with the highest net gain (on financial grounds)'])}
${worked('Northern Showdown', ['In person: EV = (0.6 x £900 000) + (0.4 x £500 000) = £740 000', 'Net gain = £740 000 - £450 000 = £290 000', 'Online: EV = (0.5 x £420 000) + (0.5 x £260 000) = £340 000; net gain = £220 000', 'Worst cases: in person £50 000 profit, online £140 000 profit'], 'The higher net gain favours in-person, but the online option is lower risk - that contrast is your evaluation.')}
<h4>Value and limitations of decision trees</h4>
<ul><li><strong>+</strong> Set out options logically; quantify risk; compare options numerically; force consideration of failure.</li>
<li><strong>-</strong> Probabilities and outcomes are estimates (often guesses); EV is an average that will not actually occur; ignores qualitative factors (staff, reputation, ethics); the business's attitude to risk matters.</li></ul>
<h4>Influences on decisions (spec list)</h4>
<p>Mission, objectives, ethics, the external environment including competition, and resource constraints (finance, people, time, capacity).</p>
${tip('In 2021 P1 Q17 most marks were lost by forgetting to subtract the cost to get <strong>net gain</strong>, and by comparing EVs instead of net gains.')}
${seen('2021 P1 Q17 (decision tree calc); 2025 P2 Q1.3 (decision tree with qualitative factors); 2024 P1 Q9 MCQ (probabilities).')}
`),
    topic('3.2.3', 'Stakeholders and stakeholder mapping', `
${def('Stakeholder', 'any individual or group with an interest in, or affected by, the business - shareholders, employees, customers, suppliers, the local community, government, pressure groups.')}
<h4>Overlap and conflict</h4>
<p><strong>Overlap</strong>: in the long run, satisfied customers and engaged employees generate profit for shareholders. <strong>Conflict</strong>: in the short run, resources are limited - higher wages mean lower dividends; a factory closure helps shareholders but hurts staff and the community.</p>
<h4>Stakeholder mapping (Mendelow) - learn the exact terms</h4>
${table(['', 'Low interest', 'High interest'], [
  ['<strong>High power</strong>', 'Keep satisfied', 'Manage closely (key players)'],
  ['<strong>Low power</strong>', 'Monitor (minimum effort)', 'Keep informed'],
])}
<p>Managing relationships = <strong>communication</strong> (newsletters, meetings, social media) and <strong>consultation</strong> (asking for views before deciding).</p>
${chain('how mapping guides a response to a pressure group', [
  'The campaign group has low power but high interest, so the map says "keep informed".',
  'Regular updates on the packaging plan reduce the chance of a second viral campaign.',
  'Supermarket customers have high power and high interest, so they must be managed closely - they could delist the products.',
  'Mapping lets managers prioritise limited time on the stakeholders who can do most damage, while recognising that a pressure group\'s power can grow via social media.'])}
${mistake('2023 P2 Q3.2: many students knew stakeholder mapping vaguely but did not use its terminology (keep informed / monitor) and some discussed other stakeholders instead of the one named in the question.')}
${seen('2023 P2 Q3.2 (stakeholder mapping); 2022 P3 Q5 (stakeholder conflict in a takeover); 2020 P3 Q1 (share price and stakeholders).')}
`),
  ]);

  /* ===================================================== 3.3 */
  section(3, '3.3 Marketing management', 'Marketing objectives, research and data, elasticity, segmentation/targeting/positioning, the 7Ps, digital marketing', [
    topic('3.3.1', 'Setting marketing objectives', `
<p>Marketing objectives (spec list): <strong>sales volume and value, market size, market and sales growth, market share, brand loyalty</strong>. They come from corporate objectives and guide the marketing mix.</p>
${formula(['Market share (%) = business sales / total market sales x 100', 'Market (or sales) growth (%) = (new - old) / old x 100'])}
${worked('market share can fall while sales rise', ['Sales £18m &rarr; £21m (+16.7%)', 'Market £150m &rarr; £200m (+33.3%)', 'Share 12% &rarr; 10.5%: a fall of 1.5 percentage points'], 'A business growing slower than its market is losing share.')}
${chain('why an entrepreneur sets an ambitious market share target', [
  'The market is young and growing 20% a year, so share is still "up for grabs".',
  'Rapid early success (three busy branches in a year) makes the owner confident.',
  'A 15% share would make the brand a major national player against a few large franchise chains.',
  'A short (3-year) deadline reflects a desire to grow before social trends change or rivals fill the gaps.'])}
${tip('2024 P3 Q2: one factor, well developed in context, was enough for all levels. A conclusion was not needed and earned nothing.')}
`),
    topic('3.3.2', 'Markets, customers, research and elasticity', `
<h4>Market research</h4>
${table(['', 'Primary', 'Secondary'], [
  ['What', 'New data for this purpose (surveys, focus groups, test marketing)', 'Existing data (government stats, industry reports, company data)'],
  ['+', 'Specific, up to date, confidential', 'Cheap, quick, large samples'],
  ['-', 'Costly, slow, risk of bias', 'May be out of date or not specific'],
])}
<p><strong>Qualitative</strong> = opinions and reasons (why); <strong>quantitative</strong> = numerical (how many).</p>
<h4>Sampling</h4>
${table(['Method', 'How', 'Use'], [
  ['Random', 'Every member has an equal chance', 'Statistically valid but needs a full list (sampling frame)'],
  ['Stratified', 'Random within each group, in proportion to its size', 'Representative of key segments'],
  ['Quota', 'Interviewers fill set numbers per group - not random', 'Cheap and quick; interviewer bias'],
])}
${mistake('Questioning the data is rewarded: small samples (27 families), old data (2021), or a biased sample (members of a campaign group) mean findings may not represent the market. Few students did this in 2024 P2 Q1.4.')}
<h4>Interpreting marketing data</h4>
<ul><li><strong>Correlation</strong>: positive/negative and strength (close to +1/-1 = strong). Correlation &ne; causation.</li>
<li><strong>Confidence intervals</strong>: "95% confident sales will be 400-500" - a range, not a certainty; wider interval = less precise.</li>
<li><strong>Extrapolation</strong>: extending a past trend - unreliable when markets change quickly.</li></ul>
<h4>Price and income elasticity (interpret - you do not have to calculate)</h4>
${formula(['PED = % change in quantity demanded / % change in price   (usually negative)', 'YED = % change in quantity demanded / % change in income'])}
${table(['Value', 'Meaning', 'To raise revenue'], [
  ['PED between 0 and -1 (e.g. -0.5)', 'Price <strong>inelastic</strong>', 'Raise price - quantity falls proportionately less'],
  ['PED beyond -1 (e.g. -1.2, -2.0)', 'Price <strong>elastic</strong>', 'Cut price - quantity rises proportionately more'],
  ['PED = 0', 'Perfectly inelastic', 'A price rise raises revenue by the full %'],
  ['YED positive', 'Normal good (above +1 = luxury)', 'Demand rises when incomes rise'],
  ['YED negative', 'Inferior good', 'Demand rises when incomes fall'],
])}
${worked('PED -2.0 and YED +0.5 with falling incomes and a price rise', ['Price rise of 5% &rarr; quantity falls about 10% (elastic) &rarr; revenue falls', 'Incomes fall &rarr; demand for a normal good falls (by half the % fall in income)', 'Both effects reduce sales revenue; the price effect is larger'])}
${mistake('Examiners repeatedly report confusion between "elastic" and "inelastic" (2023 P1 Q19, 2022 P2 Q1.4). -0.5 is INELASTIC. Learn it by heart: ignore the sign - below 1 = inelastic.')}
${seen('2023 P1 Q19 (PED/YED and revenue); 2022 P2 Q1.4 (pricing black v health tea); 2021 P1 Q18; 2023 P2 Q3.1 (sampling bias).')}
`),
    topic('3.3.3', 'Segmentation, targeting and positioning (STP)', `
${def('Segmentation', 'dividing a market into groups of customers with similar characteristics. Spec methods: demographic, geographic, income, behavioural.')}
${def('Targeting', 'choosing which segment(s) to serve: niche (small, specialised) or mass (whole market).')}
${def('Positioning', 'how the product is perceived relative to rivals; shown with a market map.')}
<h4>Niche v mass</h4>
${table(['', 'Niche', 'Mass'], [
  ['+', 'Less competition, premium price, loyal customers', 'Economies of scale, large revenue'],
  ['-', 'Small market, vulnerable to tastes or big entrants', 'Intense competition, price pressure'],
])}
${chain('why a LARGE business enters a niche', [
  'Its mass-market product is in a saturated market with falling margins.',
  'A niche product (e.g. premium organic range) can carry a premium price and higher margins.',
  'The large firm already has brand recognition, distribution and finance, so it can launch quickly and outspend small specialists.',
  'It adds profit and spreads risk across segments without large new investment.'])}
${mistake('2023 P1 Q18: the discriminator was whether the size of the business was built into the argument. Describing niche markets in general stayed in Level 2.')}
<h4>Market mapping</h4>
<p>Plot brands on two axes relevant to customers (price/quality, traditional/modern). Reveals gaps - but a gap may exist because there is no demand there.</p>
${seen('2023 P1 Q18; 2022 P2 Q1.3 (segmentation benefit); 2025 P2 Q2.4 (income segmentation for all businesses).')}
`),
    topic('3.3.4', 'The marketing mix (7Ps) and digital marketing', `
<p><strong>Product, Price, Promotion, Place, People, Process, Physical environment.</strong> An <em>integrated</em> mix means every element supports the same positioning (a premium brand needs premium price, distribution, staff and surroundings).</p>
<h4>Product: Boston Matrix and product life cycle</h4>
${table(['', 'High market share', 'Low market share'], [
  ['<strong>High market growth</strong>', 'Star - invest to keep share', 'Question mark - invest selectively or drop'],
  ['<strong>Low market growth</strong>', 'Cash cow - "milk" to fund others', 'Dog - consider withdrawing (but may still be profitable)'],
])}
<p>PLC: development &rarr; introduction &rarr; growth &rarr; maturity &rarr; decline. <strong>Extension strategies</strong>: new uses, new markets, new versions, repackaging, promotion. Value: helps plan cash flow and timing of new products. Limits: stages are only clear in hindsight; life cycles can be manipulated by marketing.</p>
<h4>Price</h4>
<ul><li><strong>Skimming</strong>: high launch price for innovative products with few rivals and price-inelastic early adopters; recovers R&amp;D quickly.</li>
<li><strong>Penetration</strong>: low launch price to build share quickly; suits price-elastic demand and markets with economies of scale.</li>
<li>Influences: PED, costs, competition, positioning, PLC stage. Digital tech enables <strong>dynamic pricing</strong>.</li></ul>
<h4>Promotion</h4>
<p>Branding (allows premium prices, loyalty), social media (targeted, two-way, measurable), viral marketing (cheap reach but loss of control), sponsorship, advertising, personal selling (vital in B2B).</p>
<h4>Place</h4>
<p>Multi-channel distribution: stores + website + app + third parties - convenience and reach, but costly to coordinate and risk of cannibalisation.</p>
<h4>People, process, physical environment</h4>
<p>Crucial for services: staff are part of the product; process (speed, ease of ordering) shapes satisfaction; physical environment signals quality.</p>
${chain('using survey data to adjust the mix (Paper 2 style)', [
  'Only 28% of customers rate price as very important, but 61% rate quality.',
  'Demand is likely to be price inelastic, so a modest price rise to cover rising bean costs should not lose many customers.',
  'Product decisions should protect quality rather than switch to cheaper beans.',
  'Speed matters to 52%, so process changes (mobile ordering) could protect loyalty at peak times.'])}
${evalBox(['the target market and positioning', 'the stage in the product life cycle and Boston Matrix position', 'competitors\' actions', 'the budget - promotion is often the first cost to be cut', 'the reliability of the data used'])}
${mistake('2023 P3 Q4 and 2024 P2 Q1.4: weak answers drifted into "what Bodhi should do to increase sales" instead of judging <em>whether</em> the current promotion would increase sales. Answer the question that is set.')}
${seen('2022 P1 Q22 (Boston Matrix essay); 2021 P2 Q2.4 (dogs); 2024 P2 Q1.4 (sponsorship); 2023 P3 Q4 (promotion); 2022 P3 Q1 (promotional decisions); 2021 P3 Q1 (mix for focused differentiation).')}
`),
  ]);

  /* ===================================================== 3.4 */
  section(4, '3.4 Operational management', 'Operational objectives, productivity, capacity, lean production, quality, inventory and supply chains', [
    topic('3.4.1', 'Setting operational objectives', `
<p>Spec list: <strong>costs, quality, speed of response, flexibility, environmental objectives, added value</strong>.</p>
${formula(['Added value = selling price - cost of bought-in materials and components'])}
${chain('why an eco-brand prioritises environmental objectives in operational decisions', [
  'The founding mission promises to protect the environment, so customers buy partly for that reason.',
  'An operational decision such as using only renewable power keeps operations consistent with the brand.',
  'This protects the unique selling point and allows a premium price.',
  'Abandoning it to cut costs could lose loyal, ethically motivated customers.'])}
${mistake('2023 P3 Q1: answers that never mentioned an actual <em>operational decision</em> (e.g. renewable power, recycled materials) stayed in Level 2 even with good marketing analysis. Address both halves of the question.')}
${seen('2023 P3 Q1 (environmental objectives); 2025 P1 Q10 MCQ (operational objectives); 2022 P2 Q3 (speed and reliability).')}
`),
    topic('3.4.2', 'Analysing operational performance', `
${formula(['Labour productivity = output per period / number of employees', 'Unit (average) cost = total costs / units of output', 'Capacity = maximum possible output in a period', 'Capacity utilisation (%) = actual output / maximum possible output x 100'])}
${worked('capacity utilisation and unit costs', ['Fixed costs £600 000; variable cost £8 per unit; capacity 50 000', 'At 30 000 units (60%): £600 000 / 30 000 + £8 = £28 per unit', 'At 40 000 units (80%): £600 000 / 40 000 + £8 = £23 per unit'], 'Higher utilisation spreads FIXED costs over more units - that is the core mechanism.')}
${chain('benefits of high capacity utilisation for a busy restaurant', [
  'High utilisation means rent, equipment and core staff costs are spread over many customers.',
  'Fixed cost per customer falls, so the unit cost of each dessert falls.',
  'This can offset lower gross profit margins than rivals and boost operating profit.',
  'A busy restaurant also signals popularity to passers-by, supporting further sales.'])}
${mistake('2024 P3 Q1: many students wrote about high CAPACITY (being able to serve lots of people) or high demand, not capacity UTILISATION. These answers were not credited. 2024 P2 Q1.3: some assumed lower labour productivity means lower quality - the key link is higher unit costs.')}
<h4>Interpreting index numbers</h4>
<p>Base year = 100. 104.2 means 4.2% above the base year. Compare trends (e.g. a business falling from 104.2 to 100.3 while the industry rose to 105.9 is losing cost competitiveness).</p>
${seen('2024 P3 Q1 (capacity utilisation); 2024 P2 Q1.3 (productivity index); 2023 P3 Q3 (new facility efficiency); 2020 P1 Q17 (employee costs).')}
`),
    topic('3.4.3', 'Efficiency, productivity, lean production and technology', `
<h4>Increasing labour productivity</h4>
<p>Training, better equipment/automation, motivation, better methods (kaizen), better management. <strong>Difficulties</strong>: cost, resistance, possible fall in quality if workers rush.</p>
<h4>Using capacity efficiently</h4>
<p>Under-utilisation &rarr; rationalise (cut capacity), increase demand, use spare capacity for new products/contract work. Over-utilisation (near 100%) &rarr; no flexibility, staff stress, maintenance problems &rarr; outsource, temporary staff, invest in capacity.</p>
<h4>Lean production</h4>
${table(['', 'Just in Time (JIT)', 'Just in Case (JIC)'], [
  ['Idea', 'Inventory arrives exactly when needed', 'Hold buffer stocks in case of surges or delays'],
  ['+', 'Lower holding costs and waste; frees cash and space; exposes problems', 'Can meet sudden demand; protected from supply delays; bulk discounts'],
  ['-', 'Vulnerable to supply disruption; needs reliable suppliers; more frequent ordering', 'Ties up cash; storage costs; risk of obsolete stock'],
])}
${def('Kaizen', 'continuous improvement through many small changes suggested by employees - internal, incremental change.')}
<h4>Labour v capital intensive</h4>
${table(['Choose labour-intensive when', 'Choose capital-intensive when'], [
  ['Wages are low; products are bespoke or hand-crafted; volumes small; finance limited; flexibility needed', 'Wages are high; standardised, high-volume output; consistency matters; finance available'],
])}
${chain('why automation could make a warehouse more competitive', [
  'Robots pick 175 orders per worker per day compared with 98 by hand.',
  'Labour cost per order falls (e.g. £1.18 towards £0.71), so the firm can cut prices or raise margins.',
  'Error rates fall from 2.3% towards 0.4%, so retailers receive accurate orders on time.',
  'Better reliability helps win back the contracts that were lost to automated rivals.'])}
${evalBox(['the reliability of suppliers and the supply chain (JIT)', 'the volume and standardisation of output (automation)', 'access to finance and the payback period', 'employee attitudes and the culture'], 'whether lean or automation reduces unit costs depends on')}
${seen('2024 P1 Q24 (lean and unit costs); 2022 P1 Q21 (labour v capital intensive); 2023 P2 Q1.3 (capital intensive); 2021 P3 Q3 (JIT); 2020 P2 Q2.3; 2025 P3 Q6 (capacity management).')}
`),
    topic('3.4.4', 'Improving quality', `
${table(['', 'Quality assurance (QA)', 'Quality control (QC)'], [
  ['Approach', 'Prevention - build quality into every stage', 'Detection - inspect output'],
  ['Who', 'Everyone (often with TQM, kaizen, quality circles)', 'Inspectors / QC department'],
  ['+', 'Fewer defects, less waste, motivated staff', 'Faulty items stopped before reaching customers'],
  ['-', 'Training and culture change needed; slow to introduce', 'Waste already created; relies on inspectors'],
])}
<p><strong>Benefits of better quality</strong>: premium price, less price-elastic demand, fewer returns, brand loyalty, competitive advantage. <strong>Difficulties</strong>: cost, time, staff resistance. <strong>Consequences of poor quality</strong>: refunds/recalls, waste, reputational damage, lost repeat business, legal action.</p>
${mistake('2025 P1 Q24: a significant minority confused quality control with quality assurance, so their arguments were misplaced. Learn the difference precisely.')}
${seen('2025 P1 Q24 (QC v QA and profit); 2023 P1 Q24 (profit needs quality?); 2021 P2 Q3.2 (benefits of quality focus); 2025 P2 Q3.2 (airline quality measures).')}
`),
    topic('3.4.5', 'Managing inventory and supply chains', `
<h4>Inventory control charts</h4>
${formula(['Re-order level = (usage per day x lead time) + buffer inventory', 'Re-order quantity = maximum inventory - buffer inventory (if delivery arrives as buffer is reached)', 'Lead time = time between ordering and delivery'])}
${worked('reading an inventory chart', ['Buffer 750; maximum 6 000; reorder level 2 150; usage falls from 6 000 to 750 over 15 days', 'Usage = (6 000 - 750) / 15 = 350 units per day', 'Lead time = (2 150 - 750) / 350 = 4 days', 'Re-order quantity = 6 000 - 750 = 5 250 units'])}
<h4>Matching supply to demand</h4>
<p>Spec methods: <strong>outsourcing</strong>, <strong>temporary and part-time employees</strong>, <strong>producing to order</strong>. Also: holding inventory, overtime, flexible capacity.</p>
<h4>Choosing suppliers</h4>
<p>Price, quality, reliability (on-time delivery), capacity, payment terms, flexibility, ethics/location. Which matters most depends on the business: a JIT manufacturer prizes reliability; a discount retailer prizes price; a luxury brand prizes quality.</p>
<h4>Outsourcing</h4>
<p><strong>+</strong> specialist expertise and economies of scale, converts fixed to variable costs, focus on core competences. <strong>-</strong> loss of control over quality and timing, supplier may serve competitors, longer lead times.</p>
${seen('2023 P1 Q16 (inventory chart); 2022 P2 Q3 (lead time, re-order quantity, supplier reliability); 2020 P3 Q3 (cheaper suppliers); 2021 P2 Q1.4 (branch closures to match supply and demand).')}
`),
  ]);

  /* ===================================================== 3.5 */
  section(5, '3.5 Financial management', 'Financial objectives, profit measures, budgets and variances, cash flow, break-even, sources of finance, improving cash flow and profit', [
    topic('3.5.1', 'Setting financial objectives', `
<p>Spec list: return on investment, revenue, costs and profit objectives, cash flow objectives.</p>
${formula(['Gross profit = revenue - cost of sales', 'Operating profit = gross profit - operating expenses', 'Profit for the year = operating profit - net finance costs - tax', 'Margin (%) = profit measure / revenue x 100', 'Return on investment (%) = return / cost of investment x 100'])}
${def('Cash flow v profit', 'profit is revenue minus costs in a period; cash flow is the timing of money in and out. A profitable business can fail through lack of cash (credit sales, inventory, loan repayments).')}
${worked('why gross profit margin fell although revenue rose', ['Revenue £46.994m &rarr; £47.569m (+1.2%)', 'Gross profit £22.82m &rarr; £22.289m; margin 48.6% &rarr; 46.9%', 'So cost of sales rose faster than revenue - e.g. potato prices +35%, falling labour productivity'])}
${mistake('Know where each cost goes: rent is an operating expense (affects operating profit, not gross profit); interest is a finance cost; corporation tax is deducted after that. 2024 P2 Q1.2: many students did not distinguish gross profit from gross profit MARGIN.')}
`),
    topic('3.5.2', 'Budgets, cash flow forecasts and break-even', `
<h4>Budgets and variances</h4>
${def('Variance', 'actual minus budget. <strong>Favourable</strong> if it increases profit (revenue above budget, costs below); <strong>adverse</strong> if it reduces profit.')}
${worked('profit variance', ['Budget: revenue £420 000, costs £350 000 &rarr; profit £70 000', 'Actual: revenue 5% lower = £399 000; costs 4% higher = £364 000 &rarr; profit £35 000', 'Profit variance = £35 000 ADVERSE'])}
<p>Value of budgeting: planning, coordination, control, motivation, accountability. Limits: based on forecasts, can be rigid, can encourage "use it or lose it" spending. Flexible/rolling budgets help in fast-changing markets.</p>
<h4>Cash flow forecasts and timings</h4>
<p>Inflows - outflows = net cash flow; opening balance + net cash flow = closing balance. <strong>Receivables</strong> (money owed TO the business) and <strong>payables</strong> (money the business OWES) determine timing: collect receivables sooner and pay payables later to improve cash flow.</p>
<h4>Break-even analysis</h4>
${formula(['Contribution per unit = selling price - variable cost per unit', 'Total contribution = contribution per unit x units sold', 'Break-even output = fixed costs / contribution per unit', 'Margin of safety = actual output - break-even output', 'Profit = total contribution - fixed costs'])}
${worked('margin of safety (2024 P1 Q16 style)', ['Contribution per unit = £10 - £6 = £4', 'Current output = total contribution / contribution per unit = £10 000 / £4 = 2 500', 'Break-even = £8 000 / £4 = 2 000', 'Margin of safety = 500 UNITS'], 'Writing "£500" lost a mark - margin of safety here is in units.')}
<h4>Changes on a break-even chart</h4>
${table(['Change', 'Effect on chart', 'Break-even output'], [
  ['Price rises', 'Revenue line steeper', 'Falls'],
  ['Variable cost per unit rises', 'Total cost line steeper', 'Rises'],
  ['Fixed costs rise', 'FC and TC lines shift up', 'Rises'],
])}
<p>Value: quick "what if" tool, shows risk (margin of safety), supports finance applications. Limits: assumes constant price and costs, all output sold, single product.</p>
${seen('2024 P1 Q16 (margin of safety); 2020 P1 Q16 (profit variance); 2024 P3 Q3 (slushy machines break-even); 2024 P1 Q4 MCQ (variances).')}
`),
    topic('3.5.3', 'Sources of finance', `
${table(['Source', 'Internal/external', 'Short/long term', 'Advantages', 'Disadvantages'], [
  ['Retained profit', 'Internal', 'Long', 'No interest, no dilution of ownership', 'May be too small; shareholders may want dividends'],
  ['Overdraft', 'External', 'Short', 'Flexible; pay interest only when overdrawn', 'High interest; bank can withdraw it'],
  ['Debt factoring', 'External', 'Short', 'Immediate cash (often ~80%) from receivables', 'Fee cuts profit; may affect customer relations'],
  ['Loan', 'External', 'Medium/long', 'Fixed repayments; no loss of ownership', 'Interest must be paid regardless; raises gearing; security needed'],
  ['Share capital', 'External', 'Long', 'No repayment; dividends can be cut in bad years; lowers gearing', 'Dilutes control; dividends expected; costly to issue'],
  ['Venture capital', 'External', 'Long', 'Large sums plus expertise for high-risk firms', 'Gives away equity and some control; investors want a big return/exit'],
  ['Crowd funding', 'External', 'Long', 'Taps supporters; tests demand; publicity', 'May fail to hit target; platform fees; public idea'],
])}
${chain('why a plc may prefer share capital to a loan', [
  'Share capital does not have to be repaid, so it suits a long-term investment.',
  'Dividends can be cut if profits fall, whereas loan interest must be paid regardless.',
  'With rising interest rates a loan becomes more expensive and raises gearing.',
  'Lower financial risk protects the share price and the firm\'s future borrowing capacity.'])}
${mistake('2022 P3 Q3: many students thought debt factoring meant charging interest on late payments. It means SELLING receivables to a factor for most of their value now. Answers without this understanding could not get past Level 2.')}
${evalBox(['the amount needed and how long for (match the source to the use)', 'current gearing and the cost of borrowing', 'the owners\' willingness to give up control', 'the business form (an Ltd cannot sell shares to the public)', 'the risk and stage of the business'])}
${seen('2024 P1 Q18 (share capital v loan); 2022 P3 Q3 (debt factoring); 2023 P3 Q5 (bank loan risk); 2020 P2 Q3 (franchising finance).')}
`),
    topic('3.5.4', 'Improving cash flow and profits', `
${table(['Improve cash flow', 'Improve profit / profitability'], [
  ['Chase receivables / shorten credit terms', 'Raise prices (if PED inelastic)'],
  ['Delay payments to suppliers (longer credit)', 'Cut costs: cheaper suppliers, lean, automation'],
  ['Debt factoring', 'Increase sales volume (promotion, new markets)'],
  ['Reduce inventory (JIT)', 'Improve productivity and capacity utilisation'],
  ['Sale and leaseback; lease rather than buy', 'Drop loss-making products'],
  ['Overdraft / short-term finance', 'Add value: branding, quality, differentiation'],
])}
<p><strong>Difficulties</strong>: trade-offs - factoring improves cash but costs profit; delaying suppliers damages relationships; price rises may lose customers; cost cuts may hit quality and morale.</p>
${chain('why turning a loss into a profit is hard for a streaming service', [
  'Costs are rising: a union deal guarantees salaries above the industry average.',
  'A global skills shortage keeps labour turnover high, so recruitment costs stay high too.',
  'New rivals that own content rights have lower costs and can undercut prices.',
  'So cutting costs or raising prices both risk losing subscribers in an economic slowdown.'])}
${mistake('2024 P2 Q2.2: many students discussed costs only and ignored revenue, and few related the analysis to turning a LOSS into a PROFIT. 2024 P2 Q3.1: some suggested a bank loan when the case said banks would not lend - always check the context.')}
${seen('2024 P2 Q3.1 (improve cash flow); 2024 P2 Q2.2 (loss to profit); 2021 P2 Q2.2 (payables and receivables); 2020 P1 Q19.')}
`),
  ]);
})();
