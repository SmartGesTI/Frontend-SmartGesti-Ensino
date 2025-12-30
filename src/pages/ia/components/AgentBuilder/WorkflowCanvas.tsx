import { useCallback, useRef, useEffect, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  Panel,
  NodeProps,
  Handle,
  Position,
  ReactFlowInstance,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ArrowDownToLine, Bot, ArrowUpFromLine } from 'lucide-react'
import { availableNodesV1 } from '../nodeCatalog.v1'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

// Ícone indicador por categoria (com cores correspondentes)
function getCategoryIndicator(category: string) {
  switch (category) {
    case 'ENTRADA':
      return { 
        icon: ArrowDownToLine, 
        label: 'Entrada',
        iconColor: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/50',
        borderColor: 'border-blue-200 dark:border-blue-700'
      }
    case 'AGENTES':
      return { 
        icon: Bot, 
        label: 'IA',
        iconColor: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/50',
        borderColor: 'border-purple-200 dark:border-purple-700'
      }
    case 'AGENTES DE RH':
      return { 
        icon: Bot, 
        label: 'IA',
        iconColor: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-900/50',
        borderColor: 'border-amber-200 dark:border-amber-700'
      }
    case 'SAIDA':
      return { 
        icon: ArrowUpFromLine, 
        label: 'Saída',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/50',
        borderColor: 'border-emerald-200 dark:border-emerald-700'
      }
    default:
      return null
  }
}

import { NodeChange, EdgeChange } from 'reactflow'

interface WorkflowCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  onNodeClick: (event: React.MouseEvent, node: Node) => void
  selectedNode: Node | null
  onAddNode: (node: Node) => void
  onNodeContextMenu?: (event: React.MouseEvent, node: Node) => void
  onEdgeContextMenu?: (event: React.MouseEvent, edge: Edge) => void
  onDeleteNode?: (nodeId: string) => void
  onDeleteEdge?: (edgeId: string) => void
  reactFlowInstanceRef?: React.RefObject<{ fitView: (options?: { padding?: number; duration?: number }) => void } | null>
}

// Componente customizado para renderizar nós
function CustomNodeComponent({ data, selected }: NodeProps) {
  const Icon = data.icon
  const indicator = getCategoryIndicator(data.category)
  const IndicatorIcon = indicator?.icon

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500 border-blue-600',
    purple: 'bg-purple-500 border-purple-600',
    amber: 'bg-amber-500 border-amber-600',
    emerald: 'bg-emerald-500 border-emerald-600',
  }

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-xl shadow-lg border-2 min-w-[200px] relative',
        colorClasses[data.color] || 'bg-gray-500',
        selected && 'ring-2 ring-purple-400 ring-offset-2',
        'transition-all'
      )}
    >
      {/* Ícone indicador de categoria (canto superior direito) */}
      {IndicatorIcon && indicator && (
        <div 
          className={cn(
            'absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-md flex items-center justify-center border',
            indicator.bgColor,
            indicator.borderColor
          )}
          title={indicator.label}
        >
          <IndicatorIcon className={cn('w-3.5 h-3.5', indicator.iconColor)} />
        </div>
      )}

      {/* Handle de entrada (esquerda) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-gray-400"
        style={{ left: -6 }}
      />
      
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-5 h-5 text-white" />}
        <span className="text-sm font-semibold text-white">{data.label}</span>
      </div>
      <p className="text-xs text-white/80 line-clamp-2">{data.description}</p>
      
      {/* Handle de saída (direita) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-gray-400"
        style={{ right: -6 }}
      />
    </div>
  )
}

const nodeTypes = {
  custom: CustomNodeComponent,
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onAddNode,
  onNodeContextMenu,
  onEdgeContextMenu,
  reactFlowInstanceRef,
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
  const { resolvedTheme } = useTheme()
  const [isDark, setIsDark] = useState(resolvedTheme === 'dark')

  useEffect(() => {
    setIsDark(resolvedTheme === 'dark')
  }, [resolvedTheme])

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance
    // Expor método fitView através da ref se fornecida
    if (reactFlowInstanceRef) {
      reactFlowInstanceRef.current = {
        fitView: (options?: { padding?: number; duration?: number }) => {
          instance.fitView(options)
        },
      }
    }
  }, [reactFlowInstanceRef])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const nodeType = event.dataTransfer.getData('application/reactflow')
      if (!nodeType || !reactFlowWrapper.current || !reactFlowInstance.current) {
        return
      }

      const instance = reactFlowInstance.current
      const viewport = instance.getViewport()

      // Calcular posição considerando zoom e pan do viewport
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const relativeX = event.clientX - reactFlowBounds.left
      const relativeY = event.clientY - reactFlowBounds.top
      
      // Converter coordenadas da tela para coordenadas do flow
      const position = {
        x: (relativeX - viewport.x) / viewport.zoom - 100,
        y: (relativeY - viewport.y) / viewport.zoom - 50,
      }

      // Se não há nodes, colocar no centro da viewport
      // Caso contrário, usar a posição calculada ou ajustar se necessário
      let finalPosition = position
      
      if (nodes.length === 0) {
        // Primeiro node: colocar no centro
        finalPosition = {
          x: 0,
          y: 0,
        }
      } else {
        // Verificar se a posição está dentro de uma área razoável
        const viewportCenterX = (reactFlowBounds.width / 2 - viewport.x) / viewport.zoom
        const viewportCenterY = (reactFlowBounds.height / 2 - viewport.y) / viewport.zoom
        
        const distanceFromCenter = Math.sqrt(
          Math.pow(position.x - viewportCenterX, 2) + Math.pow(position.y - viewportCenterY, 2)
        )
        
        // Se a distância for maior que 1000px, usar o centro da viewport
        if (distanceFromCenter > 1000) {
          finalPosition = {
            x: viewportCenterX - 100,
            y: viewportCenterY,
          }
        }
      }

      const nodeDefinition = availableNodesV1.find((n) => n.id === nodeType)
      if (nodeDefinition) {
        const newNode: Node = {
          id: `${nodeType}-${Date.now()}`,
          type: 'custom',
          position: finalPosition,
          data: {
            label: nodeDefinition.data.label,
            icon: nodeDefinition.data.icon,
            color: nodeDefinition.data.color,
            description: nodeDefinition.data.description,
            config: { ...nodeDefinition.data.config },
            category: nodeDefinition.category,
          },
        }
        onAddNode(newNode)

        // Ajustar viewport para garantir que o novo node esteja visível
        setTimeout(() => {
          if (reactFlowInstance.current) {
            reactFlowInstance.current.fitView({ padding: 0.2, duration: 300 })
          }
        }, 100)
      }
    },
    [nodes, onAddNode]
  )

  // Estilos de edges customizados
  const defaultEdgeOptions = {
    animated: true,
    type: 'smoothstep' as const,
    style: {
      stroke: '#a855f7',
      strokeWidth: 2,
    },
    markerEnd: {
      type: 'arrowclosed' as MarkerType,
      color: '#a855f7',
    },
  }

  return (
    <div ref={reactFlowWrapper} className="w-full h-full bg-gray-100 dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={onInit}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="bg-gray-100 dark:bg-gray-900"
        deleteKeyCode="Delete"
      >
        <Background 
          color={isDark ? "#64748b" : "#cbd5e1"} 
          gap={16}
        />
        <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg" />
        <MiniMap
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          nodeColor={(node) => {
            const colorMap: Record<string, string> = {
              blue: '#3b82f6',
              purple: '#a855f7',
              amber: '#f59e0b',
              emerald: '#10b981',
            }
            return colorMap[node.data?.color as string] || '#6b7280'
          }}
          maskColor={isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)"}
          pannable
          zoomable
        />
        <Panel position="top-left" className="text-gray-700 dark:text-gray-300 text-xs bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded backdrop-blur-sm">
          {nodes.length} nós • {edges.length} conexões
        </Panel>
      </ReactFlow>
    </div>
  )
}
