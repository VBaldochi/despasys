import { useEffect } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue, off } from 'firebase/database';

export type EventType = 'process' | 'client' | 'notification' | 'system';

export interface DespaSysEvent {
  id: string;
  tenantId: string;
  type: EventType;
  action: string;
  data: any;
  timestamp: number;
  userId?: string;
}

/**
 * Hook para escutar eventos de processos em tempo real no Firebase (web).
 * @param tenantId string
 * @param onEvent (event: DespaSysEvent) => void
 */
export function useProcessosRealtimeSyncWeb(
  tenantId: string | undefined,
  onEvent: (event: DespaSysEvent) => void
) {
  useEffect(() => {
    if (!tenantId) return;
    const eventPath = `tenants/${tenantId}/events/process`;
    const eventRef = ref(database, eventPath);

    const handleValue = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const now = Date.now();
        Object.entries(data).forEach(([eventId, eventData]: [string, any]) => {
          // Só eventos dos últimos 5 segundos
          if ((now - (eventData.timestamp || 0)) < 5000) {
            onEvent({
              id: eventId,
              tenantId,
              type: 'process',
              action: eventData.action,
              data: eventData.data,
              timestamp: eventData.timestamp,
              userId: eventData.userId,
            });
          }
        });
      }
    };

    onValue(eventRef, handleValue);
    return () => off(eventRef, 'value', handleValue);
  }, [tenantId, onEvent]);
}
