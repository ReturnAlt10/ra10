# Implementation Plan (as-built): Python Lab

| Piece | Where |
|---|---|
| App | `tools/python-lab/{index.html, lab.js, lab.css}` (CodeMirror 5.65.16 from cdnjs) |
| Runtime | `worker.js`: Pyodide 0.26.4 (Python 3.12) in a Web Worker, 6 s timeout → terminate and restart; scripted `input()` |
| Tasks | `tasks.js` → `window.PY_TASKS` (58). Test types: `io` (41), `fn` (35), `predict` (4); `setup` is Python code |
| Progress | localStorage `ra10_pylab_v1` |
| Tracking | `RA10Track.log('code_task', {unit:'/revision/btec/level-3/computing-aaq/unit-1', ref:'pylab:<id>'})` |
| Links | `EXT_TOOLS` in `revision/shared/unit-ui.js` (Computing Units 1 and 4); Study Hub `codingPanel()` |
| Deploy | `.github/workflows/jekyll-gh-pages.yml` copies `tools/python-lab/` (added 12 Nov 2026) |

**Adding tasks:** follow playbook PL-17 and the `ra10-python-lab-task` skill.
