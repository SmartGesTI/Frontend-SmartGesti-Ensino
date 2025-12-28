import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios, { AxiosRequestConfig } from 'axios';
import { ErrorLogger } from '@/lib/errorLogger';

interface UseApiOptions {
  retry?: number;
  retryDelay?: number;
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Hook genérico para chamadas de API com autenticação automática
 * 
 * @example
 * const { data, loading, error, refetch } = useApi<User[]>('/api/users', {
 *   retry: 2,
 *   enabled: true
 * });
 */
export function useApi<T = any>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {
    retry = 1,
    retryDelay = 1000,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const { session, user } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  
  // Ref para evitar múltiplas chamadas simultâneas
  const isFetchingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(async (attempt = 0) => {
    if (!enabled || !user || !session || isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Obter token da sessão do Supabase
      const token = session.access_token;

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}${endpoint}`, config);

      if (mountedRef.current) {
        setData(response.data);
        setError(null);
        onSuccess?.(response.data);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err);
        
        // Retry logic
        if (attempt < retry && err.response?.status !== 401 && err.response?.status !== 403) {
          setTimeout(() => {
            fetchData(attempt + 1);
          }, retryDelay * (attempt + 1));
          return;
        }

        onError?.(err);
        ErrorLogger.handleApiError(err, `useApi(${endpoint})`);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }
  }, [endpoint, enabled, user, session, retry, retryDelay, onSuccess, onError]);

  // Fetch inicial
  useEffect(() => {
    if (enabled && user && session) {
      fetchData();
    }
  }, [enabled, user, session, endpoint, fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(0);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
