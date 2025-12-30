import { useMemo } from 'react'
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Zap, 
  Brain, 
  DollarSign, 
  Sparkles, 
  Database,
  Info
} from 'lucide-react'
import {
  OpenAIModel,
  getModelById,
  getModelsByFamily,
  formatPrice,
  formatContextWindow,
  DEFAULT_MODEL_ID,
} from './openaiModels'

interface ModelSelectorProps {
  value?: string
  onChange: (modelId: string) => void
  className?: string
  /** Modo compacto: apenas o select, sem card de informações */
  compact?: boolean
}

/**
 * Barra de indicador visual (1-5)
 */
function RatingBar({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 w-3 rounded-sm transition-colors',
            i < value ? color : 'bg-gray-200 dark:bg-gray-700'
          )}
        />
      ))}
    </div>
  )
}

/**
 * Card de informações do modelo selecionado
 */
function ModelInfoCard({ model }: { model: OpenAIModel }) {
  const familyColors: Record<string, { bg: string; border: string; badge: string; bar: string }> = {
    'gpt-4.1': {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
      bar: 'bg-emerald-500',
    },
    'gpt-5': {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-800',
      badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      bar: 'bg-purple-500',
    },
  }

  const colors = familyColors[model.family] || familyColors['gpt-4.1']

  return (
    <div className={cn('rounded-lg border p-3 mt-2', colors.bg, colors.border)}>
      {/* Descrição */}
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
        {model.description}
      </p>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3">
        {/* Velocidade */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Zap className="w-3 h-3" />
            <span>Velocidade</span>
          </div>
          <RatingBar value={model.speed} color={colors.bar} />
        </div>

        {/* Inteligência */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Brain className="w-3 h-3" />
            <span>Inteligência</span>
          </div>
          <RatingBar value={model.intelligence} color={colors.bar} />
        </div>

        {/* Contexto */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Database className="w-3 h-3" />
            <span>Contexto</span>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {formatContextWindow(model.contextWindow)} tokens
          </span>
        </div>

        {/* Preço */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <DollarSign className="w-3 h-3" />
            <span>Preço/1M</span>
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {formatPrice(model.inputPrice)} / {formatPrice(model.outputPrice)}
          </span>
        </div>
      </div>

      {/* Tags */}
      {model.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {model.tags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className={cn('text-[10px] px-1.5 py-0', colors.badge)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Aviso de raciocínio */}
      {model.isReasoning && (
        <div className="flex items-start gap-1.5 mt-3 text-[10px] text-amber-600 dark:text-amber-400">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>
            Modelo de raciocínio: pode levar mais tempo para responder, mas oferece análises mais profundas.
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Componente de seleção de modelo OpenAI
 */
export function ModelSelector({ value, onChange, className, compact = false }: ModelSelectorProps) {
  // Buscar modelo diretamente (sem useMemo para garantir atualização imediata)
  // Garantir que sempre tenha um valor válido (verifica se o modelo existe)
  const validValue = value && getModelById(value) ? value : DEFAULT_MODEL_ID
  const selectedModel = getModelById(validValue)

  const modelsByFamily = useMemo(() => getModelsByFamily(), [])

  return (
    <div className={cn(compact ? '' : 'space-y-2', className)}>
      <Select value={validValue} onValueChange={onChange}>
        <SelectTrigger className={cn(compact ? 'w-[180px] h-8 text-xs' : 'w-full')}>
          <SelectValue placeholder="Selecione um modelo">
            {selectedModel && (
              <div className="flex items-center gap-2">
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  selectedModel.family === 'gpt-4.1' && 'bg-emerald-500',
                  selectedModel.family === 'gpt-5' && 'bg-purple-500'
                )} />
                <span>{selectedModel.name}</span>
                {selectedModel.speed >= 4 && (
                  <Zap className="w-3 h-3 text-amber-500" />
                )}
                {selectedModel.intelligence >= 5 && (
                  <Sparkles className="w-3 h-3 text-purple-500" />
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {Object.entries(modelsByFamily).map(([familyLabel, models]) => (
            <SelectGroup key={familyLabel}>
              <SelectLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2">
                {familyLabel}
              </SelectLabel>
              {models.map(model => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        model.family === 'gpt-4.1' && 'bg-emerald-500',
                        model.family === 'gpt-5' && 'bg-purple-500'
                      )} />
                      <span className="font-medium">{model.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {model.speed >= 4 && (
                        <span className="flex items-center gap-0.5 text-amber-600">
                          <Zap className="w-3 h-3" />
                        </span>
                      )}
                      {model.intelligence >= 5 && (
                        <span className="flex items-center gap-0.5 text-purple-600">
                          <Sparkles className="w-3 h-3" />
                        </span>
                      )}
                      <span className="text-gray-400">
                        {formatPrice(model.inputPrice)}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {/* Card de informações do modelo selecionado (apenas no modo completo) */}
      {!compact && selectedModel && <ModelInfoCard key={selectedModel.id} model={selectedModel} />}
    </div>
  )
}

export default ModelSelector
