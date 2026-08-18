-- Create applications table
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  primary_applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'ESCROW_FUNDED', 'COMPLETED', 'FAILED')),
  escrow_amount NUMERIC,
  currency TEXT DEFAULT 'NGN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create application_members table (Roommate groups)
CREATE TABLE public.application_members (
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'CO_APPLICANT' CHECK (role IN ('PRIMARY', 'CO_APPLICANT')),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'FUNDED', 'FAILED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (application_id, user_id)
);

-- Matches table (cached compatibility scores)
CREATE TABLE public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  is_hard_filter_pass BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, listing_id)
);

-- Trigger to fail entire group application if one member fails
CREATE OR REPLACE FUNCTION public.handle_application_member_failure()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'FAILED' THEN
    -- Fail the parent application
    UPDATE public.applications 
    SET status = 'FAILED', updated_at = NOW()
    WHERE id = NEW.application_id AND status NOT IN ('COMPLETED', 'FAILED');
    
    -- Cascade fail to all other members
    UPDATE public.application_members
    SET status = 'FAILED'
    WHERE application_id = NEW.application_id AND user_id != NEW.user_id AND status NOT IN ('FAILED');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_member_failed
  AFTER UPDATE OF status ON public.application_members
  FOR EACH ROW
  WHEN (NEW.status = 'FAILED')
  EXECUTE PROCEDURE public.handle_application_member_failure();

-- RPC for deterministic compatibility scoring
CREATE OR REPLACE FUNCTION public.calculate_compatibility_score(
  p_user_id UUID,
  p_listing_id UUID
) RETURNS TABLE (score INTEGER, is_hard_filter_pass BOOLEAN) AS $$
DECLARE
  v_score INTEGER := 100;
  v_dealbreaker_failed BOOLEAN := false;
BEGIN
  -- Deterministic mock for MVP using UUID string comparison:
  -- If the first character matches, it's a high score.
  -- If it starts with 'a', 'b', 'c', simulate a hard dealbreaker fail.
  IF left(p_user_id::text, 1) = left(p_listing_id::text, 1) THEN
    v_score := 95;
    v_dealbreaker_failed := false;
  ELSIF left(p_user_id::text, 1) IN ('a', 'b', 'c') THEN
    v_score := 0;
    v_dealbreaker_failed := true; -- Hard filter failed
  ELSE
    v_score := 75;
    v_dealbreaker_failed := false;
  END IF;

  RETURN QUERY SELECT v_score, NOT v_dealbreaker_failed;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Applications Policies
CREATE POLICY "Applicants can view their applications"
  ON public.applications FOR SELECT
  USING (
    primary_applicant_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.application_members am WHERE am.application_id = id AND am.user_id = auth.uid())
  );

CREATE POLICY "Property parties can view applications for their listings"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      JOIN public.property_parties pp ON l.property_id = pp.property_id
      WHERE l.id = listing_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (primary_applicant_id = auth.uid());

CREATE POLICY "Property parties can update application status"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      JOIN public.property_parties pp ON l.property_id = pp.property_id
      WHERE l.id = listing_id AND pp.user_id = auth.uid() AND pp.authorization_status = 'AUTHORIZED'
    )
  );

-- Application Members Policies
CREATE POLICY "Members can view their group"
  ON public.application_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.application_members am WHERE am.application_id = application_id AND am.user_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.listings l ON a.listing_id = l.id
      JOIN public.property_parties pp ON l.property_id = pp.property_id
      WHERE a.id = application_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Primary applicant can insert members"
  ON public.application_members FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id AND a.primary_applicant_id = auth.uid())
  );

CREATE POLICY "Members can update their own status"
  ON public.application_members FOR UPDATE
  USING (user_id = auth.uid());
