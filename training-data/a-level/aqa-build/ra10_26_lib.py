"""Helpers for writing RA10 practice papers in the AQA 7138 (2026) format: two case studies per paper, five questions each (6, 6, 9, 9, 15)."""

SERIES = 'RA10 practice (7138 format)'


def case(name, paras, apps=None):
    """apps: list of (title, head, rows, note|None)."""
    blocks = [{'t': 'h', 'x': name}]
    for t in paras:
        blocks.append({'t': 'p', 'x': t})
    for title, head, rows, note in (apps or []):
        blocks.append({'t': 'h', 'x': title})
        blocks.append({'t': 'grid', 'head': head, 'rows': rows})
        if note:
            blocks.append({'t': 'cap', 'x': note})
    return blocks


def Q(marks, text, content, quant=False):
    return {'marks': marks, 'text': text, 'content': content, 'quant': quant or ('calculate' in text.lower())}


def paper(pid_tag, n, setname, caseA, qsA, caseB, qsB):
    items = []
    for main, qs in ((1, qsA), (2, qsB)):
        assert [q['marks'] for q in qs] == [6, 6, 9, 9, 15], [q['marks'] for q in qs]
        for i, q in enumerate(qs, 1):
            items.append({'q': '%02d.%d' % (main, i), 'main': main, 'sub': i, 'marks': q['marks'], 'text': q['text'], 'quant': q['quant'],
                          'ms': {'body': q['content']}})
    return {'id': 'ra10-26-p%d-%s' % (n, pid_tag.lower()), 'paper': n, 'source': 'ra10', 'series': SERIES, 'set': setname, 'year': '2028',
            'items': items, 'cases': {1: caseA, 2: caseB}}
