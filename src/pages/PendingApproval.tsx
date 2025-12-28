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
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useQueryClient } from '@tanstack/react-query'
import { clearAllSessionData } from '@/lib/storage'

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

      // Limpar storage (preserva tema)
      clearAllSessionData()

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
        clearAllSessionData()
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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      {/* Botão de Tema */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-border bg-card">
        <CardHeader className="text-center bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent pb-6 pt-8 px-8 border-b-2 border-border">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-700 shadow-lg">
              <AvatarImage src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture} alt={user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User'} />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">{getUserInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">Aguardando Aprovação</CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">Seu acesso está pendente</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <Alert className="animate-in fade-in">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Acesso Pendente</AlertTitle>
            <AlertDescription>
              Você não está vinculado a nenhuma escola ou não possui permissões nesta instituição
              ainda. Entre em contato com o administrador para solicitar acesso.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 bg-gray-100/50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px] text-gray-800 dark:text-gray-100">Nome:</span>
              <span className="text-gray-600 dark:text-gray-400">{user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Não informado'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px] text-gray-800 dark:text-gray-100">Email:</span>
              <span className="text-gray-600 dark:text-gray-400">{user?.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px] text-gray-800 dark:text-gray-100">Instituição:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {tenant?.name || tenantSubdomain || 'Não identificada'}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px] text-gray-800 dark:text-gray-100">Status:</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Aguardando aprovação
              </span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 text-lg">
              O que fazer agora?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span>Entre em contato com o administrador da instituição</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span>Aguarde a aprovação do seu acesso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span>Você receberá um email quando seu acesso for liberado</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:border-red-300 dark:hover:border-red-700"
              size="sm"
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
            <Button onClick={handleContactAdmin} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Contatar Administrador
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
