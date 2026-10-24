"""Generate the AQA A-level Business (7138, 2026 spec) app shell from the same template as the BTEC Business units.
Run: python build_alevel26.py
Writes index.html, css/style.css, js/app.js, js/data-loader.js into revision/a-level/business-2026/. Hand-written files (cfg, spec, bank, quiz, cards, guide, papers-data) are untouched."""
import io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BTEC_BUILD = os.path.normpath(os.path.join(HERE, '..', '..', 'btec', 'level-3', 'business', 'build'))
sys.path.insert(0, BTEC_BUILD)
sys.dont_write_bytecode = True
import build_units as bu  # noqa: E402

REPO = bu.REPO
OUT = os.path.join(REPO, 'revision', 'a-level', 'business-2026')
U = 9  # dummy unit number used by the BTEC generator

META = dict(code='7138', name='AQA A-level Business (2026 specification)', key='aqa_biz_2026', n=U, aims='A–C', free='the assessment overview and Unit 3.1', locked='Units 3.2 and 3.3', nAims=3,
            accent='#9F1C1C', accent2='#F5D9C8', ink='#5C130F', d2='#4A1F1B', dink='#FFD3BA', grad=('#5c130f', '#9f1c1c', '#e0674a'),
            eyebrow='AQA A-level Business 7138 — new specification, first exam June 2028',
            hero='AQA A-level Business (2026 specification)',
            lede='The new 7138 papers: two case studies per paper, six-, nine- and fifteen-mark questions, the 6-mark quantitative skills rule and sophisticated-concept credit. Sample papers with mark schemes, RA10 practice papers, an AI Examiner calibrated to the new level grids, and a full revision guide with diagrams.',
            papers_card='The three AQA sample papers plus RA10 practice papers in the new format. Read each case study beside your answer, write the 6-, 9- and 15-mark responses online and get each marked by the AI Examiner.',
            format_line='The 7138 format: 3 papers · 2 hours · 90 marks · two case studies with five questions each.',
            papers_card2='AQA sample papers and RA10 practice papers, with a 2-hour timer, a case-study panel and AI Examiner marking on every question.',
            mock_default=45, mock_total='<option value="45" selected>45 (one case study)</option><option value="30">30 (quick test)</option><option value="15">15 (short test)</option>',
            papers_sub='The AQA 7138 sample papers plus RA10 practice papers in the new two-case-study format. Read each paper like the real exam, answer it online for AI Examiner feedback, or download it as a PDF.',
            spec_h='AQA A-level Business (7138) specification', spec_p='The content of Units 3.1, 3.2 and 3.3 mapped to the question bank.',
            footer='AQA A-level Business (7138, new specification first examined June 2028). This is an independent study tool — not an official AQA product.',
            flash_p='Definitions, formulae, models and examiner tips across marketing, finance, people, operations, strategy and change.',
            quiz_p='Multiple-choice and true/false questions with an explanation for every answer.',
            guide_p='Every unit with diagrams, worked examples and the marking-scheme advice that decides the top levels.',
            calc=False)

CSS_LINKS = ('<link rel="stylesheet" href="css/style.css?v=20261102">\n<link rel="stylesheet" href="../shared/aqa-papers.css?v=20261102">\n'
             '<link rel="stylesheet" href="../../btec/level-3/business/shared/biz-guide.css?v=20261102">{calc}')
SH = '../../btec/level-3/business/shared/'
SCRIPTS = ('<script src="js/cfg.js?v=20261102"></script>\n<script src="js/spec.js?v=20261102"></script>\n'
           '<script src="' + SH + 'biz-bank.js?v=20261102"></script>\n<script src="js/bank.js?v=20261102"></script>\n<script src="js/quiz.js?v=20261102"></script>\n<script src="js/cards.js?v=20261102"></script>\n'
           '<script src="js/papers-data.js?v=20261102"></script>\n<script src="../shared/aqa-papers.js?v=20261102"></script>\n'
           '<script src="js/data-loader.js?v=20261102"></script>\n<script src="' + SH + 'biz-guide.js?v=20261102"></script>\n'
           '<script src="js/guide.js?v=20261102"></script>\n{calc}<script src="js/app.js?v=20261102"></script>')

DATA_LOADER = '''// AQA A-level Business (7138, 2026 spec) data loader — assembles the question bank, quiz and flashcards
// from bank.js (knowledge checks and calculations), quiz.js / cards.js and papers-data.js (AQA sample + RA10 papers).
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
    const fromPapers = window.AqaPapers && window.AQA_PAPERS ? AqaPapers.buildQuestions(window.AQA_PAPERS, window.AQA_UNIT) : [];
    QUESTIONS = (B.KNOWLEDGE || []).concat(B.CALCS || [], fromPapers);
    QUIZ = (B.QUIZ || []).slice();
    FLASHCARDS = (B.FLASHCARDS || []).slice();
  } catch (err) {
    console.error('AQA Business 7138 data load failed:', err);
    QUESTIONS = []; QUIZ = []; FLASHCARDS = [];
  }
  DATA_READY = true;
  window.QUESTIONS = QUESTIONS;
  window.QUIZ = QUIZ;
  window.FLASHCARDS = FLASHCARDS;
  window.DATA_READY = DATA_READY;
  window.onDataReady = onDataReady;
  try {
    const set = (k, txt) => document.querySelectorAll('[data-fill="' + k + '"]').forEach(e => { e.textContent = txt; });
    set('flash', FLASHCARDS.length + ' cards: ' + document.querySelector('[data-fill="flash"]').textContent);
    set('quiz', QUIZ.length + ' questions. ' + document.querySelector('[data-fill="quiz"]').textContent);
  } catch (e) {}
  DATA_LISTENERS.forEach(function (cb) { cb(); });
})();
'''


def main():
    bu.CSS_LINKS = CSS_LINKS
    bu.SCRIPTS = SCRIPTS
    app = bu.build_app(U, META)
    app = app.replace('// BTEC Business Unit %d — Question Bank App' % U, '// AQA A-level Business (7138) — Question Bank App')
    app = app.replace("'BTEC Level 3 Business — Unit %d: %s'" % (U, META['name']), "'AQA A-level Business (7138, 2026 specification)'")
    app = app.replace("el('h3', null, 'BTEC Level 3 Business — Unit %d: %s')" % (U, META['name']), "el('h3', null, 'AQA A-level Business (7138, 2026 specification)')")
    app = app.replace('BizPapers.init({ $, el, renderMarkScheme, buildAutoMarkUI, normaliseAiMarkResult, awardXP, getQuestions: () => QUESTIONS })', 'AqaPapers.init({ $, el, renderMarkScheme, awardXP, getQuestions: () => QUESTIONS })')
    app = app.replace('if (!window.BizPapers) return;', 'if (!window.AqaPapers) return;')
    app = app.replace("pearson: 'Pearson past-paper questions'", "aqa: 'AQA sample-paper questions'")
    app = app.replace("q.origin === 'pearson'", "q.origin === 'aqa'")
    app = app.replace("'Pearson ' + q.series", "'AQA ' + q.series")
    app = app.replace('Check out RA10 for BTEC Business revision', 'Check out RA10 for A-level Business revision').replace("label: 'Pearson-style (mixed)'", "label: 'AQA-style (mixed)'").replace('real Pearson distribution', 'real AQA distribution').replace('mirroring the real Pearson booklets', 'mirroring the real AQA booklets')
    left = [m.start() for m in re.finditer('Pearson|BTEC', app)]
    print('app leftovers (Pearson/BTEC):', len(left))
    for pos in left[:12]:
        print('   ', app[max(0, pos - 50):pos + 60].replace('\n', ' '))
    index = bu.build_index(U, META)
    index = index.replace('Business Unit %d' % U, 'AQA A-level Business (7138)').replace('Pearson past papers', 'AQA sample papers').replace('real Pearson papers', 'AQA sample and RA10 papers').replace('Pearson', 'AQA')
    import re as _re
    index = _re.sub(r'\s*<link rel="stylesheet" href="[^"]*unit-ui\.css[^"]*">', '', index)
    index = _re.sub(r'\s*<script src="[^"]*unit-ui\.js[^"]*"></script>', '', index)
    index = index.replace('</head>', '<link rel="stylesheet" href="../../shared/unit-ui.css?v=20261103">' + chr(10) + '</head>', 1)
    k = index.rfind('</body>')
    index = index[:k] + '<script src="../../shared/unit-ui.js?v=20261103"></script>' + chr(10) + index[k:]
    css = bu.build_css(U, META)
    bu.wr(os.path.join(OUT, 'js', 'app.js'), app)
    bu.wr(os.path.join(OUT, 'index.html'), index)
    bu.wr(os.path.join(OUT, 'css', 'style.css'), css)
    bu.wr(os.path.join(OUT, 'js', 'data-loader.js'), DATA_LOADER)
    print('written', OUT)


if __name__ == '__main__':
    main()
