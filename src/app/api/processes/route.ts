import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, executeWithRetry } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const tenantId = session.user.tenantId

    // Buscar processos com relacionamentos otimizados
    const processes = await executeWithRetry(async () => {
      return await (prisma as any).process.findMany({
        where: { tenantId },
        select: {
          id: true,
          numero: true,
          titulo: true,
          tipoServico: true,
          status: true,
          prioridade: true,
          valorTotal: true,
          valorTaxas: true,
          valorServico: true,
          statusPagamento: true,
          dataInicio: true,
          dataFinalizacao: true,
          prazoLegal: true,
          descricao: true,
          observacoes: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        veiculo: {
          select: {
            marca: true,
            modelo: true,
            placa: true,
            ano: true,
            cor: true
          }
        },
        responsavel: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limitar para melhor performance
    })
    })

    return NextResponse.json(processes)
    
  } catch (error) {
    console.error('Erro ao buscar processos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const tenantId = session.user.tenantId
    const body = await request.json()

    // Validar dados obrigatórios
    const { customerId, tipoServico, titulo, responsavelId } = body
    
    if (!customerId || !tipoServico || !titulo || !responsavelId) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Verificar se cliente existe no tenant
    const customer = await (prisma as any).customer.findFirst({
      where: {
        id: customerId,
        tenantId
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se responsável existe no tenant
    const responsavel = await (prisma as any).user.findFirst({
      where: {
        id: responsavelId,
        tenantId
      }
    })

    if (!responsavel) {
      return NextResponse.json(
        { error: 'Responsável não encontrado' },
        { status: 404 }
      )
    }

    // Gerar número sequencial para o processo
    const lastProcess = await (prisma as any).process.findFirst({
      where: { tenantId },
      orderBy: { numero: 'desc' }
    })

    let nextNumber = 1
    if (lastProcess) {
      const lastNumber = parseInt(lastProcess.numero.split('-').pop() || '0')
      nextNumber = lastNumber + 1
    }

    const numero = `PROC-${nextNumber.toString().padStart(3, '0')}`

    // Criar o processo
    const newProcess = await (prisma as any).process.create({
      data: {
        tenantId,
        numero,
        customerId,
        veiculoId: body.veiculoId || null,
        responsavelId,
        tipoServico,
        titulo,
        descricao: body.descricao || null,
        status: body.status || 'AGUARDANDO_DOCUMENTOS',
        prioridade: body.prioridade || 'MEDIA',
        valorTotal: body.valorTotal || 0,
        valorTaxas: body.valorTaxas || 0,
        valorServico: body.valorServico || 0,
        statusPagamento: body.statusPagamento || 'PENDENTE',
        prazoLegal: body.prazoLegal ? new Date(body.prazoLegal) : null,
        observacoes: body.observacoes || null,
        notasInternas: body.notasInternas || null
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        veiculo: {
          select: {
            marca: true,
            modelo: true,
            placa: true,
            ano: true,
            cor: true
          }
        },
        responsavel: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(newProcess, { status: 201 })
    
  } catch (error) {
    console.error('Erro ao criar processo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
