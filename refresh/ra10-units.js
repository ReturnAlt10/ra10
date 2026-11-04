/* RA10 — catalogue of unit apps (one source for the EDU tools, onboarding scan and homepages).
   path   : internal route key (the shell maps it to the public URL, e.g. /btec/level-3/IT-AAQ/unit-2)
   app    : the unit app's index.html (same origin), used to read its question bank for assignments */
(function () {
  'use strict';
  var U = [
    { path: '/revision/btec/level-3/IT-AAQ/unit-1', subject: 'Information Technology', qual: 'BTEC Level 3 IT (AAQ)', short: 'IT Unit 1', name: 'Unit 1: Information Technology Systems', kind: 'Exam', color: '#2563eb', keywords: ['information technology', 'btec it', 'it aaq', 'computing', 'ict'] },
    { path: '/revision/btec/level-3/IT-AAQ/unit-2', subject: 'Information Technology', qual: 'BTEC Level 3 IT (AAQ)', short: 'IT Unit 2', name: 'Unit 2: Cyber Security and Incident Management', kind: 'Exam', color: '#0f766e', keywords: ['cyber security', 'information technology', 'btec it', 'it aaq'] },
    { path: '/revision/btec/level-3/IT-AAQ/unit-3', subject: 'Information Technology', qual: 'BTEC Level 3 IT (AAQ)', short: 'IT Unit 3', name: 'Unit 3: Website Development', kind: 'Coursework', color: '#7c3aed', keywords: ['website development', 'web design', 'information technology', 'btec it'] },
    { path: '/revision/btec/level-3/IT-AAQ/unit-4', subject: 'Information Technology', qual: 'BTEC Level 3 IT (AAQ)', short: 'IT Unit 4', name: 'Unit 4: Relational Database Development', kind: 'Coursework', color: '#9333ea', keywords: ['database', 'sql', 'information technology', 'btec it'] },
    { path: '/revision/btec/level-3/business/unit-2', subject: 'Business', qual: 'BTEC Level 3 Business', short: 'Business Unit 2', name: 'Unit 2: Developing a Marketing Campaign', kind: 'Set task', color: '#ea580c', keywords: ['btec business', 'business', 'marketing'] },
    { path: '/revision/btec/level-3/business/unit-3', subject: 'Business', qual: 'BTEC Level 3 Business', short: 'Business Unit 3', name: 'Unit 3: Personal and Business Finance', kind: 'Exam', color: '#d97706', keywords: ['btec business', 'business', 'finance'] },
    { path: '/revision/btec/level-3/business/unit-6', subject: 'Business', qual: 'BTEC Level 3 Business', short: 'Business Unit 6', name: 'Unit 6: Principles of Management', kind: 'Set task', color: '#c2410c', keywords: ['btec business', 'business', 'management'] },
    { path: '/revision/btec/level-3/business/unit-7', subject: 'Business', qual: 'BTEC Level 3 Business', short: 'Business Unit 7', name: 'Unit 7: Business Decision Making', kind: 'Set task', color: '#b45309', keywords: ['btec business', 'business', 'decision making'] },
    { path: '/revision/a-level/business-2023', subject: 'Business', qual: 'AQA A-Level Business (7132)', short: 'A-Level Business', name: 'AQA A-Level Business (7132)', kind: 'Exam', color: '#be123c', keywords: ['a level business', 'a-level business', 'aqa business', 'business studies', 'business'] },
    { path: '/revision/a-level/business-2026', subject: 'Business', qual: 'AQA A-Level Business (7138)', short: 'A-Level Business 2026', name: 'AQA A-Level Business (7138, 2026 spec)', kind: 'Exam', color: '#e11d48', keywords: ['a level business', 'a-level business', 'aqa business', 'business studies', 'business'] },
    { path: '/revision/btec/level-3/sport/unit-1', subject: 'Sport', qual: 'BTEC Level 3 Sport', short: 'Sport Unit 1', name: 'Unit 1: Anatomy and Physiology', kind: 'Exam', color: '#16a34a', keywords: ['btec sport', 'sport', 'physical education', 'anatomy'] },
    { path: '/revision/btec/level-3/sport/unit-2', subject: 'Sport', qual: 'BTEC Level 3 Sport', short: 'Sport Unit 2', name: 'Unit 2: Fitness Training and Programming', kind: 'Set task', color: '#15803d', keywords: ['btec sport', 'sport', 'physical education', 'fitness'] },
    { path: '/revision/btec/level-2/it/unit-2', subject: 'Information Technology', qual: 'BTEC Level 2 IT', short: 'IT L2 Unit 2', name: 'Level 2 IT Unit 2: Technology Systems', kind: 'Exam', color: '#0284c7', keywords: ['btec tech', 'level 2 it', 'ks4 it', 'information technology', 'tech award'] }
  ];
  U.forEach(function (u) {
    u.app = u.path.replace(/^\/revision\//, '/revision/') + '/index.html';
    u.publicPath = u.path.replace(/^\/revision(?=\/(btec|a-level)\/)/, '');
  });
  function byPath(p) {
    var key = String(p || '').replace(/\/index\.html.*$/, '').replace(/\/$/, '');
    if (!/^\/revision\//.test(key) && /^\/(btec|a-level)\//.test(key)) key = '/revision' + key;
    return U.filter(function (u) { return u.path.toLowerCase() === key.toLowerCase(); })[0] || null;
  }
  // Which unit app a URL belongs to (works for /revision/... iframe URLs and public URLs)
  function fromLocation(pathname) {
    var p = String(pathname || location.pathname);
    for (var i = 0; i < U.length; i++) if (p.toLowerCase().indexOf(U[i].path.toLowerCase()) === 0 || p.toLowerCase().indexOf(U[i].publicPath.toLowerCase()) === 0) return U[i];
    return null;
  }
  window.RA10_UNITS = U;
  window.RA10Units = { all: function () { return U.slice(); }, byPath: byPath, fromLocation: fromLocation };
})();
