'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const tileId = searchParams.get('tile_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Brief delay to let webhook process
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading ? (
        <p className="text-[var(--accent-light)] animate-pulse">
          Finalizing your tile...
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-[var(--foreground)]/40 text-sm mb-4">
            {sessionId && `Session: ${sessionId.slice(-8)}`}
          </p>
          <Link
            href={`/tile/${tileId}`}
            className="block px-6 py-2.5 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            View Your Tile
          </Link>
          <Link
            href="/"
            className="block px-6 py-2.5 rounded-lg border border-[var(--surface-light)] text-[var(--foreground)] font-medium hover:bg-[var(--surface)] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      )}
    </>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-green-400">✓</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-[var(--foreground)]/60 mb-8">
          Your tile has been purchased successfully.
        </p>

        <Suspense fallback={<p className="text-[var(--accent-light)] animate-pulse">Loading...</p>}>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </div>
  )
}