import re, os, json, io, sys, glob
from ctxblocks import ctx_blocks
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = r'C:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business'

LIG = {'\ufb00': 'ff', '\ufb01': 'fi', '\ufb02': 'fl', '\ufb03': 'ffi', '\ufb04': 'ffl', '\ufb05': 'st', '\ufb06': 'st', '\uf0b7': '•', '\uf0a7': '•', '\u00a0': ' ', '\u2212': '–'}

def fixc(t):
    if not isinstance(t, str):
        return t
    for k, v in LIG.items():
        t = t.replace(k, v)
    return t

def deep(o):
    if isinstance(o, str):
        return fixc(o)
    if isinstance(o, list):
        return [deep(x) for x in o]
    if isinstance(o, dict):
        return {k: deep(v) for k, v in o.items()}
    return o

TITLES = {
 2: {'2017-06': 'RokU — augmented reality game launch', '2018-01': 'Folding bicycles', '2018-06': 'Wax Perfection — record shop', '2019-01': 'Fantastical Gaming — tabletop games',
     '2019-06': 'Starlight Classics — pop-up cinema', '2020-01': 'Cryptic Adventurers Escape Rooms', '2021-01': 'Team Ocuppola — esports team', '2022-01': 'Decreal Gear — sportswear',
     '2022-06': 'Wholly Nutritious — food boxes', '2023-01': 'Flares Skatepark', '2023-06': 'Pet Majestic', '2024-01': 'Best Rest Hotels', '2024-06': 'Funky Flasks — reusable drinkware'},
 6: {'2018-01': 'NBCC — construction (human resources)', '2018-06': 'Strines Stoves Ltd (SSLtd)', '2019-01': 'Anvil Cloud Ltd', '2019-06': 'Cookson Chemist Ltd (CCL)', '2020-01': 'Lilidays Centre — concert venue',
     '2021-01': 'Clockwise Ltd', '2022-01': 'The Fachetti Group', '2022-06': 'DingDong Ltd', '2023-01': 'MF Gyms plc', '2023-06': "Burr's Bakery", '2024-01': 'Saxon Fields Theme Park Ltd', '2024-06': 'Gale Papers Ltd'},
 7: {'2018-01': "Katie — gentleman's barber shop", '2018-06': 'New or existing coffee shop', '2019-01': 'Wear Products Ltd — market share', '2019-06': 'New ice cream business', '2020-01': 'Building renovation business',
     '2021-01': 'Hasan — electrician going self-employed', '2022-01': 'Sofia — fashion retail', '2022-06': 'Saku Education', '2023-01': 'Salazars — tapas restaurant', '2023-06': 'Marina — driving lessons',
     '2024-01': 'Ibrahim Village Cycles', '2024-06': 'Sharifa — travel consultant'},
}
THEMES = {
 6: {'2018-01': 'Human resource management', '2018-06': 'Quality management', '2019-01': 'Management and leadership; HR', '2019-06': 'Leadership and change', '2020-01': 'Management and leadership styles',
     '2021-01': 'Management and leadership', '2022-01': 'Management and HR', '2022-06': 'Human resource management', '2023-01': 'Leadership, management and culture', '2023-06': 'Leadership, motivation and development',
     '2024-01': 'Motivation and performance', '2024-06': 'Quality management and business culture'},
}
MONTH = {'01': 'January', '06': 'June'}

def sortkey(k):
    return k

def stat_merge(blocks):
    out = []
    for b in blocks:
        if b['t'] == 'stat' and not b['x'].get('q') and out and out[-1]['t'] == 'stat':
            out[-1]['x']['c'] += b['x']['c']
            out[-1]['x']['v'] += b['x']['v']
            continue
        out.append(b)
    return out

def btext(b):
    return b['x'] if isinstance(b['x'], str) else (' '.join(b['x']) if isinstance(b['x'], list) else ' '.join(map(str, b['x'].values())))

def norm(s):
    return re.sub(r'\W+', '', s.lower())

def clean_blocks(blocks, other_text=''):
    out = []
    onorm = norm(other_text)
    for b in blocks:
        t = btext(b)
        if b['t'] == 'p' and re.fullmatch(r'\d{1,3}', t.strip()):
            continue
        if b['t'] == 'p':
            t = re.sub(r'^\d{1,2}\s+(?=[A-Z])', '', t) if re.match(r'^\d{1,2}\s+[A-Z]', t) and len(t) > 80 and False else t
            t = re.sub(r'\s*TOTAL FOR PAPER = \d+ MARKS?', '', t).strip()
            t = re.sub(r'\(Total for Activity \d = \d+ marks?\)', '', t).strip()
            if not t:
                continue
            b = dict(b, x=t)
        if onorm and b['t'] == 'p' and len(norm(t)) > 50 and norm(t)[:70] in onorm:
            continue
        out.append(b)
    return stat_merge(out)

def act_kind(text, n, unit):
    t = text.lower()
    if 'presentation' in t:
        return 'presentation'
    if unit == 2:
        return 'rationale' if n == 1 else 'plan'
    return 'report'

def clean_act(a, unit):
    t = a['text']
    t = re.sub(r'TOTAL FOR PAPER = \d+ MARKS?', '', t)
    t = t.replace('\ufffd', '•').replace('\uf0b7', '•')
    t = re.sub(r'(?<=[a-z:.?])\s*•\s*', '\n• ', t)
    t = re.sub(r'\s+-\s+(?=[a-z])', '\n  – ', t)
    lines = []
    for ln in fixc(t).strip().split('\n'):
        m = re.match(r'^(•[^.]{3,90}\.)\s+([A-Z][^•]{10,})$', ln)
        if m:
            lines += [m.group(1), m.group(2)]
        else:
            lines.append(ln)
    t = '\n'.join(lines)
    return {'n': a['n'], 'marks': a['marks'], 'text': t.strip(), 'kind': act_kind(t, a['n'], unit)}

def prep_note(unit, key, parts_text):
    if unit == 2:
        sides = re.search(r'maximum of (\w+) sides of A4', parts_text)
        hrs = re.search(r'(?:spend approximately|expected to spend approximately|have) (\w+) hours', parts_text)
        pack = key >= '2022-01'
        return {'pack': pack, 'sides': sides.group(1) if sides else None}
    return {}

def build_set(unit):
    d = json.load(io.open(os.path.join(HERE, 'set_u%d.json' % unit), encoding='utf-8'))
    papers = []
    for key in sorted(d):
        v = d[key]
        y, m = key.split('-')
        A = clean_blocks(v['A'])
        atext = ' '.join(btext(b) for b in A)
        B = clean_blocks(v['B'], other_text=atext)
        acts = [clean_act(a, unit) for a in v['acts']]
        if unit == 2 and not A:
            A = [{'t': 'h', 'x': 'Part A — independent research brief'},
                 {'t': 'p', 'x': 'In this series Part A was a short brief: learners were asked to research the market for the business named in Part B independently (competitors, market size, share and structure, target market, trends, external influences and an example campaign), considering the reliability and validity of the data they collected, and to prepare up to six sides of A4 notes to take into the 3-hour Part B session.'},
                 {'t': 'p', 'x': 'The Part B scenario and the two activities (rationale and campaign plan) follow. Use the Part B information, and for practice research the market yourself, or try the more recent series that include a ready-made research pack.'}]
        # Part B often contains "Set Task" front matter: keep headings+activities in acts only; blocks after the activities are the Part B information
        # drop leading activity blocks (h Set Task ... until TOTAL) from B
        cut = 0
        for i, b in enumerate(B):
            t = btext(b)
            if b['t'] == 'p' and re.search(r'Total for Activity 2|TOTAL FOR PAPER', v['B'][i]['x'] if i < len(v['B']) and isinstance(v['B'][i]['x'], str) else ''):
                cut = i + 1
        info = []
        started = False
        for b in B:
            info.append(b)
        papers.append({
            'id': 'U%d-%s%s' % (unit, y[2:], m), 'unit': unit, 'key': key, 'series': '%s %s' % (MONTH[m], y), 'title': TITLES[unit][key],
            'theme': THEMES.get(unit, {}).get(key, ''), 'source': 'pearson', 'kind': 'set', 'total': v['total'],
            'acts': acts, 'partA': A, 'partB': info, 'prep': prep_note(unit, key, atext),
        })
    return deep(papers)

# ---------------- Unit 3 ----------------
PAPER_META = {
    '2017-06': 'Thursday 25 May 2017', '2018-01': 'Wednesday 17 January 2018', '2018-06': 'Friday 25 May 2018', '2019-01': 'January 2019', '2019-06': 'June 2019',
    '2020-01': 'January 2020', '2021-01': 'January 2021', '2022-06': 'June 2022', '2023-01': 'January 2023', '2023-06': 'Thursday 18 May 2023', '2024-01': 'Monday 15 January 2024', '2024-06': 'Thursday 16 May 2024',
}
MS_FOR = {
    '2017-06': '31463H_unit3_rms_20170817', '2018-06': '31463H_unit3_rms_20180815', '2018-01': '31463_unit_3_rms_for_level_3', '2019-01': '31463h-unit3-rms-20190313', '2019-06': '31463H_unit3_rms_20190814',
    '2020-01': '31463H_unit3_rms_20200318', '2021-01': '31463_MS_V1_18_1_21_2_', '2022-06': '31463h-unit3-rms-20220817', '2023-01': '31463h-unit3-rms-20230322', '2023-06': '31463h-unit3-rms-20230816',
    '2024-01': '31463h-unit3-rms-20240320', '2024-06': '31463h-unit-3-rms-20240814',
}

def parse_levels(text):
    if not text:
        return None
    rows = []
    for m in re.finditer(r'(?m)^\s*(?:Level\s+)?([1-4])\s+(\d+\s*[–-]\s*\d+)\s+(.*?)(?=^\s*(?:Level\s+)?[1-4]\s+\d+\s*[–-]\s*\d+\s|\Z)', text, re.S):
        desc = re.sub(r'\s*\n\s*', ' ', m.group(3)).strip()
        desc = re.sub(r'\s*•\s*', '\n• ', desc).strip()
        rows.append({'level': int(m.group(1)), 'marks': m.group(2).replace(' ', '').replace('-', '–'), 'descriptor': desc})
    return rows or None

def build_u3():
    P = json.load(io.open(os.path.join(HERE, 'u3_items.json'), encoding='utf-8'))
    M = json.load(io.open(os.path.join(HERE, 'u3_ms.json'), encoding='utf-8'))
    levels = {}
    papers = []
    for key in sorted(P):
        pv = P[key]
        y, m = key.split('-')
        msb = M.get(MS_FOR[key], {}).get('blocks', [])
        idx = {}
        for b in msb:
            idx.setdefault((b['q'], (b['sub'] or '').lower()), b)
        items = []
        matched = 0
        for n, it in enumerate(pv['items']):
            sub = (it['sub'] or '')
            if it['marks'] is None:
                continue
            ms = idx.get((it['q'], sub.lower()))
            ctx = list(it['ctx'])
            while ctx and re.fullmatch(r'\d{1,3}', ctx[0].strip()):
                ctx.pop(0)
            while ctx and re.fullmatch(r'\d{1,3}', ctx[-1].strip()):
                ctx.pop()
            text = re.sub(r'\s+1(\s+2(\s+3)?)?$', '', it['text']).strip()
            text = re.sub(r'^\d{1,2}\s+(?=[A-Z])', '', text)
            item = {'q': it['q'], 'sub': sub or None, 'marks': it['marks'], 'section': it['section'], 'ctx': ctx, 'ctxb': ctx_blocks(ctx), 'text': text, 'qTotal': it.get('qTotal')}
            if ms and (ms['marks'] is None or ms['marks'] == it['marks']):
                body = re.sub(r'\n{2,}', '\n', ms['body']).strip()
                ctxset = set(c.strip() for c in ctx if len(c.strip()) > 5)
                blines = body.split('\n')
                for bi in range(2, len(blines)):
                    if blines[bi].strip() in ctxset:
                        blines = blines[:bi]
                        break
                body = '\n'.join(blines).strip()
                if ms['levels'] and not levels.get(ms['levels']):
                    lv = parse_levels(ms['levelText'])
                    if lv and len(lv) >= 3:
                        levels[ms['levels']] = lv
                item['ms'] = {'body': body, 'levels': ms['levels'] or None}
                matched += 1
            items.append(item)
        total = sum(i['marks'] for i in items)
        names = []
        for it in items:
            for line in it['ctx'][:2]:
                mm = re.match(r"^([A-Z][a-z]+(?: [A-Z][a-z]+)?)(?: is| has| owns| runs| works| and| are|’s|'s)", line)
                if mm and mm.group(1) not in names and mm.group(1) not in ('The', 'This', 'These', 'In', 'Extract'):
                    names.append(mm.group(1))
        papers.append({
            'id': 'U3-%s%s' % (y[2:], m), 'unit': 3, 'key': key, 'series': '%s %s' % (MONTH[m], y), 'date': PAPER_META[key], 'title': ' · '.join(names[:4]) if names else 'Personal and business finance',
            'source': 'pearson', 'kind': 'exam', 'total': 100 if key <= '2020-01' else 80, 'parsedTotal': total, 'sec': pv['sec'], 'items': items, 'msMatched': matched,
        })
        print('U3', key, 'items', len(items), 'parsed', total, 'MS matched', matched)
    return deep(papers), deep(levels)

def js_write(unit, papers, extra=''):
    p = os.path.join(OUT, 'unit-%d' % unit, 'js')
    os.makedirs(p, exist_ok=True)
    s = '/* BTEC Business Unit %d — Pearson past papers (text extracted from the published papers; generated by training-data/btec/level-3/business/build). */\nwindow.BIZ_PAPERS = %s;\n%s' % (unit, json.dumps(papers, ensure_ascii=False, separators=(',', ':')), extra)
    io.open(os.path.join(p, 'papers-data.js'), 'w', encoding='utf-8', newline='\n').write(s)
    print('wrote unit', unit, len(s) // 1024, 'KB')

if __name__ == '__main__':
    import ra10_sets, ra10_u2_more, ra10_u6_more, ra10_u7_more, ra10_u3_more
    MORE = {2: ra10_u2_more.papers, 6: ra10_u6_more.papers, 7: ra10_u7_more.papers}
    for u in (2, 6, 7):
        js_write(u, build_set(u) + deep(ra10_sets.papers(u)) + deep(MORE[u]()))
    papers, levels = build_u3()
    import ra10_u3
    papers = papers + deep(ra10_u3.papers()) + deep(ra10_u3_more.papers())
    js_write(3, papers, 'window.BIZ_LEVELS = %s;\n' % json.dumps(levels, ensure_ascii=False, separators=(',', ':')))
