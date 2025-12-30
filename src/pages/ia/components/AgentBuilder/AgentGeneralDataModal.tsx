import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TagsInput } from '@/components/ui/tags-input'
import { useAgentTags, useFindOrCreateTag, mapTagsToInput } from '@/hooks/useTags'
import {
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  Save,
  GraduationCap,
  DollarSign,
  UserCog,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AgentGeneralData {
  name: string
  description: string
  category: 'academico' | 'financeiro' | 'rh' | 'administrativo'
  difficulty: 'iniciante' | 'intermediario' | 'avancado'
  estimatedTime: string
  howItHelps: string
  bestUses: string[]
  tags: string[]
  visibility: 'public' | 'public_collaborative' | 'private'
  type: 'public_school' | 'public_editable' | 'private' | 'restricted'
  useCase: string
}

interface AgentGeneralDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<AgentGeneralData>
  onSave: (data: AgentGeneralData) => void
  onSaveDraft?: (data: AgentGeneralData) => void
  onCancel?: () => void
  isLoading?: boolean
  isSavingDraft?: boolean
  mode?: 'create' | 'edit'
}

const categoryIcons = {
  academico: GraduationCap,
  financeiro: DollarSign,
  rh: UserCog,
  administrativo: Building2,
}

const estimatedTimeOptions = [
  '1-2 min',
  '2-3 min',
  '3-5 min',
  '5-10 min',
  '10-15 min',
  '15-30 min',
  '30+ min',
]

const defaultData: AgentGeneralData = {
  name: '',
  description: '',
  category: 'academico',
  difficulty: 'iniciante',
  estimatedTime: '3-5 min',
  howItHelps: '',
  bestUses: [],
  tags: [],
  visibility: 'private',
  type: 'private',
  useCase: '',
}

export function AgentGeneralDataModal({
  open,
  onOpenChange,
  initialData,
  onSave,
  onSaveDraft,
  onCancel,
  isLoading = false,
  isSavingDraft = false,
  mode = 'create',
}: AgentGeneralDataModalProps) {
  const [data, setData] = useState<AgentGeneralData>({ ...defaultData, ...initialData })
  const [newBestUse, setNewBestUse] = useState('')
  const [tagSearch, setTagSearch] = useState('')
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})
  const [bestUseError, setBestUseError] = useState('')
  const [touched, setTouched] = useState<{ name?: boolean; description?: boolean }>({})

  // Hooks para tags
  const { data: tagsData, isLoading: isLoadingTags } = useAgentTags(tagSearch)
  const findOrCreateTag = useFindOrCreateTag()

  // Resetar form quando modal abre com novos dados iniciais
  useEffect(() => {
    if (open) {
      setData({ ...defaultData, ...initialData })
      setErrors({})
      setTouched({})
      setBestUseError('')
    }
  }, [open, initialData])

  const handleChange = (field: keyof AgentGeneralData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
    // Limpar erro quando usuário começa a digitar
    if (field === 'name' || field === 'description') {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBlur = (field: 'name' | 'description') => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    if (field === 'name' && !data.name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Nome é obrigatório' }))
    }
    if (field === 'description' && !data.description.trim()) {
      setErrors((prev) => ({ ...prev, description: 'Descrição é obrigatória' }))
    }
  }

  const handleAddBestUse = () => {
    setBestUseError('')
    const trimmedValue = newBestUse.trim()
    
    if (!trimmedValue) {
      return
    }
    
    if (data.bestUses.includes(trimmedValue)) {
      setBestUseError('Este uso já foi adicionado')
      return
    }
    
    setData((prev) => ({
      ...prev,
      bestUses: [...prev.bestUses, trimmedValue],
    }))
    setNewBestUse('')
  }

  const handleRemoveBestUse = (index: number) => {
    setData((prev) => ({
      ...prev,
      bestUses: prev.bestUses.filter((_, i) => i !== index),
    }))
  }

  const handleCreateTag = async (name: string) => {
    try {
      await findOrCreateTag.mutateAsync({ name, category: 'agent' })
    } catch (error) {
      console.error('Erro ao criar tag:', error)
    }
  }

  const validateData = (): boolean => {
    const newErrors: { name?: string; description?: string } = {}
    
    if (!data.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    if (!data.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched({ name: true, description: true })
      return false
    }
    return true
  }

  const handleSave = () => {
    if (!validateData()) return
    onSave(data)
  }

  const handleSaveDraft = () => {
    if (!validateData()) return
    onSaveDraft?.(data)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onOpenChange(false)
    }
  }

  // Sincronizar visibility e type
  const handleVisibilityChange = (visibility: 'public' | 'public_collaborative' | 'private') => {
    let type: AgentGeneralData['type'] = 'private'
    if (visibility === 'public') {
      type = 'public_school'
    } else if (visibility === 'public_collaborative') {
      type = 'public_editable'
    }
    setData((prev) => ({ ...prev, visibility, type }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {mode === 'create' ? (
              <>
                <Sparkles className="w-5 h-5 text-purple-500" />
                Dados Gerais do Agente
              </>
            ) : (
              <>
                <Save className="w-5 h-5 text-purple-500" />
                Editar Dados Gerais
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Nome e Categoria lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome do Agente <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Ex: Analisador de Desempenho"
                className={cn(touched.name && errors.name && 'border-red-500 focus-visible:ring-red-500')}
              />
              {touched.name && errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Categoria
              </Label>
              <Select
                value={data.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryIcons).map(([key, Icon]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>
                          {key === 'academico'
                            ? 'Acadêmico'
                            : key === 'financeiro'
                            ? 'Financeiro'
                            : key === 'rh'
                            ? 'Recursos Humanos'
                            : 'Administrativo'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="Descreva o que este agente faz..."
              rows={2}
              className={cn(touched.description && errors.description && 'border-red-500 focus-visible:ring-red-500')}
            />
            {touched.description && errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Dificuldade, Tempo e Visibilidade */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Dificuldade</Label>
              <Select
                value={data.difficulty}
                onValueChange={(value: any) => handleChange('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iniciante">🟢 Iniciante</SelectItem>
                  <SelectItem value="intermediario">🟡 Intermediário</SelectItem>
                  <SelectItem value="avancado">🔴 Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tempo Estimado</Label>
              <Select
                value={data.estimatedTime}
                onValueChange={(value) => handleChange('estimatedTime', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {estimatedTimeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      ⏱️ {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Visibilidade</Label>
              <Select
                value={data.visibility}
                onValueChange={handleVisibilityChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">🔒 Privado</SelectItem>
                  <SelectItem value="public">🌐 Público</SelectItem>
                  <SelectItem value="public_collaborative">👥 Público Colaborativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Como Pode Ajudar */}
          <div className="space-y-2">
            <Label htmlFor="howItHelps" className="text-sm font-medium">
              Como Pode Ajudar
            </Label>
            <Textarea
              id="howItHelps"
              value={data.howItHelps}
              onChange={(e) => handleChange('howItHelps', e.target.value)}
              placeholder="Descreva como este agente pode ajudar os usuários..."
              rows={2}
            />
          </div>

          {/* Caso de Uso */}
          <div className="space-y-2">
            <Label htmlFor="useCase" className="text-sm font-medium">
              Caso de Uso
            </Label>
            <Textarea
              id="useCase"
              value={data.useCase}
              onChange={(e) => handleChange('useCase', e.target.value)}
              placeholder="Descreva um caso de uso específico..."
              rows={2}
            />
          </div>

          {/* Melhores Usos */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Melhores Usos</Label>
            <div className="space-y-2">
              {/* Input primeiro */}
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Input
                    value={newBestUse}
                    onChange={(e) => {
                      setNewBestUse(e.target.value)
                      setBestUseError('')
                    }}
                    placeholder="Adicionar melhor uso..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddBestUse()
                      }
                    }}
                    className={cn(bestUseError && 'border-red-500 focus-visible:ring-red-500')}
                  />
                  {bestUseError && (
                    <p className="text-xs text-red-500">{bestUseError}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBestUse}
                  disabled={!newBestUse.trim()}
                  className="h-10"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {/* Lista de usos abaixo */}
              {data.bestUses.length > 0 && (
                <div className="space-y-2 mt-2">
                  {data.bestUses.map((use, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                    >
                      <span className="flex-1 text-sm">{use}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBestUse(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <TagsInput
              value={data.tags}
              onChange={(tags) => handleChange('tags', tags)}
              suggestions={tagsData ? mapTagsToInput(tagsData) : []}
              onSearch={setTagSearch}
              onCreateTag={handleCreateTag}
              isLoading={isLoadingTags || findOrCreateTag.isPending}
              placeholder="Adicionar tags..."
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading || isSavingDraft}>
            Cancelar
          </Button>
          {mode === 'create' && onSaveDraft ? (
            <Button
              variant="aiAction"
              onClick={handleSaveDraft}
              disabled={isLoading || isSavingDraft || !data.name.trim() || !data.description.trim()}
            >
              {isSavingDraft ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Rascunho e Continuar
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="aiAction"
              onClick={handleSave}
              disabled={isLoading || !data.name.trim() || !data.description.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
