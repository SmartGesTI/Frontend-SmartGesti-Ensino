import { Skeleton } from '@/components/ui/skeleton'

interface ListSkeletonProps {
  count?: number
  variant?: 'event' | 'payment' | 'ranking' | 'alert' | 'activity' | 'debtor'
}

export function ListSkeleton({ count = 5, variant = 'event' }: ListSkeletonProps) {
  if (variant === 'ranking') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2 w-16" />
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-10 ml-auto" />
              <Skeleton className="h-2 w-8 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'payment') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2 w-12" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-16 ml-auto" />
              <Skeleton className="h-2 w-10 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'alert') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'activity') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-start gap-2 p-2 rounded-lg">
            <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2 w-12" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'debtor') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2 w-20" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-20 ml-auto" />
              <Skeleton className="h-2 w-14 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Event default
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
