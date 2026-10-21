import re, os, json, io, sys, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bizclean as b
from parse_u3b import PAPER_SERIES

HERE = os.path.dirname(os.path.abspath(__file__))
FOOT = re.compile(r'\*P\d+[A-Z]*\d+\*\s*(Turn over)?')


def clean_paper(path):
    pages = b.read_pages(path)
    L = []
    for n, t in pages:
        for ln in b.page_lines(t, n):
            ln = FOOT.sub('', ln).strip()
            if not ln or re.match(r'^(Turn over|P\d{5}[A-Z]*)$', ln):
                continue
            L.append(ln)
    txt = b.fix_breaks('\n'.join(L))
    out = []
    for ln in txt.split('\n'):
        ln = ln.replace('�', '').strip()
        ln = re.sub(r'^\((\w)\s+\)', r'(\1)', ln)
        if ln:
            out.append(ln)
    return out

QSTART = re.compile(r'^(\d{1,2})(?:\s+(.*))?$')
SUBSTART = re.compile(r'^\(([a-h]|iv|vi{0,3}|i{1,3}|ix|x)\)\s*(.*)$')
MARKS_END = re.compile(r'^(.*?)\s*\((\d{1,2})\)\s*$')
TOTALQ = re.compile(r'^\(Total for Question (\d+) = (\d+) marks?\)')


def parse(path):
    L = clean_paper(path)
    # start at SECTION A
    st = 0
    for i, ln in enumerate(L):
        if re.match(r'^SECTION A', ln):
            st = i; break
    L = L[st:]
    items = []
    ctx = []
    cur = None  # open item
    qn = 0
    section = 'A'
    sec = {}
    sub_seen = False
    def close(marks):
        nonlocal cur, ctx
        if cur is None:
            return
        cur['marks'] = marks
        cur['text'] = re.sub(r'\s+', ' ', ' '.join(cur.pop('lines'))).strip()
        items.append(cur)
        cur = None
        ctx = []
    for li, ln in enumerate(L):
        nxt = L[li + 1] if li + 1 < len(L) else ""
        m = re.match(r'^SECTION ([AB])\b', ln)
        if m:
            section = m.group(1); continue
        m = re.match(r'^TOTAL FOR SECTION ([AB]) = (\d+)', ln)
        if m:
            sec[m.group(1)] = int(m.group(2)); continue
        if re.match(r'^(Answer ALL|You (should|are advised)|Write your answers|QUESTION \d+ BEGINS|\(Total for Section|TOTAL FOR PAPER|Show (your )?workings?\.?$)', ln, re.I):
            continue
        t = TOTALQ.match(ln)
        if t:
            if cur is not None:
                close(int(t.group(2)))
            for it in items:
                if it['q'] == int(t.group(1)):
                    it['qTotal'] = int(t.group(2))
            continue
        # question start?
        m = QSTART.match(ln)
        if m and int(m.group(1)) == qn + 1 and ((not m.group(2) and re.match(r'^(\([a-h]\)|[A-Z])', nxt) and not nxt.startswith('(Total')) or (m.group(2) and re.match(r'^[A-Z(]', m.group(2)))):
            if cur is not None:   # unclosed previous: close with unknown marks
                close(None)
            qn = int(m.group(1)); sub_seen = False
            rest = m.group(2) or ''
            sm = SUBSTART.match(rest)
            cur = {'q': qn, 'sub': sm.group(1) if sm else None, 'section': section, 'ctx': ctx[:], 'lines': []}
            ctx = []
            rest2 = sm.group(2) if sm else rest
            if rest2:
                handle_text(cur, rest2, close)
            continue
        sm = SUBSTART.match(ln)
        if sm and cur is not None and re.fullmatch(r'iv|vi{0,3}|i{1,3}|ix|x', sm.group(1)) and sm.group(1) not in ('i',) or (sm and cur is not None and sm.group(1) == 'i' and cur['sub'] not in (None,) and False):
            handle_text(cur, ln, close)
            continue
        if sm and qn and (cur is None or cur['sub'] is None or True):
            # a new subpart (only if it is not a stray roman in text)
            if cur is not None:
                if cur['lines']:
                    close(None)
                else:
                    ctx = cur["ctx"] + ctx
                    cur = None
            cur = {'q': qn, 'sub': sm.group(1), 'section': section, 'ctx': ctx[:], 'lines': []}
            ctx = []
            if sm.group(2):
                handle_text(cur, sm.group(2), close)
            continue
        if cur is not None:
            handle_text(cur, ln, close)
        else:
            ctx.append(ln)
    for it in items:
        if it['marks'] is None and it.get('qTotal'):
            sib = [x for x in items if x['q'] == it['q']]
            miss = [x for x in sib if x['marks'] is None]
            if len(miss) == 1:
                rem = it['qTotal'] - sum(x['marks'] or 0 for x in sib)
                if rem > 0:
                    it['marks'] = rem
    return items, sec


def handle_text(cur, text, close):
    mm = MARKS_END.match(text)
    if mm and not re.match(r'^[•–-]', text):
        pre = mm.group(1).strip()
        if pre:
            cur['lines'].append(pre)
        close(int(mm.group(2)))
    else:
        cur['lines'].append(text)

if __name__ == '__main__':
    res = {}
    for f in sorted(glob.glob(os.path.join(b.TXT, 'unit3__paper__*.txt'))):
        name = os.path.basename(f)[:-4]
        key = next((v for k, v in PAPER_SERIES.items() if name.startswith(k)), None)
        items, sec = parse(f)
        tot = sum(i['marks'] or 0 for i in items)
        nm = sum(1 for i in items if i['marks'] is None)
        print(key[0].ljust(13), len(items), 'items', tot, 'marks', 'unmarked', nm, sec)
        res[key[1]] = {'series': key[0], 'date': key[2], 'items': items, 'sec': sec}
    io.open(os.path.join(HERE, 'u3_items.json'), 'w', encoding='utf-8').write(json.dumps(res, ensure_ascii=False, indent=1))
