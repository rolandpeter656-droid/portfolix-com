
-- First, check what triggers use update_institutional_updated_at and recreate a proper one for user_portfolios
-- Drop the trigger on user_portfolios that depends on the institutional function
DROP TRIGGER IF EXISTS update_user_portfolios_updated_at ON public.user_portfolios;

-- Create a proper generic updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate the trigger on user_portfolios using the new generic function
CREATE TRIGGER update_user_portfolios_updated_at
BEFORE UPDATE ON public.user_portfolios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Now drop institutional and advisor-related tables
DROP TABLE IF EXISTS public.portfolio_performance_history CASCADE;
DROP TABLE IF EXISTS public.institutional_api_keys CASCADE;
DROP TABLE IF EXISTS public.institutional_portfolios CASCADE;
DROP TABLE IF EXISTS public.institutional_subscriptions CASCADE;
DROP TABLE IF EXISTS public.advisor_subscriptions CASCADE;
DROP TABLE IF EXISTS public.white_label_partners CASCADE;
DROP TABLE IF EXISTS public.api_waitlist CASCADE;

-- Drop institutional-related functions (now safe)
DROP FUNCTION IF EXISTS public.update_institutional_updated_at();
DROP FUNCTION IF EXISTS public.can_generate_institutional_portfolio(uuid);
DROP FUNCTION IF EXISTS public.has_active_advisor_subscription(uuid);
DROP FUNCTION IF EXISTS public.generate_api_key();
DROP FUNCTION IF EXISTS public.hash_api_key(text);
DROP FUNCTION IF EXISTS public.encrypt_api_secret(text, text);
DROP FUNCTION IF EXISTS public.decrypt_api_secret(bytea, text);
DROP FUNCTION IF EXISTS public.validate_api_key(text);
DROP FUNCTION IF EXISTS public.create_institutional_api_key(uuid, text, jsonb, integer, timestamptz, text);

-- Drop institutional-related enums
DROP TYPE IF EXISTS public.institutional_plan_tier CASCADE;
DROP TYPE IF EXISTS public.partner_tier CASCADE;
DROP TYPE IF EXISTS public.subscription_status CASCADE;
DROP TYPE IF EXISTS public.currency_type CASCADE;
DROP TYPE IF EXISTS public.advisor_subscription_status CASCADE;
