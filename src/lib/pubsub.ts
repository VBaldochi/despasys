// Google Cloud Pub/Sub Configuration
import { PubSub } from '@google-cloud/pubsub'

// Initialize Pub/Sub client
export const pubsub = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
})

// Event Bus para publicar eventos
export class DespaSysEventBus {
  
  /**
   * Publica um evento no Pub/Sub
   */
  static async publishEvent(
    tenantId: string,
    eventType: string,
    data: any,
    metadata: any = {}
  ) {
    try {
      const topicName = `despasys-tenant-${tenantId}-${eventType}`
      const topic = pubsub.topic(topicName)
      
      // Criar tópico se não existir
      const [exists] = await topic.exists()
      if (!exists) {
        await topic.create()
        console.log(`✅ Tópico criado: ${topicName}`)
      }
      
      // Preparar mensagem
      const message = {
        eventId: crypto.randomUUID(),
        eventType,
        timestamp: Date.now(),
        version: '1.0',
        source: 'web',
        tenantId,
        data,
        metadata
      }
      
      // Publicar mensagem
      const messageId = await topic.publishMessage({
        data: Buffer.from(JSON.stringify(message)),
        attributes: {
          eventType,
          tenantId,
          source: 'web'
        }
      })
      
      console.log(`📡 Evento publicado: ${eventType} (${messageId})`)
      return messageId
      
    } catch (error) {
      console.error('❌ Erro ao publicar evento:', error)
      throw error
    }
  }
  
  /**
   * Cria todos os tópicos necessários para um tenant
   */
  static async createTenantTopics(tenantId: string) {
    const eventTypes = ['processes', 'clients', 'financial', 'appointments', 'notifications', 'system']
    
    for (const eventType of eventTypes) {
      const topicName = `despasys-tenant-${tenantId}-${eventType}`
      const topic = pubsub.topic(topicName)
      
      try {
        const [exists] = await topic.exists()
        if (!exists) {
          await topic.create()
          console.log(`✅ Tópico criado: ${topicName}`)
        }
      } catch (error) {
        console.error(`❌ Erro ao criar tópico ${topicName}:`, error)
      }
    }
  }
}
