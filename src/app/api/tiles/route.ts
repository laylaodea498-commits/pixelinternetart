import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'

/**
 * GET /api/tiles?wall_type=premium
 * Returns all tiles for a specific wall.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wallType = searchParams.get('wall_type')

    if (!wallType || !['premium', 'community'].includes(wallType)) {
      return NextResponse.json(
        { error: 'wall_type must be "premium" or "community"' },
        { status: 400 }
      )
    }

    const adminSupabase = createAdminSupabaseClient()

    const { data: tiles, error } = await adminSupabase
      .from('tiles')
      .select('*')
      .eq('wall_type', wallType)

    if (error) {
      throw error
    }

    return NextResponse.json(tiles)
  } catch (error) {
    console.error('Tiles fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
