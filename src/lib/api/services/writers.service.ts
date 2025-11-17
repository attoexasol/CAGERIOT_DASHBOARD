/**
 * Writers Service
 * Handles songwriter and composer management
 * 
 * API Endpoints:
 * - GET /writers - List all writers
 * - GET /writers/:id - Get writer details
 * - POST /writers - Create new writer
 * - PUT /writers/:id - Update writer
 * - DELETE /writers/:id - Delete writer
 */

import { apiClient, ApiResponse, PaginatedResponse } from '../client';
import { Writer, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { logger } from '../../logger';
import { demoWriters, simulateDelay } from '../demo-data';
import { demoStorage } from '../demo-storage';

export interface CreateWriterRequest {
  name: string;
  email: string;
  ipiNumber: string;
  publisherId?: string;
}

class WritersService {
  /**
   * Get all writers
   */
  async list(params?: ListParams): Promise<PaginatedResponse<Writer>> {
    if (isDemoMode()) {
      logger.api('Fetching writers (demo mode)');
      await simulateDelay();
      
      const writers = [...demoWriters, ...demoStorage.getAll<Writer>('writers')];
      
      return {
        data: writers,
        pagination: {
          page: 1,
          limit: 10,
          total: writers.length,
          totalPages: 1,
        },
      };
    }

    logger.api('Fetching writers (live API)');
    return apiClient.get<PaginatedResponse<Writer>>('/writers', { params });
  }

  /**
   * Get writer by ID
   */
  async getById(id: string): Promise<Writer> {
    if (isDemoMode()) {
      logger.api(`Fetching writer ${id} (demo mode)`);
      await simulateDelay();
      
      const writer = demoWriters.find(w => w.id === id) || demoStorage.getById<Writer>('writers', id);
      if (!writer) throw new Error('Writer not found');
      return writer;
    }

    logger.api(`Fetching writer ${id} (live API)`);
    const response = await apiClient.get<ApiResponse<Writer>>(`/writers/${id}`);
    return response.data;
  }

  /**
   * Create new writer
   */
  async create(data: CreateWriterRequest): Promise<Writer> {
    if (isDemoMode()) {
      logger.api('Creating writer (demo mode)');
      await simulateDelay();
      
      const newWriter: Writer = {
        id: `writer-${Date.now()}`,
        name: data.name,
        email: data.email,
        ipiNumber: data.ipiNumber,
        publisherId: data.publisherId,
        songs: 0,
        royalties: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      demoStorage.add('writers', newWriter);
      
      return newWriter;
    }

    logger.api('Creating writer (live API)');
    const response = await apiClient.post<ApiResponse<Writer>>('/writers', data);
    return response.data;
  }

  /**
   * Update writer
   */
  async update(id: string, data: Partial<CreateWriterRequest>): Promise<Writer> {
    if (isDemoMode()) {
      logger.api(`Updating writer ${id} (demo mode)`);
      await simulateDelay();
      
      const writer = demoWriters.find(w => w.id === id) || demoStorage.getById<Writer>('writers', id);
      if (!writer) throw new Error('Writer not found');
      
      const updatedWriter = {
        ...writer,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const storageWriter = demoStorage.getById<Writer>('writers', id);
      if (storageWriter) {
        demoStorage.update('writers', id, updatedWriter);
      }
      
      return updatedWriter;
    }

    logger.api(`Updating writer ${id} (live API)`);
    const response = await apiClient.put<ApiResponse<Writer>>(`/writers/${id}`, data);
    return response.data;
  }

  /**
   * Delete writer
   */
  async delete(id: string): Promise<void> {
    if (isDemoMode()) {
      logger.api(`Deleting writer ${id} (demo mode)`);
      await simulateDelay();
      demoStorage.delete('writers', id);
      return;
    }

    logger.api(`Deleting writer ${id} (live API)`);
    await apiClient.delete(`/writers/${id}`);
  }
}

export const writersService = new WritersService();
