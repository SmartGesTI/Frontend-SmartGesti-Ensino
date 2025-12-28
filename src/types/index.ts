export interface User {
  id: string
  auth0_id: string
  email: string
  full_name?: string
  avatar_url?: string
  email_verified?: boolean
  role: string
  tenant_id?: string
  current_school_id?: string
  ai_context?: Record<string, unknown>
  ai_summary?: string
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  subdomain: string
  name: string
  domain?: string
  logo_url?: string
  settings?: Record<string, unknown>
  ai_context?: Record<string, unknown>
  razao_social?: string
  cnpj?: string
  telefone?: string
  email?: string
  website?: string
  inscricao_estadual?: string
  inscricao_municipal?: string
  endereco_rua?: string
  endereco_numero?: string
  endereco_complemento?: string
  endereco_bairro?: string
  endereco_cidade?: string
  endereco_estado?: string
  endereco_cep?: string
  created_at: string
  updated_at: string
}

export interface School {
  id: string
  tenant_id: string
  name: string
  slug: string
  code?: string
  address?: string
  phone?: string
  email?: string
  cnpj?: string
  website?: string
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  whatsapp?: string
  descricao?: string
  logo_url?: string
  endereco_rua?: string
  endereco_numero?: string
  endereco_complemento?: string
  endereco_bairro?: string
  endereco_cidade?: string
  endereco_estado?: string
  endereco_cep?: string
  settings?: Record<string, unknown>
  ai_context?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id?: string
  description: string
  metadata?: Record<string, unknown>
  created_at: string
}
