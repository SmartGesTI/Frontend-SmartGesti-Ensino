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
  visibility?: 'public' | 'public_collaborative' | 'private' | 'restricted'
  is_template?: boolean
  usage_count?: number
  created_at?: string
  updated_at?: string
  school_id?: string
  tenant_id?: string
  use_auto_layout?: boolean
  best_uses?: string[]
  how_it_helps?: string
  status?: 'draft' | 'published'
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

  // Gerar fluxo automaticamente se não existir
  const generatedFlow = generateFlowFromWorkflow(apiAgent.workflow?.nodes || [], edges)

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
    flow: apiAgent.flow || generatedFlow,
    tags: apiAgent.tags || [],
    estimatedTime: apiAgent.estimated_time,
    categoryTags: apiAgent.category_tags || [],
    isPublic: apiAgent.visibility === 'public',
    usageCount: apiAgent.usage_count || 0,
    useAutoLayout: apiAgent.use_auto_layout !== false, // default true
    bestUses: apiAgent.best_uses || [],
    howItHelps: apiAgent.how_it_helps || '',
    type: apiAgent.type,
    visibility: apiAgent.visibility,
    status: apiAgent.status,
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
    visibility: template.visibility || (template.isPublic ? 'public' : 'private'),
    type: template.type || 'private',
    is_template: false, // Será definido pelo usuário
    use_auto_layout: template.useAutoLayout !== false, // default true
    best_uses: template.bestUses || [],
    how_it_helps: template.howItHelps || '',
    status: template.status || 'draft',
  }
}

/**
 * Gera uma string de fluxo baseada nos nós e conexões do workflow
 * Formato: "Nó1 > Nó2 > Nó3"
 */
export function generateFlowFromWorkflow(
  nodes: Array<{ id: string; data?: { label?: string } }>,
  edges: Array<{ source: string; target: string }>
): string {
  if (!nodes || nodes.length === 0) return ''
  if (!edges || edges.length === 0) {
    // Se não há conexões, retorna os nós na ordem
    return nodes.map(n => n.data?.label || 'Nó').join(' > ')
  }

  // Encontrar nós que são targets (têm alguém apontando para eles)
  const targetIds = new Set(edges.map(e => e.target))
  
  // Nó inicial é aquele que não é target de nenhuma edge
  const startNodes = nodes.filter(n => !targetIds.has(n.id))
  
  if (startNodes.length === 0) {
    // Se todos são targets (ciclo), começa do primeiro
    return nodes.map(n => n.data?.label || 'Nó').join(' > ')
  }

  // Construir mapa de adjacência
  const adjacencyMap = new Map<string, string[]>()
  edges.forEach(edge => {
    if (!adjacencyMap.has(edge.source)) {
      adjacencyMap.set(edge.source, [])
    }
    adjacencyMap.get(edge.source)!.push(edge.target)
  })

  // Mapa de id para label
  const nodeMap = new Map<string, string>()
  nodes.forEach(n => nodeMap.set(n.id, n.data?.label || 'Nó'))

  // Percorrer o grafo a partir do nó inicial
  const visited = new Set<string>()
  const flowParts: string[] = []

  function traverse(nodeId: string) {
    if (visited.has(nodeId)) return
    visited.add(nodeId)
    
    flowParts.push(nodeMap.get(nodeId) || 'Nó')
    
    const nextNodes = adjacencyMap.get(nodeId) || []
    nextNodes.forEach(nextId => traverse(nextId))
  }

  // Começar do primeiro nó inicial
  traverse(startNodes[0].id)

  // Se ainda há nós não visitados, adiciona-os
  nodes.forEach(n => {
    if (!visited.has(n.id)) {
      flowParts.push(nodeMap.get(n.id) || 'Nó')
    }
  })

  return flowParts.join(' > ')
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
