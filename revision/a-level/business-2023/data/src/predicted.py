"""Build the three predicted papers + mark schemes (AQA 7132 format) from the question bank.

Run after build.py:  python predicted.py
Writes ../../predicted-papers/paper-{1,2,3}.html and mark-scheme-{1,2,3}.html.
"""
import glob
import html
import json
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.dirname(HERE)
OUT = os.path.join(os.path.dirname(DATA), "predicted-papers")
SEED = "ra10-predicted-2026"


def load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as f:
        return json.load(f)


MCQ = load("mc.json")
P2 = load("p2_sets.json")
P3 = load("p3_cases.json")
QS = []
for f in sorted(glob.glob(os.path.join(DATA, "topic_*.json"))):
    QS += load(os.path.basename(f))
BY_ID = {q["id"]: q for q in QS}

e = html.escape

CSS = """
:root{--ink:#1f1a16;--muted:#6b5e54;--line:#cfc4b8;--paper:#fff;--accent:#8b1a1a;--soft:#f7f2ec}
*{box-sizing:border-box}
body{font-family:Arial,Helvetica,sans-serif;max-width:900px;margin:24px auto;padding:0 16px;color:var(--ink);background:var(--soft);line-height:1.55}
.sheet{background:var(--paper);border:1px solid var(--line);border-radius:6px;padding:28px 32px;margin-bottom:20px}
h1{font-size:1.5rem;margin:0 0 4px}h2{font-size:1.15rem;margin:22px 0 8px;border-bottom:2px solid var(--ink);padding-bottom:4px}
h3{font-size:1rem;margin:16px 0 6px}
.meta{color:var(--muted);margin:0 0 10px}
.instr{border:1px solid var(--line);padding:10px 14px;border-radius:4px;background:#fcfaf7;font-size:.92rem}
.instr ul{margin:4px 0 0 18px;padding:0}
.q{margin:14px 0;page-break-inside:avoid}
.qn{font-weight:700;margin-right:8px}
.mk{float:right;font-weight:700;margin-left:12px}
.opts{list-style:none;padding:0;margin:6px 0 0 28px}
.opts li{margin:2px 0}
.opts b{display:inline-block;width:22px}
pre.data{white-space:pre-wrap;font-family:inherit;background:#fcfaf7;border-left:3px solid var(--line);padding:8px 12px;margin:6px 0}
.lines{border-bottom:1px solid #ddd;height:28px}
.ctx p{margin:6px 0}
table{border-collapse:collapse;width:100%;margin:8px 0 4px;font-size:.92rem}
th,td{border:1px solid var(--line);padding:5px 8px;text-align:left;vertical-align:top}
th{background:#f3ece4}
.note{font-size:.82rem;color:var(--muted);margin:0 0 10px}
.or{text-align:center;font-weight:700;margin:6px 0;color:var(--muted)}
.ms{border:1px solid var(--line);border-radius:4px;padding:10px 14px;margin:12px 0;background:#fff;page-break-inside:avoid}
.ms h3{margin-top:0}
.ms ul{margin:4px 0 6px 18px;padding:0}
.lab{font-weight:700;color:var(--accent);font-size:.85rem;text-transform:uppercase;letter-spacing:.03em;margin-top:8px}
.ao{font-size:.85rem;color:var(--muted)}
.key td{text-align:center}
.toolbar{margin-bottom:14px}.toolbar button{padding:6px 14px;border:1px solid var(--line);background:#fff;border-radius:4px;cursor:pointer}
@media print{body{background:#fff;margin:0}.sheet{border:none;padding:0}.toolbar{display:none}}
@media(max-width:600px){.sheet{padding:18px 14px}}
"""


def page(title, body):
    return ("<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n"
            f"<title>{e(title)}</title>\n<style>{CSS}</style>\n</head>\n<body>\n"
            "<div class=\"toolbar\"><button onclick=\"window.print()\">Print / save as PDF</button></div>\n"
            f"{body}\n</body>\n</html>\n")


def lines(marks):
    n = max(3, min(28, marks + 2))
    return "".join('<div class="lines"></div>' for _ in range(n))


def table(a):
    h = "<h3>" + e(a.get("title", "")) + "</h3><table>"
    if a.get("headers"):
        h += "<tr>" + "".join(f"<th>{e(str(x))}</th>" for x in a["headers"]) + "</tr>"
    for r in a.get("rows", []):
        h += "<tr>" + "".join(f"<td>{e(str(x))}</td>" for x in r) + "</tr>"
    h += "</table>"
    if a.get("note"):
        h += f'<p class="note">{e(a["note"])}</p>'
    return h


def ul(items):
    items = [i for i in (items or []) if i]
    return "<ul>" + "".join(f"<li>{e(str(i))}</li>" for i in items) + "</ul>" if items else ""


def levels_table(ld):
    if not ld:
        return ""
    h = '<table><tr><th>Level</th><th>Marks</th><th>Descriptor</th></tr>'
    for l in ld:
        h += f"<tr><td>{e(str(l.get('level','')))}</td><td>{e(str(l.get('marks','')))}</td><td>{e(l.get('descriptor',''))}</td></tr>"
    return h + "</table>"


def ms_block(num, q, with_levels=True):
    ms = q.get("mark_scheme", {})
    h = f'<div class="ms"><h3>{e(num)} &nbsp;[{q["marks"]} marks] &nbsp;<span class="ao">{e(q.get("ao",""))} · {e(q.get("spec_ref",""))}</span></h3>'
    h += f'<p><i>{e(q["question"])}</i></p>'
    if q.get("type") == "calculation":
        h += f'<div class="lab">Answer</div><p><b>{e(str(ms.get("answer","")))}</b></p>'
        h += '<div class="lab">Marking steps</div>' + ul(ms.get("points"))
        if ms.get("additional_guidance"):
            h += f'<div class="lab">Additional guidance</div><p>{e(ms["additional_guidance"])}</p>'
    else:
        if ms.get("calculations"):
            h += '<div class="lab">Supporting calculations</div>' + ul(
                [c if isinstance(c, str) else c.get("text") or json.dumps(c) for c in ms["calculations"]])
        if ms.get("demands"):
            h += '<div class="lab">Demands of the question</div>' + ul(ms["demands"])
        if ms.get("indicative_content"):
            h += '<div class="lab">Indicative content</div>' + ul(ms["indicative_content"])
        if ms.get("arguments_for"):
            h += '<div class="lab">Arguments for</div>' + ul(ms["arguments_for"])
        if ms.get("arguments_against"):
            h += '<div class="lab">Arguments against</div>' + ul(ms["arguments_against"])
        if ms.get("evaluation"):
            ev = ms["evaluation"]
            h += '<div class="lab">Evaluation / judgement</div>' + (ul(ev) if isinstance(ev, list) else f"<p>{e(ev)}</p>")
        notes = ms.get("marker_notes") or []
        if ms.get("additional_guidance"):
            notes = [ms["additional_guidance"]] + list(notes)
        notes = list(dict.fromkeys(notes))
        if notes:
            h += '<div class="lab">Examiner guidance</div>' + ul(notes)
        if with_levels:
            h += '<div class="lab">Levels of response</div>' + levels_table(ms.get("level_descriptors"))
    return h + "</div>"


def header(paper, title, extra_instr):
    return (f'<h1>A-level Business (7132) · Paper {paper}: {e(title)}</h1>'
            '<p class="meta">RA10 predicted paper · Time allowed: 2 hours · Maximum mark: 100</p>'
            '<div class="instr"><b>Instructions</b><ul>' + "".join(f"<li>{e(i)}</li>" for i in extra_instr) +
            "<li>You may use a calculator.</li><li>Show your working for calculations.</li></ul></div>")


# ---------------------------------------------------------------- Paper 1
def build_p1(rng):
    # 15 MCQs spread across the ten sections (1-2 each)
    by_topic = {}
    for m in MCQ:
        by_topic.setdefault(m["topic_number"], []).append(m)
    mcqs = []
    for t in sorted(by_topic):
        mcqs.append(rng.choice(by_topic[t]))
    rest = [m for m in MCQ if m not in mcqs]
    rng.shuffle(rest)
    used_t = {}
    for m in rest:
        if len(mcqs) >= 15:
            break
        if used_t.get(m["topic_number"], 0) < 1:
            mcqs.append(m)
            used_t[m["topic_number"]] = 1
    mcqs = sorted(mcqs, key=lambda m: (m["topic_number"], m["id"]))

    p1 = [q for q in QS if q.get("paper") == "Paper 1"]
    calcs = [q for q in p1 if q.get("type") == "calculation"]
    nines = [q for q in p1 if q["marks"] == 9]
    essays = [q for q in p1 if q["marks"] == 25]

    def spread(pool, n):
        pool = pool[:]
        rng.shuffle(pool)
        out, seen = [], set()
        for q in pool:
            if q["topic_number"] not in seen:
                out.append(q)
                seen.add(q["topic_number"])
            if len(out) == n:
                break
        return out

    c2 = spread(calcs, 2)
    n3 = spread([q for q in nines if q["topic_number"] not in {c["topic_number"] for c in c2}] or nines, 3)
    es = spread(essays, 4)
    return mcqs, c2, n3, es


def render_p1(mcqs, c2, n3, es):
    b = '<div class="sheet">' + header(1, "Business 1", [
        "Answer all questions in Section A and Section B.",
        "Answer either Question 21 or Question 22 in Section C.",
        "Answer either Question 23 or Question 24 in Section D.",
        "Section A: 15 marks · Section B: 35 marks · Section C: 25 marks · Section D: 25 marks."])
    b += "<h2>Section A · Multiple choice (15 marks)</h2><p class=\"note\">Answer all questions. Only one answer per question is allowed.</p>"
    for i, m in enumerate(mcqs, 1):
        b += f'<div class="q"><span class="mk">[1 mark]</span><span class="qn">{i:02d}</span>{e(m["question"])}'
        if m.get("scenario"):
            b += f'<pre class="data">{e(m["scenario"])}</pre>'
        b += '<ul class="opts">' + "".join(f'<li><b>{e(o["label"])}</b>{e(o["text"])}</li>' for o in m["options"]) + "</ul></div>"
    b += "<h2>Section B · Short-answer questions (35 marks)</h2><p class=\"note\">Answer all questions.</p>"
    n = 16
    secb = []
    for q in c2 + n3:
        b += f'<div class="q"><span class="mk">[{q["marks"]} marks]</span><span class="qn">{n}</span>'
        if q.get("scenario"):
            b += f'<pre class="data">{e(q["scenario"])}</pre>'
        b += f'{e(q["question"])}{lines(q["marks"])}</div>'
        secb.append((str(n), q))
        n += 1
    b += "<h2>Section C · Essay (25 marks)</h2><p class=\"note\">Answer <b>either</b> Question 21 <b>or</b> Question 22.</p>"
    b += f'<div class="q"><span class="mk">[25 marks]</span><span class="qn">21</span>{e(es[0]["question"])}</div><p class="or">OR</p>'
    b += f'<div class="q"><span class="mk">[25 marks]</span><span class="qn">22</span>{e(es[1]["question"])}</div>'
    b += "<h2>Section D · Essay (25 marks)</h2><p class=\"note\">Answer <b>either</b> Question 23 <b>or</b> Question 24.</p>"
    b += f'<div class="q"><span class="mk">[25 marks]</span><span class="qn">23</span>{e(es[2]["question"])}</div><p class="or">OR</p>'
    b += f'<div class="q"><span class="mk">[25 marks]</span><span class="qn">24</span>{e(es[3]["question"])}</div>'
    b += "<p class=\"meta\" style=\"margin-top:24px\"><b>END OF QUESTIONS</b></p></div>"

    ms = '<div class="sheet"><h1>Mark scheme · A-level Business Paper 1 (RA10 predicted)</h1>'
    ms += '<p class="meta">Levels-based questions: decide the level by best fit, then the mark within the level. Indicative content is not exhaustive. Own Figure Rule applies to calculations.</p>'
    ms += '<h2>Section A · Answer key</h2><table class="key"><tr>' + "".join(f"<th>{i:02d}</th>" for i in range(1, 16)) + "</tr><tr>"
    ms += "".join(f'<td>{e(m["mark_scheme"]["answer"])}</td>' for m in mcqs) + "</tr></table>"
    for i, m in enumerate(mcqs, 1):
        ms += f'<p class="note"><b>{i:02d} ({e(m["mark_scheme"]["answer"])})</b> {e(m["mark_scheme"].get("explanation",""))}</p>'
    ms += "<h2>Section B</h2>"
    for num, q in secb:
        ms += ms_block(num, q)
    ms += "<h2>Section C</h2>" + ms_block("21", es[0]) + ms_block("22", es[1], False)
    ms += "<h2>Section D</h2>" + ms_block("23", es[2], False) + ms_block("24", es[3], False)
    ms += '<p class="note">The 25-mark levels grid printed under Question 21 applies to Questions 22–24.</p></div>'
    return b, ms


# ---------------------------------------------------------------- Paper 2
def pick_p2(rng):
    from itertools import combinations
    combos = [c for c in combinations(P2, 3) if sum(s["total"] for s in c) == 100
              and len({t for s in c for t in s["topics"]}) >= 4]
    return list(rng.choice(combos))


def render_p2(sets):
    b = '<div class="sheet">' + header(2, "Business 2", [
        "Answer all three questions.",
        "Each question is based on its own information and appendices.",
        "Spend about 40 minutes on each question."])
    ms = '<div class="sheet"><h1>Mark scheme · A-level Business Paper 2 (RA10 predicted)</h1>'
    ms += '<p class="meta">Levels-based questions: decide the level by best fit, then the mark within the level. Own Figure Rule applies to calculations.</p>'
    for qi, s in enumerate(sets, 1):
        qs = sorted((BY_ID[i] for i in s["question_ids"]), key=lambda q: int(q["part"]))
        b += f'<h2>Question {qi} · {e(s["title"])} ({s["total"]} marks)</h2><div class="ctx">'
        b += "".join(f"<p>{e(p)}</p>" for p in s["context"]) + "</div>"
        b += "".join(table(a) for a in s["appendices"])
        ms += f'<h2>Question {qi} · {e(s["title"])}</h2>'
        for q in qs:
            num = f'{qi:02d}.{q["part"]}'
            b += f'<div class="q"><span class="mk">[{q["marks"]} marks]</span><span class="qn">{num}</span>{e(q["question"])}{lines(q["marks"])}</div>'
            ms += ms_block(num, q)
    b += "<p class=\"meta\" style=\"margin-top:24px\"><b>END OF QUESTIONS</b></p></div>"
    return b, ms + "</div>"


# ---------------------------------------------------------------- Paper 3
def render_p3(case):
    qs = sorted((BY_ID[i] for i in case["question_ids"]), key=lambda q: int(q["part"]))
    b = '<div class="sheet">' + header(3, "Business 3", [
        "Read the case study carefully before answering.",
        "Answer all questions. Questions are based on the case study and its appendices.",
        "Spend about 20 minutes reading the case."])
    b += f'<h2>Case study · {e(case["title"])}</h2><div class="ctx">'
    for sec in case["insert"]:
        b += f'<h3>{e(sec["heading"])}</h3>' + "".join(f"<p>{e(p)}</p>" for p in sec["paragraphs"])
    b += "</div>" + "".join(table(a) for a in case["appendices"])
    b += "<h2>Questions</h2>"
    ms = f'<div class="sheet"><h1>Mark scheme · A-level Business Paper 3 (RA10 predicted): {e(case["title"])}</h1>'
    ms += '<p class="meta">All questions are levels-based. Decide the level by best fit, then the mark within it. Answers must be applied to the case; generic answers are capped in the lower levels.</p>'
    for q in qs:
        num = f'{int(q["part"]):02d}'
        b += f'<div class="q"><span class="mk">[{q["marks"]} marks]</span><span class="qn">{num}</span>{e(q["question"])}{lines(q["marks"])}</div>'
        ms += ms_block(num, q)
    b += "<p class=\"meta\" style=\"margin-top:24px\"><b>END OF QUESTIONS</b></p></div>"
    return b, ms + "</div>"


def main():
    rng = random.Random(SEED)
    os.makedirs(OUT, exist_ok=True)
    p1, m1 = render_p1(*build_p1(rng))
    p2, m2 = render_p2(pick_p2(rng))
    p3, m3 = render_p3(rng.choice(P3))
    for n, (p, m) in enumerate([(p1, m1), (p2, m2), (p3, m3)], 1):
        with open(os.path.join(OUT, f"paper-{n}.html"), "w", encoding="utf-8") as f:
            f.write(page(f"Predicted Paper {n}", p))
        with open(os.path.join(OUT, f"mark-scheme-{n}.html"), "w", encoding="utf-8") as f:
            f.write(page(f"Mark Scheme {n}", m))
    print("Wrote predicted papers to", OUT)


if __name__ == "__main__":
    main()
