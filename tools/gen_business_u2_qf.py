# -*- coding: utf-8 -*-
"""Generate BTEC Business Unit 2 quiz + flashcards."""
import json, os

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-2\data"

def mcq(i, aim, topic, q, choices, correct, expl):
    return {"id": "Q%03d" % i, "learning_aim": aim, "topic": topic, "type": "mcq",
            "question": q, "choices": choices, "correct_index": correct, "explanation": expl}

quiz = [
 mcq(1,"A","Role of marketing","Marketing that anticipates, recognises, stimulates and satisfies demand describes:",["The role of marketing","Market research","The marketing mix","Pricing strategy"],0,"Marketing's principles are anticipating, recognising, stimulating and satisfying demand."),
 mcq(2,"A","Market types","A small, specialised segment of a market is called a:",["Mass market","Niche market","Global market","Free market"],1,"A niche market is a small, specialised segment with specific needs."),
 mcq(3,"A","Market types","A broad market with many customers and similar needs is a:",["Niche market","Mass market","Target market","Segmented market"],1,"A mass market is large and broad with many similar customers."),
 mcq(4,"A","Branding","A unique selling point (USP) is:",["The lowest price","A feature that makes a product stand out","A large marketing budget","The product's name"],1,"A USP is a feature/benefit that differentiates a product from competitors."),
 mcq(5,"A","Branding","'Brand personality' refers to:",["The logo design","Human characteristics associated with a brand","The company's profits","The product packaging"],1,"Brand personality is the human traits (e.g. fun, reliable) associated with a brand."),
 mcq(6,"A","Segmentation","Dividing a market by age, gender or income is called:",["Mass marketing","Market segmentation","Branding","Pricing"],1,"Segmentation divides a market into groups sharing characteristics."),
 mcq(7,"A","Influences","Which is an internal influence on marketing?",["Economic conditions","The business's budget","Legal changes","Social trends"],1,"Internal influences include the budget, finance, staff expertise and company size/culture."),
 mcq(8,"A","Influences","Which is an external influence on marketing?",["Company culture","Staff expertise","Technological change","Budget size"],2,"External influences include social, technological, economic, environmental, political, legal, ethical."),
 mcq(9,"B","Research","Research collected first-hand for a specific purpose is:",["Secondary research","Primary research","Internal research","Desk research"],1,"Primary research is collected directly from the original source for the specific purpose."),
 mcq(10,"B","Research","Government statistics are an example of:",["Primary research","Secondary research","Qualitative research","Observation"],1,"Government statistics are published secondary data."),
 mcq(11,"B","Research","Which is a primary research method?",["Trade journals","A customer survey","Government statistics","Media reports"],1,"Surveys, interviews, observation, trials and focus groups are primary methods."),
 mcq(12,"B","Data","Numerical data that can be measured is:",["Qualitative","Quantitative","Subjective","Anecdotal"],1,"Quantitative data is numerical; qualitative is descriptive."),
 mcq(13,"B","Data","Open-ended opinions and feelings are:",["Quantitative data","Qualitative data","Secondary data","Primary data"],1,"Qualitative data is descriptive, non-numerical (opinions, feelings)."),
 mcq(14,"B","Product life cycle","The stage where sales grow rapidly is:",["Introduction","Growth","Maturity","Decline"],1,"Growth is rapid sales increase after introduction."),
 mcq(15,"B","Product life cycle","At which stage is competition most intense?",["Introduction","Growth","Maturity","Decline"],2,"Maturity has the most intense competition as the market becomes saturated."),
 mcq(16,"C","Pricing","Setting a low initial price to gain market share is:",["Price skimming","Penetration pricing","Cost-plus pricing","Premium pricing"],1,"Penetration pricing uses a low initial price to attract customers quickly."),
 mcq(17,"C","Pricing","Setting a high initial price for a new product is:",["Penetration pricing","Price skimming","Competitor pricing","Cost-plus"],1,"Price skimming sets a high price to maximise profit from early adopters."),
 mcq(18,"C","Marketing mix","The 4Ps of the marketing mix are:",["Product, Price, People, Process","Product, Price, Place, Promotion","Price, Place, Promotion, Profit","Product, Profit, Place, Promotion"],1,"The 4Ps are Product, Price, Place and Promotion."),
 mcq(19,"C","Marketing mix","The extended marketing mix adds which three Ps?",["People, Process, Physical environment","Profit, Power, Price","Place, Product, Promotion","Planning, People, Profit"],0,"The 7Ps add People, Process and Physical environment."),
 mcq(20,"C","Promotion","Which is a promotional method?",["Cost-plus pricing","Sponsorship","Inventory control","Recruitment"],1,"Sponsorship, advertising, PR, social media and personal selling are promotion."),
 mcq(21,"C","Place","Selling directly to end users online is:",["A distribution channel","A pricing strategy","A promotional method","Market segmentation"],0,"Direct selling (mail/online/auction) is a place/distribution channel."),
 mcq(22,"C","Campaign","Which must be planned in a marketing campaign?",["Only the budget","Budget, timeline and media","Only the slogan","Only the product"],1,"A campaign needs budget, media selection, timeline and evaluation planned."),
 mcq(23,"D","Legal","Marketing claims must be:",["Exaggerated","Truthful and accurate","Misleading","Vague"],1,"Marketing must be truthful and accurate to comply with law and ethics."),
 mcq(24,"D","Evaluation","Evaluating a campaign should measure it against:",["The weather","Its aims and objectives","Competitor profits","Staff holidays"],1,"Success is measured against the campaign's aims and objectives."),
 mcq(25,"D","Flexibility","A marketing campaign should be flexible to:",["Avoid all planning","Respond to internal and external changes","Reduce costs to zero","Ignore competitors"],1,"Flexibility lets the campaign adapt to changing circumstances."),
]

flashcards = [
 {"id":"FC001","learning_aim":"A","topic":"Marketing principles","front":"What are the four principles/purposes of marketing?","back":"Anticipating demand, recognising demand, stimulating demand, satisfying demand.","tags":["marketing","principles"]},
 {"id":"FC002","learning_aim":"A","topic":"Market types","front":"Mass vs niche market?","back":"Mass = large broad market with many similar customers. Niche = small specialised segment with specific needs.","tags":["market"]},
 {"id":"FC003","learning_aim":"A","topic":"Branding","front":"What is a USP?","back":"A unique selling point — a feature/benefit that makes a product stand out from competitors.","tags":["branding","usp"]},
 {"id":"FC004","learning_aim":"A","topic":"Branding","front":"Brand image vs brand personality?","back":"Image = how customers perceive the brand. Personality = human characteristics associated with it.","tags":["branding"]},
 {"id":"FC005","learning_aim":"A","topic":"Segmentation","front":"Name ways to segment a market.","back":"Age, gender, income, lifestyle, geography, behaviour, psychographics.","tags":["segmentation"]},
 {"id":"FC006","learning_aim":"A","topic":"Influences","front":"Internal influences on marketing?","back":"Cost of campaign, availability of finance, staff expertise, size and culture of the business.","tags":["influences"]},
 {"id":"FC007","learning_aim":"A","topic":"Influences","front":"External influences on marketing?","back":"Social, technological, economic, environmental, political, legal, ethical.","tags":["influences"]},
 {"id":"FC008","learning_aim":"B","topic":"Research","front":"Primary vs secondary research?","back":"Primary = collected first-hand (surveys, interviews, observation, trials, focus groups). Secondary = existing data (government stats, trade journals, reports).","tags":["research"]},
 {"id":"FC009","learning_aim":"B","topic":"Data","front":"Quantitative vs qualitative data?","back":"Quantitative = numerical, measurable. Qualitative = descriptive opinions and feelings.","tags":["data"]},
 {"id":"FC010","learning_aim":"B","topic":"Validity","front":"Why must research be valid and reliable?","back":"Valid = measures what it claims. Reliable = consistent results when repeated. Both ensure trustworthy decisions.","tags":["research","validity"]},
 {"id":"FC011","learning_aim":"B","topic":"Product life cycle","front":"Stages of the product life cycle?","back":"Introduction, Growth, Maturity, Decline.","tags":["plc"]},
 {"id":"FC012","learning_aim":"C","topic":"Pricing","front":"Penetration vs skimming pricing?","back":"Penetration = low initial price to gain share. Skimming = high initial price for early adopters.","tags":["pricing"]},
 {"id":"FC013","learning_aim":"C","topic":"Marketing mix","front":"The 4Ps and 7Ps?","back":"4Ps: Product, Price, Place, Promotion. 7Ps add People, Process, Physical environment.","tags":["marketing mix"]},
 {"id":"FC014","learning_aim":"C","topic":"Promotion","front":"Name promotional methods.","back":"Advertising, PR, sponsorship, social media, guerrilla marketing, personal selling, product placement, digital marketing.","tags":["promotion"]},
 {"id":"FC015","learning_aim":"C","topic":"Place","front":"Distribution channels?","back":"Direct to end users (mail/online/auction), retailers, wholesalers.","tags":["place"]},
 {"id":"FC016","learning_aim":"D","topic":"Legal","front":"Why must marketing comply with the law?","back":"To avoid misleading customers, protect consumers, and avoid penalties and reputational damage.","tags":["legal","ethics"]},
 {"id":"FC017","learning_aim":"D","topic":"Evaluation","front":"How is a campaign evaluated?","back":"Measure against aims/objectives using sales, awareness, engagement and ROI metrics.","tags":["evaluation"]},
 {"id":"FC018","learning_aim":"D","topic":"Flexibility","front":"Why must a campaign be flexible?","back":"To respond to internal and external changes and adapt mid-flight for effectiveness.","tags":["flexibility"]},
]

with open(os.path.join(BASE, "quiz.json"), "w", encoding="utf-8") as f:
    json.dump(quiz, f, ensure_ascii=False, indent=1)
with open(os.path.join(BASE, "flashcards.json"), "w", encoding="utf-8") as f:
    json.dump(flashcards, f, ensure_ascii=False, indent=1)
print("U2 quiz", len(quiz), "flashcards", len(flashcards))
