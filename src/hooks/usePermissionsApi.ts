import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { ErrorLogger } from '@/lib/errorLogger';
import { getApiUrl } from '@/services/api';

interface PermissionsData {
  permissions: Record<string, string[]>;
  isOwner: boolean;
  hierarchy?: number;
  roles?: any[]; // Roles agora vêm na mesma resposta
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

// Cache global para permissões (persiste entre re-mounts do StrictMode)
const permissionsCache = new Map<string, {
  permissions: Record<string, string[]>;
  roles: RoleData[];
  isOwner: boolean;
  permissionsVersion?: string; // UUID que muda quando permissões são alteradas
  timestamp: number;
}>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos - evita recarregamento ao voltar para a aba

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
  
  // Inicializar com cache se disponível (para evitar loading desnecessário)
  const getInitialCache = () => {
    if (!user || !tenantId) return null;
    const key = `${user.id}-${tenantId}-${schoolId || 'none'}`;
    const cached = permissionsCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return cached;
    }
    return null;
  };

  const initialCache = getInitialCache();
  const [permissions, setPermissions] = useState<Record<string, string[]>>(initialCache?.permissions || {});
  const [roles, setRoles] = useState<RoleData[]>(initialCache?.roles || []);
  const [isOwner, setIsOwner] = useState(initialCache?.isOwner || false);
  // Só mostrar loading se não tiver cache inicial
  const [loading, setLoading] = useState(!initialCache);
  const [error, setError] = useState<any>(null);
  
  // Refs para controle de fetch
  const isFetchingRef = useRef(false);
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

    // Chave do cache
    const currentCacheKey = `${user.id}-${tenantId}-${schoolId || 'none'}`;
    
    // Verificar cache válido
    const cached = permissionsCache.get(currentCacheKey);
    const cacheAge = cached ? Date.now() - cached.timestamp : Infinity;
    const isCacheValid = cached && cacheAge < CACHE_TTL;
    
    if (isCacheValid) {
      // Cache válido - usar dados do cache sem mostrar loading
      if (mountedRef.current) {
        setPermissions(cached.permissions);
        setRoles(cached.roles);
        setIsOwner(cached.isOwner);
        setLoading(false);
      }
      // Se cache está próximo de expirar (últimos 30s), atualizar em background
      if (cacheAge > CACHE_TTL - 30000) {
        // Continuar para fazer fetch em background (sem mostrar loading)
      } else {
        return; // Cache ainda muito fresco, não precisa atualizar
      }
    }

    // Evitar fetch paralelo
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;
    
    // Só mostrar loading se não tiver dados em cache
    if (mountedRef.current) {
      // Se já temos dados (mesmo que do cache antigo), não mostrar loading
      const hasData = Object.keys(permissions).length > 0 || roles.length > 0;
      if (!hasData) {
        setLoading(true);
      }
      setError(null);
    }

    try {
      // Obter token da sessão do Supabase
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const token = session.access_token;

      // Buscar permissões e roles em UMA ÚNICA requisição (unificada)
      const permissionsResponse = await axios.get<PermissionsData>(
        `${getApiUrl()}/api/permissions/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'X-Skip-Interceptor': 'true', // Não processar no interceptor global
          },
          params: schoolId ? { schoolId } : {},
        }
      );

      // Extrair permissions_version do header
      const newPermissionsVersion = permissionsResponse.headers['x-permissions-version'] as string | undefined;
      
      // Verificar se permissions_version mudou (invalida cache se diferente)
      const cachedVersion = cached?.permissionsVersion;
      if (cachedVersion && newPermissionsVersion && cachedVersion !== newPermissionsVersion) {
        console.log('[usePermissionsApi] Permissions version changed, invalidating cache', {
          oldVersion: cachedVersion,
          newVersion: newPermissionsVersion,
        });
        // Invalidar cache - limpar dados antigos
        permissionsCache.delete(currentCacheKey);
      }

      if (mountedRef.current) {
        console.log('[usePermissionsApi] Resposta do backend:', {
          permissions: permissionsResponse.data.permissions,
          isOwner: permissionsResponse.data.isOwner,
          hierarchy: permissionsResponse.data.hierarchy,
          roles: permissionsResponse.data.roles,
          permissionsVersion: newPermissionsVersion,
        });

        const newPermissions = permissionsResponse.data.permissions || {};
        const newIsOwner = permissionsResponse.data.isOwner || false;
        const newRoles = (permissionsResponse.data.roles || []).map((ur: any) => ({
          id: ur.roles?.id || ur.id,
          name: ur.roles?.name || ur.name,
          slug: ur.roles?.slug || ur.slug,
        }));

        setPermissions(newPermissions);
        setIsOwner(newIsOwner);
        setRoles(newRoles);

        // Salvar no cache com permissions_version
        permissionsCache.set(currentCacheKey, {
          permissions: newPermissions,
          roles: newRoles,
          isOwner: newIsOwner,
          permissionsVersion: newPermissionsVersion,
          timestamp: Date.now(),
        });
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err);
        setPermissions({});
        setRoles([]);
        setIsOwner(false);

        // Tratamento de erro específico - APENAS UM TOAST
        if (err.response?.status === 401) {
          ErrorLogger.handleAuthError(false);
        } else if (err.response?.status === 403) {
          ErrorLogger.handlePermissionError('permissões', 'carregar');
        } else if (!err.response) {
          ErrorLogger.handleNetworkError();
        } else {
          ErrorLogger.handleApiError(err, 'usePermissionsApi');
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
    // Limpar cache para forçar novo fetch
    const cacheKey = user ? `${user.id}-${tenantId}-${schoolId || 'none'}` : '';
    if (cacheKey) {
      permissionsCache.delete(cacheKey);
    }
    await fetchPermissions();
  }, [fetchPermissions, user?.id, tenantId, schoolId]);

  return {
    permissions,
    roles,
    isOwner,
    loading,
    error,
    refetch,
  };
}
