import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  Users,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Clock,
  Filter,
  FileSpreadsheet,
  FilePieChart,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dados mockados de relatórios disponíveis
const mockReports = [
  {
    id: '1',
    name: 'Relatório Financeiro',
    description: 'Receitas, despesas e balanço consolidado de todas as escolas',
    icon: DollarSign,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
    category: 'Financeiro',
    formats: ['PDF', 'Excel'],
    lastGenerated: '2024-12-27T10:30:00',
  },
  {
    id: '2',
    name: 'Relatório de Matrículas',
    description: 'Quantidade de alunos matriculados por escola, turma e período',
    icon: Users,
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    category: 'Acadêmico',
    formats: ['PDF', 'Excel'],
    lastGenerated: '2024-12-26T14:15:00',
  },
  {
    id: '3',
    name: 'Relatório de Desempenho',
    description: 'Notas, frequência e evolução acadêmica dos alunos',
    icon: GraduationCap,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    category: 'Acadêmico',
    formats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2024-12-25T09:00:00',
  },
  {
    id: '4',
    name: 'Relatório de Frequência',
    description: 'Presença e ausência de alunos por turma e período',
    icon: Calendar,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    category: 'Acadêmico',
    formats: ['PDF', 'Excel'],
    lastGenerated: '2024-12-24T16:45:00',
  },
  {
    id: '5',
    name: 'Relatório de Crescimento',
    description: 'Análise de crescimento da instituição ao longo do tempo',
    icon: TrendingUp,
    color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
    category: 'Gerencial',
    formats: ['PDF'],
    lastGenerated: '2024-12-20T11:30:00',
  },
  {
    id: '6',
    name: 'Relatório de Usuários',
    description: 'Lista de usuários ativos, cargos e permissões',
    icon: Users,
    color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20',
    category: 'Administrativo',
    formats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2024-12-18T08:00:00',
  },
]

const mockRecentReports = [
  { id: '1', name: 'Relatório Financeiro - Dezembro 2024', format: 'PDF', generatedAt: '2024-12-27T10:30:00', size: '2.4 MB' },
  { id: '2', name: 'Matrículas - 4º Bimestre', format: 'Excel', generatedAt: '2024-12-26T14:15:00', size: '1.8 MB' },
  { id: '3', name: 'Desempenho Acadêmico - Nov 2024', format: 'PDF', generatedAt: '2024-12-25T09:00:00', size: '3.2 MB' },
  { id: '4', name: 'Frequência Mensal - Dezembro', format: 'Excel', generatedAt: '2024-12-24T16:45:00', size: '890 KB' },
]

const categoryColors: Record<string, string> = {
  Financeiro: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Acadêmico: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Gerencial: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Administrativo: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
}

export function RelatoriosTab() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Excel':
      case 'CSV':
        return FileSpreadsheet
      default:
        return FileText
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <BarChart3 className="h-5 w-5" />
                Relatórios Consolidados
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600 dark:text-gray-400">
                Gere e exporte relatórios de todas as escolas da instituição
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400">
                <Calendar className="h-4 w-4 mr-2" />
                Período
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Relatórios Disponíveis */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockReports.map((report) => {
          const Icon = report.icon
          return (
            <Card key={report.id} className="group border-2 border-border hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', report.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge className={categoryColors[report.category]}>
                    {report.category}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-3">{report.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Último: {formatDate(report.lastGenerated)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.formats.map((format) => (
                    <Button 
                      key={format} 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        'flex-1 border-gray-300 dark:border-gray-600',
                        format === 'PDF' 
                          ? 'hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400'
                          : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400'
                      )}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      {format}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Relatórios Gerados Recentemente */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-950/30 dark:to-transparent border-b border-border">
          <CardTitle className="text-base flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Clock className="h-4 w-4" />
            Relatórios Gerados Recentemente
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Seus últimos relatórios exportados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRecentReports.map((report) => {
              const FormatIcon = getFormatIcon(report.format)
              return (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <FormatIcon className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {report.format}
                        </Badge>
                        <span>{formatDate(report.generatedAt)}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Relatório Personalizado */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/30 to-transparent dark:from-blue-950/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <FilePieChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Relatório Personalizado</CardTitle>
              <CardDescription>
                Crie um relatório com os dados e filtros que você precisa
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/20">
              Criar Relatório Personalizado
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
              Ver Modelos Salvos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agendamento */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/30 dark:to-transparent border-b border-border">
          <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Calendar className="h-4 w-4" />
            Relatórios Agendados
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure relatórios para serem gerados automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="mb-3">Nenhum relatório agendado</p>
            <Button variant="outline" size="sm" className="border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20">
              Agendar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
