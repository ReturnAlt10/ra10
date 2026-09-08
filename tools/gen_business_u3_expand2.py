# -*- coding: utf-8 -*-
"""BTEC Business Unit 3 — one final question to reach 300."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bus_qgen import q, short_ms, next_id, load_json, write_aims

BASE = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business\unit-3\data"
aims = {a: load_json(os.path.join(BASE, 'aim_%s.json' % a)) for a in 'ABCDEF'}

nid = next_id(aims["A"], "A")
aims["A"].append(q(nid, "A", "A2 Financial products", "Explain", 4, "AO2", "",
    "Explain the difference between a mortgage and a personal loan.",
    "(4)", "short",
    short_ms("Award 1+1. Max 4.",
      ["A mortgage is a long-term loan secured against property (1) used specifically to buy a home or property (1)",
       "A personal loan is typically unsecured and used for general purposes (1) repaid over a shorter, fixed term (1)"])))

write_aims(BASE, aims)
print("U3 aim counts:", {k: len(v) for k, v in aims.items()})
print("U3 total:", sum(len(v) for v in aims.values()))
