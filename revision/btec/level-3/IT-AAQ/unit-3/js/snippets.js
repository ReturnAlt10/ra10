/* Code Snippets — a library of ready-made HTML/CSS/JS components the
   learner will need for their Unit 3 website (matching the assignment
   "must-includes"). Each snippet has copy buttons and a live preview. */
(function () {
  'use strict';

  var SNIPPETS = [
    {
      id: 'nav',
      title: 'Responsive navigation (drop-down menu)',
      desc: 'A nav bar that collapses into a hamburger menu on mobile \u2014 meets the "drop-down menus" requirement.',
      html: '<header class="site-header">\n  <div class="logo">My Site</div>\n  <button class="nav-toggle" aria-label="Menu">&#9776;</button>\n  <nav class="site-nav">\n    <a href="index.html">Home</a>\n    <a href="about.html">About</a>\n    <div class="dropdown">\n      <button class="dropbtn">Services &#9662;</button>\n      <div class="dropdown-content">\n        <a href="#">Service 1</a>\n        <a href="#">Service 2</a>\n        <a href="#">Service 3</a>\n      </div>\n    </div>\n    <a href="contact.html">Contact</a>\n  </nav>\n</header>',
      css: '.site-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: #1f2937; color: #fff; flex-wrap: wrap; }\n.logo { font-weight: 800; font-size: 1.2rem; }\n.site-nav { display: flex; gap: 18px; align-items: center; }\n.site-nav a, .dropbtn { color: #fff; text-decoration: none; background: none; border: none; font: inherit; cursor: pointer; padding: 6px 10px; }\n.dropdown { position: relative; display: inline-block; }\n.dropdown-content { display: none; position: absolute; background: #fff; min-width: 160px; box-shadow: 0 8px 16px rgba(0,0,0,.2); z-index: 10; }\n.dropdown-content a { color: #111; display: block; padding: 10px 14px; text-decoration: none; }\n.dropdown:hover .dropdown-content { display: block; }\n.nav-toggle { display: none; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }\n@media (max-width: 640px) {\n  .nav-toggle { display: block; }\n  .site-nav { display: none; width: 100%; flex-direction: column; align-items: flex-start; gap: 6px; }\n  .site-nav.open { display: flex; }\n  .dropdown-content { position: static; box-shadow: none; background: #374151; }\n  .dropdown-content a { color: #fff; }\n}',
      js: 'document.querySelector(".nav-toggle").addEventListener("click", function () {\n  document.querySelector(".site-nav").classList.toggle("open");\n});'
    },
    {
      id: 'accordion',
      title: 'Accordion (FAQ)',
      desc: 'Expandable question/answer sections \u2014 meets the "accordion" requirement.',
      html: '<div class="accordion">\n  <div class="acc-item">\n    <button class="acc-head" type="button">Question one? <span class="acc-icon">+</span></button>\n    <div class="acc-panel"><p>Answer to question one.</p></div>\n  </div>\n  <div class="acc-item">\n    <button class="acc-head" type="button">Question two? <span class="acc-icon">+</span></button>\n    <div class="acc-panel"><p>Answer to question two.</p></div>\n  </div>\n  <div class="acc-item">\n    <button class="acc-head" type="button">Question three? <span class="acc-icon">+</span></button>\n    <div class="acc-panel"><p>Answer to question three.</p></div>\n  </div>\n</div>',
      css: 'body { font-family: sans-serif; max-width: 640px; margin: 20px auto; padding: 0 16px; }\n.accordion { border: 1px solid #ddd; border-radius: 10px; overflow: hidden; }\n.acc-head { display: flex; justify-content: space-between; width: 100%; background: #f6f8fb; border: none; border-bottom: 1px solid #ddd; padding: 14px 16px; font: inherit; font-weight: 700; cursor: pointer; text-align: left; }\n.acc-panel { display: none; padding: 12px 16px; background: #fff; }\n.acc-panel.open { display: block; }\n.acc-icon { font-size: 1.2rem; }',
      js: 'document.querySelectorAll(".acc-head").forEach(function (btn) {\n  btn.addEventListener("click", function () {\n    var panel = btn.nextElementSibling;\n    var open = panel.classList.contains("open");\n    document.querySelectorAll(".acc-panel").forEach(function (p) { p.classList.remove("open"); });\n    document.querySelectorAll(".acc-icon").forEach(function (i) { i.textContent = "+"; });\n    if (!open) { panel.classList.add("open"); btn.querySelector(".acc-icon").textContent = "\\u2212"; }\n  });\n});'
    },
    {
      id: 'modal',
      title: 'Modal / lightbox images',
      desc: 'Click an image to view it enlarged \u2014 meets the "modal images" requirement.',
      html: '<div class="gallery">\n  <img src="https://placehold.co/180x120/1f2937/fff?text=Photo+1" alt="Photo 1" class="gallery-img">\n  <img src="https://placehold.co/180x120/33405d/fff?text=Photo+2" alt="Photo 2" class="gallery-img">\n</div>\n<div class="modal hidden" id="modal" role="dialog" aria-modal="true">\n  <button class="modal-close" aria-label="Close">&times;</button>\n  <img src="" alt="" class="modal-img" id="modal-img">\n</div>',
      css: 'body { font-family: sans-serif; margin: 20px; }\n.gallery { display: flex; gap: 10px; flex-wrap: wrap; }\n.gallery-img { cursor: pointer; border-radius: 8px; }\n.modal { position: fixed; inset: 0; background: rgba(0,0,0,.85); display: flex; align-items: center; justify-content: center; z-index: 100; }\n.modal.hidden { display: none; }\n.modal-img { max-width: 90%; max-height: 85vh; border-radius: 8px; }\n.modal-close { position: absolute; top: 16px; right: 24px; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; }',
      js: 'var modal = document.getElementById("modal");\nvar modalImg = document.getElementById("modal-img");\ndocument.querySelectorAll(".gallery-img").forEach(function (img) {\n  img.addEventListener("click", function () {\n    modalImg.src = img.src; modalImg.alt = img.alt; modal.classList.remove("hidden");\n  });\n});\ndocument.querySelector(".modal-close").addEventListener("click", function () { modal.classList.add("hidden"); });\nmodal.addEventListener("click", function (e) { if (e.target === modal) modal.classList.add("hidden"); });'
    },
    {
      id: 'video',
      title: 'Video with controls',
      desc: 'Embed a video with playback controls \u2014 meets the "video content with controls" requirement.',
      html: '<section class="video-section">\n  <h2>Watch our story</h2>\n  <div class="video-wrap">\n    <video controls poster="https://placehold.co/640x360/1f2937/fff?text=Video">\n      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">\n      Your browser does not support the video tag.\n    </video>\n  </div>\n  <p class="caption">Always embed from an official source and provide captions where possible.</p>\n</section>',
      css: 'body { font-family: sans-serif; margin: 20px; }\n.video-section { max-width: 720px; }\n.video-wrap { position: relative; padding-bottom: 56.25%; height: 0; }\n.video-wrap video { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 10px; background: #000; }\n.caption { color: #555; font-size: .9rem; }',
      js: ''
    },
    {
      id: 'form',
      title: 'Contact form',
      desc: 'A simple form with validation \u2014 meets the "form" requirement (note the privacy statement).',
      html: '<form class="contact-form" id="contact-form">\n  <label for="name">Name</label>\n  <input type="text" id="name" name="name" required>\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required>\n  <label for="message">Message</label>\n  <textarea id="message" name="message" rows="4" required></textarea>\n  <p class="privacy">We only use your details to reply. No data is shared.</p>\n  <button type="submit">Send message</button>\n  <p class="form-status" id="form-status"></p>\n</form>',
      css: 'body { font-family: sans-serif; max-width: 480px; margin: 20px auto; padding: 0 16px; }\n.contact-form label { display: block; margin: 12px 0 4px; font-weight: 600; }\n.contact-form input, .contact-form textarea { width: 100%; padding: 9px; border: 1px solid #ccc; border-radius: 6px; font: inherit; box-sizing: border-box; }\n.contact-form button { margin-top: 14px; padding: 10px 18px; background: #1f2937; color: #fff; border: none; border-radius: 6px; font: inherit; cursor: pointer; }\n.privacy { font-size: .8rem; color: #666; }\n.form-status { color: #0f766e; font-weight: 600; }',
      js: 'document.getElementById("contact-form").addEventListener("submit", function (e) {\n  e.preventDefault();\n  document.getElementById("form-status").textContent = "Thanks! (Demo only \\u2014 connect this to a real backend later.)";\n  this.reset();\n});'
    },
    {
      id: 'search',
      title: 'Search / filter',
      desc: 'Filter a list as the user types \u2014 meets the "search functionality" requirement.',
      html: '<section class="search-section">\n  <input type="search" id="search-input" placeholder="Search\u2026" aria-label="Search">\n  <ul class="item-list" id="item-list">\n    <li>Accordion</li>\n    <li>Modal images</li>\n    <li>Video player</li>\n    <li>Contact form</li>\n    <li>Responsive nav</li>\n  </ul>\n</section>',
      css: 'body { font-family: sans-serif; max-width: 480px; margin: 20px auto; padding: 0 16px; }\n#search-input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font: inherit; box-sizing: border-box; }\n.item-list { list-style: none; padding: 0; }\n.item-list li { padding: 10px; border-bottom: 1px solid #eee; }',
      js: 'document.getElementById("search-input").addEventListener("input", function () {\n  var q = this.value.toLowerCase();\n  document.querySelectorAll("#item-list li").forEach(function (li) {\n    li.style.display = li.textContent.toLowerCase().includes(q) ? "" : "none";\n  });\n});'
    },
    {
      id: 'gallery',
      title: 'Image gallery grid',
      desc: 'A responsive gallery of images.',
      html: '<div class="gallery-grid">\n  <img src="https://placehold.co/300x200/1f2937/fff?text=1" alt="Gallery image 1">\n  <img src="https://placehold.co/300x200/33405d/fff?text=2" alt="Gallery image 2">\n  <img src="https://placehold.co/300x200/0f766e/fff?text=3" alt="Gallery image 3">\n  <img src="https://placehold.co/300x200/c2410c/fff?text=4" alt="Gallery image 4">\n</div>',
      css: 'body { font-family: sans-serif; margin: 20px; }\n.gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }\n.gallery-grid img { width: 100%; border-radius: 8px; display: block; }',
      js: ''
    },
    {
      id: 'a11y',
      title: 'Accessible page skeleton',
      desc: 'Semantic structure, skip link, alt text and lang \u2014 covers the "accessibility" requirement.',
      html: '<a class="skip-link" href="#main">Skip to content</a>\n<header role="banner">\n  <h1>My Accessible Website</h1>\n</header>\n<nav aria-label="Main navigation">\n  <a href="#">Home</a> <a href="#">About</a> <a href="#">Contact</a>\n</nav>\n<main id="main" tabindex="-1">\n  <h2>Welcome</h2>\n  <p>Use semantic HTML, meaningful alt text and sufficient contrast.</p>\n  <img src="https://placehold.co/400x200/1f2937/fff?text=Decorative+image" alt="A description of the image" width="400">\n</main>\n<footer role="contentinfo"><p>&copy; 2026</p></footer>',
      css: 'body { font-family: sans-serif; margin: 0; line-height: 1.6; }\n.skip-link { position: absolute; left: -999px; top: 0; background: #000; color: #fff; padding: 8px; z-index: 99; }\n.skip-link:focus { left: 0; }\nheader { padding: 20px; background: #1f2937; color: #fff; }\nnav { padding: 10px 20px; background: #eee; }\nnav a { margin-right: 12px; }\nmain { padding: 20px; max-width: 700px; }\nfooter { padding: 14px 20px; background: #f6f8fb; }',
      js: ''
    }
  ];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  var activeId = 'nav';
  var activeTab = 'preview';

  function render() {
    var host = document.getElementById('snippets-root');
    if (!host) return;
    var snip = SNIPPETS.find(function (s) { return s.id === activeId; }) || SNIPPETS[0];
    activeId = snip.id;

    var html = '<div class="snip-layout">' +
      '<aside class="snip-list">' +
        SNIPPETS.map(function (s) {
          return '<button class="snip-list-item' + (s.id === activeId ? ' active' : '') + '" data-id="' + s.id + '">' +
            '<b>' + esc(s.title) + '</b><small>' + esc(s.desc) + '</small></button>';
        }).join('') +
      '</aside>' +
      '<div class="snip-detail">' +
        '<div class="snip-head"><h3>' + esc(snip.title) + '</h3><p>' + esc(snip.desc) + '</p></div>' +
        '<div class="snip-tabs">' +
          '<button class="snip-tab' + (activeTab === 'preview' ? ' active' : '') + '" data-tab="preview">Preview</button>' +
          '<button class="snip-tab' + (activeTab === 'code' ? ' active' : '') + '" data-tab="code">Code</button>' +
        '</div>' +
        (activeTab === 'preview'
          ? '<div class="snip-preview"><iframe id="snip-frame" title="Live preview"></iframe></div>'
          : '<div class="snip-code">' +
              codeBlock('HTML', snip.html) +
              codeBlock('CSS', snip.css) +
              (snip.js ? codeBlock('JavaScript', snip.js) : '') +
            '</div>') +
      '</div>' +
    '</div>';

    host.innerHTML = html;

    host.querySelectorAll('.snip-list-item').forEach(function (b) {
      b.addEventListener('click', function () { activeId = b.dataset.id; activeTab = 'preview'; render(); });
    });
    host.querySelectorAll('.snip-tab').forEach(function (b) {
      b.addEventListener('click', function () { activeTab = b.dataset.tab; render(); });
    });
    host.querySelectorAll('.snip-copy').forEach(function (b) {
      b.addEventListener('click', function () {
        var code = b.dataset.code;
        var text = b.dataset.code === 'html' ? snip.html : b.dataset.code === 'css' ? snip.css : snip.js;
        copyText(text);
        var orig = b.textContent;
        b.textContent = 'Copied \u2713';
        setTimeout(function () { b.textContent = orig; }, 1400);
      });
    });

    if (activeTab === 'preview') renderPreview(snip);
  }

  function codeBlock(label, code) {
    return '<div class="snip-block">' +
      '<div class="snip-block-head"><span>' + esc(label) + '</span><button class="snip-copy" data-code="' + esc(label.toLowerCase() === 'javascript' ? 'js' : label.toLowerCase()) + '">Copy</button></div>' +
      '<pre><code>' + esc(code) + '</code></pre>' +
      '</div>';
  }

  function renderPreview(snip) {
    var frame = document.getElementById('snip-frame');
    if (!frame) return;
    var doc = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><style>' + snip.css + '</style></head><body>' + snip.html + (snip.js ? '<script>' + snip.js + '<\/script>' : '') + '</body></html>';
    frame.srcdoc = doc;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () { fallbackCopy(text); });
    } else { fallbackCopy(text); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  window.initSnippets = function () { render(); };
})();
