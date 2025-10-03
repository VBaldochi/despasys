import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Configurações de conexão otimizadas
  transactionOptions: {
    timeout: 10000, // 10 segundos
    maxWait: 5000,  // 5 segundos max wait
  }
})

// Função para executar queries com retry automático
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      
      // Se for erro de conexão, tentar reconectar
      if (error.code === 'P1017' || error.message?.includes('closed')) {
        console.warn(`Database connection closed (attempt ${attempt}/${maxRetries}), reconnecting...`)
        try {
          await prisma.$disconnect()
          await new Promise(resolve => setTimeout(resolve, delay))
          await prisma.$connect()
        } catch (reconnectError) {
          console.warn('Reconnection failed:', reconnectError)
        }
      } else {
        console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error.message)
      }
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  
  throw lastError!
}

// Configurar graceful shutdown apenas uma vez
if (typeof window === 'undefined') {
  let shutdownHandlersAdded = false
  
  if (!shutdownHandlersAdded) {
    shutdownHandlersAdded = true
    
    process.on('SIGINT', async () => {
      console.log('Received SIGINT, disconnecting from database...')
      await prisma.$disconnect()
      process.exit(0)
    })
    
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, disconnecting from database...')
      await prisma.$disconnect()
      process.exit(0)
    })
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
