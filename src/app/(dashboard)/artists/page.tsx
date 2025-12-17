'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { SearchBar } from '../../../components/SearchBar';
import { ButtonPrimary } from '../../../components/ButtonPrimary';
import { SEO } from '../../../components/SEO';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { artistsService } from '../../../lib/api';
import { Artist } from '../../../lib/api/types';

export default function Artists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchArtists();
  }, [searchQuery]);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const response = await artistsService.getAll({ search: searchQuery });
      setArtists(response.data || []);
    } catch (error) {
      console.error('Failed to fetch artists:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <SEO
        title="Artists"
        description="Manage your artists, bands, and collaborators with royalty tracking"
        keywords="artists, musicians, bands, collaborators, royalties"
      />
      {/* Page header */}
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-white">Artists</h1>
        <ButtonPrimary icon={Plus} href="/artists/new">
          <span className="hidden sm:inline">Add Artist</span>
          <span className="sm:hidden">Add</span>
        </ButtonPrimary>
      </div>

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <SearchBar
          placeholder="Search artists..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12 sm:py-20">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[#ff0050]" />
        </div>
      )}

      {/* Desktop Table */}
      {!loading && (
        <>
          <div className="hidden md:block overflow-hidden rounded-lg border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs text-gray-400">Artist</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-400">Role</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-400">Total Royalties</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-400">Join Date</th>
                    <th className="px-6 py-4 text-left text-xs text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArtists.map((artist, index) => (
                    <tr
                      key={artist.id}
                      className={`border-t border-gray-800 transition-colors hover:bg-gray-900/30 ${
                        index % 2 === 0 ? 'bg-gray-900/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={artist.avatar} alt={artist.name} />
                            <AvatarFallback className="bg-gray-800 text-white">
                              {artist.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white">{artist.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{artist.role}</td>
                      <td className="px-6 py-4 text-white">
                        ${typeof artist.totalRoyalties === 'number' 
                          ? artist.totalRoyalties.toLocaleString() 
                          : artist.totalRoyalties}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(artist.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className={
                          artist.status === 'active' 
                            ? 'bg-green-500/10 text-green-500 border-0'
                            : 'bg-gray-500/10 text-gray-500 border-0'
                        }>
                          {artist.status ? artist.status.charAt(0).toUpperCase() + artist.status.slice(1) : 'Active'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredArtists.length === 0 ? (
              <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-6 sm:p-8 text-center text-sm text-gray-400">
                No artists found
              </div>
            ) : (
              filteredArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="rounded-lg border border-gray-800 bg-gray-900/30 p-3 sm:p-4"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarImage src={artist.avatar} alt={artist.name} />
                      <AvatarFallback className="bg-gray-800 text-white text-sm">
                        {artist.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base text-white truncate">{artist.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">{artist.role}</p>
                      <Badge 
                        variant="secondary" 
                        className={`mt-1 text-xs ${
                          artist.status === 'active' 
                            ? 'bg-green-500/10 text-green-500 border-0'
                            : 'bg-gray-500/10 text-gray-500 border-0'
                        }`}
                      >
                        {artist.status ? artist.status.charAt(0).toUpperCase() + artist.status.slice(1) : 'Active'}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="min-w-0">
                      <span className="text-gray-500 block mb-0.5">Royalties</span>
                      <p className="text-white truncate">
                        ${typeof artist.totalRoyalties === 'number' 
                          ? artist.totalRoyalties.toLocaleString() 
                          : artist.totalRoyalties}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <span className="text-gray-500 block mb-0.5">Joined</span>
                      <p className="text-gray-400 truncate">
                        {new Date(artist.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
