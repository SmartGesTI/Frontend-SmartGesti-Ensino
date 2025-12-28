/**
 * Extrai o subdomain da URL atual
 * Suporta:
 * - Produção: ensinosbruno.smartgesti.com -> "ensinosbruno"
 * - Desenvolvimento local: ensinosbruno.localhost:5173 -> "ensinosbruno"
 * - Desenvolvimento fallback: localhost:5173?tenant=ensinosbruno -> "ensinosbruno"
 */
export function getTenantFromSubdomain(): string | null {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Desenvolvimento local: ensinosbruno.localhost
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    return parts[0];
  }

  // Produção: subdomain.smartgesti.com
  if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    return parts[0];
  }

  // Fallback: query param ?tenant=xxx
  const params = new URLSearchParams(window.location.search);
  const tenantParam = params.get('tenant');
  if (tenantParam) {
    return tenantParam;
  }

  return null;
}

/**
 * Retorna o domínio completo do tenant
 */
export function getTenantDomain(): string {
  const tenant = getTenantFromSubdomain();
  if (tenant) {
    return `${tenant}.smartgesti.com`;
  }
  return 'smartgesti.com';
}
