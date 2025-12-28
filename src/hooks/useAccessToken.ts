import { useAuth0 } from '@auth0/auth0-react'
import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'

export function useAccessToken() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()
  const [token, setToken] = useState<string | null>(null)
  const [isTokenLoading, setIsTokenLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchToken = async () => {
      // Se não está autenticado ou ainda está carregando, não buscar token
      if (!isAuthenticated || isLoading) {
        if (isMounted) {
          setIsTokenLoading(false)
          setToken(null)
        }
        return
      }

      try {
        setIsTokenLoading(true)
        setError(null)
        
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        })
        
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
  }, [isAuthenticated, isLoading, getAccessTokenSilently])

  return {
    token,
    isLoading: isTokenLoading || isLoading,
    error,
    isReady: !isTokenLoading && !isLoading && isAuthenticated && !!token,
  }
}
