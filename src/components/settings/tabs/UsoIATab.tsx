import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles,
  MessageCircle,
  Wand2,
  Bot,
  TrendingUp,
  Calendar,
  School,
  Zap,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dados mockados de uso de IA
const mockUsageData = {
  currentMonth: {
    used: 3500,
    total: 10000,
    percentage: 35,
  },
  lastMonth: {
    used: 4200,
    total: 10000,
  },
  trend: -16.7, // percentual de variação
}

const mockUsageByFeature = [
  { name: 'Assistente', icon: MessageCircle, color: 'text-purple-500', used: 1800, percentage: 51 },
  { name: 'Relatório Inteligente', icon: Wand2, color: 'text-blue-500', used: 1200, percentage: 34 },
  { name: 'Agentes IA', icon: Bot, color: 'text-emerald-500', used: 500, percentage: 15 },
]

const mockUsageBySchool = [
  { name: 'Unidade Centro', used: 1500, percentage: 43 },
  { name: 'Unidade Norte', used: 1200, percentage: 34 },
  { name: 'Unidade Sul', used: 800, percentage: 23 },
]

const mockRecentInteractions = [
  { id: '1', type: 'assistant', query: 'Como melhorar o engajamento dos alunos?', school: 'Unidade Centro', credits: 15, timestamp: '2024-12-28T14:30:00' },
  { id: '2', type: 'report', query: 'Relatório de desempenho do 3º bimestre', school: 'Unidade Norte', credits: 45, timestamp: '2024-12-28T13:15:00' },
  { id: '3', type: 'assistant', query: 'Sugestões para reunião de pais', school: 'Unidade Centro', credits: 12, timestamp: '2024-12-28T11:45:00' },
  { id: '4', type: 'agent', query: 'Agente de atendimento ao aluno', school: 'Unidade Sul', credits: 30, timestamp: '2024-12-28T10:00:00' },
  { id: '5', type: 'report', query: 'Análise de frequência mensal', school: 'Unidade Centro', credits: 38, timestamp: '2024-12-27T16:30:00' },
]

const typeIcons: Record<string, typeof MessageCircle> = {
  assistant: MessageCircle,
  report: Wand2,
  agent: Bot,
}

const typeLabels: Record<string, string> = {
  assistant: 'Assistente',
  report: 'Relatório',
  agent: 'Agente',
}

const typeColors: Record<string, string> = {
  assistant: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
  report: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  agent: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
}

export function UsoIATab() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Uso Atual */}
        <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Créditos IA (Este Mês)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{mockUsageData.currentMonth.used.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/ {mockUsageData.currentMonth.total.toLocaleString()}</span>
            </div>
            <Progress value={mockUsageData.currentMonth.percentage} className="h-2 mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {mockUsageData.currentMonth.percentage}% utilizado
            </p>
          </CardContent>
        </Card>

        {/* Tendência */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Comparado ao Mês Anterior
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={cn(
                'text-3xl font-bold',
                mockUsageData.trend < 0 ? 'text-emerald-500' : 'text-amber-500'
              )}>
                {mockUsageData.trend > 0 ? '+' : ''}{mockUsageData.trend}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {mockUsageData.lastMonth.used.toLocaleString()} créditos usados em Nov
            </p>
          </CardContent>
        </Card>

        {/* Próxima Renovação */}
        <Card className="border-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" />
              Renovação de Créditos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">15</span>
              <span className="text-sm text-muted-foreground">de Janeiro</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Créditos renovados automaticamente
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Uso por Funcionalidade */}
        <Card className="border-2 border-border">
          <CardHeader className="bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/30 dark:to-transparent border-b border-border">
            <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Zap className="h-4 w-4" />
              Uso por Funcionalidade
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Distribuição de créditos entre recursos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUsageByFeature.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={cn('h-4 w-4', feature.color)} />
                      <span className="font-medium text-sm">{feature.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature.used.toLocaleString()} créditos ({feature.percentage}%)
                    </span>
                  </div>
                  <Progress value={feature.percentage} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Uso por Escola */}
        <Card className="border-2 border-border">
          <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
            <CardTitle className="text-base flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <School className="h-4 w-4" />
              Uso por Escola
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Consumo de créditos por unidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUsageBySchool.map((school) => (
              <div key={school.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{school.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {school.used.toLocaleString()} créditos ({school.percentage}%)
                  </span>
                </div>
                <Progress value={school.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Interações Recentes */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-950/30 dark:to-transparent border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                Interações Recentes
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Últimas consultas ao EducaIA</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
              Ver Histórico Completo
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRecentInteractions.map((interaction) => {
              const Icon = typeIcons[interaction.type]
              const iconColor = typeColors[interaction.type]
              
              return (
                <div
                  key={interaction.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', iconColor)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{interaction.query}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {typeLabels[interaction.type]}
                      </Badge>
                      <span>{interaction.school}</span>
                      <span>•</span>
                      <span>{formatDate(interaction.timestamp)}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {interaction.credits} créditos
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dicas de Otimização */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/30 to-transparent dark:from-blue-950/10">
        <CardHeader className="border-b border-blue-100 dark:border-blue-900">
          <CardTitle className="text-base flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Sparkles className="h-4 w-4" />
            Dicas para Otimizar seu Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              Use prompts claros e específicos para obter respostas mais precisas com menos créditos.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              Agrupe consultas similares para evitar repetições desnecessárias.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              Utilize os relatórios salvos para referência futura sem consumir novos créditos.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
