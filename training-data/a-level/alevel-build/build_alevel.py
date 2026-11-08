"""Build the A-level subject apps (one app per subject, all papers inside) from the shared BTEC/AAQ generator.

    python training-data/a-level/alevel-build/build_alevel.py psychology

Writes revision/a-level/<slug>/: index.html, css/style.css, js/app.js, js/data-loader.js, js/cfg.js, js/spec.js,
js/papers-data.js (real exam-board papers from out/<slug>.papers.json) and figures/*.png. Hand-written content
files (guide.js, bank.js, quiz.js, cards.js, papers-ra10.js) are created as stubs only if missing — never overwritten.
Engines: revision/a-level/shared-alevel (make_shared.py).
"""
import io, json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, os.path.join(REPO, 'training-data', 'btec', 'level-3', 'aaq-build'))
import build_apps as AAQ          # noqa: E402  (BTEC generator wrapper: BU, ORIG_CSS, ORIG_SCRIPTS, post helpers)
BU = AAQ.BU

V = '20261213'
OUT = os.path.join(REPO, 'revision', 'a-level')

# ───────────────────────── AQA Psychology 7182 ─────────────────────────
PSY_AIMS = [
    ('A', 'Social influence', '4.1.1', 1, 'A'), ('B', 'Memory', '4.1.2', 1, 'B'), ('C', 'Attachment', '4.1.3', 1, 'C'),
    ('D', 'Clinical Psychology and Mental Health', '4.1.4', 1, 'D'), ('E', 'Approaches in Psychology', '4.2.1', 2, 'A'),
    ('F', 'Biopsychology', '4.2.2', 2, 'B'), ('G', 'Research methods', '4.2.3', 2, 'C'), ('H', 'Issues and debates in Psychology', '4.3.1', 3, 'A'),
    ('I', 'Relationships', '4.3.2', 3, 'B'), ('J', 'Gender', '4.3.3', 3, 'B'), ('K', 'Cognition and development', '4.3.4', 3, 'B'),
    ('L', 'Schizophrenia', '4.3.5', 3, 'C'), ('M', 'Eating behaviour', '4.3.6', 3, 'C'), ('N', 'Stress', '4.3.7', 3, 'C'),
    ('O', 'Aggression', '4.3.8', 3, 'D'), ('P', 'Forensic Psychology', '4.3.9', 3, 'D'), ('Q', 'Addiction', '4.3.10', 3, 'D'),
]
# Content in the 2015 specification that is NOT in the updated specification (teaching from September 2025, A-level
# exams from June 2027). Compared line by line against AQA-7181-7182-SP-2025-v1.4. Past-paper questions on these
# topics stay (they still practise exam skills) but carry a visible note.
PSY_OFFSPEC = [
    ('A', r'\bidentification\b', 'identification as a type of conformity'),
    ('A', r'Zimbardo|social roles|Stanford prison', 'conformity to social roles (Zimbardo)'),
    ('A', r'social change', 'the role of social influence processes in social change'),
    ('B', r'\b(episodic|semantic|procedural)\b|types? of long-term memory','types of long-term memory (episodic, semantic and procedural)'),
    ('C', r'reciprocity|interactional synchrony|caregiver[- ]infant interaction|Schaffer|stages of attachment|multiple attachments|role of the father|\bfathers?\b', 'caregiver–infant interactions, Schaffer’s stages and the role of the father'),
    ('E', r'Wundt|introspection|emergence of Psychology|origins of Psychology', 'the origins of Psychology (Wundt and introspection)'),
    ('E', r'counselling', 'counselling Psychology'),
    ('F', r'circadian|infradian|ultradian|endogenous pacemaker|exogenous zeitgeber|biological rhythm|sleep[/ -]wake', 'biological rhythms'),
    ('I', r'evolutionary|sexual selection|partner preference', 'evolutionary explanations for partner preferences'),
    ('J', r'Freud|psychodynamic|Oedipus|Electra', 'the psychodynamic explanation of gender development'),
    ('L', r'token econom', 'token economies'),
    ('M', r'diet\w* (might|may|will|would|is|was|are)?\s*(not )?(be )?(un)?successful|success\w* .{0,25}diet|fail\w* .{0,25}diet|diets? .{0,20}(fail|succeed)', 'explanations for the success and failure of dieting'),
    ('P', r'defining crime|measuring crime|official statistics|victim survey|offender survey|ways of measuring crime', 'defining and measuring crime'),
    ('P', r'atavis|Lombroso', 'the atavistic form (historical biological explanation)'),
    ('P', r'superego|psychodynamic', 'the psychodynamic (inadequate superego) explanation of offending'),
    ('Q', r'planned behaviour', 'the theory of planned behaviour'),
]

# ───────────────────────── Pearson Edexcel Business 9BS0 ─────────────────────────
# One aim per specification topic area. Paper 1 = Themes 1 & 4, Paper 2 = Themes 2 & 3, Paper 3 = all four themes.
EDX_AIMS = [
    ('A', 'Meeting customer needs', '1.1', 1, 'T1'), ('B', 'Market', '1.2', 1, 'T1'), ('C', 'Marketing mix and strategy', '1.3', 1, 'T1'),
    ('D', 'Managing people', '1.4', 1, 'T1'), ('E', 'Entrepreneurs and leaders', '1.5', 1, 'T1'),
    ('F', 'Raising finance', '2.1', 2, 'T2'), ('G', 'Financial planning', '2.2', 2, 'T2'), ('H', 'Managing finance', '2.3', 2, 'T2'),
    ('I', 'Resource management', '2.4', 2, 'T2'), ('J', 'External influences', '2.5', 2, 'T2'),
    ('K', 'Business objectives and strategy', '3.1', 2, 'T3'), ('L', 'Business growth', '3.2', 2, 'T3'), ('M', 'Decision-making techniques', '3.3', 2, 'T3'),
    ('N', 'Influences on business decisions', '3.4', 2, 'T3'), ('O', 'Assessing competitiveness', '3.5', 2, 'T3'), ('P', 'Managing change', '3.6', 2, 'T3'),
    ('Q', 'Globalisation', '4.1', 1, 'T4'), ('R', 'Global markets and business expansion', '4.2', 1, 'T4'), ('S', 'Global marketing', '4.3', 1, 'T4'),
    ('T', 'Global industries and companies (MNCs)', '4.4', 1, 'T4'),
]
EDX_PAPER_AIMS = {1: 'ABCDEQRST', 2: 'FGHIJKLMNOP', 3: 'ABCDEFGHIJKLMNOPQRST'}
# Keyword evidence for each topic area (matched against the question text; the extracts break ties).
EDX_KEYS = {
    'A': r'mass market|niche market|market share|market size|dynamic market|online retail|market research|primary research|secondary research|segment|market map|positioning|product differentiation|adding value|added value|market orientation|product orientation|uncertainty|innovation',
    'B': r'\bdemand\b|\bsupply\b|price elasticity|income elasticity|\bPED\b|\bYED\b|equilibrium|substitute|complementary',
    'C': r'design mix|brand|promotion|pricing strateg|price skimming|penetration pricing|psychological pricing|cost.plus|distribution|product life cycle|Boston|marketing strategy|extension strateg|customer loyalty|marketing mix|social media marketing',
    'D': r'staff|recruit|selection|training|organisational structure|hierarch|span of control|delegat|centralis|motivat|Maslow|Herzberg|Taylor|Mayo|financial incentive|piece.rate|leadership|leaders?hip style|autocratic|democratic|laissez|paternalistic|employer.employee|trade union|flexible workforce|zero.hours|multi.skill|dismiss|redundan|employees?\b|workforce',
    'E': r'entrepreneur|intrapreneur|sole trader|partnership|private limited|public limited|business objective|survival|profit maximi|opportunity cost|motives',
    'F': r'sources? of finance|methods? of finance|financ(e|ing)|raising finance|\bloan|overdraft|venture capital|crowd.?funding|share capital|retained profit|business angel|peer.to.peer|limited liability|unlimited liability|business plan|trade credit|leasing|grant',
    'G': r'sales forecast|sales revenue|break.even|contribution|margin of safety|budget|variance',
    'H': r'profit margin|gross profit|operating profit|net profit|liquidity|current ratio|acid test|cash.?flow|working capital|business failure|profitability',
    'I': r'production|productivity|efficiency|capacity utilisation|stock control|inventory|buffer stock|just.in.time|\bJIT\b|\blean\b|quality|kaizen|\bTQM\b|outsourc|labour.intensive|capital.intensive|batch|flow production|supply chain',
    'J': r'interest rate|exchange rate|inflation|unemployment|taxation|economic growth|business cycle|legislation|consumer protection|competition law|environmental legislation|minimum wage|recession|competitive environment|external influence',
    'K': r'mission|corporate objective|corporate strateg|Ansoff|Porter|generic strateg|SWOT|PESTLE|strategic direction|strategic positioning|Five Forces|bowman',
    'L': r'growth|merger|takeover|acquisition|acquire|organic|inorganic|economies of scale|diseconomies|vertical integration|horizontal integration|conglomerate|stay(ing)? small|small business|franchis',
    'M': r'time.series|moving average|extrapolat|investment appraisal|payback|average rate of return|\bARR\b|net present value|\bNPV\b|decision tree|critical path|\bCPA\b|float',
    'N': r'short.termism|corporate culture|culture|stakeholder|shareholder|ethic|corporate social responsibility|\bCSR\b|Carroll|pay and reward|trade.off|corporate influences',
    'O': r'income statement|statement of financial position|balance sheet|ratio|gearing|return on capital|\bROCE\b|labour productivity|labour turnover|absenteeism|retention|human resource|competitiveness',
    'P': r'\bchange\b|scenario planning|risk assessment|contingency|business continuity|succession planning|resistance to change|organisational culture|risk mitigation',
    'Q': r'protect(ion|ionism|ing)? .{0,40}(market|industr|producers)|emerging econom|globalisation|\bBRIC|international trade|export|import|specialisation|trade liberalisation|protectionism|tariff|quota|trading bloc|\bEU\b|ASEAN|NAFTA|USMCA|free trade|trade barrier|domestic subsidy',
    'R': r'location|locate|offshoring|reshoring|push factor|pull factor|saturation|as a market|production location|ease of doing business|joint venture|global merger|global competitiveness|exchange rate|skills shortage|cost competitiveness|expand(ing)? (into|overseas|abroad)|overseas|new countr|enter(ing)? the .* market',
    'S': r'global niche markets?|global marketing|glocal|global localisation|cultural|language|global niche|Bartlett|Ghoshal|international strateg|multi.domestic|transnational|global strateg|cultural differences',
    'T': r'multinational|\bMNCs?\b|tax avoidance|transfer pricing|stakeholder conflict|controlling MNC|pressure group|local economy|national economy|corporate tax',
}

SUBJECTS = {
    'psychology': dict(
        name='Psychology', short='Psychology', board='AQA', code='7182', qual='AQA A-level Psychology (7182)', src='psychology',
        pdf='AQA-A-level-Psychology-7182', key='aqa_psy_7182',
        pal=('#7c3aed', '#EDE9FE', '#5B21B6', '#2E1065', '#DDD6FE', ('#2e1065', '#7c3aed', '#a78bfa')),
        aims=PSY_AIMS, offspec=PSY_OFFSPEC,
        papers={1: ('Paper 1', 'Introductory topics in Psychology'), 2: ('Paper 2', 'Psychology in context'), 3: ('Paper 3', 'Issues and options in Psychology')},
        sections={1: {'A': 'Social influence', 'B': 'Memory', 'C': 'Attachment', 'D': 'Clinical Psychology and Mental Health'},
                  2: {'A': 'Approaches in Psychology', 'B': 'Biopsychology', 'C': 'Research methods'},
                  3: {'A': 'Issues and debates in Psychology', 'B': 'Option 1', 'C': 'Option 2', 'D': 'Option 3'}},
    ),
    'business-edexcel': dict(
        name='Business', short='Business', board='Pearson Edexcel', boardShort='Edexcel', code='9BS0',
        qual='Pearson Edexcel A-level Business (9BS0)', src='business-edexcel', adapter='edexcel', real='edexcel', total=100,
        pdf='Edexcel-A-level-Business-9BS0', key='edx_bus_9bs0',
        pal=('#0e7490', '#CFFAFE', '#155E75', '#083344', '#A5F3FC', ('#083344', '#0e7490', '#22d3ee')),
        aims=EDX_AIMS, offspec=[],
        papers={1: ('Paper 1', 'Marketing, people and global businesses'), 2: ('Paper 2', 'Business activities, decisions and strategy'),
                3: ('Paper 3', 'Investigating business in a competitive environment')},
        sections={1: {'A': 'Question 1', 'B': 'Question 2'}, 2: {'A': 'Question 1', 'B': 'Question 2'}, 3: {'A': 'Question 1', 'B': 'Question 2'}},
        meta=dict(
            lede='Every Edexcel paper from 2017 to 2025 with its official mark scheme and the extracts, RA10 practice papers in the exact exam layout, '
                 'an AI Examiner that marks against the Edexcel levels (knowledge, application, analysis, evaluation), and a complete visual revision guide.',
            papers_card='Real Edexcel papers (Papers 1, 2 and 3, 2017–2025) with their extracts, plus RA10 practice papers, each 2 hours and 100 marks. Answer online, reveal the mark scheme, self-mark or let the AI Examiner mark it.',
            format_line='The real format: three papers, each 2 hours and 100 marks, built on extracts.',
            papers_card2='Edexcel and RA10 papers with a 2-hour timer, the official mark scheme and AI Examiner marking.',
            mock_total='<option value="50" selected>50 (one section)</option><option value="100">100 (full paper)</option>', mock_default=50,
            papers_sub='Edexcel past papers 2017–2025 and RA10 practice papers for A-level Business (9BS0). Read each paper with its extracts as it was set, answer it online for AI Examiner feedback, or download it as a PDF.',
            spec_h='A-level Business specification (9BS0)', spec_p='The Pearson Edexcel specification, theme by theme and topic by topic.',
            flash_p='Key terms, formulae and theories for all four themes.',
            guide_p='Every topic with diagrams, worked calculations, real business examples and the exam technique for 8-, 10-, 12- and 20-mark answers.',
            calc=True),
        cfg=dict(
            specGroups={'past': {'t': 'Edexcel past papers (2017–2025)', 'd': 'The real papers with their extracts and the official mark schemes.'},
                        'ra10': {'t': 'RA10 practice papers', 'd': 'Written by RA10 in the exact Edexcel layout: extracts, then questions worth 4, 8, 10, 12 and 20 marks.'}},
            paperNote='Three papers, each 2 hours and 100 marks, in two sections of 50 marks built on extracts. Paper 1: Themes 1 and 4. Paper 2: Themes 2 and 3. Paper 3: all four themes, with a pre-released context.',
            instructions=[
                ['Instructions', ['Use black ink or ball-point pen.', 'There are two sections in this question paper. Answer all questions.', 'Read the extracts before answering the questions in each section.']],
                ['Information', ['The total mark for this paper is {total}.', 'The marks for each question are shown in brackets – use this as a guide as to how much time to spend on each question.', 'You may use a calculator.']],
                ['Advice', ['Read each question carefully before you start to answer it.', 'Try to answer every question.', 'Check your answers if you have time at the end.']]],
            howto=['Filter by Paper 1, 2 or 3. Past papers are the real Edexcel papers with their extracts and the official mark schemes; RA10 papers follow the same layout.',
                   'Switch to “Answer online”. The extracts for each question are shown above it, exactly as in the source booklet.',
                   'Reveal the official mark scheme or press “AI Examiner” for a level, a mark and how to reach the next level.'],
            legal='Past paper, extract and mark-scheme text © Pearson Education Ltd, reformatted by RA10 for revision. Extracts are reproduced from the original papers with their sources. RA10 practice papers and mark schemes are RA10’s own. This is not an official Pearson product.',
            mockSections='Section A or B: about 60 minutes each'),
    ),
}


def rd(p):
    return io.open(p, encoding='utf-8').read()


def wr(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)


def topic_aim(S, paper, section, topic):
    """Map a paper's section/topic to the subject aim letter."""
    t = (topic or '').lower()
    for a, name, code, pn, sec in S['aims']:
        if pn == paper and (name.lower() == t or (paper != 3 and sec == section) or (paper == 3 and section == 'A' and sec == 'A')):
            return a
    for a, name, *_ in S['aims']:
        if name.lower().split()[0] == t.split()[0] if t else False:
            return a
    if t.startswith('psychopathology'):
        return 'D'
    return S['aims'][0][0]


def meta(S):
    sname = S['name']
    nA = len(S['aims'])
    m = dict(
        code=S['code'], name='%s A-level %s' % (S['board'], sname), key=S['key'], n=1,
        aims='%s–%s' % (S['aims'][0][0], S['aims'][-1][0]), free='the exam overview and the first topic', locked='the other topics', nAims=nA,
        eyebrow='%s A-level %s (%s) — three exam papers' % (S['board'], sname, S['code']),
        hero='A-level %s' % sname,
        lede=('Every %s paper since 2020 with its official mark scheme, RA10 practice papers in the exact exam layout, an AI Examiner '
              'that marks against the AQA levels, and a complete visual revision guide to the updated specification.') % S['board'],
        papers_card='Real %s papers (Papers 1, 2 and 3, 2020–2025) plus RA10 practice papers, each 2 hours and 96 marks. Answer online, reveal the mark scheme, self-mark or let the AI Examiner mark it.' % S['board'],
        format_line='The real format: three papers, each 2 hours and 96 marks.',
        papers_card2='%s and RA10 papers with a 2-hour timer, the official mark scheme and AI Examiner marking.' % S['board'],
        mock_default=40, mock_total='<option value="48" selected>48 (half paper)</option><option value="24">24 (one section)</option><option value="96">96 (full paper)</option>',
        papers_sub='%s past papers 2020–2025 and RA10 practice papers for A-level %s. Read each paper as it was set, answer it online for AI Examiner feedback, or download it as a PDF.' % (S['board'], sname),
        spec_h='A-level %s specification (%s)' % (sname, S['code']), spec_p='The updated %s content (teaching from September 2025, exams from June 2027), topic by topic.' % S['board'],
        footer='%s (%s). This is a study tool — not an official %s product.' % (S['qual'], S['code'], S['board']),
        flash_p='Key terms, studies, theories and research methods for every topic.',
        quiz_p='Multiple-choice and true/false questions with an explanation for every answer.',
        guide_p='Every topic with diagrams, key studies, evaluation points and the exam technique that decides the top level.',
        calc=False)
    m.update(S.get('meta') or {})
    accent, accent2, ink, d2, dink, grad = S['pal']
    m.update(accent=accent, accent2=accent2, ink=ink, d2=d2, dink=dink, grad=grad)
    return m


def post(s, S):
    # the generator is written for "BTEC Business Unit N": turn it into "AQA A-level <Subject>"
    s = AAQ.post(s, dict(name=S['name'], short=S['short']), 1)
    s = s.replace('BTEC Level 3 %s' % S['name'], '%s A-level %s' % (S['board'], S['name']))
    s = s.replace('BTEC %s revision' % S['short'], 'A-level %s revision' % S['short'])
    s = s.replace('BTEC %s' % S['short'], '%s A-level %s' % (S['board'], S['short']))
    s = s.replace('%s Unit 1' % S['short'], 'A-level %s' % S['short'])
    s = s.replace('Unit 1 ', '').replace('Unit 1:', '%s:' % S['code']).replace('Unit 1', 'A-level ' + S['short'])
    s = s.replace('Pearson', S['board'])
    return s


def chapterise(s):
    """A-levels are taught in numbered chapters, not BTEC learning aims. The data keeps its internal letters (A, B, C…)
    but everything the student sees says “Chapter 1, 2, 3…” via window.AIM_WORD / AIM_LABEL from cfg.js."""
    helper = ("const AIM_WORD = window.AIM_WORD || 'Aim';\n"
              "const AIM_LBL = (a) => (window.AIM_LABEL && window.AIM_LABEL[a]) || a;\n")
    if s.lstrip().startswith(('<!', '<html')):
        # page text
        R = [('Learning Aims Coverage', 'Chapters Covered'),
             ('All aims covered with question counts. Click any card to focus practice on that aim.', 'Every chapter with its question count. Click a chapter to practise it.'),
             ('focus on specific aims', 'focus on specific chapters'), ('Pick the aims and styles', 'Pick the chapters and styles'),
             ('All learning aims', 'All chapters'), ('Focus aims', 'Focus chapters'), ('>All aims<', '>All chapters<'),
             ('filtered by aim,', 'filtered by chapter,'), ('items by aim,', 'items by chapter,')]
        for a, b in R:
            s = s.replace(a, b)
        return s
    s = s.replace('Learning Aim ${', 'Aim ${')
    s = re.sub(r'(?<![\w-])Aim \$\{([^}]+)\}', r'${AIM_WORD} ${AIM_LBL(\1)}', s)
    for cls in ('aim-letter', 'sj-letter', 'spec-aim-letter'):
        s = s.replace("el('div', { class: '%s' }, letter)" % cls, "el('div', { class: '%s' }, AIM_LBL(letter))" % cls)
        s = s.replace("el('span', { class: '%s' }, letter)" % cls, "el('span', { class: '%s' }, AIM_LBL(letter))" % cls)
    s = re.sub(r'Aims B-[A-Z] are locked', 'Chapters 2 onwards are locked', s)
    R = [("['num', stats.aims, 'Learning aims']", "['num', stats.aims, 'Chapters']"),
         ('No questions available for selected aims.', 'No questions available for the selected chapters.'), ('Jump to aim', 'Jump to chapter'),
         ('No aim data yet.', 'No chapter data yet.'), ('aim accuracy graph', 'chapter accuracy graph'), ('across all aims.', 'across all chapters.'),
         ('Weak aims</h3>', 'Weak chapters</h3>'), ("Aims: ${r.learning_aims.join(', ')}", "Chapters: ${r.learning_aims.map(AIM_LBL).join(', ')}"),
         ("const chip = el('div', { class: 'chip on' }, a);", "const chip = el('div', { class: 'chip on' }, AIM_WORD + ' ' + AIM_LBL(a));"),
         ('on your weakest aim.', 'on your weakest chapter.'),
         ('Aims B-Q are locked', 'Chapters 2 onwards are locked'), ('You can preview Aim A for free. The other aims below', 'You can preview Chapter 1 for free. The other chapters below'),
         ('to open all aims temporarily', 'to open all chapters temporarily'), ('Your 10-credit unlock is active for all aims.', 'Your 10-credit unlock is active for all chapters.'),
         ('in real psychology contexts for ${AIM_WORD}', 'in real contexts for ${AIM_WORD}')]
    for a, b in R:
        s = s.replace(a, b)
    return helper + s


def offspec_note(S, aim, blob):
    hits = [note for a, rx, note in S['offspec'] if a == aim and re.search(rx, blob, re.I)]
    if not hits:
        return None
    return 'Not in the updated %s specification (A-level exams from 2027): %s. Still good practice for exam technique.' % (S['board'], '; '.join(dict.fromkeys(hits)))


def tidy_ctx(blocks):
    """Drop a printed 'Figure 1 …' caption line when the figure itself follows (the figure carries the caption)."""
    out = []
    for i, b in enumerate(blocks):
        nxt = blocks[i + 1] if i + 1 < len(blocks) else None
        if b['t'] == 'p' and re.match(r'^Figure \d+\b', b['x']) and len(b['x']) < 140 and nxt and nxt['t'] == 'fig':
            continue
        out.append(b)
    return out


def ms_text(ms):
    if not ms:
        return 'No published mark scheme text was found for this part — mark it against the command word and the marks available.'
    out = []
    if ms.get('ao'):
        out.append('Marks for this question: ' + ms['ao'])
    if ms.get('answer'):
        out.append('Answer: ' + ms['answer'])
    out += [re.sub(r'^•\s*', '• ', b) for b in ms.get('body') or []]
    for t in ms.get('tables') or []:
        out.append('\n'.join(' | '.join(c for c in r) for r in t))
    return '\n'.join(out).strip()


def papers_js(slug, S):
    src = json.load(io.open(os.path.join(HERE, 'out', S['src'] + '.papers.json'), encoding='utf-8'))
    figs = json.load(io.open(os.path.join(HERE, 'out', S['src'] + '.figures.json'), encoding='utf-8'))
    months = {'June': 6, 'November': 11}
    papers, n_off = [], 0
    for p in src:
        items = []
        for it in p['items']:
            aim = topic_aim(S, p['paper'], it['section'], it.get('topic'))
            text = it['text']
            m0 = re.match(r'^(\d) (\d)\s+', text)
            if m0 and int(m0.group(1) + m0.group(2)) == it['main']:
                text = text[m0.end():]          # a stray question number printed at the start of the text
            if it.get('options'):
                text = text + '\n' + '\n'.join('%s  %s' % (o[0], o[1]) for o in it['options'])
            blob = it['text'] + ' ' + ' '.join(b.get('x', '') for b in it['ctxb'] if b['t'] == 'p') + ' ' + ' '.join(o[1] for o in it.get('options') or [])
            o = {'q': it['main'], 'sub': it['sub'], 'label': it['q'], 'marks': it['marks'], 'section': it['section'], 'aim': aim,
                 'topic': it.get('topic'), 'ctx': [], 'ctxb': tidy_ctx(it['ctxb']), 'text': text, 'kind': it['kind'],
                 'ms': {'body': ms_text(it.get('ms')), 'levels': (it.get('ms') or {}).get('levels') or None}}
            if it.get('opt'):
                o['opt'] = it['opt']
            note = offspec_note(S, aim, blob)
            if note:
                o['offspec'] = note; n_off += 1
            items.append(o)
        month = months.get(p['series'].split()[0], 6)
        papers.append({'id': p['id'], 'paper': p['paper'], 'key': '%d%02d%d' % (p['year'], month, 9 - p['paper']), 'series': p['series'],
                       'date': '%s · Paper %d' % (p['series'], p['paper']), 'title': p['title'], 'source': 'aqa', 'kind': 'exam',
                       'code': '%s/%d' % (S['code'], p['paper']), 'spec': 'past', 'total': 96, 'minutes': 120, 'items': items,
                       'badge': '%s · %s' % (S['board'], p['series']), 'badgeTone': 'new',
                       'notice': 'Set for the 2015 specification. Questions on content removed from the updated specification are marked.'})
    head = ('/* %s — real %s question papers and mark schemes (generated by training-data/a-level/alevel-build/build_alevel.py\n'
            '   from psych_parse.py output; do not edit by hand). Question and mark-scheme text © %s, reformatted by RA10 for revision. */\n') % (S['qual'], S['board'], S['board'])
    fig = {k: {'cap': v['cap'], 'alt': v['alt'], 'src': 'figures/' + v['file']} for k, v in figs.items()}
    s = head + 'window.BIZ_FIGURES = Object.assign(window.BIZ_FIGURES || {}, ' + json.dumps(fig, ensure_ascii=False) + ');\n'
    s += 'window.BIZ_PAPERS = (window.BIZ_PAPERS || []).concat(' + json.dumps(papers, ensure_ascii=False) + ');\n'
    return s, papers, n_off


def edx_aim(paper, text, ctx_text):
    """Pick the topic area whose keywords best match the question (extract text breaks ties), within the paper's themes."""
    allowed = EDX_PAPER_AIMS[paper]
    best, score = allowed[0], (0, 0)
    for a in allowed:
        rx = re.compile(EDX_KEYS[a], re.I)
        s = (sum(len(m.group(0)) for m in rx.finditer(text)), sum(len(m.group(0)) for m in rx.finditer(ctx_text)))
        if s > score:
            best, score = a, s
    return best


def papers_js_edexcel(slug, S):
    src = json.load(io.open(os.path.join(HERE, 'out', S['src'] + '.papers.json'), encoding='utf-8'))
    figs = json.load(io.open(os.path.join(HERE, 'out', S['src'] + '.figures.json'), encoding='utf-8'))
    names = {a: n for a, n, *_ in S['aims']}
    papers = []
    for p in src:
        items = []
        for it in p['items']:
            ctx_text = ' '.join(b.get('x', '') for b in it['ctxb'] if b['t'] in ('p', 'h'))
            aim = edx_aim(p['paper'], it['text'], ctx_text)
            items.append({'q': it['q'], 'sub': it['sub'], 'label': it['label'], 'marks': it['marks'], 'section': it['section'], 'aim': aim,
                          'topic': names[aim], 'ctx': [], 'ctxb': it['ctxb'], 'text': it['text'], 'kind': it['kind'], 'ms': it['ms']})
        mo = int(p['month'])
        papers.append({'id': p['id'], 'paper': p['paper'], 'key': '%s%02d%d' % (p['year'], mo, 9 - p['paper']), 'series': p['series'],
                       'date': '%s · Paper %d' % (p['series'], p['paper']), 'title': 'Paper %d: %s' % (p['paper'], S['papers'][p['paper']][1]),
                       'source': S['real'], 'kind': 'exam', 'code': '%s/0%d' % (S['code'], p['paper']), 'spec': 'past', 'total': 100, 'minutes': 120,
                       'items': items, 'badge': '%s · %s' % (S['boardShort'], p['series']), 'badgeTone': 'new'})
    head = ('/* %s — real Pearson Edexcel question papers, extracts and mark schemes (generated by training-data/a-level/alevel-build/build_alevel.py\n'
            '   from edexcel_parse.py output; do not edit by hand). Question, extract and mark-scheme text © Pearson Education Ltd, reformatted by RA10 for revision. */\n') % S['qual']
    fig = {k: {'cap': '', 'alt': 'Chart or diagram from the extracts (page %d of the original paper)' % v['page'], 'src': v['src']} for k, v in figs.items()}
    s = head + 'window.BIZ_FIGURES = Object.assign(window.BIZ_FIGURES || {}, ' + json.dumps(fig, ensure_ascii=False) + ');\n'
    s += 'window.BIZ_PAPERS = (window.BIZ_PAPERS || []).concat(' + json.dumps(papers, ensure_ascii=False) + ');\n'
    return s, papers, 0


def edx_levels():
    """Generic Edexcel levels per tariff, taken from the most recent mark scheme that has each tariff."""
    src = json.load(io.open(os.path.join(HERE, 'out', 'business-edexcel.papers.json'), encoding='utf-8'))
    out = {}
    for p in sorted(src, key=lambda p: (p['year'], p['month'])):
        for it in p['items']:
            if it['ms'].get('levels'):
                out[str(it['marks'])] = sorted(it['ms']['levels'], key=lambda l: -l['level'])
    return out


AQA_PSY_LEVELS = {
    '4': [{'level': 2, 'marks': '3-4', 'descriptor': 'Knowledge/application is clear and accurate, with some detail. The answer is generally coherent with appropriate use of terminology.'},
          {'level': 1, 'marks': '1-2', 'descriptor': 'Knowledge/application is limited or muddled, with inaccuracies. Terminology is either absent or inappropriately used.'}],
    '6': [{'level': 3, 'marks': '5-6', 'descriptor': 'Knowledge/application is clear, accurate and effective. The answer is generally coherent with appropriate use of terminology.'},
          {'level': 2, 'marks': '3-4', 'descriptor': 'Some appropriate knowledge/application. The answer lacks clarity in places. Terminology is used appropriately on occasions.'},
          {'level': 1, 'marks': '1-2', 'descriptor': 'Limited knowledge/application. The answer as a whole lacks clarity and has inaccuracies. Terminology is either absent or inappropriately used.'}],
    '8': [{'level': 4, 'marks': '7-8', 'descriptor': 'Knowledge is accurate with some detail. Discussion is thorough and effective. Minor detail and/or expansion of argument is sometimes lacking. The answer is clear, coherent and focused. Specialist terminology is used effectively.'},
          {'level': 3, 'marks': '5-6', 'descriptor': 'Knowledge is evident but there are occasional inaccuracies/omissions. Discussion is mostly effective. The answer is mostly clear and organised but occasionally lacks focus. Specialist terminology is used appropriately.'},
          {'level': 2, 'marks': '3-4', 'descriptor': 'Limited knowledge is present. Focus is mainly on description. Any discussion is of limited effectiveness. The answer lacks clarity, accuracy and organisation in places. Specialist terminology is used inappropriately on occasions.'},
          {'level': 1, 'marks': '1-2', 'descriptor': 'Knowledge is very limited. Discussion is limited, poorly focused or absent. The answer as a whole lacks clarity, has many inaccuracies and is poorly organised. Specialist terminology is either absent or inappropriately used.'}],
    '12': [{'level': 4, 'marks': '10-12', 'descriptor': 'Knowledge is accurate and generally well detailed. Discussion/application is thorough and effective. The answer is clear, coherent and focused. Specialist terminology is used effectively. Minor detail and/or expansion of argument is sometimes lacking.'},
           {'level': 3, 'marks': '7-9', 'descriptor': 'Knowledge is evident. There are occasional inaccuracies. Discussion/application is mostly effective. The answer is mostly clear and organised. Specialist terminology is mostly used appropriately. Lacks focus in places.'},
           {'level': 2, 'marks': '4-6', 'descriptor': 'Limited knowledge is present. Focus is mainly on description. Any discussion/application is of limited effectiveness. The answer lacks clarity, accuracy and organisation in places. Specialist terminology is used inappropriately on occasions.'},
           {'level': 1, 'marks': '1-3', 'descriptor': 'Knowledge is very limited. Discussion/application is limited, poorly focused or absent. The answer as a whole lacks clarity, has many inaccuracies and is poorly organised. Specialist terminology is either absent or inappropriately used.'}],
    '16': [{'level': 4, 'marks': '13-16', 'descriptor': 'Knowledge is accurate and generally well detailed. Discussion is thorough and effective. The answer is clear, coherent and focused. Specialist terminology is used effectively. Minor detail and/or expansion of argument is sometimes lacking.'},
           {'level': 3, 'marks': '9-12', 'descriptor': 'Knowledge is evident. There are occasional inaccuracies. Discussion is mostly effective. The answer is mostly clear and organised. Specialist terminology is mostly used appropriately. Lacks focus in places.'},
           {'level': 2, 'marks': '5-8', 'descriptor': 'Limited knowledge is present. Focus is mainly on description. Any discussion is of limited effectiveness. The answer lacks clarity, accuracy and organisation in places. Specialist terminology is used inappropriately on occasions.'},
           {'level': 1, 'marks': '1-4', 'descriptor': 'Knowledge is very limited. Discussion is limited, poorly focused or absent. The answer as a whole lacks clarity, has many inaccuracies and is poorly organised. Specialist terminology is either absent or inappropriately used.'}],
}


def cfg_js(slug, S):
    aims = {a: {'name': n, 'code': c, 'paper': pn} for a, n, c, pn, sec in S['aims']}
    cfg = {
        'n': 0, 'key': S['key'], 'code': S['code'], 'name': S['qual'], 'kind': 'exam', 'total': 96, 'minutes': 120, 'timeLabel': '2 hours',
        'aims': [a for a, *_ in S['aims']], 'subject': S['name'], 'pdfPrefix': S['pdf'], 'realSource': 'aqa', 'board': S['board'],
        'unitLine': S['qual'], 'formatName': 'A-level ' + S['name'],
        'qualLine': '%s A-level %s (%s)' % (S['board'], S['name'], S['code']),
        'paperNames': {str(k): v[0] for k, v in S['papers'].items()},
        'specGroups': {'past': {'t': '%s past papers (2015 specification, 2020–2025)' % S['board'], 'd': 'The real papers with the official mark schemes. Questions on content AQA has since removed are marked.'},
                       'ra10': {'t': 'RA10 practice papers (updated specification)', 'd': 'Written by RA10 in the exact AQA layout, covering the updated content for exams from 2027.'}},
        'paperNote': 'Three papers, each 2 hours and 96 marks. Paper 1: Social influence, Memory, Attachment, Clinical Psychology and Mental Health. Paper 2: Approaches, Biopsychology, Research methods (48 marks). Paper 3: Issues and debates plus one option from each of Sections B, C and D.',
        'instructions': [
            ['Instructions', ['Use black ink or black ball-point pen.', 'Answer all questions (Paper 3: answer Section A and one topic from each of Sections B, C and D).', 'Do all rough work in this book.']],
            ['Information', ['The marks for questions are shown in brackets.', 'The maximum mark for this paper is {total}.', 'Questions should be answered in continuous prose. You will be assessed on your ability to use good English, organise information clearly and use specialist vocabulary where appropriate.']],
            ['Advice', ['Spend about 30 minutes on each 24-mark section (Paper 2 Section C: about 60 minutes).', 'For 8-, 12- and 16-mark questions, balance accurate knowledge (AO1) with application (AO2) and evaluation (AO3) as the question demands.']]],
        'howto': ['Filter by Paper 1, 2 or 3. Past papers are the real AQA papers with the official mark schemes; RA10 papers follow the same layout and cover the updated content.',
                  'Switch to “Answer online”. For Paper 3, choose your three option topics at the top — the paper, total and timer follow your choice.',
                  'Reveal the official mark scheme or press “AI Examiner” for a level, a mark and how to reach the next level. Questions on removed content are flagged.'],
        'legal': 'Past paper and mark-scheme text © AQA, reformatted by RA10 for revision. Figures are reproduced from the original papers. RA10 practice papers and mark schemes are RA10’s own. This is not an official AQA product.',
    }
    cfg.update({k: v for k, v in (S.get('cfg') or {}).items() if k != 'mockSections'})
    if S.get('adapter') == 'edexcel':
        cfg.update(total=S['total'], realSource=S['real'])
        levels = edx_levels()
        return ('/* %s — configuration for the shared paper viewer, question bank and AI Examiner (generated by build_alevel.py). */\n'
                '(function () {\n  \'use strict\';\n'
                '  const AIMS = %s;\n'
                '  window.BIZ_LEVELS = %s;\n'
                '  window.BIZ_UNIT = Object.assign(%s, {\n'
                '    qLabel: (it) => it.label || String(it.q),\n'
                '    groupLabel: (it) => \'Question \' + it.q,\n'
                '    runLabel: (it) => \'Question \' + it.q,\n'
                '    sectionTitleFor: (s) => \'Section \' + s,\n'
                '    cardMeta: (p) => { const by = {}; p.items.forEach(it => { by[it.section] = (by[it.section] || 0) + it.marks; }); return Object.keys(by).sort().map(s => \'Section \' + s + \' \' + by[s]).join(\' · \') + \' · \' + p.items.length + \' questions\'; },\n'
                '    classify: function (text, section, q, p, itext) { const it = p && p.items ? p.items.find(x => x.q === q && x.section === section && (!itext || x.text === itext)) || p.items.find(x => x.q === q && x.section === section) : null; return (it && it.aim) || \'A\'; },\n'
                '    topicFor: function (text, it) { const a = it && it.aim; return a && AIMS[a] ? AIMS[a].code + \' \' + AIMS[a].name : \'\'; }\n'
                '  });\n})();\n') % (S['qual'], json.dumps({a: {'name': n, 'code': c, 'paper': pn} for a, n, c, pn, sec in S['aims']}, ensure_ascii=False),
                                   json.dumps(levels, ensure_ascii=False), json.dumps(cfg, ensure_ascii=False, indent=1))
    sec = S['sections']
    return ('/* %s — configuration for the shared paper viewer, question bank and AI Examiner (generated by build_alevel.py). */\n'
            '(function () {\n  \'use strict\';\n'
            '  const AIMS = %s;\n  const SECTIONS = %s;\n'
            '  window.BIZ_LEVELS = %s;\n'
            '  window.BIZ_UNIT = Object.assign(%s, {\n'
            '    qLabel: (it) => it.label || String(it.q).padStart(2, \'0\'),\n'
            '    groupLabel: (it) => \'Question \' + String(it.q).padStart(2, \'0\'),\n'
            '    runLabel: (it) => \'Question \' + String(it.q).padStart(2, \'0\'),\n'
            '    sectionTitleFor: (s, it, p) => \'Section \' + s + \' — \' + (it && it.opt ? it.opt.name : ((SECTIONS[p && p.paper] || {})[s] || \'\')),\n'
            '    cardMeta: (p) => { const by = {}; p.items.forEach(it => { if (!it.opt) by[it.section] = (by[it.section] || 0) + it.marks; }); const parts = Object.keys(by).sort().map(s => \'Section \' + s + \' \' + by[s]); if (p.items.some(it => it.opt)) parts.push(\'Sections B–D: choose your topics\'); return parts.join(\' · \') + \' · \' + new Set(p.items.map(it => it.q)).size + \' questions\'; },\n'
            '    classify: function (text, section, q, p) { const it = p && p.items ? p.items.find(x => x.q === q && x.section === section) : null; return (it && it.aim) || \'A\'; },\n'
            '    topicFor: function (text, it) { const a = it && it.aim; return a && AIMS[a] ? AIMS[a].code + \' \' + AIMS[a].name : \'\'; }\n'
            '  });\n})();\n') % (S['qual'], json.dumps(aims, ensure_ascii=False), json.dumps(sec, ensure_ascii=False), json.dumps(AQA_PSY_LEVELS, ensure_ascii=False), json.dumps(cfg, ensure_ascii=False, indent=1))


def spec_js(S):
    """Topics from the updated specification (one aim per topic area); the guide and question bank use the same codes."""
    spec = json.load(io.open(os.path.join(HERE, 'out', S['src'] + '.spec.json'), encoding='utf-8'))
    aims = {}
    if S.get('adapter') == 'edexcel':
        where = {1: 'Papers 1 and 3', 2: 'Papers 2 and 3'}
        for a, name, code, pn, theme in S['aims']:
            area = spec[code]
            aims[a] = {'title': '%s %s' % (code, name), 'short': 'Theme %s · %s' % (code[0], where[pn]), 'paper': pn,
                       'topics': [{'code': s['code'], 'name': s['name'], 'content': s['content']} for s in area['subs']]}
        return ('/* %s — specification content (Issue 1; generated by build_alevel.py from the Pearson specification). */\n'
                '(function () {\n  \'use strict\';\n  window.LEARNING_AIMS = %s;\n  window.SPEC = %s;\n})();\n') % (S['qual'], json.dumps(list(aims)), json.dumps(aims, ensure_ascii=False, indent=1))
    for a, name, code, pn, sec in S['aims']:
        pts = spec.get(code, [])
        aims[a] = {'title': '%s %s' % (code, name), 'short': 'Paper %d · %s' % (pn, name), 'paper': pn,
                   'topics': [{'code': '%s.%d' % (code, i + 1), 'name': t} for i, t in enumerate(pts)]}
    return ('/* %s — specification content (updated specification, teaching from September 2025; generated by build_alevel.py). */\n'
            '(function () {\n  \'use strict\';\n  window.LEARNING_AIMS = %s;\n  window.SPEC = %s;\n})();\n') % (S['qual'], json.dumps(list(aims)), json.dumps(aims, ensure_ascii=False, indent=1))


STUBS = AAQ.STUBS


CONTENT = os.path.join(HERE, 'content')


def assemble_content(slug, base):
    """Hand-written content lives in content/<slug>/<file>/NN_*.js (one part per topic, so it stays editable).
    Parts are concatenated in name order into revision/a-level/<slug>/js/<file>.js and syntax-checked with node."""
    root = os.path.join(CONTENT, slug)
    if not os.path.isdir(root):
        return
    for stem in ('bank', 'quiz', 'cards', 'guide', 'papers-ra10'):
        d = os.path.join(root, stem)
        if not os.path.isdir(d):
            continue
        parts = sorted(f for f in os.listdir(d) if f.endswith('.js'))
        if not parts:
            continue
        body = ['/* %s — hand-written RA10 content. Generated from training-data/a-level/alevel-build/content/%s/%s/ '
                '(edit the parts there, then run build_alevel.py). */\n' % (stem, slug, stem)]
        for f in parts:
            with open(os.path.join(d, f), encoding='utf-8') as fh:
                body.append('/* ---- %s ---- */\n%s\n' % (f, fh.read().rstrip()))
        out = os.path.join(base, 'js', stem + '.js')
        wr(out, '\n'.join(body) + '\n')
        r = subprocess.run(['node', '--check', out], capture_output=True, text=True)
        if r.returncode:
            raise SystemExit('syntax error in %s:\n%s' % (out, r.stderr))
        print('  %s.js: %d parts' % (stem, len(parts)))


def build(slug):
    S = SUBJECTS[slug]
    base = os.path.join(OUT, slug)
    m = meta(S)
    BU.CSS_LINKS = AAQ.ORIG_CSS.replace('../shared/', '../shared-alevel/').replace('v=20261101', 'v=' + V)
    scripts = AAQ.ORIG_SCRIPTS.replace('../shared/', '../shared-alevel/').replace('v=20261101', 'v=' + V)
    scripts = scripts.replace('<script src="js/papers-data.js?v=%s"></script>' % V, '<script src="js/papers-data.js?v=%s"></script>\n<script src="js/papers-ra10.js?v=%s"></script>' % (V, V))
    scripts = scripts.replace('<script src="js/cfg.js', '<script src="/refresh/ra10-units.js?v=20261212"></script>\n<script src="js/cfg.js')
    BU.SCRIPTS = scripts
    app = chapterise(post(BU.build_app(1, m), S))
    css = BU.build_css(1, m)
    idx = chapterise(post(BU.build_index(1, m), S))
    idx = idx.replace('../../../../shared/', '../../shared/')
    idx = re.sub(r'<title>[^<]*</title>', '<title>%s A-level %s (%s) — Past Papers, Revision Guide and AI Examiner | RA10</title>' % (S['board'], S['name'], S['code']), idx, count=1)
    idx = idx.replace('A-level A-level', 'A-level')
    app = app.replace('A-level A-level', 'A-level')
    for bad, good in (('Pearson Edexcel Edexcel', 'Pearson Edexcel'), ('Pearson Edexcel Pearson Edexcel', 'Pearson Edexcel')):
        idx = idx.replace(bad, good); app = app.replace(bad, good)
    loader = post(BU.build_loader(1, m), S)
    wr(os.path.join(base, 'js', 'app.js'), app)
    wr(os.path.join(base, 'css', 'style.css'), css)
    wr(os.path.join(base, 'index.html'), idx)
    wr(os.path.join(base, 'js', 'data-loader.js'), loader)
    chapters = {a: str(i + 1) for i, (a, *_) in enumerate(S['aims'])}
    wr(os.path.join(base, 'js', 'cfg.js'), cfg_js(slug, S) + 'window.AIM_WORD = "Chapter";\nwindow.AIM_LABEL = %s;\n' % json.dumps(chapters))
    wr(os.path.join(base, 'js', 'spec.js'), spec_js(S))
    pj, papers, n_off = (papers_js_edexcel if S.get('adapter') == 'edexcel' else papers_js)(slug, S)
    wr(os.path.join(base, 'js', 'papers-data.js'), pj)
    fdir = os.path.join(HERE, 'out', 'figures')
    for f in os.listdir(fdir):
        if any(f.startswith(p['id'] + '-') for p in papers):
            os.makedirs(os.path.join(base, 'figures'), exist_ok=True)
            shutil.copyfile(os.path.join(fdir, f), os.path.join(base, 'figures', f))
    for f, stub in (('bank.js', 'bank'), ('quiz.js', 'quiz'), ('cards.js', 'cards'), ('guide.js', 'guide')):
        p = os.path.join(base, 'js', f)
        if not os.path.exists(p):
            wr(p, STUBS[stub] % {'n': 1})
    if not os.path.exists(os.path.join(base, 'js', 'papers-ra10.js')):
        wr(os.path.join(base, 'js', 'papers-ra10.js'), '/* RA10 practice papers: hand-written. */\n')
    assemble_content(slug, base)
    print('built %s: %d past papers, %d items (%d flagged off-spec)' % (slug, len(papers), sum(len(p['items']) for p in papers), n_off))


if __name__ == '__main__':
    for s in (sys.argv[1:] or list(SUBJECTS)):
        build(s)
