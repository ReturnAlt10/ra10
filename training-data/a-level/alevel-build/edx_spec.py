"""Pearson Edexcel A-level Business (9BS0) specification → out/business-edexcel.spec.json

    python training-data/a-level/alevel-build/edx_spec.py

{ "1.1": {"name": "Meeting customer needs", "subs": [{"code": "1.1.1", "name": "The market", "content": ["a) Mass markets …", …]}]} }
Reads the two-column "Subject content / What students need to learn" tables by position: subtopic code and title in the
left column (x < 125), content on the right.
"""
import json, os, re
import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))
PDF = os.path.join(HERE, '..', 'edexcel-business', '9781446914694-gce2015-a-bus-web.pdf')
OUT = os.path.join(HERE, 'out', 'business-edexcel.spec.json')


def main():
    doc = pymupdf.open(PDF)
    spec, area, sub = {}, None, None
    for page in doc:
        lines = []
        for b in page.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                t = re.sub(r'\s+', ' ', ''.join(s['text'] for s in l['spans'])).strip()
                if t:
                    lines.append((round(l['bbox'][1]), l['bbox'][0], t))
        lines.sort()
        for y, x, t in lines:
            if y > 790 or re.match(r'^(Pearson Edexcel|Specification – Issue|Subject content|What students need to learn:?)', t):
                continue
            m = re.match(r'^([1-4]\.[1-6]) ([A-Z].+)$', t)
            if m and x < 100 and len(t) < 80:
                area = spec.setdefault(m.group(1), {'name': m.group(2).strip(), 'subs': []}); sub = None; continue
            m = re.match(r'^([1-4]\.[1-6]\.\d)$', t) or re.match(r'^([1-4]\.[1-6]\.\d)\s+(.*)$', t)
            if m and x < 100 and area is not None and m.group(1).startswith(next(k for k in spec if spec[k] is area)):
                sub = {'code': m.group(1), 'name': '', 'content': []}; area['subs'].append(sub)
                rest = m.group(2) if m.lastindex and m.lastindex >= 2 else ''
                if rest:
                    sub['content'].append(rest)
                continue
            if re.match(r'^(Theme [1-4]|Overview|Assessment|Content)', t):
                sub = None; continue
            if sub is None:
                continue
            if x < 150:
                sub['name'] = (sub['name'] + ' ' + t).strip(); continue
            if re.match(r'^[a-z]\)', t) or not sub['content']:
                sub['content'].append(t)
            else:
                sub['content'][-1] += ' ' + t
        if re.search(r'Assessment\s+information', page.get_text()) and len(spec) >= 20:
            break
    # tidy: "o" bullets
    for a in spec.values():
        for s in a['subs']:
            s['content'] = [re.sub(r'\s+o\s+', '; ', c).strip() for c in s['content']]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(spec, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for k, a in spec.items():
        print(k, a['name'], '|', ', '.join('%s %s' % (s['code'], s['name']) for s in a['subs']))


if __name__ == '__main__':
    main()
