import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { MetricItem, LoadableProps } from '@/types/dashboard'

interface MetricsSummaryProps extends LoadableProps {
  metrics: MetricItem[]
  gradient?: string
  columns?: 2 | 3 | 4
}

const defaultColors: Record<number, string> = {
  0: 'text-blue-500',
  1: 'text-purple-500',
  2: 'text-emerald-500',
  3: 'text-amber-500',
}

function MetricsSummarySkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <Card className="border border-border shadow-sm dark:shadow-gray-950/50 bg-gray-50 dark:bg-gray-800/30">
      <CardContent className="p-4">
        <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-4`}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton className="w-5 h-5 mx-auto rounded" />
              <Skeleton className="h-5 w-12 mx-auto" />
              <Skeleton className="h-2 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricsSummary({ 
  metrics, 
  gradient = 'from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20',
  columns = 4,
  isLoading = false 
}: MetricsSummaryProps) {
  if (isLoading) {
    return <MetricsSummarySkeleton columns={columns} />
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  return (
    <Card className={`border border-border shadow-sm dark:shadow-gray-950/50 bg-gradient-to-r ${gradient}`}>
      <CardContent className="p-4">
        <div className={`grid ${gridCols[columns]} gap-4`}>
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            const iconColor = metric.color || defaultColors[index % 4]
            
            return (
              <div key={index} className="text-center">
                <Icon className={`w-5 h-5 mx-auto ${iconColor} mb-1`} />
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {metric.value}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {metric.label}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
