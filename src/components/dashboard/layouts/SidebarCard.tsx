import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { LoadableProps } from '@/types/dashboard'

interface SidebarCardProps extends LoadableProps {
  title: string
  description?: string
  icon?: React.ElementType
  iconColor?: string
  gradient?: string
  children: React.ReactNode
  footerText?: string
  onFooterClick?: () => void
}

function SidebarCardSkeleton() {
  return (
    <Card className="border border-border shadow-sm dark:shadow-gray-950/50 flex flex-col lg:sticky lg:top-4 lg:max-h-[90vh]">
      <CardHeader className="bg-gray-100 dark:bg-gray-800/50 border-b border-border">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-24" />
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2 py-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </CardContent>
    </Card>
  )
}

export function SidebarCard({
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-500',
  gradient = 'from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20',
  children,
  footerText,
  onFooterClick,
  isLoading = false,
}: SidebarCardProps) {
  if (isLoading) {
    return <SidebarCardSkeleton />
  }

  return (
    <Card className="border border-border shadow-sm dark:shadow-gray-950/50 flex flex-col lg:sticky lg:top-4 lg:max-h-[90vh]">
      <CardHeader className={`bg-gradient-to-r ${gradient} border-b border-border`}>
        <CardTitle className="text-base flex items-center gap-2">
          {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
          {title}
        </CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2">
        {children}
      </CardContent>
      {footerText && (
        <div className="px-5 py-3 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onFooterClick}
          >
            {footerText}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}
    </Card>
  )
}
