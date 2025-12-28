import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChartSkeleton } from '../skeletons'
import type { AreaChartDataPoint, AreaChartSeries, LoadableProps } from '@/types/dashboard'

interface AreaChartCardProps extends LoadableProps {
  data: AreaChartDataPoint[]
  series: AreaChartSeries[]
  xAxisKey?: string
  height?: number
}

export function AreaChartCard({
  data,
  series,
  xAxisKey = 'label',
  height = 256,
  isLoading = false,
}: AreaChartCardProps) {
  if (isLoading) {
    return <ChartSkeleton type="area" height={height} />
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            {series.map((s, index) => (
              <linearGradient key={index} id={`color${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis 
            dataKey={xAxisKey}
            className="text-xs"
            tick={{ fill: 'currentColor', fontSize: 12 }}
            axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
            tickLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: 'currentColor', fontSize: 12 }}
            axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
            tickLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)', 
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          {series.map((s, index) => (
            <Area 
              key={index}
              type="monotone" 
              dataKey={s.dataKey}
              stroke={s.color}
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#color${s.dataKey})`}
              name={s.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
