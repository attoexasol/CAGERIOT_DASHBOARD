/**
 * Royalties API Service
 * Supports both demo and live API modes
 */

import { apiClient, ApiResponse, PaginatedResponse } from '../client';
import { RoyaltyRecord, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { demoRoyalties, simulateDelay } from '../demo-data';

export const royaltiesService = {
  /**
   * Get all royalties
   */
  async getAll(params?: ListParams): Promise<PaginatedResponse<RoyaltyRecord>> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay();
      
      let royalties = [...demoRoyalties];
      
      // Apply search filter
      if (params?.search) {
        const search = params.search.toLowerCase();
        royalties = royalties.filter(r => 
          r.trackName.toLowerCase().includes(search) ||
          r.artistName.toLowerCase().includes(search)
        );
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        data: royalties.slice(start, end),
        pagination: {
          page,
          limit,
          total: royalties.length,
          totalPages: Math.ceil(royalties.length / limit),
        },
      };
    }

    // Live API mode
    return apiClient.get<PaginatedResponse<RoyaltyRecord>>('/royalties', { params });
  },

  /**
   * Get royalty by ID
   */
  async getById(id: string): Promise<RoyaltyRecord> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay();
      const royalty = demoRoyalties.find(r => r.id === id);
      if (!royalty) {
        throw new Error('Royalty not found');
      }
      return royalty;
    }

    // Live API mode
    const response = await apiClient.get<ApiResponse<RoyaltyRecord>>(`/royalties/${id}`);
    return response.data;
  },
};
