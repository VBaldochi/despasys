# 🆓 DespaSys - Desenvolvimento Gratuito

## 🎯 **Free Tier - Google Cloud & Firebase**

> **Ideal para desenvolvimento e testes - $0/mês**

---

## 📊 **Limites Gratuitos Generosos**

### **🔥 Firebase (sempre gratuito para dev)**
```
Firebase Realtime Database:
✅ 1GB dados armazenados
✅ 10GB bandwidth/mês  
✅ 100 conexões simultâneas

Firebase Cloud Messaging:
✅ UNLIMITED push notifications
✅ UNLIMITED dispositivos

Firebase Authentication:
✅ 50,000 usuários ativos/mês
```

### **☁️ Google Cloud Platform**
```
Pub/Sub:
✅ 10GB mensagens/mês
✅ Primeiros 1000 tópicos gratuitos

Cloud Functions:
✅ 2 milhões invocações/mês
✅ 400,000 GB-seconds compute
✅ 200,000 GHz-seconds compute
✅ 5GB network egress/mês

Cloud Storage:
✅ 5GB storage/mês
✅ 1GB network egress/mês
```

---

## 🧮 **Cálculo para Desenvolvimento**

### **Cenário: 3 desenvolvedores + 10 usuários teste**

#### **Uso Estimado:**
```
Pub/Sub Messages: ~50k/mês
├─ Process events: ~10k
├─ Client events: ~5k  
├─ System events: ~15k
└─ Test events: ~20k

Firebase Realtime:
├─ Data stored: ~100MB
├─ Bandwidth: ~2GB/mês
└─ Connections: ~15 simultâneas

Cloud Functions:
├─ Event processors: ~100k invocações
├─ Webhooks: ~20k invocações
└─ Analytics: ~30k invocações

Push Notifications: ~1000/mês
```

#### **🎉 Resultado: TUDO GRATUITO!**
- ✅ Pub/Sub: 50k << 10GB limit
- ✅ Firebase: 100MB << 1GB limit  
- ✅ Functions: 150k << 2M limit
- ✅ FCM: 1k << unlimited

---

## 🚀 **Setup Gratuito Passo-a-Passo**

### **1. Google Cloud (Free Trial)**
```bash
# 1.1 Criar conta Google Cloud
# - $300 créditos gratuitos (12 meses)
# - Não cobrará automaticamente após trial

# 1.2 Criar projeto
gcloud projects create despasys-dev-free

# 1.3 Habilitar APIs (grátis)
gcloud services enable pubsub.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
```

### **2. Firebase (Spark Plan - Gratuito)**
```bash
# 2.1 Instalar Firebase CLI
npm install -g firebase-tools

# 2.2 Login
firebase login

# 2.3 Criar projeto Firebase
firebase projects:create despasys-dev

# 2.4 Selecionar plano Spark (gratuito)
# Via console: https://console.firebase.google.com
```

### **3. Configuração de Desenvolvimento**
```typescript
// .env.development
GOOGLE_CLOUD_PROJECT_ID=despasys-dev-free
FIREBASE_PROJECT_ID=despasys-dev

# Firebase config (público - ok para dev)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=despasys-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://despasys-dev-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=despasys-dev

# Neon (continua igual)
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/despasys
```

---

## 📱 **Mobile Development Setup**

### **Firebase SDK (React Native)**
```json
{
  "dependencies": {
    "@react-native-firebase/app": "^19.0.1",
    "@react-native-firebase/database": "^19.0.1", 
    "@react-native-firebase/messaging": "^19.0.1"
  }
}
```

### **Firebase Configuration**
```typescript
// mobile/src/config/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXX",
  authDomain: "despasys-dev.firebaseapp.com",
  databaseURL: "https://despasys-dev-default-rtdb.firebaseio.com",
  projectId: "despasys-dev",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:android:abcdef"
}

export default firebaseConfig
```

---

## 🔧 **Scripts de Desenvolvimento**

### **package.json - Web**
```json
{
  "scripts": {
    "dev": "next dev",
    "dev:events": "npm run dev & npm run firebase:emulators",
    "firebase:emulators": "firebase emulators:start --only database,functions",
    "test:events": "node scripts/test-events.js"
  }
}
```

### **Firebase Emulators (Local)**
```bash
# Instalar emulators (uma vez)
firebase init emulators

# Rodar localmente (desenvolvimento)
firebase emulators:start --only database,functions

# URLs locais:
# - Realtime Database: http://localhost:9000
# - Functions: http://localhost:5001
# - UI: http://localhost:4000
```

### **Test Script**
```javascript
// scripts/test-events.js
const { PubSub } = require('@google-cloud/pubsub')

async function testEvents() {
  console.log('🧪 Testing event system...')
  
  const pubsub = new PubSub()
  const topic = pubsub.topic('despasys-dev-test')
  
  // Create topic if not exists
  const [exists] = await topic.exists()
  if (!exists) await topic.create()
  
  // Publish test message
  await topic.publishMessage({
    data: Buffer.from(JSON.stringify({
      eventType: 'test:development',
      tenantId: 'dev-tenant',
      data: { message: 'Hello from dev!' },
      timestamp: Date.now()
    }))
  })
  
  console.log('✅ Test event published!')
}

testEvents().catch(console.error)
```

---

## 📊 **Monitoramento Gratuito**

### **Firebase Console**
- 📈 Realtime Database usage
- 📱 FCM delivery stats  
- 👥 Authentication users
- 🔥 Performance monitoring

### **Google Cloud Console**
- 📡 Pub/Sub message metrics
- ⚡ Functions execution stats
- 💰 Billing (deve ser $0)
- 🚨 Error reporting

### **Custom Dashboard**
```typescript
// lib/monitoring/dev.ts
export class DevMonitoring {
  static logUsage() {
    console.log(`
📊 DEV USAGE TODAY:
├─ Pub/Sub messages: ${this.getPubSubCount()}
├─ Firebase bandwidth: ${this.getFirebaseBandwidth()}  
├─ Function calls: ${this.getFunctionCalls()}
└─ FCM notifications: ${this.getFCMCount()}

💰 Cost: $0 (Free Tier)
⚠️  Limits: All good!
    `)
  }
}
```

---

## 🚨 **Alertas de Limite**

### **Prevent Overage**
```typescript
// lib/limits/checker.ts
export class UsageLimits {
  static async checkLimits() {
    const usage = await this.getCurrentUsage()
    
    // Firebase Realtime (1GB limit)
    if (usage.firebase.bandwidth > 0.8 * 1024) {
      console.warn('⚠️  Firebase bandwidth: 80% usado')
    }
    
    // Pub/Sub (10GB limit)  
    if (usage.pubsub.messages > 0.8 * 10000) {
      console.warn('⚠️  Pub/Sub messages: 80% usado')
    }
    
    // Functions (2M limit)
    if (usage.functions.invocations > 0.8 * 2000000) {
      console.warn('⚠️  Functions calls: 80% usado')
    }
  }
}
```

---

## 🎯 **Upgrade Path**

### **Quando Sair do Free Tier?**

#### **Sinais para upgrade:**
- 🔥 Firebase bandwidth > 8GB/mês
- 📡 Pub/Sub > 8GB mensagens/mês  
- ⚡ Functions > 1.5M calls/mês
- 📱 Push notifications > necessidade de analytics

#### **Próximo nível (Blaze Plan):**
- 💰 Pay-as-you-go após free tier
- 📊 Analytics avançado
- 🚀 Performance melhorado
- 📈 Limites maiores

### **Migração Suave:**
```bash
# 1. Backup dados development
firebase database:get / > backup-dev.json

# 2. Criar projeto production  
firebase projects:create despasys-prod

# 3. Upgrade para Blaze
# Via console Firebase

# 4. Deploy gradual
npm run deploy:staging
npm run deploy:production
```

---

## ✅ **Checklist Free Tier**

### **Setup Inicial:**
- [ ] Conta Google Cloud criada
- [ ] $300 créditos ativados (não será usado)
- [ ] Firebase projeto no Spark Plan
- [ ] Emulators instalados
- [ ] Service accounts criadas
- [ ] Variables de ambiente configuradas

### **Desenvolvimento:**
- [ ] Event system funcionando local
- [ ] Firebase Realtime conectado
- [ ] Mobile recebendo eventos
- [ ] Push notifications testadas
- [ ] Monitoring dashboard básico

### **Monitoramento:**
- [ ] Usage alerts configurados
- [ ] Daily usage reports
- [ ] Free tier limits tracked
- [ ] Upgrade path documentado

---

## 🎉 **Vantagens Development Free**

### **✅ Benefícios:**
- 💰 **$0 custo** durante desenvolvimento
- 🚀 **Infraestrutura real** (não simulada)
- 📱 **Push notifications reais**
- 🔄 **Sync tempo real** funcional
- 📊 **Monitoring completo**
- 🧪 **Testing em ambiente real**

### **🎯 Perfeito Para:**
- 👨‍💻 Equipe de desenvolvimento
- 🧪 Testes de integração
- 📱 Desenvolvimento mobile
- 🔄 Validação de arquitetura
- 📊 Proof of concept

---

**🚀 Quer começar o setup gratuito agora?** Posso guiá-lo pelo processo passo-a-passo!
