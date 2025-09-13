# 📡 DespaSys - Especificação de Eventos

## 🎯 **Event Schema Standards**

### **Base Event Structure**
```typescript
interface BaseEvent {
  // Metadata
  eventId: string           // UUID único
  eventType: string         // Tipo do evento
  timestamp: number         // Unix timestamp
  version: string           // Schema version (1.0)
  source: 'web' | 'mobile'  // Origem do evento
  
  // Context
  tenantId: string          // ID do tenant
  userId?: string           // ID do usuário (opcional)
  sessionId?: string        // ID da sessão (opcional)
  
  // Data
  data: any                 // Payload específico
  metadata?: any            // Dados adicionais
}
```

---

## 📋 **Eventos de Processos**

### **process:created**
```typescript
interface ProcessCreatedEvent extends BaseEvent {
  eventType: 'process:created'
  data: {
    id: string
    numero: string
    tipo: string
    cliente: {
      id: string
      name: string
      email?: string
    }
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    prazo?: Date
    valor?: number
    prioridade: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    servicos: string[]
    observacoes?: string
    createdAt: Date
    createdBy: string
  }
  metadata: {
    notifyMobile: boolean
    pushNotification: boolean
    emailNotification: boolean
  }
}

// Exemplo de uso no Web
await eventBus.publish('process:created', {
  id: 'proc_123',
  numero: 'PROC-2025-001', 
  tipo: 'CNH_RENOVACAO',
  cliente: { id: 'cli_456', name: 'João Silva' },
  status: 'PENDING',
  prioridade: 'MEDIUM',
  servicos: ['CNH_RENOVACAO', 'EXAME_MEDICO']
}, {
  notifyMobile: true,
  pushNotification: true,
  emailNotification: false
})
```

### **process:status_changed**
```typescript
interface ProcessStatusChangedEvent extends BaseEvent {
  eventType: 'process:status_changed'
  data: {
    id: string
    numero: string
    previousStatus: ProcessStatus
    newStatus: ProcessStatus
    changedBy: string
    reason?: string
    nextSteps?: string[]
    estimatedCompletion?: Date
  }
  metadata: {
    autoProgress: boolean
    requiresClientNotification: boolean
    criticalChange: boolean
  }
}
```

### **process:document_uploaded**
```typescript
interface ProcessDocumentUploadedEvent extends BaseEvent {
  eventType: 'process:document_uploaded'
  data: {
    processId: string
    documentId: string
    fileName: string
    fileType: string
    fileSize: number
    uploadedBy: string
    documentType: 'RG' | 'CPF' | 'CNH' | 'COMPROVANTE_RESIDENCIA' | 'OUTROS'
    isRequired: boolean
  }
}
```

---

## 👥 **Eventos de Clientes**

### **client:created**
```typescript
interface ClientCreatedEvent extends BaseEvent {
  eventType: 'client:created'
  data: {
    id: string
    name: string
    email?: string
    phone?: string
    cpf?: string
    rg?: string
    address?: {
      street: string
      number: string
      city: string
      state: string
      zipCode: string
    }
    birthDate?: Date
    createdBy: string
  }
  metadata: {
    source: 'manual' | 'import' | 'api'
    duplicateCheck: boolean
  }
}
```

### **client:updated**
```typescript
interface ClientUpdatedEvent extends BaseEvent {
  eventType: 'client:updated'
  data: {
    id: string
    changes: Partial<ClientData>
    updatedBy: string
    updateReason?: string
  }
  metadata: {
    fieldsChanged: string[]
    significantChange: boolean
  }
}
```

---

## 💰 **Eventos Financeiros**

### **payment:received**
```typescript
interface PaymentReceivedEvent extends BaseEvent {
  eventType: 'payment:received'
  data: {
    id: string
    amount: number
    currency: 'BRL'
    method: 'PIX' | 'CARD' | 'CASH' | 'BANK_TRANSFER'
    processId?: string
    clientId: string
    receiptNumber: string
    receivedBy: string
    description?: string
    installment?: {
      current: number
      total: number
    }
  }
  metadata: {
    autoReconcile: boolean
    generateReceipt: boolean
    updateProcessStatus: boolean
  }
}
```

### **invoice:generated**
```typescript
interface InvoiceGeneratedEvent extends BaseEvent {
  eventType: 'invoice:generated'
  data: {
    id: string
    number: string
    clientId: string
    processId?: string
    amount: number
    dueDate: Date
    items: Array<{
      description: string
      quantity: number
      unitPrice: number
      total: number
    }>
    generatedBy: string
  }
  metadata: {
    sendToClient: boolean
    emailTemplate: string
  }
}
```

---

## 📅 **Eventos de Agendamentos**

### **appointment:scheduled**
```typescript
interface AppointmentScheduledEvent extends BaseEvent {
  eventType: 'appointment:scheduled'
  data: {
    id: string
    title: string
    description?: string
    clientId: string
    processId?: string
    scheduledFor: Date
    duration: number // minutos
    location?: string
    type: 'PRESENCIAL' | 'DETRAN' | 'CARTORIO' | 'CLIENTE'
    status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
    scheduledBy: string
    assignedTo?: string
  }
  metadata: {
    sendReminder: boolean
    reminderTime: number // horas antes
    requiresConfirmation: boolean
  }
}
```

### **appointment:reminder**
```typescript
interface AppointmentReminderEvent extends BaseEvent {
  eventType: 'appointment:reminder'
  data: {
    appointmentId: string
    clientId: string
    scheduledFor: Date
    reminderType: '24h' | '2h' | '30min'
    message: string
  }
  metadata: {
    channel: 'push' | 'email' | 'sms'
    automated: boolean
  }
}
```

---

## 🔔 **Eventos de Notificações**

### **notification:created**
```typescript
interface NotificationCreatedEvent extends BaseEvent {
  eventType: 'notification:created'
  data: {
    id: string
    title: string
    message: string
    type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    targetUser?: string
    targetRole?: string
    relatedEntity?: {
      type: 'process' | 'client' | 'appointment' | 'payment'
      id: string
    }
    actions?: Array<{
      label: string
      action: string
      style: 'primary' | 'secondary' | 'danger'
    }>
    expiresAt?: Date
  }
  metadata: {
    channels: ('push' | 'email' | 'in_app')[]
    persistent: boolean
  }
}
```

---

## 🏢 **Eventos do Sistema**

### **tenant:updated**
```typescript
interface TenantUpdatedEvent extends BaseEvent {
  eventType: 'tenant:updated'
  data: {
    id: string
    changes: {
      name?: string
      plan?: string
      status?: string
      features?: string[]
      limits?: Record<string, number>
    }
    updatedBy: string
  }
  metadata: {
    planUpgrade: boolean
    featureChanges: string[]
    effectiveDate: Date
  }
}
```

### **user:login**
```typescript
interface UserLoginEvent extends BaseEvent {
  eventType: 'user:login'
  data: {
    userId: string
    email: string
    role: string
    device: 'web' | 'mobile'
    location?: {
      ip: string
      city?: string
      country?: string
    }
    userAgent?: string
  }
  metadata: {
    sessionDuration?: number
    suspicious: boolean
  }
}
```

---

## 📊 **Eventos de Analytics**

### **analytics:page_view**
```typescript
interface AnalyticsPageViewEvent extends BaseEvent {
  eventType: 'analytics:page_view'
  data: {
    page: string
    userId?: string
    sessionId: string
    duration?: number
    referrer?: string
    device: 'web' | 'mobile'
  }
}
```

### **analytics:feature_used**
```typescript
interface AnalyticsFeatureUsedEvent extends BaseEvent {
  eventType: 'analytics:feature_used'
  data: {
    feature: string
    action: string
    userId?: string
    context?: Record<string, any>
    result: 'success' | 'error' | 'cancelled'
  }
}
```

---

## 🎯 **Event Publishers**

### **Web App Publishers**
```typescript
// lib/events/publishers.ts

export class ProcessEventPublisher {
  static async created(process: Process, user: User) {
    await eventBus.publish('process:created', {
      eventType: 'process:created',
      tenantId: process.tenantId,
      userId: user.id,
      data: {
        id: process.id,
        numero: process.numero,
        tipo: process.tipo,
        cliente: {
          id: process.customer.id,
          name: process.customer.name,
          email: process.customer.email
        },
        status: process.status,
        prioridade: process.priority,
        servicos: process.services,
        createdAt: process.createdAt,
        createdBy: user.id
      },
      metadata: {
        notifyMobile: true,
        pushNotification: process.priority === 'URGENT',
        emailNotification: false
      }
    })
  }
}

export class ClientEventPublisher {
  static async created(client: Customer, user: User) {
    await eventBus.publish('client:created', {
      eventType: 'client:created', 
      tenantId: client.tenantId,
      userId: user.id,
      data: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        cpf: client.cpf,
        createdBy: user.id
      },
      metadata: {
        source: 'manual',
        duplicateCheck: true
      }
    })
  }
}
```

---

## 🎣 **Event Subscribers (Mobile)**

```typescript
// mobile/src/services/eventHandlers.ts

export class ProcessEventHandler {
  static handle(event: ProcessCreatedEvent) {
    // Atualizar store
    processStore.addProcess(event.data)
    
    // Mostrar notificação
    if (event.metadata.pushNotification) {
      NotificationService.show({
        title: 'Novo Processo Urgente',
        body: `${event.data.numero} - ${event.data.cliente.name}`,
        data: { processId: event.data.id }
      })
    }
    
    // Analytics
    AnalyticsService.track('process_received', {
      processId: event.data.id,
      priority: event.data.prioridade
    })
  }
}

export class AppointmentEventHandler {
  static handle(event: AppointmentScheduledEvent) {
    // Atualizar agenda
    agendaStore.addAppointment(event.data)
    
    // Configurar lembrete local
    if (event.metadata.sendReminder) {
      ReminderService.schedule({
        id: event.data.id,
        time: event.data.scheduledFor,
        reminderBefore: event.metadata.reminderTime
      })
    }
  }
}
```

---

## 🔄 **Event Flow Examples**

### **Fluxo: Criação de Processo**
```
1. 👨‍💼 User cria processo no Web
   └── ProcessController.create()
   
2. 📡 Web publica event
   └── ProcessEventPublisher.created()
   └── Pub/Sub: process:created
   
3. 📱 Mobile recebe event  
   └── Firebase Realtime listener
   └── ProcessEventHandler.handle()
   
4. 🔔 Mobile mostra notificação
   └── NotificationService.show()
   
5. 📊 Analytics tracking
   └── Both web & mobile track event
```

### **Fluxo: Atualização de Status**
```
1. 📱 Mobile atualiza status processo
   └── ProcessService.updateStatus()
   
2. 📡 Mobile publica event
   └── Mobile API publishes to Pub/Sub
   
3. 🌐 Web recebe atualização
   └── Realtime UI update
   └── Database sync
   
4. 🔔 Notificar cliente (se necessário)
   └── Email/SMS notification
```

---

## 📋 **Event Testing**

### **Test Event Publishers**
```typescript
// test/events/publishers.test.ts
describe('ProcessEventPublisher', () => {
  it('should publish process:created event', async () => {
    const mockProcess = createMockProcess()
    const mockUser = createMockUser()
    
    const spy = jest.spyOn(eventBus, 'publish')
    
    await ProcessEventPublisher.created(mockProcess, mockUser)
    
    expect(spy).toHaveBeenCalledWith('process:created', 
      expect.objectContaining({
        eventType: 'process:created',
        data: expect.objectContaining({
          id: mockProcess.id,
          numero: mockProcess.numero
        })
      })
    )
  })
})
```

### **Test Event Handlers**
```typescript
// mobile/test/eventHandlers.test.ts
describe('ProcessEventHandler', () => {
  it('should handle process:created event', () => {
    const mockEvent: ProcessCreatedEvent = createMockEvent()
    
    ProcessEventHandler.handle(mockEvent)
    
    expect(processStore.processes).toContain(
      expect.objectContaining({ id: mockEvent.data.id })
    )
  })
})
```

---

**Próxima etapa:** Implementar Event Bus e primeiro publisher! 🚀
