import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { ErrorLogger } from '@/lib/errorLogger';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  hierarchy: number;
  permissions: Record<string, string[]>;
  tenant_id: string;
  is_system: boolean;
}

interface AssignRoleData {
  userId: string;
  roleId: string;
  schoolId?: string;
}

/**
 * Hook para gerenciar roles (cargos)
 * 
 * @param tenantId - ID do tenant
 * 
 * @example
 * const { roles, isLoading, assignRole, removeRole } = useRoles(tenantId);
 */
export function useRoles(tenantId: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  // Query para listar roles
  const rolesQuery = useQuery({
    queryKey: ['roles', tenantId],
    queryFn: async () => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const token = session.access_token;
      const response = await axios.get<Role[]>(`${API_URL}/api/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      });
      return response.data;
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para atribuir role
  const assignRoleMutation = useMutation({
    mutationFn: async (data: AssignRoleData) => {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${API_URL}/api/roles/assign`,
        {
          user_id: data.userId,
          role_id: data.roleId,
          school_id: data.schoolId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      ErrorLogger.success('Cargo atribuído', 'O cargo foi atribuído com sucesso');
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'useRoles.assignRole');
    },
  });

  // Mutation para remover role
  const removeRoleMutation = useMutation({
    mutationFn: async (userRoleId: string) => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const token = session.access_token;
      await axios.delete(`${API_URL}/api/roles/${userRoleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      ErrorLogger.success('Cargo removido', 'O cargo foi removido com sucesso');
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'useRoles.removeRole');
    },
  });

  return {
    roles: rolesQuery.data || [],
    isLoading: rolesQuery.isLoading,
    error: rolesQuery.error,
    refetch: rolesQuery.refetch,
    assignRole: assignRoleMutation.mutate,
    assignRoleAsync: assignRoleMutation.mutateAsync,
    isAssigning: assignRoleMutation.isPending,
    removeRole: removeRoleMutation.mutate,
    removeRoleAsync: removeRoleMutation.mutateAsync,
    isRemoving: removeRoleMutation.isPending,
  };
}
