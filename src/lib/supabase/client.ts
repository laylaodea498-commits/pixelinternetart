import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client for browser-side usage.
 * Uses the anon key (safe for public client).
 */
export function createClientSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}