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
