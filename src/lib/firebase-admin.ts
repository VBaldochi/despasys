// Firebase Admin SDK Configuration (Server-Side)
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { getStorage } from 'firebase-admin/storage' // <-- NOVO: Importa o Storage SDK
import * as fs from 'fs'
import * as path from 'path'

// Inicializar Firebase Admin apenas uma vez
if (!getApps().length) {
  try {
    console.log('🔥 Inicializando Firebase Admin SDK...')

    // OBTÉM O URL DO BUCKET DO .ENV
    const storageBucketUrl = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!storageBucketUrl) {
         // Recomendado: criar esta variável no .env, conforme discutido
         console.warn("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET não encontrado. O Storage pode falhar.");
    }
    
    // Opção 1: Usar arquivo de credenciais
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    
    if (credentialsPath && fs.existsSync(credentialsPath)) {
      console.log('📄 Usando credenciais do arquivo:', credentialsPath)
      const serviceAccountJson = fs.readFileSync(credentialsPath, 'utf8')
      const serviceAccount = JSON.parse(serviceAccountJson)
      
      initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        storageBucket: storageBucketUrl // <-- NOVO: Adiciona o bucket
      })
    } else {
      // Opção 2: Usar variáveis de ambiente direto
      console.log('🔑 Usando credenciais das variáveis de ambiente')
      
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'despasys-production-80bf2'
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      
      if (!clientEmail || !privateKey) {
        throw new Error('FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY são obrigatórios!')
      }
      
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        storageBucket: storageBucketUrl // <-- NOVO: Adiciona o bucket
      })
    }
    
    console.log('✅ Firebase Admin inicializado com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error)
    throw error
  }
}

// Exportar database Admin
export const adminDatabase = getDatabase()

// NOVO: Exportar Storage Admin
export const adminStorage = getStorage().bucket() // <-- A referência ao bucket!

console.log('📡 Firebase Admin Database e Storage disponíveis')