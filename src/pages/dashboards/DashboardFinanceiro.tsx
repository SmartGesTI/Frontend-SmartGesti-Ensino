import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CreditCard,
  Receipt,
  PiggyBank,
  Users,
  CalendarDays,
  DollarSign
} from 'lucide-react'
import {
  StatCard,
  SimpleBarChart,
  DonutChart,
  PaymentList,
  DebtorList,
  MetricsSummary,
  SidebarCard,
  DashboardCard,
} from '@/components/dashboard'
import type { PaymentData, DebtorData, BarChartItem, DonutSegment, MetricItem } from '@/types/dashboard'

// Dados mockados - futuramente virão da API
const mockFinanceiro = {
  receitaMes: 125840.00,
  receitaMesAnterior: 118520.00,
  despesaMes: 89200.00,
  despesaMesAnterior: 92100.00,
  saldoAtual: 36640.00,
  inadimplencia: 8.4,
  inadimplenciaAnterior: 9.2,
  totalAlunos: 847,
  alunosAdimplentes: 776,
  alunosInadimplentes: 71,
}

const mockMensalidades = {
  pagas: 776,
  pendentes: 48,
  atrasadas: 23,
  total: 847,
}

const mockUltimosPagamentos: PaymentData[] = [
  { id: 1, aluno: 'Maria Silva Santos', valor: 850.00, data: '28/12', status: 'pago' },
  { id: 2, aluno: 'João Pedro Oliveira', valor: 850.00, data: '28/12', status: 'pago' },
  { id: 3, aluno: 'Ana Beatriz Costa', valor: 425.00, data: '27/12', status: 'parcial' },
  { id: 4, aluno: 'Lucas Mendes Alves', valor: 850.00, data: '27/12', status: 'pago' },
  { id: 5, aluno: 'Julia Fernandes', valor: 850.00, data: '26/12', status: 'pago' },
  { id: 6, aluno: 'Gabriel Rocha Lima', valor: 850.00, data: '26/12', status: 'pago' },
  { id: 7, aluno: 'Isabela Martins', valor: 850.00, data: '25/12', status: 'pago' },
  { id: 8, aluno: 'Rafael Souza', valor: 425.00, data: '25/12', status: 'parcial' },
  { id: 9, aluno: 'Camila Rodrigues', valor: 850.00, data: '24/12', status: 'pago' },
  { id: 10, aluno: 'Thiago Pereira', valor: 850.00, data: '24/12', status: 'pago' },
  { id: 11, aluno: 'Larissa Gomes', valor: 850.00, data: '23/12', status: 'pago' },
  { id: 12, aluno: 'Bruno Carvalho', valor: 850.00, data: '23/12', status: 'pago' },
  { id: 13, aluno: 'Amanda Ribeiro', valor: 850.00, data: '22/12', status: 'pago' },
  { id: 14, aluno: 'Felipe Dias', valor: 425.00, data: '22/12', status: 'parcial' },
  { id: 15, aluno: 'Beatriz Almeida', valor: 850.00, data: '21/12', status: 'pago' },
]

const mockInadimplentes: DebtorData[] = [
  { id: 1, aluno: 'Carlos Eduardo Lima', meses: 3, valor: 2550.00 },
  { id: 2, aluno: 'Fernanda Souza', meses: 2, valor: 1700.00 },
  { id: 3, aluno: 'Ricardo Santos', meses: 2, valor: 1700.00 },
  { id: 4, aluno: 'Patrícia Gomes', meses: 1, valor: 850.00 },
]

const mockGraficoMensal: BarChartItem[] = [
  { label: 'Jul', value: 115000, secondaryValue: 88000 },
  { label: 'Ago', value: 118000, secondaryValue: 90000 },
  { label: 'Set', value: 122000, secondaryValue: 91500 },
  { label: 'Out', value: 120000, secondaryValue: 89000 },
  { label: 'Nov', value: 118520, secondaryValue: 92100 },
  { label: 'Dez', value: 125840, secondaryValue: 89200 },
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

export default function DashboardFinanceiro() {
  // Simula diferentes tempos de carregamento para cada seção
  const { data: financeiro, isLoading: loadingFinanceiro } = useLoadData(mockFinanceiro, 500)
  const { data: mensalidades, isLoading: loadingMensalidades } = useLoadData(mockMensalidades, 800)
  const { data: pagamentos, isLoading: loadingPagamentos } = useLoadData(mockUltimosPagamentos, 700)
  const { data: inadimplentes, isLoading: loadingInadimplentes } = useLoadData(mockInadimplentes, 600)
  const { data: graficoMensal, isLoading: loadingGrafico } = useLoadData(mockGraficoMensal, 900)

  const receitaTrend = financeiro 
    ? ((financeiro.receitaMes - financeiro.receitaMesAnterior) / financeiro.receitaMesAnterior) * 100 
    : 0
  const despesaTrend = financeiro 
    ? ((financeiro.despesaMes - financeiro.despesaMesAnterior) / financeiro.despesaMesAnterior) * 100 
    : 0
  const inadimplenciaTrend = financeiro 
    ? financeiro.inadimplencia - financeiro.inadimplenciaAnterior 
    : 0

  // Prepara dados do donut chart
  const donutSegments: DonutSegment[] = mensalidades ? [
    { label: 'Pagas', value: mensalidades.pagas, color: '#10b981' },
    { label: 'Pendentes', value: mensalidades.pendentes, color: '#f59e0b' },
    { label: 'Atrasadas', value: mensalidades.atrasadas, color: '#ef4444' },
  ] : []

  // Prepara métricas do resumo
  const metricsData: MetricItem[] = financeiro ? [
    { 
      icon: DollarSign, 
      value: `R$ ${(financeiro.receitaMes - financeiro.despesaMes).toLocaleString('pt-BR')}`, 
      label: 'Lucro do Mês',
      color: 'text-emerald-500'
    },
    { 
      icon: Users, 
      value: financeiro.alunosAdimplentes, 
      label: 'Alunos Adimplentes',
      color: 'text-blue-500'
    },
    { 
      icon: AlertCircle, 
      value: financeiro.alunosInadimplentes, 
      label: 'Alunos Inadimplentes',
      color: 'text-red-500'
    },
    { 
      icon: Receipt, 
      value: `R$ ${Math.round(financeiro.receitaMes / financeiro.totalAlunos).toLocaleString('pt-BR')}`, 
      label: 'Ticket Médio',
      color: 'text-purple-500'
    },
  ] : []

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Coluna principal - 8 colunas */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
        {/* Cards principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Receita do Mês"
            value={financeiro ? `R$ ${financeiro.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
            icon={TrendingUp}
            trend={receitaTrend}
            trendLabel="vs mês anterior"
            color="green"
            variant="soft"
            isLoading={loadingFinanceiro}
          />
          <StatCard
            title="Despesas do Mês"
            value={financeiro ? `R$ ${financeiro.despesaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
            icon={TrendingDown}
            trend={despesaTrend}
            trendLabel="vs mês anterior"
            color="red"
            variant="soft"
            isLoading={loadingFinanceiro}
          />
          <StatCard
            title="Saldo Atual"
            value={financeiro ? `R$ ${financeiro.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
            icon={PiggyBank}
            color="blue"
            variant="soft"
            subtitle="Receita - Despesas"
            isLoading={loadingFinanceiro}
          />
          <StatCard
            title="Taxa de Inadimplência"
            value={financeiro ? `${financeiro.inadimplencia}%` : '0%'}
            icon={AlertCircle}
            trend={inadimplenciaTrend}
            trendLabel="vs mês anterior"
            color="orange"
            variant="soft"
            isLoading={loadingFinanceiro}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Gráfico de evolução */}
          <DashboardCard
            title="Evolução Mensal"
            description="Receitas e despesas dos últimos 6 meses"
            icon={CalendarDays}
            iconColor="text-blue-500"
            gradient="from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20"
            isLoading={loadingGrafico}
          >
            <SimpleBarChart
              data={graficoMensal || []}
              primaryLabel="Receita"
              secondaryLabel="Despesa"
              primaryColor="bg-emerald-500 hover:bg-emerald-600"
              secondaryColor="bg-red-400 hover:bg-red-500"
              isLoading={loadingGrafico}
            />
          </DashboardCard>

          {/* Status das mensalidades */}
          <DashboardCard
            title="Status das Mensalidades"
            description="Distribuição de pagamentos do mês"
            icon={Receipt}
            iconColor="text-purple-500"
            gradient="from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20"
            isLoading={loadingMensalidades}
          >
            <DonutChart
              segments={donutSegments}
              centerValue={mensalidades?.total}
              centerLabel="total"
              isLoading={loadingMensalidades}
            />
          </DashboardCard>
        </div>

        {/* Maiores inadimplentes */}
        <DashboardCard
          title="Maiores Inadimplentes"
          description="Alunos com mensalidades em atraso"
          icon={AlertCircle}
          iconColor="text-red-500"
          gradient="from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20"
          contentClassName="space-y-2"
          isLoading={loadingInadimplentes}
        >
          <DebtorList debtors={inadimplentes || []} isLoading={loadingInadimplentes} />
        </DashboardCard>

        {/* Resumo de métricas */}
        <MetricsSummary
          metrics={metricsData}
          gradient="from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20"
          isLoading={loadingFinanceiro}
        />
      </div>

      {/* Coluna lateral - Últimos Pagamentos - 4 colunas */}
      <div className="col-span-12 lg:col-span-4">
        <SidebarCard
          title="Últimos Pagamentos"
          description="Pagamentos recebidos recentemente"
          icon={CreditCard}
          iconColor="text-emerald-500"
          gradient="from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20"
          footerText="Ver todos os pagamentos"
          isLoading={loadingPagamentos}
        >
          <PaymentList payments={pagamentos || []} isLoading={loadingPagamentos} />
        </SidebarCard>
      </div>
    </div>
  )
}
