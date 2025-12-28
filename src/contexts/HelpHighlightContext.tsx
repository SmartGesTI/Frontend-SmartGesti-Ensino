import { createContext, useContext, useState, ReactNode } from 'react'

type HighlightTarget = 'school-selector' | 'theme-toggle' | 'notifications' | 'user-menu' | null

interface HelpHighlightContextType {
  highlightedElement: HighlightTarget
  setHighlightedElement: (target: HighlightTarget) => void
}

const HelpHighlightContext = createContext<HelpHighlightContextType | undefined>(undefined)

export function HelpHighlightProvider({ children }: { children: ReactNode }) {
  const [highlightedElement, setHighlightedElement] = useState<HighlightTarget>(null)

  return (
    <HelpHighlightContext.Provider value={{ highlightedElement, setHighlightedElement }}>
      {children}
    </HelpHighlightContext.Provider>
  )
}

export function useHelpHighlight() {
  const context = useContext(HelpHighlightContext)
  if (context === undefined) {
    throw new Error('useHelpHighlight must be used within a HelpHighlightProvider')
  }
  return context
}

// Classes CSS para o efeito de highlight
export const highlightClasses = {
  base: 'transition-all duration-300',
  active: 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 rounded-lg scale-105 z-50',
}
