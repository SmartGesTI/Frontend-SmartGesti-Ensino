import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiRequest } from '@/services/api'
import { School } from '@/types'
import { logger } from '@/lib/logger'
import { useAccessToken } from '@/hooks/useAccessToken'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { Building2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routes } from '@/lib/routes'

interface SchoolSelectorProps {
  className?: string
}

export function SchoolSelector({ className }: SchoolSelectorProps) {
  const { token, isReady } = useAccessToken()
  const { slug: currentSlug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const tenantSubdomain = getTenantFromSubdomain()

  // Buscar TODAS as escolas da instituição para permitir troca
  // Usa mesma queryKey que SelectSchool para compartilhar cache
  const { data: schools, isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools-all', tenantSubdomain],
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
    navigate(routes.school.dashboard(schoolSlug), { replace: true })
  }

  // Mostrar loading enquanto carrega
  if (isLoadingSchools) {
    return (
      <div className={cn('w-[200px] h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg', className)} />
    )
  }

  // Se não tem escolas, não mostrar
  if (!schools || schools.length === 0) {
    return null
  }

  const currentSchool = schools.find(s => s.slug === currentSlug)

  // Se só tem uma escola, mostrar apenas o nome (sem select)
  if (schools.length === 1) {
    return (
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg',
        'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        className
      )}>
        <Building2 className="h-4 w-4 text-gray-500" />
        <span className="truncate max-w-[150px]">{schools[0].name}</span>
      </div>
    )
  }

  return (
    <Select 
      value={currentSlug || ''} 
      onValueChange={handleSchoolChange}
    >
      <SelectTrigger 
        className={cn(
          'w-[200px] h-10 rounded-lg border-2 transition-all duration-200',
          'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',
          'hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-800',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
          'data-[state=open]:border-blue-500 data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <SelectValue placeholder="Selecione a escola">
            <span className="truncate">{currentSchool?.name || 'Selecione'}</span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent 
        className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
      >
        <div className="p-1">
          {schools.map((school) => (
            <SelectItem 
              key={school.id} 
              value={school.slug}
              className={cn(
                'rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-150',
                'focus:bg-blue-50 dark:focus:bg-blue-950/50 focus:text-blue-600 dark:focus:text-blue-400',
                'data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-950/50',
                school.slug === currentSlug && 'bg-blue-500 text-white focus:bg-blue-600 focus:text-white data-[highlighted]:bg-blue-600 data-[highlighted]:text-white'
              )}
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{school.name}</span>
                {school.slug === currentSlug && (
                  <Check className="h-4 w-4 ml-auto flex-shrink-0" />
                )}
              </div>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  )
}
