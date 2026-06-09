import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'

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
 * POST /api/admin/moderate
 * Approve or reject a tile image upload.
 *
 * Body:
 * {
 *   "upload_id": "uuid",
 *   "action": "approve" | "reject",
 *   "reason": "optional reason for rejection"
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

    // 2. Check admin status
    const adminSupabase = createAdminSupabaseClient()

    const { data: moderator } = await adminSupabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!moderator?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // 3. Parse body
    const { upload_id, action, reason } = await request.json()

    if (!upload_id || !action) {
      return NextResponse.json(
        { error: 'upload_id and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'action must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    if (action === 'reject' && !reason) {
      return NextResponse.json(
        { error: 'reason is required when rejecting an upload' },
        { status: 400 }
      )
    }

    // 4. Fetch the upload record
    const { data: upload, error: uploadError } = await adminSupabase
      .from('uploads')
      .select('id, tile_id, user_id, file_url, status')
      .eq('id', upload_id)
      .single()

    if (uploadError || !upload) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    if (upload.status !== 'pending') {
      return NextResponse.json(
        { error: `Upload has already been ${upload.status}` },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    if (action === 'approve') {
      // 5a. Approve: update upload status AND tile image_url atomically
      const { error: updateUploadError } = await adminSupabase
        .from('uploads')
        .update({ status: 'approved' })
        .eq('id', upload_id)

      if (updateUploadError) {
        console.error('Failed to approve upload:', updateUploadError)
        return NextResponse.json(
          { error: 'Failed to approve upload' },
          { status: 500 }
        )
      }

      const { error: updateTileError } = await adminSupabase
        .from('tiles')
        .update({
          image_url: upload.file_url,
          updated_at: now,
        })
        .eq('id', upload.tile_id)

      if (updateTileError) {
        console.error('Failed to update tile image:', updateTileError)
        // Non-fatal — upload is approved but image not applied
      }

      // Log audit
      await adminSupabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'tile_upload_approved',
        entity_type: 'upload',
        entity_id: upload_id,
        new_values: {
          tile_id: upload.tile_id,
          image_url: upload.file_url,
          approved_by: user.id,
        },
      })

      return NextResponse.json({
        status: 'approved',
        message: 'Upload approved and tile image updated',
      })
    } else {
      // 5b. Reject: update upload status with moderation reason
      const { error: rejectError } = await adminSupabase
        .from('uploads')
        .update({
          status: 'rejected',
          moderation_reason: reason,
        })
        .eq('id', upload_id)

      if (rejectError) {
        console.error('Failed to reject upload:', rejectError)
        return NextResponse.json(
          { error: 'Failed to reject upload' },
          { status: 500 }
        )
      }

      // Log audit
      await adminSupabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'tile_upload_rejected',
        entity_type: 'upload',
        entity_id: upload_id,
        new_values: {
          tile_id: upload.tile_id,
          reason,
          rejected_by: user.id,
        },
      })

      return NextResponse.json({
        status: 'rejected',
        message: 'Upload rejected',
      })
    }
  } catch (error) {
    console.error('Moderation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}