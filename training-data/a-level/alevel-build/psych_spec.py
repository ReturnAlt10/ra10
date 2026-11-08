"""Updated AQA Psychology specification (teaching from Sept 2025) → out/psychology.spec.json  { "4.1.1": [bullet, …], … }

    python training-data/a-level/alevel-build/psych_spec.py
Bullets are the specification's own content statements (wrapped lines joined). 4.2.3 includes its sub-sections.
"""
import io, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'aqa-psychology', 'text', 'AQA-7181-7182-SP-2025-v1.4.txt')
CODES = ['4.1.1', '4.1.2', '4.1.3', '4.1.4', '4.2.1', '4.2.2', '4.2.3', '4.3.1', '4.3.2', '4.3.3', '4.3.4', '4.3.5', '4.3.6', '4.3.7', '4.3.8', '4.3.9', '4.3.10']


def main():
    lines = io.open(SRC, encoding='utf-8').read().split('\n')
    start = next(i for i, l in enumerate(lines) if re.match(r'^4\.1 Introductory topics in Psychology\s*$', l.strip()) and i > 400)
    end = next(i for i, l in enumerate(lines) if i > start and re.match(r'^5 Scheme of assessment', l.strip()))
    out, cur, bullet = {}, None, None
    for raw in lines[start:end]:
        s = raw.strip()
        if not s or s.startswith('=====PAGE') or 'Visit aqa.org.uk' in s or s.startswith('AQA AS and A-level'):
            continue
        if re.match(r'^4\.\d\s+\S', s):          # "4.2 Psychology in context": a new part — its preamble is not topic content
            cur = None; bullet = None
            continue
        m = re.match(r'^(4\.\d\.\d+)(?:\.\d)?\s+\S', s)
        if m:
            code = m.group(1)
            if code in CODES:
                cur = code; out.setdefault(cur, []); bullet = None
            continue
        if cur is None:
            continue
        if s.startswith('•'):
            bullet = re.sub(r'^•\s*', '', s)
            out[cur].append(bullet)
        elif bullet is not None and raw.startswith('    '):
            out[cur][-1] += ' ' + s
        else:
            bullet = None
    for c in CODES:
        out[c] = [re.sub(r'\s+', ' ', b).strip() for b in out.get(c, [])]
    io.open(os.path.join(HERE, 'out', 'psychology.spec.json'), 'w', encoding='utf-8').write(json.dumps(out, ensure_ascii=False, indent=1))
    for c in CODES:
        print(c, len(out[c]), (out[c][0][:70] if out[c] else '!! none'))


if __name__ == '__main__':
    main()
