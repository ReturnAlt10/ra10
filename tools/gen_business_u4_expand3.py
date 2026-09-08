# -*- coding: utf-8 -*-
"""BTEC Business Unit 4 expansion — batch 3."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-4\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A ============
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain why setting objectives is an important first step in event planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Objectives define what the event should achieve (1) guiding all subsequent planning (1)","They provide a basis for measuring success (1) and focusing effort and resources (1)"]))
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain the importance of organising resources for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The right resources (venue, equipment, staff) must be sourced and organised (1) to deliver the event (1)","Without proper resource organisation, the event cannot run (1) or will run poorly (1)"]))
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain how an event organiser manages relationships with clients.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The organiser understands the client's requirements and keeps them informed (1) (1)","Managing the relationship ensures the event meets the client's expectations (1) and builds trust (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain how communication skills help in dealing with suppliers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Clear communication ensures suppliers understand requirements (1) and delivery details (1)","Good communication resolves issues quickly (1) and maintains positive supplier relationships (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why flexibility is a useful skill for an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Events rarely go exactly to plan (1) so organisers must adapt to changes (1)","Flexibility allows quick adjustment (1) without disrupting the event (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain how problem-solving and communication skills work together.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Problem solving identifies solutions (1); communication shares them with staff and attendees (1)","Together they ensure problems are resolved (1) and people are kept informed (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain how an event organiser can improve their time management.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Use planning tools (lists, calendars, schedules) to organise tasks (1) and prioritise (1)","Set deadlines and avoid procrastination (1) to stay on track (1)"]))
add("A","A3 Skills audit","Explain",4,"AO2","","Explain the difference between self-assessment and feedback-based skills audit.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Self-assessment is rating your own skills (1) based on your own judgement (1)","Feedback-based audit uses others' views (1) providing a more objective perspective (1)"]))
add("A","A3 Skills audit","Explain",4,"AO2","","Explain how a skills audit can inform team formation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A team skills audit reveals the combined strengths and gaps (1) (1)","It enables a balanced team to be formed (1) covering all needed skills (1)"]))
add("A","A1/A2/A3 Role","Discuss",6,"AO3","A student wants to organise a school talent show but is unsure if they have the necessary skills.","Discuss how the student can assess and develop the skills needed to organise the show. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Carry out a skills audit to identify strengths and gaps against the skills needed","Skills needed include organisation, communication, budgeting and problem solving","Develop gaps through practice, training or seeking help from others","Build a team to cover skills the student lacks","Conclusion: a skills audit followed by targeted development and team-building will prepare the student"],
    levels3("Lists skills without development.","Identifies skills audit and some development partially.","Thoroughly evaluates assessment and development; justified approach.")))

# ============ AIM B ============
add("B","B1 Types of event","Explain",4,"AO2","","Explain how the type of event affects planning requirements.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Different event types have different needs (1) e.g. a sports event needs facilities and safety, a conference needs AV and seating (1)","Planning must be tailored to the event type (1) to meet its specific requirements (1)"]))
add("B","B1 Types of event","Explain",4,"AO2","","Explain the similarities between different types of event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["All events need planning, budgeting, promotion and coordination (1) regardless of type (1)","All require resources, a venue and attention to attendee experience (1) (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how the target audience affects event planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The target audience determines the event's content, style and venue (1) (1)","Planning must match the audience's needs and expectations (1) for the event to succeed (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how competition from other events affects success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Competing events on the same date can reduce attendance (1) as potential attendees have alternatives (1)","Choosing a date and positioning that avoid clashes (1) improves the chance of success (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain the difference between feasibility and desirability of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Desirability is whether people want the event (1); feasibility is whether it can practically be delivered (1)","An event can be desirable but infeasible (1) if resources, budget or timing cannot support it (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how to carry out a feasibility study for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Assess costs, income, resources, venue, timing and demand (1) (1)","Conclude whether the event is practical and achievable (1) and identify any constraints (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how risk affects the feasibility of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Higher risk (e.g. weather, low demand, cost overruns) reduces feasibility (1) as outcomes are less certain (1)","Assessing and mitigating risk (1) improves the event's feasibility (1)"]))
add("B","B2 Critical success factors","Explain",4,"AO2","","Explain why strong planning and organisation is a critical success factor.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Strong planning ensures all elements are prepared and coordinated (1) (1)","Poor planning leads to errors and delays (1) that can cause the event to fail (1)"]))
add("B","B2 Critical success factors","Explain",4,"AO2","","Explain how critical success factors differ from aims.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Aims are what the event wants to achieve (1); critical success factors are the conditions needed to achieve them (1)","CSFs are the enablers of success (1) rather than the goals themselves (1)"]))
add("B","B1/B2 Feasibility","Discuss",6,"AO3","A community group wants to run a weekly market but is unsure whether it is feasible long-term.","Discuss how the group should assess the long-term feasibility of the market. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Assess ongoing costs (stall setup, insurance, promotion) vs income (stall fees)","Assess sustained demand from traders and shoppers","Consider resources: volunteers, venue, time commitment over the long term","Assess timing and seasonality of the market","Review critical success factors and risks over time","Conclusion: long-term feasibility depends on sustained demand and volunteer capacity; a trial period would help test this"],
    levels3("Describes feasibility factors in basic terms.","Considers costs/demand/resources partially.","Thoroughly evaluates long-term feasibility; justified conclusion.")))

# ============ AIM C ============
add("C","C1 Planning tools","Explain",4,"AO2","","Explain when critical path analysis is more useful than a Gantt chart.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Critical path analysis is useful when task dependencies are important (1) and the organiser must know which tasks delay the event (1)","A Gantt chart is better for a simple visual timeline (1) when dependencies are less critical (1)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain how planning tools help coordination between team members.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Planning tools (action plans, Gantt charts) show who does what and when (1) (1)","This shared visibility coordinates efforts (1) and prevents duplication or missed tasks (1)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain why planning tools should be updated during planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Plans change as details are confirmed and problems arise (1) so tools must reflect reality (1)","Keeping them updated ensures everyone works to the current plan (1) avoiding confusion (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain how to estimate attendance for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Base estimates on market research, past events and advance ticket sales/registrations (1) (1)","Use the estimate to plan capacity, resources and budget (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain the factors to consider when planning the layout of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Consider the flow of attendees, safety and accessibility (1) and the needs of activities/exhibits (1)","A good layout improves the experience (1) and safety (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain why a contingency fund should be included in an event budget.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Unexpected costs often arise (1) e.g. repairs, extra suppliers (1)","A contingency fund covers these without derailing the budget (1) (1)"]))
add("C","C2 Health and safety","Explain",4,"AO2","","Explain the importance of first aid provision at an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["First aid provision protects attendees and staff who become ill or injured (1) (1)","It is often a legal requirement (1) and part of the event's health and safety plan (1)"]))
add("C","C2 Health and safety","Explain",4,"AO2","","Explain the importance of fire safety at an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Fire safety measures (exits, extinguishers, evacuation plan) protect people in an emergency (1) (1)","They are a legal requirement (1) and essential to a safe event (1)"]))
add("C","C2 Risk assessment","Explain",4,"AO2","","Explain how to reduce the likelihood of a risk occurring.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Introduce control measures (1) e.g. barriers, training, supervision (1)","Controls reduce the chance or impact of the hazard (1) making the event safer (1)"]))
add("C","C2 Contingency planning","Explain",4,"AO2","","Explain the importance of contingency planning for outdoor events.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Outdoor events are exposed to weather (1) which is unpredictable (1)","Contingency plans (indoor backup, postponement) (1) protect the event from weather disruption (1)"]))
add("C","C2 Contingency planning","Explain",4,"AO2","","Explain how to develop a contingency plan.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Identify the main risks (1) and decide alternative actions for each (1)","Assign responsibility and resources to the backup (1) and communicate it to the team (1)"]))
add("C","C1/C2 Planning","Evaluate",12,"AO3","You are planning a large public music festival, which involves many suppliers, large crowds and significant safety requirements.","Evaluate the key planning considerations for this festival. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Planning tools (Gantt charts, critical path analysis) are essential to coordinate the many tasks and suppliers","Budget: large festivals have high costs (venue, performers, security, infrastructure) and income (tickets, sponsorship)","Health and safety: large crowds require extensive risk assessment, security, first aid and fire safety","Contingency: plan for weather, performer cancellations and crowd issues","Marketing: effective promotion is needed to sell tickets and attract a large audience","Legal: licences, permits and insurance are required","Conclusion: a festival demands rigorous planning across budget, safety, logistics, marketing and contingency"],
    levels4("Lists planning considerations generically.","Explains several considerations with partial application.","Balanced evaluation of the planning requirements.","Thorough evaluation covering all key considerations with justification.")))

# ============ AIM D ============
add("D","D1 Managing the event","Explain",4,"AO2","","Explain the importance of a pre-event checklist on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A pre-event checklist confirms everything is in place (1) before attendees arrive (1)","It prevents oversights (1) and ensures a smooth start (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager delegates tasks on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The manager assigns tasks to staff based on their roles and skills (1) (1)","Effective delegation ensures tasks are covered (1) and the manager can oversee overall progress (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager monitors quality on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The manager checks that services and activities meet standards (1) throughout the event (1)","Monitoring quality allows prompt correction (1) ensuring a good attendee experience (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager handles the close-down of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Close-down involves clearing the venue, returning equipment and settling with suppliers (1) (1)","It ensures the event ends cleanly (1) and obligations are met (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how to make a quick decision under pressure at an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Assess the key facts and options quickly (1) and choose the best available solution (1)","Act decisively and communicate (1) rather than delaying while the problem worsens (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how to evaluate the effectiveness of a solution after solving a problem.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Review whether the solution resolved the problem (1) and its impact on the event (1)","Learning from the outcome (1) improves future problem solving (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain the importance of documenting problems and solutions.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Documenting problems and solutions creates a record (1) for future reference (1)","It helps identify recurring issues (1) and improve planning and contingency (1)"]))
add("D","D1 Staging the event","Explain",4,"AO2","","Explain the importance of timing when staging an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Activities must run to schedule (1) to keep the event on track (1)","Good timing ensures a smooth flow (1) and avoids delays and frustration (1)"]))
add("D","D1 Staging the event","Explain",4,"AO2","","Explain the importance of the venue layout when staging an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A good layout supports the event's activities and attendee flow (1) (1)","It improves the experience and safety (1) (1)"]))
add("D","D1/D2 Managing","Discuss",6,"AO3","A speaker at a conference is running late, delaying the schedule.","Discuss how the event manager should handle this. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Assess the delay and its impact on the schedule","Re-arrange the running order to keep the event moving","Communicate with the speaker and attendees about the change","Use contingency time built into the schedule if available","Conclusion: a calm, flexible response that re-orders activities and communicates clearly will minimise disruption"],
    levels3("Describes the problem with limited response.","Identifies options and considers attendees partially.","Thoroughly evaluates the response; justified course of action.")))

# ============ AIM E ============
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain the difference between quantitative and qualitative evaluation of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Quantitative evaluation uses numbers (1) e.g. attendance, revenue, ratings (1)","Qualitative evaluation uses opinions and descriptions (1) e.g. feedback comments (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how to measure attendee satisfaction.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Use surveys or rating scales (1) to capture satisfaction scores (1)","Combine with qualitative feedback (1) to understand the reasons behind the scores (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how to evaluate the marketing of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Compare actual attendance against targets (1) and assess which channels drove attendance (1)","This shows whether marketing was effective (1) and informs future promotion (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how to present evaluation findings.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Summarise findings clearly, with data and key themes (1) (1)","Present recommendations for improvement (1) to stakeholders (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how to identify skills to develop after an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Use reflection and feedback to identify weaknesses (1) and areas where you struggled (1)","Prioritise the skills most relevant to future events (1) (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how running events builds confidence.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Successfully managing an event proves your capability (1) building confidence (1)","Overcoming challenges (1) increases self-belief for future tasks (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain the value of a reflective log for skills development.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A reflective log records experiences, feelings and learning over time (1) (1)","It tracks development (1) and helps identify patterns and improvements (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how transferable skills from event management help future careers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Event management develops skills (communication, organisation, leadership) (1) valued in many careers (1)","These transferable skills (1) improve employability across roles (1)"]))
add("E","E1/E2 Evaluation","Discuss",6,"AO3","After an event, you receive positive feedback on organisation but criticism of the catering and your own time management.","Discuss how you will use this feedback to improve. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Acknowledge the positive feedback on organisation as a strength to maintain","Address the catering criticism by choosing a better caterer or improving menu planning","Improve time management through better planning tools and prioritisation","Set specific development goals based on the feedback","Conclusion: using both positive and negative feedback constructively will improve future events and personal skills"],
    levels3("Describes the feedback in basic terms.","Identifies some improvements partially.","Thoroughly evaluates the feedback and sets justified development actions.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U4 aim counts:", {k: len(v) for k, v in aims.items()})
print("U4 total:", sum(len(v) for v in aims.values()))
