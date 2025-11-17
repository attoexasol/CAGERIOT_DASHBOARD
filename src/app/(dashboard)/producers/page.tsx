'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from '../../../components/SearchBar';
import { ButtonPrimary } from '../../../components/ButtonPrimary';
import { SEO } from '../../../components/SEO';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { producersService } from '../../../lib/api';
import type { Producer } from '../../../lib/api/types';

export default function Producers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducers();
  }, []);

  const loadProducers = async () => {
    try {
      const response = await producersService.list();
      setProducers(response.data);
    } catch (error) {
      console.error('Failed to load producers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducers = producers.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Producers & Engineers"
        description="Manage music producers, audio engineers, and mixing/mastering professionals"
        keywords="producers, audio engineers, mixing, mastering, production"
      />
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-white">Producers & Engineers</h1>
        <ButtonPrimary icon={Plus} href="/producers/new">
          <span className="hidden sm:inline">Add Producer</span>
          <span className="sm:hidden">Add</span>
        </ButtonPrimary>
      </div>

      <div className="mb-4 sm:mb-6">
        <SearchBar placeholder="Search producers..." value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-800">
            <table className="min-w-full w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs text-gray-400 whitespace-nowrap">Producer</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs text-gray-400 whitespace-nowrap">Role</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs text-gray-400 whitespace-nowrap">Credits</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs text-gray-400 whitespace-nowrap">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducers.map((producer, index) => (
                  <tr
                    key={producer.id}
                    className={`border-t border-gray-800 transition-colors hover:bg-gray-900/30 ${
                      index % 2 === 0 ? 'bg-gray-900/10' : ''
                    }`}
                  >
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                          <AvatarFallback className="bg-gray-800 text-white text-xs sm:text-sm">
                            {producer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm sm:text-base whitespace-nowrap">{producer.name}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{producer.role}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-white text-xs sm:text-sm whitespace-nowrap">{producer.credits}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-white text-xs sm:text-sm whitespace-nowrap">${producer.revenue?.toLocaleString() || '0'}</td>
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
