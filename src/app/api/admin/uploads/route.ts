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
 * GET /api/admin/uploads
 * List all uploads (for admin moderation queue).
 * Optional query params: status=[pending|approved|rejected], limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = createRouteSupabaseClient(request)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // 2. Check admin status
    const adminSupabase = createAdminSupabaseClient()

    const { data: moderator } = await adminSupabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!moderator?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // 3. Parse query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 4. Fetch uploads with user and tile info
    let query = adminSupabase
      .from('uploads')
      .select(`
        id,
        file_url,
        file_type,
        status,
        moderation_reason,
        created_at,
        user_id,
        tile_id,
        users!inner(display_name, email),
        tiles!inner(x, y, wall_type)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: uploads, error } = await query

    if (error) {
      console.error('Failed to list uploads:', error)
      return NextResponse.json(
        { error: 'Failed to fetch uploads' },
        { status: 500 }
      )
    }

    // Get total count
    const { count } = await adminSupabase
      .from('uploads')
      .select('id', { count: 'exact', head: true })
      .eq('status', status)

    return NextResponse.json({
      uploads: uploads || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Admin uploads list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}