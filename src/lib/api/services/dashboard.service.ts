/**
 * Dashboard API Service
 * Supports both demo and live API modes
 */

import { apiClient, ApiResponse } from '../client';
import { DashboardStats } from '../types';
import { isDemoMode } from '../../config';
import { demoDashboardStats, simulateDelay } from '../demo-data';

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay();
      return demoDashboardStats;
    }

    // Live API mode
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },
};
