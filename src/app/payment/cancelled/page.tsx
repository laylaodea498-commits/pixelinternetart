'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PaymentCancelledContent() {
  const searchParams = useSearchParams()
  const tileId = searchParams.get('tile_id')

  return (
    <div className="space-y-3">
      {tileId && (
        <Link
          href={`/tile/${tileId}`}
          className="block px-6 py-2.5 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </Link>
      )}
      <Link
        href="/"
        className="block px-6 py-2.5 rounded-lg border border-[var(--surface-light)] text-[var(--foreground)] font-medium hover:bg-[var(--surface)] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default function PaymentCancelledPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-yellow-400">!</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-[var(--foreground)]/60 mb-8">
          Your payment was not completed. The tile is still available for purchase.
        </p>

        <Suspense fallback={<p className="text-[var(--foreground)]/40">Loading...</p>}>
          <PaymentCancelledContent />
        </Suspense>
      </div>
    </div>
  )
}