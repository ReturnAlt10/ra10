# -*- coding: utf-8 -*-
"""BTEC Business Unit 2 expansion — batch 4 (final push past 300)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-2\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCD'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A ============
add("A","A1 Role of marketing","Explain",4,"AO2","","Explain why marketing is important to a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Marketing identifies and communicates with customers (1) so the business can sell its products (1)","It drives demand and builds the brand (1) contributing directly to revenue and growth (1)"]))
add("A","A1 Role of marketing","Explain",4,"AO2","","Explain how marketing helps a business meet customer needs.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Marketing researches what customers need and want (1) so products can be developed to match (1)","It communicates the product's benefits (1) so customers understand how their needs are met (1)"]))
add("A","A1 Marketing aims","Explain",4,"AO2","","Explain why marketing aims should be linked to overall business aims.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Marketing aims support the business's overall goals (1) e.g. a growth aim needs marketing to increase sales (1)","Aligned aims ensure marketing effort contributes to success (1) rather than working at cross-purposes (1)"]))
add("A","A1 Market segmentation","Explain",4,"AO2","","Explain how income can be used to segment a market.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Income segmentation divides customers by their earnings/spending power (1) (1)","It helps target products at the right price point (1) e.g. premium products at high-income segments (1)"]))
add("A","A1 Branding","Explain",4,"AO2","","Explain the difference between a brand and a product.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A product is the tangible good or service offered (1); a brand is the identity, name and image that distinguishes it (1)","The brand adds emotional value and recognition (1) beyond the functional product itself (1)"]))
add("A","A1 Branding","Analyse",4,"AO2","","Analyse how a strong brand benefits a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A strong brand builds loyalty and repeat purchases (1) reducing the need to compete purely on price (1)","It supports premium pricing and differentiation (1) protecting market share and profit (1)"]))
add("A","A2 Internal influences","Explain",4,"AO2","","Explain how a lack of finance can restrict marketing activity.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Without finance the business cannot afford expensive media or agencies (1) restricting the reach of marketing (1)","It may have to rely on free or low-cost methods (1) such as social media and word-of-mouth (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how changes in interest rates can affect marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Higher interest rates reduce consumer disposable income (1) lowering demand and spending (1)","Businesses may shift marketing to emphasise value and affordability (1) to appeal to price-conscious customers (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how cultural factors influence marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Culture shapes values, tastes and buying behaviour (1) which vary between regions and countries (1)","Marketing must be adapted to cultural norms (1) to avoid offence and resonate with the audience (1)"]))
add("A","A1/A2 Principles","Discuss",6,"AO3","A business is deciding whether to invest in a large-scale TV advertising campaign or a series of targeted social media campaigns for its new product aimed at young adults.","Discuss which marketing approach is more appropriate for this product. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Young adults are heavy users of social media, making targeted campaigns highly relevant","Social media is cheaper, more measurable and allows precise targeting of the demographic","TV advertising offers broad reach but is expensive and poorly targeted for young adults","The product and budget also matter — a mass product may justify TV","Social media allows two-way engagement and user-generated content","Conclusion: targeted social media campaigns are more appropriate for a product aimed at young adults"],
    levels3("Describes the two approaches in basic terms.","Compares them with partial application to the product.","Thoroughly evaluates appropriateness for the target market; justified conclusion.")))

# ============ AIM B ============
add("B","B1 Purpose of research","Explain",4,"AO2","","Explain how market research reduces the risk of business decisions.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Market research provides evidence about customers and the market (1) reducing uncertainty (1)","Better information leads to better decisions (1) lowering the risk of launching products that fail (1)"]))
add("B","B2 Primary research","Explain",4,"AO2","","Explain the advantages of online surveys for market research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Online surveys are cheap and can reach a large sample quickly (1) across a wide geographic area (1)","Data is collected automatically and is easy to analyse (1) saving time and cost (1)"]))
add("B","B2 Secondary research","Explain",4,"AO2","","Explain the advantages of commercially published market reports.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Commercially published reports provide detailed, professionally researched market data (1) often not available elsewhere (1)","They save time (1) as the research has already been conducted (1)"]))
add("B","B2 Secondary research","Explain",4,"AO2","","Explain the disadvantages of commercially published reports.","(4)","short",
    short_ms("Award 1+1. Max 4.",["They are expensive to purchase (1) and may be out of date or too general (1)","They may not match the business's specific needs (1) reducing their usefulness (1)"]))
add("B","B2 Quantitative/qualitative","Explain",4,"AO2","","Explain how a business can combine quantitative and qualitative research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Quantitative research measures how many/what proportion (1); qualitative explains why (1)","Using both gives numbers plus understanding (1) providing a complete picture for decisions (1)"]))
add("B","B2 Validity/reliability","Explain",4,"AO2","","Explain how to improve the reliability of a survey.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Use a large, representative sample (1) so results can be generalised (1)","Use clear, unbiased questions (1) and consistent administration so the survey would give similar results if repeated (1)"]))
add("B","B2 Appropriateness/currency/cost","Explain",4,"AO2","","Explain the relationship between cost and sample size in market research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Larger samples cost more to survey (1) so businesses must balance sample size against budget (1)","A bigger sample improves reliability (1) but the business must decide how much accuracy it can afford (1)"]))
add("B","B3 Product life cycle","Explain",4,"AO2","","Explain why a business monitors where its products are in the product life cycle.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Knowing the stage helps the business plan appropriate marketing and investment (1) for each product (1)","It signals when to refresh or withdraw products (1) to manage the product portfolio profitably (1)"]))
add("B","B3 Product life cycle","Explain",4,"AO2","","Explain how competition changes across the product life cycle.","(4)","short",
    short_ms("Award 1+1. Max 4.",["At introduction there is little competition (1); competitors enter during growth as the market expands (1)","Competition is most intense at maturity (1) and falls at decline as firms exit (1)"]))
add("B","B1-B3 Rationale","Discuss",6,"AO3","A business gathered primary data (focus groups with 12 customers) and secondary data (a recent government report). It must decide whether the evidence supports launching a product.","Discuss how the business should use this evidence to justify its decision. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Focus groups provide rich qualitative insight but a sample of 12 is small and may be unrepresentative","The government report is reliable and recent but general, not product-specific","The business should assess validity, reliability and currency of each source","Combining the two gives both depth and breadth","More primary research may be needed to confirm the focus group findings","Conclusion: the evidence is useful but the small sample limits confidence; additional research is recommended before a major decision"],
    levels3("Describes the evidence in basic terms.","Evaluates the sources' strengths/weaknesses partially.","Thoroughly assesses sufficiency of evidence; justified conclusion.")))

# ============ AIM C ============
add("C","C1 SWOT/PESTLE","Explain",4,"AO2","","Explain what the 'T' in SWOT stands for and give an example.","(4)","short",
    short_ms("Award 1+1. Max 4.",["'T' stands for Threats — external factors that could harm the business (1) (1)","Example: a new competitor entering the market or rising costs (1) which the business should prepare for (1)"]))
add("C","C1 SWOT/PESTLE","Explain",4,"AO2","","Explain what the 'O' in SWOT stands for and give an example.","(4)","short",
    short_ms("Award 1+1. Max 4.",["'O' stands for Opportunities — external factors the business could exploit (1) (1)","Example: a growing market segment or new technology (1) that the business could take advantage of (1)"]))
add("C","C1 Target market","Explain",4,"AO2","","Explain how a business identifies its target market.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Through market research and segmentation (1) identifying groups with similar needs and characteristics (1)","The business selects the segment(s) most likely to buy its product (1) and matches its marketing to them (1)"]))
add("C","C2 Pricing strategies","Analyse",4,"AO2","","Analyse the factors a business should consider when setting a price.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Costs — the price must cover costs to be profitable (1) (1)","Demand and elasticity — how price affects sales (1)","Competition — the price must be competitive with rivals (1)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain the role of sales promotion in the marketing mix.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Sales promotion uses short-term incentives (1) e.g. discounts, coupons, competitions to boost sales (1)","It stimulates immediate purchase (1) and can attract new or price-sensitive customers (1)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain the difference between advertising and public relations.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Advertising is paid, controlled promotion (1) where the business decides the message and placement (1)","PR seeks unpaid media coverage and manages the brand's image (1) which the business does not directly control (1)"]))
add("C","C2 Place/distribution","Explain",4,"AO2","","Explain the factors a business considers when choosing a distribution channel.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The type of product and target market (1) determine whether direct, retail or online distribution is best (1)","Cost, control and reach (1) influence the choice between channels (1)"]))
add("C","C3 Marketing campaign","Explain",4,"AO2","","Explain how a business develops the message for a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The message is built around the product's USP and the target market's needs (1) (1)","It must be clear, memorable and consistent with the brand (1) to persuade the audience effectively (1)"]))
add("C","C4 Appropriateness","Explain",4,"AO2","","Explain the consequences of an inappropriate marketing campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An inappropriate campaign wastes the budget (1) as it fails to reach or persuade the target market (1)","It can damage the brand's reputation (1) and reduce sales and customer trust (1)"]))
add("C","C1-C4 Campaign","Discuss",6,"AO3","A fashion retailer is planning a summer campaign and must decide its message, media and budget allocation.","Discuss the key factors the retailer should consider when planning this campaign. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Set clear objectives and identify the target market for the summer campaign","Use SWOT/PESTLE to understand the internal and external situation","Develop a clear message around the USP that appeals to the target market","Choose media that reach the target audience within budget (e.g. social media, influencers)","Allocate the budget across media, monitoring and contingency","Ensure the campaign is appropriate, on-brand and flexible","Conclusion: planning should balance clear objectives, an appropriate message/media, and realistic budget allocation"],
    levels3("Lists campaign planning factors in basic terms.","Explains message/media/budget with partial application.","Thoroughly evaluates the planning factors; justified approach.")))

# ============ AIM D ============
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain the importance of obtaining consent before using customer data for marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Consent is required by data protection law (1) before personal data can be used for marketing (1)","Obtaining consent builds trust (1) and avoids fines and complaints (1)"]))
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain what is meant by 'greenwashing' in marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Greenwashing is making misleading or exaggerated environmental claims (1) to appear more eco-friendly than the business really is (1)","It is unethical and often illegal (1) and damages trust when exposed (1)"]))
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain why a business should market its products ethically even when not legally required to.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Ethical marketing builds long-term trust and reputation (1) which legal compliance alone does not guarantee (1)","Unethical but legal marketing can still damage the brand (1) and drive customers away (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain how a business decides whether to repeat a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Evaluate whether the campaign met its objectives and delivered a positive ROI (1) (1)","If it succeeded and the market context is unchanged, repeating makes sense (1); if not, the business should revise the approach (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain how brand awareness can be measured after a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Brand awareness can be measured through surveys (1) asking the target audience if they recognise the brand (1)","Digital metrics (search volume, social media mentions, reach) (1) also indicate awareness levels (1)"]))
add("D","D2 Flexibility","Explain",4,"AO2","","Explain the importance of contingency planning in a marketing campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Contingency plans prepare for unexpected events (1) e.g. a supplier failing or a media channel underperforming (1)","Having backups reduces disruption (1) and keeps the campaign on track (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain how a business can improve future campaigns using evaluation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Evaluation identifies strengths to repeat and weaknesses to fix (1) (1)","These lessons inform the next campaign's planning (1) making it more effective and better value (1)"]))
add("D","D1/D2 Development","Evaluate",12,"AO3","A business ran a campaign that increased sales but received complaints about a misleading claim, and its data collection did not obtain proper consent.","Evaluate the success of this campaign and the actions the business should take. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["The campaign increased sales, which is positive and suggests effective promotion","However, the misleading claim breaches advertising law and damages trust","Improper data consent breaches GDPR, risking fines","Legal/ethical failures undermine the campaign's apparent success and harm reputation","Immediate actions: correct/withdraw the claim, apologise, and fix data consent processes","Longer term: strengthen compliance procedures and review marketing approval processes","Conclusion: the campaign is not a true success — sales gains are overshadowed by legal/ethical breaches that must be remedied urgently"],
    levels4("Describes the outcome in basic terms.","Identifies the legal/ethical issues with partial analysis.","Balanced evaluation weighing sales gains against compliance failures.","Thorough evaluation with justified corrective and preventative actions.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U2 aim counts:", {k: len(v) for k, v in aims.items()})
print("U2 total:", sum(len(v) for v in aims.values()))
