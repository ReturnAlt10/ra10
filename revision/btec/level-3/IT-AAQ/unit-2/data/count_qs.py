import json, os, re


def count_exp():
    src = open('js/data-loader.js', encoding='utf-8').read()
    counts = {}
    for aim in 'ABCD':
        # count occurrences of tuple-start lines within the banks object
        # each expanded q is one line starting with [' inside the banks literal
        counts[aim] = len(re.findall(r"=\[\s*'(?:[^']|\\')'", src))
    return counts


def main():
    d = 'data'
    base = {}
    for aim in 'ABCD':
        data = json.load(open(os.path.join(d, f'aim_{aim}.json'), encoding='utf-8'))
        base[aim] = len(data)
    for f in ['mc.json', 'diagrams.json', 'quiz.json']:
        p = os.path.join(d, f)
        if os.path.exists(p):
            v = json.load(open(p, encoding='utf-8'))
            print(f, len(v))
    print('base aim counts:', base, 'total base:', sum(base.values()))
    # EXP: read data-loader banks by counting array — approximate via manual known counts is safer
    print('Done')


if __name__ == '__main__':
    main()