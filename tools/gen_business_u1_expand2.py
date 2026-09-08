# -*- coding: utf-8 -*-
"""BTEC Business Unit 1 expansion — batch 2 (to reach 300+)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-1\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A — more coverage ============
add("A","A1 Ownership and liability","Compare",4,"AO2","","Compare the ownership of a sole trader with that of a private limited company.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["A sole trader is owned and run by one person who has unlimited liability (1); an Ltd is owned by shareholders with limited liability (1)","A sole trader has no legal separation from the business (1); an Ltd is a separate legal entity that can own assets and enter contracts (1)"]))
add("A","A1 Ownership and liability","Compare",4,"AO2","","Compare a partnership with a private limited company in terms of liability and control.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Partners have unlimited liability and share control between themselves (1); an Ltd has limited liability and control is held by shareholders/directors (1)","A partnership is simpler and cheaper to set up (1); an Ltd has more formalities but easier access to finance (1)"]))
add("A","A1 Ownership and liability","Identify",2,"AO1","","Identify two features of a franchise as a form of business.","(2)","short",
    short_ms("Award 1 mark each.",["The franchisee pays a fee/royalty to use the franchisor's brand and business model (1)","The franchisor provides training, support and marketing (1)","The franchisee runs the business under an established name (1)"],"Award up to 2."))
add("A","A1 Ownership and liability","Explain",4,"AO2","","Explain one advantage and one disadvantage of operating as a franchise.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: the franchisee benefits from an established brand and proven business model (1) reducing the risk of failure (1)","Disadvantage: the franchisee pays ongoing fees/royalties and has limited control (1) having to follow the franchisor's rules (1)"]))
add("A","A1 Ownership and liability","Identify",2,"AO1","","Identify two features of a cooperative.","(2)","short",
    short_ms("Award 1 mark each.",["Owned and controlled by its members (1)","Each member typically has one vote regardless of investment (1)","Profits are shared among members (1)","Run for the benefit of members (1)"],"Award up to 2."))
add("A","A1 Ownership and liability","Explain",4,"AO2","","Explain why an entrepreneur might choose to register as a private limited company rather than operate as a sole trader.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An Ltd provides limited liability (1) protecting the owner's personal assets if the business fails (1)","An Ltd can raise finance more easily by selling shares (1) and is often seen as more credible by customers and lenders (1)"]))
add("A","A1 Sectors","Identify",2,"AO1","","Identify which sector each of the following operates in: a fishing company, a car factory, a law firm.","(2)","short",
    short_ms("Award 1 mark each, up to 2.",["Fishing = primary (1)","Car factory = secondary (1)","Law firm = tertiary (1)"]))
add("A","A1 Sectors","Explain",4,"AO2","","Explain why a single business might operate in more than one sector of the economy.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Many large businesses are vertically integrated (1) e.g. an oil company that extracts (primary), refines (secondary) and sells petrol (tertiary) (1)","Operating across sectors spreads risk and adds value at each stage (1) increasing control and profit (1)"]))
add("A","A1 Scope","Identify",2,"AO1","","Identify two benefits to a business of expanding from a national to an international scope.","(2)","short",
    short_ms("Award 1 mark each.",["Access to larger markets and more customers (1)","Economies of scale / lower unit costs (1)","Spreading risk across markets (1)","Increased brand recognition (1)"],"Award up to 2."))
add("A","A1 Scope","Explain",4,"AO2","","Explain two challenges a business faces when expanding internationally.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Different legal and regulatory requirements in each country (1) increase complexity and compliance costs (1)","Cultural and language differences (1) may require adapting products and marketing (1)","Currency/exchange rate fluctuations (1) create financial risk (1)"]))
add("A","A1 Size of business","Explain",4,"AO2","","Explain how business size is measured, other than by employee numbers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Size can be measured by turnover/revenue (1) or by the value of capital employed/assets (1)","It can also be measured by market share (1) or the number of outlets/branches (1)"]))
add("A","A1 Reasons for success","Identify",2,"AO1","","Identify two reasons why some businesses fail.","(2)","short",
    short_ms("Award 1 mark each.",["Lack of cash/finance (1)","Poor management/planning (1)","Weak demand for the product (1)","Intense competition (1)","Failure to control costs (1)"],"Award up to 2."))
add("A","A1 Reasons for success","Explain",4,"AO2","","Explain how effective financial management contributes to business success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Effective financial management ensures the business has enough cash to meet its obligations (1) avoiding insolvency (1)","It controls costs and monitors profitability (1) helping the business make informed decisions and remain viable (1)"]))
add("A","A2 Stakeholders","Identify",2,"AO1","","Identify two ways employees can influence a business.","(2)","short",
    short_ms("Award 1 mark each.",["Through their productivity and quality of work (1)","Through industrial action (strikes) (1)","Through suggestions and feedback (1)","By leaving the business (turnover) (1)"],"Award up to 2."))
add("A","A2 Stakeholders","Explain",4,"AO2","","Explain why it is important for a business to consider the interests of all its stakeholders.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Different stakeholders can affect the business's success (1) e.g. unhappy employees or suppliers can disrupt operations (1)","Balancing stakeholder interests builds trust and support (1) sustaining the business's reputation and long-term success (1)"]))
add("A","A2 Stakeholder influence","Explain",4,"AO2","","Explain how lenders (banks) can influence a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Lenders provide finance and set interest rates and repayment terms (1) affecting the business's costs and cash flow (1)","Lenders can refuse credit or impose conditions (1) limiting the business's ability to invest and grow (1)"]))
add("A","A2 Stakeholder influence","Explain",4,"AO2","","Explain how competitors can influence a business's decisions.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Competitors' pricing and products force a business to respond (1) to avoid losing customers (1)","Competitor actions drive innovation and efficiency (1) as the business tries to differentiate and stay competitive (1)"]))
add("A","A2 Stakeholder influence","Explain",4,"AO2","","Explain how the local community can influence a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The local community can support or oppose the business (1) e.g. through planning objections or positive word-of-mouth (1)","A business that harms the community faces reputational damage (1) reducing custom and attracting criticism (1)"]))
add("A","A3 Business communications","Explain",4,"AO2","","Explain one advantage and one disadvantage of face-to-face meetings as a method of business communication.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: allows immediate feedback, body language and discussion (1) helping clarify complex issues (1)","Disadvantage: costly and time-consuming, especially if travel is involved (1) and may be difficult to schedule (1)"]))
add("A","A3 Business communications","Explain",4,"AO2","","Explain why written communication is important in business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Written communication provides a permanent record (1) useful for evidence, contracts and future reference (1)","It can be carefully composed for accuracy and consistency (1) and shared with many recipients (1)"]))
add("A","A3 Business communications","Identify",2,"AO1","","Identify two ways ICT has changed business communication.","(2)","short",
    short_ms("Award 1 mark each.",["Email and instant messaging enable instant communication (1)","Video conferencing allows remote meetings (1)","Social media enables direct customer engagement (1)","Cloud collaboration tools allow shared working (1)"],"Award up to 2."))

# ============ AIM B — more coverage ============
add("B","B1 Organisational structure","Identify",2,"AO1","","Identify two advantages of a hierarchical organisational structure.","(2)","short",
    short_ms("Award 1 mark each.",["Clear chain of command (1)","Clear lines of authority and accountability (1)","Clear promotion/career progression path (1)","Specialist roles and expertise at each level (1)"],"Award up to 2."))
add("B","B1 Organisational structure","Identify",2,"AO1","","Identify two disadvantages of a hierarchical organisational structure.","(2)","short",
    short_ms("Award 1 mark each.",["Slow communication through many layers (1)","Slow decision-making (1)","Less flexible/responsive to change (1)","High management costs (1)","Employees may feel less empowered (1)"],"Award up to 2."))
add("B","B1 Organisational structure","Explain",4,"AO2","","Explain how a wide span of control differs from a narrow span of control.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A wide span of control means a manager supervises many subordinates (1) common in flat structures (1)","A narrow span of control means a manager supervises few subordinates (1) common in tall/hierarchical structures (1)"]))
add("B","B1 Organisational structure","Explain",4,"AO2","","Explain how organisational structure can affect communication within a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A hierarchical structure has many layers so messages pass through several levels (1) slowing communication and risking distortion (1)","A flat structure has few layers (1) so communication is faster and more direct (1)"]))
add("B","B1 Organisational structure","Explain",4,"AO2","","Explain why a business might change from a hierarchical to a flatter structure.","(4)","short",
    short_ms("Award 1+1. Max 4.",["To speed up communication and decision-making (1) by removing layers of management (1)","To reduce management costs (1) and empower employees (1)","To become more flexible and responsive to change (1)"]))
add("B","B1 Functional areas","Identify",2,"AO1","","Identify the functional area responsible for buying raw materials and supplies.","(2)","short",
    short_ms("Award 2.",["Purchasing (or procurement) (2)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain the role of the purchasing function in a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Purchasing sources and buys the raw materials, components and supplies the business needs (1) at the right quality and price (1)","It manages supplier relationships and negotiates terms (1) ensuring reliable supply and good value (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain the role of the IT function in a modern business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["IT maintains the business's computer systems, networks and software (1) ensuring they run reliably and securely (1)","It supports other functions through technology (1) e.g. e-commerce, data analysis and communication tools (1)"]))
add("B","B1 Functional areas","Explain",4,"AO2","","Explain the role of the administration function in a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Administration provides clerical and support services (1) such as record-keeping, filing and correspondence (1)","It ensures the smooth running of the organisation (1) by coordinating information and routine tasks (1)"]))
add("B","B2 Aims and objectives","Explain",4,"AO2","","Explain the difference between an aim and an objective, using an example.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An aim is a broad, long-term goal (e.g. 'to become the market leader') (1); an objective is a specific, measurable step towards it (e.g. 'to increase market share by 5% within a year') (1)","Objectives are more detailed and time-bound than aims (1) and are used to measure progress (1)"]))
add("B","B2 Aims and objectives","Explain",4,"AO2","","Explain why survival is often the first aim of a new business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["New businesses face high start-up costs and uncertain demand (1) and many fail in their first years (1)","Establishing a stable customer base and cash flow (1) is essential before pursuing growth or profit (1)"]))
add("B","B2 Aims and objectives","Explain",4,"AO2","","Explain how profit and growth as aims can conflict.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Pursuing profit in the short term may mean not investing in growth (1) reducing long-term expansion (1)","Pursuing growth requires heavy investment (1) which reduces short-term profit (1)","A business must balance the two aims over time (1)"]))
add("B","B2 SMART objectives","Identify",2,"AO1","","Identify whether 'to increase sales by 15% in the next six months' is a SMART objective, explaining why.","(2)","short",
    short_ms("Award 2.",["Yes — it is specific (increase sales), measurable (15%), achievable/relevant (sales growth) and time-constrained (six months) (2)"]))
add("B","B2 SMART objectives","Explain",4,"AO2","","Explain the benefit to a business of setting time-constrained objectives.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Time-constrained objectives create a deadline (1) which focuses effort and prioritises resources (1)","They allow progress to be reviewed at a set point (1) enabling corrective action if the business is off track (1)"]))
add("B","B1/B2 Structure and objectives","Discuss",6,"AO3","FreshBrew is a growing coffee shop chain with 40 outlets. It currently uses a hierarchical structure but wants to improve innovation and respond faster to local customer needs.","Discuss whether FreshBrew should move to a flatter organisational structure. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Hierarchical structure provides clear control across 40 outlets but may slow decisions and responsiveness","Flat structure would speed communication and empower outlet managers to respond to local needs","A flat structure reduces management layers and costs but may weaken central control and consistency","With 40 outlets, some hierarchy is needed for coordination and brand consistency","Alternative: decentralise decision-making to regional/outlet managers while keeping a slim hierarchy","Conclusion: a flatter structure with empowered outlet managers supports innovation and responsiveness, but FreshBrew should retain clear accountability"],
    levels3("Describes hierarchical vs flat in basic terms.","Compares the structures with partial application to FreshBrew's 40 outlets.","Thoroughly evaluates fit for a multi-outlet chain; justified recommendation.")))

# ============ AIM C — more coverage ============
add("C","C1 External environment","Explain",4,"AO2","","Explain how a fall in the exchange rate could affect a business that imports raw materials.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A fall in the exchange rate makes imports more expensive (1) increasing the business's input costs (1)","This raises unit costs and squeezes profit margins (1); the business may need to raise prices or find cheaper suppliers (1)"]))
add("C","C1 External environment","Explain",4,"AO2","","Explain how economic growth affects businesses.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Economic growth increases consumer incomes and confidence (1) raising demand for goods and services (1)","Businesses can expand output and invest (1) but may also face rising costs and higher interest rates (1)"]))
add("C","C1 External environment","Explain",4,"AO2","","Explain how a recession affects businesses.","(4)","short",
    short_ms("Award 1+1. Max 4.",["In a recession consumer incomes and confidence fall (1) reducing demand and sales (1)","Businesses face falling revenue and rising risk of bad debts (1) and may have to cut costs or output to survive (1)"]))
add("C","C1 External environment","Explain",4,"AO2","","Explain how changing consumer tastes can affect a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Shifts in tastes (e.g. towards healthier or ethical products) change what consumers want (1) altering demand for a business's products (1)","Businesses must adapt their products and marketing (1) or risk losing customers to more responsive rivals (1)"]))
add("C","C1 External environment","Explain",4,"AO2","","Explain how technological change can create both opportunities and threats for a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Opportunities: technology enables new products, e-commerce and efficiency gains (1) opening new markets and lowering costs (1)","Threats: technology can make existing products or processes obsolete (1) and new digital competitors can enter the market (1)"]))
add("C","C2 Internal environment","Explain",4,"AO2","","Explain how corporate culture can affect a business's performance.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A positive, supportive culture motivates employees (1) improving productivity and reducing staff turnover (1)","A negative or rigid culture can demotivate staff and hinder change (1) damaging performance and innovation (1)"]))
add("C","C2 CSR","Explain",4,"AO2","","Explain two ways a business can demonstrate corporate social responsibility.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Reducing its environmental impact (e.g. cutting carbon emissions, using sustainable materials) (1) to act responsibly towards the planet (1)","Supporting local communities or charities (1) through donations, volunteering or ethical sourcing (1)","Treating employees fairly and paying a living wage (1) demonstrating social responsibility (1)"]))
add("C","C2 Ethics","Explain",4,"AO2","","Explain why behaving ethically can benefit a business in the long term.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Ethical behaviour builds trust and a strong reputation (1) attracting and retaining customers and employees (1)","It reduces the risk of scandals, legal action and boycotts (1) protecting long-term profitability (1)"]))
add("C","C3 Competitive environment","Explain",4,"AO2","","Explain how a business can differentiate itself from competitors.","(4)","short",
    short_ms("Award 1+1. Max 4.",["By offering unique product features or quality (1) that competitors do not provide (1)","Through superior customer service or a strong brand (1) that creates loyalty and justifies a premium price (1)"]))
add("C","C3 Competitive environment","Explain",4,"AO2","","Explain how a business can respond to a new competitor entering its market.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Strengthen its brand and customer loyalty (1) to retain existing customers (1)","Differentiate its product or cut prices (1) to remain competitive against the new entrant (1)","Improve quality or service (1) to protect market share (1)"]))
add("C","C4 Situational analysis","Explain",4,"AO2","","Explain what the 5Cs analysis examines.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The 5Cs analyse Company, Competitors, Customers, Collaborators and Climate (1) to assess the business environment (1)","It examines internal capabilities (company) and external factors (1) to inform strategy (1)"]))
add("C","C4 Situational analysis","Explain",4,"AO2","","Explain the difference between PESTLE and SWOT analysis.","(4)","short",
    short_ms("Award 1+1. Max 4.",["PESTLE analyses only the external environment (1) — political, economic, social, technological, legal and environmental factors (1)","SWOT analyses both internal and external factors (1) — internal Strengths/Weaknesses and external Opportunities/Threats (1)"]))
add("C","C4 Situational analysis","Explain",4,"AO2","","Explain the benefit to a business of carrying out situational analysis before making a major decision.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Situational analysis provides a clear picture of the internal and external environment (1) reducing the risk of making uninformed decisions (1)","It identifies strengths to build on and threats to guard against (1) supporting more effective strategic planning (1)"]))
add("C","C1-C4 Environment","Discuss",6,"AO3","GreenBuild, a housebuilder, is affected by new environmental regulations on energy efficiency, a shortage of skilled labour, and rising demand for eco-friendly homes.","Discuss how GreenBuild should respond to changes in its external environment. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["External factors: Legal (energy-efficiency regulations), Social (demand for eco homes), Economic (labour shortage, costs)","Regulations require investment in energy-efficient building methods — a cost but also a differentiator","The skilled labour shortage raises costs and limits output","Rising demand for eco-friendly homes is an opportunity GreenBuild can exploit","Responses: invest in green building techniques, train/recruit staff, market eco credentials","Conclusion: GreenBuild should embrace the green trend, invest in skills, and turn regulation into a competitive advantage"],
    levels3("Identifies external factors in basic terms.","Links factors to GreenBuild with partial analysis.","Thoroughly evaluates responses and reaches a justified conclusion.")))

# ============ AIM D — more coverage ============
add("D","D1 Market structures","Identify",2,"AO1","","Identify two features of an oligopoly market.","(2)","short",
    short_ms("Award 1 mark each.",["A few large dominant firms (1)","High barriers to entry (1)","Interdependence between firms (1)","Products may be differentiated or homogeneous (1)","Non-price competition (advertising) (1)"],"Award up to 2."))
add("D","D1 Market structures","Explain",4,"AO2","","Explain the concept of barriers to entry.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Barriers to entry are obstacles that make it difficult for new firms to enter a market (1) such as high start-up costs, economies of scale or brand loyalty (1)","High barriers protect existing firms from competition (1) and are a key feature of monopoly and oligopoly (1)"]))
add("D","D1 Market structures","Explain",4,"AO2","","Explain the difference between a monopoly and an oligopoly.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A monopoly has one dominant firm with no close substitutes (1); an oligopoly has a few large firms dominating the market (1)","In a monopoly there is no direct competition (1); in an oligopoly firms are interdependent and watch each other's actions (1)"]))
add("D","D2 Demand","Explain",4,"AO2","","Explain how the price of a product affects demand, ceteris paribus.","(4)","short",
    short_ms("Award 1+1. Max 4.",["There is an inverse relationship between price and quantity demanded (1) — as price rises, quantity demanded falls (1)","As price falls, quantity demanded rises (1) because the product becomes more affordable (1)"]))
add("D","D2 Demand","Explain",4,"AO2","","Explain how the level of GDP affects demand.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Higher GDP means higher incomes and economic activity (1) so consumers can afford to buy more, raising demand (1)","Lower GDP reduces incomes and confidence (1) lowering demand (1)"]))
add("D","D2 Supply","Explain",4,"AO2","","Explain how the ability to produce profitably affects supply.","(4)","short",
    short_ms("Award 1+1. Max 4.",["If a business can produce profitably, it is willing to supply more (1) as higher profit incentivises output (1)","If production is unprofitable (e.g. high costs, low prices) supply falls (1) as firms cut output or leave the market (1)"]))
add("D","D2 Supply","Explain",4,"AO2","","Explain how logistics and distribution affect supply.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Efficient logistics and distribution enable a business to get products to market quickly (1) increasing its ability to supply (1)","Poor logistics (delays, transport problems) restrict supply (1) as products cannot reach customers (1)"]))
add("D","D2 Elasticity","Explain",4,"AO2","","Explain why demand for necessities tends to be price inelastic.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Necessities (e.g. food, fuel) are essential so consumers must keep buying them (1) even if prices rise (1)","There are few substitutes for necessities (1) so consumers cannot easily switch, making demand inelastic (1)"]))
add("D","D2 Elasticity","Explain",4,"AO2","","Explain why demand for luxury goods tends to be price elastic.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Luxury goods are non-essential (1) so consumers can easily stop buying them if prices rise (1)","There are often alternatives or the purchase can be postponed (1) making demand responsive to price (1)"]))
add("D","D3 Pricing and output","Explain",4,"AO2","","Explain how demand and supply interact to determine market price.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The market price is determined by the interaction of demand and supply (1) at the point where quantity demanded equals quantity supplied (1)","If demand exceeds supply, price rises (1); if supply exceeds demand, price falls (1)"]))
add("D","D3 Competitive response","Explain",4,"AO2","","Explain how a business in an oligopoly might respond to a rival launching a new product.","(4)","short",
    short_ms("Award 1+1. Max 4.",["In an oligopoly firms are interdependent (1) so a rival's new product may force the business to respond (1)","The business might launch its own competing product or improve its existing one (1) to avoid losing market share (1)"]))
add("D","D3 Pricing and output","Explain",4,"AO2","","Explain what is meant by a price war and its likely effect on firms.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A price war occurs when competing firms repeatedly cut prices to undercut each other (1) to gain market share (1)","Price wars erode profit margins for all firms involved (1) and can drive weaker firms out of the market (1)"]))
add("D","D2 Elasticity","Calculate",4,"AO2","","A product's price falls by 10% and quantity demanded rises by 20%. Calculate the price elasticity of demand and state whether demand is elastic or inelastic. (4)","(4)","calculation",
    short_ms("Award 1 mark per step. Max 4.",["Formula: PED = % change in quantity demanded ÷ % change in price (1)","PED = 20% ÷ 10% = 2 (1)","PED of 2 is greater than 1 (1)","Therefore demand is price elastic (1)"]))
add("D","D1-D3 Markets","Discuss",6,"AO3","A new entrant is considering entering the highly concentrated soft-drinks market, currently dominated by two large firms.","Discuss the barriers to entry the new entrant is likely to face. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["The soft-drinks market is an oligopoly dominated by two large firms","Economies of scale enjoyed by incumbents mean low unit costs the entrant cannot match","Strong brand loyalty and heavy advertising by incumbents make it hard to win customers","Distribution agreements and shelf space in retailers may be locked up by incumbents","High capital costs for production and marketing are a major barrier","Conclusion: significant barriers to entry make market entry difficult and risky; the entrant would need differentiation or a niche to succeed"],
    levels3("Identifies one or two barriers in basic terms.","Explains several barriers with some application to the soft-drinks market.","Thoroughly evaluates the barriers and reaches a justified conclusion about market entry.")))

# ============ AIM E — more coverage ============
add("E","E1 Innovation","Identify",2,"AO1","","Identify two types of innovation a business can pursue.","(2)","short",
    short_ms("Award 1 mark each.",["Product innovation (1)","Process innovation (1)","Service innovation (1)","Business model innovation (1)"],"Award up to 2."))
add("E","E1 Innovation","Explain",4,"AO2","","Explain the difference between product innovation and process innovation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Product innovation is developing new or improved products/services (1) e.g. a new smartphone feature (1)","Process innovation is improving how products are made or delivered (1) e.g. automating production to reduce costs (1)"]))
add("E","E1 Enterprise thinking","Explain",4,"AO2","","Explain the importance of enterprise to the economy.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Enterprise creates new businesses and jobs (1) contributing to economic growth (1)","Entrepreneurs introduce innovation and competition (1) improving products and efficiency across the economy (1)"]))
add("E","E1 Enterprise thinking","Explain",4,"AO2","","Explain how lateral thinking can help a business solve problems.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Lateral thinking approaches problems from new, indirect angles (1) rather than conventional step-by-step logic (1)","This generates creative, unexpected solutions (1) that may be more effective than traditional approaches (1)"]))
add("E","E2 Benefits of innovation","Explain",4,"AO2","","Explain how innovation can create new markets for a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Radically new products can create entirely new markets (1) e.g. smartphones created the app market (1)","Entering new/niche markets diversifies the business (1) reducing reliance on existing markets (1)"]))
add("E","E2 Benefits of innovation","Explain",4,"AO2","","Explain how innovation can improve efficiency in a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Process innovation (e.g. automation) speeds up production and reduces waste (1) lowering unit costs (1)","New technology can streamline operations (1) improving productivity and profitability (1)"]))
add("E","E2 Risks of innovation","Explain",4,"AO2","","Explain why innovation does not always lead to business success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Innovation is expensive and may not achieve a return on investment (1) if the new product fails to sell (1)","Even a good idea can fail due to poor execution, timing or resistance to change (1) so innovation involves significant risk (1)"]))
add("E","E2 Managing risk","Explain",4,"AO2","","Explain the importance of leadership support for successful innovation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Leadership support provides the vision, resources and commitment innovation needs (1) to succeed (1)","Without leadership backing, innovation projects may lack funding and priority (1) and fail due to insufficient support (1)"]))
add("E","E2 Benefits and risks","Analyse",6,"AO3","A traditional printing firm is considering investing in digital printing technology to stay competitive as demand for print declines.","Analyse the benefits and risks of this innovation for the printing firm. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Benefits: digital printing can reduce costs, improve speed and offer new services, helping the firm compete","It may open new markets (e.g. short-run, personalised printing)","Risks: high investment cost with uncertain return as print demand declines overall","Employees may resist the change to digital processes","The market may not recover even with new technology","Balanced view: innovation is necessary for survival but does not guarantee success","Conclusion: the firm should innovate to diversify, but manage the investment carefully"],
    levels3("Describes the innovation in basic terms.","Identifies benefits and risks with partial application.","Balanced analysis of benefits vs risks; justified conclusion.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U1 aim counts:", {k: len(v) for k, v in aims.items()})
print("U1 total:", sum(len(v) for v in aims.values()))
