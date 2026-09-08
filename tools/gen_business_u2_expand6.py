# -*- coding: utf-8 -*-
"""BTEC Business Unit 2 expansion — batch 6 (final push)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-2\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCD'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

add("A","A1 Role of marketing","Identify",2,"AO1","","Identify two functions marketing performs.","(2)","short",
    short_ms("Award 1 mark each.",["Anticipating demand (1)","Recognising demand (1)","Stimulating demand (1)","Satisfying demand (1)"]))
add("A","A1 Marketing aims","Identify",2,"AO1","","Identify two marketing aims a business might set.","(2)","short",
    short_ms("Award 1 mark each.",["Understanding customer wants and needs (1)","Developing new products (1)","Improving profitability (1)","Increasing market share (1)","Diversification (1)","Increased brand awareness and loyalty (1)"]))
add("A","A1 Types of market","State",2,"AO1","","State the difference between a mass market and a niche market.","(2)","short",
    short_ms("Award 1+1.",["Mass market: a large, broad market with many customers and similar needs (1)","Niche market: a small, specialised segment with specific needs (1)"]))
add("A","A1 Market segmentation","Identify",2,"AO1","","Identify two ways a market can be segmented.","(2)","short",
    short_ms("Award 1 mark each.",["Age (1)","Gender (1)","Income (1)","Lifestyle (1)","Geographic location (1)","Behaviour (1)"]))
add("A","A2 External influences","Identify",2,"AO1","","Identify two external influences on marketing.","(2)","short",
    short_ms("Award 1 mark each.",["Social (1)","Technological (1)","Economic (1)","Environmental (1)","Political (1)","Legal (1)","Ethical (1)"]))
add("B","B2 Primary research","Identify",2,"AO1","","Identify two primary research methods.","(2)","short",
    short_ms("Award 1 mark each.",["Survey/questionnaire (1)","Interview (1)","Observation (1)","Trials (1)","Focus groups (1)"]))
add("B","B2 Secondary research","Identify",2,"AO1","","Identify two secondary research sources.","(2)","short",
    short_ms("Award 1 mark each.",["Government statistics (1)","Trade journals (1)","Commercially published reports (1)","Media sources (1)","Internal sales records (1)"]))
add("B","B3 Product life cycle","Identify",2,"AO1","","Identify the stages of the product life cycle.","(2)","short",
    short_ms("Award 1 mark per stage, up to 2.",["Introduction (1)","Growth (1)","Maturity (1)","Decline (1)"]))
add("C","C2 Pricing strategies","Identify",2,"AO1","","Identify two pricing strategies.","(2)","short",
    short_ms("Award 1 mark each.",["Penetration pricing (1)","Price skimming (1)","Competitor-based pricing (1)","Cost-plus pricing (1)"]))
add("C","C2 Marketing mix","Identify",2,"AO1","","Identify the four elements of the marketing mix.","(2)","short",
    short_ms("Award 1 mark per element, up to 2.",["Product (1)","Price (1)","Place (1)","Promotion (1)"]))
add("C","C2 Promotion","Identify",2,"AO1","","Identify two promotional methods.","(2)","short",
    short_ms("Award 1 mark each.",["Advertising (1)","Public relations (1)","Sponsorship (1)","Social media (1)","Guerrilla marketing (1)","Personal selling (1)","Product placement (1)"]))
add("D","D1 Legal and ethical","Identify",2,"AO1","","Identify two legal/ethical considerations in marketing.","(2)","short",
    short_ms("Award 1 mark each.",["Truthful advertising (1)","Data protection (1)","Not targeting children inappropriately (1)","Accurate environmental claims (1)","Respect for privacy (1)"]))
add("D","D2 Evaluation","Identify",2,"AO1","","Identify two ways to evaluate a campaign.","(2)","short",
    short_ms("Award 1 mark each.",["Compare against objectives (1)","Measure sales (1)","Measure ROI (1)","Customer feedback (1)","Web/engagement metrics (1)"]))
add("D","D2 Flexibility","State",2,"AO1","","State why a campaign should be flexible.","(2)","short",
    short_ms("Award 2.",["To allow it to adapt to internal and external changes during the campaign (1+1)"]))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U2 aim counts:", {k: len(v) for k, v in aims.items()})
print("U2 total:", sum(len(v) for v in aims.values()))
