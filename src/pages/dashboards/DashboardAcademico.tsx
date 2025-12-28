import { useState, useEffect } from 'react'
import { 
  GraduationCap, 
  Award,
  AlertTriangle,
  BookOpen,
  Users,
  Target,
  Star,
  Clock,
  BarChart3,
  Medal,
  ThumbsDown
} from 'lucide-react'
import {
  StatCard,
  DonutChart,
  HorizontalBarChart,
  StudentRankingList,
  RecoveryStudentList,
  ClassPerformanceTable,
  MetricsSummary,
  SidebarCard,
  DashboardCard,
} from '@/components/dashboard'
import type { 
  StudentRankingData, 
  StudentRecoveryData, 
  ClassPerformanceData, 
  HorizontalBarItem,
  DonutSegment,
  MetricItem 
} from '@/types/dashboard'

// Dados mockados - futuramente virão da API
const mockAcademico = {
  mediaGeral: 7.4,
  mediaAnterior: 7.1,
  taxaAprovacao: 89.2,
  taxaAprovacaoAnterior: 87.5,
  frequenciaMedia: 94.2,
  frequenciaAnterior: 93.8,
  alunosRecuperacao: 52,
  alunosDestaque: 78,
}

const mockDesempenhoTurmas: ClassPerformanceData[] = [
  { turma: '1º Ano A', media: 8.2, frequencia: 96.5, alunos: 32 },
  { turma: '1º Ano B', media: 7.8, frequencia: 94.2, alunos: 30 },
  { turma: '2º Ano A', media: 7.5, frequencia: 93.8, alunos: 35 },
  { turma: '2º Ano B', media: 7.1, frequencia: 92.1, alunos: 33 },
  { turma: '3º Ano A', media: 7.9, frequencia: 95.3, alunos: 28 },
  { turma: '3º Ano B', media: 6.8, frequencia: 91.5, alunos: 31 },
]

const mockAlunosDestaque: StudentRankingData[] = [
  { id: 1, nome: 'Ana Carolina Silva', turma: '1º Ano A', media: 9.8, posicao: 1 },
  { id: 2, nome: 'Pedro Henrique Souza', turma: '3º Ano A', media: 9.6, posicao: 2 },
  { id: 3, nome: 'Maria Eduarda Lima', turma: '1º Ano A', media: 9.5, posicao: 3 },
  { id: 4, nome: 'Lucas Gabriel Costa', turma: '2º Ano A', media: 9.4, posicao: 4 },
  { id: 5, nome: 'Julia Fernanda Santos', turma: '1º Ano B', media: 9.3, posicao: 5 },
  { id: 6, nome: 'Gabriel Rocha Lima', turma: '2º Ano B', media: 9.2, posicao: 6 },
  { id: 7, nome: 'Isabela Martins', turma: '3º Ano A', media: 9.1, posicao: 7 },
  { id: 8, nome: 'Rafael Souza Neto', turma: '1º Ano B', media: 9.0, posicao: 8 },
  { id: 9, nome: 'Camila Rodrigues', turma: '2º Ano A', media: 8.9, posicao: 9 },
  { id: 10, nome: 'Thiago Pereira', turma: '3º Ano B', media: 8.8, posicao: 10 },
  { id: 11, nome: 'Larissa Gomes', turma: '1º Ano A', media: 8.7, posicao: 11 },
  { id: 12, nome: 'Bruno Carvalho', turma: '2º Ano B', media: 8.7, posicao: 12 },
  { id: 13, nome: 'Amanda Ribeiro', turma: '3º Ano A', media: 8.6, posicao: 13 },
  { id: 14, nome: 'Felipe Dias', turma: '1º Ano B', media: 8.6, posicao: 14 },
  { id: 15, nome: 'Beatriz Almeida', turma: '2º Ano A', media: 8.5, posicao: 15 },
  { id: 16, nome: 'Matheus Oliveira', turma: '3º Ano B', media: 8.5, posicao: 16 },
  { id: 17, nome: 'Sofia Nascimento', turma: '1º Ano A', media: 8.4, posicao: 17 },
  { id: 18, nome: 'Enzo Ferreira', turma: '2º Ano B', media: 8.4, posicao: 18 },
  { id: 19, nome: 'Valentina Costa', turma: '3º Ano A', media: 8.3, posicao: 19 },
  { id: 20, nome: 'Gustavo Santos', turma: '1º Ano B', media: 8.3, posicao: 20 },
  { id: 21, nome: 'Helena Barbosa', turma: '2º Ano A', media: 8.2, posicao: 21 },
  { id: 22, nome: 'Davi Moreira', turma: '3º Ano B', media: 8.2, posicao: 22 },
  { id: 23, nome: 'Laura Cardoso', turma: '1º Ano A', media: 8.1, posicao: 23 },
  { id: 24, nome: 'Arthur Teixeira', turma: '2º Ano B', media: 8.1, posicao: 24 },
  { id: 25, nome: 'Manuela Freitas', turma: '3º Ano A', media: 8.0, posicao: 25 },
]

const mockAlunosRecuperacao: StudentRecoveryData[] = [
  { id: 1, nome: 'Carlos Eduardo Oliveira', turma: '3º Ano B', media: 4.8, disciplinas: 3 },
  { id: 2, nome: 'Fernanda Beatriz Alves', turma: '2º Ano B', media: 5.2, disciplinas: 2 },
  { id: 3, nome: 'Ricardo José Mendes', turma: '3º Ano B', media: 5.5, disciplinas: 2 },
  { id: 4, nome: 'Patrícia Maria Gomes', turma: '2º Ano B', media: 5.7, disciplinas: 1 },
]

const mockDesempenhoDisciplinas: HorizontalBarItem[] = [
  { label: 'Matemática', value: 6.8, maxValue: 10, subtitle: '82% de aprovação' },
  { label: 'Português', value: 7.5, maxValue: 10, subtitle: '91% de aprovação' },
  { label: 'História', value: 7.8, maxValue: 10, subtitle: '93% de aprovação' },
  { label: 'Geografia', value: 7.6, maxValue: 10, subtitle: '90% de aprovação' },
  { label: 'Ciências', value: 7.2, maxValue: 10, subtitle: '88% de aprovação' },
  { label: 'Inglês', value: 7.9, maxValue: 10, subtitle: '94% de aprovação' },
]

// Simula carregamento de dados
function useLoadData<T>(data: T, delay: number = 1000) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadedData, setLoadedData] = useState<T | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedData(data)
      setIsLoading(false)
    }, delay)
    return () => clearTimeout(timer)
  }, [data, delay])

  return { data: loadedData, isLoading }
}

export default function DashboardAcademico() {
  // Simula diferentes tempos de carregamento para cada seção
  const { data: academico, isLoading: loadingAcademico } = useLoadData(mockAcademico, 500)
  const { data: turmas, isLoading: loadingTurmas } = useLoadData(mockDesempenhoTurmas, 800)
  const { data: alunosDestaque, isLoading: loadingDestaque } = useLoadData(mockAlunosDestaque, 700)
  const { data: alunosRecuperacao, isLoading: loadingRecuperacao } = useLoadData(mockAlunosRecuperacao, 600)
  const { data: disciplinas, isLoading: loadingDisciplinas } = useLoadData(mockDesempenhoDisciplinas, 900)

  const mediaTrend = academico ? academico.mediaGeral - academico.mediaAnterior : 0
  const aprovacaoTrend = academico ? academico.taxaAprovacao - academico.taxaAprovacaoAnterior : 0

  // Prepara dados do donut chart de frequência
  const frequencia = academico?.frequenciaMedia || 0
  const ausencia = 100 - frequencia
  const frequenciaSegments: DonutSegment[] = [
    { label: 'Presença', value: frequencia, color: frequencia >= 90 ? '#10b981' : frequencia >= 75 ? '#f59e0b' : '#ef4444' },
    { label: 'Ausência', value: ausencia, color: '#d1d5db' },
  ]
  const frequenciaStatus = frequencia >= 90 ? '✓ Excelente' : frequencia >= 75 ? '⚠ Atenção' : '✗ Crítico'
  const frequenciaStatusColor = frequencia >= 90 
    ? 'text-emerald-600 dark:text-emerald-400' 
    : frequencia >= 75 
    ? 'text-amber-600 dark:text-amber-400' 
    : 'text-red-600 dark:text-red-400'

  // Prepara métricas do resumo
  const metricsData: MetricItem[] = [
    { icon: GraduationCap, value: '847', label: 'Total de Alunos', color: 'text-blue-500' },
    { icon: BookOpen, value: '28', label: 'Turmas', color: 'text-purple-500' },
    { icon: Award, value: '756', label: 'Aprovados (previsão)', color: 'text-emerald-500' },
    { icon: Users, value: '42', label: 'Professores', color: 'text-amber-500' },
  ]

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Coluna principal - 8 colunas */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
        {/* Cards principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Média Geral"
            value={academico?.mediaGeral.toFixed(1) || '0.0'}
            icon={Target}
            trend={mediaTrend}
            trendLabel="vs bimestre anterior"
            color="blue"
            isLoading={loadingAcademico}
          />
          <StatCard
            title="Taxa de Aprovação"
            value={academico ? `${academico.taxaAprovacao}%` : '0%'}
            icon={Award}
            trend={aprovacaoTrend}
            trendLabel="vs ano anterior"
            color="green"
            isLoading={loadingAcademico}
          />
          <StatCard
            title="Alunos em Destaque"
            value={academico?.alunosDestaque || 0}
            icon={Star}
            color="purple"
            subtitle="média acima de 8.5"
            isLoading={loadingAcademico}
          />
          <StatCard
            title="Em Recuperação"
            value={academico?.alunosRecuperacao || 0}
            icon={AlertTriangle}
            color="orange"
            subtitle="média abaixo de 6.0"
            isLoading={loadingAcademico}
          />
        </div>

        {/* Resumo */}
        <MetricsSummary
          metrics={metricsData}
          gradient="from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20"
          isLoading={loadingAcademico}
        />

        {/* Gráficos lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Desempenho por disciplina */}
          <DashboardCard
            title="Desempenho por Disciplina"
            description="Média geral de cada disciplina"
            icon={BarChart3}
            iconColor="text-blue-500"
            gradient="from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20"
            isLoading={loadingDisciplinas}
          >
            <HorizontalBarChart
              data={disciplinas || []}
              maxValue={10}
              isLoading={loadingDisciplinas}
            />
          </DashboardCard>

          {/* Frequência */}
          <DashboardCard
            title="Frequência Geral"
            description="Taxa de presença dos alunos"
            icon={Clock}
            iconColor="text-purple-500"
            gradient="from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20"
            contentClassName="flex items-center justify-center"
            isLoading={loadingAcademico}
          >
            <DonutChart
              segments={frequenciaSegments}
              centerValue={`${frequencia}%`}
              centerLabel="presença"
              size="lg"
              statusText={frequenciaStatus}
              statusColor={frequenciaStatusColor}
              isLoading={loadingAcademico}
            />
          </DashboardCard>
        </div>

        {/* Desempenho por turma */}
        <DashboardCard
          title="Desempenho por Turma"
          description="Comparativo entre turmas"
          icon={BookOpen}
          iconColor="text-indigo-500"
          gradient="from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/20"
          isLoading={loadingTurmas}
        >
          <ClassPerformanceTable classes={turmas || []} isLoading={loadingTurmas} />
        </DashboardCard>

        {/* Alunos em recuperação */}
        <DashboardCard
          title="Alunos em Recuperação"
          description="Precisam de atenção especial"
          icon={ThumbsDown}
          iconColor="text-red-500"
          gradient="from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20"
          contentClassName="space-y-2"
          isLoading={loadingRecuperacao}
        >
          <RecoveryStudentList students={alunosRecuperacao || []} isLoading={loadingRecuperacao} />
        </DashboardCard>
      </div>

      {/* Coluna lateral - Top 25 Alunos - 4 colunas */}
      <div className="col-span-12 lg:col-span-4">
        <SidebarCard
          title="Top 25 Alunos"
          description="Melhores médias da escola"
          icon={Medal}
          iconColor="text-amber-500"
          gradient="from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20"
          footerText="Ver todos os alunos"
          isLoading={loadingDestaque}
        >
          <StudentRankingList 
            students={alunosDestaque || []} 
            showDividers={true}
            isLoading={loadingDestaque} 
          />
        </SidebarCard>
      </div>
    </div>
  )
}
