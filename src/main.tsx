import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.tsx'
import './index.css'
import { getTenantFromSubdomain } from './lib/tenant'
import { logger } from './lib/logger'
import { ErrorBoundary } from './components/ErrorBoundary'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './contexts/AuthContext'
import { AuthSync } from './components/AuthSync'
import { ThemeProvider } from './contexts/ThemeContext'

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
    
    // Limpar sessão Supabase e dados relacionados
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('sb-') || 
      key.includes('supabase') ||
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

// Componente wrapper para inicialização
function AppWithAuth() {
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

  // Aguardar verificação de tenant
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <AuthSync />
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
        duration={4000}
      />
      <App />
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppWithAuth />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
)
