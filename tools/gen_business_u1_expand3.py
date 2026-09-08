# -*- coding: utf-8 -*-
"""BTEC Business Unit 1 expansion — batch 3 (final, to reach 300+)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-1\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A ============
add("A","A1 Ownership and liability","Explain",4,"AO2","","Explain how limited liability benefits the owners of a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Limited liability protects owners' personal assets (1) so they only risk losing what they invested in the business (1)","This reduces the personal financial risk of ownership (1) encouraging investment and entrepreneurship (1)"]))
add("A","A1 Ownership and liability","Explain",4,"AO2","","Explain why a plc is required to publish its accounts but a sole trader is not.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A plc sells shares to the public (1) so it must publish accounts to protect and inform shareholders (1)","A sole trader is a private individual with no public shareholders (1) so there is no requirement to publish accounts (1)"]))
add("A","A1 Ownership and liability","State",2,"AO1","","State one advantage of a cooperative form of ownership.","(2)","short",
    short_ms("Award 2.",["Members have democratic control (one member, one vote) and share in profits (1); members' interests are aligned with the business (1)"]))
add("A","A1 Ownership and liability","Explain",4,"AO2","","Explain what is meant by a 'not-for-profit' organisation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A not-for-profit organisation does not aim to make a profit for owners (1); any surplus is reinvested to further its social purpose (1)","Examples include charities and social enterprises (1) which aim to benefit society rather than maximise profit (1)"]))
add("A","A1 Sectors","Explain",4,"AO2","","Explain how the tertiary sector has grown in the UK economy.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Rising incomes and changing lifestyles have increased demand for services (1) e.g. leisure, retail, finance and healthcare (1)","Deindustrialisation has shifted employment from manufacturing to services (1) making the tertiary sector the largest part of the economy (1)"]))
add("A","A1 Scope","Explain",4,"AO2","","Explain how operating internationally can give a business economies of scale.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Selling in more countries increases total output (1) allowing fixed costs to be spread over more units (1)","Bulk buying of raw materials across the whole business (1) reduces average unit costs (1)"]))
add("A","A1 Size of business","Explain",4,"AO2","","Explain why the size of a business affects its organisational structure.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Larger businesses need more layers of management and specialist functions (1) leading to a hierarchical structure (1)","Small businesses have fewer staff (1) so tend to have flat, informal structures (1)"]))
add("A","A1 Reasons for success","Explain",4,"AO2","","Explain how meeting customer needs contributes to business success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Businesses that meet customer needs attract and retain customers (1) generating repeat sales and loyalty (1)","Understanding customers allows the business to develop products they value (1) sustaining demand and revenue (1)"]))
add("A","A1 Reasons for success","Explain",4,"AO2","","Explain how innovation contributes to business success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Innovation differentiates the business and creates USPs (1) attracting customers and justifying premium prices (1)","Innovation improves efficiency and reduces costs (1) boosting competitiveness and profit (1)"]))
add("A","A2 Stakeholders","Explain",4,"AO2","","Explain the difference between internal and external stakeholders.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Internal stakeholders are inside the business (1) e.g. owners, managers and employees (1)","External stakeholders are outside the business (1) e.g. suppliers, customers, lenders, government and the community (1)"]))
add("A","A2 Stakeholder influence","Explain",4,"AO2","","Explain how owners can influence the success of a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Owners set the aims and strategic direction (1) and make major investment decisions that shape the business (1)","Owners provide capital and appoint managers (1) directly influencing how the business is run and its chances of success (1)"]))
add("A","A2 Stakeholder influence","Analyse",4,"AO2","","Analyse why a business might have difficulty satisfying all its stakeholders at once.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Different stakeholders have conflicting interests (1) e.g. employees want higher pay while owners want higher profit (1)","Satisfying one group may harm another (1) so businesses must balance competing demands (1)"]))
add("A","A3 Business communications","Explain",4,"AO2","","Explain how poor communication can harm a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Poor communication causes errors and misunderstandings (1) leading to mistakes, delays and wasted resources (1)","It can demotivate staff and damage customer relationships (1) reducing productivity and sales (1)"]))
add("A","A3 Business communications","Identify",2,"AO1","","Identify two features of effective written communication.","(2)","short",
    short_ms("Award 1 mark each.",["Clear and concise (1)","Accurate and correct (1)","Well-structured (1)","Appropriate tone for the audience (1)"],"Award up to 2."))
add("A","A3 Business communications","Explain",4,"AO2","","Explain how businesses can use video conferencing to improve communication.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Video conferencing allows face-to-face meetings without travel (1) saving time and money (1)","It enables collaboration across different locations (1) improving communication between remote teams (1)"]))
add("A","A1/A2 Business features","Discuss",6,"AO3","GreenGrocer is a small family-run greengrocer with 3 staff, operating in one town. It competes with a large national supermarket chain.","Discuss how the contrasting features of these two businesses affect their ability to compete. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["GreenGrocer: sole trader/small business, local scope, micro size, unlimited liability","Supermarket: plc/large business, national scope, economies of scale, limited liability","Supermarket benefits from economies of scale, lower prices and wider product range","GreenGrocer competes on personal service, local knowledge, convenience and quality","Small size limits GreenGrocer's buying power and marketing budget","But local focus allows GreenGrocer to build customer loyalty and niche appeal","Conclusion: the supermarket has cost/scale advantages, but GreenGrocer can succeed by differentiating on service and locality"],
    levels3("Describes the two businesses in basic terms.","Compares features and links some to competitiveness.","Thoroughly contrasts features and evaluates how each competes; justified conclusion.")))

# ============ AIM B ============
add("B","B1 Organisational structure","Explain",4,"AO2","","Explain what is meant by the term 'delegation' in an organisation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Delegation is passing authority and responsibility for a task to a subordinate (1) while retaining overall accountability (1)","It empowers employees and frees managers' time (1) but requires trust and clear instructions (1)"]))
add("B","B1 Organisational structure","Explain",4,"AO2","","Explain what is meant by 'centralisation' and 'decentralisation'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Centralisation means decision-making is concentrated at the top of the organisation (1) giving senior managers control (1)","Decentralisation means decision-making is delegated to lower levels or branches (1) allowing faster local decisions (1)"]))
add("B","B1 Organisational structure","Explain",4,"AO2","","Explain one advantage and one disadvantage of decentralisation.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: decisions are made closer to customers (1) enabling faster, better-informed responses (1)","Disadvantage: loss of central control and consistency (1) may lead to conflicting decisions across the business (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain how the marketing and production functions need to coordinate.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Marketing must promote products that production can actually deliver (1) to avoid promising more than the business can supply (1)","Production needs marketing's demand forecasts (1) to plan output levels and avoid over- or under-production (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain how the HR and finance functions need to coordinate.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Finance must provide the budget for HR to recruit and pay staff (1) ensuring wage costs are affordable (1)","HR provides finance with staff numbers and payroll data (1) needed for budgeting and financial planning (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain why larger businesses have more specialist functional areas.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Larger businesses have more complex operations (1) requiring specialist expertise in each area (1)","Specialisation improves efficiency and quality (1) but can create coordination challenges between functions (1)"]))
add("B","B2 Aims and objectives","Explain",4,"AO2","","Explain what is meant by 'market leadership' as a business aim.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Market leadership means being the business with the largest market share in its industry (1) (1)","It brings benefits such as economies of scale, brand recognition and pricing power (1) but requires significant growth and investment (1)"]))
add("B","B2 Aims and objectives","Explain",4,"AO2","","Explain why a business might aim to break even in its first year.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Breaking even (covering all costs) is a realistic first-year target (1) before the business is established enough to make a profit (1)","Achieving break-even ensures survival (1) which is the priority for a new business (1)"]))
add("B","B2 Aims and objectives","Explain",4,"AO2","","Explain the difference between profit maximisation and profit satisficing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Profit maximisation means aiming for the highest possible profit (1) often the main aim of private businesses (1)","Profit satisficing means aiming for a satisfactory/acceptable level of profit (1) while pursuing other aims such as growth or work-life balance (1)"]))
add("B","B2 SMART objectives","Explain",4,"AO2","","Explain why objectives should be measurable.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Measurable objectives allow progress to be tracked against a target (1) so the business knows whether it is succeeding (1)","Without measurement, it is impossible to judge performance (1) or take corrective action when falling short (1)"]))
add("B","B2 SMART objectives","Explain",4,"AO2","","Explain why objectives should be relevant to the business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Relevant objectives align with the business's overall aims and strategy (1) so effort is directed at what matters (1)","Irrelevant objectives waste resources (1) and do not move the business towards its goals (1)"]))
add("B","B2 Aims and objectives","Analyse",4,"AO2","","Analyse how a business's objectives support the achievement of its aims.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Objectives break broad aims into specific, measurable steps (1) making progress towards the aim trackable (1)","Achieving a series of objectives cumulatively moves the business towards its overall aim (1) e.g. growth objectives support a growth aim (1)"]))
add("B","B1/B2 Organisation","Discuss",6,"AO3","A medium-sized charity with 80 staff currently has a flat structure but is struggling with unclear responsibilities and overworked managers.","Discuss whether the charity should introduce a more hierarchical structure. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["The flat structure causes unclear responsibilities and overworked managers (wide spans of control)","A hierarchical structure would clarify the chain of command and accountability","More layers would reduce each manager's span of control, easing workload","But hierarchy adds management costs and slows communication","For a charity, minimising overheads matters, but clear accountability is essential for effectiveness","Conclusion: a modest hierarchy (adding a middle management layer) balances clarity with cost, but the charity should avoid over-layering"],
    levels3("Describes the two structures in basic terms.","Compares them with partial application to the charity's problems.","Thoroughly evaluates the trade-off between clarity and cost; justified recommendation.")))

# ============ AIM C ============
add("C","C1 External environment","Explain",4,"AO2","","Explain how government policy can affect a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Government policy (e.g. on taxation, spending, regulation) changes business costs and demand (1) e.g. tax rises reduce profit and consumer spending (1)","Policies such as grants or subsidies can support businesses (1) e.g. funding for green investment (1)"]))
add("C","C1 External environment","Explain",4,"AO2","","Explain how employment legislation affects businesses.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Employment legislation (e.g. minimum wage, discrimination, health and safety laws) sets standards businesses must meet (1) increasing compliance costs (1)","It protects employees' rights (1) but failure to comply risks legal action and reputational damage (1)"]))
add("C","C1 External environment","Explain",4,"AO2","","Explain how data protection legislation (GDPR) affects businesses.","(4)","short",
    short_ms("Award 1+1. Max 4.",["GDPR requires businesses to collect, store and use customer data lawfully and securely (1) increasing compliance costs and admin (1)","It protects consumers' privacy (1) but breaches can result in large fines and reputational damage (1)"]))
add("C","C1 External environment","Explain",4,"AO2","","Explain how environmental legislation affects businesses.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Environmental legislation (e.g. emissions limits, waste rules) forces businesses to reduce their environmental impact (1) increasing costs (1)","Compliance can also create opportunities (1) e.g. demand for greener products and cost savings through efficiency (1)"]))
add("C","C1 External environment","Explain",4,"AO2","","Explain how the weather can affect businesses.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Weather directly affects some businesses (e.g. farming, tourism, construction) (1) by changing output or demand (1)","Unseasonal weather can reduce demand (e.g. ice cream in a cold summer) (1) or disrupt supply chains (1)"]))
add("C","C2 Internal environment","Explain",4,"AO2","","Explain the difference between corporate culture and ethics.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Corporate culture is the shared values and ways of working in an organisation (1) — 'the way things are done' (1)","Ethics are the moral principles that guide right and wrong behaviour (1) which may be reflected in, but are distinct from, the culture (1)"]))
add("C","C2 CSR","Analyse",4,"AO2","","Analyse why CSR can be costly for a business in the short term but beneficial in the long term.","(4)","short",
    short_ms("Award 1+1. Max 4.",["CSR activities (e.g. sustainable sourcing, fair wages) increase short-term costs (1) reducing profit now (1)","In the long term CSR builds reputation and customer loyalty (1) protecting revenue and reducing risk, so it can pay off (1)"]))
add("C","C3 Competitive environment","Explain",4,"AO2","","Explain how brand loyalty affects a business's competitive position.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Brand loyalty means customers keep buying from the business rather than switching (1) reducing the threat from competitors (1)","Loyal customers are less price-sensitive (1) giving the business pricing power and stable revenue (1)"]))
add("C","C3 Competitive environment","Explain",4,"AO2","","Explain how a business can use quality to gain a competitive advantage.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Superior quality differentiates the business (1) attracting customers who value reliability and performance (1)","High quality can justify premium prices and build reputation (1) reducing price competition (1)"]))
add("C","C4 Situational analysis","Explain",4,"AO2","","Explain what the 'bargaining power of buyers' means in Porter's Five Forces.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Bargaining power of buyers is the ability of customers to influence prices and terms (1) — stronger when there are few buyers or many suppliers (1)","Powerful buyers can demand lower prices or better terms (1) reducing the business's profitability (1)"]))
add("C","C4 Situational analysis","Explain",4,"AO2","","Explain what the 'threat of substitutes' means in Porter's Five Forces.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Substitutes are alternative products that meet the same need (1) e.g. trains as a substitute for flights (1)","If substitutes are cheap and readily available, they limit the prices a business can charge (1) reducing profitability (1)"]))
add("C","C4 Situational analysis","Explain",4,"AO2","","Explain how a business uses the results of a SWOT analysis.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The business builds on its strengths and addresses its weaknesses (1) to improve competitiveness (1)","It exploits opportunities and guards against threats (1) to plan its strategy and reduce risk (1)"]))
add("C","C1-C4 Environment","Evaluate",12,"AO3","SolarTech Ltd installs rooftop solar panels. It faces government cuts to solar subsidies, rising competition from cheaper imports, and growing consumer interest in renewable energy.","Evaluate how changes in SolarTech Ltd's business environment could affect its success. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["PESTLE: Political (subsidy cuts), Economic (cheaper imports), Social (growing interest in renewables), Technological (falling panel costs), Legal (regulations), Environmental (climate concerns)","Subsidy cuts reduce the financial incentive for customers to install panels, potentially reducing demand","Cheaper imports increase competition, putting pressure on prices and margins","Growing consumer interest in renewable energy is a significant opportunity","SWOT: Strengths (installation expertise), Weaknesses (price competition), Opportunities (green demand), Threats (subsidies, imports)","Responses: differentiate on quality/service, target commercial clients, reduce costs","Conclusion: a mixed environment — threats from subsidies and imports, but strong underlying demand; SolarTech should adapt its offering and cost base"],
    levels4("Identifies a few factors in isolation.","Applies PESTLE/SWOT with partial linkage to SolarTech.","Balanced evaluation of threats and opportunities.","Thorough situational analysis with justified strategic responses.")))

# ============ AIM D ============
add("D","D1 Market structures","Explain",4,"AO2","","Explain what is meant by 'homogeneous products' in perfect competition.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Homogeneous products are identical across all firms (1) so there is no product differentiation (1)","This means consumers see no difference between suppliers (1) so firms compete only on price (1)"]))
add("D","D1 Market structures","Explain",4,"AO2","","Explain why firms in imperfect competition have some control over price.","(4)","short",
    short_ms("Award 1+1. Max 4.",["In imperfect competition products are differentiated and there are fewer firms (1) so consumers have less choice (1)","This gives firms pricing power (1) as customers are willing to pay more for a preferred brand (1)"]))
add("D","D1 Market structures","Explain",4,"AO2","","Explain the concept of 'freedom of entry' and why it matters.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Freedom of entry means there are no significant barriers preventing new firms entering a market (1) (1)","It is a feature of perfect competition and matters because easy entry increases competition (1) keeping prices low (1)"]))
add("D","D2 Demand","Explain",4,"AO2","","Explain how consumer needs, tastes and aspirations influence demand.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Consumer tastes and preferences determine what products people want (1); shifts in tastes change demand (1)","Aspirations (wanting to improve lifestyle/status) drive demand for certain goods (1) e.g. branded or luxury items (1)"]))
add("D","D2 Demand","Explain",4,"AO2","","Explain the relationship between price and demand using the demand curve.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The demand curve slopes downwards (1) showing that as price falls, quantity demanded rises (1)","A movement along the curve is caused by a price change (1); a shift of the curve is caused by other factors such as income (1)"]))
add("D","D2 Supply","Explain",4,"AO2","","Explain how the availability of labour affects supply.","(4)","short",
    short_ms("Award 1+1. Max 4.",["If skilled labour is available, businesses can produce more (1) increasing supply (1)","Labour shortages restrict output and raise wages (1) reducing supply (1)"]))
add("D","D2 Supply","Explain",4,"AO2","","Explain how competition for raw materials affects supply.","(4)","short",
    short_ms("Award 1+1. Max 4.",["If many firms compete for the same raw materials, prices rise and availability falls (1) making it harder to produce (1)","This reduces supply (1) as firms face higher input costs and shortages (1)"]))
add("D","D2 Supply","Explain",4,"AO2","","Explain how government support can affect supply.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Government subsidies or grants reduce costs (1) making it more profitable to produce, so supply increases (1)","Taxes or restrictions increase costs (1) reducing the incentive to supply (1)"]))
add("D","D2 Elasticity","Explain",4,"AO2","","Explain the implications for revenue of price inelastic demand.","(4)","short",
    short_ms("Award 1+1. Max 4.",["With price inelastic demand, a price increase leads to a proportionally smaller fall in quantity demanded (1) so total revenue rises (1)","Businesses can therefore raise prices to increase revenue (1) when demand is inelastic (1)"]))
add("D","D2 Elasticity","Explain",4,"AO2","","Explain the implications for revenue of price elastic demand.","(4)","short",
    short_ms("Award 1+1. Max 4.",["With price elastic demand, a price increase leads to a proportionally larger fall in quantity demanded (1) so total revenue falls (1)","Businesses should avoid raising prices when demand is elastic (1) as it reduces revenue (1)"]))
add("D","D3 Pricing and output","Explain",4,"AO2","","Explain how a firm in perfect competition decides its output level.","(4)","short",
    short_ms("Award 1+1. Max 4.",["In perfect competition the firm is a price taker (1) so it sells at the market price (1)","It produces where marginal cost equals the market price (1) to maximise profit (1)"]))
add("D","D3 Competitive response","Explain",4,"AO2","","Explain how a business might use non-price competition to respond to rivals.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Non-price competition means competing on factors other than price (1) such as quality, service, branding or advertising (1)","This avoids damaging price wars (1) and differentiates the business in customers' minds (1)"]))
add("D","D3 Pricing and output","Analyse",4,"AO2","","Analyse how market structure affects the degree of competition a business faces.","(4)","short",
    short_ms("Award 1+1. Max 4.",["In perfect competition there are many firms and no differentiation (1) so competition is intense and firms are price takers (1)","In imperfect competition there are fewer firms and barriers to entry (1) so competition is less intense and firms have pricing power (1)"]))
add("D","D2 Elasticity","Calculate",4,"AO2","","A product's price rises by 20% and quantity demanded falls by 5%. Calculate the price elasticity of demand and state whether demand is elastic or inelastic. (4)","(4)","calculation",
    short_ms("Award 1 mark per step. Max 4.",["Formula: PED = % change in quantity demanded ÷ % change in price (1)","PED = 5% ÷ 20% = 0.25 (1)","PED of 0.25 is less than 1 (1)","Therefore demand is price inelastic (1)"]))
add("D","D1-D3 Markets","Evaluate",12,"AO3","BrewCo Ltd operates in the beer market, which is dominated by a few large breweries but also contains many small craft breweries. BrewCo is a mid-sized firm.","Evaluate the impact of the market structure on BrewCo Ltd's pricing and output decisions. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["The beer market has features of an oligopoly (a few large dominant firms) alongside many small craft brewers (monopolistic competition)","Large breweries benefit from economies of scale and brand loyalty, allowing competitive mass-market pricing","Craft brewers differentiate on quality/authenticity and charge premium prices","BrewCo, as a mid-sized firm, faces competition from both large brewers (price) and craft brewers (differentiation)","Demand is relatively elastic for standard beer (many substitutes) but more inelastic for premium/craft beer","Pricing: BrewCo cannot compete purely on price with large brewers; it may need to differentiate","Output: BrewCo must manage capacity to match demand without the scale advantages of large rivals","Conclusion: BrewCo should pursue differentiation and target profitable segments rather than compete head-on on price"],
    levels4("Describes the market in basic terms.","Links market structure to pricing/output with partial analysis.","Balanced evaluation of competitive pressures on BrewCo.","Thorough evaluation with justified pricing/output strategy.")))

# ============ AIM E ============
add("E","E1 Innovation","Explain",4,"AO2","","Explain the difference between innovation and invention.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Invention is creating something entirely new (1) e.g. a new technology or idea (1)","Innovation is successfully commercialising and applying new ideas (1) to create value for customers and the business (1)"]))
add("E","E1 Enterprise thinking","Explain",4,"AO2","","Explain how creative thinking supports enterprise.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Creative thinking generates new and original ideas (1) which can become new products or business opportunities (1)","It helps entrepreneurs see possibilities that others miss (1) driving innovation and competitive advantage (1)"]))
add("E","E1 Enterprise thinking","Explain",4,"AO2","","Explain the role of intuition in entrepreneurial decision-making.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Intuition is using instinct and experience to make decisions quickly (1) without full information (1)","Entrepreneurs often rely on intuition when data is limited or time is short (1) though it can be risky if not combined with analysis (1)"]))
add("E","E2 Benefits of innovation","Explain",4,"AO2","","Explain how innovation can improve a business's reputation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Being seen as innovative positions the business as forward-thinking and market-leading (1) enhancing its brand image (1)","A reputation for innovation attracts customers, media attention and talented staff (1) strengthening the business (1)"]))
add("E","E2 Benefits of innovation","Explain",4,"AO2","","Explain how innovation can lead to 'smarter working' in a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Innovation in processes and technology enables staff to work more efficiently (1) e.g. automation reducing manual tasks (1)","Smarter working reduces costs and frees up time (1) improving productivity and profitability (1)"]))
add("E","E2 Risks of innovation","Explain",4,"AO2","","Explain why employees might resist innovation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Employees may fear job losses or changes to their role (1) if new technology replaces their work (1)","They may be comfortable with existing methods and lack confidence in new ones (1) so resist the disruption of change (1)"]))
add("E","E2 Managing risk","Explain",4,"AO2","","Explain how involving employees in the innovation process reduces resistance.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Involving employees gives them ownership of the change (1) so they feel valued and are more willing to support it (1)","Their input improves the innovation (1) and reduces fear of the unknown through communication and participation (1)"]))
add("E","E2 Managing risk","Explain",4,"AO2","","Explain how a business can manage the financial risk of innovation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Carry out market research and feasibility studies before investing (1) to confirm likely demand (1)","Use staged/phased investment (1) so money is only committed as the innovation proves viable (1)"]))
add("E","E1/E2 Innovation and enterprise","Discuss",6,"AO3","A long-established bakery is considering introducing online ordering and delivery to reach new customers. Some staff are worried the change will be disruptive.","Discuss the benefits and risks of this innovation for the bakery. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Benefits: online ordering and delivery opens a new market and increases sales; it modernises the business and adds convenience for customers","It creates a USP over competitors without online ordering","Risks: cost of setting up the website and delivery logistics; uncertain return on investment","Staff resistance and disruption as new processes are introduced","The change requires new skills and may strain the existing operation","Risk mitigation: phased roll-out, staff training and involvement","Conclusion: the innovation offers clear benefits but must be managed carefully, with staff involvement and careful cost control"],
    levels3("Describes the innovation in basic terms.","Identifies benefits and risks with partial application to the bakery.","Balanced evaluation with risk mitigation and a justified conclusion.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U1 aim counts:", {k: len(v) for k, v in aims.items()})
print("U1 total:", sum(len(v) for v in aims.values()))
