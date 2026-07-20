ALTER TABLE public.users ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.user_portfolios ADD COLUMN IF NOT EXISTS country TEXT;