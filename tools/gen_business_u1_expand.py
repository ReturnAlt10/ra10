# -*- coding: utf-8 -*-
"""Expand BTEC Business Unit 1 (Exploring Business) question bank.
Appends new questions to existing aim_*.json files, covering every spec topic.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-1\data"

aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}

# Each new item: (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms)
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A — Features of businesses ============
add("A","A1 Ownership and liability","Define",2,"AO1","","Define the term 'limited liability'.","(2)","short",
    short_ms("Award 2.",["Where the owners' (shareholders') financial responsibility for business debts is limited to the amount they have invested in the company (2)"]))
add("A","A1 Ownership and liability","Define",2,"AO1","","Define the term 'unlimited liability'.","(2)","short",
    short_ms("Award 2.",["Where the owners are personally responsible for all the debts of the business, even if this means using their personal assets (2)"]))
add("A","A1 Ownership and liability","Identify",2,"AO1","","Identify two features of a public limited company (plc).","(2)","short",
    short_ms("Award 1 mark each.",["Shares can be sold to the general public (1)","Shares are traded on the stock exchange (1)","Must publish its accounts (1)","Limited liability (1)","Minimum share capital of £50,000 (1)"],"Award up to 2."))
add("A","A1 Ownership and liability","Identify",2,"AO1","","Identify two features of a private limited company (Ltd).","(2)","short",
    short_ms("Award 1 mark each.",["Shares are sold privately, not on the stock exchange (1)","Limited liability (1)","Owned by shareholders (1)","Separate legal identity from owners (1)"],"Award up to 2."))
add("A","A1 Ownership and liability","Explain",4,"AO2","","Explain one advantage and one disadvantage of a business operating as a sole trader.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: the owner keeps all profits and has full control over decisions (1) making it simple and quick to set up (1)","Disadvantage: unlimited liability (1) means the owner risks their personal assets to pay business debts (1)","Disadvantage: limited access to finance and difficulty raising capital (1)"],"Accept any valid advantage/disadvantage pair."))
add("A","A1 Ownership and liability","Explain",4,"AO2","","Explain one advantage and one disadvantage of operating as a public limited company (plc).","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: can raise large amounts of capital by selling shares to the public (1) funding growth and expansion (1)","Disadvantage: loss of control as shareholders can influence decisions (1) and accounts must be published, reducing privacy (1)","Disadvantage: risk of takeover if shares are bought by a rival (1)"]))
add("A","A1 Ownership and liability","State",2,"AO1","","State the purpose of a business.","(2)","short",
    short_ms("Award 2.",["To provide goods and/or services to meet the needs and wants of customers (1) typically in exchange for money (profit) (1)"]))
add("A","A1 Sectors","Explain",4,"AO2","","Explain the difference between the primary and secondary sectors, giving an example of each.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Primary sector extracts/uses raw materials directly from the earth or sea (1), e.g. farming, fishing, mining (1)","Secondary sector manufactures/constructs, transforming raw materials into finished goods (1), e.g. car manufacturing, construction (1)"]))
add("A","A1 Sectors","Explain",4,"AO2","","Explain the difference between the tertiary and quaternary sectors.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Tertiary sector provides services to customers and other businesses (1), e.g. retail, banking, transport (1)","Quaternary sector provides knowledge-based, information and ICT services (1), e.g. IT, research and development, consultancy (1)"]))
add("A","A1 Scope","State",2,"AO1","","State what is meant by the scope of a business.","(2)","short",
    short_ms("Award 2.",["The extent/range of a business's activities — whether it operates locally, nationally or internationally (2)"]))
add("A","A1 Size of business","Identify",2,"AO1","","Identify the four ways a business's size is commonly defined under EU categories.","(2)","short",
    short_ms("Award 1 mark each, up to 2.",["Micro (up to 9 employees) (1)","Small (10-49 employees) (1)","Medium (50-249 employees) (1)","Large (250+ employees) (1)"]))
add("A","A1 Size of business","Explain",4,"AO2","","Explain how the size of a business can affect its ability to raise finance.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Large businesses have more assets and a proven track record (1) so lenders view them as lower risk and offer better terms (1)","Small businesses are seen as riskier and have fewer assets to offer as security (1) so finance is harder to obtain and more expensive (1)"]))
add("A","A1 Reasons for success","Identify",2,"AO1","","Identify two common features of successful businesses.","(2)","short",
    short_ms("Award 1 mark each.",["Clear vision and leadership (1)","Innovation (1)","Customer focus (1)","Effective financial management (1)","Skilled and motivated staff (1)","Good reputation/brand (1)"],"Award up to 2."))
add("A","A1 Reasons for success","Explain",4,"AO2","","Explain how having a unique selling point (USP) can contribute to a business's success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A USP differentiates the business from competitors (1) giving customers a reason to choose it over rivals (1)","This can support premium pricing and customer loyalty (1) increasing revenue and market share (1)"]))
add("A","A2 Stakeholders","Define",2,"AO1","","Define the term 'stakeholder'.","(2)","short",
    short_ms("Award 2.",["Any individual, group or organisation with an interest in, or influence over, the activities and success of a business (2)"]))
add("A","A2 Stakeholders","Identify",2,"AO1","","Identify two ways a business's owners can influence its decisions.","(2)","short",
    short_ms("Award 1 mark each.",["Setting the overall direction/aims (1)","Making major investment decisions (1)","Appointing senior managers (1)","Approving budgets (1)"],"Award up to 2."))
add("A","A2 Stakeholder influence","Explain",4,"AO2","","Explain how suppliers can influence a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Suppliers provide the raw materials/goods a business needs (1); delays or poor quality from suppliers disrupt production and sales (1)","Suppliers set prices and credit terms (1) which directly affect a business's costs and cash flow (1)"]))
add("A","A2 Stakeholder influence","Explain",4,"AO2","","Explain how the government can influence a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The government sets laws and regulations (e.g. employment, health and safety) (1) which businesses must comply with, affecting their costs and operations (1)","The government influences the economy through taxation, interest rates and spending (1) which affect demand and business confidence (1)"]))
add("A","A2 Stakeholder influence","Explain",4,"AO2","","Explain how pressure groups can influence a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Pressure groups campaign to change business behaviour (1) e.g. on environmental or ethical issues (1)","Negative publicity from pressure groups can damage a business's reputation (1) and reduce sales, forcing it to change its practices (1)"]))
add("A","A3 Business communications","Identify",2,"AO1","","Identify two methods of written communication a business might use.","(2)","short",
    short_ms("Award 1 mark each.",["Written report (1)","Business letter (1)","Email (1)","Memorandum (1)","Newsletter (1)","Notice board (1)","Financial statements (1)"],"Award up to 2."))
add("A","A3 Business communications","Explain",4,"AO2","","Explain one advantage and one disadvantage of using email for business communication.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: email is fast, cheap and can be sent to many recipients at once (1), with a written record of communication (1)","Disadvantage: email can be misinterpreted without tone/body language (1) and important messages may be overlooked in a busy inbox (1)"]))
add("A","A3 Business communications","Explain",4,"AO2","","Explain why businesses use social media and virtual communities to communicate.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Social media allows businesses to reach large audiences quickly and cheaply (1) and engage directly with customers (1)","It enables two-way communication and feedback (1) building brand awareness and customer loyalty (1)"]))
add("A","A1/A2 Features and stakeholders","Evaluate",12,"AO3","ZestyJuice Ltd is a private limited company producing organic juices sold nationally through supermarkets. It is considering becoming a plc to fund international expansion.","Evaluate the impact on ZestyJuice Ltd of converting from a private limited company to a public limited company. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Conversion from Ltd to plc allows ZestyJuice to raise capital by selling shares to the public, funding international expansion","Shareholders gain limited liability either way, but a plc can access far more equity finance","Drawbacks: loss of control, risk of takeover, requirement to publish accounts, higher regulatory/administrative costs","Original owners may lose their majority stake and see decision-making diluted","A plc faces pressure from shareholders for short-term profit, potentially conflicting with long-term growth aims","Stakeholders affected: existing owners (dilution), employees (uncertainty), customers (continuity), lenders (lower risk)","Alternative: retain Ltd status and raise debt or private equity instead","Conclusion: plc status suits large-scale funding needs but ZestyJuice must weigh the loss of control and increased scrutiny against the capital gained"],
    levels4("Describes Ltd vs plc in basic terms.","Identifies some benefits/drawbacks of conversion with limited application to ZestyJuice.","Balanced evaluation linking conversion to funding needs and stakeholder impact.","Thorough evaluation weighing capital gained against loss of control; justified recommendation.")))

# ============ AIM B — How businesses are organised ============
add("B","B1 Organisational structure","Define",2,"AO1","","Define the term 'span of control'.","(2)","short",
    short_ms("Award 2.",["The number of employees/subordinates who report directly to a manager (2)"]))
add("B","B1 Organisational structure","Define",2,"AO1","","Define the term 'chain of command'.","(2)","short",
    short_ms("Award 2.",["The line of authority and communication running from the top to the bottom of an organisation, showing who reports to whom (2)"]))
add("B","B1 Organisational structure","Explain",4,"AO2","","Explain one advantage and one disadvantage of a flat organisational structure.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: fewer layers allow faster communication and decision-making (1) and reduce management costs (1)","Disadvantage: wide spans of control can overload managers (1) and provide less supervision and fewer promotion opportunities (1)"]))
add("B","B1 Organisational structure","Explain",4,"AO2","","Explain what is meant by a matrix structure and when it might be used.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A matrix structure groups employees by both function and project (1) so staff report to more than one manager (1)","It is used for project-based work where cross-functional teams are needed (1) such as product development or consultancy (1)"]))
add("B","B1 Organisational structure","Explain",4,"AO2","","Explain what is meant by a holacratic structure.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A holacratic structure removes traditional management hierarchy (1) distributing decision-making authority across self-managing teams/circles (1)","It gives employees autonomy and responsibility (1) and suits innovative, fast-moving organisations (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain the role of the finance function in a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Finance manages the business's money, budgets and accounts (1) ensuring bills are paid and cash flow is controlled (1)","It prepares financial statements, monitors costs and provides information for decision-making (1) supporting profitability and planning (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain the role of the production/operations function in a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Production/operations converts inputs into finished goods or services (1) managing the production process, quality and stock (1)","It aims to produce efficiently at the right cost and quality (1) to meet customer demand on time (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain the role of the sales function in a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Sales generates revenue by selling the business's products or services (1) identifying customers and closing deals (1)","It builds relationships with customers (1) and provides feedback on customer needs to other functions (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain the role of the customer service function.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Customer service handles enquiries, complaints and after-sales support (1) ensuring customers are satisfied (1)","Good customer service builds loyalty and repeat business (1) protecting the business's reputation (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain the role of research and development (R&D) in a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["R&D develops new products and improves existing ones (1) helping the business innovate and stay competitive (1)","It tests and refines ideas before launch (1) reducing the risk of product failure (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain why different functional areas of a business need to work together.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Functions are interdependent — e.g. marketing must know what production can deliver (1) and finance must fund HR's recruitment (1)","Poor coordination between functions causes delays, duplication and conflicting decisions (1) so cooperation improves efficiency and performance (1)"]))
add("B","B2 Aims and objectives","Define",2,"AO1","","Define the term 'aim' in a business context.","(2)","short",
    short_ms("Award 2.",["A long-term goal or purpose that a business works towards, setting its overall direction (2)"]))
add("B","B2 Aims and objectives","Define",2,"AO1","","Define the term 'objective' in a business context.","(2)","short",
    short_ms("Award 2.",["A specific, measurable target that a business sets to help achieve its aims (2)"]))
add("B","B2 Aims and objectives","State",2,"AO1","","State two aims a public sector organisation might have.","(2)","short",
    short_ms("Award 1 mark each.",["Providing a quality service to the public (1)","Value for money (1)","Meeting social/community needs (1)","Operating within budget (1)","Providing universal access to services (1)"],"Award up to 2."))
add("B","B2 Aims and objectives","Explain",4,"AO2","","Explain why a business's aims and objectives may change over time.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Changes in the external environment (e.g. recession, new competitors) (1) may force a business to revise its aims to survive (1)","As a business grows, its aims evolve from survival to growth and market leadership (1) requiring new objectives (1)"]))
add("B","B2 SMART objectives","Explain",4,"AO2","","Explain, using the SMART criteria, whether the objective 'to increase profit' is a good objective.","(4)","short",
    short_ms("Award 1+1. Max 4.",["'To increase profit' is not SMART because it is not specific, measurable or time-constrained (1) — it does not say by how much or by when (1)","A better objective would be 'to increase profit by 10% within 12 months' (1) which is specific, measurable and time-constrained (1)"]))
add("B","B2 SMART objectives","Analyse",4,"AO2","","Analyse why objectives should be achievable and relevant.","(4)","short",
    short_ms("Award 1+1. Max 4.",["If objectives are not achievable they demotivate staff and are meaningless (1); unrealistic targets are ignored (1)","Relevant objectives align with the business's overall aims (1) so effort is focused on what matters for success (1)"]))
add("B","B1/B2 Organisation and aims","Evaluate",12,"AO3","ClearCo Ltd is a 300-employee manufacturer currently organised hierarchically, with aims to grow into new markets and improve innovation. It is reviewing its structure and objectives.","Evaluate how ClearCo Ltd could reorganise its structure and set objectives to support its growth and innovation aims. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["ClearCo's hierarchical structure is stable but may slow decision-making, hindering innovation","Options: flatten the hierarchy to speed communication, or adopt a matrix structure for cross-functional innovation projects","Functional areas (R&D, marketing, production) must coordinate to support growth into new markets","Aims (growth, innovation) should be translated into SMART objectives, e.g. 'launch 2 new products within 18 months'","Flatter/matrix structures empower staff and support creativity but require clear accountability at 300 employees","Balance: a hybrid structure retaining some hierarchy for control while adding project teams for innovation","Conclusion: a matrix or flatter structure with SMART, innovation-focused objectives best supports ClearCo's aims"],
    levels4("Describes structure and objectives in basic terms.","Links structure/objectives to ClearCo's aims partially.","Balanced evaluation of structural options and objective-setting.","Thorough evaluation recommending a specific structure and SMART objectives with justification.")))

# ============ AIM C — The environment ============
add("C","C1 PESTLE","Give",2,"AO1","","Give two examples of political factors that can affect a business.","(2)","short",
    short_ms("Award 1 mark each.",["Government policy (1)","Political stability (1)","Regulation/deregulation (1)","Corruption (1)","Membership of trade blocs (1)"],"Award up to 2."))
add("C","C1 PESTLE","Give",2,"AO1","","Give two examples of legal factors that can affect a business.","(2)","short",
    short_ms("Award 1 mark each.",["Employment law (1)","Health and safety legislation (1)","Consumer protection law (1)","Data protection law (GDPR) (1)","Environmental law (1)"],"Award up to 2."))
add("C","C1 PESTLE","Give",2,"AO1","","Give two examples of environmental factors that can affect a business.","(2)","short",
    short_ms("Award 1 mark each.",["Climate change (1)","Weather conditions (1)","Environmental legislation (1)","Sustainability/consumer attitudes to the environment (1)","Carbon emission targets (1)"],"Award up to 2."))
add("C","C1 External environment","Explain",4,"AO2","","Explain how a change in interest rates can affect a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Higher interest rates increase the cost of borrowing (1) and raise repayments on existing loans, reducing profit (1)","Higher rates reduce consumer spending as customers' disposable income falls (1) lowering demand for the business's products (1)"]))
add("C","C1 External environment","Explain",4,"AO2","","Explain how a rise in taxation can affect a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Higher business taxes (e.g. corporation tax) reduce after-tax profit (1) leaving less money to reinvest (1)","Higher consumer taxes reduce disposable income and demand (1) so sales may fall (1)"]))
add("C","C1 External environment","Explain",4,"AO2","","Explain how changes in demographics (an ageing population) can affect a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An ageing population changes the pattern of demand (1) e.g. more demand for healthcare, retirement and leisure products for older people (1)","It also affects the labour supply (1) as fewer young workers enter the workforce, potentially raising wages (1)"]))
add("C","C2 Internal environment","Define",2,"AO1","","Define the term 'corporate culture'.","(2)","short",
    short_ms("Award 2.",["The shared values, beliefs, attitudes and accepted ways of working within an organisation (2)"]))
add("C","C2 CSR","Define",2,"AO1","","Define the term 'corporate social responsibility' (CSR).","(2)","short",
    short_ms("Award 2.",["A business's voluntary commitment to behave ethically and consider its impact on society and the environment, going beyond legal requirements (2)"]))
add("C","C2 CSR","Explain",4,"AO2","","Explain two benefits to a business of acting in a socially responsible way.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["CSR improves the business's reputation and brand image (1) attracting customers who value ethical behaviour (1)","It can attract and retain talented employees (1) who want to work for an ethical employer (1)","It reduces the risk of negative publicity and legal action (1) protecting long-term profitability (1)"]))
add("C","C2 Ethics","Explain",4,"AO2","","Explain the difference between acting legally and acting ethically in business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Acting legally means complying with the law (1); acting ethically means doing what is morally right, which may go beyond the law (1)","A business can act legally but unethically (1) e.g. paying minimum wage (legal) but not a fair living wage (ethical) (1)"]))
add("C","C3 Competitive environment","Define",2,"AO1","","Define the term 'competitive advantage'.","(2)","short",
    short_ms("Award 2.",["A feature or capability that enables a business to outperform its rivals, e.g. lower costs, differentiation or a strong brand (2)"]))
add("C","C3 Competitive environment","Explain",4,"AO2","","Explain how a business could use cost leadership to gain a competitive advantage.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Cost leadership means being the lowest-cost producer in the market (1) achieved through economies of scale, efficiency and tight cost control (1)","Lower costs allow the business to charge lower prices (1) undercutting competitors and gaining market share (1)"]))
add("C","C3 Competitive environment","Explain",4,"AO2","","Explain how competition can benefit consumers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Competition forces businesses to offer lower prices (1) so consumers get better value for money (1)","It also drives businesses to improve quality and innovate (1) giving consumers more choice and better products (1)"]))
add("C","C4 Situational analysis","Explain",4,"AO2","","Explain the purpose of carrying out a PESTLE analysis.","(4)","short",
    short_ms("Award 1+1. Max 4.",["PESTLE helps a business understand its external environment (1) by identifying political, economic, social, technological, legal and environmental factors (1)","This informs strategic planning (1) helping the business anticipate and respond to changes (1)"]))
add("C","C4 Situational analysis","Explain",4,"AO2","","Explain the difference between the internal and external parts of a SWOT analysis.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Strengths and Weaknesses are internal — factors within the business's control (1) such as its resources, skills and processes (1)","Opportunities and Threats are external — factors outside the business (1) such as market trends and competitor actions (1)"]))
add("C","C4 Situational analysis","Explain",4,"AO2","","Explain what Porter's Five Forces model is used for.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Porter's Five Forces analyses the competitive environment (1) through five forces: rivalry, threat of new entrants, threat of substitutes, bargaining power of buyers and of suppliers (1)","It helps a business assess the attractiveness of a market (1) and plan competitive strategy (1)"]))
add("C","C1-C4 Environment","Evaluate",12,"AO3","UrbanEats is a chain of city-centre restaurants facing rising energy costs, new health and safety regulations and increasing competition from delivery-only 'ghost kitchens'.","Evaluate how changes in UrbanEats' business environment could affect its success, using situational analysis techniques. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["PESTLE: Economic (rising energy costs), Legal (health & safety regulation), Technological (delivery apps), Social (eating habits), Competitive (ghost kitchens)","Rising energy costs increase operating costs and squeeze margins","New health & safety regulations add compliance costs but may improve customer confidence","Ghost kitchens increase competition, especially for delivery orders","SWOT: Strengths (prime locations), Weaknesses (high fixed costs), Opportunities (delivery partnerships), Threats (ghost kitchens, costs)","Responses: adopt energy efficiency, embrace delivery, differentiate on dine-in experience","Conclusion: the environment presents significant threats but also opportunities; UrbanEats should adapt its cost base and delivery strategy"],
    levels4("Identifies a few environmental factors in isolation.","Applies PESTLE/SWOT with some linkage to UrbanEats.","Balanced analysis linking multiple factors to the business with evaluation.","Thorough situational analysis evaluating combined effects and recommending responses.")))

# ============ AIM D — Business markets ============
add("D","D1 Market structures","Define",2,"AO1","","Define the term 'monopoly'.","(2)","short",
    short_ms("Award 2.",["A market structure where a single firm dominates the market and is the sole (or dominant) supplier of a product, with high barriers to entry (2)"]))
add("D","D1 Market structures","Define",2,"AO1","","Define the term 'oligopoly'.","(2)","short",
    short_ms("Award 2.",["A market structure where a small number of large firms dominate the market, with significant barriers to entry (2)"]))
add("D","D1 Market structures","Identify",2,"AO1","","Identify two features of a monopoly market.","(2)","short",
    short_ms("Award 1 mark each.",["A single dominant firm (1)","High barriers to entry (1)","Price maker (1)","Differentiated/unique product (1)"],"Award up to 2."))
add("D","D1 Market structures","Explain",4,"AO2","","Explain why firms in perfect competition are described as 'price takers'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["In perfect competition there are many firms selling identical products (1) so no single firm can influence the market price (1)","Each firm must accept the prevailing market price (1) because if it charges more, customers buy from rivals (1)"]))
add("D","D2 Demand","Define",2,"AO1","","Define the term 'demand'.","(2)","short",
    short_ms("Award 2.",["The quantity of a product that consumers are willing and able to buy at a given price (2)"]))
add("D","D2 Supply","Define",2,"AO1","","Define the term 'supply'.","(2)","short",
    short_ms("Award 2.",["The quantity of a product that producers are willing and able to offer for sale at a given price (2)"]))
add("D","D2 Demand","Explain",4,"AO2","","Explain how consumer income affects demand.","(4)","short",
    short_ms("Award 1+1. Max 4.",["For normal goods, higher income increases demand (1) as consumers can afford to buy more (1)","For inferior goods, higher income may reduce demand (1) as consumers switch to higher-quality alternatives (1)"]))
add("D","D2 Demand","Explain",4,"AO2","","Explain how the availability of substitutes affects demand for a product.","(4)","short",
    short_ms("Award 1+1. Max 4.",["If there are many close substitutes, demand is more price elastic (1) because consumers can easily switch to alternatives (1)","Fewer substitutes make demand more inelastic (1) so consumers continue buying even if the price rises (1)"]))
add("D","D2 Supply","Explain",4,"AO2","","Explain how the availability of raw materials affects supply.","(4)","short",
    short_ms("Award 1+1. Max 4.",["If raw materials are plentiful and cheap, businesses can increase supply (1) as production is easier and cheaper (1)","If raw materials are scarce or expensive, supply falls (1) because production becomes harder and more costly (1)"]))
add("D","D2 Elasticity","Explain",4,"AO2","","Explain how price elasticity of demand affects a business's pricing decisions.","(4)","short",
    short_ms("Award 1+1. Max 4.",["If demand is price elastic, raising prices significantly reduces revenue (1) so the business should be cautious about price increases (1)","If demand is price inelastic, the business can raise prices without losing many sales (1) increasing revenue (1)"]))
add("D","D2 Elasticity","Explain",4,"AO2","","Explain the difference between price elastic and price inelastic demand using examples.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Elastic demand: quantity demanded changes more than proportionally to price (1); e.g. luxury goods, items with many substitutes (1)","Inelastic demand: quantity demanded changes less than proportionally to price (1); e.g. necessities, addictive products (1)"]))
add("D","D3 Pricing and output","Explain",4,"AO2","","Explain how a business in imperfect competition might set its price.","(4)","short",
    short_ms("Award 1+1. Max 4.",["In imperfect competition firms have some pricing power (1) because products are differentiated and there are fewer rivals (1)","The firm sets price above marginal cost to maximise profit (1) considering competitor prices and demand elasticity (1)"]))
add("D","D3 Competitive response","Explain",4,"AO2","","Explain two strategies a business could use to respond to increased competition.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Differentiate its product or service (1) so customers see it as unique and are less price-sensitive (1)","Reduce costs to allow lower prices (1) gaining a cost/price advantage over rivals (1)","Improve marketing and brand loyalty (1) to retain existing customers (1)"]))
add("D","D1-D3 Markets","Evaluate",12,"AO3","FreshBakery operates in a local market with many competing bakeries selling similar bread. It is considering investing in specialist artisan products to differentiate itself.","Evaluate whether FreshBakery should differentiate by moving into artisan products. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["FreshBakery currently competes in near-perfect competition — many small firms, similar products, price-taking","In such a market, margins are thin and competition is intense","Differentiation into artisan products moves FreshBakery towards a niche/monopolistic market, reducing direct price competition","Artisan products command premium prices, improving margins","But artisan products have a smaller market and require new skills and investment","Differentiation also affects demand elasticity — artisan buyers are less price-sensitive","Risk: abandoning the core bread market could lose existing customers","Conclusion: differentiation is advisable to escape intense price competition, but FreshBakery should retain its core range to spread risk"],
    levels4("Describes the market in basic terms.","Links market structure to differentiation with partial analysis.","Balanced evaluation of differentiation vs the current market position.","Thorough evaluation linking market structure, elasticity and risk; justified recommendation.")))

# ============ AIM E — Innovation and enterprise ============
add("E","E1 Innovation","Define",2,"AO1","","Define the term 'innovation'.","(2)","short",
    short_ms("Award 2.",["The successful development and exploitation of new ideas — new products, services, processes or ways of working that add value (2)"]))
add("E","E1 Enterprise","Define",2,"AO1","","Define the term 'enterprise'.","(2)","short",
    short_ms("Award 2.",["The ability to identify opportunities and take initiative/risk to develop business activities, using creative and entrepreneurial thinking (2)"]))
add("E","E1 Enterprise thinking","Explain",4,"AO2","","Explain the difference between creative thinking and lateral thinking.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Creative thinking generates original, imaginative ideas (1) e.g. through brainstorming or blue sky thinking (1)","Lateral thinking approaches problems from new, unusual angles (1) looking for indirect, non-obvious solutions (1)"]))
add("E","E1 Enterprise thinking","Explain",4,"AO2","","Explain what is meant by 'blue sky' thinking and how it helps enterprise.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Blue sky thinking approaches ideas without any restrictions or limitations (1) encouraging truly original, imaginative ideas (1)","It helps enterprise by generating innovative solutions (1) that conventional thinking might miss (1)"]))
add("E","E1 Enterprise thinking","Explain",4,"AO2","","Explain how intuition and chance (serendipity) can play a role in enterprise.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Intuition is making decisions based on instinct/experience rather than analysis (1); entrepreneurs often rely on gut feel when data is limited (1)","Serendipity is discovering opportunities by chance (1); alert entrepreneurs can turn unexpected findings into new products (1)"]))
add("E","E2 Benefits of innovation","Explain",4,"AO2","","Explain two benefits of innovation to a business.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Innovation creates unique selling points (1) which differentiate the business and attract customers (1)","Innovation can open up new and niche markets (1) driving growth and diversification (1)","Process innovation improves efficiency and reduces costs (1) boosting profitability (1)"]))
add("E","E2 Risks of innovation","Explain",4,"AO2","","Explain two risks a business faces when innovating.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["The innovation may fail to achieve a return on investment (1) if customers do not buy the new product (1)","Resistance to change from employees (1) can delay or undermine the innovation (1)","Insufficient leadership support or resources (1) can cause the innovation to fail (1)"]))
add("E","E2 Managing risk","Explain",4,"AO2","","Explain two ways a business can reduce the risks of innovation.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Carry out market research before investing (1) to confirm there is demand for the new product (1)","Pilot/test the innovation on a small scale first (1) to identify problems before full launch (1)","Involve employees and communicate benefits (1) to reduce resistance to change (1)"]))
add("E","E1 Innovation and success","Explain",4,"AO2","","Explain how innovation can improve a business's reputation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Innovative products or practices position the business as forward-thinking and market-leading (1) enhancing its image (1)","A reputation for innovation attracts customers and media attention (1) and can strengthen the brand (1)"]))
add("E","E1/E2 Innovation and enterprise","Evaluate",12,"AO3","SparkTech Ltd, a small electronics firm, has a limited budget and is deciding whether to invest in developing a new smart-home device. Employees are skilled but risk-averse, and the market is fast-moving.","Evaluate the role of innovation and enterprise in SparkTech Ltd's decision to develop a new smart-home device. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Benefits: a new smart-home device could open a growing market and create a USP, driving growth","Risks: high development cost with uncertain return; limited budget increases risk; fast-moving market may render the product obsolete","Enterprise: the decision reflects entrepreneurial opportunity-seeking, but the risk-averse culture may hinder it","Risk mitigation: market research, phased development, employee involvement and strong leadership","Innovation is essential for SparkTech to stay competitive in a fast-moving market","But the limited budget means it must prioritise and possibly seek external finance","Conclusion: innovation is vital, but SparkTech must manage risk through research, staged investment and cultural change"],
    levels4("Describes innovation/enterprise generically.","Identifies benefits and risks with limited application to SparkTech.","Balanced evaluation linking innovation to SparkTech's market and budget.","Thorough evaluation with justified recommendation and risk management.")))

# Append to aims with sequential ids
for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U1 aim counts:", {k: len(v) for k, v in aims.items()})
print("U1 total:", sum(len(v) for v in aims.values()))
