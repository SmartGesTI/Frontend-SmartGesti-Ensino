import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider, AppState } from '@auth0/auth0-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { getTenantFromSubdomain } from './lib/tenant'
import { logger } from './lib/logger'

const queryClient = new QueryClient()

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE

if (!auth0Domain || !auth0ClientId || !auth0Audience) {
  throw new Error('Missing Auth0 environment variables')
}

// Chave para identificar a sessão por tenant
const TENANT_SESSION_KEY = 'auth_tenant_session'

// Verifica se o tenant mudou e limpa a sessão se necessário
function checkAndClearTenantSession(): boolean {
  const currentTenant = getTenantFromSubdomain() || 'default'
  const savedTenantSession = localStorage.getItem(TENANT_SESSION_KEY)
  
  if (savedTenantSession && savedTenantSession !== currentTenant) {
    logger.warn('Tenant changed, clearing session', 'TenantCheck', {
      previousTenant: savedTenantSession,
      currentTenant,
    })
    
    // Limpar TODA a sessão Auth0 e dados relacionados
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('@@auth0spajs@@') || 
      key.includes('auth0') ||
      key === 'current_tenant' ||
      key.startsWith('school') ||
      key.startsWith('user')
    )
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    // Limpar também o queryClient
    queryClient.clear()
    
    // Salvar novo tenant
    localStorage.setItem(TENANT_SESSION_KEY, currentTenant)
    localStorage.setItem('current_tenant', currentTenant)
    
    return true // Sessão foi limpa
  }
  
  // Salvar tenant atual se não existia
  if (!savedTenantSession) {
    localStorage.setItem(TENANT_SESSION_KEY, currentTenant)
    localStorage.setItem('current_tenant', currentTenant)
  }
  
  return false // Sessão não foi limpa
}

// Componente wrapper para usar useNavigate dentro do Auth0Provider
function AppWithAuth0() {
  const navigate = useNavigate()
  const [isReady, setIsReady] = useState(false)

  // Verificar tenant ao montar
  useEffect(() => {
    const wasCleared = checkAndClearTenantSession()
    if (wasCleared) {
      // Recarregar a página para garantir sessão limpa
      window.location.reload()
    } else {
      setIsReady(true)
    }
  }, [])

  const onRedirectCallback = (appState?: AppState) => {
    const currentTenant = getTenantFromSubdomain()
    
    logger.info('Auth0 callback received', 'Auth0Callback', { 
      appState, 
      returnTo: appState?.returnTo,
      tenant: (appState as any)?.tenant,
      currentTenant,
      currentUrl: window.location.href
    })
    
    // Salvar tenant da sessão atual
    if (currentTenant) {
      localStorage.setItem(TENANT_SESSION_KEY, currentTenant)
      localStorage.setItem('current_tenant', currentTenant)
    }
    
    // Sempre redirecionar para selecionar-escola após login
    navigate('/selecionar-escola', { replace: true })
  }

  // Usar a URL atual como redirect_uri
  const getRedirectUri = () => {
    const origin = window.location.origin
    const tenant = getTenantFromSubdomain()
    
    if (tenant) {
      localStorage.setItem('current_tenant', tenant)
      localStorage.setItem(TENANT_SESSION_KEY, tenant)
    }
    
    return origin
  }

  const redirectUri = getRedirectUri()

  // Aguardar verificação de tenant
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: auth0Audience,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppWithAuth0 />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
