"""Parse OCR GCSE Computer Science (J277) question papers and mark schemes into out/gcse-computer-science.papers.json.

    python training-data/gcse/gcse-build/ocr_parse.py

Sources (git-ignored, exam-board copyright): training-data/gcse/ocr-computer-science/paper-1 and paper-2.
Real papers: QP and MS are separate PDFs (matched by series). Sample papers (552500 / 552502): QP pages are portrait,
MS pages landscape, in one PDF.

Per question part (leaf with a [n] mark):
  • text      – the instruction (last paragraph run of the part)
  • ctxb      – stems of the parent question/part, code listings (t:'code') and figures (t:'fig')
  • fig       – a cropped image of the table / flowchart / logic diagram the instruction refers to
  • ms        – {body, pts, levels}: the mark-scheme answer column, then its guidance
A paper is emitted only if its parts add up to 80 and every part has a mark scheme whose mark agrees.
"""
import io, json, os, re, sys
import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'ocr-computer-science')
OUT = os.path.join(HERE, 'out')
FIGDIR = os.path.join(OUT, 'figures')

PAPERS = [  # (id, paper, series, year, month, qp, ms)
    ('ocr-cs-sam-p1', 1, 'Sample assessment', 2020, 1, 'paper-1/552500-computer-systems-.pdf', None),
    ('ocr-cs-jun22-p1', 1, 'June 2022', 2022, 6, 'paper-1/677830-question-paper-computer-systems.pdf', 'paper-1/677961-mark-scheme-computer-systems.pdf'),
    ('ocr-cs-jun23-p1', 1, 'June 2023', 2023, 6, 'paper-1/704760-question-paper-computer-systems.pdf', 'paper-1/704882-mark-scheme-computer-systems.pdf'),
    ('ocr-cs-jun24-p1', 1, 'June 2024', 2024, 6, 'paper-1/727534-question-paper-computer-systems.pdf', 'paper-1/727652-mark-scheme-computer-systems.pdf'),
    ('ocr-cs-jun25-p1', 1, 'June 2025', 2025, 6, 'paper-1/753279-question-paper-computer-systems.pdf', 'paper-1/753394-mark-scheme-computer-systems.pdf'),
    ('ocr-cs-sam-p2', 2, 'Sample assessment', 2020, 1, 'paper-2/552502-computational-thinking-algorithms-and-programming.pdf', None),
    ('ocr-cs-jun22-p2', 2, 'June 2022', 2022, 6, 'paper-2/677831-question-paper-computational-thinking-algorithms-and-programming.pdf', 'paper-2/677962-mark-scheme-computational-thinking-algorithms-and-programming.pdf'),
    ('ocr-cs-jun23-p2', 2, 'June 2023', 2023, 6, 'paper-2/704761-question-paper-computational-thinking-algorithms-and-programming.pdf', 'paper-2/704883-mark-scheme-computational-thinking-algorithms-and-programming.pdf'),
    ('ocr-cs-jun24-p2', 2, 'June 2024', 2024, 6, 'paper-2/727535-question-paper-computational-thinking-algorithms-and-programming.pdf', 'paper-2/727653-mark-scheme-computational-thinking-algorithms-and-programming.pdf'),
    ('ocr-cs-jun25-p2', 2, 'June 2025', 2025, 6, 'paper-2/753280-question-paper-computational-thinking-algorithms-and-programming.pdf', 'paper-2/753395-mark-scheme-computational-thinking-algorithms-and-programming.pdf'),
]
TOTAL = 80
ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii']
DOTS = re.compile(r'[.…_]{4,}')
FIX = str.maketrans({'': '✓', '': '•', '': '*', ' ': ' ', ' ': ' ', ' ': ' ', '': '•', '–': '–'})


def clean(s):
    return re.sub(r'[ \t]+', ' ', s.translate(FIX)).strip()


# ───────────────────────────── spans → rows ─────────────────────────────
def spans_of(page):
    out = []
    rot = page.rotation_matrix if page.rotation else None
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines', []):
            for s in l['spans']:
                t = s['text'].translate(FIX)
                if not t.strip():
                    continue
                f = s['font']
                bb = pymupdf.Rect(s['bbox'])
                if rot is not None:
                    bb = bb * rot
                out.append(dict(x0=bb.x0, y0=bb.y0, x1=bb.x1, y1=bb.y1, t=t, font=f, size=s['size'],
                                bold='Bold' in f or 'bold' in f, mono='Courier' in f, sym='Symbol' in f or 'Wingdings' in f))
    return out


def rows_of(spans, tol=3.0):
    rows = []
    for s in sorted(spans, key=lambda s: (s.get('pg', 0), round(s['y0']), s['x0'])):
        yc = (s['y0'] + s['y1']) / 2 + s.get('pg', 0) * 10000
        for r in rows:
            if abs(r['yc'] - yc) <= tol:
                r['s'].append(s); break
        else:
            rows.append({'yc': yc, 's': [s]})
    for r in rows:
        r['s'].sort(key=lambda s: s['x0'])
        r['y0'] = min(s['y0'] for s in r['s']); r['y1'] = max(s['y1'] for s in r['s'])
        r['x0'] = r['s'][0]['x0']
    rows.sort(key=lambda r: (r['s'][0].get('pg', 0), r['y0']))
    return rows


def row_text(spans, gap=22, sep=' | '):
    out, last = '', None
    for s in spans:
        t = s['t']
        if last is not None:
            g = s['x0'] - last
            out += (sep if g > gap else (' ' if g > 1.5 and not out.endswith(' ') and not t.startswith(' ') else ''))
        out += t
        last = s['x1']
    return clean(out)


# ───────────────────────────── figures ─────────────────────────────
def clusters(page, ymin, ymax):
    """Groups of vector drawings (tables, flowcharts, logic gates, boxes) between ymin and ymax."""
    boxes = []
    for d in page.get_drawings():
        r = d['rect']
        if r.y1 < ymin or r.y0 > ymax or r.width > 540 or (r.width < 1.2 and r.height < 1.2):
            continue
        if r.x0 < 25 or r.x1 > 575:      # margin bars / barcodes
            continue
        boxes.append(pymupdf.Rect(r.x0 - 1, r.y0 - 1, r.x1 + 1, r.y1 + 1))   # lines have zero width
    groups = []
    for b in boxes:
        g = pymupdf.Rect(b)
        merged = True
        while merged:
            merged = False
            for o in groups[:]:
                if (o + (-10, -10, 10, 10)).intersects(g):
                    g |= o; groups.remove(o); merged = True
        groups.append(g)
    return [g for g in groups if g.width > 30 and g.height > 14]


# ───────────────────────────── question paper ─────────────────────────────
LABEL = re.compile(r'^\(([a-h]|i{1,3}|iv|vi{0,3})\)\s*')


def qp_pages(doc):
    pages = []
    for i, p in enumerate(doc):
        if p.rect.width > p.rect.height:
            break                                    # sample PDF: the mark scheme starts here
        t = p.get_text('text')
        if i == 0 or 'BLANK PAGE' in t or 'ADDITIONAL ANSWER SPACE' in t:
            continue
        pages.append(p)
    return pages


def qp_stream(pid, doc, figs):
    """Token stream in reading order: ('sec', X) ('main', n) ('part', l) ('mark', n) ('star',) ('p', text) ('code', line) ('fig', id)."""
    toks, nfig = [], 0
    state = {'main': 0}
    for page in qp_pages(doc):
        spans = [s for s in spans_of(page) if 52 < s['y0'] < 790]
        split = []
        for s in spans:   # "……………… [5]" in one span: split the mark off
            m = re.search(r'\[(\d{1,2})\]\s*$', s['t'])
            if m and s['x1'] > 480 and s['t'].strip() != m.group(0):
                split.append(dict(s, t=s['t'][:m.start()], x1=s['x1'] - 20))
                split.append(dict(s, t=m.group(0).strip(), x0=s['x1'] - 16))
            else:
                split.append(s)
        spans = split
        if any('END OF QUESTION PAPER' in s['t'] for s in spans):
            cut = min(s['y0'] for s in spans if 'END OF QUESTION PAPER' in s['t'])
            spans = [s for s in spans if s['y0'] < cut]
        spans = [s for s in spans if not re.match(r'^\s*(Turn over|© OCR \d{4}|PLEASE DO NOT WRITE ON THIS PAGE|DO NOT WRITE IN THIS SPACE)\s*$', s['t'])]
        if not spans:
            continue
        figrects = []
        for g in clusters(page, 52, 770):
            inside = [s for s in spans if pymupdf.Rect(s['x0'], s['y0'], s['x1'], s['y1']).intersects(g) and not re.match(r'^\[\d+\]$', s['t'].strip())]
            real = [s for s in inside if not DOTS.fullmatch(s['t'].strip())]
            if len(real) < 1 and g.height > 60:
                continue                              # an empty answer box
            if len(real) < 1 and g.width < 80:
                continue                              # a tick box
            # grow to include the text inside / touching the drawing
            for s in real:
                g |= pymupdf.Rect(s['x0'], s['y0'], s['x1'], s['y1'])
            figrects.append(g)
        # merge overlapping figure rects
        merged = []
        for g in sorted(figrects, key=lambda r: r.y0):
            if merged and (merged[-1] + (0, -6, 0, 6)).intersects(g):
                merged[-1] |= g
            else:
                merged.append(pymupdf.Rect(g))
        # pieces of one diagram (flowchart boxes, merge-sort rows): join neighbours with only code / blank lines between
        joined = []
        for g in merged:
            if joined:
                prev = joined[-1]
                between = [s for s in spans if s['y0'] >= prev.y1 - 2 and s['y1'] <= g.y0 + 2 and not DOTS.fullmatch(s['t'].strip())]
                if (g.y0 - prev.y1 < 90 or (g.y0 - prev.y1 < 420 and len(between) >= 2)) and all(s['mono'] for s in between) and not any(re.match(r'^\[\d+\]$', s['t'].strip()) for s in between):
                    joined[-1] = prev | g
                    continue
            joined.append(pymupdf.Rect(g))
        merged = []
        for g in joined:
            for _ in range(2):
                for s in spans:
                    if not re.match(r'^\[\d+\]$', s['t'].strip()) and not DOTS.fullmatch(s['t'].strip()) and pymupdf.Rect(s['x0'], s['y0'], s['x1'], s['y1']).intersects(g):
                        g |= pymupdf.Rect(s['x0'], s['y0'], s['x1'], s['y1'])
            merged.append(g)
        events = []
        for g in merged:
            inside = [s for s in spans if pymupdf.Rect(s['x0'], s['y0'], s['x1'], s['y1']).intersects(g)]
            marks = [s for s in inside if re.match(r'^\[\d+\]$', s['t'].strip())]
            inside = [s for s in inside if s not in marks]
            labels = [s for s in inside if s['x0'] < 70 and s['bold'] and (re.match(r'^\d{1,2}$', s['t'].strip()) or LABEL.match(s['t'].strip()))]
            body = [s for s in inside if s not in labels]
            if not body:
                continue
            nfig += 1
            fid = '%s-f%d' % (pid, nfig)
            clip = pymupdf.Rect(max(36, g.x0 - 8), g.y0 - 8, min(560, g.x1 + 8), g.y1 + 8)
            pix = page.get_pixmap(matrix=pymupdf.Matrix(2.2, 2.2), clip=clip)
            fn = fid + '.png'
            pix.save(os.path.join(FIGDIR, fn))
            alt = ' / '.join(row_text(r['s']) for r in rows_of(body) if not DOTS.fullmatch(row_text(r['s'])))
            figs[fid] = {'file': fn, 'w': pix.width, 'h': pix.height, 'page': page.number + 1, 'alt': alt[:1500]}
            for s in body:
                spans.remove(s)
            events.append((g.y0, ('fig', fid)))
        for r in rows_of(spans):
            ss = r['s']
            # section heading
            joined = row_text(ss)
            if re.match(r'^SECTION [AB]$', joined, re.I) or re.match(r'^Section [AB]$', joined):
                events.append((r['y0'], ('sec', joined[-1].upper()))); continue
            if re.match(r'^(We advise you to spend|Some questions require you to respond|high-level programming language you have studied)', joined) or re.match(r'^Answer all the questions\.?$', joined):
                continue
            items = []
            k = 0
            # main question number
            t0 = ss[0]['t'].strip()
            if ss[0]['x0'] < 82 and not ss[0]['mono'] and re.match(r'^\d{1,2}\*?$', t0) and int(t0.rstrip('*')) == state['main'] + 1:
                state['main'] += 1
                items.append(('main', state['main'])); k = 1
                if t0.endswith('*'): items.append(('star',))
            elif ss[0]['x0'] < 82 and not ss[0]['mono'] and re.match(r'^(\d{1,2})\s*(\*)?\s+\S', t0) and int(re.match(r'^\d+', t0).group(0)) == state['main'] + 1:
                m = re.match(r'^(\d{1,2})\s*(\*)?\s+(.*)$', t0)
                state['main'] += 1
                items.append(('main', state['main']))
                if m.group(2): items.append(('star',))
                ss = [dict(ss[0], t=m.group(3))] + ss[1:]
            rest = ss[k:]
            if rest and rest[0]['t'].strip() == '*':
                items.append(('star',)); rest = rest[1:]
            # part labels (possibly two: "(c) (i) Identify…")
            while rest and rest[0]['x0'] < 126:
                t0 = rest[0]['t'].strip()
                m = LABEL.match(t0)
                if not m or not (rest[0]['bold'] or rest[0]['x0'] < 80):
                    break
                items.append(('part', m.group(1)))
                remain = t0[m.end():]
                if remain:
                    rest = [dict(rest[0], t=remain, x0=rest[0]['x0'] + 20)] + rest[1:]
                else:
                    rest = rest[1:]
            mk = [s for s in rest if re.match(r'^\[\d+\]$', s['t'].strip()) and s['x0'] > 470]
            rest = [s for s in rest if s not in mk]
            if rest:
                if all(s['mono'] for s in rest):
                    line = ''
                    for s in rest:
                        if line and s['x0'] - prev > 12:
                            line += ' ' * max(1, int(round((s['x0'] - prev) / 6.0)))
                        line += s['t']; prev = s['x1']
                    items.append(('code', line.rstrip(), rest[0]['x0']))
                else:
                    txt = row_text(rest)
                    txt2 = DOTS.sub('', txt).strip(' |')
                    if txt2 and not (DOTS.search(txt) and len(txt2) < 40 and len(txt2.split()) <= 4):
                        items.append(('p', txt2, r['x0']))
            for m in mk:
                items.append(('mark', int(m['t'].strip()[1:-1])))
            for it in items:
                events.append((r['y0'], it))
        events.sort(key=lambda e: e[0])
        toks += [e[1] for e in events]
    return toks


def build_tree(toks, paper):
    """Leaves with their own blocks and the stems of their parents."""
    path, blocks, leaves, sec, star, orphan = [], {}, [], 'A', False, []

    def key():
        return tuple(path)

    for t in toks:
        k = t[0]
        if k == 'sec':
            sec = t[1]; continue
        if k == 'main':
            path = [str(t[1])]; star = False
            blocks.setdefault(key(), []).extend(orphan); orphan = []
            continue
        if k == 'star':
            star = True; continue
        if k == 'part':
            lab = t[1]
            if lab in ROMAN and len(path) >= 2 and not (lab == 'i' and path[-1] == 'h'):
                path = path[:2] + [lab]
            else:
                path = path[:1] + [lab]
            blocks.setdefault(key(), []).extend(orphan); orphan = []
            continue
        if k == 'mark':
            if not path:
                continue
            own = blocks.get(key(), [])
            ctx = []
            for n in range(1, len(path)):
                ctx += blocks.get(tuple(path[:n]), [])
            leaves.append({'path': list(path), 'marks': t[1], 'own': own, 'ctx': ctx, 'section': sec, 'star': star})
            blocks[key()] = []
            path_done = True
            continue
        if not path:
            continue
        if leaves and leaves[-1]['path'] == path and not blocks.get(key()):
            # content after a part's mark but before the next label → stem of whatever comes next
            orphan.append(t); continue
        blocks.setdefault(key(), []).append(t)
    # a part printed with two answer areas ("tick one box" [1] … "explain why" [1]) is one part in the mark scheme
    out = []
    for lf in leaves:
        if out and out[-1]['path'] == lf['path']:
            out[-1]['marks'] += lf['marks']; out[-1]['own'] = out[-1]['own'] + lf['own']
        else:
            out.append(lf)
    return out


def to_blocks(raw):
    """Group code lines; join wrapped paragraph lines."""
    out = []
    for t in raw:
        if t[0] == 'code':
            if out and out[-1]['t'] == 'code':
                out[-1]['x'].append(t[1]); out[-1]['xs'].append(t[2])
            else:
                out.append({'t': 'code', 'x': [t[1]], 'xs': [t[2]]})
        elif t[0] == 'fig':
            out.append({'t': 'fig', 'id': t[1]})
        elif t[0] == 'p':
            txt = t[1]
            if out and out[-1]['t'] == 'p' and not re.search(r'[.?:!)\]]$', out[-1]['x']) and not txt[:1] in '•-' and abs(t[2] - out[-1]['xx']) < 8:
                out[-1]['x'] += ' ' + txt
            elif out and out[-1]['t'] == 'p' and re.match(r'^[a-z(]', txt) and abs(t[2] - out[-1]['xx']) < 8:
                out[-1]['x'] += ' ' + txt
            else:
                out.append({'t': 'p', 'x': txt, 'xx': t[2]})
    for b in out:
        if b['t'] == 'code':
            base = min(b['xs'])
            lines = [' ' * int(round((x - base) / 6.0)) + l for l, x in zip(b['x'], b['xs'])]
            nums = [re.match(r'^(\d{2})(\s+|$)', l) for l in lines]
            if all(nums) and [int(m.group(1)) for m in nums] == list(range(1, len(lines) + 1)):
                body = [l[2:] for l in lines]
                ind = min((len(x) - len(x.lstrip()) for x in body if x.strip()), default=0)
                lines = [x[ind:] for x in body]
            b['x'] = lines
            del b['xs']
        b.pop('xx', None)
    return out


def leaf_item(lf, paper):
    own = to_blocks(lf['own'])
    ctx = to_blocks(lf['ctx'])
    text, fig = '', None
    # the instruction = the last paragraph run; a figure right after it is the thing to complete
    i = len(own) - 1
    if i >= 0 and own[i]['t'] == 'fig':
        fig = own[i]['id']; i -= 1
    j = i
    while j >= 0 and own[j]['t'] == 'p':
        j -= 1
    texts = [b['x'] for b in own[j + 1:i + 1]]
    if not texts and i >= 0 and own[i]['t'] in ('code',):
        # instruction before the code: take the last paragraph before it
        k = i
        while k >= 0 and own[k]['t'] != 'p':
            k -= 1
        if k >= 0:
            texts = [own[k]['x']]; own = own[:k] + own[k + 1:]; j = len(own)
            pre = own
        else:
            pre = own
    else:
        pre = own[:j + 1]
    text = '\n'.join(texts).strip()
    if not text and ctx and ctx[-1]['t'] == 'p':
        text = ctx[-1]['x']; ctx = ctx[:-1]
    path = lf['path']
    label = path[0] + ''.join('(%s)' % x for x in path[1:])
    it = {'q': int(path[0]), 'sub': ''.join(path[1:]), 'label': label, 'marks': lf['marks'], 'section': lf['section'] if paper == 2 else 'A',
          'ctxb': ctx + pre, 'text': text, 'kind': 'qer' if lf['star'] else ('code' if paper == 2 and lf['section'] == 'B' else 'short')}
    if fig:
        it['fig'] = fig
        if re.search(r'\b(complete|draw|label|add|annotate|finish)\b[^.]{0,60}\b(flow ?chart|logic (circuit|diagram)|diagram|structure diagram|trace table|truth table|table)\b', text, re.I):
            it['padFig'] = fig
            if re.search(r'flow ?chart|logic (circuit|diagram)|structure diagram|\bdiagram\b', text, re.I):
                it['diagram'] = True
    if not text:
        it['problem'] = 'no question text'
    return it


# ───────────────────────────── mark scheme ─────────────────────────────
def ms_pages(doc, sample):
    pages, on = [], False
    for p in doc:
        if p.rect.width <= p.rect.height:
            continue
        t = p.get_text('text')
        if 'Summary of updates' in t and on:
            break
        if not on and re.search(r'Question\s*\n?.*Answer', t) and re.search(r'Guidance', t) and re.search(r'\bMarks?\b', t) and not re.search(r'Assessment Objective', t):
            on = True
        if on:
            pages.append(p)
    return pages


MSLAB = re.compile(r'^\(?([a-h]|i{1,3}|iv|vi{0,3}|\d{1,2}|\*)\)?$')


def ms_rows(doc, qleaves, sample):
    """Rows of the mark scheme: {path, mark, answer[], guidance[]}."""
    known = {tuple(l['path']) for l in qleaves}
    rows, cur, path = [], None, []
    markL = markR = None
    for page in ms_pages(doc, sample):
        spans = [dict(s, pg=page.number) for s in spans_of(page) if 48 < s['y0'] < page.rect.height - 40]
        hdr = [s for s in spans if re.match(r'^Marks?$', s['t'].strip()) and s['bold']]
        spans = [s for s in spans if not re.match(r'^(J277/0\d|Mark Scheme|June 20\w\w|SECTION [AB]|Question|Answer|Marks?|Guidance)$', s['t'].strip())]
        H, W = page.rect.height, page.rect.width
        spans = [s for s in spans if not (re.match(r'^\d{1,2}$', s['t'].strip()) and s['y0'] > H - 75 and abs((s['x0'] + s['x1']) / 2 - W / 2) < 40)]   # page number
        ao = [s for s in spans if re.match(r'^\(AO\d', s['t'].strip())]
        if ao:
            markL = min(s['x0'] for s in ao) - 10; markR = max(s['x1'] for s in ao) + 4
        elif hdr:
            markL = hdr[0]['x0'] - 14; markR = hdr[0]['x1'] + 12
        if markL is None:
            continue
        labs = []
        for s in spans:
            t = s['t'].strip()
            tt = t.replace('(', ' ').replace(')', ' ').split()
            if s['x0'] < 150 and s['bold'] and tt and all(MSLAB.match(x) for x in tt):
                labs.append(s)
        # group label spans by row
        lrows = rows_of(labs, tol=4)
        content = [s for s in spans if s not in labs]
        starts = []
        for lr in lrows:
            toks = []
            for s in lr['s']:
                toks += s['t'].replace('(', ' ').replace(')', ' ').split()
            starts.append((lr['y0'], toks))
        starts.sort()
        segs = []
        for i, (y, toks) in enumerate(starts):
            segs.append((y - 3, starts[i + 1][0] - 3 if i + 1 < len(starts) else 10 ** 6, toks))
        def flush_into(row, ss):
            if row is None:
                return
            for s in ss:
                if s['x0'] >= markL and s['x1'] <= markR + 6:
                    row['markspans'].append(s)
                elif s['x0'] >= markR - 2:
                    row['g'].append(s)
                else:
                    row['a'].append(s)
        # content above the first label on this page continues the previous row
        top = starts[0][0] - 3 if starts else 10 ** 6
        flush_into(cur, [s for s in content if s['y0'] < top])
        for (y0, y1, toks) in segs:
            # update path from tokens
            for tk in toks:
                if tk == '*':
                    continue
                if re.match(r'^\d+$', tk):
                    path = [tk]
                elif tk in ROMAN and len(path) >= 2 and (tuple(path[:2] + [tk]) in known or not (tuple(path[:1] + [tk]) in known)):
                    path = path[:2] + [tk]
                else:
                    path = path[:1] + [tk]
            cur = {'path': list(path), 'a': [], 'g': [], 'markspans': [], 'page': page.number + 1}
            rows.append(cur)
            flush_into(cur, [s for s in content if y0 <= s['y0'] < y1])
    out = []
    for r in rows:
        mk = [int(s['t'].strip()) for s in r['markspans'] if re.match(r'^\d{1,2}$', s['t'].strip())]
        n_ao = sum(1 for s in r['markspans'] if re.match(r'^\(AO', s['t'].strip()))
        if n_ao > 1 and len(mk) == n_ao:
            mk = [sum(mk)]          # a mark split across assessment objectives: "1 (AO1) 2 (AO3)"
        ans = [row_text(x['s'], gap=26) for x in rows_of(r['a'])]
        gd = [row_text(x['s']) for x in rows_of(r['g'])]
        out.append({'path': r['path'], 'mark': max(mk) if mk else None, 'answer': ans, 'guidance': gd})
    return out


def ms_body(rows):
    lines = []
    for ln in rows:
        ln = ln.strip()
        if not ln:
            continue
        if re.match(r'^[•\-]\s*', ln) or not lines:
            lines.append(re.sub(r'^[•\-]\s*', '• ', ln))
        elif re.match(r'^(\d+ marks?|Mark Band|Level \d|Max(imum)? \d|Up to|1 mark|Award|e\.g\.|Example|Note|AO\d)', ln, re.I) or ' | ' in ln or ' | ' in lines[-1]:
            lines.append(ln)
        else:
            lines[-1] += ' ' + ln
    return lines


QER_LEVELS = [
    {'level': 3, 'marks': '6-8', 'descriptor': 'Thorough knowledge and understanding of a wide range of considerations in relation to the question. Knowledge and understanding are consistently applied to the context of the question. The candidate is able to weigh up both sides of the discussion and includes reference to the impact on all areas, showing thorough recognition of influencing factors. Material is well organised and the answer is clear and coherent, with relevant information in a logical structure.'},
    {'level': 2, 'marks': '3-5', 'descriptor': 'Reasonable knowledge and understanding of a range of considerations in relation to the question. Knowledge and understanding are not consistently applied to the context of the question. The candidate makes a reasonable attempt to discuss the impact on most areas, showing reasonable recognition of influencing factors. There is a line of reasoning presented with some structure; the information presented is in the most part relevant and supported by some evidence.'},
    {'level': 1, 'marks': '1-2', 'descriptor': 'Basic knowledge of considerations with limited understanding shown. Limited, if any, application of knowledge and understanding to the context of the question. The candidate makes a limited attempt to discuss the impact on some areas, showing limited recognition of influencing factors. The information is basic and communicated in an unstructured way; the information is supported by limited evidence and the relationship to the evidence may not be clear.'},
]


def parse(pid, paper, series, year, month, qpf, msf, figs, report):
    qd = pymupdf.open(os.path.join(SRC, qpf))
    md = pymupdf.open(os.path.join(SRC, msf)) if msf else qd
    toks = qp_stream(pid, qd, figs)
    leaves = build_tree(toks, paper)
    items = [leaf_item(l, paper) for l in leaves]
    msr = ms_rows(md, leaves, msf is None)
    problems = []
    for it, lf in zip(items, leaves):
        p = lf['path']
        hits = [r for r in msr if r['path'] == p]
        if not hits:
            hits = [r for r in msr if r['path'] == p[:len(r['path'])] and len(r['path']) < len(p) and not any(l['path'][:len(r['path'])] == r['path'] and l is not lf for l in leaves)]
        if not hits:   # a mark-scheme typo: "3(a)(i)" for a part with no (i)
            hits = [r for r in msr if r['path'] == p + ['i'] and not any(l['path'][:len(p) + 1] == p + ['i'] for l in leaves)]
        if not hits:
            problems.append('%s: no mark scheme' % it['label']); continue
        ans = sum((h['answer'] for h in hits), [])
        gd = sum((h['guidance'] for h in hits), [])
        mk = next((h['mark'] for h in hits if h['mark'] is not None), None)
        if mk is not None and mk != it['marks']:
            problems.append('%s: QP %d marks, MS %s' % (it['label'], it['marks'], mk))
        body = ms_body(ans)
        g = ms_body(gd)
        txt = '\n'.join(body)
        if g:
            txt += '\nGuidance: ' + ' '.join(g)
        levels = None
        if it['kind'] == 'qer':
            # answer column = this question's mark bands; guidance column = the indicative content
            flat = ' '.join(a.replace(' | ', ' ') for a in ans)
            levels = []
            for m in re.finditer(r'Mark Band (\d)\s*[–-]\s*\w+ Level\s*\((\d)\s*[–-]\s*(\d) marks\)(.*?)(?=Mark Band \d|0 marks|$)', flat):
                levels.append({'level': int(m.group(1)), 'marks': '%s-%s' % (m.group(2), m.group(3)), 'descriptor': re.sub(r'\s+', ' ', m.group(4)).strip()})
            if len(levels) != 3:
                levels = QER_LEVELS
            ind = ' '.join(gd)
            ind = re.sub(r'^.*?Indicative [Cc]ontent:?\s*', '', ind)
            txt = 'Indicative content (not prescriptive or exhaustive):\n' + '\n'.join(ms_body([x for x in gd if not re.match(r'^(The following is indicative|possible factors|that candidates may|but is not prescriptive|exhaustive|Indicative Content)', x)]))
        it['ms'] = {'body': txt.strip(), 'pts': it['kind'] != 'qer', 'levels': levels}
        if it.get('problem'):
            problems.append('%s: %s' % (it['label'], it.pop('problem')))
    total = sum(i['marks'] for i in items)
    if total != TOTAL:
        problems.append('total %d ≠ %d' % (total, TOTAL))
    report.append('%-18s %3d parts %3d marks  %s' % (pid, len(items), total, '; '.join(problems) or 'OK'))
    return {'id': pid, 'paper': paper, 'series': series, 'year': year, 'month': month, 'total': total, 'items': items}, problems


def main():
    os.makedirs(FIGDIR, exist_ok=True)
    for f in os.listdir(FIGDIR):
        os.remove(os.path.join(FIGDIR, f))
    figs, report, papers = {}, [], []
    for row in PAPERS:
        p, probs = parse(*row, figs=figs, report=report)
        if probs:
            p['problems'] = probs
        papers.append(p)
    json.dump(papers, io.open(os.path.join(OUT, 'gcse-computer-science.papers.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(figs, io.open(os.path.join(OUT, 'gcse-computer-science.figures.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('\n'.join(report))
    ok = sum(1 for p in papers if 'problems' not in p)
    print('%d/%d papers valid, %d figures' % (ok, len(papers), len(figs)))


if __name__ == '__main__':
    main()
