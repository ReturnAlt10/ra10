"""Parse the AQA 7138 specimen papers (sample set 1) -> out/aqa26_specimen.json in the unified schema.
Papers: 71381 (Unit 3.1), 71382 (Unit 3.2), 71383 (Unit 3.3). Each has two case studies (Source A / Source B) x five questions (6,6,9,9,15)."""
import re, json, os, sys
sys.dont_write_bytecode = True
import parse_aqa as P
import build_papers as B

HERE = os.path.dirname(os.path.abspath(__file__))
TXT = os.path.normpath(os.path.join(HERE, '..', 'aqa-business-2026', 'text'))
OUT = os.path.join(HERE, 'out')


def lines_of(path):
    return P.clean_lines(open(path, encoding='utf-8').read())


def qp_items(code):
    segs, lines = P.parse_qp(os.path.join(TXT, 'AQA-%s-SQP.txt' % code))
    items = []
    for seg in segs:
        before, marks, after = P.split_seg(seg)
        if marks is None:
            continue
        txt = '\n'.join(B.para_join(before))
        items.append({'main': seg['main'], 'sub': seg['sub'], 'marks': marks, 'text': txt})
    return items


def ms_blocks(code):
    raw = open(os.path.join(TXT, 'AQA-%s-SMS.txt' % code), encoding='utf-8').read()
    out = {}
    cur = None
    for ln in raw.replace(' ', ' ').split('\n'):
        s = ln.strip()
        if not s or s.startswith('=====PAGE') or re.match(r'^A-LEVEL BUSINESS', s) or re.match(r'^\d{1,2}$', s):
            continue
        m = re.match(r'^(\d) (\d)\s*\.\s*(\d)(?:\s+(\S.*))?$', s)
        if m:
            cur = '%s%s.%s' % m.groups()[:3]
            if cur not in out:
                out[cur] = [m.group(4)] if m.group(4) else []
            continue
        if cur:
            out[cur].append(s)
    return out


def case_blocks(code):
    lines = lines_of(os.path.join(TXT, 'AQA-%s-SINS.txt' % code))
    # drop cover
    txt = []
    skip = True
    for ln in lines:
        if re.match(r'^Source A', ln) and not skip:
            pass
        if re.match(r'^Source A:', ln) and skip and len(txt) == 0:
            # the first 'Source A' line may be the cover list; the real one follows a page number line
            pass
        txt.append(ln)
    # split at the second occurrence-style headings
    idxA = [i for i, l in enumerate(txt) if re.match(r'^Source A:', l)]
    idxB = [i for i, l in enumerate(txt) if re.match(r'^Source B:', l)]
    a0 = idxA[-1] if idxA else 0
    b0 = idxB[-1] if idxB else len(txt)
    noise = re.compile(r'^(SOURCE [AB] CONTINUES|TURN THE PAGE OVER|Turn over|END OF SOURCES|Sample assessment|There are no|DO NOT WRITE)', re.I)
    A = [l for l in txt[a0:b0] if not noise.match(l)]
    Bc = [l for l in txt[b0:] if not noise.match(l)]
    def mk(lines):
        head = []
        if lines and re.match(r'^Source [AB]:', lines[0]):
            head = [{'t': 'h', 'x': lines[0].rstrip('.')}]
            lines = lines[1:]
        return head + B.to_blocks(lines)
    return mk(A), mk(Bc)


def build(code, pnum):
    items = qp_items(code)
    ms = ms_blocks(code)
    caseA, caseB = case_blocks(code)
    out = []
    for it in items:
        key = '%02d.%d' % (it['main'], it['sub'])
        blk = ms.get('%d%d.%d' % (it['main'] // 10 if it['main'] >= 10 else 0, it['main'] % 10, it['sub'])) or ms.get('0%d.%d' % (it['main'], it['sub'])) or []
        ao = ''
        body = []
        for l in blk:
            m = re.match(r'^AO1\s*=.*', l)
            if m and not ao:
                ao = l.strip(); continue
            body.append(l)
        # drop the repeated question text up to [n marks]
        cut = 0
        for i, l in enumerate(body):
            if re.search(r'\[\s*\d+\s*marks?\s*\]', l):
                cut = i + 1; break
        body = [B.fix_text(x) for x in body[cut:] if x.strip() and not re.match(r'^(AO1\s*=)', x)]
        t = it['text']
        kind = {6: 'analyse', 9: 'assess', 15: 'evaluate'}.get(it['marks'], 'short')
        quant = bool(re.search(r'\bcalculat', t, re.I)) or bool(re.search(r'\bcalculat', ' '.join(body[:40]), re.I) and it['marks'] >= 9 and re.search(r'quantitative|formula', ' '.join(body), re.I))
        out.append({'q': key, 'main': it['main'], 'sub': it['sub'], 'section': 'A' if it['main'] == 1 else 'B', 'marks': it['marks'], 'text': t, 'kind': kind, 'quant': quant,
                    'ms': {'ao': ao, 'body': body}})
    return {'id': 'aqa26-sample-p%d' % pnum, 'year': '2028', 'paper': pnum, 'series': 'Sample assessment material (first exam 2028)', 'source': 'aqa', 'items': out, 'cases': {1: caseA, 2: caseB}}


if __name__ == '__main__':
    papers = []
    for code, n in (('71381', 1), ('71382', 2), ('71383', 3)):
        p = build(code, n)
        papers.append(p)
        print(p['id'], [(i['q'], i['marks'], i['quant'], len(i['ms']['body'])) for i in p['items']])
        print('   cases', len(p['cases'][1]), len(p['cases'][2]))
    json.dump(papers, open(os.path.join(OUT, 'aqa26_specimen.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
