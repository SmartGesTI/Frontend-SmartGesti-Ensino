import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { InfoIcon, LogOut, Mail } from 'lucide-react'
import { logger } from '@/lib/logger'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'
import { useAccessToken } from '@/hooks/useAccessToken'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface Tenant {
  id: string
  name: string
  subdomain: string
}

export default function PendingApproval() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { token, isReady } = useAccessToken()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const tenantSubdomain = getTenantFromSubdomain()

  // Buscar informações do tenant
  const { data: tenant } = useQuery({
    queryKey: ['tenant', tenantSubdomain],
    queryFn: async () => {
      if (!tenantSubdomain) return null
      try {
        return await apiRequest<Tenant>(`/api/tenants/${tenantSubdomain}`)
      } catch (error) {
        logger.warn('Tenant not found', 'PendingApproval', { subdomain: tenantSubdomain })
        return { name: tenantSubdomain, subdomain: tenantSubdomain } as Tenant
      }
    },
    enabled: !!tenantSubdomain,
  })

  const handleLogout = async () => {
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)
      logger.info('Logout initiated from PendingApproval', 'PendingApproval', { userId: user?.id })

      // Limpar cache do React Query
      queryClient.clear()

      // Resetar PostHog
      logger.reset()

      // Limpar COMPLETAMENTE localStorage
      localStorage.clear()

      // Limpar COMPLETAMENTE sessionStorage
      sessionStorage.clear()

      // Limpar cookies
      document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0].trim()
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
      })

      // Fazer logout do Supabase
      await signOut()

      // Forçar reload completo da página
      setTimeout(() => {
        window.location.replace('/login')
      }, 100)
    } catch (error) {
      logger.error('Error during logout', 'PendingApproval', { error })

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

  const handleContactAdmin = () => {
    // Abrir email para contato com administrador
    const subject = encodeURIComponent('Solicitação de Acesso - SmartGesti Ensino')
    const body = encodeURIComponent(
      `Olá,\n\nGostaria de solicitar acesso à instituição ${tenant?.name || tenantSubdomain}.\n\nMeus dados:\nEmail: ${user?.email}\nNome: ${user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}\n\nAguardo retorno.\n\nAtenciosamente,\n${user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const getUserInitials = () => {
    const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email
    if (!userName) return '?'
    const names = userName.split(' ')
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
    }
    return names[0].charAt(0).toUpperCase()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture} alt={user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User'} />
              <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl font-bold">Aguardando Aprovação</CardTitle>
          <CardDescription className="text-lg">Seu acesso está pendente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Acesso Pendente</AlertTitle>
            <AlertDescription>
              Você não está vinculado a nenhuma escola ou não possui permissões nesta instituição
              ainda. Entre em contato com o administrador para solicitar acesso.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px]">Nome:</span>
              <span className="text-muted-foreground">{user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Não informado'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px]">Email:</span>
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px]">Instituição:</span>
              <span className="text-muted-foreground">
                {tenant?.name || tenantSubdomain || 'Não identificada'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px]">Status:</span>
              <span className="text-yellow-600 dark:text-yellow-500 font-medium">
                Aguardando aprovação
              </span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              O que fazer agora?
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Entre em contato com o administrador da instituição</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Aguarde a aprovação do seu acesso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">•</span>
                <span>Você receberá um email quando seu acesso for liberado</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Saindo...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </>
              )}
            </Button>
            <Button onClick={handleContactAdmin} className="flex-1">
              <Mail className="mr-2 h-4 w-4" />
              Contatar Administrador
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
