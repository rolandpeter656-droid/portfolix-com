-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create comprehensive trigger function to handle user creation and referrals
CREATE OR REPLACE FUNCTION public.handle_new_user_with_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  unique_code TEXT;
  referrer_user_id UUID;
  referred_by_code TEXT;
  new_user_email TEXT;
BEGIN
  -- Generate unique referral code
  unique_code := public.generate_unique_referral_code();
  
  -- Get referred_by from user metadata if exists
  referred_by_code := NEW.raw_user_meta_data->>'referred_by';
  
  -- Get new user email
  new_user_email := NEW.email;
  
  -- Insert user record with referral code and initial 5 credits
  INSERT INTO public.users (
    user_id, 
    first_name,
    last_name,
    phone_number, 
    referral_code, 
    credit_balance,
    referred_by
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', NEW.phone, ''),
    unique_code,
    5,
    referred_by_code
  );
  
  -- Log signup bonus credit transaction
  INSERT INTO public.credit_transactions (user_id, amount, reason)
  VALUES (NEW.id, 5, 'Signup bonus');
  
  -- Process referral rewards if user was referred
  IF referred_by_code IS NOT NULL AND referred_by_code != '' THEN
    -- Find the referrer's user_id by their referral code
    SELECT user_id INTO referrer_user_id
    FROM public.users
    WHERE referral_code = referred_by_code;
    
    -- If referrer found, process rewards
    IF referrer_user_id IS NOT NULL THEN
      -- Create referral record with 'activated' status
      INSERT INTO public.referrals (referrer_code, referee_email, status)
      VALUES (referred_by_code, new_user_email, 'activated');
      
      -- Update referrer: increment referral_count and add 10 credits
      UPDATE public.users
      SET 
        referral_count = COALESCE(referral_count, 0) + 1,
        credit_balance = COALESCE(credit_balance, 0) + 10
      WHERE user_id = referrer_user_id;
      
      -- Log referrer's credit transaction
      INSERT INTO public.credit_transactions (user_id, amount, reason)
      VALUES (
        referrer_user_id,
        10,
        'Referral reward: ' || new_user_email || ' joined using your code'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_with_referral();