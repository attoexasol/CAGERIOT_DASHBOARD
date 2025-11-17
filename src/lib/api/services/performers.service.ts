/**
 * Performers Service
 * Handles session musician and performer management
 * 
 * API Endpoints:
 * - GET /performers - List all performers
 * - GET /performers/:id - Get performer details
 * - POST /performers - Create new performer
 * - PUT /performers/:id - Update performer
 * - DELETE /performers/:id - Delete performer
 */

import { apiClient, ApiResponse, PaginatedResponse } from '../client';
import { Performer, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { logger } from '../../logger';
import { demoPerformers, simulateDelay } from '../demo-data';
import { demoStorage } from '../demo-storage';

export interface CreatePerformerRequest {
  name: string;
  instrument: string;
  email: string;
  phone?: string;
}

class PerformersService {
  /**
   * Get all performers
   */
  async list(params?: ListParams): Promise<PaginatedResponse<Performer>> {
    if (isDemoMode()) {
      logger.api('Fetching performers (demo mode)');
      await simulateDelay();
      
      const performers = [...demoPerformers, ...demoStorage.getAll<Performer>('performers')];
      
      return {
        data: performers,
        pagination: {
          page: 1,
          limit: 10,
          total: performers.length,
          totalPages: 1,
        },
      };
    }

    logger.api('Fetching performers (live API)');
    return apiClient.get<PaginatedResponse<Performer>>('/performers', { params });
  }

  /**
   * Get performer by ID
   */
  async getById(id: string): Promise<Performer> {
    if (isDemoMode()) {
      logger.api(`Fetching performer ${id} (demo mode)`);
      await simulateDelay();
      
      const performer = demoPerformers.find(p => p.id === id) || demoStorage.getById<Performer>('performers', id);
      if (!performer) throw new Error('Performer not found');
      return performer;
    }

    logger.api(`Fetching performer ${id} (live API)`);
    const response = await apiClient.get<ApiResponse<Performer>>(`/performers/${id}`);
    return response.data;
  }

  /**
   * Create new performer
   */
  async create(data: CreatePerformerRequest): Promise<Performer> {
    if (isDemoMode()) {
      logger.api('Creating performer (demo mode)');
      await simulateDelay();
      
      const newPerformer: Performer = {
        id: `performer-${Date.now()}`,
        name: data.name,
        instrument: data.instrument,
        email: data.email,
        phone: data.phone,
        projects: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      demoStorage.add('performers', newPerformer);
      
      return newPerformer;
    }

    logger.api('Creating performer (live API)');
    const response = await apiClient.post<ApiResponse<Performer>>('/performers', data);
    return response.data;
  }

  /**
   * Update performer
   */
  async update(id: string, data: Partial<CreatePerformerRequest>): Promise<Performer> {
    if (isDemoMode()) {
      logger.api(`Updating performer ${id} (demo mode)`);
      await simulateDelay();
      
      const performer = demoPerformers.find(p => p.id === id) || demoStorage.getById<Performer>('performers', id);
      if (!performer) throw new Error('Performer not found');
      
      const updatedPerformer = {
        ...performer,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const storagePerformer = demoStorage.getById<Performer>('performers', id);
      if (storagePerformer) {
        demoStorage.update('performers', id, updatedPerformer);
      }
      
      return updatedPerformer;
    }

    logger.api(`Updating performer ${id} (live API)`);
    const response = await apiClient.put<ApiResponse<Performer>>(`/performers/${id}`, data);
    return response.data;
  }

  /**
   * Delete performer
   */
  async delete(id: string): Promise<void> {
    if (isDemoMode()) {
      logger.api(`Deleting performer ${id} (demo mode)`);
      await simulateDelay();
      demoStorage.delete('performers', id);
      return;
    }

    logger.api(`Deleting performer ${id} (live API)`);
    await apiClient.delete(`/performers/${id}`);
  }
}

export const performersService = new PerformersService();
