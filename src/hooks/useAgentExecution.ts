import { useState, useCallback } from 'react'
import { Node, Edge } from 'reactflow'
import { ExecutionPhase } from '@/pages/ia/components/AgentBuilder/ExecutionLoader'
import { CustomNode } from '@/pages/ia/components/AgentBuilder/types'
import { AgentsService } from '@/services/agents.service'
import { useAccessToken } from '@/hooks/useAccessToken'
import { useSchool } from '@/contexts/SchoolContext'
import { getTenantFromSubdomain } from '@/lib/tenant'

interface ExecutionResult {
  phase: ExecutionPhase
  data?: any
  error?: string
  file?: Blob | string
  fileName?: string
  thoughts?: Array<{ model?: string; input_preview?: string; raw_output?: string }>
  // Informações de processamento da IA
  processingTime?: number // ms
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
  model?: string
  provider?: string
}

/**
 * Hook para orquestrar a execução de um workflow de agente
 */
export function useAgentExecution() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<ExecutionPhase>('reading')
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [thoughts, setThoughts] = useState<ExecutionResult['thoughts']>([])
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set())
  const [currentExecutingNodeId, setCurrentExecutingNodeId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAccessToken()
  const { schoolId } = useSchool()
  const tenantSubdomain = getTenantFromSubdomain()

  /**
   * Ordena nós em ordem topológica
   */
  const getNodesInOrder = useCallback((nodes: Node[], edges: Edge[]): Node[] => {
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
  }, [])

  /**
   * Executa um nó de entrada (input)
   */
  const executeInputNode = useCallback(async (node: Node, params: any): Promise<any> => {
    const nodeParams = params[node.id]
    
    // Verificar se tem dados (texto, arquivo, ou array de arquivos)
    const data = nodeParams?.data
    const files = nodeParams?.files
    
    if (!data && !files) {
      throw new Error(`Dados não fornecidos para o nó ${(node as CustomNode).data.label}`)
    }
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Se for arquivo(s), retornar estrutura apropriada
    if (files && Array.isArray(files) && files.length > 0) {
      // Múltiplos arquivos
      return { files: files, text: files.map((f: any) => f.name || f).join(', ') }
    } else if (data && typeof data === 'object' && data.name && data.data) {
      // Arquivo único (já convertido para base64)
      return { file: data, text: data.name }
    } else {
      // Texto ou dados simples
      return { text: data }
    }
  }, [])

  /**
   * Executa um nó de IA chamando o backend
   */
  const executeAINode = useCallback(async (
    node: Node, 
    inputData: any, 
    extraInstructions?: string,
    options?: { maxLines?: number; executionModel?: string }
  ): Promise<any> => {
    if (!token || !tenantSubdomain) {
      throw new Error('Token ou tenant não disponível para executar nó de IA')
    }

    const customNode = node as CustomNode
    
    try {
      // Chamar backend para executar o nó de IA
      const result = await AgentsService.executeNode(
        token,
        tenantSubdomain,
        {
          id: node.id,
          type: customNode.type,
          data: customNode.data,
          category: customNode.data.category,
        },
        inputData,
        extraInstructions,
        { ...options, executionModel: options?.executionModel },
        schoolId || undefined
      )

      return result.data
    } catch (error: any) {
      console.error('Erro ao executar nó de IA:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido ao executar nó de IA'
      throw new Error(errorMessage)
    }
  }, [token, tenantSubdomain, schoolId])

  /**
   * Executa um nó de saída (output)
   */
  const executeOutputNode = useCallback(async (
    _node: Node,
    inputData: any,
    format: string = 'pdf'
  ): Promise<{ file?: Blob | string; fileName?: string }> => {
    const markdown =
      typeof inputData?.markdown === 'string'
        ? inputData.markdown
        : typeof inputData?.md === 'string'
        ? inputData.md
        : null

    // PDF (padrão): SEMPRE via backend/Puppeteer (para header/footer e formatação profissional)
    if (format.toLowerCase() === 'pdf') {
      if (!markdown || markdown.trim().length === 0) {
        throw new Error(
          'Para gerar PDF, o workflow precisa gerar Markdown antes (ex.: nó "Gerar Relatório (Markdown)").'
        )
      }
      if (!token || !tenantSubdomain) {
        throw new Error('Token ou tenant não disponível para renderizar PDF no backend')
      }

      const rendered = await AgentsService.renderPdfFromMarkdown(
        token,
        tenantSubdomain,
        markdown,
        'relatorio.pdf',
        schoolId || undefined
      )

      return {
        file: rendered.file.data, // base64
        fileName: rendered.file.fileName,
      }
    }

    // Debug/exports
    const { generateMarkdown, generateJSON, normalizeReportData } = await import('@/utils/pdfGenerator')
    const report = normalizeReportData(inputData)

    switch (format.toLowerCase()) {
      case 'md':
      case 'markdown':
        return {
          file: markdown ? new Blob([markdown], { type: 'text/markdown' }) : generateMarkdown(inputData),
          fileName: 'relatorio.md',
        }
      case 'json':
        return {
          file: generateJSON(report),
          fileName: 'relatorio.json',
        }
      default:
        throw new Error('Formato de saída não suportado neste fluxo')
    }
  }, [token, tenantSubdomain, schoolId])

  /**
   * Executa o workflow completo
   */
  const execute = useCallback(async (
    nodes: Node[],
    edges: Edge[],
    params: Record<string, any>
  ): Promise<ExecutionResult> => {
    const executionStartTime = Date.now()
    
    setIsExecuting(true)
    setCurrentPhase('reading')
    setResult(null)
    setError(null)
    setCompletedNodes(new Set())
    setCurrentExecutingNodeId(null)
    setThoughts([])

    // Acumular usage de todos os nós de IA
    let totalUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    }
    let modelUsed: string | undefined

    try {
      const outputNodes = nodes.filter((n) => {
        const nodeType = n.id.split('-').slice(0, -1).join('-') || n.id
        const category = (n as CustomNode).data.category
        return (
          nodeType.startsWith('send-') ||
          nodeType.startsWith('generate-report') ||
          nodeType.startsWith('generate-pdf') ||
          category === 'ENVIAR E GERAR' ||
          category === 'SAIDA'
        )
      })
      if (outputNodes.length === 0) {
        throw new Error('Workflow sem nó de saída. Adicione um gerador de relatório ou envio.')
      }
      if (outputNodes.length > 1) {
        throw new Error('Workflow possui múltiplos nós de saída. Mantenha apenas um nó de output.')
      }

      const orderedNodes = getNodesInOrder(nodes, edges)
      let currentData: any = null
      const collectedThoughts: ExecutionResult['thoughts'] = []

      // Executar cada nó em ordem
      for (let i = 0; i < orderedNodes.length; i++) {
        const node = orderedNodes[i]
        const customNode = node as CustomNode
        
        // Extrair tipo original do ID (ex: 'receive-text-123456' -> 'receive-text')
        const nodeType = node.id.split('-').slice(0, -1).join('-') || node.id
        
        // Determinar tipo do nó baseado no ID ou categoria
        // IMPORTANTE: Verificar output primeiro, pois generate-report pode ser confundido com generate-summary
        const isOutputNode = nodeType.startsWith('send-') ||
                             nodeType.startsWith('generate-report') ||
                             nodeType.startsWith('generate-pdf') ||
                             customNode.data.category === 'ENVIAR E GERAR' ||
                             customNode.data.category === 'SAIDA'
        
        const isInputNode = nodeType.startsWith('receive-')
        
        // Nós de IA (excluindo nós de output que começam com generate-)
        const isAINode = !isOutputNode && (
          nodeType.startsWith('analyze-') || 
          nodeType.startsWith('generate-summary') ||
          nodeType.startsWith('classify-') ||
          nodeType.startsWith('extract-') ||
          (nodeType.startsWith('generate-') && !nodeType.includes('report') && !nodeType.includes('pdf')) ||
          customNode.data.category === 'ANALISAR COM IA' ||
          customNode.data.category === 'AGENTES'
        )

        // Determinar fase baseada no tipo de nó
        setCurrentExecutingNodeId(node.id)
        
        if (isInputNode) {
          setCurrentPhase('reading')
          currentData = await executeInputNode(node, params)
          setCompletedNodes(prev => new Set([...prev, node.id]))
        } else if (isAINode) {
          // Verificar se não é um nó de output disfarçado
          const nodeType = node.id.split('-').slice(0, -1).join('-') || node.id
          const isOutputNode = 
            nodeType.startsWith('generate-report') ||
            nodeType.startsWith('generate-pdf') ||
            nodeType.startsWith('send-') ||
            customNode.data.category === 'ENVIAR E GERAR' ||
            customNode.data.category === 'SAIDA'
          
          // Se for nó de output, pular (será processado depois)
          if (isOutputNode) {
            setCompletedNodes(prev => new Set([...prev, node.id]))
            continue
          }
          
          // Extrair tipo original do ID
          const labelLower = customNode.data.label.toLowerCase()
          
          if (nodeType.includes('analyze') || labelLower.includes('analisar')) {
            setCurrentPhase('analyzing')
          } else if (nodeType.includes('summary') || nodeType.includes('generate-summary') || labelLower.includes('resumo')) {
            setCurrentPhase('summarizing')
          } else {
            setCurrentPhase('analyzing') // Fase padrão para outros nós de IA
          }
          
          const extraInstructions = params[node.id]?.extraInstructions
          const maxLines = params[node.id]?.maxLines
          const executionModel = params._executionModel
          
          // Passar maxLines e executionModel para o nó
          currentData = await executeAINode(node, currentData, extraInstructions, { maxLines, executionModel })
          if (currentData?.__trace) {
            collectedThoughts.push({
              model: currentData.__trace.model_used,
              input_preview: currentData.__trace.input_preview,
              raw_output: currentData.__trace.raw_output,
            })
            setThoughts((prev) => [...(prev || []), collectedThoughts[collectedThoughts.length - 1]])
            
            // Acumular usage e capturar modelo
            if (currentData.__trace.usage) {
              totalUsage.prompt_tokens += currentData.__trace.usage.prompt_tokens || 0
              totalUsage.completion_tokens += currentData.__trace.usage.completion_tokens || 0
              totalUsage.total_tokens += currentData.__trace.usage.total_tokens || 0
            }
            if (currentData.__trace.model_used) {
              modelUsed = currentData.__trace.model_used
            }
            
            delete currentData.__trace
          }
          setCompletedNodes(prev => new Set([...prev, node.id]))
        } else if (isOutputNode) {
          setCurrentPhase('generating')
          // Extrair tipo original do ID para identificar se é gerador de relatório
          const outputNodeType = node.id.split('-').slice(0, -1).join('-') || node.id
          const labelLower = customNode.data.label.toLowerCase()
          const isGenerateReport = outputNodeType.includes('generate-report') || 
                                    outputNodeType.includes('generate-pdf') ||
                                    labelLower.includes('relatório') ||
                                    labelLower.includes('pdf') ||
                                    labelLower.includes('gerar')
          
          if (isGenerateReport) {
            const format = params[node.id]?.format || 'pdf'
            const { file, fileName } = await executeOutputNode(node, currentData, format)
            
            const processingTime = Date.now() - executionStartTime
            
            const finalResult: ExecutionResult = {
              phase: 'complete',
              data: currentData,
              file,
              fileName,
              thoughts: collectedThoughts,
              processingTime,
              usage: totalUsage.total_tokens > 0 ? totalUsage : undefined,
              model: modelUsed,
              provider: 'OpenAI',
            }
            
            console.log('PDF gerado:', { file, fileName, hasFile: !!file, hasFileName: !!fileName, processingTime, usage: totalUsage, model: modelUsed })
            
            setCurrentPhase('complete')
            setIsExecuting(false)
            setResult(finalResult)
            setThoughts(collectedThoughts)
            setError(null)
            setCompletedNodes(prev => new Set([...prev, node.id]))
            setCurrentExecutingNodeId(null)
            
            return finalResult
          }
          
          // Se não for gerador de relatório, marcar como concluído e continuar
          setCompletedNodes(prev => new Set([...prev, node.id]))
          continue
        }
        
        setCurrentExecutingNodeId(null)
      }

      // Se chegou aqui sem nó de output, retornar dados finais
      console.log('DEBUG: Finalizando execução sem nó de output. Dados finais:', {
        hasData: !!currentData,
        dataKeys: currentData ? Object.keys(currentData) : [],
        orderedNodesCount: orderedNodes.length,
        orderedNodeIds: orderedNodes.map(n => n.id),
        orderedNodeTypes: orderedNodes.map(n => {
          const customNode = n as CustomNode
          const nodeType = n.id.split('-').slice(0, -1).join('-') || n.id
          return {
            id: n.id,
            type: nodeType,
            category: customNode.data?.category,
            label: customNode.data?.label,
          }
        }),
      })
      
      const processingTime = Date.now() - executionStartTime
      
      const finalResult: ExecutionResult = {
        phase: 'complete',
        data: currentData,
        thoughts: collectedThoughts,
        processingTime,
        usage: totalUsage.total_tokens > 0 ? totalUsage : undefined,
        model: modelUsed,
        provider: 'OpenAI',
      }
      
      setCurrentPhase('complete')
      setIsExecuting(false)
      setResult(finalResult)
      setThoughts(collectedThoughts)
      setCurrentExecutingNodeId(null)
      
      return finalResult
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido durante a execução'
      setError(errorMessage)
      
      const errorResult: ExecutionResult = {
        phase: 'error',
        error: errorMessage,
      }
      
      setCurrentPhase('error')
      setIsExecuting(false)
      setResult(errorResult)
      setCurrentExecutingNodeId(null)
      
      return errorResult
    }
  }, [getNodesInOrder, executeInputNode, executeAINode, executeOutputNode])

  const reset = useCallback(() => {
    setIsExecuting(false)
    setCurrentPhase('reading')
    setResult(null)
    setError(null)
    setCompletedNodes(new Set())
    setCurrentExecutingNodeId(null)
  }, [])

  return {
    execute,
    isExecuting,
    currentPhase,
    result,
    error,
    completedNodes,
    currentExecutingNodeId,
    reset,
    thoughts,
  }
}
