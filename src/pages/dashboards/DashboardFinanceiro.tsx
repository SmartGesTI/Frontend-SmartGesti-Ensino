import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Receipt,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CalendarDays
} from 'lucide-react'

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

const mockUltimosPagamentos = [
  { id: 1, aluno: 'Maria Silva Santos', valor: 850.00, data: '28/12', status: 'pago' },
  { id: 2, aluno: 'João Pedro Oliveira', valor: 850.00, data: '28/12', status: 'pago' },
  { id: 3, aluno: 'Ana Beatriz Costa', valor: 425.00, data: '27/12', status: 'parcial' },
  { id: 4, aluno: 'Lucas Mendes Alves', valor: 850.00, data: '27/12', status: 'pago' },
  { id: 5, aluno: 'Julia Fernandes', valor: 850.00, data: '26/12', status: 'pago' },
]

const mockInadimplentes = [
  { id: 1, aluno: 'Carlos Eduardo Lima', meses: 3, valor: 2550.00 },
  { id: 2, aluno: 'Fernanda Souza', meses: 2, valor: 1700.00 },
  { id: 3, aluno: 'Ricardo Santos', meses: 2, valor: 1700.00 },
  { id: 4, aluno: 'Patrícia Gomes', meses: 1, valor: 850.00 },
]

// Dados para o gráfico de barras simplificado (últimos 6 meses)
const mockGraficoMensal = [
  { mes: 'Jul', receita: 115000, despesa: 88000 },
  { mes: 'Ago', receita: 118000, despesa: 90000 },
  { mes: 'Set', receita: 122000, despesa: 91500 },
  { mes: 'Out', receita: 120000, despesa: 89000 },
  { mes: 'Nov', receita: 118520, despesa: 92100 },
  { mes: 'Dez', receita: 125840, despesa: 89200 },
]

interface FinanceCardProps {
  title: string
  value: string
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  color: 'green' | 'red' | 'blue' | 'orange' | 'purple'
  subtitle?: string
}

function FinanceCard({ title, value, icon: Icon, trend, trendLabel, color, subtitle }: FinanceCardProps) {
  const bgClasses = {
    green: 'bg-emerald-50 dark:bg-emerald-950/30',
    red: 'bg-red-50 dark:bg-red-950/30',
    blue: 'bg-blue-50 dark:bg-blue-950/30',
    orange: 'bg-orange-50 dark:bg-orange-950/30',
    purple: 'bg-purple-50 dark:bg-purple-950/30',
  }

  const iconClasses = {
    green: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50',
    red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50',
  }

  const valueClasses = {
    green: 'text-emerald-700 dark:text-emerald-300',
    red: 'text-red-700 dark:text-red-300',
    blue: 'text-blue-700 dark:text-blue-300',
    orange: 'text-orange-700 dark:text-orange-300',
    purple: 'text-purple-700 dark:text-purple-300',
  }

  return (
    <Card className={`${bgClasses[color]} border-0 shadow-sm dark:shadow-gray-950/50`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className={`text-2xl font-bold ${valueClasses[color]}`}>{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                {trend >= 0 ? (
                  <ArrowUpRight className={`w-4 h-4 ${trend >= 0 && color === 'red' ? 'text-red-500' : 'text-emerald-500'}`} />
                ) : (
                  <ArrowDownRight className={`w-4 h-4 ${trend < 0 && color === 'green' ? 'text-red-500' : 'text-emerald-500'}`} />
                )}
                <span className={`font-medium ${
                  (trend >= 0 && color !== 'red') || (trend < 0 && color === 'red') 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {Math.abs(trend).toFixed(1)}%
                </span>
                {trendLabel && <span className="text-gray-500 dark:text-gray-400">{trendLabel}</span>}
              </div>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SimpleBarChart() {
  const maxValue = Math.max(...mockGraficoMensal.flatMap(d => [d.receita, d.despesa]))
  
  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-gray-600 dark:text-gray-400">Receita</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-gray-600 dark:text-gray-400">Despesa</span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-2 h-48">
        {mockGraficoMensal.map((item) => (
          <div key={item.mes} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-1 items-end h-40">
              <div 
                className="flex-1 bg-emerald-500 rounded-t-sm transition-all hover:bg-emerald-600"
                style={{ height: `${(item.receita / maxValue) * 100}%` }}
                title={`Receita: R$ ${item.receita.toLocaleString('pt-BR')}`}
              />
              <div 
                className="flex-1 bg-red-400 rounded-t-sm transition-all hover:bg-red-500"
                style={{ height: `${(item.despesa / maxValue) * 100}%` }}
                title={`Despesa: R$ ${item.despesa.toLocaleString('pt-BR')}`}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.mes}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DonutChart() {
  const { pagas, pendentes, atrasadas, total } = mockMensalidades
  const pagasPercent = (pagas / total) * 100
  const pendentesPercent = (pendentes / total) * 100
  const atrasadasPercent = (atrasadas / total) * 100
  
  // SVG donut chart
  const radius = 70
  const strokeWidth = 20
  const circumference = 2 * Math.PI * radius
  
  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Background */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Atrasadas (vermelho) */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (atrasadasPercent / 100) * circumference}
            style={{ 
              transform: `rotate(${-90 + (pagasPercent + pendentesPercent) * 3.6}deg)`,
              transformOrigin: '90px 90px'
            }}
          />
          {/* Pendentes (amarelo) */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (pendentesPercent / 100) * circumference}
            style={{ 
              transform: `rotate(${-90 + pagasPercent * 3.6}deg)`,
              transformOrigin: '90px 90px'
            }}
          />
          {/* Pagas (verde) */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (pagasPercent / 100) * circumference}
            transform="rotate(-90 90 90)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{total}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">total</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-emerald-500" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{pagas}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pagas</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-amber-500" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{pendentes}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{atrasadas}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Atrasadas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardFinanceiro() {
  const receitaTrend = ((mockFinanceiro.receitaMes - mockFinanceiro.receitaMesAnterior) / mockFinanceiro.receitaMesAnterior) * 100
  const despesaTrend = ((mockFinanceiro.despesaMes - mockFinanceiro.despesaMesAnterior) / mockFinanceiro.despesaMesAnterior) * 100
  const inadimplenciaTrend = mockFinanceiro.inadimplencia - mockFinanceiro.inadimplenciaAnterior

  return (
    <div className="space-y-6">
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinanceCard
          title="Receita do Mês"
          value={`R$ ${mockFinanceiro.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          trend={receitaTrend}
          trendLabel="vs mês anterior"
          color="green"
        />
        <FinanceCard
          title="Despesas do Mês"
          value={`R$ ${mockFinanceiro.despesaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingDown}
          trend={despesaTrend}
          trendLabel="vs mês anterior"
          color="red"
        />
        <FinanceCard
          title="Saldo Atual"
          value={`R$ ${mockFinanceiro.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={PiggyBank}
          color="blue"
          subtitle="Receita - Despesas"
        />
        <FinanceCard
          title="Taxa de Inadimplência"
          value={`${mockFinanceiro.inadimplencia}%`}
          icon={AlertCircle}
          trend={inadimplenciaTrend}
          trendLabel="vs mês anterior"
          color="orange"
        />
      </div>

      {/* Gráficos e detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de evolução */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              Evolução Mensal
            </CardTitle>
            <CardDescription>Receitas e despesas dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart />
          </CardContent>
        </Card>

        {/* Status das mensalidades */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-purple-500" />
              Status das Mensalidades
            </CardTitle>
            <CardDescription>Distribuição de pagamentos do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart />
          </CardContent>
        </Card>
      </div>

      {/* Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos pagamentos */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              Últimos Pagamentos
            </CardTitle>
            <CardDescription>Pagamentos recebidos recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUltimosPagamentos.map((pagamento) => (
                <div 
                  key={pagamento.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${pagamento.status === 'pago' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                        : 'bg-amber-100 dark:bg-amber-900/30'}
                    `}>
                      {pagamento.status === 'pago' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {pagamento.aluno}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {pagamento.data}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      R$ {pagamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs capitalize ${
                      pagamento.status === 'pago' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {pagamento.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maiores inadimplentes */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Maiores Inadimplentes
            </CardTitle>
            <CardDescription>Alunos com mensalidades em atraso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInadimplentes.map((inadimplente) => (
                <div 
                  key={inadimplente.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {inadimplente.aluno}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {inadimplente.meses} {inadimplente.meses === 1 ? 'mês' : 'meses'} em atraso
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      R$ {inadimplente.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      débito total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de métricas */}
      <Card className="border-2 border-border bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <DollarSign className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                R$ {(mockFinanceiro.receitaMes - mockFinanceiro.despesaMes).toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lucro do Mês</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {mockFinanceiro.alunosAdimplentes}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Alunos Adimplentes</p>
            </div>
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {mockFinanceiro.alunosInadimplentes}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Alunos Inadimplentes</p>
            </div>
            <div className="text-center">
              <Receipt className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                R$ {(mockFinanceiro.receitaMes / mockFinanceiro.totalAlunos).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ticket Médio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
