import re, os, glob, collections, json, io

TXT = r'C:\Users\mistr\OneDrive\Documents\GitHub\ra10\training-data\btec\level-3\business\new\text'

NOISE = [
    r'^\*?[A-Z]\d{5}[A-Z]\*?(\*?[A-Z]\d{5}[A-Z]\*?)?$',
    r'^\d{0,3}\s*[A-Z]\d{5}[A-Z]$', r'^[A-Z]\d{5}[A-Z]\s*\d{0,3}$',
    r'^Turn over\s*$', r'^DO NOT WRITE IN THIS AREA', r'^BLANK PAGE', r'^\d/\d(/\d)+$',
    r'^©\s?20\d\d Pearson', r'^\*[A-Z0-9]+\*$', r'^P\d{5}A\s*\d*$', r'^\d*\s*P\d{5}A$',
    r'^\.{5,}$', r'^_{3,}$', r'^\s*$',
]
NOISE = [re.compile(p) for p in NOISE]


def read_pages(path):
    raw = io.open(path, encoding='utf-8', errors='replace').read()
    parts = re.split(r'=====PAGE (\d+)\s*\n?', raw)
    pages = []
    for i in range(1, len(parts), 2):
        pages.append((int(parts[i]), parts[i + 1]))
    return pages


def page_lines(text, pageno=None):
    out = []
    for ln in text.split('\n'):
        ln = re.sub(r'[ \t\u00a0]+', ' ', ln).strip()
        ln = re.sub(r'\.{4,}', '', ln).strip()
        ln = re.sub(r'_{3,}', '', ln).strip()
        if not ln:
            continue
        if any(p.match(ln) for p in NOISE):
            continue
        out.append(ln)
    if pageno is not None and out:
        if re.fullmatch(r'\d{1,3}', out[0]) and int(out[0]) == pageno:
            out = out[1:]
        if out and re.fullmatch(r'\d{1,3}', out[-1]) and int(out[-1]) == pageno:
            out = out[:-1]
    return out


_vocab = None
_VCACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'vocab.json')
def vocab():
    global _vocab
    if _vocab is not None:
        return _vocab
    if os.path.exists(_VCACHE):
        _vocab = json.load(io.open(_VCACHE, encoding='utf-8'))
        return _vocab
    c = collections.Counter()
    for f in glob.glob(os.path.join(TXT, '*.txt')):
        if 'spec__' in os.path.basename(f):
            continue
        t = io.open(f, encoding='utf-8', errors='replace').read()
        for w in re.findall(r"[A-Za-z]{2,}", t):
            c[w.lower()] += 1
    _vocab = dict(c)
    json.dump(_vocab, io.open(_VCACHE, 'w', encoding='utf-8'))
    return _vocab


def fix_breaks(s):
    """Re-join words split by PDF overlay artefacts (e.g. 'advan tage', 'Calcula
te', 't wo')."""
    V = vocab()
    def isw(w):
        return V.get(w.lower(), 0) >= 40 or w.lower() in ('a', 'i')
    toks = re.split(r'(\s+)', s)
    out = []
    i = 0
    while i < len(toks):
        t = toks[i]
        if i + 2 < len(toks) and re.fullmatch(r'[A-Za-z]{1,10}', t) and toks[i + 1].strip() == '':
            mb = re.fullmatch(r'([a-z]{1,10})([.,;:?!)’]*)', toks[i + 2])
            if mb:
                a, bb, tail = t, mb.group(1), mb.group(2)
                ab = a + bb
                if V.get(ab.lower(), 0) >= 8 and not (isw(a) and isw(bb)) and a.lower() not in ('a', 'i'):
                    out.append(ab + tail)
                    i += 3
                    continue
        out.append(t)
        i += 1
    return ''.join(out)


def reflow(lines):
    """Join hard-wrapped lines into paragraphs. Short consecutive lines are kept as rows."""
    paras = []
    cur = []
    def flush():
        if cur:
            paras.append(' '.join(cur))
            cur.clear()
    for ln in lines:
        if re.match(r'^(•|●|-\s|o\s|\d+\s?[\.\)]\s|\([a-z]\)\s|\([ivx]+\)\s)', ln):
            flush(); cur.append(ln); continue
        if cur and (cur[-1].endswith(('.', ':', '?', ';', ')')) and not ln[:1].islower()):
            flush()
        cur.append(ln)
    flush()
    return paras
