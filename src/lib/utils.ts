import { v4 as uuidv4 } from 'uuid'

/**
 * Generate a unique referral code for a user.
 */
export function generateReferralCode(): string {
  return uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase()
}

/**
 * Generate a unique reservation ID.
 */
export function generateReservationId(): string {
  return uuidv4()
}

/**
 * Get wall dimensions by type.
 */
export function getWallDimensions(wallType: 'premium' | 'community') {
  return wallType === 'premium'
    ? { width: 100, height: 100 }
    : { width: 200, height: 200 }
}

/**
 * Calculate total tiles for a wall type.
 */
export function getTotalTiles(wallType: 'premium' | 'community'): number {
  const dims = getWallDimensions(wallType)
  return dims.width * dims.height
}

/**
 * Format price in GBP.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Sleep for a given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}