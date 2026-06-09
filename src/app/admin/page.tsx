'use client';

import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';

const StatCard = ({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
        
        // Also fetch recent uploads for preview
        const uRes = await fetch('/api/admin/uploads?limit=5');
        const uData = await uRes.json();
        setUploads(uData.uploads);
      } else if (activeTab === 'moderation') {
        const res = await fetch('/api/admin/uploads?status=pending');
        const data = await res.json();
        setUploads(data.uploads);
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleModerate = async (uploadId: string, action: 'approve' | 'reject') => {
    const reason = action === 'reject' ? prompt('Enter reason for rejection:') : null;
    if (action === 'reject' && !reason) return;

    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upload_id: uploadId, action, reason }),
      });

      if (res.ok) {
        alert(`Upload ${action}d successfully`);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Action failed');
      }
    } catch (err) {
      alert('Error performing moderation');
    }
  };

  if (loading && !stats && uploads.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileOpen={mobileMenuOpen}
        closeMobile={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 overflow-auto p-4 md:p-8">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-white border border-gray-200 rounded-lg text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
              <p className="text-gray-500 text-xs md:text-sm">Real-time Administration</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-indigo-700 shadow-sm transition"
          >
            Refresh Data
          </button>
        </header>

        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard label="Total Revenue" value={`£${stats.totalRevenue.toLocaleString()}`} />
              <StatCard label="Premium Sales" value={stats.premiumSales} subtext="£1.00 per tile" />
              <StatCard label="Community Sales" value={stats.communitySales} subtext="£0.20 per tile" />
              <StatCard label="Total Users" value={stats.userCount} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Moderation Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Moderation Queue</h3>
                  <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded-full font-bold">
                    {stats.pendingModeration} Pending
                  </span>
                </div>
                <ul className="divide-y divide-gray-50">
                  {uploads.map((m) => (
                    <li key={m.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 min-w-0">
                        <img src={m.file_url} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded border border-gray-200 flex-shrink-0 object-cover" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{m.users.display_name || m.users.email}</p>
                          <p className="text-xs text-gray-400 truncate">Tile ({m.tiles.x}, {m.tiles.y})</p>
                        </div>
                      </div>
                      <div className="flex space-x-1 md:space-x-2 ml-2">
                        <button onClick={() => handleModerate(m.id, 'reject')} className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                           Reject
                        </button>
                        <button onClick={() => handleModerate(m.id, 'approve')} className="p-1.5 md:p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                           Approve
                        </button>
                      </div>
                    </li>
                  ))}
                  {uploads.length === 0 && (
                    <p className="p-6 text-center text-gray-500 italic">No pending moderation tasks.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Tile</th>
                  <th className="px-6 py-4 font-medium">Owner</th>
                  <th className="px-6 py-4 font-medium">Submitted</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {uploads.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={m.file_url} alt="" className="w-12 h-12 rounded shadow-sm object-cover" />
                        <span className="font-medium text-gray-900">{m.tiles.wall_type} ({m.tiles.x}, {m.tiles.y})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{m.users.display_name || m.users.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(m.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleModerate(m.id, 'approve')} className="text-xs font-bold text-green-600 mr-4 hover:underline">Approve</button>
                      <button onClick={() => handleModerate(m.id, 'reject')} className="text-xs font-bold text-red-600 hover:underline">Reject</button>
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
