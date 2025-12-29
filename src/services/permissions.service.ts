import axios from 'axios';
import { getApiUrl } from './api';

export interface PermissionsResponse {
  permissions: Record<string, string[]>;
  isOwner: boolean;
  hierarchy?: number;
}

export interface CheckPermissionResponse {
  hasPermission: boolean;
}

/**
 * Serviço para gerenciar permissões
 */
export class PermissionsService {
  /**
   * Busca permissões do usuário
   */
  static async getUserPermissions(
    token: string,
    tenantId: string,
    schoolId?: string
  ): Promise<PermissionsResponse> {
    const response = await axios.get<PermissionsResponse>(
      `${getApiUrl()}/api/permissions/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
        params: schoolId ? { schoolId } : {},
      }
    );
    return response.data;
  }

  /**
   * Verifica se usuário tem uma permissão específica
   */
  static async checkPermission(
    token: string,
    tenantId: string,
    resource: string,
    action: string,
    schoolId?: string
  ): Promise<boolean> {
    const response = await axios.get<CheckPermissionResponse>(
      `${getApiUrl()}/api/permissions/check`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
        params: {
          resource,
          action,
          ...(schoolId && { schoolId }),
        },
      }
    );
    return response.data.hasPermission;
  }

  /**
   * Busca roles do usuário
   */
  static async getUserRoles(
    token: string,
    userId: string,
    tenantId: string
  ): Promise<any[]> {
    const response = await axios.get(
      `${getApiUrl()}/api/roles/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    );
    return response.data;
  }
}
