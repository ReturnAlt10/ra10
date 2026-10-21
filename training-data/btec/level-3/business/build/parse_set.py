import re, os, json, io, sys, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bizclean as b
HERE = os.path.dirname(os.path.abspath(__file__))
FOOT = re.compile(r'\*[A-Z]\d{5}[A-Z]*\d*\*\s*(Turn over)?')
ADMIN = re.compile(r'instructions to teachers|maintaining security|instructions for learners|outcomes for submission|candidate surname|centre number|issued to learners|authentication form|instructions to teachers/tutors|retained securely|must be read in conjunction', re.I)


def page_clean(text, n):
    lines = []
    for ln in b.page_lines(text, n):
        ln = FOOT.sub('', ln).strip()
        if not ln or re.match(r'^(Turn over|[A-Z]\d{5}[A-Z]*)$', ln):
            continue
        lines.append(ln)
    t = b.fix_breaks('\n'.join(lines))
    return [x.replace('�', '').strip() for x in t.split('\n') if x.strip()]



NUMTOK = re.compile(r'^[\d][\d,. ]*%?$|^[£$][\d][\d,.]*$')

def split_cells(hdr):
    cells = []
    for ln in hdr:
        ln = ln.strip()
        # split a line at capitalised word starts that follow a completed cell on the same line
        parts = re.split(r'(?<=[a-z0-9\)/])\s+(?=[A-Z£$\d])', ln) if (cells and ln[:1].isupper() and False) else [ln]
        for p in parts:
            if not p:
                continue
            if p[:1].isupper() or p[:1] in '£$0123456789' or not cells:
                cells.append(p)
            else:
                cells[-1] += ' ' + p
    # a line may contain several cells ("Ye s No", "Male Female Other") -> handled by caller
    return cells


def statify(lines):
    """Replace 'header lines + numeric line' survey patterns with a single marker line."""
    out = []
    i = 0
    n = len(lines)
    while i < n:
        ln = lines[i]
        toks = ln.split()
        if len(toks) >= 2 and all(NUMTOK.match(t) for t in toks) and out:
            nv = len(toks)
            # walk back for header lines
            j = len(out)
            hdr = []
            while j > 0:
                prev = out[j - 1]
                if prev.startswith('\x00') or re.search(r'[?:]\s*$', prev) or prev.startswith('('):
                    break
                if ('?' in prev) or (prev.endswith('.') and len(prev) > 40):
                    break
                hdr.insert(0, prev)
                j -= 1
                if len(hdr) > 30:
                    break
            # question text = the line(s) before header that end the question
            q_lines = []
            k = j
            while k > 0 and not out[k - 1].startswith('\x00') and (out[k - 1].startswith('(') or '?' in out[k - 1] or re.search(r'[?:]\s*$', out[k - 1]) or (not out[k - 1].startswith('\x00') and len(q_lines) == 0 and False)):
                q_lines.insert(0, out[k - 1]); k -= 1
                if not out[k].startswith('(') :
                    # include a preceding unfinished question line
                    while k > 0 and not out[k - 1].startswith('\x00') and not re.search(r'[.?:]\s*$', out[k - 1]) and len(out[k - 1]) > 20 and len(q_lines) < 3:
                        q_lines.insert(0, out[k - 1]); k -= 1
                    break
            cells = []
            if len(hdr) == 1 and len(hdr[0].split()) == nv:
                cells = hdr[0].split()
            elif len(hdr) == 1 and nv >= 2:
                # one line, several multi-word cells: split on capitals
                c = re.split(r'\s+(?=[A-Z£$\d])', hdr[0])
                cells = c if len(c) == nv else []
            else:
                cells = []
                for h in hdr:
                    parts = re.split(r'\s+(?=[A-Z£$])', h) if len(h.split()) > 3 and sum(1 for w in h.split() if w[:1].isupper()) >= 2 else [h]
                    for p in parts:
                        p = p.strip()
                        if not p:
                            continue
                        if p[:1].isupper() or p[:1] in '£$0123456789' or not cells:
                            cells.append(p)
                        else:
                            cells[-1] += ' ' + p
            cells = [re.sub(r'^Ye s$', 'Yes', c) for c in cells]
            if hdr and len(cells) == nv:
                del out[k:]
                out.append('\x00STAT' + json.dumps({'q': ' '.join(q_lines), 'c': cells, 'v': toks}, ensure_ascii=False))
                i += 1
                continue
        out.append(ln)
        i += 1
    return out


def blocks(lines):
    lines = statify(lines)
    """Turn lines into blocks: p (paragraph), li (bullet list), tbl (rows)."""
    out = []
    i = 0
    n = len(lines)
    def is_rowish(s):
        return len(s) <= 48 and not s.endswith(('.', ':', ';', ',')) or re.search(r'\d', s) and len(s) <= 70
    para = []
    def flush():
        if para:
            out.append({'t': 'p', 'x': re.sub(r'\s+', ' ', ' '.join(para)).strip()})
            para.clear()
    while i < n:
        ln = lines[i]
        if ln.startswith('\x00STAT'):
            flush()
            out.append({'t': 'stat', 'x': json.loads(ln[5:])})
            i += 1
            continue
        if re.match(r'^[•●▪]\s?', ln) or re.match(r'^o\s', ln):
            flush()
            items = []
            while i < n and (re.match(r'^[•●▪]\s?', lines[i]) or re.match(r'^o\s', lines[i]) or (items and not re.match(r'^[•●▪]\s?', lines[i]) and not lines[i][:1].isupper() and len(lines[i]) > 3 and not re.match(r'^(Figure|Table|Activity)', lines[i]))):
                ln2 = lines[i]
                if re.match(r'^[•●▪]\s?', ln2) or re.match(r'^o\s', ln2):
                    items.append(re.sub(r'^([•●▪]|o)\s?', '', ln2))
                else:
                    items[-1] += ' ' + ln2
                i += 1
            out.append({'t': 'li', 'x': items})
            continue
        # table-ish run
        j = i
        while j < n and is_rowish(lines[j]) and not re.match(r'^[•●▪]', lines[j]):
            j += 1
        if j - i >= 4 and sum(1 for k in range(i, j) if re.search(r'\d', lines[k])) >= 3:
            flush()
            out.append({'t': 'tbl', 'x': lines[i:j]})
            i = j
            continue
        if re.match(r'^(Figure \d|Table \d|Activity \d|Part [AB]\b|Set Task|Appendix)', ln) and len(ln) < 80:
            flush()
            out.append({'t': 'h', 'x': ln})
            i += 1
            continue
        if para and (para[-1].endswith(('.', '?', '!', ':')) and ln[:1].isupper() and len(para[-1]) < 60):
            flush()
        para.append(ln)
        i += 1
    flush()
    return out


def parse_paper(path):
    pages = b.read_pages(path)
    cleaned = [(n, page_clean(t, n)) for n, t in pages]
    # locate Part B start
    partb = None
    for idx, (n, L) in enumerate(cleaned):
        head = ' '.join(L[:14])
        if re.search(r'\bPart B\b', head) and re.search(r'Paper|reference|Time|You must have', head) and idx > 0:
            partb = idx
            break
    meta = ' '.join(cleaned[0][1][:30]) if cleaned else ''
    return cleaned, partb, meta

if __name__ == '__main__':
    for u in (2, 6, 7):
        for f in sorted(glob.glob(os.path.join(b.TXT, 'unit%d__paper__*.txt' % u))):
            cl, pb, meta = parse_paper(f)
            print(u, os.path.basename(f)[:60].ljust(60), len(cl), 'pages partB@', pb)
