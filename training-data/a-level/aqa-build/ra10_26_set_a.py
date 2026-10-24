"""RA10 practice Set A (AQA 7138 format). Numbers in the questions and indicative content are computed here."""
from ra10_26_lib import case, Q, paper

SET = 'A'

# ═════════════════ PAPER 1 · Unit 3.1 ═════════════════
# Case A: Lumen Skincare Ltd
LS = {'ca': (310, 140, 420), 'inv': 140}  # current assets 310k, of which inventory 140k; current liabilities 420k
ls_ca, ls_inv, ls_cl = 310.0, 140.0, 420.0
ls_cr = ls_ca / ls_cl
ls_at = (ls_ca - ls_inv) / ls_cl

P1_A = case('Source A: Lumen Skincare Ltd', [
    'Lumen Skincare Ltd was founded in 2019 by Dr Amara Osei, a pharmacist who left a secure hospital job to launch a range of fragrance-free moisturisers for sensitive skin. She funded the start-up with £25 000 of savings and worked from her spare bedroom, packing orders in the evenings. When a retailer rejected her first products, she re-formulated them four times in six months before launching online.',
    'Lumen sells only through its website and has built a following of 240 000 on social media by working with skin-care influencers. Sales have grown by 35% a year. Amara has now been told by a large pharmacy chain that it would stock Lumen if she can double production. Lumen’s moisturiser sells at £24, around 40% more than similar own-label products. A recent customer survey found that 72% of buyers would be “very unlikely” to switch to a cheaper brand.',
    'Amara believes the company needs £400 000 to expand. She has two sources in mind: a bank loan at 9% interest over five years, or selling a 25% stake to a business angel, Raj Mehta, who has experience of launching beauty brands.',
], [('Appendix A: Extracts from Lumen Skincare Ltd’s statement of financial position, 2024', ['', '£000'], [['Inventory', '%d' % ls_inv], ['Receivables', '60'], ['Cash', '110'], ['Payables due within a year', '420']], 'Total current assets = inventory + receivables + cash. Industry average current ratio = 1.5 (fictional, from an analyst report).')])

P1_A_Q = [
    Q(6, 'Amara Osei has shown several entrepreneurial characteristics.\nAnalyse how one of these characteristics has contributed to the success of Lumen Skincare Ltd.', [
        'Entrepreneurial characteristics are personal features such as resilience, risk taking, passion and innovation (AO1).',
        'Amara re-formulated her products four times in six months after a retailer rejected them - resilience (AO1, AO2). Resilience kept her trying until she found a product that sold, so Lumen could launch and grow (AO3).',
        'Alternative: risk taker - left a secure hospital job and invested £25 000 of savings (AO1, AO2); the risk allowed her to dedicate time to the business and build the brand, leading to sales growth of 35% a year (AO3).',
        'Credit all relevant knowledge, understanding, application and analysis. One developed chain is sufficient for Level 2.']),
    Q(6, 'Lumen’s moisturiser sells at about 40% more than similar own-label products.\nAnalyse one way in which Lumen’s strong brand might affect the price elasticity of demand for its products.', [
        'A strong brand differentiates the product and builds loyalty, making demand less sensitive to price change (AO1).',
        '72% of customers say they would be very unlikely to switch to a cheaper brand - loyal customers (AO2). Therefore demand is likely to be price inelastic (PED less than 1 in value), so a small price rise would cause a smaller percentage fall in quantity demanded (AO3).',
        'The effect on revenue: a price rise would increase revenue. Own-label rivals may keep demand somewhat elastic (AO3).']),
    Q(9, 'Assess whether spending more on influencer marketing would increase Lumen’s profits.', [
        'Influencers: people who affect the buying decisions of others; targeted, credible, low cost compared with TV (AO1).',
        'Lumen already has 240 000 followers and sales growth of 35% - evidence the method works for its target market (AO2). Greater reach → more traffic and conversion → higher sales and contribution (AO3).',
        'Against: diminishing returns as the market becomes saturated; influencer fees; risk of negative publicity; profit depends on return on marketing spend being greater than cost (AO3).',
        'Judgement: likely to raise profit if spending is targeted and monitored (e.g. return on marketing spend); depends on conversion and cost (AO4).']),
    Q(9, 'Assess whether Lumen Skincare Ltd was in a strong liquidity position in 2024.\nCalculate the current ratio for 2024 to support your answer.\nGive your answer to two decimal places.', [
        'Quantitative skills (6 marks): Current ratio = current assets ÷ current liabilities (AO1). Current assets = £140k + £60k + £110k = £310k (AO2). Current ratio = 310 ÷ 420 = %.2f : 1 (AO2). Own Figure Rule applies.' % ls_cr,
        'Interpretation (AO3/AO4): the ratio is below 1 and below the industry average of 1.5 - Lumen may struggle to pay short-term debts from current assets.',
        'Further analysis: inventory (£140k) is 45%% of current assets - the acid test ratio would be (310 − 140) ÷ 420 = %.2f, weaker still; but growing online businesses often have high payables because they use supplier credit; the industry figure is fictional/analyst-based and may not be comparable; trend data and cash flow are needed (AO3, AO4).' % ls_at,
        'Judgement: liquidity looks weak but the sales growth and need for inventory to support expansion may explain it; the business should improve cash management (AO4).']),
    Q(15, 'Amara needs £400 000 to expand.\nEvaluate two sources of finance - a bank loan at 9% or selling a 25% stake to a business angel - and recommend which one Amara should choose.', [
        'Bank loan: retains full ownership and control; interest cost £36 000 in year 1 (9%% of £400 000) plus repayments; increases gearing and fixed costs; Lumen’s current ratio of %.2f already suggests liquidity pressure, so repayments could be difficult (AO1, AO2, AO3).' % ls_cr,
        'Business angel: no repayment or interest; expertise and contacts for a pharmacy rollout; Amara loses 25% of ownership and profits, may lose some control; the angel will expect a return/exit (AO1, AO2, AO3).',
        'Sophisticated concepts that can be credited: gearing, break-even, ROCE, the Ansoff matrix (market penetration into pharmacies), risk and reward (AO3).',
        'Evaluation: weigh cost v control; consider Amara’s characteristics (risk taker, passion for independence); growth is fast so a flexible partner may help; the loan is cheaper if profits are high; recommendation must be supported (AO4). Level 5 weighs both options and gives a coherent overarching judgement.'])]

# Case B: Harbour Roasters plc
hr_div, hr_shares, hr_price = 9.6, 80.0, 3.00  # total dividends £9.6m, 80m shares, £3.00
hr_dps = hr_div / hr_shares
hr_yield = hr_dps / hr_price * 100
hr_sales, hr_market = (62.0, 71.0), (410.0, 436.0)
hr_share = [hr_sales[i] / hr_market[i] * 100 for i in (0, 1)]
hr_sg = (hr_sales[1] - hr_sales[0]) / hr_sales[0] * 100
hr_mg = (hr_market[1] - hr_market[0]) / hr_market[0] * 100

P1_B = case('Source B: Harbour Roasters plc', [
    'Harbour Roasters plc is a UK coffee roaster whose shares are traded on the stock exchange. It sells roast and ground coffee to cafés and offices (B2B) and packs of beans to consumers through its website (B2C). In 2024 the company increased its dividend, which pushed its share price up.',
    'The UK retail coffee market has grown steadily, but consumers are divided: younger drinkers want single-origin and ethically sourced beans, while older drinkers prefer familiar blends at lower prices. Harbour’s research, based on a quota sample of 800 customers, suggests that 55% of under-35s would pay a premium for ethical beans compared with 18% of over-50s. Supermarkets have launched own-label ranges that sell at about half Harbour’s prices.',
    'The directors want to grow market share. They are considering two options: (1) selling Harbour’s consumer range through the large supermarket chains; or (2) developing an online subscription service with personalised coffee blends and delivery.',
], [('Appendix A: Harbour Roasters plc and the UK coffee market', ['', '2023', '2024'], [['Harbour Roasters sales (£m)', '%.0f' % hr_sales[0], '%.0f' % hr_sales[1]], ['UK market sales (£m)', '%.0f' % hr_market[0], '%.0f' % hr_market[1]], ['Total dividends (£m)', '8.0', '%.1f' % hr_div], ['Number of shares (m)', '%.0f' % hr_shares, '%.0f' % hr_shares], ['Share price at year end (£)', '2.50', '%.2f' % hr_price]], None)])

P1_B_Q = [
    Q(6, 'Harbour Roasters sells to cafés and offices and to consumers.\nAnalyse one way in which the marketing of coffee to cafés (B2B) might differ from the marketing of coffee to consumers (B2C).', [
        'B2B: fewer, larger buyers, relationships and negotiation, account managers; B2C: many small purchases, mass communication, branding (AO1).',
        'Harbour sells to cafés and offices through personal selling and account management, whereas consumer sales use its website and packaging (AO2).',
        'B2B marketing builds long-term contracts so sales are more predictable but depend on a few clients; B2C marketing needs promotion to reach many customers and drives brand awareness (AO3).']),
    Q(6, 'Harbour Roasters increased its dividend in 2024.\nAnalyse one reason why the increase in dividend might have caused Harbour’s share price to rise.', [
        'Share price is determined by demand and supply for shares; a higher dividend makes the shares more attractive to investors (AO1).',
        'The dividend rose from £8.0m to £9.6m (AO2). Higher dividends increase the return for shareholders, which raises demand for shares and, with a fixed supply, pushes the price up (AO3).',
        'Also signals confidence in future profits (AO3).']),
    Q(9, 'Assess whether Harbour Roasters’ market research is likely to be reliable.', [
        'Quota sampling: interviewers choose respondents to fill quotas; non-random so may be biased; sample size 800 (AO1).',
        'The sample covers under-35s and over-50s but ignores 35-50 age group and non-customers (AO2). Bias could lead to the wrong conclusion on willingness to pay a premium (AO3).',
        'Larger/random samples and confidence intervals would improve reliability; the research was done by the company itself (origin) (AO3). 55% v 18% gap is large, so the conclusion on the age difference is probably valid (AO4).',
        'Judgement: partly reliable but needs checking (AO4).']),
    Q(9, 'Assess whether Harbour Roasters’ market share has increased by more than the market has grown.\nCalculate the market share for 2023 and 2024 to support your answer.', [
        'Quantitative skills: Market share = company sales ÷ market sales × 100 (AO1). 2023: 62 ÷ 410 × 100 = %.1f%%; 2024: 71 ÷ 436 × 100 = %.1f%% (AO2). Own Figure Rule applies.' % (hr_share[0], hr_share[1]),
        'Interpretation: sales grew %.1f%% while the market grew %.1f%% so market share rose by %.1f percentage points (AO3).' % (hr_sg, hr_mg, hr_share[1] - hr_share[0]),
        'Evaluation: growth is better than the market, suggesting the dividend/brand strategy is working; but the market grew slowly, share is small, and supermarket own-label competition threatens further growth (AO3, AO4).']),
    Q(15, 'Evaluate (1) selling through supermarkets and (2) an online subscription service as ways for Harbour Roasters to increase its market share and recommend which one it should choose.', [
        'Supermarkets (intermediaries): wide distribution and volume; but buyer power, lower margins, own-label competition at half the price, risk to premium/ethical brand image (AO1, AO2, AO3).',
        'Online subscription (direct): keeps margin, personalisation using data (AI/CRM), builds retention and loyalty; customers are largely under-35 (55% pay premium for ethical beans); needs delivery and digital marketing spend; slower growth (AO1, AO2, AO3).',
        'Sophisticated concepts: segmentation/target market, price elasticity, Boston Matrix, return on marketing spend, multichannel distribution (AO3).',
        'Judgement: weigh market share growth v profit and brand; subscription fits the premium segment, supermarkets fit volume; recommendation with reasons (AO4).'])]

# ═════════════════ PAPER 2 · Unit 3.2 ═════════════════
ob_emp = (480, 520); ob_leave = (72, 130); ob_costs = (14.4, 17.2); ob_rev = (96.0, 98.5)
ob_avg = (ob_emp[0] + ob_emp[1]) / 2
ob_turn = ob_leave[1] / ob_avg * 100
ob_pct = [ob_costs[i] / ob_rev[i] * 100 for i in (0, 1)]

P2_A = case('Source A: Orbit Logistics Ltd', [
    'Orbit Logistics Ltd operates warehouses and delivery services for online retailers. It has a tall structure with six levels of hierarchy, and managers each supervise only four or five staff. Decisions are made at head office and passed down; warehouse supervisors say they need approval even to change a shift pattern.',
    'In 2024 the company introduced a performance-related bonus based on parcels dispatched per hour. Productivity rose briefly, but errors increased and many staff complained of stress. Pay is slightly above the national living wage, and there are few training opportunities. The chief executive, Jade Whitlock, describes her style as “tell people what to do and check they do it”. Employee turnover has increased sharply.',
    'Jade is considering two ways of improving motivation and retention: (1) delayering and giving supervisors authority over rotas and quality, or (2) introducing an employee development programme with training and promotion routes.',
], [('Appendix A: Orbit Logistics Ltd workforce data', ['', '2023', '2024'], [['Employees at year end', '%d' % ob_emp[0], '%d' % ob_emp[1]], ['Employees who left during the year', '%d' % ob_leave[0], '%d' % ob_leave[1]], ['Employee costs (£m)', '%.1f' % ob_costs[0], '%.1f' % ob_costs[1]], ['Revenue (£m)', '%.1f' % ob_rev[0], '%.1f' % ob_rev[1]]], 'Use the average of the opening and closing number of employees where an average is required. Opening employees in 2024 were 480.')])

P2_A_Q = [
    Q(6, 'Orbit Logistics has a tall organisational structure with narrow spans of control.\nAnalyse one way in which this structure might slow Orbit’s response to customer problems.', [
        'Tall structure: many levels of hierarchy; narrow span of control: few subordinates per manager (AO1).',
        'Orbit has six levels and managers who supervise four or five staff; supervisors need approval to change rotas (AO2).',
        'Information and decisions must pass up and down many layers → slower communication and decisions → delays in solving problems for retailers and slower delivery, which may harm customer satisfaction (AO3).']),
    Q(6, 'Jade Whitlock’s style is to “tell people what to do and check they do it”.\nAnalyse one way in which this leadership style might affect employees’ performance.', [
        'Autocratic leadership: leader makes decisions and tells employees what to do (AO1).',
        'Warehouse staff have little say and little responsibility; Jade checks work closely (AO2).',
        'Employees feel undervalued and stressed → lower motivation and engagement → more errors and absence/turnover → lower productivity and higher costs (AO3). In urgent, routine jobs it may give control and consistency.']),
    Q(9, 'Assess whether the performance-related bonus based on parcels dispatched per hour has been a good way to motivate Orbit’s employees.', [
        'Taylor: money motivates; link between effort and pay (AO1). Herzberg: pay is a hygiene factor; Maslow: pay meets lower needs (AO1).',
        'Productivity rose briefly (AO2), but errors and stress rose; bonus on speed only encourages rushing (AO3).',
        'Employee turnover rose sharply, which suggests it did not motivate long term; non-financial factors such as training, responsibility and recognition are missing (AO3).',
        'Judgement: short-term productivity gains outweighed by quality problems and turnover - not a good approach on its own (AO4).']),
    Q(9, 'Assess whether the change in Orbit Logistics Ltd’s employee turnover and employee costs suggests that its human resource management is ineffective.\nCalculate the rate of employee turnover for 2024 to support your answer.', [
        'Quantitative skills: Employee turnover = leavers ÷ average employees × 100 (AO1). Average employees = (480 + 520) ÷ 2 = %.0f; turnover = 130 ÷ %.0f × 100 = %.1f%% (AO2). Own Figure Rule applies.' % (ob_avg, ob_avg, ob_turn),
        'Turnover in 2023 (72 leavers ÷ 480) = 15.0%%; 2024 = %.1f%%, much higher (AO3). Employee costs as a percentage of revenue rose from %.1f%% to %.1f%% (AO3).' % (ob_turn, ob_pct[0], ob_pct[1]),
        'Evaluation: higher turnover increases recruitment/training costs and reduces experience; but the labour market and pay near the minimum may be external causes; need benchmarks and exit-interview data (AO4). Judgement on effectiveness.']),
    Q(15, 'Evaluate (1) delayering and (2) an employee development programme as ways of improving motivation at Orbit Logistics and recommend which one Jade should choose.', [
        'Delayering: wider spans, faster decisions, empowerment (Herzberg: responsibility, achievement), lower management costs; but job losses/redundancies, overloaded managers, short-term disruption (AO1, AO2, AO3).',
        'Development programme: training and promotion routes meet esteem and growth needs (Maslow), improve retention and skills, reduce recruitment costs; costs and time, and no guarantee staff stay after training (AO1, AO2, AO3).',
        'Link to data: turnover of %.1f%% and employee costs of %.1f%% of revenue (AO2). Sophisticated concepts: Maslow, Herzberg, Hackman, transformational leadership, employee costs ratio.' % (ob_turn, ob_pct[1]),
        'Evaluation: weigh cost, speed and likely effect; delayering fits the autocratic structure problem; development addresses retention; a combined approach is possible; recommendation must be justified (AO4).'])]

fs_cap, fs_out = 900.0, 765.0
fs_util = fs_out / fs_cap * 100
fs_fc, fs_price, fs_vc = 1_800_000, 6.0, 3.6
fs_bep = fs_fc / (fs_price - fs_vc)
fs_vol = 900_000
fs_mos = fs_vol - fs_bep

P2_B = case('Source B: Fieldstone Foods plc', [
    'Fieldstone Foods plc makes frozen ready meals in one large factory. It sells to supermarkets which place orders at short notice and demand high quality. In 2024 the factory used Just in Time (JIT) for most ingredients, but a supplier delivery failure in March stopped production for four days and cost the business £1.2m in lost sales and fines.',
    'Fieldstone’s main ingredient supplier, based overseas, was accused by a newspaper of using unsafe working conditions. The operations director, Tomás Rey, says the supplier is “the only one that can meet our volumes at our price” but admits the company does not have a supplier code of conduct and has never audited the factory. Supermarket customers have said that they expect suppliers to be “fully traceable and ethical”.',
    'Tomás is considering two options: (1) moving from JIT to holding larger safety inventories of ingredients; or (2) investing £2m in new automated packing equipment to raise productivity and reduce waste.',
], [('Appendix A: Fieldstone Foods plc operating and cost data, 2024', ['', ''], [['Maximum capacity (000 meals per month)', '%.0f' % fs_cap], ['Actual output (000 meals per month)', '%.0f' % fs_out], ['Selling price per meal', '£%.2f' % fs_price], ['Variable cost per meal', '£%.2f' % fs_vc], ['Fixed costs per year', '£%s' % '{:,}'.format(fs_fc)], ['Annual output (meals)', '{:,}'.format(fs_vol)]], 'Assume all output is sold.')])

P2_B_Q = [
    Q(6, 'Fieldstone Foods plc has no supplier code of conduct.\nAnalyse one way in which introducing a supplier code of conduct and audits might affect Fieldstone’s reputation.', [
        'Supplier code of conduct: standards suppliers must meet, checked by audits (AO1).',
        'The overseas supplier was accused of unsafe conditions; supermarkets expect traceable, ethical supply (AO2).',
        'Audits would show Fieldstone acts on ethical issues → reduces risk of bad publicity → protects its reputation with supermarkets and consumers and secures contracts (AO3).']),
    Q(6, 'A delivery failure stopped production for four days.\nAnalyse one way in which a supply chain disruption might reduce Fieldstone’s capacity utilisation.', [
        'Capacity utilisation: actual output ÷ maximum capacity (AO1).',
        'With JIT there were no inventories; production stopped for four days (AO2).',
        'Lost production reduces output relative to capacity → fixed costs spread over fewer meals → higher unit cost and lower profit (AO3).']),
    Q(9, 'Assess whether Fieldstone Foods plc’s factory is operating efficiently.\nCalculate its capacity utilisation to support your answer.', [
        'Quantitative skills: Capacity utilisation = actual output ÷ maximum capacity × 100 (AO1) = 765 ÷ 900 × 100 = %.0f%% (AO2). Own Figure Rule applies.' % fs_util,
        'Interpretation: 15% spare capacity; fixed costs are spread over fewer meals than at full capacity (AO3).',
        'Further analysis: the supply disruption may explain the shortfall; some spare capacity helps meet short-notice orders; 85% is reasonable for a food factory; benchmarks needed (AO3, AO4). Judgement (AO4).']),
    Q(9, 'Assess whether Fieldstone Foods plc is in a safe position in terms of break-even.\nCalculate the break-even output and the margin of safety to support your answer.', [
        'Quantitative skills: Contribution per meal = £6.00 − £3.60 = £2.40 (AO1). Break-even output = 1 800 000 ÷ 2.40 = %s meals (AO2). Margin of safety = 900 000 − %s = %s meals (%.0f%% of output) (AO2). Own Figure Rule applies.' % ('{:,.0f}'.format(fs_bep), '{:,.0f}'.format(fs_bep), '{:,.0f}'.format(fs_mos), fs_mos / fs_vol * 100),
        'Interpretation: output is 20% above break-even, giving a buffer (AO3).',
        'Evaluation: a further disruption of a few weeks could eliminate the margin of safety; costs/prices may change; supermarkets can demand lower prices (AO3, AO4). Judgement on safety (AO4).']),
    Q(15, 'Evaluate (1) holding larger safety inventories and (2) investing £2m in automated packing equipment as ways of improving Fieldstone’s competitiveness and recommend which one Tomás should choose.', [
        'Larger inventories: reduces risk of stock-outs (JIC) and protects supply to supermarkets; storage, insurance and cash costs; waste for perishable ingredients; does not address ethical concerns (AO1, AO2, AO3).',
        'Automation: higher productivity, lower unit costs and waste, consistent quality; £2m cost, financing and payback, job losses, risk of breakdown; may help with capacity (AO1, AO2, AO3).',
        'Use the data: break-even %s meals, capacity utilisation %.0f%%, contribution £2.40 (AO2). Sophisticated concepts: JIT v JIC, lean production, investment appraisal, supply chain management.' % ('{:,.0f}'.format(fs_bep), fs_util),
        'Judgement: the supply failure cost £1.2m - larger inventory addresses the immediate risk; automation addresses long-term cost; recommendation may be inventory first or combined; must be justified (AO4).'])]

# ═════════════════ PAPER 3 · Unit 3.3 ═════════════════
na_price, na_rate0, na_rate1 = 18_000, 1.18, 1.05
na_eur0, na_eur1 = na_price * na_rate0, na_price * na_rate1

P3_A = case('Source A: Nova Auto Parts plc', [
    'Nova Auto Parts plc manufactures braking systems in the UK. It sells 60% of its output to car makers in the eurozone and imports steel components from Turkey. A new trade agreement has removed tariffs on parts sold to Asia, but the EU has introduced new rules on recycled materials which may increase Nova’s costs.',
    'Nova faces strong competition from low-cost manufacturers in Eastern Europe and from large rivals which supply car makers across the world. A small number of car makers account for most of the industry’s demand, and they can switch suppliers easily. Developing electric vehicles is changing demand for brake components. The pound has fallen against the euro in recent months.',
    'The board is considering two strategies: (1) market development by selling its existing products to car makers in Asia; or (2) new product development of lighter, recyclable brakes for electric vehicles.',
], [('Appendix A: Exchange rates (euros per £1)', ['', 'January', 'June'], [['£ to €', '%.2f' % na_rate0, '%.2f' % na_rate1]], 'Nova sells a braking system to a eurozone car maker for £18 000. Assume the price is set in pounds.'),
    ('Appendix B: Strategic options (fictional estimates)', ['', 'Option 1 Asia', 'Option 2 Electric brakes'], [['Investment', '£12m', '£18m'], ['Time to first sales', '12 months', '30 months'], ['Forecast annual profit at maturity', '£4m', '£7m'], ['Main risk', 'Unfamiliar markets', 'Technology may not be accepted']], None)])

P3_A_Q = [
    Q(6, 'Analyse one way in which the EU’s new rules on recycled materials might affect Nova Auto Parts’ profit.', [
        'Environmental/legal regulation: laws that require businesses to meet standards (AO1).',
        'Nova sells 60% of output to the eurozone so must comply (AO2).',
        'Compliance requires new materials/processes → higher costs → lower profit margins unless prices rise (AO3). Could also create opportunities (recyclable brakes) (AO3).']),
    Q(6, 'Use Porter’s five forces to analyse one way in which buyer power affects Nova Auto Parts.', [
        'Buyer power: ability of customers to force down prices or demand better terms (AO1).',
        'A small number of car makers account for most demand and can switch suppliers easily (AO2).',
        'High buyer power → Nova must accept lower prices or higher quality standards → lower profit margins and weaker bargaining position (AO3).']),
    Q(9, 'Assess the likely effect on Nova Auto Parts of the fall in the value of the pound against the euro.\nCalculate the euro price of the £18 000 braking system in January and in June to support your answer.', [
        'Quantitative skills: January price in euros = £18 000 × 1.18 = €%s; June = £18 000 × 1.05 = €%s (AO2). Own Figure Rule applies.' % ('{:,.0f}'.format(na_eur0), '{:,.0f}'.format(na_eur1)),
        'Interpretation (AO3): the euro price has fallen by €%s (%.1f%%), so the product is more price competitive in the eurozone and demand is likely to rise (if price elastic).' % ('{:,.0f}'.format(na_eur0 - na_eur1), (na_eur0 - na_eur1) / na_eur0 * 100),
        'Counter-argument (AO3): steel components are imported from Turkey - the weaker pound raises costs; if Nova prices in pounds its revenue per sale is unchanged but if it cuts euro prices revenue in pounds falls (AO3).',
        'Judgement: on balance likely to help exporters in the short term, but depends on price elasticity, Nova’s import costs and how long the weakness lasts (AO4).']),
    Q(9, 'Assess whether the new trade agreement with Asia will increase Nova Auto Parts’ profit.', [
        'Trade agreement: removes tariffs, making UK goods cheaper in Asia (AO1).',
        'Nova can sell existing braking systems to car makers in Asia at lower prices; new market → more sales and economies of scale (AO2, AO3).',
        'Against: transport costs, competition from local suppliers, currency risk, cultural differences; time to build relationships (AO3).',
        'Judgement depends on the size of the market, Nova’s competitiveness and costs (AO4).']),
    Q(15, 'Evaluate (1) selling existing products to car makers in Asia and (2) developing lighter, recyclable brakes for electric vehicles as strategies for Nova Auto Parts and recommend which one it should choose.', [
        'Option 1 (market development): lower risk (Ansoff), faster (12 months), lower investment (£12m), tariffs removed; profit forecast £4m; risks of new markets, competition and exchange rates; payback 3 years (AO1, AO2, AO3).',
        'Option 2 (new product development): higher profit forecast (£7m), matches the shift to EVs, meets EU recycled-material rules, differentiation; £18m cost, 30 months, technology risk; payback about 2.6 years at maturity (AO1, AO2, AO3).',
        'Sophisticated concepts: Ansoff matrix, product life cycle, investment appraisal (payback/ARR), five forces, strategic drift if Nova fails to adapt to EVs (AO3).',
        'Judgement: weigh short-term returns v long-term competitiveness; consider finance and risk; Option 2 may protect long-term survival while Option 1 provides earlier cash - recommendation must be supported; challenge the fictional estimates (AO4).'])]

P3_B = case('Source B: Meridian Energy Ltd', [
    'Meridian Energy Ltd supplies electricity and gas to 1.2 million UK homes. It owns two gas-fired power stations and has recently been criticised by an environmental group for its “net zero by 2035” advertising campaign, which did not mention that 70% of its electricity still came from gas. Meridian says it is “committed to a just transition”.',
    'The government has announced a tax on carbon emissions and customers are increasingly choosing suppliers with renewable energy. Meridian’s chief executive, Sana Qureshi, wants to change the culture and strategy of the business, but employees at the power stations fear job losses and some managers resist change. A recent survey shows that only 31% of staff understand the new strategy.',
    'Meridian is considering (1) building a large wind farm financed by a new share issue, or (2) acquiring a smaller renewable energy supplier, Greenfield Power.',
], [('Appendix A: Meridian Energy Ltd selected data', ['', '2023', '2024'], [['Electricity from renewable sources', '22%', '30%'], ['Customers lost to renewable suppliers (000)', '40', '95'], ['Carbon emissions (million tonnes)', '3.1', '3.0'], ['Staff who understand the new strategy', '–', '31%']], None)])

P3_B_Q = [
    Q(6, 'Meridian Energy’s advertising campaign has been criticised as “greenwashing”.\nAnalyse one way in which the accusation of greenwashing might affect Meridian’s profits.', [
        'Greenwashing: misleading claims about environmental performance for PR (AO1).',
        'The campaign claimed net zero by 2035 but 70% of electricity still came from gas (AO2).',
        'Loss of trust and negative publicity → customers switch to suppliers they believe are genuine (95 000 customers lost) → lower revenue and profit; possible regulatory action (AO3).']),
    Q(6, 'Meridian Energy faces a new government tax on carbon emissions.\nAnalyse one way in which the tax might affect Meridian’s costs.', [
        'Government tax on carbon emissions: an environmental policy that raises the cost of polluting (AO1).',
        'Meridian’s gas-fired power stations emit around 3.0 million tonnes (AO2).',
        'Tax per tonne × emissions → higher costs → lower profit unless prices rise (which may lose customers) or Meridian reduces emissions (AO3).']),
    Q(9, 'Assess whether Meridian Energy should be concerned about employees’ resistance to change.', [
        'Resistance (Kotter and Schlesinger): self-interest, misunderstanding, low tolerance, different assessments (AO1).',
        'Power-station staff fear job losses; only 31% understand the strategy (AO2). Resistance could delay change, reduce productivity and cause leaders to lose staff (AO3).',
        'Management can use communication, involvement, retraining and negotiation; Lewin: strengthen driving forces (customers lost, carbon tax) and weaken restraining forces (fear) (AO3).',
        'Judgement: significant risk but manageable if addressed early (AO4).']),
    Q(9, 'Assess whether the environmental, social and governance (ESG) data in Appendix A suggests that Meridian’s strategy is working.', [
        'ESG: reporting on environmental, social and governance performance (AO1).',
        'Renewable share rose from 22% to 30%, but emissions fell only 3% (3.1 → 3.0 million tonnes) and 55 000 more customers were lost (95 000 v 40 000) (AO2, AO3).',
        'Only 31% of staff understand the strategy (social/governance weakness) (AO3).',
        'Judgement: progress but too slow to retain customers and avoid the carbon tax; limited data and one year (AO4). Challenge the data: company-reported.']),
    Q(15, 'Evaluate (1) building a wind farm financed by a new share issue and (2) acquiring Greenfield Power as strategies for Meridian and recommend which one it should choose.', [
        'Wind farm: organic growth, control, lowers emissions and carbon tax cost, genuine ESG improvement; high cost, long construction time, share issue dilutes ownership and may reduce share price, planning/regulation (AO1, AO2, AO3).',
        'Acquisition: fast access to renewable customers and capacity, brand credibility; purchase cost, integration and culture clash (employees already resist change), risk of overpaying (AO1, AO2, AO3).',
        'Sophisticated concepts: Triple Bottom Line, stakeholder approach, Ansoff, Lewin, investment appraisal, economies of scale (AO3).',
        'Judgement: given customer loss and tax, speed matters; acquisition is faster but riskier with culture; wind farm is slower but credible; recommendation justified using the context and possible challenges to the data (AO4).'])]


def papers():
    return [paper('a', 1, SET, P1_A, P1_A_Q, P1_B, P1_B_Q), paper('a', 2, SET, P2_A, P2_A_Q, P2_B, P2_B_Q), paper('a', 3, SET, P3_A, P3_A_Q, P3_B, P3_B_Q)]
