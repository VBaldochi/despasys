'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

interface ServerAuthGuardProps {
  children: React.ReactNode
}

export default function ServerAuthGuard({ children }: ServerAuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  // Função para verificar sessão direto no servidor
  const checkServerSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
        cache: 'no-cache'
      })
      
      if (response.ok) {
        const serverSession = await response.json()
        console.log('ServerAuthGuard - Sessão do servidor:', serverSession)
        
        if (serverSession && serverSession.user) {
          setIsAuthenticated(true)
          return true
        }
      }
      
      setIsAuthenticated(false)
      return false
    } catch (error) {
      console.error('ServerAuthGuard - Erro ao verificar sessão:', error)
      setIsAuthenticated(false)
      return false
    }
  }, [])

  useEffect(() => {
    const verifyAuth = async () => {
      console.log('ServerAuthGuard - Verificando autenticação...', { status, hasSession: !!session })
      
      // Dar prioridade para a sessão do NextAuth se disponível
      if (status === 'authenticated' && session) {
        console.log('ServerAuthGuard - Autenticado via NextAuth')
        setIsAuthenticated(true)
        setIsChecking(false)
        return
      }
      
      // Se NextAuth diz que não está autenticado, verificar no servidor
      if (status === 'unauthenticated') {
        console.log('ServerAuthGuard - NextAuth diz não autenticado, verificando servidor...')
        const hasServerSession = await checkServerSession()
        
        if (!hasServerSession) {
          console.log('ServerAuthGuard - Servidor confirma não autenticado, redirecionando...')
          router.replace('/auth/login?tenant=demo')
        }
        
        setIsChecking(false)
        return
      }
      
      // Se ainda está carregando, aguardar mais um pouco
      if (status === 'loading') {
        setTimeout(() => {
          if (status === 'loading') {
            // Se ainda está carregando após timeout, verificar servidor
            checkServerSession().then(() => setIsChecking(false))
          }
        }, 3000)
        return
      }
      
      setIsChecking(false)
    }

    verifyAuth()
  }, [status, session, router, checkServerSession])

  // Se claramente autenticado, mostrar conteúdo
  if (isAuthenticated === true || (status === 'authenticated' && session)) {
    return <>{children}</>
  }

  // Se claramente não autenticado, mostrar redirecionamento
  if (isAuthenticated === false && status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-lg text-gray-600">Redirecionando para login...</div>
        </div>
      </div>
    )
  }

  // Mostrar loading durante verificação
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <div className="mt-4 text-lg text-gray-600">Verificando autenticação...</div>
        <div className="mt-2 text-sm text-gray-500">
          NextAuth: {status} | Servidor: {isAuthenticated === null ? 'Verificando...' : isAuthenticated ? 'Autenticado' : 'Não autenticado'}
        </div>
        {session && (session as any).user && (
          <div className="mt-1 text-xs text-green-600">
            Sessão: {(session as any).user?.email}
          </div>
        )}
      </div>
    </div>
  )
}
