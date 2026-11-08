# RA10 playbook: adding a subject to the standard of BTEC IT, Business and Sport

This is the complete method for building a new subject (or rebuilding one).
**Do not ship a unit that misses any "must" item.**

The six BTEC National AAQ subjects in this folder (31 units in total) were rebuilt from scratch with this method in November 2026:

- Computing (Units 1–4)
- Construction and the Built Environment (Units 1–6)
- Early Childhood Development (Units 1–4)
- Engineering (Units 1–4)
- Health and Social Care (Units 1–7)
- Medical Science (Units 1–6)

Read sections 1–3 before starting. Then work through section 6 in order.

---

## 1. The quality bar

### Exam units (externally assessed)

The bar is measured against the existing apps.

| Feature | IT U1 | Business U3 | **Minimum for a new exam unit** |
|---|---|---|---|
| Pearson papers (real/sample) in exam layout | 8 | 12 | every paper that exists (for AAQ, the SAM) |
| RA10 practice papers in the exact exam layout | 6 | 10 | **6**: same total marks, time, sections, question styles and tariffs as the real paper |
| Knowledge-bank questions (K) with mark schemes | – | 62 | **60+**: every spec topic, every command word, every tariff |
| Quiz (multiple choice + true/false) | 126 | 84 | **80+**, with an explanation on every item |
| Flashcards | 150 | 80 | **80+**: every key term, formula, theory and model |
| Revision guide | 80 KB, 18 diagrams | 28 KB | **25 KB+**, with an exam section first and then every topic |
| AI Examiner | generic + levels | business examiner | levels descriptors for every extended tariff (`BIZ_LEVELS`) |

### Assignment units (internally assessed)

| Feature | **Minimum** |
|---|---|
| Theory guide | **15 KB+** (aim for 16–18 KB on the first write). Every aim has diagrams, tables and worked examples. Opens with a "The assignment" overview. |
| Knowledge bank / quiz / flashcards | **40+ / 50+ / 50+** |
| Assignment guide | Criteria and assessor guidance (generated), plus **help for every criterion** in `assignment-help.js`: what it means, the evidence to include, and how to reach the next grade. Also `_intro`, `_tips` and one `group:<aims>` note per learning-aim group. |
| Sample assignments | **None.** Pearson publishes none for AAQ internal units, and we never invent them. Teach the theory and guide the evidence instead. |
| AI marking | **Never** for assignment drafts (authenticity rules). |

`check_units.js` enforces every number in these two tables.

---

## 2. Content rules (non-negotiable)

1. **No fabricated facts.**
   - Never present invented statistics, survey results or chart data as real.
   - If a figure is illustrative, say so: "illustrative figures", "example student data", "rates for learning the method".
   - Real-world figures (prices, entitlements, success rates, prevalence) change. Tell students to quote a current source (ONS, NHS, HFEA, GOV.UK, HSE…) with the date they checked.
2. **Verify every worked answer.**
   - Recalculate every number in papers, mark schemes and guide examples.
   - Run code examples. For example, the Unit 4 Computing algorithms were fuzz-tested against `sorted()` and `list.index()`.
   - A wrong mark scheme is worse than no question.
3. **Regulations: name them correctly and flag that they change.** For example: Building Safety Act 2022, Approved Documents, CDM 2015, the Equality Act 2010, the Children and Families Act 2014, UK GDPR.
4. **Follow the specification's own wording where it is unusual, then explain.**
   - Example: Engineering Unit 4 defines "risk" and "issue" the opposite way round from PRINCE2.
   - The guide gives the spec definition first, then notes the difference.
5. **No copied Pearson text,** except in the Pearson paper itself and the generated criteria and guidance.
6. **Style:** British English, plain language, short sentences, correct technical terms.
7. **Sensitive topics** (safeguarding, reproduction, illness, infertility): keep them factual and respectful. Remind students about confidentiality and anonymised case studies.
8. **Safety in practical units:** add a `warn()` about inductions, supervision, PPE and permission before surveying or observing people or buildings.

---

## 3. How the system fits together

```
training-data/btec/level-3/<subject>/        Pearson PDFs + text extracts (spec, SAMs, teaching guide) – NOT in git
        │  parse_spec.py / parse_sam.py
        ▼
aaq-build/out/<slug>.spec.json               aims → topics → points, criteria, assessor guidance
aaq-build/out/<slug>.u<N>.sam.json           SAM question parts + mark schemes
        │  build_apps.py   (applies SPEC_PATCHES + split_merged_criteria first)
        ▼
revision/btec/level-3/<slug>/unit-<N>/       the unit app (generated shell + your hand-written content files)
        │  write_registry.py
        ▼
refresh/ra10-units.js  (AAQ:START … AAQ:END)  site-wide registry → navbar finder, subject pages, homepage, Study Hub, EDU tools
```

### Tools (all in `aaq-build/`)

| Script | Purpose |
|---|---|
| `parse_spec.py` | Spec text → `out/<slug>.spec.json` |
| `parse_sam.py` | SAM text → `out/<slug>.u<N>.sam.json` |
| `build_apps.py [slug] [N]` | Generates `index.html`, `css/style.css`, `js/app.js`, `js/data-loader.js`, `js/cfg.js`, `js/spec.js`, `js/papers-data.js` and `js/assignment-data.js`. Creates stub content files only if they are missing. **It never overwrites hand-written content.** |
| `write_registry.py` | Rewrites the AAQ block of `refresh/ra10-units.js`. Run it whenever a unit or subject is added or renamed. |
| `check_units.js [slug] [N]` | Loads every unit in Node and checks the counts, syntax, RA10 paper totals, guide size and criterion-help coverage. Every line must say `OK`. |
| `browser_test.py [slug] [N] [--shots DIR]` | Playwright smoke test: every view, console errors, diagrams, paper cards and 390 px phone width. Needs `python -m http.server 5500 --bind 127.0.0.1` running from the repo root. |

### Shared engines

The engines in `revision/btec/level-3/shared-aaq/` are copies of the Business engines, so changes here never affect Business, IT or Sport:

- `biz-bank.js`: the `K/M/TF/F` content API
- `biz-guide.js/.css`: guide renderer plus the `S.*` diagram and `H.*` block libraries
- `biz-papers.js/.css`: papers library, exam layout, answer-online mode, PDF output and AI Examiner hooks
- `aaq-assignment.js/.css`: the assignment guide view

**Cache busting:** after changing anything in `shared-aaq`, bump `V` in `build_apps.py` and rebuild every unit. All `?v=` query strings come from `V`.

---

## 4. The content APIs

### `js/bank.js`: knowledge checks (creates the bank; must load first)

```js
const B = BizBank('CP3', 'AAQ'); window.__BIZ_B = B; const { K } = B;
K('A', 'A3 Shneiderman', 'Explain', 2, 'Explain “reduce short-term memory load”.', ['Users should not have to remember… (1)', 'e.g. autofill (1)']);
```

Signature: `K(aim, topicLabel, commandVerb, marks, question, [markPoints])`. Use `KL(...)` for levels-marked items.

Write mark points the way Pearson does: "(1)" per creditable point, linked expansions, and "accept any other appropriate response" where it applies.

### `js/quiz.js` and `js/cards.js`

```js
const { M, TF } = window.__BIZ_B;
M('A', 'Topic', 'Question stem…', 'correct answer', ['wrong 1', 'wrong 2', 'wrong 3'], 'Why (one line).');
TF('A', 'Topic', 'A statement.', true, 'Why.');

const B = window.__BIZ_B, F = B.F;
F('A', 'Front (term)', 'Back (definition / formula / example).');
B.publish();                         // last line of cards.js – publishes the bank to the app
```

Distractors must be plausible: real terms from the same topic, not jokes.

### `js/guide.js`: the revision guide

```js
const { svg: S, h: H } = window.BizGuide;
const { key, tip, warn, fig, table, ul, example, stats, check, two, formula, code } = H;
window.BIZ_GUIDE_DATA = {
  storeKey: 'ra10-guide-revised-<CODE>-aaq-u<N>', unitLabel: 'Unit N Guide', aimWord: 'Aim', aims: ['A','B','C'],
  setTaskTitle: 'The assignment',          // exam units: the exam overview title
  titles: { A: '…' }, subtitles: { A: '…' }, setTask: () => html,
  topics: { A: [{ code: 'A1', name: '…', html: () => html }, …] }, gallery: []
};
```

**Content blocks (`H`)**

| Block | What it renders |
|---|---|
| `key(term, def)` | key-term box |
| `tip(html)` | exam tip |
| `warn(html)` | warning |
| `example(title, html)` | worked example |
| `formula(label, expr, note)` | formula box; `note` must be a **string*** |
| `table(headers, rows)` | table |
| `ul([...])` / `ol([...])` | lists |
| `two(t1, html1, t2, html2)` | side-by-side comparison |
| `stats([[value, label], …])` | stats row |
| `check([...])` | checklist |
| `code(lines, caption)` | line-numbered code |
| `steps`, `cards`, `pill` | other layout blocks |
| `fig(svg, caption)` | wraps any diagram |

*If you pass an array as `formula`'s note, join it first. Some guides use a local wrapper: `const formula=(l,e,n)=>H.formula(l,e,Array.isArray(n)?n.join(' · '):n);`.

**Diagrams (`S`)**

| Helper | Arguments |
|---|---|
| `flow` | `[[title, sub], …]`, `{w, h, fs, label}` |
| `ladder` | `[[title, sub], …]`, `{w, rowH, label}` |
| `cycle` | `[[title, sub], …]`, `{w, h, label}` |
| `tiles` | `[[title, sub], …]`, `{w, cols, label}` |
| `matrix` | cells, options |
| `bars` | data, options |
| `lines` | `[{name, col, pts: [[x, y]]}]`, `{xlabels, ymin, ymax}` |
| `layers` | layers, options |
| `pie` | data, options |
| `pyramid` | levels, options |
| `gantt` | rows, weeks, options |
| `tree` | `{label, kids}` |
| `venn` | sets, center, options |
| `funnel`, `spectrum`, `org` | see `biz-guide.js` |
| `breakEven`, `fiveForces`, `plc` | see `biz-guide.js` |

**Required guide structure:**

- `setTask` opens the guide.
  - Exam units: paper format, command words, levels and examiner advice.
  - Assignment units: stats row, storyline `flow`, `check` list of evidence, own-work and safety `warn`.
- Then every spec topic, in this pattern:
  1. Plain-English explanation.
  2. Diagram.
  3. Table or key terms.
  4. Worked example applied to a scenario.
  5. Tip or common mistake.
- **At least two diagrams per aim.** No topic may be just the spec bullets rewritten.

### `js/papers-ra10.js`: six RA10 practice papers (exam units)

```js
const toBlocks = (arr) => (arr || []).map(b => typeof b === 'string' ? { t: 'p', x: b } : b);
function Q(n, ctx, parts) {            // parts: [sub, marks, text, markScheme, ctxForThisPart?]
  return parts.map((p, i) => ({ q: n, sub: p[0], marks: p[1], section: 'Q' + n, ctx: [],
    ctxb: toBlocks(i === 0 ? ctx : (p[4] || [])), text: p[2], ms: { body: p[3], levels: null } }));
}
```

- **Item shape:** `{q, sub, marks, section, ctx:[lines], ctxb:[blocks], text, ms:{body, levels}}`.
- **Context block types (`ctxb`):** `p`, `h`, `li` (array), `tbl`, `grid`, `code` (array of lines, rendered with line numbers on screen and in the PDF), `fig`, `cap`, `stat`.
- **Sections:** use the paper's real section names. If the SAM has no sections, use `'Q' + n`.
- **MCQ:** append the options to `text` as `"A  option"` lines.
- **Paper object:**

  ```
  {id:'<CODE>-R01', unit, key:'R01', source:'ra10', spec:'ra10', kind:'exam', code:'RA10', series, date, title, blurb, minutes, items, total}
  ```

  Push the paper onto `window.BIZ_PAPERS`.
- **Totals must equal the SAM.** `check_units.js` prints them (e.g. `90/90/90/90/90/90`).
- **Extended answers:**
  - Write indicative content for both sides of the argument.
  - Levels come from `BIZ_LEVELS`, generated per tariff by `levels_for()` in `build_apps.py`.

### `js/assignment-help.js`: assignment units

```js
const CH = (means, evidence, next) => `<p><b>What it means:</b> ${means}</p><p><b>Evidence to include:</b></p><ul>${evidence.map(e => `<li>${e}</li>`).join('')}</ul>${next ? `<p><b>Reaching the next grade:</b> ${next}</p>` : ''}`;
window.AAQ_CRIT_HELP = {
  _intro: '<h3>Before you start</h3>…', _tips: '<ul>…</ul>',
  'group:A': '…', 'group:BC': '…',      // one per learning-aim group that appears in the criteria (e.g. BC.D2 → group:BC)
  'A.P1': CH('…', ['…'], 'For M1, …'), …  // EVERY criterion code in js/assignment-data.js
};
```

---

## 5. Spec-parsing pitfalls (and the fixes now built in)

1. **Merged criteria.**
   - The PDF parse can run two criteria together (Construction Unit 3: "… brief. C.D.3 Evaluate …").
   - `split_merged_criteria()` in `build_apps.py` splits them automatically.
   - Always compare the criteria count in `js/assignment-data.js` with the spec's assessment grid.
2. **Missing or truncated aims and topics.**
   - Construction Unit 6 lost learning aim C, and B2 was cut short. Engineering Unit 4 B3 came through empty.
   - Re-key the content from the spec text into `SPEC_PATCHES` in `build_apps.py`. Use `replace_topic` and `add_aims`, and note the source file in a comment.
   - Audit every subject with:

     ```
     python -c "import json,glob; [print(f,u['n'],set(''.join(c['aims'] for c in u['criteria']))-{a['aim'] for a in u['aims']}) for f in glob.glob('out/*.spec.json') for u in json.load(open(f,encoding='utf-8'))]"
     ```

     Any non-empty set means an aim is missing.
   - Topics that refer back to another unit (e.g. Engineering Unit 3 A2/A3 → Unit 2) are legitimately short. Cover the referenced content in the guide anyway.
3. **SAM parse artefacts.**
   - Table rows can be read as extra question parts.
   - `build_apps.py` keeps a part only if it has a mark scheme or a sub-letter, or if its question has no marked parts at all.
   - Always check that the SAM total matches the front cover.
4. **`spec.js` is generated** and refreshed on every build. Do not hand-edit it; fix the spec JSON or `SPEC_PATCHES` instead.

---

## 6. Method: one unit, in this order

1. **Read the sources.**
   - Print the unit outline (aims, topics, points, criteria). For an exam unit, read the SAM and mark scheme closely.
   - Note the layout, sections, tariffs (1/2/3/4/6/9/12), calculation and data questions, information booklets, and how the mark scheme is phrased.
   - Read the teaching guide for command words and misconceptions.
2. **Run `python build_apps.py <slug> <N>`** to create the shell and any missing stubs.
3. **Write `guide.js`.**
   - Exam units: 25 KB+. Assignment units: 16–18 KB on the first write, so you do not have to top it up later.
4. **Write `bank.js`, `quiz.js` and `cards.js`.**
   - Cover every topic at least twice and every command verb.
   - Include calculations wherever the spec has them, with verified answers.
5. **Write the unit-specific file.**
   - Exam units: `papers-ra10.js` (six papers).
     - Spread the specification across the six papers.
     - Use new, realistic scenarios.
     - Avoid repeating questions between papers.
   - Assignment units: `assignment-help.js` (every criterion, `_intro`, `_tips`, groups).
6. **Check counts and syntax:** `node check_units.js <slug> <N>`. The line must end `OK`.
7. **Browser test:** `python browser_test.py <slug> <N> --shots <dir>`.
   - Open the screenshots and check the dashboard, guide, papers/assignment, practice and the phone view.
   - Then click through by hand: open a paper, answer online, view the mark scheme, run the timer, download the PDF, and try dark mode.
8. **New subject only:**
   - Add the subject to `SUBJECTS` in `build_apps.py` (name, short, PDF prefix, palette).
   - Add it to `REGISTRY` in `write_registry.py` (name, short, colour, keywords).
   - Run `python write_registry.py`. This updates the navbar finder, the subject pages, the signed-out homepage "New … AAQ subjects" section and the Study Hub catalogue, all of which read the registry.
   - Add the subject and its units to `sitemap.xml`.
   - If the subject is not an AAQ `*-aaq` slug, add it to the homepage "Choose your unit" columns in `index.html` by hand.
9. **After all the units are done:**
   1. Bump `V`.
   2. Run `python build_apps.py`, then `node check_units.js` (all `OK`), then `python browser_test.py` (all passed).

---

## 7. Shipping checklist (tick every line)

- [ ] Every spec topic is in the guide, the bank and the cards.
- [ ] Every aim has 2+ diagrams. No topic is just copied bullets.
- [ ] Exam units have six RA10 papers with the exact SAM layout and totals, no duplicate questions, and every number verified.
- [ ] Mark schemes say what earns each mark. Extended answers list indicative content for both sides.
- [ ] Assignment units have help for every criterion (`critHelp=n/n`), plus `_intro`, `_tips` and the group notes.
- [ ] No fabricated statistics. Illustrative numbers are labelled. Current-data reminders are in place.
- [ ] `check_units.js` prints `OK` for every unit, and `browser_test.py` reports "all units passed".
- [ ] No console errors. The phone width is 390 px with no sideways scroll. Dark mode is readable.
- [ ] The registry, sitemap and homepage have been updated, and `V` bumped if `shared-aaq` changed.
- [ ] Nothing is committed or deployed until the owner asks. The owner runs SQL and deploys.

---

## 8. Lessons learned (the November 2026 rebuild)

**Rushed content is not acceptable.**
- The first AAQ pass used thin, generated content. It was thrown away and every unit was hand-written to the bar above.
- Build one unit fully, check it, then move to the next.

**Retired tooling.**
- The retired `build_aaq.py` generated a different, older app. Running it would **overwrite every unit's `index.html`**.
- It has been removed. The only part still needed, the registry writer, now lives in `write_registry.py`.
- Never resurrect a generator without checking what it writes.

**Mistakes that cost time:**
- **Under-sized guides.** Write them to size the first time.
- **Calling helpers with the wrong argument shapes.** `formula` takes a string note; `S.lines` series need `{name, col, pts}`.
- **Python heredocs mangling backslashes and CRLF line endings.** Write patch scripts as files, and open them with `newline=''`.
- **One flaky browser-test failure** ("`RA10UnitUI` is not defined" during a slow load). Rerun before investigating. `browser_test.py` now waits for the app to be ready.

**Check the real spec, not the parse.** When something looks odd (missing aim, merged criteria), open `<subject>/text/*specification*.txt` and compare.
