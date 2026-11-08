"""AQA A-level Psychology (7182) — parse real question papers + mark schemes from the PDFs.

    python training-data/a-level/alevel-build/psych_parse.py            → out/psychology.papers.json + report

Works on the PDFs directly with PyMuPDF (positions, tables and the boxed question numbers) rather than on
flattened text, so data tables, multiple-choice options, sub-parts, Paper 3 option topics and the mark-scheme
level tables come out cleanly.

Paper structure (spec 7182, from 2017):
  Paper 1  Introductory topics       A Social influence 24 · B Memory 24 · C Attachment 24 · D Psychopathology 24  = 96
  Paper 2  Psychology in context     A Approaches 24 · B Biopsychology 24 · C Research methods 48                  = 96
  Paper 3  Issues and options        A Issues and debates 24 (compulsory) · B/C/D: choose ONE topic in each (24)  = 96
Every paper is validated: marks per section/topic, question order, every item has a mark scheme.
"""
import io, json, os, re, sys
import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, '..', 'aqa-psychology'))
OUT = os.path.join(HERE, 'out')

SERIES = {'NOV20': ('November 2020', 2020), 'NOV21': ('November 2021', 2021), 'JUN22': ('June 2022', 2022), 'JUN23': ('June 2023', 2023),
          'JUN24': ('June 2024', 2024), 'JUN25': ('June 2025', 2025)}
TITLES = {1: 'Introductory topics in psychology', 2: 'Psychology in context', 3: 'Issues and options in psychology'}
SECTION_NAMES = {1: {'A': 'Social influence', 'B': 'Memory', 'C': 'Attachment', 'D': 'Psychopathology'},
                 2: {'A': 'Approaches in psychology', 'B': 'Biopsychology', 'C': 'Research methods'},
                 3: {'A': 'Issues and debates in psychology', 'B': 'Option 1', 'C': 'Option 2', 'D': 'Option 3'}}
OPTIONS = {'B': ['Relationships', 'Gender', 'Cognition and development'], 'C': ['Schizophrenia', 'Eating behaviour', 'Stress'],
           'D': ['Aggression', 'Forensic psychology', 'Addiction']}

NOISE = re.compile(r'^(Do not write|outside the|box|Extra space|Turn over.*|Turn over for .*|END OF QUESTIONS|There are no questions printed on this page|DO NOT WRITE ON THIS PAGE|ANSWER IN THE SPACES PROVIDED|'
                   r'\*\d+\*.*|IB/.*|Copyright ©.*|Copyright information.*|\d{1,2}|Question\s*number|Additional page.*|Answer all questions in this section\.?|'
                   r'Choose one topic from Section [B-D]\..*|For each question completely fill.*|If you want to change your answer.*|If you wish to return to an answer.*|'
                   r'as shown\.|CORRECT METHOD.*|WRONG METHODS.*|Only (one|two) answers? for each multiple-choice question.*|\(\d+\)\s*$|\d+\s*marks?)$', re.I)
MARKS = re.compile(r'\[\s*(\d{1,2})\s*marks?\s*\]', re.I)
SECTION = re.compile(r'^Section\s+([A-D])$')
TOPIC = re.compile(r'^Topic\s*:\s*(.+)$')
QTEXT = re.compile(r'^\s*(\d)\s{1,4}(\d)(?:\s*\.\s*(\d))?\s{2,}(\S.*)$')   # text fallback "0  9 . 1  …"


def norm(s):
    s = s.replace('’', '’').replace(' ', ' ').replace('ﬁ', 'fi').replace('ﬂ', 'fl')
    s = s.replace('', '✓').replace('', '✗').replace('', '•').replace('', '▪')   # Wingdings/Symbol glyphs
    return re.sub(r'[ \t]+', ' ', s).strip()


def page_stream(page, pno):
    """Ordered events on one page: ('q', label, y), ('tbl', rows, y), ('line', text, y, x, bold, size)."""
    tabs = page.find_tables().tables
    qboxes, data, skip = [], [], []
    for t in tabs:
        x0, y0, x1, y1 = t.bbox
        rows = t.extract()
        flat = [c for r in rows for c in r if c not in (None, '')]
        if x0 < 100 and x1 - x0 < 120 and y1 - y0 < 32 and flat and all(re.fullmatch(r'[\d.]+', str(c).strip()) for c in flat):
            qboxes.append((t.bbox, ''.join(str(c).strip() for c in flat)))
            continue
        txt = ' '.join(str(c) for c in flat)
        if re.search(r'For Examiner|Additional page|Question number', txt):
            skip.append(t.bbox); continue
        clean = [[norm(str(c or '').replace('\n', ' ')) for c in r] for r in rows]
        clean = [r for r in clean if any(r)]
        if len(clean) >= 2 and max(len(r) for r in clean) >= 2:
            data.append((t.bbox, clean))
        skip.append(t.bbox)
    inside = lambda b, boxes: any(b[0] >= B[0] - 2 and b[1] >= B[1] - 2 and b[2] <= B[2] + 2 and b[3] <= B[3] + 2 for B in boxes)
    ev, lines = [], []
    # printed figures (diagrams, graphs) are raster images in these papers: crop them out as PNGs
    figs = []
    if pno > 0:
        for im in page.get_image_info():
            x0, y0, x1, y1 = im['bbox']
            if x1 - x0 > 80 and y1 - y0 > 50:
                figs.append((x0, y0, x1, y1))
    for bb in figs:
        ev.append(('fig', bb, bb[1], bb))
    skip = skip + figs
    d = page.get_text('dict')
    for blk in d['blocks']:
        for ln in blk.get('lines', []):
            text = norm(''.join(s['text'] for s in ln['spans']))
            if not text:
                continue
            bb = ln['bbox']
            if inside(bb, [b for b, _ in qboxes]) or inside(bb, skip):
                continue
            if bb[1] < 45 and re.fullmatch(r'\d{1,2}', text):     # running page number
                continue
            bold = any('Bold' in s['font'] or (s['flags'] & 16) for s in ln['spans'])
            size = max(s['size'] for s in ln['spans'])
            lines.append([text, bb[1], bb[0], bold, size, bb])
    # A full sub-part label printed in the margin ("0 5 . 1" or "1 1 . 1 Identify …") replaces the boxed "05"
    labels = []
    for L in lines:
        m = re.match(r'^(\d)\s*(\d)\s*\.\s*(\d)\b\s*(.*)$', L[0])
        if m and L[2] < 110:
            lab = m.group(1) + m.group(2) + '.' + m.group(3)
            labels.append((lab, L[1], L[5]))
            L[0] = m.group(4).strip()
    for lab, y, bb in labels:
        qboxes = [(b, l) for b, l in qboxes if not (abs(b[1] - y) < 8 and l == lab[:2])]
        qboxes.append(((bb[0], y, bb[2], bb[3]), lab))
    for bb, lab in qboxes:
        ev.append(('q', lab, bb[1], bb))
    for bb, rows in data:
        ev.append(('tbl', rows, bb[1], bb))
    for text, y, x, bold, size, bb in lines:
        if not text:
            continue
        # text level with a question box belongs AFTER the number, not before it
        for qb, _ in qboxes:
            if abs(y - qb[1]) < 7 and x > qb[0]:
                y = qb[1] + 0.5
                break
        ev.append(('line', text, y, x, bold, size, bb))
    ev.sort(key=lambda e: (e[2], 0 if e[0] == 'q' else 1, e[3][0] if e[0] != 'line' else e[3]))
    return ev, qboxes


def merge_lines(lines):
    """Join wrapped lines into paragraphs (a new paragraph starts after a gap or at a bullet)."""
    paras, cur, last_y = [], [], None
    for text, y in lines:
        gap = last_y is not None and y - last_y > 18
        if cur and (gap or re.match(r'^[•–\-]\s', text)):
            paras.append(' '.join(cur)); cur = []
        cur.append(text); last_y = y
    if cur:
        paras.append(' '.join(cur))
    return [re.sub(r'\s+', ' ', p).strip() for p in paras if p.strip()]


CUE = re.compile(r'\b(this|these|that|the) (study|studies|investigation|researcher|researchers|psychologist|psychologists|data|results|findings|participants?|experiment|sample|scores|ratings|questionnaire|observation|interview|graph|research|information|case|scenario|therapist|teacher|doctor)\b|\bTable \d|\bFigure \d|\b(above|below)\b|\bthis data\b', re.I)
FIGDIR = os.path.join(OUT, 'figures')


def parse_qp(path, paper, pid):
    """Walk the paper's events. Content printed between two questions (after one question's marks, or after a
    section heading) is buffered and becomes the stem of the next question; MCQ options printed after the
    marks, answer tables (empty last column) and picture options stay with their own question."""
    doc = pymupdf.open(path)
    items, section, topic, opt = [], None, None, None
    cur, buf = None, []
    figs = []

    def close():
        nonlocal cur
        if cur:
            items.append(cur)
        cur = None

    def save_fig(pno, bb):
        os.makedirs(FIGDIR, exist_ok=True)
        fid = '%s-f%d' % (pid, len(figs) + 1)
        doc[pno].get_pixmap(clip=pymupdf.Rect(bb), dpi=170).save(os.path.join(FIGDIR, fid + '.png'))
        figs.append(fid)
        return fid

    for pno in range(1, len(doc)):          # page 1 is the cover
        ev, qboxes = page_stream(doc[pno], pno)
        for e in ev:
            if e[0] == 'q':
                close()
                lab = e[1]
                cur = {'q': lab[:2] + ('.' + lab[3:] if '.' in lab else ''), 'main': int(lab[:2]), 'sub': lab[3:] if '.' in lab else None,
                       'section': section, 'topic': topic, 'opt': opt, 'lines': [], 'blocks': [], 'marks': None, 'page': pno + 1,
                       'pre': buf, 'own_after': []}
                buf = []
                continue
            if e[0] in ('tbl', 'fig'):
                val = e[1] if e[0] == 'tbl' else save_fig(pno, e[1])
                if cur is not None and cur['marks'] is None:
                    cur['blocks'].append((e[0], val, e[2]))
                elif cur is not None and e[0] == 'tbl' and len(val) > 1 and all(not (r[-1] or '').strip() for r in val[1:]):
                    cur['own_after'].append(('tbl', val, e[2]))        # an answer grid to fill in
                elif cur is not None and e[0] == 'fig' and cur.get('is_mcq') and not cur.get('optlines'):
                    cur['own_after'].append(('fig', val, e[2])); cur['fig_options'] = True     # the options are pictures
                else:
                    buf.append((e[0], val, e[2]))
                continue
            text, y, x = e[1], e[2], e[3]
            m = SECTION.match(text)
            if m:
                close(); section = m.group(1); opt = None; buf = []
                topic = SECTION_NAMES[paper].get(section)
                continue
            m = TOPIC.match(text)
            if m and paper == 3:
                close(); opt = norm(m.group(1)); topic = opt; buf = []
                continue
            if cur is not None and cur['marks'] is None and MARKS.search(text):
                before = MARKS.sub('', text).strip()           # the mark is right-aligned: check it before the margin filter
                if before and not NOISE.match(before):
                    cur['lines'].append((before, y))
                cur['marks'] = int(MARKS.search(text).group(1))
                cur['is_mcq'] = any(re.search(r'Shade (one|two|three)', l[0], re.I) for l in cur['lines'])
                continue
            if NOISE.match(text) or (x > 480 and len(text) < 14):
                continue
            if re.fullmatch(r'Section [A-D]|' + '|'.join(re.escape(v) for v in SECTION_NAMES[paper].values()) + r'|Section [B-D] continues.*', text):
                continue
            if cur is None:
                buf.append(('line', text, y))
                continue
            if cur['marks'] is None:
                mm = MARKS.search(text)
                if mm:
                    before = MARKS.sub('', text).strip()
                    if before:
                        cur['lines'].append((before, y))
                    cur['marks'] = int(mm.group(1))
                    cur['is_mcq'] = any(re.search(r'Shade (one|two|three)', l[0], re.I) for l in cur['lines'])
                else:
                    cur['lines'].append((text, y))
                continue
            # after the marks
            if cur.get('is_mcq') and re.match(r'^[A-F]\s+\S', text):
                cur.setdefault('optlines', []).append(text); cur['opt_y'] = y
            elif cur.get('is_mcq') and cur.get('optlines') and y - cur.get('opt_y', -99) < 15 and not buf:
                cur['optlines'][-1] += ' ' + text; cur['opt_y'] = y          # an option wrapped onto a second line
            elif len(text.split()) >= 5 or re.match(r'^(Table|Figure)\s+\d', text) or (buf and buf[-1][0] == 'line' and y - buf[-1][2] < 15):
                buf.append(('line', text, y))
            # else: a label printed in the answer space ("Difference", "Strength:", "2-year-olds:") – not content
    close()
    return finish_items(items, paper)


def to_blocks(seq):
    """[('line', text, y) | ('tbl', rows, y) | ('fig', id, y)] → ctx blocks in printed order."""
    blocks, lines = [], []
    for kind, val, y in seq:
        if kind == 'line':
            lines.append((val, y))
            continue
        blocks += [{'t': 'p', 'x': p} for p in merge_lines(lines)]
        lines = []
        blocks.append(grid(val) if kind == 'tbl' else {'t': 'fig', 'id': val})
    blocks += [{'t': 'p', 'x': p} for p in merge_lines(lines)]
    return blocks


def finish_items(raw, paper):
    out, stems = [], {}
    floating = None          # (scope, blocks, fresh): a shared scenario printed between questions
    for it in raw:
        scope = (it['section'], it['opt'])
        pre = to_blocks(it['pre'])
        if pre:
            floating = (scope, pre, True)            # a new scenario always applies to the next question
        elif floating and floating[0] != scope:
            floating = None
        paras = merge_lines(it['lines'])
        own = to_blocks(it['blocks'])
        if it['marks'] is None:
            # a numbered stem (e.g. "0 9  A psychologist…") shared by its sub-parts 0 9 . 1, 0 9 . 2 …
            stems[it['main']] = (floating[1] if floating else []) + [{'t': 'p', 'x': p} for p in paras] + own + to_blocks(it['own_after'])
            floating = None
            continue
        ctxb = []
        if it['main'] in stems:
            ctxb += stems[it['main']]
        if floating:
            if floating[2] or CUE.search(' '.join(paras)):
                ctxb += floating[1]
                floating = (floating[0], floating[1], False)
            else:
                floating = None                      # this question has moved on from the scenario
        ctxb += own
        after = to_blocks(it['own_after'])
        opts = []
        raw_opts = [p for p in paras if re.match(r'^[A-F]\s+\S', p)] + it.get('optlines', [])
        if it.get('is_mcq') and raw_opts:
            paras = [p for p in paras if not re.match(r'^[A-F]\s+\S', p)]
            for p in raw_opts:
                for part in re.split(r'\s(?=[A-F]\s+[A-Z(‘\'"0-9–+\-])', ' ' + p):
                    mm = re.match(r'^\s*([A-F])\s+(.+)$', part)
                    if mm:
                        opts.append([mm.group(1), mm.group(2).strip()])
        if it.get('fig_options'):
            ctxb += after
            after = []
            opts = [[L, 'Option ' + L + ' (see the figure)'] for L in 'ABCD']
        shade = next((p for p in paras if re.search(r'Shade (one|two|three)', p, re.I)), None)
        text = '\n'.join(p for p in paras if p is not shade).strip()
        o = {'q': it['q'], 'main': it['main'], 'sub': it['sub'], 'section': it['section'], 'topic': it['topic'], 'marks': it['marks'],
             'text': text + ('\n' + shade if shade else ''), 'kind': 'mcq' if opts else ('extended' if it['marks'] >= 8 else 'short'),
             'ctxb': ctxb + after, 'page': it['page']}
        if it['opt']:
            o['opt'] = {'group': it['section'], 'name': it['opt']}
        if opts:
            o['options'] = opts
        out.append(o)
    return out


def grid(rows):
    w = max(len(r) for r in rows)
    rows = [r + [''] * (w - len(r)) for r in rows]
    return {'t': 'grid', 'head': rows[0], 'rows': rows[1:]}


# ───────────────────────── mark schemes ─────────────────────────
MS_NOISE = re.compile(r'^(MARK SCHEME\s*[–-].*|\d{1,3}|Section [A-D]|Topic\s*:.*|Copyright.*|AQA retains.*|.*Lead Examiner.*)$', re.I)
AO = re.compile(r'Marks? for (this|each) (question|part)\s*:?\s*(.+)$', re.I)


def parse_ms(path, paper):
    doc = pymupdf.open(path)
    segs, cur = {}, None
    started = False
    for pno in range(len(doc)):
        page = doc[pno]
        ev, qboxes = page_stream(page, pno)
        txt = page.get_text()
        if not started:
            if not qboxes:
                continue
            started = True
        for e in ev:
            if e[0] == 'q':
                lab = e[1]
                q = lab[:2] + ('.' + lab[3:] if '.' in lab else '')
                cur = segs.setdefault(q, {'lines': [], 'levels': [], 'tables': [], 'ao': None, 'pending': (q, e[3])})
                continue
            if cur is None:
                continue
            if e[0] == 'tbl':
                rows = e[1]
                if rows and rows[0][:2] == ['Level', 'Marks']:
                    for r in rows[1:]:
                        lv, mk, desc = (r + ['', '', ''])[:3]
                        if re.search(r'\d', mk):
                            cur['levels'].append({'level': int(lv) if lv.isdigit() else 0, 'marks': mk.replace('–', '-'), 'descriptor': desc})
                else:
                    cur['tables'].append(rows)
                continue
            if e[0] == 'fig':
                continue
            text, y = e[1], e[2]
            pend = cur.get('pending')
            if pend and abs(y - pend[1][1]) < 8 and re.match(r'^\.\s*\d\b', text):
                sm = re.match(r'^\.\s*(\d)\s*(.*)$', text)
                q2 = pend[0][:2] + '.' + sm.group(1)
                old = segs.pop(pend[0]) if pend[0] in segs and not segs[pend[0]]['lines'] else None
                cur = segs.setdefault(q2, old or {'lines': [], 'levels': [], 'tables': [], 'ao': None})
                cur['pending'] = None
                text = sm.group(2).strip()
                if not text:
                    continue
            if MS_NOISE.match(text):
                continue
            m = AO.search(text)
            if m:
                cur['ao'] = m.group(3).strip()
                cur['lines'] = []        # everything before this line repeats the question
                continue
            cur['lines'].append((text, y))
    out = {}
    for q, s in segs.items():
        body = merge_lines(s['lines'])
        body = [b for b in body if not MARKS.fullmatch(b.strip()) and not re.fullmatch(r'\[?\d+ marks?\]?', b.strip())]
        # MCQ answers: "C" / "B and D" / "Answer: B"
        ans = None
        head = ' '.join(body[:4])
        letters = re.findall(r'Answer(?: key)?\s*:?\s*([A-F])\b', head)
        if letters:
            ans = ' and '.join(letters)
        else:
            for b in body[:4]:
                m = re.match(r'^(?:Answer\s*:?\s*)?([A-F](?:\s*(?:,|and|&)\s*[A-F])*)\s*$', b)
                if m:
                    ans = re.sub(r'\s+', ' ', m.group(1)); break
        o = {'ao': s['ao'], 'body': body}
        if s['levels']:
            o['levels'] = sorted(s['levels'], key=lambda l: -l['level'])
        if s['tables']:
            o['tables'] = s['tables']
        if ans:
            o['answer'] = ans
        out[q] = o
    return out


# ───────────────────────── checked by hand ─────────────────────────
# Mark-scheme answers printed as pictures (read from the AQA mark scheme PDF and checked visually).
MS_OVERRIDES = {
    ('aqa-psy-jun22-p1', '16'): {'answer': 'C', 'body': ['Answer: C – the scattergram showing a weak-to-moderate positive correlation (the AQA mark scheme reproduces scattergram C).']},
}
# Captions and text descriptions for the figures (images are cropped from the papers; descriptions written from them).
# Descriptions say what is shown without giving away answers; the AI Examiner reads them as part of the question context.
FIG_META = {
    'aqa-psy-nov20-p2-f1': ('Figure 1 The left hemisphere of the human brain',
                            'Side view of the left hemisphere, front of the brain on the left and back on the right. Five shaded areas are labelled: '
                            'A on the lower part of the front of the brain; B at the top of the brain, just in front of the central groove; '
                            'C at the top of the brain, just behind B; D at the very back of the brain; E on the side of the brain below the lateral groove.'),
    'aqa-psy-nov20-p2-f2': ('Figure 2 The relationship between daily recreational screen time and academic performance',
                            'Scattergram. Horizontal axis: daily recreational screen time (hours), 0 to 7. Vertical axis: academic performance (%), 0 to 100. '
                            'At 0–2 hours most points lie between about 60% and 100%; at 3–4 hours points are spread between about 20% and 70%; '
                            'single points at 5 hours (about 48%) and 7 hours (about 20%). Overall, performance tends to fall as screen time rises.'),
    'aqa-psy-jun22-p1-f1': ('Scattergrams A, B, C and D',
                            'Four scattergrams, each with both axes from 1 to 10 and a line of best fit. A: points slope downwards, moderately close to the line. '
                            'B: points slope upwards and lie very close to the line. C: points slope upwards but are widely scattered around the line. '
                            'D: points slope downwards and are widely scattered around the line.'),
}


# ───────────────────────── driver ─────────────────────────
def files():
    """(paper, series key, qp path, ms path)"""
    res = []
    for paper in (1, 2, 3):
        d = os.path.join(SRC, 'paper-%d' % paper)
        names = {f.upper(): f for f in os.listdir(d)}
        for key in SERIES:
            qp = names.get('AQA-7182%d-QP-%s.PDF' % (paper, key))
            ms = names.get('AQA-7182%d-MS-%s.PDF' % (paper, key)) or names.get('AQA-7182%d-W-MS-%s.PDF' % (paper, key))
            if qp and ms:
                res.append((paper, key, os.path.join(d, qp), os.path.join(d, ms)))
        for key, qpn, msn in (('SPEC1', 'AQA-7182%d-SQP.PDF', 'AQA-7182%d-SMS.PDF'), ('SPEC2', 'AQA-7182%d-SQP-2ND-SET.PDF', 'AQA-7182%d-SMS-2ND-SET.PDF')):
            qp, ms = names.get(qpn % paper), names.get(msn % paper)
            if qp and ms:
                res.append((paper, key, os.path.join(d, qp), os.path.join(d, ms)))
    return res


def validate(p):
    probs = []
    its = p['items']
    mains = [i['main'] for i in its]
    if mains != sorted(mains):
        probs.append('question order not increasing')
    labels = [i['q'] for i in its]
    dup = sorted({q for q in labels if labels.count(q) > 1})
    if dup:
        probs.append('duplicate question numbers: ' + ', '.join(dup))
    for i in its:
        if not i.get('ms'):
            probs.append('Q%s has no mark scheme' % i['q'])
        if i['kind'] == 'mcq' and not (i.get('ms') or {}).get('answer'):
            probs.append('Q%s MCQ answer not found' % i['q'])
        if not i['text']:
            probs.append('Q%s has no text' % i['q'])
    by = {}
    for i in its:
        k = (i['section'], (i.get('opt') or {}).get('name'))
        by[k] = by.get(k, 0) + i['marks']
    p['marks_by'] = {('%s%s' % (k[0], ' · ' + k[1] if k[1] else '')): v for k, v in by.items()}
    want = {1: {'A': 24, 'B': 24, 'C': 24, 'D': 24}, 2: {'A': 24, 'B': 24, 'C': 48}, 3: {'A': 24}}[p['paper']]
    for k, v in by.items():
        exp = want.get(k[0], 24)
        if v != exp:
            probs.append('section %s%s totals %d, expected %d' % (k[0], ' (' + k[1] + ')' if k[1] else '', v, exp))
    if p['paper'] == 3:
        for g in 'BCD':
            names = sorted({str((i.get('opt') or {}).get('name')) for i in its if i['section'] == g})
            if len(names) != 3:
                probs.append('section %s has topics %s' % (g, names))
    return probs


def main():
    papers, report = [], []
    for paper, key, qp, ms in files():
        pid0 = ('aqa-psy-spec%s-p%d' % (key[-1], paper)) if key.startswith('SPEC') else ('aqa-psy-%s-p%d' % (key.lower(), paper))
        items = parse_qp(qp, paper, pid0)
        msd = parse_ms(ms, paper)
        for it in items:
            it['ms'] = msd.get(it['q']) or msd.get(it['q'].split('.')[0] if it['sub'] is None else it['q'])
            ms = it['ms']
            # MCQ answers written as "D – an unconditioned stimulus" / "B Non-directional hypothesis"
            if it.get('options') and ms and not ms.get('answer') and ms.get('body'):
                letters = []
                for b in ms['body'][:3]:
                    m = re.match(r'^([A-F])(?:\s*(?:and|,|&)\s*([A-F]))?\b\s*[–\-:.]?\s*(.*)$', b)
                    if not m:
                        continue
                    for L in (m.group(1), m.group(2)):
                        if not L:
                            continue
                        opt = next((o[1] for o in it['options'] if o[0] == L), '')
                        rest = re.sub(r'\W+', ' ', m.group(3)).lower().strip()
                        # accept the letter when the text that follows starts like that option (or nothing follows)
                        if not rest or re.sub(r'\W+', ' ', opt).lower().strip()[:12] in rest or rest[:12] in re.sub(r'\W+', ' ', opt).lower():
                            letters.append(L)
                if letters:
                    ms['answer'] = ' and '.join(dict.fromkeys(letters))
        if key.startswith('SPEC'):
            series, year, pid = ('Specimen paper' + (' (set 2)' if key == 'SPEC2' else ''), 2017, 'aqa-psy-spec%s-p%d' % (key[-1], paper))
        else:
            series, year = SERIES[key]
            pid = 'aqa-psy-%s-p%d' % (key.lower(), paper)
        total = sum(i['marks'] for i in items if not i.get('opt')) + (72 if paper == 3 else 0)
        p = {'id': pid, 'paper': paper, 'year': year, 'series': series, 'key': key, 'source': 'aqa', 'title': 'Paper %d: %s' % (paper, TITLES[paper]),
             'total': total, 'minutes': 120, 'items': items}
        for it in items:
            ov = MS_OVERRIDES.get((pid, it['q']))
            if ov:
                it['ms'] = dict(it['ms'] or {}, **ov)
        probs = validate(p)
        report.append((pid, len(items), total, p.pop('marks_by'), probs))
        # The 2015/2017 specimen papers use an older layout the parser does not read reliably: only papers
        # that pass every check are published.
        if not probs:
            papers.append(p)
    os.makedirs(OUT, exist_ok=True)
    io.open(os.path.join(OUT, 'psychology.papers.json'), 'w', encoding='utf-8').write(json.dumps(papers, ensure_ascii=False, indent=1))
    used = {b['id'] for p in papers for i in p['items'] for b in i['ctxb'] if b['t'] == 'fig'}
    missing = used - set(FIG_META)
    if missing:
        print('!! figures without a caption/description: ' + ', '.join(sorted(missing)))
    io.open(os.path.join(OUT, 'psychology.figures.json'), 'w', encoding='utf-8').write(json.dumps(
        {k: {'cap': v[0], 'alt': v[1], 'file': k + '.png'} for k, v in FIG_META.items() if k in used}, ensure_ascii=False, indent=1))
    bad = 0
    for pid, n, total, by, probs in report:
        print('%-22s %2d items  total %3d  %s' % (pid, n, total, '  '.join('%s=%d' % kv for kv in by.items())))
        for pr in probs:
            print('     ! ' + pr); bad += 1
    print('%d papers, %d problems' % (len(papers), bad))


if __name__ == '__main__':
    main()
