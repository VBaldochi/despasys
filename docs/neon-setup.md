# 🌐 Guia de Configuração do Neon Database para ERP SaaS

## 📋 **Passo a Passo para Conectar ao Neon (Arquitetura Multi-Tenant)**

### **1. Criar Conta no Neon**
1. Acesse: https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Escolha região (preferencialmente us-east-1 para menor latência)

### **2. Obter String de Conexão**
No dashboard do Neon:
1. Vá em "Dashboard" > "Connection Details"
2. Copie a DATABASE_URL que será algo como:
```
postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### **3. Configurar Variáveis de Ambiente**

#### **Para o ERP SaaS (`/home/baldochi/lazuli-saas/.env`):**
```env
# 🔐 Banco de Dados Neon (Multi-Tenant)
DATABASE_URL="sua-connection-string-do-neon-aqui"

# 🔑 NextAuth Configuration
NEXTAUTH_SECRET="sua-chave-secreta-de-32-caracteres-minimo"
NEXTAUTH_URL="http://localhost:3001"

# 🏢 Multi-Tenancy
TENANT_MODE="enabled"
DEFAULT_TENANT_PLAN="starter"

# 💳 Pagamentos (Stripe)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# 📧 Email (SendGrid/Resend)
EMAIL_PROVIDER="resend"
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@seu-dominio.com"

# 🔄 Integrações
RECEITA_FEDERAL_API_KEY=""
DETRAN_API_KEY=""
CORREIOS_API_KEY=""

# 🚀 Ambiente
NODE_ENV="development"
```

#### **Para o Site Público (`/home/baldochi/lazuli-site-public/.env`):**
```env
# 🌐 API do SaaS (para comunicação entre projetos)
SAAS_API_URL="http://localhost:3001"
SAAS_API_KEY="sua-chave-api-para-comunicacao"

# 🚀 Ambiente
NODE_ENV="development"
```

### **4. Atualizar Schema Prisma**
No arquivo `/home/baldochi/lazuli-saas/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Mudança de sqlite para postgresql
  url      = env("DATABASE_URL")
}

// Resto do schema permanece igual...
```

### **5. Comandos para Executar**

```bash
# No diretório do SaaS
cd /home/baldochi/lazuli-saas

# Gerar client Prisma
npm run db:generate

# Fazer push do schema para o Neon
npm run db:push

# Criar usuário admin
npm run create-admin

# Executar projeto
npm run dev
```

### **6. Vantagens do Neon vs SQLite para ERP SaaS**

#### ✅ **Neon (PostgreSQL) - Ideal para ERP:**
- ☁️ Hospedado na nuvem
- 🔄 Backup automático
- 📈 Escalável (multi-tenant)
- 🌍 Acessível de qualquer lugar
- 💾 Até 0.5GB grátis (suficiente para começar)
- 🔒 SSL nativo
- 📊 Dashboard com métricas
- 🏢 Suporte a isolation de tenants
- 🔄 Connection pooling
- 📈 Analytics em tempo real

#### ❌ **SQLite (Atual) - Limitado para ERP:**
- 📁 Arquivo local apenas
- 🚫 Sem backup automático
- 📉 Limitado para produção
- 🏠 Só funciona no servidor local
- 🚫 Sem suporte multi-tenant
- ⚠️ Concorrência limitada

### **7. Estrutura de Banco para ERP SaaS Multi-Tenant**

#### **Para Produção (Multi-Tenant):**
- **ERP SaaS:** Neon PostgreSQL com schema isolation
- **Landing Page:** Sem banco próprio (usa APIs do ERP)
- **Analytics:** Banco separado ou schema dedicado

#### **Para Desenvolvimento:**
- **ERP SaaS:** Neon PostgreSQL (branch de desenvolvimento)
- **Landing Page:** Localhost com mock data
- **Testes:** Banco in-memory ou Docker PostgreSQL

#### **Schema Multi-Tenant Strategy:**
```sql
-- Estratégia: Schema por Tenant
CREATE SCHEMA tenant_empresa_a;
CREATE SCHEMA tenant_empresa_b;

-- Ou estratégia: Tabela com tenant_id
ALTER TABLE users ADD COLUMN tenant_id VARCHAR(50);
ALTER TABLE customers ADD COLUMN tenant_id VARCHAR(50);
```

### **8. Configuração de Branches no Neon**

O Neon permite criar branches do banco (como Git):

```bash
# Branch para desenvolvimento
DATABASE_URL_DEV="postgresql://user:pass@ep-dev-123.neon.tech/dev?sslmode=require"

# Branch para produção
DATABASE_URL_PROD="postgresql://user:pass@ep-prod-456.neon.tech/prod?sslmode=require"
```

### **9. Comando de Migração Completa**

```bash
#!/bin/bash
# Script para migrar de SQLite para Neon

echo "🔄 Migrando para Neon PostgreSQL..."

# 1. Fazer backup do SQLite atual
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# 2. Atualizar schema.prisma
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# 3. Gerar novo client
npx prisma generate

# 4. Fazer push para Neon
npx prisma db push

# 5. Criar admin
npm run create-admin

echo "✅ Migração concluída!"
```

### **10. Solução de Problemas Comuns**

#### **Erro de Conexão:**
```bash
# Verificar se a URL está correta
echo $DATABASE_URL

# Testar conexão
npx prisma db push --force-reset
```

#### **Erro de SSL:**
Adicionar `?sslmode=require` na URL de conexão

#### **Erro de Timezone:**
```env
DATABASE_URL="...?sslmode=require&timezone=America/Sao_Paulo"
```

---

## 🧪 **Como Testar a Conexão**

### **Teste Automático (Recomendado):**
```bash
cd /home/baldochi/lazuli-saas
./test-connection.sh
```

### **Testes Manuais:**
```bash
# 1. Testar geração do cliente
npx prisma generate

# 2. Testar conexão e sincronização
npx prisma db push

# 3. Criar usuário admin
npm run create-admin

# 4. Iniciar servidor
npm run dev

# 5. Testar login em http://localhost:3001
# Email: admin@lazuli.com / Senha: admin123
```

### **Verificação Visual:**
- 🌐 Dashboard Neon: https://console.neon.tech
- 📊 Prisma Studio: `npx prisma studio`
- 🖥️ Painel Admin: http://localhost:3001

---

## 🚀 **Próximos Passos**

1. ✅ Criar conta no Neon
2. ✅ Configurar `.env` no SaaS
3. ✅ Atualizar `schema.prisma`
4. ✅ Executar `db:push`
5. ✅ Criar usuário admin
6. ✅ Testar acesso ao painel

## 📞 **Suporte**

- 📧 Neon Docs: https://neon.tech/docs
- 🔧 Prisma Docs: https://prisma.io/docs
- 🆘 Em caso de problemas, verificar logs com `npm run dev`
