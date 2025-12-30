import { useState, useMemo, useEffect, useCallback } from 'react'
import { Node, Edge } from 'reactflow'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomNode } from './types'
import { ReceiveTextInput } from './execution/ReceiveTextInput'
import { ReceiveDocumentInput } from './execution/ReceiveDocumentInput'
import { ReceiveFormInput } from './execution/ReceiveFormInput'
import { ReceiveApiInput } from './execution/ReceiveApiInput'
import { ReceiveDatabaseInput } from './execution/ReceiveDatabaseInput'
import { FileText, X, CheckCircle2, Loader2, Sparkles, Maximize2, Minimize2, Clock, Cpu, Zap, Brain } from 'lucide-react'
import { ExecutionPhase, phaseMessages } from './ExecutionLoader'
import { cn } from '@/lib/utils'
import { Resizable } from 're-resizable'
import { InstructionChips, CURRICULUM_INSTRUCTION_CHIPS } from './InstructionChips'
import { ModelSelector } from './ModelSelector'
import { DEFAULT_MODEL_ID } from './openaiModels'

interface ExecutionModalProps {
  open: boolean
  onClose: () => void
  nodes: Node[]
  edges: Edge[]
  onExecute: (params: Record<string, any>) => void
  isExecuting?: boolean
  currentPhase?: ExecutionPhase
  completedNodes?: Set<string>
  currentExecutingNodeId?: string | null
  error?: string | null
  result?: { 
    file?: Blob | string
    fileName?: string
    phase?: string
    data?: any
    error?: string
    // Informações de processamento da IA
    processingTime?: number // ms
    usage?: {
      prompt_tokens?: number
      completion_tokens?: number
      total_tokens?: number
    }
    model?: string
    provider?: string
  } | null
  onDownload?: () => void
}

/**
 * Ordena nós do workflow em ordem topológica (seguindo as conexões)
 */
function getNodesInOrder(nodes: Node[], edges: Edge[]): Node[] {
  const targetIds = new Set(edges.map(e => e.target))
  const inputNodes = nodes.filter(n => !targetIds.has(n.id))
  
  if (inputNodes.length === 0) return nodes

  const dependencies = new Map<string, string[]>()
  edges.forEach(edge => {
    if (!dependencies.has(edge.target)) {
      dependencies.set(edge.target, [])
    }
    dependencies.get(edge.target)!.push(edge.source)
  })

  const ordered: Node[] = []
  const visited = new Set<string>()
  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  function visit(nodeId: string) {
    if (visited.has(nodeId)) return
    visited.add(nodeId)

    const deps = dependencies.get(nodeId) || []
    deps.forEach(dep => visit(dep))

    const node = nodeMap.get(nodeId)
    if (node) ordered.push(node)
  }

  inputNodes.forEach(n => visit(n.id))
  
  nodes.forEach(n => {
    if (!visited.has(n.id)) {
      ordered.push(n)
    }
  })

  return ordered
}

/**
 * Componente de loader inline para cada etapa (mesmo estilo do ExecutionLoader)
 */
function StepLoader({ message, phase, currentIndex, totalNodes }: { message: string; phase: ExecutionPhase; currentIndex: number; totalNodes: number }) {
  // Calcular progresso baseado na posição do nó na ordem de execução
  // Progresso linear: (índice atual + 1) / total de nós * 100
  // Mas garantir que não ultrapasse 90% até a última etapa
  const baseProgress = Math.min(90, ((currentIndex + 1) / totalNodes) * 100)
  const progress = phase === 'complete' ? 100 : baseProgress
  
  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Ícone animado roxo com IA pulsando */}
      <div className="relative mb-4">
        <div className="relative w-16 h-16">
          <Loader2 className="w-16 h-16 text-purple-600 dark:text-purple-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem */}
      <div className="text-center mb-4 min-h-[40px] flex items-center">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {message}
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Componente de etapa concluída
 */
function StepCompleted({ data }: { data?: any }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Concluído</p>
        {data && typeof data === 'string' && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{data}</p>
        )}
        {data && typeof data === 'object' && data.text && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{data.text}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Modal de execução de agente
 * Mostra campos para cada nó do workflow em ordem sequencial
 * Integra loader dentro do modal durante execução
 */
export function ExecutionModal({ 
  open, 
  onClose, 
  nodes, 
  edges, 
  onExecute,
  isExecuting = false,
  currentPhase = 'reading',
  completedNodes = new Set(),
  currentExecutingNodeId = null,
  error = null,
  result = null,
  onDownload,
}: ExecutionModalProps) {
  const orderedNodes = useMemo(() => getNodesInOrder(nodes, edges), [nodes, edges])
  const [executionParams, setExecutionParams] = useState<Record<string, any>>({})
  const [previewEnabled, setPreviewEnabled] = useState(true)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [completedAt, setCompletedAt] = useState<number | null>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [modalSize, setModalSize] = useState({ 
    width: Math.min(window.innerWidth * 0.9, 1400), 
    height: Math.min(window.innerHeight * 0.8, 900) 
  })
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID)

  useEffect(() => {
    if (result) {
      setCompletedAt(Date.now())
    }
  }, [result])

  // Inicializar executionParams com dados já salvos nos nós (extraInstructions, model, etc.)
  useEffect(() => {
    if (open && orderedNodes.length > 0) {
      const initialParams: Record<string, any> = {}
      
      orderedNodes.forEach((node) => {
        const customNode = node as CustomNode
        const config = customNode.data.config || {}
        
        // Inicializar com dados salvos no nó (exceto instructions CORE)
        if (config.extraInstructions || config.model) {
          initialParams[node.id] = {
            ...(config.extraInstructions && { extraInstructions: config.extraInstructions }),
            ...(config.model && { model: config.model }),
          }
        }
        
        // Se o nó tem modelo configurado, usar como selectedModel
        if (config.model) {
          setSelectedModel(config.model)
        }
      })
      
      // Merge com params existentes (não sobrescrever dados de entrada do usuário)
      setExecutionParams(prev => {
        const merged = { ...initialParams }
        Object.keys(prev).forEach(nodeId => {
          merged[nodeId] = { ...initialParams[nodeId], ...prev[nodeId] }
        })
        return merged
      })
    }
  }, [open, orderedNodes])

  // Formatar tempo de execução
  const formatExecutionTime = useCallback((startMs: number, endMs: number) => {
    const diffMs = endMs - startMs
    const totalSeconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const ms = diffMs % 1000

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    if (totalSeconds >= 10) {
      return `${totalSeconds}s`
    }
    return `${totalSeconds}.${Math.floor(ms / 100)}s`
  }, [])
  

  const handleParamChange = (nodeId: string, key: string, value: any) => {
    setExecutionParams(prev => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        [key]: value,
      },
    }))
  }

  const handleExecute = () => {
    setStartedAt(Date.now())
    setCompletedAt(null)
    const inputNodes = orderedNodes.filter(n => {
      const nodeId = n.id.split('-').slice(0, -1).join('-') || n.id
      return nodeId.startsWith('receive-')
    })
    
    const missingInputs = inputNodes.filter(node => {
      const params = executionParams[node.id]
      const hasData = params?.data !== undefined && params?.data !== null && params?.data !== ''
      const hasFiles = params?.files && Array.isArray(params.files) && params.files.length > 0
      return !hasData && !hasFiles
    })
    
    if (missingInputs.length > 0) {
      alert(`Por favor, preencha todos os campos obrigatórios:\n${missingInputs.map(n => (n as CustomNode).data.label).join('\n')}`)
      return
    }

    // Passar modelo selecionado junto com os parâmetros
    onExecute({ ...executionParams, _executionModel: selectedModel })
  }

  const getPhaseMessage = (phase: ExecutionPhase): string => {
    // Usar as mensagens padrão do ExecutionLoader baseadas na fase
    return phaseMessages[phase] || 'Processando...'
  }

  const renderNodeFields = (node: Node, nodeIndex: number) => {
    const customNode = node as CustomNode
    const nodeParams = executionParams[node.id] || {}
    const nodeId = node.id

    const nodeType = node.id.split('-').slice(0, -1).join('-') || node.id
    const category = customNode.data.category

    const isInputNode = nodeType.startsWith('receive-') || category === 'RECEBER DADOS' || category === 'ENTRADA'

    // IMPORTANTE: identificar output primeiro (para não confundir generate-report com IA)
    const isOutputNode =
      nodeType.startsWith('send-') ||
      nodeType.startsWith('generate-report') ||
      nodeType.startsWith('generate-pdf') ||
      category === 'ENVIAR E GERAR' ||
      category === 'SAIDA'

    const isAINode =
      !isOutputNode &&
      (
        nodeType.startsWith('analyze-') ||
        nodeType.startsWith('generate-summary') ||
        nodeType.startsWith('classify-') ||
        nodeType.startsWith('extract-') ||
        category === 'ANALISAR COM IA' ||
        category === 'AGENTES'
      )

    const isCompleted = completedNodes.has(nodeId)
    const isCurrentlyExecuting = currentExecutingNodeId === nodeId

    // Se estiver executando e este é o nó atual, mostrar loader
    if (isExecuting && isCurrentlyExecuting) {
      return <StepLoader 
        message={getPhaseMessage(currentPhase)} 
        phase={currentPhase}
        currentIndex={nodeIndex}
        totalNodes={orderedNodes.length}
      />
    }

    // Se já foi concluído:
    if (isCompleted) {
      // Para nó de saída, mostrar informações do processamento
      if (isOutputNode && result && (result as any)?.file && (result as any)?.fileName) {
        const processingTimeMs = (result as any).processingTime || (completedAt && startedAt ? completedAt - startedAt : 0)
        const model = (result as any).model || 'IA'
        const provider = (result as any).provider || 'OpenAI'
        
        return (
          <div className="space-y-3">
            {/* Status do arquivo */}
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                {(result as any).fileName}
              </span>
            </div>
            
            {/* Informações de processamento */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Processamento da IA
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs">
                {/* Tempo de processamento */}
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Tempo:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {processingTimeMs > 0 ? formatExecutionTime(0, processingTimeMs) : '--'}
                  </span>
                </div>
                
                {/* Modelo */}
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Zap className="w-3.5 h-3.5 text-purple-500" />
                  <span>Modelo:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{model}</span>
                </div>
                
                {/* Provider */}
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
                  <span>via {provider}</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
      // Demais nós: estado padrão concluído
      const data = nodeParams.data
      return <StepCompleted data={data} />
    }

    // Se estiver executando mas este não é o nó atual e não foi concluído, não mostrar nada ainda
    if (isExecuting) {
      return null
    }

    if (isInputNode) {
      if (nodeType.startsWith('receive-text')) {
        return (
          <div className="space-y-2">
<ReceiveTextInput
              value={nodeParams.data || ''}
              onChange={(value) => handleParamChange(node.id, 'data', value)}
            />
          </div>
        )
      }
      
      if (nodeType.startsWith('receive-document')) {
        const acceptsMultiple = customNode.data.label.toLowerCase().includes('múltiplos') ||
                                customNode.data.label.toLowerCase().includes('múltiplo') ||
                                customNode.data.config?.multiple === true
        
        if (acceptsMultiple) {
          const files: File[] = nodeParams.files || []
          return (
            <div className="space-y-3">
              <Label className="text-sm font-medium">{customNode.data.label}</Label>
              <ReceiveDocumentInput
                value={files.length > 0 ? files[0] : null}
                onChange={(file) => {
                  if (file) {
                    const fileExists = files.some(f => f.name === file.name && f.size === file.size)
                    if (!fileExists) {
                      const newFiles = [...files, file]
                      handleParamChange(node.id, 'files', newFiles)
                      handleParamChange(node.id, 'data', newFiles)
                    }
                  } else {
                    handleParamChange(node.id, 'files', [])
                    handleParamChange(node.id, 'data', [])
                  }
                }}
                acceptedFormats={customNode.data.config?.acceptedFormats || ['pdf', 'docx', 'xlsx']}
                maxSize={customNode.data.config?.maxSize || '10MB'}
                multiple={true}
              />
              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Arquivos selecionados ({files.length}):
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {files.map((file: File, index: number) => (
                      <div key={index} className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                          {file.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newFiles = files.filter((_, i) => i !== index)
                            handleParamChange(node.id, 'files', newFiles)
                            handleParamChange(node.id, 'data', newFiles)
                          }}
                          className="h-6 w-6 p-0 ml-2"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {files.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Nenhum arquivo selecionado
                </p>
              )}
            </div>
          )
        }
        
        return (
          <div className="space-y-2">
            <ReceiveDocumentInput
              value={nodeParams.data || null}
              onChange={(file) => handleParamChange(node.id, 'data', file)}
              acceptedFormats={customNode.data.config?.acceptedFormats || ['pdf', 'docx', 'xlsx']}
              maxSize={customNode.data.config?.maxSize || '10MB'}
              multiple={false}
            />
          </div>
        )
      }
      
      if (nodeType.startsWith('receive-form')) {
        return (
          <ReceiveFormInput
            value={nodeParams.data || {}}
            onChange={(value) => handleParamChange(node.id, 'data', value)}
            fields={customNode.data.config?.fields || []}
          />
        )
      }
      
      if (nodeType.startsWith('receive-api')) {
        return (
          <ReceiveApiInput
            value={nodeParams.data}
            onChange={(value) => handleParamChange(node.id, 'data', value)}
            endpoint={customNode.data.config?.endpoint || ''}
            method={customNode.data.config?.method || 'GET'}
          />
        )
      }
      
      if (nodeType.startsWith('receive-database')) {
        return (
          <ReceiveDatabaseInput
            value={nodeParams.data}
            onChange={(value) => handleParamChange(node.id, 'data', value)}
            query={customNode.data.config?.query || ''}
          />
        )
      }
      
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Dados de Entrada</Label>
          <Textarea
            value={nodeParams.data || ''}
            onChange={(e) => handleParamChange(node.id, 'data', e.target.value)}
            placeholder="Cole ou digite os dados aqui..."
            className="min-h-[100px] text-sm"
            required
          />
        </div>
      )
    }

    if (isAINode) {
      // Detectar tipo de agente para personalizar o campo
      const isCurriculumAgent = nodeType.includes('analyze-curriculum') || nodeType.includes('curriculum')
      
      // Configurações dinâmicas por agente
      const fieldConfig = isCurriculumAgent ? {
        label: 'Requisitos da Vaga',
        description: 'Descreva os requisitos da vaga para uma análise mais precisa do candidato:',
        placeholder: 'Ex: Desenvolvedor Senior com 5+ anos de experiência em React, TypeScript e Node.js. Inglês avançado. Experiência com metodologias ágeis...',
        required: true,
        chips: CURRICULUM_INSTRUCTION_CHIPS,
        minHeight: 'min-h-[80px]',
      } : {
        label: 'Instruções extras para esta execução',
        description: 'Clique nos botões abaixo para adicionar instruções rápidas ou digite manualmente:',
        placeholder: 'Ex: Use tom formal. Organize em tópicos. Limite a 15 linhas...',
        required: false,
        chips: undefined, // Usa chips padrão
        minHeight: 'min-h-[60px]',
      }

      const hasError = fieldConfig.required && !nodeParams.extraInstructions?.trim()
      
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className={cn(
              "text-sm font-medium",
              isCurriculumAgent ? "text-amber-700 dark:text-amber-400" : "text-gray-700 dark:text-gray-300"
            )}>
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <p className={cn(
              "text-xs",
              isCurriculumAgent ? "text-amber-600 dark:text-amber-500" : "text-gray-500 dark:text-gray-400"
            )}>
              {fieldConfig.description}
            </p>
            <InstructionChips
              value={nodeParams.extraInstructions || ''}
              onChange={(value) => handleParamChange(node.id, 'extraInstructions', value)}
              chips={fieldConfig.chips}
            />
            <Textarea
              value={nodeParams.extraInstructions || ''}
              onChange={(e) => handleParamChange(node.id, 'extraInstructions', e.target.value)}
              placeholder={fieldConfig.placeholder}
              className={cn(
                fieldConfig.minHeight, 
                "text-sm",
                hasError && "border-red-500 focus-visible:ring-red-500"
              )}
              required={fieldConfig.required}
            />
            {hasError && (
              <p className="text-xs text-red-500">Este campo é obrigatório para análise de currículo</p>
            )}
          </div>
        </div>
      )
    }

    if (isOutputNode) {
      const labelLower = customNode.data.label.toLowerCase()
      const isGenerateReport = nodeType.includes('generate-report') || 
                                nodeType.includes('generate-pdf') ||
                                labelLower.includes('relatório') ||
                                labelLower.includes('pdf') ||
                                labelLower.includes('gerar relatório') ||
                                labelLower.includes('gerar pdf')
      
      if (isGenerateReport) {
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Formato de Saída</Label>
              <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">PDF</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Outros formatos em breve.
              </p>
            </div>

            {/* DEBUG: Outros formatos - comentado para versão futura
            {process.env.NODE_ENV === 'development' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Debug (Opcional)</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={nodeParams.format === 'markdown' || nodeParams.format === 'md' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleParamChange(node.id, 'format', 'markdown')}
                    className="flex-1 gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    MD
                  </Button>
                  <Button
                    type="button"
                    variant={nodeParams.format === 'json' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleParamChange(node.id, 'format', 'json')}
                    className="flex-1 gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    JSON
                  </Button>
                </div>
              </div>
            )}
            */}

            {/* Informações do relatório gerado */}
            {!isExecuting && result && (result as any)?.file && (result as any)?.fileName && (() => {
              const processingTimeMs = (result as any).processingTime || (completedAt && startedAt ? completedAt - startedAt : 0)
              const model = (result as any).model || 'IA'
              const provider = (result as any).provider || 'OpenAI'
              
              return (
                <div className="space-y-3">
                  {/* Status do arquivo */}
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      {(result as any).fileName}
                    </span>
                  </div>
                  
                  {/* Informações de processamento */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      Processamento da IA
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>Tempo:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {processingTimeMs > 0 ? formatExecutionTime(0, processingTimeMs) : '--'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <Zap className="w-3.5 h-3.5 text-purple-500" />
                        <span>Modelo:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{model}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
                        <span>via {provider}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Preview block when markdown is available and no PDF yet */}
            {!isExecuting && (!result || !(result as any)?.file) && (result as any)?.data?.markdown && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Preview (Markdown)</p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewEnabled((v) => !v)}
                    >
                      Preview {previewEnabled ? 'ON' : 'OFF'}
                    </Button>
                    <Button
                      size="sm"
                      variant="aiPrimary"
                      onClick={() => {
                        setPreviewEnabled(false)
                        onExecute({
                          ...executionParams,
                          ...(Object.fromEntries(
                            Object.entries(executionParams).map(([k, v]) => [
                              k,
                              { ...(v as any), preview: false },
                            ])
                          )),
                        })
                      }}
                    >
                      Gerar PDF agora
                    </Button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded p-3 text-sm whitespace-pre-wrap">
                  {(result as any).data.markdown}
                </div>
              </div>
            )}
          </div>
        )
      }
      return null
    }

    return null
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isExecuting && !isOpen) {
        onClose()
      }
    }}>
      <DialogContent 
        className={cn(
          "!p-0 !w-auto !max-w-none overflow-visible",
          isMaximized && "!w-[98vw] !h-[98vh]"
        )}
      >
        <Resizable
          size={isMaximized 
            ? { width: window.innerWidth * 0.98, height: window.innerHeight * 0.98 } 
            : modalSize
          }
          onResizeStop={(_e, _direction, _ref, d) => {
            if (!isMaximized) {
              setModalSize(prev => ({
                width: (prev.width as number) + d.width,
                height: (prev.height as number) + d.height,
              }))
            }
          }}
          minWidth={600}
          minHeight={400}
          maxWidth={window.innerWidth * 0.98}
          maxHeight={window.innerHeight * 0.8}
          enable={isMaximized ? {} : {
            top: false,
            right: true,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          handleStyles={{
            right: {
              width: '12px',
              right: '-6px',
              cursor: 'ew-resize',
            },
            left: {
              width: '12px',
              left: '-6px',
              cursor: 'ew-resize',
            },
          }}
          handleComponent={{
            right: (
              <div className="h-full flex items-center justify-center hover:bg-blue-500/20 rounded-r-xl transition-colors">
                <div className="w-2 h-24 rounded-full bg-gray-400 dark:bg-gray-500 hover:bg-blue-500 hover:w-2.5 transition-all shadow-sm" />
              </div>
            ),
            left: (
              <div className="h-full flex items-center justify-center hover:bg-blue-500/20 rounded-l-xl transition-colors">
                <div className="w-2 h-24 rounded-full bg-gray-400 dark:bg-gray-500 hover:bg-blue-500 hover:w-2.5 transition-all shadow-sm" />
              </div>
            ),
          }}
          className={cn(
            "flex flex-col overflow-hidden bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl",
          )}
        >
        {/* Header com gradiente */}
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                Executar Agente
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
                Preencha os dados necessários para executar o workflow
              </DialogDescription>
            </div>
            {/* Botões de controle do modal - ao lado do X */}
            <div className="flex items-center gap-1 absolute right-10 top-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMaximized(!isMaximized)}
                className="h-8 w-8 p-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                title={isMaximized ? "Restaurar" : "Maximizar"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className={cn("flex flex-1 min-h-0", result ? "flex-row" : "flex-row-reverse")}>
          {/* Coluna esquerda: execução */}
          <div
            className={cn(
              result ? "w-4/12 min-w-[320px]" : "w-full",
              "overflow-y-auto border-r border-gray-200 dark:border-gray-700 space-y-4 px-6 py-5"
            )}
          >
            {orderedNodes.map((node, index) => {
            const customNode = node as CustomNode
            const Icon = customNode.data.icon
            const nodeId = node.id
            const isCompleted = completedNodes.has(nodeId)
            const isCurrentlyExecuting = currentExecutingNodeId === nodeId

            return (
              <Card 
                key={node.id} 
                className={cn(
                  "border-l-4 transition-colors",
                  isCompleted 
                    ? "border-l-green-500 bg-green-50/30 dark:bg-green-950/10" 
                    : isCurrentlyExecuting
                    ? "border-l-purple-500 bg-purple-50/30 dark:bg-purple-950/10"
                    : "border-l-blue-500"
                )}
              >
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold flex-shrink-0",
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrentlyExecuting
                        ? "bg-purple-500 text-white"
                        : "bg-blue-500 text-white"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {customNode.data.label}
                    </span>
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">- {customNode.data.description}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  {renderNodeFields(node, index)}
                </CardContent>
              </Card>
            )
          })}

            {orderedNodes.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Nenhum nó configurado no workflow</p>
              </div>
            )}
          </div>

          {/* Coluna direita: preview (8/12) - só aparece se existir resultado */}
          {result && (
            <div className="w-8/12 overflow-hidden px-6 py-5 flex flex-col">
              {(result as any)?.file && previewEnabled ? (
                <div className="flex-1 min-h-0">
                  <iframe
                    title="preview"
                    className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white"
                    src={`data:application/pdf;base64,${(result as any).file}`}
                  />
                </div>
              ) : (
                <div className="flex-1 min-h-[200px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  {result ? 'Preview desativado ou sem PDF gerado.' : 'Execute para ver o preview.'}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0">
          {/* Linha superior: informações de execução */}
          <div className="w-full flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreviewEnabled((v) => !v)}
                className={cn(
                  "h-8",
                  previewEnabled ? "border-green-500 text-green-600 dark:text-green-400" : ""
                )}
              >
                Preview {previewEnabled ? 'ON' : 'OFF'}
              </Button>
              
              {/* Seletor de modelo - apenas antes da execução */}
              {!isExecuting && !result && (
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <ModelSelector
                    value={selectedModel}
                    onChange={setSelectedModel}
                    compact
                  />
                </div>
              )}
              
              {/* Tempo de execução - sempre visível após execução */}
              {(completedAt && startedAt) && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    Tempo de execução: {formatExecutionTime(startedAt, completedAt)}
                  </span>
                </div>
              )}
              
              {/* Data/hora de geração */}
              {result && (
                <span className="text-gray-500 dark:text-gray-400">
                  Gerado em: {new Date().toLocaleString('pt-BR')}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-3">
              <div className="flex items-start gap-2">
                <X className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                    Erro na Execução
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Botões de ação */}
          <div className="flex gap-2 w-full justify-end">
            <Button variant="outline" onClick={onClose} disabled={isExecuting}>
              {result && ((result as any)?.file || (result as any)?.data?.markdown) ? 'Fechar' : (isExecuting ? 'Executando...' : 'Cancelar')}
            </Button>
            {!isExecuting && result && (result as any)?.file && onDownload && (
              <Button onClick={onDownload} variant="aiPrimary">
                Baixar Relatório
              </Button>
            )}
            {!isExecuting && (!result || !(result as any)?.data?.markdown) && (
              <Button onClick={handleExecute} variant="aiPrimary">
                Executar Agente
              </Button>
            )}
          </div>
        </DialogFooter>
        </Resizable>
      </DialogContent>
    </Dialog>
  )
}
