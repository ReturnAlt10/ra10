-- Enable profile pictures for leaderboard/avatar display.
-- Run this in the Supabase SQL editor.

alter table public.profiles
  add column if not exists profile_pic_url text;

comment on column public.profiles.profile_pic_url is
  'Optional PNG image URL shown as the user avatar in leaderboard and account UI.';

-- RLS note:
-- Existing profile update policy should already allow users to update their own row.
-- If not, ensure your policy allows authenticated users to update profile_pic_url for their own id.
