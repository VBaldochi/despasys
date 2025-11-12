'use client'

import { useState } from 'react'

export default function TestNotificationsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'>('INFO')
  const [tenantId, setTenantId] = useState('demo')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSend = async () => {
    if (!title || !message) {
      setResult({ success: false, message: 'Preencha título e mensagem!' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type, tenantId })
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ 
          success: true, 
          message: `✅ Notificação enviada! ID: ${data.notification?.id}` 
        })
        // Limpar formulário
        setTitle('')
        setMessage('')
      } else {
        setResult({ 
          success: false, 
          message: `❌ Erro: ${data.error}` 
        })
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: `❌ Erro de conexão: ${error}` 
      })
    } finally {
      setLoading(false)
    }
  }

  const quickMessages = [
    { title: '🎉 Processo Concluído', message: 'O processo PROC-2025-001 foi finalizado com sucesso!', type: 'SUCCESS' },
    { title: '⚠️ Documento Pendente', message: 'Aguardando envio de documentos para o processo PROC-2025-002', type: 'WARNING' },
    { title: '❌ Erro no Sistema', message: 'Falha ao processar pagamento. Tente novamente.', type: 'ERROR' },
    { title: 'ℹ️ Atualização', message: 'Nova funcionalidade disponível no sistema!', type: 'INFO' },
  ]

  const handleQuickMessage = (quick: typeof quickMessages[0]) => {
    setTitle(quick.title)
    setMessage(quick.message)
    setType(quick.type as any)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
          🧪 Teste de Mensageria
        </h1>
        <p style={{ color: '#666' }}>
          Envie notificações para testar o Firebase Realtime Sync com o mobile
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Formulário */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
            Enviar Notificação
          </h2>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '24px' }}>
            Preencha os dados e envie para o mobile
          </p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Tenant ID
            </label>
            <input
              type="text"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                fontFamily: 'monospace',
                backgroundColor: '#f5f5f5'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
              Use "demo" para testar com o mobile
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Título
            </label>
            <input
              type="text"
              placeholder="Ex: 🚗 Processo Atualizado"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Mensagem
            </label>
            <textarea
              placeholder="Digite a mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="INFO">ℹ️ Info</option>
              <option value="SUCCESS">✅ Sucesso</option>
              <option value="WARNING">⚠️ Aviso</option>
              <option value="ERROR">❌ Erro</option>
            </select>
          </div>

          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Enviando...' : '📤 Enviar Notificação'}
          </button>

          {result && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: result.success ? '#d4edda' : '#f8d7da',
              color: result.success ? '#155724' : '#721c24',
              border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              {result.message}
            </div>
          )}
        </div>

        {/* Mensagens Rápidas */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
            Mensagens Rápidas
          </h2>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '16px' }}>
            Clique para preencher automaticamente
          </p>

          {quickMessages.map((quick, index) => (
            <button
              key={index}
              onClick={() => handleQuickMessage(quick)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '6px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {quick.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>
                {quick.message.substring(0, 50)}...
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instruções */}
      <div style={{ 
        marginTop: '24px',
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>
          📋 Como Testar
        </h2>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Abra o app mobile no emulador/dispositivo</li>
          <li>Faça login com o tenant <code style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '2px 6px', 
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>demo</code></li>
          <li>Vá para a aba <strong>"Sync"</strong> (última tab)</li>
          <li>Envie uma notificação usando o formulário acima</li>
          <li>Veja a notificação aparecer no mobile em <strong>tempo real!</strong> 🎉</li>
        </ol>
        
        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '6px' 
        }}>
          <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', margin: 0 }}>
            <strong>Firebase URL:</strong><br />
            https://despasys-production-80bf2-default-rtdb.firebaseio.com/tenants/demo/notifications
          </p>
        </div>
      </div>
    </div>
  )
}
