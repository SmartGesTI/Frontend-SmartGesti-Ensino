import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function StatCardSkeleton() {
  return (
    <Card className="relative overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-gray-700 dark:to-gray-800 border-0">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 dark:bg-white/20" />
            <Skeleton className="h-7 w-20 dark:h-8 dark:bg-white/20" />
            <Skeleton className="h-3 w-28 dark:w-32 dark:bg-white/20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl dark:h-11 dark:w-11 dark:bg-white/20" />
        </div>
      </CardContent>
    </Card>
  )
}
