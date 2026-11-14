---
name: ra10-news-announcement
description: Add release-note articles to the RA10 News page (index.html #p-news) for new public features and draft the owner's site-wide announcement bar text (≤240 chars). Use when the user asks to update the news, write release notes, or announce new subjects/features.
---

# News and announcements

**Pipeline:** `enterprise/playbook/PL-14-news-and-announcement.md`.

## News article (repo change)

1. Find the facts. Use `git log --since=<last News date> --oneline` and compare it with the existing `<article class="news-article">` ids.
2. Only announce **public, deployed** features.
   - Exclude owner-only tools and unreleased schools/EDU.
   - If a feature needs an edge-function deploy, say so to the owner.
3. Write the script that inserts the articles to a file (never as an inline heredoc), and assert each anchor occurs once. Insert:
   - the articles before the first existing `<article class="news-article"` in `.news-feed`;
   - `<li><a href="#news-<id>">Title</a></li>` at the top of `.news-sidebar ul`.
4. Fill in the article fields:
   - **id:** `news-<kebab>`, unique;
   - **category:** `data-category` must be one of `revision`, `ai`, `roadmap`, `infrastructure`, `moderation`, `billing`;
   - **status and date:** `data-status="live"`, `data-date="YYYY-MM-DD"`;
   - **meta date:** `DD.MM.YYYY` in `.news-meta`.
5. Update the sidebar `news-spec` "Last sync" date.
6. Write in plain English for students, with no internal jargon. Never quote unverified numbers.

Use the article markup from an existing article: a gradient `news-media` with an emoji SVG, then `news-content` containing the meta, `h2`, `p` and tags.

## Announcement bar (production; the owner posts it)

- The owner posts it from **Account → Owner announcement bar**. Do not post it yourself.
- Give the owner:
  - an emoji;
  - a message of **240 characters or fewer** (count it with `python -c "print(len('…'))"`);
  - a suggested duration (7 days for launches).
- **Template:** `New on RA10: <A>, <B> and <C>. See News for more!`
