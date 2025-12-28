import { ChartSkeleton } from '../skeletons'
import type { BarChartItem, LoadableProps } from '@/types/dashboard'

interface SimpleBarChartProps extends LoadableProps {
  data: BarChartItem[]
  height?: number
  showLegend?: boolean
  primaryLabel?: string
  secondaryLabel?: string
  primaryColor?: string
  secondaryColor?: string
}

export function SimpleBarChart({
  data,
  height = 160,
  showLegend = true,
  primaryLabel = 'Primário',
  secondaryLabel = 'Secundário',
  primaryColor = 'bg-emerald-500 hover:bg-emerald-600',
  secondaryColor = 'bg-red-400 hover:bg-red-500',
  isLoading = false,
}: SimpleBarChartProps) {
  if (isLoading) {
    return <ChartSkeleton type="bar" height={height} />
  }

  const hasSecondary = data.some(item => item.secondaryValue !== undefined)
  const allValues = data.flatMap(d => [d.value, d.secondaryValue].filter(Boolean)) as number[]
  const maxValue = Math.max(...allValues)

  return (
    <div className="space-y-3">
      {showLegend && (
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${primaryColor.split(' ')[0]}`} />
            <span className="text-gray-600 dark:text-gray-400">{primaryLabel}</span>
          </div>
          {hasSecondary && (
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${secondaryColor.split(' ')[0]}`} />
              <span className="text-gray-600 dark:text-gray-400">{secondaryLabel}</span>
            </div>
          )}
        </div>
      )}
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-1 items-end" style={{ height }}>
              <div 
                className={`flex-1 ${primaryColor} rounded-t-sm transition-all cursor-pointer`}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
                title={`${primaryLabel}: ${item.value.toLocaleString('pt-BR')}`}
              />
              {hasSecondary && item.secondaryValue !== undefined && (
                <div 
                  className={`flex-1 ${secondaryColor} rounded-t-sm transition-all cursor-pointer`}
                  style={{ height: `${(item.secondaryValue / maxValue) * 100}%` }}
                  title={`${secondaryLabel}: ${item.secondaryValue.toLocaleString('pt-BR')}`}
                />
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
