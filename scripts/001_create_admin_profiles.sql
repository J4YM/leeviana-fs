-- Create admin profiles table
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.admin_profiles enable row level security;

-- Create policies
create policy "Admin profiles are viewable by admins only"
  on public.admin_profiles for select
  using (auth.uid() = id);

create policy "Admin profiles can be updated by admin themselves"
  on public.admin_profiles for update
  using (auth.uid() = id);

-- Create trigger for auto-updating updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_admin_profile_update
  before update on public.admin_profiles
  for each row
  execute function public.handle_updated_at();

-- Auto-create admin profile on signup
create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_admin_user_created on auth.users;

create trigger on_auth_admin_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_admin_user();
