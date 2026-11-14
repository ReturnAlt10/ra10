---
name: ra10-release
description: Prepare an RA10 release — run repo health and content checks, bump every cache-busting version token for changed shared assets, order SQL → edge functions → static deploy, smoke-test production and know how to roll back. Use before any commit/push to main or when the user asks to ship/deploy/publish.
---

# RA10 release

**Pipeline:** `enterprise/playbook/PL-13-release.md`.

**Pushing to `main` deploys production immediately** (GitHub Pages workflow). Only commit or push when the user asks, and get the owner's approval for SQL and function deploys.

## 1. Checks

```bash
python enterprise/scripts/health_check.py                   # must report 0 FAIL
node training-data/btec/level-3/aaq-build/check_units.js     # if AAQ units changed
python training-data/btec/level-3/aaq-build/browser_test.py <slug> <N>   # each changed unit (server on :5500)
deno check supabase/functions/<fn>/index.ts                  # each changed function
```

## 2. Cache tokens (bump what you changed)

| Changed | Bump |
|---|---|
| `revision/shared/unit-ui.*` | `?v=` in all unit `index.html` files: `grep -rl "unit-ui.js?v=" revision` |
| `unit-edu.js` / `unit-feedback.js` | The strings inside `unit-ui.js`, then unit-ui as above |
| `shared-aaq/*` | `V` in `aaq-build/build_apps.py`, then `python build_apps.py` |
| `shared-alevel/*` | `V` in `alevel-build/build_alevel.py`, then `make_shared.py` and `build_alevel.py` |
| `refresh/*` | `?v=` in `index.html` (and in `study-hub/index.html`, `school/index.html` if they load it); `V` in `ra10-refresh.js` |
| `study-hub/*`, `tools/python-lab/*` | `?v=` in that app's `index.html` |

Format: `YYYYMMDD`, with an extra digit for a second bump in the same day. Use one value per asset across all pages; `health_check.py` flags mismatches.

## 3. Order

SQL (owner) → edge functions (owner: `npx supabase functions deploy …`) → static site (push to `main`).

## 4. Smoke test (production)

- the homepage, signed out and signed in;
- one unit per family;
- the AI Examiner marks one answer;
- Study Hub opens;
- Python Lab runs `print(1)`;
- the function logs are clean.

## 5. Rollback

- **Static:** `git revert <sha>` and push.
- **Function:** redeploy the previous version.
- **SQL:** a forward fix only. Point-in-time restore needs the owner's approval.

If users can see the change, also follow the `ra10-news-announcement` skill.
