import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { logger } from '@/lib/logger'
import { getTenantFromSubdomain } from '@/lib/tenant'

/**
 * Componente que sincroniza automaticamente o usuário com o backend após login
 * Deve ser montado dentro do AuthProvider
 */
export function AuthSync() {
  const { user, session, loading } = useAuth()
  const hasSynced = useRef(false)

  useEffect(() => {
    const syncUser = async () => {
      // Não sincronizar se:
      // - Ainda está carregando
      // - Não está autenticado
      // - Não tem sessão/token
      // - Já sincronizou nesta sessão
      if (loading || !user || !session?.access_token || hasSynced.current) {
        return
      }

      try {
        logger.info('Starting user sync', 'AuthSync', {
          userId: user.id,
          userEmail: user.email,
        })

        // Obter token de acesso da sessão
        const token = session.access_token
        const tenantSubdomain = getTenantFromSubdomain()

        // Chamar endpoint de sincronização
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(tenantSubdomain && { 'x-tenant-id': tenantSubdomain }),
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Sync failed with status ${response.status}`)
        }

        const data = await response.json()
        
        logger.info('User synced successfully', 'AuthSync', {
          userId: data.user?.id,
          userEmail: data.user?.email,
          tenantId: data.user?.tenant_id,
        })

        // Marcar como sincronizado
        hasSynced.current = true
      } catch (error: any) {
        logger.error('Failed to sync user', error.message, 'AuthSync', {
          error: error.message,
          userId: user?.id,
        })
        
        // Não bloquear a aplicação por erro de sync
        // O sync será tentado novamente em outras requisições
      }
    }

    syncUser()
  }, [user, session, loading])

  // Este componente não renderiza nada
  return null
}
