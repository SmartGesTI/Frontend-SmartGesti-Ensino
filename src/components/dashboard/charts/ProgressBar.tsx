interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
}

export function ProgressBar({ 
  value, 
  max = 100, 
  color,
  size = 'md',
  showPercentage = false 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  // Auto color based on percentage if not provided
  const barColor = color || (
    percentage >= 70 ? 'bg-emerald-500' : 
    percentage >= 50 ? 'bg-amber-500' : 
    'bg-red-500'
  )
  
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`${sizeClasses[size]} rounded-full transition-all ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {percentage.toFixed(0)}%
        </p>
      )}
    </div>
  )
}
