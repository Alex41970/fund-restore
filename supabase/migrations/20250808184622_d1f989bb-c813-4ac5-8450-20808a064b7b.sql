-- 1) Enums
create type if not exists public.app_role as enum ('admin','user');
create type if not exists public.case_status as enum ('new','in_review','in_progress','on_hold','recovered','closed','rejected');

-- 2) Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 3) User roles table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- 4) Cases table
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  fraud_type text,
  amount numeric,
  currency text,
  description text,
  contact_email text,
  occurred_on date,
  status public.case_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cases enable row level security;

-- 5) Case updates table
create table if not exists public.case_updates (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.case_updates enable row level security;

-- 6) Attachments table
create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  file_path text not null,
  file_name text,
  file_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

alter table public.attachments enable row level security;

-- 7) Timestamp trigger function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach triggers
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.update_updated_at_column();

create trigger trg_cases_updated_at before update on public.cases
for each row execute function public.update_updated_at_column();

-- 8) RLS Policies
-- Profiles: users can read/update their own
create policy if not exists "Users can view own profile" on public.profiles
for select to authenticated using (auth.uid() = id);

create policy if not exists "Users can update own profile" on public.profiles
for update to authenticated using (auth.uid() = id);

-- Admins can select all profiles (uses has_role function defined later)
create policy if not exists "Admins can select all profiles" on public.profiles
for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- user_roles: users can view their own roles; admins can view all
create policy if not exists "Users can view own roles" on public.user_roles
for select to authenticated using (user_id = auth.uid());

create policy if not exists "Admins can view all roles" on public.user_roles
for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- cases: owners can read/insert; admins full access
create policy if not exists "Users can insert own cases" on public.cases
for insert to authenticated with check (user_id = auth.uid());

create policy if not exists "Users can view own cases" on public.cases
for select to authenticated using (user_id = auth.uid());

create policy if not exists "Admins can view all cases" on public.cases
for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update cases" on public.cases
for update to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete cases" on public.cases
for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- case_updates: owners and admins can view; owners can insert on own case; admins can insert
create policy if not exists "Owners can view updates" on public.case_updates
for select to authenticated using (
  exists(select 1 from public.cases c where c.id = case_updates.case_id and (c.user_id = auth.uid() or public.has_role(auth.uid(),'admin')))
);

create policy if not exists "Owners can insert updates" on public.case_updates
for insert to authenticated with check (
  exists(select 1 from public.cases c where c.id = case_id and c.user_id = auth.uid())
);

create policy if not exists "Admins can insert updates" on public.case_updates
for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));

-- attachments: owners and admins can view; owners can insert for own case; admins can insert/delete
create policy if not exists "Owners can view attachments" on public.attachments
for select to authenticated using (
  exists(select 1 from public.cases c where c.id = attachments.case_id and (c.user_id = auth.uid() or public.has_role(auth.uid(),'admin')))
);

create policy if not exists "Owners can insert attachments" on public.attachments
for insert to authenticated with check (
  exists(select 1 from public.cases c where c.id = case_id and c.user_id = auth.uid())
);

create policy if not exists "Admins can insert attachments" on public.attachments
for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete attachments" on public.attachments
for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- 9) Role helper function (SECURITY DEFINER)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;

-- 10) Auto-profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 11) Make first user admin
create or replace function public.make_first_user_admin()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_make_admin on auth.users;
create trigger on_auth_user_created_make_admin
  after insert on auth.users
  for each row execute procedure public.make_first_user_admin();

-- 12) Storage bucket and policies
insert into storage.buckets (id, name, public)
values ('case-attachments','case-attachments', false)
on conflict (id) do nothing;

-- Storage policies
-- Allow owners to read their files or admins to read all
create policy if not exists "Owners read their files" on storage.objects
for select to authenticated using (
  bucket_id = 'case-attachments' and (
    (auth.uid()::text = (storage.foldername(name))[1]) or public.has_role(auth.uid(),'admin')
  )
);

-- Allow owners to upload to their own folder path: {uid}/caseId/filename
create policy if not exists "Owners upload to own folder" on storage.objects
for insert to authenticated with check (
  bucket_id = 'case-attachments' and auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow owners to delete their own files; admins can delete any in bucket
create policy if not exists "Owners delete own files" on storage.objects
for delete to authenticated using (
  bucket_id = 'case-attachments' and (
    auth.uid()::text = (storage.foldername(name))[1] or public.has_role(auth.uid(),'admin')
  )
);
