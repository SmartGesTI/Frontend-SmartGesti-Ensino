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
  Check
} from 'lucide-react'

interface InstructionChip {
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
}

const INSTRUCTION_CHIPS: InstructionChip[] = [
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

interface InstructionChipsProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function InstructionChips({ value, onChange, className }: InstructionChipsProps) {
  const [activeChipInput, setActiveChipInput] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

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

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-1.5">
        {INSTRUCTION_CHIPS.map((chip) => {
          const Icon = chip.icon
          const isActive = isChipActive(chip)
          const isInputMode = activeChipInput === chip.id

          if (isInputMode) {
            return (
              <div 
                key={chip.id}
                className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-700 rounded-full px-2 py-0.5"
              >
                <Icon className="w-3 h-3 text-blue-600 dark:text-blue-400" />
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
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">
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
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
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
