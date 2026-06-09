import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface UserPageProps {
  params: Promise<{ username: string }>
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params
  const adminSupabase = createAdminSupabaseClient()

  // Fetch user by display_name (or email if display_name not set)
  const { data: user, error: userError } = await adminSupabase
    .from('users')
    .select('*')
    .or(`display_name.eq.${username},email.eq.${username}`)
    .single()

  if (userError || !user) {
    notFound()
  }

  // Fetch owned tiles
  const { data: tiles } = await adminSupabase
    .from('tiles')
    .select('id, wall_type, x, y, image_url, title, status, price, purchased_at')
    .eq('owner_id', user.id)
    .order('purchased_at', { ascending: false, nullsFirst: false })
    .limit(50)

  const premiumTiles = tiles?.filter((t) => t.wall_type === 'premium') || []
  const communityTiles = tiles?.filter((t) => t.wall_type === 'community') || []

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
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-3xl font-bold">
            {(user.display_name || user.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {user.display_name || 'Anonymous'}
            </h1>
            <p className="text-[var(--foreground)]/60 mt-1">
              {tiles?.length || 0} tiles owned
            </p>
            {user.referral_code && (
              <p className="text-xs text-[var(--foreground)]/30 mt-1">
                Referral: {user.referral_code}
              </p>
            )}
          </div>
        </div>

        {/* Tiles Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Owned Tiles
            <span className="text-sm font-normal text-[var(--foreground)]/40 ml-2">
              ({tiles?.length || 0} total)
            </span>
          </h2>

          {(!tiles || tiles.length === 0) ? (
            <div className="text-center py-16 text-[var(--foreground)]/40">
              <p>This user hasn&apos;t purchased any tiles yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Premium Tiles */}
              {premiumTiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--premium)] mb-4">
                    Premium Wall
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {premiumTiles.map((tile) => (
                      <Link
                        key={tile.id}
                        href={`/tile/${tile.id}`}
                        className="group block aspect-square rounded-xl bg-[var(--surface)] border border-[var(--surface-light)] overflow-hidden hover:border-[var(--premium)] transition-colors"
                      >
                        <div className="w-full h-full flex flex-col">
                          {tile.image_url ? (
                            <div className="flex-1 overflow-hidden">
                              <img
                                src={tile.image_url}
                                alt={tile.title || ''}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-center">
                              <span className="text-2xl opacity-30">✦</span>
                            </div>
                          )}
                          <div className="p-2 text-xs border-t border-[var(--surface-light)]">
                            <div className="font-medium truncate">
                              {tile.title || `(${tile.x}, ${tile.y})`}
                            </div>
                            <div className="text-[var(--foreground)]/40">
                              {formatPrice(tile.price)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Tiles */}
              {communityTiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--community)] mb-4">
                    Community Wall
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {communityTiles.map((tile) => (
                      <Link
                        key={tile.id}
                        href={`/tile/${tile.id}`}
                        className="group block aspect-square rounded-xl bg-[var(--surface)] border border-[var(--surface-light)] overflow-hidden hover:border-[var(--community)] transition-colors"
                      >
                        <div className="w-full h-full flex flex-col">
                          {tile.image_url ? (
                            <div className="flex-1 overflow-hidden">
                              <img
                                src={tile.image_url}
                                alt={tile.title || ''}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-center">
                              <span className="text-2xl opacity-30">◆</span>
                            </div>
                          )}
                          <div className="p-2 text-xs border-t border-[var(--surface-light)]">
                            <div className="font-medium truncate">
                              {tile.title || `(${tile.x}, ${tile.y})`}
                            </div>
                            <div className="text-[var(--foreground)]/40">
                              {formatPrice(tile.price)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}