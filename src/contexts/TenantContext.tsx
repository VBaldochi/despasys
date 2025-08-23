'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface TenantInfo {
  id: string
  domain: string
  name: string
  plan: string
}

interface TenantContextType {
  tenant: TenantInfo | null
  loading: boolean
  error: string | null
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<TenantInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTenantInfo() {
      try {
        setLoading(true)
        setError(null)

        // Obter tenant do URL ou localStorage (para desenvolvimento)
        let tenantDomain = new URLSearchParams(window.location.search).get('tenant')
        
        if (!tenantDomain) {
          tenantDomain = localStorage.getItem('selectedTenant') || 'demo'
        }

        if (tenantDomain) {
          localStorage.setItem('selectedTenant', tenantDomain)
        }

        const response = await fetch(`/api/tenant/${tenantDomain}`)
        
        if (!response.ok) {
          throw new Error('Tenant não encontrado')
        }

        const tenantData = await response.json()
        setTenant(tenantData)

      } catch (error) {
        console.error('Erro ao buscar tenant:', error)
        setError(error instanceof Error ? error.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchTenantInfo()
  }, [])

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider')
  }
  return context
}
