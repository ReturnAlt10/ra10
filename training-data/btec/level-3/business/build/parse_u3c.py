import re, os, json, io, sys, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bizclean as b
from parse_u3b import MS_SERIES, ms_lines
HERE = os.path.dirname(os.path.abspath(__file__))

HDR = re.compile(r'Question\s+[Nn]umber\s+(?:Answer|Indicative [Cc]ontent)?\s*Mark\s+')

def parse_ms_flat(path):
    L = ms_lines(path)
    txt = '\n'.join(L)
    # drop recurring running headers (sample assessment footers)
    txt = re.sub(r'Pearson BTEC Level 3 Nationals in Business[^\n]*\n(?:[^\n]*Issue 3[^\n]*\n)?', '', txt)
    parts = HDR.split(txt)
    out = []
    for p in parts[1:]:
        p = p.strip()
        m = re.match(r'^(\d{1,2})\s?(\(?[a-h]\)?)?(?=[\s\n]|$)\s*(.*)$', p, re.S)
        if not m:
            continue
        q = int(m.group(1)); sub = (m.group(2) or '').strip('()') or None
        body = m.group(3)
        # cut trailing section headers
        body = re.split(r'\n(?:Section [AB][^\n]*|TOTAL FOR[^\n]*)\n', body)[0]
        lev = re.search(r'\n?\s*Level\s+Mark(?:\s+Descriptor)?\s*Award up to (\d+) marks|Mark scheme \(award up to (\d+) marks\)', body)
        levels_total = None; level_text = None
        if lev:
            levels_total = int(lev.group(1) or lev.group(2))
            level_text = body[lev.start():]
            body = body[:lev.start()]
        marks = None
        mm = re.findall(r'\((\d{1,2})\)\s*$', body.strip())
        mm2 = re.findall(r'\n\((\d{1,2})\)\s*\n', '\n' + body + '\n')
        if mm2:
            marks = int(mm2[-1])
        elif mm:
            marks = int(mm[-1])
        if marks is None and levels_total:
            marks = levels_total
        body = re.sub(r'\n\(\d{1,2}\)\s*(?=\n|$)', '', body).strip()
        out.append({'q': q, 'sub': sub, 'marks': marks, 'body': body, 'levels': levels_total, 'levelText': level_text})
    return out

if __name__ == '__main__':
    allms = {}
    for f in sorted(glob.glob(os.path.join(b.TXT, 'unit3__markscheme__*.txt'))):
        name = os.path.basename(f)[len('unit3__markscheme__'):-4]
        key = MS_SERIES.get(name)
        blocks = parse_ms_flat(f)
        tot = sum((x['marks'] or 0) for x in blocks)
        qs = sorted(set(x['q'] for x in blocks))
        print(key, name[:34].ljust(34), len(blocks), 'blocks', tot, 'marks', 'q', qs[0] if qs else '-', '..', qs[-1] if qs else '-')
        allms[name] = {'series': key, 'blocks': blocks}
    io.open(os.path.join(HERE, 'u3_ms.json'), 'w', encoding='utf-8').write(json.dumps(allms, ensure_ascii=False, indent=1))
