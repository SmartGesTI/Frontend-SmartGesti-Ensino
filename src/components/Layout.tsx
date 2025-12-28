import { useAuth } from '@/contexts/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SchoolSelector } from '@/components/SchoolSelector'
import { Sidebar } from '@/components/Sidebar'
import { logger } from '@/lib/logger'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { clearAllSessionData } from '@/lib/storage'

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

      // 3. Limpar storage (preserva tema)
      clearAllSessionData()

      // 4. Fazer logout do Supabase
      await signOut()

      // 5. Forçar reload completo da página
      setTimeout(() => {
        window.location.replace('/login')
      }, 100)
    } catch (error) {
      logger.error('Error during logout', 'Layout', { error })
      
      // Fallback: limpar e forçar reload
      try {
        queryClient.clear()
        logger.reset()
        clearAllSessionData()
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
      <header className="border-b border-gray-200 dark:border-gray-700 bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">SmartGesti Ensino</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <SchoolSelector />
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:border-red-300 dark:hover:border-red-700"
            >
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
