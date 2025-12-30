import { Node } from 'reactflow'
import { X, Info, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomNode } from './types'
import { ModelSelector } from './ModelSelector'
import { DEFAULT_MODEL_ID } from './openaiModels'
import { InstructionChips } from './InstructionChips'

interface NodeConfigPanelProps {
  node: Node | null
  onClose: () => void
  onConfigChange: (nodeId: string, config: Record<string, any>) => void
}

export function NodeConfigPanel({ node, onClose, onConfigChange }: NodeConfigPanelProps) {
  if (!node) {
    return (
      <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecione um nó para configurar
        </p>
      </div>
    )
  }

  const customNode = node as CustomNode
  const Icon = customNode.data.icon

  const category = customNode.data.category
  const isAgentNode = category === 'ANALISAR COM IA' || category === 'AGENTES'
  const isInputNode = category === 'RECEBER DADOS' || category === 'ENTRADA'
  const isOutputNode = category === 'ENVIAR E GERAR' || category === 'SAIDA'

  const handleConfigChange = (key: string, value: any) => {
    onConfigChange(node.id, {
      ...customNode.data.config,
      [key]: value,
    })
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Configurar Nó
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

      <div className="flex-1 overflow-y-auto p-4">
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {customNode.data.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {customNode.data.description}
            </p>
          </CardContent>
        </Card>

        {/* Seletor de Modelo de IA - apenas para nós de agente */}
        {isAgentNode && (
          <div className="mb-4">
            <ModelSelector
              value={customNode.data.config?.model || DEFAULT_MODEL_ID}
              onChange={(modelId) => handleConfigChange('model', modelId)}
            />
          </div>
        )}

        <div className="space-y-4">
          {isAgentNode && (
            <>
              {/* Instruções Extras - salvas no agente */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <Label className="text-sm font-medium">Instruções Extras</Label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Adicione instruções personalizadas que serão sempre aplicadas a este componente.
                </p>
                <InstructionChips
                  value={customNode.data.config?.extraInstructions || ''}
                  onChange={(value) => handleConfigChange('extraInstructions', value)}
                />
                <Textarea
                  value={customNode.data.config?.extraInstructions || ''}
                  onChange={(e) => handleConfigChange('extraInstructions', e.target.value)}
                  placeholder="Ex: Use tom formal e profissional. Limite o resumo a 20 linhas..."
                  className="min-h-[80px] text-sm"
                />
              </div>
            </>
          )}

          {isInputNode && (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Formatos Aceitos</Label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {customNode.data.config.acceptedFormats?.join(', ') || 'Todos'}
                </div>
              </div>
              {customNode.data.config.maxSize && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tamanho Máximo</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {customNode.data.config.maxSize}
                  </div>
                </div>
              )}
            </>
          )}

          {isOutputNode && (
            <>
              <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                    <Info className="w-3 h-3" />
                    Formato de Entrada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Este componente recebe JSON estruturado do nó anterior.
                  </p>
                </CardContent>
              </Card>

              {customNode.data.config.format && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Formato</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {customNode.data.config.format.toUpperCase()}
                  </div>
                </div>
              )}
              {customNode.data.config.recipient !== undefined && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Destinatário</Label>
                  <Input
                    value={customNode.data.config.recipient || ''}
                    onChange={(e) => handleConfigChange('recipient', e.target.value)}
                    placeholder="email@exemplo.com"
                    className="h-9 text-sm"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
