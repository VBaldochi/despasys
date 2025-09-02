// API endpoint para listar processos - versão mobile
import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiKey, authenticateUser } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Verificar API Key
    const apiKeyResult = await authenticateApiKey(request)
    if (apiKeyResult.error) {
      return NextResponse.json(
        { error: apiKeyResult.error },
        { status: apiKeyResult.status }
      )
    }

    // Verificar autenticação do usuário
    const userResult = await authenticateUser(request)
    if (userResult.error) {
      return NextResponse.json(
        { error: userResult.error },
        { status: userResult.status }
      )
    }

    const tenantDomain = request.headers.get('X-Tenant-ID')
    if (!tenantDomain) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    // Buscar processos do tenant
    const processes = await prisma.process.findMany({
      where: {
        tenant: {
          domain: tenantDomain
        }
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            cpfCnpj: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limitar para performance no mobile
    })

    const response = NextResponse.json({
      success: true,
      data: processes.map((process: any) => ({
        id: process.id,
        numero: process.numero,
        tipo: process.tipoServico,
        status: process.status,
        valor: process.valorTotal,
        dataVencimento: process.prazoLegal,
        descricao: process.descricao,
        cliente: process.customer,
        createdAt: process.createdAt,
        updatedAt: process.updatedAt
      }))
    })

    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, X-Tenant-ID')

    return response

  } catch (error) {
    console.error('Erro ao buscar processos:', error)
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, X-Tenant-ID',
    },
  })
}
