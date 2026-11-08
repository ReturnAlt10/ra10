/* RA10 — Assignment guide for internally assessed BTEC AAQ units.
   Reads window.AAQ_ASSIGN (criteria + assessor guidance, generated from the specification) and
   window.AAQ_CRIT_HELP (hand-written help per criterion: what it means, evidence to include, how to reach the next grade).
   Renders into #assignment-host when the "Assignment" tab opens. No AI marking of drafts (authenticity rules). */
(function () {
  'use strict';
  const D = window.AAQ_ASSIGN;
  if (!D) return;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const KEY = 'ra10_aaq_assign_' + location.pathname.replace(/[^a-z0-9]+/gi, '_');
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };
  const aimTitle = (a) => (D.aims.find(x => x.aim === a) || {}).title || ('Learning aim ' + a);
  const GRADE = { P: 'Pass', M: 'Merit', D: 'Distinction' };
  const VERBS = [
    ['Describe', 'Give a clear, detailed account of the features or steps. You do not need to say why.'],
    ['Explain', 'Say what something is and why or how it happens. Use “because”, “so” and “this means that”.'],
    ['Compare', 'Identify the main similarities and differences between two or more things.'],
    ['Analyse', 'Break the topic into its parts, show how they link and the effect of each, using evidence.'],
    ['Assess', 'Weigh up how important each factor is and come to a reasoned judgement.'],
    ['Discuss', 'Consider different aspects, viewpoints or factors and how they interact.'],
    ['Evaluate', 'Review the evidence on both sides (strengths and weaknesses) and reach a supported conclusion.'],
    ['Justify', 'Give reasons and evidence for your choices or recommendations.'],
    ['Produce / Develop / Plan', 'Create the practical outcome (design, plan, product, report) that meets the brief.'],
    ['Review / Reflect', 'Look back at what you did: what went well, what did not, and what you would change and why.']
  ];

  function render() {
    const host = document.getElementById('assignment-host');
    if (!host || host.dataset.done) return;
    host.dataset.done = '1';
    const help = window.AAQ_CRIT_HELP || {};
    const state = load();
    const groups = [];
    D.criteria.forEach(c => { let g = groups.find(x => x.key === c.aims); if (!g) { g = { key: c.aims, list: [] }; groups.push(g); } g.list.push(c); });
    const done = D.criteria.filter(c => state[c.code]).length;
    const guidance = (key) => {
      const gs = (D.guidance || []).filter(x => x.aims && key.split('').some(a => x.aims.indexOf(a) >= 0));
      return gs.length ? `<details class="aq-det"><summary>What assessors look for (from the specification)</summary><div>${gs.map(x => x.paras.map(p => `<p>${esc(p)}</p>`).join('')).join('')}</div></details>` : '';
    };
    host.innerHTML = `
      <div class="aq-banner"><b>Your assignment must be your own work.</b> Use RA10 to learn the theory and understand the criteria, then write your evidence yourself. Your teacher will tell you what help is allowed.</div>
      <div class="aq-top">
        <div class="aq-card"><h3>How the grade works</h3><p>To <b>Pass</b> you must meet every Pass criterion. A <b>Merit</b> needs every Pass and every Merit criterion, and a <b>Distinction</b> needs all of them. Higher criteria build on the lower ones, so aim for the Distinction wording from the start.</p></div>
        <div class="aq-card aq-prog"><h3>Your evidence checklist</h3><div class="aq-bar"><i style="width:${D.criteria.length ? Math.round(done / D.criteria.length * 100) : 0}%"></i></div><p><b id="aq-done">${done}</b> of ${D.criteria.length} criteria ticked as evidenced. Tick a criterion when your draft clearly covers it.</p></div>
      </div>
      ${(window.AAQ_CRIT_HELP && help._intro) ? `<div class="aq-card">${help._intro}</div>` : ''}
      ${groups.map(g => `<section class="aq-group">
        <h3 class="aq-gh"><span>${esc(g.key.split('').join(' + '))}</span>${esc(g.key.split('').map(aimTitle).join(' / '))}</h3>
        <div class="aq-grid">${['P', 'M', 'D'].map(gr => `<div class="aq-col aq-${gr}"><h4>${GRADE[gr]}</h4>${g.list.filter(c => c.grade === gr).map(c => `
          <article class="aq-crit${state[c.code] ? ' done' : ''}">
            <label><input type="checkbox" data-crit="${esc(c.code)}" ${state[c.code] ? 'checked' : ''}><span><code>${esc(c.code)}</code> ${esc(c.text)}</span></label>
            ${help[c.code] ? `<details class="aq-help"><summary>How to meet it</summary><div>${help[c.code]}</div></details>` : ''}
          </article>`).join('') || '<p class="aq-none">None</p>'}</div>`).join('')}</div>
        ${help['group:' + g.key] ? `<div class="aq-note">${help['group:' + g.key]}</div>` : ''}
        ${guidance(g.key)}
      </section>`).join('')}
      <section class="aq-card"><h3>What the command words mean</h3><div class="aq-verbs">${VERBS.map(v => `<div><b>${v[0]}</b><span>${esc(v[1])}</span></div>`).join('')}</div></section>
      ${help._tips ? `<section class="aq-card"><h3>Tips for a top grade</h3>${help._tips}</section>` : ''}`;
    host.addEventListener('change', (e) => {
      const b = e.target.closest('[data-crit]'); if (!b) return;
      const s = load(); s[b.dataset.crit] = b.checked; save(s);
      b.closest('.aq-crit').classList.toggle('done', b.checked);
      const n = D.criteria.filter(c => s[c.code]).length;
      const d = document.getElementById('aq-done'); if (d) d.textContent = n;
      const bar = host.querySelector('.aq-bar i'); if (bar) bar.style.width = Math.round(n / D.criteria.length * 100) + '%';
    });
  }
  document.addEventListener('click', (e) => { if (e.target.closest('[data-tab="assignment"], [data-goto="assignment"]')) setTimeout(render, 0); });
  if (/[#&]assignment/.test(location.hash)) document.addEventListener('DOMContentLoaded', render);
  window.AAQAssignment = { render };
})();
