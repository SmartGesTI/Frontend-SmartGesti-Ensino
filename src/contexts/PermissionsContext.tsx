import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { usePermissionsApi } from '@/hooks/usePermissionsApi';
import { checkPermission, checkRole } from '@/lib/permissions.utils';

interface PermissionsContextType {
  permissions: Record<string, string[]>;
  isOwner: boolean;
  loading: boolean;
  can: (resource: string, action: string) => boolean;
  hasRole: (roleSlug: string) => boolean;
  roles: Array<{ id: string; name: string; slug: string }>;
  refetch: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined,
);

interface PermissionsProviderProps {
  children: React.ReactNode;
  tenantId?: string;
  schoolId?: string;
}

/**
 * Provider de permissões otimizado para evitar re-renders
 * 
 * Mudanças principais:
 * - Usa usePermissionsApi hook que implementa cache e evita fetches duplicados
 * - Funções can e hasRole são memoizadas com useMemo
 * - Refetch é memoizado com useCallback
 * - Não há useEffect que dispara múltiplas vezes
 */
export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  children,
  tenantId,
  schoolId,
}) => {
  // Hook otimizado que gerencia fetch e cache
  const {
    permissions,
    roles,
    isOwner,
    loading,
    refetch,
  } = usePermissionsApi(tenantId, schoolId, true);

  // Memoizar função can para evitar re-renders
  const can = useCallback(
    (resource: string, action: string): boolean => {
      return checkPermission(permissions, resource, action, isOwner);
    },
    [permissions, isOwner]
  );

  // Memoizar função hasRole para evitar re-renders
  const hasRole = useCallback(
    (roleSlug: string): boolean => {
      return checkRole(roles, roleSlug);
    },
    [roles]
  );

  // Memoizar o value do context para evitar re-renders desnecessários
  const contextValue = useMemo(
    () => ({
      permissions,
      isOwner,
      loading,
      can,
      hasRole,
      roles,
      refetch,
    }),
    [permissions, isOwner, loading, can, hasRole, roles, refetch]
  );

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error(
      'usePermissions deve ser usado dentro de um PermissionsProvider',
    );
  }
  return context;
};
