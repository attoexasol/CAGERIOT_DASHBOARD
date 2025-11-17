/**
 * Labels Service
 * Handles CRUD operations for record labels
 * 
 * API Endpoints:
 * - GET /labels - List all labels
 * - GET /labels/:id - Get label details
 * - POST /labels - Create new label
 * - PUT /labels/:id - Update label
 * - DELETE /labels/:id - Delete label
 */

import { apiClient, ApiResponse, PaginatedResponse } from '../client';
import { Label, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { logger } from '../../logger';
import { demoLabels, simulateDelay } from '../demo-data';
import { demoStorage } from '../demo-storage';

export interface CreateLabelRequest {
  name: string;
  contact?: string;
  website?: string;
}

class LabelsService {
  /**
   * Get all labels
   */
  async list(params?: ListParams): Promise<PaginatedResponse<Label>> {
    if (isDemoMode()) {
      logger.api('Fetching labels (demo mode)');
      await simulateDelay();
      
      const labels = [...demoLabels, ...demoStorage.getAll<Label>('labels')];
      
      return {
        data: labels,
        pagination: {
          page: 1,
          limit: 10,
          total: labels.length,
          totalPages: 1,
        },
      };
    }

    logger.api('Fetching labels (live API)');
    return apiClient.get<PaginatedResponse<Label>>('/labels', { params });
  }

  /**
   * Get label by ID
   */
  async getById(id: string): Promise<Label> {
    if (isDemoMode()) {
      logger.api(`Fetching label ${id} (demo mode)`);
      await simulateDelay();
      
      const label = demoLabels.find(l => l.id === id) || demoStorage.getById<Label>('labels', id);
      if (!label) throw new Error('Label not found');
      return label;
    }

    logger.api(`Fetching label ${id} (live API)`);
    const response = await apiClient.get<ApiResponse<Label>>(`/labels/${id}`);
    return response.data;
  }

  /**
   * Create new label
   */
  async create(data: CreateLabelRequest): Promise<Label> {
    if (isDemoMode()) {
      logger.api('Creating label (demo mode)');
      await simulateDelay();
      
      const newLabel: Label = {
        id: `label-${Date.now()}`,
        name: data.name,
        contact: data.contact,
        website: data.website,
        artists: 0,
        releases: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      demoStorage.add('labels', newLabel);
      
      return newLabel;
    }

    logger.api('Creating label (live API)');
    const response = await apiClient.post<ApiResponse<Label>>('/labels', data);
    return response.data;
  }

  /**
   * Update label
   */
  async update(id: string, data: Partial<CreateLabelRequest>): Promise<Label> {
    if (isDemoMode()) {
      logger.api(`Updating label ${id} (demo mode)`);
      await simulateDelay();
      
      const label = demoLabels.find(l => l.id === id) || demoStorage.getById<Label>('labels', id);
      if (!label) throw new Error('Label not found');
      
      const updatedLabel = {
        ...label,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const storageLabel = demoStorage.getById<Label>('labels', id);
      if (storageLabel) {
        demoStorage.update('labels', id, updatedLabel);
      }
      
      return updatedLabel;
    }

    logger.api(`Updating label ${id} (live API)`);
    const response = await apiClient.put<ApiResponse<Label>>(`/labels/${id}`, data);
    return response.data;
  }

  /**
   * Delete label
   */
  async delete(id: string): Promise<void> {
    if (isDemoMode()) {
      logger.api(`Deleting label ${id} (demo mode)`);
      await simulateDelay();
      demoStorage.delete('labels', id);
      return;
    }

    logger.api(`Deleting label ${id} (live API)`);
    await apiClient.delete(`/labels/${id}`);
  }
}

export const labelsService = new LabelsService();
