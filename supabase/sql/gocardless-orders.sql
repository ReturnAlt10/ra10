-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — GoCardless order tracking
-- Run this in the Supabase SQL editor (https://supabase.com/dashboard).
--
-- GoCardless's hosted checkout redirects the payer away and only reports back
-- via webhooks for mandates/payments. To reliably map a payment/mandate event
-- back to the plan the user actually bought, we record the intent at checkout
-- time and look it up again in the webhook.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.gocardless_orders (
  id uuid primary key default gen_random_uuid(),
  gocardless_ref text unique,           -- billing request id (BRQ...)
  user_id uuid,
  email text,
  kind text not null,                   -- 'subscription' | 'payment'
  plan text,                            -- IT / BUSINESS / SPORT / PRO / ULTRA / EDU / CREDITS
  subject text,
  credits integer not null default 0,
  amount_pence integer not null default 0,
  interval_unit text,                   -- 'yearly' | 'monthly'
  status text not null default 'pending',  -- pending | fulfilled | failed | cancelled
  created_at timestamptz not null default now(),
  fulfilled_at timestamptz
);

create index if not exists gocardless_orders_email_idx on public.gocardless_orders (email);
create index if not exists gocardless_orders_ref_idx on public.gocardless_orders (gocardless_ref);

-- Only the service role (edge functions) should read/write these rows.
alter table public.gocardless_orders enable row level security;

drop policy if exists "gocardless_orders_service_role" on public.gocardless_orders;
create policy "gocardless_orders_service_role"
  on public.gocardless_orders
  for all
  to service_role
  using (true)
  with check (true);