"""RA10 practice papers, Set D (AQA 7132 format). Same data shapes as the pp27 sets. Every calculation is computed from its own data."""
import random


def _shuffle(correct, wrongs, seed):
    opts = [correct] + list(wrongs)
    random.Random(seed).shuffle(opts)
    return opts, 'ABCD'[opts.index(correct)]


def mcq(q, correct, wrongs, why, spec, seed):
    o, a = _shuffle(correct, wrongs, seed)
    return {'q': q, 'opts': o, 'ans': a, 'why': why, 'spec': spec}


def stmt(s1, t1, s2, t2, why, spec):
    ans = {(True, True): 'A', (True, False): 'B', (False, True): 'C', (False, False): 'D'}[(t1, t2)]
    return {'q': "Statement 1: '%s'\nStatement 2: '%s'" % (s1, s2), 'statements': True, 'ans': ans, 'why': why, 'spec': spec}


# ───────────────────────── PAPER 1 ─────────────────────────
CA, INV, CL = 48.0, 20.0, 30.0
LT_START, LT_END, LEAVERS = 1200, 1000, 154
_avg = (LT_START + LT_END) / 2
_lt = LEAVERS / _avg * 100

P1_D = {
    'mcq': [
        mcq('Which one of the following is a feature of a public limited company (plc)?', 'Its shares can be bought by the general public on a stock exchange.', ['The owners have unlimited liability.', 'It can only have one shareholder.', 'It is not allowed to pay dividends.'], 'A plc may offer shares to the public, and shareholders have limited liability.', '3.1.2', 101),
        stmt('Mission statements are always expressed in numbers.', False, 'Objectives should be measurable.', True, 'A mission is a qualitative statement of purpose; objectives translate it into measurable targets.', '3.1.1'),
        mcq('A rise in the exchange rate value of the pound is most likely to:', 'reduce the pound cost of imported raw materials.', ['make UK exports cheaper for overseas buyers.', 'increase the number of overseas tourists visiting the UK.', 'raise the price of imported goods in UK shops.'], 'A stronger pound buys more foreign currency, so imports cost fewer pounds; exports become dearer abroad.', '3.7.5', 103),
        mcq('A manager makes decisions alone but explains the reasons to employees. This is:', 'paternalistic leadership.', ['autocratic leadership.', 'democratic leadership.', 'laissez-faire leadership.'], 'Paternalistic leaders decide but explain and consider employees’ needs; autocratic leaders do not explain.', '3.2.1', 104),
        mcq('In the Boston Matrix, a product with a high market share in a low-growth market is a:', 'cash cow.', ['star.', 'question mark.', 'dog.'], 'High share/low growth = cash cow: generates cash with little need for investment.', '3.3.4', 105),
        mcq('A business sells 2 000 units at £15. Variable cost is £9 per unit and fixed costs are £8 000. What is its profit?', '£4 000', ['£10 000', '£12 000', '£22 000'], 'Revenue £30 000 − (£8 000 + 2 000 × £9 = £26 000) = £4 000. £12 000 is the total contribution.', '3.5.2', 106),
        stmt('Labour turnover = number of leavers ÷ average number of employees × 100.', True, 'A high labour turnover always shows that management is poor.', False, 'The formula is correct; but high turnover can have other causes (e.g. seasonal work, a tight labour market).', '3.6.2'),
        mcq('Which one of the following is a benefit of Just in Time (JIT) inventory management?', 'Lower inventory holding costs.', ['Greater ability to meet sudden rises in demand.', 'Bulk-buying discounts.', 'Protection from supplier delays.'], 'JIT cuts storage costs and waste; it increases risk from late deliveries.', '3.4.3', 108),
        mcq('In stakeholder mapping, stakeholders with high power but low interest should usually be:', 'kept satisfied.', ['managed closely.', 'kept informed.', 'monitored only.'], 'High power/low interest = keep satisfied; high power/high interest = manage closely.', '3.2.3', 109),
        mcq('A factory has a maximum output of 12 000 units a month and produced 9 000 units. Its capacity utilisation is:', '75%', ['25%', '133%', '90%'], '9 000 ÷ 12 000 × 100 = 75%.', '3.4.2', 110),
        stmt('Retained profit is an internal source of finance.', True, 'A bank overdraft is a source of long-term finance.', False, 'Retained profit comes from inside the business; overdrafts are short-term external finance.', '3.5.3'),
        mcq('Price skimming is most likely to be suitable when:', 'a product is new and has few close substitutes.', ['demand is highly price elastic.', 'the main aim is to win market share quickly.', 'the market is saturated.'], 'Skimming sets a high initial price for a distinctive product to earn high margins from early adopters.', '3.3.4', 112),
        mcq('Which one of the following is one of Kotter and Schlesinger’s ways of overcoming resistance to change?', 'Education and communication', ['Delayering', 'Intrapreneurship', 'Kaizen'], 'Kotter and Schlesinger: education & communication, participation & involvement, facilitation & support, negotiation, manipulation & co-optation, coercion.', '3.10.1', 113),
        stmt('Taking over a supplier is an example of backward vertical integration.', True, 'Horizontal integration is the combination of firms at different stages of production.', False, 'Horizontal integration joins firms at the SAME stage; vertical joins different stages.', '3.9.1'),
        mcq('A project costs £50 000. The present value of its future cash inflows is £58 000. Its net present value is:', '£8 000', ['−£8 000', '£58 000', '£108 000'], 'NPV = PV of inflows − initial cost = £58 000 − £50 000 = £8 000 (positive, so acceptable on this criterion).', '3.7.8', 115),
    ],
    'b': [
        {'n': 16, 'marks': 4, 'kind': 'calc', 'spec': '3.7.2',
         'q': "A business has current assets of £%dm, of which inventories are £%dm, and current liabilities of £%dm.\nCalculate the business's current ratio.\nShow your working." % (CA, INV, CL),
         'answer': 'Current ratio = current assets : current liabilities = %.0f / %.0f = %.1f : 1.' % (CA, CL, CA / CL),
         'points': ['1 mark: formula current assets ÷ current liabilities (or CA : CL).', '1 mark: current assets £48m (inventories are already included - do not subtract them).', '1 mark: current liabilities £30m.', '1 mark: 1.6 : 1 (accept 1.6). No unit such as £ or %.']},
        {'n': 17, 'marks': 4, 'kind': 'calc', 'spec': '3.6.2',
         'q': 'A business employed %s people at the start of the year and %s at the end. %d employees left during the year.\nCalculate the rate of labour turnover.\nShow your working.' % ('{:,}'.format(LT_START), '{:,}'.format(LT_END), LEAVERS),
         'answer': 'Average employees = (1 200 + 1 000) / 2 = %.0f. Labour turnover = 154 / 1 100 × 100 = %.0f%%.' % (_avg, _lt),
         'points': ['1 mark: average number of employees = (opening + closing) ÷ 2.', '1 mark: 1 100.', '1 mark: leavers ÷ average employees × 100.', '1 mark: 14% (accept 14.0%). OFR if average wrongly calculated.']},
        {'n': 18, 'marks': 9, 'kind': 'analyse', 'spec': '3.5.3 / 3.7.2', 'q': 'Analyse how a high level of gearing might affect a business’s decisions about how to finance expansion.',
         'content': ['Gearing = non-current liabilities ÷ capital employed × 100; high gearing means most capital is debt.',
                     'Lenders see high gearing as risky - they may refuse further loans or charge higher interest, so the business may rely on retained profit or share capital instead.',
                     'Interest must be paid whatever the profit - in a downturn or if interest rates rise, high gearing can threaten survival, so managers may delay expansion.',
                     'Equity finance (new shares, venture capital) lowers gearing but dilutes ownership/control and may need shareholder approval.',
                     'Credit developed chains using context from the stem (e.g. a 70% geared retailer in a recession).']},
        {'n': 19, 'marks': 9, 'kind': 'analyse', 'spec': '3.3.4', 'q': 'Analyse how a business might use social media as part of its promotional mix.',
         'content': ['Targeted, low-cost advertising: platforms let a business reach specific age/interest groups, improving cost-effectiveness compared with TV/print.',
                     'Two-way communication and relationship marketing: replies, user content and reviews build engagement and loyalty.',
                     'Viral marketing/influencers: shared content can reach many customers cheaply and raise brand awareness quickly.',
                     'Data: engagement data helps market research and pricing/promotion decisions.',
                     'Needs good content, staff time and moderation; negative comments spread quickly - so developed answers link to the type of business.']},
        {'n': 20, 'marks': 9, 'kind': 'analyse', 'spec': '3.6.3 / 3.10.1', 'q': 'Analyse the benefits to a business of delayering.',
         'content': ['Delayering removes levels of hierarchy, widening spans of control.',
                     'Faster communication and decision making - improves speed of response to customers and flexibility.',
                     'Lower employee costs (fewer managers) - improves profit and unit costs.',
                     'More delegation/empowerment can motivate remaining staff (Herzberg: responsibility, achievement).',
                     'Developed answers show the chain (e.g. fewer layers → quicker feedback → faster response) in context; no need to evaluate.']},
    ],
    'c': [
        {'n': 21, 'spec': '3.2.2', 'q': 'To what extent is a decision tree the best way for a business to make an important decision?',
         'for': ['Quantifies options: expected value and net gain allow like-for-like comparison and make assumptions explicit.', 'Forces managers to consider risk and probability, not just rewards.', 'Useful for one-off, high-cost decisions with clear options (e.g. launch v do nothing).'],
         'against': ['Probabilities and payoffs are estimates - garbage in, garbage out; false precision.', 'Ignores qualitative factors: ethics, brand, employee reaction, mission.', 'Intuition/experience may be better in fast-changing or novel situations; too slow for small decisions.', 'Ignores the time value of money unless discounted.'],
         'judge': 'Decision trees are a valuable aid for decisions with measurable outcomes, but rarely the only or best method; combine with qualitative judgement. It depends on data quality, uncertainty and stakes.'},
        {'n': 22, 'spec': '3.1.1 / 3.7.1', 'q': "'A business can only be successful if it has a clear mission statement.'\nDo you agree?",
         'for': ['Gives direction and a link to objectives and strategy; helps decisions be consistent.', 'Motivates and aligns employees; communicates values to customers and investors.', 'Helps resolve stakeholder conflict.'],
         'against': ['Many successful small/new businesses have no formal mission - success depends on products, management, finance and market conditions.', 'A mission can be vague or ignored (ethical lapses despite grand statements).', 'Short-term survival often depends on cash flow, not mission.'],
         'judge': 'A clear mission helps, especially as a business grows, but it is not necessary or sufficient; whether it is used in practice matters more.'},
    ],
    'd': [
        {'n': 23, 'spec': '3.9.4 / 3.8.2', 'q': 'Will investing in new technology always improve a business’s competitiveness?',
         'for': ['Automation and e-commerce can cut unit costs and widen markets - cost leadership or differentiation.', 'Data and AI improve decisions and customer service; faster, more flexible operations.', 'Competitors that invest first may gain an advantage that is hard to copy.'],
         'against': ['High cost and long payback; may not be recouped (investment appraisal).', 'Staff resistance, skill gaps, implementation failure.', 'Technology is easily copied or quickly obsolete - no sustained advantage.', 'In labour-intensive/personal service businesses, customers may value human contact.'],
         'judge': 'Technology improves competitiveness only when it fits strategy, is well implemented and is hard for rivals to copy; it depends on the industry and timescale.'},
        {'n': 24, 'spec': '3.7.6', 'q': "'Corporate social responsibility is just a cost to a business.'\nDiscuss.",
         'for': ['Higher costs: ethical sourcing, recycling, fair pay reduce short-term profit; shareholders may object (shareholder concept).', 'Spending may not change customer behaviour if customers are price-focused.'],
         'against': ['Brand and loyalty benefits, price premium, easier recruitment and retention.', 'Reduces risk of fines, boycotts and bad publicity; Carroll’s pyramid - legal and ethical duties are part of doing business.', 'Triple bottom line - long-term success depends on people and planet too.'],
         'judge': 'In the short run CSR can be a cost, but in the long run it is often an investment; the net effect depends on the industry, customer attitudes and how genuine the policy is.'},
    ],
}

# ───────────────────────── PAPER 2 ─────────────────────────
HF = {'rev': (84.0, 91.0), 'cos': (50.4, 58.5), 'pay': (7.2, 11.8), 'inv': (6.0, 9.0)}
_hf_gp = [(HF['rev'][i] - HF['cos'][i]) / HF['rev'][i] * 100 for i in (0, 1)]
_hf_pd = [HF['pay'][i] / HF['cos'][i] * 365 for i in (0, 1)]

DW = {'seats': 60, 'buses': 40, 'trips_day': 12, 'pass_day': 19200, 'cost_m': 21.6, 'miles': (5.2, 4.8)}
_dw_cap = DW['seats'] * DW['buses'] * DW['trips_day']
_dw_util = DW['pass_day'] / _dw_cap * 100
_dw_pass_year = DW['pass_day'] * 365
_dw_cpp = DW['cost_m'] * 1e6 / _dw_pass_year

MS = {'emp': (140, 154), 'leave': (14, 31), 'out': (1260, 1232), 'rev': 17.5, 'wage_m': 6.3}
_ms_avg = (MS['emp'][0] + MS['emp'][1]) / 2
_ms_lt = MS['leave'][1] / MS['emp'][1] * 100
_ms_prod = [MS['out'][0] / MS['emp'][0], MS['out'][1] / MS['emp'][1]]

P2_D = [
    {'title': 'Hollin Foods Ltd',
     'text': ['Hollin Foods Ltd makes chilled ready meals sold under its own brand in UK supermarkets and, increasingly, under supermarkets’ own labels. The company is one of the five largest producers in a market that is growing slowly. Hollin’s meals are priced 25% above those of the supermarkets’ own brands, and it has traditionally relied on its reputation for taste.',
              'In 2024 the cost of ingredients and energy rose sharply. Hollin responded by taking longer to pay its suppliers and by increasing its inventory of ingredients, which it bought in bulk before prices rose further. Supermarkets, which account for 90% of Hollin’s sales, have asked it to cut prices. Hollin’s directors are considering whether to accept a large contract to make a supermarket’s own-label range or to raise prices on its branded range by 8%.'],
     'appendices': [
         {'title': 'Appendix A  Selected financial information for Hollin Foods Ltd (£m)', 'table': [['', '2023', '2024'], ['Revenue', '%.1f' % HF['rev'][0], '%.1f' % HF['rev'][1]], ['Cost of sales', '%.1f' % HF['cos'][0], '%.1f' % HF['cos'][1]], ['Payables', '%.1f' % HF['pay'][0], '%.1f' % HF['pay'][1]], ['Inventories', '%.1f' % HF['inv'][0], '%.1f' % HF['inv'][1]]]},
         {'title': 'Appendix B  Estimated price elasticity of demand (PED)', 'table': [['Product', 'PED'], ['Hollin branded ready meals', '−0.6'], ['Supermarket own-label ready meals', '−1.7']]},
         {'title': 'Appendix C  Own-label contract offer', 'table': [['', 'Branded range (current)', 'Own-label contract'], ['Annual volume (million meals)', '14', '9'], ['Average price per meal', '£4.20', '£3.10'], ['Variable cost per meal', '£2.95', '£2.55']], 'note': 'The own-label contract would use spare capacity; no extra fixed costs.'}],
     'parts': [
         {'n': '1.1', 'marks': 4, 'kind': 'calc', 'spec': '3.7.2', 'q': 'Using Appendix A, calculate Hollin Foods Ltd’s payables days for 2024.\nShow your working.',
          'answer': 'Payables days = payables ÷ cost of sales × 365 = 11.8 ÷ 58.5 × 365 = %.1f days (2023: %.1f).' % (_hf_pd[1], _hf_pd[0]),
          'points': ['1 mark: formula payables ÷ cost of sales × 365.', '1 mark: payables £11.8m.', '1 mark: cost of sales £58.5m (not revenue).', '1 mark: %.1f days (accept 73.6 or 74 days).' % _hf_pd[1]]},
         {'n': '1.2', 'marks': 4, 'kind': 'short', 'spec': '3.5.2', 'q': 'Using Appendix A, explain one reason why Hollin Foods Ltd’s gross profit margin fell from %.1f%% in 2023 to %.1f%% in 2024.' % (_hf_gp[0], _hf_gp[1]),
          'content': ['Cost of sales rose by 16.1% (50.4 to 58.5) but revenue by only 8.3% (84.0 to 91.0).', 'Reason: ingredient and energy costs rose sharply and Hollin did not pass the full increase on in price (supermarkets pressed it to hold prices) - so each £ of sales earned less gross profit.', 'Marks: 1 for a reason, 1 for data, 2 for explaining the effect on the margin (developed).']},
         {'n': '1.3', 'marks': 9, 'kind': 'analyse', 'spec': '3.3.2', 'q': 'Using Appendix B, analyse the impact on Hollin Foods Ltd of raising the price of its branded ready meals by 8%.',
          'content': ['PED −0.6 is inelastic: an 8% rise cuts volume by about 4.8% (0.6 × 8) - a smaller % fall than the % rise, so revenue rises (≈ +2.8%).', 'Revenue 14m meals × £4.20 = £58.8m; after: 13.33m × £4.54 = £60.5m - and lower volume reduces variable costs, so profit rises by more.', 'Helps offset higher ingredient and energy costs.', 'BUT: PED is an estimate; supermarkets may react (shelf space, own-label promotion) and long-term elasticity tends to be higher; brand image may suffer if customers see no extra value.', 'Developed answers use PED to link price change to revenue in context.']},
         {'n': '1.4', 'marks': 16, 'kind': 'evaluate', 'spec': '3.7.8 / 3.5.2', 'q': 'Should Hollin Foods Ltd accept the own-label contract?\nUse Appendix C and other information in your answer.',
          'content': ['Contribution per meal: own-label £3.10 − £2.55 = £0.55 × 9m = £4.95m extra contribution (no extra fixed costs) - improves profit and uses spare capacity.', 'Current branded range: (£4.20 − £2.95) × 14m = £17.5m contribution - own-label adds 28%.', 'Against: risk of cannibalisation - supermarkets may switch customers to cheaper own-label; strengthens buyer power (90% of sales to supermarkets); lowers brand exclusivity; dependence on one buyer.', 'Capacity is spare, so no extra fixed costs - but only if capacity is truly spare; own-label demand is elastic (PED −1.7), so supermarket may cut prices later.', 'Cash flow: bigger inventory and longer payables already show cash pressure - extra production needs working capital.', 'Judgement: attractive on contribution but strategic risk; depends on contract length, cannibalisation, and whether Hollin can protect its brand (e.g. restrict the range).']}]},
    {'title': 'Dalesway Buses plc',
     'text': ['Dalesway Buses plc operates 40 buses in a mid-sized English city. It is the only large operator on most routes but competes with cars, taxis and, in some areas, with a new tram line. The company’s buses have 60 seats and each makes 12 trips a day on weekdays. Fares are regulated on some routes.',
              'Dalesway’s managers are concerned about rising costs, particularly fuel, and a shortage of drivers, which has forced it to cancel some services. It plans to buy ten electric buses to cut running costs and meet new emissions rules, financed by a bank loan. A trade union has asked for a pay rise of 6% for drivers.'],
     'appendices': [
         {'title': 'Appendix A  Operating data, average weekday', 'table': [['Number of buses', '%d' % DW['buses']], ['Seats per bus', '%d' % DW['seats']], ['Trips per bus per day', '%d' % DW['trips_day']], ['Passenger journeys per day', '{:,}'.format(DW['pass_day'])], ['Total annual operating costs', '£%.1fm' % DW['cost_m']]], 'note': 'Assume the same number of passenger journeys every day of the year (365 days).'},
         {'title': 'Appendix B  Average miles per gallon / driver turnover', 'table': [['', '2023', '2024'], ['Miles per gallon (diesel fleet)', '%.1f' % DW['miles'][0], '%.1f' % DW['miles'][1]], ['Driver labour turnover', '12%', '24%']]}],
     'parts': [
         {'n': '2.1', 'marks': 3, 'kind': 'calc', 'spec': '3.4.2', 'q': 'Using Appendix A, calculate Dalesway Buses’ capacity utilisation on an average weekday.\nShow your working.',
          'answer': 'Capacity = 40 × 60 × 12 = %s passenger journeys. Utilisation = %s / %s × 100 = %.0f%%.' % ('{:,}'.format(_dw_cap), '{:,}'.format(DW['pass_day']), '{:,}'.format(_dw_cap), _dw_util),
          'points': ['1 mark: capacity = buses × seats × trips = 28 800.', '1 mark: actual ÷ capacity × 100.', '1 mark: %.0f%% (accept 67%%).' % _dw_util]},
         {'n': '2.2', 'marks': 6, 'kind': 'short', 'spec': '3.4.2', 'q': 'Using Appendix A, calculate the average operating cost per passenger journey and explain one way Dalesway could reduce it.',
          'content': ['Passenger journeys per year = 19 200 × 365 = %s; cost per journey = £21.6m ÷ %s = £%.2f.' % ('{:,}'.format(_dw_pass_year), '{:,}'.format(_dw_pass_year), _dw_cpp), 'Way to reduce cost per journey: increase capacity utilisation (spreading fixed costs over more passengers) e.g. by changing timetables, cutting low-use trips or promoting off-peak travel; or increase efficiency (electric buses lower fuel cost; better driver rotas).', 'Marks: 3 for calculation (method, figures, answer); up to 3 for explained way applied to Dalesway (levels).']},
         {'n': '2.3', 'marks': 9, 'kind': 'analyse', 'spec': '3.6.2 / 3.6.4', 'q': 'Using Appendix B and other information, analyse the possible consequences for Dalesway Buses plc of its high driver labour turnover.',
          'content': ['Labour turnover doubled from 12% to 24% - one in four drivers leave each year.', 'Costs of recruitment and training; temporary driver cover at overtime rates - raises unit costs.', 'Cancelled services reduce revenue and customer satisfaction/loyalty; lower capacity utilisation and reputation damage.', 'Shortage of drivers may force pay rises (6% claim) - raises costs further; may signal low motivation (pay, shift patterns - Herzberg hygiene factors).', 'Loss of experience can reduce safety and service quality.']},
         {'n': '2.4', 'marks': 16, 'kind': 'evaluate', 'spec': '3.7.8 / 3.9.4', 'q': 'To what extent is investing in ten electric buses the best way for Dalesway Buses plc to improve its financial performance?',
          'content': ['For: lower fuel and maintenance costs per mile; helps meet emissions rules/avoid fines; green image may raise demand and allow regulated access; government grants may reduce cost.', 'Against: high purchase cost financed by a loan - interest and repayments; increases gearing and cash flow pressure; charging infrastructure and driver training; limited range.', 'Alternatives: improve capacity utilisation, fix driver retention (pay, shifts), change timetables, raise fares on unregulated routes.', 'Fuel efficiency fell (5.2 to 4.8 mpg) - suggests old buses; but driver shortages are cutting revenue more directly.', 'Judgement: depends on payback and the cost of finance; electric buses help long-term costs but alone do not solve driver shortages/utilisation.']}]},
    {'title': 'Mirrin Software Ltd',
     'text': ['Mirrin Software Ltd develops accounting software for small businesses. It has 154 employees, mostly software developers, in a single office. The company has a strong reputation for innovation but its sales growth has slowed as larger rivals have introduced cloud-based products. Mirrin’s managing director, Callum, takes most decisions personally and has resisted employees’ requests for home working.',
              'In 2024 employee satisfaction surveys showed concerns about pay, workload and a lack of promotion opportunities. 31 employees left during the year, and the company found it hard to recruit replacements with the right skills. Callum is now considering introducing hybrid working, a performance-related bonus scheme and a new matrix structure based on product teams.'],
     'appendices': [
         {'title': 'Appendix A  Employee and output data', 'table': [['', '2023', '2024'], ['Employees at year end', '%d' % MS['emp'][0], '%d' % MS['emp'][1]], ['Leavers during the year', '%d' % MS['leave'][0], '%d' % MS['leave'][1]], ['Software licences sold (000)', '{:,}'.format(MS['out'][0]), '{:,}'.format(MS['out'][1])], ['Revenue (£m)', '%.1f' % MS['rev'], '%.1f' % MS['rev']]]},
         {'title': 'Appendix B  Survey: what employees most want (2024, % of responses)', 'table': [['Hybrid / home working', '41%'], ['Higher pay or bonus', '28%'], ['Promotion opportunities', '19%'], ['Other', '12%']]}],
     'parts': [
         {'n': '3.1', 'marks': 4, 'kind': 'calc', 'spec': '3.6.2', 'q': 'Using Appendix A, calculate Mirrin Software Ltd’s labour productivity (licences sold per employee) for 2024.\nShow your working.',
          'answer': 'Labour productivity = output ÷ employees = 1 232 000 ÷ 154 = %.0f licences per employee (2023: %.0f).' % (_ms_prod[1] * 1000, _ms_prod[0] * 1000),
          'points': ['1 mark: formula output ÷ number of employees.', '1 mark: 1 232 (000) or 1 232 000 licences.', '1 mark: 154 employees.', '1 mark: %.0f (accept 8 000). Penalise if units are given as £.' % (_ms_prod[1] * 1000)]},
         {'n': '3.2', 'marks': 4, 'kind': 'short', 'spec': '3.6.4', 'q': 'Using Appendix B, explain one reason why Mirrin Software Ltd’s employees might be more motivated by hybrid working than by a performance-related bonus.',
          'content': ['41% want hybrid working against 28% pay/bonus - more employees value it.', 'Herzberg: pay is a hygiene factor (removes dissatisfaction but does not motivate for long); flexibility gives autonomy and control over work-life balance - more lasting; Maslow: social/esteem needs.', 'Bonus may create pressure/competition among developers working in teams.', 'Marks: 1 point, 1 data, 2 development.']},
         {'n': '3.3', 'marks': 9, 'kind': 'analyse', 'spec': '3.6.3', 'q': 'Analyse how introducing a matrix structure might affect Mirrin Software Ltd.',
          'content': ['Employees report to both a functional (e.g. development) and a product manager - improves communication across teams and knowledge sharing; flexible response to products.', 'More delegation/decentralisation - speeds decisions, reduces Callum’s workload as MD (power culture).', 'Risks: conflicting instructions, role confusion, slower decisions if managers disagree; training and communication costs.', 'May motivate through team working/empowerment (Herzberg motivators); resistance from managers who lose authority (Kotter & Schlesinger).', 'Credit chains in the context of 154 software developers.']},
         {'n': '3.4', 'marks': 16, 'kind': 'evaluate', 'spec': '3.6.2 / 3.6.4', 'q': 'To what extent should Mirrin Software Ltd’s priority be to reduce labour turnover?\nUse Appendix A and other information in your answer.',
          'content': ['Labour turnover 2024 = 31 ÷ 154 × 100 = %.0f%% (2023: 14 ÷ 140 = 10%%) - doubled; recruitment/training costs and loss of skills in a skills-shortage market.' % _ms_lt, 'Licences sold fell 1 260 → 1 232 (000) and productivity fell from 9 000 to 8 000 - suggests lost experience and unfilled posts reduce output.', 'But revenue is flat because of cloud competition - other priorities: product development (cloud product), pricing, marketing; labour turnover may be a symptom of low motivation rather than the cause.', 'Some turnover brings new ideas; costs of retention (higher pay) may outweigh benefits.', 'Judgement: retaining skilled developers is critical to innovation and competitiveness, but alone is not enough; depends on whether staff leave for pay, flexibility or progression (Appendix B).']}]},
]

# ───────────────────────── PAPER 3 ─────────────────────────
CV = {'rev': (96.0, 108.0, 112.0), 'op': (7.2, 6.5, 4.5), 'ncl': 52.0, 'eq': 38.0}
_cv_opm = [CV['op'][i] / CV['rev'][i] * 100 for i in range(3)]
_cv_roce = CV['op'][2] / (CV['eq'] + CV['ncl']) * 100
_cv_gear = CV['ncl'] / (CV['eq'] + CV['ncl']) * 100

# Network analysis
ACT = [('A', 'Select site', 2, []), ('B', 'Obtain planning permits', 3, ['A']), ('C', 'Design factory layout', 2, ['A']), ('D', 'Construct building', 6, ['B', 'C']),
       ('E', 'Order machinery', 1, ['C']), ('F', 'Install machinery', 2, ['D', 'E']), ('G', 'Recruit and train workers', 4, ['B']), ('H', 'Test production', 1, ['F', 'G'])]


def critical(acts):
    est, eft = {}, {}
    for k, _, d, pre in acts:
        est[k] = max([eft[p] for p in pre] or [0]); eft[k] = est[k] + d
    end = max(eft.values())
    lft, lst = {}, {}
    for k, _, d, pre in reversed(acts):
        succ = [a for a in acts if k in a[3]]
        lft[k] = min([lst[s[0]] for s in succ] or [end]); lst[k] = lft[k] - d
    flt = {k: lst[k] - est[k] for k in est}
    return end, est, eft, flt


_end, _est, _eft, _flt = critical(ACT)
_crit = [k for k, f in _flt.items() if f == 0]

# NPV
DF = [1.000, 0.926, 0.857, 0.794, 0.735, 0.681]


def npv(cost, flows):
    return sum(f * DF[i + 1] for i, f in enumerate(flows)) - cost


PL = {'cost': 30.0, 'flows': [6.0, 9.0, 11.0, 11.0, 10.0]}
UK = {'cost': 12.0, 'flows': [3.5, 4.5, 5.0, 5.0, 4.5]}
_pl_npv, _uk_npv = npv(PL['cost'], PL['flows']), npv(UK['cost'], UK['flows'])


def payback(cost, flows):
    cum = -cost
    for i, f in enumerate(flows, 1):
        if cum + f >= 0:
            return i - 1 + (-cum) / f
        cum += f


_pl_pb, _uk_pb = payback(PL['cost'], PL['flows']), payback(UK['cost'], UK['flows'])

P3_D = {
    'title': 'Corvane Bikes plc',
    'text': [
        ('Background', 'Corvane Bikes plc is a UK manufacturer of electric bikes, founded in 2008 by engineer Sunita Corvane, who still owns 34% of the shares and chairs the board. The company makes 60 000 bikes a year in a factory in the Midlands and sells them through 300 independent cycle shops in the UK and Germany. Corvane’s bikes are premium-priced and known for their reliability.'),
        ('A changing market', 'The market for electric bikes has grown by more than 20% a year since 2020 (Appendix B), but growth is slowing and many new entrants, including large car makers, have launched cheaper models. Corvane buys its batteries from one Asian supplier, which has recently raised prices twice. Supply problems in 2023 meant that Corvane could not fulfil some orders. At the same time, government subsidies for electric bike purchases in the UK have been withdrawn.'),
        ('Culture and people', 'Sunita knows all 410 employees by name and is closely involved in product design. Managers say that decisions are made quickly, but only when Sunita approves them. Several experienced engineers have recently left to join competitors, saying that there are limited opportunities to take responsibility for projects. The company has traditionally relied on incremental improvements to its existing models.'),
        ('Strategic options', 'The directors have identified three issues. First, Corvane’s UK factory is now operating close to full capacity. Second, the company is considering building a second factory in Poland, which would cut labour costs and give easier access to EU customers (Appendix C and D). Third, the board has discussed acquiring its battery supplier, which has offered to sell the business for £22m. Sunita is also considering whether to set up an innovation team to develop a new range of cargo e-bikes for delivery companies.'),
    ],
    'appendices': [
        {'title': 'Appendix A  Corvane Bikes plc: selected financial data', 'table': [['', '2022', '2023', '2024'], ['Revenue (£m)', *['%.1f' % x for x in CV['rev']]], ['Operating profit (£m)', *['%.1f' % x for x in CV['op']]]], 'note': 'Statement of financial position at 31 Dec 2024: non-current liabilities £52.0m; total equity £38.0m.'},
        {'title': 'Appendix B  UK electric bike market', 'table': [['', '2020', '2022', '2024'], ['UK sales (000 bikes)', '280', '470', '610'], ['Market growth (% on previous year)', '+27%', '+22%', '+9%']]},
        {'title': 'Appendix C  Proposed Polish factory: activities (durations in months)', 'table': [['Activity', 'Description', 'Duration', 'Preceded by']] + [[a[0], a[1], str(a[2]), ', '.join(a[3]) or '-'] for a in ACT]},
        {'title': 'Appendix D  Investment options (£m)', 'table': [['', 'Initial cost', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'], ['Option 1  Polish factory', '30.0'] + ['%.1f' % x for x in PL['flows']], ['Option 2  Extend UK factory', '12.0'] + ['%.1f' % x for x in UK['flows']]], 'note': 'Discount factors at 8%: Year 1 0.926; Year 2 0.857; Year 3 0.794; Year 4 0.735; Year 5 0.681. The board’s payback criterion is 4 years.'},
    ],
    'questions': [
        {'n': 1, 'marks': 12, 'spec': '3.7.7', 'q': 'Use Porter’s five forces to analyse why Corvane Bikes plc’s profit margin has fallen.',
         'content': ['Supplier power is high: a single battery supplier raised prices twice and caused supply problems - raises costs and risks lost sales.', 'Threat of new entrants/rivalry: car makers and others have launched cheaper models; market growth slowing from +27% to +9% so competition for share is intense.', 'Buyer power: independent cycle shops can stock rivals; subsidies withdrawn make customers more price sensitive.', 'Operating margin: %.1f%% (2022) → %.1f%% (2024) - costs rising faster than prices.' % (_cv_opm[0], _cv_opm[2]), 'Threat of substitutes: other transport (cars, public transport, cheaper conventional bikes).', 'Level 3 needs developed links from at least one force to Corvane’s prices/costs, using the case.']},
        {'n': 2, 'marks': 12, 'spec': '3.9.1', 'q': 'Analyse the possible impact on Corvane Bikes plc of acquiring its battery supplier.',
         'content': ['Backward vertical integration - secures supply of a key component and removes the supplier’s price rises/stock-outs.', 'Cost: £22m purchase; could lower costs through purchasing economies/profit that was going to the supplier; uses cash or increases gearing (already %.0f%%).' % _cv_gear, 'Managerial issues: culture clash, integrating an Asian-based operation, diseconomies of scale and loss of focus; Sunita’s tight control may not suit a new unit.', 'May allow Corvane to differentiate through battery technology (R&D) but competitors may stop buying from the supplier, reducing its revenue.', 'Credit synergy and risk; analysis must be in the context of Corvane.']},
        {'n': 3, 'marks': 16, 'spec': '3.10.3', 'q': 'Corvane’s Operations Director believes that the Polish factory could open within 12 months.\nDo you agree?\nJustify your view by using the data in Appendix C and other information provided.',
         'content': ['Network analysis: longest route = %s = %d months → the project takes %d months, not 12.' % (' → '.join(_crit), _end, _end), 'Float: C has %d month(s), E %d months, G %d months (they can be delayed without delaying the project); all activities on the critical path (%s) have zero float.' % (_flt['C'], _flt['E'], _flt['G'], ', '.join(_crit)), 'To finish in 12 months the critical path must be cut by 2 months - e.g. overlapping permits/design (not allowed by dependencies), more builders to shorten D, but cost rises (crashing).', 'Other risks: planning permits delayed (no experience in Poland), construction delays, recruiting skilled workers, Sunita’s approval slowing decisions.', 'Evaluation: 12 months looks over-optimistic on the data; the answer depends on the ability to speed up critical activities and whether the 14 months is itself an estimate. Answers that do not use the data cannot exceed Level 2.']},
        {'n': 4, 'marks': 16, 'spec': '3.7.8', 'q': 'Which investment option should Corvane Bikes plc choose?\nUse calculations and other information from Appendix D in your answer.',
         'content': ['NPV Option 1 = (6×0.926 + 9×0.857 + 11×0.794 + 11×0.735 + 10×0.681) − 30 = £%.2fm; NPV Option 2 = £%.2fm.' % (_pl_npv, _uk_npv), 'Payback: Option 1 = %.2f years; Option 2 = %.2f years - both meet the board’s 4-year criterion, Option 2 recovers its cost faster.' % (_pl_pb, _uk_pb), 'Option 1 has the higher NPV (larger absolute return) but is bigger and riskier: £30m cost, unfamiliar country, exchange-rate risk, gearing of %.0f%% already high; Option 2 is cheaper and lower risk but UK factory is at capacity and labour costs are higher; extension raises capacity less.' % _cv_gear, 'Non-financial: Polish factory gives access to EU customers/reduces tariffs; labour cost advantage; employees’ reaction; Sunita’s control; strategic fit with growth.', 'Judgement should compare NPV per £ invested, risk and finance; either choice can be justified if supported by the calculations.']},
        {'n': 5, 'marks': 20, 'spec': '3.10.2', 'q': 'To what extent should Corvane Bikes plc change its organisational culture?',
         'content': ['Current culture is a power culture: decisions depend on Sunita; engineers leave due to lack of responsibility.', 'For change: a task or person culture (project teams, empowerment) would encourage innovation (cargo e-bikes), retain engineers, and speed decisions as the company grows (410 employees).', 'Against: power culture gives speed and consistent quality; changing culture is slow and risky - resistance from managers, uncertainty (Kotter & Schlesinger), disruption during the Polish expansion; engineers could be retained by pay/projects instead.', 'Method: delegate gradually, involve staff, change reward/communication; Lewin - unfreeze, change, refreeze.', 'Judgement: change is needed as the business grows and innovates, but should be phased; it depends on the time available and Sunita’s willingness to delegate.']},
        {'n': 6, 'marks': 24, 'spec': '3.8.2 / 3.9.2', 'q': 'To what extent is innovation the most important factor in helping a business to gain a sustained competitive advantage?',
         'content': ['For: new products/processes (e.g. batteries, cargo bikes) differentiate; patents protect; kaizen reduces costs; first-mover advantages.', 'Against: imitation is quick; R&D costs and failure risk; competitive advantage also comes from cost leadership, brand, customer service, location, supply chain control, finance and management quality.', 'Context: industries with fast technological change (software, pharmaceuticals) v those where cost/convenience matter (supermarkets, cement).', 'Sustained: depends on protecting innovation (intellectual property) and organisational culture.', 'Judgement should compare contrasting businesses and refer to timescale; Levels 4-5 need balanced, developed arguments with a supported judgement.']},
    ],
}
