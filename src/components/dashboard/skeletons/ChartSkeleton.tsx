import { Skeleton } from '@/components/ui/skeleton'

interface ChartSkeletonProps {
  type?: 'donut' | 'bar' | 'horizontal-bar' | 'area'
  height?: number
}

export function ChartSkeleton({ type = 'bar', height = 200 }: ChartSkeletonProps) {
  if (type === 'donut') {
    return (
      <div className="flex items-center justify-center gap-8 py-4">
        <Skeleton className="w-44 h-44 rounded-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-4 h-4 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'horizontal-bar') {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-2 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'area') {
    return (
      <div style={{ height }} className="w-full">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    )
  }

  // Bar chart default
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-1 items-end" style={{ height }}>
              <Skeleton className="flex-1 rounded-t-sm" style={{ height: `${30 + Math.random() * 60}%` }} />
              <Skeleton className="flex-1 rounded-t-sm" style={{ height: `${20 + Math.random() * 50}%` }} />
            </div>
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  )
}
