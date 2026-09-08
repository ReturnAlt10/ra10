# -*- coding: utf-8 -*-
"""Make the aim list dynamic in app.js for units with non-6 aims."""
import io, os, re

UNITS = {
    "unit-1": ["A","B","C","D","E"],
    "unit-2": ["A","B","C","D"],
    "unit-4": ["A","B","C","D","E"],
}

ROOT = r"c:\Users\mistr\OneDrive\Documents\GitHub\ra10\revision\btec\level-3\business"

for unit, letters in UNITS.items():
    path = os.path.join(ROOT, unit, "js", "app.js")
    with io.open(path, "r", encoding="utf-8") as f:
        src = f.read()

    # 1) Insert AIM_LETTERS right after the SPEC object closing (before MARKS_OPTIONS)
    marker = "const MARKS_OPTIONS"
    if "const AIM_LETTERS" not in src:
        src = src.replace(marker, "const AIM_LETTERS = Object.keys(SPEC);\n  " + marker, 1)

    # 2) Replace all hardcoded 6-aim list literals with AIM_LETTERS
    src = src.replace("['A','B','C','D','E','F']", "AIM_LETTERS")

    # 3) Replace the guide gating hint "Aims B-F are locked" style if present (leave, dynamic fine)
    with io.open(path, "w", encoding="utf-8") as f:
        f.write(src)
    print(unit, "patched, AIM_LETTERS =", letters)
