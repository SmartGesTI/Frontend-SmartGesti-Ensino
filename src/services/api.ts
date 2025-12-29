import { getTenantFromSubdomain } from '@/lib/tenant'
import { supabase } from '@/lib/supabase'

/**
 * Obtém a URL base da API
 * Em produção: VITE_API_URL é obrigatório (lança erro se não definido)
 * Em desenvolvimento: permite fallback para localhost apenas se VITE_API_URL não estiver definido
 */
export function getApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL
  const isProduction = import.meta.env.PROD
  
  if (!apiUrl) {
    if (isProduction) {
      throw new Error(
        'VITE_API_URL is required in production. ' +
        'Please configure it in your Vercel environment variables.'
      )
    }
    // Apenas em desenvolvimento, permite fallback
    console.warn(
      'VITE_API_URL not defined, using localhost fallback. ' +
      'This will not work in production!'
    )
    return 'http://localhost:3001'
  }
  
  return apiUrl
}

export async function getAccessToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
  schoolId?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Adicionar header do tenant se disponível
  const subdomain = getTenantFromSubdomain()
  if (subdomain) {
    headers['X-Tenant-Subdomain'] = subdomain
  }

  // Adicionar header da escola se disponível
  if (schoolId) {
    headers['X-School-Id'] = schoolId
  }

  const response = await fetch(`${getApiUrl()}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}
