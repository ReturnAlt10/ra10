import os, sys, re
from multiprocessing import Pool
from pypdf import PdfReader
root = r'C:\Users\mistr\OneDrive\Documents\GitHub\ra10\training-data\btec\level-3\business\new\BTEC Business Level 3'
out = r'C:\Users\mistr\OneDrive\Documents\GitHub\ra10\training-data\btec\level-3\business\new\text'
os.makedirs(out, exist_ok=True)
jobs = []
for dp, dn, fn in os.walk(root):
    for f in fn:
        if f.lower().endswith('.pdf'):
            rel = os.path.relpath(os.path.join(dp, f), root)
            parts = rel.split(os.sep)
            if len(parts) == 3:
                unit, kind, name = parts
                tag = unit.replace(' ', '').lower() + '__' + kind.replace(' ', '').lower() + '__' + re.sub(r'[^A-Za-z0-9._-]+', '_', name)[:-4]
            else:
                tag = 'spec__' + re.sub(r'[^A-Za-z0-9._-]+', '_', parts[-1])[:-4]
            jobs.append((os.path.join(dp, f), os.path.join(out, tag + '.txt')))
def run(j):
    src, dst = j
    try:
        r = PdfReader(src)
        t = '\n'.join(f'=====PAGE {i+1}\n' + (p.extract_text() or '') for i, p in enumerate(r.pages))
        open(dst, 'w', encoding='utf-8').write(t)
        return (os.path.basename(dst), len(r.pages), len(t))
    except Exception as e:
        return (os.path.basename(dst), -1, str(e))
if __name__ == '__main__':
    with Pool(8) as p:
        for res in p.imap_unordered(run, jobs):
            print(res, flush=True)
