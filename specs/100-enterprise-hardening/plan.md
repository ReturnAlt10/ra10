# Implementation Plan: Enterprise hardening

**Spec**: [spec.md](spec.md) | **Roadmap**: [enterprise/docs/08-enterprise-migration-roadmap.md](../../enterprise/docs/08-enterprise-migration-roadmap.md) | **Risks**: [07](../../enterprise/docs/07-security-and-risk-register.md)

## Summary

Harden RA10 incrementally, in milestones M-0 to M-10. Keep the static frontend plus Supabase architecture and every public contract, and keep the site shippable after every milestone.

## Technical context

Unchanged stack: static HTML/JS, Supabase (Auth, Postgres, Edge Functions, Storage) and GitHub Actions. New additions:

- `supabase/migrations/` and the Supabase CLI in CI;
- pgTAP;
- Deno test;
- Playwright;
- an optional Vite build (M-6);
- Sentry (M-9);
- a host with header control (M-8).

## Constitution check

| Gate | Status |
|---|---|
| Accuracy and exam fidelity | Not affected; content APIs are unchanged |
| Security | This plan's purpose (R-04 to R-08, R-11, R-13) |
| Privacy | M-10 |
| Compatibility | FR-007: public URLs, `window.*` globals, content APIs, `?ra10catalog` and localStorage keys are all frozen |
| Verification | Every milestone has an exit criterion (roadmap table) |

## Key designs

### Server-side credits (M-4)

```sql
create table public.action_costs (action text primary key, cost int not null check (cost >= 0));
create function public.spend_credits(p_action text) returns int language plpgsql security definer set search_path = public as $$
declare v_cost int; v_left int; v_unl boolean;
begin
  select cost into v_cost from action_costs where action = p_action;
  if v_cost is null then raise exception 'unknown action'; end if;
  select unlimited_credits or tier in ('ultra','owner') into v_unl from profiles where id = auth.uid();
  if v_unl then return -1; end if;
  update profiles set credits = credits - v_cost where id = auth.uid() and credits >= v_cost returning credits into v_left;
  if v_left is null then raise exception 'insufficient_credits'; end if;
  return v_left;
end $$;
```

- Edge functions call it with the **user's** JWT (an anon-key client plus an Authorization header) before calling the LLM, and refund on provider failure through a `refund_credits(p_action)` RPC that only the service role can execute.
- The privilege trigger then rejects **all** client changes to `credits`.

### Rate limits (M-4)

An `api_rate(user_id, fn, window_start, count)` table and a `rate_check(fn text, per_min int, per_day int)` RPC, modelled on `xp_rate`.

### Roles (M-5)

`app_roles(user_id uuid, role text)` with `has_role(text)` and `is_owner()`. Replace:

- `edu_is_owner()`;
- `is_community_owner()`;
- the email checks in the SDK and edge functions;
- the owner email in `study_hub_premium()`.

### Build step (M-6)

Vite multi-page config over the existing HTML, with hashed assets and no code rewrite. A shared `@ra10/engines` replaces the three `biz-*` copies through family adapters. Generators then reference the bundle.

## Rollout

Milestones ship independently, in the order M-0 → M-1 → M-2 → M-3 → M-4 → (M-5, M-8) → M-6 → (M-7, M-9, M-10). Each milestone is merged behind the CI gates from M-3, and SQL is applied to staging before production.
