import { InteractiveWall } from '@/components/InteractiveWall';
import Link from 'next/link';

export default function PremiumWallPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b border-[var(--surface-light)]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
              PW
            </div>
            <span className="text-xl font-bold">PixelWall</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-[var(--accent)] transition-colors"
            >
              My Dashboard
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Premium Wall</h1>
          <p className="text-[var(--foreground)]/60 max-w-2xl">
            Phase 1: Limited supply of 1,000 premium tiles. Claim your spot on the permanent 
            digital canvas. Select a tile to begin.
          </p>
        </div>

        <InteractiveWall wallType="premium" price={1.00} />
        
        <div className="mt-24 mb-12">
          <h2 className="text-2xl font-bold mb-4">Community Wall</h2>
          <p className="text-[var(--foreground)]/60 max-w-2xl mb-8">
            Phase 2: Larger grid for everyone. Unlocks automatically once the Premium Wall 
            hits 50% sell-through.
          </p>
          <InteractiveWall wallType="community" price={0.20} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--surface-light)] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[var(--foreground)]/40">
          <p>© {new Date().getFullYear()} PixelWall. Own your piece of the internet.</p>
        </div>
      </footer>
    </div>
  );
}
