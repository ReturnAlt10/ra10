/* RA10 Model diagrams — clean SVG diagrams of the business models students
   need to visualise (Ansoff, Boston Matrix, five forces, Maslow, Lewin ...).

   Diagrams follow the page theme (text uses currentColor; fills are tinted).
   They are inserted automatically under guide headings that name a model, once
   per model per page, and can be opened larger. Loaded by ra10-refresh.js on
   revision pages.

   window.RA10Models.svg(key) -> SVG string
   window.RA10Models.figure(key) -> <figure> element
   window.RA10Models.list() -> keys                                           */
(function () {
  'use strict';
  if (window.RA10Models) return;

  var C = { green: '#16a34a', blue: '#2563eb', amber: '#d97706', purple: '#7c3aed', red: '#dc2626', teal: '#0d9488', pink: '#db2777', slate: '#64748b' };
  var uid = 0;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function T(x, y, s, o) {
    o = o || {};
    var lines = String(s).split('\n');
    var size = o.size || 15, lh = size * 1.22;
    var y0 = y - (lines.length - 1) * lh / 2;
    return lines.map(function (ln, i) {
      return '<text x="' + x + '" y="' + (y0 + i * lh) + '" font-size="' + size + '" font-weight="' + (o.w || 600) + '" text-anchor="' + (o.a || 'middle') +
        '" dominant-baseline="middle" fill="' + (o.c || 'currentColor') + '"' + (o.op ? ' opacity="' + o.op + '"' : '') + (o.it ? ' font-style="italic"' : '') + '>' + esc(ln) + '</text>';
    }).join('');
  }
  function B(x, y, w, h, col, o) {
    o = o || {};
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 14 : o.rx) + '" fill="' + col + '" fill-opacity="' + (o.fo == null ? 0.14 : o.fo) +
      '" stroke="' + col + '" stroke-width="' + (o.sw || 2) + '"' + (o.dash ? ' stroke-dasharray="6 5"' : '') + '/>';
  }
  function L(x1, y1, x2, y2, o) {
    o = o || {};
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (o.c || 'currentColor') + '" stroke-width="' + (o.sw || 2) + '"' +
      (o.op ? ' stroke-opacity="' + o.op + '"' : '') + (o.dash ? ' stroke-dasharray="6 5"' : '') + (o.arrow ? ' marker-end="url(#' + o.arrow + ')"' : '') + '/>';
  }
  function P(d, o) {
    o = o || {};
    return '<path d="' + d + '" fill="' + (o.f || 'none') + '"' + (o.fo != null ? ' fill-opacity="' + o.fo + '"' : '') + ' stroke="' + (o.c || 'currentColor') + '" stroke-width="' + (o.sw || 2.5) +
      '" stroke-linecap="round" stroke-linejoin="round"' + (o.dash ? ' stroke-dasharray="7 6"' : '') + (o.arrow ? ' marker-end="url(#' + o.arrow + ')"' : '') + '/>';
  }
  function svg(w, h, body, arrows) {
    var defs = (arrows || []).map(function (a) {
      return '<marker id="' + a.id + '" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="' + a.c + '"/></marker>';
    }).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" font-family="inherit" style="width:100%;height:auto;display:block">' +
      (defs ? '<defs>' + defs + '</defs>' : '') + body + '</svg>';
  }
  function mk(c) { uid += 1; return { id: 'rm-a' + uid, c: c }; }

  /* ── Diagrams ───────────────────────────────────────────────────────── */
  var D = {};

  D.ansoff = { title: "Ansoff's matrix", caption: 'Risk rises as you move away from existing products and existing markets.', draw: function () {
    var a = mk('currentColor');
    var b = '';
    b += T(400, 30, 'PRODUCTS', { size: 13, w: 800, op: .6 });
    b += T(290, 58, 'Existing', { size: 14, op: .75 }) + T(510, 58, 'New', { size: 14, op: .75 });
    b += T(40, 230, 'MARKETS', { size: 13, w: 800, op: .6 });
    b += '<g transform="rotate(-90 40 230)"></g>';
    b += T(118, 150, 'Existing', { size: 14, op: .75 }) + T(118, 310, 'New', { size: 14, op: .75 });
    b += B(180, 76, 220, 150, C.green) + T(290, 135, 'Market\npenetration', { size: 19, w: 800 }) + T(290, 192, 'Lowest risk', { size: 13, op: .7 });
    b += B(400, 76, 220, 150, C.blue) + T(510, 135, 'Product\ndevelopment', { size: 19, w: 800 }) + T(510, 192, 'Medium risk', { size: 13, op: .7 });
    b += B(180, 236, 220, 150, C.amber) + T(290, 295, 'Market\ndevelopment', { size: 19, w: 800 }) + T(290, 352, 'Medium risk', { size: 13, op: .7 });
    b += B(400, 236, 220, 150, C.red) + T(510, 295, 'Diversification', { size: 19, w: 800 }) + T(510, 352, 'Highest risk', { size: 13, op: .7 });
    b += L(640, 90, 700, 380, { arrow: a.id, op: .5 }) + T(712, 240, 'Risk', { size: 13, w: 800, op: .6, a: 'start' });
    return svg(760, 400, b, [a]);
  } };

  D.boston = { title: 'Boston Matrix', caption: 'Market share v market growth: use cash cows to fund stars and question marks.', draw: function () {
    var b = '';
    b += T(400, 26, 'RELATIVE MARKET SHARE', { size: 13, w: 800, op: .6 });
    b += T(270, 52, 'High', { size: 14, op: .75 }) + T(530, 52, 'Low', { size: 14, op: .75 });
    b += T(70, 140, 'High', { size: 14, op: .75 }) + T(70, 300, 'Low', { size: 14, op: .75 });
    b += T(40, 220, 'MARKET\nGROWTH', { size: 12, w: 800, op: .6 });
    b += B(140, 70, 260, 150, C.amber) + T(270, 118, '★ Stars', { size: 22, w: 800 }) + T(270, 168, 'High share, high growth\nNeed investment to keep share', { size: 13, op: .75, w: 500 });
    b += B(400, 70, 260, 150, C.purple) + T(530, 118, '? Question marks', { size: 21, w: 800 }) + T(530, 168, 'Low share, high growth\nInvest or withdraw?', { size: 13, op: .75, w: 500 });
    b += B(140, 220, 260, 150, C.green) + T(270, 268, '💰 Cash cows', { size: 22, w: 800 }) + T(270, 318, 'High share, low growth\nGenerate cash to “milk”', { size: 13, op: .75, w: 500 });
    b += B(400, 220, 260, 150, C.slate) + T(530, 268, '✖ Dogs', { size: 22, w: 800 }) + T(530, 318, 'Low share, low growth\nDivest or reposition', { size: 13, op: .75, w: 500 });
    return svg(700, 390, b);
  } };

  D.plc = { title: 'Product life cycle', caption: 'Sales over time. An extension strategy (new market, new feature, re-branding) delays decline.', draw: function () {
    var a = mk('currentColor'), g = mk(C.green);
    var b = '';
    b += L(70, 330, 700, 330, { arrow: a.id }) + L(70, 330, 70, 40, { arrow: a.id });
    b += T(690, 352, 'Time', { size: 13, w: 700, op: .7, a: 'end' }) + T(50, 52, 'Sales', { size: 13, w: 700, op: .7, a: 'end' });
    var stages = [['Development', 70, 140], ['Introduction', 140, 240], ['Growth', 240, 380], ['Maturity', 380, 520], ['Decline', 520, 690]];
    stages.forEach(function (s, i) {
      if (i) b += L(s[1], 60, s[1], 330, { dash: true, op: .25, sw: 1.5 });
      b += T((s[1] + s[2]) / 2, 372, s[0], { size: 13, w: 700, op: .75 });
    });
    b += P('M70 330 C 120 330 130 328 140 322 C 200 300 220 250 260 190 C 300 130 340 92 400 85 C 460 80 500 90 530 110 C 580 150 640 230 690 285', { c: C.blue, sw: 4 });
    b += P('M500 96 C 540 70 600 72 650 92', { c: C.green, sw: 3.5, dash: true, arrow: g.id });
    b += T(600, 56, 'Extension strategy', { size: 13, w: 800, c: C.green });
    b += P('M70 320 L140 345', { c: C.red, sw: 0 });
    b += T(105, 300, 'Cash flow\nnegative', { size: 11, op: .6, w: 600 });
    return svg(740, 390, b, [a, g]);
  } };

  D.fiveforces = { title: "Porter's five forces", caption: 'The stronger each force, the lower the likely profitability of the market.', draw: function () {
    var a = mk(C.slate);
    var b = '';
    b += B(270, 150, 220, 110, C.red, { fo: .16 }) + T(380, 190, 'Rivalry among\nexisting firms', { size: 17, w: 800 }) + T(380, 238, 'Industry competition', { size: 12, op: .65 });
    b += B(290, 18, 180, 80, C.blue) + T(380, 58, 'Threat of\nnew entrants', { size: 15, w: 800 });
    b += B(290, 312, 180, 80, C.purple) + T(380, 352, 'Threat of\nsubstitutes', { size: 15, w: 800 });
    b += B(20, 165, 190, 80, C.amber) + T(115, 205, 'Supplier\npower', { size: 15, w: 800 });
    b += B(550, 165, 190, 80, C.green) + T(645, 205, 'Buyer\npower', { size: 15, w: 800 });
    b += L(380, 100, 380, 146, { c: C.slate, arrow: a.id, sw: 3 });
    b += L(380, 310, 380, 264, { c: C.slate, arrow: a.id, sw: 3 });
    b += L(212, 205, 266, 205, { c: C.slate, arrow: a.id, sw: 3 });
    b += L(548, 205, 494, 205, { c: C.slate, arrow: a.id, sw: 3 });
    b += T(135, 280, 'e.g. few suppliers,\nunique inputs', { size: 12, op: .6, w: 500 }) + T(625, 280, 'e.g. few large buyers,\neasy switching', { size: 12, op: .6, w: 500 });
    b += T(600, 50, 'Barriers to entry:\npatents, scale, brand', { size: 12, op: .6, w: 500 });
    return svg(760, 405, b, [a]);
  } };

  D.generic = { title: "Porter's generic strategies", caption: 'Choose a source of advantage (cost or difference) and a scope (whole market or a niche). Avoid being stuck in the middle.', draw: function () {
    var b = '';
    b += T(390, 26, 'SOURCE OF COMPETITIVE ADVANTAGE', { size: 12, w: 800, op: .6 });
    b += T(270, 52, 'Lower cost', { size: 14, op: .75 }) + T(510, 52, 'Differentiation', { size: 14, op: .75 });
    b += T(60, 140, 'Broad\n(whole market)', { size: 13, op: .75 }) + T(60, 290, 'Narrow\n(niche)', { size: 13, op: .75 });
    b += B(150, 70, 240, 140, C.green) + T(270, 125, 'Cost leadership', { size: 20, w: 800 }) + T(270, 162, 'e.g. budget airline', { size: 13, op: .65, w: 500 });
    b += B(390, 70, 240, 140, C.blue) + T(510, 125, 'Differentiation', { size: 20, w: 800 }) + T(510, 162, 'e.g. premium brand', { size: 13, op: .65, w: 500 });
    b += B(150, 220, 240, 140, C.teal) + T(270, 275, 'Cost focus', { size: 20, w: 800 }) + T(270, 312, 'cheapest in a niche', { size: 13, op: .65, w: 500 });
    b += B(390, 220, 240, 140, C.purple) + T(510, 275, 'Differentiation\nfocus', { size: 19, w: 800 }) + T(510, 325, 'specialist niche', { size: 13, op: .65, w: 500 });
    b += '<circle cx="390" cy="215" r="34" fill="' + C.red + '" fill-opacity=".16" stroke="' + C.red + '" stroke-width="2" stroke-dasharray="5 4"/>' + T(390, 215, 'Stuck in\nthe middle', { size: 10.5, w: 800, c: C.red });
    return svg(700, 380, b);
  } };

  D.maslow = { title: "Maslow's hierarchy of needs", caption: 'Lower needs must be met before higher needs motivate. Pay and security meet the lower levels.', draw: function () {
    var levels = [['Self-actualisation', 'challenge, creativity, promotion', C.purple], ['Esteem', 'recognition, status, responsibility', C.blue], ['Social', 'team working, belonging', C.teal], ['Safety', 'job security, contracts, safe workplace', C.amber], ['Physiological', 'pay to cover food and shelter', C.red]];
    var b = '', top = 30, h = 66, cx = 300;
    levels.forEach(function (l, i) {
      var y = top + i * h, w1 = 60 + i * 96, w2 = 60 + (i + 1) * 96;
      b += '<polygon points="' + (cx - w1 / 2) + ',' + y + ' ' + (cx + w1 / 2) + ',' + y + ' ' + (cx + w2 / 2) + ',' + (y + h) + ' ' + (cx - w2 / 2) + ',' + (y + h) + '" fill="' + l[2] + '" fill-opacity=".18" stroke="' + l[2] + '" stroke-width="2"/>';
      b += T(cx, y + h / 2, l[0], { size: i ? 16 : 13, w: 800 });
      b += L(cx + w2 / 2 - 10 + 6, y + h / 2, 580, y + h / 2, { dash: true, op: .25, sw: 1.5 });
      b += T(590, y + h / 2, l[1], { size: 13, a: 'start', op: .75, w: 500 });
    });
    return svg(860, 370, b);
  } };

  D.herzberg = { title: "Herzberg's two-factor theory", caption: 'Hygiene factors only remove dissatisfaction. Motivators create real, lasting motivation.', draw: function () {
    var b = '';
    b += B(30, 30, 330, 320, C.amber) + T(195, 66, 'Hygiene factors', { size: 21, w: 800 }) + T(195, 94, 'prevent dissatisfaction', { size: 13, op: .7, it: true, w: 500 });
    ['Pay and salary', 'Working conditions', 'Company policy', 'Supervision', 'Relationships at work', 'Job security'].forEach(function (s, i) { b += T(70, 136 + i * 34, '• ' + s, { size: 15, a: 'start', w: 600 }); });
    b += B(400, 30, 330, 320, C.green) + T(565, 66, 'Motivators', { size: 21, w: 800 }) + T(565, 94, 'create satisfaction', { size: 13, op: .7, it: true, w: 500 });
    ['Achievement', 'Recognition', 'Responsibility', 'The work itself', 'Advancement', 'Personal growth / training'].forEach(function (s, i) { b += T(440, 136 + i * 34, '• ' + s, { size: 15, a: 'start', w: 600 }); });
    b += T(380, 380, 'Job enrichment, empowerment and team working add motivators', { size: 13, op: .7, w: 600 });
    return svg(760, 400, b);
  } };

  D.tannenbaum = { title: 'Tannenbaum Schmidt continuum', caption: 'As the manager gives up authority, the team gains freedom. The best point depends on the manager, the team and the situation.', draw: function () {
    var b = '';
    b += '<polygon points="40,70 720,70 40,230" fill="' + C.blue + '" fill-opacity=".2" stroke="' + C.blue + '" stroke-width="2"/>';
    b += '<polygon points="720,70 720,230 40,230" fill="' + C.green + '" fill-opacity=".2" stroke="' + C.green + '" stroke-width="2"/>';
    b += T(170, 112, 'Use of authority by the manager', { size: 15, w: 800, a: 'start', c: C.blue });
    b += T(700, 200, 'Area of freedom for the team', { size: 15, w: 800, a: 'end', c: C.green });
    b += T(40, 40, 'Manager-centred (autocratic)', { size: 13, w: 800, a: 'start', op: .7 }) + T(720, 40, 'Team-centred (democratic / laissez-faire)', { size: 13, w: 800, a: 'end', op: .7 });
    var steps = ['Tells', 'Sells', 'Presents\nideas', 'Tentative\ndecision', 'Consults', 'Sets\nlimits', 'Team\ndecides'];
    steps.forEach(function (s, i) {
      var x = 40 + i * (680 / 6);
      b += L(x, 230, x, 250, { op: .5 });
      b += T(x, 280, s, { size: 13, w: 700 });
    });
    return svg(760, 310, b);
  } };

  D.lewin = { title: "Lewin's force field analysis", caption: 'Change happens when driving forces outweigh restraining forces. Ask: what has changed NOW?', draw: function () {
    var g = mk(C.green), r = mk(C.red);
    var b = '';
    b += '<rect x="370" y="40" width="20" height="300" rx="6" fill="currentColor" fill-opacity=".8"/>' + T(380, 24, 'Proposed change', { size: 14, w: 800 });
    b += T(180, 30, 'Driving forces', { size: 17, w: 800, c: C.green }) + T(580, 30, 'Restraining forces', { size: 17, w: 800, c: C.red });
    [['Falling sales', 260, 5], ['New technology', 220, 4], ['Competition', 240, 3], ['Customer demand', 200, 4]].forEach(function (f, i) {
      var y = 80 + i * 70;
      b += L(366 - f[1], y, 364, y, { c: C.green, sw: 2 + f[2], arrow: g.id });
      b += T(366 - f[1] - 8, y - 18, f[0] + ' (' + f[2] + ')', { size: 13, a: 'start', w: 700 });
    });
    [['Cost of change', 220, 4], ['Staff fear', 160, 3], ['Lost skills', 120, 2], ['Culture', 180, 3]].forEach(function (f, i) {
      var y = 80 + i * 70;
      b += L(394 + f[1], y, 396, y, { c: C.red, sw: 2 + f[2], arrow: r.id });
      b += T(394 + f[1] + 8, y - 18, f[0] + ' (' + f[2] + ')', { size: 13, a: 'end', w: 700 });
    });
    b += T(380, 370, 'Total driving 16  >  total restraining 12  →  change likely', { size: 14, w: 800, op: .8 });
    return svg(760, 390, b, [g, r]);
  } };

  D.kotter = { title: 'Kotter and Schlesinger', caption: 'Match the method of overcoming resistance to the reason people are resisting.', draw: function () {
    var b = '';
    b += T(170, 26, 'Why people resist', { size: 16, w: 800, c: C.red }) + T(560, 26, 'How to overcome it', { size: 16, w: 800, c: C.green });
    var causes = ['Self-interest', 'Misunderstanding\n& lack of trust', 'Different assessment\nof the situation', 'Low tolerance\nfor change'];
    causes.forEach(function (c, i) { b += B(40, 48 + i * 80, 260, 64, C.red, { fo: .1 }) + T(170, 80 + i * 80, c, { size: 14, w: 700 }); });
    var methods = ['Education & communication', 'Participation & involvement', 'Facilitation & support', 'Negotiation & agreement', 'Manipulation & co-optation', 'Explicit & implicit coercion'];
    methods.forEach(function (m, i) { b += B(420, 46 + i * 54, 290, 44, C.green, { fo: .1, rx: 12 }) + T(565, 68 + i * 54, m, { size: 13.5, w: 700 }); });
    b += L(305, 160, 410, 160, { op: .35, sw: 10 });
    b += T(560, 382, 'Methods lower down are faster but damage trust', { size: 12, op: .65, it: true, w: 500 });
    return svg(750, 395, b);
  } };

  D.carroll = { title: "Carroll's CSR pyramid", caption: 'Each level rests on the one below: a business must be profitable before it can be philanthropic.', draw: function () {
    var levels = [['Philanthropic', 'Be a good corporate citizen', C.purple, 'desired'], ['Ethical', 'Do what is right and fair', C.blue, 'expected'], ['Legal', 'Obey the law', C.amber, 'required'], ['Economic', 'Be profitable', C.green, 'required']];
    var b = '', cx = 280, top = 30, h = 76;
    levels.forEach(function (l, i) {
      var y = top + i * h, w1 = 40 + i * 120, w2 = 40 + (i + 1) * 120;
      b += '<polygon points="' + (cx - w1 / 2) + ',' + y + ' ' + (cx + w1 / 2) + ',' + y + ' ' + (cx + w2 / 2) + ',' + (y + h) + ' ' + (cx - w2 / 2) + ',' + (y + h) + '" fill="' + l[2] + '" fill-opacity=".2" stroke="' + l[2] + '" stroke-width="2"/>';
      b += T(cx, y + h / 2 + (i ? 0 : 12), l[0], { size: i ? 17 : 12, w: 800 });
      b += T(560, y + h / 2 - 9, l[1], { size: 14, a: 'start', w: 700 }) + T(560, y + h / 2 + 12, 'Socially ' + l[3], { size: 12, a: 'start', op: .6, it: true, w: 500 });
    });
    return svg(780, 350, b);
  } };

  D.tbl = { title: "Elkington's Triple Bottom Line", caption: 'Judge performance on people and planet as well as profit - sustainable businesses succeed on all three.', draw: function () {
    var b = '';
    b += '<circle cx="290" cy="150" r="115" fill="' + C.green + '" fill-opacity=".16" stroke="' + C.green + '" stroke-width="2"/>';
    b += '<circle cx="450" cy="150" r="115" fill="' + C.blue + '" fill-opacity=".16" stroke="' + C.blue + '" stroke-width="2"/>';
    b += '<circle cx="370" cy="285" r="115" fill="' + C.amber + '" fill-opacity=".16" stroke="' + C.amber + '" stroke-width="2"/>';
    b += T(250, 120, 'Planet', { size: 20, w: 800 }) + T(250, 148, 'environment,\nemissions, waste', { size: 12, op: .7, w: 500 });
    b += T(490, 120, 'People', { size: 20, w: 800 }) + T(490, 148, 'employees,\ncommunity, suppliers', { size: 12, op: .7, w: 500 });
    b += T(370, 320, 'Profit', { size: 20, w: 800 }) + T(370, 348, 'financial performance', { size: 12, op: .7, w: 500 });
    b += T(370, 200, 'Sustainable', { size: 13, w: 800 });
    return svg(740, 410, b);
  } };

  D.stakeholder = { title: 'Stakeholder mapping', caption: 'Plot each stakeholder by power and interest to decide how to manage them.', draw: function () {
    var a = mk('currentColor');
    var b = '';
    b += L(100, 360, 690, 360, { arrow: a.id }) + L(100, 360, 100, 30, { arrow: a.id });
    b += T(400, 385, 'Interest →', { size: 13, w: 800, op: .7 }) + T(60, 195, 'Power\n↑', { size: 13, w: 800, op: .7 });
    b += B(110, 40, 280, 150, C.amber) + T(250, 100, 'Keep satisfied', { size: 19, w: 800 }) + T(250, 135, 'high power, low interest\ne.g. regulators', { size: 12, op: .7, w: 500 });
    b += B(400, 40, 280, 150, C.red) + T(540, 100, 'Manage closely', { size: 19, w: 800 }) + T(540, 135, 'high power, high interest\ne.g. major shareholders', { size: 12, op: .7, w: 500 });
    b += B(110, 200, 280, 150, C.slate) + T(250, 260, 'Monitor', { size: 19, w: 800 }) + T(250, 295, 'low power, low interest\nminimum effort', { size: 12, op: .7, w: 500 });
    b += B(400, 200, 280, 150, C.blue) + T(540, 260, 'Keep informed', { size: 19, w: 800 }) + T(540, 295, 'low power, high interest\ne.g. local residents', { size: 12, op: .7, w: 500 });
    return svg(720, 400, b, [a]);
  } };

  D.swot = { title: 'SWOT analysis', caption: 'Strengths and weaknesses are internal; opportunities and threats come from the external environment.', draw: function () {
    var b = '';
    b += T(60, 120, 'INTERNAL', { size: 12, w: 800, op: .6 }) + T(60, 280, 'EXTERNAL', { size: 12, w: 800, op: .6 });
    b += B(120, 30, 290, 170, C.green) + T(265, 70, 'Strengths', { size: 21, w: 800 }) + T(265, 130, 'strong brand, patents,\nskilled staff, low costs', { size: 13, op: .7, w: 500 });
    b += B(420, 30, 290, 170, C.amber) + T(565, 70, 'Weaknesses', { size: 21, w: 800 }) + T(565, 130, 'high gearing, old\nequipment, staff turnover', { size: 13, op: .7, w: 500 });
    b += B(120, 210, 290, 170, C.blue) + T(265, 250, 'Opportunities', { size: 21, w: 800 }) + T(265, 310, 'growing market, new\ntechnology, falling costs', { size: 13, op: .7, w: 500 });
    b += B(420, 210, 290, 170, C.red) + T(565, 250, 'Threats', { size: 21, w: 800 }) + T(565, 310, 'new competitors, recession,\nnew legislation', { size: 13, op: .7, w: 500 });
    b += T(265, 400, 'Helpful', { size: 13, w: 800, op: .6 }) + T(565, 400, 'Harmful', { size: 13, w: 800, op: .6 });
    return svg(740, 415, b);
  } };

  D.pestle = { title: 'PESTLE analysis', caption: 'Six groups of external factors that create opportunities and threats.', draw: function () {
    var items = [['P', 'Political', 'tax, trade policy', C.red], ['E', 'Economic', 'interest rates, GDP', C.amber], ['S', 'Social', 'demographics, trends', C.green], ['T', 'Technological', 'automation, online', C.blue], ['L', 'Legal', 'employment, consumer law', C.purple], ['E', 'Environmental', 'climate, waste', C.teal]];
    var b = '';
    items.forEach(function (it, i) {
      var col = i % 3, row = Math.floor(i / 3), x = 30 + col * 240, y = 30 + row * 170;
      b += B(x, y, 220, 150, it[3]);
      b += '<circle cx="' + (x + 40) + '" cy="' + (y + 42) + '" r="24" fill="' + it[3] + '"/>' + T(x + 40, y + 43, it[0], { size: 22, w: 900, c: '#fff' });
      b += T(x + 76, y + 42, it[1], { size: 17, w: 800, a: 'start' }) + T(x + 110, y + 105, it[2], { size: 13, op: .7, w: 500 });
    });
    return svg(750, 370, b);
  } };

  D.breakeven = { title: 'Break-even chart', caption: 'Break-even is where total revenue meets total costs. The gap to actual output is the margin of safety.', draw: function () {
    var a = mk('currentColor');
    var b = '';
    var X = function (q) { return 80 + q * 6; }, Y = function (v) { return 340 - v * 2.2; };
    b += L(80, 340, 700, 340, { arrow: a.id }) + L(80, 340, 80, 30, { arrow: a.id });
    b += T(690, 362, 'Output (units)', { size: 13, w: 700, op: .7, a: 'end' }) + T(70, 40, '£', { size: 15, w: 800, op: .7, a: 'end' });
    b += L(X(0), Y(40), X(100), Y(40), { c: C.slate, sw: 2.5, dash: true }) + T(X(100) + 4, Y(40) - 12, 'Fixed costs', { size: 12, w: 700, a: 'end', c: C.slate });
    b += L(X(0), Y(40), X(100), Y(100), { c: C.red, sw: 3.5 }) + T(X(100) - 4, Y(100) + 18, 'Total costs', { size: 13, w: 800, a: 'end', c: C.red });
    b += L(X(0), Y(0), X(100), Y(130), { c: C.green, sw: 3.5 }) + T(X(98), Y(130) - 14, 'Total revenue', { size: 13, w: 800, a: 'end', c: C.green });
    var be = 40 / (1.3 - 0.6);
    b += '<circle cx="' + X(be) + '" cy="' + Y(be * 1.3) + '" r="7" fill="' + C.amber + '"/>';
    b += L(X(be), Y(be * 1.3), X(be), 340, { dash: true, op: .5, sw: 1.5 }) + T(X(be), 356, 'Break-even', { size: 12, w: 800, c: C.amber });
    b += L(X(90), 340, X(90), Y(117), { dash: true, op: .5, sw: 1.5 }) + T(X(90), 356, 'Actual output', { size: 12, w: 700 });
    b += '<path d="M' + X(be) + ' 318 L' + X(90) + ' 318" stroke="' + C.blue + '" stroke-width="3" marker-start="url(#' + a.id + ')" marker-end="url(#' + a.id + ')"/>' + T((X(be) + X(90)) / 2, 302, 'Margin of safety', { size: 12, w: 800, c: C.blue });
    b += T(X(28), Y(52), 'Loss', { size: 14, w: 800, c: C.red, op: .8 }) + T(X(78), Y(88), 'Profit', { size: 14, w: 800, c: C.green, op: .8 });
    return svg(740, 380, b, [a]);
  } };

  D.decisiontree = { title: 'Decision tree', caption: 'Squares are decisions, circles are chance nodes. Expected value = sum of (probability x outcome); net gain = EV - cost.', draw: function () {
    var b = '';
    b += '<rect x="30" y="180" width="40" height="40" fill="' + C.blue + '" fill-opacity=".25" stroke="' + C.blue + '" stroke-width="2.5"/>';
    b += L(70, 200, 260, 100) + L(70, 200, 260, 300);
    b += T(150, 128, 'Launch (-£50k)', { size: 13, w: 700 }) + T(150, 272, 'Do nothing (£0)', { size: 13, w: 700 });
    b += '<circle cx="280" cy="100" r="20" fill="' + C.amber + '" fill-opacity=".25" stroke="' + C.amber + '" stroke-width="2.5"/>';
    b += L(300, 100, 520, 40) + L(300, 100, 520, 160);
    b += T(410, 54, 'Success 0.6', { size: 13, w: 700 }) + T(410, 150, 'Failure 0.4', { size: 13, w: 700 });
    b += T(530, 40, '£200k', { size: 15, w: 800, a: 'start', c: C.green }) + T(530, 160, '£80k', { size: 15, w: 800, a: 'start', c: C.amber });
    b += T(530, 300, '£0', { size: 15, w: 800, a: 'start' }) + L(260, 300, 520, 300);
    b += B(200, 335, 520, 50, C.green, { rx: 12, fo: .1 }) + T(460, 360, 'EV = (0.6 × 200) + (0.4 × 80) = £152k  →  net gain = 152 - 50 = £102k', { size: 13, w: 700 });
    b += T(280, 136, 'EV £152k', { size: 12, w: 800, c: C.amber });
    return svg(740, 400, b);
  } };

  D.network = { title: 'Network analysis (critical path)', caption: 'Nodes show earliest start (EST) and latest finish (LFT). Activities with no float form the critical path.', draw: function () {
    var a = mk('currentColor'), r = mk(C.red);
    function node(x, y, n, est, lft, crit) {
      var col = crit ? C.red : 'currentColor';
      return '<circle cx="' + x + '" cy="' + y + '" r="34" fill="none" stroke="' + col + '" stroke-width="2.5"/>' +
        L(x - 34, y, x + 34, y, { c: col, sw: 1.5 }) + L(x, y, x, y + 34, { c: col, sw: 1.5 }) +
        T(x, y - 14, String(n), { size: 15, w: 800 }) + T(x - 15, y + 15, String(est), { size: 13, w: 700 }) + T(x + 15, y + 15, String(lft), { size: 13, w: 700 });
    }
    var b = '';
    b += node(60, 190, 1, 0, 0, true) + node(250, 90, 2, 4, 4, true) + node(250, 290, 3, 3, 6, false) + node(460, 190, 4, 10, 10, true) + node(660, 190, 5, 13, 13, true);
    b += L(92, 176, 216, 104, { c: C.red, sw: 3, arrow: r.id }) + T(140, 122, 'A 4', { size: 14, w: 800, c: C.red });
    b += L(92, 204, 216, 276, { arrow: a.id }) + T(140, 262, 'B 3', { size: 14, w: 800 });
    b += L(284, 104, 426, 176, { c: C.red, sw: 3, arrow: r.id }) + T(372, 122, 'C 6', { size: 14, w: 800, c: C.red });
    b += L(284, 276, 426, 204, { arrow: a.id }) + T(372, 262, 'D 4 (float 3)', { size: 14, w: 800 });
    b += L(494, 190, 624, 190, { c: C.red, sw: 3, arrow: r.id }) + T(560, 172, 'E 3', { size: 14, w: 800, c: C.red });
    b += T(370, 360, 'Critical path: A → C → E = 13 days', { size: 15, w: 800, c: C.red });
    return svg(720, 380, b, [a, r]);
  } };

  D.inventory = { title: 'Inventory control chart', caption: 'Stock falls with usage; an order is placed at the re-order level and arrives after the lead time.', draw: function () {
    var a = mk('currentColor');
    var b = '';
    var Y = function (v) { return 330 - v * 2.4; };
    b += L(70, 330, 710, 330, { arrow: a.id }) + L(70, 330, 70, 30, { arrow: a.id });
    b += T(700, 352, 'Time (days)', { size: 13, w: 700, op: .7, a: 'end' }) + T(60, 40, 'Units', { size: 13, w: 700, op: .7, a: 'end' });
    b += L(70, Y(110), 690, Y(110), { c: C.slate, dash: true, sw: 1.5 }) + T(700, Y(110), 'Maximum', { size: 12, w: 700, a: 'start', c: C.slate });
    b += L(70, Y(50), 690, Y(50), { c: C.amber, dash: true, sw: 1.5 }) + T(700, Y(50), 'Re-order level', { size: 12, w: 700, a: 'start', c: C.amber });
    b += L(70, Y(20), 690, Y(20), { c: C.red, dash: true, sw: 1.5 }) + T(700, Y(20), 'Buffer', { size: 12, w: 700, a: 'start', c: C.red });
    b += P('M70 ' + Y(110) + ' L270 ' + Y(20) + ' L270 ' + Y(110) + ' L470 ' + Y(20) + ' L470 ' + Y(110) + ' L670 ' + Y(20), { c: C.blue, sw: 3.5 });
    b += L(203, Y(50), 270, Y(50), { c: C.purple, sw: 3 }) + T(236, Y(50) - 16, 'Lead time', { size: 12, w: 800, c: C.purple });
    b += '<path d="M290 ' + Y(20) + ' L290 ' + Y(110) + '" stroke="' + C.green + '" stroke-width="2.5" marker-start="url(#' + a.id + ')" marker-end="url(#' + a.id + ')"/>' + T(300, Y(65), 'Re-order\nquantity', { size: 12, w: 800, a: 'start', c: C.green });
    return svg(820, 360, b, [a]);
  } };

  D.handy = { title: "Handy's organisational cultures", caption: 'Power (one central figure), role (rules and job roles), task (project teams), person (individual experts).', draw: function () {
    var b = '';
    function card(x, title, desc, col, icon) {
      return B(x, 30, 170, 280, col) + icon + T(x + 85, 210, title, { size: 18, w: 800 }) + T(x + 85, 262, desc, { size: 12, op: .7, w: 500 });
    }
    var web = '';
    for (var i = 0; i < 8; i++) { var ang = i * Math.PI / 4; web += L(115, 115, 115 + Math.cos(ang) * 55, 115 + Math.sin(ang) * 55, { c: C.red, sw: 1.5, op: .7 }); }
    web += '<circle cx="115" cy="115" r="14" fill="' + C.red + '"/><circle cx="115" cy="115" r="38" fill="none" stroke="' + C.red + '" stroke-opacity=".5"/>';
    var temple = '<polygon points="235,85 320,60 405,85" fill="' + C.blue + '" fill-opacity=".4"/>' + [250, 290, 330, 370].map(function (x) { return '<rect x="' + (x - 5) + '" y="90" width="14" height="60" fill="' + C.blue + '" fill-opacity=".55"/>'; }).join('') + '<rect x="235" y="152" width="170" height="10" fill="' + C.blue + '" fill-opacity=".5"/>';
    var net = '';
    var pts = [[470, 75], [540, 70], [505, 120], [460, 150], [550, 150]];
    pts.forEach(function (p, i) { pts.forEach(function (q, j) { if (j > i) net += L(p[0], p[1], q[0], q[1], { c: C.green, sw: 1.2, op: .5 }); }); });
    pts.forEach(function (p) { net += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="' + C.green + '"/>'; });
    var stars = [[655, 85], [700, 120], [640, 145], [690, 70]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="13" fill="' + C.purple + '" fill-opacity=".7"/>'; }).join('') + '<circle cx="670" cy="112" r="55" fill="none" stroke="' + C.purple + '" stroke-dasharray="4 4" stroke-opacity=".6"/>';
    b += card(30, 'Power', 'central leader;\nfast decisions', C.red, web);
    b += card(235, 'Role', 'procedures,\njob descriptions', C.blue, temple);
    b += card(420, 'Task', 'project teams;\nexpertise counts', C.green, net);
    b += card(605, 'Person', 'individuals;\ne.g. partnerships', C.purple, stars);
    return svg(805, 330, b);
  } };

  D.marketmap = { title: 'Market map (positioning)', caption: 'Plot brands on two features customers care about to spot gaps and crowded positions.', draw: function () {
    var a = mk('currentColor');
    var b = '';
    b += L(70, 200, 690, 200, { arrow: a.id, op: .7 }) + L(690, 200, 70, 200, { arrow: a.id, op: .7 });
    b += L(380, 370, 380, 30, { arrow: a.id, op: .7 }) + L(380, 30, 380, 370, { arrow: a.id, op: .7 });
    b += T(380, 18, 'High price', { size: 13, w: 800, op: .7 }) + T(380, 388, 'Low price', { size: 13, w: 800, op: .7 });
    b += T(60, 200, 'Low\nquality', { size: 13, w: 800, op: .7, a: 'end' }) + T(700, 200, 'High\nquality', { size: 13, w: 800, op: .7, a: 'start' });
    [[560, 80, 'Premium A', C.purple], [610, 120, 'Luxury B', C.purple], [200, 300, 'Budget C', C.amber], [250, 330, 'Value D', C.amber], [300, 280, 'Own-label', C.amber]].forEach(function (p) {
      b += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="' + p[3] + '"/>' + T(p[0] + 16, p[1], p[2], { size: 13, w: 700, a: 'start' });
    });
    b += '<ellipse cx="560" cy="300" rx="90" ry="48" fill="' + C.green + '" fill-opacity=".14" stroke="' + C.green + '" stroke-width="2" stroke-dasharray="6 5"/>' + T(560, 300, 'Gap: good quality,\nlow price?', { size: 12, w: 800, c: C.green });
    return svg(760, 400, b, [a]);
  } };

  /* ── Matching headings to models ─────────────────────────────────────── */
  var MATCH = [
    ['ansoff', /\bansoff/i], ['boston', /boston\s*matrix|\bbcg\b/i], ['plc', /product\s+life\s*cycle/i],
    ['fiveforces', /five\s+forces/i], ['generic', /generic\s+strateg|porter'?s\s+(low\s+cost|strategies)/i],
    ['maslow', /maslow/i], ['herzberg', /herzberg|two[-\s]factor/i], ['tannenbaum', /tannenbaum/i],
    ['lewin', /lewin|force\s+field/i], ['kotter', /kotter/i], ['carroll', /carroll/i], ['tbl', /triple\s+bottom\s+line|elkington/i],
    ['stakeholder', /stakeholder\s+map/i], ['swot', /\bswot\b/i], ['pestle', /\bpest(le|el)?\b\s*(analysis)?/i],
    ['breakeven', /break[-\s]?even\s+(chart|analysis)/i], ['decisiontree', /decision\s+tree/i], ['network', /network\s+analysis|critical\s+path/i],
    ['inventory', /inventory\s+control|stock\s+control\s+chart/i], ['handy', /handy|organisational\s+culture/i], ['marketmap', /market\s+map/i],
  ];

  function figure(key) {
    var d = D[key];
    if (!d) return null;
    var f = document.createElement('figure');
    f.className = 'rm-fig';
    f.setAttribute('data-model', key);
    f.innerHTML = '<div class="rm-svg">' + d.draw() + '</div><figcaption><b>' + esc(d.title) + '.</b> ' + esc(d.caption) + '</figcaption>' +
      '<button type="button" class="rm-zoom" aria-label="Open ' + esc(d.title) + ' larger">⤢</button>';
    f.querySelector('.rm-zoom').onclick = function () { zoom(key); };
    f.querySelector('.rm-svg').onclick = function () { zoom(key); };
    return f;
  }

  function zoom(key) {
    var d = D[key];
    var ov = document.createElement('div');
    ov.className = 'rm-zoom-ov';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', d.title);
    ov.innerHTML = '<div class="rm-zoom-card"><button type="button" class="rm-close" aria-label="Close">✕</button><h3>' + esc(d.title) + '</h3>' + d.draw() + '<p>' + esc(d.caption) + '</p></div>';
    document.body.appendChild(ov);
    function close() { ov.remove(); document.removeEventListener('keydown', k, true); }
    function k(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', k, true);
    ov.onclick = function (e) { if (e.target === ov) close(); };
    ov.querySelector('.rm-close').onclick = close;
    ov.querySelector('.rm-close').focus();
  }

  (function css() {
    if (document.getElementById('rm-css')) return;
    var st = document.createElement('style');
    st.id = 'rm-css';
    st.textContent = [
      '.rm-fig{position:relative;margin:14px 0 18px;padding:14px 14px 10px;border-radius:18px;background:color-mix(in srgb,currentColor 4%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,currentColor 12%,transparent);max-width:760px}',
      '.rm-svg{cursor:zoom-in}',
      '.rm-fig figcaption{margin-top:8px;font-size:.84rem;line-height:1.45;opacity:.85}',
      '.rm-zoom{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;border:0;cursor:pointer;background:color-mix(in srgb,currentColor 8%,transparent);color:inherit;font-size:1rem}',
      '.rm-zoom-ov{position:fixed !important;inset:0;z-index:2147483600 !important;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,12,20,.5);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}',
      '.rm-zoom-card{position:relative;width:min(1000px,100%);max-height:94vh;overflow:auto;border-radius:22px;padding:22px;background:var(--surface,var(--color-surface,#fff));color:var(--ink,var(--color-text,#14161c))}',
      '[data-theme="dark"] .rm-zoom-card{background:#1b1c22;color:#eef0f6}',
      '.rm-zoom-card h3{margin:0 0 10px}.rm-zoom-card p{margin:10px 0 0;opacity:.85}',
      '.rm-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:50%;border:0;cursor:pointer;background:rgba(127,127,127,.15);color:inherit}',
      '@media print{.rm-zoom{display:none}}',
    ].join('\n');
    document.head.appendChild(st);
  })();

  // Insert a diagram under the first heading on the page that names each model.
  var placed = {};
  function scan() {
    var hs = document.querySelectorAll('h2, h3, h4, .topic-title, .g-topic-title');
    for (var i = 0; i < hs.length; i++) {
      var hEl = hs[i];
      if (hEl.hasAttribute('data-rm') || hEl.closest('nav, .topbar, button, .rm-fig, .rai, .rai-panel, .lbx, .flash-card, .quiz-card, .practice-card')) continue;
      if (!hEl.offsetParent && hEl.getClientRects().length === 0) continue;   // hidden (e.g. collapsed tabs) - try later
      hEl.setAttribute('data-rm', '1');
      var text = hEl.textContent || '';
      for (var j = 0; j < MATCH.length; j++) {
        var key = MATCH[j][0];
        if (placed[key] || !MATCH[j][1].test(text)) continue;
        var fig = figure(key);
        if (fig) { hEl.insertAdjacentElement('afterend', fig); placed[key] = true; }
        break;
      }
    }
  }
  var pending = false;
  function schedule() { if (!pending) { pending = true; setTimeout(function () { pending = false; scan(); }, 250); } }
  function boot() {
    scan();
    try { new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    document.addEventListener('click', schedule, true);
  }

  window.RA10Models = {
    svg: function (key) { return D[key] ? D[key].draw() : ''; },
    figure: figure,
    list: function () { return Object.keys(D); },
    zoom: zoom,
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
