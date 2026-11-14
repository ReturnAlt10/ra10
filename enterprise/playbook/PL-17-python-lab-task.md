# PL-17 — Python Lab task

**File:** `tools/python-lab/tasks.js` (`window.PY_TASKS`, currently 58 tasks).

## Task shape

```js
{ id: 'A1-01', spec: 'A1.1', topic: 'Number systems', level: 1,           // level 1–3 (shown as dots)
  title: 'Denary to binary',
  brief: 'HTML task description',
  starter: 'def to_binary(n):\n    ...',
  solution: '...',                                                       // reference solution (never shown until revealed)
  hints: ['...'],
  tests: [ { type: 'io', stdin: '3\n', out: '6\n' },                     // io: stdin → expected stdout (41 tests)
           { type: 'fn', check: 'assert f([1,2]) == 3' },                // fn: Python assertions, optional stdin (35)
           { type: 'predict', out: '3\ntuples are immutable' } ],        // predict: learner predicts the output of `code` (4)
  setup?: 'with open("scores.txt","w") as f: ...',                       // Python run first to create files the task needs
  code?: '...' }                                                         // the program shown in predict / trace-table tasks
```

The `spec` code must exist in Computing AAQ Unit 1 (A1–C2) or match a Unit 4 project. Study Hub's coding panel recommends tasks by `spec` and weak topics.

## Steps

1. Write the task, with tests that pin down the behaviour, including edge cases (0, empty input, negatives).
2. **Prove it in CPython:**
   - the `solution` passes **every** test;
   - the `starter` passes **none** (otherwise the task can be "solved" without doing anything).

   Export the tasks with Node and run them:

   ```bash
   node -e "global.window={};require('./tools/python-lab/tasks.js');require('fs').writeFileSync('tasks.json',JSON.stringify(window.PY_TASKS))"
   # then a small Python harness: for each task, exec the solution, feed stdin, compare stdout / run the check
   ```

3. Run `node --check tools/python-lab/tasks.js`, then open `/tools/python-lab/`, run the task, and confirm it is marked correct.
4. Bump `?v=` for `tasks.js` in `tools/python-lab/index.html`.

## Verify

- [ ] The solution passes every test, and the starter fails at least one.
- [ ] It runs in the Lab within the 6-second worker timeout.
- [ ] Progress (localStorage `ra10_pylab_v1`) is not reset: **never change an existing task `id`**.
