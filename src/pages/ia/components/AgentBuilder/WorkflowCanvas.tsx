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
} from 'reactflow'
import 'reactflow/dist/style.css'
import { CustomNode } from './types'
import { availableNodes } from '../mockData'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

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
}

// Componente customizado para renderizar nós
function CustomNodeComponent({ data, selected }: NodeProps) {
  const Icon = data.icon

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
  selectedNode,
  onAddNode,
  onNodeContextMenu,
  onEdgeContextMenu,
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [isDark, setIsDark] = useState(resolvedTheme === 'dark')

  useEffect(() => {
    setIsDark(resolvedTheme === 'dark')
  }, [resolvedTheme])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const nodeType = event.dataTransfer.getData('application/reactflow')
      if (!nodeType || !reactFlowWrapper.current) {
        return
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      }

      const nodeDefinition = availableNodes.find((n) => n.id === nodeType)
      if (nodeDefinition) {
        const newNode: Node = {
          id: `${nodeType}-${Date.now()}`,
          type: 'custom',
          position,
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
      }
    },
    [onNodesChange]
  )

  // Estilos de edges customizados
  const defaultEdgeOptions = {
    animated: true,
    type: 'smoothstep',
    style: {
      stroke: '#a855f7',
      strokeWidth: 2,
    },
    markerEnd: {
      type: 'arrowclosed',
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
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="bg-gray-100 dark:bg-gray-900"
        deleteKeyCode="Delete"
      >
        <Background 
          color={isDark ? "#64748b" : "#cbd5e1"} 
          gap={16}
          variant="dots"
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
