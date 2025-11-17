/**
 * Payouts API Service
 * Supports both demo and live API modes
 */

import { apiClient, ApiResponse, PaginatedResponse } from '../client';
import { PayoutRecord, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { demoPayouts, simulateDelay } from '../demo-data';
import { demoStorage } from '../demo-storage';

export const payoutsService = {
  /**
   * Get all payouts
   */
  async getAll(params?: ListParams): Promise<PaginatedResponse<PayoutRecord>> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay();
      
      let payouts = [...demoPayouts, ...demoStorage.getAll<PayoutRecord>('payouts')];
      
      // Apply search filter
      if (params?.search) {
        const search = params.search.toLowerCase();
        payouts = payouts.filter(p => 
          p.artistName.toLowerCase().includes(search) ||
          p.period.toLowerCase().includes(search)
        );
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        data: payouts.slice(start, end),
        pagination: {
          page,
          limit,
          total: payouts.length,
          totalPages: Math.ceil(payouts.length / limit),
        },
      };
    }

    // Live API mode
    return apiClient.get<PaginatedResponse<PayoutRecord>>('/payouts', { params });
  },

  /**
   * Get payout by ID
   */
  async getById(id: string): Promise<PayoutRecord> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay();
      const payout = demoPayouts.find(p => p.id === id) || demoStorage.getById<PayoutRecord>('payouts', id);
      if (!payout) {
        throw new Error('Payout not found');
      }
      return payout;
    }

    // Live API mode
    const response = await apiClient.get<ApiResponse<PayoutRecord>>(`/payouts/${id}`);
    return response.data;
  },

  /**
   * Create new payout
   */
  async create(data: Partial<PayoutRecord>): Promise<PayoutRecord> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay();
      
      const newPayout: PayoutRecord = {
        id: `payout-${Date.now()}`,
        artistId: data.artistId || '',
        artistName: data.artistName || '',
        amount: data.amount || 0,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        period: data.period || '',
      };
      
      demoStorage.add('payouts', newPayout);
      return newPayout;
    }

    // Live API mode
    const response = await apiClient.post<ApiResponse<PayoutRecord>>('/payouts', data);
    return response.data;
  },

  /**
   * Update payout status
   */
  async updateStatus(id: string, status: 'Pending' | 'Completed' | 'Failed'): Promise<PayoutRecord> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay();
      
      const payout = demoPayouts.find(p => p.id === id) || demoStorage.getById<PayoutRecord>('payouts', id);
      if (!payout) {
        throw new Error('Payout not found');
      }
      
      const updatedPayout = { ...payout, status };
      
      const storagePayout = demoStorage.getById<PayoutRecord>('payouts', id);
      if (storagePayout) {
        demoStorage.update('payouts', id, updatedPayout);
      }
      
      return updatedPayout;
    }

    // Live API mode
    const response = await apiClient.patch<ApiResponse<PayoutRecord>>(`/payouts/${id}`, { status });
    return response.data;
  },
};
