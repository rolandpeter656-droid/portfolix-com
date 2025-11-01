-- PortfoliX Institutional v1.0 - Infrastructure Layer
-- Database schema for AI Portfolio Library, White-label APIs, and Research Terminal

-- Create enum types for institutional plans and currencies
CREATE TYPE institutional_plan_tier AS ENUM ('corporate-starter', 'corporate-growth', 'corporate-enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'trial', 'cancelled', 'expired');
CREATE TYPE currency_type AS ENUM ('USD', 'NGN', 'EUR', 'GBP');
CREATE TYPE partner_tier AS ENUM ('standard', 'premium', 'enterprise');

-- Institutional Subscriptions Table
CREATE TABLE public.institutional_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_name TEXT NOT NULL,
  plan_tier institutional_plan_tier NOT NULL,
  subscription_status subscription_status NOT NULL DEFAULT 'trial',
  currency currency_type NOT NULL DEFAULT 'USD',
  monthly_price INTEGER NOT NULL,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- AI Portfolio Library Table
CREATE TABLE public.institutional_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.institutional_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  portfolio_name TEXT NOT NULL,
  portfolio_type TEXT NOT NULL, -- 'preset' or 'custom'
  investment_horizon TEXT,
  liquidity_needs TEXT,
  risk_tolerance TEXT,
  capital_size NUMERIC,
  allocation JSONB NOT NULL, -- stores asset allocation percentages
  rationale TEXT,
  expected_return TEXT,
  volatility TEXT,
  ai_confidence_score INTEGER,
  inspired_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- White-label Partner Management Table
CREATE TABLE public.white_label_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL UNIQUE,
  partner_domain TEXT,
  partner_tier partner_tier NOT NULL DEFAULT 'standard',
  api_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  branding_config JSONB, -- stores logo, colors, etc.
  allowed_portfolios INTEGER, -- portfolio generation limit
  monthly_fee NUMERIC,
  currency currency_type NOT NULL DEFAULT 'USD',
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- API Keys for White-label Partners & Future Research Terminal
CREATE TABLE public.institutional_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.white_label_partners(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.institutional_subscriptions(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL UNIQUE,
  api_secret TEXT NOT NULL,
  key_name TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '["read"]'::jsonb, -- ['read', 'write', 'admin']
  rate_limit INTEGER NOT NULL DEFAULT 1000, -- requests per day
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Portfolio Performance Tracking (for future analytics)
CREATE TABLE public.portfolio_performance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.institutional_portfolios(id) ON DELETE CASCADE,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  portfolio_value NUMERIC,
  return_percentage NUMERIC,
  volatility_index NUMERIC,
  metadata JSONB -- for additional metrics
);

-- Enable Row Level Security
ALTER TABLE public.institutional_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.white_label_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_performance_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for institutional_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.institutional_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON public.institutional_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.institutional_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for institutional_portfolios
CREATE POLICY "Users can view their own portfolios"
  ON public.institutional_portfolios
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolios"
  ON public.institutional_portfolios
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios"
  ON public.institutional_portfolios
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios"
  ON public.institutional_portfolios
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for white_label_partners (admin only)
CREATE POLICY "Only admins can manage white-label partners"
  ON public.white_label_partners
  FOR ALL
  USING (is_admin());

-- RLS Policies for institutional_api_keys
CREATE POLICY "Admins can manage all API keys"
  ON public.institutional_api_keys
  FOR ALL
  USING (is_admin());

CREATE POLICY "Users can view their subscription API keys"
  ON public.institutional_api_keys
  FOR SELECT
  USING (
    subscription_id IN (
      SELECT id FROM public.institutional_subscriptions WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for portfolio_performance_history
CREATE POLICY "Users can view performance for their portfolios"
  ON public.portfolio_performance_history
  FOR SELECT
  USING (
    portfolio_id IN (
      SELECT id FROM public.institutional_portfolios WHERE user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_institutional_subscriptions_user_id ON public.institutional_subscriptions(user_id);
CREATE INDEX idx_institutional_subscriptions_status ON public.institutional_subscriptions(subscription_status);
CREATE INDEX idx_institutional_portfolios_subscription_id ON public.institutional_portfolios(subscription_id);
CREATE INDEX idx_institutional_portfolios_user_id ON public.institutional_portfolios(user_id);
CREATE INDEX idx_institutional_api_keys_partner_id ON public.institutional_api_keys(partner_id);
CREATE INDEX idx_institutional_api_keys_subscription_id ON public.institutional_api_keys(subscription_id);
CREATE INDEX idx_portfolio_performance_portfolio_id ON public.portfolio_performance_history(portfolio_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_institutional_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_institutional_subscriptions_updated_at
  BEFORE UPDATE ON public.institutional_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_institutional_updated_at();

CREATE TRIGGER update_institutional_portfolios_updated_at
  BEFORE UPDATE ON public.institutional_portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_institutional_updated_at();

CREATE TRIGGER update_white_label_partners_updated_at
  BEFORE UPDATE ON public.white_label_partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_institutional_updated_at();

-- Function to check subscription portfolio limit
CREATE OR REPLACE FUNCTION public.can_generate_institutional_portfolio(sub_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  plan_tier institutional_plan_tier;
  portfolio_count INTEGER;
  max_portfolios INTEGER;
BEGIN
  -- Get subscription plan tier
  SELECT institutional_subscriptions.plan_tier
  INTO plan_tier
  FROM public.institutional_subscriptions
  WHERE id = sub_id;
  
  -- Set limits based on tier
  CASE plan_tier
    WHEN 'corporate-starter' THEN max_portfolios := 3;
    WHEN 'corporate-growth' THEN max_portfolios := 6;
    WHEN 'corporate-enterprise' THEN max_portfolios := 999999; -- unlimited
    ELSE max_portfolios := 0;
  END CASE;
  
  -- Count existing portfolios
  SELECT COUNT(*)
  INTO portfolio_count
  FROM public.institutional_portfolios
  WHERE subscription_id = sub_id;
  
  RETURN portfolio_count < max_portfolios;
END;
$$;

-- Function to generate API key
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'pfx_' || encode(gen_random_bytes(32), 'hex');
END;
$$;