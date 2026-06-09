import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from '@/lib/config'

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
 * POST /api/tile/upload
 * Upload an image for a tile the user owns.
 *
 * Form data:
 * - tile_id: UUID of the tile
 * - image: File (PNG, JPEG, GIF, or WebP, max 5MB)
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

    // 2. Parse form data
    const formData = await request.formData()
    const tileId = formData.get('tile_id') as string | null
    const file = formData.get('image') as File | null

    if (!tileId || !file) {
      return NextResponse.json(
        { error: 'tile_id and image are required' },
        { status: 400 }
      )
    }

    // 3. Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // 4. Validate file size
    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // 5. Verify tile exists and user owns it
    const adminSupabase = createAdminSupabaseClient()

    const { data: tile, error: tileError } = await adminSupabase
      .from('tiles')
      .select('id, status, owner_id, image_url')
      .eq('id', tileId)
      .single()

    if (tileError || !tile) {
      return NextResponse.json({ error: 'Tile not found' }, { status: 404 })
    }

    if (tile.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not own this tile' },
        { status: 403 }
      )
    }

    if (tile.status !== 'sold') {
      return NextResponse.json(
        { error: 'Tile must be purchased before uploading content' },
        { status: 400 }
      )
    }

    // 6. Check if there's already a pending upload for this tile
    const { data: existingUpload } = await adminSupabase
      .from('uploads')
      .select('id, status')
      .eq('tile_id', tileId)
      .eq('user_id', user.id)
      .in('status', ['pending'])
      .maybeSingle()

    if (existingUpload) {
      return NextResponse.json(
        { error: 'You already have a pending upload for this tile' },
        { status: 409 }
      )
    }

    // 7. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop() || 'png'
    const fileName = `${user.id}/${tileId}/${Date.now()}.${fileExt}`
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const { data: storageData, error: storageError } = await adminSupabase.storage
      .from('tile-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (storageError || !storageData) {
      console.error('Storage upload error:', storageError)
      return NextResponse.json(
        { error: 'Failed to upload image. Please try again.' },
        { status: 500 }
      )
    }

    // 8. Get public URL
    const { data: publicUrlData } = adminSupabase.storage
      .from('tile-images')
      .getPublicUrl(fileName)

    const imageUrl = publicUrlData?.publicUrl || ''

    // 9. Create uploads record with status 'pending'
    const { data: uploadRecord, error: uploadError } = await adminSupabase
      .from('uploads')
      .insert({
        user_id: user.id,
        tile_id: tileId,
        file_url: imageUrl,
        file_type: file.type,
        status: 'pending',
      })
      .select('id, status, created_at')
      .single()

    if (uploadError) {
      // Rollback: remove the uploaded file
      await adminSupabase.storage.from('tile-images').remove([fileName])

      console.error('Upload record error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to create upload record.' },
        { status: 500 }
      )
    }

    // 10. Log audit
    await adminSupabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'tile_upload_submitted',
      entity_type: 'upload',
      entity_id: uploadRecord.id,
      new_values: {
        tile_id: tileId,
        file_url: imageUrl,
        file_type: file.type,
      },
    })

    return NextResponse.json({
      upload_id: uploadRecord.id,
      status: uploadRecord.status,
      image_url: imageUrl,
      message: 'Upload submitted for moderation',
    })
  } catch (error) {
    console.error('Tile upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}