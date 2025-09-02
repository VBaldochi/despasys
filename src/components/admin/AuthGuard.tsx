'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    console.log('AuthGuard - UseEffect triggered:', { status, hasSession: !!session, redirected })

    // Se já redirecionou, não fazer nada
    if (redirected) return

    // Aguardar um tempo para que a sessão seja carregada
    const timer = setTimeout(() => {
      setIsChecking(false)
      
      // Só redirecionar se definitivamente não estiver autenticado
      if (status === 'unauthenticated' && !redirected) {
        console.log('AuthGuard - Redirecionando para login')
        setRedirected(true)
        router.replace('/auth/login?tenant=demo')
      }
    }, 2000) // 2 segundos de delay para dar tempo da sessão carregar

    return () => clearTimeout(timer)
  }, [status, router, redirected, session])

  // Debug mais detalhado
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log('AuthGuard Production Debug:', {
        status,
        hasSession: !!session,
        sessionUserId: session?.user?.id,
        isChecking,
        redirected,
        timestamp: new Date().toISOString()
      })
    }
  }, [status, session, isChecking, redirected])

  // Mostrar loading durante verificação inicial
  if (isChecking || status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <div className="mt-4 text-lg text-gray-600">Verificando autenticação...</div>
          {process.env.NODE_ENV === 'production' && (
            <div className="mt-2 text-sm text-gray-500">
              Status: {status} | Session: {session ? 'Yes' : 'No'}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Se não está autenticado, mostrar loading até redirecionamento
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-lg text-gray-600">Redirecionando para login...</div>
        </div>
      </div>
    )
  }

  // Se está autenticado, mostrar conteúdo
  return <>{children}</>
}
