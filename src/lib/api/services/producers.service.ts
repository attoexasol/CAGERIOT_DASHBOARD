/**
 * Producers Service
 * Handles music producer and engineer management
 * 
 * API Endpoints:
 * - GET /producers - List all producers
 * - GET /producers/:id - Get producer details
 * - POST /producers - Create new producer
 * - PUT /producers/:id - Update producer
 * - DELETE /producers/:id - Delete producer
 */

import { apiClient, ApiResponse, PaginatedResponse } from '../client';
import { Producer, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { logger } from '../../logger';
import { demoProducers, simulateDelay } from '../demo-data';
import { demoStorage } from '../demo-storage';

export interface CreateProducerRequest {
  name: string;
  role: 'Producer' | 'Audio Engineer' | 'Mixing Engineer' | 'Mastering Engineer';
  email: string;
  phone?: string;
}

class ProducersService {
  /**
   * Get all producers
   */
  async list(params?: ListParams): Promise<PaginatedResponse<Producer>> {
    if (isDemoMode()) {
      logger.api('Fetching producers (demo mode)');
      await simulateDelay();
      
      const producers = [...demoProducers, ...demoStorage.getAll<Producer>('producers')];
      
      return {
        data: producers,
        pagination: {
          page: 1,
          limit: 10,
          total: producers.length,
          totalPages: 1,
        },
      };
    }

    logger.api('Fetching producers (live API)');
    return apiClient.get<PaginatedResponse<Producer>>('/producers', { params });
  }

  /**
   * Get producer by ID
   */
  async getById(id: string): Promise<Producer> {
    if (isDemoMode()) {
      logger.api(`Fetching producer ${id} (demo mode)`);
      await simulateDelay();
      
      const producer = demoProducers.find(p => p.id === id) || demoStorage.getById<Producer>('producers', id);
      if (!producer) throw new Error('Producer not found');
      return producer;
    }

    logger.api(`Fetching producer ${id} (live API)`);
    const response = await apiClient.get<ApiResponse<Producer>>(`/producers/${id}`);
    return response.data;
  }

  /**
   * Create new producer
   */
  async create(data: CreateProducerRequest): Promise<Producer> {
    if (isDemoMode()) {
      logger.api('Creating producer (demo mode)');
      await simulateDelay();
      
      const newProducer: Producer = {
        id: `producer-${Date.now()}`,
        name: data.name,
        role: data.role,
        email: data.email,
        phone: data.phone,
        credits: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      demoStorage.add('producers', newProducer);
      
      return newProducer;
    }

    logger.api('Creating producer (live API)');
    const response = await apiClient.post<ApiResponse<Producer>>('/producers', data);
    return response.data;
  }

  /**
   * Update producer
   */
  async update(id: string, data: Partial<CreateProducerRequest>): Promise<Producer> {
    if (isDemoMode()) {
      logger.api(`Updating producer ${id} (demo mode)`);
      await simulateDelay();
      
      const producer = demoProducers.find(p => p.id === id) || demoStorage.getById<Producer>('producers', id);
      if (!producer) throw new Error('Producer not found');
      
      const updatedProducer = {
        ...producer,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const storageProducer = demoStorage.getById<Producer>('producers', id);
      if (storageProducer) {
        demoStorage.update('producers', id, updatedProducer);
      }
      
      return updatedProducer;
    }

    logger.api(`Updating producer ${id} (live API)`);
    const response = await apiClient.put<ApiResponse<Producer>>(`/producers/${id}`, data);
    return response.data;
  }

  /**
   * Delete producer
   */
  async delete(id: string): Promise<void> {
    if (isDemoMode()) {
      logger.api(`Deleting producer ${id} (demo mode)`);
      await simulateDelay();
      demoStorage.delete('producers', id);
      return;
    }

    logger.api(`Deleting producer ${id} (live API)`);
    await apiClient.delete(`/producers/${id}`);
  }
}

export const producersService = new ProducersService();
