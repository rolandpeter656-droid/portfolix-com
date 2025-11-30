-- Add referral fields to users table
ALTER TABLE public.users
ADD COLUMN referral_code TEXT,
ADD COLUMN referred_by TEXT,
ADD COLUMN credit_balance INTEGER DEFAULT 0,
ADD COLUMN referral_count INTEGER DEFAULT 0;

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_code TEXT NOT NULL,
  referee_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create credit_transactions table
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on credit_transactions
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for referrals
CREATE POLICY "Users can view referrals by their code"
ON public.referrals
FOR SELECT
USING (referrer_code IN (SELECT referral_code FROM public.users WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can insert referrals"
ON public.referrals
FOR INSERT
WITH CHECK (true);

-- Policies for credit_transactions
CREATE POLICY "Users can view their own transactions"
ON public.credit_transactions
FOR SELECT
USING (user_id = auth.uid());

-- Add indexes for performance
CREATE INDEX idx_referrals_referrer_code ON public.referrals(referrer_code);
CREATE INDEX idx_referrals_referee_email ON public.referrals(referee_email);
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_users_referral_code ON public.users(referral_code);