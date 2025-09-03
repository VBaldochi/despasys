'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useSessionSync() {
  const { data: session, status, update } = useSession()
  const [serverSession, setServerSession] = useState<any>(null)
  const [syncAttempts, setSyncAttempts] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar sessão no servidor
  const checkServerSession = async () => {
    try {
      const response = await fetch('/api/debug/auth-status')
      const data = await response.json()
      setServerSession(data)
      return data
    } catch (error) {
      console.error('❌ useSessionSync - Erro ao verificar servidor:', error)
      return null
    }
  }

  // Forçar sincronização
  const forceSync = async () => {
    try {
      console.log('🔄 useSessionSync - Forçando sincronização...')
      
      // 1. Verificar se há sessão no servidor
      const serverData = await checkServerSession()
      
      if (serverData?.hasSession && !session) {
        console.log('🔄 useSessionSync - Servidor tem sessão, cliente não. Forçando update...')
        
        // 2. Forçar update da sessão
        await update()
        
        // 3. Aguardar um pouco e verificar novamente
        setTimeout(async () => {
          await update()
        }, 1000)
        
        setSyncAttempts(prev => prev + 1)
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error('❌ useSessionSync - Erro na sincronização:', error)
      setIsLoading(false)
    }
  }

  // Executar sincronização inicial
  useEffect(() => {
    forceSync()
  }, [])

  // Re-tentar sincronização se ainda não tiver sessão
  useEffect(() => {
    if (status === 'unauthenticated' && syncAttempts < 3) {
      const timer = setTimeout(() => {
        forceSync()
      }, 2000 * (syncAttempts + 1)) // Intervalo crescente: 2s, 4s, 6s
      
      return () => clearTimeout(timer)
    }
  }, [status, syncAttempts])

  return {
    session,
    status,
    serverSession,
    syncAttempts,
    isLoading: isLoading || status === 'loading',
    forceSync,
    isSessionSynced: !!session && !!serverSession?.hasSession
  }
}
