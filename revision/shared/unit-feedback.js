/* RA10 — learner feedback for the quality ratings (loaded lazily by unit-ui.js).

   What learners see (signed-in only; nothing is shown to guests or in hidden catalogue frames):
     • Revision guide  – a slim bar: "Is this section helpful?  Yes · No · Report a mistake"
                         (follows the section being read; can be minimised)
     • Quiz            – "Report" link under every answered multiple-choice question
     • AI Examiner     – after each mark: "Was this mark fair?  Too low · Fair · Too high"
     • Unit menu       – "Report a mistake" for anything else (flashcards, papers, pages)
   Everything is written through the feedback_submit() RPC (supabase/sql/quality.sql) and read
   back only by the owner's Quality dashboard (/admin/quality/). */
(function () {
  'use strict';
  if (window.RA10UnitFeedback) return;
  const params = new URLSearchParams(location.search);
  if (params.has('ra10catalog') || params.has('ra10audit')) return;

  const UI = window.RA10UnitUI || {};
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const R = () => window.RA10 || null;
  const signedIn = () => { try { return !!(R() && R().isLoggedIn && R().isLoggedIn()); } catch (e) { return false; } };
  const client = () => { try { return R() && R().getClient ? R().getClient() : null; } catch (e) { return null; } };
  function unitKey() {
    try { const c = window.RA10Track && RA10Track.context(); if (c && c.unit) return c.unit; } catch (e) {}
    try { const u = window.RA10Units && RA10Units.fromLocation(location.pathname); if (u) return u.path; } catch (e) {}
    return location.pathname.replace(/\/index\.html.*$/, '').replace(/\/$/, '');
  }
  const SVG = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const IC = {
    up: SVG('<path d="M7 10v11H4V10zM7 10l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 17.6 21H7"/>'),
    down: SVG('<path d="M17 14V3h3v11zM17 14l-4 7a2 2 0 0 1-3-2l1-5H5a2 2 0 0 1-2-2.3l1.4-7A2 2 0 0 1 6.4 3H17"/>'),
    flag: SVG('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    x: SVG('<path d="M6 6l12 12M18 6 6 18"/>'),
    chev: SVG('<path d="m6 15 6-6 6 6"/>'),
    check: SVG('<path d="M5 12l5 5L19 7"/>')
  };

  /* ─────────────── styles ─────────────── */
  (function css() {
    const st = document.createElement('style');
    st.id = 'ux-fb-css';
    st.textContent = `
.ux-fb-bar{position:fixed!important;z-index:2147482800!important;left:50%;right:auto;transform:translateX(-50%);bottom:calc(18px + env(safe-area-inset-bottom,0px));top:auto;display:flex;align-items:center;gap:10px;max-width:min(560px,calc(100vw - 36px));padding:8px 8px 8px 14px;border-radius:16px;border:1px solid var(--line,#dfe3ea);background:var(--surface,#fff);color:var(--ink,#111);box-shadow:0 16px 40px -18px rgba(15,23,42,.45);font:500 .84rem/1.35 inherit;animation:uxFbIn .25s ease both}
@keyframes uxFbIn{from{opacity:0}}
.ux-fb-bar .t{min-width:0;flex:1}
.ux-fb-bar .t small{display:block;color:var(--ink-2,#5b6174);font-size:.72rem;font-weight:700;letter-spacing:.02em}
.ux-fb-bar .t span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700}
.ux-fb-btns{display:flex;gap:4px;flex:none}
.ux-fb-b{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:10px;border:1px solid var(--line,#dfe3ea);background:var(--surface,#fff);color:var(--ink,#111);font:700 .78rem/1 inherit;cursor:pointer;white-space:nowrap}
.ux-fb-b svg{width:15px;height:15px}
.ux-fb-b:hover{border-color:var(--accent,#4f46e5)}
.ux-fb-b.on.up{background:#dcfce7;border-color:#22c55e;color:#166534}
.ux-fb-b.on.down{background:#fee2e2;border-color:#ef4444;color:#991b1b}
.ux-fb-b.icon{padding:7px;border:0;background:transparent;color:var(--ink-2,#5b6174)}
.ux-fb-mini{position:fixed!important;z-index:2147482800!important;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;border:1px solid var(--line,#dfe3ea);background:var(--surface,#fff);color:var(--ink-2,#5b6174);font:700 .76rem/1 inherit;box-shadow:0 10px 26px -14px rgba(15,23,42,.45);cursor:pointer}
.ux-fb-mini svg{width:14px;height:14px}
.ux-fb-inline{display:flex;justify-content:flex-end;margin-top:8px;font-size:.78rem;color:var(--ink-2,#5b6174)}
.ux-fb-inline button{display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border:0;border-radius:8px;background:transparent;color:inherit;font:700 .76rem/1 inherit;cursor:pointer}
.ux-fb-inline button:hover{background:var(--surface-soft,rgba(0,0,0,.05));color:var(--ink,#111)}
.ux-fb-inline svg{width:13px;height:13px}
.ux-fb-ai{position:fixed!important;z-index:2147482850!important;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(460px,calc(100vw - 24px));display:grid;gap:10px;padding:14px 14px 12px;border-radius:18px;border:1px solid var(--line,#dfe3ea);background:var(--surface,#fff);color:var(--ink,#111);box-shadow:0 22px 50px -20px rgba(15,23,42,.55);font:500 .88rem/1.4 inherit;animation:uxFbIn .25s ease both}
.ux-fb-ai .h{display:flex;align-items:center;gap:10px}
.ux-fb-ai .h b{flex:1}
.ux-fb-ai .h .mk{flex:none;padding:3px 9px;border-radius:999px;background:color-mix(in srgb,var(--accent,#4f46e5) 12%,transparent);color:var(--accent,#4f46e5);font-weight:800;font-size:.8rem}
.ux-fb-ai .opts{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.ux-fb-ai .opts button{padding:9px 6px;border-radius:12px;border:1.5px solid var(--line,#dfe3ea);background:var(--surface,#fff);color:var(--ink,#111);font:700 .82rem/1.1 inherit;cursor:pointer}
.ux-fb-ai .opts button:hover{border-color:var(--accent,#4f46e5)}
.ux-fb-ai .opts button.on{background:var(--accent,#4f46e5);border-color:var(--accent,#4f46e5);color:#fff}
.ux-fb-ai .more{display:grid;gap:8px}
.ux-fb-ai .more[hidden]{display:none!important}
.ux-fb-ai .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.ux-fb-ai input[type=number]{width:80px}
.ux-fb-ai .foot{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:6px 8px;font-size:.78rem;color:var(--ink-2,#5b6174)}
.ux-fb-ai .foot button{white-space:nowrap;border:0;background:transparent;color:inherit;font:700 .78rem/1 inherit;cursor:pointer;padding:4px 6px;border-radius:8px;display:inline-flex;gap:5px;align-items:center}
.ux-fb-ai .foot svg{width:13px;height:13px}
.ux-fb-in,.ux-fb-ta{box-sizing:border-box;padding:9px 11px;border-radius:10px;border:1.5px solid var(--line-2,#cfd5df);background:var(--bg,#fff);color:var(--ink,#111);font:inherit;font-size:.88rem}
.ux-fb-ta{width:100%;min-height:84px;resize:vertical;line-height:1.45}
.ux-fb-go{padding:9px 14px;border-radius:11px;border:0;background:var(--accent,#4f46e5);color:#fff;font:700 .84rem/1 inherit;cursor:pointer}
.ux-fb-go:disabled{opacity:.6;cursor:default}
.ux-fb-thanks{display:flex;align-items:center;gap:8px;color:#15803d;font-weight:700}
.ux-fb-thanks svg{width:16px;height:16px}
.ux-fb-modal{position:fixed!important;inset:0!important;z-index:2147483100!important;display:grid;place-items:center;padding:16px;background:rgba(8,12,20,.5);backdrop-filter:blur(3px);animation:uxFbIn .18s ease both}
.ux-fb-card{width:min(520px,100%);max-height:calc(100vh - 32px);overflow:auto;display:grid;gap:14px;padding:20px;border-radius:20px;background:var(--surface,#fff);color:var(--ink,#111);box-shadow:0 30px 80px -30px rgba(0,0,0,.6);font:500 .9rem/1.45 inherit}
.ux-fb-card h3{margin:0;font-size:1.12rem;display:flex;align-items:center;gap:10px}
.ux-fb-card h3 svg{width:20px;height:20px;color:#dc2626}
.ux-fb-card .ctx{padding:10px 12px;border-radius:12px;background:var(--surface-soft,rgba(0,0,0,.04));font-size:.84rem;color:var(--ink-2,#444);max-height:110px;overflow:auto}
.ux-fb-cats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.ux-fb-cats label{display:flex;gap:8px;align-items:center;padding:9px 10px;border-radius:12px;border:1.5px solid var(--line,#dfe3ea);cursor:pointer;font-size:.84rem;font-weight:600}
.ux-fb-cats label:has(input:checked){border-color:var(--accent,#4f46e5);background:color-mix(in srgb,var(--accent,#4f46e5) 8%,transparent)}
.ux-fb-card .acts{display:flex;justify-content:flex-end;gap:8px}
.ux-fb-card .ghost{padding:9px 14px;border-radius:11px;border:1px solid var(--line,#dfe3ea);background:transparent;color:inherit;font:700 .84rem/1 inherit;cursor:pointer}
.ux-fb-card .err{color:#b91c1c;font-size:.82rem}
.ux-fb-menu{display:flex;align-items:center;gap:10px;width:100%;margin-top:6px;padding:12px 14px;border-radius:14px;border:1px dashed var(--line,#dfe3ea);background:transparent;color:var(--ink,#111);font:700 .88rem/1.2 inherit;cursor:pointer;text-align:left}
.ux-fb-menu svg{width:18px;height:18px;color:#dc2626}
.ux-fb-menu small{display:block;font-weight:500;color:var(--ink-2,#5b6174);font-size:.76rem;margin-top:2px}
@media (max-width:820px){
  .ux-fb-bar,.ux-fb-mini{right:74px;bottom:calc(84px + env(safe-area-inset-bottom,0px))}
  .ux-fb-bar{left:12px;transform:none;max-width:none;flex-wrap:wrap;gap:8px}
  .ux-fb-bar .t{flex-basis:100%}
  .ux-fb-ai{left:12px;right:74px;width:auto;transform:none;bottom:calc(84px + env(safe-area-inset-bottom,0px))}
  .ux-fb-cats{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){.ux-fb-bar,.ux-fb-ai,.ux-fb-modal{animation:none}}
`;
    document.head.appendChild(st);
  })();

  /* ─────────────── data ─────────────── */
  const votes = new Map();   // "target|ref" → vote (this learner, this unit)
  let votesLoaded = false;
  async function loadVotes() {
    if (votesLoaded || !signedIn() || !client()) return;
    votesLoaded = true;
    try {
      const { data } = await client().from('content_feedback').select('target, ref, vote').eq('unit', unitKey()).not('vote', 'is', null).neq('target', 'ai_mark').limit(2000);
      (data || []).forEach(r => votes.set(r.target + '|' + r.ref, r.vote));
      paintBar();
    } catch (e) { votesLoaded = false; }
  }
  async function submit(f) {
    const c = client();
    if (!c) throw new Error('Not connected');
    const { data, error } = await c.rpc('feedback_submit', {
      p_unit: unitKey(), p_target: f.target, p_ref: String(f.ref || '').slice(0, 200), p_title: f.title ? String(f.title).slice(0, 400) : null,
      p_vote: f.vote || null, p_category: f.category || null, p_comment: f.comment || null,
      p_score: f.score != null ? Number(f.score) : null, p_max: f.max != null ? Number(f.max) : null, p_meta: f.meta || null
    });
    if (error) throw new Error(/function .* does not exist|schema cache/i.test(error.message) ? 'Feedback is not switched on yet.' : error.message);
    return data;
  }

  /* ─────────────── report dialog ─────────────── */
  const CATS = [
    ['wrong_answer', 'The answer is wrong'], ['mark_scheme', 'Mark scheme is wrong'], ['unclear', 'Unclear or confusing'], ['typo', 'Spelling or typo'],
    ['off_spec', 'Not on the specification'], ['broken', 'Something is broken'], ['ai_mark', 'AI Examiner marked unfairly'], ['other', 'Something else']
  ];
  function openReport(ctx) {
    if (!signedIn()) { try { UI.requireSignIn && UI.requireSignIn('report a mistake'); } catch (e) {} return; }
    const ov = document.createElement('div');
    ov.className = 'ux-fb-modal';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Report a mistake');
    const pre = ctx.category || (ctx.target === 'ai_mark' ? 'ai_mark' : '');
    ov.innerHTML = `<form class="ux-fb-card">
      <h3>${IC.flag} Report a mistake</h3>
      ${ctx.title ? `<div class="ctx"><b>${esc(ctx.label || 'About')}:</b> ${esc(String(ctx.title).slice(0, 400))}</div>` : ''}
      <div class="ux-fb-cats" role="radiogroup" aria-label="What is wrong?">${CATS.map(([k, t]) => `<label><input type="radio" name="cat" value="${k}"${k === pre ? ' checked' : ''}> ${t}</label>`).join('')}</div>
      <label style="display:grid;gap:6px;font-weight:700;font-size:.84rem">What's wrong, and what should it say? <textarea class="ux-fb-ta" name="c" maxlength="1500" placeholder="e.g. Q3 says the answer is B but it should be C because…"></textarea></label>
      <div class="err" hidden></div>
      <div class="acts"><button type="button" class="ghost">Cancel</button><button type="submit" class="ux-fb-go">Send report</button></div>
    </form>`;
    document.documentElement.appendChild(ov);
    try { ov.style.fontFamily = getComputedStyle(document.body).fontFamily; } catch (e) {}
    const form = $('form', ov), err = $('.err', ov);
    const close = () => ov.remove();
    $('.ghost', ov).onclick = close;
    ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
    ov.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    setTimeout(() => { const f = $('input:checked', ov) || $('input', ov); f && f.focus(); }, 30);
    form.onsubmit = async (e) => {
      e.preventDefault();
      const cat = (form.querySelector('input[name=cat]:checked') || {}).value;
      const comment = form.c.value.trim();
      if (!cat) { err.textContent = 'Choose what is wrong.'; err.hidden = false; return; }
      if (comment.length < 4) { err.textContent = 'Please tell us a little about the problem so we can fix it.'; err.hidden = false; return; }
      const btn = $('.ux-fb-go', ov); btn.disabled = true; btn.textContent = 'Sending…';
      try {
        await submit({ target: ctx.target, ref: ctx.ref, title: ctx.title, category: cat, comment, score: ctx.score, max: ctx.max, meta: Object.assign({ view: document.documentElement.getAttribute('data-ux-view') || null }, ctx.meta || {}) });
        $('.ux-fb-card', ov).innerHTML = `<h3 style="color:#15803d">${IC.check} Thanks — report sent</h3><p style="margin:0">We check every report and fix mistakes as quickly as we can.</p><div class="acts"><button type="button" class="ux-fb-go">Done</button></div>`;
        $('.ux-fb-go', ov).onclick = close;
      } catch (ex) { err.textContent = ex.message || 'Could not send. Please try again.'; err.hidden = false; btn.disabled = false; btn.textContent = 'Send report'; }
    };
  }

  /* ─────────────── revision guide: section bar ─────────────── */
  let bar = null, cur = null;
  const MINI_KEY = 'ra10_fb_mini';
  const isMini = () => { try { return sessionStorage.getItem(MINI_KEY) === '1'; } catch (e) { return false; } };
  const setMini = (v) => { try { sessionStorage.setItem(MINI_KEY, v ? '1' : '0'); } catch (e) {} };
  function guideRoot() { return $('#view-guide.active') || $('section.view.active[id*="guide"]'); }
  function currentSection() {
    const root = guideRoot();
    if (!root || !UI.guideHeadings) return null;
    const hs = UI.guideHeadings(root);
    if (!hs.length) return null;
    const line = window.innerHeight * 0.45;
    let h = null;
    for (const x of hs) { if (x.getBoundingClientRect().top <= line) h = x; else break; }
    if (!h) h = hs[0].getBoundingClientRect().top < window.innerHeight ? hs[0] : null;
    if (!h) return null;
    return { id: UI.headingId ? UI.headingId(h) : h.textContent.trim().slice(0, 80), title: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 160) };
  }
  function paintBar() {
    const root = guideRoot();
    const show = signedIn() && !!root && !$('.ux-fb-modal') && !$('.ux-fb-ai');
    if (!show) { if (bar) { bar.remove(); bar = null; } return; }
    const sec = currentSection();
    if (!sec) { if (bar) { bar.remove(); bar = null; } return; }
    const mini = isMini();
    const want = mini ? 'mini' : 'full';
    if (!bar || bar.dataset.mode !== want) {
      if (bar) bar.remove();
      bar = document.createElement(mini ? 'button' : 'div');
      bar.dataset.mode = want;
      if (mini) {
        bar.type = 'button'; bar.className = 'ux-fb-mini'; bar.innerHTML = `${IC.chev} Rate this section`;
        bar.onclick = () => { setMini(false); cur = null; paintBar(); };
      } else {
        bar.className = 'ux-fb-bar';
        bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Rate this guide section');
        bar.innerHTML = `<div class="t"><small>Is this section helpful?</small><span></span></div>
          <div class="ux-fb-btns"><button type="button" class="ux-fb-b up" data-v="helpful" aria-pressed="false">${IC.up} Yes</button><button type="button" class="ux-fb-b down" data-v="not_helpful" aria-pressed="false">${IC.down} No</button><button type="button" class="ux-fb-b" data-report>${IC.flag} Report</button><button type="button" class="ux-fb-b icon" data-min aria-label="Minimise">${IC.x}</button></div>`;
        bar.addEventListener('click', onBarClick);
      }
      try { bar.style.fontFamily = getComputedStyle(document.body).fontFamily; } catch (e) {}
      document.documentElement.appendChild(bar);
      cur = null;
    }
    if (mini) return;
    if (!cur || cur.id !== sec.id) {
      cur = sec;
      $('.t span', bar).textContent = sec.title;
      $('.t span', bar).title = sec.title;
    }
    const v = votes.get('guide|' + sec.id) || null;
    $$('[data-v]', bar).forEach(b => { const on = b.dataset.v === v; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  }
  async function onBarClick(e) {
    if (e.target.closest('[data-min]')) { setMini(true); paintBar(); return; }
    if (!cur) return;
    if (e.target.closest('[data-report]')) { openReport({ target: 'guide', ref: cur.id, title: cur.title, label: 'Guide section' }); return; }
    const b = e.target.closest('[data-v]');
    if (!b) return;
    const key = 'guide|' + cur.id;
    const was = votes.get(key) || null;
    const v = was === b.dataset.v ? 'clear' : b.dataset.v;
    if (v === 'clear') votes.delete(key); else votes.set(key, v);
    paintBar();
    try {
      await submit({ target: 'guide', ref: cur.id, title: cur.title, vote: v });
      if (v === 'not_helpful') nudge('Thanks. What would make it better? Use Report to tell us.');
    } catch (ex) { if (was) votes.set(key, was); else votes.delete(key); paintBar(); nudge(ex.message); }
  }
  function nudge(text) {
    if (!bar || bar.dataset.mode !== 'full') return;
    const s = $('.t small', bar); if (!s) return;
    const old = 'Is this section helpful?';
    s.textContent = text;
    clearTimeout(nudge.t); nudge.t = setTimeout(() => { if (s.isConnected) s.textContent = old; }, 4500);
  }

  /* ─────────────── quiz: report link under answered questions ─────────────── */
  function scanQuiz() {
    if (!signedIn()) return;
    $$('.quiz-card').forEach(card => {
      if ($('.ux-fb-inline', card) || !$('.quiz-option.locked', card)) return;
      const q = (($('.quiz-q', card) || {}).textContent || '').trim();
      const id = (($('.tag.id', card) || {}).textContent || '').trim() || (UI.slug ? UI.slug(q).slice(0, 40) : q.slice(0, 40));
      const row = document.createElement('div');
      row.className = 'ux-fb-inline';
      row.innerHTML = `<button type="button">${IC.flag} Report a mistake in this question</button>`;
      $('button', row).onclick = () => openReport({ target: 'mcq', ref: id, title: q, label: 'Question' });
      card.appendChild(row);
    });
  }

  /* ─────────────── AI Examiner: was the mark fair? ─────────────── */
  let aiCard = null;
  function onMarked(ev) {
    if (!signedIn()) return;
    const d = (ev && ev.detail) || {};
    const q = d.question || {}, r = d.result || {};
    const earned = Number(r.earned), max = Number(r.total || r.max || q.marks || 0);
    if (!Number.isFinite(earned) || !max) return;
    if (aiCard) aiCard.remove();
    const ref = String(q.id || (UI.slug ? UI.slug(q.question || '').slice(0, 40) : 'q')) + '#' + Date.now().toString(36);
    const title = q.question || q.text || '';
    aiCard = document.createElement('div');
    aiCard.className = 'ux-fb-ai';
    aiCard.setAttribute('role', 'dialog'); aiCard.setAttribute('aria-label', 'Rate the AI Examiner mark');
    aiCard.innerHTML = `<div class="h"><b>Was this mark fair?</b><span class="mk">${esc(earned)}/${esc(max)}</span><button type="button" class="ux-fb-b icon" data-x aria-label="Close">${IC.x}</button></div>
      <div class="opts"><button type="button" data-v="too_low">Too low</button><button type="button" data-v="fair">Fair</button><button type="button" data-v="too_high">Too high</button></div>
      <div class="more" hidden><div class="row"><label for="ux-fb-should">What should it be?</label><input id="ux-fb-should" class="ux-fb-in" type="number" min="0" max="${esc(max)}" step="1" inputmode="numeric"> <span>/ ${esc(max)}</span></div>
        <textarea class="ux-fb-ta" maxlength="1000" placeholder="Optional: why? e.g. it ignored my evaluation paragraph"></textarea><div class="row"><button type="button" class="ux-fb-go" data-send>Send</button></div></div>
      <div class="foot"><span>Your votes help us make the AI Examiner more accurate.</span><button type="button" data-report>${IC.flag} Report question</button></div>`;
    try { aiCard.style.fontFamily = getComputedStyle(document.body).fontFamily; } catch (e) {}
    document.documentElement.appendChild(aiCard);
    if (bar) { bar.remove(); bar = null; }
    let chosen = null, sent = false;
    const card = aiCard;
    const done = (msg) => {
      sent = true;
      card.innerHTML = `<div class="ux-fb-thanks">${IC.check} ${esc(msg || 'Thanks for rating this mark.')}</div>`;
      setTimeout(() => { if (card.isConnected) card.remove(); if (aiCard === card) aiCard = null; paintBar(); }, 2200);
    };
    const send = async (extra) => {
      try {
        await submit({ target: 'ai_mark', ref, title, vote: chosen, score: earned, max, comment: extra && extra.comment, meta: Object.assign({ qid: q.id || null, verb: q.command_verb || null, paper: q.paper_id || null, spec: q.spec_code || null, words: String(d.answer || '').split(/\s+/).filter(Boolean).length }, extra && extra.should != null ? { should: extra.should } : {}) });
        done();
      } catch (ex) { done(ex.message); }
    };
    let idle = setTimeout(() => { if (!chosen && card.isConnected) { card.remove(); if (aiCard === card) aiCard = null; paintBar(); } }, 30000);
    card.addEventListener('click', (e) => {
      if (sent) return;
      if (e.target.closest('[data-x]')) { clearTimeout(idle); card.remove(); if (aiCard === card) aiCard = null; paintBar(); return; }
      if (e.target.closest('[data-report]')) { openReport({ target: 'question', ref: String(q.id || ref), title, label: 'Question', meta: { paper: q.paper_id || null } }); return; }
      const v = e.target.closest('[data-v]');
      if (v) {
        clearTimeout(idle);
        chosen = v.dataset.v;
        $$('[data-v]', card).forEach(b => b.classList.toggle('on', b === v));
        if (chosen === 'fair') { send(); return; }
        $('.more', card).hidden = false;
        const inp = $('#ux-fb-should', card);
        inp.value = chosen === 'too_low' ? Math.min(max, earned + 1) : Math.max(0, earned - 1);
        inp.focus();
        return;
      }
      if (e.target.closest('[data-send]')) {
        const raw = $('#ux-fb-should', card).value;
        const should = raw === '' ? null : Math.max(0, Math.min(max, Math.round(Number(raw))));
        send({ should, comment: $('textarea', card).value.trim() || null });
      }
    });
  }

  /* ─────────────── unit menu entry ─────────────── */
  function addMenuEntry(menu) {
    const body = $('.ux-mbody', menu);
    if (!body || $('.ux-fb-menu', body) || !signedIn()) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ux-fb-menu';
    b.innerHTML = `${IC.flag}<span>Report a mistake<small>A wrong answer, a typo or something that doesn't work</small></span>`;
    b.onclick = () => {
      const view = document.documentElement.getAttribute('data-ux-view') || 'page';
      try { UI.close && UI.close(); } catch (e) {}
      const sec = view === 'guide' ? currentSection() : null;
      openReport(sec ? { target: 'guide', ref: sec.id, title: sec.title, label: 'Guide section' }
        : { target: /flash/.test(view) ? 'flashcard' : /paper/.test(view) ? 'paper' : /quiz|practice|question/.test(view) ? 'question' : 'other', ref: view, title: document.title.replace(/\s*[|–-].*$/, ''), label: 'Page' });
    };
    body.appendChild(b);
  }

  /* ─────────────── wiring ─────────────── */
  window.addEventListener('ra10:ai-marked', onMarked);
  let t = null;
  const tick = () => { clearTimeout(t); t = setTimeout(() => { paintBar(); scanQuiz(); }, 160); };
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
  new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1 && n.classList && n.classList.contains('ux-menu')) addMenuEntry(n);
    tick();
  }).observe(document.body, { childList: true, subtree: true });
  new MutationObserver(tick).observe(document.documentElement, { attributes: true, attributeFilter: ['data-ux-view'] });
  setInterval(paintBar, 2500);
  function start() { loadVotes(); tick(); }
  try { R() && R().on && R().on('authchange', () => { votesLoaded = false; votes.clear(); start(); }); } catch (e) {}
  start();

  window.RA10UnitFeedback = { report: openReport, refresh: paintBar };
})();
