"""Assemble structured AQA 7132 papers (2020-2025) from parse_aqa output -> out/aqa_papers.json."""
import re, json, os, sys
import parse_aqa as P

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)

SERIES = {'2020': 'June 2020', '2021': 'June 2021', '2022': 'June 2022', '2023': 'June 2023', '2024': 'June 2024', '2025': 'June 2025'}
DATES = {  # exam dates where known from the cover pages
}


def fix_text(s):
    s = s.replace('ﬁ', 'fi').replace('ﬂ', 'fl').replace('­', '')
    s = re.sub(r'\s+', ' ', s).strip()
    # common pdf spacing artefacts like 'outs ide' are rare in the question body; leave as is
    return s


def para_join(lines):
    """Join wrapped lines into paragraphs; bullets stay separate."""
    out = []
    buf = ''
    for ln in lines:
        ln = ln.strip()
        if not ln:
            continue
        if re.match(r'^[••]\s*', ln):
            if buf:
                out.append(buf)
            buf = ln
            continue
        if not buf:
            buf = ln
        elif re.search(r'[.?!:)’”"]$', buf) and re.match(r'^[A-Z‘“"(£0-9]', ln) and len(buf) > 45:
            out.append(buf); buf = ln
        else:
            buf += ' ' + ln
    if buf:
        out.append(buf)
    return [fix_text(x) for x in out if x.strip()]


NUMROW = re.compile(r'(?:[£€$]?\(?-?\d[\d,.]*\)?%?\s*){2,}')


def to_blocks(lines):
    """Convert case-study lines to renderer blocks: p / li / h / tbl."""
    blocks = []
    i = 0
    L = [l for l in lines if l.strip()]
    para = []

    def flush():
        nonlocal para
        if para:
            for t in para_join(para):
                if t.startswith('•') or t.startswith('•'):
                    if blocks and blocks[-1]['t'] == 'li':
                        blocks[-1]['x'].append(t.lstrip('•• ').strip())
                    else:
                        blocks.append({'t': 'li', 'x': [t.lstrip('•• ').strip()]})
                else:
                    blocks.append({'t': 'p', 'x': t})
            para = []

    while i < len(L):
        ln = L[i]
        # appendix / source headings
        if re.match(r'^(Appendix [A-Z0-9]+|Source \d+|Figure \d+|Table \d+|Extract|Option \d)\b', ln) and len(ln) < 140 and not ln.endswith('.'):
            flush(); blocks.append({'t': 'h', 'x': fix_text(ln)}); i += 1; continue
        # a run of numeric/table-ish short rows
        j = i
        while j < len(L) and len(L[j]) <= 60 and (NUMROW.search(L[j]) or (j > i and not re.search(r'[.?]$', L[j]) and len(L[j].split()) <= 7 and j - i < 14 and re.search(r'\d', L[j]))):
            j += 1
        if j - i >= 3:
            flush(); blocks.append({'t': 'tbl', 'x': [fix_text(x) for x in L[i:j]]}); i = j; continue
        para.append(ln); i += 1
    flush()
    return blocks


def extract_case(year, p):
    """Return case-study lines (Paper 3 insert / Paper 2 stems are handled elsewhere)."""
    segs, lines = P.parse_qp(os.path.join(P.SRC, f'{year}-P{p}-QP.txt'))
    # lines before the first question header = insert + cover; drop cover block
    first = None
    for idx, ln in enumerate(lines):
        if re.match(r'^1 ?$', ln):
            pass
    txt = open(os.path.join(P.SRC, f'{year}-P{p}-QP.txt'), encoding='utf-8').read()
    return txt


LEVEL_ROW = re.compile(r'^(\d)\s*$')
RANGE = re.compile(r'^(\d+)\s*[–-]\s*(\d+)\s*$')


def parse_levels(block_lines):
    """Parse a 'Level ... Marks' table. Level numbers are lost in cleaning, so bands are numbered top-down by count."""
    L = block_lines
    start = None
    for k, ln in enumerate(L):
        if re.match(r'^Level.*Marks', ln):
            start = k + 1; break
    if start is None:
        return []
    bands = []
    desc = []
    for ln in L[start:]:
        if re.match(r'^(The demands of this question|Indicative content|Accept other|Some candidates|Good responses)', ln):
            break
        r = RANGE.match(ln)
        if r:
            bands.append(('%s–%s' % (r.group(1), r.group(2)), fix_text(' '.join(desc)))); desc = []
            continue
        desc.append(ln)
    n = len(bands)
    out = [{'level': n - i, 'marks': m, 'descriptor': d} for i, (m, d) in enumerate(bands)]
    return sorted(out, key=lambda d: d['level'])


def ms_body(block):
    """Strip header/AO/level table; return dict(ao, points, indicative, raw)."""
    ao = ''
    pts = []
    ind = []
    mode = 'pre'
    raw = [l for l in block]
    # remove repeated question text up to [n marks]
    k = 0
    for idx, ln in enumerate(raw):
        if re.search(r'\[\s*\d+\s*marks?\s*\]', ln):
            k = idx + 1; break
    rest = raw[k:]
    for ln in rest:
        m = re.match(r'^Marks for this question:\s*(.*)$', ln)
        if m:
            ao = m.group(1).strip(); continue
        pts.append(ln)
    return ao, pts


def clean_ms_lines(lines):
    out = []
    for ln in lines:
        ln = ln.replace('•', '•').strip()
        if re.match(r'^\(?\d+ marks?\)?$', ln):
            pass
        out.append(ln)
    return out


def build_ms_item(marks, block):
    ao, rest = ms_body(block)
    lvls = parse_levels(rest) if marks >= 6 else []
    # indicative content: everything after the level table's 'The demands' / 'Indicative content'
    ind = []
    cut = None
    for idx, ln in enumerate(rest):
        if re.match(r'^(The demands of this question|Indicative content)', ln):
            cut = idx; break
    if cut is not None:
        ind = rest[cut:]
    elif marks < 6:
        ind = rest
    return {'ao': ao, 'levels': lvls, 'body': [fix_text(x) for x in ind if x.strip()]}


def section_of(p, main, marks, items_marks):
    if p == 1:
        if main <= 15:
            return 'A'
        if marks == 25:
            return 'C' if main <= max(m for m, mk in items_marks if mk == 25) - 2 else 'D'
        return 'B'
    return None


def build(year, p):
    items, stems, lines = P.build_paper(year, p)
    mcq, blocks, order = P.parse_ms(year, p)
    out_items = []
    big = [m for m, mk in [(i['main'], i['marks']) for i in items] if mk == 25]
    for it in items:
        key = it['q']
        text = '\n'.join(para_join(it['text_lines']))
        sec = None
        if p == 1:
            if it['main'] <= 15:
                sec = 'A'
            elif it['marks'] == 25:
                sec = 'C' if it['main'] in sorted(big)[:2] else 'D'
            else:
                sec = 'B'
        d = {'q': key, 'main': it['main'], 'sub': it['sub'], 'section': sec, 'marks': it['marks'], 'text': text}
        stem = stems.get(it['main'])
        if stem and p != 1 or (stem and p == 1):
            d['stem'] = to_blocks(stem)
        if it['options']:
            d['options'] = it['options']
            ans = mcq.get(it['main'])
            if ans:
                d['answer'] = ans[0]
                d['answer_text'] = ans[1]
        b = blocks.get(key)
        if b is not None:
            d['ms'] = build_ms_item(it['marks'], b)
        if re.search(r'\b(Figure|diagram|graph|chart|network|decision tree|Appendix)\b', text + ' '.join(it['text_lines']), re.I):
            d['fig'] = bool(re.search(r'\b(Figure \d|diagram|chart below|graph below|shown (on|in) the)\b', text, re.I))
        out_items.append(d)
    return out_items


def p3_insert(year):
    if year == '2025':
        txt = open(os.path.join(P.SRC, '..', 'AQA-71323-INS-JUN25.txt'), encoding='utf-8').read()
        lines = P.clean_lines(txt)
        # drop the cover page lines
        k = next((i for i, l in enumerate(lines) if l.startswith('Vignal Babbel Motors (VBM)') and i > 3), 0)
        return to_blocks(lines[k:])
    segs, lines = P.parse_qp(os.path.join(P.SRC, '%s-P3-QP.txt' % year))
    cov = next((i for i, l in enumerate(lines) if 'Examiner' in l), None)
    return to_blocks(lines[:cov] if cov else [])


if __name__ == '__main__':
    papers = []
    levels = {}
    for y in ['2020', '2021', '2022', '2023', '2024', '2025']:
        for p in (1, 2, 3):
            items = build(y, p)
            cases = {}
            for it in items:
                st = it.pop('stem', None)
                if st and it['main'] not in cases:
                    cases[it['main']] = st
            for it in items:
                if it.get('ms'):
                    for lv in [it['ms']['levels']]:
                        if lv and it['marks'] not in levels:
                            levels[it['marks']] = lv
            paper = {'id': 'aqa-%s-p%d' % (y, p), 'year': y, 'paper': p, 'series': SERIES[y], 'items': items, 'cases': cases}
            if p == 3:
                paper['insert'] = p3_insert(y)
            papers.append(paper)
            print(y, p, len(items), sum(1 for i in items if 'ms' in i), 'fig', sum(1 for i in items if i.get('fig')), 'insert', len(paper.get('insert', [])))
    json.dump(papers, open(os.path.join(OUT, 'aqa_papers_raw.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(levels, open(os.path.join(OUT, 'levels.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('level tariffs', sorted(levels))
