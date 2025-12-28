import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { HelpHighlightProvider } from '@/contexts/HelpHighlightContext'
import { SidebarProvider } from '@/contexts/SidebarContext'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
    <HelpHighlightProvider>
    <div className="min-h-screen bg-background">
      {/* Container principal com sidebar fixa */}
      <div className="flex h-screen">
        {/* Sidebar - fixa no lado esquerdo */}
        <Sidebar className="hidden lg:flex lg:flex-col h-screen sticky top-0 overflow-visible" />

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Navbar - fixa no topo */}
          <Navbar />

          {/* Área de conteúdo com scroll */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
    </HelpHighlightProvider>
    </SidebarProvider>
  )
}
