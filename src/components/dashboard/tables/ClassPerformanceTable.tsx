import { ProgressBar } from '../charts'
import { TableSkeleton } from '../skeletons'
import type { ClassPerformanceData, LoadableProps } from '@/types/dashboard'

interface ClassPerformanceTableProps extends LoadableProps {
  classes: ClassPerformanceData[]
}

export function ClassPerformanceTable({ classes, isLoading = false }: ClassPerformanceTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={6} columns={5} />
  }

  return (
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
          {classes.map((turma) => {
            const mediaColor = turma.media >= 7 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : turma.media >= 5 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-red-600 dark:text-red-400'

            const freqColor = turma.frequencia >= 90 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : turma.frequencia >= 75 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-red-600 dark:text-red-400'

            const dotColor = turma.media >= 7.5 
              ? 'bg-emerald-500' 
              : turma.media >= 6 
              ? 'bg-amber-500' 
              : 'bg-red-500'

            const barColor = turma.media >= 7 
              ? 'bg-emerald-500' 
              : turma.media >= 5 
              ? 'bg-amber-500' 
              : 'bg-red-500'

            return (
              <tr key={turma.turma} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <span className="font-medium text-xs text-gray-900 dark:text-gray-100">{turma.turma}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">{turma.alunos}</span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className={`text-xs font-semibold ${mediaColor}`}>
                    {turma.media.toFixed(1)}
                  </span>
                </td>
                <td className="py-2 px-3 text-center">
                  <span className={`text-xs font-semibold ${freqColor}`}>
                    {turma.frequencia}%
                  </span>
                </td>
                <td className="py-2 px-3">
                  <ProgressBar 
                    value={turma.media} 
                    max={10}
                    color={barColor}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
