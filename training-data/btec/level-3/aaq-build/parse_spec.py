"""Parse a Pearson BTEC National AAQ specification (text from extract.py) into units:
aims -> topics (A1) -> subtopics (A1.1) -> points, plus assessment criteria and assessor guidance.

python parse_spec.py <subject-folder> [...]   ->  out/<subject>.spec.json
"""
import io, json, os, re, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
L3 = os.path.dirname(HERE)

NOISE = [
    re.compile(r'^=== PAGE \d+ ===$'),
    re.compile(r'^Pearson Level 3 (Alternative|Pearson)'),
    re.compile(r'^Pearson Level 3 Alternative Academic Qualification'),
    re.compile(r'Specification\s*[–-]\s*Issue'),
    re.compile(r'^(Certificate|Extended Certificate|\(Extended Certificate\)|\(Certificate/Extended Certificate\))\s*[–-]?\s*$'),
    re.compile(r'^UNIT \d+:'),
    re.compile(r'^\d{1,3}$'),
    re.compile(r'^©'),
]
END_CONTENT = re.compile(r'^(Assessment criteria|Transferable skills|Grade descriptors|Key terms typically used in assessment|Links to other units|Essential information for|Appendix \d|Further information for teachers|Delivery guidance|Sustainability|Digital skills)\b', re.I)
TAG = re.compile(r'\s*\[(?:[A-Z]{2,3}\s*[-–]\s*[A-Z&]+(?:,\s*)?)+\]\s*')


def clean_lines(text):
    out = []
    for raw in text.split('\n'):
        s = raw.replace(' ', ' ').replace('​', '').rstrip()
        st = s.strip()
        if not st:
            out.append('')
            continue
        if any(r.search(st) for r in NOISE):
            continue
        out.append(st)
    return out


def tidy(s):
    s = TAG.sub(' ', s)
    s = re.sub(r'\s*#\s*$', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'\s+([,.;:)])', r'\1', s)
    return s


UNIT_RE = re.compile(r'^Unit (\d+):\s*(.+?)\s*$')


def find_units(lines):
    starts = []
    for i, l in enumerate(lines):
        m = UNIT_RE.match(l)
        if not m:
            continue
        nxt = [x for x in lines[i + 1:i + 6] if x]
        title = m.group(2)
        if nxt and not nxt[0].startswith('Level:') and len(nxt) > 1 and nxt[1].startswith('Level:'):
            title += ' ' + nxt[0]
            nxt = nxt[1:]
        if nxt and nxt[0].startswith('Level:') and any(x.startswith('Unit type:') for x in nxt[:3]):
            starts.append((i, int(m.group(1)), title))
    units = []
    for k, (i, n, title) in enumerate(starts):
        j = starts[k + 1][0] if k + 1 < len(starts) else len(lines)
        units.append((n, title, lines[i:j]))
    return units


def para_after(block, head, stops):
    """Text of the paragraph(s) after a heading line, until any stop heading."""
    try:
        i = next(k for k, l in enumerate(block) if l.strip().lower() == head.lower())
    except StopIteration:
        return ''
    buf = []
    for l in block[i + 1:]:
        if any(l.strip().lower().startswith(s.lower()) for s in stops):
            break
        buf.append(l)
    return tidy(' '.join(x for x in buf if x))


AIM_RE = re.compile(r'^(?:Learning aim\s+)?([A-H]):\s*(.+)$', re.I)
AIM2_RE = re.compile(r'^([A-H])\s+([A-Z][a-z].+)$')
TOPIC_RE = re.compile(r'^([A-H]\d{1,2})\s+([A-Z(].*)$')
SUB_RE = re.compile(r'^([A-H]\d{1,2}(?:\.\d+){1,3})\.?\s+(.*)$')
BUL_RE = re.compile(r'^([•▪–\-]|o(?=\s))\s*(.*)$')


def parse_content(block):
    # locate "Content" followed by "The essential content..."
    start = None
    for k, l in enumerate(block):
        if l == 'Content' and any('essential content' in x.lower() or re.match(r'^(Learning aim )?A:', x, re.I) for x in block[k + 1:k + 4]):
            start = k + 1
            break
    if start is None:
        return [], ''
    lines = []
    for l in block[start:]:
        if END_CONTENT.match(l):
            break
        lines.append(l)
    aims, intro = [], []
    cur_aim = cur_topic = cur_item = None
    last_kind = None
    for l in lines:
        if not l:
            continue
        m = AIM_RE.match(l)
        ok = m and (l.lower().startswith('learning aim') or re.match(r'^[A-H]: [A-Z]', l))
        if not ok:
            m2 = AIM2_RE.match(l)
            want = chr(ord(aims[-1]['aim']) + 1) if aims else 'A'
            if m2 and m2.group(1) == want:
                m, ok = m2, True
        if ok:
            cur_aim = {'aim': m.group(1), 'title': tidy(m.group(2)), 'desc': '', 'topics': []}
            aims.append(cur_aim)
            cur_topic = cur_item = None
            last_kind = 'aim'
            continue
        if cur_aim is None:
            intro.append(l)
            continue
        m = SUB_RE.match(l)
        if m and m.group(1)[0] == cur_aim['aim'] and (cur_topic is None or not m.group(1).startswith(cur_topic['code'] + '.')):
            tcode = m.group(1).split('.')[0]
            if not any(t['code'] == tcode for t in cur_aim['topics']):
                # content written straight as D1.1, D1.2 ... with no D1 heading
                cur_topic = {'code': tcode, 'title': cur_aim['title'], 'desc': '', 'subs': [], 'points': []}
                cur_aim['topics'].append(cur_topic)
        if m and cur_topic is not None and m.group(1).startswith(cur_topic['code'] + '.'):
            code = m.group(1)
            node = {'code': code, 'text': tidy(m.group(2)), 'points': []}
            depth = code.count('.')
            if depth == 1 or not cur_topic['subs']:
                cur_topic['subs'].append(node)
            else:
                # nested sub (A1.5.1) -> child of the last depth-1 sub
                parent = cur_topic['subs'][-1]
                parent.setdefault('subs', []).append(node)
            cur_item = node
            last_kind = 'sub'
            continue
        m = TOPIC_RE.match(l)
        if m and m.group(1)[0] == cur_aim['aim']:
            cur_topic = {'code': m.group(1), 'title': tidy(m.group(2)), 'desc': '', 'subs': [], 'points': []}
            cur_aim['topics'].append(cur_topic)
            cur_item = cur_topic
            last_kind = 'topic'
            continue
        m = BUL_RE.match(l)
        if m and m.group(2):
            lvl = {'•': 1, '▪': 1, 'o': 2, '–': 3, '-': 3}[m.group(1)]
            target = cur_item if cur_item is not None else cur_topic
            if target is None:
                continue
            pts = target.setdefault('points', [])
            if lvl == 1 or not pts:
                pts.append({'t': tidy(m.group(2)), 'c': []})
            else:
                par = pts[-1]
                if lvl == 3 and par['c']:
                    par['c'][-1].setdefault('c', []).append({'t': tidy(m.group(2))})
                else:
                    par['c'].append({'t': tidy(m.group(2))})
            last_kind = 'bullet%d' % lvl
            continue
        # continuation / description
        if last_kind == 'aim' and cur_aim and not cur_aim['topics']:
            if l[:1].islower() and not cur_aim['desc']:
                cur_aim['title'] = tidy(cur_aim['title'] + ' ' + l)
            else:
                cur_aim['desc'] = tidy(cur_aim['desc'] + ' ' + l)
            continue
        if last_kind == 'topic' and cur_topic is not None:
            if l[:1].islower() and not cur_topic['desc']:
                cur_topic['title'] = tidy(cur_topic['title'] + ' ' + l)
            else:
                cur_topic['desc'] = tidy(cur_topic['desc'] + ' ' + l)
            continue
        if last_kind == 'sub' and cur_item is not None:
            cur_item['text'] = tidy(cur_item['text'] + ' ' + l)
            continue
        if last_kind and last_kind.startswith('bullet') and cur_item is not None or (last_kind and last_kind.startswith('bullet') and cur_topic is not None):
            target = cur_item if cur_item is not None else cur_topic
            pts = target.get('points') or []
            if pts:
                node = pts[-1]
                if last_kind != 'bullet1' and node['c']:
                    node = node['c'][-1]
                    if last_kind == 'bullet3' and node.get('c'):
                        node = node['c'][-1]
                node['t'] = tidy(node['t'] + ' ' + l)
            continue
    return aims, tidy(' '.join(intro))


CRIT_RE = re.compile(r'^([A-H]{1,3})\.([PMD])(\d+)\s+(.*)$')


def parse_criteria(block):
    try:
        i = next(k for k, l in enumerate(block) if l == 'Assessment criteria')
    except StopIteration:
        return []
    crit, cur = [], None
    for l in block[i + 1:]:
        if l.startswith('Transferable skills') or l.startswith('Essential information') or l.startswith('Further information'):
            break
        if not l or l in ('Pass', 'Merit', 'Distinction') or l.lower().startswith('learning aim'):
            cur = None if l.lower().startswith('learning aim') else cur
            continue
        m = CRIT_RE.match(l)
        if m:
            cur = {'code': '%s.%s%s' % (m.group(1), m.group(2), m.group(3)), 'aims': m.group(1), 'grade': m.group(2), 'n': int(m.group(3)), 'text': m.group(4)}
            crit.append(cur)
        elif cur is not None:
            cur['text'] += ' ' + l
    for c in crit:
        c['text'] = tidy(c['text'])
    return crit


def parse_guidance(block):
    try:
        i = next(k for k, l in enumerate(block) if l.startswith('Essential information for assessment decisions'))
    except StopIteration:
        return []
    out, cur = [], None
    for l in block[i + 1:]:
        if re.match(r'^(Links to other units|Employer involvement|Transferable skills|Further information|Appendix)', l):
            break
        m = re.match(r'^Learning aims? ([A-H](?: and [A-H]|, [A-H])*)\s*$', l)
        if m:
            cur = {'aims': m.group(1), 'paras': []}
            out.append(cur)
            continue
        if cur is None:
            cur = {'aims': '', 'paras': []}
            out.append(cur)
        if not l:
            cur['paras'].append('')
            continue
        if cur['paras'] and cur['paras'][-1] != '':
            cur['paras'][-1] += ' ' + l
        else:
            if cur['paras'] and cur['paras'][-1] == '':
                cur['paras'][-1] = l
            else:
                cur['paras'].append(l)
    for g in out:
        g['paras'] = [tidy(p) for p in g['paras'] if p.strip()]
    return [g for g in out if g['paras']]


def parse_unit(n, title, block):
    meta = {}
    for l in block[:12]:
        m = re.match(r'^(Level|Unit type|Guided learning hours):\s*(.+)$', l)
        if m:
            meta[m.group(1)] = m.group(2).strip()
    stops = ['Unit introduction', 'Summary of assessment', 'Learning aims', 'Assessment outcomes', 'Content', 'Summary of unit']
    aims, intro = parse_content(block)
    u = {
        'n': n, 'title': tidy(title), 'type': meta.get('Unit type', ''), 'glh': meta.get('Guided learning hours', ''),
        'brief': para_after(block, 'Unit in brief', stops),
        'intro': para_after(block, 'Unit introduction', stops),
        'assessment': para_after(block, 'Summary of assessment', stops),
        'content_intro': intro,
        'aims': aims,
        'criteria': parse_criteria(block),
        'guidance': parse_guidance(block),
    }
    ao = para_after(block, 'Assessment outcomes', ['Content', 'Unit introduction'])
    if ao:
        u['aos'] = [tidy(x) for x in re.split(r'(?=AO\d )', ao) if x.strip().startswith('AO')]
    return u


def main(subjects):
    os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
    for subj in subjects:
        f = [p for p in glob.glob(os.path.join(L3, subj, 'text', '*.txt')) if 'spec' in os.path.basename(p).lower() and 'guide' not in os.path.basename(p).lower()]
        if not f:
            print('no spec for', subj)
            continue
        lines = clean_lines(io.open(f[0], encoding='utf-8').read())
        units = [parse_unit(n, t, b) for n, t, b in find_units(lines)]
        # keep the first full occurrence of each unit number
        seen, keep = set(), []
        for u in units:
            if u['n'] in seen or not u['aims']:
                continue
            seen.add(u['n'])
            keep.append(u)
        keep.sort(key=lambda u: u['n'])
        json.dump(keep, io.open(os.path.join(HERE, 'out', subj + '.spec.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        for u in keep:
            nt = sum(len(a['topics']) for a in u['aims'])
            ns = sum(len(t['subs']) for a in u['aims'] for t in a['topics'])
            print('%-34s U%d %-55s %-9s aims=%d topics=%d subs=%d crit=%d guide=%d' % (subj, u['n'], u['title'][:55], u['type'], len(u['aims']), nt, ns, len(u['criteria']), len(u['guidance'])))


if __name__ == '__main__':
    main(sys.argv[1:] or ['computing-aaq', 'construction-aaq', 'early-childhood-development-aaq', 'engineering-aaq', 'health-and-social-care-aaq', 'medical-science-aaq'])
