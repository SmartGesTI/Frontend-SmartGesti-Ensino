import { ChartSkeleton } from '../skeletons'
import type { DonutSegment, LoadableProps } from '@/types/dashboard'

interface DonutChartProps extends LoadableProps {
  segments: DonutSegment[]
  centerValue?: string | number
  centerLabel?: string
  size?: 'sm' | 'md' | 'lg'
  showLegend?: boolean
  statusText?: string
  statusColor?: string
}

const sizeConfig = {
  sm: { svg: 160, radius: 60, stroke: 18, text: 'text-2xl', label: 'text-xs' },
  md: { svg: 180, radius: 70, stroke: 20, text: 'text-3xl', label: 'text-sm' },
  lg: { svg: 220, radius: 80, stroke: 22, text: 'text-4xl', label: 'text-sm' },
}

export function DonutChart({
  segments,
  centerValue,
  centerLabel,
  size = 'md',
  showLegend = true,
  statusText,
  statusColor,
  isLoading = false,
}: DonutChartProps) {
  if (isLoading) {
    return <ChartSkeleton type="donut" />
  }

  const config = sizeConfig[size]
  const circumference = 2 * Math.PI * config.radius
  const total = segments.reduce((acc, seg) => acc + seg.value, 0)
  const center = config.svg / 2

  // Calculate segment offsets
  let currentOffset = 0
  const segmentData = segments.map((segment) => {
    const percent = (segment.value / total) * 100
    const dashOffset = circumference - (percent / 100) * circumference
    const rotation = currentOffset * 3.6 - 90 // Convert percentage to degrees
    currentOffset += percent
    return { ...segment, percent, dashOffset, rotation }
  })

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative">
        <svg width={config.svg} height={config.svg} viewBox={`0 0 ${config.svg} ${config.svg}`}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Segments (rendered in reverse order so first segment appears on top) */}
          {[...segmentData].reverse().map((segment, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={config.radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={config.stroke}
              strokeDasharray={circumference}
              strokeDashoffset={segment.dashOffset}
              style={{
                transform: `rotate(${segment.rotation}deg)`,
                transformOrigin: `${center}px ${center}px`,
              }}
            />
          ))}
        </svg>
        {(centerValue !== undefined || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue !== undefined && (
              <span className={`${config.text} font-bold text-gray-900 dark:text-gray-100`}>
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className={`${config.label} text-gray-500 dark:text-gray-400`}>
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>
      
      {showLegend && (
        <div className="space-y-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: segment.color }}
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {segment.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {segment.label}
                </p>
              </div>
            </div>
          ))}
          {statusText && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className={`text-xs font-medium ${statusColor || 'text-gray-600 dark:text-gray-400'}`}>
                {statusText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
