-- Manual admin setup for leeviennafs@gmail.com
-- This creates an admin profile for the user regardless of email confirmation status

-- First, get the user ID for the email
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = 'leeviennafs@gmail.com';
  
  -- If user exists, create or update admin profile
  IF user_uuid IS NOT NULL THEN
    INSERT INTO public.admin_profiles (id, email, full_name, created_at, updated_at)
    VALUES (
      user_uuid,
      'leeviennafs@gmail.com',
      'Leevienna Admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) 
    DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      updated_at = NOW();
    
    RAISE NOTICE 'Admin profile created/updated for user: %', user_uuid;
  ELSE
    RAISE NOTICE 'No user found with email: leeviennafs@gmail.com';
  END IF;
END $$;
