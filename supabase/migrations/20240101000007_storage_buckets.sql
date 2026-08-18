-- Create Supabase Storage Buckets for Property Media & Identity Documents

-- 1. Create Public Bucket: property-media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-media',
  'property-media',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Create Private Bucket: kyc-documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'kyc-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'application/pdf'];

-- RLS Policies for property-media bucket
CREATE POLICY "Authenticated users can upload property media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-media' AND (auth.uid() = owner OR owner IS NULL));

CREATE POLICY "Anyone can view property media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'property-media');

CREATE POLICY "Owners can delete their property media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-media' AND auth.uid() = owner);

-- RLS Policies for kyc-documents bucket
CREATE POLICY "Users can upload their own KYC documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'kyc-documents' AND (auth.uid() = owner OR owner IS NULL));

CREATE POLICY "Users and Admins can view KYC documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'kyc-documents' AND (
      auth.uid() = owner OR 
      EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'ADMIN')
    )
  );

CREATE POLICY "Users and Admins can delete KYC documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'kyc-documents' AND (
      auth.uid() = owner OR 
      EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'ADMIN')
    )
  );
