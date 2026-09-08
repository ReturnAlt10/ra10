# -*- coding: utf-8 -*-
"""BTEC Business Unit 4 expansion — batch 5 (final)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-4\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A ============
add("A","A1 Role of event organiser","Identify",2,"AO1","","Identify two stages of the event management process.","(2)","short",
    short_ms("Award 1 mark each.",["Planning (1)","Feasibility (1)","Staging/managing (1)","Evaluation (1)"]))
add("A","A2 Skills","Identify",2,"AO1","","Identify two skills needed to work effectively in a team at an event.","(2)","short",
    short_ms("Award 1 mark each.",["Communication (1)","Teamwork/cooperation (1)","Leadership (1)","Problem solving (1)","Time management (1)"]))
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain the difference between planning and organising in event management.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Planning decides what will happen (aims, schedule, budget) (1) (1)","Organising arranges the resources (people, equipment, suppliers) to make the plan happen (1) (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why listening is an important communication skill for event organisers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Listening ensures the organiser understands the client's and attendees' needs (1) (1)","It helps resolve issues and build relationships (1) (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain how an event organiser can motivate volunteers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Provide clear roles, training and support (1) and recognise their contribution (1)","Motivated volunteers perform better (1) and stay engaged throughout the event (1)"]))
add("A","A3 Skills audit","Explain",4,"AO2","","Explain why honest self-assessment is important in a skills audit.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Honest self-assessment gives an accurate picture of skills (1) (1)","Overstating or understating skills leads to poor development planning (1) (1)"]))
add("A","A1/A2 Role","Discuss",6,"AO3","You have been asked to coordinate a school open evening.","Discuss the main tasks you will need to carry out as event organiser. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Plan the event: set objectives, decide the programme and activities","Organise resources: venue, staff, materials and displays","Budget for any costs","Promote the open evening to parents and students","Coordinate on the day and evaluate afterwards","Conclusion: planning, organising, budgeting, promoting and coordinating are all essential tasks"],
    levels3("Lists tasks without development.","Explains several tasks with partial application.","Thoroughly evaluates the tasks; justified.")))

# ============ AIM B ============
add("B","B1 Types of event","Identify",2,"AO1","","Identify two examples of a business event.","(2)","short",
    short_ms("Award 1 mark each.",["Conference (1)","Product launch (1)","Trade show/exhibition (1)","Networking event (1)","Awards ceremony (1)"]))
add("B","B1 Factors affecting success","Identify",2,"AO1","","Identify two factors affecting event success.","(2)","short",
    short_ms("Award 1 mark each.",["Venue (1)","Budget (1)","Timing (1)","Marketing (1)","Organisation (1)","Customer experience (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how competition for a venue affects feasibility.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A suitable venue must be available on the required date (1) (1)","If venues are booked or too expensive (1) the event may be infeasible (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how to test demand before committing to an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Use market research, surveys or advance registrations (1) to gauge interest (1)","Strong early demand supports feasibility (1); weak demand suggests caution (1)"]))
add("B","B2 Critical success factors","Explain",4,"AO2","","Explain why a positive customer experience is critical to repeat events.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A positive experience encourages attendees to return (1) and recommend the event (1)","Repeat custom and reputation (1) underpin long-term success (1)"]))
add("B","B1/B2 Feasibility","Discuss",6,"AO3","A school is considering an overseas trip as an event but has concerns about cost, safety and parental consent.","Discuss how the school should assess the feasibility of this trip. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Assess costs (travel, accommodation, activities) against available funding and parental contributions","Assess safety: risk assessment, insurance, supervision ratios","Secure parental consent and address concerns","Assess resources: staff availability and time","Check demand/interest from students","Conclusion: feasibility depends on cost, safety, consent and resources all being manageable; a detailed assessment is essential before committing"],
    levels3("Describes feasibility factors in basic terms.","Considers cost/safety/consent partially.","Thoroughly evaluates feasibility; justified conclusion.")))

# ============ AIM C ============
add("C","C1 Planning tools","Explain",4,"AO2","","Explain how a checklist supports the other planning tools.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A checklist summarises key tasks and items (1) complementing action plans and Gantt charts (1)","It provides a quick way to verify completion (1) on top of the detailed planning (1)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain how technology can support event planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Technology (spreadsheets, planning software, shared calendars) (1) helps create and share plans (1)","It improves coordination and tracking (1) across the team (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain the factors to consider when planning transport for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Consider how attendees will travel and parking/access (1) and the budget (1)","Arrange transport where needed (1) and communicate travel details (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain why the timing of tasks matters in event planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Tasks must be sequenced so each is done before it is needed (1) (1)","Poor timing causes delays and last-minute rushing (1) (1)"]))
add("C","C2 Health and safety","Explain",4,"AO2","","Explain the importance of an evacuation plan at an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An evacuation plan ensures people can leave safely in an emergency (1) (1)","It is a legal requirement (1) and protects lives (1)"]))
add("C","C2 Risk assessment","Explain",4,"AO2","","Explain how to review a risk assessment on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Check that controls are in place and effective (1) and monitor for new hazards (1)","Update the assessment and controls (1) as conditions change (1)"]))
add("C","C2 Contingency planning","Explain",4,"AO2","","Explain how contingency planning improves attendee confidence.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Knowing there are backup plans reassures attendees (1) and builds trust in the event (1)","It shows professionalism (1) and reduces the impact of problems (1)"]))
add("C","C1/C2 Planning","Discuss",6,"AO3","You are planning a school sports day, which depends on good weather and many volunteers.","Discuss the key planning considerations including contingency. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Plan the budget, venue, equipment and volunteer roles","Use planning tools (action plan, Gantt chart) to schedule","Risk assess the sports activities and weather","Prepare contingency for bad weather (indoor alternative, rescheduling)","Ensure health and safety and first aid","Conclusion: thorough planning with weather contingency and volunteer coordination is essential"],
    levels3("Lists planning factors in basic terms.","Explains planning and contingency partially.","Thoroughly evaluates; justified approach.")))

# ============ AIM D ============
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager communicates with the team during the event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Use clear, timely communication (radios, briefings, messages) (1) to update the team (1)","Regular communication keeps everyone coordinated (1) and aware of changes (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain the importance of the event manager remaining visible and accessible.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Being visible and accessible lets staff raise issues quickly (1) (1)","It enables prompt decision-making (1) and reassures the team (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how to balance speed and care when solving problems.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Problems at events need quick resolution (1) but careless decisions can cause further issues (1)","Balance speed with a brief assessment of options (1) to act fast but sensibly (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how to learn from problems after the event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Record problems and how they were resolved (1) and review them in the evaluation (1)","Identify root causes (1) to prevent recurrence in future events (1)"]))
add("D","D1 Staging the event","Explain",4,"AO2","","Explain the importance of a clear schedule on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A clear schedule guides all activities (1) and keeps the event on time (1)","It helps staff and suppliers know what happens when (1) (1)"]))
add("D","D1/D2 Managing","Discuss",6,"AO3","At a charity dinner, more guests attend than expected, exceeding the catering.","Discuss how the event manager should respond. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Assess the shortfall and how many guests are affected","Work with the caterer to stretch portions or source additional food","Consider a contingency supplier or local options","Communicate with guests and manage expectations","Review seating and service capacity","Conclusion: a calm, flexible response working with the caterer and communicating with guests will minimise the impact"],
    levels3("Describes the problem with limited response.","Identifies options and considers guests partially.","Thoroughly evaluates the response; justified.")))

# ============ AIM E ============
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how to evaluate whether an event achieved value for money.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Compare outcomes (attendance, satisfaction, objectives met) against the cost (1) (1)","Value for money means the benefits justified the spend (1) (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain why evaluation should consider all stakeholders.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Different stakeholders (attendees, client, staff, sponsors) have different views (1) (1)","Considering all gives a complete picture (1) of the event's success (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how to use key performance indicators (KPIs) in evaluation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["KPIs (e.g. attendance, revenue, satisfaction) provide measurable success criteria (1) (1)","Comparing actuals against KPIs (1) objectively measures performance (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how to evidence teamwork skills from an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Describe your role in the team and contributions (1) with examples (1)","Use feedback from team members (1) as evidence of your teamwork (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how to use reflection to set priorities for development.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Reflection identifies the most important gaps (1) which become priorities (1)","Focusing on priorities (1) makes development more effective (1)"]))
add("E","E1/E2 Reflection","Evaluate",12,"AO3","You organised a work experience event that went well overall, but you struggled with time pressure and received mixed feedback on your communication.","Evaluate how you will reflect on this experience and develop your skills. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Evaluate the event objectively against its objectives and the feedback received","Reflect on time management: identify where pressure arose and how to plan better","Reflect on communication: analyse the mixed feedback to pinpoint specific weaknesses","Link reflection to specific skills development (time management, communication)","Set SMART development goals and seek opportunities to practise","Conclusion: honest reflection plus targeted development will turn the weaknesses into strengths for future events"],
    levels4("Describes reflection generically.","Identifies some weaknesses with limited analysis.","Balanced reflection linking feedback to skills.","Thorough reflection with specific, justified development goals.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U4 aim counts:", {k: len(v) for k, v in aims.items()})
print("U4 total:", sum(len(v) for v in aims.values()))
