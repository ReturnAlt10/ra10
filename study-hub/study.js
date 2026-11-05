/* RA10 Study Hub — AI daily lessons (Premium; one free trial lesson).
   Home: today's lesson (auto-built from your activity), insights, make-your-own, your lesson path.
   Player: Duolingo-style steps — learn cards, multiple choice, true/false, fill the gap, match,
   put in order, a real-style exam question (AI-marked) and a recap; wrong answers come back once. */
(function () {
  'use strict';
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const main = $('#sh-main');
  const UNITS = () => (window.RA10Units ? RA10Units.all() : []);
  const unitOf = (p) => (window.RA10Units ? RA10Units.byPath(p) : null);
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const S = { sb: null, me: null, profile: null, status: null, plan: null, cat: {}, building: false, buildErr: null, maker: { unit: null, topic: null } };

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
  function stars(score, max) {
    const pct = max ? score / max : 0, n = pct >= .9 ? 3 : pct >= .65 ? 2 : pct > 0 ? 1 : 0;
    return `<span class="sh-stars" aria-label="${n} of 3 stars">${[0, 1, 2].map(i => `<i class="${i < n ? 'on' : ''}">⭐</i>`).join('')}</span>`;
  }
  function track(kind, f) { try { if (window.RA10Track) RA10Track.log(kind, f); } catch (e) {} }

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

  /* ───────────── unit catalogue (read from the unit app in a hidden frame) ───────────── */
  function loadCatalog(unitPath) {
    if (S.cat[unitPath]) return Promise.resolve(S.cat[unitPath]);
    try { const c = JSON.parse(sessionStorage.getItem('ra10_cat_' + unitPath) || 'null'); if (c) { S.cat[unitPath] = c; return Promise.resolve(c); } } catch (e) {}
    const u = unitOf(unitPath);
    if (!u) return Promise.reject(new Error('Unknown unit'));
    if (S['_catp_' + unitPath]) return S['_catp_' + unitPath];
    const p = new Promise((resolve, reject) => {
      const f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
      f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:900px;visibility:hidden;border:0';
      f.src = u.app + '?ra10catalog=1';
      const done = (c, err) => { window.removeEventListener('message', onMsg); clearTimeout(t); f.remove(); delete S['_catp_' + unitPath]; if (err) reject(err); else resolve(c); };
      const onMsg = (e) => {
        if (e.origin !== location.origin || !e.data || e.data.type !== 'ra10:catalog' || e.source !== f.contentWindow) return;
        const c = e.data.catalog; S.cat[unitPath] = c;
        try { sessionStorage.setItem('ra10_cat_' + unitPath, JSON.stringify(c)); } catch (err) {}
        done(c);
      };
      const t = setTimeout(() => done(null, new Error('The unit took too long to load.')), 40000);
      window.addEventListener('message', onMsg);
      document.body.appendChild(f);
    });
    S['_catp_' + unitPath] = p;
    return p;
  }
  function specTopics(cat) {
    const out = [];
    Object.keys((cat && cat.spec) || {}).sort().forEach(a => ((cat.spec[a] || {}).topics || []).forEach(t => {
      const label = ((t.code ? t.code + ' ' : '') + (t.name || '')).trim();
      if (label) out.push({ aim: a, aimTitle: cat.spec[a].title || ('Aim ' + a), code: t.code || '', name: t.name || label, label });
    }));
    if (!out.length && cat) {
      // no specification list — fall back to the topics used in the question bank
      const seen = new Set();
      (cat.quiz || []).concat(cat.questions || []).forEach(q => { const k = norm(q.topic); if (q.topic && !seen.has(k) && seen.size < 60) { seen.add(k); out.push({ aim: q.aim || '', aimTitle: q.aim ? 'Aim ' + q.aim : 'Topics', code: '', name: q.topic, label: q.topic }); } });
    }
    return out;
  }
  // real questions from the unit that match the topic → sent to the lesson writer
  function grounding(cat, topic) {
    if (!cat) return {};
    const topics = specTopics(cat);
    const t = norm(topic), words = t.split(' ').filter(w => w.length > 3);
    const code = (String(topic || '').match(/^\s*([A-Z]\d+(?:\.\d+)*)/i) || [])[1];
    const match = (s) => {
      const n = norm(s); if (!n || !t) return false;
      if (n.indexOf(t) >= 0 || t.indexOf(n) >= 0) return true;
      if (code && n.indexOf(norm(code)) === 0) return true;
      return words.filter(w => n.indexOf(w) >= 0).length >= Math.min(2, words.length);
    };
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
    const questions = fill((cat.questions || []).filter(q => !q.marks || (q.marks >= 2 && q.marks <= 9)), q => match(q.topic) || match(q.q), 3).map(q => ({ q: q.q, marks: q.marks, verb: q.verb, topic: q.topic }));
    return { quiz, questions, topics: topics.map(x => x.label).slice(0, 60) };
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
    const want = new URLSearchParams(location.search).get('lesson');
    if (want) openLesson(want);
  }
  async function refresh() {
    const [st, pl] = await Promise.allSettled([S.sb.rpc('study_hub_status'), api('plan')]);
    if (st.status === 'rejected' || (st.value && st.value.error)) {
      const msg = st.status === 'rejected' ? st.reason : st.value.error;
      return fail('Study Hub isn’t set up yet. The database update (supabase/sql/study-hub.sql) needs to be run. (' + esc((msg && msg.message) || msg) + ')');
    }
    S.status = st.value.data || {};
    S.plan = pl.status === 'fulfilled' ? pl.value : null;
    home();
  }
  function fail(msg) { main.innerHTML = `<div class="sh-card sh-empty"><b>Something went wrong</b>${msg}</div>`; }
  function signedOut() {
    try { sessionStorage.setItem('ra10_after_auth', location.pathname + location.search); } catch (e) {}
    main.innerHTML = `<div class="sh-lock"><div class="crown">✨</div><h1>Your daily lesson is waiting</h1>
      <p>Study Hub looks at what you've been revising on RA10 and builds you a short, game-like lesson every day — focused on exactly what you need.</p>
      <a class="sh-btn pri lg" href="/auth">Sign in to start</a></div>`;
  }

  /* ───────────── home ───────────── */
  function home() {
    document.body.style.overflow = '';
    const st = S.status || {};
    const premium = !!st.premium;
    if (!premium && st.trial_used && !(st.lessons || []).length) return lockedScreen();
    const days = (st.week || []).map((d, i, a) => { const dt = new Date(d.day + 'T12:00:00'); return `<span class="sh-day${d.done ? ' done' : ''}${i === a.length - 1 ? ' today' : ''}"><i>${d.done ? '🔥' : ''}</i>${'SMTWTFS'[dt.getDay()]}</span>`; }).join('');
    const banner = premium ? '' : !st.trial_used
      ? `<div class="sh-banner">🎁 <span><b>Try Study Hub free.</b> You can make one free lesson to see how it works. Study Hub is part of RA10 Premium.</span></div>`
      : `<div class="sh-banner">🔒 <span>You've used your free lesson. Daily lessons and unlimited lessons are part of <b>RA10 Premium</b>, coming soon.</span><button class="sh-btn sm gold" id="sh-why">What's included</button></div>`;
    main.innerHTML = `${banner}
      <div class="sh-hello"><div><h1>${esc(greet())}${firstName() ? ', ' + esc(firstName()) : ''} 👋</h1><p class="sh-muted">${st.streak ? `You're on a <b>${st.streak}-day streak</b>. Keep it going!` : 'Finish a lesson today to start a streak.'}</p></div><div class="sh-hello-side"><div class="sh-hello-stats"><span class="sh-pill fire" title="Day streak">🔥 <b>${st.streak || 0}</b> day${st.streak === 1 ? '' : 's'}</span><span class="sh-pill xp" title="XP earned in Study Hub">⚡ <b>${st.total_xp || 0}</b> XP</span></div><div class="sh-week" aria-label="This week">${days}</div></div></div>
      <div class="sh-grid"><div class="sh-col"><section id="sh-today"></section><section class="sh-card" id="sh-maker"></section></div>
      <div class="sh-col"><section class="sh-card" id="sh-insights"></section><section class="sh-card" id="sh-pathcard"></section></div></div>`;
    const why = $('#sh-why'); if (why) why.onclick = lockedScreen;
    paintToday(); paintInsights(); paintMaker(); paintPath();
    if (premium && !st.daily && !S.building && !S.buildErr && (S.plan && S.plan.focus || store.get('sh_unit'))) buildDaily();
  }

  function paintToday() {
    const box = $('#sh-today'); if (!box) return;
    const st = S.status || {}, d = st.daily, premium = !!st.premium;
    const focus = (S.plan && S.plan.focus) || null;
    if (S.building) {
      box.innerHTML = `<div class="sh-today"><span class="eyebrow">☀️ Today's lesson</span><div class="row"><div class="emo">🧠</div><div style="flex:1;min-width:0"><h2>Building your lesson…</h2><div class="sh-build-line"><span class="sh-spin"></span><span id="sh-build-msg">Looking at what you've been revising</span></div></div></div>
        <div class="why" style="display:grid;gap:8px"><div class="shimmer" style="width:90%"></div><div class="shimmer" style="width:70%"></div></div></div>`;
      return;
    }
    if (d) {
      const u = unitOf(d.unit);
      const doneNow = d.status === 'done';
      box.innerHTML = `<div class="sh-today${doneNow ? ' done' : ''}"><span class="eyebrow">${doneNow ? '✅ Done for today' : '☀️ Today\'s lesson'}</span>
        <div class="row"><div class="emo">${esc(d.emoji || '✨')}</div><div style="min-width:0"><h2>${esc(d.title)}</h2><div class="meta">${esc([u && u.short, d.minutes ? '≈ ' + d.minutes + ' min' : '', doneNow && d.max_score ? d.score + '/' + d.max_score + ' correct' : ''].filter(Boolean).join(' · '))}</div></div></div>
        ${d.reason && !doneNow ? `<div class="why"><b>Why this lesson</b>${esc(d.reason)}</div>` : ''}
        ${doneNow ? `<div class="why"><b>Great work</b>Come back tomorrow for a new lesson${st.streak ? ' and keep your ' + st.streak + '-day streak' : ''}. Want more? Make another lesson below.</div>` : ''}
        <div class="acts">${doneNow ? `<button class="sh-btn light" data-open="${esc(d.id)}">Replay</button><button class="sh-btn clear" id="sh-more">Make another lesson</button>` : `<button class="sh-btn light lg" data-open="${esc(d.id)}">${d.status === 'in_progress' ? 'Continue lesson' : 'Start lesson'} →</button>`}</div></div>`;
      $$('[data-open]', box).forEach(b => b.onclick = () => openLesson(b.dataset.open));
      const more = $('#sh-more', box); if (more) more.onclick = () => $('#sh-maker').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (S.buildErr) {
      box.innerHTML = `<div class="sh-today"><span class="eyebrow">☀️ Today's lesson</span><div class="row"><div class="emo">😵‍💫</div><div><h2>We couldn't build today's lesson</h2><div class="meta">${esc(S.buildErr)}</div></div></div><div class="acts"><button class="sh-btn light" id="sh-retry">Try again</button></div></div>`;
      $('#sh-retry').onclick = () => { S.buildErr = null; buildDaily(); };
      return;
    }
    if (!premium && st.trial_used) {
      box.innerHTML = `<div class="sh-today"><span class="eyebrow">🔒 Premium</span><div class="row"><div class="emo">👑</div><div><h2>A new lesson every day</h2><div class="meta">Daily lessons built from your revision are part of RA10 Premium — coming soon.</div></div></div><div class="acts"><button class="sh-btn light" id="sh-why2">What's included</button></div></div>`;
      $('#sh-why2').onclick = lockedScreen;
      return;
    }
    const pref = store.get('sh_unit');
    if (!focus && !pref) {
      const opts = UNITS().map(u => `<option value="${esc(u.path)}">${esc(u.short + ' — ' + u.name.replace(/^Unit \d+:\s*/, ''))}</option>`).join('');
      box.innerHTML = `<div class="sh-today"><span class="eyebrow">☀️ Today's lesson</span><div class="row"><div class="emo">🧭</div><div style="min-width:0"><h2>What are you studying?</h2><div class="meta">Pick a subject and we'll build your first lesson. As you revise on RA10, lessons get tailored to you.</div></div></div>
        <div class="acts" style="align-items:center"><select class="sh-in" id="sh-first-unit" style="flex:1;min-width:200px;max-width:420px;color:#15131f">${opts}</select><button class="sh-btn light" id="sh-first-go">${premium ? 'Build my lesson' : 'Build my free lesson'}</button></div></div>`;
      $('#sh-first-go').onclick = () => { store.set('sh_unit', $('#sh-first-unit').value); buildDaily(); };
      return;
    }
    // free user with their trial still available: let them choose to spend it on today's lesson
    const fu = unitOf((focus && focus.unit) || pref);
    box.innerHTML = `<div class="sh-today"><span class="eyebrow">🎁 Your free lesson</span><div class="row"><div class="emo">✨</div><div style="min-width:0"><h2>${esc(focus && focus.topic ? focus.topic : (fu ? fu.short : 'Your lesson'))}</h2><div class="meta">${esc(fu ? fu.name : '')}</div></div></div>
      ${focus && focus.reason ? `<div class="why"><b>Why this lesson</b>${esc(focus.reason)}</div>` : ''}
      <div class="acts"><button class="sh-btn light lg" id="sh-trial-go">Build my free lesson →</button></div></div>`;
    $('#sh-trial-go').onclick = () => buildDaily(true);
  }

  async function buildDaily(openWhenReady) {
    if (S.building) return;
    const focus = (S.plan && S.plan.focus) || (store.get('sh_unit') ? { unit: store.get('sh_unit'), topic: null, reason: '' } : null);
    if (!focus) return paintToday();
    const u = unitOf(focus.unit);
    S.building = true; S.buildErr = null; paintToday();
    const msgs = ['Looking at what you\'ve been revising', 'Finding the topics that need work', 'Pulling real questions from ' + (u ? u.short : 'your unit'), 'Writing your lesson', 'Adding the finishing touches'];
    let mi = 0; const tick = setInterval(() => { mi = Math.min(msgs.length - 1, mi + 1); const m = $('#sh-build-msg'); if (m) m.textContent = msgs[mi]; }, 3800);
    try {
      const cat = u ? await loadCatalog(focus.unit).catch(() => null) : null;
      const topic = focus.topic || (cat ? pickTopic(cat) : null);
      const reason = focus.reason || (topic ? `A fresh topic from ${u ? u.short : 'your unit'} to keep your revision moving.` : '');
      const r = await api('create', { mode: 'daily', unit: focus.unit, unitName: u ? u.name : focus.unit, qual: u ? u.qual : '', topic, reason, grounding: grounding(cat, topic || '') });
      if (!r.ok) { if (r.locked) { S.status.trial_used = true; S.status.can_create = false; } throw new Error(r.error || 'Could not build the lesson.'); }
      S.status.daily = r.lesson;
      if (!S.status.premium) { S.status.trial_used = true; S.status.can_create = false; }
      if (!r.existing) { S.status.lessons = [r.lesson].concat(S.status.lessons || []); toast('Today\'s lesson is ready ✨'); }
      S.building = false;
      if (openWhenReady) return play(r.lesson);
      home();
    } catch (e) {
      S.building = false; S.buildErr = e.message || String(e); paintToday();
    } finally { clearInterval(tick); }
  }

  function paintInsights() {
    const box = $('#sh-insights'); if (!box) return;
    const p = S.plan;
    if (!p) { box.innerHTML = '<h2>📊 What we\'ve noticed</h2><p class="sh-muted">Your revision insights will appear here.</p>'; return; }
    const can = !!(S.status && S.status.can_create);
    const weak = (p.weak || []).slice(0, 5), strong = (p.strong || []).slice(0, 5), reading = (p.reading || []).slice(0, 3);
    const units = (p.units || []).slice(0, 3).map(x => unitOf(x.path)).filter(Boolean);
    box.innerHTML = `<h2>📊 What we've noticed</h2><p class="sh-muted">From your last 30 days on RA10${p.totals ? ` · ${p.totals.answered} questions answered` : ''}.</p>
      ${!weak.length && !strong.length && !reading.length ? `<div class="sh-empty" style="padding:10px 0"><b>Still getting to know you</b>Answer questions and quizzes in any unit — Study Hub will spot your strengths and gaps and build lessons around them.</div>` : ''}
      ${weak.length ? `<div class="sh-ins-h">Needs work — tap for a lesson</div><div class="sh-chips">${weak.map(t => `<button class="sh-chip weak" data-unit="${esc(t.unit)}" data-topic="${esc(t.topic)}" ${can ? '' : 'disabled'}>${esc(t.topic)} <small>${t.pct}%</small></button>`).join('')}</div>` : ''}
      ${strong.length ? `<div class="sh-ins-h">You're strong at</div><div class="sh-chips">${strong.map(t => `<span class="sh-chip strong">${esc(t.topic)} <small>${t.pct}%</small></span>`).join('')}</div>` : ''}
      ${reading.length ? `<div class="sh-ins-h">Recently read</div><div class="sh-chips">${reading.map(t => `<button class="sh-chip" data-unit="${esc(t.unit)}" data-topic="${esc(t.topic)}" ${can ? '' : 'disabled'}>📖 ${esc(t.topic)}</button>`).join('')}</div>` : ''}
      ${units.length ? `<div class="sh-ins-h">Your units</div><div class="sh-chips">${units.map(u => `<span class="sh-chip strong" style="border-color:${esc(u.color)}">${esc(u.short)}</span>`).join('')}</div>` : ''}`;
    $$('button[data-topic]', box).forEach(b => b.onclick = () => createLesson({ unit: b.dataset.unit, topic: b.dataset.topic, reason: b.classList.contains('weak') ? `You asked for help with ${b.dataset.topic}, one of the topics you've been finding tricky.` : `You read about ${b.dataset.topic} recently.` }));
  }

  function paintMaker() {
    const box = $('#sh-maker'); if (!box) return;
    const st = S.status || {};
    const M = S.maker;
    if (!M.unit) M.unit = store.get('sh_unit') || (S.plan && S.plan.focus && S.plan.focus.unit) || (UNITS()[0] || {}).path;
    const can = !!st.can_create;
    box.innerHTML = `<h2>🪄 Make a lesson ${st.premium ? '<span class="sh-badge acc">Unlimited</span>' : st.trial_used ? '<span class="sh-badge gold">Premium</span>' : '<span class="sh-badge gold">1 free</span>'}</h2>
      <p class="sh-muted">Pick any topic — or just ask for what you want to learn.</p>
      <div class="sh-field"><label for="sh-m-unit">Unit</label><select id="sh-m-unit">${UNITS().map(u => `<option value="${esc(u.path)}"${u.path === M.unit ? ' selected' : ''}>${esc(u.short + ' — ' + u.name.replace(/^Unit \d+:\s*/, ''))}</option>`).join('')}</select></div>
      <div class="sh-field"><label>Topic</label><div class="sh-topics" id="sh-m-topics"><span class="sh-muted sh-small" style="display:flex;gap:8px;align-items:center"><span class="sh-spin"></span> Loading topics…</span></div></div>
      <div class="sh-field"><label for="sh-m-req">Anything specific? <span class="sh-muted" style="font-weight:500">(optional)</span></label><textarea id="sh-m-req" rows="2" maxlength="300" placeholder="e.g. Explain the CIA triad with real examples, I keep mixing it up">${esc(M.request || '')}</textarea></div>
      <button class="sh-btn pri wide lg" id="sh-m-go" ${can ? '' : 'disabled'}>${can ? (st.premium ? 'Create lesson ✨' : 'Use my free lesson ✨') : '🔒 Premium feature'}</button>
      ${!can ? '<p class="sh-muted sh-small" style="margin:10px 0 0;text-align:center">Unlimited lessons on any topic are part of RA10 Premium — coming soon.</p>' : ''}`;
    $('#sh-m-unit').onchange = (e) => { M.unit = e.target.value; M.topic = null; store.set('sh_unit', M.unit); paintTopics(); };
    $('#sh-m-req').oninput = (e) => { M.request = e.target.value; };
    $('#sh-m-go').onclick = () => {
      if (!M.topic && !(M.request || '').trim()) return toast('Pick a topic or tell us what you want to learn.');
      createLesson({ unit: M.unit, topic: M.topic, request: (M.request || '').trim(), reason: M.topic ? `You chose ${M.topic}.` : 'You asked for this lesson.' });
    };
    paintTopics();
  }
  async function paintTopics() {
    const M = S.maker, box = $('#sh-m-topics'); if (!box) return;
    const unit = M.unit;
    let cat = null;
    try { cat = await loadCatalog(unit); } catch (e) {}
    if (M.unit !== unit || !$('#sh-m-topics')) return;
    const list = specTopics(cat);
    if (!list.length) { box.innerHTML = '<span class="sh-muted sh-small">No topic list for this unit — describe what you want below.</span>'; return; }
    let lastAim = null;
    box.innerHTML = list.map(t => { const head = t.aim !== lastAim ? `<div class="sh-aim">${esc(t.aimTitle)}</div>` : ''; lastAim = t.aim; return head + `<button type="button" class="sh-topic${M.topic === t.label ? ' on' : ''}" data-t="${esc(t.label)}">${t.code ? `<small>${esc(t.code)}</small>` : ''}${esc(t.name)}</button>`; }).join('');
    $$('[data-t]', box).forEach(b => b.onclick = () => { M.topic = M.topic === b.dataset.t ? null : b.dataset.t; $$('[data-t]', box).forEach(x => x.classList.toggle('on', x.dataset.t === M.topic)); Snd.tap(); });
  }

  function paintPath() {
    const box = $('#sh-pathcard'); if (!box) return;
    const lessons = (S.status && S.status.lessons) || [];
    box.innerHTML = `<h2>🗺️ Your lessons</h2><p class="sh-muted">${lessons.length ? `${(S.status.total_done || 0)} completed · tap any lesson to play it again.` : 'Your finished lessons will build a path here.'}</p>
      ${lessons.length ? `<div class="sh-path">${lessons.slice(0, 30).map(l => { const u = unitOf(l.unit); return `<button class="sh-node ${l.status === 'done' ? 'done' : l.status === 'in_progress' ? 'prog' : ''}" data-open="${esc(l.id)}"><span class="orb">${esc(l.emoji || '✨')}</span><span style="min-width:0"><b>${esc(l.title)}</b><small>${esc([l.kind === 'daily' ? 'Daily' : 'Your pick', u && u.short, new Date(l.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })].filter(Boolean).join(' · '))}</small></span>${l.status === 'done' ? stars(l.score, l.max_score) : l.status === 'in_progress' ? '<span class="sh-badge acc">Continue</span>' : '<span class="sh-badge">New</span>'}</button>`; }).join('')}</div>` : '<div class="sh-empty">🌱</div>'}`;
    $$('[data-open]', box).forEach(b => b.onclick = () => openLesson(b.dataset.open));
  }

  function lockedScreen() {
    const st = S.status || {};
    const trialLesson = (st.lessons || []).find(l => l.trial) || (st.lessons || [])[0];
    main.innerHTML = `<div class="sh-lock"><div class="crown">👑</div><span class="sh-badge gold">RA10 Premium · coming soon</span>
      <h1>Study Hub is a Premium feature</h1>
      <p>${st.trial_used ? 'You\'ve had your free lesson. ' : ''}With Premium, Study Hub builds you a fresh lesson every day from what you've been revising, and you can make as many lessons as you like on any topic.</p>
      <div class="sh-feats">
        <div class="sh-feat"><span>☀️</span><b>A lesson every day</b><p>Ready each morning, built around your weak spots and what you've just read.</p></div>
        <div class="sh-feat"><span>🎮</span><b>Bite-size and game-like</b><p>Learn cards, quick quizzes, matching, ordering and fill-the-gap — about 7 minutes.</p></div>
        <div class="sh-feat"><span>📝</span><b>Real exam practice</b><p>Every lesson ends with an exam-style question, marked by AI against the mark scheme.</p></div>
        <div class="sh-feat"><span>🪄</span><b>Unlimited lessons</b><p>Pick any topic in any unit, or just ask for what you want to learn.</p></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="sh-btn gold lg" disabled>Premium is coming soon</button>
        ${trialLesson ? `<button class="sh-btn lg" data-open="${esc(trialLesson.id)}">Replay your free lesson</button>` : ''}
        ${(st.lessons || []).length ? '<button class="sh-btn ghost lg" id="sh-back-home">Back</button>' : ''}
      </div></div>`;
    $$('[data-open]', main).forEach(b => b.onclick = () => openLesson(b.dataset.open));
    const back = $('#sh-back-home'); if (back) back.onclick = home;
  }

  /* ───────────── creating a lesson (full-screen builder) ───────────── */
  async function createLesson(o) {
    const st = S.status || {};
    if (!st.can_create) return lockedScreen();
    if (!st.premium && !confirm('This will use your one free Study Hub lesson. Continue?')) return;
    const u = unitOf(o.unit);
    const ov = document.createElement('div');
    ov.className = 'sh-gen';
    const steps = ['Reading your progress', 'Pulling real questions from ' + (u ? u.short : 'the unit'), 'Writing your lesson', 'Building the quizzes'];
    ov.innerHTML = `<div class="sh-gen-in"><div class="sh-orbit"><div class="ring"><span class="dot"></span></div><div class="core">🧠</div></div>
      <h2>Building your lesson</h2><p class="sh-muted">${esc(o.topic || o.request || (u ? u.name : ''))}</p>
      <ul class="sh-gen-steps">${steps.map((s, i) => `<li class="${i === 0 ? 'on' : ''}"><i></i>${esc(s)}</li>`).join('')}</ul></div>`;
    document.body.appendChild(ov);
    const lis = $$('li', ov);
    const setStep = (n) => lis.forEach((li, i) => { li.className = i < n ? 'ok' : i === n ? 'on' : ''; if (i < n) li.querySelector('i').textContent = '✓'; });
    let stage = 0; const tick = setInterval(() => { if (stage < 2) return; stage = Math.min(3, stage + 1); setStep(stage); }, 6000);
    try {
      await new Promise(r => setTimeout(r, 500)); setStep(stage = 1);
      const cat = u ? await loadCatalog(o.unit).catch(() => null) : null;
      setStep(stage = 2);
      const r = await api('create', { mode: 'custom', unit: o.unit, unitName: u ? u.name : o.unit, qual: u ? u.qual : '', topic: o.topic || null, request: o.request || '', reason: o.reason || '', grounding: grounding(cat, o.topic || o.request || '') });
      if (!r.ok) { if (r.locked) { st.trial_used = true; st.can_create = false; ov.remove(); return lockedScreen(); } throw new Error(r.error || 'Could not build the lesson.'); }
      setStep(4);
      if (!st.premium) { st.trial_used = true; st.can_create = false; }
      st.lessons = [r.lesson].concat(st.lessons || []);
      await new Promise(res => setTimeout(res, 450));
      ov.remove();
      play(r.lesson);
    } catch (e) {
      ov.innerHTML = `<div class="sh-gen-in"><div style="font-size:3rem">😵‍💫</div><h2>That didn't work</h2><p class="sh-muted">${esc(e.message || e)}</p><button class="sh-btn pri" id="sh-gen-x">Back</button></div>`;
      $('#sh-gen-x', ov).onclick = () => { ov.remove(); home(); };
    } finally { clearInterval(tick); }
  }

  async function openLesson(id) {
    const { data, error } = await S.sb.from('study_lessons').select('*').eq('id', id).maybeSingle();
    if (error || !data) return toast('That lesson could not be found.');
    play(data);
  }

  /* ═════════════════════════ lesson player ═════════════════════════ */
  const PRAISE = ['Nice one!', 'Spot on!', 'Brilliant!', 'Exactly right!', 'You\'ve got it!', 'Perfect!', 'Great work!'];
  const NOPE = ['Not quite', 'Almost!', 'Good try', 'So close'];
  const CHECKABLE = ['mcq', 'truefalse', 'fill', 'match', 'order', 'exam'];

  function play(lesson) {
    const steps = (lesson.content && lesson.content.steps) || [];
    if (!steps.length) return toast('This lesson has no steps.');
    const replay = lesson.status === 'done';
    const prog = (!replay && lesson.progress) || {};
    const results = replay ? {} : Object.assign({}, prog.results || {});
    const doneSet = new Set(replay ? [] : Object.keys(results).map(Number));
    const start = replay ? 0 : Math.max(0, Math.min(steps.length - 1, Number(prog.i) || 0));
    for (let i = 0; i < start; i++) doneSet.add(i);
    const P = { L: lesson, steps, replay, results, doneSet, queue: [], combo: 0, best: 0, t0: Date.now(), cur: null, retried: new Set() };
    for (let i = start; i < steps.length; i++) P.queue.push({ i, retry: false });

    document.body.style.overflow = 'hidden';
    const el = document.createElement('div');
    el.className = 'sh-play';
    el.innerHTML = `<div class="sh-ph"><button class="sh-x" id="p-x" aria-label="Close lesson">✕</button><div class="sh-bar" role="progressbar" aria-label="Lesson progress"><i id="p-bar" style="width:0"></i></div><span class="sh-combo" id="p-combo"></span><button class="sh-x sh-mute" id="p-snd" aria-label="Sound on or off" title="Sound">${Snd.on ? '🔊' : '🔇'}</button></div>
      <div class="sh-stage" id="p-stage"></div><div class="sh-foot" id="p-foot"><div class="sh-foot-in" id="p-foot-in"></div></div>`;
    document.body.appendChild(el);
    const stage = $('#p-stage', el), foot = $('#p-foot', el), footIn = $('#p-foot-in', el);
    $('#p-snd', el).onclick = (e) => { Snd.on = !Snd.on; store.set('sh_sound', Snd.on ? '1' : '0'); e.currentTarget.textContent = Snd.on ? '🔊' : '🔇'; };
    const close = () => { document.removeEventListener('keydown', onKey); el.remove(); document.body.style.overflow = ''; refresh(); };
    $('#p-x', el).onclick = () => { if (P.queue.length && !P.finished && !replay && !confirm('Leave this lesson? Your progress is saved — you can carry on later.')) return; close(); };

    const setBar = () => { $('#p-bar', el).style.width = Math.round((P.doneSet.size / steps.length) * 100) + '%'; };
    const setCombo = () => { const c = $('#p-combo', el); c.textContent = P.combo >= 2 ? '🔥 ' + P.combo : ''; if (P.combo >= 2) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); } };
    let saveT = null;
    const save = () => {
      if (replay) return;
      clearTimeout(saveT);
      saveT = setTimeout(() => {
        let i = 0; while (i < steps.length && P.doneSet.has(i)) i++;
        S.sb.from('study_lessons').update({ status: 'in_progress', progress: { i, results: P.results } }).eq('id', lesson.id).then(() => {}, () => {});
      }, 400);
    };

    // footer states
    let primary = null;
    function footIdle(label, enabled, onClick, extra) {
      foot.className = 'sh-foot';
      footIn.innerHTML = `${extra || ''}<span></span><button class="sh-btn ${label === 'Check' || label === 'Mark my answer' ? 'go' : 'pri'} lg" id="p-go" ${enabled ? '' : 'disabled'}>${esc(label)}</button>`;
      primary = $('#p-go', footIn); primary.onclick = onClick;
      const sk = $('#p-skip', footIn); if (sk && extra) sk.onclick = () => skipCurrent();
    }
    function footResult(ok, title, msg, onNext) {
      foot.className = 'sh-foot ' + (ok ? 'ok' : 'bad');
      footIn.innerHTML = `<div class="fb"><span class="ic">${ok ? '✅' : '💡'}</span><div><h3>${esc(title)}</h3>${msg ? `<p>${msg}</p>` : ''}</div></div><button class="sh-btn ${ok ? 'go' : 'bad'} lg" id="p-go">Continue</button>`;
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
      if (CHECKABLE.includes(s.type) && s.type !== 'exam') track('study_step', { unit: lesson.unit || null, view: 'study-hub', ref: 'sh:' + lesson.id + ':' + item.i, title: (s.q || s.statement || s.text || s.prompt || '').slice(0, 300), score: r.ok ? 1 : 0, max_score: 1, meta: { topic: lesson.topic || null, type: s.type, source: 'study_hub' } });
      footResult(r.ok, title || (r.ok ? pick(PRAISE) : pick(NOPE)), [correctHtml, explain ? esc(explain) : ''].filter(Boolean).join('<br>'), next);
    }
    function skipCurrent() {
      const item = P.cur; if (!item) return;
      const s = steps[item.i];
      if (s.type === 'exam') { examReveal(item, 0, [], null, true); return; }
    }

    function next() {
      const item = P.queue.shift();
      if (!item) return finish();
      P.cur = item;
      const s = steps[item.i];
      stage.scrollTop = 0;
      const head = item.retry ? '<div class="sh-kind retry">↻ Let\'s try that again</div>' : '';
      const wrap = (html) => { stage.innerHTML = `<div class="sh-step">${head}${html}</div>`; };
      if (s.type === 'learn') {
        wrap(`<div class="sh-kind">📘 New idea</div><div class="sh-learn">${s.emoji ? `<div class="emo">${esc(s.emoji)}</div>` : ''}${s.title ? `<h2>${esc(s.title)}</h2>` : ''}<p>${esc(s.body)}</p>${(s.points || []).length ? `<ul>${s.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}${s.example ? `<div class="sh-ex"><b>Example</b>${esc(s.example)}</div>` : ''}</div>`);
        footIdle('Continue', true, () => { record(item.i, { ok: true, score: 0, max: 0 }); next(); });
      } else if (s.type === 'recap') {
        wrap(`<div class="sh-kind">🏁 Recap</div><h1 class="sh-q">${esc(s.title || 'Key takeaways')}</h1><div class="sh-recap">${s.points.map((p, i) => `<div style="animation-delay:${i * 90}ms">${esc(p)}</div>`).join('')}</div>`);
        footIdle(P.queue.length ? 'Continue' : 'Finish lesson', true, () => { record(item.i, { ok: true, score: 0, max: 0 }); next(); });
      } else if (s.type === 'mcq') {
        let sel = -1;
        wrap(`<div class="sh-kind">${s.bank ? '🎯 From the RA10 question bank' : '❓ Quick check'}</div><h1 class="sh-q">${esc(s.q)}</h1><div class="sh-opts">${s.choices.map((c, i) => `<button class="sh-opt" data-k="${i}"><span class="k">${i + 1}</span><span>${esc(c)}</span></button>`).join('')}</div>`);
        const opts = $$('.sh-opt', stage);
        opts.forEach(b => b.onclick = () => { sel = Number(b.dataset.k); opts.forEach(x => x.classList.toggle('sel', x === b)); Snd.tap(); enable(true); });
        footIdle('Check', false, () => {
          const ok = sel === s.answer;
          opts.forEach((b, i) => { b.disabled = true; b.classList.remove('sel'); if (i === s.answer) b.classList.add('ok'); else if (i === sel) b.classList.add('bad'); });
          judge(item, { ok, score: ok ? 1 : 0, max: 1 }, ok ? '' : '<b>Answer:</b> ' + esc(s.choices[s.answer]), s.explain);
        });
      } else if (s.type === 'truefalse') {
        let sel = null;
        wrap(`<div class="sh-kind">⚖️ True or false?</div><div class="sh-statement">${esc(s.statement)}</div><div class="sh-opts sh-tf"><button class="sh-opt" data-k="1" data-v="1"><span class="k">1</span>✔ True</button><button class="sh-opt" data-k="2" data-v="0"><span class="k">2</span>✘ False</button></div>`);
        const opts = $$('.sh-opt', stage);
        opts.forEach(b => b.onclick = () => { sel = b.dataset.v === '1'; opts.forEach(x => x.classList.toggle('sel', x === b)); Snd.tap(); enable(true); });
        footIdle('Check', false, () => {
          const ok = sel === s.answer;
          opts.forEach(b => { b.disabled = true; b.classList.remove('sel'); const v = b.dataset.v === '1'; if (v === s.answer) b.classList.add('ok'); else if (v === sel) b.classList.add('bad'); });
          judge(item, { ok, score: ok ? 1 : 0, max: 1 }, ok ? '' : '<b>It\'s ' + (s.answer ? 'true' : 'false') + '.</b>', s.explain);
        });
      } else if (s.type === 'fill') {
        const filled = s.blanks.map(() => null); // index into options
        const parts = s.text.split('___');
        wrap(`<div class="sh-kind">✍️ Fill the gap</div><h1 class="sh-q sm">Complete the sentence</h1><div class="sh-sentence" id="f-sen"></div><div class="sh-bank" id="f-bank">${s.options.map((o, i) => `<button class="sh-tile" data-o="${i}">${esc(o)}</button>`).join('')}</div>`);
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
        wrap(`<div class="sh-kind">🔢 Put it in order</div><h1 class="sh-q sm">${esc(s.prompt)}</h1><div class="sh-answer-line" id="o-line"></div><div class="sh-order-bank" id="o-bank"></div>`);
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
        wrap(`<div class="sh-kind">🧩 Match the pairs</div><h1 class="sh-q sm">${esc(s.prompt)}</h1><div class="sh-match"><div class="sh-match-col">${L.map(i => `<button class="sh-tile" data-l="${i}">${esc(s.pairs[i][0])}</button>`).join('')}</div><div class="sh-match-col">${R.map(i => `<button class="sh-tile" data-r="${i}">${esc(s.pairs[i][1])}</button>`).join('')}</div></div>`);
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
        wrap(`<div class="sh-kind">📝 ${s.source === 'exam' ? 'Real exam question' : 'Exam-style question'}</div>
          <div class="sh-exam-meta"><span class="sh-badge acc">${s.marks} mark${s.marks === 1 ? '' : 's'}</span>${s.verb ? `<span class="sh-badge">${esc(s.verb)}</span>` : ''}</div>
          ${s.context ? `<div class="sh-context">${esc(s.context)}</div>` : ''}<h1 class="sh-q sm">${esc(s.q)}</h1>
          <textarea class="sh-write" id="e-ans" placeholder="Write your answer like you would in the exam…"></textarea><div class="sh-wc" id="e-wc">0 words · aim for about ${s.marks * 20} words</div><div id="e-res"></div>`);
        const ta = $('#e-ans', stage);
        ta.oninput = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; $('#e-wc', stage).textContent = n + ' word' + (n === 1 ? '' : 's') + ' · aim for about ' + s.marks * 20 + ' words'; enable(n >= 3); };
        setTimeout(() => ta.focus({ preventScroll: true }), 300);
        footIdle('Mark my answer', false, async () => {
          primary.disabled = true; primary.textContent = 'Marking…';
          ta.readOnly = true;
          try {
            const r = await api('mark', { lessonId: lesson.id, step: item.i, answer: ta.value });
            if (!r.ok) throw new Error(r.error);
            examReveal(item, r.score, r.got || [], r);
          } catch (e) { selfMark(item, ta.value); }
        }, '<button class="sh-btn ghost skip" id="p-skip">Show me the answer</button>');
      }
    }

    function examReveal(item, score, got, r, skipped) {
      const s = steps[item.i];
      const box = $('#e-res', stage);
      const ta = $('#e-ans', stage); if (ta) ta.readOnly = true;
      box.innerHTML = `${skipped ? '' : `<div class="sh-markres"><span class="big">${score}/${s.marks}</span><p>${esc((r && r.feedback) || '')}${r && r.tip ? `<br><b>Tip:</b> ${esc(r.tip)}` : ''}</p></div>`}
        <div class="sh-ins-h">Mark scheme</div><div class="sh-ms">${s.points.map((p, i) => `<div class="${got.includes(i) ? 'got' : ''}"><span class="tk">${got.includes(i) ? '✓' : '•'}</span><span>${esc(p)}</span></div>`).join('')}</div>
        ${s.model ? `<details class="sh-model" ${skipped ? 'open' : ''}><summary>Model answer</summary><p>${esc(s.model)}</p></details>` : ''}`;
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const ok = score >= Math.ceil(s.marks / 2);
      if (skipped) { P.combo = 0; setCombo(); record(item.i, { ok: false, score: 0, max: s.marks }); footResult(false, 'Here\'s how to answer it', 'Read the mark scheme and model answer, then try a similar question next time.', next); return; }
      const full = score === s.marks;
      judge(item, { ok, score, max: s.marks }, '', full ? 'Every mark-scheme point covered.' : ok ? 'Check the mark-scheme point you missed to pick up full marks.' : 'Look at the mark-scheme points you missed and the model answer.',
        full ? 'Full marks! 🎉' : ok ? `Good answer — ${score}/${s.marks}` : score ? `Getting there — ${score}/${s.marks}` : 'Not quite yet');
      track('study_exam', { unit: lesson.unit || null, view: 'study-hub', ref: 'sh:' + lesson.id + ':' + item.i, title: s.q.slice(0, 300), answer: ta ? ta.value : '', score, max_score: s.marks, meta: { topic: lesson.topic || null, source: 'study_hub' } });
    }
    function selfMark(item, answer) {
      const s = steps[item.i];
      const box = $('#e-res', stage);
      box.innerHTML = `<div class="sh-ins-h">Mark it yourself — tick each point you made</div><div class="sh-ms">${s.points.map((p, i) => `<label><input type="checkbox" data-pt="${i}"><span>${esc(p)}</span></label>`).join('')}</div>${s.model ? `<details class="sh-model"><summary>Model answer</summary><p>${esc(s.model)}</p></details>` : ''}`;
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      footIdle('Save my mark', true, () => {
        const got = $$('[data-pt]:checked', box).map(x => Number(x.dataset.pt));
        examReveal(item, Math.min(s.marks, got.length), got, { feedback: 'Self-marked against the mark scheme.' });
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
      stage.innerHTML = `<div class="sh-finish"><div class="sh-trophy">${pct >= 90 ? '🏆' : pct >= 60 ? '🌟' : '💪'}</div><h1>${pct >= 90 ? 'Lesson mastered!' : 'Lesson complete!'}</h1><p class="sh-muted">${esc(lesson.title)}</p>
        <div class="sh-stats"><div class="sh-stat" style="--c:var(--gold)"><b>Total XP</b><span id="f-xp">…</span></div><div class="sh-stat" style="--c:var(--ok);animation-delay:.1s"><b>${pct >= 90 ? 'Amazing' : 'Accuracy'}</b><span>${pct}%</span></div><div class="sh-stat" style="--c:var(--acc);animation-delay:.2s"><b>Time</b><span>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}</span></div></div>
        ${P.best >= 3 ? `<p style="font-weight:800;color:var(--fire)">🔥 Best combo: ${P.best} in a row</p>` : ''}
        <div class="acts"><button class="sh-btn pri lg wide" id="f-home">Continue</button>${S.status && S.status.can_create ? '<button class="sh-btn lg wide" id="f-more">Make another lesson</button>' : ''}</div></div>`;
      Snd.done(); confetti();
      $('#f-home', stage).onclick = close;
      const more = $('#f-more', stage); if (more) more.onclick = () => { close(); setTimeout(() => { const m = $('#sh-maker'); if (m) m.scrollIntoView({ behavior: 'smooth' }); }, 600); };
      let xp = 0;
      try { const r = await api('complete', { lessonId: lesson.id, results: P.results, bestCombo: P.best }); xp = r.ok ? (r.xp || 0) : 0; } catch (e) {}
      const xe = $('#f-xp', stage);
      if (xe) { if (replay || !xp) xe.textContent = replay ? 'Replay' : '0'; else { let n = 0; const st = setInterval(() => { n = Math.min(xp, n + Math.ceil(xp / 20)); xe.textContent = '+' + n; if (n >= xp) clearInterval(st); }, 40); } }
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
