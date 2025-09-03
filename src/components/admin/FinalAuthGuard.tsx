'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface FinalAuthGuardProps {
  children: React.ReactNode
}

export default function FinalAuthGuard({ children }: FinalAuthGuardProps) {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [retryCount, setRetryCount] = useState(0)
  const [isChecking, setIsChecking] = useState(true)

  // Log para debug
  useEffect(() => {
    console.log('🔍 FinalAuthGuard:', { 
      status, 
      hasSession: !!session, 
      retryCount,
      isChecking
    })
  }, [status, session, retryCount, isChecking])

  // Gerenciar estado de autenticação
  useEffect(() => {
    if (status === 'loading') {
      setIsChecking(true)
      return
    }

    if (status === 'authenticated' && session) {
      console.log('✅ FinalAuthGuard: Usuário autenticado!')
      setIsChecking(false)
      setRetryCount(0)
      return
    }

    if (status === 'unauthenticated') {
      if (retryCount < 3) {
        console.log(`🔄 FinalAuthGuard: Tentativa ${retryCount + 1}/3 de sincronização...`)
        setRetryCount(prev => prev + 1)
        
        // Tentar forçar update da sessão
        setTimeout(async () => {
          try {
            await update()
          } catch (error) {
            console.error('❌ FinalAuthGuard: Erro no update:', error)
          }
        }, 1000)
      } else {
        console.log('❌ FinalAuthGuard: Redirecionando para login...')
        setIsChecking(false)
        router.push('/auth/login')
      }
    }
  }, [status, session, retryCount, update, router])

  // Loading state
  if (isChecking || status === 'loading' || (status === 'unauthenticated' && retryCount < 3)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {retryCount > 0 ? `Sincronizando... (${retryCount}/3)` : 'Verificando autenticação...'}
          </p>
        </div>
      </div>
    )
  }

  // Se chegou aqui, está autenticado
  return <>{children}</>
}
