import { useAuth } from '@/contexts/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SchoolSelector } from '@/components/SchoolSelector'
import { Sidebar } from '@/components/Sidebar'
import { logger } from '@/lib/logger'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth()
  const queryClient = useQueryClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)
      logger.info('Logout initiated', 'Layout', { userId: user?.id })

      // 1. Limpar cache do React Query
      queryClient.clear()

      // 2. Resetar PostHog
      logger.reset()

      // 3. Limpar COMPLETAMENTE localStorage
      localStorage.clear()

      // 4. Limpar COMPLETAMENTE sessionStorage
      sessionStorage.clear()

      // 5. Limpar cookies (melhor esforço)
      document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0].trim()
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
      })

      // 6. Fazer logout do Supabase
      await signOut()

      // 7. Forçar reload completo da página (limpa tudo da memória)
      setTimeout(() => {
        window.location.replace('/login')
      }, 100)
    } catch (error) {
      logger.error('Error during logout', 'Layout', { error })
      
      // Fallback: limpar TUDO e forçar reload
      try {
        queryClient.clear()
        logger.reset()
        localStorage.clear()
        sessionStorage.clear()
        
        // Limpar cookies
        document.cookie.split(';').forEach((cookie) => {
          const name = cookie.split('=')[0].trim()
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        })
      } catch (e) {
        console.error('Error clearing storage:', e)
      }
      
      // Forçar reload completo
      window.location.replace('/login')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">SmartGesti Ensino</h1>
          <div className="flex items-center gap-4">
            <SchoolSelector />
            <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2 inline-block"></div>
                  Saindo...
                </>
              ) : (
                'Sair'
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Layout com Sidebar */}
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
