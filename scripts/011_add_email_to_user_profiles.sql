-- Add email column to user_profiles if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
    and table_name = 'user_profiles'
    and column_name = 'email'
  ) then
    alter table public.user_profiles add column email text;
  end if;
end $$;

-- Create function to sync email from auth.users to user_profiles
create or replace function sync_user_email()
returns trigger as $$
begin
  -- Update user_profiles with email from auth.users
  update public.user_profiles
  set email = new.email
  where id = new.id;
  
  -- If profile doesn't exist, create it
  insert into public.user_profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do update
  set email = new.email;
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to sync email on user creation/update
drop trigger if exists sync_user_email_trigger on auth.users;
create trigger sync_user_email_trigger
  after insert or update of email on auth.users
  for each row
  execute function sync_user_email();

-- Backfill existing users
update public.user_profiles up
set email = au.email
from auth.users au
where up.id = au.id and up.email is null;

