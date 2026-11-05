/* RA10 Schools — one app for EDU admins and teachers (students are sent to their homepage).
   Routes (hash): #overview #classes #class=ID #people #new-assignment[&class=ID] #assignment=ID
                  #student=UUID #activity #settings      onboarding runs first for a new EDU admin. */
(function () {
  'use strict';
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const main = $('#sc-main');
  const UNITS = () => (window.RA10Units ? RA10Units.all() : []);
  const unitOf = (p) => (window.RA10Units ? RA10Units.byPath(p) : null);
  const COLORS = ['#2563eb', '#7c3aed', '#e11d48', '#ea580c', '#16a34a', '#0f766e', '#0891b2', '#ca8a04', '#db2777', '#475569'];
  const S = { ctx: null, sb: null, me: null, profile: null, school: null, role: null, classes: [], people: null, cat: {}, rosters: {} };

  const ICON = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>', classes: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/>',
    people: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    task: '<path d="M9 11l3 3 8-8"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>', activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

  /* ───────────── helpers ───────────── */
  function toast(msg, ms) { const t = $('#sc-toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), ms || 3200); }
  function initials(s) { return String(s || '?').replace(/@.*/, '').split(/[\s._-]+/).map(w => w[0]).join('').slice(0, 2).toUpperCase(); }
  function avatar(p) { return `<span class="sc-av">${p && p.profile_pic_url ? `<img src="${esc(p.profile_pic_url)}" alt="">` : esc(initials((p && (p.display_name || p.email)) || '?'))}</span>`; }
  function ago(d) {
    if (!d) return 'Never';
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 90) return 'Just now'; if (s < 3600) return Math.round(s / 60) + ' min ago'; if (s < 86400) return Math.round(s / 3600) + ' h ago';
    if (s < 86400 * 14) return Math.round(s / 86400) + ' days ago';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
  function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'No due date'; }
  function myName() { const p = S.profile || {}; return p.display_name || p.full_name || p.username || S.me.email; }
  async function api(action, body) {
    const s = RA10.getSession();
    const raw = RA10._raw || {};
    const res = await fetch((raw.SUPABASE_URL || 'https://tcrrgsylxbyyrmnouihl.supabase.co') + '/functions/v1/edu-manage', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.access_token, apikey: raw.SUPABASE_ANON_KEY || '' },
      body: JSON.stringify(Object.assign({ action }, body || {}))
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok && !data.ok) throw new Error(data.error || ('Request failed (' + res.status + ')'));
    return data;
  }
  function modal(html, onMount) {
    const m = document.createElement('div');
    m.className = 'sc-modal';
    m.innerHTML = `<div class="sc-modal-card" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(m);
    const close = () => m.remove();
    m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
    if (onMount) onMount(m, close);
    const f = $('input, textarea, select', m); f && f.focus();
    return { el: m, close };
  }
  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ''));
    const parts = h.split('&');
    const [view, id] = (parts[0] || 'overview').split('=');
    const q = {}; parts.slice(1).forEach(p => { const [k, v] = p.split('='); q[k] = v; });
    return { view: view || 'overview', id, q };
  }
  function nav() {
    const n = $('#sc-nav');
    const r = route().view;
    const on = (v) => r === v || (v === 'classes' && r === 'class') || (v === 'new-assignment' && r === 'assignment');
    n.innerHTML = `
      <a href="#overview" class="${on('overview') ? 'on' : ''}">${svg('home')}Overview</a>
      <a href="#classes" class="${on('classes') ? 'on' : ''}">${svg('classes')}Classes</a>
      <a href="#people" class="${on('people') ? 'on' : ''}">${svg('people')}${S.role === 'admin' ? 'Students & staff' : 'Students'}</a>
      <a href="#new-assignment" class="${on('new-assignment') ? 'on' : ''}">${svg('task')}Assignments</a>
      <a href="#activity" class="${on('activity') ? 'on' : ''}">${svg('activity')}Student activity</a>
      ${S.role === 'admin' ? `<p class="sc-navlabel">School</p><a href="#settings" class="${on('settings') ? 'on' : ''}">${svg('settings')}School settings</a>` : ''}`;
    n.hidden = false;
  }
  function schoolChip() {
    const s = S.school;
    $('#sc-school').innerHTML = s ? `${s.logo_url ? `<img src="${esc(s.logo_url)}" alt="">` : ''}<span>${esc(s.name)}</span><span class="sc-badge ${S.role === 'admin' ? 'brand' : 'violet'}">${S.role === 'admin' ? 'EDU Admin' : 'Teacher'}</span>` : '';
  }

  /* ───────────── data ───────────── */
  async function loadCtx() {
    const { data, error } = await S.sb.rpc('edu_my_context');
    if (error) throw error;
    S.ctx = data; S.role = data.role; S.school = data.school || null;
    // safety net: teaching a class means teacher tools, whatever the membership row says
    if ((S.role === 'student' || !S.role) && (data.classes || []).some(k => k.my_role === 'teacher')) S.role = 'teacher';
    return data;
  }
  async function loadClasses() {
    if (!S.school) { S.classes = []; return []; }
    const { data, error } = await S.sb.from('edu_classes').select('*').eq('school_id', String(S.school.id)).eq('archived', false).order('name');
    if (error) throw error;
    S.classes = data || [];
    return S.classes;
  }
  async function loadPeople(force) {
    if (S.people && !force) return S.people;
    const { data, error } = await S.sb.rpc('edu_school_people', { p_school: String(S.school.id) });
    if (error) throw error;
    S.people = data || [];
    return S.people;
  }
  async function roster(classId, force) {
    if (S.rosters[classId] && !force) return S.rosters[classId];
    const { data, error } = await S.sb.rpc('edu_class_roster', { p_class: classId });
    if (error) throw error;
    S.rosters[classId] = data || [];
    return S.rosters[classId];
  }
  // A unit's question bank / quiz / guide sections, read from the unit app itself (hidden frame).
  function catalog(unitPath) {
    if (S.cat[unitPath]) return Promise.resolve(S.cat[unitPath]);
    try { const c = JSON.parse(sessionStorage.getItem('ra10_cat_' + unitPath) || 'null'); if (c) { S.cat[unitPath] = c; return Promise.resolve(c); } } catch (e) {}
    const u = unitOf(unitPath);
    if (!u) return Promise.reject(new Error('Unknown unit'));
    return new Promise((resolve, reject) => {
      const f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
      f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:900px;visibility:hidden;border:0';
      f.src = u.app + '?ra10catalog=1';
      const done = (c, err) => { window.removeEventListener('message', onMsg); clearTimeout(t); f.remove(); if (err) reject(err); else resolve(c); };
      const onMsg = (e) => {
        if (e.origin !== location.origin || !e.data || e.data.type !== 'ra10:catalog' || e.source !== f.contentWindow) return;
        const c = e.data.catalog; S.cat[unitPath] = c;
        try { sessionStorage.setItem('ra10_cat_' + unitPath, JSON.stringify(c)); } catch (err) {}
        done(c);
      };
      const t = setTimeout(() => done(null, new Error('The unit took too long to load. Try again.')), 40000);
      window.addEventListener('message', onMsg);
      document.body.appendChild(f);
    });
  }

  /* ───────────── boot ───────────── */
  async function boot() {
    let n = 0;
    while (!window.RA10 && n++ < 60) await new Promise(r => setTimeout(r, 100));
    try { await RA10.init(); } catch (e) { console.warn(e); }
    $('#sc-theme').addEventListener('click', () => {
      const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('ra10-theme', t); } catch (e) {}
    });
    if (!RA10.isLoggedIn()) return signInScreen();
    S.sb = RA10.getClient();
    S.me = RA10.getSession().user;
    S.profile = RA10.getProfile();
    try { await loadCtx(); } catch (e) { return fail('We could not load your school. If this is the first time, the EDU database update may not have been installed yet. (' + (e.message || e) + ')'); }

    const inviteFor = new URLSearchParams(location.search).get('invite');
    const invites = S.ctx.invites || [];
    if (invites.length && (inviteFor || !S.role)) return inviteScreen(invites.find(i => String(i.school_id) === inviteFor) || invites[0]);
    if (S.role === 'student') return studentScreen();
    if (!S.role) return comingSoon();
    if (S.role === 'admin' && !(S.school && S.school.onboarded)) return onboarding();
    await loadClasses();
    schoolChip();
    window._scBound = true;
    window.addEventListener('hashchange', render);
    render();
  }
  function fail(msg) { main.innerHTML = `<div class="sc-card"><h2>Something went wrong</h2><p class="sc-muted">${esc(msg)}</p><a class="sc-btn" href="/">Back to RA10</a></div>`; }
  function signInScreen() {
    main.innerHTML = `<div class="sc-coming"><h1>Sign in to RA10 Schools</h1><p class="sc-muted">Use the account your school invited you with, then come back to ra10.co.uk/school.</p>
      <p><a class="sc-btn pri" href="/auth">Sign in</a></p></div>`;
    try { sessionStorage.setItem('ra10_after_auth', location.pathname + location.search + location.hash); } catch (e) {}
  }
  function comingSoon() {
    main.innerHTML = `<div class="sc-coming"><span class="sc-badge brand">Coming soon</span><h1 style="margin:12px 0 8px;font-size:clamp(1.8rem,1.2rem + 2vw,2.6rem)">RA10 for Schools</h1>
      <p class="sc-muted">One membership for your whole school: every student and member of staff, every subject on RA10, and tools for teachers.</p>
      <div class="sc-plan"><span class="sc-muted">EDU membership</span><b>£100<small style="font-size:1rem;color:var(--ink-2)">/year</small></b><span class="sc-muted">per school · unlimited students and staff</span></div>
      <div class="sc-feats">
        <div><b>🏫 Set up in minutes</b><br>Enter your website — our AI finds your logo and the subjects you teach.</div>
        <div><b>👩‍🏫 Classes & assignments</b><br>Set topics, exact exam questions, quizzes or guide sections.</div>
        <div><b>🔍 See every answer</b><br>Every question a student completes, what they wrote and their marks.</div>
        <div><b>✦ AI progress analysis</b><br>Strengths, gaps and next steps for each student and class.</div>
      </div>
      <p class="sc-muted sc-small" style="margin-top:20px">School plans aren't on sale yet. If your school has been set up already, ask your EDU admin to invite you.</p></div>`;
  }
  function inviteScreen(inv) {
    main.innerHTML = `<div class="sc-coming"><div class="sc-hero" style="justify-content:center;text-align:left">${inv.logo_url ? `<span class="logo"><img src="${esc(inv.logo_url)}" alt=""></span>` : ''}<div><h1>Join ${esc(inv.school_name)}</h1><p>${esc(inv.invited_by)} added you as a ${esc(inv.role)}${(inv.classes || []).length ? ' to ' + esc(inv.classes.join(', ')) : ''}.</p></div></div>
      <p class="sc-muted">When you join, your teachers can see your RA10 work and progress for their classes.</p>
      <div class="sc-row" style="justify-content:center"><button class="sc-btn" data-dec>Decline</button><button class="sc-btn pri" data-acc>Join school</button></div></div>`;
    $('[data-acc]', main).onclick = async (e) => {
      e.target.disabled = true;
      const { data, error } = await S.sb.rpc('edu_accept_invite', { p_school: String(inv.school_id) });
      if (error || !data || !data.ok) { e.target.disabled = false; return toast('Could not join: ' + ((error && error.message) || 'try again')); }
      try { await RA10.refreshProfile(); } catch (err) {}
      toast('Welcome to ' + inv.school_name + '!');
      setTimeout(() => { location.href = inv.role === 'teacher' ? '/school/' : '/'; }, 900);
    };
    $('[data-dec]', main).onclick = async () => { if (!confirm('Decline this invitation?')) return; await S.sb.rpc('edu_decline_invite', { p_school: String(inv.school_id) }); location.href = '/'; };
  }
  function studentScreen() {
    const a = (S.ctx.assignments || []).filter(x => !x.mine);
    main.innerHTML = `<div class="sc-coming"><h1>Your school work lives on your homepage</h1><p class="sc-muted">${esc(S.school ? S.school.name : 'Your school')} · ${a.length} assignment${a.length === 1 ? '' : 's'}</p><p><a class="sc-btn pri" href="/">Go to my homepage</a></p></div>`;
  }

  /* ───────────── onboarding ───────────── */
  function onboarding(prefill) {
    $('#sc-nav').hidden = !prefill;   // first-time set-up is full screen; Settings keeps the menu
    const st = Object.assign({ step: 1, name: (S.school && S.school.name) || '', website: (S.school && S.school.website) || '', scan: null, logo: (S.school && S.school.logo_url) || '', units: new Set((S.school && S.school.units) || []), subjects: (S.school && S.school.offered_subjects) || [], color: (S.school && S.school.brand_color) || COLORS[2] }, prefill || {});
    const steps = (n) => `<div class="sc-steps">${[1, 2, 3].map(i => `<span class="${i <= n ? 'on' : ''}"></span>`).join('')}</div>`;
    const step1 = () => {
      main.innerHTML = `<div class="sc-onb">${steps(1)}<div class="sc-onb-hero"><span class="sc-badge brand">EDU admin · step 1 of 3</span><h1>Let's set up your school</h1><p>Tell us your school's name and website. Our AI reads the website to find your logo and the subjects you teach, then suggests the RA10 courses to turn on.</p></div>
        <div class="sc-card"><div class="sc-field"><label for="on-name">School name</label><input id="on-name" placeholder="e.g. Riverside Academy" value="${esc(st.name)}"></div>
        <div class="sc-field"><label for="on-web">School website</label><input id="on-web" placeholder="www.yourschool.org.uk" value="${esc(st.website)}" inputmode="url"><small>We only read public pages (home, curriculum, sixth form).</small></div>
        <div class="sc-row"><button class="sc-btn ai" id="on-scan">✦ Scan our website</button><button class="sc-btn ghost" id="on-skip">Skip — I'll choose subjects myself</button></div></div></div>`;
      $('#on-scan').onclick = async () => {
        st.name = $('#on-name').value.trim(); st.website = $('#on-web').value.trim();
        if (!st.name) return toast('Enter your school name first.');
        if (!st.website) return toast('Enter your website, or press Skip.');
        main.innerHTML = `<div class="sc-onb">${steps(2)}<div class="sc-card sc-scan"><span class="orb"></span><h2 style="margin:0">Reading ${esc(st.website)}…</h2><p class="sc-muted" id="on-msg">Finding your logo</p></div></div>`;
        const msgs = ['Finding your logo', 'Reading your curriculum pages', 'Working out which subjects you teach', 'Matching them to RA10 courses'];
        let i = 0; const iv = setInterval(() => { const m = $('#on-msg'); if (m) m.textContent = msgs[++i % msgs.length]; }, 2200);
        try {
          const r = await api('scan-school', { website: st.website, name: st.name, catalog: UNITS().map(u => ({ path: u.path, name: u.name, subject: u.subject, qualification: u.qual, keywords: u.keywords })) });
          clearInterval(iv);
          if (!r.ok) { toast(r.error || 'We could not read that website.', 5000); return step1(); }
          st.scan = r;
          st.website = r.website || st.website;
          if (r.school_name && r.school_name.length > 3 && !/home|welcome/i.test(r.school_name)) st.name = st.name || r.school_name;
          st.logo = (r.logos && r.logos[0] && r.logos[0].url) || st.logo;
          st.subjects = r.subjects || [];
          st.units = new Set((r.matches || []).filter(m => m.confidence !== 'low').map(m => m.path));
          step3();
        } catch (e) { clearInterval(iv); toast(e.message || 'Scan failed', 5000); step1(); }
      };
      $('#on-skip').onclick = () => { st.name = $('#on-name').value.trim(); st.website = $('#on-web').value.trim(); if (!st.name) return toast('Enter your school name first.'); step3(); };
    };
    const step3 = () => {
      const r = st.scan || {};
      const why = {}; (r.matches || []).forEach(m => { why[m.path] = m; });
      const logos = (r.logos || []).slice(0, 6);
      main.innerHTML = `<div class="sc-onb">${steps(3)}<div class="sc-onb-hero"><span class="sc-badge brand">Step 3 of 3 · check and finish</span><h1>${r.ok ? 'Here is what we found' : 'Choose your courses'}</h1>${r.summary ? `<p>${esc(r.summary)}</p>` : ''}</div>
        <div class="sc-card"><h2>School details</h2>
          <div class="sc-field"><label for="on-name2">School name</label><input id="on-name2" value="${esc(st.name)}"></div>
          <div class="sc-field"><label>Logo</label>${logos.length ? `<div class="sc-logos">${logos.map((l, i) => `<button type="button" class="sc-logo-opt${l.url === st.logo ? ' on' : ''}" data-logo="${esc(l.url)}" title="${esc(l.kind)}"><img src="${esc(l.url)}" alt="Logo option ${i + 1}" onerror="this.closest('button').remove()"></button>`).join('')}</div>` : ''}
            <input id="on-logo" placeholder="…or paste a logo image URL" value="${esc(st.logo)}"></div>
          <div class="sc-field"><label>School colour</label><div class="sc-colors">${COLORS.map(c => `<label style="--c:${c}"><input type="radio" name="on-color" value="${c}"${c === st.color ? ' checked' : ''}></label>`).join('')}</div></div>
        </div>
        ${st.subjects.length ? `<div class="sc-card"><h2>Subjects on your website <span class="sc-badge violet">${st.subjects.length} found</span></h2><div class="sc-subjects">${st.subjects.map(s => `<span>${esc(s)}</span>`).join('')}</div></div>` : ''}
        <div class="sc-card"><h2>RA10 courses for your school <span class="sc-muted sc-small">${r.ok ? 'We ticked the ones your website mentions' : 'Tick the ones you teach'}</span></h2>
          <div class="sc-units">${UNITS().map(u => `<label class="sc-unit"><input type="checkbox" value="${esc(u.path)}"${st.units.has(u.path) ? ' checked' : ''}><span><b>${esc(u.name)}</b><small>${esc(u.qual)} · ${esc(u.kind)}</small>${why[u.path] ? `<div class="sc-why">✦ ${esc(why[u.path].reason || 'Mentioned on your website')}</div>` : ''}</span>${why[u.path] ? `<span class="sc-badge ${why[u.path].confidence === 'high' ? 'ok' : 'warn'}">${esc(why[u.path].confidence || 'match')}</span>` : '<span></span>'}</label>`).join('')}</div>
          <p class="sc-muted sc-small">Every student and teacher can still open any RA10 subject — this sets what classes and the AI recommend first. You can change it any time.</p></div>
        <div class="sc-row" style="justify-content:space-between;margin-top:16px"><button class="sc-btn ghost" id="on-back">← Back</button><button class="sc-btn pri" id="on-finish">Finish set-up</button></div></div>`;
      $$('[data-logo]', main).forEach(b => b.onclick = () => { $$('[data-logo]', main).forEach(x => x.classList.toggle('on', x === b)); $('#on-logo').value = b.dataset.logo; });
      $('#on-back').onclick = step1;
      $('#on-finish').onclick = async (e) => {
        e.target.disabled = true;
        const units = $$('.sc-unit input:checked', main).map(i => i.value);
        const { error } = await S.sb.rpc('edu_setup_school', { p_name: $('#on-name2').value.trim() || st.name, p_website: st.website || null, p_logo_url: $('#on-logo').value.trim() || null, p_subjects: st.subjects, p_units: units, p_color: ($('input[name="on-color"]:checked', main) || {}).value || null });
        if (error) { e.target.disabled = false; return toast('Could not save: ' + error.message, 5000); }
        try { await RA10.refreshProfile(); } catch (err) {}
        await loadCtx(); await loadClasses(); schoolChip();
        toast('Your school is ready 🎉');
        if (!window._scBound) { window._scBound = true; window.addEventListener('hashchange', render); }
        location.hash = '#overview'; render();
      };
    };
    if (st.step === 3) step3(); else step1();
  }

  /* ───────────── views ───────────── */
  async function render() {
    nav();
    const r = route();
    main.innerHTML = '<div class="sc-loading"><span class="sc-spin"></span> Loading…</div>';
    try {
      if (r.view === 'classes') await viewClasses();
      else if (r.view === 'class') await viewClass(r.id, r.q.tab);
      else if (r.view === 'people') await viewPeople();
      else if (r.view === 'new-assignment') await viewBuilder(r.q.class || r.id);
      else if (r.view === 'assignment') await viewAssignment(r.id);
      else if (r.view === 'student') await viewStudent(r.id, r.q.class);
      else if (r.view === 'activity') await viewActivity();
      else if (r.view === 'settings' && S.role === 'admin') onboarding({ step: 3 });
      else await viewOverview();
    } catch (e) { console.error(e); fail(e.message || String(e)); }
    main.focus({ preventScroll: true });
  }

  async function viewOverview() {
    const s = S.school || {};
    let people = [];
    try { people = await loadPeople(true); } catch (e) {}
    const students = people.filter(p => p.role === 'student'), staff = people.filter(p => p.role === 'teacher');
    const active7 = students.filter(p => p.last_active && Date.now() - new Date(p.last_active) < 7 * 864e5).length;
    const pending = people.filter(p => p.status === 'invited').length;
    const asg = (S.ctx.assignments || []).filter(a => a.mine);
    const steps = [[S.classes.length > 0, 'Create your first class', '#classes'], [students.length > 0, 'Add students to a class', '#people'], [asg.length > 0, 'Set your first assignment', '#new-assignment']];
    main.innerHTML = `<div class="sc-hero" style="--hc:${esc(s.brand_color || '#e11d48')}">${s.logo_url ? `<span class="logo"><img src="${esc(s.logo_url)}" alt=""></span>` : ''}<div><h1>${esc(s.name || 'Your school')}</h1><p>${S.role === 'admin' ? 'EDU admin' : 'Teacher'} · ${esc(myName())}${s.website ? ' · ' + esc(String(s.website).replace(/^https?:\/\//, '')) : ''}</p></div>
        <div class="acts"><a class="sc-btn pri" href="#new-assignment">＋ Set assignment</a><a class="sc-btn" href="#people">＋ Add people</a></div></div>
      <div class="sc-stats">
        <div class="sc-stat"><b>${S.classes.length}</b><span>classes</span></div><div class="sc-stat"><b>${students.length}</b><span>students</span></div>
        <div class="sc-stat"><b>${staff.length}</b><span>staff</span></div><div class="sc-stat"><b>${active7}</b><span>students active this week</span></div>
        <div class="sc-stat"><b>${pending}</b><span>invites waiting</span></div><div class="sc-stat"><b>${asg.length}</b><span>assignments</span></div></div>
      ${steps.some(x => !x[0]) ? `<div class="sc-card"><h2>Get started</h2><div class="sc-units">${steps.map((x, i) => `<a class="sc-unit" style="text-decoration:none" href="${x[2]}"><span class="sc-badge ${x[0] ? 'ok' : ''}">${x[0] ? '✓' : i + 1}</span><span><b>${esc(x[1])}</b></span><span class="sc-muted">→</span></a>`).join('')}</div></div>` : ''}
      <div class="sc-grid two" style="margin-top:16px">
        <div class="sc-card"><h2>Classes <a class="sc-btn sm" href="#classes">All classes</a></h2>${S.classes.length ? `<div class="sc-grid">${S.classes.slice(0, 4).map(classCard).join('')}</div>` : '<div class="sc-empty"><b>No classes yet</b>Create a class, choose its units and add students.</div>'}</div>
        <div class="sc-card"><h2>Recent assignments <a class="sc-btn sm" href="#new-assignment">＋ New</a></h2>${asg.length ? asg.slice(0, 6).map(a => `<a class="sc-pickrow" style="text-decoration:none;margin-bottom:8px" href="#assignment=${esc(a.id)}"><span><p><b>${esc(a.title)}</b></p><small>${esc(a.class_name)} · ${esc(fmtDate(a.due_at))}</small></span><span class="sc-badge ${a.submitted ? 'ok' : ''}">${a.submitted || 0} submitted</span></a>`).join('') : '<div class="sc-empty"><b>Nothing set yet</b>Assignments can be topics, exact exam questions, quizzes or guide sections.</div>'}</div></div>
      <div class="sc-card"><h2>Most recent student activity <a class="sc-btn sm" href="#activity">See all</a></h2><div id="ov-act"><div class="sc-loading"><span class="sc-spin"></span></div></div></div>`;
    activityFeed($('#ov-act'), 12);
  }
  function classCard(c) {
    return `<a class="sc-class" style="--cc:${esc(c.color || '#2563eb')}" href="#class=${esc(c.id)}"><b>${esc(c.name)}</b><span class="sc-muted sc-small">${esc(c.year_group || '')}${c.description ? ' · ' + esc(c.description) : ''}</span>
      <div class="sc-chips">${(c.units || []).map(u => `<span class="sc-chip">${esc((unitOf(u) || {}).short || u.split('/').pop())}</span>`).join('') || '<span class="sc-muted sc-small">No units chosen</span>'}</div></a>`;
  }

  async function viewClasses() {
    await loadClasses();
    main.innerHTML = `<div class="sc-h"><div><h1>Classes</h1><p>A class can cover as many subjects and units as you like.</p></div><button class="sc-btn pri" id="cl-new">＋ New class</button></div>
      ${S.classes.length ? `<div class="sc-grid auto">${S.classes.map(classCard).join('')}</div>` : '<div class="sc-empty"><b>No classes yet</b>Press “New class” to create one.</div>'}`;
    $('#cl-new').onclick = () => classModal();
    if (location.hash === '#classes' && !S.classes.length) classModal();
  }
  async function classModal(c) {
    let staff = [];
    try { staff = (await loadPeople()).filter(p => p.role === 'teacher' && p.status === 'active'); } catch (e) {}
    const units = new Set((c && c.units) || []);
    const schoolUnits = new Set((S.school && S.school.units) || []);
    const list = UNITS().slice().sort((a, b) => (schoolUnits.has(b.path) - schoolUnits.has(a.path)));
    let current = [];
    if (c) { try { current = (await roster(c.id, true)).filter(r => r.role === 'teacher').map(r => r.email); } catch (e) {} }
    modal(`<h2>${c ? 'Edit class' : 'New class'}</h2>
      <div class="sc-field"><label>Class name</label><input id="m-name" placeholder="e.g. Year 12 BTEC IT" value="${esc(c ? c.name : '')}"></div>
      <div class="sc-grid two"><div class="sc-field"><label>Year group</label><input id="m-year" placeholder="Year 12" value="${esc(c ? c.year_group || '' : '')}"></div>
      <div class="sc-field"><label>Colour</label><div class="sc-colors">${COLORS.map((x, i) => `<label style="--c:${x}"><input type="radio" name="m-color" value="${x}"${(c ? c.color === x : i === (S.classes.length % COLORS.length)) ? ' checked' : ''}></label>`).join('')}</div></div></div>
      <div class="sc-field"><label>Units this class studies</label><div class="sc-checks">${list.map(u => `<label><input type="checkbox" value="${esc(u.path)}"${units.has(u.path) ? ' checked' : ''}> ${esc(u.name)} <small class="sc-muted">${esc(u.qual)}</small></label>`).join('')}</div></div>
      ${staff.length ? `<div class="sc-field"><label>Teachers</label><div class="sc-checks" id="m-staff">${staff.map(p => `<label><input type="checkbox" value="${esc(p.email)}"${(c ? current.includes(p.email) : p.email === S.me.email.toLowerCase()) ? ' checked' : ''}> ${esc(p.display_name || p.email)}</label>`).join('')}</div></div>` : ''}
      <div class="sc-row" style="justify-content:flex-end"><button class="sc-btn" data-close>Cancel</button><button class="sc-btn pri" id="m-save">${c ? 'Save' : 'Create class'}</button></div>`, (m, close) => {
      $('#m-save', m).onclick = async (e) => {
        const name = $('#m-name', m).value.trim(); if (!name) return toast('Give the class a name.');
        e.target.disabled = true;
        const row = { name, year_group: $('#m-year', m).value.trim() || null, color: ($('input[name="m-color"]:checked', m) || {}).value || '#2563eb', units: $$('.sc-checks input[type=checkbox]:checked', m).filter(i => !i.closest('#m-staff')).map(i => i.value) };
        let id = c && c.id;
        if (c) { const { error } = await S.sb.from('edu_classes').update(row).eq('id', c.id); if (error) { e.target.disabled = false; return toast(error.message); } }
        else {
          const { data, error } = await S.sb.from('edu_classes').insert(Object.assign({ school_id: String(S.school.id) }, row)).select().single();
          if (error) { e.target.disabled = false; return toast(error.message); }
          id = data.id;
        }
        const meEmail = S.me.email.toLowerCase();
        let teachers = $$('#m-staff input:checked', m).map(i => i.value);
        if (!c && !teachers.includes(meEmail) && S.role !== 'admin') teachers.push(meEmail);   // a teacher who creates a class teaches it
        if (!teachers.length) teachers.push(meEmail);
        teachers = teachers.sort((x, y) => (y === meEmail) - (x === meEmail));                  // add yourself first (permissions)
        const people = S.people || [];
        for (const em of teachers) {
          if (current.includes(em)) continue;
          const p = people.find(x => x.email === em) || {};
          const { error: mErr } = await S.sb.from('edu_class_members').insert({ class_id: id, email: em, role: 'teacher', status: 'active', user_id: p.user_id || (em === meEmail ? S.me.id : null) });
          if (mErr && !/duplicate/i.test(mErr.message)) toast('Could not add ' + em + ': ' + mErr.message, 4000);
        }
        if (c) for (const em of current.filter(x => !teachers.includes(x))) await S.sb.from('edu_class_members').delete().eq('class_id', id).eq('email', em);
        close(); toast(c ? 'Class saved' : 'Class created');
        await loadClasses(); delete S.rosters[id];
        location.hash = '#class=' + id; render();
      };
    });
  }

  async function viewClass(id, tab) {
    await loadClasses();
    const c = S.classes.find(x => x.id === id);
    if (!c) return fail('That class could not be found.');
    tab = tab || 'students';
    const rs = await roster(id, true);
    const students = rs.filter(r => r.role === 'student'), teachers = rs.filter(r => r.role === 'teacher');
    const { data: asg } = await S.sb.from('edu_assignments').select('id, title, due_at, status, items, created_at').eq('class_id', id).order('created_at', { ascending: false });
    main.innerHTML = `<div class="sc-hero" style="--hc:${esc(c.color || '#2563eb')}"><div><h1>${esc(c.name)}</h1><p>${students.length} students · taught by ${esc(teachers.map(t => t.display_name || t.email).join(', ') || '—')}</p></div>
        <div class="acts"><a class="sc-btn pri" href="#new-assignment&class=${esc(id)}">＋ Set assignment</a><button class="sc-btn" id="c-add">＋ Add students</button><button class="sc-btn" id="c-edit">Edit</button></div></div>
      <div class="sc-tabs">${[['students', 'Students'], ['assignments', 'Assignments'], ['units', 'Units'], ['insights', '✦ AI insights']].map(([k, l]) => `<button data-tab="${k}" class="${k === tab ? 'on' : ''}">${l}</button>`).join('')}</div>
      <div id="c-body"></div>`;
    $$('[data-tab]', main).forEach(b => b.onclick = () => { location.hash = `#class=${id}&tab=${b.dataset.tab}`; });
    $('#c-add').onclick = () => addPeopleModal({ classIds: [id], role: 'student', title: 'Add students to ' + c.name });
    $('#c-edit').onclick = () => classModal(c);
    const body = $('#c-body');
    if (tab === 'students') {
      body.innerHTML = students.length ? `<div class="sc-card"><div class="sc-tbl-wrap"><table class="sc-tbl"><thead><tr><th>Student</th><th>Status</th><th>Last active</th><th>Actions (7 days)</th><th>Average mark (30 days)</th><th></th></tr></thead><tbody>${students.map(s => `<tr class="${s.user_id ? 'click' : ''}" data-stu="${esc(s.user_id || '')}">
          <td><span class="sc-person">${avatar(s)}<span><b>${esc(s.display_name || s.username || s.email.split('@')[0])}</b><small>${esc(s.email)}</small></span></span></td>
          <td>${s.status === 'active' ? '<span class="sc-badge ok">Joined</span>' : s.user_id ? '<span class="sc-badge warn">Invite not accepted</span>' : '<span class="sc-badge">No account yet</span>'}</td>
          <td>${esc(ago(s.last_active))}</td><td>${esc(s.events_7d || 0)}</td><td>${s.avg_score != null ? esc(s.avg_score) + '%' : '—'}</td>
          <td><button class="sc-btn sm danger" data-rm="${esc(s.email)}">Remove</button></td></tr>`).join('')}</tbody></table></div></div>` : '<div class="sc-empty"><b>No students yet</b>Press “Add students” and paste their school email addresses.</div>';
      $$('tr[data-stu]', body).forEach(tr => tr.addEventListener('click', (e) => { if (e.target.closest('[data-rm]') || !tr.dataset.stu) return; location.hash = `#student=${tr.dataset.stu}&class=${id}`; }));
      $$('[data-rm]', body).forEach(b => b.onclick = async () => { if (!confirm('Remove ' + b.dataset.rm + ' from this class?')) return; await S.sb.from('edu_class_members').delete().eq('class_id', id).eq('email', b.dataset.rm); toast('Removed from class'); render(); });
    } else if (tab === 'assignments') {
      body.innerHTML = (asg || []).length ? `<div class="sc-card">${asg.map(a => `<a class="sc-pickrow" style="text-decoration:none;margin-bottom:8px" href="#assignment=${esc(a.id)}"><span><p><b>${esc(a.title)}</b></p><small>${(a.items || []).length} items · ${esc(fmtDate(a.due_at))} · set ${esc(ago(a.created_at))}</small></span><span class="sc-badge ${a.status === 'published' ? 'ok' : ''}">${esc(a.status)}</span></a>`).join('')}</div>` : `<div class="sc-empty"><b>No assignments yet</b><a class="sc-btn pri" style="margin-top:10px" href="#new-assignment&class=${esc(id)}">Set the first one</a></div>`;
    } else if (tab === 'units') {
      body.innerHTML = `<div class="sc-card"><h2>Units studied by this class <button class="sc-btn sm" id="c-units">Change</button></h2>${(c.units || []).length ? `<div class="sc-units">${c.units.map(u => { const m = unitOf(u) || { name: u, qual: '' }; return `<div class="sc-unit"><span class="sc-badge brand">${esc(m.subject || '')}</span><span><b>${esc(m.name)}</b><small>${esc(m.qual)}</small></span><a class="sc-btn sm" href="${esc(m.publicPath || u)}" target="_blank" rel="noopener">Open</a></div>`; }).join('')}</div>` : '<p class="sc-muted">No units chosen yet.</p>'}</div>`;
      $('#c-units').onclick = () => classModal(c);
    } else {
      body.innerHTML = `<div class="sc-card"><h2>AI class overview <button class="sc-btn ai" id="c-ai">✦ Analyse this class</button></h2><div id="c-ai-out"><p class="sc-muted">The AI reads the last 30 days of every student's RA10 activity — answers, marks, quiz results and reading — and tells you who needs support and which topics the class finds hardest.</p></div></div>`;
      $('#c-ai').onclick = async (e) => {
        e.target.disabled = true; e.target.textContent = 'Analysing…';
        try { const r = await api('analyse-class', { classId: id }); $('#c-ai-out').innerHTML = reportHtml(r.report, true); }
        catch (err) { toast(err.message, 5000); }
        e.target.disabled = false; e.target.textContent = '✦ Analyse again';
      };
    }
  }

  async function viewPeople() {
    const people = await loadPeople(true);
    const admin = S.role === 'admin';
    const filter = sessionStorage.getItem('sc_people_filter') || 'all';
    const rows = people.filter(p => filter === 'all' || p.role === filter || (filter === 'invited' && p.status === 'invited'));
    main.innerHTML = `<div class="sc-h"><div><h1>${admin ? 'Students & staff' : 'Students'}</h1><p>Everyone at ${esc(S.school.name)} on RA10. There's no limit on how many people you can add.</p></div><button class="sc-btn pri" id="p-add">＋ Add people</button></div>
      <div class="sc-tabs">${[['all', 'Everyone'], ['student', 'Students'], ['teacher', 'Staff'], ['invited', 'Invites waiting']].map(([k, l]) => `<button data-f="${k}" class="${k === filter ? 'on' : ''}">${l} <span class="sc-badge">${k === 'all' ? people.length : k === 'invited' ? people.filter(p => p.status === 'invited').length : people.filter(p => p.role === k).length}</span></button>`).join('')}</div>
      <div class="sc-card">${rows.length ? `<div class="sc-tbl-wrap"><table class="sc-tbl"><thead><tr><th>Person</th><th>Role</th><th>Status</th><th>Classes</th><th>Last active</th>${admin ? '<th></th>' : ''}</tr></thead><tbody>${rows.map(p => `<tr class="${p.user_id && p.role === 'student' ? 'click' : ''}" data-stu="${p.role === 'student' ? esc(p.user_id || '') : ''}">
          <td><span class="sc-person">${avatar(p)}<span><b>${esc(p.display_name || p.username || p.email.split('@')[0])}</b><small>${esc(p.email)}</small></span></span></td>
          <td>${p.is_admin ? '<span class="sc-badge brand">EDU admin</span>' : p.role === 'teacher' ? '<span class="sc-badge violet">Staff</span>' : '<span class="sc-badge">Student</span>'}</td>
          <td>${p.status === 'active' ? '<span class="sc-badge ok">Joined</span>' : '<span class="sc-badge warn">Invited ' + esc(ago(p.invited_at)) + '</span>'}</td>
          <td class="sc-small">${esc((p.classes || []).join(', ') || '—')}</td><td>${esc(ago(p.last_active))}</td>
          ${admin ? `<td><span class="sc-row" style="flex-wrap:nowrap">${p.is_admin ? '' : `<button class="sc-btn sm" data-role="${esc(p.email)}" data-to="${p.role === 'teacher' ? 'student' : 'teacher'}">${p.role === 'teacher' ? 'Make student' : 'Make staff'}</button><button class="sc-btn sm danger" data-rm="${esc(p.email)}">Remove</button>`}</span></td>` : ''}</tr>`).join('')}</tbody></table></div>` : '<div class="sc-empty"><b>Nobody here yet</b>Add people with their email addresses.</div>'}</div>`;
    $$('[data-f]', main).forEach(b => b.onclick = () => { sessionStorage.setItem('sc_people_filter', b.dataset.f); viewPeople(); });
    $('#p-add').onclick = () => addPeopleModal({});
    $$('tr[data-stu]', main).forEach(tr => tr.addEventListener('click', (e) => { if (!tr.dataset.stu || e.target.closest('[data-rm]')) return; location.hash = '#student=' + tr.dataset.stu; }));
    $$('[data-role]', main).forEach(b => b.onclick = async (e) => {
      e.stopPropagation();
      const to = b.dataset.to;
      if (!confirm((to === 'teacher' ? 'Make ' + b.dataset.role + ' a member of staff? They will be able to manage classes, set work and see students.' : 'Make ' + b.dataset.role + ' a student? They will lose access to the teacher tools.'))) return;
      b.disabled = true;
      const { data, error } = await S.sb.rpc('edu_set_member_role', { p_school: String(S.school.id), p_email: b.dataset.role, p_role: to });
      if (error || !data || !data.ok) { b.disabled = false; return toast('Could not change role: ' + ((error && error.message) || 'not found'), 5000); }
      toast(to === 'teacher' ? 'Now a member of staff' : 'Now a student');
      S.people = null; S.rosters = {}; viewPeople();
    });
    $$('[data-rm]', main).forEach(b => b.onclick = async () => {
      if (!confirm('Remove ' + b.dataset.rm + ' from ' + S.school.name + '? They keep their RA10 account but lose the school plan.')) return;
      try { const r = await api('remove-member', { schoolId: String(S.school.id), email: b.dataset.rm }); if (!r.ok) throw new Error(r.error); toast('Removed'); viewPeople(); } catch (e) { toast(e.message, 5000); }
    });
    if (location.hash === '#people' && !people.filter(p => p.role === 'student').length && !S._peopleAuto) { S._peopleAuto = true; addPeopleModal({}); }
  }
  function addPeopleModal(opt) {
    const admin = S.role === 'admin';
    modal(`<h2>${esc(opt.title || 'Add people')}</h2>
      <div class="sc-field"><label>Email addresses</label><textarea id="m-emails" placeholder="one per line, or separated by commas&#10;sam.jones@yourschool.org.uk&#10;priya.k@yourschool.org.uk"></textarea><small>Staff who are already at the school stay staff. New people get an email to create their account. People who already use RA10 get an email asking them to accept, and see a pop-up next time they visit.</small></div>
      ${admin ? `<div class="sc-field"><label>They are</label><select id="m-role"><option value="student"${opt.role !== 'teacher' ? ' selected' : ''}>Students</option><option value="teacher"${opt.role === 'teacher' ? ' selected' : ''}>Staff (teachers)</option></select></div>` : ''}
      ${S.classes.length ? `<div class="sc-field"><label>Add them to</label><div class="sc-checks">${S.classes.map(c => `<label><input type="checkbox" value="${esc(c.id)}"${(opt.classIds || []).includes(c.id) ? ' checked' : ''}> ${esc(c.name)}</label>`).join('')}</div></div>` : '<p class="sc-muted sc-small">Tip: create a class first so you can add people straight into it.</p>'}
      <div id="m-res"></div>
      <div class="sc-row" style="justify-content:flex-end"><button class="sc-btn" data-close>Close</button><button class="sc-btn pri" id="m-go">Send invites</button></div>`, (m) => {
      $('#m-go', m).onclick = async (e) => {
        const emails = Array.from(new Set($('#m-emails', m).value.split(/[\s,;]+/).map(x => x.trim().toLowerCase()).filter(x => /@/.test(x))));
        if (!emails.length) return toast('Paste at least one email address.');
        const role = admin ? $('#m-role', m).value : 'student';
        const classIds = $$('.sc-checks input:checked', m).map(i => i.value);
        e.target.disabled = true; e.target.textContent = 'Sending…';
        const res = $('#m-res', m); res.innerHTML = '';
        let ok = 0;
        for (const em of emails) {
          try {
            const r = await api('invite', { schoolId: String(S.school.id), email: em, role, classIds });
            if (r.ok) ok++;
            res.insertAdjacentHTML('beforeend', `<div class="sc-pickrow" style="margin-bottom:6px"><span><p><b>${esc(em)}</b></p><small>${r.ok ? (r.status === 'active' ? 'Added to the class' : r.emailed ? (r.existingAccount ? 'Has an account — asked to accept' : 'Invite email sent') : esc(r.note || 'Saved')) : esc(r.error)}</small>${r.link ? `<br><small>Sign-up link: <input class="sc-in" style="padding:4px 8px;margin-top:4px" readonly value="${esc(r.link)}" onclick="this.select()"></small>` : ''}</span><span class="sc-badge ${r.ok ? 'ok' : 'bad'}">${r.ok ? '✓' : '✕'}</span></div>`);
          } catch (err) { res.insertAdjacentHTML('beforeend', `<p class="sc-small" style="color:var(--bad)">${esc(em)}: ${esc(err.message)}</p>`); }
        }
        e.target.disabled = false; e.target.textContent = 'Send more';
        $('#m-emails', m).value = '';
        toast(ok + ' of ' + emails.length + ' added');
        S.people = null; S.rosters = {};
      };
    });
    const m = $('.sc-modal');
    m && m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) setTimeout(render, 50); });
  }

  /* ── assignment builder ── */
  async function viewBuilder(classId) {
    await loadClasses();
    if (!S.classes.length) { main.innerHTML = '<div class="sc-empty"><b>Create a class first</b>Assignments are set for a class.<br><br><a class="sc-btn pri" href="#classes">Create a class</a></div>'; return; }
    const B = S.builder = S.builder && S.builder.classId === classId ? S.builder : { classId: classId || S.classes[0].id, items: [], unit: null, tab: 'topic', search: '' };
    const cls = () => S.classes.find(c => c.id === B.classId) || S.classes[0];
    const classUnits = () => (cls().units && cls().units.length ? cls().units : ((S.school && S.school.units) || []).length ? S.school.units : UNITS().map(u => u.path));
    if (!B.unit || !classUnits().includes(B.unit)) B.unit = classUnits()[0];
    const { data: recent } = await S.sb.from('edu_assignments').select('id, title, due_at, class_id, created_at').eq('school_id', String(S.school.id)).order('created_at', { ascending: false }).limit(8);
    main.innerHTML = `<div class="sc-h"><div><h1>Set an assignment</h1><p>Mix topics, exact exam questions, multiple-choice questions, guide sections and papers.</p></div></div>
      <div class="sc-build"><div>
        <div class="sc-card"><div class="sc-grid two"><div class="sc-field"><label>Class</label><select id="b-class">${S.classes.map(c => `<option value="${esc(c.id)}"${c.id === B.classId ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
          <div class="sc-field"><label>Unit to pick from</label><select id="b-unit">${classUnits().map(u => `<option value="${esc(u)}"${u === B.unit ? ' selected' : ''}>${esc((unitOf(u) || {}).name || u)}</option>`).join('')}</select></div></div>
          <div class="sc-tabs">${[['topic', 'Topic practice'], ['question', 'Exam questions'], ['mcq', 'Multiple choice'], ['guide', 'Revision guide'], ['paper', 'Papers']].map(([k, l]) => `<button data-bt="${k}" class="${k === B.tab ? 'on' : ''}">${l}</button>`).join('')}</div>
          <div id="b-pick"><div class="sc-loading"><span class="sc-spin"></span> Loading ${esc((unitOf(B.unit) || {}).short || 'unit')}…</div></div></div>
        ${(recent || []).length ? `<div class="sc-card"><h2>Recently set</h2>${recent.map(a => `<a class="sc-pickrow" style="text-decoration:none;margin-bottom:6px" href="#assignment=${esc(a.id)}"><span><p><b>${esc(a.title)}</b></p><small>${esc((S.classes.find(c => c.id === a.class_id) || {}).name || '')} · ${esc(fmtDate(a.due_at))}</small></span><span>→</span></a>`).join('')}</div>` : ''}
      </div>
      <div class="sc-sticky"><div class="sc-card"><h2>Assignment</h2>
        <div class="sc-field"><label>Title</label><input id="b-title" placeholder="e.g. Network security — week 6" value="${esc(B.title || '')}"></div>
        <div class="sc-field"><label>Instructions for students</label><textarea id="b-ins" placeholder="Optional: what to focus on, how long to spend…">${esc(B.ins || '')}</textarea></div>
        <div class="sc-field"><label>Due</label><input id="b-due" type="date" value="${esc(B.due || '')}"></div>
        <p class="sc-muted sc-small" style="margin:0 0 8px">${B.items.length} item${B.items.length === 1 ? '' : 's'}</p>
        <div class="sc-sel" id="b-sel"></div>
        <div class="sc-row" style="margin-top:14px"><button class="sc-btn pri" id="b-pub" ${B.items.length ? '' : 'disabled'}>Set assignment</button></div></div></div></div>`;
    const keep = () => { B.title = $('#b-title').value; B.ins = $('#b-ins').value; B.due = $('#b-due').value; };
    ['#b-title', '#b-ins', '#b-due'].forEach(s => $(s).addEventListener('input', keep));
    $('#b-class').onchange = (e) => { keep(); B.classId = e.target.value; B.unit = null; viewBuilder(B.classId); };
    $('#b-unit').onchange = (e) => { keep(); B.unit = e.target.value; B.search = ''; viewBuilder(B.classId); };
    $$('[data-bt]', main).forEach(b => b.onclick = () => { keep(); B.tab = b.dataset.bt; B.search = ''; viewBuilder(B.classId); });
    const paintSel = () => {
      $('#b-sel').innerHTML = B.items.length ? B.items.map((it, i) => `<div class="sc-selrow"><span class="n">${i + 1}</span><span><p>${esc(it.title)}</p><small>${esc({ topic: 'Topic practice', question: 'Exam question', mcq: 'Multiple choice', guide: 'Guide section', paper: 'Paper' }[it.type])} · ${esc((unitOf(it.unit) || {}).short || '')}</small></span><button class="sc-x" data-rmi="${i}" aria-label="Remove">✕</button></div>`).join('') : '<div class="sc-empty" style="padding:16px">Add items from the left.</div>';
      $$('[data-rmi]').forEach(b => b.onclick = () => { B.items.splice(Number(b.dataset.rmi), 1); paintSel(); $('#b-pub').disabled = !B.items.length; markAdded(); });
      $('#b-pub').disabled = !B.items.length;
    };
    const has = (type, ref) => B.items.some(x => x.type === type && x.ref === ref && x.unit === B.unit);
    const add = (it) => { if (has(it.type, it.ref) && it.type !== 'topic') return; B.items.push(Object.assign({ id: 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), unit: B.unit }, it)); paintSel(); markAdded(); toast('Added: ' + it.title.slice(0, 60)); };
    const markAdded = () => $$('[data-add]').forEach(b => { const on = has(b.dataset.type, b.dataset.add); b.closest('.sc-pickrow').classList.toggle('added', on); b.textContent = on ? '✓ Added' : '＋ Add'; });
    paintSel();
    $('#b-pub').onclick = async (e) => {
      keep();
      if (!B.title.trim()) return toast('Give the assignment a title.');
      e.target.disabled = true;
      const { data, error } = await S.sb.from('edu_assignments').insert({ class_id: B.classId, school_id: String(S.school.id), title: B.title.trim(), instructions: B.ins.trim() || null, items: B.items, due_at: B.due ? new Date(B.due + 'T17:00:00').toISOString() : null, status: 'published' }).select().single();
      if (error) { e.target.disabled = false; return toast(error.message, 5000); }
      S.builder = null; toast('Assignment set 🎉'); location.hash = '#assignment=' + data.id;
    };
    let cat;
    try { cat = await catalog(B.unit); } catch (err) { $('#b-pick').innerHTML = `<div class="sc-empty">${esc(err.message)}</div>`; return; }
    const pick = $('#b-pick');
    const search = `<input class="sc-in" id="b-q" placeholder="Search…" value="${esc(B.search)}" style="margin-bottom:10px">`;
    const match = (s) => !B.search || String(s || '').toLowerCase().includes(B.search.toLowerCase());
    if (B.tab === 'topic') {
      const aims = Object.keys(cat.spec || {});
      pick.innerHTML = aims.length ? `<p class="sc-muted sc-small">Students get a set of questions on the topic you choose (picked from the unit's question bank).</p><div class="sc-pick">${aims.map(a => `<div class="sc-card" style="box-shadow:none;padding:12px"><b>Aim ${esc(a)}: ${esc(cat.spec[a].title)}</b>
          <div class="sc-pickrow" style="margin-top:8px"><span><p>Whole learning aim</p></span><span class="sc-row"><select class="sc-in" style="width:auto;padding:6px 8px" data-n><option>5</option><option selected>8</option><option>12</option><option>20</option></select><button class="sc-btn sm" data-topic="${esc(a)}" data-tt="">＋ Add</button></span></div>
          ${(cat.spec[a].topics || []).map(t => `<div class="sc-pickrow" style="margin-top:6px"><span><p>${esc(t.code ? t.code + ' ' : '')}${esc(t.name)}</p></span><span class="sc-row"><select class="sc-in" style="width:auto;padding:6px 8px" data-n><option>3</option><option selected>5</option><option>8</option></select><button class="sc-btn sm" data-topic="${esc(a)}" data-tt="${esc(t.name)}">＋ Add</button></span></div>`).join('')}</div>`).join('')}</div>`
        : '<div class="sc-empty">This unit has no topic list. Use “Exam questions” instead.</div>';
      $$('[data-topic]', pick).forEach(b => b.onclick = () => { const n = Number($('[data-n]', b.closest('.sc-pickrow')).value); add({ type: 'topic', ref: b.dataset.tt || b.dataset.topic, aim: b.dataset.topic, topic: b.dataset.tt, count: n, title: `${n} questions: ${b.dataset.tt || 'Aim ' + b.dataset.topic + ' — ' + cat.spec[b.dataset.topic].title}` }); });
    } else {
      const lists = {
        question: (cat.questions || []).filter(q => match(q.q + ' ' + q.topic + ' ' + q.aim + ' ' + q.verb)).slice(0, 150).map(q => ({ ref: q.id, title: q.q, sub: `${q.marks || '?'} marks · ${q.verb || ''} · ${q.topic || ('Aim ' + q.aim)}`, marks: q.marks })),
        mcq: (cat.quiz || []).filter(q => match(q.q + ' ' + q.topic)).slice(0, 150).map(q => ({ ref: q.id, title: q.q, sub: (q.choices || []).join(' · ').slice(0, 140) })),
        guide: (cat.guide || []).filter(g => match(g.title)).map(g => ({ ref: g.id, title: g.title, sub: g.level === 'H2' ? 'Section' : 'Topic' })),
        paper: (cat.papers || []).filter(p => match(p.title + ' ' + p.series)).map(p => ({ ref: p.id, title: (p.series ? p.series + ': ' : '') + p.title, sub: (p.total || '') + ' marks · ' + (p.source === 'pearson' ? 'Pearson' : 'RA10') }))
      }[B.tab] || [];
      pick.innerHTML = search + (lists.length ? `<p class="sc-muted sc-small">${lists.length}${lists.length >= 150 ? '+' : ''} shown${B.search ? ' for “' + esc(B.search) + '”' : ''}</p><div class="sc-pick">${lists.map(x => `<div class="sc-pickrow"><span><p>${esc(x.title)}</p><small>${esc(x.sub)}</small></span><button class="sc-btn sm" data-add="${esc(x.ref)}" data-type="${B.tab}">＋ Add</button></div>`).join('')}</div>` : '<div class="sc-empty">Nothing found.</div>');
      $$('[data-add]', pick).forEach(b => b.onclick = () => { const x = lists.find(y => String(y.ref) === b.dataset.add); add({ type: B.tab, ref: x.ref, title: x.title.slice(0, 200), marks: x.marks || null }); });
      let t; $('#b-q', pick).addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => { B.search = e.target.value; keep(); viewBuilder(B.classId).then(() => { const q = $('#b-q'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); } }); }, 350); });
      markAdded();
    }
  }

  /* ── assignment review ── */
  async function viewAssignment(id) {
    const { data: a, error } = await S.sb.from('edu_assignments').select('*').eq('id', id).maybeSingle();
    if (error || !a) return fail('That assignment could not be found.');
    const c = S.classes.find(x => x.id === a.class_id) || {};
    const rs = (await roster(a.class_id, true)).filter(r => r.role === 'student');
    const { data: subs } = await S.sb.from('edu_submissions').select('*').eq('assignment_id', id);
    const items = a.items || [];
    const cell = (uid, it) => {
      const mine = (subs || []).filter(s => s.user_id === uid && (s.item_id === it.id || s.item_id.indexOf(it.id + ':') === 0));
      if (!mine.length) return { html: '<span class="sc-dot">—</span>', n: 0 };
      const done = mine.filter(s => s.done).length;
      const sc = mine.filter(s => s.max_score), got = sc.reduce((n, s) => n + Number(s.score || 0), 0), max = sc.reduce((n, s) => n + Number(s.max_score || 0), 0);
      const pct = max ? got / max : null;
      return { html: `<span class="sc-dot ${pct == null ? 'done' : pct >= .7 ? 'done' : pct >= .4 ? 'mid' : 'low'}">${max ? `${got}/${max}` : (it.type === 'topic' ? done : '✓')}</span>`, n: done };
    };
    const finished = rs.filter(r => r.user_id && items.every(it => cell(r.user_id, it).n > 0)).length;
    main.innerHTML = `<div class="sc-h"><div><a class="sc-btn sm ghost" href="#class=${esc(a.class_id)}&tab=assignments">← ${esc(c.name || 'Class')}</a><h1 style="margin-top:8px">${esc(a.title)}</h1><p>${esc(fmtDate(a.due_at))} · ${finished}/${rs.length} students finished</p></div>
      <div class="sc-row"><button class="sc-btn" id="a-close">${a.status === 'closed' ? 'Re-open' : 'Close assignment'}</button><button class="sc-btn danger" id="a-del">Delete</button></div></div>
      ${a.instructions ? `<div class="sc-card"><p style="margin:0;white-space:pre-wrap">${esc(a.instructions)}</p></div>` : ''}
      <div class="sc-card"><h2>Progress <span class="sc-muted sc-small">Click a cell to read the student's answers</span></h2><div class="sc-tbl-wrap"><table class="sc-tbl sc-matrix"><thead><tr><th>Student</th>${items.map((it, i) => `<th title="${esc(it.title)}">${i + 1}. ${esc(it.title.slice(0, 22))}${it.title.length > 22 ? '…' : ''}</th>`).join('')}</tr></thead>
        <tbody>${rs.map(r => `<tr><td><span class="sc-person">${avatar(r)}<span><b>${esc(r.display_name || r.email.split('@')[0])}</b><small>${r.user_id ? '' : 'no account yet'}</small></span></span></td>${items.map((it, i) => `<td class="cell" data-u="${esc(r.user_id || '')}" data-i="${i}">${r.user_id ? cell(r.user_id, it).html : '<span class="sc-dot">·</span>'}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
    $('#a-close').onclick = async () => { await S.sb.from('edu_assignments').update({ status: a.status === 'closed' ? 'published' : 'closed' }).eq('id', id); render(); };
    $('#a-del').onclick = async () => { if (!confirm('Delete this assignment and all its answers?')) return; await S.sb.from('edu_assignments').delete().eq('id', id); toast('Deleted'); location.hash = '#class=' + a.class_id + '&tab=assignments'; };
    $$('td.cell', main).forEach(td => td.onclick = () => {
      const uid = td.dataset.u; if (!uid) return;
      const it = items[Number(td.dataset.i)];
      const r = rs.find(x => x.user_id === uid);
      const mine = (subs || []).filter(s => s.user_id === uid && (s.item_id === it.id || s.item_id.indexOf(it.id + ':') === 0));
      modal(`<h2>${esc(r.display_name || r.email)}</h2><p class="sc-muted">${esc(it.title)}</p>
        ${mine.length ? mine.map(s => `<div class="sc-card" style="box-shadow:none;margin-bottom:10px">${s.question_text ? `<p><b>${esc(s.question_text)}</b></p>` : ''}${s.answer && !['read', 'done'].includes(s.answer) ? `<div class="sc-comment"><p>${esc(s.item_type === 'mcq' ? 'Chose option ' + 'ABCDEF'[Number(s.answer)] : s.answer)}</p></div>` : `<p class="sc-muted">${s.done ? 'Marked as done' : 'Started'}</p>`}
          ${s.max_score ? `<p><span class="sc-badge ${s.score / s.max_score >= .7 ? 'ok' : s.score / s.max_score >= .4 ? 'warn' : 'bad'}">${esc(s.score)}/${esc(s.max_score)}</span> ${s.feedback && s.feedback.summary ? `<span class="sc-small">${esc(s.feedback.summary)}</span>` : ''}</p>` : ''}
          <small class="sc-muted">${esc(ago(s.updated_at))}</small></div>`).join('') : '<p class="sc-muted">Not started yet.</p>'}
        <div class="sc-field"><label>Comment for ${esc((r.display_name || 'the student').split(' ')[0])}</label><textarea id="m-c" placeholder="Feedback they will see on their homepage and inside the assignment"></textarea></div>
        <div class="sc-row" style="justify-content:flex-end"><a class="sc-btn" href="#student=${esc(uid)}&class=${esc(a.class_id)}">Full student view</a><button class="sc-btn" data-close>Close</button><button class="sc-btn pri" id="m-send">Send comment</button></div>`, (m, close) => {
        $('#m-send', m).onclick = async () => {
          const body = $('#m-c', m).value.trim(); if (!body) return;
          const { error } = await S.sb.from('edu_comments').insert({ student_id: uid, author_name: myName(), class_id: a.class_id, assignment_id: a.id, submission_id: mine[0] ? mine[0].id : null, body });
          if (error) return toast(error.message);
          close(); toast('Comment sent');
        };
      });
    });
  }

  /* ── one student ── */
  async function viewStudent(uid, classId) {
    const [{ data: sum, error }, { data: comments }, { data: reports }] = await Promise.all([
      S.sb.rpc('edu_student_summary', { p_student: uid, p_days: 30 }),
      S.sb.from('edu_comments').select('*').eq('student_id', uid).order('created_at', { ascending: false }).limit(30),
      S.sb.from('edu_ai_reports').select('*').eq('student_id', uid).order('created_at', { ascending: false }).limit(1)
    ]);
    if (error) return fail(error.message);
    const st = sum.student || {};
    const first = String(st.name || st.email || 'Student').split(/[\s@]/)[0];
    main.innerHTML = `<div class="sc-h"><div class="sc-person">${avatar({ display_name: st.name, email: st.email, profile_pic_url: st.profile_pic_url })}<span><h1 style="margin:0">${esc(st.name || st.email)}</h1><small class="sc-muted">${esc(st.email || '')} · ${esc(st.xp_total || 0)} XP · last active ${esc(ago(sum.totals && sum.totals.last_active))}</small></span></div>
        <div class="sc-row"><button class="sc-btn" id="s-com">💬 Comment</button><button class="sc-btn" id="s-rec">⭐ Recommend work</button><button class="sc-btn ai" id="s-ai">✦ AI analysis</button></div></div>
      <div class="sc-card"><h2>Last 30 days</h2>${RA10ActivityView.summary(sum)}</div>
      <div class="sc-card" id="s-report"><h2>AI progress analysis</h2>${reports && reports[0] ? reportHtml(reports[0].report) : `<p class="sc-muted">Press “AI analysis” for a detailed report on ${esc(first)}'s strengths, misconceptions, exam technique and what to do next — based on every answer they wrote.</p>`}</div>
      <div class="sc-grid two" style="margin-top:16px;align-items:start">
        <div class="sc-card"><h2>Everything ${esc(first)} did <select class="sc-in" id="s-kind" style="width:auto;padding:6px 10px"><option value="work">Questions & answers</option><option value="all">All activity</option><option value="guide">Guide reading</option><option value="pages">Pages & sections</option></select></h2><div id="s-tl"></div><button class="sc-btn" id="s-more" style="margin-top:12px;width:100%">Load more</button></div>
        <div class="sc-card"><h2>Comments & recommendations</h2>${(comments || []).length ? comments.map(c => `<div class="sc-comment ${c.kind === 'recommendation' ? 'rec' : ''}" style="margin-bottom:8px"><p>${c.kind === 'recommendation' ? '⭐ ' : ''}${esc(c.body)}</p><small>${esc(c.author_name || '')} · ${esc(ago(c.created_at))} · ${c.read_at ? 'seen' : 'not seen yet'}</small></div>`).join('') : '<p class="sc-muted">No comments yet.</p>'}</div></div>`;
    const KINDS = { work: ['answer', 'ai_examine', 'mcq', 'assignment'], guide: ['guide_section'], pages: ['page_view', 'view', 'paper_open'] };
    let offset = 0;
    const load = async (reset) => {
      if (reset) { offset = 0; $('#s-tl').innerHTML = '<div class="sc-loading"><span class="sc-spin"></span></div>'; }
      const k = $('#s-kind').value;
      let q = S.sb.from('activity_events').select('*').eq('user_id', uid).order('created_at', { ascending: false }).range(offset, offset + 79);
      if (KINDS[k]) q = q.in('kind', KINDS[k]);
      const { data } = await q;
      offset += (data || []).length;
      const html = RA10ActivityView.timeline(data || [], { empty: 'Nothing recorded yet.' });
      if (reset) $('#s-tl').innerHTML = html; else $('#s-tl').insertAdjacentHTML('beforeend', html);
      $('#s-more').hidden = (data || []).length < 80;
    };
    $('#s-kind').onchange = () => load(true);
    $('#s-more').onclick = () => load(false);
    load(true);
    $('#s-ai').onclick = async (e) => {
      e.target.disabled = true; e.target.textContent = 'Analysing…';
      $('#s-report').innerHTML = '<h2>AI progress analysis</h2><div class="sc-scan"><span class="orb"></span><p class="sc-muted">Reading every answer, mark and section ' + esc(first) + ' studied…</p></div>';
      try { const r = await api('analyse-student', { studentId: uid, classId: classId || null, days: 30 }); if (!r.ok) throw new Error(r.error); $('#s-report').innerHTML = '<h2>AI progress analysis</h2>' + reportHtml(r.report); }
      catch (err) { $('#s-report').innerHTML = '<h2>AI progress analysis</h2><p class="sc-muted">' + esc(err.message) + '</p>'; }
      e.target.disabled = false; e.target.textContent = '✦ Analyse again';
    };
    $('#s-com').onclick = () => modal(`<h2>Comment for ${esc(first)}</h2><div class="sc-field"><textarea id="m-c" placeholder="They'll see this on their RA10 homepage"></textarea></div><div class="sc-row" style="justify-content:flex-end"><button class="sc-btn" data-close>Cancel</button><button class="sc-btn pri" id="m-send">Send</button></div>`, (m, close) => {
      $('#m-send', m).onclick = async () => { const body = $('#m-c', m).value.trim(); if (!body) return; const { error } = await S.sb.from('edu_comments').insert({ student_id: uid, author_name: myName(), class_id: classId || null, body }); if (error) return toast(error.message); close(); toast('Sent'); viewStudent(uid, classId); };
    });
    $('#s-rec').onclick = () => recommendModal(uid, classId, first);
  }
  function recommendModal(uid, classId, first) {
    const units = (classId && (S.classes.find(c => c.id === classId) || {}).units) || (S.school && S.school.units) || UNITS().map(u => u.path);
    modal(`<h2>Recommend work for ${esc(first)}</h2>
      <div class="sc-grid two"><div class="sc-field"><label>Unit</label><select id="m-u">${(units.length ? units : UNITS().map(u => u.path)).map(u => `<option value="${esc(u)}">${esc((unitOf(u) || {}).name || u)}</option>`).join('')}</select></div>
      <div class="sc-field"><label>What</label><select id="m-t"><option value="guide">A revision guide section</option><option value="questions">Practise questions</option><option value="quiz">A quick quiz</option><option value="flashcards">Flashcards</option><option value="paper">A past paper</option></select></div></div>
      <div class="sc-field" id="m-secwrap"><label>Guide section</label><select id="m-sec"><option value="">Loading sections…</option></select></div>
      <div class="sc-field"><label>Message</label><textarea id="m-c" placeholder="e.g. Your answers on DHCP lost marks — read this section, then try the quiz again."></textarea></div>
      <div class="sc-row" style="justify-content:flex-end"><button class="sc-btn" data-close>Cancel</button><button class="sc-btn pri" id="m-send">Send recommendation</button></div>`, (m, close) => {
      const fill = async () => {
        $('#m-secwrap', m).hidden = $('#m-t', m).value !== 'guide';
        if ($('#m-t', m).value !== 'guide') return;
        $('#m-sec', m).innerHTML = '<option value="">Loading sections…</option>';
        try { const c = await catalog($('#m-u', m).value); $('#m-sec', m).innerHTML = (c.guide || []).map(g => `<option value="${esc(g.id)}">${esc(g.title)}</option>`).join('') || '<option value="">No sections found</option>'; }
        catch (e) { $('#m-sec', m).innerHTML = '<option value="">Could not load</option>'; }
      };
      $('#m-u', m).onchange = fill; $('#m-t', m).onchange = fill; fill();
      $('#m-send', m).onclick = async () => {
        const unit = $('#m-u', m).value, type = $('#m-t', m).value, sec = $('#m-sec', m);
        const title = type === 'guide' && sec.value ? sec.options[sec.selectedIndex].text : ({ questions: 'Practise questions', quiz: 'Quick quiz', flashcards: 'Flashcards', paper: 'Past paper', guide: 'Revision guide' }[type] + ' — ' + ((unitOf(unit) || {}).short || ''));
        const body = $('#m-c', m).value.trim() || ('Try this: ' + title);
        const { error } = await S.sb.from('edu_comments').insert({ student_id: uid, author_name: myName(), class_id: classId || null, kind: 'recommendation', body, recommendation: { unit, type, ref: type === 'guide' ? sec.value : null, title } });
        if (error) return toast(error.message);
        close(); toast('Recommendation sent'); viewStudent(uid, classId);
      };
    });
  }
  function reportHtml(r, cls) {
    if (!r) return '';
    const list = (arr) => (arr || []).length ? `<ul>${arr.map(x => `<li>${esc(typeof x === 'string' ? x : (x.name ? x.name + ' — ' + (x.why || '') : (x.topic ? x.topic + ': ' + (x.evidence || '') : (x.title ? x.title + ' — ' + (x.why || '') : JSON.stringify(x)))))}</li>`).join('')}</ul>` : '<p class="sc-muted">—</p>';
    const risk = r.risk ? `<span class="sc-badge ${r.risk === 'low' ? 'ok' : r.risk === 'medium' ? 'warn' : 'bad'}">${esc(r.risk)} risk</span>` : '';
    return `<div class="sc-report"><div class="head"><b>${esc(r.headline || '')}</b> ${risk}<p style="margin:6px 0 0">${esc(r.summary || '')}</p><small class="sc-muted">Generated ${esc(ago(r.generated_at))}${r.days ? ' · last ' + esc(r.days) + ' days' : ''}</small></div>
      ${cls ? `<div class="sc-grid two"><div><h3>Doing well</h3>${list(r.top_performers)}</div><div><h3>Needs support</h3>${list(r.needs_support)}</div></div><div><h3>Common gaps</h3>${list(r.common_gaps)}</div>${r.engagement ? `<div><h3>Engagement</h3><p>${esc(r.engagement)}</p></div>` : ''}`
        : `<div class="sc-grid two"><div><h3>Strengths</h3>${list(r.strengths)}</div><div><h3>Concerns</h3>${list(r.concerns)}</div></div>
      ${(r.topics || []).length ? `<div><h3>Topics</h3><div class="sc-topics">${r.topics.map(t => `<div class="sc-topic"><span class="sc-badge ${t.status === 'secure' ? 'ok' : t.status === 'developing' ? 'warn' : 'bad'}">${esc(t.status)}</span><span><b>${esc(t.topic)}</b> <span class="sc-muted">${esc(t.evidence || '')}</span></span></div>`).join('')}</div></div>` : ''}
      ${r.exam_technique ? `<div><h3>Exam technique</h3><p>${esc(r.exam_technique)}</p></div>` : ''}
      ${r.engagement ? `<div><h3>Engagement</h3><p>${esc(r.engagement.level || '')} — ${esc(r.engagement.note || '')}</p></div>` : ''}
      <div><h3>Recommended work</h3>${list(r.recommendations)}</div>`}
      <div><h3>Next steps for you</h3>${list(r.teacher_actions)}</div></div>`;
  }

  /* ── activity across my classes ── */
  async function myStudents() {
    const ids = new Map();
    for (const c of S.classes) {
      try { (await roster(c.id)).filter(r => r.role === 'student' && r.user_id).forEach(r => ids.set(r.user_id, r)); } catch (e) {}
    }
    return ids;
  }
  async function activityFeed(host, limit) {
    const ids = await myStudents();
    if (!ids.size) { host.innerHTML = '<div class="sc-empty">When your students start revising, every question they answer appears here.</div>'; return; }
    const { data } = await S.sb.from('activity_events').select('*').in('user_id', Array.from(ids.keys())).not('kind', 'in', '(page_view,view)').order('created_at', { ascending: false }).limit(limit || 150);
    (data || []).forEach(e => { const r = ids.get(e.user_id) || {}; e.display_name = r.display_name || r.email; });
    host.innerHTML = RA10ActivityView.timeline(data || [], { who: true, empty: 'No student activity yet.' });
  }
  async function viewActivity() {
    main.innerHTML = `<div class="sc-h"><div><h1>Student activity</h1><p>Every question your students answered, what they wrote, their marks and what they read — newest first.</p></div></div><div class="sc-card" id="act"><div class="sc-loading"><span class="sc-spin"></span></div></div>`;
    activityFeed($('#act'), 200);
  }

  boot();
})();
