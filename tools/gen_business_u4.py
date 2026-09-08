# -*- coding: utf-8 -*-
"""Generate BTEC Business Unit 4 (Managing an Event) data."""
import json, os

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-4\data"

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
 q("A001","A","A1 Role of event organiser","Identify",2,"AO1","","Identify two tasks of an event organiser.","(2)","short",
   short_ms("Award 1 mark each.", ["Planning the event (1)","Organising resources (1)","Budgeting (1)","Promoting the event (1)","Coordinating on the day (1)","Evaluating the event afterwards (1)"])),
 q("A002","A","A2 Skills","Give",2,"AO1","","Give two skills an event organiser needs.","(2)","short",
   short_ms("Award 1 mark each.", ["Communication (1)","Organisation (1)","Problem solving (1)","Negotiation (1)","Leadership (1)","Teamwork (1)","Time management (1)"])),
 q("A003","A","A2 Skills","Explain",4,"AO2","","Explain why communication is an essential skill for an event organiser.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Event organisers must communicate with clients, suppliers, venues and staff (1) to coordinate all aspects of the event (1)","Clear communication prevents misunderstandings and errors (1) ensuring the event runs smoothly and meets the client's needs (1)"])),
 q("A004","A","A2 Skills","Explain",4,"AO2","","Explain why problem-solving is important when managing an event.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Unexpected problems (e.g. supplier failure, equipment breakdown) inevitably arise (1) and the organiser must resolve them quickly (1)","Effective problem-solving minimises disruption (1) and keeps the event on schedule and within budget (1)"])),
 q("A005","A","A3 Skills audit","State",2,"AO1","","State what a skills audit is.","(2)","short",
   short_ms("Award 2.", ["A review of an individual's current skills and abilities, identifying strengths and areas for development (2)"])),
 q("A006","A","A3 Skills audit","Explain",4,"AO2","","Explain the purpose of carrying out a personal skills audit before organising an event.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["A skills audit identifies strengths and weaknesses (1) so the organiser knows what they can do and where they need support (1)","It helps plan development and allocate tasks (1) improving the likelihood of event success (1)"])),
 q("A007","A","A1/A2 Role and skills","Discuss",6,"AO3","You have been asked to organise a school fundraising event.","Discuss the skills an event organiser needs to plan and run this event successfully. (6)","(6)","extended_levels",
   lvl_ms("Levels-based.",
    ["Communication: liaising with the school, suppliers and volunteers","Organisation: planning activities, booking venue, scheduling","Problem solving: handling unexpected issues on the day","Leadership and teamwork: directing and motivating volunteers","Time management: meeting deadlines before the event","Conclusion: a combination of skills is needed, with communication and organisation most critical"],
    levels3("Lists one or two skills without development.","Explains several skills with some application to the event.","Thoroughly evaluates the skills needed with clear application to the fundraising event."))),
]

aims["B"] = [
 q("B001","B","B1 Types of event","Identify",2,"AO1","","Identify two types of event a business might run.","(2)","short",
   short_ms("Award 1 mark each.", ["Business event (conference, product launch) (1)","Social event (wedding, party) (1)","Sports event (tournament, race) (1)","Entertainment event (concert, festival) (1)"])),
 q("B002","B","B1 Factors affecting success","Give",2,"AO1","","Give two factors that affect the success of an event.","(2)","short",
   short_ms("Award 1 mark each.", ["Venue (1)","Budget (1)","Timing (1)","Marketing/promotion (1)","Quality of organisation (1)","Customer experience (1)"])),
 q("B003","B","B2 Feasibility","State",2,"AO1","","State what is meant by the feasibility of an event.","(2)","short",
   short_ms("Award 2.", ["Whether an event is practical and achievable given the available resources, budget, venue and timing (2)"])),
 q("B004","B","B2 Feasibility","Explain",4,"AO2","","Explain two factors to consider when assessing the feasibility of an event.","(4)","short",
   short_ms("Award 1+1 each. Max 4.", ["Cost and budget: the event must be affordable and likely to cover its costs (1); if costs exceed available funds the event is not feasible (1)","Resources and venue: suitable venue, staff and equipment must be available (1); without them the event cannot go ahead (1)","Timing: the date must be practical and not clash with other commitments (1)"])),
 q("B005","B","B2 Critical success factors","Identify",2,"AO1","","Identify two critical success factors for an event.","(2)","short",
   short_ms("Award 1 mark each.", ["Clear aims and objectives (1)","Adequate budget (1)","Effective marketing (1)","Strong planning and organisation (1)","Positive customer experience (1)"])),
 q("B006","B","B1/B2 Feasibility","Discuss",6,"AO3","A local charity wants to hold a sponsored run but has a limited budget and is unsure whether the event is feasible.","Discuss how the charity should assess the feasibility of the sponsored run. (6)","(6)","extended_levels",
   lvl_ms("Levels-based.",
    ["Assess costs: venue, permits, marketing, safety, staff vs expected income from sponsorship","Consider resources: volunteers, equipment, insurance, first aid","Assess timing: suitable date, avoid clashes","Consider demand: likely number of participants","Identify critical success factors: clear aims, adequate budget, effective promotion","Conclusion: feasibility depends on balancing costs and expected sponsorship income with available resources"],
    levels3("Describes feasibility factors in basic terms.","Considers costs, resources and demand with partial application.","Thoroughly evaluates feasibility factors and reaches a justified conclusion."))),
]

aims["C"] = [
 q("C001","C","C1 Planning tools","Identify",2,"AO1","","Identify two planning tools used in event management.","(2)","short",
   short_ms("Award 1 mark each.", ["Gantt chart (1)","Action plan (1)","Critical path analysis (1)","Checklist (1)"])),
 q("C002","C","C1 Planning tools","Explain",4,"AO2","","Explain the purpose of a Gantt chart in planning an event.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["A Gantt chart shows the tasks of an event against a timeline (1) making the schedule clear and visual (1)","It helps identify task durations, deadlines and overlaps (1) enabling the organiser to monitor progress and stay on schedule (1)"])),
 q("C003","C","C2 Factors","State",2,"AO1","","State two factors to consider when planning an event budget.","(2)","short",
   short_ms("Award 1 mark each.", ["Venue hire (1)","Marketing/promotion (1)","Staff/volunteers (1)","Equipment (1)","Insurance (1)","Catering (1)"])),
 q("C004","C","C2 Health and safety","Explain",4,"AO2","","Explain why health and safety is important when planning an event.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Events involve risks to attendees and staff (1) which must be identified and minimised to prevent injury (1)","A risk assessment identifies hazards and controls (1) ensuring legal compliance and protecting the organisers from liability (1)"])),
 q("C005","C","C2 Risk assessment","State",2,"AO1","","State what a risk assessment is.","(2)","short",
   short_ms("Award 2.", ["The process of identifying hazards, assessing the likelihood and severity of harm, and putting controls in place to reduce risk (2)"])),
 q("C006","C","C2 Contingency planning","Explain",4,"AO2","","Explain why an event plan should include contingency plans.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Contingency plans prepare for unexpected problems (1) such as bad weather, supplier failure or low attendance (1)","Having a backup reduces disruption and financial loss (1) enabling the event to continue or be adapted quickly (1)"])),
 q("C007","C","C1/C2 Detailed plan","Discuss",6,"AO3","You are planning a school careers fair to be held in the main hall.","Discuss the key factors to consider when developing a detailed plan for this event. (6)","(6)","extended_levels",
   lvl_ms("Levels-based.",
    ["Budget: costs of venue setup, marketing, refreshments","Resources: tables, exhibitors, staff/volunteers","Planning tools: Gantt chart / action plan to schedule tasks","Health and safety: risk assessment for the hall and visitors","Contingency: what if exhibitors cancel or attendance is low","Conclusion: a detailed plan balancing budget, resources, safety and contingencies is essential"],
    levels3("Lists planning factors without much development.","Explains budget, resources and safety with partial application.","Thoroughly evaluates the planning factors with a clear, justified approach."))),
]

aims["D"] = [
 q("D001","D","D1 Managing the event","Identify",2,"AO1","","Identify two responsibilities of the event manager on the day of the event.","(2)","short",
   short_ms("Award 1 mark each.", ["Coordinating staff and suppliers (1)","Overseeing the schedule (1)","Handling problems as they arise (1)","Ensuring health and safety (1)","Managing the budget on the day (1)"])),
 q("D002","D","D2 Problem solving","Explain",4,"AO2","","Explain how an event manager should deal with an unexpected problem on the day of an event.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Stay calm and assess the problem quickly (1) to determine its impact on the event (1)","Implement a contingency plan or find a quick solution (1) while communicating with staff and attendees to minimise disruption (1)"])),
 q("D003","D","D1 Staging the event","Explain",4,"AO2","","Explain two factors that must be managed when staging an event.","(4)","short",
   short_ms("Award 1+1 each. Max 4.", ["Time management: keeping the event running to schedule (1) so activities start and finish on time (1)","Health and safety: ensuring the venue is safe and risks are controlled (1) to protect attendees and staff (1)","Customer experience: managing quality of service (1) to satisfy attendees (1)"])),
 q("D004","D","D1/D2 Managing and problem solving","Evaluate",12,"AO3","On the day of a music event, the headline act cancels at short notice. As event manager, you must respond.","Evaluate how an event manager should respond to the cancellation of a headline act. (12)","(12)","extended_levels",
   lvl_ms("Levels-based, 4 levels.",
    ["Assess the situation: impact on the schedule and audience expectations","Options: find a replacement act, re-arrange the running order, offer refunds, reschedule","Communicate clearly and promptly with the audience to manage expectations","Consider contractual and financial implications (refunds, compensation)","Consider the audience experience and reputation of the event","Implement contingency planning prepared in advance","Conclusion: a calm, communicative and flexible response, backed by contingency planning, minimises damage"],
    levels4("Describes the problem with limited response options.","Identifies some options and considers audience impact.","Balanced evaluation of options considering financial, contractual and audience factors.","Thorough evaluation with a justified course of action and contingency planning."))),
]

aims["E"] = [
 q("E001","E","E1 Evaluating the event","State",2,"AO1","","State two ways an event can be evaluated after it has run.","(2)","short",
   short_ms("Award 1 mark each.", ["Collecting feedback from attendees (1)","Reviewing against objectives (1)","Analysing the budget (1)","Reviewing attendance/sales (1)","Team debrief (1)"])),
 q("E002","E","E1 Evaluating the event","Explain",4,"AO2","","Explain why it is important to evaluate an event after it has run.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Evaluation identifies what went well and what could be improved (1) providing learning for future events (1)","It measures whether the event met its aims and objectives (1) and whether it provided value for money (1)"])),
 q("E003","E","E2 Skills development","Explain",4,"AO2","","Explain how running an event can develop an individual's personal skills.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Organising an event develops practical skills such as planning, communication and teamwork (1) through real hands-on experience (1)","Reflecting on the experience identifies strengths and areas for improvement (1) supporting personal and career development (1)"])),
 q("E004","E","E2 Skills development","Explain",4,"AO2","","Explain how reflecting on an event helps improve future performance.","(4)","short",
   short_ms("Award 1+1. Max 4.", ["Reflection identifies specific strengths and weaknesses (1) enabling targeted improvement (1)","It turns experience into learning (1) so the individual performs better in future events (1)"])),
 q("E005","E","E1/E2 Evaluation and reflection","Evaluate",12,"AO3","After organising a charity bake sale, you must reflect on the event and your own performance.","Evaluate the importance of reflecting on the event and your own skills development. (12)","(12)","extended_levels",
   lvl_ms("Levels-based, 4 levels.",
    ["Evaluate the event: did it meet aims, stay within budget, satisfy attendees?","Gather feedback from attendees and volunteers","Reflect on personal performance: which skills were strong, which need development","Link reflection to skills development: planning, communication, problem solving","Set specific goals for improvement in future events","Conclusion: reflection converts experience into learning and drives continuous improvement"],
    levels4("Describes the event without much reflection.","Identifies some strengths/weaknesses with limited analysis.","Balanced reflection linking the event outcome to skills development.","Thorough reflection with specific, justified development goals."))),
]

for a, items in aims.items():
    with open(os.path.join(BASE, f"aim_{a}.json"), "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
print("U4 aims:", {k: len(v) for k, v in aims.items()})
