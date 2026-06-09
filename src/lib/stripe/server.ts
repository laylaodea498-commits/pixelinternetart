import Stripe from 'stripe'

/**
 * Stripe server-side instance.
 * Use for creating checkout sessions, handling webhooks, etc.
 */
export function getStripeServer() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-10' as Stripe.LatestApiVersion,
    typescript: true,
  })
}