-- Add user profile survey fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS investment_experience TEXT CHECK (investment_experience IN ('Beginner', 'Intermediate', 'Expert')),
ADD COLUMN IF NOT EXISTS risk_tolerance TEXT CHECK (risk_tolerance IN ('Low', 'Moderate', 'High')),
ADD COLUMN IF NOT EXISTS time_horizon TEXT CHECK (time_horizon IN ('1-3yrs', '3-7yrs', '7+yrs')),
ADD COLUMN IF NOT EXISTS primary_goal TEXT CHECK (primary_goal IN ('Retirement', 'Wealth accumulation', 'Income', 'Speculation'));