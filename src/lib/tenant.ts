import { headers } from 'next/headers'

export interface TenantInfo {
  id: string
  domain: string
  name: string
  plan: string
}

/**
 * Hook para obter informações do tenant atual
 * Deve ser usado apenas em Server Components
 */
export async function getTenantInfo(): Promise<TenantInfo | null> {
  try {
    const headersList = await headers()
    
    const tenantId = headersList.get('x-tenant-id')
    const tenantDomain = headersList.get('x-tenant-domain')
    const tenantName = headersList.get('x-tenant-name')
    const tenantPlan = headersList.get('x-tenant-plan')

    if (!tenantId || !tenantDomain || !tenantName || !tenantPlan) {
      return null
    }

    return {
      id: tenantId,
      domain: tenantDomain,
      name: tenantName,
      plan: tenantPlan
    }
  } catch (error) {
    console.error('Erro ao obter informações do tenant:', error)
    return null
  }
}

/**
 * Hook para Client Components
 * Retorna informações do tenant via contexto React
 */
export function useTenant() {
  // TODO: Implementar contexto React para client components
  // Por enquanto, retornar null
  return null
}
