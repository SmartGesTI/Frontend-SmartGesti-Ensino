import { 
  MessageCircle, 
  FileText, 
  Brain, 
  CheckCircle, 
  Send, 
  FileSpreadsheet, 
  BarChart3, 
  Users, 
  Calendar, 
  BookOpen,
  GraduationCap,
  DollarSign,
  UserCog,
  Building2,
  Calculator,
  TrendingUp,
  FileCheck,
  Mail,
  Database,
  FormInput,
  Globe,
  Filter,
  GitBranch,
  Save,
  Bell,
  FileDown,
  Zap,
  ClipboardCheck,
  Award,
  AlertTriangle,
  CreditCard,
  Receipt,
  Wallet,
  Briefcase,
  UserCheck,
  TrendingDown,
  Percent,
  Star,
  Eye,
  Download,
  Clock
} from 'lucide-react'

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  isLoading?: boolean
}

export interface RelatorioTipo {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  fields: RelatorioField[]
}

export interface RelatorioField {
  name: string
  label: string
  type: 'select' | 'date' | 'text' | 'number' | 'checkbox'
  options?: string[]
  required: boolean
  defaultValue?: any
}

export interface WorkflowNode {
  id: string
  type: 'input' | 'ai' | 'validation' | 'output'
  category: string
  data: {
    label: string
    icon: React.ElementType
    color: string
    description: string
    config: Record<string, any>
  }
  position: { x: number; y: number }
}

export interface AgentTemplate {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: string
  nodes: WorkflowNode[]
  edges: Array<{ id: string; source: string; target: string }>
  // Informações adicionais para galeria
  rating?: number
  difficulty?: 'iniciante' | 'intermediario' | 'avancado'
  useCase?: string
  flow?: string
  tags?: string[]
  estimatedTime?: string
  categoryTags?: string[]
  isPublic?: boolean
  userId?: string
  usageCount?: number
}

export interface TemplateCategory {
  id: string
  name: string
  icon: React.ElementType
  color: string
  templates: AgentTemplate[]
}

// Dados Mock para Chat
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Olá! Como posso ajudar você hoje?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    text: 'Gostaria de saber como gerar um relatório acadêmico',
    sender: 'user',
    timestamp: new Date(Date.now() - 3300000),
  },
  {
    id: '3',
    text: 'Claro! Para gerar um relatório acadêmico, você pode usar a página "Relatório Inteligente". Lá você encontrará várias opções de relatórios pré-configurados, incluindo relatórios acadêmicos com métricas de desempenho dos alunos.',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 3000000),
  },
]

export const quickSuggestions = [
  'Como gerar relatórios?',
  'Criar um agente personalizado',
  'Analisar dados acadêmicos',
  'Configurar automações',
]

// Dados Mock para Relatórios
export const relatorioTipos: RelatorioTipo[] = [
  {
    id: 'academico',
    name: 'Relatório Acadêmico',
    description: 'Análise de desempenho dos alunos, notas e frequência',
    icon: BookOpen,
    color: 'purple',
    fields: [
      {
        name: 'periodo',
        label: 'Período',
        type: 'select',
        options: ['2024.1', '2024.2', '2023.1', '2023.2'],
        required: true,
        defaultValue: '2024.1',
      },
      {
        name: 'turma',
        label: 'Turma',
        type: 'select',
        options: ['Todas', '1º Ano A', '1º Ano B', '2º Ano A'],
        required: false,
        defaultValue: 'Todas',
      },
      {
        name: 'incluirGraficos',
        label: 'Incluir Gráficos',
        type: 'checkbox',
        required: false,
        defaultValue: true,
      },
    ],
  },
  {
    id: 'financeiro',
    name: 'Relatório Financeiro',
    description: 'Receitas, despesas e balanço financeiro da escola',
    icon: BarChart3,
    color: 'emerald',
    fields: [
      {
        name: 'dataInicio',
        label: 'Data Início',
        type: 'date',
        required: true,
      },
      {
        name: 'dataFim',
        label: 'Data Fim',
        type: 'date',
        required: true,
      },
      {
        name: 'categoria',
        label: 'Categoria',
        type: 'select',
        options: ['Todas', 'Mensalidades', 'Material', 'Eventos'],
        required: false,
        defaultValue: 'Todas',
      },
    ],
  },
  {
    id: 'matriculas',
    name: 'Relatório de Matrículas',
    description: 'Estatísticas e análise de matrículas e rematrículas',
    icon: Users,
    color: 'blue',
    fields: [
      {
        name: 'ano',
        label: 'Ano',
        type: 'select',
        options: ['2024', '2023', '2022'],
        required: true,
        defaultValue: '2024',
      },
      {
        name: 'tipo',
        label: 'Tipo',
        type: 'select',
        options: ['Novas Matrículas', 'Rematrículas', 'Ambos'],
        required: true,
        defaultValue: 'Ambos',
      },
    ],
  },
  {
    id: 'frequencia',
    name: 'Relatório de Frequência',
    description: 'Análise de frequência e presença dos alunos',
    icon: Calendar,
    color: 'amber',
    fields: [
      {
        name: 'mes',
        label: 'Mês',
        type: 'select',
        options: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
        required: true,
      },
      {
        name: 'turma',
        label: 'Turma',
        type: 'select',
        options: ['Todas', '1º Ano A', '1º Ano B'],
        required: false,
        defaultValue: 'Todas',
      },
    ],
  },
]

// Dados Mock para Nós do Builder
export const availableNodes = [
  // RECEBER DADOS - Genéricos
  {
    id: 'receive-document',
    type: 'input',
    category: 'RECEBER DADOS',
    data: {
      label: 'Receber Documento',
      icon: FileText,
      color: 'blue',
      description: 'Recebe arquivos PDF, Word ou Excel para análise',
      config: {
        acceptedFormats: ['pdf', 'docx', 'xlsx'],
        maxSize: '10MB',
      },
    },
  },
  {
    id: 'receive-text',
    type: 'input',
    category: 'RECEBER DADOS',
    data: {
      label: 'Receber Texto',
      icon: MessageCircle,
      color: 'blue',
      description: 'Recebe texto digitado pelo usuário',
      config: {
        maxLength: 5000,
      },
    },
  },
  {
    id: 'receive-form',
    type: 'input',
    category: 'RECEBER DADOS',
    data: {
      label: 'Receber Formulário',
      icon: FormInput,
      color: 'blue',
      description: 'Recebe dados de formulário web',
      config: {
        fields: [],
      },
    },
  },
  {
    id: 'receive-api',
    type: 'input',
    category: 'RECEBER DADOS',
    data: {
      label: 'Receber API',
      icon: Globe,
      color: 'blue',
      description: 'Recebe dados de API externa',
      config: {
        endpoint: '',
        method: 'GET',
      },
    },
  },
  {
    id: 'receive-database',
    type: 'input',
    category: 'RECEBER DADOS',
    data: {
      label: 'Receber Banco de Dados',
      icon: Database,
      color: 'blue',
      description: 'Executa query SQL e retorna dados',
      config: {
        query: '',
      },
    },
  },
  // ANALISAR COM IA - Genéricos
  {
    id: 'analyze-text',
    type: 'ai',
    category: 'ANALISAR COM IA',
    data: {
      label: 'Analisar Texto',
      icon: Brain,
      color: 'purple',
      description: 'Analisa texto usando IA e extrai informações',
      config: {
        model: 'gpt-4o-mini',
        instructions: '',
      },
    },
  },
  {
    id: 'analyze-document',
    type: 'ai',
    category: 'ANALISAR COM IA',
    data: {
      label: 'Analisar Documento',
      icon: FileText,
      color: 'purple',
      description: 'Analisa documentos PDF, Word e extrai informações',
      config: {
        model: 'gpt-4o-mini',
        instructions: '',
      },
    },
  },
  {
    id: 'generate-summary',
    type: 'ai',
    category: 'ANALISAR COM IA',
    data: {
      label: 'Gerar Resumo',
      icon: FileText,
      color: 'purple',
      description: 'Gera resumo automático de textos longos',
      config: {
        model: 'gpt-4o-mini',
        maxLength: 500,
      },
    },
  },
  {
    id: 'extract-information',
    type: 'ai',
    category: 'ANALISAR COM IA',
    data: {
      label: 'Extrair Informações',
      icon: Zap,
      color: 'purple',
      description: 'Extrai informações estruturadas de dados não estruturados',
      config: {
        model: 'gpt-4o-mini',
        schema: {},
      },
    },
  },
  {
    id: 'classify-data',
    type: 'ai',
    category: 'ANALISAR COM IA',
    data: {
      label: 'Classificar Dados',
      icon: Filter,
      color: 'purple',
      description: 'Classifica e categoriza dados automaticamente',
      config: {
        model: 'gpt-4o-mini',
        categories: [],
      },
    },
  },
  // VALIDAR E VERIFICAR - Genéricos
  {
    id: 'validate-data',
    type: 'validation',
    category: 'VALIDAR E VERIFICAR',
    data: {
      label: 'Validar Dados',
      icon: CheckCircle,
      color: 'amber',
      description: 'Valida dados conforme regras configuradas',
      config: {
        rules: [],
      },
    },
  },
  {
    id: 'decide-path',
    type: 'validation',
    category: 'VALIDAR E VERIFICAR',
    data: {
      label: 'Decidir Caminho',
      icon: GitBranch,
      color: 'amber',
      description: 'Escolhe próximo passo baseado em condições',
      config: {
        conditions: [],
      },
    },
  },
  {
    id: 'filter-data',
    type: 'validation',
    category: 'VALIDAR E VERIFICAR',
    data: {
      label: 'Filtrar Dados',
      icon: Filter,
      color: 'amber',
      description: 'Filtra dados conforme critérios definidos',
      config: {
        filters: [],
      },
    },
  },
  {
    id: 'transform-data',
    type: 'validation',
    category: 'VALIDAR E VERIFICAR',
    data: {
      label: 'Transformar Dados',
      icon: Zap,
      color: 'amber',
      description: 'Transforma dados conforme regras de mapeamento',
      config: {
        transformations: [],
      },
    },
  },
  {
    id: 'validate-format',
    type: 'validation',
    category: 'VALIDAR E VERIFICAR',
    data: {
      label: 'Validar Formato',
      icon: FileCheck,
      color: 'amber',
      description: 'Valida formato de dados (email, CPF, etc.)',
      config: {
        format: 'email',
      },
    },
  },
  // ENVIAR E GERAR - Genéricos
  {
    id: 'generate-report',
    type: 'output',
    category: 'ENVIAR E GERAR',
    data: {
      label: 'Gerar Relatório',
      icon: FileSpreadsheet,
      color: 'emerald',
      description: 'Gera relatório em formato JSON ou PDF',
      config: {
        format: 'json',
      },
    },
  },
  {
    id: 'send-email',
    type: 'output',
    category: 'ENVIAR E GERAR',
    data: {
      label: 'Enviar Email',
      icon: Send,
      color: 'emerald',
      description: 'Envia email com os resultados',
      config: {
        recipient: '',
        subject: '',
      },
    },
  },
  {
    id: 'save-data',
    type: 'output',
    category: 'ENVIAR E GERAR',
    data: {
      label: 'Salvar Dados',
      icon: Save,
      color: 'emerald',
      description: 'Salva dados no banco de dados',
      config: {
        table: '',
      },
    },
  },
  {
    id: 'send-notification',
    type: 'output',
    category: 'ENVIAR E GERAR',
    data: {
      label: 'Enviar Notificação',
      icon: Bell,
      color: 'emerald',
      description: 'Envia notificação push ou email',
      config: {
        type: 'email',
      },
    },
  },
  {
    id: 'generate-pdf',
    type: 'output',
    category: 'ENVIAR E GERAR',
    data: {
      label: 'Gerar PDF',
      icon: FileDown,
      color: 'emerald',
      description: 'Gera arquivo PDF a partir dos dados',
      config: {
        template: '',
      },
    },
  },
  {
    id: 'integrate-api',
    type: 'output',
    category: 'ENVIAR E GERAR',
    data: {
      label: 'Integrar API',
      icon: Globe,
      color: 'emerald',
      description: 'Faz chamada para API externa',
      config: {
        endpoint: '',
        method: 'POST',
      },
    },
  },
  // COMPONENTES ESPECÍFICOS - ACADÊMICO
  {
    id: 'calculate-student-average',
    type: 'validation',
    category: 'ACADÊMICO',
    data: {
      label: 'Calcular Média de Alunos',
      icon: Calculator,
      color: 'purple',
      description: 'Calcula média de notas dos alunos',
      config: {
        weights: {},
      },
    },
  },
  {
    id: 'validate-enrollment',
    type: 'validation',
    category: 'ACADÊMICO',
    data: {
      label: 'Validar Matrícula',
      icon: ClipboardCheck,
      color: 'purple',
      description: 'Valida dados de matrícula e documentos',
      config: {
        requiredDocs: [],
      },
    },
  },
  {
    id: 'process-grades',
    type: 'validation',
    category: 'ACADÊMICO',
    data: {
      label: 'Processar Notas',
      icon: BookOpen,
      color: 'purple',
      description: 'Processa e valida notas dos alunos',
      config: {
        minGrade: 0,
        maxGrade: 10,
      },
    },
  },
  {
    id: 'analyze-attendance',
    type: 'ai',
    category: 'ACADÊMICO',
    data: {
      label: 'Analisar Frequência',
      icon: Calendar,
      color: 'purple',
      description: 'Analisa padrões de frequência dos alunos',
      config: {
        model: 'gpt-4o-mini',
        minAttendance: 75,
      },
    },
  },
  // COMPONENTES ESPECÍFICOS - FINANCEIRO
  {
    id: 'calculate-tuition',
    type: 'validation',
    category: 'FINANCEIRO',
    data: {
      label: 'Calcular Mensalidade',
      icon: Calculator,
      color: 'emerald',
      description: 'Calcula valor de mensalidade com descontos',
      config: {
        baseValue: 0,
        discounts: [],
      },
    },
  },
  {
    id: 'process-payment',
    type: 'validation',
    category: 'FINANCEIRO',
    data: {
      label: 'Processar Pagamento',
      icon: CreditCard,
      color: 'emerald',
      description: 'Processa e valida pagamentos',
      config: {
        methods: ['credit', 'debit', 'pix'],
      },
    },
  },
  {
    id: 'generate-billing',
    type: 'output',
    category: 'FINANCEIRO',
    data: {
      label: 'Gerar Cobrança',
      icon: Receipt,
      color: 'emerald',
      description: 'Gera cobrança e boleto para alunos',
      config: {
        dueDate: '',
      },
    },
  },
  {
    id: 'analyze-cashflow',
    type: 'ai',
    category: 'FINANCEIRO',
    data: {
      label: 'Analisar Fluxo de Caixa',
      icon: TrendingUp,
      color: 'emerald',
      description: 'Analisa receitas e despesas com IA',
      config: {
        model: 'gpt-4o-mini',
        period: 'monthly',
      },
    },
  },
  // COMPONENTES ESPECÍFICOS - RH
  {
    id: 'validate-clt-contract',
    type: 'validation',
    category: 'RH',
    data: {
      label: 'Validar Contrato CLT',
      icon: FileCheck,
      color: 'amber',
      description: 'Valida contrato trabalhista conforme CLT',
      config: {
        rules: ['clt'],
      },
    },
  },
  {
    id: 'process-payroll',
    type: 'validation',
    category: 'RH',
    data: {
      label: 'Processar Folha',
      icon: Briefcase,
      color: 'amber',
      description: 'Processa folha de pagamento de funcionários',
      config: {
        period: 'monthly',
      },
    },
  },
  {
    id: 'calculate-benefits',
    type: 'validation',
    category: 'RH',
    data: {
      label: 'Calcular Benefícios',
      icon: Percent,
      color: 'amber',
      description: 'Calcula benefícios e descontos de funcionários',
      config: {
        benefits: [],
      },
    },
  },
]

// Templates de Agentes
export const agentTemplates: AgentTemplate[] = [
  // CATEGORIA: ACADÊMICO
  {
    id: 'analisador-desempenho',
    name: 'Analisador de Desempenho de Alunos',
    description: 'Analisa desempenho acadêmico e identifica padrões de aprendizado',
    icon: GraduationCap,
    category: 'academico',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Dados de Alunos',
          icon: Users,
          color: 'blue',
          description: 'Recebe dados de alunos e notas',
          config: {},
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'ai',
        category: 'ANALISAR COM IA',
        data: {
          label: 'Analisar Desempenho',
          icon: Brain,
          color: 'purple',
          description: 'Analisa desempenho com IA',
          config: {
            model: 'gpt-4o-mini',
            instructions: 'Analise o desempenho acadêmico dos alunos, identifique padrões de aprendizado e áreas que precisam de atenção',
          },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'output',
        category: 'ENVIAR E GERAR',
        data: {
          label: 'Gerar Relatório',
          icon: FileSpreadsheet,
          color: 'emerald',
          description: 'Gera relatório de desempenho',
          config: { format: 'pdf' },
        },
        position: { x: 500, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
    ],
  },
  {
    id: 'gerador-boletins',
    name: 'Gerador de Boletins',
    description: 'Gera boletins escolares automaticamente com notas e frequência',
    icon: BookOpen,
    category: 'academico',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Notas e Frequência',
          icon: FileText,
          color: 'blue',
          description: 'Recebe dados de notas e presença',
          config: {},
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'validation',
        category: 'ACADÊMICO',
        data: {
          label: 'Calcular Médias',
          icon: Calculator,
          color: 'purple',
          description: 'Calcula médias dos alunos',
          config: { weights: {} },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'validation',
        category: 'VALIDAR E VERIFICAR',
        data: {
          label: 'Validar Aprovação',
          icon: CheckCircle,
          color: 'amber',
          description: 'Valida se aluno foi aprovado',
          config: { minAverage: 7.0 },
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'node-4',
        type: 'output',
        category: 'ENVIAR E GERAR',
        data: {
          label: 'Gerar Boletim',
          icon: FileDown,
          color: 'emerald',
          description: 'Gera boletim em PDF',
          config: { format: 'pdf' },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  {
    id: 'analisador-frequencia',
    name: 'Analisador de Frequência',
    description: 'Analisa padrões de frequência e identifica alunos em risco',
    icon: Calendar,
    category: 'academico',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Dados de Presença',
          icon: Calendar,
          color: 'blue',
          description: 'Recebe dados de frequência',
          config: {},
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'ai',
        category: 'ACADÊMICO',
        data: {
          label: 'Analisar Frequência',
          icon: Calendar,
          color: 'purple',
          description: 'Analisa padrões de frequência',
          config: {
            model: 'gpt-4o-mini',
            minAttendance: 75,
          },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'validation',
        category: 'VALIDAR E VERIFICAR',
        data: {
          label: 'Identificar Alunos em Risco',
          icon: AlertTriangle,
          color: 'amber',
          description: 'Identifica alunos com frequência baixa',
          config: { threshold: 75 },
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'node-4',
        type: 'output',
        category: 'ENVIAR E GERAR',
        data: {
          label: 'Gerar Alertas',
          icon: Bell,
          color: 'emerald',
          description: 'Gera alertas para responsáveis',
          config: { type: 'email' },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  {
    id: 'validador-matriculas',
    name: 'Validador de Matrículas',
    description: 'Valida dados de matrícula e documentos necessários',
    icon: ClipboardCheck,
    category: 'academico',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Dados de Matrícula',
          icon: FormInput,
          color: 'blue',
          description: 'Recebe dados do formulário de matrícula',
          config: {},
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'validation',
        category: 'ACADÊMICO',
        data: {
          label: 'Validar Matrícula',
          icon: ClipboardCheck,
          color: 'purple',
          description: 'Valida documentos e requisitos',
          config: { requiredDocs: ['cpf', 'rg', 'comprovante'] },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'validation',
        category: 'VALIDAR E VERIFICAR',
        data: {
          label: 'Verificar Requisitos',
          icon: CheckCircle,
          color: 'amber',
          description: 'Verifica se atende requisitos',
          config: { rules: [] },
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'node-4',
        type: 'validation',
        category: 'VALIDAR E VERIFICAR',
        data: {
          label: 'Decidir Aprovação',
          icon: GitBranch,
          color: 'amber',
          description: 'Aprova ou rejeita matrícula',
          config: { conditions: [] },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  // CATEGORIA: FINANCEIRO
  {
    id: 'analisador-financeiro',
    name: 'Analisador Financeiro',
    description: 'Analisa receitas, despesas e identifica tendências financeiras',
    icon: DollarSign,
    category: 'financeiro',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Dados Financeiros',
          icon: Database,
          color: 'blue',
          description: 'Recebe dados de receitas e despesas',
          config: {},
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'ai',
        category: 'FINANCEIRO',
        data: {
          label: 'Analisar Fluxo de Caixa',
          icon: TrendingUp,
          color: 'emerald',
          description: 'Analisa receitas e despesas',
          config: {
            model: 'gpt-4o-mini',
            period: 'monthly',
          },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'ai',
        category: 'ANALISAR COM IA',
        data: {
          label: 'Identificar Tendências',
          icon: Brain,
          color: 'purple',
          description: 'Identifica tendências e padrões',
          config: {
            model: 'gpt-4o-mini',
            instructions: 'Identifique tendências financeiras e padrões de gastos',
          },
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'node-4',
        type: 'output',
        category: 'ENVIAR E GERAR',
        data: {
          label: 'Gerar Relatório',
          icon: FileSpreadsheet,
          color: 'emerald',
          description: 'Gera relatório financeiro',
          config: { format: 'pdf' },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  {
    id: 'calculador-mensalidades',
    name: 'Calculador de Mensalidades',
    description: 'Calcula valores de mensalidade aplicando descontos e taxas',
    icon: Calculator,
    category: 'financeiro',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Dados de Alunos',
          icon: Users,
          color: 'blue',
          description: 'Recebe dados dos alunos',
          config: {},
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'validation',
        category: 'FINANCEIRO',
        data: {
          label: 'Calcular Mensalidade',
          icon: Calculator,
          color: 'emerald',
          description: 'Calcula valor base da mensalidade',
          config: { baseValue: 500 },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'validation',
        category: 'VALIDAR E VERIFICAR',
        data: {
          label: 'Aplicar Descontos',
          icon: Percent,
          color: 'amber',
          description: 'Aplica descontos e bolsas',
          config: { discounts: [] },
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'node-4',
        type: 'output',
        category: 'FINANCEIRO',
        data: {
          label: 'Gerar Cobrança',
          icon: Receipt,
          color: 'emerald',
          description: 'Gera boleto de cobrança',
          config: { dueDate: '' },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  {
    id: 'validador-pagamentos',
    name: 'Validador de Pagamentos',
    description: 'Valida comprovantes de pagamento e atualiza status',
    icon: CreditCard,
    category: 'financeiro',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Comprovante',
          icon: FileText,
          color: 'blue',
          description: 'Recebe comprovante de pagamento',
          config: { acceptedFormats: ['pdf', 'jpg', 'png'] },
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'ai',
        category: 'ANALISAR COM IA',
        data: {
          label: 'Analisar Comprovante',
          icon: Brain,
          color: 'purple',
          description: 'Extrai dados do comprovante',
          config: {
            model: 'gpt-4o-mini',
            instructions: 'Extraia valor, data e informações do comprovante',
          },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'validation',
        category: 'FINANCEIRO',
        data: {
          label: 'Processar Pagamento',
          icon: CreditCard,
          color: 'emerald',
          description: 'Valida e processa pagamento',
          config: { methods: ['pix', 'boleto'] },
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'node-4',
        type: 'output',
        category: 'ENVIAR E GERAR',
        data: {
          label: 'Enviar Confirmação',
          icon: Mail,
          color: 'emerald',
          description: 'Envia confirmação por email',
          config: { recipient: '' },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  // CATEGORIA: RECURSOS HUMANOS
  {
    id: 'analisador-contratos',
    name: 'Analisador de Contratos RH',
    description: 'Analisa contratos trabalhistas e valida conformidade com CLT',
    icon: FileText,
    category: 'rh',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Upload Contrato PDF',
          icon: FileText,
          color: 'blue',
          description: 'Aceita arquivos PDF',
          config: { acceptedFormats: ['pdf'] },
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'ai',
        category: 'ANALISAR COM IA',
        data: {
          label: 'Análise GPT-4',
          icon: Brain,
          color: 'purple',
          description: 'Analisa contrato com GPT-4',
          config: {
            model: 'gpt-4o-mini',
            instructions: 'Analise cuidadosamente o contrato de trabalho fornecido e forneça uma análise jurídica completa',
          },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'validation',
        category: 'RH',
        data: {
          label: 'Validar Contrato CLT',
          icon: FileCheck,
          color: 'amber',
          description: 'Valida conformidade com CLT',
          config: { rules: ['clt'] },
        },
        position: { x: 500, y: 50 },
      },
      {
        id: 'node-4',
        type: 'output',
        category: 'ENVIAR E GERAR',
        data: {
          label: 'Relatório Jurídico',
          icon: FileSpreadsheet,
          color: 'emerald',
          description: 'Gera relatório em JSON',
          config: { format: 'json' },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e1-3', source: 'node-1', target: 'node-3' },
      { id: 'e2-4', source: 'node-2', target: 'node-4' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  {
    id: 'processador-folha',
    name: 'Processador de Folha de Pagamento',
    description: 'Processa folha de pagamento calculando salários e descontos',
    icon: Briefcase,
    category: 'rh',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Dados de Funcionários',
          icon: Users,
          color: 'blue',
          description: 'Recebe dados dos funcionários',
          config: {},
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'validation',
        category: 'RH',
        data: {
          label: 'Calcular Benefícios',
          icon: Percent,
          color: 'amber',
          description: 'Calcula benefícios e descontos',
          config: { benefits: [] },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'validation',
        category: 'RH',
        data: {
          label: 'Processar Folha',
          icon: Briefcase,
          color: 'amber',
          description: 'Processa folha de pagamento',
          config: { period: 'monthly' },
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'node-4',
        type: 'output',
        category: 'ENVIAR E GERAR',
        data: {
          label: 'Gerar Folha',
          icon: FileSpreadsheet,
          color: 'emerald',
          description: 'Gera folha de pagamento',
          config: { format: 'pdf' },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  {
    id: 'avaliador-professores',
    name: 'Avaliador de Desempenho de Professores',
    description: 'Avalia desempenho de professores e sugere melhorias',
    icon: Award,
    category: 'rh',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Avaliações',
          icon: FileText,
          color: 'blue',
          description: 'Recebe avaliações de desempenho',
          config: {},
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'ai',
        category: 'ANALISAR COM IA',
        data: {
          label: 'Analisar Desempenho',
          icon: Brain,
          color: 'purple',
          description: 'Analisa desempenho com IA',
          config: {
            model: 'gpt-4o-mini',
            instructions: 'Analise o desempenho dos professores e identifique pontos fortes e áreas de melhoria',
          },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'ai',
        category: 'ANALISAR COM IA',
        data: {
          label: 'Sugerir Melhorias',
          icon: TrendingUp,
          color: 'purple',
          description: 'Gera sugestões de melhorias',
          config: {
            model: 'gpt-4o-mini',
            instructions: 'Sugira melhorias específicas baseadas na análise de desempenho',
          },
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'node-4',
        type: 'output',
        category: 'ENVIAR E GERAR',
        data: {
          label: 'Gerar Relatório',
          icon: FileSpreadsheet,
          color: 'emerald',
          description: 'Gera relatório de avaliação',
          config: { format: 'pdf' },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  // CATEGORIA: ADMINISTRATIVO
  {
    id: 'processador-documentos',
    name: 'Processador de Documentos',
    description: 'Processa documentos extraindo informações e validando dados',
    icon: FileText,
    category: 'administrativo',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Documentos',
          icon: FileText,
          color: 'blue',
          description: 'Recebe documentos para processar',
          config: { acceptedFormats: ['pdf', 'docx'] },
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'ai',
        category: 'ANALISAR COM IA',
        data: {
          label: 'Extrair Informações',
          icon: Zap,
          color: 'purple',
          description: 'Extrai informações dos documentos',
          config: {
            model: 'gpt-4o-mini',
            schema: {},
          },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'validation',
        category: 'VALIDAR E VERIFICAR',
        data: {
          label: 'Validar Dados',
          icon: CheckCircle,
          color: 'amber',
          description: 'Valida dados extraídos',
          config: { rules: [] },
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'node-4',
        type: 'output',
        category: 'ENVIAR E GERAR',
        data: {
          label: 'Salvar Dados',
          icon: Save,
          color: 'emerald',
          description: 'Armazena dados no banco',
          config: { table: 'documents' },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
  {
    id: 'gerador-relatorios-personalizados',
    name: 'Gerador de Relatórios Personalizados',
    description: 'Gera relatórios personalizados com dados e análise de IA',
    icon: BarChart3,
    category: 'administrativo',
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Receber Parâmetros',
          icon: FormInput,
          color: 'blue',
          description: 'Recebe parâmetros do relatório',
          config: {},
        },
        position: { x: 100, y: 100 },
      },
      {
        id: 'node-2',
        type: 'input',
        category: 'RECEBER DADOS',
        data: {
          label: 'Buscar Dados',
          icon: Database,
          color: 'blue',
          description: 'Busca dados no banco',
          config: { query: '' },
        },
        position: { x: 300, y: 100 },
      },
      {
        id: 'node-3',
        type: 'ai',
        category: 'ANALISAR COM IA',
        data: {
          label: 'Processar com IA',
          icon: Brain,
          color: 'purple',
          description: 'Processa dados com IA',
          config: {
            model: 'gpt-4o-mini',
            instructions: 'Analise os dados e gere insights relevantes',
          },
        },
        position: { x: 500, y: 100 },
      },
      {
        id: 'node-4',
        type: 'output',
        category: 'ENVIAR E GERAR',
        data: {
          label: 'Gerar Relatório',
          icon: FileSpreadsheet,
          color: 'emerald',
          description: 'Gera relatório personalizado',
          config: { format: 'pdf' },
        },
        position: { x: 700, y: 100 },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
    ],
  },
]

// Categorias de Templates
export const templateCategories: TemplateCategory[] = [
  {
    id: 'academico',
    name: 'Acadêmico',
    icon: GraduationCap,
    color: 'purple',
    templates: agentTemplates.filter((t) => t.category === 'academico'),
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    icon: DollarSign,
    color: 'emerald',
    templates: agentTemplates.filter((t) => t.category === 'financeiro'),
  },
  {
    id: 'rh',
    name: 'Recursos Humanos',
    icon: UserCog,
    color: 'amber',
    templates: agentTemplates.filter((t) => t.category === 'rh'),
  },
  {
    id: 'administrativo',
    name: 'Administrativo',
    icon: Building2,
    color: 'blue',
    templates: agentTemplates.filter((t) => t.category === 'administrativo'),
  },
]
