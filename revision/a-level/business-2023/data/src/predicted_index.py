"""Write the 'Predicted papers & topic trends' block into ../../index.html.

Reads ../past_paper_analysis.json (from past_papers.py) and replaces everything
between <!-- PP27:START --> and <!-- PP27:END --> (inserting the markers on first
run in place of the old single trend chart). Also points the paper cards at the
three predicted sets.

Run:  python past_papers.py && python predicted_2027.py && python predicted_index.py
"""
import html
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.dirname(HERE)
INDEX = os.path.join(os.path.dirname(DATA), "index.html")
e = html.escape

# Best guide/question link for each spec section (topic number, guide code).
LINKS = {"3.1": ("1", "3.1.2"), "3.2": ("2", "3.2.1"), "3.3": ("3", "3.3.2"), "3.4": ("4", "3.4.3"), "3.5": ("5", "3.5.2"),
         "3.6": ("6", "3.6.4"), "3.7": ("7", "3.7.2"), "3.8": ("8", "3.8.2"), "3.9": ("9", "3.9.1"), "3.10": ("10", "3.10.1")}

FORMAT = {
    1: "Section A 15 MCQs · Section B two calculations (8 marks) + three 9-mark Analyse · Sections C and D one 25-mark essay each from a choice of two.",
    2: "Three data-response contexts (~33 marks each). Since 2024 at least one context has been 9 + 9 + 16 with no short calculations.",
    3: "One case study: Q1-Q2 12-mark Analyse · Q3-Q4 16-mark (Q3 almost always needs calculations) · Q5 20-mark decision (often Option 1 v Option 2) · Q6 24-mark 'all businesses'.",
}

INSIGHTS = {
    1: ["Strategic methods (3.9) is the biggest share of Section B-D marks: growth, globalisation, innovation and digital technology come up every year.",
        "Finance (3.5) is only about 5% of extended marks - just two finance essays in six years (2022 finance function, 2024 ratios for non-profits). A finance essay is overdue.",
        "Section B calculations rotate: ratios (2022, 2023, 2025), break-even/variance (2020, 2024), network/decision tree (2021), NPV (2024). Payback and ARR have never been a Section B calculation.",
        "Herzberg has never had his own Paper 1 extended question (Maslow 2023, financial v non-financial 2021, soft HRM 2024).",
        "Spec v2.0 removed Blake Mouton, Hackman & Oldham, Greiner, Hofstede, Bartlett & Ghoshal, Bowman and the Balanced Scorecard - 9 MCQs and one essay since 2020 used them. Tannenbaum Schmidt is new and has never been examined."],
    2: ["Strategic position (3.7) dominates (a quarter of all marks): a ratio or investment appraisal calculation has appeared in Question 1 every year 2020-2025.",
        "Every year includes a people question with a named theory: Taylor 2020, engagement 2021, Maslow 2022, managers' roles 2023, trade unions 2024, Herzberg 2025.",
        "The final 16-marker of a context usually asks about 'all businesses' and growth methods are recurring: franchising 2020, ventures 2022.",
        "Change management (3.10) is under-used in Paper 2: power culture 2020, Lewin 2023 only.",
        "2024 and 2025 both had contexts structured 9 + 9 + 16 - expect fewer 2-4 mark questions than the 2020-2023 papers."],
    3: ["Human resources has been the focus of just one Paper 3 question in six years (2025 Q4). It is the most under-examined area relative to the specification.",
        "Q3 has needed calculations every year: ratios (2022), efficiency data (2023), investment appraisal (2021 Q5, 2024 Q3). Expect payback/ARR/NPV, ratios or break-even.",
        "Q5 is a 20-mark decision: two-option choices in 2021 (sites) and 2024 (organic v franchise); financing/risk in 2023; stakeholders in 2022; legislation in 2025.",
        "Q6 themes so far: CSR, re-shoring, strategic planning, leadership, innovation, capacity. Not yet: globalisation as opportunity v threat, five forces, technology, competitive advantage of small v large firms.",
        "Cases swung from large plcs (2020-21) to small Ltds (2022-24) and back to a large manufacturer (2025) - prepare for both, and for reading balance sheets."],
}

PREDICTIONS = {
    1: [("High", "A finance essay - cash flow v profit, sources of finance or ratios (3.5)", "5", "3.5.1"),
        ("High", "Herzberg / does pay motivate? (3.6.4)", "6", "3.6.4"),
        ("High", "Tannenbaum Schmidt leadership continuum - new in spec v2.0 (3.2.1)", "2", "3.2.1"),
        ("High", "Payback or ARR as a Section B calculation (3.7.8)", "7", "3.7.8"),
        ("Medium", "HR calculations: labour productivity, turnover or labour cost per unit (3.6.2)", "6", "3.6.2"),
        ("Medium", "Porter's five forces or generic strategies essay (3.7.7 / 3.8.2)", "7", "3.7.7"),
        ("Medium", "Inflation or taxation 9-marker (3.7.5)", "7", "3.7.5"),
        ("Medium", "Big data, data mining or automation (3.9.4)", "9", "3.9.4")],
    2: [("High", "Ratio or investment appraisal calculation in Q1 (3.7.2 / 3.7.8)", "7", "3.7.2"),
        ("High", "Leadership or motivation theory 9-marker - Tannenbaum Schmidt or Herzberg (3.2.1 / 3.6.4)", "6", "3.6.4"),
        ("High", "Growth or finance method for 'all businesses' - crowd funding, takeovers, joint ventures (3.5.3 / 3.9.1)", "9", "3.9.1"),
        ("Medium", "Innovation and intellectual property - patents, intrapreneurship, benchmarking (3.9.2)", "9", "3.9.2"),
        ("Medium", "Change management - Kotter & Schlesinger, culture (3.10.1 / 3.10.2)", "10", "3.10.1"),
        ("Medium", "Interpreting market research - sampling, confidence, extrapolation (3.3.2)", "3", "3.3.2")],
    3: [("High", "An HR question - workforce planning, motivation or organisational structure (3.6)", "6", "3.6.3"),
        ("High", "Q3 with investment appraisal, ratios or break-even calculations (3.7.8 / 3.7.2 / 3.5.2)", "7", "3.7.8"),
        ("High", "Q5 'Option 1 or Option 2' using quantitative and qualitative data (3.8.1 / 3.9.1)", "8", "3.8.1"),
        ("Medium", "Porter's five forces applied to the case - never yet in Paper 3 (3.7.7)", "7", "3.7.7"),
        ("Medium", "Kotter & Schlesinger resistance to change (Lewin was 2025) (3.10.1)", "10", "3.10.1"),
        ("Medium", "Q6 on globalisation, technology or competitive advantage for all businesses", "9", "3.9.3")],
}

STYLE = """
<style>
.papers-card-grid>*,.paper-launch-card>*{min-width:0}.paper-launch-card .papers-table{min-width:0}.paper-launch-card .papers-table td{padding:8px 8px;font-size:.8rem}
.pp27-tabs{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:rgba(17,60,43,.07);margin:4px 0 14px}
.pp27-tab{border:0;background:transparent;border-radius:999px;padding:7px 14px;font:inherit;font-size:.82rem;font-weight:700;color:#2c4a3d;cursor:pointer}
.pp27-tab[aria-selected="true"]{background:#fff;color:#113c2b;box-shadow:0 1px 3px rgba(15,23,42,.15)}
.pp27-panel[hidden]{display:none}
.pp27-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:18px;align-items:start}
@media(max-width:900px){.pp27-grid{grid-template-columns:1fr}}
.pp27-format{font-size:.84rem;color:#435a50;margin:0 0 12px}
.pp27-insights{margin:0;padding-left:18px;font-size:.86rem;color:#2f463c}
.pp27-insights li{margin:0 0 7px}
.pp27-pred{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.pp27-pred li{display:flex;gap:10px;align-items:flex-start;border:1px solid #d2e6dc;border-radius:12px;padding:9px 11px;background:#fff;font-size:.85rem}
.pp27-pred .lvl{flex-shrink:0;font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;padding:3px 8px;border-radius:999px;background:#fde8e8;color:#a11b1b}
.pp27-pred .lvl.Medium{background:#fff4dc;color:#8a5a00}
.pp27-pred span.t{flex:1}
.pp27-pred button{flex-shrink:0;border:1px solid #bcd8cb;border-radius:999px;background:#fff;padding:3px 9px;font-size:.72rem;font-weight:700;color:#154736;cursor:pointer}
.pp27-sets{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 0}
.pp27-set{display:inline-flex;align-items:center;gap:6px;border:1px solid #c9e1d5;border-radius:12px;padding:6px 10px;background:#fff;font-size:.8rem}
.pp27-set b{color:#113c2b}
.pp27-set a{color:#1b7a4f;font-weight:700;text-decoration:none}
.pp27-set a:hover{text-decoration:underline}
.pp27-ctx{font-size:.8rem;color:#4e655b;margin:10px 0 0}
[data-theme="dark"] .pp27-tab{color:#cfe3d9}
[data-theme="dark"] .pp27-tab[aria-selected="true"]{background:#1f2a26;color:#e8f5ee}
[data-theme="dark"] .pp27-pred li,[data-theme="dark"] .pp27-set{background:#17201d;border-color:#2c4038}
[data-theme="dark"] .pp27-insights,[data-theme="dark"] .pp27-format,[data-theme="dark"] .pp27-ctx{color:#b9d0c5}
[data-theme="dark"] .pp27-set b{color:#e8f5ee}
</style>"""

SCRIPT = """
<script>
(function(){
  var tabs=document.querySelectorAll('.pp27-tab');
  tabs.forEach(function(t){t.addEventListener('click',function(){
    tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',String(on));document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});
  });});
})();
</script>"""


def set_links(n):
    return "".join(
        f'<span class="pp27-set"><b>Set {s}</b><a href="predicted-papers/paper-{n}-{s.lower()}.html" target="_blank" rel="noopener">Paper</a>'
        f'<a href="predicted-papers/mark-scheme-{n}-{s.lower()}.html" target="_blank" rel="noopener">Mark scheme</a></span>' for s in "ABC")


def trend_rows(sections):
    rows = []
    top = max(s["share"] for s in sections if not s["code"].startswith("retired")) or 1
    for s in sections:
        if s["code"].startswith("retired"):
            continue
        aim, code = LINKS[s["code"]]
        rows.append(
            f'<div class="trend-row"><div class="trend-meta"><strong>{e(s["code"])} {e(s["name"])}</strong>'
            f'<span>{s["questions"]} extended question{"s" if s["questions"] != 1 else ""} · {s["marks"]} marks</span>'
            f'<div class="trend-actions"><button class="btn" type="button" onclick="openPredictedPaperFocus(\'guide\',\'{aim}\',\'{code}\',\'\')">Guide</button>'
            f'<button class="btn" type="button" onclick="openPredictedPaperFocus(\'questions\',\'{aim}\',\'{code}\',\'\')">Questions</button></div></div>'
            f'<div class="trend-bar"><span style="width:{s["share"] / top * 100:.0f}%"></span></div><div class="trend-value">{s["share"]:.0f}%</div></div>')
    return "".join(rows)


def build_block(data):
    p = data["papers"]
    out = ['<!-- PP27:START (generated by data/src/predicted_index.py - do not edit by hand) -->', STYLE,
           '<section class="papers-insight-card" id="pp27-trends">',
           '<h3>Topic trends by paper and our June 2027 predictions</h3>',
           '<p>Every question from the AQA 7132 papers 2020-2024 was read and tagged to the v2.0 specification, plus the 2025 extended questions from the examiner reports. '
           'Bars show each section\'s share of the extended-question marks (MCQs excluded) in that paper. The predictions below drove our three predicted sets for each paper.</p>',
           '<div class="pp27-tabs" role="tablist" aria-label="Choose a paper">']
    for n in (1, 2, 3):
        out.append(f'<button class="pp27-tab" role="tab" id="pp27-tab-{n}" aria-controls="pp27-panel-{n}" aria-selected="{"true" if n == 1 else "false"}">Paper {n}</button>')
    out.append("</div>")
    for n in (1, 2, 3):
        d = p[str(n)]
        n_ext = sum(1 for q in d["questions"] if q["kind"] != "mcq")
        out.append(f'<div class="pp27-panel" role="tabpanel" id="pp27-panel-{n}" aria-labelledby="pp27-tab-{n}"{"" if n == 1 else " hidden"}>')
        out.append(f'<p class="pp27-format"><strong>Format:</strong> {e(FORMAT[n])} <em>({n_ext} extended questions analysed{", plus 75 MCQs" if n == 1 else ""}.)</em></p>')
        out.append('<div class="pp27-grid"><div><div class="trend-chart">' + trend_rows(d["sections"]) + "</div>")
        if n == 3:
            ctx = data["contexts"]["3"]
            out.append('<p class="pp27-ctx"><strong>Case studies:</strong> ' + " · ".join(f"{y}: {e(c)}" for y, c in sorted(ctx.items())) + "</p>")
        if n == 2:
            ctx = data["contexts"]["2"]
            out.append('<p class="pp27-ctx"><strong>Contexts:</strong> ' + " · ".join(f"{y}: {e(', '.join(c))}" for y, c in sorted(ctx.items())) + "</p>")
        out.append("</div><div><h4>What the trend says</h4><ul class=\"pp27-insights\">" + "".join(f"<li>{e(i)}</li>" for i in INSIGHTS[n]) + "</ul>")
        out.append('<h4>Most likely for June 2027</h4><ul class="pp27-pred">')
        for lvl, text, aim, code in PREDICTIONS[n]:
            out.append(f'<li><span class="lvl {lvl}">{lvl}</span><span class="t">{e(text)}</span>'
                       f'<button type="button" onclick="openPredictedPaperFocus(\'guide\',\'{aim}\',\'{code}\',\'\')">Revise</button></li>')
        out.append("</ul>")
        out.append(f'<h4>Predicted papers built from this</h4><div class="pp27-sets">{set_links(n)}</div></div></div></div>')
    out.append('<p class="papers-footnote">2020-2024 data come from the question papers themselves; 2025 entries are reconstructed from the examiner reports. '
               'Codes show the main spec section - most long questions are synoptic. Predictions are informed estimates, not leaks: revise the whole specification.</p>')
    out.append("</section>" + SCRIPT + "\n<!-- PP27:END -->")
    return "\n".join(out)


def main():
    with open(os.path.join(DATA, "past_paper_analysis.json"), encoding="utf-8") as f:
        data = json.load(f)
    s = open(INDEX, encoding="utf-8").read()
    block = build_block(data)
    if "<!-- PP27:START" in s:
        s = re.sub(r"<!-- PP27:START.*?<!-- PP27:END -->", lambda m: block, s, flags=re.S)
    else:
        old = re.search(r'\s*<section class="papers-insight-card">\s*<h3>How often each spec section has been examined.*?</section>', s, flags=re.S)
        if not old:
            raise SystemExit("could not find the old trend chart to replace")
        s = s[:old.start()] + "\n\n    " + block + s[old.end():]
    # Paper cards: one 'Predicted paper' link -> three sets.
    for n in (1, 2, 3):
        s = re.sub(
            rf'<a class="btn" href="predicted-papers/paper-{n}(?:-a)?\.html"[^>]*>Predicted paper</a>\s*<a class="btn ghost" href="predicted-papers/mark-scheme-{n}(?:-a)?\.html"[^>]*>Mark scheme</a>',
            f'<a class="btn" href="predicted-papers/paper-{n}-a.html" target="_blank" rel="noopener">Predicted Set A</a>'
            f'<a class="btn ghost" href="#pp27-trends" onclick="var t=document.getElementById(\'pp27-tab-{n}\');if(t)t.click();">Sets B &amp; C</a>',
            s)
    # Correct the 2022 Paper 1 map row (Q17 was payables days).
    s = s.replace("Inventory turnover · receivables days · current ratio (3.7.2)", "Inventory turnover · payables days · current ratio (3.7.2)")
    with open(INDEX, "w", encoding="utf-8", newline="") as f:
        f.write(s)
    print("updated", INDEX)


if __name__ == "__main__":
    main()
