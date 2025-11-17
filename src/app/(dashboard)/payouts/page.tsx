'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Plus } from 'lucide-react';
import { ButtonPrimary } from '../../../components/ButtonPrimary';
import { SEO } from '../../../components/SEO';

const payoutData = [
  { month: 'Jan', amount: 12400 },
  { month: 'Feb', amount: 15600 },
  { month: 'Mar', amount: 18900 },
  { month: 'Apr', amount: 14200 },
  { month: 'May', amount: 21300 },
  { month: 'Jun', amount: 25600 },
  { month: 'Jul', amount: 19800 },
  { month: 'Aug', amount: 23400 },
  { month: 'Sep', amount: 27100 },
  { month: 'Oct', amount: 29800 },
  { month: 'Nov', amount: 31200 },
];

const payoutHistory = [
  {
    id: '1',
    date: '2025-10-15',
    amount: '$31,200',
    collaborator: 'Grace Power',
    status: 'Completed',
  },
  {
    id: '2',
    date: '2025-09-15',
    amount: '$27,100',
    collaborator: 'Echo Chamber',
    status: 'Completed',
  },
  {
    id: '3',
    date: '2025-08-15',
    amount: '$23,400',
    collaborator: 'The Resonance',
    status: 'Completed',
  },
  {
    id: '4',
    date: '2025-07-15',
    amount: '$19,800',
    collaborator: 'Luna Martinez',
    status: 'Completed',
  },
  {
    id: '5',
    date: '2025-06-15',
    amount: '$25,600',
    collaborator: 'Digital Waves',
    status: 'Completed',
  },
];

export default function Payouts() {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <SEO
        title="Payouts"
        description="Track and manage royalty payments and distributions"
        keywords="payouts, royalties, payments, distributions, earnings"
      />
      {/* Page header */}
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="mb-1.5 sm:mb-2 text-xl sm:text-2xl md:text-3xl text-white">Payouts</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">Track and manage royalty payments</p>
        </div>
        <ButtonPrimary icon={Plus} href="/payouts/new">
          <span className="hidden sm:inline">Create Payout</span>
          <span className="sm:hidden">Create</span>
        </ButtonPrimary>
      </div>

      {/* Stats cards */}
      <div className="mb-4 sm:mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Total Payouts</span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl text-white">$249,200</div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-green-500">+12.5% from last month</div>
        </div>

        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Average Monthly</span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl text-white">$22,654</div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">Across all collaborators</div>
        </div>

        <div className="rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-gray-400">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm truncate">Next Payout</span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl text-white">Nov 15</div>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400">Estimated: $33,400</div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4 sm:mb-6 md:mb-8 rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
        <h2 className="mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl text-white">Monthly Payouts</h2>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={payoutData}>
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
              formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
            />
            <Bar dataKey="amount" fill="#ff0050" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payout history - Desktop Table */}
      <div className="hidden md:block rounded-lg sm:rounded-xl border border-gray-800 bg-gray-900/30 p-3 sm:p-4 md:p-6">
        <h2 className="mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl text-white">Payout History</h2>
        <div className="overflow-hidden rounded-lg border border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs text-gray-400">Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs text-gray-400">Amount</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs text-gray-400">Collaborator</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((payout, index) => (
                <tr
                  key={payout.id}
                  className={`border-t border-gray-800 transition-colors hover:bg-gray-900/30 ${
                    index % 2 === 0 ? 'bg-gray-900/10' : ''
                  }`}
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-400">
                    {new Date(payout.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-white">{payout.amount}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-400">{payout.collaborator}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span className="rounded-full bg-green-500/10 px-2 sm:px-3 py-0.5 sm:py-1 text-xs text-green-500">
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout history - Mobile Cards */}
      <div className="md:hidden space-y-3">
        <h2 className="mb-3 text-base text-white">Payout History</h2>
        {payoutHistory.map((payout) => (
          <div
            key={payout.id}
            className="rounded-lg border border-gray-800 bg-gray-900/30 p-3"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm text-white truncate">{payout.collaborator}</h3>
                <p className="text-xs text-gray-400">
                  {new Date(payout.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-500 whitespace-nowrap ml-2">
                {payout.status}
              </span>
            </div>
            <div className="text-lg text-white">{payout.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
