/**
 * React Hook for API calls
 * Provides loading states, error handling, and automatic retries
 */

import { useState, useCallback, useEffect } from 'react';
import { logger } from '../lib/logger';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  autoRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retrying: boolean;
  retryCount: number;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const {
    onSuccess,
    onError,
    autoRetry = false,
    maxRetries = 3,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    retrying: false,
    retryCount: 0,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        retrying: false,
      }));

      let lastError: Error | null = null;
      let attempt = 0;

      while (attempt <= (autoRetry ? maxRetries : 0)) {
        try {
          logger.api(`API call attempt ${attempt + 1}`);
          const result = await apiFunction(...args);

          setState({
            data: result,
            loading: false,
            error: null,
            retrying: false,
            retryCount: attempt,
          });

          onSuccess?.(result);
          return result;
        } catch (error: any) {
          lastError = error;
          logger.error(`API call failed (attempt ${attempt + 1})`, error);

          if (attempt < maxRetries && autoRetry) {
            attempt++;
            setState(prev => ({
              ...prev,
              retrying: true,
              retryCount: attempt,
            }));

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          } else {
            break;
          }
        }
      }

      // All retries failed
      setState({
        data: null,
        loading: false,
        error: lastError,
        retrying: false,
        retryCount: attempt,
      });

      onError?.(lastError!);
      throw lastError;
    },
    [apiFunction, onSuccess, onError, autoRetry, maxRetries, retryDelay]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      retrying: false,
      retryCount: 0,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for automatic API calls on mount
 */
export function useApiOnMount<T = any>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions & { skip?: boolean } = {}
) {
  const { skip = false, ...apiOptions } = options;
  const api = useApi<T>(apiFunction, apiOptions);

  useEffect(() => {
    if (!skip) {
      api.execute();
    }
  }, [skip]);

  return api;
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApi<T = any>(
  apiFunction: (page: number, limit: number) => Promise<{ data: T[]; pagination: any }>,
  initialPage: number = 1,
  initialLimit: number = 10,
  options: UseApiOptions = {}
) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  
  const api = useApi(
    () => apiFunction(page, limit),
    options
  );

  const nextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page
  }, []);

  // Refetch when page or limit changes
  useEffect(() => {
    api.execute();
  }, [page, limit]);

  return {
    ...api,
    page,
    limit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
  };
}
