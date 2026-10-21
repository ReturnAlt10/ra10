import re

NUMTOK = re.compile(r'\([ivx]+\)|£?\d{1,3}(?: \d{3})+(?:\.\d+)?%?|£?\d+(?:\.\d+)?%?')
TAIL = re.compile(r'^(?P<label>.*?[A-Za-z\)\(£].*?)\s+(?P<vals>(?:\(?[£\d][\d ,.%]*\)?|\([ivx]+\))(?:\s+(?:\(?[£\d][\d ,.%]*\)?|\([ivx]+\)))*)$')


def clean_lines(lines):
    out = [l.strip() for l in lines if l.strip()]
    while out and re.fullmatch(r'\d{1,3}', out[0]):
        out.pop(0)
    return [l for l in out if l not in ('£', '(£)')]


def row_of(line):
    m = TAIL.match(line)
    if not m:
        return None
    vals = NUMTOK.findall(m.group('vals'))
    if not vals:
        return None
    label = m.group('label').strip()
    # label must not look like a sentence
    if len(label) > 48 or label.endswith('.'):
        return None
    return label, vals


def numeric_table(L, i):
    """Try to read a numeric table starting at or after i. Returns (start, end, block) or None."""
    n = len(L)
    j = i
    while j < n:
        # find first row-line
        r = row_of(L[j])
        if r:
            break
        j += 1
    else:
        return None
    # collect rows (with wrapped labels) starting at j
    rows = []
    k = j
    pend = ''
    while k < n:
        ln = L[k]
        r = row_of(ln)
        if r:
            label = (pend + ' ' + r[0]).strip() if pend else r[0]
            rows.append((label, r[1]))
            pend = ''
            k += 1
        elif len(ln) <= 28 and not ln.endswith('.') and k + 1 < n and row_of(L[k + 1]) and not re.match(r'^[A-Z][a-z]+ [A-Z]?[a-z]+ [A-Za-z]+ ', ln):
            pend = (pend + ' ' + ln).strip()
            k += 1
        else:
            break
    if len(rows) < 2:
        return None
    ncols = max(len(v) for _, v in rows)
    # header lines directly above the first row
    h = j
    hdr_lines = []
    while h > i and len(L[h - 1]) <= 60 and not L[h - 1].endswith('.'):
        hdr_lines.insert(0, L[h - 1])
        h -= 1
        if len(hdr_lines) >= 5:
            break
    head = None
    # last header line may be a list of period names with ncols words
    for idx in range(len(hdr_lines) - 1, -1, -1):
        words = hdr_lines[idx].split()
        if len(words) == ncols and all(w[:1].isupper() or w[:1].isdigit() for w in words):
            head = [' '.join(hdr_lines[:idx]).strip()] + words
            hdr_lines = hdr_lines[:idx]
            break
    start = h if head else j
    if head is None:
        # extra header text becomes caption
        start = j
    block = {'t': 'grid', 'head': head, 'rows': [[lab] + list(vals) for lab, vals in rows]}
    # caption: header lines not consumed
    cap = None
    if head is None and hdr_lines:
        cap = ' '.join(hdr_lines)
    return start, k, block, cap


def flow_zone(L, i):
    n = len(L)
    j = i
    while j < n and len(L[j]) <= 46 and not L[j].endswith('.'):
        j += 1
    if j - i >= 8:
        return i, j
    return None


def ctx_blocks(lines):
    L = clean_lines(lines)
    out = []
    para = []
    i = 0
    n = len(L)

    def flush():
        if para:
            out.append({'t': 'p', 'x': ' '.join(para)})
            para.clear()

    while i < n:
        ln = L[i]
        # long sentence lines are paragraph text
        if len(ln) > 62 or ln.endswith('.') and len(ln) > 40:
            para.append(ln)
            i += 1
            continue
        nt = numeric_table(L, i) if (i + 1 < n) else None
        if nt and nt[0] == i or (nt and nt[0] <= i + 5 and all(len(x) <= 62 for x in L[i:nt[0]])):
            start, end, block, cap = nt
            # lines between i and start are titles
            title = ' '.join(L[i:start]).strip()
            flush()
            if title:
                out.append({'t': 'cap', 'x': title})
            if cap:
                out.append({'t': 'cap', 'x': cap})
            out.append(block)
            i = end
            continue
        fz = flow_zone(L, i)
        if fz:
            flush()
            out.append({'t': 'flow', 'x': L[fz[0]:fz[1]]})
            i = fz[1]
            continue
        para.append(ln)
        i += 1
    flush()
    return out


if __name__ == '__main__':
    import json, io, sys
    d = json.load(io.open('u3_items.json', encoding='utf-8'))
    for k, qs in [('2024-06', [(6, None), (10, 'a'), (11, 'a')]), ('2023-06', [(6, None), (10, 'a')])]:
        for it in d[k]['items']:
            if (it['q'], it['sub']) in qs:
                print('==', k, it['q'], it['sub'])
                for b in ctx_blocks(it['ctx']):
                    print(json.dumps(b, ensure_ascii=True)[:420])
