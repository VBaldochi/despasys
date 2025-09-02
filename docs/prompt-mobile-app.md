# 📱 PROMPT COMPLETO PARA CRIAÇÃO DO APP MOBILE LAZULI ERP

## 🎯 CONTEXTO DO PROJETO

Você é um desenvolvedor experiente em React Native e precisa criar um **app mobile** para o sistema **Lazuli ERP** - um sistema de gestão para despachantes. O app mobile deve consumir a API do sistema web existente.

## 🏗️ SISTEMA WEB EXISTENTE (Tecnologias)

- **Framework**: Next.js 15 com TypeScript
- **Banco**: PostgreSQL com neon
- **Autenticação**: NextAuth.js
- **Estilo**: TailwindCSS
- **Estado**: Zustand
- **Arquitetura**: Multi-tenant (SaaS)

## 📊 MODELO DE DADOS PRINCIPAL

```typescript
// Principais entidades do sistema

interface Tenant {
  id: string
  name: string
  domain: string
  plan: 'DESPACHANTE_SOLO' | 'PEQUENO' | 'GRANDE'
  status: 'TRIAL' | 'ACTIVE' | 'SUSPENDED'
  maxUsers: number
  maxCustomers: number
  maxProcesses: number
}

interface User {
  id: string
  tenantId: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  status: 'ATIVO' | 'INATIVO'
}

interface Customer {
  id: string
  tenantId: string
  name: string
  email?: string
  phone: string
  cpfCnpj: string
  tipoCliente: 'FISICO' | 'JURIDICO'
  endereco?: string
  cidade?: string
  estado?: string
  status: 'ATIVO' | 'INATIVO'
}

interface Process {
  id: string
  tenantId: string
  numero: string
  customerId: string
  tipoServico: 'LICENCIAMENTO' | 'TRANSFERENCIA' | 'PRIMEIRA_HABILITACAO' | 'RENOVACAO_CNH' | 'IPVA' | 'MULTA' | 'VISTORIA'
  titulo: string
  descricao?: string
  status: 'AGUARDANDO_DOCUMENTOS' | 'EM_ANDAMENTO' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDO' | 'CANCELADO'
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
  valorTotal: number
  valorTaxas: number
  valorServico: number
  statusPagamento: 'PENDENTE' | 'PAGO' | 'VENCIDO'
  dataInicio: Date
  prazoLegal?: Date
  dataFinalizacao?: Date
  customer: Customer
}

interface Transacao {
  id: string
  tenantId: string
  tipo: 'RECEITA' | 'DESPESA'
  categoria: string
  descricao: string
  valor: number
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO'
  dataVencimento: Date
  dataPagamento?: Date
  customerId?: string
  processoId?: string
}
```

## 🔌 API ENDPOINTS DISPONÍVEIS

```typescript
// Base URL: http://localhost:3001 (dev) / https://yourdomain.com (prod)

// AUTENTICAÇÃO
POST /api/mobile/auth
Headers: { "X-API-Key": "mobile-dev-key-123" }
Body: { email, password, tenantDomain }
Response: { user, token }

// PROCESSOS
GET /api/mobile/processes
Headers: { 
  "Authorization": "Bearer {token}",
  "X-API-Key": "mobile-dev-key-123",
  "X-Tenant-ID": "{tenantDomain}"
}
Response: { success: true, data: Process[] }

// CLIENTES (implementar)
GET /api/mobile/customers
POST /api/mobile/customers
PUT /api/mobile/customers/:id

// FINANCEIRO (implementar)  
GET /api/mobile/financeiro/dashboard
GET /api/mobile/financeiro/transacoes
POST /api/mobile/financeiro/transacoes

// DASHBOARD (implementar)
GET /api/mobile/dashboard
```

## 🎨 DESIGN SYSTEM E UX

### Cores Principais
```javascript
const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  success: '#10b981',
  warning: '#f59e0b', 
  error: '#ef4444',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    700: '#374151',
    900: '#111827'
  }
}
```

### Status Colors
```javascript
const statusColors = {
  // Status de Processo
  'AGUARDANDO_DOCUMENTOS': '#f59e0b', // warning
  'EM_ANDAMENTO': '#3b82f6',          // primary  
  'AGUARDANDO_PAGAMENTO': '#f97316',  // orange
  'CONCLUIDO': '#10b981',             // success
  'CANCELADO': '#ef4444',             // error
  
  // Prioridade
  'BAIXA': '#6b7280',    // gray
  'MEDIA': '#3b82f6',    // blue
  'ALTA': '#f59e0b',     // warning
  'URGENTE': '#ef4444'   // error
}
```

## 📱 FUNCIONALIDADES PRINCIPAIS

### 1. **Autenticação Multi-Tenant**
- Login com email/senha + tenant domain
- Armazenar token e dados do usuário no AsyncStorage
- Validação de sessão automática
- Logout com limpeza de dados

### 2. **Dashboard Principal**
```javascript
DashboardData {
  processos: {
    total: number
    pendentes: number
    emAndamento: number
    concluidos: number
    vencidos: number
  },
  financeiro: {
    receitasMes: number
    despesasMes: number
    saldoAtual: number
    contasPendentes: number
  },
  clientes: {
    total: number
    novosEsteMes: number
  },
  proximosVencimentos: Process[]
}
```

### 3. **Gestão de Processos**
- Lista com filtros (status, prioridade, cliente)
- Busca por número/cliente
- Visualização detalhada do processo
- Timeline de atualizações
- Upload de documentos (câmera/galeria)
- Atualização de status
- Notificações push para vencimentos

### 4. **Gestão de Clientes**
- Lista paginada com busca
- Visualização de perfil completo
- Histórico de processos do cliente
- Cadastro/edição de cliente
- Integração com agenda do telefone
- Consulta CPF/CNPJ via BrasilAPI

### 5. **Módulo Financeiro**
- Dashboard com gráficos
- Lista de transações (receitas/despesas)
- Cadastro rápido de transações
- Relatórios por período
- Alertas de vencimento
- Categorização automática

### 6. **Configurações**
- Perfil do usuário
- Configurações de notificação
- Dados da empresa/tenant
- Sincronização offline
- Logout

## 🏗️ ESTRUTURA DO PROJETO

```
/mobile-app
├── src/
│   ├── components/
│   │   ├── common/          # Componentes reutilizáveis
│   │   ├── forms/           # Formulários
│   │   ├── charts/          # Gráficos
│   │   └── modals/          # Modais
│   ├── screens/
│   │   ├── auth/            # Telas de autenticação
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── processes/       # Gestão de processos
│   │   ├── customers/       # Gestão de clientes
│   │   ├── financial/       # Módulo financeiro
│   │   └── settings/        # Configurações
│   ├── services/
│   │   ├── api.ts           # Cliente HTTP
│   │   ├── auth.ts          # Serviços de autenticação
│   │   ├── storage.ts       # AsyncStorage
│   │   └── notifications.ts # Push notifications
│   ├── store/
│   │   ├── auth.ts          # Estado de autenticação
│   │   ├── processes.ts     # Estado dos processos
│   │   ├── customers.ts     # Estado dos clientes
│   │   └── financial.ts     # Estado financeiro
│   ├── types/               # Tipos TypeScript
│   ├── utils/               # Utilitários
│   └── navigation/          # Configuração de navegação
├── assets/                  # Imagens, ícones, etc
└── package.json
```

## 📋 TELAS PRINCIPAIS

### 1. **Login Screen**
```javascript
// Campos: email, password, tenant domain
// Validação em tempo real
// Loading state
// Link para recuperar senha
```

### 2. **Dashboard Screen**
```javascript
// Cards com métricas principais
// Gráfico de processos por status
// Lista de processos próximos ao vencimento
// Botões de ação rápida
// Pull-to-refresh
```

### 3. **Process List Screen**
```javascript
// Header com busca e filtros
// Lista com swipe actions (editar, visualizar)
// FAB para novo processo
// Infinite scroll
// Status badges coloridos
```

### 4. **Process Detail Screen**
```javascript
// Informações completas do processo
// Timeline de eventos
// Lista de documentos
// Ações (atualizar status, adicionar nota)
// Share/export
```

### 5. **Customer List Screen**
```javascript
// Lista com foto/avatar
// Busca por nome/CPF
// Acesso rápido a contatos
// Indicadores visuais
```

### 6. **Financial Dashboard**
```javascript
// Cards de resumo financeiro
// Gráfico receitas vs despesas
// Lista de transações recentes
// Filtros por período
```

## 🛠️ TECNOLOGIAS RECOMENDADAS

### Core
- **React Native** (última versão)
- **TypeScript**
- **Expo** (managed workflow)

### Estado e Dados
- **Zustand** (consistente com o web)
- **React Query/TanStack Query** (cache e sync)
- **AsyncStorage** (persistência)

### UI/UX
- **React Native Elements** ou **NativeBase**
- **React Native Paper** (Material Design)
- **React Native Vector Icons**
- **React Native Chart Kit** (gráficos)

### Navegação
- **React Navigation v6**
- **Stack Navigator** + **Tab Navigator**

### Funcionalidades
- **Expo Camera** (upload de documentos)
- **Expo Notifications** (push notifications)
- **React Native Gesture Handler**
- **React Hook Form** (formulários)

## 🔒 AUTENTICAÇÃO E SEGURANÇA

```javascript
// Configuração da API
const API_CONFIG = {
  baseURL: __DEV__ ? 'http://localhost:3001' : 'https://api.lazuli.com.br',
  apiKey: 'mobile-dev-key-123', // Usar variável de ambiente
  timeout: 10000
}

// Headers padrão
const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-API-Key': API_CONFIG.apiKey
}

// Headers autenticados
const authenticatedHeaders = (token: string, tenantId: string) => ({
  ...defaultHeaders,
  'Authorization': `Bearer ${token}`,
  'X-Tenant-ID': tenantId
})
```

## 📊 ESTADO GLOBAL EXAMPLE

```javascript
// store/auth.ts
interface AuthState {
  user: User | null
  tenant: Tenant | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

// store/processes.ts
interface ProcessState {
  processes: Process[]
  loading: boolean
  filters: {
    status: string[]
    priority: string[]
    search: string
  }
  fetchProcesses: () => Promise<void>
  updateProcess: (id: string, data: Partial<Process>) => Promise<void>
  createProcess: (data: CreateProcessData) => Promise<void>
}
```

## 🎯 FEATURES ESPECÍFICAS DO NEGÓCIO

### Tipos de Processo Despachante
```javascript
const TIPOS_SERVICO = [
  { 
    id: 'LICENCIAMENTO', 
    label: 'Licenciamento Anual',
    icon: 'file-document',
    color: '#3b82f6',
    prazoMedio: 5 // dias
  },
  { 
    id: 'TRANSFERENCIA', 
    label: 'Transferência',
    icon: 'car-arrow-right',
    color: '#f59e0b',
    prazoMedio: 15
  },
  { 
    id: 'PRIMEIRA_HABILITACAO', 
    label: 'Primeira Habilitação',
    icon: 'card-account-details',
    color: '#10b981',
    prazoMedio: 30
  },
  { 
    id: 'RENOVACAO_CNH', 
    label: 'Renovação CNH',
    icon: 'card-refresh',
    color: '#8b5cf6',
    prazoMedio: 10
  }
]
```

### Categorias Financeiras
```javascript
const CATEGORIAS_RECEITA = [
  'Serviços Prestados',
  'Emolumentos', 
  'Taxas Administrativas',
  'Consultoria'
]

const CATEGORIAS_DESPESA = [
  'Emolumentos Cartório',
  'Taxas DETRAN',
  'Despesas Operacionais',
  'Material de Escritório'
]
```

## 📝 TAREFAS PRIORITÁRIAS

### Sprint 1 - Setup e Autenticação (Semana 1)
1. ✅ Setup do projeto React Native + Expo
2. ✅ Configuração do TypeScript
3. ✅ Setup do Zustand para estado global
4. ✅ Implementar tela de login
5. ✅ Implementar autenticação com API
6. ✅ Setup da navegação básica
7. ✅ Configurar AsyncStorage

### Sprint 2 - Dashboard e Processos (Semana 2)
1. ✅ Implementar dashboard principal
2. ✅ Tela de lista de processos
3. ✅ Tela de detalhes do processo
4. ✅ Implementar filtros e busca
5. ✅ Sistema de notificações básico

### Sprint 3 - Clientes e Financeiro (Semana 3)
1. ✅ Tela de lista de clientes
2. ✅ Formulário de cliente
3. ✅ Dashboard financeiro
4. ✅ Lista de transações
5. ✅ Implementar gráficos básicos

### Sprint 4 - Polish e Deploy (Semana 4)
1. ✅ Upload de documentos
2. ✅ Push notifications
3. ✅ Offline support básico
4. ✅ Testes e correções
5. ✅ Build e deploy

## 🚀 COMANDOS DE INÍCIO

```bash
# Criar projeto
npx create-expo-app LazuliMobile --template typescript

# Instalar dependências principais
npm install @reduxjs/toolkit react-redux zustand
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-elements react-native-vector-icons
npm install @tanstack/react-query axios
npm install react-hook-form @hookform/resolvers zod
npm install date-fns

# Dependências Expo
npx expo install expo-camera expo-notifications expo-secure-store
```

## 🎯 OBJETIVO FINAL

Criar um **app mobile profissional** que permita aos despachantes:
- Gerenciar processos em movimento
- Acompanhar situação financeira
- Atender clientes remotamente  
- Receber notificações importantes
- Trabalhar offline quando necessário

O app deve ser **intuitivo**, **rápido** e **confiável**, mantendo a **consistência visual** com o sistema web e oferecendo uma **experiência mobile otimizada**.

---

## 📞 INSTRUÇÕES FINAIS

1. **Priorize a UX mobile** - gestos, navegação intuitiva
2. **Implemente offline-first** - sincronização quando online
3. **Use componentes nativos** - performance e feeling nativo
4. **Teste em dispositivos reais** - iOS e Android
5. **Documente as APIs** - para futuras integrações

**IMPORTANTE**: Este é um sistema **real de gestão empresarial**. Foque na **usabilidade**, **performance** e **confiabilidade**. O app será usado diariamente por profissionais despachantes.

**#github-pull-request_copilot-coding-agent**
