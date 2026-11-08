/* RA10 Study Hub — custom animated icons (inline SVG, no emojis).
   SHIcons.svg(name, { size, cls, label })  → <svg> markup
   SHIcons.forLesson(lesson) / SHIcons.forUnit(unitPath) → icon name
   Animated parts carry .a-* classes; the keyframes live in study.css (and respect reduced motion). */
(function () {
  'use strict';
  // stroke = currentColor, soft fills = var(--ifill) (a translucent version of the colour)
  const F = 'fill="var(--ifill, currentColor)" fill-opacity="var(--ifo, .18)"';
  const P = {
    flame: `<path ${F} d="M12 2.5c.6 3.2 4.8 5.2 4.8 10.1A4.8 4.8 0 0 1 12 17.5a4.8 4.8 0 0 1-4.8-4.9c0-2.4 1.3-3.9 2.3-4.9.2 1.5.9 2.4 1.8 2.9C11 7.9 11.3 5 12 2.5z"/><path class="a-flick" d="M12 21.5c-3.6 0-6.3-2.6-6.3-6.3 0-4.6 4.3-6.6 5-11.2 3.4 2 7.6 5.9 7.6 11.2 0 3.7-2.7 6.3-6.3 6.3z"/><path class="a-flick2" d="M12 21c-1.7 0-2.9-1.2-2.9-2.9 0-2 1.6-2.9 2.3-4.6 1.4 1 3.5 2.6 3.5 4.6 0 1.7-1.2 2.9-2.9 2.9z"/>`,
    bolt: `<path class="a-pulse" ${F} d="M13.5 2 4.5 13.5h6.5L10 22l9.5-12H13z"/><path d="M13.5 2 4.5 13.5h6.5L10 22l9.5-12H13z"/>`,
    sun: `<circle cx="12" cy="12" r="4.2" ${F}/><circle cx="12" cy="12" r="4.2"/><g class="a-spin-slow"><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g>`,
    book: `<path ${F} d="M3 5.5c3-1.3 6-1.3 9 .5v14c-3-1.8-6-1.8-9-.5z"/><path d="M3 5.5c3-1.3 6-1.3 9 .5v14c-3-1.8-6-1.8-9-.5zM21 5.5c-3-1.3-6-1.3-9 .5v14c3-1.8 6-1.8 9-.5z"/><path class="a-page" d="M12 6c2-1.2 4.4-1.6 6.5-.9v13.4"/>`,
    question: `<g class="a-bob"><circle cx="12" cy="12" r="9.5" ${F}/><circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.3a2.8 2.8 0 1 1 3.9 2.6c-.8.4-1.2 1-1.2 1.8v.6"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/></g>`,
    scales: `<path d="M12 3v18M7 21h10"/><g class="a-tilt"><path d="M4 7h16"/><path ${F} d="M2.5 13.5 5 7.5l2.5 6a2.5 2.5 0 0 1-5 0zM16.5 13.5 19 7.5l2.5 6a2.5 2.5 0 0 1-5 0z"/><path d="M2.5 13.5 5 7.5l2.5 6a2.5 2.5 0 0 1-5 0zM16.5 13.5 19 7.5l2.5 6a2.5 2.5 0 0 1-5 0z"/></g>`,
    pencil: `<g class="a-write"><path ${F} d="M15.5 4.5l4 4L9 19H5v-4z"/><path d="M15.5 4.5l4 4L9 19H5v-4zM13 7l4 4"/></g><path d="M4 21.5h9" class="a-line"/>`,
    puzzle: `<path ${F} d="M4 8h3.5a2 2 0 1 1 4 0H15v3.5a2 2 0 1 1 0 4V19H4z"/><path d="M4 8h3.5a2 2 0 1 1 4 0H15v3.5a2 2 0 1 1 0 4V19H4z"/><g class="a-nudge"><path d="M17.5 3.5h3v3a1.6 1.6 0 1 0 0 3.2v3h-3"/></g>`,
    steps: `<g class="a-slide1"><rect x="3" y="3.5" width="18" height="4" rx="2" ${F}/><rect x="3" y="3.5" width="18" height="4" rx="2"/></g><g class="a-slide2"><rect x="3" y="10" width="14" height="4" rx="2"/></g><g class="a-slide3"><rect x="3" y="16.5" width="10" height="4" rx="2"/></g>`,
    exam: `<path ${F} d="M6 2.5h8.5L19 7v14.5H6z"/><path d="M6 2.5h8.5L19 7v14.5H6zM14.5 2.5V7H19"/><path class="a-draw" d="M9 11h7M9 14.5h7M9 18h4"/>`,
    flag: `<path d="M5 21.5V3"/><path class="a-wave" ${F} d="M5 4c3-1.5 5 1.5 8 0s4-1 6 0v9c-2-1-3-1.5-6 0s-5-1.5-8 0z"/><path class="a-wave" d="M5 4c3-1.5 5 1.5 8 0s4-1 6 0v9c-2-1-3-1.5-6 0s-5-1.5-8 0z"/>`,
    target: `<circle cx="12" cy="12" r="9.5" ${F}/><circle cx="12" cy="12" r="9.5"/><circle class="a-ping" cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/>`,
    check: `<circle cx="12" cy="12" r="9.5" ${F}/><circle cx="12" cy="12" r="9.5"/><path class="a-draw" d="m7.5 12.3 3 3 6-6.3"/>`,
    bulb: `<path ${F} d="M12 2.8a6.5 6.5 0 0 0-3.8 11.8c.6.5 1 1.2 1 2v.9h5.6v-.9c0-.8.4-1.5 1-2A6.5 6.5 0 0 0 12 2.8z"/><path d="M12 2.8a6.5 6.5 0 0 0-3.8 11.8c.6.5 1 1.2 1 2v.9h5.6v-.9c0-.8.4-1.5 1-2A6.5 6.5 0 0 0 12 2.8zM9.5 20.5h5"/><g class="a-glow"><path d="M12 .5v.01M3 9h-.01M21 9h.01M5 3.5l.01.01M19 3.5l-.01.01"/></g>`,
    star: `<path class="a-twinkle" ${F} d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3-4.6-4.4 6.3-.9z"/><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3-4.6-4.4 6.3-.9z"/>`,
    trophy: `<g class="a-bob"><path ${F} d="M7 3h10v6a5 5 0 0 1-10 0z"/><path d="M7 3h10v6a5 5 0 0 1-10 0zM7 5H3.5a3.5 3.5 0 0 0 4 4M17 5h3.5a3.5 3.5 0 0 1-4 4M12 14v4M8 21h8M9.5 18h5"/><path class="a-shine" d="M10 5.5v3" stroke-width="1.6"/></g>`,
    crown: `<g class="a-bob"><path ${F} d="M3 7.5l4.5 4 4.5-7 4.5 7 4.5-4L19 18H5z"/><path d="M3 7.5l4.5 4 4.5-7 4.5 7 4.5-4L19 18H5zM5 21h14"/><circle class="a-twinkle" cx="12" cy="13.5" r="1.2" fill="currentColor"/></g>`,
    lock: `<rect x="4.5" y="10.5" width="15" height="11" rx="2.5" ${F}/><rect x="4.5" y="10.5" width="15" height="11" rx="2.5"/><path class="a-shackle" d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 15v2.5"/>`,
    gift: `<rect x="3.5" y="10" width="17" height="11" rx="2" ${F}/><path d="M3.5 10h17v11h-17zM12 10v11"/><g class="a-hop"><path d="M2.5 6.5h19V10h-19zM12 6.5c-1.5-3.5-5-4-5.5-2s3 2 5.5 2zM12 6.5c1.5-3.5 5-4 5.5-2s-3 2-5.5 2z"/></g>`,
    sparkles: `<path class="a-tw1" ${F} d="M10 3.5 11.8 8.2 16.5 10 11.8 11.8 10 16.5 8.2 11.8 3.5 10 8.2 8.2z"/><path class="a-tw1" d="M10 3.5 11.8 8.2 16.5 10 11.8 11.8 10 16.5 8.2 11.8 3.5 10 8.2 8.2z"/><path class="a-tw2" d="M18 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/><path class="a-tw3" d="M18.5 2.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/>`,
    wand: `<path d="m4 20 10-10"/><path ${F} d="M14 10l2-2 2 2-2 2z"/><path class="a-tw1" d="M18.5 2.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/><path class="a-tw2" d="M9 3l.5 1.2 1.2.5-1.2.5L9 6.4l-.5-1.2-1.2-.5 1.2-.5z"/><path class="a-tw3" d="M20 12l.5 1.2 1.2.5-1.2.5L20 15.4l-.5-1.2-1.2-.5 1.2-.5z"/>`,
    map: `<path ${F} d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5zM9 4v13.5M15 6.5V20"/><path class="a-dash" d="M5 15c2-2 4 1 6-1.5s3-4 7-4" stroke-dasharray="2 2.2" stroke-width="1.6"/>`,
    chart: `<path d="M3 21h18"/><rect class="a-grow1" x="5" y="12" width="3.4" height="8" rx="1" ${F}/><rect class="a-grow1" x="5" y="12" width="3.4" height="8" rx="1"/><rect class="a-grow2" x="10.3" y="7" width="3.4" height="13" rx="1"/><rect class="a-grow3" x="15.6" y="3.5" width="3.4" height="16.5" rx="1" ${F}/><rect class="a-grow3" x="15.6" y="3.5" width="3.4" height="16.5" rx="1"/>`,
    brain: `<path ${F} d="M9 3.5a3 3 0 0 0-3 3 3 3 0 0 0-2.5 4.6A3.2 3.2 0 0 0 5 17a3 3 0 0 0 4 3.5V3.5zM15 3.5a3 3 0 0 1 3 3 3 3 0 0 1 2.5 4.6A3.2 3.2 0 0 1 19 17a3 3 0 0 1-4 3.5V3.5z"/><path d="M9 3.5a3 3 0 0 0-3 3 3 3 0 0 0-2.5 4.6A3.2 3.2 0 0 0 5 17a3 3 0 0 0 4 3.5h6a3 3 0 0 0 4-3.5 3.2 3.2 0 0 0 1.5-5.9A3 3 0 0 0 18 6.5a3 3 0 0 0-3-3zM12 3.5v17"/><circle class="a-sp1" cx="8" cy="10" r="1" fill="currentColor"/><circle class="a-sp2" cx="16" cy="13" r="1" fill="currentColor"/><circle class="a-sp3" cx="9" cy="16" r="1" fill="currentColor"/>`,
    compass: `<circle cx="12" cy="12" r="9.5" ${F}/><circle cx="12" cy="12" r="9.5"/><g class="a-needle"><path fill="currentColor" stroke="none" d="m14.8 9.2-1.6 4-4 1.6 1.6-4z"/></g>`,
    plus: `<circle cx="12" cy="12" r="9.5" ${F}/><path class="a-spin-pop" d="M12 7.5v9M7.5 12h9"/>`,
    clock: `<circle cx="12" cy="12" r="9.5" ${F}/><circle cx="12" cy="12" r="9.5"/><path class="a-hand" d="M12 12V7"/><path d="M12 12l3 2"/>`,
    retry: `<g class="a-spin-once"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4.5V11h-6.5"/></g>`,
    close: `<path d="M6 6l12 12M18 6 6 18"/>`,
    sound: `<path ${F} d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="a-wave1" d="M15.5 9a4 4 0 0 1 0 6"/><path class="a-wave2" d="M18 6.5a7.5 7.5 0 0 1 0 11"/>`,
    mute: `<path ${F} d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5"/>`,
    arrow: `<path class="a-nudge-x" d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>`,
    search: `<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>`,
    alert: `<g class="a-shake"><path ${F} d="M12 3 22 20H2z"/><path d="M12 3 22 20H2zM12 9.5v4.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/></g>`,
    // topic icons
    shield: `<path ${F} d="M12 2.5 20 5.5v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10v-6z"/><path d="M12 2.5 20 5.5v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10v-6z"/><path class="a-draw" d="m8.5 12 2.5 2.5 4.5-5"/>`,
    network: `<path d="M12 6v4M7 16l3.5-4.5M17 16l-3.5-4.5"/><circle class="a-sp1" cx="12" cy="4.5" r="2.3" ${F}/><circle cx="12" cy="4.5" r="2.3"/><circle class="a-sp2" cx="5.5" cy="18" r="2.3" ${F}/><circle cx="5.5" cy="18" r="2.3"/><circle class="a-sp3" cx="18.5" cy="18" r="2.3" ${F}/><circle cx="18.5" cy="18" r="2.3"/><circle cx="12" cy="11.5" r="1.4" fill="currentColor"/>`,
    database: `<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" ${F}/><ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13"/><path class="a-sp1" d="M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>`,
    code: `<rect x="2.5" y="4" width="19" height="16" rx="3" ${F}/><rect x="2.5" y="4" width="19" height="16" rx="3"/><path class="a-nudge" d="m9 9-3 3 3 3M15 9l3 3-3 3"/><path class="a-blink" d="M13 8.5 11 15.5"/>`,
    chip: `<rect x="6" y="6" width="12" height="12" rx="2.5" ${F}/><rect x="6" y="6" width="12" height="12" rx="2.5"/><path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5"/><rect class="a-pulse" x="9.5" y="9.5" width="5" height="5" rx="1" fill="currentColor" stroke="none"/>`,
    globe: `<circle cx="12" cy="12" r="9.5" ${F}/><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19"/><ellipse class="a-meridian" cx="12" cy="12" rx="4" ry="9.5"/>`,
    coins: `<circle cx="9" cy="9" r="6" ${F}/><circle cx="9" cy="9" r="6"/><g class="a-hop"><circle cx="15" cy="15" r="6.5" ${F}/><circle cx="15" cy="15" r="6.5"/><path d="M16.8 12.4a2 2 0 0 0-3.3 1.4v3.6M12.3 15.4h3.4M12.3 17.6h4.9" stroke-width="1.6"/></g>`,
    megaphone: `<path ${F} d="M3.5 10v4l11 5V5z"/><path d="M3.5 10v4l11 5V5zM7 15.5l1 5h3l-1.2-4"/><path class="a-wave1" d="M17.5 9.5a3.5 3.5 0 0 1 0 5"/><path class="a-wave2" d="M20 7a7 7 0 0 1 0 10"/>`,
    people: `<circle cx="9" cy="8" r="3.5" ${F}/><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20.5a6.5 6.5 0 0 1 13 0"/><g class="a-bob"><circle cx="17" cy="9" r="2.8"/><path d="M16.5 14.5a5 5 0 0 1 5 5"/></g>`,
    heart: `<path class="a-beat" ${F} d="M12 20.5S3 15 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8C21 15 12 20.5 12 20.5z"/><path class="a-beat" d="M12 20.5S3 15 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8C21 15 12 20.5 12 20.5z"/><path d="M6 11.5h3l1.5-2.5 2 5 1.5-2.5h4" stroke-width="1.6"/>`,
    dumbbell: `<g class="a-lift"><path d="M7 12h10"/><rect x="3.5" y="7.5" width="3.5" height="9" rx="1.2" ${F}/><rect x="3.5" y="7.5" width="3.5" height="9" rx="1.2"/><rect x="17" y="7.5" width="3.5" height="9" rx="1.2" ${F}/><rect x="17" y="7.5" width="3.5" height="9" rx="1.2"/><path d="M2 10v4M22 10v4"/></g>`,
    lungs: `<path d="M12 3v8M12 11c-1 1-2 1-3 1M12 11c1 1 2 1 3 1"/><g class="a-breathe"><path ${F} d="M8.5 7c-3 0-5.5 5-5.5 10 0 2 1 3.5 3 3.5S9.5 19 9.5 17V8.5C9.5 7.5 9.2 7 8.5 7zM15.5 7c3 0 5.5 5 5.5 10 0 2-1 3.5-3 3.5s-3.5-1.5-3.5-3.5V8.5c0-1 .3-1.5 1-1.5z"/><path d="M8.5 7c-3 0-5.5 5-5.5 10 0 2 1 3.5 3 3.5S9.5 19 9.5 17V8.5C9.5 7.5 9.2 7 8.5 7zM15.5 7c3 0 5.5 5 5.5 10 0 2-1 3.5-3 3.5s-3.5-1.5-3.5-3.5V8.5c0-1 .3-1.5 1-1.5z"/></g>`,
    cloud: `<g class="a-drift"><path ${F} d="M7 18.5a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5 3.8 3.8 0 0 1-.5 7.5z"/><path d="M7 18.5a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5 3.8 3.8 0 0 1-.5 7.5z"/></g>`,
    gear: `<g class="a-spin-slow"><circle cx="12" cy="12" r="3"/><path ${F} d="M12 2.5l1.6 2.4 2.8-.6.6 2.8 2.4 1.6-1.2 2.6 1.2 2.6-2.4 1.6-.6 2.8-2.8-.6L12 21.5l-1.6-2.4-2.8.6-.6-2.8-2.4-1.6 1.2-2.6-1.2-2.6 2.4-1.6.6-2.8 2.8.6z"/><path d="M12 2.5l1.6 2.4 2.8-.6.6 2.8 2.4 1.6-1.2 2.6 1.2 2.6-2.4 1.6-.6 2.8-2.8-.6L12 21.5l-1.6-2.4-2.8.6-.6-2.8-2.4-1.6 1.2-2.6-1.2-2.6 2.4-1.6.6-2.8 2.8.6z"/></g>`,
    clipboard: `<rect x="4.5" y="4" width="15" height="17.5" rx="2.5" ${F}/><rect x="4.5" y="4" width="15" height="17.5" rx="2.5"/><rect x="8.5" y="2.5" width="7" height="3.5" rx="1.2"/><path class="a-draw" d="m8 12.5 2 2 4.5-4.5M8 17.5h8"/>`,
    trash: `<path ${F} d="M6 7h12l-1 13.5H7z"/><path d="M6 7h12l-1 13.5H7zM4 7h16M10 7V4.5h4V7M10 11v6M14 11v6"/>`,
    building: `<path ${F} d="M4 21V9l6-4v16zM10 21V3h10v18z"/><path d="M4 21V9l6-4v16M10 21V3h10v18M2.5 21h19"/><g class="a-tw1"><path d="M13 7h1.5M16 7h1.5M13 11h1.5M16 11h1.5M13 15h1.5M16 15h1.5"/></g>`,
    blocks: `<rect x="3" y="13" width="8" height="8" rx="1.5" ${F}/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><g class="a-bob"><rect x="8" y="3.5" width="8" height="8" rx="1.5" ${F}/><rect x="8" y="3.5" width="8" height="8" rx="1.5"/></g>`,
    flask: `<path ${F} d="M9.5 3h5v6l5 9.5a2 2 0 0 1-1.8 2.9H6.3a2 2 0 0 1-1.8-2.9l5-9.5z"/><path d="M9.5 3h5v6l5 9.5a2 2 0 0 1-1.8 2.9H6.3a2 2 0 0 1-1.8-2.9l5-9.5zM8 3h8M7 15h10"/><g class="a-bob"><circle cx="10.5" cy="17.5" r=".8"/><circle cx="13.5" cy="18.5" r=".6"/></g>`,
    wrench: `<g class="a-tilt"><path ${F} d="M14.5 3.5a5 5 0 0 0-4.6 6.9L3.5 16.8a1.9 1.9 0 0 0 2.7 2.7l6.4-6.4a5 5 0 0 0 6.9-4.6l-2.9 2.9-2.6-.6-.6-2.6z"/><path d="M14.5 3.5a5 5 0 0 0-4.6 6.9L3.5 16.8a1.9 1.9 0 0 0 2.7 2.7l6.4-6.4a5 5 0 0 0 6.9-4.6l-2.9 2.9-2.6-.6-.6-2.6z"/></g>`,
  };
  P.lightbulb = P.bulb;
  const ALIAS = { learn: 'book', mcq: 'question', truefalse: 'scales', fill: 'pencil', match: 'puzzle', order: 'steps', recap: 'flag', bank: 'target' };

  function svg(name, o) {
    o = o || {};
    const n = P[name] ? name : (P[ALIAS[name]] ? ALIAS[name] : 'sparkles');
    const size = o.size || 24;
    const label = o.label ? ` role="img" aria-label="${String(o.label).replace(/"/g, '&quot;')}"` : ' aria-hidden="true"';
    return `<svg class="shi shi-${n}${o.cls ? ' ' + o.cls : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${o.stroke || 1.9}" stroke-linecap="round" stroke-linejoin="round"${label}>${P[n]}</svg>`;
  }

  const KEYWORDS = [
    [/malware|virus|threat|attack|cyber|security|phish|incident|risk|vulnerab|hack/, 'shield'],
    [/encrypt|password|authenticat|access control|permission|cia triad|confidential/, 'lock'],
    [/network|firewall|router|protocol|topolog|lan\b|wan\b|internet|ids\b|ips\b/, 'network'],
    [/database|sql|relational|table|entity|normalis|query/, 'database'],
    [/website|html|css|javascript|web page|web dev|user interface|ux\b/, 'code'],
    [/cloud|online service|saas|server/, 'cloud'],
    [/break.?even|cash.?flow|profit|cost|revenue|budget|finance|financial|ratio|loan|interest|accounting|income/, 'coins'],
    [/market|campaign|promotion|advert|brand|segment|customer/, 'megaphone'],
    [/manag|leader|motivat|staff|recruit|team|human resource|hr\b|culture|stakeholder/, 'people'],
    [/decision|ethic|law|legislat|regulat|gdpr|data protection/, 'scales'],
    [/growth|data|statistic|analysis|forecast|market share/, 'chart'],
    [/heart|cardio|blood|circulat/, 'heart'],
    [/lung|respirat|breath|oxygen/, 'lungs'],
    [/muscle|skelet|bone|joint|strength|training|fitness|exercise|programme/, 'dumbbell'],
    [/energy|atp|aerobic|anaerobic/, 'bolt'],
    [/hardware|cpu|processor|memory|storage|component|device|computer|operating system|it system/, 'chip'],
    [/process|procedure|lifecycle|model|cycle/, 'gear'],
  ];
  const UNIT_ICON = {
    'IT-AAQ/unit-1': 'chip', 'IT-AAQ/unit-2': 'shield', 'IT-AAQ/unit-3': 'code', 'IT-AAQ/unit-4': 'database', 'level-2/it/unit-2': 'chip',
    'business/unit-2': 'megaphone', 'business/unit-3': 'coins', 'business/unit-6': 'people', 'business/unit-7': 'scales',
    'business-2023': 'chart', 'business-2026': 'chart', 'sport/unit-1': 'heart', 'sport/unit-2': 'dumbbell',
    'computing-aaq/unit-1': 'code', 'computing-aaq/unit-2': 'lock', 'computing-aaq/unit-3': 'people', 'computing-aaq/unit-4': 'code',
    'construction-aaq/unit-1': 'building', 'construction-aaq/unit-2': 'wrench', 'construction-aaq/unit-3': 'pencil', 'construction-aaq/unit-4': 'coins', 'construction-aaq/unit-5': 'globe', 'construction-aaq/unit-6': 'building',
    'early-childhood-development-aaq/unit-1': 'blocks', 'early-childhood-development-aaq/unit-2': 'shield', 'early-childhood-development-aaq/unit-3': 'puzzle', 'early-childhood-development-aaq/unit-4': 'clipboard',
    'engineering-aaq/unit-1': 'bolt', 'engineering-aaq/unit-2': 'gear', 'engineering-aaq/unit-3': 'pencil', 'engineering-aaq/unit-4': 'wrench',
    'health-and-social-care-aaq/unit-1': 'people', 'health-and-social-care-aaq/unit-2': 'heart', 'health-and-social-care-aaq/unit-3': 'clipboard', 'health-and-social-care-aaq/unit-4': 'scales', 'health-and-social-care-aaq/unit-5': 'megaphone', 'health-and-social-care-aaq/unit-6': 'shield', 'health-and-social-care-aaq/unit-7': 'flask',
    'medical-science-aaq/unit-1': 'lungs', 'medical-science-aaq/unit-2': 'chart', 'medical-science-aaq/unit-3': 'flask', 'medical-science-aaq/unit-4': 'heart', 'medical-science-aaq/unit-5': 'flask', 'medical-science-aaq/unit-6': 'people',
  };
  function forUnit(path) {
    const p = String(path || '');
    const k = Object.keys(UNIT_ICON).find(x => p.indexOf(x) >= 0);
    return k ? UNIT_ICON[k] : 'book';
  }
  function forLesson(l) {
    if (!l) return 'book';
    const set = l.emoji || (l.content && l.content.icon);
    if (set && P[set]) return set;
    const text = String((l.topic || '') + ' ' + (l.title || '')).toLowerCase();
    const hit = KEYWORDS.find(([re]) => re.test(text));
    return hit ? hit[1] : forUnit(l.unit);
  }
  window.SHIcons = { svg, forLesson, forUnit, has: (n) => !!P[n] };
})();
