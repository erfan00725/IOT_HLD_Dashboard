begin;

-- 1. Ensure public."user" is the canonical application-user table.
-- The ID must be the same UUID created by Supabase Auth.
alter table public."user"
  drop constraint if exists user_id_fkey;

alter table public."user"
  add constraint user_id_fkey
  foreign key (id)
  references auth.users (id)
  on delete cascade;


-- 2. Copy any profile-only data before redirecting foreign keys.
-- Your current profiles table only has display_name, created_at, and updated_at.
-- Preserve a profile display name as full_name only when user.full_name is empty.
update public."user" as app_user
set
  full_name = coalesce(app_user.full_name, p.display_name),
  created_at = least(app_user.created_at, p.created_at),
  updated_at = greatest(app_user.updated_at, p.updated_at)
from public.profiles as p
where p.id = app_user.id;


-- Optional: cover profiles that exist but have no matching public."user" row.
-- The current public."user" schema supports these nullable fields.
insert into public."user" (
  id,
  full_name,
  created_at,
  updated_at
)
select
  p.id,
  p.display_name,
  p.created_at,
  p.updated_at
from public.profiles as p
where not exists (
  select 1
  from public."user" as app_user
  where app_user.id = p.id
);


-- 3. Redirect dependent foreign keys from profiles to public."user".
alter table public.homes
  drop constraint if exists homes_owner_id_fkey;

alter table public.homes
  add constraint homes_owner_id_fkey
  foreign key (owner_id)
  references public."user" (id)
  on delete cascade;


alter table public.leave_sessions
  drop constraint if exists leave_sessions_user_id_fkey;

alter table public.leave_sessions
  add constraint leave_sessions_user_id_fkey
  foreign key (user_id)
  references public."user" (id)
  on delete cascade;


-- 4. Drop profiles only after all dependent foreign keys are redirected.
drop table if exists public.profiles;

commit;

begin;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_username text;
  raw_full_name text;
  raw_avatar_url text;
begin
  raw_username := nullif(trim(new.raw_user_meta_data ->> 'username'), '');
  raw_full_name := nullif(trim(
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    )
  ), '');
  raw_avatar_url := nullif(trim(new.raw_user_meta_data ->> 'avatar_url'), '');

  insert into public."user" (
    id,
    username,
    full_name,
    email,
    avatar_url
  )
  values (
    new.id,
    raw_username,
    raw_full_name,
    new.email,
    raw_avatar_url
  )
  on conflict (id) do update
  set
    email = excluded.email,
    username = coalesce(public."user".username, excluded.username),
    full_name = coalesce(public."user".full_name, excluded.full_name),
    avatar_url = coalesce(public."user".avatar_url, excluded.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();

commit;

begin;

drop policy if exists "Users can view their own account" on public."user";
drop policy if exists "Users can update their own account" on public."user";

create policy "Users can view their own account"
on public."user"
for select
to authenticated
using (id = auth.uid());

create policy "Users can update their own account"
on public."user"
for update
to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = (
    select current_user_row.role
    from public."user" as current_user_row
    where current_user_row.id = auth.uid()
  )
  and is_active = (
    select current_user_row.is_active
    from public."user" as current_user_row
    where current_user_row.id = auth.uid()
  )
);

commit;