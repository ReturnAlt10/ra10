(function (window, document) {
  // RA10 Shared SDK for plain script tag usage.
  // Exposed globally as window.RA10.
  const SUPABASE_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';
  const OWNER_EMAIL = 'mistry.hashim@icloud.com';
  const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';

  const TIER_INFO = {
    free: {
      label: 'Free',
      price: '£0',
      credits: 10,
      resets: 'monthly',
      ads: true,
      description: '10 credits per month, ads shown',
    },
    subject: {
      label: 'Subject',
      price: '£5 one-time',
      credits: 300,
      resets: 'never',
      ads: false,
      description: 'One subject unlocked, 300 one-time credits',
    },
    all_subjects: {
      label: 'All Subjects',
      price: '£20/year',
      credits: 1000,
      resets: 'monthly',
      ads: false,
      description: 'All subjects, 1000 credits per month',
    },
    ultra: {
      label: 'Ultra',
      price: '£30/year',
      credits: Infinity,
      resets: 'unlimited',
      ads: false,
      description: 'Unlimited credits, all subjects and tools',
    },
    school_student: {
      label: 'School Student',
      price: 'Free via teacher',
      credits: 300,
      resets: 'monthly',
      ads: false,
      description: '300 credits per month, no ads',
    },
    school_admin: {
      label: 'School Admin',
      price: '£100/year',
      credits: 300,
      resets: 'monthly',
      ads: false,
      description: 'Admin portal, 300 credits per month',
    },
    owner: {
      label: 'Owner',
      price: 'Unlimited',
      credits: Infinity,
      resets: 'unlimited',
      ads: false,
      description: 'Everything unlocked',
    },
  };

  const ACTION_COSTS = {
    practice_question: 1,
    quiz_question: 1,
    flashcard_flip: 0,
    mock_paper_gen: 5,
    ai_mark: 3,
    whatsapp_export: 2,
    whatsapp_pdf: 3,
  };

  const MONTHLY_TIERS = new Set(['free', 'all_subjects', 'school_student', 'school_admin']);
  const UNLIMITED_TIERS = new Set(['ultra', 'owner']);

  const EVENTS = {
    authchange: [],
    creditschange: [],
  };

  let _supabaseClient = null;
  let _session = null;
  let _profile = null;
  let _scriptLoader = null;
  let _authSubscription = null;

  function _emit(eventName, payload) {
    const listeners = EVENTS[eventName] || [];
    listeners.forEach((callback) => {
      try {
        callback(payload);
      } catch (err) {
        console.warn('RA10 event handler error', eventName, err);
      }
    });
  }

  function _getCost(action) {
    return ACTION_COSTS[action] ?? 0;
  }

  function _getSupabaseFactory() {
    if (window.Supabase && typeof window.Supabase.createClient === 'function') {
      return window.Supabase;
    }
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      return window.supabase;
    }
    return null;
  }

  function _loadSupabaseScript() {
    if (_scriptLoader) {
      return _scriptLoader;
    }

    _scriptLoader = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-ra10-supabase]');
      if (existing) {
        existing.addEventListener('load', () => resolve(_getSupabaseFactory()));
        existing.addEventListener('error', () => reject(new Error('Failed to load Supabase SDK')));
        return;
      }

      const script = document.createElement('script');
      script.setAttribute('src', SUPABASE_CDN);
      script.setAttribute('defer', '');
      script.setAttribute('data-ra10-supabase', 'true');
      script.addEventListener('load', () => resolve(_getSupabaseFactory()));
      script.addEventListener('error', () => reject(new Error('Failed to load Supabase SDK')));
      document.head.appendChild(script);
    });

    return _scriptLoader;
  }

  function _ensureSupabaseClient() {
    if (_supabaseClient) {
      return Promise.resolve(_supabaseClient);
    }

    return _loadSupabaseScript().then((SupabaseFactory) => {
      if (!SupabaseFactory || typeof SupabaseFactory.createClient !== 'function') {
        throw new Error('Supabase SDK did not expose createClient');
      }
      _supabaseClient = SupabaseFactory.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return _supabaseClient;
    });
  }

  function _normalizeTier(tier) {
    return typeof tier === 'string' ? tier : 'free';
  }

  function _getTierDefaults(tier) {
    return TIER_INFO[tier] || TIER_INFO.free;
  }

  function _isMonthlyResetDue(profile) {
    if (!profile || !profile.credits_reset_at) {
      return false;
    }
    const tier = _normalizeTier(profile.tier);
    if (!MONTHLY_TIERS.has(tier)) {
      return false;
    }

    const lastReset = new Date(profile.credits_reset_at);
    if (Number.isNaN(lastReset.getTime())) {
      return false;
    }

    const now = new Date();
    return lastReset.getUTCFullYear() !== now.getUTCFullYear() || lastReset.getUTCMonth() !== now.getUTCMonth();
  }

  function _getResetCreditAmount(tier) {
    if (tier === 'free') {
      return 10;
    }
    if (tier === 'all_subjects') {
      return 1000;
    }
    if (tier === 'school_student' || tier === 'school_admin') {
      return 300;
    }
    return 0;
  }

  async function _ensureProfileRow(user) {
    if (!user || !user.id) {
      return null;
    }
    const client = await _ensureSupabaseClient();
    const { data, error } = await client.from('profiles').select('*').eq('id', user.id).single();
    if (error && error.code !== 'PGRST116') {
      console.warn('RA10 profile fetch error', error);
    }
    if (data) {
      return data;
    }

    const defaultTier = 'free';
    const createdAt = new Date().toISOString();
    const profilePayload = {
      id: user.id,
      email: user.email || '',
      display_name: user.user_metadata?.full_name || user.user_metadata?.display_name || '',
      tier: defaultTier,
      credits: 10,
      credits_reset_at: createdAt,
      stripe_customer_id: null,
      unlocked_subjects: [],
    };
    const insert = await client.from('profiles').insert(profilePayload).select().single();
    if (insert.error) {
      console.warn('RA10 profile create error', insert.error);
      return null;
    }
    return insert.data;
  }

  async function _loadProfileFromSession(session) {
    if (!session?.user) {
      _profile = null;
      return null;
    }

    const user = session.user;
    const client = await _ensureSupabaseClient();
    const { data, error } = await client.from('profiles').select('*').eq('id', user.id).single();
    if (error && error.code !== 'PGRST116') {
      console.warn('RA10 profile load error', error);
    }

    if (data) {
      _profile = data;
    } else {
      _profile = await _ensureProfileRow(user);
    }

    if (_profile) {
      await _maybeResetMonthlyCredits();
    }

    return _profile;
  }

  async function _maybeResetMonthlyCredits() {
    if (!_profile) {
      return;
    }
    const tier = _normalizeTier(_profile.tier);
    if (!_isMonthlyResetDue(_profile)) {
      return;
    }
    const credits = _getResetCreditAmount(tier);
    if (credits === 0) {
      return;
    }

    const client = await _ensureSupabaseClient();
    const now = new Date().toISOString();
    const update = await client.from('profiles').update({ credits, credits_reset_at: now }).eq('id', _profile.id).select().single();
    if (!update.error && update.data) {
      _profile = update.data;
      _emit('creditschange', _profile);
    }
  }

  async function _refreshProfile() {
    if (!_session?.user) {
      _profile = null;
      return null;
    }
    return _loadProfileFromSession(_session);
  }

  async function init() {
    const client = await _ensureSupabaseClient();
    const sessionResult = await client.auth.getSession();
    const session = sessionResult.data?.session || null;
    _session = session;
    _profile = session ? await _loadProfileFromSession(session) : null;

    if (_authSubscription && typeof _authSubscription.unsubscribe === 'function') {
    _authSubscription.unsubscribe();
    }

    if (typeof client.auth.onAuthStateChange === 'function') {
        const { data: { subscription } } = client.auth.onAuthStateChange((event, updatedSession) => {
        _session = updatedSession || null;
        if (_session) {
            _loadProfileFromSession(_session).then(() => {
            _emit('authchange', { event, session: _session, profile: _profile });
            });
        } else {
            _profile = null;
            _emit('authchange', { event, session: null, profile: null });
        }
        });
        _authSubscription = subscription;
    }

    return { session: _session, profile: _profile };
  }

  async function signUp(email, password, displayName) {
    const client = await _ensureSupabaseClient();
    const payload = {
      email: String(email).trim(),
      password: String(password),
      options: {
        data: { display_name: String(displayName || '') },
      },
    };
    const result = await client.auth.signUp(payload);
    if (result.error) {
      return { error: result.error, data: null };
    }

    const user = result.data?.user;
    if (user) {
      const created = await _ensureProfileRow(user);
      _session = result.data.session || null;
      _profile = created;
      _emit('authchange', { event: 'SIGNED_UP', session: _session, profile: _profile });
      return { data: { user, session: _session, profile: _profile }, error: null };
    }
    return { data: result.data, error: null };
  }

  async function signIn(email, password) {
    const client = await _ensureSupabaseClient();
    const result = await client.auth.signInWithPassword({ email: String(email).trim(), password: String(password) });
    if (result.error) {
      return { error: result.error, data: null };
    }
    _session = result.data.session || null;
    _profile = _session ? await _loadProfileFromSession(_session) : null;
    _emit('authchange', { event: 'SIGNED_IN', session: _session, profile: _profile });
    return { data: { session: _session, profile: _profile }, error: null };
  }

  async function signOut() {
    const client = await _ensureSupabaseClient();
    const result = await client.auth.signOut();
    if (result.error) {
      return { error: result.error };
    }
    _session = null;
    _profile = null;
    _emit('authchange', { event: 'SIGNED_OUT', session: null, profile: null });
    return { error: null };
  }

  async function resetPassword(email) {
    const client = await _ensureSupabaseClient();
    if (!client.auth.resetPasswordForEmail) {
      return { error: new Error('Supabase reset password method not available') };
    }
    const result = await client.auth.resetPasswordForEmail(String(email).trim(), {
      redirectTo: window.location.origin + '/#/auth',
    });
    return { error: result.error || null };
  }

  function getSession() {
    return _session;
  }

  function getProfile() {
    return _profile;
  }

  function isLoggedIn() {
    return !!(_session && _session.user);
  }

  function isOwner() {
    return _normalizeTier(_profile?.tier) === 'owner' || _profile?.email === OWNER_EMAIL;
  }

  function isPaid() {
    const tier = _normalizeTier(_profile?.tier);
    return tier !== 'free' && !!_profile;
  }

  function hasNoAds() {
    const tier = _normalizeTier(_profile?.tier);
    return !!_profile && tier !== 'free';
  }

  function getTier() {
    return _normalizeTier(_profile?.tier);
  }

  function getTierInfo() {
    return _getTierDefaults(getTier());
  }

  function getCredits() {
    if (!_profile) {
      return 0;
    }
    if (UNLIMITED_TIERS.has(_normalizeTier(_profile.tier))) {
      return Infinity;
    }
    return Number.isFinite(_profile.credits) ? _profile.credits : 0;
  }

  function canAfford(action) {
    const cost = _getCost(action);
    if (cost === 0) {
      return true;
    }
    if (!_profile) {
      return false;
    }
    if (UNLIMITED_TIERS.has(_normalizeTier(_profile.tier))) {
      return true;
    }
    return getCredits() >= cost;
  }

  async function spendCredits(action) {
    const cost = _getCost(action);
    if (cost === 0) {
      return true;
    }
    if (!isLoggedIn() || !canAfford(action)) {
      return false;
    }
    if (UNLIMITED_TIERS.has(getTier())) {
      return true;
    }

    const current = getCredits();
    const newAmount = Math.max(0, current - cost);
    const client = await _ensureSupabaseClient();
    const result = await client.from('profiles').update({ credits: newAmount }).eq('id', _profile.id).select().single();
    if (result.error || !result.data) {
      console.warn('RA10 spendCredits failed', result.error);
      return false;
    }
    _profile = result.data;
    _emit('creditschange', _profile);
    return true;
  }

  async function awardCredits(amount) {
    const grant = Number(amount) || 0;
    if (grant <= 0 || !isLoggedIn()) {
      return false;
    }
    if (UNLIMITED_TIERS.has(getTier())) {
      return true;
    }
    const current = getCredits();
    const newAmount = current + grant;
    const client = await _ensureSupabaseClient();
    const result = await client.from('profiles').update({ credits: newAmount }).eq('id', _profile.id).select().single();
    if (result.error || !result.data) {
      console.warn('RA10 awardCredits failed', result.error);
      return false;
    }
    _profile = result.data;
    _emit('creditschange', _profile);
    return true;
  }

  async function gate(action, onDenied) {
    if (!isLoggedIn()) {
      if (typeof onDenied === 'function') {
        onDenied('login', action);
      }
      return false;
    }
    if (!canAfford(action)) {
      if (typeof onDenied === 'function') {
        onDenied('credits', action);
      }
      return false;
    }
    return await spendCredits(action);
  }

  function getGuestCredits() {
    return parseInt(localStorage.getItem('ra10_guest_credits') ?? '10');
  }

  function setGuestCredits(n) {
    localStorage.setItem('ra10_guest_credits', String(Math.max(0, n)));
  }

  function spendGuestCredit(action) {
    const cost = ACTION_COSTS[action] ?? 1;
    if (cost === 0) return true;
    const current = getGuestCredits();
    if (current < cost) return false;
    setGuestCredits(current - cost);
    return true;
  }

  function guestGate(action, freeLimit, onDenied) {
    const cost = ACTION_COSTS[action] ?? 1;
    if (cost === 0) return true;
    const current = getGuestCredits();
    if (current < cost) {
      if (typeof onDenied === 'function') onDenied('login', action);
      return false;
    }
    setGuestCredits(current - cost);
    return true;
  }

  function showPaywall(reason, action) {
    const existing = document.getElementById('ra10-paywall-overlay');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'ra10-paywall-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999999;padding:20px;';

    const card = document.createElement('div');
    card.style.cssText = 'background:#ffffff;border-radius:18px;max-width:420px;width:100%;padding:28px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.18);font-family:sans-serif;color:#112;';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '×';
    closeBtn.style.cssText = 'position:absolute;top:14px;right:14px;border:none;background:transparent;font-size:22px;cursor:pointer;color:#444;';
    closeBtn.addEventListener('click', () => overlay.remove());

    const title = document.createElement('h2');
    title.textContent = reason === 'credits' ? 'Need More Credits' : 'Sign In to Continue';
    title.style.margin = '0 0 12px';

    const message = document.createElement('p');
    message.style.margin = '0 0 20px;line-height:1.5;';
    if (reason === 'credits') {
      message.textContent = 'This action requires more credits. Upgrade now to keep going.';
    } else {
      message.textContent = 'You need to sign in before continuing.';
    }

    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.style.cssText = 'background:#1d4ed8;color:#fff;border:none;border-radius:10px;padding:12px 18px;font-size:1rem;cursor:pointer;';
    if (reason === 'credits') {
      actionButton.textContent = 'Upgrade on RA10';
      actionButton.style.cssText = 'background:#f1c40f;color:#2b1700;border:none;border-radius:10px;padding:12px 18px;font-size:1rem;cursor:pointer;';
        actionButton.addEventListener('click', () => {
        const base = (window.top.location.hostname === 'localhost' || window.top.location.hostname === '127.0.0.1')
            ? `http://${window.top.location.host}`
            : 'https://ra10.co.uk';
        window.top.location.href = base + '/#/upgrade';
        });
    } else {
      actionButton.textContent = 'Sign In / Register';
      actionButton.addEventListener('click', () => {
  overlay.remove();
  try {
    if (window.top && window.top !== window) {
      // We are inside an iframe — post a message to the parent
      window.top.postMessage({ type: 'RA10_OPEN_AUTH' }, '*');
    } else {
      // We are the top window
      document.getElementById('auth-overlay')?.classList.add('open');
    }
  } catch(e) {
    window.top.location.hash = '#/auth';
  }
});
    }

    card.appendChild(closeBtn);
    card.appendChild(title);
    card.appendChild(message);
    card.appendChild(actionButton);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    return overlay;
  }

  function renderCreditChip(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return false;
    const loggedIn = isLoggedIn();
    const credits = loggedIn ? getCredits() : getGuestCredits();
    const tierLabel = loggedIn ? getTierInfo().label : 'Guest';
    const creditText = credits === Infinity ? 'Unlimited' : credits + ' credits';

    container.innerHTML = '';
    const chip = document.createElement('div');
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:#f3f4f6;border:1px solid #d1d5db;font-family:sans-serif;font-size:0.85rem;color:#111;cursor:default;';

    const badge = document.createElement('span');
    badge.textContent = tierLabel;
    badge.style.cssText = 'background:#111;color:#fff;border-radius:999px;padding:3px 8px;font-size:0.75rem;font-weight:700;';

    const creditsEl = document.createElement('span');
    creditsEl.textContent = creditText;

    chip.appendChild(badge);
    chip.appendChild(creditsEl);

    if (!loggedIn || getTier() === 'free') {
      const upgradeBtn = document.createElement('a');
      const base = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? window.location.origin : 'https://ra10.co.uk';
      upgradeBtn.href = base + '/#/upgrade';
      upgradeBtn.target = '_top';
      upgradeBtn.textContent = 'Upgrade';
      upgradeBtn.style.cssText = 'background:#f1c40f;color:#2b1700;border-radius:999px;padding:3px 10px;font-size:0.75rem;font-weight:700;text-decoration:none;margin-left:4px;';
      chip.appendChild(upgradeBtn);
    }

    container.appendChild(chip);
    return true;
  }

  async function startCheckout(priceId) {
    if (!isLoggedIn()) {
      throw new Error('Must be signed in to start checkout');
    }
    const token = _session?.access_token;
    if (!token) {
      throw new Error('No auth token available');
    }
    const endpoint = `${SUPABASE_URL}/functions/v1/create-checkout`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({ 
        priceId,
        successUrl: `${window.location.origin}/#/account?upgraded=1`,
        cancelUrl: `${window.location.origin}/#/upgrade`
        }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Checkout request failed: ${text}`);
    }
    const payload = await response.json();
    if (!payload?.url) {
      throw new Error('Checkout response did not return a URL');
    }
    window.location.href = payload.url;
    return payload.url;
  }

  function on(event, callback) {
    if (!EVENTS[event] || typeof callback !== 'function') {
      return false;
    }
    EVENTS[event].push(callback);
    return true;
  }

  function off(event, callback) {
    if (!EVENTS[event] || typeof callback !== 'function') {
      return false;
    }
    const idx = EVENTS[event].indexOf(callback);
    if (idx > -1) {
      EVENTS[event].splice(idx, 1);
      return true;
    }
    return false;
  }

  const RA10 = {
    init,
    signUp,
    signIn,
    signOut,
    resetPassword,
    getSession,
    getProfile,
    isLoggedIn,
    isOwner,
    isPaid,
    hasNoAds,
    getTier,
    getTierInfo,
    getCredits,
    getGuestCredits,
    canAfford,
    spendCredits,
    awardCredits,
    gate,
    guestGate,
    showPaywall,
    renderCreditChip,
    startCheckout,
    on,
    off,
    // Expose internal config for debugging if needed.
    _raw: {
      ACTION_COSTS,
      TIER_INFO,
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      OWNER_EMAIL,
    },
  };

  window.RA10 = window.RA10 || RA10;
  if (window.RA10 !== RA10) {
    Object.assign(window.RA10, RA10);
  }
})(window, document);
