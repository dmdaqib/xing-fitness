/**
 * Returns the production base URL for Xing Fitness.
 * Precedence:
 * 1. Explicit VITE_APP_URL from environment (if set)
 * 2. Official verified website domain from BRAND documentation (https://www.xingfitness.in)
 */
export function getProductionBaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_APP_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  const official = 'https://xingfitness.in';
  return official.replace(/\/+$/, '');
}

/**
 * Returns the exact destination URL for the member concern page.
 */
export function getConcernPageUrl(customBase?: string): string {
  const base = customBase && customBase.trim() !== ''
    ? customBase.trim().replace(/\/+$/, '')
    : getProductionBaseUrl();

  return `${base}/concern`;
}
