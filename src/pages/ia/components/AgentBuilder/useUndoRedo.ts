import { useState, useCallback, useRef } from 'react'
import { Node, Edge } from 'reactflow'

interface HistoryState {
  nodes: Node[]
  edges: Edge[]
}

interface UseUndoRedoOptions {
  maxHistory?: number
  debounceMs?: number
}

interface UseUndoRedoReturn {
  pushState: (nodes: Node[], edges: Edge[]) => void
  undo: () => HistoryState | null
  redo: () => HistoryState | null
  canUndo: boolean
  canRedo: boolean
  clear: () => void
  historyLength: number
  currentIndex: number
}

/**
 * Hook para gerenciar histórico de undo/redo para nodes e edges do React Flow
 */
export function useUndoRedo(options: UseUndoRedoOptions = {}): UseUndoRedoReturn {
  const { maxHistory = 50, debounceMs = 300 } = options

  // Usar refs para o histórico para evitar problemas de closure
  const historyRef = useRef<HistoryState[]>([])
  const currentIndexRef = useRef(-1)
  
  // Estado para triggerar re-renders quando necessário
  const [, forceUpdate] = useState(0)
  
  // Ref para debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  // Ref para armazenar o último estado pendente (para debounce)
  const pendingStateRef = useRef<HistoryState | null>(null)

  /**
   * Adiciona um novo estado ao histórico
   * Usa debounce para agrupar mudanças rápidas
   */
  const pushState = useCallback((nodes: Node[], edges: Edge[]) => {
    // Armazenar o estado pendente
    pendingStateRef.current = {
      nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
      edges: JSON.parse(JSON.stringify(edges)),
    }

    // Limpar timer anterior se existir
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Configurar novo timer
    debounceTimerRef.current = setTimeout(() => {
      const newState = pendingStateRef.current
      if (!newState) return

      // Usar refs diretamente para evitar stale closures
      const history = historyRef.current
      const currentIndex = currentIndexRef.current
      
      // Se estamos no meio do histórico, descartar estados futuros
      const newHistory = history.slice(0, currentIndex + 1)
      
      // Verificar se o novo estado é diferente do último
      const lastState = newHistory[newHistory.length - 1]
      if (lastState) {
        const nodesEqual = JSON.stringify(lastState.nodes) === JSON.stringify(newState.nodes)
        const edgesEqual = JSON.stringify(lastState.edges) === JSON.stringify(newState.edges)
        if (nodesEqual && edgesEqual) {
          pendingStateRef.current = null
          return // Não adicionar se for igual
        }
      }

      // Adicionar novo estado
      newHistory.push(newState)

      // Limitar tamanho do histórico
      if (newHistory.length > maxHistory) {
        newHistory.shift()
      }

      // Atualizar refs
      historyRef.current = newHistory
      currentIndexRef.current = newHistory.length - 1
      
      pendingStateRef.current = null
      
      // Triggerar re-render para atualizar canUndo/canRedo
      forceUpdate(n => n + 1)
    }, debounceMs)
  }, [maxHistory, debounceMs])

  /**
   * Desfaz a última alteração
   */
  const undo = useCallback((): HistoryState | null => {
    const currentIndex = currentIndexRef.current
    const history = historyRef.current
    
    if (currentIndex <= 0) return null

    const newIndex = currentIndex - 1
    currentIndexRef.current = newIndex
    
    // Triggerar re-render
    forceUpdate(n => n + 1)
    
    return history[newIndex] || null
  }, [])

  /**
   * Refaz a alteração desfeita
   */
  const redo = useCallback((): HistoryState | null => {
    const currentIndex = currentIndexRef.current
    const history = historyRef.current
    
    if (currentIndex >= history.length - 1) return null

    const newIndex = currentIndex + 1
    currentIndexRef.current = newIndex
    
    // Triggerar re-render
    forceUpdate(n => n + 1)
    
    return history[newIndex] || null
  }, [])

  /**
   * Limpa todo o histórico
   */
  const clear = useCallback(() => {
    historyRef.current = []
    currentIndexRef.current = -1
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    pendingStateRef.current = null
    forceUpdate(n => n + 1)
  }, [])

  return {
    pushState,
    undo,
    redo,
    canUndo: currentIndexRef.current > 0,
    canRedo: currentIndexRef.current < historyRef.current.length - 1,
    clear,
    historyLength: historyRef.current.length,
    currentIndex: currentIndexRef.current,
  }
}
