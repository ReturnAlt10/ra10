# -*- coding: utf-8 -*-
"""BTEC Business Unit 2 expansion — batch 3 (final)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-2\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCD'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A (short recall) ============
add("A","A1 Role of marketing","Identify",2,"AO1","","Identify two types of market a business could target.","(2)","short",
    short_ms("Award 1 mark each.",["Mass market (1)","Niche market (1)"]))
add("A","A1 Marketing aims","Identify",2,"AO1","","Identify two marketing aims relating to customers.","(2)","short",
    short_ms("Award 1 mark each.",["Understanding customer wants and needs (1)","Increasing brand awareness and loyalty (1)","Satisfying customers (1)"],"Award up to 2."))
add("A","A1 Branding","State",2,"AO1","","State what is meant by a unique selling point (USP).","(2)","short",
    short_ms("Award 2.",["A feature or benefit that makes a product stand out from its competitors (2)"]))
add("A","A1 Market segmentation","Identify",2,"AO1","","Identify two demographic variables used to segment a market.","(2)","short",
    short_ms("Award 1 mark each.",["Age (1)","Gender (1)","Income (1)","Occupation (1)","Family size (1)"],"Award up to 2."))
add("A","A2 External influences","Identify",2,"AO1","","Identify two external influences on marketing activity.","(2)","short",
    short_ms("Award 1 mark each.",["Social (1)","Technological (1)","Economic (1)","Environmental (1)","Political (1)","Legal (1)","Ethical (1)"]))
add("A","A2 Internal influences","Identify",2,"AO1","","Identify two internal influences on marketing activity.","(2)","short",
    short_ms("Award 1 mark each.",["Cost of the campaign (1)","Availability of finance (1)","Expertise of staff (1)","Size of the business (1)","Culture of the business (1)"]))
add("A","A1 Types of market","State",2,"AO1","","State one advantage of a niche market.","(2)","short",
    short_ms("Award 2.",["Less competition, allowing the business to charge premium prices and build customer loyalty (1+1)"]))
add("A","A1 Types of market","State",2,"AO1","","State one advantage of a mass market.","(2)","short",
    short_ms("Award 2.",["Large number of customers allowing high sales volume and economies of scale (1+1)"]))
add("A","A1 Budget constraints","Explain",4,"AO2","","Explain how the cost of a campaign influences the choice of media.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Different media have different costs (1) e.g. TV is expensive, social media is cheaper (1)","A limited budget restricts the business to lower-cost media (1) such as social media or email marketing (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how changes in consumer lifestyles affect marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Changes in lifestyle (e.g. busier lives, health consciousness) shift customer needs (1) changing what products are demanded (1)","Businesses adapt marketing to these trends (1) e.g. promoting convenience or health benefits (1)"]))
add("A","A2 External influences","Analyse",4,"AO2","","Analyse how technological change can be both an opportunity and a threat to marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Technology creates opportunities (new channels, targeting, data) (1) enabling more effective marketing (1)","It is also a threat (1) as new digital competitors emerge and technology evolves quickly (1)"]))
add("A","A1/A2 Marketing","Evaluate",12,"AO3","TechTrek, a start-up selling smart fitness trackers, has a limited budget and must choose between targeting the mass market or a niche of serious athletes.","Evaluate whether TechTrek should target a mass market or a niche market. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Mass market: large customer base and high sales volume, but intense competition (Apple, Fitbit) and high marketing costs","Niche (serious athletes): less competition, premium pricing, loyal customers, but limited sales volume","TechTrek's limited budget favours a niche, where targeted marketing is affordable and effective","A niche allows TechTrek to build a strong brand and USP before expanding","But growth is capped in a niche; the mass market offers greater long-term potential","Segmentation and positioning are key either way","Conclusion: initially target the niche to build a foothold and brand, then consider expanding to the mass market later"],
    levels4("Describes mass vs niche generically.","Compares the two with partial application to TechTrek.","Balanced evaluation of both options against TechTrek's budget.","Thorough evaluation with a justified recommendation (e.g. niche first, then expand).")))

# ============ AIM B (short recall) ============
add("B","B2 Primary research","Identify",2,"AO1","","Identify two methods of primary research.","(2)","short",
    short_ms("Award 1 mark each.",["Survey/questionnaire (1)","Interview (1)","Observation (1)","Trials/test marketing (1)","Focus groups (1)"]))
add("B","B2 Secondary research","Identify",2,"AO1","","Identify two sources of secondary research.","(2)","short",
    short_ms("Award 1 mark each.",["Government statistics (1)","Trade journals (1)","Commercially published reports (1)","Media sources (1)","Internal sales records (1)"]))
add("B","B3 Product life cycle","Identify",2,"AO1","","Identify the four stages of the product life cycle.","(2)","short",
    short_ms("Award 1 mark per stage, up to 2.",["Introduction (1)","Growth (1)","Maturity (1)","Decline (1)"]))
add("B","B2 Quantitative/qualitative","State",2,"AO1","","State the difference between quantitative and qualitative data.","(2)","short",
    short_ms("Award 1+1.",["Quantitative: numerical data (1)","Qualitative: descriptive, non-numerical data about opinions/feelings (1)"]))
add("B","B1 Purpose of research","State",2,"AO1","","State two purposes of market research.","(2)","short",
    short_ms("Award 1 mark each.",["Identify target markets (1)","Identify market size, structure and trends (1)","Identify competition (1)"],"Award up to 2."))
add("B","B2 Primary research","Explain",4,"AO2","","Explain the disadvantages of using questionnaires.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Response rates can be low (1) so the sample may not be representative (1)","Questions may be misunderstood or answered carelessly (1) reducing the validity of the data (1)"]))
add("B","B2 Primary research","Explain",4,"AO2","","Explain the disadvantages of observation as a research method.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Observation only records behaviour, not the reasons behind it (1) so it cannot explain motivations (1)","It can be time-consuming and expensive (1) and people may change behaviour if they know they are watched (1)"]))
add("B","B2 Secondary research","Explain",4,"AO2","","Explain the advantages of using trade journals for research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Trade journals provide specialist, up-to-date industry information (1) relevant to the business's market (1)","They offer insight into trends, competitors and best practice (1) that general sources may miss (1)"]))
add("B","B2 Validity/reliability","Explain",4,"AO2","","Explain how bias can affect the reliability of research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Bias (e.g. leading questions, unrepresentative samples) distorts results (1) so they do not reflect the true population (1)","Biased research is unreliable (1) and can lead to poor decisions (1)"]))
add("B","B2 Appropriateness/currency/cost","Explain",4,"AO2","","Explain why research must be appropriate to the target market.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Research must use methods and questions suited to the target audience (1) e.g. appropriate language and channels (1)","Inappropriate research produces poor data (1) that does not reflect the customers' real views (1)"]))
add("B","B3 Product life cycle","Analyse",4,"AO2","","Analyse how the product life cycle can be used to decide when to launch a new product.","(4)","short",
    short_ms("Award 1+1. Max 4.",["If existing products are in decline, the business may need new products to replace them (1) (1)","Launching a new product during growth of the market captures rising demand (1) while launching in a saturated market is riskier (1)"]))
add("B","B1-B3 Research","Discuss",6,"AO3","A small café is deciding whether to introduce a loyalty scheme. It can conduct primary research (customer surveys) or use existing sales data.","Discuss the most appropriate research approach for the café. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Primary research (surveys) would directly reveal whether customers want a loyalty scheme","Secondary (sales data) shows current purchasing patterns but not customer opinions","Primary research is more specific but costs time and money; the café is small with limited budget","Sales data is cheap and readily available but does not explain motivations","A combination would be ideal: use sales data to understand patterns, then survey customers on the scheme","Conclusion: combine cheap secondary data with a small, targeted primary survey to inform the decision"],
    levels3("Describes the research options in basic terms.","Evaluates the two approaches with partial application.","Thoroughly evaluates and recommends a combined approach; justified conclusion.")))

# ============ AIM C (short recall) ============
add("C","C2 Pricing strategies","Identify",2,"AO1","","Identify two pricing strategies.","(2)","short",
    short_ms("Award 1 mark each.",["Penetration pricing (1)","Price skimming (1)","Competitor-based pricing (1)","Cost-plus pricing (1)"]))
add("C","C2 Marketing mix","Identify",2,"AO1","","Identify the four elements of the marketing mix (4Ps).","(2)","short",
    short_ms("Award 1 mark per element, up to 2.",["Product (1)","Price (1)","Place (1)","Promotion (1)"]))
add("C","C2 Extended mix","Identify",2,"AO1","","Identify the three additional elements of the extended marketing mix (7Ps).","(2)","short",
    short_ms("Award 1 mark each.",["People (1)","Physical environment (1)","Process (1)"]))
add("C","C2 Promotion","Identify",2,"AO1","","Identify two promotional methods.","(2)","short",
    short_ms("Award 1 mark each.",["Advertising (1)","Public relations (1)","Sponsorship (1)","Social media (1)","Guerrilla marketing (1)","Personal selling (1)","Product placement (1)"]))
add("C","C1 SWOT/PESTLE","State",2,"AO1","","State what SWOT analysis is used for.","(2)","short",
    short_ms("Award 2.",["To assess internal Strengths and Weaknesses and external Opportunities and Threats (2)"]))
add("C","C2 Pricing strategies","Explain",4,"AO2","","Explain what is meant by price skimming.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Price skimming sets a high initial price (1) to maximise profit from early adopters (1)","The price is lowered over time (1) as competition enters the market (1)"]))
add("C","C2 Pricing strategies","Explain",4,"AO2","","Explain what is meant by penetration pricing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Penetration pricing sets a low initial price (1) to attract customers quickly and gain market share (1)","The low price encourages trial and switching (1) before the price may rise later (1)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain the advantages of using social media in a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Social media is low-cost and highly targeted (1) allowing precise reach to specific audiences (1)","It enables two-way engagement and user-generated content (1) and its impact is easily measurable (1)"]))
add("C","C2 Place/distribution","Explain",4,"AO2","","Explain what is meant by an e-commerce distribution channel.","(4)","short",
    short_ms("Award 1+1. Max 4.",["E-commerce is selling products online through a website or app (1) rather than a physical store (1)","It offers convenience and wide reach (1) and lower overheads than physical retail (1)"]))
add("C","C3 Marketing campaign","Explain",4,"AO2","","Explain how a business decides how to allocate a campaign budget.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The budget is allocated based on the campaign's objectives and target audience (1) prioritising the media that best reaches them (1)","It balances cost against expected impact (1) so money is spent where it is most effective (1)"]))
add("C","C3 Marketing campaign","Explain",4,"AO2","","Explain the importance of reviewing a campaign part-way through.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A mid-campaign review checks progress against objectives (1) identifying what is working (1)","It allows adjustments to be made (1) improving results before the budget is fully spent (1)"]))
add("C","C4 Appropriateness","Explain",4,"AO2","","Explain how a campaign can be made appropriate for a younger audience.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Use media and channels younger audiences use (1) e.g. social media and video platforms (1)","Adopt a tone, style and message that resonates with them (1) and comply with rules on marketing to young people (1)"]))
add("C","C1-C4 Campaign","Evaluate",12,"AO3","A company is launching a premium coffee brand nationally. It has a substantial budget and must choose between a celebrity-endorsed TV campaign and a social media influencer campaign.","Evaluate the most appropriate campaign approach for the premium coffee brand. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Premium positioning suggests quality and status — celebrity endorsement can convey prestige","TV advertising reaches a mass national audience, fitting a substantial budget and national launch","Social media influencers offer targeted, authentic endorsement and are cheaper and more measurable","The target market matters: older premium coffee buyers may respond to TV, younger ones to influencers","A premium brand needs a consistent, aspirational message across media","Budget allows both — an integrated campaign could maximise reach and engagement","Conclusion: an integrated campaign combining TV (mass reach/prestige) with influencer marketing (engagement/authenticity) is most appropriate"],
    levels4("Describes the two options generically.","Compares options with partial application to the brand.","Balanced evaluation of both approaches against the brand and budget.","Thorough evaluation recommending an integrated approach with justification.")))

# ============ AIM D (short recall) ============
add("D","D1 Legal and ethical","Identify",2,"AO1","","Identify two legal considerations when marketing.","(2)","short",
    short_ms("Award 1 mark each.",["Truthful advertising (1)","Data protection (1)","Consumer protection (1)","Not misleading consumers (1)"]))
add("D","D1 Legal and ethical","Identify",2,"AO1","","Identify two ethical considerations when marketing.","(2)","short",
    short_ms("Award 1 mark each.",["Not targeting children inappropriately (1)","Accurate environmental claims (1)","Respect for privacy (1)","Fair treatment of vulnerable groups (1)"]))
add("D","D2 Evaluation","Identify",2,"AO1","","Identify two ways to evaluate a marketing campaign.","(2)","short",
    short_ms("Award 1 mark each.",["Compare against objectives (1)","Measure sales/revenue changes (1)","Measure ROI (1)","Customer feedback/surveys (1)","Web traffic/engagement metrics (1)"]))
add("D","D2 Evaluation","State",2,"AO1","","State why a marketing campaign should be evaluated.","(2)","short",
    short_ms("Award 2.",["To measure whether it achieved its objectives and to learn lessons for future campaigns (2)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain how customer feedback can be used to evaluate a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Customer feedback reveals how the campaign was received (1) and whether it changed perceptions or behaviour (1)","It provides qualitative insight (1) complementing sales data and highlighting areas to improve (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain why a business should measure return on investment (ROI).","(4)","short",
    short_ms("Award 1+1. Max 4.",["ROI shows whether the campaign generated more profit than it cost (1) indicating value for money (1)","A low or negative ROI means the campaign was not worthwhile (1) so future spending should be reconsidered (1)"]))
add("D","D2 Flexibility","Explain",4,"AO2","","Explain how a business can adapt a campaign when competitor activity increases.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Monitor competitor activity and its impact (1) then adjust the message, offer or media in response (1)","The business may strengthen its differentiation (1) or increase promotion to defend market share (1)"]))
add("D","D1/D2 Compliance and evaluation","Discuss",6,"AO3","A business's campaign for a weight-loss product has been criticised for making exaggerated claims about results.","Discuss the legal and ethical implications for the business and how it should respond. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Exaggerated claims may breach consumer protection and advertising law, risking fines and withdrawal of the campaign","Ethically, misleading vulnerable customers about weight loss is harmful and damages trust","The business's reputation and sales may suffer","It should substantiate or correct the claims, and apologise if they were misleading","Review internal processes to ensure future campaigns are truthful and compliant","Conclusion: the business must act quickly to correct the claims and restore trust, or face legal and reputational damage"],
    levels3("Identifies the legal/ethical issues in basic terms.","Explains implications and responses partially.","Thoroughly evaluates the implications and recommends corrective action.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U2 aim counts:", {k: len(v) for k, v in aims.items()})
print("U2 total:", sum(len(v) for v in aims.values()))
