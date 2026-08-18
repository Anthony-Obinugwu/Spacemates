-- Create properties table
CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'Nigeria',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  verification_status TEXT DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED', 'EXPIRED')),
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED', 'ARCHIVED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create property_parties table for roles (OWNER, AGENT, MANAGER)
CREATE TABLE public.property_parties (
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL CHECK (relationship IN ('OWNER', 'AGENT', 'MANAGER')),
  authorization_status TEXT DEFAULT 'PENDING' CHECK (authorization_status IN ('PENDING', 'AUTHORIZED', 'REVOKED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (property_id, user_id, relationship)
);

-- Create property_units table
CREATE TABLE public.property_units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  unit_type TEXT NOT NULL,
  name TEXT NOT NULL,
  occupancy INTEGER DEFAULT 1,
  availability TEXT DEFAULT 'AVAILABLE' CHECK (availability IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE')),
  private_bathroom BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false
);

-- Create listings table
CREATE TABLE public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.property_units(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('ROOM_AVAILABLE', 'ROOMMATE_WANTED', 'ENTIRE_PROPERTY', 'CO_RENTING')),
  title TEXT NOT NULL,
  description TEXT,
  availability_status TEXT DEFAULT 'AVAILABLE',
  available_from DATE NOT NULL,
  minimum_lease_months INTEGER DEFAULT 12,
  maximum_occupants INTEGER DEFAULT 1,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'PAUSED', 'REJECTED', 'EXPIRED', 'CLOSED')),
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create listing_expenses table
CREATE TABLE public.listing_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  expense_type TEXT NOT NULL CHECK (expense_type IN ('RENT', 'SERVICE_CHARGE', 'SECURITY', 'INTERNET', 'LEGAL_FEE', 'AGENCY_FEE', 'CAUTION_FEE', 'OTHER')),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN',
  frequency TEXT NOT NULL CHECK (frequency IN ('YEARLY', 'MONTHLY', 'WEEKLY', 'ONE_TIME')),
  is_required BOOLEAN DEFAULT true,
  description TEXT
);

-- Create Public Properties View (Address Privacy)
CREATE OR REPLACE VIEW public.public_properties WITH (security_invoker = true) AS
SELECT 
  id,
  title,
  description,
  property_type,
  city,
  state,
  country,
  verification_status,
  status,
  created_at,
  updated_at
FROM public.properties
WHERE status IN ('ACTIVE', 'VERIFIED');

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_expenses ENABLE ROW LEVEL SECURITY;

-- Properties Policies (Only Parties can access the raw table)
CREATE POLICY "Property parties can view their properties."
  ON public.properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.property_parties pp 
      WHERE pp.property_id = id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Property parties can insert properties."
  ON public.properties FOR INSERT
  WITH CHECK (true); -- Trigger will assign the user as OWNER in property_parties

-- Function to automatically assign the creator as OWNER
CREATE OR REPLACE FUNCTION public.handle_new_property()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.property_parties (property_id, user_id, relationship, authorization_status)
  VALUES (new.id, auth.uid(), 'OWNER', 'AUTHORIZED');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_property_created
  AFTER INSERT ON public.properties
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_property();

CREATE POLICY "Property parties can update their properties."
  ON public.properties FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.property_parties pp 
      WHERE pp.property_id = id AND pp.user_id = auth.uid() AND pp.authorization_status = 'AUTHORIZED'
    )
  );

-- Property Parties Policies
CREATE POLICY "Property parties can view related parties."
  ON public.property_parties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.property_parties pp 
      WHERE pp.property_id = property_id AND pp.user_id = auth.uid()
    )
  );

-- Property Units Policies
CREATE POLICY "Property parties can view related units."
  ON public.property_units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.property_parties pp 
      WHERE pp.property_id = property_id AND pp.user_id = auth.uid()
    )
  );
CREATE POLICY "Property parties can manage their units."
  ON public.property_units FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.property_parties pp 
      WHERE pp.property_id = property_id AND pp.user_id = auth.uid() AND pp.authorization_status = 'AUTHORIZED'
    )
  );

-- Listings Policies
CREATE POLICY "Anyone can view published listings."
  ON public.listings FOR SELECT
  USING ( status = 'PUBLISHED' );

CREATE POLICY "Property parties can view all their listings."
  ON public.listings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.property_parties pp 
      WHERE pp.property_id = listings.property_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Property parties can manage their listings."
  ON public.listings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.property_parties pp 
      WHERE pp.property_id = listings.property_id AND pp.user_id = auth.uid() AND pp.authorization_status = 'AUTHORIZED'
    )
  );

-- Listing Expenses Policies
CREATE POLICY "Anyone can view expenses for published listings."
  ON public.listing_expenses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l 
      WHERE l.id = listing_id AND l.status = 'PUBLISHED'
    )
  );

CREATE POLICY "Property parties can manage their listing expenses."
  ON public.listing_expenses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      JOIN public.property_parties pp ON l.property_id = pp.property_id
      WHERE l.id = listing_id AND pp.user_id = auth.uid() AND pp.authorization_status = 'AUTHORIZED'
    )
  );
