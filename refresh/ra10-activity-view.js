/* RA10 — shared renderer for activity_events (progress monitoring).
   RA10ActivityView.timeline(events, opts)  → HTML string: grouped by day, every question/answer/score
   RA10ActivityView.summary(summary)        → HTML string: totals, per-unit table, daily bars, weak topics
   RA10ActivityView.css()                   → injects the styles once */
(function () {
  'use strict';
  if (window.RA10ActivityView) return;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const unitName = (p) => { const u = window.RA10Units && RA10Units.byPath(p); return u ? u.short : (p ? String(p).replace('/revision/', '').replace(/\//g, ' › ') : ''); };
  const KIND = {
    page_view: ['Visited', '🧭', '#64748b'], view: ['Opened', '📂', '#64748b'], answer: ['Wrote an answer', '✍️', '#2563eb'],
    ai_examine: ['AI Examiner marked', '✦', '#7c3aed'], mcq: ['Quiz question', '⚡', '#f59e0b'], guide_section: ['Read the guide', '📘', '#0f766e'],
    paper_open: ['Opened a paper', '📄', '#be123c'], assignment: ['Assignment', '📋', '#ea580c'], download: ['Downloaded', '⤓', '#475569'], flashcard: ['Flashcards', '🃏', '#0891b2']
  };
  const VIEWS = { guide: 'Revision guide', quiz: 'Quick quiz', flash: 'Flashcards', practice: 'Practise by topic', browse: 'Question bank', mock: 'Mock exam', papers: 'Papers', pastpapers: 'Past papers', spec: 'Specification', progress: 'Progress', dashboard: 'Dashboard', calculator: 'Calculator' };
  const time = (d) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const day = (d) => new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const dur = (s) => !s ? '' : s < 60 ? Math.round(s) + 's' : s < 3600 ? Math.round(s / 60) + ' min' : (s / 3600).toFixed(1) + ' h';

  function css() {
    if (document.getElementById('ra10-av-css')) return;
    const st = document.createElement('style');
    st.id = 'ra10-av-css';
    st.textContent = `
.av-day{margin:18px 0 8px;font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--av-muted,#6b7280)}
.av-list{display:grid;gap:8px}
.av-ev{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:start;padding:12px 14px;border-radius:16px;background:var(--av-card,#fff);border:1px solid var(--av-line,#e5e7eb)}
.av-ic{display:grid;place-items:center;width:34px;height:34px;border-radius:11px;font-size:.95rem;background:color-mix(in srgb,var(--k) 14%,transparent);color:var(--k)}
.av-main{min-width:0}
.av-main b{font-size:.9rem}
.av-main .u{margin-left:6px;font-size:.74rem;font-weight:700;color:var(--av-muted,#6b7280)}
.av-q{margin:4px 0 0;font-size:.88rem;line-height:1.45}
.av-a{margin:6px 0 0;padding:8px 10px;border-radius:10px;background:var(--av-soft,#f3f4f6);font-size:.85rem;line-height:1.45;white-space:pre-wrap;max-height:9.5em;overflow:hidden;position:relative;cursor:pointer}
.av-a.open{max-height:none}
.av-a:not(.open)::after{content:'';position:absolute;left:0;right:0;bottom:0;height:2em;background:linear-gradient(transparent,var(--av-soft,#f3f4f6))}
.av-side{text-align:right;font-size:.74rem;color:var(--av-muted,#6b7280);white-space:nowrap}
.av-score{display:inline-block;margin-bottom:4px;padding:3px 8px;border-radius:99px;font-weight:800;font-size:.78rem;background:#e0e7ff;color:#3730a3}
.av-score.good{background:#dcfce7;color:#166534}.av-score.bad{background:#fee2e2;color:#991b1b}
.av-empty{padding:22px;text-align:center;border:1px dashed var(--av-line,#e5e7eb);border-radius:16px;color:var(--av-muted,#6b7280)}
.av-tot{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
.av-tot div{padding:14px;border-radius:16px;background:var(--av-card,#fff);border:1px solid var(--av-line,#e5e7eb)}
.av-tot b{display:block;font-size:1.5rem;line-height:1.1}
.av-tot span{font-size:.76rem;color:var(--av-muted,#6b7280)}
.av-bars{display:flex;align-items:flex-end;gap:3px;height:90px;padding:10px;border-radius:16px;background:var(--av-card,#fff);border:1px solid var(--av-line,#e5e7eb)}
.av-bars i{flex:1;min-width:4px;border-radius:4px 4px 0 0;background:linear-gradient(180deg,#8b5cf6,#2563eb);opacity:.85}
.av-tbl{width:100%;border-collapse:collapse;font-size:.86rem}
.av-tbl th,.av-tbl td{padding:9px 10px;border-bottom:1px solid var(--av-line,#e5e7eb);text-align:left}
.av-tbl th{font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;color:var(--av-muted,#6b7280)}
.av-pct{display:inline-flex;align-items:center;gap:8px}
.av-pct i{display:inline-block;width:70px;height:7px;border-radius:9px;background:var(--av-soft,#f3f4f6);overflow:hidden}
.av-pct i em{display:block;height:100%;background:var(--c,#22c55e)}
.av-weak{display:flex;flex-wrap:wrap;gap:6px}
.av-weak span{padding:5px 10px;border-radius:99px;background:#fee2e2;color:#991b1b;font-size:.78rem;font-weight:700}
`;
    document.head.appendChild(st);
  }

  function scoreTag(e) {
    if (e.max_score == null || e.score == null) return '';
    const pct = e.max_score ? e.score / e.max_score : 0;
    return `<span class="av-score ${pct >= 0.7 ? 'good' : pct < 0.4 ? 'bad' : ''}">${esc(+e.score)}/${esc(+e.max_score)}</span><br>`;
  }
  function label(e) {
    if (e.kind === 'view') return 'Opened ' + (VIEWS[e.view] || e.title || e.view || 'a section');
    if (e.kind === 'page_view') return 'Visited ' + (e.title || e.path || 'a page');
    if (e.kind === 'mcq') return e.score > 0 ? 'Quiz question — correct' : 'Quiz question — wrong';
    return (KIND[e.kind] || [e.kind])[0];
  }

  function timeline(events, opts) {
    css();
    opts = opts || {};
    if (!events || !events.length) return `<div class="av-empty">${esc(opts.empty || 'No activity yet.')}</div>`;
    let out = '', lastDay = '';
    events.forEach(e => {
      const d = day(e.created_at);
      if (d !== lastDay) { if (lastDay) out += '</div>'; out += `<p class="av-day">${esc(d)}</p><div class="av-list">`; lastDay = d; }
      const k = KIND[e.kind] || ['', '•', '#64748b'];
      const showQ = e.title && !['page_view', 'view'].includes(e.kind);
      const ans = e.answer && !['read', 'done'].includes(e.answer) ? e.answer : '';
      out += `<div class="av-ev" style="--k:${k[2]}"><span class="av-ic">${k[1]}</span><div class="av-main">
        <b>${esc(label(e))}</b>${e.unit ? `<span class="u">${esc(unitName(e.unit))}</span>` : ''}${opts.who && (e.display_name || e.email) ? `<span class="u">· ${esc(e.display_name || e.email)}</span>` : ''}
        ${showQ ? `<p class="av-q">${esc(e.title)}</p>` : ''}
        ${ans ? `<div class="av-a" title="Click to expand">${esc(ans)}</div>` : ''}</div>
        <div class="av-side">${scoreTag(e)}${esc(time(e.created_at))}${e.duration_s ? '<br>' + esc(dur(e.duration_s)) : ''}</div></div>`;
    });
    return out + '</div>';
  }

  function summary(s) {
    css();
    if (!s || !s.totals) return '';
    const t = s.totals;
    const tot = [[t.active_days || 0, 'active days'], [t.questions || 0, 'written answers'], [t.mcqs || 0, 'quiz answers' + (t.mcqs ? ` (${Math.round((t.mcq_correct || 0) / t.mcqs * 100)}% right)` : '')], [t.guide_sections || 0, 'guide sections read'], [t.papers || 0, 'papers opened'], [t.avg_pct != null ? t.avg_pct + '%' : '—', 'average mark'], [t.minutes ? dur(t.minutes * 60) : '—', 'time tracked']];
    const days = s.by_day || [];
    const max = Math.max(1, ...days.map(d => d.events));
    const units = s.by_unit || [];
    return `<div class="av-tot">${tot.map(x => `<div><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div>`).join('')}</div>
      ${days.length ? `<div class="av-bars" title="Activity per day">${days.map(d => `<i style="height:${Math.max(4, Math.round(d.events / max * 100))}%" title="${esc(d.day)}: ${esc(d.events)} actions"></i>`).join('')}</div>` : ''}
      ${units.length ? `<table class="av-tbl"><thead><tr><th>Unit</th><th>Actions</th><th>Questions</th><th>Average mark</th><th>Last active</th></tr></thead><tbody>${units.map(u => `<tr><td>${esc(unitName(u.unit))}</td><td>${esc(u.events)}</td><td>${esc(u.questions)}</td><td>${u.avg_pct != null ? `<span class="av-pct" style="--c:${u.avg_pct >= 70 ? '#22c55e' : u.avg_pct >= 40 ? '#f59e0b' : '#ef4444'}"><i><em style="width:${Math.min(100, u.avg_pct)}%"></em></i>${esc(u.avg_pct)}%</span>` : '—'}</td><td>${esc(u.last ? new Date(u.last).toLocaleDateString('en-GB') : '')}</td></tr>`).join('')}</tbody></table>` : ''}
      ${(s.weak || []).length ? `<div><p class="av-day">Weakest areas</p><div class="av-weak">${s.weak.map(w => `<span>${esc(w.topic || unitName(w.unit))} · ${esc(w.avg_pct)}%</span>`).join('')}</div></div>` : ''}`;
  }

  document.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('.av-a'); if (a) a.classList.toggle('open'); });
  window.RA10ActivityView = { timeline, summary, css, unitName };
})();
