// Real-time Dashboard Component
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useRealtimeSync } from '../hooks/useRealtimeSync'
import type { DespaSysEvent } from '../services/realtimeSync'

interface RealtimeDashboardProps {
  tenantId: string
}

export function RealtimeDashboard({ tenantId }: RealtimeDashboardProps) {
  const { 
    isConnected, 
    lastEvent, 
    events, 
    connect, 
    disconnect 
  } = useRealtimeSync({ 
    tenantId,
    eventTypes: ['notification'], // Começar só com notificações
    autoConnect: true
  })

  const [processCount, setProcessCount] = useState(0)
  const [clientCount, setClientCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)

  // Contar eventos por tipo
  useEffect(() => {
    const processos = events.filter(e => e.type === 'process').length
    const clientes = events.filter(e => e.type === 'client').length
    const notificacoes = events.filter(e => e.type === 'notification').length

    setProcessCount(processos)
    setClientCount(clientes)
    setNotificationCount(notificacoes)
  }, [events])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR')
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'process': return '📋'
      case 'client': return '👤'
      case 'notification': return '🔔'
      case 'system': return '⚙️'
      default: return '📨'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'process': return '#007AFF'
      case 'client': return '#34C759'
      case 'notification': return '#FF9500'
      case 'system': return '#8E8E93'
      default: return '#000000'
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📡 Sincronização Real-Time</Text>
        <View style={[styles.status, { backgroundColor: isConnected ? '#34C759' : '#FF3B30' }]}>
          <Text style={styles.statusText}>
            {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{processCount}</Text>
          <Text style={styles.statLabel}>📋 Processos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{clientCount}</Text>
          <Text style={styles.statLabel}>👤 Clientes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{notificationCount}</Text>
          <Text style={styles.statLabel}>🔔 Notificações</Text>
        </View>
      </View>

      {/* Last Event */}
      {lastEvent && (
        <View style={styles.lastEvent}>
          <Text style={styles.sectionTitle}>Último Evento</Text>
          <View style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventIcon}>{getEventIcon(lastEvent.type)}</Text>
              <Text style={styles.eventType}>{lastEvent.type.toUpperCase()}</Text>
              <Text style={styles.eventTime}>{formatTime(lastEvent.timestamp)}</Text>
            </View>
            <Text style={styles.eventAction}>{lastEvent.action}</Text>
            {lastEvent.data && (
              <Text style={styles.eventData} numberOfLines={2}>
                {JSON.stringify(lastEvent.data)}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Events List */}
      <View style={styles.eventsList}>
        <Text style={styles.sectionTitle}>Eventos Recentes ({events.length})</Text>
        <ScrollView style={styles.eventsScroll} showsVerticalScrollIndicator={false}>
          {events.map((event, index) => (
            <View key={`${event.id}-${index}`} style={styles.eventItem}>
              <View style={[styles.eventDot, { backgroundColor: getEventColor(event.type) }]} />
              <View style={styles.eventContent}>
                <View style={styles.eventRow}>
                  <Text style={styles.eventTypeSmall}>{getEventIcon(event.type)} {event.type}</Text>
                  <Text style={styles.eventTimeSmall}>{formatTime(event.timestamp)}</Text>
                </View>
                <Text style={styles.eventActionSmall}>{event.action}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: isConnected ? '#FF3B30' : '#007AFF' }]}
          onPress={isConnected ? disconnect : connect}
        >
          <Text style={styles.buttonText}>
            {isConnected ? '🔌 Desconectar' : '🔗 Conectar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D1D1F',
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  lastEvent: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  eventType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    flex: 1,
  },
  eventTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  eventAction: {
    fontSize: 16,
    color: '#1D1D1F',
    marginBottom: 8,
  },
  eventData: {
    fontSize: 12,
    color: '#8E8E93',
    backgroundColor: '#F5F5F7',
    padding: 8,
    borderRadius: 6,
  },
  eventsList: {
    flex: 1,
  },
  eventsScroll: {
    flex: 1,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTypeSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  eventTimeSmall: {
    fontSize: 10,
    color: '#8E8E93',
  },
  eventActionSmall: {
    fontSize: 14,
    color: '#1D1D1F',
  },
  controls: {
    marginTop: 16,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default RealtimeDashboard
