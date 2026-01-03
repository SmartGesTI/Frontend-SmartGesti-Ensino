import { useState, useRef, useEffect } from 'react'
import { BookOpen, Send, Loader2, Database, FileText, Search, ThumbsUp, ThumbsDown, RefreshCw, Workflow } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ragService, RagStatusResponse, RagSearchResult, ChatMessage, AgentDataFromRag, RagStreamingEvent } from '@/services/rag.service'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { AgentDetailsModal } from './components/AgentDetailsModal'
import { useSchool } from '@/contexts/SchoolContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: RagSearchResult[]
  question?: string // Pergunta original (para mensagens do assistente)
  feedback?: 'like' | 'dislike' | null // Feedback dado pelo usuário
  agentData?: AgentDataFromRag // Dados do agente para o modal (quando get_agent_details é usado)
}

export default function AssistenteRAG() {
  const { schoolId } = useSchool()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null)
  const [status, setStatus] = useState<RagStatusResponse | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Estado para o modal de detalhes do agente
  const [selectedAgent, setSelectedAgent] = useState<AgentDataFromRag | null>(null)
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false)
  
  // Estado para streaming
  const [currentStreamingText, setCurrentStreamingText] = useState('')
  const streamingTextRef = useRef('')
  const streamCloseRef = useRef<(() => void) | null>(null)

  // Converter mensagens para histórico de chat
  const getHistory = (): ChatMessage[] => {
    return messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Carregar status da knowledge base
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await ragService.getStatus()
        setStatus(data)
      } catch (error) {
        console.error('Erro ao carregar status:', error)
      }
    }
    loadStatus()
  }, [])

  // Cleanup do stream ao desmontar
  useEffect(() => {
    return () => {
      if (streamCloseRef.current) {
        streamCloseRef.current()
      }
    }
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!input.trim() || isLoading) return

    const question = input.trim()
    setInput('')

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Resetar estado de streaming
    streamingTextRef.current = ''
    setCurrentStreamingText('')

    // Buscar contexto relevante em paralelo
    let sources: RagSearchResult[] = []
    ragService.search(question, { topK: 3 }).then(searchResponse => {
      sources = searchResponse.results
    }).catch(console.error)

    // Variáveis para dados recebidos via streaming
    let receivedAgentData: AgentDataFromRag | undefined
    const assistantMessageId = (Date.now() + 1).toString()

    try {
      const closeStream = await ragService.streamAsk(
        question,
        // onEvent
        (event: RagStreamingEvent) => {
          switch (event.type) {
            case 'token':
              streamingTextRef.current += event.data.content || ''
              setCurrentStreamingText(streamingTextRef.current)
              break
              
            case 'tool_call':
              console.log('[RAG Stream] Tool call:', event.data)
              break
              
            case 'tool_result':
              console.log('[RAG Stream] Tool result:', event.data)
              // Capturar dados do agente se for get_agent_details
              if (event.data?.toolName === 'get_agent_details' && event.data?.result?.data) {
                const agentResult = event.data.result.data
                receivedAgentData = {
                  id: agentResult.id,
                  name: agentResult.name,
                  description: agentResult.description,
                  category: agentResult.category,
                  nodes: agentResult.flow_data?.nodes,
                  edges: agentResult.flow_data?.edges,
                  canRenderFlow: agentResult.can_render_flow || (agentResult.flow_data?.nodes?.length > 0),
                }
              }
              break
              
            case 'done':
              const finalAnswer = event.data?.answer || streamingTextRef.current || 'Não foi possível gerar uma resposta.'
              const finalAgentData = event.data?.agentData || receivedAgentData
              
              const assistantMessage: Message = {
                id: assistantMessageId,
                role: 'assistant',
                content: finalAnswer,
                timestamp: new Date(),
                sources: sources,
                question: question,
                feedback: null,
                agentData: finalAgentData,
              }
              setMessages((prev) => [...prev, assistantMessage])
              
              // Limpar estado de streaming
              streamingTextRef.current = ''
              setCurrentStreamingText('')
              setIsLoading(false)
              break
              
            case 'error':
              console.error('[RAG Stream] Error:', event.data)
              toast.error(event.data?.message || 'Erro no streaming')
              setIsLoading(false)
              break
          }
        },
        // onError
        (error: Error) => {
          console.error('Erro no streaming:', error)
          toast.error(error.message || 'Erro ao processar sua pergunta')
          
          const errorMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.',
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorMessage])
          setIsLoading(false)
        },
        // onComplete
        () => {
          streamCloseRef.current = null
        },
        schoolId || undefined,
      )
      
      streamCloseRef.current = closeStream
    } catch (error: any) {
      console.error('Erro ao iniciar streaming:', error)
      toast.error(error.message || 'Erro ao processar sua pergunta')
      
      const errorMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Enviar feedback (like/dislike)
  const handleFeedback = async (messageId: string, feedbackType: 'like' | 'dislike') => {
    const message = messages.find((m) => m.id === messageId)
    if (!message || message.role !== 'assistant' || !message.question) return

    try {
      await ragService.sendFeedback({
        messageId,
        question: message.question,
        answer: message.content,
        feedbackType,
        sources: message.sources,
        conversationHistory: getHistory(),
      })

      // Atualizar feedback na mensagem
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, feedback: feedbackType } : m
        )
      )

      toast.success(
        feedbackType === 'like'
          ? 'Obrigado pelo feedback positivo!'
          : 'Obrigado! Vamos melhorar.'
      )
    } catch (error) {
      toast.error('Erro ao enviar feedback')
    }
  }

  // Regenerar resposta
  const handleRegenerate = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (!message || message.role !== 'assistant' || !message.question) return

    setIsRegenerating(messageId)

    try {
      // Buscar histórico até antes dessa mensagem
      const messageIndex = messages.findIndex((m) => m.id === messageId)
      const historyBefore = messages.slice(0, messageIndex - 1).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await ragService.regenerate(message.question, historyBefore)

      // Atualizar a mensagem com nova resposta
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: response.answer, feedback: null }
            : m
        )
      )

      toast.success('Resposta regenerada!')
    } catch (error) {
      toast.error('Erro ao regenerar resposta')
    } finally {
      setIsRegenerating(null)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <Card className="shadow-2xl border-2 border-border bg-card overflow-hidden h-full flex flex-col">
        <CardHeader className="bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/30 dark:to-transparent border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              Knowledge Base
            </CardTitle>
            
            {/* Status da Knowledge Base */}
            {status && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{status.totalDocuments} docs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Database className="h-4 w-4" />
                  <span>{status.totalChunks} chunks</span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col flex-1 min-h-0">
          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Pergunte sobre o sistema
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  Faça perguntas sobre o SmartGesti-Ensino. O assistente irá buscar informações na base de conhecimento.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={() => setInput('Como criar um agente?')}>Como criar um agente?</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={() => setInput('O que é o Assistente IA?')}>O que é o Assistente IA?</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={() => setInput('Como funciona o menu Meus Agentes?')}>Como funciona o menu Meus Agentes?</Badge>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 mb-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-3 shadow-md',
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  )}
                >
                  {message.role === 'assistant' && (
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                      EducaIA - Knowledge Base
                    </p>
                  )}
                  <div className={cn(
                    'text-sm leading-relaxed',
                    message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                  )}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'underline hover:opacity-80 transition-opacity',
                              message.role === 'user' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'
                            )}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p {...props} className="mb-2 last:mb-0" />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul {...props} className="list-disc list-inside mb-2 space-y-1 ml-2" />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol {...props} className="list-decimal list-inside mb-2 space-y-1 ml-2" />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong {...props} className="font-semibold" />
                        ),
                        em: ({ node, ...props }) => (
                          <em {...props} className="italic" />
                        ),
                        code: ({ node, inline, ...props }: any) => (
                          inline ? (
                            <code {...props} className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs" />
                          ) : (
                            <code {...props} className="block bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto" />
                          )
                        ),
                        h1: ({ node, ...props }) => (
                          <h1 {...props} className="text-lg font-bold mb-2 mt-3 first:mt-0" />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 {...props} className="text-base font-bold mb-2 mt-3 first:mt-0" />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 {...props} className="text-sm font-bold mb-1 mt-2 first:mt-0" />
                        ),
                        li: ({ node, ...props }) => (
                          <li {...props} className="mb-1" />
                        ),
                      }}
                    >
                      {message.content || ''}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Fontes/Sources */}
                  {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <Search className="h-3 w-3" />
                        Fontes consultadas:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((source) => (
                          <Badge
                            key={source.id}
                            variant="outline"
                            className="text-xs"
                            title={source.content.substring(0, 200)}
                          >
                            {source.document.title}
                            <span className="ml-1 opacity-60">
                              ({Math.round(source.similarity * 100)}%)
                            </span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botão Ver Fluxo - quando há dados do agente com fluxo renderizável */}
                  {message.role === 'assistant' && message.agentData?.canRenderFlow && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                        onClick={() => {
                          setSelectedAgent(message.agentData!)
                          setIsAgentModalOpen(true)
                        }}
                      >
                        <Workflow className="h-4 w-4" />
                        Ver Fluxo do Agente: {message.agentData.name}
                      </Button>
                    </div>
                  )}

                  {/* Botões de Feedback */}
                  {message.role === 'assistant' && message.question && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground mr-2">Esta resposta foi útil?</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-7 px-2 hover:bg-green-100 dark:hover:bg-green-900/30',
                          message.feedback === 'like' && 'bg-green-100 dark:bg-green-900/30 text-green-600'
                        )}
                        onClick={() => handleFeedback(message.id, 'like')}
                        disabled={message.feedback !== null && message.feedback !== undefined}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-7 px-2 hover:bg-red-100 dark:hover:bg-red-900/30',
                          message.feedback === 'dislike' && 'bg-red-100 dark:bg-red-900/30 text-red-600'
                        )}
                        onClick={() => handleFeedback(message.id, 'dislike')}
                        disabled={message.feedback !== null && message.feedback !== undefined}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        onClick={() => handleRegenerate(message.id)}
                        disabled={isRegenerating === message.id}
                      >
                        <RefreshCw className={cn('h-4 w-4', isRegenerating === message.id && 'animate-spin')} />
                        <span className="ml-1 text-xs">Regenerar</span>
                      </Button>
                    </div>
                  )}
                  
                  <span
                    className={cn(
                      'text-xs mt-2 block',
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">U</span>
                  </div>
                )}
              </div>
            ))}

            {/* Loading/Streaming indicator */}
            {isLoading && (
              <div className="flex gap-3 mb-4 animate-in fade-in-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[70%] bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    EducaIA - Knowledge Base
                  </p>
                  {currentStreamingText ? (
                    <div className="text-sm leading-relaxed text-gray-900 dark:text-gray-100">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 underline hover:opacity-80 transition-opacity"
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p {...props} className="mb-2 last:mb-0" />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul {...props} className="list-disc list-inside mb-2 space-y-1 ml-2" />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol {...props} className="list-decimal list-inside mb-2 space-y-1 ml-2" />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong {...props} className="font-semibold" />
                          ),
                          em: ({ node, ...props }) => (
                            <em {...props} className="italic" />
                          ),
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
                      <span className="inline-block w-2 h-4 bg-emerald-500 animate-pulse ml-0.5 align-middle" />
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input de Chat */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Faça uma pergunta sobre o sistema..."
                className="min-h-[60px] max-h-[200px] resize-none flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="h-[60px] w-[60px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Agente */}
      <AgentDetailsModal
        agent={selectedAgent}
        open={isAgentModalOpen}
        onClose={() => {
          setIsAgentModalOpen(false)
          setSelectedAgent(null)
        }}
        mode="public"
        onExecute={() => {
          // Aqui poderia navegar para executar o agente
          toast.info(`Navegar para executar: ${selectedAgent?.name}`)
        }}
        onEdit={() => {
          // Não aplicável no contexto do RAG
        }}
      />
    </div>
  )
}
