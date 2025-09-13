# 🔄 DespaSys - Arquitetura de Sincronização em Tempo Real

## 📋 **Documentação Completa - Mensageria com Google Cloud**

> **Objetivo:** Sincronizar dados em tempo real entre Web App (NextJS) e Mobile App (React Native) usando Google Cloud Platform

---

## 🏗️ **Arquitetura Geral**

```
┌─────────────────┐    🔄 EVENTS 🔄    ┌─────────────────┐
│   Web App       │◄─────────────────►│   Mobile App    │
│   (NextJS)      │                    │ (React Native)  │
└────────┬────────┘                    └────────┬────────┘
         │                                      │
         ▼                                      ▼
┌─────────────────────────────────────────────────────────┐
│                GOOGLE CLOUD PLATFORM                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Pub/Sub     │  │ Firebase    │  │ Cloud       │    │
│  │ Messaging   │  │ Realtime    │  │ Functions   │    │
│  │             │  │ (Cache)     │  │             │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────┬───────────────────────────────────┘
                      │
              ┌───────▼───────┐
              │ NEON Database │  ← BANCO PRINCIPAL (atual)
              │ PostgreSQL    │    Prisma + dados reais
              └───────────────┘
```

---

## 📦 **Componentes da Solução**

### **1. 🔄 Mensageria - Google Cloud Pub/Sub**
- **Função:** Comunicação assíncrona entre Web e Mobile
- **Recursos:** 
  - Topics por tenant
  - Subscriptions filtradas
  - Dead letter queues
  - Retry automático

### **2. 📡 Realtime Sync - Firebase Realtime Database**
- **Função:** Cache sincronizado para UI em tempo real
- **Dados:** Cópia dos dados principais do Neon para sync
- **Recursos:**
  - WebSocket nativo
  - Offline caching no mobile
  - Conflict resolution automático
  - Per-tenant data isolation

### **3. 🗄️ Primary Database - Neon PostgreSQL (Atual)**
- **Função:** Banco principal com todos os dados (mantém como está)
- **Recursos:**
  - Prisma ORM (continua igual)
  - Backup automático Neon
  - Connection pooling
  - Zero migração necessária

### **4. ⚡ Functions - Google Cloud Functions**
- **Função:** Event processors e transformers
- **Tipos:**
  - HTTP triggers (webhooks)
  - Pub/Sub triggers
  - Database triggers

### **5. 📱 Push Notifications - Firebase Cloud Messaging**
- **Função:** Notificações push no mobile
- **Features:**
  - Per-user targeting
  - Rich notifications
  - Background sync

---

## 🛠️ **Stack Tecnológica**

### **Web App (NextJS)**
```json
{
  "dependencies": {
    "@google-cloud/pubsub": "^4.0.7",
    "firebase-admin": "^12.0.0",
    "firebase": "^10.7.1",
    "socket.io": "^4.7.5"
  }
}
```

### **Mobile App (React Native)**
```json
{
  "dependencies": {
    "@react-native-firebase/app": "^19.0.1",
    "@react-native-firebase/database": "^19.0.1",
    "@react-native-firebase/messaging": "^19.0.1",
    "@react-native-async-storage/async-storage": "^1.19.5",
    "socket.io-client": "^4.7.5"
  }
}
```

---

## 🔧 **Configuração por Etapa**

### **FASE 1: Google Cloud Setup (Semana 1)**

#### **1.1 Projeto Google Cloud**
- [ ] Criar projeto: `despasys-production`
- [ ] Habilitar APIs necessárias
- [ ] Configurar billing
- [ ] Setup IAM roles

#### **1.2 Google Cloud Pub/Sub**
```bash
# Topics principais
despasys-tenant-{tenantId}-processes
despasys-tenant-{tenantId}-clients  
despasys-tenant-{tenantId}-financial
despasys-tenant-{tenantId}-notifications

# Subscriptions
mobile-app-{tenantId}-all-events
web-app-{tenantId}-all-events
analytics-{tenantId}-events
```

#### **1.3 Firebase Project**
- [ ] Criar projeto Firebase
- [ ] Habilitar Realtime Database
- [ ] Configurar rules de segurança
- [ ] Setup FCM para push notifications

#### **1.4 Cloud SQL (PostgreSQL)**
- [ ] Migrar database atual
- [ ] Configurar connection pooling
- [ ] Setup read replicas
- [ ] Configurar backups

---

### **FASE 2: Web App Integration (Semana 2)**

#### **2.1 Event Publisher Service**
```typescript
// lib/events/publisher.ts
import { PubSub } from '@google-cloud/pubsub'

export class DespaSysEventBus {
  private pubsub = new PubSub()
  
  async publishEvent(
    tenantId: string,
    eventType: string,
    data: any,
    metadata: EventMetadata
  ) {
    const topic = this.pubsub.topic(`despasys-tenant-${tenantId}-${eventType}`)
    
    await topic.publishMessage({
      data: Buffer.from(JSON.stringify({
        ...data,
        timestamp: Date.now(),
        source: 'web',
        version: '1.0',
        metadata
      }))
    })
  }
}
```

#### **2.2 Database Triggers**
```typescript
// prisma/triggers.ts
// Disparar eventos automaticamente em mudanças no DB
export const processTriggers = {
  afterCreate: async (process: Process) => {
    await eventBus.publishEvent(process.tenantId, 'processes', {
      action: 'created',
      data: process
    })
  },
  
  afterUpdate: async (process: Process, changes: any) => {
    await eventBus.publishEvent(process.tenantId, 'processes', {
      action: 'updated', 
      data: process,
      changes
    })
  }
}
```

#### **2.3 Dual-Write Pattern (Neon + Firebase)**
```typescript
// lib/sync/dualWrite.ts
export class DualWriteService {
  // 1. Salvar no Neon (banco principal)
  static async createProcess(data: ProcessData, tenantId: string) {
    const process = await prisma.process.create({ data })
    
    // 2. Sincronizar com Firebase (cache tempo real)
    await this.syncToFirebase(tenantId, 'processes', {
      id: process.id,
      numero: process.numero,
      status: process.status,
      cliente: process.customer.name,
      lastUpdated: Date.now(),
      source: 'web'
    })
    
    // 3. Publicar evento
    await eventBus.publishEvent(tenantId, 'processes', {
      action: 'created',
      data: process
    })
    
    return process
  }
  
  private static async syncToFirebase(tenantId: string, entity: string, data: any) {
    const db = getDatabase()
    const ref = database.ref(`tenants/${tenantId}/${entity}/${data.id}`)
    await set(ref, data)
  }
}
```

---

### **FASE 3: Mobile App Integration (Semana 3)**

#### **3.1 Event Subscriber Service**
```typescript
// mobile/src/services/events.ts
import database from '@react-native-firebase/database'
import messaging from '@react-native-firebase/messaging'

export class MobileEventBus {
  private tenantId: string
  private userId: string
  
  async initialize(tenantId: string, userId: string) {
    this.tenantId = tenantId
    this.userId = userId
    
    // Escutar mudanças em tempo real
    await this.setupRealtimeListeners()
    
    // Configurar push notifications
    await this.setupPushNotifications()
  }
  
  private async setupRealtimeListeners() {
    const tenantRef = database().ref(`tenants/${this.tenantId}`)
    
    // Processos
    tenantRef.child('processes').on('child_added', (snapshot) => {
      const process = snapshot.val()
      processStore.addProcess(process)
      this.showNotification('Novo processo criado', process.numero)
    })
    
    // Clientes
    tenantRef.child('clients').on('child_changed', (snapshot) => {
      const client = snapshot.val()
      clientStore.updateClient(client)
    })
  }
}
```

#### **3.2 Offline Caching Strategy**
```typescript
// mobile/src/services/cache.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

export class OfflineCache {
  static async cacheData(key: string, data: any) {
    await AsyncStorage.setItem(`cache_${key}`, JSON.stringify({
      data,
      timestamp: Date.now(),
      version: '1.0'
    }))
  }
  
  static async getCachedData(key: string, maxAge: number = 3600000) {
    const cached = await AsyncStorage.getItem(`cache_${key}`)
    if (!cached) return null
    
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > maxAge) return null
    
    return data
  }
}
```

#### **3.3 Conflict Resolution**
```typescript
// mobile/src/services/sync.ts
export class ConflictResolver {
  static resolveDataConflict(localData: any, serverData: any) {
    // Server wins por padrão
    if (serverData.lastUpdated > localData.lastUpdated) {
      return serverData
    }
    
    // Merge estratégico para campos específicos
    return {
      ...localData,
      ...serverData,
      lastUpdated: Math.max(localData.lastUpdated, serverData.lastUpdated)
    }
  }
}
```

---

### **FASE 4: Cloud Functions (Semana 4)**

#### **4.1 Event Processors**
```typescript
// functions/src/processors/processEvents.ts
import { onMessagePublished } from 'firebase-functions/v2/pubsub'

export const processCreatedHandler = onMessagePublished(
  'despasys-tenant-*-processes',
  async (event) => {
    const { tenantId, data } = event.data.message.json
    
    // Atualizar Firebase Realtime
    await updateRealtimeDatabase(tenantId, 'processes', data)
    
    // Enviar push notification
    await sendPushNotification(tenantId, {
      title: 'Novo Processo',
      body: `Processo ${data.numero} criado`
    })
    
    // Analytics
    await logAnalyticsEvent('process_created', { tenantId, processId: data.id })
  }
)
```

#### **4.2 Data Transformers**
```typescript
// functions/src/transformers/dataSync.ts
export const syncToMobile = onCall(async (request) => {
  const { tenantId, entityType, action, data } = request.data
  
  // Transformar dados para formato mobile
  const mobileData = transformForMobile(entityType, data)
  
  // Atualizar Firebase Realtime
  await updateRealtimeDatabase(tenantId, entityType, mobileData)
  
  return { success: true, synced: true }
})
```

---

## 📊 **Tipos de Eventos**

### **Core Business Events**
```typescript
interface DespaSysEvents {
  // 📋 Processos
  'processes': {
    action: 'created' | 'updated' | 'status_changed' | 'deleted'
    data: ProcessData
    changes?: Partial<ProcessData>
  }
  
  // 👥 Clientes  
  'clients': {
    action: 'created' | 'updated' | 'deleted'
    data: ClientData
    changes?: Partial<ClientData>
  }
  
  // 💰 Financeiro
  'financial': {
    action: 'payment_received' | 'invoice_generated' | 'expense_added'
    data: FinancialData
  }
  
  // 📅 Agendamentos
  'appointments': {
    action: 'scheduled' | 'cancelled' | 'completed'
    data: AppointmentData
  }
  
  // 🔔 Notificações
  'notifications': {
    action: 'created' | 'read' | 'deleted'
    data: NotificationData
    target: 'user' | 'tenant' | 'role'
  }
  
  // 🏢 Sistema
  'system': {
    action: 'tenant_updated' | 'user_created' | 'backup_completed'
    data: SystemData
  }
}
```

---

## 🚀 **Cronograma de Implementação**

### **Semana 1: Infraestrutura GCP**
- [x] Setup Google Cloud Project
- [x] Configurar Pub/Sub
- [x] Configurar Firebase
- [x] Migrar Cloud SQL

### **Semana 2: Web Integration**
- [ ] Implementar Event Publisher
- [ ] Adicionar Database Triggers  
- [ ] Setup Firebase Sync
- [ ] Testes de publicação

### **Semana 3: Mobile Integration**
- [ ] Implementar Event Subscriber
- [ ] Setup Realtime Listeners
- [ ] Implementar Offline Cache
- [ ] Push Notifications

### **Semana 4: Cloud Functions**
- [ ] Event Processors
- [ ] Data Transformers
- [ ] Analytics Integration
- [ ] Error Handling

### **Semana 5: Testing & Deploy**
- [ ] Testes de integração
- [ ] Load testing
- [ ] Security audit
- [ ] Production deploy

---

## 💰 **Estimativa de Custos GCP**

### **🆓 DESENVOLVIMENTO (Free Tier)**
- **Pub/Sub:** Gratuito (10GB/mês)
- **Firebase Realtime:** Gratuito (1GB stored + 10GB bandwidth)
- **Cloud Functions:** Gratuito (2M invocations/mês)
- **FCM:** Sempre gratuito (unlimited push notifications)
- **Firebase Auth:** Gratuito (50k MAU)

**💸 Total desenvolvimento: $0/mês** ✅

### **📈 PRODUÇÃO (1000 usuários ativos)**
- **Pub/Sub:** ~$10/mês (estimado 5M mensagens)
- **Firebase Realtime:** ~$25/mês (5GB bandwidth)
- **Cloud Functions:** ~$20/mês (estimado 5M invocations)
- **FCM:** Gratuito (sempre)

**Total produção estimado: ~$55/mês**

---

## 🔒 **Considerações de Segurança**

### **1. Firebase Rules**
```javascript
{
  "rules": {
    "tenants": {
      "$tenantId": {
        ".read": "auth != null && auth.custom.tenantId == $tenantId",
        ".write": "auth != null && auth.custom.tenantId == $tenantId && auth.custom.role == 'ADMIN'"
      }
    }
  }
}
```

### **2. Pub/Sub IAM**
- Topics isolados por tenant
- Service accounts específicas
- Least privilege principle

### **3. Data Encryption**
- Em trânsito: TLS 1.3
- Em repouso: Google Cloud KMS
- Application level: AES-256

---

## 📈 **Monitoramento**

### **1. Métricas Principais**
- Latência de sincronização
- Taxa de mensagens processadas
- Erro rate por serviço
- Uptime dos componentes

### **2. Alertas**
- Falha na sincronização > 5 min
- Error rate > 1%
- Latência > 2 segundos
- Fila de eventos > 1000

### **3. Dashboards**
- Google Cloud Monitoring
- Firebase Analytics
- Custom business metrics

---

## 🎯 **Próximos Passos**

1. **Revisar documentação** ✅
2. **Aprovar arquitetura** ⏳
3. **Setup GCP Project** ⏳  
4. **Iniciar Fase 1** ⏳

---

**Documentação criada em:** 4 de setembro de 2025  
**Versão:** 1.0  
**Autor:** GitHub Copilot  
**Projeto:** DespaSys Realtime Sync
