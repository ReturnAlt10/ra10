# -*- coding: utf-8 -*-
"""BTEC Business Unit 4 (Managing an Event) expansion — batch 1."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, lvl_ms, levels3, levels4, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-4\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDE'}
NEW = []

def add(aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    NEW.append((aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

# ============ AIM A — Role and skills of an event organiser ============
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain the planning role of an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Planning involves setting the event's aims and objectives (1) and deciding the details such as venue, date and programme (1)","It establishes a clear plan that guides all other activities (1) ensuring the event meets its purpose (1)"]))
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain the budgeting role of an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Budgeting involves estimating the income and costs of the event (1) and allocating funds across activities (1)","It ensures the event is financially viable (1) and spending is controlled to avoid overspending (1)"]))
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain the promotion role of an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Promotion involves marketing the event to attract attendees (1) through advertising, social media and PR (1)","Effective promotion maximises attendance and revenue (1) helping the event succeed (1)"]))
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain the coordination role of an event organiser on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Coordination involves managing staff, suppliers and activities on the day (1) to ensure everything runs to plan (1)","It requires overseeing the schedule and solving problems (1) so the event runs smoothly (1)"]))
add("A","A1 Role of event organiser","Explain",4,"AO2","","Explain the evaluation role of an event organiser after the event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Evaluation involves assessing whether the event met its aims (1) and gathering feedback from attendees and staff (1)","It identifies strengths and areas for improvement (1) informing future events (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why organisation is an essential skill for an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Organising an event involves managing many tasks, deadlines and resources (1) which must be coordinated carefully (1)","Good organisation ensures nothing is overlooked (1) and the event runs on time and within budget (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why negotiation is an important skill for an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Event organisers negotiate with venues, suppliers and contractors (1) to get the best prices and terms (1)","Effective negotiation reduces costs (1) and secures the resources needed within budget (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why leadership is an important skill for an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Leadership involves directing and motivating staff and volunteers (1) so they work effectively towards the event's goals (1)","Strong leadership keeps the team focused and confident (1) especially under pressure on the day (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why teamwork is an important skill for an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Events are delivered by teams, so organisers must work well with others (1) and coordinate their efforts (1)","Good teamwork improves efficiency and morale (1) contributing to a successful event (1)"]))
add("A","A2 Skills","Explain",4,"AO2","","Explain why time management is an important skill for an event organiser.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Events have fixed deadlines and schedules (1) so organisers must prioritise and meet them (1)","Effective time management prevents delays (1) and ensures tasks are completed on time (1)"]))
add("A","A3 Skills audit","Explain",4,"AO2","","Explain how a skills audit helps an individual prepare for organising an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A skills audit identifies the individual's strengths and weaknesses (1) showing what they can do and where they need support (1)","It enables targeted development (1) so they can build the skills needed for the event (1)"]))
add("A","A3 Skills audit","Explain",4,"AO2","","Explain the different formats a skills audit can take.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A skills audit can be a self-assessment checklist (1) where the individual rates their own skills (1)","It can also use feedback from others (1) or be based on evidence of past performance (1)"]))
add("A","A3 Skills audit","Explain",4,"AO2","","Explain why a skills audit should be reviewed over time.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Skills change as the individual gains experience (1) so a regular review keeps the audit up to date (1)","Reviewing it tracks development (1) and highlights new areas to improve (1)"]))
add("A","A1/A2 Role and skills","Discuss",6,"AO3","You have been asked to organise a large community festival. You have strong communication skills but limited budgeting experience.","Discuss the skills you will need to develop and how you will use your existing strengths. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Existing strength: strong communication helps liaise with suppliers, volunteers and the community","Skills to develop: budgeting, to manage the festival's finances; and organisation, to coordinate the many tasks","Time management and problem solving will also be important on the day","Use a skills audit to identify and plan development","Conclusion: leverage communication skills while actively developing budgeting and organisational skills through training and support"],
    levels3("Lists skills without development.","Explains strengths and areas to develop with partial application.","Thoroughly evaluates the skills needed and a development plan; justified.")))

# ============ AIM B — Feasibility of an event ============
add("B","B1 Types of event","Explain",4,"AO2","","Explain the characteristics of a business event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A business event serves a commercial or professional purpose (1) e.g. conferences, product launches, trade shows (1)","It aims to achieve business objectives (1) such as networking, sales or brand promotion (1)"]))
add("B","B1 Types of event","Explain",4,"AO2","","Explain the characteristics of a social event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A social event is for personal or celebratory purposes (1) e.g. weddings, parties, birthdays (1)","It focuses on enjoyment and bringing people together (1) rather than commercial aims (1)"]))
add("B","B1 Types of event","Explain",4,"AO2","","Explain the characteristics of a sports event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A sports event involves competitive or participatory sport (1) e.g. tournaments, races, matches (1)","It may aim to entertain, raise funds or promote fitness (1) and requires facilities and safety management (1)"]))
add("B","B1 Types of event","Explain",4,"AO2","","Explain the characteristics of an entertainment event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An entertainment event provides enjoyment to an audience (1) e.g. concerts, festivals, performances (1)","It typically involves performers, venues and large audiences (1) and generates revenue through ticket sales (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how the venue affects the success of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The venue must be suitable in size, location and facilities (1) to meet the event's needs (1)","A good venue enhances the attendee experience (1) while a poor venue can reduce attendance and satisfaction (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how timing affects the success of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The date and time must suit the target audience (1) and avoid clashes with other events (1)","Good timing maximises attendance (1) while poor timing reduces it (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how marketing affects the success of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Effective marketing raises awareness and attracts attendees (1) (1)","Without promotion, even a well-planned event may fail due to low attendance (1) (1)"]))
add("B","B1 Factors affecting success","Explain",4,"AO2","","Explain how the customer experience affects the success of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A positive customer experience leads to satisfaction and repeat attendance (1) and good word-of-mouth (1)","A poor experience damages the event's reputation (1) reducing future success (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how cost affects the feasibility of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The event's costs must be affordable and likely to be covered by income (1) otherwise it is not feasible (1)","If expected costs exceed available funds and income (1) the event cannot go ahead as planned (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how resources affect the feasibility of an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Suitable resources (staff, equipment, venue, time) must be available (1) to deliver the event (1)","A shortage of key resources (1) makes the event impractical (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how the venue affects feasibility.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A suitable venue must be available on the required date and affordable (1) (1)","If no suitable venue is available or affordable (1) the event is not feasible (1)"]))
add("B","B2 Feasibility","Explain",4,"AO2","","Explain how timing affects feasibility.","(4)","short",
    short_ms("Award 1+1. Max 4.",["There must be enough time to plan and prepare the event (1) and the date must be practical (1)","An unrealistic timescale or unsuitable date (1) makes the event infeasible (1)"]))
add("B","B2 Critical success factors","Explain",4,"AO2","","Explain why clear aims and objectives are a critical success factor.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Clear aims define what the event should achieve (1) guiding all planning and decisions (1)","Without them, the event lacks focus (1) and success cannot be measured (1)"]))
add("B","B2 Critical success factors","Explain",4,"AO2","","Explain why an adequate budget is a critical success factor.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An adequate budget funds all the event's needs (1) ensuring quality can be delivered (1)","Insufficient funds force compromises (1) that can undermine the event's success (1)"]))
add("B","B1/B2 Feasibility","Discuss",6,"AO3","A student society wants to hold a music gig with a limited budget of £800. The venue costs £500, and they expect to sell 100 tickets.","Discuss how the society should assess the feasibility of this gig. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Assess costs: venue £500 plus performers, equipment, marketing and safety","Estimate income: 100 tickets — determine a ticket price that covers costs (e.g. £8+ per ticket)","Assess resources: volunteers, equipment, insurance, venue availability","Consider demand: will they realistically sell 100 tickets?","Identify critical success factors: adequate budget, effective promotion, clear aims","Conclusion: feasibility depends on ticket sales covering costs and available resources; a break-even analysis and demand check are essential"],
    levels3("Describes feasibility factors in basic terms.","Considers costs/income/resources with partial application.","Thoroughly evaluates feasibility; justified conclusion.")))

# ============ AIM C — Planning the event ============
add("C","C1 Planning tools","Explain",4,"AO2","","Explain the purpose of an action plan in event management.","(4)","short",
    short_ms("Award 1+1. Max 4.",["An action plan lists the tasks needed, who is responsible and deadlines (1) (1)","It breaks the event into manageable steps (1) ensuring tasks are completed on time (1)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain what critical path analysis is used for.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Critical path analysis identifies the sequence of tasks that determines the event's total duration (1) (1)","It shows which tasks cannot be delayed (1) without delaying the whole event (1)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain the advantages of using a Gantt chart.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A Gantt chart gives a clear visual timeline of tasks (1) making the schedule easy to understand (1)","It shows task durations, overlaps and deadlines (1) helping monitor progress (1)"]))
add("C","C1 Planning tools","Explain",4,"AO2","","Explain the purpose of a checklist in event planning.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A checklist ensures no essential task or item is forgotten (1) by listing everything that must be done (1)","It provides a simple way to track completion (1) and reduce the risk of oversight (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain the factors to consider when choosing a venue.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Consider capacity, location, facilities, accessibility and cost (1) (1)","The venue must suit the event type and audience (1) and be available on the required date (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain the factors to consider when planning staffing for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Consider how many staff/volunteers are needed and their roles (1) and their skills and training (1)","Staff must be recruited, briefed and scheduled (1) to cover all areas of the event (1)"]))
add("C","C2 Health and safety","Explain",4,"AO2","","Explain what a risk assessment involves.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A risk assessment identifies hazards (1) and evaluates the likelihood and severity of harm (1)","It then puts controls in place to reduce the risk (1) and should be reviewed (1)"]))
add("C","C2 Health and safety","Explain",4,"AO2","","Explain why a risk assessment is important for an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A risk assessment protects attendees and staff from harm (1) by identifying and controlling risks (1)","It ensures legal compliance (1) and protects organisers from liability (1)"]))
add("C","C2 Contingency planning","Explain",4,"AO2","","Explain what a contingency plan is.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A contingency plan is a pre-prepared backup plan (1) for dealing with unexpected problems (1)","It outlines alternative actions if things go wrong (1) e.g. bad weather or supplier failure (1)"]))
add("C","C2 Contingency planning","Explain",4,"AO2","","Explain how contingency planning reduces risk.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Contingency planning means the business is prepared for problems (1) so it can respond quickly (1)","It minimises disruption and financial loss (1) as a fallback is already in place (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain the factors to consider when planning an event budget.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Estimate all costs (venue, marketing, staff, equipment, insurance) (1) and expected income (tickets, sponsorship) (1)","Build in a contingency for unexpected costs (1) and ensure the budget is realistic (1)"]))
add("C","C2 Factors","Explain",4,"AO2","","Explain why insurance is important when planning an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Insurance protects the organisers against financial loss (1) e.g. public liability, cancellation (1)","It is often a legal or venue requirement (1) and provides peace of mind (1)"]))
add("C","C1/C2 Planning","Discuss",6,"AO3","You are planning an outdoor school summer fair, which could be affected by bad weather.","Discuss the key planning considerations, including contingency planning, for this event. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Plan the budget, venue, staff/volunteers and activities for the fair","Use planning tools (Gantt chart/action plan) to schedule tasks","Carry out a risk assessment covering the outdoor setting and crowds","Prepare contingency plans for bad weather (e.g. indoor alternative, marquees, postponement)","Ensure health and safety and insurance are in place","Conclusion: thorough planning plus a weather contingency plan is essential for an outdoor event"],
    levels3("Lists planning factors in basic terms.","Explains planning plus contingency with partial application.","Thoroughly evaluates the planning and contingency needs; justified approach.")))

# ============ AIM D — Staging and managing the event ============
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager coordinates staff on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The event manager briefs staff on their roles and the schedule (1) and directs them during the event (1)","Coordination ensures everyone knows what to do (1) and tasks are covered (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager oversees the schedule on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The manager monitors activities against the planned timeline (1) ensuring each part starts and finishes on time (1)","They adjust the schedule if needed (1) to keep the event running smoothly (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager ensures health and safety on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The manager ensures safety controls are in place and monitored (1) e.g. crowd control, first aid, fire safety (1)","They respond to any safety issues promptly (1) to protect attendees and staff (1)"]))
add("D","D1 Managing the event","Explain",4,"AO2","","Explain how an event manager manages the budget on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The manager tracks spending against the budget (1) to avoid overspending (1)","They approve only necessary expenditure (1) and record any variations (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain the steps in solving an unexpected problem at an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Identify and assess the problem and its impact (1) then consider possible solutions (1)","Implement the best solution and communicate with those affected (1) to minimise disruption (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain why staying calm is important when problems arise at an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Staying calm allows the manager to think clearly (1) and make rational decisions (1)","It reassures staff and attendees (1) preventing panic and further problems (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how communication helps solve problems at an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Clear communication ensures staff know about the problem and the response (1) (1)","Communicating with attendees manages their expectations (1) and reduces frustration (1)"]))
add("D","D2 Problem solving","Explain",4,"AO2","","Explain how contingency plans support problem solving on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Contingency plans provide pre-agreed responses (1) so the manager can act quickly when problems occur (1)","They reduce decision time and uncertainty (1) improving the response (1)"]))
add("D","D1 Staging the event","Explain",4,"AO2","","Explain how an event manager ensures good customer experience on the day.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The manager ensures services run smoothly and staff are helpful (1) and responds to customer needs and feedback (1)","A positive experience satisfies attendees (1) and builds the event's reputation (1)"]))
add("D","D1/D2 Managing and problem solving","Discuss",6,"AO3","During a conference, the catering supplier fails to arrive.","Discuss how the event manager should respond to this problem. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Assess the problem: how many attendees are affected and what alternatives exist","Contact the supplier to establish what happened and whether they can still deliver","Use a contingency plan (e.g. alternative caterer, local food outlets)","Communicate with attendees and manage their expectations","Consider financial implications (refunds, extra costs)","Conclusion: respond calmly, use contingency options, communicate clearly, and minimise disruption to attendees"],
    levels3("Describes the problem with limited response options.","Identifies some options and considers attendees.","Thoroughly evaluates the response; justified course of action.")))

# ============ AIM E — Evaluation and reflection ============
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how feedback is used to evaluate an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Feedback from attendees and staff reveals how the event was experienced (1) and what worked well or badly (1)","It provides evidence for evaluation (1) and identifies improvements for the future (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how an event is reviewed against its objectives.","(4)","short",
    short_ms("Award 1+1. Max 4.",["The event's outcomes are compared against the aims and objectives set at the start (1) (1)","This shows whether the event achieved what it intended (1) and by how much (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain how the budget is analysed in evaluation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Actual income and costs are compared with the budget (1) to identify variances (1)","This reveals whether the event was financially successful (1) and where money was over- or under-spent (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain why attendance/sales data is used in evaluation.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Attendance/sales data shows how many people the event attracted (1) compared with targets (1)","It is a key measure of demand and financial success (1) (1)"]))
add("E","E1 Evaluating the event","Explain",4,"AO2","","Explain the purpose of a team debrief after an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["A debrief gathers the team's views on what went well and what could improve (1) (1)","It captures learning from those involved (1) to inform future events (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how running an event develops communication skills.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Organising an event requires communicating with many people (1) e.g. suppliers, staff and attendees (1)","This practice improves clarity, confidence and listening (1) (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how running an event develops leadership skills.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Organisers direct and motivate a team (1) making decisions and taking responsibility (1)","This experience builds leadership capability (1) useful in future roles (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how reflection supports personal development.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Reflection identifies strengths and weaknesses (1) so the individual knows what to improve (1)","It turns experience into learning (1) enabling continuous improvement (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how to set development goals after evaluating an event.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Identify specific areas for improvement from the evaluation (1) and set SMART goals to address them (1)","Goals provide focus for development (1) and can be reviewed before the next event (1)"]))
add("E","E2 Skills development","Explain",4,"AO2","","Explain how running an event develops problem-solving skills.","(4)","short",
    short_ms("Award 1+1. Max 4.",["Events inevitably involve unexpected problems (1) which organisers must resolve under pressure (1)","This experience strengthens problem-solving ability (1) transferable to other situations (1)"]))
add("E","E1/E2 Evaluation and reflection","Discuss",6,"AO3","After organising a charity quiz night, you must evaluate the event and your own performance.","Discuss how you would evaluate the event and use the findings to develop your skills. (6)","(6)","extended_levels",
    lvl_ms("Levels-based.",
      ["Evaluate the event against its objectives (e.g. funds raised, attendance)","Gather feedback from attendees and the team","Review the budget and identify variances","Reflect on your own performance: which skills were strong, which need development","Set specific development goals based on the findings","Conclusion: evaluation identifies both event and personal learning, which should be turned into clear development actions"],
    levels3("Describes evaluation in basic terms.","Identifies some evaluation methods and reflection partially.","Thoroughly evaluates and links findings to skills development; justified.")))

for (aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms) in NEW:
    nid = next_id(aims[aim], aim)
    aims[aim].append(q(nid, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms))

write_aims(BASE, aims)
print("U4 aim counts:", {k: len(v) for k, v in aims.items()})
print("U4 total:", sum(len(v) for v in aims.values()))
