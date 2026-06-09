import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { getStripeServer } from '@/lib/stripe/server'

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
 * GET /api/checkout/config
 * Returns the Stripe publishable key for the frontend.
 */
export async function GET() {
  return NextResponse.json({
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  })
}

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for tile purchase.
 *
 * Request body:
 * {
 *   "tile_id": "uuid",
 *   "reservation_id": "uuid",
 *   "wall_type": "premium" | "community",
 *   "x": number,
 *   "y": number
 * }
 */
export async function POST(request: NextRequest) {
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

    // 2. Parse body
    const { tile_id, reservation_id, wall_type, x, y } = await request.json()

    if (!tile_id || !reservation_id) {
      return NextResponse.json(
        { error: 'tile_id and reservation_id are required' },
        { status: 400 }
      )
    }

    // 3. Verify reservation belongs to this user and is still valid
    const adminSupabase = createAdminSupabaseClient()

    const { data: reservation, error: reservationError } = await adminSupabase
      .from('reservations')
      .select('id, status, expires_at, tile_id')
      .eq('id', reservation_id)
      .eq('user_id', user.id)
      .single()

    if (reservationError || !reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    if (reservation.status !== 'pending') {
      return NextResponse.json(
        { error: `Reservation is ${reservation.status}. Cannot proceed with checkout.` },
        { status: 400 }
      )
    }

    if (new Date(reservation.expires_at) < new Date()) {
      // Auto-expire
      await adminSupabase
        .from('reservations')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', reservation_id)

      // Release tile back to available
      await adminSupabase
        .from('tiles')
        .update({ status: 'available', updated_at: new Date().toISOString() })
        .eq('id', tile_id)

      return NextResponse.json(
        { error: 'Reservation has expired. Please reserve again.' },
        { status: 400 }
      )
    }

    // 4. Get tile info for pricing
    const { data: tile, error: tileError } = await adminSupabase
      .from('tiles')
      .select('id, price, wall_type, x, y')
      .eq('id', tile_id)
      .single()

    if (tileError || !tile) {
      return NextResponse.json({ error: 'Tile not found' }, { status: 404 })
    }

    // 5. Create Stripe Checkout Session
    const stripe = getStripeServer()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${wall_type === 'premium' ? 'Premium' : 'Community'} Tile (${x}, ${y})`,
              description: `A permanent tile on the PixelWall ${wall_type === 'premium' ? 'Premium' : 'Community'} Wall at position (${x}, ${y}).`,
              images: [],
            },
            unit_amount: Math.round(tile.price * 100), // Convert to pence/cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        tile_id,
        reservation_id,
        user_id: user.id,
        wall_type,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}&tile_id=${tile_id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancelled?tile_id=${tile_id}`,
    })

    // 6. Update reservation with Stripe session ID
    await adminSupabase
      .from('reservations')
      .update({
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reservation_id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}