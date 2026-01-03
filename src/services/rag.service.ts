import axios from 'axios'
import { getApiUrl, getAccessToken } from './api'
import { getTenantFromSubdomain } from '@/lib/tenant'

export interface RagSearchResult {
  id: string
  documentId: string
  content: string
  sectionTitle: string
  similarity: number
  document: {
    id: string
    title: string
    category: string
    routePattern: string | null
    menuPath: string | null
    tags: string[]
  }
  metadata: Record<string, any>
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Dados do agente retornados quando a tool get_agent_details é usada
export interface AgentDataFromRag {
  id: string
  name: string
  description: string
  category: string
  useCase?: string
  difficulty?: string
  estimatedTime?: string
  tags?: string[]
  visibility?: string
  howItHelps?: string
  bestUses?: string[]
  canRenderFlow: boolean
  nodes?: any[]
  edges?: any[]
}

export interface RagAskResponse {
  success: boolean
  question: string
  answer: string
  hasHistory?: boolean
  usedTools?: string[]
  agentData?: AgentDataFromRag
}

export interface RagFeedbackResponse {
  success: boolean
  feedbackId?: string
  feedbackType: 'like' | 'dislike'
}

export interface RagFeedbackStats {
  success: boolean
  totalLikes: number
  totalDislikes: number
  total: number
}

export interface RagSearchResponse {
  success: boolean
  query: string
  totalResults: number
  results: RagSearchResult[]
}

export interface RagStatusResponse {
  totalDocuments: number
  totalChunks: number
  categoryCounts: Record<string, number>
  lastUpdated: string | null
}

export interface RagStreamingEvent {
  type: 'token' | 'tool_call' | 'tool_result' | 'done' | 'error' | 'thinking'
  data: any
  timestamp?: number
}

class RagService {
  private async getHeaders(schoolId?: string): Promise<Record<string, string>> {
    const token = await getAccessToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const subdomain = getTenantFromSubdomain()
    if (subdomain) {
      headers['x-tenant-id'] = subdomain
    }

    // Adicionar school_id para filtrar agentes corretamente
    if (schoolId) {
      headers['x-school-id'] = schoolId
    }

    return headers
  }

  /**
   * Faz uma pergunta ao assistente RAG (com histórico opcional)
   */
  async ask(
    question: string,
    history?: ChatMessage[],
    schoolId?: string,
  ): Promise<RagAskResponse> {
    const headers = await this.getHeaders(schoolId)
    const response = await axios.post<RagAskResponse>(
      `${getApiUrl()}/api/rag/ask`,
      { question, history },
      { headers },
    )
    return response.data
  }

  /**
   * Regenera uma resposta
   */
  async regenerate(
    question: string,
    history?: ChatMessage[],
  ): Promise<RagAskResponse> {
    const headers = await this.getHeaders()
    const response = await axios.post<RagAskResponse>(
      `${getApiUrl()}/api/rag/regenerate`,
      { question, history },
      { headers },
    )
    return response.data
  }

  /**
   * Envia feedback (like/dislike)
   */
  async sendFeedback(data: {
    messageId: string
    question: string
    answer: string
    feedbackType: 'like' | 'dislike'
    comment?: string
    sources?: any[]
    conversationHistory?: ChatMessage[]
  }): Promise<RagFeedbackResponse> {
    const headers = await this.getHeaders()
    const response = await axios.post<RagFeedbackResponse>(
      `${getApiUrl()}/api/rag/feedback`,
      data,
      { headers },
    )
    return response.data
  }

  /**
   * Obtém estatísticas de feedback
   */
  async getFeedbackStats(): Promise<RagFeedbackStats> {
    const headers = await this.getHeaders()
    const response = await axios.get<RagFeedbackStats>(
      `${getApiUrl()}/api/rag/feedback/stats`,
      { headers },
    )
    return response.data
  }

  /**
   * Busca na knowledge base
   */
  async search(
    query: string,
    options?: {
      category?: string
      topK?: number
      tags?: string[]
    },
  ): Promise<RagSearchResponse> {
    const headers = await this.getHeaders()
    const response = await axios.post<RagSearchResponse>(
      `${getApiUrl()}/api/rag/search`,
      {
        query,
        ...options,
      },
      { headers },
    )
    return response.data
  }

  /**
   * Obtém status da knowledge base
   */
  async getStatus(): Promise<RagStatusResponse> {
    const headers = await this.getHeaders()
    const response = await axios.get<RagStatusResponse>(
      `${getApiUrl()}/api/rag/status`,
      { headers },
    )
    return response.data
  }

  /**
   * Faz uma pergunta com streaming via SSE
   */
  async streamAsk(
    question: string,
    onEvent: (event: RagStreamingEvent) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void,
    schoolId?: string,
  ): Promise<() => void> {
    const token = await getAccessToken()
    const subdomain = getTenantFromSubdomain()

    const params = new URLSearchParams({ question })

    const url = `${getApiUrl()}/api/rag/stream?${params.toString()}`
    
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    if (subdomain) headers['x-tenant-id'] = subdomain
    if (schoolId) headers['x-school-id'] = schoolId

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      onError?.(new Error(error.message || `HTTP error! status: ${response.status}`))
      return () => {}
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      onError?.(new Error('Não foi possível criar stream'))
      return () => {}
    }

    let buffer = ''

    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) {
            onComplete?.()
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = line.slice(6)
                const event: RagStreamingEvent = JSON.parse(data)
                onEvent(event)
                
                if (event.type === 'done' || event.type === 'error') {
                  if (event.type === 'error') {
                    onError?.(new Error(event.data?.message || 'Erro desconhecido'))
                  }
                  onComplete?.()
                  return
                }
              } catch (error) {
                console.error('Erro ao processar evento SSE:', error)
              }
            }
          }
        }
      } catch (error) {
        console.error('Erro no stream:', error)
        onError?.(error as Error)
      }
    }

    processStream()

    return () => {
      reader.cancel()
    }
  }
}

export const ragService = new RagService()
