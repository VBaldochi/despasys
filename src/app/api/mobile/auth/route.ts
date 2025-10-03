// API endpoint específico para mobile - Autenticação
import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-auth'
import * as bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, tenantDomain } = await request.json()

    console.log('🔍 Mobile Auth - Dados recebidos:', { email, tenantDomain, hasPassword: !!password })

    if (!email || !password || !tenantDomain) {
      return NextResponse.json(
        { error: 'Email, senha e tenant são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findFirst({
      where: {
        email,
        tenant: {
          domain: tenantDomain
        }
      },
      include: {
        tenant: true
      }
    })

    if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Gerar token simples para mobile (formato compatível com validação)
    const timestamp = Date.now();
    const token = `mobile_${user.id}_${user.tenantId}_${timestamp}`;

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId, // Add tenantId directly to user object
        tenant: {
          id: user.tenant.id,
          name: user.tenant.name,
          domain: user.tenant.domain
        }
      },
      token
    })

    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key')

    return response

  } catch (error) {
    console.error('Erro na autenticação mobile:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Mobile Auth API - Use POST method for login',
    methods: ['POST']
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  })
}
