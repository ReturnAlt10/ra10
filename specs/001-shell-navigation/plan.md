# Implementation Plan (as-built): Shell, navigation and routing

## Technical context

The shell is a single page, `index.html`: page markup, News articles and owner panels. The behaviour lives in `refresh/site.js` (about 7.9k lines) and the styles in `refresh/site.css`, `ra10-refresh.css` and `ra10-glass.css`. Hosting is GitHub Pages, where `404.html` bounces unknown paths to `/?__route=<path>`.

## Structure

| Concern | Where |
|---|---|
| Route map (internal key → page id) | `refresh/site.js`, top of the file (`'/leaderboard': 'p-leaderboard'`, …) |
| Public ↔ internal conversion | `toPublicPath()`, `toInternalPath()`, `ra10Route()`, `ra10RoutePath()`; the `ra10:route` event |
| Dynamic subject and unit pages | `p-subject-dyn`, `p-unit-dyn`, driven by `RA10Units` / `RA10Subjects` |
| Signed-in dashboard | `renderSignedInDashboard`, `sdUnitMeta`, `sdIcoHtml`, `sdRenderAll` (`site.js`) |
| Announcement bar | `fetchSiteAnnouncement` → edge function `site-announcement`; dismissal stored in `ra10-site-announcement-dismiss-v1` |
| News filters | `#news-search`, `#news-category-filter`, `#news-status-filter` (`site.js`) |
| Link-interception exclusions | `site.js` around line 1804: `^\/(legal|admin|tools|school|study-hub)` |
| Chrome reuse for standalone pages | `refresh/ra10-site-chrome.js` (sessionStorage `ra10_site_chrome_v2`) |
| Accessibility | `ra10-a11y.js` (`RA10A11y.announce`) |

## Contracts

- **Globals:** `RA10_UNITS`, `RA10Units.{all, byPath, fromLocation}`, `RA10Subjects.{groups, icons, iconFor, qualShort, unitBadge}`.
- **Events:** `ra10:route`.

## Known gaps → roadmap

- `site.js` is a monolith. Split it by page in the build-step milestone (M-6).
- The `404.html` bounce costs an extra round trip on deep links. Real rewrites on a new host would remove it (M-8).
