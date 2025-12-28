-- Create user_portfolios table to store saved portfolios for free users
CREATE TABLE public.user_portfolios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  portfolio_name text NOT NULL,
  risk_score integer NOT NULL,
  experience_level text NOT NULL,
  timeline text NOT NULL,
  investment_amount numeric NOT NULL DEFAULT 1000,
  assets jsonb NOT NULL,
  rationale text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_portfolios ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own portfolios"
ON public.user_portfolios
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolios"
ON public.user_portfolios
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios"
ON public.user_portfolios
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios"
ON public.user_portfolios
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_portfolios_updated_at
BEFORE UPDATE ON public.user_portfolios
FOR EACH ROW
EXECUTE FUNCTION public.update_institutional_updated_at();

-- Create index for faster user lookups
CREATE INDEX idx_user_portfolios_user_id ON public.user_portfolios(user_id);
CREATE INDEX idx_user_portfolios_created_at ON public.user_portfolios(created_at DESC);