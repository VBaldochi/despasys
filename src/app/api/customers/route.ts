import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, executeWithRetry } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar clientes do tenant com campos específicos para melhor performance
    const customers = await executeWithRetry(async () => {
      return await (prisma as any).customer.findMany({
      where: {
        tenantId: session.user.tenantId
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpfCnpj: true,
        tipoCliente: true,
        cidade: true,
        estado: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limitar resultados para melhor performance
    })
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validações básicas
    if (!body.name || !body.email || !body.cpfCnpj) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, email, cpfCnpj' },
        { status: 400 }
      )
    }

        // Verificar se já existe cliente com mesmo CPF/CNPJ no tenant
    const existingCustomer = await (prisma as any).customer.findFirst({
      where: {
        cpfCnpj: body.cpfCnpj,
        tenantId: session.user.tenantId
      }
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'CPF/CNPJ já cadastrado neste tenant' },
        { status: 409 }
      )
    }

    const customer = await (prisma as any).customer.create({
      data: {
        tenantId: session.user.tenantId,
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        cpfCnpj: body.cpfCnpj,
        tipoCliente: body.tipoCliente || 'FISICO',
        endereco: body.endereco || '',
        cidade: body.cidade || '',
        estado: body.estado || 'SP',
        cep: body.cep || '',
        razaoSocial: body.tipoCliente === 'JURIDICO' ? body.name : null,
        nomeFantasia: body.nomeFantasia || null
      }
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
