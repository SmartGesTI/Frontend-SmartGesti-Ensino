import axios from 'axios';
import { getApiUrl } from './api';

export interface Invitation {
  id: string;
  email: string;
  role_id: string;
  tenant_id: string;
  school_id?: string;
  status: 'pending' | 'accepted' | 'cancelled' | 'expired';
  invited_by: string;
  token: string;
  created_at: string;
  expires_at: string;
}

export interface CreateInvitationData {
  email: string;
  role_id: string;
  school_id?: string;
}

export interface AcceptInvitationData {
  token: string;
}

/**
 * Serviço para gerenciar convites
 */
export class InvitationsService {
  /**
   * Lista todos os convites do tenant
   */
  static async list(token: string, tenantId: string): Promise<Invitation[]> {
    const response = await axios.get<Invitation[]>(
      `${getApiUrl()}/api/invitations`,
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
   * Busca um convite específico
   */
  static async get(
    token: string,
    invitationId: string,
    tenantId: string
  ): Promise<Invitation> {
    const response = await axios.get<Invitation>(
      `${getApiUrl()}/api/invitations/${invitationId}`,
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
   * Cria um novo convite
   */
  static async create(
    token: string,
    tenantId: string,
    data: CreateInvitationData
  ): Promise<Invitation> {
    const response = await axios.post<Invitation>(
      `${getApiUrl()}/api/invitations`,
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
   * Cancela um convite
   */
  static async cancel(
    token: string,
    invitationId: string,
    tenantId: string
  ): Promise<void> {
    await axios.post(
      `${getApiUrl()}/api/invitations/${invitationId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    );
  }

  /**
   * Aceita um convite
   */
  static async accept(
    token: string,
    data: AcceptInvitationData
  ): Promise<any> {
    const response = await axios.post(
      `${getApiUrl()}/api/invitations/accept`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Reenvia um convite
   */
  static async resend(
    token: string,
    invitationId: string,
    tenantId: string
  ): Promise<void> {
    await axios.post(
      `${getApiUrl()}/api/invitations/${invitationId}/resend`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    );
  }
}
