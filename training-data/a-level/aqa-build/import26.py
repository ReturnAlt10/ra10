"""Write out/ra10_26_<set>.json for every ra10_26_set_*.py module."""
import glob, importlib, json, os, sys
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
for f in sorted(glob.glob(os.path.join(HERE, 'ra10_26_set_*.py'))):
    name = os.path.basename(f)[:-3]
    m = importlib.import_module(name)
    ps = m.papers()
    json.dump(ps, open(os.path.join(HERE, 'out', name.replace('_set', '') + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(name, [(p['id'], len(p['items']), sum(i['marks'] for i in p['items'])) for p in ps])
