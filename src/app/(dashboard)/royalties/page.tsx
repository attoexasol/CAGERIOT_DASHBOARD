'use client';

import { DollarSign, TrendingUp, Music } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jan', streaming: 8400, mechanical: 3200, performance: 800 },
  { month: 'Feb', streaming: 9600, mechanical: 3800, performance: 1200 },
  { month: 'Mar', streaming: 11200, mechanical: 4500, performance: 3200 },
  { month: 'Apr', streaming: 8900, mechanical: 3100, performance: 2200 },
  { month: 'May', streaming: 13500, mechanical: 5200, performance: 2600 },
  { month: 'Jun', streaming: 15800, mechanical: 6100, performance: 3700 },
];

const sourceData = [
  { name: 'Spotify', value: 45 },
  { name: 'Apple Music', value: 28 },
  { name: 'YouTube', value: 15 },
  { name: 'Other', value: 12 },
];

const COLORS = ['#ff0050', '#ff3366', '#ff6688', '#ff99aa'];

export default function Royalties() {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="mb-1.5 sm:mb-2 text-xl sm:text-2xl md:text-3xl text-white">Royalties</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">Track your royalty earnings across all sources</p>
      </div>

      {/* Stats */}
      <div className="mb-4 sm:mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Total This Year</span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl text-white">$389,200</div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">+18.3% from last year</div>
        </div>

        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">This Month</span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl text-white">$31,200</div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">+12.5% from last month</div>
        </div>

        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <Music className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Top Earning Track</span>
          </div>
          <div className="text-base sm:text-lg md:text-xl text-white truncate">Witching Hour</div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">$12,450 this month</div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6 md:mb-8 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Monthly Breakdown */}
        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <h2 className="mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl text-white">Monthly Breakdown</h2>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="streaming" fill="#ff0050" stackId="a" />
              <Bar dataKey="mechanical" fill="#ff6688" stackId="a" />
              <Bar dataKey="performance" fill="#ff99aa" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Source Distribution */}
        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <h2 className="mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl text-white">Revenue by Source</h2>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                style={{ fontSize: '12px' }}
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
