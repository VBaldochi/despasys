# 🎯 TESTE RÁPIDO - Mensageria DespaSys

## ⚡ Teste em 3 Minutos

### 1️⃣ Preparar Firebase (APENAS UMA VEZ)

**Abrir Firebase Console:**
https://console.firebase.google.com/project/despasys-production-80bf2/database

**Configurar Rules (temporariamente abertas para teste):**
```javascript
{
  "rules": {
    "tenants": {
      ".read": true,
      ".write": true
    }
  }
}
```

⚠️ **IMPORTANTE:** Depois dos testes, fechar as regras!

---

### 2️⃣ Testar Firebase Manual (Método Simples)

**Passo A: Abrir Mobile App**
```bash
cd mobile
npm start
# Abrir no emulador/Expo Go
```

**Passo B: Fazer Login**
```
Domínio: demo
Email: admin@demo-despachante.com
Senha: (sua senha)
```

**Passo C: Ir para aba "Sync"**

**Passo D: Adicionar Evento no Firebase Console**

No Firebase Console, adicionar em: `/tenants/SEU-TENANT-ID/events/process`

```json
{
  "test-123": {
    "id": "test-123",
    "tenantId": "SEU-TENANT-ID-AQUI",
    "type": "process",
    "action": "created",
    "timestamp": 1730000000000,
    "data": {
      "numero": "TESTE-001",
      "titulo": "Processo de Teste",
      "status": "AGUARDANDO"
    }
  }
}
```

**Passo E: Ver logs no Expo**

Deve aparecer:
```
📡 [MOBILE] Dados recebidos do path tenants/xxx/events/process: true
```

✅ **SUCESSO!** O Firebase está funcionando!

---

### 3️⃣ Testar Sincronização Automática (Web → Mobile)

**Primeiro: Adicionar código no backend**

Editar: `src/app/api/processes/route.ts` (ou onde cria processos)

```typescript
import { DualWriteService } from '@/lib/dual-write'

// ANTES:
const processo = await prisma.process.create({ data: {...} })

// DEPOIS:
const processo = await prisma.process.create({ data: {...} })

// ⬇️ ADICIONAR ESTA LINHA:
await DualWriteService.syncToFirebase(
  session.user.tenantId,
  'processes',
  processo.id,
  {
    id: processo.id,
    numero: processo.numero,
    titulo: processo.titulo,
    status: processo.status
  }
)
```

**Como testar:**

1. ✅ Mobile aberto na tela Sync
2. ✅ Web aberto em Processos
3. ✅ Criar novo processo no Web
4. ✅ Ver notificação no Mobile em tempo real! 🎉

---

## 📱 Melhorar Tela de Sync (Opcional)

Adicionar visualização de eventos na tela:

```typescript
// mobile/app/(tabs)/sync.tsx

import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Card } from 'react-native-paper'
import { realtimeSync } from '@/src/services/realtimeSync'
import { useAuthStore } from '@/src/store/auth'

export default function SyncScreen() {
  const { user } = useAuthStore()
  const [events, setEvents] = useState<any[]>([])
  
  useEffect(() => {
    if (!user?.tenantId) return
    
    console.log('🔗 Conectando ao tenant:', user.tenantId)
    realtimeSync.connectToTenant(user.tenantId, ['process', 'client', 'notification'])
    
    const handleEvent = (event: any) => {
      console.log('🎉 EVENTO RECEBIDO:', event)
      setEvents(prev => [event, ...prev].slice(0, 20))
    }
    
    realtimeSync.addEventListener(user.tenantId, 'process', handleEvent)
    
    return () => {
      realtimeSync.removeEventListener(user.tenantId, 'process', handleEvent)
      realtimeSync.disconnectFromTenant(user.tenantId)
    }
  }, [user?.tenantId])
  
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Eventos em Tempo Real
      </Text>
      
      <Text style={{ marginBottom: 16 }}>
        Total: {events.length} eventos
      </Text>
      
      {events.map((event, index) => (
        <Card key={index} style={{ marginBottom: 8 }}>
          <Card.Content>
            <Text style={{ fontWeight: 'bold' }}>
              {event.type} - {event.action}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              {new Date(event.timestamp).toLocaleString()}
            </Text>
            <Text style={{ marginTop: 8 }}>
              {JSON.stringify(event.data, null, 2)}
            </Text>
          </Card.Content>
        </Card>
      ))}
      
      {events.length === 0 && (
        <Card>
          <Card.Content>
            <Text>Aguardando eventos...</Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Crie um processo no Web para ver aqui em tempo real!
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  )
}
```

---

## ✅ Checklist de Teste

- [ ] Firebase configurado (Rules abertas para teste)
- [ ] Mobile conectado e logado
- [ ] Consegue adicionar evento manual no Firebase Console
- [ ] Mobile recebe evento e mostra nos logs
- [ ] DualWriteService adicionado no endpoint de criar processo
- [ ] Criar processo no Web aparece no Mobile
- [ ] Tela de Sync mostra eventos (opcional)

---

## 🐛 Se Não Funcionar

### Logs para procurar:

**Mobile (Expo terminal):**
```
❌ Procurar por erros de Firebase
✅ Procurar: "🔗 Conectando ao tenant"
✅ Procurar: "📡 Dados recebidos"
```

**Web (Next.js terminal):**
```
❌ Procurar erros de Firebase
✅ Procurar: "🔥 Sincronizado com Firebase"
```

### Problemas Comuns:

1. **"Permission Denied"** → Verificar Firebase Rules
2. **"Não conecta"** → Verificar internet e Firebase config
3. **"TenantId undefined"** → Fazer login novamente no mobile
4. **"Não recebe eventos"** → Verificar path no Firebase Console

---

## 📊 Ver Dados no Firebase

**Acessar:** https://console.firebase.google.com/project/despasys-production-80bf2/database

**Estrutura esperada:**
```
tenants/
  └─ {tenant-id}/
      ├─ events/
      │   ├─ process/
      │   ├─ client/
      │   └─ notification/
      ├─ processes/
      │   └─ {process-id}/
      ├─ clients/
      │   └─ {client-id}/
      └─ notifications/
          └─ {notification-id}/
```

---

**Criado:** 03/10/2025  
**Tempo estimado:** 3-5 minutos  
**Status:** ✅ Pronto para testar!
