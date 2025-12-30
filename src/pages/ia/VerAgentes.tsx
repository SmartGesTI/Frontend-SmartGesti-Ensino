import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Plus, 
  Brain,
  FolderOpen,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import { useAgents } from '@/hooks/useAgents'
import { getCategoryInfo, categoryInfoMap } from '@/services/agents.utils'
import { AgentCard } from './components/AgentCard'
import { AgentDetailsModal } from './components/AgentDetailsModal'

// Categorias de templates (baseado nas categorias do banco)
const templateCategories = [
  {
    id: 'academico',
    name: 'Acadêmico',
    icon: categoryInfoMap.academico.icon,
    color: categoryInfoMap.academico.color,
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    icon: categoryInfoMap.financeiro.icon,
    color: categoryInfoMap.financeiro.color,
  },
  {
    id: 'rh',
    name: 'Recursos Humanos',
    icon: categoryInfoMap.rh.icon,
    color: categoryInfoMap.rh.color,
  },
  {
    id: 'administrativo',
    name: 'Administrativo',
    icon: categoryInfoMap.administrativo.icon,
    color: categoryInfoMap.administrativo.color,
  },
]

export default function VerAgentes() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todos')
  const [sortBy, setSortBy] = useState<string>('nome')
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)

  // Buscar agentes publicados da API (todos, filtramos no frontend)
  const { data: allAgents = [], isLoading, error } = useAgents({ 
    status: 'published'
  })

  // Filtrar apenas agentes públicos (public e public_collaborative) e enriquecer com categoryTags
  const enrichedTemplates = useMemo(() => {
    return allAgents
      .filter((agent) => agent.visibility === 'public' || agent.visibility === 'public_collaborative')
      .map((template) => {
        const categoryInfo = getCategoryInfo(template.category)
        return {
          ...template,
          categoryTags: [categoryInfo.name],
        }
      })
  }, [allAgents])

  // Filtrar e ordenar templates
  const filteredTemplates = useMemo(() => {
    if (isLoading || !enrichedTemplates.length) {
      return []
    }

    let filtered = enrichedTemplates.filter((template) => {
      const matchesSearch = searchTerm === '' || 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === 'todos' || template.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'todos' || template.difficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesDifficulty
    })

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.name.localeCompare(b.name)
        case 'uso':
          return (b.usageCount || 0) - (a.usageCount || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [enrichedTemplates, searchTerm, selectedCategory, selectedDifficulty, sortBy, isLoading])

  // Calcular métricas
  const metrics = useMemo(() => {
    if (isLoading || !enrichedTemplates.length) {
      return {
        totalTemplates: 0,
        categories: 0,
        mostUsed: '-',
      }
    }

    const totalTemplates = enrichedTemplates.length
    const categories = new Set(enrichedTemplates.map((t) => t.category)).size
    const mostUsed = enrichedTemplates.reduce((prev, current) =>
      (current.usageCount || 0) > (prev.usageCount || 0) ? current : prev
    )

    return {
      totalTemplates,
      categories,
      mostUsed: mostUsed.name,
    }
  }, [enrichedTemplates, isLoading])

  const handleExecute = (template: typeof enrichedTemplates[0]) => {
    navigate(`/escola/${slug}/ia/criar?template=${template.id}`)
  }

  const handleEdit = (template: typeof enrichedTemplates[0]) => {
    navigate(`/escola/${slug}/ia/criar?edit=${template.id}`)
  }

  const handleCardClick = (template: typeof enrichedTemplates[0]) => {
    setSelectedTemplate(template)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Carregando agentes...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Erro ao carregar agentes</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{String(error)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar agentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as Categorias</SelectItem>
            {templateCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as Dificuldades</SelectItem>
            <SelectItem value="iniciante">Iniciante</SelectItem>
            <SelectItem value="intermediario">Intermediário</SelectItem>
            <SelectItem value="avancado">Avançado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nome">Nome</SelectItem>
            <SelectItem value="uso">Mais Usado</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="aiAction"
          onClick={() => navigate(`/escola/${slug}/ia/criar`)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Criar Novo Agente
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Agentes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.totalTemplates}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categorias</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mais Usado</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{metrics.mostUsed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Templates */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Nenhum agente encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <AgentCard
              key={template.id}
              agent={template}
              mode="public"
              onExecute={() => handleExecute(template)}
              onEdit={() => handleEdit(template)}
              onClick={() => handleCardClick(template)}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalhes do Agente */}
      <AgentDetailsModal
        agent={selectedTemplate}
        open={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        mode="public"
        onExecute={() => selectedTemplate && handleExecute(selectedTemplate)}
        onEdit={() => selectedTemplate && handleEdit(selectedTemplate)}
      />
    </div>
  )
}
