import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { ListSkeleton } from '../skeletons'
import type { PaymentData, PaymentStatus, LoadableProps } from '@/types/dashboard'

interface PaymentListProps extends LoadableProps {
  payments: PaymentData[]
  maxItems?: number
}

const statusConfig: Record<PaymentStatus, { icon: typeof CheckCircle; iconBg: string; text: string; card: string }> = {
  pago: { 
    icon: CheckCircle, 
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', 
    text: 'text-emerald-600 dark:text-emerald-400',
    card: 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-emerald-400 dark:from-gray-800/50 dark:to-gray-800/50 dark:border-l-0'
  },
  parcial: { 
    icon: Clock, 
    iconBg: 'bg-amber-100 dark:bg-amber-900/30', 
    text: 'text-amber-600 dark:text-amber-400',
    card: 'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-400 dark:from-gray-800/50 dark:to-gray-800/50 dark:border-l-0'
  },
  pendente: { 
    icon: Clock, 
    iconBg: 'bg-gray-100 dark:bg-gray-800', 
    text: 'text-gray-600 dark:text-gray-400',
    card: 'bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400 dark:from-gray-800/50 dark:to-gray-800/50 dark:border-l-0'
  },
  atrasado: { 
    icon: AlertCircle, 
    iconBg: 'bg-red-100 dark:bg-red-900/30', 
    text: 'text-red-600 dark:text-red-400',
    card: 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 dark:from-gray-800/50 dark:to-gray-800/50 dark:border-l-0'
  },
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
            className={`flex items-center justify-between p-2 rounded-lg ${config.card}`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.iconBg}`}>
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
