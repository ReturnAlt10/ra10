# -*- coding: utf-8 -*-
"""Generate BTEC Business Unit 1 (Exploring Business) data files."""
import json, os

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-1\data"
os.makedirs(BASE, exist_ok=True)

def q(id, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    return {"id": id, "learning_aim": aim, "topic": topic, "command_verb": verb,
            "marks": marks, "ao": ao, "scenario": scenario, "question": question,
            "guidance": guidance, "type": typ, "mark_scheme": ms}

def short_ms(instr, points, add=None, dna=None):
    return {"instruction": instr, "points": points, "additional_guidance": add, "do_not_accept": dna}

def lvl_ms(instr, indic, levels):
    return {"instruction": instr, "indicative_content": indic, "level_descriptors": levels}

def levels3(d1, d2, d3):
    return [{"level":1,"marks":"1-2","descriptor":d1},{"level":2,"marks":"3-4","descriptor":d2},{"level":3,"marks":"5-6","descriptor":d3}]

def levels4(d1, d2, d3, d4):
    return [{"level":1,"marks":"1-3","descriptor":d1},{"level":2,"marks":"4-6","descriptor":d2},{"level":3,"marks":"7-9","descriptor":d3},{"level":4,"marks":"10-12","descriptor":d4}]

aims = {}

# ============ AIM A — Features of businesses & success ============
aims["A"] = [
 q("A001","A","A1 Ownership and liability","Give",2,"AO1","","Give two forms of business ownership available to a private business.","(2)","short",
   short_ms("Award 1 mark each, up to 2.",["Sole trader (1)","Partnership (1)","Private limited company (Ltd) (1)","Public limited company (plc) (1)","Cooperative (1)","Franchise (1)"],"Accept any two valid forms.")),
 q("A002","A","A1 Ownership and liability","State",2,"AO1","","State the difference between limited and unlimited liability.","(2)","short",
   short_ms("Award 1+1.",["Limited liability: owners' personal assets are protected; they only lose what they invested (1)","Unlimited liability: owners are personally responsible for all business debts (1)"])),
 q("A003","A","A1 Ownership and liability","Identify",2,"AO1","","Identify two types of not-for-profit organisation.","(2)","short",
   short_ms("Award 1 mark each, up to 2.",["Charitable trust (1)","Voluntary organisation (1)","Cooperative (not-for-profit) (1)","Social enterprise (1)"])),
 q("A004","A","A1 Sectors","State",2,"AO1","","State the four sectors of the economy in which businesses operate.","(2)","short",
   short_ms("Award 1 mark each, up to 4 (max 2).",["Primary (1)","Secondary (1)","Tertiary (1)","Quaternary (1)"],"Award up to 2 marks; any two correct sectors.")),
 q("A005","A","A1 Sectors","Identify",2,"AO1","","Identify which sector a farming business operates in and which sector a restaurant operates in.","(2)","short",
   short_ms("Award 1 mark each.",["Farming = primary sector (1)","Restaurant = tertiary sector (1)"])),
 q("A006","A","A1 Size of business","State",2,"AO1","","State the number of employees that defines a micro business, a small business and a large business under EU definitions.","(2)","short",
   short_ms("Award up to 2.",["Micro: up to 9 staff (1)","Small: 10-49 staff (1)","Large: more than 250 staff (1)"],"Award up to 2 marks.")),
 q("A007","A","A1 Scope","Explain",4,"AO2","","Explain the difference between a local, national and international business in terms of scope of activity.","(4)","short",
   short_ms("Award 1+1 for each point. Max 4.",["A local business operates and sells within a small geographic area, e.g. a town (1); a national business operates across a whole country (1)","An international business operates in more than one country, selling to overseas markets (1); scope increases the size and complexity of operations, supply chains and regulation (1)"])),
 q("A008","A","A1 Reasons for success","Explain",4,"AO2","","Explain two reasons why a business might be successful.","(4)","short",
   short_ms("Award 1+1 for each. Max 4.",["Clear vision and strong leadership give the business direction and focus (1) motivating staff and guiding decision-making (1)","Innovative products or processes differentiate the business from competitors (1) attracting customers and allowing premium pricing (1)","Meeting customer needs consistently builds loyalty and repeat purchases (1) which sustains revenue over time (1)"])),
 q("A009","A","A2 Stakeholders","Identify",2,"AO1","","Identify two internal stakeholders of a business.","(2)","short",
   short_ms("Award 1 mark each.",["Owners / shareholders (1)","Managers (1)","Employees (1)"],"Award up to 2 marks.")),
 q("A010","A","A2 Stakeholders","Give",2,"AO1","","Give two examples of external stakeholders of a business.","(2)","short",
   short_ms("Award 1 mark each.",["Suppliers (1)","Customers (1)","Lenders / banks (1)","Government / government agencies (1)","Local community (1)","Pressure groups (1)","Competitors (1)"],"Award up to 2.")),
 q("A011","A","A2 Stakeholder influence","Explain",4,"AO2","","Explain how customers can influence the success of a business.","(4)","short",
   short_ms("Award 1+1 for each point. Max 4.",["Customers provide the revenue a business needs to survive (1); without repeat custom a business cannot sustain itself (1)","Customer feedback and complaints shape product and service improvements (1) helping the business stay competitive (1)","Strong customer service builds loyalty and retention (1) making customers long-term assets (1)"])),
 q("A012","A","A2 Stakeholder influence","Explain",4,"AO2","","Explain how employees can influence the success of a business.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Employees deliver the product or service, so their skill and motivation directly affect quality (1) and therefore customer satisfaction (1)","Employee productivity and efficiency affect costs and profitability (1); engaged employees are more innovative and productive (1)"])),
 q("A013","A","A3 Business communications","Identify",2,"AO1","","Identify two methods of oral communication a business might use to present information.","(2)","short",
   short_ms("Award 1 mark each.",["Computer projection / PowerPoint presentation (1)","Video conferencing platforms (1)","Face-to-face meeting (1)","Telephone call (1)"],"Award up to 2.")),
 q("A014","A","A3 Business communications","Explain",4,"AO2","","Explain why effective communication is important to business success.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Effective communication ensures employees understand aims and tasks (1) reducing errors and improving coordination (1)","Good communication with customers builds trust and loyalty (1) improving reputation and repeat business (1)","Social media and virtual communities allow businesses to reach and engage audiences quickly (1) and cheaply (1)"])),
 q("A015","A","A1 Features of businesses","Discuss",6,"AO3","FreshFarms is a sole trader organic farm selling vegetables locally. GlobalMart is a plc supermarket operating internationally.","Discuss how the features of these two contrasting businesses affect their chances of success. (6)","(6)","extended_levels",
   lvl_ms("Levels-based.",
    ["FreshFarms: sole trader, unlimited liability, primary sector, local scope, micro size","GlobalMart: plc, limited liability, tertiary sector, international scope, large size","Sole trader = full control and quick decisions but unlimited liability and limited finance","plc = access to share capital and economies of scale but slower decisions and regulatory burden","Success defined differently: FreshFarms on local reputation and customer loyalty; GlobalMart on market share and profit maximisation"],
    levels3("Describes the two businesses in basic terms; limited comparison.","Compares features such as ownership, size and sector; links one or two to success.","Thoroughly contrasts both businesses; explains how specific features drive or limit success; justified judgement."))),
]

# ============ AIM B — How businesses are organised ============
aims["B"] = [
 q("B001","B","B1 Organisational structure","Identify",2,"AO1","","Identify two types of organisational structure a business might use.","(2)","short",
   short_ms("Award 1 mark each.",["Hierarchical (1)","Flat (1)","Matrix (1)","Holacratic (1)"],"Award up to 2.")),
 q("B002","B","B1 Organisational structure","State",2,"AO1","","State one advantage and one disadvantage of a hierarchical structure.","(2)","short",
   short_ms("Award 1+1.",["Advantage: clear chain of command / clear lines of authority and accountability (1)","Disadvantage: slow communication / many layers slow decision-making (1)"])),
 q("B003","B","B1 Functional areas","Identify",2,"AO1","","Identify two functional areas of a business.","(2)","short",
   short_ms("Award 1 mark each.",["Human resources (1)","Marketing (1)","Finance (1)","Production / operations (1)","Sales (1)","Customer service (1)","Purchasing (1)","Research and development (1)"],"Award up to 2.")),
 q("B004","B","B1 Functional areas","Explain",4,"AO2","","Explain the role of the human resources function in a business.","(4)","short",
   short_ms("Award 1+1. Max 4.",["HR recruits, selects and trains staff (1) ensuring the business has the skilled workforce it needs (1)","HR manages pay, contracts, appraisals and disciplinary matters (1) and ensures employment law is followed (1)"])),
 q("B005","B","B1 Functional areas","Explain",4,"AO2","","Explain the role of the marketing function in a business.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Marketing identifies customer needs through market research (1) and develops products/services to meet them (1)","Marketing promotes products and manages the brand (1) to attract and retain customers and increase sales (1)"])),
 q("B006","B","B2 Aims and objectives","State",2,"AO1","","State two aims a private sector business might have.","(2)","short",
   short_ms("Award 1 mark each.",["Making profits / profit maximisation (1)","Survival (1)","Growth (1)","Market leadership (1)","Break-even (1)"],"Award up to 2.")),
 q("B007","B","B2 Aims and objectives","State",2,"AO1","","State two aims a not-for-profit organisation might have.","(2)","short",
   short_ms("Award 1 mark each.",["Education (1)","Housing (1)","Alleviating poverty (1)","Healthcare (1)","Providing a service to members/community (1)"],"Award up to 2.")),
 q("B008","B","B2 SMART objectives","Identify",2,"AO1","","Identify what the acronym SMART stands for in relation to objectives.","(2)","short",
   short_ms("Award 1 mark for each correct element, up to 2.",["Specific (1)","Measurable (1)","Achievable (1)","Relevant (1)","Time-constrained / Time-bound (1)"],"Award up to 2.")),
 q("B009","B","B2 SMART objectives","Explain",4,"AO2","","Explain why businesses set SMART objectives.","(4)","short",
   short_ms("Award 1+1. Max 4.",["SMART objectives are specific and measurable (1) so progress can be tracked and success assessed (1)","They are achievable and relevant (1) so they are realistic and aligned with the business's overall aims (1)","Time-constrained objectives create urgency and focus (1) helping prioritise resources (1)"])),
 q("B010","B","B2 Aims and objectives","Explain",4,"AO2","","Explain the difference between the aims of a private business and a public sector organisation.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Private businesses typically aim to make profit and grow (1) to maximise returns for owners/shareholders (1)","Public sector organisations aim to provide services, control costs and give value for money (1) rather than generate profit (1)"])),
 q("B011","B","B1 Structure and aims","Discuss",6,"AO3","TechNova Ltd is a fast-growing software company with 200 employees. It is considering moving from a hierarchical to a flatter structure.","Discuss whether TechNova Ltd should adopt a flatter organisational structure. (6)","(6)","extended_levels",
   lvl_ms("Levels-based.",
    ["Hierarchical: clear chain of command, defined roles, but slow decisions and poor communication across layers","Flat: fewer layers, faster communication, more employee empowerment, lower management costs","For a fast-growing tech firm, speed and innovation matter — flat structure supports agility","But 200 employees need coordination; too flat can create unclear reporting and overloaded managers","Could use a matrix or hybrid structure to combine flexibility with clarity","Conclusion: a flatter or matrix structure is likely beneficial but must retain clear accountability"],
    levels3("Describes hierarchical vs flat in basic terms.","Compares advantages/disadvantages; links structure to TechNova's needs partially.","Thoroughly evaluates fit for a fast-growing tech business; justified recommendation."))),
]

# ============ AIM C — The environment ============
aims["C"] = [
 q("C001","C","C1 PESTLE","Identify",2,"AO1","","Identify what each letter of PESTLE stands for.","(2)","short",
   short_ms("Award 1 mark per correct element, up to 2.",["Political (1)","Economic (1)","Social (1)","Technological (1)","Legal (1)","Environmental (1)"],"Award up to 2.")),
 q("C002","C","C1 External environment","Give",2,"AO1","","Give two examples of economic factors that can affect a business.","(2)","short",
   short_ms("Award 1 mark each.",["Economic growth / recession (1)","Exchange rates (1)","Interest rates / monetary policy (1)","Taxation / fiscal policy (1)","Inflation (1)"],"Award up to 2.")),
 q("C003","C","C1 External environment","Give",2,"AO1","","Give two examples of social factors that can affect a business.","(2)","short",
   short_ms("Award 1 mark each.",["Demographic trends / ageing population (1)","Changes in consumer tastes and preferences (1)","Attitudes to saving and spending (1)","Lifestyle changes (1)","Cultural changes (1)"],"Award up to 2.")),
 q("C004","C","C1 External environment","Explain",4,"AO2","","Explain how a rise in the exchange rate could affect a business that exports its products.","(4)","short",
   short_ms("Award 1+1. Max 4.",["A rise in the exchange rate makes exports more expensive for overseas buyers (1) reducing demand for the business's products abroad (1)","This reduces export revenue and competitiveness (1); the business may need to cut prices or find new markets (1)"])),
 q("C005","C","C1 External environment","Explain",4,"AO2","","Explain how technological change can affect a business.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Technology such as automation can reduce labour costs and improve efficiency (1) lowering unit costs and raising productivity (1)","Improved communication technology enables e-commerce and faster customer service (1) but requires investment and may make old processes obsolete (1)"])),
 q("C006","C","C2 Internal environment","State",2,"AO1","","State what is meant by corporate culture.","(2)","short",
   short_ms("Award 2.",["The shared values, beliefs, attitudes and ways of working within an organisation (2)"])),
 q("C007","C","C2 CSR","Explain",4,"AO2","","Explain what is meant by corporate social responsibility (CSR) and give an example.","(4)","short",
   short_ms("Award 1+1. Max 4.",["CSR is a business's commitment to behave ethically and consider its social and environmental impact (1) beyond legal requirements (1)","Example: reducing carbon emissions, supporting local communities, fair trade sourcing, ethical labour practices (1) which improves reputation and stakeholder trust (1)"])),
 q("C008","C","C3 Competitive environment","Explain",4,"AO2","","Explain two factors that can give a business a competitive advantage.","(4)","short",
   short_ms("Award 1+1 each. Max 4.",["Differentiation — offering a unique product or feature (1) that competitors cannot easily copy (1)","Cost leadership / lower pricing (1) achieved through economies of scale and cost control (1)","Strong reputation and brand loyalty (1) which reduces price sensitivity (1)"])),
 q("C009","C","C4 Situational analysis","State",2,"AO1","","State what SWOT analysis is used for.","(2)","short",
   short_ms("Award 2.",["To assess a business's internal Strengths and Weaknesses and external Opportunities and Threats (2)"])),
 q("C010","C","C4 Situational analysis","Identify",2,"AO1","","Identify two techniques (other than SWOT and PESTLE) a business could use to analyse its environment.","(2)","short",
   short_ms("Award 1 mark each.",["Porter's Five Forces (1)","5Cs analysis (Company, Competitors, Customers, Collaborators, Climate) (1)"],"Award up to 2.")),
 q("C011","C","C1-C4 Environment","Evaluate",12,"AO3","GreenCar Ltd manufactures electric vehicles. Rising environmental awareness is increasing demand, but new competition legislation and higher energy costs are creating challenges.","Evaluate the effect of the business environment on GreenCar Ltd, using situational analysis techniques. (12)","(12)","extended_levels",
   lvl_ms("Levels-based, 4 levels.",
    ["PESTLE: Political (government support for EVs), Economic (energy costs, exchange rates), Social (environmental awareness), Technological (battery innovation), Legal (competition legislation), Environmental (emissions)","SWOT: Strengths (established brand), Weaknesses (high costs), Opportunities (growing EV market), Threats (new entrants, regulation)","Rising environmental awareness boosts demand — an opportunity","Higher energy costs raise production costs — a threat to margins","Competition legislation limits anti-competitive behaviour — both opportunity (level playing field) and constraint","Conclusion: net-positive environment with key risks; GreenCar should invest in technology and cost control"],
    levels4("Identifies a few environmental factors in isolation.","Applies PESTLE/SWOT with some linkage; partial evaluation.","Uses several techniques with clear links to the business; balanced evaluation.","Thorough situational analysis; evaluates the combined effect and makes justified recommendations."))),
]

# ============ AIM D — Business markets ============
aims["D"] = [
 q("D001","D","D1 Market structures","State",2,"AO1","","State the two main categories of market structure.","(2)","short",
   short_ms("Award 1+1.",["Perfect competition (1)","Imperfect competition (1)"])),
 q("D002","D","D1 Market structures","Identify",2,"AO1","","Identify two features of perfect competition.","(2)","short",
   short_ms("Award 1 mark each.",["Many firms (1)","Freedom of entry (1)","Homogeneous / identical products (1)","Firms are price takers (1)"],"Award up to 2.")),
 q("D003","D","D1 Market structures","Explain",4,"AO2","","Explain the difference between perfect and imperfect competition.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Perfect competition has many small firms selling identical products with no barriers to entry (1); firms are price takers (1)","Imperfect competition (e.g. monopoly, oligopoly) has fewer firms, differentiated products and barriers to entry (1); firms have some control over price (1)"])),
 q("D004","D","D2 Demand","Give",2,"AO1","","Give two factors that influence demand for a product.","(2)","short",
   short_ms("Award 1 mark each.",["Affordability / income (1)","Availability of substitutes (1)","Level of GDP / economic conditions (1)","Consumer needs, tastes and aspirations (1)","Price of the product (1)"],"Award up to 2.")),
 q("D005","D","D2 Supply","Give",2,"AO1","","Give two factors that influence supply of a product.","(2)","short",
   short_ms("Award 1 mark each.",["Availability of raw materials (1)","Availability of labour (1)","Logistics / distribution (1)","Ability to produce profitably (1)","Competition for raw materials (1)","Government support (1)"],"Award up to 2.")),
 q("D006","D","D2 Elasticity","State",2,"AO1","","State what is meant by price elasticity of demand.","(2)","short",
   short_ms("Award 2.",["The responsiveness of quantity demanded to a change in price (2)"])),
 q("D007","D","D2 Elasticity","Explain",4,"AO2","","Explain the difference between price elastic and price inelastic demand.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Price elastic demand: a small price change causes a proportionally larger change in quantity demanded (1); e.g. luxury goods (1)","Price inelastic demand: a price change causes a proportionally smaller change in quantity demanded (1); e.g. necessities, few substitutes (1)"])),
 q("D008","D","D3 Pricing and output","Explain",4,"AO2","","Explain how market structure affects a firm's pricing and output decisions.","(4)","short",
   short_ms("Award 1+1. Max 4.",["In perfect competition firms are price takers (1) so they must accept the market price and produce at the market-clearing output (1)","In imperfect competition firms have pricing power (1) and can set prices above marginal cost, adjusting output to maximise profit (1)"])),
 q("D009","D","D3 Competitive response","Explain",4,"AO2","","Explain how a business might respond to a competitor cutting its prices.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Match the price cut to remain competitive (1) though this reduces profit margins (1)","Differentiate its product instead of cutting price (1) to maintain margins and avoid a price war (1)","Improve quality or service (1) to justify its higher price to customers (1)"])),
 q("D010","D","D1-D3 Markets","Evaluate",12,"AO3","BudgetAir Ltd operates in the highly competitive budget airline market, where several large firms dominate.","Evaluate the impact of market structure and demand/supply factors on BudgetAir Ltd's pricing and output decisions. (12)","(12)","extended_levels",
   lvl_ms("Levels-based, 4 levels.",
    ["Budget airline market is imperfect competition (oligopoly) — few dominant firms, differentiated by route/price","Demand is price elastic — consumers switch airlines for lower fares","Supply factors: fuel costs, aircraft availability, airport slots, staffing","Competitor pricing strongly influences BudgetAir's fares — must respond to rivals","Pricing: penetration/promotional fares to fill seats; output: capacity decisions on routes","Risks: price wars erode margins; fuel price volatility","Conclusion: in an oligopoly BudgetAir must price competitively and manage capacity/cost carefully"],
    levels4("Describes the market in basic terms; limited application.","Links market structure to pricing/output with some analysis.","Applies demand/supply and elasticity to evaluate decisions; balanced.","Thorough evaluation linking market structure, elasticity and cost factors; justified recommendations."))),
]

# ============ AIM E — Innovation and enterprise ============
aims["E"] = [
 q("E001","E","E1 Innovation","State",2,"AO1","","State what is meant by innovation in business.","(2)","short",
   short_ms("Award 2.",["The process of successfully developing and exploiting new ideas — new products, services, processes or ways of working that add value (2)"])),
 q("E002","E","E1 Enterprise","State",2,"AO1","","State what is meant by enterprise.","(2)","short",
   short_ms("Award 2.",["Identifying opportunities and taking initiative to develop business activities — e.g. through creative, lateral and 'blue sky' thinking (2)"])),
 q("E003","E","E1 Innovation types","Identify",2,"AO1","","Identify two ways a business can be innovative.","(2)","short",
   short_ms("Award 1 mark each.",["Product development (1)","Service development (1)","New processes to improve efficiency (1)","Adding value to existing products (1)","New ways to improve profitability (1)"],"Award up to 2.")),
 q("E004","E","E1 Enterprise thinking","Identify",2,"AO1","","Identify two approaches to creative thinking used in enterprise.","(2)","short",
   short_ms("Award 1 mark each.",["Creative thinking (1)","Lateral thinking (1)","'Blue sky' thinking (1)","Intuition (1)","Chance / serendipity (1)"],"Award up to 2.")),
 q("E005","E","E2 Benefits of innovation","Give",2,"AO1","","Give two benefits of innovation to a business.","(2)","short",
   short_ms("Award 1 mark each.",["Improved products and services (1)","Business growth (1)","New and niche markets (1)","Unique selling points (1)","Improved reputation (1)","Smarter working / efficiency (1)"],"Award up to 2.")),
 q("E006","E","E2 Risks of innovation","Give",2,"AO1","","Give two risks associated with innovation.","(2)","short",
   short_ms("Award 1 mark each.",["Failing to meet operational/commercial requirements (1)","Failing to achieve a return on investment (1)","Resistance to change (1)","Insufficient leadership support (1)","Cultural problems (1)"],"Award up to 2.")),
 q("E007","E","E1 Innovation and success","Explain",4,"AO2","","Explain how innovation contributes to business success.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Innovation differentiates a business from competitors (1) giving it a unique selling point and competitive edge (1)","Innovation can improve efficiency and reduce costs (1) boosting profitability (1)","New products open up new markets (1) driving growth (1)"])),
 q("E008","E","E2 Benefits and risks","Explain",4,"AO2","","Explain why innovation involves both benefits and risks.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Benefits include growth, improved products and reputation (1) which can increase revenue and market share (1)","Risks include high cost and uncertain return on investment (1) and resistance to change within the organisation (1)"])),
 q("E009","E","E2 Managing risk","Explain",4,"AO2","","Explain how a business could reduce the risk of resistance to change when introducing innovation.","(4)","short",
   short_ms("Award 1+1. Max 4.",["Communicate the benefits clearly and involve employees in the change (1) so they feel ownership and understand why it is happening (1)","Provide training and support (1) so employees have the skills to adapt (1)","Leadership commitment (1) shows the change is supported from the top (1)"])),
 q("E010","E","E1/E2 Innovation and enterprise","Evaluate",12,"AO3","FreshBite Ltd, a food manufacturer, is considering investing heavily in a new automated production line and a new range of plant-based products.","Evaluate the role of innovation and enterprise in FreshBite Ltd's future success, considering the benefits and risks. (12)","(12)","extended_levels",
   lvl_ms("Levels-based, 4 levels.",
    ["Benefits: new plant-based range opens a growing market; automation improves efficiency and reduces unit costs; USP and reputation boost","Risks: high capital cost with uncertain return on investment; automation may face employee resistance; plant-based demand may be overestimated","Enterprise: identifying the market opportunity for plant-based food shows entrepreneurial thinking","Balanced view: innovation is essential for competitiveness but must be managed","Risk mitigation: phased roll-out, market research, employee consultation, leadership support","Conclusion: innovation/enterprise are vital for growth but the investment must be carefully justified and managed"],
    levels4("Describes innovation/enterprise generically.","Identifies some benefits and risks with limited application to FreshBite.","Balanced evaluation of benefits vs risks in context; partial judgement.","Thorough evaluation linking enterprise and innovation to FreshBite's market; justified recommendation with risk management."))),
]

# Write aim files
for a, items in aims.items():
    with open(os.path.join(BASE, f"aim_{a}.json"), "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=1)

print("Written aim files:", list(aims.keys()), "with", {k: len(v) for k, v in aims.items()})
