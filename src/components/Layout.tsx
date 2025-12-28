import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { Breadcrumb } from '@/components/Breadcrumb'
import { HelpHighlightProvider } from '@/contexts/HelpHighlightContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { LayoutModeProvider, useLayoutMode } from '@/contexts/LayoutContext'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

function LayoutContent({ children }: LayoutProps) {
  const { layoutMode } = useLayoutMode()
  
  return (
    <div className="min-h-screen bg-background">
      {/* Container principal com sidebar fixa */}
      <div className="flex h-screen">
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
    </div>
  )
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
    <LayoutModeProvider>
    <HelpHighlightProvider>
      <LayoutContent>{children}</LayoutContent>
    </HelpHighlightProvider>
    </LayoutModeProvider>
    </SidebarProvider>
  )
}
