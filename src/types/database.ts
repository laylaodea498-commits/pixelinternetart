export type WallType = 'premium' | 'community'
export type TileStatus = 'available' | 'reserved' | 'sold'
export type ReservationStatus = 'pending' | 'confirmed' | 'expired' | 'cancelled'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'
export type UploadStatus = 'pending' | 'approved' | 'rejected'
export type ReferralStatus = 'pending' | 'paid'

export interface User {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  referral_code: string
  referred_by: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Tile {
  id: string
  wall_type: WallType
  x: number
  y: number
  owner_id: string | null
  image_url: string | null
  link_url: string | null
  title: string | null
  status: TileStatus
  price: number
  purchased_at: string | null
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: string
  tile_id: string
  user_id: string
  status: ReservationStatus
  stripe_session_id: string | null
  expires_at: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  tile_id: string
  reservation_id: string | null
  stripe_payment_intent_id: string | null
  amount: number
  currency: string
  status: PaymentStatus
  created_at: string
}

export interface Upload {
  id: string
  user_id: string
  tile_id: string | null
  file_url: string
  file_type: string
  status: UploadStatus
  moderation_reason: string | null
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_user_id: string
  tile_id: string | null
  commission_amount: number
  status: ReferralStatus
  created_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

// Wall dimensions
export const PREMIUM_WALL_WIDTH = 100
export const PREMIUM_WALL_HEIGHT = 100
export const PREMIUM_TILE_PRICE = 1.00

export const COMMUNITY_WALL_WIDTH = 200
export const COMMUNITY_WALL_HEIGHT = 200
export const COMMUNITY_TILE_PRICE = 0.20

export function getTilePrice(wallType: WallType): number {
  return wallType === 'premium' ? PREMIUM_TILE_PRICE : COMMUNITY_TILE_PRICE
}