import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - List cash flow entries
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
    const tipo = searchParams.get('tipo')
    const mes = searchParams.get('mes') // Format: YYYY-MM

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

    if (tipo && tipo !== 'ALL') {
      where.tipo = tipo
    }

    if (mes) {
      const startDate = new Date(`${mes}-01`)
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
      where.data = {
        gte: startDate,
        lte: endDate
      }
    }

    // Fetch filtered entries
    const lancamentos = await prisma.fluxoCaixa.findMany({
      where,
      orderBy: { data: 'desc' }
    })

    // Calculate statistics
    const hoje = new Date()
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
    
    const lancamentosDoMes = await prisma.fluxoCaixa.findMany({
      where: {
        tenantId: tenant.id,
        data: {
          gte: primeiroDiaMes,
          lte: ultimoDiaMes
        }
      }
    })
    
    const entradasMes = lancamentosDoMes
      .filter(l => l.tipo === 'ENTRADA')
      .reduce((sum, l) => sum + l.valor, 0)
    
    const saidasMes = lancamentosDoMes
      .filter(l => l.tipo === 'SAIDA')
      .reduce((sum, l) => sum + l.valor, 0)
    
    const saldoAtual = entradasMes - saidasMes

    // Total geral (all time)
    const allLancamentos = await prisma.fluxoCaixa.findMany({
      where: { tenantId: tenant.id }
    })
    
    const totalEntradas = allLancamentos
      .filter(l => l.tipo === 'ENTRADA')
      .reduce((sum, l) => sum + l.valor, 0)
    
    const totalSaidas = allLancamentos
      .filter(l => l.tipo === 'SAIDA')
      .reduce((sum, l) => sum + l.valor, 0)
    
    const saldoTotal = totalEntradas - totalSaidas

    return NextResponse.json({
      lancamentos,
      stats: {
        entradasMes,
        saidasMes,
        saldoAtual,
        totalEntradas,
        totalSaidas,
        saldoTotal,
        totalLancamentos: allLancamentos.length
      }
    })
  } catch (error) {
    console.error('Error fetching cash flow:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar lançamentos' },
      { status: 500 }
    )
  }
}

// POST - Create new cash flow entry
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
    if (!data.tipo || !['ENTRADA', 'SAIDA'].includes(data.tipo)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use ENTRADA ou SAIDA' },
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

    if (!data.data) {
      return NextResponse.json(
        { error: 'Data é obrigatória' },
        { status: 400 }
      )
    }

    if (!data.metodoPagamento) {
      return NextResponse.json(
        { error: 'Método de pagamento é obrigatório' },
        { status: 400 }
      )
    }

    if (data.tipo === 'ENTRADA' && !data.origem) {
      return NextResponse.json(
        { error: 'Origem é obrigatória para entradas' },
        { status: 400 }
      )
    }

    if (data.tipo === 'SAIDA' && !data.destino) {
      return NextResponse.json(
        { error: 'Destino é obrigatório para saídas' },
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

    // Create new entry
    const newLancamento = await prisma.fluxoCaixa.create({
      data: {
        tenantId: tenant.id,
        tipo: data.tipo,
        descricao: data.descricao,
        categoria: data.categoria,
        origem: data.origem || null,
        destino: data.destino || null,
        valor: parseFloat(data.valor),
        data: new Date(data.data),
        metodoPagamento: data.metodoPagamento,
        observacoes: data.observacoes || null,
      }
    })

    return NextResponse.json(newLancamento, { status: 201 })
  } catch (error) {
    console.error('Error creating cash flow entry:', error)
    return NextResponse.json(
      { error: 'Erro ao criar lançamento' },
      { status: 500 }
    )
  }
}

// PUT - Update cash flow entry
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
        { error: 'ID do lançamento é obrigatório' },
        { status: 400 }
      )
    }

    // Prepare update data
    const prismaUpdateData: any = {}
    
    if (updateData.tipo) prismaUpdateData.tipo = updateData.tipo
    if (updateData.descricao) prismaUpdateData.descricao = updateData.descricao
    if (updateData.categoria) prismaUpdateData.categoria = updateData.categoria
    if (updateData.origem !== undefined) prismaUpdateData.origem = updateData.origem
    if (updateData.destino !== undefined) prismaUpdateData.destino = updateData.destino
    if (updateData.valor) prismaUpdateData.valor = parseFloat(updateData.valor)
    if (updateData.data) prismaUpdateData.data = new Date(updateData.data)
    if (updateData.metodoPagamento) prismaUpdateData.metodoPagamento = updateData.metodoPagamento
    if (updateData.observacoes !== undefined) prismaUpdateData.observacoes = updateData.observacoes

    // Update entry
    const updatedLancamento = await prisma.fluxoCaixa.update({
      where: { id },
      data: prismaUpdateData
    })

    return NextResponse.json(updatedLancamento)
  } catch (error) {
    console.error('Error updating cash flow entry:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar lançamento' },
      { status: 500 }
    )
  }
}

// DELETE - Delete cash flow entry
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
        { error: 'ID do lançamento é obrigatório' },
        { status: 400 }
      )
    }

    await prisma.fluxoCaixa.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Lançamento removido com sucesso' })
  } catch (error) {
    console.error('Error deleting cash flow entry:', error)
    return NextResponse.json(
      { error: 'Erro ao remover lançamento' },
      { status: 500 }
    )
  }
}
