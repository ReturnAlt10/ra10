"""Create revision/a-level/shared-alevel/ — the A-level copy of the shared engines (from the BTEC AAQ copies).

    python training-data/a-level/alevel-build/make_shared.py

The AAQ engines (revision/btec/level-3/shared-aaq) are copied and patched with exact, asserted replacements,
so AAQ units are never affected. A-level additions to biz-papers.js:
  • any exam board: C.realSource ('aqa' / 'pearson'), C.board ('AQA' / 'Pearson'), C.unitLine for running heads
  • paper filter chips (C.paperNames → All · Paper 1 · Paper 2 · Paper 3)
  • optional topics (items with opt:{group,name}, e.g. AQA Psychology Paper 3 Sections B–D): the learner picks one
    topic per section; the paper, its total, timer and PDF follow that choice (saved per paper)
  • raster figures: BIZ_FIGURES[id] = { cap, alt, src } (cropped from the official paper) as well as inline SVG
Re-run after changing the AAQ engines, then bump V in build_alevel.py.
"""
import io, os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
SRC = os.path.join(REPO, 'revision', 'btec', 'level-3', 'shared-aaq')
DST = os.path.join(REPO, 'revision', 'a-level', 'shared-alevel')
FILES = ['biz-papers.js', 'biz-papers.css', 'biz-guide.js', 'biz-guide.css', 'biz-bank.js']


def patch(text, pairs, name):
    for old, new in pairs:
        n = text.count(old)
        if n == 0:
            raise SystemExit('%s: patch target not found:\n%s' % (name, old[:200]))
        text = text.replace(old, new)
    return text


PAPERS = [
    ("  function figNode(id) {\n    const f = figOf(id);\n    if (!f) return null;\n    const fig = document.createElement('figure');\n    fig.className = 'pp-fig';\n    fig.innerHTML = f.svg;   // trusted: our own data files",
     "  function figNode(id) {\n    const f = figOf(id);\n    if (!f) return null;\n    const fig = document.createElement('figure');\n    fig.className = 'pp-fig' + (f.src ? ' pp-fig-img' : '');\n    if (f.src) { const im = document.createElement('img'); im.src = f.src; im.alt = f.alt || f.cap || ''; im.loading = 'lazy'; fig.appendChild(im); }\n    else fig.innerHTML = f.svg;   // trusted: our own data files"),
    ("          const k = scale || 2;", "          const k = f.src ? 1 : (scale || 2);"),
    ("      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(f.svg);",
     "      img.src = f.src ? f.src : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(f.svg);"),
    ("    const allPapers = () => window.BIZ_PAPERS || [];\n    const getPaper = (id) => allPapers().find(p => p.id === id);",
     "    const allPapers = () => window.BIZ_PAPERS || [];\n"
     "    const REAL = C.realSource || 'pearson', BOARD = C.board || 'Pearson';\n"
     "    const unitLine = () => C.unitLine || `Unit ${C.n}: ${C.name}`;\n"
     "    // optional topics: one per group (e.g. AQA Psychology Paper 3 Sections B, C and D)\n"
     "    const OPT_KEY = 'ra10_alevel_opts_';\n"
     "    const optChoice = (p) => { try { return JSON.parse(localStorage.getItem(OPT_KEY + p.id) || '{}') || {}; } catch (e) { return {}; } };\n"
     "    function optGroups(p) { const g = {}; (p.items || []).forEach(it => { if (it.opt) { g[it.opt.group] = g[it.opt.group] || []; if (g[it.opt.group].indexOf(it.opt.name) < 0) g[it.opt.group].push(it.opt.name); } }); return g; }\n"
     "    function viewOf(p) {\n"
     "      if (!p) return p;\n"
     "      const g = optGroups(p);\n"
     "      if (!Object.keys(g).length) return p;\n"
     "      const ch = optChoice(p);\n"
     "      const items = p.items.filter(it => !it.opt || (ch[it.opt.group] || g[it.opt.group][0]) === it.opt.name);\n"
     "      return Object.assign({}, p, { items, total: items.reduce((s, it) => s + it.marks, 0), _groups: g, _choice: ch });\n"
     "    }\n"
     "    const getPaper = (id) => viewOf(allPapers().find(p => p.id === id));"),
    ("      const cur = filter || host.dataset.filter || 'pearson';", "      const cur = filter || host.dataset.filter || REAL;"),
    ("      const nP = papers.filter(p => p.source === 'pearson').length, nR = papers.filter(p => p.source === 'ra10').length;",
     "      const nP = papers.filter(p => p.source === REAL).length, nR = papers.filter(p => p.source === 'ra10').length;"),
    ("      [['pearson', 'Past Papers', nP], ['ra10', 'RA10 Papers', nR]].forEach(([k, label, n]) => {",
     "      [[REAL, 'Past Papers', nP], ['ra10', 'RA10 Papers', nR]].forEach(([k, label, n]) => {"),
    ("      if (C.paperNote) host.appendChild(el('p', { class: 'pp-libnote' }, C.paperNote));",
     "      if (C.paperNote) host.appendChild(el('p', { class: 'pp-libnote' }, C.paperNote));\n"
     "      const pf = host.dataset.pf || 'all';\n"
     "      if (C.paperNames) {\n"
     "        const chips = el('div', { class: 'pp-paperchips', role: 'group', 'aria-label': 'Paper' });\n"
     "        [['all', 'All papers']].concat(Object.keys(C.paperNames).map(k => [k, C.paperNames[k]])).forEach(([k, label]) => {\n"
     "          const b = el('button', { type: 'button', class: String(k) === pf ? 'on' : '', 'aria-pressed': String(String(k) === pf) }, label);\n"
     "          b.addEventListener('click', () => { host.dataset.pf = String(k); renderPapers(cur); });\n"
     "          chips.appendChild(b);\n"
     "        });\n"
     "        host.appendChild(chips);\n"
     "      }"),
    ("      papers.filter(p => p.source === cur).slice()", "      papers.filter(p => p.source === cur && (pf === 'all' || String(p.paper) === pf)).slice()"),
    ("el('span', { class: 'pp-series' }, p.source === 'pearson' ? p.series : 'RA10 practice')", "el('span', { class: 'pp-series' }, p.source === REAL ? p.series : (p.series || 'RA10 practice'))"),
    ("el('small', null, 'Learner registration number')", "el('small', null, 'Candidate number')"),
    ("['Learner registration number', M + 88, 34, 86]", "['Candidate number', M + 88, 34, 86]"),
    ("topic: (c.topicFor && c.topicFor(it.text)) || ('Section ' + it.section),", "topic: it.topic || (c.topicFor && c.topicFor(it.text)) || ('Section ' + it.section),"),
    ("      host.appendChild(el('p', { class: 'pp-legal' }, C.legal || 'Past paper text © Pearson Education Ltd,", "      host.appendChild(el('p', { class: 'pp-legal' }, C.legal || 'Past paper text © ' + BOARD + ',"),
    ("      return el('div', { class: 'pp-runhead' }, el('span', null, `Unit ${C.n}: ${C.name}`), el('span', null, label));",
     "      return el('div', { class: 'pp-runhead' }, el('span', null, unitLine()), el('span', null, label));"),
    ("el('span', null, p.source === 'pearson' ? `Pearson ${p.series} · ${p.code || C.code}` : 'RA10 practice paper')",
     "el('span', null, p.source === REAL ? `${BOARD} ${p.series} · ${p.code || C.code}` : 'RA10 practice paper')"),
    ("      host.appendChild(bar);\n",
     "      host.appendChild(bar);\n"
     "      if (p._groups) {\n"
     "        const ob = el('div', { class: 'pp-optbar' }, el('b', null, 'Your options'), el('span', null, 'Answer one topic in each of these sections — choose the ones you study:'));\n"
     "        Object.keys(p._groups).sort().forEach(gk => {\n"
     "          const sel = el('select', { 'aria-label': 'Section ' + gk + ' topic' });\n"
     "          p._groups[gk].forEach(n => { const o = el('option', { value: n }, 'Section ' + gk + ': ' + n); if ((p._choice[gk] || p._groups[gk][0]) === n) o.selected = true; sel.appendChild(o); });\n"
     "          sel.addEventListener('change', () => { const ch = Object.assign({}, p._choice, { [gk]: sel.value }); try { localStorage.setItem(OPT_KEY + p.id, JSON.stringify(ch)); } catch (e) {} openPaper(id, { mode: view.mode, keepScroll: true }); });\n"
     "          ob.appendChild(sel);\n"
     "        });\n"
     "        host.appendChild(ob);\n"
     "      }\n"),
    ("el('small', null, p.legal || (p.source === 'pearson' ? 'Past paper content © Pearson Education Ltd. Reformatted by RA10 for revision.' : `RA10 practice paper written in the Pearson Unit ${C.n} format.`))",
     "el('small', null, p.legal || (p.source === REAL ? 'Past paper content © ' + BOARD + '. Reformatted by RA10 for revision.' : `RA10 practice paper written in the ${BOARD} ${C.formatName || ('Unit ' + C.n)} format.`))"),
    ("      page.appendChild(el('h3', null, `Unit ${C.n}: ${C.name}`));", "      page.appendChild(el('h3', null, unitLine()));"),
    ("        const unitLine = `Unit ${C.n}: ${C.name}`;", "        const unitLine = C.unitLine || `Unit ${C.n}: ${C.name}`;"),
    ("doc.text(clean(p.legal || (p.source === 'pearson' ? 'Past paper content (c) Pearson Education Ltd. Reformatted by RA10 for revision practice.' : `RA10 practice paper written in the Pearson Unit ${C.n} format.`)), M, 286);",
     "doc.text(clean(p.legal || (p.source === REAL ? 'Past paper content (c) ' + BOARD + '. Reformatted by RA10 for revision practice.' : `RA10 practice paper written in the ${BOARD} ${C.formatName || ('Unit ' + C.n)} format.`)), M, 286);"),
    ("const fname = `${C.pdfPrefix || 'BTEC-Business'}-Unit${C.n}-${(p.source === 'pearson' ? p.series : 'Practice-' + p.title)",
     "const fname = `${C.pdfPrefix || 'BTEC-Business'}${C.n ? '-Unit' + C.n : ''}-${(p.source === REAL ? p.series + '-Paper' + (p.paper || '') + (p._choice ? '-' + Object.values(p._choice).join('-') : '') : 'Practice-' + p.title)"),
    ("doc.text(clean(p.source === 'pearson' ? (p.date || p.series) : 'RA10 practice paper'), M, 78);",
     "doc.text(clean(p.source === REAL ? (p.date || p.series) : 'RA10 practice paper'), M, 78);"),
    ("page.appendChild(el('p', { class: 'pp-series-big' }, p.source === 'pearson' ? (p.date || p.series) : 'RA10 practice paper'));",
     "page.appendChild(el('p', { class: 'pp-series-big' }, p.source === REAL ? (p.date || p.series) : 'RA10 practice paper'));"),
    # exam-board question numbering (AQA "05.1"), nav labels and section headings that name the chosen topic
    ("el('span', { class: 'pp-qnum' }, it.sub ? '(' + it.sub + ')' : String(it.q)), el('p', { class: 'pp-qtext' }, it.text), el('span', { class: 'pp-qmarks' }, `(${it.marks})`)));\n        if (mode === 'answer' && isDiagram(it)) {",
     "el('span', { class: 'pp-qnum' }, C.qLabel ? C.qLabel(it) : (it.sub ? '(' + it.sub + ')' : String(it.q))), el('p', { class: 'pp-qtext' }, it.text), el('span', { class: 'pp-qmarks' }, `(${it.marks})`)));\n"
     "        if (it.offspec) page.appendChild(el('p', { class: 'pp-offspec' }, it.offspec));\n"
     "        if (mode === 'answer' && isDiagram(it)) {"),
    ("qgroups.forEach(g => navItems.push(['pp-q-' + g[0].q, `Question ${g[0].q}`, null,",
     "qgroups.forEach(g => navItems.push(['pp-q-' + g[0].q, C.groupLabel ? C.groupLabel(g[0]) : `Question ${g[0].q}`, null,"),
    ("      const secTitle = sectionTitle && (C.sectionTitles ? C.sectionTitles[sectionTitle] :",
     "      const secTitle = sectionTitle && (C.sectionTitleFor ? C.sectionTitleFor(sectionTitle, q0, p) : C.sectionTitles ? C.sectionTitles[sectionTitle] :"),
]

# guide: A-level chapters reuse the aimLabels path with a configurable word ("Chapter 3: Attachment")
GUIDE = [
    ("${d.aimLabels ? 'Unit ' + d.aimLabels[letter] + ': ' :", "${d.aimLabels ? (d.aimWord || 'Unit') + ' ' + d.aimLabels[letter] + ': ' :"),
    ("Mark ${d.aimLabels ? 'unit ' + d.aimLabels[letter] :", "Mark ${d.aimLabels ? (d.aimWord || 'unit').toLowerCase() + ' ' + d.aimLabels[letter] :"),
    ("const nm = d.aimLabels ? 'unit ' + d.aimLabels[a] :", "const nm = d.aimLabels ? (d.aimWord || 'unit').toLowerCase() + ' ' + d.aimLabels[a] :"),
]

CSS_ADD = """
/* ── A-level additions (make_shared.py) ── */
.pp-paperchips{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 14px}
.pp-paperchips button{padding:7px 13px;border-radius:999px;border:1px solid var(--line,#dfe3ea);background:var(--surface,#fff);color:var(--ink-2,#5b6174);font:700 .82rem/1.2 inherit;cursor:pointer}
.pp-paperchips button.on{background:var(--ink,#111);border-color:var(--ink,#111);color:var(--surface,#fff)}
.pp-optbar{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin:10px 0 14px;padding:12px 14px;border-radius:14px;border:1.5px dashed color-mix(in srgb,var(--accent,#4f46e5) 45%,var(--line,#dfe3ea));background:color-mix(in srgb,var(--accent,#4f46e5) 6%,var(--surface,#fff))}
.pp-optbar b{font-size:.9rem}
.pp-optbar span{flex-basis:100%;font-size:.84rem;color:var(--ink-2,#5b6174)}
.pp-optbar select{padding:8px 10px;border-radius:10px;border:1px solid var(--line-2,#cfd5df);background:var(--surface,#fff);color:inherit;font:600 .86rem/1.2 inherit;max-width:100%}
.pp-fig-img img{display:block;max-width:100%;height:auto;margin:0 auto;border-radius:6px;background:#fff}
.pp-offspec{margin:4px 0 10px;padding:8px 12px;border-radius:10px;border-left:3px solid #d97706;background:color-mix(in srgb,#f59e0b 10%,var(--surface,#fff));color:var(--ink,#111);font-size:.84rem;line-height:1.45}
"""


def main():
    os.makedirs(DST, exist_ok=True)
    for f in FILES:
        shutil.copyfile(os.path.join(SRC, f), os.path.join(DST, f))
    p = os.path.join(DST, 'biz-papers.js')
    s = io.open(p, encoding='utf-8').read()
    s = s.replace('Past-paper text is reproduced from the Pearson papers for revision (© Pearson Education Ltd). */',
                  'Past-paper text is reproduced from the exam-board papers for revision (© the exam board). A-level copy: see training-data/a-level/alevel-build/make_shared.py. */')
    s = patch(s, PAPERS, 'biz-papers.js')
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
    g = os.path.join(DST, 'biz-guide.js')
    gs = patch(io.open(g, encoding='utf-8').read(), GUIDE, 'biz-guide.js')
    io.open(g, 'w', encoding='utf-8', newline='\n').write(gs)
    c = os.path.join(DST, 'biz-papers.css')
    io.open(c, 'a', encoding='utf-8', newline='\n').write(CSS_ADD)
    print('shared-alevel: %d files written, %d patches applied' % (len(FILES), len(PAPERS)))


if __name__ == '__main__':
    main()
