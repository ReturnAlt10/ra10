const RA10_SERVICE_ROLE_KEY = ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  '.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg4NTIxMSwiZXhwIjoyMDkzNDYxMjExfQ',
  '.pz8yuNEfjC1PouG0K0RW4pf7vyLvQQSh_5blgJMB-3s'].join('');

window.RA10_ACTIVATE_SCHOOL_MEMBER = async function(email, role, schoolId, schoolName) {
    try {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const normalizedRole = String(role || '').toLowerCase() === 'teacher' ? 'teacher' : 'student';
      const tier = normalizedRole === 'teacher' ? 'school_teacher' : 'school_student';
      const credits = normalizedRole === 'teacher' ? 600 : 300;
      const nextReset = new Date();
      nextReset.setUTCMonth(nextReset.getUTCMonth() + 1);
      const unlockedSubjects = ['IT AAQ', 'Business Level 3', 'Sport Level 3'];

      const profileLookup = await fetch(
        'https://tcrrgsylxbyyrmnouihl.supabase.co/rest/v1/profiles?email=ilike.' + encodeURIComponent(normalizedEmail) + '&select=id,email&limit=1',
        {
          headers: {
            'apikey': RA10_SERVICE_ROLE_KEY,
            'Authorization': 'Bearer ' + RA10_SERVICE_ROLE_KEY,
          }
        }
      );
      if (!profileLookup.ok) {
        const msg = await profileLookup.text().catch(() => '');
        return { ok: false, error: msg || ('HTTP ' + profileLookup.status) };
      }
      const profileRows = await profileLookup.json().catch(() => []);
      if (!Array.isArray(profileRows) || profileRows.length === 0 || !profileRows[0].id) {
        return { ok: false, error: 'No matching profile row found.' };
      }

      const profileId = String(profileRows[0].id);
      const patchProfile = await fetch(
        'https://tcrrgsylxbyyrmnouihl.supabase.co/rest/v1/profiles?id=eq.' + encodeURIComponent(profileId),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': RA10_SERVICE_ROLE_KEY,
            'Authorization': 'Bearer ' + RA10_SERVICE_ROLE_KEY,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            tier: tier,
            credits: credits,
            credits_reset_at: nextReset.toISOString(),
            school_id: schoolId,
            school_name: schoolName,
            unlocked_subjects: unlockedSubjects
          })
        }
      );
      if (!patchProfile.ok) {
        const msg = await patchProfile.text().catch(() => '');
        return { ok: false, error: msg || ('HTTP ' + patchProfile.status) };
      }

      await fetch(
        'https://tcrrgsylxbyyrmnouihl.supabase.co/rest/v1/school_members?school_id=eq.' + encodeURIComponent(String(schoolId || ''))
          + '&email=ilike.' + encodeURIComponent(normalizedEmail)
          + '&role=eq.' + encodeURIComponent(normalizedRole),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': RA10_SERVICE_ROLE_KEY,
            'Authorization': 'Bearer ' + RA10_SERVICE_ROLE_KEY,
          },
          body: JSON.stringify({ status: 'active' })
        }
      ).catch(() => {});

      return { ok: true };
    } catch (e) {
      return { ok: false, error: e && e.message ? e.message : 'Profile activation failed' };
    }
};

// Returns { ok: true } on success or { ok: false, error: string } on failure.
window.RA10_INVITE = async function(email, role, schoolId, schoolName) {
  const k = RA10_SERVICE_ROLE_KEY;

  // Check if the user already has an RA10 account — the invite endpoint
  // rejects existing accounts, so we skip it and treat that as "no email needed".
  try {
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODUyMTEsImV4cCI6MjA5MzQ2MTIxMX0.eOp6ma-mfgh8F20nM7E2OaBW28LlZlwuEEWr6k2zDWw';
    const profCheck = await fetch(
      'https://tcrrgsylxbyyrmnouihl.supabase.co/rest/v1/profiles?email=ilike.' + encodeURIComponent(email) + '&select=id&limit=1',
      { headers: { 'apikey': anonKey, 'Authorization': 'Bearer ' + anonKey } }
    );
    if (profCheck.ok) {
      const rows = await profCheck.json();
      if (Array.isArray(rows) && rows.length > 0) {
        // User already has an account — no invite email needed.
        const activated = await window.RA10_ACTIVATE_SCHOOL_MEMBER(email, role, schoolId, schoolName);
        if (activated.ok) {
          return { ok: true, skipped: true, activated: true };
        }
        return { ok: true, skipped: true, activationError: activated.error || '' };
      }
    }
  } catch(e) {
    console.warn('[RA10_INVITE] profile pre-check failed', e);
  }

  try {
    const res = await fetch('https://tcrrgsylxbyyrmnouihl.supabase.co/auth/v1/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': k,
        'Authorization': 'Bearer ' + k
      },
      body: JSON.stringify({
        email,
        data: { role, school_id: schoolId, school_name: schoolName },
        redirect_to: 'https://ra10.co.uk/#/account'
      })
    });
    if (res.ok) return { ok: true };
    let errMsg = 'HTTP ' + res.status;
    let body = null;
    try { body = await res.json(); errMsg = body.msg || body.message || body.error_description || errMsg; } catch(_) {}

    // If Supabase rate-limited the invite email, generate a one-time signup
    // link instead so the admin can copy & share it manually.
    const isRateLimit = errMsg && /rate.?limit/i.test(errMsg);
    if (isRateLimit) {
      try {
        const linkRes = await fetch('https://tcrrgsylxbyyrmnouihl.supabase.co/auth/v1/admin/generate_link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': k,
            'Authorization': 'Bearer ' + k
          },
          body: JSON.stringify({
            type: 'invite',
            email,
            data: { role, school_id: schoolId, school_name: schoolName },
            redirect_to: 'https://ra10.co.uk/#/account'
          })
        });
        if (linkRes.ok) {
          const linkBody = await linkRes.json();
          const url = linkBody.action_link || linkBody.hashed_token;
          if (url) return { ok: true, link: url };
        }
      } catch(_) {}
      return { ok: false, error: 'rate_limited' };
    }

    const isAlreadyRegistered = /already|exists|registered|in use/i.test(String(errMsg || ''));
    if (isAlreadyRegistered) {
      const activated = await window.RA10_ACTIVATE_SCHOOL_MEMBER(email, role, schoolId, schoolName);
      if (activated.ok) {
        return { ok: true, skipped: true, activated: true };
      }
      return { ok: true, skipped: true, activationError: activated.error || '' };
    }

    console.warn('[RA10_INVITE] failed:', errMsg);
    return { ok: false, error: errMsg };
  } catch(e) {
    console.warn('[RA10_INVITE] fetch error', e);
    return { ok: false, error: e.message || 'Network error' };
  }
};