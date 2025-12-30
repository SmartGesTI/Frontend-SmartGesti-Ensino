import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSchool } from '@/contexts/SchoolContext'
import { useAccessToken } from '@/hooks/useAccessToken'
import { AgentsService, AgentFilters, CreateAgentData, UpdateAgentData } from '@/services/agents.service'
import { mapApiAgentToTemplate } from '@/services/agents.utils'
import { ErrorLogger } from '@/lib/errorLogger'
import { getTenantFromSubdomain } from '@/lib/tenant'
import {
  optimisticCreate,
  onCreateSuccess,
  onCreateError,
  optimisticUpdate,
  onUpdateSuccess,
  onUpdateError,
  optimisticDelete,
  onDeleteSuccess,
  onDeleteError,
  OptimisticContext,
} from './agents/agents.optimistic'

/**
 * Hook para listar agentes
 */
export function useAgents(filters?: AgentFilters) {
  const { schoolId } = useSchool()
  const { token, isReady } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()

  return useQuery({
    queryKey: ['agents', tenantSubdomain, schoolId, filters],
    queryFn: async () => {
      if (!token || !tenantSubdomain) {
        throw new Error('Token ou tenant não disponível')
      }

      // O backend tem um TenantIdInterceptor que converte subdomain para tenantId automaticamente
      // Podemos passar o subdomain diretamente no header x-tenant-id
      const agents = await AgentsService.getAgents(
        token,
        tenantSubdomain, // O interceptor converte subdomain para tenantId
        schoolId || undefined,
        filters
      )

      // Converter para formato AgentTemplate
      return agents.map(mapApiAgentToTemplate)
    },
    enabled: isReady && !!token && !!tenantSubdomain,
    staleTime: 0, // Sempre buscar dados frescos da API
    refetchOnMount: 'always', // Sempre refetch ao montar componente
    retry: 1,
  })
}

/**
 * Hook para buscar um agente específico
 */
export function useAgent(agentId: string | null) {
  const { schoolId } = useSchool()
  const { token, isReady } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()

  return useQuery({
    queryKey: ['agent', agentId, tenantSubdomain, schoolId],
    queryFn: async () => {
      if (!agentId || !token || !tenantSubdomain) {
        throw new Error('Parâmetros inválidos')
      }

      // O backend tem um TenantIdInterceptor que converte subdomain para tenantId automaticamente
      const agent = await AgentsService.getAgent(
        token,
        agentId,
        tenantSubdomain, // O interceptor converte subdomain para tenantId
        schoolId || undefined
      )

      return mapApiAgentToTemplate(agent)
    },
    enabled: isReady && !!token && !!tenantSubdomain && !!agentId,
    staleTime: 0, // Sempre buscar dados frescos da API
    refetchOnMount: 'always',
    retry: 1,
  })
}

/**
 * Hook para criar agente
 * USA OPTIMISTIC UPDATE - feedback imediato ao usuário
 */
export function useCreateAgent() {
  const { schoolId } = useSchool()
  const { token } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAgentData) => {
      if (!token || !tenantSubdomain) {
        throw new Error('Token ou tenant não disponível')
      }

      const agent = await AgentsService.createAgent(
        token,
        tenantSubdomain,
        {
          ...data,
          school_id: schoolId || undefined,
        }
      )

      return mapApiAgentToTemplate(agent)
    },
    // OPTIMISTIC: Toast imediato no onMutate
    onMutate: async (data: CreateAgentData) => {
      return optimisticCreate(queryClient, tenantSubdomain, schoolId, data as any)
    },
    onSuccess: async (createdAgent) => {
      await onCreateSuccess(queryClient, tenantSubdomain, schoolId, createdAgent)
    },
    onError: (error: any, _data, context) => {
      onCreateError(queryClient, tenantSubdomain, schoolId, context as OptimisticContext, error)
    },
  })
}

/**
 * Hook para atualizar agente
 * USA OPTIMISTIC UPDATE - feedback imediato ao usuário
 */
export function useUpdateAgent() {
  const { schoolId } = useSchool()
  const { token } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ agentId, data }: { agentId: string; data: UpdateAgentData }) => {
      if (!token || !tenantSubdomain) {
        throw new Error('Token ou tenant não disponível')
      }

      const agent = await AgentsService.updateAgent(
        token,
        agentId,
        tenantSubdomain,
        data,
        schoolId || undefined
      )

      return mapApiAgentToTemplate(agent)
    },
    // OPTIMISTIC: Toast imediato no onMutate
    onMutate: async ({ agentId, data }) => {
      return optimisticUpdate(queryClient, tenantSubdomain, schoolId, agentId, data as any)
    },
    onSuccess: async (_, variables) => {
      await onUpdateSuccess(queryClient, variables.agentId)
    },
    onError: (error: any, variables, context) => {
      onUpdateError(queryClient, tenantSubdomain, schoolId, variables.agentId, context as OptimisticContext, error)
    },
  })
}

/**
 * Hook para deletar agente
 * USA OPTIMISTIC UPDATE - o card desaparece imediatamente
 */
export function useDeleteAgent() {
  const { token } = useAccessToken()
  const { schoolId } = useSchool()
  const tenantSubdomain = getTenantFromSubdomain()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (agentId: string) => {
      if (!token || !tenantSubdomain) {
        throw new Error('Token ou tenant não disponível')
      }

      await AgentsService.deleteAgent(token, agentId, tenantSubdomain)
      return agentId
    },
    // OPTIMISTIC: Remove da lista e mostra toast IMEDIATAMENTE
    onMutate: async (agentId: string) => {
      return optimisticDelete(queryClient, tenantSubdomain, schoolId, agentId)
    },
    onSuccess: async () => {
      await onDeleteSuccess(queryClient)
    },
    onError: (error: any, _agentId, context) => {
      onDeleteError(queryClient, tenantSubdomain, schoolId, context as OptimisticContext, error)
    },
  })
}

/**
 * Hook para executar agente
 */
export function useExecuteAgent() {
  const { schoolId } = useSchool()
  const { token } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()

  return useMutation({
    mutationFn: async ({ agentId, params }: { agentId: string; params: Record<string, any> }) => {
      if (!token || !tenantSubdomain) {
        throw new Error('Token ou tenant não disponível')
      }

      return AgentsService.executeAgent(
        token,
        agentId,
        tenantSubdomain,
        params,
        schoolId || undefined
      )
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'useAgents.executeAgent')
    },
  })
}
