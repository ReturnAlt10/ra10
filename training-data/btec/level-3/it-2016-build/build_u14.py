"""Build BTEC Nationals IT (2016 spec, 20161K) Unit 14: IT Service Delivery.

    python build_u14.py            # papers-data.js + the generated app shell
    python build_u14.py --check    # print the extracted activity wording only

Writes into revision/btec/level-3/IT-2016/unit-14/:
  js/papers-data.js   Pearson set tasks (u14_series.py + activity wording extracted from each paper) and RA10 practice tasks (u14_ra10.py)
  index.html, css/style.css, js/app.js, js/data-loader.js
                      generated from the BTEC Business Unit 7 app (same shared engine: business/shared/biz-*.js)
Hand-written (never overwritten): js/cfg.js, js/spec.js, js/bank.js, js/quiz.js, js/cards.js, js/guide.js, js/papers-figures.js

Source text: ../information-technology (outgoing)/text/*.txt (git-ignored; Pearson copyright).
"""
import glob, io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
SRC = os.path.join(HERE, '..', 'information-technology (outgoing)', 'text')
OUT = os.path.join(REPO, 'revision', 'btec', 'level-3', 'IT-2016', 'unit-14')
BASE = os.path.join(REPO, 'revision', 'btec', 'level-3', 'business', 'unit-7')
sys.path.insert(0, HERE)
from u14_series import SERIES  # noqa: E402
from u14_ra10 import RA10  # noqa: E402

MARKS = {1: 8, 2: 8, 3: 20, 4: 12, 5: 16}
KINDS = {1: 'strategy', 2: 'catalogue', 3: 'solution', 4: 'evaluation', 5: 'implications'}
TITLES = {1: 'Outline IT service strategy', 2: 'IT service catalogue', 3: 'IT service delivery solution',
          4: 'Management report evaluating the solution', 5: 'IT service management implications report'}
NOISE = re.compile(r'^(=====PAGE.*|[WP]\d{5}A|Turn over|\d{1,2}|BLANK PAGE)$')
DROP = re.compile(r'^(Save your completed|activity\d[a-z]+_|first name\]|You are advised to spend|\(Total for Activity|TOTAL FOR)', re.I)
BULLET = re.compile(r'^[•�●·­]\s*')


def rd(p):
    b = io.open(p, 'rb').read()
    try:
        s = b.decode('utf-8')
    except UnicodeDecodeError:
        s = b.decode('cp1252', errors='replace')   # pdftotext -layout output on this machine
    return s.replace('\r\n', '\n')


def wr(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)


def tidy(s):
    s = s.replace('`', '’').replace("'", '’').replace('’', '’')
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'\[Registration number ?#\]', '[Registration number #]', s)
    return s


def activities_from(path):
    """Pull the wording of Activities 1–5 from a Part B text file (the LAST occurrence: the set task itself)."""
    t = rd(path)
    start = t.rfind('Part B Set Task')
    if start < 0:
        raise SystemExit('Part B Set Task not found in ' + path)
    t = t[start:]
    acts = []
    for n in range(1, 6):
        a = re.search(r'Activity %d\s*:\s*%s' % (n, re.escape(TITLES[n].split()[0])), t)
        b = re.search(r'\(Total for Activity %d\s*=' % n, t)
        if not a or not b or b.start() < a.end():
            raise SystemExit('Activity %d not found in %s' % (n, path))
        body = t[a.end():b.start()]
        body = body.split('\n', 1)[1] if '\n' in body else ''      # drop the rest of the heading line
        out, cur, skipping = [], None, False
        for raw in body.split('\n'):
            ln = raw.strip()
            if not ln or NOISE.match(ln):
                continue
            if DROP.match(ln):
                skipping = bool(re.match(r'^(Save your completed|activity\d)', ln, re.I))
                if cur is not None:
                    out.append(cur); cur = None
                continue
            if skipping and (ln.startswith('[') or re.match(r'^(first|name\]|letter)', ln, re.I) or 'Registration number' in ln):
                continue
            skipping = False
            is_b = bool(BULLET.match(ln)) or ln in ('•', '�', '·')
            ln = BULLET.sub('', ln)
            if is_b:
                if cur is not None:
                    out.append(cur)
                cur = '• ' + ln if ln else '• '
            elif cur is not None and (cur.startswith('• ') and (cur == '• ' or not re.search(r'[.:]$', cur)) and not re.match(r'^(Your|It should|Think about|You should|Produce|Analyse|Use the)', ln)):
                cur = cur + ' ' + ln if cur != '• ' else '• ' + ln
            elif cur is not None and not cur.startswith('• ') and not re.search(r'[.:]$', cur) and not re.match(r'^(Your|It should|Think about|You should|Produce|Analyse|Use the)', ln):
                cur += ' ' + ln
            else:
                if cur is not None:
                    out.append(cur)
                cur = ln
        if cur is not None:
            out.append(cur)
        text = '\n'.join(tidy(x) if not x.startswith('• ') else '• ' + tidy(x[2:]) for x in out if tidy(x) not in ('', '•'))
        acts.append(dict(n=n, marks=MARKS[n], kind=KINDS[n], text=text))
    return acts


def build_papers(check=False):
    papers = []
    for s in SERIES:
        files = glob.glob(os.path.join(SRC, s['src']))
        if len(files) != 1:
            raise SystemExit('source for %s: %r' % (s['id'], files))
        acts = activities_from(files[0])
        if check:
            print('=====', s['id'], s['series'])
            for a in acts:
                print('--- Activity %d (%d)\n%s' % (a['n'], a['marks'], a['text']))
            continue
        papers.append(dict(id=s['id'], unit=14, key=s['key'], series=s['series'], title=s['title'], theme=s['sector'],
                           source='pearson', kind='set', code='20161K', total=68, acts=acts, partA=s['partA'], partB=s['partB']))
    if check:
        return
    for r in RA10:
        papers.append(dict(id=r['id'], unit=14, key=r['key'], series=r['series'], title=r['title'], theme=r['sector'],
                           source='ra10', kind='set', code='20161K', total=68, acts=r['acts'], partA=r['partA'], partB=r['partB'],
                           legal='RA10 practice set task written in the Pearson Unit 14 format. The organisation is fictional.'))
    for p in papers:
        assert sum(a['marks'] for a in p['acts']) == 64 and p['total'] == 68, p['id']
        assert [a['n'] for a in p['acts']] == [1, 2, 3, 4, 5], p['id']
    js = ('/* BTEC Nationals IT (2016 spec, 20161K) Unit 14: IT Service Delivery — Pearson set tasks (© Pearson Education Ltd, reformatted by RA10 for revision) '
          'and RA10 practice set tasks (fictional organisations). Generated by training-data/btec/level-3/it-2016-build/build_u14.py — do not edit by hand. */\n'
          'window.BIZ_PAPERS = ' + json.dumps(papers, ensure_ascii=False, separators=(',', ':')) + ';\n')
    wr(os.path.join(OUT, 'js', 'papers-data.js'), js)
    print('papers-data.js:', len(papers), 'set tasks (%d Pearson, %d RA10)' % (len(SERIES), len(RA10)), len(js), 'bytes')


if __name__ == '__main__':
    if '--check' in sys.argv:
        build_papers(check=True)
    else:
        build_papers()
        import build_u14_shell
        build_u14_shell.build(BASE, OUT)
