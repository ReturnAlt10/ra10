-- RA10 — XP integrity guard.
-- Run after edu-platform.sql. Safe to re-run.

alter table public.xp_rate
  add column if not exists last_award_at timestamptz;

create or replace function public.xp_answer_is_meaningful(p_answer text, p_kind text)
returns boolean
language sql
immutable
as $$
  select case
    when nullif(btrim(coalesce(p_answer, '')), '') is null then false
    when length(btrim(p_answer)) < 3 then false
    when btrim(p_answer) ~* '^(.)\1{3,}$' then false
    when btrim(p_answer) ~* '(asdf|qwer|zxcv|aidsus|susdis|testtest|blahblah)' then false
    when p_kind = 'answer' and length(btrim(p_answer)) >= 10
         and btrim(p_answer) !~ '\s'
         and btrim(p_answer) !~* '(the|and|ing|ion|ate|ent|ers|ous|ive|ity|ism|psy|mem|con|beh|res|neu|bra|eco|soc|inf|att|cli)' then false
    else true
  end
$$;

create or replace function public.increment_xp(amount integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.xp_rate;
  v_amt integer := greatest(0, least(coalesce(amount, 0), 100));
  v_has_recent_learning boolean := false;
begin
  if v_uid is null or v_amt <= 0 then return 0; end if;

  insert into public.xp_rate (user_id) values (v_uid)
  on conflict (user_id) do nothing;
  select * into v_row from public.xp_rate where user_id = v_uid for update;

  if v_row.day <> current_date then
    v_row.day := current_date;
    v_row.day_xp := 0;
  end if;
  if v_row.minute_start < now() - interval '1 minute' then
    v_row.minute_start := now();
    v_row.minute_xp := 0;
  end if;

  -- Completion/session rewards must follow a real recent learning action.
  if v_amt >= 20 then
    select exists (
      select 1
      from public.activity_events e
      where e.user_id = v_uid
        and e.created_at > now() - interval '5 minutes'
        and (
          (e.kind in ('answer', 'mcq', 'ai_examine', 'flashcard')
            and public.xp_answer_is_meaningful(e.answer, e.kind))
          or (e.kind in ('guide_section', 'view') and coalesce(e.duration_s, 0) >= 20)
        )
    ) into v_has_recent_learning;
    if not v_has_recent_learning then
      return 0;
    end if;
  end if;

  -- Do not let start/end session loops repeatedly claim large rewards.
  if v_amt >= 20 and v_row.last_award_at > now() - interval '30 seconds' then
    update public.xp_rate
       set blocked = blocked + 1,
           minute_start = v_row.minute_start,
           minute_xp = v_row.minute_xp,
           day = v_row.day,
           day_xp = v_row.day_xp
     where user_id = v_uid;
    return 0;
  end if;

  if v_row.day_xp >= 1500 then v_amt := ceil(v_amt / 2.0)::int; end if;
  v_amt := least(v_amt, 150 - v_row.minute_xp, 3000 - v_row.day_xp);
  if v_amt <= 0 then
    update public.xp_rate
       set blocked = blocked + 1,
           minute_start = v_row.minute_start,
           minute_xp = v_row.minute_xp,
           day = v_row.day,
           day_xp = v_row.day_xp
     where user_id = v_uid;
    return 0;
  end if;

  update public.xp_rate
     set minute_start = v_row.minute_start,
         minute_xp = v_row.minute_xp + v_amt,
         day = v_row.day,
         day_xp = v_row.day_xp + v_amt,
         last_award_at = case when v_amt >= 20 then now() else last_award_at end
   where user_id = v_uid;
  perform public.increment_xp_unguarded(v_amt);
  return v_amt;
end
$$;

revoke all on function public.increment_xp(integer) from public, anon;
grant execute on function public.increment_xp(integer) to authenticated;
