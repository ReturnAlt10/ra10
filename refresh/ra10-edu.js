/* RA10 EDU in the site shell:
     • school invitation popup ("<teacher> has added you to <class> — Join school")
     • a different homepage for school students (their classes, assignments, teacher feedback)
       and for teachers / EDU admins (their classes, recent assignments, quick actions)
   Data comes from the edu_my_context() RPC. Loaded by index.html only. */
(function () {
  'use strict';
  if (window.RA10Edu) return;
  if (!document.getElementById('p-home') && document.readyState !== 'loading') return;   // only the site shell (not unit apps)

  const $ = (s, p) => (p || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const R = () => window.RA10 || null;
  const client = () => { try { return R() && R().getClient ? R().getClient() : null; } catch (e) { return null; } };
  const signedIn = () => { try { return !!(R() && R().isLoggedIn()); } catch (e) { return false; } };
  const units = () => (window.RA10Units ? RA10Units.all() : []);
  const unitOf = (p) => (window.RA10Units ? RA10Units.byPath(p) : null);
  let ctx = null, loading = null, personal = false;

  /* ── styles ── */
  (function css() {
    if (document.getElementById('ra10-edu-css')) return;
    const st = document.createElement('style');
    st.id = 'ra10-edu-css';
    st.textContent = `
body.edu-home-on:not(.edu-personal) #signed-in-dashboard{display:none!important}
.eh{--eh-c:var(--color-primary,#e11d48);display:grid;gap:18px;margin:8px 0 26px}
.eh-hero{position:relative;overflow:hidden;display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding:24px;border-radius:26px;color:#fff;background:radial-gradient(120% 140% at 0% 0%,color-mix(in srgb,var(--eh-c) 55%,#000),transparent 60%),linear-gradient(135deg,color-mix(in srgb,var(--eh-c) 85%,#0b1020),var(--eh-c) 55%,color-mix(in srgb,var(--eh-c) 60%,#a855f7));box-shadow:0 26px 60px -36px color-mix(in srgb,var(--eh-c) 80%,#000)}
.eh-hero::after{content:'';position:absolute;inset:0;opacity:.3;background-image:radial-gradient(rgba(255,255,255,.5) 1px,transparent 1.2px);background-size:18px 18px;-webkit-mask-image:linear-gradient(110deg,transparent 35%,#000 80%);mask-image:linear-gradient(110deg,transparent 35%,#000 80%);pointer-events:none}
.eh-logo{flex:none;width:68px;height:68px;border-radius:20px;background:#fff;display:grid;place-items:center;overflow:hidden;box-shadow:0 10px 24px -12px rgba(0,0,0,.5)}
.eh-logo img{width:100%;height:100%;object-fit:contain;padding:6px}
.eh-logo span{font-weight:800;font-size:1.5rem;color:var(--eh-c)}
.eh-who{flex:1;min-width:220px;position:relative;z-index:1}
.eh-who small{display:inline-block;padding:4px 10px;border-radius:99px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.25);font-weight:700;font-size:.74rem;letter-spacing:.04em;text-transform:uppercase}
.eh-who h2{margin:8px 0 2px;font-size:clamp(1.4rem,1rem + 1.6vw,2.1rem);line-height:1.1;color:#fff;letter-spacing:-.02em}
.eh-who p{margin:0;opacity:.88}
.eh-stats{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
.eh-stat{min-width:96px;padding:12px 14px;border-radius:18px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(8px)}
.eh-stat b{display:block;font-size:1.5rem;line-height:1}
.eh-stat span{font-size:.74rem;opacity:.85}
.eh-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:18px;align-items:start}
.eh-card{padding:18px;border-radius:24px;background:var(--color-surface,#fff);border:1px solid var(--color-border,#e5e7eb);color:var(--color-text,#111)}
.eh-card h3{margin:0 0 12px;display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:1.05rem}
.eh-card h3 a,.eh-card h3 button{font-size:.8rem;font-weight:700;color:var(--color-primary,#e11d48);background:none;border:0;cursor:pointer;text-decoration:none}
.eh-list{display:grid;gap:10px}
.eh-asg{position:relative;display:grid;grid-template-columns:6px minmax(0,1fr) auto;gap:14px;align-items:center;padding:14px 14px 14px 0;border-radius:18px;border:1px solid var(--color-border,#e5e7eb);background:var(--color-surface,#fff);overflow:hidden}
.eh-asg .strip{align-self:stretch;background:var(--cc,#2563eb)}
.eh-asg b{display:block;font-size:1rem}
.eh-asg small{display:block;color:var(--color-text-muted,#6b7280);font-size:.8rem;margin-top:2px}
.eh-asg .bar{height:7px;margin-top:8px;border-radius:9px;background:var(--color-surface-offset,#f3f4f6);overflow:hidden;max-width:260px}
.eh-asg .bar i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#f59e0b,#22c55e)}
.eh-due{display:inline-block;margin-left:6px;padding:2px 8px;border-radius:99px;font-size:.7rem;font-weight:800;background:#fef3c7;color:#92400e}
.eh-due.late{background:#fee2e2;color:#991b1b}.eh-due.done{background:#dcfce7;color:#166534}
.eh-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 16px;border-radius:14px;border:1px solid var(--color-border,#e5e7eb);background:var(--color-surface,#fff);color:var(--color-text,#111);font:700 .86rem/1 inherit;cursor:pointer;text-decoration:none;white-space:nowrap}
.eh-btn.pri{border:0;background:var(--color-primary,#e11d48);color:#fff}
.eh-btn:hover{filter:brightness(1.05);transform:translateY(-1px)}
.eh-classes{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.eh-class{display:grid;gap:8px;padding:14px;border-radius:18px;border:1px solid var(--color-border,#e5e7eb);background:linear-gradient(160deg,color-mix(in srgb,var(--cc,#2563eb) 10%,var(--color-surface,#fff)),var(--color-surface,#fff));text-align:left;color:inherit;font:inherit;cursor:pointer}
.eh-class:hover{border-color:var(--cc,#2563eb)}
.eh-class b{font-size:1rem}
.eh-class small{color:var(--color-text-muted,#6b7280)}
.eh-chips{display:flex;flex-wrap:wrap;gap:6px}
.eh-chip{padding:4px 9px;border-radius:99px;font-size:.72rem;font-weight:700;border:1px solid var(--color-border,#e5e7eb);background:var(--color-surface,#fff);color:var(--color-text,#111);cursor:pointer}
.eh-chip:hover{border-color:var(--color-primary,#e11d48)}
.eh-grid>*,.eh-list>*,.eh-card{min-width:0}
.eh-fb{min-width:0;overflow-wrap:anywhere;display:grid;gap:6px;padding:12px 14px;border-radius:16px;background:color-mix(in srgb,#8b5cf6 7%,var(--color-surface,#fff));border:1px solid color-mix(in srgb,#8b5cf6 30%,var(--color-border,#e5e7eb))}
.eh-fb.rec{background:color-mix(in srgb,#f59e0b 8%,var(--color-surface,#fff));border-color:color-mix(in srgb,#f59e0b 35%,var(--color-border,#e5e7eb))}
.eh-fb.new::before{content:'New';justify-self:start;padding:2px 8px;border-radius:99px;background:#8b5cf6;color:#fff;font-size:.66rem;font-weight:800}
.eh-fb p{margin:0;font-size:.9rem;line-height:1.5;white-space:pre-wrap}
.eh-fb small{color:var(--color-text-muted,#6b7280)}
.eh-fb .eh-btn{justify-self:start;max-width:100%;white-space:normal;text-align:left;line-height:1.3;padding:9px 14px;font-size:.82rem}
.eh-fb .eh-btn span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.eh-empty{padding:18px;border-radius:16px;border:1px dashed var(--color-border,#e5e7eb);color:var(--color-text-muted,#6b7280);text-align:center;font-size:.9rem}
.eh-actions{display:flex;flex-wrap:wrap;gap:8px}
.eh-toggle{justify-self:center;font-size:.82rem;color:var(--color-text-muted,#6b7280);background:none;border:0;text-decoration:underline;cursor:pointer}
.eh-personal{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:18px 20px;border-radius:22px;border:1.5px solid color-mix(in srgb,var(--color-primary,#e11d48) 30%,var(--color-border,#e5e7eb));background:linear-gradient(135deg,color-mix(in srgb,var(--color-primary,#e11d48) 8%,var(--color-surface,#fff)),var(--color-surface,#fff))}
.eh-personal-ico{flex:none;display:grid;place-items:center;width:52px;height:52px;border-radius:16px;font-size:1.5rem;background:color-mix(in srgb,var(--color-primary,#e11d48) 12%,var(--color-surface,#fff))}
.eh-personal div{flex:1;min-width:200px}
.eh-personal b{display:block;font-size:1.08rem;color:var(--color-text,#111)}
.eh-personal small{display:block;margin-top:2px;font-size:.86rem;color:var(--color-text-muted,#6b7280)}
.eh-personal-btn{min-height:48px;padding:0 22px;font-size:.95rem;border-radius:14px}
.eh-back{display:flex;justify-content:center;margin:6px 0 18px}
.eh-back .eh-btn{min-height:48px;padding:0 22px;font-size:.95rem;border-radius:14px}
@media(max-width:600px){.eh-personal-btn,.eh-back .eh-btn{width:100%}}
@media(max-width:860px){.eh-grid{grid-template-columns:1fr}.eh-hero{padding:18px;border-radius:22px}.eh-asg{grid-template-columns:6px minmax(0,1fr)}.eh-asg .eh-btn{grid-column:2;justify-self:start}}
.ei-ov{position:fixed!important;inset:0!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;height:100dvh!important;margin:0!important;z-index:2147483600!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:16px;box-sizing:border-box;background:rgba(8,12,20,.55);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);animation:eiIn .2s ease both;font-family:var(--font-b,system-ui,sans-serif)}
html.ei-lock,html.ei-lock body{overflow:hidden!important}
.ei-card{margin:auto}
@keyframes eiIn{from{opacity:0}}
.ei-card{width:min(440px,100%);padding:26px 22px 20px;border-radius:28px;background:var(--color-surface,#fff);color:var(--color-text,#111);text-align:center;box-shadow:0 30px 80px -24px rgba(0,0,0,.6);animation:eiPop .4s cubic-bezier(.2,.9,.3,1.25) both}
@keyframes eiPop{from{opacity:0;transform:translateY(20px) scale(.94)}}
.ei-logo{width:76px;height:76px;margin:0 auto 12px;border-radius:22px;background:#fff;border:1px solid var(--color-border,#e5e7eb);display:grid;place-items:center;overflow:hidden}
.ei-logo img{width:100%;height:100%;object-fit:contain;padding:8px}
.ei-card h3{margin:0 0 6px;font-size:1.3rem}
.ei-card p{margin:0 0 14px;color:var(--color-text-muted,#6b7280);line-height:1.5}
.ei-classes{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:0 0 18px}
.ei-classes span{padding:5px 11px;border-radius:99px;background:var(--color-primary-highlight,#ffe4e6);color:var(--color-primary,#e11d48);font-weight:700;font-size:.8rem}
.ei-act{display:flex;gap:8px}
.ei-act button{flex:1;height:48px;border-radius:14px;border:1px solid var(--color-border,#e5e7eb);background:var(--color-surface-offset,#f3f4f6);color:inherit;font:800 .92rem/1 inherit;cursor:pointer}
.ei-act .yes{border:0;background:var(--color-primary,#e11d48);color:#fff}
.ei-fine{display:block;margin-top:12px;font-size:.74rem;color:var(--color-text-muted,#6b7280)}
`;
    document.head.appendChild(st);
  })();

  /* ── data ── */
  async function load(force) {
    if (!signedIn() || !client()) return null;
    if (ctx && !force) return ctx;
    if (loading) return loading;
    loading = client().rpc('edu_my_context').then(({ data, error }) => { loading = null; if (error) return null; ctx = data; return data; }, () => { loading = null; return null; });
    return loading;
  }

  /* ── opening work inside a unit app ── */
  let deliverTimer = null, acked = '';
  window.addEventListener('message', (e) => { if (e.origin === location.origin && e.data && e.data.type === 'ra10:edu-ack') acked = String(e.data.key || ''); });
  function unitFrame(path) {
    let pageId = null;
    try { pageId = (typeof ROUTES !== 'undefined' && ROUTES[path]) || null; } catch (e) {}
    const page = pageId ? document.getElementById(pageId) : null;
    if (page) return page.querySelector('iframe');
    const key = String(path).replace(/^\//, '');
    return Array.from(document.querySelectorAll('.page-iframe iframe')).find(f => (f.getAttribute('src') || '').indexOf(key) >= 0) || null;
  }
  function openUnit(path, pending) {
    const u = unitOf(path);
    const target = u ? u.path : path;
    let msg = null;
    if (pending) {
      msg = Object.assign({ unit: target, ts: Date.now() }, pending);
      msg.key = (msg.assignmentId || (msg.open && msg.open.ref) || 'open') + ':' + msg.ts;
      try { localStorage.setItem('ra10_edu_pending', JSON.stringify(msg)); } catch (e) {}
    }
    if (typeof window.go !== 'function') { location.href = u ? u.publicPath : path; return; }
    window.go(target);
    if (!msg) return;
    // The unit app may already be open (no reload) or still loading: keep telling it until it confirms.
    clearInterval(deliverTimer);
    const t0 = Date.now();
    deliverTimer = setInterval(() => {
      if (acked === msg.key || Date.now() - t0 > 45000) { clearInterval(deliverTimer); return; }
      const f = unitFrame(target);
      if (f && f.getAttribute('loading') === 'lazy') f.removeAttribute('loading');
      try { if (f && f.contentWindow) f.contentWindow.postMessage({ type: 'ra10:edu-open', pending: msg }, location.origin); } catch (e) {}
    }, 600);
  }
  function startAssignment(a, ctxData) {
    const items = a.item_list || [];
    // an assignment made only of Study Hub lessons opens straight in Study Hub
    const sh = items.filter(it => it.type === 'studyhub');
    if (sh.length && sh.length === items.length) { location.href = '/study-hub/?assignment=' + encodeURIComponent(a.id) + (sh.length === 1 ? '&item=' + encodeURIComponent(sh[0].id) : ''); return; }
    const first = items.find(it => it.unit && it.type !== 'studyhub') || items.find(it => it.unit) || {};
    const path = first.unit || ((ctxData.classes || []).find(c => c.id === a.class_id) || {}).units?.[0];
    if (!path) { alert('Your teacher has not linked this assignment to a unit yet.'); return; }
    openUnit(path, { assignmentId: a.id });
  }
  function dueTag(a) {
    if (a.items && a.done >= a.items) return '<span class="eh-due done">Complete ✓</span>';
    if (!a.due_at) return '';
    const days = Math.ceil((new Date(a.due_at) - Date.now()) / 86400000);
    const t = days < 0 ? 'Overdue' : days === 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : 'Due ' + new Date(a.due_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return `<span class="eh-due${days < 0 ? ' late' : ''}">${esc(t)}</span>`;
  }

  /* ── invitation popup ── */
  function otherPopupOpen() {
    return !!document.querySelector('#transition-popup-overlay, .rxp-overlay, #legal-terms-overlay, .auth-overlay.open, #auth-overlay.open');
  }
  function showInvite(inv) {
    if (document.querySelector('.ei-ov')) return;
    // wait for any other pop-up (welcome notice, terms, sign-in) to close first
    if (otherPopupOpen()) { setTimeout(() => showInvite(inv), 1200); return; }
    const key = 'ra10_edu_invite_later_' + inv.school_id;
    try { if (sessionStorage.getItem(key)) return; } catch (e) {}
    const ov = document.createElement('div');
    ov.className = 'ei-ov';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'School invitation');
    const classes = (inv.classes || []);
    ov.innerHTML = `<div class="ei-card">
      <div class="ei-logo">${inv.logo_url ? `<img src="${esc(inv.logo_url)}" alt="">` : '🏫'}</div>
      <h3>Join ${esc(inv.school_name || 'your school')}?</h3>
      <p><b>${esc(inv.invited_by || inv.school_name)}</b> has added you as a ${esc(inv.role || 'student')}${classes.length ? ' to:' : '.'}</p>
      ${classes.length ? `<div class="ei-classes">${classes.map(c => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
      <div class="ei-act"><button type="button" class="no">Not now</button><button type="button" class="yes">Join school</button></div>
      <small class="ei-fine">${inv.role === 'teacher' ? 'You will be able to manage classes, set work and see your students’ progress.' : 'Your teachers will be able to see your work and progress on RA10 for their classes.'} <a href="#" data-decline>Decline invitation</a></small></div>`;
    (document.documentElement || document.body).appendChild(ov);   // outside body so no page transform/stacking context can trap it
    document.documentElement.classList.add('ei-lock');
    const close = () => { ov.remove(); document.documentElement.classList.remove('ei-lock'); };
    ov.querySelector('.no').addEventListener('click', () => { try { sessionStorage.setItem(key, '1'); } catch (e) {} close(); });
    ov.querySelector('[data-decline]').addEventListener('click', async (e) => {
      e.preventDefault();
      if (!confirm('Decline the invitation from ' + (inv.school_name || 'this school') + '?')) return;
      await client().rpc('edu_decline_invite', { p_school: String(inv.school_id) });
      close(); await load(true); render();
    });
    ov.querySelector('.yes').addEventListener('click', async (e) => {
      const b = e.currentTarget; b.disabled = true; b.textContent = 'Joining…';
      const { data, error } = await client().rpc('edu_accept_invite', { p_school: String(inv.school_id) });
      if (error || !data || !data.ok) { b.disabled = false; b.textContent = 'Join school'; alert('Could not join: ' + ((error && error.message) || 'please try again.')); return; }
      try { await R().refreshProfile(); } catch (err) {}
      close();
      await load(true); render();
      if (typeof window.go === 'function') window.go('/');
    });
    ov.querySelector('.yes').focus();
  }

  /* ── homepages ── */
  function hostEl() {
    const home = document.getElementById('p-home');
    if (!home) return null;
    let host = document.getElementById('edu-home');
    if (!host) {
      host = document.createElement('section');
      host.id = 'edu-home';
      host.className = 'eh';
      const c = home.querySelector('.c') || home;
      const anchor = c.querySelector('.hx-home');
      if (anchor) c.insertBefore(host, anchor); else c.prepend(host);
    }
    return host;
  }
  function heroHtml(c, roleLabel, stats) {
    const p = (R() && R().getProfile && R().getProfile()) || {};
    const first = String(p.display_name || p.full_name || p.username || '').trim().split(/\s+/)[0];
    const s = c.school || {};
    return `<header class="eh-hero" style="${s.brand_color ? '--eh-c:' + esc(s.brand_color) : ''}">
      <div class="eh-logo">${s.logo_url ? `<img src="${esc(s.logo_url)}" alt="">` : `<span>${esc((s.name || 'S').slice(0, 1))}</span>`}</div>
      <div class="eh-who"><small>${esc(roleLabel)} · ${esc(s.name || 'Your school')}</small><h2>Hi${first ? ' ' + esc(first) : ''} 👋</h2><p>${esc(stats.lead)}</p></div>
      <div class="eh-stats">${stats.items.map(x => `<div class="eh-stat"><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div>`).join('')}</div></header>`;
  }
  function classCards(c, teacher) {
    if (!(c.classes || []).length) return `<div class="eh-empty">${teacher ? 'No classes yet — create one in the school dashboard.' : 'You have not been added to a class yet.'}</div>`;
    return `<div class="eh-classes">${c.classes.map(k => `<div class="eh-class" style="--cc:${esc(k.color || '#2563eb')}" ${teacher ? `data-class="${esc(k.id)}" role="button" tabindex="0"` : ''}>
      <b>${esc(k.name)}</b><small>${teacher ? `${k.students || 0} students` : esc((k.teachers || []).join(', ') || 'Your class')}${k.year_group ? ' · ' + esc(k.year_group) : ''}</small>
      <div class="eh-chips">${(k.units || []).map(u => { const m = unitOf(u); return `<button type="button" class="eh-chip" data-unit="${esc(u)}">${esc(m ? m.short : u.split('/').pop())}</button>`; }).join('') || '<small>No units chosen yet</small>'}</div></div>`).join('')}</div>`;
  }

  function renderStudent(host, c) {
    const todo = (c.assignments || []).filter(a => !a.mine);
    const open = todo.filter(a => !(a.items && a.done >= a.items));
    const fb = c.comments || [];
    host.innerHTML = heroHtml(c, 'Student', {
      lead: open.length ? `You have ${open.length} piece${open.length === 1 ? '' : 's'} of work to do.` : 'You are all caught up — nice work!',
      items: [[String(open.length), 'to do'], [String(todo.length - open.length), 'completed'], [String((c.classes || []).length), 'classes']]
    }) + `<div class="eh-grid">
      <div class="eh-card"><h3>Your assignments</h3><div class="eh-list">${todo.length ? todo.map(a => {
        const n = a.items || 1, done = Math.min(n, a.done || 0);
        return `<div class="eh-asg" style="--cc:${esc(a.class_color || '#2563eb')}"><span class="strip"></span><div><b>${esc(a.title)}</b><small>${esc(a.class_name)} · ${done}/${n} done ${dueTag(a)}</small><div class="bar"><i style="width:${Math.round(done / n * 100)}%"></i></div></div>
          <button type="button" class="eh-btn${done >= n ? '' : ' pri'}" data-start="${esc(a.id)}">${done >= n ? 'Review' : done ? 'Continue' : 'Start'}</button></div>`;
      }).join('') : '<div class="eh-empty">No assignments yet. When your teacher sets work it appears here.</div>'}</div></div>
      <div class="eh-card"><h3>From your teachers</h3><div class="eh-list">${fb.length ? fb.slice(0, 8).map(f => `<div class="eh-fb${f.kind === 'recommendation' ? ' rec' : ''}${f.read ? '' : ' new'}">
        <p>${f.kind === 'recommendation' ? '⭐ ' : ''}${esc(f.body)}</p><small>${esc(f.author || 'Teacher')} · ${esc(new Date(f.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))}</small>
        ${f.recommendation && f.recommendation.unit ? `<div><button type="button" class="eh-btn pri" data-rec='${esc(JSON.stringify(f.recommendation))}'><span>${esc({ guide: 'Open this guide section', questions: 'Practise these questions', quiz: 'Take the quiz', flashcards: 'Open the flashcards', paper: 'Open the past paper' }[f.recommendation.type] || 'Open recommended work')} →</span></button></div>` : ''}</div>`).join('') : '<div class="eh-empty">Comments and recommended work from your teachers will show here.</div>'}</div></div>
    </div>
    <div class="eh-card"><h3>Your classes</h3>${classCards(c, false)}</div>
    <div class="eh-personal"><span class="eh-personal-ico">📊</span><div><b>Your personal dashboard</b><small>Your streak, XP, daily tasks and your own revision outside school work.</small></div><button type="button" class="eh-btn pri eh-personal-btn" data-personal>Open my personal dashboard →</button></div>`;
    const unread = fb.filter(f => !f.read).map(f => f.id);
    if (unread.length) setTimeout(() => client().rpc('edu_mark_comments_read', { p_ids: unread }), 4000);
  }

  function renderTeacher(host, c) {
    const mine = (c.assignments || []).filter(a => a.mine);
    const students = (c.classes || []).reduce((n, k) => n + (k.students || 0), 0);
    const admin = c.role === 'admin';
    host.innerHTML = heroHtml(c, admin ? 'EDU Admin' : 'Teacher', {
      lead: admin && !(c.school && c.school.onboarded) ? 'Finish setting up your school to get started.' : 'Here is what is happening in your classes.',
      items: [[String((c.classes || []).length), 'classes'], [String(students), 'students'], [String(mine.length), 'assignments']]
    }) + `<div class="eh-card"><div class="eh-actions">
        <a class="eh-btn pri" href="/school/">${admin && !(c.school && c.school.onboarded) ? 'Set up your school' : 'Open school dashboard'}</a>
        <a class="eh-btn" href="/school/#new-assignment">＋ Set an assignment</a>
        <a class="eh-btn" href="/school/#people">＋ Add students${admin ? ' or staff' : ''}</a>
        <a class="eh-btn" href="/school/#activity">Student activity</a></div></div>
      <div class="eh-grid">
        <div class="eh-card"><h3>Your classes <a href="/school/#classes">Manage</a></h3>${classCards(c, true)}</div>
        <div class="eh-card"><h3>Recent assignments</h3><div class="eh-list">${mine.length ? mine.slice(0, 6).map(a => `<div class="eh-asg" style="--cc:${esc(a.class_color || '#2563eb')}"><span class="strip"></span><div><b>${esc(a.title)}</b><small>${esc(a.class_name)} · ${a.submitted || 0} submitted ${dueTag(Object.assign({}, a, { items: 0 }))}</small></div><a class="eh-btn" href="/school/#assignment=${esc(a.id)}">Review</a></div>`).join('') : '<div class="eh-empty">No assignments yet.</div>'}</div></div>
      </div>
      <div class="eh-personal"><span class="eh-personal-ico">📊</span><div><b>Your personal dashboard</b><small>Your streak, XP, daily tasks and your own revision outside school work.</small></div><button type="button" class="eh-btn pri eh-personal-btn" data-personal>Open my personal dashboard →</button></div>`;
  }

  async function render() {
    const c = await load();
    document.body.classList.remove('edu-home-on');
    const host = document.getElementById('edu-home');
    if (!c || !c.signed_in) { if (host) host.remove(); return; }
    // the RA10 owner account never gets EDU screens or school invitations
    if (String(c.email || '').toLowerCase() === 'mistry.hashim@icloud.com') { if (host) host.remove(); document.body.classList.remove('edu-home-on'); return; }
    (c.invites || []).slice(0, 1).forEach(showInvite);
    // safety net: anyone who teaches a class gets the teacher homepage, whatever their membership says
    if ((c.role === 'student' || !c.role) && (c.classes || []).some(k => k.my_role === 'teacher')) c.role = 'teacher';
    if (!c.role) { if (host) host.remove(); return; }
    const h = hostEl();
    if (!h) return;
    if (c.role === 'student') renderStudent(h, c); else renderTeacher(h, c);
    h.hidden = personal;
    document.body.classList.add('edu-home-on');
    document.body.classList.toggle('edu-personal', personal);
    if (!h._bound) {
      h._bound = true;
      h.addEventListener('click', (e) => {
        const st = e.target.closest('[data-start]');
        if (st) { const a = (ctx.assignments || []).find(x => String(x.id) === st.dataset.start); if (a) startAssignment(a, ctx); return; }
        const u = e.target.closest('[data-unit]');
        if (u) { e.stopPropagation(); openUnit(u.dataset.unit); return; }
        const r = e.target.closest('[data-rec]');
        if (r) { try { const rec = JSON.parse(r.dataset.rec); openUnit(rec.unit, { open: { view: rec.type === 'guide' ? 'guide' : rec.type === 'quiz' ? 'quiz' : rec.type === 'paper' ? 'pastpapers' : rec.type === 'flashcards' ? 'flash' : 'practice', ref: rec.ref, title: rec.title } }); } catch (err) {} return; }
        const k = e.target.closest('[data-class]');
        if (k) { location.href = '/school/#class=' + encodeURIComponent(k.dataset.class); return; }
        if (e.target.closest('[data-personal]')) { personal = !personal; render(); }
      });
      h.addEventListener('keydown', (e) => { const k = e.target.closest('[data-class]'); if (k && e.key === 'Enter') location.href = '/school/#class=' + encodeURIComponent(k.dataset.class); });
    }
    // a tidy toggle back from the personal dashboard
    let back = document.getElementById('edu-home-back');
    if (personal && !back) {
      back = document.createElement('div');
      back.id = 'edu-home-back'; back.className = 'eh-back';
      back.innerHTML = `<button type="button" class="eh-btn pri">← Back to my ${c.role === 'student' ? 'school' : 'teaching'} homepage</button>`;
      back.querySelector('button').addEventListener('click', () => { personal = false; back.remove(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
      h.insertAdjacentElement('afterend', back);
    } else if (!personal && back) back.remove();
  }

  function boot() {
    if (!R()) { setTimeout(boot, 400); return; }
    try { R().on('authchange', () => { ctx = null; setTimeout(render, 300); }); } catch (e) {}
    let tries = 0;
    const wait = () => { if (signedIn() && client()) render(); else if (++tries < 40) setTimeout(wait, 500); };
    wait();
    window.addEventListener('ra10:route', () => { if (location.pathname === '/' || location.pathname === '') { ctx = null; render(); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.RA10Edu = { refresh: () => load(true).then(render), context: () => ctx, openUnit };
})();
