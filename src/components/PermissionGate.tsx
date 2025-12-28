import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionGateProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  fallback?: React.ReactNode;
  requireOwner?: boolean;
  requireRole?: string;
}

/**
 * Componente para controlar a visibilidade de elementos baseado em permissões
 * 
 * @example
 * <PermissionGate resource="schools" action="create">
 *   <Button>Nova Escola</Button>
 * </PermissionGate>
 * 
 * @example
 * <PermissionGate requireOwner>
 *   <Button>Transferir Propriedade</Button>
 * </PermissionGate>
 * 
 * @example
 * <PermissionGate requireRole="admin">
 *   <AdminPanel />
 * </PermissionGate>
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  resource,
  action,
  fallback = null,
  requireOwner = false,
  requireRole,
}) => {
  const { can, isOwner, hasRole, loading } = usePermissions();

  // Enquanto carrega, não mostrar nada
  if (loading) {
    return null;
  }

  // Verificar se requer ser proprietário
  if (requireOwner && !isOwner) {
    console.log(`[PermissionGate] Acesso negado: requer proprietário`, { isOwner });
    return <>{fallback}</>;
  }

  // Verificar se requer cargo específico
  if (requireRole && !hasRole(requireRole)) {
    console.log(`[PermissionGate] Acesso negado: requer cargo ${requireRole}`);
    return <>{fallback}</>;
  }

  // Verificar permissão específica
  if (resource && action) {
    const hasPermission = can(resource, action);
    console.log(`[PermissionGate] Verificando ${resource}:${action}`, {
      hasPermission,
      isOwner,
    });
    
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

/**
 * Componente para mostrar conteúdo apenas para proprietários
 */
export const OwnerOnly: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => {
  const { isOwner, loading } = usePermissions();

  if (loading) return null;
  if (!isOwner) return <>{fallback}</>;

  return <>{children}</>;
};

/**
 * Componente para mostrar conteúdo apenas para um cargo específico
 */
export const RoleOnly: React.FC<{
  children: React.ReactNode;
  role: string;
  fallback?: React.ReactNode;
}> = ({ children, role, fallback = null }) => {
  const { hasRole, loading } = usePermissions();

  if (loading) return null;
  if (!hasRole(role)) return <>{fallback}</>;

  return <>{children}</>;
};
