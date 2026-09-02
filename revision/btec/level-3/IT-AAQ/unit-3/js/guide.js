/* BTEC IT Unit 3 — Comprehensive Revision Guide
   Aims A, B and C — theory content. Initialised by calling window.initComprehensiveGuide() */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-guide-revised-IT-u3';
  const AIMS = ['A', 'B', 'C'];
  const AIM_TITLES = {
    A: 'Principles of website development & planning to a client brief',
    B: 'Design skills, wireframes and asset management',
    C: 'Building, testing and reviewing websites'
  };
  const AIM_SUBTITLES = {
    A: 'Purpose and audience, layout patterns, navigation, content, design, UX and accessibility, motion, dynamic sites, SEO, planning, legal and ethical constraints',
    B: 'Wireframing tools and techniques, visual style, reviewing fitness for purpose, creating/sourcing/preparing/managing assets',
    C: 'HTML, CSS and JavaScript, responsive layouts, accessibility standards, SEO, self-review, publishing, functionality and usability testing'
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveRevised(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

  function buildSidebar() {
    const items = [
      { aim: 'A', topics: [['A1', 'Purpose & Principles'], ['A2', 'Planning to a Brief']] },
      { aim: 'B', topics: [['B1', 'Website Design'], ['B2', 'Asset Management']] },
      { aim: 'C', topics: [['C1', 'Tools & Techniques'], ['C2', 'Processes'], ['C3', 'Testing']] }
    ];
    return `
<button class="guide-sb-toggle" onclick="this.closest('.guide-sidebar').classList.toggle('sb-open')">
  <span>&#9776; Contents</span><span>&#8595;</span>
</button>
<div class="guide-sidebar-hd">
  <span class="guide-toc-label">Unit 3 Guide · Part 1</span>
</div>
<div class="guide-toc-scroll">
  ${items.map(g => `
  <div class="guide-toc-aim-group">
    <button class="guide-toc-aim-link" onclick="guideScrollTo('guide-aim-${g.aim}')">
      <span class="guide-toc-badge">${g.aim}</span>${AIM_TITLES[g.aim].split(' ').slice(0, 3).join(' ')}…
    </button>
    <div class="guide-toc-topic-links">
      ${g.topics.map(([code, name]) => `<button class="guide-toc-topic-link" onclick="guideScrollTo('gt-${code}')">${code} ${name}</button>`).join('')}
    </div>
  </div>`).join('')}
</div>`;
  }

  function topic(code, name, bodyHtml, startOpen) {
    return `
<div class="guide-topic${startOpen ? ' open' : ''}" id="gt-${code}">
  <div class="guide-topic-hd" onclick="toggleGT('gt-${code}')">
    <span class="guide-topic-code">${code}</span>
    <span class="guide-topic-name">${name}</span>
    <span class="guide-topic-chevron">&#9660;</span>
  </div>
  <div class="guide-topic-body">${bodyHtml}</div>
</div>`;
  }

  function aim(letter, topicsHtml) {
    return `
<div class="guide-aim-section" id="guide-aim-${letter}">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge">${letter}</div>
    <div>
      <div class="guide-aim-title">Aim ${letter}: ${AIM_TITLES[letter]}</div>
      <div class="guide-aim-subtitle">${AIM_SUBTITLES[letter]}</div>
    </div>
  </div>
  ${topicsHtml}
  <button class="guide-mark-btn" id="gmb-${letter}" onclick="toggleGuideRevised('${letter}')">
    <span class="guide-mark-icon">&#9711;</span> Mark Aim ${letter} as revised
  </button>
</div>`;
  }

  const GUIDE_GALLERY = [
    { aim: 'A', kicker: 'Plan', title: 'Purpose, principles & planning', copy: 'Why websites exist, how users read pages, and how to respond to a client brief with research, wireframes and a site map.', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'B', kicker: 'Design', title: 'Design skills & assets', copy: 'Wireframes, visual styles, typography, colour palettes and asset management — everything Task 2 asks for.', image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80' },
    { aim: 'C', kicker: 'Build', title: 'HTML, CSS, JS & testing', copy: 'Code the site, make it accessible and responsive, then test functionality and usability to refine the final product.', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80' }
  ];

  function buildGuideGallery() {
    return `
<section class="guide-gallery" aria-label="Unit 3 visual overview">
  ${GUIDE_GALLERY.map(card => `
  <button class="guide-gallery-card" type="button" onclick="guideScrollTo('guide-aim-${card.aim}')" style="--guide-card-image:url('${card.image}')">
    <span class="guide-gallery-kicker">${card.kicker}</span>
    <span class="guide-gallery-title">${card.title}</span>
    <span class="guide-gallery-copy">${card.copy}</span>
    <span class="guide-gallery-source">Royalty-free stock photo</span>
  </button>`).join('')}
</section>`;
  }

  /* ════════════════════════════════════════════════════════════
     AIM A — Principles & planning
  ════════════════════════════════════════════════════════════ */
  const aimA = aim('A', [
    topic('A1', 'Purpose and principles of websites', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Website principles</span> — the design and layout choices that make a website effective at meeting its purpose and appealing to its intended audience: layout, navigation, content, design, user experience and more.</div>

<p><strong>Why do websites exist? Four common purposes:</strong></p>
<table class="g-table"><thead><tr><th>Purpose</th><th>Example</th><th>What 'success' looks like</th></tr></thead><tbody>
<tr><td><strong>eCommerce</strong></td><td>Amazon, ASOS</td><td>Visitors complete purchases (checkout conversion)</td></tr>
<tr><td><strong>Provide information</strong></td><td>Wikipedia, NHS website</td><td>Visitors find accurate answers quickly</td></tr>
<tr><td><strong>Promote products/services</strong></td><td>Restaurants, gyms, agencies</td><td>Visitors enquire, book or visit</td></tr>
<tr><td><strong>Provide entertainment</strong></td><td>Netflix, gaming sites</td><td>Visitors stay engaged and return</td></tr>
</tbody></table>

<p><strong>Know your audience — demographics and personas:</strong></p>
<ul>
<li><strong>Demographics</strong> are measurable characteristics: age, gender, location, income, education, tech confidence.</li>
<li><strong>User personas</strong> are realistic fictional profiles of typical users — e.g. "Priya, 19, student, browses on her phone at lunch, loves retro music, gets frustrated by slow-loading pages."</li>
<li>Everything — tone, colours, fonts, features — should be chosen with the target audience in mind. A site for 17–23-year-olds should not look or sound like a site for pensioners.</li>
</ul>

<p><strong>Page layout — how users actually read:</strong></p>
<table class="g-table"><thead><tr><th>Pattern</th><th>How it works</th><th>Best for</th></tr></thead><tbody>
<tr><td><strong>F-shaped</strong></td><td>Users scan: horizontal lines across the top, then down the left edge (like the letter F)</td><td>Text-heavy pages — news, blogs, search results. Put key info top-left.</td></tr>
<tr><td><strong>Z-shaped</strong></td><td>Users scan: across the top, diagonally, then across the bottom</td><td>Simple hero/landing pages — headline top-left, call-to-action bottom-right.</td></tr>
<tr><td><strong>Grid layout</strong></td><td>Content aligned to a consistent grid (columns and gutters)</td><td>Almost everything — creates order and consistency (CSS Grid + Flexbox).</td></tr>
<tr><td><strong>Visual hierarchy</strong></td><td>Order elements by importance using size, colour, spacing and position</td><td>All pages — the eye should land on the most important thing first.</td></tr>
<tr><td><strong>Grouping / separating</strong></td><td>Related items grouped; unrelated items separated with white space or lines</td><td>Forms, card layouts, navigation — reduces cognitive load.</td></tr>
</tbody></table>

<p><strong>Navigation — how users find their way:</strong></p>
<ul>
<li><strong>Fixed/sticky navigation</strong> — the menu stays visible while scrolling. Great for long pages; always accessible.</li>
<li><strong>Vertical navigation</strong> — a sidebar menu, common on dashboards and content-heavy sites.</li>
<li><strong>Hamburger menu</strong> — a collapsible icon menu, standard on mobile to save space.</li>
<li><strong>Logical navigation</strong> — structure should be predictable: users shouldn't have to think about where things are. Label menus clearly.</li>
</ul>

<p><strong>Content — what you put on the page:</strong></p>
<ul>
<li><strong>Written content</strong> — clear copy that matches the audience's reading level; short sentences and paragraphs (spec B2 explicitly requires this for your assignment copy).</li>
<li><strong>Visual content</strong> — images, video and graphics that support the message (and are compressed and legally sourced!).</li>
<li><strong>Calls-to-action (CTAs)</strong> — buttons and links that tell the user what to do next: "Buy now", "Join free", "Book a table", "Request a film".</li>
</ul>

<p><strong>Design — typography and colour:</strong></p>
<ul>
<li><strong>Typography:</strong> readable fonts (sans-serif for body text is safest), appropriate sizes (at least 16px body), good line spacing, max ~70 characters per line.</li>
<li><strong>Colour scheme:</strong> pick a small palette (2–3 main colours) that matches the brand/audience, and always check contrast (see accessibility below).</li>
</ul>

<p><strong>User experience (UX) — accessibility, consistency, user-friendliness:</strong></p>
<table class="g-table"><thead><tr><th>Area</th><th>What to include</th></tr></thead><tbody>
<tr><td><strong>Accessibility</strong></td><td>Colour contrast (WCAG ≥ 4.5:1), safe colour combinations (never red/green only), closed captions and transcripts for video, keyboard-only navigation, breadcrumbs, customisable features (e.g. text size)</td></tr>
<tr><td><strong>Consistency</strong></td><td>Same branding, page layout, design and UI elements across all pages — users learn once, then everything feels familiar</td></tr>
<tr><td><strong>User-friendly</strong></td><td>Simple (not cluttered), intuitive (users know where to click without instructions), engaging (features that pull people in), responsive (works on phone, tablet and desktop)</td></tr>
</tbody></table>

<p><strong>Motion and movement — with purpose:</strong></p>
<ul>
<li><strong>Micro-interactions</strong> — tiny feedback animations (button press, toggle switch, heart "like" animation).</li>
<li><strong>Animation</strong> — e.g. an animated logo or smooth transitions between states.</li>
<li><strong>Parallax scrolling</strong> — background moves slower than foreground for depth (use sparingly — can hurt performance and accessibility).</li>
<li><strong>Image sliders/carousels</strong> — rotating featured content.</li>
<li><strong>Purpose of motion:</strong> every animation should guide attention or give feedback — never decorate for its own sake, and respect <code>prefers-reduced-motion</code>.</li>
</ul>

<p><strong>Dynamic websites:</strong></p>
<ul>
<li><strong>Customised user experience</strong> — e.g. Netflix recommendations, personalised dashboards — content changes per user.</li>
<li><strong>Controlled access to content</strong> — member-only areas, paywalls, login-gated downloads.</li>
<li>Dynamic sites usually need a server and database (e.g. PHP + MySQL, APIs). Static HTML/CSS/JS cannot do this alone.</li>
</ul>

<p><strong>Cross-browser compatibility:</strong> browsers (Chrome, Safari, Firefox, Edge) and devices render code slightly differently. Test in multiple browsers and at multiple screen sizes; use responsive design so mobile users get the same quality experience.</p>

<p><strong>Search Engine Optimisation (SEO):</strong></p>
<ul>
<li>Descriptive <code>&lt;title&gt;</code> and <code>&lt;meta name="description"&gt;</code> tags</li>
<li>Keywords used naturally in headings and content</li>
<li>Alt text on images; semantic HTML (<code>&lt;h1&gt;</code> etc.)</li>
<li>Fast loading, mobile-friendly design, secure HTTPS, internal links</li>
</ul>

<div class="exam-tip"><div class="tip-label">&#128161; How this links to your assignment (Task 1)</div>
For Task 1 you research real websites and analyse how they use these principles to meet their purpose and audience. Use the language of the spec: F/Z patterns, visual hierarchy, sticky nav, CTAs, contrast, consistency, SEO. The more spec terms you use accurately, the higher the grade band.</div>`, true),

    topic('A2', 'Planning a website in response to a client brief', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Client brief</span> — the description of what the client wants: the purpose of the site, the target audience, the pages and features required, and any style constraints. Everything you plan must be traceable back to this brief.</div>

<p><strong>1 · Establish the client's requirements</strong> — three strands:</p>
<ul>
<li><strong>Purpose:</strong> what problem does the site solve? What are the key messages? What do users want to achieve (user motivations and goals)?</li>
<li><strong>Intended audience:</strong> who exactly? Age, interests, device habits — and how that shapes design decisions.</li>
<li><strong>Technical requirements:</strong> e.g. "responsive to mobile devices", "three pages", "video content with controls" — the brief may list specific must-includes.</li>
</ul>
<p>Tip: pull EVERY requirement out of the brief into a checklist — then make sure your site map, wireframes, designs and final site each tick every box.</p>

<p><strong>2 · Research to identify new ideas:</strong></p>
<ul>
<li><strong>Existing websites</strong> — research 3+ sites serving a similar purpose; analyse what works and what doesn't (strong/weak layout, navigation, accessibility, mobile experience).</li>
<li><strong>Content ideas</strong> — what content will the site actually show? Moodboards and content lists help.</li>
<li><strong>Available resources</strong> — what assets can you create, source or reuse (and legally)?</li>
<li><strong>Legal and ethical constraints:</strong>
  <ul>
    <li><strong>Copyright</strong> — the Copyright, Designs and Patents Act 1988 protects images, text, music, video. Never copy assets without permission: use Creative Commons / royalty-free stock, embed official videos (YouTube/Spotify handles rights), or create your own.</li>
    <li><strong>Data protection</strong> — UK GDPR: if your site has a form collecting names/emails, you must have a privacy policy, only collect what you need, explain why, and handle data securely.</li>
    <li><strong>Digital accessibility</strong> — the Equality Act 2010 + WCAG mean sites should be usable by people with disabilities: alt text, contrast, keyboard navigation, captions.</li>
    <li><strong>Inclusive and diverse content</strong> — represent different groups positively, avoid stereotypes, and keep tone respectful and accurate.</li>
  </ul>
</li>
</ul>

<p><strong>3 · Structure the website — the site map:</strong></p>
<div class="def-box"><span class="def-term">Site map</span> — a diagram of the site's structure: every page, what content/features each page has, and how pages link together (the navigation). For the assignment you produce an <strong>annotated</strong> site map showing how the structure meets the client's requirements.</div>
<ul>
<li><strong>Number of pages</strong> — the brief may specify (e.g. three pages) — plan exactly which pages.</li>
<li><strong>Content and features</strong> — note on each page what it contains (accordion, form, modal images, search, etc.).</li>
<li><strong>Site navigation</strong> — how users move between pages (menus, links, drop-downs).</li>
</ul>
<p>Use the <strong>Sitemap Builder</strong> in this app to create and annotate yours, then export it as evidence.</p>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Skipping the site map or producing one without annotations. For Distinction (A.D1) the site map must be <em>detailed</em> and <em>annotated</em> to clearly show how the structure meets <em>every</em> client requirement — annotate each page with what it includes and why.</div>`, true)
  ]);

  /* ════════════════════════════════════════════════════════════
     AIM B — Design & assets
  ════════════════════════════════════════════════════════════ */
  const aimB = aim('B', [
    topic('B1', 'Website design — wireframes, visual style and review', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Wireframe</span> — a low-fidelity layout of a page: boxes and placeholders showing where elements go (header, nav, content, images, forms). No colours, no fonts, no images — just structure.</div>

<p><strong>Wireframing tools — pick any (the spec lists these):</strong></p>
<table class="g-table"><thead><tr><th>Tool</th><th>Example</th><th>When to use</th></tr></thead><tbody>
<tr><td>Sketching on paper</td><td>Pencil and paper</td><td>Fast early ideas — always a good start</td></tr>
<tr><td>Graphic design software</td><td>Photoshop, Illustrator</td><td>Pixellayouts, familiarity</td></tr>
<tr><td>UX design software</td><td>Figma, Adobe XD, Sketch</td><td>Professional wireframes + design handoff</td></tr>
<tr><td>Wireframing app</td><td>Balsamiq, Wireframe.cc</td><td>Quick, purpose-built wireframing</td></tr>
</tbody></table>
<p><em>You can also use the built-in Wireframe Designer in this app!</em></p>

<p><strong>Wireframing techniques — what makes a good wireframe:</strong></p>
<ul>
<li><strong>Hierarchy of page elements</strong> — show which elements are most important (bigger/blocks at the top).</li>
<li><strong>Balance of content</strong> — don't cram everything into one corner; distribute content evenly.</li>
<li><strong>Grouping elements</strong> — related blocks together (e.g. all form fields in one area).</li>
<li><strong>Aligning elements</strong> — consistent alignment/columns (grid).</li>
<li><strong>Accurate dimensions</strong> — keep proportions realistic so the design stage isn't surprising.</li>
</ul>

<p><strong>From wireframe to visual design:</strong></p>
<ul>
<li><strong>Visual style</strong> — the "look": colour palette, branding (logo, name), typography (heading + body fonts). Create a small house style so every page matches.</li>
<li><strong>Visual representations / mockups</strong> — high-fidelity versions of the pages showing colours, images, real text and fonts. This is what the page will actually look like.</li>
</ul>

<p><strong>Reviewing fitness for purpose — the spec's review criteria:</strong></p>
<ul>
<li><strong>Quality</strong> — clarity and detail of your designs.</li>
<li><strong>User experience</strong> — would a real user of the target audience find it easy and appealing?</li>
<li><strong>Meeting client requirements</strong> — does the design deliver everything in the brief?</li>
</ul>
<p>Get feedback (classmates, friends, family — like a mini usability test on the design) and <strong>make improvements</strong>. Showing before → after improvements is strong evidence for B.D2.</p>

<div class="exam-tip"><div class="tip-label">&#128161; How this links to your assignment (Task 2)</div>
evidence required: wireframe for each web page, visual designs (style), visual representations (mockups), original and sourced assets, and evidence of asset management. Document your review + improvements too — that's what pushes wireframes from "adequate" (B.P3) toward "mostly effective" (B.M3) and "effective" (B.D2).</div>`, true),

    topic('B2', 'Asset management techniques', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Asset</span> — any file used on the site: written copy, images, icons, logos, video, audio. Asset management is creating, sourcing, preparing and organising those assets professionally.</div>

<p><strong>1 · Creating assets:</strong></p>
<ul>
<li><strong>Writing headlines and copy:</strong> short sentences, short paragraphs, avoid jargon, use an appropriate mode of address (e.g. friendly and direct for a teenage audience, formal for a professional client).</li>
<li><strong>Image editing</strong> — crop, resize, adjust colour/brightness (Photoshop, GIMP, Canva).</li>
<li><strong>Image manipulation</strong> — combine layers, remove backgrounds, add text — create something original.</li>
<li><strong>Vector graphic drawing</strong> — logos and icons as scalable vectors (Illustrator, Inkscape, Figma) — export to SVG.</li>
</ul>

<p><strong>2 · Sourcing assets:</strong></p>
<table class="g-table"><thead><tr><th>Asset</th><th>Where from (legally!)</th></tr></thead><tbody>
<tr><td>Written copy</td><td>Write it yourself — original copy is best evidence</td></tr>
<tr><td>Stock images</td><td>Unsplash, Pexels, Pixabay (royalty-free); Adobe Stock (licence required)</td></tr>
<tr><td>Icons</td><td>Font Awesome, Material Icons, or draw your own SVG</td></tr>
<tr><td>Video</td><td>Embed official videos (YouTube/Vimeo) or shoot/trim your own</td></tr>
</tbody></table>
<p>Always record the source and licence — you'll need it in your asset log.</p>

<p><strong>3 · Preparing assets:</strong></p>
<ul>
<li><strong>Trimming video</strong> — cut out irrelevant parts (e.g. keep only the 20-second clip you need).</li>
<li><strong>Compression</strong> — shrink file sizes so pages load fast (target well under 1MB per image).</li>
<li><strong>File formats</strong> — choose the right one:
  <table class="g-table"><thead><tr><th>Format</th><th>Best for</th></tr></thead><tbody>
  <tr><td>JPG</td><td>Photographs (small, no transparency)</td></tr>
  <tr><td>PNG</td><td>Graphics with transparency (logos, screenshots)</td></tr>
  <tr><td>SVG</td><td>Logos/icons — vector, infinitely scalable</td></tr>
  <tr><td>WebP</td><td>Modern alternative — great compression</td></tr>
  <tr><td>GIF</td><td>Simple animations</td></tr>
  <tr><td>MP4/WebM</td><td>Video</td></tr>
  </tbody></table>
</li>
</ul>

<p><strong>4 · Managing assets — the professional way:</strong></p>
<ul>
<li><strong>Logical folder structure:</strong> <code>/images</code>, <code>/css</code>, <code>/js</code>, <code>/video</code> — so both you and the assessor can find anything.</li>
<li><strong>Naming conventions:</strong> descriptive, consistent, lowercase, no spaces — <code>hero-banner.jpg</code> instead of <code>IMG_3421.JPG</code>.</li>
<li><strong>Asset log:</strong> a table tracking asset name, source (own work or where downloaded from, with credit) and where it's used on the site. This is explicit evidence for B.P4/M4/D2.</li>
</ul>

<div class="mistake-box"><div class="mistake-label">&#9888; Common mistake</div>
Using 4MB screenshots straight onto the page, or naming files "image1.png". Slow pages cost UX and SEO marks; messy file names and a missing asset log cost you the asset-management criteria. Prepare and log everything.</div>`, true)
  ]);

  /* ════════════════════════════════════════════════════════════
     AIM C — Build, process, test
  ════════════════════════════════════════════════════════════ */
  const aimC = aim('C', [
    topic('C1', 'Common tools and techniques — HTML, CSS and JavaScript', `
<div class="def-box"><div class="def-label">Recipe reminder</div>
<strong>HTML</strong> = structure · <strong>CSS</strong> = presentation · <strong>JavaScript</strong> = interactivity.<br>
A typical page: <code>&lt;html&gt;</code> skeleton → <code>&lt;head&gt;</code> (meta, title, CSS link) → <code>&lt;body&gt;</code> (content) → <code>&lt;script&gt;</code> (JS) → styled by CSS.</div>

<p><strong>HTML — the structure:</strong></p>
<ul>
<li><strong>Navigation:</strong> menus (<code>&lt;nav&gt;</code> with <code>&lt;a&gt;</code> links), internal links (to your own pages — <code>about.html</code>), external links (<code>target="_blank" rel="noopener"</code> to other sites), anchors (jump to a section with <code>href="#section"</code>).</li>
<li><strong>Adding content:</strong> text (<code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code>–<code>&lt;h6&gt;</code>, lists), images (<code>&lt;img src alt&gt;</code>), video (<code>&lt;video controls&gt;</code>), tables of information (<code>&lt;table&gt;</code>).</li>
<li><strong>Forms:</strong> <code>&lt;form&gt;</code> with <code>&lt;input&gt;</code>, <code>&lt;textarea&gt;</code>, <code>&lt;select&gt;</code>, <code>&lt;button type="submit"&gt;</code> — always add labels for accessibility.</li>
</ul>

<p><strong>CSS — the presentation:</strong></p>
<ul>
<li><strong>Styling:</strong> colour (<code>color</code>, <code>background-color</code>), web typography (<code>font-family</code>, <code>font-size</code>, Google Fonts), text formatting (<code>line-height</code>, <code>text-align</code>), links and buttons (<code>:hover</code> states), tables, forms.</li>
<li><strong>Page layout:</strong>
  <ul>
  <li><strong>CSS box model</strong> — every element is a box: <em>content → padding → border → margin</em>. Master this and spacing stops being magic.</li>
  <li><strong>Responsive layouts</strong> — media queries (<code>@media (max-width: 768px)</code>) plus layout tools: Flexbox (one-dimensional rows/columns) and Grid (two-dimensional grids).</li>
  </ul>
</li>
</ul>

<p><strong>JavaScript — the interactivity (each of these is in the spec):</strong></p>
<table class="g-table"><thead><tr><th>Feature</th><th>What it does</th></tr></thead><tbody>
<tr><td>Image sliders / gallery</td><td>Rotating or grid-based image displays with navigation</td></tr>
<tr><td>Accordion</td><td>Collapsible sections — click a header to expand/hide content</td></tr>
<tr><td>Tabs</td><td>Switch between panels of content with tab buttons</td></tr>
<tr><td>Modal box</td><td>Overlay dialog (image lightbox, sign-in form)</td></tr>
<tr><td>Filtering information</td><td>Filter a list/work grid by category or keyword</td></tr>
<tr><td>Animation</td><td>Hover effects, transitions, animated logo, motion</td></tr>
<tr><td>Search functionality</td><td>Type to search/filter page content</td></tr>
<tr><td>Shopping cart</td><td>Add/remove items and totals (if your brief needs it)</td></tr>
<tr><td>Interactive maps</td><td>Embedded/Google Maps or custom maps</td></tr>
<tr><td>Video control</td><td>Play/pause custom controls, video backgrounds</td></tr>
</tbody></table>

<p><strong>Workflow:</strong> plan → design (wireframe/mockup) → write HTML → add CSS → add JS → test → refine → publish. Use the built-in Code Editor to practise every technique above.</p>

<div class="exam-tip"><div class="tip-label">&#128161; Quick HTML/CSS/JS starter</div>
<strong>HTML:</strong> <code>&lt;header&gt;&lt;h1&gt;My Site&lt;/h1&gt;&lt;/header&gt;</code> · <strong>CSS:</strong> <code>header { background: #333; color: #fff; }</code> · <strong>JS:</strong> <code>document.querySelector('button').addEventListener('click', ...)</code>. If you can build an accordion, a modal and a filter, you can cover every interactivity requirement.</div>`, true),

    topic('C2', 'Website development processes — accessibility, SEO, review and publishing', `
<p><strong>Accessibility features &amp; standards:</strong></p>
<ul>
<li><strong>Features:</strong> alternative text (alt tags), zoom features, text-to-speech compatibility, keyboard navigation, transcripts/captions, high contrast.</li>
<li><strong>Standards:</strong> <strong>WCAG</strong> (Web Content Accessibility Guidelines, published by the <strong>W3C</strong>) and <strong>HTML5 standards</strong> — the global benchmarks for accessible web content.</li>
<li><strong>Semantic HTML:</strong> use meaningful tags — <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;figure&gt;</code> — instead of piles of <code>&lt;div&gt;</code>s. Screen readers navigate semantic structure; search engines rank it. This is a big one for C.M5/C.D3.</li>
</ul>

<p><strong>Search Engine Optimisation (SEO):</strong></p>
<ul>
<li>One <code>&lt;title&gt;</code> per page, descriptive <code>&lt;meta name="description"&gt;</code></li>
<li>Keyword-rich headings, natural keyword use in body copy</li>
<li>Semantic HTML + alt text + internal links between your pages</li>
<li>Fast performance, mobile-friendly, HTTPS</li>
</ul>

<p><strong>Self-review — the spec's checklist:</strong></p>
<ul>
<li>Quality in comparison to similar websites (is mine as good as the real ones I researched?)</li>
<li>Suitability for audience and purpose</li>
<li>Meeting client requirements (tick every brief requirement!)</li>
<li>Legal and ethical constraints (copyright, GDPR, accessibility)</li>
<li>Consistency (branding, layout, UI elements across pages)</li>
<li>Readability (fonts, contrast, line length)</li>
</ul>
<p>Write up your self-review honestly and show what you changed because of it — that feeds the testing/refinement criteria.</p>

<p><strong>Publishing the website:</strong></p>
<ul>
<li>Choose hosting (Netlify, GitHub Pages, or a paid host) and register a domain if needed.</li>
<li>Upload files (hosting dashboard, FTP like FileZilla, or git push).</li>
<li>Test the live site: links, forms, responsiveness, speed.</li>
<li>Keep files in an accessible format that doesn't need specialist software.</li>
</ul>`, true),

    topic('C3', 'Testing — functionality, usability and refinements', `
<div class="def-box"><div class="def-label">Key definition</div>
<span class="def-term">Test plan</span> — a table documenting each test: description, test data, expected outcome, actual outcome, and comments. Expected vs actual is what makes testing credible evidence.</div>

<p><strong>Functionality testing — does it work?</strong> Cover at least:</p>
<ul>
<li><strong>Links</strong> — every internal and external link goes where it should; no 404s.</li>
<li><strong>User interactivity</strong> — accordions open/close, modals open/close, forms submit, sliders slide, search filters.</li>
<li><strong>Responsive to different screen sizes</strong> — test on phone, tablet, desktop widths (browser dev tools let you resize).</li>
</ul>
<p>Example test plan row: "Navigation to Punk page | Click link | Navigates to punk.html | Link worked | —". Where a test fails, fix it and re-test — that's the refinement loop.</p>

<p><strong>Usability testing — do real users get on with it?</strong></p>
<ul>
<li>Create a <strong>user testing audit</strong> — give classmates/friends/family tasks ("find the contact form and submit it") and record their feedback.</li>
<li>Ask about: <strong>accessibility</strong> (can they tab through? is text readable?), <strong>logical navigation</strong> (can they find things?), <strong>clarity of information</strong> (does content make sense?), and <strong>user experience</strong> (did they enjoy it?).</li>
<li>Collect quotes and ratings — "the menu is confusing on mobile" — then act on them.</li>
</ul>

<p><strong>Refinements:</strong> use the outcomes of functionality testing, usability testing and your self-review to make improvements, then document before → after. Evidence of this loop is exactly what separates C.P5 (basic) from C.M5 (appropriate) and C.D3 (effective + considered).</p>

<div class="exam-tip"><div class="tip-label">&#128161; Evidence checklist for Task 3 (C)</div>
① Screenshot your test plan table with results ② Show usability feedback quotes ③ Show the changes you made ("Before: broken glam link → After: href corrected") ④ Include the final website viewable in a browser. ⑤ Note any synoptic links to Unit 1 (Content area B).</div>`, true)
  ]);

  /* ── Glossary ───────────────────────────────────────────── */
  const glossary = `
<div class="guide-aim-section" id="guide-glossary">
  <div class="guide-aim-hd">
    <div class="guide-aim-badge" style="font-size:.95rem">&#128218;</div>
    <div>
      <div class="guide-aim-title">Key Terms Glossary — All Aims</div>
      <div class="guide-aim-subtitle">Quick-reference definitions for Aims A, B and C</div>
    </div>
  </div>
  <div class="guide-topic open" id="gt-glossary">
    <div class="guide-topic-hd" onclick="toggleGT('gt-glossary')">
      <span class="guide-topic-code">REF</span>
      <span class="guide-topic-name">Key terms and definitions</span>
      <span class="guide-topic-chevron">&#9660;</span>
    </div>
    <div class="guide-topic-body">
      <table class="g-table"><thead><tr><th>Term</th><th>Definition</th></tr></thead><tbody>
      <tr><td>F-shaped pattern</td><td>Reading pattern on text-heavy pages — scan across the top, then down the left</td></tr>
      <tr><td>Z-shaped pattern</td><td>Reading pattern on hero pages — across top, diagonal, across bottom</td></tr>
      <tr><td>Visual hierarchy</td><td>Ordering elements by importance using size, colour, spacing and position</td></tr>
      <tr><td>User persona</td><td>Fictional realistic profile of a typical user, used to design for real people</td></tr>
      <tr><td>CTA</td><td>Call to action — prompts the user to do something (Buy now, Join free)</td></tr>
      <tr><td>Sticky nav</td><td>Navigation that stays visible while scrolling</td></tr>
      <tr><td>Hamburger menu</td><td>Collapsible icon menu, standard on mobile</td></tr>
      <tr><td>Breadcrumbs</td><td>Navigation trail showing where the user is (Home &gt; About &gt; Team)</td></tr>
      <tr><td>WCAG</td><td>Web Content Accessibility Guidelines — W3C international standard</td></tr>
      <tr><td>SEO</td><td>Search Engine Optimisation — techniques to improve search rankings</td></tr>
      <tr><td>Dynamic website</td><td>Customised experience / controlled access, usually server + database</td></tr>
      <tr><td>Site map</td><td>Diagram of the site's pages and how they link — assignment evidence</td></tr>
      <tr><td>Wireframe</td><td>Low-fidelity layout of a page — boxes showing structure, no style</td></tr>
      <tr><td>Mockup / visual rep</td><td>High-fidelity design showing colours, images and fonts</td></tr>
      <tr><td>Asset</td><td>Any file used on the site: copy, images, icons, video</td></tr>
      <tr><td>Asset log</td><td>Record of each asset — name, source, where used</td></tr>
      <tr><td>Semantic HTML</td><td>Meaningful tags (&lt;header&gt;, &lt;nav&gt;, &lt;main&gt;) — helps accessibility and SEO</td></tr>
      <tr><td>CSS box model</td><td>Content → padding → border → margin</td></tr>
      <tr><td>Media query</td><td>@media rule applying styles by screen size — basis of responsive design</td></tr>
      <tr><td>Accordion</td><td>Collapsible sections powered by JS</td></tr>
      <tr><td>Modal</td><td>Overlay dialog on top of the page (image lightbox etc.)</td></tr>
      <tr><td>Alt text</td><td>Text description of an image for screen readers</td></tr>
      <tr><td>Functionality testing</td><td>Testing that features work — links, forms, interactions, responsiveness</td></tr>
      <tr><td>Usability testing</td><td>Real users try the site and give feedback on navigation, clarity, UX</td></tr>
      <tr><td>Self-review</td><td>Reflecting on quality, suitability, requirements, consistency, readability</td></tr>
      <tr><td>Copyright</td><td>Legal protection for created work — don't use others' assets without permission</td></tr>
      <tr><td>UK GDPR</td><td>Data protection law — privacy policy, consent, minimal data collection</td></tr>
      </tbody></table>
    </div>
  </div>
</div>`;

  function buildGuideHTML() {
    return `
<div class="guide-shell">
  <div class="guide-sidebar" id="guide-sidebar-it">
    ${buildSidebar()}
  </div>
  <div class="guide-main">
    <div class="guide-topbar">
      <div class="guide-progress-track"><div class="guide-progress-fill" id="guide-pf-it" style="width:0%"></div></div>
      <span class="guide-progress-text" id="guide-pt-it">0 / 3 aims revised</span>
      <button class="guide-print-btn" onclick="window.print()">&#128438; Print guide</button>
    </div>
    ${buildGuideGallery()}
    ${aimA}
    ${aimB}
    ${aimC}
    ${glossary}
  </div>
</div>`;
  }

  function updateProgress() {
    const revised = getRevised();
    const count = AIMS.filter(a => revised.includes(a)).length;
    const fill = document.getElementById('guide-pf-it');
    const text = document.getElementById('guide-pt-it');
    if (fill) fill.style.width = (count / AIMS.length * 100) + '%';
    if (text) text.textContent = count + ' / ' + AIMS.length + ' aims revised';
    AIMS.forEach(a => {
      const btn = document.getElementById('gmb-' + a);
      if (!btn) return;
      const done = revised.includes(a);
      btn.classList.toggle('revised', done);
      btn.innerHTML = done
        ? '<span class="guide-mark-icon">&#10003;</span> Aim ' + a + ' revised!'
        : '<span class="guide-mark-icon">&#9711;</span> Mark Aim ' + a + ' as revised';
    });
    AIMS.forEach(a => {
      const link = document.querySelector('.guide-toc-aim-link[onclick*="guide-aim-' + a + '"]');
      if (link) link.style.opacity = revised.includes(a) ? '.7' : '1';
    });
  }

  function setupScrollSpy() {
    const sections = document.querySelectorAll('.guide-aim-section[id]');
    if (!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        document.querySelectorAll('.guide-toc-aim-link').forEach(l => {
          l.classList.toggle('active', !!(l.getAttribute('onclick') && l.getAttribute('onclick').includes(id)));
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  window.toggleGT = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  };
  window.toggleGuideRevised = function (aimLetter) {
    const revised = getRevised();
    const idx = revised.indexOf(aimLetter);
    if (idx > -1) revised.splice(idx, 1);
    else revised.push(aimLetter);
    saveRevised(revised);
    updateProgress();
  };
  window.guideScrollTo = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setTimeout(() => { if (el.classList && el.classList.contains('guide-topic') && !el.classList.contains('open')) el.classList.add('open'); }, 350);
  };

  window.initComprehensiveGuide = function () {
    const host = document.getElementById('guide-comprehensive');
    if (!host) return;
    host.innerHTML = buildGuideHTML();
    updateProgress();
    setupScrollSpy();
  };
})();