'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';

// --- Mock Data ---

const mockStats = {
  totalRevenue: 28450.50,
  premiumSales: 15200,
  communitySales: 13250.50,
  userCount: 4250,
  pendingModeration: 12,
};

const mockModerationQueue = [
  { id: 'u-1', tileId: 't-101', user: 'art_lover', image: 'https://picsum.photos/100', submittedAt: '2h ago' },
  { id: 'u-2', tileId: 't-205', user: 'crypto_punk', image: 'https://picsum.photos/101', submittedAt: '4h ago' },
  { id: 'u-3', tileId: 't-55', user: 'pixel_wiz', image: 'https://picsum.photos/102', submittedAt: '1d ago' },
];

const mockUsers = [
  { id: '1', username: 'john_doe', email: 'john@example.com', role: 'user', joinedAt: '2024-01-15' },
  { id: '2', username: 'admin_jane', email: 'jane@pixelwall.com', role: 'admin', joinedAt: '2023-12-01' },
  { id: '3', username: 'bob_builder', email: 'bob@example.com', role: 'user', joinedAt: '2024-02-10' },
];

const mockPurchases = [
  { id: 'inv-001', tileId: 't-101', user: 'art_lover', amount: 1.00, date: '2024-06-09 14:20' },
  { id: 'inv-002', tileId: 't-505', user: 'stranger_things', amount: 0.20, date: '2024-06-09 13:45' },
  { id: 'inv-003', tileId: 't-22', user: 'corporate_brand', amount: 1.00, date: '2024-06-09 12:30' },
];

// --- Components ---

const StatCard = ({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
            <p className="text-gray-500 text-sm">Welcome back, Admin. Here is what's happening today.</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition">
              Refresh Data
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Revenue" value={`£${mockStats.totalRevenue.toLocaleString()}`} subtext="+12% from last week" />
              <StatCard label="Premium Sales" value={mockStats.premiumSales} subtext="£1.00 per tile" />
              <StatCard label="Community Sales" value={mockStats.communitySales} subtext="£0.20 per tile" />
              <StatCard label="Total Users" value={mockStats.userCount} subtext="52 new today" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Recent Purchases</h3>
                  <button className="text-sm text-indigo-600 font-medium hover:underline">View all</button>
                </div>
                <ul className="divide-y divide-gray-50">
                  {mockPurchases.map((p) => (
                    <li key={p.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                          {p.user[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.user}</p>
                          <p className="text-xs text-gray-400">Tile {p.tileId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">£{p.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{p.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Moderation Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Moderation Queue</h3>
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                    {mockStats.pendingModeration} Pending
                  </span>
                </div>
                <ul className="divide-y divide-gray-50">
                  {mockModerationQueue.map((m) => (
                    <li key={m.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img src={m.image} alt="Tile preview" className="w-12 h-12 rounded border border-gray-200" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.user}</p>
                          <p className="text-xs text-gray-400">Tile {m.tileId}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject">
                          <IconReject />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Approve">
                          <IconApprove />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-4 bg-gray-50 text-center">
                  <button 
                    onClick={() => setActiveTab('moderation')}
                    className="text-sm text-indigo-600 font-bold hover:underline"
                  >
                    Go to Full Queue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Tile</th>
                  <th className="px-6 py-4 font-medium">Owner</th>
                  <th className="px-6 py-4 font-medium">Submitted</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockModerationQueue.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={m.image} alt="" className="w-10 h-10 rounded shadow-sm" />
                        <span className="font-medium text-gray-900">{m.tileId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">@{m.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{m.submittedAt}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-indigo-600 mr-4 hover:underline">Review Details</button>
                      <button className="text-xs font-bold text-green-600 mr-4 hover:underline">Approve</button>
                      <button className="text-xs font-bold text-red-600 hover:underline">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{u.username}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.joinedAt}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-indigo-600 hover:underline">Edit Role</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'tiles' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Manual Tile Override</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tile ID</label>
                  <input type="text" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. t-101" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                  <select className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Available</option>
                    <option>Reserved</option>
                    <option>Sold</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Owner (User ID)</label>
                <input type="text" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="u-12345" />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm">
                  Apply Override
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Invoice</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockPurchases.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">@{p.user}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">£{p.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-red-600 hover:underline">Issue Refund</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// Icons
const IconReject = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconApprove = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);
