'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tile, TileStatus } from '@/types/tile';

interface TileGridProps {
  wallType: 'premium' | 'community';
  width: number;
  height: number;
  onTileSelect: (tiles: string[]) => void;
  mockData?: Tile[];
  disabled?: boolean;
}

export const TileGrid: React.FC<TileGridProps> = ({
  wallType,
  width,
  height,
  onTileSelect,
  mockData = [],
  disabled = false,
}) => {
  const [selectedTiles, setSelectedTiles] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const handleTileClick = (tileId: string, status: TileStatus) => {
    if (disabled || status !== 'available') return;

    setSelectedTiles((prev) => {
      const next = new Set(prev);
      if (next.has(tileId)) {
        next.delete(tileId);
      } else {
        next.add(tileId);
      }
      return next;
    });
  };

  useEffect(() => {
    onTileSelect(Array.from(selectedTiles));
  }, [selectedTiles, onTileSelect]);

  // Create a 2D array representing the grid
  const grid: (Tile | null)[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => null)
  );

  mockData.forEach((tile) => {
    if (tile.x < width && tile.y < height) {
      grid[tile.y][tile.x] = tile;
    }
  });

  return (
    <div className={`overflow-auto max-w-full max-h-[70vh] border border-gray-300 rounded-lg bg-gray-50 ${disabled ? 'grayscale opacity-60 pointer-events-none' : ''}`}>
      <div
        className="grid gap-px bg-gray-200"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(10px, 1fr))`,
          width: `${width * 12}px`, // Fixed size for now to allow scrolling
        }}
      >
        {grid.map((row, y) =>
          row.map((tile, x) => {
            const id = `${wallType}-${x}-${y}`;
            const status = tile?.status || 'available';
            const isSelected = selectedTiles.has(id);

            return (
              <div
                key={id}
                onClick={() => handleTileClick(id, status)}
                className={`
                  aspect-square w-full transition-colors
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${status === 'sold' ? 'bg-blue-500' : 'bg-white'}
                  ${status === 'reserved' ? 'bg-yellow-300' : ''}
                  ${isSelected ? 'ring-2 ring-inset ring-green-500 bg-green-100' : ''}
                  ${!disabled ? 'hover:bg-gray-100' : ''}
                `}
                title={disabled ? 'Locked (Phase 2)' : (tile?.title || `Tile ${x}, ${y}`)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
