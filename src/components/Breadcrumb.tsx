import { Link, useLocation, useParams } from 'react-router-dom'
import { ChevronRight, Home, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLayoutMode } from '@/contexts/LayoutContext'

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
  'turmas': { title: 'Turmas', subtitle: 'Gerenciamento de turmas', breadcrumb: 'Turmas' },
  'alunos': { title: 'Alunos', subtitle: 'Cadastro de alunos', breadcrumb: 'Alunos' },
  'matriculas': { title: 'Matrículas', subtitle: 'Gestão de matrículas', breadcrumb: 'Matrículas' },
  'calendario': { title: 'Calendário', subtitle: 'Eventos e datas', breadcrumb: 'Calendário' },
  'documentos': { title: 'Documentos', subtitle: 'Arquivos e relatórios', breadcrumb: 'Documentos' },
  'escola-atual': { title: 'Gerenciar Escola', subtitle: 'Configurações da escola', breadcrumb: 'Escola' },
  'nova-escola': { title: 'Nova Escola', subtitle: 'Cadastrar instituição', breadcrumb: 'Nova Escola' },
  'permissoes': { title: 'Permissões', subtitle: 'Controle de acesso', breadcrumb: 'Permissões' },
  'usuarios': { title: 'Usuários', subtitle: 'Gerenciar usuários', breadcrumb: 'Usuários' },
  'configuracoes': { title: 'Configurações', subtitle: 'Preferências do sistema', breadcrumb: 'Configurações' },
}

// Mapeamento de categorias para breadcrumb intermediário
const categoryMap: Record<string, { name: string; path: string }> = {
  'painel': { name: 'Dashboard', path: 'painel' },
  'painel/financeiro': { name: 'Dashboard', path: 'painel' },
  'painel/academico': { name: 'Dashboard', path: 'painel' },
  'turmas': { name: 'Acadêmico', path: 'turmas' },
  'alunos': { name: 'Acadêmico', path: 'alunos' },
  'matriculas': { name: 'Acadêmico', path: 'matriculas' },
  'escola-atual': { name: 'Administração', path: 'escola-atual' },
  'nova-escola': { name: 'Administração', path: 'escola-atual' },
  'permissoes': { name: 'Administração', path: 'escola-atual' },
  'usuarios': { name: 'Administração', path: 'escola-atual' },
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
  const breadcrumbs: { label: string; path?: string }[] = [
    { label: 'Início', path: `/escola/${slug}/painel` }
  ]
  
  // Adicionar categoria se existir e for diferente da página atual
  if (category && category.name !== pageInfo.breadcrumb) {
    breadcrumbs.push({ 
      label: category.name, 
      path: `/escola/${slug}/${category.path}` 
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

          {/* Título, Subtítulo e Toggle de Layout - Lado Direito */}
          <div className="flex items-center gap-2 text-right">
            <div className="hidden sm:block">
              {pageInfo.subtitle && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {pageInfo.subtitle}
                </span>
              )}
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {pageInfo.title}
            </h1>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
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
