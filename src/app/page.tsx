import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b border-[var(--surface-light)]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
              PW
            </div>
            <span className="text-xl font-bold">PixelWall</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/premium-wall"
              className="text-sm font-medium text-[var(--accent-light)] hover:text-[var(--premium)] transition-colors"
            >
              Premium Wall
            </Link>
            <Link
              href="/community-wall"
              className="text-sm font-medium text-[var(--accent-light)] hover:text-[var(--community)] transition-colors"
            >
              Community Wall
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-light)] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            Own Your Piece of
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] bg-clip-text text-transparent">
              {" "}the Internet
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--foreground)]/70 max-w-2xl mx-auto mb-12">
            PixelWall is a permanent digital canvas where you can buy, customize,
            and showcase your tiles. Stand out on the Premium Wall or join the
            community on our expansive Community Wall.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/premium-wall"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Explore Premium Wall — £1.00/tile
            </Link>
            <Link
              href="/community-wall"
              className="px-8 py-4 rounded-xl border border-[var(--community)] text-[var(--community)] font-semibold text-lg hover:bg-[var(--community)]/10 transition-colors"
            >
              Community Wall — £0.20/tile
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--surface-light)]">
              <div className="w-12 h-12 rounded-lg bg-[var(--premium)]/20 flex items-center justify-center mb-4">
                <span className="text-[var(--premium)] text-xl">✦</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Wall</h3>
              <p className="text-[var(--foreground)]/60 text-sm">
                100×100 tiles at £1.00 each. High visibility, limited supply.
                Perfect for brands and serious creators.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--surface-light)]">
              <div className="w-12 h-12 rounded-lg bg-[var(--community)]/20 flex items-center justify-center mb-4">
                <span className="text-[var(--community)] text-xl">◆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Wall</h3>
              <p className="text-[var(--foreground)]/60 text-sm">
                200×200 tiles at £0.20 each. Low barrier to entry for everyone
                to join the canvas.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--surface-light)]">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center mb-4">
                <span className="text-[var(--accent)] text-xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Referral Rewards</h3>
              <p className="text-[var(--foreground)]/60 text-sm">
                Earn commissions by referring friends. Share your link and grow
                the PixelWall community.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[var(--surface-light)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[var(--accent-light)]">10,000</div>
              <div className="text-sm text-[var(--foreground)]/50 mt-1">Total Tiles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--premium)]">Premium</div>
              <div className="text-sm text-[var(--foreground)]/50 mt-1">100×100 Grid</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--community)]">Community</div>
              <div className="text-sm text-[var(--foreground)]/50 mt-1">200×200 Grid</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--accent-light)]">£1.00</div>
              <div className="text-sm text-[var(--foreground)]/50 mt-1">Starting Price</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--surface-light)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[var(--foreground)]/40">
          <p>© {new Date().getFullYear()} PixelWall. Own your piece of the internet.</p>
        </div>
      </footer>
    </div>
  );
}