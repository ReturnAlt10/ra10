(function (window, document) {
  // RA10 onboarding + Terms of Service gate.
  // Exposed globally as window.RA10Onboarding.
  //
  //  - New accounts (profiles.onboarding_completed_at is null) get a short
  //    wizard: Terms → Profile → Accessibility → Done.
  //  - Existing accounts that haven't accepted the CURRENT Terms/Privacy
  //    version only see the Terms step — once per version, never again
  //    until legal_documents.version changes.
  //  - Terms-gated features call RA10.requireTerms(), which opens the Terms
  //    step here (directly, or via postMessage from revision iframes).
  if (window.RA10Onboarding) return;

  const PENDING_KEY = 'ra10_onboarding_pending_terms';
  const DISMISS_PREFIX = 'ra10_onboarding_terms_dismissed_';
  const USERNAME_SETUP_DISMISSED_KEY = 'ra10_username_setup_dismissed';
  const FEATURE_LABELS = {
    ai: 'AI features',
    ai_mark: 'AI marking',
    ai_examiner: 'AI Examiner',
    ai_assigner: 'AI Assigner',
    ai_assigner_mark: 'AI Assigner marking',
    practice_question: 'practice questions',
    quiz_question: 'quizzes',
    revision_guide_full: 'full revision guides',
    mock_paper_gen: 'mock papers',
    community: 'the community builder',
    profile_picture: 'profile pictures',
  };

  const CSS = `
.ob-overlay{z-index:2147483620!important}
.ob-modal{max-width:520px!important;width:min(520px,calc(100vw - 24px))!important}
.ob-progress{display:flex;gap:6px;margin:0 0 var(--sp4,1rem);padding:0;list-style:none}
.ob-progress li{flex:1;height:6px;border-radius:999px;background:var(--color-surface-dynamic,#e6e4df)}
.ob-progress li.is-done,.ob-progress li.is-current{background:var(--color-primary,#d20000)}
.ob-step-label{font-size:var(--tx-xs,.8rem);font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--color-text-muted,#7a7974);margin:0 0 4px}
.ob-title{font-family:var(--font-d,Georgia,serif);font-size:var(--tx-xl,1.8rem);font-weight:400;line-height:1.15;margin:0 0 var(--sp2,.5rem)}
.ob-title:focus{outline:none}
.ob-lead{color:var(--color-text-muted,#7a7974);font-size:var(--tx-sm,.95rem);margin:0 0 var(--sp4,1rem)}
.ob-points{margin:0 0 var(--sp4,1rem);padding:var(--sp4,1rem) var(--sp4,1rem) var(--sp4,1rem) calc(var(--sp4,1rem) + 1.1em);border:1px solid var(--color-border,#d4d1ca);border-radius:14px;background:var(--color-surface-offset,#f3f0ec);font-size:var(--tx-sm,.95rem)}
.ob-points li{margin-bottom:4px}
.ob-changes{margin:0 0 var(--sp4,1rem);padding:var(--sp3,.75rem) var(--sp4,1rem);border-left:4px solid var(--color-primary,#d20000);background:var(--color-primary-highlight,#f4d4d4);border-radius:0 12px 12px 0;font-size:var(--tx-sm,.95rem);color:var(--color-text,#28251d)}
.ob-changes p{margin:0}
.ob-doc-links{display:flex;flex-wrap:wrap;gap:var(--sp2,.5rem);margin:0 0 var(--sp4,1rem)}
.ob-doc-links a{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:8px 14px;border:1px solid var(--color-border,#d4d1ca);border-radius:999px;color:var(--color-text,#28251d);text-decoration:none;font-size:var(--tx-sm,.95rem);font-weight:600}
.ob-doc-links a:hover{background:var(--color-surface-offset,#f3f0ec)}
.ob-check{display:flex;align-items:flex-start;gap:12px;padding:12px;border:1px solid var(--color-border,#d4d1ca);border-radius:12px;margin-bottom:8px;cursor:pointer;font-size:var(--tx-sm,.95rem);line-height:1.45}
.ob-check input{flex:none;width:22px;height:22px;margin:0;accent-color:var(--color-primary,#d20000);cursor:pointer}
.ob-check a{color:var(--color-primary,#d20000)}
.ob-check.is-invalid{border-color:var(--color-error,#c62828);background:var(--color-error-soft,#fce8e8)}
.ob-error{display:none;color:var(--color-error,#c62828);font-size:var(--tx-sm,.95rem);font-weight:600;margin:var(--sp2,.5rem) 0}
.ob-error.show{display:block}
.ob-actions{display:flex;flex-wrap:wrap;gap:var(--sp3,.75rem);align-items:center;margin-top:var(--sp4,1rem)}
.ob-actions .auth-submit-btn{flex:1 1 200px;width:auto;margin:0}
.ob-secondary{min-height:44px;padding:var(--sp3,.75rem) var(--sp4,1rem);border-radius:var(--radius-md,.5rem);border:1px solid var(--color-border,#d4d1ca);background:transparent;color:var(--color-text-muted,#7a7974);font-size:var(--tx-sm,.95rem);cursor:pointer}
.ob-secondary:hover{color:var(--color-text,#28251d);background:var(--color-surface-offset,#f3f0ec)}
.ob-hint{font-size:var(--tx-xs,.8rem);color:var(--color-text-muted,#7a7974);margin-top:4px}
.ob-a11y-grid{display:grid;gap:8px;margin-bottom:var(--sp3,.75rem)}
.ob-a11y-row{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:52px;padding:10px 12px;border:1px solid var(--color-border,#d4d1ca);border-radius:12px;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
.ob-a11y-row[aria-pressed="true"]{border-color:var(--color-primary,#d20000);background:var(--color-primary-highlight,#f4d4d4)}
.ob-a11y-row strong{display:block;font-size:var(--tx-sm,.95rem)}
.ob-a11y-row small{display:block;font-size:var(--tx-xs,.8rem);color:var(--color-text-muted,#7a7974)}
.ob-a11y-state{flex:none;font-size:var(--tx-xs,.8rem);font-weight:700;color:var(--color-text-muted,#7a7974)}
.ob-a11y-row[aria-pressed="true"] .ob-a11y-state{color:var(--color-primary,#d20000)}
.ob-size{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px}
.ob-size button{min-height:48px;border:1px solid var(--color-border,#d4d1ca);border-radius:12px;background:transparent;color:inherit;font-weight:700;cursor:pointer}
.ob-size button[aria-pressed="true"]{border-color:var(--color-primary,#d20000);background:var(--color-primary-highlight,#f4d4d4)}
.ob-link-btn{background:none;border:none;padding:0;color:var(--color-primary,#d20000);text-decoration:underline;cursor:pointer;font:inherit;font-size:var(--tx-sm,.95rem)}
.ob-done-mark{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--color-success-highlight,#d4dfcc);color:var(--color-success,#437a22);margin-bottom:var(--sp4,1rem)}
`;

  let overlay = null;
  let lastFocus = null;
  let checking = false;
  const state = { open: false, steps: [], index: 0, mode: '', feature: '' };

  function sdk() { return window.RA10 || null; }
  function helpers() { return window.__ra10ProfileHelpers || {}; }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function userId() {
    const ra = sdk();
    const session = ra && ra.getSession ? ra.getSession() : null;
    return (session && session.user && session.user.id) || '';
  }

  function userEmail() {
    const ra = sdk();
    const session = ra && ra.getSession ? ra.getSession() : null;
    return String((session && session.user && session.user.email) || '').trim().toLowerCase();
  }

  // If the SQL migration hasn't been applied the column won't exist on the
  // profile; treat everyone as onboarded so we don't wizard existing users.
  function needsWizard() {
    const ra = sdk();
    const profile = ra && ra.getProfile ? ra.getProfile() : null;
    return !!profile && Object.prototype.hasOwnProperty.call(profile, 'onboarding_completed_at') && !profile.onboarding_completed_at;
  }

  function needsTerms() {
    const ra = sdk();
    return !!ra && ra.isLoggedIn() && typeof ra.hasAcceptedTerms === 'function' && !ra.hasAcceptedTerms();
  }

  function dismissedThisSession() {
    try { return sessionStorage.getItem(DISMISS_PREFIX + userId()) === '1'; } catch (e) { return false; }
  }

  function setDismissed() {
    try { sessionStorage.setItem(DISMISS_PREFIX + userId(), '1'); } catch (e) {}
  }

  function clearDismissed() {
    try { sessionStorage.removeItem(DISMISS_PREFIX + userId()); } catch (e) {}
  }

  // Called from the sign-up form: the user ticked the consent box before an
  // account (and session) existed. Recorded server-side on first sign-in.
  function rememberSignupConsent(email) {
    const ra = sdk();
    const status = ra && ra.getLegalStatus ? ra.getLegalStatus() : null;
    if (!status) return;
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify({
        email: String(email || '').trim().toLowerCase(),
        terms: status.terms.version,
        privacy: status.privacy.version,
        at: Date.now(),
      }));
    } catch (e) {}
  }

  async function applyPendingSignupConsent() {
    let pending = null;
    try { pending = JSON.parse(localStorage.getItem(PENDING_KEY) || 'null'); } catch (e) {}
    if (!pending || !pending.email) return;
    const tooOld = !pending.at || (Date.now() - pending.at) > 30 * 24 * 60 * 60 * 1000;
    if (tooOld) {
      try { localStorage.removeItem(PENDING_KEY); } catch (e) {}
      return;
    }
    if (pending.email !== userEmail()) return;
    try { localStorage.removeItem(PENDING_KEY); } catch (e) {}
    if (!needsTerms()) return;
    const status = sdk().getLegalStatus();
    // Only valid if the user agreed to the versions that are still current.
    if (pending.terms !== status.terms.version || pending.privacy !== status.privacy.version) return;
    const result = await sdk().acceptTerms({
      ageConfirmed: true,
      termsVersion: pending.terms,
      privacyVersion: pending.privacy,
    });
    if (result && result.ok) broadcastLegalUpdate();
  }

  function broadcastLegalUpdate() {
    document.querySelectorAll('iframe').forEach(function (frame) {
      try { frame.contentWindow.postMessage({ type: 'RA10_LEGAL_UPDATED' }, window.location.origin); } catch (e) {}
    });
  }

  async function patchProfile(fields) {
    const ra = sdk();
    const session = ra.getSession();
    const id = session && session.user && session.user.id;
    const token = session && session.access_token;
    if (!id || !token) throw new Error('Your session has expired. Please sign in again.');
    const res = await fetch(ra._raw.SUPABASE_URL + '/rest/v1/profiles?id=eq.' + encodeURIComponent(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ra._raw.SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + token,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(fields),
    });
    if (!res.ok) {
      let payload = null;
      try { payload = await res.json(); } catch (e) {}
      throw new Error((payload && payload.message) || 'Could not save. Please try again.');
    }
  }

  // ─── Rendering ─────────────────────────────────────────────────────────────
  function ensureOverlay() {
    if (overlay) return overlay;
    if (!document.getElementById('ob-style')) {
      const style = document.createElement('style');
      style.id = 'ob-style';
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    overlay = document.createElement('div');
    overlay.className = 'auth-overlay ob-overlay';
    overlay.id = 'onboarding-overlay';
    overlay.hidden = true;
    overlay.innerHTML = '<div class="auth-modal ob-modal" role="dialog" aria-modal="true" aria-labelledby="ob-title"></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('keydown', onKeydown);
    return overlay;
  }

  function modal() { return ensureOverlay().querySelector('.ob-modal'); }

  function progressHtml() {
    if (state.steps.length < 2) return '';
    return '<ol class="ob-progress" aria-hidden="true">' + state.steps.map(function (_, i) {
      return '<li class="' + (i < state.index ? 'is-done' : i === state.index ? 'is-current' : '') + '"></li>';
    }).join('') + '</ol>' +
      '<p class="ob-step-label">Step ' + (state.index + 1) + ' of ' + state.steps.length + '</p>';
  }

  function render() {
    const step = state.steps[state.index];
    const body = step === 'terms' ? termsHtml()
      : step === 'profile' ? profileHtml()
      : step === 'personalise' ? personaliseHtml()
      : doneHtml();
    const closable = step !== 'terms';
    modal().innerHTML =
      (closable ? '<button class="auth-close" type="button" data-ob-close aria-label="Close setup">✕</button>' : '') +
      progressHtml() + body;
    bindStep(step);
    const title = modal().querySelector('#ob-title');
    if (title) title.focus();
  }

  function termsHtml() {
    const ra = sdk();
    const status = ra.getLegalStatus();
    const updated = !!status.has_previous_acceptance;
    const feature = state.feature ? (FEATURE_LABELS[state.feature] || 'this feature') : '';
    const changes = [];
    if (updated && status.accepted_terms_version !== status.terms.version && status.terms.change_summary) {
      changes.push('<p><strong>Terms of Service:</strong> ' + esc(status.terms.change_summary) + '</p>');
    }
    if (updated && status.accepted_privacy_version !== status.privacy.version && status.privacy.change_summary) {
      changes.push('<p><strong>Privacy Policy:</strong> ' + esc(status.privacy.change_summary) + '</p>');
    }
    const title = updated ? 'We’ve updated our terms'
      : feature ? 'One quick thing first'
      : state.mode === 'wizard' ? 'Welcome to RA10' : 'Please review our terms';
    const lead = feature
      ? 'To use ' + esc(feature) + ', please review and accept the RA10 Terms of Service and Privacy Policy.'
      : updated
        ? 'Please take a moment to review the changes. You’ll only be asked once for each new version.'
        : 'Before you start, please review how RA10 works and how we look after your data.';

    return '' +
      '<h2 class="ob-title" id="ob-title" tabindex="-1">' + title + '</h2>' +
      '<p class="ob-lead">' + lead + '</p>' +
      (changes.length ? '<div class="ob-changes" role="note" aria-label="What changed">' + changes.join('') + '</div>' : '') +
      '<ul class="ob-points">' +
        '<li>AI marking gives guidance, not official grades — never submit it as your own assessed work.</li>' +
        '<li>Keep usernames, pictures and content appropriate for a school audience.</li>' +
        '<li>We don’t sell your data or use advertising or tracking cookies.</li>' +
        '<li>You can ask us to download or delete your data at any time.</li>' +
      '</ul>' +
      '<div class="ob-doc-links">' +
        '<a href="legal/terms.html" target="_blank" rel="noopener">Read the Terms of Service<span class="ra10-sr-only"> (opens in a new tab)</span></a>' +
        '<a href="legal/privacy.html" target="_blank" rel="noopener">Read the Privacy Policy<span class="ra10-sr-only"> (opens in a new tab)</span></a>' +
      '</div>' +
      '<form id="ob-terms-form" novalidate>' +
        '<label class="ob-check" id="ob-agree-row"><input type="checkbox" id="ob-agree" aria-describedby="ob-terms-error">' +
          '<span>I have read and agree to the <a href="legal/terms.html" target="_blank" rel="noopener">Terms of Service</a> and <a href="legal/privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.</span></label>' +
        '<label class="ob-check" id="ob-age-row"><input type="checkbox" id="ob-age" aria-describedby="ob-terms-error">' +
          '<span>I confirm I am 13 or older.</span></label>' +
        '<div class="ob-error" id="ob-terms-error" role="alert"></div>' +
        '<div class="ob-actions">' +
          '<button class="auth-submit-btn" type="submit" id="ob-accept">Accept and continue</button>' +
          '<button class="ob-secondary" type="button" data-ob-later>Not now</button>' +
        '</div>' +
        '<p class="ob-hint">Until you accept, AI marking, saving progress, the leaderboard and community features stay locked. You can still browse revision content.</p>' +
      '</form>';
  }

  function profileHtml() {
    const profile = sdk().getProfile() || {};
    const name = profile.full_name || profile.display_name || '';
    return '' +
      '<h2 class="ob-title" id="ob-title" tabindex="-1">Set up your profile</h2>' +
      '<p class="ob-lead">This is how you’ll appear on RA10. You can change it any time from your account.</p>' +
      '<form id="ob-profile-form" novalidate>' +
        '<div class="ob-error" id="ob-profile-error" role="alert"></div>' +
        '<div class="auth-field"><label class="auth-label" for="ob-name">Your name</label>' +
          '<input class="auth-input" type="text" id="ob-name" autocomplete="name" maxlength="60" value="' + esc(name) + '" aria-describedby="ob-name-hint">' +
          '<p class="ob-hint" id="ob-name-hint">Only shown to you and, for school accounts, your teacher.</p></div>' +
        '<div class="auth-field"><label class="auth-label" for="ob-username">Username <span style="font-weight:400">(optional)</span></label>' +
          '<input class="auth-input" type="text" id="ob-username" autocomplete="off" maxlength="24" value="' + esc(profile.username || '') + '" aria-describedby="ob-username-hint" spellcheck="false" autocapitalize="none">' +
          '<p class="ob-hint" id="ob-username-hint">Public on the leaderboard. Letters, numbers and underscores. Tip: don’t use your real name.</p></div>' +
        '<div class="ob-actions">' +
          '<button class="auth-submit-btn" type="submit" id="ob-profile-save">Save and continue</button>' +
          '<button class="ob-secondary" type="button" data-ob-next>Skip</button>' +
        '</div>' +
      '</form>';
  }

  function personaliseHtml() {
    const a11y = window.RA10A11y;
    const prefs = a11y ? a11y.get() : {};
    const rows = [
      ['contrast', 'High contrast', 'Darker text and stronger borders'],
      ['reduceMotion', 'Reduce motion', 'Turn off animations'],
      ['readableFont', 'Readable font', 'Easier letter shapes, good for dyslexia'],
      ['underlineLinks', 'Underline links', 'Spot links without relying on colour'],
    ];
    return '' +
      '<h2 class="ob-title" id="ob-title" tabindex="-1">Make RA10 work for you</h2>' +
      '<p class="ob-lead">Choose any settings that help. They’re saved on this device and you can change them any time from “Accessibility settings” in the footer.</p>' +
      (a11y ? (
        '<div role="group" aria-labelledby="ob-size-label">' +
          '<p class="auth-label" id="ob-size-label">Text size</p>' +
          '<div class="ob-size">' +
            [['default', 'A', 'Default'], ['large', 'A+', 'Large'], ['xlarge', 'A++', 'Extra large']].map(function (s) {
              return '<button type="button" data-ob-size="' + s[0] + '" aria-pressed="' + (prefs.textSize === s[0]) + '" aria-label="' + s[2] + ' text">' + s[1] + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="ob-a11y-grid">' + rows.map(function (r) {
          return '<button type="button" class="ob-a11y-row" data-ob-pref="' + r[0] + '" aria-pressed="' + (!!prefs[r[0]]) + '">' +
            '<span><strong>' + r[1] + '</strong><small>' + r[2] + '</small></span>' +
            '<span class="ob-a11y-state" aria-hidden="true">' + (prefs[r[0]] ? 'On' : 'Off') + '</span></button>';
        }).join('') + '</div>' +
        '<button type="button" class="ob-link-btn" data-open-a11y>More accessibility settings</button>'
      ) : '<p class="ob-lead">Accessibility settings are available from the footer.</p>') +
      '<div class="ob-actions">' +
        '<button class="auth-submit-btn" type="button" data-ob-next>Continue</button>' +
      '</div>';
  }

  function doneHtml() {
    return '' +
      '<div class="ob-done-mark" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
      '<h2 class="ob-title" id="ob-title" tabindex="-1">You’re all set</h2>' +
      '<p class="ob-lead">Pick a subject to start revising, or explore your dashboard. Need help? The Help button is always in the corner.</p>' +
      '<div class="ob-actions">' +
        '<button class="auth-submit-btn" type="button" data-ob-finish="/revision">Start revising</button>' +
        '<button class="ob-secondary" type="button" data-ob-finish="/">Go to dashboard</button>' +
      '</div>';
  }

  // ─── Behaviour ─────────────────────────────────────────────────────────────
  function bindStep(step) {
    const root = modal();
    root.querySelectorAll('[data-ob-close]').forEach(function (b) { b.addEventListener('click', function () { close(); }); });
    root.querySelectorAll('[data-ob-later]').forEach(function (b) { b.addEventListener('click', later); });
    root.querySelectorAll('[data-ob-next]').forEach(function (b) { b.addEventListener('click', next); });
    root.querySelectorAll('[data-ob-finish]').forEach(function (b) {
      b.addEventListener('click', function () {
        const path = b.getAttribute('data-ob-finish');
        close();
        if (typeof window.go === 'function') window.go(path);
      });
    });

    if (step === 'terms') {
      root.querySelector('#ob-terms-form').addEventListener('submit', onAccept);
      ['ob-agree', 'ob-age'].forEach(function (id) {
        root.querySelector('#' + id).addEventListener('change', function (e) {
          e.target.closest('.ob-check').classList.remove('is-invalid');
          e.target.removeAttribute('aria-invalid');
        });
      });
    }
    if (step === 'profile') {
      root.querySelector('#ob-profile-form').addEventListener('submit', onSaveProfile);
    }
    if (step === 'personalise') {
      root.querySelectorAll('[data-ob-pref]').forEach(function (b) {
        b.addEventListener('click', function () {
          const key = b.getAttribute('data-ob-pref');
          const on = b.getAttribute('aria-pressed') !== 'true';
          window.RA10A11y.set(key, on);
          b.setAttribute('aria-pressed', String(on));
          b.querySelector('.ob-a11y-state').textContent = on ? 'On' : 'Off';
        });
      });
      root.querySelectorAll('[data-ob-size]').forEach(function (b) {
        b.addEventListener('click', function () {
          window.RA10A11y.set('textSize', b.getAttribute('data-ob-size'));
          root.querySelectorAll('[data-ob-size]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        });
      });
    }
    if (step === 'done') {
      completeOnboarding();
    }
  }

  async function onAccept(e) {
    e.preventDefault();
    const root = modal();
    const agree = root.querySelector('#ob-agree');
    const age = root.querySelector('#ob-age');
    const errorEl = root.querySelector('#ob-terms-error');
    const btn = root.querySelector('#ob-accept');
    errorEl.classList.remove('show');

    const missing = [agree, age].filter(function (input) { return !input.checked; });
    if (missing.length) {
      missing.forEach(function (input) {
        input.closest('.ob-check').classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
      });
      errorEl.textContent = !agree.checked && !age.checked
        ? 'Please tick both boxes to continue.'
        : !agree.checked ? 'Please agree to the Terms of Service and Privacy Policy.' : 'Please confirm you are 13 or older.';
      errorEl.classList.add('show');
      missing[0].focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Saving…';
    let result = null;
    try {
      result = await sdk().acceptTerms({ ageConfirmed: true });
    } catch (err) {
      result = { ok: false, reason: 'error', error: err };
    }
    btn.disabled = false;
    btn.textContent = 'Accept and continue';

    if (!result || !result.ok) {
      if (result && result.reason === 'version_mismatch') {
        // Terms changed while the dialog was open — show the new version.
        render();
        const err = modal().querySelector('#ob-terms-error');
        err.textContent = 'Our terms were just updated. Please review and accept the latest version.';
        err.classList.add('show');
        return;
      }
      errorEl.textContent = 'We couldn’t save that. Please check your connection and try again.';
      errorEl.classList.add('show');
      return;
    }

    clearDismissed();
    broadcastLegalUpdate();
    renderAccountStatus();
    const h = helpers();
    if (state.mode !== 'wizard' && typeof h.showMiniToast === 'function') {
      h.showMiniToast(state.feature ? 'Thanks — you’re good to go' : 'Thanks for accepting');
    }
    if (window.RA10A11y) window.RA10A11y.announce('Terms accepted.');
    next();
  }

  async function onSaveProfile(e) {
    e.preventDefault();
    const root = modal();
    const h = helpers();
    const errorEl = root.querySelector('#ob-profile-error');
    const btn = root.querySelector('#ob-profile-save');
    const nameInput = root.querySelector('#ob-name');
    const usernameInput = root.querySelector('#ob-username');
    errorEl.classList.remove('show');
    [nameInput, usernameInput].forEach(function (i) { i.removeAttribute('aria-invalid'); });

    function fail(message, input) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
      if (input) {
        input.setAttribute('aria-invalid', 'true');
        input.focus();
      }
    }

    const namePolicy = typeof h.validateDisplayName === 'function'
      ? h.validateDisplayName(nameInput.value)
      : { ok: !!nameInput.value.trim(), value: nameInput.value.trim(), error: 'Please enter your name.' };
    if (!namePolicy.ok) return fail(namePolicy.error, nameInput);

    const rawUsername = usernameInput.value.trim();
    const profile = sdk().getProfile() || {};
    let usernamePolicy = null;
    if (rawUsername) {
      usernamePolicy = typeof h.validateUsername === 'function'
        ? h.validateUsername(rawUsername)
        : { ok: true, username: rawUsername.toLowerCase() };
      usernameInput.value = usernamePolicy.username;
      if (!usernamePolicy.ok) return fail(usernamePolicy.error, usernameInput);
    }

    btn.disabled = true;
    btn.textContent = 'Saving…';
    try {
      if (namePolicy.value !== (profile.full_name || '')) {
        await patchProfile({ full_name: namePolicy.value });
      }
      if (usernamePolicy && usernamePolicy.username !== (profile.username || '')) {
        if (typeof h.saveUsernameForCurrentUser === 'function') {
          await h.saveUsernameForCurrentUser(usernamePolicy.username);
        } else {
          await patchProfile({ username: usernamePolicy.username });
        }
      }
      if (!rawUsername && !profile.username) {
        // They chose not to have a username yet — don't nag straight away.
        try { localStorage.setItem(USERNAME_SETUP_DISMISSED_KEY, '1'); } catch (err) {}
      }
      await sdk().refreshProfile();
      if (typeof h.updateNavAuth === 'function') h.updateNavAuth();
      next();
    } catch (err) {
      const taken = err && err.code === 'USERNAME_TAKEN';
      fail(taken ? 'That username is already taken. Try another.' : (err && err.message) || 'Could not save. Please try again.', taken ? usernameInput : null);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Save and continue';
    }
  }

  async function completeOnboarding() {
    if (!needsWizard()) return;
    try {
      await patchProfile({ onboarding_completed_at: new Date().toISOString() });
      await sdk().refreshProfile();
    } catch (err) {
      console.warn('RA10 onboarding: could not mark complete', err);
    }
  }

  function next() {
    if (state.index < state.steps.length - 1) {
      state.index += 1;
      render();
    } else {
      close();
    }
  }

  function later() {
    setDismissed();
    close();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (state.steps[state.index] === 'terms') later();
      else close();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusables = Array.prototype.filter.call(
      modal().querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null; }
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement.id === 'ob-title')) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function open(opts) {
    const options = opts || {};
    const wizard = needsWizard();
    const terms = needsTerms();
    state.feature = options.feature || '';

    if (options.mode === 'terms' || !wizard) {
      if (!terms) return;
      state.mode = 'terms';
      state.steps = ['terms'];
    } else {
      state.mode = 'wizard';
      state.steps = (terms ? ['terms'] : []).concat(['profile', 'personalise', 'done']);
    }
    state.index = 0;

    if (!state.open) lastFocus = document.activeElement;
    ensureOverlay();
    overlay.hidden = false;
    overlay.removeAttribute('hidden');
    overlay.classList.add('open');
    document.body.classList.add('auth-popup-open');
    state.open = true;
    render();
  }

  function close() {
    if (!overlay || !state.open) return;
    const wasWizard = state.mode === 'wizard';
    overlay.classList.remove('open');
    overlay.hidden = true;
    document.body.classList.remove('auth-popup-open');
    state.open = false;

    // Closing the wizard after accepting the terms counts as finishing it;
    // the regular profile prompts will pick up anything that was skipped.
    if (wasWizard && !needsTerms()) {
      completeOnboarding().then(function () {
        const h = helpers();
        if (typeof h.checkProfileCompletion === 'function') h.checkProfileCompletion();
      });
    }
    if (lastFocus && typeof lastFocus.focus === 'function' && document.contains(lastFocus)) lastFocus.focus();
  }

  // Public: open just the Terms step (used by gated features).
  function openTerms(opts) {
    const ra = sdk();
    if (!ra || !ra.isLoggedIn()) {
      const h = helpers();
      if (typeof h.openAuthModal === 'function') h.openAuthModal('signin');
      return;
    }
    if (!needsTerms()) return;
    const feature = (opts && opts.feature) || '';
    if (state.open) {
      const idx = state.steps.indexOf('terms');
      if (idx !== -1 && idx !== state.index) {
        state.index = idx;
        render();
      }
      return;
    }
    open({ mode: needsWizard() ? 'wizard' : 'terms', feature: feature });
  }

  // Run after every auth change.
  async function check() {
    const ra = sdk();
    if (ra && !legalListenerBound && typeof ra.on === 'function') {
      legalListenerBound = true;
      ra.on('legalchange', renderAccountStatus);
    }
    renderAccountStatus();
    if (!ra || !ra.isLoggedIn()) {
      if (state.open) close();
      return;
    }
    if (checking) return;
    checking = true;
    try {
      await applyPendingSignupConsent();
      renderAccountStatus();
      if (state.open) return;
      const wizard = needsWizard();
      const terms = needsTerms();
      if (!wizard && !terms) return;
      if (dismissedThisSession()) return;
      setTimeout(function () {
        if (!state.open && ra.isLoggedIn() && (needsWizard() || needsTerms())) open({});
      }, 600);
    } finally {
      checking = false;
    }
  }

  // ─── Account page: "Terms & privacy" status card ───────────────────────────
  const ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const ICON_WARN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>';
  let legalListenerBound = false;

  function formatDate(value) {
    const d = new Date(value || '');
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function renderAccountStatus() {
    const panel = document.getElementById('account-legal-panel');
    const statusEl = document.getElementById('account-terms-status');
    const iconEl = document.getElementById('account-terms-icon');
    const btn = document.getElementById('account-accept-terms-btn');
    const ra = sdk();
    if (!panel || !statusEl || !btn || !ra || typeof ra.getLegalStatus !== 'function') return;

    if (!ra.isLoggedIn()) {
      panel.classList.remove('is-accepted', 'needs-accept');
      statusEl.textContent = 'Sign in to see your status.';
      btn.hidden = true;
      if (iconEl) iconEl.innerHTML = '';
      return;
    }

    const status = ra.getLegalStatus();
    const accepted = ra.hasAcceptedTerms();
    panel.classList.toggle('is-accepted', accepted);
    panel.classList.toggle('needs-accept', !accepted);
    if (iconEl) iconEl.innerHTML = accepted ? ICON_OK : ICON_WARN;

    if (accepted) {
      const profile = ra.getProfile() || {};
      const when = formatDate(status.accepted_at || profile.terms_accepted_at);
      statusEl.textContent = 'Accepted' + (when ? ' on ' + when : '') + ' (version ' + status.terms.version + ')';
      btn.hidden = true;
    } else {
      statusEl.textContent = status.has_previous_acceptance
        ? 'Updated — please review the new version. Some features are locked until you do.'
        : 'Not accepted yet. AI marking, saving progress, the leaderboard and community features are locked.';
      btn.textContent = status.has_previous_acceptance ? 'Review update' : 'Review & accept';
      btn.hidden = false;
    }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#account-accept-terms-btn')) {
      openTerms({ feature: '' });
    }
  });
  window.addEventListener('hashchange', function () { setTimeout(renderAccountStatus, 0); });

  // True while onboarding owns the profile prompts (name / username), so the
  // older one-off overlays don't stack on top of the wizard.
  function handlesProfile() {
    return state.open || (!!sdk() && sdk().isLoggedIn() && needsWizard() && !dismissedThisSession());
  }

  window.addEventListener('message', function (e) {
    if (e.origin !== window.location.origin || !e.data) return;
    if (e.data.type === 'RA10_OPEN_TERMS') openTerms({ feature: e.data.feature || '' });
  });

  window.RA10Onboarding = {
    check: check,
    open: open,
    openTerms: openTerms,
    close: close,
    handlesProfile: handlesProfile,
    rememberSignupConsent: rememberSignupConsent,
    renderAccountStatus: renderAccountStatus,
    isOpen: function () { return state.open; },
  };
})(window, document);
