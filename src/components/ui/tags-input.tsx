import * as React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from './input'

export interface Tag {
  id?: string
  name: string
  slug?: string
  color?: string
}

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: Tag[]
  onSearch?: (search: string) => void
  onCreateTag?: (name: string) => Promise<Tag | void>
  isLoading?: boolean
  placeholder?: string
  maxTags?: number
  disabled?: boolean
  className?: string
  tagClassName?: string
  colors?: Record<string, string>
}

const defaultColors: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

export function TagsInput({
  value,
  onChange,
  suggestions = [],
  onSearch,
  onCreateTag,
  isLoading = false,
  placeholder = 'Adicionar tag...',
  maxTags,
  disabled = false,
  className,
  tagClassName,
  colors = defaultColors,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce search
  useEffect(() => {
    if (!onSearch) return
    
    const timer = setTimeout(() => {
      onSearch(inputValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, onSearch])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtrar sugestões que ainda não foram adicionadas
  const filteredSuggestions = suggestions.filter(
    (tag) => !value.includes(tag.name.toLowerCase())
  )

  const addTag = useCallback(async (tagName: string) => {
    const normalizedTag = tagName.trim().toLowerCase()
    
    if (!normalizedTag) return
    if (value.includes(normalizedTag)) return
    if (maxTags && value.length >= maxTags) return

    // Se a tag não existe nas sugestões e temos callback de criação
    const existingTag = suggestions.find(
      (t) => t.name.toLowerCase() === normalizedTag
    )

    if (!existingTag && onCreateTag) {
      setIsCreating(true)
      try {
        await onCreateTag(normalizedTag)
      } finally {
        setIsCreating(false)
      }
    }

    onChange([...value, normalizedTag])
    setInputValue('')
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }, [value, maxTags, suggestions, onCreateTag, onChange])

  const removeTag = useCallback((tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }, [value, onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        addTag(filteredSuggestions[highlightedIndex].name)
      } else if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    }
  }, [highlightedIndex, filteredSuggestions, inputValue, value, addTag, removeTag])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowSuggestions(true)
    setHighlightedIndex(-1)
  }

  const getTagColor = (tagName: string): string => {
    // Encontrar a tag nas sugestões para pegar a cor
    const tag = suggestions.find((t) => t.name.toLowerCase() === tagName.toLowerCase())
    const color = tag?.color || 'purple'
    return colors[color] || colors.gray
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex flex-wrap gap-2 p-2 min-h-[42px] border rounded-md bg-background',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Tags selecionadas */}
        {value.map((tag) => (
          <span
            key={tag}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
              getTagColor(tag),
              tagClassName
            )}
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(tag)
                }}
                className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}

        {/* Input */}
        {(!maxTags || value.length < maxTags) && !disabled && (
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />
        )}

        {/* Loading indicator */}
        {(isLoading || isCreating) && (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Dropdown de sugestões */}
      {showSuggestions && !disabled && (filteredSuggestions.length > 0 || inputValue.trim()) && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
          {/* Sugestões existentes */}
          {filteredSuggestions.map((tag, index) => (
            <button
              key={tag.id || tag.name}
              type="button"
              onClick={() => addTag(tag.name)}
              className={cn(
                'w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2',
                index === highlightedIndex && 'bg-accent'
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  tag.color ? `bg-${tag.color}-500` : 'bg-purple-500'
                )}
              />
              <span>{tag.name}</span>
              {tag.slug && tag.slug !== tag.name.toLowerCase() && (
                <span className="text-muted-foreground text-xs">({tag.slug})</span>
              )}
            </button>
          ))}

          {/* Opção de criar nova tag */}
          {inputValue.trim() &&
            !filteredSuggestions.some(
              (t) => t.name.toLowerCase() === inputValue.toLowerCase()
            ) && (
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 border-t',
                  highlightedIndex === filteredSuggestions.length && 'bg-accent'
                )}
              >
                <Plus className="w-4 h-4 text-purple-500" />
                <span>Criar tag "{inputValue}"</span>
              </button>
            )}
        </div>
      )}
    </div>
  )
}
