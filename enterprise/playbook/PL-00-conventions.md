# PL-00 — Conventions that apply to every pipeline

## Approval and safety

- **The owner approves** every production SQL run, edge-function deploy, secret change, Stripe change and announcement. Developers prepare the change and the owner (or a delegated release manager) executes it.
- Do not commit or push to `main` until the change is reviewed. Pushing to `main` **deploys immediately**.
- Touch only what the task needs. Do not "tidy" other subjects' units: their content is hand-verified.

## Generated vs hand-written files

| Never hand-edit (regenerate instead) | Hand-written (edit freely, then rebuild) |
|---|---|
| Unit `index.html`, `css/style.css`, `js/app.js`, `js/data-loader.js`, `js/cfg.js`, `js/spec.js`, `js/papers-data.js`, `js/assignment-data.js` (AAQ / A-Level / Business generated units) | AAQ: `js/{guide,bank,quiz,cards,papers-ra10,assignment-help}.js` in the unit |
| A-Level `js/{bank,guide,papers-ra10}.js` (assembled) | A-Level: `training-data/a-level/alevel-build/content/<slug>/**/NN_*.js` |
| `revision/a-level/shared-alevel/*` (from `make_shared.py`) | Generators and parsers themselves |
| AAQ block of `refresh/ra10-units.js` (`AAQ:START`…`AAQ:END`) | Non-AAQ rows of `refresh/ra10-units.js` |

When a generated file is wrong, fix the **generator or its patch list** (`SPEC_PATCHES`, `make_shared.py` asserted patches, `chapterise()`), then rebuild.

## Writing code safely (lessons that cost real time)

1. **Never patch JS/TS with an inline Python heredoc or string.** `\b`, `\n` and `\r` turn into control characters. Write the patch script to a file with raw strings, or use an editor or the Edit tool. Afterwards:

   ```bash
   grep -rlP '\x08' revision refresh study-hub supabase/functions   # must print nothing
   node --check <file.js>
   ```

2. Open files with `newline=''` in Python to keep the line endings.
3. Patch scripts should **assert** that each target string occurs exactly once before replacing it.
4. After editing any JS, run `node --check` on it. For TypeScript, run `deno check supabase/functions/<fn>/index.ts`.

## Versioning (cache busting)

Changing a shared asset without bumping its token means users keep the old file. The token table is in [05-frontend-runtime.md §6](../docs/05-frontend-runtime.md#6-caching-and-versioning). Use the format `YYYYMMDD`, adding a suffix digit if you bump twice in a day.

## Content accuracy (constitution articles I–III)

- No fabricated statistics. Label illustrative data.
- Verify every calculation and run every code sample.
- Never copy exam-board text beyond the reproduced papers. Keep source PDFs out of git (add them to `.gitignore` **before** copying them in).

## Testing baseline

```bash
python -m http.server 5500 --bind 127.0.0.1          # repo root, keep running
python enterprise/scripts/health_check.py             # repo-wide checks
```

A unit is "done" only when its pipeline's own checker **and** the browser test pass, with:

- no console errors;
- a 390 px phone width with no horizontal scroll;
- readable dark mode.
