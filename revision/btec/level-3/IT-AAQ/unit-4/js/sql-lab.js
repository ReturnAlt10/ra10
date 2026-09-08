/* BTEC IT Unit 4 — SQL Lab
   A self-contained, in-browser SQL playground with a tiny SQL interpreter
   (SELECT / INSERT / UPDATE / DELETE / CREATE TABLE / ORDER BY / WHERE with
   AND/OR and basic operators) running against an in-memory college enrolment database. */
(function () {
  'use strict';

  // ── Initial database (college enrolment scenario — mirrors the real Unit 4 style) ──
  const SCHEMA = {
    Learner: [
      { name: 'LearnerID', type: 'TEXT', pk: true },
      { name: 'LearnerForename', type: 'TEXT' },
      { name: 'LearnerSurname', type: 'TEXT' },
      { name: 'LearnerTown', type: 'TEXT' }
    ],
    Subject: [
      { name: 'SubjectID', type: 'TEXT', pk: true },
      { name: 'Subject', type: 'TEXT' }
    ],
    Staff: [
      { name: 'StaffID', type: 'TEXT', pk: true },
      { name: 'StaffForename', type: 'TEXT' },
      { name: 'StaffSurname', type: 'TEXT' }
    ],
    Course: [
      { name: 'CourseID', type: 'TEXT', pk: true },
      { name: 'CourseStartDate', type: 'DATE' },
      { name: 'CourseEndDate', type: 'DATE' },
      { name: 'SubjectID', type: 'TEXT', fk: 'Subject.SubjectID' }
    ],
    Enrolment: [
      { name: 'EnrolmentID', type: 'TEXT', pk: true },
      { name: 'LearnerID', type: 'TEXT', fk: 'Learner.LearnerID' },
      { name: 'CourseID', type: 'TEXT', fk: 'Course.CourseID' },
      { name: 'StaffID', type: 'TEXT', fk: 'Staff.StaffID' },
      { name: 'TargetGrade', type: 'TEXT' },
      { name: 'ActualGrade', type: 'TEXT' }
    ]
  };

  let db = {};

  function resetDb() {
    db = {
      Learner: [
        { LearnerID: 'L001', LearnerForename: 'Aaliyah', LearnerSurname: 'Bennett', LearnerTown: 'Newgate' },
        { LearnerID: 'L002', LearnerForename: 'Aaron', LearnerSurname: 'Sharp', LearnerTown: 'Fallowend' },
        { LearnerID: 'L003', LearnerForename: 'Amelia', LearnerSurname: 'Foster', LearnerTown: 'Hazelthorpe' },
        { LearnerID: 'L004', LearnerForename: 'Caleb', LearnerSurname: 'Morton', LearnerTown: 'Rowbury' },
        { LearnerID: 'L005', LearnerForename: 'Chloe', LearnerSurname: 'Brooks', LearnerTown: 'Larchfield' }
      ],
      Subject: [
        { SubjectID: 'SUB-001', Subject: 'A-Level Chemistry' },
        { SubjectID: 'SUB-002', Subject: 'A-Level History' },
        { SubjectID: 'SUB-003', Subject: 'Apprenticeship Digital Marketing' }
      ],
      Staff: [
        { StaffID: 'S003', StaffForename: 'Rachel', StaffSurname: 'Lewis' },
        { StaffID: 'S004', StaffForename: 'David', StaffSurname: 'Green' },
        { StaffID: 'S002', StaffForename: 'James', StaffSurname: 'Yates' }
      ],
      Course: [
        { CourseID: 'COU-001', CourseStartDate: '2022-09-05', CourseEndDate: '2024-06-20', SubjectID: 'SUB-001' },
        { CourseID: 'COU-002', CourseStartDate: '2022-09-05', CourseEndDate: '2024-06-20', SubjectID: 'SUB-002' },
        { CourseID: 'COU-003', CourseStartDate: '2022-09-06', CourseEndDate: '2024-03-13', SubjectID: 'SUB-003' }
      ],
      Enrolment: [
        { EnrolmentID: 'ENR-000001', LearnerID: 'L001', CourseID: 'COU-001', StaffID: 'S003', TargetGrade: 'A', ActualGrade: '' },
        { EnrolmentID: 'ENR-000002', LearnerID: 'L002', CourseID: 'COU-001', StaffID: 'S003', TargetGrade: 'A*', ActualGrade: 'A' },
        { EnrolmentID: 'ENR-000034', LearnerID: 'L003', CourseID: 'COU-003', StaffID: 'S002', TargetGrade: 'Merit', ActualGrade: 'Merit' },
        { EnrolmentID: 'ENR-000003', LearnerID: 'L004', CourseID: 'COU-001', StaffID: 'S003', TargetGrade: 'B', ActualGrade: 'B' },
        { EnrolmentID: 'ENR-000018', LearnerID: 'L005', CourseID: 'COU-002', StaffID: 'S004', TargetGrade: 'B', ActualGrade: 'B' },
        { EnrolmentID: 'ENR-000015', LearnerID: 'L001', CourseID: 'COU-002', StaffID: 'S004', TargetGrade: 'B', ActualGrade: '' }
      ]
    };
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  /* ── Tiny SQL interpreter ───────────────────────────────── */
  function sqlError(msg) { const e = new Error(msg); e.isSql = true; return e; }

  function runStatement(sql) {
    const s = sql.trim().replace(/;\s*$/, '');
    const up = s.toUpperCase();
    if (up.indexOf('SELECT') === 0) return runSelect(s);
    if (up.indexOf('INSERT') === 0) return runInsert(s);
    if (up.indexOf('UPDATE') === 0) return runUpdate(s);
    if (up.indexOf('DELETE') === 0) return runDelete(s);
    if (up.indexOf('CREATE TABLE') === 0) return runCreate(s);
    throw sqlError('Only SELECT, INSERT, UPDATE, DELETE and CREATE TABLE are supported in the Lab.');
  }

  function columnsOf(table) {
    if (!db[table]) throw sqlError('Table "' + table + '" does not exist.');
    return Object.keys(db[table][0] || {});
  }

  // parse a WHERE clause into a predicate function
  function parseWhere(whereStr) {
    if (!whereStr) return function () { return true; };
    // split on top-level AND / OR
    const clauses = splitLogical(whereStr);
    return function (row) {
      // evaluate: all ANDs must pass, ORs handled by grouping
      return evalWhereGroup(row, clauses);
    };
  }

  function splitLogical(s) {
    // naive split into tokens [expr, op, expr, op, ...]
    const out = [];
    let cur = '';
    let i = 0;
    while (i < s.length) {
      const rest = s.slice(i).toUpperCase();
      if (rest.indexOf(' AND ') === 0) { out.push(cur.trim()); out.push('AND'); cur = ''; i += 5; }
      else if (rest.indexOf(' OR ') === 0) { out.push(cur.trim()); out.push('OR'); cur = ''; i += 4; }
      else { cur += s[i]; i++; }
    }
    out.push(cur.trim());
    return out;
  }

  function evalWhereGroup(row, tokens) {
    if (!tokens.length) return true;
    // evaluate left-to-right with AND precedence over OR (simple)
    let result = true;
    let pendingOr = false;
    let acc = true;
    let i = 0;
    // We'll do a simple evaluator: split into OR-separated groups of AND-clauses
    const groups = [];
    let curGroup = [];
    tokens.forEach(function (tk) {
      if (tk === 'OR') { groups.push(curGroup); curGroup = []; }
      else if (tk !== 'AND') curGroup.push(tk);
    });
    groups.push(curGroup);
    // any group (AND within) true => whole true
    for (let g = 0; g < groups.length; g++) {
      const andClauses = groups[g];
      let allTrue = true;
      for (let c = 0; c < andClauses.length; c++) {
        if (!evalCondition(row, andClauses[c])) { allTrue = false; break; }
      }
      if (allTrue) return true;
    }
    return false;
  }

  function evalCondition(row, cond) {
    // cond like:  CourseID = 'COU-001'   or  LearnerSurname = 'Bennett'  or  TargetGrade = 'A'  or  Enrolment.LearnerID = Learner.LearnerID
    const m = cond.match(/^\s*([A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?)\s*(=|!=|<>|>=|<=|>|<|LIKE)\s*(.+?)\s*$/i);
    if (!m) throw sqlError('Cannot parse condition: ' + cond);
    const colRef = m[1];
    const op = m[3].toUpperCase();
    let valRaw = m[4].trim();

    // If the right-hand side is another column (join), resolve its value from the row.
    let val;
    const colMatch = valRaw.match(/^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?$/);
    if (colMatch && row[valRaw] !== undefined && typeof row[valRaw] !== 'number') {
      val = row[valRaw];
    } else if (colMatch && typeof row[valRaw] === 'number') {
      val = row[valRaw];
    } else if ((valRaw[0] === "'" && valRaw[valRaw.length - 1] === "'") || (valRaw[0] === '"' && valRaw[valRaw.length - 1] === '"')) {
      val = valRaw.slice(1, -1);
    } else if (!isNaN(Number(valRaw))) {
      val = Number(valRaw);
    } else {
      val = valRaw;
    }

    const lv = row[colRef];
    switch (op) {
      case '=': return String(lv) === String(val);
      case '!=': case '<>': return String(lv) !== String(val);
      case '>': return Number(lv) > Number(val);
      case '<': return Number(lv) < Number(val);
      case '>=': return Number(lv) >= Number(val);
      case '<=': return Number(lv) <= Number(val);
      case 'LIKE': {
        const pattern = String(val).replace(/%/g, '.*').replace(/_/g, '.');
        return new RegExp('^' + pattern + '$', 'i').test(String(lv));
      }
      default: throw sqlError('Unsupported operator: ' + op);
    }
  }

  function runSelect(s) {
    // SELECT cols FROM table1[, table2 ...] [WHERE ...] [ORDER BY col [ASC|DESC]]
    // Supports simple SELECT with optional cross-join (multiple FROM tables) and
    // table-qualified columns (Table.col) in the WHERE clause.
    const fromM = s.match(/^SELECT\s+(.+?)\s+FROM\s+(.+?)\s*(?:WHERE\s+(.+?))?\s*(?:ORDER\s+BY\s+(.+?))?\s*$/i);
    if (!fromM) throw sqlError('SELECT must be: SELECT cols FROM table [WHERE cond] [ORDER BY col]');
    const colsRaw = fromM[1].trim();
    const tablesRaw = fromM[2].trim();
    const where = fromM[3];
    const orderRaw = fromM[4];

    // Parse FROM list (comma-separated, but not splitting qualified col names since those are in cols)
    const tables = tablesRaw.split(',').map(function (t) { return t.trim(); });
    tables.forEach(function (t) { if (!db[t]) throw sqlError('Table "' + t + '" does not exist.'); });

    // Build combined row space (cartesian product for a join)
    let rows = combine(tables);

    // column selection
    let cols;
    if (colsRaw.trim() === '*') {
      cols = [];
      tables.forEach(function (t) { columnsOf(t).forEach(function (c) { cols.push(c); }); });
    } else {
      cols = colsRaw.split(',').map(function (c) { return c.trim(); });
    }

    // WHERE predicate supports table-qualified columns (Member.MemberID)
    const pred = parseWhere(where);
    rows = rows.filter(pred);

    // ORDER BY — support "Table.col" or plain col, with optional ASC/DESC
    let orderCol = null, orderDir = 'ASC';
    if (orderRaw) {
      const om = orderRaw.trim().match(/^\s*(.+?)(?:\s+(ASC|DESC))?\s*$/i);
      orderCol = om[1].trim();
      orderDir = (om[2] || 'ASC').toUpperCase();
    }
    if (orderCol) {
      const sortKey = stripQualifier(orderCol);
      rows = rows.slice().sort(function (a, b) {
        if (a[sortKey] < b[sortKey]) return orderDir === 'ASC' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return orderDir === 'ASC' ? 1 : -1;
        return 0;
      });
    }
    return { type: 'select', table: tables[0], cols: cols, rows: rows };
  }

  function stripQualifier(col) {
    const i = col.lastIndexOf('.');
    return i >= 0 ? col.slice(i + 1) : col;
  }

  // Cartesian product of tables; later tables' columns are prefixed Table.col
  function combine(tables) {
    let rows = [{}];
    tables.forEach(function (t) {
      const next = [];
      db[t].forEach(function (r) {
        rows.forEach(function (base) {
          const merged = Object.assign({}, base);
          Object.keys(r).forEach(function (k) {
            // store both qualified and unqualified for simpler matching
            merged[t + '.' + k] = r[k];
            if (!(k in merged)) merged[k] = r[k];
          });
          next.push(merged);
        });
      });
      rows = next;
    });
    return rows;
  }

  function runInsert(s) {
    const m = s.match(/^INSERT\s+INTO\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]+)\)\s*VALUES\s*\((.+)\)\s*$/i);
    if (!m) throw sqlError('INSERT must be: INSERT INTO table (cols) VALUES (vals)');
    const table = m[1];
    if (!db[table]) throw sqlError('Table "' + table + '" does not exist.');
    const cols = m[2].split(',').map(function (c) { return c.trim(); });
    const vals = splitValues(m[3]);
    if (cols.length !== vals.length) throw sqlError('Column count does not match value count.');
    const row = {};
    cols.forEach(function (c, i) {
      let v = vals[i].trim();
      if ((v[0] === "'" && v[v.length - 1] === "'") || (v[0] === '"' && v[v.length - 1] === '"')) v = v.slice(1, -1);
      else if (!isNaN(Number(v))) v = Number(v);
      row[c] = v;
    });
    db[table].push(row);
    return { type: 'insert', table: table, row: row };
  }

  function splitValues(s) {
    const out = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === "'") { inQ = !inQ; cur += ch; }
      else if (ch === ',' && !inQ) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return out;
  }

  function runUpdate(s) {
    const m = s.match(/^UPDATE\s+([A-Za-z_][A-Za-z0-9_]*)\s+SET\s+(.+?)\s+(?:WHERE\s+(.+?))?\s*$/i);
    if (!m) throw sqlError('UPDATE must be: UPDATE table SET col = value [WHERE cond]');
    const table = m[1];
    if (!db[table]) throw sqlError('Table "' + table + '" does not exist.');
    const setStr = m[2];
    const where = m[3];
    const setM = setStr.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?)\s*$/);
    if (!setM) throw sqlError('SET must be: col = value');
    const col = setM[1];
    let val = setM[2].trim();
    if ((val[0] === "'" && val[val.length - 1] === "'") || (val[0] === '"' && val[val.length - 1] === '"')) val = val.slice(1, -1);
    else if (!isNaN(Number(val))) val = Number(val);
    const pred = parseWhere(where);
    let count = 0;
    db[table].forEach(function (row) { if (pred(row)) { row[col] = val; count++; } });
    return { type: 'update', table: table, changed: count };
  }

  function runDelete(s) {
    const m = s.match(/^DELETE\s+FROM\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:WHERE\s+(.+?))?\s*$/i);
    if (!m) throw sqlError('DELETE must be: DELETE FROM table [WHERE cond]');
    const table = m[1];
    if (!db[table]) throw sqlError('Table "' + table + '" does not exist.');
    const where = m[2];
    const pred = parseWhere(where);
    const before = db[table].length;
    db[table] = db[table].filter(function (row) { return !pred(row); });
    return { type: 'delete', table: table, removed: before - db[table].length };
  }

  function runCreate(s) {
    const m = s.match(/^CREATE\s+TABLE\s+([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)\s*$/i);
    if (!m) throw sqlError('CREATE TABLE must be: CREATE TABLE name (col TYPE, ...)');
    const name = m[1];
    if (db[name]) throw sqlError('Table "' + name + '" already exists.');
    const colDefs = m[2].split(',').map(function (d) { return d.trim(); }).filter(Boolean);
    if (!colDefs.length) throw sqlError('Define at least one column.');
    const cols = colDefs.map(function (d) {
      const parts = d.split(/\s+/);
      return { name: parts[0], type: (parts[1] || 'TEXT').toUpperCase() };
    });
    db[name] = [];
    SCHEMA[name] = cols;
    return { type: 'create', table: name, cols: cols };
  }

  /* ── Rendering ──────────────────────────────────────────── */
  function renderTableResult(host, res) {
    if (res.type === 'select') {
      if (!res.rows.length) {
        host.innerHTML = '<div class="sql-result-empty">No rows matched your query.</div>';
        return;
      }
      const cols = res.cols;
      let h = '<table class="sql-result-table"><thead><tr>';
      cols.forEach(function (c) {
        const label = stripQualifier(c);
        h += '<th>' + esc(label) + '</th>';
      });
      h += '</tr></thead><tbody>';
      res.rows.forEach(function (row) {
        h += '<tr>';
        cols.forEach(function (c) {
          const val = row[c] !== undefined ? row[c] : row[stripQualifier(c)];
          h += '<td>' + esc(val) + '</td>';
        });
        h += '</tr>';
      });
      h += '</tbody></table>';
      host.innerHTML = h;
      return;
    }
    // mutation result
    let msg;
    if (res.type === 'insert') msg = 'Inserted 1 row into ' + res.table + '.';
    else if (res.type === 'update') msg = 'Updated ' + res.changed + ' row' + (res.changed === 1 ? '' : 's') + ' in ' + res.table + '.';
    else if (res.type === 'delete') msg = 'Deleted ' + res.removed + ' row' + (res.removed === 1 ? '' : 's') + ' from ' + res.table + '.';
    else if (res.type === 'create') msg = 'Created table ' + res.table + ' (' + res.cols.map(function (c) { return c.name + ' ' + c.type; }).join(', ') + ').';
    else msg = 'Done.';
    host.innerHTML = '<div class="sql-result-msg">' + esc(msg) + '</div>';
  }

  function renderSchema() {
    const host = document.getElementById('sql-schema');
    if (!host) return;
    let h = '';
    Object.keys(SCHEMA).forEach(function (t) {
      h += '<div class="sql-table-chip"><b>' + esc(t) + '</b><span>' +
        SCHEMA[t].map(function (c) {
          return c.name + (c.pk ? ' 🔑' : (c.fk ? ' 🔗' : ''));
        }).join(', ') + '</span></div>';
    });
    host.innerHTML = h;
  }

  const SAMPLES = [
    { label: 'All learners', sql: 'SELECT * FROM Learner;' },
    { label: 'Learners sorted', sql: 'SELECT LearnerForename, LearnerSurname FROM Learner ORDER BY LearnerSurname ASC;' },
    { label: 'Learners on one course', sql: "SELECT Learner.LearnerForename, Learner.LearnerSurname FROM Learner, Enrolment WHERE Learner.LearnerID = Enrolment.LearnerID AND Enrolment.CourseID = 'COU-001';" },
    { label: 'Enrolment details (join)', sql: 'SELECT Enrolment.EnrolmentID, Learner.LearnerSurname, Course.CourseID, Enrolment.TargetGrade FROM Enrolment, Learner, Course WHERE Enrolment.LearnerID = Learner.LearnerID AND Enrolment.CourseID = Course.CourseID;' },
    { label: 'Add a learner', sql: "INSERT INTO Learner (LearnerID, LearnerForename, LearnerSurname, LearnerTown) VALUES ('L050', 'Nina', 'Parker', 'Mapleton');" },
    { label: 'Update a grade', sql: "UPDATE Enrolment SET ActualGrade = 'A' WHERE EnrolmentID = 'ENR-000001';" },
    { label: 'Delete an enrolment', sql: "DELETE FROM Enrolment WHERE EnrolmentID = 'ENR-000015';" },
    { label: 'LIKE wildcard', sql: "SELECT * FROM Learner WHERE LearnerSurname LIKE 'B%';" }
  ];

  function render() {
    const host = document.getElementById('sql-lab-root');
    if (!host) return;
    host.innerHTML =
      '<div class="sql-shell">' +
      '  <div class="sql-top">' +
      '    <div class="sql-schema" id="sql-schema"></div>' +
      '    <div class="sql-samples">' +
      '      <span class="sql-samples-label">Try a query</span>' +
      SAMPLES.map(function (smp, i) { return '<button class="sql-sample" data-i="' + i + '">' + esc(smp.label) + '</button>'; }).join('') +
      '    </div>' +
      '  </div>' +
      '  <div class="sql-editor-wrap">' +
      '    <textarea id="sql-input" spellcheck="false" placeholder="Write SQL here — e.g. SELECT * FROM Learner;">SELECT * FROM Learner;</textarea>' +
      '    <div class="sql-editor-actions">' +
      '      <button class="btn primary" id="sql-run">Run query ▶</button>' +
      '      <button class="btn ghost" id="sql-reset">Reset database</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="sql-output" id="sql-output"></div>' +
      '</div>';

    renderSchema();

    const input = document.getElementById('sql-input');
    const runBtn = document.getElementById('sql-run');
    const resetBtn = document.getElementById('sql-reset');
    const output = document.getElementById('sql-output');

    function runCurrent() {
      try {
        const res = runStatement(input.value);
        renderTableResult(output, res);
        renderSchema();
      } catch (e) {
        output.innerHTML = '<div class="sql-result-error">' + esc(e && e.message ? e.message : String(e)) + '</div>';
      }
    }
    runBtn.addEventListener('click', runCurrent);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runCurrent(); }
    });
    resetBtn.addEventListener('click', function () {
      resetDb();
      renderSchema();
      output.innerHTML = '<div class="sql-result-msg">Database reset to its original state.</div>';
    });

    host.querySelectorAll('.sql-sample').forEach(function (b) {
      b.addEventListener('click', function () {
        input.value = SAMPLES[+b.dataset.i].sql;
        input.focus();
        runCurrent();
      });
    });

    // run the default query so users see an immediate result
    runCurrent();
  }

  window.initSqlLab = function () {
    resetDb();
    render();
  };
})();
