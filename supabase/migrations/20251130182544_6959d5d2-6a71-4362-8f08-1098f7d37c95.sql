-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_unique_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code in format PORTFOLIX-XXXXXX (6 random alphanumeric characters)
    new_code := 'PORTFOLIX-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    
    -- Check if code already exists
    SELECT EXISTS(
      SELECT 1 FROM public.users WHERE referral_code = new_code
    ) INTO code_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  unique_code TEXT;
BEGIN
  -- Generate unique referral code
  unique_code := public.generate_unique_referral_code();
  
  -- Insert user record with referral code
  INSERT INTO public.users (user_id, phone_number, referral_code, credit_balance, referral_count)
  VALUES (NEW.id, COALESCE(NEW.phone, ''), unique_code, 0, 0)
  ON CONFLICT (user_id) 
  DO UPDATE SET referral_code = unique_code
  WHERE users.referral_code IS NULL;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;
CREATE TRIGGER on_auth_user_created_referral
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_referral();