# 🧪 Como Testar a Mensageria - DespaSys

## 📋 Status Atual da Implementação

### ✅ O que já está configurado:

1. **Firebase Realtime Database** 
   - ✅ Projeto criado: `despasys-production-80bf2`
   - ✅ Database URL: `https://despasys-production-80bf2-default-rtdb.firebaseio.com`
   - ✅ Configuração no Web (NextJS)
   - ✅ Configuração no Mobile (React Native)

2. **Google Cloud Pub/Sub**
   - ✅ Código implementado (`src/lib/pubsub.ts`)
   - ⚠️ Credenciais precisam ser configuradas
   - ⚠️ Tópicos precisam ser criados

3. **Mobile - Realtime Sync**
   - ✅ Service implementado (`mobile/src/services/realtimeSync.ts`)
   - ✅ Listeners configurados
   - ✅ Firebase configurado

---

## 🚀 GUIA RÁPIDO DE TESTE (5 minutos)

### Teste 1: Firebase Realtime Database (Mais Simples)

Este é o teste mais direto porque o Firebase já está configurado.

#### **Passo 1: Iniciar o Mobile App**

```bash
cd mobile
npm start
# Abrir no emulador Android ou Expo Go
```

#### **Passo 2: Fazer Login no App Mobile**

```
Domínio: demo (ou seu tenant)
Email: admin@demo-despachante.com
Senha: (sua senha)
```

#### **Passo 3: Ir para a Tela de Sync**

No app mobile, navegue para a aba **"Sync"** (última tab)

#### **Passo 4: Enviar um Evento de Teste pelo Web**

Abra o console do Firebase Realtime Database:
https://console.firebase.google.com/project/despasys-production-80bf2/database/despasys-production-80bf2-default-rtdb/data

Adicione manualmente um evento de teste:

```
Caminho: /tenants/{seu-tenant-id}/events/process
```

Adicione este JSON:
```json
{
  "test-event-123": {
    "id": "test-event-123",
    "tenantId": "seu-tenant-id-aqui",
    "type": "process",
    "action": "created",
    "timestamp": 1730000000000,
    "data": {
      "numero": "PROC-TEST-001",
      "titulo": "Teste de Sincronização",
      "status": "AGUARDANDO_DOCUMENTOS"
    }
  }
}
```

#### **Passo 5: Verificar os Logs no Mobile**

No terminal do Expo, você deve ver:

```
📡 [MOBILE] Dados recebidos do path tenants/.../events/process: true
🔔 [MOBILE] Notificações recentes: 1
```

---

## 🔧 Teste 2: Criar Processo no Web e Ver no Mobile em Tempo Real

### **Setup Necessário:**

Primeiro, precisamos adicionar o dual-write no backend para sincronizar com Firebase.

#### **Arquivo: `src/lib/dual-write.ts`**

```typescript
import { database } from '@/lib/firebase'
import { ref, set, update } from 'firebase/database'

export class DualWriteService {
  /**
   * Sincronizar dados com Firebase após salvar no Neon
   */
  static async syncToFirebase(
    tenantId: string, 
    entity: string, 
    entityId: string,
    data: any
  ) {
    try {
      const firebaseRef = ref(database, `tenants/${tenantId}/${entity}/${entityId}`)
      
      const syncData = {
        ...data,
        lastUpdated: Date.now(),
        source: 'web'
      }
      
      await set(firebaseRef, syncData)
      console.log(`✅ Sincronizado com Firebase: ${entity}/${entityId}`)
      
      // Também adicionar ao feed de eventos
      const eventRef = ref(database, `tenants/${tenantId}/events/${entity}`)
      const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      await update(eventRef, {
        [eventId]: {
          id: eventId,
          tenantId,
          type: entity,
          action: 'created',
          timestamp: Date.now(),
          data: syncData
        }
      })
      
      return true
    } catch (error) {
      console.error('❌ Erro ao sincronizar com Firebase:', error)
      return false
    }
  }
}
```

#### **Adicionar no endpoint de criação de processo:**

Em `src/app/api/processes/route.ts` (ou onde você cria processos):

```typescript
import { DualWriteService } from '@/lib/dual-write'

// Após criar o processo no Neon:
const processo = await prisma.process.create({ data: {...} })

// Sincronizar com Firebase
await DualWriteService.syncToFirebase(
  tenantId,
  'processes',
  processo.id,
  {
    id: processo.id,
    numero: processo.numero,
    titulo: processo.titulo,
    status: processo.status,
    clienteNome: processo.customer?.name,
    createdAt: processo.createdAt.toISOString()
  }
)
```

### **Como Testar:**

1. **Abrir o Mobile** - Ir na tela Sync
2. **Abrir o Web** - Ir em Processos
3. **Criar um novo processo no Web**
4. **Ver a notificação aparecer no Mobile em tempo real!** 🎉

---

## 🔍 Teste 3: Verificar Listeners Ativos no Mobile

Adicione este código temporário na tela de Sync:

```typescript
// mobile/app/(tabs)/sync.tsx

import { useEffect, useState } from 'react'
import { realtimeSync } from '@/src/services/realtimeSync'
import { useAuthStore } from '@/src/store/auth'

export default function SyncScreen() {
  const { user } = useAuthStore()
  const [events, setEvents] = useState<any[]>([])
  
  useEffect(() => {
    if (!user?.tenantId) return
    
    // Conectar aos eventos
    realtimeSync.connectToTenant(user.tenantId, ['process', 'client', 'notification'])
    
    // Adicionar listener
    const handleProcessEvent = (event: any) => {
      console.log('🎉 Evento recebido:', event)
      setEvents(prev => [event, ...prev].slice(0, 10)) // Manter últimos 10
    }
    
    realtimeSync.addEventListener(user.tenantId, 'process', handleProcessEvent)
    
    return () => {
      realtimeSync.removeEventListener(user.tenantId, 'process', handleProcessEvent)
      realtimeSync.disconnectFromTenant(user.tenantId)
    }
  }, [user?.tenantId])
  
  return (
    <ScrollView>
      <Text>Eventos em Tempo Real:</Text>
      {events.map(event => (
        <Card key={event.id}>
          <Text>{event.type} - {event.action}</Text>
          <Text>{JSON.stringify(event.data, null, 2)}</Text>
        </Card>
      ))}
    </ScrollView>
  )
}
```

---

## 📊 Monitoramento e Debug

### **1. Verificar Firebase Realtime Database**

Acesse: https://console.firebase.google.com/project/despasys-production-80bf2/database

Verifique se há dados em:
- `/tenants/{tenant-id}/events/process`
- `/tenants/{tenant-id}/events/client`
- `/tenants/{tenant-id}/notifications`

### **2. Logs no Mobile**

Procure por estes logs no terminal do Expo:

```
✅ Conectado:
🔗 [MOBILE] Conectando ao tenant: xxx
👂 [MOBILE] Escutando path: tenants/xxx/events/process

✅ Recebendo dados:
📡 [MOBILE] Dados recebidos do path tenants/xxx/events/process: true
📊 [MOBILE] Dados: [...keys]

✅ Notificações:
🔔 [MOBILE] Notificações recentes: 1
```

### **3. Logs no Web (NextJS)**

No terminal do servidor Next.js:

```
✅ Sincronizado com Firebase: processes/xxx
📡 Evento publicado: processes (message-id)
```

---

## 🐛 Troubleshooting

### Problema: "Permission Denied" no Firebase

**Solução:** Configurar Firebase Rules

```javascript
// Firebase Console > Realtime Database > Rules
{
  "rules": {
    "tenants": {
      "$tenantId": {
        ".read": true,  // ⚠️ TEMPORÁRIO para testes
        ".write": true  // ⚠️ TEMPORÁRIO para testes
      }
    }
  }
}
```

**⚠️ ATENÇÃO:** Estas regras são ABERTAS. Para produção, usar autenticação!

### Problema: Mobile não recebe eventos

**Checklist:**
1. ✅ Firebase configurado? Verificar `mobile/src/services/firebase.ts`
2. ✅ TenantId correto? Verificar logs
3. ✅ Listener conectado? Verificar `realtimeSync.connectToTenant()`
4. ✅ Dados no Firebase? Verificar console
5. ✅ Internet funcionando? Verificar conexão

### Problema: Web não sincroniza

**Checklist:**
1. ✅ Firebase SDK instalado? `npm install firebase`
2. ✅ Variáveis de ambiente? Verificar `.env.local`
3. ✅ DualWriteService chamado? Adicionar no endpoint
4. ✅ Erros no console? Verificar logs do Next.js

---

## 🎯 Próximos Passos

### Funcionalidades para Implementar:

1. **Notificações Push** (FCM)
   - Enviar notificação quando processo muda de status
   - Alertas de vencimento de prazo
   - Mensagens do sistema

2. **Offline Support**
   - Cache local de eventos
   - Sincronização quando voltar online
   - Conflict resolution

3. **Google Cloud Pub/Sub** (Opcional - mais robusto)
   - Event sourcing completo
   - Analytics de eventos
   - Integração com outros sistemas

---

## 📚 Recursos

### Firebase Console
- Database: https://console.firebase.google.com/project/despasys-production-80bf2/database
- Regras: https://console.firebase.google.com/project/despasys-production-80bf2/database/rules

### Documentação
- Firebase Realtime: https://firebase.google.com/docs/database
- React Native Firebase: https://rnfirebase.io/
- Pub/Sub: https://cloud.google.com/pubsub/docs

---

## ✅ Checklist de Teste Completo

- [ ] Firebase configurado no Web
- [ ] Firebase configurado no Mobile
- [ ] Consegue adicionar dados manualmente no Firebase Console
- [ ] Mobile recebe eventos do Firebase
- [ ] DualWriteService implementado no backend
- [ ] Criar processo no Web sincroniza com Firebase
- [ ] Mobile recebe notificação de novo processo em tempo real
- [ ] Logs aparecem corretamente
- [ ] Funciona offline (com cache)

---

**Criado em:** 03/10/2025  
**Versão:** 1.0  
**Status:** ✅ Pronto para testar Firebase Realtime  
**Status Pub/Sub:** ⏸️ Aguardando configuração de credenciais
