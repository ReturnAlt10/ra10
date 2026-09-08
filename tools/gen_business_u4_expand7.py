# -*- coding: utf-8 -*-
"""BTEC Business Unit 4 expansion — batch 7 (final, to reach 300)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-4\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain how an event organiser ensures the event stays within budget.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Track spending against the budget throughout planning and on the day (1) (1)","Control costs and approve only necessary expenditure (1) to avoid overspending (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why creativity is a useful skill for an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Creativity helps design an engaging, memorable event (1) that stands out (1)","It also helps find innovative solutions to problems (1) within constraints such as budget (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how attendee feedback during an event can influence its success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Monitoring feedback lets the organiser spot and fix issues quickly (1) (1)","Responding to feedback improves the experience (1) and satisfaction (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain the importance of confirming bookings in writing.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Written confirmation provides a record of what was agreed (1) (1)","It reduces the risk of disputes (1) and ensures both parties are clear on arrangements (1)"]))
add("C","C2 Health and safety","Explain",4,"AO2","","Explain the importance of supervision at an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Supervision ensures activities are carried out safely (1) and rules are followed (1)","It allows problems or hazards to be spotted (1) and addressed promptly (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how an event manager decides when to escalate a problem.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Escalate when a problem is beyond the manager's authority or expertise (1) or has serious safety/legal implications (1)","Escalating to the right person (1) ensures the problem is handled correctly (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how evaluation supports the development of the event management process.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Evaluation identifies weaknesses in the event management process (1) (1)","Improving the process (1) makes future events more efficient and effective (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how to celebrate and build on strengths identified in reflection.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Recognise and value your strengths (1) and seek opportunities to use them more (1)","Building on strengths (1) accelerates development and confidence (1)"]))
add("A","A1/A2/A3 Role","Discuss",6,"AO3","You want to pursue a career in event management but have limited experience.","Discuss how you can develop the skills needed for this career. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Carry out a skills audit to identify current skills and gaps","Gain experience through volunteering or helping at events","Develop key skills (communication, organisation, budgeting) through practice and training","Seek feedback and reflect to improve","Conclusion: a skills audit plus practical experience and deliberate development will build the skills for an event management career"],
    levels3("Lists skills without development.","Identifies development routes partially.","Thoroughly evaluates skills development; justified.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U4 aim counts:", {k: len(v) for k, v in aims.items()})
print("U4 total:", sum(len(v) for v in aims.values()))
