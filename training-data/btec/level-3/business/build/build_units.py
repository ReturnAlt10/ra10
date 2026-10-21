"""Generate the Business unit apps (2, 3, 6, 7) from the Sport Unit 2 template.

Run:  python build_units.py [unit ...]
Only generated files are written: index.html, css/style.css, js/app.js, js/data-loader.js.
Hand-written unit content (cfg.js, spec.js, bank.js, guide.js, papers-data.js) is left alone.
"""
import io, os, re, sys

REPO = r'C:\Users\mistr\OneDrive\Documents\GitHub\ra10'
SPORT = os.path.join(REPO, 'revision', 'btec', 'level-3', 'sport', 'unit-2')
OUT = os.path.join(REPO, 'revision', 'btec', 'level-3', 'business')

UNITS = {
    2: dict(code='31489H', name='Developing a Marketing Campaign', key='bus_u2', n=2, aims='A–C', free='the set-task overview and Aim A', locked='Aims B–C', nAims=3,
            accent='#2563eb', accent2='#DBE7FF', ink='#1E3A8A', d2='#172554', dink='#BFDBFE', grad=('#1e3a8a', '#2563eb', '#38bdf8'),
            eyebrow='Pearson BTEC Level 3 Business — External Set Task',
            hero='Unit 2 Developing a Marketing Campaign',
            lede='Every Pearson Unit 2 set task since 2017 — the Part A research pack and both Part B activities — an AI Examiner calibrated to the eight assessment foci, and a full revision guide to marketing aims, research, the marketing mix and campaign planning.',
            papers_card='All 13 published set tasks (June 2017 – June 2024) plus RA10 practice tasks. Write the rationale and the campaign plan online and get each activity marked by the AI Examiner.',
            format_line='The real Unit 2 format: a research pack, then a 70-mark rationale and campaign plan.',
            papers_card2='Pearson set tasks and RA10 practice tasks, with a 3-hour timer, a budget planner and AI Examiner marking on both activities.',
            mock_default=40, mock_total='<option value="40" selected>40 (half paper)</option><option value="30">30 (quick test)</option><option value="20">20 (short test)</option>',
            papers_sub='Every Pearson Unit 2 set task (31489H) from June 2017 to June 2024 plus RA10 practice tasks. Read each paper like the real exam, answer it online for AI Examiner feedback, or download it as a PDF.',
            spec_h='Business Unit 2 specification', spec_p='The Unit 2 content, content area by content area, mapped to the question bank.',
            footer='BTEC Level 3 Business Unit 2 (Developing a Marketing Campaign, 31489H) — Pearson. This is a study tool — not an official Pearson product.',
            flash_p='Definitions, models, formulae and examiner tips for the marketing mix, research methods and campaign planning.',
            quiz_p='Multiple-choice and true/false questions with an explanation for every answer.',
            guide_p='Every content area with diagrams, worked examples and the examiner-report advice that decides the top bands.',
            calc=False),
    3: dict(code='31463H', name='Personal and Business Finance', key='bus_u3', n=3, aims='A–F', free='the exam overview and Aim A', locked='Aims B–F', nAims=6,
            accent='#0f766e', accent2='#CCFBF1', ink='#115E59', d2='#0B3B36', dink='#99F6E4', grad=('#134e4a', '#0f766e', '#2dd4bf'),
            eyebrow='Pearson BTEC Level 3 Business — External Exam',
            hero='Unit 3 Personal and Business Finance',
            lede='Every Pearson Unit 3 exam since 2017 with mark schemes, an AI Examiner that marks calculations with the own-figure rule and levels answers with the Lead Examiner’s standards, a finance calculator, and a full revision guide to aims A–F.',
            papers_card='All 12 published papers (June 2017 – June 2024) plus RA10 practice papers. Answer online, reveal the mark scheme, self-mark or get the AI Examiner to mark each question.',
            format_line='The real Unit 3 format: a 2-hour exam — Section A personal finance, Section B business finance.',
            papers_card2='Pearson papers and RA10 practice papers, with a 2-hour timer, working-and-answer boxes for calculations and AI Examiner marking.',
            mock_default=80, mock_total='<option value="80" selected>80 (full paper)</option><option value="40">40 (half paper)</option><option value="30">30 (quick test)</option>',
            papers_sub='Every Pearson Unit 3 exam (31463H) from June 2017 to June 2024 plus RA10 practice papers. Read each paper like the real exam, answer it online for AI Examiner feedback, or download it as a PDF.',
            spec_h='Business Unit 3 specification', spec_p='The Unit 3 content, aim by aim (A–F), mapped to the question bank.',
            footer='BTEC Level 3 Business Unit 3 (Personal and Business Finance, 31463H) — Pearson. This is a study tool — not an official Pearson product.',
            flash_p='Formulae, definitions and key facts for personal finance, accounting, cash flow, break-even and ratios.',
            quiz_p='Multiple-choice and true/false questions with a worked explanation for every answer.',
            guide_p='Every aim with worked calculations, statements, charts and the examiner-report advice that decides the marks.',
            calc=True),
    6: dict(code='31588H', name='Principles of Management', key='bus_u6', n=6, aims='A–F', free='the set-task overview and Aim A', locked='Aims B–F', nAims=6,
            accent='#7C3AED', accent2='#E9D5FF', ink='#4C1D95', d2='#3B1D68', dink='#DDD6FE', grad=('#4c1d95', '#7c3aed', '#a78bfa'),
            eyebrow='Pearson BTEC Level 3 Business — External Set Task',
            hero='Unit 6 Principles of Management',
            lede='Every Pearson Unit 6 set task since 2018 — the Part A case study and the Part B report and presentation — an AI Examiner calibrated to the assessment-focus grids, and a full revision guide to management, leadership, HR, motivation, change and quality.',
            papers_card='All 12 published set tasks (January 2018 – June 2024) plus RA10 practice tasks. Write the report and build the presentation with speaker notes, then get each marked by the AI Examiner.',
            format_line='The real Unit 6 format: Part A case study, then a 44-mark report and a 44-mark presentation.',
            papers_card2='Pearson set tasks and RA10 practice tasks, with a 3-hour timer, a slide builder with speaker notes and AI Examiner marking.',
            mock_default=40, mock_total='<option value="40" selected>40 (half paper)</option><option value="30">30 (quick test)</option><option value="20">20 (short test)</option>',
            papers_sub='Every Pearson Unit 6 set task (31588H) from January 2018 to June 2024 plus RA10 practice tasks. Read each paper like the real exam, answer it online for AI Examiner feedback, or download it as a PDF.',
            spec_h='Business Unit 6 specification', spec_p='The Unit 6 content, content area by content area, mapped to the question bank.',
            footer='BTEC Level 3 Business Unit 6 (Principles of Management, 31588H) — Pearson. This is a study tool — not an official Pearson product.',
            flash_p='Theories, styles, models and terminology for management, leadership, HR, motivation, change and quality.',
            quiz_p='Multiple-choice and true/false questions with an explanation for every answer.',
            guide_p='Every content area with diagrams, theory summaries and the examiner-report advice that decides the top bands.',
            calc=False),
    7: dict(code='31589H', name='Business Decision Making', key='bus_u7', n=7, aims='A–H', free='the set-task overview and Aim A', locked='Aims B–H', nAims=8,
            accent='#C2410C', accent2='#FFEDD5', ink='#9A3412', d2='#431407', dink='#FED7AA', grad=('#7c2d12', '#c2410c', '#fb923c'),
            eyebrow='Pearson BTEC Level 3 Business — External Set Task (Part S)',
            hero='Unit 7 Business Decision Making',
            lede='Every Pearson Unit 7 Part S task since 2018 — two options, one recommendation — an AI Examiner calibrated to the nine assessment foci, a finance calculator, and a full revision guide to factors and risks, resources, financial forecasts and decision tools.',
            papers_card='All 12 published Part S tasks (January 2018 – June 2024) plus RA10 practice tasks. Write the 52-mark report and the 18-mark presentation, then get each marked by the AI Examiner.',
            format_line='The real Unit 7 format: one 3-hour task — a 52-mark report and an 18-mark presentation with speaker notes.',
            papers_card2='Pearson Part S tasks and RA10 practice tasks, with a 3-hour timer, a slide builder with speaker notes and AI Examiner marking.',
            mock_default=40, mock_total='<option value="40" selected>40 (half paper)</option><option value="30">30 (quick test)</option><option value="20">20 (short test)</option>',
            papers_sub='Every Pearson Unit 7 Part S task (31589H) from January 2018 to June 2024 plus RA10 practice tasks. Read each paper like the real exam, answer it online for AI Examiner feedback, or download it as a PDF.',
            spec_h='Business Unit 7 specification', spec_p='The Unit 7 content, content area by content area, mapped to the question bank.',
            footer='BTEC Level 3 Business Unit 7 (Business Decision Making, 31589H) — Pearson. This is a study tool — not an official Pearson product.',
            flash_p='Decision tools, formulae, risk terms and the structure of a top-band report and presentation.',
            quiz_p='Multiple-choice and true/false questions with an explanation for every answer.',
            guide_p='Every content area with worked financial analysis, tool templates and the examiner-report advice that decides the top bands.',
            calc=True),
}


CSS_LINKS = ('<link rel="stylesheet" href="css/style.css?v=20261101">\n<link rel="stylesheet" href="../shared/biz-papers.css?v=20261101">\n'
             '<link rel="stylesheet" href="../shared/biz-guide.css?v=20261101">{calc}')
CALC_LINK = '\n<link rel="stylesheet" href="../shared/biz-calc.css?v=20261101">'
SCRIPTS = ('<script src="js/cfg.js?v=20261101"></script>\n<script src="js/spec.js?v=20261101"></script>\n'
           '<script src="../shared/biz-bank.js?v=20261101"></script>\n<script src="js/bank.js?v=20261101"></script>\n<script src="js/quiz.js?v=20261101"></script>\n<script src="js/cards.js?v=20261101"></script>\n'
           '<script src="js/papers-data.js?v=20261101"></script>\n<script src="../shared/biz-papers.js?v=20261101"></script>\n'
           '<script src="js/data-loader.js?v=20261101"></script>\n<script src="../shared/biz-guide.js?v=20261101"></script>\n'
           '<script src="js/guide.js?v=20261101"></script>\n{calc}<script src="js/app.js?v=20261101"></script>')
CALC_SCRIPT = '<script src="../shared/calculator.js?v=20261101"></script>\n'


def rd(p):
    return io.open(p, encoding='utf-8', newline='').read().replace('\r\n', '\n')


def wr(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)


def must_replace(s, old, new, label, count=None):
    if old not in s:
        raise SystemExit('PATCH FAILED: ' + label)
    return s.replace(old, new) if count is None else s.replace(old, new, count)


def build_app(u, m):
    s = rd(os.path.join(SPORT, 'js', 'app.js'))
    s = s.replace('// BTEC Sport Unit 2 — Question Bank App', '// BTEC Business Unit %d — Question Bank App' % u)
    s = s.replace('sport_u2', m['key'])
    s = must_replace(s, 'Check out RA10 for BTEC Sport revision', 'Check out RA10 for BTEC Business revision', 'share text')
    s = must_replace(s, 'apply it to sport performance contexts for Aim ${aim}.', 'apply it in business contexts for Aim ${aim}.', 'guide summary')
    s = must_replace(s, 'Sport one-time subject plan gives full guide access for Sport', 'Business one-time subject plan gives full guide access for Business', 'plan text')
    s = must_replace(s, 'The Sport question bank failed to initialise.', 'The Business question bank failed to initialise.', 'no questions')
    s = must_replace(s, "el('h3', null, 'BTEC Level 3 Sport — Unit 2: Fitness Training and Programming')", "el('h3', null, 'BTEC Level 3 Business — Unit %d: %s')" % (u, m['name']), 'mock title')
    s = must_replace(s, "/^[A-E]\\d+$/", "/^[A-Z]\\d+$/", 'topic tree re 1')
    s = must_replace(s, "/^([A-E]\\d+)\\./", "/^([A-Z]\\d+)\\./", 'topic tree re 2')
    s = must_replace(s, "const MARKS_OPTIONS = [1, 2, 3, 4, 6, 8, 12, 14];", "const MARKS_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 18, 20, 34, 36, 44, 52];", 'marks options')
    s = re.sub(r"const COMMAND_VERBS = \[[^\]]*\];", "const COMMAND_VERBS = ['State', 'Identify', 'Give', 'Define', 'Outline', 'Describe', 'Explain', 'Calculate', 'Analyse', 'Assess', 'Discuss', 'Evaluate', 'Justify', 'Recommend', 'Report', 'Plan', 'Rationale', 'Present'];", s, count=1)
    s = re.sub(r"const ORIGIN_LABELS = \{[^}]*\};", "const ORIGIN_LABELS = { pearson: 'Pearson past-paper questions', ra10: 'RA10 practice-paper questions', knowledge: 'Knowledge checks & calculations' };", s, count=1)
    mins = '1.5' if u == 3 else '1.5'
    s = must_replace(s, 'return Math.round(totalMarks * 9 / 8);', 'return Math.round(totalMarks * %s);' % mins, 'mock minutes')
    s = must_replace(s, "  if (name === 'guide') renderRevisionGuide();", "  if (name === 'guide') renderRevisionGuide();\n  if (name === 'calculator' && window.initFinanceCalculator) window.initFinanceCalculator();", 'calculator init')
    last = m['aims'].split('–')[1]
    s = must_replace(s, 'Aims B-E are locked', 'Aims B-%s are locked' % last, 'locked text')
    s = must_replace(s, "const isAimA = !!(link && (link.getAttribute('onclick') || '').includes('guide-aim-A'));", "const isAimA = !!(link && /guide-aim-A|guide-set-task/.test(link.getAttribute('onclick') || ''));", 'toc free')
    # remove sport client card + diagram svgs, keep generic source rendering
    a = s.index('function diagramSvgForSection(section) {')
    b = s.index('function renderSourceMaterial(item, opts) {')
    s = s[:a] + s[b:]
    s = must_replace(s, "  if (s.type === 'client') return renderClientCard(s.case_id, !(opts && opts.compact));\n", '', 'client source')
    s = must_replace(s, "    box.appendChild(el('div', { class: 'source-figure', html: diagramSvgForSection(s.section) }));\n", "    box.appendChild(el('div', { class: 'source-figure', html: '' }));\n", 'diagram source')
    # origin tag in browse rows
    old = "    q.origin === 'pearson' ? el('span', { class: 'client-tag pearson' }, 'Pearson ' + q.series + ' · Activity ' + q.activity) : q.origin === 'ra10' ? el('span', { class: 'client-tag' }, 'RA10 set task · Activity ' + q.activity) : null"
    i = s.index("    q.origin === 'pearson' ? el('span', { class: 'client-tag pearson' }")
    j = s.index('\n', i)
    new = "    q.origin === 'pearson' ? el('span', { class: 'client-tag pearson' }, 'Pearson ' + q.series + (q.activity ? ' · Activity ' + q.activity : ' · Q' + q.item_q + (q.item_sub ? '(' + q.item_sub + ')' : ''))) : q.origin === 'ra10' ? el('span', { class: 'client-tag' }, 'RA10 practice' + (q.activity ? ' · Activity ' + q.activity : '')) : null"
    s = s[:i] + new + s[j:]
    # AF grid in the mark scheme renderer
    old = "  if (m.instruction) wrap.appendChild(el('p', { class: 'instruction' }, m.instruction));\n\n  if (q.type === 'multiple_choice' && m.answer) {"
    new = "  if (m.instruction) wrap.appendChild(el('p', { class: 'instruction' }, m.instruction));\n  if (m.afs && m.afs.length && window.BizPapers) {\n    const afNode = BizPapers.afGridNode(q, el);\n    if (afNode) wrap.appendChild(afNode);\n    if (m.indicative_content && m.indicative_content.length) {\n      wrap.appendChild(el('p', { class: 'instruction' }, el('strong', null, 'What examiners look for:')));\n      const ul = el('ul'); m.indicative_content.forEach(p => ul.appendChild(el('li', null, p))); wrap.appendChild(ul);\n    }\n    return wrap;\n  }\n\n  if (q.type === 'multiple_choice' && m.answer) {"
    s = must_replace(s, old, new, 'markscheme af')
    # replace papers module with glue
    a = s.index('// ---------- Past papers & set-task practice (Unit 2) ----------')
    b = s.rindex('})();')
    glue = ("// ---------- Past papers & set tasks (shared viewer: ../shared/biz-papers.js) ----------\n"
            "let renderPapers = function () { const h = $('#papers-host'); if (h) h.innerHTML = '<p class=\"muted\" style=\"padding:24px\">Past papers are loading…</p>'; };\n"
            "(function bindPapers() {\n"
            "  if (!window.BizPapers) return;\n"
            "  const api = BizPapers.init({ $, el, renderMarkScheme, buildAutoMarkUI, normaliseAiMarkResult, awardXP, getQuestions: () => QUESTIONS });\n"
            "  renderPapers = api.renderPapers;\n"
            "})();\n\n")
    s = s[:a] + glue + s[b:]
    return s


def build_css(u, m):
    s = rd(os.path.join(SPORT, 'css', 'style.css'))
    cut = s.index('/* ── Past papers v2: library + exam-paper viewer')
    s = s[:cut]
    s = s.replace('/* BTEC Sport Unit 1 — Tool styles */', '/* BTEC Business Unit %d — Tool styles */' % u)
    s = must_replace(s, '--accent: #7C3AED;          /* Sport Unit 1 vivid purple */', '--accent: %s;' % m['accent'], 'css accent')
    s = must_replace(s, '--accent-2: #E9D5FF;\n  --accent-ink: #4C1D95;', '--accent-2: %s;\n  --accent-ink: %s;' % (m['accent2'], m['ink']), 'css accent2')
    s = must_replace(s, '--accent-2: #3B1D68;\n  --accent-ink: #DDD6FE;', '--accent-2: %s;\n  --accent-ink: %s;' % (m['d2'], m['dink']), 'css dark')
    s = s.replace('#unit1-credit-chip', '#unit%d-bus-credit-chip' % u)
    return s


def build_index(u, m):
    s = rd(os.path.join(SPORT, 'index.html'))
    s = s.replace('BTEC Sport Unit 2 — Fitness Training and Programming', 'BTEC Business Unit %d — %s' % (u, m['name']))
    s = s.replace('Sport Unit 2', 'Business Unit %d' % u)
    s = s.replace('Includes your Sport subject c', 'Includes your Business subject c')
    s = s.replace("const RA10_UNIT_SUBJECT = 'Sport';", "const RA10_UNIT_SUBJECT = 'Business';")
    s = s.replace('unit1-credit-chip', 'unit%d-bus-credit-chip' % u)
    g = m['grad']
    s = must_replace(s, 'linear-gradient(130deg, #064e3b 0%, #047857 58%, #059669 100%)', 'linear-gradient(130deg, %s 0%%, %s 58%%, %s 100%%)' % g, 'hero gradient')
    s = must_replace(s, 'border-left: 4px solid #059669;', 'border-left: 4px solid %s;' % m['accent'], 'border left')
    s = s.replace('fill=\'%23059669\'', "fill='%23" + m['accent'].lstrip('#') + "'")
    s = s.replace('%3EU1%3C/text%3E', '%3EU' + str(u) + '%3C/text%3E')
    s = s.replace('border-color: #a855f7;', 'border-color: %s;' % m['accent'])
    # body: replace everything between <main id="app"> and <!-- BROWSE -->
    a = s.index('<main id="app">')
    b = s.index('  <!-- BROWSE -->')
    body = BODY.format(**dict(m, n=u))
    s = s[:a] + '<main id="app">\n' + body + '\n' + s[b:]
    # spec + footer
    s = must_replace(s, '<h2>Business Unit %d specification</h2>' % u, '<h2>%s</h2>' % m['spec_h'], 'spec h2')
    s = re.sub(r'(<h2>%s</h2>\s*<p>)[^<]*(</p>)' % re.escape(m['spec_h']), r'\g<1>%s\g<2>' % m['spec_p'], s, count=1)
    s = re.sub(r'<p>BTEC Level 3 Sport Unit 2[^<]*</p>', '<p>%s</p>' % m['footer'], s, count=1)
    s = re.sub(r'<p>BTEC Level 3 Business Unit %d \(Fitness[^<]*</p>' % u, '<p>%s</p>' % m['footer'], s, count=1)
    # papers section text
    s = re.sub(r'(<h2>Past papers &amp; set tasks</h2>\s*<p>)[^<]*(</p>)', r'\g<1>%s\g<2>' % m['papers_sub'].replace('\\', '\\\\'), s, count=1)
    # mock controls
    s = re.sub(r'<select id="mock-total">.*?</select>', '<select id="mock-total">%s</select>' % m['mock_total'], s, count=1, flags=re.S)
    s = s.replace('Generate a random mock paper using real exam structure.', 'Generate a random knowledge-check paper from the question bank.')
    # calculator view + tab
    if m['calc']:
        s = s.replace('<button class="tab tab-special" data-tab="progress"', '<button class="tab" data-tab="calculator" data-tip="Break-even, cash flow, ratios and depreciation">Calculator</button>\n    <button class="tab tab-special" data-tab="progress"', 1)
        s = s.replace('  <!-- PAST PAPERS / SET TASKS -->', '  <!-- FINANCE CALCULATOR -->\n  <section id="view-calculator" class="view" style="margin-top:24px;margin-bottom:24px;">\n    <div id="calc-root"></div>\n  </section>\n\n  <!-- PAST PAPERS / SET TASKS -->', 1)
    # stylesheet + scripts
    s, ncss = re.subn(r'<link rel="stylesheet" href="css/style\.css\?v=[^"]*">', lambda mo: CSS_LINKS.format(calc=CALC_LINK if m['calc'] else ''), s, count=1)
    if not ncss:
        raise SystemExit('css link not found')
    scripts = re.search(r'<script src="js/u2-spec.js.*?<script src="js/app.js\?v=\d+"></script>', s, re.S)
    if not scripts:
        raise SystemExit('script block not found')
    new = SCRIPTS.replace('{calc}', CALC_SCRIPT if m['calc'] else '')
    s = s[:scripts.start()] + new + s[scripts.end():]
    # leftovers check
    for bad in ('Sport', 'Fitness Training', 'unit1-credit', 'U2.CASES'):
        for mm in re.finditer(bad, s):
            ctx = s[max(0, mm.start() - 40):mm.end() + 40].replace('\n', ' ')
            if 'Business' in ctx and bad == 'Sport':
                continue
            print('  note: leftover', bad, '->', ctx)
    return s


BODY = r'''
  <!-- DASHBOARD -->
  <section id="view-dashboard" class="view active">
    <div class="hero">
      <div>
        <p class="eyebrow">{eyebrow}</p>
        <h2>{hero}</h2>
        <p class="lede">{lede}</p>
      </div>
      <div class="stats" id="dashboard-stats"></div>
    </div>

    <div class="section-block" style="background:linear-gradient(135deg,{ink} 0%,{accent} 58%,{accent2} 100%);border:none;border-radius:12px;padding:20px;margin-bottom:30px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-40px;right:-40px;width:120px;height:120px;background:rgba(255,255,255,.05);border-radius:50%;"></div>
      <div style="position:absolute;bottom:-30px;left:-30px;width:100px;height:100px;background:rgba(255,255,255,.03);border-radius:50%;"></div>
      <div style="position:relative;z-index:1;max-width:800px;">
        <h3 style="margin-top:0;color:#ffffff;font-size:1.1rem;margin-bottom:8px;">Why some features cost credits 🤍</h3>
        <p style="margin:0;font-size:0.95rem;color:rgba(255,255,255,.95);line-height:1.65;">This website is built and funded by a student who knows how hard it is to find reliable, high-quality revision resources. Hosting, content updates, and ongoing support all have real costs. We're keeping subscriptions cheap and straightforward to make revision better and more accessible while keeping the site sustainable.</p>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">📝</div>
          <div>
            <h3>Past papers</h3>
            <p>Read, answer and mark real Pearson papers</p>
          </div>
        </div>
        <div class="feature-cards grid-2">
          <article class="card primary-card">
            <span class="card-tag">Recommended</span>
            <h4>Pearson past papers</h4>
            <p>{papers_card}</p>
            <button class="btn primary" data-goto="papers">Open past papers</button>
          </article>
          <article class="card">
            <h4>Practice by topic</h4>
            <p>Knowledge checks and calculations filtered by aim, marks or question type, with the full mark scheme.</p>
            <button class="btn" data-goto="practice">Start practising<span class="ra10-cost-label">1 credit per question</span></button>
          </article>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">🧠</div>
          <div>
            <h3>Quick Revision</h3>
            <p>Memorise key facts and concepts</p>
          </div>
        </div>
        <div class="feature-cards grid-2">
          <article class="card">
            <h4>Flashcards</h4>
            <p data-fill="flash">{flash_p}</p>
            <button class="btn" data-goto="flash">Open flashcards</button>
          </article>
          <article class="card">
            <h4>Quick-fire quiz</h4>
            <p data-fill="quiz">{quiz_p}</p>
            <button class="btn" data-goto="quiz">Start quiz<span class="ra10-cost-label">1 credit per session</span></button>
          </article>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">📖</div>
          <div>
            <h3>Comprehensive Guide</h3>
            <p>Full topic breakdown with diagrams and examples</p>
          </div>
        </div>
        <div class="feature-cards grid-1">
          <article class="card">
            <h4>Complete revision guide</h4>
            <p>{guide_p} {free} are free; unlock {locked} for 10 credits.</p>
            <button class="btn" data-goto="guide">Open revision guide<span class="ra10-cost-label">10 credits to unlock</span></button>
          </article>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">🔎</div>
          <div>
            <h3>Browse Questions</h3>
            <p>Search every paper question and knowledge check</p>
          </div>
        </div>
        <div class="feature-cards grid-1">
          <article class="card">
            <h4>Full question bank</h4>
            <p>Read every question and full mark scheme. Search and filter all items by aim, topic, command verb, or marks.</p>
            <button class="btn" data-goto="browse">Browse questions</button>
          </article>
        </div>
      </div>
    </div>

    <div class="section-block">
      <div class="section-block-head">
        <span class="sb-eyebrow">Learning Aims Coverage</span>
        <h3>See question distribution</h3>
        <p>All aims covered with question counts. Click any card to focus practice on that aim.</p>
      </div>
      <div class="aim-grid" id="aim-grid"></div>
      <div style="text-align:center;margin-top:18px;">
        <button class="btn" data-goto="spec">View specification breakdown</button>
      </div>
    </div>
  </section>

  <section id="view-questions" class="view">
    <header class="section-head">
      <h2>Questions</h2>
      <p style="font-size:1.15rem;color:var(--accent);font-weight:700;">How do you want to practise? <span style="font-size:1.5em;">📝</span></p>
    </header>
    <div class="dashboard-grid">
      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">📝</div>
          <div>
            <h3>Past papers</h3>
            <p>{format_line}</p>
          </div>
        </div>
        <div class="feature-cards grid-1">
          <article class="card primary-card">
            <span class="card-tag">Recommended</span>
            <h4>Pearson past papers</h4>
            <p>{papers_card2}</p>
            <button class="btn primary" data-goto="papers">Open</button>
          </article>
        </div>
      </div>
      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">🎯</div>
          <div>
            <h3>Practice Mode</h3>
            <p>Answer one question at a time with instant feedback.</p>
          </div>
        </div>
        <div class="feature-cards grid-1">
          <article class="card">
            <h4>Practice by topic</h4>
            <p>Target your weakest areas or focus on specific aims.</p>
            <button class="btn" data-goto="practice">Open</button>
            <p class="card-cost-note">Uses 1 credit per question.</p>
          </article>
        </div>
      </div>
      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">📄</div>
          <div>
            <h3>Mock paper builder</h3>
            <p>Random knowledge-check papers to print or attempt.</p>
          </div>
        </div>
        <div class="feature-cards grid-1">
          <article class="card">
            <h4>Build a mock</h4>
            <p>Pick the aims and styles you want, then generate a paper with a mark scheme.</p>
            <button class="btn" data-goto="mock">Open</button>
          </article>
        </div>
      </div>
      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">🔎</div>
          <div>
            <h3>Browse Questions</h3>
            <p>Search and filter all questions and mark schemes.</p>
          </div>
        </div>
        <div class="feature-cards grid-1">
          <article class="card">
            <h4>Full question browser</h4>
            <p>See every question and mark scheme in the bank.</p>
            <button class="btn" data-goto="browse">Open</button>
          </article>
        </div>
      </div>
    </div>
  </section>

  <section id="view-revise" class="view">
    <header class="section-head">
      <h2>Revise</h2>
      <p style="font-size:1.15rem;color:var(--accent);font-weight:700;">Choose a fun way to revise! <span style="font-size:1.5em;">💡</span></p>
    </header>
    <div class="dashboard-grid">
      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">🃏</div>
          <div>
            <h3>Flashcards</h3>
            <p>Flip through cards for rapid recall.</p>
          </div>
        </div>
        <div class="feature-cards grid-1">
          <article class="card">
            <h4>Open flashcards</h4>
            <p>Definitions, formulae and key facts—track your progress!</p>
            <button class="btn" data-goto="flash">Open</button>
          </article>
        </div>
      </div>
      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">❓</div>
          <div>
            <h3>Quiz</h3>
            <p>Multiple-choice and true/false questions with instant feedback.</p>
          </div>
        </div>
        <div class="feature-cards grid-1">
          <article class="card">
            <h4>Start quiz</h4>
            <p>Test your knowledge and get explanations for every answer.</p>
            <button class="btn" data-goto="quiz">Open</button>
          </article>
        </div>
      </div>
      <div class="feature-section">
        <div class="feature-header">
          <div class="feature-icon">📖</div>
          <div>
            <h3>Revision Guide</h3>
            <p>Full topic-by-topic breakdown with worked examples and diagrams.</p>
          </div>
        </div>
        <div class="feature-cards grid-1">
          <article class="card">
            <h4>Open revision guide</h4>
            <p>{free} are free; unlock {locked} for 10 credits.</p>
            <div class="card-action-row">
              <button class="btn" data-goto="guide">Open</button>
              <button class="btn btn-spec-mini" data-goto="spec">View spec <span style="font-size:1.1em;">📄</span></button>
            </div>
            <p class="card-cost-note">Unlock {locked} for a one-time 10 credits.</p>
          </article>
        </div>
      </div>
    </div>
  </section>

  <section id="view-guide" class="view">
    <div id="guide-comprehensive"></div>
  </section>
'''


def build_loader(u, m):
    return '''// BTEC Business Unit %d data loader — assembles the question bank, quiz and flashcards
// from bank.js (knowledge checks, calculations, quiz, flashcards) and papers-data.js (Pearson / RA10 papers).
const LEARNING_AIMS = window.LEARNING_AIMS;
const SPEC = window.SPEC;
let QUESTIONS = [];
let QUIZ = [];
let FLASHCARDS = [];
let DATA_READY = false;
const DATA_LISTENERS = [];

function onDataReady(cb) {
  if (DATA_READY) cb();
  else DATA_LISTENERS.push(cb);
}

(function loadData() {
  try {
    const B = window.BIZ || {};
    const fromPapers = window.BizPapers ? BizPapers.buildQuestions(window.BIZ_PAPERS || [], window.BIZ_UNIT) : [];
    QUESTIONS = (B.KNOWLEDGE || []).concat(B.CALCS || [], fromPapers);
    QUIZ = (B.QUIZ || []).slice();
    FLASHCARDS = (B.FLASHCARDS || []).slice();
  } catch (err) {
    console.error('Business Unit %d data load failed:', err);
    QUESTIONS = []; QUIZ = []; FLASHCARDS = [];
  }
  DATA_READY = true;
  window.QUESTIONS = QUESTIONS;
  window.QUIZ = QUIZ;
  window.FLASHCARDS = FLASHCARDS;
  window.DATA_READY = DATA_READY;
  window.onDataReady = onDataReady;
  // live counts on the dashboard cards
  try {
    const set = (k, txt) => document.querySelectorAll('[data-fill="' + k + '"]').forEach(e => { e.textContent = txt; });
    set('flash', FLASHCARDS.length + ' cards: ' + document.querySelector('[data-fill="flash"]').textContent);
    set('quiz', QUIZ.length + ' questions. ' + document.querySelector('[data-fill="quiz"]').textContent);
  } catch (e) {}
  DATA_LISTENERS.forEach(function (cb) { cb(); });
})();
''' % (u, u)


def main():
    which = [int(x) for x in sys.argv[1:]] or [2, 3, 6, 7]
    for u in which:
        m = UNITS[u]
        base = os.path.join(OUT, 'unit-%d' % u)
        wr(os.path.join(base, 'js', 'app.js'), build_app(u, m))
        wr(os.path.join(base, 'css', 'style.css'), build_css(u, m))
        wr(os.path.join(base, 'index.html'), build_index(u, m))
        wr(os.path.join(base, 'js', 'data-loader.js'), build_loader(u, m))
        print('built unit', u)

if __name__ == '__main__':
    main()
