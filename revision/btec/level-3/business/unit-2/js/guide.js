/* Business Unit 2 — Developing a Marketing Campaign: comprehensive revision guide.
   Uses the shared guide engine (biz-guide.js). Worked examples use the June 2024 Funky Flasks research pack. */
(function () {
  'use strict';
  const { svg: S, h: H, P } = window.BizGuide;
  const { key, tip, warn, fig, table, ul, formula, example, steps, cards, stats, check, two, photo, unsplash } = H;

  /* ───────────── THE SET TASK ───────────── */
  function setTask() {
    const afBars = S.bars([['AF1 Structure', 4, P.blue], ['AF2 Aims & objectives', 8, P.blue], ['AF3 Research & analysis', 12, P.blue], ['AF4 Justification', 10, P.blue], ['AF5 Mix, message, media', 20, P.orange], ['AF6 Budget', 8, P.orange], ['AF7 Timescale', 4, P.orange], ['AF8 Presentation', 4, P.orange]], { w: 700, h: 280, max: 24, unit: 'Marks available (blue = Activity 1: 34 · orange = Activity 2: 36)', label: 'Marks for each assessment focus' });
    return `
<div class="guide-aim-hd"><div class="guide-aim-badge">★</div><div><div class="guide-aim-title">The assessment: Part A research pack + Part B set task</div><div class="guide-aim-subtitle">70 marks · 2 hours to prepare · 3 hours to write a rationale and a campaign plan</div></div></div>
<div class="g-set-hero">${S.hero('Plan a campaign. Justify every choice.', 'You analyse a research pack, write a rationale (Activity 1) and then a full marketing campaign plan (Activity 2).', ['megaphone', 'chart', 'target'], P.blue)}</div>
${stats([['70', 'marks'], ['2 h', 'Part A prep'], ['3 h', 'Part B task'], ['8', 'assessment foci']])}
${fig(S.flow([['Part A research pack', 'afternoon before · 2 hours'], ['Notes', 'max 2 sides of A4 + annotated pack'], ['Part B set task', 'next morning · 3 hours · computer'], ['Submit', 'rationale + budgeted plan']], { w: 700, h: 82, label: 'How the assessment runs' }), 'Part A is issued on the afternoon before Part B. You may take two sides of A4 notes and your annotated pack into the 3-hour supervised session. No pre-prepared plans are allowed in the notes.')}
${key('How it is marked', 'There are <strong>no questions</strong> – two activities are marked against <strong>eight assessment foci (AF)</strong>. Each AF is placed in a band (1–4) using best fit and the AF marks add up to 70. The biggest prizes are <strong>AF5 (20 marks)</strong>, <strong>AF3 (12)</strong> and <strong>AF4 (10)</strong>.')}
${fig(afBars, 'Where the 70 marks are. Half the marks sit in AF3, AF4 and AF5 – analysis, justification and the marketing mix.')}
<h4>Assessment focus cheat-sheet</h4>
${table(['AF', 'Marks', 'What earns the top band', 'What loses marks (examiner reports)'], [
      ['<strong>AF1</strong> Structure', '4', 'Logical headings/paragraphs; marketing terms used accurately throughout', 'Slang, informal language, no technical vocabulary'],
      ['<strong>AF2</strong> Aims & objectives', '8', 'Relevant aims AND measurable objectives for THIS business, each rationalised with data', '“Increase sales” with no development = 1 mark; generic objectives; no link back to them later'],
      ['<strong>AF3</strong> Research & analysis', '12', 'Primary AND secondary data selected, analysed (“this means…”), used in both activities; reliability and validity judged', 'Copying statistics; research placed in one separate section; only primary data evaluated'],
      ['<strong>AF4</strong> Justification', '10', 'SWOT/PESTLE/PLC USED – each finding evaluated and turned into an action; appropriateness explained', 'Bullet-point tools with no actions; only “SWOT” named; only part of PESTLE'],
      ['<strong>AF5</strong> Mix, message, media', '20', 'All 7Ps in context, one message flowing through, selective justified media within budget/time', 'Only promotion; generic social media + flyers; target market written under “People”; no message'],
      ['<strong>AF6</strong> Budget', '8', '£ figure for every activity incl. wider costs, total ≤ budget', 'Just the total (1); % split (2); missing wider costs'],
      ['<strong>AF7</strong> Timescale', '4', 'Dated Gantt/calendar with preparation, durations and reasons for timing', 'Just “6 months” (1); months listed with no detail'],
      ['<strong>AF8</strong> Presentation', '4', 'Professional plan for the owners using the brief’s headings; correct terminology', 'Note format; errors; informal tone']])}
<h4>A 3-hour plan that works</h4>
${fig(S.ladder([['5 min – read Part B and decide the option', 'Underline the aims, budget, timescale and the EITHER/OR choice'], ['10 min – plan both activities', 'List the 5–6 research facts you will analyse in each section'], ['80 min – Activity 1 rationale (34 marks)', 'Aims & objectives → research analysis → reliability/validity → SWOT/PESTLE/PLC → justification'], ['85 min – Activity 2 plan (36 marks)', 'Message → 7Ps mix → media → budget table → timescale'], ['If time: check', 'Do the budget figures add up? Do aims appear again in the plan? Spelling and headings?']], { w: 700, label: 'Suggested time plan' }), 'Roughly 2.5 minutes per mark. Don’t spend 100 minutes on Activity 1 – AF5 alone is worth more than half of Activity 1.')}
<h4>Structure for each activity</h4>
${two(`<strong>Activity 1 – the rationale</strong>${steps(['Marketing aims and objectives (with numbers/dates + why)', 'Market and competition: size, share, structure, trends, competitors – with analysis', 'Target market from the survey (age, features, price, place)', 'Reliability and validity of primary AND secondary data', 'SWOT / PESTLE / PLC – each point → action', 'Justification and appropriateness of the chosen option'])}`, `<strong>Activity 2 – the plan</strong>${steps(['Marketing message (and how it links to the aims)', 'Marketing mix: 4Ps + people, physical environment, process', 'Media/promotion selection with reasons and costs', 'Budget table (£ per activity, total, remaining)', 'Timescale: Gantt/calendar with dates and reasoning', 'How the campaign will be evaluated against the objectives'])}`)}
${tip('Use the <strong>research pack in both activities</strong>. Examiners note that learners who put research in one separate section, or only inside SWOT/PESTLE boxes, limit their AF3 marks. Weave data into every decision: “because 704 of 750 respondents would buy from supermarkets…”.')}
${warn('<strong>EITHER/OR briefs:</strong> choose ONE option (e.g. sponsorship OR retailers), justify it with the research, and explain why you rejected the other. Planning both equally makes the plan unrealistic for the budget.')}
<h4>How the task has changed</h4>
${H.table(['Series', 'Part A', 'Notes allowed'], [['June 2017 – June 2021', 'Learners did independent research on the market (about 6 hours) using a brief', 'Up to 6 sides of A4 (no analysis in notes)'], ['January 2022 onwards (6 series by June 2024)', 'Research pack provided (primary + secondary data, media costs); 2 hours to prepare', 'Up to 2 sides of A4 + annotated Part A'], ['Part B (all series)', '3 hours, computer, rationale + budgeted plan', '—']])}
${photo(unsplash('photo-1533750349088-cd871a92f312'), 'Plan the campaign like a marketing manager: research → rationale → plan.')}`;
  }

  /* ───────────── AIM A ───────────── */
  function a1() {
    const principles = S.cycle([['Anticipate', 'predict future wants'], ['Recognise', 'identify current wants'], ['Stimulate', 'encourage customers to buy'], ['Satisfy', 'deliver & keep customers']], { center: 'Four principles of marketing', label: 'The four principles of marketing', h: 300 });
    const smart = S.tiles([['S – Specific', 'Online sales of personalised bottles'], ['M – Measurable', 'Up by 10% (a number)'], ['A – Achievable', 'Realistic for the budget'], ['R – Relevant', 'Supports the aim to increase sales'], ['T – Time-bound', 'By the end of week 24']], { cols: 5, th: 92, w: 700, label: 'SMART objectives' });
    const seg = S.tiles([['Demographic', 'age, gender, income, occupation'], ['Geographic', 'country, region, urban/rural'], ['Psychographic', 'values, interests, lifestyle'], ['Behavioural', 'usage, loyalty, benefits sought']], { cols: 4, th: 86, w: 700, label: 'Ways to segment a market' });
    return `
${S.icon ? '' : ''}${key('Why marketing matters', 'Marketing identifies what customers want, develops the product and message to satisfy them, and keeps them coming back. In the set task you plan a campaign for one business, so every idea must be <strong>specific to that business</strong>.')}
<h4>Principles and purposes of marketing</h4>
${fig(principles, 'Marketing works as a cycle: recognise and anticipate demand, stimulate it, satisfy it – then learn from the results.')}
${table(['Principle', 'Meaning', 'Funky Flasks example'], [['Anticipating demand', 'Predicting future wants using research and trends', 'Reusables forecast to reach 80% of UK use by 2028'], ['Recognising demand', 'Spotting existing wants and needs', '93% of survey respondents want personalisation'], ['Stimulating demand', 'Encouraging customers to want/buy', 'Social media campaign, festival stands, offers'], ['Satisfying demand', 'Delivering the right product, price and service', 'Plastic-free UK-made bottles delivered by post']])}
<h4>Marketing aims and objectives</h4>
${H.cards([['Understanding customer wants and needs', 'Research and feedback', P.blue], ['Developing new products', 'New ranges, limited editions', P.teal], ['Improving profitability', 'Higher margins, more sales', P.green], ['Increasing market share', 'Win customers from rivals', P.amber], ['Diversification', 'New products/markets', P.orange], ['Brand awareness and loyalty', 'Recognition and repeat buying', P.violet]], 3)}
${fig(smart, 'An objective must be SMART – “increase online sales by 10% by the end of week 24”.')}
${example('From weak to top-band objective', '<p><strong>Weak (1 mark):</strong> “Funky Flasks wants to increase sales.”</p><p><strong>Top band:</strong> “<em>Aim:</em> reverse the fall in sales of the main range. <em>Objective 1:</em> grow online sales of personalised bottles by 10% by the end of the six-month campaign – justified because 694 of 750 respondents would pay extra for personalisation. <em>Objective 2:</em> add 2,000 TikTok followers by week 12 to widen the 16–35 audience (45% of the sample).”</p>')}
${tip('Link objectives to the marketing mix and refer back to them in Activity 2 (“this activity supports objective 1 because…”). Examiners reward objectives that are revisited and that influence choices.')}
<h4>Types of market and segmentation</h4>
${two(`<strong>Mass market</strong>${ul(['Large number of customers with similar needs', 'Standard product, competitive price', 'High competition, low margins'])}`, `<strong>Niche market</strong>${ul(['Small specialised group', 'Specialist/personalised product, premium price', 'Less competition but limited customers'])}`)}
${fig(seg, 'Segmentation lets the business target the customers most likely to buy.')}
${table(['Segment evidence in the pack', 'What it suggests'], [['16–35 year olds = 341 of 750 (45%)', 'Main target for TikTok/Instagram'], ['66–75 year olds = 99 respondents', 'Secondary segment – retail/gifting'], ['Millennials treat bottles as fashion accessories (The Atlantic)', 'Design, colour and personalisation appeal'], ['Businesses and charities buy branded bottles', 'Corporate/B2B segment for bulk orders']])}
<h4>Branding</h4>
${S.layers ? fig(S.layers([['Brand image', 'How customers see the brand – quality, values, reputation', P.blue], ['Brand personality', 'Human traits: fun, caring, rebellious, premium…', P.violet], ['Unique selling point (USP)', 'The reason to choose you: plastic-free, UK-made, 10% to charity, personalisation', P.green]], { label: 'Branding' }), 'A strong brand makes customers recognise you, trust you and come back.') : ''}
${key('Business size and constraints', '<strong>Size</strong> affects budget and media (a medium-sized online business cannot buy prime-time TV); <strong>budgetary constraints</strong> (£60,000 in 2024) and <strong>availability of specialist staff</strong> (design, social media, video) decide what is realistic.')}
`;
  }

  function a2() {
    const pestle = S.tiles([['Political', 'Plastics ban Oct 2023; council refill fountains'], ['Economic', 'Cost of living; cheaper bespoke bottles from big brands'], ['Social', 'Reusables as a trend/fashion accessory; 59% use'], ['Technological', 'Social media ads; hydration-tracking bottles; Refill app'], ['Legal', 'ASA/CAP advertising rules; data protection'], ['Environmental', 'Blue Planet II; climate concern; plastic-free'], ['Ethical', 'Honest eco claims; fair influencer disclosure']], { cols: 4, th: 96, w: 700, label: 'External influences with examples' });
    return `
<h4>Internal influences</h4>
${table(['Influence', 'How it shapes the campaign', 'Funky Flasks'], [['Cost of the campaign', 'Total available and cost of each medium', '£60,000 for 6 months'], ['Availability of finance', 'Whether more can be borrowed or reinvested', 'Medium-sized; sales have fallen'], ['Expertise of staff', 'Skills in design, social media, video', 'Runs TikTok (5,000 followers) and email (1,200 contacts)'], ['Size of business', 'Scale and ambition', 'Online, medium-sized, UK manufacturing'], ['Culture', 'Values that guide choices', 'Sustainability, 10% of sales to charities']])}
<h4>External influences (PESTLE + ethical)</h4>
${fig(pestle, 'Each external factor can be an opportunity or a threat – the specification includes ethical alongside PESTLE.')}
${tip('Always say <strong>how</strong> the factor affects the campaign: “The plastics ban (political/environmental) raises demand, so the message can emphasise plastic-free and the campaign can run in the 2023–24 growth window.”')}
${warn('Don’t list PESTLE headings with one-word bullets. Examiners note an increase in learners including only <em>parts</em> of PESTLE – cover all relevant factors briefly but with data and actions.')}
`;
  }

  /* ───────────── AIM B ───────────── */
  function b1() {
    const pie = S.pie([['Chilly’s (£44m)', 44, P.blue], ['S’well', 30, P.teal], ['YETI / Hydro Flask / others', 60, P.violet], ['Independents & small producers', 66, P.amber]], { label: 'Illustrative market share', center: 'UK market' });
    return `
<h4>Why research?</h4>
${cards([['Target markets', 'Who buys? age, interests, price tolerance, where they shop', P.blue], ['Size, structure and trends', 'How big and how fast is it growing? Who competes?', P.green], ['Competition', 'Products, prices, promotion, market share of rivals', P.orange]], 3)}
${table(['Term', 'Meaning', 'Example from the pack'], [['Market size', 'Total sales value/volume', 'Forecast value ≈ $12.6 billion by 2030'], ['Market share', 'Business sales ÷ market sales × 100', 'Chilly’s annual sales over £44 million'], ['Market structure', 'Segments and competitors', 'Dominated by big brands; rising independents'], ['Market trend', 'Direction of change', 'Reusable use up from 20% (2015) to 59% (2023)']])}
${formula('Market share', '(business sales ÷ total market sales) × 100', 'e.g. £44m ÷ £400m × 100 = 11%')}
${fig(pie, 'Illustrative market structure – a few large brands and many small producers. (Figures are for illustration; use the numbers in your research pack.)')}
${tip('To analyse competition, compare: <strong>products</strong>, <strong>prices</strong>, <strong>promotion</strong> and <strong>strengths/weaknesses</strong>. e.g. Chilly’s uses limited-edition collaborations and a pop-up experience (“Flip the Ordinary” gave +26% website visitors and +300% social interactions).')}
`;
  }

  function b2() {
    const map = S.tiles([['Survey / questionnaire', 'quantitative · large samples · cheap online'], ['Interview', 'qualitative · depth · time-consuming'], ['Observation', 'what people do · no self-report bias'], ['Trials', 'test product/price in real conditions'], ['Focus group', 'qualitative · group opinions · costly'], ['Internal secondary', 'sales records, loyalty cards, customer database'], ['External secondary', 'reports, ONS, trade journals, media'], ['Quantitative vs qualitative', 'numbers vs reasons']], { cols: 4, th: 92, w: 700, label: 'Research methods' });
    const checks = S.flow([['Validity', 'measures the right thing?'], ['Reliability', 'consistent / trustworthy?'], ['Appropriateness', 'suits the decision?'], ['Currency', 'how recent?'], ['Cost', 'worth the money?']], { w: 700, h: 74, label: 'Five tests of research' });
    return `
${fig(map, 'Primary research is collected first-hand; secondary research already exists.')}
${table(['Method', 'Advantage', 'Disadvantage'], [['Questionnaire/survey', 'Cheap, quick, quantifiable, many people', 'Low response, bias, shallow answers'], ['Interview', 'Detailed qualitative insight', 'Time-consuming, interviewer bias'], ['Observation', 'Shows real behaviour', 'Cannot explain “why”'], ['Trials', 'Tests reaction before launch', 'Cost, small scale'], ['Focus group', 'Rich discussion of opinions', 'Costly, dominant voices'], ['Secondary (internal)', 'Cheap, relevant to the business', 'Only covers existing customers'], ['Secondary (external)', 'Wide coverage, expert analysis', 'May be dated or biased']])}
<h4>Judging research quality</h4>
${fig(checks, 'Use these five tests when evaluating reliability and validity in Activity 1.')}
${H.two(`<strong>Reliability issues</strong>${ul(['Small or self-selected sample', 'Single location or time', 'Leading questions', 'Source with a commercial interest', 'Forecasts (not facts)'])}`, `<strong>Validity issues</strong>${ul(['Out of date (currency)', 'Wrong population (a gym sample for the whole UK)', 'Asked what people SAY they would do', 'Measures awareness, not buying', 'Different definitions between sources'])}`)}
${example('Evaluating the Funky Flasks survey', '<p><strong>Reliability:</strong> 750 respondents is a reasonable sample, but “select all that apply” questions inflate totals, and the questionnaire was run in a single shopping centre with a gym, so it may over-represent active, health-conscious people.</p><p><strong>Validity:</strong> data is recent (April 2024) and directly about reusable drinkware, so it is relevant, but 387 respondents do not own a product so their answers on features are hypothetical. <strong>Compare</strong> with secondary data (59% of UK adults use reusables – more than the 48% in the survey), which suggests the sample may under-represent users or the figures differ because of method.</p><p><strong>Judgement:</strong> useful for price and feature preferences; should be supported by wider research before major spending.</p>')}
${warn('Examiners report that most learners evaluate reliability/validity of the <em>primary</em> data only. Include a sentence on each secondary source (date, publisher’s interest, forecast vs fact).')}
`;
  }

  function b3() {
    return `
<h4>From data to decisions</h4>
${fig(S.flow([['Select', 'the relevant fact'], ['Interpret', 'what does it mean?'], ['Link', 'to the business and aim'], ['Decide', 'what the campaign will do']], { w: 700, h: 76, label: 'Analysis chain' }), 'Every statistic you quote should travel along this chain.')}
${table(['Weak (description)', 'Strong (analysis)'], [['“372 respondents chose £10–£15.”', '“Nearly half (49.6%) would pay £10–£15 but only 11% would pay £20+, so Funky Flasks should price standard bottles near £13 and reserve premium prices for personalised or limited-edition products.”'], ['“Reusables are growing.”', '“Use rose from 20% (2015) to 59% (2023) with 80% forecast by 2028, so the market is in growth – but HuffPost warns repeat purchase is low, so the campaign should encourage collections and gifts.”']])}
${H.formula('Analysis sentence', 'Fact + so what? + therefore (action)', 'Use “this means… therefore… this supports objective 1…”')}
<h4>Product life cycle</h4>
${fig(S.plc(null, { label: 'Product life cycle' }), 'Where is the market – and Funky Flasks’ main bottle range – on the curve? Reusable drinkware is in growth/early maturity; the main range is flat (maturity), personalised items are in growth.')}
${table(['Stage', 'Typical marketing priorities'], [['Introduction', 'Build awareness; high promotion; penetration or skimming pricing'], ['Growth', 'Build share; widen distribution; differentiate from new competitors'], ['Maturity', 'Defend share; promotions and loyalty; extension strategies'], ['Decline', 'Reduce spend, refresh with new designs or exit']])}
${tip('Examiners say learners identify the PLC stage well but stop there. Add the action: “because the main range is in maturity, launch limited editions (extension strategy) to renew interest.”')}
<h4>Further information needed</h4>
${ul(['Social-media analytics and website data', 'Customer reviews/returns', 'Competitor campaign results', 'Forecasts from independent bodies'])}
`;
  }

  /* ───────────── AIM C ───────────── */
  function c1() {
    const swot = S.matrix([{ h: 'Strengths', tag: 'internal', items: ['UK-made, plastic-free steel', '10% to charities (values)', '5,000 TikTok followers; 1,200 emails', 'Personalisation range growing'] }, { h: 'Weaknesses', tag: 'internal', items: ['Main range sales falling', 'Medium-sized vs big brands', 'Small following', 'One bottle size (500 ml)'] }, { h: 'Opportunities', tag: 'external', items: ['Plastics ban and refill culture', 'Festival/brand collaborations', '93% want personalisation', 'Retail listings'] }, { h: 'Threats', tag: 'external', items: ['Big brands’ cheaper bespoke offers', 'Low repeat purchases', 'Trend may fade by 2026', 'Glass alternatives'] }], { h: 330, label: 'SWOT for Funky Flasks' });
    return `
${fig(swot, 'A SWOT is only worth marks if each point is evaluated and linked to an action.')}
${table(['SWOT point', 'Action in the campaign (the marks!)'], [['Strength: 5,000 TikTok followers', 'Run TikTok content/competitions to grow the 16–25 audience'], ['Weakness: sales of main range falling', 'Refresh with limited editions; bundle with personalisation'], ['Opportunity: 93% would pay for personalisation', 'Make “design your own” the campaign message'], ['Threat: big brands undercut on bespoke', 'Emphasise UK-made, plastic-free and charity donation – values, not price']])}
<h4>PESTLE – turn each factor into a response</h4>
${table(['Factor', 'Evidence', 'Campaign response'], [['Political', 'Single-use plastics ban Oct 2023', 'Plastic-free message and timing'], ['Economic', 'Cost of living, bulk bespoke from larger brands', 'Value bundles; corporate offers'], ['Social', 'Bottles as fashion accessories', 'Colour/design launches with influencers'], ['Technological', 'Social ads, hydration tracking', 'TikTok/Instagram ads; consider smart features later'], ['Legal/ethical', 'Eco claims must be honest', 'Verified claims, ASA-compliant ads'], ['Environmental', 'Blue Planet II effect', 'Sustainability storytelling']])}
<h4>Target market and competitors from data</h4>
${check(['Which segment is biggest and most willing to pay? (16–35 – 45%)', 'What do they value? (design 96%, size 92%, temperature 80%, customisation 67%)', 'Where do they buy? (supermarkets 94%, online 92%, festivals 49%)', 'How do rivals promote? (Instagram, influencers, immersive pop-ups)'])}
`;
  }

  function c2() {
    const mix = S.tiles([['Product', 'range, personalisation, packaging, branding'], ['Price', 'penetration, skimming, competitor, cost-plus'], ['Promotion', 'ads, PR, sponsorship, social, guerrilla…'], ['Place', 'online, retailers, wholesalers, events'], ['People', 'staff and service quality'], ['Physical environment', 'website, packaging, stand/store'], ['Process', 'ordering, delivery, returns']], { cols: 4, th: 88, w: 700, label: 'The 7Ps' });
    const price = S.lines([{ name: 'Skimming', col: P.red, pts: [[0, 90], [1, 80], [2, 62], [3, 48], [4, 40]] }, { name: 'Penetration', col: P.green, pts: [[0, 30], [1, 32], [2, 40], [3, 46], [4, 50]] }], { h: 230, ymax: 100, xlabels: [[0, 'Launch'], [1, 'Early'], [2, 'Growth'], [3, 'Maturity'], [4, 'Later']], fmt: v => '£' + Math.round(v), xtitle: 'Time since launch', label: 'Skimming vs penetration price paths' });
    const place = S.flow([['Funky Flasks', 'manufacturer'], ['Direct (website)', 'end users'], ['Retailers', 'supermarkets/shops'], ['Wholesalers', 'bulk sales']], { w: 700, h: 76, label: 'Distribution channels' });
    return `
${fig(mix, 'Cover ALL seven Ps – learners who discuss only promotion are capped.')}
<h4>Product</h4>
${ul(['<strong>Form and function</strong> – look/feel (colours, personalisation) and performance (leak-proof, keeps drinks cold/hot)', '<strong>Packaging</strong> – protects, promotes, sustainable', '<strong>Branding</strong> – name, logo, charity donation; accessories, lids, straws, bundles'])}
<h4>Price</h4>
${table(['Strategy', 'How it works', 'Best when'], [['Penetration', 'Low entry price to win share quickly', 'Price-sensitive customers, crowded market'], ['Skimming', 'High initial price, then lowered', 'Unique/new product, early adopters'], ['Competitor-based', 'Priced with reference to rivals', 'Similar products, strong competition'], ['Cost-plus', 'Cost + mark-up %', 'Simple, guarantees margin']])}
${fig(price, 'Skimming starts high and falls; penetration starts low and may rise.')}
${formula('Cost-plus price', 'cost × (1 + mark-up %)', '£11.50 × 1.6 = £18.40')}
<h4>Promotion</h4>
${table(['Method', 'Strength', 'Limitation'], [['Social media / digital ads', 'Targeted, measurable, cheap per click', 'Algorithm and competition; needs content skills'], ['Influencers', 'Credible, follow niche interests (£50–£500 per post)', 'Fees or free products; reputational risk'], ['Sponsorship', 'Large targeted audiences; brand image', 'Cost; results hard to measure'], ['Festivals / trade shows', 'Face-to-face sales, samples, bulk orders', 'Stall costs and staffing'], ['Leaflets / posters / vouchers', 'Local targeting', 'Printing and distribution; low response'], ['TV / billboards', 'Mass reach', 'Expensive (£10,000+ evening slots)'], ['PR', 'Builds reputation and trust', 'Not controlled'], ['Guerrilla / experiential', 'Buzz, shareable', 'Planning and permission']])}
<h4>Place</h4>
${fig(place, 'Direct to end users, through retailers or through wholesalers.')}
${table(['Channel', 'Advantage', 'Disadvantage'], [['Direct (online/mail/auction)', 'Full margin, control of brand, personalisation', 'Must drive all traffic yourself'], ['Retailers', 'Reach, credibility, shelf visibility', 'Retailer margin, stock commitments'], ['Wholesalers', 'Bulk orders, less admin', 'Lower price per unit; less control']])}
<h4>Extended marketing mix</h4>
${key('People, physical environment, process', '<strong>People</strong> = employees and service (not the target market!). <strong>Physical environment</strong> = website, packaging, stand layout. <strong>Process</strong> = ordering, payment, delivery, returns. Examiners say learners often skip or misunderstand these – they are easy marks in AF5.')}
${tip('Make each P specific: <strong>Place:</strong> “direct via the website with free delivery over £25, plus 100 pop-up days at festivals.” Not: “online and in shops.”')}
`;
  }

  function c3() {
    const gantt = S.gantt([['Prepare content & stock', 0, 4], ['TikTok ads', 4, 24], ['Influencer posts', 6, 22], ['Festival stands', 8, 20], ['Sponsorship (events)', 4, 24], ['Email offers', 8, 24], ['Monitor & adjust', 8, 24]], 24, { step: 4, label: '24-week Gantt chart' });
    const bud = S.bars([['Sponsorship', 18000, P.violet], ['Influencers', 9500, P.pink], ['Stands', 7200, P.amber], ['Production', 6800, P.teal], ['TikTok', 6000, P.blue], ['Leaflets', 2900, P.sky], ['Contingency', 9600, P.slate]], { w: 700, h: 260, fmt: v => '£' + Math.round(v).toLocaleString('en-GB'), unit: '£60,000 budget – illustrative allocation', label: 'Illustrative budget allocation' });
    return `
<h4>Marketing message</h4>
${ul(['The <strong>one idea</strong> your campaign communicates (e.g. “Make it yours. Keep it plastic-free.”)', 'Linked to research (93% want personalisation; sustainability matters), the aims and the brand values', 'Flows through the mix: product design, price offers, promotion content, place displays'])}
<h4>Selecting media</h4>
${table(['Medium', 'Cost in the pack', 'Fit for 16–35 / budget'], [['TikTok ads', '≈ £10 per 1,000 views', 'High – 26% of UK users are 15–25; measurable'], ['Instagram ads', '£0.35–£0.75 per click', 'High – 30m UK users'], ['Influencers', '£50–£500 per post', 'High – targeted; free-product deals cost stock'], ['Festivals/events', '£10–£2,000 per stand', 'Good – face-to-face + samples'], ['Sponsorship', '£200–£2,500', 'Good – shared-interest audiences'], ['Leaflets/posters', '£30.51 per 1,000 + distribution', 'Local, low-tech'], ['TV / billboard', '£500–£20,000', 'Poor fit for a £60,000 budget']])}
<h4>Budget</h4>
${fig(bud, 'Illustrative allocation – your own budget should itemise each activity with £ figures and show the total.')}
${H.table(['Activity', 'Detail', 'Cost'], [['TikTok ads', '400,000 views × £10 per 1,000', '£4,000'], ['Influencers', '12 posts × avg £300 + product samples', '£3,600 + £900'], ['Festival stands', '3 × £1,250 (medium events) + staff 4 × 6 h × 5 days × £10', '£3,750 + £1,200'], ['Filming and production', 'Video £2,000 + voice-over £500 + motion graphics £3,000 + stock £500', '£6,000'], ['Leaflets', '5,000 × £65.62 + inserts £150', '£215.62'], ['Contingency', 'Unforeseen costs', '£…']])}
${key('Budget marks', 'Total only = <strong>1 mark</strong> · percentage split = <strong>2</strong> · breakdown per activity = <strong>3–4</strong> · most costs including wider costs = <strong>5–6</strong> · ALL costs in realistic detail = <strong>7–8</strong>. Add staffing, travel, insurance, props, editing, postage.')}
<h4>Timescale</h4>
${fig(gantt, 'A dated Gantt chart with preparation. Add start/end months (e.g. April–September) and reasons: summer sales, festival season, New Year health resolutions.')}
${ul(['Give <strong>start and end dates</strong> for every activity', 'Include <strong>preparation</strong> (designing content, booking stands)', 'Explain <strong>why</strong>: seasons, events, product launches', 'Include <strong>monitoring</strong> points (weeks 8, 16, 24) and an evaluation date'])}
<h4>Evaluating the campaign</h4>
${check(['Sales before/after vs the objective (e.g. +10% online)', 'Website visitors and conversion rate', 'Followers, engagement, hashtag use', 'Voucher/discount-code redemptions', 'Customer survey of awareness'])}
${tip('AF8: present Activity 2 as a professional <strong>plan for the owners</strong> – use headings from the brief (marketing mix, message, media, budget, timescale), tables for the budget and Gantt chart, and marketing terms. Notes or bullets without explanations lose marks.')}
`;
  }

  function c4() {
    return `
${fig(S.tiles([['Reinforces brand value', 'Does the campaign match the brand’s values and image?'], ['Sustainability', 'Environmental impact of materials, waste, travel'], ['Flexibility', 'Can it respond to internal/external changes?'], ['Relevance to goals', 'Do activities support the aims and objectives?'], ['Appropriate to target market', 'Right channels, tone and message for the segment'], ['Legal and ethical', 'Honest, legal, fair, inclusive']], { cols: 3, th: 88, w: 700, label: 'Appropriateness checklist' }), 'Use this to justify the option you choose and say why you rejected the other.')}
${table(['Legal/ethical issue', 'Example', 'What to do'], [['Misleading claims', '“100% eco-friendly” without evidence', 'Substantiate claims; follow ASA/CAP'], ['Data protection', 'Emailing customers without consent', 'Opt-in; UK GDPR/PECR'], ['Influencer disclosure', 'Posts must be marked as ads (#ad)', 'Brief influencers properly'], ['Sustainability', 'Single-use freebies for an eco brand', 'Plastic-free, recyclable materials'], ['Fairness', 'Offers excluding some customers', 'Clear terms and conditions']])}
${example('Justifying the choice (EITHER sponsorship OR retailers)', '<p>“I recommend <strong>sponsoring events and festivals</strong>. 49% of respondents would buy at events and 25% are 16–25, an audience that values experiences; sponsorship packages (£200–£2,500) fit the £60,000 budget and let the brand showcase personalisation face-to-face, which retailers cannot offer. Retailers would give wider reach (94% would buy from supermarkets) but supermarkets take a margin, remove the personalisation USP and are dominated by Chilly’s and S’well. Risk: sponsorship reach is temporary, so I will capture emails and TikTok followers at every event.”</p>')}
${tip('Always weigh BOTH options against the aims, budget, timescale and research, then pick one and explain how you will manage its risk.')}
`;
  }

  window.BIZ_GUIDE_DATA = {
    storeKey: 'ra10-guide-revised-BUS-u2', unitLabel: 'Unit 2 Guide', aimWord: 'Content area', aims: ['A', 'B', 'C'], setTaskTitle: 'The assessment',
    titles: { A: 'Principles and purposes of marketing', B: 'Using information to develop the rationale', C: 'Planning and developing a marketing campaign' },
    subtitles: { A: 'The role of marketing, aims and objectives, markets and segmentation, branding and the influences on marketing activity', B: 'Why research, primary and secondary methods, validity and reliability, analysis and the product life cycle', C: 'SWOT/PESTLE, the 7Ps marketing mix, message, media, budget, timescale, evaluation and appropriateness' },
    setTask: setTask,
    topics: {
      A: [{ code: 'A1', name: 'The role of marketing', html: a1 }, { code: 'A2', name: 'Influences on marketing activity', html: a2 }],
      B: [{ code: 'B1', name: 'Purpose of researching information', html: b1 }, { code: 'B2', name: 'Market research methods and use', html: b2 }, { code: 'B3', name: 'Developing the rationale', html: b3 }],
      C: [{ code: 'C1', name: 'Marketing campaign activity', html: c1 }, { code: 'C2', name: 'Marketing mix', html: c2 }, { code: 'C3', name: 'The marketing campaign', html: c3 }, { code: 'C4', name: 'Appropriateness of the campaign', html: c4 }]
    },
    gallery: [
      { aim: '★', kicker: 'The task', title: '70 marks, two activities', copy: 'Rationale (34) and campaign plan (36).', image: unsplash('photo-1533750349088-cd871a92f312') },
      { aim: 'B', kicker: 'Research', title: 'Data into decisions', copy: 'Analyse the pack and judge reliability.', image: unsplash('photo-1560472354-b33ff0c44a43') },
      { aim: 'C', kicker: 'The plan', title: 'Mix, media, budget, time', copy: 'All 7Ps, costed and scheduled.', image: unsplash('photo-1552664730-d307ca884978') }
    ]
  };
})();
