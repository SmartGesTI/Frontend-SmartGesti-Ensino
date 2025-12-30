import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { 
  ListOrdered, 
  FileText, 
  Briefcase, 
  Smile, 
  Target,
  Clock,
  Hash,
  Star,
  X,
  Check,
  GraduationCap,
  Languages,
  Award,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

export interface InstructionChip {
  id: string
  label: string
  icon: React.ElementType
  instruction: string
  /** Padrão único para detectar se o chip está ativo no texto */
  detectPattern: RegExp
  /** Se true, permite input personalizado (ex: número de linhas) */
  hasInput?: boolean
  inputPlaceholder?: string
  inputSuffix?: string
  defaultValue?: string
  /** Cor do chip (default: blue) */
  color?: 'blue' | 'amber' | 'purple' | 'emerald'
}

// Chips padrão para agentes genéricos
export const DEFAULT_INSTRUCTION_CHIPS: InstructionChip[] = [
  {
    id: 'limit-lines',
    label: 'Limite de Linhas',
    icon: ListOrdered,
    instruction: 'Limite o resultado a {value} linhas.',
    detectPattern: /Limite o resultado a \d+ linhas\./i,
    hasInput: true,
    inputPlaceholder: '20',
    inputSuffix: 'linhas',
    defaultValue: '20'
  },
  {
    id: 'bullet-points',
    label: 'Em Tópicos',
    icon: Target,
    instruction: 'Organize o resultado em tópicos/bullet points para fácil leitura.',
    detectPattern: /tópicos\/bullet points/i,
  },
  {
    id: 'formal-tone',
    label: 'Tom Formal',
    icon: Briefcase,
    instruction: 'Use tom formal e profissional na redação.',
    detectPattern: /tom formal e profissional/i,
  },
  {
    id: 'simple-language',
    label: 'Linguagem Simples',
    icon: Smile,
    instruction: 'Use linguagem simples e acessível, evitando termos técnicos complexos.',
    detectPattern: /linguagem simples e acessível/i,
  },
  {
    id: 'be-concise',
    label: 'Seja Conciso',
    icon: Clock,
    instruction: 'Seja conciso e direto, focando apenas nos pontos essenciais.',
    detectPattern: /conciso e direto/i,
  },
  {
    id: 'detailed',
    label: 'Detalhado',
    icon: FileText,
    instruction: 'Forneça uma análise detalhada e abrangente.',
    detectPattern: /análise detalhada e abrangente/i,
  },
  {
    id: 'numbered-list',
    label: 'Lista Numerada',
    icon: Hash,
    instruction: 'Organize os itens em uma lista numerada.',
    detectPattern: /lista numerada/i,
  },
  {
    id: 'key-points',
    label: 'Destaque Pontos Chave',
    icon: Star,
    instruction: 'Inclua uma seção destacando os pontos chave mais importantes.',
    detectPattern: /seção destacando os pontos chave/i,
  },
]

// Chips específicos para Análise de Currículo (adicionais aos padrões)
const CURRICULUM_SPECIFIC_CHIPS: InstructionChip[] = [
  {
    id: 'experience-years',
    label: 'Tempo de Experiência',
    icon: Clock,
    instruction: 'Destaque o tempo total de experiência profissional e em cada cargo.',
    detectPattern: /tempo total de experiência profissional/i,
    color: 'amber'
  },
  {
    id: 'education',
    label: 'Foco em Formação',
    icon: GraduationCap,
    instruction: 'Dê ênfase à formação acadêmica, cursos e certificações do candidato.',
    detectPattern: /ênfase à formação acadêmica/i,
    color: 'amber'
  },
  {
    id: 'languages',
    label: 'Idiomas',
    icon: Languages,
    instruction: 'Detalhe os idiomas que o candidato domina e seus níveis de proficiência.',
    detectPattern: /idiomas que o candidato domina/i,
    color: 'amber'
  },
  {
    id: 'certifications',
    label: 'Certificações',
    icon: Award,
    instruction: 'Liste todas as certificações e cursos relevantes mencionados no currículo.',
    detectPattern: /certificações e cursos relevantes/i,
    color: 'amber'
  },
  {
    id: 'career-growth',
    label: 'Evolução de Carreira',
    icon: TrendingUp,
    instruction: 'Analise a progressão de carreira e evolução profissional do candidato.',
    detectPattern: /progressão de carreira e evolução profissional/i,
    color: 'amber'
  },
  {
    id: 'red-flags',
    label: 'Pontos de Atenção',
    icon: AlertCircle,
    instruction: 'Identifique possíveis pontos de atenção como períodos sem emprego ou inconsistências.',
    detectPattern: /pontos de atenção como períodos/i,
    color: 'amber'
  },
  {
    id: 'fit-analysis',
    label: 'Análise de Adequação',
    icon: Target,
    instruction: 'Avalie o quão adequado o candidato é para a vaga com base nos requisitos informados.',
    detectPattern: /adequado o candidato é para a vaga/i,
    color: 'amber'
  },
]

// Chips para Análise de Currículo = Padrões + Específicos
export const CURRICULUM_INSTRUCTION_CHIPS: InstructionChip[] = [
  ...DEFAULT_INSTRUCTION_CHIPS,
  ...CURRICULUM_SPECIFIC_CHIPS,
]

interface InstructionChipsProps {
  value: string
  onChange: (value: string) => void
  className?: string
  /** Chips personalizados (se não fornecido, usa os padrões) */
  chips?: InstructionChip[]
}

export function InstructionChips({ value, onChange, className, chips }: InstructionChipsProps) {
  const [activeChipInput, setActiveChipInput] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  // Usar chips personalizados ou padrão
  const activeChips = chips || DEFAULT_INSTRUCTION_CHIPS

  // Verificar quais chips já estão no texto usando padrão específico
  const isChipActive = (chip: InstructionChip): boolean => {
    return chip.detectPattern.test(value)
  }

  // Remover instrução do texto (usa a instrução completa)
  const removeInstruction = (chip: InstructionChip) => {
    // Para chips com input (como limite de linhas), usar o padrão regex
    // Para outros, remover a instrução exata
    let newValue: string
    if (chip.hasInput) {
      newValue = value.replace(chip.detectPattern, '')
    } else {
      newValue = value.replace(chip.instruction, '')
    }
    // Limpar espaços extras
    newValue = newValue.replace(/\s+/g, ' ').trim()
    onChange(newValue)
  }

  const handleChipClick = (chip: InstructionChip) => {
    const active = isChipActive(chip)
    
    // Se já está ativo, remover
    if (active) {
      removeInstruction(chip)
      return
    }

    // Se tem input, abrir campo
    if (chip.hasInput) {
      setActiveChipInput(chip.id)
      setInputValue(chip.defaultValue || '')
      return
    }

    // Adicionar instrução ao texto
    addInstruction(chip.instruction)
  }

  const addInstruction = (instruction: string) => {
    const currentValue = value.trim()
    if (currentValue) {
      onChange(`${currentValue} ${instruction}`)
    } else {
      onChange(instruction)
    }
  }

  const handleInputConfirm = (chip: InstructionChip) => {
    if (!inputValue.trim()) {
      setActiveChipInput(null)
      return
    }

    const instruction = chip.instruction.replace('{value}', inputValue.trim())
    addInstruction(instruction)
    setActiveChipInput(null)
    setInputValue('')
  }

  const handleInputCancel = () => {
    setActiveChipInput(null)
    setInputValue('')
  }

  // Classes de cor por tipo
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-300 dark:border-blue-700',
      text: 'text-blue-600 dark:text-blue-400',
      activeBg: 'bg-blue-100 dark:bg-blue-900/30',
      activeText: 'text-blue-700 dark:text-blue-300',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-300 dark:border-amber-700',
      text: 'text-amber-600 dark:text-amber-400',
      activeBg: 'bg-amber-100 dark:bg-amber-900/30',
      activeText: 'text-amber-700 dark:text-amber-300',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-300 dark:border-purple-700',
      text: 'text-purple-600 dark:text-purple-400',
      activeBg: 'bg-purple-100 dark:bg-purple-900/30',
      activeText: 'text-purple-700 dark:text-purple-300',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-300 dark:border-emerald-700',
      text: 'text-emerald-600 dark:text-emerald-400',
      activeBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      activeText: 'text-emerald-700 dark:text-emerald-300',
    },
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-1.5">
        {activeChips.map((chip) => {
          const Icon = chip.icon
          const isActive = isChipActive(chip)
          const isInputMode = activeChipInput === chip.id
          const colors = colorClasses[chip.color || 'blue']

          if (isInputMode) {
            return (
              <div 
                key={chip.id}
                className={cn('flex items-center gap-1 rounded-full px-2 py-0.5', colors.bg, colors.border, 'border')}
              >
                <Icon className={cn('w-3 h-3', colors.text)} />
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={chip.inputPlaceholder}
                  className="w-14 h-5 text-xs px-1 py-0 border-0 bg-transparent focus-visible:ring-0"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleInputConfirm(chip)
                    if (e.key === 'Escape') handleInputCancel()
                  }}
                />
                {chip.inputSuffix && (
                  <span className={cn('text-[10px]', colors.text)}>
                    {chip.inputSuffix}
                  </span>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleInputConfirm(chip)}
                  className="h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  <Check className="w-3 h-3 text-blue-600" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleInputCancel}
                  className="h-4 w-4 p-0 hover:bg-red-200 dark:hover:bg-red-800"
                >
                  <X className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            )
          }

          return (
            <Button
              key={chip.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleChipClick(chip)}
              className={cn(
                'h-6 px-2 py-0 text-[10px] gap-1 rounded-full transition-all',
                isActive 
                  ? cn(colors.activeBg, colors.border, colors.activeText)
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Icon className="w-3 h-3" />
              {chip.label}
              {chip.hasInput && <span className="text-gray-400">+</span>}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default InstructionChips
