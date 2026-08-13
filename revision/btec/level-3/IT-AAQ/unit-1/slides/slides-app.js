/* RA10 Slides — Interactive presentation engine v2
   Shared across all units. Loaded from unit-1/slides/slides-app.js
   Expects window.SLIDES_DATA to be defined by the unit's slides data file. */
(function() {
'use strict';

let currentSlide = 0;
let currentPresentation = null;
let fullscreen = false;
let fsCurrentSlide = 0;

function $(s, p) { return (p || document).querySelector(s); }
function el(tag, attrs, ...children) {
  const e = document.createElement(tag);
  if (attrs) {
    for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
  }
  children.flat().forEach(c => {
    if (c == null || c === false) return;
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
}

const SLIDES_CSS = `
.slides-shell { font-family: var(--font, 'Satoshi', system-ui, sans-serif); max-width:1200px; margin:0 auto; }
.slides-library { display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:16px; margin-bottom:24px; }
.slides-lib-card { background:var(--surface,#fff); border:1px solid var(--line,#e2e5df); border-radius:12px; padding:20px; cursor:pointer; transition:all .25s cubic-bezier(.16,1,.3,1); position:relative; overflow:hidden; }
.slides-lib-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, var(--accent), var(--accent-2)); transform:scaleX(0); transform-origin:left; transition:transform .35s ease; }
.slides-lib-card:hover { border-color:var(--accent); transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.1); }
.slides-lib-card:hover::before { transform:scaleX(1); }
.slides-lib-card .aim-badge { display:inline-block; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:800; letter-spacing:.05em; background:var(--accent-2); color:var(--accent-ink); margin-bottom:10px; }
.slides-lib-card h3 { margin:0 0 6px; font-size:18px; font-weight:800; }
.slides-lib-card p { margin:0; color:var(--ink-2); font-size:13px; line-height:1.45; }
.slides-lib-card .slide-count { display:inline-block; margin-top:10px; font-size:11px; color:var(--accent); font-weight:700; background:var(--accent-2); padding:2px 8px; border-radius:999px; }

.slides-viewer { display:none; }
.slides-viewer.active { display:block; animation:fadeIn .3s ease; }
@keyframes fadeIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:none;} }

.slides-toolbar { display:flex; align-items:center; gap:10px; padding:10px 16px; background:var(--bg); border:1px solid var(--line); border-radius:12px 12px 0 0; flex-wrap:wrap; }
.slides-toolbar .btn { font-size:12px; padding:6px 12px; }
.slides-toolbar .pres-title { font-weight:800; font-size:15px; flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.slides-toolbar .slide-counter { font-size:13px; color:var(--ink-2); font-family:var(--mono,monospace); white-space:nowrap; }
.slides-ra10-badge { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:800; color:#d20000; letter-spacing:.03em; background:rgba(210,0,0,.08); padding:3px 8px; border-radius:999px; white-space:nowrap; }

/* PROGRESS BAR */
.slides-progress-wrap { height:3px; background:var(--line); position:relative; }
.slides-progress-fill { height:100%; background:var(--accent); transition:width .35s ease; }

/* SLIDE CARD — looks like an actual presentation slide */
.slides-stage { position:relative; min-height:420px; display:flex; align-items:center; justify-content:center; padding:24px; background:linear-gradient(160deg, #e8ecf1 0%, #dfe3e8 40%, #d5dbe2 100%); }
.slides-stage .slide-content { width:100%; max-width:960px; }
.slide-card { background:#fff; border-radius:14px; box-shadow:0 8px 40px rgba(0,0,0,.15), 0 2px 8px rgba(0,0,0,.08); padding:48px 52px 40px; min-height:380px; position:relative; overflow:hidden; animation:slideCardIn .5s cubic-bezier(.16,1,.3,1); }
@keyframes slideCardIn { from{opacity:0;transform:translateY(20px) scale(.97);} to{opacity:1;transform:none;} }
.slide-card::before { content:''; position:absolute; top:0; left:0; right:0; height:5px; background:linear-gradient(90deg, var(--accent), #d20000 70%, var(--accent)); }
.slide-title { font-size:clamp(22px,3vw,34px); font-weight:900; margin:0 0 8px; line-height:1.15; color:var(--ink); }
.slide-subtitle { font-size:16px; color:var(--ink-2); margin:0 0 22px; line-height:1.5; }
.slide-body { font-size:15px; line-height:1.65; color:var(--ink); }
.slide-body h3 { font-size:20px; font-weight:800; margin:20px 0 8px; color:var(--accent-ink); }
.slide-body h4 { font-size:16px; font-weight:700; margin:14px 0 6px; }
.slide-body ul, .slide-body ol { padding-left:22px; margin:8px 0; }
.slide-body li { margin-bottom:5px; }
.slide-body table { width:100%; border-collapse:collapse; margin:12px 0; font-size:13px; }
.slide-body th, .slide-body td { text-align:left; padding:7px 10px; border-bottom:1px solid var(--line); vertical-align:top; }
.slide-body th { background:var(--bg); font-weight:700; font-size:12px; text-transform:uppercase; letter-spacing:.04em; }
.slide-body .def-box { background:var(--bg); border-left:4px solid var(--accent); padding:10px 14px; border-radius:0 8px 8px 0; margin:12px 0; font-size:14px; }
.slide-body .def-box .def-label { font-size:10px; text-transform:uppercase; letter-spacing:.08em; font-weight:700; color:var(--accent); margin-bottom:4px; }
.slide-body .exam-tip { background:#fefce8; border-left:4px solid #eab308; padding:10px 14px; border-radius:0 8px 8px 0; margin:12px 0; font-size:13px; }
.slide-body .exam-tip .tip-label { font-weight:700; color:#854d0e; }
.slide-body .formula-box { background:var(--bg); border:1px solid var(--line); padding:10px 14px; border-radius:8px; margin:10px 0; font-family:var(--mono,monospace); font-size:13px; white-space:pre-wrap; }

.slide-footer { margin-top:28px; padding-top:10px; border-top:1px solid var(--line); font-size:11px; color:var(--muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; }

/* Laser pointer effect */
.slides-stage .laser-dot { position:absolute; width:12px; height:12px; border-radius:50%; background:#ff2020; box-shadow:0 0 12px #ff2020, 0 0 24px rgba(255,32,32,.4); pointer-events:none; z-index:99; opacity:0; transition:opacity .15s; }
.slides-stage .laser-dot.show { opacity:1; }

/* THUMBNAIL STRIP */
.slides-thumb-strip { display:flex; gap:8px; padding:12px 16px; background:var(--bg); border:1px solid var(--line); border-top:0; border-radius:0 0 12px 12px; overflow-x:auto; }
.slides-thumb { flex:0 0 120px; height:72px; background:var(--surface); border:2px solid var(--line-2); border-radius:6px; padding:6px 8px; cursor:pointer; font-size:10px; font-weight:700; color:var(--ink-2); transition:all .15s; overflow:hidden; display:flex; flex-direction:column; justify-content:center; text-align:center; line-height:1.3; position:relative; }
.slides-thumb:hover { border-color:var(--accent); }
.slides-thumb.active { border-color:var(--accent); background:var(--accent-2); color:var(--accent-ink); }
.slides-thumb .thumb-num { position:absolute; top:3px; left:6px; font-size:9px; font-family:var(--mono,monospace); opacity:.6; }

/* NAV below stage */
.slides-nav { display:flex; align-items:center; justify-content:center; gap:10px; padding:10px 16px; background:var(--bg); border:1px solid var(--line); border-top:0; border-radius:0 0 12px 12px; }
.slides-nav .nav-btn { width:38px; height:38px; border-radius:50%; border:1px solid var(--line-2); background:var(--surface); cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; transition:all .15s; color:var(--ink); }
.slides-nav .nav-btn:hover { border-color:var(--accent); background:var(--accent-2); }
.slides-nav .nav-btn:disabled { opacity:.3; cursor:default; }
.slides-nav .nav-dots { display:flex; gap:4px; }
.slides-nav .nav-dot { width:7px; height:7px; border-radius:50%; background:var(--line-2); border:none; cursor:pointer; padding:0; transition:all .15s; }
.slides-nav .nav-dot.active { background:var(--accent); transform:scale(1.5); }

@media (max-width:700px) {
  .slide-card { padding:28px 22px 24px; min-height:320px; }
  .slide-title { font-size:20px; }
  .slides-thumb { flex:0 0 80px; height:56px; font-size:9px; }
}

/* Fullscreen */
.slides-fullscreen { display:none; position:fixed; inset:0; z-index:99999; background:#0a0f18; color:#e2e8f0; font-family:var(--font, 'Satoshi', system-ui, sans-serif); }
.slides-fullscreen.active { display:flex; flex-direction:column; }
.slides-fullscreen .fs-stage { flex:1; display:flex; align-items:center; justify-content:center; padding:40px 60px; overflow:auto; background:radial-gradient(ellipse at center, #1a1f2e 0%, #0a0f18 100%); }
.slides-fullscreen .fs-stage .slide-card { background:#1e2433; color:#e2e8f0; box-shadow:0 12px 60px rgba(0,0,0,.5); animation:slideInFs .45s cubic-bezier(.16,1,.3,1); }
.slides-fullscreen .fs-stage .slide-card::before { background:linear-gradient(90deg, #3b82f6, #d20000 70%, #3b82f6); }
.slides-fullscreen .fs-stage .slide-title { color:#f1f5f9; }
.slides-fullscreen .fs-stage .slide-subtitle { color:#94a3b8; }
.slides-fullscreen .fs-stage .slide-body { color:#cbd5e1; }
.slides-fullscreen .fs-stage .slide-body h3 { color:#e2e8f0; }
.slides-fullscreen .fs-stage .slide-body th { background:rgba(255,255,255,.05); color:#e2e8f0; }
.slides-fullscreen .fs-stage .slide-body td { border-color:rgba(255,255,255,.08); }
.slides-fullscreen .fs-stage .slide-body .def-box { background:rgba(37,99,235,.12); border-left-color:#3b82f6; }
.slides-fullscreen .fs-stage .slide-body .exam-tip { background:rgba(234,179,8,.12); border-left-color:#eab308; }
.slides-fullscreen .fs-stage .slide-footer { border-color:rgba(255,255,255,.1); color:#64748b; }
@keyframes slideInFs { from{opacity:0;transform:translateY(20px) scale(.97);} to{opacity:1;transform:none;} }
.slides-fullscreen .fs-toolbar { display:flex; align-items:center; gap:12px; padding:8px 20px; background:rgba(0,0,0,.4); backdrop-filter:blur(10px); }
.slides-fullscreen .fs-toolbar .btn { background:rgba(255,255,255,.08); color:#cbd5e1; border:1px solid rgba(255,255,255,.12); font-size:12px; padding:5px 12px; border-radius:8px; cursor:pointer; }
.slides-fullscreen .fs-toolbar .btn:hover { background:rgba(255,255,255,.16); color:#fff; }
.slides-fullscreen .fs-ra10 { font-weight:900; font-size:14px; color:#d20000; letter-spacing:.03em; margin-right:8px; }
.slides-fullscreen .fs-nav { display:flex; align-items:center; justify-content:center; gap:8px; padding:10px; background:rgba(0,0,0,.4); backdrop-filter:blur(10px); }
.slides-fullscreen .fs-nav .nav-btn { width:38px; height:38px; border-radius:50%; border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.05); cursor:pointer; font-size:18px; color:#cbd5e1; display:flex; align-items:center; justify-content:center; transition:all .15s; }
.slides-fullscreen .fs-nav .nav-btn:hover { background:rgba(255,255,255,.15); color:#fff; }
.slides-fullscreen .fs-nav .nav-dot { width:7px; height:7px; border-radius:50%; background:rgba(255,255,255,.2); border:none; cursor:pointer; padding:0; }
.slides-fullscreen .fs-nav .nav-dot.active { background:#3b82f6; transform:scale(1.5); }
.slides-fs-counter { font-size:13px; color:#94a3b8; font-family:var(--mono,monospace); margin:0 10px; }
`;

function injectSlidesCSS() {
  if (document.getElementById('ra10-slides-css')) return;
  const style = document.createElement('style');
  style.id = 'ra10-slides-css';
  style.textContent = SLIDES_CSS;
  document.head.appendChild(style);
}

function createPPTX(presentation) {
  // Use PptxGenJS if available, otherwise fall back to self-contained HTML
  if (typeof PptxGenJS !== 'undefined') {
    _createRealPPTX(presentation);
  } else {
    // Dynamically load PptxGenJS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js';
    script.onload = function() { _createRealPPTX(presentation); };
    script.onerror = function() { _createHTMLSlides(presentation); };
    document.head.appendChild(script);
  }
}

function _createRealPPTX(presentation) {
  try {
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name:'CUSTOM', width:'13.333', height:'7.5' });
    pptx.layout = 'CUSTOM';

    presentation.slides.forEach(function(slide) {
      const s = pptx.addSlide();
      
      // Title
      s.addText(slide.title || '', {
        x: 0.7, y: 0.4, w: 11.9, h: 0.7,
        fontSize: 28, fontFace: 'Arial', bold: true, color: '1a3a6c'
      });

      // Subtitle if present
      if (slide.subtitle) {
        s.addText(slide.subtitle, {
          x: 0.7, y: 1.1, w: 11.9, h: 0.5,
          fontSize: 16, fontFace: 'Arial', color: '666666'
        });
      }

      // Content as text body
      if (slide.content) {
        const plainText = _stripHTML(slide.content);
        const lines = plainText.split('\n').filter(function(l) { return l.trim(); });
        const bodyText = lines.slice(0, 20).join('\n');
        s.addText(bodyText, {
          x: 0.7, y: slide.subtitle ? 1.7 : 1.2, w: 11.9, h: 5.0,
          fontSize: 13, fontFace: 'Arial', color: '333333', valign: 'top', lineSpacing: 22
        });
      }

      // Footer
      s.addText(presentation.title + ' — Slide ' + (presentation.slides.indexOf(slide)+1) + '/' + presentation.slides.length + ' — RA10.co.uk', {
        x: 0.7, y: 6.9, w: 11.9, h: 0.4,
        fontSize: 9, fontFace: 'Arial', color: '999999'
      });
    });

    pptx.writeFile({ fileName: (presentation.title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_') + '.pptx' });
  } catch(e) {
    console.warn('PPTX generation failed, falling back to HTML', e);
    _createHTMLSlides(presentation);
  }
}

function _stripHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  // Replace common elements with text equivalents
  div.querySelectorAll('br').forEach(function(br) { br.replaceWith('\n'); });
  div.querySelectorAll('li').forEach(function(li) { li.textContent = '• ' + li.textContent + '\n'; });
  div.querySelectorAll('tr').forEach(function(tr) { tr.textContent = tr.textContent + '\n'; });
  div.querySelectorAll('h3,h4').forEach(function(h) { h.textContent = '\n' + h.textContent.toUpperCase() + '\n'; });
  div.querySelectorAll('p,div').forEach(function(el) { el.textContent = el.textContent + '\n'; });
  return div.textContent || div.innerText || '';
}

function _createHTMLSlides(presentation) {
  const slides = presentation.slides;
  let html = '<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8"><title>' + presentation.title + '</title>\n<style>\n';
  html += '*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;overflow:hidden}\n';
  html += '.deck{height:100vh;width:100vw;overflow-y:scroll;scroll-snap-type:y mandatory}\n';
  html += '.slide{min-height:100vh;scroll-snap-align:start;display:flex;flex-direction:column;justify-content:center;padding:60px 80px;background:linear-gradient(160deg,#1e293b,#0f172a)}\n';
  html += 'h1{font-size:42px;font-weight:900;margin-bottom:14px;color:#f1f5f9}\n';
  html += 'h3{font-size:22px;margin:20px 0 8px;color:#93c5fd}\n';
  html += '.subtitle{font-size:18px;color:#94a3b8;margin-bottom:24px}\n';
  html += 'ul,ol{padding-left:28px;margin:8px 0}li{margin-bottom:6px;font-size:17px;line-height:1.5}\n';
  html += 'table{width:100%;border-collapse:collapse;margin:12px 0;font-size:15px}th,td{text-align:left;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.1)}th{background:rgba(255,255,255,.05);font-weight:700}\n';
  html += '.footer{margin-top:32px;padding-top:10px;border-top:1px solid rgba(255,255,255,.1);font-size:13px;color:#64748b}\n';
  html += '.def-box{background:rgba(59,130,246,.1);border-left:4px solid #3b82f6;padding:12px 16px;margin:12px 0}\n';
  html += '.exam-tip{background:rgba(234,179,8,.1);border-left:4px solid #eab308;padding:12px 16px;margin:12px 0}\n';
  html += '.nav{position:fixed;bottom:20px;right:20px;display:flex;gap:8px;z-index:10}\n';
  html += '.nav button{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#cbd5e1;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:14px}\n';
  html += '.nav button:hover{background:rgba(255,255,255,.2)}\n';
  html += '@media print{.slide{page-break-after:always;background:#fff!important;color:#000!important;min-height:auto;padding:40px 60px}h1{color:#000!important}h3{color:#1a3a6c!important}.footer{color:#999!important}.nav{display:none!important}}\n';
  html += '</style></head><body><div class="deck">\n';

  slides.forEach(function(slide, i) {
    html += '<div class="slide"><h1>' + escapeHTML(slide.title || '') + '</h1>';
    if (slide.subtitle) html += '<p class="subtitle">' + escapeHTML(slide.subtitle) + '</p>';
    if (slide.content) html += '<div class="body">' + slide.content + '</div>';
    html += '<div class="footer">' + escapeHTML(presentation.title) + ' — Slide ' + (i+1) + '/' + slides.length + ' — RA10.co.uk</div></div>\n';
  });

  html += '</div><div class="nav"><button onclick="document.querySelector(\'.deck\').scrollBy({top:-window.innerHeight,behavior:\'smooth\'})">▲ Prev</button><button onclick="document.querySelector(\'.deck\').scrollBy({top:window.innerHeight,behavior:\'smooth\'})">Next ▼</button></div>';
  html += '</body></html>';

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (presentation.title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_') + '_slides.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHTML(s) { return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

function renderSlide(presentation, index) {
  const slide = presentation.slides[index];
  if (!slide) return '';

  let content = slide.content || '';
  return `
    <div class="slide-card">
      <h1 class="slide-title">${escapeHTML(slide.title || 'Slide ' + (index+1))}</h1>
      ${slide.subtitle ? '<p class="slide-subtitle">' + escapeHTML(slide.subtitle) + '</p>' : ''}
      <div class="slide-body">${content}</div>
      <div class="slide-footer">
        <span>${escapeHTML(presentation.title)}</span>
        <span>${index+1} / ${presentation.slides.length}</span>
      </div>
    </div>`;
}

function showPresentation(presentation) {
  currentPresentation = presentation;
  currentSlide = 0;

  const viewer = document.getElementById('slides-viewer');
  const stage = document.getElementById('slides-stage-inner');
  const counter = document.getElementById('slides-counter');
  const titleEl = document.getElementById('slides-pres-title');
  const dots = document.getElementById('slides-dots');

  if (!viewer || !stage) return;

  document.getElementById('slides-library')?.style.setProperty('display', 'none');
  viewer.classList.add('active');
  if (titleEl) titleEl.textContent = presentation.title;

  renderCurrentSlide();

  // Update dots + thumbs
  if (dots) {
    dots.innerHTML = presentation.slides.map((_, i) =>
      '<button class="nav-dot' + (i===currentSlide?' active':'') + '" onclick="window._slideGoTo('+i+')"></button>'
    ).join('');
  }
  if (counter) counter.textContent = (currentSlide+1) + ' / ' + presentation.slides.length;

  // Build thumbnail strip
  const thumbs = document.getElementById('slides-thumbs');
  if (thumbs) {
    thumbs.innerHTML = presentation.slides.map((s, i) =>
      '<button class="slides-thumb' + (i===currentSlide?' active':'') + '" onclick="window._slideGoTo('+i+')" title="' + escapeHTML(s.title || 'Slide '+(i+1)) + '">' +
      '<span class="thumb-num">' + (i+1) + '</span>' +
      escapeHTML((s.title || 'Slide '+(i+1)).substring(0, 40)) +
      '</button>'
    ).join('');
  }
  // Progress bar
  const progFill = document.getElementById('slides-progress-fill');
  if (progFill) progFill.style.width = ((currentSlide + 1) / presentation.slides.length * 100) + '%';
}

function renderCurrentSlide() {
  const stage = document.getElementById('slides-stage-inner');
  const counter = document.getElementById('slides-counter');
  const dots = document.getElementById('slides-dots');
  const thumbs = document.getElementById('slides-thumbs');

  if (!currentPresentation) return;

  const html = renderSlide(currentPresentation, currentSlide);
  if (stage) stage.innerHTML = '<div class="slide-content">' + html + '</div>';
  if (counter) counter.textContent = (currentSlide+1) + ' / ' + currentPresentation.slides.length;

  if (dots) {
    dots.querySelectorAll('.nav-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }
  if (thumbs) {
    thumbs.querySelectorAll('.slides-thumb').forEach((t, i) => t.classList.toggle('active', i === currentSlide));
  }
  // Update progress bar
  const progFill = document.getElementById('slides-progress-fill');
  if (progFill && currentPresentation) {
    progFill.style.width = ((currentSlide + 1) / currentPresentation.slides.length * 100) + '%';
  }
}

function goToSlide(index) {
  if (!currentPresentation) return;
  currentSlide = Math.max(0, Math.min(index, currentPresentation.slides.length - 1));
  renderCurrentSlide();
}

window._slideGoTo = goToSlide;

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function toggleFullscreen() {
  fullscreen = !fullscreen;
  const fs = document.getElementById('slides-fullscreen');
  if (fs) {
    fs.classList.toggle('active', fullscreen);
    if (fullscreen) {
      fsCurrentSlide = currentSlide;
      const fsStage = document.getElementById('slides-fs-stage');
      const fsTitle = document.getElementById('slides-fs-title');
      const fsCounter = document.getElementById('slides-fs-counter');
      const fsDots = document.getElementById('slides-fs-dots');
      if (fsStage && currentPresentation) {
        fsStage.innerHTML = '<div class="slide-content">' + renderSlide(currentPresentation, fsCurrentSlide) + '</div>';
      }
      if (fsTitle && currentPresentation) fsTitle.textContent = currentPresentation.title;
      if (fsCounter && currentPresentation) fsCounter.textContent = (fsCurrentSlide+1) + ' / ' + currentPresentation.slides.length;
      if (fsDots && currentPresentation) {
        fsDots.innerHTML = currentPresentation.slides.map((_, i) =>
          '<button class="nav-dot' + (i===fsCurrentSlide?' active':'') + '" onclick="window._slidesFsGo('+i+')"></button>'
        ).join('');
      }
      document.body.style.overflow = 'hidden';
    } else {
      currentSlide = fsCurrentSlide;
      renderCurrentSlide();
      document.body.style.overflow = '';
    }
  }
}

function fsGoTo(index) {
  if (!currentPresentation) return;
  fsCurrentSlide = Math.max(0, Math.min(index, currentPresentation.slides.length - 1));
  const fsStage = document.getElementById('slides-fs-stage');
  const fsCounter = document.getElementById('slides-fs-counter');
  const fsDots = document.getElementById('slides-fs-dots');
  if (fsStage) fsStage.innerHTML = '<div class="slide-content">' + renderSlide(currentPresentation, fsCurrentSlide) + '</div>';
  if (fsCounter) fsCounter.textContent = (fsCurrentSlide+1) + ' / ' + currentPresentation.slides.length;
  if (fsDots) {
    fsDots.querySelectorAll('.nav-dot').forEach((d, i) => d.classList.toggle('active', i === fsCurrentSlide));
  }
}

function fsPrevSlide() { fsGoTo(fsCurrentSlide - 1); }
function fsNextSlide() { fsGoTo(fsCurrentSlide + 1); }

function downloadPPTX() {
  if (!currentPresentation) return;
  createPPTX(currentPresentation);
}

function backToLibrary() {
  const viewer = document.getElementById('slides-viewer');
  const library = document.getElementById('slides-library');
  if (viewer) viewer.classList.remove('active');
  if (library) library.style.display = '';
  currentPresentation = null;
}

function buildLibrary() {
  if (!window.SLIDES_DATA || !window.SLIDES_DATA.presentations) return '<p class="muted">No slide presentations available.</p>';

  return window.SLIDES_DATA.presentations.map((pres, idx) => `
    <div class="slides-lib-card" onclick="window._openPres(${idx})">
      <span class="aim-badge">${escapeHTML(pres.aim || '')}</span>
      <h3>${escapeHTML(pres.title)}</h3>
      <p>${escapeHTML(pres.description || '')}</p>
      <span class="slide-count">${pres.slides.length} slides</span>
    </div>
  `).join('');
}

window._openPres = function(idx) {
  if (window.SLIDES_DATA && window.SLIDES_DATA.presentations[idx]) {
    showPresentation(window.SLIDES_DATA.presentations[idx]);
  }
};

function initSlides() {
  injectSlidesCSS();

  const stage = document.getElementById('slides-stage');
  if (!stage) return;

  stage.innerHTML = `
    <div id="slides-library" class="slides-library">${buildLibrary()}</div>
    <div id="slides-viewer" class="slides-viewer">
      <div class="slides-toolbar">
        <button class="btn ghost" onclick="window._slidesBack()">&#8592; Library</button>
        <span class="slides-ra10-badge">&#9889; RA10</span>
        <span class="pres-title" id="slides-pres-title"></span>
        <span class="slide-counter" id="slides-counter"></span>
        <button class="btn" onclick="window._slidesPrev()" title="Previous slide (Left arrow)">&#9664; Prev</button>
        <button class="btn" onclick="window._slidesNext()" title="Next slide (Right arrow)">Next &#9654;</button>
        <button class="btn" onclick="window._slidesFullscreen()" title="Fullscreen presentation (F)">&#128470; Present</button>
        <button class="btn primary" onclick="window._slidesDownload()" title="Download as PPTX">&#128229; PPTX</button>
      </div>
      <div class="slides-progress-wrap"><div class="slides-progress-fill" id="slides-progress-fill" style="width:0%"></div></div>
      <div class="slides-stage" id="slides-stage-inner">
        <div class="laser-dot" id="slides-laser"></div>
      </div>
      <div class="slides-thumb-strip" id="slides-thumbs"></div>
      <div class="slides-nav">
        <button class="nav-btn" onclick="window._slidesPrev()" title="Previous slide">&#9664;</button>
        <div class="nav-dots" id="slides-dots"></div>
        <button class="nav-btn" onclick="window._slidesNext()" title="Next slide">&#9654;</button>
      </div>
    </div>
    <div id="slides-fullscreen" class="slides-fullscreen">
      <div class="fs-toolbar">
        <span class="fs-ra10">&#9889; RA10</span>
        <span class="pres-title" id="slides-fs-title" style="color:#e2e8f0;flex:1;"></span>
        <span class="slides-fs-counter" id="slides-fs-counter"></span>
        <button class="btn" onclick="window._slidesFsPrev()">&#9664; Prev</button>
        <button class="btn" onclick="window._slidesFsNext()">Next &#9654;</button>
        <button class="btn" onclick="window._slidesCloseFs()">&#10005; Exit</button>
      </div>
      <div class="fs-stage" id="slides-fs-stage"></div>
      <div class="fs-nav">
        <button class="nav-btn" onclick="window._slidesFsPrev()">&#9664;</button>
        <div class="nav-dots" id="slides-fs-dots"></div>
        <button class="nav-btn" onclick="window._slidesFsNext()">&#9654;</button>
      </div>
    </div>
  `;

  // Laser pointer effect on the inner stage
  const stageInner = document.getElementById('slides-stage-inner');
  const laser = document.getElementById('slides-laser');
  if (stageInner && laser) {
    stageInner.addEventListener('click', function(e) {
      const rect = stageInner.getBoundingClientRect();
      const x = e.clientX - rect.left - 6;
      const y = e.clientY - rect.top - 6;
      laser.style.left = x + 'px';
      laser.style.top = y + 'px';
      laser.classList.add('show');
      clearTimeout(laser._timeout);
      laser._timeout = setTimeout(function() { laser.classList.remove('show'); }, 1200);
    });
  }

  window._slidesBack = backToLibrary;
  window._slidesPrev = prevSlide;
  window._slidesNext = nextSlide;
  window._slidesFullscreen = toggleFullscreen;
  window._slidesDownload = downloadPPTX;
  window._slidesCloseFs = toggleFullscreen;
  window._slidesFsPrev = fsPrevSlide;
  window._slidesFsNext = fsNextSlide;
  window._slidesFsGo = fsGoTo;

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!currentPresentation) return;
    if (fullscreen) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); fsNextSlide(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); fsPrevSlide(); }
      if (e.key === 'Escape') { e.preventDefault(); toggleFullscreen(); }
      return;
    }
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
    if (e.key === 'f' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleFullscreen(); }
    if (e.key === 'Escape' && document.getElementById('slides-viewer')?.classList.contains('active')) { backToLibrary(); }
  });
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSlides);
} else {
  initSlides();
}

})();
