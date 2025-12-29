import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface CustomNavbarDropdownProps {
  isOpen: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLElement>
  children?: React.ReactNode
  content?: React.ReactNode
  width?: string | number
  maxWidth?: string
  maxHeight?: string
  position?: 'below' | 'center' | 'custom'
  className?: string
}

export function CustomNavbarDropdown({
  isOpen,
  onClose: _onClose,
  triggerRef,
  children,
  content,
  width = 'w-[60vw]',
  maxWidth = 'max-w-[90vw]',
  maxHeight = 'max-h-[70vh]',
  position = 'below',
  className
}: CustomNavbarDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [positionStyle, setPositionStyle] = useState<{ top: number; left?: number } | null>(null)

  // Controlar renderização e animação de entrada/saída - seguindo o padrão do UserDropdown
  // Importante: não incluir `isClosing` nas dependências, senão o timeout de fechamento é cancelado.
  useEffect(() => {
    if (isOpen) {
      // Calcular posição quando abre
      if (position === 'center') {
        const navbarHeight = 64 // h-16
        const margin = 16 // mt-4
        setPositionStyle({
          top: navbarHeight + margin
        })
      } else if (position === 'below' && triggerRef?.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setPositionStyle({
          top: rect.bottom + 8,
          left: rect.left
        })
      }

      setShouldRender(true)
      setIsClosing(false)
      return
    }

    if (shouldRender) {
      setIsClosing(true)
      const timeoutId = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
        setPositionStyle(null)
      }, 350) // Duração da animação de saída

      return () => clearTimeout(timeoutId)
    }
  }, [isOpen, shouldRender, triggerRef, position])

  // Atualizar posição em caso de scroll ou resize (apenas quando aberto)
  useEffect(() => {
    if (!isOpen || !shouldRender || isClosing || !triggerRef?.current) {
      return
    }

    const updatePosition = () => {
      if (!triggerRef.current) return
      
      if (position === 'center') {
        const navbarHeight = 64
        const margin = 16
        setPositionStyle({
          top: navbarHeight + margin
        })
      } else if (position === 'below') {
        const rect = triggerRef.current.getBoundingClientRect()
        setPositionStyle({
          top: rect.bottom + 8,
          left: rect.left
        })
      }
    }

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, shouldRender, isClosing, triggerRef, position])

  if (!shouldRender) return null

  const widthClass = typeof width === 'number' ? `w-[${width}px]` : width

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'fixed z-50',
        position === 'center' && 'left-1/2 -translate-x-1/2',
        position === 'custom' && '',
        widthClass,
        maxWidth,
        maxHeight,
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-700',
        'rounded-xl shadow-2xl',
        'overflow-hidden',
        isClosing ? 'animate-slide-up-smooth' : 'animate-slide-down-smooth',
        className
      )}
      style={
        position === 'center' && positionStyle
          ? {
              top: `${positionStyle.top}px`
            }
          : position === 'below' && positionStyle && positionStyle.left !== undefined
          ? {
              top: `${positionStyle.top}px`,
              left: `${positionStyle.left}px`
            }
          : undefined
      }
    >
      <div className={cn('p-6 space-y-6', maxHeight, 'overflow-y-auto')}>
        {children || content}
      </div>
    </div>
  )
}
