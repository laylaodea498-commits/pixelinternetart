export interface SiteConfig {
  community_wall_enabled: boolean
  premium_wall_sell_through_target: number
  premium_wall_total_tiles: number
  reservation_ttl_minutes: number
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  community_wall_enabled: false,
  premium_wall_sell_through_target: 0.5,
  premium_wall_total_tiles: 1000,
  reservation_ttl_minutes: 10,
}

/**
 * Allowed image MIME types for tile uploads.
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
] as const

/**
 * Max upload file size (5MB).
 */
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * Allowed image MIME types for profile pictures.
 */
export const ALLOWED_PROFILE_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const

/**
 * Max profile picture size (2MB).
 */
export const MAX_PROFILE_UPLOAD_SIZE = 2 * 1024 * 1024 // 2MB