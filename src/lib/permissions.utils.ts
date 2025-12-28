/**
 * Utilitários para verificação de permissões
 */

export type Permissions = Record<string, string[]>;

export interface Role {
  id: string;
  name: string;
  slug: string;
}

/**
 * Verifica se o usuário tem uma permissão específica
 * 
 * @param permissions - Objeto de permissões do usuário
 * @param resource - Recurso (ex: 'schools', 'users')
 * @param action - Ação (ex: 'create', 'read', 'update', 'delete')
 * @param isOwner - Se o usuário é proprietário (bypass de permissões)
 * 
 * @example
 * checkPermission(permissions, 'schools', 'create', false)
 */
export function checkPermission(
  permissions: Permissions,
  resource: string,
  action: string,
  isOwner: boolean = false
): boolean {
  // Proprietário tem todas as permissões
  if (isOwner) return true;

  // Verificar permissão global (*)
  if (permissions['*']?.includes('*')) return true;

  // Verificar permissão específica do recurso
  if (permissions[resource]) {
    return (
      permissions[resource].includes(action) ||
      permissions[resource].includes('*') ||
      permissions[resource].includes('manage')
    );
  }

  // Verificar se tem permissão global para a ação
  if (permissions['*']?.includes(action)) return true;

  return false;
}

/**
 * Verifica se o usuário tem um cargo específico
 * 
 * @param roles - Array de cargos do usuário
 * @param roleSlug - Slug do cargo (ex: 'proprietario', 'administrador')
 * 
 * @example
 * checkRole(roles, 'administrador')
 */
export function checkRole(roles: Role[], roleSlug: string): boolean {
  return roles.some((role) => role.slug === roleSlug);
}

/**
 * Verifica se o usuário tem ALGUMA das permissões especificadas
 * 
 * @param permissions - Objeto de permissões do usuário
 * @param checks - Array de [resource, action] para verificar
 * @param isOwner - Se o usuário é proprietário
 * 
 * @example
 * hasAnyPermission(permissions, [
 *   ['schools', 'create'],
 *   ['schools', 'update']
 * ])
 */
export function hasAnyPermission(
  permissions: Permissions,
  checks: Array<[string, string]>,
  isOwner: boolean = false
): boolean {
  if (isOwner) return true;

  return checks.some(([resource, action]) =>
    checkPermission(permissions, resource, action, isOwner)
  );
}

/**
 * Verifica se o usuário tem TODAS as permissões especificadas
 * 
 * @param permissions - Objeto de permissões do usuário
 * @param checks - Array de [resource, action] para verificar
 * @param isOwner - Se o usuário é proprietário
 * 
 * @example
 * hasAllPermissions(permissions, [
 *   ['schools', 'read'],
 *   ['schools', 'create']
 * ])
 */
export function hasAllPermissions(
  permissions: Permissions,
  checks: Array<[string, string]>,
  isOwner: boolean = false
): boolean {
  if (isOwner) return true;

  return checks.every(([resource, action]) =>
    checkPermission(permissions, resource, action, isOwner)
  );
}

/**
 * Verifica se o usuário tem ALGUM dos cargos especificados
 * 
 * @param roles - Array de cargos do usuário
 * @param roleSlugs - Array de slugs de cargos
 * 
 * @example
 * hasAnyRole(roles, ['proprietario', 'administrador'])
 */
export function hasAnyRole(roles: Role[], roleSlugs: string[]): boolean {
  return roleSlugs.some((slug) => checkRole(roles, slug));
}

/**
 * Verifica se o usuário tem TODOS os cargos especificados
 * 
 * @param roles - Array de cargos do usuário
 * @param roleSlugs - Array de slugs de cargos
 * 
 * @example
 * hasAllRoles(roles, ['professor', 'coordenador'])
 */
export function hasAllRoles(roles: Role[], roleSlugs: string[]): boolean {
  return roleSlugs.every((slug) => checkRole(roles, slug));
}

/**
 * Obtém todas as permissões únicas de um usuário
 * 
 * @param permissions - Objeto de permissões do usuário
 * 
 * @returns Array de [resource, action]
 * 
 * @example
 * getAllPermissions(permissions)
 * // [['schools', 'create'], ['schools', 'read'], ...]
 */
export function getAllPermissions(
  permissions: Permissions
): Array<[string, string]> {
  const allPermissions: Array<[string, string]> = [];

  Object.entries(permissions).forEach(([resource, actions]) => {
    actions.forEach((action) => {
      allPermissions.push([resource, action]);
    });
  });

  return allPermissions;
}

/**
 * Filtra recursos pelos quais o usuário tem uma ação específica
 * 
 * @param permissions - Objeto de permissões do usuário
 * @param action - Ação para filtrar (ex: 'create')
 * @param isOwner - Se o usuário é proprietário
 * 
 * @returns Array de recursos
 * 
 * @example
 * getResourcesWithAction(permissions, 'create')
 * // ['schools', 'users', 'classes']
 */
export function getResourcesWithAction(
  permissions: Permissions,
  action: string,
  isOwner: boolean = false
): string[] {
  if (isOwner) return ['*'];

  const resources: string[] = [];

  Object.entries(permissions).forEach(([resource, actions]) => {
    if (
      actions.includes(action) ||
      actions.includes('*') ||
      actions.includes('manage')
    ) {
      resources.push(resource);
    }
  });

  // Adicionar recursos com permissão global
  if (permissions['*']?.includes(action) || permissions['*']?.includes('*')) {
    resources.push('*');
  }

  return [...new Set(resources)];
}
