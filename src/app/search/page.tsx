'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tile, User } from '@/types/tile';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<{ tiles: any[]; users: any[] }>({ tiles: [], users: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults({ tiles: [], users: [] });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
        <p className="text-gray-500 mt-2">
          {query ? `Showing results for "${query}"` : 'Enter a search term'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Tiles</h2>
          {results.tiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {results.tiles.map(tile => (
                <Link href={`/tile/${tile.id}`} key={tile.id} className="group flex items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {tile.image_url ? (
                      <img src={tile.image_url} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <span className="text-2xl opacity-20">{tile.wall_type === 'premium' ? '✦' : '◆'}</span>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {tile.title || `Tile (${tile.x}, ${tile.y})`}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">{tile.wall_type} Wall • {tile.status}</p>
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
          {results.users.length > 0 ? (
            <div className="space-y-4">
              {results.users.map(user => (
                <Link href={`/user/${user.display_name || user.email.split('@')[0]}`} key={user.id} className="flex items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden flex-shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      (user.display_name || user.email)[0].toUpperCase()
                    )}
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="font-bold text-sm text-gray-900 truncate">{user.display_name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
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
