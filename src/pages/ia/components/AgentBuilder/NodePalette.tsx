import { useState } from 'react'
import { Search } from 'lucide-react'
import { availableNodesV1 } from '../nodeCatalog.v1'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface NodePaletteProps {
  onNodeDragStart: (event: React.DragEvent, nodeType: string) => void
}

export function NodePalette({ onNodeDragStart }: NodePaletteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['ENTRADA', 'AGENTES', 'AGENTES DE RH', 'SAIDA'])

  const categories: Array<{ id: string; label: string; nodes: typeof availableNodesV1 }> = [
    {
      id: 'ENTRADA',
      label: 'ENTRADA',
      nodes: availableNodesV1.filter((n) => n.category === 'ENTRADA'),
    },
    {
      id: 'AGENTES',
      label: 'AGENTES',
      nodes: availableNodesV1.filter((n) => n.category === 'AGENTES'),
    },
    {
      id: 'AGENTES DE RH',
      label: 'AGENTES DE RH',
      nodes: availableNodesV1.filter((n) => n.category === 'AGENTES DE RH'),
    },
    {
      id: 'SAIDA',
      label: 'SAÍDA',
      nodes: availableNodesV1.filter((n) => n.category === 'SAIDA'),
    },
  ]

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    )
  }

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    nodes: cat.nodes.filter((node) =>
      node.data.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }))

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Componentes</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Arraste e solte para criar seu fluxo</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id)
          const hasNodes = category.nodes.length > 0

          if (!hasNodes && searchTerm) return null

          return (
            <div key={category.id} className="mb-4">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <span>{category.label}</span>
                <span className={cn('transition-transform', isExpanded && 'rotate-180')}>▼</span>
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-1">
                  {category.nodes.map((node) => {
                    const Icon = node.data.icon
                    const colorClasses: Record<string, { bg: string; text: string }> = {
                      blue: {
                        bg: 'bg-blue-100 dark:bg-blue-900/30',
                        text: 'text-blue-600 dark:text-blue-400',
                      },
                      purple: {
                        bg: 'bg-purple-100 dark:bg-purple-900/30',
                        text: 'text-purple-600 dark:text-purple-400',
                      },
                      amber: {
                        bg: 'bg-amber-100 dark:bg-amber-900/30',
                        text: 'text-amber-600 dark:text-amber-400',
                      },
                      emerald: {
                        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
                        text: 'text-emerald-600 dark:text-emerald-400',
                      },
                    }
                    const colorClass = colorClasses[node.data.color] || colorClasses.blue

                    return (
                      <div
                        key={node.id}
                        draggable
                        onDragStart={(e) => onNodeDragStart(e, node.id)}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing',
                          'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
                          'border border-gray-200 dark:border-gray-700',
                          'transition-all hover:shadow-md'
                        )}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                            colorClass.bg,
                            colorClass.text
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{node.data.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                            {node.data.description}
                          </p>
                        </div>
                      </div>
                    )}
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
