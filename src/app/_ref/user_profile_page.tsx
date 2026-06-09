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
              className="text-indigo-600 hover:text-indigo-500 font-medium border border-indigo-100 px-3 py-1 rounded-full transition-colors hover:bg-indigo-50"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center items-center space-x-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share Profile</span>
          <div className="h-px w-8 bg-gray-200"></div>
          <button className="text-gray-400 hover:text-[#1DA1F2] transition-colors">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-1.015-2.175-1.649-3.594-1.649-2.719 0-4.923 2.204-4.923 4.923 0 .385.043.76.127 1.121-4.092-.205-7.72-2.165-10.148-5.144-.424.63-.667 1.38-.667 2.186 0 1.708.869 3.216 2.19 4.098-.806-.027-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.379 4.604 3.419-1.68 1.319-3.909 2.105-6.315 2.105-.411 0-.816-.024-1.213-.071 2.186 1.398 4.768 2.215 7.548 2.215 9.054 0 13.999-7.496 13.999-13.986 0-.213-.003-.426-.008-.637 1.054-.697 1.836-1.57 2.512-2.573z"/></svg>
          </button>
          <button className="text-gray-400 hover:text-[#E1306C] transition-colors">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </button>
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
