"""Convert the existing RA10 predicted papers (revision/a-level/business-2023/data/src/pp27_paper{1,2,3}.py)
into the unified AQA paper schema -> out/ra10_pp27.json"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, '..', '..', '..', 'revision', 'a-level', 'business-2023', 'data', 'src'))
sys.path.insert(0, SRC)
sys.dont_write_bytecode = True
import pp27_paper1 as P1, pp27_paper2 as P2, pp27_paper3 as P3  # noqa: E402

SERIES = 'June 2027 (predicted)'
AO = {1: 'AO1 = 1', 4: 'AO1 = 1, AO2 = 3', 6: 'AO1 = 2, AO2 = 2, AO3 = 2', 3: 'AO1 = 1, AO2 = 2', 9: 'AO1 = 2, AO2 = 3, AO3 = 4', 12: 'AO1 = 3, AO2 = 3, AO3 = 6',
      16: 'AO1 = 2, AO2 = 3, AO3 = 4, AO4 = 7', 20: 'AO1 = 4, AO2 = 3, AO3 = 5, AO4 = 8', 24: 'AO1 = 5, AO2 = 4, AO3 = 6, AO4 = 9', 25: 'AO1 = 5, AO2 = 4, AO3 = 6, AO4 = 10'}


def appendix_blocks(apps):
    out = []
    for a in apps or []:
        out.append({'t': 'h', 'x': a['title']})
        t = a.get('table')
        if t:
            out.append({'t': 'grid', 'head': t[0], 'rows': t[1:]})
        if a.get('note'):
            out.append({'t': 'cap', 'x': a['note']})
    return out


def ms_for(it):
    ms = {}
    if 'answer' in it:
        ms['answer'] = it['answer']
    if 'points' in it:
        ms['points'] = it['points']
    if 'content' in it:
        ms['body'] = it['content']
    if 'for' in it:
        ms['for'] = it['for']; ms['against'] = it['against']; ms['judge'] = it['judge']
    ms['ao'] = AO.get(it['marks'], '')
    return ms


def paper1(S, tag):
    items = []
    STMT = ['Statement 1 is true. Statement 2 is true.', 'Statement 1 is true. Statement 2 is false.', 'Statement 1 is false. Statement 2 is true.', 'Statement 1 is false. Statement 2 is false.']
    for i, m in enumerate(S['mcq'], 1):
        m = dict(m)
        if 'opts' not in m:
            m['opts'] = STMT
        items.append({'q': '%02d' % i, 'main': i, 'sub': None, 'section': 'A', 'marks': 1, 'text': m['q'], 'options': [[chr(65 + k), o] for k, o in enumerate(m['opts'])],
                      'answer': m['ans'], 'answer_text': m['opts'][ord(m['ans']) - 65], 'ms': {'why': m['why'], 'ao': 'AO1 = 1'}, 'spec': m['spec']})
    for it in S['b']:
        items.append({'q': '%02d' % it['n'], 'main': it['n'], 'sub': None, 'section': 'B', 'marks': it['marks'], 'text': it['q'], 'ms': ms_for(it), 'spec': it['spec'], 'kind': it['kind']})
    for sec, group in (('C', S['c']), ('D', S['d'])):
        for it in group:
            items.append({'q': '%02d' % it['n'], 'main': it['n'], 'sub': None, 'section': sec, 'marks': 25, 'text': it['q'], 'ms': ms_for(dict(it, marks=25)), 'spec': it['spec'], 'kind': 'evaluate'})
    return {'id': 'ra10-p1-' + tag.lower(), 'paper': 1, 'items': items, 'cases': {}}


def paper2(S, tag):
    items = []
    cases = {}
    for ci, case in enumerate(S, 1):
        blocks = [{'t': 'h', 'x': case['title']}] + [{'t': 'p', 'x': t} for t in case['text']] + appendix_blocks(case['appendices'])
        cases[ci] = blocks
        for pt in case['parts']:
            main, sub = pt['n'].split('.')
            items.append({'q': '%02d.%s' % (int(main), sub), 'main': int(main), 'sub': int(sub), 'section': None, 'marks': pt['marks'], 'text': pt['q'], 'ms': ms_for(pt), 'spec': pt['spec'], 'kind': pt['kind']})
    return {'id': 'ra10-p2-' + tag.lower(), 'paper': 2, 'items': items, 'cases': cases}


def paper3(S, tag):
    blocks = [{'t': 'h', 'x': S['title']}]
    for h, t in S['text']:
        blocks.append({'t': 'h2', 'x': h}); blocks.append({'t': 'p', 'x': t})
    blocks += appendix_blocks(S['appendices'])
    items = []
    for q in S['questions']:
        items.append({'q': '%02d' % q['n'], 'main': q['n'], 'sub': None, 'section': None, 'marks': q['marks'], 'text': q['q'], 'ms': ms_for(q), 'spec': q['spec']})
    return {'id': 'ra10-p3-' + tag.lower(), 'paper': 3, 'items': items, 'insert': blocks, 'cases': {}, 'caseTitle': S['title']}


def main():
    out = []
    for tag, s1, s2, s3 in (('A', P1.SET_A, P2.SET_A, P3.SET_A), ('B', P1.SET_B, P2.SET_B, P3.SET_B), ('C', P1.SET_C, P2.SET_C, P3.SET_C)):
        for p in (paper1(s1, tag), paper2(s2, tag), paper3(s3, tag)):
            p.update({'source': 'ra10', 'series': SERIES, 'set': tag, 'year': '2027'})
            out.append(p)
    json.dump(out, open(os.path.join(HERE, 'out', 'ra10_pp27.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for p in out:
        print(p['id'], len(p['items']), sum(i['marks'] for i in p['items']))


if __name__ == '__main__':
    main()
