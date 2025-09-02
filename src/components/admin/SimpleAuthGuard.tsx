'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface SimpleAuthGuardProps {
  children: React.ReactNode
}

export default function SimpleAuthGuard({ children }: SimpleAuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Log para debug
    console.log('SimpleAuthGuard:', { status, hasSession: !!session })
    
    // Só redirecionar se claramente não autenticado
    if (status === 'unauthenticated') {
      console.log('Redirecionando para login...')
      router.replace('/auth/login?tenant=demo')
    }
  }, [status, router, session])

  // Se está carregando, mostrar loading
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <div className="mt-4 text-lg text-gray-600">Carregando...</div>
        </div>
      </div>
    )
  }

  // Se não autenticado, mostrar loading até redirect
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-lg text-gray-600">Redirecionando...</div>
        </div>
      </div>
    )
  }

  // Se autenticado, mostrar conteúdo
  return <>{children}</>
}
