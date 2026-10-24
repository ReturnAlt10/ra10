"""Convert extra RA10 sets (D, E, ...) to the unified schema -> out/ra10_extra.json. Reuses the pp27 converters."""
import json, os, sys, importlib
sys.dont_write_bytecode = True
import import_pp27 as I

HERE = os.path.dirname(os.path.abspath(__file__))
SETS = [('D', 'ra10_set_d', 'P1_D', 'P2_D', 'P3_D'), ('E', 'ra10_set_e', 'P1_E', 'P2_E', 'P3_E')]


def main():
    out = []
    for tag, mod, a, b, c in SETS:
        try:
            m = importlib.import_module(mod)
        except ModuleNotFoundError:
            continue
        for p in (I.paper1(getattr(m, a), tag), I.paper2(getattr(m, b), tag), I.paper3(getattr(m, c), tag)):
            p.update({'source': 'ra10', 'series': 'RA10 practice', 'set': tag, 'year': '2027'})
            out.append(p)
    json.dump(out, open(os.path.join(HERE, 'out', 'ra10_extra.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for p in out:
        print(p['id'], len(p['items']), sum(i['marks'] for i in p['items']))


if __name__ == '__main__':
    main()
