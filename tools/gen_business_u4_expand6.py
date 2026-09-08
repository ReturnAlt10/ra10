# -*- coding: utf-8 -*-
"""BTEC Business Unit 4 expansion — batch 6 (final push)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-4\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

add("A","A1 Role of event organiser","Identify",2,"AO1","","Identify two tasks of an event organiser.","(2)","short",
    short_ms("Award 1 mark each.",["Planning (1)","Organising resources (1)","Budgeting (1)","Promoting (1)","Coordinating (1)","Evaluating (1)"]))
add("A","A2 Skills","Identify",2,"AO1","","Identify two skills an event organiser needs.","(2)","short",
    short_ms("Award 1 mark each.",["Communication (1)","Organisation (1)","Problem solving (1)","Negotiation (1)","Leadership (1)","Teamwork (1)","Time management (1)"]))
add("A","A3 Skills audit","State",2,"AO1","","State what a skills audit is.","(2)","short",
    short_ms("Award 2.",["A review of an individual's current skills and abilities, identifying strengths and areas for development (2)"]))
add("B","B1 Types of event","Identify",2,"AO1","","Identify two types of event.","(2)","short",
    short_ms("Award 1 mark each.",["Business event (1)","Social event (1)","Sports event (1)","Entertainment event (1)"]))
add("B","B2 Feasibility","State",2,"AO1","","State what is meant by the feasibility of an event.","(2)","short",
    short_ms("Award 2.",["Whether the event is practical and achievable given available resources, budget, venue and timing (2)"]))
add("B","B2 Critical success factors","Identify",2,"AO1","","Identify two critical success factors for an event.","(2)","short",
    short_ms("Award 1 mark each.",["Clear aims and objectives (1)","Adequate budget (1)","Effective marketing (1)","Strong planning (1)","Positive customer experience (1)"]))
add("C","C1 Planning tools","Identify",2,"AO1","","Identify two planning tools used in event management.","(2)","short",
    short_ms("Award 1 mark each.",["Gantt chart (1)","Action plan (1)","Critical path analysis (1)","Checklist (1)"]))
add("C","C2 Risk assessment","State",2,"AO1","","State what a risk assessment is.","(2)","short",
    short_ms("Award 2.",["The process of identifying hazards, assessing likelihood and severity of harm, and putting controls in place (2)"]))
add("D","D1 Managing the event","Identify",2,"AO1","","Identify two responsibilities of an event manager on the day.","(2)","short",
    short_ms("Award 1 mark each.",["Coordinating staff (1)","Overseeing schedule (1)","Handling problems (1)","Ensuring health and safety (1)","Managing budget (1)"]))
add("E","E1 Evaluating the event","Identify",2,"AO1","","Identify two ways to evaluate an event.","(2)","short",
    short_ms("Award 1 mark each.",["Feedback from attendees (1)","Review against objectives (1)","Budget analysis (1)","Attendance/sales review (1)","Team debrief (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why communication is the most fundamental skill for an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Communication underpins every task (1) — with clients, suppliers, staff and attendees (1)","Without it, plans cannot be shared and coordination fails (1) (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how the quality of the venue affects the customer experience.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A good venue is comfortable, accessible and well-facilitated (1) enhancing the experience (1)","A poor venue (cramped, poor facilities) (1) reduces satisfaction (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how to assess whether an event's budget is realistic.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Compare estimated costs against available funds and expected income (1) (1)","Include a contingency for unexpected costs (1) to judge realism (1)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain how an action plan improves accountability.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An action plan assigns each task to a named person (1) making responsibility clear (1)","This improves accountability (1) as progress can be tracked to individuals (1)"]))
add("C","C2 Contingency planning","Explain",4,"AO2","","Explain why contingency plans should be communicated to the team.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The team must know the contingency plan to act on it (1) when needed (1)","Without communication, the plan cannot be implemented quickly (1) (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how an event manager can stay calm under pressure.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Prepare thoroughly and use contingency plans (1) so problems are expected and manageable (1)","Focus on the solution and prioritise (1) rather than dwelling on the problem (1)"]))
add("D","D1 Staging the event","Explain",4,"AO2","","Explain how staging an event differs from planning it.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Planning is deciding what will happen in advance (1) (1)","Staging is actually delivering the event on the day (1) and managing it as it happens (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how running an event develops confidence in a professional context.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Delivering a real event demonstrates capability (1) and builds professional confidence (1)","Handling real challenges (1) reassures the individual they can perform under pressure (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how evaluation contributes to the reputation of the event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Thorough evaluation and improvement (1) show professionalism and commitment to quality (1)","A reputation for learning and improving (1) attracts future clients (1)"]))
add("A","A1/A2 Role","Evaluate",12,"AO3","You are the lead organiser of a community festival.","Evaluate the skills you need and how you will ensure the festival is a success. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Communication: liaise with the community, suppliers and staff","Organisation: plan the programme, resources and schedule","Budgeting and negotiation: manage funds and secure good deals","Leadership and teamwork: motivate and coordinate volunteers","Problem solving: respond to issues on the day","Use a skills audit to identify gaps and build a team to cover them","Conclusion: a combination of skills, supported by planning and teamwork, will maximise the festival's success"],
    levels4("Lists skills generically.","Explains several skills with partial application.","Balanced evaluation of the skills needed.","Thorough evaluation linking skills to festival success; justified.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U4 aim counts:", {k: len(v) for k, v in aims.items()})
print("U4 total:", sum(len(v) for v in aims.values()))
