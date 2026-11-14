# Enterprise scripts

## `health_check.py` — repository health check

```bash
python enterprise/scripts/health_check.py           # full report
python enterprise/scripts/health_check.py --quiet   # only FAIL and WARN
```

It needs `git` and `node` on the PATH, takes about 30–40 s, and **exits with code 1 on any FAIL**, so it is CI-ready.

| Check | FAIL when | WARN when |
|---|---|---|
| `registry` | A registered unit has no app | A unit folder is not registered |
| `sitemap` | — | A registered unit is missing from `sitemap.xml` |
| `js-syntax` | Any tracked JS file (outside `training-data`/vendor) fails to compile | — |
| `corruption` | A control character (e.g. `\x08` from a mangled `\b`) appears in JS/TS/HTML/CSS/SQL/JSON/MD | — |
| `mojibake` | — | Double-encoded UTF-8 (`â€”`, `Ã©`, …) |
| `cache-tokens` | — | The same asset is referenced with different `?v=` values |
| `copyright` | — | PDFs are tracked in git |
| `deploy` | A `/tools/<x>` page is linked but not copied into the Pages artifact | Internal folders are not excluded from the artifact |
| `routing` | A top-level folder clashes with a shell route | — |
| `sql-drift` | A **new** function is defined in more than one `supabase/sql` file | A known duplicate (R-02) |
| `hygiene` | — | Tracked files match `.gitignore` |
| `a-level-labels` | An alevel-build subject's `cfg.js` does not set `AIM_WORD = "Chapter"` | — |

### First run (12 Nov 2026)

The first run found real defects:

- **4 FAILs for corrupted `\b` regex escapes** (literal backspace bytes):
  - `refresh/ra10-ai.js`;
  - the three `biz-papers.js` engine copies. These stopped the "describe your diagram" placeholder from appearing on draw questions.
- **About 180 double-encoded dashes** shown to students in the IT Unit 2/3 and booklets data.
- **`python-lab` missing from the deploy artifact** (Python Lab was not live).

All of these were fixed in the same change. **Current state: 0 FAIL.** The remaining WARNs are documented risks: R-02, R-03, R-10 and cache-token drift.

### Adding a check

Add a `check_<name>()` function that calls `add(level, check, message)`, then add it to the list in `main()`. Each check is wrapped, so a crashing check reports a FAIL rather than hiding the others.
