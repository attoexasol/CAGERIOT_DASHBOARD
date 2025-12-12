/**
 * EXAMPLE SERVICE
 * This file demonstrates the exact pattern for API integration
 * Copy this pattern for all your services
 */

import { API_CONFIG } from "../../config";
import { isDemoMode } from "../../config";
import { logger } from "../../logger";
import { getApiHeaders, handleApiResponse } from "../helpers";
import { simulateDelay } from "../demo-data";

// Example: Releases Service following the exact pattern

export const exampleService = {
  /**
   * GET - List all items
   */
  async list(page: number = 1, limit: number = 10): Promise<any> {
    // Demo mode
    if (isDemoMode()) {
      logger.api("Fetching items (demo mode)");
      await simulateDelay();
      return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }

    // Live API mode
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/items?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: getApiHeaders(true),
        }
      );

      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      logger.error("List items failed:", error);
      throw error;
    }
  },

  /**
   * GET - Get single item by ID
   */
  async getById(id: string): Promise<any> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Fetching item ${id} (demo mode)`);
      await simulateDelay();
      return { id, name: "Demo Item" };
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/items/${id}`, {
        method: "GET",
        headers: getApiHeaders(true),
      });

      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      logger.error(`Get item ${id} failed:`, error);
      throw error;
    }
  },

  /**
   * POST - Create new item
   */
  async create(itemData: any): Promise<any> {
    // Demo mode
    if (isDemoMode()) {
      logger.api("Creating item (demo mode)");
      await simulateDelay();
      return { id: "demo-" + Date.now(), ...itemData };
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/items`, {
        method: "POST",
        headers: getApiHeaders(true),
        body: JSON.stringify(itemData),
      });

      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      logger.error("Create item failed:", error);
      throw error;
    }
  },

  /**
   * PUT - Update existing item
   */
  async update(id: string, itemData: any): Promise<any> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Updating item ${id} (demo mode)`);
      await simulateDelay();
      return { id, ...itemData };
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/items/${id}`, {
        method: "PUT",
        headers: getApiHeaders(true),
        body: JSON.stringify(itemData),
      });

      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      logger.error(`Update item ${id} failed:`, error);
      throw error;
    }
  },

  /**
   * PATCH - Partial update
   */
  async patch(id: string, partialData: any): Promise<any> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Patching item ${id} (demo mode)`);
      await simulateDelay();
      return { id, ...partialData };
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/items/${id}`, {
        method: "PATCH",
        headers: getApiHeaders(true),
        body: JSON.stringify(partialData),
      });

      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      logger.error(`Patch item ${id} failed:`, error);
      throw error;
    }
  },

  /**
   * DELETE - Delete item
   */
  async delete(id: string): Promise<void> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Deleting item ${id} (demo mode)`);
      await simulateDelay();
      return;
    }

    // Live API mode
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/items/${id}`, {
        method: "DELETE",
        headers: getApiHeaders(true),
      });

      await handleApiResponse(response);
    } catch (error) {
      logger.error(`Delete item ${id} failed:`, error);
      throw error;
    }
  },

  /**
   * POST - Upload file
   */
  async uploadFile(file: File, metadata?: any): Promise<any> {
    // Demo mode
    if (isDemoMode()) {
      logger.api("Uploading file (demo mode)");
      await simulateDelay();
      return { uploadId: "demo-upload", status: "completed" };
    }

    // Live API mode
    try {
      const formData = new FormData();
      formData.append("file", file);

      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value)
          );
        });
      }

      const headers: HeadersInit = {};

      // Add Basic Auth if credentials are available
      if (API_CONFIG.API_USERNAME && API_CONFIG.API_PASSWORD) {
        const credentials = btoa(
          `${API_CONFIG.API_USERNAME}:${API_CONFIG.API_PASSWORD}`
        );
        headers["Authorization"] = `Basic ${credentials}`;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/items/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      logger.error("Upload file failed:", error);
      throw error;
    }
  },

  /**
   * GET - Search with query params
   */
  async search(query: string, filters?: any): Promise<any> {
    // Demo mode
    if (isDemoMode()) {
      logger.api(`Searching items (demo mode): ${query}`);
      await simulateDelay();
      return { data: [], total: 0 };
    }

    // Live API mode
    try {
      const params = new URLSearchParams({ q: query });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          params.append(key, String(value));
        });
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/items/search?${params.toString()}`,
        {
          method: "GET",
          headers: getApiHeaders(true),
        }
      );

      const data = await handleApiResponse(response);
      return data;
    } catch (error) {
      logger.error("Search failed:", error);
      throw error;
    }
  },
};

/**
 * USAGE EXAMPLE IN COMPONENTS:
 *
 * import { exampleService } from './lib/api/services/_example.service';
 *
 * const handleCreate = async () => {
 *   try {
 *     const newItem = await exampleService.create({
 *       name: 'New Item',
 *       description: 'Item description'
 *     });
 *     console.log('Created:', newItem);
 *   } catch (error) {
 *     console.error('Failed to create:', error);
 *   }
 * };
 *
 * const handleList = async () => {
 *   try {
 *     const result = await exampleService.list(1, 20);
 *     console.log('Items:', result.data);
 *   } catch (error) {
 *     console.error('Failed to fetch:', error);
 *   }
 * };
 */
