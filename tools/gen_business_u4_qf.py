# -*- coding: utf-8 -*-
"""Generate BTEC Business Unit 4 quiz + flashcards."""
import json, os

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-4\data"

def mcq(i, aim, topic, q, choices, correct, expl):
    return {"id": "Q%03d" % i, "learning_aim": aim, "topic": topic, "type": "mcq",
            "question": q, "choices": choices, "correct_index": correct, "explanation": expl}

quiz = [
 mcq(1,"A","Role of organiser","Which is a task of an event organiser?",["Designing software","Planning and coordinating the event","Manufacturing products","Auditing accounts"],1,"Event organisers plan, coordinate and manage events."),
 mcq(2,"A","Skills","Which skill is most about dealing with unexpected problems?",["Communication","Problem solving","Time management","Negotiation"],1,"Problem solving is resolving unexpected issues that arise."),
 mcq(3,"A","Skills","Coordinating a team of volunteers requires which skill?",["Problem solving","Leadership/teamwork","Budgeting","Marketing"],1,"Leadership and teamwork involve directing and motivating people."),
 mcq(4,"A","Skills audit","A skills audit identifies:",["Only weaknesses","Strengths and areas for development","Only qualifications","Financial assets"],1,"A skills audit reviews current skills, strengths and development areas."),
 mcq(5,"A","Skills","Which skill ensures tasks are completed on schedule?",["Time management","Negotiation","Creativity","Numeracy"],0,"Time management ensures tasks meet deadlines."),
 mcq(6,"B","Types of event","A conference for a business is which type of event?",["Social","Business","Sports","Entertainment"],1,"Conferences, product launches and meetings are business events."),
 mcq(7,"B","Types of event","A music festival is which type of event?",["Business","Social","Sports","Entertainment"],3,"Concerts and festivals are entertainment events."),
 mcq(8,"B","Feasibility","Feasibility of an event means:",["How popular it is","Whether it is practical and achievable","How expensive it is","How long it lasts"],1,"Feasibility is whether the event is practical given resources, budget, venue and timing."),
 mcq(9,"B","Critical success factors","Which is a critical success factor for an event?",["A clear aim and adequate budget","The colour of the venue","The number of staff uniforms","The font on posters"],0,"Clear aims and adequate budget are critical to success."),
 mcq(10,"B","Feasibility","When assessing feasibility, an organiser should consider:",["Cost, resources, venue and timing","Only the date","Only the location","Only the marketing"],0,"Feasibility considers cost, resources, venue and timing together."),
 mcq(11,"C","Planning tools","Which planning tool shows tasks against a timeline?",["Gantt chart","SWOT analysis","PESTLE","Cash flow forecast"],0,"A Gantt chart displays tasks against time."),
 mcq(12,"C","Planning tools","An action plan lists:",["Tasks and who is responsible for them","Only the budget","Only the date","Only the venue"],0,"An action plan lists tasks, responsibilities and deadlines."),
 mcq(13,"C","Health and safety","A risk assessment identifies:",["Hazards and controls to reduce risk","Only profits","Only competitors","Only marketing channels"],0,"Risk assessment identifies hazards and controls."),
 mcq(14,"C","Contingency","A contingency plan prepares for:",["Unexpected problems","Guaranteed success","Higher profits","More customers"],0,"Contingency plans prepare for the unexpected."),
 mcq(15,"C","Budget","Which is a typical event cost?",["Venue hire","Company tax","Depreciation","Share dividends"],0,"Venue hire, marketing, staff, equipment, insurance and catering are event costs."),
 mcq(16,"D","Managing the event","On the day, the event manager is responsible for:",["Coordinating staff and suppliers","Designing the logo","Writing the annual report","Setting interest rates"],0,"The manager coordinates staff, suppliers and the schedule."),
 mcq(17,"D","Problem solving","When a problem occurs, the manager should first:",["Panic","Assess the problem calmly","Cancel the event","Ignore it"],1,"A calm assessment of the problem is the first step."),
 mcq(18,"D","Staging","Which must be managed when staging an event?",["Time and health and safety","Only the music","Only the decorations","Only the invitations"],0,"Time management and health and safety are key on the day."),
 mcq(19,"E","Evaluation","An event can be evaluated by:",["Collecting attendee feedback","Ignoring results","Only checking profits","Only counting chairs"],0,"Feedback, reviewing objectives, budget analysis and debriefs evaluate an event."),
 mcq(20,"E","Evaluation","Why evaluate an event?",["To learn and improve for the future","To avoid all planning","To guarantee profit","To reduce staff"],0,"Evaluation identifies improvements for future events."),
 mcq(21,"E","Skills development","Running an event develops:",["Practical skills like planning and communication","Only physical strength","Only typing speed","Only memory"],0,"Running an event develops planning, communication, teamwork and problem solving."),
 mcq(22,"E","Reflection","Reflecting on an event helps you:",["Identify strengths and areas for improvement","Forget the experience","Avoid future events","Reduce your skills"],0,"Reflection identifies strengths and development areas."),
]

flashcards = [
 {"id":"FC001","learning_aim":"A","topic":"Role","front":"What does an event organiser do?","back":"Plans, organises, budgets, promotes and coordinates an event, then evaluates it afterwards.","tags":["role"]},
 {"id":"FC002","learning_aim":"A","topic":"Skills","front":"Name key skills of an event organiser.","back":"Communication, organisation, problem solving, negotiation, leadership, teamwork, time management.","tags":["skills"]},
 {"id":"FC003","learning_aim":"A","topic":"Skills audit","front":"What is a skills audit?","back":"A review of current skills and abilities, identifying strengths and areas for development.","tags":["skills audit"]},
 {"id":"FC004","learning_aim":"B","topic":"Types","front":"Name the main types of event.","back":"Business, social, sports and entertainment events.","tags":["types"]},
 {"id":"FC005","learning_aim":"B","topic":"Feasibility","front":"What is event feasibility?","back":"Whether an event is practical and achievable given resources, budget, venue and timing.","tags":["feasibility"]},
 {"id":"FC006","learning_aim":"B","topic":"Success factors","front":"Critical success factors for an event?","back":"Clear aims, adequate budget, effective marketing, strong planning, positive customer experience.","tags":["success"]},
 {"id":"FC007","learning_aim":"C","topic":"Planning tools","front":"Name planning tools for events.","back":"Gantt chart, action plan, critical path analysis, checklists.","tags":["planning"]},
 {"id":"FC008","learning_aim":"C","topic":"Gantt chart","front":"What does a Gantt chart show?","back":"Tasks against a timeline, showing durations, deadlines and overlaps.","tags":["gantt"]},
 {"id":"FC009","learning_aim":"C","topic":"Health and safety","front":"What is a risk assessment?","back":"Identifying hazards, assessing likelihood/severity, and putting controls in place to reduce risk.","tags":["risk","safety"]},
 {"id":"FC010","learning_aim":"C","topic":"Contingency","front":"What is a contingency plan?","back":"A backup plan for unexpected problems such as bad weather or supplier failure.","tags":["contingency"]},
 {"id":"FC011","learning_aim":"D","topic":"Managing","front":"Responsibilities of an event manager on the day?","back":"Coordinating staff/suppliers, overseeing the schedule, handling problems, ensuring safety, managing the budget.","tags":["managing"]},
 {"id":"FC012","learning_aim":"D","topic":"Problem solving","front":"How to handle an unexpected problem?","back":"Stay calm, assess impact, implement contingency/find a solution, and communicate with staff and attendees.","tags":["problem solving"]},
 {"id":"FC013","learning_aim":"E","topic":"Evaluation","front":"How is an event evaluated?","back":"Feedback from attendees, reviewing against objectives, budget analysis, attendance/sales review, team debrief.","tags":["evaluation"]},
 {"id":"FC014","learning_aim":"E","topic":"Reflection","front":"Why reflect on an event?","back":"To identify strengths and areas for improvement and turn experience into learning for future events.","tags":["reflection"]},
]

with open(os.path.join(BASE, "quiz.json"), "w", encoding="utf-8") as f:
    json.dump(quiz, f, ensure_ascii=False, indent=1)
with open(os.path.join(BASE, "flashcards.json"), "w", encoding="utf-8") as f:
    json.dump(flashcards, f, ensure_ascii=False, indent=1)
print("U4 quiz", len(quiz), "flashcards", len(flashcards))
