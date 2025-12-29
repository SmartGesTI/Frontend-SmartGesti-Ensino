import { Link, useLocation, useParams } from 'react-router-dom'
import { ChevronRight, Home, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayoutMode } from '@/contexts/LayoutContext'
import { routes } from '@/lib/routes'

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

export function Breadcrumb() {
  const location = useLocation()
  const { slug } = useParams<{ slug: string }>()
  const { layoutMode, toggleLayoutMode } = useLayoutMode()
  
  // Extrair o caminho após /escola/:slug/
  const pathAfterSlug = location.pathname.replace(`/escola/${slug}/`, '')
  
  // Obter informações da página atual
  const pageInfo = routeMap[pathAfterSlug] || { title: 'Página', subtitle: '', breadcrumb: pathAfterSlug }
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
  
  // Adicionar página atual (sem link)
  breadcrumbs.push({ label: pageInfo.breadcrumb })

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

          {/* Subtítulo e Toggle de Layout - Lado Direito */}
          <div className="flex items-center gap-2 text-right">
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
