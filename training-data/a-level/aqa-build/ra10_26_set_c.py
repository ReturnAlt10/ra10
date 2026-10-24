"""RA10 practice Set C (AQA 7138 format)."""
from ra10_26_lib import case, Q, paper

SET = 'C'


def n(x, d=0):
    return f'{x:,.{d}f}'


# ═════════════ PAPER 1 ═════════════
sv = dict(op=2.4, eq=3.1, ncl=5.9, rev=(21.0, 24.5))
sv_ce = sv['eq'] + sv['ncl']
sv_roce = sv['op'] / sv_ce * 100
sv_gear = sv['ncl'] / sv_ce * 100

P1_A = case('Source A: Savora Sauces Ltd', [
    'Savora Sauces Ltd was started in 2015 by Marisol Vega, who began by selling hot sauces made in her kitchen at street-food markets. She had no business qualifications and was told by several banks that her idea was “too small”. She kept her job as a chef for two years, saving every week, before leaving to run Savora full-time. The business now supplies 900 shops and restaurants and employs 28 staff.',
    'Marisol has described herself as “driven by the product, not the money”. She is adaptable: when supermarkets rejected her original recipes as too spicy, she created a milder range which now accounts for 60% of sales. Savora’s sauces are priced 30% above supermarket own-label products. A survey by a trade body showed that demand for premium sauces has an income elasticity of demand of +1.6 whereas demand for basic table sauces is −0.3.',
    'To meet a large export order, Savora needs £2.5m to build a new factory. The two options are: a sale and leaseback of its existing factory (valued at £2.5m), or selling a 30% stake to a private equity firm, Crestline Capital, which wants a seat on the board.',
], [('Appendix A: Extracts from Savora Sauces Ltd’s financial statements, 2024 (£m)', ['', '£m'], [['Revenue', f'{sv["rev"][1]:.1f}'], ['Operating profit', f'{sv["op"]:.1f}'], ['Total equity', f'{sv["eq"]:.1f}'], ['Non-current liabilities', f'{sv["ncl"]:.1f}']], 'Capital employed = total equity + non-current liabilities.')])

P1_A_Q = [
    Q(6, 'Marisol Vega kept her job as a chef for two years while building Savora.\nAnalyse one way in which this decision shows an entrepreneurial characteristic that contributed to the success of Savora Sauces Ltd.', [
        'Entrepreneurial characteristics: risk taker, resilient, focused, passionate, innovative, adaptable (AO1).',
        'Marisol saved every week and worked for two years before leaving - focus/resilience; a careful risk-taker who managed risk (AO1, AO2).',
        'Focus and persistence allowed her to build a customer base and finance without debt → stronger business at launch → growth to 900 outlets (AO3). Other characteristic, e.g. adaptable, can be credited.']),
    Q(6, 'Demand for premium sauces has an income elasticity of demand of +1.6.\nAnalyse one way in which an economic recession might affect the sales of Savora’s premium sauces.', [
        'Positive income elasticity of demand of +1.6 means a luxury/normal good: demand rises more than proportionally as income rises (AO1).',
        'Savora’s sauces are priced 30% above own-label products (AO2).',
        'In a recession incomes fall → a 5% fall in income would reduce demand by about 8% (1.6 × 5) → lower sales and revenue → customers trade down to own-label (AO3).']),
    Q(9, 'Assess whether Savora Sauces Ltd is making effective use of the capital invested in the business.\nCalculate the return on capital employed (ROCE) for 2024 to support your answer.', [
        f'Quantitative skills: ROCE = operating profit ÷ capital employed × 100 (AO1). Capital employed = £{sv["eq"]:.1f}m + £{sv["ncl"]:.1f}m = £{sv_ce:.1f}m; ROCE = {sv["op"]:.1f} ÷ {sv_ce:.1f} × 100 = {sv_roce:.1f}% (AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): for every £1 of capital employed Savora makes about {sv_roce:.0f}p operating profit; gearing is {sv_gear:.0f}% so the business is highly geared.',
        'Evaluation (AO3, AO4): a ROCE well above typical borrowing costs of 8–9% suggests capital is used effectively, but gearing is high so risk is high; compare with competitors and over time; single-year figure; judgement.']),
    Q(9, 'Assess whether Savora Sauces Ltd should continue to follow a premium pricing strategy.', [
        'Premium pricing: setting a higher price than competitors, supported by brand and quality (AO1).',
        'Savora’s sauces are 30% above own-label; income elasticity +1.6 shows demand is sensitive to income (AO2). Premium pricing gives higher margins and brand image (AO3).',
        'Risks: price-sensitive customers may trade down in a recession; supermarkets may promote own-label (AO3).',
        'Judgement: viable if Savora keeps differentiation and targets less price-sensitive segments (AO4).']),
    Q(15, 'Evaluate (1) a sale and leaseback of its existing factory and (2) selling a 30% stake to the private equity firm as ways of raising £2.5m and recommend which one Savora should choose.', [
        f'Sale and leaseback: releases £2.5m without new shareholders or new debt; keeps use of the factory; but pays rent permanently (reducing operating profit of £{sv["op"]:.1f}m), loses ownership of an asset that may increase in value, long-term commitment (AO1, AO2, AO3).',
        f'Private equity: no repayments or rent; Crestline brings expertise and contacts for exports; but Marisol loses 30% of profits and control (board seat); investors expect a high return and exit (AO1, AO2, AO3).',
        f'Context: gearing {sv_gear:.0f}% is already high (so more debt-like commitments such as rent are risky); ROCE {sv_roce:.1f}%; Marisol’s independence and passion (AO2). Sophisticated concepts: gearing, ROCE, opportunity cost, risk and reward (AO3).',
        'Judgement: weigh cost, control and risk; recommendation (e.g. private equity because of gearing, or leaseback for control) must be justified (AO4).'])]

pr_div, pr_sh, pr_pr0, pr_pr1 = 22.5, 150.0, 2.40, 1.80
pr_dps = pr_div / pr_sh
pr_y0, pr_y1 = pr_dps / pr_pr0 * 100, pr_dps / pr_pr1 * 100
pr_mc0, pr_mc1 = pr_pr0 * pr_sh, pr_pr1 * pr_sh

P1_B = case('Source B: Parkline Retail plc', [
    'Parkline Retail plc sells homewares and furniture through 90 out-of-town stores and a website that accounts for 18% of its sales. The company’s sales have been falling as customers buy more online and from consumer-to-consumer (C2C) platforms where used furniture is traded. Its own-label ranges have been successful, but its branded products, supplied by large manufacturers, are heavily discounted by online rivals.',
    'In 2024 Parkline’s share price fell by 25% after the company reported lower profits. Total dividends were maintained at £22.5m. Shareholders have asked the board to explain its strategy. The company has asked a market research agency to estimate the return on its marketing spend, which was £14m in 2024 and produced additional gross profit of £21m.',
    'The directors have two proposals: (1) invest £60m in upgrading the website, delivery and a mobile app, or (2) open 12 smaller “city-centre” stores in cities where Parkline currently has no presence.',
], [('Appendix A: Parkline Retail plc share and marketing data', ['', '2023', '2024'], [['Share price at year end (£)', f'{pr_pr0:.2f}', f'{pr_pr1:.2f}'], ['Number of shares (m)', n(pr_sh), n(pr_sh)], ['Total dividends (£m)', f'{pr_div:.1f}', f'{pr_div:.1f}'], ['Marketing spend (£m)', '', '14.0'], ['Additional gross profit from marketing (£m)', '', '21.0']], None)])

P1_B_Q = [
    Q(6, 'Some of Parkline’s customers buy used furniture on C2C platforms.\nAnalyse one way in which the growth of C2C markets might affect Parkline’s sales.', [
        'C2C market: consumers sell to other consumers, often via an online platform (AO1).',
        'Used furniture on C2C platforms is cheaper than Parkline’s new furniture (AO2).',
        'Some customers substitute used for new → lower demand for Parkline’s products → lower sales and profit; may force price cuts (AO3).']),
    Q(6, 'Parkline’s share price fell by 25% in 2024.\nAnalyse one way in which a fall in the share price might affect Parkline plc.', [
        'Share price and market capitalisation (AO1); share price affects the value of the business and shareholders’ wealth.',
        f'Market capitalisation fell from £{n(pr_mc0)}m to £{n(pr_mc1)}m (AO2).',
        'Lower value → business is more vulnerable to takeover and finds it harder/costlier to raise money by issuing shares; shareholders and directors under pressure to change strategy (AO3).']),
    Q(9, 'Assess whether Parkline plc’s dividend policy is attractive to shareholders.\nCalculate the dividend yield for 2023 and 2024 to support your answer.', [
        f'Quantitative skills: Dividend per share = £{pr_div:.1f}m ÷ {n(pr_sh)}m = £{pr_dps:.2f}; dividend yield = dividend per share ÷ share price × 100 (AO1). 2023: {pr_dps:.2f} ÷ 2.40 × 100 = {pr_y0:.1f}%; 2024: {pr_dps:.2f} ÷ 1.80 × 100 = {pr_y1:.1f}% (AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): the yield rose from {pr_y0:.1f}% to {pr_y1:.1f}% because the share price fell, not because the dividend rose; the dividend is unchanged.',
        'Evaluation (AO3, AO4): a high yield can be attractive but may signal investors expect the dividend to be cut; paying £22.5m while profit falls reduces money for investment; judgement on attractiveness to different shareholders.']),
    Q(9, 'Assess whether Parkline’s marketing spend in 2024 was effective.\nUse the data in Appendix A to calculate the return on marketing spend.', [
        'Quantitative skills: Return on marketing spend = additional gross profit ÷ marketing spend (AO1) = 21.0 ÷ 14.0 = 1.5 (£1.50 for each £1), or net return = (21 − 14) ÷ 14 = 50% (AO2). Own Figure Rule applies.',
        'Interpretation (AO3): marketing generated more gross profit than it cost, so it appears effective.',
        'Evaluation (AO3, AO4): sales were still falling, so it may have prevented larger falls; the estimate comes from an agency/may not isolate other factors; short-term only; judgement.']),
    Q(15, 'Evaluate (1) investing £60m in the website, delivery and app and (2) opening 12 city-centre stores as ways of improving Parkline’s performance and recommend which one it should choose.', [
        'Digital investment: online sales are 18% and growing market share; direct distribution keeps margin, data for personalisation (CRM, analytics), supports multi-channel; high cost, competition from big online rivals, delivery costs and returns of furniture (AO1, AO2, AO3).',
        'City-centre stores: new target markets and brand visibility; smaller stores lower risk; but rents are high, footfall uncertain, and the sales trend is towards online (AO1, AO2, AO3).',
        f'Context: falling share price and sales; dividend of £22.5m limits investment; marketing return 1.5 (AO2). Sophisticated concepts: multi-channel distribution, return on investment, Ansoff, price elasticity (AO3).',
        'Judgement: weigh cost, risk and alignment to customer trends; recommendation must be justified and could combine; challenge the data (AO4).'])]

# ═════════════ PAPER 2 ═════════════
hh_emp = (180, 210); hh_costs = (4.86, 6.30); hh_rev = (19.4, 21.0)
hh_pct = [hh_costs[i] / hh_rev[i] * 100 for i in (0, 1)]

P2_A = case('Source A: Hawthorne Hotels Ltd', [
    'Hawthorne Hotels Ltd owns six boutique hotels in coastal towns. The founder, Edmund Hawthorne, believes that guests come “for the people as much as the rooms”. He is a visible leader, visiting each hotel every month and sharing his vision of “hospitality that feels like family”. Staff say that he inspires them but that he makes final decisions on everything, even the choice of menu items.',
    'The company has a strong culture of customer service, but some hotel managers complain that they have little authority. High season creates large changes in demand and the hotels use temporary and part-time staff. Hawthorne is planning to open two new hotels and needs to recruit and train 30 new staff. Employee turnover is 38% and absenteeism is rising.',
    'The directors are considering two proposals: (1) decentralising decision making by giving hotel managers authority over budgets, menus and recruitment, or (2) a central training academy with standard procedures for all hotels.',
], [('Appendix A: Hawthorne Hotels Ltd employee data', ['', '2023', '2024'], [['Number of employees', f'{hh_emp[0]}', f'{hh_emp[1]}'], ['Employee costs (£m)', f'{hh_costs[0]:.2f}', f'{hh_costs[1]:.2f}'], ['Revenue (£m)', f'{hh_rev[0]:.1f}', f'{hh_rev[1]:.1f}'], ['Employee turnover', '29%', '38%']], None)])

P2_A_Q = [
    Q(6, 'Edmund Hawthorne inspires staff with his vision of “hospitality that feels like family”.\nAnalyse one way in which this transformational leadership might improve Hawthorne Hotels’ performance.', [
        'Transformational leadership: inspires employees with a vision and encourages commitment and innovation (AO1).',
        'Edmund shares his vision and staff say he inspires them (AO2).',
        'Inspired staff are more engaged and provide better service → higher guest satisfaction and repeat bookings → higher revenue and profit (AO3).']),
    Q(6, 'Hawthorne Hotels uses temporary and part-time staff in the high season.\nAnalyse one way in which using temporary staff might help the hotels match their supply to demand.', [
        'Matching supply to demand: ways of coping with seasonal demand include temporary and part-time employment (AO1).',
        'Demand at coastal hotels is highly seasonal (AO2).',
        'Temporary staff can be hired for peak months → increases capacity to serve guests when demand is high without the cost of permanent staff in quiet months → lower labour costs and better service (AO3). Could reduce quality/loyalty.']),
    Q(9, 'Assess whether Hawthorne Hotels’ employee costs are under control.\nCalculate employee costs as a percentage of revenue for 2023 and 2024 to support your answer.', [
        f'Quantitative skills: Employee costs % of revenue = employee costs ÷ revenue × 100 (AO1). 2023: {hh_costs[0]:.2f} ÷ {hh_rev[0]:.1f} × 100 = {hh_pct[0]:.1f}%; 2024: {hh_costs[1]:.2f} ÷ {hh_rev[1]:.1f} × 100 = {hh_pct[1]:.1f}% (AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): employee costs grew by {(hh_costs[1]-hh_costs[0])/hh_costs[0]*100:.0f}% while revenue grew by {(hh_rev[1]-hh_rev[0])/hh_rev[0]*100:.0f}%, so costs rose from {hh_pct[0]:.0f}% to {hh_pct[1]:.0f}% of revenue - not under control.',
        'Evaluation (AO3, AO4): extra staff for new hotels may increase costs before revenue arrives; high turnover adds recruitment costs; hospitality wages are rising; need benchmarks; judgement.']),
    Q(9, 'Assess whether Hawthorne Hotels should decentralise decision making.', [
        'Decentralisation: delegating decisions to managers lower in the hierarchy (AO1).',
        'Managers have little authority; Edmund makes final decisions on everything, including menus (AO2).',
        'Benefits: faster, local decisions, motivation and development of managers (Herzberg: responsibility); relieves Edmund so he can focus on growth; risks: inconsistency of service, loss of control, mistakes (AO3).',
        'Judgement: likely to help as the company grows to eight hotels if standards are protected (AO4).']),
    Q(15, 'Evaluate (1) decentralising decision making and (2) setting up a central training academy with standard procedures as ways of improving performance as Hawthorne grows, and recommend which one to choose.', [
        'Decentralisation: faster decisions, empowerment and retention of managers; local responsiveness; but inconsistent standards and weaker control, need for skilled managers (AO1, AO2, AO3).',
        'Training academy: consistent culture and service, skills for 30 new staff, lower turnover through development; costs, less flexibility and may not address managers’ lack of authority (AO1, AO2, AO3).',
        f'Context: turnover 38%; employee costs {hh_pct[1]:.0f}% of revenue; two new hotels; strong family culture (AO2). Sophisticated concepts: culture, Herzberg/Maslow, delegation, employee costs ratio, leadership styles (AO3).',
        'Judgement: academy supports culture and growth; decentralisation addresses managers’ authority; a phased combination could be recommended but a clear choice is needed (AO4).'])]

rb_cap, rb_out, rb_cost, rb_rev = 2_400_000, 1_860_000, 5_580_000, 8_370_000
rb_util = rb_out / rb_cap * 100
rb_uc = rb_cost / rb_out
rb_up = rb_rev / rb_out

P2_B = case('Source B: Redstone Brewery Ltd', [
    'Redstone Brewery Ltd brews craft beer in a single brewery in the north of England. Demand is highly seasonal: sales peak in summer and in December, and fall by 40% in January and February. The brewery has a fixed number of fermentation tanks, so the maximum number of litres it can produce in a year is limited. It uses part-time and temporary staff in peak months, and rents additional warehouse space at busy times.',
    'Over the past three years demand has risen steadily. During last summer Redstone had to turn away orders from two large supermarkets because it did not have enough capacity. The production manager, Callum Ross, says that “keeping tanks full all year is impossible with this kind of product”. He wants to improve resource utilisation and meet demand more reliably.',
    'The directors are considering two options: (1) outsourcing the production of some of its lower-volume beers to another brewery for the busy months, or (2) investing £1.5m in four new fermentation tanks to increase capacity by 25%.',
], [('Appendix A: Redstone Brewery annual data (litres)', ['', ''], [['Maximum capacity', n(rb_cap)], ['Actual output', n(rb_out)], ['Total costs', f'£{n(rb_cost)}'], ['Total revenue', f'£{n(rb_rev)}']], None)])

P2_B_Q = [
    Q(6, 'Redstone Brewery’s demand is highly seasonal.\nAnalyse one way in which seasonal demand might affect Redstone’s unit costs.', [
        'Seasonal demand: demand that changes at predictable times of the year (AO1); unit cost = total cost ÷ output (AO1).',
        'Sales fall by 40% in January and February but fixed costs of tanks and brewery continue (AO2).',
        'Lower output in off-peak → fixed costs spread over fewer litres → higher unit costs in quiet months → lower profit margin (AO3).']),
    Q(6, 'Redstone Brewery uses part-time and temporary staff in peak months.\nAnalyse one way in which this might affect the quality of its beer.', [
        'Part-time and temporary employment: flexible but less experienced and less committed (AO1).',
        'Redstone is a craft brewer whose reputation depends on quality (AO2).',
        'Temporary staff need training and may make more errors → inconsistent brewing → defective batches, complaints and damage to the craft brand → lower sales (AO3).']),
    Q(9, 'Assess whether Redstone Brewery is making good use of its brewing capacity.\nCalculate the capacity utilisation for the year to support your answer.', [
        f'Quantitative skills: Capacity utilisation = actual output ÷ maximum capacity × 100 (AO1) = {n(rb_out)} ÷ {n(rb_cap)} × 100 = {rb_util:.1f}% (AO2). Own Figure Rule applies.',
        'Interpretation (AO3): about one-fifth of capacity is unused on average, so fixed costs are spread over fewer litres; but in summer the brewery is at full capacity and turned away orders.',
        'Evaluation (AO3, AO4): the annual average hides the seasonal pattern; the problem is seasonal capacity, not total capacity; judgement on whether utilisation is good.']),
    Q(9, 'Assess whether Redstone Brewery’s unit costs suggest that it is operating profitably.\nCalculate the average (unit) cost and average revenue per litre to support your answer.', [
        f'Quantitative skills: Unit cost = total cost ÷ output = £{n(rb_cost)} ÷ {n(rb_out)} = £{rb_uc:.2f} per litre; average revenue = £{n(rb_rev)} ÷ {n(rb_out)} = £{rb_up:.2f} (AO1, AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): profit per litre = £{rb_up-rb_uc:.2f} (a margin of {(rb_up-rb_uc)/rb_up*100:.0f}%); total profit £{n(rb_rev-rb_cost)}.',
        'Evaluation (AO3, AO4): profit would rise with higher capacity utilisation as fixed costs are spread; but unit costs on new tanks would be higher initially; price and costs may change; judgement.']),
    Q(15, 'Evaluate (1) outsourcing production for the busy months and (2) investing £1.5m in four new fermentation tanks as ways of meeting demand and recommend which one Redstone should choose.', [
        'Outsourcing: flexible, no capital investment, meets peak demand and keeps supermarket customers; loses control of quality, higher cost per litre, risk to craft brand, reliance on a partner (AO1, AO2, AO3).',
        f'New tanks: 25% more capacity (about {n(rb_cap*0.25)} litres), economies of scale, control of quality; £1.5m cost, spare capacity in winter (utilisation already only {rb_util:.0f}%), payback depends on demand growth (AO1, AO2, AO3).',
        'Context: demand growing steadily; supermarkets turned away; seasonal pattern; craft reputation (AO2). Sophisticated concepts: capacity utilisation, unit costs, scale (economies/diseconomies), investment appraisal, JIT/inventory management (AO3).',
        'Judgement: weigh flexibility v control; the investment suits steady growth but increases fixed costs in the off-peak; recommendation must be justified (AO4).'])]

# ═════════════ PAPER 3 ═════════════
tt_cost = 70.0
tt_flows = [12.0, 20.0, 24.0, 24.0, 20.0]
tt_df = [0.909, 0.826, 0.751, 0.683, 0.621]
tt_pv = [a * b for a, b in zip(tt_flows, tt_df)]
tt_npv = sum(tt_pv) - tt_cost

P3_A = case('Source A: Terra Textiles plc', [
    'Terra Textiles plc makes sportswear and workwear and sells to retailers in the UK, Europe and the USA. In 2024 an investigation by a newspaper found that one of its suppliers in Bangladesh used child labour. Terra’s annual report had stated that it was “proud of its ethical supply chain” and the company is a member of an industry ethical-trade initiative. The company’s share price fell 12% on the day of the report.',
    'Terra buys cotton in US dollars and sells mostly in sterling and euros. The pound has fallen against the dollar over the last year. A new government has promised tariffs of 10% on imported clothing, which will affect Terra’s sales into the USA. Customers, particularly younger consumers, say they will boycott brands associated with unethical labour.',
    'The board is considering two strategic options: (1) moving production from Bangladesh to Portugal, which has higher labour costs but better labour standards, or (2) keeping production in Bangladesh but investing £70m in factory automation and an independent audit system.',
], [('Appendix A: Forecast extra net cash flows from option 2 (£m)', ['Initial cost', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'], [[f'{tt_cost:.0f}'] + [f'{x:.0f}' for x in tt_flows]], 'Discount factors at 10%: Year 1 0.909; Year 2 0.826; Year 3 0.751; Year 4 0.683; Year 5 0.621.'),
    ('Appendix B: Option 1 — moving to Portugal (fictional estimates)', ['', 'Value'], [['One-off cost of moving', '£95m'], ['Extra annual labour cost', '£18m'], ['Annual saving in transport and tariffs', '£9m'], ['Time to complete', '24 months']], None)])

P3_A_Q = [
    Q(6, 'Terra Textiles’ annual report described its supply chain as “ethical”.\nAnalyse one way in which Terra’s response to the newspaper report might be seen as “greenwashing” or “bluewashing”.', [
        'Greenwashing/bluewashing: misleading claims of environmental/social responsibility for PR rather than genuine action (AO1).',
        'The report claimed pride in an ethical supply chain while a supplier used child labour (AO2).',
        'If Terra only issues statements without audits/changes, stakeholders see it as PR → loss of trust and boycott → lower sales and share price (AO3).']),
    Q(6, 'The pound has fallen against the dollar.\nAnalyse one way in which this might affect Terra Textiles’ costs.', [
        'Depreciation of the pound: £ buys fewer dollars (AO1).',
        'Terra buys cotton in US dollars (AO2).',
        'Imports cost more in pounds → higher production costs → lower profit margins unless prices rise (AO3).']),
    Q(9, 'Assess whether the 10% US tariff on imported clothing is likely to reduce Terra Textiles’ profit.', [
        'Tariff: a tax on imports; protectionism raises prices for foreign buyers (AO1).',
        'Terra sells into the USA; a 10% tariff increases the price of its clothing in the US relative to American producers (AO2, AO3).',
        'Lower demand if price elastic, or lower margin if Terra absorbs the tariff; Terra could respond by producing in the USA or finding other markets (AO3).',
        'Judgement: depends on share of US sales and price elasticity (AO4).']),
    Q(9, 'Assess the likely effect of the supplier scandal on Terra Textiles’ stakeholders.', [
        'Stakeholders: shareholders, customers, employees, suppliers, community; stakeholder v shareholder approach; actions such as boycotts and activism (AO1).',
        'Share price fell 12%; younger consumers threaten boycotts (AO2, AO3).',
        'Shareholders lose value; customers may switch; workers in Bangladesh may lose work if Terra leaves; Terra’s reputation and employees’ morale (AO3).',
        'Judgement on which stakeholders are most affected and how Terra should respond (AO4).']),
    Q(15, 'Evaluate (1) moving production to Portugal and (2) automating the Bangladesh factory with an independent audit system as strategies for Terra Textiles and recommend which one it should choose.\nCalculate the net present value of option 2 to support your answer.', [
        f'Quantitative skills: NPV = Σ(cash flow × discount factor) − initial cost (AO1). PVs: 12 × 0.909 = {tt_pv[0]:.1f}; 20 × 0.826 = {tt_pv[1]:.1f}; 24 × 0.751 = {tt_pv[2]:.1f}; 24 × 0.683 = {tt_pv[3]:.1f}; 20 × 0.621 = {tt_pv[4]:.1f}; total {sum(tt_pv):.1f}; NPV = £{tt_npv:.1f}m (AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): NPV is {"positive" if tt_npv > 0 else "negative"}: the investment {"returns more than its cost in present value terms" if tt_npv > 0 else "does not cover its cost"}; payback is about 3.6 years (cumulative 12, 32, 56, 80 → £14m of year 4’s £24m needed).',
        'Option 1: better labour standards, supports reputation and lowers tariff and transport costs (£9m saving) but £95m cost and £18m extra labour a year (net −£9m a year), 24-month delay, redundancies in Bangladesh (AO2, AO3).',
        'Option 2: improves productivity and transparency, keeps low-cost production and jobs; audit may not remove all risk, tariffs and exchange rate risk remain, automation reduces jobs (AO2, AO3).',
        'Judgement: weigh financial return, ethical risk and speed; sophisticated concepts: ESG, stakeholder approach, global strategy (off-shoring/re-shoring), investment appraisal; challenge the data (AO4).'])]

P3_B = case('Source B: Lakeside Telecom plc', [
    'Lakeside Telecom plc provides mobile and broadband services to 4 million UK customers. Its mobile network is old and customers complain about coverage. Smaller competitors using the latest technology have entered the market and a large technology company has launched a satellite-based service in rural areas. Lakeside’s market share has fallen from 18% to 14%.',
    'The chief executive, Imran Sheikh, wants to transform the company by adopting AI to manage the network and handle customer calls, which would reduce the workforce by 1 500 of 9 000 employees. Trade unions have said that they will oppose the cuts and may strike. A group of institutional shareholders has said that it will support the plan only if there is a clear plan to protect customer service. The company’s culture is described as cautious and hierarchical.',
    'The board is considering (1) forming a joint venture with a global technology company to build a new network and provide AI services, or (2) building the new network and AI capability itself through organic growth.',
], [('Appendix A: Lakeside Telecom plc data', ['', '2022', '2024'], [['Market share', '18%', '14%'], ['Customer satisfaction', '74%', '61%'], ['Employees', '9 000', '9 000'], ['Annual revenue (£bn)', '3.2', '2.9']], None)])

P3_B_Q = [
    Q(6, 'Lakeside Telecom is planning to use AI to manage its network and handle customer calls.\nAnalyse one way in which AI might improve Lakeside’s competitiveness.', [
        'AI: technology that can analyse data and automate tasks; digital technology in operations/marketing (AO1).',
        'Lakeside’s network is old, customers complain about coverage and calls (AO2).',
        'AI predicts faults and automates calls → faster response and lower costs → improved service and lower prices/higher margins → better competitiveness (AO3).']),
    Q(6, 'Trade unions have said that they will oppose the job cuts at Lakeside Telecom.\nAnalyse one way in which opposition from trade unions might affect the success of Lakeside’s strategy.', [
        'Resistance to change: reasons include self-interest and misunderstanding (Kotter and Schlesinger); trade unions as collective representation (AO1).',
        '1 500 of 9 000 jobs might be cut; unions may strike (AO2).',
        'Industrial action disrupts service → customer satisfaction falls further; delays implementation; morale falls → strategy fails or costs more (AO3).']),
    Q(9, 'Assess whether Lakeside Telecom’s external environment is more of a threat than an opportunity.', [
        'External environment: technological change (AI, disruptive technologies), competition (Porter’s five forces), economic and social factors (AO1).',
        'Threats: new entrants, satellite service (substitutes), customer expectations; share fell from 18% to 14% (AO2, AO3).',
        'Opportunities: AI and new network technology can lower costs and improve service; demand for data is growing (AO3).',
        'Judgement: mostly a threat if Lakeside does not respond, but opportunities exist for firms that adapt (AO4).']),
    Q(9, 'Assess whether Lewin’s force field analysis suggests that Lakeside Telecom can successfully introduce the new strategy.', [
        'Lewin’s force field: change succeeds when driving forces exceed restraining forces (AO1).',
        'Driving forces: falling market share and satisfaction, new competitors, technology, shareholder pressure; restraining forces: union opposition, cautious hierarchical culture, fear of job losses, cost (AO2, AO3).',
        'To succeed: strengthen drivers (communicate urgency), weaken restrainers (consult unions, retrain, protect service) (AO3).',
        'Judgement: restraining forces are strong but manageable with leadership and communication (AO4).']),
    Q(15, 'Evaluate (1) forming a joint venture with a global technology company and (2) building the new network and AI capability itself, and recommend which one Lakeside should choose.', [
        'Joint venture: shares cost, risk and expertise, speeds up the transformation; loses some control and profit, culture clash, dependence on partner (AO1, AO2, AO3).',
        'Organic (internal) growth: full control and profit, builds own capability; slower, expensive, high risk given Lakeside’s cautious culture and declining share and revenue (AO1, AO2, AO3).',
        'Context: market share 18% → 14%; customer satisfaction 61%; union opposition; shareholders’ conditions (AO2). Sophisticated concepts: Lewin, Kotter and Schlesinger, strategic drift, Porter’s five forces, risk management, stakeholder power/interest (AO3).',
        'Judgement: weigh speed, risk and control; the joint venture is likely faster but must protect customer service and stakeholders; recommendation with justification (AO4).'])]


def papers():
    return [paper('c', 1, SET, P1_A, P1_A_Q, P1_B, P1_B_Q), paper('c', 2, SET, P2_A, P2_A_Q, P2_B, P2_B_Q), paper('c', 3, SET, P3_A, P3_A_Q, P3_B, P3_B_Q)]
