import { useState, useCallback, useEffect } from 'react'
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow'
import { NodePalette } from './NodePalette'
import { WorkflowCanvas } from './WorkflowCanvas'
import { NodeConfigPanel } from './NodeConfigPanel'
import { AgentTemplates } from './AgentTemplates'
import { ContextMenu } from './ContextMenu'
import { agentTemplates } from '../mockData'
import { CustomNode } from './types'
import { Button } from '@/components/ui/button'
import { Save, Play, FileText, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AgentBuilder() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showTemplates, setShowTemplates] = useState(true)
  const [activeTab, setActiveTab] = useState<'templates' | 'config'>('templates')
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    nodeId?: string
    edgeId?: string
  } | null>(null)
  const [isRightClick, setIsRightClick] = useState(false)

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds))
    },
    []
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Não fazer nada se foi clique com botão direito (já tratado pelo onNodeContextMenu)
    if (isRightClick) {
      setIsRightClick(false)
      return
    }
    setSelectedNode(node)
    setContextMenu(null)
    setActiveTab('config') // Mudar para aba de configuração quando clicar em um nó
  }, [isRightClick])

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault()
    setIsRightClick(true) // Marcar que foi clique direito
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
    })
    // Não mudar a aba automaticamente, apenas selecionar o nó
    setSelectedNode(node)
    // Não mudar para aba config aqui - apenas quando clicar em "Configurar" no menu
  }, [])

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault()
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      edgeId: edge.id,
    })
  }, [])

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
    }
  }, [selectedNode])

  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId))
  }, [])

  const handleDuplicateNode = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      const newNode: Node = {
        ...node,
        id: `${node.id}-copy-${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
      }
      setNodes((nds) => [...nds, newNode])
    }
  }, [nodes])

  const onNodeDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  const onConfigChange = useCallback((nodeId: string, config: Record<string, any>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              config,
            },
          }
        }
        return node
      })
    )
  }, [])

  const onLoadTemplate = useCallback((template: typeof agentTemplates[0]) => {
    const templateNodes: Node[] = template.nodes.map((n) => ({
      id: n.id,
      type: 'custom',
      position: n.position,
      data: {
        ...n.data,
        category: n.category,
      },
    }))

    const templateEdges: Edge[] = template.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: '#a855f7',
        strokeWidth: 2,
      },
      markerEnd: {
        type: 'arrowclosed',
        color: '#a855f7',
      },
    }))

    setNodes(templateNodes)
    setEdges(templateEdges)
    setShowTemplates(false)
  }, [])

  const handleSave = () => {
    // TODO: Implementar salvamento
    console.log('Salvando agente...', { nodes, edges })
  }

  const handleTest = () => {
    // TODO: Implementar teste
    console.log('Testando agente...', { nodes, edges })
  }

  // Deletar com tecla Delete
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedNode) {
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
        setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))
        setSelectedNode(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode])

  // Fechar menu contextual ao clicar em qualquer lugar
  useEffect(() => {
    if (!contextMenu) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Verificar se o clique foi no menu contextual
      const isContextMenu = target.closest('[data-context-menu]')
      
      // Se clicou no menu contextual, não fazer nada (o menu já tem seu próprio handler)
      if (isContextMenu) {
        return
      }
      
      // Se clicou em qualquer outro lugar, fechar o menu
      setContextMenu(null)
    }

    // Usar um pequeno delay para não interferir com o evento de abertura do menu
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClick, true)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClick, true)
    }
  }, [contextMenu])

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-950">
      {/* Barra Lateral Esquerda - Componentes */}
      <NodePalette onNodeDragStart={onNodeDragStart} />

      {/* Área Central - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Criar Agente IA
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {nodes.length} nós • {edges.length} conexões
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              className="bg-purple-500 hover:bg-purple-600 text-white border-0"
            >
              <Play className="w-4 h-4 mr-2" />
              Testar
            </Button>
            <Button
              variant="aiAction"
              size="sm"
              onClick={handleSave}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Agente
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            selectedNode={selectedNode}
            onAddNode={(node) => setNodes((nds) => [...nds, node])}
          />
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              nodeId={contextMenu.nodeId}
              edgeId={contextMenu.edgeId}
              onClose={() => setContextMenu(null)}
              onDelete={
                contextMenu.nodeId
                  ? () => handleDeleteNode(contextMenu.nodeId!)
                  : contextMenu.edgeId
                  ? () => handleDeleteEdge(contextMenu.edgeId!)
                  : undefined
              }
              onConfigure={
                contextMenu.nodeId
                  ? () => {
                      const node = nodes.find((n) => n.id === contextMenu.nodeId)
                      if (node) {
                        setSelectedNode(node)
                        setActiveTab('config')
                        setContextMenu(null)
                      }
                    }
                  : undefined
              }
              onEdit={
                contextMenu.nodeId
                  ? () => {
                      const node = nodes.find((n) => n.id === contextMenu.nodeId)
                      if (node) {
                        setSelectedNode(node)
                        setActiveTab('config')
                        setContextMenu(null)
                      }
                    }
                  : undefined
              }
              onDuplicate={
                contextMenu.nodeId ? () => handleDuplicateNode(contextMenu.nodeId!) : undefined
              }
            />
          )}
        </div>
      </div>

      {/* Barra Lateral Direita - Templates ou Configuração */}
      <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'templates' | 'config')} className="flex flex-col h-full">
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
            <TabsList className="w-full bg-gray-100/50 dark:bg-gray-800/50 p-1">
              <TabsTrigger 
                value="templates" 
                className="flex-1 text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Templates
              </TabsTrigger>
              <TabsTrigger 
                value="config" 
                className="flex-1 text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Configuração
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="templates" className="flex-1 overflow-y-auto m-0">
            <AgentTemplates onLoadTemplate={onLoadTemplate} />
          </TabsContent>
          <TabsContent value="config" className="flex-1 overflow-y-auto m-0">
            <NodeConfigPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onConfigChange={onConfigChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
