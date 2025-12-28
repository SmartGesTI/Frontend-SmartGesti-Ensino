import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { StatCardSkeleton } from '../skeletons'
import type { StatCardColor, LoadableProps } from '@/types/dashboard'

interface StatCardProps extends LoadableProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  subtitle?: string
  color: StatCardColor
}

// Classes para modo claro (soft) e escuro (gradient)
const cardClasses: Record<StatCardColor, string> = {
  blue: 'bg-blue-50 dark:bg-gradient-to-br dark:from-blue-500 dark:to-blue-600 dark:shadow-blue-500/25',
  green: 'bg-emerald-50 dark:bg-gradient-to-br dark:from-emerald-500 dark:to-emerald-600 dark:shadow-emerald-500/25',
  purple: 'bg-purple-50 dark:bg-gradient-to-br dark:from-purple-500 dark:to-purple-600 dark:shadow-purple-500/25',
  orange: 'bg-orange-50 dark:bg-gradient-to-br dark:from-orange-500 dark:to-orange-600 dark:shadow-orange-500/25',
  pink: 'bg-pink-50 dark:bg-gradient-to-br dark:from-pink-500 dark:to-pink-600 dark:shadow-pink-500/25',
  red: 'bg-red-50 dark:bg-gradient-to-br dark:from-red-500 dark:to-red-600 dark:shadow-red-500/25',
  yellow: 'bg-amber-50 dark:bg-gradient-to-br dark:from-amber-500 dark:to-amber-600 dark:shadow-amber-500/25',
}

const iconBgClasses: Record<StatCardColor, string> = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-400/30 dark:text-white',
  green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-400/30 dark:text-white',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-400/30 dark:text-white',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-400/30 dark:text-white',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-400/30 dark:text-white',
  red: 'bg-red-100 text-red-600 dark:bg-red-400/30 dark:text-white',
  yellow: 'bg-amber-100 text-amber-600 dark:bg-amber-400/30 dark:text-white',
}

const valueClasses: Record<StatCardColor, string> = {
  blue: 'text-blue-700 dark:text-white',
  green: 'text-emerald-700 dark:text-white',
  purple: 'text-purple-700 dark:text-white',
  orange: 'text-orange-700 dark:text-white',
  pink: 'text-pink-700 dark:text-white',
  red: 'text-red-700 dark:text-white',
  yellow: 'text-amber-700 dark:text-white',
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel, 
  subtitle, 
  color,
  isLoading = false
}: StatCardProps) {
  if (isLoading) {
    return <StatCardSkeleton />
  }

  return (
    <Card className={`relative overflow-hidden ${cardClasses[color]} border-0 shadow-sm dark:shadow-lg dark:text-white`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-white/80">{title}</p>
            <p className={`text-xl dark:text-2xl font-bold ${valueClasses[color]}`}>{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {/* Modo claro */}
                <span className="dark:hidden flex items-center gap-1">
                  {trend >= 0 ? (
                    <ArrowUpRight className={`w-3 h-3 ${color === 'red' ? 'text-red-500' : 'text-emerald-500'}`} />
                  ) : (
                    <ArrowDownRight className={`w-3 h-3 ${color === 'green' ? 'text-red-500' : 'text-emerald-500'}`} />
                  )}
                  <span className={`font-medium ${
                    (trend >= 0 && color !== 'red') || (trend < 0 && color === 'red') 
                      ? 'text-emerald-600' 
                      : 'text-red-600'
                  }`}>
                    {Math.abs(trend).toFixed(1)}%
                  </span>
                  {trendLabel && <span className="text-gray-500">{trendLabel}</span>}
                </span>
                {/* Modo escuro */}
                <span className="hidden dark:flex items-center gap-1">
                  {trend >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="font-medium">
                    {trend >= 0 ? '+' : ''}{trend.toFixed(1)}
                  </span>
                  {trendLabel && <span className="text-white/70">{trendLabel}</span>}
                </span>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-white/70">{subtitle}</p>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${iconBgClasses[color]}`}>
            <Icon className="w-5 h-5 dark:w-6 dark:h-6" />
          </div>
        </div>
      </CardContent>
      {/* Decorative circles - apenas no modo escuro */}
      <div className="absolute -right-3 -bottom-3 w-20 h-20 bg-white/10 rounded-full hidden dark:block" />
      <div className="absolute -right-1 -bottom-6 w-12 h-12 bg-white/10 rounded-full hidden dark:block" />
    </Card>
  )
}
