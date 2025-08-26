'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Ainda carregando

    if (!session) {
      // Aguardar um pouco antes de redirecionar para evitar redirects prematuros
      const timer = setTimeout(() => {
        if (!session && status === 'unauthenticated') {
          // Não autenticado - redirecionar para login
          const currentUrl = window.location.pathname + window.location.search
          const tenant = new URLSearchParams(window.location.search).get('tenant') || 'demo'
          router.push(`/auth/login?tenant=${tenant}&callbackUrl=${encodeURIComponent(currentUrl)}`)
        }
      }, 1000) // Aguardar 1 segundo

      return () => clearTimeout(timer)
    }

    if (requiredRole && session.user.role !== requiredRole) {
      // Usuário não tem a role necessária
      router.push('/unauthorized')
      return
    }
  }, [session, status, router, requiredRole])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
