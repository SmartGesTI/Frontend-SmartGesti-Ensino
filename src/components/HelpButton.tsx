import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { useHelpPanel } from '@/contexts/HelpPanelContext'

export type HelpSize = 'xs' | 'sm' | 'md' | 'lg'
export type HighlightTarget = 'school-selector' | 'theme-toggle' | 'notifications' | 'user-menu' | 'sidebar-toggle' | 'search-bar' | null
export type IconColor = 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan' | 'indigo' | 'orange'

export interface HelpItem {
  title: string
  description: string
  icon?: ReactNode
  /** ID do elemento para destacar no hover */
  highlightTarget?: HighlightTarget
  /** Cor do ícone - cada item pode ter uma cor diferente */
  iconColor?: IconColor
}

interface HelpButtonProps {
  /** Título do painel de ajuda */
  title: string
  /** Descrição geral do painel */
  description?: string
  /** Itens de ajuda a serem exibidos */
  items: HelpItem[]
  /** Tamanho do ícone - adapta ao contexto */
  size?: HelpSize
  /** Classes adicionais para o botão */
  className?: string
}

const sizeClasses: Record<HelpSize, { button: string; icon: string }> = {
  xs: {
    button: 'w-5 h-5',
    icon: 'w-3.5 h-3.5',
  },
  sm: {
    button: 'w-7 h-7',
    icon: 'w-4 h-4',
  },
  md: {
    button: 'w-9 h-9',
    icon: 'w-5 h-5',
  },
  lg: {
    button: 'w-11 h-11',
    icon: 'w-6 h-6',
  },
}

export function HelpButton({
  title,
  description,
  items,
  size = 'sm',
  className,
}: HelpButtonProps) {
  const sizes = sizeClasses[size]
  const { togglePanel } = useHelpPanel()

  const handleClick = () => {
    togglePanel({ title, description, items })
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'text-gray-400 dark:text-gray-500',
        'hover:text-blue-500 dark:hover:text-blue-400',
        'hover:bg-blue-50 dark:hover:bg-blue-950/50',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
        sizes.button,
        className
      )}
      aria-label="Ajuda"
    >
      <HelpCircle className={sizes.icon} />
    </button>
  )
}
