import { useState, useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChatMessage } from './components/ChatMessage'
import { ChatInput } from './components/ChatInput'
import { mockChatMessages, quickSuggestions, ChatMessage as ChatMessageType } from './components/mockData'

export default function AssistenteIA() {
  const [messages, setMessages] = useState<ChatMessageType[]>(mockChatMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('relatório') || lowerMessage.includes('relatorio')) {
      return 'Para gerar relatórios, acesse a página "Relatório Inteligente". Lá você encontrará diferentes tipos de relatórios como Acadêmico, Financeiro, Matrículas e Frequência. Cada relatório pode ser personalizado com filtros e parâmetros específicos.'
    }

    if (lowerMessage.includes('agente') || lowerMessage.includes('criar')) {
      return 'Você pode criar agentes personalizados na página "Criar Agente IA". Lá você encontrará templates prontos e poderá montar workflows visuais arrastando e soltando componentes. Os agentes podem processar documentos, analisar dados com IA e gerar resultados automaticamente.'
    }

    if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
      return 'Posso ajudar você com:\n\n• Geração de relatórios inteligentes\n• Criação de agentes de IA personalizados\n• Análise de dados acadêmicos\n• Automação de tarefas\n\nO que você gostaria de fazer?'
    }

    return 'Entendi sua pergunta. Posso ajudar você com relatórios, criação de agentes de IA e análise de dados. Como posso ser mais útil?'
  }

  const handleSend = (text: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simular resposta do assistente
    setTimeout(() => {
      setIsTyping(false)
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(text),
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1500)
  }

  const handleQuickSuggestion = (suggestion: string) => {
    handleSend(suggestion)
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl border-2 border-border bg-card overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/30 dark:to-transparent border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Assistente Virtual
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[calc(100vh-280px)]">
          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex gap-3 mb-4 animate-in fade-in-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md">
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

          {/* Sugestões Rápidas */}
          {messages.length === mockChatMessages.length && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Sugestões rápidas:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="text-xs h-7 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input de Chat */}
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </CardContent>
      </Card>
    </div>
  )
}
