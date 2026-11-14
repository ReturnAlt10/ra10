# PL-14 — News article and site announcement

**Skill:** `.claude/skills/ra10-news-announcement`.

## News article (in the repo)

The News page is `index.html` → `<div class="page" id="p-news">`. Each release note is an `<article class="news-article">`.

1. **Add a contents link** at the top of the sidebar list (`.news-sidebar ul`): `<li><a href="#news-<id>">Title</a></li>`.
2. **Add the article** at the top of `.news-feed`. Copy an existing one:

   ```html
   <article class="news-article" id="news-<id>" data-category="revision|ai|roadmap|infrastructure|moderation|billing" data-status="live|upcoming" data-date="YYYY-MM-DD">
     <div class="news-media" style="background:linear-gradient(120deg,#c1,#c2,#c3)">
       <svg viewBox="0 0 1200 300" aria-hidden="true"><rect width="1200" height="300" fill="none"/><circle cx="600" cy="150" r="104" fill="#fff" opacity=".16"/><text x="600" y="190" text-anchor="middle" font-size="120">EMOJI</text></svg>
     </div>
     <div class="news-content">
       <div class="news-meta"><span>DD.MM.YYYY</span><span>Label</span></div>
       <h2>Title</h2>
       <p>What changed and why it helps students. Plain English, no internal jargon.</p>
       <div class="news-tags"><span class="news-tag">Live</span><span class="news-tag">Tag</span></div>
     </div>
   </article>
   ```

3. **Update the sidebar `news-spec`** "Last sync" date and, if needed, "Coverage".
4. **Accuracy:** only announce features that are **public and deployed**. If a feature needs an edge-function deploy, publish the article after that deploy. Do not announce schools/EDU until they launch.
5. **Category:** `data-category` must be one of the filter options in `#news-category-filter`.

## Site announcement bar (production data, owner only)

- **Where:** Account page (owner) → "Owner announcement bar". This calls the `site-announcement` edge function.
- **Fields:**
  - emoji (up to 4 characters);
  - message (**up to 240 characters**);
  - duration (24 hours, 3 days or 7 days).
- Users can dismiss it; the dismissal is stored per announcement in `localStorage` `ra10-site-announcement-dismiss-v1`.
- **Template:** `New on RA10: <feature 1>, <feature 2> and <feature 3>. See News for more!`

## Verify

- [ ] The News filters (search, category, status) find the new article.
- [ ] The article id is unique, and the sidebar link scrolls to it.
- [ ] The announcement text is 240 characters or fewer, and every feature it mentions is live.
