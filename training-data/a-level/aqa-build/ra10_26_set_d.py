"""RA10 practice Set D (AQA 7138 format)."""
from ra10_26_lib import case, Q, paper

SET = 'D'


def n(x, d=0):
    return f'{x:,.{d}f}'


# ═════════════ PAPER 1 ═════════════
zb_s, zb_m = (9.0, 11.2), (180.0, 214.0)
zb_sh = [zb_s[i] / zb_m[i] * 100 for i in (0, 1)]
zb_sg = (zb_s[1] - zb_s[0]) / zb_s[0] * 100
zb_mg = (zb_m[1] - zb_m[0]) / zb_m[0] * 100

P1_A = case('Source A: Zenith Bikes Ltd', [
    'Zenith Bikes Ltd designs electric bicycles for city commuters and sells them to cycle shops. It plans to launch a new model, the Z9, which has a battery that lasts twice as long as rivals’ and is 30% lighter. Zenith’s sales director, Ola Brandt, believes the Z9 could become a market leader. Zenith has spent £3.2m developing the Z9 over four years.',
    'Zenith commissioned a survey of 300 cycle-shop customers in two cities. The survey used a convenience sample (customers who were in the shop on a Saturday). It found that 64% would “definitely” or “probably” buy a Z9 at £2 400, but the sample was mainly men aged 30 to 50. The UK e-bike market is growing at 12% a year, and the average e-bike sells for £1 650. Zenith’s existing models are in the maturity stage of the product life cycle.',
    'Zenith’s directors are considering two pricing strategies for the Z9: (1) price skimming at £2 400, aiming for early adopters and high margins, or (2) penetration pricing at £1 800 to win market share quickly.',
], [('Appendix A: Zenith Bikes Ltd and the UK e-bike market (£m)', ['', '2023', '2024'], [['Zenith sales', f'{zb_s[0]:.1f}', f'{zb_s[1]:.1f}'], ['UK e-bike market sales', f'{zb_m[0]:.0f}', f'{zb_m[1]:.0f}']], None)])

P1_A_Q = [
    Q(6, 'Zenith Bikes’ survey used a convenience sample of customers in cycle shops on a Saturday.\nAnalyse one way in which this might affect the reliability of Zenith’s market research.', [
        'Sampling methods: random, stratified, quota; convenience samples are not random and may not represent the target market (AO1).',
        'The sample was mainly men aged 30 to 50 in cycle shops on Saturdays, but Zenith’s target market is commuters of all ages (AO2).',
        'Biased sample → results overstate demand among groups that were not surveyed → inaccurate sales forecasts → Zenith may over-produce or set the wrong price (AO3).']),
    Q(6, 'Zenith’s existing models are in the maturity stage of the product life cycle.\nAnalyse one way in which an extension strategy might help Zenith’s existing models.', [
        'Product life cycle: introduction, growth, maturity, decline; extension strategies include advertising, rebranding, lowering price, adapting the product (AO1).',
        'Existing e-bike models face a growing market but strong competition (AO2).',
        'Adapting the product (e.g. new colours or better battery) or lower prices may renew interest → sales stay up for longer → delays the decline and keeps cash flowing to fund the Z9 (AO3).']),
    Q(9, 'Assess whether Zenith Bikes has performed better than the UK e-bike market.\nCalculate Zenith’s market share for 2023 and 2024 to support your answer.', [
        f'Quantitative skills: Market share = Zenith sales ÷ market sales × 100 (AO1). 2023: 9.0 ÷ 180 × 100 = {zb_sh[0]:.1f}%; 2024: 11.2 ÷ 214 × 100 = {zb_sh[1]:.1f}% (AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): sales grew {zb_sg:.1f}% while the market grew {zb_mg:.1f}%, so share rose from {zb_sh[0]:.1f}% to {zb_sh[1]:.1f}%.',
        'Evaluation (AO3, AO4): Zenith is outperforming the market, but its share is small, the figures cover two years, and competitors with bigger budgets may respond; the market growth quoted (12%) differs from the data (about 19%) - the source needs checking.']),
    Q(9, 'Assess whether Zenith Bikes should use price skimming for the Z9.', [
        'Price skimming: high initial price to earn high margins from early adopters, then lower later (AO1).',
        'The Z9 has distinctive features (longer battery, lighter); survey shows 64% interest at £2 400 though the sample is biased; average e-bike price is £1 650 (AO2). High margins help recover £3.2m development cost (AO3).',
        'Against: £2 400 is 45% above average price; sales volume may be low and rivals may copy features; PED unknown (AO3).',
        'Judgement: viable if the product is truly differentiated and the target market is price-inelastic (AO4).']),
    Q(15, 'Evaluate (1) price skimming at £2 400 and (2) penetration pricing at £1 800 as ways of launching the Z9 and recommend which one Zenith should choose.', [
        'Skimming: high unit margin (about £600 more per bike), recovers development costs, premium image; lower volumes, slower share growth, risk of attracting rival imitations; depends on price inelastic demand (AO1, AO2, AO3).',
        'Penetration: wins share quickly in a growing market (12%+ a year), builds brand and economies of scale; low margins may not recover £3.2m quickly and customers may see the Z9 as less premium; hard to raise prices later (AO1, AO2, AO3).',
        'Context: product differentiation, maturity of existing models, survey bias, market growth (AO2). Sophisticated concepts: PED, product life cycle, Boston Matrix (Z9 as question mark/star), break-even (AO3).',
        'Judgement: weigh profit v share; skimming is appropriate if the features are unique and demand inelastic; recommendation with justification; challenge survey data (AO4).'])]

mm_bud, mm_act = 1_900_000, 2_140_000
mm_var = mm_act - mm_bud
mm_pct = mm_var / mm_bud * 100
mm_cf = [60, 38, 44]
mm_out = [102, 96, 94]
mm_in = [88, 99, 90]
mm_open = 60
mm_close = []
_b = mm_open
for i, o in zip(mm_in, mm_out):
    _b += i - o
    mm_close.append(_b)

P1_B = case('Source B: Maple & Main Bakery plc', [
    'Maple & Main Bakery plc is a UK bakery chain with 120 shops which sells bread, pastries and sandwiches. Its shares are listed on the stock exchange. In 2024 the company missed its profit target because wheat and energy prices increased. The finance director, Bryony Walsh, has said that she will use zero-based budgeting from next year to cut costs.',
    'Maple & Main’s customers include commuters, local residents and business customers. A number of stakeholders are concerned about the company’s plans: staff worry about the shop closures that might follow, suppliers have been asked to accept longer payment terms (90 days instead of 30), and the local councils where it operates want the company to continue supporting community events.',
    'The company is short of cash and is considering two ways to improve its cash flow: (1) using a debt factoring company to receive 85% of the value of invoices to its business customers immediately, or (2) asking suppliers to accept 90 days’ credit terms.',
], [('Appendix A: Ingredient costs budget and cash flow forecast', ['', 'Budget', 'Actual'], [['Ingredient costs, 2024 (£)', n(mm_bud), n(mm_act)]], 'Cash flow forecast (£000): opening balance £60 in January; inflows £88, £99, £90 for January–March; outflows £102, £96, £94 for January–March.')])

P1_B_Q = [
    Q(6, 'Suppliers have been asked to accept 90 days instead of 30 days to be paid.\nAnalyse one way in which this might affect the relationship between Maple & Main and its suppliers.', [
        'Payment terms and trade credit; ethics in finance (payment terms for suppliers) (AO1).',
        'Longer terms from 30 to 90 days delay suppliers’ cash inflows (AO2).',
        'Small suppliers may face cash flow problems → resent the change, raise prices, reduce priority or stop supplying → risk to Maple & Main’s supply and reputation (AO3). Benefit: improves Maple & Main’s cash flow.']),
    Q(6, 'Bryony Walsh will use zero-based budgeting next year.\nAnalyse one way in which zero-based budgeting might help Maple & Main to control its costs.', [
        'Zero-based budgeting: every item of expenditure must be justified from zero each period (AO1).',
        'Costs of wheat, energy and shops rose in 2024 (AO2).',
        'Managers must justify each cost → unnecessary or inefficient spending is identified and cut → lower costs and higher profit (AO3). Takes time and may cut useful spending.']),
    Q(9, 'Assess whether Maple & Main’s ingredient cost performance in 2024 was a problem.\nCalculate the variance and say whether it is adverse or favourable.', [
        f'Quantitative skills: Variance = actual − budget = £{n(mm_act)} − £{n(mm_bud)} = £{n(mm_var)} (AO1, AO2); {mm_pct:.1f}% of budget; adverse variance because costs were higher than budgeted (AO2). Own Figure Rule applies.',
        'Interpretation (AO3): an adverse variance of this size reduces profit by the same amount unless offset; ingredient prices rose.',
        'Evaluation (AO3, AO4): external causes (wheat prices) are outside management control; the budget may have been unrealistic; need other variances; judgement on whether it is a serious problem.']),
    Q(9, 'Assess whether Maple & Main will have enough cash over the three months of the forecast.\nComplete the closing balances in Appendix A to support your answer.', [
        f'Quantitative skills: closing balances (£000): January 60 + 88 − 102 = {mm_close[0]}; February {mm_close[0]} + 99 − 96 = {mm_close[1]}; March {mm_close[1]} + 90 − 94 = {mm_close[2]} (AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): the lowest balance is £{min(mm_close)}k in January/March with a small buffer; cash is positive but outflows exceed inflows in two of three months.',
        'Evaluation (AO3, AO4): forecast is an estimate; seasonal and ingredient prices; limited buffer; need receivables, payables and other data; judgement.']),
    Q(15, 'Evaluate (1) debt factoring and (2) extending supplier payment terms to 90 days as ways of improving Maple & Main’s cash flow and recommend which one it should choose.', [
        'Debt factoring: immediate cash (85% of invoices), reduces risk of bad debts; fee reduces profit, customers may see the business as financially weak; relates only to business customers (AO1, AO2, AO3).',
        'Supplier terms: free (no interest) and improves payables days; damages supplier relationships, risk of higher prices or supply disruption, ethical concerns (AO1, AO2, AO3).',
        'Context: stakeholders (suppliers, employees) are already concerned; margin pressure; small cash buffer (AO2). Sophisticated concepts: working capital, receivables/payables days, ethics in finance, stakeholder power and interest (AO3).',
        'Judgement: weigh cost, speed and relationships; recommendation e.g. factoring because cost is known and avoids damaging suppliers, or extended terms if relationships are strong; justified (AO4).'])]

# ═════════════ PAPER 2 ═════════════
br_emp, br_sales = (120, 135), (24.0, 25.9)
br_sp = [br_sales[i] * 1_000_000 / br_emp[i] for i in (0, 1)]

P2_A = case('Source A: Brightside Education Ltd', [
    'Brightside Education Ltd sells online tutoring and learning software to schools. It employs software developers, sales staff and tutors. Most employees work from home for three days a week. The company has grown quickly and the founder, Hamid Rahimi, has recruited 15 new staff in the past year.',
    'Project teams at Brightside include developers, designers and sales managers. A recent review found that some teams work well together but others have unclear goals, change membership frequently and have little access to the resources they need. Employees say that “nobody tells us how our work fits the company’s strategy”. Sales staff are paid commission on contracts won while developers and tutors are paid fixed salaries; this has caused resentment in some teams.',
    'Hamid is considering two ways of improving team effectiveness and performance: (1) introducing team-based rewards and clearer team goals, or (2) investing in leadership development and coaching for team leaders.',
], [('Appendix A: Brightside Education Ltd data', ['', '2023', '2024'], [['Number of employees', f'{br_emp[0]}', f'{br_emp[1]}'], ['Revenue (£m)', f'{br_sales[0]:.1f}', f'{br_sales[1]:.1f}'], ['Employee satisfaction', '72%', '58%'], ['Projects delivered late', '12%', '27%']], None)])

P2_A_Q = [
    Q(6, 'Some project teams at Brightside Education have unclear goals.\nAnalyse one way in which Hackman’s model of team effectiveness might explain why these teams are less effective.', [
        'Hackman: effective teams need a compelling direction, enabling structure, supportive context and expert coaching (AO1).',
        'Teams have unclear goals and change membership frequently (AO2).',
        'Without a compelling direction and stable structure, members do not know what to focus on → duplicated or missed work → delays and poorer quality → projects delivered late (27%) (AO3).']),
    Q(6, 'Brightside’s sales staff are paid commission while developers are paid fixed salaries.\nAnalyse one way in which this difference in reward methods might affect teamwork.', [
        'Commission: pay linked to sales; salary: fixed pay; financial rewards (AO1).',
        'Sales and developers work in the same project teams (AO2).',
        'Sales staff may over-promise to win contracts; developers feel that pay is unfair → conflict, lower motivation and cooperation → poorer teamwork and delayed projects (AO3).']),
    Q(9, 'Assess whether Brightside Education’s workforce has become more productive.\nCalculate revenue per employee (labour productivity) for 2023 and 2024 to support your answer.', [
        f'Quantitative skills: Labour productivity (sales per employee) = revenue ÷ number of employees (AO1). 2023: £{n(br_sales[0]*1e6)} ÷ {br_emp[0]} = £{n(br_sp[0])}; 2024: £{n(br_sales[1]*1e6)} ÷ {br_emp[1]} = £{n(br_sp[1])} (AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): productivity {"rose" if br_sp[1] > br_sp[0] else "fell"} from £{n(br_sp[0])} to £{n(br_sp[1])} ({(br_sp[1]-br_sp[0])/br_sp[0]*100:.0f}%) - revenue grew {(br_sales[1]-br_sales[0])/br_sales[0]*100:.1f}% and staff grew {(br_emp[1]-br_emp[0])/br_emp[0]*100:.1f}%.',
        'Evaluation (AO3, AO4): the measure ignores quality: late projects rose to 27% and satisfaction fell to 58%; new staff take time to become productive; hybrid working may affect results; judgement.']),
    Q(9, 'Assess whether remote and hybrid working is likely to be beneficial for Brightside Education.', [
        'Remote, hybrid and flexible working as a non-financial reward (AO1).',
        'Brightside’s staff work from home three days a week (AO2). Benefits: lower office costs, wider recruitment, flexibility and motivation (AO3).',
        'Risks: weaker teamwork, communication and culture; difficulties for new staff and monitoring; employee satisfaction fell from 72% to 58% (AO3).',
        'Judgement: depends on the nature of work and how well teams are managed (AO4).']),
    Q(15, 'Evaluate (1) team-based rewards and clearer team goals and (2) leadership development and coaching for team leaders as ways of improving performance at Brightside, and recommend which one Hamid should choose.', [
        'Team rewards and goals: aligns effort, reduces resentment between commission and salary groups, creates a compelling direction (Hackman); risk of free-riding, cost, difficulty measuring team output (AO1, AO2, AO3).',
        'Leadership development and coaching: improves coaching and structure; transformational leadership could inspire; builds retention; time and cost, results slow, may not fix unfair pay (AO1, AO2, AO3).',
        'Context: late projects 27%; satisfaction 58%; remote working; fast growth (AO2). Sophisticated concepts: Hackman, Herzberg, Maslow, transformational leadership, employee costs, talent development (AO3).',
        'Judgement: weigh immediate impact on goals and motivation; recommendation justified, possibly sequencing both (AO4).'])]

ic_flows = [(7, 4), (3, 6)]
ic_out, ic_cap = 5400, 6500
ic_ut = ic_out / ic_cap * 100

P2_B = case('Source B: Ironclad Engineering plc', [
    'Ironclad Engineering plc makes precision parts for aircraft engines. It makes most components in its own factories but buys some parts from outside suppliers. A single supplier in Eastern Europe provides a specialised alloy; a fire at the supplier’s factory in 2024 caused a six-week shortage, forcing Ironclad to stop one production line. Ironclad operates a Just in Time system for alloys to keep inventory costs low.',
    'The company invests heavily in research and development (R&D), and its patents protect its precision-casting process. A group of its engineers has said that they want to set up their own firm, and the company has started a programme encouraging staff to develop new ideas within the company (intrapreneurship). An environmental audit of Ironclad’s factories found that 22% of the raw material is wasted as scrap, which is not currently recycled.',
    'The operations director, Sofia Marek, is considering two options: (1) bringing production of the specialised alloy in-house by building a new foundry (£12m), or (2) developing a second supplier in Asia and holding larger inventories of the alloy (Just in Case).',
], [('Appendix A: Project to build the new foundry: activities (months)', ['Activity', 'Duration', 'Must follow'], [['A  Planning permission', '3', '–'], ['B  Design foundry', '4', '–'], ['C  Build foundry', '8', 'A, B'], ['D  Buy equipment', '2', 'B'], ['E  Install equipment', '3', 'C, D'], ['F  Recruit and train staff', '5', 'B']], f'Factory output: {n(ic_out)} parts per month; maximum capacity {n(ic_cap)} parts per month.')])

P2_B_Q = [
    Q(6, 'Ironclad Engineering uses Just in Time for specialised alloys.\nAnalyse one way in which the fire at the supplier’s factory shows a disadvantage of Just in Time.', [
        'Just in Time: holds minimal inventory and orders parts as needed; risk of stock-outs (AO1).',
        'The six-week shortage forced Ironclad to stop one production line (AO2).',
        'No inventory buffer → production stopped → lost output and late deliveries to aircraft-engine customers → lost revenue and risk of penalties and damaged reputation (AO3).']),
    Q(6, 'Ironclad’s patents protect its precision-casting process.\nAnalyse one way in which patents might help Ironclad’s competitiveness.', [
        'Patent: legal protection of an invention for a period, preventing copying (AO1).',
        'Ironclad invests heavily in R&D (AO2).',
        'Rivals cannot copy the process without permission → Ironclad keeps differentiation and can charge higher prices or earn licence income → higher profit and return on R&D (AO3).']),
    Q(9, 'Assess whether Ironclad Engineering is making good use of its production capacity.\nCalculate capacity utilisation to support your answer.', [
        f'Quantitative skills: Capacity utilisation = actual output ÷ maximum capacity × 100 (AO1) = {n(ic_out)} ÷ {n(ic_cap)} × 100 = {ic_ut:.1f}% (AO2). Own Figure Rule applies.',
        'Interpretation (AO3): about 17% of capacity is unused, so fixed costs are spread over fewer parts; but the shutdown after the fire may have reduced output.',
        'Evaluation (AO3, AO4): spare capacity allows flexibility for orders; the six-week stoppage may explain the shortfall; benchmarks and trend data needed; judgement.']),
    Q(9, 'Assess whether the new foundry could be completed within 14 months.\nDetermine the critical path and project duration from Appendix A.', [
        'Paths: A (3) → C (8) → E (3) = 14; B (4) → C (8) → E (3) = 15; B (4) → D (2) → E (3) = 9; B (4) → F (5) = 9. Earliest start of C = max(A 3, B 4) = 4, so C ends month 12; E starts month 12 and ends month 15. Critical path B, C, E = 15 months (AO1, AO2). Float: A has 1 month; D has 6 months; F has 6 months (AO2). Own Figure Rule applies.',
        'Interpretation (AO3): the project takes 15 months, not 14; any delay to B, C or E delays the project.',
        'Evaluation (AO3, AO4): the estimates are uncertain; planning permission could be delayed; Ironclad can speed C by adding resources; the foundry would not be ready before the next shortage; judgement.']),
    Q(15, 'Evaluate (1) building the new foundry in-house and (2) developing a second overseas supplier and holding larger inventories as ways of improving security of supply, and recommend which one Ironclad should choose.', [
        'In-house foundry: control of quality and supply, protects IP, potential scrap recycling and cost savings; £12m cost, 15 months to build, fixed costs and diseconomies, risk of under-use (AO1, AO2, AO3).',
        'Second supplier plus inventory: faster, lower investment, reduces dependence on one supplier (supply chain diversification); higher inventory costs, transport and ethical/quality audit issues, less control (AO1, AO2, AO3).',
        f'Context: fire caused a six-week stoppage; capacity utilisation {ic_ut:.0f}%; Just in Time; engineers’ innovation; customers require reliability (AO2). Sophisticated concepts: JIT v JIC, make v buy, supply chain management, network analysis, investment appraisal (AO3).',
        'Judgement: weigh speed, cost and control; the second supplier is quicker and cheaper but the foundry gives long-term security; recommendation must be justified (AO4).'])]

# ═════════════ PAPER 3 ═════════════
so_cost = 36.0
so_flows = [8.0, 11.0, 13.0, 13.0, 11.0]
so_df = [0.909, 0.826, 0.751, 0.683, 0.621]
so_pv = [a * b for a, b in zip(so_flows, so_df)]
so_npv = sum(so_pv) - so_cost

P3_A = case('Source A: Solis Solar plc', [
    'Solis Solar plc installs rooftop solar panels on homes and businesses in the UK. Its sales boomed when the government offered grants and when energy prices rose, but sales fell by 20% in 2024 when the grants were withdrawn and interest rates rose, making finance more expensive for customers. The company employs 1 200 installers, many of whom would be difficult to replace.',
    'Solis faces strong competition from low-priced imports of panels from Asia. The government has announced an aim to produce all UK electricity from clean sources by 2035 and plans to introduce a requirement for new homes to have solar panels. The company’s chief executive, Beatrice Lang, sees a growing opportunity in battery storage and has been approached by an American battery company about a licensing deal.',
    'The board is considering two strategic options: (1) market development: expanding into Ireland and the Netherlands with its current solar installation service, or (2) new product development: launching a battery storage installation service in the UK.',
], [('Appendix A: Forecast net cash flows from the battery storage option (£m)', ['Initial cost', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'], [[f'{so_cost:.0f}'] + [f'{x:.0f}' for x in so_flows]], 'Discount factors at 10%: Year 1 0.909; Year 2 0.826; Year 3 0.751; Year 4 0.683; Year 5 0.621.'),
    ('Appendix B: Expansion into Ireland and the Netherlands (fictional estimates)', ['', 'Value'], [['Investment', '£20m'], ['Forecast annual profit from year 2', '£5m'], ['Main risks', 'Different regulations, exchange rate risk, local competition']], None)])

P3_A_Q = [
    Q(6, 'The government withdrew grants for solar panels in 2024.\nAnalyse one way in which this change in government policy might affect Solis Solar’s sales.', [
        'Government policy: grants/subsidies lower the cost for customers; their removal raises the price (AO1).',
        'Sales fell by 20% after grants were withdrawn (AO2).',
        'Higher net price for customers → demand falls (price elastic) → lower sales and revenue → Solis may have excess installers and lower profit (AO3).']),
    Q(6, 'Interest rates have risen in the UK.\nAnalyse one way in which higher interest rates might affect Solis Solar’s costs and demand.', [
        'Interest rates: cost of borrowing and reward for saving (AO1).',
        'Customers use loans to pay for solar installation; Solis may have borrowed to fund growth (AO2).',
        'Higher rates → loans dearer → fewer customers can afford panels → lower demand; Solis’s own borrowing costs rise → lower profit (AO3).']),
    Q(9, 'Assess whether the government’s clean-electricity target is more of an opportunity than a threat to Solis Solar.', [
        'Political and legal environment: government targets and regulation can create demand (AO1).',
        'Requirement for new homes to have solar panels would increase demand; battery storage is a growing market (AO2, AO3).',
        'Threat: uncertainty about government policy, cheap imports, competitors benefiting equally (AO3).',
        'Judgement: likely to be an opportunity if Solis can compete on price and quality, but depends on government consistency (AO4).']),
    Q(9, 'Assess the effect of low-priced imports of solar panels from Asia on Solis Solar.', [
        'Competitive environment: rivalry and substitute/entry threats; import prices (AO1).',
        'Solis competes with low-cost Asian panels; customers compare prices (AO2).',
        'Price pressure → lower margins or lost sales → Solis may need to cut costs, differentiate on installation quality or sell different products (AO3).',
        'Judgement: serious threat to margins but installation service and local brand offer protection (AO4).']),
    Q(15, 'Evaluate (1) expanding into Ireland and the Netherlands and (2) launching a battery storage installation service as strategies for Solis Solar and recommend which one it should choose.\nCalculate the net present value of the battery storage option to support your answer.', [
        f'Quantitative skills: NPV = Σ(cash flow × discount factor) − initial cost (AO1). PVs: 8 × 0.909 = {so_pv[0]:.1f}; 11 × 0.826 = {so_pv[1]:.1f}; 13 × 0.751 = {so_pv[2]:.1f}; 13 × 0.683 = {so_pv[3]:.1f}; 11 × 0.621 = {so_pv[4]:.1f}; total {sum(so_pv):.1f}; NPV = £{so_npv:.1f}m (AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): NPV is {"positive" if so_npv > 0 else "negative"}; payback = 3 years + (36 − 32)/13 = 3.3 years; ARR = ((56 − 36) ÷ 5) ÷ 36 = 11.1%.',
        'Market development: £20m cost, £5m annual profit from year 2 (payback 4 years from year 2 start = 5 years); spreads risk across markets, uses existing skills; regulations, exchange rate risk and local competition (AO2, AO3).',
        'New product development: uses existing installers and customers, new demand from solar owners and government targets; needs licensing deal, technical skills and investment, technology risk (AO2, AO3).',
        'Judgement: weigh return, risk and fit with strategy and the declining core market; recommendation must be justified; challenge fictional estimates (AO4).'])]

P3_B = case('Source B: Vega Foods plc', [
    'Vega Foods plc is a UK food producer making breakfast cereals, snacks and plant-based foods. It is a mid-sized business with 3 400 employees and has grown by acquiring smaller companies. Its latest acquisition, Nutri Bars Ltd, was bought for £85m in 2023, but integration has been difficult: Nutri’s managers say that the company’s culture is “completely different”.',
    'In 2024 a batch of Vega’s snack bars was found to contain undeclared nuts and was recalled, which cost the company £6m and led to an investigation by the Food Standards Agency. The company had no crisis management plan. Critics said that it had grown too quickly. Vega’s sustainability report claims that 100% of its palm oil is “sustainable”, but an activist group has argued that this is not independently verified.',
    'Vega’s board is considering two ways of moving forward: (1) a further acquisition, buying a large plant-based dairy company, Oatly Fields, for £140m, or (2) a period of organic growth and consolidation, improving integration, quality systems and sustainability reporting.',
], [('Appendix A: Vega Foods plc data', ['', '2022', '2023', '2024'], [['Revenue (£m)', '410', '480', '505'], ['Operating profit (£m)', '52', '58', '36'], ['Number of acquisitions in the year', '1', '2', '1'], ['Product recalls', '0', '0', '1']], None)])

P3_B_Q = [
    Q(6, 'Vega Foods recalled a batch of snack bars containing undeclared nuts.\nAnalyse one way in which a product recall might affect Vega’s reputation.', [
        'Reputational risk and product safety (ethics in operations); recall costs (AO1).',
        'The recall cost £6m and led to a Food Standards Agency investigation (AO2).',
        'Customers lose trust → switch to rivals and retailers may delist products → lower sales and profit; negative publicity (AO3).']),
    Q(6, 'Vega Foods has grown by acquiring other companies.\nAnalyse one challenge Vega has faced in integrating Nutri Bars Ltd.', [
        'External growth: acquisitions can create synergy but also challenges such as culture clash, diseconomies of scale (AO1).',
        'Nutri’s managers say the culture is “completely different” (AO2).',
        'Culture clash → low morale, resistance, managers leave → duplication and poor communication → costs rise and expected synergies are not achieved (AO3).']),
    Q(9, 'Assess whether Vega’s growth strategy has been successful.', [
        'Growth, economies of scale, synergy and diseconomies; acquisition v organic growth (AO1).',
        'Revenue grew from £410m to £505m (23%), but operating profit fell from £58m to £36m, margin from 12.1% to 7.1%; recall and integration costs (AO2, AO3).',
        'Evidence of diseconomies (control and coordination) and risk from rapid growth (AO3).',
        'Judgement: growth has increased size but not profitability; not successful so far (AO4).']),
    Q(9, 'Assess whether the sustainability claim in Vega’s report is likely to damage the company.', [
        'Greenwashing: misleading claims; ESG reporting and independent verification; activism (AO1).',
        'The claim that 100% of palm oil is sustainable is not independently verified; activists have challenged it (AO2).',
        'If proved false → loss of trust, boycotts, regulators, investor concern (AO3). If supported by audits → strengthens brand (AO3).',
        'Judgement: risk is high unless Vega verifies claims (AO4).']),
    Q(15, 'Evaluate (1) acquiring Oatly Fields for £140m and (2) a period of organic growth and consolidation as strategies for Vega Foods and recommend which one it should choose.', [
        'Acquisition: fast entry to plant-based dairy (growing market), synergies and economies of scale; £140m cost (about 4 times operating profit), integration problems from Nutri, culture clash, no crisis management, gearing/finance risk (AO1, AO2, AO3).',
        'Consolidation: improves integration, quality control and sustainability reporting, lower risk, lower cost; slower growth, risk of missing market opportunities and competitors moving ahead (AO1, AO2, AO3).',
        'Context: operating profit fell from £58m to £36m; recall; weak crisis plan; sustainability challenges (AO2). Sophisticated concepts: Ansoff, economies/diseconomies of scale, risk management, ESG, stakeholder approach, Lewin (AO3).',
        'Judgement: weigh growth v risk; given weak integration and risk management, consolidation looks wise; but the market opportunity matters; recommendation with reasoning (AO4).'])]


def papers():
    return [paper('d', 1, SET, P1_A, P1_A_Q, P1_B, P1_B_Q), paper('d', 2, SET, P2_A, P2_A_Q, P2_B, P2_B_Q), paper('d', 3, SET, P3_A, P3_A_Q, P3_B, P3_B_Q)]
