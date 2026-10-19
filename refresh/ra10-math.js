/* RA10 Math tools — maths keyboard, built-in calculator and
   "photo of my working" for practice answers and the AI chat.

   RA10Math.attach(textarea, opts)
     opts.photo      show the "Photo of my working" button (AI-read handwriting)
     opts.question   () => question text (context for reading the photo)
     opts.bar        element to put the tool buttons in (default: a bar above the textarea)
     opts.panelHost  element to put the keyboard/calculator panels in
     opts.compact    icon-only buttons (chat composer)
     opts.onChange   called after text is inserted

   Practice answer boxes that sit next to an AI Examiner button are found and
   upgraded automatically. Loaded by /refresh/ra10-ai.js. */
(function () {
  'use strict';
  if (window.RA10Math) return;

  function h(tag, attrs, html) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null || attrs[k] === false) return;
      if (k === 'class') el.className = attrs[k]; else if (k === 'text') el.textContent = attrs[k]; else el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    if (html != null) el.innerHTML = html;
    return el;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function core() { return window.RA10AI || null; }
  function isBusiness() { return /\/revision\/(a-level\/business|btec\/level-3\/business)/i.test(location.pathname); }

  /* ── Styles ─────────────────────────────────────────────────────────── */
  (function css() {
    if (document.getElementById('rmt-css')) return;
    var st = document.createElement('style');
    st.id = 'rmt-css';
    st.textContent = [
      '.rmt{--rmt-ink:#14161c;--rmt-ink2:#5b6170;--rmt-line:rgba(20,22,28,.12);--rmt-well:rgba(20,22,28,.05);--rmt-surface:#fff;--rmt-a:#1f6feb;--rmt-b:#7c3aed;font-size:14px;color:var(--rmt-ink)}',
      '[data-theme="dark"] .rmt{--rmt-ink:#eceef3;--rmt-ink2:#a3a9b8;--rmt-line:rgba(255,255,255,.14);--rmt-well:rgba(255,255,255,.06);--rmt-surface:#1d1e23}',
      '.rmt-bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 6px}',
      '.rmt-btn{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:999px;border:1px solid var(--rmt-line);background:var(--rmt-surface);color:var(--rmt-ink);font:inherit;font-size:.8rem;font-weight:600;cursor:pointer;transition:background .15s,border-color .15s}',
      '.rmt-btn:hover{border-color:var(--rmt-a)}',
      '.rmt-btn[aria-pressed="true"]{background:var(--rmt-ink);color:var(--rmt-surface);border-color:var(--rmt-ink)}',
      '.rmt-btn.photo{color:#fff;border:0;background:linear-gradient(135deg,#1f6feb,#7c3aed)}',
      '.rmt-bar.compact .rmt-btn{height:30px;width:30px;padding:0;justify-content:center;border-color:transparent;background:transparent;color:var(--rmt-ink2)}',
      '.rmt-bar.compact .rmt-btn:hover{background:var(--rmt-well);color:var(--rmt-ink)}',
      '.rmt-bar.compact .rmt-btn[aria-pressed="true"]{background:var(--rmt-well);color:var(--rmt-a)}',
      '.rmt-bar.compact .rmt-btn span{display:none}',
      '.rmt-panel{border:1px solid var(--rmt-line);border-radius:16px;background:var(--rmt-surface);padding:10px;margin:0 0 8px;box-shadow:0 8px 24px -16px rgba(15,23,42,.35)}',
      '.rmt-tabs{display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap}',
      '.rmt-tab{border:0;background:transparent;border-radius:999px;padding:5px 10px;font:inherit;font-size:.76rem;font-weight:700;color:var(--rmt-ink2);cursor:pointer}',
      '.rmt-tab[aria-selected="true"]{background:var(--rmt-well);color:var(--rmt-ink)}',
      '.rmt-keys{display:grid;grid-template-columns:repeat(auto-fill,minmax(46px,1fr));gap:6px}',
      '.rmt-key{min-height:38px;border:1px solid var(--rmt-line);border-radius:10px;background:var(--rmt-well);color:var(--rmt-ink);font:inherit;font-size:.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:2px 4px}',
      '.rmt-key:hover{border-color:var(--rmt-a);background:var(--rmt-surface)}',
      '.rmt-key .katex{font-size:.95em}',
      '.rmt-formulas{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}',
      '.rmt-formula{text-align:left;border:1px solid var(--rmt-line);border-radius:10px;background:var(--rmt-well);color:var(--rmt-ink);font:inherit;font-size:.78rem;font-weight:600;padding:8px 10px;cursor:pointer}',
      '.rmt-formula:hover{border-color:var(--rmt-a);background:var(--rmt-surface)}',
      '.rmt-hint{font-size:.72rem;color:var(--rmt-ink2);margin:8px 2px 0}',
      '.rmt-calc{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;max-width:340px}',
      '.rmt-calc input{width:100%;height:42px;border-radius:12px;border:1px solid var(--rmt-line);background:var(--rmt-well);color:var(--rmt-ink);font:inherit;font-size:1.05rem;padding:0 12px;text-align:right;box-shadow:none}',
      '.rmt-result{text-align:right;font-size:1.3rem;font-weight:800;min-height:1.6em;font-variant-numeric:tabular-nums}',
      '.rmt-result.err{font-size:.85rem;font-weight:600;color:#c0262d}',
      '.rmt-cgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}',
      '.rmt-cgrid .rmt-key{min-height:40px;font-weight:600}',
      '.rmt-cgrid .eq{background:linear-gradient(135deg,#1f6feb,#7c3aed);color:#fff;border:0}',
      '.rmt-cactions{display:flex;gap:6px;flex-wrap:wrap}',
      '.rmt-preview{margin:6px 0 0;padding:10px 12px;border-radius:12px;border:1px dashed var(--rmt-line);background:var(--rmt-well);font-size:.92rem;line-height:1.6;overflow-x:auto}',
      '.rmt-preview small{display:block;font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--rmt-ink2);margin-bottom:4px}',
      '.rai-math-block{display:block;margin:.4em 0;overflow-x:auto;overflow-y:hidden}',
      '.rai-math .katex{font-size:1.05em}',
      '.rmt-photo-card{width:min(760px,100%) !important;max-height:92vh;overflow:auto}',
      '.rmt-photo-grid{display:grid;grid-template-columns:minmax(0,220px) minmax(0,1fr);gap:14px;margin-top:6px}',
      '@media(max-width:640px){.rmt-photo-grid{grid-template-columns:1fr}}',
      '.rmt-photo-grid img{width:100%;border-radius:12px;border:1px solid var(--rmt-line);object-fit:contain;max-height:320px;background:#fff}',
      '.rmt-photo-grid textarea{width:100%;min-height:170px;border-radius:12px;border:1px solid var(--rmt-line) !important;background:var(--rmt-well) !important;color:var(--rmt-ink) !important;font:inherit;font-size:.9rem;padding:10px 12px;resize:vertical;box-shadow:none !important}',
      '.rmt-conf{display:inline-block;font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;padding:3px 8px;border-radius:999px;background:#e7f6ee;color:#138a4b}',
      '.rmt-conf.medium{background:#fff4dc;color:#8a5a00}.rmt-conf.low{background:#fde8e8;color:#a11b1b}',
      '.rmt-reading{display:flex;align-items:center;gap:10px;color:var(--rmt-ink2);font-size:.88rem;padding:20px 0}',
      '.rmt-spin{width:18px;height:18px;border-radius:50%;border:2px solid var(--rmt-line);border-top-color:var(--rmt-a);animation:rmtSpin .8s linear infinite}',
      '@keyframes rmtSpin{to{transform:rotate(360deg)}}',
    ].join('\n');
    document.head.appendChild(st);
  })();

  var ICONS = {
    sigma: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 5H6l6 7-6 7h12"/></svg>',
    calc: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8.5 6.5h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5v3.5M8.5 18h.01M12 18h.01"/></svg>',
    camera: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  };

  /* ── Keyboard content ───────────────────────────────────────────────── */
  // Keys show student-friendly notation; generated markup stays internal.
  var KEYS = {
    basic: [['+', '+'], ['-', '-'], ['\\times', '\\times '], ['\\div', '\\div '], ['=', '='], ['\\approx', '\\approx '], ['\\neq', '\\neq '], ['\\pm', '\\pm '],
            ['(\\,)', '(|)'], ['\\%', '\\%'], ['\\pounds', '\\pounds'], ['\\le', '\\le '], ['\\ge', '\\ge '], ['\\to', '\\rightarrow '], ['\\Delta', '\\Delta '], ['\\Sigma', '\\Sigma ']],
    structure: [['\\frac{a}{b}', '\\frac{|}{}'], ['x^2', '^{2}'], ['x^n', '^{|}'], ['x_1', '_{|}'], ['\\sqrt{x}', '\\sqrt{|}'], ['\\sqrt[n]{x}', '\\sqrt[|]{}'],
                ['\\text{ab}', '\\text{|}'], ['\\bar{x}', '\\bar{|}'], ['\\pi', '\\pi '], ['\\infty', '\\infty '], ['\\cdot', '\\cdot '], ['\\overline{AB}', '\\overline{|}']],
  };
  var FORMULAS = [
    ['% change', '\\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100'],
    ['Contribution / unit', '\\text{price} - \\text{variable cost per unit}'],
    ['Break-even output', '\\frac{\\text{fixed costs}}{\\text{contribution per unit}}'],
    ['Margin of safety', '\\text{actual output} - \\text{break-even output}'],
    ['Profit margin', '\\frac{\\text{profit}}{\\text{revenue}} \\times 100'],
    ['ROCE', '\\frac{\\text{operating profit}}{\\text{total equity} + \\text{non-current liabilities}} \\times 100'],
    ['Current ratio', '\\frac{\\text{current assets}}{\\text{current liabilities}}'],
    ['Gearing', '\\frac{\\text{non-current liabilities}}{\\text{total equity} + \\text{non-current liabilities}} \\times 100'],
    ['Payables days', '\\frac{\\text{payables}}{\\text{cost of sales}} \\times 365'],
    ['Receivables days', '\\frac{\\text{receivables}}{\\text{revenue}} \\times 365'],
    ['Inventory turnover', '\\frac{\\text{cost of sales}}{\\text{average inventory}}'],
    ['ARR', '\\frac{\\text{average annual profit}}{\\text{initial investment}} \\times 100'],
    ['Payback', '\\text{years before} + \\frac{\\text{amount still needed}}{\\text{cash flow that year}} \\times 12 \\text{ months}'],
    ['Labour productivity', '\\frac{\\text{output}}{\\text{number of employees}}'],
    ['Labour turnover', '\\frac{\\text{leavers}}{\\text{average number of employees}} \\times 100'],
    ['Capacity utilisation', '\\frac{\\text{actual output}}{\\text{maximum capacity}} \\times 100'],
    ['Expected value', '(p_1 \\times x_1) + (p_2 \\times x_2)'],
    ['Market share', '\\frac{\\text{sales of business}}{\\text{total market sales}} \\times 100'],
  ];

  /* ── Insertion at the caret ─────────────────────────────────────────── */
  function insideMath(text, pos) {
    var before = text.slice(0, pos).replace(/\\\$/g, '');
    var count = (before.match(/\$/g) || []).length;
    return count % 2 === 1;
  }
  function insert(ta, snippet, opts) {
    opts = opts || {};
    var start = ta.selectionStart == null ? ta.value.length : ta.selectionStart;
    var end = ta.selectionEnd == null ? start : ta.selectionEnd;
    var val = ta.value;
    if (opts.block) {
      // A full line of working: put it on its own line, outside any open $...$.
      var pos = end;
      if (insideMath(val, pos)) {
        var close = val.indexOf('$', pos);
        pos = close < 0 ? val.length : close + (val.charAt(close + 1) === '$' ? 2 : 1);
      }
      var lead = pos > 0 && val.charAt(pos - 1) !== '\n' ? '\n' : '';
      var line = lead + '$$' + snippet + '$$\n';
      ta.value = val.slice(0, pos) + line + val.slice(pos);
      ta.focus();
      try { ta.setSelectionRange(pos + line.length, pos + line.length); } catch (e) {}
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
    var caretMark = snippet.indexOf('|');
    var clean = snippet.replace('|', '');
    var wrap = !opts.raw && !insideMath(val, start);
    var text = wrap ? '$' + clean + '$' : clean;
    var caret = start + (caretMark >= 0 ? caretMark + (wrap ? 1 : 0) : text.length - (wrap ? 1 : 0));
    if (opts.raw) caret = start + text.length;
    ta.value = val.slice(0, start) + text + val.slice(end);
    ta.focus();
    try { ta.setSelectionRange(caret, caret); } catch (e) {}
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /* ── Calculator (no eval: shunting-yard) ────────────────────────────── */
  function evaluate(expr) {
    var s = String(expr).replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '').replace(/\s+/g, '');
    if (!s) throw new Error('Type a calculation');
    var tokens = [];
    var re = /(\d+\.?\d*|\.\d+)|(√)|([-+*/^()%])/g, m, last = 0;
    while ((m = re.exec(s))) {
      if (m.index !== last) throw new Error('Unexpected "' + s.slice(last, m.index) + '"');
      last = re.lastIndex;
      tokens.push(m[1] ? { t: 'n', v: parseFloat(m[1]) } : { t: 'o', v: m[2] || m[3] });
    }
    if (last !== s.length) throw new Error('Unexpected "' + s.slice(last) + '"');
    var prec = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 4, 'neg': 3, '√': 5 };
    var right = { '^': true, 'neg': true, '√': true };
    var out = [], ops = [], prev = null;
    tokens.forEach(function (tk) {
      if (tk.t === 'n') { out.push(tk.v); prev = tk; return; }
      var o = tk.v;
      if (o === '%') { if (!out.length) throw new Error('% needs a number'); out.push(out.pop() / 100); prev = { t: 'n' }; return; }
      if (o === '(') { ops.push(o); prev = tk; return; }
      if (o === ')') {
        while (ops.length && ops[ops.length - 1] !== '(') apply(ops.pop());
        if (!ops.length) throw new Error('Unmatched )');
        ops.pop(); prev = { t: 'n' };
        if (ops.length && ops[ops.length - 1] === '√') apply(ops.pop());
        return;
      }
      if ((o === '-' || o === '+') && (!prev || (prev.t === 'o' && prev.v !== ')'))) { if (o === '-') ops.push('neg'); prev = tk; return; }
      if (o === '√') { ops.push('√'); prev = tk; return; }
      while (ops.length) {
        var top = ops[ops.length - 1];
        if (top === '(') break;
        if (prec[top] > prec[o] || (prec[top] === prec[o] && !right[o])) apply(ops.pop()); else break;
      }
      ops.push(o); prev = tk;
    });
    while (ops.length) { var op = ops.pop(); if (op === '(') throw new Error('Unmatched ('); apply(op); }
    if (out.length !== 1 || !isFinite(out[0])) throw new Error('Check the calculation');
    return out[0];
    function apply(o) {
      if (o === 'neg' || o === '√') { if (!out.length) throw new Error('Incomplete'); var a = out.pop(); out.push(o === 'neg' ? -a : Math.sqrt(a)); return; }
      if (out.length < 2) throw new Error('Incomplete calculation');
      var b = out.pop(), x = out.pop();
      out.push(o === '+' ? x + b : o === '-' ? x - b : o === '*' ? x * b : o === '/' ? x / b : Math.pow(x, b));
    }
  }
  function fmt(n) {
    if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(4);
    var r = Math.round(n * 1e6) / 1e6;
    return r.toLocaleString('en-GB', { maximumFractionDigits: 6 });
  }
  function exprToLatex(expr) {
    return String(expr).replace(/√\(([^()]*)\)/g, '\\sqrt{$1}').replace(/√(\d+\.?\d*)/g, '\\sqrt{$1}')
      .replace(/\*/g, '×').replace(/×/g, ' \\times ').replace(/\//g, '÷').replace(/÷/g, ' \\div ').replace(/%/g, '\\%')
      .replace(/\^(\d+)/g, '^{$1}').replace(/\s+/g, ' ').trim();
  }

  /* ── Attach to a textarea ───────────────────────────────────────────── */
  function attach(ta, opts) {
    if (!ta || ta.hasAttribute('data-rmt')) return null;
    ta.setAttribute('data-rmt', '1');
    opts = opts || {};
    var wrapRoot = h('div', { class: 'rmt' });
    var bar = opts.bar || h('div');
    bar.classList.add('rmt-bar');
    if (opts.compact) bar.classList.add('compact');
    if (!opts.bar) { wrapRoot.appendChild(bar); ta.parentNode.insertBefore(wrapRoot, ta); }
    else bar.classList.add('rmt');
    var panelHost = opts.panelHost || wrapRoot;
    if (opts.panelHost) panelHost.classList.add('rmt');

    function btn(label, iconName, title, cls) {
      var b = h('button', { type: 'button', class: 'rmt-btn' + (cls ? ' ' + cls : ''), title: title, 'aria-label': title, 'aria-pressed': cls === 'photo' ? null : 'false' }, ICONS[iconName] + '<span>' + esc(label) + '</span>');
      bar.appendChild(b);
      return b;
    }
    var kBtn = btn('Maths keyboard', 'sigma', 'Maths keyboard');
    var cBtn = btn('Calculator', 'calc', 'Calculator');
    var pBtn = opts.photo ? btn('Photo of my working', 'camera', 'Upload a photo of your written work', 'photo') : null;

    var panel = null, which = '';
    function close() { if (panel) panel.remove(); panel = null; which = ''; kBtn.setAttribute('aria-pressed', 'false'); cBtn.setAttribute('aria-pressed', 'false'); }
    function open(kind) {
      if (which === kind) { close(); return; }
      close();
      which = kind;
      panel = kind === 'keys' ? keyboardPanel(ta, opts) : calculatorPanel(ta, opts);
      if (opts.panelHost) panelHost.appendChild(panel); else wrapRoot.appendChild(panel);
      (kind === 'keys' ? kBtn : cBtn).setAttribute('aria-pressed', 'true');
      if (core()) core().renderMath(panel);
      var first = panel.querySelector('input, button');
      if (kind === 'calc' && first) first.focus();
    }
    kBtn.onclick = function () { open('keys'); };
    cBtn.onclick = function () { open('calc'); };
    if (pBtn) pBtn.onclick = function () { photoFlow(ta, opts); };

    // Live preview of maths typed into the box.
    var preview = null, t = null;
    function updatePreview() {
      var has = /\$[^$]+\$|\\\(|\\\[/.test(ta.value);
      if (!has) { if (preview) { preview.remove(); preview = null; } return; }
      if (!preview) {
        preview = h('div', { class: 'rmt rmt-preview', 'aria-live': 'polite' });
        if (opts.panelHost) panelHost.appendChild(preview); else ta.parentNode.insertBefore(preview, ta.nextSibling);
      }
      if (!core()) return;
      preview.innerHTML = '<small>Preview</small>' + core().mathText(ta.value.slice(-3000));
      core().renderMath(preview);
    }
    ta.addEventListener('input', function () {
      clearTimeout(t); t = setTimeout(updatePreview, 160);
      if (opts.onChange) opts.onChange();
    });
    // Clear the preview when the chat input is sent (value emptied programmatically).
    setInterval(function () { if (preview && !ta.value) { preview.remove(); preview = null; } }, 1200);
    updatePreview();
    return { close: close, insert: function (s) { insert(ta, s); } };
  }

  function keyboardPanel(ta, opts) {
    var p = h('div', { class: 'rmt-panel', role: 'group', 'aria-label': 'Maths keyboard' });
    var tabs = h('div', { class: 'rmt-tabs', role: 'tablist' });
    var body = h('div');
    var groups = [['basic', 'Symbols'], ['structure', 'Fractions & powers']];
    if (isBusiness() || opts.formulas) groups.push(['formulas', 'Business formulas']);
    else groups.push(['formulas', 'Formulas']);
    function show(key) {
      tabs.querySelectorAll('.rmt-tab').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.k === key)); });
      body.innerHTML = '';
      if (key === 'formulas') {
        var g = h('div', { class: 'rmt-formulas' });
        FORMULAS.forEach(function (f) {
          var b = h('button', { type: 'button', class: 'rmt-formula', title: 'Insert the ' + f[0] + ' formula' }, esc(f[0]));
          b.onmousedown = function (e) { e.preventDefault(); };
          b.onclick = function () { insert(ta, f[1] + ' =|'); };
          g.appendChild(b);
        });
        body.appendChild(g);
      } else {
        var k = h('div', { class: 'rmt-keys' });
        KEYS[key].forEach(function (pair) {
          var b = h('button', { type: 'button', class: 'rmt-key', title: pair[1].replace('|', '') }, '<span class="rai-math" data-display="0" data-tex="' + esc(pair[0]) + '">' + esc(pair[0]) + '</span>');
          b.onmousedown = function (e) { e.preventDefault(); };   // keep the caret in the textarea
          b.onclick = function () { insert(ta, pair[1]); };
          k.appendChild(b);
        });
        body.appendChild(k);
        if (core()) core().renderMath(k);
      }
    }
    groups.forEach(function (g, i) {
      var b = h('button', { type: 'button', class: 'rmt-tab', role: 'tab', 'aria-selected': String(i === 0), 'data-k': g[0] }, esc(g[1]));
      b.onclick = function () { show(g[0]); };
      tabs.appendChild(b);
    });
    p.appendChild(tabs);
    p.appendChild(body);
    p.appendChild(h('p', { class: 'rmt-hint' }, 'Type maths normally, for example <b>10 / 2</b>, <b>12 x 5</b> or <b>25%</b>. Buttons add formatted maths at your cursor.'));
    show('basic');
    return p;
  }

  function calculatorPanel(ta) {
    var p = h('div', { class: 'rmt-panel', role: 'group', 'aria-label': 'Calculator' });
    var c = h('div', { class: 'rmt-calc' });
    var input = h('input', { type: 'text', inputmode: 'decimal', 'aria-label': 'Calculation', placeholder: 'e.g. 12 ÷ 140 × 100' });
    var result = h('div', { class: 'rmt-result', 'aria-live': 'polite' });
    var last = null;
    function run() {
      try { last = evaluate(input.value); result.className = 'rmt-result'; result.textContent = '= ' + fmt(last); }
      catch (err) { last = null; result.className = 'rmt-result err'; result.textContent = err.message; }
    }
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    input.addEventListener('input', function () { try { last = evaluate(input.value); result.className = 'rmt-result'; result.textContent = '= ' + fmt(last); } catch (e) { result.textContent = ''; last = null; } });
    var keys = ['7', '8', '9', '÷', '(', '4', '5', '6', '×', ')', '1', '2', '3', '−', '%', '0', '.', '√', '+', '^', 'C', '⌫', 'x²', '±', '='];
    var grid = h('div', { class: 'rmt-cgrid' });
    keys.forEach(function (k) {
      var b = h('button', { type: 'button', class: 'rmt-key' + (k === '=' ? ' eq' : ''), 'aria-label': { '⌫': 'Delete', 'C': 'Clear', '±': 'Negative', 'x²': 'Squared', '√': 'Square root' }[k] || k }, esc(k));
      b.onclick = function () {
        if (k === '=') return run();
        if (k === 'C') { input.value = ''; result.textContent = ''; last = null; return input.focus(); }
        if (k === '⌫') { input.value = input.value.slice(0, -1); input.dispatchEvent(new Event('input')); return input.focus(); }
        if (k === 'x²') { input.value += '^2'; } else if (k === '±') { input.value = input.value ? '-(' + input.value + ')' : '-'; }
        else if (k === '√') { input.value += '√('; } else if (k === '−') { input.value += '-'; } else { input.value += k; }
        input.dispatchEvent(new Event('input'));
        input.focus();
      };
      grid.appendChild(b);
    });
    var actions = h('div', { class: 'rmt-cactions' });
    var insAns = h('button', { type: 'button', class: 'rmt-btn' }, 'Insert answer');
    var insWork = h('button', { type: 'button', class: 'rmt-btn' }, 'Insert working');
    insAns.onclick = function () { run(); if (last != null) insert(ta, fmt(last).replace(/,/g, ''), { raw: true }); };
    insWork.onclick = function () { run(); if (last != null) insert(ta, exprToLatex(input.value) + ' = ' + fmt(last).replace(/,/g, '{,}'), { block: true }); };
    actions.appendChild(insAns); actions.appendChild(insWork);
    c.appendChild(input); c.appendChild(result); c.appendChild(grid); c.appendChild(actions);
    p.appendChild(c);
    p.appendChild(h('p', { class: 'rmt-hint' }, '“Insert working” adds the calculation and answer as maths, so the examiner can see your method.'));
    return p;
  }

  /* ── Photo of written work -> text ──────────────────────────────────── */
  function downscale(file) {
    return new Promise(function (resolve, reject) {
      if (!/^image\//.test(file.type || '') && !/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name || '')) return reject(new Error('Please choose a photo.'));
      if (file.size > 25 * 1024 * 1024) return reject(new Error('That photo is too large (max 25 MB).'));
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var max = 1600, w = img.naturalWidth, hgt = img.naturalHeight;
        var scale = Math.min(1, max / Math.max(w, hgt));
        var cv = document.createElement('canvas');
        cv.width = Math.round(w * scale); cv.height = Math.round(hgt * scale);
        var cx = cv.getContext('2d');
        cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height);
        cx.drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        var data = cv.toDataURL('image/jpeg', 0.85);
        if (data.length > 2700000) data = cv.toDataURL('image/jpeg', 0.6);
        resolve(data);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('This photo format could not be opened. Try a JPEG or PNG (on iPhone: Settings > Camera > Formats > Most Compatible).')); };
      img.src = url;
    });
  }

  function photoFlow(ta, opts) {
    var R = window.RA10;
    if (!R || typeof R.isLoggedIn !== 'function' || !R.isLoggedIn()) {
      if (R && R.showPaywall) R.showPaywall('account', 'ai_transcribe');
      else alert('Sign in to read a photo of your work.');
      return;
    }
    if (typeof R.transcribeWork !== 'function') { alert('Please refresh the page to use photo reading.'); return; }
    var fi = h('input', { type: 'file', accept: 'image/*' });
    fi.style.display = 'none';
    document.body.appendChild(fi);
    fi.onchange = function () {
      var file = fi.files && fi.files[0];
      fi.remove();
      if (!file) return;
      var C = core();
      var cost = C ? C.transcribeCost() : 1;
      (C ? C.confirmCredits(cost, 'Reading a photo of your work') : Promise.resolve(true)).then(function (ok) {
        if (!ok) return;
        var dlg = photoDialog(ta, opts);
        downscale(file).then(function (data) {
          dlg.setImage(data);
          var q = '';
          try { q = typeof opts.question === 'function' ? String(opts.question() || '') : ''; } catch (e) {}
          return R.transcribeWork({ image: data, question: q });
        }).then(function (res) {
          dlg.setResult(res);
          if (window._ra10RenderUnitCreditChip) { try { window._ra10RenderUnitCreditChip(); } catch (e) {} }
        }, function (err) { dlg.setError(err && err.message ? err.message : 'Could not read that photo.'); });
      });
    };
    fi.click();
  }

  function photoDialog(ta, opts) {
    var prevFocus = document.activeElement;
    var wrap = h('div', { class: 'rai-dialog rai-layer rmt' });
    var card = h('div', { class: 'rai-dialog-card rmt-photo-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Photo of your working' });
    card.innerHTML = '<h3>Photo of your working</h3><p>We read your handwriting so you can check it and add it to your answer. The photo is not saved.</p>' +
      '<div class="rmt-photo-grid"><div class="rmt-img"></div><div class="rmt-out"><div class="rmt-reading"><span class="rmt-spin"></span><span>Reading your handwriting…</span></div></div></div>' +
      '<div class="rai-dialog-actions"><button type="button" class="rai-btn ghost" data-a="cancel">Cancel</button></div>';
    wrap.appendChild(card);
    document.body.appendChild(wrap);
    function close() { document.removeEventListener('keydown', onKey, true); wrap.remove(); try { (prevFocus || ta).focus(); } catch (e) {} }
    function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
    document.addEventListener('keydown', onKey, true);
    card.querySelector('[data-a="cancel"]').onclick = close;
    return {
      setImage: function (src) { card.querySelector('.rmt-img').innerHTML = '<img alt="Your photo" src="' + src + '">'; },
      setError: function (msg) {
        card.querySelector('.rmt-out').innerHTML = '<p class="rmt-result err" style="text-align:left">' + esc(msg) + '</p>';
      },
      setResult: function (res) {
        var out = card.querySelector('.rmt-out');
        var conf = String(res.confidence || 'medium');
        out.innerHTML = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span class="rmt-conf ' + esc(conf) + '">' + esc(conf) + ' confidence</span>' +
          (res.notes ? '<small style="color:var(--rmt-ink2)">' + esc(res.notes) + '</small>' : '') + '</div>' +
          '<label class="rai-sr" for="rmt-tx">Transcribed text</label><textarea id="rmt-tx"></textarea><div class="rmt-preview" hidden></div>' +
          '<p class="rmt-hint">Check it matches what you wrote - fix any [?] before adding it. Your mistakes are kept so AI Examiner can mark them.</p>';
        var tx = out.querySelector('textarea');
        var pv = out.querySelector('.rmt-preview');
        tx.value = res.text || '';
        function upd() {
          var has = /\$[^$]+\$|\\\(|\\\[/.test(tx.value);
          pv.hidden = !has;
          if (has && core()) { pv.innerHTML = '<small>Preview</small>' + core().mathText(tx.value); core().renderMath(pv); }
        }
        tx.addEventListener('input', upd);
        upd();
        var actions = card.querySelector('.rai-dialog-actions');
        var add = h('button', { type: 'button', class: 'rai-btn primary' }, ta.value.trim() ? 'Add to my answer' : 'Use as my answer');
        actions.appendChild(add);
        if (ta.value.trim()) {
          var replace = h('button', { type: 'button', class: 'rai-btn' }, 'Replace my answer');
          actions.insertBefore(replace, add);
          replace.onclick = function () { ta.value = tx.value.trim(); finish(); };
        }
        add.onclick = function () { ta.value = ta.value.trim() ? ta.value.replace(/\s+$/, '') + '\n\n' + tx.value.trim() : tx.value.trim(); finish(); };
        function finish() {
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          close();
          ta.focus();
          if (core()) core().toast('Added - now tap AI Examiner to mark it');
          if (opts.onChange) opts.onChange();
        }
        if (!res.text) { add.disabled = true; }
        tx.focus();
      },
    };
  }

  /* ── Auto-attach to practice answers next to an AI Examiner button ──── */
  var scheduled = false;
  function scan() {
    scheduled = false;
    document.querySelectorAll('.btn-examine:not([data-rmt-done]), .btn-ai-examine:not([data-rmt-done])').forEach(function (b) {
      b.setAttribute('data-rmt-done', '1');
      var card = b.closest('.practice-card, .question-card, .card, article, section') || b.parentElement;
      var ta = card && card.querySelector('textarea:not([data-rmt])');
      if (!ta) return;
      attach(ta, {
        photo: true,
        formulas: isBusiness(),
        question: function () {
          var q = card.querySelector('.question, .q-text, .qtext, h3, h4');
          return q ? q.textContent : '';
        },
      });
    });
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(scan); } }
  function boot() {
    scan();
    try { new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  }

  window.RA10Math = { attach: attach, insert: insert, evaluate: evaluate, photo: photoFlow };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  try { document.dispatchEvent(new CustomEvent('ra10math:ready')); } catch (e) {}
})();
