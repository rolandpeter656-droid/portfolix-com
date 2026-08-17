CREATE TABLE public.trade_self_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text NOT NULL,
  placed boolean NOT NULL,
  broker text,
  surface text NOT NULL DEFAULT 'in_app',
  portfolio_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_trade_self_reports_created_at ON public.trade_self_reports (created_at DESC);
CREATE INDEX idx_trade_self_reports_session ON public.trade_self_reports (session_id);

GRANT INSERT ON public.trade_self_reports TO anon;
GRANT INSERT, SELECT ON public.trade_self_reports TO authenticated;
GRANT ALL ON public.trade_self_reports TO service_role;

ALTER TABLE public.trade_self_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a trade self report"
ON public.trade_self_reports
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND surface IN ('in_app', 'email')
  AND (user_id IS NULL OR user_id = auth.uid())
);

CREATE POLICY "Admins can read trade self reports"
ON public.trade_self_reports
FOR SELECT
TO authenticated
USING (public.is_admin());