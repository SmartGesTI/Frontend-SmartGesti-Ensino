import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { routes } from '@/lib/routes'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Verificar se perdemos o subdomínio e restaurá-lo se necessário
        const tenantSubdomain = getTenantFromSubdomain()
        const savedTenant = localStorage.getItem('current_tenant')
        
        // Se não há subdomínio na URL mas temos um salvo, restaurar
        if (!tenantSubdomain && savedTenant && window.location.hostname === 'localhost') {
          const restoredHost = `${savedTenant}.localhost:${window.location.port}`
          const restoredUrl = `${window.location.protocol}//${restoredHost}${window.location.pathname}${window.location.search}${window.location.hash}`
          logger.info('Restoring subdomain before processing callback', 'AuthCallback', {
            savedTenant,
            restoredHost,
            restoredUrl,
          })
          window.location.replace(restoredUrl)
          return // Aguardar o reload com o subdomínio correto
        }

        logger.info('Processing auth callback', 'AuthCallback', {
          url: window.location.href,
          hash: window.location.hash.substring(0, 100), // Primeiros 100 chars
          hostname: window.location.hostname,
          tenantSubdomain,
          savedTenant,
        })

        // O Supabase usa hash fragments (#access_token=...) para OAuth callbacks
        // O cliente Supabase com detectSessionInUrl: true processa automaticamente
        // Mas precisamos aguardar um pouco para ele processar
        
        // Verificar se há erro no hash
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const error = hashParams.get('error')
          const errorDescription = hashParams.get('error_description')
          
          if (error) {
            logger.error('OAuth error in callback', 'AuthCallback', {
              error,
              errorDescription,
            })
            navigate(routes.login(error), { replace: true })
            return
          }

          // Se há hash com access_token, aguardar o Supabase processar
          if (hashParams.get('access_token')) {
            logger.info('Access token found in hash, waiting for Supabase to process', 'AuthCallback')
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }

        // Processar o callback do Supabase
        // O getSession() vai ler o token do hash automaticamente
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          logger.error('Auth callback error', 'AuthCallback', { error: error.message })
          navigate(routes.login('auth_failed'), { replace: true })
          return
        }

        if (data.session) {
          logger.info('Auth callback successful', 'AuthCallback', {
            userId: data.session.user.id,
            email: data.session.user.email,
            emailVerified: data.session.user.email_confirmed_at !== null,
            currentHost: window.location.host,
            currentOrigin: window.location.origin,
          })

          // Salvar tenant se disponível
          const tenantSubdomain = getTenantFromSubdomain()
          if (tenantSubdomain) {
            localStorage.setItem('current_tenant', tenantSubdomain)
            logger.info('Tenant saved in callback', 'AuthCallback', { tenantSubdomain })
          }

          // Limpar hash da URL mas manter o hostname completo (com subdomínio)
          // Se o hostname não tem subdomínio, tentar restaurar do localStorage
          const currentHost = window.location.host
          const protocol = window.location.protocol
          const pathname = window.location.pathname
          const search = window.location.search
          
          // Se não há subdomínio mas temos um tenant salvo, tentar restaurar
          if (!currentHost.includes('.') && tenantSubdomain) {
            const restoredHost = `${tenantSubdomain}.localhost:5173`
            const restoredUrl = `${protocol}//${restoredHost}${pathname}${search}`
            logger.info('Restoring subdomain in URL', 'AuthCallback', { 
              originalHost: currentHost,
              restoredHost,
              restoredUrl,
            })
            window.history.replaceState(null, '', restoredUrl)
          } else {
            // Limpar apenas o hash, manter tudo mais
            window.history.replaceState(null, '', pathname + search)
          }

          // Verificar se email está verificado
          if (!data.session.user.email_confirmed_at) {
            logger.warn('User email not verified', 'AuthCallback', {
              email: data.session.user.email,
            })
            // Redirecionar para página de verificação OTP
            // O email será passado via query param
            navigate(routes.verifyOtp(data.session.user.email || ''), { replace: true })
            return
          }

          // Redirecionar para selecionar escola (manter subdomínio)
          // O navigate já mantém o hostname atual (com subdomínio)
          navigate(routes.selectSchool(), { replace: true })
        } else {
          logger.warn('No session found in callback', 'AuthCallback')
          navigate(routes.login(), { replace: true })
        }
      } catch (error: any) {
        logger.error('Auth callback exception', 'AuthCallback', {
          error: error.message,
          stack: error.stack,
        })
        navigate(routes.login('unknown'), { replace: true })
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Verificando autenticação...</p>
      </div>
    </div>
  )
}
