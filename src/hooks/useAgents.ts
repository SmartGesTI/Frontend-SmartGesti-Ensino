import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSchool } from '@/contexts/SchoolContext'
import { useAccessToken } from '@/hooks/useAccessToken'
import { AgentsService, AgentFilters, CreateAgentData, UpdateAgentData } from '@/services/agents.service'
import { mapApiAgentToTemplate } from '@/services/agents.utils'
import { ErrorLogger } from '@/lib/errorLogger'
import { getTenantFromSubdomain } from '@/lib/tenant'

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
    staleTime: 5 * 60 * 1000, // 5 minutos
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
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

/**
 * Hook para criar agente
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      ErrorLogger.success('Agente criado', 'O agente foi criado com sucesso')
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'useAgents.createAgent')
    },
  })
}

/**
 * Hook para atualizar agente
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['agent', variables.agentId] })
      ErrorLogger.success('Agente atualizado', 'O agente foi atualizado com sucesso')
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'useAgents.updateAgent')
    },
  })
}

/**
 * Hook para deletar agente
 */
export function useDeleteAgent() {
  const { token } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (agentId: string) => {
      if (!token || !tenantSubdomain) {
        throw new Error('Token ou tenant não disponível')
      }

      await AgentsService.deleteAgent(token, agentId, tenantSubdomain)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      ErrorLogger.success('Agente deletado', 'O agente foi deletado com sucesso')
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'useAgents.deleteAgent')
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
