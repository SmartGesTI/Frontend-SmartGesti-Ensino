import { useState, useMemo } from 'react'
import { Node, Edge } from 'reactflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Play, Loader2 } from 'lucide-react'
import { CustomNode } from './types'
import { ReceiveTextInput } from './execution/ReceiveTextInput'
import { ReceiveDocumentInput } from './execution/ReceiveDocumentInput'
import { ReceiveFormInput } from './execution/ReceiveFormInput'
import { ReceiveApiInput } from './execution/ReceiveApiInput'
import { ReceiveDatabaseInput } from './execution/ReceiveDatabaseInput'

interface ExecutionPanelProps {
  nodes: Node[]
  edges: Edge[]
  onClose: () => void
  onExecute: (params: Record<string, any>) => void
  isExecuting?: boolean
}

/**
 * Componente principal de execução de agente
 * Identifica os nós de entrada e renderiza a interface apropriada para cada um
 */
export function ExecutionPanel({ nodes, edges, onClose, onExecute, isExecuting = false }: ExecutionPanelProps) {
  // Encontrar todos os nós de entrada (nós sem conexões de entrada)
  const inputNodes = useMemo(() => {
    const targetIds = new Set(edges.map(e => e.target))
    
    return nodes.filter(node => {
      const customNode = node as CustomNode
      return customNode.type === 'input' && !targetIds.has(node.id)
    })
  }, [nodes, edges])

  const [executionParams, setExecutionParams] = useState<Record<string, any>>({})

  const handleParamChange = (nodeId: string, value: any) => {
    setExecutionParams(prev => ({
      ...prev,
      [nodeId]: value,
    }))
  }

  const handleExecute = () => {
    // Validar que todos os nós de entrada têm valores
    const missingInputs = inputNodes.filter(node => !executionParams[node.id])
    if (missingInputs.length > 0) {
      alert(`Por favor, preencha todos os campos de entrada:\n${missingInputs.map(n => n.data.label).join('\n')}`)
      return
    }

    onExecute(executionParams)
  }

  if (inputNodes.length === 0) {
    return (
      <div className="w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Executar Agente
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Este agente não possui nós de entrada configurados.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Executar Agente
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {inputNodes.map((node) => {
          const customNode = node as CustomNode
          const nodeId = node.id
          const value = executionParams[nodeId]

          return (
            <Card key={nodeId} className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <customNode.data.icon className="w-4 h-4" />
                  {customNode.data.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {customNode.data.description}
                </p>

                {/* Renderizar componente de entrada baseado no ID do nó (extrair tipo original do ID) */}
                {(() => {
                  // Extrair o tipo original do ID (ex: 'receive-text-123456' -> 'receive-text')
                  const nodeType = nodeId.split('-').slice(0, -1).join('-') || nodeId
                  
                  if (nodeType.startsWith('receive-text')) {
                    return (
                      <ReceiveTextInput
                        value={value}
                        onChange={(val) => handleParamChange(nodeId, val)}
                      />
                    )
                  }
                  
                  if (nodeType.startsWith('receive-document')) {
                    return (
                      <ReceiveDocumentInput
                        value={value}
                        onChange={(val) => handleParamChange(nodeId, val)}
                        acceptedFormats={customNode.data.config.acceptedFormats}
                        maxSize={customNode.data.config.maxSize}
                      />
                    )
                  }
                  
                  if (nodeType.startsWith('receive-form')) {
                    return (
                      <ReceiveFormInput
                        value={value}
                        onChange={(val) => handleParamChange(nodeId, val)}
                        fields={customNode.data.config.fields}
                      />
                    )
                  }
                  
                  if (nodeType.startsWith('receive-api')) {
                    return (
                      <ReceiveApiInput
                        value={value}
                        onChange={(val) => handleParamChange(nodeId, val)}
                        endpoint={customNode.data.config.endpoint}
                        method={customNode.data.config.method}
                      />
                    )
                  }
                  
                  if (nodeType.startsWith('receive-database')) {
                    return (
                      <ReceiveDatabaseInput
                        value={value}
                        onChange={(val) => handleParamChange(nodeId, val)}
                        query={customNode.data.config.query}
                      />
                    )
                  }
                  
                  return (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tipo de entrada não suportado: {customNode.data.label}
                    </p>
                  )
                })()}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleExecute}
          disabled={isExecuting || inputNodes.some(node => !executionParams[node.id])}
          className="w-full gap-2"
          variant="aiPrimary"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Executar Agente
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
