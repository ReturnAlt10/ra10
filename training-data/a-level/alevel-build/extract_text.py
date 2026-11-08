"""Extract text from the A-level source PDFs (git-ignored) into <subject>/text/<same relative path>.txt.

    python training-data/a-level/alevel-build/extract_text.py aqa-psychology edexcel-business

• Uses PyMuPDF with reading-order sorting; each page starts with a line "=====PAGE n" (same convention
  as the AQA Business pipeline) so parsers can drop headers/footers per page.
• Skips duplicate downloads ("… (1).pdf") and AQA modified-print copies (MQP18A4 / MQP36A3), which
  repeat the standard paper in a larger font.
• Already-extracted files are left alone unless --force is given.
"""
import os, re, sys
import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..'))           # training-data/a-level
SKIP = re.compile(r'\(\d\)\.pdf$|MQP(18A4|36A3)', re.I)


def extract(pdf_path, out_path):
    doc = pymupdf.open(pdf_path)
    parts = []
    for i, page in enumerate(doc, 1):
        parts.append('=====PAGE %d' % i)
        parts.append(page.get_text('text', sort=True))
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(parts))
    return len(doc)


def main(argv):
    force = '--force' in argv
    subjects = [a for a in argv if not a.startswith('--')]
    for subj in subjects:
        base = os.path.join(ROOT, subj)
        n = skipped = 0
        for dirpath, _, files in os.walk(base):
            if os.sep + 'text' in dirpath + os.sep and dirpath.startswith(os.path.join(base, 'text')):
                continue
            for f in sorted(files):
                if not f.lower().endswith('.pdf'):
                    continue
                if SKIP.search(f):
                    skipped += 1
                    continue
                rel = os.path.relpath(os.path.join(dirpath, f), base)
                out = os.path.join(base, 'text', os.path.splitext(rel)[0] + '.txt')
                if os.path.exists(out) and not force:
                    continue
                try:
                    pages = extract(os.path.join(dirpath, f), out)
                    n += 1
                    print('%-60s %3d pages' % (rel, pages))
                except Exception as e:
                    print('!! %s: %s' % (rel, e))
        print('%s: %d extracted, %d skipped as duplicates' % (subj, n, skipped))


if __name__ == '__main__':
    main(sys.argv[1:])
