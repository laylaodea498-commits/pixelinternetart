'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tile, User } from '@/types/tile';
import Link from 'next/link';

// Mock search results
const getSearchResults = (query: string): { tiles: Tile[]; users: User[] } => {
  // In a real app, this would be an API call to Supabase
  const q = query.toLowerCase();
  
  const mockTiles: Tile[] = [
    { id: 't1', x: 10, y: 20, status: 'sold', title: 'Amazing Pixel', ownerId: 'u1', wallType: 'premium', imageUrl: 'https://picsum.photos/200' },
    { id: 't2', x: 45, y: 80, status: 'sold', title: 'Cool Design', ownerId: 'u2', wallType: 'community', imageUrl: 'https://picsum.photos/201' },
  ];
  
  const mockUsers: User[] = [
    { id: 'u1', username: 'pixel_master', display_name: 'Pixel Master', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master', links: [] },
    { id: 'u2', username: 'creative_soul', display_name: 'Creative Soul', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=soul', links: [] },
  ];

  return {
    tiles: mockTiles.filter(t => t.title?.toLowerCase().includes(q) || t.id.includes(q)),
    users: mockUsers.filter(u => u.username.toLowerCase().includes(q) || u.display_name?.toLowerCase().includes(q)),
  };
};

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { tiles, users } = getSearchResults(query);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
        <p className="text-gray-500 mt-2">Showing results for "{query}"</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Tiles</h2>
          {tiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tiles.map(tile => (
                <Link href={`/tile/${tile.id}`} key={tile.id} className="group flex items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={tile.imageUrl} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{tile.title}</h3>
                    <p className="text-xs text-gray-500 capitalize">{tile.wallType} Wall • {tile.x}, {tile.y}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No tiles found matching your search.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Users</h2>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map(user => (
                <Link href={`/user/${user.username}`} key={user.id} className="flex items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
                  <img src={user.avatarUrl} alt="" className="h-10 w-10 rounded-full border border-indigo-100" />
                  <div className="ml-3">
                    <p className="font-bold text-sm text-gray-900">{user.display_name}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No users found.</p>
          )}
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/" className="text-indigo-600 font-medium hover:underline">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
