import { CheckCircle2 } from 'lucide-react'
import { ListSkeleton } from '../skeletons'
import type { ActivityData, LoadableProps } from '@/types/dashboard'

interface ActivityListProps extends LoadableProps {
  activities: ActivityData[]
  maxItems?: number
}

export function ActivityList({ activities, maxItems, isLoading = false }: ActivityListProps) {
  if (isLoading) {
    return <ListSkeleton variant="activity" count={maxItems || 4} />
  }

  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities

  return (
    <div className="space-y-2">
      {displayActivities.map((atividade) => (
        <div 
          key={atividade.id} 
          className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {atividade.texto}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              há {atividade.tempo}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
