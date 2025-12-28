import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  ThumbsDown,
  ArrowRight
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
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}
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
      {/* Decorativo */}
      <div className="absolute -right-3 -bottom-3 w-20 h-20 bg-white/10 rounded-full" />
      <div className="absolute -right-1 -bottom-6 w-12 h-12 bg-white/10 rounded-full" />
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
    <div className="space-y-3">
      {mockDesempenhoDisciplinas.map((item) => (
        <div key={item.disciplina} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.disciplina}</span>
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{item.media.toFixed(1)}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                item.media >= 7 ? 'bg-emerald-500' : item.media >= 5 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${(item.media / 10) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            {item.aprovacao}% de aprovação
          </p>
        </div>
      ))}
    </div>
  )
}

function FrequenciaGauge() {
  const frequencia = mockAcademico.frequenciaMedia
  const ausencia = 100 - frequencia
  
  // SVG donut chart
  const radius = 80
  const strokeWidth = 22
  const circumference = 2 * Math.PI * radius
  const frequenciaOffset = circumference - (frequencia / 100) * circumference
  
  return (
    <div className="flex items-center justify-center gap-12">
      <div className="relative">
        <svg width="220" height="220" viewBox="0 0 220 220">
          {/* Background */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Frequência (verde/amarelo/vermelho) */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={frequencia >= 90 ? '#10b981' : frequencia >= 75 ? '#f59e0b' : '#ef4444'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={frequenciaOffset}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">{frequencia}%</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">presença</span>
        </div>
      </div>
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className={`w-6 h-6 rounded-full ${frequencia >= 90 ? 'bg-emerald-500' : frequencia >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} />
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{frequencia}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Presença</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{ausencia.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ausência</p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className={`text-base font-semibold ${
            frequencia >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 
            frequencia >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {frequencia >= 90 ? '✓ Excelente' : frequencia >= 75 ? '⚠ Atenção' : '✗ Crítico'}
          </p>
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
    <div className="grid grid-cols-12 gap-4">
      {/* Coluna principal - 8 colunas */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
        {/* Cards principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Resumo */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <GraduationCap className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">847</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Total de Alunos</p>
              </div>
              <div className="text-center">
                <BookOpen className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">28</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Turmas</p>
              </div>
              <div className="text-center">
                <Award className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">756</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Aprovados (previsão)</p>
              </div>
              <div className="text-center">
                <Users className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">42</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Professores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Desempenho por disciplina */}
          <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                Desempenho por Disciplina
              </CardTitle>
              <CardDescription className="text-xs">Média geral de cada disciplina</CardDescription>
            </CardHeader>
            <CardContent>
              <HorizontalBarChart />
            </CardContent>
          </Card>

          {/* Frequência */}
          <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
            <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border-b border-border">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Frequência Geral
              </CardTitle>
              <CardDescription className="text-xs">Taxa de presença dos alunos</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <FrequenciaGauge />
            </CardContent>
          </Card>
        </div>

        {/* Desempenho por turma */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/20 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Desempenho por Turma
            </CardTitle>
            <CardDescription className="text-xs">Comparativo entre turmas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Turma</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Alunos</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Média</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Freq.</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400 w-1/4">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDesempenhoTurmas.map((turma) => (
                    <tr key={turma.turma} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            turma.media >= 7.5 ? 'bg-emerald-500' : turma.media >= 6 ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium text-xs text-gray-900 dark:text-gray-100">{turma.turma}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{turma.alunos}</span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-xs font-semibold ${
                          turma.media >= 7 ? 'text-emerald-600 dark:text-emerald-400' : 
                          turma.media >= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {turma.media.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`text-xs font-semibold ${
                          turma.frequencia >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 
                          turma.frequencia >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {turma.frequencia}%
                        </span>
                      </td>
                      <td className="py-2 px-3">
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

        {/* Alunos em recuperação */}
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50">
          <CardHeader className="bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <ThumbsDown className="w-4 h-4 text-red-500" />
              Alunos em Recuperação
            </CardTitle>
            <CardDescription className="text-xs">Precisam de atenção especial</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockAlunosRecuperacao.map((aluno) => (
              <div 
                key={aluno.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30"
              >
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-gray-900 dark:text-gray-100 truncate">
                    {aluno.nome}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {aluno.turma} • {aluno.disciplinas} disciplina{aluno.disciplinas > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">
                    {aluno.media.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">média</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Coluna lateral - Top 25 Alunos - 4 colunas */}
      <div className="col-span-12 lg:col-span-4">
        <Card className="border border-border shadow-sm dark:shadow-gray-950/50 flex flex-col lg:sticky lg:top-4 lg:max-h-[90vh]">
          <CardHeader className="bg-gradient-to-r from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Medal className="w-4 h-4 text-amber-500" />
              Top 25 Alunos
            </CardTitle>
            <CardDescription className="text-xs">Melhores médias da escola</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-2">
            {mockAlunosDestaque.map((aluno, index) => {
              // Cores baseadas na posição
              const cardColors = aluno.posicao === 1 
                ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-400 dark:border-yellow-600/50'
                : aluno.posicao === 2 
                ? 'bg-gradient-to-r from-gray-100 to-slate-200 dark:from-gray-800/50 dark:to-slate-700/40 border-gray-400 dark:border-gray-500/50'
                : aluno.posicao === 3 
                ? 'bg-gradient-to-r from-orange-100 to-rose-100 dark:from-orange-900/30 dark:to-rose-900/20 border-orange-400 dark:border-orange-600/50'
                : aluno.posicao <= 5
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-700/50'
                : 'bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/20 dark:to-blue-950/20 border-slate-200 dark:border-slate-700/50'

              const mediaColor = aluno.posicao === 1 
                ? 'text-yellow-600 dark:text-yellow-400'
                : aluno.posicao === 2 
                ? 'text-gray-600 dark:text-gray-300'
                : aluno.posicao === 3 
                ? 'text-orange-600 dark:text-orange-400'
                : aluno.posicao <= 5
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-blue-600 dark:text-blue-400'

              const medalha = aluno.posicao === 1 ? '🥇' : aluno.posicao === 2 ? '🥈' : aluno.posicao === 3 ? '🥉' : null

              // Separadores entre seções
              const showDivider = aluno.posicao === 4 || aluno.posicao === 6 || aluno.posicao === 11
              const dividerLabel = aluno.posicao === 4 ? 'Top 5' : aluno.posicao === 6 ? 'Top 10' : aluno.posicao === 11 ? 'Top 25' : null

              return (
                <div key={aluno.id}>
                  {showDivider && (
                    <div className="flex items-center gap-2 py-2 mb-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{dividerLabel}</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                    </div>
                  )}
                  <div className={`flex items-center gap-3 p-2 rounded-lg border ${cardColors}`}>
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white
                      ${aluno.posicao === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' : 
                        aluno.posicao === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                        aluno.posicao === 3 ? 'bg-gradient-to-br from-orange-400 to-rose-500' :
                        aluno.posicao <= 5 ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
                        'bg-gradient-to-br from-blue-400 to-blue-500'}
                    `}>
                      {aluno.posicao}º
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs text-gray-900 dark:text-gray-100 truncate">
                        {aluno.nome}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        {aluno.turma}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${mediaColor} flex items-center justify-end gap-1`}>
                        {aluno.media.toFixed(1)}
                        {medalha && <span className="text-base">{medalha}</span>}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">média</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
          <div className="px-5 py-3 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Ver todos os alunos
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
