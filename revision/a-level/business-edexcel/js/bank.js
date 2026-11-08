/* bank — hand-written RA10 content. Generated from training-data/a-level/alevel-build/content/business-edexcel/bank/ (edit the parts there, then run build_alevel.py). */

/* ---- 00_head.js ---- */
/* Pearson Edexcel A-level Business (9BS0) — knowledge bank, quiz and flashcards. One part per theme.
   K  = points-marked question (Edexcel 4-mark style: Knowledge 1, Application 2, Analysis 1 — or calculation marks)
   KL = levels-marked question (Edexcel levels for 8 / 10 / 12 / 20 marks; indicative content with a counterbalance and judgement)
   M / TF = quiz, F = flashcard. Topic labels start with the specification code (eg '1.3.3 Pricing strategies'). */
(function () {
  'use strict';
  const B = BizBank('EDX', '9BS0');
  window.__BIZ_B = B;
  const { K, M, TF, F } = B;
  const AO = {
    8: 'Knowledge 2, Application 2, Analysis 2, Evaluation 2',
    10: 'Knowledge 2, Application 2, Analysis 3, Evaluation 3',
    12: 'Knowledge 2, Application 2, Analysis 4, Evaluation 4',
    20: 'Knowledge 4, Application 4, Analysis 6, Evaluation 6'
  };
  const KL = (aim, topic, verb, marks, question, indicative, ao) => B.KL(aim, topic, verb, marks, question, indicative, {
    ao: ao || AO[marks] || '',
    mark_scheme: {
      instruction: 'Pearson Edexcel levels-based mark scheme (' + (ao || AO[marks] || '') + '). Best fit: knowledge, application to the business, chains of reasoning (analysis) and a balanced assessment leading to a supported judgement (evaluation). Credit other valid responses.',
      indicative_content: indicative,
      level_descriptors: window.BIZ_LEVELS[marks] || window.BIZ_LEVELS[String(marks)] || window.BIZ_LEVELS[12]
    }
  });

/* ---- 01_theme1.js ---- */
  /* ===== Theme 1: Marketing and people (A–E) — Papers 1 and 3 ===== */
  // A · 1.1 Meeting customer needs
  K('A', '1.1.1 The market', 'Explain', 4, 'Explain one difference between a mass market and a niche market. Use an example.', [
    'Knowledge (1): a mass market is a large market where products are aimed at most customers / a niche market is a small, specialised segment of a larger market',
    'Application (2): eg Coca-Cola sells standardised drinks to the mass market; Fentimans sells premium botanical drinks to a niche',
    'Analysis (1): so a niche business can charge higher prices and face less competition, but has lower sales volumes and is more vulnerable to changes in tastes.'
  ]);
  K('A', '1.1.1 The market', 'Calculate', 4, 'A market is worth £40m. Business X has sales of £6m and Business Y has sales of £4.4m. Calculate the difference between their market shares. Show your working.', [
    'Knowledge (1): market share = business sales ÷ total market sales × 100',
    'Application (1): X = 6 ÷ 40 × 100 = 15%',
    'Application (1): Y = 4.4 ÷ 40 × 100 = 11%',
    'Answer (1): difference = 4 percentage points'
  ]);
  K('A', '1.1.1 The market', 'Explain', 4, 'Explain the difference between risk and uncertainty for a business entering a dynamic market.', [
    'Knowledge (1): risk can be measured/estimated (eg probability of a product failing based on past data); uncertainty cannot be measured because the future is unknown',
    'Application (2): eg an online retailer can estimate the risk of returns from previous sales, but cannot predict a new competitor or a change in regulation',
    'Analysis (1): so a business can plan for risks (insurance, contingency budgets) but must stay flexible to cope with uncertainty.'
  ]);
  K('A', '1.1.2 Market research', 'Explain', 4, 'Explain one limitation of secondary market research for a small business launching a new product.', [
    'Knowledge (1): secondary research uses data that already exists, collected for another purpose',
    'Application (2): eg a new café using national coffee consumption statistics that do not reflect its local town',
    'Analysis (1): so the data may be out of date, irrelevant or not specific to its target market, leading to poor decisions such as over-estimating demand.'
  ]);
  K('A', '1.1.2 Market research', 'Explain', 4, 'Explain why sample size affects the reliability of market research.', [
    'Knowledge (1): a sample is a group selected to represent the target population',
    'Application/Analysis (3): a small sample is less likely to be representative, so random variation or bias has a bigger effect; results may not reflect the views of all customers, so decisions based on them (eg launching a product) carry more risk; a larger sample increases confidence but costs more.'
  ]);
  K('A', '1.1.3 Market positioning', 'Explain', 4, 'Explain how a business could use product differentiation to gain a competitive advantage.', [
    'Knowledge (1): product differentiation is making a product distinct from competitors’ in the eyes of customers',
    'Application (2): eg through unique design, features, branding or customer service',
    'Analysis (1): customers see fewer close substitutes, so demand becomes more price inelastic and the business can charge a premium price, increasing profit margins.'
  ]);
  KL('A', '1.1.2 Market research', 'Assess', 10, 'Assess the importance of market research for a business launching a new product in a dynamic market.', [
    'Knowledge: primary/secondary, quantitative/qualitative research; dynamic markets change quickly (online retailing, innovation).',
    'Analysis: research reduces risk – identifies needs and wants, quantifies demand, informs the marketing mix, supports a business plan for investors.',
    'Analysis: social media/databases give fast, cheap insight in a dynamic market.',
    'Counterbalance: research takes time and money; in a fast-moving market it may be out of date before launch; small samples and bias; customers may not know what they want (disruptive innovation).',
    'Judgement: importance depends on the size of the investment and the speed of change – for high-cost launches it is vital, but it must be ongoing and combined with entrepreneurial judgement.'
  ]);
  M('A', '1.1.1 The market', 'A market where customer tastes and technology are changing rapidly is described as…', 'Dynamic', ['Static', 'Saturated', 'Niche'], 'Dynamic markets change quickly – eg online retailing.');
  M('A', '1.1.2 Market research', 'Which of the following is an example of primary research?', 'A focus group run by the business', ['Government population statistics', 'A Mintel market report', 'Competitors’ annual reports'], 'Primary research is collected first-hand for a specific purpose.');
  M('A', '1.1.2 Market research', 'Dividing a market into groups of customers with similar characteristics is…', 'Market segmentation', ['Market mapping', 'Market orientation', 'Product differentiation'], 'Segments can be demographic, geographic, psychographic, behavioural.');
  M('A', '1.1.3 Market positioning', 'A market map typically plots products on…', 'Two variables, eg price and quality', ['Sales against time', 'Market growth against market share', 'Costs against revenue'], 'It shows gaps and competitors’ positions.');
  M('A', '1.1.2 Market research', 'A business that develops products based on what customers want is…', 'Market orientated', ['Product orientated', 'Asset-led', 'Production orientated'], 'Product orientation starts from the product.');
  TF('A', '1.1.3 Market positioning', 'Adding value means increasing the difference between the price customers pay and the cost of inputs.', true, 'eg through branding, design, convenience, quality.');
  F('A', 'Market share', 'Business sales ÷ total market sales × 100.', '1.1.1 The market');
  F('A', 'Niche market', 'A small, specialised segment of a larger market; less competition, higher prices, but vulnerable.', '1.1.1 The market');
  F('A', 'Risk vs uncertainty', 'Risk can be measured/estimated; uncertainty cannot be predicted or measured.', '1.1.1 The market');
  F('A', 'Qualitative vs quantitative research', 'Qualitative: opinions, reasons (focus groups). Quantitative: numerical data (surveys, sales figures).', '1.1.2 Market research');
  F('A', 'Market mapping', 'Positioning products on two variables (eg price/quality) to see competitors and gaps.', '1.1.3 Market positioning');
  F('A', 'Competitive advantage', 'An advantage over rivals that allows greater sales or margins, eg lower costs or differentiation.', '1.1.3 Market positioning');

  // B · 1.2 Market
  K('B', '1.2.1 Demand', 'Explain', 4, 'Explain how a rise in consumer incomes might affect demand for a luxury holiday company.', [
    'Knowledge (1): demand is the quantity customers are willing and able to buy at each price',
    'Application (2): luxury holidays are a normal (luxury) good with high positive income elasticity',
    'Analysis (1): higher incomes shift the demand curve to the right, so the company sells more holidays at each price / can raise prices.'
  ]);
  K('B', '1.2.2 Supply', 'Explain', 4, 'Explain how a government subsidy affects the supply of electric cars.', [
    'Knowledge (1): a subsidy is a payment from the government to producers that reduces their costs',
    'Application (2): eg a grant per electric car produced',
    'Analysis (1): costs fall so producers are willing to supply more at every price – supply shifts right, lowering equilibrium price and raising quantity.'
  ]);
  K('B', '1.2.4 Price elasticity of demand', 'Calculate', 4, 'A café raises the price of coffee from £2.50 to £3.00. Sales fall from 1 000 to 900 cups a week. Calculate the price elasticity of demand. Show your working.', [
    'Knowledge (1): PED = % change in quantity demanded ÷ % change in price',
    'Application (1): % change in quantity = (900 − 1 000) ÷ 1 000 × 100 = −10%',
    'Application (1): % change in price = (3.00 − 2.50) ÷ 2.50 × 100 = +20%',
    'Answer (1): PED = −10 ÷ 20 = −0.5 (price inelastic)'
  ]);
  K('B', '1.2.5 Income elasticity of demand', 'Calculate', 4, 'Incomes rise by 5% and demand for a supermarket’s own-brand value range falls by 2%. Calculate the income elasticity of demand and state what type of good this is.', [
    'Knowledge (1): YED = % change in quantity demanded ÷ % change in income',
    'Application (1): −2 ÷ 5',
    'Answer (1): YED = −0.4',
    'Analysis (1): negative YED, so it is an inferior good.'
  ]);
  K('B', '1.2.3 Markets', 'Explain', 4, 'Explain, using a supply and demand diagram, the effect of a fall in the cost of raw materials on the price of a product.', [
    'Knowledge (1): supply curve shifts to the right (S1 to S2)',
    'Application (1): correctly labelled diagram – axes (price, quantity), original equilibrium P1/Q1',
    'Analysis (2): at the original price there is excess supply, so price falls to a new equilibrium P2 with higher quantity Q2.'
  ]);
  KL('B', '1.2.4 Price elasticity of demand', 'Assess', 10, 'Assess the significance of price elasticity of demand for a premium smartphone brand’s pricing decisions.', [
    'Knowledge: PED formula; elastic (> 1) vs inelastic (< 1); factors – substitutes, brand loyalty, necessity, proportion of income.',
    'Analysis: strong brand and few close substitutes make demand inelastic, so a price rise increases total revenue; supports premium pricing/skimming.',
    'Analysis: knowing PED helps forecast revenue and plan production.',
    'Counterbalance: PED estimates are based on past data and change over time (new competitors, recessions); other factors such as quality, promotion and product features may matter more.',
    'Judgement: PED is significant when the brand is strong, but must be combined with competitor analysis because elasticity changes as rivals launch similar phones.'
  ]);
  M('B', '1.2.1 Demand', 'Which of these would shift the demand curve for tennis rackets to the left?', 'A rise in the price of tennis balls', ['A fall in the price of tennis rackets', 'A successful advertising campaign', 'Wimbledon being on TV'], 'Tennis balls are complements.');
  M('B', '1.2.4 Price elasticity of demand', 'If PED is −2.5, a 10% price cut will lead to…', 'A 25% rise in quantity demanded', ['A 2.5% rise in quantity demanded', 'A 25% fall in quantity demanded', 'No change in revenue'], '−2.5 × −10% = +25%.');
  M('B', '1.2.4 Price elasticity of demand', 'For a product with price inelastic demand, a price rise will…', 'Increase total revenue', ['Decrease total revenue', 'Leave revenue unchanged', 'Shift the demand curve right'], 'Quantity falls proportionately less than the price rises.');
  M('B', '1.2.5 Income elasticity of demand', 'A good with YED of +2.1 is a…', 'Luxury (income elastic) normal good', ['Inferior good', 'Necessity with inelastic YED', 'Giffen good'], 'YED > 1.');
  M('B', '1.2.2 Supply', 'An indirect tax on cigarettes will…', 'Shift the supply curve to the left', ['Shift the demand curve to the right', 'Shift the supply curve to the right', 'Have no effect on price'], 'Costs of supplying rise.');
  TF('B', '1.2.3 Markets', 'A rise in demand with supply unchanged leads to a higher equilibrium price and quantity.', true, 'Demand shifts right along the supply curve.');
  F('B', 'Price elasticity of demand', '% change in quantity demanded ÷ % change in price. >1 elastic, <1 inelastic (ignore sign).', '1.2.4 Price elasticity of demand');
  F('B', 'Income elasticity of demand', '% change in quantity demanded ÷ % change in income. Negative = inferior; 0–1 necessity; >1 luxury.', '1.2.5 Income elasticity of demand');
  F('B', 'Factors shifting demand', 'Price of substitutes/complements, incomes, tastes, advertising, demographics, external shocks, seasonality.', '1.2.1 Demand');
  F('B', 'Factors shifting supply', 'Costs of production, new technology, indirect taxes, subsidies, external shocks.', '1.2.2 Supply');
  F('B', 'Equilibrium', 'The price where quantity demanded equals quantity supplied.', '1.2.3 Markets');

  // C · 1.3 Marketing mix and strategy
  K('C', '1.3.1 Product/service design', 'Explain', 4, 'Explain why a business might focus on economic manufacture in its design mix.', [
    'Knowledge (1): the design mix balances function, aesthetics and economic manufacture (cost)',
    'Application (2): eg a budget furniture retailer designing flat-pack products with few parts',
    'Analysis (1): lower unit costs allow low prices for price-sensitive customers while protecting profit margins.'
  ]);
  K('C', '1.3.2 Branding and promotion', 'Explain', 4, 'Explain one benefit to a business of having a strong brand.', [
    'Knowledge (1): a brand is a name, symbol or design that identifies a product and differentiates it',
    'Application (2): eg Apple’s brand creates customer loyalty',
    'Analysis (1): demand becomes less price elastic, so the business can charge premium prices and launch new products more easily.'
  ]);
  K('C', '1.3.3 Pricing strategies', 'Explain', 4, 'Explain one reason why a business might use penetration pricing.', [
    'Knowledge (1): penetration pricing is setting a low initial price to gain market share quickly',
    'Application (2): eg a new streaming service entering a market dominated by established rivals',
    'Analysis (1): customers are encouraged to switch, building a customer base and economies of scale, after which prices can be raised.'
  ]);
  K('C', '1.3.4 Distribution', 'Explain', 4, 'Explain one advantage of selling directly to customers online rather than through retailers.', [
    'Knowledge (1): direct distribution removes intermediaries from the channel',
    'Application (2): eg a clothing brand selling through its own website',
    'Analysis (1): it keeps the retailer’s margin and gains customer data, increasing profit per unit and allowing targeted marketing.'
  ]);
  K('C', '1.3.5 Marketing strategy', 'Explain', 4, 'Explain one extension strategy a business could use when a product reaches the decline stage of the product life cycle.', [
    'Knowledge (1): an extension strategy is an action to lengthen the life of a product',
    'Application (2): eg relaunching with new packaging, new flavours, new markets/segments, price cuts or promotions',
    'Analysis (1): this renews interest, increasing sales and delaying the need to invest in replacing the product.'
  ]);
  KL('C', '1.3.3 Pricing strategies', 'Assess', 12, 'Assess the likely usefulness of price skimming for a business launching an innovative product.', [
    'Knowledge: price skimming – high initial price targeting early adopters, lowered over time; alternatives (penetration, competitive, cost-plus, psychological).',
    'Analysis: recovers R&D costs quickly; early adopters are price insensitive; creates a premium image; high profit margins.',
    'Counterbalance: high prices attract competitors; only works if the product is genuinely new/different and protected (patents); may limit sales volume and economies of scale; consumer backlash when prices fall.',
    'Judgement: most useful where the product is unique, the brand is strong and demand is price inelastic; less useful in dynamic markets where rivals copy quickly.'
  ]);
  M('C', '1.3.5 Marketing strategy', 'In the Boston matrix, a product with high market share in a low-growth market is a…', 'Cash cow', ['Star', 'Question mark', 'Dog'], 'It generates cash for other products.');
  M('C', '1.3.3 Pricing strategies', 'Pricing a product at £9.99 rather than £10 is…', 'Psychological pricing', ['Price skimming', 'Cost-plus pricing', 'Penetration pricing'], 'It appears cheaper.');
  M('C', '1.3.2 Branding and promotion', 'Which is an example of above-the-line promotion?', 'A national TV advertising campaign', ['A buy-one-get-one-free offer', 'Sponsorship of a local event', 'Point-of-sale displays'], 'Above-the-line uses mass media.');
  M('C', '1.3.4 Distribution', 'A multi-channel distribution strategy means…', 'Selling through several channels, eg stores, website and app', ['Using only intermediaries', 'Selling in many countries', 'Selling to many segments'], 'Increases reach and convenience.');
  M('C', '1.3.1 Product/service design', 'The three elements of the design mix are…', 'Function, aesthetics and economic manufacture', ['Product, price and place', 'Cost, quality and speed', 'Brand, packaging and promotion'], 'Balance depends on the target market.');
  TF('C', '1.3.5 Marketing strategy', 'Customer loyalty is more valuable in mass markets than niche markets.', false, 'Both value loyalty; niche markets often depend on it heavily.');
  F('C', 'Design mix', 'Function, aesthetics and economic manufacture – balanced for the target market; can reflect social trends (sustainability).', '1.3.1 Product/service design');
  F('C', 'Price skimming / penetration', 'Skimming: high launch price, lowered later. Penetration: low launch price to gain share, raised later.', '1.3.3 Pricing strategies');
  F('C', 'Product life cycle', 'Development, introduction, growth, maturity, decline. Extension strategies lengthen maturity.', '1.3.5 Marketing strategy');
  F('C', 'Boston matrix', 'Market share vs market growth: stars, cash cows, question marks, dogs.', '1.3.5 Marketing strategy');
  F('C', 'Distribution channels', 'Producer → customer (direct); via retailer or wholesaler; multi-channel; online.', '1.3.4 Distribution');

  // D · 1.4 Managing people
  K('D', '1.4.1 Approaches to staffing', 'Explain', 4, 'Explain one benefit to a business of using a flexible workforce.', [
    'Knowledge (1): a flexible workforce includes part-time, temporary, zero-hours or multi-skilled staff, or outsourcing',
    'Application (2): eg a hotel employing extra staff on zero-hours contracts in summer',
    'Analysis (1): staffing can match demand, so labour costs fall in quiet periods, improving efficiency and profit.'
  ]);
  K('D', '1.4.2 Recruitment, selection and training', 'Explain', 4, 'Explain one advantage of internal recruitment.', [
    'Knowledge (1): internal recruitment fills a vacancy with an existing employee',
    'Application (2): eg promoting a store supervisor to store manager',
    'Analysis (1): the business already knows their ability and they know the culture, so recruitment is cheaper/quicker and less risky, and it motivates staff.'
  ]);
  K('D', '1.4.3 Organisational design', 'Explain', 4, 'Explain how a wide span of control could affect a business.', [
    'Knowledge (1): span of control is the number of subordinates directly supervised by a manager',
    'Application (2): eg a retail manager responsible for 15 sales assistants',
    'Analysis (1): fewer managers reduces costs and empowers staff, but each worker receives less supervision, which may reduce quality or communication.'
  ]);
  K('D', '1.4.4 Motivation in theory and practice', 'Explain', 4, 'Explain how Herzberg’s two-factor theory could be used to improve motivation in a call centre.', [
    'Knowledge (1): hygiene factors (pay, conditions) prevent dissatisfaction; motivators (recognition, responsibility, achievement) motivate',
    'Application (2): eg the call centre ensures fair pay and comfortable conditions, then introduces job enrichment such as handling complex queries',
    'Analysis (1): staff become more engaged and productive, reducing labour turnover and recruitment costs.'
  ]);
  K('D', '1.4.5 Leadership', 'Explain', 4, 'Explain one disadvantage of an autocratic leadership style.', [
    'Knowledge (1): an autocratic leader makes decisions without consulting staff',
    'Application (2): eg a factory manager setting all targets and methods',
    'Analysis (1): staff feel undervalued, so motivation and creativity fall and labour turnover may rise.'
  ]);
  KL('D', '1.4.4 Motivation in theory and practice', 'Assess', 12, 'Assess whether financial incentives are the most effective way for a retailer to motivate its staff.', [
    'Knowledge: financial incentives – piece rate, commission, bonus, profit share, performance-related pay; non-financial – delegation, consultation, empowerment, team working, flexible working, job enrichment, job rotation, job enlargement; Taylor, Mayo, Maslow, Herzberg.',
    'Analysis: Taylor – money motivates; commission links pay to sales so productivity rises.',
    'Counterbalance: Herzberg – pay is a hygiene factor; Mayo – social needs; non-financial methods may be cheaper and longer lasting; commission can harm teamwork and customer service.',
    'Judgement: depends on the nature of the job, staff needs and the business’s finances – a combination is usually most effective.'
  ]);
  M('D', '1.4.4 Motivation in theory and practice', 'Which theorist is associated with scientific management?', 'Taylor', ['Mayo', 'Maslow', 'Herzberg'], 'Taylor: money motivates; work broken into tasks.');
  M('D', '1.4.4 Motivation in theory and practice', 'Mayo’s Hawthorne studies suggested workers are motivated by…', 'Social needs and attention from management', ['Piece-rate pay only', 'Fear of dismissal', 'Physical conditions only'], 'The human relations school.');
  M('D', '1.4.3 Organisational design', 'A tall organisational structure usually has…', 'Many levels of hierarchy and narrow spans of control', ['Few levels and wide spans', 'No managers', 'Only matrix teams'], 'Communication can be slow.');
  M('D', '1.4.5 Leadership', 'A leader who acts like a parent, making decisions in the interests of staff, is…', 'Paternalistic', ['Laissez-faire', 'Democratic', 'Autocratic'], 'Consults but decides.');
  M('D', '1.4.1 Approaches to staffing', 'Treating staff as an asset means…', 'Investing in training and development', ['Minimising wages', 'Using only temporary staff', 'Replacing staff with machines'], 'Staff seen as a source of value.');
  TF('D', '1.4.2 Recruitment, selection and training', 'Off-the-job training takes place in the workplace while the employee works.', false, 'That is on-the-job training.');
  F('D', 'Flexible workforce', 'Part-time, temporary, zero-hours, multi-skilled staff and outsourcing.', '1.4.1 Approaches to staffing');
  F('D', 'Span of control / hierarchy', 'Span: number of direct subordinates. Hierarchy: levels of management.', '1.4.3 Organisational design');
  F('D', 'Centralisation vs decentralisation', 'Decisions made at the top vs delegated to lower levels/branches.', '1.4.3 Organisational design');
  F('D', 'Herzberg', 'Hygiene factors prevent dissatisfaction; motivators (achievement, recognition, responsibility) motivate.', '1.4.4 Motivation in theory and practice');
  F('D', 'Maslow', 'Physiological, safety, social, esteem, self-actualisation.', '1.4.4 Motivation in theory and practice');
  F('D', 'Leadership styles', 'Autocratic, paternalistic, democratic, laissez-faire.', '1.4.5 Leadership');

  // E · 1.5 Entrepreneurs and leaders
  K('E', '1.5.1 Role of an entrepreneur', 'Explain', 4, 'Explain the role of an entrepreneur in creating a business.', [
    'Knowledge (1): an entrepreneur identifies an opportunity, organises resources and takes risks to create a business',
    'Application (2): eg spotting demand for vegan ready meals and setting up a kitchen and website',
    'Analysis (1): this brings innovation and jobs, and the entrepreneur gains profit if successful but bears the risk of losses.'
  ]);
  K('E', '1.5.2 Entrepreneurial motives and characteristics', 'Explain', 4, 'Explain one non-financial motive for becoming an entrepreneur.', [
    'Knowledge (1): non-financial motives include independence, flexibility, ethical stance, social entrepreneurship, home-working',
    'Application (2): eg a parent starting a business to work flexible hours around childcare',
    'Analysis (1): this means success may be measured by satisfaction rather than profit, influencing objectives such as staying small.'
  ]);
  K('E', '1.5.3 Business objectives', 'Explain', 4, 'Explain why survival might be the main objective of a new business.', [
    'Knowledge (1): survival means continuing to trade, covering costs',
    'Application (2): eg a start-up in its first year with little brand awareness and limited cash',
    'Analysis (1): it must build a customer base and manage cash flow before it can aim for profit maximisation or growth.'
  ]);
  K('E', '1.5.4 Forms of business', 'Explain', 4, 'Explain one advantage of a sole trader converting to a private limited company.', [
    'Knowledge (1): a private limited company (Ltd) has a separate legal identity and limited liability',
    'Application (2): eg a builder forming Smith Construction Ltd',
    'Analysis (1): the owner’s personal assets are protected if the business fails, and it can raise finance by selling shares to chosen investors.'
  ]);
  K('E', '1.5.5 Business choices', 'Explain', 4, 'Explain the opportunity cost to an entrepreneur of leaving a job to start a business.', [
    'Knowledge (1): opportunity cost is the next best alternative forgone',
    'Application (2): eg the £35 000 salary and pension from the job',
    'Analysis (1): the entrepreneur must expect returns that exceed this lost income, which affects the decision and the risk taken.'
  ]);
  K('E', '1.5.6 Moving from entrepreneur to leader', 'Explain', 4, 'Explain one difficulty an entrepreneur may face when the business grows and they become a leader.', [
    'Knowledge (1): growth requires delegation, structure and management skills',
    'Application (2): eg the founder who used to do everything must now manage 50 staff',
    'Analysis (1): reluctance to delegate slows decisions and demotivates managers, limiting growth.'
  ]);
  M('E', '1.5.4 Forms of business', 'Which form of business can sell shares to the general public on a stock exchange?', 'Public limited company', ['Private limited company', 'Partnership', 'Sole trader'], 'plc.');
  M('E', '1.5.2 Entrepreneurial motives and characteristics', 'A social entrepreneur mainly aims to…', 'Achieve social or environmental objectives', ['Maximise shareholder value', 'Avoid all risk', 'Stay a sole trader'], 'Profits reinvested for social goals.');
  M('E', '1.5.3 Business objectives', 'Which is a common objective for a business in its first year?', 'Survival', ['Profit maximisation', 'Diversification', 'Global expansion'], 'Covering costs and building customers.');
  M('E', '1.5.1 Role of an entrepreneur', 'An employee who acts entrepreneurially within an existing business is an…', 'Intrapreneur', ['Investor', 'Franchisee', 'Shareholder'], 'eg developing new products internally.');
  TF('E', '1.5.4 Forms of business', 'Partners in an ordinary partnership have unlimited liability.', true, 'Personal assets at risk.');
  F('E', 'Entrepreneur', 'Identifies opportunities, organises resources, takes risks; creates and runs a business.', '1.5.1 Role of an entrepreneur');
  F('E', 'Characteristics', 'Hard work, resilience, initiative, risk-taking, creativity, self-confidence.', '1.5.2 Entrepreneurial motives and characteristics');
  F('E', 'Business objectives', 'Survival, profit maximisation, sales maximisation, market share, cost efficiency, employee welfare, customer satisfaction, social objectives.', '1.5.3 Business objectives');
  F('E', 'Limited liability', 'Owners can only lose what they invested; separate legal identity (Ltd, plc).', '1.5.4 Forms of business');
  F('E', 'Opportunity cost', 'The next best alternative forgone when a choice is made.', '1.5.5 Business choices');

/* ---- 02_theme2.js ---- */
  /* ===== Theme 2: Managing business activities (F–J) — Papers 2 and 3 ===== */
  // F · 2.1 Raising finance
  K('F', '2.1.1 Internal finance', 'Explain', 4, 'Explain one advantage of using retained profit to finance an expansion.', [
    'Knowledge (1): retained profit is profit kept in the business rather than paid to owners',
    'Application (2): eg a bakery chain using last year’s £200 000 retained profit to open a new branch',
    'Analysis (1): there is no interest to pay and no loss of control, so the expansion does not increase costs or gearing.'
  ]);
  K('F', '2.1.2 External finance', 'Explain', 4, 'Explain one disadvantage of using venture capital for a fast-growing start-up.', [
    'Knowledge (1): venture capital is finance from investors in exchange for a share of ownership in a high-growth business',
    'Application (2): eg a tech start-up giving 30% of its shares to a VC firm',
    'Analysis (1): the founders lose some control and future profits, and the investor may push for a quick exit/sale.'
  ]);
  K('F', '2.1.3 Liability', 'Explain', 4, 'Explain why limited liability encourages people to invest in a business.', [
    'Knowledge (1): limited liability means owners can only lose the amount they invested',
    'Application (2): eg a shareholder who buys £5 000 of shares in a private limited company',
    'Analysis (1): their personal assets are not at risk if the business fails, so investing is less risky, making it easier for the business to raise finance.'
  ]);
  K('F', '2.1.4 Planning', 'Explain', 4, 'Explain why a business plan is important when applying for a bank loan.', [
    'Knowledge (1): a business plan sets out the objectives, market research, marketing plan and financial forecasts',
    'Application (2): eg a new gym showing a cash-flow forecast and break-even analysis to the bank',
    'Analysis (1): it shows the bank the business can repay the loan, reducing perceived risk and increasing the chance of securing finance.'
  ]);
  KL('F', '2.1.2 External finance', 'Assess', 10, 'Assess whether crowdfunding is the most suitable source of finance for a small business launching an innovative product.', [
    'Knowledge: crowdfunding (reward, equity, debt), alternatives – bank loan, overdraft, business angels, venture capital, peer-to-peer lending, owner’s capital.',
    'Analysis: no need for security; tests market demand and builds a customer base and publicity; equity crowdfunding avoids interest.',
    'Counterbalance: target may not be reached; ideas can be copied; platform fees; dilution of ownership; many small investors to manage.',
    'Judgement: suitable for consumer-facing, novel products with a story to tell; less suitable for B2B or where IP protection matters – a loan or business angel may be better.'
  ]);
  M('F', '2.1.2 External finance', 'Which source of finance is most suitable for a short-term cash-flow shortage?', 'Overdraft', ['Share capital', 'Venture capital', 'Mortgage'], 'Flexible, short-term borrowing.');
  M('F', '2.1.2 External finance', 'Lending between individuals arranged through an online platform is…', 'Peer-to-peer lending', ['Trade credit', 'Leasing', 'Crowdfunding (equity)'], 'Bypasses banks.');
  M('F', '2.1.1 Internal finance', 'Which is an internal source of finance?', 'Sale of assets', ['Bank loan', 'Business angel', 'Grant'], 'Raised from within the business.');
  TF('F', '2.1.3 Liability', 'A sole trader has limited liability.', false, 'Sole traders have unlimited liability.');
  F('F', 'Internal finance', 'Owner’s capital (personal savings), retained profit, sale of assets.', '2.1.1 Internal finance');
  F('F', 'External finance', 'Family/friends, banks, peer-to-peer, business angels, crowdfunding, other businesses; loans, share capital, venture capital, overdrafts, leasing, trade credit, grants.', '2.1.2 External finance');
  F('F', 'Business plan', 'Sets out objectives, market research, marketing, operations and financial forecasts; used to obtain finance.', '2.1.4 Planning');

  // G · 2.2 Financial planning
  K('G', '2.2.3 Break-even', 'Calculate', 4, 'A business has fixed costs of £24 000, a selling price of £20 and variable costs of £14 per unit. Calculate the break-even output.', [
    'Knowledge (1): break-even = fixed costs ÷ contribution per unit',
    'Application (1): contribution per unit = 20 − 14 = £6',
    'Application (1): 24 000 ÷ 6',
    'Answer (1): 4 000 units'
  ]);
  K('G', '2.2.3 Break-even', 'Calculate', 4, 'Using the data above, the business expects to sell 5 500 units. Calculate the margin of safety and the total contribution.', [
    'Knowledge (1): margin of safety = actual (or forecast) output − break-even output',
    'Application (1): 5 500 − 4 000 = 1 500 units',
    'Knowledge/Application (1): total contribution = contribution per unit × output = 6 × 5 500',
    'Answer (1): £33 000'
  ]);
  K('G', '2.2.1 Sales forecasting', 'Explain', 4, 'Explain one factor that could make a sales forecast inaccurate.', [
    'Knowledge (1): a sales forecast predicts future sales, often using past data',
    'Application (2): eg a sudden change in consumer tastes, an economic recession, or a new competitor',
    'Analysis (1): past trends no longer reflect the future, so budgets and production plans based on the forecast may be wrong.'
  ]);
  K('G', '2.2.4 Budgets', 'Explain', 4, 'Explain the purpose of variance analysis.', [
    'Knowledge (1): variance analysis compares actual figures with budgeted figures',
    'Application (2): eg revenue £5 000 above budget (favourable) or costs £2 000 above budget (adverse)',
    'Analysis (1): managers can identify problems early and take corrective action, improving control of costs.'
  ]);
  K('G', '2.2.2 Sales, revenue and costs', 'Calculate', 4, 'A business sells 3 000 units at £12. Fixed costs are £10 000 and variable costs are £5 per unit. Calculate its profit.', [
    'Knowledge (1): profit = total revenue − total costs',
    'Application (1): total revenue = 3 000 × 12 = £36 000',
    'Application (1): total costs = 10 000 + (3 000 × 5) = £25 000',
    'Answer (1): profit = £11 000'
  ]);
  KL('G', '2.2.3 Break-even', 'Assess', 10, 'Assess the usefulness of break-even analysis to a start-up business.', [
    'Knowledge: break-even output, contribution, margin of safety, break-even chart.',
    'Analysis: shows how many units must be sold to avoid a loss; helps set prices and targets; supports a loan application; what-if analysis.',
    'Counterbalance: assumes all output is sold and costs/prices are constant; based on estimates for a start-up; ignores demand and competition; not useful for multi-product businesses.',
    'Judgement: a useful planning tool if regularly updated and combined with market research and cash-flow forecasts.'
  ]);
  M('G', '2.2.3 Break-even', 'Contribution per unit is…', 'Selling price − variable cost per unit', ['Selling price − total costs', 'Revenue − fixed costs', 'Fixed costs ÷ output'], 'It contributes to fixed costs and then profit.');
  M('G', '2.2.4 Budgets', 'A budget built from zero each year, justifying every item, is a…', 'Zero-based budget', ['Historical budget', 'Flexible budget', 'Variance budget'], 'Historical budgets use last year’s figures.');
  M('G', '2.2.4 Budgets', 'Actual costs higher than budgeted costs produce…', 'An adverse variance', ['A favourable variance', 'A margin of safety', 'A contribution'], 'Adverse reduces profit.');
  TF('G', '2.2.3 Break-even', 'An increase in fixed costs raises the break-even output.', true, 'More contribution is needed.');
  F('G', 'Break-even output', 'Fixed costs ÷ contribution per unit.', '2.2.3 Break-even');
  F('G', 'Margin of safety', 'Actual output − break-even output.', '2.2.3 Break-even');
  F('G', 'Sales revenue', 'Selling price × sales volume.', '2.2.2 Sales, revenue and costs');
  F('G', 'Variance', 'Difference between budgeted and actual figures; favourable or adverse.', '2.2.4 Budgets');
  F('G', 'Sales forecasting', 'Predicting sales; affected by consumer trends, economic variables and competitors.', '2.2.1 Sales forecasting');

  // H · 2.3 Managing finance
  K('H', '2.3.1 Profit', 'Calculate', 4, 'Revenue is £500 000, cost of sales £300 000 and other operating expenses £120 000. Calculate the operating profit margin. Show your working.', [
    'Knowledge (1): operating profit margin = operating profit ÷ revenue × 100',
    'Application (1): gross profit = 500 000 − 300 000 = £200 000',
    'Application (1): operating profit = 200 000 − 120 000 = £80 000',
    'Answer (1): 80 000 ÷ 500 000 × 100 = 16%'
  ]);
  K('H', '2.3.2 Liquidity', 'Calculate', 4, 'Current assets are £90 000 (including inventory of £40 000). Current liabilities are £60 000. Calculate the acid test ratio and comment on it.', [
    'Knowledge (1): acid test = (current assets − inventories) ÷ current liabilities',
    'Application (1): (90 000 − 40 000) ÷ 60 000',
    'Answer (1): 0.83 (:1)',
    'Analysis (1): below 1, so the business may struggle to pay short-term debts without selling stock.'
  ]);
  K('H', '2.3.3 Business failure', 'Explain', 4, 'Explain one internal cause of business failure.', [
    'Knowledge (1): internal causes are within the business’s control, eg poor cash-flow management, poor management, poor marketing',
    'Application (2): eg a retailer holding too much stock and offering long credit periods',
    'Analysis (1): cash runs out so it cannot pay suppliers and wages, even if profitable, leading to insolvency.'
  ]);
  K('H', '2.3.2 Liquidity', 'Explain', 4, 'Explain one way a business could improve its working capital.', [
    'Knowledge (1): working capital = current assets − current liabilities',
    'Application (2): eg reducing credit periods for customers, chasing debtors, negotiating longer credit with suppliers, reducing stock levels',
    'Analysis (1): more cash is available to meet short-term debts, reducing the risk of insolvency.'
  ]);
  M('H', '2.3.1 Profit', 'Gross profit is…', 'Revenue − cost of sales', ['Revenue − all expenses', 'Operating profit − tax', 'Revenue − fixed costs'], 'Before operating expenses.');
  M('H', '2.3.2 Liquidity', 'A current ratio of 1.5:1 means…', 'Current assets are 1.5 times current liabilities', ['The business is insolvent', 'Profit is 1.5 times costs', 'Gearing is 150%'], 'Often seen as healthy.');
  M('H', '2.3.1 Profit', 'The difference between profit and cash is mainly due to…', 'Timing of payments and credit', ['Taxation only', 'Inflation', 'Depreciation only'], 'Profitable businesses can run out of cash.');
  TF('H', '2.3.3 Business failure', 'A profitable business cannot fail.', false, 'Poor cash flow can cause failure.');
  F('H', 'Profit margins', 'Gross, operating and net profit ÷ revenue × 100.', '2.3.1 Profit');
  F('H', 'Liquidity ratios', 'Current ratio = CA ÷ CL. Acid test = (CA − inventories) ÷ CL.', '2.3.2 Liquidity');
  F('H', 'Causes of business failure', 'Internal: poor management, cash flow, marketing. External: competition, economy, legislation.', '2.3.3 Business failure');

  // I · 2.4 Resource management
  K('I', '2.4.1 Production, productivity and efficiency', 'Calculate', 4, 'A factory produces 12 000 units a month with 40 workers. After training, 45 workers produce 15 750 units. Calculate the percentage change in labour productivity.', [
    'Knowledge (1): labour productivity = output ÷ number of workers',
    'Application (1): before = 12 000 ÷ 40 = 300 units per worker',
    'Application (1): after = 15 750 ÷ 45 = 350 units per worker',
    'Answer (1): (350 − 300) ÷ 300 × 100 = 16.67%'
  ]);
  K('I', '2.4.2 Capacity utilisation', 'Calculate', 4, 'A hotel has 120 rooms and on average 78 are occupied each night. Calculate its capacity utilisation and explain one implication.', [
    'Knowledge (1): capacity utilisation = current output ÷ maximum possible output × 100',
    'Application (1): 78 ÷ 120 × 100',
    'Answer (1): 65%',
    'Analysis (1): fixed costs are spread over fewer customers, so unit costs are high; it may need promotions or to rent out space.'
  ]);
  K('I', '2.4.3 Stock control', 'Explain', 4, 'Explain one advantage of just-in-time (JIT) stock control.', [
    'Knowledge (1): JIT means stock arrives just as it is needed, with minimal buffer stock',
    'Application (2): eg a car manufacturer receiving parts several times a day',
    'Analysis (1): storage costs and waste fall and cash is not tied up in stock, improving liquidity.'
  ]);
  K('I', '2.4.4 Quality management', 'Explain', 4, 'Explain the difference between quality control and quality assurance.', [
    'Knowledge (1): quality control inspects products at the end of the process to find faults',
    'Knowledge (1): quality assurance builds quality into each stage of production',
    'Analysis (2): assurance prevents faults rather than detecting them, reducing waste and costs; it involves all staff (eg TQM, kaizen).'
  ]);
  KL('I', '2.4.1 Production, productivity and efficiency', 'Assess', 12, 'Assess the likely impact on a manufacturer of moving from labour-intensive to capital-intensive production.', [
    'Knowledge: labour vs capital intensity; methods of production (job, batch, flow, cell); productivity and efficiency.',
    'Analysis: automation increases productivity and consistency, lowering unit costs and allowing lower prices/higher margins; economies of scale.',
    'Counterbalance: high initial investment and finance costs; redundancies harm motivation/reputation; less flexibility for customised products; maintenance and breakdown risk.',
    'Judgement: beneficial for high-volume standardised products where demand is stable; less so for bespoke or uncertain demand.'
  ]);
  M('I', '2.4.1 Production, productivity and efficiency', 'Producing a set number of identical products before switching to a different product is…', 'Batch production', ['Job production', 'Flow production', 'Cell production'], 'eg a bakery.');
  M('I', '2.4.3 Stock control', 'On a stock control diagram, the level at which a new order is placed is the…', 'Re-order level', ['Buffer stock', 'Lead time', 'Maximum stock'], 'Lead time is the delay before delivery.');
  M('I', '2.4.4 Quality management', 'Kaizen means…', 'Continuous improvement through small changes', ['Zero stock', 'Inspection at the end', 'Outsourcing'], 'Often suggested by workers.');
  M('I', '2.4.2 Capacity utilisation', 'A business operating above 100% capacity is likely to experience…', 'Strain on staff and machinery', ['Lower unit costs indefinitely', 'Idle capacity', 'Falling demand'], 'Over-utilisation causes problems.');
  TF('I', '2.4.3 Stock control', 'Buffer stock is the minimum stock kept to cover unexpected demand or delays.', true, 'Safety stock.');
  F('I', 'Labour productivity', 'Output ÷ number of workers.', '2.4.1 Production, productivity and efficiency');
  F('I', 'Capacity utilisation', 'Current output ÷ maximum output × 100.', '2.4.2 Capacity utilisation');
  F('I', 'Stock control diagram', 'Shows maximum stock, re-order level, buffer stock, lead time and re-order quantity.', '2.4.3 Stock control');
  F('I', 'Quality management', 'Quality control (inspect) vs quality assurance (prevent); TQM; kaizen.', '2.4.4 Quality management');

  // J · 2.5 External influences
  K('J', '2.5.1 Economic influences', 'Explain', 4, 'Explain how a rise in interest rates might affect a car retailer.', [
    'Knowledge (1): interest rates are the cost of borrowing and the reward for saving',
    'Application (2): many customers buy cars on finance',
    'Analysis (1): higher repayments reduce demand for cars and raise the retailer’s own borrowing costs, reducing profit.'
  ]);
  K('J', '2.5.1 Economic influences', 'Explain', 4, 'Explain how a depreciation of the pound could affect a UK business that imports its raw materials.', [
    'Knowledge (1): a depreciation means the pound buys less foreign currency',
    'Application (2): eg a UK coffee roaster buying beans priced in US dollars',
    'Analysis (1): imports cost more in pounds, raising costs and squeezing margins unless prices are raised.'
  ]);
  K('J', '2.5.2 Legislation', 'Explain', 4, 'Explain one effect of a rise in the National Living Wage on a fast-food business.', [
    'Knowledge (1): the National Living Wage is the legal minimum hourly pay for workers aged 21+',
    'Application (2): fast-food businesses employ many low-paid workers',
    'Analysis (1): labour costs rise, reducing profit unless prices rise or productivity improves (eg self-service kiosks).'
  ]);
  K('J', '2.5.3 The competitive environment', 'Explain', 4, 'Explain how the entry of a new competitor could affect a business in a small market.', [
    'Knowledge (1): competition is rivalry between businesses selling similar products',
    'Application (2): eg a second gym opening in a small town',
    'Analysis (1): market share and prices fall, reducing revenue, so the business may need to differentiate or cut costs.'
  ]);
  M('J', '2.5.1 Economic influences', 'Inflation is…', 'A sustained rise in the general price level', ['A fall in unemployment', 'A rise in the exchange rate', 'Growth in GDP'], 'Measured by the CPI.');
  M('J', '2.5.1 Economic influences', 'During a recession a business selling luxury goods is likely to see…', 'Falling demand', ['Rising demand', 'No change', 'Lower costs only'], 'Incomes fall; luxuries are income elastic.');
  M('J', '2.5.2 Legislation', 'Which law protects customers from goods that are not of satisfactory quality?', 'Consumer protection law', ['Competition law', 'Employment law', 'Environmental legislation'], 'eg the Consumer Rights Act.');
  TF('J', '2.5.1 Economic influences', 'A strong pound makes UK exports cheaper for foreign buyers.', false, 'Exports become more expensive.');
  F('J', 'Economic influences', 'Inflation, exchange rates, interest rates, taxation and government spending, the business cycle.', '2.5.1 Economic influences');
  F('J', 'Legislation', 'Consumer protection, employee protection, environmental protection, competition policy, health and safety.', '2.5.2 Legislation');
  F('J', 'Competitive environment', 'Competition and market size affect prices, market share and strategy.', '2.5.3 The competitive environment');

/* ---- 03_theme3.js ---- */
  /* ===== Theme 3: Business decisions and strategy (K–P) — Papers 2 and 3 ===== */
  // K · 3.1 Business objectives and strategy
  K('K', '3.1.1 Corporate objectives', 'Explain', 4, 'Explain how a mission statement can influence a business’s corporate objectives.', [
    'Knowledge (1): a mission statement sets out the purpose and values of the business',
    'Application (2): eg an outdoor clothing brand whose mission is to protect the planet sets an objective of 100% recycled materials by 2030',
    'Analysis (1): objectives become specific, measurable steps towards the mission, guiding strategy and decisions at every level.'
  ]);
  K('K', '3.1.2 Theories of corporate strategy', 'Explain', 4, 'Explain one risk of a diversification strategy using the Ansoff matrix.', [
    'Knowledge (1): diversification is selling new products in new markets',
    'Application (2): eg a supermarket chain launching a bank',
    'Analysis (1): the business has no experience of either the product or the market, so it is the highest-risk strategy and could lose large sums.'
  ]);
  K('K', '3.1.3 SWOT analysis', 'Explain', 4, 'Explain one benefit to a business of carrying out a SWOT analysis.', [
    'Knowledge (1): SWOT reviews internal strengths and weaknesses and external opportunities and threats',
    'Application (2): eg a restaurant identifying a strong local reputation (S) and rising rents (T)',
    'Analysis (1): it helps managers match strengths to opportunities and plan for threats, leading to better strategic decisions.'
  ]);
  K('K', '3.1.4 Impact of external influences', 'Explain', 4, 'Explain, using Porter’s five forces, why a business in a market with low barriers to entry may struggle to earn high profits.', [
    'Knowledge (1): the threat of new entrants is one of Porter’s five forces',
    'Application (2): eg anyone can start an online T-shirt printing business with little capital',
    'Analysis (1): new rivals keep entering, increasing supply and competition, which pushes prices and profit margins down.'
  ]);
  KL('K', '3.1.2 Theories of corporate strategy', 'Assess', 12, 'Assess whether a cost leadership strategy is the best way for a budget airline to compete.', [
    'Knowledge: Porter’s generic strategies – cost leadership, differentiation, focus; Bowman’s strategic clock.',
    'Analysis: lowest costs allow lowest fares, attracting price-sensitive customers, high load factors, economies of scale.',
    'Counterbalance: rivals may cut costs too (price wars); fuel and labour costs outside control; reputation for poor service; differentiation (eg punctuality, routes) may protect margins.',
    'Judgement: cost leadership is essential for a budget airline’s positioning, but it must be sustained through efficiency and may need elements of differentiation.'
  ]);
  M('K', '3.1.2 Theories of corporate strategy', 'Selling existing products in new markets is, in the Ansoff matrix…', 'Market development', ['Market penetration', 'Product development', 'Diversification'], 'eg exporting.');
  M('K', '3.1.4 Impact of external influences', 'The “L” in PESTLE stands for…', 'Legal', ['Labour', 'Local', 'Liquidity'], 'Political, Economic, Social, Technological, Legal, Environmental.');
  M('K', '3.1.2 Theories of corporate strategy', 'Which is one of Porter’s generic strategies?', 'Differentiation', ['Diversification', 'Market penetration', 'Glocalisation'], 'Cost leadership, differentiation, focus.');
  TF('K', '3.1.3 SWOT analysis', 'Opportunities and threats in a SWOT analysis are internal factors.', false, 'They are external.');
  F('K', 'Ansoff matrix', 'Market penetration, market development, product development, diversification (risk rises).', '3.1.2 Theories of corporate strategy');
  F('K', 'Porter’s generic strategies', 'Cost leadership, differentiation, focus (cost or differentiation).', '3.1.2 Theories of corporate strategy');
  F('K', 'Bowman’s strategic clock', 'Positions based on price and perceived added value: low price, hybrid, differentiation, failure strategies.', '3.1.2 Theories of corporate strategy');
  F('K', 'Porter’s five forces', 'New entrants, buyer power, supplier power, substitutes, competitive rivalry.', '3.1.4 Impact of external influences');
  F('K', 'Corporate objectives', 'Goals of the whole business derived from the mission; inform functional objectives.', '3.1.1 Corporate objectives');

  // L · 3.2 Business growth
  K('L', '3.2.1 Growth', 'Explain', 4, 'Explain one reason why growth may lead to diseconomies of scale.', [
    'Knowledge (1): diseconomies of scale are rising average costs as a business grows',
    'Application (2): eg a retailer growing from 10 to 300 stores',
    'Analysis (1): communication and coordination become harder and staff feel less valued, so efficiency falls and unit costs rise.'
  ]);
  K('L', '3.2.2 Mergers and takeovers', 'Explain', 4, 'Explain one benefit of a vertical (backward) integration for a chocolate manufacturer.', [
    'Knowledge (1): backward vertical integration is acquiring a business at an earlier stage of the supply chain',
    'Application (2): eg a chocolate maker buying a cocoa plantation',
    'Analysis (1): it secures supplies and controls quality and cost of cocoa, protecting margins from price rises.'
  ]);
  K('L', '3.2.3 Organic growth', 'Explain', 4, 'Explain one advantage of organic growth compared with a takeover.', [
    'Knowledge (1): organic growth is expanding from within, eg opening new stores or launching products',
    'Application (2): eg a coffee chain opening five new branches a year',
    'Analysis (1): it is lower risk, keeps control and avoids culture clashes, so it is easier to manage than integrating another business.'
  ]);
  K('L', '3.2.4 Reasons for staying small', 'Explain', 4, 'Explain one way a small business can survive in a market dominated by large firms.', [
    'Knowledge (1): small businesses can compete through niche markets, personal service, flexibility or online presence',
    'Application (2): eg an independent bookshop offering author events and personal recommendations',
    'Analysis (1): this differentiates it from large rivals, creating loyalty that is not based on price.'
  ]);
  KL('L', '3.2.2 Mergers and takeovers', 'Assess', 12, 'Assess the likely benefits for a supermarket of a horizontal merger with a rival.', [
    'Knowledge: horizontal integration; economies of scale (purchasing, technical, managerial); market share.',
    'Analysis: greater buying power lowers costs; increased market share and pricing power; rationalisation of stores; synergies.',
    'Counterbalance: competition authority (CMA) may block or impose conditions; culture clash; diseconomies; costs of integration; customer backlash.',
    'Judgement: benefits depend on overlap of stores and whether the CMA allows it; many large mergers fail to deliver expected synergies.'
  ]);
  M('L', '3.2.2 Mergers and takeovers', 'A merger between businesses in unrelated industries is…', 'Conglomerate integration', ['Horizontal integration', 'Forward vertical integration', 'Organic growth'], 'Spreads risk.');
  M('L', '3.2.1 Growth', 'Bulk buying discounts are an example of…', 'Purchasing economies of scale', ['Technical economies', 'External diseconomies', 'Managerial economies'], 'Lower unit costs.');
  M('L', '3.2.3 Organic growth', 'Which is an example of organic growth?', 'Opening new branches', ['Acquiring a rival', 'Merging with a supplier', 'A joint venture'], 'Internal growth.');
  TF('L', '3.2.4 Reasons for staying small', 'Small businesses can respond more quickly to changes in customer needs.', true, 'Flexibility is a key advantage.');
  F('L', 'Economies of scale', 'Falling average costs as output rises: purchasing, technical, managerial, financial, marketing.', '3.2.1 Growth');
  F('L', 'Types of integration', 'Horizontal (same stage), vertical forward/backward, conglomerate (unrelated).', '3.2.2 Mergers and takeovers');
  F('L', 'Organic vs inorganic growth', 'Organic: internal expansion. Inorganic: mergers and takeovers.', '3.2.3 Organic growth');
  F('L', 'Staying small', 'Niche markets, personal service, flexibility, e-commerce, lower costs.', '3.2.4 Reasons for staying small');

  // M · 3.3 Decision-making techniques
  K('M', '3.3.2 Investment appraisal', 'Calculate', 4, 'A project costs £80 000 and generates net cash inflows of £25 000 a year. Calculate the payback period in years and months.', [
    'Knowledge (1): payback = time taken for net inflows to repay the initial cost',
    'Application (1): after 3 years: 75 000 recovered; £5 000 outstanding',
    'Application (1): 5 000 ÷ 25 000 × 12 = 2.4 months',
    'Answer (1): 3 years and 3 months (accept 3 years 2.4 months)'
  ]);
  K('M', '3.3.2 Investment appraisal', 'Calculate', 4, 'A project costs £100 000 and has total net returns of £140 000 over 4 years. Calculate the average rate of return.', [
    'Knowledge (1): ARR = average annual profit ÷ initial cost × 100',
    'Application (1): total profit = 140 000 − 100 000 = £40 000',
    'Application (1): average annual profit = 40 000 ÷ 4 = £10 000',
    'Answer (1): 10 000 ÷ 100 000 × 100 = 10%'
  ]);
  K('M', '3.3.3 Decision trees', 'Calculate', 4, 'Option A costs £50 000. It has a 0.6 probability of earning £120 000 and a 0.4 probability of earning £40 000. Calculate the net gain.', [
    'Knowledge (1): expected value = sum of (probability × outcome)',
    'Application (1): (0.6 × 120 000) + (0.4 × 40 000)',
    'Application (1): = 72 000 + 16 000 = £88 000',
    'Answer (1): net gain = 88 000 − 50 000 = £38 000'
  ]);
  K('M', '3.3.4 Critical Path Analysis', 'Explain', 4, 'Explain the purpose of identifying the critical path in a project.', [
    'Knowledge (1): the critical path is the sequence of activities with zero total float that determines the minimum project duration',
    'Application (2): eg building a new store – fitting out cannot start until construction finishes',
    'Analysis (1): managers can focus resources on critical activities, because any delay to them delays the whole project.'
  ]);
  K('M', '3.3.1 Quantitative sales forecasting', 'Explain', 4, 'Explain one limitation of using extrapolation to forecast sales.', [
    'Knowledge (1): extrapolation extends a past trend into the future',
    'Application (2): eg using a three-period moving average of past sales to predict next year',
    'Analysis (1): it assumes the past trend continues, so it ignores external shocks or changes in competition, making forecasts unreliable in dynamic markets.'
  ]);
  M('M', '3.3.2 Investment appraisal', 'Which method of investment appraisal takes the time value of money into account?', 'Net present value', ['Payback', 'Average rate of return', 'Break-even'], 'Discounted cash flows.');
  M('M', '3.3.3 Decision trees', 'On a decision tree, a circle represents…', 'A chance node (uncertain outcomes)', ['A decision', 'The end of a branch', 'A cost'], 'Squares represent decisions.');
  M('M', '3.3.4 Critical Path Analysis', 'Total float is…', 'The time an activity can be delayed without delaying the project', ['The time taken by the critical path', 'The earliest start time', 'The cost of a delay'], 'LFT − duration − EST.');
  M('M', '3.3.1 Quantitative sales forecasting', 'A moving average is used to…', 'Smooth out fluctuations to identify a trend', ['Calculate break-even', 'Measure liquidity', 'Rank investment projects'], 'Time-series analysis.');
  TF('M', '3.3.2 Investment appraisal', 'A shorter payback period means a less risky investment, other things equal.', true, 'Money is recovered sooner.');
  F('M', 'Payback', 'Time to recover the initial investment from net cash inflows.', '3.3.2 Investment appraisal');
  F('M', 'Average rate of return', '(Total net return − cost) ÷ years ÷ cost × 100.', '3.3.2 Investment appraisal');
  F('M', 'Net present value', 'Sum of discounted future cash flows − initial cost; positive NPV = worthwhile.', '3.3.2 Investment appraisal');
  F('M', 'Decision tree', 'Squares = decisions, circles = chance nodes; expected value = probability × outcome.', '3.3.3 Decision trees');
  F('M', 'Critical path', 'Activities with zero float; determines the minimum project duration.', '3.3.4 Critical Path Analysis');
  F('M', 'Time-series analysis', 'Moving averages and extrapolation of trends to forecast sales.', '3.3.1 Quantitative sales forecasting');

  // N · 3.4 Influences on business decisions
  K('N', '3.4.1 Corporate influences', 'Explain', 4, 'Explain one problem caused by short-termism in a public limited company.', [
    'Knowledge (1): short-termism is focusing on short-term results at the expense of long-term success',
    'Application (2): eg cutting R&D spending to boost this year’s profit and dividends for shareholders',
    'Analysis (1): future competitiveness suffers because fewer new products are developed.'
  ]);
  K('N', '3.4.2 Corporate culture', 'Explain', 4, 'Explain why it may be difficult to change a strong corporate culture.', [
    'Knowledge (1): corporate culture is the shared values, beliefs and norms within an organisation',
    'Application (2): eg a long-established family firm with a culture of doing things “the way we always have”',
    'Analysis (1): staff resist new ways of working because they feel threatened, which slows change and may reduce productivity.'
  ]);
  K('N', '3.4.3 Shareholders versus stakeholders', 'Explain', 4, 'Explain one possible conflict between shareholders and employees.', [
    'Knowledge (1): shareholders want high profits and dividends; employees want pay, security and good conditions',
    'Application (2): eg a plan to close a factory and move production abroad',
    'Analysis (1): it may raise profits for shareholders but cause redundancies, damaging morale and reputation.'
  ]);
  K('N', '3.4.4 Business ethics', 'Explain', 4, 'Explain one trade-off between ethics and profit.', [
    'Knowledge (1): business ethics are moral principles guiding decisions',
    'Application (2): eg paying suppliers in developing countries Fairtrade prices',
    'Analysis (1): costs rise and margins fall in the short term, although the brand may gain loyalty and premium prices.'
  ]);
  KL('N', '3.4.3 Shareholders versus stakeholders', 'Assess', 10, 'Assess whether a business should adopt a stakeholder approach rather than a shareholder approach.', [
    'Knowledge: shareholder (Friedman) vs stakeholder concept; internal and external stakeholders; Carroll’s CSR pyramid.',
    'Analysis: meeting stakeholder needs builds reputation, loyalty and staff motivation, which increases long-term profit.',
    'Counterbalance: costs and conflicting interests; shareholders own the business and may sell shares; difficult to measure benefits.',
    'Judgement: in the long run the approaches often converge – satisfying stakeholders supports shareholder value, but priorities depend on competition and ownership.'
  ]);
  M('N', '3.4.3 Shareholders versus stakeholders', 'Which of these is an external stakeholder?', 'Local community', ['Employees', 'Managers', 'Directors'], 'Outside the organisation.');
  M('N', '3.4.2 Corporate culture', 'Handy’s culture where power is held by one central figure is a…', 'Power culture', ['Role culture', 'Task culture', 'Person culture'], 'Handy’s four cultures.');
  M('N', '3.4.4 Business ethics', 'Carroll’s pyramid places which responsibility at the base?', 'Economic', ['Legal', 'Ethical', 'Philanthropic'], 'Be profitable first.');
  TF('N', '3.4.1 Corporate influences', 'Short-termism can result from pressure for quarterly results from shareholders.', true, 'Common in plcs.');
  F('N', 'Short-termism', 'Prioritising short-term results over long-term investment.', '3.4.1 Corporate influences');
  F('N', 'Corporate culture (Handy)', 'Power, role, task and person cultures; strong vs weak cultures.', '3.4.2 Corporate culture');
  F('N', 'Stakeholder mapping', 'Power vs interest grid: manage closely, keep satisfied, keep informed, monitor.', '3.4.3 Shareholders versus stakeholders');
  F('N', 'Business ethics', 'Moral principles; trade-offs between ethics and profit; pay and rewards; environment.', '3.4.4 Business ethics');

  // O · 3.5 Assessing competitiveness
  K('O', '3.5.2 Ratio analysis', 'Calculate', 4, 'Operating profit is £360 000. Total equity is £1.5m and non-current liabilities are £0.9m. Calculate the return on capital employed.', [
    'Knowledge (1): ROCE = operating profit ÷ capital employed × 100',
    'Application (1): capital employed = total equity + non-current liabilities = £2.4m',
    'Application (1): 360 000 ÷ 2 400 000 × 100',
    'Answer (1): 15%'
  ]);
  K('O', '3.5.2 Ratio analysis', 'Calculate', 4, 'Using the data above, calculate the gearing ratio and comment on it.', [
    'Knowledge (1): gearing = non-current liabilities ÷ capital employed × 100',
    'Application (1): 0.9 ÷ 2.4 × 100',
    'Answer (1): 37.5%',
    'Analysis (1): below 50%, so the business is not highly geared – less exposed to rising interest rates.'
  ]);
  K('O', '3.5.3 Human resources', 'Calculate', 4, 'A business employs an average of 250 staff. 40 staff left during the year. Calculate labour turnover and explain one implication.', [
    'Knowledge (1): labour turnover = number of staff leaving ÷ average number employed × 100',
    'Application (1): 40 ÷ 250 × 100',
    'Answer (1): 16%',
    'Analysis (1): high recruitment and training costs and loss of skills, which may reduce productivity.'
  ]);
  K('O', '3.5.1 Interpretation of financial statements', 'Explain', 4, 'Explain one limitation of using financial statements to judge a business’s performance.', [
    'Knowledge (1): financial statements include the statement of comprehensive income and the statement of financial position',
    'Application (2): they show past figures only and ignore non-financial factors such as brand, staff skills or customer satisfaction',
    'Analysis (1): so they may not show future potential, and window dressing can make the business look healthier than it is.'
  ]);
  M('O', '3.5.2 Ratio analysis', 'Capital employed equals…', 'Total equity + non-current liabilities', ['Current assets − current liabilities', 'Revenue − costs', 'Total assets + liabilities'], 'Long-term funding.');
  M('O', '3.5.3 Human resources', 'Labour productivity measures…', 'Output per worker', ['Staff leaving per year', 'Days absent', 'Wages per worker'], 'Output ÷ number of employees.');
  M('O', '3.5.1 Interpretation of financial statements', 'Which statement shows assets, liabilities and equity at a point in time?', 'Statement of financial position', ['Statement of comprehensive income', 'Cash-flow forecast', 'Budget'], 'Balance sheet.');
  TF('O', '3.5.2 Ratio analysis', 'A gearing ratio above 50% indicates high gearing.', true, 'More reliant on long-term borrowing.');
  F('O', 'ROCE', 'Operating profit ÷ capital employed × 100.', '3.5.2 Ratio analysis');
  F('O', 'Gearing', 'Non-current liabilities ÷ capital employed × 100; >50% = highly geared.', '3.5.2 Ratio analysis');
  F('O', 'HR measures', 'Labour productivity, labour turnover, retention, absenteeism.', '3.5.3 Human resources');
  F('O', 'Financial statements', 'Statement of comprehensive income (P&L) and statement of financial position (balance sheet).', '3.5.1 Interpretation of financial statements');

  // P · 3.6 Managing change
  K('P', '3.6.1 Causes and effects of change', 'Explain', 4, 'Explain one internal cause of change for a business.', [
    'Knowledge (1): internal causes of change come from within, eg new owners/leaders, poor performance, new strategy',
    'Application (2): eg a new chief executive introducing a cost-cutting programme',
    'Analysis (1): structures, jobs and processes change, which may improve efficiency but cause uncertainty for staff.'
  ]);
  K('P', '3.6.2 Key factors in change', 'Explain', 4, 'Explain one reason why employees may resist change.', [
    'Knowledge (1): resistance to change is opposition from those affected',
    'Application (2): eg fear of job losses when new automated tills are introduced',
    'Analysis (1): staff worry about security, new skills or loss of status, so morale and productivity fall unless change is communicated and supported.'
  ]);
  K('P', '3.6.3 Scenario planning', 'Explain', 4, 'Explain the purpose of succession planning.', [
    'Knowledge (1): succession planning identifies and develops staff to replace key leaders',
    'Application (2): eg preparing a deputy for when the founder retires',
    'Analysis (1): it ensures continuity, avoiding disruption and loss of confidence among investors and staff.'
  ]);
  M('P', '3.6.3 Scenario planning', 'Planning how a business will continue operating after a major incident is…', 'Business continuity planning', ['Succession planning', 'Market research', 'Budgeting'], 'Part of risk mitigation.');
  M('P', '3.6.2 Key factors in change', 'Which is a key factor in successful change?', 'Effective communication and leadership', ['Keeping plans secret', 'Ignoring culture', 'Avoiding training'], 'Reduces resistance.');
  TF('P', '3.6.1 Causes and effects of change', 'New technology is an external cause of change.', true, 'eg AI, e-commerce.');
  F('P', 'Causes of change', 'Internal (new leaders, poor performance) and external (technology, competition, economy, legislation).', '3.6.1 Causes and effects of change');
  F('P', 'Resistance to change', 'Fear of the unknown, job security, loss of status; reduced by communication, consultation, training.', '3.6.2 Key factors in change');
  F('P', 'Scenario planning', 'Identifying key risks, risk assessment, mitigation, business continuity, succession planning.', '3.6.3 Scenario planning');

/* ---- 04_theme4.js ---- */
  /* ===== Theme 4: Global business (Q–T) — Papers 1 and 3 ===== */
  // Q · 4.1 Globalisation
  K('Q', '4.1.1 Growing economies', 'Explain', 4, 'Explain one opportunity for a UK business from economic growth in emerging economies.', [
    'Knowledge (1): emerging economies (eg India, Indonesia) have high GDP growth rates',
    'Application (2): eg a UK luxury car maker selling to India’s growing middle class',
    'Analysis (1): rising incomes increase demand for imported and premium goods, so the business can increase sales and spread risk.'
  ]);
  K('Q', '4.1.2 International trade and business growth', 'Explain', 4, 'Explain one reason why a business might choose to export.', [
    'Knowledge (1): exporting is selling goods or services to customers in other countries',
    'Application (2): eg a Scottish whisky distillery selling to Japan',
    'Analysis (1): it reaches new markets when the domestic market is saturated, increasing sales and economies of scale.'
  ]);
  K('Q', '4.1.4 Protectionism', 'Explain', 4, 'Explain how a tariff on imported steel might affect a UK car manufacturer.', [
    'Knowledge (1): a tariff is a tax on imports',
    'Application (2): the car maker imports steel for car bodies',
    'Analysis (1): its costs rise, reducing margins or forcing higher car prices, making it less competitive.'
  ]);
  K('Q', '4.1.5 Trading blocs', 'Explain', 4, 'Explain one benefit for a business of operating within a trading bloc.', [
    'Knowledge (1): a trading bloc is a group of countries with reduced or no trade barriers between members, eg the EU, ASEAN',
    'Application (2): eg a German manufacturer selling to France without tariffs',
    'Analysis (1): lower costs and access to a large single market, increasing sales and economies of scale.'
  ]);
  K('Q', '4.1.3 Factors contributing to increased globalisation', 'Explain', 4, 'Explain how improvements in transport and communication have increased globalisation.', [
    'Knowledge (1): globalisation is the increasing integration of economies around the world',
    'Application (2): eg containerisation, cheaper air freight, the internet and video calls',
    'Analysis (1): costs of trading and coordinating across countries fall, so businesses can source, produce and sell globally.'
  ]);
  KL('Q', '4.1.4 Protectionism', 'Assess', 12, 'Assess the likely impact of protectionism on a business that imports components from abroad.', [
    'Knowledge: tariffs, import quotas, government legislation, domestic subsidies.',
    'Analysis: tariffs raise costs; quotas limit supply; administration and delays; retaliation affects exports.',
    'Counterbalance: the business may switch to domestic suppliers (reshoring), pass costs to customers if demand is inelastic, or benefit from subsidies.',
    'Judgement: impact depends on the share of imported components, the size of the tariff and the availability of alternative suppliers.'
  ]);
  M('Q', '4.1.4 Protectionism', 'A physical limit on the quantity of a good that can be imported is…', 'A quota', ['A tariff', 'A subsidy', 'An embargo on exports'], 'Restricts supply.');
  M('Q', '4.1.2 International trade and business growth', 'Specialisation in international trade is based on…', 'Countries producing goods they make most efficiently', ['Countries producing all their own goods', 'Countries avoiding imports', 'Equal tariffs'], 'Comparative advantage.');
  M('Q', '4.1.5 Trading blocs', 'Which of these is a trading bloc?', 'ASEAN', ['IMF', 'WTO', 'OPEC'], 'Association of Southeast Asian Nations.');
  TF('Q', '4.1.4 Protectionism', 'Domestic subsidies make domestic producers more competitive against imports.', true, 'Lower costs.');
  F('Q', 'Globalisation', 'Growing integration of the world’s economies through trade, investment and technology.', '4.1.3 Factors contributing to increased globalisation');
  F('Q', 'Protectionism', 'Tariffs, import quotas, legislation, domestic subsidies.', '4.1.4 Protectionism');
  F('Q', 'Trading blocs', 'EU, ASEAN, USMCA etc: free trade among members, common rules; opportunities and threats.', '4.1.5 Trading blocs');
  F('Q', 'Emerging economies', 'Fast-growing economies (eg India, China, Indonesia) – rising GDP per capita, HDI.', '4.1.1 Growing economies');

  // R · 4.2 Global markets and business expansion
  K('R', '4.2.1 Conditions that prompt trade', 'Explain', 4, 'Explain one push factor that might lead a business to sell overseas.', [
    'Knowledge (1): push factors are conditions in the home market that encourage expansion abroad',
    'Application (2): eg saturation of the UK coffee-shop market',
    'Analysis (1): growth at home is limited, so the business seeks new markets to keep increasing sales.'
  ]);
  K('R', '4.2.2 Assessment of a country as a market', 'Explain', 4, 'Explain one factor a business should consider when assessing a country as a market.', [
    'Knowledge (1): factors include levels/growth of disposable income, ease of doing business, infrastructure, political stability, exchange rates',
    'Application (2): eg a UK fashion retailer considering Vietnam',
    'Analysis (1): rising disposable incomes increase demand for its products, so sales potential is higher.'
  ]);
  K('R', '4.2.3 Assessment of a country as a production location', 'Explain', 4, 'Explain one reason why a business might offshore production.', [
    'Knowledge (1): offshoring is moving production to another country',
    'Application (2): eg a clothing brand moving production to Bangladesh',
    'Analysis (1): lower labour costs reduce unit costs, increasing price competitiveness or margins.'
  ]);
  K('R', '4.2.4 Reasons for global mergers or joint ventures', 'Explain', 4, 'Explain one reason for a business to form a joint venture when entering a new country.', [
    'Knowledge (1): a joint venture is a new business owned by two or more businesses',
    'Application (2): eg a Western supermarket partnering with a local retailer in India',
    'Analysis (1): it gains local knowledge, contacts and access to distribution, reducing risk, and may be required by local law.'
  ]);
  K('R', '4.2.5 Global competitiveness', 'Explain', 4, 'Explain how an appreciation of a currency could affect the competitiveness of an exporter.', [
    'Knowledge (1): an appreciation increases the value of a currency',
    'Application (2): eg a UK exporter of machinery to the USA',
    'Analysis (1): its products become more expensive in dollars, reducing price competitiveness and sales unless it cuts its prices.'
  ]);
  M('R', '4.2.1 Conditions that prompt trade', 'Moving production back to the home country is…', 'Reshoring', ['Offshoring', 'Outsourcing', 'Glocalisation'], 'eg to improve quality control.');
  M('R', '4.2.2 Assessment of a country as a market', 'The World Bank “ease of doing business” measure helps assess…', 'How simple it is to set up and run a business in a country', ['A country’s exchange rate', 'Average wages', 'Tariff levels'], 'Regulation, permits, tax.');
  M('R', '4.2.5 Global competitiveness', 'Competitive advantage through differentiation means…', 'Offering something rivals cannot easily copy', ['Having the lowest costs', 'Using JIT', 'Exporting more'], 'Porter.');
  TF('R', '4.2.3 Assessment of a country as a production location', 'Skills shortages can make a low-wage country unsuitable for production.', true, 'Productivity and quality matter.');
  F('R', 'Push and pull factors', 'Push: saturation, competition at home. Pull: growth markets, risk spreading, economies of scale.', '4.2.1 Conditions that prompt trade');
  F('R', 'Assessing a market', 'Disposable income, ease of doing business, infrastructure, political stability, exchange rates.', '4.2.2 Assessment of a country as a market');
  F('R', 'Production location', 'Costs, skills, infrastructure, location in a trade bloc, government incentives, ethics.', '4.2.3 Assessment of a country as a production location');
  F('R', 'Global mergers and joint ventures', 'Spread risk, enter markets, acquire brands/resources, avoid tariffs.', '4.2.4 Reasons for global mergers or joint ventures');

  // S · 4.3 Global marketing
  K('S', '4.3.1 Marketing', 'Explain', 4, 'Explain what is meant by glocalisation. Use an example.', [
    'Knowledge (1): glocalisation is a global strategy adapted to local tastes and cultures (think global, act local)',
    'Application (2): eg McDonald’s offering McSpicy Paneer in India',
    'Analysis (1): it keeps economies of scale from a global brand while increasing local appeal and sales.'
  ]);
  K('S', '4.3.2 Niche markets', 'Explain', 4, 'Explain one benefit of targeting a global niche market.', [
    'Knowledge (1): a global niche is a specialised segment that exists across many countries',
    'Application (2): eg luxury watches or specialist cycling equipment',
    'Analysis (1): customers worldwide share similar needs, so the business can sell a standardised premium product with high margins and less competition.'
  ]);
  K('S', '4.3.3 Cultural/social factors', 'Explain', 4, 'Explain one problem a business might face because of cultural differences when selling abroad.', [
    'Knowledge (1): cultural differences include language, customs, religion, tastes',
    'Application (2): eg a brand name with an offensive meaning in another language',
    'Analysis (1): the product may be rejected or damage the brand, wasting marketing spend.'
  ]);
  M('S', '4.3.1 Marketing', 'In the Bartlett and Ghoshal matrix, a strategy with high pressure for local responsiveness and low pressure for cost reduction is…', 'Multi-domestic', ['Global', 'Transnational', 'International'], 'Products adapted for each market.');
  M('S', '4.3.1 Marketing', 'Selling the same product in the same way worldwide is a…', 'Global (standardised) strategy', ['Glocal strategy', 'Multi-domestic strategy', 'Niche strategy'], 'Maximises economies of scale.');
  TF('S', '4.3.3 Cultural/social factors', 'Unintended meanings of brand names are a cultural risk in global marketing.', true, 'Translation problems.');
  F('S', 'Bartlett and Ghoshal', 'International, multi-domestic, global, transnational strategies (cost pressure vs local responsiveness).', '4.3.1 Marketing');
  F('S', 'Glocalisation', 'Think global, act local – adapting a global product to local markets.', '4.3.1 Marketing');
  F('S', 'Global niche', 'Specialised segment across many countries; often premium, differentiated products.', '4.3.2 Niche markets');
  F('S', 'Cultural/social factors', 'Language, tastes, customs, inappropriate or inaccurate translations.', '4.3.3 Cultural/social factors');

  // T · 4.4 Global industries and companies (MNCs)
  K('T', '4.4.1 The impact of MNCs', 'Explain', 4, 'Explain one benefit to a local economy of a multinational opening a factory.', [
    'Knowledge (1): an MNC operates in more than one country',
    'Application (2): eg a car maker opening a plant in the north-east of England',
    'Analysis (1): it creates jobs and income, which increases spending in the local area and supports local suppliers (multiplier effect).'
  ]);
  K('T', '4.4.2 Ethics', 'Explain', 4, 'Explain one ethical issue a multinational might face in its supply chain.', [
    'Knowledge (1): ethics concern whether actions are morally right',
    'Application (2): eg suppliers in developing countries using child labour or unsafe working conditions',
    'Analysis (1): if exposed, the MNC’s reputation and sales suffer, so it must monitor suppliers even if costs rise.'
  ]);
  K('T', '4.4.3 Controlling MNCs', 'Explain', 4, 'Explain how pressure groups can control the behaviour of multinationals.', [
    'Knowledge (1): pressure groups are organisations that try to influence decisions, eg Greenpeace',
    'Application (2): eg a social media campaign against deforestation by a palm-oil supplier',
    'Analysis (1): negative publicity damages the brand and sales, pushing the MNC to change policies.'
  ]);
  KL('T', '4.4.1 The impact of MNCs', 'Assess', 12, 'Assess the impact of multinational corporations on the national economy of an emerging country.', [
    'Knowledge: impact on local and national economies – FDI flows, balance of payments, technology transfer, consumers, business culture, tax revenues and transfer pricing.',
    'Analysis: FDI creates jobs and raises incomes; new skills and technology; exports improve the balance of payments; tax revenues.',
    'Counterbalance: profits repatriated; transfer pricing reduces tax; local firms crowded out; exploitation of workers/environment; dependence on foreign firms.',
    'Judgement: net impact depends on regulation, the quality of jobs and how much profit and technology stay in the country.'
  ]);
  M('T', '4.4.1 The impact of MNCs', 'Setting prices for transactions between subsidiaries to reduce tax is…', 'Transfer pricing', ['Penetration pricing', 'Price discrimination', 'Dumping'], 'Shifts profit to low-tax countries.');
  M('T', '4.4.3 Controlling MNCs', 'Which is a way of controlling MNCs?', 'Political influence and legal control', ['Lower tariffs', 'Offshoring', 'Glocalisation'], 'Also pressure groups and social media.');
  TF('T', '4.4.2 Ethics', 'Stakeholder conflicts are less common in MNCs than in small businesses.', false, 'MNCs have many stakeholder groups across countries.');
  F('T', 'MNC impacts', 'Local: jobs, wages, local businesses, environment. National: FDI, balance of payments, technology, tax.', '4.4.1 The impact of MNCs');
  F('T', 'MNC ethics', 'Stakeholder conflicts; pay and conditions; environment; supply chain; marketing.', '4.4.2 Ethics');
  F('T', 'Controlling MNCs', 'Political influence, legal control, pressure groups, social media.', '4.4.3 Controlling MNCs');

/* ---- 99_tail.js ---- */
})();

