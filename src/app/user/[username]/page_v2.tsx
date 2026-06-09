'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { User, Tile } from '@/types/tile';

// Mock data fetching based on username
const getUserData = (username: string): { user: User; tiles: Tile[] } => {
  return {
    user: {
      id: 'user-1',
      username: username,
      display_name: username.replace('_', ' ').toUpperCase(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: `This is the public profile of ${username}. A proud owner of pixels on the PixelWall.`,
      links: [
        { label: 'Website', url: 'https://example.com' },
        { label: 'Twitter', url: 'https://twitter.com' },
      ],
    },
    tiles: [
      {
        id: 'tile-1',
        x: 10,
        y: 20,
        status: 'sold',
        ownerId: 'user-1',
        wallType: 'premium',
        title: 'Premium Spot',
        imageUrl: 'https://picsum.photos/200',
        linkUrl: 'https://example.com',
      },
    ],
  };
};

export default function UserProfile() {
  const params = useParams();
  const username = params.username as string;
  const { user, tiles } = getUserData(username);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <img
          className="h-24 w-24 rounded-full mx-auto border-4 border-indigo-100 shadow-sm"
          src={user.avatarUrl}
          alt=""
        />
        <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {user.display_name}
        </h1>
        <p className="text-gray-500">@{user.username}</p>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          {user.bio}
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          {user.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">
          Owned Tiles
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {tiles.map((tile) => (
            <div key={tile.id} className="group relative bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 group-hover:opacity-75">
                {tile.imageUrl ? (
                  <img
                    src={tile.imageUrl}
                    alt=""
                    className="w-full h-full object-center object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">
                    <a href={tile.linkUrl} target="_blank" rel="noopener noreferrer">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {tile.title || `Tile ${tile.x}, ${tile.y}`}
                    </a>
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 capitalize">{tile.wallType} Wall</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {tile.x}, {tile.y}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
