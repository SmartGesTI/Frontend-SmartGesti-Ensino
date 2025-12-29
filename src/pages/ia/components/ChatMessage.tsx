import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import { ChatMessage as ChatMessageType } from './mockData'

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
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <span
          className={cn(
            'text-xs mt-1 block',
            isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {message.timestamp.toLocaleTimeString('pt-BR', {
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
