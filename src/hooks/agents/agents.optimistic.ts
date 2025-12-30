/**
 * Utilitários para Optimistic Updates de Agents
 * 
 * Optimistic Updates atualizam a UI ANTES da API responder,
 * proporcionando uma experiência mais rápida ao usuário.
 * 
 * Em caso de erro, fazemos rollback para o estado anterior.
 */

import { QueryClient } from '@tanstack/react-query'
import { ErrorLogger } from '@/lib/errorLogger'
import { AgentTemplate } from '@/pages/ia/components/mockData'

/**
 * Gera a query key para agents
 */
export function getAgentsQueryKey(
  tenantSubdomain: string | null,
  schoolId: string | null,
  filters?: { is_template?: boolean }
): unknown[] {
  return ['agents', tenantSubdomain, schoolId, filters]
}

/**
 * Context retornado pelo onMutate para uso no onError (rollback)
 */
export interface OptimisticContext {
  previousAgents?: AgentTemplate[]
  previousAgent?: AgentTemplate
}

// ============================================
// OPTIMISTIC CREATE
// ============================================

/**
 * Callback onMutate para criação otimista de agente
 * Adiciona o agente à lista ANTES da API responder
 */
export async function optimisticCreate(
  queryClient: QueryClient,
  tenantSubdomain: string | null,
  schoolId: string | null,
  newAgentData: Partial<AgentTemplate>,
): Promise<OptimisticContext> {
  // Cancelar refetches em andamento
  await queryClient.cancelQueries({ queryKey: ['agents'] })

  const queryKey = getAgentsQueryKey(tenantSubdomain, schoolId, { is_template: false })
  
  // Snapshot do estado anterior
  const previousAgents = queryClient.getQueryData<AgentTemplate[]>(queryKey)

  // Criar agente temporário com ID otimista
  const optimisticAgent = {
    id: `temp-${Date.now()}`, // ID temporário
    name: newAgentData.name || 'Novo Agente',
    description: newAgentData.description || '',
    category: newAgentData.category || 'academico',
    icon: newAgentData.icon,
    nodes: newAgentData.nodes || [],
    edges: newAgentData.edges || [],
    rating: 0,
    difficulty: 'iniciante',
    useCase: '',
    flow: '',
    tags: [],
    estimatedTime: '',
    categoryTags: [],
    ...newAgentData,
  } as AgentTemplate

  // Adicionar otimisticamente à lista
  queryClient.setQueryData<AgentTemplate[]>(queryKey, (old) => {
    if (!old) return [optimisticAgent]
    return [optimisticAgent, ...old]
  })

  // Toast imediato
  ErrorLogger.success('Criando agente...', 'Salvando suas alterações')

  return { previousAgents }
}

/**
 * Callback onSuccess para criação - atualiza com dados reais da API
 */
export async function onCreateSuccess(
  queryClient: QueryClient,
  tenantSubdomain: string | null,
  schoolId: string | null,
  createdAgent: AgentTemplate,
): Promise<void> {
  const queryKey = getAgentsQueryKey(tenantSubdomain, schoolId, { is_template: false })

  // Substituir agente temporário pelo real
  queryClient.setQueryData<AgentTemplate[]>(queryKey, (old) => {
    if (!old) return [createdAgent]
    // Remove o temporário e adiciona o real
    return old.map((agent) =>
      agent.id.startsWith('temp-') ? createdAgent : agent
    )
  })

  // Invalidar para garantir consistência
  await queryClient.invalidateQueries({ queryKey: ['agents'] })
  
  ErrorLogger.success('Agente criado', 'O agente foi criado com sucesso')
}

/**
 * Callback onError para criação - faz rollback
 */
export function onCreateError(
  queryClient: QueryClient,
  tenantSubdomain: string | null,
  schoolId: string | null,
  context: OptimisticContext | undefined,
  error: any,
): void {
  // Rollback
  if (context?.previousAgents) {
    const queryKey = getAgentsQueryKey(tenantSubdomain, schoolId, { is_template: false })
    queryClient.setQueryData(queryKey, context.previousAgents)
  }
  
  ErrorLogger.handleApiError(error, 'Erro ao criar agente')
}

// ============================================
// OPTIMISTIC UPDATE
// ============================================

/**
 * Callback onMutate para atualização otimista de agente
 */
export async function optimisticUpdate(
  queryClient: QueryClient,
  tenantSubdomain: string | null,
  schoolId: string | null,
  agentId: string,
  updateData: Partial<AgentTemplate>,
): Promise<OptimisticContext> {
  // Cancelar refetches em andamento
  await queryClient.cancelQueries({ queryKey: ['agents'] })
  await queryClient.cancelQueries({ queryKey: ['agent', agentId] })

  const queryKey = getAgentsQueryKey(tenantSubdomain, schoolId, { is_template: false })
  
  // Snapshot do estado anterior
  const previousAgents = queryClient.getQueryData<AgentTemplate[]>(queryKey)
  const previousAgent = queryClient.getQueryData<AgentTemplate>(['agent', agentId, tenantSubdomain, schoolId])

  // Atualizar otimisticamente na lista
  queryClient.setQueryData<AgentTemplate[]>(queryKey, (old) => {
    if (!old) return old
    return old.map((agent) =>
      agent.id === agentId ? { ...agent, ...updateData } : agent
    )
  })

  // Atualizar otimisticamente o agente individual
  if (previousAgent) {
    queryClient.setQueryData(
      ['agent', agentId, tenantSubdomain, schoolId],
      { ...previousAgent, ...updateData }
    )
  }

  // Toast imediato
  ErrorLogger.success('Salvando...', 'Atualizando o agente')

  return { previousAgents, previousAgent }
}

/**
 * Callback onSuccess para atualização
 */
export async function onUpdateSuccess(
  queryClient: QueryClient,
  agentId: string,
): Promise<void> {
  // Invalidar para garantir consistência
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['agents'] }),
    queryClient.invalidateQueries({ queryKey: ['agent', agentId] }),
  ])
  
  ErrorLogger.success('Agente atualizado', 'As alterações foram salvas')
}

/**
 * Callback onError para atualização - faz rollback
 */
export function onUpdateError(
  queryClient: QueryClient,
  tenantSubdomain: string | null,
  schoolId: string | null,
  agentId: string,
  context: OptimisticContext | undefined,
  error: any,
): void {
  // Rollback lista
  if (context?.previousAgents) {
    const queryKey = getAgentsQueryKey(tenantSubdomain, schoolId, { is_template: false })
    queryClient.setQueryData(queryKey, context.previousAgents)
  }
  
  // Rollback agente individual
  if (context?.previousAgent) {
    queryClient.setQueryData(
      ['agent', agentId, tenantSubdomain, schoolId],
      context.previousAgent
    )
  }
  
  ErrorLogger.handleApiError(error, 'Erro ao atualizar agente')
}

// ============================================
// OPTIMISTIC DELETE
// ============================================

/**
 * Callback onMutate para deleção otimista de agente
 * Remove o agente da lista ANTES da API responder
 */
export async function optimisticDelete(
  queryClient: QueryClient,
  tenantSubdomain: string | null,
  schoolId: string | null,
  agentId: string,
): Promise<OptimisticContext> {
  // Cancelar refetches em andamento
  await queryClient.cancelQueries({ queryKey: ['agents'] })

  const queryKey = getAgentsQueryKey(tenantSubdomain, schoolId, { is_template: false })
  
  // Snapshot do estado anterior
  const previousAgents = queryClient.getQueryData<AgentTemplate[]>(queryKey)

  // Remover otimisticamente da lista
  queryClient.setQueryData<AgentTemplate[]>(queryKey, (old) => {
    if (!old) return old
    return old.filter((agent) => agent.id !== agentId)
  })

  // Toast imediato
  ErrorLogger.success('Agente removido', 'O agente foi deletado')

  return { previousAgents }
}

/**
 * Callback onSuccess para deleção
 */
export async function onDeleteSuccess(
  queryClient: QueryClient,
): Promise<void> {
  // Invalidar para garantir consistência
  await queryClient.invalidateQueries({ queryKey: ['agents'] })
}

/**
 * Callback onError para deleção - faz rollback
 */
export function onDeleteError(
  queryClient: QueryClient,
  tenantSubdomain: string | null,
  schoolId: string | null,
  context: OptimisticContext | undefined,
  error: any,
): void {
  // Rollback
  if (context?.previousAgents) {
    const queryKey = getAgentsQueryKey(tenantSubdomain, schoolId, { is_template: false })
    queryClient.setQueryData(queryKey, context.previousAgents)
  }
  
  ErrorLogger.handleApiError(error, 'useAgents.deleteAgent')
}
