-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  date_of_birth DATE,
  profile_photo TEXT,
  bio TEXT,
  occupation TEXT,
  education TEXT,
  workplace TEXT,
  city TEXT,
  gender TEXT,
  account_status TEXT DEFAULT 'PENDING' CHECK (account_status IN ('PENDING', 'ACTIVE', 'RESTRICTED', 'SUSPENDED', 'BANNED', 'DELETED')),
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roles table and user_roles mapping
CREATE TABLE public.roles (
  id TEXT PRIMARY KEY,
  description TEXT
);

INSERT INTO public.roles (id, description) VALUES
  ('ROOM_SEEKER', 'User looking for a room'),
  ('ROOMMATE', 'User offering a room in a shared property'),
  ('PROPERTY_OWNER', 'Owner of a property'),
  ('PROPERTY_AGENT', 'Agent managing a property'),
  ('PROPERTY_MANAGER', 'Manager of a property');

CREATE TABLE public.user_roles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role)
);

-- Create identity verifications table
CREATE TABLE public.identity_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  verification_type TEXT NOT NULL,
  status TEXT DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'PENDING', 'PROCESSING', 'VERIFIED', 'FAILED', 'EXPIRED')),
  provider_reference TEXT,
  verified_at TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

-- User Roles Policies
CREATE POLICY "User roles are viewable by everyone."
  ON public.user_roles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own roles."
  ON public.user_roles FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own roles."
  ON public.user_roles FOR DELETE
  USING ( auth.uid() = user_id );

-- Identity Verifications Policies
-- Only the user can see their verification status and details
CREATE POLICY "Users can view their own identity verifications."
  ON public.identity_verifications FOR SELECT
  USING ( auth.uid() = user_id );

-- Create trigger to automatically create a profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
