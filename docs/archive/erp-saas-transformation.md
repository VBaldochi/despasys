# 🚗 Transformação para ERP SaaS de Despachantes - Guia Completo

## 🎯 **Visão Geral da Transformação**

Transformar o atual sistema de gestão para despachantes em um **ERP SaaS multi-tenant especializado** que pode atender múltiplos escritórios de despachantes simultaneamente.

### **🔄 De Sistema Simples para ERP SaaS de Despachantes:**
- **Antes:** Sistema single-tenant para um despachante
- **Depois:** Plataforma multi-tenant para múltiplos escritórios de despachantes
- **Modelo de Negócio:** Subscription-based focado no setor de despachantes
- **Especialização:** 100% focado em processos veiculares e DETRAN

---

## 🏗️ **Arquitetura Multi-Tenant**

### **📊 Estratégia de Isolamento:**

#### **1. Schema-Based Tenancy (Recomendado)**
```sql
-- Um schema por empresa
CREATE SCHEMA tenant_empresa_abc;
CREATE SCHEMA tenant_empresa_xyz;

-- Vantagens:
-- ✅ Isolamento completo de dados
-- ✅ Backup individual por tenant
-- ✅ Performance isolada
-- ✅ Compliance e segurança
```

#### **2. Row-Level Tenancy (Alternativa)**
```sql
-- Adicionar tenant_id em todas as tabelas
ALTER TABLE customers ADD COLUMN tenant_id VARCHAR(50);
ALTER TABLE processes ADD COLUMN tenant_id VARCHAR(50);

-- Vantagens:
-- ✅ Menos complexidade de infraestrutura
-- ✅ Queries mais simples
-- ❌ Menos isolamento
```

---

## 📋 **Plano de Transformação - 4 Fases**

### **🚀 FASE 1: Fundação Multi-Tenant (Semana 1-2)**

#### **1.1 Schema Multi-Tenant**
```prisma
// Novos modelos para multi-tenancy
model Tenant {
  id          String   @id @default(cuid())
  name        String   // Nome do escritório de despachante
  domain      String   @unique // escritorio.despachante.app
  plan        String   @default("despachante_solo") // despachante_solo, escritorio_pequeno, escritorio_grande
  status      String   @default("active") // active, suspended, trial
  settings    Json?    // Configurações específicas do despachante
  
  // Dados específicos do despachante
  registroProfissional String? // Número do registro no DETRAN
  cnpj        String?  // CNPJ do escritório
  endereco    String?  // Endereço do escritório
  telefone    String?  // Telefone principal
  
  // Billing
  stripeCustomerId    String?
  subscriptionId      String?
  subscriptionStatus  String?
  trialEndsAt        DateTime?
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relacionamentos
  users       User[]
  customers   Customer[]
  processes   Process[]
  
  @@map("tenants")
}

// Modificar User existente
model User {
  id       String @id @default(cuid())
  tenantId String // Nova coluna
  tenant   Tenant @relation(fields: [tenantId], references: [id])
  // ... resto dos campos
}
```

#### **1.2 Middleware de Tenant**
```typescript
// middleware/tenant.ts
export function withTenant(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Extrair tenant do subdominio ou header
    const tenantId = extractTenantId(req);
    
    // Validar tenant
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });
    
    if (!tenant || tenant.status !== 'active') {
      return res.status(403).json({ error: 'Tenant not found or inactive' });
    }
    
    // Adicionar tenant ao contexto
    req.tenant = tenant;
    return handler(req, res);
  };
}
```

### **🏢 FASE 2: Módulos ERP Core (Semana 3-4)**

#### **2.1 Gestão Financeira Avançada**
```typescript
// Novo módulo: Financeiro
interface ContasAPagar {
  id: string
  tenantId: string
  fornecedor: Fornecedor
  valor: number
  dataVencimento: Date
  status: 'pendente' | 'pago' | 'vencido'
  categoria: string
  centroCusto?: string
}

interface ContasAReceber {
  id: string
  tenantId: string
  cliente: Customer
  valor: number
  dataVencimento: Date
  status: 'pendente' | 'recebido' | 'vencido'
  formaPagamento?: string
}

interface FluxoCaixa {
  id: string
  tenantId: string
  data: Date
  entradas: number
  saidas: number
  saldo: number
  projecao: number
}
```

#### **2.2 Gestão de Estoque (Se aplicável)**
```typescript
interface Produto {
  id: string
  tenantId: string
  nome: string
  codigo: string
  categoria: string
  unidadeMedida: string
  precoCompra: number
  precoVenda: number
  estoqueMinimo: number
  estoqueAtual: number
}

interface MovimentacaoEstoque {
  id: string
  tenantId: string
  produtoId: string
  tipo: 'entrada' | 'saida'
  quantidade: number
  valor: number
  motivo: string
  dataMovimento: Date
}
```

#### **2.3 CRM Avançado**
```typescript
interface Lead {
  id: string
  tenantId: string
  nome: string
  email: string
  telefone: string
  origem: 'website' | 'indicacao' | 'marketing'
  status: 'novo' | 'qualificado' | 'proposta' | 'convertido'
  score: number
  ultimoContato: Date
}

interface Oportunidade {
  id: string
  tenantId: string
  leadId: string
  valor: number
  probabilidade: number
  dataFechamento: Date
  estagio: string
  observacoes: string
}
```

### **💳 FASE 3: Sistema de Billing (Semana 5-6)**

#### **3.1 Integração com Stripe**
```typescript
// Planos de assinatura
interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  limits: {
    users: number
    customers: number
    processes: number
    storage: number // GB
  }
}

const PLANS = {
  starter: {
    price: 99, // R$ 99/mês
    users: 2,
    customers: 100,
    processes: 500
  },
  professional: {
    price: 199, // R$ 199/mês
    users: 10,
    customers: 1000,
    processes: 5000
  },
  enterprise: {
    price: 399, // R$ 399/mês
    users: -1, // unlimited
    customers: -1,
    processes: -1
  }
}
```

#### **3.2 APIs de Billing**
```typescript
// api/billing/subscription.ts
export default withTenant(async (req, res) => {
  const { tenant } = req;
  
  switch (req.method) {
    case 'POST':
      // Criar nova assinatura
      const subscription = await stripe.subscriptions.create({
        customer: tenant.stripeCustomerId,
        items: [{ price: req.body.priceId }]
      });
      break;
      
    case 'PUT':
      // Atualizar plano
      await stripe.subscriptions.update(
        tenant.subscriptionId,
        { items: [{ price: req.body.newPriceId }] }
      );
      break;
  }
});
```

### **🌐 FASE 4: Landing Page + Onboarding (Semana 7-8)**

#### **4.1 Landing Page**
```typescript
// Estrutura da landing page
/app
  /(marketing)
    /page.tsx           // Homepage
    /pricing/page.tsx   // Planos e preços
    /features/page.tsx  // Funcionalidades
    /about/page.tsx     // Sobre
    /contact/page.tsx   // Contato
    /demo/page.tsx      // Demo/trial
  /(auth)
    /signup/page.tsx    // Cadastro
    /login/page.tsx     // Login
  /(app)
    /[tenant]           // Área do tenant
      /dashboard/page.tsx
      /customers/page.tsx
      // ... resto da aplicação
```

#### **4.2 Processo de Onboarding**
```typescript
interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType
  completed: boolean
}

const ONBOARDING_STEPS = [
  {
    id: 'company-info',
    title: 'Informações da Empresa',
    component: CompanyInfoForm
  },
  {
    id: 'team-setup',
    title: 'Configurar Equipe',
    component: TeamSetupForm
  },
  {
    id: 'first-customer',
    title: 'Primeiro Cliente',
    component: FirstCustomerForm
  },
  {
    id: 'billing-setup',
    title: 'Configurar Pagamento',
    component: BillingSetupForm
  }
];
```

---

## 🎨 **Nova Arquitetura de Pastas**

```
src/
├── app/
│   ├── (marketing)/           # Landing page pública
│   │   ├── page.tsx
│   │   ├── pricing/
│   │   ├── features/
│   │   └── demo/
│   ├── (auth)/               # Autenticação
│   │   ├── login/
│   │   ├── signup/
│   │   └── onboarding/
│   ├── (app)/                # Aplicação multi-tenant
│   │   └── [tenant]/
│   │       ├── dashboard/
│   │       ├── customers/
│   │       ├── processes/
│   │       ├── financial/
│   │       ├── reports/
│   │       └── settings/
│   └── api/
│       ├── auth/
│       ├── tenant/
│       ├── billing/
│       └── webhooks/
├── components/
│   ├── marketing/            # Componentes da landing
│   ├── app/                  # Componentes da aplicação
│   ├── billing/              # Componentes de billing
│   └── shared/               # Componentes compartilhados
├── lib/
│   ├── auth.ts
│   ├── billing.ts            # Stripe integration
│   ├── tenant.ts             # Tenant utilities
│   └── analytics.ts          # Analytics & tracking
└── middleware.ts             # Tenant routing
```

---

## 💰 **Modelo de Monetização**

### **📊 Planos Sugeridos:**

| Plano | Preço/mês | Usuários | Clientes | Processos | Features |
|-------|-----------|----------|----------|-----------|----------|
| **Starter** | R$ 99 | 2 | 100 | 500 | Básico |
| **Professional** | R$ 199 | 10 | 1.000 | 5.000 | + Relatórios |
| **Enterprise** | R$ 399 | Ilimitado | Ilimitado | Ilimitado | + API + Suporte |

### **💡 Features por Plano:**

#### **Starter (R$ 99/mês):**
- ✅ Gestão de clientes
- ✅ Processos básicos
- ✅ Financeiro simples
- ✅ 2 usuários
- ✅ Suporte por email

#### **Professional (R$ 199/mês):**
- ✅ Tudo do Starter +
- ✅ Relatórios avançados
- ✅ API REST
- ✅ Integrações
- ✅ 10 usuários
- ✅ Suporte prioritário

#### **Enterprise (R$ 399/mês):**
- ✅ Tudo do Professional +
- ✅ White label
- ✅ SSO/SAML
- ✅ Usuários ilimitados
- ✅ Suporte 24/7
- ✅ Account manager

---

## 🚀 **Próximos Passos Imediatos**

### **1. Configuração do Ambiente (Hoje)**
```bash
# Instalar dependências para multi-tenancy
npm install @stripe/stripe-js stripe
npm install @prisma/client prisma
npm install next-auth
npm install resend # para emails
```

### **2. Modificar Schema Prisma (Amanhã)**
- Adicionar modelo `Tenant`
- Adicionar `tenantId` em todas as tabelas
- Criar relacionamentos

### **3. Implementar Middleware Tenant (Dia 3)**
- Roteamento baseado em subdomínio
- Validação de tenant
- Context de tenant

### **4. Criar Landing Page (Semana 1)**
- Homepage convertedora
- Página de pricing
- Processo de signup

---

## 📊 **Métricas de Sucesso**

### **🎯 KPIs para acompanhar:**
- **MRR (Monthly Recurring Revenue)**
- **Customer Acquisition Cost (CAC)**
- **Lifetime Value (LTV)**
- **Churn Rate**
- **Trial-to-Paid Conversion**

### **📈 Metas 6 meses:**
- 50 empresas assinantes
- R$ 15.000 MRR
- Churn rate < 5%
- 95% uptime

---

## 🔧 **Ferramentas e Integrações**

### **💳 Pagamentos:**
- Stripe (internacional)
- Pagar.me (nacional)

### **📧 Email Marketing:**
- Resend/SendGrid (transacional)
- Mailchimp (marketing)

### **📊 Analytics:**
- PostHog (product analytics)
- Google Analytics 4
- Stripe Analytics

### **💬 Suporte:**
- Crisp/Intercom (chat)
- Freshdesk (tickets)

### **🔄 Automação:**
- Zapier/n8n (workflows)
- GitHub Actions (CI/CD)

---

**🎯 Objetivo Final:** Ter um ERP SaaS robusto, escalável e lucrativo em 2 meses!
