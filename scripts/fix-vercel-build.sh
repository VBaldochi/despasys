#!/bin/bash

# Script para resolver problemas de TypeScript no Vercel

echo "🔧 Limpando cache e dependências..."

# Remover node_modules e package-lock.json
rm -rf node_modules
rm -f package-lock.json

echo "📦 Reinstalando dependências..."

# Reinstalar tudo do zero
npm install

# Verificar se as dependências TypeScript estão corretas
echo "🔍 Verificando dependências TypeScript..."
npm list @types/node typescript

# Gerar cliente Prisma
echo "🗄️ Gerando cliente Prisma..."
npx prisma generate

# Testar build
echo "🏗️ Testando build..."
npm run build

echo "✅ Configuração completa! Pronto para deploy no Vercel."
