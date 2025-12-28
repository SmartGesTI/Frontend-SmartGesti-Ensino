import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardSkeletonProps {
  variant?: 'gradient' | 'soft'
}

export function StatCardSkeleton({ variant = 'gradient' }: StatCardSkeletonProps) {
  if (variant === 'gradient') {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 border-0">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-white/20" />
              <Skeleton className="h-8 w-16 bg-white/20" />
              <Skeleton className="h-3 w-32 bg-white/20" />
            </div>
            <Skeleton className="h-11 w-11 rounded-xl bg-white/20" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-100 dark:bg-gray-800 border-0">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}
