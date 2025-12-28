import { ChartSkeleton } from '../skeletons'
import type { HorizontalBarItem, LoadableProps } from '@/types/dashboard'

interface HorizontalBarChartProps extends LoadableProps {
  data: HorizontalBarItem[]
  maxValue?: number
  getColor?: (value: number, maxValue: number) => string
}

function defaultGetColor(value: number, maxValue: number): string {
  const percent = (value / maxValue) * 100
  if (percent >= 70) return 'bg-emerald-500'
  if (percent >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

export function HorizontalBarChart({
  data,
  maxValue: providedMax,
  getColor = defaultGetColor,
  isLoading = false,
}: HorizontalBarChartProps) {
  if (isLoading) {
    return <ChartSkeleton type="horizontal-bar" />
  }

  const maxValue = providedMax || Math.max(...data.map(item => item.maxValue || item.value))

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const itemMax = item.maxValue || maxValue
        const percentage = (item.value / itemMax) * 100
        const barColor = getColor(item.value, itemMax)

        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${barColor}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            {item.subtitle && (
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                {item.subtitle}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
