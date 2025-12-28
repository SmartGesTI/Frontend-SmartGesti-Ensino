import { useSchool } from '@/contexts/SchoolContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Building2
} from 'lucide-react'

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
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                {trend >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {trend >= 0 ? '+' : ''}{trend}
                </span>
                {trendLabel && <span className="text-white/70">{trendLabel}</span>}
              </div>
            )}
            {subtitle && (
              <p className="text-sm text-white/70">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </CardContent>
      {/* Decorativo */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -right-2 -bottom-8 w-16 h-16 bg-white/10 rounded-full" />
    </Card>
  )
}

export default function DashboardVisaoGeral() {
  const { school } = useSchool()

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Segunda linha de cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximos Eventos */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Próximos Eventos
                </CardTitle>
                <CardDescription>Agenda da escola</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockEventos.map((evento) => (
              <div 
                key={evento.id} 
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className={`
                  w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold
                  ${evento.tipo === 'reuniao' ? 'bg-blue-500' : 
                    evento.tipo === 'feriado' ? 'bg-green-500' : 'bg-orange-500'}
                `}>
                  <span>{evento.data.split(' ')[0]}</span>
                  <span className="text-[10px] font-normal">{evento.data.split(' ')[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {evento.titulo}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {evento.tipo}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertas e Pendências */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="pb-3 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  Alertas e Pendências
                </CardTitle>
                <CardDescription>Itens que precisam de atenção</CardDescription>
              </div>
              <span className="px-2 py-1 text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                {mockAlertas.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAlertas.map((alerta) => (
              <div 
                key={alerta.id} 
                className={`
                  flex items-start gap-3 p-3 rounded-lg border-l-4
                  ${alerta.tipo === 'warning' 
                    ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500' 
                    : alerta.tipo === 'error' 
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-500' 
                    : 'bg-blue-50 dark:bg-blue-900/10 border-blue-500'}
                `}
              >
                {alerta.tipo === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                ) : alerta.tipo === 'error' ? (
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {alerta.texto}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="pb-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAtividades.map((atividade) => (
              <div 
                key={atividade.id} 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {atividade.texto}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    há {atividade.tempo}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resumo Rápido */}
      <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Informações da Escola
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {school?.name || 'Carregando...'}
              </p>
            </div>
            {school?.code && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Código INEP</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {school.code}
                </p>
              </div>
            )}
            {school?.endereco_cidade && school?.endereco_estado && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Localização</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {school.endereco_cidade}/{school.endereco_estado}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
