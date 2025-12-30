import { Link, useLocation, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronRight, Home, Maximize2, Minimize2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayoutMode } from '@/contexts/LayoutContext'
import { routes } from '@/lib/routes'
import { useAgent } from '@/hooks/useAgents'

const NAVIGATION_HISTORY_KEY = 'navigation_history'

interface PageInfo {
  title: string
  subtitle?: string
  breadcrumb: string
}

// Mapeamento de rotas para informações da página
const routeMap: Record<string, PageInfo> = {
  'painel': { title: 'Visão Geral', subtitle: 'Painel de controle', breadcrumb: 'Visão Geral' },
  'painel/financeiro': { title: 'Financeiro', subtitle: 'Gestão financeira', breadcrumb: 'Financeiro' },
  'painel/academico': { title: 'Acadêmico', subtitle: 'Desempenho escolar', breadcrumb: 'Acadêmico' },
  'turmas': { title: 'Turmas', subtitle: 'Gerencie as turmas e classes da escola', breadcrumb: 'Turmas' },
  'alunos': { title: 'Alunos', subtitle: 'Gerencie o cadastro e informações dos alunos', breadcrumb: 'Alunos' },
  'matriculas': { title: 'Matrículas', subtitle: 'Visualize e gerencie todas as matrículas dos alunos', breadcrumb: 'Matrículas' },
  'calendario': { title: 'Calendário', subtitle: 'Visualize eventos e atividades do calendário escolar', breadcrumb: 'Calendário' },
  'calendario/novo': { title: 'Novo Evento', subtitle: 'Crie um novo evento no calendário escolar', breadcrumb: 'Novo Evento' },
  'documentos': { title: 'Documentos', subtitle: 'Gerencie documentos e arquivos da escola', breadcrumb: 'Documentos' },
  'sites': { title: 'Meus Sites', subtitle: 'Gerencie os sites criados para sua escola', breadcrumb: 'Meus Sites' },
  'sites/novo': { title: 'Criar Novo Site', subtitle: 'Crie um novo site para sua escola', breadcrumb: 'Criar Novo Site' },
  'matricula': { title: 'Matrícula', subtitle: 'Gerencie as matrículas de novos alunos', breadcrumb: 'Matrícula' },
  'rematricula': { title: 'Rematrícula', subtitle: 'Gerencie as rematrículas dos alunos existentes', breadcrumb: 'Rematrícula' },
  'escola-atual': { title: 'Gerenciar Escola', subtitle: 'Configurações da escola', breadcrumb: 'Escola' },
  'nova-escola': { title: 'Nova Escola', subtitle: 'Cadastrar instituição', breadcrumb: 'Nova Escola' },
  'permissoes': { title: 'Permissões', subtitle: 'Gerencie permissões e acessos dos usuários', breadcrumb: 'Permissões' },
  'usuarios': { title: 'Usuários', subtitle: 'Gerencie os membros da equipe e seus perfis de acesso', breadcrumb: 'Usuários' },
  'configuracoes': { title: 'Configurações', subtitle: 'Preferências do sistema', breadcrumb: 'Configurações' },
  'ia/assistente': { title: 'Assistente IA', subtitle: 'Converse com o assistente inteligente para obter ajuda e informações', breadcrumb: 'Assistente IA' },
  'ia/relatorio': { title: 'Relatório Inteligente', subtitle: 'Gere relatórios inteligentes e análises automatizadas com IA', breadcrumb: 'Relatório Inteligente' },
  'ia/criar': { title: 'Criar Agente IA', subtitle: 'Crie e personalize agentes de IA para automatizar tarefas específicas', breadcrumb: 'Criar Agente IA' },
  'ia/agentes': { title: 'Galeria de Agentes', subtitle: 'Explore e use templates de agentes pré-configurados', breadcrumb: 'Galeria de Agentes' },
  'ia/meus-agentes': { title: 'Meus Agentes', subtitle: 'Gerencie seus agentes de IA criados', breadcrumb: 'Meus Agentes' },
}

// Mapeamento de categorias para breadcrumb intermediário
const categoryMap: Record<string, { name: string; path: string }> = {
  'painel': { name: 'Dashboard', path: 'painel' },
  'painel/financeiro': { name: 'Dashboard', path: 'painel' },
  'painel/academico': { name: 'Dashboard', path: 'painel' },
  'turmas': { name: 'Acadêmico', path: 'turmas' },
  'alunos': { name: 'Acadêmico', path: 'alunos' },
  'matriculas': { name: 'Acadêmico', path: 'matriculas' },
  'calendario/novo': { name: 'Calendário', path: 'calendario' },
  'sites': { name: 'Criador de Sites', path: 'sites' },
  'sites/novo': { name: 'Criador de Sites', path: 'sites' },
  'matricula': { name: 'Administração', path: 'escola-atual' },
  'rematricula': { name: 'Administração', path: 'escola-atual' },
  'escola-atual': { name: 'Administração', path: 'escola-atual' },
  'nova-escola': { name: 'Administração', path: 'escola-atual' },
  'permissoes': { name: 'Administração', path: 'escola-atual' },
  'usuarios': { name: 'Administração', path: 'escola-atual' },
  'ia/assistente': { name: 'EducaIA', path: 'ia/assistente' },
  'ia/relatorio': { name: 'EducaIA', path: 'ia/assistente' },
  'ia/criar': { name: 'EducaIA', path: 'ia/assistente' },
  'ia/agentes': { name: 'EducaIA', path: 'ia/assistente' },
  'ia/meus-agentes': { name: 'EducaIA', path: 'ia/assistente' },
}

interface NavigationHistory {
  path: string
  breadcrumb: string
  timestamp: number
}

export function Breadcrumb() {
  const location = useLocation()
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { layoutMode, toggleLayoutMode } = useLayoutMode()
  const [previousPage, setPreviousPage] = useState<NavigationHistory | null>(null)
  
  // Extrair o caminho após /escola/:slug/
  const pathAfterSlug = location.pathname.replace(`/escola/${slug}/`, '')
  
  // Ler query params para contexto de edição/template
  const editId = searchParams.get('edit')
  const templateId = searchParams.get('template')
  
  // Buscar agente/template da API se necessário
  const agentId = editId || templateId || null
  const { data: agentData } = useAgent(agentId)
  
  // Rastrear navegação e armazenar no localStorage
  useEffect(() => {
    try {
      const currentPath = location.pathname
      const currentBreadcrumb = routeMap[pathAfterSlug]?.breadcrumb || pathAfterSlug
      
      // Recuperar histórico anterior (que foi salvo na navegação anterior)
      const historyStr = localStorage.getItem(NAVIGATION_HISTORY_KEY)
      if (historyStr) {
        const history: NavigationHistory = JSON.parse(historyStr)
        
        // Só usar se não for a mesma página e não for muito antigo (5 minutos)
        const isRecent = Date.now() - history.timestamp < 5 * 60 * 1000
        const isDifferent = history.path !== currentPath
        
        if (isRecent && isDifferent) {
          setPreviousPage(history)
        } else {
          setPreviousPage(null)
        }
      } else {
        setPreviousPage(null)
      }
      
      // Salvar página atual como histórico (será a "anterior" na próxima navegação)
      // Usar setTimeout para garantir que só salva após o estado ser atualizado
      const timer = setTimeout(() => {
        const newHistory: NavigationHistory = {
          path: currentPath,
          breadcrumb: currentBreadcrumb,
          timestamp: Date.now()
        }
        localStorage.setItem(NAVIGATION_HISTORY_KEY, JSON.stringify(newHistory))
      }, 50)
      
      return () => clearTimeout(timer)
    } catch (error) {
      console.error('Erro ao gerenciar histórico de navegação:', error)
      setPreviousPage(null)
    }
  }, [location.pathname, pathAfterSlug])
  
  // Função para voltar
  const handleGoBack = () => {
    if (previousPage) {
      navigate(previousPage.path)
    } else if (window.history.length > 1) {
      navigate(-1)
    }
  }
  
  // Buscar informações do agente/template se necessário
  let agentName: string | null = null
  let templateName: string | null = null
  
  if (agentData && pathAfterSlug === 'ia/criar') {
    if (editId) {
      agentName = agentData.name
    } else if (templateId) {
      templateName = agentData.name
    }
  }
  
  // Obter informações da página atual
  let pageInfo = routeMap[pathAfterSlug] || { title: 'Página', subtitle: '', breadcrumb: pathAfterSlug }
  
  // Ajustar breadcrumb baseado no contexto
  if (pathAfterSlug === 'ia/criar') {
    if (editId && agentName) {
      pageInfo = {
        ...pageInfo,
        title: 'Editar Agente IA',
        subtitle: `Editando: ${agentName}`,
        breadcrumb: 'Editar Agente'
      }
    } else if (templateId && templateName) {
      pageInfo = {
        ...pageInfo,
        title: 'Criar Agente IA',
        subtitle: `Baseado em: ${templateName}`,
        breadcrumb: 'Criar Agente'
      }
    }
  }
  
  const category = categoryMap[pathAfterSlug]
  
  // Construir breadcrumbs
  const breadcrumbs: { label: string; path?: string }[] = slug ? [
    { label: 'Início', path: routes.school.dashboard(slug) }
  ] : []
  
  // Adicionar categoria se existir e for diferente da página atual
  if (category && category.name !== pageInfo.breadcrumb && slug) {
    // Mapear category.path para a rota correta
    const categoryPathMap: Record<string, (slug: string) => string> = {
      'painel': routes.school.dashboard,
      'turmas': routes.school.classes,
      'alunos': routes.school.students,
      'matriculas': routes.school.enrollments,
      'escola-atual': routes.school.details,
      'calendario': routes.school.calendar,
      'sites': (slug: string) => `/escola/${slug}/sites`,
      'ia/assistente': (slug: string) => `/escola/${slug}/ia/assistente`,
    }
    const categoryPath = categoryPathMap[category.path] 
      ? categoryPathMap[category.path](slug)
      : routes.school.dashboard(slug)
    
    breadcrumbs.push({ 
      label: category.name, 
      path: categoryPath
    })
  }
  
  // Adicionar página atual (sem link, a menos que seja necessário)
  breadcrumbs.push({ label: pageInfo.breadcrumb })
  
  // Adicionar nome do agente/template se estiver em modo de edição ou usando template
  if (pathAfterSlug === 'ia/criar') {
    if (editId && agentName) {
      // Adicionar nome do agente (sem link, pois é a página atual)
      breadcrumbs.push({ label: agentName.length > 30 ? `${agentName.substring(0, 30)}...` : agentName })
    } else if (templateId && templateName) {
      // Adicionar nome do template (sem link, pois é a página atual)
      breadcrumbs.push({ label: templateName.length > 30 ? `${templateName.substring(0, 30)}...` : templateName })
    }
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-10">
          {/* Breadcrumb - Lado Esquerdo */}
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                )}
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className={cn(
                      'flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors',
                      index === 0 
                        ? 'text-gray-500 dark:text-gray-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {index === 0 && <Home className="w-3.5 h-3.5" />}
                    <span>{crumb.label}</span>
                  </Link>
                ) : (
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Botão Voltar, Subtítulo e Toggle de Layout - Lado Direito */}
          <div className="flex items-center gap-2 text-right">
            {/* Botão Voltar */}
            {previousPage && (
              <>
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                  title={`Voltar para ${previousPage.breadcrumb}`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Voltar para:</span>
                  <span className="font-medium">{previousPage.breadcrumb}</span>
                </button>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
              </>
            )}
            {pageInfo.subtitle && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {pageInfo.subtitle}
              </span>
            )}
            {pageInfo.subtitle && <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />}
            <button
              onClick={toggleLayoutMode}
              className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              title={layoutMode === 'fluid' ? 'Modo contido' : 'Modo fluido'}
            >
              {layoutMode === 'fluid' ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
