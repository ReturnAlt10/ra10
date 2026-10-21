/* BTEC Business Unit 3 — Finance Calculator
   Break-even, cash flow, ratios, depreciation — with step-by-step working and
   an AI Examiner button. Initialised by window.initFinanceCalculator(). */
(function () {
  'use strict';

  const ACTIVE = { tab: 'break-even' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function num(v) {
    const n = parseFloat(String(v).replace(/[£,]/g, '').trim());
    return Number.isFinite(n) ? n : 0;
  }
  function fmt(n, dp) {
    dp = dp == null ? 2 : dp;
    if (!Number.isFinite(n)) return '—';
    return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
  }
  function fmtNum(n, dp) {
    dp = dp == null ? 2 : dp;
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
  }

  const TABS = [
    { id: 'break-even', label: 'Break-even', icon: '📈' },
    { id: 'cash-flow', label: 'Cash flow', icon: '💷' },
    { id: 'ratios', label: 'Ratios', icon: '📊' },
    { id: 'depreciation', label: 'Depreciation', icon: '🏭' }
  ];

  function root() { return document.getElementById('calc-root'); }

  function field(label, id, placeholder, hint) {
    return '<label class="calc-field"><span class="calc-fld-label">' + esc(label) + '</span>' +
      '<input class="calc-input" id="' + id + '" inputmode="decimal" placeholder="' + esc(placeholder || '') + '">' +
      (hint ? '<span class="calc-fld-hint">' + esc(hint) + '</span>' : '') + '</label>';
  }

  function resultRow(label, value, strong) {
    return '<div class="calc-result-row' + (strong ? ' strong' : '') + '"><span>' + esc(label) + '</span><b>' + value + '</b></div>';
  }

  /* ---------- AI Examiner ---------- */
  async function askExaminer(prompt) {
    const out = document.getElementById('calc-ai-out');
    if (!window.RA10) { out.innerHTML = '<p class="calc-ai-note">AI Examiner is unavailable right now.</p>'; return; }
    out.innerHTML = '<p class="calc-ai-note">Thinking…</p>';
    try {
      const res = await RA10.examineAnswer({ question: { question: prompt, command_verb: 'Calculate', marks: 0, type: 'calculation' }, answer: '' });
      const text = (res && (res.feedback || res.analysis || res.summary || res.result)) || (typeof res === 'string' ? res : 'Here are the steps: ' + prompt);
      out.innerHTML = '<div class="calc-ai-card"><b>AI Examiner</b><p>' + esc(String(text).slice(0, 800)) + '</p></div>';
    } catch (e) {
      out.innerHTML = '<p class="calc-ai-note">AI Examiner error: ' + esc(e.message || 'unknown') + '</p>';
    }
  }

  /* ---------- Break-even ---------- */
  function renderBreakEven() {
    return '<div class="calc-panel">' +
      '<h3 class="calc-h">Break-even calculator</h3>' +
      '<p class="calc-sub">Enter selling price, variable cost per unit and fixed costs to work out the break-even output and margin of safety.</p>' +
      '<div class="calc-grid">' +
        field('Selling price per unit (£)', 'be-price', '25') +
        field('Variable cost per unit (£)', 'be-vc', '15') +
        field('Fixed costs (£)', 'be-fc', '40000') +
        field('Actual/forecast output (units)', 'be-actual', '5000') +
      '</div>' +
      '<div class="calc-actions"><button class="btn primary" id="be-go">Calculate</button>' +
      '<button class="btn" id="be-ai">✨ AI Examiner help</button></div>' +
      '<div class="calc-results" id="be-results"></div>' +
      '<div id="calc-ai-out"></div>' +
    '</div>';
  }

  function calcBreakEven() {
    const price = num(document.getElementById('be-price').value);
    const vc = num(document.getElementById('be-vc').value);
    const fc = num(document.getElementById('be-fc').value);
    const actual = num(document.getElementById('be-actual').value);
    const contrib = price - vc;
    const bep = contrib > 0 ? fc / contrib : 0;
    const mos = actual - bep;
    const profit = contrib > 0 ? (actual - bep) * contrib : 0;
    let html = '<div class="calc-steps">';
    html += '<p><b>Contribution per unit</b> = £' + fmtNum(price) + ' − £' + fmtNum(vc) + ' = <b>' + fmt(contrib) + '</b></p>';
    html += '<p><b>Break-even output</b> = £' + fmtNum(fc, 0) + ' ÷ £' + fmtNum(contrib) + ' = <b>' + fmtNum(bep, 0) + ' units</b></p>';
    html += '<p><b>Margin of safety</b> = ' + fmtNum(actual, 0) + ' − ' + fmtNum(bep, 0) + ' = <b>' + fmtNum(mos, 0) + ' units</b></p>';
    html += '<p><b>Profit</b> = ' + fmtNum(mos, 0) + ' × £' + fmtNum(contrib) + ' = <b>' + fmt(profit) + '</b></p>';
    html += '</div>';
    document.getElementById('be-results').innerHTML = html;
    document.getElementById('calc-ai-out').innerHTML = '';
  }

  /* ---------- Cash flow ---------- */
  function renderCashFlow() {
    return '<div class="calc-panel">' +
      '<h3 class="calc-h">Cash flow calculator</h3>' +
      '<p class="calc-sub">Work out net cash flow and closing balance for a single period.</p>' +
      '<div class="calc-grid">' +
        field('Opening balance (£)', 'cf-open', '2000') +
        field('Total cash inflows (£)', 'cf-in', '28000') +
        field('Total cash outflows (£)', 'cf-out', '20000') +
      '</div>' +
      '<div class="calc-actions"><button class="btn primary" id="cf-go">Calculate</button>' +
      '<button class="btn" id="cf-ai">✨ AI Examiner help</button></div>' +
      '<div class="calc-results" id="cf-results"></div>' +
      '<div id="calc-ai-out"></div>' +
    '</div>';
  }

  function calcCashFlow() {
    const open = num(document.getElementById('cf-open').value);
    const inflow = num(document.getElementById('cf-in').value);
    const outflow = num(document.getElementById('cf-out').value);
    const net = inflow - outflow;
    const closing = open + net;
    const html = '<div class="calc-steps">' +
      '<p><b>Net cash flow</b> = £' + fmtNum(inflow, 0) + ' − £' + fmtNum(outflow, 0) + ' = <b>' + fmt(net) + '</b></p>' +
      '<p><b>Closing balance</b> = £' + fmtNum(open, 0) + ' + £' + fmtNum(net, 0) + ' = <b>' + fmt(closing) + '</b></p>' +
      (closing < 0 ? '<p class="calc-warn">⚠ Closing balance is negative — the business may need an overdraft or other finance.</p>' : '') +
      '</div>';
    document.getElementById('cf-results').innerHTML = html;
    document.getElementById('calc-ai-out').innerHTML = '';
  }

  /* ---------- Ratios ---------- */
  function renderRatios() {
    return '<div class="calc-panel">' +
      '<h3 class="calc-h">Ratio calculator</h3>' +
      '<p class="calc-sub">Enter values from an income statement and statement of financial position to calculate profitability and liquidity ratios.</p>' +
      '<div class="calc-grid">' +
        field('Revenue (£)', 'r-rev', '180000') +
        field('Gross profit (£)', 'r-gp', '72000') +
        field('Net profit (£)', 'r-np', '25000') +
        field('Operating profit (£)', 'r-op', '34000') +
        field('Current assets (£)', 'r-ca', '37000') +
        field('Inventories (£)', 'r-inv', '15000') +
        field('Current liabilities (£)', 'r-cl', '17000') +
        field('Capital employed (£)', 'r-ce', '82000') +
      '</div>' +
      '<div class="calc-actions"><button class="btn primary" id="r-go">Calculate</button>' +
      '<button class="btn" id="r-ai">✨ AI Examiner help</button></div>' +
      '<div class="calc-results" id="r-results"></div>' +
      '<div id="calc-ai-out"></div>' +
    '</div>';
  }

  function calcRatios() {
    const rev = num(document.getElementById('r-rev').value);
    const gp = num(document.getElementById('r-gp').value);
    const np = num(document.getElementById('r-np').value);
    const op = num(document.getElementById('r-op').value);
    const ca = num(document.getElementById('r-ca').value);
    const inv = num(document.getElementById('r-inv').value);
    const cl = num(document.getElementById('r-cl').value);
    const ce = num(document.getElementById('r-ce').value);
    const gpm = rev ? gp / rev * 100 : 0;
    const npm = rev ? np / rev * 100 : 0;
    const roce = ce ? op / ce * 100 : 0;
    const current = cl ? ca / cl : 0;
    const acid = cl ? (ca - inv) / cl : 0;
    const html = '<div class="calc-steps">' +
      '<p><b>Gross profit margin</b> = ' + fmt(gp, 0) + ' ÷ ' + fmt(rev, 0) + ' × 100 = <b>' + fmtNum(gpm) + '%</b></p>' +
      '<p><b>Net profit margin</b> = ' + fmt(np, 0) + ' ÷ ' + fmt(rev, 0) + ' × 100 = <b>' + fmtNum(npm) + '%</b></p>' +
      '<p><b>ROCE</b> = ' + fmt(op, 0) + ' ÷ ' + fmt(ce, 0) + ' × 100 = <b>' + fmtNum(roce) + '%</b></p>' +
      '<p><b>Current ratio</b> = ' + fmt(ca, 0) + ' ÷ ' + fmt(cl, 0) + ' = <b>' + fmtNum(current) + ' : 1</b></p>' +
      '<p><b>Acid test ratio</b> = (' + fmt(ca, 0) + ' − ' + fmt(inv, 0) + ') ÷ ' + fmt(cl, 0) + ' = <b>' + fmtNum(acid) + ' : 1</b></p>' +
      '</div>';
    document.getElementById('r-results').innerHTML = html;
    document.getElementById('calc-ai-out').innerHTML = '';
  }

  /* ---------- Depreciation ---------- */
  function renderDepreciation() {
    return '<div class="calc-panel">' +
      '<h3 class="calc-h">Depreciation calculator</h3>' +
      '<p class="calc-sub">Calculate straight-line or reducing-balance depreciation.</p>' +
      '<div class="calc-grid">' +
        field('Cost (£)', 'd-cost', '20000') +
        field('Residual value (£)', 'd-residual', '2000') +
        field('Useful life (years)', 'd-life', '6') +
        field('Depreciation rate (%) — for reducing balance', 'd-rate', '25') +
      '</div>' +
      '<div class="calc-actions"><button class="btn primary" id="d-go-sl">Straight-line</button>' +
      '<button class="btn" id="d-go-rb">Reducing balance</button>' +
      '<button class="btn" id="d-ai">✨ AI Examiner help</button></div>' +
      '<div class="calc-results" id="d-results"></div>' +
      '<div id="calc-ai-out"></div>' +
    '</div>';
  }

  function calcDepreciationSL() {
    const cost = num(document.getElementById('d-cost').value);
    const residual = num(document.getElementById('d-residual').value);
    const life = num(document.getElementById('d-life').value);
    const annual = life ? (cost - residual) / life : 0;
    let html = '<div class="calc-steps">';
    html += '<p><b>Annual depreciation</b> = (£' + fmtNum(cost, 0) + ' − £' + fmtNum(residual, 0) + ') ÷ ' + fmtNum(life, 0) + ' = <b>' + fmt(annual) + ' per year</b></p>';
    let nbv = cost;
    for (let y = 1; y <= Math.min(life, 6); y++) {
      nbv -= annual;
      html += '<p>Year ' + y + ' NBV = <b>' + fmt(nbv) + '</b></p>';
    }
    html += '</div>';
    document.getElementById('d-results').innerHTML = html;
    document.getElementById('calc-ai-out').innerHTML = '';
  }

  function calcDepreciationRB() {
    const cost = num(document.getElementById('d-cost').value);
    const rate = num(document.getElementById('d-rate').value) / 100;
    let html = '<div class="calc-steps">';
    let nbv = cost;
    for (let y = 1; y <= 6; y++) {
      const dep = nbv * rate;
      nbv -= dep;
      html += '<p>Year ' + y + ': depreciation = £' + fmtNum(nbv + dep, 0) + ' × ' + fmtNum(rate * 100) + '% = <b>' + fmt(dep) + '</b>; NBV = <b>' + fmt(nbv) + '</b></p>';
    }
    html += '</div>';
    document.getElementById('d-results').innerHTML = html;
    document.getElementById('calc-ai-out').innerHTML = '';
  }

  /* ---------- Render ---------- */
  function render() {
    const host = root();
    if (!host) return;
    host.innerHTML =
      '<div class="calc-shell">' +
      '<div class="calc-tabs">' + TABS.map(t =>
        '<button class="calc-tab' + (ACTIVE.tab === t.id ? ' active' : '') + '" data-tab="' + t.id + '">' + t.icon + ' ' + esc(t.label) + '</button>'
      ).join('') + '</div>' +
      '<div id="calc-body"></div>' +
      '</div>';

    const body = document.getElementById('calc-body');
    if (ACTIVE.tab === 'break-even') body.innerHTML = renderBreakEven();
    else if (ACTIVE.tab === 'cash-flow') body.innerHTML = renderCashFlow();
    else if (ACTIVE.tab === 'ratios') body.innerHTML = renderRatios();
    else body.innerHTML = renderDepreciation();

    host.querySelectorAll('.calc-tab').forEach(b => {
      b.addEventListener('click', () => { ACTIVE.tab = b.dataset.tab; render(); });
    });

    const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    bind('be-go', calcBreakEven);
    bind('cf-go', calcCashFlow);
    bind('r-go', calcRatios);
    bind('d-go-sl', calcDepreciationSL);
    bind('d-go-rb', calcDepreciationRB);

    bind('be-ai', () => askExaminer('Explain how to calculate break-even output, contribution per unit and margin of safety, with a worked example.'));
    bind('cf-ai', () => askExaminer('Explain how to calculate net cash flow and closing balance in a cash flow forecast.'));
    bind('r-ai', () => askExaminer('Explain how to calculate and interpret the gross profit margin, net profit margin, ROCE, current ratio and acid test ratio.'));
    bind('d-ai', () => askExaminer('Explain the straight-line and reducing-balance methods of depreciation, with worked examples.'));
  }

  window.initFinanceCalculator = function () {
    render();
  };
})();
