import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'

export function useAccessToken() {
  const { session, user, loading } = useAuth()
  const [token, setToken] = useState<string | null>(null)
  const [isTokenLoading, setIsTokenLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchToken = async () => {
      // Se não está autenticado ou ainda está carregando, não buscar token
      if (!user || !session || loading) {
        if (isMounted) {
          setIsTokenLoading(false)
          setToken(null)
        }
        return
      }

      try {
        setIsTokenLoading(true)
        setError(null)
        
        // Obter token da sessão do Supabase
        const accessToken = session.access_token
        
        if (isMounted) {
          setToken(accessToken)
          logger.info('Access token obtained successfully', 'useAccessToken')
        }
      } catch (err) {
        logger.error('Failed to get access token', 'useAccessToken', { error: err })
        if (isMounted) {
          setError(err as Error)
          setToken(null)
        }
      } finally {
        if (isMounted) {
          setIsTokenLoading(false)
        }
      }
    }

    fetchToken()

    return () => {
      isMounted = false
    }
  }, [user, session, loading])

  return {
    token,
    isLoading: isTokenLoading || loading,
    error,
    isReady: !isTokenLoading && !loading && !!user && !!token,
  }
}
