/**
 * API Helper Functions
 * Utilities for making API requests with proper headers and response handling
 */

import { API_CONFIG } from "../config";
import { logger } from "../logger";

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * Set authentication token in localStorage
 */
export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

/**
 * Get API headers
 * @param includeAuth - Whether to include Authorization header
 */
export function getApiHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "apikey": `${API_CONFIG.API_KEY}`,
    "version": "2",
  };

  // Add API key if configured and in live mode
  if (API_CONFIG.USE_LIVE_API && API_CONFIG.API_KEY) {
    headers["apikey"] = API_CONFIG.API_KEY;
  }

  // Add auth token if requested
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Handle API response
 * @param response - Fetch response object
 */
export async function handleApiResponse<T = any>(
  response: Response
): Promise<T> {
  // Check if response is ok
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An error occurred",
    }));

    const error = new Error(errorData.message || `HTTP ${response.status}`);
    (error as any).status = response.status;
    (error as any).data = errorData;

    logger.error("API Error:", error);
    throw error;
  }

  // Parse JSON response
  const data = await response.json();
  return data;
}

/**
 * Handle API errors
 * @param error - Error object
 */
export function handleApiError(error: any): never {
  logger.error("API request failed:", error);

  // Check if user is unauthorized
  if (error.status === 401) {
    // Clear token and redirect to login
    setAuthToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  throw error;
}

/**
 * Make GET request
 */
export async function apiGet<T = any>(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  try {
    // Build URL with query params
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getApiHeaders(true),
    });

    return await handleApiResponse<T>(response);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Make POST request
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  includeAuth: boolean = true
): Promise<T> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getApiHeaders(includeAuth),
      body: body ? JSON.stringify(body) : undefined,
    });

    return await handleApiResponse<T>(response);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Make PUT request
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: any
): Promise<T> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getApiHeaders(true),
      body: body ? JSON.stringify(body) : undefined,
    });

    return await handleApiResponse<T>(response);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Make PATCH request
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: any
): Promise<T> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getApiHeaders(true),
      body: body ? JSON.stringify(body) : undefined,
    });

    return await handleApiResponse<T>(response);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Make DELETE request
 */
export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getApiHeaders(true),
    });

    return await handleApiResponse<T>(response);
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Upload file
 */
export async function apiUpload<T = any>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<T> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      });
    }

    const headers: HeadersInit = {};

    // Add API key if in live mode
    if (API_CONFIG.USE_LIVE_API && API_CONFIG.API_KEY) {
      headers["X-API-Key"] = API_CONFIG.API_KEY;
    }

    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    return await handleApiResponse<T>(response);
  } catch (error) {
    handleApiError(error);
  }
}
