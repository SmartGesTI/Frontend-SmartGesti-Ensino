/**
 * Extrai o subdomain da URL atual
 * Suporta:
 * - Produção: ensinosbruno.smartgesti.com -> "ensinosbruno"
 * - Vercel: ensinosbruno.vercel.app ou ensinosbruno-seu-projeto.vercel.app -> "ensinosbruno"
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

  // Vercel: subdomain.vercel.app ou subdomain-projeto.vercel.app
  // Exemplo: ensinosbruno.vercel.app ou ensinosbruno-frontend-smartgesti-ensino.vercel.app
  if (hostname.includes('vercel.app') && parts.length === 3 && parts[1] === 'vercel' && parts[2] === 'app') {
    const firstPart = parts[0];
    // Se contém hífen, pode ser formato: tenant-projeto.vercel.app
    // Extrair apenas o primeiro segmento (tenant) antes do hífen do projeto
    // Exemplo: ensinosbruno-frontend-smartgesti-ensino -> ensinosbruno
    if (firstPart.includes('-')) {
      const tenantMatch = firstPart.match(/^([^-]+)/);
      if (tenantMatch) {
        return tenantMatch[1];
      }
    }
    // Se não tem hífen, é formato simples: tenant.vercel.app
    return firstPart;
  }

  // Produção: subdomain.smartgesti.com ou subdomain.dominio.com
  // Verifica se tem pelo menos 3 partes e a primeira não é 'www' ou 'localhost'
  if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    // Verificar se não é um domínio da Vercel (já tratado acima)
    if (!hostname.includes('vercel.app')) {
      return parts[0];
    }
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
