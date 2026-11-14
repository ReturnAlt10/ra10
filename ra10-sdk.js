(function (window, document) {
  // RA10 Shared SDK for plain script tag usage.
  // Exposed globally as window.RA10.
  const SUPABASE_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';
  const OWNER_EMAIL = 'mistry.hashim@icloud.com';
  const OWNER_EMAILS = ['mistry.hashim@icloud.com', 'faiz.mistry@gmail.com'];
  const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js';
  const AUTH_STORAGE_KEY = 'ra10.auth.token';

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
      label: 'Pro',
      price: '£20/year',
      credits: 1000,
      resets: 'monthly',
      ads: false,
      description: 'All subjects unlocked, 1000 credits per month',
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
    school_teacher: {
      label: 'School Teacher',
      price: 'Free via EDU Admin',
      credits: 600,
      resets: 'monthly',
      ads: false,
      description: '600 credits per month, no ads',
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
    revision_guide_full: 10,
    flashcard_flip: 0,
    mock_paper_gen: 5,
    ai_mark: 0, // AI Examiner uses hourly/daily usage limits now, not credits (supabase/sql/ai-usage.sql)
    whatsapp_export: 2,
    whatsapp_pdf: 3,
    wireframe_export: 1,
    sitemap_export: 1,
    code_editor_cloud_project: 0,
  };

  const MONTHLY_TIERS = new Set(['free', 'all_subjects', 'school_student', 'school_teacher', 'school_admin']);
  const UNLIMITED_TIERS = new Set(['ultra', 'owner']);

  // Transition mode: payments are paused while RA10 becomes something new.
  // While this is on, every signed-in user gets unlimited credits and full
  // access to premium features (revision guides, AI marking, etc.) for free.
  // Signing in is still required.
  const TRANSITION_MODE = true;

  const SUBJECT_LABEL_MAP = {
    IT: 'IT',
    'IT AAQ': 'IT',
    'IT UNIT 1': 'IT',
    'IT UNIT 2': 'IT',
    'IT UNIT 3': 'IT',
    'IT AAQ UNIT 1': 'IT',
    'IT AAQ UNIT 2': 'IT',
    'IT AAQ UNIT 3': 'IT',
    BUSINESS: 'Business',
    'BUSINESS LEVEL 3': 'Business',
    SPORT: 'Sport',
    'SPORT UNIT 1': 'Sport',
  };

  const EVENTS = {
    authchange: [],
    creditschange: [],
    streakchange: [],
    legalchange: [],
    termsrequired: [],
    usagechange: [],
  };

  // Only used when the legal_documents table can't be reached (e.g. before
  // supabase/sql/legal-terms-acceptance.sql is applied). The database is the
  // source of truth — keep these in sync when you bump a version there.
  const LEGAL_FALLBACK_VERSIONS = { terms: '2026-10-18', privacy: '2026-10-19' };
  const LEGAL_LOCAL_ACCEPT_PREFIX = 'ra10_legal_accepted_';

  const EXAM_SEASON_BONUS_CREDITS = 50;
  const EXAM_SEASON_BONUS_END_UTC = Date.parse('2026-08-02T00:00:00Z');
  const CREDIT_ACTIVITY_LIMIT = 200;

  let _supabaseClient = null;
  let _session = null;
  let _profile = null;
  let _scriptLoader = null;
  let _authSubscription = null;
  let _legalStatus = null;

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

  /* ── Popups and notices the user has closed ("seen" flags), kept on the account ──
     Every popup already remembers itself with a localStorage key such as
     'ra10_transition_popup_seen_v1'. Those keys are mirrored to profiles.seen_flags
     (supabase/sql/popups-and-profile-cards.sql), and copied back into localStorage when
     the profile loads, so a closed popup stays closed on every browser and device. */
  const SEEN_KEY_RE = /^ra10[_-].*(seen|dismiss|hidden|popup)/i;
  const SEEN_SKIP_RE = /pending|cooldown/i;
  const _rawSetItem = Storage.prototype.setItem;
  let _seenQueue = {};
  let _seenTimer = null;
  let _seenReadyDone = false;
  let _seenReadyResolve = null;
  const _seenReady = new Promise((resolve) => { _seenReadyResolve = resolve; });

  function _isSeenKey(key) { return SEEN_KEY_RE.test(key) && !SEEN_SKIP_RE.test(key); }
  function _seenMarkReady() {
    if (_seenReadyDone) return;
    _seenReadyDone = true;
    _seenReadyResolve();
  }
  setTimeout(_seenMarkReady, 6000);   // never hold popups back for long if sign-in is slow

  async function _seenFlush() {
    if (!_session?.user || !Object.keys(_seenQueue).length) return;
    const items = _seenQueue;
    _seenQueue = {};
    try {
      const client = await _ensureSupabaseClient();
      const { data, error } = await client.rpc('mark_seen', { p_items: items });
      if (error) throw error;
      if (_profile && data && typeof data === 'object') _profile.seen_flags = data;
    } catch (err) {
      // most likely the SQL hasn't been run yet; keep the flags locally and try again later
      _seenQueue = Object.assign(items, _seenQueue);
      console.warn('RA10 could not save closed popups to the account', err && err.message ? err.message : err);
    }
  }
  function _seenQueueKey(key, value) {
    _seenQueue[key] = String(value == null ? '1' : value).slice(0, 2000);
    clearTimeout(_seenTimer);
    _seenTimer = setTimeout(_seenFlush, 800);
  }
  // Mirror every write of a "seen" key, from any script or inline handler.
  try {
    Storage.prototype.setItem = function (key, value) {
      _rawSetItem.call(this, key, value);
      try {
        if (this === window.localStorage && _isSeenKey(String(key))) _seenQueueKey(String(key), value);
      } catch (e) { /* storage unavailable */ }
    };
  } catch (e) { /* locked-down browser: popups just stay per-device */ }

  function _seenAdopt(profile) {
    const flags = profile && profile.seen_flags && typeof profile.seen_flags === 'object' ? profile.seen_flags : {};
    try {
      Object.keys(flags).forEach((key) => {
        if (localStorage.getItem(key) !== String(flags[key])) _rawSetItem.call(localStorage, key, String(flags[key]));
      });
      // popups closed on this device before signing in move onto the account too
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && _isSeenKey(key) && !(key in flags)) _seenQueueKey(key, localStorage.getItem(key));
      }
    } catch (e) { /* storage unavailable */ }
  }

  const seen = {
    // resolves once the account's closed popups have been loaded (or after a few seconds)
    ready: () => _seenReady,
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value == null ? '1' : String(value)); } catch (e) { _seenQueueKey(key, value); } },
  };

  function _getCost(action) {
    return ACTION_COSTS[action] ?? 0;
  }

  function _isExamSeasonBonusActive() {
    return Date.now() < EXAM_SEASON_BONUS_END_UTC;
  }

  function _getStoredCredits() {
    if (!_profile || !Number.isFinite(_profile.credits)) {
      return 0;
    }
    return Math.max(0, Number(_profile.credits) || 0);
  }

  function _getExamBonusUsageKey() {
    const userId = _session?.user?.id || _profile?.id || '';
    return userId ? ('ra10_exam_bonus_used_' + userId) : '';
  }

  function _getExamBonusGrantLoggedKey() {
    const userId = _session?.user?.id || _profile?.id || '';
    return userId ? ('ra10_exam_bonus_grant_logged_' + userId) : '';
  }

  function _getCreditActivityKey() {
    const userId = _session?.user?.id || _profile?.id || '';
    return userId ? ('ra10_credit_activity_' + userId) : '';
  }

  function _getCreditSnapshotKey() {
    const userId = _session?.user?.id || _profile?.id || '';
    return userId ? ('ra10_credit_snapshot_' + userId) : '';
  }

  function _readCreditSnapshot() {
    const key = _getCreditSnapshotKey();
    if (!key) {
      return null;
    }
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || 'null');
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function _writeCreditSnapshot(profile) {
    const key = _getCreditSnapshotKey();
    if (!key || !profile) {
      return;
    }
    const next = {
      credits: Math.max(0, Number(profile.credits || 0)),
      tier: _normalizeTier(profile.tier),
      creditsResetAt: String(profile.credits_reset_at || ''),
      unlimited: !!profile.unlimited_credits,
      ts: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(next));
  }

  function _syncPlanCreditActivity(profile) {
    if (!profile || profile.unlimited_credits || UNLIMITED_TIERS.has(_normalizeTier(profile.tier))) {
      _writeCreditSnapshot(profile);
      return;
    }

    const previous = _readCreditSnapshot();
    const currentCredits = Math.max(0, Number(profile.credits || 0));
    if (previous && Number.isFinite(Number(previous.credits))) {
      const previousCredits = Math.max(0, Number(previous.credits || 0));
      const delta = currentCredits - previousCredits;
      if (delta > 0) {
        const currentTier = _normalizeTier(profile.tier);
        const previousTier = _normalizeTier(previous.tier);
        const resetChanged = String(previous.creditsResetAt || '') !== String(profile.credits_reset_at || '');
        const tierLabel = _getTierDefaults(currentTier).label;
        let source = 'plan_credits';
        let note = tierLabel + ' plan credits added';
        if (resetChanged && MONTHLY_TIERS.has(currentTier) && currentTier === previousTier) {
          source = 'plan_renewal';
          note = tierLabel + ' monthly renewal credits added';
        } else if (currentTier !== previousTier) {
          note = 'Plan changed to ' + tierLabel + ' and credits were added';
        }
        const examBonusRemaining = _getExamBonusRemaining();
        _appendCreditActivity({
          type: 'gain',
          source,
          action: 'plan_topup',
          amount: delta,
          note,
          balanceAfter: currentCredits + examBonusRemaining,
          storedAfter: currentCredits,
          examBonusRemainingAfter: examBonusRemaining,
        });
      }
    }

    _writeCreditSnapshot(profile);
  }

  function _readCreditActivity() {
    const key = _getCreditActivityKey();
    if (!key) {
      return [];
    }
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function _writeCreditActivity(entries) {
    const key = _getCreditActivityKey();
    if (!key) {
      return;
    }
    const safe = Array.isArray(entries) ? entries.slice(0, CREDIT_ACTIVITY_LIMIT) : [];
    localStorage.setItem(key, JSON.stringify(safe));
  }

  function _appendCreditActivity(entry) {
    const now = Date.now();
    const breakdown = getCreditBreakdown();
    const computedTotal = breakdown.totalCredits;
    const computedStored = breakdown.storedCredits;
    const computedExamBonusRemaining = breakdown.examBonusRemaining;
    const explicitBalanceAfter = Number(entry?.balanceAfter);
    const explicitStoredAfter = Number(entry?.storedAfter);
    const explicitExamBonusRemainingAfter = Number(entry?.examBonusRemainingAfter);
    const next = {
      id: String(now) + ':' + Math.random().toString(36).slice(2, 8),
      ts: now,
      type: String(entry?.type || 'info'),
      source: String(entry?.source || 'manual'),
      action: String(entry?.action || ''),
      note: String(entry?.note || ''),
      amount: Number(entry?.amount || 0),
      balanceAfter: Number.isFinite(explicitBalanceAfter) ? explicitBalanceAfter : computedTotal,
      storedAfter: Number.isFinite(explicitStoredAfter) ? explicitStoredAfter : computedStored,
      examBonusRemainingAfter: Number.isFinite(explicitExamBonusRemainingAfter)
        ? explicitExamBonusRemainingAfter
        : computedExamBonusRemaining,
    };
    const list = _readCreditActivity();
    list.unshift(next);
    _writeCreditActivity(list);
  }

  function _ensureExamBonusGrantLogged() {
    if (!isLoggedIn() || !_isExamSeasonBonusActive()) {
      return;
    }
    if (UNLIMITED_TIERS.has(_normalizeTier(_profile?.tier))) {
      return;
    }
    const key = _getExamBonusGrantLoggedKey();
    if (!key) {
      return;
    }
    if (localStorage.getItem(key) === '1') {
      return;
    }
    localStorage.setItem(key, '1');
    _appendCreditActivity({
      type: 'gain',
      source: 'exam_season_bonus',
      amount: EXAM_SEASON_BONUS_CREDITS,
      note: 'Exam season bonus awarded',
    });
  }

  function _getExamBonusUsed() {
    const key = _getExamBonusUsageKey();
    if (!key) {
      return 0;
    }
    const raw = Number(localStorage.getItem(key) || '0');
    if (!Number.isFinite(raw)) {
      return 0;
    }
    return Math.max(0, Math.min(EXAM_SEASON_BONUS_CREDITS, Math.floor(raw)));
  }

  function _setExamBonusUsed(value) {
    const key = _getExamBonusUsageKey();
    if (!key) {
      return;
    }
    const safe = Math.max(0, Math.min(EXAM_SEASON_BONUS_CREDITS, Math.floor(Number(value) || 0)));
    localStorage.setItem(key, String(safe));
  }

  function _getExamBonusRemaining() {
    if (!isLoggedIn() || !_isExamSeasonBonusActive()) {
      return 0;
    }
    if (UNLIMITED_TIERS.has(_normalizeTier(_profile?.tier))) {
      return 0;
    }
    return Math.max(0, EXAM_SEASON_BONUS_CREDITS - _getExamBonusUsed());
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
        const existingFactory = _getSupabaseFactory();
        if (existingFactory) {
          resolve(existingFactory);
          return;
        }
        existing.addEventListener('load', () => {
          const loadedFactory = _getSupabaseFactory();
          if (loadedFactory) {
            resolve(loadedFactory);
            return;
          }
          reject(new Error('Supabase SDK loaded but createClient was not found'));
        }, { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load Supabase SDK')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.setAttribute('src', SUPABASE_CDN);
      script.setAttribute('defer', '');
      script.setAttribute('data-ra10-supabase', 'true');
      script.addEventListener('load', () => {
        const loadedFactory = _getSupabaseFactory();
        if (loadedFactory) {
          resolve(loadedFactory);
          return;
        }
        reject(new Error('Supabase SDK loaded but createClient was not found'));
      }, { once: true });
      script.addEventListener('error', () => reject(new Error('Failed to load Supabase SDK')), { once: true });
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
      return _createSharedClient(SupabaseFactory);
    });
  }

  // The one Supabase client for the whole site. It reads the signed-in session
  // from AUTH_STORAGE_KEY, so every query runs as the user (RLS applies).
  // A bare `supabase.createClient(url, key)` looks for the session under
  // Supabase's default key, finds none and silently runs as anon — always
  // use RA10.getClient() instead.
  function _createSharedClient(SupabaseFactory) {
    if (_supabaseClient) {
      return _supabaseClient;
    }
    {
      const authStorage = {
        getItem(key) {
          try {
            return window.localStorage.getItem(key);
          } catch (e) {
            return null;
          }
        },
        setItem(key, value) {
          try {
            window.localStorage.setItem(key, value);
          } catch (e) {}
        },
        removeItem(key) {
          try {
            window.localStorage.removeItem(key);
          } catch (e) {}
        },
      };
      _supabaseClient = SupabaseFactory.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          storageKey: AUTH_STORAGE_KEY,
          storage: authStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return _supabaseClient;
    }
  }

  // Synchronous access to the shared, authenticated client (null only if the
  // Supabase library hasn't loaded yet).
  function getClient() {
    if (_supabaseClient) {
      return _supabaseClient;
    }
    const factory = _getSupabaseFactory();
    return factory && typeof factory.createClient === 'function' ? _createSharedClient(factory) : null;
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
    const renewAt = new Date(profile.credits_reset_at);
    if (Number.isNaN(renewAt.getTime())) {
      return false;
    }
    // credits_reset_at is the NEXT renewal date — if it's in the past, reset is due
    return renewAt.getTime() < Date.now();
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
    if (tier === 'school_teacher') {
      return 600;
    }
    return 0;
  }

  function _normalizeSubjectName(subject) {
    const raw = String(subject || '').trim();
    if (!raw) {
      return '';
    }
    const key = raw.toUpperCase();
    return SUBJECT_LABEL_MAP[key] || raw;
  }

  function _normalizeSubjectsList(subjects) {
    if (!Array.isArray(subjects)) {
      return [];
    }
    const unique = new Set();
    subjects.forEach((item) => {
      const normalized = _normalizeSubjectName(item);
      if (normalized) {
        unique.add(normalized);
      }
    });
    return Array.from(unique);
  }

  async function _applySchoolEntitlementByEmail(profile, user) {
    if (!profile || !user?.email) {
      return profile;
    }

    const client = await _ensureSupabaseClient();
    const email = String(user.email).trim().toLowerCase();
    const memberResult = await client
      .from('school_members')
      .select('id, school_id, role, status, subjects, group_name')
      .ilike('email', email)
      .in('status', ['invited', 'active'])
      .in('role', ['student', 'teacher'])
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (memberResult.error) {
      console.warn('RA10 school entitlement lookup error', memberResult.error);
      return profile;
    }
    if (!memberResult.data) {
      // Do not auto-revert on missing member row.
      // School-member visibility/lookups can be delayed or restricted;
      // preserving current profile avoids incorrect free-tier downgrades.
      return profile;
    }

    const member = memberResult.data;
    const role = String(member.role || '').toLowerCase();
    const schoolTier = role === 'teacher' ? 'school_teacher' : 'school_student';
    const schoolCredits = role === 'teacher' ? 600 : 300;
    const mappedSubjects = _normalizeSubjectsList(member.subjects);
    // Attach group info to the in-memory profile (group lives on school_members).
    profile.group_name = member.group_name || null;
    let schoolName = profile.school_name || null;
    if (!schoolName && member.school_id) {
      const schoolResult = await client
        .from('schools')
        .select('name')
        .eq('id', member.school_id)
        .maybeSingle();
      if (!schoolResult.error && schoolResult.data && schoolResult.data.name) {
        schoolName = schoolResult.data.name;
      }
    }

    const needsUpdate =
      profile.tier !== schoolTier
      || Number(profile.credits || 0) !== schoolCredits
      || String(profile.school_id || '') !== String(member.school_id || '')
      || String(profile.school_name || '') !== String(schoolName || '')
      || JSON.stringify(_normalizeSubjectsList(profile.unlocked_subjects)) !== JSON.stringify(mappedSubjects);

    if (!needsUpdate) {
      return profile;
    }

    // Prefer the server-side entitlement RPC (required once the DB
    // privilege-escalation trigger is enabled). Fall back to the legacy direct
    // update only while the RPC is NOT yet deployed (i.e. the RPC call itself
    // threw because the function does not exist). If the RPC exists and denies
    // the request, do NOT attempt a client-side escalation.
    let updatedProfile = null;
    let rpcResult = null;
    let rpcAvailable = true;
    try {
      const rpcRes = await client.rpc('apply_school_entitlement');
      rpcResult = (rpcRes && !rpcRes.error) ? rpcRes.data : null;
    } catch (e) {
      rpcAvailable = false; // function missing / not yet deployed
    }

    // Invitations must be accepted first (popup / email), so an 'invited' row is never applied client-side.
    if ((!rpcAvailable || rpcResult == null) && String(member.status || '').toLowerCase() !== 'active') {
      return profile;
    }
    if (!rpcAvailable || rpcResult == null) {
      const nextReset = new Date();
      nextReset.setUTCMonth(nextReset.getUTCMonth() + 1);
      const updateResult = await client
        .from('profiles')
        .update({
          tier: schoolTier,
          credits: schoolCredits,
          credits_reset_at: nextReset.toISOString(),
          school_id: member.school_id,
          school_name: schoolName,
          unlocked_subjects: mappedSubjects,
        })
        .eq('id', profile.id)
        .select('*')
        .single();

      if (updateResult.error) {
        console.warn('RA10 school entitlement apply error', updateResult.error);
        return profile;
      }
      updatedProfile = updateResult.data || profile;
    } else if (rpcResult.ok) {
      const refreshed = await client
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single();
      updatedProfile = refreshed.data || profile;
    } else {
      // RPC explicitly denied (e.g. no active membership) — leave unchanged.
      updatedProfile = profile;
    }

    // group_name lives on school_members, not profiles — re-attach it.
    if (updatedProfile) updatedProfile.group_name = member.group_name || null;
    return updatedProfile;
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

    const createdAt = new Date();
    createdAt.setUTCMonth(createdAt.getUTCMonth() + 1);
    const emailPrefix = String(user.email || '').split('@')[0] || '';
    const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || emailPrefix;
    const profilePayload = {
      id: user.id,
      email: user.email || '',
      display_name: displayName || '',
      tier: 'free',
      credits: 10,
      credits_reset_at: createdAt.toISOString(),
      unlimited_credits: false,
      unlocked_subjects: [],
    };
    const insert = await client.from('profiles').insert(profilePayload).select().single();
    if (insert.error) {
      console.warn('RA10 profile create error', insert.error);
      return null;
    }
    const withSchoolEntitlement = await _applySchoolEntitlementByEmail(insert.data, user);
    return withSchoolEntitlement;
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
      _profile = await _applySchoolEntitlementByEmail(data, user);
    } else {
      _profile = await _ensureProfileRow(user);
    }

    if (_profile) {
      const tier = _normalizeTier(_profile.tier);
      const createdAtMs = Date.parse(String(_profile.created_at || ''));
      const looksFresh = Number.isFinite(createdAtMs) && (Date.now() - createdAtMs) < (24 * 60 * 60 * 1000);
      if (tier === 'free' && !_profile.unlimited_credits && looksFresh) {
        const stored = Number(_profile.credits || 0);
        if (Number.isFinite(stored) && stored > 10) {
          const client = await _ensureSupabaseClient();
          const nextReset = new Date();
          nextReset.setUTCMonth(nextReset.getUTCMonth() + 1);
          const starterFix = await client
            .from('profiles')
            .update({ credits: 10, credits_reset_at: nextReset.toISOString() })
            .eq('id', _profile.id)
            .select('*')
            .single();
          if (!starterFix.error && starterFix.data) {
            _profile = starterFix.data;
          }
        }
      }
      await _maybeResetMonthlyCredits();
      _syncPlanCreditActivity(_profile);
      _seenAdopt(_profile);
    }

    await _loadLegalStatus();
    return _profile;
  }

  // --- Terms of Service / Privacy Policy acceptance ---
  function _fallbackLegalStatus() {
    const userId = _profile?.id || _session?.user?.id || '';
    let local = null;
    try {
      local = userId ? JSON.parse(localStorage.getItem(LEGAL_LOCAL_ACCEPT_PREFIX + userId) || 'null') : null;
    } catch (e) {}
    const acceptedTerms = _profile?.terms_accepted_version || local?.terms || null;
    const acceptedPrivacy = _profile?.privacy_accepted_version || local?.privacy || null;
    return {
      terms: { version: LEGAL_FALLBACK_VERSIONS.terms, url: '/legal/terms.html', change_summary: null },
      privacy: { version: LEGAL_FALLBACK_VERSIONS.privacy, url: '/legal/privacy.html', change_summary: null },
      signed_in: !!userId,
      accepted_terms_version: acceptedTerms,
      accepted_privacy_version: acceptedPrivacy,
      has_previous_acceptance: !!acceptedTerms,
      onboarding_completed_at: _profile ? (_profile.onboarding_completed_at || null) : null,
      needs_acceptance: !!userId && (acceptedTerms !== LEGAL_FALLBACK_VERSIONS.terms || acceptedPrivacy !== LEGAL_FALLBACK_VERSIONS.privacy),
      fallback: true,
    };
  }

  async function _loadLegalStatus() {
    try {
      const client = await _ensureSupabaseClient();
      const res = await client.rpc('get_legal_status');
      if (res.error || !res.data || !res.data.terms) {
        throw res.error || new Error('get_legal_status unavailable');
      }
      _legalStatus = res.data;
    } catch (e) {
      _legalStatus = _fallbackLegalStatus();
    }
    return _legalStatus;
  }

  function getLegalStatus() {
    return _legalStatus || _fallbackLegalStatus();
  }

  async function refreshLegalStatus() {
    await _loadLegalStatus();
    _emit('legalchange', _legalStatus);
    return _legalStatus;
  }

  function hasAcceptedTerms() {
    if (!isLoggedIn()) return false;
    return !getLegalStatus().needs_acceptance;
  }

  async function acceptTerms(options) {
    if (!isLoggedIn()) {
      return { ok: false, reason: 'not_signed_in' };
    }
    const opts = options || {};
    const status = getLegalStatus();
    const termsVersion = opts.termsVersion || status.terms.version;
    const privacyVersion = opts.privacyVersion || status.privacy.version;
    const client = await _ensureSupabaseClient();
    const res = await client.rpc('accept_legal_terms', {
      p_terms_version: termsVersion,
      p_privacy_version: privacyVersion,
      p_age_confirmed: !!opts.ageConfirmed,
      p_user_agent: String(navigator.userAgent || '').slice(0, 400),
    });

    if (res.error) {
      const code = String(res.error.code || '');
      if (code !== 'PGRST202' && code !== '42883') {
        return { ok: false, reason: 'error', error: res.error };
      }
      // SQL not applied yet: remember acceptance on this device so the user
      // isn't blocked. It's asked again server-side once the SQL is live.
      try {
        localStorage.setItem(LEGAL_LOCAL_ACCEPT_PREFIX + _session.user.id, JSON.stringify({
          terms: termsVersion, privacy: privacyVersion, at: new Date().toISOString(),
        }));
      } catch (e) {}
      _legalStatus = _fallbackLegalStatus();
      _emit('legalchange', _legalStatus);
      return { ok: true, local: true };
    }

    const result = res.data || {};
    if (!result.ok) {
      if (result.reason === 'version_mismatch') {
        await refreshLegalStatus();
      }
      return result;
    }
    await _refreshProfile();
    _emit('legalchange', _legalStatus);
    return result;
  }

  // Returns true when the signed-in user may use terms-gated features.
  // Otherwise asks the page to show the terms dialog (delegating to the main
  // RA10 shell when called from inside a revision iframe) and returns false.
  function requireTerms(feature) {
    if (!isLoggedIn()) return false;
    if (hasAcceptedTerms()) return true;
    _emit('termsrequired', { feature: feature || '' });
    try {
      if (window.top && window.top !== window) {
        window.top.postMessage({ type: 'RA10_OPEN_TERMS', feature: feature || '' }, window.location.origin);
      } else if (window.RA10Onboarding && typeof window.RA10Onboarding.openTerms === 'function') {
        window.RA10Onboarding.openTerms({ feature: feature || '' });
      } else if (!_termsPromptOpen) {
        // A revision page opened on its own, outside the main shell.
        _termsPromptOpen = true;
        const go = window.confirm('To use this feature, please review and accept the RA10 Terms of Service and Privacy Policy. Open RA10 to do that now?');
        setTimeout(() => { _termsPromptOpen = false; }, 30000);
        if (go) window.location.href = window.location.origin + '/#/accept-terms';
      }
    } catch (e) {}
    return false;
  }

  let _termsPromptOpen = false;

  // The main shell tells embedded revision apps when the user accepts.
  window.addEventListener('message', function (e) {
    if (e.origin === window.location.origin && e.data && e.data.type === 'RA10_LEGAL_UPDATED' && isLoggedIn()) {
      refreshLegalStatus();
    }
  });

  function _termsError() {
    const err = new Error('Please accept the RA10 Terms of Service and Privacy Policy to use this feature.');
    err.code = 'terms_required';
    return err;
  }

  function _assertTermsAccepted(feature) {
    if (!requireTerms(feature)) {
      throw _termsError();
    }
  }

  // Edge functions reply 403 { code: 'terms_required' } when the server-side
  // check fails (e.g. terms changed since this page loaded).
  function _throwIfTermsRequired(response, result, feature) {
    if (response.status === 403 && result && result.code === 'terms_required') {
      _loadLegalStatus().finally(() => requireTerms(feature));
      throw _termsError();
    }
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

    // Prefer the server-side reset RPC (required once the DB privilege-
    // escalation trigger is enabled). Fall back to the legacy direct update
    // only while the RPC is NOT yet deployed.
    let updated = null;
    let rpcResult = null;
    let rpcAvailable = true;
    try {
      const rpcRes = await client.rpc('reset_monthly_credits');
      rpcResult = (rpcRes && !rpcRes.error) ? rpcRes.data : null;
    } catch (e) {
      rpcAvailable = false; // function missing / not yet deployed
    }

    // Invitations must be accepted first (popup / email), so an 'invited' row is never applied client-side.
    if ((!rpcAvailable || rpcResult == null) && String(member.status || '').toLowerCase() !== 'active') {
      return profile;
    }
    if (!rpcAvailable || rpcResult == null) {
      const nextReset = new Date();
      nextReset.setUTCMonth(nextReset.getUTCMonth() + 1);
      const update = await client.from('profiles').update({ credits, credits_reset_at: nextReset.toISOString() }).eq('id', _profile.id).select().single();
      if (!update.error && update.data) {
        updated = update.data;
      }
    } else if (rpcResult.ok && !rpcResult.skipped) {
      const refreshed = await client.from('profiles').select('*').eq('id', _profile.id).single();
      updated = refreshed.data || null;
    }

    if (updated) {
      _profile = updated;
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
    try {
      _profile = session ? await _loadProfileFromSession(session) : null;
    } finally {
      _seenMarkReady();
    }
    if (_profile) markStudyDay();

    if (_authSubscription && typeof _authSubscription.unsubscribe === 'function') {
    _authSubscription.unsubscribe();
    }

    if (typeof client.auth.onAuthStateChange === 'function') {
      const { data: { subscription } } = client.auth.onAuthStateChange((event, updatedSession) => {
      if (updatedSession) {
        _session = updatedSession;
        _loadProfileFromSession(_session).then(() => {
        if (_profile) markStudyDay();
        _emit('authchange', { event, session: _session, profile: _profile });
        });
        return;
      }

      if (event === 'SIGNED_OUT') {
        _session = null;
        _profile = null;
        _emit('authchange', { event, session: null, profile: null });
        return;
      }

      client.auth.getSession().then(({ data }) => {
        const confirmedSession = data && data.session ? data.session : null;
        if (confirmedSession) {
        _session = confirmedSession;
        _loadProfileFromSession(_session).then(() => {
          _emit('authchange', { event, session: _session, profile: _profile });
        });
        return;
        }
        _session = null;
        _profile = null;
        _emit('authchange', { event, session: null, profile: null });
      }).catch(() => {
        _session = null;
        _profile = null;
        _emit('authchange', { event, session: null, profile: null });
      });
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
      let created = await _ensureProfileRow(user);
      const createdTier = _normalizeTier(created?.tier);
      if (created && createdTier === 'free' && !created.unlimited_credits) {
        const expectedStarterCredits = 10;
        const currentStarterCredits = Number(created.credits || 0);
        if (!Number.isFinite(currentStarterCredits) || currentStarterCredits !== expectedStarterCredits) {
          const nextReset = new Date();
          nextReset.setUTCMonth(nextReset.getUTCMonth() + 1);
          const starterFix = await client
            .from('profiles')
            .update({ credits: expectedStarterCredits, credits_reset_at: nextReset.toISOString() })
            .eq('id', user.id)
            .select('*')
            .single();
          if (!starterFix.error && starterFix.data) {
            created = starterFix.data;
          }
        }
      }
      _session = result.data.session || null;
      _profile = created;
      _writeCreditSnapshot(_profile);
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
    _writeCreditSnapshot(_profile);
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

  async function updatePassword(newPassword) {
    const client = await _ensureSupabaseClient();
    if (!client.auth.updateUser) {
      return { error: new Error('Supabase update password method not available') };
    }
    const result = await client.auth.updateUser({ password: String(newPassword) });
    return { error: result.error || null };
  }

  // Establish a session from a recovery/invite link's tokens in the URL hash.
  // Supabase appends tokens as a second hash fragment (e.g. #/auth#access_token=...),
  // which detectSessionInUrl can miss. We parse them explicitly and call setSession.
  async function handleRecoveryTokens() {
    const client = await _ensureSupabaseClient();
    const fullHash = window.location.hash || '';
    const lastHashIdx = fullHash.lastIndexOf('#');
    const tokenFragment = lastHashIdx > 0 ? fullHash.slice(lastHashIdx + 1) : fullHash.slice(1);
    const params = new URLSearchParams(tokenFragment);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');
    if (!accessToken || (type !== 'recovery' && type !== 'invite')) {
      return { ok: false, reason: 'no_tokens' };
    }
    try {
      const { data, error } = await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      });
      if (error) {
        return { ok: false, error };
      }
      _session = data.session || null;
      _profile = _session ? await _loadProfileFromSession(_session) : null;
      _emit('authchange', { event: 'PASSWORD_RECOVERY', session: _session, profile: _profile });
      return { ok: true, session: _session };
    } catch (e) {
      return { ok: false, error: e };
    }
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
    return _normalizeTier(_profile?.tier) === 'owner'
      || OWNER_EMAILS.includes((_profile?.email || '').toLowerCase())
      || _profile?.unlimited_credits === true;
  }

  function isPaid() {
    if (TRANSITION_MODE && isLoggedIn()) {
      return true;
    }
    const tier = _normalizeTier(_profile?.tier);
    return tier !== 'free' && !!_profile;
  }

  function hasNoAds() {
    if (TRANSITION_MODE && isLoggedIn()) {
      return true;
    }
    const tier = _normalizeTier(_profile?.tier);
    return !!_profile && tier !== 'free';
  }

  function getTier() {
    return _normalizeTier(_profile?.tier);
  }

  function getTierInfo() {
    if (TRANSITION_MODE && isLoggedIn()) {
      return {
        label: 'Unlimited',
        price: 'Free (transition)',
        credits: Infinity,
        resets: 'unlimited',
        ads: false,
        description: 'Unlimited credits and features while payments are paused',
      };
    }
    return _getTierDefaults(getTier());
  }

  function getCredits() {
    if (!_profile) {
      return 0;
    }
    if (TRANSITION_MODE) {
      return Infinity;
    }
    if (_profile.unlimited_credits) {
      return Infinity;
    }
    _ensureExamBonusGrantLogged();
    return _getStoredCredits() + _getExamBonusRemaining();
  }

  // ── Study streak ─────────────────────────────────────────────────────────
  // Stored on the account (public.study_days, see supabase/sql/study-streak.sql)
  // so it is identical on every device. localStorage is only a per-user cache
  // that lets the number render instantly and survive being offline; days that
  // never reached the server are pushed on the next sync.
  const STREAK_LEGACY_KEY = 'ra10_streak_dates';
  const STREAK_CACHE_PREFIX = 'ra10_study_days:';
  const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
  let _studyDays = null;      // Set of 'YYYY-MM-DD' (device-local calendar days)
  let _studyDaysUser = '';
  let _streakSyncing = null;
  let _streakSyncedAt = 0;

  function _dayKey(date) {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function _streakUserId() {
    return (_session && _session.user && _session.user.id) || '';
  }

  function _loadStudyDays() {
    const uid = _streakUserId();
    if (_studyDays && _studyDaysUser === uid) return _studyDays;
    _studyDaysUser = uid;
    _studyDays = new Set();
    if (!uid) return _studyDays;
    try {
      const parsed = JSON.parse(localStorage.getItem(STREAK_CACHE_PREFIX + uid) || '[]');
      (Array.isArray(parsed) ? parsed : []).forEach(d => { if (DAY_RE.test(d)) _studyDays.add(d); });
    } catch (e) { /* ignore */ }
    return _studyDays;
  }

  function _saveStudyDays() {
    const uid = _streakUserId();
    if (!uid || !_studyDays) return;
    try {
      localStorage.setItem(STREAK_CACHE_PREFIX + uid, JSON.stringify(Array.from(_studyDays).sort().slice(-400)));
    } catch (e) { /* ignore */ }
  }

  function getStudyDays() {
    return Array.from(_loadStudyDays()).sort();
  }

  // Count consecutive days ending today. A streak stays alive until the end of
  // the day after the last visit, so it still shows yesterday's run in the
  // morning. `extraDates` lets callers add account activity timestamps.
  function getStreak(extraDates) {
    if (!isLoggedIn()) return 0;
    const set = new Set(_loadStudyDays());
    (extraDates || []).forEach(v => { const k = DAY_RE.test(String(v)) ? String(v) : _dayKey(v); if (k) set.add(k); });
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    if (!set.has(_dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (set.has(_dayKey(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  async function syncStreak(force) {
    if (!isLoggedIn()) return 0;
    if (_streakSyncing) return _streakSyncing;
    if (!force && Date.now() - _streakSyncedAt < 60000) return getStreak();
    const uid = _streakUserId();
    _streakSyncing = (async () => {
      try {
        const client = await _ensureSupabaseClient();
        const days = _loadStudyDays();
        const since = new Date();
        since.setDate(since.getDate() - 400);
        const { data, error } = await client.from('study_days').select('day').gte('day', _dayKey(since)).order('day', { ascending: false }).limit(450);
        if (error) throw error;
        const server = new Set((data || []).map(r => String(r.day).slice(0, 10)));
        // One-off: carry over streak days recorded on this device before accounts held them.
        try {
          const legacy = JSON.parse(localStorage.getItem(STREAK_LEGACY_KEY) || '[]');
          const floor = _dayKey(since), today = _dayKey(new Date());
          (Array.isArray(legacy) ? legacy : []).forEach(d => { if (DAY_RE.test(d) && d >= floor && d <= today) days.add(d); });
        } catch (e) { /* ignore */ }
        // Push anything the server hasn't got; adopt everything it has.
        const missing = Array.from(days).filter(d => !server.has(d)).sort().slice(-120);
        if (missing.length) {
          const up = await client.from('study_days').upsert(missing.map(d => ({ user_id: uid, day: d })), { onConflict: 'user_id,day', ignoreDuplicates: true });
          if (up.error) throw up.error;
        }
        if (_streakUserId() === uid) {
          server.forEach(d => days.add(d));
          _saveStudyDays();
        }
        _streakSyncedAt = Date.now();
      } catch (e) {
        if (window.console) console.info('RA10: streak sync deferred', e && e.message ? e.message : e);
      } finally {
        _streakSyncing = null;
      }
      _emit('streakchange', { streak: getStreak() });
      return getStreak();
    })();
    return _streakSyncing;
  }

  // Record that the signed-in user studied today, then sync with the account.
  function markStudyDay() {
    if (!isLoggedIn()) return 0;
    const days = _loadStudyDays();
    const today = _dayKey(new Date());
    if (!days.has(today)) {
      days.add(today);
      _saveStudyDays();
      _streakSyncedAt = 0;
    }
    syncStreak();
    return getStreak();
  }

  function getCreditBreakdown() {
    if (!_profile) {
      return {
        totalCredits: 0,
        storedCredits: 0,
        examBonusRemaining: 0,
        examBonusUsed: 0,
        unlimited: false,
      };
    }
    if (TRANSITION_MODE || _profile.unlimited_credits || UNLIMITED_TIERS.has(_normalizeTier(_profile.tier))) {
      return {
        totalCredits: Infinity,
        storedCredits: Infinity,
        examBonusRemaining: 0,
        examBonusUsed: 0,
        unlimited: true,
      };
    }
    _ensureExamBonusGrantLogged();
    const storedCredits = _getStoredCredits();
    const examBonusRemaining = _getExamBonusRemaining();
    return {
      totalCredits: storedCredits + examBonusRemaining,
      storedCredits,
      examBonusRemaining,
      examBonusUsed: _getExamBonusUsed(),
      unlimited: false,
    };
  }

  function getCreditActivity(limit) {
    const max = Math.max(1, Math.min(200, Number(limit || 30)));
    return _readCreditActivity().slice(0, max);
  }

  function canAfford(action) {
    const cost = _getCost(action);
    if (cost === 0) {
      return true;
    }
    if (!_profile) {
      return false;
    }
    if (TRANSITION_MODE || UNLIMITED_TIERS.has(_normalizeTier(_profile.tier))) {
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
    if (TRANSITION_MODE || UNLIMITED_TIERS.has(getTier())) {
      return true;
    }

    const currentBase = _getStoredCredits();
    const bonusRemaining = _getExamBonusRemaining();
    if ((currentBase + bonusRemaining) < cost) {
      return false;
    }

    const fromBonus = Math.min(cost, bonusRemaining);
    const fromBase = cost - fromBonus;
    const newAmount = Math.max(0, currentBase - fromBase);
    if (fromBonus > 0) {
      _setExamBonusUsed(_getExamBonusUsed() + fromBonus);
    }

    const client = await _ensureSupabaseClient();
    const result = await client.from('profiles').update({ credits: newAmount }).eq('id', _profile.id).select().single();
    if (result.error || !result.data) {
      console.warn('RA10 spendCredits failed', result.error);
      if (fromBonus > 0) {
        _setExamBonusUsed(_getExamBonusUsed() - fromBonus);
      }
      return false;
    }
    _profile = result.data;
    _writeCreditSnapshot(_profile);
    if (fromBonus > 0) {
      _appendCreditActivity({
        type: 'spend',
        source: 'exam_season_bonus',
        action,
        amount: -fromBonus,
        note: 'Spent from exam-season bonus',
      });
    }
    if (fromBase > 0) {
      _appendCreditActivity({
        type: 'spend',
        source: 'stored_credits',
        action,
        amount: -fromBase,
        note: 'Spent from account credits',
      });
    }
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
    if (!requireTerms(action)) {
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


  // --- Guest ID and persistent credits ---
  function _getGuestId() {
    // Try cookie first
    const match = document.cookie.match(/(?:^|; )ra10_guest_id=([^;]+)/);
    if (match) return match[1];
    // If not found, generate and set
    const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
    document.cookie = `ra10_guest_id=${uuid}; path=/; max-age=31536000; samesite=strict`;
    return uuid;
  }

  async function getGuestCredits() {
    const guestId = _getGuestId();
    // Try localStorage for fast access
    const local = localStorage.getItem('ra10_guest_credits');
    if (local !== null) {
      const parsed = parseInt(local);
      return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    }
    // Fallback: fetch from server only if localStorage is empty
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/guest_credits?id=eq.${guestId}`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      if (res.ok) {
        const arr = await res.json();
        if (arr && arr[0] && typeof arr[0].credits === 'number') {
          const credits = Math.max(0, arr[0].credits);
          localStorage.setItem('ra10_guest_credits', String(credits));
          return credits;
        }
      }
    } catch (e) {}
    // Default only if localStorage is truly empty AND Supabase has no record
    localStorage.setItem('ra10_guest_credits', '10');
    return 10;
  }

  async function setGuestCredits(n) {
    const credits = Math.max(0, n);
    localStorage.setItem('ra10_guest_credits', String(credits));
    const guestId = _getGuestId();
    // Sync to server
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/guest_credits`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({ id: guestId, credits })
      });
    } catch (e) {}
  }


  async function spendGuestCredit(action) {
    const cost = ACTION_COSTS[action] ?? 1;
    if (cost === 0) return true;
    
    // First check
    let current = await getGuestCredits();
    if (current < cost) return false;
    
    // Double check immediately before spending (prevents race conditions)
    current = await getGuestCredits();
    if (current < cost) return false;
    
    await setGuestCredits(current - cost);
    return true;
  }


  async function guestGate(action, freeLimit, onDenied) {
    const cost = ACTION_COSTS[action] ?? 1;
    if (cost === 0) return true;
    
    // First check
    let current = await getGuestCredits();
    if (current < cost) {
      if (typeof onDenied === 'function') onDenied('credits', action);
      return false;
    }
    
    // Double check immediately before spending (prevents race conditions)
    current = await getGuestCredits();
    if (current < cost) {
      return false; // Silently fail (don't show paywall again)
    }
    
    await setGuestCredits(current - cost);
    return true;
  }

  function showPaywall(reason, action) {
    if (reason === 'terms') {
      requireTerms(action);
      return null;
    }
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

    card.appendChild(closeBtn);
    card.appendChild(title);
    card.appendChild(message);

    if (reason === 'credits') {
      const note = document.createElement('div');
      note.textContent = "features that use credits won't work right now";
      note.style.cssText = 'padding:12px 14px;border-radius:10px;background:#f8fafc;color:#334155;font-size:0.95rem;line-height:1.45;border:1px solid #e2e8f0;';
      card.appendChild(note);
    } else {
      const actionButton = document.createElement('button');
      actionButton.type = 'button';
      actionButton.style.cssText = 'background:#1d4ed8;color:#fff;border:none;border-radius:10px;padding:12px 18px;font-size:1rem;cursor:pointer;';
      actionButton.textContent = 'Sign In / Register';
      actionButton.addEventListener('click', () => {
        overlay.remove();
        try {
          if (window.top && window.top !== window) {
            window.top.postMessage({ type: 'RA10_OPEN_AUTH' }, '*');
          } else {
            document.getElementById('auth-overlay')?.classList.add('open');
          }
        } catch(e) {
          window.top.location.hash = '#/auth';
        }
      });
      card.appendChild(actionButton);
    }

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    return overlay;
  }

  async function renderCreditChip(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return false;
    // Everyone gets unlimited credits now, so the credits widget is hidden everywhere.
    if (TRANSITION_MODE) { container.innerHTML = ''; container.style.display = 'none'; return false; }
    const loggedIn = isLoggedIn();
    const credits = loggedIn ? getCredits() : await getGuestCredits();
    const tierLabel = loggedIn ? getTierInfo().label : 'Guest';
    const creditText = credits === Infinity ? 'Unlimited' : credits + ' credits';

    container.innerHTML = '';
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.title = 'View your credits';
    chip.setAttribute('aria-label', 'View credits: ' + creditText);
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:#f3f4f6;border:1px solid #d1d5db;font-family:sans-serif;font-size:0.85rem;color:#111;cursor:pointer;transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;';
    chip.onmouseenter = () => { chip.style.transform = 'translateY(-1px)'; chip.style.boxShadow = '0 4px 10px rgba(0,0,0,.12)'; chip.style.borderColor = '#9ca3af'; };
    chip.onmouseleave = () => { chip.style.transform = 'none'; chip.style.boxShadow = 'none'; chip.style.borderColor = '#d1d5db'; };

    const badge = document.createElement('span');
    badge.textContent = tierLabel;
    badge.style.cssText = 'background:#111;color:#fff;border-radius:999px;padding:3px 8px;font-size:0.75rem;font-weight:700;';

    const creditsEl = document.createElement('span');
    creditsEl.textContent = creditText;

    const chevron = document.createElement('span');
    chevron.textContent = '▾';
    chevron.style.cssText = 'font-size:0.7rem;color:#6b7280;';

    chip.appendChild(badge);
    chip.appendChild(creditsEl);
    chip.appendChild(chevron);

    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      openCreditsPanel();
    });

    container.appendChild(chip);

    // Mark a data attribute so unit pages can style the injected chip.
    container.setAttribute('data-ra10-credit-chip', '1');
    return true;
  }

  async function openCreditsPanel() {
    // Remove any existing panel
    const existing = document.getElementById('ra10-credit-panel-host');
    if (existing) existing.remove();
    const loggedIn = isLoggedIn();
    const credits = loggedIn ? getCredits() : await getGuestCredits();

    const host = document.createElement('div');
    host.id = 'ra10-credit-panel-host';
    host.style.cssText = 'position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:sans-serif;';

    const backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);';
    backdrop.addEventListener('click', () => host.remove());

    const panel = document.createElement('div');
    panel.style.cssText = 'position:relative;width:min(480px,100%);max-height:86vh;overflow:auto;background:#ffffff;border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.3);z-index:1;transform:translateY(10px);animation:ra10PanelIn .22s ease forwards;';

    // Inject keyframes
    if (!document.getElementById('ra10-panel-keyframes')) {
      const kf = document.createElement('style');
      kf.id = 'ra10-panel-keyframes';
      kf.textContent = '@keyframes ra10PanelIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}';
      document.head.appendChild(kf);
    }

    // ── Header ──
    const header = document.createElement('div');
    header.style.cssText = 'padding:22px 22px 16px;border-bottom:1px solid #eef0f2;display:flex;align-items:center;justify-content:space-between;';
    const headerLeft = document.createElement('div');
    headerLeft.innerHTML = '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#8b8f98;">Credits</div><div style="font-size:15px;font-weight:700;color:#1a1d24;margin-top:2px;">' + (loggedIn ? (getTierInfo().label || 'Account') : 'Guest mode') + '</div>';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.style.cssText = 'width:34px;height:34px;border:none;border-radius:10px;background:#f3f4f6;color:#555;font-size:15px;cursor:pointer;';
    closeBtn.addEventListener('click', () => host.remove());
    header.appendChild(headerLeft);
    header.appendChild(closeBtn);

    // ── Balance ──
    const body = document.createElement('div');
    body.style.cssText = 'padding:20px 22px;';

    if (!loggedIn) {
      body.innerHTML = ''
        + '<div style="border:1.5px dashed #d1d5db;border-radius:14px;padding:18px;text-align:center;margin-bottom:16px;">'
        +   '<div style="font-size:30px;font-weight:800;color:#1a1d24;">' + Math.max(0, Math.floor(Number(credits) || 0)) + '</div>'
        +   '<div style="font-size:12px;color:#8b8f98;margin-top:2px;">guest credits</div>'
        + '</div>'
        + '<p style="font-size:13px;color:#5b5f6a;line-height:1.5;margin:0 0 16px;">Sign in to earn and spend credits across practice, quizzes, mock papers and more.</p>'
        + '<button data-ra10-signin-btn style="width:100%;padding:12px;border:none;border-radius:12px;background:#111;color:#fff;font-size:14px;font-weight:700;cursor:pointer;">Sign in / Register</button>';
      body.querySelector('[data-ra10-signin-btn]').addEventListener('click', () => {
        host.remove();
        if (window.top && window.top !== window) {
          window.top.postMessage({ type: 'RA10_OPEN_AUTH' }, '*');
        } else {
          try { document.getElementById('auth-overlay')?.classList.add('open'); } catch(e) {}
          if (!document.getElementById('auth-overlay')) window.location.hash = '#/auth';
        }
      });
    } else {
      const breakdown = (typeof getCreditBreakdown === 'function') ? getCreditBreakdown() : null;
      const totalCredits = (breakdown && Number.isFinite(breakdown.totalCredits)) ? Number(breakdown.totalCredits) : (Number(getCredits()) || 0);
      const storedCredits = (breakdown && Number.isFinite(breakdown.storedCredits)) ? Number(breakdown.storedCredits) : totalCredits;
      const examBonus = (breakdown && Number.isFinite(breakdown.examBonusRemaining)) ? Number(breakdown.examBonusRemaining) : 0;
      const isUnlimited = !Number.isFinite(totalCredits) || (breakdown && breakdown.unlimited) || getTierInfo().credits === Infinity;

      // Big balance card
      const big = document.createElement('div');
      big.style.cssText = 'background:linear-gradient(135deg,#1a1d24,#2b3450);border-radius:16px;padding:20px;color:#fff;margin-bottom:16px;';
      big.innerHTML = ''
        + '<div style="font-size:12px;opacity:.7;text-transform:uppercase;letter-spacing:.06em;font-weight:700;">Available balance</div>'
        + '<div style="font-size:34px;font-weight:800;line-height:1.1;margin-top:4px;">' + (isUnlimited ? '∞' : Math.max(0, Math.floor(totalCredits))) + (isUnlimited ? '' : '<span style="font-size:16px;font-weight:600;opacity:.7;margin-left:6px;">credits</span>') + '</div>'
        + (isUnlimited ? '<div style="font-size:12px;opacity:.7;margin-top:2px;">Unlimited</div>' : '');

      body.appendChild(big);

      // Breakdown
      if (!isUnlimited) {
        const rows = [];
        if (examBonus > 0) {
          rows.push(['Exam season bonus', Math.floor(examBonus)]);
        }
        rows.push(['Account credits', Math.floor(storedCredits)]);
        const rowHtml = rows.map(([label, val]) =>
          '<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;">'
          +   '<span style="font-size:13px;color:#5b5f6a;">' + label + '</span>'
          +   '<span style="font-size:13px;font-weight:700;color:#1a1d24;">' + val + '</span>'
          + '</div>').join('');
        const bd = document.createElement('div');
        bd.style.cssText = 'background:#f8f9fb;border:1px solid #eef0f2;border-radius:12px;padding:8px 14px;margin-bottom:16px;';
        bd.innerHTML = rowHtml;
        body.appendChild(bd);
      }

      // Renewal info
      const profile = getProfile();
      const resetAt = profile && profile.credits_reset_at;
      let renewalText = null;
      const tier = _normalizeTier(getTier());
      const MONTHLY = ['free', 'all_subjects', 'school_student', 'school_teacher', 'school_admin'];
      if (MONTHLY.indexOf(tier) !== -1 && resetAt) {
        const d = new Date(resetAt);
        if (!Number.isNaN(d.getTime())) {
          renewalText = 'Resets ' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
        }
      }
      if (tier === 'subject') renewalText = 'One-time credits — no monthly reset';
      if (tier === 'ultra' || tier === 'owner') renewalText = 'Unlimited credits';

      if (renewalText) {
        const r = document.createElement('div');
        r.style.cssText = 'display:flex;align-items:center;gap:10px;background:#eef7ff;border:1px solid #d8ecff;border-radius:12px;padding:11px 14px;margin-bottom:16px;';
        r.innerHTML = '<span style="font-size:16px;">&#128197;</span><span style="font-size:13px;color:#1c4e7a;font-weight:600;">' + renewalText + '</span>';
        body.appendChild(r);
      }

      // Activity log
      const actHeader = document.createElement('div');
      actHeader.style.cssText = 'font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#8b8f98;margin:4px 0 8px;display:flex;justify-content:space-between;align-items:center;';
      actHeader.innerHTML = '<span>Recent activity</span>';
      body.appendChild(actHeader);

      let entries = [];
      if (typeof getCreditActivity === 'function') {
        entries = (getCreditActivity(20) || []).slice(0, 20);
      }
      if (!entries.length) {
        const empty = document.createElement('div');
        empty.textContent = 'No recent credit activity yet.';
        empty.style.cssText = 'color:#9aa0aa;font-size:13px;padding:14px 0;';
        body.appendChild(empty);
      } else {
        const list = document.createElement('div');
        list.style.cssText = 'display:flex;flex-direction:column;';
        entries.forEach((entry) => {
          const amount = Number(entry.amount || 0);
          const pos = amount >= 0;
          const label = _creditActivityLabel(entry);
          const d = new Date(Number(entry.ts || Date.now()));
          const timeText = Number.isNaN(d.getTime()) ? 'Just now' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
          const item = document.createElement('div');
          item.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid #f3f4f6;';
          item.innerHTML = ''
            + '<div style="min-width:0;flex:1;">'
            +   '<div style="font-size:13px;color:#2a2d34;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + label + '</div>'
            +   '<div style="font-size:11px;color:#9aa0aa;">' + timeText + '</div>'
            + '</div>'
            + '<div style="font-size:14px;font-weight:800;' + (pos ? 'color:#16a34a;' : 'color:#dc2626;') + '">' + (pos ? '+' : '') + Math.floor(amount) + '</div>';
          list.appendChild(item);
        });
        body.appendChild(list);
      }
    }

    panel.appendChild(header);
    panel.appendChild(body);
    host.appendChild(backdrop);
    host.appendChild(panel);
    document.body.appendChild(host);
  }

  function _creditActivityLabel(entry) {
    const src = String(entry && entry.source || '').toLowerCase();
    const action = String(entry && entry.action || '');
    if (src === 'exam_season_bonus') return 'Exam season bonus';
    if (src === 'plan_renewal') return 'Monthly renewal';
    if (src === 'plan_credits') return 'Plan credits';
    if (src === 'subject_purchase') return 'Subject purchase';
    if (src === 'credit_award') return 'Credits awarded';
    if (src === 'stored_credits') {
      if (action === 'ai_examiner_use') return 'AI Examiner';
      if (action === 'ai_transcribe') return 'Photo of work';
      if (action === 'quiz_question' || action === 'quiz') return 'Quiz';
      if (action === 'practice_question' || action === 'practice') return 'Practice';
      if (action === 'mock_paper_gen' || action === 'mock') return 'Mock paper';
      if (action === 'whatsapp_pdf' || action === 'whatsapp') return 'WhatsApp export';
      return 'Spend';
    }
    if (action) return action.replace(/_/g, ' ').replace(/\b\w/g, function(c){return c.toUpperCase();});
    return String(entry && entry.note || 'Activity');
  }

  async function startCheckout(input) {
    if (!isLoggedIn()) {
      throw new Error('You need to sign in before checkout.');
    }

    const session = getSession();
    const token = session && session.access_token ? session.access_token : '';
    if (!token) {
      throw new Error('Missing auth session token. Please sign in again.');
    }

    const payload = {
      plan: String((input && input.plan) || '').toUpperCase(),
      subject: String((input && input.subject) || '').toUpperCase(),
      credits: Number((input && input.credits) || 0),
      amountPence: Number((input && input.amountPence) || 0),
      billingInterval: String((input && input.billingInterval) || ''),
      returnUrl: window.location && window.location.origin ? window.location.origin : '',
    };

    const response = await fetch(SUPABASE_URL + '/functions/v1/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(function () { return {}; });
    _throwIfTermsRequired(response, result, 'ai');
    if (!response.ok) {
      throw new Error(result && result.error ? String(result.error) : 'Failed to create checkout session.');
    }

    if (!result || !result.url) {
      throw new Error('Checkout URL was not returned.');
    }

    return result;
  }

  async function startBillingPortal(input) {
    if (!isLoggedIn()) {
      throw new Error('You need to sign in before managing billing.');
    }

    const session = getSession();
    const token = session && session.access_token ? session.access_token : '';
    if (!token) {
      throw new Error('Missing auth session token. Please sign in again.');
    }

    const payload = {
      returnUrl: String((input && input.returnUrl) || (window.location && window.location.origin ? window.location.origin : '')),
    };

    const response = await fetch(SUPABASE_URL + '/functions/v1/create-billing-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(function () { return {}; });
    _throwIfTermsRequired(response, result, 'ai');
    if (!response.ok) {
      throw new Error(result && result.error ? String(result.error) : 'Failed to open billing portal.');
    }

    if (!result || !result.url) {
      throw new Error('Billing portal URL was not returned.');
    }

    return result;
  }

  /* ── AI usage limits ─────────────────────────────────────────────────────────────────────
     The AI Examiner is limited by USAGE, not credits: a rolling hourly limit and a rolling daily
     limit, enforced server-side by the ai-mark edge function and synced per account
     (supabase/sql/ai-usage.sql). Premium (Pro / Ultra) and EDU (school) plans have no limits.
     While the launch extension is on, Standard limits are multiplied (shown in the UI).
     UI: a limit sheet when a limit is reached, a heads-up toast when running low, and
     RA10.renderUsageCard(el) for the account page. */
  const USAGE_FEATURE = 'ai_mark';
  const USAGE_STYLE_ID = 'ra10-usage-css';
  let _usage = null;
  let _usageFetchedAt = 0;
  let _usageClockSkew = 0;
  let _usageNudgeKey = '';
  let _usageSuppressAlert = { text: '', until: 0 };

  function _usageSet(u) {
    if (!u || typeof u !== 'object' || !u.feature) return;
    _usage = u;
    _usageFetchedAt = Date.now();
    const serverNow = Date.parse(u.now || '');
    if (serverNow) _usageClockSkew = serverNow - Date.now();
    _emit('usagechange', _usage);
  }

  async function getAiUsage(options) {
    const force = !!(options && options.force);
    if (!isLoggedIn()) return null;
    if (!force && _usage && Date.now() - _usageFetchedAt < 30000) return _usage;
    try {
      const client = await _ensureSupabaseClient();
      const res = await client.rpc('ai_usage_status', { p_feature: USAGE_FEATURE });
      if (res.error || !res.data) return _usage; // usage SQL not applied yet → no limits shown
      _usageSet(res.data);
      return _usage;
    } catch (err) {
      return _usage;
    }
  }

  function _usageNow() { return Date.now() + _usageClockSkew; }

  function _usageClock(iso) {
    const t = Date.parse(iso || '');
    if (!t) return '';
    const d = new Date(t - _usageClockSkew);
    const now = new Date();
    const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (d.toDateString() === now.toDateString()) return time;
    if (new Date(now.getTime() + 864e5).toDateString() === d.toDateString()) return 'tomorrow at ' + time;
    return d.toLocaleDateString([], { weekday: 'long' }) + ' at ' + time;
  }

  function _usageIn(iso) {
    const ms = Date.parse(iso || '') - _usageNow();
    if (!(ms > 0)) return 'a moment';
    const m = Math.ceil(ms / 60000);
    if (m < 60) return m + (m === 1 ? ' minute' : ' minutes');
    const h = Math.floor(m / 60);
    const r = m % 60;
    return h + (h === 1 ? ' hour' : ' hours') + (r ? ' ' + r + ' min' : '');
  }

  function _usageEsc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function _usagePlanLabel(u) {
    if (!u) return '';
    if (u.plan === 'premium') return 'Premium · no limits';
    if (u.plan === 'edu') return 'School · no limits';
    return 'Standard plan';
  }

  function _usageLimitText(u) {
    const label = (u && u.label) || 'AI Examiner';
    const win = u && u.blocked_by === 'day' ? u.day : (u && u.hour);
    const when = win && win.resets_at ? ' You can mark again at ' + _usageClock(win.resets_at) + '.' : '';
    return (u && u.blocked_by === 'day' ? "You've reached today's " : "You've reached this hour's ") + label + ' limit.' + when;
  }

  function _ensureUsageStyles() {
    if (document.getElementById(USAGE_STYLE_ID)) return;
    const css = `
.ra10u-root{--u-bg:#fbfaf7;--u-card:#ffffff;--u-text:#28251d;--u-muted:#6f6d67;--u-line:#e3e0da;--u-track:#ece9e3;--u-fill:#28251d;--u-warn:#c2410c;--u-full:#d20000;--u-ext-bg:#eef6ff;--u-ext-text:#1d4ed8;--u-shadow:0 24px 64px rgba(20,16,8,.22);
  font-family:"DM Sans","Helvetica Neue",system-ui,sans-serif;color:var(--u-text);line-height:1.5;-webkit-font-smoothing:antialiased}
html[data-theme="dark"] .ra10u-root{--u-bg:#1c1b19;--u-card:#232220;--u-text:#e7e5e1;--u-muted:#9b9994;--u-line:#34332f;--u-track:#2f2e2b;--u-fill:#e7e5e1;--u-warn:#fb923c;--u-full:#ff5a5a;--u-ext-bg:rgba(59,130,246,.14);--u-ext-text:#93c5fd;--u-shadow:0 24px 64px rgba(0,0,0,.55)}
.ra10u-root *{box-sizing:border-box}
.ra10u-overlay{position:fixed!important;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(20,18,14,.42);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);animation:ra10uFade .18s ease-out}
.ra10u-sheet{width:min(460px,100%);max-height:calc(100dvh - 40px);overflow:auto;background:var(--u-bg);border:1px solid var(--u-line);border-radius:20px;box-shadow:var(--u-shadow);padding:22px 22px 18px;animation:ra10uRise .26s cubic-bezier(.16,1,.3,1)}
.ra10u-head{display:flex;gap:14px;align-items:flex-start}
.ra10u-ico{flex:0 0 auto;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--u-card);border:1px solid var(--u-line);color:var(--u-full)}
.ra10u-ico.ok{color:var(--u-text)}
.ra10u-title{margin:0;font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:1.55rem;line-height:1.15;letter-spacing:-.01em;color:var(--u-text)}
.ra10u-sub{margin:4px 0 0;color:var(--u-muted);font-size:.95rem}
.ra10u-x{margin-left:auto;flex:0 0 auto;width:32px;height:32px;border-radius:999px;border:0;background:transparent;color:var(--u-muted);font-size:18px;line-height:1;cursor:pointer}
.ra10u-x:hover,.ra10u-x:focus-visible{background:var(--u-card);color:var(--u-text);outline:none}
.ra10u-meters{margin-top:18px;display:grid;gap:10px}
.ra10u-meter{background:var(--u-card);border:1px solid var(--u-line);border-radius:14px;padding:12px 14px}
.ra10u-mrow{display:flex;justify-content:space-between;align-items:baseline;gap:10px;font-size:.92rem}
.ra10u-mrow b{font-weight:600}
.ra10u-mrow span{color:var(--u-muted);font-variant-numeric:tabular-nums}
.ra10u-bar{margin-top:8px;height:8px;border-radius:999px;background:var(--u-track);overflow:hidden}
.ra10u-bar i{display:block;height:100%;border-radius:inherit;background:var(--u-fill);transition:width .5s cubic-bezier(.16,1,.3,1)}
.ra10u-meter.low .ra10u-bar i{background:var(--u-warn)}
.ra10u-meter.full .ra10u-bar i{background:var(--u-full)}
.ra10u-note{margin-top:6px;font-size:.82rem;color:var(--u-muted)}
.ra10u-ext{margin-top:12px;display:flex;gap:8px;align-items:flex-start;padding:10px 12px;border-radius:12px;background:var(--u-ext-bg);color:var(--u-ext-text);font-size:.86rem}
.ra10u-ext svg{flex:0 0 auto;margin-top:2px}
.ra10u-keep{margin:14px 2px 0;font-size:.88rem;color:var(--u-muted)}
.ra10u-actions{margin-top:16px;display:flex;gap:10px;flex-wrap:wrap}
.ra10u-btn{flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border-radius:999px;font:600 .95rem/1 "DM Sans","Helvetica Neue",system-ui,sans-serif;text-decoration:none;cursor:pointer;border:1px solid var(--u-line);background:var(--u-card);color:var(--u-text)}
.ra10u-btn.primary{background:var(--u-text);border-color:var(--u-text);color:var(--u-bg)}
.ra10u-btn:hover{filter:brightness(1.06)}
.ra10u-btn:focus-visible{outline:2px solid var(--u-full);outline-offset:2px}
.ra10u-toast{position:fixed!important;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:2147483000;display:flex;align-items:center;gap:10px;max-width:min(520px,calc(100vw - 24px));padding:10px 10px 10px 14px;border-radius:999px;background:var(--u-card);border:1px solid var(--u-line);box-shadow:0 10px 30px rgba(20,16,8,.16);font-size:.9rem;animation:ra10uRise .26s cubic-bezier(.16,1,.3,1)}
.ra10u-toast .dot{width:8px;height:8px;border-radius:50%;background:var(--u-warn);flex:0 0 auto}
.ra10u-toast button{border:0;background:transparent;color:var(--u-text);font:600 .88rem "DM Sans",system-ui,sans-serif;padding:6px 10px;border-radius:999px;cursor:pointer;white-space:nowrap}
.ra10u-toast button:hover,.ra10u-toast button:focus-visible{background:var(--u-track);outline:none}
.ra10u-card{background:var(--u-card);border:1px solid var(--u-line);border-radius:16px;padding:16px 18px}
.ra10u-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.ra10u-card-head h4{margin:0;font-size:1rem;font-weight:600;color:var(--u-text)}
.ra10u-pill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:.78rem;font-weight:600;background:var(--u-track);color:var(--u-text)}
.ra10u-pill.unl{background:var(--u-ext-bg);color:var(--u-ext-text)}
.ra10u-card .ra10u-meter{background:transparent;border:0;padding:10px 0 0;border-radius:0}
.ra10u-card .ra10u-meters{margin-top:6px;gap:4px}
.ra10u-nav{position:relative;flex:0 0 auto;width:36px;height:36px;display:inline-grid;place-items:center;padding:0;margin:0;border:0;border-radius:var(--radius-md,10px);background:transparent;color:var(--u-text);cursor:pointer;--u-arc:var(--u-text);-webkit-tap-highlight-color:transparent}
.ra10u-nav[hidden]{display:none!important}
.ra10u-nav:hover{background:var(--u-track)}
.ra10u-nav:focus-visible{outline:2px solid var(--u-full);outline-offset:2px}
.ra10u-nav svg,.ra10u-nav-num{grid-area:1/1}
.ra10u-nav svg{display:block}
.ra10u-nav-track{fill:none;stroke:var(--u-track);stroke-width:3}
.ra10u-nav-arc{fill:none;stroke:var(--u-arc);stroke-width:3;stroke-linecap:round;transition:stroke-dashoffset .6s cubic-bezier(.16,1,.3,1),stroke .3s}
.ra10u-nav[data-state="low"]{--u-arc:var(--u-warn)}
.ra10u-nav[data-state="full"]{--u-arc:var(--u-full)}
.ra10u-nav-num{font:700 10.5px/1 "DM Sans",system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:-.01em;color:var(--u-text)}
.ra10u-nav-num.sm{font-size:9px;letter-spacing:-.03em}
.ra10u-nav[data-state="full"] .ra10u-nav-num{color:var(--u-full)}
@media screen and (max-width:840px){.ra10u-nav.desk{display:none!important}}
.mobile-top-nav .ra10u-nav.mob{width:34px;height:34px}
@keyframes ra10uFade{from{opacity:0}to{opacity:1}}
@keyframes ra10uRise{from{opacity:0;transform:translate(var(--u-tx,0),12px)}to{opacity:1;transform:translate(var(--u-tx,0),0)}}
.ra10u-toast{--u-tx:-50%}
@media (max-width:560px){
  .ra10u-overlay{align-items:flex-end;padding:0}
  .ra10u-sheet{width:100%;border-radius:22px 22px 0 0;border-bottom:0;padding:20px 18px calc(18px + env(safe-area-inset-bottom,0px))}
  .ra10u-title{font-size:1.4rem}
  .ra10u-toast{--u-tx:0;left:12px;right:12px;transform:none;max-width:none;justify-content:space-between;border-radius:16px;bottom:calc(76px + env(safe-area-inset-bottom,0px))}
}
@media (prefers-reduced-motion:reduce){.ra10u-overlay,.ra10u-sheet,.ra10u-toast{animation:none}.ra10u-bar i,.ra10u-nav-arc{transition:none}}`;
    const style = document.createElement('style');
    style.id = USAGE_STYLE_ID;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  const USAGE_ICON_GAUGE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.9 18.1A9 9 0 1 1 19.1 18.1"/><path d="M12 13l3.5-4.5"/><circle cx="12" cy="13" r="1.4" fill="currentColor" stroke="none"/></svg>';
  const USAGE_ICON_SPARK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>';

  function _usageMeterHtml(name, win, windowWord) {
    if (!win) return '';
    const used = Math.max(0, Number(win.used) || 0);
    const limit = Math.max(1, Number(win.limit) || 1);
    const pct = Math.min(100, Math.round((used / limit) * 100));
    const full = used >= limit;
    const low = !full && (limit - used) <= Math.max(2, Math.ceil(limit * 0.2));
    let note;
    if (full && win.resets_at) note = 'Available again at ' + _usageClock(win.resets_at) + ' (in ' + _usageIn(win.resets_at) + ')';
    else if (used === 0) note = 'Nothing used in the last ' + windowWord;
    else note = (limit - used) + ' left · each mark comes back ' + (windowWord === 'hour' ? 'an hour' : '24 hours') + ' after you use it';
    return '<div class="ra10u-meter' + (full ? ' full' : low ? ' low' : '') + '">' +
      '<div class="ra10u-mrow"><b>' + name + '</b><span>' + used + ' / ' + limit + ' used</span></div>' +
      '<div class="ra10u-bar" role="progressbar" aria-label="' + _usageEsc(name) + ' usage" aria-valuemin="0" aria-valuemax="' + limit + '" aria-valuenow="' + used + '"><i style="width:' + pct + '%"></i></div>' +
      '<div class="ra10u-note">' + _usageEsc(note) + '</div></div>';
  }

  function _usageExtensionHtml(u) {
    const ext = u && u.extension;
    if (!ext || !ext.active || u.unlimited) return '';
    const mult = Number(ext.multiplier) || 1;
    const text = (ext.note ? ext.note : 'Launch extension: ' + mult + '× limits') +
      (u.base ? ' (normally ' + u.base.hour + ' an hour, ' + u.base.day + ' a day).' : '.');
    return '<div class="ra10u-ext">' + USAGE_ICON_SPARK + '<span>' + _usageEsc(text) + '</span></div>';
  }

  function _usageCloseAll() {
    document.querySelectorAll('.ra10u-overlay').forEach(function (n) { n.remove(); });
  }

  // Shows the usage sheet. mode 'limit' (default when blocked) or 'info'.
  function showUsageLimit(usage, options) {
    const u = usage || _usage;
    if (!u || typeof document === 'undefined') return;
    _ensureUsageStyles();
    _usageCloseAll();
    const blocked = u.allowed === false && !!u.blocked_by;
    const mode = (options && options.mode) || (blocked ? 'limit' : 'info');
    const win = u.blocked_by === 'day' ? u.day : u.hour;
    const label = u.label || 'AI Examiner';
    const title = mode === 'limit'
      ? (u.blocked_by === 'day' ? "You've reached today's " + label + ' limit' : "You've reached this hour's " + label + ' limit')
      : label + ' usage';
    const sub = mode === 'limit'
      ? (win && win.resets_at ? 'You can mark again at ' + _usageClock(win.resets_at) + ' — in ' + _usageIn(win.resets_at) + '.' : 'You can mark again soon.')
      : (u.unlimited ? 'Your plan has no ' + label + ' limits.' : 'Limits are rolling: every mark comes back after its window passes.');

    const root = document.createElement('div');
    root.className = 'ra10u-root ra10u-overlay';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'ra10u-title');
    root.setAttribute('data-u-mode', mode);
    const opener = document.activeElement;
    root.innerHTML =
      '<div class="ra10u-sheet">' +
        '<div class="ra10u-head">' +
          '<span class="ra10u-ico' + (mode === 'limit' ? '' : ' ok') + '">' + USAGE_ICON_GAUGE + '</span>' +
          '<div><h2 class="ra10u-title" id="ra10u-title">' + _usageEsc(title) + '</h2><p class="ra10u-sub">' + _usageEsc(sub) + '</p>' +
            (mode === 'info' ? '<span class="ra10u-pill' + (u.unlimited ? ' unl' : '') + '" style="margin-top:8px">' + _usageEsc(_usagePlanLabel(u)) + '</span>' : '') + '</div>' +
          '<button type="button" class="ra10u-x" data-u-close aria-label="Close">✕</button>' +
        '</div>' +
        (u.unlimited ? '' :
          '<div class="ra10u-meters">' + _usageMeterHtml('This hour', u.hour, 'hour') + _usageMeterHtml('Today', u.day, '24 hours') + '</div>') +
        _usageExtensionHtml(u) +
        (mode === 'limit' ? '<p class="ra10u-keep">While you wait, everything else stays unlimited: mark schemes, practice questions, papers, guides and flashcards.</p>' : '') +
        '<div class="ra10u-actions">' +
          '<button type="button" class="ra10u-btn primary" data-u-close>' + (mode === 'limit' ? 'Keep revising' : 'Done') + '</button>' +
          (u.unlimited ? '' : '<a class="ra10u-btn" href="/upgrade" target="_top" data-u-upgrade>Premium has no limits</a>') +
        '</div>' +
      '</div>';
    const close = function () {
      document.removeEventListener('keydown', onKey, true);
      root.remove();
      if (opener && opener.focus && document.contains(opener)) { try { opener.focus(); } catch (e) {} }
    };
    const onKey = function (e) { if (e.key === 'Escape') { e.preventDefault(); close(); } };
    root.addEventListener('click', function (e) {
      if (e.target === root || (e.target.closest && e.target.closest('[data-u-close]'))) close();
    });
    document.addEventListener('keydown', onKey, true);
    document.documentElement.appendChild(root);
    const first = root.querySelector('[data-u-close].primary') || root.querySelector('[data-u-close]');
    if (first) setTimeout(function () { try { first.focus(); } catch (e) {} }, 30);
  }

  // A small heads-up when a learner is close to a limit (once per remaining count per window).
  function _usageNudge(u) {
    if (!u || u.unlimited || typeof document === 'undefined') return;
    const pick = [['hour', 'this hour'], ['day', 'today']].map(function (p) {
      const w = u[p[0]];
      if (!w) return null;
      const left = Math.max(0, (Number(w.limit) || 0) - (Number(w.used) || 0));
      const threshold = Math.max(2, Math.ceil((Number(w.limit) || 0) * 0.2));
      return left <= threshold ? { key: p[0], word: p[1], left: left, win: w } : null;
    }).filter(Boolean).sort(function (a, b) { return a.left - b.left; })[0];
    if (!pick) return;
    const key = pick.key + ':' + pick.left + ':' + (pick.win.limit || '');
    if (key === _usageNudgeKey) return;
    _usageNudgeKey = key;
    _ensureUsageStyles();
    document.querySelectorAll('.ra10u-toast').forEach(function (n) { n.remove(); });
    const label = u.label || 'AI Examiner';
    const text = pick.left === 0
      ? 'That was your last ' + label + ' mark ' + pick.word + '.'
      : pick.left + ' ' + label + (pick.left === 1 ? ' mark' : ' marks') + ' left ' + pick.word + '.';
    const toast = document.createElement('div');
    toast.className = 'ra10u-root ra10u-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<span class="dot" aria-hidden="true"></span><span>' + _usageEsc(text) + '</span><button type="button">View usage</button>';
    toast.querySelector('button').addEventListener('click', function () { toast.remove(); showUsageLimit(u, { mode: 'info' }); });
    document.documentElement.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 7000);
  }

  // Renders a live usage card into `el` (account page). Returns an unsubscribe function.
  function renderUsageCard(el) {
    if (!el) return function () {};
    _ensureUsageStyles();
    const paint = function (u) {
      if (!u || u.plan === 'none') {
        el.innerHTML = '';
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.innerHTML =
        '<div class="ra10u-root ra10u-card">' +
          '<div class="ra10u-card-head"><h4>' + _usageEsc((u.label || 'AI Examiner') + ' usage') + '</h4>' +
          '<span class="ra10u-pill' + (u.unlimited ? ' unl' : '') + '">' + _usageEsc(_usagePlanLabel(u)) + '</span></div>' +
          (u.unlimited
            ? '<p class="ra10u-note" style="margin-top:8px">Your plan has no hourly or daily limits.</p>'
            : '<div class="ra10u-meters">' + _usageMeterHtml('This hour', u.hour, 'hour') + _usageMeterHtml('Today', u.day, '24 hours') + '</div>' + _usageExtensionHtml(u)) +
        '</div>';
    };
    paint(_usage);
    on('usagechange', paint);
    getAiUsage({ force: true }).then(paint);
    return function () { off('usagechange', paint); };
  }

  // Navbar usage ring, next to the avatar. Only signed-in accounts with limits see it;
  // Premium and EDU (unlimited) never do. Clicking it opens the detailed usage popup.
  const USAGE_NAV_CLASS = 'ra10u-nav';
  const USAGE_NAV_R = 12;
  const USAGE_NAV_C = 2 * Math.PI * USAGE_NAV_R;
  let _usageNavStarted = false;

  // The ring shows how many marks can be used right now: the window with fewest left (hour wins a tie).
  function _usageBinding(u) {
    let best = null;
    ['hour', 'day'].forEach(function (k) {
      const w = u && u[k];
      if (!w) return;
      const limit = Math.max(1, Number(w.limit) || 1);
      const left = Math.max(0, limit - (Number(w.used) || 0));
      const frac = left / limit;
      if (!best || left < best.left) {
        best = { key: k, left: left, limit: limit, frac: frac };
      }
    });
    return best;
  }

  function _usageNavPaint() {
    if (typeof document === 'undefined') return;
    const btns = document.querySelectorAll('.' + USAGE_NAV_CLASS);
    if (!btns.length) return;
    const u = _usage;
    const b = (isLoggedIn() && u && !u.unlimited && u.plan !== 'none') ? _usageBinding(u) : null;
    btns.forEach(function (btn) {
      btn.hidden = !b;
      if (!b) return;
      const threshold = Math.max(2, Math.ceil(b.limit * 0.2));
      btn.setAttribute('data-state', b.left === 0 ? 'full' : b.left <= threshold ? 'low' : 'ok');
      const arc = btn.querySelector('.ra10u-nav-arc');
      if (arc) arc.style.strokeDashoffset = (USAGE_NAV_C * (1 - b.frac)).toFixed(2);
      const num = btn.querySelector('.ra10u-nav-num');
      if (num) {
        num.textContent = String(b.left);
        num.classList.toggle('sm', b.left >= 100);
      }
      const label = (u.label || 'AI Examiner') + ': ' + b.left + ' of ' + b.limit +
        (b.limit === 1 ? ' mark' : ' marks') + ' left ' + (b.key === 'hour' ? 'this hour' : 'today');
      btn.title = label;
      btn.setAttribute('aria-label', label + '. Show usage details');
    });
  }

  function _usageNavOpen() {
    if (!_usage) return;
    showUsageLimit(_usage, { mode: 'info' });
    // Refresh in the background and update the open popup's meters in place.
    getAiUsage({ force: true }).then(function (u) {
      const sheet = document.querySelector('.ra10u-overlay[data-u-mode="info"]');
      const meters = sheet && sheet.querySelector('.ra10u-meters');
      if (u && meters && !u.unlimited) {
        meters.innerHTML = _usageMeterHtml('This hour', u.hour, 'hour') + _usageMeterHtml('Today', u.day, '24 hours');
      }
    });
  }

  function _usageNavMake(where) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ra10u-root ' + USAGE_NAV_CLASS + ' ' + where;
    btn.hidden = true;
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.innerHTML =
      '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">' +
        '<circle class="ra10u-nav-track" cx="16" cy="16" r="' + USAGE_NAV_R + '"/>' +
        '<circle class="ra10u-nav-arc" cx="16" cy="16" r="' + USAGE_NAV_R + '" transform="rotate(-90 16 16)" ' +
          'stroke-dasharray="' + USAGE_NAV_C.toFixed(2) + '" stroke-dashoffset="' + USAGE_NAV_C.toFixed(2) + '"/>' +
      '</svg><span class="ra10u-nav-num" aria-hidden="true"></span>';
    btn.addEventListener('click', function (e) { e.stopPropagation(); _usageNavOpen(); });
    return btn;
  }

  // Inserts the ring before the avatar (desktop) and before the theme toggle (phone top bar).
  // Returns true once the desktop navbar has been found.
  function _usageNavMount() {
    const wrap = document.getElementById('nav-user-wrap');
    const mobileAnchor = document.getElementById('mobile-theme-toggle');
    if (!wrap && !mobileAnchor) return false;
    _ensureUsageStyles();
    if (wrap && wrap.parentNode && !wrap.parentNode.querySelector('.' + USAGE_NAV_CLASS + '.desk')) {
      wrap.parentNode.insertBefore(_usageNavMake('desk'), wrap);
    }
    if (mobileAnchor && mobileAnchor.parentNode && !mobileAnchor.parentNode.querySelector('.' + USAGE_NAV_CLASS + '.mob')) {
      mobileAnchor.parentNode.insertBefore(_usageNavMake('mob'), mobileAnchor);
    }
    _usageNavPaint();
    if (isLoggedIn() && !_usage) getAiUsage();
    return !!wrap;
  }

  (function startUsageNav() {
    if (typeof window === 'undefined' || typeof document === 'undefined' || _usageNavStarted) return;
    _usageNavStarted = true;
    on('usagechange', _usageNavPaint);
    on('authchange', function () {
      if (isLoggedIn()) {
        getAiUsage({ force: true }).then(_usageNavPaint);
      } else {
        _usage = null;
        _usageFetchedAt = 0;
        _usageNavPaint();
      }
    });
    // The shell has the navbar straight away; standalone pages copy it in a moment later.
    let tries = 0;
    const tryMount = function () {
      if (_usageNavMount() || ++tries > 60) return;
      setTimeout(tryMount, 500);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryMount);
    else tryMount();
    // Rolling windows give marks back over time, so keep the ring current while the tab is open.
    const refresh = function () {
      if (document.visibilityState !== 'visible' || !isLoggedIn()) return;
      if (!document.querySelector('.' + USAGE_NAV_CLASS)) return;
      if (_usage && _usage.unlimited) return;
      getAiUsage({ force: true });
    };
    setInterval(refresh, 90000);
    document.addEventListener('visibilitychange', refresh);
  })();

  // Unit apps show AI Examiner errors with alert(); the usage sheet already explains a limit,
  // so the matching alert is skipped (only that exact message, only for a few seconds).
  (function installUsageAlertFilter() {
    if (typeof window === 'undefined' || typeof window.alert !== 'function' || window.alert.__ra10Usage) return;
    const nativeAlert = window.alert;
    const filtered = function (msg) {
      if (_usageSuppressAlert.text && Date.now() < _usageSuppressAlert.until &&
          String(msg == null ? '' : msg).indexOf(_usageSuppressAlert.text) >= 0) {
        _usageSuppressAlert = { text: '', until: 0 };
        return undefined;
      }
      return nativeAlert.apply(window, arguments);
    };
    filtered.__ra10Usage = true;
    window.alert = filtered;
  })();

  function _usageLimitError(usage) {
    _usageSet(usage);
    showUsageLimit(usage, { mode: 'limit' });
    const msg = _usageLimitText(usage);
    _usageSuppressAlert = { text: msg, until: Date.now() + 4000 };
    const err = new Error(msg);
    err.code = 'usage_limit';
    err.usage = usage;
    return err;
  }

  // Shared request for both AI marking entry points.
  async function _postAiMark(payload, unavailableText) {
    const session = getSession();
    const token = session && session.access_token ? session.access_token : '';
    if (!token) {
      throw new Error('Missing auth session token. Please sign in again.');
    }
    const response = await fetch(SUPABASE_URL + '/functions/v1/ai-mark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(function () { return {}; });
    _throwIfTermsRequired(response, result, 'ai');
    if (response.status === 429 && result && result.code === 'usage_limit' && result.usage) {
      throw _usageLimitError(result.usage);
    }
    if (result && result.usage) _usageSet(result.usage);
    if (!response.ok) {
      throw new Error(result && result.error ? String(result.error) : unavailableText);
    }
    if (!result || !result.result) {
      throw new Error(unavailableText.replace('is unavailable right now', 'returned an invalid response'));
    }
    if (result.usage) _usageNudge(result.usage);
    return result;
  }

  function canUseAiMarking() {
    // Every signed-in account can use AI marking; limits are applied server-side.
    return isLoggedIn();
  }

  async function aiMarkAnswer(input) {
    if (!isLoggedIn()) {
      throw new Error('You need to sign in before AI marking.');
    }
    _assertTermsAccepted('ai_mark');
    const payload = {
      question: input && input.question ? input.question : null,
      answer: input && typeof input.answer === 'string' ? input.answer : '',
    };
    if (!payload.question || !payload.answer.trim()) {
      throw new Error('Question and answer are required for AI marking.');
    }
    return _postAiMark(payload, 'AI marking is unavailable right now.');
  }

  async function examineAnswer(input) {
    if (!isLoggedIn()) {
      throw new Error('You need to sign in before using AI Examiner.');
    }
    _assertTermsAccepted('ai_examiner');
    const payload = {
      question: input && input.question ? input.question : null,
      answer: input && typeof input.answer === 'string' ? input.answer : '',
    };
    // Diagram questions can send a drawn / photographed answer as a data-URL image.
    if (input && typeof input.image === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(input.image)) payload.image = input.image;
    if (!payload.question || (!payload.answer.trim() && !payload.image)) {
      throw new Error('Question and answer are required for AI Examiner.');
    }
    return _postAiMark(payload, 'AI Examiner is unavailable right now.');
  }

  function _tierCost(costMap) {
    if (TRANSITION_MODE && isLoggedIn()) {
      return costMap && typeof costMap.ultra === 'number' ? costMap.ultra : 0;
    }
    const tier = _normalizeTier(getTier());
    const isUltra = tier === 'ultra' || tier === 'owner' || UNLIMITED_TIERS.has(tier);
    const isPro = tier === 'all_subjects';
    const isSchool = tier === 'school_student' || tier === 'school_teacher' || tier === 'school_admin';
    if (isUltra) return costMap.ultra;
    if (isPro) return costMap.pro;
    if (isSchool) return costMap.school;
    if (tier === 'subject') return costMap.subject != null ? costMap.subject : costMap.free;
    return costMap.free;
  }

  async function _deductTieredCredits(costToDeduct, source, action, note) {
    if (costToDeduct <= 0 || TRANSITION_MODE) return true;
    const currentBase = _getStoredCredits();
    const bonusRemaining = _getExamBonusRemaining();
    const totalCredit = currentBase + bonusRemaining;
    if (totalCredit < costToDeduct) {
      throw new Error('Not enough credits. This action costs ' + costToDeduct + ' credit(s).');
    }
    const fromBonus = Math.min(costToDeduct, bonusRemaining);
    const fromBase = costToDeduct - fromBonus;
    const newBase = currentBase - fromBase;
    const newBonus = bonusRemaining - fromBonus;
    const prevBonusUsed = _getExamBonusUsed();
    if (fromBonus > 0) _setExamBonusUsed(prevBonusUsed + fromBonus);

    const client = await _ensureSupabaseClient();
    const updateRes = await client.from('profiles').update({ credits: newBase }).eq('id', _profile.id).select().single();
    if (updateRes.error || !updateRes.data) {
      if (fromBonus > 0) _setExamBonusUsed(prevBonusUsed);
      throw new Error('Could not deduct credits. Please try again.');
    }
    _profile = updateRes.data;
    _writeCreditSnapshot(_profile);
    if (fromBonus > 0) {
      _appendCreditActivity({ type: 'spend', source: 'exam_season_bonus', action, amount: -fromBonus, note: note + ' (exam bonus)' });
    }
    if (fromBase > 0) {
      _appendCreditActivity({ type: 'spend', source: 'stored_credits', action, amount: -fromBase, note: note + ' (account credits)' });
    }
    _appendCreditActivity({ type: 'spend', source, action, amount: -costToDeduct, note, balanceAfter: newBase + newBonus });
    _emit('creditschange', _profile);
    return true;
  }

  // AI Assigner — Unit 3 Website Development mentor.
  // "hint" mode: free-form coaching chat, tier-based cost (cheaper than marking).
  async function askAiAssigner(input) {
    if (!isLoggedIn()) {
      throw new Error('You need to sign in before using AI Assigner.');
    }
    _assertTermsAccepted('ai_assigner');
    const message = input && typeof input.message === 'string' ? input.message.trim() : '';
    if (!message) {
      throw new Error('A message is required for AI Assigner.');
    }
    const costToDeduct = _tierCost({ free: 3, school: 1, pro: 1, ultra: 0, subject: 2 });
    const session = getSession();
    const token = session && session.access_token ? session.access_token : '';
    if (!token) throw new Error('Missing auth session token. Please sign in again.');

    const payload = {
      mode: 'hint',
      message,
      context: input && typeof input.context === 'string' ? input.context.slice(0, 4000) : '',
      unit: input && typeof input.unit === 'string' ? input.unit.slice(0, 64) : '',
      history: Array.isArray(input && input.history) ? input.history.slice(-8) : [],
    };
    const response = await fetch(SUPABASE_URL + '/functions/v1/ai-assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(function () { return {}; });
    _throwIfTermsRequired(response, result, 'ai');
    if (!response.ok) {
      throw new Error(result && result.error ? String(result.error) : 'AI Assigner is unavailable right now.');
    }
    if (!result || typeof result.reply !== 'string') {
      throw new Error('AI Assigner returned an invalid response.');
    }
    await _deductTieredCredits(costToDeduct, 'ai_assigner', 'ai_assigner_hint', 'AI Assigner hint used');
    return result;
  }

  // "mark" mode: marks an assignment submission against P/M/D criteria for a task.
  async function markAssignment(input) {
    if (!isLoggedIn()) {
      throw new Error('You need to sign in before using AI Assigner marking.');
    }
    _assertTermsAccepted('ai_assigner_mark');
    const submission = input && typeof input.submission === 'string' ? input.submission.trim() : '';
    if (!submission) {
      throw new Error('A submission is required for marking.');
    }
    const costToDeduct = _tierCost({ free: 8, school: 3, pro: 2, ultra: 0, subject: 5 });
    const session = getSession();
    const token = session && session.access_token ? session.access_token : '';
    if (!token) throw new Error('Missing auth session token. Please sign in again.');

    const payload = {
      mode: 'mark',
      submission,
      taskTitle: input && input.taskTitle ? String(input.taskTitle) : 'Task',
      criteria: input && input.criteria ? input.criteria : {},
    };
    const response = await fetch(SUPABASE_URL + '/functions/v1/ai-assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(function () { return {}; });
    _throwIfTermsRequired(response, result, 'ai');
    if (!response.ok) {
      throw new Error(result && result.error ? String(result.error) : 'AI Assigner marking is unavailable right now.');
    }
    if (!result || !result.result) {
      throw new Error('AI Assigner marking returned an invalid response.');
    }
    await _deductTieredCredits(costToDeduct, 'ai_assigner', 'ai_assigner_mark', 'AI Assigner assignment marking used');
    return result;
  }

  // Photo of handwritten work -> editable text (maths as LaTeX) for practice answers.
  // The image is sent once for transcription and is not stored. Credits are only
  // taken if the transcription succeeds.
  async function transcribeWork(input) {
    if (!isLoggedIn()) {
      throw new Error('You need to sign in before uploading a photo of your work.');
    }
    _assertTermsAccepted('ai_transcribe');
    const image = input && typeof input.image === 'string' ? input.image : '';
    if (!/^data:image\/(jpeg|png|webp);base64,/.test(image)) {
      throw new Error('Please choose a photo (JPEG, PNG or WebP).');
    }
    const costToDeduct = _tierCost({ free: 2, school: 1, pro: 1, ultra: 0, subject: 1 });
    const session = getSession();
    const token = session && session.access_token ? session.access_token : '';
    if (!token) throw new Error('Missing auth session token. Please sign in again.');

    const response = await fetch(SUPABASE_URL + '/functions/v1/ai-transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ image, question: input && input.question ? String(input.question).slice(0, 1500) : '' }),
    });
    const result = await response.json().catch(function () { return {}; });
    _throwIfTermsRequired(response, result, 'ai');
    if (!response.ok) {
      throw new Error(result && result.error ? String(result.error) : 'Photo reading is unavailable right now.');
    }
    if (!result || typeof result.text !== 'string') {
      throw new Error('Photo reading returned an invalid response.');
    }
    await _deductTieredCredits(costToDeduct, 'ai_examiner', 'ai_transcribe', 'Photo of written work read by AI');
    return result;
  }

  // Public profile card for any user (by id or @username): streak, join date, leaderboard results.
  async function getPublicProfile(ref) {
    const value = String(ref || '').trim();
    if (!value) return null;
    const client = await _ensureSupabaseClient();
    const args = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
      ? { p_id: value }
      : { p_username: value.replace(/^@/, '') };
    const { data, error } = await client.rpc('get_public_profile', args);
    if (error) throw error;
    return Array.isArray(data) ? (data[0] || null) : (data || null);
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
    updatePassword,
    handleRecoveryTokens,
    getSession,
    getProfile,
    isLoggedIn,
    isOwner,
    isPaid,
    hasNoAds,
    getTier,
    getTierInfo,
    getCredits,
    getStreak,
    getStudyDays,
    markStudyDay,
    syncStreak,
    getCreditBreakdown,
    getCreditActivity,
    getGuestCredits,
    canAfford,
    spendCredits,
    gate,
    guestGate,
    showPaywall,
    renderCreditChip,
    openCreditsPanel,
    startCheckout,
    startBillingPortal,
    canUseAiMarking,
    aiMarkAnswer,
    examineAnswer,
    getAiUsage,
    showUsageLimit,
    renderUsageCard,
    refreshUsageNav: _usageNavMount,
    askAiAssigner,
    markAssignment,
    transcribeWork,
    refreshProfile: _refreshProfile,
    getClient,
    getLegalStatus,
    refreshLegalStatus,
    hasAcceptedTerms,
    acceptTerms,
    requireTerms,
    _appendCreditActivity,
    seen,
    getPublicProfile,
    on,
    off,
    // Expose internal config for debugging if needed.
    _raw: {
      ACTION_COSTS,
      TIER_INFO,
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      OWNER_EMAIL,
      TRANSITION_MODE,
      // Display-only previews of the usage UI (limits are enforced server-side, so these grant nothing).
      previewUsage: function (u) { _usageSet(u); _usageNudge(u); },
      previewUsageLimit: function (u) { return _usageLimitError(u); },
    },
  };

  window.RA10 = window.RA10 || RA10;
  if (window.RA10 !== RA10) {
    Object.assign(window.RA10, RA10);
  }
})(window, document);
