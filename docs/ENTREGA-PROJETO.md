# 📋 Documentação de Entrega - Sistema DespaSys

## 📊 Informações do Projeto

- **Nome**: DespaSys - Sistema de Gestão para Despachantes
- **Repositório**: https://github.com/VBaldochi/despasys
- **Tecnologias**: Next.js 14+, React Native/Expo, PostgreSQL, Firebase
- **Data**: Outubro 2025

---

## 1️⃣ Definição do Escopo e Requisitos

### 🎯 Escopo do Projeto

O DespaSys é um sistema completo de gestão para despachantes que facilita o gerenciamento de processos, clientes, documentos e débitos. O sistema é de **uso exclusivo da equipe do despachante** (administradores e funcionários), com aplicativo mobile para **consultas rápidas em campo** quando os funcionários estão na rua atendendo clientes ou em órgãos públicos.

### ✅ Requisitos Funcionais

#### RF01 - Gestão de Usuários
- **Descrição**: Sistema de autenticação e autorização multi-tenant para equipe do despachante
- **Prioridade**: Alta
- **Funcionalidades**:
  - Login com email/senha
  - Controle de permissões por perfil (Admin, Funcionário)
  - Multi-tenancy (isolamento de dados por despachante)
  - Recuperação de senha
  - Gerenciamento de usuários da equipe

#### RF02 - Gestão de Clientes
- **Descrição**: CRUD completo de clientes
- **Prioridade**: Alta
- **Funcionalidades**:
  - Cadastro de clientes (CPF/CNPJ, nome, contato)
  - Listagem e busca de clientes
  - Edição e exclusão de clientes
  - Histórico de processos por cliente

#### RF03 - Gestão de Processos
- **Descrição**: Controle de processos de despachante
- **Prioridade**: Alta
- **Funcionalidades**:
  - Cadastro de processos (licenciamento, transferência, etc.)
  - Controle de status (Pendente, Em Andamento, Concluído)
  - Atribuição de processos a clientes
  - Priorização de processos (Alta, Média, Baixa)
  - Anexo de documentos

#### RF04 - Gestão de Débitos
- **Descrição**: Controle financeiro de débitos e pagamentos
- **Prioridade**: Média
- **Funcionalidades**:
  - Cadastro de débitos por processo
  - Controle de status de pagamento
  - Histórico de débitos por cliente

#### RF05 - Aplicativo Mobile (Trabalho em Campo)
- **Descrição**: Aplicativo mobile para funcionários consultarem informações em campo
- **Prioridade**: Média
- **Funcionalidades**:
  - Consulta rápida de processos em andamento
  - Visualização de débitos de clientes
  - Recebimento de notificações urgentes
  - Dashboard com resumo para acesso rápido na rua
  - Sincronização em tempo real com o sistema web

#### RF06 - Sincronização em Tempo Real
- **Descrição**: Sincronização automática entre web e mobile
- **Prioridade**: Alta
- **Funcionalidades**:
  - Firebase Realtime Database para eventos
  - Notificações push
  - Atualização automática de dados
  - Sistema de eventos (processos, clientes, notificações)

#### RF07 - Sistema de Notificações
- **Descrição**: Envio de notificações para clientes e usuários
- **Prioridade**: Média
- **Funcionalidades**:
  - Notificações de atualização de processos
  - Alertas de débitos
  - Notificações de conclusão de serviços
  - Histórico de notificações

### ⚙️ Requisitos Não Funcionais

#### RNF01 - Desempenho
- Tempo de resposta da API: < 500ms (90% das requisições)
- Tempo de carregamento de telas: < 2s
- Sincronização em tempo real: < 1s de latência

#### RNF02 - Segurança
- Autenticação JWT com NextAuth.js
- Tokens mobile com validade de 30 dias
- Criptografia de senhas (bcrypt)
- Isolamento de dados por tenant
- HTTPS obrigatório em produção
- Validação de permissões em todas as rotas

#### RNF03 - Escalabilidade
- Arquitetura multi-tenant
- Banco de dados PostgreSQL (Neon) com pooling de conexões
- Cache com Firebase Realtime Database
- Suporte a múltiplos despachantes
- Deploy serverless (Vercel)

#### RNF04 - Usabilidade
- Interface responsiva (web)
- Design consistente entre web e mobile
- Feedback visual para todas as ações
- Mensagens de erro claras
- Modo offline no mobile (em desenvolvimento)

#### RNF05 - Manutenibilidade
- Código TypeScript (type-safe)
- Componentização e reutilização
- Documentação de APIs
- Testes automatizados (em desenvolvimento)
- Logs estruturados

#### RNF06 - Disponibilidade
- Uptime de 99% (SLA)
- Backup automático do banco de dados
- Monitoramento de erros
- Deploy contínuo (CI/CD)

#### RNF07 - Compatibilidade
- **Web**: Chrome, Firefox, Safari, Edge (últimas 2 versões)
- **Mobile**: iOS 13+, Android 8+
- **Responsividade**: Desktop, Tablet, Mobile

---

## 2️⃣ Modelagem Inicial

### 📐 Diagrama de Casos de Uso

```
┌─────────────────────────────────────────────────────────────┐
│                    Sistema DespaSys                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐                                                │
│  │  Admin   │                                                │
│  │(Dono do  │                                                │
│  │Despacho) │                                                │
│  └────┬─────┘                                                │
│       │                                                      │
│       ├──> Gerenciar Usuários da Equipe                     │
│       ├──> Gerenciar Clientes                               │
│       ├──> Gerenciar Processos                              │
│       ├──> Gerenciar Débitos                                │
│       ├──> Visualizar Dashboard                             │
│       ├──> Configurar Sistema                               │
│       └──> Gerar Relatórios                                 │
│                                                               │
│  ┌──────────┐                                                │
│  │Funcionário│                                               │
│  │ (Equipe) │                                                │
│  └────┬─────┘                                                │
│       │                                                      │
│       ├──> Cadastrar Cliente                                │
│       ├──> Criar Processo                                   │
│       ├──> Atualizar Status Processo                        │
│       ├──> Registrar Débito                                 │
│       ├──> Enviar Notificações                              │
│       ├──> Anexar Documentos                                │
│       └──> Consultar no Mobile (em campo)                   │
│                                                               │
│  ┌──────────┐                                                │
│  │Funcionário│ (Mobile - Em Campo)                          │
│  │ na Rua   │                                                │
│  └────┬─────┘                                                │
│       │                                                      │
│       ├──> Consultar Processos Rapidamente                  │
│       ├──> Ver Débitos de Clientes                          │
│       ├──> Receber Notificações Urgentes                    │
│       ├──> Visualizar Dashboard Simplificado                │
│       └──> Acessar Info sem Abrir Sistema Completo          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAMADA DE APRESENTAÇÃO                    │
├──────────────────────┬──────────────────────────────────────────┤
│   Web (Next.js 14)   │      Mobile (React Native/Expo)          │
│   - Dashboard Admin  │      - Consultas Rápidas em Campo        │
│   - CRUD Processos   │      - Notificações Urgentes             │
│   - CRUD Clientes    │      - Dashboard Simplificado            │
│   - CRUD Débitos     │      - Acesso Rápido sem Sistema Web     │
│   - Relatórios       │      - Sync em Tempo Real                │
│   - Gestão Equipe    │      (Uso da Equipe na Rua)              │
└──────────────────────┴──────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                        CAMADA DE API                             │
├─────────────────────────────────────────────────────────────────┤
│              Next.js API Routes (Serverless)                     │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  /api/auth   │  │ /api/mobile  │  │ /api/admin   │         │
│  │  - Login     │  │ - Clientes   │  │ - Users      │         │
│  │  - Register  │  │ - Processos  │  │ - Tenants    │         │
│  └──────────────┘  │ - Débitos    │  │ - Config     │         │
│                    │ - Notif.     │  └──────────────┘         │
│                    └──────────────┘                             │
│                                                                  │
│  Middlewares:                                                   │
│  - Autenticação (NextAuth.js)                                  │
│  - Validação Mobile (validateMobileAuth)                       │
│  - Tenant Isolation                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      CAMADA DE NEGÓCIO                           │
├─────────────────────────────────────────────────────────────────┤
│                    Services & Business Logic                     │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ DualWriteService │  │ RealtimeSyncSvc  │                    │
│  │ - Neon → Firebase│  │ - Event Listeners│                    │
│  │ - Pub/Sub Events │  │ - Data Sync      │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ AuthService      │  │ NotificationSvc  │                    │
│  │ - JWT Tokens     │  │ - Push Notif.    │                    │
│  │ - Permissions    │  │ - Firebase       │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      CAMADA DE DADOS                             │
├──────────────────────┬──────────────────────────────────────────┤
│  PostgreSQL (Neon)   │    Firebase Realtime Database            │
│  - Dados Principais  │    - Cache & Sync                        │
│  - Processos         │    - Eventos em Tempo Real               │
│  - Clientes          │    - Notificações                        │
│  - Débitos           │    - Estado Temporário                   │
│  - Usuários          │                                          │
│  - Tenants           │    Google Cloud Pub/Sub                  │
│                      │    - Message Queue                       │
│  Prisma ORM          │    - Event Bus                          │
└──────────────────────┴──────────────────────────────────────────┘
```

### 🔄 Fluxo de Sincronização em Tempo Real

```
┌──────────┐                 ┌──────────┐                 ┌──────────┐
│   Web    │                 │   API    │                 │  Mobile  │
│ (Admin)  │                 │ (Server) │                 │ (Client) │
└────┬─────┘                 └────┬─────┘                 └────┬─────┘
     │                            │                            │
     │ 1. Criar Processo          │                            │
     ├──────────────────────────> │                            │
     │                            │                            │
     │                       2. Salvar no Neon                 │
     │                            │                            │
     │                       3. Sync Firebase                  │
     │                            ├──────────────┐             │
     │                            │              │             │
     │                            │   Firebase   │             │
     │                            │   Realtime   │             │
     │                            │   Database   │             │
     │                            │              │             │
     │                            │<─────────────┘             │
     │                            │                            │
     │                       4. Pub/Sub Event                  │
     │                            ├────────────────────────────┼> 
     │                            │                            │ 5. Listener
     │                            │                            │    Recebe
     │ 6. Resposta 200            │                            │
     │ <────────────────────────── │                            │
     │                            │                            │ 6. Atualiza UI
     │                            │                            │    Tempo Real
     └────────────────────────────┴────────────────────────────┘
```

---

## 3️⃣ Repositório GitHub

### 📦 Informações do Repositório

- **URL**: https://github.com/VBaldochi/despasys
- **Branch Principal**: `main`
- **Visibilidade**: Privado
- **Owner**: VBaldochi

### 📁 Estrutura de Pastas

```
despasys/
├── src/                          # Código fonte web
│   ├── app/                      # Next.js App Router
│   │   ├── (admin)/             # Rotas admin
│   │   ├── (app)/               # Rotas autenticadas
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/            # Autenticação
│   │   │   ├── mobile/          # Endpoints mobile
│   │   │   └── notifications/   # Notificações
│   │   └── login/               # Página de login
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes base
│   │   ├── admin/               # Componentes admin
│   │   ├── modules/             # Módulos de negócio
│   │   └── layout/              # Layout components
│   ├── lib/                     # Bibliotecas e utils
│   │   ├── auth.ts              # NextAuth config
│   │   ├── firebase.ts          # Firebase Web SDK
│   │   ├── firebase-admin.ts    # Firebase Admin SDK
│   │   ├── dual-write.ts        # Sync service
│   │   └── prisma.ts            # Prisma client
│   ├── types/                   # TypeScript types
│   └── contexts/                # React contexts
├── mobile/                       # App mobile (Expo)
│   ├── app/                     # Expo Router
│   │   ├── (tabs)/              # Navegação com tabs
│   │   └── login.tsx            # Login mobile
│   ├── src/
│   │   ├── components/          # Componentes mobile
│   │   ├── services/            # Services
│   │   │   ├── api.ts           # API client
│   │   │   ├── firebase.ts      # Firebase mobile
│   │   │   └── realtimeSync.ts  # Realtime sync
│   │   ├── hooks/               # Custom hooks
│   │   └── store/               # State management
│   └── package.json
├── prisma/                       # Prisma ORM
│   └── schema.prisma            # Schema do banco
├── docs/                         # Documentação
│   ├── COMO-TESTAR-MENSAGERIA.md
│   ├── FIREBASE-SETUP.md
│   ├── mobile-api.md
│   └── roadmap-tecnico.md
├── scripts/                      # Scripts utilitários
│   ├── create-admin.ts
│   └── seed-final.js
├── .env                         # Variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

### 🔧 Tecnologias Utilizadas

#### Backend
- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript 5+
- **ORM**: Prisma
- **Autenticação**: NextAuth.js
- **Banco de Dados**: PostgreSQL (Neon)
- **Cache/Sync**: Firebase Realtime Database
- **Message Queue**: Google Cloud Pub/Sub

#### Frontend Web
- **Framework**: Next.js 14+ (React 18)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: Custom + Radix UI (planejado)
- **State**: React Context + useState

#### Mobile
- **Framework**: React Native (Expo)
- **Navegação**: Expo Router
- **Linguagem**: TypeScript
- **State**: Zustand
- **Storage**: AsyncStorage
- **Realtime**: Firebase Realtime Database

#### DevOps
- **Deploy Web**: Vercel
- **Deploy Mobile**: Expo EAS
- **CI/CD**: GitHub Actions (planejado)
- **Monitoramento**: Vercel Analytics

---

## 4️⃣ Estrutura do Back-end

### 🚀 Framework e Configuração

**Framework**: Next.js 14+ com App Router (Serverless Functions)

#### Configuração Principal (`next.config.ts`)

```typescript
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  }
}
```

#### Variáveis de Ambiente (`.env`)

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3001"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_DATABASE_URL="..."
GOOGLE_APPLICATION_CREDENTIALS="./credentials.json"
```

### 🛣️ API Routes Implementadas

#### Autenticação Web
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/auth/register` - Registro de usuários

#### Autenticação Mobile
- `POST /api/mobile/auth` - Login mobile (retorna token)
- Validação via `validateMobileAuth(request)`

#### Endpoints Mobile
- `GET /api/mobile/clientes` - Lista clientes do tenant
- `GET /api/mobile/processos` - Lista processos
- `GET /api/mobile/notificacoes` - Lista notificações
- `GET /api/mobile/debitos` - Lista débitos
- `GET /api/mobile/dashboard` - Dados do dashboard

#### Admin/Web
- `GET /api/admin/users` - Gerenciar usuários
- `POST /api/notifications/send` - Enviar notificações

### 🔐 Sistema de Autenticação

#### NextAuth.js (Web)
```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Valida usuário no banco
        // Retorna user com tenantId
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = user.tenantId
        token.role = user.role
      }
      return token
    }
  }
}
```

#### Mobile Auth
```typescript
// src/lib/mobile-auth.ts
export async function validateMobileAuth(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const userId = request.headers.get('X-User-Id')
  const tenantId = request.headers.get('X-Tenant-Id')
  
  // Valida token e retorna usuário
  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId }
  })
  
  return { success: true, user, tenantId }
}
```

### 🗄️ Prisma ORM

#### Cliente Prisma
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

#### Exemplo de Query
```typescript
// GET /api/mobile/clientes
const clientes = await prisma.customer.findMany({
  where: { tenantId },
  select: {
    id: true,
    name: true,
    email: true,
    phone: true,
    cpf: true,
    createdAt: true
  },
  orderBy: { name: 'asc' }
})
```

### 🔥 Firebase Integration

#### Firebase Admin (Server-side)
```typescript
// src/lib/firebase-admin.ts
import { initializeApp, cert } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
})

export const adminDatabase = getDatabase()
```

#### Dual Write Service
```typescript
// src/lib/dual-write.ts
export class DualWriteService {
  static async createNotification(tenantId, title, message, type) {
    const notification = { id, title, message, type, createdAt, read: false }
    
    // 1. Salvar no Firebase
    await adminDatabase.ref(`tenants/${tenantId}/notifications`).push(notification)
    
    // 2. Publicar evento Pub/Sub (opcional)
    await DespaSysEventBus.publishEvent(tenantId, 'notifications', {
      action: 'created',
      data: notification
    })
    
    return notification
  }
}
```

---

## 5️⃣ Protótipo Front-end

### 🖥️ Telas Web Implementadas

Todas as rotas seguem o padrão: `http://localhost:3001/{nome-da-rota}`

#### 1. Login (`/login`)
- Email e senha
- Seleção de tenant (despachante)
- Recuperação de senha (planejado)
- **URL**: http://localhost:3001/login

#### 2. Dashboard (`/dashboard`)
- Cards com métricas:
  - Total de processos
  - Processos pendentes
  - Clientes ativos
  - Débitos em aberto
- Gráficos (planejado)
- Atividades recentes
- **URL**: http://localhost:3001/dashboard

#### 3. Gestão de Processos (`/processos`)
- Listagem de processos
- Filtros por status, tipo, prioridade
- Criação de novo processo
- Edição de processo
- Visualização detalhada
- **URL**: http://localhost:3001/processos

#### 4. Gestão de Clientes (`/clientes`)
- Listagem de clientes
- Busca por nome/CPF
- Cadastro de cliente
- Edição de dados
- Histórico de processos
- **URL**: http://localhost:3001/clientes

#### 5. Gestão de Débitos (`/debitos`)
- Listagem de débitos
- Filtros por status de pagamento
- Registro de novo débito
- Marcação de pago/pendente
- **URL**: http://localhost:3001/debitos

#### 6. Gestão de Usuários (`/usuarios`)
- Listagem de usuários da equipe
- Cadastro de funcionários
- Controle de permissões
- Ativação/desativação
- **URL**: http://localhost:3001/usuarios

#### 7. Página de Testes (`/test-notifications`)
- Formulário para envio de notificações
- Seleção de tenant
- Mensagens rápidas pré-definidas
- Instruções de teste
- **URL**: http://localhost:3001/test-notifications

### 📱 Telas Mobile Implementadas

**Objetivo**: Permitir que funcionários consultem informações rapidamente quando estão **em campo** (na rua, em órgãos públicos, atendendo clientes), sem precisar acessar o sistema web completo.

#### 1. Login (`/login`)
- Email e senha (mesmos do sistema web)
- Seleção de tenant/domínio
- Armazenamento de token para uso offline

#### 2. Dashboard (`/(tabs)/index`)
- Resumo rápido de processos em andamento
- Débitos urgentes
- Últimas notificações
- Cards com informações essenciais
- **Uso**: Visão geral rápida no campo

#### 3. Processos (`/(tabs)/processos`)
- Lista de processos do despachante
- Status visual com cores
- Detalhes do processo
- Informações do cliente
- **Uso**: Consultar status de processo durante atendimento

#### 4. Débitos (`/(tabs)/debitos`)
- Lista de débitos
- Status de pagamento
- Valor total por cliente
- **Uso**: Verificar débitos pendentes durante visita

#### 5. Sync/Notificações (`/(tabs)/sync`)
- Dashboard de eventos em tempo real
- Lista de notificações recebidas
- Indicador de conexão Firebase
- Log de eventos
- **Uso**: Receber atualizações urgentes instantaneamente

### 🎨 Componentes Reutilizáveis

#### Web
- `<Card>` - Container de conteúdo
- `<Button>` - Botões com variantes
- `<Input>` - Campos de formulário
- `<Table>` - Tabelas de dados
- `<Modal>` - Janelas modais
- `<Sidebar>` - Menu lateral

#### Mobile
- `<ThemedView>` - View com tema
- `<ThemedText>` - Texto com tema
- `<RealtimeDashboard>` - Dashboard sync
- `<ProcessCard>` - Card de processo
- `<NotificationItem>` - Item de notificação

---

## 6️⃣ Banco de Dados

### 💾 Tecnologia

- **SGBD**: PostgreSQL 15+
- **Provedor**: Neon (Serverless PostgreSQL)
- **ORM**: Prisma 5+
- **Conexão**: Pooling com PgBouncer

### 📊 Modelagem Conceitual

#### Entidades Principais

1. **Tenant** (Despachante)
   - Representa cada empresa/despachante
   - Isolamento de dados por tenant

2. **User** (Usuário)
   - Usuários do sistema (admin, funcionários)
   - Vinculado a um tenant

3. **Customer** (Cliente)
   - Clientes do despachante
   - Vinculado a um tenant

4. **Process** (Processo)
   - Processos/serviços
   - Vinculado a cliente e tenant

5. **Debit** (Débito)
   - Débitos financeiros
   - Vinculado a processo

6. **Document** (Documento)
   - Documentos anexados
   - Vinculado a processo

### 🗂️ Modelagem Lógica (Schema Prisma)

```prisma
// prisma/schema.prisma

model Tenant {
  id          String   @id @default(cuid())
  domain      String   @unique
  name        String
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users       User[]
  customers   Customer[]
  processes   Process[]

  @@map("tenants")
}

model User {
  id            String   @id @default(cuid())
  email         String
  name          String
  password      String
  role          Role     @default(USER)
  tenantId      String
  active        Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tenant        Tenant   @relation(fields: [tenantId], references: [id])
  
  @@unique([email, tenantId])
  @@map("users")
}

enum Role {
  ADMIN      // Dono do despachante
  USER       // Funcionário da equipe
}

model Customer {
  id          String   @id @default(cuid())
  name        String
  email       String?
  phone       String?
  cpf         String?
  cnpj        String?
  address     String?
  tenantId    String
  createdBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  processes   Process[]

  @@unique([cpf, tenantId])
  @@map("customers")
}

model Process {
  id           String        @id @default(cuid())
  numero       String        @unique
  tipo         ProcessType
  status       ProcessStatus @default(PENDING)
  priority     Priority      @default(MEDIUM)
  customerId   String
  tenantId     String
  description  String?
  vehiclePlate String?
  createdBy    String?
  updatedBy    String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  customer     Customer      @relation(fields: [customerId], references: [id])
  debits       Debit[]
  documents    Document[]

  @@map("processes")
}

enum ProcessType {
  LICENCIAMENTO
  TRANSFERENCIA
  EMPLACAMENTO
  RENOVACAO_CNH
  OUTROS
}

enum ProcessStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model Debit {
  id          String       @id @default(cuid())
  description String
  value       Decimal      @db.Decimal(10, 2)
  dueDate     DateTime?
  status      DebitStatus  @default(PENDING)
  processId   String
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  process     Process      @relation(fields: [processId], references: [id])

  @@map("debits")
}

enum DebitStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}

model Document {
  id          String   @id @default(cuid())
  name        String
  type        String
  url         String
  processId   String
  createdAt   DateTime @default(now())

  process     Process  @relation(fields: [processId], references: [id])

  @@map("documents")
}
```

### 🔗 Relacionamentos

```
Tenant (1) ──────< (N) User
Tenant (1) ──────< (N) Customer
Tenant (1) ──────< (N) Process

Customer (1) ────< (N) Process

Process (1) ─────< (N) Debit
Process (1) ─────< (N) Document
```

### 📈 Diagrama Entidade-Relacionamento (ER)

```
┌──────────────┐
│   TENANT     │
├──────────────┤
│ id (PK)      │
│ domain (UK)  │
│ name         │
│ active       │
└──────┬───────┘
       │
       │ 1:N
       │
       ├────────────────────┬────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    USER      │    │   CUSTOMER   │    │   PROCESS    │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ id (PK)      │    │ id (PK)      │    │ id (PK)      │
│ email        │    │ name         │    │ numero (UK)  │
│ name         │    │ email        │    │ tipo         │
│ password     │    │ phone        │    │ status       │
│ role         │    │ cpf (UK)     │    │ priority     │
│ tenantId(FK) │    │ tenantId(FK) │◄───│ customerId   │
└──────────────┘    └──────┬───────┘    │ tenantId(FK) │
                           │            └──────┬───────┘
                           │                   │
                           │ 1:N               │ 1:N
                           │                   │
                           └───────────────────┤
                                               │
                                ┌──────────────┴──────────────┐
                                │                             │
                                ▼                             ▼
                        ┌──────────────┐            ┌──────────────┐
                        │    DEBIT     │            │   DOCUMENT   │
                        ├──────────────┤            ├──────────────┤
                        │ id (PK)      │            │ id (PK)      │
                        │ description  │            │ name         │
                        │ value        │            │ type         │
                        │ dueDate      │            │ url          │
                        │ status       │            │ processId(FK)│
                        │ processId(FK)│            └──────────────┘
                        └──────────────┘
```

### 🔍 Índices e Otimizações

```prisma
// Índices para melhor performance

@@index([tenantId])              // Filtros por tenant
@@index([email, tenantId])       // Login
@@index([cpf, tenantId])         // Busca por CPF
@@index([status])                // Filtros por status
@@index([customerId])            // Processos por cliente
@@index([createdAt])             // Ordenação temporal
```

### 🔐 Regras de Negócio no Banco

1. **Multi-tenancy**: Todos os dados isolados por `tenantId`
2. **Unicidade**: Email único por tenant, CPF único por tenant
3. **Cascata**: Ao deletar cliente, manter processos (soft delete)
4. **Auditoria**: Campos `createdAt`, `updatedAt`, `createdBy`
5. **Status**: Controle de ciclo de vida (PENDING → IN_PROGRESS → COMPLETED)

---

## 7️⃣ Funcionalidades Implementadas

### ✅ Features Completas

#### Backend
- [x] Autenticação multi-tenant (NextAuth)
- [x] API Routes para mobile
- [x] Validação de token mobile
- [x] CRUD de clientes
- [x] CRUD de processos
- [x] CRUD de débitos
- [x] Firebase Admin SDK integration
- [x] Dual-write service (Neon + Firebase)
- [x] Sistema de notificações
- [x] Isolamento de dados por tenant

#### Frontend Web
- [x] Login responsivo
- [x] Dashboard com métricas
- [x] Listagem de processos
- [x] Listagem de clientes
- [x] Listagem de débitos
- [x] Formulário de cadastro
- [x] Página de teste de notificações
- [x] Sidebar navigation

#### Mobile
- [x] Login com tenant
- [x] Dashboard do cliente
- [x] Lista de processos
- [x] Lista de débitos
- [x] Sistema de notificações
- [x] Firebase Realtime Sync
- [x] Tabs navigation

#### Infraestrutura
- [x] PostgreSQL (Neon) configurado
- [x] Firebase Realtime Database
- [x] Prisma ORM
- [x] Deploy Vercel (web)
- [x] Expo configurado (mobile)
- [x] Variáveis de ambiente

### 🚧 Em Desenvolvimento

- [ ] Upload de documentos
- [ ] Relatórios e gráficos
- [ ] Recuperação de senha
- [ ] Push notifications (FCM)
- [ ] Modo offline (mobile)
- [ ] Testes automatizados
- [ ] CI/CD pipeline

---

## 8️⃣ Como Executar o Projeto

### Pré-requisitos

```bash
Node.js 18+
PostgreSQL (ou conta Neon)
Firebase Account
Git
```

### Instalação

#### 1. Clone o repositório
```bash
git clone https://github.com/VBaldochi/despasys.git
cd despasys
```

#### 2. Instale dependências (Web)
```bash
npm install
```

#### 3. Configure variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

#### 4. Configure o banco de dados
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

#### 5. Inicie o servidor
```bash
npm run dev
# Acesse: http://localhost:3001
```

#### 6. Configure o mobile
```bash
cd mobile
npm install
npx expo start
```

### Acesso de Teste

**Web**: http://localhost:3001/login
- Email: `admin@demo-despachante.com`
- Senha: (conforme seed)
- Tenant: `demo`

**Após login, acessar**:
- Dashboard: http://localhost:3001/dashboard
- Processos: http://localhost:3001/processos
- Clientes: http://localhost:3001/clientes
- Débitos: http://localhost:3001/debitos

**Mobile**: Expo Go App
- Mesmo usuário e senha do sistema web
- Funcionário acessa para consultas em campo

---

## 9️⃣ Documentação Técnica Adicional

### 📚 Documentos Disponíveis

- `docs/COMO-TESTAR-MENSAGERIA.md` - Guia de teste do sistema de mensageria
- `docs/FIREBASE-SETUP.md` - Configuração do Firebase
- `docs/mobile-api.md` - Documentação da API mobile
- `docs/MOBILE-AUTH-FIX.md` - Correções de autenticação mobile
- `docs/roadmap-tecnico.md` - Roadmap de desenvolvimento
- `README.md` - Documentação principal do projeto

### 🔗 Links Úteis

- **Repositório**: https://github.com/VBaldochi/despasys
- **Firebase Console**: https://console.firebase.google.com/project/despasys-production-80bf2
- **Neon Dashboard**: https://console.neon.tech
- **Deploy Vercel**: (URL de produção)

---

## 🎯 Conclusão

Este projeto implementa um sistema completo de gestão para despachantes com:

✅ **Sistema Web Completo** (Next.js 14) - Gestão total do despachante  
✅ **App Mobile para Campo** (React Native) - Consultas rápidas na rua  
✅ **Arquitetura moderna** (PostgreSQL, Firebase, TypeScript)  
✅ **Multi-tenancy** (isolamento total de dados por despachante)  
✅ **Sincronização em tempo real** (Firebase Realtime Database)  
✅ **API REST completa** (endpoints web e mobile)  
✅ **Autenticação robusta** (NextAuth + tokens mobile)  
✅ **Banco de dados modelado** (Prisma + PostgreSQL)  
✅ **Rotas padronizadas** (formato: /dashboard, /processos, /clientes)  

**Diferencial**: O sistema **não é um portal para clientes finais**, mas sim uma **ferramenta profissional para a equipe do despachante**, com app mobile para **agilizar o trabalho em campo** (órgãos públicos, visitas, atendimentos externos).

O sistema está preparado para crescer e incorporar novas funcionalidades conforme a evolução do projeto.

---

**Versão**: 1.0  
**Data**: Outubro 2025  
**Autor**: VBaldochi
