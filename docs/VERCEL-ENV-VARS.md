# 🚀 CONFIGURAÇÃO COMPLETA DAS VARIÁVEIS DE AMBIENTE - VERCEL

## 📋 **VARIÁVEIS OBRIGATÓRIAS**

### **1. Banco de Dados (NEON)**
```bash
DATABASE_URL=postgresql://neondb_owner:npg_w02tckphYsAL@ep-billowing-darkness-ac5bs3ay-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```
**Nota**: Use sua própria connection string do Neon.

### **2. Autenticação NextAuth**
```bash
# Nova secret gerada (USAR ESTA!)
NEXTAUTH_SECRET=wQqbPl0+OjLMa5n+ymHMlhxszvPNezc7Houy6QHPXiU=

# URL do seu projeto no Vercel
NEXTAUTH_URL=https://despasys.vercel.app
```

### **3. Ambiente**
```bash
NODE_ENV=production
```

## 📱 **VARIÁVEIS PARA API MOBILE (Opcional)**

### **4. API Keys Mobile**
```bash
# Chaves para autenticação do app mobile
MOBILE_API_KEYS=mobile-mf1tnbtk-940c76bc26d0f0e4,mobile-mf1tnbtk-608579b1ba9e917a,mobile-mf1tnbtk-8f50af150f7ae4a1

# Domínio do app mobile (quando desenvolver)
MOBILE_APP_DOMAIN=https://yourmobileapp.com
```

## 🔧 **COMO CONFIGURAR NO VERCEL**

### **Passo 1: Acessar Dashboard**
1. Acesse: [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto: **despasys**
3. Vá em: **Settings > Environment Variables**

### **Passo 2: Adicionar Variáveis**

**Copie e cole EXATAMENTE estas variáveis:**

| **Name** | **Value** | **Environment** |
|----------|-----------|-----------------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_w02tckphYsAL@ep-billowing-darkness-ac5bs3ay-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `wQqbPl0+OjLMa5n+ymHMlhxszvPNezc7Houy6QHPXiU=` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://despasys.vercel.app` | Production |
| `NEXTAUTH_URL` | `https://despasys-git-main-your-username.vercel.app` | Preview |
| `NODE_ENV` | `production` | Production |
| `MOBILE_API_KEYS` | `mobile-mf1tnbtk-940c76bc26d0f0e4,mobile-mf1tnbtk-608579b1ba9e917a` | Production, Preview, Development |

### **Passo 3: Configuração Específica por Ambiente**

#### **🟢 PRODUCTION (despasys.vercel.app)**
```bash
DATABASE_URL=postgresql://neondb_owner:npg_w02tckphYsAL@ep-billowing-darkness-ac5bs3ay-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_SECRET=wQqbPl0+OjLMa5n+ymHMlhxszvPNezc7Houy6QHPXiU=
NEXTAUTH_URL=https://despasys.vercel.app
NODE_ENV=production
MOBILE_API_KEYS=mobile-mf1tnbtk-940c76bc26d0f0e4,mobile-mf1tnbtk-608579b1ba9e917a
```

#### **🟡 PREVIEW (branches temporários)**
```bash
DATABASE_URL=postgresql://neondb_owner:npg_w02tckphYsAL@ep-billowing-darkness-ac5bs3ay-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_SECRET=wQqbPl0+OjLMa5n+ymHMlhxszvPNezc7Houy6QHPXiU=
NEXTAUTH_URL=https://despasys-git-main-viniciusbaldochi1.vercel.app
MOBILE_API_KEYS=mobile-dev-key-123
```

#### **🔵 DEVELOPMENT (local)**
```bash
DATABASE_URL=postgresql://neondb_owner:npg_w02tckphYsAL@ep-billowing-darkness-ac5bs3ay-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_SECRET=wQqbPl0+OjLMa5n+ymHMlhxszvPNezc7Houy6QHPXiU=
NEXTAUTH_URL=http://localhost:3001
MOBILE_API_KEYS=mobile-dev-key-123
```

## 🎯 **INSTRUÇÕES DE CONFIGURAÇÃO STEP-BY-STEP**

### **1. DATABASE_URL**
- **Environment**: Production, Preview, Development
- **Value**: Sua connection string do Neon
- **Exemplo**: `postgresql://user:pass@host/db?sslmode=require`

### **2. NEXTAUTH_SECRET**
- **Environment**: Production, Preview, Development  
- **Value**: `wQqbPl0+OjLMa5n+ymHMlhxszvPNezc7Houy6QHPXiU=`
- **Importante**: Use EXATAMENTE este valor (já foi gerado)

### **3. NEXTAUTH_URL** 
- **Production**: `https://despasys.vercel.app`
- **Preview**: `https://despasys-git-main-[seu-username].vercel.app`
- **Development**: `http://localhost:3001`

### **4. NODE_ENV**
- **Production**: `production`
- **Preview**: `production`
- **Development**: `development`

### **5. MOBILE_API_KEYS**
- **Production**: `mobile-mf1tnbtk-940c76bc26d0f0e4,mobile-mf1tnbtk-608579b1ba9e917a`
- **Preview/Dev**: `mobile-dev-key-123`

## ⚠️ **PONTOS CRÍTICOS**

### **🔴 OBRIGATÓRIO PARA FUNCIONAMENTO**
1. **DATABASE_URL** - Sem isso, nada funciona
2. **NEXTAUTH_SECRET** - Essencial para autenticação
3. **NEXTAUTH_URL** - Deve ser EXATO (com https://)

### **🟡 IMPORTANTE PARA SEGURANÇA**
1. **NODE_ENV=production** - Otimizações de produção
2. **MOBILE_API_KEYS** - Segurança da API mobile

### **✅ VALIDAÇÃO**
Após configurar, teste:
```bash
# 1. Acesse seu app
https://despasys.vercel.app

# 2. Teste endpoint de debug
https://despasys.vercel.app/api/debug/session

# 3. Verifique logs do Vercel
Vercel Dashboard > Functions > View Logs
```

## 🚨 **PROBLEMAS COMUNS**

### **❌ "Invalid NEXTAUTH_URL"**
- **Solução**: Certifique-se que NEXTAUTH_URL tem `https://` e não tem `/` no final

### **❌ "Database connection failed"**
- **Solução**: Verifique se DATABASE_URL está correto e com `?sslmode=require`

### **❌ "Session not found"**
- **Solução**: Limpe cookies do navegador e faça novo login

### **❌ "API Key invalid"**
- **Solução**: Use as API Keys geradas especificadas acima

## 🔄 **APÓS CONFIGURAR**

1. **Redeploy obrigatório**: 
   - Vercel Dashboard > Deployments > Redeploy
   - ❌ DESMARCAR "Use existing Build Cache"

2. **Teste completo**:
   - Login normal ✅
   - Aba anônima ✅
   - Dispositivo diferente ✅

---

## 📋 **RESUMO RÁPIDO - COPY/PASTE**

```bash
# COLE ESTAS VARIÁVEIS NO VERCEL:

DATABASE_URL=postgresql://neondb_owner:npg_w02tckphYsAL@ep-billowing-darkness-ac5bs3ay-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_SECRET=wQqbPl0+OjLMa5n+ymHMlhxszvPNezc7Houy6QHPXiU=

NEXTAUTH_URL=https://despasys.vercel.app

NODE_ENV=production

MOBILE_API_KEYS=mobile-mf1tnbtk-940c76bc26d0f0e4,mobile-mf1tnbtk-608579b1ba9e917a
```

**✅ Problema de login será 100% resolvido após esta configuração!**
