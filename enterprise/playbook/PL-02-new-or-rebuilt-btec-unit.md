# PL-02 — New unit in an existing BTEC subject, or a rebuild

- **When:** you are adding a unit to an existing AAQ subject, or rebuilding a weak unit.
- **Skill:** `.claude/skills/ra10-add-btec-aaq-subject` (unit mode) and `ra10-content-authoring`.

## Decide the family first

| Subject family | Builder | Base to copy from |
|---|---|---|
| AAQ (`*-aaq`) | `aaq-build/build_apps.py <slug> <N>` | Generated |
| BTEC Business (Units 2, 3, 6, 7) | `business/build/build_units.py` (Sport Unit 2 template) | `revision/btec/level-3/business/unit-3` (finance and levels) |
| BTEC Sport | Hand-built | `revision/btec/level-3/sport/unit-1` |
| BTEC IT (legacy JSON) | Historical `tools/*it*` scripts | `revision/btec/level-3/IT-AAQ/unit-1` (JSON schemas in `training-data/BUILD-PIPELINE.md`) |
| BTEC Nationals IT, 2016 spec (20161K, not AAQ) — set tasks | `training-data/btec/level-3/it-2016-build/build_u14.py` (shell from Business Unit 7) | `revision/btec/level-3/IT-2016/unit-14`. Registry `group` keeps it apart from IT AAQ; never write "AAQ" in its `qual` |

**Prefer the AAQ builder for anything new.** It is the most complete and best-tested path.

## Steps (AAQ unit)

1. **Read the sources closely.**
   - Read the outline (aims, topics, points and criteria). For exam units, also read the SAM paper and mark scheme.
   - Note the layout, sections, tariffs (1/2/3/4/6/9/12), data and calculation questions and any information booklet.
2. **Generate the shell.** Run `python build_apps.py <slug> <N>`. It generates the shell and stubs only.
3. **Write `js/guide.js`.**
   - Size: exam units 25 KB+ with the exam section first; assignment units 16–18 KB.
   - Write each topic in this order:
     1. explanation;
     2. diagram;
     3. table or key terms;
     4. worked example;
     5. tip.
4. **Write the bank, quiz and cards.**
   - `js/bank.js` (60+ exam / 40+ assignment), `js/quiz.js` (80+ / 50+) and `js/cards.js` (80+ / 50+). `cards.js` ends with `B.publish()`.
   - Cover every topic at least twice and every command verb.
5. **Write the unit-specific file.**
   - **Exam unit:** `js/papers-ra10.js`, six papers (**PL-05**). Totals must equal the SAM.
   - **Assignment unit:** `js/assignment-help.js` must give help for every criterion code in `assignment-data.js`, plus `_intro`, `_tips` and the `group:<aims>` notes.
6. **Check counts.** Run `node check_units.js <slug> <N>`; the line must end `OK`.
7. **Browser test.**
   - Run `python browser_test.py <slug> <N> --shots <dir>` and open every screenshot.
   - Then click through by hand:
     - open a paper, answer it online and reveal the mark scheme;
     - run the timer and download the PDF;
     - switch to dark mode;
     - check the phone view.
8. **New unit only:** run `python write_registry.py` and add the unit to `sitemap.xml`.
9. **Ship:** follow **PL-13**.

## Verify (exit gate)

- [ ] `check_units.js` prints `OK`, and `browser_test.py` passes.
- [ ] RA10 paper totals equal the real paper (for example `90/90/90/90/90/90`).
- [ ] Assignment units show `critHelp=n/n`. They have **no** invented sample assignments and **no** AI marking of drafts.
- [ ] No console errors, 390 px phone width, readable dark mode.
