"""Generate the IT Unit 14 (2016 Nationals) app shell from the BTEC Business Unit 7 app.

Both are Pearson 2016-generation set-task units on the same shared engine (revision/btec/level-3/business/shared/).
Only these generated files are written: index.html, css/style.css, js/app.js, js/data-loader.js.
Every replacement must match exactly once or more (must_replace), so an upstream change fails loudly instead of
silently producing a half-Business page.
"""
import io, os, re

ACCENT, ACCENT2, INK, D2, DINK = '#4338CA', '#E0E7FF', '#312E81', '#1E1B4B', '#C7D2FE'
GRAD = ('#1e1b4b', '#4338ca', '#818cf8')
V = '20261115'
QUAL = 'BTEC Nationals IT (2016 specification, 20161K) — not the AAQ'


def rd(p):
    return io.open(p, encoding='utf-8', newline='').read().replace('\r\n', '\n')


def wr(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)


def must(s, old, new, label, regex=False, count=0):
    if regex:
        s2, n = re.subn(old, new, s, count=count, flags=re.S)
    else:
        n = s.count(old)
        s2 = s.replace(old, new) if not count else s.replace(old, new, count)
    if not n:
        raise SystemExit('PATCH FAILED (%s): %r' % (label, old[:80]))
    return s2


def build_index(base):
    s = rd(os.path.join(base, 'index.html'))
    s = must(s, '<title>BTEC Business Unit 7 — Business Decision Making</title>', '<title>BTEC IT Unit 14 (2016 spec) — IT Service Delivery</title>', 'title')
    # shared engine lives in business/shared; the page-root shared/ (unit-ui) is the same depth, so only bare ../shared/ moves
    s = must(s, r'(?<!\.\./)\.\./shared/', '../../business/shared/', 'shared paths', regex=True)
    # no finance calculator in Unit 14
    s = must(s, '<link rel="stylesheet" href="../../business/shared/biz-calc.css?v=20261101">\n', '', 'calc css')
    s = must(s, '    <button class="tab" data-tab="calculator" data-tip="Break-even, cash flow, ratios and depreciation">Calculator</button>\n', '', 'calc tab')
    s = must(s, r'\s*<!-- FINANCE CALCULATOR -->\s*<section id="view-calculator".*?</section>', '', 'calc view', regex=True)
    s = must(s, '<script src="../../business/shared/calculator.js?v=20261101"></script>\n', '', 'calc js')
    # credits banner / chip / subject
    s = s.replace('Usable now on Business Unit 7: ', 'Usable now on IT Unit 14: ')
    s = must(s, 'Includes your Business subject credits and universal credits.', 'Includes your IT subject credits and universal credits.', 'banner')
    s = must(s, "const RA10_UNIT_SUBJECT = 'Business';", "const RA10_UNIT_SUBJECT = 'IT';", 'subject')
    s = must(s, 'unit7-bus-credit-chip', 'unit14-it16-credit-chip', 'chip')
    # colours + favicon
    s = must(s, '%23C2410C', '%23' + ACCENT.lstrip('#'), 'favicon colour')
    s = must(s, "font-size='18' fill='%23E8F1EE'%3EU7%3C/text%3E", "font-size='13' fill='%23E8F1EE'%3EU14%3C/text%3E", 'favicon text')
    s = must(s, 'border-color: #C2410C;', 'border-color: %s;' % ACCENT, 'special tab')
    s = must(s, 'linear-gradient(130deg, #7c2d12 0%, #c2410c 58%, #fb923c 100%)', 'linear-gradient(130deg, %s 0%%, %s 58%%, %s 100%%)' % GRAD, 'hero gradient')
    s = must(s, 'border-left: 4px solid #C2410C;', 'border-left: 4px solid %s;' % ACCENT, 'border left')
    s = must(s, 'linear-gradient(135deg,#9A3412 0%,#C2410C 58%,#FFEDD5 100%)', 'linear-gradient(135deg,%s 0%%,%s 58%%,%s 100%%)' % (INK, ACCENT, ACCENT2), 'credits block')
    # hero + copy
    s = must(s, '<p class="eyebrow">Pearson BTEC Level 3 Business — External Set Task (Part S)</p>', '<p class="eyebrow">%s — External set task</p>' % QUAL, 'eyebrow')
    s = must(s, '<h2>Unit 7 Business Decision Making</h2>', '<h2>Unit 14 IT Service Delivery</h2>', 'hero h2')
    s = must(s, r'<p class="lede">Every Pearson Unit 7 Part S task.*?</p>',
             '<p class="lede">For the <strong>2016 BTEC Nationals Extended Diploma in IT</strong> (not the new AAQ). Every published Pearson Unit 14 set task — the Part A research brief and all five Part B activities — '
             'an AI Examiner that marks each activity against the Pearson band grids, and a full revision guide to the IT service life cycle, service catalogues, solution design, evaluation and service-management implications.</p>', 'lede', regex=True)
    s = must(s, r'<p>All 12 published Part S tasks \(January 2018 – June 2024\).*?</p>',
             '<p>Nine Pearson set tasks (June 2018 – June 2024) plus RA10 practice tasks. Write all five activities online (strategy, catalogue, solution, evaluation, implications) and get each one marked by the AI Examiner.</p>', 'papers card', regex=True)
    s = must(s, '<p>Knowledge checks and calculations filtered by aim, marks or question type, with the full mark scheme.</p>',
             '<p>Knowledge checks filtered by content area, marks or command word, with the full mark scheme.</p>', 'practice card')
    s = must(s, '<p data-fill="flash">Decision tools, formulae, risk terms and the structure of a top-band report and presentation.</p>',
             '<p data-fill="flash">The IT service life cycle, service catalogue terms, hardware, software, data and legislation, and what each activity needs for the top band.</p>', 'flash card')
    s = must(s, r'<p>Every content area with worked financial analysis, tool templates and the examiner-report advice that decides the top bands\..*?</p>',
             '<p>Every content area (A–D) with diagrams, worked examples for a real-style scenario and the Lead Examiner advice that decides the top bands. The set-task overview and Aim A are free; unlock Aims B–D for 10 credits.</p>', 'guide card', regex=True)
    s = must(s, r'<p>The real Unit 7 format:.*?</p>', '<p>The real Unit 14 format: 3 hours of Part A research, then five Part B activities in 8 supervised hours — 68 marks.</p>', 'format line', regex=True)
    s = must(s, '<p>Pearson Part S tasks and RA10 practice tasks, with a 3-hour timer, a slide builder with speaker notes and AI Examiner marking.</p>',
             '<p>Pearson set tasks and RA10 practice tasks with the Part A and Part B briefs, an 8-hour timer, template prompts for each activity and AI Examiner marking.</p>', 'papers card 2')
    s = must(s, r'<p>Every Pearson Unit 7 Part S task \(31589H\).*?</p>',
             '<p>Every published Pearson Unit 14 set task (20161K, June 2018 to June 2024) plus RA10 practice tasks for the <strong>2016 BTEC Nationals IT</strong>. Read each paper like the real exam, answer it online for AI Examiner feedback, or download it as a PDF.</p>', 'papers sub', regex=True)
    s = must(s, '<h2>Business Unit 7 specification</h2>', '<h2>IT Unit 14 specification (2016 Nationals)</h2>', 'spec h2')
    s = must(s, '<p>The Unit 7 content, content area by content area, mapped to the question bank.</p>',
             '<p>The Unit 14 essential content (A–D) from the Pearson BTEC Nationals IT specification (2016), mapped to the question bank. This is not the AAQ IT specification.</p>', 'spec p')
    s = must(s, r'<p>BTEC Level 3 Business Unit 7 \(Business Decision Making, 31589H\)[^<]*</p>',
             '<p>BTEC Level 3 Nationals Extended Diploma in Information Technology (2016 specification, 20161K) — Unit 14: IT Service Delivery — Pearson. Not the AAQ IT qualification. This is a study tool — not an official Pearson product.</p>', 'footer', regex=True)
    # scripts: own versions, add the figure file before the shared paper engine
    s = must(s, r'<script src="js/cfg\.js\?v=\w+"></script>', '<script src="js/cfg.js?v=%s"></script>' % V, 'cfg v', regex=True)
    for f in ('spec', 'bank', 'quiz', 'cards', 'data-loader', 'guide'):
        s = must(s, r'<script src="js/%s\.js\?v=\w+"></script>' % f, '<script src="js/%s.js?v=%s"></script>' % (f, V), f + ' v', regex=True)
    s = must(s, r'<script src="js/papers-data\.js\?v=\w+"></script>', '<script src="js/papers-data.js?v=%s"></script>\n<script src="js/papers-figures.js?v=%s"></script>' % (V, V), 'papers v', regex=True)
    s = must(s, r'<script src="js/app\.js\?v=\w+"></script>', '<script src="js/app.js?v=%s"></script>' % V, 'app v', regex=True)
    s = must(s, r'<link rel="stylesheet" href="css/style\.css\?v=\w+">', '<link rel="stylesheet" href="css/style.css?v=%s">' % V, 'css v', regex=True)
    for bad in ('Business Unit 7', 'Decision Making', '31589H', 'Part S', 'calculator'):
        if bad in s:
            i = s.index(bad)
            raise SystemExit('leftover %r: %s' % (bad, s[max(0, i - 60):i + 60].replace('\n', ' ')))
    return s


def build_app(base):
    s = rd(os.path.join(base, 'js', 'app.js'))
    s = must(s, '// BTEC Business Unit 7 — Question Bank App', '// BTEC Nationals IT (2016 spec) Unit 14 — Question Bank App (generated by training-data/btec/level-3/it-2016-build/build_u14_shell.py)', 'header')
    s = must(s, 'bus_u7', 'it16_u14', 'storage keys')
    s = must(s, 'Check out RA10 for BTEC Business revision', 'Check out RA10 for BTEC IT revision', 'share')
    s = must(s, 'Business one-time subject plan gives full guide access for Business', 'IT one-time subject plan gives full guide access for IT', 'plan text')
    s = must(s, 'The Business question bank failed to initialise.', 'The IT Unit 14 question bank failed to initialise.', 'no questions')
    s = must(s, "'BTEC Level 3 Business — Unit 7: Business Decision Making'", "'BTEC Nationals IT (2016) — Unit 14: IT Service Delivery'", 'mock title')
    s = must(s, 'Aims B-H are locked', 'Aims B-D are locked', 'locked text')
    for bad in ('Business', 'bus_u7'):
        if bad in s:
            i = s.index(bad)
            raise SystemExit('app leftover %r: %s' % (bad, s[max(0, i - 60):i + 60].replace('\n', ' ')))
    return s


def build_css(base):
    s = rd(os.path.join(base, 'css', 'style.css'))
    s = must(s, '/* BTEC Business Unit 7 — Tool styles */', '/* BTEC Nationals IT (2016) Unit 14 — Tool styles (generated by build_u14_shell.py) */', 'css header')
    s = must(s, '--accent: #C2410C;', '--accent: %s;' % ACCENT, 'accent')
    s = must(s, '--accent-2: #FFEDD5;\n  --accent-ink: #9A3412;', '--accent-2: %s;\n  --accent-ink: %s;' % (ACCENT2, INK), 'accent 2')
    s = must(s, '--accent-2: #431407;\n  --accent-ink: #FED7AA;', '--accent-2: %s;\n  --accent-ink: %s;' % (D2, DINK), 'accent dark')
    # Unit 14 briefs put text (staff duties, premises) in tables: left-align them; org charts get breathing space.
    s += ('\n/* Unit 14: text tables in the set-task briefs */\n'
          '.pp-data td { text-align: left; vertical-align: top; }\n'
          '.u14-org svg + svg { margin-top: 14px; }\n')
    return s


def build_loader(base):
    s = rd(os.path.join(base, 'js', 'data-loader.js'))
    s = must(s, '// BTEC Business Unit 7 data loader', '// BTEC Nationals IT (2016) Unit 14 data loader (generated by build_u14_shell.py)', 'loader header')
    s = must(s, "console.error('Business Unit 7 data load failed:', err);", "console.error('IT Unit 14 data load failed:', err);", 'loader error')
    return s


def build(base, out):
    files = {'index.html': build_index(base), os.path.join('js', 'app.js'): build_app(base),
             os.path.join('css', 'style.css'): build_css(base), os.path.join('js', 'data-loader.js'): build_loader(base)}
    for rel, s in files.items():
        wr(os.path.join(out, rel), s)
        print('wrote', rel, len(s), 'bytes')
