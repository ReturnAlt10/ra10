# BTEC Nationals IT (2016 specification, 20161K): build tools

This builds Unit 14: IT Service Delivery of the **outgoing** Pearson BTEC Level 3 National Extended Diploma in IT. This qualification is **not** the AAQ IT. The AAQ units live in `revision/btec/level-3/IT-AAQ/`. This unit lives in `revision/btec/level-3/IT-2016/unit-14/`, with the public URL `/btec/level-3/IT-2016/unit-14`.

Source PDFs and extracted text are in the git-ignored `../information-technology (outgoing)/`. Pearson material is never committed.

```bash
python build_u14.py --check   # print the activity wording extracted from every series
python build_u14.py           # write js/papers-data.js and regenerate the app shell
```

| File | Kind |
|---|---|
| `u14_series.py` | Pearson set-task scenarios (Part A and Part B briefs), transcribed by hand for 9 series, June 2018 – June 2024. Activity wording is extracted from each paper's text, not typed. |
| `u14_ra10.py` | RA10 practice set tasks, all fictional organisations, in the Pearson format |
| `build_u14.py` | Writes `js/papers-data.js` and checks every task totals 64 + 4 = 68 |
| `build_u14_shell.py` | Generates `index.html`, `css/style.css`, `js/app.js` and `js/data-loader.js` from the BTEC Business Unit 7 app, which uses the same shared engine (`business/shared/biz-*.js`). Every replacement must match, or the build stops. |

Hand-written, never overwritten: `js/cfg.js` (the Pearson band grid per activity, with traits), `js/spec.js`, `js/bank.js`, `js/quiz.js`, `js/cards.js`, `js/guide.js` and `js/papers-figures.js`.

**Marking:** `supabase/functions/ai-mark/it_unit14_examiner.ts` (spec code `20161K`).
- Each activity is one holistic band: the examiner judges every trait, chooses the best-fit band, then a mark within it.
- The Lead Examiner rules are applied as caps.
- Technical language (4 marks) is given as advice only.

**Not yet available:** Jan 2022 and Jan 2023 papers (the examiner reports exist, but the papers are not in the source folder). Add a series by adding an entry to `u14_series.py` with its text file glob.
