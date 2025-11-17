/**
 * API Client Configuration
 * Base configuration for all API requests with support for demo and live modes
 */

import { config, isDemoMode } from '../config';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private apiKey: string;
  private timeout: number;

  constructor(baseURL: string, apiKey: string, timeout: number) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.timeout = timeout;
    
    // Try to get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add API key if in live mode and key is available
    if (!isDemoMode() && this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    // Add auth token if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new ApiError(
        error.message || `HTTP ${response.status}`,
        response.status,
        error
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }

  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      });
    }

    const headers: HeadersInit = {};
    
    // Add API key if in live mode
    if (!isDemoMode() && this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }
}

// Create API client instance with configuration
export const apiClient = new ApiClient(
  config.api.baseUrl,
  config.api.apiKey,
  config.api.timeout
);

// Log current mode on startup
if (typeof window !== 'undefined') {
  console.log(
    ` Cage Riot API Client initialized in ${isDemoMode() ? 'DEMO' : 'LIVE'} mode`
  );
}
