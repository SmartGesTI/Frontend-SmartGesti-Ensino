import { useMemo } from 'react'
import ReactFlow, { 
  Node, 
  Edge, 
  MarkerType,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  NodeProps
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AIButton } from '@/components/ui/ai-button'
import { 
  Edit,
  Trash2,
  Zap,
  Sparkles,
  Globe,
  Lock,
  Users,
  Clock,
  FileEdit,
  CheckCircle2,
  Lightbulb,
  Workflow,
  GitBranch,
  ArrowDownToLine,
  Bot,
  ArrowUpFromLine
} from 'lucide-react'
import { getCategoryInfo } from '@/services/agents.utils'
import { cn } from '@/lib/utils'

// Indicador de categoria para o preview
function getCategoryIndicator(category: string) {
  switch (category) {
    case 'ENTRADA':
      return { icon: ArrowDownToLine, bgColor: 'bg-blue-100', borderColor: 'border-blue-300', iconColor: 'text-blue-600' }
    case 'AGENTES':
    case 'AGENTES DE RH':
      return { icon: Bot, bgColor: 'bg-purple-100', borderColor: 'border-purple-300', iconColor: 'text-purple-600' }
    case 'SAIDA':
      return { icon: ArrowUpFromLine, bgColor: 'bg-emerald-100', borderColor: 'border-emerald-300', iconColor: 'text-emerald-600' }
    default:
      return null
  }
}

// Nó customizado para o preview - igual ao original
function PreviewNode({ data }: NodeProps) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500 border-blue-600',
    purple: 'bg-purple-500 border-purple-600',
    amber: 'bg-amber-500 border-amber-600',
    emerald: 'bg-emerald-500 border-emerald-600',
    green: 'bg-green-500 border-green-600',
    orange: 'bg-orange-500 border-orange-600',
    red: 'bg-red-500 border-red-600',
    pink: 'bg-pink-500 border-pink-600',
    indigo: 'bg-indigo-500 border-indigo-600',
    cyan: 'bg-cyan-500 border-cyan-600',
  }

  const indicator = getCategoryIndicator(data.category)
  const IndicatorIcon = indicator?.icon
  
  return (
    <div className={cn(
      'px-4 py-3 rounded-xl shadow-lg border-2 min-w-[180px] relative',
      colorMap[data.color] || colorMap.blue
    )}>
      {/* Indicador de categoria */}
      {IndicatorIcon && indicator && (
        <div className={cn(
          'absolute -top-2 -right-2 w-5 h-5 rounded-full shadow-md flex items-center justify-center border',
          indicator.bgColor, indicator.borderColor
        )}>
          <IndicatorIcon className={cn('w-3 h-3', indicator.iconColor)} />
        </div>
      )}

      {/* Handle de entrada */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-white border border-gray-400"
        style={{ left: -4 }}
      />
      
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-semibold text-white">{data.label}</span>
      </div>
      {data.description && (
        <p className="text-xs text-white/70 line-clamp-1">{data.description}</p>
      )}
      
      {/* Handle de saída */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-white border border-gray-400"
        style={{ right: -4 }}
      />
    </div>
  )
}

const previewNodeTypes = { preview: PreviewNode }

// Componente para visualização do fluxo usando React Flow
interface FlowVisualizationProps {
  nodes: Array<{ id: string; position?: { x: number; y: number }; data?: { label?: string; color?: string; description?: string; category?: string } }>
  edges: Array<{ id?: string; source: string; target: string }>
}

function FlowVisualization({ nodes: inputNodes, edges: inputEdges }: FlowVisualizationProps) {
  if (!inputNodes || inputNodes.length === 0) return null

  // Converter para formato React Flow
  const flowNodes: Node[] = useMemo(() => {
    return inputNodes.map((n, index) => ({
      id: n.id,
      type: 'preview',
      position: n.position || { x: index * 200, y: 0 },
      data: {
        label: n.data?.label || 'Nó',
        color: n.data?.color || 'blue',
        description: n.data?.description || '',
        category: n.data?.category || '',
      },
    }))
  }, [inputNodes])

  const flowEdges: Edge[] = useMemo(() => {
    return inputEdges.map((e, index) => ({
      id: e.id || `edge-${index}`,
      source: e.source,
      target: e.target,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '5,5' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
    }))
  }, [inputEdges])

  return (
    <div className="bg-[#0f172a] rounded-lg overflow-hidden border border-gray-700" style={{ height: 280 }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={previewNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.4, maxZoom: 0.8 }}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          position="bottom-right"
          className="!bg-gray-800 !border-gray-700 !shadow-lg [&>button]:!bg-gray-700 [&>button]:!border-gray-600 [&>button]:!text-gray-300 [&>button:hover]:!bg-gray-600"
        />
      </ReactFlow>
    </div>
  )
}

interface AgentDetailsModalProps {
  agent: {
    id: string
    name: string
    description?: string
    category: string
    difficulty?: string
    visibility?: string
    estimatedTime?: string
    useCase?: string
    flow?: string
    tags?: string[]
    nodes?: any[]
    edges?: any[]
    status?: string
    bestUses?: string[]
    howItHelps?: string
  } | null
  open: boolean
  onClose: () => void
  mode: 'my-agents' | 'public'
  onExecute: () => void
  onEdit: () => void
  onDelete?: () => void
}

export function AgentDetailsModal({
  agent,
  open,
  onClose,
  mode,
  onExecute,
  onEdit,
  onDelete,
}: AgentDetailsModalProps) {
  if (!agent) return null

  const categoryInfo = getCategoryInfo(agent.category)
  const CategoryIcon = categoryInfo.icon
  const categoryColor = categoryInfo.color

  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  }

  const gradientClasses: Record<string, string> = {
    purple: 'from-purple-50/50 to-fuchsia-50/50 dark:from-purple-950/20 dark:to-fuchsia-950/20',
    emerald: 'from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20',
    amber: 'from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20',
    blue: 'from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20',
  }

  const isCollaborative = agent.visibility === 'public_collaborative'

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header Padrão */}
        <div className={cn('bg-gradient-to-r border-b border-border p-6 rounded-t-lg', gradientClasses[categoryColor] || gradientClasses.purple)}>
          <div className="flex items-center gap-4">
            <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', colorClasses[categoryColor])}>
              <CategoryIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{agent.name}</h2>
              {agent.status === 'draft' && (
                <div className="flex items-center gap-1 mt-1">
                  <FileEdit className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Rascunho</span>
                </div>
              )}
            </div>
          </div>
          {/* Tags no Header */}
          {agent.tags && agent.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {agent.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 p-6">
          {/* Descrição */}
          {agent.description && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Descrição</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{agent.description}</p>
            </div>
          )}

          {/* Grid de Informações - 4 colunas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Visibilidade</p>
              <div className="flex items-center justify-center gap-1">
                {agent.visibility === 'public_collaborative' ? (
                  <>
                    <Users className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">Colaborativo</span>
                  </>
                ) : agent.visibility === 'public' ? (
                  <>
                    <Globe className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Público</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">Privado</span>
                  </>
                )}
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Categoria</p>
              <span className={cn('text-sm font-semibold', `text-${categoryColor}-700 dark:text-${categoryColor}-400`)}>
                {categoryInfo.name}
              </span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dificuldade</p>
              <span className={cn('text-sm font-semibold', 
                agent.difficulty === 'iniciante' ? 'text-green-700 dark:text-green-400' : 
                agent.difficulty === 'avancado' ? 'text-red-700 dark:text-red-400' : 
                'text-orange-700 dark:text-orange-400'
              )}>
                {agent.difficulty === 'iniciante' ? 'Iniciante' : agent.difficulty === 'intermediario' ? 'Intermediário' : 'Avançado'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tempo Estimado</p>
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{agent.estimatedTime || '-'}</span>
              </div>
            </div>
          </div>

          {/* Caso de Uso */}
          {agent.useCase && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Caso de Uso</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {agent.useCase}
              </p>
            </div>
          )}

          {/* Melhores Usos */}
          {agent.bestUses && agent.bestUses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Melhores Usos</p>
              </div>
              <ul className="space-y-1">
                {agent.bestUses.map((use, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-500 mt-0.5">•</span>
                    {use}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Como Ajuda */}
          {agent.howItHelps && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Como Ajuda</p>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {agent.howItHelps}
              </p>
            </div>
          )}

          {/* Fluxo de Trabalho Visual */}
          {agent.nodes && agent.nodes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Fluxo de Trabalho</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Workflow className="w-3 h-3" />
                    <span>{agent.nodes.length} nó{agent.nodes.length !== 1 ? 's' : ''}</span>
                  </div>
                  {agent.edges && agent.edges.length > 0 && (
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      <span>{agent.edges.length} conexã{agent.edges.length !== 1 ? 'es' : 'o'}</span>
                    </div>
                  )}
                </div>
              </div>
              <FlowVisualization nodes={agent.nodes} edges={agent.edges || []} />
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {mode === 'my-agents' ? (
              agent.status === 'draft' ? (
                // Rascunho: Continuar Editando + Excluir
                <>
                  <Button
                    variant="aiEditOutlineHover"
                    onClick={() => {
                      onClose()
                      onEdit()
                    }}
                    className="flex-1 gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Continuar Editando
                  </Button>
                  {onDelete && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        onClose()
                        onDelete()
                      }}
                      className="flex-1 gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </Button>
                  )}
                </>
              ) : (
                // Publicado: Executar, Editar, Excluir
                <>
                  <Button
                    variant="aiPrimary"
                    onClick={() => {
                      onClose()
                      onExecute()
                    }}
                    className="flex-1 gap-2 group"
                  >
                    <Sparkles className="w-4 h-4 group-hover:animate-bounce" />
                    Executar
                  </Button>
                  <Button
                    variant="aiEditOutlineHover"
                    onClick={() => {
                      onClose()
                      onEdit()
                    }}
                    className="flex-1 gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  {onDelete && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        onClose()
                        onDelete()
                      }}
                      className="flex-1 gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </Button>
                  )}
                </>
              )
            ) : (
              <>
                <AIButton
                  variant="aiPrimary"
                  onClick={() => {
                    onClose()
                    onExecute()
                  }}
                  shimmer
                  className="flex-1 gap-2 group"
                >
                  <Sparkles className="w-4 h-4 group-hover:animate-bounce" />
                  Executar
                </AIButton>
                {isCollaborative && (
                  <Button
                    variant="aiEditOutlineHover"
                    onClick={() => {
                      onClose()
                      onEdit()
                    }}
                    className="flex-1 gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
