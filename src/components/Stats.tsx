import React from 'react';
import { WallStats } from '@/types/tile';

interface StatsProps {
  stats: WallStats;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  const soldPercentage = (stats.soldTiles / stats.totalTiles) * 100;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tiles Sold</p>
          <p className="text-3xl font-bold text-gray-900">{stats.soldTiles.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Remaining</p>
          <p className="text-3xl font-bold text-gray-900">{stats.remainingTiles.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Completion</p>
          <div className="mt-2 flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${soldPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">{soldPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
