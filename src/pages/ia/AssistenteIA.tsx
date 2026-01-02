import { useState, useEffect, useRef, useCallback } from 'react'
import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChatMessage } from './components/ChatMessage'
import { ChatInput } from './components/ChatInput'
import { ChatsPanel } from './components/ChatsPanel'
import { assistantService } from '@/services/assistant.service'
import { useSchool } from '@/contexts/SchoolContext'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface ChatMessageType {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  links?: Array<{
    label: string
    url: string
    type?: 'navigation' | 'external'
  }>
}

export default function AssistenteIA() {
  const { schoolId } = useSchool()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('new-conversation')
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentStreamingText, setCurrentStreamingText] = useState('')
  const [currentThinking, setCurrentThinking] = useState('') // Pensamentos do modelo
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamCloseRef = useRef<(() => void) | null>(null)
  const streamingTextRef = useRef('')
  const thinkingTextRef = useRef('') // Referência para pensamentos acumulados
  const skipHistoryReloadRef = useRef(false) // Flag para evitar reload quando apenas atualizamos o ID

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentStreamingText, currentThinking])

  // Carregar histórico quando selecionar conversa (apenas se não for nova conversa)
  useEffect(() => {
    // Se a flag estiver ativa, não recarregar (evita duplicação quando conversa é criada)
    if (skipHistoryReloadRef.current) {
      skipHistoryReloadRef.current = false
      console.log('[AssistenteIA] Pulando reload de histórico - conversa recém criada')
      return
    }
    
    if (selectedConversationId && selectedConversationId !== 'new-conversation') {
      // Se já tiver mensagens, não recarregar (evita duplicação)
      loadConversationHistory(selectedConversationId, messages.length > 0)
    } else if (selectedConversationId === 'new-conversation') {
      // Nova conversa - limpar mensagens
      setMessages([])
    }
  }, [selectedConversationId])

  const loadConversationHistory = async (conversationId: string, skipIfHasMessages = false) => {
    // Não carregar histórico se for nova conversa
    if (conversationId === 'new-conversation') {
      setMessages([])
      return
    }

    // Se skipIfHasMessages for true e já tiver mensagens, não recarregar (evita duplicação)
    if (skipIfHasMessages && messages.length > 0) {
      console.log('[AssistenteIA] Pulando carregamento de histórico - já existem mensagens locais')
      return
    }

    try {
      console.log('[AssistenteIA] Carregando histórico da conversa:', conversationId)
      const history = await assistantService.getConversationHistory(conversationId)
      console.log('[AssistenteIA] Histórico carregado:', history.length, 'mensagens')
      
      const formattedMessages: ChatMessageType[] = history.map((msg) => {
        // Converter timestamp para Date corretamente
        let timestamp: Date
        if (msg.timestamp instanceof Date) {
          timestamp = msg.timestamp
        } else if (typeof msg.timestamp === 'string') {
          timestamp = new Date(msg.timestamp)
        } else if (typeof msg.timestamp === 'number') {
          timestamp = new Date(msg.timestamp)
        } else {
          console.warn('[AssistenteIA] Timestamp inválido:', msg.timestamp, 'usando data atual')
          timestamp = new Date()
        }

        // Validar se a data é válida
        if (isNaN(timestamp.getTime())) {
          console.warn('[AssistenteIA] Data inválida para mensagem:', msg.id, 'usando data atual')
          timestamp = new Date()
        }

        return {
          id: msg.id || Date.now().toString(),
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'assistant',
          timestamp,
          links: msg.links,
        }
      })
      
      console.log('[AssistenteIA] Mensagens formatadas:', formattedMessages.length)
      setMessages(formattedMessages)
    } catch (error: any) {
      console.error('[AssistenteIA] Erro ao carregar histórico:', error)
      toast.error('Erro ao carregar histórico da conversa')
    }
  }

  const handleNewConversation = () => {
    setSelectedConversationId('new-conversation')
    setMessages([])
    setCurrentStreamingText('')
  }

  const handleConversationCreated = (id: string) => {
    // Quando a conversa for criada no servidor, atualizar o ID selecionado
    if (selectedConversationId === 'new-conversation') {
      setSelectedConversationId(id)
    }
  }


  const handleSend = useCallback(
    async (text: string) => {
      // Proteção contra duplo envio
      if (isTyping) {
        console.warn('[AssistenteIA] Tentativa de envio enquanto está processando, ignorando')
        return
      }

      console.log('[AssistenteIA] Enviando mensagem:', {
        text: text.substring(0, 50),
        conversationId: selectedConversationId,
        schoolId,
        timestamp: new Date().toISOString(),
      })

      // Adicionar mensagem do usuário
      const userMessage: ChatMessageType = {
        id: Date.now().toString(),
        text,
        sender: 'user',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)
      streamingTextRef.current = ''
      setCurrentStreamingText('')
      thinkingTextRef.current = ''
      setCurrentThinking('')

      // Fechar stream anterior se houver
      if (streamCloseRef.current) {
        console.log('[AssistenteIA] Fechando stream anterior')
        streamCloseRef.current()
        streamCloseRef.current = null
      }

      // Se for nova conversa, usar null para o backend criar
      const conversationIdForBackend = selectedConversationId === 'new-conversation' 
        ? null 
        : selectedConversationId

      try {
        const closeStream = await assistantService.streamMessage(
          text,
          conversationIdForBackend,
          (event) => {
            console.log('[AssistenteIA] Evento recebido:', event.type, {
              hasData: !!event.data,
              timestamp: event.timestamp,
            })

            if (event.type === 'token') {
              const newText = (event.data.content || event.data.delta || '')
              if (newText) {
                streamingTextRef.current += newText
                setCurrentStreamingText(streamingTextRef.current)
                // Garantir que isTyping está ativo quando recebemos tokens
                if (!isTyping) {
                  setIsTyping(true)
                }
                console.log('[AssistenteIA] Token recebido:', {
                  newTextLength: newText.length,
                  accumulatedLength: streamingTextRef.current.length,
                  preview: newText.substring(0, 50),
                })
              }
            } else if (event.type === 'thinking') {
              // Pensamentos/reasoning do modelo
              const thinkingText = (event.data.content || event.data.delta || '')
              if (thinkingText) {
                thinkingTextRef.current += thinkingText
                setCurrentThinking(thinkingTextRef.current)
                // Garantir que isTyping está ativo quando recebemos pensamentos
                if (!isTyping) {
                  setIsTyping(true)
                }
                console.log('[AssistenteIA] Pensamento recebido:', {
                  thinkingLength: thinkingText.length,
                  accumulatedLength: thinkingTextRef.current.length,
                  preview: thinkingText.substring(0, 50),
                })
              }
            } else if (event.type === 'done') {
              const accumulatedText = streamingTextRef.current
              const finalResponseText = event.data?.final_response || ''
              
              // Usar apenas o texto acumulado durante streaming OU o final_response (não ambos)
              // O final_response geralmente vem vazio ou com o mesmo conteúdo, então priorizar accumulatedText
              const finalText = accumulatedText || finalResponseText
              
              console.log('[AssistenteIA] Stream completo:', {
                accumulatedLength: accumulatedText.length,
                finalResponseLength: finalResponseText.length,
                totalLength: finalText.length,
                finalResponsePreview: finalResponseText.substring(0, 100),
                accumulatedPreview: accumulatedText.substring(0, 100),
                finalTextPreview: finalText.substring(0, 100),
                conversationId: event.data?.conversationId,
                links: event.data?.links?.length || 0,
                usingAccumulated: !!accumulatedText,
                usingFinalResponse: !accumulatedText && !!finalResponseText,
              })

              if (finalText.trim()) {
                const assistantMessage: ChatMessageType = {
                  id: (Date.now() + 1).toString(),
                  text: finalText.trim(),
                  sender: 'assistant',
                  timestamp: new Date(),
                  links: event.data?.links,
                }
                
                console.log('[AssistenteIA] Mensagem final criada:', {
                  id: assistantMessage.id,
                  textLength: assistantMessage.text.length,
                  textPreview: assistantMessage.text.substring(0, 150),
                  hasLinks: !!assistantMessage.links && assistantMessage.links.length > 0,
                })
                
                // Adicionar mensagem ao array IMEDIATAMENTE (sem delay)
                // Isso mantém o texto visível durante a transição
                setMessages((prev) => {
                  // Verificar se a mensagem já não existe (evitar duplicação)
                  const messageExists = prev.some(m => 
                    m.sender === 'assistant' && 
                    m.text === assistantMessage.text &&
                    Math.abs(m.timestamp.getTime() - assistantMessage.timestamp.getTime()) < 5000 // 5 segundos de tolerância
                  )
                  
                  if (messageExists) {
                    console.warn('[AssistenteIA] Mensagem já existe no array, não adicionando novamente')
                    return prev
                  }
                  
                  console.log('[AssistenteIA] Adicionando mensagem ao array. Total antes:', prev.length)
                  const newMessages = [...prev, assistantMessage]
                  console.log('[AssistenteIA] Total depois:', newMessages.length)
                  return newMessages
                })
                
                // Limpar streaming text e isTyping DEPOIS de adicionar a mensagem (transição suave)
                // Usar double requestAnimationFrame para garantir que a mensagem já foi renderizada
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    // Limpar apenas após dois frames de renderização (garante que a mensagem foi renderizada)
                    streamingTextRef.current = ''
                    setCurrentStreamingText('')
                    thinkingTextRef.current = ''
                    setCurrentThinking('')
                    setIsTyping(false)
                  })
                })
              } else {
                console.warn('[AssistenteIA] Nenhum texto final para adicionar')
                // Se não houver texto final, limpar imediatamente
                streamingTextRef.current = ''
                setCurrentStreamingText('')
                thinkingTextRef.current = ''
                setCurrentThinking('')
                setIsTyping(false)
              }

              // Atualizar conversa se houver
              if (event.data?.conversationId) {
                console.log('[AssistenteIA] Conversa salva:', event.data.conversationId)
                
                // Se for nova conversa, atualizar ID SEM recarregar histórico (evita flick e duplicação)
                if (selectedConversationId === 'new-conversation') {
                  // Ativar flag para evitar reload do histórico
                  skipHistoryReloadRef.current = true
                  // Apenas atualizar o ID, sem recarregar histórico (já temos as mensagens localmente)
                  setSelectedConversationId(event.data.conversationId)
                  handleConversationCreated(event.data.conversationId)
                  
                  // Se o título veio na resposta, atualizar no painel (apenas para nova conversa)
                  if (event.data?.title) {
                    setTimeout(() => {
                      if ((window as any).__updateChatTitle) {
                        (window as any).__updateChatTitle(event.data.conversationId, event.data.title)
                      }
                    }, 500) // Delay para efeito de digitação
                  } else {
                    // Se não veio, buscar do servidor (fallback) - apenas para nova conversa
                    setTimeout(async () => {
                      try {
                        const updatedConversations = await assistantService.listConversations(20)
                        const newConv = updatedConversations.find((c) => c.id === event.data?.conversationId)
                        if (newConv?.title) {
                          setTimeout(() => {
                            if ((window as any).__updateChatTitle) {
                              (window as any).__updateChatTitle(event.data.conversationId, newConv.title!)
                            }
                          }, 500)
                        }
                      } catch (err) {
                        console.error('[AssistenteIA] Erro ao buscar título:', err)
                      }
                    }, 1000)
                  }
                } else {
                  // Se não for nova conversa, NÃO atualizar título no painel
                  console.log('[AssistenteIA] Conversa existente - título NÃO será atualizado no painel')
                }
                
                // NÃO atualizar lista de conversas automaticamente após cada mensagem
                // Isso causa flick e não é necessário - o usuário pode atualizar manualmente se quiser
                // Apenas atualizar se for nova conversa (para aparecer na lista)
                if (selectedConversationId === 'new-conversation') {
                  // Apenas para nova conversa, atualizar após delay maior
                  setTimeout(() => {
                    if ((window as any).__refreshChats) {
                      (window as any).__refreshChats()
                    }
                  }, 3000) // Delay maior para evitar flick
                }
              }
            } else if (event.type === 'error') {
              console.error('[AssistenteIA] Erro no evento:', event.data)
              setIsTyping(false)
              streamingTextRef.current = ''
              setCurrentStreamingText('')
              toast.error(event.data?.message || 'Erro ao processar mensagem')
            }
          },
          (error) => {
            console.error('[AssistenteIA] Erro no stream:', error)
            setIsTyping(false)
            setCurrentStreamingText('')
            toast.error(error.message || 'Erro ao enviar mensagem')
          },
          () => {
            console.log('[AssistenteIA] Stream fechado')
            streamCloseRef.current = null
          },
          schoolId || undefined,
        )

        streamCloseRef.current = closeStream
      } catch (error: any) {
        console.error('[AssistenteIA] Erro ao iniciar stream:', error)
        setIsTyping(false)
        setCurrentStreamingText('')
        toast.error(error.message || 'Erro ao enviar mensagem')
      }
    },
    [selectedConversationId, schoolId, isTyping],
  )

  // Limpar stream ao desmontar
  useEffect(() => {
    return () => {
      if (streamCloseRef.current) {
        streamCloseRef.current()
      }
    }
  }, [])

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Painel de Chats - Esquerda */}
      <ChatsPanel
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
        onNewConversation={handleNewConversation}
        onConversationCreated={handleConversationCreated}
        onTitleUpdate={() => {
          // Callback vazio - o ChatsPanel gerencia seus próprios títulos
        }}
      />

      {/* Área de Chat - Direita */}
      <div className="flex-1 flex flex-col">
        <Card className="shadow-2xl border-2 border-border bg-card overflow-hidden h-full flex flex-col">
          <CardHeader className="bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/30 dark:to-transparent border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <CardTitle className="text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Assistente Virtual
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col flex-1 min-h-0">
            {/* Área de Mensagens */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
              {messages.length === 0 && !isTyping && !currentStreamingText && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Como posso ajudar?
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    Faça perguntas sobre o sistema, peça ajuda com funcionalidades ou explore
                    as capacidades do SmartGesTI.
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {/* Pensamentos do modelo (thinking/reasoning) */}
              {isTyping && currentThinking && (
                <div className="flex gap-3 mb-4 animate-in fade-in-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl px-4 py-3 shadow-md max-w-[70%] border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                      EducaIA - Pensando...
                    </p>
                    <div className="text-sm leading-relaxed text-blue-900 dark:text-blue-100 italic">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => (
                            <p {...props} className="mb-1 last:mb-0" />
                          ),
                        }}
                      >
                        {currentThinking}
                      </ReactMarkdown>
                      <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1 align-middle" />
                    </div>
                  </div>
                </div>
              )}

              {/* Mensagem sendo digitada (streaming) - só mostrar se ainda estiver digitando E tiver texto */}
              {/* Não mostrar se já foi adicionada ao array de mensagens (evita flick) */}
              {isTyping && currentStreamingText && (
                <div className="flex gap-3 mb-4 animate-in fade-in-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md max-w-[70%]">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                      EducaIA - Assistente
                    </p>
                    <div className={cn(
                      'text-sm leading-relaxed',
                      'text-gray-900 dark:text-gray-100'
                    )}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Customizar links para abrir em nova aba
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 underline hover:opacity-80 transition-opacity"
                            />
                          ),
                          // Customizar parágrafos
                          p: ({ node, ...props }) => (
                            <p {...props} className="mb-2 last:mb-0" />
                          ),
                          // Customizar listas
                          ul: ({ node, ...props }) => (
                            <ul {...props} className="list-disc list-inside mb-2 space-y-1 ml-2" />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol {...props} className="list-decimal list-inside mb-2 space-y-1 ml-2" />
                          ),
                          // Customizar texto em negrito
                          strong: ({ node, ...props }) => (
                            <strong {...props} className="font-semibold" />
                          ),
                          // Customizar texto em itálico
                          em: ({ node, ...props }) => (
                            <em {...props} className="italic" />
                          ),
                          // Customizar código inline
                          code: ({ node, inline, ...props }: any) => (
                            inline ? (
                              <code {...props} className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs" />
                            ) : (
                              <code {...props} className="block bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto" />
                            )
                          ),
                        }}
                      >
                        {currentStreamingText}
                      </ReactMarkdown>
                      <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1 align-middle" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Indicador de digitação quando não há texto ainda */}
              {isTyping && !currentStreamingText && (
                <div className="flex gap-3 mb-4 animate-in fade-in-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                      EducaIA - Assistente
                    </p>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input de Chat */}
            <div className="border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <ChatInput onSend={handleSend} disabled={isTyping} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
