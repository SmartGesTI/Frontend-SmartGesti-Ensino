import { ListSkeleton } from '../skeletons'
import type { StudentRankingData, LoadableProps } from '@/types/dashboard'

interface StudentRankingListProps extends LoadableProps {
  students: StudentRankingData[]
  maxItems?: number
  showDividers?: boolean
}

function getPositionStyles(posicao: number) {
  const cardColors = posicao === 1 
    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-400 dark:border-yellow-600/50'
    : posicao === 2 
    ? 'bg-gradient-to-r from-gray-100 to-slate-200 dark:from-gray-800/50 dark:to-slate-700/40 border-gray-400 dark:border-gray-500/50'
    : posicao === 3 
    ? 'bg-gradient-to-r from-orange-100 to-rose-100 dark:from-orange-900/30 dark:to-rose-900/20 border-orange-400 dark:border-orange-600/50'
    : posicao <= 5
    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-700/50'
    : 'bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/20 dark:to-blue-950/20 border-slate-200 dark:border-slate-700/50'

  const mediaColor = posicao === 1 
    ? 'text-yellow-600 dark:text-yellow-400'
    : posicao === 2 
    ? 'text-gray-600 dark:text-gray-300'
    : posicao === 3 
    ? 'text-orange-600 dark:text-orange-400'
    : posicao <= 5
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-blue-600 dark:text-blue-400'

  const badgeColor = posicao === 1 
    ? 'bg-gradient-to-br from-yellow-400 to-amber-500'
    : posicao === 2 
    ? 'bg-gradient-to-br from-gray-400 to-gray-500'
    : posicao === 3 
    ? 'bg-gradient-to-br from-orange-400 to-rose-500'
    : posicao <= 5
    ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
    : 'bg-gradient-to-br from-blue-400 to-blue-500'

  const medalha = posicao === 1 ? '🥇' : posicao === 2 ? '🥈' : posicao === 3 ? '🥉' : null

  return { cardColors, mediaColor, badgeColor, medalha }
}

function getDividerLabel(posicao: number): string | null {
  if (posicao === 4) return 'Top 5'
  if (posicao === 6) return 'Top 10'
  if (posicao === 11) return 'Top 25'
  return null
}

export function StudentRankingList({ 
  students, 
  maxItems, 
  showDividers = true,
  isLoading = false 
}: StudentRankingListProps) {
  if (isLoading) {
    return <ListSkeleton variant="ranking" count={maxItems || 10} />
  }

  const displayStudents = maxItems ? students.slice(0, maxItems) : students

  return (
    <div className="space-y-2">
      {displayStudents.map((aluno) => {
        const { cardColors, mediaColor, badgeColor, medalha } = getPositionStyles(aluno.posicao)
        const dividerLabel = showDividers ? getDividerLabel(aluno.posicao) : null

        return (
          <div key={aluno.id}>
            {dividerLabel && (
              <div className="flex items-center gap-2 py-2 mb-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {dividerLabel}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
              </div>
            )}
            <div className={`flex items-center gap-3 p-2 rounded-lg border ${cardColors}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${badgeColor}`}>
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
    </div>
  )
}
