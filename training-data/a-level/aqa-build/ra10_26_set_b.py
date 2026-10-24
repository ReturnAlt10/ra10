"""RA10 practice Set B (AQA 7138 format). Computed numbers are inserted with f-strings."""
from ra10_26_lib import case, Q, paper

SET = 'B'


def n(x, d=0):
    return f'{x:,.{d}f}'


# ═════════════ PAPER 1 · Unit 3.1 ═════════════
# Case A: Tandem Tea Co-operative
tt_fc, tt_price, tt_vc, tt_out = 96_000, 8.0, 3.2, 26_000
tt_c = tt_price - tt_vc
tt_bep = tt_fc / tt_c
tt_mos = tt_out - tt_bep
tt_profit = tt_out * tt_c - tt_fc

P1_A = case('Source A: Tandem Tea Co-operative', [
    'Tandem Tea is a worker co-operative set up in 2016 by six friends who each invested £8 000. Every member has one vote, profits are shared equally after money has been set aside for investment, and members elect a board of three. The co-operative blends and sells loose-leaf tea through its website and weekend markets. Its mission is “fair pay for growers and a fair price for drinkers”.',
    'Demand for loose-leaf tea has grown, but Tandem’s growth has been slow because decisions take a long time: all six members must agree before any new product is launched, and two members want to keep the business small. The co-operative buys from small growers at prices about 15% above the market price. A competitor, Leafline plc, has offered to buy Tandem for £600 000.',
    'The members are considering ways to raise £60 000 to buy a larger blending machine: crowd funding from customers (who would receive tea vouchers) or an overdraft from their bank.',
], [('Appendix A: Annual data for Tandem’s main blend', ['', ''], [['Selling price per 100 g pack', f'£{tt_price:.2f}'], ['Variable cost per pack', f'£{tt_vc:.2f}'], ['Fixed costs per year', f'£{n(tt_fc)}'], ['Packs sold per year', n(tt_out)]], None)])

P1_A_Q = [
    Q(6, 'Tandem Tea is a worker co-operative.\nAnalyse one way in which being a worker co-operative might affect the speed of Tandem’s decision making.', [
        'Worker co-operative: owned and controlled by employees, who share decision making and profits (AO1).',
        'All six members must agree before a new product is launched; two want to stay small (AO2).',
        'Democratic decision making takes longer → slower response to market changes and delayed launches → lost sales opportunities relative to faster-moving competitors (AO3). Could improve commitment.']),
    Q(6, 'Tandem Tea pays growers about 15% above the market price.\nAnalyse one way in which this ethical decision might affect Tandem’s profit.', [
        'Ethical responsibilities to stakeholders (suppliers); a conflict between profit and ethics (AO1).',
        'Higher input costs for tea leaf; mission is “fair pay for growers” (AO2).',
        'Higher costs → lower profit margin per pack in the short run; but may increase brand loyalty and allow a higher price to customers who value ethics → higher sales (AO3).']),
    Q(9, 'Assess whether Tandem Tea’s main blend is likely to be profitable.\nCalculate the break-even output and the margin of safety to support your answer.', [
        f'Quantitative skills: Contribution per pack = £{tt_price:.2f} − £{tt_vc:.2f} = £{tt_c:.2f} (AO1). Break-even output = {n(tt_fc)} ÷ {tt_c:.2f} = {n(tt_bep)} packs (AO2). Margin of safety = {n(tt_out)} − {n(tt_bep)} = {n(tt_mos)} packs, {tt_mos / tt_out * 100:.0f}% of sales (AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): sales are {n(tt_mos)} packs above break-even; annual profit from this blend = {n(tt_out)} × £{tt_c:.2f} − £{n(tt_fc)} = £{n(tt_profit)}.',
        'Evaluation (AO3, AO4): a margin of safety of 23% is reasonable but a fall in demand or rise in growers’ prices would reduce it; assumes all packs are sold and costs stay constant; judgement on profitability.']),
    Q(9, 'Assess whether Tandem Tea should accept the offer from Leafline plc to buy the co-operative for £600 000.', [
        'Takeover: selling control to another business; members receive a lump sum (£600 000 ÷ 6 = £100 000 each before tax) (AO1, AO2).',
        'For: members get a high return on their £8 000 investments; Leafline’s resources may allow growth; resolves disagreement about growth (AO3).',
        'Against: loss of ethical mission and control, possible job losses; the price compared with annual profits (£28 800 per year from one blend) may undervalue the business (AO3).',
        'Judgement: depends on the members’ objectives (financial v non-financial) (AO4).']),
    Q(15, 'Evaluate (1) crowd funding from customers and (2) an overdraft as ways of raising £60 000 for the new machine and recommend which one Tandem should choose.', [
        'Crowd funding: no interest or repayment of cash (vouchers instead), builds customer engagement and brand loyalty, tests demand; uncertain amount raised, time and marketing effort, cost of vouchers, no control issue (AO1, AO2, AO3).',
        'Overdraft: flexible and quick; interest charges are high and variable, repayable on demand, not suitable for long-term investment in a machine; risk to cash flow (AO1, AO2, AO3).',
        'Context: the machine is a long-term investment; the margin of safety is modest; ethical customer base suits crowd funding; Tandem’s members are cautious (AO2).',
        'Judgement: crowd funding is better matched to a long-term asset and to the brand; overdraft acceptable only for short-term needs; recommendation must be justified; sophisticated concepts: break-even, investment appraisal, risk (AO4).'])]

# Case B: Skyline Gym Ltd
sg_p0, sg_p1 = 40.0, 44.0
sg_q0, sg_q1 = 5_000, 4_300
sg_ped = ((sg_q1 - sg_q0) / sg_q0 * 100) / ((sg_p1 - sg_p0) / sg_p0 * 100)
sg_rev0, sg_rev1 = sg_p0 * sg_q0, sg_p1 * sg_q1

P1_B = case('Source B: Skyline Gym Ltd', [
    'Skyline Gym Ltd operates 14 fitness clubs in the Midlands and an app which gives members access to online classes. Members pay a monthly fee, and the company uses data from its app to see how often each member visits. About one in three members who join in January cancel by June.',
    'Skyline has segmented its members into three groups: “young professionals” aged 22–34 who use the gym early morning or evening, “families” who want flexible class times, and “budget users” who want the cheapest membership. The company has introduced dynamic pricing: prices for peak-time classes are 20% higher, off-peak classes are cheaper. A competitor, PureFit, has cut prices by 10% and offers a free month for new members.',
    'Skyline’s managers are considering two ways of improving retention and profit: (1) using artificial intelligence (AI) to personalise workout plans and send reminders to members who are at risk of cancelling, or (2) running a loyalty rewards scheme with discounts for members who visit regularly.',
], [('Appendix A: Effect of Skyline’s price rise in one club', ['', 'Before', 'After'], [['Monthly membership price', f'£{sg_p0:.2f}', f'£{sg_p1:.2f}'], ['Number of members', n(sg_q0), n(sg_q1)]], None)])

P1_B_Q = [
    Q(6, 'Skyline Gym segments its customers into young professionals, families and budget users.\nAnalyse one way in which this segmentation might help Skyline to increase sales.', [
        'Market segmentation: dividing a market into groups with similar characteristics, e.g. demographic and behavioural (AO1).',
        'Skyline’s segments differ in age and usage patterns (young professionals early/late; families need flexible classes) (AO2).',
        'Tailoring product, price and promotion to each segment (e.g. flexible family classes, early-morning classes for professionals) → better meets needs → higher membership and retention → higher sales (AO3).']),
    Q(6, 'Skyline Gym uses dynamic pricing.\nAnalyse one way in which dynamic pricing might affect Skyline’s capacity utilisation or revenue.', [
        'Dynamic pricing: changing prices frequently in response to demand, time or customer data (AO1).',
        'Prices for peak classes are 20% higher while off-peak classes are cheaper (AO2).',
        'Off-peak discounts encourage members to switch → higher utilisation of classes at quiet times; higher peak prices raise revenue from those who will pay, or reduce overcrowding (AO3).']),
    Q(9, 'Assess whether the price rise in one Skyline club has increased the club’s revenue.\nCalculate the price elasticity of demand to support your answer.', [
        f'Quantitative skills: % change in price = (44 − 40) ÷ 40 × 100 = +10%; % change in quantity = ({n(sg_q1)} − {n(sg_q0)}) ÷ {n(sg_q0)} × 100 = −14%; PED = −14 ÷ 10 = {sg_ped:.1f} (AO1, AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): demand is price elastic (greater than 1 in value) so a price rise reduces revenue: £{n(sg_rev0)} before and £{n(sg_rev1)} after, a fall of £{n(sg_rev0 - sg_rev1)}.',
        'Evaluation (AO3, AO4): the competitor’s price cut makes demand more elastic; revenue fell but variable costs may also fall with fewer members, so profit effect may differ; long-term effect and other factors need to be considered.']),
    Q(9, 'Assess the likely effect on Skyline Gym’s profits of the competitor’s 10% price cut and free-month offer.', [
        'Competition-based pricing; competitor actions affect demand (AO1).',
        'Price-sensitive “budget users” may switch to PureFit; demand for Skyline is elastic (PED about −1.4) (AO2, AO3).',
        'Skyline could lose members (and revenue); fixed costs of clubs stay the same so profit falls more; or Skyline could respond with matching offers and reduce margin (AO3).',
        'Judgement: significant threat to profit unless Skyline differentiates (app, classes) (AO4).']),
    Q(15, 'Evaluate (1) using AI to personalise workout plans and send reminders and (2) a loyalty rewards scheme as ways of improving retention and profit at Skyline Gym and recommend which one to choose.', [
        'AI personalisation: uses app data (CRM/analytics) to tailor plans and target at-risk members; could raise engagement and retention at relatively low marginal cost; set-up costs, data skills, privacy (GDPR, cookies) and ethical concerns (AO1, AO2, AO3).',
        'Loyalty scheme: rewards frequent visits; simple and understood; but discounts reduce margin, mainly rewards members who would stay anyway, and may attract “budget users” (AO1, AO2, AO3).',
        'Context: one in three January joiners cancel; competitor price cut; PED shows members are price-sensitive; app already collects data (AO2). Sophisticated concepts: PED, segmentation, dynamic pricing, CRM, return on marketing spend (AO3).',
        'Judgement: the AI approach targets the cause of cancellations without cutting price; loyalty discounts weaken margins; recommendation with a supported justification and discussion of risks (AO4).'])]

# ═════════════ PAPER 2 · Unit 3.2 ═════════════
kc_hours, kc_staff = (22_000, 24_500), (55, 61)
kc_rev = (1_540_000, 1_715_000)
kc_prod = [kc_rev[i] / kc_staff[i] for i in (0, 1)]
kc_pc = [(kc_prod[1] - kc_prod[0]) / kc_prod[0] * 100]

P2_A = case('Source A: Kestrel Care Agency', [
    'Kestrel Care Agency provides care assistants to supply care at home for older people. It employs 61 care workers, most of whom are on zero-hours contracts and are paid only for hours they work. The agency has no head office staff other than a manager and two administrators. Managers say that “zero-hours contracts give us the flexibility to cope with unpredictable demand”.',
    'In 2024 the agency won a large contract from the local council. However, many care workers have left to work for a rival offering guaranteed hours and training. The agency does not carry out appraisals and care workers say they feel undervalued and receive no feedback. A trade union has begun recruiting among Kestrel’s staff and an employee wellbeing survey showed high levels of stress and frequent short-notice schedule changes.',
    'The managing director, Naomi Carter, is considering two options to retain staff and improve performance: (1) offering guaranteed-hours contracts and a structured appraisal and training programme; or (2) introducing a wellbeing programme (counselling service and flexible scheduling).',
], [('Appendix A: Kestrel Care Agency performance data', ['', '2023', '2024'], [['Number of care workers at year end', f'{kc_staff[0]}', f'{kc_staff[1]}'], ['Revenue (£)', n(kc_rev[0]), n(kc_rev[1])], ['Care worker turnover', '28%', '47%'], ['Client satisfaction rating', '91%', '78%']], None)])

P2_A_Q = [
    Q(6, 'Kestrel Care Agency employs most of its care workers on zero-hours contracts.\nAnalyse one way in which zero-hours contracts might benefit Kestrel.', [
        'Zero-hours contract: no guaranteed hours; employee paid only for hours worked (AO1).',
        'Demand for home care is unpredictable and the agency has little head office staff (AO2).',
        'Allows the agency to match staff hours to demand → lower labour costs when demand is low and flexibility when demand is high → improves profit margins (AO3).']),
    Q(6, 'Kestrel Care Agency does not carry out employee appraisals.\nAnalyse one way in which introducing appraisals might benefit Kestrel.', [
        'Appraisal: reviewing performance, giving feedback and identifying development needs (AO1).',
        'Care workers say they feel undervalued and receive no feedback (AO2).',
        'Appraisals recognise good work and identify training needs → higher motivation and skills → better quality of care and lower turnover → higher client satisfaction and lower recruitment costs (AO3).']),
    Q(9, 'Assess whether the change in labour productivity suggests that Kestrel Care Agency’s human resource management is effective.\nCalculate labour productivity (revenue per care worker) for 2023 and 2024 to support your answer.', [
        f'Quantitative skills: Labour productivity = revenue ÷ number of employees (AO1). 2023: £{n(kc_rev[0])} ÷ {kc_staff[0]} = £{n(kc_prod[0])}; 2024: £{n(kc_rev[1])} ÷ {kc_staff[1]} = £{n(kc_prod[1])} (AO2). Own Figure Rule applies.',
        f'Interpretation: productivity rose by only {kc_pc[0]:.1f}% (AO3), but turnover rose from 28% to 47% and client satisfaction fell from 91% to 78% (AO3).',
        'Evaluation (AO4): revenue per worker rose slightly because the new council contract raised revenue, which hides underlying problems; high turnover suggests management is not effective; revenue per worker ignores quality and hours worked.']),
    Q(9, 'Assess whether the trade union is likely to improve employer–employee relations at Kestrel Care Agency.', [
        'Trade union: collective representation; negotiates pay and conditions; employee voice (AO1).',
        'Staff feel undervalued and have short-notice schedule changes; zero-hours contracts (AO2).',
        'A union could negotiate guaranteed hours and notice periods → improve morale and reduce turnover; but may cause conflict, reduce flexibility and raise costs (AO3).',
        'Judgement: if management communicates and listens relations may improve (AO4).']),
    Q(15, 'Evaluate (1) guaranteed-hours contracts with appraisal and training and (2) a wellbeing programme as ways of retaining care workers and recommend which one Naomi should choose.', [
        'Guaranteed hours with training: greater security (Maslow safety needs, Herzberg hygiene), appraisal and development (motivators), lower turnover and recruitment costs, better quality; loses flexibility and may raise fixed costs (AO1, AO2, AO3).',
        'Wellbeing programme: addresses stress and scheduling; counselling and flexible rotas reduce absence and improve engagement; costs; may not address pay/security reasons for leaving (AO1, AO2, AO3).',
        'Context: turnover 47%; client satisfaction 78%; agency competes with a rival offering guaranteed hours and training (AO2). Sophisticated concepts: Herzberg, Maslow, flexible employment, employee costs, employee wellbeing (AO3).',
        'Judgement: option 1 addresses the main reason for leaving; option 2 supports it; recommendation with reasoning about costs and likely impact (AO4).'])]

gp_a, gp_b = 12.0, 3.0
gp_inv = (14_000_000, 9_000_000)
gp_cos = 63_000_000
gp_it = gp_cos / ((gp_inv[0] + gp_inv[1]) / 2)

P2_B = case('Source B: Greenfield Packaging plc', [
    'Greenfield Packaging plc makes cardboard and plastic packaging for food manufacturers. In recent years its customers have demanded recycled and recyclable materials, and several have threatened to move their orders unless Greenfield reduces defects and its carbon footprint. The company currently inspects finished products at the end of the production line and about 6% of output is rejected as defective.',
    'The operations director, Karl Brandt, wants to improve quality and reduce waste. He is considering introducing Total Quality Management (TQM) with quality circles, or investing £4.5m in a new recycling plant which would allow Greenfield to use recycled fibre for most of its cardboard. Greenfield’s inventory levels have been reduced under a lean programme and Karl is also planning a new production line, which requires a number of activities to be completed in sequence (Appendix A).',
], [('Appendix A: Activities for building the new production line (weeks)', ['Activity', 'Duration', 'Must follow'], [['A  Design layout', '4', '–'], ['B  Order machines', '2', 'A'], ['C  Prepare site', '6', 'A'], ['D  Install machines', '3', 'B, C'], ['E  Train staff', '4', 'A'], ['F  Test run', '1', 'D, E']], 'Inventory: cost of sales £63m; opening inventory £14m; closing inventory £9m.')])

P2_B_Q = [
    Q(6, 'Greenfield Packaging inspects finished products at the end of the production line.\nAnalyse one way in which moving from quality control to quality assurance might benefit Greenfield.', [
        'Quality control: inspecting output to find defects; quality assurance: preventing defects by building quality into every stage (AO1).',
        'At present 6% of output is rejected after production (AO2).',
        'QA identifies faults earlier → less waste and rework → lower costs and fewer rejected orders → protects customer relationships (AO3).']),
    Q(6, 'Greenfield Packaging is introducing quality circles.\nAnalyse one way in which quality circles might improve Greenfield’s productivity.', [
        'Quality circles: small groups of employees who meet to solve quality problems (AO1).',
        'Defect rate of 6% and customer complaints (AO2).',
        'Workers on the production line identify and fix causes of defects → fewer defects and less waste → more good output per employee → higher productivity; employees may feel more motivated (AO3).']),
    Q(9, 'Assess whether Greenfield Packaging’s lean inventory management has been successful.\nCalculate inventory turnover for the year to support your answer.', [
        f'Quantitative skills: Inventory turnover = cost of sales ÷ average inventory (AO1). Average inventory = (£14m + £9m) ÷ 2 = £11.5m; inventory turnover = £63m ÷ £11.5m = {gp_it:.1f} times (AO2). Own Figure Rule applies.',
        'Interpretation (AO3): inventory is turned over about 5.5 times a year, so on average stock is held for about 67 days; inventory fell from £14m to £9m, releasing cash and cutting storage costs.',
        'Evaluation (AO3, AO4): lower inventory improves cash flow but increases risk of stock-outs, and benchmark data are needed; success depends on whether customer orders are met on time.']),
    Q(9, 'Assess whether the new production line can be ready in 12 weeks.\nUse the network information in Appendix A to determine the critical path and the total project time.', [
        'Network analysis: A (4) → B (2) → D (3) → F (1) = 10 weeks; A (4) → C (6) → D (3) → F (1) = 14 weeks; A (4) → E (4) → F (1) = 9 weeks. Critical path A, C, D, F = 14 weeks (AO1, AO2). Float: B has 4 weeks, E has 5 weeks (AO2). Own Figure Rule applies.',
        'Interpretation (AO3): the project takes 14 weeks, not 12; to finish in 12 weeks the critical path must be shortened by 2 weeks (e.g. more workers to prepare the site).',
        'Evaluation (AO3, AO4): crashing C costs more money and may reduce quality; B and E have float; delays on critical activities delay the project; durations are estimates.']),
    Q(15, 'Evaluate (1) introducing Total Quality Management with quality circles and (2) investing £4.5m in a recycling plant as ways of improving Greenfield’s competitiveness and recommend which one Karl should choose.', [
        'TQM: reduces defects (6%), waste and customer complaints; improves culture and engagement; training, time and benefits take time to appear (AO1, AO2, AO3).',
        'Recycling plant: meets customer demand for recycled materials, reduces environmental impact and possibly raw material costs; high cost (£4.5m) and payback, disruption to operations (AO1, AO2, AO3).',
        'Context: customers threaten to leave over carbon footprint and defects (AO2). Sophisticated concepts: TQM, lean production, circularity, investment appraisal, competitive advantage, sustainability (AO3).',
        'Judgement: weigh cost, time, likely impact on customers; TQM is cheaper and quicker; recycling is strategically important; recommendation could be phased; justify (AO4).'])]

# ═════════════ PAPER 3 · Unit 3.3 ═════════════
aa_cost = 90.0
aa_flows = [18.0, 26.0, 30.0, 30.0, 28.0]
aa_df = [0.909, 0.826, 0.751, 0.683, 0.621]
aa_pv = [f * d for f, d in zip(aa_flows, aa_df)]
aa_npv = sum(aa_pv) - aa_cost
aa_cum = 0.0
aa_pb = None
for i, f in enumerate(aa_flows, 1):
    if aa_cum + f >= aa_cost:
        aa_pb = (i - 1) + (aa_cost - aa_cum) / f
        break
    aa_cum += f

P3_A = case('Source A: Aurora Airlines plc', [
    'Aurora Airlines plc is a UK airline flying short-haul routes across Europe. Fuel costs and airport charges have risen and the Bank of England has increased interest rates three times in two years. Aurora has debts of £310m and gearing of 62%. The government has announced a tax on short flights and is considering banning flights where there is a train alternative of under four hours.',
    'Competition is intense. Low-cost rivals can enter the market easily because aircraft can be leased, and passengers compare prices online and switch easily. Aurora’s strategy is to compete on punctuality and service, but customer satisfaction has fallen because of delays and cancellations caused by staff shortages and old aircraft. Its chief executive, Dan Okoro, wants to modernise the fleet.',
    'The board is considering two strategic options: (1) buying 12 new fuel-efficient aircraft for £90m, or (2) a new long-haul route to the Caribbean using leased aircraft, which targets higher-priced tickets.',
], [('Appendix A: Forecast net cash flows from buying 12 new aircraft (£m)', ['Initial cost', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'], [[f'{aa_cost:.0f}'] + [f'{x:.0f}' for x in aa_flows]], 'Discount factors at 10%: Year 1 0.909; Year 2 0.826; Year 3 0.751; Year 4 0.683; Year 5 0.621. Aurora’s payback criterion is 4 years.'),
    ('Appendix B: Long-haul option (fictional estimates)', ['', 'Value'], [['Investment (marketing, crew, leases) in year 1', '£25m'], ['Forecast annual profit from year 3', '£9m'], ['Main risks', 'Unproven demand; fuel costs; carbon tax on long flights']], None)])

P3_A_Q = [
    Q(6, 'The Bank of England has increased interest rates.\nAnalyse one way in which higher interest rates might affect Aurora Airlines’ profits.', [
        'Interest rates: the cost of borrowing and reward for saving; monetary policy (AO1).',
        'Aurora has debts of £310m and gearing of 62% (AO2).',
        'Higher rates → higher interest payments on variable-rate debts → higher costs and lower profit; and consumers have less disposable income to spend on holidays → lower demand (AO3).']),
    Q(6, 'Aurora faces a new government tax on short flights.\nAnalyse one way in which this tax might affect Aurora’s competitiveness.', [
        'Government tax: an increase in costs imposed by government policy (AO1).',
        'Aurora flies short-haul routes and competes on price with low-cost rivals (AO2).',
        'Tax raises costs → either higher ticket prices (loses price-sensitive passengers to rivals or to rail) or lower margins → weaker competitive position (AO3). Airlines with longer routes less affected.']),
    Q(9, 'Assess the strength of the threat of new entrants to Aurora Airlines using Porter’s five forces.', [
        'Entry threat: how easily new firms can enter the market; barriers to entry such as capital, brand, regulation (AO1).',
        'Aircraft can be leased, passengers compare prices online and switch easily → barriers are low (AO2). New entrants could cut prices and reduce Aurora’s market share and margins (AO3).',
        'Counter: airport slots, safety regulation, brand and customer loyalty offer some protection; Aurora’s existing network (AO3).',
        'Judgement: threat is high; Aurora should differentiate on punctuality and service (AO4).']),
    Q(9, 'Assess whether the long-haul route to the Caribbean is a sensible strategy for Aurora Airlines.', [
        'Ansoff: market development/new product; higher margins from long-haul (AO1).',
        'Higher ticket prices and £9m forecast annual profit (AO2); but Aurora’s gearing is 62%, fuel and carbon costs, unproven demand and no long-haul experience (AO3).',
        'Aurora’s existing problems with punctuality and old aircraft may undermine a new route; leased aircraft reduce investment risk (AO3).',
        'Judgement: depends on financial strength and risk appetite (AO4).']),
    Q(15, 'Evaluate (1) buying 12 new aircraft for £90m and (2) the long-haul route and recommend which one Aurora should choose.\nUse the investment appraisal data in Appendix A (and Appendix B) in your answer.\nCalculate the net present value of buying the new aircraft to support your answer.', [
        f'Quantitative skills: NPV = Σ(cash flow × discount factor) − initial cost (AO1). PVs: 18 × 0.909 = {aa_pv[0]:.1f}; 26 × 0.826 = {aa_pv[1]:.1f}; 30 × 0.751 = {aa_pv[2]:.1f}; 30 × 0.683 = {aa_pv[3]:.1f}; 28 × 0.621 = {aa_pv[4]:.1f}; total = {sum(aa_pv):.1f}; NPV = {sum(aa_pv):.1f} − 90 = £{aa_npv:.1f}m (AO2). Own Figure Rule applies.',
        f'Interpretation (AO3): NPV is {"positive" if aa_npv > 0 else "negative"}; payback = {aa_pb:.2f} years (about {aa_pb:.1f} years) which {"meets" if aa_pb <= 4 else "does not meet"} the 4-year criterion.',
        'New aircraft: improves punctuality, fuel efficiency and customer satisfaction, helps with carbon tax; large investment financed with debt would raise gearing above 62% and interest costs (AO2, AO3).',
        'Long-haul: higher margins and diversification; lower investment (£25m) with leased aircraft; but demand unproven, fuel and carbon tax risk, and does not fix the core fleet problem (AO2, AO3).',
        'Evaluation: assumptions in the forecasts (rates, tax); consider discount rate, risk and finance; judgement based on NPV, payback and strategic fit; challenge the data (AO4).'])]

cs_cost, cs_rev, cs_staff = 14.0, 62.0, 300

P3_B = case('Source B: Cobalt Software plc', [
    'Cobalt Software plc develops accounting software for small businesses. For 15 years its desktop product was the market leader but in the past three years customers have moved to cloud-based services with artificial intelligence (AI) features, and Cobalt’s market share has fallen from 34% to 21%. Chief executive Priya Nandakumar believes the company has suffered strategic drift.',
    'A recent risk review identified a number of threats: an attempted ransomware attack on its servers, the loss of two senior developers to a rival, a legal case about the use of customers’ data to train its AI tools, and a planned rise in employer National Insurance. The board has no succession plan for the chief technology officer, who is 63, and does not have a contingency plan for a data breach.',
    'Cobalt’s directors are considering two ways of responding: (1) acquiring AI start-up Linq Labs for £40m, or (2) developing a cloud product in-house over three years at a cost of £22m.',
], [('Appendix A: Cobalt Software plc market and financial data', ['', '2021', '2024'], [['Cobalt market share', '34%', '21%'], ['Revenue (£m)', '74', '62'], ['Operating profit (£m)', '15.5', '6.2'], ['Staff who say they understand the strategy', '62%', '38%']], None)])

P3_B_Q = [
    Q(6, 'Priya Nandakumar believes Cobalt has suffered strategic drift.\nAnalyse one reason why Cobalt’s strategy might have drifted from the needs of its market.', [
        'Strategic drift: a business’s strategy changes more slowly than its environment, so the gap widens (AO1).',
        'Customers moved to cloud-based services with AI while Cobalt stayed with a desktop product; market share fell from 34% to 21% (AO2).',
        'Past success led to complacency and slow decisions → Cobalt failed to respond to technological change → lost customers → lower revenue and profit (AO3).']),
    Q(6, 'Cobalt has no contingency plan for a data breach.\nAnalyse one way in which a data breach could affect Cobalt’s reputation.', [
        'Contingency plan: an arrangement to respond to an unexpected event; cybersecurity and reputational risk (AO1).',
        'Cobalt holds sensitive financial data for small businesses and has faced an attempted ransomware attack (AO2).',
        'A breach would expose customer data → loss of trust and negative publicity → customers switch to rivals; legal action; lower sales (AO3). A plan limits damage.']),
    Q(9, 'Assess whether Cobalt Software plc has managed risk effectively.', [
        'Types of risk: strategic, cybersecurity, compliance, operational, financial; ways of managing: contingency/crisis planning, succession planning, insurance, investment and training, cybersecurity measures (AO1).',
        'Cobalt has identified risks but has no succession plan for the CTO and no data breach plan; lost developers; legal case about data (AO2).',
        'Poor planning leaves Cobalt exposed to loss of key knowledge, fines and reputation damage; the risk review itself is a positive step (AO3).',
        'Judgement: risk identification is good but management is weak and incomplete (AO4).']),
    Q(9, 'Assess whether Cobalt’s profit performance supports the view that its strategy has failed.', [
        'Operating profit margin: 2021: 15.5 ÷ 74 = 20.9%; 2024: 6.2 ÷ 62 = 10.0% (AO2). Revenue fell by 16%; market share fell from 34% to 21% (AO2, AO3).',
        'Evidence of failure: falling revenue, market share and margins; staff understanding of strategy fell from 62% to 38% (AO3).',
        'Counter: still profitable; company-reported data covers only two years; market conditions and one-off costs (ransomware, legal) may explain some of the change (AO3, AO4).',
        'Judgement: strategy has not kept pace with the market but business is not beyond recovery (AO4).']),
    Q(15, 'Evaluate (1) acquiring Linq Labs for £40m and (2) developing a cloud product in-house and recommend which one Cobalt should choose.', [
        'Acquisition: fast access to AI technology and talent; immediate product; high cost (£40m is 6.5 times operating profit); integration and culture clash; risk of overpaying (AO1, AO2, AO3).',
        'In-house: lower cost (£22m), control and builds Cobalt’s own skills; three years is slow while market share is falling; risk of failure and loss of developers (AO1, AO2, AO3).',
        'Context: strategic drift and falling share; limited cash (profit £6.2m); contingency and succession weaknesses; resistance to change (AO2). Sophisticated concepts: Ansoff (new product development), Lewin, Kotter and Schlesinger, agile business, risk management, investment appraisal (AO3).',
        'Judgement: speed of response v cost and risk; the answer depends on finance and the ability to integrate; recommendation with justification (AO4).'])]


def papers():
    return [paper('b', 1, SET, P1_A, P1_A_Q, P1_B, P1_B_Q), paper('b', 2, SET, P2_A, P2_A_Q, P2_B, P2_B_Q), paper('b', 3, SET, P3_A, P3_A_Q, P3_B, P3_B_Q)]
