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
  const [isChecking, setIsChecking] = useState(true)
  const [hasCheckedServer, setHasCheckedServer] = useState(false)

  // Função para verificar sessão no servidor
  const checkServerSession = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
        cache: 'no-cache'
      })
      
      if (response.ok) {
        const serverSession = await response.json()
        console.log('🌐 Server session check:', serverSession)
        return serverSession && serverSession.user ? serverSession : null
      }
      return null
    } catch (error) {
      console.error('❌ Server session check failed:', error)
      return null
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 SimpleAuthGuard:', { status, hasSession: !!session, retryCount, isChecking })
      
      // Se está autenticado via NextAuth, permitir acesso imediatamente
      if (status === 'authenticated' && session) {
        console.log('✅ Authenticated via NextAuth')
        setIsChecking(false)
        return
      }
      
      // Se está carregando e não fez muitas tentativas, aguardar
      if (status === 'loading' && retryCount < 15) {
        console.log(`⏳ Loading... retry ${retryCount + 1}/15`)
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          update() // Forçar refresh da sessão
        }, 500)
        return
      }
      
      // Se não está autenticado mas ainda não verificou servidor
      if (status === 'unauthenticated' && !hasCheckedServer && retryCount < 10) {
        console.log('🌐 Checking server session...')
        setHasCheckedServer(true)
        
        const serverSession = await checkServerSession()
        if (serverSession) {
          console.log('✅ Found session on server, forcing update...')
          await update()
          setTimeout(() => setRetryCount(prev => prev + 1), 1000)
          return
        }
      }
      
      // Se definitivamente não autenticado após várias tentativas
      if ((status === 'unauthenticated' && retryCount >= 8) || retryCount >= 15) {
        console.log(`❌ No authentication found after ${retryCount} attempts, redirecting...`)
        setIsChecking(false)
        router.replace('/auth/login?tenant=demo')
        return
      }
      
      // Continuar tentativas
      if (retryCount < 15) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          update()
        }, 1000)
      }
    }

    checkAuth()
  }, [status, session, router, retryCount, update, hasCheckedServer])

  // Se claramente autenticado, mostrar conteúdo
  if (status === 'authenticated' && session && !isChecking) {
    return <>{children}</>
  }

  // Se definitivamente não autenticado
  if (!isChecking && (status === 'unauthenticated' && retryCount >= 8)) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-lg text-gray-600">Redirecionando para login...</div>
        </div>
      </div>
    )
  }

  // Mostrar loading com informações detalhadas
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <div className="mt-4 text-lg text-gray-600">Verificando autenticação...</div>
        <div className="mt-2 text-sm text-gray-500">
          NextAuth: {status} | Tentativa: {retryCount + 1}/15
        </div>
        {session && (
          <div className="mt-1 text-xs text-green-600">
            Sessão: {(session as any).user?.email}
          </div>
        )}
        <div className="mt-1 text-xs text-gray-400">
          {!hasCheckedServer && status === 'unauthenticated' ? 'Verificando servidor...' : 
           hasCheckedServer ? 'Servidor verificado' : 'Aguardando NextAuth...'}
        </div>
      </div>
    </div>
  )
}
