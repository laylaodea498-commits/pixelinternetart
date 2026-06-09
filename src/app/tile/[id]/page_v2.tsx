'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Tile, User } from '@/types/tile';
import Link from 'next/link';

// Mock data fetching based on tile ID
const getTileData = (id: string): { tile: Tile; owner: User } => {
  return {
    tile: {
      id: id,
      x: 42,
      y: 69,
      status: 'sold',
      ownerId: 'user-123',
      wallType: 'premium',
      title: 'Amazing Artwork',
      imageUrl: 'https://picsum.photos/600/600',
      linkUrl: 'https://awesome-artist.com',
    },
    owner: {
      id: 'user-123',
      username: 'awesome_artist',
      display_name: 'Awesome Artist',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=awesome',
      links: [],
    },
  };
};

export default function TileDetail() {
  const params = useParams();
  const id = params.id as string;
  const { tile, owner } = getTileData(id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/2">
            <div className="h-full aspect-square bg-gray-100 flex items-center justify-center">
              {tile.imageUrl ? (
                <img
                  src={tile.imageUrl}
                  alt={tile.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
          </div>
          <div className="p-8 md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 capitalize">
                  {tile.wallType} Wall
                </span>
                <span className="text-sm text-gray-500 font-mono">
                  ID: {tile.id.slice(0, 8)}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">{tile.title}</h1>
              <p className="mt-2 text-lg text-gray-500">
                Position: {tile.x}, {tile.y}
              </p>
              
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Owner</h3>
                <Link href={`/user/${owner.username}`} className="mt-4 flex items-center hover:opacity-80 transition">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={owner.avatarUrl}
                    alt=""
                  />
                  <div className="ml-3">
                    <p className="text-sm font-bold text-gray-900">{owner.display_name}</p>
                    <p className="text-xs text-gray-500">@{owner.username}</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <a
                href={tile.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-md transition-all"
              >
                Visit Website
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Back to Wall
        </Link>
      </div>
    </div>
  );
}
