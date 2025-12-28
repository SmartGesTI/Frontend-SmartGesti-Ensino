import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

interface UseUrlTabsOptions {
  /** Nome do parâmetro na URL (padrão: 'tab') */
  paramName?: string
  /** Valor padrão quando não há parâmetro na URL */
  defaultValue: string
  /** Lista de valores válidos para a aba (opcional, para validação) */
  validValues?: string[]
}

interface UseUrlTabsReturn {
  /** Valor atual da aba */
  currentTab: string
  /** Função para mudar a aba (atualiza a URL) */
  setTab: (value: string) => void
  /** Props para passar diretamente ao componente Tabs */
  tabsProps: {
    value: string
    onValueChange: (value: string) => void
  }
}

/**
 * Hook para sincronizar abas com a URL
 * 
 * @example
 * ```tsx
 * const { tabsProps } = useUrlTabs({ defaultValue: 'dados-gerais' })
 * 
 * return (
 *   <Tabs {...tabsProps}>
 *     <TabsList>
 *       <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
 *       <TabsTrigger value="contatos">Contatos</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="dados-gerais">...</TabsContent>
 *     <TabsContent value="contatos">...</TabsContent>
 *   </Tabs>
 * )
 * ```
 * 
 * URL resultante: /escola/minha-escola/detalhes?tab=contatos
 */
export function useUrlTabs({
  paramName = 'tab',
  defaultValue,
  validValues,
}: UseUrlTabsOptions): UseUrlTabsReturn {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentTab = useMemo(() => {
    const urlValue = searchParams.get(paramName)
    
    // Se não há valor na URL, retorna o padrão
    if (!urlValue) {
      return defaultValue
    }
    
    // Se há validValues definido, verifica se o valor é válido
    if (validValues && !validValues.includes(urlValue)) {
      return defaultValue
    }
    
    return urlValue
  }, [searchParams, paramName, defaultValue, validValues])

  const setTab = useCallback((value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      
      // Se o valor é o padrão, remove o parâmetro da URL para manter limpo
      if (value === defaultValue) {
        newParams.delete(paramName)
      } else {
        newParams.set(paramName, value)
      }
      
      return newParams
    }, { replace: true }) // replace para não poluir o histórico
  }, [setSearchParams, paramName, defaultValue])

  const tabsProps = useMemo(() => ({
    value: currentTab,
    onValueChange: setTab,
  }), [currentTab, setTab])

  return {
    currentTab,
    setTab,
    tabsProps,
  }
}
