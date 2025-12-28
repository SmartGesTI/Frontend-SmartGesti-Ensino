import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { StatCardSkeleton } from '../skeletons'
import type { StatCardColor, StatCardVariant, LoadableProps } from '@/types/dashboard'

interface StatCardProps extends LoadableProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  subtitle?: string
  color: StatCardColor
  variant?: StatCardVariant
}

const gradientColors: Record<StatCardColor, string> = {
  blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
  green: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
  purple: 'from-purple-500 to-purple-600 shadow-purple-500/25',
  orange: 'from-orange-500 to-orange-600 shadow-orange-500/25',
  pink: 'from-pink-500 to-pink-600 shadow-pink-500/25',
  red: 'from-red-500 to-red-600 shadow-red-500/25',
  yellow: 'from-amber-500 to-amber-600 shadow-amber-500/25',
}

const gradientIconBg: Record<StatCardColor, string> = {
  blue: 'bg-blue-400/30',
  green: 'bg-emerald-400/30',
  purple: 'bg-purple-400/30',
  orange: 'bg-orange-400/30',
  pink: 'bg-pink-400/30',
  red: 'bg-red-400/30',
  yellow: 'bg-amber-400/30',
}

const softBg: Record<StatCardColor, string> = {
  blue: 'bg-blue-50 dark:bg-blue-950/30',
  green: 'bg-emerald-50 dark:bg-emerald-950/30',
  purple: 'bg-purple-50 dark:bg-purple-950/30',
  orange: 'bg-orange-50 dark:bg-orange-950/30',
  pink: 'bg-pink-50 dark:bg-pink-950/30',
  red: 'bg-red-50 dark:bg-red-950/30',
  yellow: 'bg-amber-50 dark:bg-amber-950/30',
}

const softIconClasses: Record<StatCardColor, string> = {
  blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50',
  green: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50',
  purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50',
  orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50',
  pink: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/50',
  red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50',
  yellow: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50',
}

const softValueClasses: Record<StatCardColor, string> = {
  blue: 'text-blue-700 dark:text-blue-300',
  green: 'text-emerald-700 dark:text-emerald-300',
  purple: 'text-purple-700 dark:text-purple-300',
  orange: 'text-orange-700 dark:text-orange-300',
  pink: 'text-pink-700 dark:text-pink-300',
  red: 'text-red-700 dark:text-red-300',
  yellow: 'text-amber-700 dark:text-amber-300',
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel, 
  subtitle, 
  color,
  variant = 'gradient',
  isLoading = false
}: StatCardProps) {
  if (isLoading) {
    return <StatCardSkeleton variant={variant} />
  }

  if (variant === 'soft') {
    return (
      <Card className={`${softBg[color]} border-0 shadow-sm dark:shadow-gray-950/50`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
              <p className={`text-xl font-bold ${softValueClasses[color]}`}>{value}</p>
              {trend !== undefined && (
                <div className="flex items-center gap-1 text-xs">
                  {trend >= 0 ? (
                    <ArrowUpRight className={`w-3 h-3 ${color === 'red' ? 'text-red-500' : 'text-emerald-500'}`} />
                  ) : (
                    <ArrowDownRight className={`w-3 h-3 ${color === 'green' ? 'text-red-500' : 'text-emerald-500'}`} />
                  )}
                  <span className={`font-medium ${
                    (trend >= 0 && color !== 'red') || (trend < 0 && color === 'red') 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {Math.abs(trend).toFixed(1)}%
                  </span>
                  {trendLabel && <span className="text-gray-500 dark:text-gray-400">{trendLabel}</span>}
                </div>
              )}
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
              )}
            </div>
            <div className={`p-2.5 rounded-xl ${softIconClasses[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Gradient variant (default)
  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${gradientColors[color]} text-white border-0 shadow-lg`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {trend >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="font-medium">
                  {trend >= 0 ? '+' : ''}{typeof trend === 'number' ? trend.toFixed(1) : trend}
                </span>
                {trendLabel && <span className="text-white/70">{trendLabel}</span>}
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-white/70">{subtitle}</p>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${gradientIconBg[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
      {/* Decorative circles */}
      <div className="absolute -right-3 -bottom-3 w-20 h-20 bg-white/10 rounded-full" />
      <div className="absolute -right-1 -bottom-6 w-12 h-12 bg-white/10 rounded-full" />
    </Card>
  )
}
