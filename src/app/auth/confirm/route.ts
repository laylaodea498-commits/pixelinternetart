import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Email confirmation handler.
 * Called when a user clicks the confirmation link in their email.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('token_hash')
  const type = searchParams.get('type')

  if (code && type === 'signup') {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // Cookies are set via the response redirect
          },
        },
      }
    )

    const { error } = await supabase.auth.verifyOtp({
      token_hash: code,
      type: 'signup',
    })

    if (!error) {
      return NextResponse.redirect(`${origin}/auth/login?confirmed=true`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed`)
}