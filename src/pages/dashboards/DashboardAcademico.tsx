import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  GraduationCap, 
  TrendingUp, 
  TrendingDown,
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

const mockDesempenhoTurmas = [
  { turma: '1º Ano A', media: 8.2, frequencia: 96.5, alunos: 32 },
  { turma: '1º Ano B', media: 7.8, frequencia: 94.2, alunos: 30 },
  { turma: '2º Ano A', media: 7.5, frequencia: 93.8, alunos: 35 },
  { turma: '2º Ano B', media: 7.1, frequencia: 92.1, alunos: 33 },
  { turma: '3º Ano A', media: 7.9, frequencia: 95.3, alunos: 28 },
  { turma: '3º Ano B', media: 6.8, frequencia: 91.5, alunos: 31 },
]

const mockAlunosDestaque = [
  { id: 1, nome: 'Ana Carolina Silva', turma: '1º Ano A', media: 9.8, posicao: 1 },
  { id: 2, nome: 'Pedro Henrique Souza', turma: '3º Ano A', media: 9.6, posicao: 2 },
  { id: 3, nome: 'Maria Eduarda Lima', turma: '1º Ano A', media: 9.5, posicao: 3 },
  { id: 4, nome: 'Lucas Gabriel Costa', turma: '2º Ano A', media: 9.4, posicao: 4 },
  { id: 5, nome: 'Julia Fernanda Santos', turma: '1º Ano B', media: 9.3, posicao: 5 },
]

const mockAlunosRecuperacao = [
  { id: 1, nome: 'Carlos Eduardo Oliveira', turma: '3º Ano B', media: 4.8, disciplinas: 3 },
  { id: 2, nome: 'Fernanda Beatriz Alves', turma: '2º Ano B', media: 5.2, disciplinas: 2 },
  { id: 3, nome: 'Ricardo José Mendes', turma: '3º Ano B', media: 5.5, disciplinas: 2 },
  { id: 4, nome: 'Patrícia Maria Gomes', turma: '2º Ano B', media: 5.7, disciplinas: 1 },
]

const mockDesempenhoDisciplinas = [
  { disciplina: 'Matemática', media: 6.8, aprovacao: 82 },
  { disciplina: 'Português', media: 7.5, aprovacao: 91 },
  { disciplina: 'História', media: 7.8, aprovacao: 93 },
  { disciplina: 'Geografia', media: 7.6, aprovacao: 90 },
  { disciplina: 'Ciências', media: 7.2, aprovacao: 88 },
  { disciplina: 'Inglês', media: 7.9, aprovacao: 94 },
]

interface AcademicCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'
  subtitle?: string
}

function AcademicCard({ title, value, icon: Icon, trend, trendLabel, color, subtitle }: AcademicCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
    green: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/25',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/25',
    red: 'from-red-500 to-red-600 shadow-red-500/25',
    yellow: 'from-amber-500 to-amber-600 shadow-amber-500/25',
  }

  const iconBgClasses = {
    blue: 'bg-blue-400/30',
    green: 'bg-emerald-400/30',
    purple: 'bg-purple-400/30',
    orange: 'bg-orange-400/30',
    red: 'bg-red-400/30',
    yellow: 'bg-amber-400/30',
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
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}
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

function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const percentage = (value / max) * 100
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}

function HorizontalBarChart() {
  return (
    <div className="space-y-4">
      {mockDesempenhoDisciplinas.map((item) => (
        <div key={item.disciplina} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.disciplina}</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.media.toFixed(1)}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${
                item.media >= 7 ? 'bg-emerald-500' : item.media >= 5 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${(item.media / 10) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {item.aprovacao}% de aprovação
          </p>
        </div>
      ))}
    </div>
  )
}

function FrequenciaGauge() {
  const frequencia = mockAcademico.frequenciaMedia
  const radius = 80
  const strokeWidth = 12
  const circumference = Math.PI * radius // semicírculo
  const progress = (frequencia / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={frequencia >= 90 ? '#10b981' : frequencia >= 75 ? '#f59e0b' : '#ef4444'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
        <text x="100" y="85" textAnchor="middle" className="fill-gray-900 dark:fill-gray-100 text-3xl font-bold">
          {frequencia}%
        </text>
        <text x="100" y="105" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400 text-sm">
          Frequência Média
        </text>
      </svg>
      <div className="flex gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-gray-600 dark:text-gray-400">≥90% Excelente</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-gray-600 dark:text-gray-400">75-89% Atenção</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-600 dark:text-gray-400">&lt;75% Crítico</span>
        </div>
      </div>
    </div>
  )
}

export default function DashboardAcademico() {
  const mediaTrend = mockAcademico.mediaGeral - mockAcademico.mediaAnterior
  const aprovacaoTrend = mockAcademico.taxaAprovacao - mockAcademico.taxaAprovacaoAnterior
  // const frequenciaTrend = mockAcademico.frequenciaMedia - mockAcademico.frequenciaAnterior

  return (
    <div className="space-y-6">
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AcademicCard
          title="Média Geral"
          value={mockAcademico.mediaGeral.toFixed(1)}
          icon={Target}
          trend={mediaTrend}
          trendLabel="vs bimestre anterior"
          color="blue"
        />
        <AcademicCard
          title="Taxa de Aprovação"
          value={`${mockAcademico.taxaAprovacao}%`}
          icon={Award}
          trend={aprovacaoTrend}
          trendLabel="vs ano anterior"
          color="green"
        />
        <AcademicCard
          title="Alunos em Destaque"
          value={mockAcademico.alunosDestaque}
          icon={Star}
          color="purple"
          subtitle="média acima de 8.5"
        />
        <AcademicCard
          title="Em Recuperação"
          value={mockAcademico.alunosRecuperacao}
          icon={AlertTriangle}
          color="orange"
          subtitle="média abaixo de 6.0"
        />
      </div>

      {/* Segunda linha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desempenho por disciplina */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Desempenho por Disciplina
            </CardTitle>
            <CardDescription>Média geral de cada disciplina</CardDescription>
          </CardHeader>
          <CardContent>
            <HorizontalBarChart />
          </CardContent>
        </Card>

        {/* Frequência */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Frequência Geral
            </CardTitle>
            <CardDescription>Taxa de presença dos alunos</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <FrequenciaGauge />
          </CardContent>
        </Card>
      </div>

      {/* Terceira linha - Desempenho por turma */}
      <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
        <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/20 border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Desempenho por Turma
          </CardTitle>
          <CardDescription>Comparativo entre turmas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Turma</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Alunos</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Média</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Frequência</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 w-1/3">Progresso</th>
                </tr>
              </thead>
              <tbody>
                {mockDesempenhoTurmas.map((turma) => (
                  <tr key={turma.turma} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          turma.media >= 7.5 ? 'bg-emerald-500' : turma.media >= 6 ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span className="font-medium text-gray-900 dark:text-gray-100">{turma.turma}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-gray-600 dark:text-gray-400">{turma.alunos}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${
                        turma.media >= 7 ? 'text-emerald-600 dark:text-emerald-400' : 
                        turma.media >= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {turma.media.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${
                        turma.frequencia >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 
                        turma.frequencia >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {turma.frequencia}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <ProgressBar 
                        value={turma.media} 
                        max={10}
                        color={turma.media >= 7 ? 'bg-emerald-500' : turma.media >= 5 ? 'bg-amber-500' : 'bg-red-500'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quarta linha - Destaques e Recuperação */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 alunos */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              Top 5 Alunos
            </CardTitle>
            <CardDescription>Melhores médias da escola</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlunosDestaque.map((aluno) => (
                <div 
                  key={aluno.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800/30"
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                    ${aluno.posicao === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 
                      aluno.posicao === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                      aluno.posicao === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-blue-400 to-blue-600'}
                  `}>
                    {aluno.posicao}º
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {aluno.nome}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {aluno.turma}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {aluno.media.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">média</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alunos em recuperação */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-red-500" />
              Alunos em Recuperação
            </CardTitle>
            <CardDescription>Precisam de atenção especial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlunosRecuperacao.map((aluno) => (
                <div 
                  key={aluno.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30"
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {aluno.nome}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {aluno.turma} • {aluno.disciplinas} disciplina{aluno.disciplinas > 1 ? 's' : ''} em recuperação
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                      {aluno.media.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">média</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo */}
      <Card className="border-2 border-border bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <GraduationCap className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                847
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Alunos</p>
            </div>
            <div className="text-center">
              <BookOpen className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                28
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Turmas</p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                756
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aprovados (previsão)</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                42
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Professores</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
