-- Admin Metrics View
-- This view aggregates live platform metrics for the admin dashboard
CREATE OR REPLACE VIEW public.admin_metrics AS
SELECT
  (SELECT count(*) FROM public.profiles WHERE account_status = 'ACTIVE') as active_users_count,
  (SELECT count(*) FROM public.profiles WHERE account_status = 'SUSPENDED') as suspended_users_count,
  (SELECT count(*) FROM public.properties) as properties_count,
  (SELECT count(*) FROM public.listings WHERE status = 'PUBLISHED') as active_listings_count,
  (SELECT count(*) FROM public.applications) as total_applications_count,
  (SELECT count(*) FROM public.reports WHERE status = 'PENDING_REVIEW') as pending_reports_count;

-- Note: We do not need to enable RLS on the view itself if it uses security invoker or 
-- if we just restrict access to it. By default, views run with the privileges of their creator.
-- We will secure this view by restricting SELECT to the ADMIN role.
GRANT SELECT ON public.admin_metrics TO authenticated;

-- Create an RLS-like function to strictly verify admin status for the view
-- Wait, views don't have RLS natively unless they are security invoker views (PG 15+).
-- Instead of a view, let's create a secure RPC function so we can strictly enforce admin roles.

DROP VIEW IF EXISTS public.admin_metrics;

CREATE OR REPLACE FUNCTION public.get_admin_metrics()
RETURNS TABLE (
  active_users_count BIGINT,
  suspended_users_count BIGINT,
  properties_count BIGINT,
  active_listings_count BIGINT,
  total_applications_count BIGINT,
  pending_reports_count BIGINT
) AS $$
BEGIN
  -- Strict Admin check
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Requires ADMIN role';
  END IF;

  RETURN QUERY SELECT
    (SELECT count(*) FROM public.profiles WHERE account_status = 'ACTIVE'),
    (SELECT count(*) FROM public.profiles WHERE account_status = 'SUSPENDED'),
    (SELECT count(*) FROM public.properties),
    (SELECT count(*) FROM public.listings WHERE status = 'PUBLISHED'),
    (SELECT count(*) FROM public.applications),
    (SELECT count(*) FROM public.reports WHERE status = 'PENDING_REVIEW');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Admin Policies for Profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'ADMIN'));

-- Admin Policies for Reports
CREATE POLICY "Admins can view all reports"
  ON public.reports FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "Admins can update reports"
  ON public.reports FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'ADMIN'));

-- Admin Policies for Listings
CREATE POLICY "Admins can update listings"
  ON public.listings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'ADMIN'));
