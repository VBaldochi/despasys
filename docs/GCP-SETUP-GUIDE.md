# 🚀 DespaSys - Guia de Setup Google Cloud

## 📋 **Checklist Pré-Implementação**

### **FASE 0: Preparação (Esta Semana)**

#### **1. Conta Google Cloud**
- [ ] Criar conta GCP (se não tiver)
- [ ] Ativar billing account
- [ ] Verificar limites de quota
- [ ] Setup 2FA obrigatório

#### **2. Projeto Setup**
```bash
# Criar projeto
gcloud projects create despasys-production

# Definir como projeto ativo
gcloud config set project despasys-production

# Habilitar APIs necessárias
gcloud services enable pubsub.googleapis.com
gcloud services enable sqladmin.googleapis.com  
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firebase.googleapis.com
```

#### **3. Service Accounts**
```bash
# Service Account para Web App
gcloud iam service-accounts create despasys-web \
  --display-name="DespaSys Web Application"

# Service Account para Mobile/Functions  
gcloud iam service-accounts create despasys-mobile \
  --display-name="DespaSys Mobile & Functions"

# Gerar chaves
gcloud iam service-accounts keys create web-sa-key.json \
  --iam-account=despasys-web@despasys-production.iam.gserviceaccount.com

gcloud iam service-accounts keys create mobile-sa-key.json \
  --iam-account=despasys-mobile@despasys-production.iam.gserviceaccount.com
```

---

## 🔧 **Configurações Específicas**

### **Pub/Sub Topics Structure**
```bash
# Template de topics por tenant
despasys-tenant-{tenantId}-processes
despasys-tenant-{tenantId}-clients
despasys-tenant-{tenantId}-financial
despasys-tenant-{tenantId}-appointments
despasys-tenant-{tenantId}-notifications
despasys-tenant-{tenantId}-system

# Topics globais
despasys-global-analytics
despasys-global-errors
despasys-global-system
```

### **Firebase Project Setup**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto
firebase init

# Selecionar:
# - Realtime Database
# - Cloud Functions  
# - Cloud Messaging
```

### **Cloud SQL Instance**
```bash
# ❌ NÃO EXECUTAR - Manter Neon atual
# O banco principal continua sendo Neon PostgreSQL
# Apenas Firebase será usado para cache de sincronização

echo "✅ Mantendo Neon PostgreSQL como banco principal"
echo "Firebase será usado apenas para cache tempo real"
```

---

## 📦 **Dependências por Projeto**

### **Web App (NextJS)**
```bash
cd /Users/viniciusbaldochi1/despasys

npm install @google-cloud/pubsub \
           firebase-admin \
           firebase \
           @google-cloud/sql-connector
```

### **Mobile App (React Native)**
```bash
cd /Users/viniciusbaldochi1/despasys/mobile

npm install @react-native-firebase/app \
           @react-native-firebase/database \
           @react-native-firebase/messaging \
           @react-native-firebase/analytics
```

---

## 🔐 **Variáveis de Ambiente**

### **Web (.env.local)**
```bash
# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=despasys-production
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLOUD_CLIENT_EMAIL=despasys-web@despasys-production.iam.gserviceaccount.com

# Firebase Admin
FIREBASE_PROJECT_ID=despasys-production
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@despasys-production.iam.gserviceaccount.com

# Cloud SQL
# ❌ Não usado - Neon PostgreSQL é mantido
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/despasys?sslmode=require"

# Firebase (apenas para cache de sincronização)
FIREBASE_DATABASE_URL=https://despasys-production-default-rtdb.firebaseio.com

# Pub/Sub
PUBSUB_TOPIC_PREFIX=despasys-tenant
```

### **Mobile (.env)**
```bash
# Firebase Config (público)
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=despasys-production.firebaseapp.com
FIREBASE_DATABASE_URL=https://despasys-production-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=despasys-production
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:android:abcdef123456789
```

---

## 🎯 **Testes de Conectividade**

### **1. Teste Pub/Sub**
```typescript
// test/pubsub-connection.ts
import { PubSub } from '@google-cloud/pubsub'

async function testPubSub() {
  const pubsub = new PubSub()
  const topicName = 'test-topic'
  
  try {
    const [topic] = await pubsub.topic(topicName).create()
    console.log('✅ Pub/Sub conectado:', topic.name)
    
    // Publish test message
    await topic.publishMessage({
      data: Buffer.from('Hello from DespaSys!')
    })
    
    console.log('✅ Mensagem publicada com sucesso')
    
    // Cleanup
    await topic.delete()
  } catch (error) {
    console.error('❌ Erro Pub/Sub:', error)
  }
}
```

### **2. Teste Firebase**
```typescript
// test/firebase-connection.ts
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get } from 'firebase/database'

async function testFirebase() {
  const app = initializeApp(firebaseConfig)
  const db = getDatabase(app)
  
  try {
    // Write test data
    await set(ref(db, 'test'), {
      message: 'Hello from DespaSys!',
      timestamp: Date.now()
    })
    
    console.log('✅ Firebase write OK')
    
    // Read test data  
    const snapshot = await get(ref(db, 'test'))
    console.log('✅ Firebase read OK:', snapshot.val())
    
  } catch (error) {
    console.error('❌ Erro Firebase:', error)
  }
}
```

### **3. Teste Cloud SQL**
```typescript
// test/database-connection.ts
import { PrismaClient } from '@prisma/client'

async function testDatabase() {
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    console.log('✅ Database conectado')
    
    // Test query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    console.log('✅ Query OK:', result)
    
  } catch (error) {
    console.error('❌ Erro Database:', error)
  } finally {
    await prisma.$disconnect()
  }
}
```

---

## ⚡ **Scripts de Automação**

### **setup-gcp.sh**
```bash
#!/bin/bash

echo "🚀 Setting up DespaSys Google Cloud..."

# Set project
gcloud config set project despasys-production

# Enable APIs
echo "📡 Enabling APIs..."
gcloud services enable pubsub.googleapis.com
gcloud services enable sqladmin.googleapis.com  
gcloud services enable cloudfunctions.googleapis.com

# Create service accounts
echo "🔐 Creating service accounts..."
gcloud iam service-accounts create despasys-web \
  --display-name="DespaSys Web Application"

# Create topics (for existing tenants)
echo "📨 Creating Pub/Sub topics..."
for tenant in demo acme corp; do
  gcloud pubsub topics create despasys-tenant-${tenant}-processes
  gcloud pubsub topics create despasys-tenant-${tenant}-clients
  gcloud pubsub topics create despasys-tenant-${tenant}-financial
done

echo "✅ Setup completed!"
```

---

## 📊 **Monitoramento Inicial**

### **Health Check Endpoints**
```typescript
// app/api/health/pubsub/route.ts
export async function GET() {
  try {
    const pubsub = new PubSub()
    const [topics] = await pubsub.getTopics()
    
    return NextResponse.json({
      status: 'healthy',
      service: 'pubsub',
      topics: topics.length,
      timestamp: Date.now()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy', 
      service: 'pubsub',
      error: error.message
    }, { status: 500 })
  }
}
```

### **Basic Monitoring**
```typescript
// lib/monitoring.ts
export class Monitoring {
  static async logEvent(event: string, data: any) {
    console.log(`📊 [${event}]`, data)
    
    // TODO: Enviar para Google Cloud Logging
    // await logging.log({
    //   severity: 'INFO',
    //   resource: { type: 'global' },
    //   jsonPayload: { event, data, timestamp: Date.now() }
    // })
  }
  
  static async logError(error: Error, context: any) {
    console.error('❌ Error:', error, context)
    
    // TODO: Enviar para Error Reporting
  }
}
```

---

