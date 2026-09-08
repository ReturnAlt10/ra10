/* BTEC IT Unit 4 — "Access Lab" : a fake Microsoft Access simulator.
   Lets learners build their own database (tables, relationships, queries, forms,
   reports) using realistic Access-style GUI — no real Access required.
   Initialised by window.initAccessSim(). */
(function () {
  'use strict';

  const STORE_KEY = 'ra10-access-sim-db-u4';
  let db = loadDb();
  let ui = {
    view: 'home',            // home | tableDesign | datasheet | relationships | queryDesign | queryResult | form | report
    tableName: null,         // current table for design/datasheet
    queryName: null,         // current query being edited
    relationshipDraft: null, // {from:{table,field}} while dragging
    modal: null              // for save dialogs etc.
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  /* ── Persistence ─────────────────────────────────────────── */
  function blankDb() {
    return { tables: {}, queries: {}, forms: {}, reports: {}, relationships: [] };
  }
  function loadDb() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && typeof d.tables === 'object') return d;
      }
    } catch (e) {}
    return blankDb();
  }
  function saveDb() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); } catch (e) {}
  }
  window.__ra10AccessDb = function () { return db; };

  const DATA_TYPES = [
    'Short Text', 'Long Text', 'Number', 'Large Number', 'Date/Time',
    'Currency', 'AutoNumber', 'Yes/No', 'Lookup Wizard…'
  ];
  const TYPE_HINTS = {
    'Short Text': 'Text up to 255 chars — names, IDs (e.g. L001), emails',
    'Long Text': 'Long notes / descriptions',
    'Number': 'Whole or decimal numbers',
    'Date/Time': 'Dates and times',
    'Currency': 'Money (£) — for CourseCost, price etc.',
    'AutoNumber': 'Auto-increments — great for primary keys',
    'Yes/No': 'Checkbox (e.g. Completed? Withdrawn?)',
    'Lookup Wizard…': 'A drop-down linked to another table'
  };

  /* ════════════ SAT Loading (starter templates) ════════════ */
  function starterTemplate(kind) {
    if (kind === 'college') {
      return {
        tables: {
          Learner: {
            fields: [
              { name: 'LearnerID', type: 'Short Text', pk: true, size: 8 },
              { name: 'LearnerForename', type: 'Short Text', pk: false, size: 30 },
              { name: 'LearnerSurname', type: 'Short Text', pk: false, size: 30 },
              { name: 'LearnerTown', type: 'Short Text', pk: false, size: 30 },
              { name: 'LearnerEmail', type: 'Short Text', pk: false, size: 50 }
            ],
            rows: [
              { LearnerID: 'L001', LearnerForename: 'Aaliyah', LearnerSurname: 'Bennett', LearnerTown: 'Newgate', LearnerEmail: 'a.bennett@email.com' },
              { LearnerID: 'L002', LearnerForename: 'Aaron', LearnerSurname: 'Sharp', LearnerTown: 'Fallowend', LearnerEmail: 'a.sharp@email.com' },
              { LearnerID: 'L003', LearnerForename: 'Amelia', LearnerSurname: 'Foster', LearnerTown: 'Hazelthorpe', LearnerEmail: 'a.foster@email.com' }
            ]
          },
          Course: {
            fields: [
              { name: 'CourseID', type: 'Short Text', pk: true, size: 12 },
              { name: 'CourseTitle', type: 'Short Text', pk: false, size: 50 },
              { name: 'CourseCost', type: 'Currency', pk: false },
              { name: 'CourseStartDate', type: 'Date/Time', pk: false }
            ],
            rows: [
              { CourseID: 'COU-001', CourseTitle: 'A-Level Certificate', CourseCost: 0, CourseStartDate: '05/09/2022' },
              { CourseID: 'COU-003', CourseTitle: 'Digital Marketing Apprenticeship', CourseCost: 1500, CourseStartDate: '05/09/2022' }
            ]
          },
          Subject: {
            fields: [
              { name: 'SubjectID', type: 'Short Text', pk: true, size: 10 },
              { name: 'Subject', type: 'Short Text', pk: false, size: 50 }
            ],
            rows: [
              { SubjectID: 'SUB-001', Subject: 'A-Level Chemistry' },
              { SubjectID: 'SUB-003', Subject: 'Apprenticeship Digital Marketing' }
            ]
          },
          Staff: {
            fields: [
              { name: 'StaffID', type: 'Short Text', pk: true, size: 6 },
              { name: 'StaffForename', type: 'Short Text', pk: false, size: 30 },
              { name: 'StaffSurname', type: 'Short Text', pk: false, size: 30 }
            ],
            rows: [
              { StaffID: 'S003', StaffForename: 'Rachel', StaffSurname: 'Lewis' },
              { StaffID: 'S004', StaffForename: 'David', StaffSurname: 'Green' }
            ]
          },
          Enrolment: {
            fields: [
              { name: 'EnrolmentID', type: 'Short Text', pk: true, size: 14 },
              { name: 'LearnerID', type: 'Short Text', pk: false, size: 8 },
              { name: 'CourseID', type: 'Short Text', pk: false, size: 12 },
              { name: 'StaffID', type: 'Short Text', pk: false, size: 6 },
              { name: 'TargetGrade', type: 'Short Text', pk: false, size: 10 },
              { name: 'ActualGrade', type: 'Short Text', pk: false, size: 10 }
            ],
            rows: [
              { EnrolmentID: 'ENR-000001', LearnerID: 'L001', CourseID: 'COU-001', StaffID: 'S003', TargetGrade: 'A', ActualGrade: '' },
              { EnrolmentID: 'ENR-000002', LearnerID: 'L002', CourseID: 'COU-001', StaffID: 'S003', TargetGrade: 'A*', ActualGrade: 'A' },
              { EnrolmentID: 'ENR-000003', LearnerID: 'L003', CourseID: 'COU-003', StaffID: 'S004', TargetGrade: 'Merit', ActualGrade: 'Merit' }
            ]
          }
        },
        relationships: [
          { from: { table: 'Learner', field: 'LearnerID' }, to: { table: 'Enrolment', field: 'LearnerID' }, type: '1-many', enforceRI: true },
          { from: { table: 'Course', field: 'CourseID' }, to: { table: 'Enrolment', field: 'CourseID' }, type: '1-many', enforceRI: true },
          { from: { table: 'Staff', field: 'StaffID' }, to: { table: 'Enrolment', field: 'StaffID' }, type: '1-many', enforceRI: true }
        ],
        queries: {}, forms: {}, reports: {}
      };
    }
    if (kind === 'library') {
      return {
        tables: {
          Student: {
            fields: [
              { name: 'StudentID', type: 'Short Text', pk: true, size: 8 },
              { name: 'StudentName', type: 'Short Text', pk: false, size: 50 },
              { name: 'TutorGroup', type: 'Short Text', pk: false, size: 10 }
            ],
            rows: [
              { StudentID: 'S001', StudentName: 'Priya Sharma', TutorGroup: '10A' },
              { StudentID: 'S002', StudentName: 'Leo Jones', TutorGroup: '10B' }
            ]
          },
          Book: {
            fields: [
              { name: 'BookID', type: 'Short Text', pk: true, size: 8 },
              { name: 'Title', type: 'Short Text', pk: false, size: 60 },
              { name: 'Author', type: 'Short Text', pk: false, size: 50 }
            ],
            rows: [
              { BookID: 'B001', Title: 'Of Mice and Men', Author: 'John Steinbeck' },
              { BookID: 'B002', Title: 'Frankenstein', Author: 'Mary Shelley' }
            ]
          },
          Loan: {
            fields: [
              { name: 'LoanID', type: 'Short Text', pk: true, size: 8 },
              { name: 'StudentID', type: 'Short Text', pk: false, size: 8 },
              { name: 'BookID', type: 'Short Text', pk: false, size: 8 },
              { name: 'LoanedDate', type: 'Date/Time', pk: false },
              { name: 'ReturnedDate', type: 'Date/Time', pk: false }
            ],
            rows: [
              { LoanID: 'LO001', StudentID: 'S001', BookID: 'B001', LoanedDate: '01/03/2026', ReturnedDate: '' },
              { LoanID: 'LO002', StudentID: 'S002', BookID: 'B002', LoanedDate: '02/03/2026', ReturnedDate: '' }
            ]
          }
        },
        relationships: [
          { from: { table: 'Student', field: 'StudentID' }, to: { table: 'Loan', field: 'StudentID' }, type: '1-many', enforceRI: true },
          { from: { table: 'Book', field: 'BookID' }, to: { table: 'Loan', field: 'BookID' }, type: '1-many', enforceRI: true }
        ],
        queries: {}, forms: {}, reports: {}
      };
    }
    return blankDb();
  }

  function loadTemplate(kind) {
    db = { ...starterTemplate(kind) };
    saveDb();
  }

  /* ════════════ Query engine (GUI grid → result) ════════════ */
  function pkName(table) {
    const t = db.tables[table];
    if (!t) return null;
    const f = t.fields.find(x => x.pk);
    return f ? f.name : (t.fields[0] ? t.fields[0].name : null);
  }

  function evalCriteria(val, crit) {
    // crit is a string like: A, "A", Like "B*", >0, >=#01/01/2020#, =7
    val = val == null ? '' : String(val);
    crit = String(crit || '').trim();
    if (crit === '' || crit === '*') return true;
    let m = crit.match(/^(>=|<=|<>|!=|>|<|=)\s*(.+)$/);
    if (m) {
      const op = m[1], rhs = m[2].trim();
      const rhsV = rhs.replace(/^["']|["']$/g, '');
      const num = Number(val), numR = Number(rhsV);
      if (op === '>') return num > numR;
      if (op === '<') return num < numR;
      if (op === '>=') return num >= numR;
      if (op === '<=') return num <= numR;
      if (op === '<>' || op === '!=') return val !== rhsV;
      if (op === '=') return String(val).toLowerCase() === rhsV.toLowerCase();
    }
    m = crit.match(/^like\s+(.+)$/i);
    if (m) {
      let pat = m[1].trim().replace(/^["']|["']$/g, '');
      if (pat.endsWith('*') && pat.startsWith('*')) return val.includes(pat.slice(1, -1));
      if (pat.startsWith('*')) return String(val).endsWith(pat.slice(1));
      if (pat.endsWith('*')) return String(val).startsWith(pat.slice(0, -1));
      return String(val).toLowerCase() === pat.toLowerCase();
    }
    // plain equals
    const v = crit.replace(/^["']|["']$/g, '');
    return String(val).toLowerCase() === v.toLowerCase();
  }

  function runQueryDef(def) {
    // def: { tables: [names], cols: [ {table, field, alias?, sort, criteria, show} ] }
    const tnames = def.tables.filter(t => db.tables[t]);
    if (!tnames.length) return { cols: [], rows: [], error: 'Add at least one table.' };
    // cartesian combine
    let rows = [{}];
    tnames.forEach(tn => {
      const t = db.tables[tn];
      const next = [];
      rows.forEach(base => {
        (t.rows || []).forEach(r => {
          next.push({ ...base, ['__' + tn]: r });
        });
      });
      rows = next;
    });
    // filter via criteria + join via relationships
    const out = [];
    rows.forEach(combo => {
      if (!def.cols.length) return;
      let ok = true;
      // join constraints
      db.relationships.forEach(rel => {
        if (!tnames.includes(rel.from.table) || !tnames.includes(rel.to.table)) return;
        const rowA = combo['__' + rel.from.table], rowB = combo['__' + rel.to.table];
        if (!rowA || !rowB) return;
        if (String(rowA[rel.from.field]) !== String(rowB[rel.to.field])) ok = false;
      });
      if (!ok) return;
      for (let i = 0; i < def.cols.length; i++) {
        const c = def.cols[i];
        const row = combo['__' + c.table];
        if (!row) { ok = false; break; }
        if (c.criteria) {
          if (!evalCriteria(row[c.field], c.criteria)) { ok = false; break; }
        }
      }
      if (ok) {
        const rec = {};
        def.cols.forEach(c => { rec[c.alias || c.field] = combo['__' + c.table] ? combo['__' + c.table][c.field] : ''; });
        out.push(rec);
      }
    });
    // sort
    const sortCol = def.cols.find(c => c.sort);
    if (sortCol) {
      const key = sortCol.alias || sortCol.field;
      out.sort((a, b) => {
        const va = String(a[key] == null ? '' : a[key]).toLowerCase();
        const vb = String(b[key] == null ? '' : b[key]).toLowerCase();
        return sortCol.sort === 'Descending' ? (vb < va ? -1 : vb > va ? 1 : 0) : (va < vb ? -1 : va > vb ? 1 : 0);
      });
    }
    const cols = def.cols.map(c => ({ label: c.alias || c.field }));
    return { cols, rows: out, error: null };
  }

  /* ════════════ Render helpers ════════════ */
  const root = () => document.getElementById('access-sim-root');
  const work = () => document.getElementById('sim-work');
  const navList = () => document.getElementById('sim-nav-list');

  function renderNav() {
    const groups = [
      ['Tables', Object.keys(db.tables), 'table'],
      ['Queries', Object.keys(db.queries), 'query'],
      ['Forms', Object.keys(db.forms), 'form'],
      ['Reports', Object.keys(db.reports), 'report']
    ];
    const activeObj = ui.view === 'datasheet' || ui.view === 'tableDesign' ? ui.tableName
      : ui.view === 'queryDesign' || ui.view === 'queryResult' ? ui.queryName : null;
    let h = '';
    groups.forEach(([label, items, kind]) => {
      h += '<div class="sim-nav-group"><div class="sim-nav-group-hd">' + esc(label) + '</div>';
      if (!items.length) h += '<div class="sim-nav-empty">(empty)</div>';
      items.forEach(name => {
        const active = name === activeObj ? ' active' : '';
        h += '<button class="sim-nav-item' + active + '" data-kind="' + kind + '" data-name="' + esc(name) + '">'
          + '<span class="sim-nav-ic">' + (kind === 'table' ? '&#x1F5C4;' : kind === 'query' ? '&#x1F50D;' : kind === 'form' ? '&#x1F4DD;' : '&#x1F4C4;') + '</span>'
          + esc(name) + '</button>';
      });
      h += '</div>';
    });
    navList().innerHTML = h;
    navList().querySelectorAll('.sim-nav-item').forEach(b => {
      b.addEventListener('dblclick', () => openObject(b.dataset.kind, b.dataset.name));
      b.addEventListener('click', () => openObject(b.dataset.kind, b.dataset.name));
    });
  }

  function renderRibbon() {
    const tabs = ['Home', 'Create', 'External Data', 'Database Tools'];
    const activeTab = ui.ribbonTab || 'Home';
    document.getElementById('sim-ribbon-tabs').innerHTML = tabs.map(t =>
      '<button class="sim-ribbon-tab' + (t === activeTab ? ' active' : '') + '" data-rt="' + t + '">' + t + '</button>'
    ).join('');

    let groups;
    if (activeTab === 'Create') {
      groups = [
        { name: 'Tables', items: [
          { l: 'Table Design', ic: '&#x1F4CB;', f: () => newTableDesign() },
          { l: 'Table', ic: '&#x1F5C4;', f: () => newTableQuick() }
        ]},
        { name: 'Queries', items: [
          { l: 'Query Design', ic: '&#x1F50D;', f: () => newQueryDesign() },
          { l: 'Query Wizard', ic: '&#x2728;', f: () => newQueryWizard() }
        ]},
        { name: 'Forms', items: [
          { l: 'Form', ic: '&#x1F4DD;', f: () => newForm() },
          { l: 'Form Wizard', ic: '&#x2728;', f: () => newFormWizard() }
        ]},
        { name: 'Reports', items: [
          { l: 'Report', ic: '&#x1F4C4;', f: () => newReport() },
          { l: 'Report Wizard', ic: '&#x2728;', f: () => newReportWizard() }
        ]}
      ];
    } else {
      groups = [
        { name: 'Views', items: [
          { l: 'Design View', ic: '&#x1F527;', f: () => designView() },
          { l: 'Datasheet View', ic: '&#x1F5C4;', f: () => datasheetView() }
        ]},
        { name: 'Tools', items: [
          { l: 'Relationships', ic: '&#x1F517;', f: () => openRelationships() },
          { l: 'Primary Key', ic: '&#x1F511;', f: () => togglePk() }
        ]},
        { name: 'Records', items: [
          { l: 'Add record', ic: '&#x2795;', f: () => addRow() },
          { l: 'Save', ic: '&#x1F4BE;', f: () => saveCurrent() }
        ]}
      ];
    }
    document.getElementById('sim-ribbon-groups').innerHTML = groups.map(g =>
      '<div class="sim-ribbon-group"><div class="sim-ribbon-group-name">' + esc(g.name) + '</div><div class="sim-ribbon-btns">' +
      g.items.map(it => '<button class="sim-ribbon-btn" data-f="' + g.name + '::' + it.l + '"><span>' + it.ic + '</span><span>' + esc(it.l) + '</span></button>').join('') +
      '</div></div>'
    ).join('');

    document.getElementById('sim-ribbon-tabs').querySelectorAll('.sim-ribbon-tab').forEach(b => {
      b.addEventListener('click', () => { ui.ribbonTab = b.dataset.rt; renderRibbon(); });
    });
    document.querySelectorAll('.sim-ribbon-btn').forEach(b => {
      b.addEventListener('click', () => {
        const [g, l] = b.dataset.f.split('::');
        const grp = groups.find(x => x.name === g);
        const item = grp && grp.items.find(x => x.l === l);
        if (item) item.f();
      });
    });
  }

  function renderShell() {
    root().innerHTML =
      '<div class="sim-window">' +
        '<div class="sim-titlebar">' +
          '<span class="sim-app-icon">&#x1F5C4;&#xFE0F;</span>' +
          '<span class="sim-app-title">Access &mdash; <span id="sim-filename">CollegeEnrolments.accdb</span></span>' +
          '<span class="sim-titlebar-btns"><i>&#x2013;</i><i>&#x25A1;</i><i>&#x2715;</i></span>' +
        '</div>' +
        '<div class="sim-ribbon">' +
          '<div class="sim-ribbon-tabs" id="sim-ribbon-tabs"></div>' +
          '<div class="sim-ribbon-groups" id="sim-ribbon-groups"></div>' +
        '</div>' +
        '<div class="sim-body">' +
          '<div class="sim-nav" id="sim-nav">' +
            '<div class="sim-nav-hd">All Access Objects &#9660;</div>' +
            '<div class="sim-nav-list" id="sim-nav-list"></div>' +
          '</div>' +
          '<div class="sim-work" id="sim-work"></div>' +
        '</div>' +
        '<div class="sim-statusbar" id="sim-statusbar">Ready</div>' +
      '</div>';

    renderRibbon();
    renderNav();
    renderHome();
  }

  function status(msg) { document.getElementById('sim-statusbar').textContent = msg || 'Ready'; }

  /* ════════════ HOME ════════════ */
  function renderHome() {
    ui.view = 'home'; ui.tableName = null; ui.queryName = null;
    const tableCount = Object.keys(db.tables).length;
    work().innerHTML =
      '<div class="sim-home">' +
        '<h3 class="sim-home-h">Welcome to the Access Lab</h3>' +
        '<p>A simulated Microsoft Access \u2014 build your own database using the same <b>graphical tools</b> you\u2019ll use in the real assignment. Everything you make is saved automatically in this browser.</p>' +
        (tableCount ? '<div class="sim-home-progress">You already have <b>' + tableCount + ' table' + (tableCount === 1 ? '' : 's') + '</b>. Continue building from the steps below, or use the object list on the left to open what you\u2019ve made.</div>' : '') +
        '<div class="sim-home-cards">' +
          homeCard('1', 'Create tables', 'Use Design View to add fields, set data types and choose a primary key.', () => newTableDesign()) +
          homeCard('2', 'Link tables', 'Click a primary key, then the matching key in another table to create a relationship.', () => openRelationships()) +
          homeCard('3', 'Build queries', 'Pick tables and fields, add criteria and sort \u2014 then Run to see results.', () => newQueryDesign()) +
          homeCard('4', 'Design forms', 'A friendly data-entry screen for your table.', () => newForm()) +
          homeCard('5', 'Make reports', 'Printable output with your data.', () => newReport()) +
        '</div>' +
        '<div class="sim-home-templates">' +
          '<div class="sim-home-sub">New here? Load a ready-made example to explore:</div>' +
          '<div class="sim-home-tpl-row">' +
            '<button class="btn" id="sim-tpl-college">Load College Enrolment example</button>' +
            '<button class="btn" id="sim-tpl-library">Load Library Loans example</button>' +
            '<button class="btn btn-ghost" id="sim-tpl-blank">Start from blank</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    work().querySelector('#sim-tpl-college').onclick = () => { loadTemplate('college'); renderNav(); renderHome(); status('Loaded the College Enrolment example. Open a table from the list on the left.'); };
    work().querySelector('#sim-tpl-library').onclick = () => { loadTemplate('library'); renderNav(); renderHome(); status('Loaded the Library Loans example. Open a table from the list on the left.'); };
    work().querySelector('#sim-tpl-blank').onclick = () => { db = blankDb(); saveDb(); renderNav(); renderHome(); status('Started a blank database. Use "Create tables" to begin.'); };
  }
  function homeCard(ic, title, sub, fn) {
    return '<button class="sim-home-card"><span class="sim-home-card-ic">' + esc(ic) + '</span><span class="sim-home-card-t">' + esc(title) + '</span><span class="sim-home-card-s">' + esc(sub) + '</span></button>';
  }
  // attach handlers after render (home cards are plain buttons)
  function attachHomeHandlers() {
    const cards = work().querySelectorAll('.sim-home-card');
    const fns = [newTableDesign, openRelationships, newQueryDesign, newForm, newReport];
    cards.forEach((c, i) => c.addEventListener('click', fns[i]));
  }
  const _origRenderHome = renderHome;
  renderHome = function () {
    _origRenderHome();
    attachHomeHandlers();
  };

  /* ════════════ Table Design ════════════ */
  function newTableDesign() {
    openModal('New table', 'Enter a name for the new table:', (name) => {
      const clean = (name || '').trim();
      if (!clean) return;
      if (db.tables[clean]) { status('Table already exists.'); return; }
      db.tables[clean] = { fields: [], rows: [] };
      saveDb(); renderNav(); openTableDesign(clean);
    }
    , 'Table1');
  }
  function newTableQuick() {
    newTableDesign(); // reuse
  }
  function openTableDesign(name) {
    ui.view = 'tableDesign'; ui.tableName = name;
    const t = db.tables[name] || { fields: [], rows: [] };
    work().innerHTML =
      '<div class="sim-pane">' +
        '<div class="sim-pane-hd"><span>&#x1F527; ' + esc(name) + ' &mdash; Design View</span>' +
          '<button class="btn btn-small" id="sim-save-table">&#x1F4BE; Save</button>' +
          '<button class="btn btn-small btn-ghost" id="sim-add-field">&#x2795; Add field</button>' +
        '</div>' +
        '<table class="sim-design-grid"><thead><tr>' +
          '<th>Field Name</th><th>Data Type</th><th>Description <span class="muted">(optional)</span></th><th class="pk-col">&#x1F511;</th><th></th>' +
        '</tr></thead><tbody id="sim-design-body"></tbody></table>' +
        '<div class="sim-field-props" id="sim-field-props"></div>' +
      '</div>';

    function draw() {
      const body = document.getElementById('sim-design-body');
      const tt = db.tables[name];
      body.innerHTML = tt.fields.map((f, i) =>
        '<tr data-i="' + i + '" class="' + (ui.selectedField === i ? 'selected' : '') + '">' +
          '<td><input class="sim-cell" value="' + esc(f.name) + '" data-i="' + i + '" data-k="name"></td>' +
          '<td><select class="sim-cell" data-i="' + i + '" data-k="type">' + DATA_TYPES.map(dt => '<option' + (dt === f.type ? ' selected' : '') + '>' + dt + '</option>').join('') + '</select></td>' +
          '<td><input class="sim-cell" value="' + esc(f.desc || '') + '" placeholder="e.g. Unique learner identifier" data-i="' + i + '" data-k="desc"></td>' +
          '<td class="pk-col"><input type="checkbox" class="sim-pk" data-i="' + i + '"' + (f.pk ? ' checked' : '') + '></td>' +
          '<td><button class="sim-del-field" data-i="' + i + '" title="Delete field">&#x2715;</button></td>' +
        '</tr>'
      ).join('') +
      '<tr><td><button class="btn btn-ghost btn-small" id="sim-add-field-row">&#x2795; Type a field name here…</button></td><td></td><td></td><td></td><td></td></tr>';

      body.querySelectorAll('[data-k]').forEach(el => {
        const i = Number(el.dataset.i);
        el.addEventListener('input', () => {
          const f = db.tables[name].fields[i]; if (!f) return;
          const k = el.dataset.k;
          f[k] = el.value; saveDb();
          if (k === 'name') renderNav();
          if (f.type === 'Lookup Wizard…') runLookupWizard(name, f, () => { draw(); renderFieldProps(name); });
        });
        el.addEventListener('focus', () => { ui.selectedField = Number(el.dataset.i); draw(); renderFieldProps(name); });
      });
      body.querySelectorAll('.sim-pk').forEach(el => {
        el.addEventListener('change', () => {
          db.tables[name].fields.forEach((f, i) => { f.pk = (i === Number(el.dataset.i)); });
          saveDb(); draw();
        });
      });
      body.querySelectorAll('.sim-del-field').forEach(el => {
        el.addEventListener('click', () => {
          db.tables[name].fields.splice(Number(el.dataset.i), 1);
          saveDb(); draw();
        });
      });
      const addBtn = document.getElementById('sim-add-field-row');
      if (addBtn) addBtn.addEventListener('click', addBlankField);
    }
    function addBlankField() {
      db.tables[name].fields.push({ name: 'Field' + (db.tables[name].fields.length + 1), type: 'Short Text', pk: false });
      saveDb(); draw();
      const last = document.querySelectorAll('#sim-design-body [data-k=name]');
      if (last.length) { last[last.length - 1].focus(); last[last.length - 1].select(); }
    }
    document.getElementById('sim-add-field').onclick = addBlankField;
    document.getElementById('sim-save-table').onclick = () => { saveDb(); status('Saved ' + name + '.'); };
    draw();
    renderFieldProps(name);
  }

  function renderFieldProps(name) {
    const box = document.getElementById('sim-field-props');
    if (!box) return;
    const t = db.tables[name];
    const f = (ui.selectedField != null) ? t.fields[ui.selectedField] : null;
    if (!f) { box.innerHTML = '<div class="sim-props-empty">Select a field to edit its properties (Field Size, Format, Required, Validation…).</div>'; return; }
    const typeHint = TYPE_HINTS[f.type] || '';
    box.innerHTML =
      '<div class="sim-props-hd">Field properties &mdash; <b>' + esc(f.name) + '</b> <span class="muted">(' + esc(f.type) + ')</span></div>' +
      '<div class="sim-props-hint">' + esc(typeHint) + '</div>' +
      '<div class="sim-props-grid">' +
        '<label>Field Size<input class="sim-cell" data-p="size" value="' + esc(f.size || '') + '" placeholder="e.g. 50"></label>' +
        '<label>Required<select class="sim-cell" data-p="required"><option' + (f.required ? ' selected' : '') + '>No</option><option' + (f.required ? '' : ' selected') + '>Yes</option></select></label>' +
        '<label>Validation Rule<input class="sim-cell" data-p="rule" value="' + esc(f.rule || '') + '" placeholder="e.g. &gt;0"></label>' +
        '<label>Validation Text<input class="sim-cell" data-p="ruleText" value="' + esc(f.ruleText || '') + '" placeholder="Friendly error message"></label>' +
        '<label>Input Mask<input class="sim-cell" data-p="mask" value="' + esc(f.mask || '') + '" placeholder="e.g. LL00 0LL"></label>' +
        '<label>Default Value<input class="sim-cell" data-p="def" value="' + esc(f.def || '') + '"></label>' +
      '</div>';
    box.querySelectorAll('[data-p]').forEach(el => {
      el.addEventListener('input', () => {
        const p = el.dataset.p;
        if (p === 'required') { f.required = el.value === 'Yes'; }
        else if (p === 'ruleText') f.ruleText = el.value;
        else f[p] = el.value;
        saveDb();
      });
    });
  }

  function togglePk() {
    const name = ui.tableName;
    if (ui.view === 'tableDesign' && name && db.tables[name]) {
      const i = ui.selectedField;
      if (i == null) { status('Select a field first.'); return; }
      const already = db.tables[name].fields[i].pk;
      db.tables[name].fields.forEach((f, idx) => { f.pk = (idx === i && !already); });
      saveDb(); openTableDesign(name);
      status(already ? 'Primary key removed.' : db.tables[name].fields[i].name + ' set as primary key.');
    } else { status('Open a table in Design View first.'); }
  }

  /* ════════════ Lookup Wizard ════════════ */
  function runLookupWizard(table, field, done) {
    const sourceKeys = Object.keys(db.tables).filter(t => t !== table);
    if (!sourceKeys.length) { field.type = 'Short Text'; status('No other tables to look up — create another table first.'); done(); return; }
    const body =
      '<div class="sim-wiz">' +
      '<p class="sim-wiz-q">Which table should values be looked up from?</p>' +
      '<select id="sim-lk-table" class="sim-cell">' + sourceKeys.map(s => '<option>' + esc(s) + '</option>').join('') + '</select>' +
      '<button class="btn" id="sim-lk-next">Next &rarr;</button>' +
      '</div>';
    openModalRaw('Lookup Wizard', body, 'Cancel');
    const next = document.getElementById('sim-lk-next');
    next.onclick = () => {
      const src = document.getElementById('sim-lk-table').value;
      const srcT = db.tables[src];
      const dispF = srcT.fields.find(f => f.pk) || srcT.fields[1] || srcT.fields[0];
      field.lookup = { table: src, displayField: dispF ? dispF.name : null };
      field.type = 'Short Text';
      saveDb();
      closeModal(); done();
      status('Lookup to ' + src + ' (' + (dispF ? dispF.name : '') + ') configured.');
    };
  }

  /* ════════════ Datasheet View ════════════ */
  function datasheetView() {
    const name = ui.tableName;
    if (name && db.tables[name]) { openDatasheet(name); }
    else { status('Select a table first.'); }
  }
  function designView() {
    const name = ui.tableName;
    if (ui.view === 'datasheet' && name && db.tables[name]) { openTableDesign(name); }
    else if (name && db.tables[name]) openTableDesign(name);
    else status('Select a table first.');
  }
  function openDatasheet(name) {
    ui.view = 'datasheet'; ui.tableName = name;
    const t = db.tables[name];
    const fields = t.fields;
    work().innerHTML =
      '<div class="sim-pane">' +
        '<div class="sim-pane-hd"><span>&#x1F5C4; ' + esc(name) + ' &mdash; Datasheet View</span>' +
          '<button class="btn btn-small btn-ghost" id="sim-to-design">&#x1F527; Design View</button>' +
          '<button class="btn btn-small" id="sim-add-row">&#x2795; Add row</button>' +
        '</div>' +
        '<div class="sim-datasheet-wrap"><table class="sim-datasheet"><thead><tr>' +
        fields.map(f => '<th>' + esc(f.name) + (f.pk ? ' &#x1F511;' : '') + '</th>').join('') +
        '</tr></thead><tbody id="sim-data-body"></tbody></table></div>' +
        '<div class="sim-ds-foot"><span class="muted">Type directly into the bottom row to add records.</span></div>' +
      '</div>';

    function draw() {
      const body = document.getElementById('sim-data-body');
      const tt = db.tables[name];
      let h = tt.rows.map((r, ri) =>
        '<tr data-ri="' + ri + '">' + fields.map(f =>
          '<td><input class="sim-cell" value="' + esc(r[f.name] == null ? '' : r[f.name]) + '" data-ri="' + ri + '" data-f="' + esc(f.name) + '"></td>'
        ).join('') + '</tr>'
      ).join('');
      // blank row
      h += '<tr class="sim-new-row">' + fields.map(f =>
        '<td><input class="sim-cell sim-new-cell" placeholder="' + (f.pk ? 'Auto' : '') + '" data-f="' + esc(f.name) + '" data-new="1"></td>'
      ).join('') + '</tr>';
      body.innerHTML = h;

      body.querySelectorAll('[data-ri] input').forEach(el => {
        el.addEventListener('input', () => {
          const ri = Number(el.dataset.ri), fname = el.dataset.f;
          const row = db.tables[name].rows[ri];
          if (row && fields.find(f => f.name === fname)) row[fname] = el.value;
          const f = fields.find(x => x.name === fname);
          if (f && f.rule && el.value !== '' && !evalCriteria(el.value, '=' + f.rule)) {
            el.style.borderColor = 'var(--bad)';
          } else { el.style.borderColor = ''; }
          saveDb();
        });
      });
      body.querySelectorAll('.sim-new-cell').forEach(el => {
        el.addEventListener('input', () => {
          // create a row once the user types in the first cell
          const fname = el.dataset.f;
          const f = fields.find(x => x.name === fname);
          const row = {};
          fields.forEach(fld => { if (fld.name === fname) row[fld.name] = el.value; else row[fld.name] = ''; });
          db.tables[name].rows.push(row);
          saveDb();
          draw();
          // refocus same field, same value
          const inputs = document.querySelectorAll('#sim-data-body [data-f="' + fname + '"]');
          const target = inputs[inputs.length - 1];
          if (target) { target.focus(); target.setSelectionRange(target.value.length, target.value.length); }
        });
      });
    }
    draw();
    document.getElementById('sim-add-row').onclick = () => {
      const row = {}; fields.forEach(fld => row[fld.name] = '');
      db.tables[name].rows.push(row); saveDb(); draw();
    };
    document.getElementById('sim-to-design').onclick = () => openTableDesign(name);
  }

  function addRow() {
    const name = ui.tableName;
    if (ui.view === 'datasheet' && name && db.tables[name]) {
      const fields = db.tables[name].fields;
      const row = {}; fields.forEach(f => row[f.name] = '');
      db.tables[name].rows.push(row); saveDb(); openDatasheet(name);
    } else status('Open a table in Datasheet View first.');
  }

  /* ════════════ Relationships ════════════ */
  function openRelationships() {
    ui.view = 'relationships';
    ui.relSelected = null;
    const tnames = Object.keys(db.tables);
    work().innerHTML =
      '<div class="sim-pane">' +
        '<div class="sim-pane-hd"><span>&#x1F517; Relationships</span></div>' +
        '<div class="sim-rel-help"><b>How to link tables:</b> click a <b>primary key</b> (&#x1F511;) in one table, then click the matching <b>foreign key</b> in another table. Access draws the 1\u2192\u221E line and enforces referential integrity for you.</div>' +
        '<div class="sim-rel-canvas" id="sim-rel-canvas">' +
          (tnames.length ? '' : '<div class="sim-rel-empty">No tables yet \u2014 create a table first.</div>') +
        '</div>' +
      '</div>';

    tnames.forEach(tn => {
      const box = document.createElement('div');
      box.className = 'sim-rel-box';
      box.innerHTML = '<div class="sim-rel-box-hd">' + esc(tn) + '</div>' +
        db.tables[tn].fields.map(f =>
          '<div class="sim-rel-field' + (f.pk ? ' pk' : '') + '" data-table="' + esc(tn) + '" data-field="' + esc(f.name) + '" title="' + (f.pk ? 'Primary key' : 'Click a key first, then this field') + '">'
          + (f.pk ? '&#x1F511; ' : '') + esc(f.name) + '</div>'
        ).join('');
      box.querySelectorAll('.sim-rel-field').forEach(fd => {
        fd.addEventListener('click', () => {
          const tT = fd.dataset.table, tF = fd.dataset.field;
          if (!ui.relSelected) {
            // first selection — ideally a primary key
            ui.relSelected = { table: tT, field: tF };
            document.querySelectorAll('.sim-rel-field').forEach(x => x.classList.remove('sel'));
            fd.classList.add('sel');
            status('Selected ' + tT + '.' + tF + ' \u2014 now click the matching field in another table.');
            return;
          }
          const src = ui.relSelected;
          if (src.table === tT && src.field === tF) { // deselect
            ui.relSelected = null;
            document.querySelectorAll('.sim-rel-field').forEach(x => x.classList.remove('sel'));
            status('Ready.');
            return;
          }
          ui.relSelected = null;
          document.querySelectorAll('.sim-rel-field').forEach(x => x.classList.remove('sel'));
          createRelationship(src.table, src.field, tT, tF);
        });
      });
      document.getElementById('sim-rel-canvas').appendChild(box);
    });

    // draw lines
    drawRelationshipLines();
  }

  function drawRelationshipLines() {
    const canvas = document.getElementById('sim-rel-canvas');
    if (!canvas) return;
    // remove old svg
    const old = canvas.querySelector('svg.sim-rel-lines'); if (old) old.remove();
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('sim-rel-lines');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    canvas.appendChild(svg);
    db.relationships.forEach(rel => {
      const f1 = canvas.querySelector('.sim-rel-field[data-table="' + rel.from.table + '"][data-field="' + rel.from.field + '"]');
      const f2 = canvas.querySelector('.sim-rel-field[data-table="' + rel.to.table + '"][data-field="' + rel.to.field + '"]');
      if (!f1 || !f2) return;
      const r1 = f1.getBoundingClientRect(), r2 = f2.getBoundingClientRect();
      const cr = canvas.getBoundingClientRect();
      const x1 = r1.right - cr.left, y1 = r1.top + r1.height / 2 - cr.top;
      const x2 = r2.left - cr.left, y2 = r2.top + r2.height / 2 - cr.top;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + 50) + ' ' + y1 + ', ' + (x2 - 50) + ' ' + y2 + ', ' + x2 + ' ' + y2);
      line.setAttribute('stroke', 'var(--accent)'); line.setAttribute('stroke-width', '2'); line.setAttribute('fill', 'none');
      svg.appendChild(line);
      const one = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      one.setAttribute('x', x1 + 5); one.setAttribute('y', y1 - 5); one.setAttribute('fill', 'var(--accent)'); one.textContent = '1';
      const many = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      many.setAttribute('x', x2 - 12); many.setAttribute('y', y2 - 5); many.setAttribute('fill', 'var(--accent)'); many.textContent = '∞';
      svg.appendChild(one); svg.appendChild(many);
    });
  }

  function createRelationship(tA, fA, tB, fB) {
    // ensure tA field is the PK side (one), tB is many — if reversed, swap
    const fa = db.tables[tA].fields.find(f => f.name === fA);
    const fb = db.tables[tB].fields.find(f => f.name === fB);
    let from = { table: tA, field: fA }, to = { table: tB, field: fB };
    if (!fa || !fb) return;
    if (fb.pk && !fa.pk) { const tmp = from; from = to; to = tmp; }
    const exists = db.relationships.some(r => r.from.table === from.table && r.from.field === from.field && r.to.table === to.table && r.to.field === to.field);
    if (exists) { status('Relationship already exists.'); return; }
    openModalRaw('Edit Relationships',
      '<div class="sim-wiz"><p>Create a relationship between <b>' + esc(from.table) + '.' + esc(from.field) + '</b> (one) and <b>' + esc(to.table) + '.' + esc(to.field) + '</b> (many).</p>' +
      '<label class="sim-check"><input type="checkbox" id="sim-enforce" checked> Enforce Referential Integrity</label>' +
      '<button class="btn" id="sim-rel-create">Create</button></div>', 'Create');
    document.getElementById('sim-rel-create').onclick = () => {
      const enforce = document.getElementById('sim-enforce').checked;
      db.relationships.push({ from, to, type: '1-many', enforceRI: enforce });
      saveDb(); closeModal();
      openRelationships();
      status('Relationship created between ' + from.table + ' and ' + to.table + '.');
    };
  }

  /* ════════════ Query Design ════════════ */
  function newQueryDesign() {
    openQueryWizard(false);
  }
  function newQueryWizard() {
    openQueryWizard(true);
  }
  function openQueryWizard(wizard) {
    const tnames = Object.keys(db.tables);
    if (!tnames.length) { status('Create a table before building a query.'); return; }
    const body =
      '<div class="sim-wiz">' +
      '<p class="sim-wiz-q">' + (wizard ? 'Query Wizard — ' : '') + 'Which table(s) should this query use?</p>' +
      '<div class="sim-wiz-tables">' + tnames.map(t => '<label class="sim-check"><input type="checkbox" value="' + esc(t) + '"> ' + esc(t) + '</label>').join('') + '</div>' +
      '<label class="sim-wiz-lbl">Query name <input id="sim-qname" class="sim-cell" placeholder="e.g. qryLearners"></label>' +
      '<button class="btn" id="sim-qnext">Next &rarr;</button></div>';
    openModalRaw(wizard ? 'Query Wizard' : 'Query Design', body, 'Cancel');
    document.getElementById('sim-qnext').onclick = () => {
      const sel = Array.from(document.querySelectorAll('.sim-wiz-tables input:checked')).map(i => i.value);
      if (!sel.length) { status('Select at least one table.'); return; }
      const qname = (document.getElementById('sim-qname').value || '').trim() || 'Query' + (Object.keys(db.queries).length + 1);
      db.queries[qname] = { tables: sel, cols: [] };
      saveDb(); closeModal();
      openQueryDesign(qname, wizard);
    };
  }

  function openQueryDesign(qname, wizard) {
    ui.view = 'queryDesign'; ui.queryName = qname;
    const q = db.queries[qname] || { tables: [], cols: [] };
    work().innerHTML =
      '<div class="sim-pane">' +
        '<div class="sim-pane-hd"><span>&#x1F50D; ' + esc(qname) + ' &mdash; Query Design</span>' +
          '<button class="btn" id="sim-qrun">&#x25B6; Run</button>' +
        '</div>' +
        '<div class="sim-qd-tables" id="sim-qd-tables"></div>' +
        '<div class="sim-qd-grid-wrap"><table class="sim-qd-grid"><thead><tr>' +
          '<th>Field</th><th>Table</th><th>Sort</th><th>Criteria</th><th>Show</th><th></th>' +
        '</tr></thead><tbody id="sim-qd-body"></tbody></table></div>' +
        '<div class="sim-qd-add-row"><select id="sim-qd-add-field" class="sim-cell"><option>Add a field…</option></select></div>' +
      '</div>';

    function allFields() {
      const map = [];
      (q.tables || []).forEach(tn => {
        const t = db.tables[tn];
        if (!t) return;
        (t.fields || []).forEach(f => map.push({ table: tn, field: f.name, label: tn + '.' + f.name }));
      });
      return map;
    }
    // table boxes
    document.getElementById('sim-qd-tables').innerHTML = (q.tables || []).map(tn => {
      const t = db.tables[tn];
      return '<div class="sim-qd-table-box"><div class="sim-qd-tb-hd">' + esc(tn) + '</div>' +
        (t ? t.fields.map(f => '<div class="sim-qd-tf' + (f.pk ? ' pk' : '') + '">' + (f.pk ? '&#x1F511; ' : '') + esc(f.name) + '</div>').join('') : '') + '</div>';
    }).join('');

    function draw() {
      const body = document.getElementById('sim-qd-body');
      const fields = allFields();
      body.innerHTML = (q.cols || []).map((c, i) =>
        '<tr data-i="' + i + '">' +
          '<td><select class="sim-cell" data-k="fieldSet"><option value="' + esc(c.table) + '.' + esc(c.field) + '" selected>' + esc(c.table) + '.' + esc(c.field) + '</option></select></td>' +
          '<td>' + esc(c.table) + '</td>' +
          '<td><select class="sim-cell" data-k="sort"><option></option><option' + (c.sort === 'Ascending' ? ' selected' : '') + '>Ascending</option><option' + (c.sort === 'Descending' ? ' selected' : '') + '>Descending</option></select></td>' +
          '<td><input class="sim-cell" value="' + esc(c.criteria || '') + '" placeholder="e.g. &quot;COU-001&quot; or Like &quot;B*&quot;" data-k="criteria"></td>' +
          '<td><input type="checkbox" class="sim-cell" ' + (c.show === false ? '' : 'checked') + ' data-k="show"></td>' +
          '<td><button class="sim-del-field" data-k="del">&#x2715;</button></td>' +
        '</tr>'
      ).join('');

      body.querySelectorAll('[data-k=sort]').forEach(el => {
        el.addEventListener('change', () => { q.cols[Number(el.closest('tr').dataset.i)].sort = el.value || null; saveDb(); });
      });
      body.querySelectorAll('[data-k=criteria]').forEach(el => {
        el.addEventListener('input', () => { q.cols[Number(el.closest('tr').dataset.i)].criteria = el.value; saveDb(); });
      });
      body.querySelectorAll('[data-k=show]').forEach(el => {
        el.addEventListener('change', () => { q.cols[Number(el.closest('tr').dataset.i)].show = el.checked; saveDb(); });
      });
      body.querySelectorAll('[data-k=del]').forEach(el => {
        el.addEventListener('click', () => { q.cols.splice(Number(el.closest('tr').dataset.i), 1); saveDb(); draw(); });
      });

      // populate add-field select
      const sel = document.getElementById('sim-qd-add-field');
      const prior = new Set(sel.querySelectorAll('option:not([value=""])'));
      sel.innerHTML = '<option value="">Add a field…</option>' + fields.map(f => '<option value="' + esc(f.table) + '.' + esc(f.field) + '">' + esc(f.label) + '</option>').join('');
    }
    draw();
    document.getElementById('sim-qd-add-field').addEventListener('change', (e) => {
      const v = e.target.value; if (!v) return;
      const [table, field] = v.split('.');
      q.cols.push({ table, field, alias: null, sort: null, criteria: '', show: true });
      saveDb(); draw();
      status('Added ' + v + ' to the query grid.');
    });
    document.getElementById('sim-qrun').onclick = () => runQuery(qname);
  }

  function runQuery(qname) {
    const q = db.queries[qname];
    if (!q || !(q.cols || []).length) { status('Add at least one field to the query grid.'); return; }
    const res = runQueryDef({ tables: q.tables, cols: q.cols });
    ui.view = 'queryResult';
    work().innerHTML =
      '<div class="sim-pane">' +
        '<div class="sim-pane-hd"><span>&#x1F50D; ' + esc(qname) + ' &mdash; Result (' + res.rows.length + ' rows)</span>' +
          '<button class="btn btn-small btn-ghost" id="sim-q-back">&#x1F527; Design</button>' +
        '</div>' +
        (res.error ? '<div class="sim-error">' + esc(res.error) + '</div>' :
          '<div class="sim-datasheet-wrap"><table class="sim-datasheet"><thead><tr>' +
          res.cols.map(c => '<th>' + esc(c.label) + '</th>').join('') + '</tr></thead><tbody>' +
          res.rows.map(r => '<tr>' + res.cols.map(c => '<td>' + esc(r[c.label]) + '</td>').join('') + '</tr>').join('') +
          (res.rows.length ? '' : '<tr><td colspan="' + res.cols.length + '" class="muted">No results match the criteria.</td></tr>') +
          '</tbody></table></div>') +
      '</div>';
    document.getElementById('sim-q-back').onclick = () => openQueryDesign(qname, false);
  }

  /* ════════════ Forms ════════════ */
  function newForm() { formWizard(false); }
  function newFormWizard() { formWizard(true); }
  function formWizard(wizard) {
    const tnames = Object.keys(db.tables);
    if (!tnames.length) { status('Create a table first.'); return; }
    const auto = tnames[0];
    if (!wizard && db.tables[auto]) {
      openModalRaw('New form',
        '<div class="sim-wiz"><p class="sim-wiz-q">Create a form from which table?</p>' +
        '<select id="sim-fmt" class="sim-cell">' + tnames.map(t => '<option>' + esc(t) + '</option>').join('') + '</select>' +
        '<label class="sim-wiz-lbl">Form name <input id="sim-fname" class="sim-cell" placeholder="frm' + esc(auto) + '"></label>' +
        '<button class="btn" id="sim-fnext">Create</button></div>', 'Create');
      document.getElementById('sim-fnext').onclick = () => {
        const tn = document.getElementById('sim-fmt').value;
        const fn = (document.getElementById('sim-fname').value || '').trim() || 'frm' + tn;
        db.forms[fn] = { table: tn, layout: 'single' };
        saveDb(); closeModal(); renderNav(); openForm(fn);
      };
      return;
    }
    // wizard: multi-step-ish (single page)
    openModalRaw('Form Wizard',
      '<div class="sim-wiz"><p class="sim-wiz-q">Step 1 — choose the table:</p>' +
      '<select id="sim-fmt" class="sim-cell">' + tnames.map(t => '<option>' + esc(t) + '</option>').join('') + '</select>' +
      '<button class="btn" id="sim-fnext">Finish</button></div>', 'Finish');
    document.getElementById('sim-fnext').onclick = () => {
      const tn = document.getElementById('sim-fmt').value;
      const fn = 'frm' + tn;
      db.forms[fn] = { table: tn, layout: 'single' };
      saveDb(); closeModal(); renderNav(); openForm(fn);
    };
  }
  function openForm(fn) {
    ui.view = 'form'; ui.tableName = null; ui.queryName = null;
    const f = db.forms[fn];
    const t = db.tables[f.table];
    work().innerHTML =
      '<div class="sim-pane">' +
        '<div class="sim-pane-hd"><span>&#x1F4DD; ' + esc(fn) + ' &mdash; Form View</span>' +
          '<button class="btn btn-small" id="sim-f-add">&#x2795; New record</button>' +
        '</div>' +
        '<div class="sim-form">' +
          '<div class="sim-form-title">' + esc(f.table) + '</div>' +
          t.fields.map(fl =>
            '<label class="sim-form-field"><span>' + esc(fl.name) + (fl.pk ? ' &#x1F511;' : '') + '</span><input class="sim-cell" data-f="' + esc(fl.name) + '" placeholder="' + (fl.pk ? 'Auto' : '') + '"></label>'
          ).join('') +
          '<div class="sim-form-actions"><button class="btn" id="sim-f-save">Save record</button></div>' +
        '</div>' +
      '</div>';
    document.getElementById('sim-f-add').onclick = () => { const r = {}; t.fields.forEach(fl => r[fl.name] = ''); t.rows.push(r); saveDb(); status('New blank record.'); };
    document.getElementById('sim-f-save').onclick = () => {
      const row = {};
      t.fields.forEach(fl => { const el = document.querySelector('#sim-work [data-f="' + fl.name + '"]'); row[fl.name] = el ? el.value : ''; });
      t.rows.push(row); saveDb();
      status('Record saved to ' + f.table + '.');
    };
  }

  /* ════════════ Reports ════════════ */
  function newReport() { reportWizard(false); }
  function newReportWizard() { reportWizard(true); }
  function reportWizard(wizard) {
    const tnames = Object.keys(db.tables);
    if (!tnames.length) { status('Create a table first.'); return; }
    openModalRaw(wizard ? 'Report Wizard' : 'New report',
      '<div class="sim-wiz"><p class="sim-wiz-q">Report from which table?</p>' +
      '<select id="sim-fmt" class="sim-cell">' + tnames.map(t => '<option>' + esc(t) + '</option>').join('') + '</select>' +
      '<label class="sim-wiz-lbl">Report name <input id="sim-fname" class="sim-cell" placeholder="rpt' + esc(tnames[0]) + '"></label>' +
      '<button class="btn" id="sim-fnext">Create</button></div>', 'Create');
    document.getElementById('sim-fnext').onclick = () => {
      const tn = document.getElementById('sim-fmt').value;
      const rn = (document.getElementById('sim-fname').value || '').trim() || 'rpt' + tn;
      db.reports[rn] = { table: tn, groupBy: null };
      saveDb(); closeModal(); renderNav(); openReport(rn);
    };
  }
  function openReport(rn) {
    ui.view = 'report'; ui.tableName = null; ui.queryName = null;
    const r = db.reports[rn];
    const t = db.tables[r.table];
    const fields = t.fields;
    work().innerHTML =
      '<div class="sim-pane">' +
        '<div class="sim-pane-hd"><span>&#x1F4C4; ' + esc(rn) + ' &mdash; Report Preview</span>' +
          '<button class="btn btn-small btn-ghost" id="sim-r-print">&#x1F5A8; Print view</button>' +
        '</div>' +
        '<div class="sim-report">' +
          '<div class="sim-report-h">' + esc(rn) + '</div>' +
          '<div class="sim-report-sub">Generated ' + new Date().toLocaleDateString('en-GB') + ' &middot; ' + t.rows.length + ' record(s)</div>' +
          '<table class="sim-report-table"><thead><tr>' + fields.map(fl => '<th>' + esc(fl.name) + '</th>').join('') + '</tr></thead><tbody>' +
          t.rows.map(row => '<tr>' + fields.map(fl => '<td>' + esc(row[fl.name]) + '</td>').join('') + '</tr>').join('') +
          '</tbody></table>' +
        '</div>' +
      '</div>';
    document.getElementById('sim-r-print').onclick = () => window.print();
  }

  /* ════════════ Object opening ════════════ */
  function openObject(kind, name) {
    if (kind === 'table') openDatasheet(name);
    else if (kind === 'query') runQuery(name);
    else if (kind === 'form') openForm(name);
    else if (kind === 'report') openReport(name);
  }

  /* ════════════ Ribbon "Save current" ════════════ */
  function saveCurrent() { saveDb(); status('Database saved.'); }

  /* ════════════ Modal ════════════ */
  function openModal(title, prompt, onOk, defVal) {
    const body = '<div class="sim-wiz"><p class="sim-wiz-q">' + esc(prompt) + '</p>' +
      '<input id="sim-modal-input" class="sim-cell" value="' + esc(defVal || '') + '">' +
      '<div class="sim-wiz-actions"><button class="btn btn-ghost" id="sim-modal-cancel">Cancel</button><button class="btn" id="sim-modal-ok">OK</button></div></div>';
    openModalRaw(title, body, 'OK');
    const input = document.getElementById('sim-modal-input');
    input.focus(); input.select();
    document.getElementById('sim-modal-ok').onclick = () => { const v = input.value; closeModal(); onOk(v); };
    document.getElementById('sim-modal-cancel').onclick = closeModal;
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const v = input.value; closeModal(); onOk(v); } });
  }
  function openModalRaw(title, bodyHtml, okText) {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'sim-modal-overlay';
    overlay.innerHTML = '<div class="sim-modal"><div class="sim-modal-hd">' + esc(title) + '<button class="sim-modal-x" id="sim-modal-x">&#x2715;</button></div><div class="sim-modal-bd">' + bodyHtml + '</div></div>';
    document.body.appendChild(overlay);
    document.getElementById('sim-modal-x').onclick = closeModal;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  }
  function closeModal() {
    const o = document.querySelector('.sim-modal-overlay');
    if (o) o.remove();
  }

  /* ════════════ Init ════════════ */
  window.initAccessSim = function () {
    renderShell();
    status('Welcome to the Access Lab — a simulated Microsoft Access.');
  };
})();