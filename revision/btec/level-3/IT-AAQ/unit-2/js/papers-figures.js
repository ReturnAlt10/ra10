/* BTEC Level 3 IT Unit 2 — exam figures (network diagrams and floor plans) drawn as SVG.
   Registered on window.BIZ_FIGURES[id] = { cap, alt, svg }; a paper item or context line refers to one with
   fig: 'id' or a context line '[[fig:id]]'. The viewer shows them in the paper, the drawing pad uses them as the
   base layer for "complete the diagram" questions, and the PDF download includes them. Redrawn by RA10 from the
   Pearson sample assessment descriptions (the layout follows the original figures). */
(function () {
  'use strict';
  const INK = '#1f2937', SOFT = '#f1f5f9', BLUE = '#dbeafe', TEAL = '#ccfbf1', AMBER = '#fef3c7', ROSE = '#ffe4e6', VIOLET = '#ede9fe';
  const F = "font-family='Arial, Helvetica, sans-serif'";
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" ${F} font-size="${o.size || 13}" font-weight="${o.w || 600}" fill="${o.fill || '#111827'}" text-anchor="${o.anchor || 'middle'}"${o.italic ? ' font-style="italic"' : ''}>${String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`;
  const lines = (x, y, arr, o) => arr.map((s, i) => t(x, y + i * ((o && o.lh) || 15), s, o)).join('');

  /* ── icons, centred on (x, y) ── */
  const ICON = {
    cloud: (x, y, w = 150) => { const s = w / 150; return `<path transform="translate(${x - 75 * s} ${y - 40 * s}) scale(${s})" d="M38 72c-18 0-30-12-30-26 0-13 10-24 24-25 4-13 17-21 31-19 8-10 26-12 37-2 14-3 28 6 30 20 12 2 20 12 20 24 0 16-13 28-30 28z" fill="${SOFT}" stroke="${INK}" stroke-width="1.8"/>`; },
    router: (x, y) => `<g transform="translate(${x - 32} ${y - 18})"><rect x="0" y="10" width="64" height="26" rx="6" fill="${BLUE}" stroke="${INK}" stroke-width="1.6"/><path d="M14 10V0M50 10V0" stroke="${INK}" stroke-width="1.6"/><circle cx="14" cy="23" r="2.4" fill="${INK}"/><circle cx="24" cy="23" r="2.4" fill="#16a34a"/><path d="M40 23h16" stroke="${INK}" stroke-width="1.6"/></g>`,
    switch: (x, y, w = 110) => `<g transform="translate(${x - w / 2} ${y - 14})"><rect width="${w}" height="28" rx="5" fill="${TEAL}" stroke="${INK}" stroke-width="1.6"/>${Array.from({ length: Math.floor((w - 16) / 12) }, (_, i) => `<rect x="${10 + i * 12}" y="9" width="8" height="10" rx="1" fill="#fff" stroke="${INK}" stroke-width="1"/>`).join('')}</g>`,
    server: (x, y) => `<g transform="translate(${x - 20} ${y - 26})">${[0, 17, 34].map(dy => `<rect x="0" y="${dy}" width="40" height="15" rx="3" fill="${SOFT}" stroke="${INK}" stroke-width="1.5"/><circle cx="8" cy="${dy + 7.5}" r="2" fill="#16a34a"/><path d="M16 ${dy + 7.5}h18" stroke="${INK}" stroke-width="1.2"/>`).join('')}</g>`,
    pc: (x, y) => `<g transform="translate(${x - 24} ${y - 22})"><rect width="48" height="32" rx="3" fill="${BLUE}" stroke="${INK}" stroke-width="1.6"/><rect x="5" y="5" width="38" height="22" fill="#fff" stroke="${INK}" stroke-width="1"/><path d="M18 32l-3 9h18l-3-9" fill="${SOFT}" stroke="${INK}" stroke-width="1.4"/></g>`,
    laptop: (x, y) => `<g transform="translate(${x - 26} ${y - 18})"><rect x="7" y="0" width="38" height="25" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.6"/><path d="M0 30h52l-5 6H5z" fill="${SOFT}" stroke="${INK}" stroke-width="1.5"/></g>`,
    phone: (x, y) => `<g transform="translate(${x - 9} ${y - 16})"><rect width="18" height="32" rx="4" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="9" cy="27" r="1.6" fill="${INK}"/></g>`,
    wap: (x, y) => `<g transform="translate(${x - 26} ${y - 22})"><rect x="0" y="22" width="52" height="20" rx="10" fill="${VIOLET}" stroke="${INK}" stroke-width="1.6"/><path d="M14 14a17 17 0 0 1 24 0M19 19a9 9 0 0 1 14 0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><circle cx="26" cy="32" r="2.4" fill="${INK}"/></g>`,
    door: (x, y) => `<g transform="translate(${x - 22} ${y - 26})"><rect width="44" height="52" rx="3" fill="${AMBER}" stroke="${INK}" stroke-width="1.6"/><rect x="9" y="8" width="26" height="20" rx="2" fill="#fff" stroke="${INK}" stroke-width="1.1"/><circle cx="32" cy="38" r="2.4" fill="${INK}"/><rect x="6" y="34" width="10" height="12" rx="2" fill="#fff" stroke="${INK}" stroke-width="1"/></g>`,
    firewall: (x, y) => `<g transform="translate(${x - 28} ${y - 18})"><rect width="56" height="36" rx="3" fill="${ROSE}" stroke="${INK}" stroke-width="1.6"/><path d="M0 12h56M0 24h56M18 0v12M38 0v12M10 12v12M28 12v12M46 12v12M18 24v12M38 24v12" stroke="${INK}" stroke-width="1.1"/></g>`,
    display: (x, y) => `<g transform="translate(${x - 34} ${y - 22})"><rect width="68" height="40" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.6"/><rect x="5" y="5" width="58" height="30" fill="${BLUE}"/><path d="M30 40v6h8v-6" stroke="${INK}" stroke-width="1.4"/></g>`,
    lock: (x, y) => `<g transform="translate(${x - 9} ${y - 12})"><rect x="0" y="9" width="18" height="14" rx="2" fill="${AMBER}" stroke="${INK}" stroke-width="1.4"/><path d="M4 9V6a5 5 0 0 1 10 0v3" fill="none" stroke="${INK}" stroke-width="1.4"/></g>`
  };
  const node = (kind, x, y, label, o = {}) => ICON[kind](x, y, o.w) + (!label ? '' : o.pos === 'right' ? lines(x + (o.off || 40), y + 4, [].concat(label), { size: o.size || 12.5, anchor: 'start' }) : o.pos === 'left' ? lines(x - (o.off || 40), y + 4, [].concat(label), { size: o.size || 12.5, anchor: 'end' }) : o.pos === 'top' ? lines(x, y - (o.up || 24), [].concat(label), { size: o.size || 12.5 }) : lines(x, y + (o.dy || 38), [].concat(label), { size: o.size || 12.5 }));
  // link styles: cat6 (solid), fibre (thick orange double), wifi (dotted), vpn (dashed), internet (grey dashed)
  const link = (x1, y1, x2, y2, kind = 'cat6') => {
    if (kind === 'fibre') return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#ea580c" stroke-width="5" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`;
    if (kind === 'wifi') return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#7c3aed" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/>`;
    if (kind === 'vpn') return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#0f766e" stroke-width="2.4" stroke-dasharray="9 6"/>`;
    if (kind === 'net') return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#64748b" stroke-width="2" stroke-dasharray="6 5"/>`;
    return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="2.2"/>`;
  };
  const elbow = (x1, y1, x2, y2, kind) => { const my = (y1 + y2) / 2; return link(x1, y1, x1, my, kind) + link(x1, my, x2, my, kind) + link(x2, my, x2, y2, kind); };
  const legend = (x, y, items) => `<g transform="translate(${x} ${y})"><rect x="-10" y="-16" width="${items.length * 128 + 4}" height="28" rx="8" fill="#fff" stroke="#cbd5e1"/>${items.map((k, i) => {
    const X = i * 128;
    const lbl = { cat6: 'CAT6 cable', fibre: 'Optical fibre', wifi: 'Wireless', vpn: 'VPN tunnel', net: 'Internet link' }[k];
    return link(X, -2, X + 34, -2, k) + t(X + 42, 2, lbl, { anchor: 'start', size: 11.5, w: 500 });
  }).join('')}</g>`;
  const svg = (w, h, body, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title.replace(/"/g, '&quot;')}"><rect width="${w}" height="${h}" fill="#ffffff"/>${body}</svg>`;
  const zone = (x, y, w, h, label, fill = '#f8fafc', right) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="#94a3b8" stroke-dasharray="5 4"/>` + (label ? (right ? t(x + w - 12, y + 20, label, { anchor: 'end', size: 12, w: 700, fill: '#475569' }) : t(x + 12, y + 20, label, { anchor: 'start', size: 12, w: 700, fill: '#475569' })) : '');

  const FIG = {};

  /* ── Pearson SAM, Figure 1: the incomplete BCTAA network (19th floor) ── */
  FIG['it2-sam-f1'] = {
    cap: 'Figure 1: BCTAA network diagram (incomplete)',
    alt: 'Incomplete network diagram for the BCTAA system on the 19th floor: the internet connects by optical fibre to a WiFi router; the router connects by CAT6 to the main switch; the main switch connects by CAT6 to the servers, staff PCs, the electronic door control system, a Staff WiFi access point (with staff mobile devices) and a Guest WiFi access point (with guest mobile devices). The device needed for a secure internet connection is missing.',
    svg: svg(780, 560, [
      zone(20, 120, 740, 380, 'BCTAA offices — 19th floor', '#f8fafc', true),
      node('cloud', 150, 62, '', { w: 170 }), t(150, 66, 'Internet', { size: 14, w: 700 }),
      link(150, 98, 150, 168, 'fibre'),
      node('router', 150, 188, 'WiFi router', { pos: 'left', off: 42 }),
      // gap to the right of the router is where learners add the missing device
      link(182, 196, 340, 250, 'cat6'),
      node('switch', 390, 250, 'Main switch', { w: 140, pos: 'top' }),
      elbow(330, 264, 110, 360), node('server', 92, 392, ['Servers'], { dy: 42 }), node('server', 140, 392, '', {}),
      elbow(370, 264, 255, 360), node('pc', 230, 392, ''), node('pc', 285, 392, ''), t(257, 440, 'Staff PCs', { size: 12.5 }),
      elbow(410, 264, 400, 360), node('door', 400, 396, ['Electronic door', 'control system'], { dy: 44 }),
      elbow(440, 264, 530, 330), node('wap', 530, 352, 'Staff WiFi', { pos: 'left', off: 34 }),
      link(520, 364, 500, 420, 'wifi'), link(540, 364, 560, 420, 'wifi'), node('phone', 498, 438, ''), node('laptop', 568, 440, ''), t(532, 486, 'Staff mobile devices', { size: 11.5, w: 500 }),
      elbow(460, 264, 670, 330), node('wap', 670, 352, 'Guest WiFi', { pos: 'right', off: 32 }),
      link(660, 364, 645, 420, 'wifi'), link(680, 364, 700, 420, 'wifi'), node('phone', 642, 438, ''), node('phone', 702, 438, ''), t(672, 486, 'Guest mobile devices', { size: 11.5, w: 500 }),
      legend(290, 536, ['cat6', 'fibre', 'wifi'])
    ].join(''), 'Figure 1: BCTAA network diagram (incomplete)')
  };

  /* ── Pearson SAM, Figure 2: BCTAA office floor plan ── */
  (function () {
    const room = (x, y, w, h, label, fill = '#fff', o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${INK}" stroke-width="2"/>` + lines(x + w / 2, y + h / 2 - ((([].concat(label)).length - 1) * 7) + 4, [].concat(label), { size: o.size || 12, w: 700 });
    const door = (x, y, vertical) => vertical
      ? `<rect x="${x - 4}" y="${y}" width="8" height="26" fill="#f59e0b" stroke="${INK}" stroke-width="1"/>`
      : `<rect x="${x}" y="${y - 4}" width="26" height="8" fill="#f59e0b" stroke="${INK}" stroke-width="1"/>`;
    const desks = (x, y, cols, rows) => Array.from({ length: cols * rows }, (_, i) => `<rect x="${x + (i % cols) * 34}" y="${y + Math.floor(i / cols) * 30}" width="26" height="20" rx="2" fill="${BLUE}" stroke="${INK}" stroke-width="1"/>`).join('');
    const seats = (x, y) => [0, 1, 2, 3, 4].map(i => `<circle cx="${x + (i % 3) * 38}" cy="${y + Math.floor(i / 3) * 34}" r="11" fill="${TEAL}" stroke="${INK}" stroke-width="1"/>`).join('');
    const body = [
      `<rect x="20" y="20" width="740" height="500" fill="#fff" stroke="${INK}" stroke-width="4"/>`,
      // public core (lifts, stairs, WCs) — shaded
      `<rect x="290" y="190" width="200" height="160" fill="#e2e8f0" stroke="${INK}" stroke-width="2"/>`,
      `<path d="M290 190l200 160M490 190L290 350" stroke="#cbd5e1" stroke-width="1"/>`,
      room(300, 200, 56, 60, ['Lift'], '#f1f5f9'), room(362, 200, 56, 60, ['Lift'], '#f1f5f9'), room(424, 200, 56, 60, ['Stairs'], '#f1f5f9'),
      room(300, 280, 70, 60, ['WCs'], '#f1f5f9'), room(410, 280, 70, 60, ['Stairs'], '#f1f5f9'),
      t(390, 272, 'Public areas', { size: 11, w: 700, fill: '#475569' }),
      door(372, 190, false), door(372, 350, false), door(290, 260, true), door(490, 260, true),
      // BCTAA space
      room(20, 20, 170, 120, ['Server room &', 'internet access', 'point'], ROSE),
      room(190, 20, 120, 120, ['Office'], '#fff'), room(310, 20, 120, 120, ['Office'], '#fff'), room(430, 20, 120, 120, ['Office'], '#fff'),
      room(550, 20, 210, 150, ['Conference', 'room 1'], VIOLET),
      room(550, 370, 210, 150, ['Conference', 'room 2'], VIOLET),
      room(20, 400, 130, 120, ['Meeting', 'room'], AMBER), room(150, 400, 130, 120, ['Meeting', 'room'], AMBER),
      t(120, 190, 'Work cubicles', { size: 12.5, w: 700 }), desks(40, 205, 6, 5),
      t(640, 205, 'Informal seating', { size: 12, w: 700 }), t(640, 220, '& work area', { size: 12, w: 700 }), seats(602, 250),
      door(100, 140, false), door(240, 140, false), door(360, 140, false), door(480, 140, false), door(630, 170, false), door(630, 370, false), door(70, 400, false), door(200, 400, false),
      `<g transform="translate(330 458)">${t(95, -20, '19th floor (not to scale)', { size: 11, w: 500, italic: true, fill: '#64748b' })}<rect x="-10" y="-14" width="210" height="44" rx="8" fill="#fff" stroke="#cbd5e1"/><rect x="0" y="-6" width="22" height="8" fill="#f59e0b" stroke="${INK}"/>${t(30, 2, 'Controlled door / door', { anchor: 'start', size: 11.5, w: 500 })}<rect x="0" y="12" width="22" height="12" fill="#e2e8f0" stroke="${INK}"/>${t(30, 22, 'Open to the public', { anchor: 'start', size: 11.5, w: 500 })}</g>`,
    ].join('');
    FIG['it2-sam-f2'] = {
      cap: 'Figure 2: plan of BCTAA’s offices on the 19th floor',
      alt: 'Plan of BCTAA’s offices on the 19th floor. The lifts, stairwells, WCs and associated areas in the centre are open to the public and are separated from BCTAA’s space by controlled doors. The rest of the floor is a single open space partitioned into a server room and internet access point, three offices, work cubicles, two conference rooms, two meeting rooms and an informal seating and work area.',
      svg: svg(780, 540, body, 'Figure 2: plan of BCTAA offices')
    };
  })();

  /* ── RA10 Paper 2: Kestrel Outdoor ── */
  FIG['it2-r02-f1'] = {
    cap: 'Figure 1: Kestrel Outdoor’s systems',
    alt: 'Kestrel Outdoor network: the online shop runs on a cloud provider’s web server; a third-party payment provider takes card payments; the building has a router and firewall connecting to the internet, an office switch on the first floor with 15 office PCs and a warehouse switch on the ground floor with the warehouse order system and handheld scanners on Wi-Fi; home workers connect over the internet using company laptops.',
    svg: svg(780, 532, [
      node('cloud', 390, 64, '', { w: 190 }), t(390, 68, 'Internet', { size: 14, w: 700 }),
      link(210, 92, 300, 72, 'net'), link(480, 72, 570, 92, 'net'), link(470, 80, 650, 262, 'net'),
      zone(20, 20, 190, 150, 'Cloud provider'), node('server', 115, 92, ['Online shop', 'web server']),
      zone(570, 20, 190, 150, 'Payment provider'), node('server', 665, 92, ['Card payment', 'service']),
      zone(20, 200, 560, 300, 'Kestrel building'),
      link(390, 102, 390, 236, 'fibre'), node('router', 390, 254, '', {}), t(452, 258, 'Router', { anchor: 'start' }),
      link(390, 272, 390, 300, 'cat6'), node('firewall', 390, 318, '', {}), t(452, 322, 'Firewall', { anchor: 'start' }),
      link(362, 330, 250, 378, 'cat6'), link(418, 330, 470, 378, 'cat6'),
      node('switch', 190, 392, 'Office switch (1st floor)', { w: 120, pos: 'top', up: 22 }),
      elbow(150, 406, 100, 450), node('pc', 100, 462, ''), elbow(230, 406, 270, 450), node('pc', 270, 462, ''), t(185, 474, '15 office PCs', { size: 12 }),
      node('switch', 470, 392, ['Warehouse switch', '(ground floor)'], { w: 120, pos: 'right', off: 66, size: 11.5 }),
      elbow(440, 406, 430, 450), node('server', 430, 466, ''), t(430, 506, 'Order system', { size: 11.5 }),
      elbow(500, 406, 520, 446), node('wap', 520, 462, ''), link(546, 456, 600, 440, 'wifi'), node('phone', 610, 436, ''), t(640, 478, 'Handheld scanners', { size: 11.5, w: 500 }),
      zone(600, 210, 160, 150, 'Home workers', '#f8fafc', true), node('laptop', 650, 286, ''), node('laptop', 710, 300, ''), t(680, 340, 'Company laptops', { size: 11.5, w: 500 }),
      legend(150, 512, ['cat6', 'fibre', 'wifi', 'net'])
    ].join(''), 'Figure 1: Kestrel Outdoor systems')
  };

  /* ── RA10 Paper 3: Riverside Sixth Form College ── */
  FIG['it2-r03-f1'] = {
    cap: 'Figure 1: Riverside Sixth Form College network',
    alt: 'Riverside college network: internet → router → firewall → core switch. The core switch connects the server room (directory server holding staff and student accounts, and the exam office file server), the staff network of PCs and classroom laptops (each classroom laptop connects by Bluetooth to an interactive display), and two wireless access points: Student Wi-Fi for students’ own devices and Guest Wi-Fi for visitors.',
    svg: svg(780, 520, [
      node('cloud', 120, 62, '', { w: 160 }), t(120, 66, 'Internet', { size: 14, w: 700 }),
      link(120, 96, 120, 150, 'fibre'), node('router', 120, 168, 'Router', { dy: 30 }),
      link(152, 176, 250, 176, 'cat6'), node('firewall', 280, 176, 'Firewall', { dy: 32 }),
      link(308, 176, 400, 176, 'cat6'), node('switch', 460, 176, 'Core switch', { w: 120, pos: 'top' }),
      zone(560, 20, 200, 200, 'Server room'),
      elbow(520, 168, 610, 80), node('server', 610, 100, ['Directory', 'server'], { dy: 42 }),
      elbow(500, 168, 700, 80), node('server', 700, 100, ['Exam office', 'file server'], { dy: 42 }),
      zone(20, 250, 330, 250, ''), t(338, 490, 'Staff network & classrooms', { anchor: 'end', size: 12, w: 700, fill: '#475569' }),
      elbow(420, 190, 90, 300), node('pc', 90, 316, 'Staff PCs', { dy: 36 }),
      elbow(440, 190, 230, 300), node('laptop', 230, 316, 'Teacher laptop', { dy: 34 }),
      `<path d="M230 342q-30 40 -60 60" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="1 4" stroke-linecap="round"/>`, t(232, 384, 'Bluetooth', { size: 11, w: 600, fill: '#2563eb', anchor: 'start' }),
      node('display', 150, 430, ['Interactive display'], { dy: 40 }),
      zone(380, 250, 380, 250, 'Wireless', '#f8fafc', true),
      elbow(480, 190, 470, 300), node('wap', 470, 318, 'Student Wi-Fi', { pos: 'left', off: 34 }),
      link(496, 330, 560, 380, 'wifi'), link(470, 344, 470, 400, 'wifi'), node('phone', 470, 420, ''), node('laptop', 570, 400, ''), t(510, 460, 'Students’ own devices', { size: 11.5, w: 500 }),
      elbow(500, 190, 670, 300), node('wap', 670, 318, 'Guest Wi-Fi', { pos: 'right', off: 32 }),
      link(690, 344, 700, 400, 'wifi'), node('phone', 700, 420, ''), t(700, 460, 'Visitors', { size: 11.5, w: 500 }),
      legend(190, 508, ['cat6', 'fibre', 'wifi'])
    ].join(''), 'Figure 1: Riverside Sixth Form College network')
  };

  /* ── RA10 Paper 4: Hale & Sutton Solicitors ── */
  FIG['it2-r04-f1'] = {
    cap: 'Figure 1: Hale & Sutton’s two offices',
    alt: 'Hale & Sutton network: the head office has a router, firewall and switch connecting staff PCs, and the client file server in a locked room; the branch office has a router and switch with staff PCs and connects to head office over the internet through a VPN; solicitors email documents to clients and other law firms over the internet through an email service.',
    svg: svg(780, 512, [
      node('cloud', 390, 70, '', { w: 200 }), t(390, 74, 'Internet', { size: 14, w: 700 }),
      link(480, 70, 590, 70, 'net'), t(535, 62, 'email', { size: 11, w: 600, fill: '#64748b' }),
      zone(590, 14, 170, 112, 'Outside the firm', '#f8fafc', true), node('laptop', 630, 66, ''), t(630, 104, 'Clients', { size: 11.5 }), node('pc', 712, 68, ''), t(712, 104, 'Other law firms', { size: 11.5 }),
      zone(20, 140, 360, 340, 'Head office'),
      link(300, 96, 220, 186, 'fibre'), node('router', 200, 200, 'Router', { pos: 'left', off: 40 }),
      link(200, 218, 200, 250, 'cat6'), node('firewall', 200, 268, 'Firewall', { pos: 'left', off: 36 }),
      link(200, 286, 200, 330, 'cat6'), node('switch', 200, 344, 'Switch', { w: 110, pos: 'left', off: 62 }),
      elbow(160, 358, 80, 410), node('pc', 80, 424, ''), node('pc', 130, 424, ''), t(105, 466, 'Staff PCs', { size: 12 }),
      `<rect x="232" y="384" width="130" height="86" rx="6" fill="${AMBER}" fill-opacity=".35" stroke="${INK}" stroke-width="1.6"/>`, node('lock', 350, 398, ''), t(297, 478, 'Locked room', { size: 10, w: 700, fill: '#92400e' }),
      elbow(240, 358, 290, 410), node('server', 290, 428, ''), t(296, 462, 'Client files', { size: 11.5 }),
      zone(420, 160, 340, 240, 'Branch office', '#f8fafc', true),
      link(480, 96, 560, 196, 'fibre'), node('router', 580, 214, 'Router', { pos: 'right', off: 40 }),
      link(580, 232, 580, 270, 'cat6'), node('switch', 580, 284, 'Switch', { w: 110, pos: 'right', off: 62 }),
      elbow(540, 298, 500, 330), node('pc', 500, 346, ''), elbow(620, 298, 660, 330), node('pc', 660, 346, ''), t(580, 392, 'Staff PCs', { size: 12 }),
      `<path d="M226 200 Q390 150 548 214" fill="none" stroke="#0f766e" stroke-width="2.4" stroke-dasharray="9 6"/>`, t(390, 166, 'VPN', { size: 12, w: 700, fill: '#0f766e' }),
      legend(150, 492, ['cat6', 'fibre', 'vpn', 'net'])
    ].join(''), 'Figure 1: Hale & Sutton offices')
  };

  window.BIZ_FIGURES = Object.assign(window.BIZ_FIGURES || {}, FIG);
})();
