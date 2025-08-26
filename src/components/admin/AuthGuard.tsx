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

  useEffect(() => {
    // Aguardar um tempo para que a sessão seja carregada
    const timer = setTimeout(() => {
      setIsChecking(false)
      
      // Só redirecionar se definitivamente não estiver autenticado
      if (status === 'unauthenticated') {
        console.log('AuthGuard - Redirecionando para login')
        router.replace('/auth/login?tenant=demo')
      }
    }, 1000) // 1 segundo de delay

    return () => clearTimeout(timer)
  }, [status, router])

  console.log('AuthGuard - Status:', status, 'Session:', !!session, 'Checking:', isChecking)

  // Mostrar loading durante verificação inicial
  if (isChecking || status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <div className="mt-4 text-lg text-gray-600">Verificando autenticação...</div>
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
