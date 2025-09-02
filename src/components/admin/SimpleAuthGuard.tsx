'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SimpleAuthGuardProps {
  children: React.ReactNode
}

export default function SimpleAuthGuard({ children }: SimpleAuthGuardProps) {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [retryCount, setRetryCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('SimpleAuthGuard:', { status, hasSession: !!session, retryCount })
    
    // Se ainda está carregando e não fez muitas tentativas, aguardar
    if (status === 'loading' && retryCount < 10) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1)
        // Forçar update da sessão
        update()
      }, 500)
      
      return () => clearTimeout(timer)
    }
    
    // Se definitivamente não autenticado após várias tentativas
    if (status === 'unauthenticated' && retryCount >= 5) {
      console.log('Redirecionando para login após', retryCount, 'tentativas')
      router.replace('/auth/login?tenant=demo')
      return
    }
    
    // Se autenticado, parar loading
    if (status === 'authenticated' && session) {
      setIsLoading(false)
      return
    }
    
    // Continuar loading se ainda não tem resposta definitiva
    if (retryCount < 10) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
    
  }, [status, session, router, retryCount, update])

  // Se claramente autenticado, mostrar conteúdo
  if (status === 'authenticated' && session && !isLoading) {
    return <>{children}</>
  }

  // Se definitivamente não autenticado
  if (status === 'unauthenticated' && retryCount >= 5) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-lg text-gray-600">Redirecionando...</div>
        </div>
      </div>
    )
  }

  // Mostrar loading
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <div className="mt-4 text-lg text-gray-600">Verificando autenticação...</div>
        <div className="mt-2 text-sm text-gray-500">
          Status: {status} | Tentativa: {retryCount + 1}/10
        </div>
        {session && (
          <div className="mt-1 text-xs text-green-600">
            Sessão encontrada: {(session as any).user?.email}
          </div>
        )}
      </div>
    </div>
  )
}
