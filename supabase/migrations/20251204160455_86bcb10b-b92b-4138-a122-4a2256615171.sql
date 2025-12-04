-- Create advisor subscription status enum
CREATE TYPE public.advisor_subscription_status AS ENUM ('pending', 'active', 'cancelled', 'expired');

-- Create advisor subscriptions table
CREATE TABLE public.advisor_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  firm_name TEXT NOT NULL,
  firm_location TEXT,
  number_of_clients TEXT,
  investment_focus TEXT[], -- Array of focus areas
  looking_for TEXT,
  subscription_status advisor_subscription_status NOT NULL DEFAULT 'pending',
  monthly_price INTEGER NOT NULL DEFAULT 4900, -- Price in cents ($49)
  payment_reference TEXT,
  subscription_starts_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.advisor_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own advisor subscription"
ON public.advisor_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own advisor subscription"
ON public.advisor_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own advisor subscription"
ON public.advisor_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_advisor_subscriptions_updated_at
BEFORE UPDATE ON public.advisor_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_institutional_updated_at();

-- Function to check if user has active advisor subscription
CREATE OR REPLACE FUNCTION public.has_active_advisor_subscription(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.advisor_subscriptions
    WHERE user_id = user_uuid
    AND subscription_status = 'active'
    AND (subscription_ends_at IS NULL OR subscription_ends_at > now())
  );
END;
$$;