"""RA10 practice papers, Set E (AQA 7132 format). Calculations are computed from each context's own data."""
from ra10_set_d import mcq, stmt, payback

# ───────────────────────── PAPER 1 ─────────────────────────
OP, CE = 18.0, 150.0
_roce = OP / CE * 100
FC, PRICE, VC, ACT_OUT = 30000, 12, 7, 8200
_be = FC / (PRICE - VC)
_mos = ACT_OUT - _be

P1_E = {
    'mcq': [
        mcq('Which one of the following is an external source of finance?', 'Venture capital', ['Retained profit', 'Sale of unused assets', 'Reducing inventory levels'], 'Venture capital comes from outside investors; the others are internal sources.', '3.5.3', 201),
        stmt('Market share is calculated by dividing a business’s sales by total market sales.', True, 'A rise in market share always leads to higher profit.', False, 'Market share = business sales ÷ market sales × 100; higher share does not guarantee higher profit (e.g. if gained through heavy discounts).', '3.3.1'),
        mcq('A business which targets a small, specialised segment of a market is following:', 'a niche marketing strategy.', ['a mass marketing strategy.', 'a penetration strategy.', 'a diversification strategy.'], 'Niche marketing focuses on a narrow segment; mass marketing targets the whole market.', '3.3.3', 203),
        mcq('Which level of Maslow’s hierarchy of needs includes job security?', 'Safety needs', ['Physiological needs', 'Social needs', 'Esteem needs'], 'Safety needs: security of employment, safe working conditions.', '3.6.4', 204),
        mcq('A business has fixed costs of £30 000, a selling price of £12 and variable costs of £7 per unit. What is its break-even output?', '%s units' % '{:,}'.format(int(_be)), ['2 500 units', '4 286 units', '30 000 units'], 'Break-even = fixed costs ÷ contribution per unit = 30 000 ÷ 5 = 6 000 units.', '3.5.2', 205),
        stmt('An adverse variance reduces profit.', True, 'A favourable variance means actual costs were higher than budgeted.', False, 'Favourable variances increase profit (costs lower or revenue higher than budgeted).', '3.5.2'),
        mcq('Which one of the following is an example of process innovation?', 'Introducing robots to assemble products', ['Launching a new flavour of an existing drink', 'Opening a new store in another country', 'Changing the logo of a brand'], 'Process innovation changes how goods are made or services delivered; product innovation changes what is sold.', '3.9.2', 207),
        mcq('Which one of the following describes a role culture?', 'Clear rules, procedures and job descriptions', ['Decisions made by one dominant leader', 'Teams formed around projects and expertise', 'Individuals’ own goals come first'], 'Role culture (Handy) is bureaucratic: hierarchy and rules; power culture centres on one person; task culture on projects.', '3.10.2', 208),
        mcq('Which one of the following would improve a business’s cash flow in the short term?', 'Selling inventory at a discount', ['Buying new machinery with cash', 'Giving customers longer to pay', 'Paying suppliers earlier'], 'Selling inventory converts it to cash; the other actions reduce cash inflows or increase outflows.', '3.5.4', 209),
        stmt('Diversification is the lowest-risk strategy in Ansoff’s matrix.', False, 'In Ansoff’s matrix, market development means selling existing products in new markets.', True, 'Diversification (new product, new market) is the highest-risk Ansoff strategy; market penetration is the lowest.', '3.8.1'),
        mcq('A business that achieves the lowest costs in a broad market is following Porter’s:', 'cost leadership strategy.', ['differentiation strategy.', 'focus strategy.', 'stuck-in-the-middle position.'], 'Cost leadership = lowest cost across a broad market; focus targets a narrow segment.', '3.8.2', 211),
        mcq('The re-order level is:', 'the inventory level at which a new order is placed.', ['the maximum amount of inventory held.', 'the minimum safety stock.', 'the number of units in each order.'], 'The re-order level triggers a new order; it allows for lead time and demand during the lead time.', '3.4.5', 212),
        stmt('Job enrichment is a financial method of motivation.', False, 'Piece rate is a financial method of motivation.', True, 'Piece rate pays per unit; job enrichment is non-financial (more varied, responsible work).', '3.6.4'),
        mcq('A rise in interest rates is most likely to:', 'increase loan repayments for a business with variable-rate borrowing.', ['reduce the value of the pound.', 'increase consumer spending on credit.', 'lower the price of imports.'], 'Higher interest rates raise borrowing costs and tend to reduce consumer spending; they often raise the value of the pound.', '3.7.5', 214),
        mcq('A business has receivables of £6m and revenue of £73m. Its receivable days are:', '30 days', ['12 days', '45 days', '365 days'], '6 ÷ 73 × 365 = 30 days.', '3.7.2', 215),
    ],
    'b': [
        {'n': 16, 'marks': 4, 'kind': 'calc', 'spec': '3.7.2', 'q': 'A business made an operating profit of £%.0fm. Its total equity was £%.0fm and its non-current liabilities were £%.0fm.\nCalculate the business’s return on capital employed (ROCE).\nShow your working.' % (OP, 110, 40),
         'answer': 'Capital employed = 110 + 40 = £150m. ROCE = 18 ÷ 150 × 100 = %.0f%%.' % _roce,
         'points': ['1 mark: capital employed = equity + non-current liabilities.', '1 mark: £150m.', '1 mark: operating profit ÷ capital employed × 100.', '1 mark: 12% (accept 12.0%).']},
        {'n': 17, 'marks': 4, 'kind': 'calc', 'spec': '3.5.2', 'q': 'A business has fixed costs of £%s, a selling price of £%d per unit and variable costs of £%d per unit. Its actual output is %s units.\nCalculate its margin of safety (in units).\nShow your working.' % ('{:,}'.format(FC), PRICE, VC, '{:,}'.format(ACT_OUT)),
         'answer': 'Break-even = 30 000 ÷ (12 − 7) = 6 000 units. Margin of safety = 8 200 − 6 000 = %d units.' % _mos,
         'points': ['1 mark: contribution per unit £5.', '1 mark: break-even output 6 000 units.', '1 mark: margin of safety = actual − break-even.', '1 mark: 2 200 units (unit must be units, not £). OFR if break-even is wrong.']},
        {'n': 18, 'marks': 9, 'kind': 'analyse', 'spec': '3.4.3', 'q': 'Analyse how a manufacturer might benefit from adopting lean production.',
         'content': ['Lean production aims to cut waste: JIT cuts inventory holding costs and frees cash; less waste lowers unit costs.', 'Continuous improvement (kaizen) and quality focus reduce defects and rework - better quality at lower cost.', 'Faster response to customers and flexibility; shorter lead times.', 'Higher efficiency and labour productivity can improve profit margins or allow lower prices - competitiveness.', 'Developed chains in context (e.g. a car components firm with expensive storage).']},
        {'n': 19, 'marks': 9, 'kind': 'analyse', 'spec': '3.3.2', 'q': 'Analyse how a business might use primary market research when launching a new product.',
         'content': ['Primary research (surveys, focus groups, trials) gathers up-to-date data specific to the product and target market.', 'Helps estimate demand, price acceptability and features - reduces risk of failure and wasted launch costs.', 'Qualitative data (focus groups) explains why customers behave as they do; quantitative data (surveys) quantifies - sample size/method affect reliability (random, stratified, quota).', 'Can be costly and slow; bias; so must be balanced against secondary research - but analysis needs only benefits explained.', 'Credit application to the type of product in the stem.']},
        {'n': 20, 'marks': 9, 'kind': 'analyse', 'spec': '3.1.2', 'q': 'Analyse why a successful private limited company might choose to remain a private limited company rather than become a public limited company.',
         'content': ['Keeps control: shares cannot be bought on the stock market so no takeover by outsiders; owners keep decisions.', 'Avoids costs and regulation of a flotation and disclosure requirements; less pressure for short-term dividends/results.', 'Can still raise finance from existing shareholders, retained profit or loans.', 'Limited liability still protects owners.', 'Level 3: developed chain showing why this suits the business in the stem (e.g. a family firm).']},
    ],
    'c': [
        {'n': 21, 'spec': '3.5.2 / 3.7.8', 'q': 'To what extent is profit the most important measure of a business’s success?',
         'for': ['Profit rewards risk and funds investment; shareholders judge on profit/dividends and share price.', 'Needed for survival in the long run; profit margins show efficiency.'],
         'against': ['Cash flow matters for survival - profitable firms fail from poor cash flow.', 'Other measures: market share, growth, customer satisfaction, triple bottom line (people, planet), employee engagement.', 'Short-term profit may harm long-term success (cutting training, quality).', 'Non-profit organisations and social enterprises have different measures.'],
         'judge': 'Profit is essential but not sufficient; the most important measure depends on the business type, stage and stakeholders.'},
        {'n': 22, 'spec': '3.6.4', 'q': '“Financial methods are the best way to motivate employees.”\nTo what extent do you agree?',
         'for': ['Taylor: money is the main motivator; piece rate, commission and PRP link effort to reward.', 'Pay is a basic need and a hygiene factor - without fair pay other methods fail.', 'Quick to implement and measure; works for routine jobs/sales roles.'],
         'against': ['Herzberg/Maslow: non-financial motivators (recognition, empowerment, job enrichment, flexible working) have longer-lasting effects.', 'Financial schemes can harm teamwork, quality or encourage short-termism; costs.', 'Different employees value different things; professional/creative staff often value autonomy.'],
         'judge': 'Financial methods are important - particularly where pay is low - but are best combined with non-financial methods; the best mix depends on the job and workforce.'},
    ],
    'd': [
        {'n': 23, 'spec': '3.9.1', 'q': 'To what extent is external growth better than organic growth for a business?',
         'for': ['Faster: instant market share, new markets or capabilities (takeover/merger); can gain economies of scale and synergy.', 'Removes a competitor (horizontal) or secures supply (vertical).'],
         'against': ['Costly, high risk of failure: culture clash, diseconomies of scale, debt/gearing.', 'Organic growth is cheaper, controlled and builds on existing strengths; less risk, but slow.', 'Regulators (competition law) may block mergers.'],
         'judge': 'External growth is quicker but riskier; the choice depends on urgency, finance, availability of targets and management capability.'},
        {'n': 24, 'spec': '3.10.1', 'q': '“Managing change is easier for small businesses than for large businesses.”\nDo you agree?',
         'for': ['Small firms: shorter communication lines, informal culture, faster decisions; owners can lead directly.', 'Fewer stakeholders and less bureaucracy; easier to consult everyone.'],
         'against': ['Small firms have fewer resources, less specialist knowledge; one key person leaving can derail change; owner’s resistance (power culture).', 'Large firms have more funds, project teams, change managers and can spread risk; but suffer more from resistance and complexity.'],
         'judge': 'Small businesses often change more quickly but large businesses have more resources; it depends on culture, leadership and the scale/type of change (incremental v disruptive).'},
    ],
}

# ───────────────────────── PAPER 2 ─────────────────────────
BL = {'sales': (42.0, 47.5), 'mkt': (310.0, 355.0), 'promo_m': (3.5, 6.2)}
_bl_share = [BL['sales'][i] / BL['mkt'][i] * 100 for i in (0, 1)]
_bl_mkt_g = (BL['mkt'][1] - BL['mkt'][0]) / BL['mkt'][0] * 100
_bl_sales_g = (BL['sales'][1] - BL['sales'][0]) / BL['sales'][0] * 100

PS = {'fc': 2_400_000, 'price': 640, 'vc': 480, 'out': 21_000}
_ps_c = PS['price'] - PS['vc']
_ps_be = PS['fc'] / _ps_c
_ps_mos = PS['out'] - _ps_be
_ps_profit = PS['out'] * _ps_c - PS['fc']
_ps_be2 = PS['fc'] / (PS['price'] - (PS['vc'] + 40))

AC = {'open': 85, 'in': [310, 300, 320], 'out': [330, 335, 340], 'budget_wages': 190, 'actual_wages': 207}
_ac_close = []
_b = AC['open']
for i, o in zip(AC['in'], AC['out']):
    _b += i - o; _ac_close.append(_b)
_ac_var = AC['actual_wages'] - AC['budget_wages']

P2_E = [
    {'title': 'Brightleaf Tea Co.',
     'text': ['Brightleaf Tea Co. sells premium loose-leaf and speciality teas through its website and 55 shops. The UK tea market is changing: sales of traditional black tea are falling but herbal, fruit and “wellness” teas are growing quickly, especially among consumers under 35. Brightleaf has recently launched a range of cold-brew iced teas and spent heavily on social media advertising.',
              'The company’s owners want to increase market share. They believe that a new, lower-priced range sold through supermarkets could win customers but worry that this might damage Brightleaf’s premium brand.'],
     'appendices': [
         {'title': 'Appendix A  Brightleaf Tea Co. and UK speciality tea market', 'table': [['', '2023', '2024'], ['Brightleaf sales (£m)', '%.1f' % BL['sales'][0], '%.1f' % BL['sales'][1]], ['Total market sales (£m)', '%.0f' % BL['mkt'][0], '%.0f' % BL['mkt'][1]], ['Promotion spending (£m)', '%.1f' % BL['promo_m'][0], '%.1f' % BL['promo_m'][1]]]},
         {'title': 'Appendix B  Survey of 1 200 UK tea drinkers (2024)', 'table': [['Factor most important when buying tea', 'Age 18-34', 'Age 35+'], ['Flavour variety', '46%', '22%'], ['Price', '21%', '38%'], ['Ethical sourcing', '24%', '15%'], ['Brand', '9%', '25%']], 'note': 'Quota sample; equal numbers in each age group.'}],
     'parts': [
         {'n': '1.1', 'marks': 4, 'kind': 'calc', 'spec': '3.3.2', 'q': 'Using Appendix A, calculate Brightleaf Tea Co.’s market share in 2024.\nShow your working.',
          'answer': 'Market share = 47.5 ÷ 355 × 100 = %.1f%% (2023: %.1f%%).' % (_bl_share[1], _bl_share[0]),
          'points': ['1 mark: formula sales ÷ total market sales × 100.', '1 mark: £47.5m.', '1 mark: £355m.', '1 mark: %.1f%% (accept 13.4%%).' % _bl_share[1]]},
         {'n': '1.2', 'marks': 4, 'kind': 'short', 'spec': '3.3.2', 'q': 'Using Appendix B, explain one limitation of the quota sampling method used in the survey.',
          'content': ['Quota sampling selects people to fill quotas, not randomly - interviewers choose who to ask, introducing bias; the sample may not be representative.', 'Cannot calculate sampling error/confidence intervals as in random sampling.', 'Apply: only 1 200 tea drinkers; quota by age but not by income/region - results may not apply to the whole market.', 'Marks: 1 limitation, 1 explanation, 2 development/application.']},
         {'n': '1.3', 'marks': 9, 'kind': 'analyse', 'spec': '3.3.3', 'q': 'Using Appendix B, analyse how Brightleaf Tea Co. might use market segmentation.',
          'content': ['Demographic (age) segments differ: 18-34s value flavour variety (46%) and ethical sourcing (24%); 35+ value price (38%) and brand (25%).', 'Brightleaf could target younger consumers with a varied, ethically sourced iced/herbal range promoted on social media (positioning as premium wellness), and use a more price-focused/branded offer for older buyers.', 'Allows marketing mix tailored to each segment (product, price, promotion, place) - raises sales and prevents wasted promotion.', 'Costs: separate marketing for each segment; risk of confusing brand; segments may be small.', 'Credit developed chains using the data.']},
         {'n': '1.4', 'marks': 16, 'kind': 'evaluate', 'spec': '3.3.4 / 3.7.1', 'q': 'Should Brightleaf Tea Co. launch a new lower-priced range in supermarkets?\nUse Appendix A and Appendix B and other information in your answer.',
          'content': ['For: the market grew %.1f%% but Brightleaf’s sales only %.1f%%, so its share slipped from %.1f%% to %.1f%% despite heavy promotion; supermarkets give access to the mass market and to 35+ buyers who value price (38%%).' % (_bl_mkt_g, _bl_sales_g, _bl_share[0], _bl_share[1]), 'Against: premium brand may be diluted; lower prices cut margins; supermarket buyer power - they demand discounts; cannibalisation of own shops and website; heavy promotion spending already raised (£3.5m → £6.2m).', 'Alternatives: market penetration on web/own shops, new products for younger customers (iced teas).', 'Judgement: depends on whether a differently branded range protects the premium brand, margins after supermarket discounts, and brand loyalty (only 9% of 18-34s put brand first).']}]},
    {'title': 'Pennine Steel plc',
     'text': ['Pennine Steel plc produces specialist steel sections for the construction industry. It operates a single plant and supplies a small number of large customers on long-term contracts. The company has a reputation for quality but has recently suffered from late deliveries because of problems at its main raw material supplier. Pennine has used Just in Time for raw materials for many years but is now considering holding more inventory.',
              'Demand from construction customers is forecast to fall slightly next year. The directors are considering a cost-cutting programme that would include a 5% reduction in the workforce and the introduction of new automated cutting equipment.'],
     'appendices': [
         {'title': 'Appendix A  Product data (annual)', 'table': [['Fixed costs', '£%s' % '{:,}'.format(PS['fc'])], ['Selling price per tonne', '£%d' % PS['price']], ['Variable cost per tonne', '£%d' % PS['vc']], ['Current output (tonnes)', '{:,}'.format(PS['out'])]]},
         {'title': 'Appendix B  Cost-cutting proposal', 'table': [['', 'Current', 'With automation'], ['Variable cost per tonne', '£480', '£440'], ['Fixed costs', '£2.4m', '£2.9m'], ['Workforce', '420', '399']]}],
     'parts': [
         {'n': '2.1', 'marks': 3, 'kind': 'calc', 'spec': '3.5.2', 'q': 'Using Appendix A, calculate Pennine Steel plc’s break-even output.\nShow your working.',
          'answer': 'Contribution per tonne = 640 − 480 = £160. Break-even = 2 400 000 ÷ 160 = %s tonnes.' % '{:,.0f}'.format(_ps_be),
          'points': ['1 mark: contribution per tonne £160.', '1 mark: fixed costs ÷ contribution.', '1 mark: 15 000 tonnes (unit needed). OFR.']},
         {'n': '2.2', 'marks': 6, 'kind': 'short', 'spec': '3.5.2', 'q': 'Using Appendix A, calculate Pennine Steel plc’s profit at its current output and explain one reason why a rise in variable costs of £40 per tonne would be a problem.',
          'content': ['Profit = 21 000 × £160 − £2 400 000 = £%s (accept £960 000).' % '{:,.0f}'.format(_ps_profit), 'With variable cost £520, contribution £120 and break-even rises to %s tonnes - margin of safety falls from %s to %s tonnes.' % ('{:,.0f}'.format(_ps_be2), '{:,.0f}'.format(_ps_mos), '{:,.0f}'.format(21000 - _ps_be2)), 'Explained reason: with long-term contracts Pennine may not be able to raise prices, so profit falls sharply and risk of loss rises.', 'Marks: 3 calculation, up to 3 explanation in context.']},
         {'n': '2.3', 'marks': 9, 'kind': 'analyse', 'spec': '3.4.5 / 3.4.3', 'q': 'Analyse the possible consequences for Pennine Steel plc of holding more raw material inventory instead of using Just in Time.',
          'content': ['More buffer inventory protects against supplier problems and late deliveries - fewer production delays and lost contracts.', 'Costs rise: storage, insurance, handling, risk of damage/obsolescence; cash tied up (working capital) - reduces liquidity.', 'Bulk-buying may give discounts; lead time and re-order levels must be reset.', 'Possible loss of lean culture; but customer reliability and reputation for quality are improved.', 'Developed answers link cost/cash against reliability in Pennine’s context.']},
         {'n': '2.4', 'marks': 16, 'kind': 'evaluate', 'spec': '3.4.3 / 3.6.3', 'q': 'To what extent should Pennine Steel plc introduce the automated cutting equipment?\nUse Appendix B and other information in your answer.',
          'content': ['Calculation: new break-even = £2.9m ÷ (640 − 440) = 14 500 tonnes (vs 15 000) - lower break-even and higher margin of safety (6 500 v 6 000); profit at 21 000 tonnes = 21 000 × 200 − 2.9m = £1.3m (vs £0.96m).', 'Benefits: lower unit costs, higher labour productivity, quality consistency; competitive edge.', 'Against: higher fixed costs - more risk if demand falls (demand forecast to fall); initial investment (not stated), redundancies (21 jobs) - morale, redundancy costs, union reaction; skills/training.', 'Judgement: favourable at current output; it depends on the extent demand falls and finance cost; payback/investment cost needed.']}]},
    {'title': 'Ardent Care Homes Ltd',
     'text': ['Ardent Care Homes Ltd runs 14 residential care homes for older people. It employs mainly part-time care assistants who are paid slightly above the National Living Wage. Demand for places is rising as the population ages but the company struggles to recruit and keep staff. It uses agency staff to cover shortages, which is expensive. Fees are partly paid by local authorities, which often pay late.',
              'Ardent’s directors have set budgets for each home. In 2024 wage costs exceeded budget in most homes. Ardent is considering introducing an employee share scheme and an improved career structure for care assistants.'],
     'appendices': [
         {'title': 'Appendix A  Extract from Ardent Care Homes Ltd’s cash flow forecast (£000)', 'table': [['', 'January', 'February', 'March'], ['Opening balance', '%d' % AC['open'], '', ''], ['Cash inflows', *['%d' % x for x in AC['in']]], ['Cash outflows', *['%d' % x for x in AC['out']]]]},
         {'title': 'Appendix B  Wage budget, 2024 (£000)', 'table': [['', 'Budgeted', 'Actual'], ['Wages and agency costs', '%d' % AC['budget_wages'], '%d' % AC['actual_wages']]]}],
     'parts': [
         {'n': '3.1', 'marks': 4, 'kind': 'calc', 'spec': '3.5.2', 'q': 'Using Appendix A, calculate Ardent Care Homes Ltd’s closing cash balance for March.\nShow your working.',
          'answer': 'January closing = 85 + 310 − 330 = %d; February = %d + 300 − 335 = %d; March = %d + 320 − 340 = %d (£000), i.e. £%d.' % (_ac_close[0], _ac_close[0], _ac_close[1], _ac_close[1], _ac_close[2], _ac_close[2] * 1000),
          'points': ['1 mark: January closing balance %d.' % _ac_close[0], '1 mark: February closing balance %d.' % _ac_close[1], '1 mark: March net cash flow −20.', '1 mark: March closing balance %d (£000) - accept negative/brackets.' % _ac_close[2]]},
         {'n': '3.2', 'marks': 4, 'kind': 'short', 'spec': '3.5.2', 'q': 'Using Appendix B, explain one reason why the adverse variance for wages might have occurred.',
          'content': ['Variance = £207 000 − £190 000 = £17 000 adverse (8.9% over budget) - actual costs higher.', 'Reason: heavy use of agency staff (more expensive than employed staff) to cover vacancies caused by high turnover; or a wage rise to compete for staff.', 'Marks: 1 reason, 1 data, 2 explanation of why it increases wage costs.']},
         {'n': '3.3', 'marks': 9, 'kind': 'analyse', 'spec': '3.6.4', 'q': 'Analyse how an improved career structure might affect the motivation of Ardent Care Homes Ltd’s care assistants.',
          'content': ['Maslow: promotion and progression meet esteem and self-actualisation needs once basic pay/security needs are met.', 'Herzberg: advancement and recognition are motivators; improves engagement and may cut labour turnover and agency use.', 'Cost: training and higher pay for senior roles; only some staff can be promoted - others may be demotivated; but part-time workers may value flexibility/pay more than promotion.', 'Link to cash/costs: lower turnover → lower recruitment and agency costs.', 'Credit developed chains in context.']},
         {'n': '3.4', 'marks': 16, 'kind': 'evaluate', 'spec': '3.5.4 / 3.5.3', 'q': 'To what extent should Ardent Care Homes Ltd’s main priority be to improve its cash flow?\nUse Appendix A and other information in your answer.',
          'content': ['Forecast: cash falls from £85k to only £10k by March (closing balances %s, £000) - outflows exceed inflows every month, leaving almost no safety margin to pay wages and suppliers.' % ', '.join(str(x) for x in _ac_close), 'Late payment by local authorities and costly agency staff cause the problem; options: overdraft, factoring, negotiating faster payment, improving retention to cut agency costs.', 'Counter: profitability/capacity matter too - demand is rising; investing in staff and homes drives long-term performance; cash flow is a short-term problem that may be solved by short-term finance.', 'Judgement: cash flow is urgent for survival, but fixing the underlying cause (staff turnover/agency costs) is needed.']}]},
]

# ───────────────────────── PAPER 3 ─────────────────────────
QG = {'rev': (88.0, 96.0, 90.0), 'op': (21.0, 19.0, 11.0), 'ca': 48.0, 'cl': 40.0, 'ncl': 36.0, 'eq': 84.0}
_qg_opm = [QG['op'][i] / QG['rev'][i] * 100 for i in range(3)]
_qg_roce = QG['op'][2] / (QG['eq'] + QG['ncl']) * 100
_qg_cr = QG['ca'] / QG['cl']
_qg_gear = QG['ncl'] / (QG['eq'] + QG['ncl']) * 100
DFQ = [1.0, 0.909, 0.826, 0.751, 0.683, 0.621]
ACQ = {'cost': 28.0, 'flows': [4.0, 8.0, 10.0, 11.0, 12.0]}
_acq_npv = sum(f * DFQ[i + 1] for i, f in enumerate(ACQ['flows'])) - ACQ['cost']
_acq_pb = payback(ACQ['cost'], ACQ['flows'])
_acq_arr = (sum(ACQ['flows']) - ACQ['cost']) / 5 / ACQ['cost'] * 100

P3_E = {
    'title': 'Quillon Games plc',
    'text': [
        ('Background', 'Quillon Games plc is a UK mobile games developer with 380 employees working in studios in Leeds and Dublin. Its main product, “Skyforge”, a fantasy strategy game, has been downloaded more than 90 million times worldwide and generates 72% of Quillon’s revenue through in-game purchases. Quillon was floated on the stock market in 2019 and Chief Executive Ife Adeyemi has been in post since 2022.'),
        ('Skyforge declines', 'Downloads of Skyforge peaked in 2023 and have since fallen sharply as players switch to newer games (Appendix B). Quillon’s other titles are small and have not been profitable. Ife has described the company as “a one-hit wonder in danger of becoming a no-hit wonder”. Share prices have fallen by 45% since the beginning of 2024. Some shareholders have criticised the company for paying a large dividend in 2023 instead of investing in new games.'),
        ('Ways of working', 'Quillon’s developers work in small, self-managing teams with few levels of hierarchy. Ife believes this has encouraged creativity but also led to a lack of discipline: several new games have been delayed or cancelled. There is also concern about the ethics of in-game purchases that encourage young players to spend heavily; the government is considering regulating “loot boxes”, which would remove a significant source of revenue.'),
        ('Strategic options', 'The board is considering how to respond (Appendix C). Option 1 is to develop a series of new games in-house aimed at the Asian market, where Quillon has little presence. Option 2 is to acquire Hanbit Studios, a successful Korean developer with a strong presence in Asia, for £28m (Appendix D). Ife also wants to introduce a more structured project-management approach and to reduce dependence on in-game purchases by launching a subscription service.'),
    ],
    'appendices': [
        {'title': 'Appendix A  Quillon Games plc: selected financial data', 'table': [['', '2022', '2023', '2024'], ['Revenue (£m)', *['%.1f' % x for x in QG['rev']]], ['Operating profit (£m)', *['%.1f' % x for x in QG['op']]]], 'note': 'Statement of financial position at 31 Dec 2024 (£m): current assets %.0f; current liabilities %.0f; non-current liabilities %.0f; total equity %.0f.' % (QG['ca'], QG['cl'], QG['ncl'], QG['eq'])},
        {'title': 'Appendix B  Skyforge downloads (millions per year)', 'table': [['2021', '2022', '2023', '2024'], ['18', '27', '31', '14']]},
        {'title': 'Appendix C  Strategic options', 'table': [['', 'Option 1  New games for Asia', 'Option 2  Acquire Hanbit Studios'], ['Ansoff category', 'Market development with new products', 'Market development / external growth'], ['Time to first revenue', '24 to 30 months', '6 months'], ['Main risks', 'Unproven demand; Quillon has little Asian experience', 'Integration; paying too much; culture clash']]},
        {'title': 'Appendix D  Hanbit acquisition: forecast net cash flows (£m)', 'table': [['Initial cost', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'], ['28.0', *['%.1f' % x for x in ACQ['flows']]]], 'note': 'Discount factors at 10%: Year 1 0.909; Year 2 0.826; Year 3 0.751; Year 4 0.683; Year 5 0.621. Quillon’s payback criterion is 3 years.'},
    ],
    'questions': [
        {'n': 1, 'marks': 12, 'spec': '3.10.1', 'q': 'Use Lewin’s force field model to analyse why Quillon Games plc has been slow to change its strategy.',
         'content': ['Driving forces for change: Skyforge downloads falling (31m → 14m); share price down 45%; shareholder criticism; possible loot-box regulation.', 'Restraining forces: Skyforge still 72% of revenue - reluctance to disrupt it; creative, self-managing culture resists structure; dividend expectations; lack of Asian experience and cost of change; fear of failure.', 'Force field balance: restrainers held until the sharp fall in 2024; to change, strengthen drivers (share price pressure) or weaken restrainers (involve developers, communicate vision).', 'Level 3 needs developed use of the model with case evidence (not only a description).']},
        {'n': 2, 'marks': 12, 'spec': '3.3.4', 'q': 'Use the Boston Matrix to analyse the marketing implications for Quillon Games plc of Skyforge’s falling downloads.',
         'content': ['Skyforge was a star/cash cow (high share, high growth) generating 72% of revenue; with falling downloads it is moving towards a cash cow in a declining market or dog.', 'Marketing implications: stop heavy promotion; maintain with low-cost updates and in-game offers to milk cash; use revenue to fund new products (question marks).', 'Portfolio: other games are small/unprofitable (dogs/question marks) - Quillon needs new stars; product life cycle extension strategies (new levels, events).', 'Credit developed use of the matrix in Quillon’s context, including marketing mix changes (product, promotion, pricing of in-game purchases).']},
        {'n': 3, 'marks': 16, 'spec': '3.7.2', 'q': 'To what extent does Appendix A suggest that Quillon Games plc is in a strong financial position?',
         'content': ['Operating margin fell from %.1f%% (2022) to %.1f%% (2024); operating profit down 48%% from £21.0m to £11.0m.' % (_qg_opm[0], _qg_opm[2]), 'ROCE = 11 ÷ (84 + 36) = %.1f%% - low for a technology firm.' % _qg_roce, 'Current ratio = 48 ÷ 40 = %.1f : 1 - healthy liquidity (no inventories; cash-rich).' % _qg_cr, 'Gearing = 36 ÷ 120 = %.0f%% - low; ability to borrow for investment.' % _qg_gear, 'But revenue falling (96 → 90) and dependence on one game; share price falling; large dividend paid in 2023 - weaker than it looks.', 'Judgement: sound balance sheet but deteriorating profitability and a risky revenue base; trend matters.']},
        {'n': 4, 'marks': 16, 'spec': '3.7.8', 'q': 'Should Quillon Games plc acquire Hanbit Studios?\nUse Appendix D and other information to justify your answer.',
         'content': ['NPV = (4.0×0.909 + 8.0×0.826 + 10.0×0.751 + 11.0×0.683 + 12.0×0.621) − 28.0 = £%.2fm - positive (accept).' % _acq_npv, 'Payback = %.2f years - fails the 3-year criterion (%.1f years is more than 3).' % (_acq_pb, _acq_pb), 'ARR = (45 − 28) ÷ 5 ÷ 28 × 100 = %.1f%% a year.' % _acq_arr, 'For: positive NPV; immediate Asian presence and revenue in 6 months (v 24-30 for Option 1); gets proven developers and reduces dependence on Skyforge.', 'Against: fails the payback criterion; £28m is large relative to profit; culture clash with Quillon’s teams; integration risk; forecasts uncertain; gearing may rise if borrowed.', 'Judgement should weigh the positive NPV and speed against the payback and integration risk.']},
        {'n': 5, 'marks': 20, 'spec': '3.8.1 / 3.9.3', 'q': 'Should Quillon Games plc choose Option 1 (develop new games in-house for the Asian market) or Option 2 (acquire Hanbit Studios)?\nUse quantitative and qualitative information to justify your view.',
         'content': ['Option 2: faster (6 months), local knowledge/brand; NPV positive; but £28m, integration/culture risk; external growth - synergy v diseconomies.', 'Option 1: organic, controlled, cheaper per stage; but 24-30 months to first revenue while Skyforge is declining - cash flow risk; unproven demand; Quillon has little Asian experience.', 'Ansoff: both market development (new markets); acquisition lowers risk through experienced partner; Option 1 mixes new product and market (closer to diversification) - higher risk.', 'Finance: low gearing (30%) and good liquidity allow Option 2 funded by debt; share price fall reduces equity finance appeal.', 'Judgement: speed matters given Skyforge decline - Option 2 likely better unless the price is too high; depends on integration ability.']},
        {'n': 6, 'marks': 24, 'spec': '3.7.6 / 3.2.2', 'q': 'To what extent should the ethical impact of its products influence a business’s strategic decisions?',
         'content': ['For: reputation and trust; regulation risk (loot boxes), legal liability; stakeholders (parents, regulators) and employees’ values; long-term triple bottom line; Carroll’s pyramid - ethical responsibilities.', 'Against: shareholders expect profit (shareholder concept); competitors may not follow so lose market share; ethical choices are subjective; customers may not care.', 'Contexts: consumer products for children, tobacco, fast fashion, social media; financial services; depends on industry and customer awareness.', 'Judgement should weigh short-term profit against long-term risk and show the factors on which the answer depends; contrasting businesses needed for top levels.']},
    ],
}
