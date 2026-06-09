'use client';

import React from 'react';
import { User, Tile, Purchase } from '@/types/tile';

const mockUser: User = {
  id: 'user-1',
  username: 'pixel_artist',
  display_name: 'Pixel Artist',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pixel',
  bio: 'Just a digital enthusiast owning pieces of the web.',
  referral_code: 'PIXEL123',
  links: [
    { label: 'Portfolio', url: 'https://portfolio.example.com' },
    { label: 'Twitter', url: 'https://twitter.com/pixel_artist' },
  ],
};

const mockOwnedTiles: Tile[] = [
  {
    id: 'tile-1',
    x: 10,
    y: 20,
    status: 'sold',
    ownerId: 'user-1',
    wallType: 'premium',
    title: 'My First Tile',
    imageUrl: 'https://picsum.photos/200',
    linkUrl: 'https://example.com/tile1',
  },
  {
    id: 'tile-2',
    x: 45,
    y: 80,
    status: 'sold',
    ownerId: 'user-1',
    wallType: 'community',
    title: 'Community Contribution',
    imageUrl: 'https://picsum.photos/201',
    linkUrl: 'https://example.com/tile2',
  },
];

const mockPurchases: Purchase[] = [
  { id: 'p-1', tileId: 'tile-1', amount: 1.0, date: '2024-05-20', status: 'completed' },
  { id: 'p-2', tileId: 'tile-2', amount: 0.2, date: '2024-06-01', status: 'completed' },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            User Dashboard
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full border-2 border-indigo-500"
                src={mockUser.avatarUrl}
                alt=""
              />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{mockUser.display_name}</h3>
                <p className="text-sm text-gray-500">@{mockUser.username}</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Bio</h4>
              <p className="mt-2 text-sm text-gray-600">{mockUser.bio}</p>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Referral Link</h4>
              <div className="mt-2 flex rounded-md shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={`https://pixelwall.com?ref=${mockUser.referral_code}`}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Owned Tiles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Your Tiles</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {mockOwnedTiles.length} Total
              </span>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {mockOwnedTiles.map((tile) => (
                  <li key={tile.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                          {tile.imageUrl ? (
                            <img src={tile.imageUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs">No Img</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {tile.title || `Tile at ${tile.x}, ${tile.y}`}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {tile.wallType} Wall • {tile.x}, {tile.y}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-xs text-indigo-600 hover:text-indigo-900 font-medium">
                          Edit
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                          View
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Purchase History */}
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Purchase History</h3>
            </div>
            <div className="border-t border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tile ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockPurchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.tileId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{purchase.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
