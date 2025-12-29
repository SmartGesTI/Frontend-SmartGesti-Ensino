import { Node } from 'reactflow'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomNode } from './types'

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

        <div className="space-y-4">
          {customNode.data.category === 'ANALISAR COM IA' && (
            <>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Instruções para IA</Label>
                <Textarea
                  value={customNode.data.config.instructions || ''}
                  onChange={(e) => handleConfigChange('instructions', e.target.value)}
                  placeholder="Digite as instruções para a IA..."
                  className="min-h-[120px] text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Melhorar
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Provedor de IA</Label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  OpenAI
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Modelo</Label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  GPT-4o Mini (Recomendado)
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Max Tokens: 128.000 • Custo por 1k tokens: $0.00015
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Capacidades: text, code, reasoning, analysis
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">
                  ★ Melhor custo-benefício para tarefas RH
                </div>
              </div>
            </>
          )}

          {customNode.data.category === 'RECEBER DADOS' && (
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

          {customNode.data.category === 'ENVIAR E GERAR' && (
            <>
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
