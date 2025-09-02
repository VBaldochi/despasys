// API endpoint específico para mobile - Autenticação
import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-auth'
import * as bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Verificar API Key
    const authResult = await authenticateApiKey(request)
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    const { email, password, tenantDomain } = await request.json()

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

    // Gerar token simples (em produção, use JWT)
    const token = Buffer.from(`${user.id}:${user.tenantId}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  })
}
