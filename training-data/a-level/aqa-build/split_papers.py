"""Split the combined AQA 7132 text (2020-2024) into per-paper QP / MS files by tagging each page."""
import re, os

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.normpath(os.path.join(HERE, '..', 'aqa-business-2023', 'text'))
t = open(os.path.join(BASE, 'A_Level_Business_AQA_2020-2024.txt'), encoding='utf-8').read()
parts = re.split(r'=====PAGE (\d+)\n', t)
P = {int(parts[i]): parts[i + 1] for i in range(1, len(parts), 2)}

tags = {}
cur = None
for n in sorted(P):
    tx = P[n]
    m = re.search(r'MARK SCHEME\s*[–-]\s*A-LEVEL BUSINESS\s*[–-]\s*7132/(\d)\s*[–-]\s*JUNE (\d{4})', tx)
    if m:
        cur = ('MS', m.group(2), int(m.group(1)))
        tags[n] = cur; continue
    # MS cover pages: 'Mark schem' + 7132/k
    if re.search(r'Mark schem', tx) and re.search(r'A-level', tx, re.I) and re.search(r'7132/(\d)', tx):
        k = int(re.search(r'7132/(\d)', tx).group(1))
        mm = re.search(r'(?:June|JUNE)\s+(\d{4})', tx)
        yr = mm.group(1) if mm else (cur[1] if cur else '2020')
        cur = ('MS', yr, k)
        tags[n] = cur; continue
    m = re.search(r'IB/G/[Jj]un(?:e)?(\d\d)/(?:G\d+/)?(?:E\d+ )?7132/(\d)', tx) or re.search(r'\*[Jj][Uu][Nn](\d\d)7132(\d)', tx) or re.search(r'\*(\d\d)6a7132/(\d)', tx)
    if m:
        cur = ('QP', '20' + m.group(1), int(m.group(2)))
        tags[n] = cur; continue
    tags[n] = cur

out = {}
for n in sorted(P):
    tg = tags.get(n)
    if not tg:
        continue
    out.setdefault(tg, []).append(P[n])

os.makedirs(os.path.join(BASE, 'papers'), exist_ok=True)
for (k, y, p), pgs in sorted(out.items(), key=lambda x: (x[0][1], x[0][2], x[0][0])):
    fn = os.path.join(BASE, 'papers', '%s-P%d-%s.txt' % (y, p, k))
    open(fn, 'w', encoding='utf-8').write('\n'.join(pgs))
    print(y, p, k, len(pgs))
