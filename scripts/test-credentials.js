#!/usr/bin/env node

// Script simples para testar se as credenciais estão funcionando
require('dotenv').config()

async function testCredentials() {
  console.log('🔐 Testando credenciais...\n')
  
  // Verificar variáveis de ambiente
  console.log('📋 Variáveis de ambiente:')
  console.log(`  GOOGLE_CLOUD_PROJECT_ID: ${process.env.GOOGLE_CLOUD_PROJECT_ID || '❌ Não definido'}`)
  console.log(`  GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS || '❌ Não definido'}`)
  console.log(`  FIREBASE_PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Não definido'}`)
  console.log(`  FIREBASE_API_KEY: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Definido' : '❌ Não definido'}`)
  console.log('')
  
  // Verificar se arquivo de credenciais existe
  const fs = require('fs')
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  
  if (credentialsPath && fs.existsSync(credentialsPath)) {
    console.log('📄 Arquivo de credenciais: ✅ Encontrado')
    
    try {
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
      console.log(`  Project ID: ${credentials.project_id}`)
      console.log(`  Client Email: ${credentials.client_email}`)
    } catch (error) {
      console.log('  ❌ Erro ao ler arquivo JSON')
    }
  } else {
    console.log('📄 Arquivo de credenciais: ❌ Não encontrado')
  }
  
  console.log('')
  console.log('🚀 Próximos passos:')
  console.log('  1. Configure o Firebase Console (veja docs/FIREBASE-SETUP.md)')
  console.log('  2. Atualize as variáveis NEXT_PUBLIC_FIREBASE_* no .env')
  console.log('  3. Execute: npm run dev')
  console.log('  4. Teste: curl http://localhost:3000/api/test/connectivity')
}

testCredentials()
