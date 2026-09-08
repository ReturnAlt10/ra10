# -*- coding: utf-8 -*-
"""Replace the incorrect C/D flashcards with spec-accurate content."""
import json

PATH = "revision/btec/level-3/IT-AAQ/unit-2/data/flashcards.json"

new_cd = [
  {"learning_aim":"C","topic":"C1.1 Cyber security policy","front":"What is the Plan-Do-Check-Act loop?","back":"A continual-improvement cycle derived from ISO 27001: Plan (identify objectives/risks), Do (implement controls), Check (monitor and audit), Act (correct and improve). Underpins an effective, evolving cyber security policy."},
  {"learning_aim":"C","topic":"C1.1 Internal policies","front":"What general IT policies form part of cyber security documentation?","back":"1. Internet and email use policy\n2. Security and password procedures\n3. Staff responsibilities\n4. Staff IT security training\n5. Security audits\n6. Backup policy\n7. Data protection policy\n8. Incident response policy\n9. Disaster recovery policy\n10. External services policy"},
  {"learning_aim":"C","topic":"C1.3 Backup policy","front":"What should a backup policy specify?","back":"Selection of data, backup methods and type (full/differential/incremental), frequency/scheduling, storage strategy (onsite/offsite/cloud), responsibility and accountability, a testing strategy, legal compliance, and recovery procedures."},
  {"learning_aim":"C","topic":"C1.5/C1.6 Incident & disaster recovery","front":"What is the difference between an incident response policy and a disaster recovery policy?","back":"Incident response policy = how to react to a security incident (contacts, triage, analysis/containment/mitigation/recovery procedures, communications). Disaster recovery policy = how to recover from major disruption (purpose/scope, triage, roles, contact lists, monitoring/reporting)."},
  {"learning_aim":"D","topic":"D1.1 Meeting requirements for forensics","front":"How should a seized mobile device be handled?","back":"Prior planning; retain its current power state; isolate it from the network (airplane mode, disable wireless, Faraday bag); photograph the screen; keep chargers/cables; use appropriate packaging; document the chain of custody; establish legal permissions."},
  {"learning_aim":"D","topic":"D1.1 Network forensics & documenting the scene","front":"What must be done before and during network scanning for forensics?","back":"Agree a methodology with supervisory/investigatory authorities; obtain permission; ensure the testing protocol won't disrupt the live system; use passive and active analysis tools; review firewalls, switches, routers, WAPs and logs; document the scene (plans, photos, notes, witness statements)."},
  {"learning_aim":"D","topic":"D2.1 Retaining snapshots & recording findings","front":"What are the key requirements for reliable forensic records?","back":"Retain snapshots (whole disk, files, memory, deleted/temp data) and generate a hash/checksum; take no action that changes data; collect by a competent person; keep a trail of all actions (chain of custody); work on copies, not originals; create visual evidence; avoid false positives."},
  {"learning_aim":"D","topic":"D2.2/D2.3 Assessing findings & reporting","front":"What indicators suggest a system has been compromised, and what goes in the report?","back":"Indicators: unusual traffic (inbound/outbound/regions), unusual logins or DNS requests, increased file reads, unusual port usage, suspicious file changes. Report structure: title, contents, introduction, headings, bullets, conclusions, citations - analysing errors, detection delays, remedial actions and improvements to policies and protection measures."},
]

with open(PATH, encoding="utf-8") as f:
    data = json.load(f)

ab = [q for q in data if q.get("learning_aim") not in ("C", "D")]
out = []
n = 0
for q in ab:
    n += 1
    q["id"] = "F%03d" % n
    out.append(q)
for q in new_cd:
    n += 1
    q["id"] = "F%03d" % n
    out.append(q)

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

print("flashcards.json:", len(out), "items (A/B kept:", len(ab), ", new C/D:", len(new_cd), ")")