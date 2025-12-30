import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIButton } from '@/components/ui/ai-button'
import { Switch } from '@/components/ui/switch'
import { 
  Edit,
  Trash2,
  Globe,
  Lock,
  Clock,
  Users,
  Sparkles,
  FileEdit,
  Workflow,
  GitBranch
} from 'lucide-react'
import { getCategoryInfo } from '@/services/agents.utils'
import { cn } from '@/lib/utils'

interface AgentCardProps {
  agent: {
    id: string
    name: string
    description?: string
    category: string
    difficulty?: string
    visibility?: string
    estimatedTime?: string
    useCase?: string
    flow?: string
    tags?: string[]
    categoryTags?: string[]
    icon?: React.ElementType
    status?: string
    nodes?: any[]
    edges?: any[]
  }
  // Modo do card: 'my-agents' mostra switch e botão excluir, 'public' mostra apenas executar/editar
  mode: 'my-agents' | 'public'
  onExecute: () => void
  onEdit: () => void
  onDelete?: () => void
  onToggleVisibility?: (isPublic: boolean) => void
  onClick?: () => void
  isUpdating?: boolean
}

export function AgentCard({
  agent,
  mode,
  onExecute,
  onEdit,
  onDelete,
  onToggleVisibility,
  onClick,
  isUpdating = false,
}: AgentCardProps) {
  const categoryInfo = getCategoryInfo(agent.category)
  const categoryColor = categoryInfo.color
  const CategoryIcon = agent.icon || categoryInfo.icon

  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  }

  const gradientClasses: Record<string, string> = {
    purple: 'from-purple-50/50 to-fuchsia-50/50 dark:from-purple-950/20 dark:to-fuchsia-950/20',
    emerald: 'from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20',
    amber: 'from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20',
    blue: 'from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20',
  }

  const isPublicOrCollaborative = agent.visibility === 'public' || agent.visibility === 'public_collaborative'
  const isCollaborative = agent.visibility === 'public_collaborative'

  return (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500"
      onClick={onClick}
    >
      {/* Header - Ícone, Título e Tags */}
      <CardHeader className={cn('bg-gradient-to-r border-b border-border', gradientClasses[categoryColor] || gradientClasses.purple)}>
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', colorClasses[categoryColor])}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg flex-1">{agent.name}</CardTitle>
        </div>
        {/* Tags no Header */}
        {agent.tags && agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {agent.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Descrição */}
        {agent.description && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Descrição</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{agent.description}</p>
          </div>
        )}

        {/* Grid de Informações - 4 colunas */}
        <div className="grid grid-cols-4 gap-2">
          {/* Visibilidade */}
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Visibilidade</p>
            <div className="flex items-center justify-center gap-1">
              {agent.visibility === 'public_collaborative' ? (
                <>
                  <Users className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">Colab.</span>
                </>
              ) : agent.visibility === 'public' ? (
                <>
                  <Globe className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Público</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-400">Privado</span>
                </>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Categoria</p>
            <span className={cn('text-xs font-semibold', `text-${categoryColor}-700 dark:text-${categoryColor}-400`)}>
              {agent.categoryTags?.[0] || categoryInfo.name}
            </span>
          </div>

          {/* Dificuldade */}
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dificuldade</p>
            <span className={cn('text-xs font-semibold', 
              agent.difficulty === 'iniciante' ? 'text-green-700 dark:text-green-400' : 
              agent.difficulty === 'avancado' ? 'text-red-700 dark:text-red-400' : 
              'text-orange-700 dark:text-orange-400'
            )}>
              {agent.difficulty === 'iniciante' ? 'Iniciante' : agent.difficulty === 'intermediario' ? 'Intermédio' : 'Avançado'}
            </span>
          </div>

          {/* Tempo Estimado */}
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tempo</p>
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{agent.estimatedTime || '-'}</span>
            </div>
          </div>
        </div>

        {/* Badge de Rascunho (se aplicável) */}
        {agent.status === 'draft' && (
          <div className="flex items-center justify-center gap-1 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <FileEdit className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Rascunho</span>
          </div>
        )}

        {/* Caso de Uso */}
        {agent.useCase && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Caso de Uso</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{agent.useCase}</p>
          </div>
        )}

        {/* Estatísticas de Nós e Conexões */}
        {(agent.nodes?.length || agent.edges?.length) ? (
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
            {agent.nodes && agent.nodes.length > 0 && (
              <div className="flex items-center gap-1">
                <Workflow className="w-3 h-3" />
                <span>{agent.nodes.length} nó{agent.nodes.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            {agent.edges && agent.edges.length > 0 && (
              <div className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                <span>{agent.edges.length} conexã{agent.edges.length !== 1 ? 'es' : 'o'}</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Switch de Visibilidade (apenas em my-agents) */}
        {mode === 'my-agents' && onToggleVisibility && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {agent.visibility === 'public' ? (
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ) : agent.visibility === 'public_collaborative' ? (
                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {agent.visibility === 'public' 
                    ? 'Público' 
                    : agent.visibility === 'public_collaborative' 
                      ? 'Público Colaborativo' 
                      : 'Privado'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {agent.visibility === 'public' 
                    ? 'Visível na galeria' 
                    : agent.visibility === 'public_collaborative' 
                      ? 'Todos podem editar' 
                      : 'Apenas você pode ver'}
                </p>
              </div>
            </div>
            <Switch
              checked={isPublicOrCollaborative}
              onCheckedChange={onToggleVisibility}
              onClick={(e) => e.stopPropagation()}
              disabled={isUpdating}
            />
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          {mode === 'my-agents' ? (
            // Modo Meus Agentes
            agent.status === 'draft' ? (
              // Rascunho: Continuar Editando + Excluir
              <>
                <Button
                  variant="aiEditOutlineHover"
                  size="sm"
                  onClick={onEdit}
                  className="flex-1 gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Continuar Editando
                </Button>
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    className="gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                )}
              </>
            ) : (
              // Publicado: Executar, Editar, Excluir
              <>
                <Button
                  variant="aiPrimary"
                  size="sm"
                  onClick={onExecute}
                  className="flex-1 gap-2 group"
                >
                  <Sparkles className="w-4 h-4 group-hover:animate-bounce" />
                  Executar
                </Button>
                <Button
                  variant="aiEditOutlineHover"
                  size="sm"
                  onClick={onEdit}
                  className="flex-1 gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    className="gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                )}
              </>
            )
          ) : (
            // Modo Público: Executar + Editar (se colaborativo)
            <>
              <AIButton
                variant="aiPrimary"
                size="sm"
                onClick={onExecute}
                shimmer
                className="flex-1 gap-2 group"
              >
                <Sparkles className="w-4 h-4 group-hover:animate-bounce" />
                Executar
              </AIButton>
              {isCollaborative && (
                <Button
                  variant="aiEditOutlineHover"
                  size="sm"
                  onClick={onEdit}
                  className="flex-1 gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
