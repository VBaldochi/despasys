'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface DebugAuthGuardProps {
  children: React.ReactNode
}

export default function DebugAuthGuard({ children }: DebugAuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [serverSession, setServerSession] = useState<any>(null)

  // Log detalhado do estado atual
  useEffect(() => {
    const info = {
      status,
      hasSession: !!session,
      sessionData: session,
      timestamp: new Date().toISOString()
    }
    setDebugInfo(info)
    console.log('🔍 DebugAuthGuard - Estado atual:', info)
  }, [session, status])

  // Verificar sessão no servidor
  useEffect(() => {
    const checkServerSession = async () => {
      try {
        const response = await fetch('/api/debug/auth-status')
        const data = await response.json()
        setServerSession(data)
        console.log('🌐 DebugAuthGuard - Servidor:', data)
      } catch (error) {
        console.error('🌐 DebugAuthGuard - Erro ao verificar servidor:', error)
      }
    }
    
    checkServerSession()
  }, [])

  // Force update session
  const { update } = useSession()
  useEffect(() => {
    const forceUpdate = async () => {
      try {
        console.log('🔄 DebugAuthGuard - Forçando update da sessão...')
        await update()
      } catch (error) {
        console.error('🔄 DebugAuthGuard - Erro no update:', error)
      }
    }
    
    if (status === 'unauthenticated') {
      forceUpdate()
    }
  }, [status, update])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
          <div className="mt-4 text-xs text-gray-500">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Debug - Não Autenticado</h2>
          
          <div className="text-left bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-bold">Cliente (useSession):</h3>
            <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>

          {serverSession && (
            <div className="text-left bg-green-100 p-4 rounded mb-4">
              <h3 className="font-bold">Servidor:</h3>
              <pre className="text-xs">{JSON.stringify(serverSession, null, 2)}</pre>
            </div>
          )}

          <div className="space-y-2">
            <button 
              onClick={() => router.push('/auth/login')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded"
            >
              Ir para Login
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      </div>
    )
  }

  console.log('✅ DebugAuthGuard - Usuário autenticado, renderizando children')
  return <>{children}</>
}
