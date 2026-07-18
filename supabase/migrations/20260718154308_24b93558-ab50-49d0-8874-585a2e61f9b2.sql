
-- 1. Referrals: tighten UPDATE + INSERT
DROP POLICY IF EXISTS "Anyone can attach signup to referral" ON public.referrals;
CREATE POLICY "Users attach own signup to referral"
  ON public.referrals FOR UPDATE
  TO authenticated
  USING (referred_user_id IS NULL)
  WITH CHECK (referred_user_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can insert referrals" ON public.referrals;
CREATE POLICY "Anyone can insert referrals"
  ON public.referrals FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    referrer_user_id IS NOT NULL
    AND referred_session_id IS NOT NULL
    AND referred_user_id IS NULL
  );

-- 2. Analytics events: scope insert
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;
CREATE POLICY "Insert own analytics events"
  ON public.analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (user_id IS NULL AND session_id IS NOT NULL)
    OR user_id = auth.uid()
  );

-- 3. Mobile waitlist: require valid email
DROP POLICY IF EXISTS "Anyone can join the mobile waitlist" ON public.mobile_waitlist;
CREATE POLICY "Anyone can join the mobile waitlist"
  ON public.mobile_waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- 4. Rebalance alerts: service role only
DROP POLICY IF EXISTS "Service role inserts alerts" ON public.rebalance_alerts;
CREATE POLICY "Service role inserts alerts"
  ON public.rebalance_alerts FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 5. Remove users from realtime (sensitive PII)
ALTER PUBLICATION supabase_realtime DROP TABLE public.users;

-- 6. Pin search_path on the one function missing it
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$function$;

-- 7. Restrict SECURITY DEFINER function EXECUTE
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_portfolio_count(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_email_verification_expired(uuid, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_email_tokens() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_auth_config(varchar) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_generate_portfolio(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_generate_portfolio(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.increment_portfolio_count(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_email_verification_expired(uuid, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_email_tokens() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_auth_config(varchar) TO service_role;

-- 8. Storage policies on the "Public" bucket
DROP POLICY IF EXISTS "Public bucket read" ON storage.objects;
DROP POLICY IF EXISTS "Public bucket owner upload" ON storage.objects;
DROP POLICY IF EXISTS "Public bucket owner update" ON storage.objects;
DROP POLICY IF EXISTS "Public bucket owner delete" ON storage.objects;

CREATE POLICY "Public bucket read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'Public');

CREATE POLICY "Public bucket owner upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'Public'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public bucket owner update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'Public'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'Public'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public bucket owner delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'Public'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
