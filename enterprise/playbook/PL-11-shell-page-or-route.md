# PL-11 — New shell page, route or homepage section

**Skill:** `.claude/skills/ra10-shell-page`.

## Steps

1. **Markup:** add `<div class="page" id="p-<name>">…</div>` to `index.html` next to similar pages.
2. **Route:** add `'/<internal-path>': 'p-<name>'` to the route map at the top of `refresh/site.js`. If the public URL differs, extend `toPublicPath()` / `toInternalPath()`.
3. **Folder check:** **never create a top-level folder with the same name as the route.** GitHub Pages would serve the folder instead of the SPA (this is why community assets live in `refresh/community/`).
4. **Behaviour:** add a render function in `site.js` and listen for `ra10:route`. Lazy-load anything heavy.
5. **Navigation:** add the link to the desktop navbar, the mobile dock or "You" sheet, and the navbar finder if relevant. Note that `ra10-site-chrome.js` copies the navbar into standalone pages; bump its cache key (`ra10_site_chrome_vN`) if you change the navbar markup.
6. **SEO:**
   - add the public URL to `sitemap.xml`;
   - set the title and meta description in the route handler;
   - make sure `404.html` bounces work for deep links.
7. **Styles:** put them in `refresh/site.css`. Check them at 390 px and in dark mode.
8. **Accessibility:** route changes announce through `RA10A11y.announce`, so include a heading. Make every control keyboard-reachable.
9. **Version bump:** bump `?v=` for `site.js` and `site.css` in `index.html`.

## Homepage sections

- **Signed-out** marketing sections live in `index.html`.
- **Signed-in** dashboard cards are built in `site.js` (`renderSignedInDashboard`, `sdRenderAll`).
- Subject lists must come from `RA10_UNITS` / `RA10Subjects` and never be hard-coded.

## Verify

- [ ] Deep link `/<public-path>` loads directly. Test via `?__route=` locally.
- [ ] The back and forward buttons work, and old `#/` links still resolve.
- [ ] No console errors; 390 px; dark mode.
