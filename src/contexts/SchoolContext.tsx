import { createContext, useContext, ReactNode, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'
import { School } from '@/types'
import { useAccessToken } from '@/hooks/useAccessToken'
import { logger } from '@/lib/logger'
import { getTenantFromSubdomain } from '@/lib/tenant'

interface SchoolContextType {
  slug: string | null
  schoolId: string | null
  school: School | null | undefined
  isLoading: boolean
  error: Error | null
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined)

export function SchoolProvider({ children }: { children: ReactNode }) {
  const { slug: slugParam } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { token, isReady } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()

  const slug = slugParam || null

  // Buscar dados da escola
  const {
    data: school,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['school', slug, token],
    queryFn: async () => {
      if (!slug || !token) {
        throw new Error('School slug or token not available')
      }

      // Buscar todas as escolas do tenant para validar
      const schools = await apiRequest<School[]>('/api/schools?all=true', {}, token)
      const foundSchool = schools.find((s) => s.slug === slug)

      if (!foundSchool) {
        logger.warn('School not found or does not belong to tenant', 'SchoolContext', {
          slug,
          tenantSubdomain,
        })
        return null
      }

      return foundSchool
    },
    enabled: isReady && !!token && !!slug,
    retry: 1,
    staleTime: 30000, // 30 seconds
  })

  // Redirecionar para seleção de escola se não encontrou ou houve erro
  useEffect(() => {
    if (!isLoading && slug && (school === null || error)) {
      logger.warn('School not found or error loading, redirecting to select school', 'SchoolContext', {
        slug,
        error: error?.message,
      })
      navigate('/selecionar-escola', { replace: true })
    }
  }, [school, error, isLoading, slug, navigate])

  const value: SchoolContextType = {
    slug,
    schoolId: school?.id || null,
    school,
    isLoading,
    error: error as Error | null,
  }

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>
}

export function useSchool() {
  const context = useContext(SchoolContext)
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider')
  }
  return context
}
