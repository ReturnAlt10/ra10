---
name: ra10-verify-unit
description: Verify an RA10 unit app or page actually works in a real browser — local server, Playwright smoke test across every view, console errors, 390px phone width, dark mode, label scan (Chapter vs Learning aim), screenshots reviewed. Use after any content/UI change before calling it done.
---

# Verify a unit or page in the browser

## 1. Serve

Run this from the repo root and keep it running:

```bash
python -m http.server 5500 --bind 127.0.0.1
```

## 2. Built-in tests

| Family | Command |
|---|---|
| AAQ | `python training-data/btec/level-3/aaq-build/browser_test.py <slug> [N] --shots <scratch-dir>` |
| Any unit | The ad-hoc Playwright script below |

## 3. Ad-hoc Playwright check (any unit)

```python
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:5500/revision/<path>/index.html'
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome')
    for w in (1280, 390):
        pg = b.new_page(viewport={'width': w, 'height': 900}); errs = []
        pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_function('window.RA10UnitUI', timeout=20000)
        for v in pg.evaluate('RA10UnitUI.destinations().map(d => d.name)'):
            pg.evaluate('n => RA10UnitUI.go(n)', v); pg.wait_for_timeout(900)
            sw = pg.evaluate('document.documentElement.scrollWidth')
            print(w, v, 'scrollWidth', sw, 'OK' if sw <= w else 'OVERFLOW')
            pg.screenshot(path=f'<scratch>/{w}-{v}.png')
        print('errors:', errs)
    b.close()
```

Write the script to a file in the scratchpad; do not run it as an inline heredoc.

## 4. What must pass

- [ ] No console or page errors. Third-party noise is fine only if you can explain it.
- [ ] Every view renders content: dashboard, guide, spec, practice/browse, quiz, flashcards, papers, assignment.
- [ ] `scrollWidth` is 390 or less at phone width.
- [ ] Dark mode is readable (toggle the theme in the shell, or add the dark class).
- [ ] **Label scan:**
  - A-Level pages have no `Learning aim` / `Aim X` text. Run `document.body.innerText.match(/\blearning aims?\b|\baims? [A-T]\b/gi)`.
  - BTEC pages say "Learning aim".
- [ ] You have opened and looked at the screenshots. Do not just count them.
- [ ] Interactions work:
  - open a paper, answer online and reveal the mark scheme;
  - flip a flashcard;
  - score a quiz;
  - expand a guide topic.

## 5. Flakes

"RA10UnitUI is not defined" on a slow load: rerun it once before you investigate.
