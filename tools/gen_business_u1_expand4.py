# -*- coding: utf-8 -*-
"""BTEC Business Unit 1 expansion — batch 4 (final push past 300)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-1\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

add("A","A1 Ownership and liability","Identify",2,"AO1","","Identify two types of not-for-profit ownership in the private sector.","(2)","short",
    short_ms("Award 1 mark each.",["Charity (1)","Social enterprise (1)","Community interest company (CIC) (1)","Cooperative (not-for-profit) (1)"],"Award up to 2."))
add("A","A1 Sectors","Identify",2,"AO1","","Identify which sector a research laboratory and a software developer operate in.","(2)","short",
    short_ms("Award 1 mark each.",["Research laboratory = quaternary (1)","Software developer = quaternary (1)"]))
add("A","A1 Size of business","State",2,"AO1","","State the number of employees in a medium-sized business under EU definitions.","(2)","short",
    short_ms("Award 2.",["50-249 employees (2)"]))
add("A","A2 Stakeholders","Identify",2,"AO1","","Identify two ways customers can influence a business.","(2)","short",
    short_ms("Award 1 mark each.",["Through their purchasing decisions / demand (1)","Through feedback, reviews and complaints (1)","By switching to competitors (1)","Through loyalty / repeat custom (1)"],"Award up to 2."))
add("A","A3 Business communications","Identify",2,"AO1","","Identify two methods of oral communication a business might use to present information to a large audience.","(2)","short",
    short_ms("Award 1 mark each.",["Presentation using computer projection (1)","Video conferencing (1)","Webinar (1)","Podcast (1)"],"Award up to 2."))
add("B","B1 Organisational structure","State",2,"AO1","","State the difference between a tall and a flat organisational structure.","(2)","short",
    short_ms("Award 1+1.",["Tall: many layers of management and a long chain of command (1)","Flat: few layers and a short chain of command (1)"]))
add("B","B1 Functional areas","Identify",2,"AO1","","Identify the functional area responsible for advertising and promoting products.","(2)","short",
    short_ms("Award 2.",["Marketing (2)"]))
add("B","B2 Aims and objectives","Identify",2,"AO1","","Identify two aims a social enterprise might have.","(2)","short",
    short_ms("Award 1 mark each.",["Addressing a social or environmental problem (1)","Providing employment for disadvantaged groups (1)","Reinvesting profits into the social mission (1)","Financial sustainability (1)"],"Award up to 2."))
add("B","B2 SMART objectives","Explain",4,"AO2","","Explain why objectives should be specific.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Specific objectives are clear and unambiguous (1) so everyone knows exactly what is expected (1)","Vague objectives are hard to act on and measure (1) reducing their usefulness for planning and control (1)"]))
add("C","C1 External environment","Give",2,"AO1","","Give two examples of technological factors that can affect a business.","(2)","short",
    short_ms("Award 1 mark each.",["Automation and AI (1)","E-commerce and mobile technology (1)","New production technology (1)","Social media platforms (1)"],"Award up to 2."))
add("C","C2 Internal environment","State",2,"AO1","","State one way a business can build a positive corporate culture.","(2)","short",
    short_ms("Award 2.",["Clear communication, valuing and rewarding staff, strong leadership, promoting teamwork and ethical values (1+1)"]))
add("C","C3 Competitive environment","Identify",2,"AO1","","Identify two sources of competitive advantage.","(2)","short",
    short_ms("Award 1 mark each.",["Cost leadership / lower costs (1)","Differentiation (1)","Strong brand/reputation (1)","Superior technology (1)","Skilled workforce (1)"],"Award up to 2."))
add("C","C4 Situational analysis","Identify",2,"AO1","","Identify the four elements of a SWOT analysis.","(2)","short",
    short_ms("Award 1 mark each, up to 2.",["Strengths (1)","Weaknesses (1)","Opportunities (1)","Threats (1)"]))
add("D","D1 Market structures","State",2,"AO1","","State one feature that distinguishes imperfect competition from perfect competition.","(2)","short",
    short_ms("Award 2.",["Product differentiation / fewer firms / barriers to entry / pricing power (any one, 1+1)"]))
add("D","D2 Demand","Give",2,"AO1","","Give two factors (other than price) that influence demand.","(2)","short",
    short_ms("Award 1 mark each.",["Consumer income (1)","Availability of substitutes (1)","Tastes and preferences (1)","Level of GDP (1)","Advertising (1)"],"Award up to 2."))
add("D","D2 Supply","Give",2,"AO1","","Give two factors that influence supply.","(2)","short",
    short_ms("Award 1 mark each.",["Availability of raw materials (1)","Availability of labour (1)","Logistics (1)","Ability to produce profitably (1)","Competition for raw materials (1)","Government support (1)"],"Award up to 2."))
add("D","D2 Elasticity","State",2,"AO1","","State the formula for price elasticity of demand.","(2)","short",
    short_ms("Award 2.",["PED = % change in quantity demanded ÷ % change in price (2)"]))
add("D","D3 Pricing and output","Explain",4,"AO2","","Explain why a firm in an oligopoly must consider its rivals' reactions when setting prices.","(4)","short",
    short_ms("Award 1+1. Max 4.",["In an oligopoly firms are interdependent (1) so one firm's price change affects its rivals' sales (1)","Rivals are likely to retaliate (e.g. match a price cut) (1) which can trigger a price war and reduce profits for all (1)"]))
add("E","E1 Innovation","Give",2,"AO1","","Give two examples of how a business can be innovative.","(2)","short",
    short_ms("Award 1 mark each.",["Developing new products (1)","Developing new services (1)","Introducing new processes to improve efficiency (1)","Adding value to existing products (1)"],"Award up to 2."))
add("E","E2 Benefits of innovation","Give",2,"AO1","","Give two benefits of innovation to a business.","(2)","short",
    short_ms("Award 1 mark each.",["Improved products/services (1)","Business growth (1)","New/niche markets (1)","Unique selling points (1)","Improved reputation (1)","Smarter working/efficiency (1)"],"Award up to 2."))
add("E","E2 Risks of innovation","Give",2,"AO1","","Give two risks associated with innovation.","(2)","short",
    short_ms("Award 1 mark each.",["Failure to achieve return on investment (1)","Failure to meet operational/commercial requirements (1)","Resistance to change (1)","Insufficient leadership support (1)","Cultural problems (1)"],"Award up to 2."))
add("E","E1 Enterprise thinking","Identify",2,"AO1","","Identify two approaches to creative/enterprise thinking.","(2)","short",
    short_ms("Award 1 mark each.",["Creative thinking (1)","Lateral thinking (1)","Blue sky thinking (1)","Intuition (1)","Chance/serendipity (1)"],"Award up to 2."))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U1 aim counts:", {k: len(v) for k, v in aims.items()})
print("U1 total:", sum(len(v) for v in aims.values()))
