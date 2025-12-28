import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiRequest } from '@/services/api'
import { School } from '@/types'
import { logger } from '@/lib/logger'
import { useAccessToken } from '@/hooks/useAccessToken'

export function SchoolSelector() {
  const { token, isReady } = useAccessToken()
  const { slug: currentSlug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  // Buscar TODAS as escolas da instituição para permitir troca
  const { data: schools, isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools-all', token],
    queryFn: async () => {
      if (!token) throw new Error('No token available')
      return apiRequest<School[]>('/api/schools?all=true', {}, token)
    },
    enabled: isReady && !!token,
    retry: 1,
    staleTime: 30000,
  })

  const handleSchoolChange = (schoolSlug: string) => {
    // Não fazer nada se já é a escola atual
    if (schoolSlug === currentSlug) {
      return
    }
    
    logger.info('Changing school', 'SchoolSelector', { slug: schoolSlug, from: currentSlug })
    navigate(`/escola/${schoolSlug}/painel`, { replace: true })
  }

  // Mostrar loading enquanto carrega
  if (isLoadingSchools) {
    return (
      <div className="w-[200px] h-10 bg-muted animate-pulse rounded-md" />
    )
  }

  // Se não tem escolas, não mostrar
  if (!schools || schools.length === 0) {
    return null
  }

  // Se só tem uma escola, mostrar apenas o nome (sem select)
  if (schools.length === 1) {
    return (
      <div className="flex items-center px-3 py-2 text-sm font-medium bg-muted rounded-md">
        {schools[0].name}
      </div>
    )
  }

  return (
    <Select 
      value={currentSlug || ''} 
      onValueChange={handleSchoolChange}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Selecione a escola" />
      </SelectTrigger>
      <SelectContent>
        {schools.map((school) => (
          <SelectItem key={school.id} value={school.slug}>
            {school.name}
            {school.slug === currentSlug && ' ✓'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
