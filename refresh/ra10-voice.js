/* RA10 Voice — the speech input used across RA10 (Blurt & Grill, Study Hub answers, any "say it" button).
   A glass AI orb in the AI Helper's colours that reacts to your voice: the core swells with loudness, colour blobs
   drift faster, and a ring of frequency bars follows the sound. Speech becomes text in a target textarea.

     const v = RA10Voice.create({ target: textarea, size: 'lg' | 'sm', label: 'Say it', onStart, onStop });
     container.appendChild(v.el);   v.start() / v.stop() / v.isOn()
     RA10Voice.supported      — true when the browser can turn speech into text
     RA10Voice.stopAll()

   Speech recognition: Web Speech API (en-GB, continuous, interim results). The level meter uses the Web Audio API on
   the same microphone; if that is refused the orb still animates from the speech results. Nothing is recorded or sent
   anywhere by this file. */
(function () {
  'use strict';
  if (window.RA10Voice) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const reduce = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const live = new Set();

  function css() {
    if (document.getElementById('ra10-voice-css')) return;
    const st = document.createElement('style'); st.id = 'ra10-voice-css';
    st.textContent = `
.rv{--lvl:0;--rv1:#1f6feb;--rv2:#7c3aed;--rv3:#db2777;--rv4:#22d3ee;display:flex;flex-direction:column;align-items:center;gap:10px;-webkit-tap-highlight-color:transparent}
.rv-orb{position:relative;width:132px;height:132px;border:0;padding:0;border-radius:50%;background:none;cursor:pointer;display:grid;place-items:center;color:#fff;touch-action:manipulation}
.rv-orb:focus-visible{outline:3px solid var(--rv2);outline-offset:6px}
.rv-wave{position:absolute;inset:-34px;width:calc(100% + 68px);height:calc(100% + 68px);pointer-events:none;opacity:0;transition:opacity .3s}
.rv.on .rv-wave{opacity:1}
.rv-ring{position:absolute;inset:0;border-radius:50%;pointer-events:none;border:2px solid color-mix(in srgb,var(--rv2) 55%,transparent);opacity:0;transform:scale(1)}
.rv.on .rv-ring{animation:rvRing 2.4s cubic-bezier(.2,.6,.3,1) infinite}
.rv.on .rv-ring.r2{animation-delay:1.2s}
@keyframes rvRing{0%{opacity:.55;transform:scale(1)}100%{opacity:0;transform:scale(1.7)}}
.rv-core{position:relative;width:100%;height:100%;border-radius:50%;overflow:hidden;isolation:isolate;
  background:radial-gradient(120% 90% at 30% 12%,rgba(255,255,255,.6),transparent 46%),linear-gradient(135deg,var(--rv1),var(--rv2));
  box-shadow:inset 0 1px 2px rgba(255,255,255,.6),inset 0 -10px 24px rgba(30,0,80,.35),0 18px 40px -12px color-mix(in srgb,var(--rv2) 70%,transparent),0 0 calc(var(--lvl)*60px) color-mix(in srgb,var(--rv4) 60%,transparent);
  transform:scale(calc(1 + var(--lvl)*.22));transition:transform .08s linear,box-shadow .12s linear}
.rv-core i{position:absolute;width:70%;height:70%;border-radius:50%;filter:blur(14px);opacity:.85;mix-blend-mode:screen}
.rv-core i:nth-child(1){left:-10%;top:-5%;background:var(--rv4);animation:rvA 7s ease-in-out infinite}
.rv-core i:nth-child(2){right:-15%;top:15%;background:var(--rv3);animation:rvB 9s ease-in-out infinite}
.rv-core i:nth-child(3){left:15%;bottom:-20%;background:var(--rv1);animation:rvC 8s ease-in-out infinite}
.rv.on .rv-core i{animation-duration:2.2s,2.8s,2.5s}
@keyframes rvA{50%{transform:translate(30%,25%) scale(1.15)}}
@keyframes rvB{50%{transform:translate(-30%,20%) scale(.9)}}
@keyframes rvC{50%{transform:translate(10%,-35%) scale(1.2)}}
.rv-icw{position:absolute;inset:0;z-index:2;display:grid;place-items:center}
.rv.lg .rv-orb{margin:34px}
.rv.sm .rv-icw{position:absolute}
.rv-ic{position:relative;z-index:2;width:38%;height:38%;filter:drop-shadow(0 2px 6px rgba(20,0,60,.35));transition:transform .2s}
.rv.on .rv-ic{transform:scale(.8)}
.rv-cap{text-align:center;min-height:2.6em}
.rv-cap b{display:block;font-size:.98rem}
.rv-cap small{display:block;color:var(--rv-mut,#6b6880);font-size:.82rem;max-width:34ch}
html[data-theme="dark"] .rv-cap small{color:#a7a3bd}
.rv.sm{flex-direction:row;gap:0}
.rv.sm .rv-orb{width:auto;height:44px;border-radius:999px;padding:0 16px 0 6px;gap:10px;display:inline-flex;align-items:center;
  background:linear-gradient(135deg,color-mix(in srgb,var(--rv1) 14%,transparent),color-mix(in srgb,var(--rv2) 14%,transparent));
  border:1px solid color-mix(in srgb,var(--rv2) 35%,transparent);color:inherit;font:700 .9rem inherit}
.rv.sm .rv-core{width:32px;height:32px;flex:none;transform:scale(calc(1 + var(--lvl)*.3))}
.rv.sm .rv-core i{filter:blur(6px)}
.rv.sm .rv-ic{width:55%;height:55%}
.rv.sm .rv-wave,.rv.sm .rv-ring{display:none}
.rv-bars{display:inline-flex;align-items:center;gap:3px;height:20px}
.rv-bars span{width:3px;height:4px;border-radius:2px;background:linear-gradient(var(--rv4),var(--rv2));transition:height .08s linear}
.rv.sm:not(.on) .rv-bars{display:none}
.rv.on .rv-txt-off,.rv:not(.on) .rv-txt-on{display:none}
.rv-unsup{font-size:.82rem;opacity:.7}
@media (prefers-reduced-motion:reduce){.rv-core i,.rv.on .rv-ring{animation:none!important}.rv-core{transition:none}}`;
    document.head.appendChild(st);
  }

  const MIC = '<svg class="rv-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>';
  const STOP = '<svg class="rv-ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2.5" fill="currentColor"/></svg>';

  function create(opts) {
    css();
    opts = opts || {};
    const size = opts.size === 'sm' ? 'sm' : 'lg';
    const el = document.createElement('div');
    el.className = 'rv ' + size;
    const label = opts.label || (size === 'sm' ? 'Say it' : 'Tap to talk');
    if (!SR) {
      el.innerHTML = size === 'sm' ? '' : '<span class="rv-unsup">Voice typing isn’t supported in this browser — type or write instead.</span>';
      return { el, start() {}, stop() {}, isOn: () => false, supported: false };
    }
    el.innerHTML = `<button type="button" class="rv-orb" aria-pressed="false" aria-label="${label}">
        <canvas class="rv-wave" aria-hidden="true"></canvas><span class="rv-ring"></span><span class="rv-ring r2"></span>
        <span class="rv-core"><i></i><i></i><i></i><span class="rv-icw">${MIC}</span></span>
        ${size === 'sm' ? `<span class="rv-txt-off">${label}</span><span class="rv-txt-on">Listening</span><span class="rv-bars" aria-hidden="true">${'<span></span>'.repeat(5)}</span>` : ''}
      </button>` + (size === 'lg' ? `<div class="rv-cap" aria-live="polite"><b class="rv-txt-off">${label}</b><b class="rv-txt-on">Listening…</b><small class="rv-sub">${opts.hint || 'Your words appear as you speak.'}</small></div>` : '');
    const btn = el.querySelector('.rv-orb'), core = el.querySelector('.rv-core'), icw = el.querySelector('.rv-icw');
    const canvas = el.querySelector('.rv-wave'), bars = Array.from(el.querySelectorAll('.rv-bars span'));
    let rec = null, on = false, stream = null, actx = null, an = null, raf = 0, fake = 0, base = '', finalText = '';

    function setLevel(l) { el.style.setProperty('--lvl', Math.max(0, Math.min(1, l)).toFixed(3)); }
    function draw(freq) {
      if (bars.length) bars.forEach((b, i) => { const v = freq ? freq[2 + i * 3] / 255 : fake; b.style.height = Math.max(4, Math.round(4 + v * 16)) + 'px'; });
      if (!canvas || size === 'sm') return;
      const dpr = Math.min(2, window.devicePixelRatio || 1), w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w) return;
      if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
      const g = canvas.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, r0 = Math.min(w, h) / 2 - 30, n = 56;
      const grad = g.createLinearGradient(0, 0, w, h); grad.addColorStop(0, '#22d3ee'); grad.addColorStop(.5, '#7c3aed'); grad.addColorStop(1, '#db2777');
      g.strokeStyle = grad; g.lineCap = 'round'; g.lineWidth = 3;
      for (let i = 0; i < n; i++) {
        const v = freq ? freq[Math.floor((i < n / 2 ? i : n - i) * 1.4) + 2] / 255 : fake * (0.6 + 0.4 * Math.sin(i * 1.7 + performance.now() / 180));
        const a = (i / n) * Math.PI * 2 - Math.PI / 2, len = 3 + v * 26;
        g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len)); g.stroke();
      }
    }
    function loop() {
      let freq = null, lvl = fake;
      if (an) {
        freq = new Uint8Array(an.frequencyBinCount); an.getByteFrequencyData(freq);
        const td = new Uint8Array(an.fftSize); an.getByteTimeDomainData(td);
        let s = 0; for (let i = 0; i < td.length; i++) { const x = (td[i] - 128) / 128; s += x * x; }
        lvl = Math.min(1, Math.sqrt(s / td.length) * 4.2);
      } else fake *= 0.9;
      setLevel(reduce() ? lvl * 0.4 : lvl); draw(freq);
      raf = requestAnimationFrame(loop);
    }
    async function meter() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
        if (!on) { stream.getTracks().forEach((t) => t.stop()); stream = null; return; }
        actx = new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === 'suspended') await actx.resume();
        an = actx.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = 0.72;
        actx.createMediaStreamSource(stream).connect(an);
      } catch (e) { an = null; }   // no meter: the orb pulses from the speech results instead
    }
    function start() {
      if (on) return;
      live.forEach((v) => v !== api && v.stop());
      on = true; live.add(api);
      el.classList.add('on'); btn.setAttribute('aria-pressed', 'true'); icw.innerHTML = STOP;
      const t = opts.target; base = t && t.value ? t.value.replace(/\s*$/, ' ') : ''; finalText = '';
      rec = new SR(); rec.lang = opts.lang || 'en-GB'; rec.continuous = true; rec.interimResults = true;
      rec.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) finalText += r[0].transcript.trim() + ' '; else interim += r[0].transcript; }
        if (opts.target) { opts.target.value = base + finalText + interim; opts.target.dispatchEvent(new Event('input', { bubbles: true })); }
        fake = Math.min(1, fake + 0.5);
        if (opts.onText) opts.onText(base + finalText + interim);
      };
      rec.onend = () => { if (on && rec) { try { rec.start(); } catch (e) {} } };   // keep listening through pauses
      rec.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          stop(); const sub = el.querySelector('.rv-sub'); if (sub) sub.textContent = 'Microphone blocked — allow it in your browser, or type instead.';
          if (opts.onError) opts.onError(e.error);
        }
      };
      try { rec.start(); } catch (e) {}
      meter(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
      if (opts.onStart) opts.onStart();
    }
    function stop() {
      if (!on) return;
      on = false; live.delete(api);
      el.classList.remove('on'); btn.setAttribute('aria-pressed', 'false'); icw.innerHTML = MIC;
      if (rec) { try { rec.onend = null; rec.stop(); } catch (e) {} rec = null; }
      if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
      if (actx) { try { actx.close(); } catch (e) {} actx = null; }
      an = null; cancelAnimationFrame(raf); setLevel(0); draw(null);
      if (opts.onStop) opts.onStop();
    }
    btn.addEventListener('click', () => (on ? stop() : start()));
    const api = { el, start, stop, isOn: () => on, supported: true };
    return api;
  }

  // Any <textarea data-voice> gets a small voice button underneath it, including ones rendered later.
  function attachAll(root) {
    if (!SR) return;
    (root || document).querySelectorAll('textarea[data-voice]:not([data-voice-on])').forEach((ta) => {
      ta.setAttribute('data-voice-on', '1');
      const v = create({ target: ta, size: 'sm', label: ta.getAttribute('data-voice') || 'Say it' });
      v.el.style.marginTop = '8px';
      ta.insertAdjacentElement('afterend', v.el);
    });
  }
  function auto() {
    attachAll();
    let q = false;
    new MutationObserver(() => { if (q) return; q = true; requestAnimationFrame(() => { q = false; attachAll(); }); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();

  window.RA10Voice = { create, attachAll, supported: !!SR, stopAll: () => Array.from(live).forEach((v) => v.stop()) };
})();
