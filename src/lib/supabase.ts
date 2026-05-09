import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client
// For production, add these keys to your Railway/Vercel environment variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
