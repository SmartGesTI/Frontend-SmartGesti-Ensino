import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import { ChatMessage as ChatMessageType } from './mockData'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-3 shadow-md',
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        )}
      >
        {!isUser && (
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            EducaIA - Assistente
          </p>
        )}
        <div className={cn(
          'text-sm leading-relaxed',
          isUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'
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
                  className={cn(
                    'underline hover:opacity-80 transition-opacity',
                    isUser ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'
                  )}
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
            {message.text || ''}
          </ReactMarkdown>
        </div>
        <span
          className={cn(
            'text-xs mt-2 block',
            isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {message.timestamp instanceof Date 
            ? message.timestamp.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
        </span>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-semibold">U</span>
        </div>
      )}
    </div>
  )
}
