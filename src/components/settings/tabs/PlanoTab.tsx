import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CreditCard,
  Zap,
  Users,
  School,
  Sparkles,
  Calendar,
  CheckCircle2,
  XCircle,
  Crown,
  ArrowUpRight,
  Receipt,
  Download,
  FileText,
  BarChart3,
  Shield,
  Cloud,
  Headphones,
  Code,
  Bell,
  Lock,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dados mockados do plano
const mockPlan = {
  name: 'Profissional',
  price: 299.90,
  billingCycle: 'mensal',
  nextBilling: '2025-01-15',
  status: 'active',
  limits: {
    schools: { used: 2, total: 5 },
    users: { used: 45, total: 100 },
    students: { used: 850, total: 2000 },
    aiCredits: { used: 3500, total: 10000 },
  },
}

const mockPaymentHistory = [
  { id: '1', date: '2024-12-15', amount: 299.90, status: 'paid', invoice: 'INV-2024-012' },
  { id: '2', date: '2024-11-15', amount: 299.90, status: 'paid', invoice: 'INV-2024-011' },
  { id: '3', date: '2024-10-15', amount: 299.90, status: 'paid', invoice: 'INV-2024-010' },
]

const availablePlans = [
  { 
    name: 'Básico', 
    price: 99.90,
    description: 'Ideal para pequenas escolas',
    schools: 'Até 2 escolas',
    users: 'Até 20 usuários',
    students: 'Até 500 alunos',
    extras: ['Relatórios básicos', 'Suporte por email'],
  },
  { 
    name: 'Profissional', 
    price: 299.90, 
    current: true,
    description: 'Para instituições em crescimento',
    schools: 'Até 5 escolas',
    users: 'Até 100 usuários',
    students: 'Até 2.000 alunos',
    extras: ['Tudo do Básico', '10.000 créditos IA/mês', 'Relatórios avançados', 'Suporte prioritário', 'Backup diário', 'API de integração'],
  },
  { 
    name: 'Enterprise', 
    price: 599.90,
    description: 'Solução completa para grandes redes',
    schools: 'Escolas ilimitadas',
    users: 'Usuários ilimitados',
    students: 'Alunos ilimitados',
    extras: ['Tudo do Profissional', 'Créditos IA ilimitados', 'Suporte dedicado 24/7', 'Backup em tempo real', 'SSO', 'Logs de auditoria', 'SLA 99.9%'],
  },
]

// Recursos únicos (não substitutivos) - planos são CUMULATIVOS
const allFeatures = [
  // Básico - recursos base
  { id: 'escolas', name: 'Gestão de Escolas', icon: School, minPlan: 'Básico', color: 'text-blue-500' },
  { id: 'usuarios', name: 'Gestão de Usuários', icon: Users, minPlan: 'Básico', color: 'text-purple-500' },
  { id: 'alunos', name: 'Gestão de Alunos', icon: GraduationCap, minPlan: 'Básico', color: 'text-emerald-500' },
  { id: 'relatorios_basicos', name: 'Relatórios Básicos', icon: FileText, minPlan: 'Básico', color: 'text-amber-500' },
  { id: 'suporte_email', name: 'Suporte por Email', icon: Headphones, minPlan: 'Básico', color: 'text-cyan-500' },
  // Profissional - recursos adicionais
  { id: 'creditos_ia', name: 'Créditos IA (10k/mês)', icon: Sparkles, minPlan: 'Profissional', color: 'text-violet-500' },
  { id: 'relatorios_avancados', name: 'Relatórios Avançados', icon: BarChart3, minPlan: 'Profissional', color: 'text-amber-500' },
  { id: 'suporte_prioritario', name: 'Suporte Prioritário', icon: Headphones, minPlan: 'Profissional', color: 'text-cyan-500' },
  { id: 'backup_diario', name: 'Backup Diário', icon: Cloud, minPlan: 'Profissional', color: 'text-sky-500' },
  { id: 'api_integracao', name: 'API de Integração', icon: Code, minPlan: 'Profissional', color: 'text-orange-500' },
  // Enterprise - recursos exclusivos
  { id: 'creditos_ia_ilimitado', name: 'Créditos IA Ilimitados', icon: Sparkles, minPlan: 'Enterprise', color: 'text-violet-500' },
  { id: 'suporte_dedicado', name: 'Suporte Dedicado 24/7', icon: Headphones, minPlan: 'Enterprise', color: 'text-cyan-500' },
  { id: 'backup_tempo_real', name: 'Backup em Tempo Real', icon: Cloud, minPlan: 'Enterprise', color: 'text-sky-500' },
  { id: 'sso', name: 'Single Sign-On (SSO)', icon: Lock, minPlan: 'Enterprise', color: 'text-red-500' },
  { id: 'auditoria', name: 'Logs de Auditoria', icon: Shield, minPlan: 'Enterprise', color: 'text-indigo-500' },
  { id: 'sla', name: 'SLA Garantido 99.9%', icon: Bell, minPlan: 'Enterprise', color: 'text-pink-500' },
]

// Ordem dos planos para comparação
const planOrder = { 'Básico': 1, 'Profissional': 2, 'Enterprise': 3 }
const currentPlanName = 'Profissional'
const currentPlanOrder = planOrder[currentPlanName]

export function PlanoTab() {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100)
  }

  // Verificar se recurso está disponível no plano atual (CUMULATIVO)
  const isFeatureEnabled = (minPlan: string) => {
    const featurePlanOrder = planOrder[minPlan as keyof typeof planOrder]
    return featurePlanOrder <= currentPlanOrder
  }

  // Ordenar features: primeiro habilitados, depois por plano
  const sortedFeatures = [...allFeatures].sort((a, b) => {
    const aEnabled = isFeatureEnabled(a.minPlan)
    const bEnabled = isFeatureEnabled(b.minPlan)
    if (aEnabled && !bEnabled) return -1
    if (!aEnabled && bEnabled) return 1
    return planOrder[a.minPlan as keyof typeof planOrder] - planOrder[b.minPlan as keyof typeof planOrder]
  })

  // Dados para o gráfico de uso
  const usageData = [
    { name: 'Escolas', used: mockPlan.limits.schools.used, total: mockPlan.limits.schools.total, color: '#3b82f6', icon: School },
    { name: 'Usuários', used: mockPlan.limits.users.used, total: mockPlan.limits.users.total, color: '#8b5cf6', icon: Users },
    { name: 'Alunos', used: mockPlan.limits.students.used, total: mockPlan.limits.students.total, color: '#10b981', icon: GraduationCap },
    { name: 'Créditos IA', used: mockPlan.limits.aiCredits.used, total: mockPlan.limits.aiCredits.total, color: '#f59e0b', icon: Sparkles },
  ]

  const enabledCount = allFeatures.filter(f => isFeatureEnabled(f.minPlan)).length

  return (
    <div className="space-y-6">
      {/* Plano Atual */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">{mockPlan.name}</CardTitle>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                    Ativo
                  </Badge>
                </div>
                <CardDescription className="mt-1">
                  {formatCurrency(mockPlan.price)}/{mockPlan.billingCycle}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Próxima cobrança</p>
              <p className="font-semibold flex items-center gap-1 justify-end">
                <Calendar className="h-4 w-4" />
                {formatDate(mockPlan.nextBilling)}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grid Principal: Planos + Lista de Recursos */}
      <div className="grid grid-cols-12 gap-6">
        {/* Planos Disponíveis - Ocupa mais espaço */}
        <div className="col-span-12 xl:col-span-8">
          <Card className="border-2 border-border">
            <CardHeader className="bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/30 dark:to-transparent border-b border-border">
              <CardTitle className="text-base flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <ArrowUpRight className="h-4 w-4" />
                Planos Disponíveis
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Compare e faça upgrade do seu plano</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                {availablePlans.map((plan) => (
                  <div
                    key={plan.name}
                    className={cn(
                      'rounded-xl border-2 p-6 transition-all relative overflow-hidden flex flex-col',
                      plan.current
                        ? 'border-blue-500 bg-gradient-to-b from-blue-50/80 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 shadow-lg shadow-blue-500/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md'
                    )}
                  >
                    {plan.current && (
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-3 py-1 rounded-bl-lg font-semibold">
                        ATUAL
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <div className={cn(
                        'h-12 w-12 mx-auto rounded-xl flex items-center justify-center mb-3',
                        plan.current 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : plan.name === 'Enterprise' 
                            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      )}>
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-xl">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                      <p className="text-3xl font-bold mt-3">
                        {formatCurrency(plan.price)}
                        <span className="text-sm font-normal text-muted-foreground">/mês</span>
                      </p>
                    </div>

                    <div className="flex-1 space-y-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4 text-blue-500" />
                        <span>{plan.schools}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span>{plan.users}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-emerald-500" />
                        <span>{plan.students}</span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                        {plan.extras.slice(0, 4).map((extra, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground py-0.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span>{extra}</span>
                          </div>
                        ))}
                        {plan.extras.length > 4 && (
                          <p className="text-xs text-muted-foreground mt-1">+{plan.extras.length - 4} mais recursos</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {plan.current ? (
                        <Badge className="w-full justify-center py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Plano Atual
                        </Badge>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-gray-300 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400"
                        >
                          {plan.name === 'Básico' ? 'Fazer Downgrade' : 'Fazer Upgrade'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Recursos - Lateral */}
        <div className="col-span-12 xl:col-span-4">
          <Card className="border-2 border-border h-full flex flex-col">
            <CardHeader className="bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/30 dark:to-transparent border-b border-border">
              <CardTitle className="text-base flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Recursos Disponíveis
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {enabledCount} de {allFeatures.length} recursos ativos
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="h-[520px] overflow-y-auto p-4 space-y-2">
                {sortedFeatures.map((feature, index) => {
                  const isEnabled = isFeatureEnabled(feature.minPlan)
                  const Icon = feature.icon
                  
                  // Divisor para separar habilitados de desabilitados
                  const showDivider = index > 0 && 
                    isFeatureEnabled(sortedFeatures[index - 1].minPlan) && 
                    !isEnabled

                  return (
                    <div key={feature.id}>
                      {showDivider && (
                        <div className="flex items-center gap-2 py-3 mb-2">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                          <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">
                            Disponível no Enterprise
                          </span>
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                        </div>
                      )}
                      <div className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border transition-all',
                        isEnabled
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-700/50'
                          : 'bg-gray-50/50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700/50 opacity-60'
                      )}>
                        <div className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center text-white',
                          isEnabled
                            ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'font-medium text-sm truncate',
                            isEnabled ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                          )}>
                            {feature.name}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">
                            A partir do {feature.minPlan}
                          </p>
                        </div>
                        {isEnabled ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cards inferiores: Uso de Recursos + Histórico */}
      <div className="grid grid-cols-12 gap-6">
        {/* Uso de Recursos - Visual melhorado */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="border-2 border-border">
            <CardHeader className="bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/30 dark:to-transparent border-b border-border">
              <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Zap className="h-4 w-4" />
                Uso de Recursos
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Consumo atual do seu plano</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                {usageData.map((item) => {
                  const Icon = item.icon
                  const percentage = getUsagePercentage(item.used, item.total)
                  const isHigh = percentage > 80
                  const isMedium = percentage > 50 && percentage <= 80
                  
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-8 w-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <Icon className="h-4 w-4" style={{ color: item.color }} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.used.toLocaleString()} de {item.total.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            'text-lg font-bold',
                            isHigh ? 'text-red-500' : isMedium ? 'text-amber-500' : 'text-emerald-500'
                          )}>
                            {percentage}%
                          </p>
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={cn(
                          'h-2',
                          isHigh && '[&>div]:bg-red-500',
                          isMedium && '[&>div]:bg-amber-500',
                          !isHigh && !isMedium && '[&>div]:bg-emerald-500'
                        )}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Pagamentos */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="border-2 border-border h-full">
            <CardHeader className="bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-950/30 dark:to-transparent border-b border-border">
              <CardTitle className="text-base flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Receipt className="h-4 w-4" />
                Histórico de Pagamentos
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Últimas faturas</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {mockPaymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{payment.invoice}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                        Pago
                      </Badge>
                      <span className="font-semibold text-sm">{formatCurrency(payment.amount)}</span>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
