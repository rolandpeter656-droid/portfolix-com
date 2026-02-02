-- Add RLS policies for profiles table (currently has RLS enabled but no policies)
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Update referrals table to require authentication for inserts
-- First drop the existing permissive policy
DROP POLICY IF EXISTS "Anyone can insert referrals" ON public.referrals;

-- Create a more restrictive policy that requires authentication
CREATE POLICY "Authenticated users can insert referrals"
ON public.referrals
FOR INSERT
TO authenticated
WITH CHECK (
  -- User can only create referrals using referral codes that exist
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.referral_code = referrer_code
  )
);