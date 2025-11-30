-- Function to handle referral rewards after user signup
CREATE OR REPLACE FUNCTION public.handle_referral_rewards()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_user_id UUID;
  referrer_email TEXT;
  new_user_email TEXT;
BEGIN
  -- Only process if user was referred by someone
  IF NEW.referred_by IS NOT NULL AND NEW.referred_by != '' THEN
    
    -- Find the referrer's user_id by their referral code
    SELECT user_id INTO referrer_user_id
    FROM public.users
    WHERE referral_code = NEW.referred_by;
    
    -- If referrer found, process rewards
    IF referrer_user_id IS NOT NULL THEN
      
      -- Get emails for the referrals table
      SELECT email INTO new_user_email
      FROM auth.users
      WHERE id = NEW.user_id;
      
      SELECT email INTO referrer_email
      FROM auth.users
      WHERE id = referrer_user_id;
      
      -- 1. Insert row into referrals table with status "activated"
      INSERT INTO public.referrals (referrer_code, referee_email, status)
      VALUES (NEW.referred_by, new_user_email, 'activated');
      
      -- 2 & 3. Increment referrer's referral_count by 1
      UPDATE public.users
      SET referral_count = COALESCE(referral_count, 0) + 1
      WHERE user_id = referrer_user_id;
      
      -- 4. Add 10 credits to referrer
      UPDATE public.users
      SET credit_balance = COALESCE(credit_balance, 0) + 10
      WHERE user_id = referrer_user_id;
      
      -- 5. Add 5 credits to new user
      UPDATE public.users
      SET credit_balance = COALESCE(credit_balance, 0) + 5
      WHERE user_id = NEW.user_id;
      
      -- 6. Insert two records into credit_transactions table
      -- Transaction for referrer (+10 credits)
      INSERT INTO public.credit_transactions (user_id, amount, reason)
      VALUES (
        referrer_user_id,
        10,
        'Referral reward: ' || new_user_email || ' joined using your code'
      );
      
      -- Transaction for new user (+5 credits)
      INSERT INTO public.credit_transactions (user_id, amount, reason)
      VALUES (
        NEW.user_id,
        5,
        'Welcome bonus: Joined using referral code ' || NEW.referred_by
      );
      
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to fire after user insert (after referral code is assigned)
DROP TRIGGER IF EXISTS on_user_referral_rewards ON public.users;
CREATE TRIGGER on_user_referral_rewards
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_referral_rewards();