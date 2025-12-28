import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { apiRequest } from '@/services/api'
import { Tenant } from '@/types'

export default function Login() {
  const { loginWithRedirect, isLoading, isAuthenticated, error } = useAuth0()
  const navigate = useNavigate()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loadingTenant, setLoadingTenant] = useState(true)

  useEffect(() => {
    // Buscar informações do tenant pelo subdomínio
    const tenantSubdomain = getTenantFromSubdomain()

    if (tenantSubdomain) {
      apiRequest<Tenant>(`/api/tenants/${tenantSubdomain}`)
        .then((data) => {
          setTenant(data)
        })
        .catch((err) => {
          logger.warn('Tenant not found', 'LoginPage', { subdomain: tenantSubdomain, error: err })
          // Se não encontrar, usar o subdomain como nome
          setTenant({ name: tenantSubdomain } as Tenant)
        })
        .finally(() => setLoadingTenant(false))
    } else {
      setLoadingTenant(false)
    }
  }, [])

  useEffect(() => {
    logger.info('Login page loaded', 'LoginPage', {
      isAuthenticated,
      isLoading,
      error: error?.message,
      tenant: tenant?.name,
      url: window.location.href,
      hasCode: window.location.search.includes('code='),
    })

    // Se o usuário já está autenticado, redireciona para seleção de escola
    // Mas não redirecionar se ainda está processando o callback (tem code= na URL)
    if (isAuthenticated && !isLoading && !window.location.search.includes('code=')) {
      logger.info('User already authenticated, redirecting to select school', 'LoginPage')
      navigate('/selecionar-escola', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, error, tenant])

  const handleLogin = () => {
    logger.info('Login button clicked', 'LoginPage', { provider: 'google', tenant: tenant?.name })
    
    // Salvar tenant no localStorage antes de fazer login
    const tenantSubdomain = getTenantFromSubdomain()
    if (tenantSubdomain) {
      localStorage.setItem('current_tenant', tenantSubdomain)
      logger.info('Tenant saved for OAuth flow', 'LoginPage', { tenant: tenantSubdomain })
    }
    
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
      },
      appState: {
        returnTo: '/selecionar-escola',
        tenant: tenantSubdomain, // Incluir tenant no appState também
      },
    })
  }

  if (loadingTenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          {tenant?.logo_url && (
            <div className="flex justify-center mb-4">
              <img src={tenant.logo_url} alt={tenant.name} className="h-16 w-auto" />
            </div>
          )}
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {tenant ? `Bem-vindo à ${tenant.name}` : 'SmartGesti Ensino'}
          </CardTitle>
          <CardDescription className="text-lg">
            {tenant ? 'Sistema de gestão educacional' : 'Acesse sua instituição através do subdomínio'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold">Erro ao fazer login:</p>
              <p>{error.message}</p>
              {error.message === 'Invalid state' && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs">
                    Erro de estado do OAuth. Tente limpar o cache do navegador.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Limpar todo o cache do Auth0
                      const auth0Keys = Object.keys(localStorage).filter(key => 
                        key.includes('@@auth0spajs@@') || key.includes('auth0')
                      )
                      auth0Keys.forEach(key => localStorage.removeItem(key))
                      const auth0SessionKeys = Object.keys(sessionStorage).filter(key => 
                        key.includes('@@auth0spajs@@') || key.includes('auth0')
                      )
                      auth0SessionKeys.forEach(key => sessionStorage.removeItem(key))
                      window.location.reload()
                    }}
                  >
                    Limpar Cache e Recarregar
                  </Button>
                </div>
              )}
            </div>
          )}
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Carregando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Ao entrar, você receberá um código de verificação por email
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
