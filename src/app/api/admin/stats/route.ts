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
 * GET /api/admin/stats
 * Returns global stats for the admin dashboard.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteSupabaseClient(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminSupabase = createAdminSupabaseClient()
    const { data: profile } = await adminSupabase.from('users').select('is_admin').eq('id', user.id).single()

    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Fetch stats
    const { data: payments } = await adminSupabase.from('payments').select('amount, status')
    const { count: userCount } = await adminSupabase.from('users').select('*', { count: 'exact', head: true })
    const { count: pendingModeration } = await adminSupabase.from('uploads').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    const { data: premiumSales } = await adminSupabase.from('tiles').select('id').eq('wall_type', 'premium').eq('status', 'sold')
    const { data: communitySales } = await adminSupabase.from('tiles').select('id').eq('wall_type', 'community').eq('status', 'sold')

    const totalRevenue = payments?.filter(p => p.status === 'succeeded').reduce((acc, p) => acc + Number(p.amount), 0) || 0

    return NextResponse.json({
      totalRevenue,
      premiumSales: premiumSales?.length || 0,
      communitySales: communitySales?.length || 0,
      userCount: userCount || 0,
      pendingModeration: pendingModeration || 0,
    })
  } catch (error) {
    console.error('Admin stats fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
