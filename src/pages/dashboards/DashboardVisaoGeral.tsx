import { useState, useEffect } from 'react'
import { useSchool } from '@/contexts/SchoolContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  GraduationCap, 
  BookOpen, 
  Calendar,
  Bell,
  UserCheck,
  BarChart3,
  PieChart,
  Clock,
  Building2,
  Users
} from 'lucide-react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  StatCard,
  AreaChartCard,
  EventList,
  AlertList,
  ActivityList,
  SidebarCard,
  DashboardCard,
} from '@/components/dashboard'
import type { EventData, AlertData, ActivityData, AreaChartDataPoint, AreaChartSeries } from '@/types/dashboard'

// Dados mockados - futuramente virão da API
const mockStats = {
  totalAlunos: 847,
  alunosDiff: 12,
  totalProfessores: 42,
  professoresDiff: 2,
  totalTurmas: 28,
  turmasAtivas: 26,
  frequenciaGeral: 94.2,
  frequenciaDiff: 1.5,
}

const mockEventos: EventData[] = [
  { id: 1, titulo: 'Reunião de Pais', data: '30 Dez', tipo: 'reuniao' },
  { id: 2, titulo: 'Início do Recesso', data: '02 Jan', tipo: 'feriado' },
  { id: 3, titulo: 'Volta às Aulas', data: '20 Jan', tipo: 'importante' },
  { id: 4, titulo: 'Conselho de Classe', data: '25 Jan', tipo: 'reuniao' },
  { id: 5, titulo: 'Entrega de Boletins', data: '28 Jan', tipo: 'importante' },
  { id: 6, titulo: 'Reunião Pedagógica', data: '30 Jan', tipo: 'reuniao' },
  { id: 7, titulo: 'Feira de Ciências', data: '05 Fev', tipo: 'importante' },
  { id: 8, titulo: 'Carnaval - Recesso', data: '12 Fev', tipo: 'feriado' },
  { id: 9, titulo: 'Reunião de Coordenação', data: '18 Fev', tipo: 'reuniao' },
  { id: 10, titulo: 'Simulado Nacional', data: '22 Fev', tipo: 'importante' },
  { id: 11, titulo: 'Semana da Leitura', data: '25 Fev', tipo: 'importante' },
  { id: 12, titulo: 'Palestra de Orientação', data: '01 Mar', tipo: 'reuniao' },
  { id: 13, titulo: 'Dia da Mulher', data: '08 Mar', tipo: 'feriado' },
  { id: 14, titulo: 'Prova Bimestral', data: '15 Mar', tipo: 'importante' },
  { id: 15, titulo: 'Reunião de Pais 2', data: '22 Mar', tipo: 'reuniao' },
]

const mockAlertas: AlertData[] = [
  { id: 1, texto: '15 alunos com frequência abaixo de 75%', tipo: 'warning' },
  { id: 2, texto: '3 turmas sem professor titular definido', tipo: 'error' },
  { id: 3, texto: 'Documentação de 8 alunos pendente', tipo: 'info' },
]

const mockAtividades: ActivityData[] = [
  { id: 1, texto: 'Maria Silva cadastrou nova turma "3º Ano B"', tempo: '2 min' },
  { id: 2, texto: 'João Santos atualizou dados de 5 alunos', tempo: '15 min' },
  { id: 3, texto: 'Ana Costa gerou relatório de frequência', tempo: '1h' },
  { id: 4, texto: 'Pedro Lima aprovou 3 matrículas', tempo: '2h' },
]

const mockEvolucaoMatriculas: AreaChartDataPoint[] = [
  { label: 'Jul', alunos: 780, professores: 38 },
  { label: 'Ago', alunos: 795, professores: 39 },
  { label: 'Set', alunos: 810, professores: 40 },
  { label: 'Out', alunos: 825, professores: 41 },
  { label: 'Nov', alunos: 835, professores: 41 },
  { label: 'Dez', alunos: 847, professores: 42 },
]

const chartSeries: AreaChartSeries[] = [
  { dataKey: 'alunos', name: 'Alunos', color: '#3b82f6' },
  { dataKey: 'professores', name: 'Professores', color: '#10b981' },
]

const mockDistribuicaoSeries = [
  { name: '1º Ano', value: 285, color: '#3b82f6' },
  { name: '2º Ano', value: 298, color: '#8b5cf6' },
  { name: '3º Ano', value: 264, color: '#10b981' },
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

export default function DashboardVisaoGeral() {
  const { school } = useSchool()
  
  // Simula diferentes tempos de carregamento para cada seção
  const { data: stats, isLoading: loadingStats } = useLoadData(mockStats, 500)
  const { data: eventos, isLoading: loadingEventos } = useLoadData(mockEventos, 800)
  const { data: alertas, isLoading: loadingAlertas } = useLoadData(mockAlertas, 600)
  const { data: atividades, isLoading: loadingAtividades } = useLoadData(mockAtividades, 700)
  const { data: evolucao, isLoading: loadingEvolucao } = useLoadData(mockEvolucaoMatriculas, 1000)
  const { data: distribuicao, isLoading: loadingDistribuicao } = useLoadData(mockDistribuicaoSeries, 900)

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Coluna principal - 8 colunas */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
        {/* Stats Cards - 4 em linha */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Alunos"
            value={stats?.totalAlunos || 0}
            icon={GraduationCap}
            trend={stats?.alunosDiff}
            trendLabel="este mês"
            color="blue"
            isLoading={loadingStats}
          />
          <StatCard
            title="Professores"
            value={stats?.totalProfessores || 0}
            icon={UserCheck}
            trend={stats?.professoresDiff}
            trendLabel="novos"
            color="green"
            isLoading={loadingStats}
          />
          <StatCard
            title="Turmas Ativas"
            value={stats ? `${stats.turmasAtivas}/${stats.totalTurmas}` : '0/0'}
            icon={BookOpen}
            color="purple"
            subtitle="turmas em funcionamento"
            isLoading={loadingStats}
          />
          <StatCard
            title="Frequência Geral"
            value={stats ? `${stats.frequenciaGeral}%` : '0%'}
            icon={Users}
            trend={stats?.frequenciaDiff}
            trendLabel="vs mês anterior"
            color="orange"
            isLoading={loadingStats}
          />
        </div>

        {/* Gráfico de Evolução */}
        <DashboardCard
          title="Evolução de Matrículas"
          description="Crescimento nos últimos 6 meses"
          icon={BarChart3}
          iconColor="text-emerald-500"
          gradient="from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20"
          contentClassName="pt-4"
          isLoading={loadingEvolucao}
        >
          <AreaChartCard
            data={evolucao || []}
            series={chartSeries}
            height={256}
            isLoading={loadingEvolucao}
          />
        </DashboardCard>

        {/* Cards menores em grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Gráfico de Distribuição */}
          <DashboardCard
            title="Distribuição por Série"
            description="Alunos por ano escolar"
            icon={PieChart}
            iconColor="text-purple-500"
            gradient="from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20"
            contentClassName="pt-4"
            isLoading={loadingDistribuicao}
          >
            {loadingDistribuicao ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={distribuicao || []}
                      cx="50%"
                      cy="45%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(distribuicao || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--background)', 
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`${value} alunos`, '']}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={30}
                      formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            )}
          </DashboardCard>

          {/* Alertas e Pendências */}
          <DashboardCard
            title="Alertas e Pendências"
            description="Itens que precisam de atenção"
            icon={Bell}
            iconColor="text-orange-500"
            gradient="from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20"
            badge={alertas?.length}
            badgeColor="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            contentClassName="space-y-2"
            isLoading={loadingAlertas}
          >
            <AlertList alerts={alertas || []} isLoading={loadingAlertas} />
          </DashboardCard>

          {/* Atividades Recentes */}
          <DashboardCard
            title="Atividades Recentes"
            description="Últimas ações no sistema"
            icon={Clock}
            iconColor="text-purple-500"
            gradient="from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20"
            contentClassName="space-y-2"
            isLoading={loadingAtividades}
          >
            <ActivityList activities={atividades || []} isLoading={loadingAtividades} />
          </DashboardCard>
        </div>

        {/* Informações da Escola */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              Informações da Escola
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Nome</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {school?.name || 'Carregando...'}
                </p>
              </div>
              {school?.code && (
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Código INEP</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {school.code}
                  </p>
                </div>
              )}
              {school?.endereco_cidade && school?.endereco_estado && (
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Localização</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {school.endereco_cidade}/{school.endereco_estado}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coluna lateral - Próximos Eventos - 4 colunas */}
      <div className="col-span-12 lg:col-span-4">
        <SidebarCard
          title="Próximos Eventos"
          description="Agenda da escola"
          icon={Calendar}
          iconColor="text-blue-500"
          gradient="from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20"
          footerText="Ver todos os eventos"
          isLoading={loadingEventos}
        >
          <EventList events={eventos || []} isLoading={loadingEventos} />
        </SidebarCard>
      </div>
    </div>
  )
}
