'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from '../../../components/SearchBar';
import { ButtonPrimary } from '../../../components/ButtonPrimary';
import { SEO } from '../../../components/SEO';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { writersService } from '../../../lib/api';
import type { Writer } from '../../../lib/api/types';

export default function Writers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWriters();
  }, []);

  const loadWriters = async () => {
    try {
      const response = await writersService.list();
      setWriters(response.data);
    } catch (error) {
      console.error('Failed to load writers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWriters = writers.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="text-sm sm:text-base text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <SEO
        title="Writers"
        description="Manage songwriters and composers with IPI tracking"
        keywords="songwriters, composers, writers, IPI, music publishing"
      />
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-white">Writers</h1>
        <ButtonPrimary icon={Plus} href="/writers/new">
          <span className="hidden sm:inline">Add Writer</span>
          <span className="sm:hidden">Add</span>
        </ButtonPrimary>
      </div>

      <div className="mb-4 sm:mb-6">
        <SearchBar placeholder="Search writers..." value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-800">
            <table className="min-w-full w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs text-gray-400 whitespace-nowrap">Writer</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs text-gray-400 whitespace-nowrap">IPI Number</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs text-gray-400 whitespace-nowrap">Songs</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs text-gray-400 whitespace-nowrap">Royalties</th>
                </tr>
              </thead>
              <tbody>
                {filteredWriters.map((writer, index) => (
                  <tr
                    key={writer.id}
                    className={`border-t border-gray-800 transition-colors hover:bg-gray-900/30 ${
                      index % 2 === 0 ? 'bg-gray-900/10' : ''
                    }`}
                  >
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                          <AvatarFallback className="bg-gray-800 text-white text-xs sm:text-sm">
                            {writer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm sm:text-base whitespace-nowrap">{writer.name}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{writer.ipiNumber || 'N/A'}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-white text-xs sm:text-sm whitespace-nowrap">{writer.songs}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-white text-xs sm:text-sm whitespace-nowrap">${writer.royalties?.toLocaleString() || '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
