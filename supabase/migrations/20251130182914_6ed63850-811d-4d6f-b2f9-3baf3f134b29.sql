-- Reusable function to redeem credits from a user's balance
CREATE OR REPLACE FUNCTION public.redeem_credits(
  p_user_id UUID,
  p_required_amount INTEGER
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current credit balance
  SELECT credit_balance INTO current_balance
  FROM public.users
  WHERE user_id = p_user_id;
  
  -- Check if user exists
  IF current_balance IS NULL THEN
    RETURN 'user_not_found';
  END IF;
  
  -- Check if user has sufficient credits
  IF current_balance >= p_required_amount THEN
    -- Deduct the required amount
    UPDATE public.users
    SET credit_balance = credit_balance - p_required_amount
    WHERE user_id = p_user_id;
    
    -- Insert transaction record
    INSERT INTO public.credit_transactions (user_id, amount, reason)
    VALUES (
      p_user_id,
      -p_required_amount,
      'Credits redeemed'
    );
    
    RETURN 'success';
  ELSE
    RETURN 'insufficient_credits';
  END IF;
END;
$$;