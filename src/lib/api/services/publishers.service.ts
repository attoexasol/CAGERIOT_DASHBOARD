/**
 * Publishers Service
 * Handles music publishing company management
 * 
 * API Endpoints:
 * - GET /publishers - List all publishers
 * - GET /publishers/:id - Get publisher details
 * - POST /publishers - Create new publisher
 * - PUT /publishers/:id - Update publisher
 * - DELETE /publishers/:id - Delete publisher
 */

import { apiClient, ApiResponse, PaginatedResponse } from '../client';
import { Publisher, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { logger } from '../../logger';
import { demoPublishers, simulateDelay } from '../demo-data';
import { demoStorage } from '../demo-storage';

export interface CreatePublisherRequest {
  name: string;
  territory: string;
  contact?: string;
  website?: string;
}

class PublishersService {
  /**
   * Get all publishers
   */
  async list(params?: ListParams): Promise<PaginatedResponse<Publisher>> {
    if (isDemoMode()) {
      logger.api('Fetching publishers (demo mode)');
      await simulateDelay();
      
      const publishers = [...demoPublishers, ...demoStorage.getAll<Publisher>('publishers')];
      
      return {
        data: publishers,
        pagination: {
          page: 1,
          limit: 10,
          total: publishers.length,
          totalPages: 1,
        },
      };
    }

    logger.api('Fetching publishers (live API)');
    return apiClient.get<PaginatedResponse<Publisher>>('/publishers', { params });
  }

  /**
   * Get publisher by ID
   */
  async getById(id: string): Promise<Publisher> {
    if (isDemoMode()) {
      logger.api(`Fetching publisher ${id} (demo mode)`);
      await simulateDelay();
      
      const publisher = demoPublishers.find(p => p.id === id) || demoStorage.getById<Publisher>('publishers', id);
      if (!publisher) throw new Error('Publisher not found');
      return publisher;
    }

    logger.api(`Fetching publisher ${id} (live API)`);
    const response = await apiClient.get<ApiResponse<Publisher>>(`/publishers/${id}`);
    return response.data;
  }

  /**
   * Create new publisher
   */
  async create(data: CreatePublisherRequest): Promise<Publisher> {
    if (isDemoMode()) {
      logger.api('Creating publisher (demo mode)');
      await simulateDelay();
      
      const newPublisher: Publisher = {
        id: `publisher-${Date.now()}`,
        name: data.name,
        territory: data.territory,
        contact: data.contact,
        website: data.website,
        catalogSize: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      demoStorage.add('publishers', newPublisher);
      
      return newPublisher;
    }

    logger.api('Creating publisher (live API)');
    const response = await apiClient.post<ApiResponse<Publisher>>('/publishers', data);
    return response.data;
  }

  /**
   * Update publisher
   */
  async update(id: string, data: Partial<CreatePublisherRequest>): Promise<Publisher> {
    if (isDemoMode()) {
      logger.api(`Updating publisher ${id} (demo mode)`);
      await simulateDelay();
      
      const publisher = demoPublishers.find(p => p.id === id) || demoStorage.getById<Publisher>('publishers', id);
      if (!publisher) throw new Error('Publisher not found');
      
      const updatedPublisher = {
        ...publisher,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const storagePublisher = demoStorage.getById<Publisher>('publishers', id);
      if (storagePublisher) {
        demoStorage.update('publishers', id, updatedPublisher);
      }
      
      return updatedPublisher;
    }

    logger.api(`Updating publisher ${id} (live API)`);
    const response = await apiClient.put<ApiResponse<Publisher>>(`/publishers/${id}`, data);
    return response.data;
  }

  /**
   * Delete publisher
   */
  async delete(id: string): Promise<void> {
    if (isDemoMode()) {
      logger.api(`Deleting publisher ${id} (demo mode)`);
      await simulateDelay();
      demoStorage.delete('publishers', id);
      return;
    }

    logger.api(`Deleting publisher ${id} (live API)`);
    await apiClient.delete(`/publishers/${id}`);
  }
}

export const publishersService = new PublishersService();
