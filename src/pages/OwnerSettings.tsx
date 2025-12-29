import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { usePermissions } from '@/contexts/PermissionsContext'
import { useSchool } from '@/contexts/SchoolContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { useUrlTabs } from '@/hooks/useUrlTabs'
import { useAccessToken } from '@/hooks/useAccessToken'
import { routes } from '@/lib/routes'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { apiRequest } from '@/services/api'
import { Tenant } from '@/types'
import { SettingsTabs, SettingsTabItem } from '@/components/settings/SettingsTabs'
import { ConvitesTab } from '@/components/settings/tabs/ConvitesTab'
import { EscolasTab } from '@/components/settings/tabs/EscolasTab'
import { InstituicaoTab } from '@/components/settings/tabs/InstituicaoTab'
import { PlanoTab } from '@/components/settings/tabs/PlanoTab'
import { PermissoesTab } from '@/components/settings/tabs/PermissoesTab'
import { LogsTab } from '@/components/settings/tabs/LogsTab'
import { UsoIATab } from '@/components/settings/tabs/UsoIATab'
import { RelatoriosTab } from '@/components/settings/tabs/RelatoriosTab'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2,
  School,
  UserPlus,
  CreditCard,
  Shield,
  FileText,
  Sparkles,
  BarChart3,
  AlertTriangle,
} from 'lucide-react'
import { useEffect, useRef } from 'react'

// Definição das abas disponíveis
const SETTINGS_TABS: SettingsTabItem[] = [
  { value: 'instituicao', label: 'Instituição', icon: Building2 },
  { value: 'escolas', label: 'Escolas', icon: School },
  { value: 'convites', label: 'Convites', icon: UserPlus },
  { value: 'plano', label: 'Plano', icon: CreditCard },
  { value: 'permissoes', label: 'Permissões', icon: Shield },
  { value: 'logs', label: 'Logs', icon: FileText },
  { value: 'uso-ia', label: 'Uso de IA', icon: Sparkles },
  { value: 'relatorios', label: 'Relatórios', icon: BarChart3 },
]

const VALID_TAB_VALUES = SETTINGS_TABS.map((t) => t.value)

export default function OwnerSettings() {
  const navigate = useNavigate()
  const { isOwner, loading: permissionsLoading } = usePermissions()
  const { slug, isLoading: schoolLoading } = useSchool()
  const { setExpanded } = useSidebar()
  const { token, isReady } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()

  // Buscar dados da instituição
  const { data: tenant } = useQuery({
    queryKey: ['tenant', tenantSubdomain],
    queryFn: async () => {
      if (!tenantSubdomain) return null
      return apiRequest<Tenant>(`/api/tenants/${tenantSubdomain}`, {}, token || undefined)
    },
    enabled: isReady && !!tenantSubdomain,
    staleTime: 5 * 60 * 1000,
  })

  const { currentTab, setTab } = useUrlTabs({
    defaultValue: 'instituicao',
    validValues: VALID_TAB_VALUES,
  })

  // Retrair sidebar apenas uma vez ao entrar na página
  const hasRetracted = useRef(false)
  useEffect(() => {
    if (!hasRetracted.current) {
      setExpanded(false)
      hasRetracted.current = true
    }
  }, [setExpanded])

  // Redireciona se não for owner
  useEffect(() => {
    if (!permissionsLoading && !isOwner && slug) {
      navigate(routes.school.dashboard(slug), { replace: true })
    }
  }, [isOwner, permissionsLoading, slug, navigate])

  // Loading state
  if (permissionsLoading || schoolLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-6">
          <Skeleton className="h-[400px] w-56" />
          <Skeleton className="h-[400px] flex-1" />
        </div>
      </div>
    )
  }

  // Não é owner - mostra mensagem enquanto redireciona
  if (!isOwner) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground">
            Esta página é exclusiva para proprietários da instituição.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Renderiza o conteúdo da aba ativa
  const renderTabContent = () => {
    switch (currentTab) {
      case 'instituicao':
        return <InstituicaoTab />
      case 'escolas':
        return <EscolasTab />
      case 'convites':
        return <ConvitesTab />
      case 'plano':
        return <PlanoTab />
      case 'permissoes':
        return <PermissoesTab />
      case 'logs':
        return <LogsTab />
      case 'uso-ia':
        return <UsoIATab />
      case 'relatorios':
        return <RelatoriosTab />
      default:
        return null
    }
  }

  return (
    <SettingsTabs
      tabs={SETTINGS_TABS}
      activeTab={currentTab}
      onTabChange={setTab}
      institutionName={tenant?.name || tenantSubdomain || undefined}
    >
      {renderTabContent()}
    </SettingsTabs>
  )
}
