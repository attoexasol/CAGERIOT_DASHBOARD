/**
 * Artists API Service
 * Supports both demo and live API modes
 */

import { API_CONFIG } from '../../config';
import { Artist, CreateArtistRequest, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { logger } from '../../logger';
import { getApiHeaders, handleApiResponse } from '../helpers';
import { demoArtists, simulateDelay } from '../demo-data';
import { demoStorage } from '../demo-storage';

export const artistsService = {
  /**
   * GET - Get all artists
   */
  async getAll(params?: ListParams): Promise<any> {
    // Demo mode
    if (isDemoMode()) {
      logger.api('Fetching artists (demo mode)');
      await simulateDelay();
      
      let artists = [...demoArtists, ...demoStorage.getAll<Artist>('artists')];
      
      // Apply search filter
      if (params?.search) {
        const search = params.search.toLowerCase();
        artists = artists.filter(a => 
          a.name.toLowerCase().includes(search) ||
          a.email?.toLowerCase().includes(search)
        );
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        data: artists.slice(start, end),
        pagination: {
          page,
          limit,
          total: artists.length,
          totalPages: Math.ceil(artists.length / limit),
        },
      };
    }

    // Live API mode
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sort) queryParams.append('sort', params.sort);
      if (params?.order) queryParams.append('order', params.order);

      const response = await fetch(
        `https://openplay.attoexasolutions.com/api/artists${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
        {
          method: 'GET',
          headers: getApiHeaders(true),
        }
      );

      const apiResponse = await handleApiResponse(response);
      
      // Transform API response: { results: [...] } to { data: [...] }
      // Map each artist from { id, name } to full Artist type with defaults
      const artists: Artist[] = (apiResponse.results || []).map((artist: { id: number; name: string }) => ({
        id: artist.id,
        name: artist.name,
        // Provide defaults for fields the UI expects
        email: '',
        role: '',
        phone: '',
        bio: '',
        totalReleases: 0,
        totalStreams: 0,
        totalRoyalties: 0,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatar: undefined,
      }));

      // Apply client-side search filter if provided
      let filteredArtists = artists;
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredArtists = artists.filter(a => 
          a.name.toLowerCase().includes(search)
        );
      }

      return {
        data: filteredArtists,
        pagination: {
          page: apiResponse.current_page || 1,
          limit: 10,
          total: apiResponse.total_results || filteredArtists.length,
          totalPages: Math.ceil((apiResponse.total_results || filteredArtists.length) / 10),
        },
      };
    } catch (error) {
      logger.error('Get artists failed:', error);
      throw error;
    }
  },

  /**
   * GET - Get artist by ID
   */
  async getById(id: string): Promise<Artist> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Fetching artist ${id} (demo mode)`);
      await simulateDelay();
      
      const artist = demoArtists.find(a => a.id === id) || demoStorage.getById<Artist>('artists', id);
      if (!artist) throw new Error('Artist not found');
      return artist;
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/artists/${id}`, {
        method: 'GET',
        headers: getApiHeaders(true),
      });

      const data = await handleApiResponse<Artist>(response);
      return data;
    } catch (error) {
      logger.error(`Get artist ${id} failed:`, error);
      throw error;
    }
  },

  /**
   * POST - Create new artist
   */
  async create(artistData: CreateArtistRequest): Promise<Artist> {
    // Demo mode
    if (isDemoMode()) {
      logger.api('Creating artist (demo mode)');
      await simulateDelay();
      
      const newArtist: Artist = {
        id: `artist-${Date.now()}`,
        name: artistData.name,
        spotify_url: artistData.spotify_url || null,
        apple_url: artistData.apple_url || null,
        youtube_url: artistData.youtube_url || null,
        soundcloud_url: artistData.soundcloud_url || null,
        instagram_url: artistData.instagram_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        ipi_name_numbers: [],
        rights_controlled: false,
        usa_license_indicator: null,
        x_url: null,
        facebook_url: null,
        // Legacy fields
        email: artistData.email,
        role: artistData.role,
        phone: artistData.phone,
        bio: artistData.bio,
        totalReleases: 0,
        totalStreams: 0,
        totalRoyalties: 0,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      demoStorage.add('artists', newArtist);
      
      return newArtist;
    }

    // Live API mode
    try {
      logger.api('Creating artist (live API)');
      
      // Prepare request body - only include name and optional URL fields
      const requestBody: any = {
        name: artistData.name,
      };
      
      // Add optional URL fields only if they are provided
      if (artistData.spotify_url) requestBody.spotify_url = artistData.spotify_url;
      if (artistData.apple_url) requestBody.apple_url = artistData.apple_url;
      if (artistData.youtube_url) requestBody.youtube_url = artistData.youtube_url;
      if (artistData.soundcloud_url) requestBody.soundcloud_url = artistData.soundcloud_url;
      if (artistData.instagram_url) requestBody.instagram_url = artistData.instagram_url;

      const response = await fetch(`${API_CONFIG.BASE_URL}/artists`, {
        method: 'POST',
        headers: getApiHeaders(true),
        body: JSON.stringify(requestBody),
      });

      const data = await handleApiResponse<Artist>(response);
      logger.success('Artist created successfully');
      return data;
    } catch (error: any) {
      logger.error('Create artist failed:', error);
      throw new Error(error?.message || 'Failed to create artist');
    }
  },

  /**
   * PUT - Update artist
   */
  async update(id: string, artistData: Partial<CreateArtistRequest>): Promise<Artist> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Updating artist ${id} (demo mode)`);
      await simulateDelay();
      
      const artist = demoArtists.find(a => a.id === id) || demoStorage.getById<Artist>('artists', id);
      if (!artist) throw new Error('Artist not found');
      
      const updatedArtist = {
        ...artist,
        ...artistData,
        updatedAt: new Date().toISOString(),
      };
      
      const storageArtist = demoStorage.getById<Artist>('artists', id);
      if (storageArtist) {
        demoStorage.update('artists', id, updatedArtist);
      }
      
      return updatedArtist;
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/artists/${id}`, {
        method: 'PUT',
        headers: getApiHeaders(true),
        body: JSON.stringify(artistData),
      });

      const data = await handleApiResponse<Artist>(response);
      return data;
    } catch (error) {
      logger.error(`Update artist ${id} failed:`, error);
      throw error;
    }
  },

  /**
   * DELETE - Delete artist
   */
  async delete(id: string): Promise<void> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Deleting artist ${id} (demo mode)`);
      await simulateDelay();
      demoStorage.delete('artists', id);
      return;
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/artists/${id}`, {
        method: 'DELETE',
        headers: getApiHeaders(true),
      });

      await handleApiResponse(response);
    } catch (error) {
      logger.error(`Delete artist ${id} failed:`, error);
      throw error;
    }
  },
};
