import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'

/**
 * Stripe Webhook Handler
 *
 * Processes post-payment events:
 * - checkout.session.completed  → Confirm reservation, mark tile as sold
 * - checkout.session.expired    → Cancel reservation, release tile
 *
 * Uses the raw request body for signature verification.
 */
export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeServer()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    // Get raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature')

    let event

    // If webhook secret is set, verify signature
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
      } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        )
      }
    } else {
      // No secret configured — parse event directly (dev mode / mock)
      try {
        event = JSON.parse(rawBody)
      } catch {
        return NextResponse.json(
          { error: 'Invalid payload' },
          { status: 400 }
        )
      }
    }

    const adminSupabase = createAdminSupabaseClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(event.data.object, adminSupabase)
        break
      }

      case 'checkout.session.expired': {
        await handleCheckoutExpired(event.data.object, adminSupabase)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle checkout.session.completed
 * Confirms reservation, marks tile as sold, creates payment record.
 */
async function handleCheckoutCompleted(
  session: any,
  adminSupabase: ReturnType<typeof createAdminSupabaseClient>
) {
  const {
    metadata,
    id: sessionId,
    payment_intent,
    amount_total,
    currency,
    customer_email,
  } = session

  const tileId = metadata?.tile_id
  const reservationId = metadata?.reservation_id
  const userId = metadata?.user_id
  const wallType = metadata?.wall_type

  if (!tileId || !reservationId || !userId) {
    console.error('Missing metadata in checkout session', sessionId)
    return
  }

  const now = new Date().toISOString()

  // 1. Update reservation to confirmed
  const { error: reservationError } = await adminSupabase
    .from('reservations')
    .update({ status: 'confirmed', updated_at: now })
    .eq('id', reservationId)

  if (reservationError) {
    console.error('Failed to confirm reservation:', reservationError)
  }

  // 2. Mark tile as sold
  const { error: tileError } = await adminSupabase
    .from('tiles')
    .update({
      status: 'sold',
      owner_id: userId,
      purchased_at: now,
      updated_at: now,
    })
    .eq('id', tileId)

  if (tileError) {
    console.error('Failed to update tile:', tileError)
  }

  // 3. Create payment record
  const { error: paymentError } = await adminSupabase.from('payments').insert({
    user_id: userId,
    tile_id: tileId,
    reservation_id: reservationId,
    stripe_payment_intent_id:
      typeof payment_intent === 'string' ? payment_intent : payment_intent?.id,
    amount: amount_total ? amount_total / 100 : 0,
    currency: currency || 'gbp',
    status: 'succeeded',
  })

  if (paymentError) {
    console.error('Failed to create payment record:', paymentError)
  }

  // 4. Log audit
  await adminSupabase.from('audit_logs').insert({
    user_id: userId,
    action: 'tile_purchased',
    entity_type: 'tile',
    entity_id: tileId,
    new_values: {
      status: 'sold',
      owner_id: userId,
      stripe_session_id: sessionId,
    },
  })

  console.log(`✅ Tile ${tileId} sold to user ${userId}`)
}

/**
 * Handle checkout.session.expired
 * Cancels the reservation and releases the tile back to available.
 */
async function handleCheckoutExpired(
  session: any,
  adminSupabase: ReturnType<typeof createAdminSupabaseClient>
) {
  const { metadata } = session
  const tileId = metadata?.tile_id
  const reservationId = metadata?.reservation_id

  if (!tileId || !reservationId) {
    return
  }

  const now = new Date().toISOString()

  // 1. Cancel reservation
  await adminSupabase
    .from('reservations')
    .update({ status: 'expired', updated_at: now })
    .eq('id', reservationId)

  // 2. Release tile
  await adminSupabase
    .from('tiles')
    .update({ status: 'available', updated_at: now })
    .eq('id', tileId)
    .eq('status', 'reserved') // Only release if still reserved

  console.log(`⏰ Reservation ${reservationId} for tile ${tileId} expired`)
}