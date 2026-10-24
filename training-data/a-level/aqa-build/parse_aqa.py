"""Parse extracted AQA 7132 question papers + mark schemes into structured JSON.

Input : training-data/a-level/aqa-business-2023/text/papers/{year}-P{n}-{QP|MS}.txt
Output: training-data/a-level/aqa-build/out/{year}-P{n}.json   (gitignored source text stays in aqa-business-2023/)

Item shape: {q:'01.2', main:1, sub:2|None, section:'A'|'B'|'C'|'D'|None, marks:n, text:str,
             options:[(letter,text)]|None, stem:[lines], fig:bool, ms:{raw:[lines], ao:str, answer:str}}
"""
import re, json, os, sys, io

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, '..', 'aqa-business-2023', 'text', 'papers'))
OUT = os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)

NOISE = [
    r'^\s*Do not write\s*$', r'^\s*outside the\s*$', r'^\s*box\s*$', r'^\s*Turn over\s*►?\s*$', r'^\s*IB/G/.*$', r'^\s*\*[^*]*\*\s*$',
    r'^\s*Extra space\s*$', r'^\s*END\s+OF\s+(QUESTIONS|SOURCE)\s*$', r'^\s*Answer\s*$', r'^\s*Working\s*$',
    r'^\s*There (is|are) no (material|questions) printed.*$', r'^\s*DO\s+NOT\s+WRITE.*$', r'^\s*ANSWER\s+IN\s+THE.*$',
    r'^\s*Copyright.*$', r'^\s*\d{1,2}\s*$', r'^\s*Question\s+\d\s*\d\s+Question.*$', r'^\s*CORRECT METHOD.*$', r'^\s*WRONG METHODS.*$',
    r'^\s*Section [A-D]\s*$', r'^\s*Additional page.*$', r'^\s*Write the question numbers.*$', r'^\s*number\s*$', r'^\s*Question\s*$',
    r'^\s*Shade the lozenge.*$', r'^\s*Answer (either|all|one).*$',
]
NOISE_RE = [re.compile(p, re.I) for p in NOISE]


def clean_lines(text, keep_numbers=False):
    out = []
    for ln in text.replace(' ', ' ').split('\n'):
        s = ln.rstrip()
        if not s.strip():
            continue
        if s.startswith('=====PAGE'):
            continue
        bad = False
        for r in NOISE_RE:
            if r.match(s):
                # keep pure numbers when they are part of a table (heuristic: handled later) – simple pure page numbers dropped
                bad = True
                break
        if bad:
            continue
        out.append(s.strip())
    return out


HDR = re.compile(r'^(\d) (\d)\s*$')
SUBL = re.compile(r'^\.\s*(\d)(?:\s+(\S.*))?$')
HDR_FULL = re.compile(r'^(\d) (\d)\s*\.\s*(\d)\s*$')
MARKS = re.compile(r'\[\s*(\d+)\s*marks?\s*\]', re.I)
OPT = re.compile(r'^([A-D])\s{1,3}(\S.*)$')


def parse_qp(path):
    raw = open(path, encoding='utf-8').read()
    lines = clean_lines(raw)
    # locate headers
    marks_at = []
    items = []
    cur = None
    i = 0
    heads = []  # (index, main, sub, startline)
    lastmain = 0
    START = "A-Za-z‘“\"'("
    INL = re.compile(r'^(\d) (\d)(?:\s*\.\s*(\d))?(?:\s+([' + START + r'].*))?$')
    while i < len(lines):
        ln = lines[i]
        m = INL.match(ln)
        if m:
            main = int(m.group(1) + m.group(2))
            rest = m.group(4)
            if 1 <= main <= 30 and main >= lastmain and (rest is None or re.match('^[' + START + ']{2}', rest)) and not (rest and re.match(r'^(and|or|to|of)\b', rest)):
                sub = int(m.group(3)) if m.group(3) else None
                nxt = i + 1
                if sub is None and rest is None and nxt < len(lines):
                    s2 = SUBL.match(lines[nxt])
                    if s2:
                        sub = int(s2.group(1)); nxt += 1
                        if s2.group(2):
                            lines[nxt - 1] = s2.group(2); nxt -= 1
                if rest:
                    lines[i] = rest
                    nxt = i
                heads.append((i, main, sub, nxt)); lastmain = main
                i = max(nxt, i + 1) if not rest else i + 1
                continue
        i += 1
    segs = []
    for k, (idx, main, sub, start) in enumerate(heads):
        end = heads[k + 1][0] if k + 1 < len(heads) else len(lines)
        segs.append({'main': main, 'sub': sub, 'lines': lines[start:end]})
    return segs, lines


def split_seg(seg):
    """Return text, marks, options, trailing lines (after marks)."""
    L = seg['lines']
    joined = '\n'.join(L)
    mm = MARKS.search(joined)
    marks = None
    before = L
    after = []
    if mm:
        marks = int(mm.group(1))
        # find line containing marks
        for j, ln in enumerate(L):
            if MARKS.search(ln):
                pre = MARKS.sub('', ln).strip()
                before = L[:j] + ([pre] if pre else [])
                after = L[j + 1:]
                break
    return before, marks, after


def paragraphs(lines):
    """Merge wrapped lines into paragraph-ish strings (heuristic: lines that end without .?:) and start lowercase join)."""
    out = []
    buf = ''
    for ln in lines:
        if not buf:
            buf = ln
        elif re.match(r'^[••]', ln):
            out.append(buf); buf = ln
        elif re.search(r'[.?:!)]$', buf) and re.match(r'^[A-Z“‘"(•0-9£]', ln):
            out.append(buf); buf = ln
        else:
            buf += ' ' + ln
    if buf:
        out.append(buf)
    return out


def build_paper(year, p):
    qp_path = os.path.join(SRC, f'{year}-P{p}-QP.txt')
    segs, lines = parse_qp(qp_path)
    items = []
    stems = {}
    for seg in segs:
        before, marks, after = split_seg(seg)
        main, sub = seg['main'], seg['sub']
        if marks is None:
            # stem or continuation
            if sub is None:
                stems.setdefault(main, []).extend(before)
            else:
                stems.setdefault(main, []).extend(before)
            continue
        opts = None
        if p == 1 and main <= 15:
            opts = []
            for ln in after:
                om = OPT.match(ln)
                if om:
                    opts.append([om.group(1), om.group(2).strip()])
            # also options may sit before marks in some years
            if not opts:
                for ln in before:
                    om = OPT.match(ln)
                    if om:
                        opts.append([om.group(1), om.group(2).strip()])
        it = {'main': main, 'sub': sub, 'marks': marks, 'q': ('%02d' % main) + (('.%d' % sub) if sub else ''),
              'text_lines': before, 'options': opts}
        items.append(it)
    return items, stems, lines


MS_HDR = re.compile(r'^(\d) (\d)(?:\s*\.\s*(\d))?\s+(\S.*)$')
MS_MCQ = re.compile(r'^(\d{1,2})\s+([A-D])(?:\s+(.*))?$')


def parse_ms(year, p):
    path = os.path.join(SRC, f'{year}-P{p}-MS.txt')
    raw = open(path, encoding='utf-8').read()
    lines = []
    for ln in raw.replace(' ', ' ').split('\n'):
        s = ln.strip()
        if not s or s.startswith('=====PAGE') or re.match(r'^MARK SCHEME', s) or re.match(r'^\d{1,2}$', s) or re.match(r'^Copyright', s):
            continue
        lines.append(s)
    # MCQ answers: only inside the objective-test table
    mcq = {}
    inobj = False
    body = []
    for ln in lines:
        if re.search(r'Objective Test Answers', ln):
            inobj = True; continue
        if inobj:
            m = re.match(r'^(\d{1,2})\s+([A-D])(?:\s+(.*))?$', ln)
            if m:
                mcq[int(m.group(1))] = (m.group(2), (m.group(3) or '').strip()); continue
            if re.match(r'^Section B', ln):
                inobj = False; continue
            if re.match(r'^(Question|number Answer|Total for this section|Section)', ln):
                continue
            if re.match(r'^\d \d|^\d\d\s*\.\s*\d', ln):
                inobj = False
            else:
                continue
        body.append(ln)
    lines = body
    blocks = {}
    order = []
    cur = None
    i = 0
    while i < len(lines):
        ln = lines[i]
        key = None
        first = None
        adv = 1
        m = re.match(r'^(\d) (\d)\s*\.\s*(\d)(?:\s+(\S.*))?$', ln)
        if m:
            key = '%s%s.%s' % (m.group(1), m.group(2), m.group(3)); first = m.group(4)
        if not m:
            m3 = re.match(r'^(\d\d)\s*\.\s*(\d)(?:\s+(\S.*))?$', ln)
            if m3:
                m = m3; key = '%s.%s' % (m3.group(1), m3.group(2)); first = m3.group(3)
        if not key:
            m = re.match(r'^(\d) (\d)(?:\s+(\S.*))?$', ln)
            if m:
                key = '%s%s' % (m.group(1), m.group(2)); first = m.group(3)
                if first is None and i + 1 < len(lines):
                    m2 = re.match(r'^\.\s*(\d)(?:\s+(\S.*))?$', lines[i + 1])
                    if m2:
                        key += '.' + m2.group(1); first = m2.group(2); adv = 2
        if key and key not in blocks and 1 <= int(key[:2]) <= 30 and (first is None or re.match(r'^[A-Za-z‘“"\'(]', first)):
            cur = key; blocks[key] = [first] if first else []; order.append(key)
            i += adv; continue
        if cur:
            blocks[cur].append(ln)
        i += 1
    return mcq, blocks, order


if __name__ == '__main__':
    years = sys.argv[1:] or ['2020', '2021', '2022', '2023', '2024', '2025']
    for y in years:
        for p in (1, 2, 3):
            try:
                items, stems, lines = build_paper(y, p)
                mcq, blocks, order = parse_ms(y, p)
            except Exception as e:
                print(y, p, 'ERR', e)
                continue
            print(y, 'P%d' % p, 'items', len(items), 'marks', sum(i['marks'] for i in items), 'ms blocks', len(blocks), 'mcq', len(mcq))
