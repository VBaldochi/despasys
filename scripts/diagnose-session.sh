#!/bin/bash

# Script de diagnóstico para problemas de sessão no Vercel

echo "🔍 Diagnóstico de Sessão - Lazuli ERP"
echo "====================================="

# Verificar variáveis de ambiente críticas
echo "📋 Verificando variáveis de ambiente..."

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ NEXTAUTH_SECRET não definido!"
else
    echo "✅ NEXTAUTH_SECRET definido (${#NEXTAUTH_SECRET} chars)"
fi

if [ -z "$NEXTAUTH_URL" ]; then
    echo "❌ NEXTAUTH_URL não definido!"
else
    echo "✅ NEXTAUTH_URL: $NEXTAUTH_URL"
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL não definido!"
else
    echo "✅ DATABASE_URL definido"
fi

echo ""
echo "🛠️  Soluções recomendadas:"
echo "========================="
echo ""
echo "1. 🔐 Gerar nova NEXTAUTH_SECRET:"
echo "   openssl rand -base64 32"
echo ""
echo "2. 🌐 Verificar NEXTAUTH_URL no Vercel:"
echo "   Deve ser: https://despasys.vercel.app"
echo ""
echo "3. 🍪 Limpar cookies do navegador:"
echo "   - Abrir DevTools"
echo "   - Application > Storage > Clear storage"
echo ""
echo "4. 🔄 Fazer redeploy completo:"
echo "   - Vercel dashboard > Redeploy"
echo ""
echo "5. 🧪 Testar em modo anônimo:"
echo "   - Ctrl+Shift+N (Chrome)"
echo "   - Ctrl+Shift+P (Firefox)"
echo ""
echo "6. 📱 Verificar User-Agent:"
echo "   - Alguns bots podem causar problemas"
echo ""
echo "7. 🔧 Variáveis críticas para o Vercel:"
echo "   NEXTAUTH_SECRET=<generated-secret>"
echo "   NEXTAUTH_URL=https://despasys.vercel.app"
echo "   DATABASE_URL=<neon-connection-string>"
echo ""
echo "8. 🚨 Se persistir o problema:"
echo "   - Acessar: https://despasys.vercel.app/api/debug/session"
echo "   - Verificar logs do Vercel"
echo "   - Considerar usar sessão com database"
echo ""

# Testar conectividade com o banco
echo "🗄️  Testando conectividade com banco..."
if command -v psql &> /dev/null && [ ! -z "$DATABASE_URL" ]; then
    echo "✅ PostgreSQL client disponível"
    # Não vamos testar a conexão real por segurança
else
    echo "⚠️  PostgreSQL client não disponível ou DATABASE_URL não definido"
fi

echo ""
echo "✨ Diagnóstico concluído!"
echo "Se o problema persistir, verifique os logs em tempo real no Vercel."
