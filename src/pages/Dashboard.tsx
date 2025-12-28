import { useAuth } from '@/contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiRequest } from '@/services/api'
import { User } from '@/types'
import { logger } from '@/lib/logger'
import { useAccessToken } from '@/hooks/useAccessToken'
import { useSchool } from '@/contexts/SchoolContext'

export default function Dashboard() {
  const { user } = useAuth()
  const { token, isReady, isLoading: tokenLoading } = useAccessToken()
  const navigate = useNavigate()
  const { slug, schoolId, school, isLoading: isLoadingSchool, error: schoolError } = useSchool()

  // Validar se slug existe, senão redirecionar para seleção
  useEffect(() => {
    if (!isLoadingSchool && !slug) {
      logger.warn('No school slug in URL, redirecting to select school', 'Dashboard')
      navigate('/selecionar-escola', { replace: true })
    }
  }, [slug, isLoadingSchool, navigate])

  const { data: userData, isLoading, error: userError } = useQuery({
    queryKey: ['user', user?.id, token],
    queryFn: async () => {
      if (!token) throw new Error('No token available')
      return apiRequest<User>('/api/users/me', {}, token, schoolId || null)
    },
    enabled: isReady && !!user && !!token && !!schoolId,
    retry: 1,
    staleTime: 30000, // 30 seconds
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Bem-vindo ao sistema de gestão educacional</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
          <CardDescription>Informações do usuário e escola atual</CardDescription>
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
                  <p>
                    <strong>Nome:</strong> {userData?.full_name || user?.name || 'N/A'}
                  </p>
                  <p>
                    <strong>Email:</strong> {userData?.email || user?.email || 'N/A'}
                  </p>
                  {user?.picture && (
                    <img src={user.picture} alt="Avatar" className="w-16 h-16 rounded-full" />
                  )}
                </div>
              </div>
              {school && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Escola Atual</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Nome:</strong> {school.name}
                    </p>
                    {school.code && (
                      <p>
                        <strong>Código:</strong> {school.code}
                      </p>
                    )}
                    {school.endereco_cidade && school.endereco_estado && (
                      <p>
                        <strong>Localização:</strong> {school.endereco_cidade}/{school.endereco_estado}
                      </p>
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
    </div>
  )
}
