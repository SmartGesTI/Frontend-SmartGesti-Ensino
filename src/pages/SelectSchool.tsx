import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { apiRequest } from '@/services/api'
import { School, User } from '@/types'
import { logger } from '@/lib/logger'
import { useAccessToken } from '@/hooks/useAccessToken'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { useEffect } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

// Componente Skeleton para os cards de escola
function SchoolCardSkeleton() {
  return (
    <Card className="border-2 border-border bg-card">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-9 w-full mt-4" />
      </CardContent>
    </Card>
  )
}

export default function SelectSchool() {
  const navigate = useNavigate()
  const { token, isReady, isLoading: tokenLoading } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()

  // Buscar dados do usuário atual
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['current-user', tenantSubdomain],
    queryFn: async () => {
      if (!token) throw new Error('No token available')
      return apiRequest<User>('/api/users/me', {}, token)
    },
    enabled: isReady && !!token,
    staleTime: 30000, // 30 segundos
  })

  // Buscar TODAS as escolas da instituição (não apenas as que o usuário é membro)
  const { data: schools, isLoading: schoolsLoading } = useQuery({
    queryKey: ['schools-all', tenantSubdomain],
    queryFn: async () => {
      if (!token) throw new Error('No token available')
      // Usar ?all=true para buscar todas as escolas da instituição (baseado no subdomain)
      return apiRequest<School[]>('/api/schools?all=true', {}, token)
    },
    enabled: isReady && !!token,
    staleTime: 30000, // 30 segundos
  })

  // Lógica de redirecionamento com prioridades
  useEffect(() => {
    if (!currentUser || userLoading) return

    // 1. PRIORIDADE MÁXIMA: Verificar email
    if (!currentUser.email_verified) {
      logger.warn('User email not verified, redirecting', 'SelectSchool', {
        userId: currentUser.id,
        email: currentUser.email,
      })
      navigate('/verificar-email', { replace: true })
      return
    }

    // 2. Verificar perfil completo (nome e sobrenome)
    const hasCompletedProfile = currentUser.full_name && 
      currentUser.full_name.trim().split(' ').length >= 2

    if (!hasCompletedProfile) {
      logger.warn('User profile incomplete, redirecting', 'SelectSchool', {
        userId: currentUser.id,
        email: currentUser.email,
        fullName: currentUser.full_name,
      })
      navigate('/completar-cadastro', { replace: true })
      return
    }

    // 3. Verificar tenant_id
    // IMPORTANTE: Se for owner, pode não ter tenant_id ainda (será vinculado automaticamente)
    if (!currentUser.tenant_id) {
      // Verificar se é owner antes de redirecionar para aprovação
      checkIfOwnerWithoutTenant(currentUser.id, currentUser.email)
      return
    }

    // 4. Verificar se tem escolas (mas só após carregar)
    if (!schoolsLoading && schools && schools.length === 0) {
      // Verificar se é owner antes de redirecionar
      checkIfOwner(currentUser.id, currentUser.tenant_id)
    }
  }, [currentUser, userLoading, schools, schoolsLoading, navigate])

  // Função auxiliar para verificar ownership quando não tem tenant_id
  const checkIfOwnerWithoutTenant = async (userId: string, userEmail: string) => {
    try {
      if (!token) {
        navigate('/aguardando-aprovacao', { replace: true })
        return
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/status`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantSubdomain || '',
          },
        }
      )

      if (response.ok) {
        const status = await response.json()
        
        // Se for owner, recarregar dados do usuário para pegar tenant_id atualizado
        if (status.isOwner) {
          logger.info('User is owner, reloading user data to get tenant_id', 'SelectSchool', {
            userId,
            email: userEmail,
          })
          
          // Aguardar um pouco para o backend sincronizar
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Recarregar a página ou refetch do usuário
          window.location.reload()
          return
        }
      }
      
      // Se não for owner, redirecionar para aprovação
      logger.warn('User has no tenant_id and is not owner, redirecting to pending approval', 'SelectSchool', {
        userId,
        email: userEmail,
      })
      navigate('/aguardando-aprovacao', { replace: true })
    } catch (error) {
      logger.error('Failed to check owner status', 'SelectSchool', { error })
      navigate('/aguardando-aprovacao', { replace: true })
    }
  }

  // Função auxiliar para verificar ownership quando tem tenant_id
  const checkIfOwner = async (userId: string, tenantId: string) => {
    try {
      if (!token) return

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/status`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantSubdomain || '',
          },
        }
      )

      if (response.ok) {
        const status = await response.json()
        
        // Se não é owner e não tem escolas, vai para aprovação
        if (!status.isOwner) {
          logger.warn('User is not owner and has no schools, redirecting to pending', 'SelectSchool', {
            userId,
            tenantId,
          })
          navigate('/aguardando-aprovacao', { replace: true })
        }
      }
    } catch (error) {
      logger.error('Failed to check owner status', 'SelectSchool', { error })
    }
  }

  // Se só tem uma escola, selecionar automaticamente
  useEffect(() => {
    if (schools && schools.length === 1 && currentUser?.tenant_id) {
      logger.info('Only one school available, redirecting automatically', 'SelectSchool', {
        slug: schools[0].slug,
        tenantSubdomain,
      })
      navigate(`/escola/${schools[0].slug}/painel`, { replace: true })
    }
  }, [schools, currentUser, navigate, tenantSubdomain])

  const handleSelectSchool = (school: School) => {
    logger.info('Selecting school', 'SelectSchool', { slug: school.slug, tenantSubdomain })
    navigate(`/escola/${school.slug}/painel`, { replace: true })
  }

  const isLoadingInitial = tokenLoading || userLoading
  const isLoadingSchools = schoolsLoading

  // Se não tem escolas disponíveis (após carregar)
  if (!isLoadingInitial && !isLoadingSchools && (!schools || schools.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md shadow-2xl border-2 border-border bg-card">
          <CardHeader className="text-center bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent pb-6 pt-8 px-8 border-b-2 border-border">
            <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Nenhuma escola disponível</CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-300">
              Você ainda não está vinculado a nenhuma escola nesta instituição.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      {/* Botão de Tema */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-4xl shadow-2xl border-2 border-border bg-card">
        <CardHeader className="text-center bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent pb-6 pt-8 px-8 border-b-2 border-border">
          <CardTitle className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            Selecione uma Escola
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            {tenantSubdomain ? `Instituição: ${tenantSubdomain}` : 'Escolha a escola que deseja acessar'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-6 md:grid-cols-2">
            {isLoadingSchools ? (
              // Skeleton cards enquanto carrega
              <>
                <SchoolCardSkeleton />
                <SchoolCardSkeleton />
              </>
            ) : (
              schools?.map((school) => (
                <Card
                  key={school.id}
                  className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-500 border-2 border-border bg-card"
                  onClick={() => handleSelectSchool(school)}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">{school.name}</h3>
                    {school.code && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Código: <span className="font-medium">{school.code}</span></p>
                    )}
                    {school.address && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{school.address}</p>
                    )}
                    <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold" size="sm">
                      Acessar
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
