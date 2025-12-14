-- Manually confirm the admin user email and create admin profile
-- This script bypasses email confirmation for development purposes

-- First, find and confirm the user in auth.users
UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'leeviennafs@gmail.com'
  AND email_confirmed_at IS NULL;

-- Then create or update the admin profile
INSERT INTO public.admin_profiles (user_id, email, full_name, role, is_super_admin)
SELECT 
  id,
  email,
  'Leevienna FS Admin',
  'super_admin',
  true
FROM auth.users
WHERE email = 'leeviennafs@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET
  role = 'super_admin',
  is_super_admin = true,
  updated_at = NOW();

-- Verify the changes
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.confirmed_at,
  ap.role,
  ap.is_super_admin
FROM auth.users u
LEFT JOIN public.admin_profiles ap ON ap.user_id = u.id
WHERE u.email = 'leeviennafs@gmail.com';
