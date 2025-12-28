import { getTenantFromSubdomain } from '@/lib/tenant'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function getAccessToken(): Promise<string | null> {
  // This will be used with Auth0 hook
  return null
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
  schoolId?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
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
