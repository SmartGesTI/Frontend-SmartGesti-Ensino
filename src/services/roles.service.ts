import axios from 'axios';
import { getApiUrl } from './api';

export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  hierarchy: number;
  permissions: Record<string, string[]>;
  tenant_id: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleData {
  name: string;
  slug: string;
  description?: string;
  hierarchy: number;
  permissions: Record<string, string[]>;
}

export interface AssignRoleData {
  user_id: string;
  role_id: string;
  school_id?: string;
}

/**
 * Serviço para gerenciar roles (cargos)
 */
export class RolesService {
  /**
   * Lista todos os roles do tenant
   */
  static async getRoles(token: string, tenantId: string): Promise<Role[]> {
    const response = await axios.get<Role[]>(`${getApiUrl()}/api/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
    });
    return response.data;
  }

  /**
   * Busca um role específico
   */
  static async getRole(
    token: string,
    roleId: string,
    tenantId: string
  ): Promise<Role> {
    const response = await axios.get<Role>(
      `${getApiUrl()}/api/roles/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    );
    return response.data;
  }

  /**
   * Cria um novo role
   */
  static async createRole(
    token: string,
    tenantId: string,
    data: CreateRoleData
  ): Promise<Role> {
    const response = await axios.post<Role>(
      `${getApiUrl()}/api/roles`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    );
    return response.data;
  }

  /**
   * Atualiza um role
   */
  static async updateRole(
    token: string,
    roleId: string,
    tenantId: string,
    data: Partial<CreateRoleData>
  ): Promise<Role> {
    const response = await axios.patch<Role>(
      `${getApiUrl()}/api/roles/${roleId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    );
    return response.data;
  }

  /**
   * Deleta um role
   */
  static async deleteRole(
    token: string,
    roleId: string,
    tenantId: string
  ): Promise<void> {
    await axios.delete(`${getApiUrl()}/api/roles/${roleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
    });
  }

  /**
   * Atribui um role a um usuário
   */
  static async assignRole(
    token: string,
    tenantId: string,
    data: AssignRoleData
  ): Promise<any> {
    const response = await axios.post(
      `${getApiUrl()}/api/roles/assign`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    );
    return response.data;
  }

  /**
   * Remove um role de um usuário
   */
  static async removeRole(
    token: string,
    userRoleId: string,
    tenantId: string
  ): Promise<void> {
    await axios.delete(`${getApiUrl()}/api/roles/${userRoleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
    });
  }
}
