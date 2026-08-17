CREATE TABLE public.trade_nudges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id uuid NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  email text NOT NULL,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  responded_at timestamp with time zone
);

GRANT ALL ON public.trade_nudges TO service_role;

ALTER TABLE public.trade_nudges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read trade nudges"
ON public.trade_nudges FOR SELECT TO authenticated
USING (public.is_admin());

CREATE INDEX idx_trade_nudges_token ON public.trade_nudges(token);