#!/usr/bin/env node

// Script para verificar permissões do service account
require('dotenv').config()
const fs = require('fs')

function checkServiceAccountPermissions() {
  console.log('🔍 Verificando permissões do Service Account...\n')
  
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  
  if (!credentialsPath || !fs.existsSync(credentialsPath)) {
    console.log('❌ Arquivo de credenciais não encontrado')
    return
  }
  
  try {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
    
    console.log('📋 Informações do Service Account:')
    console.log(`  Email: ${credentials.client_email}`)
    console.log(`  Project ID: ${credentials.project_id}`)
    console.log(`  Private Key ID: ${credentials.private_key_id}`)
    console.log('')
    
    console.log('🛠️ Para resolver o erro PERMISSION_DENIED:')
    console.log('')
    console.log('1. Acesse: https://console.cloud.google.com/iam-admin/iam')
    console.log(`2. Selecione projeto: ${credentials.project_id}`)
    console.log(`3. Encontre: ${credentials.client_email}`)
    console.log('4. Clique no lápis (editar) ao lado do email')
    console.log('5. Adicione estas roles:')
    console.log('   ✅ Pub/Sub Editor')
    console.log('   ✅ Pub/Sub Admin (opcional, mais permissões)')
    console.log('')
    console.log('6. Clique "SAVE"')
    console.log('')
    console.log('🧪 Após adicionar as permissões, teste novamente:')
    console.log('   curl http://localhost:3001/api/test/connectivity')
    
  } catch (error) {
    console.log('❌ Erro ao ler credenciais:', error.message)
  }
}

checkServiceAccountPermissions()
