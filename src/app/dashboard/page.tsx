'use client';

import React, { useEffect, useState } from 'react';
import { Tile, WallStats } from '@/types/tile';
import Link from 'next/link';
import { TileUploadModal } from '@/components/TileUploadModal';
import { formatPrice } from '@/lib/utils';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadTileId, setUploadTileId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/user/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data || !data.profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
        <Link href="/auth/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">
          Sign In
        </Link>
      </div>
    );
  }

  const { profile, tiles, payments, referral_stats } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome back, {profile.display_name || 'Pixel User'}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="space-y-6">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full border-2 border-indigo-500 bg-indigo-50 flex items-center justify-center text-2xl font-bold text-indigo-700">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    (profile.display_name || profile.email)[0].toUpperCase()
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{profile.display_name || 'Anonymous'}</h3>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Referral Link</h4>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/ref/${profile.referral_code}`}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/ref/${profile.referral_code}`);
                      alert('Copied to clipboard!');
                    }}
                    className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Stats */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Referral Rewards</h3>
            </div>
            <div className="px-4 py-5 sm:p-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Signups</p>
                <p className="text-xl font-bold text-gray-900">{referral_stats.signups}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Conversions</p>
                <p className="text-xl font-bold text-indigo-600">{referral_stats.conversions}</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-gray-50">
                <p className="text-xs text-gray-500 uppercase">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">£{referral_stats.total_earned.toFixed(2)}</p>
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
                {tiles?.length || 0} Total
              </span>
            </div>
            <div className="border-t border-gray-200">
              {tiles && tiles.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {tiles.map((tile: any) => (
                    <li key={tile.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                            {tile.image_url ? (
                              <img src={tile.image_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-gray-400 text-xl">{tile.wall_type === 'premium' ? '✦' : '◆'}</span>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {tile.title || `Tile at ${tile.x}, ${tile.y}`}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {tile.wall_type} Wall • {tile.x}, {tile.y}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setUploadTileId(tile.id)}
                            className="inline-flex items-center px-3 py-1 border border-indigo-600 text-xs font-medium rounded text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                          >
                            Upload Content
                          </button>
                          <Link 
                            href={`/tile/${tile.id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500">You don't own any tiles yet.</p>
                  <Link href="/premium-wall" className="mt-4 inline-block text-indigo-600 font-medium hover:underline">
                    Browse the Wall
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Purchase History */}
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Purchase History</h3>
            </div>
            <div className="border-t border-gray-200 overflow-x-auto">
              {payments && payments.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment: any) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          £{Number(payment.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-6 text-center text-gray-500">No transactions yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {uploadTileId && (
        <TileUploadModal 
          tileId={uploadTileId} 
          onClose={() => setUploadTileId(null)}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
}
