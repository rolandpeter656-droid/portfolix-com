-- Create waitlist table for API page
CREATE TABLE public.api_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.api_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public waitlist)
CREATE POLICY "Anyone can join the waitlist" 
ON public.api_waitlist 
FOR INSERT 
WITH CHECK (true);

-- Create policy to prevent reading waitlist data (admin only)
CREATE POLICY "Only admins can view waitlist" 
ON public.api_waitlist 
FOR SELECT 
USING (false);