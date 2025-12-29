import { createContext, useContext, ReactNode, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'
import { School } from '@/types'
import { useAccessToken } from '@/hooks/useAccessToken'
import { logger } from '@/lib/logger'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { routes } from '@/lib/routes'

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

  const {
    data: schools,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['schools-all', tenantSubdomain], // Mesma queryKey do SelectSchool, SchoolSelector e EscolasTab
    queryFn: async () => {
      if (!token) {
        throw new Error('Token not available')
      }
      return apiRequest<School[]>('/api/schools?all=true', {}, token)
    },
    enabled: isReady && !!token,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos - evita recarregamento ao voltar para a aba
  })

  // Buscar escola específica do array em cache
  const school = useMemo(() => {
    if (!schools || !slug) return null
    const foundSchool = schools.find((s) => s.slug === slug)
    
    if (!foundSchool && schools.length > 0) {
      // Se não encontrou mas tem escolas, logar aviso
      logger.warn('School not found or does not belong to tenant', 'SchoolContext', {
        slug,
        tenantSubdomain,
        availableSlugs: schools.map(s => s.slug),
      })
    }
    
    return foundSchool || null
  }, [schools, slug, tenantSubdomain])

  // Redirecionar para seleção de escola se não encontrou ou houve erro
  useEffect(() => {
    // Só redirecionar se:
    // 1. Não está carregando
    // 2. Tem slug na URL
    // 3. Tem escolas carregadas (para evitar redirecionar durante carregamento inicial)
    // 4. A escola não foi encontrada OU houve erro
    if (!isLoading && slug && schools && (school === null || error)) {
      logger.warn('School not found or error loading, redirecting to select school', 'SchoolContext', {
        slug,
        error: error?.message,
        availableSlugs: schools.map(s => s.slug),
      })
      navigate(routes.selectSchool(), { replace: true })
    }
  }, [school, schools, error, isLoading, slug, navigate])

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
