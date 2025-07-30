import { createClient } from '@supabase/supabase-js'

// Lovable's native Supabase integration
export const supabase = createClient(
  'https://placeholder-url.supabase.co',
  'placeholder-anon-key'
)