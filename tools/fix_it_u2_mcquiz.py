# -*- coding: utf-8 -*-
"""Replace the incorrect C/D content in mc.json and quiz.json for AAQ IT Unit 2.
The spec's C = Cyber security documentation; D = Forensic procedures.
Old content (incident response / pen testing / SIEM) is removed and replaced
with spec-accurate material."""

import json

def mc(i, aim, topic, question, choices, correct, expl, answer_label):
    return {"id": "MC%03d" % i, "learning_aim": aim, "topic": topic,
            "command_verb": "Identify", "marks": 1, "ao": "AO1", "scenario": "",
            "question": question, "guidance": "(1)", "type": "multiple_choice",
            "options": [{"label": L, "text": t} for L, t in zip("ABCD", choices)],
            "mark_scheme": {"instruction": "Award one mark for the correct option.",
            "answer": answer_label, "explanation": expl,
            "points": ["%s: %s (1)" % (answer_label, choices["ABCD".index(answer_label)])]}}

def plain_mc(i, aim, topic, question, choices, correct, expl):
    return {"id": "Q%03d" % i, "learning_aim": aim, "topic": topic, "type": "mcq",
            "question": question, "choices": choices, "correct_index": correct,
            "explanation": expl}

# ---- New C (documentation) MC items ----
C_DOC = [
    ("Which approach underpins a cyber security policy for continual improvement?",
     ["Fail-safe", "Plan-Do-Check-Act", "Waterfall", "Scrum"], 1,
     "The Plan-Do-Check-Act loop (from ISO 27001) drives continual improvement of security."),
    ("What does the 'Check' stage of Plan-Do-Check-Act involve?",
     ["Implementing controls", "Monitoring and auditing results", "Writing the policy", "Hiring staff"], 1,
     "Check = monitor, audit and review results against objectives."),
    ("Which policy governs the use of email and the internet?",
     ["Internet and email use policy", "Backup policy", "Disaster recovery policy", "Password policy"], 0,
     "The internet and email use policy sets rules on inappropriate material, confidentiality and downloads."),
    ("Which should a password policy typically specify?",
     ["Minimum length and complexity", "The canteen menu", "Network cabling colours", "Desk layout"], 0,
     "Password policies set length, character restrictions and lockout rules."),
    ("Who is responsible for funding and resourcing staff security training?",
     ["Junior staff", "Leadership/management", "Suppliers", "Customers"], 1,
     "Leadership must ensure training is funded, resourced and ongoing."),
    ("What is the purpose of a security audit?",
     ["To check compliance against policies and regulations", "To delete data", "To install software", "To train staff"], 0,
     "Security audits check compliance with internal policies and external laws/regulations."),
    ("Which is set out in a backup policy?",
     ["Which data is backed up and how often", "Which fonts to use", "Staff holiday dates", "Marketing budget"], 0,
     "Backup policies specify data selection, methods, scheduling and storage strategy."),
    ("Why should a backup policy include a testing strategy?",
     ["To confirm data can actually be restored", "To reduce storage costs", "To simplify HR", "To speed up email"], 0,
     "Testing proves backups can be restored when needed."),
    ("Which role oversees data protection compliance?",
     ["Data Protection Officer", "Receptionist", "Caterer", "Cleaner"], 0,
     "The Data Protection Officer oversees data protection principles and privacy."),
    ("Which is a contact listed in an incident response policy?",
     ["Incident response team leader", "A competitor", "The general public", "A rival firm"], 0,
     "Incident response policies list the IR leader, IT lead, legal, PR, HR and insurance contacts."),
    ("What does disaster recovery triage do?",
     ["Decides which plan to activate based on severity", "Orders lunch", "Schedules meetings", "Writes code"], 0,
     "Triage lists possible events, their severity, and whether to activate IR, BC or DR plans."),
    ("Which is covered by an external services policy for cloud?",
     ["Acceptable use and data protection", "Office furniture", "Staff parking", "Uniforms"], 0,
     "External services policies cover authorisation, acceptable use, data protection and incident response."),
]

# ---- New D (forensics) MC items ----
D_FOR = [
    ("Which preserves a seized mobile device for forensic analysis?",
     ["Plug it in to charge overnight", "Retain power state and isolate from the network", "Wipe it immediately", "Share it on social media"], 1,
     "Devices should retain their power state and be isolated from network/communications."),
    ("What is used to block wireless signals to a seized device?",
     ["A Faraday bag/cage", "A USB hub", "A route", "A firewall"], 0,
     "A Faraday bag/cage blocks wireless communication to preserve volatile evidence."),
    ("What does a chain of custody record?",
     ["Everyone who handled the evidence and when", "The organisation's profits", "Staff salaries", "Network passwords"], 0,
     "Chain of custody documents who handled evidence, when, and what they did."),
    ("Which is a challenge of live forensics?",
     ["Data changing in situ during analysis", "Nothing ever changes", "Too much storage", "Slow networks"], 0,
     "Live forensics must handle changing data, active memory and remote data capture."),
    ("What must be obtained before scanning a network for forensics?",
     ["Permission and an agreed methodology", "A password manager", "A new router", "Antivirus"], 0,
     "Forensic scanning requires permission and an agreed methodology that won't disrupt the live system."),
    ("Why is a hash generated for a forensic copy?",
     ["To prove the copy is identical to the original", "To compress it", "To encrypt it", "To delete it"], 0,
     "A hash/checksum proves the copy matches the original and integrity is maintained."),
    ("Why do investigators work on copies rather than originals?",
     ["To avoid altering the original evidence", "Because copies are free", "To save time", "To use less RAM"], 0,
     "Working on copies preserves the original evidence unchanged and admissible."),
    ("Which is a form of visual evidence?",
     ["Screenshots", "Passwords", "Hashes", "Firewall rules"], 0,
     "Visual evidence includes photos, videos, screenshots and date-time stamps."),
    ("Which is an indicator of compromise?",
     ["Unusual outbound traffic from unusual regions", "Normal login patterns", "Stable file sizes", "Consistent performance"], 0,
     "Unusual traffic, login attempts and file changes are indicators of compromise."),
    ("What should a security report recommend?",
     ["Improvements to policies and protection measures", "No changes at all", "Deleting all logs", "Removing firewalls"], 0,
     "Reports recommend improvements to IT policies and physical/software/hardware/process/training measures."),
]

# Load mc.json, drop C/D items, keep A/B, re-append new C/D with fresh IDs
with open("revision/btec/level-3/IT-AAQ/unit-2/data/mc.json", encoding="utf-8") as f:
    mc_data = json.load(f)
mc_ab = [q for q in mc_data if q.get("learning_aim") not in ("C", "D")]

# Rebuild IDs sequentially
new_mc = []
n = 0
for q in mc_ab:
    n += 1
    q["id"] = "MC%03d" % n
    new_mc.append(q)
# Append C docs
for (question, choices, correct, expl) in C_DOC:
    n += 1
    new_mc.append(mc(n, "C", "C1 Internal policies", question, choices, correct, expl, "ABCD"[correct]))
# Append D forensics
for (question, choices, correct, expl) in D_FOR:
    n += 1
    new_mc.append(mc(n, "D", "D1/D2 Forensic procedures", question, choices, correct, expl, "ABCD"[correct]))
with open("revision/btec/level-3/IT-AAQ/unit-2/data/mc.json", "w", encoding="utf-8") as f:
    json.dump(new_mc, f, ensure_ascii=False, indent=1)

# Load quiz.json, drop C/D items, keep A/B
with open("revision/btec/level-3/IT-AAQ/unit-2/data/quiz.json", encoding="utf-8") as f:
    quiz_data = json.load(f)
quiz_ab = [q for q in quiz_data if q.get("learning_aim") not in ("C", "D")]

new_quiz = []
n = 0
for q in quiz_ab:
    n += 1
    q["id"] = "Q%03d" % n
    new_quiz.append(q)
# Append C docs
for (question, choices, correct, expl) in C_DOC:
    n += 1
    new_quiz.append(plain_mc(n, "C", "C1 Internal policies", question, choices, correct, expl))
# Append D forensics
for (question, choices, correct, expl) in D_FOR:
    n += 1
    new_quiz.append(plain_mc(n, "D", "D1/D2 Forensic procedures", question, choices, correct, expl))
with open("revision/btec/level-3/IT-AAQ/unit-2/data/quiz.json", "w", encoding="utf-8") as f:
    json.dump(new_quiz, f, ensure_ascii=False, indent=1)

print("mc.json:", len(new_mc), "items (A/B kept:", len(mc_ab), ", new C/D:", len(C_DOC)+len(D_FOR), ")")
print("quiz.json:", len(new_quiz), "items (A/B kept:", len(quiz_ab), ")")