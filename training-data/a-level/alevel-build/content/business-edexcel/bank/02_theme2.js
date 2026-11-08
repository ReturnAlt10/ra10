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
