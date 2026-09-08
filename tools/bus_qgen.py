# -*- coding: utf-8 -*-
"""Shared helpers for BTEC Business question generators."""
import json, os, re

def q(id, aim, topic, verb, marks, ao, scenario, question, guidance, typ, ms):
    return {"id": id, "learning_aim": aim, "topic": topic, "command_verb": verb,
            "marks": marks, "ao": ao, "scenario": scenario, "question": question,
            "guidance": guidance, "type": typ, "mark_scheme": ms}

def short_ms(instr, points, add=None, dna=None):
    return {"instruction": instr, "points": points, "additional_guidance": add, "do_not_accept": dna}

def lvl_ms(instr, indic, levels):
    return {"instruction": instr, "indicative_content": indic, "level_descriptors": levels}

def levels3(d1, d2, d3):
    return [{"level": 1, "marks": "1-2", "descriptor": d1},
            {"level": 2, "marks": "3-4", "descriptor": d2},
            {"level": 3, "marks": "5-6", "descriptor": d3}]

def levels4(d1, d2, d3, d4):
    return [{"level": 1, "marks": "1-3", "descriptor": d1},
            {"level": 2, "marks": "4-6", "descriptor": d2},
            {"level": 3, "marks": "7-9", "descriptor": d3},
            {"level": 4, "marks": "10-12", "descriptor": d4}]

def next_id(existing, aim):
    """Return the next sequential id (e.g. 'A016') after the max existing numeric suffix for an aim."""
    mx = 0
    for it in existing:
        m = re.match(r'^([A-Z])(\d{3})$', it.get('id', ''))
        if m and m.group(1) == aim:
            mx = max(mx, int(m.group(2)))
    return '%s%03d' % (aim, mx + 1)

def load_json(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except Exception:
        return []

def write_aims(base, aims):
    """Write each aim list to aim_X.json. aims is {letter: [questions]}."""
    for a, items in aims.items():
        with open(os.path.join(base, 'aim_%s.json' % a), 'w', encoding='utf-8') as f:
            json.dump(items, f, ensure_ascii=False, indent=1)
