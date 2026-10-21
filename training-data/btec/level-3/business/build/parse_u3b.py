import re, os, json, io, sys, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bizclean as b

HERE = os.path.dirname(os.path.abspath(__file__))

PAPER_SERIES = {
    'unit3__paper__31463H_U3_June_2017': ('June 2017', '2017-06', 'Thursday 25 May 2017'),
    'unit3__paper__51800': ('January 2018', '2018-01', 'Wednesday 17 January 2018'),
    'unit3__paper__31463H_Unit_3_qp_Jun_2018': ('June 2018', '2018-06', 'Friday 25 May 2018'),
    'unit3__paper__51979': ('January 2019', '2019-01', 'January 2019'),
    'unit3__paper__61150ra': ('June 2019', '2019-06', 'June 2019'),
    'unit3__paper__31463H_unit3_que_20200318': ('January 2020', '2020-01', 'January 2020'),
    'unit3__paper__31463H_Unit_3_Jan_2021': ('January 2021', '2021-01', 'January 2021'),
    'unit3__paper__business-unit-3-31463h-june-2022': ('June 2022', '2022-06', 'June 2022'),
    'unit3__paper__p69125': ('January 2023', '2023-01', 'January 2023'),
    'unit3__paper__p74531': ('June 2023', '2023-06', 'Thursday 18 May 2023'),
    'unit3__paper__p77715': ('January 2024', '2024-01', 'Monday 15 January 2024'),
    'unit3__paper__p77767': ('June 2024', '2024-06', 'Thursday 16 May 2024'),
}
MS_SERIES = {
    '31463H_unit3_rms_20170817': '2017-06', '31463H_unit3_rms_20180815': '2018-06', '31463H_unit3_rms_20190814': '2019-06',
    '31463H_unit3_rms_20200318': '2020-01', '31463h-unit3-rms-20190313': '2019-01', '31463_MS_V1_18_1_21_2_': '2021-01',
    '31463h-unit3-rms-20220323': '2022-01', '31463h-unit3-rms-20220817': '2022-06', '31463h-unit3-rms-20230322': '2023-01',
    '31463h-unit3-rms-20230816': '2023-06', '31463h-unit3-rms-20240320': '2024-01', '31463h-unit-3-rms-20240814': '2024-06',
    '31463_unit_3_rms_for_level_3': '2018-01',
}


def ms_lines(path):
    L = []
    for n, t in b.read_pages(path):
        first = True
        for ln in t.split('\n'):
            ln = re.sub(r'[ \t ]+', ' ', ln).strip()
            if not ln:
                continue
            if first and re.fullmatch(r'\d{1,3}', ln):
                first = False
                continue
            first = False
            if re.match(r'^(©|Publications Code|All the material)', ln):
                continue
            L.append(ln)
    return b.fix_breaks('\n'.join(L)).split('\n')


LBL = re.compile(r'^(\d{1,2})\s?(\(?[a-h]\)?|\(?(?:iv|ix|v?i{0,3})\)?)?(?:\s+|$)(.*)$')


def parse_ms(path):
    L = ms_lines(path)
    blocks = []
    i = 0
    cur = None
    n = len(L)
    while i < n:
        ln = L[i]
        if ln == 'Question' and i + 1 < n and L[i + 1] == 'Number':
            # header: skip 'Question','Number','Answer Mark'/'Indicative content Mark'
            j = i + 2
            while j < n and re.match(r'^(Answer|Indicative content|Mark|Answer Mark|Indicative content Mark)$', L[j]):
                j += 1
            if cur:
                blocks.append(cur)
            cur = {'raw': []}
            i = j
            continue
        if re.match(r'^Section [AB]:', ln):
            if cur:
                blocks.append(cur)
            cur = None
            i += 1
            continue
        if cur is not None:
            cur['raw'].append(ln)
        i += 1
    if cur:
        blocks.append(cur)
    out = []
    for blk in blocks:
        raw = blk['raw']
        if not raw:
            continue
        m = re.match(r'^(\d{1,2})\s?(\(?[a-h]\)?)?(?:\s+|$)(.*)$', raw[0])
        if not m:
            continue
        q = int(m.group(1))
        sub = (m.group(2) or '').strip('()') or None
        first = m.group(3)
        body = ([first] if first else []) + raw[1:]
        # split at levels table
        lev_idx = None
        for k, ln in enumerate(body):
            if re.match(r'^Level Mark Award up to (\d+) marks', ln):
                lev_idx = k
                break
        levels_total = None
        levels_rows = None
        if lev_idx is not None:
            levels_total = int(re.match(r'^Level Mark Award up to (\d+)', body[lev_idx]).group(1))
            levels_rows = body[lev_idx:]
            body = body[:lev_idx]
        # marks = last "(n)" lone line in body
        marks = None
        for k in range(len(body) - 1, -1, -1):
            mm = re.fullmatch(r'\((\d{1,2})\)', body[k])
            if mm:
                marks = int(mm.group(1))
                body = body[:k] + body[k + 1:]
                break
        if marks is None and levels_total:
            marks = levels_total
        out.append({'q': q, 'sub': sub, 'marks': marks, 'body': body, 'levels': levels_total, 'levelRows': levels_rows})
    return out


if __name__ == '__main__':
    allms = {}
    for f in sorted(glob.glob(os.path.join(b.TXT, 'unit3__markscheme__*.txt'))):
        name = os.path.basename(f)[len('unit3__markscheme__'):-4]
        key = MS_SERIES.get(name)
        blocks = parse_ms(f)
        tot = sum((x['marks'] or 0) for x in blocks)
        print(key, name, len(blocks), 'blocks', tot, 'marks')
        allms[name] = {'series': key, 'blocks': blocks}
    io.open(os.path.join(HERE, 'u3_ms.json'), 'w', encoding='utf-8').write(json.dumps(allms, ensure_ascii=False, indent=1))
