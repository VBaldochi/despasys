// Middleware de autenticação para API mobile
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

export async function authenticateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key')
  
  if (!apiKey) {
    return { error: 'API Key requerida', status: 401 }
  }

  try {
    // Verificar se a API key é válida
    // Você pode armazenar as API keys no banco ou usar uma lista fixa
    const validApiKeys = process.env.MOBILE_API_KEYS?.split(',') || []
    
    if (!validApiKeys.includes(apiKey)) {
      return { error: 'API Key inválida', status: 401 }
    }

    return { success: true }
  } catch (error) {
    console.error('Erro na autenticação da API:', error)
    return { error: 'Erro interno do servidor', status: 500 }
  }
}

export async function authenticateUser(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return { error: 'Token de autorização requerido', status: 401 }
  }

  try {
    // Aqui você implementaria a validação do JWT
    // Por simplicidade, vou assumir que você está usando uma abordagem simples
    
    // Decodificar o token e verificar se é válido
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    
    return { success: true, userId: 'user-id' } // substitua pela lógica real
  } catch (error) {
    return { error: 'Token inválido', status: 401 }
  }
}
