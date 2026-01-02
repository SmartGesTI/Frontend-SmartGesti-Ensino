import { useState, useEffect, useCallback, useRef } from 'react'
import { MessageSquare, Plus, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { assistantService, Conversation } from '@/services/assistant.service'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ChatsPanelProps {
  selectedConversationId: string | null
  onSelectConversation: (id: string | null) => void
  onNewConversation: () => void
  onConversationCreated?: (id: string) => void
  onTitleUpdate?: () => void
}

export function ChatsPanel({
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
}: ChatsPanelProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newConversationTitle, setNewConversationTitle] = useState<string | null>(null)
  const [typingTitle, setTypingTitle] = useState('')
  const [hasNewConversation, setHasNewConversation] = useState(false)
  const animatingIdsRef = useRef<Set<string>>(new Set())

  // Carregar conversas
  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      const data = await assistantService.listConversations(20)
      
      // Verificar se já existe uma "Nova Conversa" local
      const hasLocalNew = conversations.some(c => c.id === 'new-conversation')
      
      // Se não houver conversa nova local, criar uma local (sempre ter uma disponível)
      if (!hasLocalNew && !hasNewConversation) {
        setHasNewConversation(true)
        setConversations([{
          id: 'new-conversation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          title: null,
          messageCount: 0,
          lastMessage: 'Nova conversa',
        }, ...data])
      } else if (hasLocalNew) {
        // Manter a nova conversa local e adicionar as do servidor
        setConversations((prev) => {
          const newConv = prev.find(c => c.id === 'new-conversation')
          const serverConvs = data.filter(c => c.id !== 'new-conversation')
          return newConv ? [newConv, ...serverConvs] : [...serverConvs]
        })
      } else {
        setConversations(data)
      }
    } catch (error: any) {
      console.error('[ChatsPanel] Erro ao carregar conversas:', error)
      toast.error('Erro ao carregar conversas')
    } finally {
      setIsLoading(false)
    }
  }

  const animateTitle = useCallback((title: string) => {
    // Limpar qualquer animação anterior
    setNewConversationTitle(null)
    setTypingTitle('')
    
    // Começar animação imediatamente (já há delay no chamador)
    setNewConversationTitle(title)
    setTypingTitle('')
    let index = 0
    
    const interval = setInterval(() => {
      if (index < title.length) {
        setTypingTitle(title.substring(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setNewConversationTitle(null)
          setTypingTitle('')
        }, 2000)
      }
    }, 100) // 100ms por caractere (mais lento e visível)
  }, [])

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Se for a conversa nova local, apenas remover
    if (conversationId === 'new-conversation') {
      setHasNewConversation(false)
      setConversations((prev) => prev.filter((c) => c.id !== conversationId))
      if (selectedConversationId === conversationId) {
        onNewConversation()
      }
      return
    }

    try {
      await assistantService.deleteConversation(conversationId)
      setConversations((prev) => prev.filter((c) => c.id !== conversationId))
      if (selectedConversationId === conversationId) {
        onNewConversation()
      }
      toast.success('Conversa deletada')
    } catch (error: any) {
      console.error('[ChatsPanel] Erro ao deletar conversa:', error)
      toast.error('Erro ao deletar conversa')
    }
  }

  // Expor função para atualizar título (será chamada pelo componente pai)
  useEffect(() => {
    // Criar função exposta via callback
    (window as any).__updateChatTitle = (id: string, title: string) => {
      // Evitar animação duplicada para o mesmo ID
      if (animatingIdsRef.current.has(id)) {
        console.log('[ChatsPanel] Animação já em andamento para', id, 'ignorando')
        return
      }
      
      animatingIdsRef.current.add(id)
      
      // NÃO atualizar o título no estado ainda - apenas iniciar animação
      // O título será atualizado apenas durante a animação
      setTimeout(() => {
        // Atualizar título no estado apenas quando começar a animar (limpar temporariamente)
        setConversations((prev) => {
          const updated = prev.map((c) => 
            c.id === id ? { ...c, title: null } : c // Limpar título temporariamente
          )
          return updated
        })
        
        // Iniciar animação
        animateTitle(title)
        
        // Após animação, atualizar título definitivamente
        setTimeout(() => {
          setConversations((prev) => {
            const updated = prev.map((c) => 
              c.id === id ? { ...c, title } : c
            )
            return updated
          })
          animatingIdsRef.current.delete(id)
        }, title.length * 100 + 500 + 2000) // Tempo total da animação
      }, 500) // Delay antes de começar animação
    }

    return () => {
      delete (window as any).__updateChatTitle
    }
  }, [animateTitle])

  // Atualizar quando receber notificação de nova conversa
  useEffect(() => {
    const refreshChats = async () => {
      try {
        const data = await assistantService.listConversations(20)
        
        // Remover conversa "new-conversation" se existir e houver conversas do servidor
        setConversations((prev) => {
          const hasNew = prev.some(c => c.id === 'new-conversation')
          const serverConversations = data.filter(c => c.id !== 'new-conversation')
          
          if (hasNew && serverConversations.length > 0) {
            // Remover a nova conversa local e adicionar as do servidor
            return serverConversations
          } else if (!hasNew && serverConversations.length > 0) {
            return serverConversations
          } else {
            return prev
          }
        })
      } catch (error) {
        console.error('[ChatsPanel] Erro ao atualizar conversas:', error)
      }
    }
    
    // Será chamado externamente quando necessário
    (window as any).__refreshChats = refreshChats

    return () => {
      delete (window as any).__refreshChats
    }
  }, [])

  return (
    <div className="w-80 flex-shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Conversas
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Se já não houver uma nova conversa, criar
            if (!hasNewConversation && !conversations.some(c => c.id === 'new-conversation')) {
              setHasNewConversation(true)
              setConversations([{
                id: 'new-conversation',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                title: null,
                messageCount: 0,
                lastMessage: 'Nova conversa',
              }, ...conversations])
            }
            onNewConversation()
          }}
          className="h-8 w-8 p-0"
          title="Nova conversa"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Nenhuma conversa ainda
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  'p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative group',
                  selectedConversationId === conversation.id &&
                    'bg-purple-50 dark:bg-purple-950/30 border-l-2 border-purple-500',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                      {conversation.id === selectedConversationId && newConversationTitle && typingTitle
                        ? typingTitle
                        : conversation.title || (conversation.id === 'new-conversation' ? 'Nova conversa' : conversation.lastMessage) || 'Nova conversa'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(conversation.updatedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Deletar conversa"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Export default para compatibilidade
export default ChatsPanel
