import { X, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useHelpPanel } from '@/contexts/HelpPanelContext'
import { useHelpHighlight, type HighlightTarget } from '@/contexts/HelpHighlightContext'
import type { IconColor } from '@/components/HelpButton'

/** Classes de cores para os ícones dos cards */
const iconColorClasses: Record<IconColor, { bg: string; text: string; shadow: string }> = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-blue-500/30',
  },
  emerald: {
    bg: 'bg-emerald-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-emerald-500/30',
  },
  amber: {
    bg: 'bg-amber-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-amber-500/30',
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-purple-500/30',
  },
  rose: {
    bg: 'bg-rose-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-rose-500/30',
  },
  cyan: {
    bg: 'bg-cyan-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-cyan-500/30',
  },
  indigo: {
    bg: 'bg-indigo-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-indigo-500/30',
  },
  orange: {
    bg: 'bg-orange-500',
    text: 'text-white',
    shadow: 'shadow-lg shadow-orange-500/30',
  },
}

export function HelpPanel() {
  const { isOpen, content, closePanel } = useHelpPanel()
  const { setHighlightedElement } = useHelpHighlight()

  const handleMouseEnter = (target: HighlightTarget) => {
    if (target) {
      setHighlightedElement(target)
    }
  }

  const handleMouseLeave = () => {
    setHighlightedElement(null)
  }

  const handleClose = () => {
    setHighlightedElement(null)
    closePanel()
  }

  return (
    <div
      className={cn(
        'fixed top-0 right-0 h-full w-[320px] sm:w-[380px] z-50',
        'bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700',
        'flex flex-col shadow-2xl',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {content && (
        <>
          {/* Header Fixo */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-b from-blue-50/80 to-transparent dark:from-blue-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {content.title}
                  </h2>
                  {content.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {content.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-1.5 opacity-70 transition-all hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Conteúdo com Scroll */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-3">
              {content.items.map((item, index) => (
                <div
                  key={index}
                  onMouseEnter={() => handleMouseEnter(item.highlightTarget || null)}
                  onMouseLeave={handleMouseLeave}
                  className={cn(
                    'p-4 rounded-xl cursor-pointer',
                    'bg-gray-50 dark:bg-gray-800/50',
                    'border border-gray-100 dark:border-gray-700/50',
                    'transition-all duration-200',
                    'hover:bg-blue-50 dark:hover:bg-blue-950/30',
                    'hover:border-blue-200 dark:hover:border-blue-800',
                    'hover:shadow-md hover:shadow-blue-500/5'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {item.icon && (
                      <div className={cn(
                        'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center',
                        item.iconColor 
                          ? cn(iconColorClasses[item.iconColor].bg, iconColorClasses[item.iconColor].text, iconColorClasses[item.iconColor].shadow)
                          : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                      )}>
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              Passe o mouse sobre um item para destacar o elemento na tela
            </p>
          </div>
        </>
      )}
    </div>
  )
}
