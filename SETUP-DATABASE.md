# 🗄️ Configuração do Banco de Dados

## 🏆 Opção Recomendada: Neon PostgreSQL

### 1. Criar conta no Neon
1. Acesse: https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto "Lazuli SaaS"

### 2. Obter string de conexão
1. No dashboard do Neon, vá em "Connection Details"
2. Copie a "Connection String"
3. Ela será algo como: `postgresql://username:password@host/database?sslmode=require`

### 3. Configurar projeto
```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar .env.local e adicionar sua DATABASE_URL
# DATABASE_URL="postgresql://seu-usuario:sua-senha@seu-host/sua-database?sslmode=require"
```

### 4. Executar migrações
```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema ao banco
npm run db:push

# Criar usuário admin inicial
npm run create-admin
```

## 🥈 Alternativas

### Supabase (PostgreSQL + recursos extras)
1. Acesse: https://supabase.com
2. Crie novo projeto
3. Vá em Settings > Database
4. Copie a "Connection String"

### Railway (Deploy + DB)
1. Acesse: https://railway.app
2. Crie novo projeto
3. Adicione PostgreSQL
4. Copie a DATABASE_URL das variáveis

### Vercel Postgres (integração perfeita)
1. No seu projeto Vercel
2. Vá em Storage > Create Database
3. Escolha Postgres
4. A DATABASE_URL será automaticamente adicionada

## 🔧 Scripts Úteis

```bash
# Ver status do banco
npm run db:studio

# Reset completo do banco
npm run db:reset

# Fazer backup
pg_dump $DATABASE_URL > backup.sql

# Restaurar backup
psql $DATABASE_URL < backup.sql
```

## 🚀 Para Produção

### Configurações importantes:
- Connection pooling (automático no Neon/Supabase)
- SSL habilitado (automático)
- Backups automáticos (configurar)
- Monitoramento (DataDog, New Relic)

### Variáveis de ambiente:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="chave-super-secreta-em-producao"
NEXTAUTH_URL="https://app.lazuli.com.br"
```
