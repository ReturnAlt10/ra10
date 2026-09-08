# -*- coding: utf-8 -*-
"""BTEC Business Unit 4 expansion — batch 2."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-4\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A ============
add("A","A1 Role of event organiser","Identify",2,"AO1","","Identify two tasks of an event organiser.","(2)","short",
    short_ms("Award 1 mark each.",["Planning (1)","Organising resources (1)","Budgeting (1)","Promoting (1)","Coordinating (1)","Evaluating (1)"]))
add("A","A2 Skills","Identify",2,"AO1","","Identify two skills an event organiser needs.","(2)","short",
    short_ms("Award 1 mark each.",["Communication (1)","Organisation (1)","Problem solving (1)","Negotiation (1)","Leadership (1)","Teamwork (1)","Time management (1)"]))
add("A","A3 Skills audit","State",2,"AO1","","State what a skills audit is.","(2)","short",
    short_ms("Award 2.",["A review of an individual's current skills and abilities, identifying strengths and areas for development (2)"]))
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain why an event organiser must be able to multitask.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Event organisers manage many tasks simultaneously (1) e.g. suppliers, schedule and budget (1)","Multitasking ensures all aspects progress in parallel (1) so the event comes together on time (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why attention to detail is important for an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Small oversights can cause major problems at an event (1) e.g. a missed supplier or incorrect booking (1)","Attention to detail ensures accuracy (1) and prevents costly mistakes (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain how an event organiser can develop their negotiation skills.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Practice negotiating with suppliers and venues (1) to gain experience (1)","Prepare by researching prices and alternatives (1) and learn from feedback (1)"]))
add("A","A3 Skills audit","Explain",4,"AO2","","Explain how a skills audit identifies development needs.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The audit compares current skills against those required (1) revealing gaps (1)","These gaps become development priorities (1) addressed through training or practice (1)"]))
add("A","A3 Skills audit","Explain",4,"AO2","","Explain the benefits of carrying out a skills audit before a team event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A team skills audit shows the combined strengths and gaps of the team (1) (1)","It enables tasks to be allocated to the right people (1) and gaps to be filled through training or recruitment (1)"]))
add("A","A1/A2 Skills","Discuss",6,"AO3","You will organise a charity fun run with a team of three.","Discuss how you would allocate roles and tasks based on skills. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Conduct a skills audit to identify each member's strengths","Allocate roles accordingly: e.g. the strongest communicator handles promotion, the most organised handles logistics","Ensure budgeting, marketing and on-the-day coordination are covered","Address skill gaps through support or shared responsibility","Conclusion: matching tasks to skills improves efficiency and the event's chances of success"],
    levels3("Lists roles without skill matching.","Allocates some tasks based on skills partially.","Thoroughly evaluates role allocation based on a skills audit; justified.")))

# ============ AIM B ============
add("B","B1 Types of event","Identify",2,"AO1","","Identify two types of event.","(2)","short",
    short_ms("Award 1 mark each.",["Business event (1)","Social event (1)","Sports event (1)","Entertainment event (1)"]))
add("B","B1 Factors affecting success","Identify",2,"AO1","","Identify two factors affecting event success.","(2)","short",
    short_ms("Award 1 mark each.",["Venue (1)","Budget (1)","Timing (1)","Marketing (1)","Organisation (1)","Customer experience (1)"]))
add("B","B2 Feasibility","State",2,"AO1","","State what is meant by feasibility of an event.","(2)","short",
    short_ms("Award 2.",["Whether the event is practical and achievable given available resources, budget, venue and timing (2)"]))
add("B","B2 Critical success factors","Identify",2,"AO1","","Identify two critical success factors.","(2)","short",
    short_ms("Award 1 mark each.",["Clear aims and objectives (1)","Adequate budget (1)","Effective marketing (1)","Strong planning (1)","Positive customer experience (1)"]))
add("B","B1 Types of event","Explain",4,"AO2","","Explain how a business event differs from a social event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A business event serves commercial/professional aims (1) e.g. conferences or product launches (1)","A social event serves personal/celebratory aims (1) e.g. weddings or parties (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how the quality of organisation affects event success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Good organisation ensures tasks are completed on time and resources are in place (1) (1)","Poor organisation causes delays and errors (1) that damage the event (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how budget affects event success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An adequate budget funds quality venue, marketing and resources (1) enhancing the event (1)","An insufficient budget forces compromises (1) that reduce quality and success (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how demand affects the feasibility of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["There must be sufficient demand (interest/attendees) to justify the event (1) (1)","Low demand means low income and attendance (1) making the event infeasible (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how to assess whether an event is feasible.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Assess costs against expected income, available resources, venue and timing (1) (1)","If all these can be met within budget and demand is sufficient (1) the event is feasible (1)"]))
add("B","B2 Critical success factors","Explain",4,"AO2","","Explain why effective marketing is a critical success factor.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Effective marketing drives attendance (1) which is essential for the event's success (1)","Without it, even a well-planned event may fail (1) due to low numbers (1)"]))
add("B","B2 Critical success factors","Explain",4,"AO2","","Explain why positive customer experience is a critical success factor.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A positive experience satisfies attendees (1) leading to repeat attendance and good reputation (1)","A poor experience damages reputation (1) undermining future events (1)"]))
add("B","B1/B2 Feasibility","Evaluate",12,"AO3","A local business wants to host a large trade exhibition but has limited budget and an uncertain number of exhibitors.","Evaluate the feasibility of this trade exhibition. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Assess costs: venue, marketing, staffing and logistics for a large exhibition","Assess income: exhibitor fees, sponsorship and ticket sales","Uncertain exhibitor numbers create income risk — conduct market research to gauge demand","Assess resources: venue capacity, staff, equipment and time","Consider timing and competition from other events","Critical success factors: adequate budget, sufficient exhibitors, effective promotion","Conclusion: feasibility is uncertain given the limited budget and exhibitor uncertainty; a smaller event or phased approach may be more feasible"],
    levels4("Describes feasibility factors generically.","Considers costs/income with partial application.","Balanced evaluation of feasibility risks.","Thorough evaluation with a justified recommendation on whether/how to proceed.")))

# ============ AIM C ============
add("C","C1 Planning tools","Identify",2,"AO1","","Identify two planning tools used in event management.","(2)","short",
    short_ms("Award 1 mark each.",["Gantt chart (1)","Action plan (1)","Critical path analysis (1)","Checklist (1)"]))
add("C","C2 Factors","Identify",2,"AO1","","Identify two factors to consider when planning an event budget.","(2)","short",
    short_ms("Award 1 mark each.",["Venue hire (1)","Marketing (1)","Staff (1)","Equipment (1)","Insurance (1)","Catering (1)"]))
add("C","C2 Risk assessment","State",2,"AO1","","State what a risk assessment is.","(2)","short",
    short_ms("Award 2.",["The process of identifying hazards, assessing likelihood and severity of harm, and putting controls in place (2)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain how an action plan differs from a Gantt chart.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An action plan lists tasks, responsibilities and deadlines (1) in a table/list format (1)","A Gantt chart shows tasks against a visual timeline (1) illustrating durations and overlaps (1)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain the limitations of a Gantt chart.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A Gantt chart can become complex with many tasks (1) and may be hard to read (1)","It does not show dependencies between tasks clearly (1) unless explicitly added (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain the factors to consider when planning catering for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Consider the number of attendees and dietary requirements (1) and the budget for catering (1)","Choose a suitable caterer and menu (1) and arrange timing and service (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain the factors to consider when planning marketing for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Identify the target audience and the best channels to reach them (1) (1)","Plan the message, budget and timing of promotion (1) to maximise attendance (1)"]))
add("C","C2 Health and safety","Explain",4,"AO2","","Explain the health and safety responsibilities of an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The organiser must identify and control risks to attendees and staff (1) through risk assessment (1)","They must comply with health and safety law (1) and ensure safety measures are in place (1)"]))
add("C","C2 Risk assessment","Explain",4,"AO2","","Explain how to carry out a risk assessment for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Identify hazards (1) and assess the likelihood and severity of harm (1)","Introduce control measures to reduce risk (1) and record and review the assessment (1)"]))
add("C","C2 Contingency planning","Explain",4,"AO2","","Explain the difference between risk assessment and contingency planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Risk assessment identifies hazards and controls to prevent them (1) (1)","Contingency planning prepares responses if problems do occur despite controls (1) (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain why accessibility should be considered when planning an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Accessibility ensures all attendees, including those with disabilities, can attend and participate (1) (1)","It is a legal requirement and good practice (1) and broadens the potential audience (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain why permits and licences may be needed for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Certain events (e.g. selling alcohol, playing music, large gatherings) require permits or licences (1) (1)","Obtaining them is a legal requirement (1) and failing to do so risks fines or cancellation (1)"]))
add("C","C1/C2 Planning","Discuss",6,"AO3","You are planning a school awards evening with a limited budget and 200 expected guests.","Discuss the key factors to consider when planning this event. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Budget: costs of venue, catering, awards and marketing must fit the limited budget","Resources: venue, staff/volunteers, equipment for 200 guests","Use planning tools (Gantt chart/action plan) to schedule tasks","Health and safety: risk assessment for the venue and guests","Contingency: plan for no-shows, equipment failure","Conclusion: careful budgeting and planning, with safety and contingency, are essential"],
    levels3("Lists planning factors in basic terms.","Explains budget/resources/safety with partial application.","Thoroughly evaluates the planning factors; justified approach.")))

# ============ AIM D ============
add("D","D1 Managing the event","Identify",2,"AO1","","Identify two responsibilities of an event manager on the day.","(2)","short",
    short_ms("Award 1 mark each.",["Coordinating staff (1)","Overseeing schedule (1)","Handling problems (1)","Ensuring health and safety (1)","Managing budget (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager manages suppliers on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The manager liaises with suppliers to confirm deliveries and services (1) and resolves any issues (1)","Coordinating suppliers ensures everything arrives on time (1) and meets requirements (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager manages attendees on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The manager oversees arrival, registration and crowd flow (1) to keep attendees safe and comfortable (1)","They handle queries and complaints (1) ensuring a positive experience (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain why briefing staff before the event is important.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A briefing ensures staff understand their roles, the schedule and safety procedures (1) (1)","It reduces confusion and errors (1) so the event runs smoothly (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how an event manager prioritises problems on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Assess each problem's impact and urgency (1) then deal with the most serious first (1)","Prioritising ensures critical issues are resolved (1) before they escalate (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how an event manager can prevent problems.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Thorough planning and risk assessment prevent many problems (1) by identifying risks in advance (1)","Contingency plans and checking arrangements (1) reduce the likelihood of problems occurring (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain the financial implications of problems at an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Problems can cause extra costs (1) e.g. refunds, replacement suppliers or lost revenue (1)","Good problem solving minimises these costs (1) protecting the event's budget (1)"]))
add("D","D1 Staging the event","Explain",4,"AO2","","Explain what is meant by 'staging' an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Staging is setting up and running the event itself (1) including layout, equipment and activities (1)","It involves managing the event as it happens (1) to deliver the planned experience (1)"]))
add("D","D1/D2 Managing","Evaluate",12,"AO3","On the day of a wedding, heavy rain floods the outdoor ceremony area. As the event manager, you must respond.","Evaluate how an event manager should respond to this problem. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Assess the situation: impact on the ceremony and guest comfort","Use a contingency plan (indoor alternative, marquee, rescheduling) prepared in advance","Communicate promptly with the couple and guests to manage expectations","Consider health and safety of guests in the rain","Manage the financial implications (extra costs) and the client relationship","Stay calm and coordinate staff to implement the backup quickly","Conclusion: a calm, communicative response using a pre-planned contingency minimises disruption and protects the client experience"],
    levels4("Describes the problem with limited response.","Identifies options and considers guests.","Balanced evaluation of the response considering safety, cost and client.","Thorough evaluation with a justified, contingency-backed course of action.")))

# ============ AIM E ============
add("E","E1 Evaluating the event","Identify",2,"AO1","","Identify two ways to evaluate an event.","(2)","short",
    short_ms("Award 1 mark each.",["Feedback from attendees (1)","Review against objectives (1)","Budget analysis (1)","Attendance/sales review (1)","Team debrief (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain why evaluation should be carried out soon after the event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Evaluating soon after captures fresh feedback and memories (1) while details are still clear (1)","Prompt evaluation allows quick action on issues (1) and timely learning for future events (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how to collect feedback effectively.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Use methods suited to attendees (1) e.g. surveys, questionnaires or informal conversations (1)","Ask clear, relevant questions (1) to gather useful, actionable feedback (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how evaluation helps improve future events.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Evaluation identifies strengths to repeat and weaknesses to fix (1) (1)","Applying these lessons improves planning and delivery (1) for future events (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how to evidence skills development from running an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Keep records of what you did and feedback received (1) and reflect on what you learned (1)","This evidence demonstrates development (1) useful for CVs and applications (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain the role of feedback from others in skills development.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Feedback from others provides an external view of your performance (1) highlighting strengths and blind spots (1)","It supports more accurate self-assessment (1) and targeted development (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how to set SMART development goals after an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Identify specific areas to improve and set measurable targets with a deadline (1) (1)","SMART goals make development concrete (1) and allow progress to be tracked (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how reflection links event evaluation to personal growth.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Reflection analyses both the event's outcome and your own contribution (1) (1)","It converts experience into personal learning (1) driving growth and improvement (1)"]))
add("E","E1/E2 Reflection","Evaluate",12,"AO3","After organising a successful charity event, you must reflect on your role and plan your development for future events.","Evaluate the importance of reflection and how you will use it to develop your skills. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Evaluate the event against objectives and gather feedback","Reflect on your own performance: which skills were effective, which need work","Consider feedback from the team and attendees for a balanced view","Link reflection to specific skills (communication, leadership, problem solving, budgeting)","Set SMART development goals based on the findings","Conclusion: reflection is essential to convert experience into learning; clear development goals ensure improvement for future events"],
    levels4("Describes reflection generically.","Identifies some strengths/weaknesses with limited analysis.","Balanced reflection linking event outcome to personal skills.","Thorough reflection with specific, justified development goals.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U4 aim counts:", {k: len(v) for k, v in aims.items()})
print("U4 total:", sum(len(v) for v in aims.values()))
