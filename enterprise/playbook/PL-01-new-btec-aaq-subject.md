# PL-01 — New BTEC AAQ subject

- **When:** Pearson publishes a BTEC National (AAQ) subject that RA10 does not have yet.
- **Skill:** `.claude/skills/ra10-add-btec-aaq-subject`.
- **Authoritative detail:** `training-data/btec/level-3/aaq-build/PLAYBOOK.md`. Read it fully; this page is the enterprise summary and checklist.

## Inputs

- The specification PDF, the SAMs (one per external unit), and the teaching guide if one exists.
- A brand colour and a palette (six values, as in `SUBJECTS` in `build_apps.py`).
- A subject slug ending in `-aaq` (for example `applied-psychology-aaq`).

## Steps

### 1. Protect copyright first

`.gitignore` already contains `training-data/btec/level-3/*-aaq/`. Confirm that your slug matches before copying anything in.

### 2. Place the sources

Put them in `training-data/btec/level-3/<slug>/` and extract text into `<slug>/text/*.txt` with `python extract_pdf_txt.py` from the repo root. The spec text filename must contain `spec`.

### 3. Register the subject in the builders

- `build_apps.py` → `SUBJECTS['<slug>'] = dict(name, short, pdf, pal=(…))`.
- `write_registry.py` → `REGISTRY['<slug>'] = dict(name, short, color, keywords=[…])`.

### 4. Parse

```bash
cd training-data/btec/level-3/aaq-build
python parse_spec.py <slug>          # → out/<slug>.spec.json
python parse_sam.py                  # → out/<slug>.u<N>.sam.json (all subjects)
```

Audit for missing aims with the one-liner in PLAYBOOK §5.2. Fix gaps in `SPEC_PATCHES`.

### 5. Generate the shells

Run `python build_apps.py <slug>`. It creates every unit folder with stub content files and never overwrites hand-written files.

### 6. Write the content, one unit at a time

Follow **PL-02** for each unit. Build one unit completely and check it before starting the next.

### 7. Register the subject

Run `python write_registry.py`. It updates the AAQ block in `refresh/ra10-units.js`, which feeds:

- the navbar finder;
- the subject pages;
- the homepage "New AAQ subjects" section;
- Study Hub;
- EDU;
- the quality dashboard.

### 8. Wire the subject into the site

- **Sitemap:** add the subject and its units to `sitemap.xml`.
- **Icons:** if the subject needs a distinct icon or colour on the dashboard, add it to `RA10Subjects.icons` in `refresh/ra10-subjects.js`.
- **Python Lab:** link the subject only if it is coding-related (`EXT_TOOLS` in `revision/shared/unit-ui.js`).

### 9. AI Examiner

The generic examiner plus `BIZ_LEVELS` levels work by default. Add a spec module only if the board's marking style differs a lot (**PL-07**).

### 10. Final gate

1. Bump `V` in `build_apps.py` if `shared-aaq` changed.
2. Run `python build_apps.py`, then `node check_units.js` (every line `OK`).
3. Run `python browser_test.py <slug>` (all passed).

### 11. Ship

Follow **PL-13**, then **PL-14** (News: "New subject").

## Verify (exit gate)

- [ ] `node check_units.js <slug>` prints `OK` for every unit (counts, syntax, RA10 totals, guide size, criterion help).
- [ ] `python browser_test.py <slug>` reports "all units passed", and you have opened the screenshots.
- [ ] Every spec topic appears in the guide, the bank and the cards. Every aim has at least 2 diagrams.
- [ ] No invented statistics, every number re-checked, and no copied Pearson prose.
- [ ] The subject appears in the navbar finder, the homepage, Study Hub's unit list and `/admin/quality` (registry-driven).
- [ ] `python enterprise/scripts/health_check.py` reports 0 FAIL.

## Pitfalls

- **Thin, generated content is rejected.** The November 2026 AAQ rebuild threw away a first pass and rewrote every unit by hand to the bar.
- **The PDF parse can merge criteria or drop aims.** Compare with the spec's assessment grid every time.
- **Retired `build_aaq.py`:** never resurrect it. It overwrote every unit's `index.html`.
- **Flaky test:** "`RA10UnitUI` is not defined" in the browser test usually means a slow load. Rerun it first.
