import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '@/services/api'
import { School } from '@/types'
import { useAccessToken } from '@/hooks/useAccessToken'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { routes } from '@/lib/routes'
import { useSchool } from '@/contexts/SchoolContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  School as SchoolIcon,
  Plus,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function EscolasTab() {
  const navigate = useNavigate()
  const { token, isReady } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()
  const { slug: currentSlug } = useSchool()

  const { data: schools, isLoading } = useQuery({
    queryKey: ['schools-all', tenantSubdomain],
    queryFn: async () => {
      if (!token) throw new Error('No token available')
      return apiRequest<School[]>('/api/schools?all=true', {}, token)
    },
    enabled: isReady && !!token,
    staleTime: 30000,
  })

  const handleCreateSchool = () => {
    if (currentSlug) {
      navigate(routes.school.create(currentSlug))
    }
  }

  const handleAccessSchool = (school: School) => {
    navigate(routes.school.dashboard(school.slug))
  }

  const handleViewDetails = (school: School) => {
    navigate(routes.school.details(school.slug))
  }

  return (
    <div className="space-y-6">
      {/* Header com botão criar */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Building2 className="h-5 w-5" />
                Escolas da Instituição
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600 dark:text-gray-400">
                Gerencie todas as escolas vinculadas à sua instituição
              </CardDescription>
            </div>
            <Button size="sm" onClick={handleCreateSchool} className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <Plus className="h-4 w-4 mr-2" />
              Nova Escola
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de escolas */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !schools || schools.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <SchoolIcon className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhuma escola cadastrada
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Comece criando sua primeira escola para gerenciar alunos, turmas e muito mais.
            </p>
            <Button onClick={handleCreateSchool} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Escola
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {schools.map((school) => (
            <Card
              key={school.id}
              className={cn(
                'border-2 border-border transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700',
                school.slug === currentSlug && 'ring-2 ring-blue-500 border-blue-200 dark:border-blue-800'
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{school.name}</h3>
                    {school.code && (
                      <Badge variant="secondary" className="mt-1">
                        {school.code}
                      </Badge>
                    )}
                  </div>
                  {school.slug === currentSlug && (
                    <Badge className="bg-primary/10 text-primary border-0 shrink-0">
                      Atual
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  {school.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{school.address}</span>
                    </div>
                  )}
                  {school.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{school.phone}</span>
                    </div>
                  )}
                  {school.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{school.email}</span>
                    </div>
                  )}
                  {!school.address && !school.phone && !school.email && (
                    <p className="text-muted-foreground/60 italic">
                      Nenhuma informação adicional
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  {school.slug !== currentSlug ? (
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => handleAccessSchool(school)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Acessar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleViewDetails(school)}
                    >
                      Ver Detalhes
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info sobre quantidade */}
      {schools && schools.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          {schools.length} {schools.length === 1 ? 'escola cadastrada' : 'escolas cadastradas'}
        </p>
      )}
    </div>
  )
}
