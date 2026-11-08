import json,sys
slug,n=sys.argv[1],int(sys.argv[2]); full=len(sys.argv)>3
for u in json.load(open('out/%s.spec.json'%slug,encoding='utf-8')):
  if u['n']!=n: continue
  print(u['title'],'|',u['type'])
  def pts(l,d=1):
    for p in l or []:
      print('  '*d+'- '+p['t'][:160]); 
      if full: pts(p.get('c'),d+1)
  for a in u['aims']:
    print('AIM',a['aim'],a['title'])
    for t in a['topics']:
      print(' ',t['code'],t['title'])
      for s in t['subs']:
        print('    ',s['code'],s['text'][:150])
        if full:
          pts(s.get('points'),3)
          for s2 in s.get('subs') or []: print('       ',s2['code'],s2['text'][:120])
      pts(t.get('points'),2)
  for c in u['criteria']: print('CRIT',c['code'],c['text'][:150])
