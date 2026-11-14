---
name: ra10-python-lab-task
description: Add or edit Python Lab tasks (tools/python-lab/tasks.js, PY_TASKS) mapped to Computing AAQ spec codes, and prove every solution passes all tests and every starter fails in real CPython. Use when adding coding exercises or fixing a Python Lab task.
---

# Python Lab task

**Pipeline:** `enterprise/playbook/PL-17-python-lab-task.md`.

## Shape

```js
{ id: 'B2-04', spec: 'B2.1', topic: 'Lists', level: 2, title: '…', brief: '<p>HTML</p>',
  starter: 'def f(xs):\n    pass\n', solution: '…', hints: ['…'],
  tests: [ { type: 'io', stdin: '3\n', out: '6\n' }, { type: 'fn', check: 'assert f([1,2]) == 3' } ],
  setup: 'with open("data.csv","w") as f:\n    f.write("a,1\\n")' /* optional Python run first */ }
// predict tasks: code: '<program shown>', tests: [{ type: 'predict', out: '<expected output>' }]
```

- **Test types:** `io` (stdin → stdout), `fn` (assertions in `check`), `predict` (the output of `code`).
- **Spec codes:** `spec` must be a real Computing AAQ Unit 1 code (A1–C2) or a Unit 4 project.
- **Ids are permanent:** never change an existing `id`. Progress is keyed by it (`ra10_pylab_v1`).

## Prove it in CPython (mandatory)

Write `scratch/check_tasks.py`:

1. export the tasks: `node -e "global.window={};require('./tools/python-lab/tasks.js');require('fs').writeFileSync('scratch/tasks.json',JSON.stringify(window.PY_TASKS))"`;
2. for each task, `exec` its `setup` code in a fresh temporary directory;
3. run the **solution** against each test (feed `stdin`, compare stdout with `out`, `exec` the `check` asserts). **Every test must pass;**
4. run the **starter** the same way. **At least one test must fail.**

Then:

- run `node --check tools/python-lab/tasks.js`;
- open `/tools/python-lab/`, run the task in Pyodide, and confirm it finishes inside the 6-second timeout;
- bump `tasks.js?v=` in `tools/python-lab/index.html`.
