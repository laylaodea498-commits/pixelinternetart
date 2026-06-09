import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { formatPrice, getWallDimensions } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface TilePageProps {
  params: Promise<{ id: string }>
}

export default async function TilePage({ params }: TilePageProps) {
  const { id } = await params
  const adminSupabase = createAdminSupabaseClient()

  // Fetch tile with owner info
  const { data: tile, error } = await adminSupabase
    .from('tiles')
    .select(`
      id,
      wall_type,
      x,
      y,
      image_url,
      link_url,
      title,
      status,
      price,
      purchased_at,
      created_at,
      owner_id,
      users!tiles_owner_id_fkey(display_name, avatar_url, email)
    `)
    .eq('id', id)
    .single()

  if (error || !tile) {
    notFound()
  }

  const owner = Array.isArray(tile.users) ? tile.users[0] : tile.users
  const dims = getWallDimensions(tile.wall_type as 'premium' | 'community')
  const isSold = tile.status === 'sold'
  const isAvailable = tile.status === 'available'
  const isReserved = tile.status === 'reserved'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--surface-light)]">
        <nav className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
              PW
            </div>
            <span className="text-xl font-bold">PixelWall</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tile Preview */}
          <div>
            <div className="aspect-square rounded-xl bg-[var(--surface)] border border-[var(--surface-light)] overflow-hidden flex items-center justify-center">
              {tile.image_url ? (
                <img
                  src={tile.image_url}
                  alt={tile.title || `Tile (${tile.x}, ${tile.y})`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="text-4xl mb-2 opacity-30">
                    {tile.wall_type === 'premium' ? '✦' : '◆'}
                  </div>
                  <p className="text-[var(--foreground)]/30 text-sm">
                    {isSold
                      ? 'Owner has not uploaded content yet'
                      : 'This tile has no content'}
                  </p>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="mt-4 flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isSold
                    ? 'bg-green-500/20 text-green-400'
                    : isReserved
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {tile.status.charAt(0).toUpperCase() + tile.status.slice(1)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tile.wall_type === 'premium'
                    ? 'bg-[var(--premium)]/20 text-[var(--premium)]'
                    : 'bg-[var(--community)]/20 text-[var(--community)]'
                }`}
              >
                {tile.wall_type === 'premium' ? 'Premium' : 'Community'}
              </span>
            </div>
          </div>

          {/* Tile Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {tile.title || `Tile (${tile.x}, ${tile.y})`}
            </h1>
            <p className="text-[var(--foreground)]/60 mb-6">
              Position ({tile.x}, {tile.y}) on a {dims.width}×{dims.height} grid
            </p>

            <div className="space-y-4">
              {/* Price */}
              <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--surface-light)]">
                <div className="text-sm text-[var(--foreground)]/40 mb-1">Price</div>
                <div className="text-2xl font-bold">
                  {formatPrice(tile.price)}
                </div>
              </div>

              {/* Owner Info */}
              {owner && (
                <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--surface-light)]">
                  <div className="text-sm text-[var(--foreground)]/40 mb-1">Owner</div>
                  <Link
                    href={`/user/${owner.display_name || owner.email?.split('@')[0]}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-sm font-medium">
                      {(owner.display_name || owner.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">
                        {owner.display_name || 'Anonymous'}
                      </div>
                      {owner.email && (
                        <div className="text-sm text-[var(--foreground)]/40">
                          {owner.email}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              )}

              {/* Dates */}
              <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--surface-light)]">
                <div className="text-sm text-[var(--foreground)]/40 mb-1">Details</div>
                <div className="space-y-1 text-sm">
                  <div>
                    Created:{' '}
                    {new Date(tile.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  {tile.purchased_at && (
                    <div>
                      Purchased:{' '}
                      {new Date(tile.purchased_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Buy Button */}
              {isAvailable && (
                <Link
                  href={`/checkout?tile_id=${tile.id}`}
                  className="block w-full text-center px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Buy This Tile — {formatPrice(tile.price)}
                </Link>
              )}

              {tile.link_url && (
                <a
                  href={tile.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-3 rounded-lg border border-[var(--surface-light)] text-[var(--foreground)] font-medium hover:bg-[var(--surface)] transition-colors"
                >
                  Visit Link ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}