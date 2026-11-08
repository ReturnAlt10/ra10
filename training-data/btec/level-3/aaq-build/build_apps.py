"""Build the BTEC National AAQ unit apps on the same app as BTEC Business / IT Unit 1.

python build_apps.py                      every unit
python build_apps.py computing-aaq        one subject
python build_apps.py computing-aaq 1 2    some units

Generated per unit (revision/btec/level-3/<slug>/unit-<N>/):
  index.html, css/style.css, js/app.js, js/data-loader.js   (Business generator, see business/build/build_units.py)
  js/cfg.js            window.BIZ_UNIT for the shared paper viewer (exam layout, instructions, aim classifier)
  js/papers-data.js    window.BIZ_LEVELS + the Pearson sample paper converted from out/<slug>.u<N>.sam.json
  js/assignment-data.js  (assignment units) criteria + assessor guidance from the specification
Hand-written per unit (never overwritten): js/spec.js, js/bank.js, js/quiz.js, js/cards.js, js/guide.js,
  js/papers-ra10.js (exam units), js/assignment-help.js (assignment units).
Shared engines: revision/btec/level-3/shared-aaq/ (copies of the Business engines, so no other subject is affected).
See PLAYBOOK.md for the content standard.
"""
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(REPO, 'training-data', 'btec', 'level-3', 'business', 'build'))
import build_units as BU  # noqa: E402  (the Business generator)
ORIG_CSS, ORIG_SCRIPTS = BU.CSS_LINKS, BU.SCRIPTS

OUT = os.path.join(REPO, 'revision', 'btec', 'level-3')
V = '20261208'

SUBJECTS = {
    'computing-aaq': dict(name='Computing', short='Computing', pdf='BTEC-Computing',
                          pal=('#4f46e5', '#E0E7FF', '#3730A3', '#1E1B4B', '#C7D2FE', ('#1e1b4b', '#4f46e5', '#818cf8'))),
    'construction-aaq': dict(name='Construction and the Built Environment', short='Construction', pdf='BTEC-Construction',
                             pal=('#b45309', '#FEF3C7', '#92400E', '#451A03', '#FDE68A', ('#451a03', '#b45309', '#f59e0b'))),
    'early-childhood-development-aaq': dict(name='Early Childhood Development', short='Early Childhood', pdf='BTEC-Early-Childhood',
                                            pal=('#db2777', '#FCE7F3', '#9D174D', '#500724', '#FBCFE8', ('#500724', '#db2777', '#f472b6'))),
    'engineering-aaq': dict(name='Engineering', short='Engineering', pdf='BTEC-Engineering',
                            pal=('#0369a1', '#E0F2FE', '#075985', '#082F49', '#BAE6FD', ('#082f49', '#0369a1', '#38bdf8'))),
    'health-and-social-care-aaq': dict(name='Health and Social Care', short='Health and Social Care', pdf='BTEC-HSC',
                                       pal=('#0d9488', '#CCFBF1', '#115E59', '#042F2E', '#99F6E4', ('#042f2e', '#0d9488', '#2dd4bf'))),
    'medical-science-aaq': dict(name='Medical Science', short='Medical Science', pdf='BTEC-Medical-Science',
                                pal=('#dc2626', '#FEE2E2', '#991B1B', '#450A0A', '#FECACA', ('#450a0a', '#dc2626', '#f87171'))),
}

# AAQ generic levels-based descriptors (the wording Pearson uses across AAQ papers). Extra tariffs are scaled.
def levels_for(marks):
    def L(n, rng, d):
        return {'level': n, 'marks': rng, 'descriptor': d}
    ao2 = ['basic application of knowledge and understanding that is partially relevant to the context, and may consider only one side',
           'good application of knowledge and understanding that is relevant to the context and considers both sides',
           'comprehensive application of knowledge and understanding that is consistently relevant to the context and balanced']
    ao3a = ['a basic analysis that superficially breaks the situation down into its parts',
            'a good analysis that breaks the situation down into its parts and shows some links between them',
            'a thorough analysis that comprehensively breaks the situation down and links the parts']
    ao3b = ['a basic evaluation that partially considers different factors, leading to a superficial or unsupported conclusion',
            'a good evaluation that considers different factors and competing points, leading to a partially supported conclusion',
            'a comprehensive evaluation that considers different factors and their relative importance, leading to a well-supported conclusion']
    if marks <= 4:
        return None
    third = marks // 3
    bands = [(1, third), (third + 1, 2 * third), (2 * third + 1, marks)] if marks % 3 == 0 else [(1, marks // 3), (marks // 3 + 1, (2 * marks) // 3), ((2 * marks) // 3 + 1, marks)]
    out = []
    for i, (a, b) in enumerate(bands):
        d = ['• Demonstrates ' + ao2[i] + '. (AO2)', '• Demonstrates ' + ao3a[i] + '. (AO3)']
        if marks >= 8:
            d.append('• Demonstrates ' + ao3b[i] + '. (AO4)')
        out.append(L(i + 1, '%d–%d' % (a, b), ' '.join(d)))
    return out


def rd(p):
    return io.open(p, encoding='utf-8', newline='').read().replace('\r\n', '\n')


def wr(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)


def _pt(t, c=()):
    return {'t': t, 'c': [{'t': x} for x in c]}


# Content the PDF parse dropped or truncated, re-keyed from the Pearson specification text
# (construction-aaq/text/btec-national-construction-specification.txt). Applied before every build.
SPEC_PATCHES = {
    ('construction-aaq', 6): {
        'replace_topic': {'B2': [
            _pt('Consider factors when responding to a client brief, including:', ['room sizes and dimensions', 'materials and finishes', 'architectural styles (including modern, Tudor, Victorian, art deco)', 'dimensions', 'budget', 'fixtures for kitchens and bathrooms', 'sustainability measures (including energy efficient glazing, insulation, solar panels and rainwater collection and recycling)', 'natural lighting']),
            _pt('Create 2D geometry and dimensions in the x and y plane, including creation from a map, diagram or sketch.'),
            _pt('Push, pull and extrude 2D shapes to create 3D elements.'),
            _pt('Create components or use building information modelling families and elements, including doors, windows, columns, ceilings, floors, curtain systems, mullions, ramps and stairs.'),
            _pt('Add material, dimensions and cost properties to a model.'),
            _pt('Add annotations.'),
            _pt('Add render and real-life texture to create realistic representations in digital models, including brick, concrete, metal or wood.'),
            _pt('Using creative tools – problem solving, alternate sectors; mind mapping; learning new methods and procedures; risk taking, overcoming fear of failure.')]},
        'add_aims': [{'aim': 'C', 'title': 'Communicate a design proposal using digital technology', 'desc': '', 'topics': [
            {'code': 'C1', 'title': 'Communicating designs', 'desc': '', 'subs': [], 'points': [
                _pt('Using a project information model to create 2D views, including plans, elevations and sections.'),
                _pt('Exporting the model into a real-time rendering solution to produce flythroughs, 360 panoramas and QR code views.'),
                _pt('Simulating construction and phasing sequencing in line with a programme and timeline.'),
                _pt('3D printed models.')]},
            {'code': 'C2', 'title': 'Communicating documents', 'desc': '', 'subs': [], 'points': [
                _pt('Using a project information model to estimate costs.'),
                _pt('Using a project information model to determine how structures perform with sunlight, orientation, energy consumption and embodied carbon.'),
                _pt('Preparing a Construction Operations Building information exchange (COBie) document to transfer information.'),
                _pt('Use of appropriate technical language.')]}]}],
    },
    # engineering-aaq/text/btec-national-level-3-ext-cert-engineering-aaq-specification.txt (Unit 4, B3)
    ('engineering-aaq', 4): {
        'replace_topic': {'B3': [
            _pt('Technical specification for the chosen solution being developed, e.g.:', ['function and features', 'interfaces (physical, software, human and electrical/electronic)', 'materials', 'tolerances', 'standards', 'security', 'environmental considerations and sustainability', 'operational conditions', 'process capability', 'reliability', 'capacity (current and future)', 'maintenance', 'performance'])]},
    },
}


def apply_spec_patches(slug, u):
    p = SPEC_PATCHES.get((slug, u['n']))
    if not p:
        return u
    u = json.loads(json.dumps(u))
    for code, points in p.get('replace_topic', {}).items():
        for a in u['aims']:
            for t in a['topics']:
                if t['code'] == code:
                    t['points'], t['subs'] = points, []
    have = {a['aim'] for a in u['aims']}
    u['aims'] += [a for a in p.get('add_aims', []) if a['aim'] not in have]
    return u


def split_merged_criteria(crits):
    """The PDF parse occasionally runs two criteria into one text (e.g. '... brief. C.D.3 Evaluate ...').
    Split them back out so every criterion gets its own row and help entry."""
    out = []
    for c in crits:
        m = re.search(r'\s([A-Z]{1,2})\.?([PMD])\.?(\d{1,2})\s+(?=[A-Z])', c['text'])
        if not m:
            out.append(c)
            continue
        aims, grade, num = m.group(1), m.group(2), int(m.group(3))
        out.append(dict(c, text=c['text'][:m.start()].strip()))
        out.append({'code': f'{aims}.{grade}{num}', 'aims': aims, 'grade': grade, 'n': num, 'text': c['text'][m.end():].strip()})
    return out


def aim_range(aims):
    return aims[0] + '–' + aims[-1] if len(aims) > 1 else aims[0]


def unit_meta(slug, u, sam):
    S = SUBJECTS[slug]
    n = u['n']
    exam = u['type'].lower().startswith('external')
    aims = [a['aim'] for a in u['aims']]
    accent, accent2, ink, d2, dink, grad = S['pal']
    sname = S['name']
    total = sam['meta']['total'] if sam else 0
    time = sam['meta']['time'] if sam else ''
    m = dict(
        code='AAQ', name=u['title'], key='%s_u%d' % (slug.replace('-aaq', '').replace('-', '_'), n), n=n,
        aims=aim_range(aims), free='the exam overview and Aim A' if exam else 'the assignment overview and Aim A',
        locked='Aims %s' % aim_range(aims[1:]) if len(aims) > 1 else 'nothing', nAims=len(aims),
        accent=accent, accent2=accent2, ink=ink, d2=d2, dink=dink, grad=grad,
        eyebrow='Pearson BTEC Level 3 %s (AAQ) — %s' % (sname, 'External Exam' if exam else 'Internal Assignment'),
        hero='Unit %d %s' % (n, u['title']),
        lede=(('The full Unit %d exam: the Pearson sample paper with its mark scheme, six RA10 practice papers in the exact exam layout, '
               'an AI Examiner that marks every answer against the mark scheme and levels, and a complete visual revision guide to aims %s.')
              % (n, aim_range(aims))) if exam else
             (('Everything you need for the Unit %d assignment: a complete visual guide to the theory behind every learning aim, '
               'what each Pass, Merit and Distinction criterion asks for, knowledge checks, flashcards and quizzes.') % n),
        papers_card=('The Pearson sample paper plus six RA10 practice papers, each %s and %d marks like the real exam. '
                     'Answer online, reveal the mark scheme, self-mark or let the AI Examiner mark each question.') % (time, total),
        format_line='The real Unit %d format: %s, %d marks.' % (n, time, total),
        papers_card2='Pearson and RA10 papers with a %s timer, the full mark scheme and AI Examiner marking.' % time,
        mock_default=40, mock_total='<option value="40" selected>40 (half paper)</option><option value="30">30 (quick test)</option><option value="20">20 (short test)</option>',
        papers_sub=('The Pearson sample assessment and six RA10 practice papers for Unit %d %s. Read each paper like the real exam, '
                    'answer it online for AI Examiner feedback, or download it as a PDF.') % (n, u['title']),
        spec_h='%s Unit %d specification' % (S['short'], n), spec_p='The Unit %d content, aim by aim (%s), mapped to the question bank.' % (n, aim_range(aims)),
        footer='BTEC Level 3 %s (AAQ) Unit %d (%s) — Pearson. This is a study tool — not an official Pearson product.' % (sname, n, u['title']),
        flash_p='Key terms, theories, models and facts for every learning aim.',
        quiz_p='Multiple-choice and true/false questions with an explanation for every answer.',
        guide_p='Every aim with diagrams, worked examples and the exam advice that decides the top marks.' if exam else
                'Every aim with diagrams, examples and how each topic feeds into your assignment.',
        calc=False)
    return m, exam


def post(s, S, n):
    sname, short = S['name'], S['short']
    s = s.replace('BTEC Level 3 Business', 'BTEC Level 3 %s' % sname)
    s = s.replace('BTEC Business revision', 'BTEC %s revision' % short)
    s = s.replace('BTEC Business', 'BTEC %s' % short)
    s = s.replace("RA10_UNIT_SUBJECT = 'Business'", "RA10_UNIT_SUBJECT = '%s'" % sname)
    s = s.replace('Business Unit', '%s Unit' % short)
    s = s.replace('Business one-time subject plan gives full guide access for Business', '%s one-time subject plan gives full guide access for %s' % (short, short))
    s = s.replace('The Business question bank', 'The %s question bank' % short)
    s = s.replace('your Business subject', 'your %s subject' % short)
    s = s.replace('in business contexts', 'in real %s contexts' % short.lower())
    s = s.replace('-bus-credit-chip', '-aaq-credit-chip')
    return s


ASSIGN_VIEW = '''  <!-- ASSIGNMENT GUIDE (internally assessed unit) -->
  <section id="view-assignment" class="view">
    <header class="section-head">
      <h2>Assignment guide</h2>
      <p>This unit is assessed by a Pearson Set Assignment Brief, marked by your teacher. Here is what every Pass, Merit and Distinction criterion asks for and how to plan your evidence.</p>
    </header>
    <div id="assignment-host"></div>
  </section>

'''


def build_unit(slug, u):
    S = SUBJECTS[slug]
    u = apply_spec_patches(slug, u)
    n = u['n']
    sam_p = os.path.join(HERE, 'out', '%s.u%d.sam.json' % (slug, n))
    exam = u['type'].lower().startswith('external')
    sam = json.load(io.open(sam_p, encoding='utf-8')) if exam and os.path.exists(sam_p) else None
    m, exam = unit_meta(slug, u, sam)
    base = os.path.join(OUT, slug, 'unit-%d' % n)
    # point the Business generator at the shared-aaq copies and add the RA10 papers / assignment scripts
    BU.CSS_LINKS = ORIG_CSS.replace('../shared/', '../../shared-aaq/').replace('v=20261101', 'v=' + V)
    scripts = ORIG_SCRIPTS.replace('../shared/', '../../shared-aaq/').replace('v=20261101', 'v=' + V)
    scripts = scripts.replace('<script src="js/papers-data.js?v=%s"></script>' % V,
                              '<script src="js/papers-data.js?v=%s"></script>\n%s' % (V, '<script src="js/papers-ra10.js?v=%s"></script>' % V if exam else '<script src="js/assignment-data.js?v=%s"></script>\n<script src="js/assignment-help.js?v=%s"></script>' % (V, V)))
    if not exam:
        scripts = scripts.replace('<script src="js/app.js?v=%s"></script>' % V, '<script src="js/app.js?v=%s"></script>\n<script src="../../shared-aaq/aaq-assignment.js?v=%s"></script>' % (V, V))
    scripts = scripts.replace('<script src="js/cfg.js', '<script src="/refresh/ra10-units.js?v=20261212"></script>\n<script src="js/cfg.js')
    BU.SCRIPTS = scripts.replace('{calc}', '{calc}')
    app = post(BU.build_app(n, m), S, n)
    css = BU.build_css(n, m)
    if not exam:
        css += '\n' + rd(os.path.join(OUT, 'shared-aaq', 'aaq-assignment.css'))
    idx = post(BU.build_index(n, m), S, n)
    idx = idx.replace('<title>BTEC %s Unit %d' % (S['short'], n), '<title>BTEC %s Unit %d' % (S['short'], n))
    if not exam:
        # papers → assignment guide
        a = idx.index('  <section id="view-papers" class="view">')
        b = idx.index('</section>', a) + len('</section>\n')
        idx = idx[:a] + ASSIGN_VIEW + idx[b:]
        idx = idx.replace('<button class="tab" data-tab="questions"', '<button class="tab" data-tab="assignment" data-tip="Criteria and how to plan your evidence">Assignment</button>\n    <button class="tab" data-tab="questions"', 1)
        idx = re.sub(r'<h4>Pearson past papers</h4>\s*<p>[^<]*</p>\s*<button class="btn primary" data-goto="papers">[^<]*</button>',
                     '<h4>Assignment guide</h4>\n            <p>Every Pass, Merit and Distinction criterion explained, with what assessors look for and how to plan your evidence.</p>\n            <button class="btn primary" data-goto="assignment">Open the assignment guide</button>', idx)
        idx = idx.replace('<h3>Past papers</h3>', '<h3>Your assignment</h3>').replace('Read, answer and mark real Pearson papers', 'Criteria, evidence and planning')
        idx = re.sub(r'<h4>Pearson past papers</h4>\s*<p>[^<]*</p>\s*<button class="btn primary" data-goto="papers">Open</button>',
                     '<h4>Assignment guide</h4>\n            <p>Criteria, assessor guidance and command words.</p>\n            <button class="btn primary" data-goto="assignment">Open</button>', idx)
        idx = idx.replace('data-goto="papers"', 'data-goto="assignment"')
    loader = post(BU.build_loader(n, m), S, n).replace('Business', S['short'])
    wr(os.path.join(base, 'js', 'app.js'), app)
    wr(os.path.join(base, 'css', 'style.css'), css)
    wr(os.path.join(base, 'index.html'), idx)
    wr(os.path.join(base, 'js', 'data-loader.js'), loader)
    wr(os.path.join(base, 'js', 'cfg.js'), cfg_js(slug, u, sam, exam))
    wr(os.path.join(base, 'js', 'papers-data.js'), papers_js(slug, u, sam))
    if not exam:
        wr(os.path.join(base, 'js', 'assignment-data.js'), '/* Generated by aaq-build/build_apps.py from the specification. */\nwindow.AAQ_ASSIGN = ' +
           json.dumps({'unit': n, 'title': u['title'], 'aims': [{'aim': a['aim'], 'title': a['title']} for a in u['aims']],
                       'criteria': split_merged_criteria(u['criteria']), 'guidance': u['guidance']}, ensure_ascii=False) + ';\n')
    wr(os.path.join(base, 'js', 'spec.js'), spec_js(u))  # generated from the (patched) spec – always refresh
    for f, stub in (('bank.js', 'bank'), ('quiz.js', 'quiz'), ('cards.js', 'cards'), ('guide.js', 'guide')):
        p = os.path.join(base, 'js', f)
        if not os.path.exists(p):
            wr(p, STUBS[stub] % {'n': n})  # hand-written content files are never overwritten
    if exam and not os.path.exists(os.path.join(base, 'js', 'papers-ra10.js')):
        wr(os.path.join(base, 'js', 'papers-ra10.js'), '/* RA10 practice papers: hand-written, see PLAYBOOK.md. */\n')
    if not exam and not os.path.exists(os.path.join(base, 'js', 'assignment-help.js')):
        wr(os.path.join(base, 'js', 'assignment-help.js'), '/* Per-criterion help for the assignment guide: window.AAQ_CRIT_HELP = { "A.P1": "…" } */\nwindow.AAQ_CRIT_HELP = window.AAQ_CRIT_HELP || {};\n')
    return exam


STUBS = {
    'bank': "/* Knowledge bank — hand-written. */\n(function () {\n  'use strict';\n  const B = BizBank('U%(n)d', 'AAQ');\n  window.__BIZ_B = B;\n})();\n",
    'quiz': "/* Quiz — hand-written. */\n(function () { 'use strict'; })();\n",
    'cards': "/* Flashcards — hand-written. */\n(function () { 'use strict'; const B = window.__BIZ_B; B.publish(); })();\n",
    'guide': "/* Revision guide — hand-written. */\n",
}


def spec_js(u):
    aims = []
    for a in u['aims']:
        topics = []
        for t in a['topics']:
            topics.append({'code': t['code'], 'name': t['title']})
            for s in t.get('subs', []):
                topics.append({'code': s['code'], 'name': re.sub(r'[:.]\s*$', '', s['text'])})
        aims.append((a['aim'], {'title': a['title'], 'short': '; '.join(t['title'] for t in a['topics'])[:160], 'topics': topics}))
    return ('/* BTEC AAQ Unit %d: %s — content areas from the Pearson specification. */\n(function () {\n  \'use strict\';\n  window.LEARNING_AIMS = %s;\n  window.SPEC = %s;\n})();\n'
            % (u['n'], u['title'], json.dumps([a for a, _ in aims]), json.dumps(dict(aims), ensure_ascii=False, indent=1)))


STOP = set('the and of to in for a an on with by or as is are be from that this their its it can how what which using used use including e.g. such at into between different types type other own within through each who why when'.split())


def cfg_js(slug, u, sam, exam):
    S = SUBJECTS[slug]
    from collections import Counter
    kw = {}
    for a in u['aims']:
        words = Counter()
        for t in a['topics']:
            bag = [t['title']] + [s['text'] for s in t.get('subs', [])] + [p['t'] for p in t.get('points', [])]
            for w in re.findall(r'[a-z][a-z\-]{3,}', ' '.join(bag).lower()):
                if w not in STOP:
                    words[w] += 1
        kw[a['aim']] = [w for w, _ in words.most_common(60)]
    topics = [[t['code'], t['title'], [w for w in re.findall(r'[a-z][a-z\-]{3,}', (t['title'] + ' ' + ' '.join(s['text'] for s in t.get('subs', []))).lower()) if w not in STOP][:25]]
              for a in u['aims'] for t in a['topics']]
    sections = sorted({p.get('section') for p in (sam or {}).get('parts', []) if p.get('section')})
    total = sam['meta']['total'] if sam else 0
    tmatch = re.match(r'(\d+) hours?(?: (\d+) minutes)?|(\d+) hour (\d+) minutes', (sam or {}).get('meta', {}).get('time', '') or '')
    mins = 0
    if sam:
        t = sam['meta']['time']
        h = re.search(r'(\d+)\s*hour', t); mi = re.search(r'(\d+)\s*minute', t)
        mins = (int(h.group(1)) * 60 if h else 0) + (int(mi.group(1)) if mi else 0)
    cfg = {
        'n': u['n'], 'key': '%s_u%d' % (slug.replace('-aaq', '').replace('-', '_'), u['n']), 'code': 'AAQ', 'name': u['title'],
        'kind': 'exam' if exam else 'assignment', 'total': total, 'minutes': mins, 'timeLabel': (sam or {}).get('meta', {}).get('time', ''),
        'aims': [a['aim'] for a in u['aims']], 'subject': S['name'], 'pdfPrefix': S['pdf'],
        'qualLine': 'Pearson BTEC Level 3 National in %s (AAQ)' % S['name'],
        'partLine': 'Answer all questions' + (' in Sections %s and %s' % (', '.join(sections[:-1]), sections[-1]) if len(sections) > 1 else ''),
        'sectionTitles': {s: 'SECTION ' + s for s in sections},
        'specGroups': {'new': {'t': 'Pearson sample assessment (current AAQ specification)', 'd': 'Written by Pearson to show exactly what the real exam looks like.'},
                       'ra10': {'t': 'RA10 practice papers', 'd': 'Same layout, timing and marks as the real exam, written by RA10 to cover the whole specification.'}},
        'instructions': [
            ['Instructions', ['Use black ink or ball-point pen.', 'Answer all questions.', 'Answer the questions in the spaces provided – there may be more space than you need.']],
            ['Information', ['The total mark for this paper is {total}.', 'The marks for each question are shown in brackets – use this as a guide as to how much time to spend on each question.']],
            ['Advice', ['Read each question carefully before you start to answer it.', 'Apply every answer to the scenario – generic answers rarely reach the top level.', 'Try to answer every question and check your answers if you have time at the end.']]],
        'howto': ['Start with the Pearson sample paper: it is the closest match to the real exam. Then work through the RA10 practice papers.',
                  'Switch to “Answer online”. Write full answers, then reveal the mark scheme, self-mark or use the AI Examiner.',
                  'Exam layout: %s, %d marks. Questions build from short state/give/explain parts to extended discuss, assess and evaluate answers.' % ((sam or {}).get('meta', {}).get('time', ''), total)],
        'legal': 'Sample assessment text © Pearson Education Ltd, reformatted by RA10 for revision. RA10 practice papers and mark schemes are RA10’s own. Diagrams in the original papers are described in text.',
    }
    return ('/* BTEC %s (AAQ) Unit %d — %s: configuration for the shared paper viewer (generated by aaq-build/build_apps.py). */\n'
            '(function () {\n  \'use strict\';\n  const KW = %s;\n  const TOPICS = %s;\n'
            '  const score = (text, words) => { const t = String(text || \'\').toLowerCase(); let s = 0; words.forEach(w => { if (t.indexOf(w) >= 0) s++; }); return s; };\n'
            '  window.BIZ_LEVELS = window.BIZ_LEVELS || %s;\n'
            '  window.BIZ_UNIT = Object.assign(%s, {\n'
            '    runLabel: (it) => \'Question \' + it.q,\n'
            '    cardMeta: (p) => { const by = {}; p.items.forEach(it => { by[it.q] = (by[it.q] || 0) + it.marks; }); return Object.keys(by).map(q => \'Q\' + q + \': \' + by[q]).join(\' · \') + \' · \' + p.items.length + \' parts\'; },\n'
            '    classify: function (text, section, q, p, own) { let best = null, bs = 0; for (const t of [own, text]) { if (!t) continue; Object.keys(KW).forEach(a => { const s = score(t, KW[a]); if (s > bs) { bs = s; best = a; } }); if (best) return best; } return Object.keys(KW)[0]; },\n'
            '    topicFor: function (text) { let best = null, bs = 0; TOPICS.forEach(t => { const s = score(text, t[2]); if (s > bs) { bs = s; best = t; } }); return best ? best[0] + \' \' + best[1] : TOPICS[0][0] + \' \' + TOPICS[0][1]; }\n'
            '  });\n})();\n') % (S['name'], u['n'], u['title'], json.dumps(kw), json.dumps(topics, ensure_ascii=False), json.dumps({str(k): levels_for(k) for k in (6, 8, 9, 10, 12, 15, 16, 18, 20)}, ensure_ascii=False), json.dumps(cfg, ensure_ascii=False, indent=1))


def papers_js(slug, u, sam):
    lv = {str(k): levels_for(k) for k in (6, 8, 9, 10, 12, 15, 16, 18, 20)}
    head = '/* BTEC AAQ Unit %d — Pearson sample assessment (generated by aaq-build/build_apps.py; do not edit by hand).\n   Question and mark-scheme text © Pearson Education Ltd, reformatted by RA10 for revision. */\n' % u['n']
    s = head + 'window.BIZ_LEVELS = ' + json.dumps(lv, ensure_ascii=False) + ';\n'
    if not sam:
        return s + 'window.BIZ_PAPERS = window.BIZ_PAPERS || [];\n'
    items = []
    last_q, last_stem = None, ''
    parts = sam['parts']
    has_ms = lambda x: bool(x.get('ms')) and bool(str((x.get('ms') or {}).get('answer', '')).strip())
    # drop parse artefacts: unlabelled parts with no mark scheme inside a question whose other parts have one (e.g. table rows)
    keep = [p for p in parts if has_ms(p) or p['sub'] or not any(x['q'] == p['q'] and has_ms(x) for x in parts)]
    for p in keep:
        stem = re.sub(r'(^|\n)•\s*\n', r'\1• ', p['stem'] or '').replace('Scenario:', '').strip()
        ctx = []
        if p['q'] != last_q:
            last_q, last_stem = p['q'], ''
        if stem and stem != last_stem:
            ctx = [x for x in stem.split('\n') if x.strip()]
            last_stem = stem
        text = re.sub(r'(^|\n)•\s*\n', r'\1• ', p['text'])
        if p['options']:
            text += '\n' + '\n'.join('%s  %s' % (o['k'], o['t']) for o in p['options'])
        ms = (p.get('ms') or {}).get('answer') or 'Mark against the command word and the marks available; see the levels descriptors for extended answers.'
        sub = p['sub'] + ('(%s)' % p['roman'] if p['roman'] else '')
        items.append({'q': p['q'], 'sub': sub, 'marks': p['marks'], 'section': p.get('section') or ('Q%d' % p['q']), 'ctx': ctx, 'text': text,
                      'ms': {'body': ms, 'levels': None}})
    mins = 0
    h = re.search(r'(\d+)\s*hour', sam['meta']['time'] or ''); mi = re.search(r'(\d+)\s*minute', sam['meta']['time'] or '')
    mins = (int(h.group(1)) * 60 if h else 0) + (int(mi.group(1)) if mi else 0)
    paper = {'id': '%s%d-SAM' % (SUBJECTS[slug]['pdf'].split('-')[1][:4].upper(), u['n']), 'unit': u['n'], 'key': 'SAM', 'series': 'Sample assessment (AAQ)',
             'date': 'Pearson sample assessment material', 'title': 'Pearson sample paper', 'source': 'pearson', 'kind': 'exam', 'code': 'Sample',
             'spec': 'new', 'total': sum(i['marks'] for i in items), 'minutes': mins, 'items': items, 'badge': 'Pearson · current spec', 'badgeTone': 'new',
             'notice': 'Pearson’s sample assessment for the current AAQ specification: the closest match to the real exam. Figures, tables and information booklets are described in words.'}
    return s + 'window.BIZ_PAPERS = (window.BIZ_PAPERS || []).concat([' + json.dumps(paper, ensure_ascii=False) + ']);\n'


def main(args):
    slugs = [a for a in args if not a.isdigit()] or list(SUBJECTS)
    nums = [int(a) for a in args if a.isdigit()]
    for slug in slugs:
        units = json.load(io.open(os.path.join(HERE, 'out', slug + '.spec.json'), encoding='utf-8'))
        for u in units:
            if nums and u['n'] not in nums:
                continue
            exam = build_unit(slug, u)
            print('built %-34s unit %d (%s)' % (slug, u['n'], 'exam' if exam else 'assignment'))


if __name__ == '__main__':
    BASE_CSS, BASE_SCRIPTS = BU.CSS_LINKS, BU.SCRIPTS
    main(sys.argv[1:])
