import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { getTilePrice } from '@/types/database'

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
 * POST /api/reserve
 * Reserve a tile for 10 minutes while the user completes checkout.
 *
 * Request body:
 * {
 *   "tile_id": "uuid",
 *   "wall_type": "premium" | "community"
 * }
 *
 * Response:
 * {
 *   "reservation_id": "uuid",
 *   "expires_at": "ISO timestamp",
 *   "price": number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
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

    const { tile_id, wall_type } = await request.json()

    if (!tile_id || !wall_type) {
      return NextResponse.json(
        { error: 'tile_id and wall_type are required' },
        { status: 400 }
      )
    }

    if (!['premium', 'community'].includes(wall_type)) {
      return NextResponse.json(
        { error: 'wall_type must be "premium" or "community"' },
        { status: 400 }
      )
    }

    // Use admin client for atomic operations
    const adminSupabase = createAdminSupabaseClient()

    // ========== ATOMIC RESERVATION ==========
    // Step 1: Check if tile exists, is available, and not already reserved
    const { data: tile, error: tileError } = await adminSupabase
      .from('tiles')
      .select('id, status, price')
      .eq('id', tile_id)
      .single()

    if (tileError || !tile) {
      return NextResponse.json({ error: 'Tile not found' }, { status: 404 })
    }

    if (tile.status !== 'available') {
      return NextResponse.json(
        { error: 'Tile is not available. It may already be reserved or sold.' },
        { status: 409 }
      )
    }

    // Step 2: Cancel any existing expired/pending reservations for this user+tile
    await adminSupabase
      .from('reservations')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('tile_id', tile_id)
      .eq('user_id', user.id)
      .in('status', ['pending'])

    // Step 3: Mark tile as reserved
    const { error: updateTileError } = await adminSupabase
      .from('tiles')
      .update({
        status: 'reserved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tile_id)
      .eq('status', 'available') // Optimistic lock: only update if still available

    if (updateTileError) {
      return NextResponse.json(
        { error: 'Failed to reserve tile. Please try again.' },
        { status: 500 }
      )
    }

    // Step 4: Create reservation record (10 minute lock)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    const { data: reservation, error: reservationError } = await adminSupabase
      .from('reservations')
      .insert({
        tile_id,
        user_id: user.id,
        status: 'pending',
        expires_at: expiresAt,
      })
      .select('id, expires_at')
      .single()

    if (reservationError || !reservation) {
      // Rollback: set tile back to available
      await adminSupabase
        .from('tiles')
        .update({ status: 'available', updated_at: new Date().toISOString() })
        .eq('id', tile_id)

      return NextResponse.json(
        { error: 'Failed to create reservation. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      reservation_id: reservation.id,
      expires_at: reservation.expires_at,
      price: tile.price,
    })
  } catch (error) {
    console.error('Reservation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/reserve?tile_id=uuid
 * Check reservation status for a tile.
 */
export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url)
    const tileId = searchParams.get('tile_id')

    if (!tileId) {
      return NextResponse.json(
        { error: 'tile_id query parameter is required' },
        { status: 400 }
      )
    }

    const adminSupabase = createAdminSupabaseClient()

    const { data: reservation } = await adminSupabase
      .from('reservations')
      .select('id, status, expires_at')
      .eq('tile_id', tileId)
      .eq('user_id', user.id)
      .in('status', ['pending', 'confirmed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!reservation) {
      return NextResponse.json({ active: false })
    }

    // Check if expired
    const isExpired = new Date(reservation.expires_at) < new Date()

    return NextResponse.json({
      active: !isExpired && reservation.status === 'pending',
      confirmed: reservation.status === 'confirmed',
      status: isExpired ? 'expired' : reservation.status,
      expires_at: reservation.expires_at,
    })
  } catch (error) {
    console.error('Reservation check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}