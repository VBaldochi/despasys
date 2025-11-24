import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - List expenses
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
    const tipoDespesa = searchParams.get('tipoDespesa')

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

    if (tipoDespesa && tipoDespesa !== 'ALL') {
      where.tipoDespesa = tipoDespesa
    }

    // Fetch all expenses for stats (without filters)
    const allDespesas = await prisma.despesa.findMany({
      where: { tenantId: tenant.id },
      orderBy: { dataVencimento: 'desc' }
    })

    // Fetch filtered expenses
    const despesas = await prisma.despesa.findMany({
      where,
      orderBy: { dataVencimento: 'desc' }
    })

    // Calculate statistics
    const hoje = new Date()
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
    
    const despesasDoMes = allDespesas.filter(d => {
      const vencimento = new Date(d.dataVencimento)
      return vencimento >= primeiroDiaMes && vencimento <= ultimoDiaMes
    })
    
    const totalDespesas = allDespesas.reduce((sum, d) => sum + d.valor, 0)
    
    const emDia = despesasDoMes
      .filter(d => d.status === 'PAGO' || d.status === 'PAGA')
      .reduce((sum, d) => sum + d.valor, 0)
    
    const vencendo = despesasDoMes
      .filter(d => {
        if (d.status === 'PAGO' || d.status === 'PAGA' || d.status === 'VENCIDA' || d.status === 'VENCIDO') return false
        const vencimento = new Date(d.dataVencimento)
        const diasAteVencimento = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
        return diasAteVencimento >= 0 && diasAteVencimento <= 7
      })
      .reduce((sum, d) => sum + d.valor, 0)
    
    const vencidas = despesasDoMes
      .filter(d => d.status === 'VENCIDA' || d.status === 'VENCIDO')
      .reduce((sum, d) => sum + d.valor, 0)

    // Category breakdown
    const porCategoria = {
      FIXA: allDespesas.filter(d => d.tipoDespesa === 'FIXA').reduce((sum, d) => sum + d.valor, 0),
      VARIAVEL: allDespesas.filter(d => d.tipoDespesa === 'VARIAVEL').reduce((sum, d) => sum + d.valor, 0),
      OPERACIONAL: allDespesas.filter(d => d.tipoDespesa === 'OPERACIONAL').reduce((sum, d) => sum + d.valor, 0),
      IMPOSTO: allDespesas.filter(d => d.tipoDespesa === 'IMPOSTO').reduce((sum, d) => sum + d.valor, 0)
    }

    return NextResponse.json({
      despesas,
      stats: {
        totalDespesas,
        emDia,
        vencendo,
        vencidas,
        porCategoria
      }
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar despesas' },
      { status: 500 }
    )
  }
}

// POST - Create new expense
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
    if (!data.fornecedor) {
      return NextResponse.json(
        { error: 'Fornecedor é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.descricao) {
      return NextResponse.json(
        { error: 'Descrição é obrigatória' },
        { status: 400 }
      )
    }

    if (!data.categoria) {
      return NextResponse.json(
        { error: 'Categoria é obrigatória' },
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

    if (data.recorrente && !data.periodicidade) {
      return NextResponse.json(
        { error: 'Periodicidade é obrigatória para despesas recorrentes' },
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

    // Determine status based on dates
    const today = new Date()
    const vencimento = new Date(data.dataVencimento)
    let status = 'EM_ABERTO'
    
    if (vencimento < today) {
      status = 'VENCIDA'
    }

    // Create new expense
    const newDespesa = await prisma.despesa.create({
      data: {
        tenantId: tenant.id,
        fornecedor: data.fornecedor,
        descricao: data.descricao,
        categoria: data.categoria,
        tipoDespesa: data.tipoDespesa,
        valor: parseFloat(data.valor),
        dataEmissao: new Date(data.dataEmissao || Date.now()),
        dataVencimento: new Date(data.dataVencimento),
        dataPagamento: data.dataPagamento ? new Date(data.dataPagamento) : null,
        status,
        recorrente: data.recorrente || false,
        periodicidade: data.periodicidade || null,
        formaPagamento: data.formaPagamento || '',
        observacoes: data.observacoes || null,
      }
    })

    return NextResponse.json(newDespesa, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Erro ao criar despesa' },
      { status: 500 }
    )
  }
}

// PUT - Update expense (for payment registration)
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
        { error: 'ID da despesa é obrigatório' },
        { status: 400 }
      )
    }

    // Prepare update data
    const prismaUpdateData: any = {}
    
    if (updateData.dataPagamento !== undefined) {
      prismaUpdateData.dataPagamento = updateData.dataPagamento ? new Date(updateData.dataPagamento) : null
    }
    
    if (updateData.status) prismaUpdateData.status = updateData.status
    if (updateData.formaPagamento) prismaUpdateData.formaPagamento = updateData.formaPagamento
    if (updateData.observacoes !== undefined) prismaUpdateData.observacoes = updateData.observacoes

    // Update expense
    const updatedDespesa = await prisma.despesa.update({
      where: { id },
      data: prismaUpdateData
    })

    return NextResponse.json(updatedDespesa)
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar despesa' },
      { status: 500 }
    )
  }
}

// DELETE - Delete expense
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
        { error: 'ID da despesa é obrigatório' },
        { status: 400 }
      )
    }

    await prisma.despesa.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Despesa removida com sucesso' })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { error: 'Erro ao remover despesa' },
      { status: 500 }
    )
  }
}
