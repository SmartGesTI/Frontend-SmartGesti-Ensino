import { createContext, useContext, useState, ReactNode } from 'react'

/** Target pode ser qualquer string identificadora de elemento */
export type HighlightTarget = string | null

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
  // Para elementos gerais (cards, botões, etc)
  active: 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 rounded-lg scale-105 z-50',
  // Para inputs - simula estado de focus sem alterar tamanho
  inputActive: '[&_input]:ring-2 [&_input]:ring-blue-500 [&_input]:border-blue-500 [&_textarea]:ring-2 [&_textarea]:ring-blue-500 [&_textarea]:border-blue-500',
  // Para labels - muda cor para azul
  labelActive: '[&_label]:text-blue-600 [&_label]:dark:text-blue-400 [&_label]:font-semibold',
}
