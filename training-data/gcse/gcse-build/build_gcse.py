"""Build the OCR GCSE (9–1) Computer Science (J277) app with the shared A-level/AAQ generator.

    python training-data/gcse/gcse-build/ocr_parse.py     # past papers  → out/gcse-computer-science.papers.json
    python training-data/gcse/gcse-build/ocr_spec.py      # specification → out/gcse-computer-science.spec.json
    python training-data/gcse/gcse-build/build_gcse.py    # → revision/gcse/computer-science/

Writes index.html, css/style.css, js/app.js, js/data-loader.js, js/cfg.js, js/spec.js, js/papers-data.js and
figures/*.png. Hand-written content (guide, bank, quiz, cards, RA10 papers) lives in content/gcse-computer-science/<file>/NN_*.js
and is assembled into js/<file>.js — never edit the js/ output by hand.
Engines: revision/a-level/shared-alevel (shared with the A-levels; referenced by absolute path).
"""
import io, json, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, os.path.join(REPO, 'training-data', 'a-level', 'alevel-build'))
import build_alevel as BA        # noqa: E402
AAQ, BU = BA.AAQ, BA.BU

SLUG = 'gcse-computer-science'
OUT = os.path.join(REPO, 'revision', 'gcse', 'computer-science')
V = '20261116'
SHARED = '/revision/a-level/shared-alevel/'

# Chapters = the J277 specification sections. Internal letters A–K; students see "Chapter 1.1 … 2.5".
AIMS = [
    ('A', 'Systems architecture', '1.1', 1), ('B', 'Memory and storage', '1.2', 1),
    ('C', 'Computer networks, connections and protocols', '1.3', 1), ('D', 'Network security', '1.4', 1),
    ('E', 'Systems software', '1.5', 1), ('F', 'Ethical, legal, cultural and environmental impacts', '1.6', 1),
    ('G', 'Algorithms', '2.1', 2), ('H', 'Programming fundamentals', '2.2', 2), ('I', 'Producing robust programs', '2.3', 2),
    ('J', 'Boolean logic', '2.4', 2), ('K', 'Programming languages and IDEs', '2.5', 2),
]
# Keyword evidence for each chapter (question text + its stem). Paper 1 only uses A–F, Paper 2 only G–K.
KEYS = {
    'A': r'\bCPU\b|processor|fetch|execute|decode|\bALU\b|control unit|\bCU\b|register|\bMAR\b|\bMDR\b|program counter|accumulator|von neumann|clock speed|cores?\b|cache|embedded',
    'B': r'\bRAM\b|\bROM\b|virtual memory|primary storage|secondary storage|solid.state|\bSSD\b|magnetic|optical|hard (disk|drive)|capacity|durab|portab|binary|denary|hexadecimal|\bhex\b|\bbits?\b|bytes?\b|kilobyte|megabyte|gigabyte|terabyte|petabyte|nibble|shift|overflow|ASCII|Unicode|character set|pixel|colour depth|resolution|metadata|sample rate|bit depth|sampl|compress|lossy|lossless|file size',
    'C': r'\bLAN\b|\bWAN\b|network|router|switch|\bNIC\b|access point|topolog|\bstar\b|\bmesh\b|client.server|peer.to.peer|\bDNS\b|domain name|hosting|the cloud|cloud|web server|Ethernet|Wi.?Fi|Bluetooth|\bIP\b|IPv4|IPv6|MAC address|protocol|TCP|HTTPS?|\bFTP\b|\bPOP\b|IMAP|SMTP|layers?|standards?|bandwidth|wired|wireless',
    'D': r'malware|virus|worm|trojan|spyware|ransomware|phishing|social engineering|brute.force|denial of service|\bDoS\b|intercept|SQL injection|penetration test|anti.malware|firewall|access level|password|encrypt|physical security|hacker|threat|attack|endanger(s|ing)? the security|security of (the|their)|protect (the|their) (computer|system|network|data)',
    'E': r'operating system|\bOS\b|user interface|multitask|memory management|peripheral|driver|user management|file management|utility|defragment|housekeeping|compression software|encryption software',
    'F': r'ethic|legal|cultural|environment|privacy|Data Protection Act|Computer Misuse Act|Copyright|licen[cs]e|open source|proprietary|impact|society|digital divide|e.waste|legislation',
    'G': r'abstraction|decomposition|algorithmic thinking|computational thinking|structure diagram|flowchart|flow chart|pseudocode|trace table|binary search|linear search|bubble sort|merge sort|insertion sort|search|sort|inputs?, process|identify the input',
    'H': r'variable|constant|data type|integer|real\b|float|Boolean\b(?! (logic|expression))|string|char|casting|cast\b|\bMOD\b|\bDIV\b|operator|iteration|selection|loop|for\b|while\b|array|2D|record|\bSQL\b|SELECT|file|procedure|function|sub ?program|parameter|random|concatenat|substring|slic|length|upper|lower|global|local',
    'I': r'defensive design|validat|authenticat|misuse|maintainab|comment|indent|naming convention|test data|testing|normal|boundary|erroneous|invalid|iterative test|final test|terminal test|syntax error|logic error|test plan',
    'J': r'logic (gate|circuit|diagram)|truth table|\bAND\b|\bOR\b|\bNOT\b|gate',
    'K': r'high.level|low.level|machine code|assembly|translator|compiler|interpreter|\bIDE\b|integrated development|editor|error diagnostic|run.time|debug',
}
PAPER_AIMS = {1: 'ABCDEF', 2: 'GHIJK'}


def classify(paper, text, ctx):
    best, score = PAPER_AIMS[paper][0], (0, 0)
    for a in PAPER_AIMS[paper]:
        rx = re.compile(KEYS[a], re.I)
        s = (sum(len(m.group(0)) for m in rx.finditer(text)), sum(len(m.group(0)) for m in rx.finditer(ctx)))
        if s > score:
            best, score = a, s
    return best


S = dict(
    name='Computer Science', short='Computer Science', board='OCR', code='J277', level='GCSE',
    qual='OCR GCSE (9–1) Computer Science (J277)', pdf='OCR-GCSE-Computer-Science-J277', key='ocr_gcse_cs_j277',
    pal=('#0f766e', '#CCFBF1', '#115E59', '#042F2E', '#99F6E4', ('#042f2e', '#0f766e', '#2dd4bf')),
    papers={1: ('Paper 1', 'Computer systems'), 2: ('Paper 2', 'Computational thinking, algorithms and programming')},
)


def meta():
    m = dict(
        code='J277', name='OCR GCSE Computer Science', key=S['key'], n=1,
        aims='%s–%s' % (AIMS[0][0], AIMS[-1][0]), free='the exam overview and the first chapter', locked='the other chapters', nAims=len(AIMS),
        eyebrow='OCR GCSE (9–1) Computer Science (J277) — two exam papers',
        hero='GCSE Computer Science',
        lede='Every OCR J277 paper from 2022 to 2025 (plus the sample papers) with the official mark schemes, a step-by-step visual revision guide '
             'with interactive diagrams for every topic, an AI Examiner that marks like OCR, and a Python Lab to practise the programming for Paper 2.',
        papers_card='Real OCR papers (Paper 1 Computer systems and Paper 2 Computational thinking, algorithms and programming, 2022–2025) plus RA10 practice papers, each 1 hour 30 minutes and 80 marks. Answer online, reveal the mark scheme, self-mark or let the AI Examiner mark it.',
        format_line='The real format: two papers, each 1 hour 30 minutes and 80 marks, each worth 50% of the GCSE.',
        papers_card2='OCR and RA10 papers with a 90-minute timer, the official mark scheme and AI Examiner marking.',
        mock_default=40, mock_total='<option value="40" selected>40 (half paper)</option><option value="80">80 (full paper)</option><option value="20">20 (quick mock)</option>',
        papers_sub='OCR past papers (June 2022–2025 and the sample papers) and RA10 practice papers for GCSE Computer Science (J277). Paper 1 and Paper 2 are kept separate. Read each paper as it was set, answer it online for AI Examiner feedback, or download it as a PDF.',
        spec_h='GCSE Computer Science specification (J277)', spec_p='The OCR J277 content: Paper 1 (1.1–1.6) and Paper 2 (2.1–2.5), sub-topic by sub-topic.',
        footer='OCR GCSE (9–1) Computer Science (J277). This is a study tool — not an official OCR product.',
        flash_p='Key terms, definitions, units, protocols and programming keywords for both papers.',
        quiz_p='Multiple-choice and true/false questions with an explanation for every answer.',
        guide_p='Every topic explained step by step from the very basics, with interactive diagrams you can click, worked examples, OCR Exam Reference Language and Python side by side, and the exam technique for each command word.',
        calc=False)
    accent, accent2, ink, d2, dink, grad = S['pal']
    m.update(accent=accent, accent2=accent2, ink=ink, d2=d2, dink=dink, grad=grad)
    return m


def post(s):
    s = AAQ.post(s, dict(name=S['name'], short=S['short']), 1)
    s = s.replace('BTEC Level 3 %s' % S['name'], 'OCR GCSE %s' % S['name'])
    s = s.replace('BTEC %s revision' % S['short'], 'GCSE %s revision' % S['short'])
    s = s.replace('BTEC %s' % S['short'], 'OCR GCSE %s' % S['short'])
    s = s.replace('%s Unit 1' % S['short'], 'GCSE %s' % S['short'])
    s = s.replace('Unit 1 ', '').replace('Unit 1:', 'J277:').replace('Unit 1', 'GCSE ' + S['short'])
    s = s.replace('Pearson', 'OCR')
    s = s.replace('GCSE GCSE', 'GCSE').replace('OCR OCR', 'OCR')
    return s


def fig_dir():
    return os.path.join(HERE, 'out', 'figures')


def papers_js():
    src = json.load(io.open(os.path.join(HERE, 'out', SLUG + '.papers.json'), encoding='utf-8'))
    figs = json.load(io.open(os.path.join(HERE, 'out', SLUG + '.figures.json'), encoding='utf-8'))
    names = {a: (n, c) for a, n, c, pn in AIMS}
    papers, used = [], set()
    for p in src:
        if p.get('problems'):
            continue
        items = []
        for it in p['items']:
            ctx = ' '.join(b.get('x', '') if isinstance(b.get('x'), str) else ' '.join(b.get('x') or []) for b in it['ctxb'])
            alt = ' '.join(figs.get(b['id'], {}).get('alt', '') for b in it['ctxb'] if b['t'] == 'fig') + ' ' + figs.get(it.get('fig') or '', {}).get('alt', '')
            aim = classify(p['paper'], it['text'], ctx + ' ' + alt)
            o = {'q': it['q'], 'sub': it['sub'], 'label': it['label'], 'marks': it['marks'], 'section': it['section'], 'aim': aim,
                 'topic': '%s %s' % (names[aim][1], names[aim][0]), 'ctx': [], 'ctxb': it['ctxb'], 'text': it['text'], 'kind': it['kind'], 'ms': it['ms']}
            for k in ('fig', 'padFig', 'diagram'):
                if it.get(k):
                    o[k] = it[k]
            for b in it['ctxb']:
                if b['t'] == 'fig':
                    used.add(b['id'])
            if it.get('fig'):
                used.add(it['fig'])
            items.append(o)
        sam = p['series'].startswith('Sample')
        papers.append({'id': p['id'], 'paper': p['paper'], 'key': '%d%02d%d' % (p['year'], p['month'], 9 - p['paper']), 'series': p['series'],
                       'date': '%s · Paper %d' % (p['series'], p['paper']), 'title': 'Paper %d: %s' % (p['paper'], S['papers'][p['paper']][1]),
                       'source': 'ocr', 'kind': 'exam', 'code': 'J277/0%d' % p['paper'], 'spec': 'past', 'total': 80, 'minutes': 90, 'items': items,
                       'badge': 'OCR · ' + ('Sample paper' if sam else p['series']), 'badgeTone': 'new'})
    fig = {k: {'cap': '', 'alt': (v.get('alt') or 'Figure from the original paper')[:1500], 'src': 'figures/' + v['file']} for k, v in figs.items() if k in used}
    head = ('/* %s — real OCR question papers and mark schemes (generated by training-data/gcse/gcse-build/build_gcse.py from ocr_parse.py\n'
            '   output; do not edit by hand). Question and mark-scheme text © OCR, reformatted by RA10 for revision. */\n') % S['qual']
    s = head + 'window.BIZ_FIGURES = Object.assign(window.BIZ_FIGURES || {}, ' + json.dumps(fig, ensure_ascii=False) + ');\n'
    s += 'window.BIZ_PAPERS = (window.BIZ_PAPERS || []).concat(' + json.dumps(papers, ensure_ascii=False) + ');\n'
    return s, papers, used


QER_LEVELS = [
    {'level': 3, 'marks': '6-8', 'descriptor': 'Thorough knowledge and understanding of a wide range of considerations in relation to the question; the material is generally accurate and detailed. Knowledge and understanding are applied directly and consistently to the context provided. The candidate weighs up both sides of the discussion and refers to the impact on all areas, showing thorough recognition of influencing factors. A well-developed line of reasoning which is clear and logically structured; the information presented is relevant and substantiated.'},
    {'level': 2, 'marks': '3-5', 'descriptor': 'Reasonable knowledge and understanding of a range of considerations; the material is generally accurate but at times underdeveloped. Knowledge is applied to the context although one or two opportunities are missed. A reasonable attempt to discuss the impact on most areas. A line of reasoning with some structure; the information is in the most part relevant and supported by some evidence.'},
    {'level': 1, 'marks': '1-2', 'descriptor': 'Basic knowledge of considerations with limited understanding; the material is basic and contains some inaccuracies. A limited attempt to apply knowledge to the context. The information is basic and communicated in an unstructured way, supported by limited evidence.'},
]


def cfg_js():
    aims = {a: {'name': n, 'code': c, 'paper': pn} for a, n, c, pn in AIMS}
    cfg = {
        'n': 0, 'key': S['key'], 'code': 'J277', 'name': S['qual'], 'kind': 'exam', 'total': 80, 'minutes': 90, 'timeLabel': '1 hour 30 minutes',
        'aims': [a for a, *_ in AIMS], 'subject': S['name'], 'pdfPrefix': S['pdf'], 'realSource': 'ocr', 'board': 'OCR',
        'unitLine': S['qual'], 'formatName': 'GCSE Computer Science', 'qualLine': 'OCR GCSE (9–1) Computer Science (J277)',
        'paperNames': {'1': 'Paper 1 · Computer systems', '2': 'Paper 2 · Algorithms and programming'},
        'specGroups': {'past': {'t': 'OCR past papers (June 2022–2025 and sample papers)', 'd': 'The real J277 papers with the official OCR mark schemes. Paper 1 and Paper 2 are separate.'},
                       'ra10': {'t': 'RA10 practice papers', 'd': 'Written by RA10 in the exact OCR layout: Paper 1 (80 marks, including the 8-mark extended response) and Paper 2 (Section A 50 marks, Section B 30 marks of programming).'}},
        'paperNote': 'Two papers, each 1 hour 30 minutes, 80 marks and 50% of the GCSE. Paper 1 Computer systems (J277/01): chapters 1.1–1.6, with one 8-mark extended-response question on impacts of technology. Paper 2 Computational thinking, algorithms and programming (J277/02): chapters 2.1–2.5 — Section A (50 marks) and Section B (30 marks), where you write and refine code in OCR Exam Reference Language or a high-level language such as Python. No calculators in either paper.',
        'instructions': [
            ['Instructions', ['Use black ink.', 'Answer all the questions.', 'Write your answer to each question in the space provided.', 'Paper 2 Section B: some questions require you to respond using either the OCR Exam Reference Language or a high-level programming language you have studied. These are clearly shown.']],
            ['Information', ['The total mark for this paper is {total}.', 'The marks for each question are shown in brackets [ ].', 'Quality of extended response will be assessed in questions marked with an asterisk (*).', 'No calculator can be used for this paper.']],
            ['Advice', ['Read each question carefully before you start your answer.', 'Paper 2: spend about 50 minutes on Section A and 40 minutes on Section B.']]],
        'howto': ['Filter by Paper 1 or Paper 2 — they cover different chapters and are never mixed. Past papers are the real OCR papers with the official mark schemes; RA10 papers follow the same layout.',
                  'Switch to “Answer online”. Tables, trace tables, flowcharts and logic diagrams are shown exactly as printed — draw on them with the pen tool where the question asks you to complete them.',
                  'Reveal the official mark scheme or press “AI Examiner” for a mark, what earned it and how to get the rest. Paper 2 code can be written in Python or OCR Exam Reference Language.'],
        'legal': 'Past paper and mark-scheme text © OCR, reformatted by RA10 for revision. Tables, code and diagrams are reproduced from the original papers. RA10 practice papers and mark schemes are RA10’s own. This is not an official OCR product.',
    }
    return ('/* %s — configuration for the shared paper viewer, question bank and AI Examiner (generated by build_gcse.py). */\n'
            '(function () {\n  \'use strict\';\n'
            '  const AIMS = %s;\n'
            '  window.BIZ_LEVELS = %s;\n'
            '  window.BIZ_UNIT = Object.assign(%s, {\n'
            '    qLabel: (it) => it.label || String(it.q),\n'
            '    groupLabel: (it) => \'Question \' + it.q,\n'
            '    runLabel: (it) => \'Question \' + it.q,\n'
            '    sectionTitleFor: (s, it, p) => (p && p.paper === 2) ? (s === \'B\' ? \'SECTION B — 30 marks (about 40 minutes)\' : \'SECTION A — 50 marks (about 50 minutes)\') : \'\',\n'
            '    cardMeta: (p) => { const by = {}; p.items.forEach(it => { by[it.section] = (by[it.section] || 0) + it.marks; }); return (p.paper === 2 ? Object.keys(by).sort().map(s => \'Section \' + s + \' \' + by[s]).join(\' · \') + \' · \' : \'\') + new Set(p.items.map(it => it.q)).size + \' questions · \' + p.items.length + \' parts\'; },\n'
            '    classify: function (text, section, q, p, itext) { const it = p && p.items ? p.items.find(x => x.q === q && x.section === section && (!itext || x.text === itext)) || p.items.find(x => x.q === q && x.section === section) : null; return (it && it.aim) || (p && p.paper === 2 ? \'G\' : \'A\'); },\n'
            '    topicFor: function (text, it) { const a = it && it.aim; return a && AIMS[a] ? AIMS[a].code + \' \' + AIMS[a].name : \'\'; }\n'
            '  });\n})();\n') % (S['qual'], json.dumps(aims, ensure_ascii=False), json.dumps({'8': QER_LEVELS}, ensure_ascii=False), json.dumps(cfg, ensure_ascii=False, indent=1))


def spec_js():
    spec = json.load(io.open(os.path.join(HERE, 'out', SLUG + '.spec.json'), encoding='utf-8'))
    aims = {}
    for a, name, code, pn in AIMS:
        area = spec[code]
        aims[a] = {'title': '%s %s' % (code, area['name']), 'short': 'Paper %d · %s' % (pn, 'Computer systems' if pn == 1 else 'Algorithms and programming'), 'paper': pn,
                   'topics': [{'code': s['code'], 'name': s['name'], 'content': s['content']} for s in area['subs']]}
    return ('/* %s — specification content (J277 Version 3.1; generated by build_gcse.py from ocr_spec.py). */\n'
            '(function () {\n  \'use strict\';\n  window.LEARNING_AIMS = %s;\n  window.SPEC = %s;\n})();\n') % (S['qual'], json.dumps(list(aims)), json.dumps(aims, ensure_ascii=False, indent=1))


def build():
    m = meta()
    BU.CSS_LINKS = AAQ.ORIG_CSS.replace('../shared/', SHARED).replace('v=20261101', 'v=' + BA.V)
    scripts = AAQ.ORIG_SCRIPTS.replace('../shared/', SHARED).replace('v=20261101', 'v=' + BA.V)
    scripts = scripts.replace('<script src="js/papers-data.js?v=%s"></script>' % BA.V, '<script src="js/papers-data.js?v=%s"></script>\n<script src="js/papers-ra10.js?v=%s"></script>' % (V, V))
    scripts = scripts.replace('<script src="js/cfg.js', '<script src="/refresh/ra10-units.js?v=20270112"></script>\n<script src="js/cfg.js')
    # this app's own files carry its own cache token
    scripts = re.sub(r'(src="js/[a-z0-9-]+\.js\?v=)\d+', r'\g<1>' + V, scripts)
    BU.SCRIPTS = scripts
    app = BA.chapterise(post(BU.build_app(1, m)))
    css = BU.build_css(1, m)
    idx = BA.chapterise(post(BU.build_index(1, m)))
    idx = idx.replace('../../../../shared/', '../../shared/')
    idx = re.sub(r'<title>[^<]*</title>', '<title>OCR GCSE Computer Science (J277) — Past Papers, Revision Guide, Python Lab and AI Examiner | RA10</title>', idx, count=1)
    idx = re.sub(r'(href="css/style\.css\?v=)[^"]+', r'\g<1>' + V, idx)
    app = app.replace('A-level', 'GCSE')
    idx = idx.replace('A-level', 'GCSE')
    loader = post(BU.build_loader(1, m))
    base = OUT
    BA.wr(os.path.join(base, 'js', 'app.js'), app)
    BA.wr(os.path.join(base, 'css', 'style.css'), css)
    BA.wr(os.path.join(base, 'index.html'), idx)
    BA.wr(os.path.join(base, 'js', 'data-loader.js'), loader)
    chapters = {a: c for a, n, c, pn in AIMS}
    BA.wr(os.path.join(base, 'js', 'cfg.js'), cfg_js() + 'window.AIM_WORD = "Chapter";\nwindow.AIM_LABEL = %s;\n' % json.dumps(chapters))
    BA.wr(os.path.join(base, 'js', 'spec.js'), spec_js())
    pj, papers, used = papers_js()
    BA.wr(os.path.join(base, 'js', 'papers-data.js'), pj)
    fd = os.path.join(base, 'figures')
    os.makedirs(fd, exist_ok=True)
    for f in os.listdir(fd):               # clear old figures (OneDrive can lock the folder itself)
        if f.endswith('.png') and f[:-4] not in used:
            os.remove(os.path.join(fd, f))
    for f in used:
        shutil.copyfile(os.path.join(fig_dir(), f + '.png'), os.path.join(fd, f + '.png'))
    for f, stub in (('bank.js', 'bank'), ('quiz.js', 'quiz'), ('cards.js', 'cards'), ('guide.js', 'guide')):
        p = os.path.join(base, 'js', f)
        if not os.path.exists(p):
            BA.wr(p, BA.STUBS[stub] % {'n': 1})
    if not os.path.exists(os.path.join(base, 'js', 'papers-ra10.js')):
        BA.wr(os.path.join(base, 'js', 'papers-ra10.js'), '/* RA10 practice papers: hand-written. */\n')
    BA.CONTENT = os.path.join(HERE, 'content')
    BA.assemble_content(SLUG, base)
    by = {}
    for p in papers:
        for it in p['items']:
            by[it['aim']] = by.get(it['aim'], 0) + 1
    print('built %s: %d past papers, %d parts; by chapter: %s' % (SLUG, len(papers), sum(len(p['items']) for p in papers),
                                                                 ', '.join('%s %d' % (dict((a, c) for a, n, c, pn in AIMS)[a], by.get(a, 0)) for a, *_ in AIMS)))


if __name__ == '__main__':
    build()
