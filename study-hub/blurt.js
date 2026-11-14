/* RA10 Study Hub — Blurt & Grill (Premium · 3 free tries).
   1. Pick a unit, then a whole learning aim / chapter OR one topic inside it.
   2. Blurt against the clock — type it, write it with a stylus (read by the AI), or say it (voice orb).
   3. The AI maps the brain-dump onto the specification checklist: green = covered, amber = vague, red = missed.
      A single topic with no sub-points gets a short checklist written for that topic by the AI.
   4. Grill: two quick questions on the gaps, answered by voice, text or pen, and marked.
   SHBlurt.open({ unit }) — opened from the Study Hub tools row. Server: ai-tools (blurt, blurt-mark).
   Uses refresh/ra10-voice.js (RA10Voice) and refresh/ra10-ink.js (RA10Ink) when they are on the page. */
(function () {
  'use strict';
  if (window.SHBlurt) return;
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const T = () => window.RA10Tools;
  const V = () => window.RA10Voice;
  const K = () => window.RA10Ink;
  const units = () => (window.RA10Units ? RA10Units.all() : []);
  const unitOf = (p) => (window.RA10Units ? RA10Units.byPath(p) : null);
  let ov = null, timer = null;

  function css() {
    if (document.getElementById('shb-css')) return;
    const st = document.createElement('style'); st.id = 'shb-css';
    st.textContent = `
.shb{--g1:#1f6feb;--g2:#7c3aed;--g3:#db2777;--g4:#22d3ee;position:fixed!important;inset:0;z-index:2147483000;background:var(--bg,#f6f5fb);color:var(--ink,#15131f);overflow:auto;font-family:var(--font,system-ui)}
.shb::before{content:"";position:fixed;inset:-20% -10% auto -10%;height:70vh;pointer-events:none;z-index:0;
  background:radial-gradient(40% 50% at 20% 30%,color-mix(in srgb,var(--g4) 22%,transparent),transparent 70%),radial-gradient(40% 50% at 70% 20%,color-mix(in srgb,var(--g2) 24%,transparent),transparent 70%),radial-gradient(35% 45% at 85% 60%,color-mix(in srgb,var(--g3) 16%,transparent),transparent 70%);
  filter:blur(10px);animation:shbAur 18s ease-in-out infinite alternate}
@keyframes shbAur{to{transform:translate3d(-4%,4%,0) scale(1.08)}}
.shb-in{position:relative;z-index:1;max-width:780px;margin:0 auto;padding:18px 16px 70px}
.shb-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.shb-top h2{margin:0;font-size:1rem;flex:1;display:flex;align-items:center;gap:8px}
.shb-top h2 .o{width:22px;height:22px;border-radius:50%;background:radial-gradient(120% 90% at 30% 15%,rgba(255,255,255,.6),transparent 45%),linear-gradient(135deg,var(--g1),var(--g2));box-shadow:0 4px 12px -3px var(--g2)}
.shb-x{width:40px;height:40px;border-radius:50%;border:1px solid var(--line,#e4e2ee);background:color-mix(in srgb,var(--card,#fff) 70%,transparent);backdrop-filter:blur(10px);color:var(--ink-2,#565269);font-size:18px;cursor:pointer}
.shb-hero{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;margin:6px 0 18px}
.shb-hero h1{margin:6px 0 0;font-size:clamp(1.6rem,1.1rem+2vw,2.3rem);letter-spacing:-.025em;background:linear-gradient(100deg,var(--ink,#15131f) 30%,var(--g2) 60%,var(--g3));-webkit-background-clip:text;background-clip:text;color:transparent}
.shb-hero p{margin:0;color:var(--ink-2,#565269);max-width:48ch}
.shb-card{position:relative;background:color-mix(in srgb,var(--card,#fff) 82%,transparent);backdrop-filter:blur(14px) saturate(160%);-webkit-backdrop-filter:blur(14px) saturate(160%);border:1px solid color-mix(in srgb,var(--line,#e4e2ee) 80%,transparent);border-radius:24px;padding:18px;box-shadow:0 18px 40px -28px rgba(40,20,120,.35)}
.shb-card+.shb-card{margin-top:12px}
.shb-card.glow::after{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(135deg,var(--g4),var(--g2),var(--g3));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;opacity:.7}
.shb-lab{display:block;font-weight:800;font-size:.85rem;margin:0 0 8px}
.shb-sel{width:100%;padding:12px 14px;border-radius:14px;border:1.5px solid var(--line,#e4e2ee);background:var(--card,#fff);color:inherit;font:600 .95rem inherit}
.shb-aims{display:grid;gap:8px;margin-top:12px}
.shb-aim{border:1.5px solid var(--line,#e4e2ee);border-radius:18px;background:var(--card,#fff);overflow:hidden}
.shb-aim[open]{border-color:color-mix(in srgb,var(--g2) 55%,var(--line,#e4e2ee))}
.shb-aim summary{display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer;list-style:none}
.shb-aim summary::-webkit-details-marker{display:none}
.shb-aim .t{flex:none;min-width:38px;height:38px;padding:0 8px;border-radius:12px;display:grid;place-items:center;color:#fff;font-weight:800;background:linear-gradient(135deg,var(--g1),var(--g2))}
.shb-aim summary b{display:block;font-size:.95rem}.shb-aim summary small{color:var(--ink-3,#8d89a1)}
.shb-aim summary .chev{margin-left:auto;transition:transform .2s;opacity:.5}.shb-aim[open] summary .chev{transform:rotate(90deg)}
.shb-topics{display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 14px}
.shb-tp{display:inline-flex;align-items:center;gap:6px;min-height:38px;padding:7px 13px;border-radius:999px;border:1.5px solid var(--line,#e4e2ee);background:transparent;color:inherit;font:600 .85rem inherit;cursor:pointer;text-align:left}
.shb-tp:hover,.shb-tp:focus-visible{border-color:var(--g2);outline:none}
.shb-tp.all{background:linear-gradient(135deg,var(--g1),var(--g2));border-color:transparent;color:#fff;font-weight:800}
.shb-tp code{font:700 .75rem ui-monospace,monospace;opacity:.7}
.shb-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:10px 20px;border-radius:999px;border:1.5px solid var(--line,#e4e2ee);background:var(--card,#fff);color:inherit;font:800 .95rem inherit;cursor:pointer}
.shb-btn.pri{border:0;color:#fff;background:linear-gradient(135deg,var(--g1),var(--g2) 60%,var(--g3));box-shadow:0 10px 24px -10px var(--g2);background-size:160% 100%;transition:background-position .4s}
.shb-btn.pri:hover{background-position:100% 0}
.shb-btn[disabled]{opacity:.55}
.shb-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:14px}
.shb-modes{display:flex;justify-content:center;gap:6px;padding:4px;border-radius:999px;background:color-mix(in srgb,var(--ink,#15131f) 6%,transparent);width:max-content;margin:0 auto 14px}
.shb-modes button{min-height:40px;padding:6px 16px;border-radius:999px;border:0;background:transparent;color:inherit;font:700 .9rem inherit;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.shb-modes button[aria-pressed="true"]{background:var(--card,#fff);box-shadow:0 2px 8px -2px rgba(0,0,0,.18);color:var(--g2)}
html[data-theme="dark"] .shb-modes button[aria-pressed="true"]{color:#c4b5fd}
.shb-clock{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:12px}
.shb-ring{position:relative;width:86px;height:86px}
.shb-ring svg{transform:rotate(-90deg)}
.shb-ring .tr{fill:none;stroke:color-mix(in srgb,var(--ink,#15131f) 10%,transparent);stroke-width:8}
.shb-ring .ar{fill:none;stroke:url(#shbG);stroke-width:8;stroke-linecap:round;transition:stroke-dashoffset 1s linear}
.shb-ring b{position:absolute;inset:0;display:grid;place-items:center;font-size:1.5rem;font-weight:800;font-variant-numeric:tabular-nums}
.shb-ta{width:100%;min-height:200px;padding:14px;border-radius:16px;border:1.5px solid var(--line,#e4e2ee);background:var(--card,#fff);color:inherit;font:500 1rem/1.6 inherit;resize:vertical}
.shb-ta:focus{outline:none;border-color:var(--g2);box-shadow:0 0 0 4px color-mix(in srgb,var(--g2) 15%,transparent)}
.shb-pane[hidden]{display:none}
.shb-voice{display:flex;flex-direction:column;align-items:center;gap:14px;padding:16px 0 4px}
.shb-voice .shb-ta{min-height:110px}
.shb-hint{color:var(--ink-3,#8d89a1);font-size:.85rem;text-align:center;margin:8px 0 0}
.shb-sum{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:6px 0 14px}
.shb-sum span{padding:8px 14px;border-radius:999px;font-weight:800;font-size:.9rem}
.shb-sum .g{background:var(--ok-soft,#e2f8e9);color:var(--ok-ink,#0f6b31)}.shb-sum .a{background:var(--gold-soft,#fff3d6);color:#92400e}.shb-sum .r{background:var(--bad-soft,#fdeaea);color:var(--bad-ink,#a3242b)}
.shb-score{position:relative;width:130px;height:130px;margin:0 auto}
.shb-score svg{transform:rotate(-90deg)}
.shb-score b{position:absolute;inset:0;display:grid;place-items:center;font-size:2rem;font-weight:800}
.shb-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.shb-list li{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:14px;font-size:.92rem;line-height:1.45;animation:shbIn .35s ease both}
@keyframes shbIn{from{opacity:0;transform:translateY(6px)}}
.shb-list li i{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;color:#fff;font-style:normal;font-size:.75rem;font-weight:800;margin-top:1px}
.shb-list .covered{background:var(--ok-soft,#e2f8e9)}.shb-list .covered i{background:var(--ok,#1fa851)}
.shb-list .partial{background:var(--gold-soft,#fff3d6)}.shb-list .partial i{background:var(--gold,#f5a524)}
.shb-list .missed{background:var(--bad-soft,#fdeaea)}.shb-list .missed i{background:var(--bad,#e5484d)}
html[data-theme="dark"] .shb-list .covered{background:rgba(34,197,94,.14)}html[data-theme="dark"] .shb-list .partial{background:rgba(245,158,11,.14)}html[data-theme="dark"] .shb-list .missed{background:rgba(239,68,68,.14)}
.shb-list small{display:block;color:var(--ink-2,#565269)}
.shb-q{margin:0 0 8px;font-weight:700;line-height:1.45}
.shb-res{margin-top:8px;padding:10px 12px;border-radius:12px;background:color-mix(in srgb,var(--g2) 8%,transparent);font-size:.9rem}
.shb-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}
.shb-think{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 0;text-align:center}
.shb-think .orb{width:92px;height:92px;border-radius:50%;background:radial-gradient(120% 90% at 30% 12%,rgba(255,255,255,.6),transparent 46%),conic-gradient(from 0deg,var(--g4),var(--g2),var(--g3),var(--g1),var(--g4));animation:shbSpin 3s linear infinite,shbBreathe 1.6s ease-in-out infinite;box-shadow:0 18px 50px -12px var(--g2)}
@keyframes shbSpin{to{transform:rotate(360deg)}}
@keyframes shbBreathe{50%{filter:brightness(1.15) saturate(1.2)}}
.shb-think small{color:var(--ink-3,#8d89a1)}
@media (prefers-reduced-motion:reduce){.shb::before,.shb-think .orb,.shb-list li{animation:none}.shb-ring .ar{transition:none}}`;
    document.head.appendChild(st);
  }
  const think = (title, sub) => `<div class="shb-think"><span class="orb" aria-hidden="true"></span><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;

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
  const CODE = /^([A-Z]\d+(?:\.\d+)*)\s+(.*)$/;
  // Topics inside an aim: coded specs (A1, A1.1 …) group sub-points under their topic; flat lists are one topic each.
  function topicsOf(aim) {
    const raw = aim.raw || [];
    const coded = raw.filter((t) => t.code);
    if (coded.length >= 2) {
      const tops = coded.filter((t) => !coded.some((o) => o !== t && t.code.startsWith(o.code + '.')) && t.code.split('.').length === Math.min(...coded.map((x) => x.code.split('.').length)));
      return tops.map((t) => {
        const kids = coded.filter((o) => o.code.startsWith(t.code + '.')).map((o) => (o.code + ' ' + o.name).trim());
        return { code: t.code, name: t.name, points: kids.length >= 2 ? kids : [(t.code + ' ' + t.name).trim()].concat(kids) };
      });
    }
    return raw.map((t) => ({ code: '', name: t.name || '', points: [String(t.name || '')] })).filter((t) => t.name);
  }
  function aimsOf(cat) {
    const spec = (cat && cat.spec) || {};
    return Object.keys(spec).sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true })).map((a) => {
      const label = (cat.aimLabels && cat.aimLabels[a]) || a;
      const word = cat.aimWord || (/\/a-level\//.test(cat.unit || '') ? 'Chapter' : 'Learning aim');
      const raw = (spec[a].topics || []).map((t) => ({ code: t.code || '', name: t.name || '' })).filter((t) => t.code || t.name);
      return { key: a, tag: word === 'Chapter' ? String(label) : String(a), word, title: spec[a].title || word + ' ' + label, raw, points: raw.map((t) => ((t.code ? t.code + ' ' : '') + t.name).trim()).filter(Boolean).slice(0, 30) };
    }).filter((x) => x.points.length >= 2);
  }

  function open(opts) {
    css();
    close();
    ov = document.createElement('div'); ov.className = 'shb'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Blurt and Grill');
    ov.innerHTML = '<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="shbG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#7c3aed"/><stop offset="1" stop-color="#db2777"/></linearGradient></defs></svg><div class="shb-in"><div class="shb-top"><h2><span class="o"></span>Blurt &amp; Grill</h2><button class="shb-x" type="button" aria-label="Close">✕</button></div><div id="shb-body"></div></div>';
    document.documentElement.appendChild(ov);
    document.body.style.overflow = 'hidden';
    $('.shb-x', ov).onclick = close;
    ov.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    pick((opts && opts.unit) || '');
  }
  function close() { if (V()) V().stopAll(); clearInterval(timer); if (ov) { ov.remove(); ov = null; document.body.style.overflow = ''; } }
  const body = () => $('#shb-body', ov);

  async function pick(unit) {
    if (V()) V().stopAll();
    const st = await T().status();
    const list = units();
    unit = unit && unitOf(unit) ? unit : (localStorage.getItem('sh_unit') || '').replace(/"/g, '') || (list[0] && list[0].path);
    body().innerHTML = `<div class="shb-hero">${T().mascot('listen', 92)}<h1>Blurt it all out</h1><p>Pick a whole learning aim or just one topic. Then type it, write it with a stylus, or say it — against the clock. We'll show what you missed, then grill you on it.</p>${T().badge('blurt', st)}</div>
      <div class="shb-card glow"><label class="shb-lab" for="shb-u">Unit</label><select class="shb-sel" id="shb-u">${list.map((u) => `<option value="${esc(u.path)}"${u.path === unit ? ' selected' : ''}>${esc(u.short + ' — ' + u.name.replace(/^Unit \d+:\s*/, ''))}</option>`).join('')}</select><div id="shb-aims" class="shb-aims">${think('Loading the specification…')}</div></div>`;
    const sel = $('#shb-u', ov);
    const loadAims = async (p) => {
      const box = $('#shb-aims', ov); box.innerHTML = think('Loading the specification…');
      try {
        const cat = await loadCatalog(p);
        const aims = aimsOf(cat);
        if (!aims.length) { box.innerHTML = '<p class="shb-hint">This unit has no specification checklist yet. Try another unit.</p>'; return; }
        box.innerHTML = aims.map((a, i) => {
          const tps = topicsOf(a);
          return `<details class="shb-aim"${i === 0 ? ' open' : ''}><summary><span class="t">${esc(a.tag)}</span><span><b>${esc(a.title)}</b><small>${tps.length} topic${tps.length === 1 ? '' : 's'} · ${a.points.length} spec points</small></span><span class="chev" aria-hidden="true">›</span></summary>
            <div class="shb-topics"><button class="shb-tp all" data-a="${i}">Whole ${esc(a.word === 'Chapter' ? 'chapter' : 'aim')}</button>${tps.map((t, j) => `<button class="shb-tp" data-a="${i}" data-t="${j}">${t.code ? `<code>${esc(t.code)}</code>` : ''}${esc(t.name.length > 70 ? t.name.slice(0, 68) + '…' : t.name)}</button>`).join('')}</div></details>`;
        }).join('');
        $$('[data-a]', box).forEach((b) => b.onclick = () => {
          const a = aims[Number(b.dataset.a)];
          if (b.dataset.t == null) return blurt(p, { label: (a.word === 'Chapter' ? 'Chapter ' : 'Learning aim ') + a.tag, title: a.title, points: a.points, topic: '' });
          const t = topicsOf(a)[Number(b.dataset.t)];
          blurt(p, { label: (t.code ? t.code + ' · ' : '') + (a.word === 'Chapter' ? 'Chapter ' : 'Learning aim ') + a.tag, title: t.name, points: t.points, topic: (t.code ? t.code + ' ' : '') + t.name, aimTitle: a.title });
        });
      } catch (e) { box.innerHTML = `<p class="shb-hint">${esc(e.message)}</p>`; }
    };
    sel.onchange = () => { try { localStorage.setItem('sh_unit', sel.value); } catch (e) {} loadAims(sel.value); };
    loadAims(sel.value);
  }

  function blurt(unit, target) {
    const secs = Number(localStorage.getItem('shb_secs') || 60);
    const C = 2 * Math.PI * 36;
    const mode0 = localStorage.getItem('shb_mode') || 'type';
    const hasVoice = V() && V().supported, hasInk = !!K();
    body().innerHTML = `<div class="shb-hero" style="margin-bottom:10px"><p><b>${esc(target.label)}</b></p><h1 style="font-size:clamp(1.3rem,1rem+1.4vw,1.8rem)">${esc(target.title)}</h1></div>
      <div class="shb-card glow">
        <div class="shb-clock"><div class="shb-ring"><svg width="86" height="86" viewBox="0 0 86 86"><circle class="tr" cx="43" cy="43" r="36"/><circle class="ar" id="shb-ar" cx="43" cy="43" r="36" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="0"/></svg><b id="shb-t">${secs}</b></div>
          <div style="display:grid;gap:6px">${[60, 120, 180].map((s) => `<button class="shb-btn" data-secs="${s}" style="min-height:32px;padding:4px 12px;font-size:.8rem;${s === secs ? 'border-color:var(--g2);color:var(--g2)' : ''}">${s / 60} min</button>`).join('')}</div></div>
        <div class="shb-modes" role="group" aria-label="How do you want to blurt?">
          <button data-m="type" aria-pressed="false">⌨️ Type</button>${hasInk ? '<button data-m="write" aria-pressed="false">✍️ Write</button>' : ''}${hasVoice ? '<button data-m="talk" aria-pressed="false">🎙️ Talk</button>' : ''}</div>
        <div class="shb-pane" data-p="type"><textarea class="shb-ta" id="shb-ta" placeholder="Start typing everything you remember — don't stop to check your notes!"></textarea></div>
        <div class="shb-pane" data-p="write" hidden><div id="shb-ink"></div><p class="shb-hint">Write with a stylus, finger or mouse. When you finish, the AI reads your handwriting.</p></div>
        <div class="shb-pane" data-p="talk" hidden><div class="shb-voice" id="shb-voice"></div></div>
        <div class="shb-row"><button class="shb-btn pri" id="shb-go">Start the clock</button></div>
        <p class="shb-hint" id="shb-tip">You can switch between typing, writing and talking at any time — it all counts.</p></div>`;
    const ta = $('#shb-ta', ov), go = $('#shb-go', ov);
    let left = secs, running = false;
    const ink = hasInk ? K().create({ height: 340, hint: 'Write everything you remember…' }) : null;
    if (ink) $('#shb-ink', ov).appendChild(ink.el);
    let voice = null;
    if (hasVoice) {
      // the talk pane has its own transcript box, merged with the typed text at the end
      const vta = document.createElement('textarea'); vta.className = 'shb-ta'; vta.id = 'shb-vta'; vta.placeholder = 'Your words appear here as you speak…';
      voice = V().create({ target: vta, size: 'lg', label: 'Tap the orb and start talking', hint: 'Talking is the fastest way to blurt.', onStart: () => { if (!running) start(); } });
      $('#shb-voice', ov).append(voice.el, vta);
    }
    const setMode = (m) => {
      if (!$(`[data-m="${m}"]`, ov)) m = 'type';
      $$('[data-m]', ov).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === m)));
      $$('[data-p]', ov).forEach((p) => { p.hidden = p.dataset.p !== m; });
      if (m !== 'talk' && voice) voice.stop();
      try { localStorage.setItem('shb_mode', m); } catch (e) {}
    };
    $$('[data-m]', ov).forEach((b) => b.onclick = () => setMode(b.dataset.m));
    setMode(mode0);
    $$('[data-secs]', ov).forEach((b) => b.onclick = () => { if (running) return; localStorage.setItem('shb_secs', b.dataset.secs); blurt(unit, target); });
    const finish = async () => {
      clearInterval(timer); running = false; if (voice) voice.stop();
      let text = [ta.value.trim(), ($('#shb-vta', ov) || {}).value || ''].map((s) => s.trim()).filter(Boolean).join('\n');
      if (ink && !ink.isEmpty()) {
        body().innerHTML = think('Reading your handwriting…', 'This takes a few seconds');
        try { const t = await ink.toText('Handwritten revision blurt about: ' + target.title + '. Transcribe exactly what is written, including spelling mistakes.'); if (t) text = (text ? text + '\n' : '') + t; }
        catch (e) { if (!text) { body().innerHTML = `${think('We couldn’t read the handwriting', e.message)}<div class="shb-row"><button class="shb-btn" id="shb-b">Back</button></div>`; $('#shb-b', ov).onclick = () => pick(unit); return; } }
      }
      check(unit, target, text);
    };
    const start = () => {
      if (running) return finish();
      running = true; go.textContent = 'I\'m done — check it';
      timer = setInterval(() => {
        left--; $('#shb-t', ov).textContent = Math.max(0, left);
        $('#shb-ar', ov).style.strokeDashoffset = (C * (1 - left / secs)).toFixed(1);
        if (left <= 0) finish();
      }, 1000);
    };
    go.onclick = start;
    ta.addEventListener('input', () => { if (!running && ta.value.trim()) start(); });
    if (ink) ink.el.addEventListener('pointerdown', () => { if (!running) start(); });
  }

  async function check(unit, target, text) {
    const u = unitOf(unit);
    body().innerHTML = think('Checking against the specification…', target.points.length >= 3 ? target.points.length + ' points to match' : 'Building a checklist for this topic');
    try {
      const r = await T().api('blurt', { unit, unitName: u ? u.name : unit, qual: u ? u.qual : '', aim: target.aimTitle ? target.aimTitle + ' — ' + target.title : target.title, topic: target.topic || '', points: target.points, text });
      const n = (s) => r.items.filter((x) => x.status === s).length;
      const pct = r.items.length ? (n('covered') + n('partial') / 2) / r.items.length : 0;
      const ico = { covered: '✓', partial: '~', missed: '!' };
      const C = 2 * Math.PI * 54;
      body().innerHTML = `<div class="shb-hero"><div class="shb-score"><svg width="130" height="130" viewBox="0 0 130 130"><circle cx="65" cy="65" r="54" fill="none" stroke="color-mix(in srgb,currentColor 10%,transparent)" stroke-width="10"/><circle cx="65" cy="65" r="54" fill="none" stroke="url(#shbG)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - pct)).toFixed(1)}"/></svg><b>${Math.round(pct * 100)}%</b></div><h1>${pct >= .6 ? 'Brilliant recall' : pct >= .3 ? 'Good start' : 'Lots to rebuild'}</h1>${r.praise ? `<p>${esc(r.praise)}</p>` : ''}</div>
        <div class="shb-sum"><span class="g">${n('covered')} covered</span><span class="a">${n('partial')} vague</span><span class="r">${n('missed')} missed</span></div>
        <div class="shb-card"><ul class="shb-list">${r.items.map((x, i) => `<li class="${x.status}" style="animation-delay:${i * 40}ms"><i>${ico[x.status]}</i><span>${esc(x.point)}${x.note ? `<small>${esc(x.note)}</small>` : ''}</span></li>`).join('')}</ul></div>
        ${r.drill.length ? `<div class="shb-row"><button class="shb-btn pri" id="shb-grill">Grill me on what I missed →</button></div>` : '<div class="shb-row"><button class="shb-btn pri" id="shb-again">Blurt something else</button></div>'}`;
      const g = $('#shb-grill', ov); if (g) g.onclick = () => grill(unit, target, r.drill);
      const a = $('#shb-again', ov); if (a) a.onclick = () => pick(unit);
    } catch (e) {
      if (e.handled) return pick(unit);
      body().innerHTML = `${think('That didn’t work', e.message)}<div class="shb-row"><button class="shb-btn" id="shb-b">Back</button></div>`;
      $('#shb-b', ov).onclick = () => pick(unit);
    }
  }

  function grill(unit, target, drill) {
    body().innerHTML = `<div class="shb-hero">${T().mascot('wave', 72)}<h1>Quick grill</h1><p>Two questions on what you missed. Say, type or write your answer in a sentence or two.</p></div>` +
      drill.map((d, i) => `<div class="shb-card"><p class="shb-q">${i + 1}. ${esc(d.q)}</p><textarea class="shb-ta" style="min-height:90px" data-a="${i}" placeholder="Your answer…"></textarea><div class="shb-tools" data-tools="${i}"></div><div data-ink="${i}"></div><div data-r="${i}"></div></div>`).join('') +
      '<div class="shb-row"><button class="shb-btn pri" id="shb-mark">Mark my answers</button></div>';
    const inks = {};
    drill.forEach((d, i) => {
      const tools = $(`[data-tools="${i}"]`, ov), ta = $(`[data-a="${i}"]`, ov);
      if (V() && V().supported) tools.appendChild(V().create({ target: ta, size: 'sm', label: 'Say it' }).el);
      if (K()) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'shb-btn'; b.style.minHeight = '44px'; b.textContent = '✍️ Write it';
        b.onclick = () => {
          if (inks[i]) { inks[i].el.remove(); delete inks[i]; b.textContent = '✍️ Write it'; return; }
          inks[i] = K().create({ height: 200, hint: 'Write your answer…' }); $(`[data-ink="${i}"]`, ov).appendChild(inks[i].el); b.textContent = 'Hide pen';
        };
        tools.appendChild(b);
      }
    });
    $('#shb-mark', ov).onclick = async function () {
      if (V()) V().stopAll();
      this.disabled = true; this.textContent = 'Reading and marking…';
      const answers = [];
      for (let i = 0; i < drill.length; i++) {
        let a = $(`[data-a="${i}"]`, ov).value.trim();
        if (inks[i] && !inks[i].isEmpty()) { try { const t = await inks[i].toText('Handwritten short answer to: ' + drill[i].q); if (t) a = (a ? a + ' ' : '') + t; } catch (e) {} }
        answers.push(a);
      }
      if (!answers.some(Boolean)) { this.disabled = false; this.textContent = 'Mark my answers'; return; }
      try {
        const r = await T().api('blurt-mark', { drill, answers });
        let total = 0;
        r.marks.forEach((m, i) => {
          total += m.score;
          $(`[data-r="${i}"]`, ov).innerHTML = `<div class="shb-res"><b>${m.score}/2</b> — ${esc(m.feedback)}<br><small><b>Model answer:</b> ${esc(drill[i].model)}</small></div>`;
          if (answers[i] && window.RA10Track) try { RA10Track.log('answer', { ref: 'blurt:' + drill[i].q.slice(0, 80), title: drill[i].q, answer: answers[i], unit }); } catch (e) {}
        });
        this.outerHTML = `<div class="shb-row" style="flex-direction:column;align-items:center">${T().mascot(total >= 3 ? 'cheer' : 'idle', 64)}<b>${total}/4 — ${total >= 3 ? 'gaps closing!' : 'come back tomorrow and blurt it again'}</b><div class="shb-row"><button class="shb-btn" id="shb-again2">Blurt something else</button><button class="shb-btn pri" id="shb-done">Done</button></div></div>`;
        $('#shb-again2', ov).onclick = () => pick(unit);
        $('#shb-done', ov).onclick = close;
      } catch (e) { this.disabled = false; this.textContent = 'Mark my answers'; }
    };
  }

  window.SHBlurt = { open, close };
})();
