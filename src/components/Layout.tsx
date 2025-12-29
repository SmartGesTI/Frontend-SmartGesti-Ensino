import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { Breadcrumb } from '@/components/Breadcrumb'
import { HelpHighlightProvider } from '@/contexts/HelpHighlightContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { LayoutModeProvider, useLayoutMode } from '@/contexts/LayoutContext'
import { HelpPanelProvider, useHelpPanel } from '@/contexts/HelpPanelContext'
import { HelpPanel } from '@/components/HelpPanel'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

function LayoutContent({ children }: LayoutProps) {
  const { layoutMode } = useLayoutMode()
  const { isOpen: isHelpPanelOpen, content } = useHelpPanel()
  
  // Calcular margem baseado na largura do panel
  const getMarginClass = () => {
    if (!isHelpPanelOpen) return ''
    
    if (content?.width === 'large') {
      return 'mr-[640px] sm:mr-[760px]'
    }
    // Para valores numéricos, usar style inline (Tailwind não gera classes dinâmicas)
    if (typeof content?.width === 'number') {
      return ''
    }
    // Default
    return 'mr-[320px] sm:mr-[380px]'
  }
  
  const getMarginStyle = () => {
    if (!isHelpPanelOpen || typeof content?.width !== 'number') return undefined
    return { marginRight: `${content.width}px` }
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Container principal que será empurrado pelo HelpPanel */}
      <div 
        className={cn(
          'flex h-screen transition-all duration-300 ease-in-out',
          getMarginClass()
        )}
        style={typeof content?.width === 'number' ? getMarginStyle() : undefined}
      >
        {/* Sidebar - fixa no lado esquerdo */}
        <Sidebar className="hidden lg:flex lg:flex-col h-screen sticky top-0 overflow-visible" />

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Navbar - fixa no topo */}
          <Navbar />
          
          {/* Breadcrumb - abaixo da navbar */}
          <Breadcrumb />

          {/* Área de conteúdo com scroll */}
          <main className="flex-1 overflow-y-auto">
            <div className={cn(
              'p-4 lg:p-6',
              layoutMode === 'contained' && 'container mx-auto max-w-7xl'
            )}>
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Help Panel - fixo à direita, empurra o conteúdo */}
      <HelpPanel />
    </div>
  )
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
    <LayoutModeProvider>
    <HelpPanelProvider>
    <HelpHighlightProvider>
      <LayoutContent>{children}</LayoutContent>
    </HelpHighlightProvider>
    </HelpPanelProvider>
    </LayoutModeProvider>
    </SidebarProvider>
  )
}
