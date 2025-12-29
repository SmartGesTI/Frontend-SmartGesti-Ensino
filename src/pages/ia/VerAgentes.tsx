import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIButton } from '@/components/ui/ai-button'
import { Input } from '@/components/ui/input'
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
  Star, 
  Eye, 
  Brain,
  FolderOpen,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lightbulb,
  Zap,
  Sparkles
} from 'lucide-react'
import { agentTemplates, templateCategories } from './components/mockData'
import { cn } from '@/lib/utils'

export default function VerAgentes() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todos')
  const [sortBy, setSortBy] = useState<string>('nome')
  const [selectedTemplate, setSelectedTemplate] = useState<typeof enrichedTemplates[0] | null>(null)

  // Enriquecer templates com dados adicionais
  const enrichedTemplates = useMemo(() => {
    return agentTemplates.map((template) => {
      const categoryInfo = templateCategories.find((cat) => cat.id === template.category)
      const difficultyMap: Record<string, 'iniciante' | 'intermediario' | 'avancado'> = {
        'analisador-desempenho': 'intermediario',
        'gerador-boletins': 'iniciante',
        'analisador-frequencia': 'intermediario',
        'validador-matriculas': 'iniciante',
        'analisador-financeiro': 'avancado',
        'calculador-mensalidades': 'iniciante',
        'validador-pagamentos': 'intermediario',
        'analisador-contratos': 'avancado',
        'processador-folha': 'intermediario',
        'avaliador-professores': 'avancado',
        'processador-documentos': 'intermediario',
        'gerador-relatorios-personalizados': 'avancado',
      }

      const flowMap: Record<string, string> = {
        'analisador-desempenho': 'Input (Dados Alunos) → AI (Análise) → Output (Relatório)',
        'gerador-boletins': 'Input (Notas) → Logic (Calcular Médias) → Logic (Validar) → Output (Boletim PDF)',
        'analisador-frequencia': 'Input (Presença) → AI (Analisar) → Logic (Identificar Risco) → Output (Alertas)',
        'validador-matriculas': 'Input (Formulário) → Logic (Validar) → Logic (Verificar) → Logic (Aprovar/Rejeitar)',
        'analisador-financeiro': 'Input (Dados Financeiros) → AI (Fluxo Caixa) → AI (Tendências) → Output (Relatório)',
        'calculador-mensalidades': 'Input (Alunos) → Logic (Calcular) → Logic (Descontos) → Output (Cobrança)',
        'validador-pagamentos': 'Input (Comprovante) → AI (Extrair) → Logic (Processar) → Output (Confirmação)',
        'analisador-contratos': 'Input (PDF) → AI (Análise) → Logic (Validar CLT) → Output (Relatório)',
        'processador-folha': 'Input (Funcionários) → Logic (Benefícios) → Logic (Processar) → Output (Folha)',
        'avaliador-professores': 'Input (Avaliações) → AI (Analisar) → AI (Sugerir) → Output (Relatório)',
        'processador-documentos': 'Input (Documentos) → AI (Extrair) → Logic (Validar) → Output (Salvar)',
        'gerador-relatorios-personalizados': 'Input (Parâmetros) → Input (Buscar Dados) → AI (Processar) → Output (Relatório)',
      }

      const useCaseMap: Record<string, string> = {
        'analisador-desempenho': 'Identificar alunos com dificuldades e padrões de aprendizado para intervenção pedagógica',
        'gerador-boletins': 'Automatizar a geração de boletins escolares com notas e frequência calculadas automaticamente',
        'analisador-frequencia': 'Detectar alunos com frequência baixa e gerar alertas para responsáveis',
        'validador-matriculas': 'Validar automaticamente documentos e requisitos de matrícula, acelerando o processo',
        'analisador-financeiro': 'Analisar receitas, despesas e identificar tendências financeiras da escola',
        'calculador-mensalidades': 'Calcular valores de mensalidade aplicando descontos e bolsas automaticamente',
        'validador-pagamentos': 'Validar comprovantes de pagamento e atualizar status automaticamente',
        'analisador-contratos': 'Analisar contratos trabalhistas e validar conformidade com CLT',
        'processador-folha': 'Processar folha de pagamento calculando salários, benefícios e descontos',
        'avaliador-professores': 'Avaliar desempenho de professores e sugerir melhorias baseadas em dados',
        'processador-documentos': 'Extrair informações de documentos e armazenar de forma estruturada',
        'gerador-relatorios-personalizados': 'Gerar relatórios personalizados com análise de IA sobre qualquer conjunto de dados',
      }

      const tagsMap: Record<string, string[]> = {
        'analisador-desempenho': ['alunos', 'desempenho', 'análise', 'gpt-4', 'relatórios'],
        'gerador-boletins': ['boletins', 'notas', 'frequência', 'pdf', 'automação'],
        'analisador-frequencia': ['frequência', 'presença', 'alertas', 'risco', 'alunos'],
        'validador-matriculas': ['matrícula', 'validação', 'documentos', 'automação'],
        'analisador-financeiro': ['financeiro', 'receitas', 'despesas', 'análise', 'tendências'],
        'calculador-mensalidades': ['mensalidade', 'cobrança', 'descontos', 'cálculo'],
        'validador-pagamentos': ['pagamento', 'comprovante', 'validação', 'pix', 'boleto'],
        'analisador-contratos': ['contratos', 'rh', 'jurídico', 'gpt-4', 'clt', 'pdf'],
        'processador-folha': ['folha', 'pagamento', 'rh', 'salários', 'benefícios'],
        'avaliador-professores': ['professores', 'avaliação', 'desempenho', 'rh', 'melhorias'],
        'processador-documentos': ['documentos', 'extração', 'pdf', 'word', 'automação'],
        'gerador-relatorios-personalizados': ['relatórios', 'personalizado', 'ia', 'análise', 'dados'],
      }

      return {
        ...template,
        rating: 4.2 + Math.random() * 0.6, // Entre 4.2 e 4.8
        difficulty: difficultyMap[template.id] || 'intermediario',
        useCase: useCaseMap[template.id] || template.description,
        flow: flowMap[template.id] || 'Input → Process → Output',
        tags: tagsMap[template.id] || [],
        estimatedTime: template.nodes.length <= 3 ? '2-3 min' : template.nodes.length <= 4 ? '3-5 min' : '5-10 min',
        categoryTags: categoryInfo ? [categoryInfo.name] : [],
        isPublic: true,
        usageCount: Math.floor(Math.random() * 1000) + 50,
      }
    })
  }, [])

  // Filtrar e ordenar templates
  const filteredTemplates = useMemo(() => {
    let filtered = enrichedTemplates.filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'uso':
          return (b.usageCount || 0) - (a.usageCount || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [enrichedTemplates, searchTerm, selectedCategory, selectedDifficulty, sortBy])

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalTemplates = enrichedTemplates.length
    const categories = new Set(enrichedTemplates.map((t) => t.category)).size
    const mostUsed = enrichedTemplates.reduce((prev, current) =>
      (current.usageCount || 0) > (prev.usageCount || 0) ? current : prev
    )
    const avgRating = enrichedTemplates.reduce((sum, t) => sum + (t.rating || 0), 0) / totalTemplates

    return {
      totalTemplates,
      categories,
      mostUsed: mostUsed.name,
      avgRating: Math.round(avgRating * 10) / 10,
    }
  }, [enrichedTemplates])

  const difficultyColors: Record<string, string> = {
    iniciante: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    intermediario: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    avancado: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  }

  const handlePreview = (template: typeof enrichedTemplates[0]) => {
    // Navegar para visualização do template
    navigate(`/escola/${slug}/ia/agente/${template.id}`)
  }

  const handleUse = (template: typeof enrichedTemplates[0]) => {
    // Navegar para criar agente baseado no template
    navigate(`/escola/${slug}/ia/criar?template=${template.id}`)
  }

  const handleCardClick = (template: typeof enrichedTemplates[0]) => {
    setSelectedTemplate(template)
  }

  // Gerar informações expandidas para o modal
  const getExpandedInfo = (template: typeof enrichedTemplates[0]) => {
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

    const bestUses = bestUsesMap[template.id] || [
      'Automatizar processos manuais',
      'Economizar tempo administrativo',
      'Reduzir erros humanos',
      'Gerar insights com IA'
    ]

    return {
      bestUses,
      howItHelps: howItHelpsMap[template.id] || template.description,
    }
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
            <SelectItem value="todos">Todos</SelectItem>
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
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="iniciante">Iniciante</SelectItem>
            <SelectItem value="intermediario">Intermediário</SelectItem>
            <SelectItem value="avancado">Avançado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nome">Nome</SelectItem>
            <SelectItem value="rating">Avaliação</SelectItem>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Templates</p>
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avaliação Média</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.avgRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon
          const categoryInfo = templateCategories.find((cat) => cat.id === template.category)
          const categoryColor = categoryInfo?.color || 'purple'
          const colorClasses: Record<string, string> = {
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
            amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
          }

          return (
            <Card 
              key={template.id} 
              className="hover:shadow-lg transition-all cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500"
              onClick={() => handleCardClick(template)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colorClasses[categoryColor])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-lg flex-1">{template.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{template.rating?.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {template.categoryTags?.map((tag) => (
                    <span
                      key={tag}
                      className={cn('px-2 py-1 rounded-md text-xs font-medium', colorClasses[categoryColor])}
                    >
                      {tag}
                    </span>
                  ))}
                  <span className={cn('px-2 py-1 rounded-md text-xs font-medium border', difficultyColors[template.difficulty || 'intermediario'])}>
                    {template.difficulty === 'iniciante' ? 'Iniciante' : template.difficulty === 'intermediario' ? 'Intermediário' : 'Avançado'}
                  </span>
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {template.estimatedTime}
                  </span>
                </div>
                <CardDescription className="text-sm">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Caso de Uso:</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{template.useCase}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Fluxo:</p>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-2">
                    <code className="text-xs text-gray-700 dark:text-gray-300">{template.flow}</code>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="aiPrimaryOutlineHover"
                    size="sm"
                    onClick={() => handlePreview(template)}
                    className="flex-1 gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <AIButton
                    variant="aiPrimary"
                    size="sm"
                    onClick={() => handleUse(template)}
                    shimmer
                    iconPulse
                    className="flex-1 gap-2"
                  >
                    <Sparkles className="w-4 h-4 icon-swing-on-hover" />
                    Usar este Agente
                  </AIButton>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modal de Detalhes do Agente */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        {selectedTemplate && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const Icon = selectedTemplate.icon
                  const categoryInfo = templateCategories.find((cat) => cat.id === selectedTemplate.category)
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
                  <DialogTitle className="text-2xl">{selectedTemplate.name}</DialogTitle>
                  <DialogDescription className="text-base mt-1">
                    {selectedTemplate.description}
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-lg font-semibold">{selectedTemplate.rating?.toFixed(1)}</span>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Informações Principais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Categoria</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {templateCategories.find((cat) => cat.id === selectedTemplate.category)?.name || 'Geral'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dificuldade</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {selectedTemplate.difficulty === 'iniciante' ? 'Iniciante' : selectedTemplate.difficulty === 'intermediario' ? 'Intermediário' : 'Avançado'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tempo Estimado</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {selectedTemplate.estimatedTime}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Componentes</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {selectedTemplate.nodes.length} nós
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
                  {getExpandedInfo(selectedTemplate).howItHelps}
                </p>
              </div>

              {/* Melhores Usos */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Melhores Usos</h3>
                </div>
                <ul className="space-y-2">
                  {getExpandedInfo(selectedTemplate).bestUses.map((use, index) => (
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
                    {selectedTemplate.flow}
                  </code>
                </div>
              </div>

              {/* Caso de Uso Detalhado */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Caso de Uso</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedTemplate.useCase}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="aiPrimaryOutlineHover"
                  onClick={() => {
                    setSelectedTemplate(null)
                    handlePreview(selectedTemplate)
                  }}
                  className="flex-1 gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </Button>
                <AIButton
                  variant="aiPrimary"
                  onClick={() => {
                    setSelectedTemplate(null)
                    handleUse(selectedTemplate)
                  }}
                  shimmer
                  iconPulse
                  className="flex-1 gap-2"
                >
                  <Sparkles className="w-4 h-4 group-hover:animate-icon-swing" />
                  Usar este Agente
                </AIButton>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
