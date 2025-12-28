/**
 * Utilitários para gerenciamento de localStorage
 * Permite limpar dados preservando preferências do usuário
 */

// Chaves que devem ser preservadas mesmo após logout
export const PRESERVED_STORAGE_KEYS = ['smartgesti-theme'] as const

/**
 * Limpa o localStorage preservando chaves importantes (ex: tema)
 */
export function clearStoragePreservingPreferences(): void {
  // Salvar valores que devem ser preservados
  const preserved: Record<string, string | null> = {}
  PRESERVED_STORAGE_KEYS.forEach(key => {
    preserved[key] = localStorage.getItem(key)
  })

  // Limpar tudo
  localStorage.clear()

  // Restaurar valores preservados
  Object.entries(preserved).forEach(([key, value]) => {
    if (value !== null) {
      localStorage.setItem(key, value)
    }
  })
}

/**
 * Limpa todos os dados de sessão (localStorage, sessionStorage, cookies)
 * preservando preferências do usuário como tema
 */
export function clearAllSessionData(): void {
  // Limpar localStorage preservando preferências
  clearStoragePreservingPreferences()

  // Limpar sessionStorage completamente
  sessionStorage.clear()

  // Limpar cookies (melhor esforço)
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim()
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
  })
}
