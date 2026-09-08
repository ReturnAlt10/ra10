# -*- coding: utf-8 -*-
"""Generate BTEC Business Unit 2 (Developing a Marketing Campaign) data."""
import json, os

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-2\data"

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

aims["A"] = [
 q("A001","A","A1 Role of marketing","State",2,"AO1","","State the four principles of marketing (the four functions marketing performs).","(2)","short",
   short_ms("Award 1 mark each, up to 2.", ["Anticipating demand (1)","Recognising demand (1)","Stimulating demand (1)","Satisfying demand (1)"])),
 q("A002","A","A1 Marketing aims","Give",2,"AO1","","Give two marketing aims a business might set.","(2)","short",
   short_ms("Award 1 mark each, up to 2.", ["Understanding customer wants and needs (1)","Developing new products (1)","Improving profitability (1)","Increasing market share (1)","Diversification (1)","Increased brand awareness and loyalty (1)"])),
 q("A003","A","A1 Types of market","State",2,"AO1","","State the difference between a mass market and a niche market.","(2)","short",
   short_ms("Award 1+1.", ["Mass market: a large, broad market with many customers and similar needs (1)","Niche market: a small, specialised segment with specific needs (1)"])),
 q("A004","A","A1 Market segmentation","Identify",2,"AO1","","Identify two ways a market can be segmented.","(2)","short",
   short_ms("Award 1 mark each, up to 2.", ["Age (1)","Gender (1)","Income (1)","Lifestyle (1)","Geographic location (1)","Behaviour (1)","Psychographic (1)"])),
 q("A005","A","A1 Branding","State",2,"AO1","","State what is meant by a unique selling point (USP).","(2)","short",
   short_ms("Award 2.", ["A feature or benefit that makes a product stand out from its competitors (2)"])),
 q("A006","A","A1 Branding","Explain",4,"AO2","","Explain the difference between brand image and brand personality.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Brand image is how customers perceive the brand overall (1) based on their experiences and marketing (1)","Brand personality is the human characteristics associated with a brand (1) such as being fun, reliable or premium (1)"])),
 q("A007","A","A1 Budget constraints","Explain",4,"AO2","","Explain how the size of a business affects its marketing activity.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Larger businesses have bigger budgets (1) so can afford mass media advertising and specialist marketing staff (1)","Small businesses have limited budgets and fewer staff (1) so rely on cheaper, targeted marketing such as social media (1)"])),
 q("A008","A","A2 Internal influences","Identify",2,"AO1","","Identify two internal influences on marketing activity.","(2)","short",
   short_ms("Award 1 mark each.", ["Cost of the campaign (1)","Availability of finance (1)","Expertise of staff (1)","Size and culture of the business (1)"])),
 q("A009","A","A2 External influences","Identify",2,"AO1","","Identify two external influences on marketing activity.","(2)","short",
   short_ms("Award 1 mark each.", ["Social (1)","Technological (1)","Economic (1)","Environmental (1)","Political (1)","Legal (1)","Ethical (1)"])),
 q("A010","A","A2 External influences","Explain",4,"AO2","","Explain how technological change can influence marketing activity.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Digital and social media enable precise targeting and two-way communication (1) reaching customers cheaply and measurably (1)","E-commerce and mobile marketing create new channels (1) but require new skills and investment (1)"])),
 q("A011","A","A1/A2 Marketing principles","Discuss",6,"AO3","FreshFit is a small start-up selling a premium protein snack aimed at fitness enthusiasts. It has a limited budget.","Discuss the factors FreshFit should consider when developing its marketing approach. (6)","(6)","extended_levels",
   lvl_ms("Levels-based.",
    ["Small business: limited budget and few specialist staff","Niche market (fitness enthusiasts) — benefits from targeted, digital marketing","Branding: build a clear USP and personality to differentiate","External influences: social trends favour healthy eating; legal constraints on health claims","Budget constraints shape media choice — social media over TV","Conclusion: focus on targeted social/digital marketing to reach the niche efficiently"],
    levels3("Describes marketing principles in general terms.","Links internal (budget/size) and external factors to FreshFit's choices partially.","Thoroughly evaluates how size, market type and external forces shape the marketing approach; justified recommendation."))),
]

aims["B"] = [
 q("B001","B","B1 Purpose of research","State",2,"AO1","","State two purposes of market research.","(2)","short",
   short_ms("Award 1 mark each.", ["To identify target markets (1)","To identify size, structure and trends of the market (1)","To identify competition (1)"])),
 q("B002","B","B2 Primary research","Identify",2,"AO1","","Identify two methods of primary market research.","(2)","short",
   short_ms("Award 1 mark each.", ["Survey/questionnaire (1)","Interview (1)","Observation (1)","Trials (1)","Focus groups (1)"])),
 q("B003","B","B2 Secondary research","Identify",2,"AO1","","Identify two sources of secondary market research.","(2)","short",
   short_ms("Award 1 mark each.", ["Government statistics (1)","Trade journals (1)","Commercially published reports (1)","Media sources (1)","Internal sales records (1)","Loyalty card data (1)"])),
 q("B004","B","B2 Quantitative/qualitative","State",2,"AO1","","State the difference between quantitative and qualitative data.","(2)","short",
   short_ms("Award 1+1.", ["Quantitative: numerical data that can be measured and analysed statistically (1)","Qualitative: descriptive, non-numerical data about opinions and feelings (1)"])),
 q("B005","B","B2 Validity/reliability","Explain",4,"AO2","","Explain why market research must be valid and reliable.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Valid research measures what it claims to measure (1) so decisions are based on accurate information (1)","Reliable research gives consistent results when repeated (1) so the business can trust the findings (1)"])),
 q("B006","B","B2 Primary vs secondary","Explain",4,"AO2","","Explain one advantage and one disadvantage of primary research compared with secondary research.","(4)","short",
   short_ms("Award 1+1 each. Max 4.", ["Advantage: primary research is specific and up-to-date for the business's needs (1) whereas secondary may be outdated or generic (1)","Disadvantage: primary research is expensive and time-consuming to collect (1) whereas secondary is quick and cheap to obtain (1)"])),
 q("B007","B","B3 Product life cycle","Identify",2,"AO1","","Identify the stages of the product life cycle.","(2)","short",
   short_ms("Award 1 mark per stage, up to 2.", ["Introduction (1)","Growth (1)","Maturity (1)","Decline (1)"])),
 q("B008","B","B3 Product life cycle","Explain",4,"AO2","","Explain how marketing changes as a product moves from introduction to maturity.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["At introduction, marketing focuses on building awareness (1) often with heavy promotional spending (1)","At maturity, marketing focuses on differentiation and retaining market share (1) as competition is at its most intense (1)"])),
 q("B009","B","B1-B3 Research and rationale","Discuss",6,"AO3","BrewBeans, a coffee shop chain, is deciding whether to launch a new vegan breakfast range. It has gathered sales data, customer surveys and government health statistics.","Discuss how BrewBeans should use market research to decide whether to launch the vegan range. (6)","(6)","extended_levels",
   lvl_ms("Levels-based.",
    ["Use primary research (customer surveys) to identify demand and preferences","Use secondary research (government health statistics) to assess the trend towards vegan/healthy eating","Evaluate validity and reliability of each source","Identify target market and competition","Product life cycle: is the vegan trend growing or mature?","Conclusion: combine primary and secondary evidence to make a justified launch decision"],
    levels3("Describes research methods in basic terms.","Links research findings to the decision partially; considers validity.","Thoroughly evaluates the research evidence and makes a justified launch recommendation."))),
]

aims["C"] = [
 q("C001","C","C1 SWOT/PESTLE","State",2,"AO1","","State what SWOT analysis is used for in marketing planning.","(2)","short",
   short_ms("Award 2.", ["To assess internal Strengths and Weaknesses and external Opportunities and Threats to inform the marketing plan (2)"])),
 q("C002","C","C2 Pricing strategies","Identify",2,"AO1","","Identify two pricing strategies a business could use.","(2)","short",
   short_ms("Award 1 mark each.", ["Penetration pricing (1)","Price skimming (1)","Competitor-based pricing (1)","Cost-plus pricing (1)"])),
 q("C003","C","C2 Pricing strategies","Explain",4,"AO2","","Explain the difference between penetration pricing and price skimming.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Penetration pricing sets a low initial price to attract customers and gain market share quickly (1) suitable for mass markets with elastic demand (1)","Price skimming sets a high initial price to maximise profit from early adopters (1) before lowering it as competition increases (1)"])),
 q("C004","C","C2 Marketing mix","State",2,"AO1","","State the four elements of the marketing mix (the 4Ps).","(2)","short",
   short_ms("Award 1 mark per element, up to 2.", ["Product (1)","Price (1)","Place (1)","Promotion (1)"])),
 q("C005","C","C2 Extended mix","Identify",2,"AO1","","Identify the three additional elements of the extended marketing mix (the 7Ps).","(2)","short",
   short_ms("Award 1 mark each.", ["People (1)","Physical environment (1)","Process (1)"])),
 q("C006","C","C2 Promotion","Identify",2,"AO1","","Identify two promotional methods a business could use.","(2)","short",
   short_ms("Award 1 mark each.", ["Advertising (1)","Public relations (PR) (1)","Sponsorship (1)","Social media (1)","Guerrilla marketing (1)","Personal selling (1)","Product placement (1)","Digital marketing (1)"])),
 q("C007","C","C2 Place/distribution","Explain",4,"AO2","","Explain the difference between selling directly to customers and selling through retailers.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Direct selling (e.g. online) gives the business full control and higher margins (1) but requires its own distribution and customer service (1)","Selling through retailers reaches more customers (1) but the retailer takes a margin and the business loses some control (1)"])),
 q("C008","C","C3 Marketing campaign","Explain",4,"AO2","","Explain what should be included when planning the budget and timeline of a marketing campaign.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["The budget must be allocated across the chosen media and activities (1) and monitored to ensure value for money (1)","The timeline must schedule each activity with clear dates (1) and include monitoring points to track progress (1)"])),
 q("C009","C","C4 Appropriateness","Explain",4,"AO2","","Explain why a marketing campaign must be appropriate for its target market.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["The message and media must match the target market's preferences (1) otherwise the campaign will not reach or persuade them (1)","An appropriate campaign reinforces brand value and uses the budget efficiently (1) avoiding wasted spend on the wrong channels (1)"])),
 q("C010","C","C1-C4 Campaign development","Evaluate",12,"AO3","GlowUp, a skincare brand aimed at 16–24 year olds, is planning a new campaign with a budget of £50,000. It must choose between a social media influencer campaign and traditional TV advertising.","Evaluate the most appropriate marketing campaign for GlowUp. (12)","(12)","extended_levels",
   lvl_ms("Levels-based, 4 levels.",
    ["Target market (16-24) is highly active on social media — influencer campaign fits the medium","Budget £50,000: TV advertising is expensive and hard to target; social media is cheaper and measurable","SWOT: brand is new (weak awareness); opportunity in digital channels","Marketing mix: product (skincare), price (mid), place (online), promotion (influencer vs TV)","Social media allows engagement, user-generated content and precise targeting","TV reaches mass audience but not efficiently for a niche young demographic","Sustainability and flexibility: social campaigns can be adjusted in real time","Conclusion: influencer/social media campaign is more appropriate given the target market and budget"],
    levels4("Describes the two options in basic terms.","Applies SWOT and marketing mix with some linkage to GlowUp.","Balanced evaluation of both options against target market and budget.","Thorough evaluation justifying the most appropriate campaign with clear reasoning."))),
]

aims["D"] = [
 q("D001","D","Legal and ethical","State",2,"AO1","","State why marketing activity must comply with the law.","(2)","short",
   short_ms("Award 2.", ["To avoid misleading customers, protect consumers, and avoid legal penalties and reputational damage (2)"])),
 q("D002","D","Legal and ethical","Identify",2,"AO1","","Identify two legal or ethical considerations a business must take into account when marketing.","(2)","short",
   short_ms("Award 1 mark each.", ["Truthful advertising (1)","Data protection (1)","Not targeting children inappropriately (1)","Environmental claims must be accurate (1)","Respect for consumer privacy (1)"])),
 q("D003","D","Evaluation","Explain",4,"AO2","","Explain how a business can evaluate the success of a marketing campaign.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Measure against the campaign's aims and objectives (1) e.g. sales, awareness or market share changes (1)","Use metrics such as sales data, web traffic, engagement and return on investment (1) to judge effectiveness and inform future campaigns (1)"])),
 q("D004","D","Evaluation","Explain",4,"AO2","","Explain why a marketing campaign should be flexible.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Flexibility allows the campaign to respond to internal and external changes (1) such as competitor actions or economic shifts (1)","A flexible campaign can be adjusted mid-flight (1) to maximise effectiveness rather than sticking to an obsolete plan (1)"])),
 q("D005","D","Campaign development","Evaluate",12,"AO3","A marketing campaign for a new gym must balance a limited budget, a crowded competitive market and changing consumer fitness trends.","Evaluate how a business should plan, develop and adapt a marketing campaign in light of changing circumstances. (12)","(12)","extended_levels",
   lvl_ms("Levels-based, 4 levels.",
    ["Plan: set clear aims, research the market and competitors, allocate budget","Develop: choose marketing mix, message, media and timeline","Adapt: monitor performance and respond to changes (competitors, trends, economic conditions)","Use research data to identify the target market and refine the message","Sustainability and budget: prioritise cost-effective, measurable channels","Evaluation: measure against objectives and learn for future campaigns","Conclusion: an iterative, data-driven campaign that adapts to change is most effective"],
    levels4("Describes the campaign process generically.","Identifies planning/development/adaptation stages with partial application.","Balanced evaluation of how to adapt to changing circumstances.","Thorough evaluation of the full campaign cycle with justified, contextual recommendations."))),
]

for a, items in aims.items():
    with open(os.path.join(BASE, f"aim_{a}.json"), "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
print("U2 aims:", {k: len(v) for k, v in aims.items()})
