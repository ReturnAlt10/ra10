"""Parse a Pearson BTEC AAQ Sample Assessment Material (question paper + mark scheme) into questions.

python parse_sam.py            -> out/<subject>.u<N>.sam.json for every *-aaq/text/unit-N__*.txt
Each question part: {id, q, sub, roman, stem, text, marks, options, ms:{answer, marks, indicative, levels}}
"""
import io, json, os, re, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
L3 = os.path.dirname(HERE)

DROP = [r'^=== PAGE', r'DO NOT WRITE IN THIS AREA', r'^\*[A-Z0-9]+\*$', r'^Turn over', r'^Pearson Level 3', r'Sample Assessment Material',
        r'^BTEC National in', r'^in [A-Z][A-Za-z ]+\(Extended Certificate\)', r'Issue \d+\s*[–-]', r'^\d{1,3}$', r'^TOTAL FOR SECTION',
        r'^Answer ALL questions', r'^Some questions must be answered', r'^answer, put a line through', r'^and then mark your new', r'^If you change your mind',
        r'^Write your answers in the spaces', r'^\.{6,}', r'^[\s.…]{6,}$', r'^©', r'^Engineering Principles - Sample', r'^Unit \d+: .* [–-] Issue', r'^S\d{5}[A-Z]$', r'^\d/\d/\d$',
        r'^\d+ \.{10,}$']
DROP = [re.compile(x) for x in DROP]
GARBLED = re.compile(r'[Ā-ɏͰ-ϿЀ-ӿ]{4,}')


def clean(text, keep_numbers=False):
    out = []
    for raw in text.split('\n'):
        s = raw.replace(' ', ' ').replace('\t', ' ').strip()
        s = s.replace('', '•').replace('', '•')
        if keep_numbers and re.match(r'^\d{1,3}$', s):
            out.append(s)
            continue
        s = re.sub(r'\.{8,}', '', s).strip()
        if not s:
            continue
        if any(r.search(s) for r in DROP):
            continue
        if GARBLED.search(s):
            continue
        out.append(s)
    return out


def norm_id(q, sub='', roman=''):
    return '%s%s%s' % (q, sub or '', roman or '')


QSTART = re.compile(r'^(\d{1,2})\s+(?:\(([a-z])\)\s*)?(?:\(([ivx]{1,4})\)\s*)?(.*)$')
PSTART = re.compile(r'^\(([a-z])\)\s*(?:\(([ivx]{1,4})\)\s*)?(.*)$')
RSTART = re.compile(r'^\(([ivx]{1,4})\)\s*(.*)$')
MARKS = re.compile(r'^\((\d{1,2})\)$')
OPT = re.compile(r'^([A-D])\s+(\S.*)$')


def parse_qp(lines, total_q_guess=20):
    parts, buf = [], []
    q = None
    sub = roman = None
    cur = None
    section = ''
    for l in lines:
        if re.match(r'^SECTION [A-Z]\b', l):
            section = l.split()[1]
            continue
        mt = re.match(r'^\(Total for Question (\d+) = (\d+) marks?\)', l)
        if mt:
            qn, tot = int(mt.group(1)), int(mt.group(2))
            if cur is not None and cur['q'] == qn and 'marks' not in cur:
                cur['marks'] = tot - sum(p['marks'] for p in parts if p['q'] == qn)
                parts.append(cur)
            elif cur is None and q == qn and buf and not any(p['q'] == qn for p in parts):
                parts.append({'q': q, 'sub': '', 'roman': '', 'section': section, 'stem': '', 'text': '\n'.join(buf), 'options': [], 'marks': tot})
            cur = None
            buf = []
            continue
        m = MARKS.match(l)
        if m and cur is None and q is not None and buf:
            # a whole question with no parts ("3 Calculate ...  (3)")
            cur = {'q': q, 'sub': '', 'roman': '', 'section': section, 'stem': '', 'text': '\n'.join(buf), 'options': []}
        if m and cur is not None:
            cur['marks'] = int(m.group(1))
            parts.append(cur)
            cur = None
            buf = []
            continue
        mq = QSTART.match(l)
        if mq and (cur is None or not cur.get('sub')) and int(mq.group(1)) in ((q or 0) + 1, (q or 0) + 2) and (mq.group(2) or mq.group(4)[:1].isupper() or mq.group(3)):
            q = int(mq.group(1)); sub = mq.group(2); roman = mq.group(3)
            cur = None
            if sub or roman:
                cur = {'q': q, 'sub': sub or '', 'roman': roman or '', 'section': section, 'stem': ' '.join(buf).strip(), 'text': mq.group(4), 'options': []}
                buf = []
            else:
                buf = [mq.group(4)]
            continue
        mp = PSTART.match(l)
        if mp and q is not None:
            want = chr(ord(sub) + 1) if (sub and cur is None) or (sub and cur is not None and cur.get('sub') == sub) else 'a'
            if mp.group(1) != want and mp.group(1) in 'ivx':
                mp = None
        mr0 = RSTART.match(l)
        if (mp or mr0) and cur is not None and q is not None:
            # the open "part" was really a stem for the parts that follow it
            buf = [x for x in (cur['stem'], cur['text']) if x]
            if mp:
                sub = cur['sub'] or sub
            else:
                sub = cur['sub'] or sub
            cur = None
        if mp and cur is None and q is not None:
            sub = mp.group(1); roman = mp.group(2)
            cur = {'q': q, 'sub': sub, 'roman': roman or '', 'section': section, 'stem': ' '.join(buf).strip(), 'text': mp.group(3), 'options': []}
            buf = []
            continue
        mr = RSTART.match(l)
        if mr and cur is None and q is not None:
            roman = mr.group(1)
            cur = {'q': q, 'sub': sub or '', 'roman': roman, 'section': section, 'stem': ' '.join(buf).strip(), 'text': mr.group(2), 'options': []}
            buf = []
            continue
        if cur is not None:
            mo = OPT.match(l)
            if mo and (cur['options'] or re.search(r'(Identify|Which|Select|Choose)', cur['text'])) and len(cur['options']) < 5:
                cur['options'].append({'k': mo.group(1), 't': mo.group(2)})
            elif cur['options'] and not OPT.match(l) and len(l) < 60 and not l.endswith('.'):
                cur['options'][-1]['t'] += ' ' + l
            else:
                cur['text'] += '\n' + l if cur['text'] else l
        else:
            mo = OPT.match(l)
            if mo and parts and not buf and len(parts[-1]['options']) < 4 and re.search(r'(Identify|Which|Select|Choose)', parts[-1]['text']) and mo.group(1) == 'ABCD'[len(parts[-1]['options'])]:
                parts[-1]['options'].append({'k': mo.group(1), 't': mo.group(2)})
                continue
            if l.startswith('Scenario') and l.strip() == 'Scenario':
                buf.append('[Scenario]')
            else:
                buf.append(l)
    for p in parts:
        p['id'] = norm_id(p['q'], p['sub'], p['roman'])
        p['text'] = re.sub(r'[ \t]+', ' ', p['text']).strip()
        p['stem'] = p['stem'].replace('[Scenario]', '\nScenario:').strip()
    return parts


MSID = re.compile(r'^(\d{1,2})\s*(?:\(?([a-z])\)?)?\s*(?:\(([ivx]{1,4})\)|([ivx]{1,4}))?\s*$')
HEAD = {'question', 'number', 'answer', 'mark', 'marks', 'working', 'indicative content', 'question number', 'answers', 'acceptable answers', 'additional guidance'}


def parse_ms(lines):
    entries = []
    cur = None
    prev_head = False
    prev_mark = True
    last_q = 0
    for l in lines:
        low = l.lower().strip()
        if low in HEAD:
            prev_head = True
            continue
        m = MSID.match(l)
        if m and (prev_head or prev_mark) and (m.group(2) or m.group(3) or m.group(4) or prev_head or int(m.group(1)) == last_q + 1):
            qn = int(m.group(1))
            if last_q <= qn <= last_q + 2:
                cur = {'q': qn, 'sub': m.group(2) or '', 'roman': m.group(3) or m.group(4) or '', 'lines': []}
                cur['id'] = norm_id(cur['q'], cur['sub'], cur['roman'])
                entries.append(cur)
                last_q = qn
                prev_head = prev_mark = False
                continue
        prev_head = False
        mk = re.match(r'^\((\d{1,2})\)$', l) or (re.match(r'^(\d{1,2})$', l) and int(l) <= 20)
        if re.match(r'^\d{2,3}$', l) and int(l) > 20:
            if cur is not None:
                cur['lines'].append(l)
            continue   # a page number (or a numeric answer): leave the mark / id state alone
        prev_mark = bool(mk)
        if cur is not None:
            cur['lines'].append(l)
    for e in entries:
        ls = e['lines']
        marks = None
        for pat in (r'^\((\d{1,2})\)$', r'^(\d{1,2})$'):
            for i in range(len(ls) - 1, -1, -1):
                mk = re.match(pat, ls[i])
                if mk and int(mk.group(1)) <= 20:
                    marks = int(mk.group(1))
                    ls = ls[:i] + ls[i + 1:]
                    break
            if marks is not None:
                break
        while ls and re.match(r'^\d{1,3}$', ls[-1]):
            ls = ls[:-1]
        txt = '\n'.join(ls)
        txt = re.sub(r'\n•\s*\n', '\n• ', '\n' + txt).strip()
        txt = re.sub(r'(^|\n)•\s*\n', r'\1• ', txt)
        txt = re.sub(r'(^|\n)o\s*\n', r'\1  - ', txt)
        # columns of single characters (binary sums, tables) -> one line each run
        out, run = [], []
        for x in txt.split('\n'):
            if len(x.strip()) <= 2 and x.strip() not in ('•', 'o'):
                run.append(x.strip())
                continue
            if run:
                out.append(' '.join(run)); run = []
            out.append(x)
        if run:
            out.append(' '.join(run))
        txt = '\n'.join(out)
        e['answer'] = txt
        e['marks'] = marks
        e['levels'] = bool(re.search(r'Level\s*\n?\s*Mark\s*\n?\s*Descriptor|award up to \d+ marks|Levels-based', txt, re.I))
        del e['lines']
    return entries


def split_paper(lines):
    """question-paper lines, mark-scheme lines"""
    try:
        a = next(i for i, l in enumerate(lines) if re.match(r'^(SECTION A|Answer ALL questions|1\s+\(a\)|1\s+[A-Z])', l))
    except StopIteration:
        a = 0
    is_head = lambda i: lines[i].lower().strip() == 'question' and i + 1 < len(lines) and lines[i + 1].lower().strip() in ('number', 'number answer', 'answer')
    c = next((i for i in range(a + 1, len(lines)) if is_head(i)), len(lines))
    b = next((i for i in range(a + 1, c) if re.match(r'^TOTAL FOR PAPER', lines[i], re.I)), None)
    if b is None:
        b = next((i for i in range(a + 1, c) if re.match(r'^(Mark [Ss]cheme|BLANK PAGE|General [Mm]arking [Gg]uidance)', lines[i])), c)
    return lines[a:b], lines[c:]


def main():
    out_all = {}
    for f in sorted(glob.glob(os.path.join(L3, '*-aaq', 'text', 'unit-*__*.txt'))):
        subj = f.split(os.sep)[-3]
        n = int(re.search(r'unit-(\d+)__', f).group(1))
        raw = io.open(f, encoding='utf-8').read()
        lines = clean(raw)
        meta = {'time': (re.search(r'Time (\d hours?(?: \d+ minutes)?|\d hour \d+ minutes)', raw) or [None, ''])[1],
                'total': int((re.search(r'total mark for this paper is (\d+)', raw) or [None, 0])[1])}
        qp, _ = split_paper(lines)
        _, ms = split_paper(clean(raw, keep_numbers=True))
        parts = parse_qp(qp)
        mse = parse_ms(ms)
        msd = {e['id']: e for e in mse}
        for p in parts:
            e = msd.get(p['id']) or msd.get(norm_id(p['q'], p['sub'])) or (msd.get(str(p['q'])) if not p['sub'] else None)
            p['ms'] = e
        got = sum(p['marks'] for p in parts)
        matched = sum(1 for p in parts if p['ms'])
        print('%-32s U%d time=%-18s total=%3d parts=%2d marks=%3d ms=%2d matched=%2d' % (subj, n, meta['time'], meta['total'], len(parts), got, len(mse), matched))
        json.dump({'meta': meta, 'parts': parts, 'ms_unmatched': [e for e in mse if not any(p['ms'] is e for p in parts)]},
                  io.open(os.path.join(HERE, 'out', '%s.u%d.sam.json' % (subj, n)), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
