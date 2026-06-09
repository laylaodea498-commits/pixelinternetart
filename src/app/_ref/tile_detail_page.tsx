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

            <div className="mt-10 space-y-4">
              <a
                href={tile.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-md transition-all"
              >
                Visit Website
              </a>
              
              <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase">Share Tile</span>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-[#1DA1F2] transition-colors border border-gray-100 rounded-lg hover:bg-gray-50">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-1.015-2.175-1.649-3.594-1.649-2.719 0-4.923 2.204-4.923 4.923 0 .385.043.76.127 1.121-4.092-.205-7.72-2.165-10.148-5.144-.424.63-.667 1.38-.667 2.186 0 1.708.869 3.216 2.19 4.098-.806-.027-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.379 4.604 3.419-1.68 1.319-3.909 2.105-6.315 2.105-.411 0-.816-.024-1.213-.071 2.186 1.398 4.768 2.215 7.548 2.215 9.054 0 13.999-7.496 13.999-13.986 0-.213-.003-.426-.008-.637 1.054-.697 1.836-1.57 2.512-2.573z"/></svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#E1306C] transition-colors border border-gray-100 rounded-lg hover:bg-gray-50">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </button>
                </div>
              </div>
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
