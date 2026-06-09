import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { DEFAULT_SITE_CONFIG } from '@/lib/config'

/**
 * GET /api/config
 * Returns the site configuration (feature flags, settings).
 * Public endpoint — anyone can read the config.
 */
export async function GET() {
  try {
    const adminSupabase = createAdminSupabaseClient()

    const { data: configRows, error } = await adminSupabase
      .from('site_config')
      .select('key, value')

    if (error || !configRows) {
      // Return defaults if table doesn't exist yet
      return NextResponse.json(DEFAULT_SITE_CONFIG)
    }

    // Map config rows into a typed object
    const config: Record<string, any> = { ...DEFAULT_SITE_CONFIG }

    for (const row of configRows) {
      const val = row.value
      if (typeof val === 'object' && val !== null) {
        // JSONB can store primitives or objects
        if ('boolean' in val) config[row.key] = val.boolean
        else if ('number' in val) config[row.key] = val.number
        else if ('string' in val) config[row.key] = val.string
        else config[row.key] = val
      } else {
        config[row.key] = val
      }
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Config fetch error:', error)
    return NextResponse.json(DEFAULT_SITE_CONFIG)
  }
}