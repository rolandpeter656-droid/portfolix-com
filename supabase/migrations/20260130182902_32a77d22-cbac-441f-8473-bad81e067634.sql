-- Enable pgcrypto extension in extensions schema
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Add columns for hashed API key and encrypted secret
ALTER TABLE public.institutional_api_keys 
ADD COLUMN IF NOT EXISTS api_key_hash TEXT,
ADD COLUMN IF NOT EXISTS api_secret_encrypted BYTEA;

-- Create function to hash API keys using SHA-256 (using extensions schema for pgcrypto)
CREATE OR REPLACE FUNCTION public.hash_api_key(key TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = public, extensions
AS $$
  SELECT encode(extensions.digest(key::bytea, 'sha256'), 'hex');
$$;

-- Create function to encrypt API secrets
CREATE OR REPLACE FUNCTION public.encrypt_api_secret(secret TEXT, encryption_key TEXT)
RETURNS BYTEA
LANGUAGE sql
IMMUTABLE
SET search_path = public, extensions
AS $$
  SELECT extensions.pgp_sym_encrypt(secret, encryption_key);
$$;

-- Create function to decrypt API secrets (SECURITY DEFINER for controlled access)
CREATE OR REPLACE FUNCTION public.decrypt_api_secret(encrypted_secret BYTEA, encryption_key TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT extensions.pgp_sym_decrypt(encrypted_secret, encryption_key);
$$;

-- Create SECURITY DEFINER function to validate API key by hash
CREATE OR REPLACE FUNCTION public.validate_api_key(incoming_key TEXT)
RETURNS TABLE (
  id UUID,
  subscription_id UUID,
  key_name TEXT,
  permissions JSONB,
  rate_limit INTEGER,
  is_active BOOLEAN,
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  key_hash TEXT;
BEGIN
  -- Hash the incoming key
  key_hash := public.hash_api_key(incoming_key);
  
  -- Return matching API key record (without exposing secrets)
  RETURN QUERY
  SELECT 
    ak.id,
    ak.subscription_id,
    ak.key_name,
    ak.permissions,
    ak.rate_limit,
    ak.is_active,
    ak.expires_at,
    ak.last_used_at
  FROM public.institutional_api_keys ak
  WHERE ak.api_key_hash = key_hash
    AND ak.is_active = true
    AND (ak.expires_at IS NULL OR ak.expires_at > NOW());
END;
$$;

-- Migrate existing plaintext API keys to hashed format
UPDATE public.institutional_api_keys
SET api_key_hash = public.hash_api_key(api_key)
WHERE api_key_hash IS NULL AND api_key IS NOT NULL AND api_key != '***REDACTED***';

-- Create function to generate and store new API key securely
CREATE OR REPLACE FUNCTION public.create_institutional_api_key(
  p_subscription_id UUID,
  p_key_name TEXT,
  p_permissions JSONB DEFAULT '["read"]'::JSONB,
  p_rate_limit INTEGER DEFAULT 1000,
  p_expires_at TIMESTAMPTZ DEFAULT NULL,
  p_encryption_key TEXT DEFAULT 'portfolix_default_key'
)
RETURNS TABLE (
  id UUID,
  api_key TEXT,
  api_secret TEXT,
  key_name TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  new_id UUID;
  new_api_key TEXT;
  new_api_secret TEXT;
  key_hash TEXT;
  secret_encrypted BYTEA;
BEGIN
  -- Generate new API key and secret
  new_api_key := 'pfx_' || encode(gen_random_bytes(32), 'hex');
  new_api_secret := encode(gen_random_bytes(48), 'hex');
  
  -- Hash the API key
  key_hash := public.hash_api_key(new_api_key);
  
  -- Encrypt the API secret
  secret_encrypted := public.encrypt_api_secret(new_api_secret, p_encryption_key);
  
  -- Insert the new record with hashed key and encrypted secret
  INSERT INTO public.institutional_api_keys (
    subscription_id,
    api_key,
    api_key_hash,
    api_secret,
    api_secret_encrypted,
    key_name,
    permissions,
    rate_limit,
    expires_at,
    is_active
  ) VALUES (
    p_subscription_id,
    '***REDACTED***',
    key_hash,
    '***REDACTED***',
    secret_encrypted,
    p_key_name,
    p_permissions,
    p_rate_limit,
    p_expires_at,
    true
  )
  RETURNING institutional_api_keys.id INTO new_id;
  
  -- Return the plaintext credentials (only time they're visible)
  RETURN QUERY SELECT 
    new_id,
    new_api_key,
    new_api_secret,
    p_key_name,
    NOW();
END;
$$;

-- Add comment explaining the security model
COMMENT ON TABLE public.institutional_api_keys IS 
'API keys for institutional partners. API keys are hashed (SHA-256) and secrets are encrypted (AES via pgp_sym_encrypt). 
Plaintext credentials are only shown once at creation time. Use validate_api_key() function to verify keys.';

-- Grant execute permissions on the validation function
GRANT EXECUTE ON FUNCTION public.validate_api_key(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_api_key(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_institutional_api_key(UUID, TEXT, JSONB, INTEGER, TIMESTAMPTZ, TEXT) TO service_role;