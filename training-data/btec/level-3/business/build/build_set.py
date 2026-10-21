import re, os, json, io, sys, glob, hashlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bizclean as b
import parse_set as ps
HERE = os.path.dirname(os.path.abspath(__file__))

SERIES = {
 2: {'2401-31489h':('January 2024','2024-01'),'31489_QP_A___B_Jan_19':('January 2019','2019-01'),'31489_QP_A___B_Jan_20':('January 2020','2020-01'),
     '31489_QP_PA___B_Jan_18':('January 2018','2018-01'),'31489_QP_PA___B_Jun_18':('June 2018','2018-06'),'31489_QP_P_A___B_Jun_17':('June 2017','2017-06'),
     '31489_Unit2_Que__20210317':('January 2021','2021-01'),'31489h-combined':('June 2022','2022-06'),'Unit_2_31489_QP_A_B_Jun19':('June 2019','2019-06'),
     'btec-l3-business-enterprise-entrepreneurship-31489h-unit-2-part-a-b':('June 2023','2023-06'),'btec-l3-business-enterprise-entreprneurship-combined':('January 2022','2022-01'),
     'business-enterprise-entrepreneurship-31489h-unit-2-combined-jan-2023':('January 2023','2023-01'),'business-enterprise-entrepreneurship-u2-june-2024':('June 2024','2024-06')},
 6: {'31588_QP_PA___B_Jan_21':('January 2021','2021-01'),'31588_QP_P_A_B_Jan19':('January 2019','2019-01'),'31588_QP_P_A_B_Jan_18':('January 2018','2018-01'),
     '31588_QP_P_A_B_Jan_20':('January 2020','2020-01'),'31588_QP_P_A_B_Jun19_proper':('June 2019','2019-06'),'31588_QP_P_A_B_Jun_18':('June 2018','2018-06'),
     '31588h-combined':('January 2022','2022-01'),'btec-l3-bus-ent-entrepreneurship-31588h-u6-jan-2024':('January 2024','2024-01'),
     'btec-l3-business-enterprise-entrepreneurship-31588h-unit-6-part-a-b-jun-2023':('June 2023','2023-06'),'business-enterprise-entrepreneurship-unit-6-12-31588h-june-2024':('June 2024','2024-06'),
     'business-entrepreneur-31588h':('June 2022','2022-06'),'w74393-btec-l3-business-enterprise-entrepreneurship-31588h-unit-612-combined-jan-2023':('January 2023','2023-01')},
 7: {'31589h-unit6-que-20200318':('January 2020','2020-01'),'Unit-7-Business-Decision-Making-Part-S-Jan-2018':('January 2018','2018-01'),'Unit-7-Business-Decision-Making-Part-S-June-2018':('June 2018','2018-06'),
     'btec-l3-business-enterprise-entrepreneurship-retail-31589h-u6-u7-jun-2022':('January 2022','2022-01'),'btec-l3-business-enterprise-entrepreneurship-retail-31589h-u6u7-june-2022':('June 2022','2022-06'),
     'btec-nationals-l3-unit-7-bus-decision-making-part-s-june-2019':('June 2019','2019-06'),'btec-nationals-l3-unit-7-business-decision-making-part-s-jan-2019':('January 2019','2019-01'),
     'level-3-business-entrepreneur-31589h-2021':('January 2021','2021-01'),'w74395-btec-l3-business-enterprise-entrepreneurship-retail-31589h-unit-76-jan-2023':('January 2023','2023-01'),
     'w74510-btec-l3-business-enterprise-entrepreneurship-retail-31589h-unit-7':('June 2023','2023-06'),'w77716-btec-l3-bus-ent-entrepreneurship-retail-31589h-u7-ps-cropped':('January 2024','2024-01'),
     'w77772-btec-l3-business-enterprise-entrepreneurship-retail-31589h-u7-ps-jun-2024':('June 2024','2024-06')},
}

def series_of(u, name):
    key = name[len('unit%d__paper__' % u):-4]
    best = None
    for k, v in SERIES[u].items():
        if key.startswith(k) and (best is None or len(k) > len(best[0])):
            best = (k, v)
    return best[1] if best else None

def norm(s):
    return re.sub(r'\W+', '', s.lower())[:120]

def build(u, path):
    cl, pb, meta = ps.parse_paper(path)
    # activities page: first page with Activity 1 and Total for Activity
    act_idx = None
    for i, (n, L) in enumerate(cl):
        t = ' '.join(L)
        if re.search(r'Activity\s*1', t) and re.search(r'Total for Activity', t):
            act_idx = i; break
    if act_idx is None:
        for i, (n, L) in enumerate(cl):
            t = ' '.join(L)
            if re.search(r'Activity\s*1', t) and re.search(r'marks', t) and i > 1:
                act_idx = i; break
    A, B = [], []
    seen = set()
    for i, (n, L) in enumerate(cl):
        t = ' '.join(L)
        if ps.ADMIN.search(t) and len(t) < 2600:
            continue
        # drop front matter of title pages
        L2 = [x for x in L if not re.match(r'^(Instructions|Information|Advice|Paper Reference|Pearson BTEC Level 3|You must have|Calculator|Time|Window|Supervised period|Part [AB]$|Business/Enterprise|Entrepreneurship|Unit \d)', x)]
        bl = ps.blocks(L2)
        out = []
        for bl_ in bl:
            txt = bl_['x'] if isinstance(bl_['x'], str) else ' '.join(bl_['x'])
            k = norm(txt)
            if len(txt) > 60 and k in seen:
                continue
            seen.add(k)
            out.append(bl_)
        if not out:
            continue
        (B if (act_idx is not None and i >= act_idx) else A).extend(out)
    # activities
    allB = ' \n'.join(' '.join(L) for n, L in cl[act_idx:]) if act_idx is not None else ''
    acts = []
    for m in re.finditer(r'Activity\s*(\d)\s*(.*?)\(Total for Activity \1 = (\d+) marks?\)', allB, re.S):
        acts.append({'n': int(m.group(1)), 'marks': int(m.group(3)), 'text': re.sub(r'\s+', ' ', m.group(2)).strip()})
    tm = re.search(r'TOTAL FOR PAPER = (\d+) MARKS', allB) or re.search(r'total mark for this paper is (\d+)', ' '.join(' '.join(L) for n, L in cl))
    return {'A': A, 'B': B, 'acts': acts, 'total': int(tm.group(1)) if tm else None, 'actPage': act_idx}

if __name__ == '__main__':
    for u in (2, 6, 7):
        res = {}
        for f in sorted(glob.glob(os.path.join(b.TXT, 'unit%d__paper__*.txt' % u))):
            name = os.path.basename(f)
            s = series_of(u, name)
            if not s:
                print('NO SERIES', name); continue
            r = build(u, f)
            res[s[1]] = dict(series=s[0], **r)
            print(u, s[0].ljust(14), 'A blocks', len(r['A']), 'B blocks', len(r['B']), 'acts', [(a['n'], a['marks']) for a in r['acts']], r['total'])
        io.open(os.path.join(HERE, 'set_u%d.json' % u), 'w', encoding='utf-8').write(json.dumps(res, ensure_ascii=False, indent=1))
