import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type LayoutMode = 'fluid' | 'contained'

interface LayoutContextType {
  layoutMode: LayoutMode
  setLayoutMode: (mode: LayoutMode) => void
  toggleLayoutMode: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutModeProvider({ children }: { children: ReactNode }) {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(() => {
    // Recuperar do localStorage ou usar 'fluid' como padrão
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('layout-mode')
      return (saved as LayoutMode) || 'fluid'
    }
    return 'fluid'
  })

  useEffect(() => {
    localStorage.setItem('layout-mode', layoutMode)
  }, [layoutMode])

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode)
  }

  const toggleLayoutMode = () => {
    setLayoutModeState(prev => prev === 'fluid' ? 'contained' : 'fluid')
  }

  return (
    <LayoutContext.Provider value={{ layoutMode, setLayoutMode, toggleLayoutMode }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayoutMode() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayoutMode must be used within a LayoutModeProvider')
  }
  return context
}
