/* RA10 AI Helper — floating "ask AI" button + selection popup for revision pages.
   Loads on revision/unit pages and mirrors the AI Assigner chat experience.
   Uses RA10.askAiAssigner() so auth + tiered credits are handled by the SDK. */
(function () {
  'use strict';
  if (window.__ra10AiHelperLoaded) return;
  window.__ra10AiHelperLoaded = true;

  // Only run on actual revision/unit pages (standalone HTML under /revision/).
  var path = String(location.pathname || '');
  if (!/\/revision\//i.test(path)) return;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  var chatHistory = [];
  var busy = false;
  var statusTimer = null;
  var pendingContext = '';

  // Robot-head logo (matches AI Assigner).
  function aiLogoSvg(size) {
    var s = size || 24;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V4"/><circle cx="12" cy="3" r="1"/>' +
      '<circle cx="9" cy="13" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.4" fill="currentColor" stroke="none"/>' +
      '<path d="M9 17h6"/><path d="M2 11v4M22 11v4"/></svg>';
  }

  // Tier-aware cost for a hint (mirrors ai_assigner_hint).
  function hintCost() {
    var tier = (window.RA10 && typeof RA10.getTier === 'function') ? String(RA10.getTier() || 'free') : 'free';
    if (tier === 'ultra' || tier === 'owner' || tier === 'unlimited' || tier === 'all_marks' || tier === 'unlimited_marks') return 0;
    if (tier === 'all_subjects') return 1;
    if (tier === 'school_student' || tier === 'school_teacher' || tier === 'school_admin') return 1;
    if (tier === 'subject') return 2;
    return 3;
  }

  function injectStyles() {
    if (document.getElementById('ra10-ai-helper-css')) return;
    var css = [
      // Top hint banner
      '.ra10-ai-hint{position:relative;z-index:2147483200;display:flex;align-items:center;gap:10px;width:min(760px,calc(100% - 32px));margin:14px auto 0;padding:11px 14px;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#f5f0ff);border:1px solid #c7d2fe;color:#3730a3;font-size:.82rem;line-height:1.4;box-shadow:0 8px 24px rgba(99,102,241,.18);animation:ra10AiHintIn .4s cubic-bezier(.2,.8,.2,1) both;}',
      '[data-theme="dark"] .ra10-ai-hint{background:linear-gradient(135deg,#21233a,#2a2140);border-color:#4c4f8f;color:#c7d2fe;}',
      '@keyframes ra10AiHintIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}',
      '.ra10-ai-hint-icon{flex-shrink:0;width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#1f6feb,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 10px rgba(31,111,235,.3);}',
      '.ra10-ai-hint-body{flex:1;min-width:0;}',
      '.ra10-ai-hint-body b{font-weight:800;}',
      '.ra10-ai-hint-close{flex-shrink:0;border:none;cursor:pointer;background:transparent;color:#6d28d9;font-size:1rem;font-weight:800;line-height:1;padding:6px;border-radius:8px;transition:background .15s,color .15s;}',
      '[data-theme="dark"] .ra10-ai-hint-close{color:#a78bfa;}',
      '.ra10-ai-hint-close:hover{background:rgba(124,58,237,.12);}',
      '.ra10-ai-fab{position:fixed;right:18px;bottom:18px;z-index:2147483300;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;background:linear-gradient(135deg,#1f6feb,#7c3aed);box-shadow:0 12px 30px rgba(31,111,235,.4);transition:transform .18s ease,box-shadow .18s ease;}',
      '.ra10-ai-fab:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 16px 36px rgba(31,111,235,.5);}',
      '.ra10-ai-fab::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(124,58,237,.45);animation:ra10AifabPulse 2.4s ease-out infinite;}',
      '@keyframes ra10AifabPulse{0%{box-shadow:0 0 0 0 rgba(124,58,237,.45)}70%{box-shadow:0 0 0 14px rgba(124,58,237,0)}100%{box-shadow:0 0 0 0 rgba(124,58,237,0)}}',
      '.ra10-ai-fab .ra10-ai-fab-dot{position:absolute;top:3px;right:3px;width:12px;height:12px;border-radius:50%;background:#34d399;border:2px solid #fff;}',
      // Chat panel
      '.ra10-ai-panel{position:fixed;right:18px;bottom:86px;z-index:2147483350;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100vh - 120px));display:flex;flex-direction:column;background:#fff;color:#1a1a2e;border-radius:20px;border:1px solid #e2e8f0;box-shadow:0 24px 70px rgba(15,23,42,.35);overflow:hidden;transform:translateY(16px) scale(.98);opacity:0;pointer-events:none;transition:transform .22s ease,opacity .22s ease;}',
      '.ra10-ai-panel.open{transform:none;opacity:1;pointer-events:auto;}',
      '[data-theme="dark"] .ra10-ai-panel{background:#1e2129;color:#f1f2f4;border-color:#3d414b;}',
      '.ra10-ai-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-bottom:1px solid #e2e8f0;background:linear-gradient(135deg,#1f6feb,#7c3aed);}',
      '.ra10-ai-head-brand{display:flex;align-items:center;gap:9px;color:#fff;font-weight:800;font-size:.95rem;}',
      '.ra10-ai-head-brand svg{filter:drop-shadow(0 1px 2px rgba(0,0,0,.25));}',
      '.ra10-ai-head-actions{display:flex;align-items:center;gap:6px;}',
      '.ra10-ai-head-btn{display:inline-flex;align-items:center;gap:5px;border:none;cursor:pointer;background:rgba(255,255,255,.16);color:#fff;border-radius:8px;padding:5px 9px;font-size:.72rem;font-weight:700;}',
      '.ra10-ai-head-btn:hover{background:rgba(255,255,255,.26);}',
      '.ra10-ai-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:12px;}',
      '.ra10-ai-msg{max-width:92%;}',
      '.ra10-ai-msg.bot{display:flex;gap:8px;align-items:flex-start;}',
      '.ra10-ai-msg.bot .ra10-ai-avatar{flex-shrink:0;width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#1f6feb,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;margin-top:2px;}',
      '.ra10-ai-msg.user{align-self:flex-end;background:linear-gradient(135deg,#1f6feb,#2563eb);color:#fff;padding:9px 13px;border-radius:14px 14px 4px 14px;font-size:.86rem;line-height:1.5;}',
      '.ra10-ai-bubble{background:#f4f6fb;border-radius:4px 14px 14px 14px;padding:10px 13px;font-size:.86rem;line-height:1.55;color:#1a1a2e;}',
      '[data-theme="dark"] .ra10-ai-bubble{background:#2b303a;color:#e8ebf4;}',
      '.ra10-ai-bubble p{margin:4px 0;}',
      '.ra10-ai-bubble p:first-child{margin-top:0;}',
      '.ra10-ai-bubble ul,.ra10-ai-bubble ol{margin:4px 0;padding-left:18px;}',
      '.ra10-ai-bubble code{background:rgba(0,0,0,.07);padding:1px 5px;border-radius:5px;font-family:ui-monospace,monospace;font-size:.82em;}',
      '[data-theme="dark"] .ra10-ai-bubble code{background:rgba(255,255,255,.14);}',
      '.ra10-ai-bubble pre{background:#0f1115;color:#d6e2f0;padding:10px;border-radius:8px;overflow:auto;font-size:.8em;}',
      '.ra10-ai-thinking{display:flex;align-items:center;gap:8px;color:#64748b;font-size:.82rem;}',
      '[data-theme="dark"] .ra10-ai-thinking{color:#94a3b8;}',
      '.ra10-ai-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 8px;}',
      '.ra10-ai-suggestion{border:1px solid #dbe3f0;background:#fff;color:#334155;border-radius:999px;padding:6px 11px;font-size:.75rem;font-weight:600;cursor:pointer;}',
      '[data-theme="dark"] .ra10-ai-suggestion{background:#2b303a;border-color:#414754;color:#cbd5e1;}',
      '.ra10-ai-suggestion:hover{border-color:#7c3aed;color:#7c3aed;}',
      '.ra10-ai-composer{border-top:1px solid #e2e8f0;padding:10px 12px;}',
      '.ra10-ai-composer-row{display:flex;align-items:flex-end;gap:8px;}',
      '.ra10-ai-composer textarea{flex:1;resize:none;border:1px solid #dbe3f0;background:#f8fafc;color:#1a1a2e;border-radius:12px;padding:10px 12px;font-size:.86rem;line-height:1.4;max-height:130px;font-family:inherit;}',
      '[data-theme="dark"] .ra10-ai-composer textarea{background:#2b303a;border-color:#414754;color:#e8ebf4;}',
      '.ra10-ai-composer textarea:focus{outline:none;border-color:#7c3aed;}',
      '.ra10-ai-send{border:none;cursor:pointer;width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#1f6feb,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
      '.ra10-ai-send:disabled{opacity:.5;cursor:not-allowed;}',
      '.ra10-ai-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 14px;border-top:1px solid #e2e8f0;font-size:.68rem;color:#94a3b8;}',
      '[data-theme="dark"] .ra10-ai-foot{border-color:#3d414b;}',
      '.ra10-ai-cost{font-weight:800;color:#7c3aed;}',
      // Visible highlight for text the user selects
      '::selection{background:#c7d2fe;color:#1a1a2e;}',
      // Selected-text chip shown inside the AI Helper panel
      '.ra10-ai-selected-chip{display:none;align-items:flex-start;gap:8px;margin:0 12px 10px;padding:10px 12px;background:#eef2ff;border:1px solid #c7d2fe;border-left:4px solid #7c3aed;border-radius:10px;font-size:.74rem;color:#334155;}',
      '[data-theme="dark"] .ra10-ai-selected-chip{background:#2b2f4a;border-color:#4c4f8f;border-left-color:#a78bfa;color:#dbe1f4;}',
      '.ra10-ai-selected-chip.visible{display:flex;}',
      '.ra10-ai-selected-chip .ra10-ai-selected-label{display:inline-flex;align-items:center;gap:5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;font-size:.62rem;color:#6d28d9;flex-shrink:0;margin-top:1px;}',
      '[data-theme="dark"] .ra10-ai-selected-chip .ra10-ai-selected-label{color:#c4b5fd;}',
      '.ra10-ai-selected-chip b{margin:0;font-weight:600;line-height:1.4;word-break:break-word;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;}',
      '.ra10-ai-selected-chip button{border:none;background:transparent;color:#94a3b8;cursor:pointer;font-weight:800;flex-shrink:0;font-size:.8rem;line-height:1;padding:1px;margin-top:-1px;}',
      '.ra10-ai-selected-chip button:hover{color:#7c3aed;}',
      // Selection popup
      '.ra10-ai-select-pop{position:absolute;z-index:2147483500;display:none;align-items:center;gap:7px;background:linear-gradient(135deg,#1f6feb,#7c3aed);color:#fff;border-radius:999px;padding:9px 15px 9px 12px;font-size:.82rem;font-weight:800;letter-spacing:.01em;cursor:pointer;box-shadow:0 10px 28px rgba(31,111,235,.55),0 0 0 1px rgba(255,255,255,.28) inset,0 0 18px rgba(124,58,237,.5);transform:translateY(-4px);}',
      '.ra10-ai-select-pop::after{content:"";position:absolute;left:50%;bottom:-5px;width:10px;height:10px;background:#7c3aed;border-radius:2px;transform:translateX(-50%) rotate(45deg);}',
      '.ra10-ai-select-pop.show{display:flex;animation:ra10AiPopIn .16s cubic-bezier(.2,.9,.3,1.2);}',
      '@keyframes ra10AiPopIn{from{opacity:0;transform:translateY(-4px) scale(.85)}to{opacity:1;transform:translateY(-4px) scale(1)}}',
      '.ra10-ai-select-pop:hover{background:linear-gradient(135deg,#2563eb,#a855f7);box-shadow:0 12px 32px rgba(31,111,235,.65),0 0 0 1px rgba(255,255,255,.4) inset,0 0 22px rgba(168,85,247,.6);transform:translateY(-5px);}',
      '.ra10-ai-select-pop svg{filter:drop-shadow(0 1px 2px rgba(0,0,0,.3));}',
      '@media (max-width:640px){.ra10-ai-panel{right:10px;bottom:calc(152px + env(safe-area-inset-bottom,0px));width:calc(100vw - 20px);height:min(520px,calc(100vh - 210px));}.ra10-ai-fab{right:12px;bottom:calc(84px + env(safe-area-inset-bottom,0px));}}'
    ].join('\n');
    var style = document.createElement('style');
    style.id = 'ra10-ai-helper-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildContextFromPage() {
    var parts = [];
    var title = document.title || '';
    if (title) parts.push('Page: ' + title.replace(/\s*[—|-]\s*RA10.*$/, '').trim());
    var h1 = document.querySelector('h1');
    if (h1 && h1.textContent.trim()) parts.push('Topic: ' + h1.textContent.trim());
    var h2s = Array.prototype.slice.call(document.querySelectorAll('h2')).slice(0, 3).map(function (h) { return h.textContent.trim(); }).filter(Boolean);
    if (h2s.length) parts.push('Sections: ' + h2s.join(' | '));
    parts.push('URL: ' + location.pathname);
    return parts.join('\n').slice(0, 2500);
  }

  // Detect the qualification/unit from the URL so the AI is profiled correctly.
  function detectUnit() {
    var p = String(location.pathname || '').toLowerCase();
    if (/\/revision\/btec\/level-3\/it-aaq\/unit-1/.test(p)) return 'it-aaq-unit-1';
    if (/\/revision\/btec\/level-3\/it-aaq\/unit-2/.test(p)) return 'it-aaq-unit-2';
    if (/\/revision\/btec\/level-3\/it-aaq\/unit-3/.test(p)) return 'it-aaq-unit-3';
    if (/\/revision\/btec\/level-3\/it-aaq\/unit-4/.test(p)) return 'it-aaq-unit-4';
    if (/\/revision\/btec\/level-3\/business\/unit-1/.test(p)) return 'business-unit-1';
    if (/\/revision\/btec\/level-3\/business\/unit-2/.test(p)) return 'business-unit-2';
    if (/\/revision\/btec\/level-3\/business\/unit-3/.test(p)) return 'business-unit-3';
    if (/\/revision\/btec\/level-3\/business\/unit-4/.test(p)) return 'business-unit-4';
    if (/\/revision\/btec\/level-3\/sport\/unit-1/.test(p)) return 'sport-unit-1';
    if (/\/revision\/btec\/level-3\/sport\/unit-2/.test(p)) return 'sport-unit-2';
    if (/\/revision\/btec\/level-2\/it\/unit-2/.test(p)) return 'it-l2-unit-2';
    if (/\/revision\/a-level\/business/.test(p)) return 'a-level-business';
    return '';
  }

  function buildSuggestions() {
    return [
      'Summarise this topic in a few bullet points',
      'Give me a simple example of this',
      'What are the key terms I need to remember?',
      'Test me with a quick question on this'
    ];
  }

  function createPanel() {
    injectStyles();
    if (document.getElementById('ra10-ai-panel')) return;

    // Floating button
    var fab = document.createElement('button');
    fab.className = 'ra10-ai-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Ask AI');
    fab.innerHTML = aiLogoSvg(26) + '<span class="ra10-ai-fab-dot"></span>';
    document.body.appendChild(fab);

    // Panel
    var panel = document.createElement('div');
    panel.className = 'ra10-ai-panel';
    panel.id = 'ra10-ai-panel';
    panel.innerHTML =
      '<div class="ra10-ai-head">' +
        '<div class="ra10-ai-head-brand">' + aiLogoSvg(22) + '<span>AI Helper</span></div>' +
        '<div class="ra10-ai-head-actions">' +
          '<button class="ra10-ai-head-btn" id="ra10-ai-newchat" type="button">New chat</button>' +
          '<button class="ra10-ai-head-btn" id="ra10-ai-close" type="button" aria-label="Close">&#10005;</button>' +
        '</div>' +
      '</div>' +
      '<div class="ra10-ai-selected-chip" id="ra10-ai-selected-chip"><span class="ra10-ai-selected-label">&#9889; Selected text</span><b id="ra10-ai-selected-text"></b><button type="button" id="ra10-ai-selected-clear" aria-label="Remove selection">&#10005;</button></div>' +
      '<div class="ra10-ai-msgs" id="ra10-ai-msgs"></div>' +
      '<div class="ra10-ai-suggestions" id="ra10-ai-suggestions"></div>' +
      '<div class="ra10-ai-composer">' +
        '<div class="ra10-ai-composer-row">' +
          '<textarea id="ra10-ai-input" rows="1" placeholder="Ask about this topic&#8230;"></textarea>' +
          '<button class="ra10-ai-send" id="ra10-ai-send" type="button" aria-label="Send">&#8593;</button>' +
        '</div>' +
      '</div>' +
      '<div class="ra10-ai-foot"><span>AI can make mistakes &#8212; check important facts.</span><span class="ra10-ai-cost" id="ra10-ai-cost"></span></div>';
    document.body.appendChild(panel);

    // Selection popup
    var pop = document.createElement('div');
    pop.className = 'ra10-ai-select-pop';
    pop.id = 'ra10-ai-select-pop';
    pop.innerHTML = aiLogoSvg(15) + '<span>Ask AI</span>';
    document.body.appendChild(pop);

    wirePanel();
    wireSelection(pop);
    renderSuggestions();
    updateCost();
    showHintBanner();
    addMsg('bot', 'Hi! I\u2019m your **AI Helper**. Ask me anything about this topic, or select any text on the page and tap **Ask AI** to get an instant explanation. Your first questions use credits from your balance.');
  }

  function showHintBanner() {
    if (document.getElementById('ra10-ai-hint')) return;
    try { if (localStorage.getItem('ra10_ai_hint_dismissed') === '1') return; } catch (e) {}

    var banner = document.createElement('div');
    banner.className = 'ra10-ai-hint';
    banner.id = 'ra10-ai-hint';
    banner.innerHTML =
      '<span class="ra10-ai-hint-icon">' + aiLogoSvg(18) + '</span>' +
      '<span class="ra10-ai-hint-body"><b>Tip:</b> select any text on this page and tap <b>Ask AI</b> to get an instant explanation of it.</span>' +
      '<button class="ra10-ai-hint-close" type="button" aria-label="Dismiss tip">&#10005;</button>';

    // Insert right after the top nav so it sits below the navigation bar.
    var topbar = document.querySelector('header.topbar, .nav, .navbar, .mobile-top-nav');
    if (topbar && topbar.parentNode) {
      topbar.parentNode.insertBefore(banner, topbar.nextSibling);
    } else {
      var first = document.body.firstChild;
      document.body.insertBefore(banner, first);
    }

    banner.querySelector('.ra10-ai-hint-close').addEventListener('click', function () {
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(-6px)';
      banner.style.transition = 'opacity .2s ease, transform .2s ease';
      try { localStorage.setItem('ra10_ai_hint_dismissed', '1'); } catch (e) {}
      setTimeout(function () { if (banner && banner.remove) banner.remove(); }, 220);
    });
  }

  function updateCost() {
    var el = document.getElementById('ra10-ai-cost');
    if (!el) return;
    var cost = hintCost();
    el.textContent = cost <= 0 ? 'Unlimited' : (cost + ' credit' + (cost === 1 ? '' : 's') + ' / question');
  }

  function openPanel() {
    createPanel();
    document.getElementById('ra10-ai-panel').classList.add('open');
    var input = document.getElementById('ra10-ai-input');
    if (input) input.focus();
  }
  function closePanel() {
    var panel = document.getElementById('ra10-ai-panel');
    if (panel) panel.classList.remove('open');
  }

  function wirePanel() {
    var fab = document.querySelector('.ra10-ai-fab');
    var close = document.getElementById('ra10-ai-close');
    var newchat = document.getElementById('ra10-ai-newchat');
    var send = document.getElementById('ra10-ai-send');
    var input = document.getElementById('ra10-ai-input');
    var clearSel = document.getElementById('ra10-ai-selected-clear');

    fab.addEventListener('click', openPanel);
    close.addEventListener('click', closePanel);
    newchat.addEventListener('click', function () { newChat(); });
    clearSel.addEventListener('click', clearSelection);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closePanel();
        hideSelectPop();
      }
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
    });
    input.addEventListener('input', function () {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 130) + 'px';
    });
    send.addEventListener('click', doSend);
  }

  function clearSelection() {
    pendingContext = '';
    var chip = document.getElementById('ra10-ai-selected-chip');
    if (chip) chip.classList.remove('visible');
  }

  function newChat() {
    chatHistory = [];
    pendingContext = '';
    document.getElementById('ra10-ai-msgs').innerHTML = '';
    clearSelection();
    addMsg('bot', 'New chat started. What would you like to ask?');
    renderSuggestions();
  }

  function renderSuggestions() {
    var host = document.getElementById('ra10-ai-suggestions');
    if (!host) return;
    var suggs = buildSuggestions();
    host.innerHTML = suggs.map(function (s) {
      return '<button class="ra10-ai-suggestion" type="button" data-q="' + esc(s) + '">' + esc(s) + '</button>';
    }).join('');
    host.querySelectorAll('.ra10-ai-suggestion').forEach(function (b) {
      b.addEventListener('click', function () {
        host.innerHTML = '';
        var input = document.getElementById('ra10-ai-input');
        if (input) input.value = b.dataset.q;
        doSend();
      });
    });
  }

  function addMsg(role, text) {
    var host = document.getElementById('ra10-ai-msgs');
    if (!host) return;
    var div = document.createElement('div');
    div.className = 'ra10-ai-msg ' + role;
    if (role === 'bot') {
      var avatar = document.createElement('span');
      avatar.className = 'ra10-ai-avatar';
      avatar.innerHTML = aiLogoSvg(15);
      var bubble = document.createElement('div');
      bubble.className = 'ra10-ai-bubble';
      bubble.innerHTML = md(text);
      div.appendChild(avatar);
      div.appendChild(bubble);
    } else {
      div.textContent = text;
    }
    host.appendChild(div);
    host.scrollTop = host.scrollHeight;
    if (role === 'bot' || role === 'user') chatHistory.push({ role: role, content: text });
    if (chatHistory.length > 30) chatHistory = chatHistory.slice(-30);
  }

  function md(text) {
    var s = esc(text);
    // Very small markdown renderer: bold, italics, inline code, bullets, line breaks.
    s = s.replace(/```([\s\S]*?)```/g, function (m, code) { return '<pre>' + esc(code) + '</pre>'; });
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
    s = s.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>');
    s = s.replace(/\n{2,}/g, '</p><p>');
    s = '<p>' + s + '</p>';
    return s;
  }

  function addThinking() {
    var host = document.getElementById('ra10-ai-msgs');
    var div = document.createElement('div');
    div.className = 'ra10-ai-msg bot ra10-ai-thinking';
    div.innerHTML = aiLogoSvg(15) + '<span>Thinking&#8230;</span>';
    host.appendChild(div);
    host.scrollTop = host.scrollHeight;
    return div;
  }

  function doSend() {
    if (busy) return;
    var input = document.getElementById('ra10-ai-input');
    var text = (input.value || '').trim();
    if (!text) return;
    if (!window.RA10 || !RA10.isLoggedIn()) {
      addMsg('bot', 'Please sign in first to use the AI Helper (it uses credits).');
      if (window.RA10 && RA10.showPaywall) RA10.showPaywall('account', 'ai_assigner_hint');
      return;
    }
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('ra10-ai-suggestions').innerHTML = '';
    busy = true;
    document.getElementById('ra10-ai-send').disabled = true;
    addMsg('user', text);
    var think = addThinking();

    var ctx = [buildContextFromPage(), pendingContext ? ('Selected text:\n"' + pendingContext + '"') : ''].filter(Boolean).join('\n\n');

    (async function () {
      try {
        var res = await RA10.askAiAssigner({
          message: text,
          history: chatHistory.slice(-8),
          context: ctx,
          unit: detectUnit()
        });
        if (think && think.remove) think.remove();
        addMsg('bot', res.reply);
        updateCost();
      } catch (e) {
        if (think && think.remove) think.remove();
        addMsg('bot', 'Sorry \u2014 ' + (e && e.message ? e.message : 'something went wrong'));
      } finally {
        busy = false;
        document.getElementById('ra10-ai-send').disabled = false;
      }
    })();
  }

  function wireSelection(pop) {
    document.addEventListener('mouseup', function (e) {
      // Ignore selections inside our own panel/popup.
      if (e.target.closest && (e.target.closest('.ra10-ai-panel') || e.target.closest('.ra10-ai-select-pop') || e.target.closest('.ra10-ai-fab'))) return;
      setTimeout(function () {
        var sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) { hideSelectPop(); return; }
        var text = sel.toString().trim();
        if (text.length < 2 || text.length > 1200) { hideSelectPop(); return; }
        var range = sel.getRangeAt(0);
        var rect = range.getBoundingClientRect();
        if (!rect || (rect.top === 0 && rect.left === 0 && rect.height === 0)) { hideSelectPop(); return; }
        panelSelectionText = text;
        pendingContext = text;
        // Popup is position:fixed (viewport-relative), so use rect directly
        // (no scrollY) with a tiny 4px gap above the selected text.
        var popH = pop.offsetHeight || 32;
        pop.style.top = (rect.top - popH - 4) + 'px';
        var cx = rect.left + Math.min(rect.width, 120) / 2;
        var popW = pop.offsetWidth || 92;
        pop.style.left = Math.max(8, Math.min(cx - popW / 2, window.innerWidth - popW - 8)) + 'px';
        pop.classList.add('show');
      }, 10);
    });

    document.addEventListener('mousedown', function (e) {
      if (e.target.closest && e.target.closest('.ra10-ai-select-pop')) return;
      hideSelectPop();
    });

    pop.addEventListener('click', function () {
      var t = panelSelectionText || pendingContext;
      hideSelectPop();
      openPanel();
      if (t) {
        pendingContext = t;
        var chip = document.getElementById('ra10-ai-selected-chip');
        var chipText = document.getElementById('ra10-ai-selected-text');
        if (chip && chipText) { chipText.textContent = t; chip.classList.add('visible'); }
        var input = document.getElementById('ra10-ai-input');
        if (input) { input.value = 'Explain this to me'; input.focus(); }
      }
    });
  }
  var panelSelectionText = '';
  function hideSelectPop() {
    var pop = document.getElementById('ra10-ai-select-pop');
    if (pop) pop.classList.remove('show');
    // Do NOT clear pendingContext here — it is cleared by clearSelection() or newChat().
  }

  function bootstrap() {
    if (window.RA10 && typeof RA10.askAiAssigner === 'function') { createPanel(); return; }
    // RA10 SDK may load after us; poll briefly.
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (window.RA10 && typeof RA10.askAiAssigner === 'function') { clearInterval(t); createPanel(); }
      else if (tries > 40) clearInterval(t);
    }, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap);
  else bootstrap();
})();