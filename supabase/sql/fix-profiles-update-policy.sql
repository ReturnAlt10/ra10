-- Ensure authenticated users can update only their own profile row.
alter policy "Users can update own profile"
on public.profiles
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
