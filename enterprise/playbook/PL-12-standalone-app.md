# PL-12 — New standalone app or tool

**When:** the feature is too big for a shell page: its own layout and state, a worker, or heavy libraries. Examples are `/study-hub`, `/school` and `/tools/python-lab`.

## Steps

1. **Choose the location:**
   - top-level (`/study-hub/`) for flagship features;
   - `/tools/<name>/` for utilities.
2. **Exclude it from link interception.** Add the path to the SPA link-interception exclusion regex in `refresh/site.js` (around line 1804): `^\/(legal|admin|tools|school|study-hub)`. Also check the `authchange` return-path regexes (around lines 4869 and 4998).
3. **Deployment.**
   - **Under `/tools/`:** the Pages workflow excludes `tools/`. **Add `rsync -a tools/<name>/ _site/tools/<name>/`** to `.github/workflows/jekyll-gh-pages.yml`. Python Lab was missing this until 12 Nov 2026.
   - **New top-level folder:** it deploys automatically. Check that it is not in the rsync `--exclude` list.
4. **Reuse the site chrome.** Load `refresh/site.css`, `ra10-refresh.css` and `ra10-glass.css`, add `<body class="ra10-refresh-enabled …">`, and include `ra10-site-chrome.js` for the real navbar and mobile dock (see `study-hub/index.html`). Then load `ra10-sdk.js` for auth.
5. **Overlays:** use `position:fixed!important` and attach them to `document.documentElement`.
6. **Track learning.** Call `RA10Track.log('<type>', {unit, ref})` so EDU, quality and XP integrity see it. Award XP only through `increment_xp` / `ra10-xp.js`.
7. **Third-party runtimes:** pin exact CDN versions (for example Pyodide 0.26.4, sql.js 1.10.3) and run heavy code in a Web Worker with a timeout.
8. **Link it** from the relevant unit dashboards (`EXT_TOOLS` in `revision/shared/unit-ui.js`) and the shell navigation.
9. **Release:** add it to `sitemap.xml`, post News (**PL-14**), then follow **PL-13**.

## Verify

- [ ] Works signed out (or shows a clear sign-in prompt) and signed in.
- [ ] The production URL loads after deploy, not just locally.
- [ ] No console errors; 390 px; dark mode.
