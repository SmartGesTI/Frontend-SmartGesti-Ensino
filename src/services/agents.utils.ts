import {
  GraduationCap,
  DollarSign,
  UserCog,
  Building2,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Calculator,
  CreditCard,
  FileText,
  Briefcase,
  Award,
  BarChart3,
} from 'lucide-react'
import { AgentTemplate, WorkflowNode } from '@/pages/ia/components/mockData'

/**
 * Interface do agente retornado pela API
 */
export interface ApiAgent {
  id: string
  name: string
  description: string
  icon: string // Nome do ícone como string (ex: "GraduationCap")
  category: 'academico' | 'financeiro' | 'rh' | 'administrativo'
  workflow: {
    nodes: any[]
    edges: Array<{ id: string; source: string; target: string }>
  }
  rating?: number
  difficulty?: 'iniciante' | 'intermediario' | 'avancado'
  use_case?: string
  flow?: string
  tags?: string[]
  estimated_time?: string
  category_tags?: string[]
  type?: 'public_school' | 'public_editable' | 'private' | 'restricted'
  visibility?: 'public' | 'private' | 'restricted'
  is_template?: boolean
  usage_count?: number
  created_at?: string
  updated_at?: string
  school_id?: string
  tenant_id?: string
  use_auto_layout?: boolean
}

/**
 * Mapeamento de nomes de ícones (string) para componentes Lucide React
 */
const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  DollarSign,
  Calculator,
  CreditCard,
  FileText,
  Briefcase,
  Award,
  BarChart3,
  // Adicionar mais conforme necessário
}

/**
 * Converte nome de ícone (string) para componente React
 */
export function getIconComponent(iconName: string): React.ElementType {
  const IconComponent = iconMap[iconName]
  if (!IconComponent) {
    console.warn(`Ícone não encontrado: ${iconName}, usando FileText como fallback`)
    return FileText
  }
  return IconComponent
}

/**
 * Informações de categorias
 */
export interface CategoryInfo {
  id: string
  name: string
  icon: React.ElementType
  color: string
}

export const categoryInfoMap: Record<string, CategoryInfo> = {
  academico: {
    id: 'academico',
    name: 'Acadêmico',
    icon: GraduationCap,
    color: 'purple',
  },
  financeiro: {
    id: 'financeiro',
    name: 'Financeiro',
    icon: DollarSign,
    color: 'emerald',
  },
  rh: {
    id: 'rh',
    name: 'Recursos Humanos',
    icon: UserCog,
    color: 'amber',
  },
  administrativo: {
    id: 'administrativo',
    name: 'Administrativo',
    icon: Building2,
    color: 'blue',
  },
}

/**
 * Retorna informações de categoria
 */
export function getCategoryInfo(category: string): CategoryInfo {
  return categoryInfoMap[category] || {
    id: category,
    name: category,
    icon: FileText,
    color: 'gray',
  }
}

/**
 * Converte agente da API para formato AgentTemplate do frontend
 */
export function mapApiAgentToTemplate(apiAgent: ApiAgent): AgentTemplate {
  // Converter workflow JSONB para nodes e edges separados
  const nodes: WorkflowNode[] = (apiAgent.workflow?.nodes || []).map((node: any) => ({
    id: node.id,
    type: node.type,
    category: node.category,
    data: {
      label: node.data?.label || '',
      icon: getIconComponent(node.data?.icon || 'FileText'),
      color: node.data?.color || 'blue',
      description: node.data?.description || '',
      config: node.data?.config || {},
    },
    position: node.position || { x: 0, y: 0 },
  }))

  const edges = apiAgent.workflow?.edges || []

  // Converter ícone string para componente React
  const IconComponent = getIconComponent(apiAgent.icon || 'FileText')

  return {
    id: apiAgent.id,
    name: apiAgent.name,
    description: apiAgent.description || '',
    icon: IconComponent,
    category: apiAgent.category,
    nodes,
    edges,
    rating: apiAgent.rating,
    difficulty: apiAgent.difficulty,
    useCase: apiAgent.use_case,
    flow: apiAgent.flow,
    tags: apiAgent.tags || [],
    estimatedTime: apiAgent.estimated_time,
    categoryTags: apiAgent.category_tags || [],
    isPublic: apiAgent.visibility === 'public',
    usageCount: apiAgent.usage_count || 0,
    useAutoLayout: apiAgent.use_auto_layout !== false, // default true
  }
}

/**
 * Converte AgentTemplate do frontend para formato da API
 */
export function mapTemplateToApiAgent(template: AgentTemplate): Partial<ApiAgent> {
  // Converter nodes e edges para workflow JSONB
  const workflow = {
    nodes: template.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      category: node.category,
      data: {
        label: node.data.label,
        icon: getIconNameFromComponent(node.data.icon),
        color: node.data.color,
        description: node.data.description,
        config: node.data.config,
      },
      position: node.position,
    })),
    edges: template.edges,
  }

  return {
    name: template.name,
    description: template.description,
    icon: getIconNameFromComponent(template.icon),
    category: template.category as any,
    workflow,
    rating: template.rating,
    difficulty: template.difficulty,
    use_case: template.useCase,
    flow: template.flow,
    tags: template.tags,
    estimated_time: template.estimatedTime,
    category_tags: template.categoryTags,
    visibility: template.isPublic ? 'public' : 'private',
    is_template: false, // Será definido pelo usuário
    use_auto_layout: template.useAutoLayout !== false, // default true
  }
}

/**
 * Converte componente React para nome de ícone (string)
 * Nota: Isso é uma aproximação, pois não podemos obter o nome do componente diretamente
 * Vamos usar um mapeamento reverso
 */
const componentToIconNameMap = new Map<React.ElementType, string>()
Object.entries(iconMap).forEach(([name, component]) => {
  componentToIconNameMap.set(component, name)
})

function getIconNameFromComponent(IconComponent: React.ElementType): string {
  const iconName = componentToIconNameMap.get(IconComponent)
  return iconName || 'FileText'
}
