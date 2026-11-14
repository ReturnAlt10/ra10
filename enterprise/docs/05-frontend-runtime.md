# 05 — Frontend Runtime

Plain browser JavaScript with no framework, bundler or TypeScript. Modules are IIFEs that publish a `window.*` global. This document lists those globals and the contracts between pages. **Treat them as public APIs:** many files depend on them.

## 1. Script load order (shell `index.html`)

1. Inline `<head>` script: route restore (`?__route=`), theme and `ux-embedded` detection.
2. Static CSS: `refresh/site.css`, `ra10-refresh.css`, `ra10-glass.css`. The `<body class="ra10-refresh-enabled">` class is present from first paint.
3. `ra10-sdk.js` → `window.RA10`. It loads supabase-js 2.118.0 from jsDelivr on demand.
4. `refresh/ra10-units.js` → `RA10_UNITS`, `RA10Units`; then `ra10-subjects.js` → `RA10Subjects`.
5. `refresh/site.js`: router, pages, dashboard.
6. Feature modules: `ra10-xp.js`, `ra10-leaderboard.js`, `ra10-ai.js`, `ra10-track.js`, `ra10-edu.js`, `ra10-onboarding.js`, `ra10-a11y.js`, `ra10-refresh.js` (constant `V`).

## 2. Global API contracts

| Global | Defined in | Contract (do not break) |
|---|---|---|
| `RA10` | `ra10-sdk.js` | **Session and auth:** `init`, `getClient`, `signIn`, `signUp`, `signOut`, `getSession`, `getProfile`, `isLoggedIn`, `isOwner`.<br>**Tier and credits:** `getTier`, `getTierInfo`, `getCredits`, `canAfford`, `spendCredits`, `gate(action, onDenied)`, `showPaywall`, `startCheckout`, `startBillingPortal`.<br>**AI:** `examineAnswer(input)`, `aiMarkAnswer`, `askAiAssigner`, `markAssignment`, `transcribeWork`, `canUseAiMarking`.<br>**Legal:** `getLegalStatus`, `acceptTerms`, `requireTerms`.<br>**Streaks:** `getStreak`, `markStudyDay`.<br>**Events:** `on(evt, fn)`, `off`.<br>**Constants:** `TIER_INFO`, `ACTION_COSTS`, `TRANSITION_MODE` |
| `RA10_UNITS` / `RA10Units` | `refresh/ra10-units.js` | Each item has `{path, subject, qual, short, name, kind, color, keywords}`, plus the derived `app` and `publicPath`. `byPath(p)` accepts both internal and public paths |
| `RA10Subjects` | `refresh/ra10-subjects.js` | `groups()`, `icons`, `iconFor(unit)`, `qualShort`, `unitBadge` |
| `RA10Track` | `refresh/ra10-track.js` | `log(type, {unit, ref, …})`. It writes `activity_events`, which XP integrity and EDU progress rely on |
| `RA10UnitUI` | `revision/shared/unit-ui.js` | `go(view)`, `open`, `close`, `destinations()`, `requireSignIn`, `openGuideSection`, `appData`, `track`, `bump`, `guideHeadings`, `headingId`, `slug`, `esc`, `icons` |
| `BizBank(code, family)` → `{K, KL, M, TF, F, publish}` | `biz-bank.js` (3 copies) | Content authoring API (see [06-content-model.md](06-content-model.md)) |
| `BizGuide` → `{svg: S, h: H}` | `biz-guide.js` | Diagram (`S.*`) and block (`H.*`) libraries |
| `BIZ_GUIDE_DATA` | unit `js/guide.js` | `{storeKey, unitLabel, aimWord, aimLabels, aims, titles, subtitles, setTask, setTaskTitle, topics, gallery}` |
| `BIZ_PAPERS`, `BIZ_LEVELS`, `BIZ_FIGURES` | unit `papers-data.js` / `papers-ra10.js` | Paper objects and level descriptors |
| `AIM_WORD`, `AIM_LABEL` | A-Level `cfg.js` | Display layer only. Data keeps the letters A–T; the UI shows "Chapter 1.1" (Psychology) or "Chapter N" |
| `AqaPapers` | `revision/a-level/shared/aqa-papers.js` | `buildQuestions` (also used by the quality benchmark) |
| `SHCode`, `SHIcons` | `study-hub/` | `SHCode.verify / check / run / sqlTables / warm`; `SHIcons.svg / forLesson / forUnit` |
| `PY_TASKS` | `tools/python-lab/tasks.js` | 58 task objects `{id:'A1-01', spec:'A1.1', topic, level, title, brief, starter, solution, hints, tests[], setup?, code?}`. Each test has a `type` and uses `stdin` / `out` / `check` |
| `RA10A11y` | `ra10-a11y.js` | `announce(text)` |

## 3. Cross-frame protocol (postMessage, same origin only)

Unit apps run inside the shell (iframe, with the `ux-embedded` class) and are also loaded in **hidden iframes** by other features to export their data.

| Message | Direction | Trigger | Payload |
|---|---|---|---|
| `ra10:unit-ready` | unit → parent | App initialised | — |
| `ra10:unit-view` | unit → parent | View changed | view name |
| `ra10:unit-open-menu` | unit → parent | Menu button | — |
| `ra10:catalog` | unit → parent | `?ra10catalog=1` | `{unit, title, questions[], quiz[], papers[], guide[], spec{}, aimWord, aimLabels}` |
| `ra10:questions` | unit → parent | `?ra10catalog=1&full=<ids>` | Full question objects (including the mark scheme) for the AI Examiner |
| `ra10:audit` | unit → parent | `?ra10catalog=1&audit=1` | Content-audit counts (quality dashboard) |
| `ra10:edu-open` / `ra10:edu-ack` | shell ↔ unit | EDU assignment opened | assignment and item ids |

**Consumers:**

- Study Hub (`loadCatalog`, which caches in sessionStorage `ra10_cat_<path>`);
- EDU assignment builder;
- quality audit (three frames at a time);
- onboarding subject scan.

`unit-feedback.js` never loads inside catalogue frames.

### DOM events

| Event | Purpose |
|---|---|
| `ra10:route` | Shell route changed (use this instead of `hashchange`) |
| `ra10:ai-marked` | An AI mark was shown; triggers the "Was this mark fair?" card |
| `ra10:profilerefreshed` | Profile reloaded (credits, tier) |
| `ra10ai:ready`, `ra10math:ready` | Lazy modules ready |

## 4. Routing rules

- **Internal and public keys:** internal keys are `'/revision/...'`. `toPublicPath()` / `toInternalPath()` convert them, and `ra10Route()` / `ra10RoutePath()` read the current route.
- **Unit pages:** static unit pages live in the route map in `site.js`, starting around line 45. Registry units without a static page use `p-subject-dyn` / `p-unit-dyn`.
- **Link interception:** links are intercepted for SPA navigation, except `/legal`, `/admin`, `/tools`, `/school` and `/study-hub` and file links (the regex is in `site.js`, around line 1804). Add new standalone top-level apps to that regex.
- **Sign-in return:** `sessionStorage ra10_after_auth` stores where to return after sign-in (Study Hub and School only).

## 5. CSS conventions and gotchas

- **Positioning overlays:** `ra10-refresh.css` forces every `body > *` to `position:relative; z-index:1`. Overlays and modals on standalone pages must use `position:fixed !important` and attach to `document.documentElement`. Missing this once made Study Hub's "Start lesson" look frozen.
- **Theming:** dark mode is driven by the shell theme. Unit apps inherit it via `ux-embedded`.
- **Mobile width:** the target is **390 px with no horizontal scroll**. Browser tests assert this.
- **Icons:** Study Hub uses custom SVG icons, never emoji (owner preference).

## 6. Caching and versioning

| Cache token | Where | Bump when |
|---|---|---|
| `?v=` on `unit-ui.js/.css` | 46 unit `index.html` files | Changing unit-ui |
| `unit-edu.js?v=`, `unit-feedback.js?v=` | Inside `unit-ui.js` | Changing those modules |
| `V` in `build_apps.py` | All AAQ units (rebuild) | Changing `shared-aaq` |
| `V` in `build_alevel.py` | Psychology and Edexcel (rebuild) | Changing `shared-alevel` / `make_shared.py` |
| `V` in `ra10-refresh.js` | Refresh assets | Changing refresh assets or the XP layer |
| `?v=` in `study-hub/index.html` | Study Hub | Changing `study.js` / `study.css` |
| `CACHE_NAME` in `sw.js` | Service worker | Changing caching strategy |
| `ra10_site_chrome_v2` | sessionStorage key | Changing navbar markup used by chrome reuse |

`enterprise/scripts/health_check.py` reports inconsistent `?v=` tokens for the same asset.
