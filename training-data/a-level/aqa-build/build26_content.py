"""Generate revision/a-level/business-2026/js/{quiz,cards}.js: reuse in-spec items from the 2023 banks + new 2026-only items."""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, '..', '..', '..'))
D23 = os.path.join(REPO, 'revision', 'a-level', 'business-2023', 'data')
OUT = os.path.join(REPO, 'revision', 'a-level', 'business-2026', 'js')

RULES = [
    ('C', r'sustainab|csr|esg|greenwash|bluewash|triple bottom|elkington|carroll|five forces|porter|political|trade agreement|tariff|quota|protectionis|gdp|inflation|exchange rate|unemployment|interest rate|fiscal|monetary|activism|disruptive|swot|stakeholder map|ansoff|positioning|strategic drift|strategy|mission|vision|payback|average rate of return|net present|npv|investment appraisal|merger|takeover|acquisition|franchis|integration|retrench|globali|multinational|international|joint venture|glocal|digital strategy|lewin|kotter|force field|resistance to change|risk|uncertainty|contingency|crisis|agile|scenario|organic growth|external growth|economies of scope|overtrading|corporate objective|competitive advantage|core competence'),
    ('B', r'human resource|hr |labour turnover|employee turnover|workforce|recruit|training|redundan|redeploy|zero-hours|flexible|span of control|hierarch|delayer|centralis|leadership|autocratic|democratic|transformational|appraisal|talent|hackman|motivat|maslow|herzberg|taylor|piece rate|commission|performance-related|wellbeing|trade union|works council|employee|capacity|lean production|kaizen|just in time|just in case|inventory|supply chain|supplier|outsourc|quality|tqm|benchmark|network|critical path|float|economies of scale|diseconomies|productivity|unit cost|innovation|research and development|intrapreneur|patent|copyright|culture|organisational structure|job enrichment|empowerment|operations'),
    ('A', r'.'),
]
EXCLUDE = r'bowman|blake|greiner|tannenbaum|decision tree|expected value|net gain|paternalistic|laissez|scientific decision|intuition|mintzberg|planned v emergent|emergent'


def aim_of(text):
    t = text.lower()
    for a, rx in RULES:
        if re.search(rx, t):
            return a
    return 'A'


def js(s):
    return json.dumps(s, ensure_ascii=False)


# ───────────────────────── new 2026-only content ─────────────────────────
M = []   # (aim, topic, question, correct, [wrong x3], explanation)
TF = []  # (aim, topic, statement, bool, explanation)
F = []   # (aim, front, back)


def m(a, t, q, c, w, e):
    M.append((a, t, q, c, w, e))


def tf(a, t, s, v, e):
    TF.append((a, t, s, v, e))


def f(a, fr, bk):
    F.append((a, fr, bk))


# A1 entrepreneurs, planning, objectives
m('A', 'Entrepreneurs', 'Which is a NON-financial reason for setting up in business?', 'Being your own boss', ['Earning a higher income than in employment', 'Building personal wealth', 'Receiving dividends'], 'Independence/being your own boss is non-financial; the others are financial motives.')
m('A', 'Entrepreneurs', 'An entrepreneur who keeps going after early setbacks is showing which characteristic?', 'Resilience', ['Risk taking', 'Innovation', 'Delegation'], 'Resilient entrepreneurs recover from setbacks and persist.')
m('A', 'Entrepreneurs', 'As a business grows, the role of the entrepreneur is most likely to change from…', 'doing every task to delegating and leading others', ['planning to doing', 'owner to employee only', 'leader to follower'], 'Growth forces delegation, management and strategy rather than doing everything personally.')
m('A', 'Business planning', 'The main purpose of a business plan is to…', 'set out objectives and how they will be achieved, helping to persuade lenders and investors', ['guarantee success', 'replace market research', 'avoid paying tax'], 'It clarifies aims, market, finance and strategy and supports funding applications.')
m('A', 'Business planning', 'Opportunity cost is…', 'the benefit of the next best alternative that is given up', ['the money spent on a decision', 'the total cost of production', 'the cost of borrowing'], 'Choosing one option means losing the benefit of the best alternative.')
m('A', 'Objectives', 'In SMART objectives, the “A” (in the AQA specification) stands for…', 'Accountable', ['Achievable only', 'Advertised', 'Adjustable'], 'AQA lists Specific, Measurable, Accountable, Realistic, Time specific.')
m('A', 'Objectives', 'Which objective is the most SMART?', 'Increase market share from 8% to 10% within 12 months', ['Become the best business', 'Make more profit', 'Grow quickly in the future'], 'It is specific, measurable and time-bound.')
tf('A', 'Business planning', 'Ethical dilemmas in decision making can involve a conflict between profit and doing the right thing.', True, 'e.g. cheaper but unethical suppliers.')
# A2 forms and stakeholders
m('A', 'Forms of business', 'A co-operative is owned by…', 'its members (workers, consumers or producers) who share in decision making and profits', ['one entrepreneur', 'the government', 'only outside investors'], 'Co-operatives are member-owned: worker, consumer or producer co-operatives.')
m('A', 'Forms of business', 'A social enterprise differs from a typical private company because it…', 'trades mainly to achieve social or environmental aims and reinvests most of its profits', ['cannot make a profit', 'is owned by the government', 'has unlimited liability'], 'Social enterprises trade like businesses for a social purpose.')
m('A', 'Share data', 'A plc has 20 million shares at a market price of £3.50. Its market capitalisation is…', '£70 million', ['£23.5 million', '£7 million', '£3.5 million'], 'Market capitalisation = share price × number of shares = £3.50 × 20m.')
m('A', 'Share data', 'A share price of £4.00 and a dividend per share of 20p gives a dividend yield of…', '5%', ['20%', '0.2%', '8%'], 'Dividend yield = dividend per share ÷ share price × 100 = 0.20 ÷ 4.00.')
m('A', 'Share data', 'Dividends per share are calculated as…', 'total dividends ÷ number of shares', ['profit ÷ revenue', 'share price × shares', 'retained profit ÷ equity'], 'Total dividend divided by the number of issued shares.')
m('A', 'Stakeholders', 'Which is an EXTERNAL stakeholder?', 'Local community', ['Employees', 'Managers who own shares', 'Owners'], 'Customers, suppliers, creditors, community and government are external stakeholders.')
# A3 marketing
m('A', 'Market research', 'A 95% confidence interval means that…', 'if the research were repeated many times, about 95% of the intervals would contain the true value', ['the results are 95% correct', 'there is a 5% chance the survey is biased', 'the sample is 95% of the population'], 'Confidence levels describe how often an interval would contain the true population value.')
m('A', 'Market research', 'A market map is used to…', 'show how competing brands are positioned on two dimensions such as price and quality', ['forecast sales', 'calculate market share', 'measure employee productivity'], 'Market mapping reveals gaps and competitors’ positioning.')
m('A', 'Markets', 'A business sells components to other manufacturers. This is a…', 'B2B market', ['B2C market', 'C2C market', 'public sector market'], 'Business-to-business: customers are other businesses.')
m('A', 'Markets', 'Selling used goods through an online platform is an example of a…', 'C2C market', ['B2B market', 'B2C market', 'monopoly'], 'Consumers sell to other consumers via a platform.')
m('A', 'Markets', 'Return on marketing spend measures…', 'the extra profit or revenue generated per £ spent on marketing', ['the total marketing budget', 'market share', 'brand loyalty'], 'It compares the return from a campaign with its cost.')
m('A', 'Demand', 'Price elasticity of demand is −2.5. A 10% price rise will cause quantity demanded to…', 'fall by about 25%', ['fall by 4%', 'rise by 25%', 'fall by 10%'], 'PED = %Δ quantity ÷ %Δ price, so %Δ quantity = −2.5 × 10 = −25%.')
m('A', 'Demand', 'If demand for a product is price inelastic, a price rise will…', 'increase total revenue', ['decrease total revenue', 'leave revenue unchanged', 'increase quantity demanded'], 'Quantity falls proportionally less than price rises.')
m('A', 'Demand', 'Income elasticity of demand of −0.4 means the product is…', 'an inferior good', ['a luxury good', 'a normal necessity', 'price elastic'], 'Negative YED: demand falls as incomes rise.')
m('A', 'Segmentation', 'Segmenting customers by values, lifestyle and attitudes is…', 'psychographic segmentation', ['demographic segmentation', 'geographic segmentation', 'behavioural segmentation'], 'Psychographic = personality, values, interests, lifestyle.')
m('A', 'Segmentation', 'Segmenting by past purchases and loyalty is…', 'behavioural segmentation', ['demographic segmentation', 'geographic segmentation', 'psychographic segmentation'], 'Behavioural = how customers use/buy.')
m('A', 'Marketing objectives', 'Lead generation as a marketing objective means…', 'attracting the interest of potential customers so they can be contacted or converted', ['reducing prices', 'recruiting managers', 'increasing the number of shops'], 'Leads are potential customers who have shown interest.')
m('A', 'Marketing objectives', 'A conversion rate of 4% on a website with 25,000 visitors means…', '1,000 visitors made a purchase', ['4,000 visitors made a purchase', '100 visitors made a purchase', '25,000 visitors made a purchase'], '4% of 25,000 = 1,000.')
m('A', 'Pricing', 'Dynamic pricing means…', 'changing prices frequently in response to demand, time or customer data', ['setting one fixed price for a year', 'always pricing below competitors', 'pricing at cost plus 20%'], 'Examples: airline, ride-hailing and ticket prices.')
m('A', 'Pricing', 'Setting a price equal to that of similar competitors is…', 'going-rate (competition-based) pricing', ['cost-plus pricing', 'price skimming', 'penetration pricing'], 'Competition-based methods: premium, going rate, discount.')
m('A', 'Distribution', 'An advantage of selling directly to customers online is that…', 'the business keeps the retailer’s margin and gains customer data', ['the business needs no logistics', 'there is no competition', 'returns are never needed'], 'Direct selling avoids intermediaries but needs delivery and marketing capability.')
m('A', 'Promotion', 'Own-label brands are products that…', 'are sold under a retailer’s own name', ['are made by the government', 'cannot be advertised', 'are only sold online'], 'Own-label supermarket brands compete with manufacturer brands.')
m('A', 'Digital marketing', 'SEO aims to…', 'improve a website’s ranking in unpaid search results', ['pay per click on adverts', 'collect customer cookies', 'reduce delivery costs'], 'Search engine optimisation = organic visibility.')
m('A', 'Digital marketing', 'In PPC advertising, the business pays…', 'each time a user clicks on its advert', ['a fixed fee per year', 'only when a sale is made', 'nothing if the advert is seen'], 'Pay per click.')
m('A', 'Digital marketing', 'CRM systems are mainly used to…', 'manage customer data and relationships to acquire and retain customers', ['calculate break-even', 'manage production schedules', 'record shareholder meetings'], 'CRM supports lead generation, pipeline management and retention.')
m('A', 'Digital marketing', 'Website cookies allow a business to…', 'track user behaviour and personalise content or adverts', ['delete customer data', 'increase production', 'avoid GDPR'], 'But raise privacy/ethical issues.')
m('A', 'Digital marketing', 'Which is a measure of success for digital marketing?', 'Click-through rate', ['Break-even output', 'Labour turnover', 'Gearing'], 'Others: conversion rate, time on site, subscribers, search ranking.')
tf('A', 'Digital marketing', 'Using AI for dynamic pricing can raise ethical concerns about fairness to customers.', True, 'Customers may feel treated unfairly if prices differ based on their data.')
# A4 finance
m('A', 'Sources of finance', 'Sale and leaseback is when a business…', 'sells an asset it owns and leases it back to release cash', ['buys equipment on hire purchase', 'borrows from a bank using shares', 'issues new shares to the public'], 'It releases capital tied up in assets while keeping use of them.')
m('A', 'Sources of finance', 'A business angel is…', 'a wealthy individual who invests their own money in a start-up in return for a share', ['a government grant', 'a type of overdraft', 'a supplier offering credit'], 'Angels invest and often provide advice and contacts.')
m('A', 'Sources of finance', 'Which is an EXTERNAL source of finance?', 'Private equity', ['Retained profit', 'Sale of assets', 'Owners’ investment of existing profits'], 'Private equity firms buy shares in a company.')
m('A', 'Sources of finance', 'Trade credit is…', 'buying goods now and paying the supplier later', ['a bank overdraft', 'selling shares', 'a loan from friends'], 'It increases payables and helps cash flow.')
m('A', 'Budgets', 'Zero-based budgeting means…', 'every item of expenditure must be justified from zero each period', ['the budget is always zero', 'last year’s budget is increased by inflation', 'only revenue is budgeted'], 'It avoids automatic carry-over of old spending.')
m('A', 'Cash flow', 'Current assets £60m, inventory £20m, current liabilities £25m. The acid test ratio is…', '1.6 : 1', ['2.4 : 1', '0.8 : 1', '3.0 : 1'], 'Acid test = (current assets − inventory) ÷ current liabilities = 40 ÷ 25.')
m('A', 'Cash flow', 'Which action would improve a business’s cash flow in the short term?', 'Offering customers a discount for early payment', ['Buying more inventory', 'Extending customer credit terms', 'Paying suppliers earlier'], 'Early payment incentives bring cash in sooner.')
m('A', 'Financial reporting', 'Operating profit £12m, revenue £80m. Operating profit margin is…', '15%', ['6.7%', '12%', '1.5%'], '12 ÷ 80 × 100.')
m('A', 'Financial reporting', 'A limitation of financial reporting is that it…', 'is historic and omits non-financial factors such as morale and brand reputation', ['is always wrong', 'only shows cash flow', 'ignores all costs'], 'Accounts reflect past performance and do not capture non-financial factors.')
m('A', 'Financial reporting', 'ROCE is calculated as…', 'operating profit ÷ capital employed × 100', ['profit ÷ revenue × 100', 'current assets ÷ current liabilities', 'non-current liabilities ÷ capital employed'], 'ROCE measures profit generated from the capital invested.')
tf('A', 'Ethics in finance', 'Using very long payment terms for small suppliers is an ethical issue in finance.', True, 'It harms suppliers’ cash flow.')
# B people and operations
m('B', 'HR planning', 'Which form of employment gives the business the MOST flexibility but the least job security for employees?', 'Zero-hours contract', ['Full-time permanent', 'Salaried manager', 'Fixed-term for 5 years'], 'Zero-hours contracts have no guaranteed hours.')
m('B', 'HR data', 'Employee costs of £6m and revenue of £40m. Employee costs as a percentage of revenue is…', '15%', ['6.7%', '85%', '1.5%'], '6 ÷ 40 × 100.')
m('B', 'HR data', 'A business with 200 employees sells £5m. Sales per employee is…', '£25,000', ['£40', '£250,000', '£2,500'], '5,000,000 ÷ 200.')
m('B', 'Organisation', 'Delayering normally leads to…', 'wider spans of control and fewer levels of hierarchy', ['narrower spans of control', 'more management layers', 'less delegation'], 'Removing layers widens spans of control.')
m('B', 'Leadership', 'A transformational leader…', 'inspires employees with a vision and encourages them to exceed expectations and innovate', ['makes all decisions alone', 'only rewards task completion', 'avoids involvement'], 'Transformational leadership emphasises vision, inspiration and development.')
m('B', 'Teamwork', 'Hackman’s model of team effectiveness suggests that teams are most effective when they have…', 'a real team with clear purpose, a supportive context and expert coaching', ['the largest possible size', 'one dominant leader only', 'no deadlines'], 'It stresses real teams, compelling direction, enabling structure, supportive context and coaching.')
m('B', 'Developing people', 'The main purpose of employee appraisal is to…', 'review performance, set targets and identify development needs', ['reduce wages', 'recruit new staff', 'calculate labour turnover'], 'Appraisals support performance management and development.')
m('B', 'Motivation', 'Herzberg’s “hygiene factors” include…', 'pay, working conditions and job security', ['achievement and recognition', 'responsibility and advancement', 'self-actualisation'], 'Hygiene factors prevent dissatisfaction but do not motivate.')
m('B', 'Rewards', 'A fringe benefit is…', 'a non-wage benefit such as a company car or private healthcare', ['piece-rate pay', 'a legal minimum', 'a fine'], 'Fringe benefits supplement pay.')
m('B', 'Wellbeing', 'Which is a method of improving employee wellbeing?', 'Mental health support and flexible working', ['Longer shifts', 'Removing breaks', 'Reducing training'], 'Others: inclusive environment, employee voice.')
m('B', 'Relations', 'An employee forum is…', 'a group representing employees that consults with management', ['a trade union only for managers', 'a government department', 'a shareholder meeting'], 'A form of employee voice.')
m('B', 'Operations', 'Which is a KPI in operations?', 'Delivery times', ['Dividend yield', 'Gearing', 'Market capitalisation'], 'Operations KPIs: defects, returns, wait times, delivery speed, satisfaction.')
m('B', 'Operations', 'Capacity utilisation = ', 'actual output ÷ maximum capacity × 100', ['capacity ÷ output', 'output ÷ employees', 'costs ÷ output'], 'Shows how much of capacity is used.')
m('B', 'Quality', 'Total Quality Management (TQM) means…', 'making quality the responsibility of everyone in the business', ['inspecting only finished goods', 'cutting quality to reduce costs', 'outsourcing quality'], 'TQM focuses on continuous improvement and getting it right first time.')
m('B', 'Quality', 'Quality circles are…', 'small groups of employees who meet to solve quality problems', ['groups of customers', 'inspection teams from outside', 'boards of directors'], 'They encourage employee involvement in improvement.')
m('B', 'Environment', 'Circularity in operations means…', 'keeping materials in use through reuse, repair and recycling', ['making products as cheaply as possible', 'disposing of waste quickly', 'using only new materials'], 'It reduces waste and resource use.')
m('B', 'Supply chain', 'A supplier code of conduct is…', 'a set of ethical standards suppliers must meet', ['a legal tax rule', 'a price list', 'a type of insurance'], 'Often backed by supplier audits.')
m('B', 'Inventory', 'Cost of sales £90m and average inventory £15m. Inventory turnover is…', '6 times', ['0.17 times', '75 times', '105 times'], '90 ÷ 15.')
m('B', 'Project management', 'In network analysis, float is…', 'the time an activity can be delayed without delaying the project', ['the total project time', 'the cost of an activity', 'the critical path'], 'Critical activities have zero float.')
m('B', 'Culture', 'Which is a factor that influences business culture?', 'Leadership style', ['Exchange rates', 'Corporation tax', 'Inflation'], 'Also mission, reward systems, structure and customer expectations.')
tf('B', 'Ethics in HR', 'Reporting a gender pay gap is an ethical issue in HR.', True, 'Pay gaps, including between senior managers and others, are on the specification.')
# C society, environment, strategy
m('C', 'Sustainability', 'Greenwashing is…', 'making misleading claims about the environmental benefits of a business or product', ['reducing emissions', 'recycling waste', 'a legal form of tax planning'], 'It is a PR tactic that exaggerates environmental credentials.')
m('C', 'Sustainability', 'ESG stands for…', 'Environmental, Social and Governance', ['Economic, Strategic and Global', 'Efficiency, Sustainability and Growth', 'Ethics, Staff and Government'], 'ESG reporting measures non-financial performance.')
m('C', 'Sustainability', 'Bluewashing refers to…', 'misleading claims of social responsibility, for example by signing up to a human-rights pledge without acting', ['cutting emissions', 'ocean cleaning', 'tax avoidance'], 'It is the social equivalent of greenwashing.')
m('C', 'External environment', 'A depreciation of the pound is most likely to…', 'make UK exports cheaper in foreign currency and imports dearer', ['make exports dearer', 'reduce inflation', 'increase the cost of exports for foreigners'], 'A weaker pound lowers export prices abroad and raises import costs.')
m('C', 'External environment', 'A tariff is…', 'a tax on imported goods', ['a limit on the quantity of imports', 'a subsidy for exporters', 'a business tax'], 'A quota limits quantity; a tariff is a tax.')
m('C', 'External environment', 'Which is an example of the “social” environment?', 'Changing consumer values', ['Interest rates', 'A new tax', 'Artificial intelligence'], 'Social: demographics, values, activism.')
m('C', 'Strategy', 'Stakeholder actions that can influence a business include…', 'boycotts, protests and lobbying', ['setting prices', 'hiring employees', 'issuing shares'], 'Activism can change decisions.')
m('C', 'Strategy', 'A business sells existing products in a new country. In Ansoff’s matrix this is…', 'market development', ['market penetration', 'diversification', 'new product development'], 'Existing product, new market.')
m('C', 'Strategy', 'Strategic drift occurs when…', 'a business’s strategy changes more slowly than its external environment', ['a business changes too fast', 'the mission is rewritten', 'a business has no competitors'], 'The gap between the business and its environment widens.')
m('C', 'Investment', 'A project costs £80,000 and returns £30,000 a year for four years. Payback is…', '2 years 8 months', ['3 years', '2 years', '4 years'], '£60,000 after 2 years, then £20,000 ÷ £30,000 × 12 = 8 months.')
m('C', 'Growth', 'Glocalisation is…', 'adapting global products or marketing to suit local markets', ['selling one identical product everywhere', 'moving production home', 'international joint venture'], '“Think global, act local.”')
m('C', 'Change', 'Which of the following is a reason for resistance to change in Kotter and Schlesinger’s model?', 'Parochial self-interest', ['Strong leadership', 'Good communication', 'Clear vision'], 'Others: misunderstanding, low tolerance of change, different assessments of the situation.')
m('C', 'Risk', 'A data breach is an example of…', 'cybersecurity risk', ['compliance risk only', 'strategic risk only', 'financial risk only'], 'Cybersecurity risk covers hacking and data loss.')
m('C', 'Risk', 'Scenario planning involves…', 'preparing for several possible future situations', ['predicting one future exactly', 'ignoring uncertainty', 'cutting budgets'], 'It helps businesses deal with uncertainty.')
m('C', 'Risk', 'Which is a feature of an agile business?', 'Flat structure and empowered, cross-functional teams', ['Tall hierarchy', 'Centralised decisions', 'Long approval chains'], 'Agility helps respond to uncertainty.')
tf('C', 'Change', 'In Lewin’s force field analysis, change occurs when the driving forces are stronger than the restraining forces.', True, 'Strengthen drivers or weaken restrainers.')

# flashcards (new / 2026-specific)
for a, fr, bk in [
    ('A', 'Entrepreneur characteristics (AQA)', 'Risk taker, resilient, focused, passionate, innovative, adaptable.'),
    ('A', 'SMART (AQA)', 'Specific, Measurable, Accountable, Realistic, Time specific.'),
    ('A', 'Opportunity cost', 'The value of the next best alternative that is given up when a decision is made.'),
    ('A', 'Co-operative', 'Business owned by its members (workers, consumers or producers) who share in decisions and profits.'),
    ('A', 'Market capitalisation', 'Share price × number of shares.'),
    ('A', 'Dividend yield', 'Dividend per share ÷ share price × 100.'),
    ('A', 'Dividend per share', 'Total dividends ÷ number of shares.'),
    ('A', 'Confidence interval', 'A range within which the true value is likely to lie at a stated confidence level (e.g. 95%).'),
    ('A', 'Market mapping', 'Plotting brands on two dimensions (e.g. price and quality) to see positioning and gaps.'),
    ('A', 'B2B / B2C / C2C', 'Business-to-business, business-to-consumer, consumer-to-consumer markets.'),
    ('A', 'Return on marketing spend', 'Extra profit or revenue generated ÷ marketing spend.'),
    ('A', 'Price elasticity of demand (PED)', '% change in quantity demanded ÷ % change in price. Inelastic (|PED| < 1): raise price to raise revenue. Elastic (|PED| > 1): cut price to raise revenue.'),
    ('A', 'Income elasticity of demand (YED)', '% change in quantity demanded ÷ % change in income. Positive = normal/luxury; negative = inferior.'),
    ('A', 'Psychographic segmentation', 'Dividing a market by values, lifestyle, attitudes and personality.'),
    ('A', 'Lead generation / conversion', 'Attracting potential customers / turning leads or visitors into purchasers.'),
    ('A', 'Dynamic pricing', 'Changing prices frequently in response to demand, timing or customer data.'),
    ('A', 'SEO / PPC', 'Search engine optimisation (organic ranking) / pay per click (paid adverts).'),
    ('A', 'CRM', 'Customer Relationship Management: systems to acquire, retain and manage customers.'),
    ('A', 'Digital measures of success', 'Search ranking, click-through rate, time on site, conversion rate, number of users/subscribers, advertising revenue.'),
    ('A', 'Sale and leaseback', 'Selling an owned asset and leasing it back to raise cash.'),
    ('A', 'Business angel / private equity', 'Wealthy individual / firm that invests in a business in return for shares.'),
    ('A', 'Zero-based budgeting', 'Every item of spending must be justified from zero each period.'),
    ('A', 'Acid test ratio', '(Current assets − inventory) ÷ current liabilities.'),
    ('A', 'Current ratio', 'Current assets ÷ current liabilities.'),
    ('A', 'Payables days / Receivables days', 'Payables ÷ cost of sales × 365 / Receivables ÷ revenue × 365.'),
    ('A', 'ROCE', 'Operating profit ÷ capital employed × 100 (capital employed = total equity + non-current liabilities).'),
    ('A', 'Gearing', 'Non-current liabilities ÷ capital employed × 100.'),
    ('A', 'Break-even output', 'Fixed costs ÷ contribution per unit. Margin of safety = actual output − break-even output.'),
    ('B', 'Employee turnover', 'Leavers ÷ average number of employees × 100.'),
    ('B', 'Labour productivity', 'Output ÷ number of employees (also sales per employee).'),
    ('B', 'Employee costs % of revenue', 'Employee costs ÷ revenue × 100.'),
    ('B', 'Span of control / hierarchy', 'Number of subordinates a manager supervises / number of layers of authority.'),
    ('B', 'Transformational leadership', 'Leader inspires through vision, encourages innovation and develops followers.'),
    ('B', 'Hackman’s model', 'Team effectiveness depends on a real team, compelling direction, enabling structure, supportive context and expert coaching.'),
    ('B', 'Taylor / Maslow / Herzberg', 'Money motivates (piece rate) / hierarchy of needs / hygiene factors v motivators.'),
    ('B', 'Fringe benefits', 'Non-wage rewards such as company cars, healthcare or discounts.'),
    ('B', 'Capacity utilisation', 'Actual output ÷ maximum capacity × 100.'),
    ('B', 'TQM and quality circles', 'Quality is everyone’s responsibility; small employee groups meet to solve quality problems.'),
    ('B', 'Lean production', 'Cutting waste: reducing inventory, re-work, waiting and transport times; kaizen; standardised processes.'),
    ('B', 'Circularity', 'Keeping resources in use through reuse, repair, recycling.'),
    ('B', 'Inventory turnover', 'Cost of sales ÷ average inventory (times per year).'),
    ('B', 'Float and critical path', 'Float: time an activity can slip without delaying the project; critical path: longest path with zero float.'),
    ('B', 'Economies / diseconomies of scale', 'Falling average costs as output rises (technical, purchasing, financial) / rising average costs (control, communication, coordination).'),
    ('B', 'Business culture influences', 'Leadership and employee values, leadership style, mission, reward systems, structure, customer expectations.'),
    ('C', 'Triple Bottom Line', 'People, Planet, Profit.'),
    ('C', 'Carroll’s pyramid', 'Economic, legal, ethical, philanthropic responsibilities.'),
    ('C', 'Greenwashing / bluewashing', 'Misleading environmental / social-responsibility claims for PR.'),
    ('C', 'ESG', 'Environmental, Social and Governance reporting and measures.'),
    ('C', 'Porter’s five forces', 'Rivalry, buyer power, supplier power, entry threat, substitute threat.'),
    ('C', 'Tariff / quota', 'Tax on imports / limit on quantity of imports.'),
    ('C', 'Exchange rate depreciation', 'Pound falls: exports cheaper abroad, imports dearer in the UK.'),
    ('C', 'SWOT / stakeholder mapping', 'Internal strengths/weaknesses, external opportunities/threats / mapping stakeholders by power and interest.'),
    ('C', 'Ansoff matrix', 'Market penetration, market development, new product development, diversification.'),
    ('C', 'Strategic drift', 'Strategy changes slower than the environment, so the business loses competitiveness.'),
    ('C', 'Payback / ARR / NPV', 'Time to recover investment / average annual profit ÷ cost × 100 / present value of inflows − cost.'),
    ('C', 'Glocalisation', 'Adapting global products and marketing to local markets.'),
    ('C', 'Joint venture / licensing', 'Two firms share a project / permission to use a brand or technology for a fee.'),
    ('C', 'Kotter and Schlesinger (resistance)', 'Parochial self-interest, misunderstanding, low tolerance of change, different assessments.'),
    ('C', 'Lewin’s force field', 'Compare driving and restraining forces; strengthen drivers or weaken restrainers.'),
    ('C', 'Types of risk', 'Financial, strategic, operational, compliance, reputational, cybersecurity.'),
    ('C', 'Agile business', 'Flat structure, empowerment, transformational leadership and cross-functional teams to respond to uncertainty.'),
    ('C', 'Scenario planning', 'Preparing for several possible futures to manage uncertainty.'),
]:
    f(a, fr, bk)


def main():
    quiz = []
    seen = set()
    def add_q(item):
        key = item['q'].strip().lower()
        if key in seen:
            return
        seen.add(key)
        quiz.append(item)
    # reuse 2023 quiz
    for it in json.load(open(os.path.join(D23, 'quiz.json'), encoding='utf-8')):
        txt = it['question'] + ' ' + ' '.join(it['choices']) + ' ' + it.get('explanation', '')
        if re.search(EXCLUDE, txt, re.I):
            continue
        ch = it['choices']
        a = aim_of(it['question'] + ' ' + it.get('topic', ''))
        add_q({'a': a, 't': it.get('topic', '').split(' ', 1)[-1] if it.get('topic') else 'Revision', 'q': it['question'], 'type': it.get('type', 'mcq'), 'choices': ch, 'ci': it['correct_index'], 'e': it.get('explanation', '')})
    for it in json.load(open(os.path.join(D23, 'mc.json'), encoding='utf-8')):
        opts = it.get('options') or []
        txt = it['question'] + ' ' + ' '.join(o['text'] for o in opts)
        if re.search(EXCLUDE, txt, re.I) or not opts or not it.get('mark_scheme', {}).get('answer'):
            continue
        ch = [o['text'] for o in opts]
        labels = [o['label'] for o in opts]
        try:
            ci = labels.index(it['mark_scheme']['answer'])
        except ValueError:
            continue
        add_q({'a': aim_of(it['question'] + ' ' + it.get('topic', '')), 't': (it.get('topic', '') or 'Revision').split(' ', 1)[-1], 'q': it['question'], 'type': 'mcq', 'choices': ch, 'ci': ci, 'e': it['mark_scheme'].get('explanation', '')})
    n_old = len(quiz)
    out = ['/* AQA A-level Business (7138) — quiz. Reused in-spec questions from the AQA 7132 bank plus new 7138 questions (AI, ESG, risk, agility, dividend yield, ...). Generated by training-data/a-level/aqa-build/build26_content.py */\n(function () {\n  \'use strict\';\n  const { M, TF } = window.__BIZ_B;\n']
    for it in quiz:
        if it['type'] == 'true_false':
            out.append('  TF(%s, %s, %s, %s, %s);\n' % (js(it['a']), js(it['t']), js(it['q']), 'true' if it['ci'] == 0 else 'false', js(it['e'])))
        else:
            ch = it['choices']
            correct = ch[it['ci']]
            wrong = [c for i, c in enumerate(ch) if i != it['ci']]
            out.append('  M(%s, %s, %s, %s, %s, %s);\n' % (js(it['a']), js(it['t']), js(it['q']), js(correct), js(wrong), js(it['e'])))
    for a, t, q, c, w, e in M:
        out.append('  M(%s, %s, %s, %s, %s, %s);\n' % (js(a), js(t), js(q), js(c), js(w), js(e)))
    for a, t, s, v, e in TF:
        out.append('  TF(%s, %s, %s, %s, %s);\n' % (js(a), js(t), js(s), 'true' if v else 'false', js(e)))
    out.append('})();\n')
    open(os.path.join(OUT, 'quiz.js'), 'w', encoding='utf-8').write(''.join(out))

    cards = []
    cseen = set()
    for it in json.load(open(os.path.join(D23, 'flashcards.json'), encoding='utf-8')):
        txt = it['front'] + ' ' + it['back']
        if re.search(EXCLUDE, txt, re.I):
            continue
        k = it['front'].strip().lower()
        if k in cseen:
            continue
        cseen.add(k)
        cards.append((aim_of(it['front'] + ' ' + it['back'] + ' ' + it.get('topic', '')), it['front'], it['back']))
    for a, fr, bk in F:
        if fr.strip().lower() in cseen:
            continue
        cseen.add(fr.strip().lower())
        cards.append((a, fr, bk))
    out = ['/* AQA A-level Business (7138) — flashcards. Generated by training-data/a-level/aqa-build/build26_content.py */\n(function () {\n  \'use strict\';\n  const { F } = window.__BIZ_B;\n']
    for a, fr, bk in cards:
        out.append('  F(%s, %s, %s);\n' % (js(a), js(fr), js(bk)))
    out.append('})();\n')
    open(os.path.join(OUT, 'cards.js'), 'w', encoding='utf-8').write(''.join(out))
    from collections import Counter
    print('quiz reused', n_old, '+ new', len(M) + len(TF), '| cards', len(cards), Counter(a for a, _, _ in cards), Counter(i['a'] for i in quiz))


if __name__ == '__main__':
    main()
