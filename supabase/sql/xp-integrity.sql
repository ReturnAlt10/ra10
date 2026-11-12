-- RA10 — XP integrity guard.
-- Run after edu-platform.sql, then run xp-v3.sql. Safe to re-run.

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
    when length(btrim(p_answer)) >= 6
         and btrim(p_answer) ~* '^[^aeiou]+$' then false
    when btrim(p_answer) ~* '[bcdfghjklmnpqrstvwxz]{5,}' then false
    when p_kind = 'answer' and length(btrim(p_answer)) >= 10
         and btrim(p_answer) !~ '\s'
         and btrim(p_answer) !~* '(the|and|ing|ion|ate|ent|ers|ous|ive|ity|ism|psy|mem|con|beh|res|neu|bra|eco|soc|inf|att|cli)' then false
    else true
  end
$$;

-- increment_xp is defined in xp-v3.sql (XP the server decides). It was removed from
-- this file so re-running it can never bring back the old client-trusted version.

