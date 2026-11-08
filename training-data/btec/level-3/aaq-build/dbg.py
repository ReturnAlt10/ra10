import json,sys
d=json.load(open('out/%s.sam.json'%sys.argv[1],encoding='utf-8'))
for p in d['parts']: print(p['id'],p['marks'],'MS' if p['ms'] else '--',repr(p['text'][:70]))
print('unmatched MS:',[ (e['id'],e['marks']) for e in d['ms_unmatched']])
