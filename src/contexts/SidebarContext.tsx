import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarContextType {
  isExpanded: boolean
  toggleSidebar: () => void
  setExpanded: (expanded: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

const STORAGE_KEY = 'smartgesti-sidebar-expanded'

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Recuperar estado do localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? stored === 'true' : true // Default: expandido
  })

  // Persistir no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isExpanded))
  }, [isExpanded])

  const toggleSidebar = () => {
    setIsExpanded(prev => !prev)
  }

  const setExpanded = (expanded: boolean) => {
    setIsExpanded(expanded)
  }

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
