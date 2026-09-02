// BTEC IT Unit 3 — Website Development — Comprehensive Guide builder
// Builds the revision guide HTML procedurally (same pattern as Unit 1/2's guide.js).
(function () {
  const STORE_KEY = 'ra10-guide-revised-IT-u3';
  const AIM_TITLES = {
    A: 'Impact of website development, and designing a website',
    B: 'Tools and technologies for building, testing and optimising websites',
  };
  const AIM_SUBTITLES = {
    A: 'Understand how websites affect individuals, business and society, and learn to plan a website from a client brief using sitemaps, wireframes and house style.',
    B: 'Understand the core web languages (HTML, CSS, JavaScript), development tools, file types, testing types and how websites are optimised and published.',
  };

  function getRevised() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (e) { return {}; }
  }
  function setRevised(letter, val) {
    const r = getRevised();
    r[letter] = val;
    localStorage.setItem(STORE_KEY, JSON.stringify(r));
  }
  window.toggleGuideRevised = function (letter) {
    const r = getRevised();
    setRevised(letter, !r[letter]);
    renderGuideMarkButtons();
  };
  function renderGuideMarkButtons() {
    const r = getRevised();
    document.querySelectorAll('[data-mark-aim]').forEach((btn) => {
      const letter = btn.getAttribute('data-mark-aim');
      btn.textContent = r[letter] ? '✓ Marked as revised' : 'Mark Aim ' + letter + ' as revised';
      btn.classList.toggle('primary', !!r[letter]);
    });
  }

  window.toggleGT = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('open');
  };

  function topic(code, name, bodyHtml) {
    const id = 'gt-' + code.replace(/\./g, '-');
    return '' +
      '<div class="guide-topic" id="' + id + '">' +
      '  <div class="guide-topic-hd" onclick="toggleGT(\'' + id + '\')">' +
      '    <span class="guide-topic-code">' + code + '</span>' +
      '    <span class="guide-topic-name">' + name + '</span>' +
      '    <span class="guide-topic-chevron">›</span>' +
      '  </div>' +
      '  <div class="guide-topic-body">' + bodyHtml + '</div>' +
      '</div>';
  }

  function aim(letter, topicsHtml, locked) {
    if (locked) {
      return '' +
        '<div class="guide-aim-section" id="guide-aim-' + letter + '">' +
        '  <span class="guide-aim-badge">Learning Aim ' + letter + '</span>' +
        '  <h2 class="guide-aim-title">' + AIM_TITLES[letter] + '</h2>' +
        '  <p class="guide-aim-subtitle">' + AIM_SUBTITLES[letter] + '</p>' +
        '  <div class="guide-locked-overlay">' +
        '    <p style="margin:0 0 12px;font-weight:700">🔒 Unlock Learning Aim ' + letter + '</p>' +
        '    <p style="margin:0 0 14px;color:var(--ink-2);font-size:13px">Aim A is free to preview. Unlock the full guide (Aims A &amp; B) once, for all units you own.</p>' +
        '    <button class="btn primary" id="btn-unlock-guide">Unlock full guide<span class="ra10-cost-label">10 credits</span></button>' +
        '  </div>' +
        '</div>';
    }
    return '' +
      '<div class="guide-aim-section" id="guide-aim-' + letter + '">' +
      '  <span class="guide-aim-badge">Learning Aim ' + letter + '</span>' +
      '  <h2 class="guide-aim-title">' + AIM_TITLES[letter] + '</h2>' +
      '  <p class="guide-aim-subtitle">' + AIM_SUBTITLES[letter] + '</p>' +
      '  <button class="btn ghost guide-mark-btn" data-mark-aim="' + letter + '" onclick="toggleGuideRevised(\'' + letter + '\')">Mark Aim ' + letter + ' as revised</button>' +
      '  <div style="margin-top:14px">' + topicsHtml + '</div>' +
      '</div>';
  }

  function buildAimA() {
    return topic('A1.1', 'Impact of websites on individuals, business and society', '' +
      '<p><strong>Positive impacts</strong> include: global reach for businesses (selling to anyone, anywhere), 24/7 availability, lower costs than a physical shop, instant access to information/services for individuals, and new ways for communities to connect.</p>' +
      '<p><strong>Negative impacts</strong> include: the <em>digital divide</em> (people without internet access/skills are excluded), job losses in some traditional roles (e.g. high-street retail), risk of misinformation spreading quickly, and privacy/security risks from sharing data online.</p>' +
      '<h4>Exam-style tip</h4><p>Always link your answer to the specific scenario/client — e.g. "For this local bakery, a website means..." rather than generic statements.</p>') +
    topic('A1.2', 'Legal, ethical and security considerations', '' +
      '<p><strong>UK GDPR / Data Protection Act 2018</strong> — controls how personal data (names, emails, addresses) collected via forms/cookies is stored, used and protected. Websites must have a privacy policy and get consent for things like marketing emails and non-essential cookies.</p>' +
      '<p><strong>Copyright, Designs and Patents Act 1988</strong> — protects text, images, video and other original work from being copied without permission. Always use royalty-free/licensed images or your own content.</p>' +
      '<p><strong>Computer Misuse Act 1990</strong> — makes unauthorised access to computer systems (hacking) illegal; relevant to website security testing (only test systems you have permission to test).</p>' +
      '<p><strong>Ethical considerations</strong> — being honest in advertising, not using manipulative "dark patterns" to trick users, and considering the wellbeing impact of the site (e.g. avoiding addictive design aimed at children).</p>') +
    topic('A1.3', 'Accessibility and inclusive design', '' +
      '<p>Accessible design means a website can be used by people with a wide range of abilities, including visual, hearing, motor and cognitive impairments. The main standard is <strong>WCAG (Web Content Accessibility Guidelines)</strong>.</p>' +
      '<ul>' +
      '<li><strong>Alt text</strong> on all meaningful images, for screen readers.</li>' +
      '<li><strong>Good colour contrast</strong> between text and background (WCAG AA recommends at least 4.5:1 for normal text).</li>' +
      '<li><strong>Keyboard navigation</strong> — all interactive elements reachable/usable without a mouse.</li>' +
      '<li><strong>Resizable text</strong> that does not break the layout when zoomed.</li>' +
      '<li><strong>Clear, simple language</strong> and consistent navigation to support users with cognitive difficulties.</li>' +
      '</ul>') +
    topic('A2.1', 'Interpreting a client brief and requirements', '' +
      '<p>A client brief describes what the client needs. When reading one, identify:</p>' +
      '<ul>' +
      '<li><strong>Purpose</strong> — inform, sell, entertain, provide a service?</li>' +
      '<li><strong>Target audience</strong> — age, interests, technical ability, devices used.</li>' +
      '<li><strong>Required content/features</strong> — pages needed, forms, galleries, e-commerce, etc.</li>' +
      '<li><strong>Branding/style</strong> — existing logo, colours, tone of voice.</li>' +
      '<li><strong>Constraints</strong> — budget, timescale, technology limits, accessibility requirements.</li>' +
      '</ul>' +
      '<p>Turning these into a design proposal (sitemap + wireframes + house style) is the core of Learning Aim A\'s assignment work — see Part 2 → Task 1.</p>') +
    topic('A2.2', 'Website structure: sitemaps and navigation', '' +
      '<p>A <strong>sitemap</strong> is a diagram of a website\'s pages and how they connect. Two common types:</p>' +
      '<ul>' +
      '<li><strong>Hierarchical (tree) sitemap</strong> — a homepage at the top, branching down into sections and sub-pages. Most websites use this.</li>' +
      '<li><strong>Linear sitemap</strong> — pages follow a fixed sequence, e.g. a multi-step checkout or application form.</li>' +
      '</ul>' +
      '<p>Good navigation design groups related pages logically, keeps the number of clicks to reach any page low ("three-click rule" as a rough guide), and is consistent across every page (e.g. same nav bar).</p>' +
      '<p>Use the <strong>Sitemap Builder</strong> tool (Tools tab) to practise building one interactively for your assignment.</p>') +
    topic('A2.3', 'Wireframes and layout design', '' +
      '<p>A <strong>wireframe</strong> is a low-detail sketch showing where content/features will sit on a page — layout only, not colours or final images. Wireframes usually show placeholder boxes for:</p>' +
      '<ul><li>Header (logo, main nav)</li><li>Hero/banner area</li><li>Main content region(s)</li><li>Sidebar (if used)</li><li>Footer (contact info, links, copyright)</li></ul>' +
      '<p>Wireframes should be produced for each <em>unique</em> page layout in a site (you don\'t need one for every single page if several share a layout). Use the <strong>Wireframe Builder</strong> tool to sketch these digitally for your assignment.</p>') +
    topic('A2.4', 'House style, branding and design principles', '' +
      '<p><strong>House style</strong> is the consistent visual identity applied across a website: colour palette, typography (fonts), logo placement, imagery style and tone of writing. Consistency builds trust and brand recognition.</p>' +
      '<p>Key design principles to reference in your design proposal:</p>' +
      '<ul>' +
      '<li><strong>Balance</strong> — visual weight distributed sensibly across the page.</li>' +
      '<li><strong>Contrast</strong> — important elements (buttons, headings) stand out.</li>' +
      '<li><strong>Consistency</strong> — same styles/patterns used throughout.</li>' +
      '<li><strong>White space</strong> — enough breathing room so content isn\'t cluttered.</li>' +
      '<li><strong>Visual hierarchy</strong> — guiding the eye to the most important content first.</li>' +
      '</ul>');
  }

  function buildAimB() {
    return topic('B1.1', 'HTML — structure and semantic markup', '' +
      '<p>HTML (HyperText Markup Language) defines the structure and content of a page using nested <em>elements</em> made of opening/closing tags, e.g. <code>&lt;p&gt;Hello&lt;/p&gt;</code>.</p>' +
      '<p><strong>Semantic HTML5 elements</strong> describe the meaning of content, not just its look — improving accessibility and SEO:</p>' +
      '<pre>&lt;header&gt;...&lt;/header&gt;\n&lt;nav&gt;...&lt;/nav&gt;\n&lt;main&gt;\n  &lt;section&gt;...&lt;/section&gt;\n  &lt;article&gt;...&lt;/article&gt;\n&lt;/main&gt;\n&lt;footer&gt;...&lt;/footer&gt;</pre>' +
      '<p>Practise building real semantic pages in the <strong>Code Editor</strong> tool (Tools tab).</p>') +
    topic('B1.2', 'CSS — styling, layout and responsive design', '' +
      '<p>CSS (Cascading Style Sheets) controls visual presentation. It can be applied three ways:</p>' +
      '<ul>' +
      '<li><strong>Inline</strong> — <code>style="color:red"</code> on one element (avoid — hard to maintain).</li>' +
      '<li><strong>Internal</strong> — a <code>&lt;style&gt;</code> block in the page\'s <code>&lt;head&gt;</code>.</li>' +
      '<li><strong>External</strong> — a separate <code>.css</code> file linked with <code>&lt;link&gt;</code> — best practice, reusable across pages.</li>' +
      '</ul>' +
      '<p>The <strong>CSS Box Model</strong>: Content → Padding → Border → Margin (inside to outside).</p>' +
      '<p><strong>Responsive design</strong> uses <em>media queries</em> to change layout/styles based on screen size:</p>' +
      '<pre>@media (max-width: 600px) {\n  .nav { flex-direction: column; }\n}</pre>' +
      '<p>Modern layout tools: <strong>Flexbox</strong> (one-dimensional layouts) and <strong>CSS Grid</strong> (two-dimensional layouts).</p>') +
    topic('B1.3', 'JavaScript — interactivity and client-side scripting', '' +
      '<p>JavaScript runs in the browser (client-side) and adds interactivity: responding to clicks, validating forms, updating content without reloading the page.</p>' +
      '<pre>document.getElementById(\'submit-btn\').addEventListener(\'click\', function() {\n  alert(\'Thanks for submitting!\');\n});</pre>' +
      '<p>Common uses in an assignment website: form validation, image sliders/carousels, showing/hiding content (accordions, tabs), simple animations.</p>') +
    topic('B1.4', 'Development tools: code editors vs WYSIWYG (VS Code & Dreamweaver)', '' +
      '<p><strong>Code editors</strong> (e.g. Visual Studio Code) show you the raw HTML/CSS/JS you write. Features: syntax highlighting, IntelliSense (autocomplete), integrated terminal, extensions (e.g. Live Server), Git integration.</p>' +
      '<p><strong>WYSIWYG tools</strong> (e.g. Adobe Dreamweaver\'s <em>Design</em> view) let you build pages visually and generate the code automatically — useful for quickly laying out pages, but developers should still check/edit the generated code.</p>' +
      '<p>The RA10 <strong>Code Editor</strong> tool supports a similar workflow: write code directly (VS-Code style) with live preview, so you learn real coding skills for your assignment.</p>') +
    topic('B2.1', 'File types, formats and optimisation (images, video, fonts)', '' +
      '<ul>' +
      '<li><strong>JPEG</strong> — best for photographs (lossy compression, no transparency).</li>' +
      '<li><strong>PNG</strong> — best for logos/icons (supports transparency, larger file size).</li>' +
      '<li><strong>SVG</strong> — vector graphics (icons/logos), scales without losing quality, tiny file size.</li>' +
      '<li><strong>WebP</strong> — modern format, smaller files than JPEG/PNG at similar quality.</li>' +
      '<li><strong>MP4</strong> — common video format; use compressed video and consider hosting large videos externally (e.g. YouTube embed) rather than uploading huge files.</li>' +
      '<li><strong>Web fonts (WOFF2)</strong> — load custom fonts efficiently; limit the number of font weights/styles used to keep pages fast.</li>' +
      '</ul>') +
    topic('B2.2', 'Content Management Systems (CMS)', '' +
      '<p>A CMS (e.g. WordPress, Wix, Shopify) lets non-developers create/edit content through an interface, without hand-coding every page.</p>' +
      '<p><strong>Pros</strong>: fast to set up, non-technical users can update content, huge plugin/theme ecosystems.<br><strong>Cons</strong>: less control over exact code, can be slower if not optimised, ongoing maintenance/updates needed, potential security risks from plugins.</p>' +
      '<p>Your assignment website (Task 2) is built by hand with HTML/CSS/JS rather than a CMS, so you can demonstrate direct coding skills.</p>') +
    topic('B3.1', 'Testing types: functional, usability, accessibility, cross-browser, performance', '' +
      '<ul>' +
      '<li><strong>Functional testing</strong> — do links, buttons and forms work as intended?</li>' +
      '<li><strong>Usability testing</strong> — is the site easy and intuitive to use for real users?</li>' +
      '<li><strong>Accessibility testing</strong> — does it meet WCAG guidelines (contrast, alt text, keyboard nav)?</li>' +
      '<li><strong>Cross-browser/device testing</strong> — does it look/work correctly on Chrome, Firefox, Safari, Edge, and on mobile/tablet/desktop?</li>' +
      '<li><strong>Performance testing</strong> — does it load quickly, even on a slower connection?</li>' +
      '</ul>' +
      '<p>For your assignment, keep a <strong>test log</strong>: what you tested, expected result, actual result, pass/fail, and any fix made — this evidences Task 3\'s testing criteria.</p>') +
    topic('B3.2', 'Website optimisation: compression, minification, caching', '' +
      '<ul>' +
      '<li><strong>Image compression</strong> — reducing file size of images with minimal visible quality loss.</li>' +
      '<li><strong>Minification</strong> — stripping whitespace/comments from HTML/CSS/JS files.</li>' +
      '<li><strong>Caching</strong> — storing files locally in the visitor\'s browser so repeat visits load faster.</li>' +
      '<li><strong>Reducing HTTP requests</strong> — combining files, using sprite sheets/icon fonts, lazy-loading images below the fold.</li>' +
      '</ul>') +
    topic('B3.3', 'Publishing and hosting a website', '' +
      '<p>To publish live, you need a <strong>domain name</strong> (the web address, e.g. mybakery.co.uk) and <strong>web hosting</strong> (server space storing your files and serving them to visitors).</p>' +
      '<p>Files are commonly uploaded to the host using <strong>FTP</strong> (File Transfer Protocol) or a hosting control panel. Static sites (HTML/CSS/JS only, no server-side database) can also be hosted for free on services like GitHub Pages.</p>');
  }

  window.initComprehensiveGuide = function () {
    const host = document.getElementById('guide-content');
    if (!host) return;
    const guideA = buildAimA();
    const guideB = buildAimB();

    const unlocked = window.__u3GuideUnlocked === true;
    host.innerHTML = '' +
      aim('A', guideA, false) +
      aim('B', guideB, !unlocked);

    renderGuideMarkButtons();

    const unlockBtn = document.getElementById('btn-unlock-guide');
    if (unlockBtn && typeof window.onGuideUnlockClick === 'function') {
      unlockBtn.addEventListener('click', window.onGuideUnlockClick);
    }

    const sidebar = document.getElementById('guide-sidebar-content');
    if (sidebar) {
      const groups = ['A', 'B'].map((letter) => {
        const topics = (window.SPEC && window.SPEC[letter] && window.SPEC[letter].topics) || [];
        const links = topics.map((t) =>
          '<a class="guide-toc-topic-link" href="javascript:void(0)" onclick="guideScrollTo(\'gt-' + t.code.replace(/\./g, '-') + '\')">' + t.code + '</a>'
        ).join('');
        return '<div class="guide-toc-aim-group"><a class="guide-toc-aim-link" href="javascript:void(0)" onclick="guideScrollTo(\'guide-aim-' + letter + '\')">Aim ' + letter + '</a>' + links + '</div>';
      }).join('');
      sidebar.innerHTML = groups;
    }
  };

  window.guideScrollTo = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.classList.contains('guide-topic') && !el.classList.contains('open')) el.classList.add('open');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
})();
