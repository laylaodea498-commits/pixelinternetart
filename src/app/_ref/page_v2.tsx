'use client';

import { useState } from 'react';
import { TileGrid } from '@/components/TileGrid';
import { Stats } from '@/components/Stats';
import { SearchBar } from '@/components/SearchBar';
import { Tile, WallStats } from '@/types/tile';

export default function Home() {
  const [selectedPremiumTiles, setSelectedPremiumTiles] = useState<string[]>([]);
  const [selectedCommunityTiles, setSelectedCommunityTiles] = useState<string[]>([]);

  // Mock stats
  const premiumStats: WallStats = {
    totalTiles: 10000,
    soldTiles: 4500,
    remainingTiles: 5500,
  };

  const communityStats: WallStats = {
    totalTiles: 40000,
    soldTiles: 12000,
    remainingTiles: 28000,
  };

  // Mock sold tiles
  const mockPremiumTiles: Tile[] = [
    { id: 'premium-0-0', x: 0, y: 0, status: 'sold', wallType: 'premium', title: 'Google' },
    { id: 'premium-1-0', x: 1, y: 0, status: 'sold', wallType: 'premium', title: 'Facebook' },
    { id: 'premium-5-5', x: 5, y: 5, status: 'reserved', wallType: 'premium' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            PixelWall
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Own a piece of the internet. A permanent digital canvas for creators and brands.
          </p>
        </div>

        <SearchBar />

        <div className="space-y-12">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Premium Wall</h2>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                £1.00 / tile
              </span>
            </div>
            <Stats stats={premiumStats} />
            <div className="mt-6">
              <TileGrid
                wallType="premium"
                width={100}
                height={100}
                mockData={mockPremiumTiles}
                onTileSelect={setSelectedPremiumTiles}
              />
            </div>
            {selectedPremiumTiles.length > 0 && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-200 flex items-center justify-between">
                <p className="text-indigo-700 font-medium">
                  {selectedPremiumTiles.length} tiles selected (£{(selectedPremiumTiles.length * 1.0).toFixed(2)})
                </p>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-700 transition">
                  Buy Selected
                </button>
              </div>
            )}
          </section>

          <section className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-gray-900 opacity-50">Community Wall</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  Phase 2
                </span>
              </div>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-50 text-green-700">
                Coming Soon
              </span>
            </div>
            
            <div className="relative group">
              <Stats stats={communityStats} />
              <div className="mt-6 relative">
                <TileGrid
                  wallType="community"
                  width={200}
                  height={200}
                  onTileSelect={setSelectedCommunityTiles}
                  disabled={true}
                />
                
                {/* Overlay for Community Wall */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                  <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200 text-center max-w-sm md:max-w-md pointer-events-auto">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Community Wall is Locked</h3>
                    <p className="text-gray-600 mb-6 text-xs md:text-sm">
                      The Community Wall activates once the Premium Wall hits 50% sell-through. Join the waitlist to be notified!
                    </p>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <input 
                        type="email" 
                        required 
                        placeholder="your@email.com"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button 
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-md whitespace-nowrap"
                      >
                        Notify Me
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
