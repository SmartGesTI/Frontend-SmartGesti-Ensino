import { getTenantFromSubdomain } from '@/lib/tenant'
import { supabase } from '@/lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}
