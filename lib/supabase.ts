import { createClient } from '@supabase/supabase-js';

// Environment variables (with fallbacks for Vercel build process)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// Client for the browser (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for server-side API routes (bypasses RLS)
// !! NEVER export or use this in client components
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
    },
});
