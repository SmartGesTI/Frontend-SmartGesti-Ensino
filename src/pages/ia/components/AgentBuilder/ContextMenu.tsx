import { useEffect, useRef } from 'react'
import { Settings, Trash2, Edit, Copy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ContextMenuProps {
  x: number
  y: number
  nodeId?: string
  edgeId?: string
  onClose: () => void
  onDelete?: () => void
  onConfigure?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
}

export function ContextMenu({
  x,
  y,
  nodeId,
  edgeId,
  onClose,
  onDelete,
  onConfigure,
  onEdit,
  onDuplicate,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleAction = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <div
      ref={menuRef}
      data-context-menu
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl min-w-[180px] py-1"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {nodeId && (
        <>
          {onConfigure && (
            <button
              onClick={() => handleAction(onConfigure)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Configurar
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => handleAction(onEdit)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={() => handleAction(onDuplicate)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Duplicar
            </button>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          {onDelete && (
            <button
              onClick={() => handleAction(onDelete)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          )}
        </>
      )}
      {edgeId && (
        <>
          {onDelete && (
            <button
              onClick={() => handleAction(onDelete)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remover Conexão
            </button>
          )}
        </>
      )}
    </div>
  )
}
