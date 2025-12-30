import { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, MarkerType } from 'reactflow'
import { NodePalette } from './NodePalette'
import { WorkflowCanvas } from './WorkflowCanvas'
import { NodeConfigPanel } from './NodeConfigPanel'
import { ExecutionModal } from './ExecutionModal'
import { AgentTemplates } from './AgentTemplates'
import { ContextMenu } from './ContextMenu'
import { applyAutoLayout } from './layoutUtils'
import { useAgent, useCreateAgent, useUpdateAgent } from '@/hooks/useAgents'
import { useAgentExecution } from '@/hooks/useAgentExecution'
import { downloadFile } from '@/utils/pdfGenerator'
import { mapTemplateToApiAgent, getCategoryInfo } from '@/services/agents.utils'
import { availableNodes } from '../mockData'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Play, LayoutGrid } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AgentBuilder() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [activeTab, setActiveTab] = useState<'templates' | 'config'>('templates')
  const [showExecutionModal, setShowExecutionModal] = useState(false)
  const { execute, isExecuting, currentPhase, result, error, completedNodes, currentExecutingNodeId, reset } = useAgentExecution()
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    nodeId?: string
    edgeId?: string
  } | null>(null)
  const [isRightClick, setIsRightClick] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [agentName, setAgentName] = useState('')
  const [agentDescription, setAgentDescription] = useState('')
  const [agentCategory, setAgentCategory] = useState<'academico' | 'financeiro' | 'rh' | 'administrativo'>('academico')
  const hasLoadedFromParams = useRef(false)
  const reactFlowInstanceRef = useRef<{ fitView: (options?: { padding?: number; duration?: number }) => void } | null>(null)

  // Buscar template ou agente da API
  const templateId = searchParams.get('template')
  const editId = searchParams.get('edit')
  const { data: templateData, isLoading: isLoadingTemplate } = useAgent(templateId || editId || null)
  const createAgent = useCreateAgent()
  const updateAgent = useUpdateAgent()

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

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
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
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              config,
            },
          }
          // Também atualizar selectedNode se for o mesmo nó
          setSelectedNode((prev) => prev?.id === nodeId ? updatedNode : prev)
          return updatedNode
        }
        return node
      })
    )
  }, [])

  const onLoadTemplate = useCallback((template: any) => {
    const templateNodes: Node[] = template.nodes.map((n: any) => {
      const nodeType = n.id.split('-').slice(0, -1).join('-') || n.id
      const defaults = availableNodes.find((d) => d.id === nodeType)?.data?.config || {}
      const mergedConfig = {
        ...defaults,
        ...(n.data?.config || {}),
      }

      return {
        id: n.id,
        type: 'custom',
        position: n.position,
        data: {
          ...n.data,
          config: mergedConfig,
          category: n.category,
        },
      }
    })

    const templateEdges: Edge[] = template.edges.map((e: any) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'smoothstep' as const,
      animated: true,
      style: {
        stroke: '#a855f7',
        strokeWidth: 2,
      },
      markerEnd: {
        type: 'arrowclosed' as MarkerType,
        color: '#a855f7',
      },
    }))

    // Aplicar auto layout aos nodes
    const layoutedNodes = applyAutoLayout(templateNodes, templateEdges)

    setNodes(layoutedNodes)
    setEdges(templateEdges)
    
    // Ajustar viewport após aplicar layout
    setTimeout(() => {
      if (reactFlowInstanceRef.current) {
        reactFlowInstanceRef.current.fitView({ padding: 0.2, duration: 300 })
      }
    }, 100)
  }, [reactFlowInstanceRef])

  // Carregar template ou agente baseado nos query params
  useEffect(() => {
    // Só carregar uma vez quando os params mudarem
    if (hasLoadedFromParams.current || !templateData) return

    if (templateId) {
      // Carregar template automaticamente
      onLoadTemplate(templateData)
      setSelectedTemplateId(templateId)
      setActiveTab('templates') // Garantir que a aba templates esteja ativa
      setAgentName(templateData.name)
      setAgentDescription(templateData.description || '')
      setAgentCategory(templateData.category as any)
      hasLoadedFromParams.current = true
    } else if (editId) {
      // Carregar agente para edição
      setIsEditMode(true)
      onLoadTemplate(templateData)
      setAgentName(templateData.name)
      setAgentDescription(templateData.description || '')
      setAgentCategory(templateData.category as any)
      hasLoadedFromParams.current = true
    }
  }, [templateData, templateId, editId, onLoadTemplate])

  // Resetar flag quando os params mudarem
  useEffect(() => {
    hasLoadedFromParams.current = false
  }, [templateId, editId])

  const handleSave = async () => {
    // Validações
    if (!agentName.trim()) {
      alert('Por favor, informe um nome para o agente')
      return
    }

    if (nodes.length === 0) {
      alert('Adicione pelo menos um nó ao workflow')
      return
    }

    // Determinar ícone: usar do templateData se disponível, senão usar baseado na categoria
    const categoryInfo = getCategoryInfo(agentCategory)
    const iconComponent = templateData?.icon || categoryInfo.icon

    const template = {
      id: editId || '',
      name: agentName,
      description: agentDescription,
      category: agentCategory,
      icon: iconComponent,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: (node.type || 'input') as 'input' | 'ai' | 'validation' | 'output',
        category: node.data.category,
        data: {
          label: node.data.label,
          icon: node.data.icon || iconComponent, // Usar ícone do node ou fallback
          color: node.data.color || 'blue',
          description: node.data.description || '',
          config: node.data.config || {},
        },
        position: node.position,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    }

    const apiData = mapTemplateToApiAgent(template)

    try {
      if (isEditMode && editId) {
        await updateAgent.mutateAsync({
          agentId: editId,
          data: apiData,
        })
        // Navegar para a página de meus agentes após salvar
        if (slug) {
          setTimeout(() => {
            navigate(`/escola/${slug}/ia/meus-agentes`)
          }, 500) // Pequeno delay para mostrar o toast de sucesso
        }
      } else {
        await createAgent.mutateAsync(apiData as any)
        // Navegar para a página de meus agentes após criar
        if (slug) {
          setTimeout(() => {
            navigate(`/escola/${slug}/ia/meus-agentes`)
          }, 500) // Pequeno delay para mostrar o toast de sucesso
        }
      }
    } catch (error) {
      // Erro já é tratado pelo ErrorLogger nos hooks
      console.error('Erro ao salvar agente:', error)
    }
  }

  const handleTest = () => {
    // Abrir modal de execução
    setShowExecutionModal(true)
    setSelectedNode(null) // Fechar painel de configuração se estiver aberto
    reset() // Resetar estado de execução
  }

  const handleExecute = async (params: Record<string, any>) => {
    try {
      // NÃO fechar o modal - manter aberto para mostrar progresso
      
      // Converter arquivos para base64 se necessário
      const processedParams: Record<string, any> = {}
      
      for (const [nodeId, nodeParams] of Object.entries(params)) {
        if (!nodeParams || typeof nodeParams !== 'object') {
          processedParams[nodeId] = nodeParams
          continue
        }
        
        // Processar dados do nó
        const processedNodeParams: any = {}
        
        // Processar data (pode ser texto, arquivo único, ou array de arquivos)
        if (nodeParams.data !== undefined) {
          if (nodeParams.data instanceof File) {
            // Arquivo único
            const reader = new FileReader()
            const base64 = await new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(nodeParams.data)
            })
            processedNodeParams.data = {
              name: nodeParams.data.name,
              type: nodeParams.data.type,
              size: nodeParams.data.size,
              data: base64,
            }
          } else {
            // Texto ou outros dados
            processedNodeParams.data = nodeParams.data
          }
        }
        
        // Processar files (múltiplos arquivos)
        if (nodeParams.files && Array.isArray(nodeParams.files) && nodeParams.files.length > 0) {
          const filesData = await Promise.all(
            nodeParams.files.map(async (file: File) => {
              const reader = new FileReader()
              const base64 = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string)
                reader.onerror = reject
                reader.readAsDataURL(file)
              })
              return {
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64,
              }
            })
          )
          processedNodeParams.files = filesData
        }
        
        // Copiar outros parâmetros (extraInstructions, maxLines, format, etc.)
        Object.keys(nodeParams).forEach(key => {
          if (key !== 'data' && key !== 'files') {
            processedNodeParams[key] = nodeParams[key]
          }
        })
        
        processedParams[nodeId] = processedNodeParams
      }

      // Executar workflow
      const executionResult = await execute(nodes, edges, processedParams)
      console.log('AgentBuilder - Resultado da execução:', {
        hasResult: !!executionResult,
        hasFile: !!executionResult?.file,
        hasFileName: !!executionResult?.fileName,
        fileName: executionResult?.fileName,
        phase: executionResult?.phase,
      })
    } catch (error) {
      console.error('Erro ao executar workflow:', error)
      reset()
    }
  }

  const handleDownload = () => {
    if (result?.file && result?.fileName) {
      // Se o arquivo for base64 (vindo do backend), converter para Blob
      let blob: Blob
      if (typeof result.file === 'string') {
        // É base64, converter para Blob
        const byteCharacters = atob(result.file)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        blob = new Blob([byteArray], { type: 'application/pdf' })
      } else {
        // Já é um Blob
        blob = result.file
      }
      downloadFile(blob, result.fileName)
    }
  }


  const handleReorganizeLayout = useCallback(() => {
    if (nodes.length === 0) return
    
    // Aplicar auto layout aos nodes atuais
    const layoutedNodes = applyAutoLayout(nodes, edges)
    setNodes(layoutedNodes)
    
    // Ajustar viewport após aplicar layout
    setTimeout(() => {
      if (reactFlowInstanceRef.current) {
        reactFlowInstanceRef.current.fitView({ padding: 0.2, duration: 300 })
      }
    }, 100)
  }, [nodes, edges])

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

  // Loading state - verificar DEPOIS de todos os hooks
  if (isLoadingTemplate && (templateId || editId)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Carregando agente...</p>
        </div>
      </div>
    )
  }

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
              {isEditMode ? 'Editar Agente IA' : 'Criar Agente IA'}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {nodes.length} nós • {edges.length} conexões
            </span>
          </div>
          <div className="flex items-center gap-2">
            {nodes.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReorganizeLayout}
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Reorganizar Layout
              </Button>
            )}
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
              disabled={createAgent.isPending || updateAgent.isPending}
              className="gap-2"
            >
              {createAgent.isPending || updateAgent.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Agente
                </>
              )}
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
            reactFlowInstanceRef={reactFlowInstanceRef}
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
        {/* Modal de Execução */}
        <ExecutionModal
          open={showExecutionModal}
          onClose={() => {
            if (!isExecuting) {
              setShowExecutionModal(false)
            }
          }}
          nodes={nodes}
          edges={edges}
          onExecute={handleExecute}
          isExecuting={isExecuting}
          currentPhase={currentPhase}
          completedNodes={completedNodes}
          currentExecutingNodeId={currentExecutingNodeId}
          error={error}
          result={result}
          onDownload={handleDownload}
        />

        {/* Loader de Execução - renderizar fora do sidebar */}

        {/* Painel normal quando não está executando */}
        {!showExecutionModal && !isExecuting && (
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
            <AgentTemplates 
              onLoadTemplate={onLoadTemplate} 
              selectedTemplateId={selectedTemplateId || undefined}
            />
          </TabsContent>
          <TabsContent value="config" className="flex-1 overflow-y-auto m-0">
            {selectedNode ? (
              <NodeConfigPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onConfigChange={onConfigChange}
              />
            ) : (
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Informações do Agente
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="agent-name">Nome do Agente</Label>
                      <Input
                        id="agent-name"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        placeholder="Ex: Analisador de Desempenho"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent-description">Descrição</Label>
                      <Textarea
                        id="agent-description"
                        value={agentDescription}
                        onChange={(e) => setAgentDescription(e.target.value)}
                        placeholder="Descreva o que este agente faz..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent-category">Categoria</Label>
                      <Select
                        value={agentCategory}
                        onValueChange={(value: any) => setAgentCategory(value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academico">Acadêmico</SelectItem>
                          <SelectItem value="financeiro">Financeiro</SelectItem>
                          <SelectItem value="rh">Recursos Humanos</SelectItem>
                          <SelectItem value="administrativo">Administrativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        )}
      </div>

    </div>
  )
}
