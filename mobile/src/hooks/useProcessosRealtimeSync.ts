import { useEffect } from 'react'
import { useAuthStore } from '../store/auth'
import { useProcessosStore } from '../store/processos'
import { useRealtimeSync } from './useRealtimeSync'
import type { DespaSysEvent } from '../services/realtimeSync'
import type { Process } from '../types'

export function useProcessosRealtimeSync() {
  const { user } = useAuthStore()
  const tenantId = user?.tenantId
  const { setProcessos, addProcesso, updateProcesso, removeProcesso } = useProcessosStore.getState()

  // Escuta eventos de processo em tempo real
  const { events } = useRealtimeSync({
    tenantId: tenantId || '',
    eventTypes: ['process'],
    autoConnect: !!tenantId
  })

  useEffect(() => {
    if (!tenantId) return
    if (!events.length) return

    events.forEach((event: DespaSysEvent) => {
      const processo: Process = event.data
      if (!processo || !processo.id) return

      if (event.action === 'created') {
        addProcesso(processo)
      } else if (event.action === 'updated') {
        updateProcesso(processo)
      } else if (event.action === 'deleted') {
        removeProcesso(processo.id)
      }
    })
    // eslint-disable-next-line
  }, [events, tenantId])
}

export default useProcessosRealtimeSync
