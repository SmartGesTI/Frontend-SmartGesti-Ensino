import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PermissionGate } from '../components/PermissionGate';
import { UserPlus, Mail, Shield } from 'lucide-react';
import { ErrorLogger } from '../lib/errorLogger';


interface ManagePermissionsProps {
  tenantId: string;
}

export const ManagePermissions: React.FC<ManagePermissionsProps> = ({
  tenantId,
}) => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Buscar cargos disponíveis
  const { data: roles } = useQuery({
    queryKey: ['roles', tenantId],
    queryFn: async () => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const token = session.access_token;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
          },
        },
      );
      return response.data;
    },
  });

  // Buscar convites pendentes
  const { data: invitations } = useQuery({
    queryKey: ['invitations', tenantId],
    queryFn: async () => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const token = session.access_token;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/invitations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
          },
          params: { status: 'pending' },
        },
      );
      return response.data;
    },
  });

  // Mutation para criar convite
  const createInviteMutation = useMutation({
    mutationFn: async (data: { email: string; role_id: string }) => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const token = session.access_token;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/invitations`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', tenantId] });
      setInviteEmail('');
      setSelectedRole('');
      ErrorLogger.success('Convite enviado!', 'O usuário receberá um email com instruções');
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'CreateInvitation');
    },
  });

  // Mutation para cancelar convite
  const cancelInviteMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }
      const token = session.access_token;
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/invitations/${invitationId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-id': tenantId,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', tenantId] });
      ErrorLogger.success('Convite cancelado', 'O convite foi cancelado com sucesso');
    },
    onError: (error: any) => {
      ErrorLogger.handleApiError(error, 'CancelInvitation');
    },
  });

  const handleSendInvite = () => {
    if (!inviteEmail || !selectedRole) {
      ErrorLogger.warning('Campos obrigatórios', 'Preencha o email e selecione um cargo');
      return;
    }

    createInviteMutation.mutate({
      email: inviteEmail,
      role_id: selectedRole,
    });
  };

  return (
    <PermissionGate resource="users" action="create">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Gerenciar Permissões</h1>

        <Tabs defaultValue="invite" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 dark:bg-gray-800/50 p-1">
            <TabsTrigger value="invite" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Convidar Usuário
            </TabsTrigger>
            <TabsTrigger value="invitations" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Mail className="w-4 h-4 mr-2" />
              Convites Pendentes
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Cargos
            </TabsTrigger>
          </TabsList>

          {/* Tab: Convidar Usuário */}
          <TabsContent value="invite">
            <Card className="border-2 border-border">
              <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
                <CardTitle className="text-blue-600 dark:text-blue-400">Convidar Novo Membro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium mb-1.5 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium mb-1.5 block">Cargo</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles?.map((role: any) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name} - {role.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSendInvite}
                  disabled={createInviteMutation.isPending}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {createInviteMutation.isPending
                    ? 'Enviando...'
                    : 'Enviar Convite'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Convites Pendentes */}
          <TabsContent value="invitations">
            <Card className="border-2 border-border">
              <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
                <CardTitle className="text-blue-600 dark:text-blue-400">Convites Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                {invitations && invitations.length > 0 ? (
                  <div className="space-y-4">
                    {invitations.map((invitation: any) => (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-100">{invitation.email}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Cargo: {invitation.roles?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Expira em:{' '}
                            {new Date(invitation.expires_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            cancelInviteMutation.mutate(invitation.id)
                          }
                          disabled={cancelInviteMutation.isPending}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Nenhum convite pendente
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Cargos */}
          <TabsContent value="roles">
            <Card className="border-2 border-border">
              <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
                <CardTitle className="text-blue-600 dark:text-blue-400">Cargos Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                {roles && roles.length > 0 ? (
                  <div className="space-y-4">
                    {roles.map((role: any) => (
                      <div
                        key={role.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{role.name}</h3>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                            Nível {role.hierarchy_level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {role.description}
                        </p>
                        {role.is_system_role && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            Cargo do Sistema
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Nenhum cargo disponível
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGate>
  );
};

export default ManagePermissions;
