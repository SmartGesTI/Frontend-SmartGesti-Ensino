import { useState } from 'react'
import { useInvitations } from '@/hooks/useInvitations'
import { useRoles } from '@/hooks/useRoles'
import { getTenantFromSubdomain } from '@/lib/tenant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Mail,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  UserPlus,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ConvitesTab() {
  const tenantId = getTenantFromSubdomain() || ''
  const { invitations, isLoading, createInvitation, cancelInvitation, isCreating, isCancelling } =
    useInvitations(tenantId)
  const { roles, isLoading: rolesLoading } = useRoles(tenantId)

  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [invitationToCancel, setInvitationToCancel] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !roleId) return

    createInvitation(
      { email, role_id: roleId },
      {
        onSuccess: () => {
          setEmail('')
          setRoleId('')
        },
      }
    )
  }

  const handleCancelClick = (invitationId: string) => {
    setInvitationToCancel(invitationId)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = () => {
    if (invitationToCancel) {
      cancelInvitation(invitationToCancel)
    }
    setCancelDialogOpen(false)
    setInvitationToCancel(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Aceito
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        )
      case 'expired':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Expirado
          </Badge>
        )
      default:
        return null
    }
  }

  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    return role?.name || 'Cargo não encontrado'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const pendingInvitations = invitations.filter((inv) => inv.status === 'pending')
  const otherInvitations = invitations.filter((inv) => inv.status !== 'pending')

  return (
    <div className="space-y-6">
      {/* Form de novo convite */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border">
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <UserPlus className="h-5 w-5" />
            Convidar Usuário
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Envie um convite por email para adicionar novos membros à instituição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="w-full sm:w-48 space-y-2">
              <Label htmlFor="role">Cargo</Label>
              {rolesLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={roleId} onValueChange={setRoleId} required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roles
                      .filter((r) => !r.is_system || r.slug !== 'owner')
                      .map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex items-end">
              <Button 
                type="submit" 
                size="sm"
                disabled={isCreating || !email || !roleId}
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/20"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Enviar Convite
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de convites pendentes */}
      <Card className="border-2 border-border">
        <CardHeader className="bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/30 dark:to-transparent border-b border-border">
          <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
            Convites Pendentes
            {pendingInvitations.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {pendingInvitations.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Convites aguardando aceitação</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : pendingInvitations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>Nenhum convite pendente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg',
                    'border border-amber-200 bg-amber-50/50',
                    'dark:border-amber-800/50 dark:bg-amber-900/10'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{invitation.email}</span>
                      {getStatusBadge(invitation.status)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Cargo: {getRoleName(invitation.role_id)}</span>
                      <span>Enviado: {formatDate(invitation.created_at)}</span>
                      <span>Expira: {formatDate(invitation.expires_at)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleCancelClick(invitation.id)}
                    disabled={isCancelling}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de convites */}
      {otherInvitations.length > 0 && (
        <Card className="border-2 border-border">
          <CardHeader className="bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-950/30 dark:to-transparent border-b border-border">
            <CardTitle className="text-gray-700 dark:text-gray-300">Histórico</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Convites aceitos, cancelados ou expirados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {otherInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{invitation.email}</span>
                      {getStatusBadge(invitation.status)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {getRoleName(invitation.role_id)} • {formatDate(invitation.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de confirmação de cancelamento */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar convite?</AlertDialogTitle>
            <AlertDialogDescription>
              O usuário não poderá mais aceitar este convite. Você poderá enviar um novo convite depois.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancelar Convite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
