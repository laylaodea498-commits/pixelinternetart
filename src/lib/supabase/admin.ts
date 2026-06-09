import { createClient } from '@supabase/supabase-js'

/**
 * Supabase admin client for server-side usage only.
 * Uses the service_role key (NEVER expose to the browser).
 * Use this for admin operations, webhooks, and server-side mutations.
 */
export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}