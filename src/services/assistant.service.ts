import axios from 'axios'
import { getApiUrl, getAccessToken } from './api'
import { getTenantFromSubdomain } from '@/lib/tenant'

export interface Conversation {
  id: string
  createdAt: string
  updatedAt: string
  title: string | null
  messageCount: number
  lastMessage: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  links?: Array<{
    label: string
    url: string
    type?: 'navigation' | 'external'
  }>
}

export interface SendMessageResponse {
  text: string
  links?: Array<{
    label: string
    url: string
    type?: 'navigation' | 'external'
  }>
  metadata?: {
    toolsUsed?: string[]
    usage?: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
    model?: string
  }
}

export interface StreamingEvent {
  type: 'token' | 'tool_call' | 'tool_result' | 'done' | 'error' | 'usage' | 'thinking'
  data: any
  timestamp?: number
}

class AssistantService {
  private async getHeaders(): Promise<Record<string, string>> {
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

    return headers
  }

  /**
   * Envia uma mensagem sem streaming
   */
  async sendMessage(
    message: string,
    conversationId?: string,
    model?: string,
    schoolId?: string,
  ): Promise<SendMessageResponse> {
    const headers = await this.getHeaders()
    if (schoolId) {
      headers['x-school-id'] = schoolId
    }

    const response = await axios.post<SendMessageResponse>(
      `${getApiUrl()}/api/assistant/message`,
      {
        message,
        conversationId,
        model,
      },
      { headers },
    )
    return response.data
  }

  /**
   * Envia uma mensagem com streaming via SSE
   */
  async streamMessage(
    message: string,
    conversationId: string | null,
    onEvent: (event: StreamingEvent) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void,
    schoolId?: string,
  ): Promise<() => void> {
    const token = await getAccessToken()
    const subdomain = getTenantFromSubdomain()

    const params = new URLSearchParams({
      message,
    })
    
    if (conversationId) {
      params.append('conversationId', conversationId)
    }

    if (schoolId) {
      params.append('schoolId', schoolId)
    }

    // EventSource não suporta headers customizados, então precisamos usar fetch
    const url = `${getApiUrl()}/api/assistant/stream?${params.toString()}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(subdomain ? { 'x-tenant-id': subdomain } : {}),
      },
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
                const event: StreamingEvent = JSON.parse(data)
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

    // Retorna função para fechar a conexão
    return () => {
      reader.cancel()
    }
  }

  /**
   * Lista conversas do usuário
   */
  async listConversations(limit = 10): Promise<Conversation[]> {
    const headers = await this.getHeaders()
    const response = await axios.get<Conversation[]>(
      `${getApiUrl()}/api/assistant/conversations`,
      {
        headers,
        params: { limit },
      },
    )
    return response.data
  }

  /**
   * Obtém histórico de uma conversa
   */
  async getConversationHistory(conversationId: string): Promise<Message[]> {
    const headers = await this.getHeaders()
    const response = await axios.get<Message[]>(
      `${getApiUrl()}/api/assistant/conversations/${conversationId}`,
      { headers },
    )
    return response.data
  }

  /**
   * Deleta uma conversa
   */
  async deleteConversation(conversationId: string): Promise<void> {
    const headers = await this.getHeaders()
    await axios.post(
      `${getApiUrl()}/api/assistant/conversations/${conversationId}/delete`,
      {},
      { headers },
    )
  }
}

export const assistantService = new AssistantService()
