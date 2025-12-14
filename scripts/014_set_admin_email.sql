-- Set leeviennafs@gmail.com as admin
-- This ensures the admin email is always set as admin

-- First, find the user by email from auth.users
-- Then update their profile to be admin

-- Method 1: If you know the user ID, update directly
-- UPDATE user_profiles SET is_admin = true WHERE id = 'user-uuid-here';

-- Method 2: Update by email (requires joining with auth.users)
-- Note: This might not work directly due to RLS, so you may need to run this as a superuser
-- or use the Supabase dashboard

-- For Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Find the user with email: leeviennafs@gmail.com
-- 3. Copy their User UID
-- 4. Run this query with the UID:

-- UPDATE user_profiles 
-- SET is_admin = true 
-- WHERE id = 'paste-user-uid-here';

-- Or use this function to set admin by email:
create or replace function set_admin_by_email(user_email text)
returns void
language plpgsql
security definer
as $$
declare
  user_uuid uuid;
begin
  -- Get user ID from auth.users
  select id into user_uuid
  from auth.users
  where email = user_email
  limit 1;
  
  if user_uuid is not null then
    -- Update or insert admin status
    insert into user_profiles (id, email, is_admin)
    values (user_uuid, user_email, true)
    on conflict (id) do update
    set is_admin = true, email = user_email;
  end if;
end;
$$;

-- Grant execute permission
grant execute on function set_admin_by_email(text) to authenticated;

-- Set the admin email
select set_admin_by_email('leeviennafs@gmail.com');

