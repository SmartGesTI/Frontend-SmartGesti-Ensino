import { LucideIcon, Construction } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface PlaceholderTabProps {
  title: string
  description: string
  icon: LucideIcon
}

export function PlaceholderTab({ title, description, icon: Icon }: PlaceholderTabProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
            <Icon className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Construction className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-md">{description}</p>
        <div className="mt-6 px-4 py-2 rounded-full bg-amber-100/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-medium">
          Em desenvolvimento
        </div>
      </CardContent>
    </Card>
  )
}
