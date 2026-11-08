"""Parse Pearson Edexcel A-level Business (9BS0) question papers and mark schemes into the RA10 paper format.

    python training-data/a-level/alevel-build/edexcel_parse.py

Reads the PDFs in training-data/a-level/edexcel-business/paper-{1,2,3}/ directly with PyMuPDF (positions matter):
  • question papers (que): "1 (a) … (4)" questions, short stems printed between questions, the extracts — printed inline
    before the questions (2017–2022) or in the Source Booklet / Insert at the back (2023–2025, and Paper 3 2019–2022) —
    with their data tables (find_tables → grid blocks), vector charts (rendered to PNG figures) and "(Source: …)" lines.
    Extract line numbers in the right margin, "DO NOT WRITE IN THIS AREA", barcodes and answer lines are dropped.
  • mark schemes (rms / msc): per question the AO weighting ("Knowledge 2, Application 2, Analysis 3, Evaluation 3"),
    the points / indicative content, and the levels table (Level, Mark, Descriptor).
Questions are linked to the extracts named in the "Read the (following) extracts (A to C) …" instruction for their
section. Only papers with zero validation problems are written (total 100, every question has marks, a mark scheme and
its extracts). Output: out/business-edexcel.papers.json + out/figures/edx-*.png
"""
import json, os, re, sys, glob
import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.abspath(os.path.join(HERE, '..', 'edexcel-business'))
OUT = os.path.join(HERE, 'out')
FIGDIR = os.path.join(OUT, 'figures')

MONTHS = {'05': 'June', '06': 'June', '10': 'October', '01': 'January', '11': 'November'}

NOISE = re.compile(r'^(\.{6,}.*|\*P\d+[A-Z]*\d*\*|Turn over|DO NOT WRITE IN THIS AREA|BLANK PAGE|P\d{5}[A-Z]*|\d{1,2}|[\s]+|'
                   r'TOTAL FOR (SECTION [AB]|PAPER) = \d+ MARKS|\(Total for Question \d+ = \d+ marks\)|Answer ALL questions\..*|'
                   r'Write your answers in the spaces provided\.?|Q\d+|©\s*\d{4}.*)$', re.I)
QSTART = re.compile(r'^(\d{1,2})\s*\(([a-h])\)\s*(.*)$')
QSUB = re.compile(r'^\(([a-h])\)\s*(.*)$')
QWHOLE = re.compile(r'^(\d{1,2})\s+([A-Z].*)$')        # a question with no sub-part, eg "2 Evaluate …"
MARKS = re.compile(r'^\((\d{1,2})\)$')
EXTRACT_HEAD = re.compile(r'^Extract\s+([A-Z])\b\s*(.*)$')
READ_EXTRACTS = re.compile(r'Read\s+(?:the\s+)?(?:following\s+)?(?:Extracts?|extracts?)\s*\(?([A-Z])\s*(?:to|and|–|-)\s*([A-Z])\)?.*?Question\s+(\d+)', re.I)
SOURCE = re.compile(r'^\((?:Sources?|Adapted)\b', re.I)


def page_lines(page):
    """Horizontal text lines with bbox, size, bold flag; rotated margin text dropped."""
    out = []
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines', []):
            if l['dir'] != (1.0, 0.0):
                continue
            t = ''.join(s['text'] for s in l['spans']).replace('\t', ' ')
            t = re.sub(r'\s+', ' ', t).strip()
            if not t:
                continue
            sp = l['spans'][0]
            out.append({'y': l['bbox'][1], 'y1': l['bbox'][3], 'x': l['bbox'][0], 'x1': l['bbox'][2], 't': t, 'size': sp['size'], 'bold': bool(sp['flags'] & 16)})
    # rows: lines whose tops are within 3pt belong to the same row, read left to right
    out.sort(key=lambda o: o['y'])
    row_y = None
    for o in out:
        if row_y is None or o['y'] - row_y > 5:
            row_y = o['y']
        o['row'] = row_y
    out.sort(key=lambda o: (o['row'], o['x']))
    # merge fragments on the same baseline (columns of one line)
    merged = []
    for o in out:
        if merged and abs(o['y'] - merged[-1]['y']) < 2.5 and o['x'] > merged[-1]['x1'] - 1 and o['size'] == merged[-1]['size'] and o['x'] - merged[-1]['x1'] < 40:
            m = merged[-1]; m['t'] += ' ' + o['t']; m['x1'] = o['x1']
        else:
            merged.append(dict(o))
    return merged


def is_noise(l, w):
    t = l['t']
    if NOISE.match(t) and not MARKS.match(t):
        # a bare number in the right margin is an extract line number; a bare number near the foot is a page number
        return True
    if l['y'] > 790:
        return True
    if l['x'] > w - 70 and re.fullmatch(r'\d{1,2}', t):
        return True
    return False


def chart_regions(page, tables):
    """Vector charts: clusters of filled shapes (bars, pie slices, plotted points) not inside a table."""
    W, H = page.rect.width, page.rect.height
    shapes = []
    for d in page.get_drawings():
        r = d['rect']
        if r.width > W * 0.8 and r.height > H * 0.6:
            continue                      # page frame
        if d.get('fill') is None and not (d.get('items') and len(d['items']) > 6):
            continue
        if r.width < 1.5 and r.height < 1.5:
            continue
        if any(pymupdf.Rect(t.bbox).contains(r) for t in tables):
            continue
        shapes.append(pymupdf.Rect(r))
    regions = []
    for r in shapes:
        for g in regions:
            if g['r'].intersects(r + (-25, -25, 25, 25)):
                g['r'] |= r; g['n'] += 1; break
        else:
            regions.append({'r': pymupdf.Rect(r), 'n': 1})
    # merge overlapping regions again
    changed = True
    while changed:
        changed = False
        for i in range(len(regions)):
            for j in range(i + 1, len(regions)):
                if regions[i]['r'].intersects(regions[j]['r'] + (-25, -25, 25, 25)):
                    regions[i]['r'] |= regions[j]['r']; regions[i]['n'] += regions[j]['n']; regions.pop(j); changed = True; break
            if changed:
                break
    return [g['r'] for g in regions if g['n'] >= 3 and g['r'].width > 80 and g['r'].height > 40]


def page_events(page, pid, pno, figs):
    W = page.rect.width
    try:
        tabs = page.find_tables().tables
    except Exception:
        tabs = []
    tabs = [t for t in tabs if t.row_count >= 2 and t.col_count >= 2]
    charts = chart_regions(page, tabs)
    lines = [l for l in page_lines(page) if not is_noise(l, W)]
    ev = []
    used = set()
    for t in tabs:
        bb = pymupdf.Rect(t.bbox)
        rows = [[re.sub(r'\s+', ' ', (c or '')).strip() for c in r] for r in t.extract()]
        rows = [r for r in rows if any(r)]
        if len(rows) < 2:
            continue
        ev.append({'y': bb.y0, 'kind': 'grid', 'head': rows[0], 'rows': rows[1:]})
        for i, l in enumerate(lines):
            if bb.contains(pymupdf.Rect(l['x'], l['y'], l['x1'], l['y1'])) or (bb.y0 - 1 <= l['y'] <= bb.y1 and bb.x0 - 5 <= l['x'] <= bb.x1):
                used.add(i)
    STRUCT = lambda t: bool(SOURCE.match(t) or EXTRACT_HEAD.match(t) or QSTART.match(t) or QSUB.match(t) or MARKS.match(t)
                            or READ_EXTRACTS.search(t) or re.match(r'^(SECTION [AB]|Context|Research)\b', t))
    for r in charts:
        # include the axis labels / legend that sit just around the shapes
        clip = pymupdf.Rect(r.x0 - 60, r.y0 - 22, r.x1 + 60, r.y1 + 30) & page.rect
        inside = [i for i, l in enumerate(lines) if i not in used and clip.y0 <= l['y'] <= clip.y1 and not STRUCT(l['t'])]
        # a real chart carries several short labels/values; answer grids (none) and text boxes (long lines) are not charts
        short = [i for i in inside if len(lines[i]['t']) <= 28 and r.x0 - 60 <= lines[i]['x'] <= r.x1 + 60]
        longl = [i for i in inside if len(lines[i]['t']) > 60 and r.y0 <= lines[i]['y'] <= r.y1]
        if len(short) < 3 or len(longl) > 2 or any(STRUCT(l['t']) and r.y0 <= l['y'] <= r.y1 for l in lines):
            continue
        # a bold title immediately above the chart stays as a caption line
        mine = set()
        for i in inside:
            l = lines[i]
            if l['bold'] and l['y'] < r.y0 - 4:
                continue
            clip |= pymupdf.Rect(l['x'] - 4, l['y'] - 2, l['x1'] + 4, l['y1'] + 2)
            used.add(i); mine.add(i)
        # never crop into a title above the chart or a "(Source: …)" line below it – they stay as text
        for l in lines:
            if SOURCE.match(l['t']) and r.y1 - 2 <= l['y'] <= clip.y1:
                clip.y1 = min(clip.y1, l['y'] - 2)
            if (l['bold'] or EXTRACT_HEAD.match(l['t'])) and clip.y0 <= l['y1'] <= r.y0 + 2 and l['y'] < r.y0:
                clip.y0 = max(clip.y0, l['y1'] + 2)
        for i in mine:
            l = lines[i]
            if l['y'] >= clip.y1 or l['y1'] <= clip.y0:
                used.discard(i)
        fid = '%s-f%d' % (pid, len(figs) + 1)
        pix = page.get_pixmap(clip=clip, dpi=170)
        os.makedirs(FIGDIR, exist_ok=True)
        pix.save(os.path.join(FIGDIR, fid + '.png'))
        figs[fid] = {'src': 'figures/%s.png' % fid, 'w': pix.width, 'h': pix.height, 'page': pno + 1}
        ev.append({'y': clip.y0, 'kind': 'fig', 'id': fid})
    for i, l in enumerate(lines):
        if i not in used:
            ev.append({'y': l['y'], 'kind': 'line', 'l': l})
    ev.sort(key=lambda e: e['y'])
    return ev


def series_of(fname):
    m = re.search(r'(20\d\d)(\d\d)(\d\d)', fname)
    y, mo = m.group(1), m.group(2)
    return '%s %s' % (MONTHS.get(mo, 'June'), y), y, mo


def parse_qp(path, pid):
    doc = pymupdf.open(path)
    figs = {}
    items, extracts, ranges = [], {}, {}
    context = []                 # Paper 3 "Context" statement in the insert
    section = 'A'
    cur_q = None                 # question being written
    cur_ext = None
    stem = []                    # paragraph(s) printed between questions → stem of the next question
    mode = 'q'
    last_main = 0
    para = []
    problems = []

    def flush_para():
        nonlocal para
        if para and cur_ext is not None:
            txt = ' '.join(para).strip()
            if txt:
                cur_ext['blocks'].append({'t': 'p', 'x': txt})
        para = []

    def end_extract():
        nonlocal cur_ext
        flush_para()
        cur_ext = None

    for pno, page in enumerate(doc):
        if pno == 0:
            continue
        txt = page.get_text()
        if re.search(r'Every effort has been made to contact copyright', txt) and len(txt) < 900:
            continue
        evs = page_events(page, pid, pno, figs)
        prev_y = None
        for e in evs:
            if e['kind'] in ('grid', 'fig'):
                blk = {'t': 'grid', 'head': e['head'], 'rows': e['rows']} if e['kind'] == 'grid' else {'t': 'fig', 'id': e['id']}
                if cur_ext is not None:
                    flush_para(); cur_ext['blocks'].append(blk)
                elif cur_q is not None:
                    cur_q['ctx_extra'].append(blk)
                else:
                    stem.append(blk)
                continue
            l = e['l']; t = l['t']
            if re.search(r'Every effort has been made to contact copyright', t):
                break
            if re.match(r'^SECTION ([AB])$', t):
                end_extract(); section = t[-1]; mode = 'q'; continue
            m = READ_EXTRACTS.search(t)
            if m:
                end_extract()
                a, b, qn = m.group(1), m.group(2), int(m.group(3))
                ranges[qn] = [chr(c) for c in range(ord(a), ord(b) + 1)]
                continue
            if re.match(r'^(Source Booklet|Insert|Do not return this (Booklet|insert).*|Pearson Edexcel Level 3 GCE|Business|Advanced|Paper reference.*|PAPER \d:.*|Time.*|Morning.*|Afternoon.*|(Mon|Tues|Wednes|Thurs|Fri)day \d+ \w+ \d{4}|9BS0/0\d)$', t, re.I):
                end_extract(); continue
            m = EXTRACT_HEAD.match(t)
            if m and l['x'] < 120 and (l['bold'] or len(t) < 14):
                end_extract()
                if cur_q is not None:
                    problems.append('extract inside unfinished question ' + str(cur_q['label'])); cur_q = None
                cur_ext = {'letter': m.group(1), 'title': m.group(2).strip(), 'blocks': [], 'section': section}
                extracts[m.group(1)] = cur_ext
                mode = 'ext'; prev_y = l['y']; continue
            if cur_ext is not None:
                if not cur_ext['title'] and not cur_ext['blocks'] and not para and l['bold']:
                    cur_ext['title'] = t; prev_y = l['y']; continue
                cont = (para and para[-1].startswith('(Source') and not para[-1].endswith(')') and l['size'] <= 10.6
                        and not (QSTART.match(t) or QSUB.match(t) or MARKS.match(t) or EXTRACT_HEAD.match(t)))
                if para and para[-1].startswith('(Source') and not cont and not SOURCE.match(t):
                    cur_ext['blocks'].append({'t': 'cap', 'x': para.pop()})
                if SOURCE.match(t) or cont:
                    if para and not para[-1].startswith('(Source'):
                        flush_para()
                    if para and para[-1].startswith('(Source'):
                        para[-1] += ' ' + t
                    else:
                        para.append(t)
                    if para[-1].endswith(')'):
                        cur_ext['blocks'].append({'t': 'cap', 'x': para.pop()})
                        flush_para()
                    prev_y = l['y']; continue
                # a question start ends the extract (inline layout)
                if not (QSTART.match(t) or (QSUB.match(t) and l['x'] > 60)):
                    if l['bold'] and len(t) < 90 and not para:
                        cur_ext['blocks'].append({'t': 'h', 'x': t}); prev_y = l['y']; continue
                    if prev_y is not None and l['y'] - prev_y > 20:
                        flush_para()
                    para.append(t); prev_y = l['y']; continue
                end_extract()
            # Paper 3 context statement ("Context / This year the context is …"), up to the "Research" heading
            if (t == 'Context' or t.startswith('Context This year')) and cur_q is None:
                mode = 'context'
                if t != 'Context':
                    context.append(t[len('Context '):])
                continue
            if mode == 'context':
                if re.match(r'^(Research|SECTION|Extract|Read )', t) or QSTART.match(t):
                    mode = 'q'
                else:
                    context.append(t); continue
            if re.match(r'^(Research|To prepare for this year.s context.*|–\s.*)$', t) and cur_q is None and not stem:
                continue
            m = QSTART.match(t)
            sm = QSUB.match(t) if not m and 55 < l['x'] < 130 else None
            wm = QWHOLE.match(t) if not m and not sm and l['x'] < 60 and re.match(r'^\d+\s', t) and int(t.split()[0]) == last_main + 1 else None
            if m or sm or wm:
                if cur_q is not None:
                    problems.append('no marks for ' + cur_q['label'])
                if m:
                    qn, sub, rest = int(m.group(1)), m.group(2), m.group(3)
                elif sm:
                    # "(a)" with the question number printed on its own line (dropped as a bare number) starts the next question
                    qn, sub, rest = (last_main + 1 if sm.group(1) == 'a' else last_main), sm.group(1), sm.group(2)
                else:
                    qn, sub, rest = int(wm.group(1)), None, wm.group(2)
                last_main = qn
                cur_q = {'q': qn, 'sub': sub, 'label': '%d%s' % (qn, '(%s)' % sub if sub else ''), 'section': section, 'text': [rest] if rest else [],
                         'stem': stem, 'ctx_extra': []}
                stem = []
                mode = 'qtext'; continue
            mk = MARKS.match(t)
            if mk and l['x'] > 380:
                if cur_q is None:
                    problems.append('marks with no question p%d' % (pno + 1)); continue
                cur_q['marks'] = int(mk.group(1))
                items.append(cur_q); cur_q = None; mode = 'q'; continue
            mk3 = re.match(r'^(.*\S)\s+\((\d{1,2})\)$', t)
            if cur_q is not None and mk3 and l['x1'] > 440:
                cur_q['text'].append(mk3.group(1)); cur_q['marks'] = int(mk3.group(2))
                items.append(cur_q); cur_q = None; mode = 'q'; continue
            if cur_q is not None:
                cur_q['text'].append(t); continue
            if re.match(r'^(Answer ALL|Write your answers)', t):
                continue
            stem.append(t)
    end_extract()
    if cur_q is not None:
        problems.append('unfinished ' + cur_q['label'])
    return items, extracts, ranges, context, figs, problems


ROWHEAD = re.compile(r'^(Question\s*(Number)?|Answer|Mark|Number|Indicative content|Question Number Answer Mark|Level Mark Descriptor)$', re.I)
QID = re.compile(r'^(\d{1,2})\s*\(\s*([a-h])\s*\)?(?:\s*\(?([ivx]+)\)?)?$|^(\d{1,2})$')
AOLINE = re.compile(r'^(Knowledge|Application|Analysis|Evaluation)\s+\d', re.I)
LEVEL_ROW = re.compile(r'^Level\s+(\d)\s+(\d{1,2})\s*[–-]\s*(\d{1,2})\b\s*(.*)$')


def parse_ms(path):
    """Return {label: {'ao': str, 'body': [lines], 'marks': int|None, 'levels': [ {level, marks, descriptor} ]}}."""
    doc = pymupdf.open(path)
    out = {}
    cur = None
    lev = None
    pend_level = None
    pend_band = None
    for pno, page in enumerate(doc):
        if pno < 2:
            # cover + general marking guidance pages
            if 'General Marking Guidance' in page.get_text() or pno == 0:
                continue
        W = page.rect.width
        lines = page_lines(page)
        rows = []
        for l in lines:
            if l['y'] > 800 or l['y'] < 30:
                continue
            rows.append(l)
        for l in rows:
            t = l['t']
            if ROWHEAD.match(t) or re.match(r'^(Question|Answer|Mark)\b.*\b(Mark|Number)$', t):
                continue
            t = t.replace('●', '•').replace('', '•').replace('', '•')
            # the question id sits in the narrow left column (a bare "0" is the level-table zero row, not a question)
            if l['x'] < 130:
                mid = re.match(r'^(\d{1,2})\s*\(\s*([a-h])\s*\)(.*)$', t)
                if mid and not LEVEL_ROW.match(t):
                    label = mid.group(1) + ('(%s)' % mid.group(2) if mid.group(2) else '')
                    rest = (mid.group(3) if mid.lastindex and mid.lastindex >= 3 else '').strip()
                    cur = out.setdefault(label, {'ao': '', 'body': [], 'marks': None, 'levels': []})
                    lev = None
                    if rest:
                        if AOLINE.match(rest):
                            cur['ao'] = rest
                        else:
                            cur['body'].append(rest)
                    continue
            if cur is None:
                continue
            lone = re.match(r'^Level\s+(\d)$', t)
            if lone and pend_band:
                # mark band printed just above its "Level N" label
                t = 'Level %s %s' % (lone.group(1), pend_band); pend_band = None; lone = None
            elif lone:
                pend_level = int(lone.group(1)); continue
            band = re.match(r'^(\d{1,2})\s*[–-]\s*(\d{1,2})\b(.*)$', t)
            if band and pend_level is None and l['x'] < 200 and cur is not None and (lev is not None or cur['levels']) :
                pend_band = '%s–%s%s' % (band.group(1), band.group(2), band.group(3)); continue
            pend_band = None
            lm = LEVEL_ROW.match(t)
            if not lm and pend_level is not None:
                pm = re.match(r'^(\d{1,2})\s*[–-]\s*(\d{1,2})\b\s*(.*)$', t)
                if pm:
                    lm = re.match(r'^Level\s+(\d)\s+(\d{1,2})\s*[–-]\s*(\d{1,2})\b\s*(.*)$', 'Level %d %s-%s %s' % (pend_level, pm.group(1), pm.group(2), pm.group(3)))
            pend_level = None
            if lm:
                lev = {'level': int(lm.group(1)), 'marks': '%s-%s' % (lm.group(2), lm.group(3)), 'descriptor': []}
                if lm.group(4).strip():
                    lev['descriptor'].append(lm.group(4).strip())
                # replace an older table for the same level (tables are printed once per question)
                cur['levels'] = [x for x in cur['levels'] if x['level'] != lev['level']] + [lev]
                continue
            if re.match(r'^0\s*•?\s*A completely inaccurate response\.?$', t) or re.match(r'^(Level\s+)?Mark\s+Descriptor', t) or t in ('Level', '0', 'A completely inaccurate response.'):
                lev = None
                continue
            mk = re.fullmatch(r'\((\d{1,2})\)', t)
            if mk and l['x'] > W * 0.75:
                cur['marks'] = int(mk.group(1)); continue
            mk2 = re.match(r'^(.*?)\s+\((\d{1,2})\)$', t)
            if mk2 and l['x1'] > W * 0.8 and lev is None:
                cur['marks'] = int(mk2.group(2)); t = mk2.group(1)
            if lev is not None and l['x'] > 120:
                lev['descriptor'].append(t); continue
            if AOLINE.match(t) and not cur['ao']:
                cur['ao'] = t; continue
            cur['body'].append(t)
    for k, v in out.items():
        for lv in v['levels']:
            lv['descriptor'] = re.sub(r'\s*•\s*', '\n• ', ' '.join(lv['descriptor'])).strip()
            if not lv['descriptor'].startswith('•'):
                lv['descriptor'] = '• ' + lv['descriptor'].lstrip('• ')
        v['levels'].sort(key=lambda x: x['level'])
    return out


def tidy_body(lines):
    """Join wrapped bullet lines back together; keep headings on their own line."""
    out = []
    for t in lines:
        t = t.replace('', '•').replace('', '•')
        if re.match(r'^(•|-|\d+\.|NB|Knowledge|Application|Analysis|Evaluation|Potential|Possible|Award|Accept|Do not|Note|Quantitative skills|QS\s*\d|Answers? (may|could)|Indicative|Arguments?|Counter|Judgement|Conclusion|Factors?|Benefits?|Costs?|Advantages?|Disadvantages?)', t) or not out:
            out.append(t)
        else:
            out[-1] += ' ' + t
    return '\n'.join(re.sub(r'\s+', ' ', x).strip() for x in out if x.strip())


def build():
    papers, allfigs, report = [], {}, []
    for n in (1, 2, 3):
        qps = sorted(f for f in glob.glob(os.path.join(SRC, 'paper-%d' % n, '*.pdf')) if re.search(r'que', f, re.I) and '(1)' not in f)
        mss = [f for f in glob.glob(os.path.join(SRC, 'paper-%d' % n, '*.pdf')) if re.search(r'[_-](rms|msc)[_-]', f, re.I)]
        for qp in qps:
            series, year, mo = series_of(os.path.basename(qp))
            ms_file = [f for f in mss if re.search(r'(%s)(\d\d)(\d\d)' % year, os.path.basename(f)) and ((mo in ('05', '06') and re.search(year + r'0[78]', os.path.basename(f))) or (mo in ('10', '11') and re.search(year + r'1[12]', os.path.basename(f))))]
            pid = 'edx-bus-%s%s-p%d' % ({'June': 'jun', 'October': 'oct'}[series.split()[0]], year[2:], n)
            if not ms_file:
                report.append((pid, ['no mark scheme'])); continue
            items, extracts, ranges, context, figs, problems = parse_qp(qp, pid)
            ms = parse_ms(ms_file[0])
            total = sum(i['marks'] for i in items)
            if total != 100:
                problems.append('total %d' % total)
            out_items = []
            for it in items:
                m = ms.get(it['label'])
                if not m:
                    problems.append('no ms for ' + it['label']); continue
                if m['marks'] and m['marks'] != it['marks']:
                    problems.append('ms marks %s != %s for %s' % (m['marks'], it['marks'], it['label']))
                letters = ranges.get(it['q'])
                if letters is None:
                    # questions that name their extracts ("Using the data in Extracts E to H …")
                    mm = re.search(r'Extracts?\s+([A-Z])(?:\s*(?:to|and)\s*([A-Z]))?', ' '.join(it['text']))
                    letters = [chr(c) for c in range(ord(mm.group(1)), ord(mm.group(2) or mm.group(1)) + 1)] if mm else []
                missing = [x for x in letters if x not in extracts]
                if missing:
                    problems.append('missing extracts %s for %s' % (missing, it['label']))
                ctxb = []
                if context and n == 3:
                    ctxb.append({'t': 'p', 'x': ' '.join(context)})
                for x in letters:
                    e = extracts.get(x)
                    if not e:
                        continue
                    ctxb.append({'t': 'h', 'x': 'Extract %s%s' % (x, (' – ' + e['title']) if e['title'] else '')})
                    ctxb.extend(e['blocks'])
                stem = [b if isinstance(b, dict) else {'t': 'p', 'x': b} for b in it['stem']]
                # join wrapped stem lines into one paragraph
                st, buf = [], []
                for b in stem:
                    if b['t'] == 'p':
                        buf.append(b['x'])
                    else:
                        if buf:
                            st.append({'t': 'p', 'x': ' '.join(buf)}); buf = []
                        st.append(b)
                if buf:
                    st.append({'t': 'p', 'x': ' '.join(buf)})
                body = tidy_body(m['body'])
                ao = m['ao']
                out_items.append({
                    'q': it['q'], 'sub': it['sub'], 'label': it['label'], 'marks': it['marks'], 'section': it['section'],
                    'ctx': [], 'ctxb': ctxb + st + it['ctx_extra'], 'text': re.sub(r'\s+', ' ', ' '.join(it['text'])).strip(),
                    'kind': 'extended' if it['marks'] >= 8 else 'short',
                    'ms': {'body': ('Marks for this question: ' + ao + '\n' if ao else '') + body, 'levels': m['levels'] or None},
                })
                if it['marks'] >= 8 and not m['levels']:
                    problems.append('no levels for ' + it['label'])
                if m['levels']:
                    lv = m['levels']
                    tops = [int(re.split(r'[–-]', x['marks'])[-1]) for x in lv]
                    if tops[-1] != it['marks'] or [x['level'] for x in lv] != list(range(1, len(lv) + 1)) or tops != sorted(tops):
                        problems.append('bad levels %s for %s' % ([(x['level'], x['marks']) for x in lv], it['label']))
            for it in out_items:
                if not it['text']:
                    problems.append('empty text ' + it['label'])
            report.append((pid, problems))
            if problems:
                continue
            papers.append({'id': pid, 'paper': n, 'series': series, 'year': year, 'month': mo, 'items': out_items, 'total': total,
                           'extracts': sorted(extracts), 'source_file': os.path.basename(qp), 'ms_file': os.path.basename(ms_file[0])})
            allfigs.update(figs)
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, 'business-edexcel.papers.json'), 'w', encoding='utf-8') as f:
        json.dump(papers, f, ensure_ascii=False, indent=1)
    with open(os.path.join(OUT, 'business-edexcel.figures.json'), 'w', encoding='utf-8') as f:
        json.dump(allfigs, f, ensure_ascii=False, indent=1)
    ok = sum(1 for _, p in report if not p)
    for pid, p in report:
        print(('OK   ' if not p else 'FAIL ') + pid, '; '.join(p[:6]))
    print('%d/%d papers valid, %d items, %d figures' % (ok, len(report), sum(len(p['items']) for p in papers), len(allfigs)))


if __name__ == '__main__':
    build()
