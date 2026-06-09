import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'

function createRouteSupabaseClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  )
}

/**
 * GET /api/user/dashboard
 * Returns data for the user dashboard: profile, owned tiles, and referrals.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteSupabaseClient(request)
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminSupabase = createAdminSupabaseClient()

    // 1. Fetch profile
    const { data: profile } = await adminSupabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    // 2. Fetch owned tiles
    const { data: tiles } = await adminSupabase
      .from('tiles')
      .select('*')
      .eq('owner_id', authUser.id)
      .order('purchased_at', { ascending: false })

    // 3. Fetch purchase history (from payments table)
    const { data: payments } = await adminSupabase
      .from('payments')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })

    // 4. Fetch referral stats
    const { data: referrals } = await adminSupabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', authUser.id)

    const referral_stats = {
      clicks: 0, // We don't track clicks yet in DB
      signups: referrals?.length || 0,
      conversions: referrals?.filter(r => r.status === 'paid').length || 0,
      total_earned: referrals?.reduce((acc, r) => acc + (Number(r.commission_amount) || 0), 0) || 0,
    }

    return NextResponse.json({
      profile,
      tiles,
      payments,
      referral_stats
    })
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
