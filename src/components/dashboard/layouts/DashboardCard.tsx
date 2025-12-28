import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { LoadableProps } from '@/types/dashboard'

interface DashboardCardProps extends LoadableProps {
  title: string
  description?: string
  icon?: React.ElementType
  iconColor?: string
  gradient?: string
  children: React.ReactNode
  contentClassName?: string
  badge?: string | number
  badgeColor?: string
}

function DashboardCardSkeleton({ hasDescription = true }: { hasDescription?: boolean }) {
  return (
    <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
      <CardHeader className="bg-gray-100 dark:bg-gray-800/50 border-b border-border">
        <Skeleton className="h-5 w-40" />
        {hasDescription && <Skeleton className="h-3 w-32" />}
      </CardHeader>
      <CardContent className="py-4">
        <Skeleton className="h-32 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-500',
  gradient = 'from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20',
  children,
  contentClassName,
  badge,
  badgeColor = 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  isLoading = false,
}: DashboardCardProps) {
  if (isLoading) {
    return <DashboardCardSkeleton hasDescription={!!description} />
  }

  return (
    <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
      <CardHeader className={`bg-gradient-to-r ${gradient} border-b border-border`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
              {title}
            </CardTitle>
            {description && <CardDescription className="text-xs">{description}</CardDescription>}
          </div>
          {badge !== undefined && (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  )
}
