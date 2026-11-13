/* RA10 Study Hub — Blurt & Grill (Premium · 3 free tries).
   1. Pick a unit and a learning aim / chapter.
   2. Blurt: 60 seconds to say (microphone) or type everything you remember.
   3. The AI maps the brain-dump onto the specification checklist: green = covered, amber = vague, red = missed.
   4. Grill: two quick questions on what you missed, answered by voice or text and marked.
   SHBlurt.open({ unit }) — opened from the Study Hub tools row. Server: ai-tools (blurt, blurt-mark). */
(function () {
  'use strict';
  if (window.SHBlurt) return;
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const T = () => window.RA10Tools;
  const units = () => (window.RA10Units ? RA10Units.all() : []);
  const unitOf = (p) => (window.RA10Units ? RA10Units.byPath(p) : null);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  let ov = null, rec = null, timer = null;

  function css() {
    if (document.getElementById('shb-css')) return;
    const st = document.createElement('style'); st.id = 'shb-css';
    st.textContent = `
.shb{position:fixed!important;inset:0;z-index:2147483000;background:var(--bg,#f6f5fb);color:var(--ink,#15131f);overflow:auto;font-family:var(--font,system-ui)}
.shb-in{max-width:760px;margin:0 auto;padding:18px 16px 60px}
.shb-top{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.shb-top h2{margin:0;font-size:1.05rem;flex:1}
.shb-x{width:40px;height:40px;border-radius:50%;border:0;background:var(--soft,#f0eff7);color:var(--ink-2,#565269);font-size:18px;cursor:pointer}
.shb-hero{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;margin:8px 0 18px}
.shb-hero h1{margin:6px 0 0;font-size:clamp(1.5rem,1.1rem+1.6vw,2rem);letter-spacing:-.02em}
.shb-hero p{margin:0;color:var(--ink-2,#565269);max-width:46ch}
.shb-card{background:var(--card,#fff);border:2px solid var(--line,#e4e2ee);border-radius:22px;padding:18px}
.shb-card+.shb-card{margin-top:12px}
.shb-lab{display:block;font-weight:800;font-size:.85rem;margin:0 0 8px}
.shb-sel{width:100%;padding:12px 14px;border-radius:14px;border:2px solid var(--line,#e4e2ee);background:var(--card,#fff);color:inherit;font:600 .95rem inherit}
.shb-aims{display:grid;gap:8px;margin-top:12px}
.shb-aim{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;border:2px solid var(--line,#e4e2ee);background:var(--card,#fff);color:inherit;text-align:left;font:inherit;cursor:pointer}
.shb-aim:hover,.shb-aim:focus-visible{border-color:var(--acc,#5b4cf5);outline:none}
.shb-aim .t{flex:none;min-width:38px;height:38px;padding:0 8px;border-radius:12px;display:grid;place-items:center;background:var(--acc-soft,#ecebff);color:var(--acc,#5b4cf5);font-weight:800}
.shb-aim b{display:block;font-size:.95rem}
.shb-aim small{color:var(--ink-3,#8d89a1)}
.shb-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:10px 20px;border-radius:999px;border:2px solid var(--line,#e4e2ee);background:var(--card,#fff);color:inherit;font:800 .95rem inherit;cursor:pointer}
.shb-btn.pri{background:var(--acc,#5b4cf5);border-color:var(--acc,#5b4cf5);color:#fff;box-shadow:0 4px 0 var(--acc-2,#4636d8)}
.shb-btn[disabled]{opacity:.55}
.shb-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:14px}
.shb-ring{position:relative;width:132px;height:132px;margin:4px auto 10px}
.shb-ring svg{transform:rotate(-90deg)}
.shb-ring .tr{fill:none;stroke:var(--line,#e4e2ee);stroke-width:10}
.shb-ring .ar{fill:none;stroke:var(--acc,#5b4cf5);stroke-width:10;stroke-linecap:round;transition:stroke-dashoffset 1s linear}
.shb-ring b{position:absolute;inset:0;display:grid;place-items:center;font-size:2rem;font-weight:800;font-variant-numeric:tabular-nums}
.shb-ta{width:100%;min-height:200px;padding:14px;border-radius:16px;border:2px solid var(--line,#e4e2ee);background:var(--card,#fff);color:inherit;font:500 1rem/1.6 inherit;resize:vertical}
.shb-ta:focus{outline:none;border-color:var(--acc,#5b4cf5)}
.shb-mic{width:64px;height:64px;border-radius:50%;border:0;background:var(--acc,#5b4cf5);color:#fff;font-size:1.6rem;cursor:pointer;box-shadow:0 4px 0 var(--acc-2,#4636d8)}
.shb-mic.on{background:var(--bad,#e5484d);box-shadow:0 0 0 8px color-mix(in srgb,var(--bad,#e5484d) 22%,transparent);animation:shbPulse 1.4s ease-in-out infinite}
@keyframes shbPulse{50%{box-shadow:0 0 0 14px color-mix(in srgb,var(--bad,#e5484d) 10%,transparent)}}
.shb-hint{color:var(--ink-3,#8d89a1);font-size:.85rem;text-align:center;margin:8px 0 0}
.shb-sum{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:6px 0 14px}
.shb-sum span{padding:8px 14px;border-radius:999px;font-weight:800;font-size:.9rem}
.shb-sum .g{background:var(--ok-soft,#e2f8e9);color:var(--ok-ink,#0f6b31)}.shb-sum .a{background:var(--gold-soft,#fff3d6);color:#92400e}.shb-sum .r{background:var(--bad-soft,#fdeaea);color:var(--bad-ink,#a3242b)}
.shb-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.shb-list li{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:14px;font-size:.92rem;line-height:1.45}
.shb-list li i{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;color:#fff;font-style:normal;font-size:.75rem;font-weight:800;margin-top:1px}
.shb-list .covered{background:var(--ok-soft,#e2f8e9)}.shb-list .covered i{background:var(--ok,#1fa851)}
.shb-list .partial{background:var(--gold-soft,#fff3d6)}.shb-list .partial i{background:var(--gold,#f5a524)}
.shb-list .missed{background:var(--bad-soft,#fdeaea)}.shb-list .missed i{background:var(--bad,#e5484d)}
.shb-list small{display:block;color:var(--ink-2,#565269)}
.shb-q{margin:0 0 8px;font-weight:700;line-height:1.45}
.shb-res{margin-top:8px;padding:10px 12px;border-radius:12px;background:var(--soft,#f0eff7);font-size:.9rem}
.shb-load{display:flex;flex-direction:column;align-items:center;gap:10px;padding:30px 0;text-align:center}
.shb-spin{width:30px;height:30px;border-radius:50%;border:3px solid var(--line,#e4e2ee);border-top-color:var(--acc,#5b4cf5);animation:shbSpin .9s linear infinite}
@keyframes shbSpin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.shb-mic.on{animation:none}.shb-ring .ar{transition:none}}`;
    document.head.appendChild(st);
  }

  // the unit's spec (aims → topics) from the unit app's hidden catalogue frame (shared cache with Study Hub)
  function loadCatalog(path) {
    try { const c = JSON.parse(sessionStorage.getItem('ra10_cat_' + path) || 'null'); if (c) return Promise.resolve(c); } catch (e) {}
    const u = unitOf(path);
    if (!u) return Promise.reject(new Error('Unknown unit'));
    return new Promise((resolve, reject) => {
      const f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
      f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1200px;height:900px;visibility:hidden;border:0';
      f.src = u.app + '?ra10catalog=1';
      let t = null;
      const done = (v, err) => { window.removeEventListener('message', on); clearTimeout(t); f.remove(); err ? reject(err) : resolve(v); };
      const on = (e) => { if (e.origin === location.origin && e.data && e.data.type === 'ra10:catalog' && e.source === f.contentWindow) done(e.data.catalog); };
      t = setTimeout(() => done(null, new Error('The unit took too long to load.')), 40000);
      window.addEventListener('message', on);
      document.body.appendChild(f);
    }).then((c) => { try { sessionStorage.setItem('ra10_cat_' + path, JSON.stringify(c)); } catch (e) {} return c; });
  }
  function aimsOf(cat) {
    const spec = (cat && cat.spec) || {};
    return Object.keys(spec).sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true })).map((a) => {
      const label = (cat.aimLabels && cat.aimLabels[a]) || a;
      const word = cat.aimWord || (/\/a-level\//.test(cat.unit || '') ? 'Chapter' : 'Learning aim');
      return { key: a, tag: word === 'Chapter' ? String(label) : String(a), word, title: spec[a].title || word + ' ' + label, points: (spec[a].topics || []).map((t) => ((t.code ? t.code + ' ' : '') + (t.name || '')).trim()).filter(Boolean).slice(0, 30) };
    }).filter((x) => x.points.length >= 2);
  }

  function open(opts) {
    css();
    close();
    ov = document.createElement('div'); ov.className = 'shb'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Blurt and Grill');
    ov.innerHTML = '<div class="shb-in"><div class="shb-top"><h2>Blurt &amp; Grill</h2><button class="shb-x" type="button" aria-label="Close">✕</button></div><div id="shb-body"></div></div>';
    document.documentElement.appendChild(ov);
    document.body.style.overflow = 'hidden';
    $('.shb-x', ov).onclick = close;
    ov.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    pick((opts && opts.unit) || '');
  }
  function close() { stopRec(); clearInterval(timer); if (ov) { ov.remove(); ov = null; document.body.style.overflow = ''; } }
  const body = () => $('#shb-body', ov);

  async function pick(unit) {
    const st = await T().status();
    const list = units();
    unit = unit && unitOf(unit) ? unit : (localStorage.getItem('sh_unit') || '').replace(/"/g, '') || (list[0] && list[0].path);
    body().innerHTML = `<div class="shb-hero">${T().mascot('listen', 96)}<h1>Blurt it all out</h1><p>60 seconds: say or type everything you remember. We'll show what you missed, then grill you on it.</p>${T().badge('blurt', st)}</div>
      <div class="shb-card"><label class="shb-lab" for="shb-u">Unit</label><select class="shb-sel" id="shb-u">${list.map((u) => `<option value="${esc(u.path)}"${u.path === unit ? ' selected' : ''}>${esc(u.short + ' — ' + u.name.replace(/^Unit \d+:\s*/, ''))}</option>`).join('')}</select><div id="shb-aims" class="shb-aims"><div class="shb-load"><span class="shb-spin"></span></div></div></div>`;
    const sel = $('#shb-u', ov);
    const loadAims = async (p) => {
      const box = $('#shb-aims', ov); box.innerHTML = '<div class="shb-load"><span class="shb-spin"></span><span>Loading the specification…</span></div>';
      try {
        const cat = await loadCatalog(p);
        const aims = aimsOf(cat);
        if (!aims.length) { box.innerHTML = '<p class="shb-hint">This unit has no specification checklist yet. Try another unit.</p>'; return; }
        box.innerHTML = aims.map((a, i) => `<button class="shb-aim" data-i="${i}"><span class="t">${esc(a.tag)}</span><span><b>${esc(a.title)}</b><small>${a.points.length} spec points</small></span></button>`).join('');
        $$('[data-i]', box).forEach((b) => b.onclick = () => blurt(p, aims[Number(b.dataset.i)]));
      } catch (e) { box.innerHTML = `<p class="shb-hint">${esc(e.message)}</p>`; }
    };
    sel.onchange = () => loadAims(sel.value);
    loadAims(sel.value);
  }

  /* ── speech ── */
  function stopRec() { if (rec) { try { rec.onend = null; rec.stop(); } catch (e) {} rec = null; } }
  function startRec(ta, btn) {
    if (!SR) return;
    rec = new SR(); rec.lang = 'en-GB'; rec.continuous = true; rec.interimResults = true;
    const base = ta.value ? ta.value.replace(/\s*$/, ' ') : '';
    let finalText = '';
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) finalText += r[0].transcript + ' '; else interim += r[0].transcript; }
      ta.value = base + finalText + interim;
    };
    rec.onend = () => { if (rec) { try { rec.start(); } catch (e) {} } };   // keep listening through pauses
    rec.onerror = (e) => { if (e.error === 'not-allowed') { stopRec(); btn.classList.remove('on'); btn.setAttribute('aria-pressed', 'false'); $('.shb-hint', ov).textContent = 'Microphone blocked — type instead.'; } };
    try { rec.start(); } catch (e) {}
  }

  function blurt(unit, aim) {
    const secs = Number(localStorage.getItem('shb_secs') || 60);
    const C = 2 * Math.PI * 56;
    body().innerHTML = `<div class="shb-hero" style="margin-bottom:8px"><p><b>${esc(aim.word === 'Chapter' ? 'Chapter ' + aim.tag : 'Learning aim ' + aim.tag)}</b> · ${esc(aim.title)}</p></div>
      <div class="shb-card" style="text-align:center"><div class="shb-ring"><svg width="132" height="132" viewBox="0 0 132 132"><circle class="tr" cx="66" cy="66" r="56"/><circle class="ar" id="shb-ar" cx="66" cy="66" r="56" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="0"/></svg><b id="shb-t">${secs}</b></div>
        <div class="shb-row" style="margin:0 0 10px">${[60, 120].map((s) => `<button class="shb-btn" data-secs="${s}" style="min-height:36px;padding:6px 14px;${s === secs ? 'border-color:var(--acc,#5b4cf5);color:var(--acc,#5b4cf5)' : ''}">${s === 60 ? '1 min' : '2 min'}</button>`).join('')}</div>
        <textarea class="shb-ta" id="shb-ta" placeholder="Start typing — or press the microphone and talk. Don't stop to check your notes!"></textarea>
        <div class="shb-row">${SR ? '<button class="shb-mic" id="shb-mic" aria-pressed="false" aria-label="Talk instead of typing">🎙️</button>' : ''}<button class="shb-btn pri" id="shb-go">Start the clock</button></div>
        <p class="shb-hint">${SR ? 'Talking is faster than typing — your words appear as you speak.' : 'Type everything you can remember.'}</p></div>`;
    const ta = $('#shb-ta', ov), mic = $('#shb-mic', ov), go = $('#shb-go', ov);
    let left = secs, running = false;
    $$('[data-secs]', ov).forEach((b) => b.onclick = () => { if (running) return; localStorage.setItem('shb_secs', b.dataset.secs); blurt(unit, aim); });
    const finish = () => { clearInterval(timer); running = false; stopRec(); if (mic) { mic.classList.remove('on'); mic.setAttribute('aria-pressed', 'false'); } check(unit, aim, ta.value); };
    const start = () => {
      if (running) return finish();
      running = true; go.textContent = 'I\'m done'; ta.focus();
      timer = setInterval(() => {
        left--; $('#shb-t', ov).textContent = Math.max(0, left);
        $('#shb-ar', ov).style.strokeDashoffset = (C * (1 - left / secs)).toFixed(1);
        if (left <= 0) finish();
      }, 1000);
    };
    go.onclick = start;
    ta.addEventListener('input', () => { if (!running && ta.value.trim()) start(); });
    if (mic) mic.onclick = () => {
      const on = !mic.classList.contains('on');
      mic.classList.toggle('on', on); mic.setAttribute('aria-pressed', String(on));
      if (on) { startRec(ta, mic); if (!running) start(); } else stopRec();
    };
  }

  async function check(unit, aim, text) {
    const u = unitOf(unit);
    body().innerHTML = `<div class="shb-load">${T().mascot('think', 88)}<b>Checking against the specification…</b><span class="shb-hint">${aim.points.length} points to match</span></div>`;
    try {
      const r = await T().api('blurt', { unit, unitName: u ? u.name : unit, qual: u ? u.qual : '', aim: aim.title, points: aim.points, text });
      const n = (s) => r.items.filter((x) => x.status === s).length;
      const pct = r.items.length ? (n('covered') + n('partial') / 2) / r.items.length : 0;
      const ico = { covered: '✓', partial: '~', missed: '!' };
      body().innerHTML = `<div class="shb-hero">${T().mascot(pct >= .6 ? 'cheer' : pct >= .3 ? 'idle' : 'think', 84)}<h1>${Math.round(pct * 100)}% recalled</h1>${r.praise ? `<p>${esc(r.praise)}</p>` : ''}</div>
        <div class="shb-sum"><span class="g">${n('covered')} covered</span><span class="a">${n('partial')} vague</span><span class="r">${n('missed')} missed</span></div>
        <div class="shb-card"><ul class="shb-list">${r.items.map((x) => `<li class="${x.status}"><i>${ico[x.status]}</i><span>${esc(x.point)}${x.note ? `<small>${esc(x.note)}</small>` : ''}</span></li>`).join('')}</ul></div>
        ${r.drill.length ? `<div class="shb-row"><button class="shb-btn pri" id="shb-grill">Grill me on what I missed →</button></div>` : '<div class="shb-row"><button class="shb-btn pri" id="shb-again">Blurt another aim</button></div>'}`;
      const g = $('#shb-grill', ov); if (g) g.onclick = () => grill(unit, aim, r.drill);
      const a = $('#shb-again', ov); if (a) a.onclick = () => pick(unit);
    } catch (e) {
      if (e.handled) return pick(unit);
      body().innerHTML = `<div class="shb-load">${T().mascot('think', 80)}<b>That didn't work</b><span class="shb-hint">${esc(e.message)}</span><button class="shb-btn" id="shb-b">Back</button></div>`;
      $('#shb-b', ov).onclick = () => pick(unit);
    }
  }

  function grill(unit, aim, drill) {
    body().innerHTML = `<div class="shb-hero">${T().mascot('wave', 72)}<h1>Quick grill</h1><p>Two questions on what you missed. Answer in a sentence or two.</p></div>` +
      drill.map((d, i) => `<div class="shb-card"><p class="shb-q">${i + 1}. ${esc(d.q)}</p><textarea class="shb-ta" style="min-height:90px" data-a="${i}" placeholder="Your answer…"></textarea>${SR ? `<div class="shb-row" style="justify-content:flex-start;margin-top:8px"><button class="shb-btn" data-mic="${i}" style="min-height:38px">🎙️ Say it</button></div>` : ''}<div data-r="${i}"></div></div>`).join('') +
      '<div class="shb-row"><button class="shb-btn pri" id="shb-mark">Mark my answers</button></div>';
    $$('[data-mic]', ov).forEach((b) => b.onclick = () => {
      const ta = $(`[data-a="${b.dataset.mic}"]`, ov);
      if (b.classList.contains('on')) { stopRec(); b.classList.remove('on'); b.textContent = '🎙️ Say it'; return; }
      stopRec(); $$('[data-mic]', ov).forEach((x) => { x.classList.remove('on'); x.textContent = '🎙️ Say it'; });
      b.classList.add('on'); b.textContent = '■ Stop'; startRec(ta, b);
    });
    $('#shb-mark', ov).onclick = async function () {
      stopRec();
      const answers = $$('[data-a]', ov).map((t) => t.value.trim());
      if (!answers.some(Boolean)) return;
      this.disabled = true; this.textContent = 'Marking…';
      try {
        const r = await T().api('blurt-mark', { drill, answers });
        let total = 0;
        r.marks.forEach((m, i) => {
          total += m.score;
          $(`[data-r="${i}"]`, ov).innerHTML = `<div class="shb-res"><b>${m.score}/2</b> — ${esc(m.feedback)}<br><small><b>Model answer:</b> ${esc(drill[i].model)}</small></div>`;
          if (answers[i] && window.RA10Track) try { RA10Track.log('answer', { ref: 'blurt:' + drill[i].q.slice(0, 80), title: drill[i].q, answer: answers[i], unit }); } catch (e) {}
        });
        this.outerHTML = `<div class="shb-row" style="flex-direction:column;align-items:center">${T().mascot(total >= 3 ? 'cheer' : 'idle', 64)}<b>${total}/4 — ${total >= 3 ? 'gaps closing!' : 'come back tomorrow and blurt it again'}</b><div class="shb-row"><button class="shb-btn" id="shb-again2">Another aim</button><button class="shb-btn pri" id="shb-done">Done</button></div></div>`;
        $('#shb-again2', ov).onclick = () => pick(unit);
        $('#shb-done', ov).onclick = close;
      } catch (e) { this.disabled = false; this.textContent = 'Mark my answers'; }
    };
  }

  window.SHBlurt = { open, close };
})();
