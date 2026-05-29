
-- Grant access to referrals table for share-card attribution
GRANT SELECT, INSERT, UPDATE ON public.referrals TO anon;
GRANT SELECT, INSERT, UPDATE ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;

-- Anyone can record a referral click (no PII exposed)
CREATE POLICY "Anyone can insert referrals"
ON public.referrals
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow attaching a referred_user_id only to rows that don't yet have one
CREATE POLICY "Anyone can attach signup to referral"
ON public.referrals
FOR UPDATE
TO anon, authenticated
USING (referred_user_id IS NULL)
WITH CHECK (true);

-- Referrers can view referrals where they are the referrer (basic visibility for future dashboards)
CREATE POLICY "Referrers can view own referrals"
ON public.referrals
FOR SELECT
TO authenticated
USING (referrer_user_id = auth.uid());
