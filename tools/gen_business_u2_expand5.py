# -*- coding: utf-8 -*-
"""BTEC Business Unit 2 expansion — batch 5 (final)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-2\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCD'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

add("A","A1 Role of marketing","State",2,"AO1","","State two principles of marketing.","(2)","short",
    short_ms("Award 1 mark each.",["Anticipating demand (1)","Recognising demand (1)","Stimulating demand (1)","Satisfying demand (1)"]))
add("A","A1 Market segmentation","Explain",4,"AO2","","Explain why segmentation makes marketing more cost-effective.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Segmentation lets the business focus its marketing on the most relevant customers (1) avoiding waste on those unlikely to buy (1)","Targeted marketing converts better (1) giving a higher return on the marketing spend (1)"]))
add("A","A1 Branding","Explain",4,"AO2","","Explain how a USP supports premium pricing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A USP makes the product distinct and hard to substitute (1) reducing price sensitivity (1)","Customers will pay more for a unique benefit (1) so the business can charge a premium price (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how changes in legislation can affect marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["New legislation (e.g. advertising, data protection) changes the rules marketing must follow (1) (1)","Businesses must adapt their campaigns to comply (1) or face penalties (1)"]))
add("A","A2 External influences","Analyse",4,"AO2","","Analyse how competitor actions influence a business's marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Competitor actions (new products, price cuts, campaigns) force a business to respond (1) to protect market share (1)","The business may adjust its pricing, promotion or differentiation (1) in reaction to rivals (1)"]))
add("A","A1/A2 Influences","Evaluate",12,"AO3","EcoWear, a sustainable fashion start-up, must develop its marketing with a small budget while facing strong environmental (demand for sustainability) and legal (green claims) pressures.","Evaluate the internal and external factors influencing EcoWear's marketing activity. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Internal: small budget and size limit marketing to low-cost digital channels","Internal: limited staff expertise and an unestablished brand","External: strong environmental/social trend favours sustainability — a key opportunity","External: legal rules require truthful environmental claims, constraining the message","External: ethical considerations reinforce the need for authentic sustainability","EcoWear should leverage its sustainability USP through authentic, low-cost social media marketing","Conclusion: internal constraints push EcoWear towards digital marketing, while external factors both support (demand) and constrain (regulation) its message"],
    levels4("Describes the factors generically.","Links internal/external factors to EcoWear partially.","Balanced evaluation of the factors.","Thorough evaluation with a justified marketing approach.")))

add("B","B2 Primary research","Explain",4,"AO2","","Explain the advantages of test marketing (trials).","(4)","short",
    short_ms("Award 1+1. Max 4.",["Test marketing launches the product in a limited area first (1) to gauge real demand (1)","It reveals problems and customer reactions (1) before a costly full launch (1)"]))
add("B","B2 Secondary research","Explain",4,"AO2","","Explain how media sources can be used in market research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Media sources (news, articles, industry press) provide current market information (1) and commentary on trends (1)","They help the business understand the market environment (1) at little or no cost (1)"]))
add("B","B2 Validity/reliability","Explain",4,"AO2","","Explain the difference between validity and reliability.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Validity is whether the research measures what it claims to (1) (1)","Reliability is whether it produces consistent results when repeated (1) (1)"]))
add("B","B2 Quantitative/qualitative","State",2,"AO1","","State one advantage of quantitative data.","(2)","short",
    short_ms("Award 2.",["It is objective and can be analysed statistically to identify trends (1+1)"]))
add("B","B2 Quantitative/qualitative","State",2,"AO1","","State one advantage of qualitative data.","(2)","short",
    short_ms("Award 2.",["It provides depth and insight into opinions and motivations (1+1)"]))
add("B","B3 Product life cycle","State",2,"AO1","","State what the product life cycle shows.","(2)","short",
    short_ms("Award 2.",["The stages a product passes through from introduction to decline, and the associated sales and profit patterns (2)"]))
add("B","B1-B3 Rationale","Discuss",6,"AO3","A business must choose between buying an expensive, detailed commercial market report or conducting its own cheaper online survey.","Discuss which research option the business should choose. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["The commercial report is detailed and professionally researched but expensive and may be general","The online survey is cheaper and specific to the business's needs but requires effort and may have a small sample","The decision depends on budget, the need for specificity, and time available","For specific, product-level questions, the survey is more useful","For broad market context, the report may be better value","Conclusion: if the business needs specific customer insight, the survey is preferable; the report suits broad market understanding"],
    levels3("Describes the two options in basic terms.","Evaluates them with partial application.","Thoroughly evaluates and recommends based on needs; justified conclusion.")))

add("C","C1 SWOT/PESTLE","State",2,"AO1","","State what PESTLE analysis examines.","(2)","short",
    short_ms("Award 2.",["The external environment: Political, Economic, Social, Technological, Legal and Environmental factors (2)"]))
add("C","C2 Pricing strategies","State",2,"AO1","","State what cost-plus pricing is.","(2)","short",
    short_ms("Award 2.",["Adding a fixed mark-up to the cost of producing the product to set the selling price (2)"]))
add("C","C2 Pricing strategies","State",2,"AO1","","State what competitor-based pricing is.","(2)","short",
    short_ms("Award 2.",["Setting prices based on what competitors charge for similar products (2)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain the role of promotion in the marketing mix.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Promotion communicates the product's benefits to customers (1) raising awareness and interest (1)","It persuades customers to buy (1) and reinforces the brand's image (1)"]))
add("C","C2 Place/distribution","Explain",4,"AO2","","Explain the role of place in the marketing mix.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Place ensures the product is available where and when customers want to buy (1) through appropriate distribution channels (1)","Good placement maximises convenience and reach (1) supporting sales (1)"]))
add("C","C3 Marketing campaign","Explain",4,"AO2","","Explain why a campaign needs clear aims before it is developed.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Clear aims define what the campaign is trying to achieve (1) so all activity is focused (1)","They provide the basis for evaluating success (1) and allocating the budget (1)"]))
add("C","C4 Appropriateness","Analyse",4,"AO2","","Analyse how brand value influences the appropriateness of a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A campaign must reflect the brand's value/positioning (1) e.g. a luxury brand needs a premium campaign (1)","A mismatch between campaign and brand value confuses customers (1) and weakens the brand (1)"]))
add("C","C1-C4 Campaign","Discuss",6,"AO3","A start-up app developer must launch a new fitness app with £20,000. It is choosing between influencer marketing and paid online advertising.","Discuss the most appropriate promotional approach for the app launch. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Influencer marketing builds trust and reaches a targeted fitness audience authentically","Paid online advertising offers precise targeting and measurable reach","With £20,000, a mix may be possible but budget is limited","Influencers suit a start-up needing credibility and word-of-mouth","Paid ads can scale quickly but are less authentic","Conclusion: for a start-up with limited budget, influencer marketing is likely more effective for building trust, possibly combined with some targeted paid ads"],
    levels3("Describes the two approaches in basic terms.","Compares them with partial application.","Thoroughly evaluates and recommends; justified conclusion.")))

add("D","D1 Legal and ethical","State",2,"AO1","","State one reason marketing must comply with the law.","(2)","short",
    short_ms("Award 2.",["To protect consumers from misleading or unfair practices and to avoid fines and reputational damage (1+1)"]))
add("D","D2 Evaluation","State",2,"AO1","","State two measures of a campaign's success.","(2)","short",
    short_ms("Award 1 mark each.",["Sales/revenue increase (1)","Return on investment (1)","Brand awareness (1)","Market share (1)","Engagement metrics (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain the importance of setting measurable objectives for evaluation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Measurable objectives allow actual performance to be compared against targets (1) (1)","Without them, it is impossible to objectively judge success (1) or calculate ROI (1)"]))
add("D","D2 Flexibility","Explain",4,"AO2","","Explain how digital campaigns can be more flexible than traditional media.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Digital campaigns can be changed almost instantly (1) in response to performance data (1)","Traditional media (e.g. TV, print) are harder to adjust once booked (1) making them less flexible (1)"]))
add("D","D1/D2 Development","Discuss",6,"AO3","A business's campaign underperformed: sales were flat and ROI was negative, though brand awareness rose.","Discuss how the business should evaluate and respond to this outcome. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Flat sales and negative ROI mean the campaign did not convert awareness into purchases","Rising brand awareness is positive but not enough on its own","Analyse why conversion failed — message, offer, targeting or media?","Review against original objectives to judge overall success","Adjust or replace the campaign based on the findings","Conclusion: the campaign needs reworking to improve conversion; awareness alone does not justify the cost"],
    levels3("Describes the outcome in basic terms.","Analyses the mismatch between awareness and sales partially.","Thoroughly evaluates and recommends corrective action; justified conclusion.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U2 aim counts:", {k: len(v) for k, v in aims.items()})
print("U2 total:", sum(len(v) for v in aims.values()))
