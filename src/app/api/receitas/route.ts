import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - List invoices
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    // Get tenant ID from database
    const tenant = await prisma.tenant.findFirst({
      orderBy: { createdAt: 'asc' }
    })
    
    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant não encontrado' },
        { status: 404 }
      )
    }

    // Build where clause
    const where: any = {
      tenantId: tenant.id
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    if (customerId) {
      where.customerId = customerId
    }

    // Fetch all invoices for stats (without filters)
    const allReceitas = await prisma.receita.findMany({
      where: { tenantId: tenant.id },
      orderBy: { dataVencimento: 'desc' }
    })

    // Fetch filtered invoices
    const receitas = await prisma.receita.findMany({
      where,
      orderBy: { dataVencimento: 'desc' }
    })

    // Calculate statistics
    const totalReceitas = allReceitas
      .filter(r => r.status === 'PAGO' || r.status === 'PAGA')
      .reduce((sum, r) => sum + r.valor, 0)
    
    const totalPendente = allReceitas
      .filter(r => r.status === 'PENDENTE' || r.status === 'VENCIDA' || r.status === 'VENCIDO')
      .reduce((sum, r) => sum + r.valor, 0)
    
    const faturasEmitidas = allReceitas.length
    
    const ticketMedio = allReceitas.length > 0 
      ? allReceitas.reduce((sum, r) => sum + r.valor, 0) / allReceitas.length 
      : 0
    
    const faturasVencidas = allReceitas.filter(r => r.status === 'VENCIDA' || r.status === 'VENCIDO').length

    return NextResponse.json({
      faturas: receitas,
      stats: {
        totalReceitas,
        totalPendente,
        faturasEmitidas,
        ticketMedio,
        faturasVencidas
      }
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar faturas' },
      { status: 500 }
    )
  }
}

// POST - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validation
    if (!data.customerId || !data.customerName) {
      return NextResponse.json(
        { error: 'Cliente é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.servico) {
      return NextResponse.json(
        { error: 'Serviço é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.descricao) {
      return NextResponse.json(
        { error: 'Descrição é obrigatória' },
        { status: 400 }
      )
    }

    if (!data.valor || data.valor <= 0) {
      return NextResponse.json(
        { error: 'Valor deve ser maior que zero' },
        { status: 400 }
      )
    }

    if (!data.dataVencimento) {
      return NextResponse.json(
        { error: 'Data de vencimento é obrigatória' },
        { status: 400 }
      )
    }

    // Get tenant ID from database
    const tenant = await prisma.tenant.findFirst({
      orderBy: { createdAt: 'asc' }
    })
    
    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant não encontrado' },
        { status: 404 }
      )
    }

    // Generate invoice number
    const lastReceita = await prisma.receita.findFirst({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' }
    })
    
    const nextNumber = lastReceita ? parseInt(lastReceita.numero.split('-')[1]) + 1 : 1
    const numero = `FAT-${String(nextNumber).padStart(3, '0')}`

    // Determine status based on dates
    const today = new Date()
    const vencimento = new Date(data.dataVencimento)
    let status = 'PENDENTE'
    
    if (vencimento < today) {
      status = 'VENCIDA'
    }

    // Create new invoice
    const newReceita = await prisma.receita.create({
      data: {
        tenantId: tenant.id,
        numero,
        customerId: data.customerId,
        customerName: data.customerName,
        processoId: data.processoId || null,
        servico: data.servico,
        descricao: data.descricao,
        valor: parseFloat(data.valor),
        dataEmissao: new Date(data.dataEmissao || Date.now()),
        dataVencimento: new Date(data.dataVencimento),
        dataPagamento: data.dataPagamento ? new Date(data.dataPagamento) : null,
        status,
        metodoPagamento: data.metodoPagamento || null,
        observacoes: data.observacoes || null,
      }
    })

    return NextResponse.json(newReceita, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { error: 'Erro ao criar fatura' },
      { status: 500 }
    )
  }
}

// PUT - Update invoice (for payment registration)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json(
        { error: 'ID da fatura é obrigatório' },
        { status: 400 }
      )
    }

    // Prepare update data
    const prismaUpdateData: any = {}
    
    if (updateData.dataPagamento !== undefined) {
      prismaUpdateData.dataPagamento = updateData.dataPagamento ? new Date(updateData.dataPagamento) : null
    }
    
    if (updateData.status) prismaUpdateData.status = updateData.status
    if (updateData.metodoPagamento) prismaUpdateData.metodoPagamento = updateData.metodoPagamento
    if (updateData.observacoes !== undefined) prismaUpdateData.observacoes = updateData.observacoes

    // Update invoice
    const updatedReceita = await prisma.receita.update({
      where: { id },
      data: prismaUpdateData
    })

    return NextResponse.json(updatedReceita)
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar fatura' },
      { status: 500 }
    )
  }
}

// DELETE - Delete invoice
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID da fatura é obrigatório' },
        { status: 400 }
      )
    }

    await prisma.receita.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Fatura removida com sucesso' })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { error: 'Erro ao remover fatura' },
      { status: 500 }
    )
  }
}
