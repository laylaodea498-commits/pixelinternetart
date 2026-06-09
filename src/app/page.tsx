import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { InteractiveWall } from "@/components/InteractiveWall";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b border-[var(--surface-light)] sticky top-0 bg-white/80 backdrop-blur-md z-50">
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
              href="/dashboard"
              className="text-sm font-medium hover:text-[var(--accent)] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-light)] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            Own Your Piece of
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] bg-clip-text text-transparent">
              {" "}the Internet
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--foreground)]/70 max-w-2xl mx-auto mb-10">
            PixelWall is a permanent digital canvas. Phase 1 is live — claim your spot on the
            Premium Wall today.
          </p>
          
          <SearchBar />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#premium-wall"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              View Wall — £1.00/tile
            </Link>
          </div>
        </section>

        {/* Premium Wall Interactive Grid */}
        <section id="premium-wall" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[var(--surface-light)]">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Premium Wall (Phase 1)</h2>
            <p className="text-[var(--foreground)]/60 max-w-2xl mx-auto">
              1,000 exclusive tiles. High visibility homepage placement. Select your tiles below to purchase.
            </p>
          </div>
          
          <InteractiveWall wallType="premium" price={1.00} />
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-[var(--surface-light)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--surface-light)]">
              <div className="w-12 h-12 rounded-lg bg-[var(--premium)]/20 flex items-center justify-center mb-4">
                <span className="text-[var(--premium)] text-xl">✦</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Wall</h3>
              <p className="text-[var(--foreground)]/60 text-sm">
                Limited supply. Perfect for brands and serious creators. Permanent placement on our primary grid.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--surface-light)]">
              <div className="w-12 h-12 rounded-lg bg-[var(--community)]/20 flex items-center justify-center mb-4">
                <span className="text-[var(--community)] text-xl">◆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Wall</h3>
              <p className="text-[var(--foreground)]/60 text-sm">
                Unlocks once the Premium Wall reaches 50% sell-through. Affordable entry for everyone.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--surface-light)]">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center mb-4">
                <span className="text-[var(--accent)] text-xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Referral Rewards</h3>
              <p className="text-[var(--foreground)]/60 text-sm">
                Earn 10% commission on every tile purchased through your unique referral link.
              </p>
            </div>
          </div>
        </section>

        {/* Phase 2 Teaser */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[var(--surface-light)] bg-[var(--surface)]/30">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Phase 2: Community Wall</h2>
            <p className="text-[var(--foreground)]/60 max-w-xl mx-auto mb-10">
              The Community Wall will feature 40,000 tiles at just £0.20 each. 
              Coming soon when we hit our Phase 1 target!
            </p>
            
            <div className="max-w-2xl mx-auto">
               <InteractiveWall wallType="community" price={0.20} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--surface-light)] py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[var(--accent)] flex items-center justify-center text-white font-bold text-[10px]">
                PW
              </div>
              <span className="font-bold">PixelWall</span>
            </div>
            <div className="flex gap-8 text-sm text-[var(--foreground)]/60">
              <Link href="/premium-wall" className="hover:text-[var(--accent)]">Premium Wall</Link>
              <Link href="/dashboard" className="hover:text-[var(--accent)]">Dashboard</Link>
              <Link href="/auth/login" className="hover:text-[var(--accent)]">Sign In</Link>
            </div>
            <p className="text-sm text-[var(--foreground)]/40">
              © {new Date().getFullYear()} PixelWall. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
