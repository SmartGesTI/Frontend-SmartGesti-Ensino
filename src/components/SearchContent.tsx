import { useState } from 'react'
import { 
  Search, 
  Sparkles, 
  Filter, 
  X, 
  Users, 
  GraduationCap, 
  FileText, 
  Calendar,
  Building2,
  BookOpen,
  Tag,
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AIButton } from '@/components/ui/ai-button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SearchFilter {
  id: string
  label: string
  icon: typeof Users
  count?: number
}

interface SearchTag {
  id: string
  label: string
  color: string
}

interface RecentSearch {
  id: string
  query: string
  type: string
  timestamp: string
}

const filters: SearchFilter[] = [
  { id: 'all', label: 'Tudo', icon: Search, count: 1247 },
  { id: 'students', label: 'Alunos', icon: Users, count: 342 },
  { id: 'classes', label: 'Turmas', icon: GraduationCap, count: 28 },
  { id: 'documents', label: 'Documentos', icon: FileText, count: 156 },
  { id: 'events', label: 'Eventos', icon: Calendar, count: 45 },
  { id: 'schools', label: 'Escolas', icon: Building2, count: 3 },
  { id: 'books', label: 'Livros', icon: BookOpen, count: 89 }
]

const popularTags: SearchTag[] = [
  { id: '1', label: 'Matrícula', color: 'blue' },
  { id: '2', label: 'Notas', color: 'green' },
  { id: '3', label: 'Frequência', color: 'yellow' },
  { id: '4', label: 'Relatórios', color: 'purple' },
  { id: '5', label: 'Financeiro', color: 'red' },
  { id: '6', label: 'Calendário', color: 'indigo' }
]

const recentSearches: RecentSearch[] = [
  { id: '1', query: 'João Silva', type: 'Aluno', timestamp: 'há 5 min' },
  { id: '2', query: 'Turma 3º A', type: 'Turma', timestamp: 'há 15 min' },
  { id: '3', query: 'Relatório mensal', type: 'Documento', timestamp: 'há 1 hora' }
]

interface SearchContentProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onClose?: () => void
}

export function SearchContent({ searchQuery = '', onSearchChange, onClose }: SearchContentProps) {
  const [query, setQuery] = useState(searchQuery)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    onSearchChange?.(value)
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId))
  }

  const selectedFilterData = filters.find(f => f.id === selectedFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 -mx-6 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Busca Inteligente</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Encontre rapidamente o que precisa</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onClose?.()
            }}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg',
              'text-gray-500 dark:text-gray-400',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'hover:text-gray-700 dark:hover:text-gray-200',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20'
            )}
            aria-label="Fechar busca"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Campo de Busca Principal */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar alunos, turmas, documentos..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-12 pr-36 h-12 text-base border-2 focus:border-blue-500 dark:focus:border-blue-600"
          autoFocus
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQueryChange('')}
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <AIButton
            variant="aiPrimary"
            size="sm"
            shimmer
            iconPulse
            className="h-9 px-4 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 icon-swing-on-hover" />
            Buscar com IA
          </AIButton>
        </div>
      </div>

      {/* Tags Selecionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Filtros ativos:</span>
          {selectedTags.map(tagId => {
            const tag = popularTags.find(t => t.id === tagId)
            if (!tag) return null
            
            const colorClasses: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
              blue: { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-300' },
              green: { bg: 'bg-green-100', text: 'text-green-700', darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-300' },
              yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', darkBg: 'dark:bg-yellow-900/30', darkText: 'dark:text-yellow-300' },
              purple: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-300' },
              red: { bg: 'bg-red-100', text: 'text-red-700', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-300' },
              indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', darkBg: 'dark:bg-indigo-900/30', darkText: 'dark:text-indigo-300' }
            }
            
            const colors = colorClasses[tag.color] || colorClasses.blue
            
            return (
              <Badge
                key={tagId}
                variant="secondary"
                className={cn(
                  'gap-1.5 px-2.5 py-1',
                  colors.bg,
                  colors.text,
                  colors.darkBg,
                  colors.darkText
                )}
              >
                {tag.label}
                <button
                  onClick={() => handleRemoveTag(tagId)}
                  className="ml-1 hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      {/* Filtros Rápidos */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtrar por tipo
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon
            const isSelected = selectedFilter === filter.id
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  'flex flex-col items-center gap-2',
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5',
                  isSelected 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                )} />
                <div className="text-center">
                  <div className={cn(
                    'text-xs font-semibold',
                    isSelected 
                      ? 'text-blue-900 dark:text-blue-100' 
                      : 'text-gray-700 dark:text-gray-300'
                  )}>
                    {filter.label}
                  </div>
                  {filter.count !== undefined && (
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                      {filter.count}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tags Populares */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Tags populares
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id)
            
            const colorClasses: Record<string, { 
              selected: string
              unselected: { bg: string; text: string; darkBg: string; darkText: string; hover: string; darkHover: string }
            }> = {
              blue: { 
                selected: 'bg-blue-500 text-white shadow-lg',
                unselected: { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-300', hover: 'hover:bg-blue-200', darkHover: 'dark:hover:bg-blue-800/50' }
              },
              green: { 
                selected: 'bg-green-500 text-white shadow-lg',
                unselected: { bg: 'bg-green-100', text: 'text-green-700', darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-300', hover: 'hover:bg-green-200', darkHover: 'dark:hover:bg-green-800/50' }
              },
              yellow: { 
                selected: 'bg-yellow-500 text-white shadow-lg',
                unselected: { bg: 'bg-yellow-100', text: 'text-yellow-700', darkBg: 'dark:bg-yellow-900/30', darkText: 'dark:text-yellow-300', hover: 'hover:bg-yellow-200', darkHover: 'dark:hover:bg-yellow-800/50' }
              },
              purple: { 
                selected: 'bg-purple-500 text-white shadow-lg',
                unselected: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-300', hover: 'hover:bg-purple-200', darkHover: 'dark:hover:bg-purple-800/50' }
              },
              red: { 
                selected: 'bg-red-500 text-white shadow-lg',
                unselected: { bg: 'bg-red-100', text: 'text-red-700', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-300', hover: 'hover:bg-red-200', darkHover: 'dark:hover:bg-red-800/50' }
              },
              indigo: { 
                selected: 'bg-indigo-500 text-white shadow-lg',
                unselected: { bg: 'bg-indigo-100', text: 'text-indigo-700', darkBg: 'dark:bg-indigo-900/30', darkText: 'dark:text-indigo-300', hover: 'hover:bg-indigo-200', darkHover: 'dark:hover:bg-indigo-800/50' }
              }
            }
            
            const colors = colorClasses[tag.color] || colorClasses.blue
            
            return (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  isSelected
                    ? colors.selected
                    : cn(colors.unselected.bg, colors.unselected.text, colors.unselected.darkBg, colors.unselected.darkText, colors.unselected.hover, colors.unselected.darkHover)
                )}
              >
                {tag.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Buscas Recentes */}
      {!query && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Buscas recentes
          </h3>
          <div className="space-y-2">
            {recentSearches.map((search) => (
              <button
                key={search.id}
                onClick={() => handleQueryChange(search.query)}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {search.query}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {search.type} • {search.timestamp}
                    </div>
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultados da Busca */}
      {query && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Resultados para "{query}"
            </h3>
            <Badge variant="secondary" className="text-xs">
              {selectedFilterData?.count || 0} encontrados
            </Badge>
          </div>
          <div className="space-y-2">
            {/* Resultados de exemplo - pode ser substituído por resultados reais */}
            {[1, 2, 3].map((item) => (
              <Card key={item} className="cursor-pointer hover:border-blue-500 dark:hover:border-blue-600 hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      {selectedFilterData && (
                        <selectedFilterData.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                        {query} - Resultado {item}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Tipo: {selectedFilterData?.label || 'Todos'} • Última atualização: há 2 dias
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                          Relevante
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                          {selectedFilterData?.label || 'Geral'}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sugestões quando não há query */}
      {!query && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Sugestões de busca
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {['Alunos com notas acima de 8', 'Turmas do 3º ano', 'Documentos pendentes', 'Eventos deste mês'].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQueryChange(suggestion)}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all text-left"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {suggestion}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
