import { Users } from 'lucide-react'
import { ListSkeleton } from '../skeletons'
import type { DebtorData, LoadableProps } from '@/types/dashboard'

interface DebtorListProps extends LoadableProps {
  debtors: DebtorData[]
  maxItems?: number
}

export function DebtorList({ debtors, maxItems, isLoading = false }: DebtorListProps) {
  if (isLoading) {
    return <ListSkeleton variant="debtor" count={maxItems || 4} />
  }

  const displayDebtors = maxItems ? debtors.slice(0, maxItems) : debtors

  return (
    <div className="space-y-2">
      {displayDebtors.map((inadimplente) => (
        <div 
          key={inadimplente.id}
          className="flex items-center justify-between p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                {inadimplente.aluno}
              </p>
              <p className="text-[10px] text-red-600 dark:text-red-400">
                {inadimplente.meses} {inadimplente.meses === 1 ? 'mês' : 'meses'} em atraso
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm text-red-600 dark:text-red-400">
              R$ {inadimplente.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              débito total
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
