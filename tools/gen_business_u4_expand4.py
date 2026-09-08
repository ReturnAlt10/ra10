# -*- coding: utf-8 -*-
"""BTEC Business Unit 4 expansion — batch 4."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-4\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A ============
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain how an event organiser ensures an event meets its purpose.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The organiser keeps the event's aims in focus throughout planning (1) and checks decisions against them (1)","They evaluate afterwards whether the purpose was achieved (1) (1)"]))
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain the importance of the evaluation stage even for successful events.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Even successful events have areas to improve (1) which evaluation identifies (1)","Evaluation provides learning for the future (1) rather than assuming success means nothing can be better (1)"]))
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain how an event organiser manages multiple suppliers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The organiser coordinates suppliers' requirements and timelines (1) ensuring they work together (1)","Clear communication and a schedule (1) keep suppliers aligned (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why decision-making is an important skill for an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Event organisers make many decisions throughout planning and on the day (1) (1)","Good decision-making keeps the event on track (1) and resolves issues effectively (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain how an event organiser can build a strong team.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Recruit people with complementary skills (1) and brief them clearly on their roles (1)","Motivate and support the team (1) to build commitment and effectiveness (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why adaptability is important when plans change.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Plans often change due to unforeseen events (1) so the organiser must adapt quickly (1)","Adaptability keeps the event on track (1) despite changes (1)"]))
add("A","A3 Skills audit","Explain",4,"AO2","","Explain how often a skills audit should be updated and why.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A skills audit should be updated regularly (1) as skills develop with experience (1)","Regular updates keep it accurate (1) so development planning stays relevant (1)"]))
add("A","A3 Skills audit","Explain",4,"AO2","","Explain how a skills audit supports career planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A skills audit identifies strengths and gaps (1) informing career direction (1)","It highlights skills to develop (1) to pursue desired roles (1)"]))
add("A","A1/A2 Role","Discuss",6,"AO3","You are organising a product launch event for a local business on a tight budget.","Discuss the most important skills you will need and how you will use them. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Budgeting and negotiation are critical on a tight budget — to secure good deals from suppliers","Organisation is needed to plan the launch efficiently","Communication is key with the client, suppliers and attendees","Problem solving will be needed to handle a tight budget and unexpected issues","Conclusion: budgeting, negotiation and organisation are most important, supported by communication and problem solving"],
    levels3("Lists skills without development.","Explains several skills with partial application.","Thoroughly evaluates the skills needed; justified.")))

# ============ AIM B ============
add("B","B1 Types of event","Explain",4,"AO2","","Explain why an event organiser must understand the purpose of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The purpose shapes all planning decisions (1) e.g. content, venue and audience (1)","Understanding it ensures the event delivers what the client wants (1) (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how sponsorship affects event success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Sponsorship provides funding (1) improving the budget and quality (1)","Sponsors may also promote the event (1) increasing awareness and attendance (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how location affects event success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A convenient, accessible location increases attendance (1) (1)","A poor location reduces accessibility (1) and can deter attendees (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how price/ticket pricing affects event success.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Pricing affects demand and revenue (1) — too high deters attendees, too low reduces income (1)","Pricing must balance affordability with covering costs (1) (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how to assess the financial feasibility of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Estimate all costs and expected income (1) and calculate whether income covers costs (1)","Consider break-even and contingency (1) to judge financial viability (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how the availability of staff affects feasibility.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Sufficient staff/volunteers must be available (1) to run the event (1)","Staff shortages make the event impractical (1) or reduce its quality (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain why a feasibility assessment should be carried out early.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Early assessment identifies problems before significant time and money are committed (1) (1)","It allows the plan to be adjusted or abandoned (1) if the event is not feasible (1)"]))
add("B","B2 Critical success factors","Explain",4,"AO2","","Explain how critical success factors help an organiser prioritise.","(4)","short",
    short_ms("Award 1+1. Max 4.",["CSFs identify the few things that matter most (1) so effort is focused there (1)","Prioritising CSFs ensures resources go to what drives success (1) (1)"]))
add("B","B1/B2 Feasibility","Evaluate",12,"AO3","A charity is considering a sponsored skydive event. It has enthusiastic volunteers but a very small budget and uncertain participant numbers.","Evaluate the feasibility of this sponsored skydive event. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Costs: skydiving requires specialist providers, insurance and safety — potentially high relative to the small budget","Income: relies on participant sponsorship, which is uncertain","Resources: enthusiastic volunteers help, but specialist providers are essential","Demand: uncertain participant numbers create financial risk","Safety and legal requirements add complexity and cost","Critical success factors: sufficient participants, adequate budget, specialist provider","Conclusion: feasibility is questionable given the small budget and uncertain numbers; the charity should secure sponsorship or deposits before committing"],
    levels4("Describes feasibility factors generically.","Considers costs/income/risk with partial application.","Balanced evaluation of feasibility.","Thorough evaluation with a justified recommendation.")))

# ============ AIM C ============
add("C","C1 Planning tools","Explain",4,"AO2","","Explain how to create an action plan for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["List all tasks, assign responsibility and set deadlines (1) (1)","Order tasks logically and monitor progress (1) against the plan (1)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain the benefits of using multiple planning tools together.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Different tools suit different purposes (1) e.g. action plans for tasks, Gantt charts for timelines (1)","Using them together gives a complete picture (1) improving planning and coordination (1)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain how planning tools help manage a budget.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Planning tools schedule when spending occurs (1) helping plan cash flow (1)","They track tasks that have costs attached (1) keeping spending under control (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain the factors to consider when planning entertainment for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Consider the audience's preferences and the event's purpose (1) and the budget for entertainment (1)","Book suitable performers and arrange timing, equipment and licences (1) (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain the factors to consider when planning security for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Assess the security risks based on the event type and crowd (1) and budget (1)","Arrange appropriate security staff and measures (1) to protect attendees (1)"]))
add("C","C2 Health and safety","Explain",4,"AO2","","Explain the role of a risk assessment in legal compliance.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Risk assessments are a legal requirement under health and safety law (1) (1)","Completing them demonstrates compliance (1) and protects against liability (1)"]))
add("C","C2 Health and safety","Explain",4,"AO2","","Explain how to manage crowd safety at a large event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Plan crowd flow, capacity limits and barriers (1) and provide stewards/security (1)","Risk assess crowd hazards (1) and have an evacuation plan (1)"]))
add("C","C2 Risk assessment","Explain",4,"AO2","","Explain the difference between a hazard and a risk.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A hazard is something with the potential to cause harm (1) e.g. a trailing cable (1)","A risk is the likelihood and severity of harm occurring from the hazard (1) (1)"]))
add("C","C2 Contingency planning","Explain",4,"AO2","","Explain the importance of contingency planning for key suppliers.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A key supplier failure could halt the event (1) so a backup supplier should be identified (1)","Contingency for suppliers (1) ensures the event can continue if a supplier lets the business down (1)"]))
add("C","C2 Contingency planning","Explain",4,"AO2","","Explain how contingency planning relates to budget.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Contingency responses (backup suppliers, indoor alternatives) cost money (1) so a contingency fund is needed (1)","The budget should include a contingency (1) to fund the backups if needed (1)"]))
add("C","C1/C2 Planning","Discuss",6,"AO3","You are planning a charity gala dinner for 150 guests with a formal programme.","Discuss the key planning factors and tools for this event. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Plan the budget (venue, catering, entertainment, marketing) for 150 guests","Use planning tools (Gantt chart/action plan) to schedule the programme and tasks","Coordinate suppliers (venue, caterer, AV, entertainment)","Health and safety: risk assessment for the venue and guests","Contingency: plan for supplier or programme issues","Conclusion: careful budgeting, scheduling and supplier coordination, with safety and contingency, are key"],
    levels3("Lists planning factors in basic terms.","Explains tools and factors with partial application.","Thoroughly evaluates the planning; justified approach.")))

# ============ AIM D ============
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager handles a last-minute change to the programme.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Assess the impact of the change (1) and re-arrange the programme accordingly (1)","Communicate the change to those affected (1) and keep the event moving (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain the importance of monitoring time throughout the event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Monitoring time ensures activities stay on schedule (1) (1)","Early detection of delays (1) allows corrective action before they worsen (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager ensures supplier deliveries are correct.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Check deliveries against the order (1) on arrival (1)","Address any discrepancies immediately (1) to avoid problems later (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain the importance of having authority to make decisions on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The event manager needs authority to make quick decisions (1) without waiting for approval (1)","This enables rapid problem solving (1) which is essential on the day (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how to remain objective when solving problems under stress.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Focus on the facts and the impact (1) rather than emotion (1)","Consider options logically (1) to choose the best solution (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain the difference between reacting to and anticipating problems.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Reacting is dealing with a problem after it occurs (1) (1)","Anticipating is identifying likely problems in advance (1) and preparing for them (1)"]))
add("D","D1 Staging the event","Explain",4,"AO2","","Explain how staging an event tests an organiser's planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Staging reveals whether the planning was thorough and accurate (1) (1)","Gaps in planning become apparent on the day (1) testing the organiser's ability to respond (1)"]))
add("D","D1/D2 Managing","Evaluate",12,"AO3","During a sports event, the public address system fails, preventing announcements to the crowd.","Evaluate how the event manager should respond. (12)","(12)","extended_levels",
    lvl_ms("Levels-based, 4 levels.",
      ["Assess the impact: announcements (schedule, safety) cannot be made to the crowd","Check whether a backup PA system or megaphones are available (contingency)","Arrange an alternative communication method quickly","Communicate with staff so they can relay information to attendees","Consider safety implications of poor communication","Address the cause (e.g. power or equipment) if possible","Conclusion: a calm, prompt response using contingency options and staff communication minimises disruption and maintains safety"],
    levels4("Describes the problem with limited response.","Identifies options and considers safety partially.","Balanced evaluation of the response.","Thorough evaluation with a justified, safety-focused course of action.")))

# ============ AIM E ============
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how to evaluate the budget performance of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Compare actual income and costs against the budget (1) and calculate variances (1)","Analyse the reasons for variances (1) and their impact on profitability (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain why both success and failure should be analysed in evaluation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Analysing successes identifies what to repeat (1); analysing failures identifies what to fix (1)","Both provide learning (1) that improves future events (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how to use evaluation to inform future planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Evaluation findings identify improvements (1) which are incorporated into future plans (1)","This creates a cycle of continuous improvement (1) making each event better (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain the importance of objectivity in evaluation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Objectivity means assessing based on evidence (1) rather than personal bias (1)","Objective evaluation produces accurate learning (1) and avoids overlooking problems (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how to measure skills development over time.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Repeat the skills audit over time (1) to track changes in skills (1)","Use evidence (feedback, outcomes) (1) to confirm development (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how mentoring or coaching can support skills development.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A mentor provides guidance and feedback (1) helping develop skills (1)","Coaching supports learning through practice and reflection (1) (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain the value of seeking feedback from attendees and staff.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Feedback from attendees and staff provides diverse perspectives (1) on your performance (1)","It reveals strengths and areas to improve (1) that self-assessment might miss (1)"]))
add("E","E1/E2 Reflection","Discuss",6,"AO3","After organising a team event, you realise you delegated poorly, causing confusion, though the event itself was successful.","Discuss how you will reflect on and improve your delegation skills. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Reflect on why delegation caused confusion — unclear instructions or mismatched roles","Identify what effective delegation looks like (clear roles, instructions, support)","Set a development goal to improve delegation","Practise delegation in future events, briefing staff clearly","Seek feedback on the improvement","Conclusion: targeted reflection and deliberate practice will improve delegation for future events"],
    levels3("Describes the issue in basic terms.","Identifies some improvement partially.","Thoroughly evaluates reflection and improvement; justified.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U4 aim counts:", {k: len(v) for k, v in aims.items()})
print("U4 total:", sum(len(v) for v in aims.values()))
