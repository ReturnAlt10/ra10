# -*- coding: utf-8 -*-
"""Generate predicted papers (paper + mark scheme) for Business U1, U2, U4.
Each paper draws questions from the unit's aim_*.json question bank."""
import json, os, html

ROOT = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business"

UNITS = {
    "unit-1": {"title": "Exploring Business", "aims": ["A","B","C","D","E"], "mark": 60},
    "unit-2": {"title": "Developing a Marketing Campaign", "aims": ["A","B","C","D"], "mark": 70},
    "unit-4": {"title": "Managing an Event", "aims": ["A","B","C","D","E"], "mark": 60},
}

BRAND = "#1a56db"
DARK = "#0d1b3e"

def esc(s):
    return html.escape(str(s), quote=True)

def load_questions(unit):
    qs = []
    for a in UNITS[unit]["aims"]:
        p = os.path.join(ROOT, unit, "data", f"aim_{a}.json")
        with open(p, encoding="utf-8") as f:
            arr = json.load(f)
        qs.extend(arr)
    return qs

def pick_questions(qs, seed):
    # deterministic: sort by id and pick a balanced spread
    by_aim = {}
    for q in qs:
        by_aim.setdefault(q["learning_aim"], []).append(q)
    picked = []
    aims = sorted(by_aim.keys())
    # interleave
    maxlen = max(len(by_aim[a]) for a in aims)
    for i in range(maxlen):
        for a in aims:
            if i < len(by_aim[a]):
                picked.append(by_aim[a][i])
    return picked

def render_paper(unit, paper_no, questions):
    title = UNITS[unit]["title"]
    qs = pick_questions(questions, paper_no)
    # select up to ~14 questions balancing marks
    selected = qs[:16]
    total_marks = sum(q["marks"] for q in selected)

    body = []
    for i, q in enumerate(selected, 1):
        scenario = f'<div class="scenario">{esc(q["scenario"])}</div>' if q.get("scenario") else ""
        body.append(f'''
    <div class="question">
      <div class="qnum">Question {i}</div>
      {scenario}
      <div class="qtext">{esc(q["question"])}</div>
      <div class="marks">({q["marks"]} marks)</div>
      <div class="answerlines"></div>
    </div>''')

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Predicted Paper {paper_no} — BTEC Business Unit — RA10</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; background: linear-gradient(180deg, #eef2ff 0%, #f7f2eb 100%); line-height: 1.45; padding: 18px 0 36px; }}
  .page {{ width: 210mm; min-height: 297mm; margin: 0 auto 24px auto; padding: 18mm 20mm; background: #fff; border: 1px solid #d8dce8; border-radius: 18px; box-shadow: 0 20px 48px rgba(26,26,46,.14); }}
  @media print {{ body {{ margin:0; padding:0; background:#fff; }} .page {{ width:210mm; min-height:297mm; margin:0; padding:18mm 20mm; border:none; border-radius:0; box-shadow:none; page-break-after:always; }} .page:last-child {{ page-break-after:avoid; }} }}
  .cover-header {{ border-radius:12px; padding:14px 20px; margin:0 0 16px; background: linear-gradient(135deg, {DARK} 0%, #1a3a8f 55%, {BRAND} 100%); }}
  .cover-logo {{ font-size:26pt; font-weight:900; color:#fff; }}
  .cover-tagline {{ color:rgba(255,255,255,.85); font-size:10pt; }}
  h1 {{ font-size:16pt; color:#121827; margin-bottom:4px; }}
  .sub {{ color:#4a5568; font-size:9.5pt; margin-bottom:14px; }}
  .question {{ margin:18px 0; padding:12px 14px; border:1.5px solid #d1d9ec; border-top:4px solid {BRAND}; border-radius:10px; background:#fff; }}
  .qnum {{ font-weight:900; color:{BRAND}; margin-bottom:6px; }}
  .scenario {{ background:#f4f7ff; border-left:4px solid {BRAND}; padding:8px 12px; margin-bottom:8px; font-size:10pt; }}
  .qtext {{ margin-bottom:6px; }}
  .marks {{ color:#6a7a9a; font-size:9pt; font-style:italic; margin-bottom:10px; }}
  .answerlines {{ border-bottom:1.5px solid #c0c8dc; height:28px; margin-bottom:6px; }}
</style>
</head>
<body>
  <div class="page">
    <div class="cover-header">
      <div class="cover-logo">RA10</div>
      <div class="cover-tagline">BTEC Level 3 Business &middot; Predicted Paper {paper_no}</div>
    </div>
    <h1>{esc(title)}</h1>
    <div class="sub">Total marks: {total_marks} &middot; Answer all questions &middot; This is a practice paper, not an official Pearson document.</div>
    {''.join(body)}
  </div>
</body>
</html>'''

def render_mark_scheme(unit, paper_no, questions):
    title = UNITS[unit]["title"]
    qs = pick_questions(questions, paper_no)
    selected = qs[:16]

    body = []
    for i, q in enumerate(selected, 1):
        ms = q["mark_scheme"]
        if q["type"] == "extended_levels" and "indicative_content" in ms:
            ic = "".join(f"<li>{esc(c)}</li>" for c in ms["indicative_content"])
            lv = "".join(f"<tr><td>{esc(l['level'])}</td><td>{esc(l['marks'])}</td><td>{esc(l['descriptor'])}</td></tr>" for l in ms["level_descriptors"])
            ms_body = f'<div class="indicative"><b>Indicative content:</b><ul>{ic}</ul></div><table class="levels"><tr><th>Level</th><th>Marks</th><th>Descriptor</th></tr>{lv}</table>'
        else:
            pts = "".join(f"<li>{esc(p)}</li>" for p in ms.get("points", []))
            ms_body = f'<ul class="points">{pts}</ul>'
        add = f'<div class="note"><b>Additional guidance:</b> {esc(ms["additional_guidance"])}</div>' if ms.get("additional_guidance") else ""
        body.append(f'''
    <div class="ms-item">
      <div class="ms-q">Q{i} &mdash; {esc(q["command_verb"])} ({q["marks"]} marks)</div>
      {ms_body}
      {add}
    </div>''')

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mark Scheme {paper_no} — BTEC Business Unit — RA10</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; color: #000; background: linear-gradient(180deg, #eef2ff 0%, #f7f2eb 100%); line-height: 1.45; padding: 18px 0 36px; }}
  .page {{ width: 210mm; min-height: 297mm; margin: 0 auto 24px auto; padding: 18mm 20mm; background: #fff; border: 1px solid #d8dce8; border-radius: 18px; box-shadow: 0 20px 48px rgba(26,26,46,.14); }}
  @media print {{ body {{ margin:0; padding:0; background:#fff; }} .page {{ width:210mm; margin:0; padding:18mm 20mm; border:none; border-radius:0; box-shadow:none; }} }}
  .cover-header {{ border-radius:12px; padding:14px 20px; margin:0 0 16px; background: linear-gradient(135deg, {DARK} 0%, #1a3a8f 55%, {BRAND} 100%); }}
  .cover-logo {{ font-size:26pt; font-weight:900; color:#fff; }}
  .cover-tagline {{ color:rgba(255,255,255,.85); font-size:10pt; }}
  h1 {{ font-size:16pt; color:#121827; margin-bottom:4px; }}
  .sub {{ color:#4a5568; font-size:9.5pt; margin-bottom:14px; }}
  .ms-item {{ margin:16px 0; padding:12px 14px; border:1.5px solid #d1d9ec; border-top:4px solid {BRAND}; border-radius:10px; background:#fff; }}
  .ms-q {{ font-weight:900; color:{BRAND}; margin-bottom:6px; }}
  .points, .indicative ul {{ margin:6px 0 6px 20px; }}
  .indicative {{ margin-bottom:8px; }}
  .levels {{ border-collapse:collapse; width:100%; margin:8px 0; }}
  .levels th, .levels td {{ border:1px solid #c0c8dc; padding:5px 8px; text-align:left; }}
  .levels th {{ background:#ecf1ff; }}
  .note {{ color:#4a5568; font-size:9pt; margin-top:6px; }}
</style>
</head>
<body>
  <div class="page">
    <div class="cover-header">
      <div class="cover-logo">RA10</div>
      <div class="cover-tagline">BTEC Level 3 Business &middot; Mark Scheme {paper_no}</div>
    </div>
    <h1>{esc(title)}</h1>
    <div class="sub">Mark scheme &middot; Practice material, not an official Pearson document.</div>
    {''.join(body)}
  </div>
</body>
</html>'''

for unit, info in UNITS.items():
    qs = load_questions(unit)
    outdir = os.path.join(ROOT, unit, "predicted-papers")
    os.makedirs(outdir, exist_ok=True)
    for p in range(1, 4):
        paper_html = render_paper(unit, p, qs)
        ms_html = render_mark_scheme(unit, p, qs)
        with open(os.path.join(outdir, f"paper-{p}.html"), "w", encoding="utf-8") as f:
            f.write(paper_html)
        with open(os.path.join(outdir, f"mark-scheme-{p}.html"), "w", encoding="utf-8") as f:
            f.write(ms_html)
    print(unit, "papers generated,", len(qs), "questions")
print("done")
