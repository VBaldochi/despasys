'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// Define a interface para o estado da mensagem
interface MessageState {
  type: 'success' | 'error' | ''
  text: string
}

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' })

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Token de redefinição não encontrado ou inválido.' })
    }
  }, [token])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage({ type: '', text: '' })

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' })
      return
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 8 caracteres.' })
      return
    }

    if (!token) {
      setMessage({ type: 'error', text: 'Token inválido. Solicite um novo link.' })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao redefinir a senha.')
      }

      setMessage({
        type: 'success',
        text: 'Senha redefinida com sucesso! Redirecionando para o login...',
      })

      // Redireciona para o login após 3 segundos
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)

    } catch (error) {
      setMessage({
        type: 'error',
        text: (error as Error).message || 'Ocorreu um erro. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Criar Nova Senha
        </h2>

        {message.text && (
          <div
            className={`p-3 rounded-md mb-4 text-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {message.type !== 'success' && token && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nova Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Nova Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Redefinir Senha'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// Envolve o componente com Suspense, assim como no seu login/page.tsx
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}