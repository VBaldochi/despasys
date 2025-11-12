// Dual-Write Service: Neon + Firebase Sync
import { prisma } from './prisma'
import { adminDatabase } from './firebase-admin'
import { DespaSysEventBus } from './pubsub'

export class DualWriteService {
  
  /**
   * Criar processo no Neon + Sincronizar com Firebase
   */
  static async createProcess(data: any, tenantId: string, userId: string) {
    try {
      // 1. Salvar no Neon (banco principal)
      const process = await (prisma as any).process.create({
        data: {
          ...data,
          tenantId,
          createdBy: userId
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
      
      console.log('💾 Processo salvo no Neon:', process.id)
      
      // 2. Sincronizar com Firebase (cache tempo real)
      await this.syncToFirebase(tenantId, 'processes', process.id, {
        id: process.id,
        numero: process.numero,
        tipo: process.tipo,
        status: process.status,
        clienteId: process.customerId,
        clienteNome: process.customer?.name || 'Cliente',
        prioridade: process.priority || 'MEDIUM',
        createdAt: process.createdAt.getTime(),
        updatedAt: Date.now(),
        source: 'web'
      })
      
      // 3. Publicar evento Pub/Sub
      await DespaSysEventBus.publishEvent(tenantId, 'processes', {
        action: 'created',
        data: {
          id: process.id,
          numero: process.numero,
          tipo: process.tipo,
          cliente: {
            id: process.customer?.id,
            name: process.customer?.name
          },
          status: process.status,
          prioridade: process.priority || 'MEDIUM'
        }
      }, {
        notifyMobile: true,
        pushNotification: process.priority === 'URGENT'
      })
      
      return process
      
    } catch (error) {
      console.error('❌ Erro no dual-write (processo):', error)
      throw error
    }
  }
  
  /**
   * Atualizar status do processo
   */
  static async updateProcessStatus(
    processId: string, 
    newStatus: string, 
    tenantId: string, 
    userId: string,
    reason?: string
  ) {
    try {
      // 1. Atualizar no Neon
      const updatedProcess = await (prisma as any).process.update({
        where: { id: processId },
        data: { 
          status: newStatus,
          updatedAt: new Date(),
          updatedBy: userId
        },
        include: {
          customer: {
            select: { id: true, name: true }
          }
        }
      })
      
      // 2. Sincronizar com Firebase
      await this.syncToFirebase(tenantId, 'processes', processId, {
        status: newStatus,
        updatedAt: Date.now(),
        updatedBy: userId,
        source: 'web'
      })
      
      // 3. Publicar evento de status changed
      await DespaSysEventBus.publishEvent(tenantId, 'processes', {
        action: 'status_changed',
        data: {
          id: processId,
          numero: updatedProcess.numero,
          previousStatus: 'PENDING', // TODO: pegar status anterior
          newStatus,
          changedBy: userId,
          reason,
          cliente: updatedProcess.customer
        }
      })
      
      return updatedProcess
      
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error)
      throw error
    }
  }
  
  /**
   * Criar cliente no Neon + Sincronizar com Firebase
   */
  static async createClient(data: any, tenantId: string, userId: string) {
    try {
      // 1. Salvar no Neon
      const client = await (prisma as any).customer.create({
        data: {
          ...data,
          tenantId,
          createdBy: userId
        }
      })
      
      // 2. Sincronizar com Firebase
      await this.syncToFirebase(tenantId, 'clients', client.id, {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        cpf: client.cpf,
        createdAt: client.createdAt.getTime(),
        updatedAt: Date.now(),
        source: 'web'
      })
      
      // 3. Publicar evento
      await DespaSysEventBus.publishEvent(tenantId, 'clients', {
        action: 'created',
        data: {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone
        }
      })
      
      return client
      
    } catch (error) {
      console.error('❌ Erro no dual-write (cliente):', error)
      throw error
    }
  }
  
  /**
   * Sincronizar dados com Firebase Realtime Database
   */
  private static async syncToFirebase(
    tenantId: string, 
    entity: string, 
    entityId: string, 
    data: any
  ) {
    try {
      const dbRef = adminDatabase.ref(`tenants/${tenantId}/${entity}/${entityId}`)
      await dbRef.set({
        ...data,
        lastSynced: Date.now()
      })
      
      console.log(`🔥 Sincronizado com Firebase: ${entity}/${entityId}`)
      
    } catch (error) {
      console.error('❌ Erro na sincronização Firebase:', error)
      // Não propagar erro - sincronização é opcional
    }
  }
  
  /**
   * Adicionar notificação
   */
  static async createNotification(tenantId: string, title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO', targetUser?: string) {
    try {
      console.log('🔔 Criando notificação:', { tenantId, title, type })
      
      const notification = {
        id: crypto.randomUUID(),
        title,
        message,
        type,
        targetUser: targetUser || null, // Firebase não aceita undefined
        createdAt: Date.now(),
        read: false
      }
      
      console.log('📦 Payload da notificação:', notification)
      
      // Salvar no Firebase usando Admin SDK
      const path = `tenants/${tenantId}/notifications`
      console.log('🔥 Firebase path:', path)
      
      const notifRef = adminDatabase.ref(path)
      console.log('📍 Firebase Admin ref criada')
      
      const result = await notifRef.push(notification)
      console.log('✅ Push executado! Key:', result.key)
      
      // Publicar evento Pub/Sub (desabilitado temporariamente - credenciais pendentes)
      // console.log('📢 Publicando evento Pub/Sub...')
      // await DespaSysEventBus.publishEvent(tenantId, 'notifications', {
      //   action: 'created',
      //   data: notification
      // }, {
      //   pushNotification: type === 'ERROR' || type === 'WARNING'
      // })
      
      console.log('✅ Notificação completa!')
      return notification
      
    } catch (error) {
      console.error('❌ Erro ao criar notificação:', error)
      console.error('❌ Stack:', error instanceof Error ? error.stack : 'N/A')
      throw error
    }
  }
}
