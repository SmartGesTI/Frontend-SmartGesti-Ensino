import { RelatorioTipo } from './mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'

interface RelatorioPreviewProps {
  tipo: RelatorioTipo
  values: Record<string, any>
}

export function RelatorioPreview({ tipo, values }: RelatorioPreviewProps) {
  const Icon = tipo.icon

  const getPreviewData = () => {
    switch (tipo.id) {
      case 'academico':
        return {
          totalAlunos: 245,
          mediaGeral: 7.8,
          aprovados: 198,
          reprovados: 47,
          taxaAprovacao: 80.8,
        }
      case 'financeiro':
        return {
          receitas: 125000,
          despesas: 98000,
          saldo: 27000,
          crescimento: 12.5,
        }
      case 'matriculas':
        return {
          novas: 45,
          rematriculas: 200,
          total: 245,
          crescimento: 8.2,
        }
      case 'frequencia':
        return {
          mediaFrequencia: 92.5,
          alunosRegulares: 220,
          alunosIrregulares: 25,
        }
      default:
        return {}
    }
  }

  const data = getPreviewData()

  return (
    <Card className="shadow-2xl border-2 border-border bg-card">
      <CardHeader className="bg-gradient-to-b from-cyan-50/50 to-transparent dark:from-cyan-950/30 dark:to-transparent">
        <CardTitle className="text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
          <Icon className="w-5 h-5" />
          Preview do Relatório
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {tipo.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{tipo.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {tipo.id === 'academico' && (
              <>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Total de Alunos
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.totalAlunos}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Média Geral
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.mediaGeral}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Taxa de Aprovação
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.taxaAprovacao}%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Período
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {values.periodo || '2024.1'}
                  </p>
                </div>
              </>
            )}

            {tipo.id === 'financeiro' && (
              <>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Receitas
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    R$ {(data.receitas ?? 0).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      Despesas
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    R$ {(data.despesas ?? 0).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Saldo
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    R$ {(data.saldo ?? 0).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Crescimento
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    +{data.crescimento}%
                  </p>
                </div>
              </>
            )}

            {tipo.id === 'matriculas' && (
              <>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Novas Matrículas
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.novas}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Rematrículas
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.rematriculas}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Total
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.total}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Crescimento
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    +{data.crescimento}%
                  </p>
                </div>
              </>
            )}

            {tipo.id === 'frequencia' && (
              <>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Média de Frequência
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.mediaFrequencia}%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Alunos Regulares
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.alunosRegulares}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      Alunos Irregulares
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.alunosIrregulares}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
