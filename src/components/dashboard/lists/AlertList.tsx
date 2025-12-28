import { AlertTriangle, Bell, CheckCircle, XCircle } from 'lucide-react'
import { ListSkeleton } from '../skeletons'
import type { AlertData, AlertType, LoadableProps } from '@/types/dashboard'

interface AlertListProps extends LoadableProps {
  alerts: AlertData[]
  maxItems?: number
}

const alertConfig: Record<AlertType, { icon: typeof Bell; bg: string; border: string; iconColor: string }> = {
  warning: { 
    icon: AlertTriangle, 
    bg: 'bg-yellow-50 dark:bg-yellow-900/10', 
    border: 'border-yellow-500',
    iconColor: 'text-yellow-500'
  },
  error: { 
    icon: XCircle, 
    bg: 'bg-red-50 dark:bg-red-900/10', 
    border: 'border-red-500',
    iconColor: 'text-red-500'
  },
  info: { 
    icon: Bell, 
    bg: 'bg-blue-50 dark:bg-blue-900/10', 
    border: 'border-blue-500',
    iconColor: 'text-blue-500'
  },
  success: { 
    icon: CheckCircle, 
    bg: 'bg-green-50 dark:bg-green-900/10', 
    border: 'border-green-500',
    iconColor: 'text-green-500'
  },
}

export function AlertList({ alerts, maxItems, isLoading = false }: AlertListProps) {
  if (isLoading) {
    return <ListSkeleton variant="alert" count={maxItems || 3} />
  }

  const displayAlerts = maxItems ? alerts.slice(0, maxItems) : alerts

  return (
    <div className="space-y-2">
      {displayAlerts.map((alerta) => {
        const config = alertConfig[alerta.tipo]
        const Icon = config.icon
        
        return (
          <div 
            key={alerta.id} 
            className={`flex items-start gap-2 p-2.5 rounded-lg border-l-4 ${config.bg} ${config.border}`}
          >
            <Icon className={`w-4 h-4 ${config.iconColor} flex-shrink-0 mt-0.5`} />
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {alerta.texto}
            </p>
          </div>
        )
      })}
    </div>
  )
}
