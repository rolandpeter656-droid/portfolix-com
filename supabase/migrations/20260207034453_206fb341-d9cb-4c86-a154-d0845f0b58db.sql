
-- =============================================
-- REFERRAL SYSTEM COMPLETE CLEANUP MIGRATION
-- =============================================

-- 1. Drop triggers on auth.users that reference referral functions
DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;
DROP TRIGGER IF EXISTS on_user_referral_rewards ON public.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop referral-related database functions
DROP FUNCTION IF EXISTS public.handle_new_user_referral() CASCADE;
DROP FUNCTION IF EXISTS public.handle_referral_rewards() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_with_referral() CASCADE;
DROP FUNCTION IF EXISTS public.generate_unique_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.redeem_credits(uuid, integer) CASCADE;

-- 3. Drop the referrals table (0 records, safe to drop)
DROP TABLE IF EXISTS public.referrals CASCADE;

-- 4. Drop the credit_transactions table (only signup bonus records, feature being removed)
DROP TABLE IF EXISTS public.credit_transactions CASCADE;

-- 5. Remove referral and credit columns from users table
ALTER TABLE public.users 
  DROP COLUMN IF EXISTS referral_code,
  DROP COLUMN IF EXISTS referred_by,
  DROP COLUMN IF EXISTS referral_count,
  DROP COLUMN IF EXISTS credit_balance;
