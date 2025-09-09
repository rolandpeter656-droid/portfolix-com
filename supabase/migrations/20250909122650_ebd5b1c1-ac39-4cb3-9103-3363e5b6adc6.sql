-- Configure email verification link expiry to 60 minutes
-- This migration sets up custom logic for email verification expiry

-- Create a function to handle email verification token expiry
CREATE OR REPLACE FUNCTION public.is_email_verification_expired(user_id UUID, token_created_at TIMESTAMPTZ)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the token is older than 60 minutes
  RETURN (NOW() - token_created_at) > INTERVAL '60 minutes';
END;
$$;

-- Create a function to clean up expired email verification tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_email_tokens()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function can be called to clean up expired tokens
  -- Note: Actual auth.users table modifications are handled by Supabase Auth
  -- This is a placeholder for custom cleanup logic if needed
  RETURN;
END;
$$;

-- Set up a configuration table for auth settings
CREATE TABLE IF NOT EXISTS public.auth_config (
  id SERIAL PRIMARY KEY,
  setting_name VARCHAR(50) UNIQUE NOT NULL,
  setting_value VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on auth_config table
ALTER TABLE public.auth_config ENABLE ROW LEVEL SECURITY;

-- Create policy for auth_config (read-only for authenticated users)
CREATE POLICY "Auth config is readable by authenticated users"
ON public.auth_config
FOR SELECT
TO authenticated
USING (true);

-- Insert email verification expiry setting
INSERT INTO public.auth_config (setting_name, setting_value)
VALUES ('email_verification_expiry_minutes', '60')
ON CONFLICT (setting_name) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();

-- Create function to get auth config
CREATE OR REPLACE FUNCTION public.get_auth_config(config_name VARCHAR(50))
RETURNS VARCHAR(100)
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_auth_config_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for auth_config updates
CREATE TRIGGER update_auth_config_updated_at
  BEFORE UPDATE ON public.auth_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_auth_config_updated_at();