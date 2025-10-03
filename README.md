# 🏢 Lazuli ERP - Sistema de Gestão para Despachantes

**Sistema ERP SaaS completo e multi-tenant para despachantes brasileiros**

> Última atualização: 4 de setembro de 2025 - Deploy estável

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-green)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Neon](https://img.shields.io/badge/Neon-Database-00E699)](https://neon.tech/)

## 🚀 Quick Start (MacOS)

### 📋 Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Acesso ao banco Neon configurado

### ⚡ Instalação Rápida

```bash
# 1. Clone o repositório (se ainda não tiver)
git clone [url-do-repo]
cd despasys

# 2. Instale as dependências
npm install

# 3. Configure o banco (já está configurado para Neon)
npx prisma generate

# 4. Execute o projeto
npm run dev
```

🌐 **Acesse:** http://localhost:3001

### 🔧 Configuração do Ambiente

O projeto já está configurado com:
- ✅ **Banco Neon** - PostgreSQL em nuvem
- ✅ **Variáveis de ambiente** - `.env` e `.env.local` configurados
- ✅ **Prisma Client** - Gerado e sincronizado
- ✅ **Next.js 15** - Com Turbopack para desenvolvimento rápido

## 🎯 Visão Geral

O Lazuli ERP é uma solução completa de gestão desenvolvida especificamente para despachantes e escritórios de despachantes no Brasil. O sistema oferece gestão multi-tenant, integração com órgãos governamentais e ferramentas especializadas para o dia a dia dos profissionais do setor.

### 🏆 Principais Benefícios

- **💰 Redução de 60% no tempo de processamento** de documentos
- **🔄 Automação completa** de consultas ao DETRAN e Receita Federal
- **📊 Controle financeiro integrado** com gestão de recebimentos
- **👥 Multi-tenant** - cada despachante tem seu ambiente isolado
- **📱 Interface moderna e responsiva** para desktop e mobile

## 🚀 Funcionalidades

### 📋 Gestão de Clientes
- Cadastro completo de pessoas físicas e jurídicas
- Histórico de serviços realizados
- Sistema de comunicação integrado
- Documentos digitalizados organizados

### 🚗 Gestão de Veículos
- Cadastro detalhado de veículos
- Histórico de licenciamentos e transferências
- Consultas automáticas ao DETRAN
- Alertas de vencimento

### 📄 Gestão de Processos
- Workflow completo de processos
- Status em tempo real
- Notificações automáticas
- Integração com sistemas governamentais

### 💰 Gestão Financeira
- Controle de recebimentos e pagamentos
- Relatórios financeiros detalhados
- Integração com métodos de pagamento
- Comissões e repasses automáticos

### 🔍 Consultas Especializadas
- **DETRAN**: Veículos, multas, licenciamentos
- **Receita Federal**: CNPJ, CPF, situação cadastral
- **RENAVAM**: Histórico completo do veículo
- **FIPE**: Valores atualizados de mercado

## 🏗️ Arquitetura

### Stack Tecnológica
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: Next.js API Routes + Server Components
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **Pagamentos**: Stripe
- **Analytics**: PostHog
- **Email**: Resend

### Multi-Tenancy
- **Isolamento por Schema**: Cada tenant tem isolamento completo
- **Resolução Automática**: Baseada em subdomínio ou parâmetro
- **Escalabilidade**: Suporta milhares de tenants
- **Segurança**: Isolamento total entre dados

## 📦 Instalação Rápida

### Pré-requisitos
- Node.js 18+
- PostgreSQL (recomendado: Neon)
- Git

### Setup Automático
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/lazuli-erp.git
cd lazuli-erp

# Execute o setup completo
./setup-complete.sh
```

### Setup Manual
```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 3. Configurar banco
npx prisma db push --force-reset
npx prisma generate

# 4. Criar tenant de desenvolvimento
node scripts/create-tenant.js

# 5. Iniciar servidor
npm run dev
```

## 🌐 Configuração de Produção

### Variáveis de Ambiente Obrigatórias
```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@host:5432/database"

# Autenticação
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://yourdomain.com"

# Pagamentos
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# APIs Governamentais
DETRAN_API_KEY="your-detran-key"
RECEITA_API_KEY="your-receita-key"

# Email
RESEND_API_KEY="re_..."

# Analytics
POSTHOG_API_KEY="phc_..."
POSTHOG_HOST="https://app.posthog.com"
```

### Deploy
```bash
# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 💼 Modelos de Negócio

### Planos Disponíveis

| Plano | Preço | Usuários | Clientes | Processos/mês |
|-------|-------|----------|----------|---------------|
| **Solo** | R$ 99/mês | 1 | 100 | 300 |
| **Pequeno** | R$ 199/mês | 3 | 500 | 1.000 |
| **Grande** | R$ 399/mês | 10 | 2.000 | 5.000 |

### ROI Esperado
- **Despachante Solo**: Economia de R$ 800/mês em tempo
- **Escritório Pequeno**: Aumento de 40% na produtividade
- **Escritório Grande**: Redução de 50% em erros processuais

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # Painel administrativo
│   └── dashboard/         # Dashboard principal
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
├── contexts/              # Contextos React
├── store/                 # Gerenciamento de estado
└── types/                 # Tipos TypeScript

prisma/
├── schema.prisma          # Schema do banco
└── migrations/            # Migrações

docs/
├── erp-saas-transformation.md
├── business-plan.md
└── market-analysis-despachantes.md
```

### Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção

# Banco de Dados
npm run db:push      # Aplicar schema
npm run db:reset     # Reset completo
npm run db:seed      # Popular com dados

# Tenants
npm run tenant:create    # Criar novo tenant
npm run tenant:list      # Listar tenants
npm run tenant:delete    # Remover tenant

# Utilitários
npm run lint         # Lint do código
npm run type-check   # Verificar tipos
```

## 🧪 Testando o Sistema

### Tenant de Desenvolvimento
Após o setup, você pode testar com:
- **URL**: http://localhost:3001?tenant=demo
- **Email**: admin@demo-despachante.com
- **Senha**: admin123

### Funcionalidades para Testar
1. **Dashboard**: Visão geral do sistema
2. **Clientes**: Cadastro e gestão
3. **Processos**: Workflow completo
4. **Consultas**: APIs do DETRAN e Receita
5. **Financeiro**: Controle de recebimentos

## 📊 APIs e Integrações

### APIs Governamentais Suportadas
- **DETRAN-SP**: Consultas de veículos e multas
- **Receita Federal**: Validação de CPF/CNPJ
- **RENAVAM**: Histórico completo
- **SERPRO**: Serviços diversos

### Webhooks
- Notificações de pagamento (Stripe)
- Updates de processos
- Alertas de vencimento

## 🔒 Segurança

### Medidas Implementadas
- **Autenticação JWT** com NextAuth.js
- **Isolamento de dados** por tenant
- **Validação de entrada** em todas as APIs
- **Logs de auditoria** para ações críticas
- **Rate limiting** para APIs

### Compliance
- **LGPD**: Gestão de dados pessoais
- **PCI DSS**: Segurança em pagamentos
- **SOC 2**: Controles de segurança

## 📈 Roadmap

### Q1 2025
- [ ] App mobile (React Native)
- [ ] API pública para integrações
- [ ] Relatórios avançados com BI

### Q2 2025
- [ ] Integração com contabilidade
- [ ] Sistema de CRM avançado
- [ ] Marketplace de serviços

### Q3 2025
- [ ] IA para previsão de demanda
- [ ] Automação completa de processos
- [ ] Expansão para outros estados

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: suporte@lazuli-erp.com.br
- **WhatsApp**: (16) 99999-9999
- **Documentação**: https://docs.lazuli-erp.com.br

---

<div align="center">

**🚀 Transforme seu escritório de despachante com tecnologia de ponta! 🚀**

[Website](https://lazuli-erp.com.br) • [Demo](https://demo.lazuli-erp.com.br) • [Documentação](https://docs.lazuli-erp.com.br)

</div>
