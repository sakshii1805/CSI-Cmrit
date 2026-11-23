-- Run once in Supabase -> SQL Editor.

-- 1. The app's "pin to top" feature needs these columns (they did not exist).
alter table public.announcements add column if not exists is_pinned boolean not null default false;
alter table public.events        add column if not exists is_pinned boolean not null default false;
alter table public.highlights    add column if not exists is_pinned boolean not null default false;

-- 2. This policy let anyone read drafts/unpublished announcements. Public reads
--    are already covered by "Public can view published announcements".
drop policy if exists "Public can view announcements" on public.announcements;

-- 3. is_admin() only checks the admins.id column (no user_id column exists).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;
