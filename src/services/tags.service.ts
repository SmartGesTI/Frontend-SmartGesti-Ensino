import axios from 'axios'
import { getApiUrl } from './api'

export interface Tag {
  id: string
  tenant_id: string
  name: string
  slug: string
  color: string
  category: string
  description?: string
  usage_count: number
  is_system: boolean
  created_at: string
  updated_at: string
}

export interface CreateTagData {
  name: string
  slug?: string
  color?: string
  category?: string
  description?: string
}

export interface TagFilters {
  category?: string
  search?: string
}

/**
 * Serviço para gerenciar tags
 */
export class TagsService {
  /**
   * Lista todas as tags do tenant
   */
  static async getTags(
    token: string,
    tenantId: string,
    filters?: TagFilters
  ): Promise<Tag[]> {
    const params = new URLSearchParams()

    if (filters?.category) {
      params.append('category', filters.category)
    }
    if (filters?.search) {
      params.append('search', filters.search)
    }

    const queryString = params.toString()
    const url = `${getApiUrl()}/api/tags${queryString ? `?${queryString}` : ''}`

    const response = await axios.get<Tag[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
    })
    return response.data
  }

  /**
   * Busca uma tag por ID
   */
  static async getTag(
    token: string,
    tagId: string,
    tenantId: string
  ): Promise<Tag> {
    const response = await axios.get<Tag>(
      `${getApiUrl()}/api/tags/${tagId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    )
    return response.data
  }

  /**
   * Cria uma nova tag
   */
  static async createTag(
    token: string,
    tenantId: string,
    data: CreateTagData
  ): Promise<Tag> {
    const response = await axios.post<Tag>(
      `${getApiUrl()}/api/tags`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    )
    return response.data
  }

  /**
   * Busca ou cria uma tag
   */
  static async findOrCreateTag(
    token: string,
    tenantId: string,
    name: string,
    category: string = 'general'
  ): Promise<Tag> {
    const response = await axios.post<Tag>(
      `${getApiUrl()}/api/tags/find-or-create`,
      { name, category },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    )
    return response.data
  }

  /**
   * Atualiza uma tag
   */
  static async updateTag(
    token: string,
    tagId: string,
    tenantId: string,
    data: Partial<CreateTagData>
  ): Promise<Tag> {
    const response = await axios.put<Tag>(
      `${getApiUrl()}/api/tags/${tagId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    )
    return response.data
  }

  /**
   * Remove uma tag
   */
  static async deleteTag(
    token: string,
    tagId: string,
    tenantId: string
  ): Promise<void> {
    await axios.delete(`${getApiUrl()}/api/tags/${tagId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
    })
  }
}
