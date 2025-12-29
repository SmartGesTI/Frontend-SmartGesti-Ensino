import { useLocation } from 'react-router-dom'
import { useParams } from 'react-router-dom'

export type DashboardType = 'visao-geral' | 'academico' | 'financeiro' | null

export interface CurrentPageInfo {
  isDashboard: boolean
  dashboardType: DashboardType
  pageName: string
  path: string
}

export function useCurrentPage(): CurrentPageInfo {
  const location = useLocation()
  const { slug } = useParams<{ slug: string }>()

  const path = location.pathname

  // Detectar tipo de dashboard
  let dashboardType: DashboardType = null
  let pageName = 'Página'
  let isDashboard = false

  if (slug) {
    if (path === `/escola/${slug}/painel` || path === `/escola/${slug}/painel/visao-geral`) {
      dashboardType = 'visao-geral'
      pageName = 'Dashboard Visão Geral'
      isDashboard = true
    } else if (path === `/escola/${slug}/painel/academico`) {
      dashboardType = 'academico'
      pageName = 'Dashboard Acadêmico'
      isDashboard = true
    } else if (path === `/escola/${slug}/painel/financeiro`) {
      dashboardType = 'financeiro'
      pageName = 'Dashboard Financeiro'
      isDashboard = true
    } else if (path.includes('/ia/assistente')) {
      pageName = 'Assistente IA'
    } else if (path.includes('/ia/relatorio')) {
      pageName = 'Relatório Inteligente'
    } else if (path.includes('/ia/criar')) {
      pageName = 'Criar Agente IA'
    } else if (path.includes('/ia/agentes')) {
      pageName = 'Ver Agentes'
    } else if (path.includes('/ia/meus-agentes')) {
      pageName = 'Meus Agentes'
    } else if (path.includes('/turmas')) {
      pageName = 'Turmas'
    } else if (path.includes('/alunos')) {
      pageName = 'Alunos'
    } else if (path.includes('/matriculas')) {
      pageName = 'Matrículas'
    } else if (path.includes('/calendario')) {
      pageName = 'Calendário'
    } else if (path.includes('/documentos')) {
      pageName = 'Documentos'
    } else if (path.includes('/configuracoes')) {
      pageName = 'Configurações'
    }
  }

  return {
    isDashboard,
    dashboardType,
    pageName,
    path,
  }
}
