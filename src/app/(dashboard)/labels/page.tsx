'use client';

import { useState, useEffect } from 'react';
import { Plus, Disc } from 'lucide-react';
import { SearchBar } from '../../../components/SearchBar';
import { ButtonPrimary } from '../../../components/ButtonPrimary';
import { SEO } from '../../../components/SEO';
import { labelsService } from '../../../lib/api';
import type { Label } from '../../../lib/api/types';

export default function Labels() {
  const [searchQuery, setSearchQuery] = useState('');
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      const response = await labelsService.list();
      setLabels(response.data);
    } catch (error) {
      console.error('Failed to load labels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLabels = labels.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Labels"
        description="Manage record labels and label partnerships"
        keywords="record labels, labels, music labels, artists, releases"
      />
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl text-white">Labels</h1>
        <ButtonPrimary icon={Plus} href="/labels/new">Add Label</ButtonPrimary>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Search labels..." value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLabels.map((label) => (
          <div
            key={label.id}
            className="rounded-lg border border-gray-800 bg-gray-900/30 p-6 transition-colors hover:border-gray-700"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10">
                  <Disc className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="text-white">{label.name}</h3>
                  <p className="text-sm text-gray-400">{label.type}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Artists</span>
                <span className="text-white">{label.artists}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Releases</span>
                <span className="text-white">{label.releases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Revenue</span>
                <span className="text-white">${label.revenue?.toLocaleString() || '0'}</span>
              </div>
              {label.website && (
                <div className="pt-2">
                  <a 
                    href={label.website} 
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
