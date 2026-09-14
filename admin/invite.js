/* RA10 EDU Admin — invite / activation helpers.
 *
 * These actions previously ran client-side and embedded a Supabase
 * SERVICE-ROLE key. That key is privileged and must never ship to the
 * browser, so the privileged work now lives in the `edu-manage` edge
 * function. This file just calls that function with the current user's
 * access token; ownership is authorised server-side.
 */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://tcrrgsylxbyyrmnouihl.supabase.co';

  function getToken() {
    try {
      if (window.RA10 && typeof RA10.getSession === 'function') {
        var s = RA10.getSession();
        if (s && s.access_token) return s.access_token;
      }
    } catch (e) { /* ignore */ }
    return '';
  }

  async function postAction(payload) {
    var token = getToken();
    if (!token) throw new Error('Not signed in.');
    var res = await fetch(SUPABASE_URL + '/functions/v1/edu-manage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload || {})
    });
    var text = await res.text();
    var data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
    if (!res.ok) {
      throw new Error((data && (data.error || data.message)) || text || 'Request failed.');
    }
    return data;
  }

  // Activate an existing account: grant school tier, credits, and access.
  window.RA10_ACTIVATE_SCHOOL_MEMBER = async function (email, role, schoolId, schoolName) {
    try {
      var data = await postAction({
        action: 'activate',
        email: email,
        role: role,
        schoolId: schoolId,
        schoolName: schoolName
      });
      return data && data.ok ? { ok: true } : { ok: false, error: (data && data.error) || 'Profile activation failed' };
    } catch (e) {
      return { ok: false, error: e && e.message ? e.message : 'Profile activation failed' };
    }
  };

  // Invite a new (or reactivated) account; if they already have an account,
  // the server activates them directly. Returns { ok, skipped?, activated?,
  // link?, error? }.
  window.RA10_INVITE = async function (email, role, schoolId, schoolName) {
    var normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) return { ok: false, error: 'Missing email.' };
    try {
      var data = await postAction({
        action: 'invite',
        email: normalizedEmail,
        role: role,
        schoolId: schoolId,
        schoolName: schoolName
      });
      if (data && data.ok) {
        return {
          ok: true,
          skipped: !!data.skipped,
          activated: !!data.activated,
          activationError: data.activationError,
          link: data.link
        };
      }
      return { ok: false, error: (data && data.error) || 'Invite failed.' };
    } catch (e) {
      return { ok: false, error: e && e.message ? e.message : 'Network error' };
    }
  };
})();