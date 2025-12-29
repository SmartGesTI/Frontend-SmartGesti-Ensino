import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Search, 
  Plus, 
  Eye, 
  Edit,
  Trash2,
  Globe,
  Lock,
  MoreVertical,
  CheckCircle2,
  Lightbulb,
  Zap,
  Star
} from 'lucide-react'
import { agentTemplates, templateCategories } from './components/mockData'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function MeusAgentes() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [selectedAgent, setSelectedAgent] = useState<typeof myAgents[0] | null>(null)

  // Mock: Agentes do usuário (simulando que alguns templates são do usuário)
  const myAgents = useMemo(() => {
    // Simular que alguns templates são do usuário atual
    const userId = 'user-123' // Mock user ID
    
    return agentTemplates.slice(0, 6).map((template, index) => {
      const difficultyMap: Record<string, 'iniciante' | 'intermediario' | 'avancado'> = {
        'analisador-desempenho': 'intermediario',
        'gerador-boletins': 'iniciante',
        'analisador-frequencia': 'intermediario',
        'validador-matriculas': 'iniciante',
        'analisador-financeiro': 'avancado',
        'calculador-mensalidades': 'iniciante',
      }

      const flowMap: Record<string, string> = {
        'analisador-desempenho': 'Input (Dados Alunos) → AI (Análise) → Output (Relatório)',
        'gerador-boletins': 'Input (Notas) → Logic (Calcular Médias) → Logic (Validar) → Output (Boletim PDF)',
        'analisador-frequencia': 'Input (Presença) → AI (Analisar) → Logic (Identificar Risco) → Output (Alertas)',
        'validador-matriculas': 'Input (Formulário) → Logic (Validar) → Logic (Verificar) → Logic (Aprovar/Rejeitar)',
        'analisador-financeiro': 'Input (Dados Financeiros) → AI (Fluxo Caixa) → AI (Tendências) → Output (Relatório)',
        'calculador-mensalidades': 'Input (Alunos) → Logic (Calcular) → Logic (Descontos) → Output (Cobrança)',
      }

      const useCaseMap: Record<string, string> = {
        'analisador-desempenho': 'Identificar alunos com dificuldades e padrões de aprendizado',
        'gerador-boletins': 'Automatizar a geração de boletins escolares',
        'analisador-frequencia': 'Detectar alunos com frequência baixa',
        'validador-matriculas': 'Validar automaticamente documentos de matrícula',
        'analisador-financeiro': 'Analisar receitas, despesas e tendências',
        'calculador-mensalidades': 'Calcular valores de mensalidade automaticamente',
      }

      const tagsMap: Record<string, string[]> = {
        'analisador-desempenho': ['alunos', 'desempenho', 'análise'],
        'gerador-boletins': ['boletins', 'notas', 'pdf'],
        'analisador-frequencia': ['frequência', 'presença', 'alertas'],
        'validador-matriculas': ['matrícula', 'validação'],
        'analisador-financeiro': ['financeiro', 'análise'],
        'calculador-mensalidades': ['mensalidade', 'cobrança'],
      }

      return {
        ...template,
        userId,
        rating: 4.2 + Math.random() * 0.6,
        difficulty: difficultyMap[template.id] || 'intermediario',
        useCase: useCaseMap[template.id] || template.description,
        flow: flowMap[template.id] || 'Input → Process → Output',
        tags: tagsMap[template.id] || [],
        isPublic: index % 2 === 0, // Alternar entre público e privado
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 dias
        usageCount: Math.floor(Math.random() * 500) + 10,
      }
    })
  }, [])

  // Filtrar agentes
  const filteredAgents = useMemo(() => {
    return myAgents.filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'todos' || agent.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [myAgents, searchTerm, selectedCategory])

  const handleTogglePublic = (agentId: string, isPublic: boolean) => {
    // Aqui você faria a chamada à API para atualizar o status
    console.log(`Toggling agent ${agentId} to ${isPublic ? 'public' : 'private'}`)
  }

  const handleEdit = (agentId: string) => {
    navigate(`/escola/${slug}/ia/criar?edit=${agentId}`)
  }

  const handleDelete = (agentId: string) => {
    // Aqui você faria a chamada à API para deletar
    console.log(`Deleting agent ${agentId}`)
  }

  const handlePreview = (agentId: string) => {
    navigate(`/escola/${slug}/ia/agente/${agentId}`)
  }

  const handleCardClick = (agent: typeof myAgents[0]) => {
    setSelectedAgent(agent)
  }

  // Gerar informações expandidas para o modal
  const getExpandedInfo = (agent: typeof myAgents[0]) => {
    const bestUsesMap: Record<string, string[]> = {
      'analisador-desempenho': [
        'Identificar alunos com dificuldades de aprendizado',
        'Detectar padrões de desempenho por turma ou matéria',
        'Gerar relatórios para reuniões de pais',
        'Auxiliar na tomada de decisões pedagógicas'
      ],
      'gerador-boletins': [
        'Automatizar a geração de boletins escolares',
        'Calcular médias automaticamente',
        'Validar aprovação/reprovação',
        'Economizar tempo administrativo'
      ],
      'analisador-frequencia': [
        'Detectar alunos com frequência baixa',
        'Gerar alertas automáticos para responsáveis',
        'Identificar padrões de absenteísmo',
        'Auxiliar no controle de frequência'
      ],
      'validador-matriculas': [
        'Validar documentos de matrícula automaticamente',
        'Verificar requisitos de admissão',
        'Acelerar processo de matrícula',
        'Reduzir erros manuais'
      ],
      'analisador-financeiro': [
        'Analisar receitas e despesas da escola',
        'Identificar tendências financeiras',
        'Gerar relatórios para gestão',
        'Auxiliar no planejamento orçamentário'
      ],
      'calculador-mensalidades': [
        'Calcular valores de mensalidade automaticamente',
        'Aplicar descontos e bolsas',
        'Gerar cobranças automaticamente',
        'Simplificar gestão financeira'
      ],
      'validador-pagamentos': [
        'Validar comprovantes de pagamento',
        'Atualizar status automaticamente',
        'Enviar confirmações por email',
        'Reduzir trabalho manual'
      ],
      'analisador-contratos': [
        'Analisar contratos trabalhistas',
        'Validar conformidade com CLT',
        'Gerar relatórios jurídicos',
        'Auxiliar no RH'
      ],
      'processador-folha': [
        'Processar folha de pagamento',
        'Calcular salários e benefícios',
        'Aplicar descontos automaticamente',
        'Gerar folha completa'
      ],
      'avaliador-professores': [
        'Avaliar desempenho de professores',
        'Identificar áreas de melhoria',
        'Sugerir treinamentos',
        'Auxiliar no desenvolvimento profissional'
      ],
      'processador-documentos': [
        'Extrair informações de documentos',
        'Validar dados automaticamente',
        'Armazenar de forma estruturada',
        'Facilitar busca e organização'
      ],
      'gerador-relatorios-personalizados': [
        'Gerar relatórios personalizados',
        'Analisar qualquer conjunto de dados',
        'Criar insights com IA',
        'Automatizar relatórios complexos'
      ],
    }

    const howItHelpsMap: Record<string, string> = {
      'analisador-desempenho': 'Este agente analisa dados acadêmicos usando inteligência artificial para identificar padrões de aprendizado, alunos em risco e áreas que precisam de atenção. Ele gera relatórios detalhados que ajudam professores e coordenadores a tomar decisões pedagógicas mais informadas.',
      'gerador-boletins': 'Automatiza completamente o processo de geração de boletins, calculando médias, validando aprovações e gerando documentos em PDF. Economiza horas de trabalho manual e reduz erros de cálculo.',
      'analisador-frequencia': 'Monitora a frequência dos alunos em tempo real, identifica padrões de absenteísmo e gera alertas automáticos para responsáveis quando a frequência está abaixo do esperado.',
      'validador-matriculas': 'Valida automaticamente documentos e requisitos de matrícula, acelerando o processo e garantindo que todos os documentos necessários estejam presentes e corretos.',
      'analisador-financeiro': 'Fornece análises profundas das finanças da escola, identificando tendências, padrões de gastos e oportunidades de economia. Gera insights valiosos para gestão financeira.',
      'calculador-mensalidades': 'Simplifica o cálculo de mensalidades aplicando automaticamente descontos, bolsas e ajustes, garantindo precisão e consistência nos valores cobrados.',
      'validador-pagamentos': 'Valida comprovantes de pagamento usando IA para extrair informações, atualiza status automaticamente e envia confirmações, reduzindo trabalho manual significativamente.',
      'analisador-contratos': 'Analisa contratos trabalhistas com IA, valida conformidade com CLT e gera relatórios jurídicos detalhados, auxiliando o departamento de RH.',
      'processador-folha': 'Processa folha de pagamento calculando salários, benefícios e descontos automaticamente, garantindo precisão e economia de tempo.',
      'avaliador-professores': 'Avalia o desempenho de professores usando IA, identifica pontos fortes e áreas de melhoria, e sugere ações de desenvolvimento profissional personalizadas.',
      'processador-documentos': 'Extrai informações de documentos PDF e Word usando IA, valida dados e armazena de forma estruturada, facilitando busca e organização.',
      'gerador-relatorios-personalizados': 'Permite criar relatórios completamente personalizados sobre qualquer conjunto de dados, usando IA para gerar insights e análises profundas automaticamente.',
    }

    const bestUses = bestUsesMap[agent.id] || [
      'Automatizar processos manuais',
      'Economizar tempo administrativo',
      'Reduzir erros humanos',
      'Gerar insights com IA'
    ]

    return {
      bestUses,
      howItHelps: howItHelpsMap[agent.id] || agent.description,
    }
  }

  const difficultyColors: Record<string, string> = {
    iniciante: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    intermediario: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    avancado: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => {
          const Icon = agent.icon
          const categoryInfo = templateCategories.find((cat) => cat.id === agent.category)
          const categoryColor = categoryInfo?.color || 'purple'
          const colorClasses: Record<string, string> = {
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
            amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
          }

          return (
            <Card 
              key={agent.id} 
              className="hover:shadow-lg transition-all relative cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500"
              onClick={() => handleCardClick(agent)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colorClasses[categoryColor])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-lg flex-1">{agent.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(agent.id)
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handlePreview(agent.id)
                      }}>
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(agent.id)
                        }}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {agent.categoryTags?.map((tag) => (
                    <span
                      key={tag}
                      className={cn('px-2 py-1 rounded-md text-xs font-medium', colorClasses[categoryColor])}
                    >
                      {tag}
                    </span>
                  ))}
                  <span className={cn('px-2 py-1 rounded-md text-xs font-medium border', difficultyColors[agent.difficulty || 'intermediario'])}>
                    {agent.difficulty === 'iniciante' ? 'Iniciante' : agent.difficulty === 'intermediario' ? 'Intermediário' : 'Avançado'}
                  </span>
                </div>
                <CardDescription className="text-sm">{agent.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Caso de Uso:</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{agent.useCase}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Fluxo:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2">
                    <code className="text-xs text-gray-700 dark:text-gray-300">{agent.flow}</code>
                  </div>
                </div>
                
                {/* Toggle Público/Privado */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    {agent.isPublic ? (
                      <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {agent.isPublic ? 'Público' : 'Privado'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {agent.isPublic ? 'Visível na galeria' : 'Apenas você pode ver'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={agent.isPublic}
                    onCheckedChange={(checked) => handleTogglePublic(agent.id, checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="aiPrimaryOutlineHover"
                    size="sm"
                    onClick={() => handlePreview(agent.id)}
                    className="flex-1 gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button
                    variant="aiEdit"
                    size="sm"
                    onClick={() => handleEdit(agent.id)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAgents.length === 0 && (
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
      )}

      {/* Modal de Detalhes do Agente */}
      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        {selectedAgent && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const Icon = selectedAgent.icon
                  const categoryInfo = templateCategories.find((cat) => cat.id === selectedAgent.category)
                  const categoryColor = categoryInfo?.color || 'purple'
                  const colorClasses: Record<string, string> = {
                    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
                    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                  }
                  return (
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colorClasses[categoryColor])}>
                      <Icon className="w-6 h-6" />
                    </div>
                  )
                })()}
                <div className="flex-1">
                  <DialogTitle className="text-2xl">{selectedAgent.name}</DialogTitle>
                  <DialogDescription className="text-base mt-1">
                    {selectedAgent.description}
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold">{selectedAgent.rating?.toFixed(1)}</span>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Informações Principais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Categoria</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {templateCategories.find((cat) => cat.id === selectedAgent.category)?.name || 'Geral'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dificuldade</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {selectedAgent.difficulty === 'iniciante' ? 'Iniciante' : selectedAgent.difficulty === 'intermediario' ? 'Intermediário' : 'Avançado'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {selectedAgent.isPublic ? 'Público' : 'Privado'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Componentes</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {selectedAgent.nodes.length} nós
                  </p>
                </div>
              </div>

              {/* Como Pode Ajudar */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Como Pode Ajudar</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {getExpandedInfo(selectedAgent).howItHelps}
                </p>
              </div>

              {/* Melhores Usos */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Melhores Usos</h3>
                </div>
                <ul className="space-y-2">
                  {getExpandedInfo(selectedAgent).bestUses.map((use, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fluxo de Trabalho */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Fluxo de Trabalho</h3>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <code className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                    {selectedAgent.flow}
                  </code>
                </div>
              </div>

              {/* Caso de Uso Detalhado */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Caso de Uso</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedAgent.useCase}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="aiPrimaryOutlineHover"
                  onClick={() => {
                    setSelectedAgent(null)
                    handlePreview(selectedAgent.id)
                  }}
                  className="flex-1 gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </Button>
                <Button
                  variant="aiEdit"
                  onClick={() => {
                    setSelectedAgent(null)
                    handleEdit(selectedAgent.id)
                  }}
                  className="flex-1 gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar Agente
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
