import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'

/**
 * GET /api/search?q=query
 * Search for tiles and users.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ tiles: [], users: [] })
    }

    const adminSupabase = createAdminSupabaseClient()

    // Search tiles by title or id
    const { data: tiles, error: tilesError } = await adminSupabase
      .from('tiles')
      .select('*')
      .or(`title.ilike.%${query}%,id.eq.${query}`)
      .limit(10)

    // Search users by display_name or email (or username if we had it)
    const { data: users, error: usersError } = await adminSupabase
      .from('users')
      .select('id, display_name, avatar_url, email')
      .or(`display_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10)

    if (tilesError || usersError) {
      console.error('Search error:', tilesError || usersError)
      throw new Error('Database search failed')
    }

    return NextResponse.json({ tiles, users })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
