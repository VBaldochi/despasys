'use client'

import { useState, useEffect } from 'react'

// Componente simplificado de debug que não depende do next-auth/react
export default function SessionDiagnostic() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔍 Client Session Debug:', {
        cookies: document.cookie,
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    }
  }, [])

  const fetchDebugInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/session')
      const data = await response.json()
      setDebugInfo(data)
      console.log('🔍 Server Debug Info:', data)
    } catch (error) {
      console.error('❌ Failed to fetch debug info:', error)
    } finally {
      setLoading(false)
    }
  }

  const cleanupSessions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup' })
      })
      const data = await response.json()
      console.log('🧹 Cleanup result:', data)
      alert(`Cleaned up ${data.result?.cleaned || 0} expired sessions`)
    } catch (error) {
      console.error('❌ Failed to cleanup:', error)
      alert('Cleanup failed')
    } finally {
      setLoading(false)
    }
  }

  const forceLogout = async () => {
    try {
      // Limpar tudo do cliente
      localStorage.clear()
      sessionStorage.clear()
      
      // Limpar cookies manualmente
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Redirecionar para login
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('❌ Force logout failed:', error)
      window.location.href = '/auth/login'
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    return null // Só mostrar em desenvolvimento
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Session Debug</h3>
      
      <div className="text-xs mb-3">
        <div>Environment: <span className="font-mono">{process.env.NODE_ENV}</span></div>
        <div>Timestamp: <span className="font-mono">{new Date().toLocaleTimeString()}</span></div>
      </div>

      <div className="space-y-2">
        <button
          onClick={fetchDebugInfo}
          disabled={loading}
          className="w-full text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Debug Server'}
        </button>
        
        <button
          onClick={cleanupSessions}
          disabled={loading}
          className="w-full text-xs bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded disabled:opacity-50"
        >
          Cleanup Sessions
        </button>
        
        <button
          onClick={forceLogout}
          disabled={loading}
          className="w-full text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded disabled:opacity-50"
        >
          Force Logout
        </button>
      </div>

      {debugInfo && (
        <div className="mt-3 text-xs">
          <details>
            <summary className="cursor-pointer">Server Info</summary>
            <pre className="mt-1 bg-gray-900 p-2 rounded overflow-auto max-h-40 text-xs">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}
