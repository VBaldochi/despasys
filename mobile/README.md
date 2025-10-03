# 📱 Lazuli ERP Mobile

Um aplicativo mobile React Native para o sistema de gestão de despachantes **Lazuli ERP**.

## 🎯 Sobre o Projeto

O Lazuli ERP Mobile é um aplicativo profissional que permite aos despachantes gerenciar processos, clientes e financeiro de forma móvel, consumindo a API do sistema web existente.

## 🏗️ Tecnologias Utilizadas

### Core
- **React Native** com **Expo**
- **TypeScript**
- **Expo Router** (navegação baseada em arquivos)

### Estado e Dados
- **Zustand** (gerenciamento de estado global)
- **React Query/TanStack Query** (cache e sincronização de dados)
- **AsyncStorage** (persistência local)

### UI/UX
- **React Native Paper** (Material Design)
- **React Native Vector Icons**
- **MaterialIcons** do Expo

### Formulários e Validação
- **React Hook Form**
- **Zod** (validação de esquemas)

### Utilitários
- **date-fns** (manipulação de datas)
- **axios** (cliente HTTP)

## 📊 Funcionalidades Implementadas

### ✅ Sprint 1 - Setup e Autenticação (Concluída)
- [x] Setup do projeto React Native + Expo + TypeScript
- [x] Configuração do Zustand para estado global
- [x] Implementação da tela de login multi-tenant
- [x] Sistema de autenticação com API
- [x] Setup da navegação com Expo Router
- [x] Configuração do AsyncStorage

### ✅ Sprint 2 - Dashboard e Processos (Concluída)
- [x] Dashboard principal com métricas e resumos
- [x] Tela de lista de processos com filtros e busca
- [x] Cards informativos com status coloridos
- [x] Pull-to-refresh em todas as telas
- [x] Estados de loading e erro

### ✅ Sprint 3 - Clientes e Financeiro (Concluída)
- [x] Tela de lista de clientes com busca
- [x] Integração com telefone e email
- [x] Dashboard financeiro completo
- [x] Lista de transações com categorização
- [x] Resumo financeiro com gráficos visuais

### ✅ Sprint 4 - Configurações e Polish (Concluída)
- [x] Tela de configurações completa
- [x] Perfil do usuário
- [x] Configurações do app (notificações, tema)
- [x] Sistema de logout seguro
- [x] Tratamento de erros consistente
- [x] Design system implementado

## 🎨 Design System

### Cores Principais
```javascript
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
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
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    900: '#111827'
  }
}
```

### Status Colors
- **Processos**: Cada status tem sua cor específica (aguardando, em andamento, concluído, etc.)
- **Prioridades**: Baixa (cinza), Média (azul), Alta (amarelo), Urgente (vermelho)
- **Financeiro**: Verde para receitas, vermelho para despesas, amarelo para pendente

## 📱 Estrutura de Telas

### 🔐 Autenticação
- **Login**: Multi-tenant com validação em tempo real

### 📊 Dashboard
- **Métricas**: Processos, receitas, clientes
- **Status**: Visualização dos processos por status
- **Vencimentos**: Próximos prazos importantes
- **Financeiro**: Resumo do saldo e contas

### 📋 Processos
- **Lista**: Filtros por status, prioridade e busca
- **Cards**: Informações completas com ações rápidas
- **Status**: Badges coloridos por categoria
- **Clientes**: Informações do cliente integradas

### 👥 Clientes
- **Lista**: Busca por nome, CPF/CNPJ, email ou telefone
- **Perfil**: Avatar com iniciais, informações completas
- **Contato**: Integração direta com telefone e email
- **Status**: Indicação visual ativo/inativo

### 💰 Financeiro
- **Dashboard**: Receitas, despesas, saldo e pendências
- **Resultado**: Cálculo automático do resultado líquido
- **Transações**: Lista completa com categorização
- **Status**: Pago, pendente, vencido com cores específicas

### ⚙️ Configurações
- **Perfil**: Informações do usuário logado
- **App**: Notificações, tema escuro, sincronização
- **Conta**: Edição de perfil, alteração de senha
- **Suporte**: Central de ajuda, privacidade, sobre

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI
- Expo Go (no dispositivo móvel) ou emulador

### Instalação
```bash
cd LazuliMobile
npm install
```

### Execução
```bash
npm start
# ou
npx expo start
```

### Opções de Visualização
- **Expo Go**: Escaneie o QR code com o app Expo Go
- **Web**: Pressione 'w' para abrir no navegador
- **Android**: Pressione 'a' (necessário emulador/dispositivo)
- **iOS**: Pressione 'i' (necessário macOS)

## 🔌 Integração com API

### Configuração
```javascript
const API_CONFIG = {
  baseURL: __DEV__ ? 'http://localhost:3001' : 'https://api.lazuli.com.br',
  apiKey: 'mobile-dev-key-123',
  timeout: 10000
}
```

### Headers
- `X-API-Key`: Chave de autenticação da API
- `Authorization`: Bearer token do usuário
- `X-Tenant-ID`: Identificação do tenant

### Endpoints Implementados
- `POST /api/mobile/auth` - Autenticação
- `GET /api/mobile/dashboard` - Dashboard geral
- `GET /api/mobile/processes` - Lista de processos
- `GET /api/mobile/customers` - Lista de clientes
- `GET /api/mobile/financeiro/dashboard` - Dashboard financeiro
- `GET /api/mobile/financeiro/transacoes` - Transações

## 📂 Estrutura do Projeto

```
LazuliMobile/
├── app/                    # Expo Router (navegação)
│   ├── (tabs)/            # Navegação em tabs
│   │   ├── index.tsx      # Dashboard
│   │   ├── processes.tsx  # Processos
│   │   ├── customers.tsx  # Clientes
│   │   ├── financial.tsx  # Financeiro
│   │   └── settings.tsx   # Configurações
│   ├── login.tsx          # Tela de login
│   └── _layout.tsx        # Layout principal
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   └── common/        # Componentes comuns
│   ├── services/          # Serviços (API, auth, storage)
│   ├── store/             # Zustand stores
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilitários e constantes
└── assets/                # Imagens, ícones, fontes
```

## 🎯 Características Técnicas

### Estado Global (Zustand)
- **Auth Store**: Gerenciamento de autenticação
- **Process Store**: Processos com filtros
- **Customer Store**: Clientes com busca
- **Financial Store**: Dados financeiros
- **Dashboard Store**: Métricas gerais

### Componentes Reutilizáveis
- **Loading**: Estados de carregamento
- **ErrorMessage**: Tratamento de erros
- **EmptyState**: Listas vazias

### Utilitários
- **Formatters**: CPF, CNPJ, telefone, moeda, data
- **Validators**: Validação de documentos
- **Constants**: Cores, tipos de serviço, categorias

## 🔒 Segurança e Boas Práticas

### Autenticação
- Token JWT armazenado de forma segura
- Logout automático em caso de token expirado
- Validação de sessão na inicialização

### Dados
- Armazenamento local criptografado (AsyncStorage)
- Cache inteligente com React Query
- Sincronização automática com pull-to-refresh

### UI/UX
- Design responsivo para diferentes tamanhos de tela
- Estados de loading, erro e vazio consistentes
- Feedback visual para todas as ações
- Navegação intuitiva com gestos nativos

## 🚧 Próximas Funcionalidades

### Em Desenvolvimento
- [ ] Upload de documentos com câmera
- [ ] Push notifications
- [ ] Modo offline
- [ ] Formulários de criação/edição
- [ ] Relatórios em PDF
- [ ] Gráficos avançados
- [ ] Integração com agenda do dispositivo
- [ ] Consulta de CPF/CNPJ via BrasilAPI

### Futuras Melhorias
- [ ] Tema escuro completo
- [ ] Biometria para login
- [ ] Widget do iOS
- [ ] Apple Watch / Wear OS
- [ ] Backup na nuvem
- [ ] Sincronização em tempo real

## 📱 Compatibilidade

- **iOS**: 13.0+
- **Android**: API 21+ (Android 5.0)
- **Web**: Navegadores modernos
- **Expo SDK**: 53.0.0

## 🤝 Contribuição

Este é um projeto profissional em desenvolvimento. Para contribuições ou sugestões, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

© 2025 Lazuli ERP. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para modernizar a gestão de despachantes**