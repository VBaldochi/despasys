'use client'

import { useState } from 'react'
import Link from 'next/link'

// Define a interface para o estado da mensagem
interface MessageState {
  type: 'success' | 'error' | ''
  text: string
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      // O backend sempre retorna 200 (por segurança), mesmo se o e-mail não existir
      setMessage({
        type: 'success',
        text: 'Se este e-mail estiver cadastrado, enviaremos um link de redefinição.',
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Ocorreu um erro. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Recuperar Senha
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

        {message.type !== 'success' && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  'Enviar Link de Redefinição'
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
            Lembrou a senha? Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  )
}