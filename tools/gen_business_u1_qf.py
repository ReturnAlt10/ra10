# -*- coding: utf-8 -*-
"""Generate BTEC Business Unit 1 quiz + flashcards."""
import json, os

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-1\data"

def mcq(i, aim, topic, q, choices, correct, expl):
    return {"id": "Q%03d" % i, "learning_aim": aim, "topic": topic, "type": "mcq",
            "question": q, "choices": choices, "correct_index": correct, "explanation": expl}

quiz = [
 mcq(1,"A","Ownership","Which form of ownership gives owners limited liability?",["Private limited company (Ltd)","Sole trader","Partnership","None of these"],0,"Ltd and plc owners have limited liability; sole traders and partners have unlimited liability."),
 mcq(2,"A","Ownership","A sole trader has which type of liability?",["Limited","Unlimited","No liability","Partial"],1,"Sole traders have unlimited liability — personally responsible for all debts."),
 mcq(3,"A","Sectors","A car manufacturer operates in which sector?",["Primary","Secondary","Tertiary","Quaternary"],1,"Manufacturing (transforming raw materials into goods) is the secondary sector."),
 mcq(4,"A","Sectors","A bank providing financial services operates in which sector?",["Primary","Secondary","Tertiary","Quaternary"],2,"Providing services to customers is the tertiary sector."),
 mcq(5,"A","Size","A business with 7 employees is classed as:",["Small","Medium","Micro","Large"],2,"Micro businesses have up to 9 staff."),
 mcq(6,"A","Size","A business with more than 250 employees is classed as:",["Medium","Large","Small","Micro"],1,"Large businesses have more than 250 staff."),
 mcq(7,"A","Stakeholders","Which is an internal stakeholder?",["Supplier","Customer","Employee","Government"],2,"Employees are internal stakeholders; suppliers, customers and government are external."),
 mcq(8,"A","Stakeholders","Which is an external stakeholder?",["Manager","Owner","Employee","Pressure group"],3,"Pressure groups are external stakeholders."),
 mcq(9,"A","Communications","Which is a method of oral communication?",["Written report","Video conferencing","Email","Financial statement"],1,"Video conferencing is oral; reports/emails are written."),
 mcq(10,"A","Success","Which best explains a reason for business success?",["Having many competitors","Clear vision and strong leadership","Charging the highest price","Reducing staff numbers"],1,"Clear vision and strong leadership give direction and motivation."),
 mcq(11,"B","Structure","A structure with many layers of management is called:",["Flat","Matrix","Hierarchical","Holacratic"],2,"Hierarchical structures have many layers and a clear chain of command."),
 mcq(12,"B","Structure","A flat structure is characterised by:",["Many layers","Few layers","No managers","Tall chain of command"],1,"Flat structures have few layers and short chains of command."),
 mcq(13,"B","Functional areas","Which function is responsible for recruiting staff?",["Marketing","Finance","Human resources","Production"],2,"Human resources handles recruitment, training and employment."),
 mcq(14,"B","Functional areas","Which function manages the budget and financial records?",["HR","Finance","Sales","Customer service"],1,"The finance function manages money, budgets and accounts."),
 mcq(15,"B","Aims","Which is a typical aim of a private sector business?",["Providing free healthcare","Profit maximisation","Alleviating poverty","Value for money"],1,"Private businesses typically aim to make and maximise profit."),
 mcq(16,"B","Aims","Which is a typical aim of a not-for-profit organisation?",["Profit maximisation","Growth","Alleviating poverty","Market leadership"],2,"Not-for-profits aim for social goals such as alleviating poverty."),
 mcq(17,"B","SMART","In SMART objectives, 'M' stands for:",["Market","Measurable","Money","Management"],1,"M = Measurable — progress can be quantified."),
 mcq(18,"B","SMART","A SMART objective should be:",["Vague","Time-constrained","Impossible","Irrelevant"],1,"SMART objectives are Specific, Measurable, Achievable, Relevant, Time-constrained."),
 mcq(19,"C","PESTLE","PESTLE analysis examines:",["Only competitors","The external environment","Only internal factors","Only finance"],1,"PESTLE analyses Political, Economic, Social, Technological, Legal, Environmental factors."),
 mcq(20,"C","External","Rising inflation is which type of PESTLE factor?",["Social","Economic","Political","Technological"],1,"Inflation is an economic factor."),
 mcq(21,"C","External","An ageing population is which type of factor?",["Economic","Social","Legal","Environmental"],1,"Demographic change is a social factor."),
 mcq(22,"C","External","New data protection laws are which type of factor?",["Social","Technological","Legal","Economic"],2,"Laws and legislation are legal factors."),
 mcq(23,"C","CSR","Corporate social responsibility (CSR) means:",["Maximising profit at any cost","Acting ethically and considering social/environmental impact","Reducing product quality","Avoiding all regulation"],1,"CSR is acting ethically and considering wider social and environmental impact."),
 mcq(24,"C","Competitive advantage","Which gives a business a competitive advantage?",["Higher costs","Unique product differentiation","Worse customer service","Higher prices only"],1,"Differentiation creates a competitive advantage."),
 mcq(25,"C","SWOT","SWOT analysis assesses:",["Only strengths","Strengths, Weaknesses, Opportunities, Threats","Only external factors","Only financial data"],1,"SWOT = Strengths, Weaknesses (internal) and Opportunities, Threats (external)."),
 mcq(26,"D","Market structure","Perfect competition features:",["One dominant firm","Many firms selling identical products","No freedom of entry","Differentiated products"],1,"Perfect competition has many firms and homogeneous products."),
 mcq(27,"D","Market structure","A monopoly is an example of:",["Perfect competition","Imperfect competition","Free market","No market"],1,"A monopoly (one dominant firm) is imperfect competition."),
 mcq(28,"D","Demand","Which increases demand for a product?",["Rising price","Falling consumer income","A successful advertising campaign","Fewer substitutes"],2,"Advertising increases awareness and stimulates demand."),
 mcq(29,"D","Elasticity","Price elastic demand means:",["Quantity demanded barely changes with price","Quantity demanded changes proportionally more than price","Price never changes","Demand is fixed"],1,"Elastic demand: quantity demanded is highly responsive to price."),
 mcq(30,"D","Pricing","In perfect competition, firms are:",["Price makers","Price takers","Monopolies","Oligopolies"],1,"Firms in perfect competition are price takers."),
 mcq(31,"E","Innovation","Innovation in business means:",["Copying competitors","Successfully exploiting new ideas","Reducing staff","Cutting prices"],1,"Innovation is successfully developing and exploiting new ideas."),
 mcq(32,"E","Enterprise","'Blue sky' thinking means:",["Thinking without restrictions","Following rules strictly","Copying others","Avoiding risk"],0,"Blue sky thinking approaches ideas with no restrictions on perspective."),
 mcq(33,"E","Benefits","Which is a benefit of innovation?",["Higher costs","Unique selling points","More competitors","Slower production"],1,"Innovation creates USPs and differentiation."),
 mcq(34,"E","Risks","Which is a risk of innovation?",["Guaranteed profit","Failing to achieve return on investment","No resistance to change","Immediate success"],1,"Innovation risks failing to achieve a return on investment."),
 mcq(35,"E","Resistance","How can a business reduce resistance to change?",["Hide the change","Communicate benefits and involve staff","Ignore employees","Cut training"],1,"Communicating benefits and involving staff reduces resistance."),
]

flashcards = [
 {"id":"FC001","learning_aim":"A","topic":"Ownership","front":"What is limited liability?","back":"Owners' personal assets are protected; they only lose what they invested in the business. Applies to Ltd and plc companies.","tags":["ownership","liability"]},
 {"id":"FC002","learning_aim":"A","topic":"Ownership","front":"What is unlimited liability?","back":"Owners are personally responsible for all business debts. Applies to sole traders and (ordinary) partners.","tags":["ownership","liability"]},
 {"id":"FC003","learning_aim":"A","topic":"Sectors","front":"Name the four sectors of the economy.","back":"Primary (extraction), Secondary (manufacturing), Tertiary (services), Quaternary (knowledge/IT).","tags":["sectors"]},
 {"id":"FC004","learning_aim":"A","topic":"Size","front":"Define micro, small, medium and large businesses by staff numbers.","back":"Micro: up to 9; Small: 10–49; Medium: 50–249; Large: 250+.","tags":["size"]},
 {"id":"FC005","learning_aim":"A","topic":"Stakeholders","front":"What is a stakeholder?","back":"Any individual or group with an interest in, or influence over, a business's activities.","tags":["stakeholders"]},
 {"id":"FC006","learning_aim":"A","topic":"Stakeholders","front":"Give examples of internal vs external stakeholders.","back":"Internal: owners, managers, employees. External: suppliers, customers, lenders, government, community, pressure groups.","tags":["stakeholders"]},
 {"id":"FC007","learning_aim":"B","topic":"Structure","front":"What is a hierarchical structure?","back":"An organisation with many layers of management and a clear chain of command from top to bottom.","tags":["structure"]},
 {"id":"FC008","learning_aim":"B","topic":"Structure","front":"What is a flat structure?","back":"An organisation with few layers of management, wide spans of control and faster communication.","tags":["structure"]},
 {"id":"FC009","learning_aim":"B","topic":"Functional areas","front":"Name key functional areas of a business.","back":"HR, marketing, finance, production, sales, customer service, purchasing, R&D, IT, administration.","tags":["functions"]},
 {"id":"FC010","learning_aim":"B","topic":"SMART","front":"What does SMART stand for?","back":"Specific, Measurable, Achievable, Relevant, Time-constrained.","tags":["objectives","smart"]},
 {"id":"FC011","learning_aim":"C","topic":"PESTLE","front":"What does PESTLE stand for?","back":"Political, Economic, Social, Technological, Legal, Environmental.","tags":["pestle","environment"]},
 {"id":"FC012","learning_aim":"C","topic":"SWOT","front":"What does SWOT stand for?","back":"Strengths, Weaknesses, Opportunities, Threats.","tags":["swot","situational analysis"]},
 {"id":"FC013","learning_aim":"C","topic":"CSR","front":"What is corporate social responsibility (CSR)?","back":"A business's commitment to act ethically and consider its social and environmental impact beyond legal requirements.","tags":["csr","ethics"]},
 {"id":"FC014","learning_aim":"C","topic":"Competitive advantage","front":"Name factors that create competitive advantage.","back":"Differentiation, pricing, market leadership, reputation, market share, cost control, technology, relationships.","tags":["competition"]},
 {"id":"FC015","learning_aim":"D","topic":"Market structure","front":"Features of perfect competition?","back":"Many firms, freedom of entry, homogeneous products, firms are price takers.","tags":["market structure"]},
 {"id":"FC016","learning_aim":"D","topic":"Elasticity","front":"What is price elasticity of demand?","back":"The responsiveness of quantity demanded to a change in price.","tags":["elasticity","demand"]},
 {"id":"FC017","learning_aim":"D","topic":"Demand","front":"What influences demand?","back":"Affordability, competition, substitutes, GDP level, consumer needs and aspirations.","tags":["demand"]},
 {"id":"FC018","learning_aim":"E","topic":"Innovation","front":"What is innovation?","back":"Successfully developing and exploiting new ideas — new products, services, processes that add value and differentiate the business.","tags":["innovation"]},
 {"id":"FC019","learning_aim":"E","topic":"Enterprise","front":"What is enterprise?","back":"Identifying opportunities and taking initiative to develop business activities, using creative, lateral and 'blue sky' thinking.","tags":["enterprise"]},
 {"id":"FC020","learning_aim":"E","topic":"Benefits & risks","front":"Benefits and risks of innovation?","back":"Benefits: growth, new markets, USP, reputation. Risks: failing ROI, resistance to change, unsupportive leadership.","tags":["innovation","risk"]},
]

with open(os.path.join(BASE, "quiz.json"), "w", encoding="utf-8") as f:
    json.dump(quiz, f, ensure_ascii=False, indent=1)
with open(os.path.join(BASE, "flashcards.json"), "w", encoding="utf-8") as f:
    json.dump(flashcards, f, ensure_ascii=False, indent=1)
print("U1 quiz", len(quiz), "flashcards", len(flashcards))
