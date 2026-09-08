# -*- coding: utf-8 -*-
"""BTEC Business Unit 2 (Developing a Marketing Campaign) expansion — batch 1."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-2\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCD'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A — Principles and purposes of marketing ============
add("A","A1 Role of marketing","Define",2,"AO1","","Define the term 'marketing'.","(2)","short",
    short_ms("Award 2.",["The process of anticipating, recognising, stimulating and satisfying customer demand for goods and services (2)"]))
add("A","A1 Principles","Explain",4,"AO2","","Explain the principle of 'anticipating demand'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Anticipating demand means forecasting what customers will want in the future (1) using market research and trend analysis (1)","It allows the business to develop products before demand arises (1) gaining a competitive advantage (1)"]))
add("A","A1 Principles","Explain",4,"AO2","","Explain the principle of 'stimulating demand'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Stimulating demand means using promotion and advertising to make customers aware of and want a product (1) persuading them to buy (1)","It increases sales by creating desire (1) through marketing communications (1)"]))
add("A","A1 Principles","Explain",4,"AO2","","Explain the principle of 'satisfying demand'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Satisfying demand means meeting customers' needs and expectations (1) with products and service that deliver value (1)","Satisfied customers become loyal and make repeat purchases (1) sustaining the business (1)"]))
add("A","A1 Marketing aims","Explain",4,"AO2","","Explain the aim of 'increasing market share'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Market share is the business's proportion of total sales in a market (1); increasing it means selling more relative to competitors (1)","Higher market share can bring economies of scale and pricing power (1) strengthening the business's position (1)"]))
add("A","A1 Marketing aims","Explain",4,"AO2","","Explain the aim of 'increased brand awareness and loyalty'.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Brand awareness means customers recognise and remember the brand (1); loyalty means they keep buying it (1)","Higher awareness and loyalty lead to repeat purchases and lower price sensitivity (1) improving long-term sales (1)"]))
add("A","A1 Types of market","Explain",4,"AO2","","Explain one advantage and one disadvantage of targeting a mass market.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: a mass market has many customers (1) allowing high sales volume and economies of scale (1)","Disadvantage: intense competition (1) and high marketing costs to reach such a broad audience (1)"]))
add("A","A1 Types of market","Explain",4,"AO2","","Explain one advantage and one disadvantage of targeting a niche market.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: less competition and loyal customers (1) allow premium pricing (1)","Disadvantage: limited number of customers (1) restricts sales volume and growth potential (1)"]))
add("A","A1 Market segmentation","Explain",4,"AO2","","Explain the purpose of market segmentation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Market segmentation divides the market into groups of customers with similar characteristics/needs (1) e.g. by age, income or lifestyle (1)","It allows the business to target marketing and products at specific segments (1) making marketing more effective and efficient (1)"]))
add("A","A1 Market segmentation","Explain",4,"AO2","","Explain how a business could segment a market by demographic factors.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Demographic segmentation divides by characteristics such as age, gender, income, occupation or family size (1) (1)","These factors affect buying behaviour and needs (1) so segments can be targeted with tailored marketing (1)"]))
add("A","A1 Market segmentation","Explain",4,"AO2","","Explain how a business could segment a market by psychographic factors.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Psychographic segmentation divides by lifestyle, attitudes, values and interests (1) rather than just demographics (1)","It groups customers by how they think and live (1) enabling marketing that appeals to their values (1)"]))
add("A","A1 Market segmentation","Explain",4,"AO2","","Explain how a business could segment a market geographically.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Geographic segmentation divides by location (1) e.g. region, country, urban/rural or climate (1)","Different locations have different needs and preferences (1) so products and marketing can be adapted to each area (1)"]))
add("A","A1 Branding","Define",2,"AO1","","Define the term 'brand image'.","(2)","short",
    short_ms("Award 2.",["The overall perception customers have of a brand, based on their experiences and the business's marketing (2)"]))
add("A","A1 Branding","Define",2,"AO1","","Define the term 'brand personality'.","(2)","short",
    short_ms("Award 2.",["The set of human characteristics associated with a brand (e.g. fun, reliable, premium) that makes it distinctive (2)"]))
add("A","A1 Branding","Explain",4,"AO2","","Explain why branding is important to a business.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A strong brand differentiates the business from competitors (1) and builds customer recognition and loyalty (1)","Branding adds value and allows premium pricing (1) increasing revenue and protecting market position (1)"]))
add("A","A1 Branding","Explain",4,"AO2","","Explain how a USP helps a business compete.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A USP makes the product stand out from competitors (1) giving customers a clear reason to choose it (1)","It supports differentiation and premium pricing (1) and forms the basis of the marketing message (1)"]))
add("A","A1 Budget constraints","Explain",4,"AO2","","Explain how the availability of finance affects marketing activity.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The finance available sets the marketing budget (1) determining which media and activities the business can afford (1)","Limited finance restricts marketing to cheaper methods (1) such as social media rather than TV advertising (1)"]))
add("A","A1 Budget constraints","Explain",4,"AO2","","Explain how the expertise of staff affects marketing activity.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Skilled marketing staff can plan and run effective campaigns (1) using specialist knowledge and techniques (1)","Lack of expertise limits the quality of marketing (1) and may require outsourcing at extra cost (1)"]))
add("A","A1 Budget constraints","Explain",4,"AO2","","Explain how the culture of a business affects its marketing activity.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An innovative, customer-focused culture supports bold, creative marketing (1) that responds quickly to customers (1)","A cautious or rigid culture may resist new marketing ideas (1) limiting the campaign's creativity and reach (1)"]))
add("A","A2 Internal influences","Explain",4,"AO2","","Explain how the cost of a campaign affects marketing decisions.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The cost of different media and activities (1) determines what is affordable within the budget (1)","Businesses must choose the marketing mix that gives the best value (1) balancing cost against likely effectiveness (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how social factors influence marketing activity.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Social factors such as demographics, lifestyles and cultural trends shape what customers want (1) and how they respond to marketing (1)","Businesses must adapt their marketing to social changes (1) e.g. promoting healthy or sustainable products (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how economic factors influence marketing activity.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Economic conditions (e.g. recession, inflation, interest rates) affect consumer income and spending (1) changing demand (1)","Businesses adjust their marketing (e.g. price promotions in a downturn) (1) to respond to changing affordability (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how environmental factors influence marketing activity.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Growing environmental awareness means customers increasingly prefer sustainable products (1) so marketing emphasises eco-credentials (1)","Environmental regulations also affect what businesses can claim (1) requiring honest, compliant marketing (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how political factors influence marketing activity.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Government policy (e.g. taxation, subsidies, trade rules) affects costs and consumer spending (1) changing the marketing environment (1)","Political stability and regulation shape business confidence (1) and the rules marketing must follow (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how legal factors influence marketing activity.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Laws (e.g. advertising standards, consumer protection, data protection) set rules marketing must follow (1) to avoid misleading customers (1)","Businesses must ensure campaigns are legal (1) or risk fines and reputational damage (1)"]))
add("A","A2 External influences","Explain",4,"AO2","","Explain how ethical factors influence marketing activity.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Ethical considerations (e.g. honest claims, fair treatment, not exploiting vulnerable groups) (1) guide responsible marketing (1)","Unethical marketing damages reputation and trust (1) so businesses market ethically to protect their brand (1)"]))
add("A","A1/A2 Marketing principles","Evaluate",12,"AO3","FreshStart is a small new business selling reusable water bottles to environmentally-conscious consumers. It has a small budget and no established brand.","Evaluate the factors FreshStart should consider when developing its marketing approach. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Small budget and no brand mean FreshStart must prioritise low-cost, targeted marketing","Niche market (environmentally-conscious consumers) is well suited to digital/social media marketing","External influences: strong social and environmental trends support demand for reusable bottles","Branding: FreshStart must build a clear USP and eco-friendly brand personality to differentiate","Legal/ethical: environmental claims must be truthful and compliant","Internal: limited staff expertise and finance constrain the marketing mix","Segmentation: target by lifestyle/values (psychographic) rather than mass advertising","Conclusion: focused digital/social marketing with a strong eco USP is most appropriate given the budget and niche"],
    levels4("Describes marketing principles generically.","Links internal/external factors to FreshStart partially.","Balanced evaluation of influences and appropriate marketing approach.","Thorough evaluation recommending a specific, justified marketing approach.")))

# ============ AIM B — Information for the rationale ============
add("B","B1 Purpose of research","Explain",4,"AO2","","Explain why a business researches the size and structure of its market.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Knowing the market size shows the potential sales available (1) and whether the market is worth entering (1)","Understanding market structure (competitors, segments) (1) helps the business position itself and plan (1)"]))
add("B","B1 Purpose of research","Explain",4,"AO2","","Explain why a business researches its competition.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Researching competitors identifies their strengths, weaknesses and strategies (1) so the business can differentiate itself (1)","It reveals gaps in the market and pricing/quality benchmarks (1) informing the business's own positioning (1)"]))
add("B","B2 Primary research","Explain",4,"AO2","","Explain the advantages of using a survey/questionnaire for primary research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Surveys can collect data from a large sample quickly (1) at relatively low cost (1)","They provide quantifiable data (1) that can be analysed to identify patterns in customer views (1)"]))
add("B","B2 Primary research","Explain",4,"AO2","","Explain the advantages of using focus groups for market research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Focus groups provide in-depth qualitative insights (1) into customer attitudes, feelings and motivations (1)","The discussion can explore issues in depth (1) revealing information a questionnaire might miss (1)"]))
add("B","B2 Primary research","Explain",4,"AO2","","Explain the advantages of using observation for market research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Observation records actual customer behaviour (1) rather than what customers say they do (1)","It can reveal genuine buying habits and store behaviour (1) providing accurate, objective data (1)"]))
add("B","B2 Primary research","Explain",4,"AO2","","Explain one advantage and one disadvantage of primary research.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: primary research is specific and up-to-date for the business's needs (1) and the data is owned by the business (1)","Disadvantage: it is expensive and time-consuming to collect (1) and sample size may be small (1)"]))
add("B","B2 Secondary research","Explain",4,"AO2","","Explain the advantages of using government statistics for market research.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Government statistics are reliable, comprehensive and usually free (1) covering large populations (1)","They provide objective data on demographics and the economy (1) useful for sizing the market (1)"]))
add("B","B2 Secondary research","Explain",4,"AO2","","Explain one advantage and one disadvantage of secondary research.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: secondary research is quick and cheap to obtain (1) as the data already exists (1)","Disadvantage: it may be outdated or not specific to the business's needs (1) and the business has no control over how it was collected (1)"]))
add("B","B2 Secondary research","Identify",2,"AO1","","Identify two internal sources of secondary data.","(2)","short",
    short_ms("Award 1 mark each.",["Sales records (1)","Loyalty card data (1)","Customer database (1)","Website analytics (1)","Previous market research (1)"],"Award up to 2."))
add("B","B2 Quantitative/qualitative","Explain",4,"AO2","","Explain one advantage and one disadvantage of quantitative data.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: quantitative data is objective and can be analysed statistically (1) to identify trends and make comparisons (1)","Disadvantage: it does not explain the reasons behind behaviour (1) or capture feelings and opinions (1)"]))
add("B","B2 Quantitative/qualitative","Explain",4,"AO2","","Explain one advantage and one disadvantage of qualitative data.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: qualitative data provides depth and insight into opinions and motivations (1) explaining why customers behave as they do (1)","Disadvantage: it is subjective and harder to analyse or generalise (1) and usually comes from smaller samples (1)"]))
add("B","B2 Validity/reliability","Define",2,"AO1","","Define the term 'validity' in market research.","(2)","short",
    short_ms("Award 2.",["The extent to which the research measures what it is intended to measure (2)"]))
add("B","B2 Validity/reliability","Define",2,"AO1","","Define the term 'reliability' in market research.","(2)","short",
    short_ms("Award 2.",["The extent to which the research produces consistent results when repeated (2)"]))
add("B","B2 Validity/reliability","Explain",4,"AO2","","Explain why the sample used in market research must be representative.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A representative sample reflects the characteristics of the target population (1) so results can be generalised (1)","If the sample is biased or unrepresentative (1) the findings will be misleading (1)"]))
add("B","B2 Appropriateness/currency/cost","Explain",4,"AO2","","Explain why market research data must be current.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Markets and customer preferences change over time (1) so old data may no longer reflect reality (1)","Using outdated data can lead to wrong decisions (1) so research should be recent and regularly updated (1)"]))
add("B","B2 Appropriateness/currency/cost","Explain",4,"AO2","","Explain how the cost of research affects the methods a business chooses.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Businesses have limited research budgets (1) so must choose methods that give the best value (1)","Cheaper methods (e.g. secondary data, online surveys) (1) may be used when funds are limited (1)"]))
add("B","B3 Product life cycle","Explain",4,"AO2","","Explain the characteristics of the introduction stage of the product life cycle.","(4)","short",
    short_ms("Award 1+1. Max 4.",["At introduction, sales are low and grow slowly (1) as customers learn about the new product (1)","Costs are high (launch, promotion) and profits are negative (1) as the business invests to build awareness (1)"]))
add("B","B3 Product life cycle","Explain",4,"AO2","","Explain the characteristics of the growth stage of the product life cycle.","(4)","short",
    short_ms("Award 1+1. Max 4.",["At growth, sales rise rapidly (1) as the product gains acceptance (1)","Profits improve as costs are spread over more units (1) and competitors may enter the market (1)"]))
add("B","B3 Product life cycle","Explain",4,"AO2","","Explain the characteristics of the maturity stage of the product life cycle.","(4)","short",
    short_ms("Award 1+1. Max 4.",["At maturity, sales peak and growth slows (1) as the market becomes saturated (1)","Competition is intense and profits may fall (1) as businesses compete on price and differentiation (1)"]))
add("B","B3 Product life cycle","Explain",4,"AO2","","Explain the characteristics of the decline stage of the product life cycle.","(4)","short",
    short_ms("Award 1+1. Max 4.",["At decline, sales fall (1) as the product becomes outdated or demand shifts (1)","Businesses reduce marketing and may withdraw the product (1) or try extension strategies (1)"]))
add("B","B3 Product life cycle","Explain",4,"AO2","","Explain how a business can extend the life of a product in decline.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Extension strategies include updating/rebranding the product (1) finding new markets or uses (1)","or reducing price or adding features (1) to revive interest and delay decline (1)"]))
add("B","B1-B3 Rationale","Evaluate",12,"AO3","FitFuel, a sports nutrition brand, is planning a launch campaign. It has access to customer survey data (primary) and government health statistics (secondary), plus sales data from a pilot launch.","Evaluate how FitFuel should use market research to develop a rationale for its launch. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Combine primary research (customer surveys) with secondary research (government statistics) to build a full picture","Primary data reveals specific customer preferences; secondary data shows market size and trends","Pilot sales data provides real-world evidence of demand and price sensitivity","Assess the validity, reliability and currency of each source before relying on it","Use data to identify target market, competition and likely demand","Product life cycle: consider whether sports nutrition is in growth or maturity","Conclusion: a robust rationale combines multiple reliable sources to justify the launch decision"],
    levels4("Describes research methods generically.","Links research sources to the launch decision partially.","Balanced evaluation of sources and their reliability.","Thorough evaluation synthesising multiple sources into a justified launch rationale.")))

# ============ AIM C — Planning the campaign ============
add("C","C1 SWOT/PESTLE","Explain",4,"AO2","","Explain how a business uses PESTLE analysis in marketing planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["PESTLE identifies external factors (political, economic, social, technological, legal, environmental) (1) that affect the marketing environment (1)","It helps the business anticipate external changes (1) and plan marketing that responds to them (1)"]))
add("C","C1 Target market","Explain",4,"AO2","","Explain why identifying the target market is essential when planning a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The target market determines the message, media and marketing mix (1) so the campaign reaches the right people (1)","Targeting the wrong audience wastes the budget (1) and fails to generate sales (1)"]))
add("C","C1 Competitor analysis","Explain",4,"AO2","","Explain the purpose of competitor analysis in marketing planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Competitor analysis identifies rivals' products, prices and strategies (1) so the business can differentiate itself (1)","It reveals market gaps and competitive threats (1) informing the business's positioning (1)"]))
add("C","C2 Pricing strategies","Explain",4,"AO2","","Explain the difference between cost-plus pricing and competitor-based pricing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Cost-plus pricing adds a mark-up to the cost of production (1) ensuring a profit margin (1)","Competitor-based pricing sets prices based on what competitors charge (1) to remain competitive in the market (1)"]))
add("C","C2 Pricing strategies","Explain",4,"AO2","","Explain what is meant by price skimming and when it is used.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Price skimming sets a high initial price to maximise profit from early adopters (1) before gradually lowering it (1)","It is used for innovative products with little competition (1) where customers are willing to pay a premium (1)"]))
add("C","C2 Pricing strategies","Explain",4,"AO2","","Explain what is meant by penetration pricing and when it is used.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Penetration pricing sets a low initial price to attract customers quickly (1) and gain market share (1)","It is used when entering a competitive market (1) where low price encourages trial and switching (1)"]))
add("C","C2 Marketing mix","Explain",4,"AO2","","Explain the role of 'product' in the marketing mix.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Product refers to the goods or services offered (1) including quality, features, design and branding (1)","The product must meet customer needs (1) to succeed in the market (1)"]))
add("C","C2 Marketing mix","Explain",4,"AO2","","Explain the role of 'place' in the marketing mix.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Place refers to how the product reaches customers (1) through distribution channels such as shops or online (1)","Effective placement ensures the product is available where and when customers want it (1) (1)"]))
add("C","C2 Marketing mix","Explain",4,"AO2","","Explain the role of 'promotion' in the marketing mix.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Promotion communicates the product's benefits to customers (1) through advertising, PR, sales promotion and digital media (1)","It raises awareness and persuades customers to buy (1) driving sales (1)"]))
add("C","C2 Extended mix","Explain",4,"AO2","","Explain the role of 'people' in the extended marketing mix.","(4)","short",
    short_ms("Award 1+1. Max 4.",["People refers to the staff who deliver the service and interact with customers (1) whose skills and attitude shape the customer experience (1)","Well-trained, customer-focused staff enhance satisfaction (1) and reinforce the brand (1)"]))
add("C","C2 Extended mix","Explain",4,"AO2","","Explain the role of 'physical environment' in the extended marketing mix.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Physical environment is the tangible setting where the service is delivered (1) e.g. store layout, decor, signage (1)","It influences customers' perception of quality (1) and shapes their experience of the brand (1)"]))
add("C","C2 Extended mix","Explain",4,"AO2","","Explain the role of 'process' in the extended marketing mix.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Process refers to how the service is delivered (1) e.g. the steps, systems and speed of service (1)","Efficient, convenient processes improve the customer experience (1) and satisfaction (1)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain one advantage and one disadvantage of advertising as a promotional method.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: advertising reaches a wide audience (1) and builds brand awareness (1)","Disadvantage: it can be expensive (1) and its impact is hard to measure directly (1)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain one advantage and one disadvantage of social media marketing.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Advantage: social media is low-cost, targeted and allows direct engagement (1) with measurable results (1)","Disadvantage: it requires constant management (1) and negative feedback can spread quickly (1)"]))
add("C","C2 Promotion","Explain",4,"AO2","","Explain what is meant by public relations (PR) as a promotional method.","(4)","short",
    short_ms("Award 1+1. Max 4.",["PR is managing the business's public image and media coverage (1) e.g. through press releases and events (1)","Positive PR builds credibility and awareness (1) often at lower cost than advertising (1)"]))
add("C","C2 Place/distribution","Explain",4,"AO2","","Explain the advantages of selling online directly to customers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Selling online reaches a wide audience (1) at lower overheads than physical stores (1)","The business keeps full control and a higher margin (1) and can collect customer data (1)"]))
add("C","C3 Marketing campaign","Explain",4,"AO2","","Explain the importance of a clear message in a marketing campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A clear message communicates the product's key benefit (1) so customers understand what is offered (1)","A confusing message fails to engage customers (1) wasting the campaign budget (1)"]))
add("C","C3 Marketing campaign","Explain",4,"AO2","","Explain why the choice of media is important in a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The media must reach the target audience (1) otherwise the message will not be seen by the right people (1)","Different media suit different messages and budgets (1) so the choice affects the campaign's cost and effectiveness (1)"]))
add("C","C3 Marketing campaign","Explain",4,"AO2","","Explain how a business can monitor a marketing campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Monitoring tracks the campaign's performance (1) using metrics such as sales, web traffic and engagement (1)","It allows the business to identify what is working (1) and make adjustments during the campaign (1)"]))
add("C","C4 Appropriateness","Explain",4,"AO2","","Explain why a campaign should be appropriate for the target market.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The message, tone and media must match the target market's preferences (1) to engage and persuade them (1)","An inappropriate campaign wastes budget (1) and may even damage the brand (1)"]))
add("C","C4 Appropriateness","Explain",4,"AO2","","Explain why a campaign should reflect the brand's values.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A campaign consistent with brand values reinforces the brand image (1) and builds trust with customers (1)","A campaign that contradicts the brand confuses customers (1) and damages the brand's reputation (1)"]))
add("C","C4 Appropriateness","Explain",4,"AO2","","Explain why a campaign should be sustainable.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Sustainable campaigns consider environmental and social impact (1) appealing to increasingly eco-conscious customers (1)","Sustainability protects the brand's reputation (1) and supports long-term success (1)"]))
add("C","C4 Appropriateness","Explain",4,"AO2","","Explain why a campaign should be flexible.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Flexibility allows the campaign to adapt to changes (1) such as competitor actions or shifts in the market (1)","A flexible campaign can be adjusted mid-flight (1) to maximise effectiveness (1)"]))
add("C","C1-C4 Campaign planning","Evaluate",12,"AO3","GlowUp, a skincare brand for 18-25 year olds, has £40,000 to launch a new range. It must choose the marketing mix and media for the campaign.","Evaluate the most appropriate marketing mix and campaign approach for GlowUp's new range. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Target market (18-25) is highly active on social media, favouring influencer and digital marketing","Budget £40,000 rules out expensive TV advertising; digital/social media offers better value and targeting","Marketing mix: product (skincare range), price (mid/premium), place (online/e-commerce), promotion (influencers, social media)","Extended mix matters: people (influencers/brand ambassadors), process (easy online purchase), physical environment (packaging)","SWOT: new brand needs awareness; opportunity in digital channels","Message: emphasise USP (e.g. natural ingredients) and brand values","Sustainability and flexibility: digital campaigns can be adjusted in real time","Conclusion: a social media-led campaign with influencer marketing and strong USP is most appropriate"],
    levels4("Describes the marketing mix generically.","Applies the mix to GlowUp partially.","Balanced evaluation of mix and media choices.","Thorough evaluation recommending a specific, justified campaign.")))

# ============ AIM D — Developing the campaign ============
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain why advertising must be truthful.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Truthful advertising is a legal requirement (1) to protect consumers from being misled (1)","False or misleading claims can result in fines and reputational damage (1) and lose customer trust (1)"]))
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain how data protection law affects marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Data protection law (GDPR) requires businesses to obtain consent before using personal data for marketing (1) and to keep data secure (1)","Businesses must allow customers to opt out (1) or risk fines and loss of trust (1)"]))
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain why businesses must not target children inappropriately in marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Children are more vulnerable and less able to judge advertising critically (1) so special rules protect them (1)","Inappropriate targeting is unethical and illegal (1) and damages the business's reputation (1)"]))
add("D","D1 Legal and ethical","Explain",4,"AO2","","Explain why environmental claims in marketing must be accurate.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Environmental claims (e.g. 'green', 'eco-friendly') must be truthful and substantiated (1) to avoid 'greenwashing' (1)","False environmental claims mislead consumers and breach regulations (1) risking fines and reputational damage (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain how a business measures a campaign against its objectives.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The business compares actual results against the SMART objectives set at the start (1) e.g. sales, awareness or market share targets (1)","This shows whether the campaign achieved its goals (1) and informs future campaigns (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain what is meant by return on investment (ROI) in marketing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["ROI measures the profit generated relative to the cost of the campaign (1) e.g. (revenue − cost) ÷ cost (1)","A positive ROI shows the campaign was worthwhile (1); a negative ROI means it cost more than it returned (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain two metrics a business could use to evaluate a digital campaign.","(4)","short",
    short_ms("Award 1+1 each. Max 4.",["Website traffic / visits (1) shows how many people the campaign attracted (1)","Engagement (likes, shares, comments) (1) shows how audiences interacted with the content (1)","Conversion rate / sales (1) shows how many visitors became customers (1)"]))
add("D","D2 Evaluation","Explain",4,"AO2","","Explain why a business should learn from the evaluation of a campaign.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Evaluation identifies what worked and what did not (1) providing lessons for improvement (1)","Applying these lessons makes future campaigns more effective (1) and gives better value for money (1)"]))
add("D","D2 Flexibility","Explain",4,"AO2","","Explain how a business can adapt a campaign in response to feedback.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Monitoring feedback (sales, engagement, comments) (1) reveals what is and isn't working (1)","The business can then adjust the message, media or budget (1) to improve results mid-campaign (1)"]))
add("D","D1/D2 Campaign development","Evaluate",12,"AO3","A campaign for a new gym must launch on a limited budget, in a competitive market, and must comply with advertising and data protection law.","Evaluate how a business should develop, launch and adapt a legally compliant marketing campaign. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Plan: set SMART objectives, research the market and target audience, allocate the limited budget efficiently","Develop: choose an appropriate marketing mix and message that differentiates the gym","Legal compliance: ensure advertising is truthful, claims are substantiated, and data protection (consent) is respected","Ethical considerations: avoid misleading or inappropriate targeting","Launch and monitor: track performance metrics and ROI","Adapt: respond to feedback and competitor actions, adjusting the campaign in real time","Evaluation: measure against objectives and learn for future campaigns","Conclusion: a well-planned, compliant, flexible campaign that is monitored and adapted is most effective"],
    levels4("Describes the campaign process generically.","Identifies planning, compliance and adaptation with partial application.","Balanced evaluation of developing and adapting a compliant campaign.","Thorough evaluation covering planning, legal/ethical compliance, adaptation and evaluation.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U2 aim counts:", {k: len(v) for k, v in aims.items()})
print("U2 total:", sum(len(v) for v in aims.values()))
