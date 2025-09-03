'use client'

import { useState, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const tenantDomain = searchParams.get('tenant') || 'demo'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Login - Tentando autenticar com:', { email, tenantDomain })
      
      // Primeiro, verificar se o tenant existe
      const tenantCheck = await fetch(`/api/tenant/${tenantDomain}`)
      if (!tenantCheck.ok) {
        setError('Tenant não encontrado')
        setIsLoading(false)
        return
      }

      // Debug: Testar autenticação antes do signIn
      console.log('Login - Testando autenticação...')
      const debugResponse = await fetch('/api/debug/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, tenantDomain })
      })
      
      const debugResult = await debugResponse.json()
      console.log('Login - Debug auth result:', debugResult)
      
      if (!debugResult.success) {
        setError(`Erro na autenticação: ${debugResult.error} (step: ${debugResult.step})`)
        setIsLoading(false)
        return
      }
      
      const result = await signIn('credentials', {
        email,
        password,
        tenantDomain,
        callbackUrl: `${window.location.origin}/dashboard`,
        redirect: false  // Mudando para false para controlar o processo
      })

      console.log('Login - Resultado completo do signIn:', result)
      
      if (result?.error) {
        console.log('Login - Erro:', result.error)
        setError('Email ou senha incorretos')
      } else if (result?.ok) {
        console.log('Login - Sucesso, verificando sessão...')
        
        // Aguardar mais tempo para NextAuth processar completamente
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Tentar obter sessão várias vezes
        let session = null
        for (let i = 0; i < 5; i++) {
          session = await getSession()
          console.log(`Login - Tentativa ${i + 1} de obter sessão:`, session)
          
          if (session) break
          
          // Aguardar antes da próxima tentativa
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        if (session) {
          console.log('Login - Sessão confirmada, redirecionando...')
          // Usar window.location ao invés de router para força reload completo
          window.location.href = '/dashboard'
        } else {
          console.log('Login - Sessão não foi criada após várias tentativas')
          // Tentar redirecionar mesmo assim - o AuthGuard pode conseguir pegar a sessão
          setError('Redirecionando...')
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 1000)
        }
      } else {
        setError('Erro no processo de login')
      }
    } catch (error) {
      console.error('Login - Erro interno:', error)
      setError('Erro interno. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Lazuli ERP
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entre na sua conta para continuar
          </p>
          <div className="mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full inline-block">
            Tenant: {tenantDomain}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@demo-despachante.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Credenciais de Demonstração:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Email:</strong> admin@demo-despachante.com</p>
              <p><strong>Senha:</strong> admin123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Sistema de Gestão para Despachantes
          </p>
          <a 
            href="/select-tenant" 
            className="text-xs text-blue-600 hover:text-blue-500"
          >
            Voltar à seleção de tenant
          </a>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
