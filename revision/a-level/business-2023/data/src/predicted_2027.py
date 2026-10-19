"""Build the June 2027 predicted papers: 3 sets (A, B, C) for each of Papers 1-3,
with full mark schemes, from pp27_paper1/2/3.py and the trend data in past_papers.py.

Run:  python predicted_2027.py
Writes ../../predicted-papers/paper-{1,2,3}-{a,b,c}.html and mark-scheme-{1,2,3}-{a,b,c}.html,
and turns the old paper-{n}.html / mark-scheme-{n}.html into redirects to Set A.
"""
import html
import os

import past_papers
import pp27_paper1 as P1
import pp27_paper2 as P2
import pp27_paper3 as P3

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(os.path.dirname(HERE)), "predicted-papers")
SERIES = "June 2027"
e = html.escape

CSS = """
:root{--ink:#1f1a16;--muted:#6b5e54;--line:#cfc4b8;--paper:#fff;--accent:#8b1a1a;--soft:#f7f2ec}
*{box-sizing:border-box}
body{font-family:Arial,Helvetica,sans-serif;max-width:900px;margin:24px auto;padding:0 16px;color:var(--ink);background:var(--soft);line-height:1.55}
.sheet{background:var(--paper);border:1px solid var(--line);border-radius:6px;padding:28px 32px;margin-bottom:20px}
h1{font-size:1.5rem;margin:0 0 4px}h2{font-size:1.15rem;margin:22px 0 8px;border-bottom:2px solid var(--ink);padding-bottom:4px}
h3{font-size:1rem;margin:16px 0 6px}h4{font-size:.95rem;margin:12px 0 4px}
.meta{color:var(--muted);margin:0 0 10px}
.instr{border:1px solid var(--line);padding:10px 14px;border-radius:4px;background:#fcfaf7;font-size:.92rem}
.instr ul{margin:4px 0 0 18px;padding:0}
.q{margin:16px 0;page-break-inside:avoid}
.qn{font-weight:700;margin-right:8px}
.mk{float:right;font-weight:700;margin-left:12px}
.qt{white-space:pre-line}
.opts{list-style:none;padding:0;margin:6px 0 0 28px}
.opts li{margin:2px 0}
.opts b{display:inline-block;width:22px}
.lines{border-bottom:1px solid #ddd;height:26px}
.case p{margin:6px 0 10px;white-space:pre-line}
table{border-collapse:collapse;width:100%;margin:8px 0 4px;font-size:.92rem}
th,td{border:1px solid var(--line);padding:5px 8px;text-align:left;vertical-align:top}
th{background:#f3ece4}
.note{font-size:.82rem;color:var(--muted);margin:2px 0 12px}
.or{text-align:center;font-weight:700;margin:6px 0;color:var(--muted)}
.ms{border:1px solid var(--line);border-radius:4px;padding:10px 14px;margin:12px 0;background:#fff;page-break-inside:avoid}
.ms h3{margin-top:0}
.ms ul{margin:4px 0 6px 18px;padding:0}
.lab{font-weight:700;color:var(--accent);font-size:.82rem;text-transform:uppercase;letter-spacing:.03em;margin-top:8px}
.why{font-size:.84rem;color:var(--muted);background:#fbf7f2;border-left:3px solid var(--accent);padding:6px 10px;margin-top:8px}
.key td{text-align:center}
.toolbar{margin-bottom:14px;display:flex;gap:8px;flex-wrap:wrap}.toolbar a,.toolbar button{padding:6px 14px;border:1px solid var(--line);background:#fff;border-radius:4px;cursor:pointer;color:var(--ink);text-decoration:none;font:inherit;font-size:.9rem}
.disclaimer{font-size:.8rem;color:var(--muted);margin-top:10px}
@media print{body{background:#fff;margin:0}.sheet{border:none;padding:0}.toolbar{display:none}}
@media(max-width:600px){.sheet{padding:18px 14px}}
"""

TITLES = {1: "Paper 1: Business 1", 2: "Paper 2: Business 2", 3: "Paper 3: Business 3"}

LEVELS = {
    9: ("AO1 3 / AO2 3 / AO3 3 (Paper 2: 2/3/4)", [
        ("3", "7-9", "Good knowledge and understanding; well-developed application to the context; well-developed analysis with chains of reasoning that are relevant to the question."),
        ("2", "4-6", "Reasonable knowledge; some application; analysis is reasonably developed but may be one-sided or lack depth in places."),
        ("1", "1-3", "Limited knowledge; little application; analysis is simple, generic or descriptive.")]),
    12: ("AO1 3 / AO2 3 / AO3 6", [
        ("3", "9-12", "Well-developed, relevant analysis applied throughout to the case. One fully developed line of argument can reach this level."),
        ("2", "5-8", "Reasonably developed analysis with some application to the case."),
        ("1", "1-4", "Limited knowledge and generic or undeveloped points.")]),
    16: ("AO1 2 / AO2 3 / AO3 4 / AO4 7", [
        ("4", "13-16", "Well-developed, balanced analysis applied to the context, with a well-supported judgement that weighs the arguments and considers what the answer depends on."),
        ("3", "9-12", "Reasonably developed analysis, some balance, and a judgement with some support."),
        ("2", "5-8", "Some analysis, possibly one-sided; judgement is asserted rather than supported."),
        ("1", "1-4", "Limited knowledge and analysis; little or no judgement.")]),
    20: ("AO1 4 / AO2 3 / AO3 5 / AO4 8", [
        ("5", "17-20", "Both options analysed in depth using quantitative and qualitative evidence; a clear, well-supported recommendation that weighs risks and returns."),
        ("4", "13-16", "Both options analysed with good use of evidence; judgement supported but may not fully weigh the options."),
        ("3", "9-12", "Reasonable analysis, possibly focused mainly on one option (answers analysing only one option are capped here)."),
        ("2", "5-8", "Some relevant points; limited use of data; weak judgement."),
        ("1", "1-4", "Limited, generic points.")]),
    24: ("AO1 5 / AO2 4 / AO3 6 / AO4 9", [
        ("5", "21-24", "Precise knowledge; contrasting business contexts used effectively; well-developed balanced analysis; judgement flows from the arguments and identifies key factors."),
        ("4", "16-20", "Good analysis with some contrasting contexts; supported judgement."),
        ("3", "11-15", "Reasonable analysis; context mainly the case business; judgement partly supported."),
        ("2", "6-10", "Some analysis, largely one-sided or generic."),
        ("1", "1-5", "Limited knowledge; little analysis.")]),
    25: ("AO1 5 / AO2 4 / AO3 6 / AO4 10", [
        ("5", "21-25", "Precise knowledge; well-chosen examples/contexts; well-developed two-sided analysis; well-supported judgement that weighs arguments and explains what the answer depends on."),
        ("4", "16-20", "Good knowledge and application; developed analysis on both sides; supported judgement."),
        ("3", "11-15", "Reasonable analysis; some balance; judgement asserted with limited support."),
        ("2", "6-10", "Some relevant knowledge; analysis largely one-sided or undeveloped."),
        ("1", "1-5", "Limited, generic points.")]),
}
STATEMENT_OPTS = ["Statement 1 is true. Statement 2 is true.", "Statement 1 is true. Statement 2 is false.",
                  "Statement 1 is false. Statement 2 is true.", "Statement 1 is false. Statement 2 is false."]


# ── Trend rationale ──────────────────────────────────────────────────────
def last_seen(paper, spec):
    codes = [c.strip() for c in spec.split("/")]
    best = {}
    for y, p, _, _, kind, s, _ in past_papers.Q:
        if kind == "mcq":
            continue
        for c in codes:
            if s == c or (len(c.split(".")) == 2 and s.startswith(c + ".")):
                key = "this paper" if p == paper else "other papers"
                best[key] = max(best.get(key, 0), y)
    return best


def rationale(paper, spec, extra=""):
    seen = last_seen(paper, spec)
    parts = []
    if "this paper" in seen:
        parts.append(f"last tested as an extended question in Paper {paper} in {seen['this paper']}")
    else:
        parts.append(f"never set as an extended question in Paper {paper} (2020-2025)")
    if "other papers" in seen and seen.get("other papers") != seen.get("this paper"):
        parts.append(f"most recently elsewhere in {seen['other papers']}")
    text = f"Spec {spec}: " + "; ".join(parts) + "."
    if extra:
        text += " " + extra
    return text


# Hand-written reasons for the most deliberate predictions: (paper, set, question).
NOTES = {
    (1, "A", 21): "Herzberg himself has never had a Paper 1 essay (Maslow 2023, financial v non-financial 2021); Herzberg returned in Paper 2 in 2025.",
    (1, "A", 22): "Tannenbaum Schmidt is the only leadership model named in spec v2.0 and has never been examined in any paper.",
    (1, "A", 17): "Payback has never been a Paper 1 Section B calculation; investment appraisal appeared as NPV in 2024.",
    (1, "A", 23): "Five forces had one Paper 1 essay (2021) and has never appeared in Paper 3 - a likely return.",
    (1, "B", 19): "Crowd funding is a v2.0 source of finance that has never been examined.",
    (1, "B", 21): "Labour-market law and minimum wage are named in 3.7.4 but have not had their own question since 2020.",
    (1, "C", 23): "Finance essays are rare in Paper 1 (2022, 2024 only) - cash flow v profit is a classic gap.",
    (2, "A", "2.3"): "A leadership-style 16-marker for 'all businesses' using the only v2.0 leadership model.",
    (2, "B", "2.5"): "Innovation (3.9.2) has never had a Paper 2 question - it has appeared only in Paper 3 (copyright, 2022) and Paper 1 (2020, 2025).",
    (2, "C", "2.2"): "Stakeholder mapping appeared only as a 4-marker (2023); a 9-mark application is a natural step up.",
    (3, "A", 2): "HR has been the focus of only one Paper 3 question since 2020 (2025 Q4).",
    (3, "A", 5): "Ansoff (3.8.1) has never been the basis of a Paper 3 decision question.",
    (3, "B", 1): "Leadership appeared in Paper 3 in 2020 and 2021 using styles now replaced by Tannenbaum Schmidt.",
    (3, "B", 4): "Overtrading is named in 3.9.1 but has never been examined; cash-flow forecasts have not appeared in Paper 3.",
    (3, "C", 4): "Kotter & Schlesinger has only appeared as an MCQ (2021); Lewin was used in 2023 and 2025.",
    (3, "C", 6): "Globalisation Q6s so far focused on re-shoring (2021); opportunity v threat for all businesses is untested.",
}


# ── HTML helpers ─────────────────────────────────────────────────────────
def page(title, body, toolbar):
    return (f"<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n"
            f"<meta name=\"robots\" content=\"noindex\">\n<title>{e(title)}</title>\n<style>{CSS}</style>\n</head>\n<body>\n"
            f"<div class=\"toolbar\">{toolbar}<button onclick=\"window.print()\">Print / save as PDF</button></div>\n{body}\n</body>\n</html>\n")


def toolbar(paper, s, kind):
    other = f"mark-scheme-{paper}-{s.lower()}.html" if kind == "paper" else f"paper-{paper}-{s.lower()}.html"
    label = "Mark scheme" if kind == "paper" else "Question paper"
    sets = "".join(f'<a href="{kind if kind == "paper" else "mark-scheme"}-{paper}-{x.lower()}.html"{" aria-current=\"page\"" if x == s else ""}>Set {x}</a>' for x in "ABC")
    return f'<a href="{other}">{label}</a>{sets}'


def lines(n):
    return "".join('<div class="lines"></div>' for _ in range(max(2, min(n, 14))))


def table_html(rows, head=True):
    out = "<table>"
    for i, r in enumerate(rows):
        tag = "th" if head and i == 0 else "td"
        out += "<tr>" + "".join(f"<{tag}>{e(str(c))}</{tag}>" for c in r) + "</tr>"
    return out + "</table>"


def ul(items):
    return "<ul>" + "".join(f"<li>{e(i)}</li>" for i in items) + "</ul>"


def levels(marks):
    ao, rows = LEVELS[marks]
    return (f'<div class="lab">Levels of response ({e(ao)})</div>' +
            table_html([["Level", "Marks", "Descriptor"]] + [list(r) for r in rows]))


def header(paper, s, extra_instr, kind="paper"):
    what = "Question paper" if kind == "paper" else "Mark scheme"
    return (f'<div class="sheet"><h1>A-level Business (7132) · {TITLES[paper]}</h1>'
            f'<p class="meta">RA10 predicted paper · {SERIES} · Set {s} · {what} · Time allowed: 2 hours · Maximum mark: 100</p>'
            + (f'<div class="instr"><b>Instructions</b><ul>{"".join(f"<li>{e(i)}</li>" for i in extra_instr)}</ul></div>' if kind == "paper" else "")
            + '<p class="disclaimer">Written by RA10 from a question-by-question analysis of the AQA 7132 papers 2020-2025 and the v2.0 specification. '
              'This is not an official AQA paper and does not contain real exam questions.</p></div>')


def q_html(num, marks, text, answer_lines=True):
    return (f'<div class="q"><span class="mk">[{marks} mark{"s" if marks != 1 else ""}]</span><span class="qn">{e(str(num))}</span>'
            f'<span class="qt">{e(text)}</span>{lines(marks + 2) if answer_lines else ""}</div>')


# ── Paper 1 ──────────────────────────────────────────────────────────────
def p1(s, S):
    n_c = [q["n"] for q in S["c"]]
    n_d = [q["n"] for q in S["d"]]
    instr = ["Answer all questions in Section A and Section B.", f"Answer either Question {n_c[0]} or Question {n_c[1]} in Section C.",
             f"Answer either Question {n_d[0]} or Question {n_d[1]} in Section D.",
             "Section A: 15 marks · Section B: 35 marks · Section C: 25 marks · Section D: 25 marks.", "You may use a calculator."]
    body = header(1, s, instr)
    body += '<div class="sheet"><h2>Section A</h2><p class="note">Answer all questions in this section. Only one answer per question is allowed.</p>'
    for i, m in enumerate(S["mcq"], 1):
        opts = STATEMENT_OPTS if m.get("statements") else m["opts"]
        lead = m["q"] + ("\nRead Statements 1 and 2 and select the correct option." if m.get("statements") else "")
        body += (f'<div class="q"><span class="mk">[1 mark]</span><span class="qn">{i:02d}</span><span class="qt">{e(lead)}</span>'
                 f'<ul class="opts">{"".join(f"<li><b>{l}</b> {e(o)}</li>" for l, o in zip("ABCD", opts))}</ul></div>')
    body += '</div><div class="sheet"><h2>Section B</h2><p class="note">Answer all questions in this section.</p>'
    for q in S["b"]:
        body += q_html(q["n"], q["marks"], q["q"])
    body += "</div>"
    for sec, key in (("C", "c"), ("D", "d")):
        qs = S[key]
        body += f'<div class="sheet"><h2>Section {sec}</h2><p class="note">Answer either Question {qs[0]["n"]} or Question {qs[1]["n"]}.</p>'
        body += q_html(qs[0]["n"], 25, qs[0]["q"], False) + '<p class="or">OR</p>' + q_html(qs[1]["n"], 25, qs[1]["q"], False)
        body += lines(14) + "</div>"
    return body


def p1_ms(s, S):
    body = header(1, s, [], "ms")
    body += '<div class="sheet"><h2>Section A - answers</h2>'
    body += table_html([["Q", "Answer", "Why", "Spec"]] + [[f"{i:02d}", m["ans"], m["why"], m["spec"]] for i, m in enumerate(S["mcq"], 1)])
    body += '</div><div class="sheet"><h2>Section B</h2>'
    for q in S["b"]:
        body += f'<div class="ms"><h3>Question {q["n"]} <span class="mk">[{q["marks"]} marks]</span></h3>'
        if q["kind"] == "calc":
            body += f'<div class="lab">Answer</div><p class="qt">{e(q["answer"])}</p><div class="lab">Mark allocation</div>{ul(q["points"])}<p class="note">Own figure rule applies to follow-through errors.</p>'
        else:
            body += f'<div class="lab">Indicative content</div>{ul(q["content"])}{levels(9)}<p class="note">A 9-mark "Analyse" question needs no conclusion; a judgement earns no extra marks.</p>'
        body += f'<div class="why">Why we predicted this: {e(rationale(1, q["spec"], NOTES.get((1, s, q["n"]), "")))}</div></div>'
    body += "</div>"
    for sec, key in (("C", "c"), ("D", "d")):
        body += f'<div class="sheet"><h2>Section {sec}</h2>'
        for q in S[key]:
            body += (f'<div class="ms"><h3>Question {q["n"]} <span class="mk">[25 marks]</span></h3><p class="qt">{e(q["q"])}</p>'
                     f'<div class="lab">Arguments supporting the statement / view</div>{ul(q["for"])}'
                     f'<div class="lab">Counter-arguments</div>{ul(q["against"])}'
                     f'<div class="lab">Evaluation - what a top-level judgement looks like</div><p>{e(q["judge"])}</p>{levels(25)}'
                     f'<div class="why">Why we predicted this: {e(rationale(1, q["spec"], NOTES.get((1, s, q["n"]), "")))}</div></div>')
        body += "</div>"
    return body


# ── Paper 2 ──────────────────────────────────────────────────────────────
def p2(s, S):
    instr = ["Answer all questions.", "There are three questions, each based on a different business context.",
             "Read the information before each question carefully and use it in your answers.", "You may use a calculator."]
    body = header(2, s, instr)
    for i, ctx in enumerate(S, 1):
        body += f'<div class="sheet"><h2>Question {i}: {e(ctx["title"])}</h2><div class="case">'
        body += "".join(f"<p>{e(p)}</p>" for p in ctx["text"]) + "</div>"
        for a in ctx["appendices"]:
            body += f'<h4>{e(a["title"])}</h4>{table_html(a["table"])}' + (f'<p class="note">{e(a["note"])}</p>' if a.get("note") else "")
        for part in ctx["parts"]:
            body += q_html(f'0{part["n"]}', part["marks"], part["q"])
        body += "</div>"
    return body


def p2_ms(s, S):
    body = header(2, s, [], "ms")
    for i, ctx in enumerate(S, 1):
        body += f'<div class="sheet"><h2>Question {i}: {e(ctx["title"])}</h2>'
        for part in ctx["parts"]:
            body += f'<div class="ms"><h3>0{e(part["n"])} <span class="mk">[{part["marks"]} marks]</span></h3><p class="qt">{e(part["q"])}</p>'
            if part["kind"] == "calc":
                body += f'<div class="lab">Answer</div><p class="qt">{e(part["answer"])}</p><div class="lab">Mark allocation</div>{ul(part["points"])}'
            else:
                body += f'<div class="lab">Indicative content</div>{ul(part["content"])}'
                if part["marks"] in LEVELS:
                    body += levels(part["marks"])
            body += f'<div class="why">Why we predicted this: {e(rationale(2, part["spec"], NOTES.get((2, s, part["n"]), "")))}</div></div>'
        body += "</div>"
    return body


# ── Paper 3 ──────────────────────────────────────────────────────────────
def p3(s, S):
    instr = ["Answer all questions.", "Read the case study (the Insert) before answering the questions.",
             "Spend around 15-20 minutes reading the case study and appendices.", "You may use a calculator."]
    body = header(3, s, instr)
    body += f'<div class="sheet"><h2>Insert: {e(S["title"])}</h2><div class="case">'
    for head, text in S["text"]:
        body += f"<h4>{e(head)}</h4><p>{e(text)}</p>"
    body += "</div>"
    for a in S["appendices"]:
        body += f'<h4>{e(a["title"])}</h4>{table_html(a["table"])}' + (f'<p class="note">{e(a["note"])}</p>' if a.get("note") else "")
    body += '<p class="note">END OF SOURCE</p></div><div class="sheet"><h2>Questions</h2>'
    for q in S["questions"]:
        body += q_html(f'0{q["n"]}', q["marks"], q["q"])
    return body + "</div>"


def p3_ms(s, S):
    body = header(3, s, [], "ms") + f'<div class="sheet"><h2>{e(S["title"])}</h2>'
    for q in S["questions"]:
        body += (f'<div class="ms"><h3>Question 0{q["n"]} <span class="mk">[{q["marks"]} marks]</span></h3><p class="qt">{e(q["q"])}</p>'
                 f'<div class="lab">Indicative content</div>{ul(q["content"])}{levels(q["marks"])}'
                 f'<div class="why">Why we predicted this: {e(rationale(3, q["spec"], NOTES.get((3, s, q["n"]), "")))}</div></div>')
    return body + "</div>"


REDIRECT = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url={u}">'
            '<link rel="canonical" href="{u}"><title>Predicted paper</title></head><body><p>Moved to <a href="{u}">{u}</a>.</p></body></html>\n')


def main():
    os.makedirs(OUT, exist_ok=True)
    builders = {1: (P1.SETS, p1, p1_ms), 2: (P2.SETS, p2, p2_ms), 3: (P3.SETS, p3, p3_ms)}
    written = []
    for n, (sets, paper_fn, ms_fn) in builders.items():
        for s, data in sets.items():
            for kind, fn, name in (("paper", paper_fn, f"paper-{n}-{s.lower()}.html"), ("ms", ms_fn, f"mark-scheme-{n}-{s.lower()}.html")):
                title = f"A-level Business {TITLES[n]} - Predicted {SERIES} Set {s}" + (" - Mark scheme" if kind == "ms" else "")
                with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
                    f.write(page(title, fn(s, data), toolbar(n, s, kind)))
                written.append(name)
        for old, new in ((f"paper-{n}.html", f"paper-{n}-a.html"), (f"mark-scheme-{n}.html", f"mark-scheme-{n}-a.html")):
            with open(os.path.join(OUT, old), "w", encoding="utf-8", newline="\n") as f:
                f.write(REDIRECT.format(u=new))
    print("wrote", len(written), "files to", OUT)


if __name__ == "__main__":
    main()
