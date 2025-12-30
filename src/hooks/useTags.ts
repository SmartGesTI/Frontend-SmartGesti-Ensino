import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/useAccessToken'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { TagsService, Tag, CreateTagData, TagFilters } from '@/services/tags.service'

/**
 * Hook de debounce para valores
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para buscar tags
 */
export function useTags(filters?: TagFilters) {
  const { token, isReady } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()

  return useQuery({
    queryKey: ['tags', tenantSubdomain, filters],
    queryFn: async () => {
      if (!token || !tenantSubdomain) return []
      try {
        return await TagsService.getTags(token, tenantSubdomain, filters)
      } catch (error) {
        // Retornar array vazio silenciosamente se não encontrar tags
        // O botão "Criar tag" já indica que não existe
        console.debug('Tags não encontradas, retornando array vazio')
        return []
      }
    },
    enabled: isReady && !!token && !!tenantSubdomain,
    staleTime: 5 * 60 * 1000, // 5 minutos - tags não mudam frequentemente
    retry: false, // Não tentar novamente em caso de erro
  })
}

/**
 * Hook para buscar tags de agentes com debounce
 */
export function useAgentTags(search?: string) {
  // Aplicar debounce de 300ms na busca
  const debouncedSearch = useDebounce(search, 300)
  return useTags({ category: 'agent', search: debouncedSearch })
}

/**
 * Hook para criar uma nova tag
 */
export function useCreateTag() {
  const { token } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTagData) => {
      if (!token || !tenantSubdomain) {
        throw new Error('Token ou tenant não disponível')
      }
      return TagsService.createTag(token, tenantSubdomain, data)
    },
    onSuccess: () => {
      // Invalidar cache de tags
      queryClient.invalidateQueries({ queryKey: ['tags', tenantSubdomain] })
    },
  })
}

/**
 * Hook para buscar ou criar uma tag
 */
export function useFindOrCreateTag() {
  const { token } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, category }: { name: string; category?: string }) => {
      if (!token || !tenantSubdomain) {
        throw new Error('Token ou tenant não disponível')
      }
      return TagsService.findOrCreateTag(token, tenantSubdomain, name, category)
    },
    onSuccess: () => {
      // Invalidar cache de tags
      queryClient.invalidateQueries({ queryKey: ['tags', tenantSubdomain] })
    },
  })
}

/**
 * Hook para deletar uma tag
 */
export function useDeleteTag() {
  const { token } = useAccessToken()
  const tenantSubdomain = getTenantFromSubdomain()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tagId: string) => {
      if (!token || !tenantSubdomain) {
        throw new Error('Token ou tenant não disponível')
      }
      return TagsService.deleteTag(token, tagId, tenantSubdomain)
    },
    onSuccess: () => {
      // Invalidar cache de tags
      queryClient.invalidateQueries({ queryKey: ['tags', tenantSubdomain] })
    },
  })
}

/**
 * Converte array de tags da API para formato do componente TagsInput
 */
export function mapTagsToInput(tags: Tag[]): { id: string; name: string; slug: string; color: string }[] {
  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    color: tag.color,
  }))
}
