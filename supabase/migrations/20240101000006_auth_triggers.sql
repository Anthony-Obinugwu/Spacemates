-- PostgreSQL Trigger to Automatically Seed Profiles & Roles on Supabase Auth Sign Up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Create matching row in public.profiles
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    account_status,
    profile_completion,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'PENDING',
    0,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. Create default USER role in public.user_roles
  INSERT INTO public.user_roles (
    user_id,
    role,
    created_at
  )
  VALUES (
    NEW.id,
    'USER',
    NOW()
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
