import { Zap, Brain, Sparkles, Rocket } from 'lucide-react'

export interface OpenAIModel {
  id: string
  name: string
  family: 'gpt-4.1' | 'gpt-5'
  /** Preço de entrada por 1M tokens em USD */
  inputPrice: number
  /** Preço de saída por 1M tokens em USD */
  outputPrice: number
  /** Tamanho do contexto em tokens */
  contextWindow: number
  /** Velocidade relativa (1-5, sendo 5 mais rápido) */
  speed: 1 | 2 | 3 | 4 | 5
  /** Inteligência/capacidade relativa (1-5, sendo 5 mais inteligente) */
  intelligence: 1 | 2 | 3 | 4 | 5
  /** Descrição curta sobre o caso de uso ideal */
  description: string
  /** Se é um modelo de raciocínio (reasoning) */
  isReasoning: boolean
  /** Tags para categorização */
  tags: string[]
}

/**
 * Lista de modelos OpenAI disponíveis
 * Dados baseados na documentação oficial: https://platform.openai.com/docs/pricing
 * Atualizado em: Dezembro 2025
 */
export const OPENAI_MODELS: OpenAIModel[] = [
  // === GPT-4.1 Family (Recomendado para tarefas do dia a dia) ===
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    family: 'gpt-4.1',
    inputPrice: 2.0,
    outputPrice: 8.0,
    contextWindow: 1_000_000,
    speed: 4,
    intelligence: 4,
    description: 'Modelo equilibrado com excelente custo-benefício. Ótimo para tarefas gerais, análises e geração de conteúdo. Contexto de 1M tokens permite processar documentos longos.',
    isReasoning: false,
    tags: ['recomendado', 'versátil', 'custo-benefício'],
  },
  {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    family: 'gpt-4.1',
    inputPrice: 0.4,
    outputPrice: 1.6,
    contextWindow: 1_000_000,
    speed: 5,
    intelligence: 3,
    description: 'Versão compacta e ultra-rápida. Perfeito para tarefas simples do dia a dia como resumos, classificações e extração de dados. Melhor custo para alto volume.',
    isReasoning: false,
    tags: ['rápido', 'econômico', 'alto-volume'],
  },
  {
    id: 'gpt-4.1-nano',
    name: 'GPT-4.1 Nano',
    family: 'gpt-4.1',
    inputPrice: 0.1,
    outputPrice: 0.4,
    contextWindow: 1_000_000,
    speed: 5,
    intelligence: 2,
    description: 'O modelo mais rápido e barato da OpenAI. Ideal para tarefas muito simples, validações e processos de alto volume onde velocidade é prioridade máxima.',
    isReasoning: false,
    tags: ['mais-rápido', 'mais-barato', 'simples'],
  },

  // === GPT-5 Family (Modelos de Raciocínio Avançado) ===
  {
    id: 'gpt-5.2',
    name: 'GPT-5.2',
    family: 'gpt-5',
    inputPrice: 2.5,
    outputPrice: 10.0,
    contextWindow: 256_000,
    speed: 2,
    intelligence: 5,
    description: 'O modelo mais inteligente da OpenAI. Raciocínio profundo para tarefas complexas como análises jurídicas, científicas e problemas multifacetados. Usa mais tempo pensando.',
    isReasoning: true,
    tags: ['mais-inteligente', 'raciocínio', 'complexo'],
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    family: 'gpt-5',
    inputPrice: 1.25,
    outputPrice: 10.0,
    contextWindow: 256_000,
    speed: 2,
    intelligence: 5,
    description: 'Modelo de raciocínio avançado para tarefas que exigem pensamento profundo. Excelente para análises complexas, código e problemas de múltiplas etapas.',
    isReasoning: true,
    tags: ['raciocínio', 'código', 'análise-profunda'],
  },
  {
    id: 'gpt-5-mini',
    name: 'GPT-5 Mini',
    family: 'gpt-5',
    inputPrice: 0.3,
    outputPrice: 1.25,
    contextWindow: 256_000,
    speed: 3,
    intelligence: 4,
    description: 'Capacidade de raciocínio com custo reduzido. Bom equilíbrio entre inteligência e velocidade para tarefas que precisam de alguma reflexão mas não são extremamente complexas.',
    isReasoning: true,
    tags: ['raciocínio', 'equilibrado', 'custo-médio'],
  },
  {
    id: 'gpt-5-nano',
    name: 'GPT-5 Nano',
    family: 'gpt-5',
    inputPrice: 0.05,
    outputPrice: 0.40,
    contextWindow: 256_000,
    speed: 3,
    intelligence: 3,
    description: 'Versão compacta do GPT-5 com capacidade de raciocínio básico. Mais lento que GPT-4.1 mas com melhor compreensão. Use quando precisar de mais "reflexão" a baixo custo.',
    isReasoning: true,
    tags: ['raciocínio-básico', 'econômico', 'reflexivo'],
  },
]

/**
 * Modelo padrão recomendado para uso geral
 */
export const DEFAULT_MODEL_ID = 'gpt-4.1-mini'

/**
 * Retorna um modelo pelo ID
 */
export function getModelById(modelId: string): OpenAIModel | undefined {
  return OPENAI_MODELS.find(m => m.id === modelId)
}

/**
 * Retorna o modelo padrão
 */
export function getDefaultModel(): OpenAIModel {
  return getModelById(DEFAULT_MODEL_ID) || OPENAI_MODELS[0]
}

/**
 * Formata o preço para exibição (sempre com 2 casas decimais)
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

/**
 * Formata o contexto para exibição
 */
export function formatContextWindow(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(0)}M`
  }
  return `${(tokens / 1_000).toFixed(0)}K`
}

/**
 * Calcula o custo estimado para uma quantidade de tokens
 */
export function estimateCost(model: OpenAIModel, inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * model.inputPrice
  const outputCost = (outputTokens / 1_000_000) * model.outputPrice
  return inputCost + outputCost
}

/**
 * Retorna ícone baseado na velocidade
 */
export function getSpeedIcon(speed: number) {
  return speed >= 4 ? Zap : Rocket
}

/**
 * Retorna ícone baseado na inteligência
 */
export function getIntelligenceIcon(intelligence: number) {
  return intelligence >= 4 ? Sparkles : Brain
}

/**
 * Retorna cor baseada na família do modelo
 */
export function getModelFamilyColor(family: OpenAIModel['family']): string {
  switch (family) {
    case 'gpt-4.1':
      return 'emerald'
    case 'gpt-5':
      return 'purple'
    default:
      return 'gray'
  }
}

/**
 * Agrupa modelos por família
 */
export function getModelsByFamily(): Record<string, OpenAIModel[]> {
  return OPENAI_MODELS.reduce((acc, model) => {
    const familyLabel = model.family === 'gpt-4.1' 
      ? 'GPT-4.1 (Rápido & Econômico)' 
      : 'GPT-5 (Raciocínio Avançado)'
    
    if (!acc[familyLabel]) {
      acc[familyLabel] = []
    }
    acc[familyLabel].push(model)
    return acc
  }, {} as Record<string, OpenAIModel[]>)
}
