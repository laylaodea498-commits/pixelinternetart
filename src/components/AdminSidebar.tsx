'use client';

import React from 'react';

interface SidebarItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  closeMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, mobileOpen, closeMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={closeMobile}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col p-4 border-r border-gray-800 transition-transform duration-300 lg:relative lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="mb-8 px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white tracking-wider flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
              <span className="text-white text-xs">PW</span>
            </div>
            <span>PixelWall Admin</span>
          </h1>
          <button onClick={closeMobile} className="lg:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem
            label="Overview"
            isActive={activeTab === 'overview'}
            onClick={() => { setActiveTab('overview'); closeMobile(); }}
            icon={<IconDashboard />}
          />
          <SidebarItem
            label="Moderation"
            isActive={activeTab === 'moderation'}
            onClick={() => { setActiveTab('moderation'); closeMobile(); }}
            icon={<IconModeration />}
          />
          <SidebarItem
            label="User Management"
            isActive={activeTab === 'users'}
            onClick={() => { setActiveTab('users'); closeMobile(); }}
            icon={<IconUsers />}
          />
          <SidebarItem
            label="Tile Assignment"
            isActive={activeTab === 'tiles'}
            onClick={() => { setActiveTab('tiles'); closeMobile(); }}
            icon={<IconTiles />}
          />
          <SidebarItem
            label="Purchases"
            isActive={activeTab === 'purchases'}
            onClick={() => { setActiveTab('purchases'); closeMobile(); }}
            icon={<IconPurchases />}
          />
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-800 px-4 text-xs text-gray-500">
          <p>Logged in as admin</p>
        </div>
      </div>
    </>
  );
};

// Icons (simple SVGs)
const IconDashboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconModeration = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconTiles = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const IconPurchases = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
