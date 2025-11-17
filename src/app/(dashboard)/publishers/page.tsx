'use client';

import { useState, useEffect } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { SearchBar } from '../../../components/SearchBar';
import { ButtonPrimary } from '../../../components/ButtonPrimary';
import { SEO } from '../../../components/SEO';
import { publishersService } from '../../../lib/api';
import type { Publisher } from '../../../lib/api/types';

export default function Publishers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublishers();
  }, []);

  const loadPublishers = async () => {
    try {
      const response = await publishersService.list();
      setPublishers(response.data);
    } catch (error) {
      console.error('Failed to load publishers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPublishers = publishers.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <SEO
        title="Publishers"
        description="Manage music publishers and publishing catalogs"
        keywords="publishers, music publishing, catalog, royalties"
      />
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl text-white">Publishers</h1>
        <ButtonPrimary icon={Plus} href="/publishers/new">Add Publisher</ButtonPrimary>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Search publishers..." value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPublishers.map((publisher) => (
          <div
            key={publisher.id}
            className="rounded-lg border border-gray-800 bg-gray-900/30 p-6 transition-colors hover:border-gray-700"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10">
                  <Building2 className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="text-white">{publisher.name}</h3>
                  <p className="text-sm text-gray-400">{publisher.territory}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Catalog Size</span>
                <span className="text-white">{publisher.catalogSize} songs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Revenue</span>
                <span className="text-white">${publisher.revenue?.toLocaleString() || '0'}</span>
              </div>
              {publisher.website && (
                <div className="pt-2">
                  <a 
                    href={publisher.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-pink-500 hover:text-pink-400"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
