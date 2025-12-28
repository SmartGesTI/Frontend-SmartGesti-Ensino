/**
 * Centralização de todas as rotas da aplicação
 * 
 * Este arquivo centraliza todas as rotas para facilitar manutenção
 * e garantir consistência entre desenvolvimento e produção.
 * 
 * Uso:
 * - Rotas estáticas: routes.login()
 * - Rotas dinâmicas: routes.school.dashboard('escola-slug')
 * - URLs completas: routes.getAuthCallbackUrl()
 */

/**
 * Obtém a URL base da aplicação
 * Prioridade: VITE_APP_URL > window.location.origin
 */
const getAppUrl = (): string => {
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_APP_URL || 'http://localhost:5173'
  }
  return import.meta.env.VITE_APP_URL || window.location.origin
}

/**
 * Rotas da aplicação
 */
export const routes = {
  // ============================================
  // Autenticação
  // ============================================
  login: (error?: string) => {
    const base = '/login'
    return error ? `${base}?error=${encodeURIComponent(error)}` : base
  },
  
  register: () => '/register',
  
  authCallback: () => '/auth/callback',
  
  verifyOtp: (email?: string) => {
    const base = '/verificar-otp'
    return email ? `${base}?email=${encodeURIComponent(email)}` : base
  },
  
  verifyEmail: () => '/verificar-email',
  
  resetPassword: () => '/auth/reset-password',
  
  // ============================================
  // Perfil e Cadastro
  // ============================================
  completeProfile: () => '/completar-cadastro',
  
  selectSchool: () => '/selecionar-escola',
  
  pendingApproval: () => '/aguardando-aprovacao',
  
  // ============================================
  // Rotas da Escola (dinâmicas)
  // ============================================
  school: {
    dashboard: (slug: string) => `/escola/${slug}/painel`,
    financial: (slug: string) => `/escola/${slug}/painel/financeiro`,
    academic: (slug: string) => `/escola/${slug}/painel/academico`,
    details: (slug: string) => `/escola/${slug}/escola-atual`,
    create: (slug: string) => `/escola/${slug}/nova-escola`,
    users: (slug: string) => `/escola/${slug}/usuarios`,
    permissions: (slug: string) => `/escola/${slug}/permissoes`,
    classes: (slug: string) => `/escola/${slug}/turmas`,
    students: (slug: string) => `/escola/${slug}/alunos`,
    enrollments: (slug: string) => `/escola/${slug}/matriculas`,
    calendar: (slug: string) => `/escola/${slug}/calendario`,
    calendarNew: (slug: string) => `/escola/${slug}/calendario/novo`,
    documents: (slug: string) => `/escola/${slug}/documentos`,
    settings: (slug: string) => `/escola/${slug}/configuracoes`,
  },
  
  // ============================================
  // Perfil e Configurações
  // ============================================
  profile: () => '/perfil',
  settings: () => '/configuracoes',
  
  // ============================================
  // URLs Completas (para OAuth callbacks e redirects)
  // ============================================
  getAuthCallbackUrl: () => `${getAppUrl()}/auth/callback`,
  getResetPasswordUrl: () => `${getAppUrl()}/auth/reset-password`,
  
  // ============================================
  // Helper para construir URLs com query params
  // ============================================
  withQuery: (path: string, params: Record<string, string | number | boolean>) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, String(value))
    })
    const queryString = searchParams.toString()
    return queryString ? `${path}?${queryString}` : path
  },
}
