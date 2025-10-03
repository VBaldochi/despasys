// React Hook for Real-time Sync
import { useEffect, useState, useCallback } from 'react'
import { realtimeSync, DespaSysEvent, EventType, EventListener } from '../services/realtimeSync'

interface UseRealtimeSyncOptions {
  tenantId: string
  eventTypes?: EventType[]
  autoConnect?: boolean
}

interface UseRealtimeSyncReturn {
  isConnected: boolean
  lastEvent: DespaSysEvent | null
  events: DespaSysEvent[]
  connect: () => void
  disconnect: () => void
  addEventListener: (eventType: EventType, listener: EventListener) => void
  removeEventListener: (eventType: EventType, listener: EventListener) => void
}

export function useRealtimeSync({
  tenantId,
  eventTypes = ['process', 'client', 'notification'],
  autoConnect = true
}: UseRealtimeSyncOptions): UseRealtimeSyncReturn {
  
  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<DespaSysEvent | null>(null)
  const [events, setEvents] = useState<DespaSysEvent[]>([])
  const [processedEventIds] = useState(new Set<string>()) // Controle de duplicatas

  // Listener global para capturar todos os eventos
  const globalListener = useCallback((event: DespaSysEvent) => {
    // Evitar duplicatas
    if (processedEventIds.has(event.id)) {
      console.log(`� [MOBILE] Evento duplicado ignorado: ${event.id}`)
      return
    }
    
    processedEventIds.add(event.id)
    console.log(`�📨 [MOBILE] Novo evento recebido:`, event.type, event.action, event.id)
    
    setLastEvent(event)
    setEvents(prev => {
      // Verificar se já existe antes de adicionar
      const exists = prev.some(e => e.id === event.id)
      if (exists) return prev
      
      // Manter apenas os últimos 50 eventos
      const newEvents = [event, ...prev].slice(0, 50)
      return newEvents
    })
  }, [processedEventIds])

  // Conectar ao tenant
  const connect = useCallback(() => {
    if (!isConnected) {
      console.log(`🔗 Conectando hook ao tenant: ${tenantId}`)
      
      // Conectar ao serviço
      realtimeSync.connectToTenant(tenantId, eventTypes)
      
      // Adicionar listeners globais
      eventTypes.forEach(eventType => {
        realtimeSync.addEventListener(tenantId, eventType, globalListener)
      })
      
      setIsConnected(true)
    }
  }, [tenantId, eventTypes, isConnected, globalListener])

  // Desconectar do tenant
  const disconnect = useCallback(() => {
    if (isConnected) {
      console.log(`🔌 Desconectando hook do tenant: ${tenantId}`)
      
      // Remover listeners globais
      eventTypes.forEach(eventType => {
        realtimeSync.removeEventListener(tenantId, eventType, globalListener)
      })
      
      // Desconectar do serviço
      realtimeSync.disconnectFromTenant(tenantId)
      
      setIsConnected(false)
      setLastEvent(null)
      setEvents([])
    }
  }, [tenantId, eventTypes, isConnected, globalListener])

  // Adicionar listener específico
  const addEventListener = useCallback((eventType: EventType, listener: EventListener) => {
    realtimeSync.addEventListener(tenantId, eventType, listener)
  }, [tenantId])

  // Remover listener específico
  const removeEventListener = useCallback((eventType: EventType, listener: EventListener) => {
    realtimeSync.removeEventListener(tenantId, eventType, listener)
  }, [tenantId])

  // Auto-connect quando o hook é montado
  useEffect(() => {
    if (autoConnect && !isConnected) {
      connect()
    }

    // Cleanup quando desmonta
    return () => {
      disconnect()
    }
  }, [tenantId]) // Apenas quando tenantId mudar

  return {
    isConnected,
    lastEvent,
    events,
    connect,
    disconnect,
    addEventListener,
    removeEventListener
  }
}

export default useRealtimeSync
