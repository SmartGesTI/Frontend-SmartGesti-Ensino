import { useSchool } from '@/contexts/SchoolContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  Bell,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building2,
  BarChart3,
  PieChart,
  ArrowRight
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

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

const mockEventos = [
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

const mockAlertas = [
  { id: 1, texto: '15 alunos com frequência abaixo de 75%', tipo: 'warning' },
  { id: 2, texto: '3 turmas sem professor titular definido', tipo: 'error' },
  { id: 3, texto: 'Documentação de 8 alunos pendente', tipo: 'info' },
]

const mockAtividades = [
  { id: 1, texto: 'Maria Silva cadastrou nova turma "3º Ano B"', tempo: '2 min' },
  { id: 2, texto: 'João Santos atualizou dados de 5 alunos', tempo: '15 min' },
  { id: 3, texto: 'Ana Costa gerou relatório de frequência', tempo: '1h' },
  { id: 4, texto: 'Pedro Lima aprovou 3 matrículas', tempo: '2h' },
]

// Dados para gráfico de evolução de matrículas
const mockEvolucaoMatriculas = [
  { mes: 'Jul', alunos: 780, professores: 38 },
  { mes: 'Ago', alunos: 795, professores: 39 },
  { mes: 'Set', alunos: 810, professores: 40 },
  { mes: 'Out', alunos: 825, professores: 41 },
  { mes: 'Nov', alunos: 835, professores: 41 },
  { mes: 'Dez', alunos: 847, professores: 42 },
]

// Dados para gráfico de distribuição por série
const mockDistribuicaoSeries = [
  { name: '1º Ano', value: 285, color: '#3b82f6' },
  { name: '2º Ano', value: 298, color: '#8b5cf6' },
  { name: '3º Ano', value: 264, color: '#10b981' },
]

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink'
  subtitle?: string
}

function StatCard({ title, value, icon: Icon, trend, trendLabel, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
    green: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/25',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/25',
    pink: 'from-pink-500 to-pink-600 shadow-pink-500/25',
  }

  const iconBgClasses = {
    blue: 'bg-blue-400/30',
    green: 'bg-emerald-400/30',
    purple: 'bg-purple-400/30',
    orange: 'bg-orange-400/30',
    pink: 'bg-pink-400/30',
  }

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} text-white border-0 shadow-lg`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {trend >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="font-medium">
                  {trend >= 0 ? '+' : ''}{trend}
                </span>
                {trendLabel && <span className="text-white/70">{trendLabel}</span>}
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-white/70">{subtitle}</p>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${iconBgClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
      <div className="absolute -right-3 -bottom-3 w-20 h-20 bg-white/10 rounded-full" />
      <div className="absolute -right-1 -bottom-6 w-12 h-12 bg-white/10 rounded-full" />
    </Card>
  )
}

export default function DashboardVisaoGeral() {
  const { school } = useSchool()

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Coluna principal - 8 colunas */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
        {/* Stats Cards - 4 em linha */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Alunos"
            value={mockStats.totalAlunos}
            icon={GraduationCap}
            trend={mockStats.alunosDiff}
            trendLabel="este mês"
            color="blue"
          />
          <StatCard
            title="Professores"
            value={mockStats.totalProfessores}
            icon={UserCheck}
            trend={mockStats.professoresDiff}
            trendLabel="novos"
            color="green"
          />
          <StatCard
            title="Turmas Ativas"
            value={`${mockStats.turmasAtivas}/${mockStats.totalTurmas}`}
            icon={BookOpen}
            color="purple"
            subtitle="turmas em funcionamento"
          />
          <StatCard
            title="Frequência Geral"
            value={`${mockStats.frequenciaGeral}%`}
            icon={Users}
            trend={mockStats.frequenciaDiff}
            trendLabel="vs mês anterior"
            color="orange"
          />
        </div>

        {/* Gráfico de Evolução */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              Evolução de Matrículas
            </CardTitle>
            <CardDescription className="text-xs">Crescimento nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockEvolucaoMatriculas}>
                  <defs>
                    <linearGradient id="colorAlunos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfessores" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="mes" 
                    className="text-xs"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                    tickLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    axisLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                    tickLine={{ stroke: 'currentColor', strokeOpacity: 0.2 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="alunos" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAlunos)" 
                    name="Alunos"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="professores" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorProfessores)" 
                    name="Professores"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cards menores em grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Gráfico de Distribuição */}
          <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
            <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-500" />
                Distribuição por Série
              </CardTitle>
              <CardDescription className="text-xs">Alunos por ano escolar</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={mockDistribuicaoSeries}
                      cx="50%"
                      cy="45%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {mockDistribuicaoSeries.map((entry, index) => (
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
            </CardContent>
          </Card>

          {/* Alertas e Pendências */}
          <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
            <CardHeader className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-500" />
                    Alertas e Pendências
                  </CardTitle>
                  <CardDescription className="text-xs">Itens que precisam de atenção</CardDescription>
                </div>
                <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                  {mockAlertas.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockAlertas.map((alerta) => (
                <div 
                  key={alerta.id} 
                  className={`
                    flex items-start gap-2 p-2.5 rounded-lg border-l-4
                    ${alerta.tipo === 'warning' 
                      ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500' 
                      : alerta.tipo === 'error' 
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-500' 
                      : 'bg-blue-50 dark:bg-blue-900/10 border-blue-500'}
                  `}
                >
                  {alerta.tipo === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  ) : alerta.tipo === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Bell className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {alerta.texto}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
            <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Atividades Recentes
              </CardTitle>
              <CardDescription className="text-xs">Últimas ações no sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockAtividades.map((atividade) => (
                <div 
                  key={atividade.id} 
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      {atividade.texto}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      há {atividade.tempo}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
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
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50 flex flex-col lg:sticky lg:top-4 lg:max-h-[90vh]">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Próximos Eventos
            </CardTitle>
            <CardDescription className="text-xs">Agenda da escola</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-2">
            {mockEventos.map((evento) => (
              <div 
                key={evento.id} 
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className={`
                  w-9 h-9 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold
                  ${evento.tipo === 'reuniao' ? 'bg-blue-500' : 
                    evento.tipo === 'feriado' ? 'bg-green-500' : 'bg-orange-500'}
                `}>
                  <span className="text-[10px]">{evento.data.split(' ')[0]}</span>
                  <span className="text-[8px] font-normal">{evento.data.split(' ')[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-gray-900 dark:text-gray-100 truncate">
                    {evento.titulo}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">
                    {evento.tipo}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="px-5 py-3 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Ver todos os eventos
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
