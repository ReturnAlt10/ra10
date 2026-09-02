(function (window, document) {
  // RA10 Shared SDK for plain script tag usage.
  // Exposed globally as window.RA10.
  const SUPABASE_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';
  const OWNER_EMAIL = 'mistry.hashim@icloud.com';
  const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
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
    ai_mark: 3,
    whatsapp_export: 2,
    whatsapp_pdf: 3,
  };

  const MONTHLY_TIERS = new Set(['free', 'all_subjects', 'school_student', 'school_teacher', 'school_admin']);
  const UNLIMITED_TIERS = new Set(['ultra', 'owner']);

  const SUBJECT_LABEL_MAP = {
    IT: 'IT',
    'IT AAQ': 'IT',
    'IT UNIT 1': 'IT',
    'IT UNIT 2': 'IT',
    'IT AAQ UNIT 1': 'IT',
    'IT AAQ UNIT 2': 'IT',
    BUSINESS: 'Business',
    'BUSINESS LEVEL 3': 'Business',
    SPORT: 'Sport',
    'SPORT UNIT 1': 'Sport',
  };

  const EVENTS = {
    authchange: [],
    creditschange: [],
  };

  const EXAM_SEASON_BONUS_CREDITS = 50;
  const EXAM_SEASON_BONUS_END_UTC = Date.parse('2026-08-02T00:00:00Z');
  const CREDIT_ACTIVITY_LIMIT = 200;

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

    if (String(member.status || '').toLowerCase() !== 'active') {
      await client
        .from('school_members')
        .update({ status: 'active' })
        .eq('id', member.id);
    }

    const updatedProfile = updateResult.data || profile;
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
    const nextReset = new Date();
    nextReset.setUTCMonth(nextReset.getUTCMonth() + 1);
    const update = await client.from('profiles').update({ credits, credits_reset_at: nextReset.toISOString() }).eq('id', _profile.id).select().single();
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
      if (updatedSession) {
        _session = updatedSession;
        _loadProfileFromSession(_session).then(() => {
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
      || _profile?.email === OWNER_EMAIL
      || _profile?.unlimited_credits === true;
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
    if (_profile.unlimited_credits) {
      return Infinity;
    }
    _ensureExamBonusGrantLogged();
    return _getStoredCredits() + _getExamBonusRemaining();
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
    if (_profile.unlimited_credits || UNLIMITED_TIERS.has(_normalizeTier(_profile.tier))) {
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

  async function awardCredits(amount) {
    const grant = Number(amount) || 0;
    if (grant <= 0 || !isLoggedIn()) {
      return false;
    }
    if (UNLIMITED_TIERS.has(getTier())) {
      return true;
    }
    const current = _getStoredCredits();
    const newAmount = current + grant;
    const client = await _ensureSupabaseClient();
    const result = await client.from('profiles').update({ credits: newAmount }).eq('id', _profile.id).select().single();
    if (result.error || !result.data) {
      console.warn('RA10 awardCredits failed', result.error);
      return false;
    }
    _profile = result.data;
    _writeCreditSnapshot(_profile);
    _appendCreditActivity({
      type: 'gain',
      source: 'credit_award',
      amount: grant,
      note: 'Credits awarded',
    });
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
    if (!response.ok) {
      throw new Error(result && result.error ? String(result.error) : 'Failed to open billing portal.');
    }

    if (!result || !result.url) {
      throw new Error('Billing portal URL was not returned.');
    }

    return result;
  }

  function canUseAiMarking() {
    const tier = _normalizeTier(getTier());
    return tier === 'ultra' || tier === 'owner' || UNLIMITED_TIERS.has(tier);
  }

  async function aiMarkAnswer(input) {
    if (!isLoggedIn()) {
      throw new Error('You need to sign in before AI marking.');
    }
    if (!canUseAiMarking()) {
      throw new Error('AI marking is available on Ultra only.');
    }

    const session = getSession();
    const token = session && session.access_token ? session.access_token : '';
    if (!token) {
      throw new Error('Missing auth session token. Please sign in again.');
    }

    const payload = {
      question: input && input.question ? input.question : null,
      answer: input && typeof input.answer === 'string' ? input.answer : '',
    };

    if (!payload.question || !payload.answer.trim()) {
      throw new Error('Question and answer are required for AI marking.');
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
    if (!response.ok) {
      throw new Error(result && result.error ? String(result.error) : 'AI marking is unavailable right now.');
    }
    if (!result || !result.result) {
      throw new Error('AI marking returned an invalid response.');
    }
    return result;
  }

  async function examineAnswer(input) {
    if (!isLoggedIn()) {
      throw new Error('You need to sign in before using AI Examiner.');
    }

    const tier = _normalizeTier(getTier());
    const isUltra = tier === 'ultra' || tier === 'owner' || UNLIMITED_TIERS.has(tier);
    const isPro = tier === 'all_subjects';

    const isSchool = tier === 'school_student' || tier === 'school_teacher' || tier === 'school_admin';
    let costToDeduct = 3;
    if (tier === 'free') costToDeduct = 5;
    else if (isPro) costToDeduct = 1;
    else if (isSchool) costToDeduct = 2;
    else if (isUltra) costToDeduct = 0;

    const session = getSession();
    const token = session && session.access_token ? session.access_token : '';
    if (!token) {
      throw new Error('Missing auth session token. Please sign in again.');
    }

    const payload = {
      question: input && input.question ? input.question : null,
      answer: input && typeof input.answer === 'string' ? input.answer : '',
    };

    if (!payload.question || !payload.answer.trim()) {
      throw new Error('Question and answer are required for AI Examiner.');
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
    if (!response.ok) {
      throw new Error(result && result.error ? String(result.error) : 'AI Examiner is unavailable right now.');
    }
    if (!result || !result.result) {
      throw new Error('AI Examiner returned an invalid response.');
    }

    // Only deduct credits AFTER successful API response
    if (costToDeduct > 0) {
      const currentBase = _getStoredCredits();
      const bonusRemaining = _getExamBonusRemaining();
      const totalCredit = currentBase + bonusRemaining;
      
      if (totalCredit >= costToDeduct) {
        const fromBonus = Math.min(costToDeduct, bonusRemaining);
        const fromBase = costToDeduct - fromBonus;
        
        const newBase = currentBase - fromBase;
        const newBonus = bonusRemaining - fromBonus;
        const prevBonusUsed = _getExamBonusUsed();
        if (fromBonus > 0) {
          _setExamBonusUsed(prevBonusUsed + fromBonus);
        }
        
        const client = await _ensureSupabaseClient();
        const updateRes = await client.from('profiles').update({ credits: newBase }).eq('id', _profile.id).select().single();
        
        if (updateRes.error) {
          if (fromBonus > 0) {
            _setExamBonusUsed(prevBonusUsed);
          }
          console.error('RA10 examineAnswer credit deduction failed:', updateRes.error);
          throw new Error('Your answer was marked, but we failed to deduct credits. Please try again or contact support.');
        } else if (updateRes.data) {
          _profile = updateRes.data;
          _writeCreditSnapshot(_profile);
          if (fromBonus > 0) {
            _appendCreditActivity({
              type: 'spend',
              source: 'exam_season_bonus',
              action: 'ai_examiner_use',
              amount: -fromBonus,
              note: 'AI Examiner spent exam-season bonus credits',
            });
          }
          if (fromBase > 0) {
            _appendCreditActivity({
              type: 'spend',
              source: 'stored_credits',
              action: 'ai_examiner_use',
              amount: -fromBase,
              note: 'AI Examiner spent account credits',
            });
          }
          _appendCreditActivity({
            type: 'spend',
            source: 'ai_examiner',
            action: 'ai_examiner_use',
            amount: -costToDeduct,
            note: 'AI Examiner used',
            balanceAfter: newBase + newBonus,
          });
          _emit('creditschange', _profile);
        } else {
          if (fromBonus > 0) {
            _setExamBonusUsed(prevBonusUsed);
          }
          throw new Error('Credit deduction update returned no data. Please try again.');
        }
      } else {
        throw new Error('Not enough credits. AI Examiner costs ' + costToDeduct + ' credit(s).');
      }
    }

    return result;
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
    getCreditBreakdown,
    getCreditActivity,
    getGuestCredits,
    canAfford,
    spendCredits,
    awardCredits,
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
    refreshProfile: _refreshProfile,
    _appendCreditActivity,
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
