---
name: ra10-shell-page
description: Add a page, route, navbar link or homepage/dashboard section to the RA10 shell SPA (index.html + refresh/site.js) with clean-URL routing, SEO, mobile and dark-mode support — or a standalone app/tool page outside the shell. Use for any new site page or navigation change.
---

# RA10 shell page or standalone app

- Pipelines:
  - `enterprise/playbook/PL-11-shell-page-or-route.md` (shell page);
  - `PL-12-standalone-app.md` (standalone app).
- Runtime reference: `enterprise/docs/05-frontend-runtime.md`.

## Shell page

1. Add `<div class="page" id="p-<name>">` to `index.html`.
2. Map `'/<internal-path>': 'p-<name>'` in the route map at the top of `refresh/site.js`. Adjust `toPublicPath` / `toInternalPath` if the public URL differs (internal keys start with `/revision/...`).
3. **Never create a top-level folder named like the route.** GitHub Pages would serve the folder, not the SPA.
4. Render on the `ra10:route` event, not `hashchange`.
5. Add the navigation links: desktop navbar, mobile dock or "You" sheet. If you change the navbar markup, bump the `ra10_site_chrome_vN` key in `refresh/ra10-site-chrome.js`.
6. Subject and unit lists must come from `RA10_UNITS` / `RA10Subjects` and never be hard-coded.
7. Add the page to `sitemap.xml`. Bump `?v=` for `site.js` / `site.css` in `index.html`.

## Standalone app (`/study-hub`-style or `/tools/<name>`)

1. Load the site CSS, `ra10-refresh.css` and `ra10-glass.css`, and use `<body class="ra10-refresh-enabled">`. Load `ra10-site-chrome.js` (real navbar) and `ra10-sdk.js`.
2. Add the path to the link-interception exclusion regex in `refresh/site.js` (around line 1804): `^\/(legal|admin|tools|school|study-hub)`.
3. **Under `/tools/`:** add `rsync -a tools/<name>/ _site/tools/<name>/` to `.github/workflows/jekyll-gh-pages.yml`. Otherwise **it will not deploy**.
4. Overlays need `position:fixed!important` and must attach to `document.documentElement`, because `ra10-refresh.css` makes every body child relative.
5. Track learning with `RA10Track.log(...)`. Award XP only via `increment_xp`.

## Verify

```bash
python -m http.server 5500 --bind 127.0.0.1
# open http://127.0.0.1:5500/?__route=/<public-path>   (deep-link test)
```

- No console errors; 390 px with no horizontal scroll; readable dark mode.
- The back and forward buttons work.
- Run `python enterprise/scripts/health_check.py`.
