import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { ErrorLogger } from '@/lib/errorLogger';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface PermissionsData {
  permissions: Record<string, string[]>;
  isOwner: boolean;
  hierarchy?: number;
}

interface RoleData {
  id: string;
  name: string;
  slug: string;
}

interface UsePermissionsApiReturn {
  permissions: Record<string, string[]>;
  roles: RoleData[];
  isOwner: boolean;
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}

/**
 * Hook especializado para buscar permissões e roles do usuário
 * Implementa cache e evita re-fetches desnecessários
 * 
 * @param tenantId - ID do tenant
 * @param schoolId - ID da escola (opcional)
 * @param enabled - Se deve fazer fetch automaticamente
 */
export function usePermissionsApi(
  tenantId?: string,
  schoolId?: string,
  enabled: boolean = true
): UsePermissionsApiReturn {
  const { user, session } = useAuth();
  const isAuthenticated = !!user && !!session;
  
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  // Refs para controle de fetch
  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);
  const lastFetchParamsRef = useRef<string>('');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchPermissions = useCallback(async () => {
    // Validações
    if (!enabled || !isAuthenticated || !user || !tenantId) {
      if (mountedRef.current) {
        setLoading(false);
      }
      return;
    }

    // Evitar fetch duplicado
    const currentParams = `${user.id}-${tenantId}-${schoolId || 'none'}`;
    if (isFetchingRef.current || (hasFetchedRef.current && lastFetchParamsRef.current === currentParams)) {
      return;
    }

    isFetchingRef.current = true;
    lastFetchParamsRef.current = currentParams;
    
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      // Obter token da sessão do Supabase
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const token = session.access_token;

      // Buscar permissões e roles em paralelo
      const [permissionsResponse, rolesResponse] = await Promise.all([
        axios.get<PermissionsData>(`${API_URL}/api/permissions/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'X-Skip-Interceptor': 'true', // Não processar no interceptor global
          },
          params: schoolId ? { schoolId } : {},
        }),
        axios.get(`${API_URL}/api/roles/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'X-Skip-Interceptor': 'true', // Não processar no interceptor global
          },
        }).catch(() => ({ data: [] })), // Falha silenciosa para roles
      ]);

      if (mountedRef.current) {
        console.log('[usePermissionsApi] Resposta do backend:', {
          permissions: permissionsResponse.data.permissions,
          isOwner: permissionsResponse.data.isOwner,
          hierarchy: permissionsResponse.data.hierarchy,
          roles: rolesResponse.data,
        });

        setPermissions(permissionsResponse.data.permissions || {});
        setIsOwner(permissionsResponse.data.isOwner || false);
        
        setRoles(
          rolesResponse.data.map((ur: any) => ({
            id: ur.roles?.id || ur.id,
            name: ur.roles?.name || ur.name,
            slug: ur.roles?.slug || ur.slug,
          }))
        );

        hasFetchedRef.current = true;
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err);
        setPermissions({});
        setRoles([]);
        setIsOwner(false);

        // Tratamento de erro específico - APENAS UM TOAST
        // Não mostrar toast para erro 404 em roles (falha silenciosa)
        const isRolesNotFound = err.config?.url?.includes('/api/roles/user/') && err.response?.status === 404;
        
        if (!isRolesNotFound) {
          if (err.response?.status === 401) {
            ErrorLogger.handleAuthError(false);
          } else if (err.response?.status === 403) {
            ErrorLogger.handlePermissionError('permissões', 'carregar');
          } else if (!err.response) {
            ErrorLogger.handleNetworkError();
          } else {
            ErrorLogger.handleApiError(err, 'usePermissionsApi');
          }
        } else {
          // Log silencioso para roles não encontrados
          console.warn('Roles não encontrados para o usuário (esperado em primeira execução)');
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }
  }, [enabled, isAuthenticated, user?.id, tenantId, schoolId, session]);

  // Fetch inicial apenas quando dependências mudarem
  useEffect(() => {
    if (enabled && isAuthenticated && user && tenantId) {
      fetchPermissions();
    }
  }, [enabled, isAuthenticated, user?.id, tenantId, schoolId, fetchPermissions]);

  const refetch = useCallback(async () => {
    hasFetchedRef.current = false;
    await fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    roles,
    isOwner,
    loading,
    error,
    refetch,
  };
}
