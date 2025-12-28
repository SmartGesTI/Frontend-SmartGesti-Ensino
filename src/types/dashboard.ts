// Tipos para StatCard
export type StatCardColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'red' | 'yellow'
export type StatCardVariant = 'gradient' | 'soft'

export interface StatCardData {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  subtitle?: string
  color: StatCardColor
}

// Tipos para DonutChart
export interface DonutSegment {
  label: string
  value: number
  color: string
}

export interface DonutChartData {
  segments: DonutSegment[]
  total?: number
  centerValue?: string | number
  centerLabel?: string
}

// Tipos para gráficos de barras
export interface BarChartItem {
  label: string
  value: number
  secondaryValue?: number
  color?: string
}

export interface SimpleBarChartData {
  items: BarChartItem[]
  showLegend?: boolean
  primaryLabel?: string
  secondaryLabel?: string
  primaryColor?: string
  secondaryColor?: string
}

export interface HorizontalBarItem {
  label: string
  value: number
  maxValue?: number
  subtitle?: string
}

// Tipos para AreaChart
export interface AreaChartDataPoint {
  label: string
  [key: string]: string | number
}

export interface AreaChartSeries {
  dataKey: string
  name: string
  color: string
}

// Tipos para Eventos
export type EventType = 'reuniao' | 'feriado' | 'importante'

export interface EventData {
  id: string | number
  titulo: string
  data: string
  tipo: EventType
}

// Tipos para Pagamentos
export type PaymentStatus = 'pago' | 'parcial' | 'pendente' | 'atrasado'

export interface PaymentData {
  id: string | number
  aluno: string
  valor: number
  data: string
  status: PaymentStatus
}

// Tipos para Ranking de Alunos
export interface StudentRankingData {
  id: string | number
  nome: string
  turma: string
  media: number
  posicao: number
}

// Tipos para Alertas
export type AlertType = 'warning' | 'error' | 'info' | 'success'

export interface AlertData {
  id: string | number
  texto: string
  tipo: AlertType
}

// Tipos para Atividades
export interface ActivityData {
  id: string | number
  texto: string
  tempo: string
}

// Tipos para Inadimplentes
export interface DebtorData {
  id: string | number
  aluno: string
  meses: number
  valor: number
}

// Tipos para Alunos em Recuperação
export interface StudentRecoveryData {
  id: string | number
  nome: string
  turma: string
  media: number
  disciplinas: number
}

// Tipos para Desempenho por Turma
export interface ClassPerformanceData {
  turma: string
  alunos: number
  media: number
  frequencia: number
}

// Tipos para Desempenho por Disciplina
export interface SubjectPerformanceData {
  disciplina: string
  media: number
  aprovacao: number
}

// Tipos para Métricas
export interface MetricItem {
  icon: React.ElementType
  value: string | number
  label: string
  color?: string
}

// Props base para componentes com loading
export interface LoadableProps {
  isLoading?: boolean
  error?: string | null
}
