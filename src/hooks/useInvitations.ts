import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { ErrorLogger } from '@/lib/errorLogger';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Invitation {
  id: string;
  email: string;
  role_id: string;
  tenant_id: string;
  school_id?: string;
  status: 'pending' | 'accepted' | 'cancelled' | 'expired';
  invited_by: string;
  created_at: string;
  expires_at: string;
}

interface CreateInvitationData {
  email: string;
  role_id: string;
  school_id?: string;
}

/**
 * Hook para gerenciar convites
 * 
 * @param tenantId - ID do tenant
 * 
 * @example
 * const { invitations, isLoading, createInvitation, cancelInvitation } = useInvitations(tenantId);
 */
export function useInvitations(tenantId: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  // Query para listar convites
  const invitationsQuery = useQuery({
    queryKey: ['invitations', tenantId],
    queryFn: async () => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const token = session.access_token;
      const response = await axios.get<Invitation[]>(
        `${API_URL}/api/invitations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
          },
        }
      );
      return response.data;
    },
    enabled: !!tenantId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // Mutation para criar convite
  const createInvitationMutation = useMutation({
    mutationFn: async (data: CreateInvitationData) => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const token = session.access_token;
      const response = await axios.post(
        `${API_URL}/api/invitations`,
        data,
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
      queryClient.invalidateQueries({ queryKey: ['invitations', tenantId] });
      ErrorLogger.success('Convite enviado!', 'O usuário receberá um email com instruções');
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'useInvitations.create');
    },
  });

  // Mutation para cancelar convite
  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const token = await getAccessTokenSilently();
      await axios.post(
        `${API_URL}/api/invitations/${invitationId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', tenantId] });
      ErrorLogger.success('Convite cancelado', 'O convite foi cancelado com sucesso');
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'useInvitations.cancel');
    },
  });

  // Mutation para aceitar convite
  const acceptInvitationMutation = useMutation({
    mutationFn: async (token: string) => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const authToken = session.access_token;
      const response = await axios.post(
        `${API_URL}/api/invitations/accept`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      ErrorLogger.success('Convite aceito!', 'Você agora tem acesso à instituição');
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'useInvitations.accept');
    },
  });

  return {
    invitations: invitationsQuery.data || [],
    isLoading: invitationsQuery.isLoading,
    error: invitationsQuery.error,
    refetch: invitationsQuery.refetch,
    createInvitation: createInvitationMutation.mutate,
    createInvitationAsync: createInvitationMutation.mutateAsync,
    isCreating: createInvitationMutation.isPending,
    cancelInvitation: cancelInvitationMutation.mutate,
    cancelInvitationAsync: cancelInvitationMutation.mutateAsync,
    isCancelling: cancelInvitationMutation.isPending,
    acceptInvitation: acceptInvitationMutation.mutate,
    acceptInvitationAsync: acceptInvitationMutation.mutateAsync,
    isAccepting: acceptInvitationMutation.isPending,
  };
}
