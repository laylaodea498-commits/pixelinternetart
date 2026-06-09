'use client';

import React, { useState, useEffect } from 'react';
import { TileGrid } from './TileGrid';
import { Stats } from './Stats';
import { Tile, WallStats } from '@/types/tile';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface InteractiveWallProps {
  wallType: 'premium' | 'community';
  price: number;
}

export const InteractiveWall: React.FC<InteractiveWallProps> = ({ wallType, price }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [stats, setStats] = useState<WallStats | null>(null);
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [tilesRes, configRes] = await Promise.all([
          fetch(`/api/tiles?wall_type=${wallType}`),
          fetch('/api/config')
        ]);

        const tilesData = await tilesRes.json();
        const configData = await configRes.json();

        if (Array.isArray(tilesData)) {
          // Map snake_case from DB to camelCase in our Type
          const mappedTiles = tilesData.map((t: any) => ({
            id: t.id,
            x: t.x,
            y: t.y,
            status: t.status,
            ownerId: t.owner_id,
            imageUrl: t.image_url,
            linkUrl: t.link_url,
            title: t.title,
            wallType: t.wall_type,
          }));
          setTiles(mappedTiles);

          // Calculate stats
          const total = wallType === 'premium' ? configData.premium_wall_total_tiles || 1000 : 40000;
          const sold = mappedTiles.filter(t => t.status === 'sold').length;
          
          let isCommunityLocked = false;
          if (wallType === 'community') {
            // Need to know premium wall sell-through
            const pRes = await fetch('/api/tiles?wall_type=premium');
            const pTiles = await pRes.json();
            const pSold = pTiles.filter((t: any) => t.status === 'sold').length;
            const pTotal = configData.premium_wall_total_tiles || 1000;
            isCommunityLocked = (pSold / pTotal) < (configData.premium_wall_sell_through_target || 0.5);
          }

          setStats({
            totalTiles: total,
            soldTiles: sold,
            remainingTiles: total - sold,
          });
          
          if (wallType === 'community') {
            setLocked(isCommunityLocked);
          }
        }
      } catch (error) {
        console.error('Failed to fetch wall data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [wallType]);

  const handleBuy = async () => {
    if (selectedTiles.length === 0) return;
    
    // For now, handle single purchase if multiple are selected (or just the first)
    // The system seems designed for single tile reservation currently
    const firstTileId = selectedTiles[0];
    
    // We need to map the ID back if it was prefixed in TileGrid
    // In TileGrid.tsx: const id = `${wallType}-${x}-${y}`;
    // But we should use the actual UUID from the tile object.
    
    // Let's find the tile UUID
    const tile = tiles.find(t => `${t.wallType}-${t.x}-${t.y}` === firstTileId);
    if (!tile) return;

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tile_id: tile.id, wall_type: wallType }),
      });

      const data = await res.json();
      if (data.reservation_id) {
        // Proceed to checkout
        const checkoutRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tile_id: tile.id, 
            reservation_id: data.reservation_id,
            wall_type: wallType,
            x: tile.x,
            y: tile.y
          }),
        });
        
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          alert(checkoutData.error || 'Failed to create checkout session');
        }
      } else {
        alert(data.error || 'Failed to reserve tile');
      }
    } catch (err) {
      alert('Error initiating purchase');
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl"></div>;
  }

  return (
    <section className="space-y-6">
      {stats && <Stats stats={stats} />}
      
      <div className="mt-6">
        <TileGrid
          wallType={wallType}
          width={wallType === 'premium' ? 100 : 200} // This should ideally come from config
          height={wallType === 'premium' ? 10 : 200}
          mockData={tiles}
          onTileSelect={setSelectedTiles}
          disabled={locked} 
        />
      </div>

      {selectedTiles.length > 0 && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 shadow-lg z-10">
          <p className="text-indigo-700 font-medium">
            {selectedTiles.length} tile{selectedTiles.length > 1 ? 's' : ''} selected 
            (£{(selectedTiles.length * price).toFixed(2)})
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setSelectedTiles([])}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleBuy}
              className="flex-1 sm:flex-none bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
