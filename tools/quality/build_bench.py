"""Build AI Examiner benchmark sets from exam-board marked student answers.

    python tools/quality/build_bench.py

A benchmark item is a real student answer that an official examiner has already marked. The owner's
Quality dashboard (/admin/quality/) sends each answer to the live AI Examiner and compares the AI's mark
with the examiner's, so we can measure (not guess) how accurate the AI Examiner is for each subject.

Sources so far
  • AQA A-level Business 7132 — "Answers and commentaries" for the June 2022 papers 1, 2 and 3
    (training-data/a-level/aqa-business-2023/text/AQA_A-Level_Business_Answers_and_Commentary_Combined.txt)

Output: admin/quality/bench/<set>.json
  { set, unit, title, source, items: [ { id, paper_id, q, marks, examiner_mark, level, answer, words } ] }
The dashboard rebuilds the exact question object the app would send (case study, mark scheme, levels)
from the unit's own papers via AqaPapers.buildQuestions, so the AI sees what it sees for a real learner.

Every item is checked against the real paper (question exists, tariff matches, mark within range).
Items that fail a check are reported and left out — never guessed.
Add a new source by writing a parser that returns the same item shape and calling write_set().
"""
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(REPO, 'admin', 'quality', 'bench')

PAGE_NOISE = re.compile(r'^(=====PAGE \d+|A-LEVEL BUSINESS\s+–\s+7132\s+–\s+PAPER \d ANSWERS AND COMMENTARIES|©\s*\d{4} AQA\b.*)\s*$')
RESP = re.compile(r'^Student response (\d+)\b')
LEVEL = re.compile(r'^This is a Level (\d+) response')
MARK = re.compile(r'^\s*(\d{1,2}) marks?\s*$')
QHEAD = re.compile(r'^(?:Section [A-C]\s*[–-]\s*)?Question (\d+(?:\.\d+)?)(?:\s+or\s+(\d+))?\s*$')
PAPER_COVER = re.compile(r'^Answers and commentaries Paper (\d) (\d{4})')


def load_aqa_papers():
    p = os.path.join(REPO, 'revision', 'a-level', 'business-2023', 'js', 'papers-data.js')
    s = io.open(p, encoding='utf-8').read()
    a = s.index('window.AQA_PAPERS = ') + len('window.AQA_PAPERS = ')
    papers = json.JSONDecoder().raw_decode(s[a:])[0]
    return {p['id']: p for p in papers}


def norm_q(paper, q):
    """Commentary numbering → papers-data numbering (P1: '19'; P2: '01.4'; P3: '01')."""
    main, _, sub = q.partition('.')
    if paper == 1:
        return main
    return main.zfill(2) + ('.' + sub if sub else '')


def parse_aqa_commentary(path):
    lines = [l.rstrip() for l in io.open(path, encoding='utf-8')]
    # 1. split into question segments: (paper, year, q, [lines])
    segs, paper, year, cur = [], None, None, None
    essay_note = None
    for ln in lines:
        m = PAPER_COVER.match(ln.strip())
        if m:
            paper, year = int(m.group(1)), m.group(2)
            continue
        if PAGE_NOISE.match(ln.strip()):
            continue
        m = QHEAD.match(ln.strip())
        if m and paper:
            q = m.group(1)
            if m.group(2):   # "Question 22 or 23": the note below says which one the answers are for
                essay_note = (m.group(1), m.group(2))
            cur = {'paper': paper, 'year': year, 'q': q, 'lines': []}
            segs.append(cur)
            continue
        if cur is not None:
            cur['lines'].append(ln)
    # 2. within a segment: responses (in order) and commentaries (in order) → pair by position
    items, problems = [], []
    for sg in segs:
        body = sg['lines']
        if essay_note and sg['q'] == essay_note[0]:
            txt = ' '.join(body[:12])
            m = re.search(r'were all in response to Q(\d+)', txt)
            if m:
                sg['q'] = m.group(1)
        resps, comms, mode, buf = [], [], None, []

        def flush():
            if mode == 'resp':
                resps.append(buf[:])
            elif mode == 'comm':
                comms.append(buf[:])

        for ln in body:
            s = ln.strip()
            if RESP.match(s):
                flush(); mode, buf = 'resp', []
                continue
            m = LEVEL.match(s)
            if m:
                flush(); mode, buf = 'comm', [s]
                continue
            if mode == 'comm' and MARK.match(s):
                buf.append(s); flush(); mode, buf = None, []
                continue
            if mode:
                buf.append(ln)
        flush()
        if len(resps) != len(comms):
            problems.append('P%d Q%s: %d responses but %d commentaries – skipped' % (sg['paper'], sg['q'], len(resps), len(comms)))
            continue
        for r, c in zip(resps, comms):
            mk = MARK.match(c[-1].strip()) if c else None
            lv = LEVEL.match(c[0].strip()) if c else None
            answer = clean_answer(r)
            if not mk or not answer:
                problems.append('P%d Q%s: unreadable response/commentary – skipped' % (sg['paper'], sg['q']))
                continue
            items.append({'paper': sg['paper'], 'year': sg['year'], 'q': sg['q'], 'examiner_mark': int(mk.group(1)),
                          'level': int(lv.group(1)) if lv else None, 'answer': answer})
    return items, problems


def clean_answer(lines):
    out = []
    for ln in lines:
        s = ln.strip()
        if not s or PAGE_NOISE.match(s) or re.match(r'^Student responses?\s*$', s):
            if out and out[-1] != '':
                out.append('')
            continue
        out.append(s)
    text = '\n'.join(out).strip()
    # join hard-wrapped lines inside paragraphs
    paras = [re.sub(r'\s*\n\s*', ' ', p).strip() for p in re.split(r'\n\s*\n', text)]
    return '\n\n'.join(p for p in paras if p)


def write_set(name, unit, title, source, items):
    os.makedirs(OUT, exist_ok=True)
    data = {'set': name, 'unit': unit, 'title': title, 'source': source, 'built': 'tools/quality/build_bench.py', 'items': items}
    p = os.path.join(OUT, name + '.json')
    io.open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(data, ensure_ascii=False, indent=1) + '\n')
    print('wrote %s (%d items)' % (os.path.relpath(p, REPO), len(items)))
    write_index()


def write_index():
    """admin/quality/bench/index.json lists every set (the dashboard reads it)."""
    sets = []
    for f in sorted(os.listdir(OUT)):
        if f.endswith('.json') and f != 'index.json':
            d = json.load(io.open(os.path.join(OUT, f), encoding='utf-8'))
            sets.append({'set': d['set'], 'unit': d['unit'], 'title': d['title'], 'source': d['source'], 'items': len(d['items'])})
    io.open(os.path.join(OUT, 'index.json'), 'w', encoding='utf-8', newline='\n').write(json.dumps({'sets': sets}, ensure_ascii=False, indent=1) + '\n')


def build_aqa_business_7132():
    src = os.path.join(REPO, 'training-data', 'a-level', 'aqa-business-2023', 'text', 'AQA_A-Level_Business_Answers_and_Commentary_Combined.txt')
    raw, problems = parse_aqa_commentary(src)
    papers = load_aqa_papers()
    items, n = [], {}
    for it in raw:
        pid = 'aqa-%s-p%d' % (it['year'], it['paper'])
        qn = norm_q(it['paper'], it['q'])
        p = papers.get(pid)
        pi = next((x for x in (p or {}).get('items', []) if x['q'] == qn), None)
        if not pi:
            problems.append('%s Q%s: not found in papers-data – skipped' % (pid, qn)); continue
        if not (0 <= it['examiner_mark'] <= pi['marks']):
            problems.append('%s Q%s: mark %d outside 0–%d – skipped' % (pid, qn, it['examiner_mark'], pi['marks'])); continue
        if len(it['answer'].split()) < 25:
            problems.append('%s Q%s: answer under 25 words (likely an extraction gap) – skipped' % (pid, qn)); continue
        key = (pid, qn); n[key] = n.get(key, 0) + 1
        items.append({'id': '%s-Q%s-r%d' % (pid, qn.replace('.', ''), n[key]), 'paper_id': pid, 'q': qn, 'marks': pi['marks'],
                      'examiner_mark': it['examiner_mark'], 'level': it['level'], 'words': len(it['answer'].split()), 'answer': it['answer']})
    for pr in problems:
        print('  ! ' + pr)
    write_set('aqa-business-7132', '/revision/a-level/business-2023', 'AQA A-level Business (7132)',
              'AQA “Answers and commentaries”, June 2022 Papers 1–3 (marked by AQA senior examiners)', items)
    return items


if __name__ == '__main__':
    its = build_aqa_business_7132()
    by = {}
    for it in its:
        by.setdefault(it['paper_id'] + ' Q' + it['q'] + ' /' + str(it['marks']), []).append(it['examiner_mark'])
    for k in sorted(by):
        print('  %-26s examiner marks %s' % (k, by[k]))
