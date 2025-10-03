#!/usr/bin/env node

const crypto = require('crypto');

function generateApiKey(prefix = 'mobile') {
  const randomBytes = crypto.randomBytes(32);
  const timestamp = Date.now().toString(36);
  const random = randomBytes.toString('hex').substring(0, 16);
  
  return `${prefix}-${timestamp}-${random}`;
}

function generateMultipleKeys(count = 5, prefix = 'mobile') {
  console.log(`Gerando ${count} API Keys:\n`);
  
  for (let i = 0; i < count; i++) {
    const key = generateApiKey(prefix);
    console.log(`${i + 1}. ${key}`);
  }
  
  console.log(`\nAdicione essas chaves à variável MOBILE_API_KEYS no seu .env:`);
  console.log(`MOBILE_API_KEYS=${Array.from({length: count}, () => generateApiKey(prefix)).join(',')}`);
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);
const count = parseInt(args[0]) || 5;
const prefix = args[1] || 'mobile';

generateMultipleKeys(count, prefix);
