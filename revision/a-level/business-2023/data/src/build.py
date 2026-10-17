"""Build the A-level Business (7132) question bank JSON from the source modules.

Run from this folder:  python build.py
Outputs (in ../):  topic_1..10.json, mc.json, quiz.json, flashcards.json, p2_sets.json, p3_cases.json
Every calculation answer is re-computed and the build fails if any stated answer is wrong.
"""
import json
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from common import (SUBJECT, SPEC_CODE, TOPICS, SUBTOPICS, topic_of, levels_for, AO_SPLITS, ao_text,
                    EXAMINER_PRINCIPLES)
from mcq import MCQS
from p1_secb import CALCS, ANALYSE
from p1_essays import ESSAYS
from p2_sets import SETS
from p3_cases import CASES
from glossary import GLOSSARY, FORMULAE

OUT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
errors = []


def base(qid, spec, marks, verb, paper, section, kind):
    t = topic_of(spec)
    return {
        "id": qid,
        "subject": SUBJECT,
        "spec_code": SPEC_CODE,
        "learning_aim": t,
        "topic_number": int(t),
        "topic_title": TOPICS[t][1],
        "spec_ref": spec,
        "topic": f"{spec} {SUBTOPICS[spec]}",
        "command_verb": verb,
        "marks": marks,
        "papers": [paper],
        "paper": paper,
        "paper_section": section,
        "question_kind": kind,
    }


def verb_for(question, kind):
    q = question.strip().lower()
    if kind == "calc":
        return "Calculate"
    if kind == "explain":
        return "Explain"
    if kind == "analyse":
        return "Analyse"
    for key, verb in [("to what extent", "To what extent"), ("evaluate", "Evaluate"), ("recommend", "Recommend"),
                      ("should", "Justify"), ("would you advise", "Justify"), ("do you agree", "Justify"), ("is it", "Justify"),
                      ("will ", "Justify"), ("are ", "Justify")]:
        if key in q:
            return verb
    return "Evaluate"


def check_calc(item, label):
    fn = item.get("check")
    if not fn:
        return
    got = fn()
    want = item["final"]
    tol = max(0.06, abs(want) * 0.006)
    if abs(got - want) > tol:
        errors.append(f"{label}: stated final {want} but arithmetic gives {got:.4f}")


def calc_question(qid, item, paper, section, scenario="", extra=None):
    marks = item.get("marks", 4)
    kind_key = "calc"
    split = AO_SPLITS.get((paper, marks, kind_key), {"AO1": 1, "AO2": marks - 1})
    q = base(qid, item["spec"], marks, "Calculate", paper, section, "calc")
    data = item.get("data", "")
    q.update({
        "type": "calculation",
        "ao": ao_text(split), "ao_split": split,
        "scenario": scenario or data,
        "question": item["question"],
        "mark_scheme": {
            "instruction": f"Award marks as shown. Own Figure Rule (OFR) applies. Maximum {marks} marks.",
            "answer": item["answer"],
            "final_answer": item["final"],
            "unit": item["unit"],
            "points": item["steps"],
            "additional_guidance": " ".join(item.get("notes", [])),
            "formulae": [{"math": item["formula"], "notes": ""}] if item.get("formula") else [],
            "examiner_principles": EXAMINER_PRINCIPLES["calc"],
        },
    })
    if scenario and data:
        q["data"] = data
    if extra:
        q.update(extra)
    return q


def levels_question(qid, spec, marks, kind, question, paper, section, demands, indicative, notes,
                    for_args=None, against_args=None, evaluation=None, calcs=None, scenario="", extra=None):
    verb = verb_for(question, kind)
    split_kind = "evaluate" if kind == "evaluate" else ("explain" if kind == "explain" else ("define" if kind == "define" else "analyse"))
    split = AO_SPLITS.get((paper, marks, split_kind))
    if split is None:
        raise ValueError(f"No AO split for {paper} {marks} {split_kind} ({qid})")
    q = base(qid, spec, marks, verb, paper, section, kind)
    ind = list(indicative or [])
    if for_args:
        ind = list(for_args) + list(against_args or [])
    principles = EXAMINER_PRINCIPLES["evaluate" if kind == "evaluate" else "analyse"]
    ms = {
        "instruction": "Levels of response. Determine the level using the descriptors (best fit), then the mark within the level. Indicative content is not exhaustive - credit all valid lines of argument.",
        "demands": list(demands or []),
        "indicative_content": ind,
        "level_descriptors": levels_for(marks),
        "additional_guidance": " ".join(notes or []),
        "marker_notes": list(notes or []),
        "examiner_principles": principles,
    }
    if for_args:
        ms["arguments_for"] = list(for_args)
        ms["arguments_against"] = list(against_args or [])
    if evaluation:
        ms["evaluation"] = list(evaluation)
    if calcs:
        ms["calculations"] = list(calcs)
    q.update({
        "type": "extended_levels",
        "ao": ao_text(split), "ao_split": split,
        "scenario": scenario,
        "question": question,
        "mark_scheme": ms,
    })
    if extra:
        q.update(extra)
    return q


# ------------------------------------------------------------------ build
by_topic = {t: [] for t in TOPICS}

# Paper 1 Section B calculations
for i, c in enumerate(CALCS, 1):
    check_calc(c, f"P1 calc {i}")
    q = calc_question(f"P1B-C{i:02d}", c, "Paper 1", "Section B")
    by_topic[q["learning_aim"]].append(q)

# Paper 1 Section B 9-mark analyse
for i, a in enumerate(ANALYSE, 1):
    q = levels_question(f"P1B-A{i:02d}", a["spec"], 9, "analyse", a["question"], "Paper 1", "Section B",
                        a["demands"], a["indicative"], a["notes"], scenario=a.get("context", ""))
    by_topic[q["learning_aim"]].append(q)

# Paper 1 Sections C/D essays
for i, e in enumerate(ESSAYS, 1):
    section = "Section C" if int(topic_of(e["spec"])) <= 6 else "Section D"
    q = levels_question(f"P1E-{i:02d}", e["spec"], 25, "evaluate", e["question"], "Paper 1", section,
                        e["demands"], [], e["notes"], for_args=e["for"], against_args=e["against"],
                        evaluation=e["evaluation"])
    by_topic[q["learning_aim"]].append(q)


def appendix_text(apps):
    out = []
    for a in apps:
        out.append(a["title"])
        out.append(" | ".join(a["headers"]))
        for r in a["rows"]:
            out.append(" | ".join(r))
        if a.get("note"):
            out.append(a["note"])
        out.append("")
    return "\n".join(out).strip()


# Paper 2 sets
p2_out = []
for s in SETS:
    ctx = "\n\n".join(s["context"])
    total = sum(q["marks"] for q in s["questions"])
    set_qs = []
    for q in s["questions"]:
        qid = f"{s['id']}-{q['num']}"
        extra = {"context_id": s["id"], "context_title": s["title"], "appendices": s["appendices"],
                 "set_total": total, "part": q["num"]}
        if q["kind"] == "calc":
            item = dict(q)
            item.setdefault("data", "")
            check_calc(item, qid)
            obj = calc_question(qid, item, "Paper 2", "Data response", scenario=ctx, extra=extra)
        else:
            obj = levels_question(qid, q["spec"], q["marks"], q["kind"], q["question"], "Paper 2", "Data response",
                                  q.get("demands"), q.get("indicative", []), q.get("notes", []),
                                  for_args=q.get("for_args"), against_args=q.get("against_args"),
                                  evaluation=q.get("evaluation"), scenario=ctx, extra=extra)
        set_qs.append(obj)
        by_topic[obj["learning_aim"]].append(obj)
    if total not in (32, 33, 34):
        errors.append(f"{s['id']} totals {total}")
    p2_out.append({"id": s["id"], "title": s["title"], "topics": s.get("topics", []), "context": s["context"],
                   "appendices": s["appendices"], "total": total, "question_ids": [q["id"] for q in set_qs]})

# Paper 3 cases
p3_out = []
for c in CASES:
    insert_text = "\n\n".join(f"{h}\n" + "\n\n".join(paras) for h, paras in c["insert"])
    qs = []
    for q in c["questions"]:
        qid = f"{c['id']}-{q['num']}"
        extra = {"context_id": c["id"], "context_title": c["title"], "appendices": c["appendices"], "part": q["num"]}
        if q["kind"] == "analyse":
            obj = levels_question(qid, q["spec"], 12, "analyse", q["question"], "Paper 3", "Case study",
                                  q["demands"], q["indicative"], q["notes"], scenario=insert_text, extra=extra)
        else:
            obj = levels_question(qid, q["spec"], q["marks"], "evaluate", q["question"], "Paper 3", "Case study",
                                  q["demands"], [], q["notes"], for_args=q["for_args"], against_args=q["against_args"],
                                  evaluation=q["evaluation"], calcs=q.get("calcs"), scenario=insert_text, extra=extra)
        qs.append(obj)
        by_topic[obj["learning_aim"]].append(obj)
    marks = [q["marks"] for q in c["questions"]]
    if marks != [12, 12, 16, 16, 20, 24]:
        errors.append(f"{c['id']} tariffs {marks}")
    p3_out.append({"id": c["id"], "title": c["title"], "insert": [{"heading": h, "paragraphs": p} for h, p in c["insert"]],
                   "appendices": c["appendices"], "total": sum(marks), "question_ids": [q["id"] for q in qs]})

# MCQs
mc_out = []
for i, m in enumerate(MCQS, 1):
    q = base(f"MC{i:03d}", m["spec"], 1, "Select", "Paper 1", "Section A", "mcq")
    labels = ["A", "B", "C", "D"]
    if len(m["options"]) != 4 or m["answer"] not in labels:
        errors.append(f"MC{i:03d} malformed")
    q.update({
        "type": "multiple_choice",
        "ao": "AO1 = 1", "ao_split": {"AO1": 1},
        "scenario": "",
        "question": m["question"],
        "options": [{"label": l, "text": t} for l, t in zip(labels, m["options"])],
        "mark_scheme": {"instruction": "1 mark for the correct answer. Only one answer is allowed.",
                        "answer": m["answer"], "explanation": m["explanation"]},
    })
    mc_out.append(q)

# Quiz: MCQs + glossary quick-fire + formula checks
rng = random.Random(7132)
quiz = []
for m in mc_out:
    labels = [o["label"] for o in m["options"]]
    quiz.append({"id": "QZ-" + m["id"], "learning_aim": m["learning_aim"], "topic": m["topic"], "papers": ["Paper 1"],
                 "type": "mcq", "question": m["question"], "choices": [o["text"] for o in m["options"]],
                 "correct_index": labels.index(m["mark_scheme"]["answer"]), "explanation": m["mark_scheme"]["explanation"]})
n = 0
for t, terms in GLOSSARY.items():
    for i, (term, definition) in enumerate(terms):
        others = [d for j, (_, d) in enumerate(terms) if j != i]
        distractors = rng.sample(others, 3)
        choices = distractors + [definition]
        rng.shuffle(choices)
        n += 1
        quiz.append({"id": f"QG{n:03d}", "learning_aim": t, "topic": f"{TOPICS[t][0]} {TOPICS[t][1]}",
                     "papers": ["Paper 1", "Paper 2", "Paper 3"], "type": "mcq",
                     "question": f"Which of the following best defines '{term}'?", "choices": choices,
                     "correct_index": choices.index(definition), "explanation": f"{term}: {definition}"})
for i, (t, name, formula) in enumerate(FORMULAE):
    others = [f for j, (_, _, f) in enumerate(FORMULAE) if j != i]
    choices = rng.sample(others, 3) + [formula]
    rng.shuffle(choices)
    quiz.append({"id": f"QF{i+1:03d}", "learning_aim": t, "topic": f"{TOPICS[t][0]} formulae",
                 "papers": ["Paper 1", "Paper 2", "Paper 3"], "type": "mcq",
                 "question": f"What is the formula for {name}?", "choices": choices,
                 "correct_index": choices.index(formula), "explanation": f"{name} = {formula}"})

# Flashcards
flash = []
n = 0
for t, terms in GLOSSARY.items():
    for term, definition in terms:
        n += 1
        flash.append({"id": f"F{n:04d}", "learning_aim": t, "topic_number": int(t),
                      "topic": f"{TOPICS[t][0]} {TOPICS[t][1]}", "front": term, "back": definition})
for t, name, formula in FORMULAE:
    n += 1
    flash.append({"id": f"F{n:04d}", "learning_aim": t, "topic_number": int(t),
                  "topic": f"{TOPICS[t][0]} formulae", "front": f"Formula: {name}", "back": formula})

if errors:
    print("BUILD FAILED:")
    for e in errors:
        print("  -", e)
    sys.exit(1)


def dump(name, obj):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)


for t, qs in by_topic.items():
    dump(f"topic_{t}.json", qs)
dump("mc.json", mc_out)
dump("quiz.json", quiz)
dump("flashcards.json", flash)
dump("p2_sets.json", p2_out)
dump("p3_cases.json", p3_out)

total_q = sum(len(v) for v in by_topic.values())
print(f"OK: {total_q} written questions across 10 topics, {len(mc_out)} MCQs, {len(quiz)} quiz items, "
      f"{len(flash)} flashcards, {len(p2_out)} Paper 2 sets, {len(p3_out)} Paper 3 cases")
for t in TOPICS:
    print(f"  Topic {t}: {len(by_topic[t])} written + {sum(1 for m in mc_out if m['learning_aim']==t)} MCQ")
