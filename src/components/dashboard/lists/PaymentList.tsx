import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { ListSkeleton } from '../skeletons'
import type { PaymentData, PaymentStatus, LoadableProps } from '@/types/dashboard'

interface PaymentListProps extends LoadableProps {
  payments: PaymentData[]
  maxItems?: number
}

const statusConfig: Record<PaymentStatus, { icon: typeof CheckCircle; bg: string; text: string }> = {
  pago: { icon: CheckCircle, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  parcial: { icon: Clock, bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  pendente: { icon: Clock, bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
  atrasado: { icon: AlertCircle, bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
}

export function PaymentList({ payments, maxItems, isLoading = false }: PaymentListProps) {
  if (isLoading) {
    return <ListSkeleton variant="payment" count={maxItems || 5} />
  }

  const displayPayments = maxItems ? payments.slice(0, maxItems) : payments

  return (
    <div className="space-y-2">
      {displayPayments.map((pagamento) => {
        const config = statusConfig[pagamento.status]
        const Icon = config.icon
        
        return (
          <div 
            key={pagamento.id}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.text}`} />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-xs truncate max-w-[120px]">
                  {pagamento.aluno}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {pagamento.data}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                R$ {pagamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-[10px] capitalize ${config.text}`}>
                {pagamento.status}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
