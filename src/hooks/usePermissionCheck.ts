import { usePermissions } from './usePermissions';

/**
 * Hook simplificado para verificar uma permissão específica
 * 
 * @param resource - Recurso (ex: 'schools', 'users')
 * @param action - Ação (ex: 'create', 'read', 'update', 'delete')
 * 
 * @example
 * const { hasPermission, loading } = usePermissionCheck('schools', 'create');
 * 
 * if (loading) return <Loader />;
 * if (!hasPermission) return <AccessDenied />;
 */
export function usePermissionCheck(resource: string, action: string) {
  const { can, loading } = usePermissions();

  return {
    hasPermission: can(resource, action),
    loading,
  };
}
