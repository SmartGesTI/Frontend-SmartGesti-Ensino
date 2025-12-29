import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import type { HelpItem } from '@/components/HelpButton'

export interface HelpPanelContent {
  title: string
  description?: string
  items?: HelpItem[]  // Para uso com HelpButton
  customContent?: ReactNode  // Para conteúdo customizado
  width?: 'default' | 'large' | number  // 'default' = 320px/380px, 'large' = 640px/760px
  variant?: 'help' | 'custom'
}

interface HelpPanelContextType {
  isOpen: boolean
  content: HelpPanelContent | null
  openPanel: (content: HelpPanelContent) => void
  closePanel: () => void
  togglePanel: (content: HelpPanelContent) => void
}

const HelpPanelContext = createContext<HelpPanelContextType | undefined>(undefined)

export function HelpPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<HelpPanelContent | null>(null)

  const openPanel = useCallback((newContent: HelpPanelContent) => {
    setContent(newContent)
    setIsOpen(true)
  }, [])

  const closePanel = useCallback(() => {
    setIsOpen(false)
  }, [])

  const togglePanel = useCallback((newContent: HelpPanelContent) => {
    // Para conteúdo customizado, sempre alterna (não compara por título)
    if (newContent.variant === 'custom') {
      if (isOpen && content?.variant === 'custom') {
        setIsOpen(false)
      } else {
        setContent(newContent)
        setIsOpen(true)
      }
    } else {
      // Para conteúdo help, compara por título (comportamento original)
      if (isOpen && content?.title === newContent.title) {
        setIsOpen(false)
      } else {
        setContent(newContent)
        setIsOpen(true)
      }
    }
  }, [isOpen, content])

  return (
    <HelpPanelContext.Provider value={{ isOpen, content, openPanel, closePanel, togglePanel }}>
      {children}
    </HelpPanelContext.Provider>
  )
}

export function useHelpPanel() {
  const context = useContext(HelpPanelContext)
  if (!context) {
    throw new Error('useHelpPanel must be used within HelpPanelProvider')
  }
  return context
}
