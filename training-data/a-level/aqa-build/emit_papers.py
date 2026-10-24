"""Merge real AQA papers (aqa_papers_raw.json) + RA10 papers (ra10_*.json) -> js/papers-data.js for the A-level app.

Usage: python emit_papers.py <target.js> [--spec 7132]
"""
import json, os, re, sys, glob
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')

AO = {1: 'AO1 = 1', 2: 'AO1 = 1, AO2 = 1', 3: 'AO1 = 1, AO2 = 2', 4: 'AO1 = 1, AO2 = 3', 5: 'AO1 = 2, AO2 = 3', 6: 'AO1 = 3, AO2 = 3', 9: 'AO1 = 2, AO2 = 3, AO3 = 4', 12: 'AO1 = 3, AO2 = 3, AO3 = 6',
      16: 'AO1 = 2, AO2 = 3, AO3 = 4, AO4 = 7', 20: 'AO1 = 4, AO2 = 3, AO3 = 5, AO4 = 8', 24: 'AO1 = 5, AO2 = 4, AO3 = 6, AO4 = 9', 25: 'AO1 = 5, AO2 = 4, AO3 = 6, AO4 = 10'}


def ao_split(s):
    d = {}
    for k, v in re.findall(r'(AO\d)\s*=\s*(\d+)', s or ''):
        d[k] = int(v)
    return d


def kind_of(it):
    if it.get('options'):
        return 'mcq'
    if it.get('kind') in ('calc', 'short', 'analyse', 'evaluate'):
        return it['kind']
    t = it['text'].strip()
    m = it['marks']
    first = re.sub(r'^(Using|Referring|With reference)[^,]*,\s*', '', t.split('\n')[-1], flags=re.I)
    if re.search(r'\bcalculate\b|\bwork out\b', t, re.I) and m <= 5:
        return 'calc'
    if re.search(r'^(analyse|use .* to analyse|using .* analyse)', first, re.I) or re.search(r'\banalyse\b', t.split('\n')[-1], re.I):
        return 'analyse' if m >= 6 else 'short'
    if re.search(r'to what extent|do you agree|should |justify your|evaluate|would you advise|which of these|is it|will the|could the', t, re.I) and m >= 9:
        return 'evaluate'
    if m >= 16:
        return 'evaluate'
    if m >= 9:
        return 'analyse'
    return 'short'


def split_title(text):
    w = text.split()
    for n in range(1, 6):
        if len(w) >= 2 * n and w[:n] == w[n:2 * n]:
            return ' '.join(w[:n]), ' '.join(w[n:])
    return None, text


def fix_cases(cases):
    out = {}
    names = {}
    for k, blocks in cases.items():
        nb = []
        for b in blocks:
            if b['t'] == 'p' and not names.get(k):
                nm, rest = split_title(b['x'])
                if nm and len(nm) < 40:
                    names[k] = nm
                    nb.append({'t': 'h', 'x': nm})
                    b = {'t': 'p', 'x': rest}
            nb.append(b)
        out[k] = nb
        if not names.get(k):
            hs = [b['x'] for b in blocks if b['t'] == 'h' and not re.match(r'^(Appendix|Figure|Table|Source|Option)', b['x'])]
            if hs:
                names[k] = hs[0]
        if not names.get(k):
            c = company_of(blocks, [])
            if c:
                names[k] = c
    return out, names


COMPANY = re.compile(r"\b([A-Z][\w&’']*(?: [A-Z][\w&’']*){0,3} (?:Ltd|plc|Limited|PLC))\b")


def company_of(blocks, items):
    txt = ' '.join(b.get('x', '') if isinstance(b.get('x'), str) else ' '.join(b.get('x', [])) for b in blocks)
    txt += ' ' + ' '.join(i['text'] for i in items)
    c = Counter(m.group(1) for m in COMPANY.finditer(txt))
    if c:
        return c.most_common(1)[0][0]
    m = re.search(r'\(([A-Z]{2,5})\)', txt)
    return m.group(1) if m else None


def norm_item(it, levels):
    it = dict(it)
    it['kind'] = kind_of(it)
    ms = it.get('ms') or {}
    ms = dict(ms)
    if not ms.get('ao'):
        ms['ao'] = AO.get(it['marks'], '')
    ms['ao'] = re.sub(r'\s+and\s+', ', ', ms['ao']).rstrip('.;').replace('; ', ', ').replace('AO2= ', 'AO2 = ')
    if it['marks'] >= 6 and it['kind'] in ('analyse', 'evaluate') and not ms.get('levels'):
        lv = levels.get(str(it['marks']))
        if lv:
            ms['levels'] = lv
    if it['marks'] == 25 and it['kind'] == 'evaluate':
        ms['ao'] = AO[25]
    it['ms'] = ms
    it['aoSplit'] = ao_split(ms['ao'])
    return it


def title_for(p):
    pn = p['paper']
    names = {1: 'Paper 1 · Business 1', 2: 'Paper 2 · Business 2', 3: 'Paper 3 · Business 3'}
    if p['source'] == 'aqa':
        return '%s · %s' % (p['series'], names[pn])
    return 'RA10 %s · %s' % (names[pn], 'Set ' + p.get('set', ''))


def build(spec_code='7132'):
    levels = json.load(open(os.path.join(OUT, 'levels.json'), encoding='utf-8'))
    papers = []
    raw = json.load(open(os.path.join(OUT, 'aqa_papers_raw.json'), encoding='utf-8'))
    for p in raw:
        p = dict(p)
        p['source'] = 'aqa'
        papers.append(p)
    for f in sorted(glob.glob(os.path.join(OUT, 'ra10_*.json'))):
        papers += json.load(open(f, encoding='utf-8'))
    final = []
    for p in papers:
        p = dict(p)
        items = [norm_item(i, levels) for i in p['items']]
        # drop items with no text
        items = [i for i in items if i['text'].strip()]
        cases = {}
        names = {}
        if p.get('cases'):
            cases, names = fix_cases({str(k): v for k, v in p['cases'].items()})
        p['cases'] = cases
        p['caseNames'] = [names[k] for k in sorted(names, key=lambda x: int(x))] if names else []
        if p['paper'] == 3:
            p['caseNames'] = [p.get('caseTitle') or company_of(p.get('insert', []), items) or 'Case study']
        p['items'] = items
        p['total'] = 100
        p['minutes'] = 120
        p['title'] = title_for(p)
        if p['source'] == 'aqa':
            p['key'] = '%s-%d' % (p['year'], p['paper'])
        else:
            p['key'] = '%s-%d-%s' % (p.get('year', '2027'), p['paper'], p.get('set', 'A'))
        # remove empty
        final.append(p)
    return final, levels


if __name__ == '__main__':
    target = sys.argv[1]
    spec = '7132'
    final, levels = build(spec)
    js = '/* RA10 — AQA A-level Business papers: real AQA question papers + mark schemes (© AQA) and RA10 practice papers. Generated by training-data/a-level/aqa-build/emit_papers.py */\n'
    js += 'window.AQA_PAPERS = ' + json.dumps(final, ensure_ascii=False, separators=(',', ':')) + ';\n'
    js += 'window.AQA_LEVELS = ' + json.dumps(levels, ensure_ascii=False, separators=(',', ':')) + ';\n'
    open(target, 'w', encoding='utf-8').write(js)
    n_aqa = sum(1 for p in final if p['source'] == 'aqa')
    print('papers', len(final), 'aqa', n_aqa, 'ra10', len(final) - n_aqa, 'bytes', len(js))
    for p in final:
        print(p['id'], p['title'], '|', p['caseNames'], '|', Counter(i['kind'] for i in p['items']))
