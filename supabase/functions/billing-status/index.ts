import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || '';

const ALLOWED_ORIGINS = new Set([
  'https://ra10.co.uk',
  'https://www.ra10.co.uk',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

function corsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://ra10.co.uk';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

function toIsoFromUnix(raw: unknown): string | null {
  if (typeof raw !== 'number' || !Number.isFinite(raw) || raw <= 0) return null;
  return new Date(raw * 1000).toISOString();
}

function oneMonthFromNowIso(): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString();
}

async function stripeGet(path: string, params?: Record<string, string>) {
  const url = new URL(`https://api.stripe.com${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v != null && v !== '') url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) {
    const message = json?.error?.message || `Stripe request failed (${res.status})`;
    throw new Error(message);
  }
  return json;
}

function pickBestSubscription(items: any[]): any | null {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return null;
  const statusRank: Record<string, number> = {
    active: 0,
    trialing: 1,
    past_due: 2,
    unpaid: 3,
    incomplete: 4,
    canceled: 5,
  };
  const ranked = list
    .filter((s: any) => s && typeof s === 'object')
    .sort((a: any, b: any) => {
      const createdDiff = Number(b?.created || 0) - Number(a?.created || 0);
      if (createdDiff !== 0) return createdDiff;
      const sa = String(a?.status || '').toLowerCase();
      const sb = String(b?.status || '').toLowerCase();
      const ra = Number.isFinite(statusRank[sa]) ? statusRank[sa] : 99;
      const rb = Number.isFinite(statusRank[sb]) ? statusRank[sb] : 99;
      if (ra !== rb) return ra - rb;
      return 0;
    });
  return ranked[0] || null;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Server not configured' }), { status: 500, headers });
  }

  const auth = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing bearer token' }), { status: 401, headers });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: 'Invalid auth token' }), { status: 401, headers });
    }

    const user = userRes.user;
    const profileRes = await supabase
      .from('profiles')
      .select('id, tier')
      .eq('id', String(user.id || ''))
      .maybeSingle();
    const profileTier = String(profileRes?.data?.tier || '').toLowerCase();
    const recurringTier = profileTier === 'all_subjects' || profileTier === 'ultra' || profileTier === 'school_admin' || profileTier === 'owner';

    let sub: any | null = null;

    const escapedUserId = String(user.id || '').replace(/'/g, "\\'");
    if (escapedUserId) {
      try {
        const byUserId = await stripeGet('/v1/subscriptions/search', {
          query: `metadata['user_id']:'${escapedUserId}'`,
          limit: '10',
        });
        sub = pickBestSubscription(Array.isArray(byUserId?.data) ? byUserId.data : []);
      } catch {
        sub = null;
      }
    }

    if (!sub && user.email) {
      const escapedEmail = user.email.replace(/'/g, "\\'");
      try {
        const byEmail = await stripeGet('/v1/subscriptions/search', {
          query: `metadata['email']:'${escapedEmail}'`,
          limit: '10',
        });
        sub = pickBestSubscription(Array.isArray(byEmail?.data) ? byEmail.data : []);
      } catch {
        sub = null;
      }
    }

    if (!sub && user.email) {
      const escapedEmail = user.email.replace(/'/g, "\\'");
      const customerSearch = await stripeGet('/v1/customers/search', {
        query: `email:'${escapedEmail}'`,
        limit: '1',
      });
      const customer = Array.isArray(customerSearch?.data) ? customerSearch.data[0] : null;
      if (customer?.id) {
        const subs = await stripeGet('/v1/subscriptions', {
          customer: String(customer.id),
          status: 'all',
          limit: '10',
        });
        sub = pickBestSubscription(Array.isArray(subs?.data) ? subs.data : []);
      }
    }

    if (!sub) {
      return new Response(JSON.stringify({ billing: null }), { status: 200, headers });
    }

    const cancelAtPeriodEnd = Boolean(sub.cancel_at_period_end);
    const currentPeriodEnd = toIsoFromUnix(sub.current_period_end);
    const cancelAt = toIsoFromUnix(sub.cancel_at);
    const endedAt = toIsoFromUnix(sub.ended_at);
    const recurring = sub.items?.data?.[0]?.price?.recurring || null;

    const billing = {
      subscription_id: String(sub.id || ''),
      status: String(sub.status || ''),
      cancel_at_period_end: cancelAtPeriodEnd,
      current_period_end: currentPeriodEnd,
      next_billing_at: cancelAtPeriodEnd ? null : currentPeriodEnd,
      cancel_at: cancelAt,
      ended_at: endedAt,
      price_id: sub.items?.data?.[0]?.price?.id || null,
      billing_interval: recurring?.interval || null,
      billing_interval_count: Number(recurring?.interval_count || 1),
    };

    const billingStatus = String(sub.status || '').toLowerCase();
    const cancelledNow = billingStatus === 'canceled' || billingStatus === 'incomplete_expired';
    if (cancelledNow && recurringTier && profileRes?.data?.id) {
      await supabase
        .from('profiles')
        .update({
          tier: 'free',
          credits: 10,
          credits_reset_at: oneMonthFromNowIso(),
          unlimited_credits: false,
          unlocked_subjects: [],
          school_id: null,
          school_name: null,
        })
        .eq('id', String(profileRes.data.id));
    }

    return new Response(JSON.stringify({ billing }), { status: 200, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unexpected error' }),
      { status: 500, headers },
    );
  }
});
