-- Fix security warnings by setting search_path for functions

-- Update the email verification expiry function with proper search_path
CREATE OR REPLACE FUNCTION public.is_email_verification_expired(user_id UUID, token_created_at TIMESTAMPTZ)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the token is older than 60 minutes
  RETURN (NOW() - token_created_at) > INTERVAL '60 minutes';
END;
$$;

-- Update the cleanup function with proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_email_tokens()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function can be called to clean up expired tokens
  -- Note: Actual auth.users table modifications are handled by Supabase Auth
  -- This is a placeholder for custom cleanup logic if needed
  RETURN;
END;
$$;

-- Update the get auth config function with proper search_path
CREATE OR REPLACE FUNCTION public.get_auth_config(config_name VARCHAR(50))
RETURNS VARCHAR(100)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  config_value VARCHAR(100);
BEGIN
  SELECT setting_value INTO config_value
  FROM public.auth_config
  WHERE setting_name = config_name;
  
  RETURN config_value;
END;
$$;

-- Update the trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.update_auth_config_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;