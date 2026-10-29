"""Parse the BTEC IT Unit 1 past papers + mark schemes (training PDFs) into the
BizPapers data format used by the shared paper viewer.

Run:  python parse_it1.py            -> writes build/it1_pearson.json
The PDFs stay in training-data (never published); only extracted text is used.
"""
import json, os, re
import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
COMBINED = os.path.join(SRC, 'IT-EXAM-UNIT1 (from 2019-2025) and (AAQ 2025 Spec).pdf')
MS2024 = os.path.join(SRC, '2024-btec-it-level-3-ms.pdf')

# (id, series, date, spec, qp pages, ms pages) — 1-based inclusive page ranges in the combined PDF
PAPERS = [
    ('IT1-SAM', 'Sample assessment (2025 spec)', 'Sample assessment material', 'new', (1, 21), (22, 44)),
    ('IT1-2501', 'January 2025', 'Friday 10 January 2025', 'old', (45, 69), (70, 91)),
    ('IT1-2401', 'January 2024', 'Friday 12 January 2024', 'old', (92, 115), None),
    ('IT1-2306', 'June 2023', 'Friday 9 June 2023', 'old', (116, 135), (136, 159)),
    ('IT1-2301', 'January 2023', 'January 2023', 'old', (160, 183), (184, 209)),
    ('IT1-2001', 'January 2020', 'Monday 20 January 2020', 'old', (210, 233), (234, 255)),
    ('IT1-1906', 'June 2019', 'June 2019', 'old', (256, 279), (280, 303)),
]

NOISE = re.compile(r'^(Pearson Level 3 Alternative.*|Sample Assessment Materials.*|Pearson BTEC Level 3.*|Unit 1: Information Technology Systems.*|lOMoAR\S*|Question|Number|Answer|Mark|Indicative content|MS - An exam paper|Information Technology in a Global Society.*|Scan to open on Studocu|Studocu is not sponsored.*|Downloaded by .*|DO NOT WRITE IN THIS AREA|BLANK PAGE|Turn over|Use this space to draw your diagram.*|\*[A-Z]\d+A\d+\*|[A-Z]\d{5}A|©20\d\d Pearson Education Ltd\.?|[\d/]+|Answer ALL questions\. Write your answers in the spaces provided\.)$')


def clean_lines(text):
    out = []
    for raw in text.split('\n'):
        s = re.sub(r'\.{4,}|…{2,}', '', raw).replace('\t', ' ').strip()
        s = re.sub(r'\s{2,}', ' ', s)
        if not s or re.fullmatch(r'[.\s…]+', s) or NOISE.match(s):
            continue
        out.append(s)
    return out


def qp_lines(pages, rng):
    lines = []
    for i in range(rng[0] - 1, rng[1]):
        lines += clean_lines(pages[i])
    # drop the cover page: start at the first question
    for k, l in enumerate(lines):
        if re.match(r'^1 [A-Z]', l):
            return lines[k:]
    return lines


PART = re.compile(r'^\(([a-h])\)\s*(.*)$')
SUB = re.compile(r'^\(((?:i|ii|iii|iv|v|vi))\)\s*(.*)$')
MARKS = re.compile(r'^\((\d{1,2})\)$')
QSTART = re.compile(r'^([1-6]) ([A-Z].*)$')
TOTAL = re.compile(r'^\(Total for Question (\d) = (\d+) marks\)')


def parse_qp(lines):
    items, q, part, sub = [], 0, None, None
    await_q = True          # a new question may only start at the top or right after "(Total for Question n ...)"
    ctx, text = [], []
    qtotals = {}

    def flush(marks):
        nonlocal text, ctx
        body = [t for t in text if not re.fullmatch(r'[12]', t)]
        sublabel = (part or '') + ('(' + sub + ')' if sub else '')
        items.append({'q': q, 'sub': sublabel or None, 'marks': marks, 'section': 'Q' + str(q),
                      'ctx': ctx[:], 'text': ' '.join(body).replace(' •', '\n•').strip()})
        ctx, text = [], []

    i = 0
    while i < len(lines):
        l = lines[i]
        m = TOTAL.match(l)
        if m:
            qtotals[int(m.group(1))] = int(m.group(2)); await_q = True; i += 1; continue
        if l.startswith('TOTAL FOR'):
            break
        m = QSTART.match(l)
        if m and int(m.group(1)) == q + 1 and await_q:
            q, part, sub, await_q = q + 1, None, None, False
            ctx, text = [m.group(2)], []
            i += 1; continue
        m = PART.match(l)
        if m:
            # "(b) (i) text" on one line
            part, sub = m.group(1), None
            rest = m.group(2)
            ms = SUB.match(rest)
            if ms:
                sub, rest = ms.group(1), ms.group(2)
            if text:            # stem lines of the part are context for its first sub-part
                ctx += text; text = []
            if rest: text.append(rest)
            i += 1; continue
        m = SUB.match(l)
        if m and part:
            sub = m.group(1)
            if text and not items_open(text):
                ctx += text; text = []
            if m.group(2): text.append(m.group(2))
            i += 1; continue
        m = MARKS.match(l)
        if m:
            flush(int(m.group(1))); i += 1; continue
        if l in ('•',):
            if i + 1 < len(lines): text.append('• ' + lines[i + 1]); i += 2; continue
        text.append(l)
        i += 1
    return items, qtotals


def items_open(text):
    return False


def ms_text(pages, rng):
    lines = []
    for i in range(rng[0] - 1, rng[1]):
        lines += clean_lines(pages[i])
    return lines


MSID = re.compile(r'^(?:Question\s+Number\s+(?:Answer|Indicative content)?\s*(?:Mark)?\s*)?([1-6])\s?\(?([a-h])\)?\s*\(?((?:i|ii|iii|iv|v))?\)?(?=\s|$)(.*)$')


def parse_ms(lines):
    """Split a mark scheme into {'1a(i)': body} by question-number rows."""
    out, cur, buf = {}, None, []
    started = False
    for l in lines:
        s = re.sub(r'^Mark Scheme \d{4}\s*', '', l).strip()
        if not s:
            continue
        m = MSID.match(s)
        if m and (s.startswith('Question') or re.match(r'^[1-6]\s?\(?[a-h]', s)):
            key = m.group(1) + m.group(2) + ('(' + m.group(3) + ')' if m.group(3) else '')
            if cur:
                out.setdefault(cur, []).extend(buf)
            cur, buf, started = key, [], True
            rest = m.group(4).strip()
            if rest: buf.append(rest)
            continue
        if started:
            buf.append(s)
    if cur:
        out.setdefault(cur, []).extend(buf)
    res = {}
    for k, v in out.items():
        body = '\n'.join(x for x in v if not re.match(r'^(Question Number|Answer|Mark|Indicative content|Unit 1: Information Technology Systems|General Marking Guidance)$', x))
        res[k] = reflow(body.strip())
    return res


def reflow(body):
    """Join PDF-wrapped lines back into bullets / sentences."""
    out = []
    for l in body.split('\n'):
        l = l.strip()
        if not l:
            continue
        if out and out[-1] == '•':
            out[-1] = '• ' + l; continue
        starts_new = (not out or l.startswith(('•', '-', '–'))
                      or re.match(r'^(Level \d|\d+[-–]\d+ marks|0 marks|Accept|Award|Do not|Note|Answers will|Learners|Indicative|Example|Diagram may|Devices|Connection|Mark scheme)', l)
                      or (len(l) < 40 and l.endswith(':'))
                      or (len(l) <= 40 and l[:1].isupper() and not re.search(r'(,|\b(and|or|the|of|to|a|an|for|with|by|in|on))$', out[-1])))
        prev_closed = out and re.search(r'(\(\d\)|[.:;!?])$', out[-1])
        if out and not starts_new and not prev_closed:
            out[-1] += ' ' + l
        else:
            out.append(l)
    return '\n'.join(out)


def main():
    d = pymupdf.open(COMBINED)
    pages = [p.get_text() for p in d]
    ms24 = [p.get_text() for p in pymupdf.open(MS2024)]
    result = []
    for pid, series, date, spec, qpr, msr in PAPERS:
        items, qt = parse_qp(qp_lines(pages, qpr))
        msl = ms_text(pages, msr) if msr else []
        if pid == 'IT1-2401':
            msl = []
            for t in ms24: msl += clean_lines(t)
        ms = parse_ms(msl)
        for it in items:
            key = str(it['q']) + (it['sub'] or '')
            body = ms.get(key) or ms.get(key.replace('(', '').replace(')', '')) or ''
            it['ms'] = {'body': body, 'levels': it['marks'] if it['marks'] >= 6 else None}
        tot = sum(i['marks'] for i in items)
        result.append({'id': pid, 'series': series, 'date': date, 'spec': spec, 'total': tot, 'qtotals': qt, 'items': items,
                       'msKeys': sorted(ms.keys())})
        miss = [str(i['q']) + (i['sub'] or '') for i in items if not i['ms']['body']]
        print(pid, 'items', len(items), 'total', tot, 'qtotals', qt, 'ms-missing', miss)
    json.dump(result, open(os.path.join(HERE, 'it1_pearson.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
