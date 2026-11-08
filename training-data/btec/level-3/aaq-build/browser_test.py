"""Browser smoke test for the AAQ unit apps (Playwright + Chrome).

  python -m http.server 5500 --bind 127.0.0.1      (run from the repo root, in another terminal)
  python browser_test.py                           every unit of every subject
  python browser_test.py computing-aaq             every unit of one subject
  python browser_test.py computing-aaq 3           one unit
  python browser_test.py computing-aaq 3 --shots C:/tmp/shots    also save screenshots

For each unit it opens the app, visits dashboard → guide → papers (exam) or assignment guide (coursework) →
flashcards → quiz → practice, then reloads at phone width (390 px). A unit FAILS if there is any page error or
console error, if the guide has no diagrams, if an exam unit shows fewer than 7 paper cards (1 Pearson + 6 RA10),
or if the phone layout scrolls sideways. Exit code = number of failed units.
"""
import io, json, os, sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = 'http://127.0.0.1:5500/revision/btec/level-3/%s/unit-%d/index.html'
SLUGS = ['computing-aaq', 'construction-aaq', 'early-childhood-development-aaq', 'engineering-aaq',
         'health-and-social-care-aaq', 'medical-science-aaq']


def units_for(slug):
    return [u['n'] for u in json.load(io.open(os.path.join(HERE, 'out', slug + '.spec.json'), encoding='utf-8'))]


def test_unit(b, slug, n, shots):
    url = BASE % (slug, n)
    errs = []
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.on('console', lambda m: errs.append('console: ' + m.text[:200])
          if m.type == 'error' and 'supabase' not in m.text.lower() and 'Failed to load resource' not in m.text else None)
    pg.goto(url, wait_until='load')
    pg.wait_for_function('window.RA10UnitUI && window.QUESTIONS', timeout=15000)
    pg.wait_for_timeout(800)

    def shot(page, tag):
        if shots:
            page.screenshot(path=os.path.join(shots, '%s-u%d-%s.png' % (slug, n, tag)))

    shot(pg, 'dash')
    exam = pg.evaluate("!!(window.BIZ_UNIT && BIZ_UNIT.kind === 'exam')")
    pg.evaluate("RA10UnitUI.go('guide')"); pg.wait_for_timeout(1200); shot(pg, 'guide')
    svgs = pg.evaluate("document.querySelectorAll('#view-guide svg').length")
    cards = 0
    if exam:
        pg.evaluate("RA10UnitUI.go('papers')"); pg.wait_for_timeout(1000)
        shown = pg.locator('#papers-host .pp-card').count(); shot(pg, 'papers')
        # the library opens on the Pearson tab; count every paper loaded (Pearson + RA10)
        cards = pg.evaluate("(window.BIZ_PAPERS || []).length") if shown else 0
    else:
        pg.evaluate("RA10UnitUI.go('assignment')"); pg.wait_for_timeout(800); shot(pg, 'assignment')
    for view in ('flash', 'quiz', 'practice'):
        pg.evaluate("RA10UnitUI.go('%s')" % view); pg.wait_for_timeout(600)
    shot(pg, 'practice')
    qs = pg.evaluate('QUESTIONS.length')
    pg.close()

    m = b.new_page(viewport={'width': 390, 'height': 844})
    m.goto(url, wait_until='load')
    m.wait_for_function('window.RA10UnitUI', timeout=15000)
    m.evaluate("RA10UnitUI.go('guide')"); m.wait_for_timeout(1000)
    sw = m.evaluate('document.documentElement.scrollWidth'); shot(m, 'phone-guide')
    m.close()

    problems = list(errs)
    if svgs < 1:
        problems.append('guide has no diagrams')
    if exam and cards < 7:
        problems.append('only %d paper cards' % cards)
    if sw > 390:
        problems.append('phone layout scrolls sideways (%dpx)' % sw)
    print('%-34s unit %d  %-10s svgs=%-3d papers=%-2d Q=%-3d phone=%dpx  %s' % (
        slug, n, 'exam' if exam else 'assignment', svgs, cards, qs, sw, 'OK' if not problems else 'FAIL: ' + ' | '.join(problems[:4])))
    return not problems


def main(argv):
    shots = None
    if '--shots' in argv:
        i = argv.index('--shots'); shots = argv[i + 1]; del argv[i:i + 2]
        os.makedirs(shots, exist_ok=True)
    slugs = [a for a in argv if not a.isdigit()] or SLUGS
    nums = [int(a) for a in argv if a.isdigit()]
    failed = 0
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome')
        for slug in slugs:
            for n in units_for(slug):
                if nums and n not in nums:
                    continue
                try:
                    ok = test_unit(b, slug, n, shots)
                except Exception as e:  # a crash in one unit should not hide the others
                    print('%-34s unit %d  FAIL: %s' % (slug, n, str(e).splitlines()[0][:160])); ok = False
                failed += 0 if ok else 1
        b.close()
    print('\n%d unit(s) failed' % failed if failed else '\nall units passed')
    return failed


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
