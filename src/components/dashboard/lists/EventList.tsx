import { ListSkeleton } from '../skeletons'
import type { EventData, LoadableProps } from '@/types/dashboard'

interface EventListProps extends LoadableProps {
  events: EventData[]
  maxItems?: number
}

const typeColors: Record<string, { badge: string; card: string }> = {
  reuniao: { 
    badge: 'bg-blue-500',
    card: 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 dark:from-gray-800/50 dark:to-gray-800/50 dark:border-l-0'
  },
  feriado: { 
    badge: 'bg-green-500',
    card: 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 dark:from-gray-800/50 dark:to-gray-800/50 dark:border-l-0'
  },
  importante: { 
    badge: 'bg-orange-500',
    card: 'bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-400 dark:from-gray-800/50 dark:to-gray-800/50 dark:border-l-0'
  },
}

export function EventList({ events, maxItems, isLoading = false }: EventListProps) {
  if (isLoading) {
    return <ListSkeleton variant="event" count={maxItems || 5} />
  }

  const displayEvents = maxItems ? events.slice(0, maxItems) : events

  const defaultConfig = { 
    badge: 'bg-gray-500',
    card: 'bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400 dark:from-gray-800/50 dark:to-gray-800/50 dark:border-l-0'
  }

  return (
    <div className="space-y-2">
      {displayEvents.map((evento) => {
        const config = typeColors[evento.tipo] || defaultConfig
        
        return (
          <div 
            key={evento.id} 
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${config.card}`}
          >
            <div className={`
              w-9 h-9 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold
              ${config.badge}
            `}>
            <span className="text-[10px]">{evento.data.split(' ')[0]}</span>
            <span className="text-[8px] font-normal">{evento.data.split(' ')[1]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-xs text-gray-900 dark:text-gray-100 truncate">
              {evento.titulo}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">
              {evento.tipo}
            </p>
          </div>
        </div>
        )
      })}
    </div>
  )
}
