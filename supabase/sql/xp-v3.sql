-- ═══════════════════════════════════════════════════════════════════════════
-- RA10 — XP v3: XP the server decides, rotating daily tasks and daily AI games.
-- Run AFTER edu-platform.sql, xp-integrity.sql, leaderboard-rewards.sql,
-- leaderboard-v2-roles-boosts.sql and study-hub.sql. Safe to re-run.
-- If you ever re-run one of those files, run this file again afterwards: it is
-- the live definition of increment_xp, xp_boost_bonus, claim_xp_boost and
-- settle_previous_leaderboard.
--
-- How XP works now
--   • The browser never decides an amount. Every app still calls
--     increment_xp(amount), but the server only pays out of an "earned bank"
--     filled from the learner's own activity_events, scored here:
--         written answer (4+ real words, not gibberish, not the question pasted back)  3–8
--         quiz question answered correctly                                              2
--         AI Examiner mark (score checked against the server's own record)            2–10
--         revision-guide section read (max 25 a day)                                    1
--         Python task passed                                                            5
--     Each question / section counts once a day, and at most 40 points are
--     credited per minute, so tapping through or pasting the same answer pays nothing.
--   • Daily tasks (5 a day, rotating per learner) and daily games are checked
--     against real evidence on the server before they pay.
--   • Boost bonuses are added on the server to XP that was really earned.
--   • Caps per London day: activity 600, tasks 250, games 90, Study Hub 150,
--     boost bonus 300, everything together 1,000. Plus 150 XP a minute.
--   • profiles.xp_total / xp_this_week / leaderboard results can no longer be
--     written from the browser; every grant is recorded in xp_ledger.
--   • The weekly leaderboard closes at the end of Saturday (UK time), matching
--     the countdown on the site, and gives a badge + a 3x boost (no credits).
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Tables ──────────────────────────────────────────────────────────────
create table if not exists public.xp_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  day date not null default ((now() at time zone 'Europe/London')::date),
  source text not null check (source in ('activity', 'task', 'game', 'study_hub', 'boost', 'admin')),
  amount integer not null,
  ref text,
  note text
);
create index if not exists xp_ledger_user_day_idx on public.xp_ledger (user_id, day, source);
create index if not exists xp_ledger_user_time_idx on public.xp_ledger (user_id, created_at desc);
alter table public.xp_ledger enable row level security;
drop policy if exists xp_ledger_own on public.xp_ledger;
create policy xp_ledger_own on public.xp_ledger for select to authenticated using (user_id = auth.uid());
grant select on public.xp_ledger to authenticated;

-- What has already been credited today (one row per question / section / mark).
create table if not exists public.xp_credited (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  k text not null,
  points integer not null default 0,
  event_id bigint,
  created_at timestamptz not null default now(),
  primary key (user_id, day, k)
);
create index if not exists xp_credited_time_idx on public.xp_credited (user_id, created_at desc);
alter table public.xp_credited enable row level security;

-- Marks written by the ai-mark edge function (service role), so an AI Examiner
-- event from the browser is only worth XP if the server really marked it.
create table if not exists public.xp_marks (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  ref text,
  score numeric not null default 0,
  max_score numeric not null default 1,
  used boolean not null default false
);
create index if not exists xp_marks_user_idx on public.xp_marks (user_id, created_at desc);
alter table public.xp_marks enable row level security;

alter table public.xp_rate
  add column if not exists last_award_at timestamptz,
  add column if not exists ev_cursor bigint not null default 0,
  add column if not exists bank integer not null default 0,
  add column if not exists bank_day date;

-- ─── 2. Profiles: XP and leaderboard results only change on the server ──────
-- (leaderboard_badge is the learner's own emoji badge and stays editable)
create or replace function public.protect_profile_xp_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare v_role text;
begin
  if coalesce(current_setting('app.skip_profile_priv_check', true), '') = 'true' then return new; end if;
  begin
    v_role := coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '');
  exception when others then v_role := '';
  end;
  if v_role not in ('authenticated', 'anon') then return new; end if;   -- service role, SQL editor, cron
  if tg_op = 'INSERT' then
    new.xp_total := 0;
    new.xp_this_week := 0;
    new.leaderboard_badge_week := null;
    new.leaderboard_last_rank := null;
    new.leaderboard_award_credits := 0;
    return new;
  end if;
  if new.xp_total is distinct from old.xp_total or new.xp_this_week is distinct from old.xp_this_week then
    raise exception 'Forbidden: XP can only be earned, not set' using errcode = '42501';
  end if;
  if new.leaderboard_last_rank is distinct from old.leaderboard_last_rank
     or new.leaderboard_badge_week is distinct from old.leaderboard_badge_week
     or new.leaderboard_award_credits is distinct from old.leaderboard_award_credits then
    raise exception 'Forbidden: leaderboard results cannot be changed directly' using errcode = '42501';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_protect_profile_xp_columns on public.profiles;
create trigger trg_protect_profile_xp_columns
  before insert or update on public.profiles
  for each row execute function public.protect_profile_xp_columns();

-- ─── 3. Gibberish check (kept from xp-integrity.sql, slightly stricter) ─────
create or replace function public.xp_answer_is_meaningful(p_answer text, p_kind text)
returns boolean
language sql
immutable
as $$
  select case
    when nullif(btrim(coalesce(p_answer, '')), '') is null then false
    when length(btrim(p_answer)) < 3 then false
    when btrim(p_answer) ~* '^(.)\1{3,}$' then false
    when btrim(p_answer) ~* '(asdf|qwer|zxcv|aidsus|susdis|testtest|blahblah|lorem ipsum)' then false
    when length(btrim(p_answer)) >= 6 and btrim(p_answer) ~* '^[^aeiou]+$' then false
    when btrim(p_answer) ~* '[bcdfghjklmnpqrstvwxz]{5,}' then false
    when btrim(p_answer) ~* '(\m\w+\M)(\s+\1\M){3,}' then false                          -- "word word word word"
    when p_kind in ('answer', 'ai_examine') and length(btrim(p_answer)) >= 10
         and btrim(p_answer) !~ '\s'
         and btrim(p_answer) !~* '(the|and|ing|ion|ate|ent|ers|ous|ive|ity|ism|psy|mem|con|beh|res|neu|bra|eco|soc|inf|att|cli)' then false
    else true
  end
$$;

-- ─── 4. The earned bank ─────────────────────────────────────────────────────
-- Scores new activity_events since the last call. Caller must hold the
-- learner's xp_rate row lock. Returns the bank after scoring.
create or replace function public.xp_refresh_bank(p_uid uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.xp_rate;
  e record;
  m record;
  v_day date := (now() at time zone 'Europe/London')::date;
  v_pts integer;
  v_key text;
  v_txt text;
  v_words integer;
  v_minute integer;
  v_guide integer;
  v_max bigint := 0;
  v_ins integer;
begin
  select * into r from public.xp_rate where user_id = p_uid;
  if r.user_id is null then return 0; end if;
  if r.bank_day is distinct from v_day then r.bank := 0; r.bank_day := v_day; end if;

  for e in
    select * from public.activity_events
     where user_id = p_uid and id > r.ev_cursor and created_at > now() - interval '6 hours'
     order by id
     limit 500
  loop
    v_max := e.id;
    v_pts := 0;
    v_key := null;
    v_txt := btrim(coalesce(e.answer, ''));
    v_words := coalesce(array_length(regexp_split_to_array(nullif(v_txt, ''), '\s+'), 1), 0);

    if e.kind = 'answer' then
      if v_words >= 4 and public.xp_answer_is_meaningful(v_txt, 'answer')
         and lower(v_txt) <> lower(btrim(coalesce(e.title, ''))) then
        v_pts := least(8, 3 + v_words / 15);
        v_key := 'a:' || coalesce(nullif(e.ref, ''), md5(lower(v_txt)));
      end if;
    elsif e.kind = 'mcq' then
      if coalesce(e.score, 0) > 0 and v_txt <> '' then
        v_pts := 2;
        v_key := 'm:' || coalesce(e.unit, '') || ':' || coalesce(nullif(e.ref, ''), md5(lower(coalesce(e.title, ''))));
      end if;
    elsif e.kind = 'ai_examine' then
      if public.xp_answer_is_meaningful(v_txt, 'ai_examine') and v_words >= 4 then
        select * into m from public.xp_marks
         where user_id = p_uid and not used
           and created_at between e.created_at - interval '10 minutes' and e.created_at + interval '1 minute'
         order by created_at desc limit 1;
        if m.id is not null then
          update public.xp_marks set used = true where id = m.id;
          v_pts := 2 + round(8 * least(1, greatest(0, m.score / nullif(m.max_score, 0))))::integer;
          v_key := 'x:' || coalesce(nullif(e.ref, ''), md5(lower(v_txt)));
        else
          -- not marked by our server: worth the same as a written answer, once
          v_pts := least(8, 3 + v_words / 15);
          v_key := 'a:' || coalesce(nullif(e.ref, ''), md5(lower(v_txt)));
        end if;
      end if;
    elsif e.kind = 'guide_section' then
      select count(*) into v_guide from public.xp_credited where user_id = p_uid and day = v_day and k like 'g:%';
      if v_guide < 25 then
        v_pts := 1;
        v_key := 'g:' || coalesce(e.unit, '') || ':' || coalesce(nullif(e.ref, ''), md5(coalesce(e.title, '')));
      end if;
    elsif e.kind = 'code_task' then
      if coalesce(e.score, 0) > 0 and coalesce(e.score, 0) >= coalesce(e.max_score, 1) then
        v_pts := 5;
        v_key := 'c:' || coalesce(nullif(e.ref, ''), md5(coalesce(e.title, '')));
      end if;
    end if;

    if v_pts > 0 and v_key is not null then
      select coalesce(sum(points), 0) into v_minute from public.xp_credited
       where user_id = p_uid and created_at > e.created_at - interval '60 seconds' and created_at <= e.created_at;
      v_pts := least(v_pts, greatest(0, 40 - v_minute));
      if v_pts > 0 then
        insert into public.xp_credited (user_id, day, k, points, event_id, created_at)
        values (p_uid, v_day, v_key, v_pts, e.id, e.created_at)
        on conflict (user_id, day, k) do nothing;
        get diagnostics v_ins = row_count;
        if v_ins > 0 then r.bank := r.bank + v_pts; end if;
      end if;
    end if;
  end loop;

  if v_max > r.ev_cursor then r.ev_cursor := v_max; end if;
  r.bank := least(r.bank, 400);
  update public.xp_rate set ev_cursor = r.ev_cursor, bank = r.bank, bank_day = r.bank_day where user_id = p_uid;
  return r.bank;
end;
$$;
revoke all on function public.xp_refresh_bank(uuid) from public, anon, authenticated;

-- ─── 5. The only place XP is added ──────────────────────────────────────────
-- Caller must hold the learner's xp_rate row lock.
create or replace function public.xp_grant(p_uid uuid, p_source text, p_amount integer, p_ref text default null, p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day date := (now() at time zone 'Europe/London')::date;
  r public.xp_rate;
  v_amt integer := greatest(0, coalesce(p_amount, 0));
  v_src_today integer;
  v_all_today integer;
  v_bonus_today integer;
  v_cap integer;
  v_boost public.xp_boosts;
  v_bonus integer := 0;
begin
  select * into r from public.xp_rate where user_id = p_uid;
  select coalesce(sum(amount) filter (where source = p_source), 0),
         coalesce(sum(amount) filter (where source not in ('boost', 'admin')), 0),
         coalesce(sum(amount) filter (where source = 'boost'), 0)
    into v_src_today, v_all_today, v_bonus_today
    from public.xp_ledger where user_id = p_uid and day = v_day;

  if p_source <> 'admin' then
    v_cap := case p_source when 'activity' then 600 when 'task' then 250 when 'game' then 90 when 'study_hub' then 150 else 0 end;
    if r.minute_start is null or r.minute_start < now() - interval '1 minute' then r.minute_start := now(); r.minute_xp := 0; end if;
    v_amt := least(v_amt, v_cap - v_src_today, 1000 - v_all_today, 150 - coalesce(r.minute_xp, 0));
  end if;
  if v_amt <= 0 then
    update public.xp_rate set blocked = blocked + 1 where user_id = p_uid;
    return jsonb_build_object('granted', 0, 'bonus', 0, 'multiplier', 1, 'reason', 'cap');
  end if;

  if p_source <> 'admin' then
    select * into v_boost from public.xp_boosts
     where user_id = p_uid and expires_at > now()
     order by expires_at desc limit 1 for update;
    if v_boost.id is not null then
      v_bonus := greatest(0, least(v_amt * (v_boost.multiplier - 1), 600 - v_boost.bonus_awarded, 300 - v_bonus_today));
      if v_bonus > 0 then
        update public.xp_boosts set bonus_awarded = bonus_awarded + v_bonus where id = v_boost.id;
      end if;
    end if;
  end if;

  insert into public.xp_ledger (user_id, day, source, amount, ref, note) values (p_uid, v_day, p_source, v_amt, left(p_ref, 120), left(p_note, 200));
  if v_bonus > 0 then
    insert into public.xp_ledger (user_id, day, source, amount, ref, note)
    values (p_uid, v_day, 'boost', v_bonus, left(p_ref, 120), v_boost.multiplier || 'x boost');
  end if;

  update public.xp_rate
     set minute_start = r.minute_start,
         minute_xp = coalesce(r.minute_xp, 0) + v_amt,
         day = current_date,
         day_xp = (case when day = current_date then day_xp else 0 end) + v_amt + v_bonus,
         last_award_at = now()
   where user_id = p_uid;

  perform set_config('app.skip_profile_priv_check', 'true', true);
  update public.profiles
     set xp_total = coalesce(xp_total, 0) + v_amt + v_bonus,
         xp_this_week = coalesce(xp_this_week, 0) + v_amt + v_bonus
   where id = p_uid;
  perform set_config('app.skip_profile_priv_check', '', true);

  return jsonb_build_object('granted', v_amt, 'bonus', v_bonus, 'multiplier', coalesce(v_boost.multiplier, 1));
end;
$$;
revoke all on function public.xp_grant(uuid, text, integer, text, text) from public, anon, authenticated;

-- ─── 6. Public entry points ─────────────────────────────────────────────────
-- p_amount > 0: what the app would like to award (paid up to what was earned).
-- p_amount = 0: pay out everything earned so far (the XP layer does this every
-- couple of minutes so reading and practising always counts).
create or replace function public.xp_claim(p_amount integer default 0, p_reason text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_bank integer;
  v_want integer;
  v_res jsonb;
  v_granted integer;
begin
  if v_uid is null then return jsonb_build_object('granted', 0, 'bonus', 0, 'reason', 'signed_out'); end if;
  insert into public.xp_rate (user_id) values (v_uid) on conflict (user_id) do nothing;
  perform 1 from public.xp_rate where user_id = v_uid for update;
  v_bank := public.xp_refresh_bank(v_uid);
  v_want := case when coalesce(p_amount, 0) <= 0 then v_bank else least(p_amount, 100, v_bank) end;
  if v_want <= 0 then
    return jsonb_build_object('granted', 0, 'bonus', 0, 'bank', v_bank, 'reason', 'no_learning');
  end if;
  v_res := public.xp_grant(v_uid, 'activity', v_want, left(p_reason, 60));
  v_granted := coalesce((v_res ->> 'granted')::integer, 0);
  update public.xp_rate set bank = greatest(0, bank - v_granted) where user_id = v_uid;
  return v_res || jsonb_build_object('bank', greatest(0, v_bank - v_granted));
end;
$$;
revoke all on function public.xp_claim(integer, text) from public, anon;
grant execute on function public.xp_claim(integer, text) to authenticated;

-- Kept for every existing app: returns the XP actually granted (0 when nothing was earned).
create or replace function public.increment_xp(amount integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(amount, 0) <= 0 then return 0; end if;
  return coalesce((public.xp_claim(amount, 'app') ->> 'granted')::integer, 0);
end;
$$;
revoke all on function public.increment_xp(integer) from public, anon;
grant execute on function public.increment_xp(integer) to authenticated;

-- Boost bonuses are now added inside xp_grant to XP that was really earned.
-- This stays so older pages keep working, but it never pays anything itself.
create or replace function public.xp_boost_bonus(p_base integer)
returns table(bonus integer, multiplier integer, expires_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select 0, b.multiplier, b.expires_at from public.xp_boosts b
   where b.user_id = auth.uid() and b.expires_at > now()
   order by b.expires_at desc limit 1;
$$;
revoke all on function public.xp_boost_bonus(integer) from public, anon;
grant execute on function public.xp_boost_bonus(integer) to authenticated;

-- Edge functions (service role): AI Examiner marks, games, Study Hub.
create or replace function public.xp_record_mark(p_user uuid, p_ref text, p_score numeric, p_max numeric)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.xp_marks (user_id, ref, score, max_score)
  values (p_user, left(p_ref, 160), greatest(0, coalesce(p_score, 0)), greatest(1, coalesce(p_max, 1)));
$$;
revoke all on function public.xp_record_mark(uuid, text, numeric, numeric) from public, anon, authenticated;
grant execute on function public.xp_record_mark(uuid, text, numeric, numeric) to service_role;

create or replace function public.xp_award_server(p_user uuid, p_source text, p_amount integer, p_ref text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user is null or p_source not in ('game', 'study_hub') then
    return jsonb_build_object('granted', 0, 'bonus', 0, 'reason', 'bad_source');
  end if;
  insert into public.xp_rate (user_id) values (p_user) on conflict (user_id) do nothing;
  perform 1 from public.xp_rate where user_id = p_user for update;
  return public.xp_grant(p_user, p_source, least(greatest(coalesce(p_amount, 0), 0), 60), p_ref);
end;
$$;
revoke all on function public.xp_award_server(uuid, text, integer, text) from public, anon, authenticated;
grant execute on function public.xp_award_server(uuid, text, integer, text) to service_role;

-- What the learner has earned today (for the Tasks page).
create or replace function public.xp_today()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'day', (now() at time zone 'Europe/London')::date,
    'total', coalesce(sum(s.amt), 0),
    'by_source', coalesce(jsonb_object_agg(s.source, s.amt), '{}'::jsonb),
    'cap', 1000)
  from (select x.source, sum(x.amount)::int as amt from public.xp_ledger x
         where x.user_id = auth.uid() and x.day = (now() at time zone 'Europe/London')::date
         group by x.source) s;
$$;
revoke all on function public.xp_today() from public, anon;
grant execute on function public.xp_today() to authenticated;

-- ─── 7. Daily tasks (5 a day, rotating per learner) ─────────────────────────
create table if not exists public.daily_task_catalog (
  key text primary key,
  slot text not null check (slot in ('write', 'ai', 'quiz', 'explore', 'game')),
  title text not null,
  detail text not null,
  metric text not null,
  target integer not null check (target > 0),
  min_pct integer,
  xp integer not null check (xp between 1 and 80),
  premium_only boolean not null default false,
  active boolean not null default true
);
alter table public.daily_task_catalog enable row level security;
drop policy if exists daily_task_catalog_read on public.daily_task_catalog;
create policy daily_task_catalog_read on public.daily_task_catalog for select to authenticated using (true);
grant select on public.daily_task_catalog to authenticated;

insert into public.daily_task_catalog (key, slot, title, detail, metric, target, min_pct, xp, premium_only) values
  ('answers_3',   'write',   'Write 3 exam-style answers',            'Answer 3 written questions in any unit. Real sentences only.',                 'answers',      3, null, 40, false),
  ('answers_6',   'write',   'Write 6 exam-style answers',            'Answer 6 different written questions today.',                                  'answers',      6, null, 60, false),
  ('long_answer', 'write',   'Write a developed answer',              'Write one answer of 60 words or more: explain, then apply it.',                'long_answer',  1, null, 35, false),
  ('ai_mark_1',   'ai',      'Get marked by the AI Examiner',         'Send one real answer to the AI Examiner and read the feedback.',               'ai_marks',     1, null, 30, false),
  ('ai_good',     'ai',      'Score 60%+ with the AI Examiner',       'Get at least 60% on one AI-marked answer.',                                    'ai_good',      1, 60,   50, false),
  ('mcq_10',      'quiz',    'Get 10 quiz questions right',           'Correct answers in any unit quiz count.',                                      'mcq_correct', 10, null, 30, false),
  ('mcq_25',      'quiz',    'Get 25 quiz questions right',           'A longer quiz streak: 25 correct answers today.',                              'mcq_correct', 25, null, 55, false),
  ('guide_3',     'explore', 'Read 3 revision-guide sections',        'Spend time on 3 sections of a revision guide.',                                'guide',        3, null, 20, false),
  ('guide_6',     'explore', 'Read 6 revision-guide sections',        'Work through 6 sections of a revision guide.',                                 'guide',        6, null, 35, false),
  ('units_2',     'explore', 'Revise in 2 different units',           'Answer or read in two units today (3+ actions in each).',                      'units',        2, null, 30, false),
  ('study_hub',   'explore', 'Finish a Study Hub lesson',             'Complete one of your Study Hub lessons.',                                      'study_hub',    1, null, 40, true),
  ('game_play',   'game',    'Play one of today''s AI games',         'Finish any of today''s three games.',                                          'games',        1, null, 20, false),
  ('game_score',  'game',    'Score 80%+ in a daily game',            'Get 80% or more in one of today''s games.',                                    'game_score',   1, 80,   35, false),
  ('game_all',    'game',    'Finish all three daily games',          'Match-up, True or False and Quickfire.',                                       'games',        3, null, 45, false)
on conflict (key) do update set
  slot = excluded.slot, title = excluded.title, detail = excluded.detail, metric = excluded.metric,
  target = excluded.target, min_pct = excluded.min_pct, xp = excluded.xp, premium_only = excluded.premium_only;

create table if not exists public.daily_task_claims (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  key text not null,
  xp integer not null default 0,
  claimed_at timestamptz not null default now(),
  primary key (user_id, day, key)
);
alter table public.daily_task_claims enable row level security;
drop policy if exists daily_task_claims_own on public.daily_task_claims;
create policy daily_task_claims_own on public.daily_task_claims for select to authenticated using (user_id = auth.uid());
grant select on public.daily_task_claims to authenticated;

-- ─── 8. Daily games (written by the daily-games edge function) ──────────────
create table if not exists public.daily_games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  unit text not null,
  unit_name text,
  title text,
  games jsonb not null,          -- includes the answer keys; only the edge function reads this table
  provider text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, day, unit)
);
alter table public.daily_games enable row level security;

create table if not exists public.daily_game_plays (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  set_id uuid not null references public.daily_games (id) on delete cascade,
  day date not null,
  game text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score integer,
  max_score integer,
  xp integer not null default 0,
  unique (user_id, set_id, game)
);
create index if not exists daily_game_plays_user_day_idx on public.daily_game_plays (user_id, day);
alter table public.daily_game_plays enable row level security;
drop policy if exists daily_game_plays_own on public.daily_game_plays;
create policy daily_game_plays_own on public.daily_game_plays for select to authenticated using (user_id = auth.uid());
grant select on public.daily_game_plays to authenticated;

-- ─── 9. Task progress, today's picks, claiming ──────────────────────────────
create or replace function public.xp_is_premium(p_uid uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare v boolean := false;
begin
  if to_regprocedure('public.study_hub_premium(uuid)') is not null then
    execute 'select public.study_hub_premium($1)' into v using p_uid;
  end if;
  return coalesce(v, false);
end;
$$;
revoke all on function public.xp_is_premium(uuid) from public, anon, authenticated;

create or replace function public.xp_task_progress(p_uid uuid, p_metric text, p_min_pct integer, p_day date)
returns integer
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_from timestamptz := (p_day::timestamp at time zone 'Europe/London');
  v_to timestamptz := ((p_day + 1)::timestamp at time zone 'Europe/London');
  v integer := 0;
begin
  if p_metric = 'answers' then
    select count(*) into v from public.xp_credited where user_id = p_uid and day = p_day and k like 'a:%';
  elsif p_metric = 'mcq_correct' then
    select count(*) into v from public.xp_credited where user_id = p_uid and day = p_day and k like 'm:%';
  elsif p_metric = 'ai_marks' then
    select count(*) into v from public.xp_credited where user_id = p_uid and day = p_day and k like 'x:%';
  elsif p_metric = 'guide' then
    select count(*) into v from public.xp_credited where user_id = p_uid and day = p_day and k like 'g:%';
  elsif p_metric = 'long_answer' then
    select count(*) into v from public.activity_events
     where user_id = p_uid and created_at >= v_from and created_at < v_to
       and kind in ('answer', 'ai_examine')
       and coalesce(array_length(regexp_split_to_array(nullif(btrim(coalesce(answer, '')), ''), '\s+'), 1), 0) >= 60
       and public.xp_answer_is_meaningful(answer, 'answer');
  elsif p_metric = 'ai_good' then
    select count(*) into v from public.xp_marks
     where user_id = p_uid and used and created_at >= v_from and created_at < v_to
       and score * 100 >= coalesce(p_min_pct, 60) * max_score;
  elsif p_metric = 'units' then
    select count(*) into v from (
      select unit from public.activity_events
       where user_id = p_uid and created_at >= v_from and created_at < v_to
         and unit is not null and kind in ('answer', 'mcq', 'ai_examine', 'guide_section')
       group by unit having count(*) >= 3) u;
  elsif p_metric = 'games' then
    select count(*) into v from public.daily_game_plays where user_id = p_uid and day = p_day and finished_at is not null;
  elsif p_metric = 'game_score' then
    select count(*) into v from public.daily_game_plays
     where user_id = p_uid and day = p_day and finished_at is not null and max_score > 0
       and score * 100 >= coalesce(p_min_pct, 80) * max_score;
  elsif p_metric = 'study_hub' and to_regclass('public.study_lessons') is not null then
    execute 'select count(*) from public.study_lessons where user_id = $1 and status = ''done'' and kind is distinct from ''template'' and completed_at >= $2 and completed_at < $3'
      into v using p_uid, v_from, v_to;
  end if;
  return coalesce(v, 0);
end;
$$;
revoke all on function public.xp_task_progress(uuid, text, integer, date) from public, anon, authenticated;

-- One task per slot, chosen by a hash of (learner, day): different for every
-- learner, the same all day on every device, new tomorrow.
create or replace function public.xp_daily_picks(p_uid uuid, p_day date)
returns setof public.daily_task_catalog
language sql
stable
security definer
set search_path = public
as $$
  select c.* from (values ('write', 1), ('ai', 2), ('quiz', 3), ('explore', 4), ('game', 5)) s(slot, ord)
  cross join lateral (
    select * from public.daily_task_catalog t
     where t.active and t.slot = s.slot and (not t.premium_only or public.xp_is_premium(p_uid))
     order by md5(p_uid::text || ':' || p_day::text || ':' || t.key)
     limit 1) c
  order by s.ord;
$$;
revoke all on function public.xp_daily_picks(uuid, date) from public, anon, authenticated;

create or replace function public.get_daily_tasks()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'Europe/London')::date;
  v_tasks jsonb := '[]'::jsonb;
  t record;
  v_prog integer;
  v_claimed boolean;
  v_recent jsonb;
begin
  if v_uid is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  insert into public.xp_rate (user_id) values (v_uid) on conflict (user_id) do nothing;
  perform 1 from public.xp_rate where user_id = v_uid for update;
  perform public.xp_refresh_bank(v_uid);
  for t in select * from public.xp_daily_picks(v_uid, v_day) loop
    v_prog := public.xp_task_progress(v_uid, t.metric, t.min_pct, v_day);
    v_claimed := exists (select 1 from public.daily_task_claims where user_id = v_uid and day = v_day and key = t.key);
    v_tasks := v_tasks || jsonb_build_object(
      'key', t.key, 'slot', t.slot, 'title', t.title, 'detail', t.detail, 'target', t.target,
      'progress', least(v_prog, t.target), 'xp', t.xp, 'claimed', v_claimed,
      'claimable', not v_claimed and v_prog >= t.target);
  end loop;
  select coalesce(jsonb_agg(unit order by last desc), '[]'::jsonb) into v_recent from (
    select unit, max(created_at) as last from public.activity_events
     where user_id = v_uid and created_at > now() - interval '21 days' and unit like '/revision/%'
     group by unit order by max(created_at) desc limit 4) u;
  return jsonb_build_object(
    'day', v_day,
    'tasks', v_tasks,
    'all_done', not exists (select 1 from jsonb_array_elements(v_tasks) x where not (x ->> 'claimed')::boolean),
    'xp_today', coalesce((select sum(amount) from public.xp_ledger where user_id = v_uid and day = v_day), 0),
    'xp_cap', 1000,
    'recent_units', v_recent);
end;
$$;
revoke all on function public.get_daily_tasks() from public, anon;
grant execute on function public.get_daily_tasks() to authenticated;

create or replace function public.claim_daily_task(p_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_day date := (now() at time zone 'Europe/London')::date;
  t public.daily_task_catalog;
  v_prog integer;
  v_res jsonb;
  v_ins integer;
begin
  if v_uid is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  insert into public.xp_rate (user_id) values (v_uid) on conflict (user_id) do nothing;
  perform 1 from public.xp_rate where user_id = v_uid for update;
  select * into t from public.xp_daily_picks(v_uid, v_day) p where p.key = p_key;
  if t.key is null then raise exception 'That task is not one of today''s tasks.' using errcode = 'P0001'; end if;
  perform public.xp_refresh_bank(v_uid);
  v_prog := public.xp_task_progress(v_uid, t.metric, t.min_pct, v_day);
  if v_prog < t.target then
    raise exception 'Not finished yet (% of %).', v_prog, t.target using errcode = 'P0001';
  end if;
  insert into public.daily_task_claims (user_id, day, key, xp) values (v_uid, v_day, t.key, 0)
  on conflict (user_id, day, key) do nothing;
  get diagnostics v_ins = row_count;
  if v_ins = 0 then return jsonb_build_object('granted', 0, 'bonus', 0, 'already', true); end if;
  v_res := public.xp_grant(v_uid, 'task', t.xp, 'task:' || t.key);
  update public.daily_task_claims set xp = coalesce((v_res ->> 'granted')::integer, 0) + coalesce((v_res ->> 'bonus')::integer, 0)
   where user_id = v_uid and day = v_day and key = t.key;
  return v_res;
end;
$$;
revoke all on function public.claim_daily_task(text) from public, anon;
grant execute on function public.claim_daily_task(text) to authenticated;

-- ─── 10. Boost rewards checked against real, server-scored evidence ─────────
create or replace function public.claim_xp_boost(p_source text)
returns public.xp_boosts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_today date := (now() at time zone 'Europe/London')::date;
  v_key text;
  v_mult integer;
  v_min integer;
  v_n integer;
  v_profile record;
  v_row public.xp_boosts;
begin
  if v_uid is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  insert into public.xp_rate (user_id) values (v_uid) on conflict (user_id) do nothing;
  perform 1 from public.xp_rate where user_id = v_uid for update;
  perform public.xp_refresh_bank(v_uid);

  if p_source = 'daily_practice' then
    select count(*) into v_n from public.xp_credited
     where user_id = v_uid and day = v_today and (k like 'a:%' or k like 'm:%' or k like 'x:%');
    if v_n < 10 then raise exception 'Answer 10 questions today to unlock this boost (% so far).', v_n using errcode = 'P0001'; end if;
    v_key := v_today::text; v_mult := 2; v_min := 15;
  elsif p_source = 'daily_tasks' then
    select count(*) into v_n from public.daily_task_claims c
     where c.user_id = v_uid and c.day = v_today and c.key in (select key from public.xp_daily_picks(v_uid, v_today));
    if v_n < 5 then raise exception 'Finish all 5 of today''s tasks to unlock this boost (% of 5).', v_n using errcode = 'P0001'; end if;
    v_key := v_today::text; v_mult := 2; v_min := 30;
  elsif p_source = 'streak_7' then
    select count(distinct day) into v_n from public.xp_ledger
     where user_id = v_uid and day > v_today - 7 and source in ('activity', 'task', 'game', 'study_hub');
    if v_n < 7 then raise exception 'Earn XP on 7 days in a row to unlock this boost (% of 7).', v_n using errcode = 'P0001'; end if;
    v_key := to_char(v_today, 'IYYY-IW'); v_mult := 3; v_min := 15;
  elsif p_source = 'weekly_podium' then
    select leaderboard_last_rank, leaderboard_badge_week into v_profile from public.profiles where id = v_uid;
    if coalesce(v_profile.leaderboard_last_rank, 99) > 3 or v_profile.leaderboard_badge_week is null
       or v_profile.leaderboard_badge_week < v_today - 14 then
      raise exception 'Finish in the top 3 to unlock this boost.' using errcode = 'P0001';
    end if;
    v_key := v_profile.leaderboard_badge_week::text; v_mult := 3; v_min := 30;
  else
    raise exception 'Unknown boost' using errcode = '22023';
  end if;

  insert into public.xp_boosts (user_id, source, period_key, multiplier, minutes)
  values (v_uid, p_source, v_key, v_mult, v_min)
  on conflict (user_id, source, period_key) do nothing
  returning * into v_row;
  if v_row.id is null then
    raise exception 'You have already claimed this boost.' using errcode = 'P0001';
  end if;
  return v_row;
end;
$$;
revoke all on function public.claim_xp_boost(text) from public, anon;
grant execute on function public.claim_xp_boost(text) to authenticated;

-- ─── 11. Weekly leaderboard: closes at the end of Saturday (UK), no credits ─
create or replace function public.settle_previous_leaderboard()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  -- the week runs Sunday 00:00 → Saturday 23:59 UK time (the site's countdown)
  v_this_week date := ((now() at time zone 'Europe/London')::date
                       - extract(dow from (now() at time zone 'Europe/London'))::integer);
  v_week_start date := v_this_week - 7;
  v_count integer := 0;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  perform pg_advisory_xact_lock(hashtext('ra10-leaderboard-settlement'));
  if exists (select 1 from public.leaderboard_weekly_results where week_start = v_week_start)
     or exists (select 1 from public.leaderboard_weekly_results where settled_at > now() - interval '5 days') then
    return json_build_object('ok', true, 'settled', false, 'week_start', v_week_start);
  end if;

  perform set_config('app.skip_profile_priv_check', 'true', true);
  with ranked as (
    select p.id,
           row_number() over (order by coalesce(p.xp_this_week, 0) desc, coalesce(p.xp_total, 0) desc, p.id)::integer as rank
      from public.profiles p
     where coalesce(p.xp_this_week, 0) > 0
  ),
  podium as (
    select id, rank,
           case rank when 1 then '🥇 1st' when 2 then '🥈 2nd' when 3 then '🥉 3rd' end as badge
      from ranked where rank <= 3
  ),
  inserted as (
    insert into public.leaderboard_weekly_results (week_start, profile_id, rank, credits_awarded, badge)
    select v_week_start, id, rank, 0, badge from podium
    on conflict (week_start, profile_id) do nothing
    returning profile_id, rank, badge
  )
  update public.profiles p
     set leaderboard_badge = i.badge || ' · Last week',
         leaderboard_badge_week = v_week_start,
         leaderboard_last_rank = i.rank,
         leaderboard_award_credits = 0
    from inserted i
   where p.id = i.profile_id;
  get diagnostics v_count = row_count;

  update public.profiles set xp_this_week = 0 where coalesce(xp_this_week, 0) > 0;
  perform set_config('app.skip_profile_priv_check', '', true);
  return json_build_object('ok', true, 'settled', true, 'week_start', v_week_start, 'winners', v_count);
end;
$$;
revoke all on function public.settle_previous_leaderboard() from public;
grant execute on function public.settle_previous_leaderboard() to authenticated;

-- ─── 12. Owner tools ────────────────────────────────────────────────────────
-- Accounts whose weekly XP is far above what the ledger can explain (XP from
-- before XP v3, or anything unexpected).
create or replace function public.xp_owner_review(p_limit integer default 50)
returns table(user_id uuid, username text, xp_this_week integer, ledger_this_week integer, unexplained integer, blocked integer, last_award_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare v_week date := ((now() at time zone 'Europe/London')::date - extract(dow from (now() at time zone 'Europe/London'))::integer);
begin
  if not public.edu_is_owner() then raise exception 'Owner only' using errcode = '42501'; end if;
  return query
  select p.id, p.username, coalesce(p.xp_this_week, 0)::int,
         coalesce(l.s, 0)::int, (coalesce(p.xp_this_week, 0) - coalesce(l.s, 0))::int,
         coalesce(r.blocked, 0)::int, r.last_award_at
    from public.profiles p
    left join (select x.user_id, sum(x.amount) s from public.xp_ledger x where x.day >= v_week group by x.user_id) l on l.user_id = p.id
    left join public.xp_rate r on r.user_id = p.id
   where coalesce(p.xp_this_week, 0) > 0
   order by (coalesce(p.xp_this_week, 0) - coalesce(l.s, 0)) desc
   limit greatest(1, least(coalesce(p_limit, 50), 500));
end;
$$;
revoke all on function public.xp_owner_review(integer) from public, anon;
grant execute on function public.xp_owner_review(integer) to authenticated;

create or replace function public.xp_owner_adjust(p_user uuid, p_delta integer, p_reason text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_total integer;
begin
  if not public.edu_is_owner() then raise exception 'Owner only' using errcode = '42501'; end if;
  if coalesce(btrim(p_reason), '') = '' then raise exception 'Give a reason' using errcode = '22023'; end if;
  insert into public.xp_ledger (user_id, source, amount, note) values (p_user, 'admin', coalesce(p_delta, 0), left(p_reason, 200));
  perform set_config('app.skip_profile_priv_check', 'true', true);
  update public.profiles
     set xp_total = greatest(0, coalesce(xp_total, 0) + coalesce(p_delta, 0)),
         xp_this_week = greatest(0, coalesce(xp_this_week, 0) + coalesce(p_delta, 0))
   where id = p_user
  returning xp_total into v_total;
  perform set_config('app.skip_profile_priv_check', '', true);
  return v_total;
end;
$$;
revoke all on function public.xp_owner_adjust(uuid, integer, text) from public, anon;
grant execute on function public.xp_owner_adjust(uuid, integer, text) to authenticated;

-- Optional, owner only: make this week's board fair by setting everyone's weekly
-- XP to what the ledger proves they earned since the week started.
create or replace function public.xp_owner_reset_week_to_ledger()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_week date := ((now() at time zone 'Europe/London')::date - extract(dow from (now() at time zone 'Europe/London'))::integer);
  v_n integer;
begin
  if not public.edu_is_owner() then raise exception 'Owner only' using errcode = '42501'; end if;
  perform set_config('app.skip_profile_priv_check', 'true', true);
  update public.profiles p
     set xp_this_week = coalesce((select sum(x.amount) from public.xp_ledger x where x.user_id = p.id and x.day >= v_week), 0)
   where coalesce(p.xp_this_week, 0) > 0;
  get diagnostics v_n = row_count;
  perform set_config('app.skip_profile_priv_check', '', true);
  return v_n;
end;
$$;
revoke all on function public.xp_owner_reset_week_to_ledger() from public, anon;
grant execute on function public.xp_owner_reset_week_to_ledger() to authenticated;

-- The old unguarded function is no longer used by anything; keep it locked away.
do $$
declare v_fn regprocedure;
begin
  select p.oid::regprocedure into v_fn from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname = 'increment_xp_unguarded' limit 1;
  if v_fn is not null then
    execute format('revoke all on function %s from public, anon, authenticated', v_fn);
  end if;
end $$;
