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
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    console.log('AuthGuard - UseEffect triggered:', { 
      status, 
      hasSession: !!session, 
      redirected, 
      retryCount,
      sessionData: session ? {
        userId: session.user?.id,
        email: session.user?.email
      } : null
    })

    // Se já redirecionou, não fazer nada
    if (redirected) return

    // Aguardar mais tempo e dar várias tentativas para carregar a sessão
    const timer = setTimeout(() => {
      if (status === 'loading' && retryCount < 5) {
        // Se ainda está carregando, tentar novamente
        setRetryCount(prev => prev + 1)
        return
      }

      setIsChecking(false)
      
      // Só redirecionar se definitivamente não estiver autenticado após várias tentativas
      if (status === 'unauthenticated' && !redirected && retryCount >= 3) {
        console.log('AuthGuard - Redirecionando para login após', retryCount, 'tentativas')
        setRedirected(true)
        router.replace('/auth/login?tenant=demo')
      } else if (status === 'authenticated' && session) {
        console.log('AuthGuard - Usuário autenticado:', session.user?.email)
        setIsChecking(false)
      }
    }, status === 'loading' ? 1000 : 3000) // 1s se loading, 3s se unauthenticated

    return () => clearTimeout(timer)
  }, [status, router, redirected, session, retryCount])

  // Debug mais detalhado
  useEffect(() => {
    console.log('AuthGuard Debug:', {
      status,
      hasSession: !!session,
      sessionUserId: session?.user?.id,
      isChecking,
      redirected,
      retryCount,
      timestamp: new Date().toISOString()
    })
  }, [status, session, isChecking, redirected, retryCount])

  // Se está autenticado, mostrar conteúdo imediatamente
  if (status === 'authenticated' && session && !isChecking) {
    return <>{children}</>
  }

  // Mostrar loading durante verificação inicial ou tentativas
  if (isChecking || status === 'loading' || retryCount < 3) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <div className="mt-4 text-lg text-gray-600">Verificando autenticação...</div>
          <div className="mt-2 text-sm text-gray-500">
            Status: {status} | Tentativa: {retryCount + 1}/5
          </div>
          {session && (
            <div className="mt-1 text-xs text-green-600">
              Sessão encontrada: {session.user?.email}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Se não está autenticado após várias tentativas, mostrar loading até redirecionamento
  if (status === 'unauthenticated' && retryCount >= 3) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-lg text-gray-600">Redirecionando para login...</div>
          <div className="mt-2 text-sm text-gray-500">
            Nenhuma sessão válida encontrada após {retryCount} tentativas
          </div>
        </div>
      </div>
    )
  }

  // Fallback - mostrar loading
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <div className="mt-4 text-lg text-gray-600">Carregando...</div>
      </div>
    </div>
  )
}
