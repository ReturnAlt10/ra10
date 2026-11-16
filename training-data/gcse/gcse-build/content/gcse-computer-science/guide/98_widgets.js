  /* ===== Interactive diagrams =====
     Guide topics write W('name', {options}) placeholders; each is mounted here once the guide is on the page.
     Every widget is plain HTML/SVG (no libraries), follows light/dark mode through the app's CSS variables and
     works with touch. Numbers shown are calculated live from what the student enters — nothing is made up. */
  const WCSS = `
.csw{--w-a:var(--accent,#0f766e);--w-ok:#16a34a;--w-bad:#dc2626;--w-warn:#d97706;--w-b:#2563eb;--w-v:#7c3aed;margin:16px 0 18px;padding:14px;border:1px solid var(--line,#e2e8f0);border-radius:16px;background:var(--surface-soft,#f8fafc);color:var(--ink,#0f172a);font-size:.92rem;line-height:1.5;overflow:hidden}
.csw *{box-sizing:border-box}
.csw-h{display:flex;align-items:center;gap:8px;margin:0 0 10px;font-weight:800;font-size:.95rem}
.csw-h i{white-space:nowrap;flex:none;font-style:normal;font-size:.68rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:var(--w-a);padding:3px 8px;border-radius:999px}
.csw-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0}
.csw button,.csw select,.csw input{font:inherit;color:inherit}
.csw button{border:1px solid var(--line-2,#cbd5e1);background:var(--surface,#fff);border-radius:10px;padding:6px 12px;cursor:pointer;font-weight:700;font-size:.85rem;min-height:36px}
.csw button:hover{border-color:var(--w-a)}
.csw button.pri{background:var(--w-a);border-color:var(--w-a);color:#fff}
.csw button:disabled{opacity:.45;cursor:default}
.csw input[type=text],.csw input[type=number],.csw select{border:1px solid var(--line-2,#cbd5e1);background:var(--surface,#fff);border-radius:10px;padding:6px 10px;min-height:36px;max-width:100%}
.csw input[type=range]{accent-color:var(--w-a);width:180px;max-width:100%}
.csw-out{margin-top:8px;padding:10px 12px;border-radius:12px;background:var(--surface,#fff);border:1px solid var(--line,#e2e8f0)}
.csw-note{font-size:.8rem;color:var(--muted,#64748b);margin-top:6px}
.csw-mono,.csw code{font-family:var(--mono,ui-monospace,Consolas,monospace)}
.csw table{border-collapse:collapse;width:100%;font-size:.85rem}
.csw th,.csw td{border:1px solid var(--line,#e2e8f0);padding:5px 7px;text-align:center}
.csw th{background:var(--surface,#fff);font-weight:800}
.csw tr.on td{background:color-mix(in srgb,var(--w-a) 18%,transparent);font-weight:800}
.csw-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.csw svg{display:block;max-width:100%;height:auto}
.csw svg text{fill:currentColor;font-family:inherit}
.csw-bits{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px}
.csw-bit{display:flex;flex-direction:column;align-items:center;gap:3px}
.csw-bit small{font-size:.7rem;color:var(--muted,#64748b);font-weight:700}
.csw-bit button{width:100%;min-height:44px;font-size:1.15rem;font-family:var(--mono,monospace);padding:4px 0}
.csw-bit button.one{background:var(--w-a);color:#fff;border-color:var(--w-a)}
.csw-big{font-size:1.25rem;font-weight:800}
.csw-chip{display:inline-block;padding:2px 9px;border-radius:999px;font-weight:800;font-size:.78rem;background:color-mix(in srgb,var(--w-a) 15%,transparent);color:var(--w-a)}
.csw-chip.bad{background:color-mix(in srgb,var(--w-bad) 15%,transparent);color:var(--w-bad)}
.csw-chip.ok{background:color-mix(in srgb,var(--w-ok) 15%,transparent);color:var(--w-ok)}
.csw-chip.warn{background:color-mix(in srgb,var(--w-warn) 18%,transparent);color:var(--w-warn)}
.csw-reg{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}
.csw-reg div{padding:8px;border-radius:12px;border:2px solid var(--line,#e2e8f0);background:var(--surface,#fff);text-align:center;transition:border-color .25s,background .25s}
.csw-reg div b{display:block;font-size:.72rem;letter-spacing:.04em;color:var(--muted,#64748b)}
.csw-reg div span{font-family:var(--mono,monospace);font-weight:800;font-size:1rem}
.csw-reg div.hot{border-color:var(--w-a);background:color-mix(in srgb,var(--w-a) 14%,var(--surface,#fff))}
.csw-mem{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:8px}
.csw-mem div{border:1px solid var(--line,#e2e8f0);border-radius:10px;padding:5px;background:var(--surface,#fff);font-family:var(--mono,monospace);font-size:.8rem;text-align:center}
.csw-mem div small{display:block;color:var(--muted,#64748b);font-size:.68rem}
.csw-mem div.hot{border-color:var(--w-a);box-shadow:0 0 0 2px color-mix(in srgb,var(--w-a) 35%,transparent)}
.csw-stage{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}
.csw-stage span{padding:3px 10px;border-radius:999px;font-weight:800;font-size:.78rem;border:1px solid var(--line-2,#cbd5e1)}
.csw-stage span.on{background:var(--w-a);color:#fff;border-color:var(--w-a)}
.csw-arr{display:flex;flex-wrap:wrap;gap:5px}
.csw-arr div{min-width:40px;padding:8px 4px;border-radius:10px;text-align:center;font-weight:800;font-family:var(--mono,monospace);border:2px solid var(--line,#e2e8f0);background:var(--surface,#fff);position:relative;transition:all .2s}
.csw-arr div small{position:absolute;top:-15px;left:0;right:0;font-size:.62rem;color:var(--muted,#64748b);font-weight:700}
.csw-arr div.cmp{border-color:var(--w-warn);background:color-mix(in srgb,var(--w-warn) 18%,var(--surface,#fff))}
.csw-arr div.hit{border-color:var(--w-ok);background:color-mix(in srgb,var(--w-ok) 22%,var(--surface,#fff))}
.csw-arr div.out{opacity:.3}
.csw-arr div.done{border-color:var(--w-b);background:color-mix(in srgb,var(--w-b) 12%,var(--surface,#fff))}
.csw-arr div.sw{border-color:var(--w-v);background:color-mix(in srgb,var(--w-v) 18%,var(--surface,#fff))}
.csw-arrs{display:flex;flex-direction:column;gap:20px;margin-top:16px}
.csw-msg{min-height:3em}
.csw-grid{display:grid;gap:2px;touch-action:none;user-select:none;max-width:320px}
.csw-grid div{aspect-ratio:1;border-radius:2px;cursor:pointer;border:1px solid rgba(127,127,127,.25)}
.csw-pal{display:flex;flex-wrap:wrap;gap:5px}
.csw-pal button{width:34px;height:34px;min-height:34px;border-radius:8px;padding:0;border:2px solid var(--line-2,#cbd5e1)}
.csw-pal button.on{outline:3px solid var(--w-a);outline-offset:1px}
.csw-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}.csw-two>div{min-width:0}.csw label{max-width:100%}.csw select{width:auto;max-width:100%;text-overflow:ellipsis}
@media (max-width:560px){.csw-two{grid-template-columns:minmax(0,1fr)}.csw select{width:100%}.csw{padding:12px}.csw-bit button{min-height:40px;font-size:1rem}}
.csw-code{font-family:var(--mono,monospace);font-size:.82rem;background:var(--surface,#fff);border:1px solid var(--line,#e2e8f0);border-radius:12px;padding:8px 0;overflow-x:auto}
.csw-code div{padding:1px 10px;white-space:pre}
.csw-code div.on{background:color-mix(in srgb,var(--w-a) 20%,transparent);font-weight:800}
.csw-code div b{color:var(--muted,#64748b);font-weight:600;margin-right:8px}
.csw-wire{stroke-width:3;fill:none;transition:stroke .2s}
.csw-on{stroke:var(--w-ok)} .csw-off{stroke:var(--muted,#94a3b8)}
.csw-gate{fill:var(--surface,#fff);stroke:currentColor;stroke-width:2.2}
`;
  const W = window.__CSW_W = window.__CSW_W || {};
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (s, n, c) => String(s).padStart(n, c || '0');
  const bin8 = (n) => pad((n >>> 0).toString(2), 8).slice(-8);
  const hex2 = (n) => pad(n.toString(16).toUpperCase(), 2);
  const fmt = (n) => Number(n).toLocaleString('en-GB', { maximumFractionDigits: 2 });
  const q = (root, s) => root.querySelector(s);
  const qa = (root, s) => Array.from(root.querySelectorAll(s));
  function head(t, kind) { return `<div class="csw-h"><i>${kind || 'Try it'}</i>${t}</div>`; }
  function sizeText(bits) {
    const B = bits / 8;
    const parts = [fmt(bits) + ' bits', fmt(B) + ' bytes'];
    if (B >= 1000) parts.push(fmt(B / 1000) + ' KB');
    if (B >= 1e6) parts.push(fmt(B / 1e6) + ' MB');
    if (B >= 1e9) parts.push(fmt(B / 1e9) + ' GB');
    return parts.join(' = ');
  }

  /* ---------- 1.1 fetch–execute cycle ---------- */
  W.fde = function (root) {
    const PROG = { 0: 'LOAD 5', 1: 'ADD 6', 2: 'STORE 7', 3: 'HALT', 4: '—', 5: '12', 6: '30', 7: '0' };
    const S = [];
    let st = { PC: 0, MAR: '–', MDR: '–', ACC: 0, CU: '–', mem: Object.assign({}, PROG), stage: '', hot: [], memHot: null, msg: 'The program is stored in RAM (von Neumann: instructions and data share the same memory). Press <b>Step</b> to start the cycle.' };
    const push = (o) => { st = Object.assign({}, st, o, { mem: Object.assign({}, st.mem, o.mem || {}) }); S.push(st); };
    S.push(st);
    const instr = [['LOAD', 5], ['ADD', 6], ['STORE', 7], ['HALT']];
    let acc = 0;
    instr.forEach((ins, pc) => {
      push({ stage: 'Fetch', hot: ['PC', 'MAR'], memHot: null, MAR: pc, msg: `<b>Fetch:</b> the address in the <b>Program Counter</b> (${pc}) is copied into the <b>MAR</b> — the MAR always holds an <i>address</i>.` });
      push({ stage: 'Fetch', hot: ['PC'], PC: pc + 1, msg: `<b>Fetch:</b> the <b>Program Counter</b> is incremented to ${pc + 1}, so it points to the <i>next</i> instruction.` });
      push({ stage: 'Fetch', hot: ['MDR'], memHot: pc, MDR: PROG[pc], msg: `<b>Fetch:</b> the instruction stored at address ${pc} (<code>${PROG[pc]}</code>) is copied from RAM into the <b>MDR</b> — the MDR holds the <i>data or instruction</i> just fetched or about to be written.` });
      push({ stage: 'Decode', hot: ['CU'], memHot: null, CU: PROG[pc], msg: `<b>Decode:</b> the <b>Control Unit</b> decodes <code>${PROG[pc]}</code> to work out what to do and sends control signals to the other components.` });
      if (ins[0] === 'LOAD') {
        push({ stage: 'Execute', hot: ['MAR'], MAR: ins[1], msg: `<b>Execute:</b> LOAD needs the data at address ${ins[1]}, so ${ins[1]} goes into the MAR.` });
        push({ stage: 'Execute', hot: ['MDR'], memHot: ins[1], MDR: PROG[ins[1]], msg: `<b>Execute:</b> the value ${PROG[ins[1]]} is read from address ${ins[1]} into the MDR.` });
        acc = Number(PROG[ins[1]]);
        push({ stage: 'Execute', hot: ['ACC'], memHot: null, ACC: acc, msg: `<b>Execute:</b> the value is copied into the <b>Accumulator</b>, which holds the results of calculations. ACC = ${acc}.` });
      } else if (ins[0] === 'ADD') {
        push({ stage: 'Execute', hot: ['MAR'], MAR: ins[1], msg: `<b>Execute:</b> ADD needs the data at address ${ins[1]} — the address goes into the MAR.` });
        push({ stage: 'Execute', hot: ['MDR'], memHot: ins[1], MDR: PROG[ins[1]], msg: `<b>Execute:</b> ${PROG[ins[1]]} is read into the MDR.` });
        const old = acc; acc += Number(PROG[ins[1]]);
        push({ stage: 'Execute', hot: ['ALU', 'ACC'], memHot: null, ACC: acc, msg: `<b>Execute:</b> the <b>ALU</b> (Arithmetic Logic Unit) adds the Accumulator and the MDR: ${old} + ${PROG[ins[1]]} = ${acc}. The result is stored in the Accumulator.` });
      } else if (ins[0] === 'STORE') {
        push({ stage: 'Execute', hot: ['MAR'], MAR: ins[1], msg: `<b>Execute:</b> STORE writes to address ${ins[1]}, so ${ins[1]} goes into the MAR.` });
        push({ stage: 'Execute', hot: ['MDR'], MDR: acc, msg: `<b>Execute:</b> the value in the Accumulator (${acc}) is copied into the MDR, ready to be written.` });
        push({ stage: 'Execute', hot: [], memHot: ins[1], mem: { [ins[1]]: String(acc) }, msg: `<b>Execute:</b> the MDR's value is written into RAM at address ${ins[1]}. Memory now holds the answer ${acc}.` });
      } else {
        push({ stage: 'Execute', hot: ['CU'], memHot: null, msg: '<b>Execute:</b> HALT — the program has finished. In a real CPU the cycle repeats billions of times a second (the clock speed).' });
      }
    });
    let i = 0, timer = null;
    root.innerHTML = head('The fetch–decode–execute cycle, one step at a time', 'Interactive') + `
      <div class="csw-stage"><span data-s="Fetch">Fetch</span><span data-s="Decode">Decode</span><span data-s="Execute">Execute</span></div>
      <div class="csw-reg">${['PC', 'MAR', 'MDR', 'ACC', 'CU', 'ALU'].map(r => `<div data-r="${r}"><b>${{ PC: 'PROGRAM COUNTER', MAR: 'MAR · address', MDR: 'MDR · data', ACC: 'ACCUMULATOR', CU: 'CONTROL UNIT', ALU: 'ALU' }[r]}</b><span></span></div>`).join('')}</div>
      <div class="csw-note">RAM (address : contents)</div><div class="csw-mem"></div>
      <div class="csw-out csw-msg"></div>
      <div class="csw-row"><button data-a="back">◀ Back</button><button class="pri" data-a="step">Step ▶</button><button data-a="play">Auto play</button><button data-a="reset">Reset</button><span class="csw-note" data-n></span></div>`;
    function draw() {
      const s = S[i];
      qa(root, '[data-s]').forEach(e => e.classList.toggle('on', e.dataset.s === s.stage));
      qa(root, '[data-r]').forEach(e => {
        const r = e.dataset.r;
        q(e, 'span').textContent = r === 'ALU' ? (s.hot.includes('ALU') ? '+ adding' : 'idle') : String(s[r]);
        e.classList.toggle('hot', s.hot.includes(r));
      });
      q(root, '.csw-mem').innerHTML = Object.keys(s.mem).map(a => `<div class="${String(s.memHot) === a ? 'hot' : ''}"><small>address ${a}</small>${esc(s.mem[a])}</div>`).join('');
      q(root, '.csw-msg').innerHTML = s.msg;
      q(root, '[data-n]').textContent = 'Step ' + i + ' of ' + (S.length - 1);
      q(root, '[data-a=back]').disabled = i === 0; q(root, '[data-a=step]').disabled = i === S.length - 1;
    }
    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      const k = a.dataset.a;
      if (k === 'step' && i < S.length - 1) i++;
      if (k === 'back' && i > 0) i--;
      if (k === 'reset') { i = 0; clearInterval(timer); timer = null; q(root, '[data-a=play]').textContent = 'Auto play'; }
      if (k === 'play') {
        if (timer) { clearInterval(timer); timer = null; a.textContent = 'Auto play'; }
        else { a.textContent = 'Pause'; timer = setInterval(() => { if (i >= S.length - 1 || !root.isConnected) { clearInterval(timer); timer = null; a.textContent = 'Auto play'; return; } i++; draw(); }, 1700); }
      }
      draw();
    });
    draw();
  };

  /* ---------- 1.1 CPU performance ---------- */
  W.perf = function (root) {
    root.innerHTML = head('What makes one CPU faster than another?', 'Interactive') + `
      <div class="csw-two"><div>
        <label>Clock speed: <b data-v="clk"></b> GHz<br><input type="range" min="1" max="5" step="0.1" value="2" data-i="clk"></label><br>
        <label>Number of cores: <b data-v="core"></b><br><input type="range" min="0" max="3" step="1" value="1" data-i="core"></label><br>
        <label>Cache size: <b data-v="cache"></b> MB<br><input type="range" min="0" max="4" step="1" value="1" data-i="cache"></label>
      </div><div>
        <label>Kind of program<br><select data-i="kind"><option value="multi">Can be split into parallel tasks (eg video rendering)</option><option value="single">Must run one step after another (eg a simple game loop)</option></select></label>
        <div class="csw-out"><div>Clock cycles per second: <b data-o="hz"></b></div><div>Cores that are actually used: <b data-o="used"></b></div><div>Relative speed (1 core, 1 GHz, 2 MB = 1×): <span class="csw-big" data-o="rel"></span></div><svg viewBox="0 0 300 18" data-o="bar"></svg></div>
      </div></div>
      <div class="csw-out" data-o="why"></div>
      <div class="csw-note">A simplified teaching model: real performance also depends on the program, memory speed and heat. It is here to show the direction of each effect, not exact figures.</div>`;
    const CORES = [1, 2, 4, 8], CACHE = [1, 2, 4, 8, 16];
    function draw() {
      const clk = Number(q(root, '[data-i=clk]').value), cores = CORES[q(root, '[data-i=core]').value], cache = CACHE[q(root, '[data-i=cache]').value], kind = q(root, '[data-i=kind]').value;
      q(root, '[data-v=clk]').textContent = clk.toFixed(1); q(root, '[data-v=core]').textContent = cores; q(root, '[data-v=cache]').textContent = cache;
      const used = kind === 'multi' ? cores : 1;
      // cache: fewer slow trips to RAM — diminishing returns (log scale)
      const cacheF = 1 + 0.12 * Math.log2(cache / 2);
      const rel = clk * used * cacheF / (1 * 1 * 1);
      q(root, '[data-o=hz]').textContent = fmt(clk * 1e9) + ' (' + clk.toFixed(1) + ' billion)';
      q(root, '[data-o=used]').textContent = used + (kind === 'single' && cores > 1 ? ' (the other ' + (cores - 1) + ' sit idle)' : '');
      q(root, '[data-o=rel]').textContent = rel.toFixed(1) + '×';
      q(root, '[data-o=bar]').innerHTML = `<rect x="0" y="3" width="300" height="12" rx="6" fill="currentColor" opacity=".12"/><rect x="0" y="3" width="${Math.min(300, rel / 48 * 300)}" height="12" rx="6" fill="var(--w-a)"/>`;
      const why = [];
      why.push(`<b>Clock speed ${clk.toFixed(1)} GHz</b> = ${clk.toFixed(1)} billion cycles per second, so more instructions can be fetched, decoded and executed each second.`);
      why.push(kind === 'multi' ? `<b>${cores} core${cores > 1 ? 's' : ''}</b>: each core is a separate processing unit, so ${cores} instructions/tasks can be processed at the same time.` : `<b>${cores} core${cores > 1 ? 's' : ''}</b>: this program cannot be split into parallel tasks, so extra cores do <b>not</b> make it faster — a common exam point.`);
      why.push(`<b>Cache ${cache} MB</b>: cache is very fast memory inside the CPU that holds frequently used data and instructions. A bigger cache means fewer slower trips to RAM — but the benefit gets smaller each time you double it.`);
      q(root, '[data-o=why]').innerHTML = '<ul style="margin:0;padding-left:18px">' + why.map(x => '<li>' + x + '</li>').join('') + '</ul>';
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.2 virtual memory ---------- */
  W.vm = function (root) {
    const APPS = [['Browser', 3, '#2563eb'], ['Game', 4, '#dc2626'], ['Music', 2, '#16a34a'], ['Essay', 2, '#d97706'], ['Photo editor', 3, '#7c3aed']];
    const CAP = 8;
    let ram = [], vm = [], swaps = 0, used = [];
    root.innerHTML = head('Virtual memory: what happens when RAM is full?', 'Interactive') + `
      <p style="margin:0 0 6px">RAM here has <b>${CAP} blocks</b>. Click programs to open or switch to them.</p>
      <div class="csw-row" data-apps></div>
      <div class="csw-two"><div><b>RAM</b> (fast, ${CAP} blocks)<div class="csw-mem" data-ram></div></div><div><b>Virtual memory</b> (a part of secondary storage — slow)<div class="csw-mem" data-vm></div></div></div>
      <div class="csw-out csw-msg" data-m>Open some programs.</div><div class="csw-row"><button data-reset>Close everything</button><span class="csw-note" data-s></span></div>`;
    q(root, '[data-apps]').innerHTML = APPS.map(a => `<button data-app="${a[0]}" style="border-color:${a[2]}">${a[0]} <small>(${a[1]} blocks)</small></button>`).join('');
    const size = (n) => APPS.find(a => a[0] === n)[1];
    const free = () => CAP - ram.reduce((s, n) => s + size(n), 0);
    function draw(msg) {
      const cell = (n) => { const a = APPS.find(x => x[0] === n); return Array.from({ length: a[1] }, () => `<div style="background:${a[2]};color:#fff;border-color:${a[2]}">${esc(n)}</div>`).join(''); };
      q(root, '[data-ram]').innerHTML = ram.map(cell).join('') + Array.from({ length: free() }, () => '<div><small>free</small>–</div>').join('');
      q(root, '[data-vm]').innerHTML = vm.map(cell).join('') || '<div style="grid-column:1/-1"><small>empty</small></div>';
      if (msg) q(root, '[data-m]').innerHTML = msg;
      q(root, '[data-s]').innerHTML = 'Swaps between RAM and disk: <b>' + swaps + '</b>' + (swaps >= 4 ? ' <span class="csw-chip bad">lots of swapping = the computer slows down (disk thrashing)</span>' : '');
    }
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-reset]')) { ram = []; vm = []; swaps = 0; used = []; draw('Everything closed.'); return; }
      const b = e.target.closest('[data-app]'); if (!b) return;
      const n = b.dataset.app;
      used = used.filter(x => x !== n).concat(n);
      if (ram.includes(n)) { draw(`<b>${esc(n)}</b> is already in RAM — switching to it is instant.`); return; }
      const fromVm = vm.includes(n);
      vm = vm.filter(x => x !== n);
      const moved = [];
      while (free() < size(n)) {
        const lru = used.find(x => ram.includes(x) && x !== n) || ram[0];
        ram = ram.filter(x => x !== lru); vm.push(lru); moved.push(lru); swaps++;
      }
      ram.push(n); if (fromVm) swaps++;
      draw(moved.length
        ? `RAM was full, so the operating system moved <b>${moved.map(esc).join(', ')}</b> (the least recently used) out to <b>virtual memory</b> on secondary storage to make room for <b>${esc(n)}</b>.${fromVm ? ' ' + esc(n) + ' itself had to be copied back from virtual memory first — that is slow.' : ''}`
        : (fromVm ? `${esc(n)} was copied back from virtual memory into RAM.` : `${esc(n)} was loaded into RAM — there was enough free space.`));
    });
    draw();
  };

  /* ---------- 1.2 units ---------- */
  W.units = function (root) {
    const U = ['bit', 'nibble', 'byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
    root.innerHTML = head('Units of data: convert anything', 'Interactive') + `
      <div class="csw-row"><input type="number" value="2" min="0" step="any" data-n style="width:120px"><select data-u>${U.map(u => `<option${u === 'GB' ? ' selected' : ''}>${u}</option>`).join('')}</select>
      <label><input type="checkbox" data-k> use 1,024 instead of 1,000</label></div>
      <div class="csw-scroll"><table data-t></table></div>
      <div class="csw-note">OCR accepts either 1,000 or 1,024 in calculations — say which you used. 1 nibble = 4 bits, 1 byte = 8 bits.</div>`;
    function draw() {
      const k = q(root, '[data-k]').checked ? 1024 : 1000;
      const bitsIn = { bit: 1, nibble: 4, byte: 8 };
      ['KB', 'MB', 'GB', 'TB', 'PB'].forEach((u, i) => { bitsIn[u] = 8 * Math.pow(k, i + 1); });
      const n = Number(q(root, '[data-n]').value) || 0, u = q(root, '[data-u]').value;
      const bits = n * bitsIn[u];
      q(root, '[data-t]').innerHTML = '<tr><th>Unit</th><th>Value</th><th>How</th></tr>' + U.map((x, i) => `<tr class="${x === u ? 'on' : ''}"><td>${x}</td><td>${fmt(bits / bitsIn[x])}</td><td class="csw-note">${i === 0 ? '—' : i === 1 ? '4 bits' : i === 2 ? '8 bits' : '× ' + fmt(k) + ' ' + U[i - 1]}</td></tr>`).join('');
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.2 binary / hex ---------- */
  W.binary = function (root, o) {
    let v = o && o.v != null ? o.v : 0;
    const PV = [128, 64, 32, 16, 8, 4, 2, 1];
    root.innerHTML = head('Binary, denary and hexadecimal — click the bits', 'Interactive') + `
      <div class="csw-bits">${PV.map((p, i) => `<div class="csw-bit"><small>${p}</small><button data-b="${i}">0</button><small>${i === 0 ? 'MSB' : i === 7 ? 'LSB' : ''}</small></div>`).join('')}</div>
      <div class="csw-row"><label>Denary <input type="number" min="0" max="255" data-d style="width:90px"></label><label>Hex <input type="text" maxlength="2" data-h style="width:70px;text-transform:uppercase"></label><button data-z>Clear</button><button data-f>All 1s</button></div>
      <div class="csw-out" data-o></div>`;
    function draw(from) {
      const b = bin8(v);
      qa(root, '[data-b]').forEach((e, i) => { e.textContent = b[i]; e.classList.toggle('one', b[i] === '1'); });
      if (from !== 'd') q(root, '[data-d]').value = v;
      if (from !== 'h') q(root, '[data-h]').value = hex2(v);
      const on = PV.filter((p, i) => b[i] === '1');
      const hi = b.slice(0, 4), lo = b.slice(4);
      q(root, '[data-o]').innerHTML = `<div><b>Binary → denary:</b> add the place values with a 1 under them: ${on.length ? on.join(' + ') + ' = ' : ''}<span class="csw-big">${v}</span></div>
        <div style="margin-top:6px"><b>Binary → hex:</b> split into two nibbles: <code>${hi}</code> = ${parseInt(hi, 2)} = <b>${hex2(parseInt(hi, 2))[1]}</b> and <code>${lo}</code> = ${parseInt(lo, 2)} = <b>${hex2(parseInt(lo, 2))[1]}</b> → <span class="csw-big">${hex2(v)}</span></div>
        <div style="margin-top:6px"><b>Hex → denary:</b> ${parseInt(hi, 2)} × 16 + ${parseInt(lo, 2)} = ${v}</div>`;
    }
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-b]');
      if (b) { v ^= PV[Number(b.dataset.b)]; draw(); }
      if (e.target.closest('[data-z]')) { v = 0; draw(); }
      if (e.target.closest('[data-f]')) { v = 255; draw(); }
    });
    root.addEventListener('input', (e) => {
      if (e.target.matches('[data-d]')) { const n = Math.round(Number(e.target.value)); if (n >= 0 && n <= 255) { v = n; draw('d'); } }
      if (e.target.matches('[data-h]')) { const s = e.target.value.trim(); if (/^[0-9a-f]{1,2}$/i.test(s)) { v = parseInt(s, 16); draw('h'); } }
    });
    draw();
  };

  /* ---------- 1.2 binary addition ---------- */
  W.binadd = function (root, o) {
    let a = (o && o.a) || 107, b = (o && o.b) || 15, col = -1;
    root.innerHTML = head('Binary addition, column by column', 'Interactive') + `
      <div class="csw-row"><label>First number <input type="number" min="0" max="255" value="${a}" data-x style="width:80px"></label><label>Second number <input type="number" min="0" max="255" value="${b}" data-y style="width:80px"></label>
      <button class="pri" data-s>Next column ▶</button><button data-all>Show all</button><button data-r>Restart</button></div>
      <div class="csw-scroll"><table class="csw-mono" data-t></table></div><div class="csw-out csw-msg" data-m></div>`;
    function draw() {
      const A = bin8(a), B = bin8(b);
      const carry = Array(9).fill(''), sum = Array(9).fill('');
      let c = 0, msg = 'Start at the <b>right-hand column</b> (the least significant bit), like ordinary addition.';
      for (let k = 7; k >= 7 - col && k >= 0; k--) {
        const t = Number(A[k]) + Number(B[k]) + c;
        sum[k + 1] = String(t % 2); const nc = t >= 2 ? 1 : 0;
        msg = `Column ${8 - k}: ${A[k]} + ${B[k]}${c ? ' + carry 1' : ''} = ${t} → write <b>${t % 2}</b>${nc ? ', carry <b>1</b>' : ''}. ${['0 + 0 = 0', '1 + 0 = 1', '1 + 1 = 10 (0, carry 1)', '1 + 1 + 1 = 11 (1, carry 1)'][t]}`;
        c = nc; if (k > 0) carry[k] = c ? '1' : ''; else if (c) carry[0] = '1';
      }
      if (col >= 7) {
        const total = a + b;
        if (total > 255) { sum[0] = '1'; msg += `<br><span class="csw-chip bad">Overflow</span> The answer ${total} needs a 9th bit, but the register only holds 8. The 1 that is carried out is lost, so the stored result is ${total - 256} — wrong. This is an <b>overflow error</b>.`; }
        else msg += `<br><span class="csw-chip ok">Done</span> ${a} + ${b} = ${total} = <code>${bin8(total)}</code>. Check: convert both back to denary.`;
      }
      const row = (lab, arr, cls) => `<tr${cls ? ` class="${cls}"` : ''}><th>${lab}</th>${arr.map((x, i) => `<td style="${i === 0 ? 'color:var(--w-bad)' : ''}${i - 1 === 7 - col ? ';background:color-mix(in srgb,var(--w-a) 16%,transparent)' : ''}">${x}</td>`).join('')}</tr>`;
      q(root, '[data-t]').innerHTML = row('carry', carry) + row('', [''].concat(A.split(''))) + row('+', [''].concat(B.split(''))) + row('=', sum);
      q(root, '[data-m]').innerHTML = msg;
      q(root, '[data-s]').disabled = col >= 7;
    }
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-s]') && col < 7) col++;
      if (e.target.closest('[data-all]')) col = 7;
      if (e.target.closest('[data-r]')) col = -1;
      draw();
    });
    root.addEventListener('input', (e) => {
      const n = Math.round(Number(e.target.value)); if (!(n >= 0 && n <= 255)) return;
      if (e.target.matches('[data-x]')) a = n; if (e.target.matches('[data-y]')) b = n; col = -1; draw();
    });
    draw();
  };

  /* ---------- 1.2 binary shifts ---------- */
  W.shift = function (root) {
    let v = 15, last = '';
    root.innerHTML = head('Binary shifts', 'Interactive') + `
      <div class="csw-row"><label>Start number <input type="number" min="0" max="255" value="15" data-v style="width:80px"></label><button data-l>◀ Shift left 1</button><button data-r>Shift right 1 ▶</button><button data-x>Reset</button></div>
      <div class="csw-bits" data-bits></div><div class="csw-out csw-msg" data-m></div>`;
    let start = 15;
    function draw() {
      const b = bin8(v);
      q(root, '[data-bits]').innerHTML = b.split('').map((x, i) => `<div class="csw-bit"><small>${128 >> i}</small><button class="${x === '1' ? 'one' : ''}" tabindex="-1">${x}</button></div>`).join('');
      q(root, '[data-m]').innerHTML = `Now <code>${b}</code> = <b>${v}</b>. ${last}`;
    }
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-l]')) { const lost = v & 128; const nv = (v << 1) & 255; last = `A <b>left shift</b> moves every bit one place left and puts a 0 on the right: the value doubles (× 2)${lost ? ' — <span class="csw-chip bad">but a 1 fell off the left end, so the answer is wrong (overflow)</span>' : ''}.`; v = nv; }
      if (e.target.closest('[data-r]')) { const lost = v & 1; last = `A <b>right shift</b> moves every bit one place right and puts a 0 on the left: the value halves (÷ 2)${lost ? ' — <span class="csw-chip warn">a 1 fell off the right end, so the remainder is lost (it rounds down)</span>' : ''}.`; v = v >> 1; }
      if (e.target.closest('[data-x]')) { v = start; last = ''; }
      draw();
    });
    root.addEventListener('input', (e) => { const n = Math.round(Number(e.target.value)); if (n >= 0 && n <= 255) { start = v = n; last = ''; draw(); } });
    draw();
  };

  /* ---------- 1.2 characters ---------- */
  W.ascii = function (root) {
    root.innerHTML = head('Characters as binary (ASCII)', 'Interactive') + `
      <div class="csw-row"><input type="text" value="Hi A!" maxlength="16" data-s style="width:220px"></div>
      <div class="csw-scroll"><table data-t></table></div><div class="csw-out" data-o></div>`;
    function draw() {
      const s = q(root, '[data-s]').value;
      const rows = Array.from(s).map(ch => {
        const c = ch.codePointAt(0);
        return c < 128 ? `<tr><td>${ch === ' ' ? '(space)' : esc(ch)}</td><td>${c}</td><td class="csw-mono">${bin8(c)}</td></tr>` : `<tr><td>${esc(ch)}</td><td>${c}</td><td class="csw-chip warn">not in ASCII — needs Unicode</td></tr>`;
      });
      q(root, '[data-t]').innerHTML = '<tr><th>Character</th><th>Denary code</th><th>8-bit binary</th></tr>' + rows.join('');
      const n = Array.from(s).length;
      q(root, '[data-o]').innerHTML = `${n} characters × 8 bits = <b>${n * 8} bits</b> (${n} bytes). Codes are in order: if <b>A</b> is 65, then <b>B</b> is 66 and <b>C</b> is 67. Lower-case letters have different codes from capitals (<b>a</b> = 97).<br>
        <b>ASCII</b> uses 7 bits (128 characters; often stored in 8 bits). <b>Unicode</b> uses more bits per character (eg 16 or more), so it can represent far more characters — every language's alphabet, symbols and emoji — but each character takes more storage.`;
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.2 images ---------- */
  W.pixel = function (root) {
    const PAL8 = ['#ffffff', '#000000', '#dc2626', '#16a34a', '#2563eb', '#facc15', '#7c3aed', '#f97316', '#0ea5e9', '#a3a3a3', '#14532d', '#831843', '#fde68a', '#1e3a8a', '#a16207', '#f472b6'];
    let W0 = 8, H0 = 8, depth = 2, pix = [], cur = 1, down = false;
    root.innerHTML = head('A bitmap image: pixels, colour depth and file size', 'Interactive') + `
      <div class="csw-row"><label>Resolution <select data-res><option value="4">4 × 4</option><option value="8" selected>8 × 8</option><option value="16">16 × 16</option></select></label>
      <label>Colour depth <select data-dep><option value="1">1 bit (2 colours)</option><option value="2" selected>2 bits (4 colours)</option><option value="3">3 bits (8 colours)</option><option value="4">4 bits (16 colours)</option></select></label><button data-clear>Clear</button></div>
      <div class="csw-two"><div><div class="csw-pal" data-pal></div><div class="csw-grid" data-g style="margin-top:8px"></div></div>
      <div><div class="csw-out" data-o></div><div class="csw-note">Each pixel stores one binary code. Row 1 of your image:</div><div class="csw-code" data-row style="white-space:normal;padding:6px 10px;word-break:break-all"></div></div></div>`;
    function reset() { pix = Array(W0 * H0).fill(0); }
    function draw() {
      const n = 1 << depth;
      q(root, '[data-pal]').innerHTML = PAL8.slice(0, n).map((c, i) => `<button data-c="${i}" class="${i === cur ? 'on' : ''}" style="background:${c}" title="code ${pad(i.toString(2), depth)}" aria-label="colour code ${pad(i.toString(2), depth)}"></button>`).join('');
      const g = q(root, '[data-g]');
      g.style.gridTemplateColumns = `repeat(${W0}, 1fr)`;
      g.innerHTML = pix.map((p, i) => `<div data-p="${i}" style="background:${PAL8[p]}"></div>`).join('');
      const bits = W0 * H0 * depth;
      q(root, '[data-o]').innerHTML = `<div><b>${n}</b> colours possible with ${depth} bit${depth > 1 ? 's' : ''} per pixel (2<sup>${depth}</sup> = ${n}).</div>
        <div style="margin-top:6px"><b>File size</b> = colour depth × height × width<br>= ${depth} × ${H0} × ${W0} = <b>${bits} bits</b> = ${bits / 8} bytes</div>
        <div class="csw-note">Higher resolution (more pixels) or more colour depth (more bits per pixel) → better quality but a bigger file. Real files also store <b>metadata</b> (width, height, colour depth…).</div>`;
      q(root, '[data-row]').textContent = pix.slice(0, W0).map(p => pad(p.toString(2), depth)).join(' ');
    }
    function paint(e) {
      const t = document.elementFromPoint(e.clientX, e.clientY);
      const c = t && t.closest && t.closest('[data-p]');
      if (c && root.contains(c)) { pix[Number(c.dataset.p)] = cur; c.style.background = PAL8[cur]; q(root, '[data-row]').textContent = pix.slice(0, W0).map(p => pad(p.toString(2), depth)).join(' '); }
    }
    root.addEventListener('pointerdown', (e) => { if (e.target.closest('[data-p]')) { down = true; paint(e); e.preventDefault(); } });
    root.addEventListener('pointermove', (e) => { if (down) paint(e); });
    window.addEventListener('pointerup', () => { down = false; });
    root.addEventListener('click', (e) => {
      const c = e.target.closest('[data-c]'); if (c) { cur = Number(c.dataset.c); draw(); }
      if (e.target.closest('[data-clear]')) { reset(); draw(); }
    });
    root.addEventListener('change', (e) => {
      if (e.target.matches('[data-res]')) { W0 = H0 = Number(e.target.value); reset(); }
      if (e.target.matches('[data-dep]')) { depth = Number(e.target.value); pix = pix.map(p => p % (1 << depth)); cur = Math.min(cur, (1 << depth) - 1); }
      draw();
    });
    reset(); for (let i = 0; i < 8; i++) { pix[i * 8 + i] = 1; pix[i * 8 + 7 - i] = 2; } draw();
  };

  /* ---------- 1.2 sound ---------- */
  W.sound = function (root) {
    root.innerHTML = head('Sampling sound', 'Interactive') + `
      <div class="csw-row"><label>Samples per wave <b data-v="sr"></b><br><input type="range" min="3" max="40" value="10" data-i="sr"></label>
      <label>Bit depth <b data-v="bd"></b> bits<br><input type="range" min="1" max="6" value="3" data-i="bd"></label></div>
      <svg viewBox="0 0 600 220" data-svg aria-label="An analogue sound wave and its samples"></svg>
      <div class="csw-out" data-o></div>
      <div class="csw-out"><b>File size calculator</b><div class="csw-row"><label>Sample rate <input type="number" value="44100" data-f="rate" style="width:100px"> Hz</label><label>Duration <input type="number" value="60" data-f="dur" style="width:80px"> s</label><label>Bit depth <input type="number" value="16" data-f="bits" style="width:70px"> bits</label></div><div data-fs></div></div>`;
    const f = (x) => Math.sin(x) * 0.7 + Math.sin(3 * x) * 0.25;
    function draw() {
      const sr = Number(q(root, '[data-i=sr]').value), bd = Number(q(root, '[data-i=bd]').value), L = 1 << bd;
      q(root, '[data-v=sr]').textContent = sr; q(root, '[data-v=bd]').textContent = bd;
      const X = (t) => 20 + t / (Math.PI * 2) * 560, Y = (y) => 110 - y * 90;
      let wave = ''; for (let i = 0; i <= 200; i++) { const t = i / 200 * Math.PI * 2; wave += (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(f(t)).toFixed(1); }
      let step = '', dots = '';
      const lv = (y) => Math.round((y + 1) / 2 * (L - 1)) / (L - 1) * 2 - 1;
      for (let k = 0; k < sr; k++) {
        const t0 = k / sr * Math.PI * 2, t1 = (k + 1) / sr * Math.PI * 2, y = lv(f(t0));
        step += (k ? 'L' : 'M') + X(t0).toFixed(1) + ' ' + Y(y).toFixed(1) + 'L' + X(t1).toFixed(1) + ' ' + Y(y).toFixed(1);
        dots += `<circle cx="${X(t0).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="3.5" fill="var(--w-a)"/>`;
      }
      let grid = ''; for (let k = 0; k < L && L <= 64; k++) { const y = Y(k / (L - 1) * 2 - 1); grid += `<line x1="20" x2="580" y1="${y}" y2="${y}" stroke="currentColor" opacity=".08"/>`; }
      q(root, '[data-svg]').innerHTML = grid + `<path d="${wave}" fill="none" stroke="var(--w-b)" stroke-width="2.5" opacity=".55"/><path d="${step}" fill="none" stroke="var(--w-a)" stroke-width="2.5"/>${dots}<text x="22" y="16" font-size="12" opacity=".7">blue = analogue sound · green = the stored samples</text>`;
      q(root, '[data-o]').innerHTML = `${sr} samples are taken across this wave, and each one is rounded to one of <b>${L}</b> levels (2<sup>${bd}</sup>). More samples per second (<b>sample rate</b>, Hz) and more bits per sample (<b>bit depth</b>) make the stored sound closer to the original — better quality — but the file gets bigger.`;
      const r = Number(q(root, '[data-f=rate]').value) || 0, d = Number(q(root, '[data-f=dur]').value) || 0, b = Number(q(root, '[data-f=bits]').value) || 0;
      q(root, '[data-fs]').innerHTML = `size = sample rate × duration × bit depth = ${fmt(r)} × ${fmt(d)} × ${fmt(b)} = ${sizeText(r * d * b)} <span class="csw-note">(one channel, 1 KB = 1,000 bytes)</span>`;
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.2 compression ---------- */
  W.compress = function (root) {
    root.innerHTML = head('Lossless vs lossy compression', 'Interactive') + `
      <div class="csw-two"><div><b>Lossless</b> — nothing is thrown away
        <div class="csw-row"><input type="text" value="AAAAAABBBCCCCCCCCD" data-s style="width:100%"></div><div class="csw-out" data-l></div>
        <div class="csw-note">This shows one simple idea (run-length encoding). You will not be asked to carry out a compression algorithm — only to explain the two types.</div></div>
      <div><b>Lossy</b> — some detail is removed for good
        <div class="csw-row"><label>Compression <input type="range" min="1" max="4" value="1" data-q></label></div><svg viewBox="0 0 160 160" data-img style="max-width:220px"></svg><div class="csw-out" data-o></div></div></div>`;
    const N = 16;
    const col = (x, y) => { const r = Math.round(120 + 110 * Math.sin(x / 3)), g = Math.round(100 + 90 * Math.cos(y / 4)), b = Math.round(150 + 80 * Math.sin((x + y) / 5)); return [r, g, b]; };
    function draw() {
      const s = q(root, '[data-s]').value;
      let enc = '', i = 0; while (i < s.length) { let j = i; while (j < s.length && s[j] === s[i]) j++; enc += (j - i) + s[i]; i = j; }
      q(root, '[data-l]').innerHTML = `<code>${esc(s)}</code> (${s.length} characters)<br>→ <code>${esc(enc)}</code> (${enc.length} characters)<br>Decompressing gives back <b>exactly</b> the original — essential for text, program code and spreadsheets.`;
      const k = [1, 2, 4, 8][Number(q(root, '[data-q]').value) - 1];
      let svg = '', blocks = new Set();
      for (let y = 0; y < N; y += k) for (let x = 0; x < N; x += k) {
        let r = 0, g = 0, b = 0, n = 0;
        for (let yy = y; yy < y + k; yy++) for (let xx = x; xx < x + k; xx++) { const c = col(xx, yy); r += c[0]; g += c[1]; b += c[2]; n++; }
        const c = [r / n, g / n, b / n].map(v => Math.round(v));
        blocks.add(c.join()); svg += `<rect x="${x * 10}" y="${y * 10}" width="${k * 10}" height="${k * 10}" fill="rgb(${c})"/>`;
      }
      q(root, '[data-img]').innerHTML = svg;
      const stored = (N / k) * (N / k);
      q(root, '[data-o]').innerHTML = `Colour values stored: <b>${stored}</b> of ${N * N} (${Math.round(stored / (N * N) * 100)}%).<br>${k === 1 ? 'Original image.' : 'Neighbouring pixels have been merged — a smaller file, but the lost detail can never be recovered. Fine for photos, music and video streamed online.'}`;
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.3 topologies ---------- */
  W.topology = function (root) {
    const NODES = { star: { S: [300, 120], A: [120, 40], B: [480, 40], C: [80, 190], D: [520, 190], E: [300, 225] }, mesh: { A: [140, 50], B: [460, 50], C: [80, 180], D: [520, 180], E: [300, 225] } };
    const EDGES = { star: [['S', 'A'], ['S', 'B'], ['S', 'C'], ['S', 'D'], ['S', 'E']], mesh: [['A', 'B'], ['A', 'C'], ['A', 'D'], ['A', 'E'], ['B', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'D'], ['C', 'E'], ['D', 'E']] };
    let mode = 'star', broken = new Set(), down = new Set();
    root.innerHTML = head('Star vs mesh: what happens when something breaks?', 'Interactive') + `
      <div class="csw-row"><button data-m="star" class="pri">Star</button><button data-m="mesh">Mesh</button><button data-r>Repair all</button><span class="csw-note">Click a cable or a device to break it.</span></div>
      <svg viewBox="0 0 600 260" data-svg></svg><div class="csw-out csw-msg" data-o></div>`;
    function reach() {
      const N = NODES[mode], E = EDGES[mode].filter(e => !broken.has(e.join('')) && !down.has(e[0]) && !down.has(e[1]));
      const start = 'A'; const seen = new Set(down.has(start) ? [] : [start]); const st = [...seen];
      while (st.length) { const n = st.pop(); E.forEach(([a, b]) => { const o = a === n ? b : b === n ? a : null; if (o && !seen.has(o)) { seen.add(o); st.push(o); } }); }
      return Object.keys(N).filter(n => n !== 'S' && n !== start && !seen.has(n) && !down.has(n));
    }
    function draw() {
      const N = NODES[mode];
      const cut = reach();
      let s = '';
      EDGES[mode].forEach(e => { const [a, b] = e; const k = e.join(''); const bad = broken.has(k) || down.has(a) || down.has(b); s += `<line data-e="${k}" x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" stroke="${bad ? 'var(--w-bad)' : 'var(--w-a)'}" stroke-width="6" stroke-dasharray="${bad ? '8 7' : ''}" style="cursor:pointer" opacity="${bad ? .7 : .85}"/>`; });
      Object.keys(N).forEach(n => {
        const [x, y] = N[n]; const isSw = n === 'S'; const off = down.has(n); const lost = cut.includes(n);
        s += `<g data-n="${n}" style="cursor:pointer"><rect x="${x - (isSw ? 46 : 36)}" y="${y - 20}" width="${isSw ? 92 : 72}" height="40" rx="10" fill="${off ? 'var(--w-bad)' : lost ? 'var(--w-warn)' : 'var(--surface,#fff)'}" stroke="currentColor" stroke-width="2"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="700" ${off ? 'fill="#fff"' : ''}>${isSw ? 'Switch' : 'PC ' + n}</text></g>`;
      });
      q(root, '[data-svg]').innerHTML = s;
      let msg;
      if (!broken.size && !down.size) msg = mode === 'star' ? '<b>Star:</b> every device has its own cable to a central switch. The switch sends data only to the device it is addressed to.' : '<b>Mesh:</b> devices connect to each other, often with many routes between them (here every device connects to every other — a full mesh).';
      else if (down.has('A')) msg = 'PC A is the one we are checking from — repair it to test the others.';
      else msg = cut.length ? `PC A can no longer reach: <b>${cut.map(n => 'PC ' + n).join(', ')}</b>.` : '<span class="csw-chip ok">Still working</span> PC A can still reach every working device.';
      if (mode === 'star' && down.has('S')) msg += ' <span class="csw-chip bad">The central switch failed, so the whole network is down</span> — the main drawback of a star.';
      else if (mode === 'star' && (broken.size || down.size)) msg += ' A single broken cable only cuts off <b>one</b> device in a star.';
      if (mode === 'mesh' && (broken.size || down.size)) msg += ' In a mesh, data can take <b>another route</b>, so one failure rarely stops the network — but all those cables cost more.';
      q(root, '[data-o]').innerHTML = msg;
      qa(root, '[data-m]').forEach(b => b.classList.toggle('pri', b.dataset.m === mode));
    }
    root.addEventListener('click', (e) => {
      const m = e.target.closest('[data-m]'); if (m) { mode = m.dataset.m; broken.clear(); down.clear(); }
      if (e.target.closest('[data-r]')) { broken.clear(); down.clear(); }
      const ed = e.target.closest('[data-e]'); if (ed) { const k = ed.dataset.e; broken.has(k) ? broken.delete(k) : broken.add(k); }
      const nd = e.target.closest('[data-n]'); if (nd) { const k = nd.dataset.n; down.has(k) ? down.delete(k) : down.add(k); }
      draw();
    });
    draw();
  };

  /* generic step-through diagram: steps = [{h: [ids to highlight], t: 'text'}] over an SVG with elements data-k="id" */
  function stepper(root, title, svg, steps, kind) {
    let i = 0;
    root.innerHTML = head(title, kind || 'Step through') + `<div class="csw-scroll">${svg}</div><div class="csw-out csw-msg" data-o></div><div class="csw-row"><button data-b>◀ Back</button><button class="pri" data-n>Next ▶</button><span class="csw-note" data-c></span></div>`;
    function draw() {
      qa(root, '[data-k]').forEach(e => { const on = steps[i].h.includes(e.dataset.k); e.style.opacity = on ? 1 : .28; e.style.transition = 'opacity .3s'; });
      q(root, '[data-o]').innerHTML = steps[i].t;
      q(root, '[data-c]').textContent = (i + 1) + ' / ' + steps.length;
      q(root, '[data-b]').disabled = i === 0; q(root, '[data-n]').disabled = i === steps.length - 1;
    }
    root.addEventListener('click', (e) => { if (e.target.closest('[data-n]') && i < steps.length - 1) i++; if (e.target.closest('[data-b]') && i > 0) i--; draw(); });
    draw();
  }
  const box = (k, x, y, w, h, t, sub) => `<g data-k="${k}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="var(--surface,#fff)" stroke="var(--w-a)" stroke-width="2.5"/><text x="${x + w / 2}" y="${y + h / 2 + (sub ? -4 : 5)}" text-anchor="middle" font-size="14" font-weight="800">${t}</text>${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle" font-size="11" opacity=".75">${sub}</text>` : ''}</g>`;
  const arrowLine = (k, x1, y1, x2, y2, label, ly) => `<g data-k="${k}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--w-b)" stroke-width="3" marker-end="url(#csw-ah)"/>${label ? `<text x="${(x1 + x2) / 2}" y="${ly != null ? ly : (y1 + y2) / 2 - 7}" text-anchor="middle" font-size="12" font-weight="700">${label}</text>` : ''}</g>`;
  const defs = '<defs><marker id="csw-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--w-b)"/></marker></defs>';

  W.dns = function (root) {
    const svg = `<svg viewBox="0 0 640 250" style="min-width:520px">${defs}
      ${box('client', 20, 95, 150, 60, 'Your browser', 'client')}${box('dns', 245, 10, 150, 60, 'DNS server', 'name → IP lookup')}${box('dns2', 470, 10, 150, 60, 'Another DNS server', 'if not found')}${box('web', 470, 170, 150, 60, 'Web server', '93.184.216.34')}
      ${arrowLine('q1', 150, 100, 245, 55, 'www.example.com?', 62)}${arrowLine('q2', 395, 35, 470, 35, 'not known?', 25)}${arrowLine('a2', 470, 55, 395, 55, '', 0)}${arrowLine('a1', 245, 68, 160, 112, 'IP address', 105)}
      ${arrowLine('req', 170, 140, 470, 195, 'HTTP request to the IP', 160)}${arrowLine('page', 470, 215, 170, 150, 'web page', 205)}</svg>`;
    stepper(root, 'How DNS turns a URL into an IP address', svg, [
      { h: ['client'], t: 'You type <b>www.example.com</b>. Computers on the internet are found by <b>IP address</b>, not by name, so the name must be converted first.' },
      { h: ['client', 'q1', 'dns'], t: 'The browser sends the domain name to a <b>Domain Name Server</b>. The Domain Name Service (DNS) is made up of many of these servers around the world.' },
      { h: ['dns', 'q2', 'dns2', 'a2'], t: 'The DNS server looks the name up in its records. If it does not have it, it <b>passes the request on</b> to another DNS server, which sends the answer back.' },
      { h: ['dns', 'a1', 'client'], t: 'The DNS server returns the <b>IP address</b> to the browser (or an error if the domain does not exist).' },
      { h: ['client', 'req', 'web'], t: 'The browser now sends a request (HTTP / HTTPS) to the <b>web server</b> at that IP address. The web server is a computer that stores and serves web pages — the browser is the <b>client</b>.' },
      { h: ['web', 'page', 'client'], t: 'The web server sends the page back and the browser displays it. This is the <b>client–server</b> model: clients request services, servers provide them.' }
    ], 'Animation');
  };

  W.layers = function (root) {
    const L = [['Application', 'HTTP, FTP, SMTP… — the data the program sends', '#2563eb'], ['Transport', 'TCP splits data into packets, numbers them, checks they arrive', '#16a34a'], ['Internet', 'IP adds the source and destination IP addresses (routing)', '#d97706'], ['Link', 'the hardware sends it: Ethernet / Wi-Fi, MAC addresses', '#7c3aed']];
    const svg = `<svg viewBox="0 0 640 250" style="min-width:520px">${L.map((l, i) => `<g data-k="L${i}"><rect x="10" y="${10 + i * 58}" width="250" height="48" rx="10" fill="${l[2]}" fill-opacity=".14" stroke="${l[2]}" stroke-width="2"/><text x="24" y="${32 + i * 58}" font-size="14" font-weight="800">${l[0]}</text><text x="24" y="${48 + i * 58}" font-size="10.5" opacity=".8">${l[1].slice(0, 46)}</text></g>`).join('')}
      ${L.map((l, i) => `<g data-k="P${i}">${L.slice(0, i + 1).reverse().map((x, j) => `<rect x="${300 + j * 46}" y="${16 + i * 58}" width="46" height="34" rx="6" fill="${x[2]}" opacity=".85"/><text x="${323 + j * 46}" y="${38 + i * 58}" text-anchor="middle" font-size="10" fill="#fff" font-weight="800">${j === i ? 'DATA' : 'hdr'}</text>`).join('')}</g>`).join('')}</svg>`;
    stepper(root, 'Layers: each one does one job', svg, [
      { h: ['L0', 'P0'], t: 'Protocols are organised into <b>layers</b>. Each layer has a specific job and only talks to the layers directly above and below it. (OCR does not need you to name the layers — this is the 4-layer TCP/IP model as a teaching example.)' },
      { h: ['L0', 'L1', 'P1'], t: 'Going down the layers, each one adds its own information (a <b>header</b>) to the data — eg the transport layer numbers the packets.' },
      { h: ['L0', 'L1', 'L2', 'P2'], t: 'The internet layer adds the IP addresses so routers can send each packet the right way.' },
      { h: ['L0', 'L1', 'L2', 'L3', 'P3'], t: 'The link layer sends it over the physical connection. At the other end the headers are removed layer by layer.' },
      { h: ['L0', 'L1', 'L2', 'L3'], t: '<b>Why layers?</b> Each layer can be developed, changed or fixed <b>independently</b> (eg swap Wi-Fi for Ethernet without changing the browser); it breaks a complex problem into manageable parts; and hardware/software from <b>different manufacturers</b> can work together because they follow the same standards.' }
    ]);
  };

  /* ---------- 1.3 / 1.4 encryption ---------- */
  W.cipher = function (root) {
    root.innerHTML = head('Encryption: scrambling data with a key', 'Interactive') + `
      <div class="csw-row"><input type="text" value="MEET AT NOON" data-p style="width:240px"><label>Key (shift) <input type="range" min="1" max="25" value="3" data-k> <b data-kv></b></label></div>
      <div class="csw-out" data-o></div>
      <div class="csw-note">This is a Caesar cipher — far too weak for real use, but it shows the principle. Real encryption (eg the HTTPS padlock) uses huge keys.</div>`;
    const sh = (s, k) => s.replace(/[a-z]/gi, ch => { const b = ch <= 'Z' ? 65 : 97; return String.fromCharCode((ch.charCodeAt(0) - b + k + 26) % 26 + b); });
    function draw() {
      const p = q(root, '[data-p]').value, k = Number(q(root, '[data-k]').value);
      q(root, '[data-kv]').textContent = k;
      const c = sh(p, k);
      q(root, '[data-o]').innerHTML = `Plaintext: <code>${esc(p)}</code><br>Ciphertext (what a hacker intercepting the data sees): <code class="csw-big">${esc(c)}</code><br>Decrypted with the key: <code>${esc(sh(c, -k))}</code><br>Encryption does <b>not</b> stop data being intercepted — it makes intercepted data <b>meaningless</b> without the key.`;
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.4 SQL injection ---------- */
  W.sqli = function (root) {
    root.innerHTML = head('SQL injection: how it works and how to stop it', 'Interactive') + `
      <div class="csw-two"><div><label>Username<br><input type="text" value="admin' --" data-u style="width:100%"></label><br><label>Password<br><input type="text" value="anything" data-p style="width:100%"></label>
      <div class="csw-row"><label><input type="checkbox" data-safe> Protect the input (validation / parameterised query)</label></div></div>
      <div><div class="csw-note">The query the website builds:</div><div class="csw-code" data-q style="white-space:pre-wrap;padding:8px 10px"></div><div class="csw-out" data-o></div></div></div>
      <div class="csw-row"><button data-ex="1">Try: admin' --</button><button data-ex="2">Try: ' OR '1'='1</button><button data-ex="3">Normal login</button></div>`;
    const USERS = { admin: 'Tr0ub4dor!', sam: 'sunflower9' };
    function draw() {
      const u = q(root, '[data-u]').value, p = q(root, '[data-p]').value, safe = q(root, '[data-safe]').checked;
      const sql = `SELECT * FROM users\nWHERE username = '${u}'\nAND password = '${p}'`;
      q(root, '[data-q]').textContent = sql;
      let out;
      const injected = /'/.test(u + p);
      if (safe && injected) out = '<span class="csw-chip ok">Blocked</span> The input is treated only as text (or rejected because it contains <code>\'</code>), so it can never change the SQL command.';
      else if (/'\s*--/.test(u)) out = `<span class="csw-chip bad">Hacked</span> The <code>'</code> ends the username early and <code>--</code> turns the rest of the query into a <b>comment</b> — the password check is never run! Logged in as <b>${esc(u.split("'")[0] || '?')}</b>.`;
      else if (/'\s*OR\s*'?(\w+)'?\s*=\s*'?\1/i.test(u + ' ' + p)) out = '<span class="csw-chip bad">Hacked</span> <code>OR \'1\'=\'1\'</code> is always TRUE, so the WHERE condition is true for every row — the database returns all the users and the attacker is logged in.';
      else if (USERS[u] === p) out = '<span class="csw-chip ok">Logged in</span> Correct username and password.';
      else out = '<span class="csw-chip warn">Rejected</span> Wrong username or password.';
      q(root, '[data-o]').innerHTML = out;
    }
    root.addEventListener('input', draw);
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ex]'); if (!b) return;
      const ex = { 1: ["admin' --", 'anything'], 2: ["' OR '1'='1", "' OR '1'='1"], 3: ['sam', 'sunflower9'] }[b.dataset.ex];
      q(root, '[data-u]').value = ex[0]; q(root, '[data-p]').value = ex[1]; draw();
    });
    draw();
  };

  /* ---------- 1.4 brute force ---------- */
  W.brute = function (root) {
    root.innerHTML = head('Brute-force attacks: why long passwords matter', 'Interactive') + `
      <div class="csw-row"><input type="text" value="cat123" data-p style="width:220px"></div><div class="csw-out" data-o></div>
      <div class="csw-note">Assumption for this demo: an attacker's computer tries 10 billion guesses a second against a stolen password file. That figure is an assumption to compare passwords, not a measured speed.</div>`;
    function draw() {
      const p = q(root, '[data-p]').value;
      let set = 0, parts = [];
      if (/[a-z]/.test(p)) { set += 26; parts.push('lower case (26)'); }
      if (/[A-Z]/.test(p)) { set += 26; parts.push('upper case (26)'); }
      if (/[0-9]/.test(p)) { set += 10; parts.push('digits (10)'); }
      if (/[^a-zA-Z0-9]/.test(p)) { set += 33; parts.push('symbols (about 33)'); }
      const n = p.length;
      const log10 = n * Math.log10(Math.max(set, 1));
      const secs = Math.pow(10, log10 - 10);
      const human = secs < 1 ? 'less than a second' : secs < 3600 ? fmt(secs / 60) + ' minutes' : secs < 86400 * 365 ? fmt(secs / 86400) + ' days' : log10 < 30 ? fmt(secs / (86400 * 365)) + ' years' : 'far longer than the age of the universe';
      q(root, '[data-o]').innerHTML = n ? `Characters used: ${parts.join(' + ') || '—'} = <b>${set}</b> possible characters.<br>Combinations = ${set}<sup>${n}</sup> ≈ <b>10<sup>${log10.toFixed(1)}</sup></b><br>Time to try them all: <b>${human}</b>.<br>A brute-force attack tries every possible combination. Defences: long passwords with mixed character types, <b>locking the account after a few wrong attempts</b>, and CAPTCHA.` : 'Type a password.';
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 1.5 defragmentation ---------- */
  W.defrag = function (root) {
    const START = ['A', 'B', 'A', '.', 'C', 'B', 'A', '.', 'C', '.', 'B', 'A', '.', 'C', '.', '.'];
    let d = START.slice();
    const C = { A: '#2563eb', B: '#dc2626', C: '#16a34a', '.': 'transparent' };
    root.innerHTML = head('Defragmentation', 'Interactive') + `<div class="csw-mem" data-d style="grid-template-columns:repeat(8,minmax(0,1fr))"></div>
      <div class="csw-row"><button class="pri" data-go>Defragment</button><button data-r>Fragment again</button></div><div class="csw-out csw-msg" data-o></div>`;
    function frag(x) { let n = 0; ['A', 'B', 'C'].forEach(f => { const idx = x.map((v, i) => v === f ? i : -1).filter(i => i >= 0); for (let i = 1; i < idx.length; i++) if (idx[i] !== idx[i - 1] + 1) n++; }); return n; }
    function draw(msg) {
      q(root, '[data-d]').innerHTML = d.map((v, i) => `<div style="background:${C[v]};color:${v === '.' ? 'inherit' : '#fff'}"><small style="color:inherit;opacity:.8">block ${i}</small>${v === '.' ? 'free' : 'File ' + v}</div>`).join('');
      q(root, '[data-o]').innerHTML = msg || `Over time, files on a <b>magnetic hard disk</b> are saved wherever there is space, so they get split into pieces (<b>fragmented</b>). Gaps between pieces: <b>${frag(d)}</b>. The read/write head has to keep moving to find every piece, which slows file access.`;
    }
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-go]')) { const files = d.filter(v => v !== '.').sort(); d = files.concat(Array(d.length - files.length).fill('.')); draw('<span class="csw-chip ok">Defragmented</span> The pieces of each file are moved next to each other and the free space is collected together. Files can be read in one go, so access is faster. (Not needed for solid state drives — they have no moving parts, and the extra writes would wear them out.)'); }
      if (e.target.closest('[data-r]')) { d = START.slice(); draw(); }
    });
    draw();
  };

  /* ---------- 2.1 searching ---------- */
  W.search = function (root) {
    let steps = [], i = 0;
    root.innerHTML = head('Linear search vs binary search', 'Interactive') + `
      <div class="csw-row"><label>Data <input type="text" value="3, 8, 12, 15, 21, 27, 33, 40, 46" data-a style="width:260px"></label><label>Find <input type="number" value="33" data-t style="width:70px"></label>
      <select data-m><option value="bin">Binary search</option><option value="lin">Linear search</option></select><button class="pri" data-go>Start</button></div>
      <div class="csw-arrs"><div class="csw-arr" data-v></div></div><div class="csw-out csw-msg" data-o></div>
      <div class="csw-row"><button data-b>◀ Back</button><button class="pri" data-n>Next ▶</button><span class="csw-note" data-c></span></div>`;
    function build() {
      const a = q(root, '[data-a]').value.split(/[ ,]+/).filter(Boolean).map(Number), t = Number(q(root, '[data-t]').value), m = q(root, '[data-m]').value;
      steps = [];
      if (m === 'lin') {
        let k = 0;
        for (; k < a.length; k++) {
          const hit = a[k] === t;
          steps.push({ a, cmp: k, hit: hit ? k : -1, out: [], t: `Compare item ${k} (<b>${a[k]}</b>) with ${t}: ${hit ? '<span class="csw-chip ok">found!</span> after ' + (k + 1) + ' comparison' + (k ? 's' : '') + '.' : 'not equal, move to the next item.'}` });
          if (hit) break;
        }
        if (k === a.length) steps.push({ a, cmp: -1, hit: -1, out: [], t: `Reached the end of the list: <b>${t}</b> is not in the list (${a.length} comparisons). Linear search works on <b>unsorted</b> data too, but may check every item.` });
      } else {
        const sorted = a.every((x, i) => !i || a[i - 1] <= x);
        if (!sorted) { steps.push({ a, cmp: -1, hit: -1, out: [], t: '<span class="csw-chip bad">Binary search needs sorted data.</span> This list is not in order — sort it first, or use a linear search.' }); }
        else {
          let lo = 0, hi = a.length - 1, n = 0;
          while (lo <= hi) {
            const mid = Math.floor((lo + hi) / 2); n++;
            const out = a.map((_, k) => k < lo || k > hi ? k : -1).filter(k => k >= 0);
            if (a[mid] === t) { steps.push({ a, cmp: mid, hit: mid, out, t: `Middle item (position ${mid}) is <b>${a[mid]}</b> = ${t}: <span class="csw-chip ok">found</span> after ${n} comparison${n > 1 ? 's' : ''}.` }); break; }
            steps.push({ a, cmp: mid, hit: -1, out, t: `Middle item is position (${lo} + ${hi}) DIV 2 = ${mid}: <b>${a[mid]}</b>. ${t} is ${t < a[mid] ? 'smaller, so discard the middle item and everything to its <b>right</b>' : 'bigger, so discard the middle item and everything to its <b>left</b>'}.` });
            if (t < a[mid]) hi = mid - 1; else lo = mid + 1;
          }
          if (lo > hi) steps.push({ a, cmp: -1, hit: -1, out: a.map((_, k) => k), t: `No items left: <b>${t}</b> is not in the list (${n} comparisons). Each comparison halves the remaining items — much faster than linear search on big sorted lists.` });
        }
      }
      i = 0; draw();
    }
    function draw() {
      const s = steps[i]; if (!s) return;
      q(root, '[data-v]').innerHTML = s.a.map((x, k) => `<div class="${k === s.hit ? 'hit' : k === s.cmp ? 'cmp' : s.out.includes(k) ? 'out' : ''}"><small>${k}</small>${x}</div>`).join('');
      q(root, '[data-o]').innerHTML = s.t; q(root, '[data-c]').textContent = 'Step ' + (i + 1) + ' / ' + steps.length;
      q(root, '[data-b]').disabled = !i; q(root, '[data-n]').disabled = i >= steps.length - 1;
    }
    root.addEventListener('click', (e) => { if (e.target.closest('[data-go]')) build(); if (e.target.closest('[data-n]') && i < steps.length - 1) { i++; draw(); } if (e.target.closest('[data-b]') && i) { i--; draw(); } });
    build();
  };

  /* ---------- 2.1 sorting ---------- */
  W.sort = function (root, o) {
    let steps = [], i = 0;
    root.innerHTML = head('Bubble sort, insertion sort and merge sort', 'Interactive') + `
      <div class="csw-row"><label>Data <input type="text" value="${(o && o.data) || '5, 1, 4, 2, 8, 3'}" data-a style="width:200px"></label>
      <select data-m><option value="bubble">Bubble sort</option><option value="insertion">Insertion sort</option><option value="merge">Merge sort</option></select><button class="pri" data-go>Start</button></div>
      <div class="csw-arrs" data-v></div><div class="csw-out csw-msg" data-o></div>
      <div class="csw-row"><button data-b>◀ Back</button><button class="pri" data-n>Next ▶</button><button data-end>Skip to end</button><span class="csw-note" data-c></span></div>`;
    function build() {
      const a = q(root, '[data-a]').value.split(/[ ,]+/).filter(Boolean).map(x => isNaN(Number(x)) ? x : Number(x)).slice(0, 12), m = q(root, '[data-m]').value;
      steps = [];
      const snap = (rows, t) => steps.push({ rows: rows.map(r => ({ v: r.v.slice(), c: r.c || {} })), t });
      if (m === 'bubble') {
        const x = a.slice(); let n = x.length, pass = 0, sorted = 0;
        snap([{ v: x }], 'Bubble sort compares <b>adjacent</b> pairs and swaps them if they are in the wrong order. After each pass, the largest remaining item has “bubbled” to the end.');
        let swapped = true;
        while (swapped) {
          swapped = false; pass++;
          for (let k = 0; k < n - 1 - sorted; k++) {
            const c = {}; c[k] = 'cmp'; c[k + 1] = 'cmp'; for (let z = n - sorted; z < n; z++) c[z] = 'done';
            if (x[k] > x[k + 1]) { [x[k], x[k + 1]] = [x[k + 1], x[k]]; const c2 = Object.assign({}, c); c2[k] = 'sw'; c2[k + 1] = 'sw'; snap([{ v: x, c: c2 }], `Pass ${pass}: ${x[k + 1]} > ${x[k]}, so <b>swap</b> them.`); swapped = true; }
            else snap([{ v: x, c }], `Pass ${pass}: compare ${x[k]} and ${x[k + 1]} — already in order, no swap.`);
          }
          sorted++;
          const c = {}; for (let z = n - sorted; z < n; z++) c[z] = 'done';
          snap([{ v: x, c }], swapped ? `End of pass ${pass}: ${x[n - sorted]} is now in its final place.` : `Pass ${pass} made <b>no swaps</b>, so the list is sorted and the algorithm stops.`);
        }
      } else if (m === 'insertion') {
        const x = a.slice();
        snap([{ v: x, c: { 0: 'done' } }], 'Insertion sort builds a <b>sorted part</b> on the left (blue). The first item on its own is already “sorted”.');
        for (let k = 1; k < x.length; k++) {
          const item = x[k]; let j = k - 1;
          const c0 = {}; for (let z = 0; z < k; z++) c0[z] = 'done'; c0[k] = 'cmp';
          snap([{ v: x, c: c0 }], `Take the next item, <b>${item}</b>, and insert it into the correct place in the sorted part.`);
          while (j >= 0 && x[j] > item) { x[j + 1] = x[j]; j--; }
          x[j + 1] = item;
          const c = {}; for (let z = 0; z <= k; z++) c[z] = 'done'; c[j + 1] = 'sw';
          snap([{ v: x, c }], `${item} moves left past every bigger item and is inserted at position ${j + 1}. The sorted part now has ${k + 1} items.`);
        }
        snap([{ v: x, c: Object.fromEntries(x.map((_, z) => [z, 'done'])) }], 'Every item has been inserted — the list is sorted.');
      } else {
        let groups = [a.slice()];
        snap([{ v: a }], 'Merge sort first <b>splits</b> the list in half again and again, until every list has just one item.');
        while (groups.some(g => g.length > 1)) {
          groups = groups.flatMap(g => g.length > 1 ? [g.slice(0, Math.ceil(g.length / 2)), g.slice(Math.ceil(g.length / 2))] : [g]);
          snap(groups.map(g => ({ v: g })), 'Split: ' + groups.map(g => '[' + g.join(', ') + ']').join(' '));
        }
        while (groups.length > 1) {
          const next = [];
          for (let k = 0; k < groups.length; k += 2) {
            if (k + 1 >= groups.length) { next.push(groups[k]); continue; }
            const L = groups[k], R = groups[k + 1], out = []; let l = 0, r = 0;
            while (l < L.length && r < R.length) out.push(L[l] <= R[r] ? L[l++] : R[r++]);
            next.push(out.concat(L.slice(l), R.slice(r)));
          }
          groups = next;
          snap(groups.map(g => ({ v: g, c: Object.fromEntries(g.map((_, z) => [z, 'done'])) })), 'Merge pairs of lists: compare the <b>first item of each</b> list, take the smaller one, repeat. Result: ' + groups.map(g => '[' + g.join(', ') + ']').join(' '));
        }
        snap([{ v: groups[0], c: Object.fromEntries(groups[0].map((_, z) => [z, 'done'])) }], 'One list remains, and it is sorted. Merge sort is efficient on large lists but uses more memory (it makes new lists).');
      }
      i = 0; draw();
    }
    function draw() {
      const s = steps[i]; if (!s) return;
      q(root, '[data-v]').innerHTML = `<div class="csw-row" style="gap:14px">${s.rows.map(r => `<div class="csw-arr">${r.v.map((x, k) => `<div class="${r.c[k] || ''}"><small>${k}</small>${esc(x)}</div>`).join('')}</div>`).join('')}</div>`;
      q(root, '[data-o]').innerHTML = s.t; q(root, '[data-c]').textContent = 'Step ' + (i + 1) + ' / ' + steps.length;
      q(root, '[data-b]').disabled = !i; q(root, '[data-n]').disabled = i >= steps.length - 1;
    }
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-go]')) build();
      if (e.target.closest('[data-n]') && i < steps.length - 1) { i++; draw(); }
      if (e.target.closest('[data-b]') && i) { i--; draw(); }
      if (e.target.closest('[data-end]')) { i = steps.length - 1; draw(); }
    });
    root.addEventListener('change', (e) => { if (e.target.matches('[data-m]')) build(); });
    build();
  };

  /* ---------- 2.1 trace tables ---------- */
  const TRACES = {
    sum: { title: 'A count-controlled loop', vars: ['total', 'i'], code: ['total = 0', 'for i = 1 to 4', '    total = total + i', 'next i', 'print(total)'],
      run() { const r = []; let total = 0; r.push([1, { total }]); for (let i = 1; i <= 4; i++) { r.push([2, { i }]); total += i; r.push([3, { total }]); r.push([4, {}]); } r.push([5, {}, String(total)]); return r; } },
    halve: { title: 'A condition-controlled loop', vars: ['x', 'count'], code: ['x = 50', 'count = 0', 'while x > 5', '    x = x DIV 2', '    count = count + 1', 'endwhile', 'print(count)'],
      run() { const r = []; let x = 50, count = 0; r.push([1, { x }]); r.push([2, { count }]); while (x > 5) { r.push([3, {}]); x = Math.floor(x / 2); r.push([4, { x }]); count++; r.push([5, { count }]); } r.push([3, {}]); r.push([7, {}, String(count)]); return r; } },
    max: { title: 'Selection inside a loop', vars: ['highest', 'k'], code: ['scores = [12, 31, 7, 31, 19]', 'highest = scores[0]', 'for k = 1 to 4', '    if scores[k] > highest then', '        highest = scores[k]', '    endif', 'next k', 'print(highest)'],
      run() { const s = [12, 31, 7, 31, 19], r = []; let h = s[0]; r.push([1, {}]); r.push([2, { highest: h }]); for (let k = 1; k <= 4; k++) { r.push([3, { k }]); r.push([4, {}]); if (s[k] > h) { h = s[k]; r.push([5, { highest: h }]); } r.push([7, {}]); } r.push([8, {}, String(h)]); return r; } }
  };
  W.trace = function (root, o) {
    let key = (o && o.p) || 'sum', rows = [], i = 0;
    root.innerHTML = head('Trace table: run the code one line at a time', 'Interactive') + `
      <div class="csw-row"><select data-p>${Object.keys(TRACES).map(k => `<option value="${k}"${k === key ? ' selected' : ''}>${TRACES[k].title}</option>`).join('')}</select></div>
      <div class="csw-two"><div class="csw-code" data-code></div><div class="csw-scroll"><table data-t></table></div></div>
      <div class="csw-row"><button data-b>◀ Back</button><button class="pri" data-n>Run next line ▶</button><button data-r>Restart</button><span class="csw-note" data-c></span></div>
      <div class="csw-note">Exam rule: write a new row whenever a variable changes or something is output. You do not have to write unchanged values again.</div>`;
    function load() { rows = TRACES[key].run(); i = 0; draw(); }
    function draw() {
      const T = TRACES[key];
      const ln = i ? rows[i - 1][0] : 0;
      q(root, '[data-code]').innerHTML = T.code.map((c, k) => `<div class="${k + 1 === ln ? 'on' : ''}"><b>${pad(k + 1, 2)}</b>${esc(c)}</div>`).join('');
      const shown = rows.slice(0, i).filter(r => Object.keys(r[1]).length || r[2] != null);
      q(root, '[data-t]').innerHTML = `<tr><th>Line</th>${T.vars.map(v => `<th>${v}</th>`).join('')}<th>Output</th></tr>` + shown.map((r, k) => `<tr class="${k === shown.length - 1 && (Object.keys(rows[i - 1][1]).length || rows[i - 1][2] != null) ? 'on' : ''}"><td>${pad(r[0], 2)}</td>${T.vars.map(v => `<td>${r[1][v] != null ? r[1][v] : ''}</td>`).join('')}<td>${r[2] || ''}</td></tr>`).join('');
      q(root, '[data-c]').textContent = i >= rows.length ? 'Finished' : 'Line ' + (rows[i] ? rows[i][0] : '') + ' runs next';
      q(root, '[data-b]').disabled = !i; q(root, '[data-n]').disabled = i >= rows.length;
    }
    root.addEventListener('click', (e) => { if (e.target.closest('[data-n]') && i < rows.length) i++; if (e.target.closest('[data-b]') && i) i--; if (e.target.closest('[data-r]')) i = 0; draw(); });
    root.addEventListener('change', (e) => { if (e.target.matches('[data-p]')) { key = e.target.value; load(); } });
    load();
  };

  /* ---------- 2.1 flowchart runner ---------- */
  W.flow = function (root) {
    const svg = `<svg viewBox="0 0 520 470" style="min-width:420px">${defs}
      <g data-f="start"><rect x="190" y="10" width="140" height="40" rx="20" class="csw-gate"/><text x="260" y="35" text-anchor="middle" font-size="14" font-weight="700">Start</text></g>
      <g data-f="in"><path d="M195 80h150l-20 46h-150z" class="csw-gate"/><text x="260" y="108" text-anchor="middle" font-size="13" font-weight="700">INPUT mark</text></g>
      <g data-f="d1"><path d="M260 150l90 40-90 40-90-40z" class="csw-gate"/><text x="260" y="195" text-anchor="middle" font-size="13" font-weight="700">mark &gt;= 50?</text></g>
      <g data-f="pass"><path d="M370 250h120l-16 42h-120z" class="csw-gate"/><text x="427" y="276" text-anchor="middle" font-size="12" font-weight="700">OUTPUT "Pass"</text></g>
      <g data-f="fail"><path d="M50 250h120l-16 42h-120z" class="csw-gate"/><text x="107" y="276" text-anchor="middle" font-size="12" font-weight="700">OUTPUT "Fail"</text></g>
      <g data-f="end"><rect x="190" y="400" width="140" height="40" rx="20" class="csw-gate"/><text x="260" y="425" text-anchor="middle" font-size="14" font-weight="700">End</text></g>
      <g stroke="currentColor" stroke-width="2" fill="none" opacity=".75"><path d="M260 50v28" marker-end="url(#csw-ah)"/><path d="M260 126v22" marker-end="url(#csw-ah)"/><path d="M350 190h80v58" marker-end="url(#csw-ah)"/><path d="M170 190h-60v58" marker-end="url(#csw-ah)"/><path d="M427 292v70h-150v36" marker-end="url(#csw-ah)"/><path d="M107 292v70h150"/></g>
      <text x="380" y="182" font-size="12" font-weight="800">Yes / True</text><text x="98" y="182" font-size="12" font-weight="800">No / False</text></svg>`;
    root.innerHTML = head('Run a flowchart', 'Interactive') + `<div class="csw-row"><label>mark = <input type="number" value="62" data-m style="width:80px"></label><button class="pri" data-go>Run</button></div><div class="csw-scroll">${svg}</div><div class="csw-out csw-msg" data-o></div>
      <div class="csw-note">Symbols: rounded box = terminal (start/end) · parallelogram = input/output · rectangle = process · diamond = decision (two exits, labelled) · rectangle with double sides = sub program · arrows (lines) show the flow.</div>`;
    let tm = [];
    function run() {
      tm.forEach(clearTimeout); tm = [];
      const m = Number(q(root, '[data-m]').value), path = ['start', 'in', 'd1', m >= 50 ? 'pass' : 'fail', 'end'];
      qa(root, '[data-f]').forEach(g => { g.style.opacity = .3; });
      path.forEach((k, n) => tm.push(setTimeout(() => {
        const g = q(root, `[data-f="${k}"]`); if (g) { g.style.opacity = 1; g.style.transition = 'opacity .3s'; }
        q(root, '[data-o]').innerHTML = ['Start', `The input box stores ${m} in <code>mark</code>.`, `Decision: is ${m} &gt;= 50? <b>${m >= 50 ? 'Yes' : 'No'}</b> — follow the ${m >= 50 ? 'Yes' : 'No'} arrow.`, `Output: <b>${m >= 50 ? 'Pass' : 'Fail'}</b>`, 'End'][n];
      }, n * 700)));
    }
    root.addEventListener('click', (e) => { if (e.target.closest('[data-go]')) run(); });
    run();
  };

  /* ---------- 2.4 logic gates ---------- */
  const GATE = {
    and: (x, y) => `<path class="csw-gate" d="M${x} ${y - 25}h30a25 25 0 0 1 0 50h-30z"/><text x="${x + 22}" y="${y + 5}" text-anchor="middle" font-size="11" font-weight="800">AND</text>`,
    or: (x, y) => `<path class="csw-gate" d="M${x} ${y - 25}q40 0 60 25q-20 25 -60 25q14 -25 0 -50z"/><text x="${x + 27}" y="${y + 5}" text-anchor="middle" font-size="11" font-weight="800">OR</text>`,
    not: (x, y) => `<path class="csw-gate" d="M${x} ${y - 20}l40 20-40 20z"/><circle cx="${x + 46}" cy="${y}" r="6" class="csw-gate"/><text x="${x + 14}" y="${y + 4}" text-anchor="middle" font-size="9" font-weight="800">NOT</text>`
  };
  const CIRCUITS = {
    and: { label: 'P = A AND B', ins: ['A', 'B'], f: (v) => v.A && v.B, draw: (v, w) => `${w('A', 'M40 70H120', v.A)}${w('B', 'M40 130H120', v.B)}${GATE.and(120, 100)}${w('P', 'M175 100H260', v.A && v.B)}`, pins: { A: [40, 70], B: [40, 130] }, out: [260, 100] },
    or: { label: 'P = A OR B', ins: ['A', 'B'], f: (v) => v.A || v.B, draw: (v, w) => `${w('A', 'M40 70H125', v.A)}${w('B', 'M40 130H125', v.B)}${GATE.or(115, 100)}${w('P', 'M175 100H260', v.A || v.B)}`, pins: { A: [40, 70], B: [40, 130] }, out: [260, 100] },
    not: { label: 'P = NOT A', ins: ['A'], f: (v) => !v.A, draw: (v, w) => `${w('A', 'M40 100H130', v.A)}${GATE.not(130, 100)}${w('P', 'M182 100H260', !v.A)}`, pins: { A: [40, 100] }, out: [260, 100] },
    c1: { label: 'P = (A AND B) OR NOT C', ins: ['A', 'B', 'C'], f: (v) => (v.A && v.B) || !v.C,
      draw: (v, w) => `${w('A', 'M40 50H130', v.A)}${w('B', 'M40 100H130', v.B)}${GATE.and(130, 75)}${w('x', 'M185 75H230V105H262', v.A && v.B)}${w('C', 'M40 170H140', v.C)}${GATE.not(140, 170)}${w('y', 'M192 170H230V145H262', !v.C)}${GATE.or(252, 125)}${w('P', 'M312 125H380', (v.A && v.B) || !v.C)}`, pins: { A: [40, 50], B: [40, 100], C: [40, 170] }, out: [380, 125] },
    c2: { label: 'P = NOT (A OR B)', ins: ['A', 'B'], f: (v) => !(v.A || v.B), draw: (v, w) => `${w('A', 'M40 70H125', v.A)}${w('B', 'M40 130H125', v.B)}${GATE.or(115, 100)}${w('x', 'M175 100H210', v.A || v.B)}${GATE.not(210, 100)}${w('P', 'M262 100H330', !(v.A || v.B))}`, pins: { A: [40, 70], B: [40, 130] }, out: [330, 100] },
    c3: { label: 'P = (A OR B) AND C', ins: ['A', 'B', 'C'], f: (v) => (v.A || v.B) && v.C, draw: (v, w) => `${w('A', 'M40 50H125', v.A)}${w('B', 'M40 100H125', v.B)}${GATE.or(115, 75)}${w('x', 'M175 75H230V105H262', v.A || v.B)}${w('C', 'M40 170H230V145H262', v.C)}${GATE.and(262, 125)}${w('P', 'M317 125H380', (v.A || v.B) && v.C)}`, pins: { A: [40, 50], B: [40, 100], C: [40, 170] }, out: [380, 125] }
  };
  W.logic = function (root, o) {
    let key = (o && o.c) || 'c1', v = { A: 1, B: 0, C: 1 };
    root.innerHTML = head('Logic gate playground', 'Interactive') + `
      <div class="csw-row"><select data-c>${Object.keys(CIRCUITS).map(k => `<option value="${k}"${k === key ? ' selected' : ''}>${CIRCUITS[k].label}</option>`).join('')}</select><span class="csw-note">Click the inputs to switch them between 0 and 1.</span></div>
      <div class="csw-scroll"><svg viewBox="0 0 420 210" data-svg style="min-width:340px"></svg></div>
      <div class="csw-scroll"><table data-t style="max-width:420px"></table></div>`;
    function draw() {
      const C = CIRCUITS[key];
      const w = (id, d, on) => `<path d="${d}" class="csw-wire ${on ? 'csw-on' : 'csw-off'}"/>`;
      let s = C.draw(v, w);
      C.ins.forEach(n => { const [x, y] = C.pins[n]; s += `<g data-in="${n}" style="cursor:pointer"><rect x="${x - 34}" y="${y - 15}" width="34" height="30" rx="8" fill="${v[n] ? 'var(--w-ok)' : 'var(--surface,#fff)'}" stroke="currentColor" stroke-width="2"/><text x="${x - 17}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="800" ${v[n] ? 'fill="#fff"' : ''}>${v[n]}</text><text x="${x - 17}" y="${y - 20}" text-anchor="middle" font-size="12" font-weight="800">${n}</text></g>`; });
      const out = C.f(v) ? 1 : 0, [ox, oy] = C.out;
      s += `<rect x="${ox}" y="${oy - 16}" width="34" height="32" rx="16" fill="${out ? 'var(--w-ok)' : 'var(--surface,#fff)'}" stroke="currentColor" stroke-width="2"/><text x="${ox + 17}" y="${oy + 5}" text-anchor="middle" font-size="14" font-weight="800" ${out ? 'fill="#fff"' : ''}>${out}</text><text x="${ox + 17}" y="${oy - 22}" text-anchor="middle" font-size="12" font-weight="800">P</text>`;
      q(root, '[data-svg]').innerHTML = s;
      const n = C.ins.length, rows = [];
      for (let r = 0; r < (1 << n); r++) { const vv = {}; C.ins.forEach((name, k) => { vv[name] = (r >> (n - 1 - k)) & 1; }); rows.push(vv); }
      q(root, '[data-t]').innerHTML = `<tr>${C.ins.map(x => `<th>${x}</th>`).join('')}<th>P</th></tr>` + rows.map(vv => `<tr class="${C.ins.every(x => vv[x] === v[x]) ? 'on' : ''}">${C.ins.map(x => `<td>${vv[x]}</td>`).join('')}<td><b>${C.f(vv) ? 1 : 0}</b></td></tr>`).join('');
    }
    root.addEventListener('click', (e) => { const g = e.target.closest('[data-in]'); if (g) { v[g.dataset.in] ^= 1; draw(); } });
    root.addEventListener('change', (e) => { if (e.target.matches('[data-c]')) { key = e.target.value; draw(); } });
    draw();
  };

  /* ---------- 2.3 test data ---------- */
  W.testdata = function (root) {
    root.innerHTML = head('Choosing test data', 'Interactive') + `
      <p style="margin:0">A program asks for the number of <b>tickets</b> to buy. Valid: a <b>whole number from 1 to 10</b> inclusive.</p>
      <div class="csw-row"><input type="text" value="10" data-v style="width:120px"><button data-ex="5">5</button><button data-ex="1">1</button><button data-ex="10">10</button><button data-ex="11">11</button><button data-ex="0">0</button><button data-ex="four">four</button><button data-ex="2.5">2.5</button></div>
      <div class="csw-out" data-o></div>`;
    function draw() {
      const s = q(root, '[data-v]').value.trim();
      let type, acc, why;
      if (!s.length) { type = 'Erroneous'; acc = false; why = 'Nothing was entered — a presence check rejects it.'; }
      else if (!/^-?\d+$/.test(s)) { type = 'Erroneous'; acc = false; why = 'It is not a whole number — it is the <b>wrong data type</b>, so a type check rejects it.'; }
      else {
        const n = Number(s);
        if (n === 1 || n === 10) { type = 'Boundary'; acc = true; why = 'It is the right type and on the <b>very edge</b> of the valid range, so it should be accepted. (Some exam answers also count 0 and 11 — just outside the edge — as boundary tests that must be rejected.)'; }
        else if (n >= 2 && n <= 9) { type = 'Normal'; acc = true; why = 'Sensible data that the program should accept without problems.'; }
        else { type = 'Invalid'; acc = false; why = 'The right data type (a whole number) but <b>outside the range</b> 1–10, so a range check rejects it.'; }
      }
      q(root, '[data-o]').innerHTML = `<span class="csw-chip ${acc ? 'ok' : 'bad'}">${acc ? 'Accepted' : 'Rejected'}</span> Test type: <b>${type}</b><br>${why}`;
    }
    root.addEventListener('input', draw);
    root.addEventListener('click', (e) => { const b = e.target.closest('[data-ex]'); if (b) { q(root, '[data-v]').value = b.dataset.ex; draw(); } });
    draw();
  };

  /* ---------- 2.5 compiler vs interpreter ---------- */
  W.translate = function (root) {
    const CODE = ['name = "Ana"', 'print("Hello")', 'print(name)', 'prnt("Bye")', 'print("Done")'];
    root.innerHTML = head('Compiler vs interpreter', 'Interactive') + `<div class="csw-code">${CODE.map((c, k) => `<div><b>${k + 1}</b>${esc(c)}</div>`).join('')}</div>
      <div class="csw-row"><button class="pri" data-m="c">Compile, then run</button><button class="pri" data-m="i">Interpret</button><button data-fix>Fix line 4</button></div><div class="csw-out csw-msg csw-mono" data-o style="white-space:pre-wrap"></div><div class="csw-out" data-e></div>`;
    let fixed = false, tm = [];
    function run(m) {
      tm.forEach(clearTimeout); tm = [];
      const code = CODE.map((c, k) => k === 3 && fixed ? 'print("Bye")' : c);
      qa(root, '.csw-code div').forEach((d, k) => { d.lastChild.textContent = code[k]; d.classList.remove('on'); });
      const out = q(root, '[data-o]'), ex = q(root, '[data-e]'); out.textContent = ''; ex.innerHTML = '';
      const bad = code.findIndex(c => c.startsWith('prnt'));
      if (m === 'c') {
        out.textContent = 'Translating the whole program into machine code…\n';
        tm.push(setTimeout(() => {
          if (bad >= 0) { out.textContent += `Error on line ${bad + 1}: unknown function "prnt"\nNo executable file created — nothing has run.`; ex.innerHTML = 'A <b>compiler</b> translates the <b>whole</b> program in one go and reports <b>all</b> the errors at the end. Nothing runs until every error is fixed. Once it compiles, the <b>executable</b> runs fast and can be given to users without the source code or a translator.'; }
          else { out.textContent += 'Executable created.\nHello\nAna\nBye\nDone'; ex.innerHTML = 'Compiled once — the executable can now be run again and again <b>without translating it again</b>, and runs quickly.'; }
        }, 700));
      } else {
        code.forEach((c, k) => tm.push(setTimeout(() => {
          if (bad >= 0 && k > bad) return;
          qa(root, '.csw-code div').forEach((d, z) => d.classList.toggle('on', z === k));
          if (k === bad) { out.textContent += `Error on line ${k + 1}: name "prnt" is not defined — stopped.`; ex.innerHTML = 'An <b>interpreter</b> translates and runs the code <b>one line at a time</b>. Lines 1–3 already ran, then it <b>stopped at the first error</b> — handy for testing and debugging. But it has to translate every time the program runs (slower), and users need the interpreter.'; return; }
          const m2 = c.match(/^print\((.*)\)$/); if (m2) out.textContent += (m2[1] === 'name' ? 'Ana' : m2[1].replace(/"/g, '')) + '\n';
          if (k === code.length - 1) ex.innerHTML = 'Every line was translated and run in turn.';
        }, k * 600)));
      }
    }
    root.addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (b) run(b.dataset.m); if (e.target.closest('[data-fix]')) { fixed = !fixed; e.target.textContent = fixed ? 'Put the error back' : 'Fix line 4'; run('i'); } });
  };

  /* ---------- 2.2 SQL ---------- */
  W.sql = function (root) {
    const COLS = ['StudentID', 'Name', 'Year', 'House', 'Score'];
    const ROWS = [['S01', 'Amir', 10, 'Red', 74], ['S02', 'Bella', 11, 'Blue', 58], ['S03', 'Chen', 10, 'Blue', 91], ['S04', 'Dara', 11, 'Green', 42], ['S05', 'Eli', 10, 'Red', 66], ['S06', 'Fay', 11, 'Red', 85]];
    root.innerHTML = head('SQL: SELECT … FROM … WHERE', 'Interactive') + `<div class="csw-note">Table <b>Students</b></div><div class="csw-scroll"><table>${'<tr>' + COLS.map(c => `<th>${c}</th>`).join('') + '</tr>' + ROWS.map(r => '<tr>' + r.map(x => `<td>${x}</td>`).join('') + '</tr>').join('')}</table></div>
      <div class="csw-row" style="margin-top:10px"><input type="text" data-q style="width:100%;font-family:var(--mono,monospace)" value="SELECT Name, Score FROM Students WHERE Score > 60"></div>
      <div class="csw-row"><button data-ex="SELECT * FROM Students WHERE House = 'Red'">House = 'Red'</button><button data-ex="SELECT Name FROM Students WHERE Year = 10 AND Score >= 70">AND</button><button data-ex="SELECT Name, House FROM Students WHERE House = 'Blue' OR House = 'Green'">OR</button></div><div class="csw-out" data-o></div>`;
    function parse(s) {
      const m = s.trim().replace(/;$/, '').match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/i);
      if (!m) throw new Error('Use the pattern: SELECT fields FROM table WHERE condition');
      if (m[2].toLowerCase() !== 'students') throw new Error('There is no table called "' + m[2] + '" — the table is Students.');
      const fields = m[1].trim() === '*' ? COLS : m[1].split(',').map(f => { const c = COLS.find(x => x.toLowerCase() === f.trim().toLowerCase()); if (!c) throw new Error('No field called "' + f.trim() + '".'); return c; });
      let test = () => true;
      if (m[3]) {
        const parts = m[3].split(/\s+(AND|OR)\s+/i);
        const conds = [];
        for (let k = 0; k < parts.length; k += 2) {
          const c = parts[k].match(/^(\w+)\s*(=|!=|<>|<=|>=|<|>)\s*('([^']*)'|"([^"]*)"|-?\d+(\.\d+)?)$/);
          if (!c) throw new Error('Could not read the condition "' + parts[k] + '". Text values need quotation marks, eg House = \'Red\'.');
          const col = COLS.findIndex(x => x.toLowerCase() === c[1].toLowerCase()); if (col < 0) throw new Error('No field called "' + c[1] + '".');
          const val = c[4] != null ? c[4] : c[5] != null ? c[5] : Number(c[3]);
          conds.push((r) => { const a = r[col]; switch (c[2]) { case '=': return a == val; case '!=': case '<>': return a != val; case '<': return a < val; case '>': return a > val; case '<=': return a <= val; default: return a >= val; } });
        }
        const ops = parts.filter((_, k) => k % 2).map(x => x.toUpperCase());
        test = (r) => { let res = conds[0](r); ops.forEach((op, k) => { res = op === 'AND' ? res && conds[k + 1](r) : res || conds[k + 1](r); }); return res; };
      }
      return { fields, rows: ROWS.filter(test) };
    }
    function draw() {
      try {
        const r = parse(q(root, '[data-q]').value);
        q(root, '[data-o]').innerHTML = `<b>${r.rows.length}</b> record${r.rows.length === 1 ? '' : 's'} found<div class="csw-scroll"><table><tr>${r.fields.map(f => `<th>${f}</th>`).join('')}</tr>${r.rows.map(row => '<tr>' + r.fields.map(f => `<td>${row[COLS.indexOf(f)]}</td>`).join('') + '</tr>').join('')}</table></div><div class="csw-note">SELECT = which fields to show (* = all) · FROM = which table · WHERE = which records.</div>`;
      } catch (e) { q(root, '[data-o]').innerHTML = '<span class="csw-chip bad">Error</span> ' + esc(e.message); }
    }
    root.addEventListener('input', draw);
    root.addEventListener('click', (e) => { const b = e.target.closest('[data-ex]'); if (b) { q(root, '[data-q]').value = b.dataset.ex; draw(); } });
    draw();
  };

  /* ---------- 2.2 strings ---------- */
  W.strings = function (root) {
    root.innerHTML = head('String handling: OCR Exam Reference Language vs Python', 'Interactive') + `
      <div class="csw-row"><label>subject = <input type="text" value="ComputerScience" data-s style="width:180px"></label><label>x <input type="number" value="3" data-x style="width:60px"></label><label>i <input type="number" value="5" data-i style="width:60px"></label></div>
      <div class="csw-scroll"><table data-t></table></div><div class="csw-note">Characters are counted from <b>0</b>. In OCR's language, <code>substring(x, i)</code> starts at position x and takes i characters.</div>`;
    function draw() {
      const s = q(root, '[data-s]').value, x = Math.max(0, Number(q(root, '[data-x]').value) || 0), i = Math.max(0, Number(q(root, '[data-i]').value) || 0);
      const R = [['subject.length', 'len(subject)', s.length], ['subject.upper', 'subject.upper()', s.toUpperCase()], ['subject.lower', 'subject.lower()', s.toLowerCase()],
        [`subject.left(${i})`, `subject[:${i}]`, s.slice(0, i)], [`subject.right(${i})`, `subject[-${i}:]`, i ? s.slice(-i) : ''], [`subject.substring(${x}, ${i})`, `subject[${x}:${x + i}]`, s.substr(x, i)],
        ['subject + "!"', 'subject + "!"', s + '!'], [`ASC("${s[0] || 'A'}")`, `ord("${s[0] || 'A'}")`, (s[0] || 'A').charCodeAt(0)], ['CHR(97)', 'chr(97)', 'a']];
      q(root, '[data-t]').innerHTML = '<tr><th>OCR Exam Reference Language</th><th>Python</th><th>Result</th></tr>' + R.map(r => `<tr><td class="csw-mono">${esc(r[0])}</td><td class="csw-mono">${esc(r[1])}</td><td class="csw-mono"><b>${esc(typeof r[2] === 'string' ? '"' + r[2] + '"' : r[2])}</b></td></tr>`).join('');
    }
    root.addEventListener('input', draw); draw();
  };

  /* ---------- 2.2 2D arrays ---------- */
  W.array2d = function (root) {
    const D = [[12, 15, 9, 20], [7, 18, 11, 14], [16, 10, 13, 19]];
    let r = 1, c = 2;
    root.innerHTML = head('2D arrays: rows and columns', 'Interactive') + `<p style="margin:0">Laps run by 3 students (rows) on 4 days (columns). Click a cell.</p>
      <div class="csw-scroll"><table data-t style="max-width:460px"></table></div><div class="csw-out" data-o></div>`;
    function draw() {
      q(root, '[data-t]').innerHTML = '<tr><th></th>' + D[0].map((_, k) => `<th>col ${k}</th>`).join('') + '<th>row total</th></tr>' + D.map((row, i) => `<tr><th>row ${i}</th>${row.map((v, k) => `<td data-rc="${i},${k}" style="cursor:pointer;${i === r && k === c ? 'background:var(--w-a);color:#fff;font-weight:800' : i === r || k === c ? 'background:color-mix(in srgb,var(--w-a) 10%,transparent)' : ''}">${v}</td>`).join('')}<td>${row.reduce((a, b) => a + b, 0)}</td></tr>`).join('');
      q(root, '[data-o]').innerHTML = `OCR Exam Reference Language: <code>laps[${r},${c}]</code> = <b>${D[r][c]}</b> · Python: <code>laps[${r}][${c}]</code><br>Total for row ${r} (a loop over the columns):<div class="csw-code" style="margin-top:6px"><div>total = 0</div><div>for col = 0 to 3</div><div>    total = total + laps[${r},col]</div><div>next col</div><div>print(total)   // ${D[r].reduce((a, b) => a + b, 0)}</div></div>`;
    }
    root.addEventListener('click', (e) => { const td = e.target.closest('[data-rc]'); if (td) { [r, c] = td.dataset.rc.split(',').map(Number); draw(); } });
    draw();
  };

  /* ---------- 2.2 random numbers ---------- */
  W.dice = function (root) {
    let counts = [0, 0, 0, 0, 0, 0], n = 0, last = null;
    root.innerHTML = head('Random numbers: roll = random(1, 6)', 'Interactive') + `<div class="csw-row"><button class="pri" data-r="1">Roll once</button><button data-r="100">Roll 100 times</button><button data-r="1000">Roll 1,000 times</button><button data-x>Reset</button></div>
      <svg viewBox="0 0 420 170" data-svg></svg><div class="csw-out" data-o></div>`;
    function draw() {
      const mx = Math.max(1, ...counts);
      q(root, '[data-svg]').innerHTML = counts.map((c, k) => `<rect x="${20 + k * 66}" y="${140 - c / mx * 120}" width="46" height="${c / mx * 120}" rx="6" fill="var(--w-a)"/><text x="${43 + k * 66}" y="160" text-anchor="middle" font-size="13" font-weight="800">${k + 1}</text><text x="${43 + k * 66}" y="${134 - c / mx * 120}" text-anchor="middle" font-size="11">${c}</text>`).join('');
      q(root, '[data-o]').innerHTML = n ? `Last roll: <b class="csw-big">${last}</b> · ${n} rolls. Each whole number from 1 to 6 (inclusive) is equally likely, so with many rolls the bars even out.` : 'Press roll.';
    }
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-r]'); if (b) { for (let k = 0; k < Number(b.dataset.r); k++) { last = 1 + Math.floor(Math.random() * 6); counts[last - 1]++; n++; } draw(); }
      if (e.target.closest('[data-x]')) { counts = [0, 0, 0, 0, 0, 0]; n = 0; last = null; draw(); }
    });
    draw();
  };

  /* ---------- mount ---------- */
  function mountAll(scope) {
    if (!document.getElementById('csw-css')) { const st = document.createElement('style'); st.id = 'csw-css'; st.textContent = WCSS; document.head.appendChild(st); }
    (scope || document).querySelectorAll('.csw:not([data-ready])').forEach(el => {
      const f = W[el.dataset.w]; el.dataset.ready = '1';
      if (!f) return;
      let o = {}; try { o = JSON.parse(el.dataset.o || '{}'); } catch (e) {}
      try { f(el, o); } catch (e) { el.innerHTML = '<p class="csw-note">This diagram could not load.</p>'; if (window.console) console.error('guide widget', el.dataset.w, e); }
    });
  }
  const mo = new MutationObserver(() => { if (document.querySelector('.csw:not([data-ready])')) mountAll(); });
  if (document.body) mo.observe(document.body, { childList: true, subtree: true });
  else document.addEventListener('DOMContentLoaded', () => mo.observe(document.body, { childList: true, subtree: true }));
