import { ListSkeleton } from '../skeletons'
import type { EventData, LoadableProps } from '@/types/dashboard'

interface EventListProps extends LoadableProps {
  events: EventData[]
  maxItems?: number
}

const typeColors: Record<string, string> = {
  reuniao: 'bg-blue-500',
  feriado: 'bg-green-500',
  importante: 'bg-orange-500',
}

export function EventList({ events, maxItems, isLoading = false }: EventListProps) {
  if (isLoading) {
    return <ListSkeleton variant="event" count={maxItems || 5} />
  }

  const displayEvents = maxItems ? events.slice(0, maxItems) : events

  return (
    <div className="space-y-2">
      {displayEvents.map((evento) => (
        <div 
          key={evento.id} 
          className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className={`
            w-9 h-9 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold
            ${typeColors[evento.tipo] || 'bg-gray-500'}
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
      ))}
    </div>
  )
}
