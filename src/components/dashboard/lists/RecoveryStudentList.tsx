import { AlertTriangle } from 'lucide-react'
import { ListSkeleton } from '../skeletons'
import type { StudentRecoveryData, LoadableProps } from '@/types/dashboard'

interface RecoveryStudentListProps extends LoadableProps {
  students: StudentRecoveryData[]
  maxItems?: number
}

export function RecoveryStudentList({ students, maxItems, isLoading = false }: RecoveryStudentListProps) {
  if (isLoading) {
    return <ListSkeleton variant="debtor" count={maxItems || 4} />
  }

  const displayStudents = maxItems ? students.slice(0, maxItems) : students

  return (
    <div className="space-y-2">
      {displayStudents.map((aluno) => (
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
    </div>
  )
}
