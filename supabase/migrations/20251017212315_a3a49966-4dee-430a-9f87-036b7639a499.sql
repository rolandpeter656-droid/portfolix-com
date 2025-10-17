-- Add portfolio count tracking to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS portfolio_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON public.users(subscription_plan);

-- Create a function to increment portfolio count
CREATE OR REPLACE FUNCTION public.increment_portfolio_count(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET portfolio_count = COALESCE(portfolio_count, 0) + 1
  WHERE user_id = user_uuid;
END;
$$;

-- Create a function to check if user can generate portfolio
CREATE OR REPLACE FUNCTION public.can_generate_portfolio(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_plan TEXT;
  user_count INTEGER;
BEGIN
  SELECT subscription_plan, COALESCE(portfolio_count, 0)
  INTO user_plan, user_count
  FROM public.users
  WHERE user_id = user_uuid;
  
  -- Pro users can generate unlimited portfolios
  IF user_plan = 'pro' THEN
    RETURN true;
  END IF;
  
  -- Free users limited to 5 portfolios
  RETURN user_count < 5;
END;
$$;