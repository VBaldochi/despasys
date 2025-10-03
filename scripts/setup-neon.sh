#!/bin/bash

# 🚀 Script de Setup Rápido - Neon PostgreSQL

echo "🗄️ Configurando Lazuli SaaS com Neon PostgreSQL..."

# Verificar se existe .env.local
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cp .env.example .env.local
    echo "⚠️  IMPORTANTE: Edite o arquivo .env.local e adicione sua DATABASE_URL do Neon!"
    echo "   1. Acesse: https://neon.tech"
    echo "   2. Crie uma conta e projeto"
    echo "   3. Copie a Connection String"
    echo "   4. Cole no arquivo .env.local"
    echo ""
    read -p "Pressione ENTER após configurar a DATABASE_URL..."
fi

# Gerar cliente Prisma
echo "�� Gerando cliente Prisma..."
npm run db:generate

# Aplicar schema
echo "📊 Aplicando schema ao banco..."
npm run db:push

# Criar usuário admin
echo "👤 Criando usuário administrador..."
npm run create-admin

echo "✅ Configuração concluída!"
echo ""
echo "🚀 Para executar o projeto:"
echo "   npm run dev"
echo ""
echo "🔑 Login padrão:"
echo "   Email: admin@lazuli.com"
echo "   Senha: admin123"
