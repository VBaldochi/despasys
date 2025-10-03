// Real-time Sync Service for Mobile App
import { database } from './firebase'
import { ref, onValue, off, DataSnapshot } from 'firebase/database'

export type EventType = 'process' | 'client' | 'notification' | 'system'

export interface DespaSysEvent {
  id: string
  tenantId: string
  type: EventType
  action: string
  data: any
  timestamp: number
  userId?: string
}

export interface EventListener {
  (event: DespaSysEvent): void
}

class RealtimeSyncService {
  private listeners: Map<string, EventListener[]> = new Map()
  private firebaseRefs: Map<string, any> = new Map()

  /**
   * Conectar a eventos de um tenant específico
   */
  connectToTenant(tenantId: string, eventTypes: EventType[] = ['process', 'client', 'notification']) {
    console.log(`🔗 [MOBILE] Conectando ao tenant: ${tenantId}`)
    
    eventTypes.forEach(eventType => {
      // Paths diferentes para cada tipo de evento
      let eventPath: string
      
      if (eventType === 'notification') {
        eventPath = `tenants/${tenantId}/notifications`
      } else {
        eventPath = `tenants/${tenantId}/events/${eventType}`
      }
      
      console.log(`👂 [MOBILE] Escutando path: ${eventPath}`)
      const eventRef = ref(database, eventPath)
      
      // Listener para novos eventos
      const unsubscribe = onValue(eventRef, (snapshot: DataSnapshot) => {
        console.log(`📡 [MOBILE] Dados recebidos do path ${eventPath}:`, snapshot.exists())
        
        if (snapshot.exists()) {
          const data = snapshot.val()
          console.log(`📊 [MOBILE] Dados:`, Object.keys(data))
          
          // Para notificações, converter para formato de evento
          if (eventType === 'notification') {
            const notifications = Object.entries(data)
              .map(([notifId, notifData]: [string, any]) => ({
                id: notifId,
                tenantId,
                type: 'notification' as EventType,
                action: 'created',
                data: notifData,
                timestamp: notifData.createdAt || Date.now(),
                userId: notifData.targetUser
              }))
            
            // Filtrar eventos recentes (últimos 5 segundos)
            const now = Date.now()
            const recentNotifications = notifications.filter(event => 
              (now - event.timestamp) < 5000 // 5 segundos apenas
            )
            
            console.log(`🔔 [MOBILE] Notificações recentes: ${recentNotifications.length}`)
            
            recentNotifications.forEach(event => {
              this.notifyListeners(`${tenantId}:${eventType}`, event)
            })
          } else {
            // Para outros eventos, processar normalmente
            const events = Object.entries(data)
              .filter(([_, eventData]: [string, any]) => {
                const now = Date.now()
                return (now - (eventData.timestamp || 0)) < 5000 // 5 segundos
              })
              .map(([eventId, eventData]: [string, any]) => ({
                id: eventId,
                ...eventData
              }))
            
            events.forEach(event => {
              this.notifyListeners(`${tenantId}:${eventType}`, event)
            })
          }
        }
      })
      
      // Salvar referência para cleanup
      this.firebaseRefs.set(`${tenantId}:${eventType}`, unsubscribe)
    })
  }

  /**
   * Desconectar de um tenant
   */
  disconnectFromTenant(tenantId: string) {
    console.log(`🔌 Desconectando do tenant: ${tenantId}`)
    
    // Remover todos os listeners deste tenant
    Array.from(this.firebaseRefs.keys())
      .filter(key => key.startsWith(`${tenantId}:`))
      .forEach(key => {
        const unsubscribe = this.firebaseRefs.get(key)
        if (unsubscribe) {
          unsubscribe() // Chama a função de unsubscribe
        }
        this.firebaseRefs.delete(key)
        this.listeners.delete(key)
      })
  }

  /**
   * Adicionar listener para eventos específicos
   */
  addEventListener(tenantId: string, eventType: EventType, listener: EventListener) {
    const key = `${tenantId}:${eventType}`
    
    if (!this.listeners.has(key)) {
      this.listeners.set(key, [])
    }
    
    this.listeners.get(key)?.push(listener)
    console.log(`👂 Listener adicionado para: ${key}`)
  }

  /**
   * Remover listener
   */
  removeEventListener(tenantId: string, eventType: EventType, listener: EventListener) {
    const key = `${tenantId}:${eventType}`
    const listeners = this.listeners.get(key)
    
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
        console.log(`🔇 Listener removido para: ${key}`)
      }
    }
  }

  /**
   * Notificar todos os listeners
   */
  private notifyListeners(key: string, event: DespaSysEvent) {
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event)
        } catch (error) {
          console.error(`Erro no listener ${key}:`, error)
        }
      })
    }
  }

  /**
   * Buscar dados específicos do Firebase
   */
  async getData(tenantId: string, path: string) {
    const dataRef = ref(database, `tenants/${tenantId}/${path}`)
    
    return new Promise((resolve, reject) => {
      onValue(dataRef, (snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val())
        } else {
          resolve(null)
        }
      }, (error) => {
        reject(error)
      }, { onlyOnce: true })
    })
  }

  /**
   * Cleanup geral
   */
  disconnect() {
    console.log('🔌 Desconectando todos os listeners...')
    
    // Remover todos os listeners do Firebase
    this.firebaseRefs.forEach(unsubscribe => {
      if (unsubscribe) {
        unsubscribe()
      }
    })
    
    // Limpar maps
    this.firebaseRefs.clear()
    this.listeners.clear()
  }
}

// Singleton instance
export const realtimeSync = new RealtimeSyncService()

export default realtimeSync
