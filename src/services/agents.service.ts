import axios from 'axios'
import { getApiUrl } from './api'
import { ApiAgent } from './agents.utils'

export interface AgentFilters {
  category?: string
  type?: string
  is_template?: boolean
  search?: string
}

export interface CreateAgentData {
  name: string
  description?: string
  icon?: string
  category: 'academico' | 'financeiro' | 'rh' | 'administrativo'
  workflow: {
    nodes: any[]
    edges: Array<{ id: string; source: string; target: string }>
  }
  rating?: number
  difficulty?: 'iniciante' | 'intermediario' | 'avancado'
  use_case?: string
  flow?: string
  tags?: string[]
  estimated_time?: string
  category_tags?: string[]
  type?: 'public_school' | 'public_editable' | 'private' | 'restricted'
  visibility?: 'public' | 'private' | 'restricted'
  settings?: Record<string, any>
  is_active?: boolean
  is_template?: boolean
  school_id?: string
}

export interface UpdateAgentData extends Partial<CreateAgentData> {}

/**
 * Serviço para gerenciar agentes de IA
 */
export class AgentsService {
  /**
   * Lista todos os agentes (filtrado por permissões)
   */
  static async getAgents(
    token: string,
    tenantId: string,
    schoolId?: string,
    filters?: AgentFilters
  ): Promise<ApiAgent[]> {
    const params = new URLSearchParams()
    
    if (filters?.category) {
      params.append('category', filters.category)
    }
    if (filters?.type) {
      params.append('type', filters.type)
    }
    if (filters?.is_template !== undefined) {
      params.append('is_template', String(filters.is_template))
    }
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (schoolId) {
      params.append('schoolId', schoolId)
    }

    const queryString = params.toString()
    const url = `${getApiUrl()}/api/agents${queryString ? `?${queryString}` : ''}`

    try {
      const response = await axios.get<ApiAgent[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
          ...(schoolId && { 'x-school-id': schoolId }),
        },
      })
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(
          `Rota não encontrada: ${url}. Verifique se o backend está rodando e se a rota /api/agents está configurada corretamente.`
        )
      }
      throw error
    }
  }

  /**
   * Busca um agente específico
   */
  static async getAgent(
    token: string,
    agentId: string,
    tenantId: string,
    schoolId?: string
  ): Promise<ApiAgent> {
    const params = new URLSearchParams()
    if (schoolId) {
      params.append('schoolId', schoolId)
    }

    const queryString = params.toString()
    const url = `${getApiUrl()}/api/agents/${agentId}${queryString ? `?${queryString}` : ''}`

    const response = await axios.get<ApiAgent>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
        ...(schoolId && { 'x-school-id': schoolId }),
      },
    })
    return response.data
  }

  /**
   * Cria um novo agente
   */
  static async createAgent(
    token: string,
    tenantId: string,
    data: CreateAgentData
  ): Promise<ApiAgent> {
    const response = await axios.post<ApiAgent>(
      `${getApiUrl()}/api/agents`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    )
    return response.data
  }

  /**
   * Atualiza um agente
   */
  static async updateAgent(
    token: string,
    agentId: string,
    tenantId: string,
    data: UpdateAgentData,
    schoolId?: string
  ): Promise<ApiAgent> {
    const params = new URLSearchParams()
    if (schoolId) {
      params.append('schoolId', schoolId)
    }

    const queryString = params.toString()
    const url = `${getApiUrl()}/api/agents/${agentId}${queryString ? `?${queryString}` : ''}`

    const response = await axios.put<ApiAgent>(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
        ...(schoolId && { 'x-school-id': schoolId }),
      },
    })
    return response.data
  }

  /**
   * Deleta um agente
   */
  static async deleteAgent(
    token: string,
    agentId: string,
    tenantId: string
  ): Promise<void> {
    await axios.delete(`${getApiUrl()}/api/agents/${agentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
    })
  }

  /**
   * Executa um agente
   */
  static async executeAgent(
    token: string,
    agentId: string,
    tenantId: string,
    params: Record<string, any>,
    schoolId?: string
  ): Promise<any> {
    const queryParams = new URLSearchParams()
    if (schoolId) {
      queryParams.append('schoolId', schoolId)
    }

    const queryString = queryParams.toString()
    const url = `${getApiUrl()}/api/agents/${agentId}/execute${queryString ? `?${queryString}` : ''}`

    const response = await axios.post(url, params, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
        ...(schoolId && { 'x-school-id': schoolId }),
      },
    })
    return response.data
  }

  /**
   * Executa um nó de IA individual
   */
  static async executeNode(
    token: string,
    tenantId: string,
    node: any,
    inputData: any,
    instructions?: string,
    options?: { maxLines?: number; executionModel?: string },
    schoolId?: string
  ): Promise<any> {
    const queryParams = new URLSearchParams()
    if (schoolId) {
      queryParams.append('schoolId', schoolId)
    }

    const queryString = queryParams.toString()
    const url = `${getApiUrl()}/api/agents/execute-node${queryString ? `?${queryString}` : ''}`

    const response = await axios.post(url, {
      node,
      inputData,
      instructions,
      options,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
        ...(schoolId && { 'x-school-id': schoolId }),
      },
    })
    return response.data
  }

  /**
   * Renderiza PDF padronizado a partir de Markdown (backend/Puppeteer)
   */
  static async renderPdfFromMarkdown(
    token: string,
    tenantId: string,
    markdown: string,
    fileName: string = 'relatorio.pdf',
    schoolId?: string
  ): Promise<{ success: boolean; file: { data: string; fileName: string; mimeType: string } }> {
    const queryParams = new URLSearchParams()
    if (schoolId) {
      queryParams.append('schoolId', schoolId)
    }

    const queryString = queryParams.toString()
    const url = `${getApiUrl()}/api/agents/render-pdf${queryString ? `?${queryString}` : ''}`

    const response = await axios.post(url, { markdown, fileName }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
        ...(schoolId && { 'x-school-id': schoolId }),
      },
    })

    return response.data
  }
}
