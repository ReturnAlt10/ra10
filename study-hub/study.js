/* RA10 Study Hub — AI daily lessons (Premium; one free trial lesson).
   Home: a Duolingo-style path of your lessons, today's lesson, make-your-own, insights.
   Player: learn cards, multiple choice, true/false, fill the gap, match, put in order, an exam
   question marked by the real RA10 AI Examiner, and a recap; wrong answers come back once.
   All icons are custom animated SVGs from icons.js (no emojis). */
(function () {
  'use strict';
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const I = (name, o) => (window.SHIcons ? SHIcons.svg(name, o) : '');
  const iconOf = (l) => (window.SHIcons ? SHIcons.forLesson(l) : 'book');
  const unitIcon = (p) => (window.SHIcons ? SHIcons.forUnit(p) : 'book');
  const main = $('#sh-main');
  const UNITS = () => (window.RA10Units ? RA10Units.all() : []);
  const unitOf = (p) => (window.RA10Units ? RA10Units.byPath(p) : null);
  const unitName = (u) => (u ? u.name.replace(/^Unit \d+:\s*/, '').replace(/^Level 2 IT Unit \d+:\s*/, '') : '');
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const S = { sb: null, me: null, profile: null, status: null, plan: null, cat: {}, building: false, buildErr: null, pathAll: false };

  /* ───────────── helpers ───────────── */
  function toast(msg, ms) { const t = $('#sh-toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), ms || 3200); }
  async function api(action, body) {
    const s = RA10.getSession();
    const raw = RA10._raw || {};
    const res = await fetch((raw.SUPABASE_URL || 'https://tcrrgsylxbyyrmnouihl.supabase.co') + '/functions/v1/study-hub', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.access_token, apikey: raw.SUPABASE_ANON_KEY || '' },
      body: JSON.stringify(Object.assign({ action }, body || {}))
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok && !data.ok) throw new Error(data.error || (res.status === 404 ? 'Study Hub isn’t switched on yet (the study-hub function needs deploying).' : 'Request failed (' + res.status + ')'));
    return data;
  }
  function firstName() {
    const p = S.profile || {};
    const n = p.display_name || p.username || (S.me && S.me.email ? S.me.email.split('@')[0] : '');
    return String(n).split(/[\s._]/)[0].replace(/^./, c => c.toUpperCase());
  }
  function greet() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }
  function starCount(score, max) { const pct = max ? score / max : 0; return pct >= .9 ? 3 : pct >= .65 ? 2 : pct > 0 ? 1 : 0; }
  function stars(score, max, size) {
    const n = starCount(score, max);
    return `<span class="sh-stars" aria-label="${n} of 3 stars">${[0, 1, 2].map(i => `<i class="${i < n ? 'on' : ''}">${I('star', { size: size || 16 })}</i>`).join('')}</span>`;
  }
  function track(kind, f) { try { if (window.RA10Track) RA10Track.log(kind, f); } catch (e) {} }
  const fmtDay = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  /* ───────────── sound (tiny WebAudio blips) ───────────── */
  const Snd = {
    on: store.get('sh_sound') !== '0', ctx: null,
    tone(f, t, d, type, v) {
      if (!this.on) return;
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const c = this.ctx, o = c.createOscillator(), g = c.createGain();
        o.type = type || 'sine'; o.frequency.value = f; o.connect(g); g.connect(c.destination);
        const s = c.currentTime + (t || 0);
        g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(v || 0.18, s + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, s + d);
        o.start(s); o.stop(s + d + 0.05);
      } catch (e) {}
    },
    ok() { this.tone(660, 0, .16, 'triangle'); this.tone(990, .1, .22, 'triangle'); },
    bad() { this.tone(220, 0, .22, 'square', .07); this.tone(180, .12, .26, 'square', .06); },
    tap() { this.tone(520, 0, .05, 'sine', .05); },
    done() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * .12, .3, 'triangle', .16)); }
  };

  /* ───────────── unit content (read from the unit app in a hidden frame) ───────────── */
  function unitFrame(unitPath, query, type, ms) {
    const u = unitOf(unitPath);
    if (!u) return Promise.reject(new Error('Unknown unit'));
    return new Promise((resolve, reject) => {
      const f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
      f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:900px;visibility:hidden;border:0';
      f.src = u.app + query;
      const done = (v, err) => { window.removeEventListener('message', onMsg); clearTimeout(t); f.remove(); if (err) reject(err); else resolve(v); };
      const onMsg = (e) => { if (e.origin === location.origin && e.data && e.data.type === type && e.source === f.contentWindow) done(e.data); };
      const t = setTimeout(() => done(null, new Error('The unit took too long to load.')), ms || 40000);
      window.addEventListener('message', onMsg);
      document.body.appendChild(f);
    });
  }
  function loadCatalog(unitPath) {
    if (S.cat[unitPath]) return Promise.resolve(S.cat[unitPath]);
    try { const c = JSON.parse(sessionStorage.getItem('ra10_cat_' + unitPath) || 'null'); if (c) { S.cat[unitPath] = c; return Promise.resolve(c); } } catch (e) {}
    if (S['_catp_' + unitPath]) return S['_catp_' + unitPath];
    const p = unitFrame(unitPath, '?ra10catalog=1', 'ra10:catalog').then(d => {
      const c = d.catalog; S.cat[unitPath] = c;
      try { sessionStorage.setItem('ra10_cat_' + unitPath, JSON.stringify(c)); } catch (err) {}
      delete S['_catp_' + unitPath];
      return c;
    }, e => { delete S['_catp_' + unitPath]; throw e; });
    S['_catp_' + unitPath] = p;
    return p;
  }
  // the complete real questions (official mark scheme, spec code…) for the AI Examiner
  function loadFullQuestions(unitPath, ids) {
    if (!ids || !ids.length) return Promise.resolve([]);
    return unitFrame(unitPath, '?ra10catalog=1&full=' + encodeURIComponent(ids.join(',')), 'ra10:questions', 25000)
      .then(d => (d && Array.isArray(d.questions) ? d.questions : []), () => []);
  }
  function specTopics(cat) {
    const out = [];
    Object.keys((cat && cat.spec) || {}).sort().forEach(a => ((cat.spec[a] || {}).topics || []).forEach(t => {
      const label = ((t.code ? t.code + ' ' : '') + (t.name || '')).trim();
      if (label) out.push({ aim: a, aimTitle: cat.spec[a].title || ('Aim ' + a), code: t.code || '', name: t.name || label, label });
    }));
    if (!out.length && cat) {
      const seen = new Set();
      (cat.quiz || []).concat(cat.questions || []).forEach(q => { const k = norm(q.topic); if (q.topic && !seen.has(k) && seen.size < 60) { seen.add(k); out.push({ aim: q.aim || '', aimTitle: q.aim ? 'Aim ' + q.aim : 'Topics', code: '', name: q.topic, label: q.topic }); } });
    }
    return out;
  }
  function topicMatcher(topic) {
    const t = norm(topic), words = t.split(' ').filter(w => w.length > 3);
    const code = (String(topic || '').match(/^\s*([A-Z]\d+(?:\.\d+)*)/i) || [])[1];
    return (s) => {
      const n = norm(s); if (!n || !t) return false;
      if (n.indexOf(t) >= 0 || t.indexOf(n) >= 0) return true;
      if (code && n.indexOf(norm(code)) === 0) return true;
      return words.length > 0 && words.filter(w => n.indexOf(w) >= 0).length >= Math.min(2, words.length);
    };
  }
  // real questions from the unit that match the topic → sent to the lesson writer
  function grounding(cat, topic) {
    if (!cat) return {};
    const topics = specTopics(cat);
    const match = topicMatcher(topic);
    const code = (String(topic || '').match(/^\s*([A-Z]\d+(?:\.\d+)*)/i) || [])[1];
    const spec = topics.find(x => match(x.label));
    const aim = spec ? spec.aim : (code ? code.charAt(0).toUpperCase() : '');
    const byAim = (q) => aim && String(q.aim || '').toUpperCase().charAt(0) === aim.toUpperCase();
    const fill = (list, ok, n) => { const a = shuffle(list.filter(q => ok(q))); if (a.length < n) a.push(...shuffle(list.filter(q => !ok(q) && byAim(q))).slice(0, n - a.length)); return a.slice(0, n); };
    const L = 'ABCDEF';
    const quiz = fill(cat.quiz || [], q => match(q.topic) || match(q.q), 8).map(q => {
      const choices = q.choices || [];
      let c = q.correct;
      if (typeof c === 'string' && /^[A-F]$/i.test(c.trim())) c = L.indexOf(c.trim().toUpperCase());
      else if (typeof c === 'string') c = choices.findIndex(x => norm(x) === norm(c));
      return { q: q.q, choices, correct: Number(c), topic: q.topic };
    }).filter(q => q.correct >= 0 && q.correct < q.choices.length);
    const questions = fill((cat.questions || []).filter(q => !q.marks || (q.marks >= 2 && q.marks <= 9)), q => match(q.topic) || match(q.q), 3).map(q => ({ id: q.id, q: q.q, marks: q.marks, verb: q.verb, topic: q.topic }));
    return { quiz, questions, topics: topics.map(x => x.label).slice(0, 60) };
  }
  async function fullGrounding(unitPath, cat, topic) {
    const g = grounding(cat, topic || '');
    const ids = (g.questions || []).map(q => q.id).filter(x => x != null).map(String);
    if (ids.length) g.exam = await loadFullQuestions(unitPath, ids);
    return g;
  }
  function pickTopic(cat) {
    const strong = new Set(((S.plan && S.plan.strong) || []).map(t => norm(t.topic)));
    const recent = new Set(((S.plan && S.plan.recentLessonTopics) || []).map(norm));
    const all = specTopics(cat);
    const fresh = all.filter(t => !strong.has(norm(t.label)) && !strong.has(norm(t.name)) && !recent.has(norm(t.label)) && !recent.has(norm(t.name)));
    const x = pick(fresh.length ? fresh : all.length ? all : [null]);
    return x ? x.label : null;
  }

  /* ───────────── boot ───────────── */
  async function boot() {
    let n = 0;
    while (!window.RA10 && n++ < 60) await new Promise(r => setTimeout(r, 100));
    try { await RA10.init(); } catch (e) { console.warn(e); }
    if (!RA10.isLoggedIn()) return signedOut();
    S.sb = RA10.getClient();
    S.me = RA10.getSession().user;
    S.profile = RA10.getProfile();
    await refresh();
    const qs = new URLSearchParams(location.search);
    if (qs.get('lesson')) openLesson(qs.get('lesson'));
    else if (qs.get('preview')) openLesson(qs.get('preview'));
    else if (qs.get('assignment')) openAssigned(qs.get('assignment'), qs.get('item'));
  }
  async function refresh() {
    const [st, pl, edu] = await Promise.allSettled([S.sb.rpc('study_hub_status'), api('plan'), S.sb.rpc('edu_my_context')]);
    S.edu = edu.status === 'fulfilled' && edu.value && !edu.value.error ? edu.value.data : null;
    if (st.status === 'rejected' || (st.value && st.value.error)) {
      const msg = st.status === 'rejected' ? st.reason : st.value.error;
      return fail('Study Hub isn’t set up yet. The database update (supabase/sql/study-hub.sql) needs to be run. (' + esc((msg && msg.message) || msg) + ')');
    }
    S.status = st.value.data || {};
    S.plan = pl.status === 'fulfilled' ? pl.value : null;
    home();
  }
  function fail(msg) { main.innerHTML = `<div class="sh-card sh-empty">${I('alert', { size: 40 })}<b>Something went wrong</b>${msg}</div>`; }
  function signedOut() {
    try { sessionStorage.setItem('ra10_after_auth', location.pathname + location.search); } catch (e) {}
    main.innerHTML = `<div class="sh-lock"><div class="sh-lock-ic">${I('sparkles', { size: 56 })}</div><h1>Your daily lesson is waiting</h1>
      <p>Study Hub looks at what you've been revising on RA10 and builds you a short, game-like lesson every day — focused on exactly what you need.</p>
      <a class="sh-btn pri lg" href="/auth">Sign in to start</a></div>`;
  }

  /* ───────────── home ───────────── */
  function home() {
    document.body.style.overflow = '';
    const st = S.status || {};
    const premium = !!st.premium;
    if (!premium && st.trial_used && !(st.lessons || []).length) return lockedScreen();
    const banner = premium ? '' : !st.trial_used
      ? `<div class="sh-banner">${I('gift', { size: 26 })}<span><b>Try Study Hub free.</b> You can make one free lesson to see how it works. Study Hub is part of RA10 Premium.</span></div>`
      : `<div class="sh-banner">${I('lock', { size: 24 })}<span>You've used your free lesson. Daily lessons and unlimited lessons are part of <b>RA10 Premium</b>, coming soon.</span><button class="sh-btn sm gold" id="sh-why">What's included</button></div>`;
    main.innerHTML = `${banner}
      <section class="sh-hero">
        <div class="sh-hero-copy"><p class="sh-eyebrow">${I('sparkles', { size: 16 })} Study Hub</p><h1>${esc(greet())}${firstName() ? ', ' + esc(firstName()) : ''}</h1><p class="sh-muted">${st.streak ? `You're on a <b>${st.streak}-day streak</b>. Keep it going!` : 'Finish a lesson today to start a streak.'}</p></div>
        <div class="sh-statrow">
          <div class="sh-statc fire">${I('flame', { size: 30 })}<span><b>${st.streak || 0}</b><small>day streak</small></span></div>
          <div class="sh-statc xp">${I('bolt', { size: 30 })}<span><b>${st.total_xp || 0}</b><small>XP earned</small></span></div>
          <div class="sh-statc done">${I('trophy', { size: 30 })}<span><b>${st.total_done || 0}</b><small>lessons done</small></span></div>
        </div>
      </section>
      <div class="sh-layout">
        <section class="sh-pathcol" id="sh-pathcard"></section>
        <aside class="sh-rail"><section id="sh-set" class="sh-card sh-set sh-r-set" hidden></section><section id="sh-today" class="sh-r-today"></section><section class="sh-card sh-make sh-r-make" id="sh-make"></section><section class="sh-card sh-r-week" id="sh-week"></section><section class="sh-card sh-r-ins" id="sh-insights"></section></aside>
      </div>`;
    const why = $('#sh-why'); if (why) why.onclick = lockedScreen;
    paintSet(); paintToday(); paintMake(); paintWeek(); paintInsights(); paintPath();
    if (premium && !st.daily && !S.building && !S.buildErr && (S.plan && S.plan.focus || store.get('sh_unit'))) buildDaily();
  }

  function paintToday() {
    const box = $('#sh-today'); if (!box) return;
    const st = S.status || {}, d = st.daily, premium = !!st.premium;
    const focus = (S.plan && S.plan.focus) || null;
    const card = (cls, eyebrow, icon, title, meta, extra, acts) => `<div class="sh-today${cls ? ' ' + cls : ''}"><span class="eyebrow">${eyebrow}</span>
      <div class="row"><div class="emo">${icon}</div><div style="flex:1;min-width:0"><h2>${title}</h2>${meta ? `<div class="meta">${meta}</div>` : ''}</div></div>${extra || ''}${acts ? `<div class="acts">${acts}</div>` : ''}</div>`;
    if (S.building) {
      box.innerHTML = card('', I('sun', { size: 15 }) + ' Today\'s lesson', I('brain', { size: 44 }), 'Building your lesson…', `<span class="sh-build-line"><span class="sh-spin"></span><span id="sh-build-msg">Looking at what you've been revising</span></span>`, `<div class="why" style="display:grid;gap:8px"><div class="shimmer" style="width:90%"></div><div class="shimmer" style="width:70%"></div></div>`);
      return;
    }
    if (d) {
      const u = unitOf(d.unit), doneNow = d.status === 'done';
      box.innerHTML = card(doneNow ? 'done' : '', doneNow ? I('check', { size: 15 }) + ' Done for today' : I('sun', { size: 15 }) + ' Today\'s lesson', I(iconOf(d), { size: 44 }), esc(d.title),
        esc([u && u.short, d.minutes ? '≈ ' + d.minutes + ' min' : '', doneNow && d.max_score ? d.score + '/' + d.max_score + ' correct' : ''].filter(Boolean).join(' · ')),
        d.reason && !doneNow ? `<div class="why"><b>Why this lesson</b>${esc(d.reason)}</div>` : doneNow ? `<div class="why"><b>Great work</b>Come back tomorrow for a new lesson${st.streak ? ' and keep your ' + st.streak + '-day streak' : ''}.</div>` : '',
        doneNow ? `<button class="sh-btn light" data-open="${esc(d.id)}">Replay</button>${st.can_create ? `<button class="sh-btn clear" data-make>Make another</button>` : ''}` : `<button class="sh-btn light lg" data-open="${esc(d.id)}">${d.status === 'in_progress' ? 'Continue lesson' : 'Start lesson'} ${I('arrow', { size: 18 })}</button>`);
      $$('[data-open]', box).forEach(b => b.onclick = () => openLesson(b.dataset.open));
      $$('[data-make]', box).forEach(b => b.onclick = () => openMaker());
      return;
    }
    if (S.buildErr) {
      box.innerHTML = card('', I('sun', { size: 15 }) + ' Today\'s lesson', I('alert', { size: 44 }), 'We couldn\'t build today\'s lesson', esc(S.buildErr), '', '<button class="sh-btn light" id="sh-retry">Try again</button>');
      $('#sh-retry').onclick = () => { S.buildErr = null; buildDaily(); };
      return;
    }
    if (!premium && st.trial_used) {
      box.innerHTML = card('', I('lock', { size: 15 }) + ' Premium', I('crown', { size: 44 }), 'A new lesson every day', 'Daily lessons built from your revision are part of RA10 Premium — coming soon.', '', '<button class="sh-btn light" id="sh-why2">What\'s included</button>');
      $('#sh-why2').onclick = lockedScreen;
      return;
    }
    const pref = store.get('sh_unit');
    if (!focus && !pref) {
      const opts = UNITS().map(u => `<option value="${esc(u.path)}">${esc(u.short + ' — ' + unitName(u))}</option>`).join('');
      box.innerHTML = card('', I('sun', { size: 15 }) + ' Today\'s lesson', I('compass', { size: 44 }), 'What are you studying?', 'Pick a subject and we\'ll build your first lesson. As you revise on RA10, lessons get tailored to you.', '',
        `<select class="sh-in sh-in-light" id="sh-first-unit">${opts}</select><button class="sh-btn light" id="sh-first-go">${premium ? 'Build my lesson' : 'Build my free lesson'}</button>`);
      $('#sh-first-go').onclick = () => { store.set('sh_unit', $('#sh-first-unit').value); buildDaily(!premium); };
      return;
    }
    const fu = unitOf((focus && focus.unit) || pref);
    box.innerHTML = card('', I('gift', { size: 15 }) + ' Your free lesson', I(unitIcon((focus && focus.unit) || pref), { size: 44 }), esc(focus && focus.topic ? focus.topic : (fu ? fu.short : 'Your lesson')), esc(fu ? fu.name : ''),
      focus && focus.reason ? `<div class="why"><b>Why this lesson</b>${esc(focus.reason)}</div>` : '', `<button class="sh-btn light lg" id="sh-trial-go">Build my free lesson ${I('arrow', { size: 18 })}</button>`);
    $('#sh-trial-go').onclick = () => buildDaily(true);
  }

  async function buildDaily(openWhenReady) {
    if (S.building) return;
    const focus = (S.plan && S.plan.focus) || (store.get('sh_unit') ? { unit: store.get('sh_unit'), topic: null, reason: '' } : null);
    if (!focus) return paintToday();
    const u = unitOf(focus.unit);
    S.building = true; S.buildErr = null; paintToday(); paintPath();
    const msgs = ['Looking at what you\'ve been revising', 'Finding the topics that need work', 'Pulling real exam questions from ' + (u ? u.short : 'your unit'), 'Writing your lesson', 'Checking every answer', 'Adding the finishing touches'];
    let mi = 0; const tick = setInterval(() => { mi = Math.min(msgs.length - 1, mi + 1); const m = $('#sh-build-msg'); if (m) m.textContent = msgs[mi]; }, 6000);
    try {
      const cat = u ? await loadCatalog(focus.unit).catch(() => null) : null;
      const topic = focus.topic || (cat ? pickTopic(cat) : null);
      const reason = focus.reason || (topic ? `A fresh topic from ${u ? u.short : 'your unit'} to keep your revision moving.` : '');
      const g = u ? await fullGrounding(focus.unit, cat, topic) : {};
      const r = await api('create', { mode: 'daily', unit: focus.unit, unitName: u ? u.name : focus.unit, qual: u ? u.qual : '', topic, reason, grounding: g });
      if (!r.ok) { if (r.locked) { S.status.trial_used = true; S.status.can_create = false; } throw new Error(r.error || 'Could not build the lesson.'); }
      S.status.daily = r.lesson;
      if (!S.status.premium) { S.status.trial_used = true; S.status.can_create = false; }
      if (!r.existing) { S.status.lessons = [r.lesson].concat(S.status.lessons || []); toast('Today\'s lesson is ready'); }
      S.building = false;
      if (openWhenReady) { home(); return play(r.lesson); }
      home();
    } catch (e) {
      S.building = false; S.buildErr = e.message || String(e); paintToday(); paintPath();
    } finally { clearInterval(tick); }
  }

  // Study Hub lessons a teacher has set (from the student's classes)
  function setItems() {
    const out = [];
    const c = S.edu;
    if (!c || !Array.isArray(c.assignments)) return out;
    const lessons = (S.status && S.status.lessons) || [];
    c.assignments.filter(a => !a.mine && a.status !== 'closed').forEach(a => (a.item_list || []).filter(it => it.type === 'studyhub').forEach(it => {
      const l = lessons.find(x => x.assignment_id === a.id && x.item_id === it.id);
      out.push({ a, it, l, done: !!(l && l.status === 'done') });
    }));
    return out;
  }
  function paintSet() {
    const box = $('#sh-set'); if (!box) return;
    const list = setItems();
    box.hidden = !list.length;
    if (!list.length) return;
    const open = list.filter(x => !x.done);
    box.innerHTML = `<h2>${I('clipboard', { size: 20 })} Set by your teacher</h2><p class="sh-muted">${open.length ? `${open.length} lesson${open.length === 1 ? '' : 's'} to do` : 'All done — great work!'}</p>
      <div class="sh-setlist">${list.slice(0, 6).map(x => { const u = unitOf(x.it.unit); const due = x.a.due_at ? new Date(x.a.due_at) : null; const late = due && due < new Date() && !x.done;
        return `<button class="sh-setrow${x.done ? ' done' : ''}" data-aid="${esc(x.a.id)}" data-iid="${esc(x.it.id)}"><span class="ic" style="--uc:${esc((u && u.color) || '#5b4cf5')}">${I(x.done ? 'check' : x.it.mode === 'class' ? 'people' : 'sparkles', { size: 20 })}</span><span class="tx"><b>${esc(x.l ? x.l.title : (x.it.title || 'Study Hub lesson'))}</b><small>${esc([x.a.class_name, x.it.mode === 'class' ? 'Class lesson' : 'Personalised for you', due ? (late ? 'Overdue' : 'Due ' + fmtDay(due)) : ''].filter(Boolean).join(' · '))}</small></span><span class="go">${x.done ? stars(x.l.score, x.l.max_score, 14) : x.l && x.l.status === 'in_progress' ? 'Continue' : 'Start'}</span></button>`; }).join('')}</div>`;
    $$('[data-aid]', box).forEach(b => b.onclick = () => openAssigned(b.dataset.aid, b.dataset.iid));
  }
  async function openAssigned(assignmentId, itemId) {
    const { data: a, error } = await S.sb.from('edu_assignments').select('id, title, items, class_id, due_at').eq('id', assignmentId).maybeSingle();
    if (error || !a) return toast('That assignment could not be found.');
    const items = (a.items || []).filter(it => it.type === 'studyhub');
    const it = items.find(x => String(x.id) === String(itemId)) || items[0];
    if (!it) return toast('That assignment has no Study Hub lesson.');
    const have = ((S.status && S.status.lessons) || []).find(l => l.assignment_id === a.id && l.item_id === it.id);
    if (have) return openLesson(have.id);
    const u = unitOf(it.unit);
    const ov = document.createElement('div');
    ov.className = 'sh-gen';
    ov.innerHTML = `<div class="sh-gen-in"><div class="sh-orbit"><div class="ring"><span class="dot"></span></div><div class="core">${I(it.mode === 'class' ? 'clipboard' : 'brain', { size: 54 })}</div></div>
      <h2>${it.mode === 'class' ? 'Opening your teacher\'s lesson' : 'Building your lesson'}</h2><p class="sh-muted">${esc(a.title)}${u ? ' · ' + esc(u.short) : ''}</p>
      ${it.mode === 'class' ? '' : '<p class="sh-muted sh-small">Your teacher set this lesson to be built from your own progress — it takes about half a minute.</p>'}</div>`;
    document.body.appendChild(ov);
    try {
      let extra = {};
      if (it.mode !== 'class' && u) {
        const cat = await loadCatalog(it.unit).catch(() => null);
        const weak = ((S.plan && S.plan.weak) || []).find(t => t.unit === it.unit);
        const topic = it.topic || (weak && weak.topic) || (cat ? pickTopic(cat) : null);
        extra = { unitName: u.name, qual: u.qual, topic, grounding: await fullGrounding(it.unit, cat, topic || '') };
      }
      const r = await api('assigned', Object.assign({ assignmentId: a.id, itemId: it.id }, extra));
      if (!r.ok) throw new Error(r.error || 'Could not open the lesson.');
      if (!r.existing) S.status.lessons = [r.lesson].concat(S.status.lessons || []);
      ov.remove();
      home();
      play(r.lesson);
    } catch (e) {
      ov.innerHTML = `<div class="sh-gen-in">${I('alert', { size: 52, cls: 'c-bad' })}<h2>That didn't work</h2><p class="sh-muted">${esc(e.message || e)}</p><button class="sh-btn pri" id="sh-gen-x">Back</button></div>`;
      $('#sh-gen-x', ov).onclick = () => { ov.remove(); home(); };
    }
  }

  function paintMake() {
    const box = $('#sh-make'); if (!box) return;
    const st = S.status || {};
    box.innerHTML = `<div class="sh-make-ic">${I('wand', { size: 34 })}</div><div class="sh-make-copy"><h2>Make your own lesson</h2><p class="sh-muted">Any unit, any topic — pick how long and what to focus on.</p></div>
      <button class="sh-btn pri wide" id="sh-make-go" ${st.can_create ? '' : 'disabled'}>${st.can_create ? (st.premium ? 'Make a lesson' : 'Use my free lesson') : I('lock', { size: 16 }) + ' Premium'}</button>`;
    $('#sh-make-go').onclick = () => openMaker();
  }
  function paintWeek() {
    const box = $('#sh-week'); if (!box) return;
    const st = S.status || {};
    const days = (st.week || []).map((d, i, a) => { const dt = new Date(d.day + 'T12:00:00'); return `<span class="sh-day${d.done ? ' done' : ''}${i === a.length - 1 ? ' today' : ''}"><i>${d.done ? I('flame', { size: 18 }) : ''}</i>${'SMTWTFS'[dt.getDay()]}</span>`; }).join('');
    box.innerHTML = `<h2>${I('flame', { size: 20, cls: 'c-fire' })} This week</h2><div class="sh-week" aria-label="This week">${days}</div><p class="sh-muted sh-small" style="margin:10px 0 0">${st.done_today ? 'Today is done — see you tomorrow.' : 'Finish a lesson today to keep your streak.'}</p>`;
  }

  function paintInsights() {
    const box = $('#sh-insights'); if (!box) return;
    const p = S.plan;
    if (!p) { box.innerHTML = `<h2>${I('chart', { size: 20 })} What we've noticed</h2><p class="sh-muted">Your revision insights will appear here.</p>`; return; }
    const can = !!(S.status && S.status.can_create);
    const weak = (p.weak || []).slice(0, 5), strong = (p.strong || []).slice(0, 5), reading = (p.reading || []).slice(0, 3);
    box.innerHTML = `<h2>${I('chart', { size: 20 })} What we've noticed</h2><p class="sh-muted">From your last 30 days on RA10${p.totals ? ` · ${p.totals.answered} questions answered` : ''}.</p>
      ${!weak.length && !strong.length && !reading.length ? `<div class="sh-empty sm"><b>Still getting to know you</b>Answer questions and quizzes in any unit — Study Hub will spot your strengths and gaps and build lessons around them.</div>` : ''}
      ${weak.length ? `<div class="sh-ins-h">Needs work — tap for a lesson</div><div class="sh-chips">${weak.map(t => `<button class="sh-chip weak" data-unit="${esc(t.unit)}" data-topic="${esc(t.topic)}" ${can ? '' : 'disabled'}>${esc(t.topic)} <small>${t.pct}%</small></button>`).join('')}</div>` : ''}
      ${strong.length ? `<div class="sh-ins-h">You're strong at</div><div class="sh-chips">${strong.map(t => `<span class="sh-chip strong">${esc(t.topic)} <small>${t.pct}%</small></span>`).join('')}</div>` : ''}
      ${reading.length ? `<div class="sh-ins-h">Recently read</div><div class="sh-chips">${reading.map(t => `<button class="sh-chip" data-unit="${esc(t.unit)}" data-topic="${esc(t.topic)}" ${can ? '' : 'disabled'}>${I('book', { size: 15 })} ${esc(t.topic)}</button>`).join('')}</div>` : ''}`;
    $$('button[data-topic]', box).forEach(b => b.onclick = () => openMaker({ unit: b.dataset.unit, topic: b.dataset.topic, reason: b.classList.contains('weak') ? `You asked for help with ${b.dataset.topic}, one of the topics you've been finding tricky.` : `You read about ${b.dataset.topic} recently.` }));
  }

  /* ───────────── the path (Duolingo-style) ───────────── */
  const OFFSETS = [0, 52, 84, 52, 0, -52, -84, -52];
  function paintPath() {
    const box = $('#sh-pathcard'); if (!box) return;
    const st = S.status || {};
    const all = ((st.lessons || []).slice()).reverse(); // oldest first, newest at the bottom
    const LIMIT = 14;
    const hiddenCount = S.pathAll ? 0 : Math.max(0, all.length - LIMIT);
    const list = all.slice(hiddenCount);
    const daily = st.daily;
    const current = (daily && daily.status !== 'done' && daily.id) || ((list.slice().reverse().find(l => l.status !== 'done')) || {}).id || null;
    let html = '', lastUnit = null, n = 0, done = all.slice(0, hiddenCount).filter(l => l.status === 'done').length;
    const node = (o) => {
      const x = OFFSETS[n++ % OFFSETS.length];
      return `<div class="sh-prow" style="--x:${x}px">${o.bubble ? `<div class="sh-bubble">${o.bubble}</div>` : ''}
        <button class="sh-pnode ${o.state}" ${o.attrs || ''} aria-label="${esc(o.label)}">${o.ring ? `<span class="ring"></span>` : ''}${I(o.icon, { size: 34 })}</button>
        ${o.stars != null ? `<div class="sh-pstars">${o.stars}</div>` : ''}<div class="sh-plabel">${esc(o.title)}</div></div>`;
    };
    const banner = (unitPath) => {
      const u = unitOf(unitPath);
      return `<div class="sh-uban" style="--uc:${esc((u && u.color) || '#5b4cf5')}"><span class="ub">${I(unitIcon(unitPath), { size: 26 })}</span><span><small>${esc(u ? u.qual : 'Lessons')}</small><b>${esc(u ? u.short + ' · ' + unitName(u) : 'Your lessons')}</b></span></div>`;
    };
    if (hiddenCount) html += `<button class="sh-btn ghost sm sh-earlier" id="sh-earlier">Show ${hiddenCount} earlier lesson${hiddenCount === 1 ? '' : 's'}</button>`;
    list.forEach(l => {
      if (l.unit !== lastUnit) { html += banner(l.unit); lastUnit = l.unit; n = 0; }
      const isCur = l.id === current;
      const state = l.status === 'done' ? 'done' : isCur ? 'cur' : l.status === 'in_progress' ? 'prog' : 'ready';
      html += node({ state, icon: iconOf(l), title: l.title, label: l.title + (l.status === 'done' ? ', completed' : ''), attrs: `data-node="${esc(l.id)}"`, ring: state === 'cur' || state === 'prog',
        bubble: isCur ? (l.status === 'in_progress' ? 'Continue' : 'Start') : '', stars: l.status === 'done' ? stars(l.score, l.max_score, 15) : null });
      if (l.status === 'done' && ++done % 5 === 0) html += `<div class="sh-mile" style="--x:${-OFFSETS[(n + 2) % OFFSETS.length]}px">${I('trophy', { size: 54 })}<span>${done} lessons!</span></div>`;
    });
    if (S.building) html += node({ state: 'cur building', icon: 'brain', title: 'Building today\'s lesson…', label: 'Building today\'s lesson', bubble: 'Building', ring: true });
    if (!list.length && !S.building) html += node({ state: 'cur', icon: 'sparkles', title: 'Your first lesson', label: 'Start your first lesson', attrs: 'data-first', bubble: 'Start', ring: true });
    if (st.can_create) html += node({ state: 'add', icon: 'plus', title: 'New lesson', label: 'Make a new lesson', attrs: 'data-new' });
    html += node({ state: 'locked', icon: st.premium ? 'clock' : 'crown', title: st.premium ? 'Tomorrow\'s lesson' : 'Daily lessons · Premium', label: st.premium ? 'Tomorrow\'s lesson unlocks tomorrow' : 'Daily lessons are a Premium feature', attrs: 'data-locked' });
    box.innerHTML = `<div class="sh-path-head"><h2>${I('map', { size: 22 })} Your path</h2><span class="sh-muted sh-small">${st.total_done || 0} lesson${st.total_done === 1 ? '' : 's'} complete</span></div><div class="sh-path" id="sh-path">${html}</div>`;
    const earlier = $('#sh-earlier', box); if (earlier) earlier.onclick = () => { S.pathAll = true; paintPath(); };
    const byId = {}; (st.lessons || []).forEach(l => { byId[l.id] = l; });
    $$('[data-node]', box).forEach(b => b.onclick = (e) => { e.stopPropagation(); nodePop(b, byId[b.dataset.node]); });
    $$('[data-new]', box).forEach(b => b.onclick = () => openMaker());
    $$('[data-first]', box).forEach(b => b.onclick = () => { const t = $('#sh-today'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' }); const go = $('#sh-today .sh-btn'); if (go) go.focus(); });
    $$('[data-locked]', box).forEach(b => b.onclick = (e) => { e.stopPropagation(); if (!st.premium) return lockedScreen(); nodePop(b, null, 'Your next daily lesson is built for you tomorrow, from what you revise today.'); });
  }
  function nodePop(btn, l, note) {
    $$('.sh-pop').forEach(p => p.remove());
    $$('.sh-prow.popped').forEach(r => r.classList.toggle('popped', false));
    const row = btn.closest('.sh-prow');
    row.classList.add('popped');
    const pop = document.createElement('div');
    pop.className = 'sh-pop';
    if (!l) pop.innerHTML = `<p>${esc(note || '')}</p>`;
    else {
      const u = unitOf(l.unit), doneL = l.status === 'done';
      pop.innerHTML = `<b>${esc(l.title)}</b><small>${esc([l.kind === 'daily' ? 'Daily lesson' : l.kind === 'assigned' ? 'Set by your teacher' : 'Your lesson', u && u.short, fmtDay(l.created_at)].filter(Boolean).join(' · '))}</small>
        ${doneL ? `<div class="sh-pop-score">${stars(l.score, l.max_score, 18)}<span>${l.score}/${l.max_score} correct${l.xp ? ' · +' + l.xp + ' XP' : ''}</span></div>` : ''}
        <button class="sh-btn ${doneL ? 'gold' : 'pri'} wide">${doneL ? 'Practise again' : l.status === 'in_progress' ? 'Continue' : 'Start lesson'}</button>`;
      $('button', pop).onclick = () => openLesson(l.id);
    }
    row.appendChild(pop);
    setTimeout(() => document.addEventListener('click', function off(e) { if (!pop.contains(e.target)) { pop.remove(); row.classList.toggle('popped', false); document.removeEventListener('click', off); } }), 0);
  }

  function lockedScreen() {
    const st = S.status || {};
    const trialLesson = (st.lessons || []).find(l => l.trial) || (st.lessons || [])[0];
    main.innerHTML = `<div class="sh-lock"><div class="sh-lock-ic gold">${I('crown', { size: 60 })}</div><span class="sh-badge gold">RA10 Premium · coming soon</span>
      <h1>Study Hub is a Premium feature</h1>
      <p>${st.trial_used ? 'You\'ve had your free lesson. ' : ''}With Premium, Study Hub builds you a fresh lesson every day from what you've been revising, and you can make as many lessons as you like on any topic.</p>
      <div class="sh-feats">
        <div class="sh-feat">${I('sun', { size: 30 })}<b>A lesson every day</b><p>Ready each day, built around your weak spots and what you've just read.</p></div>
        <div class="sh-feat">${I('puzzle', { size: 30 })}<b>Bite-size and game-like</b><p>Learn cards, quick quizzes, matching, ordering and fill-the-gap — about 7 minutes.</p></div>
        <div class="sh-feat">${I('exam', { size: 30 })}<b>Real exam practice</b><p>Real exam questions marked by the RA10 AI Examiner against the mark scheme.</p></div>
        <div class="sh-feat">${I('wand', { size: 30 })}<b>Unlimited lessons</b><p>Pick any topic in any unit, or just ask for what you want to learn.</p></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="sh-btn gold lg" disabled>Premium is coming soon</button>
        ${trialLesson ? `<button class="sh-btn lg" data-open="${esc(trialLesson.id)}">Replay your free lesson</button>` : ''}
        ${(st.lessons || []).length ? '<button class="sh-btn ghost lg" id="sh-back-home">Back</button>' : ''}
      </div></div>`;
    $$('[data-open]', main).forEach(b => b.onclick = () => openLesson(b.dataset.open));
    const back = $('#sh-back-home'); if (back) back.onclick = home;
  }

  /* ───────────── make-your-own (sheet) ───────────── */
  function openMaker(preset) {
    const st = S.status || {};
    if (!st.can_create) return lockedScreen();
    preset = preset || {};
    const M = { unit: preset.unit || store.get('sh_unit') || (S.plan && S.plan.focus && S.plan.focus.unit) || (UNITS()[0] || {}).path, topic: preset.topic || null, request: '', length: store.get('sh_len') || 'standard', focus: store.get('sh_focus') || '', q: '', reason: preset.reason || '' };
    const recent = ((S.plan && S.plan.units) || []).map(x => x.path);
    const units = UNITS().slice().sort((a, b) => { const ia = recent.indexOf(a.path), ib = recent.indexOf(b.path); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
    const seg = (key, opts) => `<div class="sh-seg" data-seg="${key}" role="radiogroup">${opts.map(([v, t, sub, ic]) => `<button type="button" role="radio" data-v="${v}" class="${M[key] === v ? 'on' : ''}" aria-checked="${M[key] === v}">${I(ic, { size: 22 })}<b>${t}</b><small>${sub}</small></button>`).join('')}</div>`;
    const ov = document.createElement('div');
    ov.className = 'sh-modal';
    ov.innerHTML = `<div class="sh-sheet" role="dialog" aria-modal="true" aria-label="Make a lesson">
      <header class="sh-sheet-h"><span class="ic">${I('wand', { size: 26 })}</span><div><h2>Make a lesson</h2><p class="sh-muted">${st.premium ? 'As many as you like.' : 'This uses your one free lesson.'}</p></div><button class="sh-x" data-close aria-label="Close">${I('close', { size: 22 })}</button></header>
      <div class="sh-sheet-b">
        <section class="sh-msec"><h3><span class="n">1</span>Choose a unit</h3><div class="sh-units">${units.map(u => `<button type="button" class="sh-ucard${u.path === M.unit ? ' on' : ''}" data-u="${esc(u.path)}" style="--uc:${esc(u.color || '#5b4cf5')}"><span class="ub">${I(unitIcon(u.path), { size: 24 })}</span><span class="tx"><b>${esc(u.short)}</b><small>${esc(unitName(u))}</small></span><span class="tk">${I('check', { size: 20 })}</span></button>`).join('')}</div></section>
        <section class="sh-msec"><h3><span class="n">2</span>Choose a topic</h3><label class="sh-search">${I('search', { size: 18 })}<input id="mk-q" type="search" placeholder="Search topics…" autocomplete="off"></label><div class="sh-topics" id="mk-topics"></div></section>
        <section class="sh-msec"><h3><span class="n">3</span>Lesson style</h3>
          ${seg('length', [['quick', 'Quick', '≈ 4 min', 'bolt'], ['standard', 'Standard', '≈ 7 min', 'book'], ['deep', 'Deep dive', '≈ 11 min', 'brain']])}
          ${seg('focus', [['', 'Balanced', 'Teach + test', 'scales'], ['learn', 'Learn it', 'More explaining', 'bulb'], ['practise', 'Practise', 'More questions', 'target'], ['exam', 'Exam skills', 'Marks & command words', 'exam']])}
        </section>
        <section class="sh-msec"><h3><span class="n">4</span>Anything specific? <small>optional</small></h3><textarea id="mk-req" class="sh-in" rows="2" maxlength="300" placeholder="e.g. Explain the CIA triad with real examples, I keep mixing it up"></textarea></section>
      </div>
      <footer class="sh-sheet-f"><div class="sum" id="mk-sum"></div><button class="sh-btn pri lg" id="mk-go">${I('sparkles', { size: 20 })} Create lesson</button></footer></div>`;
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    const close = () => { ov.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('[data-close]')) close(); });
    const sum = () => {
      const u = unitOf(M.unit);
      $('#mk-sum', ov).innerHTML = `<b>${esc(u ? u.short : '')}</b> · ${esc(M.topic || (M.request.trim() ? 'Your request' : 'Surprise topic'))} · ${esc({ quick: 'Quick', standard: 'Standard', deep: 'Deep dive' }[M.length])}${M.focus ? ' · ' + esc({ learn: 'Learn it', practise: 'Practise', exam: 'Exam skills' }[M.focus]) : ''}`;
    };
    $$('.sh-ucard', ov).forEach(b => b.onclick = () => { M.unit = b.dataset.u; M.topic = null; store.set('sh_unit', M.unit); $$('.sh-ucard', ov).forEach(x => x.classList.toggle('on', x === b)); Snd.tap(); topics(); sum(); });
    $$('.sh-seg', ov).forEach(g => $$('button', g).forEach(b => b.onclick = () => { M[g.dataset.seg] = b.dataset.v; store.set(g.dataset.seg === 'length' ? 'sh_len' : 'sh_focus', b.dataset.v); $$('button', g).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); }); Snd.tap(); sum(); }));
    $('#mk-req', ov).oninput = (e) => { M.request = e.target.value; sum(); };
    $('#mk-q', ov).oninput = (e) => { M.q = e.target.value; topics(true); };
    $('#mk-go', ov).onclick = () => {
      close();
      createLesson({ unit: M.unit, topic: M.topic, request: M.request.trim(), length: M.length, focus: M.focus, reason: M.reason || (M.topic ? `You chose ${M.topic}.` : M.request.trim() ? 'You asked for this lesson.' : '') });
    };
    async function topics(filterOnly) {
      const box = $('#mk-topics', ov); if (!box) return;
      const unit = M.unit;
      if (!filterOnly) box.innerHTML = '<span class="sh-muted sh-small sh-loadline"><span class="sh-spin"></span> Loading topics…</span>';
      let cat = null;
      try { cat = await loadCatalog(unit); } catch (e) {}
      if (M.unit !== unit || !document.body.contains(box)) return;
      const weak = new Set(((S.plan && S.plan.weak) || []).filter(t => t.unit === unit).map(t => norm(t.topic)));
      const q = norm(M.q);
      const list = specTopics(cat).filter(t => !q || norm(t.label).indexOf(q) >= 0 || norm(t.aimTitle).indexOf(q) >= 0);
      let lastAim = null;
      box.innerHTML = `<button type="button" class="sh-topic surprise${!M.topic ? ' on' : ''}" data-t="">${I('sparkles', { size: 16 })} Surprise me</button>` +
        (list.length ? list.map(t => { const head = t.aim !== lastAim ? `<div class="sh-aim">${esc(t.aimTitle)}</div>` : ''; lastAim = t.aim; const w = weak.has(norm(t.label)) || weak.has(norm(t.name)); return head + `<button type="button" class="sh-topic${M.topic === t.label ? ' on' : ''}${w ? ' weak' : ''}" data-t="${esc(t.label)}" title="${w ? 'You\'ve been finding this tricky' : ''}">${t.code ? `<small>${esc(t.code)}</small>` : ''}${esc(t.name)}</button>`; }).join('')
          : `<p class="sh-muted sh-small" style="width:100%">${q ? 'No topics match that search.' : 'No topic list for this unit — describe what you want below.'}</p>`);
      $$('[data-t]', box).forEach(b => b.onclick = () => { M.topic = b.dataset.t || null; $$('[data-t]', box).forEach(x => x.classList.toggle('on', x === b)); Snd.tap(); sum(); });
    }
    topics(); sum();
    if (preset.topic) setTimeout(() => { const b = $('.sh-topic.on', ov); if (b) b.scrollIntoView({ block: 'nearest' }); }, 700);
  }

  /* ───────────── creating a lesson (full-screen builder) ───────────── */
  async function createLesson(o) {
    const st = S.status || {};
    if (!st.can_create) return lockedScreen();
    if (!st.premium && !confirm('This will use your one free Study Hub lesson. Continue?')) return;
    const u = unitOf(o.unit);
    const ov = document.createElement('div');
    ov.className = 'sh-gen';
    const steps = ['Reading your progress', 'Pulling real exam questions from ' + (u ? u.short : 'the unit'), 'Writing your lesson', 'Checking every answer'];
    ov.innerHTML = `<div class="sh-gen-in"><div class="sh-orbit"><div class="ring"><span class="dot"></span></div><div class="core">${I('brain', { size: 54 })}</div></div>
      <h2>Building your lesson</h2><p class="sh-muted">${esc(o.topic || o.request || (u ? u.name : ''))}</p>
      <ul class="sh-gen-steps">${steps.map((s, i) => `<li class="${i === 0 ? 'on' : ''}"><i></i>${esc(s)}</li>`).join('')}</ul></div>`;
    document.body.appendChild(ov);
    const lis = $$('li', ov);
    const setStep = (n) => lis.forEach((li, i) => { li.className = i < n ? 'ok' : i === n ? 'on' : ''; li.querySelector('i').innerHTML = i < n ? I('check', { size: 14, stroke: 2.6 }) : ''; });
    let writing = false; const tick = setTimeout(() => { if (writing) setStep(3); }, 22000);
    try {
      await new Promise(r => setTimeout(r, 400)); setStep(1);
      const cat = u ? await loadCatalog(o.unit).catch(() => null) : null;
      const g = u ? await fullGrounding(o.unit, cat, o.topic || o.request || '') : {};
      setStep(2); writing = true;
      const r = await api('create', { mode: 'custom', unit: o.unit, unitName: u ? u.name : o.unit, qual: u ? u.qual : '', topic: o.topic || null, request: o.request || '', reason: o.reason || '', length: o.length || 'standard', focus: o.focus || '', grounding: g });
      if (!r.ok) { if (r.locked) { st.trial_used = true; st.can_create = false; ov.remove(); return lockedScreen(); } throw new Error(r.error || 'Could not build the lesson.'); }
      setStep(4);
      if (!st.premium) { st.trial_used = true; st.can_create = false; }
      st.lessons = [r.lesson].concat(st.lessons || []);
      await new Promise(res => setTimeout(res, 450));
      ov.remove();
      home();
      try { play(r.lesson); } catch (err) { console.error(err); const p = $('.sh-play'); if (p) p.remove(); document.body.style.overflow = ''; toast('Your lesson is saved, but it could not be opened. Find it on your path.', 5000); }
    } catch (e) {
      ov.innerHTML = `<div class="sh-gen-in">${I('alert', { size: 52, cls: 'c-bad' })}<h2>That didn't work</h2><p class="sh-muted">${esc(e.message || e)}</p><button class="sh-btn pri" id="sh-gen-x">Back</button></div>`;
      $('#sh-gen-x', ov).onclick = () => { ov.remove(); home(); };
    } finally { clearTimeout(tick); }
  }

  async function openLesson(id) {
    $$('.sh-pop').forEach(p => p.remove());
    const { data, error } = await S.sb.from('study_lessons').select('*').eq('id', id).maybeSingle();
    if (error || !data) return toast('That lesson could not be found.' + (error && error.message ? ' (' + error.message + ')' : ''));
    try { play(data); }
    catch (e) {
      console.error('Study Hub: could not open lesson', e);
      const p = $('.sh-play'); if (p) p.remove();
      document.body.style.overflow = '';
      toast('Sorry, that lesson could not be opened. Please try again.', 5000);
    }
  }

  /* ═════════════════════════ lesson player ═════════════════════════ */
  const PRAISE = ['Nice one!', 'Spot on!', 'Brilliant!', 'Exactly right!', 'You\'ve got it!', 'Perfect!', 'Great work!'];
  const NOPE = ['Not quite', 'Almost!', 'Good try', 'So close'];
  const CHECKABLE = ['mcq', 'truefalse', 'fill', 'match', 'order', 'exam'];
  const KIND = { learn: ['book', 'New idea'], mcq: ['question', 'Quick check'], truefalse: ['scales', 'True or false?'], fill: ['pencil', 'Fill the gap'], match: ['puzzle', 'Match the pairs'], order: ['steps', 'Put it in order'], recap: ['flag', 'Recap'] };

  // Mark a written answer with the real RA10 AI Examiner (same backend as the unit apps).
  async function examine(lesson, step, i, answer) {
    if (!window.RA10 || typeof RA10.examineAnswer !== 'function') throw new Error('AI Examiner unavailable');
    const u = unitOf(lesson.unit);
    const q = step.real ? Object.assign({}, step.real) : {
      id: 'sh-' + lesson.id + '-' + i, question: step.q, marks: step.marks, command_verb: step.verb || '', topic: lesson.topic || '',
      scenario: step.context || undefined, unit: u ? u.short : '', mark_scheme: { points: step.points || [], model_answer: step.model || '' }
    };
    if (!q.marks) q.marks = step.marks;
    const res = await RA10.examineAnswer({ question: q, answer });
    const r = res && res.result;
    if (!r) throw new Error('No result');
    const max = Math.max(1, Number(r.max) || step.marks);
    return { score: Math.max(0, Math.min(max, Math.round(Number(r.earned) || 0))), max, feedback: r.examiner_comment || r.feedback || '', strengths: r.strengths || [], improvements: r.improvements || r.next_level || [], level: r.level, examiner: true };
  }

  function play(lesson) {
    const steps = (lesson.content && lesson.content.steps) || [];
    if (!steps.length) return toast('This lesson has no steps.');
    const preview = lesson.kind === 'template';
    const replay = lesson.status === 'done' || preview;
    const prog = (!replay && lesson.progress) || {};
    const results = replay ? {} : Object.assign({}, prog.results || {});
    const doneSet = new Set(replay ? [] : Object.keys(results).map(Number));
    const start = replay ? 0 : Math.max(0, Math.min(steps.length - 1, Number(prog.i) || 0));
    for (let i = 0; i < start; i++) doneSet.add(i);
    const P = { L: lesson, steps, replay, results, doneSet, queue: [], combo: 0, best: 0, t0: Date.now(), cur: null, retried: new Set() };
    for (let i = start; i < steps.length; i++) P.queue.push({ i, retry: false });
    const lessonIcon = iconOf(lesson);

    document.body.style.overflow = 'hidden';
    const el = document.createElement('div');
    el.className = 'sh-play' + (preview ? ' has-preview' : '');
    el.innerHTML = `<div class="sh-ph"><button class="sh-x" id="p-x" aria-label="Close lesson">${I('close', { size: 24 })}</button><div class="sh-bar" role="progressbar" aria-label="Lesson progress"><i id="p-bar" style="width:0"></i></div><span class="sh-combo" id="p-combo"></span><button class="sh-x sh-mute" id="p-snd" aria-label="Sound on or off" title="Sound">${I(Snd.on ? 'sound' : 'mute', { size: 24 })}</button></div>
      ${preview ? `<div class="sh-previewbar">${I('people', { size: 16 })} Teacher preview — this is what your students will see. Nothing is saved.</div>` : ''}<div class="sh-stage" id="p-stage"></div><div class="sh-foot" id="p-foot"><div class="sh-foot-in" id="p-foot-in"></div></div>`;
    document.body.appendChild(el);
    const stage = $('#p-stage', el), foot = $('#p-foot', el), footIn = $('#p-foot-in', el);
    $('#p-snd', el).onclick = (e) => { Snd.on = !Snd.on; store.set('sh_sound', Snd.on ? '1' : '0'); e.currentTarget.innerHTML = I(Snd.on ? 'sound' : 'mute', { size: 24 }); };
    const close = () => { document.removeEventListener('keydown', onKey); el.remove(); document.body.style.overflow = ''; if (preview) { try { window.close(); } catch (e) {} } refresh(); };
    $('#p-x', el).onclick = () => { if (P.queue.length && !P.finished && !replay && !confirm('Leave this lesson? Your progress is saved — you can carry on later.')) return; close(); };

    const setBar = () => { $('#p-bar', el).style.width = Math.round((P.doneSet.size / steps.length) * 100) + '%'; };
    const setCombo = () => { const c = $('#p-combo', el); c.innerHTML = P.combo >= 2 ? I('flame', { size: 22 }) + '<b>' + P.combo + '</b>' : ''; if (P.combo >= 2) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } };
    let saveT = null;
    const save = () => {
      if (replay) return;
      clearTimeout(saveT);
      saveT = setTimeout(() => {
        let i = 0; while (i < steps.length && P.doneSet.has(i)) i++;
        S.sb.from('study_lessons').update({ status: 'in_progress', progress: { i, results: P.results } }).eq('id', lesson.id).then(() => {}, () => {});
      }, 400);
    };

    let primary = null;
    function footIdle(label, enabled, onClick, extra) {
      foot.className = 'sh-foot';
      footIn.innerHTML = `${extra || ''}<span></span><button class="sh-btn ${label === 'Check' || label === 'Mark my answer' ? 'go' : 'pri'} lg" id="p-go" ${enabled ? '' : 'disabled'}>${esc(label)}</button>`;
      primary = $('#p-go', footIn); primary.onclick = onClick;
      const sk = $('#p-skip', footIn); if (sk) sk.onclick = () => skipCurrent();
    }
    function footResult(ok, title, msg, onNext) {
      foot.className = 'sh-foot ' + (ok ? 'ok' : 'bad');
      footIn.innerHTML = `<div class="fb"><span class="ic">${I(ok ? 'check' : 'bulb', { size: 34, stroke: 2.2 })}</span><div><h3>${esc(title)}</h3>${msg ? `<p>${msg}</p>` : ''}</div></div><button class="sh-btn ${ok ? 'go' : 'bad'} lg" id="p-go">Continue</button>`;
      primary = $('#p-go', footIn); primary.onclick = onNext; primary.focus({ preventScroll: true });
    }
    const enable = (on) => { if (primary && primary.textContent !== 'Continue') primary.disabled = !on; };
    function onKey(e) {
      if (e.target && /textarea|input|select/i.test(e.target.tagName)) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && primary && !primary.disabled) primary.click(); return; }
      if (e.key === 'Enter' && primary && !primary.disabled) { e.preventDefault(); primary.click(); return; }
      if (/^[1-6]$/.test(e.key)) { const b = $$('[data-k]', stage)[Number(e.key) - 1]; if (b && !b.disabled) b.click(); }
    }
    document.addEventListener('keydown', onKey);

    function record(i, r) {
      if (!(i in P.results)) P.results[i] = r; // the first attempt counts
      P.doneSet.add(i);
      setBar(); save();
    }
    function judge(item, r, correctHtml, explain, title) {
      const s = steps[item.i];
      if (r.ok) { P.combo++; P.best = Math.max(P.best, P.combo); Snd.ok(); } else { P.combo = 0; Snd.bad(); }
      setCombo();
      const first = !(item.i in P.results);
      record(item.i, { ok: !!r.ok, score: r.score, max: r.max });
      if (!r.ok && first && s.type !== 'exam' && !P.retried.has(item.i)) { P.retried.add(item.i); P.queue.push({ i: item.i, retry: true }); }
      if (!preview && CHECKABLE.includes(s.type) && s.type !== 'exam') track('study_step', { unit: lesson.unit || null, view: 'study-hub', ref: 'sh:' + lesson.id + ':' + item.i, title: (s.q || s.statement || s.text || s.prompt || '').slice(0, 300), score: r.ok ? 1 : 0, max_score: 1, meta: { topic: lesson.topic || null, type: s.type, source: 'study_hub' } });
      footResult(r.ok, title || (r.ok ? pick(PRAISE) : pick(NOPE)), [correctHtml, explain ? esc(explain) : ''].filter(Boolean).join('<br>'), next);
    }
    function skipCurrent() { const item = P.cur; if (item && steps[item.i].type === 'exam') examReveal(item, { score: 0, max: steps[item.i].marks }, true); }
    const kindHead = (type, extra) => { const k = KIND[type] || ['sparkles', '']; return `<div class="sh-kind">${I(k[0], { size: 18 })} ${extra || k[1]}</div>`; };

    function next() {
      const item = P.queue.shift();
      if (!item) return finish();
      P.cur = item;
      const s = steps[item.i];
      stage.scrollTop = 0;
      const head = item.retry ? `<div class="sh-kind retry">${I('retry', { size: 18 })} Let's try that again</div>` : '';
      const wrap = (html) => { stage.innerHTML = `<div class="sh-step">${head}${html}</div>`; };
      if (s.type === 'learn') {
        wrap(`${kindHead('learn')}<div class="sh-learn"><div class="emo">${I(lessonIcon, { size: 40 })}</div>${s.title ? `<h2>${esc(s.title)}</h2>` : ''}<p>${esc(s.body)}</p>${(s.points || []).length ? `<ul>${s.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}${s.example ? `<div class="sh-ex"><b>Example</b>${esc(s.example)}</div>` : ''}</div>`);
        footIdle('Continue', true, () => { record(item.i, { ok: true, score: 0, max: 0 }); next(); });
      } else if (s.type === 'recap') {
        wrap(`${kindHead('recap')}<h1 class="sh-q">${esc(s.title || 'Key takeaways')}</h1><div class="sh-recap">${s.points.map((p, i) => `<div style="animation-delay:${i * 90}ms">${I('check', { size: 26, stroke: 2.2 })}<span>${esc(p)}</span></div>`).join('')}</div>`);
        footIdle(P.queue.length ? 'Continue' : 'Finish lesson', true, () => { record(item.i, { ok: true, score: 0, max: 0 }); next(); });
      } else if (s.type === 'mcq') {
        let sel = -1;
        wrap(`${s.bank ? `<div class="sh-kind">${I('target', { size: 18 })} From the RA10 question bank</div>` : kindHead('mcq')}<h1 class="sh-q">${esc(s.q)}</h1><div class="sh-opts">${s.choices.map((c, i) => `<button class="sh-opt" data-k="${i}"><span class="k">${i + 1}</span><span>${esc(c)}</span></button>`).join('')}</div>`);
        const opts = $$('.sh-opt', stage);
        opts.forEach(b => b.onclick = () => { sel = Number(b.dataset.k); opts.forEach(x => x.classList.toggle('sel', x === b)); Snd.tap(); enable(true); });
        footIdle('Check', false, () => {
          const ok = sel === s.answer;
          opts.forEach((b, i) => { b.disabled = true; b.classList.remove('sel'); if (i === s.answer) b.classList.add('ok'); else if (i === sel) b.classList.add('bad'); });
          judge(item, { ok, score: ok ? 1 : 0, max: 1 }, ok ? '' : '<b>Answer:</b> ' + esc(s.choices[s.answer]), s.explain);
        });
      } else if (s.type === 'truefalse') {
        let sel = null;
        wrap(`${kindHead('truefalse')}<div class="sh-statement">${esc(s.statement)}</div><div class="sh-opts sh-tf"><button class="sh-opt" data-k="1" data-v="1">${I('check', { size: 22 })} True</button><button class="sh-opt" data-k="2" data-v="0">${I('close', { size: 22 })} False</button></div>`);
        const opts = $$('.sh-opt', stage);
        opts.forEach(b => b.onclick = () => { sel = b.dataset.v === '1'; opts.forEach(x => x.classList.toggle('sel', x === b)); Snd.tap(); enable(true); });
        footIdle('Check', false, () => {
          const ok = sel === s.answer;
          opts.forEach(b => { b.disabled = true; b.classList.remove('sel'); const v = b.dataset.v === '1'; if (v === s.answer) b.classList.add('ok'); else if (v === sel) b.classList.add('bad'); });
          judge(item, { ok, score: ok ? 1 : 0, max: 1 }, ok ? '' : '<b>It\'s ' + (s.answer ? 'true' : 'false') + '.</b>', s.explain);
        });
      } else if (s.type === 'fill') {
        const filled = s.blanks.map(() => null);
        const parts = s.text.split('___');
        wrap(`${kindHead('fill')}<h1 class="sh-q sm">Complete the sentence</h1><div class="sh-sentence" id="f-sen"></div><div class="sh-bank" id="f-bank">${shuffle(s.options.map((o, i) => i)).map(i => `<button class="sh-tile" data-o="${i}">${esc(s.options[i])}</button>`).join('')}</div>`);
        const paint = () => {
          $('#f-sen', stage).innerHTML = parts.map((p, i) => esc(p) + (i < s.blanks.length ? `<span class="sh-gap" data-g="${i}">${filled[i] != null ? `<button class="sh-tile" data-back="${i}">${esc(s.options[filled[i]])}</button>` : ''}</span>` : '')).join('');
          $$('[data-o]', stage).forEach(b => b.classList.toggle('used', filled.includes(Number(b.dataset.o))));
          $$('[data-back]', stage).forEach(b => b.onclick = () => { filled[Number(b.dataset.back)] = null; Snd.tap(); paint(); });
          enable(filled.every(x => x != null));
        };
        $$('[data-o]', stage).forEach(b => b.onclick = () => { const g = filled.indexOf(null); if (g < 0) return; filled[g] = Number(b.dataset.o); Snd.tap(); paint(); });
        footIdle('Check', false, () => {
          const each = s.blanks.map((w, i) => norm(s.options[filled[i]]) === norm(w));
          const ok = each.every(Boolean);
          $$('.sh-gap', stage).forEach((g, i) => g.classList.add(each[i] ? 'ok' : 'bad'));
          $$('.sh-tile', stage).forEach(b => { b.disabled = true; });
          judge(item, { ok, score: ok ? 1 : 0, max: 1 }, ok ? '' : '<b>Answer:</b> ' + esc(parts.map((p, i) => p + (i < s.blanks.length ? s.blanks[i] : '')).join('')), s.explain);
        });
        paint();
      } else if (s.type === 'order') {
        let pool = shuffle(s.items.map((_, i) => i));
        if (pool.every((v, i) => v === i)) pool = pool.reverse();
        const chosen = [];
        wrap(`${kindHead('order')}<h1 class="sh-q sm">${esc(s.prompt)}</h1><div class="sh-answer-line" id="o-line"></div><div class="sh-order-bank" id="o-bank"></div>`);
        const paint = () => {
          $('#o-line', stage).innerHTML = chosen.length ? chosen.map((ix, n) => `<button class="sh-tile" data-un="${n}"><span class="num">${n + 1}</span>${esc(s.items[ix])}</button>`).join('') : '<span class="sh-placeholder">Tap the items below in the right order</span>';
          $('#o-bank', stage).innerHTML = pool.map(ix => `<button class="sh-tile${chosen.includes(ix) ? ' used' : ''}" data-ix="${ix}">${esc(s.items[ix])}</button>`).join('');
          $$('[data-ix]', stage).forEach(b => b.onclick = () => { if (chosen.includes(Number(b.dataset.ix))) return; chosen.push(Number(b.dataset.ix)); Snd.tap(); paint(); });
          $$('[data-un]', stage).forEach(b => b.onclick = () => { chosen.splice(Number(b.dataset.un), 1); Snd.tap(); paint(); });
          enable(chosen.length === s.items.length);
        };
        footIdle('Check', false, () => {
          const ok = chosen.every((v, i) => v === i);
          $('#o-line', stage).classList.add(ok ? 'ok' : 'bad');
          $$('.sh-tile', stage).forEach(b => { b.disabled = true; });
          judge(item, { ok, score: ok ? 1 : 0, max: 1 }, ok ? '' : '<b>Right order:</b> ' + s.items.map((x, i) => (i + 1) + '. ' + esc(x)).join('  '), s.explain);
        });
        paint();
      } else if (s.type === 'match') {
        const L = shuffle(s.pairs.map((_, i) => i)), R = shuffle(s.pairs.map((_, i) => i));
        let selL = null, selR = null, mistakes = 0, matched = 0;
        wrap(`${kindHead('match')}<h1 class="sh-q sm">${esc(s.prompt)}</h1><div class="sh-match"><div class="sh-match-col">${L.map(i => `<button class="sh-tile" data-l="${i}">${esc(s.pairs[i][0])}</button>`).join('')}</div><div class="sh-match-col">${R.map(i => `<button class="sh-tile" data-r="${i}">${esc(s.pairs[i][1])}</button>`).join('')}</div></div>`);
        const tryPair = () => {
          if (selL == null || selR == null) return;
          const lb = $(`[data-l="${selL}"]`, stage), rb = $(`[data-r="${selR}"]`, stage);
          if (selL === selR) {
            [lb, rb].forEach(b => { b.classList.remove('sel'); b.classList.add('done'); b.disabled = true; });
            matched++; Snd.tone(600 + matched * 80, 0, .12, 'triangle', .12);
            if (matched === s.pairs.length) {
              const ok = mistakes === 0;
              judge(item, { ok, score: mistakes <= 1 ? 1 : 0, max: 1 }, ok ? '' : `You matched them all with ${mistakes} slip${mistakes === 1 ? '' : 's'}.`, ok ? 'Every pair right first time.' : '');
            }
          } else {
            mistakes++; Snd.bad();
            [lb, rb].forEach(b => { b.classList.remove('sel'); b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 450); });
          }
          selL = selR = null;
        };
        $$('[data-l]', stage).forEach(b => b.onclick = () => { selL = Number(b.dataset.l); $$('[data-l]', stage).forEach(x => x.classList.toggle('sel', x === b)); Snd.tap(); tryPair(); });
        $$('[data-r]', stage).forEach(b => b.onclick = () => { selR = Number(b.dataset.r); $$('[data-r]', stage).forEach(x => x.classList.toggle('sel', x === b)); Snd.tap(); tryPair(); });
        footIdle('Match all the pairs', false, () => {});
      } else if (s.type === 'exam') {
        wrap(`<div class="sh-kind">${I('exam', { size: 18 })} ${s.source === 'exam' ? 'Real exam question' : 'Exam-style question'}</div>
          <div class="sh-exam-meta"><span class="sh-badge acc">${s.marks} mark${s.marks === 1 ? '' : 's'}</span>${s.verb ? `<span class="sh-badge">${esc(s.verb)}</span>` : ''}<span class="sh-badge ok">${I('check', { size: 13 })} Marked by the RA10 AI Examiner</span></div>
          ${s.context ? `<div class="sh-context">${esc(s.context)}</div>` : ''}<h1 class="sh-q sm">${esc(s.q)}</h1>
          <textarea class="sh-write" id="e-ans" placeholder="Write your answer like you would in the exam…"></textarea><div class="sh-wc" id="e-wc">0 words · aim for about ${Math.min(400, s.marks * 20)} words</div><div id="e-res"></div>`);
        const ta = $('#e-ans', stage);
        ta.oninput = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; $('#e-wc', stage).textContent = n + ' word' + (n === 1 ? '' : 's') + ' · aim for about ' + Math.min(400, s.marks * 20) + ' words'; enable(n >= 3); };
        setTimeout(() => ta.focus({ preventScroll: true }), 300);
        footIdle('Mark my answer', false, async () => {
          primary.disabled = true; primary.innerHTML = '<span class="sh-spin light"></span> The examiner is marking…';
          ta.readOnly = true;
          let res = null;
          try { res = await examine(lesson, s, item.i, ta.value); }
          catch (e) {
            console.warn('AI Examiner failed, using Study Hub marking', e);
            try { const r = await api('mark', { lessonId: lesson.id, step: item.i, answer: ta.value }); if (r.ok) res = { score: r.score, max: r.max, feedback: r.feedback, tip: r.tip, got: r.got || [] }; } catch (e2) {}
          }
          if (res) examReveal(item, res); else selfMark(item);
        }, '<button class="sh-btn ghost skip" id="p-skip">Show me the answer</button>');
      }
    }

    function examReveal(item, r, skipped) {
      const s = steps[item.i];
      const box = $('#e-res', stage);
      const ta = $('#e-ans', stage); if (ta) ta.readOnly = true;
      const max = Math.max(1, r.max || s.marks), score = Math.max(0, Math.min(max, r.score || 0));
      const got = r.got || [];
      const list = (arr, ic, cls) => arr && arr.length ? `<ul class="sh-fbl ${cls}">${arr.slice(0, 4).map(x => `<li>${I(ic, { size: 18 })}<span>${esc(x)}</span></li>`).join('')}</ul>` : '';
      box.innerHTML = `${skipped ? '' : `<div class="sh-markres"><span class="big">${score}/${max}</span><p>${esc(r.feedback || '')}${r.tip ? `<br><b>Tip:</b> ${esc(r.tip)}` : ''}${r.examiner ? `<small class="sh-muted" style="display:block;margin-top:4px">Marked by the RA10 AI Examiner${r.level ? ' · Level ' + esc(r.level) : ''}</small>` : ''}</p></div>
          ${list(r.strengths, 'check', 'good')}${list(r.improvements, 'arrow', 'next')}`}
        <div class="sh-ins-h">Mark scheme</div><div class="sh-ms">${(s.points || []).map((p, i) => `<div class="${got.includes(i) ? 'got' : ''}"><span class="tk">${got.includes(i) ? I('check', { size: 16 }) : '•'}</span><span>${esc(p)}</span></div>`).join('')}</div>
        ${s.model ? `<details class="sh-model" ${skipped ? 'open' : ''}><summary>Model answer</summary><p>${esc(s.model)}</p></details>` : ''}`;
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (skipped) { P.combo = 0; setCombo(); record(item.i, { ok: false, score: 0, max }); footResult(false, 'Here\'s how to answer it', 'Read the mark scheme and model answer, then try a similar question next time.', next); return; }
      const ok = score >= Math.ceil(max / 2), full = score === max;
      // XP and the lesson score count the question at its lesson weighting
      const scaled = Math.round((score / max) * s.marks);
      judge(item, { ok, score: scaled, max: s.marks }, '', full ? 'Every mark-scheme point covered.' : ok ? 'Check what the examiner says to pick up full marks.' : 'Look at the improvements and the model answer.',
        full ? 'Full marks!' : ok ? `Good answer — ${score}/${max}` : score ? `Getting there — ${score}/${max}` : 'Not quite yet');
      track('study_exam', { unit: lesson.unit || null, view: 'study-hub', ref: 'sh:' + lesson.id + ':' + item.i, title: s.q.slice(0, 300), answer: ta ? ta.value : '', score, max_score: max, meta: { topic: lesson.topic || null, source: 'study_hub', examiner: !!r.examiner } });
    }
    function selfMark(item) {
      const s = steps[item.i];
      const box = $('#e-res', stage);
      box.innerHTML = `<div class="sh-ins-h">The examiner is busy — mark it yourself: tick each point you made</div><div class="sh-ms">${s.points.map((p, i) => `<label><input type="checkbox" data-pt="${i}"><span>${esc(p)}</span></label>`).join('')}</div>${s.model ? `<details class="sh-model"><summary>Model answer</summary><p>${esc(s.model)}</p></details>` : ''}`;
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      footIdle('Save my mark', true, () => {
        const got = $$('[data-pt]:checked', box).map(x => Number(x.dataset.pt));
        examReveal(item, { score: Math.min(s.marks, got.length), max: s.marks, got, feedback: 'Self-marked against the mark scheme.' });
      });
    }

    async function finish() {
      P.finished = true;
      let score = 0, max = 0;
      steps.forEach((s, i) => { if (!CHECKABLE.includes(s.type)) return; const m = s.type === 'exam' ? s.marks : 1; max += m; score += Math.min(m, Number((P.results[i] || {}).score) || 0); });
      const secs = Math.round((Date.now() - P.t0) / 1000);
      const pct = max ? Math.round((score / max) * 100) : 100;
      foot.className = 'sh-foot'; footIn.innerHTML = '';
      $('#p-bar', el).style.width = '100%';
      stage.innerHTML = `<div class="sh-finish"><div class="sh-award${pct >= 90 ? ' gold' : ''}"><span class="rays"></span>${I(pct >= 90 ? 'trophy' : pct >= 60 ? 'star' : 'flag', { size: 96, stroke: 1.6 })}</div><h1>${pct >= 90 ? 'Lesson mastered!' : 'Lesson complete!'}</h1><p class="sh-muted">${esc(lesson.title)}</p>
        <div class="sh-stats"><div class="sh-stat" style="--c:var(--gold)"><b>${I('bolt', { size: 14 })} Total XP</b><span id="f-xp">…</span></div><div class="sh-stat" style="--c:var(--ok);animation-delay:.1s"><b>${I('target', { size: 14 })} ${pct >= 90 ? 'Amazing' : 'Accuracy'}</b><span>${pct}%</span></div><div class="sh-stat" style="--c:var(--acc);animation-delay:.2s"><b>${I('clock', { size: 14 })} Time</b><span>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</span></div></div>
        ${P.best >= 3 ? `<p class="sh-bestcombo">${I('flame', { size: 22 })} Best combo: ${P.best} in a row</p>` : ''}
        <div class="acts"><button class="sh-btn pri lg wide" id="f-home">Continue</button>${S.status && S.status.can_create ? '<button class="sh-btn lg wide" id="f-more">Make another lesson</button>' : ''}</div></div>`;
      Snd.done(); confetti();
      $('#f-home', stage).onclick = close;
      const more = $('#f-more', stage); if (more) more.onclick = () => { close(); setTimeout(() => openMaker(), 700); };
      let xp = 0;
      if (!preview) { try { const r = await api('complete', { lessonId: lesson.id, results: P.results, bestCombo: P.best }); xp = r.ok ? (r.xp || 0) : 0; } catch (e) {} }
      const xe = $('#f-xp', stage);
      if (xe) { if (replay || !xp) xe.textContent = preview ? 'Preview' : replay ? 'Replay' : '0'; else { let n = 0; const st = setInterval(() => { n = Math.min(xp, n + Math.ceil(xp / 20)); xe.textContent = '+' + n; if (n >= xp) clearInterval(st); }, 40); } }
    }

    setBar();
    next();
  }

  function confetti() {
    const c = document.createElement('canvas'); c.className = 'sh-confetti'; document.body.appendChild(c);
    const x = c.getContext('2d'); const W = c.width = innerWidth, H = c.height = innerHeight;
    const cols = ['#5b4cf5', '#f5a524', '#1fa851', '#e5484d', '#22b8cf', '#ff7a1a'];
    const ps = Array.from({ length: 140 }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4, c: pick(cols), a: Math.random() * 6, va: (Math.random() - .5) * .3 }));
    let t = 0;
    (function f() {
      x.clearRect(0, 0, W, H);
      ps.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); });
      if (++t < 170) requestAnimationFrame(f); else c.remove();
    })();
  }

  boot();
})();
