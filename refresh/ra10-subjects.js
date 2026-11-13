/* RA10 — subject finder. Builds the Revision page, the navbar "Revision" hover menu and the mobile
   Subjects sheet from one source: the unit registry in ra10-units.js. Add a unit there and it shows up everywhere.
   RA10Subjects.groups()                       → subjects with their units
   RA10Subjects.renderPage(el, {family})       → the full searchable subject page
   RA10Subjects.renderMenu(el)                 → the desktop hover menu (#rev-preview)
   RA10Subjects.renderSheet(el)                → the mobile Subjects sheet body
   RA10Subjects.renderSubject(el, subjectPath) → one subject's unit page (/revision/btec/level-3/<subject>) */
(function () {
  'use strict';
  if (window.RA10Subjects) return;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SVG = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ICONS = {
    it: SVG('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
    computing: SVG('<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>'),
    business: SVG('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    sport: SVG('<path d="M7 12h10"/><rect x="3" y="8" width="4" height="8" rx="1.2"/><rect x="17" y="8" width="4" height="8" rx="1.2"/>'),
    construction: SVG('<path d="M4 21V9l6-4v16M10 21V3h10v18M2.5 21h19M13 7h1.5M16 7h1.5M13 11h1.5M16 11h1.5M13 15h1.5M16 15h1.5"/>'),
    childhood: SVG('<rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><rect x="8" y="3.5" width="8" height="8" rx="1.5"/>'),
    engineering: SVG('<circle cx="12" cy="12" r="3"/><path d="M12 2.5l1.6 2.4 2.8-.6.6 2.8 2.4 1.6-1.2 2.6 1.2 2.6-2.4 1.6-.6 2.8-2.8-.6L12 21.5l-1.6-2.4-2.8.6-.6-2.8-2.4-1.6 1.2-2.6-1.2-2.6 2.4-1.6.6-2.8 2.8.6z"/>'),
    care: SVG('<path d="M12 20.5S3 15 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8C21 15 12 20.5 12 20.5z"/><path d="M8 11.5h2.5l1-2 2 4 1-2H16"/>'),
    medical: SVG('<path d="M9.5 3h5v6l5 9.5a2 2 0 0 1-1.8 2.9H6.3a2 2 0 0 1-1.8-2.9l5-9.5zM8 3h8M7 15h10"/>'),
    psychology: SVG('<path d="M12 3a7 7 0 0 0-7 7c0 2.4 1.2 4.1 2.5 5.3V20h6v-2h2.5a1.5 1.5 0 0 0 1.5-1.5V14l1.6-.6c.4-.2.5-.6.3-1L17.9 9A7 7 0 0 0 12 3z"/><path d="M10 9.5a2 2 0 1 1 2.6 1.9c-.4.1-.6.5-.6.9v.7"/>'),
    book: SVG('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
    search: SVG('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
    arrow: SVG('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    clock: SVG('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')
  };
  const iconFor = (name) => {
    const n = String(name || '').toLowerCase();
    if (/computing/.test(n)) return 'computing';
    if (/information technology|\bit\b/.test(n)) return 'it';
    if (/business/.test(n)) return 'business';
    if (/sport/.test(n)) return 'sport';
    if (/construction/.test(n)) return 'construction';
    if (/child/.test(n)) return 'childhood';
    if (/engineering/.test(n)) return 'engineering';
    if (/health and social/.test(n)) return 'care';
    if (/medical/.test(n)) return 'medical';
    if (/psycholog/.test(n)) return 'psychology';
    return 'book';
  };
  const FAMILIES = [['all', 'All'], ['btec3', 'BTEC Level 3'], ['btec2', 'BTEC Level 2'], ['alevel', 'A-Level']];
  const familyOf = (u) => /^BTEC Level 3/i.test(u.qual) ? 'btec3' : /^BTEC Level 2/i.test(u.qual) ? 'btec2' : /A-?Level/i.test(u.qual) ? 'alevel' : 'other';
  function go(path) {
    if (typeof window.go === 'function') window.go(path);
    else location.href = String(path).replace(/^\/revision\/(btec|a-level)(?=\/|$)/, '/$1').replace(/^\/revision$/, '/subjects');
  }
  const publicPath = (p) => String(p).replace(/^\/revision\/(btec|a-level)(?=\/|$)/, '/$1');

  function groups() {
    const U = (window.RA10Units && RA10Units.all()) || [];
    const map = new Map();
    U.forEach(u => {
      const key = u.group || String(u.qual).replace(/\s*\(\d{4}.*\)$/, '').replace(/\s*\((?:7\d{3}|9[A-Z]{2}\d)\)$/, '');
      if (!map.has(key)) {
        const parent = u.subjectPath || (/^\/revision\/btec\//.test(u.path) ? u.path.replace(/\/[^/]+$/, '') : '/revision/a-level');
        map.set(key, { key, name: u.subjectName || u.subject, qual: key, family: familyOf(u), color: u.color, icon: iconFor(u.subjectName || u.subject || key), path: parent, isNew: !!u.isNew, units: [], keywords: [] });
      }
      const g = map.get(key);
      g.units.push(u);
      g.isNew = g.isNew || !!u.isNew;
      g.keywords = g.keywords.concat(u.keywords || []);
    });
    const out = Array.from(map.values());
    out.forEach(g => g.units.sort((a, b) => unitNum(a) - unitNum(b)));
    const order = { btec3: 0, btec2: 1, alevel: 2, other: 3 };
    out.sort((a, b) => (order[a.family] - order[b.family]) || a.name.localeCompare(b.name));
    return out;
  }
  const unitNum = (u) => { const m = String(u.name).match(/Unit (\d+)/); return m ? Number(m[1]) : (/(7\d{3})/.exec(u.name) || [0, 99])[1] * 1; };
  const unitBadge = (u) => { const m = String(u.name).match(/Unit (\d+)/); if (m) return 'Unit ' + m[1]; const y = String(u.name).match(/\((7\d{3}|9[A-Z]{2}\d)\)/); return y ? y[1] : 'Course'; };
  const unitTitle = (u) => String(u.name).replace(/^(Level 2 IT )?Unit \d+:\s*/, '').replace(/^AQA A-Level /, '');
  const kindClass = (k) => /exam/i.test(k) ? 'exam' : /set task/i.test(k) ? 'task' : 'cw';
  const kindLabel = (k) => /exam/i.test(k) ? 'Exam' : /set task/i.test(k) ? 'Set task' : 'Assignment';
  function matches(g, u, q) {
    if (!q) return true;
    const hay = [g.name, g.qual, u ? u.name : '', u ? u.short : '', (g.keywords || []).join(' ')].join(' ').toLowerCase();
    return q.split(/\s+/).every(w => hay.indexOf(w) >= 0);
  }
  function recent() {
    try { const r = JSON.parse(localStorage.getItem('ra10_recent_apps_v1') || '[]'); return Array.isArray(r) ? r : []; } catch (e) { return []; }
  }

  /* ───────── styles (one sheet for all three surfaces) ───────── */
  function css() {
    if (document.getElementById('ra10-subjects-css')) return;
    const st = document.createElement('style');
    st.id = 'ra10-subjects-css';
    st.textContent = `
.rs{--rs-ink:var(--color-text,#14161f);--rs-ink2:var(--color-text-muted,#5b6174);--rs-line:var(--color-border,#e3e6ee);--rs-card:var(--color-surface,#fff);--rs-soft:var(--color-surface-offset,#f3f4f8);color:var(--rs-ink)}
.rs *{box-sizing:border-box}
.rs-search{position:relative;display:flex;align-items:center}
.rs-search svg{position:absolute;left:14px;width:19px;height:19px;color:var(--rs-ink2);pointer-events:none}
.rs-search input{width:100%;padding:13px 16px 13px 44px;border-radius:14px;border:1.5px solid var(--rs-line);background:var(--rs-card);color:var(--rs-ink);font:inherit;font-size:1rem;outline:none;transition:border-color .15s,box-shadow .15s}
.rs-search input:focus{border-color:var(--color-primary,#4f46e5);box-shadow:0 0 0 4px color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent)}
.rs-chips{display:flex;gap:6px;flex-wrap:wrap}
.rs-chip{padding:7px 13px;border-radius:999px;border:1px solid var(--rs-line);background:var(--rs-card);color:var(--rs-ink2);font-family:inherit;font-weight:700;font-size:.82rem;line-height:1.2;cursor:pointer}
.rs-chip.on{background:var(--rs-ink);border-color:var(--rs-ink);color:var(--rs-card)}
.rs-ico{flex:none;display:grid;place-items:center;width:44px;height:44px;border-radius:13px;color:#fff;background:var(--sc,#4f46e5);box-shadow:0 8px 18px -10px var(--sc,#4f46e5)}
.rs-ico svg{width:24px;height:24px}
.rs-new{display:inline-block;margin-left:6px;padding:2px 7px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:.66rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;vertical-align:2px}
.rs-kind{flex:none;padding:2px 8px;border-radius:999px;font-size:.68rem;font-weight:800;letter-spacing:.02em}
.rs-kind.exam{background:#dbeafe;color:#1e40af}.rs-kind.task{background:#ffedd5;color:#9a3412}.rs-kind.cw{background:#ede9fe;color:#5b21b6}
[data-theme="dark"] .rs-kind.exam{background:rgba(59,130,246,.2);color:#bfdbfe}[data-theme="dark"] .rs-kind.task{background:rgba(249,115,22,.2);color:#fed7aa}[data-theme="dark"] .rs-kind.cw{background:rgba(139,92,246,.22);color:#ddd6fe}
[data-theme="dark"] .rs-new{background:rgba(245,158,11,.2);color:#fde68a}
.rs-empty{padding:26px;border:1.5px dashed var(--rs-line);border-radius:16px;text-align:center;color:var(--rs-ink2)}
/* page */
.rs-page .rs-top{display:grid;gap:14px;margin:6px 0 20px}
.rs-page h1{margin:0;font-size:clamp(2rem,1.3rem + 2.6vw,3.1rem);letter-spacing:-.035em;line-height:1.05}
.rs-page .rs-lede{margin:0;max-width:62ch;color:var(--rs-ink2);font-size:1.05rem}
.rs-page .rs-bar{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center}
.rs-recent{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:18px}
.rs-recent b{font-size:.8rem;color:var(--rs-ink2);display:inline-flex;gap:6px;align-items:center}.rs-recent b svg{width:16px;height:16px}
.rs-recent button{display:inline-flex;align-items:center;gap:8px;padding:7px 12px 7px 8px;border-radius:12px;border:1px solid var(--rs-line);background:var(--rs-card);color:var(--rs-ink);font-family:inherit;font-weight:700;font-size:.84rem;line-height:1.2;cursor:pointer}
.rs-recent button i{width:10px;height:10px;border-radius:50%;background:var(--sc)}
.rs-fam{margin:26px 0 12px;font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--rs-ink2)}
.rs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:14px}
.rs-card{display:flex;flex-direction:column;border-radius:20px;border:1px solid var(--rs-line);background:var(--rs-card);overflow:hidden;transition:box-shadow .2s,transform .2s}
.rs-card:hover{box-shadow:0 18px 40px -26px rgba(15,23,42,.45);transform:translateY(-2px)}
.rs-card-h{display:flex;gap:12px;align-items:center;padding:16px 16px 12px;border:0;background:linear-gradient(135deg,color-mix(in srgb,var(--sc) 12%,transparent),transparent 70%);text-align:left;color:inherit;font:inherit;cursor:pointer}
.rs-card-h b{display:block;font-size:1.06rem;line-height:1.25}
.rs-card-h small{display:block;color:var(--rs-ink2);font-size:.8rem;margin-top:2px}
.rs-card-h .rs-go{margin-left:auto;color:var(--rs-ink2)}.rs-card-h .rs-go svg{width:18px;height:18px}
.rs-units{display:grid;padding:4px 8px 10px}
.rs-unit{display:flex;gap:10px;align-items:center;width:100%;padding:9px 10px;border:0;border-radius:12px;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;text-decoration:none}
.rs-unit:hover,.rs-unit:focus-visible{background:var(--rs-soft)}
.rs-unit .n{flex:none;min-width:58px;font-size:.74rem;font-weight:800;color:var(--sc)}
.rs-unit .t{flex:1;min-width:0;font-size:.9rem;font-weight:600;line-height:1.3}
.rs-page mark,.rs-menu mark,.rs-sheet mark{background:color-mix(in srgb,#facc15 45%,transparent);color:inherit;border-radius:3px}
/* site CSS styles every button / h2: keep the finder's own sizes */
.rs .rs-chip{font-size:.82rem!important;line-height:1.2!important;padding:7px 13px!important;min-height:0!important}
.rs-page h2.rs-fam{font-size:.8rem!important;letter-spacing:.08em!important;font-weight:800!important;line-height:1.3!important;margin:26px 0 12px!important}
.rs-page h1{font-size:clamp(2rem,1.3rem + 2.6vw,3.1rem)!important}
.rs .rs-unit,.rs .rs-card-h,.rs .rs-ms,.rs .rs-acc-h{min-height:0!important;box-shadow:none}
/* menu */
#rev-preview.rs-menu-host{width:min(860px,94vw)!important;max-height:min(80vh,660px);padding:14px!important}
.rs-menu-panes{display:grid;grid-template-columns:290px minmax(0,1fr);gap:12px;min-height:340px}
.rs-menu-subjects{display:grid;align-content:start;gap:2px;max-height:min(56vh,470px);overflow:auto;padding-right:4px;border-right:1px solid var(--rs-line)}
.rs-ms{display:flex;gap:10px;align-items:center;width:100%;padding:7px 8px;border:0;border-radius:12px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.rs-ms .rs-ico{width:32px;height:32px;border-radius:10px;box-shadow:none}.rs-ms .rs-ico svg{width:18px;height:18px}
.rs-ms b{display:block;font-size:.88rem;line-height:1.35}.rs-ms small{display:block;font-size:.72rem;color:var(--rs-ink2)}
.rs-ms:hover,.rs-ms.on{background:color-mix(in srgb,var(--sc) 11%,var(--rs-card))}
.rs-ms.on b{color:var(--sc)}
.rs-menu-units{display:grid;align-content:start;gap:8px;min-width:0}
.rs-mu-h{display:flex;gap:12px;align-items:center;padding:4px 4px 10px;border-bottom:1px solid var(--rs-line)}
.rs-mu-h small{display:block;font-size:.74rem;color:var(--rs-ink2)}.rs-mu-h b{font-size:1.05rem}
.rs-mu-all{margin-left:auto;display:inline-flex;gap:6px;align-items:center;padding:7px 11px!important;border-radius:10px;border:1px solid var(--rs-line);background:var(--rs-card);color:var(--rs-ink);font-family:inherit;font-weight:700;font-size:.8rem!important;line-height:1!important;cursor:pointer;white-space:nowrap}
.rs-mu-all svg{width:15px;height:15px}
.rs-mu-list{display:grid;gap:2px}
.rs-menu-units .rs-unit{padding:10px}
.rs-menu{display:grid;gap:12px}
.rs-menu-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center}
.rs-menu .rs-search input{padding-top:10px;padding-bottom:10px;font-size:.92rem}
.rs-menu-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.rs-mg{padding:8px;border-radius:14px;border:1px solid var(--rs-line);background:var(--rs-card)}
.rs-mg-h{display:flex;gap:9px;align-items:center;width:100%;padding:4px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;border-radius:10px}
.rs-mg-h:hover{background:var(--rs-soft)}
.rs-mg-h .rs-ico{width:32px;height:32px;border-radius:10px}.rs-mg-h .rs-ico svg{width:18px;height:18px}
.rs-mg-h b{font-size:.88rem;line-height:1.2}.rs-mg-h small{display:block;font-size:.7rem;color:var(--rs-ink2)}
.rs-mg .rs-unit{padding:6px 8px}.rs-mg .rs-unit .n{min-width:48px;font-size:.7rem}.rs-mg .rs-unit .t{font-size:.8rem}
.rs-menu-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;padding-top:10px;border-top:1px solid var(--rs-line);font-size:.82rem;color:var(--rs-ink2)}
.rs-menu-foot button{padding:8px 14px;border-radius:10px;border:0;background:var(--color-primary,#4f46e5);color:#fff;font-family:inherit;font-weight:700;font-size:.84rem;line-height:1.2;cursor:pointer}
@media (max-width:1000px){.rs-menu-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
/* sheet */
.rs-sheet{display:grid;gap:12px;padding:2px 0 24px}
.rs-sheet .rs-chips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 -2px;padding:0 2px}
.rs-sheet .rs-chips::-webkit-scrollbar{display:none}
.rs-sheet .rs-chip{flex:none}
.rs-acc{border-radius:16px;border:1px solid var(--rs-line);background:var(--rs-card);overflow:hidden}
.rs-acc-h{display:flex;gap:12px;align-items:center;width:100%;padding:12px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.rs-acc-h .rs-ico{width:38px;height:38px;border-radius:12px}.rs-acc-h .rs-ico svg{width:20px;height:20px}
.rs-acc-h b{display:block;font-size:.98rem;line-height:1.2}.rs-acc-h small{display:block;font-size:.76rem;color:var(--rs-ink2)}
.rs-acc-h .chev{margin-left:auto;transition:transform .2s;color:var(--rs-ink2)}.rs-acc-h .chev svg{width:18px;height:18px}
.rs-acc.open .rs-acc-h .chev{transform:rotate(90deg)}
.rs-acc .rs-units{display:none;border-top:1px solid var(--rs-line)}
.rs-acc.open .rs-units{display:grid}
@media (max-width:640px){.rs-page .rs-bar{grid-template-columns:1fr}.rs-page .rs-chips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.rs-page .rs-chip{flex:none}}
@media (prefers-reduced-motion:reduce){.rs-card,.rs-card:hover{transition:none;transform:none}}
/* breathing room: titles, badges and subtitles never collide (site CSS sets tight line-heights on b/small) */
.rs .rs-txt{display:flex;flex-direction:column;gap:5px;min-width:0;flex:1}
.rs .rs-ttl{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}
.rs .rs-ttl b{display:inline;line-height:1.3!important;letter-spacing:-.005em}
.rs .rs-txt small{display:block;margin:0!important;line-height:1.45!important}
.rs .rs-new{margin-left:0;vertical-align:0;line-height:1.5;padding:1px 8px}
.rs .rs-unit{gap:14px;padding:11px 12px;align-items:flex-start}
.rs .rs-unit .n{min-width:62px;padding-top:2px;line-height:1.4}
.rs .rs-unit .t{line-height:1.45!important}
.rs .rs-kind{white-space:nowrap;margin-top:1px;line-height:1.5}
.rs .rs-units{gap:2px;padding:6px 10px 14px}
.rs .rs-card-h{gap:14px;padding:18px 18px 14px;align-items:center}
.rs .rs-grid{gap:18px}
.rs-menu .rs-menu-top{gap:14px}
.rs-menu .rs-menu-panes{grid-template-columns:320px minmax(0,1fr);gap:18px;min-height:380px}
.rs-menu .rs-menu-subjects{gap:4px;padding-right:10px}
.rs-menu .rs-ms{gap:12px;padding:10px 10px;align-items:center}
.rs-menu .rs-ms .rs-ttl b{font-size:.9rem}
.rs-menu .rs-ms small{font-size:.74rem}
.rs-menu .rs-menu-units{gap:10px;padding:2px 2px 0}
.rs-menu .rs-mu-h{gap:14px;padding:6px 6px 14px}
.rs-menu .rs-mu-h b{display:block;line-height:1.3!important;margin-top:3px}
.rs-menu .rs-mu-h small{line-height:1.4!important}
.rs-menu .rs-mu-list{gap:4px}
.rs-menu .rs-menu-units .rs-unit{padding:12px 12px}
.rs-menu .rs-menu-foot{padding-top:14px}
#rev-preview.rs-menu-host{width:min(940px,95vw)!important;padding:18px!important}
.rs-sheet{gap:14px}
.rs-sheet .rs-acc{margin:0}
.rs-sheet-list{display:grid;gap:10px}
.rs-sheet .rs-acc-h{gap:14px;padding:14px}
.rs-sheet .rs-acc-h .rs-ttl b{font-size:1rem}
.rs-sheet .rs-acc .rs-units{padding:8px 8px 12px}
.rs-page .rs-top{gap:16px;margin:8px 0 24px}
.rs-page .rs-lede{line-height:1.6}
@media (max-width:1000px){.rs-menu .rs-menu-panes{grid-template-columns:260px minmax(0,1fr)}}
.rs button.rs-ms,.rs button.rs-unit,.rs a.rs-unit,.rs button.rs-acc-h,.rs button.rs-card-h,.rs button.rs-mu-all{height:auto!important;max-height:none!important;overflow:visible!important;white-space:normal!important}
.rs-menu .rs-menu-subjects{display:flex!important;flex-direction:column}
.rs-menu .rs-ms{flex:none!important;min-height:56px!important}
.rs-menu .rs-mu-list,.rs-sheet-list,.rs .rs-units{display:flex!important;flex-direction:column}
.rs-menu .rs-mu-list>*,.rs-sheet-list>*,.rs .rs-units>*{flex:none!important}
.rs-acc:not(.open) .rs-units{display:none!important}
`;
    document.head.appendChild(st);
  }

  const hl = (text, q) => {
    const s = esc(text);
    if (!q) return s;
    let out = s;
    q.split(/\s+/).filter(w => w.length > 1).forEach(w => { out = out.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
    return out;
  };
  const unitRow = (u, g, q, tag) => `<${tag || 'button'} ${tag === 'a' ? `href="${esc(publicPath(u.path))}"` : 'type="button"'} class="rs-unit" data-rs-go="${esc(u.path)}" style="--sc:${esc(u.color || g.color)}"><span class="n">${esc(unitBadge(u))}</span><span class="t">${hl(unitTitle(u), q)}</span><span class="rs-kind ${kindClass(u.kind)}">${kindLabel(u.kind)}</span></${tag || 'button'}>`;
  const qualShort = (g) => (/A-?Level/i.test(g.qual) ? ((String(g.qual).match(/^(.+?)\s+A-?Level/) || [0, 'AQA'])[1].replace(/^Pearson\s+/, '') + ' A-Level') : (FAMILIES.find(f => f[0] === g.family) || [0, g.qual])[1] + (/\bAAQ\b/.test(g.qual) ? ' · AAQ' : ''));
  const subHead = (g, q) => `<span class="rs-ico" style="--sc:${esc(g.color)}">${ICONS[g.icon]}</span><span class="rs-txt"><span class="rs-ttl"><b>${hl(g.name, q)}</b>${g.isNew ? '<span class="rs-new">New</span>' : ''}</span><small>${esc(qualShort(g))} · ${g.units.length} unit${g.units.length === 1 ? '' : 's'}</small></span>`;
  function filtered(fam, q) {
    return groups().filter(g => fam === 'all' || g.family === fam).map(g => {
      const whole = matches(g, null, q) && !!q && g.name.toLowerCase().indexOf(q) >= 0;
      const units = g.units.filter(u => !q || whole || matches(g, u, q));
      return Object.assign({}, g, { units });
    }).filter(g => g.units.length);
  }
  function wire(root, paint) {
    root.addEventListener('click', (e) => {
      const u = e.target.closest('[data-rs-go]');
      if (u) { e.preventDefault(); if (typeof window.hideRevPreview === 'function') { const m = document.getElementById('rev-preview'); if (m) m.style.display = 'none'; } if (typeof window.closeMobileSubjectSheet === 'function') window.closeMobileSubjectSheet(); go(u.dataset.rsGo); return; }
      const c = e.target.closest('[data-rs-fam]');
      if (c) { paint({ fam: c.dataset.rsFam }); return; }
    });
    const inp = root.querySelector('input[type=search]');
    if (inp) inp.addEventListener('input', () => paint({ q: inp.value }));
  }

  /* ───────── full page ───────── */
  function renderPage(el, opts) {
    css();
    const st = { fam: (opts && opts.family) || 'all', q: '' };
    el.classList.add('rs', 'rs-page');
    const total = groups().reduce((n, g) => n + g.units.length, 0);
    el.innerHTML = `<div class="rs-top">
        <h1>${esc((opts && opts.title) || 'Find your subject')}</h1>
        <p class="rs-lede">${esc((opts && opts.lede) || `${groups().length} subjects and ${total} units, each with a revision guide, flashcards, quizzes and exam or assignment support. Search or pick a subject below.`)}</p>
        <div class="rs-bar"><label class="rs-search"><span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Search subjects and units</span>${ICONS.search}<input type="search" placeholder="Search subjects or units, e.g. “anatomy”, “programming”, “finance”" autocomplete="off"></label>
        <div class="rs-chips" role="group" aria-label="Qualification">${FAMILIES.map(([k, t]) => `<button type="button" class="rs-chip${k === st.fam ? ' on' : ''}" data-rs-fam="${k}" aria-pressed="${k === st.fam}">${t}</button>`).join('')}</div></div>
      </div>
      <div class="rs-recent-host"></div>
      <div class="rs-body" aria-live="polite"></div>`;
    const recentHost = el.querySelector('.rs-recent-host');
    const rec = recent().map(p => window.RA10Units && RA10Units.byPath(p)).filter(Boolean).slice(0, 4);
    if (rec.length) recentHost.innerHTML = `<div class="rs-recent"><b>${ICONS.clock} Pick up where you left off</b>${rec.map(u => `<button type="button" data-rs-go="${esc(u.path)}" style="--sc:${esc(u.color)}"><i></i>${esc(u.short)}</button>`).join('')}</div>`;
    const paint = (ch) => {
      Object.assign(st, ch || {});
      const q = String(st.q || '').trim().toLowerCase();
      el.querySelectorAll('[data-rs-fam]').forEach(b => { const on = b.dataset.rsFam === st.fam; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      const list = filtered(st.fam, q);
      const body = el.querySelector('.rs-body');
      if (!list.length) { body.innerHTML = `<div class="rs-empty">No subjects match “${esc(st.q)}”. Try a shorter word, or <a href="/contact" onclick="event.preventDefault();window.openContactModal&&openContactModal('Request a subject')">ask us to add it</a>.</div>`; return; }
      const fams = FAMILIES.filter(f => f[0] !== 'all' && list.some(g => g.family === f[0]));
      body.innerHTML = fams.map(([k, t]) => `${fams.length > 1 || st.fam === 'all' ? `<h2 class="rs-fam">${t}</h2>` : ''}<div class="rs-grid">${list.filter(g => g.family === k).map(g => `
        <article class="rs-card" style="--sc:${esc(g.color)}"><button type="button" class="rs-card-h" data-rs-go="${esc(g.units.length === 1 ? g.units[0].path : g.path)}" aria-label="Open ${esc(g.name)}">${subHead(g, q)}<span class="rs-go">${ICONS.arrow}</span></button>
          <div class="rs-units">${g.units.map(u => unitRow(u, g, q, 'a')).join('')}</div></article>`).join('')}</div>`).join('');
    };
    wire(el, paint);
    paint();
  }

  /* ───────── navbar hover menu: subjects on the left, the chosen subject's units on the right ───────── */
  function renderMenu(el) {
    css();
    const st = { fam: 'all', q: '', active: null };
    el.classList.add('rs-menu-host');
    el.innerHTML = `<div class="rs rs-menu"><div class="rs-menu-top"><label class="rs-search">${ICONS.search}<input type="search" placeholder="Search subjects and units" aria-label="Search subjects and units" autocomplete="off"></label>
      <div class="rs-chips" role="group" aria-label="Qualification">${FAMILIES.map(([k, t]) => `<button type="button" class="rs-chip${k === 'all' ? ' on' : ''}" data-rs-fam="${k}">${t}</button>`).join('')}</div></div>
      <div class="rs-menu-panes"><div class="rs-menu-subjects" role="list"></div><div class="rs-menu-units" aria-live="polite"></div></div>
      <div class="rs-menu-foot"><span class="rs-count"></span><button type="button" data-rs-go="/revision">Browse all subjects</button></div></div>`;
    const list = () => filtered(st.fam, String(st.q || '').trim().toLowerCase());
    const paintUnits = () => {
      const q = String(st.q || '').trim().toLowerCase();
      const gs = list();
      const g = gs.find(x => x.key === st.active) || gs[0];
      const box = el.querySelector('.rs-menu-units');
      if (!g) { box.innerHTML = `<div class="rs-empty">Nothing matches “${esc(st.q)}”.</div>`; return; }
      st.active = g.key;
      el.querySelectorAll('.rs-ms').forEach(b => b.classList.toggle('on', b.dataset.rsKey === g.key));
      box.style.setProperty('--sc', g.color);
      box.innerHTML = `<div class="rs-mu-h"><span class="rs-ico">${ICONS[g.icon]}</span><div><small>${esc(g.qual)}</small><b>${esc(g.name)}</b></div>${g.units.length > 1 ? `<button type="button" class="rs-mu-all" data-rs-go="${esc(g.path)}">All ${g.units.length} units ${ICONS.arrow}</button>` : ''}</div>
        <div class="rs-mu-list">${g.units.map(u => unitRow(u, g, q)).join('')}</div>`;
    };
    const paint = (ch) => {
      Object.assign(st, ch || {});
      const q = String(st.q || '').trim().toLowerCase();
      el.querySelectorAll('[data-rs-fam]').forEach(b => b.classList.toggle('on', b.dataset.rsFam === st.fam));
      const gs = list();
      el.querySelector('.rs-menu-subjects').innerHTML = gs.map(g => `<button type="button" role="listitem" class="rs-ms" data-rs-key="${esc(g.key)}" style="--sc:${esc(g.color)}">${subHead(g, q)}</button>`).join('');
      const n = gs.reduce((s, g) => s + g.units.length, 0);
      el.querySelector('.rs-count').textContent = `${gs.length} subject${gs.length === 1 ? '' : 's'} · ${n} unit${n === 1 ? '' : 's'}`;
      paintUnits();
    };
    const pick = (e) => { const b = e.target.closest('.rs-ms'); if (b && b.dataset.rsKey !== st.active) { st.active = b.dataset.rsKey; paintUnits(); } };
    el.addEventListener('mouseover', pick);
    el.addEventListener('focusin', pick);
    el.addEventListener('click', (e) => { const b = e.target.closest('.rs-ms'); if (b) { st.active = b.dataset.rsKey; paintUnits(); const f = el.querySelector('.rs-menu-units .rs-unit'); if (f && e.detail === 0) f.focus(); } });
    wire(el, paint);
    // start on the subject you were last in
    const last = recent()[0], lu = last && window.RA10Units && RA10Units.byPath(last);
    if (lu) { const g = groups().find(x => x.units.some(u => u.path === lu.path)); if (g) st.active = g.key; }
    paint();
  }

  /* ───────── mobile sheet ───────── */
  function renderSheet(el) {
    css();
    const st = { fam: 'all', q: '' };
    const open = new Set();
    el.classList.add('rs', 'rs-sheet');
    el.innerHTML = `<label class="rs-search">${ICONS.search}<input type="search" placeholder="Search subjects and units" aria-label="Search subjects and units" autocomplete="off"></label>
      <div class="rs-chips" role="group" aria-label="Qualification">${FAMILIES.map(([k, t]) => `<button type="button" class="rs-chip${k === 'all' ? ' on' : ''}" data-rs-fam="${k}">${t}</button>`).join('')}</div>
      <div class="rs-sheet-list"></div>`;
    const paint = (ch) => {
      Object.assign(st, ch || {});
      const q = String(st.q || '').trim().toLowerCase();
      el.querySelectorAll('[data-rs-fam]').forEach(b => b.classList.toggle('on', b.dataset.rsFam === st.fam));
      const list = filtered(st.fam, q);
      el.querySelector('.rs-sheet-list').innerHTML = list.length ? list.map(g => `<div class="rs-acc${q || open.has(g.key) ? ' open' : ''}" style="--sc:${esc(g.color)}"><button type="button" class="rs-acc-h" data-rs-acc="${esc(g.key)}" aria-expanded="${!!(q || open.has(g.key))}">${subHead(g, q)}<span class="chev">${SVG('<path d="m9 6 6 6-6 6"/>')}</span></button><div class="rs-units">${g.units.map(u => unitRow(u, g, q)).join('')}</div></div>`).join('') : `<div class="rs-empty">Nothing matches “${esc(st.q)}”.</div>`;
    };
    el.addEventListener('click', (e) => {
      const a = e.target.closest('[data-rs-acc]');
      if (!a) return;
      const k = a.dataset.rsAcc;
      if (open.has(k)) open.delete(k); else open.add(k);
      const box = a.closest('.rs-acc'); box.classList.toggle('open', open.has(k)); a.setAttribute('aria-expanded', open.has(k));
    });
    wire(el, paint);
    // open the subject you were last in
    const last = recent()[0], lu = last && window.RA10Units && RA10Units.byPath(last);
    if (lu) { const g = groups().find(x => x.units.some(u => u.path === lu.path)); if (g) open.add(g.key); }
    paint();
  }

  /* ───────── one subject ───────── */
  function renderSubject(el, subjectPath) {
    css();
    const g = groups().find(x => x.path.toLowerCase() === String(subjectPath).toLowerCase());
    if (!g) return false;
    el.classList.add('rs', 'rs-page');
    const ex = g.units.filter(u => /exam/i.test(u.kind)).length;
    const st = g.units.filter(u => /set task/i.test(u.kind)).length;   // externally set and marked: not assignments
    const as = g.units.length - ex - st;
    const lede = [ex ? `${ex} exam unit${ex === 1 ? '' : 's'} with sample papers, exam questions and the AI Examiner` : '', st ? `${st} set-task unit${st === 1 ? '' : 's'} with the Pearson set tasks and the AI Examiner on every activity` : '', as ? `${as} assignment unit${as === 1 ? '' : 's'} that teach the theory behind your assignment and explain every grading criterion` : ''].filter(Boolean);
    el.innerHTML = `<div class="rs-top" style="--sc:${esc(g.color)}"><div style="display:flex;gap:14px;align-items:center"><span class="rs-ico" style="width:56px;height:56px;border-radius:16px">${ICONS[g.icon]}</span><div><small style="color:var(--rs-ink2);font-weight:700">${esc(g.qual)}</small><h1>${esc(g.name)}${g.isNew ? '<span class="rs-new">New</span>' : ''}</h1></div></div>
      <p class="rs-lede">${g.units.length} unit${g.units.length === 1 ? '' : 's'}: ${lede.length > 1 ? lede.slice(0, -1).join(', ') + ' and ' + lede[lede.length - 1] : lede[0] || ''}.</p></div>
      <div class="rs-grid">${g.units.map(u => `<article class="rs-card" style="--sc:${esc(u.color || g.color)}"><button type="button" class="rs-card-h" data-rs-go="${esc(u.path)}"><span class="rs-ico">${ICONS[g.icon]}</span><span><small>${esc(unitBadge(u))} · ${kindLabel(u.kind)}</small><b>${esc(unitTitle(u))}</b></span><span class="rs-go">${ICONS.arrow}</span></button>
        <div class="rs-units" style="padding:0 16px 16px;color:var(--rs-ink2);font-size:.9rem">${esc(u.blurb || (/exam/i.test(u.kind) ? 'Revision guide, flashcards, quiz, exam questions with the AI Examiner and the full sample paper.' : /set task/i.test(u.kind) ? 'Revision guide, flashcards, quiz and the Pearson set tasks, with the AI Examiner marking every activity against the band grid.' : 'Revision guide for the theory, flashcards, quiz and an assignment guide to every Pass, Merit and Distinction criterion.'))}</div></article>`).join('')}</div>`;
    wire(el, () => {});
    return g;
  }

  /* ───────── signed-out homepage catalogue: tabs + search, subject cards with their units ───────── */
  function homeCss() {
    if (document.getElementById('ra10-subjects-home-css')) return;
    const st = document.createElement('style');
    st.id = 'ra10-subjects-home-css';
    st.textContent = `
.rs-home{display:grid;grid-template-columns:minmax(0,1fr);gap:22px;min-width:0}
.rs-home>*,.rs-home .rs-sec,.rs-home .rs-hbar>*{min-width:0}
.rs-home .rs-sec-h{flex-wrap:wrap;row-gap:4px}
.rs-home .rs-hbar{display:flex;flex-wrap:wrap;gap:12px 16px;align-items:center;justify-content:space-between}
.rs-home .rs-tabs{display:flex;gap:4px;padding:4px;border-radius:14px;background:var(--rs-soft);overflow-x:auto;scrollbar-width:none;max-width:100%}
.rs-home .rs-tabs::-webkit-scrollbar{display:none}
.rs-home .rs-tab{flex:none;display:inline-flex;align-items:center;gap:8px;padding:9px 14px!important;border:0;border-radius:10px;background:transparent;color:var(--rs-ink2);font:700 .88rem/1.2 var(--font-b,inherit)!important;cursor:pointer;white-space:nowrap;min-height:0!important}
.rs-home .rs-tab i{font-style:normal;padding:1px 7px;border-radius:999px;background:color-mix(in srgb,var(--rs-ink2) 14%,transparent);font-size:.72rem;font-weight:800}
.rs-home .rs-tab.on{background:var(--rs-card);color:var(--rs-ink);box-shadow:0 1px 2px rgba(15,23,42,.08),0 4px 12px -6px rgba(15,23,42,.18)}
.rs-home .rs-search{flex:1 1 280px;max-width:420px}
.rs-home .rs-search input{padding-top:11px;padding-bottom:11px;font-size:.95rem}
.rs-home .rs-sec{display:grid;gap:14px}
.rs-home .rs-sec-h{display:flex;align-items:baseline;gap:12px;margin:6px 0 0;padding-bottom:10px;border-bottom:1px solid var(--rs-line)}
.rs-home .rs-sec-h h3{margin:0!important;font-size:1.05rem!important;font-weight:800!important;letter-spacing:-.01em!important;line-height:1.3!important;color:var(--rs-ink)!important;text-transform:none!important}
.rs-home .rs-sec-h span{color:var(--rs-ink2);font-size:.86rem}
.rs-home .rs-hgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:stretch}
.rs-home .rs-hc{display:flex;flex-direction:column;border-radius:20px;border:1px solid var(--rs-line);background:var(--rs-card);overflow:hidden;transition:box-shadow .2s,border-color .2s}
.rs-home .rs-hc:hover{border-color:color-mix(in srgb,var(--sc) 35%,var(--rs-line));box-shadow:0 18px 40px -28px color-mix(in srgb,var(--sc) 70%,#0f172a)}
.rs-home .rs-hc-top{display:flex;gap:14px;align-items:flex-start;width:100%;padding:18px 18px 14px!important;border:0;background:linear-gradient(160deg,color-mix(in srgb,var(--sc) 11%,transparent),transparent 75%);color:inherit;font:inherit;text-align:left;cursor:pointer;height:auto!important;min-height:0!important;white-space:normal!important}
.rs-home .rs-hc-top .rs-ico{width:46px;height:46px;border-radius:14px}
.rs-home .rs-hc-name{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}
.rs-home .rs-hc-name b{font-size:1.08rem;line-height:1.3!important;letter-spacing:-.01em}
.rs-home .rs-hc-qual{display:block;margin-top:4px;color:var(--rs-ink2);font-size:.8rem;line-height:1.45!important}
.rs-home .rs-hc-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.rs-home .rs-hc-meta span{padding:3px 9px;border-radius:999px;background:color-mix(in srgb,var(--sc) 10%,var(--rs-card));color:color-mix(in srgb,var(--sc) 70%,var(--rs-ink));font-size:.72rem;font-weight:700;line-height:1.5}
.rs-home .rs-hc .rs-units{padding:4px 10px 6px!important}
.rs-home .rs-hc .rs-unit{padding:10px 10px!important}
.rs-home .rs-hc .rs-unit .t{font-size:.9rem}
.rs-home .rs-hc .rs-unit.more{display:none!important}
.rs-home .rs-hc.open .rs-unit.more{display:flex!important}
.rs-home .rs-hc-foot{display:flex;gap:8px;justify-content:space-between;align-items:center;margin-top:auto;padding:8px 14px 14px;border-top:1px dashed var(--rs-line)}
.rs-home .rs-hc-foot button{display:inline-flex;align-items:center;gap:6px;padding:8px 12px!important;border-radius:10px;border:0;background:transparent;color:var(--rs-ink2);font:700 .82rem/1.2 var(--font-b,inherit)!important;cursor:pointer;min-height:0!important;height:auto!important}
.rs-home .rs-hc-foot button:hover{background:var(--rs-soft);color:var(--rs-ink)}
.rs-home .rs-hc-foot .rs-open{color:var(--sc)}
.rs-home .rs-hc-foot svg{width:15px;height:15px}
.rs-home .rs-hc.open .rs-more svg{transform:rotate(180deg)}
.rs-home .rs-hfoot{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;justify-content:space-between;padding:16px 18px;border-radius:16px;background:var(--rs-soft);color:var(--rs-ink2);font-size:.9rem}
.rs-home .rs-hfoot a{color:var(--rs-ink);font-weight:700}
@media (max-width:1060px){.rs-home .rs-hgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:680px){.rs-home .rs-hgrid{grid-template-columns:1fr}.rs-home .rs-search{max-width:none}}
`;
    document.head.appendChild(st);
  }
  const PREVIEW = 4;   // units shown before "Show all"
  function renderHome(el) {
    css(); homeCss();
    const all = groups();
    const famOrder = ['alevel', 'btec3', 'btec2'];
    const famName = { alevel: 'A-Level', btec3: 'BTEC Level 3', btec2: 'BTEC Level 2' };
    const famBlurb = { alevel: 'Paper-by-paper revision in the exam board’s exact layout', btec3: 'Nationals and AAQ: exam units and assignment units', btec2: 'Level 2 Technicals' };
    const st = { fam: 'all', q: '' };
    const open = new Set();
    const counts = (fam) => { const gs = all.filter(g => fam === 'all' || g.family === fam); return gs.length; };
    el.classList.add('rs', 'rs-home');
    el.innerHTML = `<div class="rs-hbar">
        <div class="rs-tabs" role="tablist" aria-label="Qualification">${[['all', 'All subjects']].concat(famOrder.filter(f => counts(f)).map(f => [f, famName[f]])).map(([k, t]) => `<button type="button" role="tab" class="rs-tab${k === 'all' ? ' on' : ''}" data-rs-fam="${k}" aria-selected="${k === 'all'}">${t}<i>${counts(k)}</i></button>`).join('')}</div>
        <label class="rs-search">${ICONS.search}<input type="search" placeholder="Search, e.g. “psychology”, “finance”, “anatomy”" aria-label="Search subjects and units" autocomplete="off"></label>
      </div>
      <div class="rs-hbody" aria-live="polite"></div>
      <div class="rs-hfoot"><span>Every unit has a revision guide, flashcards and quizzes. Exam units add real past papers, RA10 practice papers and the AI Examiner.</span><a href="/subjects" data-rs-go="/revision">Browse all subjects →</a></div>`;
    const card = (g, q) => {
      const ex = g.units.filter(u => /exam/i.test(u.kind)).length, other = g.units.length - ex;
      const isOpen = !!q || open.has(g.key);
      const target = g.units.length === 1 ? g.units[0].path : g.path;
      return `<article class="rs-hc${isOpen ? ' open' : ''}" style="--sc:${esc(g.color)}" data-rs-card="${esc(g.key)}">
        <button type="button" class="rs-hc-top" data-rs-go="${esc(target)}" aria-label="Open ${esc(g.name)}"><span class="rs-ico">${ICONS[g.icon]}</span>
          <span class="rs-txt"><span class="rs-hc-name"><b>${hl(g.name, q)}</b>${g.isNew ? '<span class="rs-new">New</span>' : ''}</span>
          <span class="rs-hc-qual">${esc(qualShort(g))}</span>
          <span class="rs-hc-meta"><span>${g.units.length} ${g.family === 'alevel' && !/Unit \d/.test(g.units[0].name) ? 'course' : 'unit'}${g.units.length === 1 ? '' : 's'}</span>${ex ? `<span>${ex} exam</span>` : ''}${other ? `<span>${other} ${g.units.some(u => /set task/i.test(u.kind)) && !g.units.some(u => /coursework/i.test(u.kind)) ? 'set task' : 'coursework'}</span>` : ''}</span></span></button>
        <div class="rs-units">${g.units.map((u, i) => unitRow(u, g, q, 'a').replace('class="rs-unit"', `class="rs-unit${!q && i >= PREVIEW ? ' more' : ''}"`)).join('')}</div>
        <div class="rs-hc-foot">${!q && g.units.length > PREVIEW ? `<button type="button" class="rs-more" data-rs-more="${esc(g.key)}" aria-expanded="${isOpen}">${isOpen ? 'Show fewer' : `Show all ${g.units.length}`} ${SVG('<path d="m6 9 6 6 6-6"/>')}</button>` : '<span></span>'}<button type="button" class="rs-open" data-rs-go="${esc(target)}">Open ${g.units.length > 1 ? 'subject' : 'course'} ${ICONS.arrow}</button></div>
      </article>`;
    };
    const paint = (ch) => {
      Object.assign(st, ch || {});
      const q = String(st.q || '').trim().toLowerCase();
      el.querySelectorAll('[data-rs-fam]').forEach(b => { const on = b.dataset.rsFam === st.fam; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      const list = filtered(st.fam, q);
      const body = el.querySelector('.rs-hbody');
      if (!list.length) { body.innerHTML = `<div class="rs-empty">No subjects match “${esc(st.q)}”. Try a shorter word, or <a href="/contact" onclick="event.preventDefault();window.openContactModal&&openContactModal('Request a subject')">ask us to add it</a>.</div>`; return; }
      body.innerHTML = famOrder.filter(f => list.some(g => g.family === f)).map(f => {
        const gs = list.filter(g => g.family === f);
        const n = gs.reduce((s, g) => s + g.units.length, 0);
        return `<section class="rs-sec"><div class="rs-sec-h"><h3>${famName[f]}</h3><span>${gs.length} subject${gs.length === 1 ? '' : 's'} · ${n} ${f === 'alevel' ? 'course' : 'unit'}${n === 1 ? '' : 's'} · ${famBlurb[f]}</span></div>
          <div class="rs-hgrid">${gs.map(g => card(g, q)).join('')}</div></section>`;
      }).join('');
    };
    el.addEventListener('click', (e) => {
      const m = e.target.closest('[data-rs-more]');
      if (!m) return;
      const k = m.dataset.rsMore, c = m.closest('.rs-hc');
      if (open.has(k)) open.delete(k); else open.add(k);
      const on = open.has(k);
      c.classList.toggle('open', on); m.setAttribute('aria-expanded', on);
      m.firstChild.nodeValue = on ? 'Show fewer ' : `Show all ${c.querySelectorAll('.rs-unit').length} `;
    });
    wire(el, paint);
    paint();
  }

  window.RA10Subjects = { groups, renderPage, renderMenu, renderSheet, renderSubject, renderHome, icons: ICONS, iconFor };
})();
