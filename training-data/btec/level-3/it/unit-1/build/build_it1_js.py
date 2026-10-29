"""Turn build/it1_pearson.json (from parse_it1.py) into the site data file
revision/btec/level-3/IT-AAQ/unit-1/js/papers-data.js (window.BIZ_PAPERS + window.BIZ_LEVELS).

Only extracted question / mark-scheme text is written; the PDFs themselves are never copied to the site.
RA10 practice papers (and the reworded Summer 2026 paper) live in js/papers-ra10.js, written by hand.
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, *(['..'] * 6)))
OUT = os.path.join(ROOT, 'revision', 'btec', 'level-3', 'IT-AAQ', 'unit-1', 'js', 'papers-data.js')

META = {
    'IT1-SAM': dict(key='2025-SAM', code='60297T (sample)', title='Mobile phone shop · Company move · Click-and-collect · Gaming accessories', spec='new'),
    'IT1-2501': dict(key='2025-01', code='31760H', title='Designs for Us · Sixth form college · CG electricals · Clothes for Us', spec='old'),
    'IT1-2401': dict(key='2024-01', code='31760H', title='JRC theatre · Poppy the runner · Motor garage · Advertising company', spec='old'),
    'IT1-2306': dict(key='2023-06', code='31760H', title='Media students · Luca’s family business · Leisure centre · Seren Health Centre', spec='old'),
    'IT1-2301': dict(key='2023-01', code='31760H', title='Wedding photographer · Sports centre · GFC computing · LN-Educ charity', spec='old'),
    'IT1-2001': dict(key='2020-01', code='31760H', title='Fulmill Community Group · Bassett’s college · Joe’s new office · GBA finance', spec='old'),
    'IT1-1906': dict(key='2019-06', code='31760H', title='Wigmore College project · Football trainer · ERS Trading · Frederick’s Agency', spec='old'),
}
SPEC = {
    'new': dict(badge='2025 spec (AAQ)', badgeTone='new',
                notice='Sample assessment material for the current AAQ specification (60297T). This is the closest match to the real exam layout: 6, 9 and 12 mark extended questions.'),
    'old': dict(badge='Old spec (31760H) · still relevant', badgeTone='old',
                notice='This paper was written for the OLD specification (31760H), before the 2025 AAQ specification. Most of the content is still assessed, so it is good practice. However, some topics are now taught differently, newer topics such as emerging technologies and AI are not covered, and the extended questions use 8/10/12 marks instead of 6/9/12.'),
}

BOILER = re.compile(r'^(Answers will be credited according to.*|Mark scheme \(award up to.*|AO2 descriptors carry double weighting.*|Level (Mark )?Descriptor|Level 0 No rewardable material\.?)$')
FOOTER = re.compile(r'\s*(July 20\d\d|For information about Pearson|Pearson Education Limited\. Registered|Edexcel and BTEC are registered|VAT Reg No).*$', re.S)
LEVEL = re.compile(r'^Level (\d)\s+(\d+\s*[–-]\s*\d+)\s*(.*)$')


def split_ms(body, marks):
    body = FOOTER.sub('', body)
    body = re.sub(r'(?<=\S) o (?=[a-zA-Z(])', '\n– ', body)          # inline "o" sub-bullets
    body = re.sub(r'(?m)^o (?=\S)', '– ', body)
    lines = [l for l in body.split('\n') if l.strip()]
    cut = next((i for i, l in enumerate(lines) if l.startswith('Mark scheme (award up to') or re.match(r'^Level (Mark )?Descriptor$', l)), None)
    if marks < 6 or cut is None:
        return '\n'.join(l for l in lines if not BOILER.match(l)), None
    ind = [l for l in lines[:cut] if not BOILER.match(l)]
    levels, cur = [], None
    for l in lines[cut:]:
        if BOILER.match(l):
            continue
        m = LEVEL.match(l)
        if m:
            cur = {'level': int(m.group(1)), 'marks': re.sub(r'\s*[–-]\s*', '–', m.group(2)), 'descriptor': []}
            levels.append(cur)
            if m.group(3).strip():
                cur['descriptor'].append(m.group(3).strip())
        elif cur:
            if cur['descriptor'] and not l.startswith('•'):
                cur['descriptor'][-1] += ' ' + l
            else:
                cur['descriptor'].append(l)
    for lv in levels:
        lv['descriptor'] = ' '.join(lv['descriptor']).strip()
    return '\n'.join(ind), (levels or None)


def tidy_ctx(items):
    first = set()
    for it in items:
        if it['q'] not in first:
            first.add(it['q'])
            continue
        # a lone run of very short lines after the first part is usually a table header from the previous part
        if it['ctx'] and all(len(c) <= 8 for c in it['ctx']):
            it['ctx'] = []


def main():
    src = json.load(open(os.path.join(HERE, 'it1_pearson.json'), encoding='utf-8'))
    papers, levels_by_marks = [], {}
    for p in src:
        meta, spec = META[p['id']], SPEC[META[p['id']]['spec']]
        tidy_ctx(p['items'])
        items = []
        for it in p['items']:
            body, lv = split_ms(it['ms']['body'], it['marks'])
            if lv and str(it['marks']) not in levels_by_marks and meta['spec'] == 'new':
                levels_by_marks[str(it['marks'])] = lv
            items.append({'q': it['q'], 'sub': it['sub'], 'marks': it['marks'], 'section': 'Q' + str(it['q']),
                          'ctx': it['ctx'], 'text': it['text'], 'ms': {'body': body, 'levels': lv, **({'pts': True} if it['marks'] >= 6 and not lv else {})}})
        papers.append({'id': p['id'], 'unit': 1, 'key': meta['key'], 'series': p['series'], 'date': p['date'],
                       'title': meta['title'], 'source': 'pearson', 'kind': 'exam', 'code': meta['code'], 'spec': meta['spec'],
                       'total': p['total'], 'minutes': 120, 'items': items, **spec})
    head = ('/* BTEC Level 3 IT Unit 1 — Pearson past papers (generated by training-data/.../build/build_it1_js.py; do not edit by hand).\n'
            '   Question and mark-scheme text © Pearson Education Ltd, reformatted by RA10 for revision. */\n')
    js = head + 'window.BIZ_LEVELS = ' + json.dumps(levels_by_marks, ensure_ascii=False) + ';\n' \
        + 'window.BIZ_PAPERS = (window.BIZ_PAPERS || []).concat(' + json.dumps(papers, ensure_ascii=False) + ');\n'
    open(OUT, 'w', encoding='utf-8', newline='\n').write(js)
    print('wrote', OUT, len(js) // 1024, 'KB;', len(papers), 'papers; levels for', sorted(levels_by_marks))
    nolv = [(p['id'], i['q'], i['sub']) for p in papers for i in p['items'] if i['ms'].get('pts')]
    print('6+ mark items marked by points (no levels):', nolv)


if __name__ == '__main__':
    main()
