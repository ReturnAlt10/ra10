// Returns { ok: true } on success or { ok: false, error: string } on failure.
window.RA10_INVITE = async function(email, role, schoolId, schoolName) {
  const k = ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    '.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnJnc3lseGJ5eXJtbm91aWhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg4NTIxMSwiZXhwIjoyMDkzNDYxMjExfQ',
    '.pz8yuNEfjC1PouG0K0RW4pf7vyLvQQSh_5blgJMB-3s'].join('');

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
        return { ok: true, skipped: true };
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

    console.warn('[RA10_INVITE] failed:', errMsg);
    return { ok: false, error: errMsg };
  } catch(e) {
    console.warn('[RA10_INVITE] fetch error', e);
    return { ok: false, error: e.message || 'Network error' };
  }
};