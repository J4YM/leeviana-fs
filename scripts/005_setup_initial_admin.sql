-- Setup initial admin user
-- This script should be run AFTER you sign up with email: leeviennafs@gmail.com

-- Function to setup admin user by email
create or replace function public.setup_admin_by_email(admin_email text)
returns void
language plpgsql
security definer
as $$
declare
  user_id uuid;
begin
  -- Get the user ID for the email
  select id into user_id
  from auth.users
  where email = admin_email;

  -- Insert or update admin profile
  if user_id is not null then
    insert into public.admin_profiles (id, email, full_name)
    values (user_id, admin_email, 'LeeViennaFS Admin')
    on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        updated_at = now();
    
    raise notice 'Admin profile created/updated for: %', admin_email;
  else
    raise exception 'User with email % not found. Please sign up first.', admin_email;
  end if;
end;
$$;

-- Execute the setup for the admin email
select public.setup_admin_by_email('leeviennafs@gmail.com');
