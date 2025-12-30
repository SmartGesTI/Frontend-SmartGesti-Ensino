import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Plus, 
  Loader2,
} from 'lucide-react'
import { useAgents, useUpdateAgent, useDeleteAgent } from '@/hooks/useAgents'
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

export default function MeusAgentes() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null)

  // Buscar agentes do usuário (todos, incluindo rascunhos)
  const { data: agents = [], isLoading, error } = useAgents({ 
    myAgents: true 
  })
  
  const updateAgent = useUpdateAgent()
  const deleteAgent = useDeleteAgent()

  // Enriquecer agentes com categoryTags
  const myAgents = useMemo(() => {
    return agents.map((agent) => {
      const categoryInfo = getCategoryInfo(agent.category)
      return {
        ...agent,
        categoryTags: [categoryInfo.name],
      }
    })
  }, [agents])

  // Filtrar agentes
  const filteredAgents = useMemo(() => {
    if (isLoading || !myAgents.length) {
      return []
    }

    return myAgents.filter((agent) => {
      const matchesSearch = searchTerm === '' ||
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'todos' || agent.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [myAgents, searchTerm, selectedCategory, isLoading])

  const handleTogglePublic = (agentId: string, isPublic: boolean) => {
    updateAgent.mutate({
      agentId,
      data: {
        visibility: isPublic ? 'public' : 'private',
      },
    })
  }

  const handleEdit = (agentId: string) => {
    navigate(`/escola/${slug}/ia/criar?edit=${agentId}`)
  }

  const handleDelete = (agentId: string) => {
    if (confirm('Tem certeza que deseja excluir este agente?')) {
      deleteAgent.mutate(agentId)
    }
  }

  const handleExecute = (agentId: string) => {
    navigate(`/escola/${slug}/ia/criar?template=${agentId}`)
  }

  const handleCardClick = (agent: typeof myAgents[0]) => {
    setSelectedAgent(agent)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Carregando seus agentes...</p>
        </div>
      </div>
    )
  }

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
            placeholder="Buscar meus agentes..."
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
      </div>

      {/* Grid de Agentes */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Nenhum agente encontrado.</p>
          <Button
            variant="aiAction"
            onClick={() => navigate(`/escola/${slug}/ia/criar`)}
            className="mt-4 gap-2"
          >
            <Plus className="w-4 h-4" />
            Criar Primeiro Agente
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              mode="my-agents"
              onExecute={() => handleExecute(agent.id)}
              onEdit={() => handleEdit(agent.id)}
              onDelete={() => handleDelete(agent.id)}
              onToggleVisibility={(checked) => handleTogglePublic(agent.id, checked)}
              onClick={() => handleCardClick(agent)}
              isUpdating={updateAgent.isPending}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalhes do Agente */}
      <AgentDetailsModal
        agent={selectedAgent}
        open={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
        mode="my-agents"
        onExecute={() => selectedAgent && handleExecute(selectedAgent.id)}
        onEdit={() => selectedAgent && handleEdit(selectedAgent.id)}
        onDelete={() => selectedAgent && handleDelete(selectedAgent.id)}
      />
    </div>
  )
}
