# -*- coding: utf-8 -*-
"""BTEC Business Unit 2 expansion — batch 2."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-2\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCD'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A ============
add("A","A1 Role of marketing","Identify",2,"AO1","","Identify the four functions/principles of marketing.","(2)","short",
    short_ms("Award 1 mark each, up to 2.",["Anticipating demand (1)","Recognising demand (1)","Stimulating demand (1)","Satisfying demand (1)"]))
add("A","A1 Role of marketing","Explain",4,"AO2","","Explain the principle of 'recognising demand'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Recognising demand means identifying existing customer needs and wants (1) through market research and observation (1)","It ensures the business understands what customers currently want (1) so it can offer the right products (1)"]))
add("A","A1 Marketing aims","Identify",2,"AO1","","Identify two marketing objectives a business might set.","(2)","short",
    short_ms("Award 1 mark each.",["Increase sales revenue (1)","Increase market share (1)","Improve brand awareness (1)","Launch a new product (1)","Improve customer loyalty (1)"],"Award up to 2."))
add("A","A1 Marketing aims","Explain",4,"AO2","","Explain the aim of 'developing new products'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Developing new products allows the business to meet changing customer needs (1) and enter new markets (1)","It keeps the product range fresh and competitive (1) driving growth and diversification (1)"]))
add("A","A1 Marketing aims","Explain",4,"AO2","","Explain the aim of 'diversification'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Diversification means entering new markets with new products (1) to spread risk across different markets (1)","It reduces reliance on one product or market (1) but carries higher risk as it moves into unfamiliar areas (1)"]))
add("A","A1 Marketing aims","Explain",4,"AO2","","Explain the aim of 'improving profitability'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Improving profitability means increasing profit relative to sales (1) through higher revenue or lower costs (1)","Effective marketing increases sales and allows premium pricing (1) improving profit margins (1)"]))
add("A","A1 Types of market","Explain",4,"AO2","","Explain how a business decides whether to target a mass or niche market.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The decision depends on the business's resources and the product (1) — mass markets need large budgets, niche markets suit smaller firms (1)","It also depends on competition and customer needs (1) — a crowded mass market may push a business towards a niche (1)"]))
add("A","A1 Market segmentation","Explain",4,"AO2","","Explain the benefits of market segmentation to a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Segmentation allows tailored marketing and products for each group (1) increasing relevance and effectiveness (1)","It helps identify underserved segments (1) and allocate the marketing budget more efficiently (1)"]))
add("A","A1 Market segmentation","Identify",2,"AO1","","Identify two ways a market can be segmented by behaviour.","(2)","short",
    short_ms("Award 1 mark each.",["Purchase frequency (1)","Brand loyalty (1)","Benefits sought (1)","Usage rate (1)"],"Award up to 2."))
add("A","A1 Branding","Explain",4,"AO2","","Explain how a business can build brand loyalty.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Consistently delivering quality and value (1) builds trust and repeat purchases (1)","Rewarding customers (e.g. loyalty schemes) and engaging with them (1) strengthens emotional attachment to the brand (1)"]))
add("A","A1 Branding","Explain",4,"AO2","","Explain the importance of a consistent brand image.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A consistent brand image makes the business recognisable (1) and builds customer trust and familiarity (1)","Inconsistency confuses customers and weakens the brand (1) reducing loyalty and the value of marketing (1)"]))
add("A","A1 Budget constraints","Explain",4,"AO2","","Explain how the size of a business affects its marketing budget.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Large businesses have greater revenue and resources (1) so can afford bigger marketing budgets and mass media (1)","Small businesses have limited funds (1) so must use cheaper, targeted marketing (1)"]))
add("A","A2 Internal influences","Explain",4,"AO2","","Explain how the culture of a business can support marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A customer-focused, innovative culture (1) encourages marketing that is responsive and creative (1)","When all staff understand and support the brand (1) marketing is more consistent and effective (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how technological change creates marketing opportunities.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Technology (e.g. social media, data analytics, e-commerce) enables new ways to reach and target customers (1) (1)","It allows personalised, measurable marketing (1) and direct engagement with customers (1)"]))
add("A","A2 External influences","Analyse",4,"AO2","","Analyse how a recession might affect a business's marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["In a recession consumer spending falls (1) so businesses may cut marketing budgets to save money (1)","However, maintaining marketing can protect market share (1) and position the business for recovery (1)"]))
add("A","A1/A2 Influences","Discuss",6,"AO3","BrightWear is a small clothing brand with a £15,000 marketing budget, targeting 16-30 year olds through social media. A large competitor has just launched a similar range.","Discuss the internal and external factors influencing BrightWear's marketing activity. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Internal: small size and £15,000 budget limit marketing to low-cost digital channels","Internal: limited staff expertise and no established brand","External: social trends favour social media for 16-30 year olds; technological change enables cheap targeting","External: the new competitor increases competitive pressure","BrightWear should differentiate its brand and use social media to build a community","Conclusion: internal constraints push BrightWear towards digital marketing, which is well matched to its young target market and the social/technological environment"],
    levels3("Identifies some internal/external factors.","Links factors to BrightWear's choices partially.","Thoroughly evaluates the factors and reaches a justified conclusion.")))

# ============ AIM B ============
add("B","B1 Purpose of research","Explain",4,"AO2","","Explain why a business researches its target market.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Researching the target market identifies who the customers are and what they want (1) (1)","This enables the business to tailor its products and marketing (1) to meet their specific needs (1)"]))
add("B","B1 Purpose of research","Identify",2,"AO1","","Identify two purposes of market research.","(2)","short",
    short_ms("Award 1 mark each.",["Identify target markets (1)","Identify market size, structure and trends (1)","Identify competition (1)","Reduce risk of decisions (1)"],"Award up to 2."))
add("B","B2 Primary research","Explain",4,"AO2","","Explain the advantages of interviews as a primary research method.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Interviews provide detailed, in-depth responses (1) allowing the researcher to probe and clarify (1)","They capture rich qualitative information (1) revealing attitudes and motivations (1)"]))
add("B","B2 Primary research","Explain",4,"AO2","","Explain the advantages of trials (test marketing) as primary research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Trials test the product in a real market (1) providing evidence of actual demand before full launch (1)","They reduce the risk of failure (1) by revealing problems early (1)"]))
add("B","B2 Primary research","Explain",4,"AO2","","Explain the disadvantages of interviews as a research method.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Interviews are time-consuming and expensive (1) so sample sizes are usually small (1)","Responses can be influenced by the interviewer (1) reducing objectivity and reliability (1)"]))
add("B","B2 Secondary research","Explain",4,"AO2","","Explain the advantages of using internal sales data for research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Internal sales data is already collected, so it is quick and cheap to access (1) (1)","It reflects the business's actual customers (1) revealing buying patterns and trends (1)"]))
add("B","B2 Secondary research","Explain",4,"AO2","","Explain the disadvantages of secondary research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Secondary data may be outdated (1) and not specific to the business's current needs (1)","It may not be directly comparable (1) or the business has no control over how it was gathered (1)"]))
add("B","B2 Secondary research","Explain",4,"AO2","","Explain how loyalty card data can be used in market research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Loyalty card data records what customers actually buy (1) revealing purchasing habits and preferences (1)","It can be used to segment customers and personalise offers (1) improving marketing effectiveness (1)"]))
add("B","B2 Quantitative/qualitative","Explain",4,"AO2","","Explain when a business should use quantitative research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Quantitative research is used when numerical data is needed (1) e.g. to measure market size or how many customers prefer a feature (1)","It suits large samples where statistical analysis can identify trends (1) and support decisions with hard numbers (1)"]))
add("B","B2 Quantitative/qualitative","Explain",4,"AO2","","Explain when a business should use qualitative research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Qualitative research is used when in-depth understanding is needed (1) e.g. why customers feel a certain way (1)","It suits exploring attitudes, motivations and new ideas (1) where numbers alone are insufficient (1)"]))
add("B","B2 Validity/reliability","Explain",4,"AO2","","Explain how the size of a sample affects the reliability of research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A larger sample is more likely to be representative (1) so results are more reliable and generalisable (1)","A small sample may be unrepresentative (1) producing unreliable results (1)"]))
add("B","B2 Validity/reliability","Explain",4,"AO2","","Explain how leading questions can reduce the validity of a survey.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Leading questions push respondents towards a particular answer (1) so they do not measure true opinions (1)","This biases the results and reduces validity (1) making the findings misleading (1)"]))
add("B","B2 Appropriateness","Explain",4,"AO2","","Explain why research methods must be appropriate to the research question.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Different questions need different methods (1) e.g. numerical questions need quantitative methods (1)","Using an inappropriate method produces irrelevant or unusable data (1) wasting the research budget (1)"]))
add("B","B3 Product life cycle","Explain",4,"AO2","","Explain how the product life cycle helps a business plan marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The product life cycle shows the stage a product is at (1) which determines the appropriate marketing strategy (1)","Marketing differs by stage (1) e.g. heavy promotion at introduction, differentiation at maturity (1)"]))
add("B","B3 Product life cycle","Explain",4,"AO2","","Explain how pricing changes across the product life cycle.","(4)","short",
    short_ms("Award 1+1. Max 4.",["At introduction, prices may be high (skimming) or low (penetration) depending on strategy (1) (1)","At maturity, competition forces prices down (1); at decline, prices fall further to clear stock (1)"]))
add("B","B3 Product life cycle","Explain",4,"AO2","","Explain how promotional spending changes across the product life cycle.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Promotional spending is highest at introduction to build awareness (1) and during growth to attract new customers (1)","It falls at maturity as the product is established (1) and is minimal at decline (1)"]))
add("B","B1-B3 Rationale","Discuss",6,"AO3","A business has collected primary data from a customer survey (sample of 50) and secondary data from a two-year-old industry report. It must decide whether to launch a new product.","Discuss the reliability of this research and whether it is sufficient to justify the launch decision. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Primary survey data is current and specific but the sample of 50 is small and may be unrepresentative","The secondary industry report is comprehensive but two years old and may be outdated","The validity and reliability of each source should be assessed","A small, potentially biased sample reduces confidence in the findings","The business should consider a larger sample or additional primary research","Conclusion: the research provides useful insight but is not sufficient alone; more robust, current data is needed before a major launch decision"],
    levels3("Describes the data sources in basic terms.","Evaluates reliability/currency with partial application.","Thoroughly assesses the research's sufficiency and reaches a justified conclusion.")))

# ============ AIM C ============
add("C","C1 Marketing campaign","Explain",4,"AO2","","Explain the importance of setting SMART objectives for a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["SMART objectives provide clear, measurable targets (1) against which the campaign's success can be judged (1)","They focus the campaign and resources (1) and enable evaluation at the end (1)"]))
add("C","C1 SWOT","Explain",4,"AO2","","Explain how SWOT analysis informs a marketing campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["SWOT identifies strengths to build on and weaknesses to address (1) and opportunities to exploit and threats to counter (1)","It provides a clear picture of the situation (1) guiding the campaign's focus and message (1)"]))
add("C","C2 Pricing strategies","Explain",4,"AO2","","Explain the advantages of cost-plus pricing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Cost-plus pricing is simple to calculate (1) and guarantees a profit margin on each unit (1)","It ensures costs are covered (1) making it suitable for businesses needing a predictable margin (1)"]))
add("C","C2 Pricing strategies","Explain",4,"AO2","","Explain the disadvantages of cost-plus pricing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Cost-plus ignores demand and competitor prices (1) so the price may be too high or too low for the market (1)","It may not maximise profit (1) and can make the business uncompetitive (1)"]))
add("C","C2 Pricing strategies","Explain",4,"AO2","","Explain the advantages of competitor-based pricing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Competitor-based pricing keeps the business competitive (1) as prices match or undercut rivals (1)","It is simple and low-risk (1) particularly in markets where customers compare prices (1)"]))
add("C","C2 Pricing strategies","Explain",4,"AO2","","Explain the disadvantages of competitor-based pricing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Following competitors ignores the business's own costs (1) and may lead to prices that do not cover them (1)","It discourages differentiation (1) and can trigger damaging price wars (1)"]))
add("C","C2 Marketing mix","Explain",4,"AO2","","Explain how the marketing mix elements must be consistent with each other.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The four Ps must align (1) e.g. a premium product needs a premium price and appropriate place/promotion (1)","Inconsistent elements confuse customers and weaken the brand (1) reducing the campaign's effectiveness (1)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain what is meant by sponsorship as a promotional method.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Sponsorship is paying to associate the brand with an event, team or individual (1) e.g. a sports team or festival (1)","It builds brand awareness and positive associations (1) by linking the brand to something customers value (1)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain what is meant by guerrilla marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Guerrilla marketing uses unconventional, low-cost, creative tactics (1) to generate attention and word-of-mouth (1)","It suits small budgets (1) and aims to create memorable, shareable experiences (1)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain what is meant by personal selling.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Personal selling is direct, one-to-one selling (1) where a salesperson interacts with the customer (1)","It allows tailored persuasion and relationship-building (1) but is expensive per contact (1)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain what is meant by product placement.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Product placement is featuring a product within media content (1) e.g. in films or TV programmes (1)","It gives the product subtle exposure (1) associated with the content's characters and context (1)"]))
add("C","C2 Place/distribution","Explain",4,"AO2","","Explain the advantages of selling through retailers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Retailers provide access to their existing customer base and locations (1) increasing the product's reach (1)","They handle storage, display and selling (1) reducing the producer's distribution burden (1)"]))
add("C","C2 Place/distribution","Explain",4,"AO2","","Explain the disadvantages of selling through retailers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Retailers take a margin, reducing the producer's profit per unit (1) (1)","The producer loses some control over pricing and presentation (1) and depends on the retailer's performance (1)"]))
add("C","C3 Marketing campaign","Explain",4,"AO2","","Explain the importance of a realistic budget in a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A realistic budget ensures the campaign can actually be delivered (1) without overspending (1)","It forces prioritisation of activities (1) so money is spent where it has most impact (1)"]))
add("C","C3 Marketing campaign","Explain",4,"AO2","","Explain the importance of a timeline in a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A timeline schedules activities with clear dates (1) ensuring the campaign runs to plan (1)","It coordinates the different elements (1) and includes monitoring points to track progress (1)"]))
add("C","C4 Appropriateness","Explain",4,"AO2","","Explain why a campaign should be cost-effective.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A cost-effective campaign achieves its objectives within budget (1) giving good value for money (1)","Wasteful spending reduces profit and return on investment (1) so the budget must be used efficiently (1)"]))
add("C","C4 Appropriateness","Explain",4,"AO2","","Explain how a business ensures a campaign reflects its brand value.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The campaign's message, tone and visuals must match the brand's identity and values (1) (1)","This consistency reinforces what the brand stands for (1) and strengthens customer trust (1)"]))
add("C","C1-C4 Campaign","Discuss",6,"AO3","A local bakery wants to promote a new vegan range to health-conscious customers in its area, on a small budget.","Discuss how the bakery should plan an appropriate marketing campaign for the vegan range. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Set clear objectives (e.g. raise awareness of the vegan range) and identify the target market (health-conscious local customers)","Use situational analysis (SWOT) to inform the campaign","Choose an appropriate marketing mix: product (vegan range), price, place (the shop + local delivery), promotion (social media, local PR)","Small budget means prioritising low-cost, targeted promotion","Ensure the message is appropriate and reflects the bakery's values","Conclusion: a focused, local, social-media-led campaign emphasising the health/ethical benefits is most appropriate"],
    levels3("Describes campaign elements in basic terms.","Applies the marketing mix to the vegan range partially.","Thoroughly evaluates an appropriate, budget-conscious campaign; justified approach.")))

# ============ AIM D ============
add("D","D1 Legal and ethical","Identify",2,"AO1","","Identify two pieces of legislation that affect marketing.","(2)","short",
    short_ms("Award 1 mark each.",["Consumer Protection from Unfair Trading Regulations (1)","Data Protection Act / GDPR (1)","Advertising Standards rules (ASA) (1)","Trade Descriptions Act (1)"],"Award up to 2."))
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain the role of the Advertising Standards Authority (ASA).","(4)","short",
    short_ms("Award 1+1. Max 4.",["The ASA regulates advertising in the UK (1) ensuring ads are legal, decent, honest and truthful (1)","It can require ads to be withdrawn or amended (1) protecting consumers from misleading marketing (1)"]))
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain what is meant by 'consumer protection' in marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Consumer protection laws prevent businesses from misleading or exploiting customers (1) e.g. through false claims or unfair practices (1)","They give consumers rights (1) and hold businesses accountable for honest marketing (1)"]))
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain the ethical issue of targeting vulnerable groups in marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Targeting vulnerable groups (e.g. children, the elderly, those in debt) with persuasive marketing is unethical (1) as they may not make fully informed choices (1)","Ethical businesses avoid exploiting vulnerability (1) protecting their reputation and following regulations (1)"]))
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain the consequences for a business of breaching marketing law.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Breaching marketing law can result in fines and legal action (1) and forced withdrawal of the campaign (1)","It damages the business's reputation and customer trust (1) reducing sales and long-term success (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain why a business should evaluate a campaign against pre-set objectives.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Pre-set objectives provide a clear benchmark (1) to judge whether the campaign succeeded (1)","Without objectives, evaluation is subjective (1) and cannot measure real performance (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain how sales data can be used to evaluate a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Comparing sales before, during and after the campaign (1) shows its impact on revenue (1)","Sales data reveals whether the campaign converted awareness into purchases (1) and met sales targets (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain the difference between qualitative and quantitative measures of campaign success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Quantitative measures use numbers (1) e.g. sales, traffic, conversions (1)","Qualitative measures capture opinions and perceptions (1) e.g. customer feedback and brand sentiment (1)"]))
add("D","D2 Flexibility","Explain",4,"AO2","","Explain how a business can make a campaign flexible without abandoning its objectives.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The business keeps its core objectives but adjusts the tactics (1) e.g. changing media or message while keeping the goal (1)","It builds in review points to decide changes (1) ensuring flexibility is focused on achieving objectives (1)"]))
add("D","D2 Evaluation","Analyse",6,"AO3","After a campaign, a business finds sales rose 12% but the campaign cost £60,000, and customer feedback was mixed.","Analyse whether the campaign was successful. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Sales rose 12%, suggesting the campaign increased demand","But the £60,000 cost must be weighed against the profit generated — calculate ROI","Mixed customer feedback suggests the campaign engaged some customers but not others","Consider whether the 12% sales rise meets the original objectives","Evaluate brand impact as well as sales (reputation, awareness)","Conclusion: the campaign had a positive sales effect, but success depends on ROI and whether objectives were met; mixed feedback should be investigated"],
    levels3("Describes the outcome in basic terms.","Considers sales vs cost and feedback partially.","Balanced analysis of sales, cost, ROI and feedback; justified conclusion on success.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U2 aim counts:", {k: len(v) for k, v in aims.items()})
print("U2 total:", sum(len(v) for v in aims.values()))
