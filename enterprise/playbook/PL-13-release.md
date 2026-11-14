# PL-13 — Release (checks, cache busting, deploy, rollback)

**Skill:** `.claude/skills/ra10-release`.

## 1. Pre-flight checks (all must pass)

```bash
python enterprise/scripts/health_check.py                         # 0 FAIL
node training-data/btec/level-3/aaq-build/check_units.js           # if AAQ content changed
python training-data/btec/level-3/aaq-build/browser_test.py <slug> <N>   # for each changed unit
deno check supabase/functions/<fn>/index.ts                        # for each changed function
```

## 2. Bump cache tokens for everything you changed

| Changed | Bump |
|---|---|
| `revision/shared/unit-ui.js` / `.css` | `?v=` in **all 46** unit `index.html` files (`grep -rl "unit-ui.js?v=" revision`) |
| `unit-edu.js` / `unit-feedback.js` | The version strings inside `unit-ui.js`, and then unit-ui itself as above |
| `shared-aaq/*` | `V` in `build_apps.py`, then `python build_apps.py` |
| `shared-alevel/*` | `V` in `build_alevel.py`, then `make_shared.py` and `build_alevel.py` |
| `refresh/*.js` / `.css` | `?v=` in `index.html` (and in `study-hub/` / `school/` if they load the file); `V` in `ra10-refresh.js` for refresh assets |
| `study-hub/*` | `?v=` in `study-hub/index.html` |
| Navbar markup | The `ra10_site_chrome_vN` key in `ra10-site-chrome.js` |

`health_check.py` flags assets referenced with mismatched `?v=` values.

## 3. Deploy order (when a change spans layers)

1. **SQL first** (owner, **PL-09**). New columns and RPCs must exist before code uses them.
2. **Edge functions second** (owner, `npx supabase functions deploy …`).
3. **Static site last:** merge or push to `main` → GitHub Actions "Deploy static site to GitHub Pages" (about 1–2 minutes).

Breaking changes must be backward-compatible across one deploy: an old client calling a new function, and a new client calling an old one.

## 4. Post-deploy smoke test (production)

- [ ] The homepage loads signed out, and the signed-in dashboard renders.
- [ ] One unit per family opens (AAQ, Business, IT, A-Level): guide, practice, papers.
- [ ] The AI Examiner marks one answer.
- [ ] Study Hub opens; Python Lab runs `print(1)`.
- [ ] No new errors in the function logs.

## 5. Rollback

- **Static:** `git revert <sha> && git push`.
- **Function:** check out the previous version of the function folder and redeploy it.
- **SQL:** write a forward fix. Never drop data in a hurry; restore from the Supabase point-in-time backup only with owner approval.
