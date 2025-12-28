import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { logger } from '@/lib/logger'
import { getTenantFromSubdomain } from '@/lib/tenant'

// Chave única para controlar sync por sessão (persiste entre re-mounts do StrictMode)
const SYNC_SESSION_KEY = 'auth_sync_session'

/**
 * Componente que sincroniza automaticamente o usuário com o backend após login
 * Deve ser montado dentro do AuthProvider
 * 
 * Usa sessionStorage para garantir que sync só acontece 1x por sessão,
 * mesmo com React StrictMode que causa double-render em dev.
 */
export function AuthSync() {
  const { user, session, loading } = useAuth()
  const isSyncingRef = useRef(false)

  useEffect(() => {
    const syncUser = async () => {
      // Não sincronizar se:
      // - Ainda está carregando
      // - Não está autenticado
      // - Não tem sessão/token
      if (loading || !user || !session?.access_token) {
        return
      }

      // Verificar se já sincronizou nesta sessão (usando sessionStorage para persistir entre re-mounts)
      const syncKey = `${SYNC_SESSION_KEY}_${user.id}`
      const lastSyncToken = sessionStorage.getItem(syncKey)
      
      // Se o token é o mesmo, já sincronizou
      if (lastSyncToken === session.access_token) {
        return
      }

      // Evitar chamadas paralelas (StrictMode pode disparar useEffect 2x rapidamente)
      if (isSyncingRef.current) {
        return
      }
      isSyncingRef.current = true

      try {
        logger.info('Starting user sync', 'AuthSync', {
          userId: user.id,
          userEmail: user.email,
        })

        const token = session.access_token
        const tenantSubdomain = getTenantFromSubdomain()

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

        // Marcar como sincronizado para este token
        sessionStorage.setItem(syncKey, token)
      } catch (error: any) {
        logger.error('Failed to sync user', error.message, 'AuthSync', {
          error: error.message,
          userId: user?.id,
        })
      } finally {
        isSyncingRef.current = false
      }
    }

    syncUser()
  }, [user?.id, session?.access_token, loading])

  return null
}
