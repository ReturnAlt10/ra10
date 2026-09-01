import json, os, re

d = 'data'
base = {}
for aim in 'ABCD':
    base[aim] = len(json.load(open(os.path.join(d, f'aim_{aim}.json'), encoding='utf-8')))
mc = len(json.load(open(os.path.join(d, 'mc.json'), encoding='utf-8')))
diagrams = len(json.load(open(os.path.join(d, 'diagrams.json'), encoding='utf-8')))

src = open('js/data-loader.js', encoding='utf-8').read()

def count_calls(fn_name):
    start = src.index('function ' + fn_name + '(')
    end = src.index('\n}\n', start) + len('\n}\n')
    block = src[start:end]
    return len(re.findall(r"\[\s*'", block))

exp = count_calls('addExpandedQuestionBank')
exp2 = count_calls('addExpandedQuestionBank2')

total = sum(base.values()) + mc + exp + exp2 + diagrams
print('base per aim:', base, 'sum', sum(base.values()))
print('mc:', mc)
print('diagrams:', diagrams)
print('EXP1 bank:', exp)
print('EXP2 bank:', exp2)
print('TOTAL QUESTIONS:', total)