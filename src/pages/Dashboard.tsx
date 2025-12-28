import { useAuth0 } from '@auth0/auth0-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiRequest } from '@/services/api'
import { User } from '@/types'
import { logger } from '@/lib/logger'
import { SchoolSelector } from '@/components/SchoolSelector'
import { useAccessToken } from '@/hooks/useAccessToken'
import { useSchool } from '@/contexts/SchoolContext'

export default function Dashboard() {
  const { user, logout } = useAuth0()
  const { token, isReady, isLoading: tokenLoading } = useAccessToken()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { slug, schoolId, school, isLoading: isLoadingSchool, error: schoolError } = useSchool()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Validar se slug existe, senão redirecionar para seleção
  useEffect(() => {
    if (!isLoadingSchool && !slug) {
      logger.warn('No school slug in URL, redirecting to select school', 'Dashboard')
      navigate('/selecionar-escola', { replace: true })
    }
  }, [slug, isLoadingSchool, navigate])

  const { data: userData, isLoading, error: userError } = useQuery({
    queryKey: ['user', user?.sub, token],
    queryFn: async () => {
      if (!token) throw new Error('No token available')
      return apiRequest<User>('/api/users/me', {}, token, schoolId || null)
    },
    enabled: isReady && !!user && !!token && !!schoolId,
    retry: 1,
    staleTime: 30000, // 30 seconds
  })

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    try {
      setIsLoggingOut(true)
      logger.info('Logout initiated', 'Dashboard', { userId: user?.sub })
      
      // Limpar cache do React Query
      queryClient.clear()
      
      // Resetar PostHog
      logger.reset()
      
      // Limpar TUDO do localStorage relacionado à sessão (mas manter tenant para saber onde está)
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('@@auth0spajs@@') || 
        key.includes('auth0') ||
        key.startsWith('school') ||
        key.startsWith('user')
      )
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Fazer logout local (sem passar pelo Auth0 para evitar erro)
      logout({
        logoutParams: {
          returnTo: window.location.origin + '/login',
        },
      })
      
      // Redirecionar manualmente após um pequeno delay
      setTimeout(() => {
        window.location.href = '/login'
      }, 100)
      
    } catch (error) {
      logger.error('Error during logout', 'Dashboard', { error })
      // Fallback: limpar tudo e redirecionar
      queryClient.clear()
      logger.reset()
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('@@auth0spajs@@') || 
        key.includes('auth0') ||
        key.startsWith('school') ||
        key.startsWith('user')
      )
      keysToRemove.forEach(key => localStorage.removeItem(key))
      window.location.href = '/login'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">SmartGesti Ensino</h1>
          <div className="flex items-center gap-4">
            <SchoolSelector />
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={isLoggingOut}
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

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Bem-vindo ao sistema de gestão educacional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(isLoading || tokenLoading) ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Carregando...</span>
              </div>
            ) : userError ? (
              <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold">Erro ao carregar dados</p>
                <p className="text-xs mt-1">{userError.message}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Recarregar
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informações do Usuário</h3>
                  <div className="space-y-2">
                    <p><strong>Nome:</strong> {userData?.full_name || user?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {userData?.email || user?.email || 'N/A'}</p>
                    {user?.picture && (
                      <img
                        src={user.picture}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full"
                      />
                    )}
                  </div>
                </div>
                {school && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Escola Atual</h3>
                    <div className="space-y-2">
                      <p><strong>Nome:</strong> {school.name}</p>
                      {school.code && (
                        <p><strong>Código:</strong> {school.code}</p>
                      )}
                      {school.address && (
                        <p><strong>Endereço:</strong> {school.address}</p>
                      )}
                    </div>
                  </div>
                )}
                {schoolError && (
                  <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-semibold">Erro ao carregar escola</p>
                    <p className="text-xs mt-1">{schoolError.message}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema inicializado com sucesso! Autenticação funcionando.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
