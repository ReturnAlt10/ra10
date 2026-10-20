# BTEC Sport Unit 2 (31525H) — examiner notes used to build RA10

Source material (kept out of git, see `.gitignore`): the 12 published Pearson set tasks
(June 2017 – June 2024) and the 13 Lead Examiner reports, in `src/`, with extracted text in `text/`.
This file summarises, in our own words, what those reports say about marking. It feeds
`supabase/functions/ai-mark/sport_unit2_examiner.ts` and the mark schemes in
`revision/btec/level-3/sport/unit-2/js/u2-cases.js`.

## Format (identical every series)
- Part A: short case study released before the session; 4 hours research; 4 sides of A4 bullet-point notes.
- Part B: 2 h 30 min supervised; lifestyle questionnaire (occupation, activity, two-day food diary, supplements,
  alcohol units, cigarettes, stress, sleep, BP, RHR, BMI, WHR, goals) + six activities, 60 marks.

| Activity | Task | Marks | Bands | Trait weights (June 2024) |
|---|---|---|---|---|
| 1 | Interpret lifestyle factors and screening information | 12 | 1–3, 4–6, 7–9, 10–12 | 35 / 35 / 30 |
| 2 | Provide and justify lifestyle modification techniques | 12 | 1–3, 4–6, 7–9, 10–12 | 30 / 50 / 20 |
| 3 | Provide and justify nutritional guidance | 8 | 1–2, 3–4, 5–6, 7–8 | 40 / 60 |
| 4 | Propose and justify training methods | 8 | 1–2, 3–4, 5–6, 7–8 | 40 / 60 |
| 5 | Design weeks 1, 3 and 6 of a six-week programme | 6 | 1–2, 3–4, 5–6 | 40 / 60 |
| 6 | Justify the programme using the principles of training | 14 | 4 bands (12–14 top) | 70 / 30 |

The weights are stated to change between series to suit the scenario. The band ranges for Activity 6 are
inferred (4 bands, 14 marks) from the graded examples; the other ranges follow from the reports.

## What the top band needs
1. All seven lifestyle factors (diet, exercise, smoking, alcohol, stress, sleep, sedentary lifestyle) described,
   impact analysed for the individual, and all four tests interpreted against normative data with reasons.
2. A specification technique for at least three negative factors (stress, alcohol, smoking, physical activity),
   each justified for the individual including barriers to change, linked to the analysis and prioritised.
3. Recommended daily calories (deficit for weight loss), three macronutrients with quantities and sources,
   micronutrients with sources, hydration; ergogenic aids when the scenario is sport-specific.
4. A specification method for at least four relevant components of fitness, each justified; say which is most appropriate.
   "Weight training" is not accepted — free weights, fixed resistance machines or circuit training are.
5. At least three relevant components, FITT applied in full with intensities (%MHR/bpm aerobic, %1RM resistance; RPE accepted),
   progression, variation, rest days and individual needs.
6. FITT plus at least six further principles justified; aims/objectives, SMARTER (every letter, in order),
   periodisation and resources.

## Graded anchors (June 2024, Sadie)
12/12, 3/12 (A1) · 10/12, 5/12 (A2) · 7/8, 2/8 (A3) · 7/8, 2/8 (A4) · 6/6, 3/6 (A5) · 13/14, 4/14 (A6).
The trait-band combinations behind each are encoded in `ANCHORS` in the examiner module and the
post-processor reproduces all nine marks.

## Recurring examiner comments
- Interpretations must use normative data; wrong categories are not credited.
- Generic advice without a named technique is low band.
- Describing what happens each day is not justification (Activity 6).
- Missing intensities is the main reason Activity 5 drops a band.
- Learners leave letters out of SMARTER.
