import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiRequest } from '@/services/api'
import { School } from '@/types'
import { logger } from '@/lib/logger'
import { useAccessToken } from '@/hooks/useAccessToken'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { useEffect } from 'react'

export default function SelectSchool() {
  const navigate = useNavigate()
  const { token, isReady, isLoading: tokenLoading } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()

  // Buscar TODAS as escolas da instituição (não apenas as que o usuário é membro)
  const { data: schools, isLoading: schoolsLoading } = useQuery({
    queryKey: ['schools-all', token],
    queryFn: async () => {
      if (!token) throw new Error('No token available')
      // Usar ?all=true para buscar todas as escolas da instituição (baseado no subdomain)
      return apiRequest<School[]>('/api/schools?all=true', {}, token)
    },
    enabled: isReady && !!token,
  })

  // Se só tem uma escola, selecionar automaticamente
  useEffect(() => {
    if (schools && schools.length === 1) {
      logger.info('Only one school available, redirecting automatically', 'SelectSchool', {
        slug: schools[0].slug,
        tenantSubdomain,
      })
      navigate(`/escola/${schools[0].slug}/painel`, { replace: true })
    }
  }, [schools, navigate, tenantSubdomain])

  const handleSelectSchool = (school: School) => {
    logger.info('Selecting school', 'SelectSchool', { slug: school.slug, tenantSubdomain })
    navigate(`/escola/${school.slug}/painel`, { replace: true })
  }

  const isLoading = tokenLoading || schoolsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando escolas...</p>
        </div>
      </div>
    )
  }

  // Se não tem escolas disponíveis
  if (!schools || schools.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Nenhuma escola disponível</CardTitle>
            <CardDescription>
              Você ainda não está vinculado a nenhuma escola nesta instituição.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Entre em contato com o administrador da instituição para solicitar acesso.
            </p>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Selecione uma Escola
          </CardTitle>
          <CardDescription className="text-lg">
            {tenantSubdomain ? `Instituição: ${tenantSubdomain}` : 'Escolha a escola que deseja acessar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {schools.map((school) => (
              <Card
                key={school.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary"
                onClick={() => handleSelectSchool(school)}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{school.name}</h3>
                  {school.code && (
                    <p className="text-sm text-muted-foreground">Código: {school.code}</p>
                  )}
                  {school.address && (
                    <p className="text-sm text-muted-foreground mt-1">{school.address}</p>
                  )}
                  <Button className="w-full mt-4" variant="outline">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
