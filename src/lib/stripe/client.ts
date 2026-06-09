import { loadStripe } from '@stripe/stripe-js'

/**
 * Stripe Promise for frontend usage.
 * Use with Elements provider for checkout.
 */
let stripePromise: Promise<import('@stripe/stripe-js').Stripe | null>

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}