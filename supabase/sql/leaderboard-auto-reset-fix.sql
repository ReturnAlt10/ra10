BEGIN;

-- 1. Create robust automatic settlement function callable by cron or client
CREATE OR REPLACE FUNCTION public.settle_leaderboard_week(p_week_start date DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_week_start date := coalesce(
    p_week_start,
    ((now() AT TIME ZONE 'Europe/London')::date - extract(dow from (now() AT TIME ZONE 'Europe/London'))::integer - 7)
  );
  v_count integer := 0;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('ra10-leaderboard-settlement'));

  IF EXISTS (SELECT 1 FROM public.leaderboard_weekly_results WHERE week_start = v_week_start) THEN
    RETURN json_build_object('ok', true, 'settled', false, 'week_start', v_week_start, 'reason', 'already_settled');
  END IF;

  PERFORM set_config('app.skip_profile_priv_check', 'true', true);

  WITH ranked AS (
    SELECT p.id,
           row_number() OVER (ORDER BY coalesce(p.xp_this_week, 0) DESC, coalesce(p.xp_total, 0) DESC, p.id)::integer AS rank
      FROM public.profiles p
     WHERE coalesce(p.xp_this_week, 0) > 0
  ),
  podium AS (
    SELECT id, rank,
           CASE rank WHEN 1 THEN 30 WHEN 2 THEN 20 WHEN 3 THEN 10 ELSE 0 END AS credits_awarded,
           CASE rank WHEN 1 THEN '🥇 1st' WHEN 2 THEN '🥈 2nd' WHEN 3 THEN '🥉 3rd' END AS badge
      FROM ranked WHERE rank <= 3
  ),
  inserted AS (
    INSERT INTO public.leaderboard_weekly_results (week_start, profile_id, rank, credits_awarded, badge, settled_at)
    SELECT v_week_start, id, rank, credits_awarded, badge, now()
      FROM podium
    ON CONFLICT (week_start, profile_id) DO NOTHING
    RETURNING profile_id, rank, credits_awarded, badge
  )
  UPDATE public.profiles p
     SET credits = coalesce(p.credits, 0) + i.credits_awarded,
         leaderboard_badge = i.badge || ' · Last week',
         leaderboard_badge_week = v_week_start,
         leaderboard_last_rank = i.rank,
         leaderboard_award_credits = i.credits_awarded,
         xp_week_reset_at = now()
    FROM inserted i
   WHERE p.id = i.profile_id;

  GET DIAGNOSTICS v_count = row_count;

  -- Reset xp_this_week for everyone
  UPDATE public.profiles
     SET xp_this_week = 0,
         xp_week_reset_at = now()
   WHERE coalesce(xp_this_week, 0) > 0;

  PERFORM set_config('app.skip_profile_priv_check', '', true);

  RETURN json_build_object('ok', true, 'settled', true, 'week_start', v_week_start, 'winners', v_count);
END;
$$;
REVOKE ALL ON FUNCTION public.settle_leaderboard_week(date) FROM public;
GRANT EXECUTE ON FUNCTION public.settle_leaderboard_week(date) TO anon, authenticated, service_role;

-- 2. Make settle_previous_leaderboard() alias settle_leaderboard_week() with credit rewards
CREATE OR REPLACE FUNCTION public.settle_previous_leaderboard()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.settle_leaderboard_week(NULL);
END;
$$;
REVOKE ALL ON FUNCTION public.settle_previous_leaderboard() FROM public;
GRANT EXECUTE ON FUNCTION public.settle_previous_leaderboard() TO anon, authenticated, service_role;

-- 3. Replace buggy reset_weekly_xp() with safe settle_leaderboard_week() call
CREATE OR REPLACE FUNCTION public.reset_weekly_xp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.settle_leaderboard_week(NULL);
END;
$$;
REVOKE ALL ON FUNCTION public.reset_weekly_xp() FROM public;
GRANT EXECUTE ON FUNCTION public.reset_weekly_xp() TO anon, authenticated, service_role;

-- 4. Clean up / update pg_cron job so it uses the London Sunday midnight schedule correctly
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-xp-reset') THEN
    PERFORM cron.unschedule('weekly-xp-reset');
  END IF;
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'ra10-weekly-leaderboard-rollover') THEN
    PERFORM cron.unschedule('ra10-weekly-leaderboard-rollover');
  END IF;

  -- Schedule at 00:00 every Sunday UTC
  PERFORM cron.schedule('ra10-weekly-leaderboard-rollover', '0 0 * * 0', 'SELECT public.settle_leaderboard_week(NULL)');
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron update skipped: %', sqlerrm;
END $$;

COMMIT;
